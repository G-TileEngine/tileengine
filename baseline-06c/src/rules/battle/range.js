                                                    
                                                          
/** Orthogonal only, Manhattan 1..reach. towerStrike.ts:103-109 (`diagonal = false`). Own-key reach; missing, foreign, or not an integer ≥ 1 → 1. */
export function inOrthogonalReach(from    , to    , reach        )          {
  const dc = Math.abs(from.c - to.c), dr = Math.abs(from.r - to.r), d = dc + dr;
  return (dc === 0 || dr === 0) && d >= 1 && d <= reach;
}
export function reachOf(table                        , id        )         { const n = table !== undefined && Object.hasOwn(table, id) ? table[id] : 1; return typeof n === "number" && Number.isInteger(n) && n >= 1 ? n : 1; }
