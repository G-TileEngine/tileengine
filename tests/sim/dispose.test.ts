import assert from "node:assert/strict";
import { test } from "node:test";
import { createPlayer, createWorld, disposeWorld, isDisposed, replay, runMatch, runTicks, snapshot, submit } from "../../src/sim/index.ts";
import { bot, reachFarRow, seedless } from "./ai.ts";
import { input } from "./input.ts";
import { counter, seatAll } from "./seats.ts";

const base = { victory: reachFarRow, fuse: 60000, maxRounds: 40, maxSimMs: 600000 };
const play = (seed: number, busLimits?: { readonly history: number }) => {
  const src = seedless(input("stage-weighted", seed));
  const world = createWorld(busLimits === undefined ? src : { ...src, busLimits });
  const sides = ["player", "rival"] as const;
  const result = runMatch(world, { ...base, sides: [...sides], seats: seatAll(world, sides, bot(seed), 200) });
  return { src, world, result };
};
const move = (id: string, durationMs: number | null) => ({ id, kind: "move" as const, actor: "knight#1", target: { pipe: "tile" as const, at: { c: 0, r: 7 } }, durationMs, turns: null, effects: [] });

test("disposeWorld (step 17): a second call does nothing; feed, submit and the drivers refuse; the log and units stay", () => {
  const { world } = play(3);
  assert.equal(isDisposed(world), false);
  const finger = JSON.stringify([snapshot(world), world.log.toJSON(), world.notices]);
  disposeWorld(world); disposeWorld(world);
  const player = createPlayer(world, { side: "player", moveMs: null, nextId: counter("m") });
  const step = player.feed({ type: "SelectUnit", unitId: "knight#1" });
  assert.deepEqual([step.reject, step.event, step.action], ["disposed", null, null]);
  assert.equal(player.history().length, 0);
  submit(world, move("a", null)); submit(world, move("b", 200));
  assert.throws(() => runMatch(world, { ...base, sides: ["player", "rival"] }), (err: unknown) => err instanceof Error && err.message === "runMatch: world is disposed");
  assert.throws(() => runTicks(world, { sides: ["player"], ai: () => [], victory: reachFarRow, everyMs: 100, maxSimMs: 1000 }), (err: unknown) => err instanceof Error && err.message === "runTicks: world is disposed");
  assert.equal(JSON.stringify([snapshot(world), world.log.toJSON(), world.notices]), finger);
  assert.deepEqual(world.bus.history(), []);
});

test("the match log is kept for the whole match: a small bus window matches the result, and replaying the log rebuilds the units", () => {
  for (let seed = 1; seed <= 3; seed += 1) {
    const full = play(seed), tiny = play(seed, { history: 8 });
    assert.deepEqual([tiny.result, tiny.world.log.toJSON(), snapshot(tiny.world)], [full.result, full.world.log.toJSON(), snapshot(full.world)]);
    const whole = full.world.bus.history();
    assert.deepEqual(tiny.world.bus.history(), whole.slice(-8));
    assert.equal(whole.length < 1024 && full.world.log.entries().length > 8, true);
    const again = replay(tiny.src, tiny.world.log, tiny.world.clock.tick());
    assert.deepEqual(again.units.all().map((u) => [u.id, u.at.c, u.at.r, u.alive]), tiny.world.units.all().map((u) => [u.id, u.at.c, u.at.r, u.alive]));
  }
});
