import { test } from "node:test";
import assert from "node:assert/strict";
import type { CoreMap } from "../../src/types/core-types.ts";
import { createClock } from "../../src/core/clock/index.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { createUnits } from "../../src/core/unit/index.ts";
import { createBus, unitEvents } from "../../src/core/events/index.ts";

const cell = { c: 0, r: 0 };
const land = (cause: "place" | "move" | "forced" | "warp") => ({ type: "landedOn" as const, unit: "a#1", cell, cause });
test("events are ordered and stamped", () => {
  const clock = createClock();
  clock.advance(30);
  const bus = createBus(clock);
  const seen: string[] = [];
  bus.on("landedOn", () => seen.push("a"));
  bus.on("landedOn", () => seen.push("b"));
  bus.onAny((rec) => seen.push(`any${rec.seq}`));
  bus.emit(land("place")); bus.emit(land("move"));
  bus.emit({ type: "pushBlocked", unit: "a#1", blocker: "unit", cellsRemaining: 0 });
  const h = bus.history();
  assert.deepEqual([h.map((r) => r.seq), h.map((r) => r.tick), seen], [[1, 2, 3], [3, 3, 3], ["a", "b", "any1", "a", "b", "any2", "any3"]]);
  assert.notEqual(bus.history(), h);
  const again = createBus(clock);
  const seqs: number[] = [];
  again.on("landedOn", (_e, rec) => { seqs.push(rec.seq); if (rec.seq === 1) again.emit({ type: "pushBlocked", unit: "a#1", blocker: "edge", cellsRemaining: 0 }); });
  again.emit(land("place"));
  assert.deepEqual(again.history().map((r) => [r.seq, r.event.type]), [[1, "landedOn"], [2, "pushBlocked"]]);
  assert.deepEqual(seqs, [1]);
});
test("a throwing listener is isolated", () => {
  const bus = createBus(createClock());
  const errs: unknown[] = [];
  bus.onError((e) => errs.push(e));
  bus.onError(() => { throw new Error("inner"); });
  let n = 0;
  bus.on("landedOn", () => { throw new Error("boom"); });
  const drop = bus.on("landedOn", () => { drop(); n += 1; });
  bus.on("landedOn", () => { n += 1; });
  bus.emit(land("place"));
  assert.equal(n, 2);
  assert.equal(errs.length === 1 && errs[0] instanceof Error && errs[0].message, "boom");
});
test("unit hooks emit the DSK core events", () => {
  const doc: CoreMap = { kind: "map", formatVersion: 5, id: "push", rev: 1, cols: 5, rows: 1,
    logic: { terrain: [0, 0, 0, 0, 1], palette: { "0": "floor", "1": "wall-block" }, edges: [{ c: 0, r: 0, side: "e" }] } };
  const grid = createGrid(doc, [{ id: "floor", open: true, push_can_enter: true }, { id: "wall-block", open: false, push_can_enter: false }]);
  const bus = createBus(createClock());
  const units = createUnits(grid, { hooks: unitEvents(bus), terrain: { push_into_walls: true } });
  assert.equal(units.place({ unitId: "a", side: "player", at: { c: 1, r: 0 }, facing: null }).ok, true);
  units.push("a#1", "e", 5);
  const h = bus.history().map((r) => r.event);
  assert.deepEqual(h.map((e) => e.type), ["landedOn", "pushBlocked", "landedOn"]);
  assert.equal(h[0]?.type === "landedOn" && h[0].cause === "place" && h[2]?.type === "landedOn" && h[2].cause === "forced", true);
  assert.equal(h[1]?.type === "pushBlocked" && h[1].blocker === "wall-block" && h[1].cellsRemaining === 3, true);
});
test("mode registry: typed mode events", () => {
  const bus = createBus<{ WAVE_CLEARED: { readonly wave: number } }>(createClock(), { mode: "td", types: ["WAVE_CLEARED"] });
  let wave = 0;
  bus.on("WAVE_CLEARED", (e) => { wave = e.wave; });
  bus.emit({ type: "WAVE_CLEARED", wave: 2 });
  let core = false;
  bus.on("landedOn", () => { core = true; });
  bus.emit(land("place"));
  assert.equal(wave === 2 && core && bus.isRegistered("WAVE_CLEARED") && bus.isRegistered("landedOn"), true);
});
test("registry collisions and unregistered types throw", () => {
  const clock = createClock();
  assert.throws(() => createBus<{ landedOn: { readonly x: number } }>(clock, { mode: "x", types: ["landedOn"] }), RangeError);
  assert.throws(() => createBus<{ A: { readonly n: number } }>(clock, { mode: "x", types: ["A", "A"] }), RangeError);
  const bare = createBus(clock);
  assert.throws(() => bare.emit({ type: "WAVE_CLEARED" } as never), RangeError);
  assert.throws(() => bare.on("WAVE_CLEARED" as never, () => undefined), RangeError);
  for (const t of ["landedOn", "pushBlocked", "enteredLane", "actionLogged"]) assert.equal(bare.isRegistered(t), true);
  assert.equal(bare.isRegistered("WAVE_CLEARED"), false);
});
