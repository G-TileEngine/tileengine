                                                   
import { isObj,                                } from "./guard.js";

                                                                                                                                                                                                                                                                                  
export const DOC_CEILINGS            = Object.freeze({ side: 256, objects: 65536, edges: 262144, footprint: 256, spots: 4096, waves: 65536, turn0: 4096, text: 1024, notices: 2147483647, stages: 65536 });
export const DEFAULT_DOC_LIMITS            = Object.freeze({ side: 64, objects: 1024, edges: 16384, footprint: 8, spots: 144, waves: 256, turn0: 144, text: 128, notices: 256, stages: 1024 });
export const INT32_MAX = 2147483647, UINT32_MAX = 4294967295;
const KEYS = ["side", "objects", "edges", "footprint", "spots", "waves", "turn0", "text", "notices", "stages"]         ;

export function docLimits(v         )                   {
  if (!isObj(v)) return null;
  const out                         = {};
  try {
    for (const key of KEYS) {
      const raw = v[key], n = raw === undefined ? DEFAULT_DOC_LIMITS[key] : raw;
      if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > DOC_CEILINGS[key]) return null;
      out[key] = n;
    }
  } catch { return null; }
  return Object.freeze(out)             ;
}
export function unfit(v         , lim           , at         )                {
  if (typeof v === "string") return at !== undefined && v.length > lim.text ? `text ${at}` : null;
  if (typeof v === "number") return at !== undefined && Math.abs(v) > INT32_MAX ? `number ${at}` : null;
  if (Array.isArray(v)) { for (const item of v) { const hit = unfit(item, lim, at); if (hit !== null) return hit; } return null; }
  if (!isObj(v)) return null;
  for (const key of Object.keys(v)) { if (at === undefined && key === "seed") continue; const hit = unfit(v[key], lim, at ?? key); if (hit !== null) return hit; }
  return null;
}
export const overCap = (key        )           => ({ ok: false, needsMigration: false, error: `over cap ${key}` });
export function fitted   (doc   , lim           , notices                   )                {
  const hit = unfit(doc, lim);
  return hit === null ? { ok: true, doc, notices } : overCap(hit);
}
export const tooMany = (v         , n        )          => Array.isArray(v) && (v                      ).length > n;
export const capNotes = (list                   , cap        )           => (list.length <= cap ? [...list] : [...list.slice(0, cap), { code: "noticesCapped", message: `and ${list.length - cap} more` }]);
