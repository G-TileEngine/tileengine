import { PALETTE, ramp, rgb, type Rgb } from "./palette.ts";

export type Tile = 32 | 48;
export type Grid = { readonly w: number; readonly h: number; readonly mat: (string | null)[]; readonly step: number[] };
export type Sprite = { readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly mat: readonly (string | null)[]; readonly step: readonly number[] };

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
  return { w, h, foot: [Math.floor(w / 2 + 0.5), h - 1], mat, step };
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
        if (nb === null) continue;
        out[i] = nb;
        break;
      }
    }
  }
  return out;
}

function outlineRgb(name: string): Rgb {
  const listed = PALETTE.outlineBy[name];
  if (listed !== undefined) return rgb(listed);
  const dark = ramp(name)[0] ?? [0, 0, 0];
  const mix = rgb(PALETTE.outline.colour);
  const ch = (i: number): number => {
    const c = dark[i] ?? 0;
    return Math.trunc(c * PALETTE.outline.rampWeight + (mix[i] ?? 0) * PALETTE.outline.colourWeight);
  };
  return [ch(0), ch(1), ch(2)];
}

export function colourise(s: Sprite): Uint8Array {
  const rgba = new Uint8Array(s.w * s.h * 4);
  const edge = outlineOf(s);
  for (let i = 0; i < s.mat.length; i++) {
    const m = s.mat[i] ?? null;
    const name = m ?? edge[i] ?? null;
    if (name === null) continue;
    const c = m !== null ? ramp(m)[s.step[i] ?? 0] ?? [0, 0, 0] : outlineRgb(name);
    rgba.set([c[0] ?? 0, c[1] ?? 0, c[2] ?? 0, 255], i * 4);
  }
  return rgba;
}
