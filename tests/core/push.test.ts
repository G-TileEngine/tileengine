import { test } from "node:test";
import assert from "node:assert/strict";
import type { CoreMap } from "../../src/types/core-types.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { createUnits } from "../../src/core/unit/index.ts";

const DOC: CoreMap = {
  kind: "map", formatVersion: 5, id: "push", rev: 1, cols: 5, rows: 1,
  logic: { terrain: [0, 0, 0, 0, 1], palette: { "0": "floor", "1": "wall-block" }, edges: [{ c: 0, r: 0, side: "e" }] },
};

function open(slam: boolean | "absent" = true) {
  const log: string[] = [];
  const terrain = slam === "absent" ? undefined : { push_into_walls: slam };
  const units = createUnits(createGrid(DOC, [
    { id: "floor", open: true, push_can_enter: true }, { id: "wall-block", open: false, push_can_enter: false },
  ]), {
    ...(terrain === undefined ? {} : { terrain }),
    hooks: {
      landed: (id, cell, cause) => log.push(`L ${id} ${cell.c} ${cause}`),
      pushBlocked: (id, blocker, left) => log.push(`B ${id} ${blocker} ${left}`),
    },
  });
  const place = (unitId: string, c: number) => units.place({ unitId, side: "player", at: { c, r: 0 }, facing: null });
  return { units, log, place };
}

test("push stops before a wall-block", () => {
  const { units, place } = open();
  assert.equal(place("a", 1).ok, true);
  assert.deepEqual(units.push("a#1", "e", 5), { moved: 2, at: { c: 3, r: 0 }, blocker: "wall-block", cellsRemaining: 3 });
});

test("edge walls always stop forced movement", () => {
  const { units, place } = open();
  assert.equal(place("a", 1).ok, true); units.push("a#1", "e", 5);
  assert.deepEqual(units.push("a#1", "w", 9), { moved: 2, at: { c: 1, r: 0 }, blocker: "edge", cellsRemaining: 7 });
  assert.equal(place("b", 0).ok, true);
  assert.deepEqual(units.push("b#2", "w", 2), { moved: 0, at: { c: 0, r: 0 }, blocker: "edge", cellsRemaining: 2 });
});

test("a body stops a push", () => {
  const { units, place } = open();
  assert.equal(place("a", 1).ok, true); assert.equal(place("b", 3).ok, true);
  assert.deepEqual(units.push("a#1", "e", 3), { moved: 1, at: { c: 2, r: 0 }, blocker: "unit", cellsRemaining: 2 });
  assert.equal(units.occupantAt({ c: 1, r: 0 }), undefined); assert.equal(units.occupantAt({ c: 3, r: 0 }), "b#2");
});

test("hook order and causes", () => {
  const { units, log, place } = open();
  assert.equal(place("a", 1).ok, true);
  units.push("a#1", "e", 5); units.push("a#1", "w", 9);
  assert.deepEqual(log, ["L a#1 1 place", "B a#1 wall-block 3", "L a#1 3 forced", "B a#1 edge 7", "L a#1 1 forced"]);
  units.push("a#1", "w", 1); assert.deepEqual(log.slice(5), ["B a#1 edge 1"]);
});

test("push_into_walls off: same stop, no pushBlocked", () => {
  for (const slam of [false, "absent"] as const) {
    const { units, log, place } = open(slam);
    assert.equal(place("a", 1).ok, true);
    assert.deepEqual(units.push("a#1", "e", 5), { moved: 2, at: { c: 3, r: 0 }, blocker: "wall-block", cellsRemaining: 3 });
    assert.deepEqual(units.push("a#1", "w", 9), { moved: 2, at: { c: 1, r: 0 }, blocker: "edge", cellsRemaining: 7 });
    assert.deepEqual(log, ["L a#1 1 place", "L a#1 3 forced", "L a#1 1 forced"]);
  }
});

test("bad push input is a no-op", () => {
  const { units, log, place } = open();
  assert.equal(place("a", 1).ok, true);
  for (const cells of [0, -1, 1.5]) {
    assert.deepEqual(units.push("a#1", "e", cells), { moved: 0, at: { c: 1, r: 0 }, blocker: null, cellsRemaining: 0 });
  }
  assert.deepEqual(units.push("missing", "e", 3), { moved: 0, at: { c: -1, r: -1 }, blocker: null, cellsRemaining: 0 });
  assert.equal(units.remove("a#1"), true);
  assert.deepEqual(units.push("a#1", "e", 3), { moved: 0, at: { c: 1, r: 0 }, blocker: null, cellsRemaining: 0 });
  assert.deepEqual(log, ["L a#1 1 place"]);
});
