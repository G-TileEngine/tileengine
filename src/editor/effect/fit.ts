import { blendSeed, partsOf, writeSeed } from "./parts.ts";
import { DOC, stepTimes, stepsOf, type FxDocValues } from "../../runtime/render/fx-doc.ts";
import { PARTICLES } from "../../runtime/render/fx-particles.ts";
export type Side = "base" | "other";
export const FIT = { particles: PARTICLES.perEffect, preset: 32, lights: 2, steps: DOC.steps } as const;
const rec = (v: unknown): Record<string, unknown> | null => (v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null);
const countOf = (s: Record<string, unknown>): number => (s["kind"] === "particles" ? (typeof s["particle_count"] === "number" ? s["particle_count"] : PARTICLES.count) : 0);
const lenOf = (s: Record<string, unknown>): number => { const raw = typeof s["seconds"] === "number" && Number.isFinite(s["seconds"]) ? s["seconds"] : DOC.secDefault; return Math.round(Math.min(DOC.secMax, Math.max(DOC.secMin, raw)) * 1000); };
const weightOf = (s: Record<string, unknown>): number => lenOf(s) * (s["kind"] === "particles" ? countOf(s) / PARTICLES.count : 1);
const lit = (s: Record<string, unknown>): boolean => { const m = s["light_mode"] ?? s["light"]; return m === "steady" || m === "pop"; };
const radOf = (s: Record<string, unknown>): number => (typeof s["light_radius"] === "number" ? s["light_radius"] : 2);
const spread = (s: Record<string, unknown>): boolean => (["jitter", "start_spread", "size_spread"] as const).some((k) => typeof s[k] === "number" && (s[k] as number) > 0);
export function beatOf(doc: FxDocValues, i: number): string {
  const step = stepsOf(doc)[i], partId = step?.["part"];
  if (typeof partId === "string") { const part = partsOf(doc).find((p) => p.id === partId); if (part !== undefined && part.beats.length === 1) return part.beats[0] ?? "cast"; }
  const hit = stepTimes(doc).hitIndex; return i < hit ? "cast" : i === hit ? "hit" : "linger";
}
export function fit(doc: FxDocValues, sides: readonly Side[], o?: { preset?: boolean }): { doc: FxDocValues; messages: string[] } {
  const messages: string[] = [], steps = (Array.isArray(doc["steps"]) ? doc["steps"] : []).map((s) => ({ ...(rec(s) ?? {}) })), next: Record<string, unknown> = { ...doc, steps };
  const cap = o?.preset === true ? FIT.preset : FIT.particles, counts = steps.map(countOf), sum = counts.reduce((a, b) => a + b, 0);
  if (sum > cap) { let got = 0; steps.forEach((s, i) => { if (counts[i] === 0) return; const n = Math.floor((counts[i] ?? 0) * cap / sum); s["particle_count"] = n; got += n; }); messages.push(`Scaled sparks ${sum} → ${got} to fit ${cap}`); }
  const lights = steps.map((s, i) => (lit(s) ? i : -1)).filter((i) => i >= 0);
  if (lights.length > FIT.lights) {
    const side = (i: number): Side => (sides[i] === "other" ? "other" : "base");
    const ranked = [...lights].sort((a, b) => radOf(steps[b] ?? {}) - radOf(steps[a] ?? {}) || (side(a) === side(b) ? a - b : side(a) === "base" ? -1 : 1));
    const keep = new Set(ranked.slice(0, FIT.lights)); let off = 0;
    for (const i of lights) if (!keep.has(i)) { const s = steps[i] ?? {}; delete s["light"]; s["light_mode"] = "off"; off += 1; }
    messages.push(`Kept the 2 largest lights; turned off ${off}`);
  }
  const named = next["connect_step"]; if (named === undefined || named === "") { const id = steps[stepTimes(next).hitIndex]?.["id"]; if (typeof id === "string") next["connect_step"] = id; }
  const hitId = next["connect_step"], beat = steps.map((_, i) => beatOf(next, i)), sideOf = steps.map((_, i) => (sides[i] === "other" ? "other" : "base"));
  const klass = (s: Record<string, unknown>, i: number): string | null => (beat[i] === "linger" ? "linger" : partsOf(next).find((p) => p.id === s["part"])?.kind === "trail" ? "trail" : spread(s) ? "spread" : null);
  const tags = steps.map(klass);
  for (const cls of ["linger", "trail", "spread"] as const) {
    let trimmed = 0;
    while (steps.length > FIT.steps) {
      const cand = steps.map((_, i) => i).filter((i) => tags[i] === cls && steps[i]?.["id"] !== hitId && steps.filter((_, j) => beat[j] === beat[i] && sideOf[j] === sideOf[i]).length > 1);
      if (cand.length === 0) break;
      cand.sort((a, b) => weightOf(steps[a] ?? {}) - weightOf(steps[b] ?? {}) || (sideOf[a] === sideOf[b] ? b - a : sideOf[a] === "other" ? -1 : 1));
      const drop = cand[0] ?? 0; steps.splice(drop, 1); beat.splice(drop, 1); sideOf.splice(drop, 1); tags.splice(drop, 1); trimmed += 1;
    }
    if (trimmed > 0) messages.push(`Trimmed ${trimmed} ${cls} step${trimmed === 1 ? "" : "s"} to fit`);
  }
  if (steps.length > FIT.steps) messages.push(`Still ${steps.length} steps: steps 13+ are saved but won't play`);
  return { doc: next, messages };
}
export type Source = { readonly id: string; readonly rev: number; readonly doc: FxDocValues };
export function flatten(a: Source, b: Source, o: { base: "a" | "b"; mix: number; mint: (prefix: string) => string; preset?: boolean }): { doc: FxDocValues; messages: string[] } {
  const base = o.base === "a" ? a : b, other = o.base === "a" ? b : a, messages: string[] = [], bt = stepTimes(base.doc), ot = stepTimes(other.doc);
  const baseSteps = stepsOf(base.doc).map((s) => ({ ...s })), otherSteps = stepsOf(other.doc).slice(0, DOC.steps);
  const hit = baseSteps[bt.hitIndex], hitId = hit?.["id"];
  const baseParts = Array.isArray(base.doc["parts"]) ? base.doc["parts"] : [], map = new Map<string, string>();
  const movedParts = (Array.isArray(other.doc["parts"]) ? other.doc["parts"] : []).map((item) => { const p = rec(item) ?? {}; const id = o.mint("p-"); if (typeof p["id"] === "string") map.set(p["id"], id); return { ...p, id, from: { effect: other.id, rev: other.rev } }; });
  const moved = otherSteps.map((s, i) => {
    let at = bt.hitMs + ((ot.starts[i] ?? 0) - ot.hitMs);
    if (at < 0) { messages.push(`${other.id} step ${i + 1} starts before 0: moved to 0`); at = 0; } else if (at > DOC.msMax) at = DOC.msMax;
    const copy: Record<string, unknown> = { ...s, id: o.mint("s-"), start_mode: "at-time", start_at_ms: at };
    if (typeof copy["part"] === "string" && map.has(copy["part"])) copy["part"] = map.get(copy["part"]);
    return copy;
  });
  const doc: Record<string, unknown> = { ...base.doc, parts: [...baseParts, ...movedParts], steps: [...baseSteps, ...moved], ...(typeof hitId === "string" ? { connect_step: hitId } : {}) };
  const seed = writeSeed(blendSeed(base.doc["variant_seed"], other.doc["variant_seed"], o.mix, o.base));
  if (seed === undefined) delete doc["variant_seed"]; else doc["variant_seed"] = seed;
  const done = fit(doc, [...baseSteps.map((): Side => "base"), ...moved.map((): Side => "other")], o.preset === true ? { preset: true } : {}); return { doc: done.doc, messages: [...messages, ...done.messages] };
}
