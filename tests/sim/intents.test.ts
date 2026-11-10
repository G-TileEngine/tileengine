import assert from "node:assert/strict";
import { test } from "node:test";
import { createGestureMapper, type PointerSample } from "../../src/runtime/input/index.ts";
import { createWorld, feedIntent, intentEvent, runMatch } from "../../src/sim/index.ts";
import { input } from "./input.ts";

const at = { c: 1, r: 2 };
const tile = { type: "CONFIRM_TARGET" as const, target: { pipe: "tile" as const, at: { c: at.c, r: at.r } } };

test("intents map to tactics events by phase (STATES §3.4); BoxSelect is a no-op that never throws", () => {
  assert.deepEqual(intentEvent("idle", { type: "SelectUnit", unitId: "knight#1" }, null), { type: "SELECT_UNIT", unitId: "knight#1" });
  assert.deepEqual(intentEvent("unitSelected", { type: "Cancel" }, null), { type: "CANCEL" });
  assert.equal(intentEvent("idle", { type: "BoxSelect", from: at, to: { c: 3, r: 4 } }, null), null);
  assert.deepEqual(intentEvent("unitSelected", { type: "TargetCell", at }, null), { type: "TAP_MOVE_CELL", at: { c: 1, r: 2 } });
  assert.deepEqual(intentEvent("targeting", { type: "TargetCell", at }, null), tile);
  assert.equal(intentEvent("idle", { type: "TargetCell", at }, null), null);
  assert.deepEqual(intentEvent("targeting", { type: "Confirm" }, { c: 4, r: 5 }), { type: "CONFIRM_TARGET", target: { pipe: "tile", at: { c: 4, r: 5 } } });
  assert.equal(intentEvent("targeting", { type: "Confirm" }, null), null);
  const world = createWorld(input("stage-fixed"));
  world.phases = { battle: "idle" };
  assert.equal(feedIntent(world, { type: "BoxSelect", from: at, to: { c: 3, r: 4 } }), null);
  assert.deepEqual(world.phases, { battle: "idle" });
});
test("tap-tap and drag give identical events and phases through feedIntent", () => {
  const p = (kind: PointerSample["kind"], c: number, r: number, ms: number, dy = 0): PointerSample =>
    ({ kind, id: 1, pointer: "touch", x: c * 64 + 32, y: r * 64 + 32 + dy, ms });
  const play = (samples: readonly PointerSample[]) => {
    const world = createWorld(input("stage-fixed"));
    world.phases = { battle: "idle" };
    const feed = createGestureMapper({ cellPx: 64, tapMaxPx: 10, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (sq) => world.units.occupantAt(sq) });
    const events = samples.flatMap((sample) => feed(sample)).map((intent) => feedIntent(world, intent));
    return { events, phases: world.phases };
  };
  const expect = { events: [{ type: "SELECT_UNIT", unitId: "knight#1" }, { type: "TAP_MOVE_CELL", at: { c: 0, r: 7 } }], phases: { battle: "moving" } };
  assert.deepEqual(play([p("down", 0, 8, 0), p("up", 0, 8, 90), p("down", 0, 7, 400), p("up", 0, 7, 480)]), expect);
  assert.deepEqual(play([p("down", 0, 8, 0), p("move", 0, 8, 40), p("move", 0, 8, 80, -30), p("move", 0, 8, 160, -30), p("up", 0, 7, 200)]), expect);
});
test("a missing battle phase throws in feedIntent and runMatch (no silent fallback)", () => {
  const world = createWorld(input("stage-fixed"));
  world.phases = {};
  assert.throws(() => feedIntent(world, { type: "Cancel" }), /feedIntent: battle phase missing/);
  assert.throws(() => runMatch(world, { sides: ["player"], ai: () => [], victory: () => null, fuse: "off", maxRounds: 1, maxSimMs: 0 }), /runMatch: battle phase missing/);
});
