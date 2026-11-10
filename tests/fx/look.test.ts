import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_FX_LOOK, BTF_FX_READ_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { copyAt, easeAt, lookAt, planLook, readFxOrder } from "../../src/fx/order/index.ts";
const limits = BTF_FX_READ_LIMITS;
const tune = BTF_FX_LOOK;
const block = (frames: unknown[], extra: Record<string, unknown> = {}): string =>
  `SKILLRIG v1\n\n${JSON.stringify({ frames, connect: 0.5, ...extra })}\n`;
const read = (frames: unknown[], extra: Record<string, unknown> = {}) => readFxOrder(block(frames, extra), limits);
const orderOf = (frames: unknown[], extra: Record<string, unknown> = {}) => {
  const got = read(frames, extra).order;
  if (got === null) throw new Error("missing order");
  return got;
};
const unit = (i: number, lane: number): number => {
  const x = Math.sin(i * tune.unitA + lane * tune.unitB) * tune.unitC;
  const part = x % 1;
  return part < 0 ? part + 1 : part;
};
const flat = { ease: "linear" as const, tint: null, scale: null, glow: null, fade: null };
const flatCopy = { index: 0, dc: 0, dr: 0, scale: 1, lag: 0, startMs: 0 };
test("§A9 SKILLRIG.md:176, :110 — look channels ramp across the step with look.ease; a null channel holds the blade", () => {
  assert.equal(easeAt(0.5, "linear", tune), 0.5);
  assert.equal(easeAt(0.5, "out", tune), 0.75);
  assert.equal(easeAt(0.5, "in-out", tune), 0.5);
  assert.notEqual(easeAt(0.5, "out", tune), easeAt(0.5, "linear", tune));
  assert.deepEqual(lookAt(flat, 0.5, tune), { k: 0.5, tint: null, scale: null, glow: null, fade: null });
  const ramped = {
    ease: "out" as const,
    tint: { from: "#111111", to: "#eeeeee" },
    scale: { from: 1, to: 2 },
    glow: { from: 0, to: 10 },
    fade: { from: 0, to: 1 },
  };
  assert.deepEqual(lookAt(ramped, 0.5, tune), { k: 0.75, tint: ramped.tint, scale: 1.75, glow: 7.5, fade: 0.75 });
  const styled = orderOf([{ kind: "straight", seconds: 0.5, look: { ease: "out", scale: { from: 1, to: 2 } } }]);
  assert.equal(styled.styles[0]?.release, "together");
  assert.deepEqual(styled.styles[0]?.look, { ease: "out", tint: null, scale: { from: 1, to: 2 }, glow: null, fade: null });
  const bare = orderOf([{ kind: "straight", seconds: 0.5 }]);
  assert.deepEqual(bare.styles[0]?.look, flat);
  assert.deepEqual(planLook(bare, tune).notices, []);
});
test("§A11 SKILLRIG.md:101-106 — release is together or split on a later straight, swerve or bounce; they leave together in time", () => {
  const orbit = { kind: "orbit", seconds: 0.4, release: "split", motion: { count: 4 } };
  const opened = planLook(orderOf([orbit, { kind: "straight", seconds: 0.5, release: "split", motion: { lock: "target" } }]), tune);
  assert.equal(opened.steps[0]?.release, "together");
  assert.equal(opened.steps[0]?.copies.length, 4);
  assert.equal(opened.steps[1]?.release, "split");
  assert.equal(opened.steps[1]?.copies.length, 4);
  assert.ok(opened.steps[1]?.copies.every((copy) => copy.startMs === 400));
  const first = planLook(orderOf([{ kind: "straight", seconds: 0.5, release: "split", motion: { lock: "target" } }]), tune);
  assert.equal(first.steps[0]?.release, "together");
  assert.equal(first.steps[0]?.copies.length, 1);
  const chain = planLook(orderOf([
    orbit,
    { kind: "swerve", seconds: 0.5, release: "together" },
    { kind: "bounce", seconds: 0.5, release: "split" },
    { kind: "reel", seconds: 0.3, release: "split" },
  ]), tune);
  assert.equal(chain.steps[1]?.release, "together");
  assert.equal(chain.steps[1]?.copies.length, 4);
  assert.equal(chain.steps[2]?.release, "split");
  assert.equal(chain.steps[2]?.copies.length, 4);
  assert.equal(chain.steps[3]?.release, "together");
  assert.equal(chain.steps[3]?.copies.length, 1);
});
test("§A12 SKILLRIG.md:116, :176 — copies on a row, spin or free-fire may jitter, start late and vary in size, yet arrive together; the same numbers every play", () => {
  const spread = { jitter: 0.4, delay: 0.5, scale: 0.2 };
  const row = [{ kind: "row", seconds: 0.5, spread, motion: { count: 3 } }];
  const first = planLook(orderOf(row), tune);
  assert.deepEqual(first, planLook(orderOf(row), tune));
  const copies = first.steps[0]?.copies ?? [];
  assert.equal(copies.length, 3);
  assert.notDeepEqual(copies[0], copies[1]);
  assert.notDeepEqual(copies[1], copies[2]);
  for (const copy of copies) {
    const pose = copyAt(spread, copy.index, 1, tune);
    assert.equal(pose.u, 1);
    assert.equal(pose.hidden, false);
    assert.equal(pose.dc, (unit(copy.index, 0) * 2 - 1) * 0.4);
    assert.equal(pose.dr, (unit(copy.index, 1) * 2 - 1) * 0.4);
    assert.equal(copy.startMs, Math.round(copy.lag * 500));
  }
  assert.deepEqual(planLook(orderOf([{ kind: "straight", seconds: 0.5, spread, motion: { lock: "target" } }]), tune).steps[0]?.copies, [flatCopy]);
  const free = { kind: "straight", seconds: 0.5, motion: { lock: "free" }, spread: { jitter: 0, delay: 0, scale: 0 } };
  assert.deepEqual(planLook(orderOf([free]), tune).steps[0]?.copies, [flatCopy]);
  const late = { ...free, spread: { jitter: 0, delay: 0.001 / unit(0, 2), scale: 0 } };
  assert.equal(planLook(orderOf([late]), tune).steps[0]?.copies[0]?.startMs, 1);
  const filled = planLook(orderOf([{ kind: "row", seconds: 0.5 }]), tune);
  assert.equal(filled.steps[0]?.copies.length, 6);
  assert.deepEqual(filled.notices.map((n) => n.code), ["fxFilled"]);
  const clamped = planLook(orderOf([{
    kind: "row", seconds: 0.5, spread: { jitter: 2, delay: 1, scale: 2 }, look: { scale: { from: 9, to: 9 } }, motion: { count: 9 },
  }]), tune);
  assert.equal(clamped.steps[0]?.copies.length, 8);
  assert.deepEqual(clamped.steps[0]?.look.scale, { from: 2.6, to: 2.6 });
  assert.deepEqual(clamped.notices.map((n) => n.code), ["fxClamped", "fxClamped", "fxClamped"]);
});
test("§A12 + §A6 — a later free-fire keeps the spin's copies and spread; motion.kind is read; loop and speed change nothing; bad tune throws", () => {
  const shot = planLook(orderOf([
    { kind: "orbit", seconds: 0.4, motion: { count: 4 } },
    { kind: "straight", seconds: 0.5, motion: { lock: "free" }, spread: { jitter: 0.2, delay: 0.25, scale: 0.1 } },
  ], { speed: 2, loop: true }), tune);
  assert.equal(shot.steps[1]?.copies.length, 4);
  assert.equal(shot.steps[1]?.release, "together");
  assert.equal(shot.endMs, 900);
  assert.ok(shot.steps[1]?.copies.some((copy) => copy.lag > 0));
  const reel = readFxOrder(`SKILLRIG v1\n\n${JSON.stringify({ frames: [{ motion: { kind: "reel" }, seconds: 0.3 }] })}\n`, limits);
  assert.equal(reel.order?.steps[0]?.kind, "reel");
  assert.equal(reel.order?.connect, 0.42);
  const sample = orderOf([{ kind: "straight", seconds: 0.5 }]);
  const bad = { name: "RangeError", message: "planLook: tune out of range" };
  assert.throws(() => planLook(sample, { ...tune, delayMax: 2 }), bad);
  assert.throws(() => planLook(sample, { ...tune, fillCount: 1 }), bad);
});
