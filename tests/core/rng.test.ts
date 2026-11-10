import { test } from "node:test";
import assert from "node:assert/strict";
import { createRng, restoreRng, streamSeed } from "../../src/core/rng/index.ts";

test("golden next() vector for seed 0x5eed", () => {
  const r = createRng(0x5eed);
  const got = [r.next(), r.next(), r.next(), r.next(), r.next()];
  assert.deepEqual(got, [0.7100320369936526, 0.286336648510769, 0.9519026265479624, 0.10175976227037609, 0.3784139291383326]);
  assert.deepEqual(r.state(), { a: 567918774 });
});

test("golden int(6) vector", () => {
  const r = createRng(0x5eed);
  assert.deepEqual(Array.from({ length: 8 }, () => r.int(6)), [4, 1, 5, 0, 2, 3, 1, 1]);
});

test("same seed, same sequence", () => {
  const take = (seed: number, n: number): number[] => {
    const r = createRng(seed);
    return Array.from({ length: n }, () => r.next());
  };
  const a = take(42, 1000);
  assert.deepEqual(a, take(42, 1000));
  assert.notDeepEqual(a.slice(0, 3), take(43, 3));
  assert.equal(createRng(-1).next(), restoreRng({ a: -1 >>> 0 }).next());
  assert.equal(createRng(1.9).next(), restoreRng({ a: 1.9 >>> 0 }).next());
});

test("restore continues identically", () => {
  const r = createRng(0x5eed);
  for (let i = 0; i < 17; i += 1) r.next();
  const saved = r.state();
  const more = Array.from({ length: 100 }, () => r.next());
  const again = (state: { a: number }): number[] => {
    const restored = restoreRng(state);
    return Array.from({ length: 100 }, () => restored.next());
  };
  assert.deepEqual(again(saved), more);
  assert.deepEqual(again(JSON.parse(JSON.stringify(saved)) as { a: number }), more);
});

test("int stays in range", () => {
  const r = createRng(1);
  const seen = new Set<number>();
  for (let i = 0; i < 10000; i += 1) {
    const n = r.int(7);
    assert.equal(Number.isInteger(n), true);
    assert.equal(n >= 0 && n <= 6, true);
    seen.add(n);
  }
  assert.equal(seen.size, 7);
});

test("int and pick reject bad input", () => {
  const r = createRng(1);
  const before = r.state();
  for (const bad of [0, 2.5, Number.NaN]) assert.throws(() => r.int(bad), RangeError);
  assert.throws(() => r.pick([]), RangeError);
  assert.deepEqual(r.state(), before);
});

test("weighted never picks a zero weight", () => {
  const r = createRng(1);
  const counts = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 10000; i += 1) {
    const index = r.weighted([0, 3, 0, 1, -2, Number.NaN]);
    const n = counts[index];
    if (n === undefined) throw new Error(`index ${index}`);
    counts[index] = n + 1;
  }
  assert.deepEqual(counts, [0, 7528, 0, 2472, 0, 0]);
});

test("weighted with no positive weight returns -1 and draws nothing", () => {
  const r = createRng(7);
  const before = r.state();
  assert.equal(r.weighted([0, -1]), -1);
  assert.equal(r.weighted([]), -1);
  assert.deepEqual(r.state(), before);
});

test("streams are stable and independent", () => {
  assert.equal(streamSeed(0x5eed, "pool"), 605237462);
  assert.equal(streamSeed(0x5eed, "ai"), 2641247654);
  assert.equal(streamSeed(0, ""), 2166136261);
  const pool = createRng(streamSeed(0x5eed, "pool"));
  const twin = createRng(streamSeed(0x5eed, "pool"));
  const ai = createRng(streamSeed(0x5eed, "ai"));
  ai.next();
  ai.int(4);
  ai.pick([1, 2, 3]);
  assert.equal(pool.next(), twin.next());
});

test("no global patching", () => {
  const original = Math.random;
  const r = createRng(1);
  r.next();
  r.int(3);
  r.pick([1, 2]);
  r.weighted([1, 2]);
  assert.equal(Math.random, original);
});
