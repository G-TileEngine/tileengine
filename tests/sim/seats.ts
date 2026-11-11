import type { SideId } from "../../src/types/core-types.ts";
import { createPlayer, type AiHook, type IntentHook, type Seat, type SimWorld } from "../../src/sim/index.ts";

export function asIntents(ai: AiHook): IntentHook {
  return (world, side, budget) => ai(world, side, budget).flatMap((action) => {
    const target = action.target;
    if (action.kind !== "move" || target === null || target.pipe !== "tile") return [];
    return [{ intent: { type: "SelectUnit", unitId: action.actor } }, { intent: { type: "TargetCell", at: { c: target.at.c, r: target.at.r } } }];
  });
}
export function counter(prefix: string): () => string {
  let n = 0;
  return () => `${prefix}${n += 1}`;
}
export function seatAll(world: SimWorld, sides: readonly SideId[], intents: IntentHook, moveMs: number | null): Seat[] {
  const nextId = counter("m");
  return sides.map((side) => ({ player: createPlayer(world, { side, moveMs, nextId }), intents }));
}
