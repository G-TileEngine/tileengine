import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr,                 } from "./guard.js";

const SKIP = new Set(["__proto__", "constructor", "prototype", "toString"]);
                                                                                                                                                                                                                     
export function readSetup(json         )                        {
  return guarded(() => {
    const ver = checkVersion(json, "behaviour-setup");
    if (ver !== null) return ver;
    if (!isObj(json) || !isStr(json.id)) return bad("id");
    if (!isStr(json.behaviourId)) return bad("behaviourId");
    if (!isObj(json.catalogue) || !isInt(json.catalogue.rev, 0)) return bad("catalogue");
    return { ok: true, notices: [], doc: { kind: "behaviour-setup", formatVersion: CURRENT_FORMAT_VERSIONS["behaviour-setup"], id: json.id, behaviourId: json.behaviourId, catalogue: { rev: json.catalogue.rev }, ...(json.answers === undefined ? {} : { answers: json.answers }) } };
  }, json);
}
                                                                                         
export function readStageOverrides(json         )                             {
  return guarded(() => {
    if (!isObj(json) || !isObj(json.overrides)) return bad("overrides");
    const doc                                          = {};
    for (const key of Object.keys(json.overrides)) {
      if (SKIP.has(key)) continue;
      const row = json.overrides[key];
      if (!isObj(row)) return bad("overrides");
      const copy                          = {};
      for (const inner of Object.keys(row)) { if (SKIP.has(inner)) continue; copy[inner] = row[inner]; }
      doc[key] = copy;
    }
    return { ok: true, notices: [], doc };
  }, json);
}
