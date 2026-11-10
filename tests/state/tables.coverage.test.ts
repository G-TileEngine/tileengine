import assert from "node:assert/strict";
import { test } from "node:test";
import { TABLES } from "../../src/state/xgo.ts";
import { ALL_EVENT_TYPES, ALL_PHASES, type EventType, type Phase } from "../../src/state/types.ts";

const phases: Record<Phase, true> = {
  "play.loading": true, "play.result": true, targeting: true, resolving: true, victoryCheck: true,
  "overlay.none": true, "overlay.pause": true, "overlay.settings": true, "overlay.saveLoad": true,
  deploy: true, roundStart: true, sideStart: true, unitDone: true, sideEnd: true, roundEnd: true,
  idle: true, unitSelected: true, moving: true, actMenu: true,
};

const events: Record<EventType, true> = {
  BATTLE_READY: true, DEPLOY_DONE: true, ROUND_BEGIN: true, SIDE_BEGIN: true, SELECT_UNIT: true, CANCEL: true,
  TAP_MOVE_CELL: true, MOVE_DONE: true, UNDO_MOVE: true, CHOOSE_ACTION: true, CONFIRM_TARGET: true, WAIT: true,
  RESOLVE_DONE: true, CHECK_NONE: true, CHECK_END: true, UNIT_DONE: true, END_TURN: true, FUSE_EXPIRE: true,
  SIDE_END: true, ROUND_END: true, OPEN_PAUSE: true, OPEN_SETTINGS: true, OPEN_SAVELOAD: true, CLOSE: true,
};

function exits(from: Phase): Phase[] {
  const dests: Phase[] = [];
  for (const table of TABLES) {
    for (const row of table.rows) {
      if (!row.from.includes(from)) continue;
      if (typeof row.to === "string") dests.push(row.to);
      else dests.push(...row.to);
    }
  }
  return dests;
}

test("ALL_PHASES and ALL_EVENT_TYPES are exhaustive", () => {
  assert.deepEqual([...ALL_PHASES].sort(), Object.keys(phases).sort());
  assert.deepEqual([...ALL_EVENT_TYPES].sort(), Object.keys(events).sort());
});

test("every phase is reachable", () => {
  const seen = new Set<Phase>(["play.loading", "overlay.none"]);
  const queue: Phase[] = ["play.loading", "overlay.none"];
  while (queue.length > 0) {
    const from = queue.pop();
    if (from === undefined) break;
    for (const to of exits(from)) {
      if (seen.has(to)) continue;
      seen.add(to);
      queue.push(to);
    }
  }
  assert.equal(seen.size, 19);
  assert.deepEqual([...seen].sort(), [...ALL_PHASES].sort());
});

test("only play.result is terminal", () => {
  for (const phase of ALL_PHASES) {
    const n = exits(phase).length;
    if (phase === "play.result") assert.equal(n, 0);
    else assert.ok(n >= 1, phase);
  }
});
