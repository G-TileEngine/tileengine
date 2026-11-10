import { test } from "node:test";
import assert from "node:assert/strict";
import type { CoreMap, SideId } from "../../src/types/core-types.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { createUnits } from "../../src/core/unit/index.ts";
import type { Units } from "../../src/core/unit/index.ts";
import type { Grid } from "../../src/core/grid/index.ts";
import { aimTile, aimUnit, resolveAim, resolveContext, roster, toCell, type Aim } from "../../src/core/targeting/index.ts";

type Eq<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

function world() {
  const doc: CoreMap = {
    kind: "map", formatVersion: 5, id: "p", rev: 1, cols: 5, rows: 5,
    logic: { terrain: Array.from({ length: 25 }, () => 0), palette: { "0": "floor" }, edges: [] },
  };
  const grid = createGrid(doc, [{ id: "floor", open: true, push_can_enter: true }]);
  const units = createUnits(grid);
  const place = (unitId: string, c: number, r: number, side: SideId = "player"): string => {
    const res = units.place({ unitId, side, at: { c, r }, facing: null });
    if (!res.ok) throw new Error("place");
    return res.id;
  };
  return { grid, units, place };
}

test("no third pipe exists", async () => {
  const exact: Eq<Aim["pipe"], "unit" | "tile"> = true;
  assert.equal(exact, true);
  const keys = Object.keys(await import("../../src/core/targeting/index.ts")).sort();
  assert.deepEqual(keys, ["aimTile", "aimUnit", "resolveAim", "resolveContext", "roster", "toCell"]);
});

test("UNIT follows the body", () => {
  const { grid, units, place } = world();
  const id = place("knight", 1, 1);
  assert.equal(units.moveTo(id, { c: 3, r: 4 }).ok, true);
  const aim = aimUnit(id);
  const resolution = { hit: true, unitId: id, at: { c: 3, r: 4 } };
  assert.deepEqual(resolveAim(aim, units, grid), resolution);
  assert.deepEqual(resolveContext("caster#1", aim, units, grid), { caster: "caster#1", aim, resolution });
});

test("UNIT never hits a dead target's old cell", () => {
  const { grid, units, place } = world();
  const id = place("knight", 2, 2);
  assert.equal(units.remove(id), true);
  const other = place("pawn", 2, 2);
  assert.deepEqual(resolveAim(aimUnit(id), units, grid), { hit: false, reason: "dead" });
  assert.equal(units.occupantAt({ c: 2, r: 2 }), other);
  assert.deepEqual(resolveAim(aimUnit("missing#9"), units, grid), { hit: false, reason: "dead" });
});

test("TILE hits whoever stands there on arrival", () => {
  const { grid, units, place } = world();
  const first = place("knight", 1, 1);
  const aim = aimTile({ c: 1, r: 1 });
  assert.equal(units.moveTo(first, { c: 0, r: 0 }).ok, true);
  const arrived = place("pawn", 1, 1);
  assert.deepEqual(resolveAim(aim, units, grid), { hit: true, unitId: arrived, at: { c: 1, r: 1 } });
  assert.equal(units.moveTo(arrived, { c: 4, r: 4 }).ok, true);
  assert.deepEqual(resolveAim(aim, units, grid), { hit: false, reason: "empty" });
  assert.deepEqual(resolveAim(aimTile({ c: -1, r: 0 }), units, grid), { hit: false, reason: "offMap" });
  assert.deepEqual(resolveAim(aimTile({ c: 5, r: 5 }), units, grid), { hit: false, reason: "offMap" });
  assert.deepEqual(resolveContext("archer#1", aimTile({ c: 3, r: 1 }, "E"), units, grid), {
    caster: "archer#1",
    aim: { pipe: "tile", at: { c: 3, r: 1 }, edge: "E" },
    resolution: { hit: false, reason: "empty" },
  });
});

