import type { Cam, Fit } from "./types.ts";

/** Half up, and `+ 0` kills a negative zero. */
export const px = (v: number): number => Math.floor(v + 0.5) + 0;

export function clampCamera(x: number, y: number, fit: Fit, mapW: number, mapH: number): { x: number; y: number } {
  const axis = (v: number, map: number, art: number): number => (map <= art ? (map - art) / 2 : Math.min(map - art, Math.max(0, v)));
  return { x: axis(x, mapW, fit.artW), y: axis(y, mapH, fit.artH) };
}

export function snapCamera(x: number, y: number, s: number): Cam {
  return {
    x, y,
    devX: px(x * s), devY: px(y * s),
  };
}

export function easeCamera(from: number, to: number, elapsedMs: number, easeMs: number): number {
  if (easeMs <= 0 || elapsedMs >= easeMs) return to;
  const t = Math.min(1, Math.max(0, elapsedMs / easeMs));
  const u = t * t * (3 - 2 * t);
  return from + (to - from) * u;
}

export function toDevice(artX: number, artY: number, cam: Cam, fit: Fit): { x: number; y: number } {
  return { x: px(artX) * fit.s - cam.devX + fit.padX, y: px(artY) * fit.s - cam.devY + fit.padY };
}
