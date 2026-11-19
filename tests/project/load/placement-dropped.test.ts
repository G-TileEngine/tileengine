import assert from "node:assert/strict";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";
import { createWorld } from "../../../src/sim/world.ts";
import { docsToInput } from "../../../tools/play-stage/load.ts";
import { openProject } from "../../../tools/play-stage/project.ts";
import { loadFixture } from "../../tools/demo-fixture.ts";
const MAP = "maps/map_01JDAM00000000000000000001.json", STAGE = "stages/stage_01JDAS00000000000000000001.json";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
test("placementDropped: warns, skips in memory, writes nothing back", () => {
  const files = loadFixture(), map = files[MAP], stage = files[STAGE];
  if (!isObj(map) || !isObj(map["logic"]) || !Array.isArray(map["logic"]["terrain"]) || !isObj(stage) || !Array.isArray(stage["playerSpawns"]) || !isObj(stage["enemyPool"]) || !Array.isArray(stage["enemyPool"]["entries"])) throw new Error("demo shape");
  const terrain = [...map["logic"]["terrain"]]; terrain[2] = 1; map["logic"]["terrain"] = terrain;
  const spawn = stage["playerSpawns"][1]; if (!isObj(spawn)) throw new Error("spawn"); spawn["c"] = 99;
  const before = structuredClone(files), got = readProject(files);
  assert.equal(got.ok, true); assert.equal(got.report.some((row) => row.severity === "hard"), false);
  assert.deepEqual(got.report.map((row) => [row.code, row.severity, row.path, row.detail]), [
    ["placementDropped", "warning", `${STAGE}#/enemyPool/entries/0`, "closedCell"],
    ["placementDropped", "warning", `${STAGE}#/playerSpawns/1`, "outsideMap"],
  ]);
  const opened = openProject(files); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const world = createWorld(docsToInput(opened.docs).input), at = world.units.all().map((unit) => `${unit.at.c},${unit.at.r}`).sort();
  assert.deepEqual(at, ["0,8", "3,0", "3,4", "4,4", "5,4"]);
  assert.equal(world.notices.some((note) => note.code === "placeClosed"), true); assert.equal(world.notices.some((note) => note.code === "spawnOffMap"), true);
  assert.deepEqual(files, before); assert.equal(spawn["c"], 99);
  const entry = stage["enemyPool"]["entries"][0]; assert.equal(isObj(entry) && isObj(entry["at"]) && entry["at"]["c"], 2);
});
