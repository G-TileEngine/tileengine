import { clampCamera, easeCamera, fitView, snapScale,          } from "../../src/runtime/render/index.js";
import { MIN_CELL_CSS, TILE } from "./board.js";

                                                                                 
const dprOf = (dpr        )         => (Number.isFinite(dpr) && dpr > 0 ? dpr : 1);
/** Smallest integer scale whose cell is at least MIN_CELL_CSS at this device pixel ratio. */
export const floorS = (dpr        )         => Math.max(1, Math.ceil((MIN_CELL_CSS * dprOf(dpr)) / TILE));
export const createCam = (s        )          => ({ x: 0, y: 0, s, follow: null });
export const pan = (cam         , dx        , dy        )       => { cam.follow = null; cam.x += dx; cam.y += dy; };
export const follow = (cam         , id        )       => { cam.follow = id; };
export const seatCam = (cam         , boxS        , dpr        )       => { cam.s = Math.max(boxS, floorS(dpr)); };
export function zoomAt(cam         , z        , devW        , devH        , mapW        , mapH        , px        , py        , dpr = 1)       {
  const lo = floorS(dpr), hi = Math.max(lo, Math.ceil(6 * dprOf(dpr))), next = snapScale(z, { sMin: lo, sMax: hi }), prev = cam.s > 0 ? cam.s : 1;
  cam.x += px / prev; cam.y += py / prev; cam.s = next; cam.x -= px / next; cam.y -= py / next;
  const fit = fitView(devW, devH, next, TILE, TILE), held = clampCamera(cam.x, cam.y, fit, mapW, mapH); cam.x = held.x; cam.y = held.y;
}
export const centreOn = (cam         , at                                            , fit     , ox        , tile        , oy        )       => { cam.x = ox + (at.c + 0.5) * tile - fit.artW / 2; cam.y = oy + (at.r + 0.5) * tile - fit.artH / 2; };
export const clamp = (cam         , fit     , cols        , rows        )       => { const held = clampCamera(cam.x, cam.y, fit, cols * TILE, rows * TILE); cam.x = held.x; cam.y = held.y; };
/** Ease toward the followed cell. 180 ms is the banner-scale hold, not a hidden engine rule. */
export const tickCam = (cam         , dt        , at                                            , fit     )       => {
  if (cam.follow === null) return;
  cam.x = easeCamera(cam.x, (at.c + 0.5) * TILE - fit.artW / 2, dt, 180);
  cam.y = easeCamera(cam.y, (at.r + 0.5) * TILE - fit.artH / 2, dt, 180);
};
