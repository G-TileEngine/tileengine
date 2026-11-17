import { docToLiveFx,                  } from "../../src/runtime/render/fx-doc.js";
                                                                  
                                                                    
                                                               
                                                                        
export const STRIP = { facings: ["S", "W", "N", "E"], zooms: [1, 2, 3], cols: 3, rows: 2, loopMs: 1600, caster: "me", target: "foe" }         ;
                                                                                                 
export const VIEW0       = { facing: 0, zoom: 3, visible: true };
export const turn = (v      )       => ({ ...v, facing: (v.facing + 1) % STRIP.facings.length });
export const zoom = (v      , z        )       => ({ ...v, zoom: z });
export const fitZoom = (cssW        , cssH        , dpr        , boardW        , boardH        )         => { if (![cssW, cssH, dpr, boardW, boardH].every((n) => Number.isFinite(n) && n > 0)) return 3; return Math.max(3, Math.floor(Math.min((cssW * dpr) / boardW, (cssH * dpr) / boardH))); };
export const seen = (v      , visible         )       => (v.visible === visible ? v : { ...v, visible });
const unit = (id        , c        , facing                     )            => ({ id, sprite: "stand", at: { c, r: 0 }, offset: null, facing, alive: true });
export function preview(doc             , v      , castMs        , sheet       )                                                             {
  const { fx, notes } = docToLiveFx(doc, { id: "preview", castMs, caster: STRIP.caster, target: STRIP.target, loopMs: STRIP.loopMs, sheetOf: () => sheet });
  return { effects: [fx], units: [unit(STRIP.caster, 0, STRIP.facings[v.facing] ?? "S"), unit(STRIP.target, STRIP.cols - 1, "W")], notes };
}
