import assert from "node:assert/strict";
import { test } from "node:test";
import { createLighting, createSight, visibleCells, wallsFrom, type Blockers } from "../../../src/runtime/render/index.ts";

// P1 (G3): thin edge walls stop light. Bits per cell: n 1, e 2, s 4, w 8 (the grid's movement-wall bits).
const open = (cols: number, rows: number): Blockers => ({ cols, rows, blocks: new Uint8Array(cols * rows) });
const eastWall = (cols: number, rows: number, at: number, from = 0, to = rows - 1): Uint8Array => {
  const w = new Uint8Array(cols * rows);
  for (let r = from; r <= to; r += 1) { w[r * cols + at] = (w[r * cols + at] ?? 0) | 2; w[r * cols + at + 1] = (w[r * cols + at + 1] ?? 0) | 8; }
  return w;
};
const farLit = (level: ArrayLike<number>, w: number, fromX: number): number => Array.from(level).filter((v, i) => v > 0 && i % w >= fromX).length;

test("a torch beside a thin wall lights none of the far side (P1 G3)", () => {
  const g = { ...open(12, 12), tileW: 16, tileH: 16 }, torch = [{ x: 5 * 16 + 8, y: 5 * 16 + 8, radius: 64 }];
  const bare = createLighting().plan(g, torch, 1, 0, 8);
  assert.ok(farLit(bare.level, bare.w, 12) > 0, "without walls the far side is lit");
  const walled = createLighting().plan({ ...g, lightWalls: eastWall(12, 12, 5) }, torch, 1, 0, 8);
  assert.equal(farLit(walled.level, walled.w, 12), 0);
  assert.ok((walled.level[10 * walled.w + 10] ?? 0) > 0, "the near side stays lit");
  for (const [at, bit] of [[6, 8], [5, 2]] as const) { const oneSided = new Uint8Array(144); for (let r = 0; r < 12; r += 1) oneSided[r * 12 + at] = bit;
    assert.equal([...visibleCells({ ...open(12, 12), lightWalls: oneSided }, 5, 5, 6)].some((v, i) => v === 1 && i % 12 >= 6), false, `a wall bit on either side of the edge stops light (${at}:${bit})`); }
});

test("a short thin wall shadows only what is behind it; light goes round its ends (P1 G3)", () => {
  const seen = visibleCells({ ...open(12, 12), lightWalls: eastWall(12, 12, 5, 5, 5) }, 5, 5, 6);
  assert.equal(seen[5 * 12 + 6], 0); assert.equal(seen[5 * 12 + 9], 0);
  assert.equal(seen[4 * 12 + 6], 1); assert.equal(seen[6 * 12 + 6], 1);
  const north = new Uint8Array(144); north[5 * 12 + 5] = 1; north[4 * 12 + 5] = 4;
  const up = visibleCells({ ...open(12, 12), lightWalls: north }, 5, 5, 6);
  assert.equal(up[4 * 12 + 5], 0); assert.equal(up[1 * 12 + 5], 0); assert.equal(up[6 * 12 + 5], 1);
});

test("no light walls: masks and plans are byte-equal to before, and an all-zero wall list changes nothing (P1 G3)", () => {
  const g = { ...open(10, 10), tileW: 16, tileH: 16 }, torch = [{ x: 40, y: 40, radius: 56 }];
  const a = createLighting().plan(g, torch, 1, 0, 8), b = createLighting().plan({ ...g, lightWalls: new Uint8Array(100) }, torch, 1, 0, 8);
  assert.deepEqual([...a.level], [...b.level]); assert.deepEqual([...a.dark], [...b.dark]);
  assert.deepEqual([...visibleCells(open(10, 10), 3, 3, 5)], [...visibleCells({ ...open(10, 10), lightWalls: new Uint8Array(100) }, 3, 3, 5)]);
});

test("the sight cache keys on the light walls too, and wallsFrom copies the grid's movement walls (P1 G3)", () => {
  const sight = createSight(), base = open(12, 12), walls = eastWall(12, 12, 5);
  const plain = sight.mask(base, 5, 5, 6), walled = sight.mask({ ...base, lightWalls: walls }, 5, 5, 6);
  assert.equal(sight.stats.computed, 2); assert.notDeepEqual([...plain], [...walled]);
  sight.mask({ ...base, lightWalls: walls }, 5, 5, 6); assert.equal(sight.stats.computed, 2);
  const grid = { cols: 3, rows: 2, hasWall: (at: { c: number; r: number }, d: string): boolean => (at.c === 0 && at.r === 0 && d === "e") || (at.c === 1 && at.r === 0 && d === "w") || (at.c === 2 && at.r === 1 && d === "n") };
  assert.deepEqual([...wallsFrom(grid)], [2, 8, 0, 0, 0, 1]);
});
