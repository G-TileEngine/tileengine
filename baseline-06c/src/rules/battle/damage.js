                                                   
import { installOne } from "../behaviours/index.js";
                                                                                                                     

export const HIT_CLASSES = Object.freeze(["basic", "spell", "arrow"]         );
                                                    
const hitClass           = { id: "hit_class", type: "picker", default: "basic", options: HIT_CLASSES };
export const DAMAGE_RESOLUTION_KNOBS                      = Object.freeze([Object.freeze(hitClass)]);
                                                         
function install(k            )             { return Object.freeze({ hitClass: k.get("hit_class")             }); }
/** Phase 4 applies real L5 difficulty.damage. Until then a value other than 1 warns and plays as 1. */
function afterInstall(notes          , ctx             )       {
  const d = ctx?.difficulty;
  if (d !== undefined && Object.hasOwn(d, "damage") && d.damage !== 1) notes.push(WARN);
}
export const DAMAGE_RESOLUTION                           = Object.freeze({ id: "damage-resolution", knobs: DAMAGE_RESOLUTION_KNOBS, install, afterInstall });
                                                                                                                 
const WARN         = Object.freeze({ code: "layerNotApplied", message: "L5 difficulty.damage" });
export function installDamage(layers             , ctx            )                        {
  return installOne(DAMAGE_RESOLUTION, layers, ctx);
}
