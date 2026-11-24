import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr, strs,                 } from "./guard.js";

const SKIP = new Set(["__proto__", "constructor", "prototype", "toString"]);
                                                                                                                                                                                                                                                                          
function statsOf(v         )                                {
  if (!isObj(v)) return null;
  const out                         = {};
  for (const key of Object.keys(v)) { if (SKIP.has(key) || !Object.hasOwn(v, key)) continue; const n = v[key]; if (!isObj(n) || typeof n.value !== "number" || !Number.isFinite(n.value) || !isInt(n.rev, 0)) return null; out[key] = n.value; }
  return out;
}
export function readUnit(json         )                       {
  return guarded(() => {
    const ver = checkVersion(json, "unit");
    if (ver !== null) return ver;
    if (!isObj(json) || !isStr(json.id)) return bad("id");
    if (!isInt(json.rev, 0)) return bad("rev");
    if (json.name !== undefined && !isStr(json.name)) return bad("name");
    if (json.sprite !== undefined && json.sprite !== null && !isStr(json.sprite)) return bad("sprite");
    let setupIds                               ;
    if (json.setupIds !== undefined) { const ids = strs(json.setupIds); if (ids === null) return bad("setupIds"); setupIds = ids; }
    let stats                                    ;
    if (json.stats !== undefined) { const got = statsOf(json.stats); if (got === null) return bad("stats"); stats = got; }
    const sprite = json.sprite; const name = json.name;
    return { ok: true, notices: [], doc: { kind: "unit", formatVersion: CURRENT_FORMAT_VERSIONS.unit, id: json.id, rev: json.rev, ...(typeof name === "string" ? { name } : {}), ...(sprite === undefined ? {} : { sprite }), ...(setupIds === undefined ? {} : { setupIds }), ...(stats === undefined ? {} : { stats }) } };
  }, json);
}
