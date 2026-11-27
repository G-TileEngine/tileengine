import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mock, test } from "node:test";
import { prefix } from "../../src/editor/project/home.ts";
import { asWrites } from "../../src/editor/project/save.ts";
import { poolLine, poolLines, stageNames, testGate } from "../../src/editor/project/test-gate.ts";
import { budgetUse, PLAY_LIMITS, readProject } from "../../src/project/load/index.ts";
import { createWorld } from "../../src/sim/index.ts";
import type { BudgetKey, CoreProject, ProjectBudgets } from "../../src/types/core-types.ts";
import { buildGame } from "../../tools/maker/export.ts";
import { commitWrites, memoryStore, type MakerStore } from "../../tools/maker/store.ts";
import { launchTest } from "../../tools/maker/test-launch.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { arriveIn, openProject } from "../../tools/play-stage/project.ts";
import { loadFixture, U } from "../tools/demo-fixture.ts";
const SID = "stage_01JDAS00000000000000000001";
const STAGE = `stages/${SID}.json`;
const PID = "project_01JDAP00000000000000000001";
const NOW = "2026-11-27T12:00:00.000Z";
const SPAWNS = [{ c: 2, r: 0 }, { c: 3, r: 0 }];
type Obj = Record<string, unknown>;
const bag = (): Record<string, Obj> => Object.fromEntries(Object.entries(loadFixture()).flatMap(([k, v]) => (typeof v === "object" && v !== null && !Array.isArray(v) ? [[k, structuredClone(v) as Obj]] : [])));
const text = (files: Record<string, Obj>): Record<string, string> => Object.fromEntries(Object.entries(files).map(([k, v]) => [k, JSON.stringify(v)]));
function withPool(pool: unknown): Record<string, Obj> {
  const files = bag();
  (files[STAGE] as Obj)["enemyPool"] = pool;
  return files;
}
const weighted = (picks: number): Obj => ({ mode: "weighted", picks, allowRepeats: true, spawns: SPAWNS, entries: [{ unitId: U.wolf, weight: 1 }] });
const waves = (count: number): Obj => ({ mode: "waves", spawns: SPAWNS, waves: [{ turn: 2, entries: [{ unitId: U.wolf, count }] }] });
const fixed = (): Obj => ({ mode: "fixed", entries: [{ unitId: U.wolf, at: { c: 2, r: 0 } }] });
async function save(files: Record<string, Obj>): Promise<{ store: MakerStore; docs: Record<string, string> }> {
  const docs = text(files);
  const store = memoryStore();
  const wrote = await commitWrites(store, prefix(PID), asWrites(docs));
  if (!wrote.ok) {
    throw new Error("save");
  }
  return { store, docs };
}
test("f0c CN-029: core-types is DSK's staged copy byte for byte, settings.budgets is a ProjectBudgets, and the reader's budget rows still use it", () => {
  const staged = readFileSync("data/staging/cn-budgets/core-types.staged.ts");
  assert.deepEqual(readFileSync("src/types/core-types.ts"), staged);
  const limits: ProjectBudgets = { units: { warn: 7, limit: 9 } };
  const settings: CoreProject["settings"]["budgets"] = limits;
  const keys: BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
  assert.deepEqual(Object.keys(settings ?? {}), keys.slice(0, 1));
  const files = bag();
  ((files["project.json"] as Obj)["project"] as Obj)["settings"] = { wrapEdges: false, budgets: limits };
  const load = readProject(files);
  assert.deepEqual(budgetUse(load.project as Exclude<typeof load.project, null>).map((row) => `${row.budget}:${row.used}`), ["units:7"]);
  assert.deepEqual(load.report.filter((row) => row.code.startsWith("budget")).map((row) => `${row.code}|${row.severity}`), ["budgetNear|warning"]);
});
test("f0c gate: a weighted or waves pool that play refuses blocks Test and Build game with one line naming the stage; the reader still passes it", async () => {
  for (const pool of [weighted(2), waves(3)]) {
    const files = withPool(pool);
    const load = readProject(files);
    assert.equal(load.ok, true);
    const want = ["Demo stage: enemies picked at random or sent in waves can't be played yet. Use a fixed enemy list."];
    assert.deepEqual(poolLines(load), want);
    const gate = testGate(load.report, load.readOnly, stageNames(load), poolLines(load));
    assert.deepEqual(gate.allowed ? [] : [...gate.lines], want);
    const start = mock.fn();
    const saved = await save(files);
    const launched = await launchTest({ store: saved.store, id: PID, from: "project", start, stored: saved.docs, next: saved.docs, rev: 1, now: NOW });
    assert.equal(start.mock.callCount(), 0);
    assert.deepEqual(launched.ok ? [] : [...launched.lines], want);
    const get = mock.fn(() => Promise.resolve(""));
    const built = await buildGame(saved.store, PID, get);
    assert.equal(get.mock.callCount(), 0);
    assert.deepEqual(built.ok ? [] : [...built.lines], want);
  }
});
test("f0c gate: the pools proof: for every pool shape the gate's pool lines are empty exactly when play opens the stage", () => {
  const shapes: readonly [string, Obj, boolean][] = [["fixed", fixed(), true], ["weighted picks 0", weighted(0), true], ["weighted picks 1", weighted(1), false], ["weighted picks 8", weighted(8), false], ["waves 0 units", waves(0), true], ["waves 1 unit", waves(1), false], ["waves 16 units", waves(16), false]];
  for (const [name, pool, plays] of shapes) {
    const files = withPool(pool);
    const load = readProject(files);
    assert.equal(load.ok, true, name);
    const opened = openProject(files);
    assert.equal(opened.docs !== null, plays, name);
    assert.equal(poolLines(load).length === 0, plays, name);
    assert.equal(opened.docs === null ? opened.error : "", plays ? "" : "play: stage", name);
  }
});
test("f0c gate: pool lines come after the hard rows' lines, one per refused stage, named by the stage (the id when it has no name); a stage the reader already rejects adds none", () => {
  const files = withPool(weighted(2));
  const second = structuredClone(files[STAGE] as Obj);
  second["id"] = "stage_01JDAS00000000000000000002";
  delete second["name"];
  files["stages/stage_01JDAS00000000000000000002.json"] = second;
  const broken = structuredClone(second);
  broken["id"] = "stage_01JDAS00000000000000000003";
  broken["enemyPool"] = weighted(9);
  files["stages/stage_01JDAS00000000000000000003.json"] = broken;
  const load = readProject(files);
  assert.deepEqual(poolLines(load), [poolLine("Demo stage"), poolLine("stage_01JDAS00000000000000000002")]);
  const gate = testGate(load.report, load.readOnly, stageNames(load), poolLines(load));
  const lines = gate.allowed ? [] : [...gate.lines];
  assert.deepEqual(lines.slice(-2), poolLines(load));
  assert.equal(lines.length > 2, true);
  assert.deepEqual(poolLines({ project: null }), []);
});
test("f0c play: the engine reads stages with PLAY_LIMITS too: docsToInput hands them to the sim, which refuses a weighted or waves stage, and arriving into one fails the same way openProject does", () => {
  const files = bag();
  const opened = openProject(files);
  if (opened.docs === null) {
    throw new Error(opened.error);
  }
  const docs = opened.docs;
  assert.deepEqual(docsToInput(docs).input.stageLimits, PLAY_LIMITS);
  const party = { side: "player", members: docs.chosen.map((unitId) => ({ unitId, hp: 10 })), bar: null };
  for (const pool of [weighted(2), waves(3)]) {
    const stage = { ...(files[STAGE] as Obj), enemyPool: pool };
    assert.throws(() => createWorld(docsToInput({ ...docs, stage }).input), { message: /^stage: / });
    const into = withPool(pool);
    const arrived = arriveIn(into, null, SID, party);
    assert.deepEqual([arrived.docs, arrived.error], [null, openProject(into).error]);
    assert.equal(arrived.error, "play: stage");
  }
});
