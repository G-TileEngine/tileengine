import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr, strs, type ReadResult } from "./guard.ts";

const SKIP = new Set(["__proto__", "constructor", "prototype", "toString"]);
export type UnitRead = { readonly kind: "unit"; readonly formatVersion: 2; readonly id: string; readonly rev: number; readonly sprite?: string; readonly setupIds?: readonly string[]; readonly stats?: Readonly<Record<string, number>> };
function statsOf(v: unknown): Record<string, number> | null {
  if (!isObj(v)) return null;
  const out: Record<string, number> = {};
  for (const key of Object.keys(v)) { if (SKIP.has(key)) continue; const n = v[key]; if (typeof n !== "number" || !Number.isFinite(n)) return null; out[key] = n; }
  return out;
}
export function readUnit(json: unknown): ReadResult<UnitRead> {
  return guarded(() => {
    const ver = checkVersion(json, "unit");
    if (ver !== null) return ver;
    if (!isObj(json) || !isStr(json.id)) return bad("id");
    if (!isInt(json.rev, 0)) return bad("rev");
    if (json.sprite !== undefined && !isStr(json.sprite)) return bad("sprite");
    let setupIds: readonly string[] | undefined;
    if (json.setupIds !== undefined) { const ids = strs(json.setupIds); if (ids === null) return bad("setupIds"); setupIds = ids; }
    let stats: Record<string, number> | undefined;
    if (json.stats !== undefined) { const got = statsOf(json.stats); if (got === null) return bad("stats"); stats = got; }
    const sprite = json.sprite;
    return { ok: true, notices: [], doc: { kind: "unit", formatVersion: CURRENT_FORMAT_VERSIONS.unit, id: json.id, rev: json.rev, ...(sprite === undefined ? {} : { sprite }), ...(setupIds === undefined ? {} : { setupIds }), ...(stats === undefined ? {} : { stats }) } };
  }, json);
}
