import { readAction, type Action } from "../core/log/index.ts";
import { NOT_PLAIN, isRecord, plainCopy } from "../core/plain.ts";
import type { SimWorld } from "./types.ts";
import { isDisposed } from "./dispose.ts";

function apply(world: SimWorld, action: Action): void {
  const target = action.target;
  if (action.kind === "wait") return;
  if (action.kind === "unlock" && target === null) {
    const id = action.effects.length === 1 ? action.effects[0] : undefined;
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
  const copy = plainCopy(action, 3), own = copy === NOT_PLAIN ? null : readAction(copy);
  if (own === null) { world.notices.push(isRecord(copy) && copy.kind === "unlock" ? { code: "unlockFailed", message: "unlock failed" } : { code: "actionRefused", message: "action refused" }); return; }
  world.log.append(world.clock.tick(), own);
  if (own.durationMs === null) apply(world, own);
  else world.clock.after(own.durationMs, () => apply(world, own));
}
