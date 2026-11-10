import { test } from "node:test";
import assert from "node:assert/strict";
import type { Action } from "../../src/core/log/index.ts";
import { advance, createWorld, submit, type SimWorld } from "../../src/sim/index.ts";
import { input, move } from "./input.ts";

const fresh = (): SimWorld => createWorld(input("stage-fixed"));
const holds = (w: SimWorld, c: number, r: number): readonly string[] => w.units.occupantsAt({ c, r });
const now = (id: string, kind: string, actor: string): Action => ({ id, kind, actor, target: null, durationMs: null, turns: null, effects: [] });

test("a move changes occupancy only at the end of its durationMs (M4)", () => {
  const w = fresh();
  submit(w, move("a1", "knight#1", 0, 7));
  advance(w, 190);
  assert.deepEqual(holds(w, 0, 8), ["knight#1"]);
  advance(w, 10);
  assert.deepEqual(holds(w, 0, 7), ["knight#1"]);
  assert.deepEqual(w.bus.history().slice(6).map((h) => [h.tick, h.event.type]), [[0, "actionLogged"], [20, "landedOn"]]);
});
test("wait does nothing; a failed move and an unknown kind are notices, still logged", () => {
  const w = fresh();
  submit(w, now("w", "wait", "knight#1"));
  submit(w, move("m", "knight#1", 1, 8, null));
  submit(w, now("b", "ability", "knight#1"));
  assert.deepEqual(w.notices.map((n) => n.code), ["moveFailed", "actionUnsupported"]);
  assert.equal(w.log.lastSeq() === 3 && holds(w, 0, 8).includes("knight#1"), true);
});
test("advance takes integer ms in whole steps and is not clamped like a host frame", () => {
  const w = fresh();
  for (const ms of [5, -10, 1.5, Number.NaN]) assert.throws(() => advance(w, ms), RangeError);
  advance(w, 1000);
  assert.equal(w.clock.now() === 1000 && w.clock.tick() === 100, true);
});
