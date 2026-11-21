import { readProject, type ProjectFiles } from "../../src/project/load/index.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { sliceDoc } from "../project/slice-of.ts";
import { playDocsOf } from "../play-stage/project.ts";
import { BUNDLED } from "./catalogue.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export type ReachCell = { readonly c: number; readonly r: number; readonly on: boolean };
const grid = (reach: number | null): readonly ReachCell[] => Array.from({ length: 49 }, (_, i) => { const c = i % 7, r = Math.floor(i / 7); return { c, r, on: reach !== null && inOrthogonalReach({ c: 3, r: 3 }, { c, r }, reach) }; });
function shell(files: ProjectFiles): Obj | null { for (const [path, doc] of Object.entries(files)) if (path.startsWith("setups/") && isObj(doc)) return structuredClone(doc); return null; }
function played(files: ProjectFiles): ReturnType<typeof playDocsOf> | null { const load = readProject(files); if (!load.ok || load.project === null) return null; try { return playDocsOf(load.project); } catch (e) { if (!(e instanceof Error)) throw e; return null; } }
function withSlice(bag: Record<string, unknown>, behaviourId: string): void {
  const slice = bag["catalogue/slice.json"]; if (!isObj(slice) || list(slice["behaviours"]).some((row) => isObj(row) && row["id"] === behaviourId)) return;
  const ids = list(slice["behaviours"]).flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []);
  const cut = sliceDoc(BUNDLED, [...ids, behaviourId]); if (isObj(cut)) bag["catalogue/slice.json"] = cut;
}
function withCandidate(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null, on: boolean): ProjectFiles {
  const bag: Record<string, unknown> = structuredClone(files), path = `units/${unitId}.json`, unit = bag[path]; if (!isObj(unit)) return bag;
  const drop = new Set<string>(); for (const sid of list(unit["setupIds"])) { const setup = typeof sid === "string" ? bag[`setups/${sid}.json`] : undefined; if (typeof sid === "string" && isObj(setup) && setup["behaviourId"] === behaviourId) drop.add(sid); }
  const ids = list(unit["setupIds"]).filter((id) => typeof id === "string" && !drop.has(id)); if (!on) { bag[path] = { ...unit, setupIds: ids }; return bag; }
  const base = shell(files); if (base === null) return bag;
  const id = "setup_diagram", catalogue = isObj(base["catalogue"]) ? { ...base["catalogue"] } : {}, empty: Obj = {};
  catalogue["rev"] = 0; base["id"] = id; base["behaviourId"] = behaviourId; base["answers"] = answers === null ? empty : answers; base["catalogue"] = catalogue;
  bag[`setups/${id}.json`] = base; bag[path] = { ...unit, setupIds: [...ids, id] }; withSlice(bag, behaviourId); return bag;
}
export function diagramCells(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null): readonly ReachCell[] {
  const before = played(withCandidate(files, unitId, behaviourId, null, false)), after = played(withCandidate(files, unitId, behaviourId, answers, true));
  if (before === null || after === null) return grid(null);
  const a0 = before.rules.abilities?.[unitId]?.length ?? 0, a1 = after.rules.abilities?.[unitId]?.length ?? 0, grew = a1 > a0 ? after.rules.abilities?.[unitId]?.[a1 - 1]?.reach : undefined;
  const r0 = before.rules.reach?.[unitId], r1 = after.rules.reach?.[unitId], reach = typeof grew === "number" ? grew : r1 !== r0 && typeof r1 === "number" ? r1 : null;
  return grid(reach);
}
export function diagramHtml(cells: readonly ReachCell[]): string { return `<div class="reach-grid" role="img" aria-label="Reach">${cells.map((cell) => `<span${cell.on ? ' class="on"' : ""}>${cell.on ? "reach" : ""}</span>`).join("")}</div>`; }
