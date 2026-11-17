import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { BASIC_ATTACK, INTERACT_REFUSED_REASONS, targetsFor, type BattleSetup } from "../../src/rules/battle/index.ts";
import { createPlayer, createWorld, snapshot, submit, type SimWorld } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

const SETUP: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 4, atk: 1 }, archer: { hp: 6, atk: 2 }, knight: { hp: 9, atk: 1 } }, hitClass: "basic", reach: { archer: 2, mage: 2 } };
const armed = (): SimInput => ({ ...input("stage-fixed"), rules: SETUP });
type SimInput = ReturnType<typeof input> & { rules: BattleSetup };
const act = (id: string, kind: Action["kind"], actor: string, unitId: string, more: Partial<Action> = {}): Action =>
  ({ id, kind, actor, target: { pipe: "unit", unitId }, durationMs: null, turns: null, effects: [], ...more });
const codes = (w: SimWorld) => w.notices.map((n) => (n as { code: string; reason?: string }).reason ?? n.code);
const ev = (w: SimWorld, type: string) => w.bus.history().filter((r) => r.event.type === type).map((r) => r.event);

test("basic-attack: default reach 1, L3 sets 2 for archer; a bad value is unsupported", () => {
  assert.deepEqual(installOne(BASIC_ATTACK, {}).out, { reach: 1 });
  assert.deepEqual(installOne(BASIC_ATTACK, { unit: { reach: { value: 2 } } }).out, { reach: 2 });
  assert.deepEqual(installOne(BASIC_ATTACK, { unit: { reach: { value: 0 } } }).out, null);
});

test("hitRefused outOfReach: a far foe is refused", () => {
  const w = createWorld(armed());
  submit(w, act("a1", "ability", "archer#2", "wolf#3"));
  assert.deepEqual(codes(w), ["outOfReach"]);
  assert.equal(snapshot(w).rules?.units.find((u) => u.id === "wolf#3")?.hp, 4);
});

test("hitRefused allyTarget: a same-side unit is refused even when adjacent (knight and archer at r8)", () => {
  const w = createWorld(armed());
  submit(w, act("a1", "ability", "knight#1", "archer#2"));
  assert.deepEqual(codes(w), ["allyTarget"]);
  assert.equal(snapshot(w).rules?.units.find((u) => u.id === "archer#2")?.hp, 6);
  const w2 = createWorld(armed());
  submit(w2, act("a2", "ability", "knight#1", "merchant#6")); // far, not orthogonal — still ally, not outOfReach
  assert.deepEqual(codes(w2), ["allyTarget"]);
});

test("a basic hit at reach 1 orthogonal succeeds after the actor stands next to the foe", () => {
  const w = createWorld({ ...armed(), rules: { ...SETUP, reach: { knight: 1, wolf: 1 } } });
  w.units.moveTo("knight#1", { c: 2, r: 1 }, "move");
  submit(w, act("a1", "ability", "knight#1", "wolf#3"));
  assert.deepEqual(codes(w), []);
  assert.equal(snapshot(w).rules?.units.find((u) => u.id === "wolf#3")?.hp, 3);
});

test("diagonal is not in reach (BTF inBasicRange, not diagonal)", () => {
  const w = createWorld({ ...armed(), rules: { ...SETUP, reach: { knight: 2 } } });
  w.units.moveTo("knight#1", { c: 1, r: 1 }, "move");
  submit(w, act("a1", "ability", "knight#1", "wolf#3")); // wolf at 2,0 — diagonal
  assert.deepEqual(codes(w), ["outOfReach"]);
});

test("interact: adjacent neutral emits unit.interacted, nothing else changes, and it is free (no hit, no death)", () => {
  const w = createWorld(armed()), before = snapshot(w);
  w.units.moveTo("knight#1", { c: 3, r: 5 }, "move");
  submit(w, act("t1", "interact", "knight#1", "crate#5"));
  assert.deepEqual(codes(w), []);
  assert.deepEqual(ev(w, "unit.interacted"), [{ type: "unit.interacted", by: "knight#1", target: "crate#5" }]);
  assert.deepEqual([snapshot(w).rules, snapshot(w).units], [before.rules, snapshot(w).units]); // hp unchanged; body may have moved
  assert.equal(snapshot(w).rules?.units.find((u) => u.id === "crate#5")?.hp, before.rules?.units.find((u) => u.id === "crate#5")?.hp);
});