test("TILE never retargets", () => {
  const { grid, units, place } = world();
  const id = place("knight", 2, 2);
  assert.equal(units.moveTo(id, { c: 3, r: 2 }).ok, true);
  assert.deepEqual(resolveAim(aimTile({ c: 2, r: 2 }), units, grid), { hit: false, reason: "empty" });
  assert.deepEqual(resolveAim(aimUnit(id), units, grid), { hit: true, unitId: id, at: { c: 3, r: 2 } });
});

test("edge target is TILE + side", () => {
  const { grid, units, place } = world();
  const here = place("knight", 2, 2);
  place("pawn", 2, 1);
  const edged = aimTile({ c: 2, r: 2 }, "N");
  assert.deepEqual(edged, { pipe: "tile", at: { c: 2, r: 2 }, edge: "N" });
  const hit = { hit: true, unitId: here, at: { c: 2, r: 2 } };
  assert.deepEqual(resolveAim(edged, units, grid), hit);
  assert.deepEqual(resolveAim(aimTile({ c: 2, r: 2 }), units, grid), hit);
  assert.equal(Object.hasOwn(aimTile({ c: 2, r: 2 }), "edge"), false);
  assert.deepEqual(resolveAim(aimTile({ c: -1, r: 2 }, "W"), units, grid), { hit: false, reason: "offMap" });
});

test("Gale fallback is UNIT", () => {
  const { grid, units, place } = world();
  const id = place("knight", 1, 1);
  const other = place("pawn", 3, 3);
  const spot = { c: 3, r: 3 };
  assert.deepEqual(resolveAim(aimUnit(id, spot), units, grid), { hit: true, unitId: id, at: { c: 1, r: 1 } });
  assert.equal(units.remove(id), true);
  assert.deepEqual(resolveAim(aimUnit(id, spot), units, grid), { hit: true, unitId: other, at: spot });
  assert.equal(units.remove(other), true);
  assert.deepEqual(resolveAim(aimUnit(id, spot), units, grid), { hit: false, reason: "dead" });
  assert.deepEqual(resolveAim(aimUnit(id, { c: 9, r: 9 }), units, grid), { hit: false, reason: "offMap" });
  assert.equal(Object.hasOwn(aimUnit(id), "fallbackAt"), false);
  place("squire", 0, 0);
  assert.deepEqual(resolveAim(aimUnit("nope", { c: 0, r: 0 }), units, grid), { hit: false, reason: "dead" });
  assert.deepEqual(resolveAim(aimUnit("nope", { c: 9, r: 9 }), units, grid), { hit: false, reason: "dead" });
});

test("no target: the context gets the caster only", () => {
  const { grid, units } = world();
  assert.deepEqual(resolveContext("knight#1", null, units, grid), { caster: "knight#1", aim: null, resolution: null });
  const trap = new Proxy({}, { get() { throw new Error("read"); } });
  assert.deepEqual(
    resolveContext("knight#1", null, trap as never as Units, trap as never as Grid),
    { caster: "knight#1", aim: null, resolution: null },
  );
});

test("roster lists the living only, same tick", () => {
  const { units, place } = world();
  const a = place("knight", 0, 0, "player");
  const b = place("pawn", 1, 0, "rival");
  const c = place("wolf", 2, 0, "neutral");
  assert.deepEqual(roster(units), [{ id: a, at: { c: 0, r: 0 } }, { id: b, at: { c: 1, r: 0 } }, { id: c, at: { c: 2, r: 0 } }]);
  assert.equal(units.remove(b), true);
  assert.deepEqual(roster(units).map((e) => e.id), [a, c]);
  assert.deepEqual(roster(units, "player").map((e) => e.id), [a]);
  assert.deepEqual(roster(units, "rival").map((e) => e.id), []);
  assert.deepEqual(roster(units, "neutral").map((e) => e.id), [c]);
});

test("toCell rounds half-up per axis", () => {
  assert.deepEqual(toCell({ c: 2.5, r: -0.5 }), { c: 3, r: 0 });
  assert.deepEqual(toCell({ c: 1.49, r: 3.5 }), { c: 1, r: 4 });
  assert.deepEqual(toCell({ c: -1.5, r: 0.5 }), { c: -1, r: 1 });
});
