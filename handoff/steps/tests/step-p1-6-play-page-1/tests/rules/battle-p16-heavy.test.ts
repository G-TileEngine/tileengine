import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import type { Action } from "../../src/core/log/index.ts";
import type { BattleSetup } from "../../src/rules/battle/index.ts";
import { createPlayer, createWorld, snapshot, submit, type SimWorld } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

const SETUP: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 4, atk: 1 }, archer: { hp: 6, atk: 2 }, knight: { hp: 9, atk: 1 } }, hitClass: "basic" };
const armed = (more: Partial<BattleSetup> = {}) => ({ ...input("stage-fixed"), rules: { ...SETUP, ...more } });
const shot = (a: string, u: string): Action => ({ id: "s1", kind: "ability", actor: a, target: { pipe: "unit", unitId: u }, durationMs: null, turns: null, effects: ["line-shot"] });
const reason = (w: SimWorld) => w.notices.map((n) => (n as { reason?: string }).reason ?? n.code);
const bad = (more: Partial<BattleSetup>): void => { assert.throws(() => createWorld(armed(more)), /^RangeError: createBattle: bad setup$/); };
const row = (reach: unknown, damage: unknown, effectRef: unknown): Partial<BattleSetup> => ({ abilities: { archer: [{ reach, damage, effectRef } as { reach: number; damage: number; effectRef: string }] } });
const src = (rel: string): string => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");

test("H1+H6: no ability row is noShotRow; a mid-line body does not block the aimed foe", () => {
  const miss = createWorld(armed());
  miss.units.moveTo("archer#2", { c: 2, r: 3 }, "move");
  submit(miss, shot("archer#2", "wolf#3"));
  assert.deepEqual(reason(miss), ["noShotRow"]);
  assert.equal(snapshot(miss).rules?.units.find((u) => u.id === "wolf#3")?.hp, 4);
  const w = createWorld(armed({ abilities: { archer: [{ reach: 3, damage: 2, effectRef: "line-shot" }] } }));
  w.units.moveTo("archer#2", { c: 2, r: 3 }, "move");
  assert.equal(w.units.place({ unitId: "wolf", side: "wolves", at: { c: 2, r: 1 }, facing: null }).ok, true);
  submit(w, shot("archer#2", "wolf#3"));
  assert.deepEqual(reason(w), []);
  assert.equal(snapshot(w).rules?.units.find((u) => u.id === "wolf#3")?.hp, 2);
});

test("H2+H3: taken() uses whole() for reach and ShotRow; NaN damage cannot leave a 0-hp unit alive", () => {
  for (const n of [1.5, Number.NaN, 0, -1]) bad({ reach: { knight: n } });
  assert.equal(createWorld(armed({ reach: { knight: 2 } })).rules !== null, true);
  bad(row(3, Number.NaN, "line-shot")); bad(row(1.5, 2, "line-shot")); bad(row(0, 2, "line-shot")); bad(row(3, -1, "line-shot")); bad(row(3, 2, 1));
  const w = createWorld(armed(row(3, 0, "line-shot")));
  w.units.moveTo("archer#2", { c: 2, r: 3 }, "move");
  const died: string[] = [];
  w.bus.on("unit.died", (e) => died.push(e.unit));
  submit(w, shot("archer#2", "wolf#3"));
  assert.deepEqual([reason(w), snapshot(w).rules?.units.find((u) => u.id === "wolf#3")?.hp, died, w.units.get("wolf#3")?.alive], [[], 4, [], true]);
});

test("H4: wipeRule JSDoc is sides[0]'s point of view; P1-5 passes the player first", () => {
  const win = src("../../src/rules/battle/win.ts"), p15 = src("./bot-p15.test.ts");
  assert.match(win, /Point-of-view contract: `sides\[0\]`/); assert.match(win, /player first/);
  assert.match(p15, /const sides = \["player", "wolves"\] as const/); assert.match(p15, /wipeRule\(win, \[\.\.\.sides\]\)/);
});

test("H5: CONFIRM_TARGET on an empty tile refuses noTarget before feeding", () => {
  const w = createWorld(armed());
  w.phases = { ...w.phases, battle: "unitSelected" };
  const p = createPlayer(w, { side: "player", moveMs: null, nextId: () => "p1" });
  assert.equal(p.feed({ type: "SelectUnit", unitId: "knight#1" }).reject, null);
  assert.equal(p.feed({ type: "ChooseAction", actionId: "basic", unitId: "knight#1" }).reject, null);
  const tick = w.clock.tick(), n = w.notices.length;
  const step = p.feed({ type: "TargetCell", at: { c: 0, r: 0 } });
  assert.deepEqual([step.reject, step.action, w.phases.battle, w.clock.tick(), w.notices.length], ["noTarget", null, "targeting", tick, n]);
});
