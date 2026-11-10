import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createGrid } from "../../src/core/grid/index.ts";
import type { CoreMap, CoreTileType, Sq } from "../../src/types/core-types.ts";

const TILES: readonly CoreTileType[] = [
  { id: "floor", open: true, push_can_enter: true },
  { id: "wall-block", open: false, push_can_enter: false },
  { id: "water", open: false, push_can_enter: false },
];

function load(name: string): CoreMap {
  return JSON.parse(readFileSync(`tests/fixtures/maps/${name}.json`, "utf8")) as CoreMap;
}

function blank(cols: number, rows: number, terrain?: number[], edges: CoreMap["logic"]["edges"] = []): CoreMap {
  const n = cols * rows;
  return {
    kind: "map", formatVersion: 5, id: "t", rev: 1, cols, rows,
    logic: { terrain: terrain ?? Array.from({ length: n }, () => 0), palette: { "0": "floor", "1": "wall-block", "2": "water" }, edges },
  };
}

test("any size builds (M8)", () => {
  for (const map of [blank(1, 1), load("grid-6x9"), blank(12, 12)]) {
    const grid = createGrid(map, TILES);
    assert.equal(grid.cols, map.cols);
    assert.equal(grid.rows, map.rows);
  }
});

test("index and sqAt round-trip row-major", () => {
  const grid = createGrid(load("grid-6x9"), TILES);
  for (let r = 0; r < grid.rows; r += 1) {
    for (let c = 0; c < grid.cols; c += 1) {
      const at = { c, r };
      assert.deepEqual(grid.sqAt(grid.index(at)), at);
    }
  }
  assert.equal(grid.index({ c: 2, r: 4 }), 26);
});

test("bad dimensions throw", () => {
  assert.throws(() => createGrid(blank(0, 1), TILES), RangeError);
  assert.throws(() => createGrid(blank(2, 1.5), TILES), RangeError);
});

test("unknown palette key or id runs as floor with a notice", () => {
  const base = blank(2, 1, [7, 3]);
  const grid = createGrid({
    ...base,
    logic: { ...base.logic, palette: { ...base.logic.palette, "3": "no-such" } },
  }, TILES);
  for (const at of [{ c: 0, r: 0 }, { c: 1, r: 0 }] satisfies Sq[]) {
    assert.equal(grid.isOpen(at), true);
    assert.equal(grid.tileTypeAt(at).id, "floor");
  }
  const hits = grid.notices.filter((n) => n.code === "unknownTerrain");
  assert.deepEqual(hits.map((n) => n.at), [{ c: 0, r: 0 }, { c: 1, r: 0 }]);
});

test("terrain length mismatch and missing floor warn", () => {
  const map = blank(2, 2, [1]);
  const grid = createGrid(map, [{ id: "wall-block", open: false, push_can_enter: false }]);
  assert.deepEqual(grid.notices.map((n) => n.code), ["floorMissing", "terrainLength"]);
  assert.equal(grid.tileTypeAt({ c: 0, r: 0 }).id, "wall-block");
  assert.equal(grid.tileTypeAt({ c: 1, r: 0 }).id, "floor");
  assert.equal(grid.isOpen({ c: 1, r: 1 }), true);
  assert.equal(grid.tileTypeAt({ c: 9, r: 9 }).id, "floor");
});

test("closed tiles and blocking objects are not open", () => {
  const map = load("grid-4x3");
  const grid = createGrid({
    ...map,
    objects: [
      { id: "rock", at: { c: 3, r: 0 }, blocks: true },
      { id: "sign", at: { c: 3, r: 1 } },
      { id: "lost", at: { c: 8, r: 0 }, blocks: true },
    ],
  }, TILES);
  assert.equal(grid.isOpen({ c: 1, r: 1 }), false);
  assert.equal(grid.isOpen({ c: 2, r: 2 }), false);
  assert.equal(grid.isOpen({ c: 3, r: 0 }), false);
  assert.equal(grid.isOpen({ c: 3, r: 1 }), true);
  assert.equal(grid.isOpen({ c: -1, r: 0 }), false);
  assert.equal(grid.hasWall({ c: -1, r: 0 }, "n"), false);
  assert.equal(grid.step({ c: 0, r: 0 }, "w"), null);
  assert.deepEqual(grid.notices.map((n) => n.code), ["objectOffMap"]);
});

test("wrapEdges is ignored with a notice", () => {
  const grid = createGrid(blank(2, 2), TILES, { wrapEdges: true });
  assert.deepEqual(grid.notices.map((n) => n.code), ["wrapEdgesIgnored"]);
  assert.equal(grid.step({ c: 0, r: 0 }, "w"), null);
});

test("non-1x1 footprint plays 1x1", () => {
  const map = blank(2, 1);
  const grid = createGrid({
    ...map,
    objects: [{ id: "wide", at: { c: 0, r: 0 }, blocks: true, footprint: { w: 2, h: 1 } }],
  }, TILES);
  assert.deepEqual(grid.notices.map((n) => n.code), ["footprintIgnored"]);
  assert.equal(grid.isOpen({ c: 0, r: 0 }), false);
  assert.equal(grid.isOpen({ c: 1, r: 0 }), true);
});

test("reachable respects walls, closed cells, maxSteps and isBlocked", () => {
  const grid = createGrid(load("grid-4x3"), TILES);
  const cells = (max: number, block?: (at: Sq) => boolean): string[] =>
    [...grid.reachable({ c: 0, r: 0 }, max, block)].map(([i, steps]) => {
      const at = grid.sqAt(i);
      return `${at.c},${at.r}:${steps}`;
    }).sort();
  assert.deepEqual(cells(9), ["0,0:0", "0,1:1", "0,2:2", "1,2:3"]);
  assert.deepEqual(cells(9, (at) => at.c === 0 && at.r === 1), ["0,0:0"]);
  assert.deepEqual(grid.neighbours({ c: 0, r: 2 }).map((at) => `${at.c},${at.r}`), ["0,1", "1,2"]);
  assert.equal(grid.reachable({ c: 20, r: 0 }, 9).size, 0);
});
