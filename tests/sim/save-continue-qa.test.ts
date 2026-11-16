// QA pin for G4: a held fuse still lands when createTurn is given no onFuse.
import assert from "node:assert/strict";
import { test } from "node:test";
import type { Event } from "../../src/state/index.ts";
import { createTurn, createWorld, replayTicks, submit } from "../../src/sim/index.ts";
import { input, move } from "./input.ts";

const ev = (type: string, more: Record<string, unknown> = {}): Event => ({ type, ...more } as Event);
const START = [ev("BATTLE_READY"), ev("DEPLOY_DONE"), ev("ROUND_BEGIN"), ev("SIDE_BEGIN")];

test("a held fuse on MOVE_DONE writes sideEnd even when no onFuse is passed (QA G4)", () => {
  const w = createWorld(input("stage-fixed"));
  const t = createTurn(w, { fuse: 50 });
  for (const e of START) t.go(e);
  t.go(ev("SELECT_UNIT", { unitId: "knight#1" }));
  t.go(ev("TAP_MOVE_CELL", { at: { c: 0, r: 7 } }));
  submit(w, move("m1", "knight#1", 0, 7, 2000));
  replayTicks(w, 20);
  assert.deepEqual([w.phases.battle, t.pendingFuse], ["moving", true]);
  assert.equal(t.go(ev("MOVE_DONE")), "sideEnd");
  assert.deepEqual([w.phases.battle, t.pendingFuse, t.settled, t.undo], ["sideEnd", false, true, null]);
});
