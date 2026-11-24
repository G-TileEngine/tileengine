                                                   
export const INTERACT_REFUSED_REASONS = Object.freeze(["unknownActor", "deadActor", "notUnitAim", "aimMissed", "selfTarget", "deadTarget", "notAdjacent", "foeTarget"]         );
                                                                              
                                                                                                                    
export const interactRefused = (reason                       )                  => ({ code: "interactRefused", message: `interact refused (${reason})`, reason });
