import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { BTF_LEVEL_RULES } from "../../src/btf-adapters/src/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { DAMAGE_RESOLUTION, HIT_REFUSED_REASONS, installDamage, UNIT_ROSTER, WIN_CONDITION, wipeRule, type BattleSetup, type HitRefusedReason } from "../../src/rules/battle/index.ts";
import { advance, createWorld, loadSave, replay, restore, saveMatch, snapshot, submit, type SimInput, type SimSnapshot, type SimWorld } from "../../src/sim/index.ts";
import { input, move } from "../sim/input.ts";

const SETUP: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 2, atk: 1 }, archer: { hp: 6, atk: 2 } }, reach: { wolf: 99, archer: 99, knight: 99 }, hitClass: "arrow" };
const armed = (rules: BattleSetup = SETUP): SimInput => ({ ...input("stage-fixed"), rules });
const hit = (id: string, actor: string, unitId: string, more: Partial<Action> = {}): Action => ({ id, kind: "ability", actor, target: { pipe: "unit", unitId }, durationMs: null, turns: null, effects: [], ...more });
const hpOf = (w: SimWorld, id: string) => snapshot(w).rules?.units.find((u) => u.id === id);
const seen = (w: SimWorld) => w.bus.history().flatMap((r) => (r.event.type === "hit" || r.event.type === "unit.died" ? [r.event] : []));
const codes = (w: SimWorld) => w.notices.map((n) => n.code);
function standBy(w: SimWorld, actor: string, target: string): void {
  const t = w.units.get(target);
  if (t === undefined) throw new Error(`standBy: no ${target}`);
  for (const at of [{ c: t.at.c, r: t.at.r + 1 }, { c: t.at.c, r: t.at.r - 1 }, { c: t.at.c + 1, r: t.at.r }, { c: t.at.c - 1, r: t.at.r }]) {
    if (w.grid.inBounds(at) && w.units.occupantsAt(at).length === 0) {
      const moved = w.units.moveTo(actor, at, "move");
      if (moved.ok) return;
    }
  }
  throw new Error(`standBy: no cell for ${actor} next to ${target}`);
}


test("unit-roster: defaults 9/1, L3 sets a unit document's stats, L5 scales HP only; a bad value is unsupported", () => {
  assert.deepEqual(installOne(UNIT_ROSTER, {}).out, { hp: 9, atk: 1 });
  assert.deepEqual(installOne(UNIT_ROSTER, { unit: { unit_hp: { value: 6 }, unit_atk: { value: 2 } } }).out, { hp: 6, atk: 2 });
  assert.deepEqual(installOne(UNIT_ROSTER, { unit: { unit_hp: { value: 6 } }, stageUnit: { unit_hp: { value: 5 } } }, { difficulty: { hp: 2 } }).out, { hp: 10, atk: 1 });
  const bad = installOne(UNIT_ROSTER, { unit: { unit_hp: { value: 2.5 } } });
  assert.deepEqual([bad.out, bad.unsupported.map((u) => u.knob)], [null, ["unit_hp"]]);
  assert.deepEqual(installOne(UNIT_ROSTER, { answers: { unit_atk: { source: "user", value: -1 } } }).unsupported.map((u) => u.knob), ["unit_atk"]);
});

test("damage-resolution and win-condition read their knobs through B1", () => {
  assert.deepEqual(installOne(DAMAGE_RESOLUTION, {}).out, { hitClass: "basic" });
  assert.deepEqual(installOne(DAMAGE_RESOLUTION, { answers: { hit_class: { source: "user", value: "arrow" } } }).out, { hitClass: "arrow" });
  assert.deepEqual(installOne(WIN_CONDITION, {}).out, { wipe: true, mutual: "draw" });
  const got = installOne(WIN_CONDITION, { answers: { wipe_wins: { source: "user", value: false }, mutual_wipe: { source: "user", value: "last-actor-loses" } } });
  assert.deepEqual([got.out, got.notes], [{ wipe: false, mutual: "last-actor-loses" }, []]);
});

