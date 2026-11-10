import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../src/core/clock/index.ts";

test("same deltas give the same ticks", () => {
  const feed = [17, 16, 17, 33, 1, 250, 0];
  const run = (): { ticks: number[]; now: number } => {
    const ticks: number[] = [];
    const clock = createClock();
    clock.onTick((info) => ticks.push(info.tick));
    for (const dt of feed) clock.advance(dt);
    return { ticks, now: clock.now() };
  };
  const a = run();
  assert.deepEqual(a, run());
  assert.equal(a.now, 180);
  assert.equal(a.ticks.length, 18);
});

test("1000 frames of 16 ms", () => {
  const clock = createClock();
  for (let i = 0; i < 1000; i += 1) clock.advance(16);
  assert.equal(clock.tick(), 1600);
  assert.equal(clock.now(), 16000);
});

test("a long stall is clamped", () => {
  const clock = createClock();
  clock.advance(5000);
  assert.equal(clock.tick(), 10);
});

test("bad options fall back to 10 and 100", () => {
  assert.equal(createClock().stepMs, 10);
  const badStep = createClock({ stepMs: 0 });
  assert.equal(badStep.stepMs, 10);
  badStep.advance(10);
  assert.equal(badStep.tick(), 1);
  const badMax = createClock({ maxFrameMs: 1.5 });
  badMax.advance(5000);
  assert.equal(badMax.tick(), 10);
  const step20 = createClock({ stepMs: 20 });
  step20.advance(20);
  assert.equal(step20.now(), 20);
});

test("integer ms only", () => {
  const clock = createClock();
  clock.advance(10);
  const snap = (): [number, number, boolean, number] => [clock.tick(), clock.now(), clock.paused, clock.timeScale];
  for (const bad of [16.6, -1, Number.NaN]) {
    const before = snap();
    assert.throws(() => clock.advance(bad), RangeError);
    assert.deepEqual(snap(), before);
  }
  const before = snap();
  assert.throws(() => clock.after(0.5, () => undefined), RangeError);
  assert.deepEqual(snap(), before);
});

test("game speed runs more steps, same step size", () => {
  const steps: number[] = [];
  const clock = createClock();
  clock.onTick((info) => steps.push(info.stepMs));
  clock.setTimeScale(2);
  clock.advance(20);
  assert.equal(clock.tick(), 4);
  assert.deepEqual(steps, [10, 10, 10, 10]);
  clock.setTimeScale(3);
  const at = clock.tick();
  clock.advance(10);
  assert.equal(clock.tick() - at, 3);
  clock.setTimeScale(0.3);
  assert.equal(clock.timeScale, 0.25);
  let renders = 0;
  clock.onRender(() => { renders += 1; });
  const frozen = clock.tick();
  clock.setTimeScale(0);
  clock.advance(50);
  assert.equal(clock.tick(), frozen);
  assert.equal(renders, 1);
});

test("pause, step, resume", () => {
  const clock = createClock();
  clock.pause();
  const alphas: number[] = [];
  clock.onRender((info) => alphas.push(info.alpha));
  for (let i = 0; i < 100; i += 1) clock.advance(100);
  assert.equal(clock.tick(), 0);
  assert.equal(alphas.length, 100);
  assert.ok(alphas.every((a) => a === 0));
  clock.step();
  assert.equal(clock.tick(), 1);
  clock.resume();
  clock.advance(10);
  assert.equal(clock.tick(), 2);
});

test("timers fire on sim time in due order", () => {
  const clock = createClock();
  const order: string[] = [];
  clock.after(30, () => order.push("a"));
  clock.after(10, () => order.push("b"));
  clock.after(10, () => order.push("c"));
  clock.advance(30);
  assert.deepEqual(order, ["b", "c", "a"]);
  let late = false;
  clock.after(30000 - clock.now(), () => { late = true; });
  const gap = 29990 - clock.now();
  for (let i = 0; i < Math.floor(gap / 100); i += 1) clock.advance(100);
  const rem = gap % 100;
  if (rem > 0) clock.advance(rem);
  assert.equal(clock.now(), 29990);
  assert.equal(late, false);
  clock.advance(10);
  assert.equal(clock.now(), 30000);
  assert.equal(late, true);
  let n = 0;
  const timer = clock.after(10, () => { n += 1; });
  timer.cancel();
  timer.cancel();
  clock.advance(20);
  assert.equal(n, 0);
  let zero = 0;
  clock.after(0, () => { zero += 1; });
  assert.equal(zero, 0);
  clock.advance(10);
  assert.equal(zero, 1);
});

test("a throwing subscriber is isolated", () => {
  const clock = createClock();
  const errors: unknown[] = [];
  const seen: string[] = [];
  clock.onError((err) => errors.push(err));
  clock.onTick(() => { throw new Error("tick"); });
  clock.onTick(() => seen.push("next"));
  clock.after(10, () => { throw new Error("timer"); });
  clock.advance(10);
  clock.advance(10);
  assert.deepEqual(seen, ["next", "next"]);
  assert.equal(errors.length, 3);
  assert.ok(errors.some((err) => err instanceof Error && err.message === "timer"));
  assert.ok(errors.filter((err) => err instanceof Error && err.message === "tick").length === 2);
});

test("unsubscribe during a callback is safe", () => {
  const clock = createClock();
  const seen: string[] = [];
  let drop: () => void = () => undefined;
  clock.onTick(() => { seen.push("a"); drop(); });
  drop = clock.onTick(() => seen.push("b"));
  clock.onTick(() => seen.push("c"));
  clock.advance(10);
  clock.advance(10);
  assert.deepEqual(seen, ["a", "c", "a", "c"]);
});

test("render alpha is in [0, 1)", () => {
  const clock = createClock();
  let alpha = -1;
  clock.onRender((info) => { alpha = info.alpha; });
  clock.advance(15);
  assert.equal(alpha, 0.5);
  assert.ok(alpha >= 0 && alpha < 1);
});
