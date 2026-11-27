import assert from "node:assert/strict";
import { test } from "node:test";
import { prefix } from "../../src/editor/project/home.ts";
import { asWrites } from "../../src/editor/project/save.ts";
import { stageNames, testGate } from "../../src/editor/project/test-gate.ts";
import { budgetUse, readProject, type BudgetUse } from "../../src/project/load/index.ts";
import { budgetsRow, budgetsTap } from "../../tools/maker/budgets.ts";
import { buildGame } from "../../tools/maker/export.ts";
import { commitWrites, memoryStore, type MakerStore } from "../../tools/maker/store.ts";
import { launchTest } from "../../tools/maker/test-launch.ts";
import { loadFixture, U } from "../tools/demo-fixture.ts";
const SID = "stage_01JDAS00000000000000000001", STAGE = `stages/${SID}.json`, MAP = "maps/map_01JDAM00000000000000000001.json", AT = `stages/${SID}.json#`, PID = "project_01JDAP00000000000000000001", NOW = "2026-11-26T12:00:00.000Z";
const S1 = "setup_01JDAT00000000000000000001", S2 = "setup_01JDAT00000000000000000002", S3 = "setup_01JDAT00000000000000000003", S4 = "setup_01JDAT00000000000000000004", S5 = "setup_01JDAT00000000000000000005";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const bag = (): Record<string, Obj> => Object.fromEntries(Object.entries(loadFixture()).flatMap(([k, v]) => (isObj(v) ? [[k, structuredClone(v)]] : [])));
const project = (files: Record<string, Obj>): Obj => (files["project.json"] as Obj)["project"] as Obj;
const stageOf = (files: Record<string, Obj>): Obj => files[STAGE] as Obj;
const setBudgets = (files: Record<string, Obj>, value: unknown): void => { (project(files)["settings"] as Obj)["budgets"] = value; };
const effectBehaviour = (files: Record<string, Obj>): void => { ((files["catalogue/slice.json"] as Obj)["behaviours"] as Obj[]).push({ id: "effect", presets: [{ id: "spark" }, { id: "glow" }, { id: "boom" }] }); };
const answer = (files: Record<string, Obj>, id: string, source: string, value: string): void => { ((files[`setups/${id}.json`] as Obj)["answers"] as Obj)["effect"] = { source, value }; };
const uses = (files: Record<string, Obj>): BudgetUse[] => budgetUse(readProject(files).project as Exclude<ReturnType<typeof readProject>["project"], null>);
const counts = (files: Record<string, Obj>): string => uses(files).map((row) => `${row.budget}:${row.used}${row.w === undefined ? "" : `:${String(row.w)}x${String(row.h)}`}`).join(" ");
const text = (files: Record<string, Obj>): Record<string, string> => Object.fromEntries(Object.entries(files).map(([k, v]) => [k, JSON.stringify(v)]));
const flat = (files: Record<string, Obj>): string[] => readProject(files).report.filter((row) => row.code.startsWith("budget")).map((row) => `${row.code}|${row.severity}|${row.path}|${row.detail ?? ""}`);
function kept(files: Record<string, Obj>, expect: readonly string[]): void {
  const snap = structuredClone(files);
  assert.deepEqual(flat(files), expect);
  assert.deepEqual(files, snap);
}
async function save(files: Record<string, Obj>): Promise<{ store: MakerStore; docs: Record<string, string> }> {
  const docs = text(files), store = memoryStore();
  const wrote = await commitWrites(store, prefix(PID), asWrites(docs));
  if (!wrote.ok) throw new Error("save");
  return { store, docs };
}
test("11c1 budgets: DSK E10 counts the stored start state: team min(loadout size, start tiles), enemy pool placements (weighted capped by spawns and, without repeats, entries; waves by the largest wave), every neutral; AI by the effective sides; distinct resolved effects (wave units too); map cols x rows", () => {
  const files = bag();
  assert.equal(counts(files), "units:7 activeAi:2 effects:0 stageTiles:54:6x9");
  stageOf(files)["sides"] = { loadout: "player", enemyPool: "player", neutrals: "wolves" };
  assert.equal(counts(files), "units:7 activeAi:2 effects:0 stageTiles:54:6x9");
  stageOf(files)["loadout"] = { size: 1, roster: [U.knight], required: [U.knight] };
  assert.equal(counts(files), "units:6 activeAi:2 effects:0 stageTiles:54:6x9");
  const pool = bag();
  const stage = stageOf(pool);
  stage["neutrals"] = [];
  stage["playerSpawns"] = [];
  stage["loadout"] = { size: 0, roster: [U.archer], required: [] };
  stage["enemyPool"] = { mode: "weighted", picks: 5, allowRepeats: true, entries: [{ unitId: U.wolf, weight: 1 }], spawns: [{ c: 0, r: 0 }, { c: 1, r: 0 }, { c: 2, r: 0 }] };
  assert.equal(counts(pool), "units:3 activeAi:3 effects:0 stageTiles:54:6x9");
  (stage["enemyPool"] as Obj)["allowRepeats"] = false;
  assert.equal(counts(pool), "units:1 activeAi:1 effects:0 stageTiles:54:6x9");
  stage["enemyPool"] = { mode: "waves", waves: [{ entries: [{ unitId: U.archer, count: 4 }] }, { entries: [{ unitId: U.wolf, count: 2 }, { unitId: U.archer, count: 3 }] }] };
  (pool[`units/${U.wolf}.json`] as Obj)["setupIds"] = [S1, S2, S3];
  effectBehaviour(pool);
  answer(pool, S5, "user", "spark");
  answer(pool, S4, "user", "builtin:effect/spark");
  answer(pool, S1, "user", "builtin:effect/glow");
  answer(pool, S2, "user", "nope");
  answer(pool, S3, "default", "boom");
  (pool[MAP] as Obj)["cols"] = 300;
  (pool[MAP] as Obj)["rows"] = 2;
  assert.equal(counts(pool), "units:5 activeAi:5 effects:2 stageTiles:600:300x2");
});
test("11c1 budgets: budgetNear when warn <= used <= limit, budgetOver (hard) above and replacing near, at stages/<id>.json# with detail {budget, used, limit[, w, h]}; ok stays true", () => {
  const files = bag();
  setBudgets(files, { units: { warn: 7, limit: 7 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 1, limit: 12 }, stageTiles: { warn: 54, limit: 54 } });
  assert.equal(readProject(files).ok && readProject(files).readOnly === false, true);
  assert.deepEqual(flat(files), [
    `budgetNear|warning|${AT}|${JSON.stringify({ budget: "units", used: 7, limit: 7 })}`,
    `budgetNear|warning|${AT}|${JSON.stringify({ budget: "stageTiles", used: 54, limit: 54, w: 6, h: 9 })}`,
    `budgetOver|hard|${AT}|${JSON.stringify({ budget: "activeAi", used: 2, limit: 1 })}`,
  ]);
});
test("11c1 budgets: absent means no rows; a partial object checks only its keys; a broken entry is one budgetInvalid warning and isn't checked; unknown keys are ignored; nothing is written", () => {
  const absent = bag();
  delete (project(absent)["settings"] as Obj)["budgets"];
  kept(absent, []);
  const partial = bag();
  setBudgets(partial, { units: { warn: 1, limit: 1 }, extra: { warn: 1, limit: 1 } });
  kept(partial, [`budgetOver|hard|${AT}|${JSON.stringify({ budget: "units", used: 7, limit: 1 })}`]);
  const broken = bag();
  setBudgets(broken, { units: { warn: 0, limit: 1 }, activeAi: { warn: 5, limit: 4 }, effects: { warn: 1.5, limit: 2 }, stageTiles: { warn: 1, limit: 1 }, extra: 1 });
  kept(broken, [
    `budgetInvalid|warning|project.json#/project/settings/budgets/activeAi|${JSON.stringify({ warn: 5, limit: 4 })}`,
    `budgetInvalid|warning|project.json#/project/settings/budgets/effects|${JSON.stringify({ warn: 1.5, limit: 2 })}`,
    `budgetInvalid|warning|project.json#/project/settings/budgets/units|${JSON.stringify({ warn: 0, limit: 1 })}`,
    `budgetOver|hard|${AT}|${JSON.stringify({ budget: "stageTiles", used: 54, limit: 1, w: 6, h: 9 })}`,
  ]);
  const five = bag();
  setBudgets(five, 5);
  kept(five, ["budgetInvalid|warning|project.json#/project/settings/budgets|5"]);
});
test("11c1 gate: budgetOver blocks Test and Build game with UX's line named by the stage; budgetNear never blocks", async () => {
  const over = bag();
  effectBehaviour(over);
  answer(over, S4, "user", "spark");
  answer(over, S5, "user", "glow");
  setBudgets(over, { units: { warn: 1, limit: 6 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 1, limit: 1 }, stageTiles: { warn: 1, limit: 50 } });
  const load = readProject(over);
  const want = ["Demo stage: 7 units. The limit is 6. Remove some units.", "Demo stage: 2 units take AI turns. The limit is 1. Remove some or put them on your team.", "Demo stage: 2 effects. The limit is 1. Remove some effects.", "Demo stage is 6 \u00d7 9 tiles. The limit is 50 tiles. Make the map smaller."];
  const gate = testGate(load.report, load.readOnly, stageNames(load));
  assert.deepEqual(gate.allowed ? [] : [...gate.lines], want);
  let started = false;
  const saved = await save(over);
  const launched = await launchTest({ store: saved.store, id: PID, from: "project", start: () => { started = true; }, stored: saved.docs, next: saved.docs, rev: 1, now: NOW });
  assert.deepEqual(launched.ok || started ? [] : [...launched.lines], want);
  let fetched = false;
  const built = await buildGame(saved.store, PID, () => (fetched = true, Promise.resolve("")));
  assert.deepEqual(built.ok || fetched ? [] : [...built.lines], want);
  const near = bag();
  setBudgets(near, { units: { warn: 7, limit: 9 }, activeAi: { warn: 12, limit: 24 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } });
  const kept = await save(near);
  let began = false;
  const played = await launchTest({ store: kept.store, id: PID, from: "project", start: () => { began = true; }, stored: kept.docs, next: kept.docs, rev: 1, now: NOW });
  assert.equal(began && played.ok, true);
});
test("11c1 maker: the Budgets row after the stages in UX's words: one summary line, and on tap the four rows with used of limit, a near or over suffix and an aria-hidden meter", () => {
  const files = bag();
  const view = (): string => budgetsRow(text(files));
  assert.equal(view().includes("Budgets: all good") && view().includes("btn ghost stage-row") && !view().includes('data-budget="'), true);
  budgetsTap(() => undefined);
  const open = view();
  assert.equal(open.includes('aria-expanded="true"') && ["Units</span> <span>7 of 80</span>", "Active AI</span> <span>2 of 24</span>", "Effects</span> <span>0 of 12</span>", "Stage size</span> <span>54 of 65536</span>"].every((bit) => open.includes(bit)) && !open.includes("\u00b7") && open.split('aria-hidden="true"').length === 5, true);
  assert.ok(open.indexOf('data-budget="units"') < open.indexOf('data-budget="activeAi"') && open.indexOf('data-budget="activeAi"') < open.indexOf('data-budget="effects"') && open.indexOf('data-budget="effects"') < open.indexOf('data-budget="stageTiles"'));
  setBudgets(files, { units: { warn: 7, limit: 9 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } });
  assert.equal(view().includes("Budgets: 1 over the limit") && view().includes("7 of 9 \u00b7 near limit") && view().includes("2 of 1 \u00b7 over limit") && view().includes("0 of 12</span>") && view().split('aria-hidden="true"').length === 5, true);
  setBudgets(files, { units: { warn: 7, limit: 9 }, activeAi: { warn: 12, limit: 24 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } });
  assert.equal(view().includes("Budgets: 1 near the limit"), true);
  const clear = bag();
  delete (project(clear)["settings"] as Obj)["budgets"];
  assert.equal(budgetsRow(text(clear)), "");
});
