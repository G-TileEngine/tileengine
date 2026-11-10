import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readStage, stageSeed } from "../../src/project/read/index.ts";

const load = (name: string): Record<string, unknown> => JSON.parse(readFileSync(new URL(`../fixtures/project/${name}.json`, import.meta.url), "utf8")) as Record<string, unknown>;
const err = (json: unknown): string => { const read = readStage(json); return read.ok || read.needsMigration ? "" : read.error; };

test("stage fixtures load; seed is returned as-is", () => {
  const fixed = readStage(load("stage-fixed"));
  const weighted = readStage(load("stage-weighted"));
  const none = readStage({ ...load("stage-weighted"), seed: null });
  assert.equal(fixed.ok && stageSeed(fixed.doc) === 0x5eed && weighted.ok && weighted.doc.loadout === null && stageSeed(weighted.doc) === null && none.ok && none.doc.seed === null && stageSeed(none.doc) === null, true);
});
test("a stage hard error names the top-level key", () => {
  const base = load("stage-fixed");
  const noMap = { ...base }; delete noMap.mapRef;
  const cases: [unknown, string][] = [
    [noMap, "mapRef"],
    [{ ...base, seed: 1.5 }, "seed"],
    [{ ...base, playerSpawns: [{ c: 0, r: 0, facing: "up" }] }, "playerSpawns"],
    [{ ...base, enemyPool: { mode: "random" } }, "enemyPool"],
    [{ ...base, sides: { loadout: 3 } }, "sides"],
    [{ ...base, loadout: {} }, "loadout"],
  ];
  for (const [json, key] of cases) assert.equal(err(json), `bad field ${key}`);
});
