import type { SimWorld } from "./types.ts";

const done = new WeakSet<SimWorld>();

/** Ends a finished match or level (step 17): the clock drops its timers and subscribers and the bus drops its listeners and history. The log, units, grid, notices, phases and rng stay readable. Safe to call twice. */
export function disposeWorld(world: SimWorld): void {
  if (done.has(world)) return;
  done.add(world);
  world.clock.dispose();
  world.bus.dispose();
}

/** True once `disposeWorld` ran; `feed` then refuses with `disposed` and `submit` does nothing. */
export function isDisposed(world: SimWorld): boolean {
  return done.has(world);
}
