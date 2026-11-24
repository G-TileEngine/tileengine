                                                                    
                                                             
                                                                  
                                                       
                                                                            

export const TILE = 16;
export const TEAM = { player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a }         ;
                                                                    
const fallback = (id        )         => ({ id: `starter:unknown-${id}`, name: "Unknown" });
export const RECIPES                                   = Object.freeze({
  knight: { id: "starter:hero-sword", name: "Knight" },
  archer: { id: "starter:hero-staff", name: "Archer" },
  cleric: { id: "starter:hero-cleric", name: "Cleric" },
  crate: { id: "starter:prop-crate", name: "Crate" },
  merchant: { id: "starter:npc-merchant", name: "Merchant" },
  villager: { id: "starter:npc-villager", name: "Villager" },
  wolf: { id: "starter:enemy-wolf", name: "Wolf" },
});
export const recipeIn = (map                                  , id        )         => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
export const recipeOf = (id        )         => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
                                                                                                                                           
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
export function docsToInput(docs                                                                                                                                             )                                                              {
  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
  if (hostSeed === undefined) throw new Error("play: seed");
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo", ...(docs.levels === undefined ? {} : { levels: docs.levels }) }, talk: docs.talk };
}
