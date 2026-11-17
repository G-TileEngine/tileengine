import assert from "node:assert/strict";
import { test } from "node:test";
import type { ResolvedPlacement, SideId, Sq } from "../../src/types/core-types.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { createUnits } from "../../src/core/unit/index.ts";
import { BTF_MOVE_DEFAULTS } from "../../src/btf-adapters/src/btf-defaults/move.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { STEP_PATTERN, STEP_PATTERN_KNOBS, reachCells } from "../../src/rules/move/index.ts";

const at = (c: number, r: number): Sq => ({ c, r });
const TILES = [{ id: "floor", open: true, push_can_enter: true }];
const put = (units: ReturnType<typeof createUnits>, unitId: string, c: number, r: number, side: SideId = "player"): string => {
  const p: ResolvedPlacement = { unitId, side, at: at(c, r), facing: null }, res = units.place(p);
  assert.equal(res.ok, true);
  return res.ok ? res.id : "";
};
const board = (cols: number, rows: number) => {
  const grid = createGrid({
    kind: "map", formatVersion: 5, id: "btf", rev: 1, cols, rows,
    logic: { terrain: Array.from({ length: cols * rows }, () => 0), palette: { "0": "floor" }, edges: [] },
  }, TILES);
  return { grid, units: createUnits(grid) };
};

test("defaults match BTF move numbers, and default reach equals BTF straight-ray squares with bodies blocking", () => {
  assert.equal(BTF_MOVE_DEFAULTS.pattern, "orthogonal-1");
  assert.equal(BTF_MOVE_DEFAULTS.max_step, 2);
  assert.equal(BTF_MOVE_DEFAULTS.bodies_block, true);
  const pattern = STEP_PATTERN_KNOBS.find((k) => k.id === "pattern")?.default, cap = STEP_PATTERN_KNOBS.find((k) => k.id === "max_step")?.default;
  assert.equal(pattern, BTF_MOVE_DEFAULTS.pattern);
  assert.equal(cap, BTF_MOVE_DEFAULTS.max_step);
  const installed = installOne(STEP_PATTERN, {}).out;
  assert.ok(installed !== null);
  assert.equal(installed.reach, 1);
  const reach = installed.reach;

  // Open 5×5, walker in the centre: warrior-shaped (orthogonal-1) — four empty neighbours, start excluded.
  const open = board(5, 5), w1 = put(open.units, "warrior", 2, 2);
  assert.deepEqual(reachCells(open.grid, open.units, w1, reach), [at(2, 1), at(1, 2), at(3, 2), at(2, 3)]);

  // Teammate on the north cell: any body blocks (own team included); that square is not a landing.
  const own = board(5, 5), w2 = put(own.units, "warrior", 2, 2);
  put(own.units, "ally", 2, 1, "player");
  assert.deepEqual(reachCells(own.grid, own.units, w2, reach), [at(1, 2), at(3, 2), at(2, 3)]);

  // Foe on the east cell: the body blocks the landing the same way.
  const foe = board(5, 5), w3 = put(foe.units, "warrior", 2, 2);
  put(foe.units, "foe", 3, 2, "rival");
  assert.deepEqual(reachCells(foe.grid, foe.units, w3, reach), [at(2, 1), at(1, 2), at(2, 3)]);

  // Cleric-shaped (reach 2, still under max_step 2): a body one step south stops that line (cannot land on it or pass it).
  const line = board(5, 5), c1 = put(line.units, "cleric", 2, 2);
  put(line.units, "body", 2, 3, "player");
  assert.deepEqual(reachCells(line.grid, line.units, c1, BTF_MOVE_DEFAULTS.max_step), [at(2, 0), at(2, 1), at(0, 2), at(1, 2), at(3, 2), at(4, 2)]);
});
