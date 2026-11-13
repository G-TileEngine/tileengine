import type { Fit } from "./types.ts";

export function backingSize(cssW: number, cssH: number, dpr: number, exact?: { readonly w: number; readonly h: number }): { w: number; h: number } {
  return exact ?? { w: Math.round(cssW * dpr), h: Math.round(cssH * dpr) };
}

export function fitView(devW: number, devH: number, s: number, tileW: number, tileH: number): Fit {
  const scale = Math.max(1, Math.trunc(s));
  const artW = Math.floor(devW / scale);
  const artH = Math.floor(devH / scale);
  return {
    s: scale, devW, devH, artW, artH, padX: Math.floor((devW - artW * scale) / 2),
    padY: Math.floor((devH - artH * scale) / 2),
    tilesW: Math.floor(artW / tileW),
    tilesH: Math.floor(artH / tileH),
  };
}

export function scaleRange(devW: number, devH: number, mapW: number, mapH: number, zoomMax = 6): { sMin: number; sMax: number } {
  const sMin = Math.min(zoomMax, Math.max(1, Math.ceil(Math.min(devW / mapW, devH / mapH))));
  return { sMin, sMax: zoomMax };
}

export function snapScale(z: number, range: { readonly sMin: number; readonly sMax: number }): number {
  return Math.min(range.sMax, Math.max(range.sMin, Math.round(z)));
}