test("without world.rules, ability and interact stay actionUnsupported and nothing changes; no rules key, no hit event", () => {
  const w = createWorld(input("stage-fixed")), before = snapshot(w);
  submit(w, hit("a1", "archer#2", "wolf#3"));
  submit(w, hit("a2", "archer#2", "wolf#3", { kind: "interact" }));
  assert.deepEqual(codes(w), ["actionUnsupported", "actionUnsupported"]);
  assert.deepEqual(snapshot(w).units, before.units);
  assert.equal(w.rules === null && !("rules" in snapshot(w)) && !w.bus.isRegistered("hit"), true);
});

test("a hit through the UNIT pipe subtracts the attacker's atk; at 0 HP the unit dies and its body leaves the board in the same step", () => {
  const w = createWorld(armed());
  assert.deepEqual([hpOf(w, "knight#1"), hpOf(w, "archer#2"), hpOf(w, "wolf#3")], [{ id: "knight#1", hp: 9, alive: true }, { id: "archer#2", hp: 6, alive: true }, { id: "wolf#3", hp: 2, alive: true }]);
  standBy(w, "wolf#3", "archer#2");
  submit(w, hit("a1", "wolf#3", "archer#2"));
  assert.deepEqual(hpOf(w, "archer#2"), { id: "archer#2", hp: 5, alive: true });
  standBy(w, "archer#2", "wolf#3");
  submit(w, hit("a2", "archer#2", "wolf#3"));
  assert.deepEqual(hpOf(w, "wolf#3"), { id: "wolf#3", hp: 0, alive: false });
  assert.deepEqual([w.units.get("wolf#3")?.alive, w.units.occupantsAt({ c: 2, r: 0 })], [false, []]);
  assert.deepEqual(seen(w), [
    { type: "hit", unit: "archer#2", by: "wolf#3", amount: 1, hp: 5, hitClass: "arrow" },
    { type: "hit", unit: "wolf#3", by: "archer#2", amount: 2, hp: 0, hitClass: "arrow" },
    { type: "unit.died", unit: "wolf#3", by: "archer#2" },
  ]);
  assert.equal(w.units.moveTo("knight#1", { c: 2, r: 0 }).ok, true);
  assert.deepEqual(codes(w), []);
  const both = createWorld({ ...armed(), levels: { rules: BTF_LEVEL_RULES, pools: {} } });
  assert.equal(["hit", "unit.died", "level.reached", "level.unlocked"].every((t) => both.bus.isRegistered(t)), true);
});

const REFUSED: readonly { reason: HitRefusedReason; a: Action }[] = [
  { reason: "unknownActor", a: hit("b1", "ghost#9", "archer#2") },
  { reason: "deadActor", a: hit("b2", "wolf#3", "archer#2") },
  { reason: "notUnitAim", a: hit("b3", "archer#2", "wolf#4", { target: { pipe: "tile", at: { c: 3, r: 0 } } }) },
  { reason: "notUnitAim", a: hit("b4", "archer#2", "wolf#4", { target: null }) },
  { reason: "aimMissed", a: hit("b5", "archer#2", "ghost#9") },
  { reason: "aimMissed", a: hit("b6", "archer#2", "wolf#3", { target: { pipe: "unit", unitId: "wolf#3", fallbackAt: { c: 99, r: 0 } } }) },
  { reason: "selfTarget", a: hit("b7", "archer#2", "archer#2") },
  { reason: "deadTarget", a: hit("b8", "archer#2", "wolf#3") },
];
for (const { reason, a } of REFUSED) {
  test(`hitRefused (DSK D7) ${a.id}: reason ${reason}, one code, nothing changes`, () => {
    const w = createWorld(armed());
    standBy(w, "archer#2", "wolf#3");
    submit(w, hit("a1", "archer#2", "wolf#3"));
    const before = snapshot(w), events = seen(w).length;
    submit(w, a);
    assert.deepEqual(w.notices, [{ code: "hitRefused", message: `hit refused (${reason})`, reason }]);
    assert.deepEqual([snapshot(w).rules, snapshot(w).units, seen(w).length], [before.rules, before.units, events]);
  });
}

test("refused: every D7 reason has a row; effects (spells, P1-4) stay actionUnsupported; nothing changes", () => {
  assert.deepEqual([...new Set(REFUSED.map((r) => r.reason))], [...HIT_REFUSED_REASONS]);
  const w = createWorld(armed()), before = snapshot(w);
  submit(w, hit("b9", "archer#2", "wolf#4", { effects: ["fire"] }));
  assert.deepEqual(codes(w), ["actionUnsupported"]);
  assert.deepEqual([snapshot(w).rules, snapshot(w).units, seen(w).length], [before.rules, before.units, 0]);
});

