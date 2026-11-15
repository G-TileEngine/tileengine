import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock, type Clock, type SkipResult } from "../../src/core/clock/index.ts";

const H = 3_600_000, gone = (r: SkipResult): string => ("notice" in r ? `${r.remainderMs}!${r.notice?.code}:${r.notice?.message}` : `${r.remainderMs}`);
const drain = (k: Clock, ms: number): string[] => { const out: string[] = []; let left = ms; do { const r = k.skip(left); out.push(gone(r)); left = r.remainderMs; } while (left > 0 && out.length < 20); return out; };

test("G4 R1 skip cap: 8 h of sim per call by default; the remainder comes back with a skipCapped notice, an uncapped call has none", () => {
  const k = createClock(); assert.equal(k.maxSkipMs, 8 * H);
  assert.deepEqual(drain(k, 30 * H), [`${22 * H}!skipCapped:{"capMs":28800000,"remainderMs":79200000}`, `${14 * H}!skipCapped:{"capMs":28800000,"remainderMs":50400000}`, `${6 * H}!skipCapped:{"capMs":28800000,"remainderMs":21600000}`, "0"]);
  assert.equal(k.now(), 30 * H);
  const edge = createClock(); assert.equal(gone(edge.skip(8 * H)), "0"); assert.equal(gone(edge.skip(8 * H + 10)), `10!skipCapped:{"capMs":28800000,"remainderMs":10}`); assert.equal(edge.now(), 16 * H);
  const short = createClock(); assert.equal(gone(short.skip(9)), "0"); assert.equal(short.now(), 0);
});

test("G4 R1 skip cap setting: an integer 1 to 86400000 is the cap; anything else gives the 8 h default", () => {
  const cap = (v: unknown): number => createClock({ maxSkipMs: v as number }).maxSkipMs;
  assert.deepEqual([H, 86_400_000, 1, 86_400_001, 0, -H, 1.5, "3600000", null, Infinity, NaN].map(cap), [H, 86_400_000, 1, 8 * H, 8 * H, 8 * H, 8 * H, 8 * H, 8 * H, 8 * H, 8 * H]);
  const k = createClock({ maxSkipMs: H }); assert.equal(gone(k.skip(2 * H + 7)), `3600007!skipCapped:{"capMs":3600000,"remainderMs":3600007}`); assert.equal(k.now(), H);
  const day = createClock({ maxSkipMs: 86_400_000 }); assert.equal(gone(day.skip(30 * H)), `${6 * H}!skipCapped:{"capMs":86400000,"remainderMs":21600000}`); assert.equal(day.now(), 24 * H);
  const tiny = createClock({ maxSkipMs: 5 }); assert.equal(gone(tiny.skip(25)), `15!skipCapped:{"capMs":5,"remainderMs":15}`); assert.equal(tiny.now(), 10); // a cap under one step still runs one step
});

test("G4 R1 skip cap is sim time: timeScale 2 and 0.5 convert the cap and give the remainder back in host ms", () => {
  const fast = createClock({ timeScale: 2 }); assert.equal(fast.skip(10 * H).remainderMs, 6 * H); assert.equal(fast.now(), 8 * H);
  const slow = createClock({ timeScale: 0.5 }); assert.equal(slow.skip(20 * H).remainderMs, 4 * H); assert.equal(slow.now(), 8 * H);
  const still = createClock({ timeScale: 0 }); assert.equal(gone(still.skip(30 * H)), "0"); assert.equal(still.now(), 0);
});

test("G4 R1 skip keeps the sub-tick remainder: skip then advance lands where advance alone would, at timeScale 1 and 1.5", () => {
  const trace = (scale: number, run: (k: Clock) => void): string => { const k = createClock({ timeScale: scale }), seen: string[] = []; k.after(30, () => seen.push(`t${k.tick()}`)); k.onRender((r) => seen.push(`a${r.alpha}`)); run(k); return `${k.tick()} ${seen.join(",")}`; };
  for (const scale of [1, 1.5]) for (const [a, b] of [[25, 25], [5, 45], [7, 3], [1, 99]] as const) {
    assert.equal(trace(scale, (k) => { k.skip(a); k.advance(b); }).split(" ")[0], trace(scale, (k) => k.advance(a + b)).split(" ")[0], `${scale} ${a}+${b}`);
  }
  const k = createClock(); k.skip(25); assert.equal(k.tick(), 2); k.advance(5); assert.equal(k.tick(), 3);
  const carry = createClock(); carry.advance(5); carry.skip(5); assert.equal(carry.tick(), 1);
  const third = createClock({ timeScale: 1.5 }); third.skip(5); third.skip(5); assert.equal(third.tick(), 1);
});

