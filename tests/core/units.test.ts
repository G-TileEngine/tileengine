import { test } from "node:test";
import assert from "node:assert/strict";
import type { CoreEdge, CoreMap, CoreMapObject, Facing, ResolvedPlacement, SideId } from "../../src/types/core-types.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { createUnits } from "../../src/core/unit/index.ts";

function grid(cols: number, rows: number, terrain?: readonly number[], edges: readonly CoreEdge[] = [], objects?: readonly CoreMapObject[]) {
  const doc: CoreMap = {
    kind: "map", formatVersion: 5, id: "t", rev: 1, cols, rows,
    logic: { terrain: terrain ?? Array.from({ length: cols * rows }, () => 0), palette: { "0": "floor", "1": "wall-block", "2": "water" }, edges },
    ...(objects === undefined ? {} : { objects }),
  };
  return createGrid(doc, [
    { id: "floor", open: true, push_can_enter: true }, { id: "wall-block", open: false, push_can_enter: false },
    { id: "water", open: false, push_can_enter: false },
  ]);
}
const put = (unitId: string, c: number, r = 0, side: SideId = "player", facing: Facing | null = null): ResolvedPlacement =>
  ({ unitId, side, at: { c, r }, facing });

test("place: ids, facing, side", () => {
  const u = createUnits(grid(2, 1));
  const a = u.place(put("knight", 0)), b = u.place(put("knight", 1, 0, "neutral", "E"));
  assert.equal(a.ok && a.id, "knight#1"); assert.equal(b.ok && b.id, "knight#2");
  assert.equal(u.get("knight#1")?.facing, null); assert.equal(u.get("knight#2")?.facing, "E");
  assert.equal(u.get("knight#2")?.side, "neutral"); assert.equal(u.get("knight#1")?.alive, true);
  assert.equal(u.get("knight#1")?.offset, null); assert.deepEqual(u.all().map((x) => x.id), ["knight#1", "knight#2"]);
});

test("no unit may occupy a closed cell", () => {
  const u = createUnits(grid(4, 1, [1, 2, 0, 0], [], [{ id: "o", at: { c: 2, r: 0 }, blocks: true }]));
  const off = u.place(put("knight", -1));
  assert.equal(off.ok, false); if (!off.ok) assert.equal(off.notice.code, "placeOffMap");
  for (const c of [0, 1, 2]) {
    const res = u.place(put("knight", c));
    assert.equal(res.ok, false); if (!res.ok) assert.equal(res.notice.code, "placeClosed");
    assert.deepEqual(u.occupantsAt({ c, r: 0 }), []);
  }
  const ok = u.place(put("knight", 3)); assert.equal(ok.ok && ok.id, "knight#1");
});

test("strict1 refuses a second unit", () => {
  const u = createUnits(grid(1, 1));
  assert.equal(u.occupancy, "strict1"); assert.equal(u.notices.length, 0);
  assert.equal(u.place(put("knight", 0)).ok, true); const second = u.place(put("pawn", 0));
  assert.equal(second.ok, false); if (!second.ok) assert.equal(second.notice.code, "placeOccupied");
  assert.deepEqual(u.occupantsAt({ c: 0, r: 0 }), ["knight#1"]); assert.deepEqual(u.occupantsAt({ c: 4, r: 0 }), []);
});

test("softStack and laneSlots warn and run strict1", () => {
  for (const occupancy of ["softStack", "laneSlots"] as const) {
    const u = createUnits(grid(1, 1), { occupancy });
    assert.deepEqual(u.notices.map((n) => n.code), ["occupancyUnsupported"]); assert.equal(u.occupancy, "strict1");
  assert.equal(u.place(put("knight", 0)).ok, true); const second = u.place(put("pawn", 0));
    assert.equal(second.ok, false); if (!second.ok) assert.equal(second.notice.code, "placeOccupied");
    assert.equal(u.notices.filter((n) => n.code === "occupancyUnsupported").length, 1);
  }
});

