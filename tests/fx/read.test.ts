import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_FX_READ_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { readFxOrder } from "../../src/fx/order/index.ts";

const limits = BTF_FX_READ_LIMITS;
const block = (paragraph: string, json: unknown): string => `SKILLRIG v1\n${paragraph}\n${JSON.stringify(json)}\n`;
const read = (text: string, caps = limits) => readFxOrder(text, caps);
const codes = (text: string, caps = limits): string[] => read(text, caps).notices.map((n) => n.code);

test("§A1 SKILLRIG.md:161, :163 — the JSON wins over the paragraph; the read is first { to last }", () => {
  const json = { frames: [{ kind: "straight", seconds: 0.5 }], connect: 0.5 };
  assert.equal(read(block("{not json", json)).order, null);
  const got = read(block("Three steps of 2 s each.", json));
  assert.deepEqual(got.order?.steps, [{ kind: "straight", ms: 500 }]);
  assert.deepEqual(got.notices, []);
});
test("§A2 SKILLRIG.md:163 — a bad block is ignored with a notice; every clamp and fill-in is a notice (X14)", () => {
  for (const text of ["no json here", "{ nope }", "SKILLRIG v1\n[1, 2]", block("p", {}), block("p", { frames: [] })]) {
    assert.equal(read(text).order, null);
    assert.deepEqual(codes(text), ["fxBadBlock"]);
  }
  const clamped = { frames: [{ seconds: 0.05 }, { seconds: 9 }, {}], connect: 4, damage: "x" };
  const got = read(block("p", clamped)).order;
  assert.deepEqual(got?.steps.map((s) => s.ms), [200, 3000, 480]);
  assert.equal(got?.connect, 1);
  assert.deepEqual(codes(block("p", clamped)), ["fxClamped", "fxClamped", "fxFilled", "fxClamped", "fxNotNumber"]);
  assert.deepEqual(read(block("p", { frames: [1], connect: 0.5 })).order?.steps, [{ kind: null, ms: 480 }]);
  assert.equal(read(block("p", { frames: [{ seconds: 0.5 }], connect: 0 })).order?.connect, 0.02);
});
test("§A4 SKILLRIG.md:176, :36 — steps keep list order; six play, 7+ are kept inactive with a notice", () => {
  const frames = ["k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8"].map((kind, i) => ({ kind, seconds: i < 6 ? 0.3 : i === 6 ? 0.9 : 1 }));
  const got = read(block("p", { frames, connect: 0.5 })).order;
  assert.deepEqual(got?.steps.map((s) => s.kind), ["k1", "k2", "k3", "k4", "k5", "k6"]);
  assert.deepEqual(got?.inactive.map((s) => [s.kind, s.ms]), [["k7", 900], ["k8", 1000]]);
  assert.deepEqual(codes(block("p", { frames, connect: 0.5 })), ["fxOverCap"]);
});
test("§A6 SKILLRIG.md:178, :165 — a missing connect is 0.92, or 0.42 when the last step is a reel, each with a notice", () => {
  const body = (kinds: string[]) => block("p", { frames: kinds.map((kind) => ({ kind, seconds: 0.3 })) });
  assert.equal(read(body(["reel", "straight"])).order?.connect, 0.92);
  assert.equal(read(body(["straight", "reel"])).order?.connect, 0.42);
  assert.deepEqual([...codes(body(["reel", "straight"])), ...codes(body(["straight", "reel"]))], ["fxFilled", "fxFilled"]);
});
test("§A7 SKILLRIG.md:178, :27 — damage null or absent stays null (no number invented); a number passes through", () => {
  const frame = { frames: [{ kind: "straight", seconds: 0.3 }], connect: 0.5 };
  assert.equal(read(block("p", { ...frame, damage: null })).order?.damage, null);
  assert.equal(read(block("p", frame)).order?.damage, null);
  assert.equal(read(block("p", { ...frame, damage: 3 })).order?.damage, 3);
  assert.deepEqual(read(block("p", { ...frame, look: { ease: "linear" } })).order?.raw.look, { ease: "linear" });
  assert.deepEqual(codes(block("p", { ...frame, damage: 3 })), []);
});
test("read limits are the caller's input: other limits change clamps and fill-ins; bad limits throw", () => {
  const caps = { minStepMs: 150, fillStepMs: 300, minConnect: 0.1, maxConnect: 0.9 };
  const got = read(block("p", { frames: [{ seconds: 0.15 }, { seconds: 0.05 }, {}], connect: 0.95 }), caps).order;
  assert.deepEqual(got?.steps.map((s) => s.ms), [150, 150, 300]);
  assert.equal(got?.connect, 0.9);
  for (const bad of [
    { ...limits, minStepMs: 0 }, { ...limits, fillStepMs: 100 }, { ...limits, fillStepMs: 3001 },
    { ...limits, minConnect: 0.95, maxConnect: 0.5 }, { ...limits, maxConnect: 2 }, { ...limits, minConnect: Number.NaN },
  ]) assert.throws(() => readFxOrder("x", bad), RangeError);
});
