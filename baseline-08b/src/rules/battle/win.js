                                                        
                                                      
                                                    
                                                                                 

const MUTUAL = Object.freeze(["draw", "last-actor-loses"]         );
const wipeWins           = { id: "wipe_wins", type: "toggle", default: true };
const mutualWipe           = { id: "mutual_wipe", type: "picker", default: "draw", options: MUTUAL };
export const WIN_CONDITION_KNOBS                      = Object.freeze([Object.freeze(wipeWins), Object.freeze(mutualWipe)]);
                                                                                               
function install(k            )          {
  const mutual = k.get("mutual_wipe");
  return Object.freeze({ wipe: k.get("wipe_wins") === true, mutual: mutual === "last-actor-loses" ? "last-actor-loses" : "draw" });
}
export const WIN_CONDITION                        = Object.freeze({ id: "win-condition", knobs: WIN_CONDITION_KNOBS, install });
/** Point-of-view contract: `sides[0]` is the player first; returned `win` / `lose` / `draw` are from that view. */
export function wipeRule(win         , sides                   )                                                                                                              {
  return (world, at) => {
    if (!win.wipe) return null;
    let ours = 0, theirs = 0;
    for (const u of world.units.all()) {
      if (!u.alive) continue;
      if (u.side === sides[0]) ours += 1; else if (sides.includes(u.side)) theirs += 1;
    }
    if (ours > 0 && theirs > 0) return null;
    if (ours === 0 && theirs === 0) return win.mutual === "draw" ? "draw" : at.side === sides[0] ? "lose" : "win";
    return ours === 0 ? "lose" : "win";
  };
}
