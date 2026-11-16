import { blendSeed, partsOf, writeSeed } from "./parts.ts";
import { DOC, stepTimes, stepsOf, type FxDocValues } from "../../runtime/render/fx-doc.ts";
import { PARTICLES } from "../../runtime/render/fx-particles.ts";
import { PATH } from "../../runtime/render/fx-path.ts";
export type Side = "base" | "other";
export const FIT = { particles: PARTICLES.perEffect, preset: 32, lights: 2, steps: DOC.steps } as const;
const rec = (v: unknown): Record<string, unknown> | null => (v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null);
export const countOf: (s: Record<string, unknown>) => number = (s) => { if (s["kind"] !== "particles") return 0; const v = s["particle_count"]; if (typeof v !== "number") return PARTICLES.count; if (!Number.isFinite(v) || v < 0) return 0; return Math.min(v, PARTICLES.perEffect); };
const lenOf = (s: Record<string, unknown>): number => { const raw = typeof s["seconds"] === "number" && Number.isFinite(s["seconds"]) ? s["seconds"] : DOC.secDefault; return Math.round(Math.min(DOC.secMax, Math.max(DOC.secMin, raw)) * 1000); };
const weightOf = (s: Record<string, unknown>): number => lenOf(s) * (s["kind"] === "particles" ? countOf(s) / PARTICLES.count : 1);
export const lit: (s: Record<string, unknown>) => boolean = (s) => { const m = s["light_mode"] ?? s["light"]; return m === "steady" || m === "pop"; };
const radOf = (s: Record<string, unknown>): number => (typeof s["light_radius"] === "number" ? s["light_radius"] : 2);
const spread = (s: Record<string, unknown>): boolean => (["jitter", "start_spread", "size_spread"] as const).some((k) => typeof s[k] === "number" && (s[k] as number) > 0);
const countLine = (v: unknown, n: number): string | null => (typeof v !== "number" ? null : !Number.isFinite(v) || v < 0 ? `Bad count ${String(v)} on step ${n} → 0` : v > PARTICLES.perEffect ? `Capped count ${String(v)} on step ${n} → 48` : null);
export const badCounts: (steps: readonly Record<string, unknown>[]) => string[] = (steps) => steps.slice(0, FIT.steps).flatMap((s, i) => { const line = s["enabled"] === false || s["kind"] !== "particles" ? null : countLine(s["particle_count"], i + 1); return line === null ? [] : [line]; });
export function beatOf(doc: FxDocValues, i: number): string {
  const step = stepsOf(doc)[i], hit = stepTimes(doc).hitIndex, pos = i < hit ? "cast" : i === hit ? "hit" : "linger", kind = step?.["kind"], hold = step?.["hold_ms"], fade = step?.["fade_out_ms"], lasting = (typeof hold === "number" && hold > 0) || (typeof fade === "number" && fade > 0);
  const refined = i < hit && typeof kind === "string" && (PATH.kinds as readonly string[]).includes(kind) ? "travel" : i > hit && step?.["start_mode"] === "at-hit" ? (lasting ? "linger" : "hit") : pos, partId = step?.["part"], part = typeof partId === "string" ? partsOf(doc).find((p) => p.id === partId) : undefined;
  if (part !== undefined && part.beats.length === 1) return part.beats[0] ?? "cast";
  return part !== undefined && part.beats.length > 1 && !part.beats.includes(refined) ? pos : refined;
}
export const shiftOther: (steps: Record<string, unknown>[], sides: readonly Side[], by: number) => void = (steps, sides, by) => { steps.forEach((s, i) => { if (sides[i] !== "other" || s["start_mode"] !== "at-time") return; const at = typeof s["start_at_ms"] === "number" && Number.isFinite(s["start_at_ms"]) ? s["start_at_ms"] : 0; s["start_at_ms"] = Math.max(0, Math.min(DOC.msMax, at + by)); }); };
export function fit(doc: FxDocValues, sides: readonly Side[], o?: { preset?: boolean }): { doc: FxDocValues; messages: string[] } {
  const messages: string[] = [], steps = (Array.isArray(doc["steps"]) ? doc["steps"] : []).map((s) => ({ ...(rec(s) ?? {}) })), next: Record<string, unknown> = { ...doc, steps }, raw = steps.map((s) => s["particle_count"]);
  steps.forEach((s) => { const v = s["particle_count"]; if (s["kind"] === "particles" && typeof v === "number" && Number.isFinite(v) && v > PARTICLES.perEffect) s["particle_count"] = PARTICLES.perEffect; });
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
  const named = next["connect_step"], known = typeof named === "string" && named !== "" && steps.slice(0, FIT.steps).some((s) => s["id"] === named);
  if (!known) { const id = steps[stepTimes(next).hitIndex]?.["id"]; if (typeof id === "string") next["connect_step"] = id; }
  const hitId = next["connect_step"], beat = steps.map((_, i) => beatOf(next, i)), sideOf = steps.map((_, i) => (sides[i] === "other" ? "other" : "base"));
  const klass = (s: Record<string, unknown>, i: number): string | null => (beat[i] === "linger" ? "linger" : partsOf(next).find((p) => p.id === s["part"])?.kind === "trail" ? "trail" : spread(s) ? "spread" : null);
  const tags = steps.map(klass), before = stepTimes(next).hitMs; tags[stepTimes(next).hitIndex] = null;
  for (const cls of ["linger", "trail", "spread"] as const) {
    let trimmed = 0;
    while (steps.length > FIT.steps) {
      const cand = steps.map((_, i) => i).filter((i) => tags[i] === cls && steps[i]?.["id"] !== hitId && steps.filter((_, j) => beat[j] === beat[i] && sideOf[j] === sideOf[i]).length > 1);
      if (cand.length === 0) break;
      cand.sort((a, b) => weightOf(steps[a] ?? {}) - weightOf(steps[b] ?? {}) || (sideOf[a] === sideOf[b] ? b - a : sideOf[a] === "other" ? -1 : 1));
      const drop = cand[0] ?? 0; steps.splice(drop, 1); beat.splice(drop, 1); sideOf.splice(drop, 1); tags.splice(drop, 1); raw.splice(drop, 1); trimmed += 1;
    }
    if (trimmed > 0) messages.push(`Trimmed ${trimmed} ${cls} step${trimmed === 1 ? "" : "s"} to fit`);
  }
  if (steps.length > FIT.steps) messages.push(`Still ${steps.length} steps: steps 13+ are saved but won't play`);
  shiftOther(steps, sideOf, stepTimes(next).hitMs - before);
  const lines = steps.slice(0, FIT.steps).flatMap((s, i) => { const line = s["enabled"] === false || s["kind"] !== "particles" ? null : countLine(raw[i], i + 1); return line === null ? [] : [line]; });
  return { doc: next, messages: [...lines, ...messages] };
}
export type Source = { readonly id: string; readonly rev: number; readonly doc: FxDocValues };
export function join(a: Source, b: Source, o: { base: "a" | "b"; mix: number; mint: (prefix: string) => string }): { doc: Record<string, unknown>; sides: Side[]; messages: string[] } {
  const base = o.base === "a" ? a : b, other = o.base === "a" ? b : a, messages: string[] = [], bt = stepTimes(base.doc), ot = stepTimes(other.doc);
  const baseSteps = stepsOf(base.doc).map((s) => ({ ...s })), otherSteps = stepsOf(other.doc).slice(0, DOC.steps);
  const hit = baseSteps[bt.hitIndex], hitId = hit?.["id"];
  const baseParts = Array.isArray(base.doc["parts"]) ? base.doc["parts"] : [], map = new Map<string, string>();
  const movedParts = (Array.isArray(other.doc["parts"]) ? other.doc["parts"] : []).map((item) => { const p = rec(item) ?? {}; const id = o.mint("p-"); if (typeof p["id"] === "string") map.set(p["id"], id); return { ...p, id, from: { effect: other.id, rev: other.rev } }; });
  const ids = otherSteps.map(() => o.mint("s-")), rideOf = new Map<string, string>();
  otherSteps.forEach((s, i) => { const id = s["id"]; if (typeof id === "string" && id !== "" && !rideOf.has(id)) rideOf.set(id, ids[i] ?? id); });
  const moved = otherSteps.map((s, i) => {
    let at = bt.hitMs + ((ot.starts[i] ?? 0) - ot.hitMs);
    if (at < 0) { messages.push(`${other.id} step ${i + 1} starts before 0: moved to 0`); at = 0; } else if (at > DOC.msMax) at = DOC.msMax;
    const copy: Record<string, unknown> = { ...s, id: ids[i], start_mode: "at-time", start_at_ms: at };
    if (typeof copy["part"] === "string" && map.has(copy["part"])) copy["part"] = map.get(copy["part"]);
    if ("ride" in copy) { const ride = copy["ride"], next = typeof ride === "string" && ride !== "" ? rideOf.get(ride) : undefined; if (next === undefined) delete copy["ride"]; else copy["ride"] = next; }
    return copy;
  });
  const doc: Record<string, unknown> = { ...base.doc, parts: [...baseParts, ...movedParts], steps: [...baseSteps, ...moved], ...(typeof hitId === "string" ? { connect_step: hitId } : {}) };
  const seed = writeSeed(blendSeed(base.doc["variant_seed"], other.doc["variant_seed"], o.mix, o.base));
  if (seed === undefined) delete doc["variant_seed"]; else doc["variant_seed"] = seed;
  return { doc, sides: [...baseSteps.map((): Side => "base"), ...moved.map((): Side => "other")], messages };
}
export function flatten(a: Source, b: Source, o: { base: "a" | "b"; mix: number; mint: (prefix: string) => string; preset?: boolean }): { doc: FxDocValues; messages: string[] } {
  const joined = join(a, b, o), done = fit(joined.doc, joined.sides, o.preset === true ? { preset: true } : {});
  return { doc: done.doc, messages: [...joined.messages, ...done.messages] };
}
