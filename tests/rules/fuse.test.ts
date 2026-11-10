import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../src/core/clock/index.ts";
import { startFuse } from "../../src/rules/turns/fuse.ts";

function framesUntil(ms: number, scale = 1): { frame: number; at: number[] } {
  const clock = createClock();
  clock.setTimeScale(scale);
  const at: number[] = [];
  startFuse(clock, ms, () => at.push(clock.now()));
  let frame = 0;
  while (clock.now() < ms) {
    clock.advance(100);
    frame += 1;
  }
  clock.advance(100);
  return { frame, at };
}

test("a 30000 ms fuse fires once at 30000 sim ms", () => {
  const a = framesUntil(30000);
  assert.deepEqual(a.at, [30000]);
  assert.equal(a.frame, 300);
  const b = framesUntil(45000);
  assert.deepEqual(b.at, [45000]);
  assert.equal(b.frame, 450);
});

test("60000 ms fuse at 60000; off never; bad values are invalidValue", () => {
  const slow = framesUntil(60000);
  assert.deepEqual(slow.at, [60000]);
  assert.equal(slow.frame, 600);
  const clock = createClock();
  const emitted: string[] = [];
  assert.equal(startFuse(clock, "off", (e) => emitted.push(e.type)), null);
  for (let i = 0; i < 1200; i += 1) clock.advance(100);
  assert.equal(clock.now(), 120000);
  assert.deepEqual(emitted, []);
  for (const bad of [0, -1, 1.5, Number.NaN]) {
    assert.throws(() => startFuse(clock, bad, () => undefined), (err: unknown) => {
      assert.ok(err instanceof RangeError);
      assert.match(err.message, /^invalidValue:/);
      return true;
    });
  }
});

test("a paused clock stops the fuse", () => {
  const clock = createClock();
  const at: number[] = [];
  startFuse(clock, 30000, () => at.push(clock.now()));
  while (clock.now() < 10000) clock.advance(100);
  assert.equal(clock.now(), 10000);
  clock.pause();
  for (let i = 0; i < 1000; i += 1) clock.advance(100);
  assert.equal(clock.now(), 10000);
  assert.deepEqual(at, []);
  clock.resume();
  while (clock.now() < 30000) clock.advance(100);
  assert.deepEqual(at, [30000]);
});

test("game speed x2 halves the frames needed", () => {
  const fast = framesUntil(30000, 2);
  assert.deepEqual(fast.at, [30000]);
  assert.equal(fast.frame, 150);
});
