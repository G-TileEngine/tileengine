import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { createRegistry, installOne, installSetups, XP_LEVELS } from "../../src/rules/behaviours/index.ts";
import { DAMAGE_RESOLUTION, LINE_SHOT, abilityTableFor, installDamage, type BattleSetup } from "../../src/rules/battle/index.ts";
import { createWorld, snapshot, submit, type SimWorld } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

const SETUP: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 4, atk: 1 }, archer: { hp: 6, atk: 2 }, knight: { hp: 9, atk: 1 } }, hitClass: "basic", abilities: { archer: [{ reach: 3, damage: 2, effectRef: "line-shot" }] } };
const armed = (more: Partial<BattleSetup> = {}): ReturnType<typeof input> & { rules: BattleSetup } => ({ ...input("stage-fixed"), rules: { ...SETUP, ...more } });
const shot = (id: string, actor: string, unitId: string): Action =>
  ({ id, kind: "ability", actor, target: { pipe: "unit", unitId }, durationMs: null, turns: null, effects: ["line-shot"] });
const codes = (w: SimWorld) => w.notices.map((n) => (n as { code: string; reason?: string }).reason ?? n.code);
const user = (value: unknown) => ({ source: "user", value, rev: 1 });
const v = (value: unknown) => ({ value, rev: 1 });

test("line-shot: defaults 3/2, L3 can raise them, a bad value is unsupported, mana_cost is read and ignored", () => {
  assert.deepEqual(installOne(LINE_SHOT, {}).out, { reach: 3, damage: 2 });
  assert.deepEqual(installOne(LINE_SHOT, { unit: { reach: { value: 4 }, damage: { value: 3 } } }).out, { reach: 4, damage: 3 });
  assert.equal(installOne(LINE_SHOT, { unit: { reach: { value: 0 } } }).out, null);
  const mana = installOne(LINE_SHOT, { answers: { mana_cost: user(9) } });
  assert.deepEqual(mana.out, { reach: 3, damage: 2 });
  assert.equal(mana.unsupported.some((u) => u.knob === "mana_cost"), false);
});

test("line-shot hits a foe at orthogonal reach 3 for 2, not the attacker's atk; diagonal and reach 4 are outOfReach; hitClass is spell", () => {
  const w = createWorld(armed());
  w.units.moveTo("archer#2", { c: 2, r: 3 }, "move"); // wolf#3 at 2,0 — Manhattan 3
  submit(w, shot("s1", "archer#2", "wolf#3"));
  assert.deepEqual(codes(w), []);
  assert.equal(snapshot(w).rules?.units.find((u) => u.id === "wolf#3")?.hp, 2);
  const ev = w.bus.history().map((r) => r.event).find((e) => e.type === "hit") as { hitClass?: string; amount?: number } | undefined;
  assert.deepEqual({ hitClass: ev?.hitClass, amount: ev?.amount }, { hitClass: "spell", amount: 2 });
  const d = createWorld(armed());
  d.units.moveTo("archer#2", { c: 3, r: 1 }, "move");
  submit(d, shot("s2", "archer#2", "wolf#3"));
  assert.deepEqual(codes(d), ["outOfReach"]);
  const far = createWorld(armed());
  far.units.moveTo("archer#2", { c: 2, r: 4 }, "move");
  submit(far, shot("s3", "archer#2", "wolf#3"));
  assert.deepEqual(codes(far), ["outOfReach"]);
});

test("line-shot still refuses allyTarget and unknown effects stay actionUnsupported", () => {
  const w = createWorld(armed());
  submit(w, shot("s1", "knight#1", "archer#2"));
  assert.deepEqual(codes(w), ["allyTarget"]);
  const w2 = createWorld(armed());
  submit(w2, { id: "x", kind: "ability", actor: "knight#1", target: { pipe: "unit", unitId: "wolf#3" }, durationMs: null, turns: null, effects: ["fire"] });
  assert.deepEqual(codes(w2), ["actionUnsupported"]);
});

test("ability table: L0 catalogue, L1 answers, L2 stage overrides, L3 unit stats; basic and spells groups", () => {
  const setups = new Map([
    ["ba", { id: "ba", behaviourId: "basic-attack", answers: { reach: user(1) } }],
    ["ls", { id: "ls", behaviourId: "line-shot", answers: { reach: user(3), damage: user(2) } }],
  ]);
  const unit = { setupIds: ["ba", "ls"], stats: { reach: 5, damage: 4 } }; // L3 wins for both knobs on line-shot; basic only has reach
  assert.deepEqual(abilityTableFor(unit, setups, { ls: { damage: 9 } }), [
    { key: "ba", group: "basic", reach: 5, damage: 0, effectRef: "basic" },
    { key: "ls", group: "spells", reach: 5, damage: 4, effectRef: "line-shot" },
  ]);
  assert.deepEqual(abilityTableFor({ setupIds: ["ls"] }, setups, { ls: { reach: v(4) } }).at(0), { key: "ls", group: "spells", reach: 4, damage: 2, effectRef: "line-shot" });
  assert.deepEqual(abilityTableFor({ setupIds: ["ls"] }, setups).at(0), { key: "ls", group: "spells", reach: 3, damage: 2, effectRef: "line-shot" });
});

test("a resolved ability row supplies line-shot reach and damage on the hit", () => {
  const w = createWorld(armed({ abilities: { archer: [{ reach: 4, damage: 3, effectRef: "line-shot" }] } }));
  w.units.moveTo("archer#2", { c: 2, r: 4 }, "move"); // Manhattan 4
  submit(w, shot("s1", "archer#2", "wolf#3"));
  assert.deepEqual(codes(w), []);
  assert.equal(snapshot(w).rules?.units.find((u) => u.id === "wolf#3")?.hp, 1);
});

test("installSetups on damage-resolution keeps the L5 layerNotApplied note (QA R2); installDamage is the same path", () => {
  const warn = { code: "layerNotApplied", message: "L5 difficulty.damage" };
  const ctx = { difficulty: { hp: 1, damage: 1.5 } };
  const via = installSetups(createRegistry([DAMAGE_RESOLUTION]), [{ behaviourId: "damage-resolution" }], ctx).get("damage-resolution");
  assert.deepEqual(via?.notes, [warn]);
  assert.deepEqual(installDamage({}, ctx).notes, [warn]);
});

test("xp-levels install still reads legacy comma-string thresholds; an int-list is invalid until catalogue rev 27 types the knob", () => {
  const table = [17, 11, 13, 11, 13, 14, 11, 11, 11];
  assert.deepEqual(installOne(XP_LEVELS, { answers: { thresholds: user("17,11,13,11,13,14,11,11,11") } }).out?.thresholds, table);
  const arr = installOne(XP_LEVELS, { answers: { thresholds: user(table) } });
  assert.equal(arr.out, null);
  assert.equal(arr.notes.some((n) => n.code === "invalidValue"), true);
});
