import assert from "node:assert/strict";
import { test } from "node:test";
import type { CoreMap, ResolvedPlacement, SideId } from "../../src/types/core-types.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { createUnits, reach, type PassThrough, type Units } from "../../src/core/unit/index.ts";
import { createWorld, submit } from "../../src/sim/index.ts";
import { input, move } from "../sim/input.ts";

const grid = (cols: number, rows = 1) => createGrid({ kind: "map", formatVersion: 5, id: "t", rev: 1, cols, rows, logic: { terrain: Array.from({ length: cols * rows }, () => 0), palette: { "0": "floor" }, edges: [] } } as CoreMap, [{ id: "floor", open: true, push_can_enter: true }]);
const put = (unitId: string, c: number, side: SideId = "player", r = 0): ResolvedPlacement => ({ unitId, side, at: { c, r }, facing: null });
const grids = new WeakMap<Units, ReturnType<typeof grid>>();
const line = (sides: readonly (SideId | null)[]): Units => { const g = grid(sides.length), u = createUnits(g); grids.set(u, g); sides.forEach((s, c) => { if (s !== null) u.place(put(s === "player" ? "knight" : "wolf", c, s)); }); return u; };
const cells = (u: Units, id: string, steps: number, pass?: PassThrough): string => { const g = grids.get(u); if (g === undefined) throw new Error("grid"); return reach(g, u, id, steps, pass).map((a) => a.c).sort((a, b) => a - b).join(""); }; // the unit's own cell is listed

test("G4 R9 strict1: a dead unit frees its cell the same tick for place, move, push and reach", () => {
  const u = line(["player", "rival", null, null, null, null]); assert.equal(u.remove("wolf#2"), true); assert.deepEqual(u.occupantsAt({ c: 1, r: 0 }), []);
  assert.equal(cells(u, "knight#1", 2), "012"); assert.deepEqual(u.push("knight#1", "e", 3), { moved: 3, at: { c: 3, r: 0 }, blocker: null, cellsRemaining: 0 });
  const v = line(["player", "rival"]); v.remove("wolf#2"); assert.deepEqual(v.moveTo("knight#1", { c: 1, r: 0 }), { ok: true, at: { c: 1, r: 0 } });
  const p = line([null, "rival"]); p.remove("wolf#1"); const placed = p.place(put("knight", 1)); assert.equal(placed.ok, true);
  const w = createWorld(input("stage-fixed")); assert.equal(w.units.remove("archer#2"), true); submit(w, move("x", "knight#1", 1, 8, null));
  assert.deepEqual([w.units.get("knight#1")?.at, w.notices.filter((n) => n.code === "moveFailed").length, w.clock.tick()], [{ c: 1, r: 8 }, 0, 0]);
});

test("G4 R9 strict1: move, place and push onto a living unit fail (occupied, placeOccupied, blocker unit), ally or rival alike", () => {
  for (const side of ["player", "rival"] as const) {
    const u = line(["player", side, null, null]); assert.deepEqual(u.moveTo("knight#1", { c: 1, r: 0 }), { ok: false, reason: "occupied" });
    const placed = u.place(put("pawn", 1)); assert.equal(placed.ok ? "ok" : placed.notice.code, "placeOccupied");
    assert.deepEqual(u.push("knight#1", "e", 3), { moved: 0, at: { c: 0, r: 0 }, blocker: "unit", cellsRemaining: 3 });
  }
  const gap = line(["player", null, "rival", null]); assert.deepEqual(gap.push("knight#1", "e", 3), { moved: 1, at: { c: 1, r: 0 }, blocker: "unit", cellsRemaining: 2 });
  const w = createWorld(input("stage-fixed")); submit(w, move("x", "knight#1", 1, 8, null)); assert.deepEqual([w.units.get("knight#1")?.at, w.notices.map((n) => n.code)], [{ c: 0, r: 8 }, ["moveFailed"]]);
});

test("G4 R9 strict1 PassThrough: allies (default) pass through allies but never end on one; none stops at allies; all passes rivals but never ends on them", () => {
  const u = line(["player", "player", null, "rival", null, null]);
  assert.deepEqual([cells(u, "knight#1", 3), cells(u, "knight#1", 3, "allies"), cells(u, "knight#1", 3, "none"), cells(u, "knight#1", 5, "all"), cells(u, "knight#1", 5)], ["02", "02", "0", "0245", "02"]);
  const dead = line(["player", "rival", null]); dead.remove("wolf#2"); assert.deepEqual([cells(dead, "knight#1", 2, "none"), cells(dead, "knight#1", 2, "allies")], ["012", "012"]);
});

test("G4 R9 strict1: an unknown occupancy policy runs strict1 with one occupancyUnsupported notice; strict1 or none given gives no notice", () => {
  const note = (occupancy: unknown): string => { const u = createUnits(grid(1), occupancy === undefined ? undefined : { occupancy: occupancy as "strict1" }); return `${u.occupancy}:${u.notices.map((n) => n.code).join(",")}`; };
  assert.deepEqual([note("zzz"), note("softStack"), note(""), note(5), note("strict1"), note(undefined)], ["strict1:occupancyUnsupported", "strict1:occupancyUnsupported", "strict1:occupancyUnsupported", "strict1:occupancyUnsupported", "strict1:", "strict1:"]);
  const s = input("stage-fixed"), w = createWorld({ ...s, manifest: { ...(s.manifest as Record<string, unknown>), project: { ...((s.manifest as { project: Record<string, unknown> }).project), settings: { wrapEdges: false, occupancy: "softStack" } } } });
  assert.deepEqual([w.units.occupancy, w.notices.filter((n) => n.code === "occupancyUnsupported").length], ["strict1", 1]);
});
