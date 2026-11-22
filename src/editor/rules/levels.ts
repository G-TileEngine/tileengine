import { sliceDoc, sliceOf, type CatalogueDoc } from "../../project/slice-of.ts";
import { addCase, catalogueRev } from "../unit/add.ts";
import { setAnswer } from "../unit/panel.ts";
type Obj = Record<string, unknown>;
type Bag = Record<string, Obj>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const behaviours = (doc: Obj): Obj[] => list(doc["behaviours"]).filter(isObj);
const ints = (v: unknown): number[] => (Array.isArray(v) ? v.filter((n): n is number => typeof n === "number" && Number.isInteger(n)) : []);
const copyBag = (files: Bag): Bag => { const bag: Bag = {}; for (const [path, doc] of Object.entries(files)) if (isObj(doc)) bag[path] = doc; return bag; };
export type LevelWrite = { readonly mode: "wrote"; readonly bag: Bag; readonly slice: string } | { readonly mode: "older" | "newer" | "missing" };
const held = (files: Bag): { readonly root: Obj; readonly project: Obj } | null => { const root = files["project.json"]; return isObj(root) && isObj(root["project"]) ? { root, project: root["project"] } : null; };
const spec = (files: Bag, id: string): Obj | null => { const slice = files["catalogue/slice.json"]; if (!isObj(slice)) return null; const row = behaviours(slice).find((item) => item["id"] === "xp-levels"); return row === undefined ? null : list(row["knobs"]).filter(isObj).find((item) => item["id"] === id) ?? null; };
const boxOf = (knob: Obj): { readonly min: number; readonly max: number } | null => { const min = knob["min"], max = knob["max"]; return typeof min === "number" && typeof max === "number" && Number.isInteger(min) && Number.isInteger(max) && min <= max ? { min, max } : null; };
const clamp = (n: number, min: number, max: number): number => n < min ? min : n > max ? max : n;
const answersOf = (setup: Obj): Obj => (isObj(setup["answers"]) ? setup["answers"] : { source: "unset" });
const readNum = (answers: Obj, knob: Obj): number | null => { const id = knob["id"]; if (typeof id !== "string") return null; const row = answers[id], raw = isObj(row) && row["source"] !== "default" && typeof row["value"] === "number" ? row["value"] : knob["default"]; return typeof raw === "number" && Number.isInteger(raw) ? raw : null; };
const readList = (answers: Obj, knob: Obj): number[] | null => { const row = answers["thresholds"], def = ints(knob["default"]); if (def.length === 0) return null; if (!(isObj(row) && row["source"] !== "default")) return def; if (!Array.isArray(row["value"])) return null; const got = ints(row["value"]); return got.length === row["value"].length ? got : null; };
export function levelsOf(files: Bag): Obj | null { const root = held(files); if (root === null) return null; for (const id of list(root.project["rules"])) { if (typeof id !== "string") continue; const doc = files[`setups/${id}.json`]; if (isObj(doc) && doc["behaviourId"] === "xp-levels") return doc; } return null; }
const kept = (files: Bag): Obj | null => { for (const [path, doc] of Object.entries(files)) if (path.startsWith("setups/") && isObj(doc) && doc["behaviourId"] === "xp-levels") return doc; return null; };
export type Curve = { readonly n: number; readonly total: number; readonly move: number; readonly rows: readonly number[]; readonly levelMin: number; readonly levelMax: number; readonly rowMin: number; readonly rowMax: number; readonly moveMin: number; readonly moveMax: number; readonly levelLabel: string; readonly moveLabel: string };
export function curveOf(files: Bag): Curve | null {
  const setup = levelsOf(files); if (setup === null) return null;
  const levels = spec(files, "levels"), thresholds = spec(files, "thresholds"), xp = spec(files, "xp_move"); if (levels === null || thresholds === null || xp === null) return null;
  const lb = boxOf(levels), rb = boxOf(thresholds), mb = boxOf(xp); if (lb === null || rb === null || mb === null) return null;
  const n0 = readNum(answersOf(setup), levels), full = readList(answersOf(setup), thresholds), move = readNum(answersOf(setup), xp); if (n0 === null || full === null || move === null) return null;
  const defaults = ints(thresholds["default"]), n = clamp(n0, lb.min, lb.max), rows: number[] = [];
  for (let i = 0; i < n; i += 1) { const raw = full[i] ?? defaults[i]; if (typeof raw !== "number") return null; rows.push(clamp(raw, rb.min, rb.max)); }
  if (typeof levels["label"] !== "string" || typeof xp["label"] !== "string") return null;
  return { n, total: rows.reduce((sum, v) => sum + v, 0), move: clamp(move, mb.min, mb.max), rows, levelMin: lb.min, levelMax: lb.max, rowMin: rb.min, rowMax: rb.max, moveMin: mb.min, moveMax: mb.max, levelLabel: levels["label"], moveLabel: xp["label"] };
}
export const curveTotal = (files: Bag): number | null => { const got = curveOf(files); return got === null ? null : got.total; };
const blank = (row: Obj): Obj => { const answers: Obj = {}; for (const knob of list(row["knobs"]).filter(isObj)) { if (typeof knob["id"] !== "string" || !Object.hasOwn(knob, "default")) continue; const reason = knob["no_default_reason"]; if (typeof reason === "string" && reason !== "") continue; answers[knob["id"]] = { source: "default" }; } return answers; };
const write = (files: Bag, answers: Obj): LevelWrite => { const setup = levelsOf(files); if (setup === null || typeof setup["id"] !== "string") return { mode: "missing" }; const bag = copyBag(files); bag[`setups/${setup["id"]}.json`] = { ...setup, answers }; return { mode: "wrote", bag, slice: "" }; };
const putList = (answers: Obj, knob: Obj, rows: readonly number[]): Obj => { const def = ints(knob["default"]), same = rows.length === def.length && rows.every((n, i) => n === def[i]); return { ...answers, thresholds: same ? { source: "default" } : { source: "user", value: [...rows], rev: 1 } }; };
export function turnOn(files: Bag, skel: Obj, setupId: string, bundled: CatalogueDoc): LevelWrite {
  const gate = addCase(files, bundled); if (gate.mode !== "same") return { mode: gate.mode === "newer" ? "newer" : "older" };
  const root = held(files), slice = files["catalogue/slice.json"]; if (root === null || !isObj(slice)) return { mode: "missing" };
  if (levelsOf(files) !== null) return { mode: "wrote", bag: files, slice: "" };
  const have = kept(files), id = have !== null && typeof have["id"] === "string" ? have["id"] : setupId, bag = copyBag(files);
  const ids = [...list(root.project["rules"]).filter((item): item is string => typeof item === "string")]; if (!ids.includes(id)) ids.push(id);
  bag["project.json"] = { ...root.root, project: { ...root.project, rules: ids } }; if (have !== null) return { mode: "wrote", bag, slice: "" };
  const row = behaviours(bundled).find((item) => item["id"] === "xp-levels"), cat0 = skel["catalogue"]; if (row === undefined || !isObj(cat0)) return { mode: "missing" };
  const next = structuredClone(skel), catalogue = { ...cat0 };
  next["id"] = setupId; next["name"] = "Rule"; next["behaviourId"] = "xp-levels"; catalogue["rev"] = catalogueRev(bundled); next["catalogue"] = catalogue; next["answers"] = blank(row);
  const used = behaviours(slice).flatMap((item) => typeof item["id"] === "string" ? [item["id"]] : []); if (!used.includes("xp-levels")) used.push("xp-levels");
  const sliced = sliceDoc(bundled, used); if (!isObj(sliced)) return { mode: "missing" };
  bag[`setups/${setupId}.json`] = next; bag["catalogue/slice.json"] = sliced; return { mode: "wrote", bag, slice: sliceOf(bundled, used) };
}
export function turnOff(files: Bag): LevelWrite { const root = held(files), setup = levelsOf(files); if (root === null || setup === null || typeof setup["id"] !== "string") return { mode: "missing" }; const bag = copyBag(files); bag["project.json"] = { ...root.root, project: { ...root.project, rules: list(root.project["rules"]).filter((item) => item !== setup["id"]) } }; return { mode: "wrote", bag, slice: "" }; }
export function setLevels(files: Bag, n: number): LevelWrite {
  const view = curveOf(files), setup = levelsOf(files), knob = spec(files, "levels"), listKnob = spec(files, "thresholds"); if (view === null || setup === null || knob === null || listKnob === null || !Number.isFinite(n)) return { mode: "missing" };
  const count = clamp(Math.round(n), view.levelMin, view.levelMax), full = readList(answersOf(setup), listKnob), defaults = ints(listKnob["default"]); if (full === null) return { mode: "missing" };
  const rows: number[] = []; for (let i = 0; i < count; i += 1) { const raw = full[i] ?? defaults[i]; if (typeof raw !== "number") return { mode: "missing" }; rows.push(clamp(raw, view.rowMin, view.rowMax)); }
  return write(files, putList(setAnswer(answersOf(setup), "levels", count, knob["default"]), listKnob, rows));
}
export function setThreshold(files: Bag, i: number, v: number): LevelWrite {
  const view = curveOf(files), setup = levelsOf(files), listKnob = spec(files, "thresholds"); if (view === null || setup === null || listKnob === null || !Number.isInteger(i) || i < 0 || i >= view.rows.length || !Number.isFinite(v)) return { mode: "missing" };
  return write(files, putList(answersOf(setup), listKnob, view.rows.map((n, at) => at === i ? clamp(Math.round(v), view.rowMin, view.rowMax) : n)));
}
export function resetCurve(files: Bag): LevelWrite { const setup = levelsOf(files); return setup === null ? { mode: "missing" } : write(files, { ...answersOf(setup), thresholds: { source: "default" } }); }
export function setXpMove(files: Bag, v: number): LevelWrite { const view = curveOf(files), setup = levelsOf(files), knob = spec(files, "xp_move"); if (view === null || setup === null || knob === null || !Number.isFinite(v)) return { mode: "missing" }; return write(files, setAnswer(answersOf(setup), "xp_move", clamp(Math.round(v), view.moveMin, view.moveMax), knob["default"])); }
