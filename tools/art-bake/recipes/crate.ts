import { newGrid, put, type Grid, type Tile } from "../sprite.ts";

function lidStep(tile: Tile, w: number, ht: number, b: number, x: number, y: number): number {
  const frame = y < b || x < b || x >= w - b || y >= ht - b;
  if (frame) return y < b || x < b || y >= ht - b ? 5 : 4;
  let st = 3;
  if (y === b || x === b) st = 2;
  const ix = x - b;
  const iy = y - b;
  const dd = iy - ix * ((ht - 2 * b) / (w - 2 * b));
  if (-b <= dd && dd < 0.4) return 4;
  if (0.4 <= dd && dd < 1.4) return 2;
  if (iy % (tile === 48 ? 4 : 3) === 3 && st === 3) return 2;
  return st;
}

function frontStep(tile: Tile, w: number, hf: number, b: number, x: number, fy: number): number {
  if (fy === 0) return 0;
  const frame = fy <= b || x < b || x >= w - b || fy >= hf - b;
  let st = frame ? (x < b ? 4 : x >= w - b ? 2 : fy >= hf - b ? 1 : 3) : 1;
  if (!frame) {
    const ix = (x - b) / (w - 2 * b - 1);
    const iy = (fy - b - 1) / (hf - 2 * b - 2);
    const band = (tile === 48 ? 2.2 : 1.6) / (w - 2 * b);
    if ((fy - b) % (tile === 48 ? 5 : 4) === 0) st = 0;
    for (const d of [ix - iy, ix - (1 - iy)]) {
      if (Math.abs(d) < band * 0.75) st = 3;
      else if (band * 0.75 <= d && d < band * 1.5 && st !== 3) st = 0;
    }
  }
  if (x >= w - 3 * b - (tile === 48 ? 1 : 0) && !(x >= w - b)) st -= 1;
  return st;
}

export function crate(tile: Tile): Grid {
  const b = tile === 48 ? 2 : 1;
  const w = tile === 48 ? 25 : 17;
  const ht = tile === 48 ? 17 : 11;
  const hf = tile === 48 ? 21 : 14;
  const g = newGrid(w, ht + hf, "crate");
  for (let y = 0; y < ht; y++) {
    for (let x = 0; x < w; x++) put(g, x, y, "crate", lidStep(tile, w, ht, b, x, y));
  }
  for (let y = ht; y < ht + hf; y++) {
    for (let x = 0; x < w; x++) put(g, x, y, "crate", frontStep(tile, w, hf, b, x, y - ht));
  }
  if (tile === 48) {
    for (const [y, x] of [[ht + 2, 1], [ht + 2, w - 2], [ht + hf - 2, 1], [ht + hf - 2, w - 2], [1, 1], [1, w - 2]] as const) put(g, x, y, "steel8", x < w / 2 ? 5 : 3);
  }
  return g;
}
