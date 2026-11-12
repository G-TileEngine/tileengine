import { createClock } from "../core/clock/index.ts";
import type { CommandLog } from "../core/log/index.ts";
import { NOT_PLAIN, isRecord, plainCopy } from "../core/plain.ts";
import type { SimInput, SimSnapshot, SimWorld } from "./types.ts";
import { submit } from "./actions.ts";
import { createWorld } from "./world.ts";

export function replayTicks(world: SimWorld, n: number): void {
  if (!Number.isInteger(n) || n < 0) throw new RangeError("replayTicks: n must be an integer >= 0");
  for (let i = 0; i < n; i += 1) world.clock.step();
}
export function advance(world: SimWorld, ms: number): void {
  const step = world.clock.stepMs;
  if (!Number.isInteger(ms) || ms < 0 || ms % step !== 0) throw new RangeError("advance: ms must be an integer >= 0 and a multiple of stepMs");
  replayTicks(world, ms / step);
}
export function snapshot(world: SimWorld): SimSnapshot {
  const { clock, grid, units, rng, log } = world;
  const occupancy: [number, readonly string[]][] = [];
  for (let i = 0; i < grid.cols * grid.rows; i += 1) {
    const ids = units.occupantsAt(grid.sqAt(i));
    if (ids.length > 0) occupancy.push([i, ids]);
  }
  return {
    tick: clock.tick(),
    clockMs: clock.now(),
    rngState: rng.state(),
    units: units.all().map((u) => ({
      id: u.id, unitId: u.unitId, side: u.side, at: { c: u.at.c, r: u.at.r },
      offset: u.offset === null ? null : { dx: u.offset.dx, dy: u.offset.dy }, facing: u.facing, alive: u.alive,
    })),
    occupancy,
    phases: { ...world.phases },
    logSeq: log.lastSeq(),
    ...(world.levels === null ? {} : { levels: world.levels.state() }),
  };
}
export function replay(input: SimInput, log: CommandLog, untilTick: number): SimWorld {
  const src = plainCopy(input, Number.POSITIVE_INFINITY);
  if (src === NOT_PLAIN || !isRecord(src)) throw new Error("replay: input is not plain data");
  const world = createWorld({ ...(src as SimInput), hostSeed: log.header.seed });
  if (world.seed !== log.header.seed) throw new Error(`replay: world seed ${world.seed} is not the log seed ${log.header.seed}`);
  let at = 0;
  for (const entry of log.entries()) {
    if (entry.tick > untilTick) break;
    replayTicks(world, entry.tick - at);
    submit(world, entry.action);
    at = entry.tick;
  }
  replayTicks(world, untilTick - at);
  return world;
}
export function restore(input: SimInput, log: CommandLog, snap: SimSnapshot): SimWorld {
  const shot = plainCopy(snap, 5);
  if (shot === NOT_PLAIN || !isRecord(shot) || !isRecord(shot.phases)) throw new Error("restore: snapshot is not plain data");
  const tick = shot.tick, stepMs = createClock().stepMs, n = typeof tick === "number" && Number.isInteger(tick) && tick >= 0 ? log.entries().filter((e) => e.tick <= tick).length : -1;
  if (n < 0 || shot.clockMs !== (tick as number) * stepMs || shot.logSeq !== n) throw new Error("restore: snapshot does not match the log");
  const world = replay(input, log, tick as number);
  world.phases = { ...(shot.phases as SimSnapshot["phases"]) };
  if (JSON.stringify(snapshot(world)) !== JSON.stringify(shot)) throw new Error("restore: snapshot does not match the log");
  return world;
}
