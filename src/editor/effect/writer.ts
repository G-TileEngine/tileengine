import type { FxDocValues } from "../../runtime/render/fx-doc.ts";
import { exportClean } from "./parts.ts";
export type Row = Record<string, unknown>;
export type Change = { readonly knob: string; readonly before: Row; readonly after: Row };
export type Op = { readonly seq: number; readonly at: string; readonly kind: string; readonly changes: readonly Change[]; readonly target?: number; readonly group?: string; readonly note?: string };
export type WriteOpts = { readonly at: string; readonly mint: (prefix: string) => string; readonly group?: string; readonly note?: string };
export const WRITER = { cap: 200, retries: 8, barriers: ["migrate"], ids: { steps: "s-", parts: "p-" } } as const;
const BAD = new Set(["__proto__", "constructor", "prototype"]);
const REN: Record<string, string> = { start_at: "start_at_ms", particle_life: "particle_life_ms", radius_from: "wave_from", radius_to: "wave_radius", ring_thickness_px: "wave_thickness_px", light: "light_mode", flash_center: "anchor", blank_at: "start_mode", ease: "look_ease" };
const TAB: Record<string, Record<string, unknown>> = { light: { off: "off", steady: "steady", pop: "pop" }, flash_center: { hit: "target", caster: "caster", screen: "screen" }, blank_at: { hit: "at-hit", "step-start": "with-last" }, ease: { "fast-out": "out", linear: "linear" } };
const rec = (v: unknown): Row | null => (v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Row) : null);
const own = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);
const omit = (o: Row, k: string): Row => Object.fromEntries(Object.entries(o).filter(([key]) => key !== k));
const num = (v: unknown): number => (typeof v === "number" ? v : 0);
const seqOf = (ops: readonly Row[], base: number): number => (typeof ops[ops.length - 1]?.["seq"] === "number" ? ops[ops.length - 1]?.["seq"] as number : base) + 1;
export function canonStep(step: Row): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(step)) {
    let key = k, val = v;
    if (k === "hold") { if (typeof v === "number") key = "hold_ms"; } else if (k === "flash_seconds") { if (typeof v === "number") { key = "flash_ms"; val = Math.round(v * 1000); } } else if (k === "smear_remnant") { if (typeof v === "boolean") { key = "smear_remnant_ms"; val = v ? 40 : 0; } } else if (own(REN, k) && !own(TAB, k)) key = REN[k] ?? k; else if (own(TAB, k) && own(TAB[k] ?? {}, String(v))) { key = REN[k] ?? k; val = (TAB[k] ?? {})[String(v)]; }
    if (key !== k && (own(step, key) || own(out, key))) continue; out[key] = val;
  }
  return out;
}
export const canonKnob: (knob: string, v: unknown) => unknown = (knob, v) => (knob === "variant_seed" && v === 0 ? undefined : knob === "pixel_scale" && typeof v === "string" && /^[1-6]$/.test(v) ? Number(v) : v);
const answersOf = (doc: Row): Row => rec(doc["answers"]) ?? {};
const stateOf = (answer: Row | null): Row => { const out: Row = answer === null ? { source: "default" } : {}; if (answer !== null) for (const [k, v] of Object.entries(answer)) if (k !== "rev") out[k] = v; return out; };
const listIds = (v: unknown, into: Set<string>): void => { if (!Array.isArray(v)) return; for (const item of v) { const o = rec(item); if (o !== null && typeof o["id"] === "string" && o["id"] !== "") into.add(o["id"]); } };
const readHist = (doc: Row): { cap: number; baseSeq: number; ops: Row[] } => { const h = rec(doc["history"]) ?? {}, capRaw = h["cap"], baseRaw = h["baseSeq"]; return { cap: typeof capRaw === "number" && Number.isInteger(capRaw) && capRaw >= 1 && capRaw <= WRITER.cap ? capRaw : WRITER.cap, baseSeq: typeof baseRaw === "number" && Number.isInteger(baseRaw) ? baseRaw : 0, ops: (Array.isArray(h["ops"]) ? h["ops"] : []).flatMap((op) => { const o = rec(op); return o === null || !Number.isInteger(o["seq"]) || !Array.isArray(o["changes"]) || o["changes"].some((c) => rec(c) === null) ? [] : [o]; }) }; };
export function usedIds(doc: Row, knob: string): Set<string> {
  const ids = new Set<string>(), live = rec(answersOf(doc)[knob]); if (live !== null) listIds(live["value"], ids);
  for (const op of readHist(doc).ops) for (const ch of op["changes"] as unknown[]) { const c = rec(ch); if (c === null || c["knob"] !== knob) continue; const b = rec(c["before"]), a = rec(c["after"]); if (b !== null) listIds(b["value"], ids); if (a !== null) listIds(a["value"], ids); }
  const ans = rec(rec((rec(doc["orphans"]) ?? {})[`${knob}#items`])?.["answer"]); if (ans !== null) listIds(ans["value"], ids); return ids;
}
export const valuesOf: (doc: Row) => FxDocValues = (doc) => { const out: Row = {}; for (const [k, raw] of Object.entries(answersOf(doc))) { const a = rec(raw); if (a === null || a["source"] === "default" || !own(a, "value")) continue; out[k] = a["value"]; } return out; };
const mintId = (prefix: string, held: Set<string>, seen: Set<string>, mint: (p: string) => string): string => { const bad = (id: string): boolean => id === "" || seen.has(id) || held.has(id); for (let i = 0; i <= WRITER.retries; i += 1) { const id = mint(prefix); if (!bad(id)) return id; } const start = held.size + seen.size + 1; for (let n = start; n < start + held.size + seen.size + 2; n += 1) if (!bad(`${prefix}${n}`)) return `${prefix}${n}`; return `${prefix}${start}`; };
const freeze = (doc: Row, knob: "steps" | "parts", list: readonly unknown[], mint: (p: string) => string): { value: Row[]; aliased: boolean } => {
  const prefix = WRITER.ids[knob], held = usedIds(doc, knob), live = new Set<string>(), seen = new Set<string>(), value: Row[] = []; listIds(rec(answersOf(doc)[knob])?.["value"], live); let aliased = false;
  for (const item of list) { const o = rec(item); if (o === null) continue; const step = knob === "steps" ? canonStep(o) : { ...o }; if (knob === "steps" && JSON.stringify(step) !== JSON.stringify(o)) aliased = true; const id = step["id"], keep = typeof id === "string" && id !== "" && !seen.has(id) && (live.has(id) || !held.has(id)), next = keep ? id : mintId(prefix, held, seen, mint); step["id"] = next; seen.add(next); value.push(step); }
  return { value, aliased };
};
const desired = (prev: Row | null, value: unknown): Row => { const kept: Row = {}; if (prev !== null) for (const [k, v] of Object.entries(prev)) if (k !== "rev" && k !== "value" && k !== "source") kept[k] = v; return value === undefined ? { ...kept, source: "default" } : { ...kept, source: "user", value }; };
const same = (a: Row, b: Row): boolean => JSON.stringify(a) === JSON.stringify(b);
const pushOp = (ops: Row[], cap: number, baseSeq: number, op: Row): number => { ops.push(op); while (ops.length > cap) { ops.shift(); baseSeq += 1; } return baseSeq; };
const tag = (op: Row, extra: Row): Row => ({ ...extra, ...(typeof op["group"] === "string" ? { group: op["group"] } : {}) });
export function write(doc: Row, values: Readonly<Record<string, unknown>>, o: WriteOpts): Row {
  const hist = readHist(doc), changes: Change[] = [], aliased = new Set<string>();
  for (const [knob, raw] of Object.entries(values)) { if (BAD.has(knob)) continue; const prev = rec(answersOf(doc)[knob]), frozen = (knob === "steps" || knob === "parts") && Array.isArray(raw) ? freeze(doc, knob, raw, o.mint) : null; if (frozen?.aliased === true) aliased.add(knob); const after = desired(prev, frozen !== null ? frozen.value : canonKnob(knob, raw)), before = stateOf(prev); if (!same(before, after)) changes.push({ knob, before, after }); }
  if (changes.length === 0) return doc;
  const rev = num(doc["rev"]) + 1, answers: Row = { ...answersOf(doc) }, orphans: Row = { ...(rec(doc["orphans"]) ?? {}) };
  for (const ch of changes) { const prev = rec(answers[ch.knob]); answers[ch.knob] = { ...ch.after, rev: num(prev?.["rev"]) + 1 }; if (ch.knob === "steps" && aliased.has("steps")) orphans["steps#items"] = { answer: prev ?? { source: "default" }, removedAtRev: rev, reason: "aliases normalised (M6)" }; }
  const ops = [...hist.ops]; const baseSeq = pushOp(ops, hist.cap, hist.baseSeq, { seq: seqOf(hist.ops, hist.baseSeq), at: o.at, kind: "set", changes, ...(o.group !== undefined ? { group: o.group } : {}), ...(o.note !== undefined ? { note: o.note } : {}) });
  return { ...doc, rev, updatedAt: o.at, answers, orphans, history: { cap: hist.cap, baseSeq, ops } };
}
const undoneOf = (ops: readonly Row[]): Set<number> => { const undone = new Set<number>(); for (const op of ops) { const target = op["target"]; if (typeof target !== "number") continue; if (op["kind"] === "undo") undone.add(target); else if (op["kind"] === "redo") undone.delete(target); } return undone; };
const openOps = (ops: Row[]): Row[] => { let wall = -1; ops.forEach((op, i) => { if ((WRITER.barriers as readonly string[]).includes(String(op["kind"]))) wall = i; }); const undone = undoneOf(ops); return ops.filter((op, i) => i > wall && op["kind"] !== "undo" && op["kind"] !== "redo" && !undone.has(op["seq"] as number)); };
const apply = (answers: Row, knob: string, state: Row): void => { if (BAD.has(knob)) return; answers[knob] = { ...state, rev: num(rec(answers[knob])?.["rev"]) + 1 }; };
const play = (doc: Row, at: string, hist: { cap: number; baseSeq: number; ops: Row[] }, batch: readonly Row[], field: "before" | "after", kind: string): Row => {
  const answers: Row = { ...answersOf(doc) }; let rev = num(doc["rev"]); const ops = [...hist.ops]; let baseSeq = hist.baseSeq;
  for (const op of batch) { for (const ch of (field === "before" ? op["changes"] : (hist.ops.find((item) => item["seq"] === op["target"]) ?? {})["changes"]) as unknown[] | undefined ?? []) { const c = rec(ch); if (c !== null && typeof c["knob"] === "string") apply(answers, c["knob"], rec(c[field]) ?? { source: "default" }); } rev += 1; baseSeq = pushOp(ops, hist.cap, baseSeq, tag(op, { seq: seqOf(ops, baseSeq), at, kind, target: kind === "undo" ? op["seq"] : op["target"], changes: [] })); }
  return { ...doc, rev, updatedAt: at, answers, orphans: { ...(rec(doc["orphans"]) ?? {}) }, history: { cap: hist.cap, baseSeq, ops } };
};
export function undo(doc: Row, at: string): Row {
  const hist = readHist(doc), open = openOps(hist.ops); if (open.length === 0) return doc;
  const top = open[open.length - 1], group = top?.["group"], members = (typeof group === "string" ? open.filter((op) => op["group"] === group) : [top]).filter((op): op is Row => op !== undefined);
  if (typeof group === "string" && open.slice(open.indexOf(members[0] as Row) + 1).some((op) => op["group"] !== group)) return doc;
  return play(doc, at, hist, [...members].reverse(), "before", "undo");
}
export function redo(doc: Row, at: string): Row {
  const hist = readHist(doc), newest = hist.ops[hist.ops.length - 1]; if (newest === undefined || (newest["kind"] !== "undo" && newest["kind"] !== "redo")) return doc;
  const undone = undoneOf(hist.ops), pending = [...hist.ops].reverse().filter((op) => op["kind"] === "undo" && typeof op["target"] === "number" && undone.has(op["target"])), seen = new Set<number>();
  for (const op of pending) {
    const idx = hist.ops.indexOf(op); if (seen.has(idx)) continue; let lo = idx, hi = idx;
    if (typeof op["group"] === "string") { while (lo > 0 && hist.ops[lo - 1]?.["kind"] === "undo" && hist.ops[lo - 1]?.["group"] === op["group"]) lo -= 1; while (hi + 1 < hist.ops.length && hist.ops[hi + 1]?.["kind"] === "undo" && hist.ops[hi + 1]?.["group"] === op["group"]) hi += 1; }
    for (let j = lo; j <= hi; j += 1) seen.add(j);
    const held = hist.ops.slice(lo, hi + 1).filter((p) => hist.ops.some((item) => item["seq"] === p["target"] && item["kind"] !== "undo" && item["kind"] !== "redo"));
    if (held.length === 0) continue; return play(doc, at, hist, [...held].sort((a, b) => (a["target"] as number) - (b["target"] as number)), "after", "redo");
  }
  return doc;
}
export function exportEffect(doc: Row, o?: { clean?: boolean }): Row {
  if (o?.clean !== true) return doc;
  const hist = readHist(doc), answers: Row = { ...answersOf(doc) }, parts = rec(answers["parts"]); if (parts !== null && Array.isArray(parts["value"])) answers["parts"] = { ...parts, value: exportClean({ parts: parts["value"] as FxDocValues["parts"] })["parts"] };
  const last = hist.ops[hist.ops.length - 1]?.["seq"]; return { ...doc, answers, orphans: omit(rec(doc["orphans"]) ?? {}, "parts#items"), history: { cap: hist.cap, baseSeq: typeof last === "number" ? last : hist.baseSeq, ops: [] } };
}
