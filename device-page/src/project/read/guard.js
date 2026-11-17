                                                                                    
                                                   

/** Hard failures. needsMigration: an integer formatVersion that is not the current one (never patched here). */
                      
                                                                                                              
                                                                                   
                                                                                                                   

/** Runtime copy of DSK's CurrentFormatVersions; `satisfies` keeps the two equal. */
export const CURRENT_FORMAT_VERSIONS = {
  "tile-project": 6, map: 5, stage: 2, unit: 2, "behaviour-setup": 3, deck: 1, audio: 1,
}                                         ;

export const isObj = (v         )                               => typeof v === "object" && v !== null && !Array.isArray(v);
export const isInt = (v         , min = Number.NEGATIVE_INFINITY)              => typeof v === "number" && Number.isInteger(v) && v >= min;
export const isStr = (v         )              => typeof v === "string";
export function strs(v         )                  {
  if (!Array.isArray(v)) return null;
  const out           = [];
  for (const x of v) { if (!isStr(x)) return null; out.push(x); }
  return out;
}
export const bad = (key        )           => ({ ok: false, needsMigration: false, error: `bad field ${key}` });
const generic = (e        )          => e === "unreadable document" || e === "wrong kind object" || e.startsWith("bad field ");
function cyclic(v         , seen = new Set        (), path = new Set        ())          {
  if (typeof v !== "object" || v === null) return false;
  if (path.has(v) || seen.has(v)) return path.has(v);
  path.add(v);
  const kids                     = Array.isArray(v) ? v : Object.values(v);
  const hit = kids.some((k) => cyclic(k, seen, path));
  path.delete(v); seen.add(v);
  return hit;
}
export function guarded   (read                     , json          )                {
  let out               ;
  try { out = read(); } catch { out = { ok: false, needsMigration: false, error: "unreadable document" }; }
  if (!out.ok && !out.needsMigration && generic(out.error)) { try { if (cyclic(json)) return { ok: false, needsMigration: false, error: "cyclic document" }; } catch { /* the original reason stands */ } }
  return out;
}

/** null = the version guard passes. */
export function checkVersion(json         , kind             )                  {
  if (!isObj(json)) return { ok: false, needsMigration: false, error: "not an object" };
  if (json.kind !== kind) return { ok: false, needsMigration: false, error: `wrong kind ${typeof json.kind === "object" && json.kind !== null ? "object" : String(json.kind)}` };
  if (!isInt(json.formatVersion)) return bad("formatVersion");
  if (json.formatVersion !== CURRENT_FORMAT_VERSIONS[kind]) return { ok: false, needsMigration: true, kind, found: json.formatVersion };
  return null;
}
