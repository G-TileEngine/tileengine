import { sliceDoc, sliceOf, type CatalogueDoc } from "../../project/slice-of.ts";
import { ruleOf, type RuleBag, type RuleHit } from "../../project/rule-of.ts";
import { addCase, catalogueRev } from "../unit/add.ts";
import { resetAnswer, setAnswer } from "../unit/panel.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const behaviours = (doc: Obj): Obj[] => list(doc["behaviours"]).filter(isObj);
export function ruleBag(files: Obj): RuleBag {
  const stages: Record<string, Obj> = {}, setups: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(files)) {
    if (!isObj(doc) || typeof doc["id"] !== "string") continue;
    if (path.startsWith("stages/")) stages[doc["id"]] = doc; else if (path.startsWith("setups/")) setups[doc["id"]] = doc;
  }
  return { manifest: files["project.json"], stages, setups };
}
export const ruleLine = (source: RuleHit["source"]): string => source === "stage" ? "This stage's rule" : source === "project" ? "Same as project" : "Default rule";
const copyBag = (files: Obj): Record<string, Obj> => { const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(files)) if (isObj(doc)) bag[path] = doc; return bag; };
const usedIds = (slice: Obj): string[] => behaviours(slice).flatMap((row) => typeof row["id"] === "string" ? [row["id"]] : []);
function answersOf(row: Obj): Obj {
  const answers: Obj = {}; for (const knob of list(row["knobs"]).filter(isObj)) { if (typeof knob["id"] !== "string" || !Object.hasOwn(knob, "default") || (typeof knob["no_default_reason"] === "string" && knob["no_default_reason"] !== "")) continue; answers[knob["id"]] = { source: "default" }; } return answers;
}
function stageAt(files: Obj, stageId: string): { readonly path: string; readonly doc: Obj } | null { for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && doc["id"] === stageId) return { path, doc }; return null; }
function held(files: Obj, stage: Obj, behaviourId: string): { readonly path: string; readonly doc: Obj } | null { for (const id of list(stage["rules"])) if (typeof id === "string") { const doc = files[`setups/${id}.json`]; if (isObj(doc) && doc["behaviourId"] === behaviourId) return { path: `setups/${id}.json`, doc }; } return null; }
export type RuleWrite = { readonly mode: "wrote"; readonly bag: Record<string, Obj>; readonly slice: string } | { readonly mode: "older" | "newer" | "missing" };
export function setStageRule(files: Obj, skel: Obj, stageId: string, setupId: string, behaviourId: string, knob: string, value: unknown, bundled: CatalogueDoc): RuleWrite {
  const gate = addCase(files, bundled); if (gate.mode !== "same") return { mode: gate.mode === "newer" ? "newer" : "older" };
  const stage = stageAt(files, stageId), slice = files["catalogue/slice.json"]; if (stage === null || !isObj(slice)) return { mode: "missing" };
  const row = behaviours(bundled).find((item) => item["id"] === behaviourId); if (row === undefined) return { mode: "missing" };
  const spec = list(row["knobs"]).filter(isObj).find((item) => item["id"] === knob), def = spec?.["default"];
  const have = held(files, stage.doc, behaviourId);
  if (have !== null) {
    const answers = isObj(have.doc["answers"]) ? have.doc["answers"] : {}, bag = copyBag(files);
    bag[have.path] = { ...have.doc, answers: setAnswer(answers, knob, value, def) };
    return { mode: "wrote", bag, slice: "" };
  }
  const next = structuredClone(skel), catalogue = isObj(next["catalogue"]) ? { ...next["catalogue"] } : {};
  next["id"] = setupId; next["name"] = "Rule"; next["behaviourId"] = behaviourId; catalogue["rev"] = catalogueRev(bundled); next["catalogue"] = catalogue;
  next["answers"] = setAnswer(answersOf(row), knob, value, def);
  const ids = [...list(stage.doc["rules"]).filter((id): id is string => typeof id === "string"), setupId], used = usedIds(slice);
  if (!used.includes(behaviourId)) used.push(behaviourId);
  const sliced = sliceDoc(bundled, used); if (!isObj(sliced)) return { mode: "missing" };
  const bag = copyBag(files);
  bag[stage.path] = { ...stage.doc, rules: ids }; bag[`setups/${setupId}.json`] = next; bag["catalogue/slice.json"] = sliced;
  return { mode: "wrote", bag, slice: sliceOf(bundled, used) };
}
export function resetStageRule(files: Obj, stageId: string, behaviourId: string, knob: string): RuleWrite {
  const stage = stageAt(files, stageId); if (stage === null) return { mode: "missing" };
  const have = held(files, stage.doc, behaviourId); if (have === null) return { mode: "wrote", bag: files as Record<string, Obj>, slice: "" };
  const answers = isObj(have.doc["answers"]) ? have.doc["answers"] : {}, bag = copyBag(files);
  bag[have.path] = { ...have.doc, answers: resetAnswer(answers, knob) };
  return { mode: "wrote", bag, slice: "" };
}
export const sourceOf = (files: Obj, stageId: string, behaviourId: string): RuleHit => ruleOf(ruleBag(files), stageId, behaviourId);
