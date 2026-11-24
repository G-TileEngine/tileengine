                                         
                                                                           
export const FX_LIGHT = { radiusMin: 0.5, radiusMax: 6, radiusDefault: 2, perEffect: 2, onScreen: 4, replanMs: 100, flashShare: 0.25, flashTilePx: 64, screenW: 390, screenH: 844, colour: "#ffb048" }         ;
                                                                
                                    
                             
                                                                                                                                                                                                                                                    
const rgb = (hex        )                                  => { const m = /^#([0-9a-f]{6})$/i.exec(hex); if (m === null || m[1] === undefined) return null; const n = Number.parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const half = (v        )         => Math.ceil(v * 2 - 1e-6) / 2;
export const lightMode = (step         )            => { const named = step.light_mode !== undefined ? step.light_mode : step.light; return named === "steady" || named === "pop" ? named : "off"; };
export function lightRadius(stored         )                                  {
  if (stored === undefined) return { tiles: FX_LIGHT.radiusDefault, bad: false };
  if (typeof stored !== "number" || !Number.isFinite(stored)) return { tiles: FX_LIGHT.radiusDefault, bad: true };
  const snapped = Math.round(stored * 2) / 2, tiles = Math.min(FX_LIGHT.radiusMax, Math.max(FX_LIGHT.radiusMin, snapped));
  return { tiles, bad: stored < FX_LIGHT.radiusMin || stored > FX_LIGHT.radiusMax }; // out of 0.5–6 is clamped and flagged (Ruling 4)
}
export const litTiles = (mode           , tiles        , tMs        , at        , ms        )         => {
  if (mode === "off" || !(ms > 0) || tMs < at || tMs >= at + ms) return 0;
  if (mode === "steady") return tiles;
  const e = tMs - at; return e < ms / 3 ? tiles : e < (ms * 2) / 3 ? half((tiles * 2) / 3) : half(tiles / 3);
};
export function rampOf(keys                                 , ramps                   )                                                        {
  const missing           = []; let ramp                           = null;
  for (const key of keys) { if (key === undefined) continue; const got = ramps?.[key]; if (got === undefined || got.length === 0) missing.push(key); else { ramp = got; break; } } // the first non-empty key wins; an empty one counts as absent (Ruling 1, Q1); later keys are never tried
  return { ramp, missing };
}
export const lightColour = (step         , fxRamp                    , ramps                   )                                        => { const found = rampOf([step.light_ramp, step.tint_ramp, fxRamp], ramps), top = found.ramp?.[found.ramp.length - 1]; return { colour: top ?? FX_LIGHT.colour, missing: found.missing }; };
export function snapToRamp(hex        , step         , fxRamp                    , ramps                   )         {
  if (step.tint_snap !== "ramp") return hex;
  const picked = rampOf([step.tint_ramp, fxRamp], ramps).ramp, pool = picked ?? Object.values(ramps ?? {}).flat(), src = rgb(hex);
  if (src === null || pool.length === 0) return hex;
  let best = hex, dist = Infinity;
  for (const item of pool) { const c = rgb(item); if (c === null) continue; const d = (c[0] - src[0]) ** 2 + (c[1] - src[1]) ** 2 + (c[2] - src[2]) ** 2; if (d < dist) { dist = d; best = item; } }
  return best;
}
export const hitWhiteMode = (stored         )               => (stored === "white" || stored === "tint" || stored === "black" || stored === "bright" ? stored : "white");
export const cuesSuppressed = (hitWhiteMs         )          => typeof hitWhiteMs === "number" && hitWhiteMs > 0, HIT_WHITE = { min: 40, max: 200 }         ;
export function hitWhiteMs(stored         )                               { if (typeof stored !== "number" || !Number.isFinite(stored) || stored <= 0) return { ms: 0, bad: stored !== undefined && stored !== 0 }; const ms = Math.min(HIT_WHITE.max, Math.max(HIT_WHITE.min, stored)); return { ms, bad: ms !== stored }; }
export const hitWhiteArg = (fx                                                                                                                                     , hit        , pose        , ramps                   )                => {
  const span = hitWhiteMs(fx.hit_white_ms), mode = hitWhiteMode(fx.hit_white_mode); if (!(span.ms > 0) || pose < hit || pose >= hit + span.ms) return null; if (mode !== "tint") return mode;
  const hex = rgb(fx.impact_colour ?? "") === null ? FX_LIGHT.colour : fx.impact_colour ?? FX_LIGHT.colour, row = fx.tint_ramp === undefined ? undefined : ramps?.[fx.tint_ramp];
  return row === undefined || row.length === 0 || fx.tint_ramp === undefined ? hex : snapToRamp(hex, { at: 0, tint_snap: "ramp", tint_ramp: fx.tint_ramp }, undefined, ramps);
};
export function brightPixels(img        , ramps                   )         {
  const data = new Uint8ClampedArray(img.data);
  for (let i = 0; i < data.length; i += 4) {
    if ((data[i + 3] ?? 0) === 0) continue;
    const r = data[i] ?? 0, g = data[i + 1] ?? 0, b = data[i + 2] ?? 0; let ramp                               , at = -1;
    for (const row of Object.values(ramps ?? {})) { for (let s = 0; s < row.length; s += 1) { const c = rgb(row[s] ?? ""); if (c !== null && c[0] === r && c[1] === g && c[2] === b) { ramp = row; at = s; break; } } if (ramp !== undefined) break; }
    const c = rgb(ramp === undefined ? "#ffffff" : ramp[Math.min(ramp.length - 1, at + 2)] ?? "#ffffff") ?? [255, 255, 255];
    data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2];
  }
  return { w: img.w, h: img.h, data };
}
export const popIsFlash = (tiles        , tilePx        )          => (Math.PI * (tiles * tilePx) ** 2) / (FX_LIGHT.screenW * FX_LIGHT.screenH) >= FX_LIGHT.flashShare;
export const popFlashStarts = (steps                    , tilePx        , startMs = 0)           => steps.flatMap((step) => (lightMode(step) === "pop" && popIsFlash(lightRadius(step.light_radius).tiles, tilePx) ? [startMs + step.at] : []));
