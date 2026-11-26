import { copyName } from "../project/home.ts";
import { SAVE, blankEffect, trashOf } from "./save.ts";
import { WRITER, write, type Row } from "./writer.ts";
export const FX_KNOBS = ["hit_stop_ms", "hit_white_ms", "hit_white_mode", "shake", "shake_ms", "squash", "tint_ramp", "connect"] as const;
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
export type EffectRow = { readonly id: string; readonly name: string; readonly used: number };
const revOf = (doc: Obj): number => (typeof doc["rev"] === "number" ? doc["rev"] : 0);
const catRev = (bag: Record<string, Obj>): number => { const project = bag["project.json"]?.["project"]; return isObj(project) && typeof project["catalogueRev"] === "number" ? project["catalogueRev"] : 0; };
const clone = (v: unknown): Obj => (isObj(v) ? structuredClone(v) : {});
export function effectRows(bag: Record<string, Obj>): EffectRow[] {
  const rows: EffectRow[] = [];
  for (const [path, doc] of Object.entries(bag)) {
    if (!path.startsWith("effects/") || path.slice("effects/".length).includes("/") || doc["behaviourId"] !== "effect" || typeof doc["id"] !== "string") continue;
    const id = doc["id"]; let used = 0;
    for (const [sp, setup] of Object.entries(bag)) { const answers = sp.startsWith("setups/") ? setup["answers"] : undefined; if (isObj(answers) && isObj(answers["effect"]) && answers["effect"]["value"] === id) used += 1; }
    rows.push({ id, name: typeof doc["name"] === "string" ? doc["name"] : id, used });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
const pathOf = (bag: Record<string, Obj>, id: string): string | null => { for (const [path, doc] of Object.entries(bag)) if (path.startsWith("effects/") && !path.slice("effects/".length).includes("/") && doc["id"] === id) return path; return null; };
export function newEffect(bag: Record<string, Obj>, id: string, at: string, mint: (prefix: string) => string): Record<string, Obj> {
  const names = effectRows(bag).map((row) => row.name); let n = 1; while (names.includes(`Effect ${n}`)) n += 1;
  const doc = write(blankEffect(id, `Effect ${n}`, at, catRev(bag)), { steps: [{ id: "s-1", kind: "stamp", seconds: 0.25 }] }, { at, mint });
  return { ...bag, [`effects/${id}.json`]: doc };
}
export function editEffect(bag: Record<string, Obj>, id: string, knob: string, value: unknown, at: string, mint: (prefix: string) => string): Record<string, Obj> {
  if (!(FX_KNOBS as readonly string[]).includes(knob)) return bag;
  const path = pathOf(bag, id); if (path === null) return bag;
  const doc = bag[path] ?? {}, next = write(doc, { [knob]: value }, { at, mint });
  return next === doc ? bag : { ...bag, [path]: next };
}
export function renameEffect(bag: Record<string, Obj>, id: string, raw: string, at: string): Record<string, Obj> {
  const name = raw.trim(), n = [...name].length; if (n < 1 || n > 40) return bag;
  const path = pathOf(bag, id); if (path === null) return bag;
  const doc = bag[path] ?? {}; if (doc["name"] === name) return bag;
  return { ...bag, [path]: { ...doc, name, rev: revOf(doc) + 1, updatedAt: at } };
}
export function duplicateEffect(bag: Record<string, Obj>, id: string, newId: string, at: string): Record<string, Obj> | null {
  if (!SAVE.id.test(id) || !SAVE.id.test(newId)) return null;
  const path = pathOf(bag, id); if (path === null) return null;
  const doc = bag[path] ?? {}, name = typeof doc["name"] === "string" ? doc["name"] : "Effect";
  const copy: Row = { ...doc, id: newId, name: copyName(name, effectRows(bag).map((row) => row.name)), rev: 1, createdAt: at, updatedAt: at, copiedFrom: { setupId: id, rev: revOf(doc), at }, answers: clone(doc["answers"]), orphans: clone(doc["orphans"]), history: { cap: WRITER.cap, baseSeq: 0, ops: [{ seq: 1, at, kind: "set", changes: [], note: "duplicate" }] } };
  return { ...bag, [`effects/${newId}.json`]: copy };
}
export function deleteEffect(bag: Record<string, Obj>, id: string, toNone: boolean): Record<string, Obj> {
  const path = pathOf(bag, id); if (path === null) return bag;
  const next: Record<string, Obj> = {}; for (const [key, doc] of Object.entries(bag)) if (key !== path) next[key] = doc;
  next[trashOf(path)] = bag[path] ?? {};
  if (toNone) for (const [sp, setup] of Object.entries(next)) { const answers = sp.startsWith("setups/") ? setup["answers"] : undefined; if (isObj(answers) && isObj(answers["effect"]) && answers["effect"]["value"] === id) next[sp] = { ...setup, answers: { ...answers, effect: { source: "user", value: "none" } } }; }
  return next;
}
