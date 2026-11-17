                                                                      
export const INTENTS = ["slash", "shot", "burst", "aura", "heal", "buff", "ground"]         ;
                                              
                                                                                                
const KIND = { melee: "slash", ranged: "shot", area: "ground", heal: "heal", buff: "buff" }         ;
const rec = (v         )                                 => (v !== null && typeof v === "object" && !Array.isArray(v) ? v                            : null);
export const intentFor = (kind         )                => (typeof kind === "string" && Object.hasOwn(KIND, kind) ? KIND[kind                     ] : null);
export const tagsOf = (doc             )           => (Array.isArray(doc["tags"]) ? doc["tags"] : []).slice(0, 4).flatMap((item) => { const id = rec(item)?.["id"]; return typeof id === "string" ? [id] : []; });
export const rampChips = (options                   , styleRamps                   )           => { const have = new Set(styleRamps), out           = []; for (const r of options) if (have.has(r) && !out.includes(r)) out.push(r); return out; };
export function recolour(doc             , ramp               )              {
  if (ramp === null) return doc;
  const steps = doc["steps"];
  return { ...doc, tint_ramp: ramp, ...(Array.isArray(steps) ? { steps: steps.map((s) => { const o = rec(s); return o !== null && Object.hasOwn(o, "tint_ramp") ? { ...o, tint_ramp: ramp } : s; }) } : {}) };
}
export const tiles = (presets                   , intent               , ramp               )           => presets.filter((p) => intent === null || tagsOf(p.doc).includes(intent)).map((p) => (ramp === null ? p : { ...p, doc: recolour(p.doc, ramp) }));
