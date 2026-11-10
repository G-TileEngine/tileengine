import assert from "node:assert/strict";
import { test } from "node:test";
import { createGestureMapper, type GestureOptions, type PointerSample } from "../../../src/runtime/input/index.ts";

const base: GestureOptions = { cellPx: 64, tapMaxPx: 10, holdMs: 500 };
const board = { cols: 6, rows: 9, unitAt: (at: { c: number; r: number }) => (at.c === 0 && at.r === 8 ? "knight#1" : undefined) };
const p = (kind: PointerSample["kind"], c: number, r: number, ms: number, dx = 0, dy = 0, id = 1, pointer: PointerSample["pointer"] = "touch"): PointerSample =>
  ({ kind, id, pointer, x: c * 64 + 32 + dx, y: r * 64 + 32 + dy, ms });
const run = (samples: readonly PointerSample[], options: GestureOptions = base) => {
  const feed = createGestureMapper(options, board);
  return samples.flatMap((s) => [...feed(s)]);
};
const drag = (pointer: PointerSample["pointer"] = "touch") => [
  p("down", 0, 8, 0, 0, 0, 1, pointer), p("move", 0, 8, 40, 0, 0, 1, pointer), p("move", 0, 8, 80, 0, -30, 1, pointer),
  p("move", 0, 8, 160, 0, -30, 1, pointer), p("up", 0, 7, 200, 0, 0, 1, pointer),
];
const same = [{ type: "SelectUnit", unitId: "knight#1" }, { type: "TargetCell", at: { c: 0, r: 7 } }];

test("a tap on a unit selects it, a tap on an empty cell targets it, off the grid gives nothing", () => {
  assert.deepEqual(run([p("down", 0, 8, 0), p("up", 0, 8, 40)]), [{ type: "SelectUnit", unitId: "knight#1" }]);
  assert.deepEqual(run([p("down", 2, 3, 0), p("up", 2, 3, 40)]), [{ type: "TargetCell", at: { c: 2, r: 3 } }]);
  assert.deepEqual(run([p("down", 6, 0, 0), p("up", 6, 0, 40)]), []);
});
test("tap-tap and drag-to-target give identical intents (M7)", () => {
  assert.deepEqual(run([p("down", 0, 8, 0), p("up", 0, 8, 90), p("down", 0, 7, 400), p("up", 0, 7, 480)]), same);
  assert.deepEqual(run(drag()), same);
  assert.deepEqual(run(drag("mouse")), same);
});
test("hold then drag is a BoxSelect; a hold without moving boxes one cell; a long drag stays a drag; an empty-start drag is nothing", () => {
  assert.deepEqual(run([p("down", 1, 1, 0), p("move", 1, 1, 500), p("up", 3, 2, 560)]), [{ type: "BoxSelect", from: { c: 1, r: 1 }, to: { c: 3, r: 2 } }]);
  assert.deepEqual(run([p("down", 1, 1, 0), p("up", 1, 1, 500)]), [{ type: "BoxSelect", from: { c: 1, r: 1 }, to: { c: 1, r: 1 } }]);
  assert.deepEqual(run([p("down", 0, 8, 0), p("up", 0, 7, 100)]), same);
  assert.deepEqual(run([p("down", 0, 8, 0), p("move", 0, 8, 100, 0, -30), p("up", 0, 7, 600)]), same);
  assert.deepEqual(run([p("down", 2, 3, 0), p("up", 3, 3, 200)]), []);
});
test("only the first touch owns a gesture; a second finger and a cancel give nothing", () => {
  assert.deepEqual(run([p("down", 0, 8, 0), p("down", 2, 2, 10, 0, 0, 2), p("up", 2, 2, 20, 0, 0, 2), p("up", 0, 8, 40)]), [{ type: "SelectUnit", unitId: "knight#1" }]);
  assert.deepEqual(run([p("down", 0, 8, 0), p("move", 0, 8, 20, 0, -30), p("cancel", 0, 8, 40)]), []);
});
test("thresholds are the caller's: a wider tapMaxPx turns the drag into a tap; bad options and time going back throw", () => {
  assert.deepEqual(run([p("down", 0, 8, 0), p("up", 0, 8, 40, 30)], { ...base, tapMaxPx: 40 }), [{ type: "SelectUnit", unitId: "knight#1" }]);
  assert.throws(() => createGestureMapper({ ...base, cellPx: 0 }, board), RangeError);
  assert.throws(() => createGestureMapper({ ...base, tapMaxPx: -1 }, board), RangeError);
  assert.throws(() => createGestureMapper({ ...base, holdMs: 1.5 }, board), RangeError);
  assert.throws(() => run([p("down", 0, 8, 100), p("up", 0, 8, 50)]), RangeError);
  assert.throws(() => run([p("down", 0, 8, 0.5)]), RangeError);
});
