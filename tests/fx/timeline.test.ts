import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_FX_READ_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { createClock } from "../../src/core/clock/index.ts";
import { planFx, playFx, readFxOrder, type FxCue } from "../../src/fx/order/index.ts";

const plan = (seconds: number[], connect: number) => {
  const read = readFxOrder(`SKILLRIG v1\n\n${JSON.stringify({ frames: seconds.map((seconds) => ({ seconds })), connect })}\n`, BTF_FX_READ_LIMITS);
  if (read.order === null) throw new Error("order");
  return planFx(read.order);
};
const seenAt = (cue: FxCue, now: number): [string, number, number] => [cue.kind, cue.at, now];
test("§A4 + §A5 + §A6 SKILLRIG.md:176, :126, :178 — steps back to back; the hit lands at start(last) + connect × ms(last)", () => {
  const timed = plan([0.3, 0.5, 0.6], 0.92);
  assert.deepEqual(timed.cues, [
    { kind: "step", at: 0, index: 0 }, { kind: "step", at: 300, index: 1 }, { kind: "step", at: 800, index: 2 }, { kind: "hit", at: 1352 },
  ]);
  assert.equal(timed.endMs, 1400);
  assert.equal(plan([0.48], 0.42).cues.at(-1)?.at, 202);
  assert.equal(plan([1], 1).cues.at(-1)?.at, 1000);
  const half = plan([0.2505], 1);
  assert.deepEqual(half.cues, [{ kind: "step", at: 0, index: 0 }, { kind: "hit", at: 251 }]);
  assert.equal(half.endMs, 251);
});
test("CN-001 + law 1 — a plan plays on the one clock in sim ms, and cancel stops what is left", () => {
  const clock = createClock({ stepMs: 10 });
  const seen: [string, number, number][] = [];
  playFx(clock, plan([0.3, 0.5], 0.5), (cue) => seen.push(seenAt(cue, clock.now())));
  assert.deepEqual(seen, [["step", 0, 0]]);
  for (let i = 0; i < 60; i += 1) clock.step();
  assert.deepEqual(seen, [["step", 0, 0], ["step", 300, 300], ["hit", 550, 550]]);
  const later = createClock({ stepMs: 10 });
  const left: number[] = [];
  const stop = playFx(later, plan([0.3, 0.5], 0.5), (cue) => left.push(cue.at));
  for (let i = 0; i < 20; i += 1) later.step();
  stop();
  for (let i = 0; i < 60; i += 1) later.step();
  assert.deepEqual(left, [0]);
});
