// src/state/types.ts
                                                 

                   
                                  
                                              
                                                                              
                                                                               
                                                   

                                              

                       
                                                      
                                               

                   
                                     
                                    
                                    
                                   
                                                             
                               
                                                       
                                  
                                  
                                                                                                           
                                                                   
                             
                                     
                                                                                         
                                                             
                                                                     
                                 
                                    
                                 
                                  
                                   
                                      
                                      
                               

                                      

                   
                                  
                            
                                                                                                 
                                                                                                
  

                                                                           

/** Every phase and every event type, once. tests/state/tables.coverage.test.ts proves both lists are exhaustive. */
export const ALL_PHASES = [
  "play.loading", "play.result", "targeting", "resolving", "victoryCheck",
  "overlay.none", "overlay.pause", "overlay.settings", "overlay.saveLoad",
  "deploy", "roundStart", "sideStart", "unitDone", "sideEnd", "roundEnd",
  "idle", "unitSelected", "moving", "actMenu",
]                                    ;

export const ALL_EVENT_TYPES = [
  "BATTLE_READY", "DEPLOY_DONE", "ROUND_BEGIN", "SIDE_BEGIN", "SELECT_UNIT", "CANCEL", "TAP_MOVE_CELL", "MOVE_DONE",
  "UNDO_MOVE", "CHOOSE_ACTION", "CONFIRM_TARGET", "WAIT", "RESOLVE_DONE", "CHECK_NONE", "CHECK_END", "UNIT_DONE",
  "END_TURN", "FUSE_EXPIRE", "SIDE_END", "ROUND_END", "OPEN_PAUSE", "OPEN_SETTINGS", "OPEN_SAVELOAD", "CLOSE",
]                                        ;
