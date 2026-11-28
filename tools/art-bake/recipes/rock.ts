import { hash2, sphere } from "../blocks.ts";
import { canvasSprite, ellipse, newCanvas, type Sprite, type Tile } from "../sprite.ts";

const SCALE = 1.3;

export function rock(tile: Tile, seed = 1, big = false): Sprite {
  const k = (tile / 32) * SCALE;
  const c = newCanvas(22, 16, 10, 13, k);
  const g = big ? 1.35 : 1.0;
  const shade = (x: number, y: number, nx: number, ny: number): number => {
    const facet = hash2(Math.floor(x / 2.5), Math.floor(y / 2.5), seed) - 0.5;
    return 0.15 + 0.75 * sphere(nx * 0.9, ny * 1.1) + 0.12 * facet;
  };
  ellipse(c, 10, 13 - 3.5 * g, 5.2 * g, 3.8 * g, "stone", shade);
  ellipse(c, 10 + 4.6 * g, 13 - 1.8 * g, 3.0 * g, 2.2 * g, "stone", shade);
  return canvasSprite(c);
}
