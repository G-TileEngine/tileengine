type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const clone = <T>(v: T): T => structuredClone(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const nameOf = (doc: Obj): string => (typeof doc["name"] === "string" ? doc["name"] : "Stage");
export function newUnit(skel: Obj, id: string, name: string): Obj { const doc = clone(skel); doc["id"] = id; doc["name"] = name; return doc; }
export function renameUnit(unit: Obj, name: string): Obj { const doc = clone(unit); doc["name"] = name; return doc; }
export function unitNameError(raw: string): string | null { const name = raw.trim(), n = [...name].length; return n === 0 ? "Give your unit a name" : n > 40 ? "Use 40 characters or fewer" : null; }
function stageHit(doc: Obj, unitId: string): boolean {
  const gear = isObj(doc["loadout"]) ? doc["loadout"] : null, pool = isObj(doc["enemyPool"]) ? doc["enemyPool"] : null;
  return list(gear?.["required"]).includes(unitId) || list(gear?.["roster"]).includes(unitId) || list(doc["neutrals"]).some((n) => isObj(n) && n["unitId"] === unitId) || list(pool?.["entries"]).some((e) => isObj(e) && e["unitId"] === unitId);
}
export function usedBy(files: Record<string, Obj>, unitId: string): readonly string[] {
  const root = isObj(files["project.json"]) ? files["project.json"] : {}, proj = isObj(root["project"]) ? root["project"] : {}, byId = new Map<string, Obj>(), out: string[] = [];
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && typeof doc["id"] === "string") byId.set(doc["id"], doc);
  for (const id of list(proj["stages"])) { if (typeof id !== "string") continue; const doc = byId.get(id); if (doc !== undefined && stageHit(doc, unitId)) out.push(`Used by ${nameOf(doc)}. Remove it there first.`); }
  const gear = isObj(proj["loadout"]) ? proj["loadout"] : null;
  if ([...list(gear?.["required"]), ...list(gear?.["roster"])].includes(unitId)) out.push("Used in your team list. Remove it there first.");
  return out;
}
export function deleteUnit(files: Record<string, Obj>, unitId: string): { readonly ok: true; readonly files: Record<string, Obj> } | { readonly ok: false; readonly reasons: readonly string[] } {
  const reasons = usedBy(files, unitId); return reasons.length > 0 ? { ok: false, reasons } : { ok: true, files };
}
export function setStat(unit: Obj, key: string, value: number): Obj {
  const doc = clone(unit), stats = { ...(isObj(doc["stats"]) ? doc["stats"] : {}) }; stats[key] = { value, rev: 1 }; doc["stats"] = stats; return doc;
}
export function resetStat(unit: Obj, key: string): Obj {
  const doc = clone(unit); if (!isObj(doc["stats"])) return doc; const stats: Obj = {};
  for (const [k, v] of Object.entries(doc["stats"])) if (k !== key) stats[k] = v; doc["stats"] = stats; return doc;
}
export function applyRole(unit: Obj, overrides: Readonly<Record<string, number>>, perUnitKeys: ReadonlySet<string>): Obj {
  let doc = unit; for (const [key, value] of Object.entries(overrides)) if (perUnitKeys.has(key)) doc = setStat(doc, key, value); return doc;
}
export function shown(files: Record<string, Obj>, hidden: readonly string[]): readonly { readonly id: string; readonly name: string }[] {
  const rows = Object.entries(files).flatMap(([path, doc]) => (!path.startsWith("units/") || !path.endsWith(".json") || !isObj(doc) || typeof doc["id"] !== "string" || hidden.includes(doc["id"]) ? [] : [{ id: doc["id"], name: typeof doc["name"] === "string" ? doc["name"] : "Unit" }]));
  return rows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
