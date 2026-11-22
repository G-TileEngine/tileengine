import { bad, checkVersion, guarded, isInt, isObj, isStr,                 } from "./guard.js";
import { overCap } from "./limits.js";
export const EFFECT_ANSWERS = 64;
                                                                                                                          

const put = (obj                         , key        , value         )       => {
  Object.defineProperty(obj, key, { value, enumerable: true, writable: true, configurable: true });
};

function take(json         , defaults                                    )                        {
  const ver = checkVersion(json, "behaviour-setup");
  if (ver !== null) return ver;
  if (!isObj(json) || json.behaviourId !== "effect") return bad("behaviourId");
  if (!isStr(json.id)) return bad("id");
  if (!isInt(json.rev, 0)) return bad("rev");
  const answers = json.answers;
  if (!isObj(answers)) return bad("answers");
  const keys = Object.keys(answers);
  if (keys.length > EFFECT_ANSWERS) return overCap("answers");
  const values                          = {};
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

export function readEffect(json         , defaults                                    )                        {
  return guarded(() => take(json, defaults), json);
}
