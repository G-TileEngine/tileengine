import { band, roundEven } from "./blocks.ts";
import { PALETTE, ramp, rgb, stepOf, type Rgb } from "./palette.ts";

export type Tile = 32 | 48;
export type Grid = { readonly w: number; readonly h: number; readonly mat: (string | null)[]; readonly step: number[] };
export type Sprite = { readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly mat: readonly (string | null)[]; readonly step: readonly number[]; readonly sh: readonly number[]; readonly nolin: readonly boolean[] };
export type Canvas = { readonly w: number; readonly h: number; readonly k: number; readonly ax: number; readonly ay: number; readonly mat: (string | null)[]; readonly sh: number[]; readonly nolin: boolean[] };
export type Shade = number | ((x: number, y: number, nx: number, ny: number) => number);

export function newGrid(w: number, h: number, mat: string | null): Grid {
  const n = w * h;
  return { w, h, mat: Array.from({ length: n }, () => mat), step: Array.from({ length: n }, () => 0) };
}

export function put(grid: Grid, x: number, y: number, mat: string | null, step: number): void {
  const i = y * grid.w + x;
  grid.mat[i] = mat;
  grid.step[i] = step;
}

export function gridSprite(grid: Grid): Sprite {
  const w = grid.w + 2;
  const h = grid.h + 2;
  const mat: (string | null)[] = Array.from({ length: w * h }, () => null);
  const step: number[] = Array.from({ length: w * h }, () => 0);
  const sh: number[] = Array.from({ length: w * h }, () => 0);
  const nolin: boolean[] = Array.from({ length: w * h }, () => false);
  for (let y = 0; y < grid.h; y++) {
    for (let x = 0; x < grid.w; x++) {
      const m = grid.mat[y * grid.w + x] ?? null;
      if (m === null) continue;
      const top = ramp(m).length - 1;
      const i = (y + 1) * w + x + 1;
      mat[i] = m;
      step[i] = Math.min(Math.max(grid.step[y * grid.w + x] ?? 0, 0), top);
    }
  }
  return { w, h, foot: [Math.floor(w / 2 + 0.5), h - 1], mat, step, sh, nolin };
}

export function outlineOf(s: Sprite): (string | null)[] {
  const out: (string | null)[] = Array.from({ length: s.mat.length }, () => null);
  for (let y = 0; y < s.h; y++) {
    for (let x = 0; x < s.w; x++) {
      const i = y * s.w + x;
      if ((s.mat[i] ?? null) !== null) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h) continue;
        const nb = s.mat[ny * s.w + nx] ?? null;
        if (nb === null || s.nolin[ny * s.w + nx] === true) continue;
        out[i] = nb;
        break;
      }
    }
  }
  return out;
}

function at<T>(list: readonly T[], i: number): T {
  const v = list[i];
  if (v === undefined) {
    throw new Error(`art-bake: pixel ${i} is outside the sprite`);
  }
  return v;
}
function outlineRgb(name: string): Rgb {
  const listed = PALETTE.outlineBy[name];
  if (listed !== undefined) return rgb(listed);
  const dark = stepOf(name, 0);
  const mix = rgb(PALETTE.outline.colour);
  const ch = (i: 0 | 1 | 2): number => Math.trunc(dark[i] * PALETTE.outline.rampWeight + (mix[i] ?? 0) * PALETTE.outline.colourWeight);
  return [ch(0), ch(1), ch(2)];
}

function rimAt(s: Sprite, i: number): boolean {
  const up = i >= s.w && at(s.mat, i - s.w) !== null;
  const left = i % s.w > 0 && s.mat[i - 1] !== null;
  return s.nolin[i] !== true && (!up || !left);
}
function pixelRgb(s: Sprite, i: number, m: string | null, name: string): Rgb {
  if (m === null) {
    return outlineRgb(name);
  }
  const step = s.step[i] ?? 0;
  if (step >= 0) {
    return stepOf(m, step);
  }
  const t = Math.fround(at(s.sh, i) + Math.fround(PALETTE.bias[m] ?? 0)) + (rimAt(s, i) ? PALETTE.rim : 0);
  return stepOf(m, band(t, ramp(m).length));
}

export function colourise(s: Sprite): Uint8Array {
  const rgba = new Uint8Array(s.w * s.h * 4);
  const edge = outlineOf(s);
  for (let i = 0; i < s.mat.length; i++) {
    const m = s.mat[i] ?? null;
    const name = m ?? edge[i] ?? null;
    if (name === null) continue;
    const c = pixelRgb(s, i, m, name);
    rgba.set([c[0], c[1], c[2], 255], i * 4);
  }
  return rgba;
}

export function newCanvas(w: number, h: number, ax: number, ay: number, k: number): Canvas {
  const cw = roundEven(w * k);
  const ch = roundEven(h * k);
  const n = cw * ch;
  return { w: cw, h: ch, k, ax, ay, mat: Array.from({ length: n }, () => null), sh: Array.from({ length: n }, () => 0), nolin: Array.from({ length: n }, () => false) };
}

function fill(c: Canvas, i: number, mat: string, f: Shade, nol: boolean, x: number, y: number, nx: number, ny: number): void {
  const raw = typeof f === "function" ? f(x, y, nx, ny) : f;
  c.mat[i] = mat;
  c.sh[i] = Math.min(Math.max(Math.fround(raw), 0), 1);
  c.nolin[i] = nol;
}

export function ellipse(c: Canvas, cx: number, cy: number, rx: number, ry: number, mat: string, f: Shade, nol = false): void {
  for (let i = 0; i < c.mat.length; i++) {
    const x = (i % c.w + 0.5) / c.k;
    const y = (Math.floor(i / c.w) + 0.5) / c.k;
    const nx = (x - cx) / rx;
    const ny = (y - cy) / ry;
    if (nx * nx + ny * ny > 1.0) continue;
    fill(c, i, mat, f, nol, x, y, nx, ny);
  }
}

export function rect(c: Canvas, x0: number, y0: number, x1: number, y1: number, mat: string, f: Shade, nol = false): void {
  for (let i = 0; i < c.mat.length; i++) {
    const x = (i % c.w + 0.5) / c.k;
    const y = (Math.floor(i / c.w) + 0.5) / c.k;
    if (x < x0 || x >= x1 || y < y0 || y >= y1) continue;
    const nx = (x - x0) / Math.max(x1 - x0, 1e-6);
    const ny = (y - y0) / Math.max(y1 - y0, 1e-6);
    fill(c, i, mat, f, nol, x, y, nx, ny);
  }
}

export function canvasSprite(c: Canvas): Sprite {
  return { w: c.w, h: c.h, foot: [Math.floor(c.ax * c.k + 0.5), Math.floor(c.ay * c.k + 0.5)], mat: c.mat, step: Array.from({ length: c.mat.length }, () => -1), sh: c.sh, nolin: c.nolin };
}
