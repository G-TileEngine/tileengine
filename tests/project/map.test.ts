import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createGrid } from "../../src/core/grid/index.ts";
import { readMap } from "../../src/project/read/index.ts";

const load = (name: string): Record<string, unknown> => JSON.parse(readFileSync(new URL(`../fixtures/project/${name}.json`, import.meta.url), "utf8")) as Record<string, unknown>;
const tiles = [{ id: "floor", open: true, push_can_enter: true }, { id: "wall-block", open: false, push_can_enter: false }];
const err = (json: unknown): string => { const read = readMap(json); return read.ok || read.needsMigration ? "" : read.error; };

test("the 6x9 and 12x12 fixtures load and build a grid (M8); unknown keys are dropped", () => {
  const raw = load("map-6x9");
  const small = readMap(raw); const big = readMap(load("map-12x12"));
  if (!small.ok || !big.ok) throw new Error("map");
  assert.equal(small.doc.logic.terrain.length === 54 && big.doc.logic.terrain.length === 144 && !("layers" in small.doc) && "layers" in raw && createGrid(small.doc, tiles).isOpen({ c: 0, r: 0 }), true);
  const grid = createGrid(big.doc, tiles);
  assert.equal(grid.isOpen({ c: 5, r: 5 }) === false && grid.isOpen({ c: 3, r: 3 }) === false, true);
  assert.deepEqual(grid.notices.map((n) => n.code), ["footprintIgnored"]);
  const logic = raw.logic as { terrain: unknown };
  const dropped = readMap({ ...raw, paths: [], logic: { ...logic, lanes: [0] } });
  assert.equal(dropped.ok && !("paths" in dropped.doc) && !("lanes" in dropped.doc.logic), true);
});
test("a missing or malformed required field is a hard error naming the top-level key", () => {
  const raw = load("map-6x9");
  const logic = raw.logic as { terrain: number[]; palette: unknown; edges: unknown };
  const noCols = { ...raw }; delete noCols.cols;
  assert.deepEqual([
    err(noCols),
    err({ ...raw, logic: { ...logic, terrain: logic.terrain.slice(0, 3) } }),
    err({ ...raw, objects: [{ id: "a", at: { c: 1.5, r: 0 } }] }),
  ], ["bad field cols", "bad field logic", "bad field objects"]);
});