test("interactRefused: every reason has a row; foe and far neutrals are refused; the list is frozen", () => {
  assert.equal(Object.isFrozen(INTERACT_REFUSED_REASONS), true);
  const w = createWorld(armed());
  submit(w, act("k0", "ability", "archer#2", "wolf#3")); // out of reach, wolf lives
  const rows: [string, Action][] = [
    ["unknownActor", act("i1", "interact", "ghost#9", "crate#5")],
    ["deadActor", act("i2", "interact", "wolf#3", "crate#5")], // wolf still alive — use a killed actor below
    ["notUnitAim", act("i3", "interact", "knight#1", "crate#5", { target: { pipe: "tile", at: { c: 3, r: 4 } } })],
    ["aimMissed", act("i4", "interact", "knight#1", "ghost#9")],
    ["selfTarget", act("i5", "interact", "knight#1", "knight#1")],
    ["notAdjacent", act("i6", "interact", "knight#1", "crate#5")], // knight at 0,8, crate at 3,4
    ["foeTarget", act("i7", "interact", "knight#1", "wolf#3")], // placed adjacent below
  ];
  const w2 = createWorld(armed());
  w2.units.moveTo("archer#2", { c: 2, r: 1 }, "move");
  submit(w2, act("kill", "ability", "archer#2", "wolf#3"));
  submit(w2, act("kill2", "ability", "archer#2", "wolf#3"));
  // wolf should be dead after 2 hits of 2 on 4 hp
  assert.equal(w2.units.get("wolf#3")?.alive, false);
  submit(w2, act("i2", "interact", "wolf#3", "crate#5"));
  const last = (n: { code?: string; reason?: string } | undefined) => { if (n === undefined) throw new Error("expected a notice"); return n; };
  assert.equal(last(w2.notices.at(-1) as { code?: string; reason?: string }).reason, "deadActor");
  assert.equal(last(w2.notices.at(-1) as { code?: string; reason?: string }).code, "interactRefused");
  submit(w2, act("i8", "interact", "archer#2", "wolf#3"));
  assert.equal(last(w2.notices.at(-1) as { code?: string; reason?: string }).reason, "deadTarget");
  assert.equal(last(w2.notices.at(-1) as { code?: string; reason?: string }).code, "interactRefused");
  const seen = new Set<string>();
  for (const [reason, a] of rows) {
    if (reason === "deadActor") continue;
    const w = createWorld(armed());
    if (reason === "foeTarget") w.units.moveTo("knight#1", { c: 2, r: 1 }, "move");
    submit(w, a);
    const n = w.notices[0] as { code?: string; reason?: string };
    assert.equal(n.code, "interactRefused", a.id);
    assert.equal(n.reason, reason, a.id);
    seen.add(reason);
  }
  seen.add("deadActor");
  seen.add("deadTarget");
  assert.deepEqual([...seen].sort(), [...INTERACT_REFUSED_REASONS].sort());
});

test("QA S2: the player path aims without fallbackAt, so a dead id is deadTarget; a raw aim with fallbackAt still hits the occupant", () => {
  const w = createWorld({ ...armed(), rules: { ...SETUP, reach: { archer: 99, wolf: 99, knight: 99 } } });
  w.units.moveTo("archer#2", { c: 2, r: 1 }, "move");
  submit(w, act("k1", "ability", "archer#2", "wolf#3"));
  submit(w, act("k2", "ability", "archer#2", "wolf#3"));
  assert.equal(w.units.get("wolf#3")?.alive, false);
  w.units.moveTo("wolf#4", { c: 2, r: 0 }, "move");
  const before = snapshot(w).rules?.units.find((u) => u.id === "wolf#4")?.hp;
  submit(w, act("raw", "ability", "archer#2", "wolf#3", { target: { pipe: "unit", unitId: "wolf#3", fallbackAt: { c: 2, r: 0 } } }));
  assert.equal(snapshot(w).rules?.units.find((u) => u.id === "wolf#4")?.hp, (before ?? 4) - 2);
  const w2 = createWorld({ ...armed(), rules: { ...SETUP, reach: { archer: 99, knight: 99 } } });
  w2.units.moveTo("archer#2", { c: 2, r: 1 }, "move");
  submit(w2, act("k1", "ability", "archer#2", "wolf#3"));
  submit(w2, act("k2", "ability", "archer#2", "wolf#3"));
  submit(w2, act("plain", "ability", "archer#2", "wolf#3")); // no fallback
  assert.equal((w2.notices.at(-1) as { reason?: string }).reason, "deadTarget");
});

