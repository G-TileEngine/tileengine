// Step ART1a sample 2: the B r6 barrel (b-r6/style_b6.py barrel_grid), an elliptical lid, curved staves and iron hoops.
import { newGrid, put, type Grid, type Tile } from "../sprite.ts";

const clip = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi);

// Python's round() on a float64 rounds half to even.
function roundEven(v: number): number {
  const f = Math.floor(v);
  if (v - f !== 0.5) return Math.round(v);
  return f % 2 === 0 ? f : f + 1;
}

function lidStep(px: number, py: number, et: number, cx: number, yt: number, rxt: number, ryt: number, tile: Tile): number {
  if (Math.sqrt(et) > (tile === 48 ? 0.66 : 0.6)) return py > yt && px < cx + rxt * 0.5 ? 5 : px < cx + rxt * 0.45 ? 4 : 3;
  let st = py - yt < -ryt * 0.28 || px - cx < -rxt * 0.4 ? 2 : 3;
  if (tile === 48 && Math.abs(px - cx) % 4.0 < 0.9 && Math.abs(px - cx) > 0.5) st -= 1;
  return st;
}

export function barrel(tile: Tile): Grid {
  const [w, h, rxt, ryt, ryb, hoopw] = tile === 48 ? [21, 29, 8.6, 4.4, 3.4, 2] : [15, 20, 6.1, 3.1, 2.4, 1];
  const cx = w / 2;
  const bulge = w / 2 - 1 - rxt;
  const yt = ryt + 0.1;
  const yb = h - ryb - 0.1;
  const seams = [-60, -30, 0, 30, 60].map((d) => Math.sin(d * (Math.PI / 180)));
  const hoops = (tile === 32 ? [0.16, 0.78] : [0.14, 0.5, 0.82]).map((t) => yt + (yb - yt) * t);
  const g = newGrid(w, h, null);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const et = ((px - cx) / rxt) * ((px - cx) / rxt) + ((py - yt) / ryt) * ((py - yt) / ryt);
      if (et <= 1.0) {
        put(g, x, y, "barrel", lidStep(px, py, et, cx, yt, rxt, ryt, tile));
        continue;
      }
      const ww = rxt + bulge * Math.sin(Math.PI * clip((py - yt) / (yb - yt), 0, 1));
      const ryh = (ryt * ww) / rxt;
      const bx = (px - cx) / ww;
      const inBody = (py > yt && py <= yb && Math.abs(bx) <= 1.0) || (py > yb && bx * bx + ((py - yb) / ryb) * ((py - yb) / ryb) <= 1.0);
      let onHoop: boolean | null = null;
      for (const hy of hoops) {
        const nn = clip((px - cx) / (ww + 0.6), -1, 1);
        const yc = hy + ryh * Math.sqrt(1 - nn * nn);
        if (yc - hoopw / 2 <= py && py < yc + hoopw / 2 && Math.abs(px - cx) <= ww + 0.6) onHoop = py - (yc - hoopw / 2) < 1.0;
      }
      if (!inBody && onHoop === null) continue;
      const nx = clip(bx, -1, 1);
      const s = 0.5 + 0.5 * (-0.6 * nx + 0.8 * Math.sqrt(1 - nx * nx));
      if (onHoop !== null) {
        put(g, x, y, "steel8", clip(roundEven(0.4 + s * 3.2), 1, 4) + (onHoop ? 1 : 0));
        continue;
      }
      let st = clip(roundEven(s * 4.6 - 0.4), 1, 5);
      if (Math.min(...seams.map((m) => Math.abs(nx - m))) < 0.55 / ww) st -= 1;
      const ytop = yt + ryt * Math.sqrt(Math.max(0, 1 - ((px - cx) / rxt) * ((px - cx) / rxt)));
      if (py - ytop < 1.0) st -= 1;
      if (py > yb + ryb * Math.sqrt(Math.max(0, 1 - nx * nx)) - 1.6) st -= 1;
      put(g, x, y, "barrel", st);
    }
  }
  return g;
}
