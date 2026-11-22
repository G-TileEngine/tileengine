/** S1 load contract. Store documents are the migrated JSON (unknown keys kept). */
                                                             
                                                   
                                                                                                                                
                                                    
                                  
                                 
                          
                        
                       
                                 
                            
                                                                     
                                                                                                     
                                                                                                            
                                                           
  
                         
                                                                                                                          
                                                                                                                           
                                                                                                                   

const SLOTS                                   = { maps: "map", stages: "stage", units: "unit", setups: "behaviour-setup" };
/** Known document path, or null when the file is kept as an unknown. */
export function knownKind(path        )                {
  if (path === "project.json") return "tile-project";
  if (path === "catalogue/slice.json") return "catalogue-slice";
  const m = /^(maps|stages|units|setups)\/[^/]+\.json$/.exec(path);
  return m === null ? null : SLOTS[m[1] ?? ""] ?? null;
}
