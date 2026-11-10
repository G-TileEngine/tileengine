import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRng, streamSeed } from "../../src/core/rng/index.ts";
import { readStage, resolvePlacements } from "../../src/project/read/index.ts";
import type { CoreStage } from "../../src/types/core-types.ts";

const load = (name: string): CoreStage => {
  const read = readStage(JSON.parse(readFileSync(new URL(`../fixtures/project/${name}.json`, import.meta.url), "utf8")));
  if (!read.ok) throw new Error(read.needsMigration ? "migrate" : read.error);
  return read.doc;
};

test("loadout fills playerSpawns in order; sides and facing; extras are not placed", () => {
  let called = false;
  const out = resolvePlacements(load("stage-fixed"), { cols: 6, rows: 9 }, ["knight", "archer", "cleric"], () => { called = true; return 0; });
  assert.equal(called, false);
  assert.deepEqual(out.placements.map((p) => [p.unitId, p.side, p.at.c, p.at.r, p.facing]), [
    ["knight", "player", 0, 8, "N"], ["archer", "player", 1, 8, null],
    ["wolf", "wolves", 2, 0, "S"], ["wolf", "wolves", 3, 0, null],
    ["crate", "neutral", 3, 4, null], ["merchant", "player", 4, 4, "W"],
  ]);
  assert.deepEqual(out.notices.map((n) => n.code), ["notPlaced"]);
});
test("weighted picks go through the picker, without repeats", () => {
  const seen: number[][] = [];
  const script = [0, 1, -1];
  const out = resolvePlacements(load("stage-weighted"), { cols: 12, rows: 12 }, [], (w) => { seen.push([...w]); return script[seen.length - 1] ?? -1; });
  assert.deepEqual(seen, [[3, 1, 0], [0, 1, 0], [0, 0, 0]]);
  assert.deepEqual(out.placements.map((p) => [p.unitId, p.side, p.at.c, p.facing]), [["wolf", "rival", 0, null], ["bat", "rival", 1, null]]);
  assert.deepEqual(out.notices.map((n) => n.code), ["poolExhausted"]);
});
test("the same seed gives the same placements", () => {
  const stage = load("stage-weighted");
  const run = () => { const rng = createRng(streamSeed(0x5eed, "pool")); return resolvePlacements(stage, { cols: 12, rows: 12 }, [], (w) => rng.weighted(w)); };
  assert.deepEqual(run(), run());
});
test("waves place turn 0 only; an off-map spawn is a notice, not an error", () => {
  const stage: CoreStage = {
    kind: "stage", formatVersion: 2, id: "w", rev: 1, mapRef: "m", playerSpawns: [], neutrals: [], loadout: null, rules: [],
    enemyPool: { mode: "waves", spawns: [{ c: 0, r: 0 }, { c: 12, r: 0 }, { c: 2, r: 0 }], waves: [{ turn: 0, entries: [{ unitId: "bat", count: 3 }] }, { turn: 3, entries: [{ unitId: "ogre", count: 1 }] }] },
  };
  const out = resolvePlacements(stage, { cols: 12, rows: 12 }, [], () => 0);
  assert.deepEqual(out.placements.map((p) => [p.unitId, p.at.c, p.side, p.facing]), [["bat", 0, "rival", null], ["bat", 2, "rival", null]]);
  assert.deepEqual(out.notices.map((n) => [n.code, n.at]), [["spawnOffMap", { c: 12, r: 0 }]]);
});
