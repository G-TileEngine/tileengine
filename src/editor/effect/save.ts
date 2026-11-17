import type { Notice } from "../../core/notice.ts";
import { redo, undo, write, WRITER, type Row } from "./writer.ts";
export const SAVE = { knob: "effect", dir: "effects/", trash: "effects/.deleted/", id: /^setup_[0-9A-HJKMNP-TV-Z]{26}$/, refused: "changed since; undo there first", bad: ["__proto__", "constructor", "prototype"] } as const;
export type Store = { read(name: string): Promise<string | null>; write(name: string, text: string): Promise<void>; remove(name: string): Promise<void> };
export type Docs = Readonly<Record<string, Row>>;
export type Entry = { readonly group: string; readonly docs: readonly string[]; readonly created: readonly string[] };
export type Move = { readonly from: string; readonly to: string; readonly doc: Row };
export type Commit = { readonly saved: readonly string[]; readonly moved: readonly string[] } | { readonly error: "staleRev"; readonly name: string; readonly want: number | null; readonly got: number | null };
const rec = (v: unknown): Row | null => (v !== null && typeof v === "object" && !Array.isArray(v) ? v as Row : null);
const bad = (k: string): boolean => (SAVE.bad as readonly string[]).includes(k);
const opsOf = (d: Row): Row[] => { const h = rec(d["history"]); return Array.isArray(h?.["ops"]) ? h["ops"] as Row[] : []; };
const textOf = (d: Row): string => `${JSON.stringify(d, null, 2)}\n`;
const note = (message: string): Notice => ({ code: "invalidValue", message });
export const blankEffect = (id: string, name: string, at: string, catalogueRev: number): Row => ({ kind: "behaviour-setup", formatVersion: 3, behaviourId: "effect", id, name, rev: 0, catalogue: { rev: catalogueRev }, createdAt: at, updatedAt: at, copiedFrom: null, answers: {}, orphans: {}, history: { cap: WRITER.cap, baseSeq: 0, ops: [] } });
export function notesOf(doc: Row, values?: Readonly<Record<string, unknown>>): Notice[] {
  const notes: Notice[] = [];
  if (values !== undefined) for (const k of Object.keys(values)) if (bad(k)) notes.push(note(`knob "${k}" skipped`));
  for (const k of Object.keys(rec(doc["answers"]) ?? {})) if (bad(k)) notes.push(note(`answers["${k}"] ignored`));
  const junk = opsOf(doc).filter((op) => { const o = rec(op); return o === null || !Number.isInteger(o["seq"]) || !Array.isArray(o["changes"]) || (o["changes"] as unknown[]).some((c) => rec(c) === null); }).length;
  if (junk > 0) notes.push(note(`${junk} history op(s) dropped`));
  if (values !== undefined) for (const knob of ["steps", "parts"] as const) { const list = values[knob]; if (!Array.isArray(list)) continue; const n = list.filter((item) => rec(item) === null).length; if (n > 0) notes.push(note(`${n} non-record ${knob} item(s) dropped`)); }
  return notes;
}
export const undoStep = (doc: Row, at: string): Row => { const next = undo(doc, at); return next === doc ? undo(doc, at, { alone: true }) : next; };
export const trashOf = (name: string): string => `${SAVE.trash}${name.slice(name.lastIndexOf("/") + 1)}`;
export function ownerOf(name: string, text: string | null): { doc: Row | null } | { error: "staleRev"; name: string; message: string } {
  if (text === null) return { doc: null };
  const no = (why: string): { error: "staleRev"; name: string; message: string } => ({ error: "staleRev", name, message: `Not saved: can't read ${name} (${why}). Nothing was changed.` });
  let v: unknown; try { v = JSON.parse(text); } catch { return no("unreadable"); }
  const o = rec(v), rev = o?.["rev"], ok = o !== null && o["kind"] === "behaviour-setup" && typeof o["formatVersion"] === "number" && typeof o["id"] === "string" && typeof o["behaviourId"] === "string" && typeof rev === "number" && Number.isInteger(rev) && rev >= 0 && rec(o["answers"]) !== null && rec(o["history"]) !== null;
  return ok && o !== null ? { doc: o } : no(o === null ? "unreadable" : "no setup envelope");
}
export function saveAndUse(effect: { name: string; doc: Row | null; values: Readonly<Record<string, unknown>> }, owner: { name: string; doc: Row }, o: { at: string; mint: (prefix: string) => string; id: string; label: string; catalogueRev: number; taken?: readonly string[] }): { docs: Record<string, Row>; entry: Entry; absent: string[]; notes: Notice[] } | { error: "invalidValue"; message: string } {
  const fresh = effect.doc === null;
  if (fresh && !(SAVE.id.test(o.id) && !(o.taken ?? []).includes(o.id) && effect.name === `${SAVE.dir}${o.id}.json`)) return { error: "invalidValue", message: "a new effect needs a fresh setup_<ULID> at effects/<id>.json" };
  const group = o.mint("grp_"), base = fresh ? blankEffect(o.id, o.label, o.at, o.catalogueRev) : effect.doc ?? blankEffect(o.id, o.label, o.at, o.catalogueRev), notes = notesOf(base, effect.values);
  const nextE = write(base, effect.values, { at: o.at, mint: o.mint, group }), nextO = write(owner.doc, { [SAVE.knob]: o.id }, { at: o.at, mint: o.mint, group }), docs: Record<string, Row> = { [effect.name]: nextE, [owner.name]: nextO }, names: string[] = [];
  if (fresh || nextE !== base) names.push(effect.name);
  if (nextO !== owner.doc) names.push(owner.name);
  return { docs, entry: { group, docs: names, created: fresh ? [effect.name] : [] }, absent: fresh ? [trashOf(effect.name)] : [], notes };
}
export function undoGroup(docs: Docs, entry: Entry, at: string): { docs: Record<string, Row>; moves: Move[] } | { error: typeof SAVE.refused; name: string } {
  let out: Record<string, Row> = { ...docs };
  const moves: Move[] = [];
  for (const name of [...entry.docs].reverse()) {
    const doc = docs[name]; if (doc === undefined) return { error: SAVE.refused, name };
    const next = undo(doc, at), created = entry.created.includes(name);
    if (next === doc ? !(created && opsOf(doc).length === 0) : opsOf(next).filter((op) => !opsOf(doc).includes(op)).some((op) => op["group"] !== entry.group)) return { error: SAVE.refused, name };
    if (created) { out = Object.fromEntries(Object.entries(out).filter(([k]) => k !== name)); moves.push({ from: name, to: trashOf(name), doc: next }); } else out[name] = next;
  }
  return { docs: out, moves };
}
export function redoGroup(docs: Docs, entry: Entry, moved: readonly Move[], at: string): { docs: Record<string, Row>; moves: Move[] } | { error: typeof SAVE.refused; name: string } {
  const out: Record<string, Row> = { ...docs }; const moves: Move[] = [];
  for (const name of entry.docs) {
    const created = entry.created.includes(name), back = created ? moved.find((m) => m.from === name) : undefined, doc = created ? back?.doc : docs[name];
    if (doc === undefined || (created && (back === undefined || docs[name] !== undefined))) return { error: SAVE.refused, name };
    if (created && back !== undefined && opsOf(doc).length === 0) { out[name] = doc; moves.push({ from: back.to, to: name, doc }); continue; }
    const next = redo(doc, at);
    if (next === doc || opsOf(next).filter((op) => !opsOf(doc).includes(op)).some((op) => op["group"] !== entry.group)) return { error: SAVE.refused, name };
    out[name] = next; if (created && back !== undefined) moves.push({ from: back.to, to: name, doc: next });
  }
  return { docs: out, moves };
}
export const trashGone: (r: Commit, moves: readonly Move[]) => string | null = (r, moves) => ("error" in r && r.got === null ? moves.find((m) => m.from === r.name)?.from ?? null : null);
const wantOf = (expected: Readonly<Record<string, number | null>>, name: string): number | null => (Object.hasOwn(expected, name) ? expected[name] ?? null : null);
async function gotOf(store: Store, name: string): Promise<number | null> { const text = await store.read(name); if (text === null) return null; try { const o = rec(JSON.parse(text) as unknown); return o === null ? 0 : typeof o["rev"] === "number" ? o["rev"] : 0; } catch { return 0; } }
export async function commit(store: Store, docs: Docs, expected: Readonly<Record<string, number | null>>, o?: { moves?: readonly Move[]; absent?: readonly string[] }): Promise<Commit> {
  const moves = o?.moves ?? [], absent = o?.absent ?? [], names = Object.keys(docs), isNew = (name: string): boolean => wantOf(expected, name) === null;
  const touch: readonly (readonly [string, number | null])[] = [...names.map((name) => [name, wantOf(expected, name)] as const), ...moves.flatMap((m) => [[m.from, wantOf(expected, m.from)] as const, [m.to, null] as const]), ...absent.map((name) => [name, null] as const)];
  for (const [name, want] of touch) { const got = await gotOf(store, name); if (got !== want) return { error: "staleRev", name, want, got }; }
  const row = (name: string): { name: string; text: string } => ({ name, text: textOf(docs[name] ?? {}) });
  const acts: { name: string; text: string | null }[] = [...moves.map((m) => ({ name: m.to, text: textOf(m.doc) })), ...names.filter(isNew).map(row), ...names.filter((n) => !isNew(n)).map(row), ...moves.map((m) => ({ name: m.from, text: null }))];
  const done: { name: string; prior: string | null }[] = [];
  try { for (const act of acts) { const prior = await store.read(act.name); if (act.text === null) await store.remove(act.name); else await store.write(act.name, act.text); done.push({ name: act.name, prior }); } }
  catch (e) { for (let i = done.length - 1; i >= 0; i -= 1) { const d = done[i]; if (d === undefined) continue; if (d.prior === null) await store.remove(d.name); else await store.write(d.name, d.prior); } throw e; }
  return { saved: names, moved: moves.map((m) => m.to) };
}
