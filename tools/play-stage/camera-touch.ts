import { clampCamera, easeCamera, fitView, snapScale, type Fit } from "../../src/runtime/render/index.ts";
import { MIN_CELL_CSS, TILE } from "./board.ts";

export type PlayCam = { x: number; y: number; s: number; follow: string | null };
const dprOf = (dpr: number): number => (Number.isFinite(dpr) && dpr > 0 ? dpr : 1);
/** Smallest integer scale whose cell is at least MIN_CELL_CSS at this device pixel ratio. */
export const floorS = (dpr: number): number => Math.max(1, Math.ceil((MIN_CELL_CSS * dprOf(dpr)) / TILE));
export const createCam = (s: number): PlayCam => ({ x: 0, y: 0, s, follow: null });
export const pan = (cam: PlayCam, dx: number, dy: number): void => { cam.follow = null; cam.x += dx; cam.y += dy; };
export const follow = (cam: PlayCam, id: string): void => { cam.follow = id; };
export const seatCam = (cam: PlayCam, boxS: number, dpr: number): void => { cam.s = Math.max(boxS, floorS(dpr)); };
export function zoomAt(cam: PlayCam, z: number, devW: number, devH: number, mapW: number, mapH: number, px: number, py: number, dpr = 1): void {
  const lo = floorS(dpr), hi = Math.max(lo, Math.ceil(6 * dprOf(dpr))), next = snapScale(z, { sMin: lo, sMax: hi }), prev = cam.s > 0 ? cam.s : 1;
  cam.x += px / prev; cam.y += py / prev; cam.s = next; cam.x -= px / next; cam.y -= py / next;
  const fit = fitView(devW, devH, next, TILE, TILE), held = clampCamera(cam.x, cam.y, fit, mapW, mapH); cam.x = held.x; cam.y = held.y;
}
export const centreOn = (cam: PlayCam, at: { readonly c: number; readonly r: number }, fit: Fit, ox: number, tile: number, oy: number): void => { cam.x = ox + (at.c + 0.5) * tile - fit.artW / 2; cam.y = oy + (at.r + 0.5) * tile - fit.artH / 2; };
export const clamp = (cam: PlayCam, fit: Fit, cols: number, rows: number): void => { const held = clampCamera(cam.x, cam.y, fit, cols * TILE, rows * TILE); cam.x = held.x; cam.y = held.y; };
/** Ease toward the followed cell. 180 ms is the banner-scale hold, not a hidden engine rule. */
export const tickCam = (cam: PlayCam, dt: number, at: { readonly c: number; readonly r: number }, fit: Fit): void => {
  if (cam.follow === null) return;
  cam.x = easeCamera(cam.x, (at.c + 0.5) * TILE - fit.artW / 2, dt, 180);
  cam.y = easeCamera(cam.y, (at.r + 0.5) * TILE - fit.artH / 2, dt, 180);
};
