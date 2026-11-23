import { linksTo } from "./links.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const clone = <T>(v: T): T => structuredClone(v);
const rootOf = (files: Record<string, Obj>): Obj => (isObj(files["project.json"]) ? files["project.json"] : {});
const inner = (doc: Obj): Obj => (isObj(doc["project"]) ? doc["project"] : {});
export function docsIn(files: Record<string, Obj>, folder: "stages" | "maps"): { readonly path: string; readonly doc: Obj }[] {
  return Object.entries(files).flatMap(([path, doc]) => (path.startsWith(`${folder}/`) && isObj(doc) && typeof doc["id"] === "string" ? [{ path, doc }] : []));
}
/** Live stages (project.stages) whose mapRef is this id. Links target stages, not maps, so this stays mapRef-only. */
export function refsTo(files: Record<string, Obj>, id: string): readonly string[] {
  const stages = docsIn(files, "stages");
  return list(inner(rootOf(files))["stages"]).flatMap((sid) => {
    if (typeof sid !== "string") return [];
    const doc = stages.find((item) => item.doc["id"] === sid)?.doc;
    return doc !== undefined && doc["mapRef"] === id ? [typeof doc["name"] === "string" ? doc["name"] : "Stage"] : [];
  });
}
function takenSeed(files: Record<string, Obj>): number | null {
  const stages = docsIn(files, "stages");
  for (const sid of list(inner(rootOf(files))["stages"])) {
    if (typeof sid !== "string") continue;
    const doc = stages.find((item) => item.doc["id"] === sid)?.doc;
    if (doc !== undefined && typeof doc["seed"] === "number") return doc["seed"];
  }
  return null;
}
export function addStage(files: Record<string, Obj>, stageSkel: Obj, mapSkel: Obj | null, stageId: string, mapId: string, stageName: string, mapName: string): Record<string, Obj> {
  const stage = clone(stageSkel); stage["id"] = stageId; stage["name"] = stageName; stage["mapRef"] = mapId;
  const seed = takenSeed(files); if (seed !== null) stage["seed"] = seed;
  const next: Record<string, Obj> = { ...files, [`stages/${stageId}.json`]: stage };
  if (mapSkel !== null) { const map = clone(mapSkel); map["id"] = mapId; map["name"] = mapName; next[`maps/${mapId}.json`] = map; }
  const root = clone(rootOf(files)), proj = { ...inner(root) };
  proj["stages"] = [...list(proj["stages"]).filter((id): id is string => typeof id === "string"), stageId];
  root["project"] = proj; next["project.json"] = root; return next;
}
export function renameDoc(files: Record<string, Obj>, path: string, name: string): Record<string, Obj> {
  const doc = files[path]; if (!isObj(doc)) return files; const next = clone(doc); next["name"] = name; return { ...files, [path]: next };
}
export function deleteStage(files: Record<string, Obj>, stageId: string): { readonly ok: true; readonly files: Record<string, Obj> } | { readonly ok: false; readonly reason: string } {
  const stages = list(inner(rootOf(files))["stages"]).filter((id): id is string => typeof id === "string");
  if (!stages.includes(stageId) || stages.length <= 1) return { ok: false, reason: "A game needs at least one stage" };
  const named = linksTo(files, stageId); if (named.length > 0) return { ok: false, reason: `A link on ${named.join(", ")} leads here. Remove it first.` };
  const root = clone(rootOf(files)), proj = { ...inner(root) }; proj["stages"] = stages.filter((id) => id !== stageId);
  if (isObj(proj["render"]) && Array.isArray(proj["render"]["excludedStages"])) { const render = { ...proj["render"] }; render["excludedStages"] = list(render["excludedStages"]).filter((id) => id !== stageId); proj["render"] = render; }
  root["project"] = proj; return { ok: true, files: { ...files, "project.json": root } };
}
export function deleteMap(files: Record<string, Obj>, mapId: string): { readonly ok: true } | { readonly ok: false; readonly usedBy: readonly string[] } {
  const usedBy = refsTo(files, mapId); return usedBy.length > 0 ? { ok: false, usedBy } : { ok: true };
}
