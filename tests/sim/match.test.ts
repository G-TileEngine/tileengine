import assert from "node:assert/strict";
import { test } from "node:test";
import { parseLog } from "../../src/core/log/index.ts";
import { createWorld, replay, restore, runMatch, runTicks, snapshot, type MatchOptions, type SimWorld } from "../../src/sim/index.ts";
import { forward, reachFarRow, seedless } from "./ai.ts";
import { input, move } from "./input.ts";

const base: MatchOptions = { sides: ["player", "wolves"], ai: () => [], victory: () => null, fuse: 60000, maxRounds: 40, maxSimMs: 600000 };
const kinds = (events: readonly { type: string }[]): string[] => events.map((e) => e.type);
const turn = ["SIDE_BEGIN", "SELECT_UNIT", "TAP_MOVE_CELL", "MOVE_DONE", "WAIT", "UNIT_DONE", "END_TURN", "SIDE_END"];
function parsed(world: SimWorld) {
  const got = parseLog(world.log.toJSON());
  if (!got.ok) throw new Error(got.error);
  return got.log;
}
test("the phase driver gives every side the same events; the AI hook gets side and budget only (M6)", () => {
  const calls: unknown[] = [];
  const world = createWorld(input("stage-fixed"));
  const result = runMatch(world, { ...base, victory: (_w, at) => (at.side === "wolves" ? "draw" : null), ai: (_w, side, budget) => {
    calls.push([side, budget]);
    return side === "player" ? [move("p", "knight#1", 0, 7)] : [move("w", "wolf#3", 2, 1)];
  } });
  assert.deepEqual(kinds(result.events), ["BATTLE_READY", "DEPLOY_DONE", "ROUND_BEGIN", ...turn, "CHECK_NONE", ...turn, "CHECK_END"]);
  assert.equal(result.outcome === "draw" && result.rounds === 1 && world.clock.now() === 400, true);
  assert.deepEqual(world.phases, { battle: "play.result" });
  assert.deepEqual(calls, [["player", { kind: "side", units: ["knight#1", "archer#2", "merchant#6"] }], ["wolves", { kind: "side", units: ["wolf#3", "wolf#4"] }]]);
});
test("the turn fuse ends a stalled side at exactly its ms, also mid-move; the length is the user's", () => {
  for (const fuse of [60000, 30000] as const) {
    const world = createWorld(input("stage-fixed"));
    const result = runMatch(world, { ...base, fuse, victory: () => "lose" });
    assert.deepEqual(kinds(result.events.slice(3)), ["SIDE_BEGIN", "FUSE_EXPIRE", "SIDE_END", "CHECK_END"]);
    assert.equal(world.clock.now(), fuse);
  }
  const world = createWorld(input("stage-fixed"));
  const result = runMatch(world, { ...base, fuse: 1000, victory: () => "lose", ai: () => [move("a", "knight#1", 0, 7, 3000), move("b", "knight#1", 0, 6, 200)] });
  assert.deepEqual(kinds(result.events.slice(4)), ["SELECT_UNIT", "TAP_MOVE_CELL", "MOVE_DONE", "FUSE_EXPIRE", "SIDE_END", "CHECK_END"]);
  assert.equal(world.clock.now() === 3000 && world.log.lastSeq() === 1, true);
});
test("with the fuse off a stalled side runs to maxSimMs and the match is a timeout", () => {
  const world = createWorld(input("stage-fixed"));
  const result = runMatch(world, { ...base, fuse: "off", maxSimMs: 5000 });
  assert.equal(result.outcome === "timeout" && world.clock.now() === 5000 && !result.events.some((e) => e.type === "FUSE_EXPIRE"), true);
  assert.throws(() => runMatch(createWorld(input("stage-fixed")), { ...base, maxSimMs: 1.5 }), RangeError);
});
test("50 seeds on 6x9 and 12x12 each end in win, lose or draw, and each log replays to the same history", () => {
  const maps = [["stage-fixed", ["player", "wolves"]], ["stage-weighted", ["player", "rival"]]] as const;
  for (let seed = 1; seed <= 50; seed += 1) for (const [stage, sides] of maps) {
    const src = seedless(input(stage, seed));
    const world = createWorld(src);
    const result = runMatch(world, { ...base, sides: [...sides], ai: forward(seed), victory: reachFarRow });
    assert.notEqual(result.outcome, "timeout");
    assert.deepEqual(replay(src, parsed(world), world.clock.tick()).bus.history(), world.bus.history());
  }
});
test("the snapshot carries phases; restore takes them from the snapshot and checks the rest", () => {
  assert.deepEqual(createWorld(input("stage-fixed")).phases, { battle: "play.loading" });
  const src = input("stage-fixed"), world = createWorld(src);
  runMatch(world, { ...base, ai: forward(3), victory: reachFarRow });
  const snap = snapshot(world), round = JSON.parse(JSON.stringify(snap)) as typeof snap;
  assert.deepEqual(Object.keys(round), ["tick", "clockMs", "rngState", "units", "occupancy", "phases", "logSeq"]);
  assert.deepEqual(snapshot(restore(src, parsed(world), round)), snap);
  assert.equal(round.phases.battle, "play.result");
});
test("the tick driver asks the same hook every everyMs for idle units only, and replays (M1, M6)", () => {
  const calls: unknown[] = [], src = input("stage-fixed"), world = createWorld(src);
  const result = runTicks(world, {
    sides: ["player"], everyMs: 100, maxSimMs: 5000,
    ai: (w, side, budget) => {
      calls.push([w.clock.now(), side, budget.kind, budget.units.length]);
      const knight = w.units.get("knight#1");
      return knight !== undefined && budget.units.includes("knight#1") ? [move("k", "knight#1", 0, knight.at.r - 1)] : [];
    },
    victory: (w) => (w.units.get("knight#1")?.at.r === 5 ? "win" : null),
  });
  assert.equal(result.outcome === "win" && result.rounds === 7 && world.clock.now() === 600, true);
  assert.deepEqual(result.events, [{ type: "CHECK_END", outcome: "win" }]);
  assert.deepEqual(calls.slice(0, 3), [[0, "player", "unit", 3], [100, "player", "unit", 2], [200, "player", "unit", 3]]);
  assert.deepEqual(replay(src, parsed(world), world.clock.tick()).bus.history(), world.bus.history());
  assert.throws(() => runTicks(world, { sides: ["player"], ai: () => [], victory: () => null, everyMs: 15, maxSimMs: 5000 }), RangeError);
});
