import type { CoreEdge, CoreMap, CoreMapObject } from "../../types/core-types.ts";
import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr, type ReadResult } from "./guard.ts";
import { docLimits, fitted, overCap, tooMany, type DocLimits } from "./limits.ts";

function sideOf(v: unknown): CoreEdge["side"] | null {
  return v === "n" || v === "e" || v === "s" || v === "w" ? v : null;
}
function cell(v: unknown): { c: number; r: number } | null {
  return isObj(v) && isInt(v.c) && isInt(v.r) ? { c: v.c, r: v.r } : null;
}
function logicOf(v: unknown, n: number): CoreMap["logic"] | null {
  if (!isObj(v) || !Array.isArray(v.terrain) || v.terrain.length !== n || !v.terrain.every((t) => isInt(t, 0)) || !isObj(v.palette) || !Array.isArray(v.edges)) return null;
  const palette: Record<string, string> = {};
  for (const key of Object.keys(v.palette)) { const val = v.palette[key]; if (!isStr(val)) return null; if (key === "__proto__") continue; palette[key] = val; }
  const edges: CoreEdge[] = [];
  for (const e of v.edges) { const at = cell(e); const side = isObj(e) ? sideOf(e.side) : null; if (at === null || side === null) return null; edges.push({ ...at, side }); }
  return { terrain: v.terrain.slice(), palette, edges };
}
function objectOf(v: unknown, max: number): CoreMapObject | null {
  if (!isObj(v) || !isStr(v.id)) return null;
  const at = cell(v.at);
  if (at === null || (v.blocks !== undefined && typeof v.blocks !== "boolean")) return null;
  const fp = v.footprint;
  const footprint = isObj(fp) && isInt(fp.w, 1) && isInt(fp.h, 1) && fp.w <= max && fp.h <= max ? { w: fp.w, h: fp.h } : undefined;
  if (fp !== undefined && footprint === undefined) return null;
  return { id: v.id, at, ...(footprint === undefined ? {} : { footprint }), ...(typeof v.blocks === "boolean" ? { blocks: v.blocks } : {}) };
}
export function readMap(json: unknown, limits?: Partial<DocLimits>): ReadResult<CoreMap> {
  const lim = docLimits(limits === undefined ? {} : limits);
  if (lim === null) throw new RangeError("readMap: limits must be whole numbers from 1 to their ceilings");
  return guarded(() => readMapDoc(json, lim));
}
function readMapDoc(json: unknown, lim: DocLimits): ReadResult<CoreMap> {
  const ver = checkVersion(json, "map");
  if (ver !== null) return ver;
  if (!isObj(json) || !isStr(json.id)) return bad("id");
  if (!isInt(json.rev, 0)) return bad("rev");
  if (!isInt(json.cols, 1)) return bad("cols");
  if (!isInt(json.rows, 1)) return bad("rows");
  if (json.cols > lim.side) return overCap("cols");
  if (json.rows > lim.side) return overCap("rows");
  const edges = isObj(json.logic) ? json.logic.edges : undefined;
  if (tooMany(json.objects, lim.objects)) return overCap("objects");
  if (tooMany(edges, lim.edges)) return overCap("logic edges");
  const logic = logicOf(json.logic, json.cols * json.rows);
  if (logic === null) return bad("logic");
  const held = isObj(json.logic) ? json.logic.palette : undefined;
  const notices = isObj(held) && Object.hasOwn(held, "__proto__") ? [{ code: "droppedKey", message: "palette key __proto__ dropped" }] : [];
  const doc: CoreMap = { kind: "map", formatVersion: CURRENT_FORMAT_VERSIONS.map, id: json.id, rev: json.rev, cols: json.cols, rows: json.rows, logic };
  if (json.objects === undefined) return fitted(doc, lim, notices);
  if (!Array.isArray(json.objects)) return bad("objects");
  const objects: CoreMapObject[] = [];
  for (const item of json.objects) { const obj = objectOf(item, lim.footprint); if (obj === null) return bad("objects"); objects.push(obj); }
  return fitted({ ...doc, objects }, lim, notices);
}
