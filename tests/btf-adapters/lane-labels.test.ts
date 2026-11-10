import assert from "node:assert/strict";
import { test } from "node:test";
import { laneIdToSq, sqToLaneId } from "../../src/btf-adapters/src/index.ts";

test("lane ids 1–18 map to {c, r} and back, column-major (TILE.md): id 2 = (0,1), id 11 = (3,1)", () => {
  assert.deepEqual(laneIdToSq(1), { c: 0, r: 0 });
  assert.deepEqual(laneIdToSq(2), { c: 0, r: 1 });
  assert.deepEqual(laneIdToSq(11), { c: 3, r: 1 });
  assert.deepEqual(laneIdToSq(18), { c: 5, r: 2 });
  for (let id = 1; id <= 18; id += 1) {
    const sq = laneIdToSq(id);
    assert.equal(sq !== null && sqToLaneId(sq) === id, true);
  }
  for (const id of [0, 19, 2.5, Number.NaN]) assert.equal(laneIdToSq(id), null);
  for (const at of [{ c: -1, r: 0 }, { c: 6, r: 0 }, { c: 0, r: 3 }, { c: 0.5, r: 0 }]) assert.equal(sqToLaneId(at), null);
});
