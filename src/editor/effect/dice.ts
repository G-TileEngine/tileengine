import type { FxDocValues } from "../../runtime/render/fx-doc.ts";
import { hash32 } from "../../runtime/render/frames.ts";
import { fit, type Source } from "./fit.ts";
import { blend, keyOf, layerOf, meter, type AB, type Meter } from "./merge.ts";
import { writeSeed } from "./parts.ts";
type Slider = readonly [string, number, number, number];
type Row = Record<string, unknown>;
const rec = (v: unknown): Row | null => (v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Row) : null);
const omit = (o: Row, k: string): Row => Object.fromEntries(Object.entries(o).filter(([key]) => key !== k));
export const DICE = { spread: 0.25, small: 4, rolls: 6, children: 6, flips: ["picture", "tint_ramp", "particle_motion"], sliders: { shape: [["seconds", 0.15, 3, 0.01], ["bend", -2.5, 2.5, 0.01]], sparks: [["particle_count", 0, 48, 1], ["particle_life_ms", 200, 3000, 10], ["particle_pull", 0, 2000, 100]], light: [["light_radius", 0.5, 6, 0.5]], trail: [["smear_ms", 40, 120, 10]], punch: [["hit_stop_ms", 0, 150, 10], ["shake", 0, 3, 1]] } } as const;
export type Child = { readonly doc: FxDocValues; readonly messages: readonly string[]; readonly meter: Meter; readonly seed: number; readonly parents: readonly [number, number]; readonly base: AB; readonly mix: number };
export const seedOf: (seed: unknown) => number = (seed) => { const n = typeof seed === "number" ? seed : 0; return Number.isFinite(n) ? (Math.trunc(n) >>> 0) & 0x7fffffff : 0; };
const unit = (seed: number, key: string, i: number): number => hash32(seed, key, i, 0) / 4294967296;
export function rollValue(v: unknown, s: Slider, seed: number, key: string, i: number): unknown {
  const min = s[1], max = s[2], step = s[3]; if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max) return v;
  if (step === 1 && Number.isInteger(v) && v !== 0 && Math.abs(v) <= DICE.small) { const u = unit(seed, key, i), d = u < 0.75 ? -1 : 1, ok = (n: number): boolean => n !== 0 && n >= min && n <= max; return u < 0.5 ? v : ok(v + d) ? v + d : ok(v - d) ? v - d : v; }
  const a = v * (1 - DICE.spread), b = v * (1 + DICE.spread), lo = Math.max(min, Math.min(a, b)), hi = Math.min(max, Math.max(a, b)), x = lo + (hi - lo) * unit(seed, key, i);
  let k = Math.round(x / step) * step; k = step >= 1 ? Math.round(k) : Math.round(k * 100) / 100; if (k < lo) k += step; else if (k > hi) k -= step; k = step >= 1 ? Math.round(k) : Math.round(k * 100) / 100;
  return k < lo || k > hi ? v : k;
}
const copyDoc = (doc: FxDocValues): Row => ({ ...doc, steps: (Array.isArray(doc["steps"]) ? doc["steps"] : []).map((s) => ({ ...(rec(s) ?? {}) })) });
const vary = (doc: Row, layer: string, seed: number, ramps: readonly string[]): void => {
  const steps = doc["steps"] as Row[];
  if (layer === "colour") { if (ramps.length === 0) return; if ("tint_ramp" in doc) doc["tint_ramp"] = ramps[Math.floor(unit(seed, "dice:colour:tint_ramp", 0) * ramps.length)] ?? doc["tint_ramp"]; steps.forEach((s, i) => { if (layerOf(doc, i) === "colour" && "tint_ramp" in s) s["tint_ramp"] = ramps[Math.floor(unit(seed, "dice:colour:tint_ramp", i) * ramps.length)] ?? s["tint_ramp"]; }); return; }
  const table = (DICE.sliders as Record<string, readonly Slider[]>)[layer] ?? [];
  if (layer === "punch") { for (const s of table) if (s[0] in doc) doc[s[0]] = rollValue(doc[s[0]], s, seed, `dice:${layer}:${s[0]}`, 0); return; }
  steps.forEach((st, i) => { if (layerOf(doc, i) !== layer) return; for (const s of table) if (s[0] in st) st[s[0]] = rollValue(st[s[0]], s, seed, `dice:${layer}:${s[0]}`, i); });
};
const seeded = (doc: Row, seed: number): Row => { const v = writeSeed(seed); return v === undefined ? omit(doc, "variant_seed") : { ...doc, variant_seed: v }; };
export function roll(anchor: FxDocValues, layer: string, seed: unknown, o?: { ramps?: readonly string[]; preset?: boolean }): { doc: FxDocValues; messages: string[] } {
  const s = seedOf(seed), doc = copyDoc(anchor); vary(doc, layer, s, o?.ramps ?? []); return fit(seeded(doc, s), [], o?.preset === true ? { preset: true } : {});
}
export const pushRoll: (list: readonly number[], seed: unknown) => number[] = (list, seed) => { const s = seedOf(seed); return [s, ...list.filter((n) => n !== s)].slice(0, DICE.rolls); };
const differ = (doc: FxDocValues, step: Row, i: number, parents: readonly Source[]): { field: string; value: unknown } | null => {
  const key = keyOf(doc, i);
  for (const field of DICE.flips) for (const p of parents) { const steps = Array.isArray(p.doc["steps"]) ? p.doc["steps"] : []; for (let j = 0; j < steps.length; j += 1) { if (keyOf(p.doc, j) !== key) continue; const other = rec(steps[j]); if (other !== null && other[field] !== step[field]) return { field, value: other[field] }; } }
  return null;
};
export function breed(parents: readonly (Source | null)[], o: { seed: unknown; mint: (prefix: string) => string; ramps?: readonly string[]; preset?: boolean }): Child[] {
  const kept: { src: Source; i: number }[] = []; parents.forEach((p, i) => { if (p !== null) kept.push({ src: p, i }); }); const use = kept.slice(0, 3); if (use.length < 2) return [];
  const plan: readonly (readonly [number, number, AB, number])[] = use.length === 2 ? [[0, 1, "a", 25], [0, 1, "a", 50], [0, 1, "a", 75], [0, 1, "b", 25], [0, 1, "b", 50], [0, 1, "b", 75]] : [[0, 1, "a", 25], [0, 1, "a", 75], [1, 2, "a", 25], [1, 2, "a", 75], [2, 0, "a", 25], [2, 0, "a", 75]];
  return plan.map(([a, b, base, mix], k) => {
    const pa = use[a]?.src, pb = use[b]?.src; if (pa === undefined || pb === undefined) return null;
    const blended = blend(pa, pb, { base, mix, mint: o.mint, ...(o.preset === true ? { preset: true } : {}) }), seed = hash32(seedOf(o.seed), "breed", k, 0) & 0x7fffffff, doc = copyDoc(blended.doc), steps = doc["steps"] as Row[];
    const n = 1 + (hash32(seed, "flip", 0, 0) & 1), used = new Set<number>();
    for (let f = 0; f < n; f += 1) { const cands: number[] = []; for (let i = 0; i < Math.min(12, steps.length); i += 1) if (!used.has(i) && differ(doc, steps[i] ?? {}, i, [pa, pb]) !== null) cands.push(i); if (cands.length === 0) break; const i = cands[hash32(seed, "flip", f + 1, 0) % cands.length] ?? -1; const hit = i < 0 ? null : differ(doc, steps[i] ?? {}, i, [pa, pb]); if (hit !== null && steps[i] !== undefined) steps[i][hit.field] = hit.value; if (i >= 0) used.add(i); }
    const took = new Set(steps.map((_, i) => layerOf(doc, i))); if ((Array.isArray(doc["parts"]) ? doc["parts"] : []).some((p) => rec(p)?.["kind"] === "punch")) took.add("punch");
    for (const layer of took) vary(doc, layer, seed, o.ramps ?? []);
    const done = fit(seeded(doc, seed), [], o.preset === true ? { preset: true } : {}), messages = [...blended.messages, ...done.messages];
    const child: Child = { doc: done.doc, messages, meter: meter(done.doc, messages, o.preset === true ? { preset: true } : {}), seed, parents: [use[a]?.i ?? 0, use[b]?.i ?? 0], base, mix };
    return child;
  }).filter((c): c is Child => c !== null);
}
