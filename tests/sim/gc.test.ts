import assert from "node:assert/strict";
import { test } from "node:test";
import { setFlagsFromString } from "node:v8";
import { runInNewContext } from "node:vm";
import type { Clock } from "../../src/core/clock/index.ts";
import type { EventBus } from "../../src/core/events/index.ts";
import { createWorld, disposeWorld, runMatch, submit, type SimWorld } from "../../src/sim/index.ts";
import { bot, reachFarRow, seedless } from "./ai.ts";
import { input } from "./input.ts";
import { seatAll } from "./seats.ts";

setFlagsFromString("--expose-gc");
const gc = runInNewContext("gc") as () => void;
const mib = (n: number): string => (n / 1048576).toFixed(2);

function arm(drop: boolean): { clock: Clock; bus: EventBus; ref: WeakRef<SimWorld> } {
  const world = createWorld(input("stage-fixed"));
  const clock = world.clock, bus = world.bus, ref = new WeakRef(world);
  const pin = (): number => world.seed;
  clock.onTick(pin); bus.onAny(pin);
  submit(world, { id: "m1", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: 0, r: 7 } }, durationMs: 200, turns: null, effects: [] });
  if (drop) disposeWorld(world);
  clock.onRender(pin); bus.on("landedOn", pin);
  return { clock, bus, ref };
}
async function cleared(ref: WeakRef<SimWorld>): Promise<boolean> {
  for (let n = 0; n < 10; n += 1) {
    await new Promise<void>((done) => { setImmediate(done); });
    gc();
    if (ref.deref() === undefined) return true;
  }
  return false;
}
test("a finished, disposed world is collected while its clock and bus are kept; the same world without dispose is not", async () => {
  const gone = arm(true), kept = arm(false);
  assert.equal(await cleared(gone.ref), true);
  assert.equal(await cleared(kept.ref), false);
  assert.equal(typeof gone.clock.tick(), "number");
  assert.deepEqual(gone.bus.history(), []);
  assert.equal(kept.bus.history().length > 0, true);
});
test("heap smoke (step 17, report-only): thirty disposed matches print one heap line and never assert a number", (t) => {
  gc();
  const before = process.memoryUsage().heapUsed;
  for (let seed = 1; seed <= 30; seed += 1) {
    const world = createWorld(seedless(input("stage-weighted", seed)));
    const sides = ["player", "rival"] as const;
    runMatch(world, { victory: reachFarRow, sides: [...sides], fuse: 60000, maxRounds: 40, maxSimMs: 600000, seats: seatAll(world, sides, bot(seed), 200) });
    disposeWorld(world);
  }
  gc();
  const after = process.memoryUsage().heapUsed;
  const delta = after - before;
  const line = `heap smoke stage-weighted matches 30 run+disposed: before ${mib(before)} MiB after ${mib(after)} MiB delta ${delta < 0 ? "-" : "+"}${mib(Math.abs(delta))} MiB`;
  t.diagnostic(line);
  assert.match(line, /^heap smoke stage-weighted matches 30 run\+disposed: before \d+\.\d{2} MiB after \d+\.\d{2} MiB delta [+-]\d+\.\d{2} MiB$/);
});
