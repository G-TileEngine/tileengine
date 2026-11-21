type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
function rootOf(files: Record<string, Obj>): { readonly root: Obj; readonly project: Obj; readonly gear: Obj } | null {
  const root = files["project.json"]; if (!isObj(root) || !isObj(root["project"])) return null;
  const project = root["project"];
  return { root, project, gear: isObj(project["loadout"]) ? project["loadout"] : { roster: [], size: 1 } };
}
export function onTeam(files: Record<string, Obj>, unitId: string): boolean {
  const got = rootOf(files); return got !== null && list(got.gear["roster"]).includes(unitId);
}
export function setTeam(files: Record<string, Obj>, unitId: string, on: boolean): Record<string, Obj> {
  const got = rootOf(files); if (got === null) return files;
  const roster = list(got.gear["roster"]).filter((id): id is string => typeof id === "string" && id !== unitId);
  if (on) roster.push(unitId);
  const loadout = { ...got.gear, roster, size: Math.max(1, roster.length) };
  return { ...files, "project.json": { ...got.root, project: { ...got.project, loadout } } };
}
