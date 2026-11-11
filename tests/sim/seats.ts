import type { AiHook, IntentHook } from "../../src/sim/index.ts";

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
