import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { targetsFor } from "../../src/rules/battle/index.ts";
import { TEAM } from "../../tools/play-stage/load.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { demoDocs, U } from "./demo-fixture.ts";

type Stage = Record<string, unknown>;
type Match = ReturnType<typeof createMatch>;
const stageOf = (): Stage => { const raw = structuredClone(demoDocs().stage); if (typeof raw !== "object" || raw === null) throw new Error("stage"); return raw as Stage; };
const open = (stage: Stage): Match => createMatch({ ...demoDocs(), stage }, 20);
const idOf = (m: Match, unitId: string): string => { const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id; };
const land = (m: Match): void => { m.endTurn(); for (let i = 0; i < 40 && m.walk !== null; i += 1) { m.world.clock.advance(40); m.sync(); } };
const logged = (m: Match, unitId: string): boolean => { const ids = new Set(m.world.units.all().filter((u) => u.unitId === unitId).map((u) => u.id)); return m.world.log.entries().some((e) => ids.has(e.action.actor)); };
const rows = (v: unknown): Stage[] => Array.isArray(v) ? v.flatMap((row) => (typeof row === "object" && row !== null ? [row as Stage] : [])) : [];
const noSides = (s: Stage): Stage => { const next = { ...s }; delete next["sides"]; return next; };
const noPool = (s: Stage): Stage => ({ ...s, enemyPool: { mode: "fixed", entries: [] } });
const tint = (m: Match, inst: string): number => {
  const scene = m.scene(), unit = scene.units.find((u) => u.id === inst), asset = unit === undefined ? undefined : scene.assets[unit.sprite];
  const px = asset === undefined ? undefined : m.pixels(asset.sheet.id), r = px?.data[0], g = px?.data[1], b = px?.data[2];
  if (r === undefined || g === undefined || b === undefined) throw new Error(inst);
  return ((r << 16) | (g << 8) | b) >>> 0;
};
const beside = (m: Match, unitId: string): string => {
  const knight = idOf(m, U.knight), other = idOf(m, unitId), at = m.world.units.get(knight)?.at;
  if (at === undefined) throw new Error("knight");
  if (!m.world.units.moveTo(other, { c: at.c, r: at.r - 1 }, "move").ok) throw new Error("move");
  return other;
};

test("sides: the demo builds [player, wolves] from data, wolves act on End Turn, and the turn returns", () => {
  const m = open(stageOf());
  assert.deepEqual([...m.sides.order], ["player", "wolves"]); assert.equal(m.sides.contest, true);
  land(m); assert.equal(logged(m, U.wolf), true); assert.equal(m.side, "player"); assert.equal(m.outcome, null);
});
test("sides: an enemy pool on the default side 'rival' gets enemy turns and can be wiped for a win", () => {
  const m = open(noSides(stageOf()));
  assert.deepEqual([...m.sides.order], ["player", "rival"]);
  land(m); assert.equal(logged(m, U.wolf), true); assert.equal(m.side, "player");
  m.world.units.all().filter((u) => u.unitId === U.wolf).forEach((u) => m.world.units.remove(u.id));
  land(m); assert.equal(m.outcome, "win");
});
test("sides: a stage with one side at start is free roam: no outcome, End Turn returns to the player", () => {
  const m = open(noPool(stageOf()));
  assert.deepEqual([...m.sides.order], ["player"]); assert.equal(m.sides.contest, false);
  for (let n = 0; n < 3; n += 1) { land(m); assert.equal(m.outcome, null); assert.equal(m.side, "player"); assert.equal(String(m.world.phases.battle), "idle"); }
});
test("sides: a neutral placed with side = the enemy side ('rival') acts and is targetable", () => {
  const s = noSides(noPool(stageOf())), m = open({ ...s, neutrals: rows(s["neutrals"]).map((row) => row["unitId"] === U.villager ? { ...row, side: "rival" } : row) });
  const villager = beside(m, U.villager), hits = targetsFor(m.world.grid, m.world.units, idOf(m, U.knight), "basic", demoDocs().rules);
  assert.equal(hits.some((t) => t.id === villager), true); land(m); assert.equal(logged(m, U.villager), true);
});
test("sides: a neutral with no side is never targeted, never acts and is not counted for the wipe", () => {
  const m = open(stageOf()), villager = beside(m, U.villager);
  assert.equal(targetsFor(m.world.grid, m.world.units, idOf(m, U.knight), "basic", demoDocs().rules).some((t) => t.id === villager), false);
  assert.equal(m.sides.order.includes("neutral"), false);
  m.world.units.all().filter((u) => u.unitId === U.wolf).forEach((u) => m.world.units.remove(u.id));
  land(m); assert.equal(m.outcome, "win"); assert.equal(m.world.units.get(villager)?.alive, true); assert.equal(logged(m, U.villager), false);
});
test("sides: unit colour comes from side, not the recipe", () => {
  const m = open(stageOf());
  assert.equal(tint(m, idOf(m, U.knight)), TEAM.player); assert.equal(tint(m, idOf(m, U.wolf)), TEAM.enemy);
  assert.equal(tint(m, idOf(m, U.villager)), TEAM.neutral); assert.equal(tint(m, idOf(m, U.merchant)), TEAM.player);
  const bare = noPool(stageOf()), foe = open({ ...bare, enemyPool: { mode: "fixed", entries: [{ unitId: U.villager, at: { c: 2, r: 0 } }] }, neutrals: rows(bare["neutrals"]).map((row) => row["unitId"] === U.villager ? { ...row, side: "wolves" } : row) });
  const painted = foe.world.units.all().filter((u) => u.unitId === U.villager && u.side === "wolves");
  assert.equal(painted.length, 2); for (const u of painted) assert.equal(tint(foe, u.id), TEAM.enemy);
  const extra = stageOf(), lone = open({ ...extra, neutrals: [...rows(extra["neutrals"]), { unitId: U.wolf, at: { c: 0, r: 6 } }] });
  const kept = lone.world.units.all().find((u) => u.unitId === U.wolf && u.side === "wolves"), added = lone.world.units.all().find((u) => u.unitId === U.wolf && u.side === "neutral");
  if (kept === undefined || added === undefined) throw new Error("wolf");
  assert.equal(tint(lone, kept.id), TEAM.enemy); assert.equal(tint(lone, added.id), TEAM.neutral);
});
test("sides: no play-stage file names the wolves or reads a recipe team", () => {
  for (const name of readdirSync(new URL("../../tools/play-stage/", import.meta.url))) {
    if (!name.endsWith(".ts")) continue;
    const text = readFileSync(new URL(`../../tools/play-stage/${name}`, import.meta.url), "utf8");
    assert.equal(/wolves/.test(text), false, name); assert.equal(/\.team\b/.test(text), false, name);
  }
});
