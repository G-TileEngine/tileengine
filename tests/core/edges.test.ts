import assert from "node:assert/strict";
import { test } from "node:test";
import { createGrid } from "../../src/core/grid/index.ts";
import type { CoreEdge, CoreMap, CoreTileType } from "../../src/types/core-types.ts";

const TILES: readonly CoreTileType[] = [
  { id: "floor", open: true, push_can_enter: true },
  { id: "wall-block", open: false, push_can_enter: false },
  { id: "water", open: false, push_can_enter: false },
  { id: "pit", open: true, push_can_enter: false },
];

function map(cols: number, rows: number, terrain: number[], edges: CoreEdge[]): CoreMap {
  return {
    kind: "map", formatVersion: 5, id: "e", rev: 1, cols, rows,
    logic: {
      terrain,
      palette: { "0": "floor", "1": "wall-block", "2": "water", "3": "pit" },
      edges,
    },
  };
}

test("a wall blocks both ways", () => {
  const grid = createGrid(map(4, 5, Array.from({ length: 20 }, () => 0), [{ c: 2, r: 4, side: "n" }]), TILES);
  assert.equal(grid.hasWall({ c: 2, r: 3 }, "s"), true);
  assert.equal(grid.hasWall({ c: 2, r: 4 }, "n"), true);
  assert.equal(grid.canStep({ c: 2, r: 3 }, "s"), false);
  assert.equal(grid.canStep({ c: 2, r: 4 }, "n"), false);
});

test("every stored form is the same wall, counted once", () => {
  const grid = createGrid(map(4, 5, Array.from({ length: 20 }, () => 0), [
    { c: 2, r: 3, side: "s" },
    { c: 2, r: 4, side: "n" },
  ]), TILES);
  assert.equal(grid.hasWall({ c: 2, r: 3 }, "s"), true);
  assert.equal(grid.hasWall({ c: 2, r: 4 }, "n"), true);
  assert.equal(grid.canStep({ c: 2, r: 4 }, "n"), false);
  assert.equal(grid.canStep({ c: 2, r: 3 }, "s"), false);
  assert.deepEqual(grid.notices, []);
});

test("off-map edge is skipped with a notice", () => {
  const grid = createGrid(map(4, 1, [0, 0, 0, 0], [{ c: 9, r: 0, side: "n" }]), TILES);
  assert.deepEqual(grid.notices.map((n) => n.code), ["edgeOffMap"]);
  assert.deepEqual(grid.notices[0]?.at, { c: 9, r: 0 });
});

test("edge walls always stop forced movement", () => {
  const grid = createGrid(map(4, 5, Array.from({ length: 20 }, () => 0), [{ c: 2, r: 4, side: "n" }]), TILES);
  assert.deepEqual(grid.canForceInto({ c: 2, r: 4 }, "n"), { ok: false, blocker: "edge" });
  assert.deepEqual(grid.canForceInto({ c: 2, r: 3 }, "s"), { ok: false, blocker: "edge" });
  assert.deepEqual(grid.canForceInto({ c: 0, r: 0 }, "n"), { ok: false, blocker: "edge" });
});

test("closed or non-enterable tiles stop forced movement as wall-block", () => {
  const grid = createGrid({
    ...map(4, 2, [0, 1, 2, 0, 0, 3, 0, 0], []),
    objects: [{ id: "rock", at: { c: 0, r: 1 }, blocks: true }],
  }, TILES);
  assert.deepEqual(grid.canForceInto({ c: 0, r: 0 }, "e"), { ok: false, blocker: "wall-block" });
  assert.deepEqual(grid.canForceInto({ c: 1, r: 0 }, "e"), { ok: false, blocker: "wall-block" });
  assert.deepEqual(grid.canForceInto({ c: 1, r: 1 }, "w"), { ok: false, blocker: "wall-block" });
  assert.deepEqual(grid.canForceInto({ c: 2, r: 1 }, "w"), { ok: false, blocker: "wall-block" });
  assert.deepEqual(grid.canForceInto({ c: 2, r: 1 }, "e"), { ok: true });
});
