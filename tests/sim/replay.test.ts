import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLog } from "../../src/core/log/index.ts";
import { advance, createWorld, replay, replayTicks, restore, snapshot, submit, type SimWorld } from "../../src/sim/index.ts";
import { input, move } from "./input.ts";

function frames(world: SimWorld, ms: number): void {
  const end = world.clock.now() + ms;
  while (world.clock.now() < end) world.clock.advance(Math.min(16, end - world.clock.now()));
}
function live(world: SimWorld, drive: (w: SimWorld, ms: number) => void = advance): void {
  submit(world, move("a1", "knight#1", 0, 7));
  drive(world, 150);
  submit(world, move("a2", "archer#2", 1, 6, 300));
  drive(world, 250);
  submit(world, move("a3", "knight#1", 0, 6, 0));
  drive(world, 400);
}
function parsed(world: SimWorld) {
  const got = parseLog(world.log.toJSON());
  if (!got.ok) throw new Error(got.error);
  return got.log;
}

test("replaying a log reproduces the event history at non-zero ticks", () => {
  const world = createWorld(input("stage-fixed"));
  live(world);
  assert.deepEqual([...new Set(world.bus.history().map((h) => h.tick))], [0, 15, 20, 40, 41, 45]);
  const again = replay(input("stage-fixed"), parsed(world), world.clock.tick());
  assert.deepEqual(again.bus.history(), world.bus.history());
  assert.equal(again.log.toJSON(), world.log.toJSON());
});
test("same seed and commands give the same snapshot, with or without a frame driver", () => {
  const stepped = createWorld(input("stage-weighted"));
  const framed = createWorld(input("stage-weighted"));
  live(stepped);
  live(framed, frames);
  assert.deepEqual(snapshot(stepped), snapshot(framed));
  assert.deepEqual(stepped.bus.history(), framed.bus.history());
});
test("snapshot → restore → replayTicks(n) equals n ticks straight", () => {
  const straight = createWorld(input("stage-fixed"));
  live(straight);
  const snap = JSON.parse(JSON.stringify(snapshot(straight)));
  const log = parsed(straight);
  const back = restore(input("stage-fixed"), log, snap);
  assert.deepEqual(snapshot(back), snap);
  replayTicks(straight, 37);
  replayTicks(back, 37);
  assert.deepEqual(snapshot(back), snapshot(straight));
  assert.throws(() => restore(input("stage-fixed"), log, { ...snap, logSeq: 99 }), /does not match/);
  const other = createWorld(input("stage-weighted"));
  assert.throws(() => replay(input("stage-fixed"), parsed(other), 0), /replay: world seed 24301 is not the log seed 7/);
});
