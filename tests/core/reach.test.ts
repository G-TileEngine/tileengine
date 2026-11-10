import { test } from "node:test";
import assert from "node:assert/strict";
import type { CoreMap, Sq } from "../../src/types/core-types.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { createUnits, reach } from "../../src/core/unit/index.ts";

function grid(cols: number, rows: number, terrain: readonly number[], edges: CoreMap["logic"]["edges"] = []) {
  const doc: CoreMap = {
    kind: "map", formatVersion: 5, id: "r", rev: 1, cols, rows,
    logic: { terrain, palette: { "0": "floor", "1": "wall-block", "2": "water" }, edges },
  };
  return createGrid(doc, [
    { id: "floor", open: true, push_can_enter: true }, { id: "wall-block", open: false, push_can_enter: false },
    { id: "water", open: false, push_can_enter: false },
  ]);
}
const has = (cells: readonly Sq[], c: number, r: number) => cells.some((sq) => sq.c === c && sq.r === r);

test("reach respects walls, closed cells and maxSteps", () => {
  const g = grid(4, 3, [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0], [{ c: 0, r: 0, side: "e" }]);
  const u = createUnits(g);
  assert.equal(u.place({ unitId: "a", side: "player", at: { c: 0, r: 0 }, facing: null }).ok, true);
  assert.deepEqual(reach(g, u, "a#1", 9), [{ c: 0, r: 0 }, { c: 0, r: 1 }, { c: 0, r: 2 }, { c: 1, r: 2 }]);
  assert.deepEqual(reach(g, u, "a#1", 2), [{ c: 0, r: 0 }, { c: 0, r: 1 }, { c: 0, r: 2 }]);
  assert.deepEqual(reach(g, u, "missing", 9), []); assert.equal(u.remove("a#1"), true); assert.deepEqual(reach(g, u, "a#1", 9), []);
});

test("allies pass, enemies block, nobody ends on a body", () => {
  const g = grid(5, 5, Array.from({ length: 25 }, () => 0));
  const u = createUnits(g);
  const put = (unitId: string, c: number, r: number, side: "player" | "rival") =>
    u.place({ unitId, side, at: { c, r }, facing: null });
  assert.equal(put("mover", 2, 2, "player").ok && put("ally", 2, 1, "player").ok && put("rival", 2, 3, "rival").ok, true);
  const allies = reach(g, u, "mover#1", 2);
  const none = reach(g, u, "mover#1", 2, "none");
  const all = reach(g, u, "mover#1", 2, "all");
  for (const cells of [allies, none, all]) assert.equal(has(cells, 2, 2) && !has(cells, 2, 1) && !has(cells, 2, 3), true);
  assert.equal(has(allies, 2, 0) && !has(allies, 2, 4), true);
  assert.equal(!has(none, 2, 0) && !has(none, 2, 4) && has(all, 2, 0) && has(all, 2, 4), true);
});
