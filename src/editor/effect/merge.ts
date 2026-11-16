import { badCounts, beatOf, countOf, fit, join, shiftOther, type Side, type Source } from "./fit.ts";
import { PARTS, partsOf, snapMix } from "./parts.ts";
import { DOC, stepTimes, stepsOf, type FxDocValues } from "../../runtime/render/fx-doc.ts";
import { stopMs } from "../../runtime/render/feel.ts";
import { hitWhiteMs } from "../../runtime/render/fx-light.ts";
export type AB = "a" | "b";
export type Pick = AB | "both" | "mix";
export type Gauge = { readonly n: number; readonly cap: number };
export type Meter = { readonly particles: Gauge; readonly draws: Gauge; readonly lights: Gauge; readonly steps: Gauge; readonly line: string };
export type Span = readonly [number, number];
export type Marks = { readonly hitMs: number; readonly hitStep: string | null; readonly stop: Span | null; readonly white: Span | null; readonly endMs: number; readonly beats: Readonly<Record<string, Span | null>> };
export type Blend = { readonly doc: FxDocValues; readonly messages: readonly string[]; readonly badges: Readonly<Record<string, AB | "both">>; readonly meter: Meter };
export const MERGE = {
  punch: { hit_stop_ms: 150, hit_white_ms: 200, shake: 3 }, draws: 60,
  scale: ["seconds", "bend", "hold_ms", "fade_out_ms", "particle_count", "particle_life_ms", "particle_pull", "light_radius"],
  pick: ["kind", "picture", "tint_ramp", "light_ramp", "light_mode", "particle_motion", "ease"],
} as const;
type Row = Record<string, unknown>;
const finite = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const whole = (k: string): boolean => k === "particle_count" || k.endsWith("_ms");
export const layerOf: (doc: FxDocValues, i: number) => string = (doc, i) => { const step = stepsOf(doc)[i], id = step?.["part"], part = typeof id === "string" ? partsOf(doc).find((p) => p.id === id) : undefined; return part !== undefined && (PARTS.kinds as readonly string[]).includes(part.kind) ? part.kind : step?.["kind"] === "particles" ? "sparks" : "shape"; };
export const keyOf: (doc: FxDocValues, i: number) => string = (doc, i) => `${layerOf(doc, i)}:${beatOf(doc, i)}`;
export function meter(doc: FxDocValues, messages?: readonly string[], o?: { preset?: boolean }): Meter {
  const steps = stepsOf(doc), play = steps.slice(0, DOC.steps).filter((s) => s["enabled"] !== false), notes = messages ?? [], extra = badCounts(steps).filter((line) => !notes.includes(line)), all = [...notes, ...extra];
  const particles = play.reduce((n, s) => n + countOf(s), 0);
  return { particles: { n: particles, cap: o?.preset === true ? 32 : 48 }, draws: { n: particles + play.filter((s) => s["kind"] !== "particles").length, cap: MERGE.draws }, lights: { n: play.filter((s) => { const m = s["light_mode"] ?? s["light"]; return m === "steady" || m === "pop"; }).length, cap: 2 }, steps: { n: steps.length, cap: 12 }, line: all.length === 0 ? "" : `${all.join(" · ")} · Undo` };
}
export function impactMarks(doc: FxDocValues, grid?: { stepMs?: number; reduce?: boolean; flashes?: boolean }): Marks {
  const time = stepTimes(doc), steps = stepsOf(doc), id = steps[time.hitIndex]?.["id"], stop = stopMs(doc["hit_stop_ms"], grid?.stepMs ?? 1, grid?.reduce === true, grid?.flashes === true), white = hitWhiteMs(doc["hit_white_ms"]).ms, beats: Record<string, Span | null> = Object.create(null);
  for (const name of PARTS.beats) beats[name] = null;
  steps.slice(0, DOC.steps).forEach((s, i) => { const beat = beatOf(doc, i); if (beats[beat] === undefined && Object.keys(beats).length >= 5) return; if (s["enabled"] === false) { beats[beat] ??= null; return; } const span: Span = [time.starts[i] ?? 0, time.ends[i] ?? 0], cur = beats[beat]; beats[beat] = cur == null ? span : [Math.min(cur[0], span[0]), Math.max(cur[1], span[1])]; });
  return { hitMs: time.hitMs, hitStep: typeof id === "string" && id !== "" ? id : null, stop: stop > 0 ? [time.hitMs, time.hitMs + stop] : null, white: white > 0 ? [time.hitMs, time.hitMs + white] : null, endMs: time.endMs, beats: Object.fromEntries(Object.entries(beats)) };
}
export function blend(a: Source, b: Source, o: { base: AB; mix: number; mint: (prefix: string) => string; preset?: boolean; picks?: Readonly<Record<string, Pick>> }): Blend {
  const m = typeof o.mix === "number" && Number.isFinite(o.mix) ? Math.min(100, Math.max(0, o.mix)) : 50, t = snapMix(m) / 100, win: AB = t < 0.5 ? "a" : t > 0.5 ? "b" : o.base;
  const joined = join(a, b, { base: o.base, mix: m, mint: o.mint }), doc = joined.doc, steps = doc["steps"] as Row[], sides: Side[] = [...joined.sides];
  const baseSrc = o.base === "a" ? a : b, otherSrc = o.base === "a" ? b : a, baseN = stepsOf(baseSrc.doc).length, hitIndex = stepTimes(baseSrc.doc).hitIndex, protect = hitIndex < baseN ? hitIndex : -1, hit = protect < 0 ? undefined : steps[protect];
  if (hit !== undefined) { const id = hit["id"]; if (typeof id !== "string" || id === "" || steps.slice(0, protect).some((s) => s["id"] === id)) { const minted = o.mint("s-"); hit["id"] = minted; doc["connect_step"] = minted; } }
  const pickOf = (key: string): Pick => { const v = o.picks?.[key]; return v === "a" || v === "b" || v === "both" || v === "mix" ? v : "both"; };
  const card = (i: number): AB => (sides[i] === "base" ? o.base : o.base === "a" ? "b" : "a");
  const keys = steps.map((_, i) => keyOf(i < baseN ? baseSrc.doc : otherSrc.doc, i < baseN ? i : i - baseN)), drop = new Set<number>(), before = stepTimes(doc).hitMs;
  for (const key of [...new Set(keys)]) {
    const pk = pickOf(key), idx = keys.flatMap((k, i) => (k === key ? [i] : []));
    if (pk === "mix") {
      const baseIdx = idx.filter((i) => sides[i] === "base"), otherIdx = idx.filter((i) => sides[i] === "other");
      baseIdx.forEach((bi, k) => {
        const oi = otherIdx[k]; if (oi === undefined) return; drop.add(oi); const left = steps[bi] ?? {}, right = steps[oi] ?? {}, aStep = card(bi) === "a" ? left : right, bStep = card(bi) === "a" ? right : left, src = win === "a" ? aStep : bStep;
        for (const field of MERGE.scale) { const av = finite(aStep[field]), bv = finite(bStep[field]); if (av !== null && bv !== null) left[field] = whole(field) ? Math.round(av + (bv - av) * t) : Math.round((av + (bv - av) * t) * 100) / 100; else if (av !== null) left[field] = aStep[field]; else if (bv !== null) left[field] = bStep[field]; }
        const rebuilt: Row = {}; for (const [k, v] of Object.entries(left)) if (!((MERGE.pick as readonly string[]).includes(k) && src[k] === undefined)) rebuilt[k] = v; for (const field of MERGE.pick) if (src[field] !== undefined) rebuilt[field] = src[field]; steps[bi] = rebuilt;
      });
    } else if (pk !== "both") for (const i of idx) if (card(i) !== pk && i !== protect) drop.add(i);
  }
  const keptS: Row[] = [], keptSide: Side[] = []; steps.forEach((s, i) => { if (!drop.has(i)) { keptS.push(s); keptSide.push(sides[i] ?? "base"); } });
  doc["steps"] = keptS; shiftOther(keptS, keptSide, stepTimes(doc).hitMs - before);
  const caps: string[] = [], pk = pickOf("punch:hit"), baseDoc = baseSrc.doc;
  const take = (knob: "hit_stop_ms" | "hit_white_ms" | "shake" | "squash"): unknown => {
    if (pk === "a" || pk === "b") return (pk === "a" ? a.doc : b.doc)[knob];
    if (pk === "mix") { const av = finite(a.doc[knob]), bv = finite(b.doc[knob]); return knob !== "squash" && av !== null && bv !== null ? Math.round(av + (bv - av) * t) : (win === "a" ? a.doc : b.doc)[knob]; }
    if (knob === "squash") return a.doc["squash"] === true || b.doc["squash"] === true ? true : baseDoc["squash"];
    const av = finite(a.doc[knob]), bv = finite(b.doc[knob]); return av !== null && bv !== null ? Math.max(av, bv) : av ?? bv ?? baseDoc[knob];
  };
  for (const knob of ["hit_stop_ms", "hit_white_ms", "shake"] as const) { const val = take(knob); if (val === undefined) { if (knob === "hit_stop_ms") delete doc["hit_stop_ms"]; else if (knob === "hit_white_ms") delete doc["hit_white_ms"]; else delete doc["shake"]; } else doc[knob] = val; const cap = MERGE.punch[knob], got = doc[knob]; if (typeof got === "number" && Number.isFinite(got) && got > cap) { caps.push(`Capped ${knob} ${String(got)} → ${cap}`); doc[knob] = cap; } }
  const squash = take("squash"); if (squash === undefined) delete doc["squash"]; else doc["squash"] = squash;
  const done = fit(doc, keptSide, o.preset === true ? { preset: true } : {}), messages = [...joined.messages, ...done.messages, ...caps], badges: Record<string, AB | "both"> = {};
  const partN = Array.isArray(baseSrc.doc["parts"]) ? baseSrc.doc["parts"].length : 0, used = new Set(stepsOf(done.doc).flatMap((s) => (typeof s["part"] === "string" ? [s["part"]] : []))), out = done.doc as Row;
  if (Array.isArray(out["parts"])) out["parts"] = (out["parts"] as Row[]).filter((p, i) => i < partN || (typeof p["id"] === "string" && used.has(p["id"])));
  for (const src of [a, b]) stepsOf(src.doc).forEach((_, i) => { const key = keyOf(src.doc, i), chosen = pickOf(key); badges[key] = chosen === "mix" ? win : chosen; });
  return { doc: done.doc, messages, badges, meter: meter(done.doc, messages, o.preset === true ? { preset: true } : {}) };
}
