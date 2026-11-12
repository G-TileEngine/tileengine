import type { CoreLoadout, CoreProjectManifest, OccupancyPolicy } from "../../types/core-types.ts";
import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr, strs, type ReadResult } from "./guard.ts";
import { docLimits, fitted, overCap, tooMany, type DocLimits } from "./limits.ts";

function loadout(v: unknown): CoreLoadout | null {
  if (!isObj(v)) return null;
  const roster = strs(v.roster); const required = strs(v.required);
  if (roster === null || required === null || !isInt(v.size, 0)) return null;
  return { roster, size: v.size, required };
}
function occupancy(v: unknown): OccupancyPolicy | null | undefined {
  if (v === undefined) return undefined;
  if (v === "strict1" || v === "softStack" || v === "laneSlots") return v;
  return null;
}
export function readManifest(json: unknown, limits?: Partial<DocLimits>): ReadResult<CoreProjectManifest> {
  const lim = docLimits(limits === undefined ? {} : limits);
  if (lim === null) throw new RangeError("readManifest: limits must be whole numbers from 1 to their ceilings");
  return guarded(() => readManifestDoc(json, lim), json);
}
function readManifestDoc(json: unknown, lim: DocLimits): ReadResult<CoreProjectManifest> {
  const ver = checkVersion(json, "tile-project");
  if (ver !== null) return ver;
  if (!isObj(json) || !isObj(json.project)) return bad("project");
  const p = json.project;
  if (tooMany(p.stages, lim.stages)) return overCap("stages");
  const got = loadout(p.loadout); const stages = strs(p.stages); const rules = strs(p.rules);
  const settings = p.settings; const occ = isObj(settings) ? occupancy(settings.occupancy) : null;
  if (!isStr(p.id) || !isInt(p.rev, 0) || !isInt(p.catalogueRev, 0) || !isObj(settings) || typeof settings.wrapEdges !== "boolean" || occ === null || stages === null || rules === null || got === null) return bad("project");
  const base = { wrapEdges: settings.wrapEdges };
  const project = { id: p.id, rev: p.rev, catalogueRev: p.catalogueRev, settings: occ === undefined ? base : { ...base, occupancy: occ }, stages, rules, loadout: got };
  return fitted({ kind: "tile-project", formatVersion: CURRENT_FORMAT_VERSIONS["tile-project"], project }, lim, []);
}
