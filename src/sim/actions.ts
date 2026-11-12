import type { Action } from "../core/log/index.ts";
import type { SimWorld } from "./types.ts";
import { isDisposed } from "./dispose.ts";

function idsOf(effects: readonly string[]): readonly string[] | null {
  return Array.isArray(effects) && effects.every((id) => typeof id === "string") ? effects.slice() : null;
}
function apply(world: SimWorld, action: Action): void {
  const target = action.target;
  if (action.kind === "wait") return;
  if (action.kind === "unlock" && target === null) {
    const ids = idsOf(action.effects), id = ids !== null && ids.length === 1 ? ids[0] : undefined;
    if (id === undefined || id === "" || world.levels?.choose(action.actor, id) !== true) world.notices.push({ code: "unlockFailed", message: "unlock failed" });
    return;
  }
  if (action.kind === "move" && target !== null && target.pipe === "tile") {
    const moved = world.units.moveTo(action.actor, target.at, "move");
    if (!moved.ok) world.notices.push({ code: "moveFailed", message: "move failed", at: { c: target.at.c, r: target.at.r } });
    else if (world.levels !== null) { const unit = world.units.get(action.actor); if (unit !== undefined) { const bar = world.levels.barOf(unit); world.levels.gain(bar.id, bar.pool, world.levels.rules.xp.move); } }
    return;
  }
  world.notices.push({ code: "actionUnsupported", message: "action unsupported" });
}
export function submit(world: SimWorld, action: Action): void {
  if (isDisposed(world)) return;
  if (action.kind === "unlock" && idsOf(action.effects) === null) { world.notices.push({ code: "unlockFailed", message: "unlock failed" }); return; }
  world.log.append(world.clock.tick(), action);
  if (action.durationMs === null) apply(world, action);
  else world.clock.after(action.durationMs, () => apply(world, action));
}