test("G4 R1 a capped skip loses no time: the chain of remainders ends where one big skip ends, sub-ms parts kept", () => {
  const odd = createClock({ stepMs: 3, timeScale: 1.75, maxSkipMs: 1000 }); assert.equal(odd.skip(5000).remainderMs, 4430); assert.equal(odd.tick(), 332); // host ms worth the cap round down: never over 333 ticks
  for (const [stepMs, scale, cap, ms] of [[10, 1.5, H, 5_000_007], [10, 0.25, 25, 5_000_007], [1, 8, 1, 1007], [3, 1.75, 1000, 5_000_007]] as const) {
    const a = createClock({ stepMs, timeScale: scale, maxSkipMs: cap }), b = createClock({ stepMs, timeScale: scale, maxSkipMs: 86_400_000 });
    let left: number = ms, calls = 0; while (left > 0 && calls < 1_000_000) { left = a.skip(left).remainderMs; calls += 1; }
    b.skip(ms); assert.equal(a.tick(), b.tick(), `${stepMs} ${scale} ${cap}`);
    a.advance(99); b.advance(99); assert.equal(a.tick(), b.tick(), `${stepMs} ${scale} ${cap} carry`);
  }
});

test("G4 R1 a capped skip: render gets the host ms it ran (alpha at most 1); paused or inside a tick runs nothing and returns 0", () => {
  const k = createClock({ maxSkipMs: 1000 }), dts: number[] = [], alphas: number[] = []; k.onRender((r) => { dts.push(r.dtMs); alphas.push(r.alpha); });
  k.skip(2500); k.skip(600); assert.deepEqual(dts, [1000, 600]);
  const odd = createClock({ stepMs: 1, timeScale: 8, maxSkipMs: 1 }); odd.onRender((r) => alphas.push(r.alpha)); assert.equal(odd.skip(10).remainderMs, 9); assert.equal(odd.tick(), 8); assert.ok(alphas.every((a) => a >= 0 && a <= 1));
  const held = createClock({ maxSkipMs: 1000 }); held.pause(); assert.equal(gone(held.skip(5000)), "0"); assert.equal(held.now(), 0);
  const inner = createClock({ maxSkipMs: 1000 }), got: string[] = [], errs: unknown[] = []; inner.onError((e) => errs.push(e));
  const off = inner.onTick(() => { off(); got.push(gone(inner.skip(5000))); }); inner.step(); assert.deepEqual([got, errs.length, inner.tick()], [["0"], 1, 1]);
});

test("G4 R1 the cap holds on the per-tick path (a tick subscriber) and timers fire in order through a capped skip", () => {
  const k = createClock({ maxSkipMs: 1000 }), ticks: number[] = [], fired: string[] = []; k.onTick((t) => ticks.push(t.tick));
  k.after(1500, () => fired.push(`b${k.now()}`)); k.after(400, () => fired.push(`a${k.now()}`));
  assert.equal(k.skip(2500).remainderMs, 1500); assert.deepEqual([ticks.length, ticks.at(-1), fired], [100, 100, ["a400"]]);
  assert.equal(k.skip(1500).remainderMs, 500); assert.deepEqual(fired, ["a400", "b1500"]); assert.equal(k.skip(500).remainderMs, 0); assert.equal(k.now(), 2500);
  const jump = createClock({ maxSkipMs: 1000 }), seen: number[] = []; jump.after(1500, () => seen.push(jump.now())); assert.equal(jump.skip(2500).remainderMs, 1500); assert.deepEqual(seen, []); jump.skip(1500); assert.deepEqual(seen, [1500]);
});
