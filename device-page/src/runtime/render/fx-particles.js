import { hash32 } from "./frames.js";
                                                                
export const PARTICLES = { pool: 96, perEffect: 48, count: 12, lifeMin: 200, lifeMax: 3000, life: 800, pullMax: 2000, pull: 1000, sizes: [3, 2, 1], fades: [0.5, 0.25], reachPx: 24, colour: "#ffb048" }         ;
export const SPREAD = { jitter: 0.8, start_spread: 0.75, size_spread: 0.6 }         ;
export const FX_BUDGET = { effect: 60, total: 120, frame: 300 }         ;
export const FX_GROUND_ORDER = ["shore", "pieces", "particles"]         ;
                                                                                                                                                                                                                                                               
                                                                                                                                     
const MOTIONS                            = ["burst", "attract", "spiral-in", "rise"];
const clamp = (stored         , min        , max        , dflt        )                              => {
  if (typeof stored !== "number" || !Number.isFinite(stored)) return { n: dflt, bad: stored !== undefined };
  const rounded = Math.round(stored), n = Math.min(max, Math.max(min, rounded)); return { n, bad: stored !== rounded || stored < min || stored > max };
};
export function particleRead(p                                                                                                                                                                                                                                                                                )               {
  const named = p.particle_motion, known = MOTIONS.find((m) => m === named), count = clamp(p.particle_count, 0, PARTICLES.perEffect, PARTICLES.count), life = clamp(p.particle_life_ms !== undefined ? p.particle_life_ms : p.particle_life, PARTICLES.lifeMin, PARTICLES.lifeMax, PARTICLES.life), pull = clamp(p.particle_pull, 0, PARTICLES.pullMax, PARTICLES.pull), bad           = [];
  if (named !== undefined && known === undefined) bad.push("particle_motion"); if (count.bad) bad.push("particle_count"); if (life.bad) bad.push("particle_life_ms"); if (pull.bad) bad.push("particle_pull");
  const spread = (key                     )         => { const stored = p[key], max = SPREAD[key]; if (typeof stored !== "number" || !Number.isFinite(stored)) { if (stored !== undefined) bad.push(key); return 0; } const n = stored < 0 ? 0 : stored > max ? max : stored; if (n !== stored) bad.push(key); return n; };
  const jitter = spread("jitter"), start_spread = spread("start_spread"), size_spread = spread("size_spread");
  return { motion: known ?? "burst", count: count.n, life: life.n, pull: pull.n, bad, ...(jitter > 0 ? { jitter } : {}), ...(start_spread > 0 ? { start_spread } : {}), ...(size_spread > 0 ? { size_spread } : {}) };
}
export function capCounts(counts                   )                                            {
  let left = PARTICLES.perEffect; const sum = counts.reduce((a, b) => a + b, 0);
  return { counts: counts.map((n) => { const k = Math.min(Math.max(0, n), Math.max(0, left)); left -= k; return k; }), over: sum > PARTICLES.perEffect ? sum : null };
}
const fp = (v        )         => Math.floor(v * 256) >> 8;
export function particleAt(read              , i        , seed        , age        , ramp                          , reduce         , tileW = 0)             {
  const spr = hash32(seed, "spread", i, 0), unit = (byte        )         => ((spr >>> (8 * byte)) & 255) / 255, late = (read.start_spread ?? 0) * unit(0) * read.life, local = age - late;
  if (!(age >= late && age < read.life)) return null;
  const shown = reduce ? (local * 2 < read.life ? 0 : read.life - 1) : local, u = shown / read.life, ease = 1 - (1 - u) * (1 - u);
  const h = hash32(seed, "dot", i, 0), reach = 8 + (h % 17), ang = ((h >>> 8) % 4096) / 4096 * Math.PI * 2, close = Math.min(1, u * (read.pull / 1000));
  const inward = read.motion === "attract" || read.motion === "spiral-in", rad = inward ? reach * (1 - close) : reach * ease, spin = read.motion === "spiral-in" ? ang + close * Math.PI * 2 : ang;
  const x = read.motion === "rise" ? fp(Math.cos(ang) * rad) : fp(Math.cos(spin) * rad), y = read.motion === "rise" ? fp(-rad) : fp(Math.sin(spin) * rad);
  const n = ramp?.length ?? 0, idx = n === 0 ? 0 : Math.min(n - 1, Math.floor(shown * n / read.life)), colour = n === 0 || ramp === null ? PARTICLES.colour : ramp[n - 1 - idx] ?? PARTICLES.colour;
  const alpha = n >= 3 && idx >= n - 2 ? (idx === n - 1 ? PARTICLES.fades[1] : PARTICLES.fades[0]) : 1, grown = 1 + (unit(3) - 0.5) * 2 * (read.size_spread ?? 0), size = Math.max(1, Math.round((shown * 3 < read.life ? PARTICLES.sizes[0] : shown * 3 < read.life * 2 ? PARTICLES.sizes[1] : PARTICLES.sizes[2]) * Math.min(1.8, Math.max(0.35, grown))));
  return { x: x + (unit(1) - 0.5) * 2 * (read.jitter ?? 0) * tileW, y: y + (unit(2) - 0.5) * 2 * (read.jitter ?? 0) * tileW, size, colour, alpha };
}
