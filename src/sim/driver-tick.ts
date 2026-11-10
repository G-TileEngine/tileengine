import type { Event, Outcome } from "../state/index.ts";
import { submit } from "./actions.ts";
import { advance } from "./run.ts";
import type { MatchResult, SimWorld, TickOptions } from "./types.ts";

export function runTicks(world: SimWorld, opts: TickOptions): MatchResult {
  const step = world.clock.stepMs;
  if (!Number.isInteger(opts.everyMs) || opts.everyMs <= 0 || opts.everyMs % step !== 0) {
    throw new RangeError("runTicks: everyMs must be a positive integer multiple of stepMs");
  }
  if (!Number.isInteger(opts.maxSimMs) || opts.maxSimMs < 0) throw new RangeError("runTicks: maxSimMs must be an integer >= 0");
  const busy = new Map<string, number>();
  let outcome: Outcome | null = null;
  let rounds = 0;
  while (outcome === null && world.clock.now() < opts.maxSimMs) {
    rounds += 1;
    const now = world.clock.now();
    for (const side of opts.sides) {
      const units = world.units.all().filter((u) => u.alive && u.side === side && (busy.get(u.id) ?? 0) <= now).map((u) => u.id);
      for (const action of opts.ai(world, side, { kind: "unit", units })) {
        submit(world, action);
        const ms = action.durationMs === null ? 0 : Math.max(action.durationMs, step);
        busy.set(action.actor, now + ms);
      }
      const got = opts.victory(world, { round: rounds, side });
      if (got !== null) { outcome = got; break; }
    }
    if (outcome === null) advance(world, opts.everyMs);
  }
  const events: Event[] = outcome === null ? [] : [{ type: "CHECK_END", outcome }];
  return { outcome: outcome ?? "timeout", rounds, events };
}
