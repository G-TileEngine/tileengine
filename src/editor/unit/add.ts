import { sliceDoc, sliceOf, type CatalogueDoc } from "../../project/slice-of.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const ORDER = ["move", "attack", "defend", "support", "spells", "status", "ai"];
const TITLE: Readonly<Record<string, string>> = { move: "Move", attack: "Attack", defend: "Defend", support: "Support", spells: "Spells", status: "Status", ai: "AI" };
export const OFFER = "New abilities are available. Update this project to use them?";
export const BIGGER = "This project needs a bigger update than the maker can do yet.";
export const NEWER = "This project was made with a newer TileEngine. Update the app to add abilities.";
export const OTHER = "Other abilities";
export type AddEntry = { readonly id: string; readonly name: string; readonly summary: string; readonly goal: string }; export type GoalBin = { readonly title: string; readonly goal: string; readonly cards: readonly AddEntry[] };
export type AddCase = { readonly mode: "same" } | { readonly mode: "older"; readonly text: string; readonly update: boolean } | { readonly mode: "newer"; readonly text: string };
const behaviours = (doc: Obj): Obj[] => list(doc["behaviours"]).filter(isObj);
const knobsOf = (row: Obj): Obj[] => list(row["knobs"]).filter(isObj);
const revNum = (v: unknown): number => (typeof v === "number" && Number.isInteger(v) ? v : -1);
export function projectRev(files: Obj): number { const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null; return revNum(project?.["catalogueRev"]); }
export function catalogueRev(doc: Obj): number { return revNum(doc["catalogue_rev"]); }
function held(files: Obj, unit: Obj): Set<string> { const ids = new Set<string>(); for (const sid of list(unit["setupIds"])) { const setup = typeof sid === "string" ? files[`setups/${sid}.json`] : undefined; if (isObj(setup) && typeof setup["behaviourId"] === "string") ids.add(setup["behaviourId"]); } return ids; }
export function addable(bundled: Obj, wired: Readonly<Record<string, readonly string[]>>, unit: Obj, files: Obj): readonly AddEntry[] {
  const have = held(files, unit), out: AddEntry[] = [];
  for (const row of behaviours(bundled)) {
    const id = row["id"]; if (typeof id !== "string" || wired[id] === undefined || !list(row["composable_as"]).includes("primary") || have.has(id)) continue;
    const goal = typeof row["goal"] === "string" ? row["goal"] : "";
    out.push({ id, name: typeof row["name"] === "string" ? row["name"] : id, summary: typeof row["summary"] === "string" ? row["summary"] : "", goal });
  }
  return out;
}
export function byGoal(cards: readonly AddEntry[]): readonly GoalBin[] {
  const known = new Set(ORDER), bins: GoalBin[] = [];
  for (const goal of ORDER) { const mine = cards.filter((card) => card.goal === goal); if (mine.length > 0) bins.push({ title: TITLE[goal] ?? goal, goal, cards: mine }); }
  const rest = cards.filter((card) => !known.has(card.goal));
  if (rest.length > 0) bins.push({ title: OTHER, goal: "", cards: rest });
  return bins;
}
export function addCase(files: Obj, bundled: Obj): AddCase {
  const p = projectRev(files), b = catalogueRev(bundled);
  if (p === b) return { mode: "same" };
  if (p > b) return { mode: "newer", text: NEWER };
  const update = canUpdate(isObj(files["catalogue/slice.json"]) ? files["catalogue/slice.json"] : {}, bundled);
  return { mode: "older", text: update ? OFFER : BIGGER, update };
}
const sig = (knob: Obj): string => JSON.stringify({ id: knob["id"], type: knob["type"], d: Object.hasOwn(knob, "default") ? knob["default"] : null, o: knob["options"] ?? null, min: knob["min"] ?? null, max: knob["max"] ?? null, step: knob["step"] ?? null, max_len: knob["max_len"] ?? null });
export function canUpdate(slice: Obj, bundled: Obj): boolean {
  const live = new Map(behaviours(bundled).map((row) => [String(row["id"]), row]));
  for (const row of behaviours(slice)) {
    const next = live.get(String(row["id"])); if (next === undefined) return false;
    const a = knobsOf(row), b = knobsOf(next); if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) { const left = a[i], right = b[i]; if (left === undefined || right === undefined || sig(left) !== sig(right)) return false; }
  }
  return true;
}
function answersOf(row: Obj): Obj {
  const answers: Obj = {};
  for (const knob of knobsOf(row)) {
    if (typeof knob["id"] !== "string" || !Object.hasOwn(knob, "default")) continue;
    const reason = knob["no_default_reason"]; if (typeof reason === "string" && reason !== "") continue;
    answers[knob["id"]] = { source: "default" };
  }
  return answers;
}
function usedIds(slice: Obj): string[] { return behaviours(slice).flatMap((row) => typeof row["id"] === "string" ? [row["id"]] : []); }
function copyBag(files: Obj): Record<string, Obj> { const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(files)) if (isObj(doc)) bag[path] = doc; return bag; }
export type Added = { readonly mode: "added"; readonly bag: Record<string, Obj>; readonly slice: string };
export type AddStop = { readonly mode: "older" | "newer" | "missing" };
export function addAbility(files: Obj, skel: Obj, unitId: string, setupId: string, behaviourId: string, bundled: CatalogueDoc): Added | AddStop {
  const gate = addCase(files, bundled); if (gate.mode !== "same") return { mode: gate.mode === "newer" ? "newer" : "older" };
  const unit = files[`units/${unitId}.json`], slice = files["catalogue/slice.json"]; if (!isObj(unit) || !isObj(slice)) return { mode: "missing" };
  const row = behaviours(bundled).find((item) => item["id"] === behaviourId); if (row === undefined || held(files, unit).has(behaviourId)) return { mode: "missing" };
  const next = structuredClone(skel), catalogue = isObj(next["catalogue"]) ? { ...next["catalogue"] } : {};
  next["id"] = setupId; next["name"] = typeof row["name"] === "string" ? row["name"] : behaviourId; next["behaviourId"] = behaviourId; catalogue["rev"] = catalogueRev(bundled); next["catalogue"] = catalogue; next["answers"] = answersOf(row);
  const ids = [...list(unit["setupIds"]).filter((id) => typeof id === "string"), setupId], used = [...usedIds(slice), behaviourId];
  const cut = sliceOf(bundled, used), bag = copyBag(files), sliced = sliceDoc(bundled, used); if (!isObj(sliced)) return { mode: "missing" };
  bag[`units/${unitId}.json`] = { ...unit, setupIds: ids }; bag[`setups/${setupId}.json`] = next; bag["catalogue/slice.json"] = sliced;
  return { mode: "added", slice: cut, bag };
}
export function updateProject(files: Obj, bundled: CatalogueDoc): { readonly bag: Record<string, Obj>; readonly slice: string } | null {
  const slice = files["catalogue/slice.json"], root = files["project.json"]; if (!isObj(slice) || !isObj(root) || !isObj(root["project"]) || !canUpdate(slice, bundled)) return null;
  const rev = catalogueRev(bundled), used = usedIds(slice), cut = sliceOf(bundled, used), bag = copyBag(files), sliced = sliceDoc(bundled, used); if (!isObj(sliced)) return null;
  bag["project.json"] = { ...root, project: { ...root["project"], catalogueRev: rev } }; bag["catalogue/slice.json"] = sliced;
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("setups/") && isObj(doc) && isObj(doc["catalogue"])) bag[path] = { ...doc, catalogue: { ...doc["catalogue"], rev } };
  return { bag, slice: cut };
}
