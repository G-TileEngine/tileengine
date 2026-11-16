import { hash32 } from "../../src/runtime/render/frames.js";
                                                                  
                                                                     
import { IDEAS,            } from "./bold.js";
import { SWATCH } from "./bold-swatch.js";
export const CAPS = { particles: 48, lights: 2, steps: 12 }         ;
export const BAKE = { w: 624, h: 624, frames: 16, k: 3 }         ;
export const RAMPS = SWATCH.styles["btf-ashroad@3"];
const KEYS = ["fire", "frost", "holy", "venom"]         ;
                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                        
                                      
const lit = (p       )          => p.light_mode === "steady" || p.light_mode === "pop" || (p.light_mode === undefined && (p.light === "steady" || p.light === "pop"));
export const particlesOf = (e        )         => e.pieces.reduce((n, p) => n + (p.kind === "particles" ? p.particle_count ?? 0 : 0), 0);
export const lightsOf = (e        )         => e.pieces.reduce((n, p) => n + (lit(p) ? 1 : 0), 0);
const capDoc = (e        , notes          )         => {
  const cut = e.pieces.slice(0, CAPS.steps);
  if (cut.length !== e.pieces.length) notes.push(`trim steps ${e.id}`);
  let left = CAPS.particles, lights = 0; let changed = cut.length !== e.pieces.length;
  const pieces = cut.map((p) => {
    let q = p;
    if (p.kind === "particles") { const want = p.particle_count ?? 0, n = Math.min(want, Math.max(0, left)); left -= n; if (n !== want) { notes.push(`trim particles ${e.id}`); q = { ...q, particle_count: n }; changed = true; } }
    if (lit(q)) { lights += 1; if (lights > CAPS.lights) { notes.push(`trim lights ${e.id}`); q = { ...q, light_mode: "off" }; changed = true; } }
    return q;
  });
  return changed ? { ...e, pieces } : e;
};
export function stressDocs(hero       , clip      )           {
  return [0, 1, 2, 3].map((i) => ({ id: `e${i}`, castMs: 0, loopMs: 480, caster: `u${i}`, target: `u${i + 10}`, pieces: [
    { at: 0, ms: 480, sheet: hero, clip, anchor: "target", light_mode: "steady" },
    { at: 0, ms: 480, sheet: hero, clip, anchor: "target", kind: "particles", particle_count: 24, tint_ramp: KEYS[i] ?? "fire", light_mode: "steady" },
    { at: 30, ms: 480, sheet: hero, clip, anchor: "target", kind: "particles", particle_count: 24, tint_ramp: KEYS[(i + 1) % 4] ?? "frost" },
  ] }));
}
const keyOf = (seed        , id        , c        , r        )         => KEYS[hash32(seed, id, c, r) % 4] ?? "fire";
export function breed(base                   , ctx     , notes          )                                        {
  const kids           = [];
  for (let i = 0; i < 6; i += 1) {
    const src = base[hash32(ctx.seed, "breed", i, ctx.block) % 3] ?? base[0];
    if (src === undefined) continue;
    const key = keyOf(ctx.seed, `k${i}`, i, ctx.block);
    kids.push(capDoc({ ...src, id: `k${i}`, tint_ramp: key, pieces: src.pieces.map((p) => ({ ...p, tint_ramp: key })) }, notes));
  }
  const play = kids[hash32(ctx.seed, "play", 0, ctx.block) % 6] ?? kids[0];
  return { kids, effects: play === undefined ? [...base] : [{ ...play, id: "e0" }, ...base.slice(1)] };
}
export function fusion(base                   , ctx     , notes          )           {
  const a = base[0], b = base[1];
  if (a === undefined || b === undefined) return [...base];
  const key = keyOf(ctx.seed, "fuse", ctx.block, 0);
  return [capDoc({ ...a, id: "e0+e1", tint_ramp: key, pieces: a.pieces.map((p) => ({ ...p, tint_ramp: key })) }, notes), ...base.slice(2)];
}
export function living(base                   , ctx     )                                                                            {
  const slots = new Int32Array(64), cells = Math.min(64, ctx.cols * ctx.rows), n = ctx.ageMs <= 0 ? 0 : Math.min(cells, Math.floor(ctx.ageMs / 1000) + 1);
  const aim = ctx.units.find((u) => u.id === base[0]?.target) ?? ctx.units[0], c0 = aim?.at.c ?? 0, r0 = aim?.at.r ?? 0, out = [];
  for (let i = 0; i < n; i += 1) { const h = hash32(ctx.seed, "live", i, 1); slots[i] = h; out.push({ band: "fxGround"         , sheet: ctx.sheet, x: (c0 + (h % 15) - 7) * 16, y: (r0 + ((h >>> 8) % 15) - 7) * 16, frame: 2 }); }
  return out;
}
export function tagMap(cols        , rows        , seed        )             {
  const m = new Uint8Array(cols * rows);
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) m[r * cols + c] = hash32(seed, "tag", c, r) & 1;
  return m;
}
export function path(base                   , ctx     )                                                           {
  const raw                               = [];
  for (let i = 0; i < 16; i += 1) { const h = hash32(ctx.seed, "path", i, ctx.block); raw.push({ dc: ((h % 17) - 8) / 8, dr: (((h >>> 8) % 17) - 8) / 8 }); }
  const pts = raw.map((p, i) => { const a = raw[Math.max(0, i - 1)] ?? p, c = raw[Math.min(15, i + 1)] ?? p; return { dc: Math.round((a.dc + p.dc + c.dc) * 8 / 3) / 8, dr: Math.round((a.dr + p.dr + c.dr) * 8 / 3) / 8 }; });
  const k = Math.floor(ctx.ageMs / 30) % 16;
  return { pts, effects: base.map((e, i) => i === 0 ? { ...e, pieces: e.pieces.map((q, j) => j === 0 ? { ...q, at: k * 30 } : q) } : e) };
}
export function tiers(base                   , tier        )           {
  if (!Number.isInteger(tier) || tier < 0 || tier > 2) throw new Error("plain int");
  const built = [0, 1, 2].map((n) => base.map((e) => n === 2 ? { ...e, hit_stop_ms: 100, shake: 2, shake_ms: 120 } : { ...e }));
  return built[tier] ?? [];
}
const caster = (base                   , ctx     )           => base.map((e) => { const u = ctx.units.find((x) => x.id === e.caster), key = keyOf(ctx.seed, e.id, u?.at.c ?? 0, u?.at.r ?? 0); return { ...e, tint_ramp: key, pieces: e.pieces.map((p) => ({ ...p, tint_ramp: key })) }; });
const rhythm = (base                   , ctx     )           => base.map((e) => ({ ...e, pieces: e.pieces.map((p, i) => ({ ...p, at: Math.round((p.at + (hash32(ctx.seed, e.id, i, ctx.block) % 3 - 1) * 30) / 30) * 30 })) }));
const linger = (base                   , ctx     , notes          )           => {
  const tags = tagMap(ctx.cols, ctx.rows, ctx.seed);
  return base.map((e) => {
    const u = ctx.units.find((x) => x.id === e.target), c = u?.at.c ?? 0, r = u?.at.r ?? 0, wet = (tags[r * ctx.cols + c] ?? 0) === 1;
    return capDoc({ ...e, pieces: [...e.pieces, { at: 60, ms: 480, sheet: ctx.sheet, anchor: "target", kind: "stamp", tint_ramp: wet ? "frost" : "fire" }] }, notes);
  });
};
const react = (ctx     )         => { let near = 0; for (let i = 0; i < ctx.units.length; i += 1) for (let j = i + 1; j < ctx.units.length; j += 1) { const a = ctx.units[i], b = ctx.units[j]; if (a !== undefined && b !== undefined && Math.abs(a.at.c - b.at.c) + Math.abs(a.at.r - b.at.r) <= 6) near += 1; } return near > 0 ? "fire+frost → steam" : "none"; };
export function applyStubs(on                  , blockOn         , base                   , ctx     )      {
  if (!blockOn || on.length === 0) return { effects: base, overlays: [], notes: [] };
  let effects = base, overlays                  = [], suggestion                    ;
  const notes           = [];
  for (const idea of IDEAS) {
    if (!on.includes(idea.token)) continue;
    const t = idea.token;
    if (t === "caster") { effects = caster(effects, ctx); notes.push("caster"); }
    else if (t === "breed") { effects = breed(effects, ctx, notes).effects; notes.push("breed"); }
    else if (t === "rhythm") { effects = rhythm(effects, ctx); notes.push("rhythm"); }
    else if (t === "tiers") { effects = tiers(effects, 2); notes.push("tiers"); }
    else if (t === "path") { effects = path(effects, ctx).effects; notes.push("path"); }
    else if (t === "linger6") { effects = linger(effects, ctx, notes); notes.push("linger6"); }
    else if (t === "react") suggestion = react(ctx);
    else if (t === "fusion") { effects = fusion(effects, ctx, notes); notes.push("fusion"); }
    else if (t === "living") { overlays = living(effects, ctx); notes.push("living"); }
  }
  return suggestion === undefined ? { effects, overlays, notes } : { effects, overlays, notes, suggestion };
}
export function createBake()                                                                                                                                                                               {
  const bytes = BAKE.w * BAKE.h * 4 * BAKE.frames, bakes           = [];
  let buf                    = null, mb = 0, peakMb = 0, frame = 0, acc = 0;
  return { step(seed, doc, on)       {
    if (!on || doc === undefined) { buf = null; mb = 0; frame = 0; acc = 0; return; }
    if (buf === null) buf = new Uint8Array(bytes);
    mb = bytes / 1048576; if (mb > peakMb) peakMb = mb;
    const slot = frame % BAKE.frames, h = hash32(seed, doc.id, slot, particlesOf(doc)), o = slot * BAKE.w * BAKE.h * 4;
    buf[o] = h & 255; buf[o + 1] = (h >>> 8) & 255; buf[o + 2] = (h >>> 16) & 255; buf[o + 3] = (h >>> 24) & 255;
    acc = Math.imul(acc ^ h, 16777619) >>> 0; frame += 1;
    if (frame % BAKE.frames === 0) { bakes.push(acc.toString(16)); acc = 0; if (bakes.length > 2) bakes.shift(); }
  }, get mb() { return mb; }, get peakMb() { return peakMb; }, get bakes() { return bakes; }, get equal() { return bakes.length >= 2 && bakes[bakes.length - 1] === bakes[bakes.length - 2]; } };
}
