import assert from "node:assert/strict";
import { test } from "node:test";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { STEP_PATTERN, reachCells, targetsFor, walkTo } from "../../src/rules/move/index.ts";
import { createPlayer, createWorld, replay, snapshot, type SimInput, type SimWorld } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";
import { counter } from "../sim/seats.ts";

const at = (c: number, r: number) => ({ c, r });
const walled = (): SimInput => { const i = input("stage-fixed"), m = i.map as { logic: object }; return { ...i, map: { ...m, logic: { ...m.logic, edges: [{ c: 0, r: 8, side: "n" }, { c: 2, r: 1, side: "s" }] } } }; };
const idle = (i: SimInput = input("stage-fixed")): SimWorld => { const w = createWorld(i); w.phases = { battle: "idle" }; return w; };
const two = { source: "user", value: "orthogonal-2" };
const rule = (answers?: unknown) => { const r = installOne(STEP_PATTERN, { answers }).out; assert.ok(r !== null); return r; };

test("straight walks n,e,s,w, start excluded: a teammate blocks like any body; an L cell is not in reach; sorted by row then column", () => {
  const { grid, units } = idle();
  assert.deepEqual(reachCells(grid, units, "knight#1", 2), [at(0, 6), at(0, 7)]);
  assert.deepEqual([walkTo(grid, units, "knight#1", 2, at(0, 6)), walkTo(grid, units, "knight#1", 2, at(2, 8))], [[at(0, 7), at(0, 6)], null]);
  assert.deepEqual([walkTo(grid, units, "knight#1", 2, at(1, 7)), walkTo(grid, units, "knight#1", 2, at(1, 8)), walkTo(grid, units, "knight#1", 2, at(9, 9))], [null, null, null]);
  assert.deepEqual(reachCells(grid, units, "knight#1", 1), [at(0, 7)]);
  assert.deepEqual(reachCells(grid, units, "ghost#9", 2), []);
});

test("a ray stops at a wall edge and before any unit (teammate or not); a blocked first cell stops the ray", () => {
  const { grid, units } = idle(walled());
  assert.deepEqual(reachCells(grid, units, "knight#1", 2), []);
  assert.deepEqual(reachCells(grid, units, "wolf#3", 2), [at(0, 0), at(1, 0), at(2, 1)]);
  assert.deepEqual(reachCells(grid, units, "merchant#6", 2), [at(4, 2), at(4, 3), at(5, 4), at(4, 5), at(4, 6)]);
  assert.equal(walkTo(grid, units, "merchant#6", 2, at(2, 4)), null);
  units.remove("crate#5");
  assert.deepEqual(walkTo(grid, units, "merchant#6", 2, at(2, 4)), [at(3, 4), at(2, 4)]);
});

test("targetsFor: living units orthogonally next to the unit through the UNIT pipe, with id and side, sorted by row then column", () => {
  const w = idle(), { grid, units } = w;
  units.moveTo("wolf#3", at(4, 3), "move"); units.moveTo("knight#1", at(5, 4), "move"); units.moveTo("archer#2", at(5, 5), "move");
  const got = targetsFor(grid, units, "merchant#6");
  assert.deepEqual(got.map((t) => [t.id, t.unitId, t.side, t.at]), [["wolf#3", "wolf", "wolves", at(4, 3)], ["crate#5", "crate", "neutral", at(3, 4)], ["knight#1", "knight", "player", at(5, 4)]]);
  units.remove("crate#5");
  assert.deepEqual(targetsFor(grid, units, "merchant#6").map((t) => t.id), ["wolf#3", "knight#1"]);
  assert.deepEqual(targetsFor(grid, units, "ghost#9"), []);
});

test("step-pattern: default reach 1; orthogonal-2 reaches 2; max_step clamps it with stepClamped and keeps the stored value; other patterns are unsupported", () => {
  assert.deepEqual(rule(), { reach: 1, notes: [] });
  assert.deepEqual(rule({ pattern: two }), { reach: 2, notes: [] });
  const cut = installOne(STEP_PATTERN, { answers: { pattern: two }, stage: { max_step: { value: 1 } } });
  assert.deepEqual([cut.out?.reach, cut.out?.notes.map((n) => n.code), cut.knobs["pattern"]?.value, cut.notes.length], [1, ["stepClamped"], "orthogonal-2", 0]);
  const king = installOne(STEP_PATTERN, { answers: { pattern: { source: "user", value: "king-1" } } });
  assert.deepEqual([king.out, king.unsupported.map((u) => `${u.knob} ${u.detail ?? ""}`)], [null, ["pattern king-1"]]);
});

test("a player move under step-pattern: reach comes from the B1 layers, a far cell is refused notReachable and changes nothing, the step carries the path", () => {
  const w = idle(), p = createPlayer(w, { side: "player", moveMs: 200, nextId: counter("m"), step: rule() });
  p.feed({ type: "SelectUnit", unitId: "knight#1" });
  const before = JSON.stringify(snapshot(w)), far = p.feed({ type: "TargetCell", at: at(0, 6) });
  assert.equal(far.reject === "notReachable" && far.action === null && far.path === undefined && JSON.stringify(snapshot(w)) === before, true);
  const near = p.feed({ type: "TargetCell", at: at(0, 7) });
  assert.equal(near.reject === null && near.action?.durationMs === 200, true);
  assert.deepEqual(near.path, [at(0, 7)]);
  const ww = idle(), q = createPlayer(ww, { side: "player", moveMs: 200, nextId: counter("m"), step: rule({ pattern: two }) });
  q.feed({ type: "SelectUnit", unitId: "knight#1" });
  const ok = q.feed({ type: "TargetCell", at: at(0, 6) });
  assert.equal(ok.reject === null && ok.action?.durationMs === 400, true);
  assert.deepEqual(ok.path, [at(0, 7), at(0, 6)]);
});

test("walked moves replay deterministically", () => {
  const play = (): [string, SimWorld] => {
    const w = idle(), p = createPlayer(w, { side: "player", moveMs: 100, nextId: counter("m"), step: rule({ pattern: two }) });
    for (const [id, c, r] of [["knight#1", 0, 6], ["archer#2", 1, 6], ["knight#1", 0, 4]] as const) { w.phases = { battle: "idle" }; p.feed({ type: "SelectUnit", unitId: id }); p.feed({ type: "TargetCell", at: at(c, r) }); for (let i = 0; i < 50; i += 1) w.clock.step(); }
    return [JSON.stringify([p.history(), snapshot(w), w.log.toJSON()]), w];
  };
  const [a, w] = play();
  assert.equal(a, play()[0]);
  assert.deepEqual(w.units.get("knight#1")?.at, at(0, 4));
  assert.deepEqual(snapshot(replay(input("stage-fixed"), w.log, w.clock.tick())).units, snapshot(w).units);
});