test("moveTo is atomic and reports landedOn once", () => {
  const log: string[] = [];
  const u = createUnits(grid(4, 1, [0, 0, 1, 0], [{ c: 0, r: 0, side: "e" }]), {
    hooks: { landed: (id, cell, cause) => log.push(`${id} ${cell.c} ${cause}`) },
  });
  assert.equal(u.place(put("a", 0)).ok, true); assert.equal(u.place(put("b", 1)).ok, true);
  assert.deepEqual(u.moveTo("a#1", { c: 0, r: 0 }), { ok: true, at: { c: 0, r: 0 } });
  assert.deepEqual(log, ["a#1 0 place", "b#2 1 place"]);
  assert.deepEqual(u.moveTo("a#1", { c: 3, r: 0 }), { ok: true, at: { c: 3, r: 0 } });
  assert.equal(u.occupantAt({ c: 0, r: 0 }), undefined); assert.deepEqual(u.occupantsAt({ c: 3, r: 0 }), ["a#1"]);
  assert.equal(log.at(-1), "a#1 3 move");
  assert.equal(u.moveTo("a#1", { c: 0, r: 0 }, "warp").ok, true);
  assert.equal(u.occupantAt({ c: 3, r: 0 }), undefined); assert.equal(u.occupantAt({ c: 0, r: 0 }), "a#1");
  assert.equal(log.at(-1), "a#1 0 warp");
  const before = log.length;
  assert.deepEqual(u.moveTo("a#1", { c: 0, r: 0 }), { ok: true, at: { c: 0, r: 0 } }); assert.equal(log.length, before);
  assert.deepEqual(u.moveTo("a#1", { c: 2, r: 0 }), { ok: false, reason: "closed" });
  assert.deepEqual(u.moveTo("a#1", { c: 1, r: 0 }), { ok: false, reason: "occupied" });
  assert.deepEqual(u.moveTo("a#1", { c: 9, r: 0 }), { ok: false, reason: "outOfBounds" });
  assert.equal(u.occupantAt({ c: 0, r: 0 }), "a#1"); assert.equal(u.remove("a#1"), true);
  assert.deepEqual(u.moveTo("a#1", { c: 3, r: 0 }), { ok: false, reason: "notAlive" });
  assert.deepEqual(u.moveTo("missing", { c: 3, r: 0 }), { ok: false, reason: "unknownUnit" });
  assert.equal(log.length, before);
});

test("offset never changes occupancy (M3)", () => {
  const u = createUnits(grid(2, 1));
  u.place(put("a", 0));
  assert.equal(u.setOffset("a#1", { dx: 0.5, dy: 0 }), true);
  assert.equal(u.occupantAt({ c: 0, r: 0 }), "a#1"); assert.equal(u.occupantAt({ c: 1, r: 0 }), undefined);
  assert.deepEqual(u.get("a#1")?.at, { c: 0, r: 0 }); assert.deepEqual(u.get("a#1")?.offset, { dx: 0.5, dy: 0 });
  assert.equal(u.setOffset("a#1", null), true); assert.equal(u.get("a#1")?.offset, null);
  assert.equal(u.setOffset("missing", { dx: 0, dy: 0 }), false);
  assert.equal(u.setFacing("a#1", "N"), true); assert.equal(u.get("a#1")?.facing, "N"); assert.equal(u.setFacing("a#1", null), true);
});

test("remove frees the cell the same call", () => {
  const u = createUnits(grid(1, 1));
  u.place(put("a", 0, 0, "player", "W")); u.setOffset("a#1", { dx: 0.25, dy: 0 });
  assert.equal(u.remove("a#1"), true); assert.equal(u.occupantAt({ c: 0, r: 0 }), undefined);
  assert.equal(u.get("a#1")?.alive, false); assert.equal(u.get("a#1")?.offset, null);
  assert.equal(u.setOffset("a#1", { dx: 1, dy: 0 }), false); assert.equal(u.setFacing("a#1", "S"), false);
  const again = u.place(put("b", 0)); assert.equal(again.ok && again.id, "b#2");
  assert.equal(u.remove("a#1"), false); assert.equal(u.remove("nope"), false);
  assert.deepEqual(u.all().map((x) => [x.id, x.alive]), [["a#1", false], ["b#2", true]]);
});
