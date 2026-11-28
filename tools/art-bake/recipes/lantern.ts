import { canvasSprite, newCanvas, rect, type Sprite, type Tile } from "../sprite.ts";

const SCALE = 1.25;

export function lantern(tile: Tile): Sprite {
  const k = (tile / 32) * SCALE;
  const c = newCanvas(10, 26, 5, 24, k);
  rect(c, 4, 7, 6, 24, "iron", (_x, _y, nx) => 0.7 - 0.5 * nx);
  rect(c, 3, 22.5, 7, 24, "iron", 0.4);
  rect(c, 2.2, 2.5, 7.8, 8.5, "iron", 0.35);
  rect(c, 3, 3.5, 7, 8, "glow", (_x, _y, _nx, ny) => 1 - 0.5 * ny, true);
  rect(c, 1.8, 1.2, 8.2, 2.8, "iron", 0.6);
  return canvasSprite(c);
}
