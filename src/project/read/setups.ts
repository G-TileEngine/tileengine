import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr, type ReadResult } from "./guard.ts";

const SKIP = new Set(["__proto__", "constructor", "prototype", "toString"]);
export type SetupRead = { readonly kind: "behaviour-setup"; readonly formatVersion: 3; readonly id: string; readonly behaviourId: string; readonly catalogue: { readonly rev: number }; readonly answers?: unknown };
export function readSetup(json: unknown): ReadResult<SetupRead> {
  return guarded(() => {
    const ver = checkVersion(json, "behaviour-setup");
    if (ver !== null) return ver;
    if (!isObj(json) || !isStr(json.id)) return bad("id");
    if (!isStr(json.behaviourId)) return bad("behaviourId");
    if (!isObj(json.catalogue) || !isInt(json.catalogue.rev, 0)) return bad("catalogue");
    return { ok: true, notices: [], doc: { kind: "behaviour-setup", formatVersion: CURRENT_FORMAT_VERSIONS["behaviour-setup"], id: json.id, behaviourId: json.behaviourId, catalogue: { rev: json.catalogue.rev }, ...(json.answers === undefined ? {} : { answers: json.answers }) } };
  }, json);
}
export type StageOverrides = Readonly<Record<string, Readonly<Record<string, unknown>>>>;
export function readStageOverrides(json: unknown): ReadResult<StageOverrides> {
  return guarded(() => {
    if (!isObj(json) || !isObj(json.overrides)) return bad("overrides");
    const doc: Record<string, Record<string, unknown>> = {};
    for (const key of Object.keys(json.overrides)) {
      if (SKIP.has(key)) continue;
      const row = json.overrides[key];
      if (!isObj(row)) return bad("overrides");
      const copy: Record<string, unknown> = {};
      for (const inner of Object.keys(row)) { if (SKIP.has(inner)) continue; copy[inner] = row[inner]; }
      doc[key] = copy;
    }
    return { ok: true, notices: [], doc };
  }, json);
}
