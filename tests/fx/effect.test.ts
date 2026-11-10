import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../src/core/clock/index.ts";
import { BTF_FX_FLIGHT, BTF_FX_PRESET, BTF_FX_READ_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { planEffect, playFx, readFxOrder, type FxCue, type FxOptions, type FxShot } from "../../src/fx/order/index.ts";

const read = (seconds: number[], connect: number, extra: Record<string, unknown> = {}) => {
  const got = readFxOrder(`SKILLRIG v1\n\n${JSON.stringify({ frames: seconds.map((s) => ({ seconds: s })), connect, ...extra })}\n`, BTF_FX_READ_LIMITS);
  if (got.order === null) throw new Error("order");
  return got.order;
};
const two = read([0.3, 0.5], 0.5);
const shot = (over: Partial<FxShot>): FxShot => ({
  spawn: "drop", path: "single", flightTiles: null, from: { c: 0, r: 0 }, bodies: [], land: null, react: "none", impact: false, trail: false, layerDelay: [], ...over,
});
const go = (over: Partial<FxShot> = {}, ord = two, options: FxOptions = BTF_FX_PRESET, flight = BTF_FX_FLIGHT) => planEffect(ord, shot(over), options, flight);
const b = (id: string, c: number, r = 0) => ({ id, at: { c, r } });
const kind = (cues: readonly FxCue[], name: FxCue["kind"]) => cues.filter((cue) => cue.kind === name);
const bodyCues = (cues: readonly FxCue[]) => cues.filter((cue) => cue.kind === "strike" || cue.kind === "impact" || cue.kind === "pull" || cue.kind === "knock");
const hitOf = (cues: readonly FxCue[]) => kind(cues, "strike").map((cue) => cue.kind === "strike" ? [cue.body, cue.at] : []);

test("§A3 + §A8 SKILLRIG.md:77-84, :177, :179, :139-140 — spawn is chosen once, before any step; impact and trail only when set", () => {
  const got = go({ spawn: "beside_caster", bodies: [b("a", 2)], react: "nudge", impact: true });
  assert.deepEqual(got.cues, [
    { kind: "spawn", at: 0, spawn: "beside_caster", trail: false }, { kind: "step", at: 0, index: 0 }, { kind: "step", at: 300, index: 1 }, { kind: "hit", at: 550 },
    { kind: "strike", at: 550, body: "a", react: "nudge" }, { kind: "impact", at: 550, body: "a" },
  ]);
  assert.equal(got.endMs, 800); assert.deepEqual(got.notices, []);
  const bare = go({ trail: true });
  assert.deepEqual(bare.cues[0], { kind: "spawn", at: 0, spawn: "drop", trail: true });
  assert.deepEqual(bare.cues.at(-1), { kind: "strike", at: 550, body: null, react: "none" }); assert.deepEqual(kind(bare.cues, "impact"), []);
});
test("§A10 SKILLRIG.md:112 — a second motion starts late by a fraction of its step, adds no step and does not move the hit", () => {
  const timed = go({ layerDelay: [0.5, 0.25] });
  assert.deepEqual(timed.cues.filter((cue) => cue.kind === "step" || cue.kind === "layer" || cue.kind === "hit"), [
    { kind: "step", at: 0, index: 0 }, { kind: "layer", at: 150, index: 0 }, { kind: "step", at: 300, index: 1 }, { kind: "layer", at: 425, index: 1 }, { kind: "hit", at: 550 },
  ]);
  assert.equal(timed.endMs, 800);
  assert.deepEqual(kind(go({ layerDelay: [null, 0.001] }).cues, "layer"), [{ kind: "layer", at: 301, index: 1 }]);
  for (const layerDelay of [[1.5], [-0.1], [Number.NaN]]) assert.throws(() => go({ layerDelay }), RangeError);
});
test("§A13 SKILLRIG.md:94 + spot 12 — bounce hits the taps in tap order at connect, at most eight; a body is hit once", () => {
  const taps = (ids: string[]) => go({ path: "bounce", bodies: ids.map((id, i) => b(id, 10 - i)) });
  assert.deepEqual(kind(taps(["c", "a", "b", "a"]).cues, "strike"), [
    { kind: "strike", at: 550, body: "c", react: "none" }, { kind: "strike", at: 550, body: "a", react: "none" }, { kind: "strike", at: 550, body: "b", react: "none" },
  ]);
  const ten = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10"];
  const capped = taps(ten);
  assert.deepEqual(hitOf(capped.cues), ten.slice(0, 8).map((id) => [id, 550])); assert.deepEqual(capped.notices.map((n) => n.code), ["fxOverCap"]);
  const nine = taps(["t1", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"]);
  assert.deepEqual(hitOf(nine.cues), ["t1", "t2", "t3", "t4", "t5", "t6", "t7"].map((id) => [id, 550])); assert.equal(nine.notices.length, 1);
});
test("§A14 SKILLRIG.md:91 + spots 8, 9 — free fire passes through near to far; each body is struck when the flight reaches its tile (CEO 2026-11-10)", () => {
  const half = read([0.5], 0.5);
  const line = (n: number, ks: number[], options: FxOptions = BTF_FX_PRESET, flight = BTF_FX_FLIGHT) => go({ path: "pierce", flightTiles: n, bodies: ks.map((k) => b(`d${k}`, k)) }, half, options, flight);
  assert.deepEqual(hitOf(line(4, [3, 1, 4, 2]).cues), [["d1", 350], ["d2", 450], ["d3", 550], ["d4", 650]]);
  assert.deepEqual(hitOf(line(3, [1, 2, 3]).cues), [["d1", 383], ["d2", 517], ["d3", 650]]);
  assert.deepEqual(hitOf(line(4, [2]).cues), [["d2", 450]]); assert.deepEqual(hitOf(line(1, [1]).cues), [["d1", 650]]); assert.equal(line(4, [4]).endMs, 650);
  assert.deepEqual(hitOf(line(4, [1, 4], BTF_FX_PRESET, { totalMs: 250, msPerTile: null }).cues), [["d1", 313], ["d4", 500]]);
  const per = { ...BTF_FX_PRESET, pierce_flight: "per_tile" } as const;
  assert.deepEqual(hitOf(line(3, [1, 2, 3], per, { totalMs: 400, msPerTile: 90 }).cues), [["d1", 340], ["d2", 430], ["d3", 520]]);
  assert.equal(line(3, [3], per, { totalMs: null, msPerTile: 90 }).endMs, 520);
  const connect = { ...BTF_FX_PRESET, pierce_hit_timing: "all_at_connect" } as const;
  assert.deepEqual(kind(line(4, []).cues, "strike"), []); assert.deepEqual(kind(line(4, [], connect).cues, "strike"), []);
  assert.deepEqual(hitOf(line(4, [2, 1], connect).cues), [["d1", 250], ["d2", 250]]);
  assert.throws(() => line(4, [5]), RangeError); assert.throws(() => go({ path: "pierce", flightTiles: null }, half), RangeError);
  assert.throws(() => go({ flightTiles: 2 }, half), RangeError); assert.throws(() => line(3, [1], per, BTF_FX_FLIGHT), RangeError);
});
test("§A8 SKILLRIG.md:179 — every body hit gets its own impact when the shot reaches it (CEO 2026-11-10); once_at_contact gives one", () => {
  const half = read([0.5], 0.5);
  const pierce = { path: "pierce" as const, flightTiles: 4, impact: true, bodies: [b("x", 1), b("y", 2), b("z", 4)] };
  const impacts = (options: FxOptions, over: Partial<FxShot> = pierce) => kind(go(over, half, options).cues, "impact").map((cue) => cue.kind === "impact" ? [cue.body, cue.at] : []);
  assert.deepEqual(impacts(BTF_FX_PRESET), [["x", 350], ["y", 450], ["z", 650]]);
  assert.deepEqual(impacts({ ...BTF_FX_PRESET, impact_burst: "once_at_contact" }), [["x", 350]]);
  assert.deepEqual(impacts(BTF_FX_PRESET, { ...pierce, impact: false }), []);
  for (const impact_burst of ["per_body", "once_at_contact"] as const) {
    const opt = { ...BTF_FX_PRESET, impact_burst };
    assert.deepEqual(bodyCues(go({ impact: true, bodies: [b("a", 1)] }, half, opt).cues), [{ kind: "strike", at: 250, body: "a", react: "none" }, { kind: "impact", at: 250, body: "a" }]);
    assert.deepEqual(bodyCues(go({ impact: true }, half, opt).cues), [{ kind: "strike", at: 250, body: null, react: "none" }, { kind: "impact", at: 250, body: null }]);
  }
});
test("§A15 SKILLRIG.md:98 + spot 10 — chain: hit, then that body's one-tile pull toward the one before it, near to far", () => {
  assert.deepEqual(bodyCues(go({ path: "chain", bodies: [b("q", 3), b("p", 1, 1), b("s", 2, 2)] }).cues), [
    { kind: "strike", at: 550, body: "p", react: "none" }, { kind: "pull", at: 550, body: "p", toward: { c: 0, r: 0 }, all: false },
    { kind: "strike", at: 550, body: "s", react: "none" }, { kind: "pull", at: 550, body: "s", toward: { c: 1, r: 1 }, all: false },
    { kind: "strike", at: 550, body: "q", react: "none" }, { kind: "pull", at: 550, body: "q", toward: { c: 2, r: 2 }, all: false },
  ]);
});
test("§A15 + §A16 SKILLRIG.md:98, :142 + spot 11 — yank pulls the one body all the way, even when the hit is None; Knock 1 only with pull_then_knock1", () => {
  const yank = { path: "yank" as const, bodies: [b("e", 3), b("f", 4)], land: { c: 1, r: 0 } };
  const pulled = [{ kind: "strike", at: 550, body: "e", react: "none" }, { kind: "pull", at: 550, body: "e", toward: { c: 1, r: 0 }, all: true }];
  assert.deepEqual(bodyCues(go({ ...yank, react: "none" }).cues), pulled); assert.deepEqual(bodyCues(go({ ...yank, react: "knock1" }).cues), pulled);
  const knock = { ...BTF_FX_PRESET, reel_knock: "pull_then_knock1" } as const;
  assert.deepEqual(bodyCues(go({ ...yank, react: "knock1" }, two, knock).cues), [...pulled, { kind: "knock", at: 550, body: "e" }]);
  assert.deepEqual(bodyCues(go({ path: "chain", bodies: [b("p", 1)], react: "knock1" }, two, knock).cues), [
    { kind: "strike", at: 550, body: "p", react: "none" }, { kind: "pull", at: 550, body: "p", toward: { c: 0, r: 0 }, all: false }, { kind: "knock", at: 550, body: "p" },
  ]);
  assert.throws(() => go({ path: "yank", land: null }), RangeError); assert.throws(() => go({ land: { c: 1, r: 0 } }), RangeError);
});
test("§A17 SKILLRIG.md:134-137 — the hit kind rides on each strike as given (visual; rules move bodies)", () => {
  for (const react of ["none", "nudge", "knock1", "split"] as const) assert.deepEqual(kind(go({ bodies: [b("a", 1)], react }).cues, "strike"), [{ kind: "strike", at: 550, body: "a", react }]);
});
test("§A18 SKILLRIG.md:38 — loop and speed are preview only; the plan plays on the one clock", () => {
  const over = { bodies: [b("a", 1)], layerDelay: [0.5] };
  assert.deepEqual(go(over, read([0.3, 0.5], 0.5, { speed: 2, loop: true })), go(over));
  const clock = createClock({ stepMs: 10 });
  const seen: [string, number][] = [];
  playFx(clock, go(over), (cue) => seen.push([cue.kind, clock.now()]));
  for (let i = 0; i < 60; i += 1) clock.step();
  assert.deepEqual(seen, [["spawn", 0], ["step", 0], ["layer", 150], ["step", 300], ["hit", 550], ["strike", 550]]);
});
