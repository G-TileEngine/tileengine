import type { Pixels } from "./bakes.ts";
export const FX_LIGHT = { radiusMin: 0.5, radiusMax: 6, radiusDefault: 2, perEffect: 2, onScreen: 4, replanMs: 100, flashShare: 0.25, flashTilePx: 64, screenW: 390, screenH: 844, colour: "#ffb048" } as const;
export type Ramps = Readonly<Record<string, readonly string[]>>;
export type LightMode = "off" | "steady" | "pop";
export type HitWhiteMode = "white" | "tint" | "black" | "bright";
export type LitStep = { readonly at: number; readonly ms?: number; readonly light_mode?: string; readonly light?: string; readonly light_radius?: unknown; readonly light_ramp?: string; readonly tint_ramp?: string; readonly tint_snap?: string };
const rgb = (hex: string): [number, number, number] | null => { const m = /^#([0-9a-f]{6})$/i.exec(hex); if (m === null || m[1] === undefined) return null; const n = Number.parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const half = (v: number): number => Math.ceil(v * 2 - 1e-6) / 2;
export const lightMode = (step: LitStep): LightMode => { const named = step.light_mode !== undefined ? step.light_mode : step.light; return named === "steady" || named === "pop" ? named : "off"; };
export function lightRadius(stored: unknown): { tiles: number; bad: boolean } {
  if (stored === undefined) return { tiles: FX_LIGHT.radiusDefault, bad: false };
  if (typeof stored !== "number" || !Number.isFinite(stored)) return { tiles: FX_LIGHT.radiusDefault, bad: true };
  const snapped = Math.round(stored * 2) / 2, tiles = Math.min(FX_LIGHT.radiusMax, Math.max(FX_LIGHT.radiusMin, snapped));
  return { tiles, bad: stored < FX_LIGHT.radiusMin || stored > FX_LIGHT.radiusMax }; // out of 0.5–6 is clamped and flagged (Ruling 4)
}
export const litTiles = (mode: LightMode, tiles: number, tMs: number, at: number, ms: number): number => {
  if (mode === "off" || !(ms > 0) || tMs < at || tMs >= at + ms) return 0;
  if (mode === "steady") return tiles;
  const e = tMs - at; return e < ms / 3 ? tiles : e < (ms * 2) / 3 ? half((tiles * 2) / 3) : half(tiles / 3);
};
export function rampOf(keys: readonly (string | undefined)[], ramps: Ramps | undefined): { ramp: readonly string[] | null; missing: string[] } {
  const missing: string[] = []; let ramp: readonly string[] | null = null;
  for (const key of keys) { if (key === undefined) continue; const got = ramps?.[key]; if (got === undefined) missing.push(key); else { ramp = got; break; } } // the first key the host has wins; later keys are never tried (Ruling 1)
  return { ramp, missing };
}
export const lightColour = (step: LitStep, fxRamp: string | undefined, ramps: Ramps | undefined): { colour: string; missing: string[] } => { const found = rampOf([step.light_ramp, step.tint_ramp, fxRamp], ramps), top = found.ramp?.[found.ramp.length - 1]; return { colour: top ?? FX_LIGHT.colour, missing: found.missing }; };
export function snapToRamp(hex: string, step: LitStep, fxRamp: string | undefined, ramps: Ramps | undefined): string {
  if (step.tint_snap !== "ramp") return hex;
  const picked = rampOf([step.tint_ramp, fxRamp], ramps).ramp, pool = picked ?? Object.values(ramps ?? {}).flat(), src = rgb(hex);
  if (src === null || pool.length === 0) return hex;
  let best = hex, dist = Infinity;
  for (const item of pool) { const c = rgb(item); if (c === null) continue; const d = (c[0] - src[0]) ** 2 + (c[1] - src[1]) ** 2 + (c[2] - src[2]) ** 2; if (d < dist) { dist = d; best = item; } }
  return best;
}
export const hitWhiteMode = (stored: unknown): HitWhiteMode => (stored === "white" || stored === "tint" || stored === "black" || stored === "bright" ? stored : "white");
export const cuesSuppressed = (hitWhiteMs: unknown): boolean => typeof hitWhiteMs === "number" && hitWhiteMs > 0;
export function brightPixels(img: Pixels, ramps: Ramps | undefined): Pixels {
  const data = new Uint8ClampedArray(img.data);
  for (let i = 0; i < data.length; i += 4) {
    if ((data[i + 3] ?? 0) === 0) continue;
    const r = data[i] ?? 0, g = data[i + 1] ?? 0, b = data[i + 2] ?? 0; let ramp: readonly string[] | undefined, at = -1;
    for (const row of Object.values(ramps ?? {})) { for (let s = 0; s < row.length; s += 1) { const c = rgb(row[s] ?? ""); if (c !== null && c[0] === r && c[1] === g && c[2] === b) { ramp = row; at = s; break; } } if (ramp !== undefined) break; }
    const c = rgb(ramp === undefined ? "#ffffff" : ramp[Math.min(ramp.length - 1, at + 2)] ?? "#ffffff") ?? [255, 255, 255];
    data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2];
  }
  return { w: img.w, h: img.h, data };
}
export const popIsFlash = (tiles: number, tilePx: number): boolean => (Math.PI * (tiles * tilePx) ** 2) / (FX_LIGHT.screenW * FX_LIGHT.screenH) >= FX_LIGHT.flashShare;
export const popFlashStarts = (steps: readonly LitStep[], tilePx: number, startMs = 0): number[] => steps.flatMap((step) => (lightMode(step) === "pop" && popIsFlash(lightRadius(step.light_radius).tiles, tilePx) ? [startMs + step.at] : []));
