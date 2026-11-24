                                                     
                                                      
import { inOrthogonalReach, reachOf,                 } from "./range.js";
                                                   
/** Living units only, no fallback cell. Basic: foes in orthogonal reach. Interact: adjacent neutrals. */
export function targetsFor(grid      , units       , actorId        , kind                      , setup                                  )                 {
  const actor = units.get(actorId);
  if (actor === undefined || !actor.alive) return [];
  const reach = kind === "interact" ? 1 : reachOf(setup?.reach, actor.unitId), out                 = [];
  for (const u of units.all()) if (u.alive && u.id !== actor.id && grid.inBounds(u.at) && inOrthogonalReach(actor.at, u.at, reach) && (kind === "interact" ? u.side === "neutral" : u.side !== actor.side && u.side !== "neutral")) out.push({ id: u.id });
  return out;
}