test("targetsFor lists living foes in orthogonal reach and adjacent neutrals; never a fallback dead body", () => {
  const w = createWorld(armed());
  assert.deepEqual(targetsFor(w.grid, w.units, "knight#1", "basic", SETUP).map((t) => t.id), []);
  w.units.moveTo("knight#1", { c: 2, r: 1 }, "move");
  assert.deepEqual(targetsFor(w.grid, w.units, "knight#1", "basic", { reach: { knight: 1 } }).map((t) => t.id), ["wolf#3"]);
  assert.deepEqual(targetsFor(w.grid, w.units, "knight#1", "interact").map((t) => t.id), []);
  w.units.moveTo("knight#1", { c: 3, r: 5 }, "move");
  assert.deepEqual(targetsFor(w.grid, w.units, "knight#1", "interact").map((t) => t.id), ["crate#5"]);
  const w2 = createWorld(armed());
  w2.units.moveTo("knight#1", { c: 2, r: 1 }, "move");
  for (const id of ["k1", "k2", "k3", "k4"]) submit(w2, act(id, "ability", "knight#1", "wolf#3"));
  assert.equal(w2.units.get("wolf#3")?.alive, false);
  assert.deepEqual(targetsFor(w2.grid, w2.units, "knight#1", "basic", { reach: { knight: 1 } }).map((t) => t.id), []);
});

test("player ChooseAction + confirm submits an aimUnit without fallbackAt and walks the phase path from unitSelected", () => {
  const w = createWorld(armed());
  w.units.moveTo("knight#1", { c: 3, r: 5 }, "move");
  w.phases = { ...w.phases, battle: "unitSelected" };
  const p = createPlayer(w, { side: "player", moveMs: null, nextId: (() => { let n = 0; return () => `p${++n}`; })() });
  const a = p.feed({ type: "SelectUnit", unitId: "knight#1" });
  assert.equal(a.reject, null);
  const b = p.feed({ type: "ChooseAction", actionId: "interact", unitId: "knight#1" });
  assert.equal(b.reject, null);
  assert.equal(w.phases.battle, "targeting");
  const c = p.feed({ type: "TargetCell", at: { c: 3, r: 4 } });
  assert.equal(c.reject, null);
  assert.equal(c.action?.kind, "interact");
  assert.equal(c.action?.target && c.action.target.pipe === "unit" && !("fallbackAt" in c.action.target), true);
  assert.deepEqual(ev(w, "unit.interacted"), [{ type: "unit.interacted", by: "knight#1", target: "crate#5" }]);
});

test("default reach 1 without a setup.reach table: adjacent foe is hit, two tiles away is outOfReach", () => {
  const bare: BattleSetup = { base: SETUP.base, stats: SETUP.stats, hitClass: "basic" };
  const w = createWorld({ ...input("stage-fixed"), rules: bare });
  w.units.moveTo("knight#1", { c: 2, r: 1 }, "move");
  submit(w, act("a1", "ability", "knight#1", "wolf#3"));
  assert.deepEqual(codes(w), []);
  const w2 = createWorld({ ...input("stage-fixed"), rules: bare });
  w2.units.moveTo("knight#1", { c: 2, r: 2 }, "move");
  submit(w2, act("a2", "ability", "knight#1", "wolf#3"));
  assert.deepEqual(codes(w2), ["outOfReach"]);
});
