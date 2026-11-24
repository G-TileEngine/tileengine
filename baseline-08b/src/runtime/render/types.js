                                              
/** Render core types (step 27). Pure data: the renderer reads these and never mutates engine state. */
/** One clip, in the project-format §6.2 AssetMeta `clips[]` shape. */
                                                                                                                                                                                                                        
/** AssetMeta `anchor` (§6.2). Absent, or "auto" until slice 30 resolves it, means bottom-centre. */
                                                                                                        
/** A frame sheet: an asset id plus its grid. `fw`/`fh` are the frame (or tile) size in art px. */
                                                                                                                                          
                                                                                                                                                                                                                                     
                                                                                                           
/** Fixed bands, drawn in this order. `fxGround` sits on the ground; `flash` sits over the glow. "wash" holds the night wash and stage dim (slice 31). */
export const BANDS = ["base", "fxGround", "wash", "fxAir", "glow", "flash", "ui"]         ;
                                          
                                      
                                                                                                                                                                                                                                                                                                                                                                                      
/** A baked motion atlas: `n` poses in one row, shared by every tile of that index. */
                                                                                                             
/** A tile layer. `anims` is `tileProps.anim` resolved to clips: tile index → clip. Tiles share one offsetMs. `motion` is the atlas plan per tile index. */
                                                                                                                                                                                                       
/** A unit, prop, or effect anchored on a unit. `ox`/`oy` move the drawing, never the sort. `flipX` comes from the clip fallback (slice 30, `noMirror`). */
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
/** Anything drawn above the world: wash, effect air, glow or UI. `x`/`y` are top-left in world art px. */
                                                                                                                                                                                                                                                                                                           
                                                                                                                                                                                       
/** A map background picture. `depth` 1 scrolls with the map; 0 stays on screen. Drawn at native size, never scaled. */
                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                     
/** The draw adapter (ARCH §12.4). Canvas2D (step 28) and WebGL2 (later) implement it; the test backend lives in tests/. */
                           
                                            
                                                                                                                                                             
                                                                             
                                                             
                   
 
/** What the last drawn frame depended on. `rev` is the host's world/project revision. */
                                                                                                                                                                                              
