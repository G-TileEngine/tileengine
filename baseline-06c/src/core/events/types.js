                                                                                        

/** Core events = DSK's CoreEventMap (landedOn, pushBlocked, enteredLane, actionLogged; MAY-MOVE). Step 07 adds none of its own. */
                                          
                                                     
export const ENGINE_EVENT_TYPES = ["landedOn", "pushBlocked", "enteredLane", "actionLogged"]                                                     ;

/** A mode's own events (MODES-v2): type name → payload. Registered at bus creation; never core names.
 *  Default = DSK's augmentable ModeEventMap (only the optional-never placeholder "mode.none" in core; EventUnion drops it). */
                                                               
                                                     
                                        
                                                                          
                                                                                                                          

                                                                                                                                           

/** Rolling bus history size (step 17): the newest `history` records are kept; 0 keeps none. The match log is capped by MatchLimits (step 21). */
                                                     

                                                                 
                                 
                                                                                                                                             
                                                     
                                                  
                                      
                                     
                                                                                                                                                   
                  
 