test("L5 difficulty.damage stays a warning through P1-4 (real layering is Phase 4): installDamage warns layerNotApplied once per install when it is not 1, and plays as 1", () => {
  const warn = { code: "layerNotApplied", message: "L5 difficulty.damage" };
  const got = installDamage({ answers: { hit_class: { source: "user", value: "spell" } } }, { difficulty: { hp: 1, damage: 1.5 } });
  assert.deepEqual([got.out, got.notes, installDamage({}, { difficulty: { hp: 2, damage: 0 } }).notes], [{ hitClass: "spell" }, [warn], [warn]]);
  assert.deepEqual(installDamage({ answers: { hit_class: { source: "user", value: "laser" } } }, { difficulty: { hp: 1, damage: 2 } }).notes, [{ code: "invalidValue", message: "damage-resolution.hit_class (L1)" }, warn]);
  for (const difficulty of [undefined, { hp: 2 }, { hp: 1, damage: 1 }]) assert.deepEqual(installDamage({}, difficulty === undefined ? undefined : { difficulty }), installOne(DAMAGE_RESOLUTION, {}));
  assert.deepEqual(installOne(UNIT_ROSTER, {}, { difficulty: { hp: 1 } }).notes, []);
});

test("win-condition wipe as a VictoryRule from sides[0]'s view: win, lose, draw or last actor loses; neutral never counts; off plays on", () => {
  const w = createWorld(armed()), sides = ["player", "wolves"] as const, at = (side: "player" | "wolves") => ({ round: 1, side });
  const wipe = wipeRule({ wipe: true, mutual: "draw" }, sides), last = wipeRule({ wipe: true, mutual: "last-actor-loses" }, sides), off = wipeRule({ wipe: false, mutual: "draw" }, sides);
  assert.equal(wipe(w, at("player")), null);
  standBy(w, "archer#2", "wolf#3"); submit(w, hit("a1", "archer#2", "wolf#3")); standBy(w, "archer#2", "wolf#4"); submit(w, hit("a2", "archer#2", "wolf#4"));
  assert.deepEqual([wipe(w, at("player")), off(w, at("player"))], ["win", null]);
  const v = createWorld(armed());
  for (const id of ["knight#1", "archer#2", "merchant#6"]) v.units.remove(id);
  assert.equal(wipe(v, at("wolves")), "lose");
  for (const id of ["wolf#3", "wolf#4"]) v.units.remove(id);
  assert.deepEqual([wipe(v, at("player")), last(v, at("player")), last(v, at("wolves"))], ["draw", "lose", "win"]);
});

test("snapshot.rules: replay and restore rebuild it, a save without it still loads (match-save v1), a wrong HP is refused", () => {
  const src = armed(), w = createWorld(src);
  submit(w, move("m1", "archer#2", 2, 1, null)); submit(w, hit("a1", "archer#2", "wolf#3")); submit(w, move("m2", "wolf#4", 0, 7, null)); submit(w, hit("a2", "wolf#4", "knight#1", { durationMs: 200 }));
  advance(w, 200);
  const snap = snapshot(w), tick = snap.tick;
  assert.deepEqual(hpOf(w, "knight#1"), { id: "knight#1", hp: 8, alive: true });
  assert.deepEqual(snapshot(replay(src, w.log, tick)), snap);
  assert.deepEqual(snapshot(restore(src, w.log, snap)), snap);
  const { rules, ...old } = snap;
  assert.deepEqual(snapshot(restore(src, w.log, old as SimSnapshot)).rules, rules);
  const wrong = { ...snap, rules: { units: snap.rules?.units.map((u) => (u.id === "knight#1" ? { ...u, hp: 9 } : u)) ?? [] } };
  assert.throws(() => restore(src, w.log, wrong), /does not match the log/);
  const text = saveMatch(w, { projectId: "p", savedAt: "s" }), loaded = loadSave(src, text);
  assert.equal(JSON.parse(text).formatVersion, 1);
  assert.deepEqual(loaded.ok ? snapshot(loaded.world) : loaded, snap);
});
