// QA pin (P1-1 r5): a dead walker has no walks and no targets; an off-board aim never aliases an on-board cell.
import assert from "node:assert/strict";
import { test } from "node:test";
import { reachCells, targetsFor, walkTo, walks } from "../../src/rules/move/index.ts";
import { createWorld } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

const at = (c: number, r: number) => ({ c, r });

test("QA P1-1: a removed walker walks nowhere and taps no one; off-board aims that share a cell index are refused", () => {
  const { grid, units } = createWorld(input("stage-fixed"));
  assert.deepEqual(walkTo(grid, units, "knight#1", 2, at(0, 7)), [at(0, 7)]);
  assert.deepEqual([walkTo(grid, units, "knight#1", 2, at(6, 6)), walkTo(grid, units, "knight#1", 2, at(-6, 8))], [null, null]);
  assert.deepEqual(targetsFor(grid, units, "knight#1").map((t) => t.id), ["archer#2"]);
  assert.equal(units.remove("knight#1"), true);
  assert.deepEqual([walks(grid, units, "knight#1", 2).size, reachCells(grid, units, "knight#1", 2), targetsFor(grid, units, "knight#1")], [0, [], []]);
});
