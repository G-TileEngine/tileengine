import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../src/core/clock/index.ts";
import { DEFAULT_BUS_LIMITS, createBus } from "../../src/core/events/index.ts";

const land = (cause: "place" | "move") => ({ type: "landedOn" as const, unit: "a#1", cell: { c: 0, r: 0 }, cause });

test("bus history cap (step 17): the newest records stay, seq keeps counting, and a bad limit throws", () => {
  const capped = createBus(createClock(), undefined, { history: 3 });
  const sizes: number[] = [];
  capped.onAny(() => sizes.push(capped.history().length));
  for (let n = 0; n < 5; n += 1) capped.emit(land("place"));
  assert.deepEqual([sizes, capped.history().map((r) => r.seq)], [[1, 2, 3, 3, 3], [3, 4, 5]]);
  const quiet = createBus(createClock(), undefined, { history: 0 });
  let heard = 0;
  quiet.onAny(() => { heard += 1; });
  quiet.emit(land("move"));
  assert.equal(heard === 1 && quiet.history().length === 0, true);
  const open = createBus(createClock());
  for (let n = 0; n < 1030; n += 1) open.emit(land("place"));
  assert.deepEqual(DEFAULT_BUS_LIMITS, { history: 1024 });
  assert.equal(open.history().length === 1024 && open.history()[0]?.seq === 7, true);
  for (const history of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) assert.throws(() => createBus(createClock(), undefined, { history }), (err: unknown) => err instanceof RangeError && err.message === "createBus: history must be an integer >= 0");
});
test("bus dispose (step 17): a dispose inside an emit stops the rest, and a second call keeps later subscriptions quiet", () => {
  const bus = createBus(createClock());
  const seen: string[] = [], errs: unknown[] = [];
  bus.onError((err) => errs.push(err));
  bus.on("landedOn", () => { bus.dispose(); throw new Error("boom"); });
  bus.on("landedOn", () => seen.push("later"));
  bus.onAny(() => seen.push("any"));
  bus.emit(land("place"));
  assert.deepEqual([seen, errs, bus.history()], [[], [], []]);
  bus.dispose();
  let called = 0;
  const drop = bus.onAny(() => { called += 1; });
  bus.on("landedOn", () => { called += 1; });
  drop();
  bus.emit(land("move"));
  assert.equal(called === 0 && bus.history().length === 0 && bus.isRegistered("landedOn"), true);
  assert.throws(() => bus.emit({ type: "nope" } as never), RangeError);
});
test("clock dispose (step 17): a dispose inside tick 1 stops that tick, and time still counts after a second call", () => {
  const clock = createClock(), seen: string[] = [];
  clock.after(0, () => { clock.dispose(); clock.after(0, () => seen.push("inner")); throw new Error("boom"); });
  clock.after(0, () => seen.push("other")); clock.onTick(() => seen.push("tick")); clock.onRender(() => seen.push("render")); clock.onError(() => seen.push("err"));
  clock.advance(10);
  assert.equal(clock.tick() === 1 && seen.length === 0, true);
  clock.dispose();
  assert.throws(() => clock.after(-1, () => seen.push("bad")), RangeError);
  const drop = clock.onTick(() => seen.push("later")); drop(); clock.after(0, () => seen.push("later"));
  clock.advance(100); clock.step();
  assert.equal(clock.tick() === 12 && clock.now() === 120 && seen.length === 0, true);
});
