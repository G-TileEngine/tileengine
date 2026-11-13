import type { Pixels } from "./bakes.ts";

export const FOAM_PX = 2, SHALLOW_PX = 6, WAVE_GAP = 8, SHORE_MAX = 32;
export type ShoreColours = { readonly foam: number; readonly shallow: number; readonly wave: number };
export type ShoreOpts = { readonly foamPx: number; readonly shallowPx: number; readonly waveGap: number; readonly frames: number; readonly ms?: number };
export const SHORE_DEFAULTS: Required<ShoreOpts> = { foamPx: FOAM_PX, shallowPx: SHALLOW_PX, waveGap: WAVE_GAP, frames: 4, ms: 250 };

const noise = (x: number, y: number, seed: number): number => {
  const g = 4, gx = Math.floor(x / g), gy = Math.floor(y / g), fx = x / g - gx, fy = y / g - gy, h = (ix: number, iy: number): number => { let n = Math.imul(ix + seed * 13, 0x9e3779b1) ^ Math.imul(iy + seed * 7, 0x85ebca6b); n = Math.imul(n ^ (n >>> 16), 0x7feb352d); return (n >>> 0) % 3; };
  return Math.round(h(gx, gy) * (1 - fx) * (1 - fy) + h(gx + 1, gy) * fx * (1 - fy) + h(gx, gy + 1) * (1 - fx) * fy + h(gx + 1, gy + 1) * fx * fy);
};

export function shoreDistance(land: ArrayLike<number | boolean>, w: number, h: number, seed = 0, max = SHORE_MAX, foamPx = FOAM_PX): Uint8Array {
  if (land.length !== w * h) throw new RangeError("shoreDistance: land length");
  const n = w * h, cap = Math.max(0, max | 0), lim = cap * 3, d = new Int32Array(n), at = (x: number, y: number): number => d[y * w + x] ?? lim;
  for (let i = 0; i < n; i += 1) d[i] = land[i] ? 0 : lim;
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) { let v = at(x, y); if (x > 0) v = Math.min(v, at(x - 1, y) + 3); if (y > 0) v = Math.min(v, at(x, y - 1) + 3, x > 0 ? at(x - 1, y - 1) + 4 : v, x + 1 < w ? at(x + 1, y - 1) + 4 : v); d[y * w + x] = v; }
  for (let y = h - 1; y >= 0; y -= 1) for (let x = w - 1; x >= 0; x -= 1) { let v = at(x, y); if (x + 1 < w) v = Math.min(v, at(x + 1, y) + 3); if (y + 1 < h) v = Math.min(v, at(x, y + 1) + 3, x + 1 < w ? at(x + 1, y + 1) + 4 : v, x > 0 ? at(x - 1, y + 1) + 4 : v); d[y * w + x] = v; }
  const out = new Uint8Array(n);
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) { const i = y * w + x; let px = Math.min(cap, Math.round((d[i] ?? 0) / 3)); if (px > foamPx && px < cap) px = Math.min(cap, px + noise(x, y, seed | 0)); out[i] = px; }
  return out;
}
const ink = (n: number, data: Uint8ClampedArray, i: number): void => { data[i] = (n >> 16) & 255; data[i + 1] = (n >> 8) & 255; data[i + 2] = n & 255; data[i + 3] = 255; };

export function shoreFrames(dist: Uint8Array, w: number, h: number, colours: ShoreColours, opts: ShoreOpts = SHORE_DEFAULTS): Pixels[] {
  const frames = opts.frames, gap = opts.waveGap, step = Math.floor(gap / Math.max(1, frames)), out: Pixels[] = [];
  for (let f = 0; f < frames; f += 1) {
    const data = new Uint8ClampedArray(w * h * 4), foamTo = Math.max(1, opts.foamPx - (f % 2)), mark = gap > 0 ? ((gap - (f * step) % gap) % gap + gap) % gap : -1;
    for (let i = 0; i < w * h; i += 1) { const d = dist[i] ?? 0, o = i * 4; if (d === 0) continue; if (d <= opts.shallowPx) ink(colours.shallow, data, o); if (mark >= 0 && gap > 0 && d % gap === mark) ink(colours.wave, data, o); if (d <= foamTo) ink(colours.foam, data, o); }
    out.push({ w, h, data });
  }
  return out;
}
