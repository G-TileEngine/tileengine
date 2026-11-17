import { bad, checkVersion, guarded, isInt, isObj, isStr, type ReadResult } from "./guard.ts";
import { overCap } from "./limits.ts";
export const EFFECT_ANSWERS = 64;
export type EffectDoc = { readonly id: string; readonly rev: number; readonly values: Readonly<Record<string, unknown>> };

const put = (obj: Record<string, unknown>, key: string, value: unknown): void => {
  Object.defineProperty(obj, key, { value, enumerable: true, writable: true, configurable: true });
};

function take(json: unknown, defaults?: Readonly<Record<string, unknown>>): ReadResult<EffectDoc> {
  const ver = checkVersion(json, "behaviour-setup");
  if (ver !== null) return ver;
  if (!isObj(json) || json.behaviourId !== "effect") return bad("behaviourId");
  if (!isStr(json.id)) return bad("id");
  if (!isInt(json.rev, 0)) return bad("rev");
  const answers = json.answers;
  if (!isObj(answers)) return bad("answers");
  const keys = Object.keys(answers);
  if (keys.length > EFFECT_ANSWERS) return overCap("answers");
  const values: Record<string, unknown> = {};
  for (const key of keys) {
    if (!Object.hasOwn(answers, key)) continue;
    const row = answers[key];
    if (!isObj(row)) return bad("answers");
    if (row.source === "default") {
      if (defaults !== undefined && Object.hasOwn(defaults, key)) put(values, key, defaults[key]);
      continue;
    }
    if (Object.hasOwn(row, "value")) put(values, key, row.value);
  }
  return { ok: true, notices: [], doc: { id: json.id, rev: json.rev, values } };
}

export function readEffect(json: unknown, defaults?: Readonly<Record<string, unknown>>): ReadResult<EffectDoc> {
  return guarded(() => take(json, defaults), json);
}
