import type { SideId } from "../../types/core-types.ts";
import type { Units } from "../../core/unit/index.ts";
import type { Outcome } from "../../state/index.ts";
import type { BehaviourDef, KnobReader, KnobSpec } from "../behaviours/types.ts";

const MUTUAL = Object.freeze(["draw", "last-actor-loses"] as const);
const wipeWins: KnobSpec = { id: "wipe_wins", type: "toggle", default: true };
const mutualWipe: KnobSpec = { id: "mutual_wipe", type: "picker", default: "draw", options: MUTUAL };
export const WIN_CONDITION_KNOBS: readonly KnobSpec[] = Object.freeze([Object.freeze(wipeWins), Object.freeze(mutualWipe)]);
export type WinRule = { readonly wipe: boolean; readonly mutual: "draw" | "last-actor-loses" };
function install(k: KnobReader): WinRule {
  const mutual = k.get("mutual_wipe");
  return Object.freeze({ wipe: k.get("wipe_wins") === true, mutual: mutual === "last-actor-loses" ? "last-actor-loses" : "draw" });
}
export const WIN_CONDITION: BehaviourDef<WinRule> = Object.freeze({ id: "win-condition", knobs: WIN_CONDITION_KNOBS, install });
/** Point-of-view contract: `sides[0]` is the player first; returned `win` / `lose` / `draw` are from that view. */
export function wipeRule(win: WinRule, sides: readonly SideId[]): (world: { readonly units: Units }, at: { readonly round: number; readonly side: SideId }) => Outcome | null {
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
