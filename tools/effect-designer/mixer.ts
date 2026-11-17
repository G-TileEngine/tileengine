import type { Child } from "../../src/editor/effect/dice.ts";
import type { Source } from "../../src/editor/effect/fit.ts";
import { readHouse, type House } from "../../src/editor/effect/house.ts";
import { blend, impactMarks, keyOf, type AB, type Blend, type Pick } from "../../src/editor/effect/merge.ts";
import { snapMix } from "../../src/editor/effect/parts.ts";
import { stepsOf, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
import type { Meter } from "../../src/editor/effect/merge.ts";
export const PAGE2 = { show: 3, shelf: 48, picks: ["both", "a", "b", "mix"], punch: ["hit_stop_ms", "hit_white_ms", "shake", "squash"] } as const;
const KINDS = ["shape", "colour", "sparks", "light", "punch", "trail"] as const, BEATS = ["cast", "travel", "hit", "linger"] as const;
export type Card = Source & { readonly label: string };
export type Chip = { readonly layer: string; readonly beats: Readonly<Record<string, number>>; readonly badge: AB | "both" | null };
export type Mixer = { readonly a: Card; readonly b: Card; readonly base: AB; readonly mix: number; readonly picks: Readonly<Record<string, Pick>> };
const zero = (): Record<string, number> => ({ cast: 0, travel: 0, hit: 0, linger: 0 });
const punches = (doc: FxDocValues): boolean => PAGE2.punch.some((k) => { const v = doc[k]; return v !== undefined && v !== 0 && v !== false; });
export function chips(doc: FxDocValues, badges?: Readonly<Record<string, AB | "both">>): Chip[] {
  const rows: Record<string, Record<string, number>> = {};
  stepsOf(doc).forEach((_, i) => { const [layer, beat] = keyOf(doc, i).split(":"); const row = rows[layer ?? ""] ??= zero(); row[beat ?? ""] = (row[beat ?? ""] ?? 0) + 1; });
  if (punches(doc)) rows["punch"] ??= zero();
  return KINDS.flatMap((layer) => { const row = rows[layer]; if (row === undefined) return []; const sides = Object.keys(badges ?? {}).filter((k) => k.startsWith(`${layer}:`)).map((k) => badges?.[k]); const badge = sides.length === 0 ? null : sides.every((s) => s === sides[0]) ? sides[0] ?? null : "both"; return [{ layer, beats: row, badge }]; });
}
export const meterText = (m: Meter): string => `Particles ${m.particles.n} of ${m.particles.cap} · Draws ${m.draws.n} of ${m.draws.cap}`;
export const trimLine = (m: Meter): string | null => { const line = m.line.endsWith(" · Undo") ? m.line.slice(0, -" · Undo".length) : m.line; return line === "" ? null : line; };
export const beatRow = (doc: FxDocValues): { beat: string; span: readonly [number, number] | null; steps: number }[] => { const marks = impactMarks(doc), n = zero(); stepsOf(doc).forEach((_, i) => { const b = keyOf(doc, i).split(":")[1] ?? ""; n[b] = (n[b] ?? 0) + 1; }); return BEATS.map((beat) => ({ beat, span: marks.beats[beat] ?? null, steps: n[beat] ?? 0 })); };
export const mixer = (a: Card, b: Card): Mixer => ({ a, b, base: "a", mix: 50, picks: {} });
export const swap = (m: Mixer): Mixer => ({ ...m, base: m.base === "a" ? "b" : "a" });
export const snap = (m: Mixer, mix: number): Mixer => ({ ...m, mix: typeof mix === "number" && Number.isFinite(mix) ? snapMix(mix) : 50 });
const rank = (k: string): number => KINDS.indexOf((k.split(":")[0] ?? "") as typeof KINDS[number]) * 10 + BEATS.indexOf((k.split(":")[1] ?? "") as typeof BEATS[number]);
export const keysOf = (m: Mixer): string[] => { const keys = new Set<string>(); for (const card of [m.a, m.b]) { stepsOf(card.doc).forEach((_, i) => keys.add(keyOf(card.doc, i))); if (punches(card.doc)) keys.add("punch:hit"); } return [...keys].sort((x, y) => rank(x) - rank(y)); };
export const cycle = (m: Mixer, key: string): Mixer => { const i = PAGE2.picks.indexOf((m.picks[key] ?? "both") as typeof PAGE2.picks[number]); return { ...m, picks: { ...m.picks, [key]: PAGE2.picks[(i + 1) % PAGE2.picks.length] ?? "a" } }; };
export const mixed = (m: Mixer, mint: (prefix: string) => string): Blend => blend(m.a, m.b, { base: m.base, mix: m.mix, mint, picks: m.picks });
export function take(base: Card, other: Card, layer: string, mint: (prefix: string) => string): Blend {
  const picks: Record<string, Pick> = {};
  for (const card of [base, other]) stepsOf(card.doc).forEach((_, i) => { const k = keyOf(card.doc, i); picks[k] = k.startsWith(`${layer}:`) ? "b" : "a"; });
  if (punches(base.doc) || punches(other.doc)) picks["punch:hit"] = layer === "punch" ? "b" : "a";
  return blend(base, other, { base: "a", mix: 0, mint, picks });
}
export const shelve = (shelf: readonly Card[], card: Card): Card[] => [card, ...shelf.filter((c) => c.id !== card.id)].slice(0, PAGE2.shelf);
export const toggle = (picked: readonly string[], id: string): string[] => { const next = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]; return next.length > 3 ? next.slice(next.length - 3) : next; };
export const page3 = (kids: readonly Child[], at: number): { at: number; shown: Child[] } => { const pages = Math.max(1, Math.ceil(kids.length / PAGE2.show)); const n = kids.length === 0 || !Number.isInteger(at) ? 0 : ((at % pages) + pages) % pages; return { at: n, shown: kids.slice(n * PAGE2.show, n * PAGE2.show + PAGE2.show) }; };
export const houseOf = (punch: number, motes: boolean, ramp: string | null, styleRamps: readonly string[]): House => readHouse({ effectHouse: { punch, motes, ramps: ramp === null ? [] : [ramp] } }, styleRamps).house;
