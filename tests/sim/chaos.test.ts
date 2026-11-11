import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { BTF_FX_PRESET } from "../../src/btf-adapters/src/index.ts";
import { CHAOS_CHECKS, replayChaos, runChaos, type ChaosCheck, type ChaosOptions, type ChaosView, type SimSnapshot } from "../../src/sim/index.ts";
import type { Intent } from "../../src/runtime/input/index.ts";
import { bot, reachFarRow, seedless } from "./ai.ts";
import { input } from "./input.ts";
const hash = (text: string): string => createHash("sha256").update(text).digest("hex");
const tools = { victory: reachFarRow, checks: CHAOS_CHECKS, hash, engineSha: "1ff51d984744c254321d4014afc045ce77a761a2", node: "v24.22.1" };
const opts = { ...tools, ruleset: "reachFarRow", sides: ["player", "wolves"] as const, fuse: 60000, maxRounds: 40, maxSimMs: 600000, moveMs: 200, idPrefix: "m", presets: { fxOptions: BTF_FX_PRESET } };
const cell = (c: number, r: number): Intent => ({ type: "TargetCell", at: { c, r } }), sel = (unitId: string): Intent => ({ type: "SelectUnit", unitId });
const round = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const planted = (): ChaosOptions["intents"] => { let once = false; return (_w, side) => (side !== "player" || once ? [] : (once = true, ([sel("knight#1"), cell(0, 7), { type: "Cancel" }, sel("knight#1"), cell(0, 6)] as Intent[]).map((intent) => ({ intent })))); };
test("a clean run goes only through the player driver, checks every step and replays identically from its JSON", () => {
  const src = seedless(input("stage-fixed", 3));
  const go = (intents: ChaosOptions["intents"]) => runChaos(src, { ...opts, intents });
  const result = go(bot(3));
  const run = result.run;
  assert.equal(result.outcome === "win" && result.failure === null && run.moves.length === 76 && result.hashes.length === 76 && result.rejects.length === 0 && run.seed === 3, true);
  assert.deepEqual(Object.keys(run), ["seed", "ruleset", "options", "moves", "engineSha", "node", "engineVersion", "projectHash"]);
  assert.deepEqual(run.options.checks, ["(a)5", "(a)12", "(a)9", "(a)6", "(a)2", "(a)1"]);
  assert.deepEqual(run.moves[0], { call: 0, side: "player", tick: 0, intent: { type: "SelectUnit", unitId: "knight#1" }, aim: null });
  assert.deepEqual(replayChaos(src, round(run), tools), result);
  const msg = /chaos: record is for 1ff51d984744c254321d4014afc045ce77a761a2 on Node v24\.22\.1/;
  assert.throws(() => replayChaos(src, run, { ...tools, engineSha: "other" }), msg); assert.throws(() => replayChaos(src, run, { ...tools, node: "other" }), msg);
  assert.throws(() => replayChaos(src, run, { ...tools, checks: CHAOS_CHECKS.slice(1) }), /chaos: checks differ from the record/);
  assert.throws(() => replayChaos({ ...src, projectHash: "other" }, run, tools), /chaos: project differs from the record/);
  assert.throws(() => runChaos(src, { ...opts, engineSha: "", intents: () => [] }), RangeError); assert.throws(() => runChaos(src, { ...opts, node: "", intents: () => [] }), RangeError);
  assert.throws(() => replayChaos(src, run, { ...tools, engineSha: "" }), RangeError); assert.throws(() => replayChaos(src, run, { ...tools, node: "" }), RangeError);
  const ai = bot(3);
  let first = true;
  const stalled = go((w, s, b) => { if (first) { first = false; return []; } return ai(w, s, b); });
  assert.equal(stalled.run.moves[0]?.call, 1); assert.deepEqual(replayChaos(src, round(stalled.run), tools), stalled);
  assert.throws(() => replayChaos(src, { ...run, moves: run.moves.map((m, i) => i === 0 ? { ...m, side: "wolves" } : m) }, tools), /chaos: replay diverged at call 0/);
});
test("a broken promise stops the match with one record in the outline §4 shape; the record replays the same failure; a change outside the door fails the end replay (a)4", () => {
  const src = input("stage-fixed");
  const promise: ChaosCheck = { id: "planted:knight-stays-low", run: (v) => { const k = v.after.units.find((u) => u.id === "knight#1"); return k !== undefined && k.at.r < 7 ? { key: "units", expected: "knight#1 on row 7 or 8", actual: k.at } : null; } };
  const result = runChaos(src, { ...opts, fuse: 1000, checks: [...CHAOS_CHECKS, promise], intents: planted() });
  const failure = result.failure;
  if (failure === null) throw new Error("expected failure");
  assert.equal(result.outcome, "failed");
  assert.deepEqual(Object.keys(failure), ["seed", "ruleset", "options", "moves", "engineSha", "node", "engineVersion", "projectHash", "stepIndex", "invariant", "firstDivergentSnapshotKey", "expected", "actual", "tick", "clockMs", "snapshotHash"]);
  assert.equal(failure.seed === 24301 && failure.stepIndex === 4 && failure.moves.length === 5 && failure.invariant === "planted:knight-stays-low" && failure.firstDivergentSnapshotKey === "units" && failure.expected === "knight#1 on row 7 or 8" && failure.tick === 40 && failure.clockMs === 400 && failure.snapshotHash === result.hashes.at(-1), true);
  assert.deepEqual(failure.moves.map((m) => m.tick), [0, 0, 20, 20, 20]);
  assert.deepEqual(failure.actual, { c: 0, r: 6 });
  assert.deepEqual(result.rejects, [2]);
  assert.deepEqual(failure.options.presets, round({ fxOptions: BTF_FX_PRESET }));
  const body = round(failure), again = { ...tools, checks: [...CHAOS_CHECKS, promise] };
  assert.deepEqual(replayChaos(src, body, again).failure, failure);
  assert.deepEqual(replayChaos(src, body, again).failure, failure);
  assert.throws(() => replayChaos(src, { ...failure, seed: 7 }, again), /chaos: world seed 24301 is not the record seed 7/);
  assert.equal(runChaos(src, { ...opts, fuse: 1000, maxRounds: 1, intents: planted() }).failure, null);
  const base = planted();
  let moved = false;
  const outside = runChaos(src, { ...opts, fuse: 1000, maxRounds: 1, intents: (w, side, b) => { if (side === "wolves" && !moved) { moved = true; w.units.moveTo("wolf#3", { c: 2, r: 1 }); } return base(w, side, b); } });
  assert.equal(outside.outcome === "failed" && outside.failure?.invariant === "(a)4" && outside.failure.stepIndex === 5 && outside.failure.firstDivergentSnapshotKey === "units", true);
  assert.equal(replayChaos(src, outside.run, tools).failure, null);
});
test("each QA (a) check passes a clean step and flags its planted fault with the key it names", () => {
  const views: ChaosView[] = [];
  runChaos(input("stage-fixed"), { ...opts, fuse: 1000, maxRounds: 1, checks: [{ id: "spy", run: (v) => { views.push(v); return null; } }], intents: planted() });
  for (const v of views) for (const c of CHAOS_CHECKS) assert.equal(c.run(v), null);
  const move = views[1], rej = views[2];
  if (move === undefined || rej === undefined) throw new Error("steps");
  const put = (base: ChaosView, part: "before" | "fed" | "after", snap: Partial<SimSnapshot>): ChaosView => ({ ...base, [part]: { ...base[part], ...snap } });
  const unit = (units: SimSnapshot["units"], id: string, c: number): SimSnapshot["units"] => units.map((u) => u.id === id ? { ...u, at: { c, r: u.at.r } } : u);
  const hit = (v: ChaosView): string => { for (const c of CHAOS_CHECKS) { const f = c.run(v); if (f !== null) return `${c.id} ${f.key}`; } return ""; };
  const stepMs = move.world.clock.stepMs;
  assert.deepEqual([
    hit(put(move, "after", { clockMs: move.after.clockMs + 1 })),
    hit(put(move, "fed", { tick: move.fed.tick + 1, clockMs: move.fed.clockMs + stepMs })),
    hit({ ...move, fed: { ...move.fed, logSeq: 2 }, after: { ...move.after, logSeq: 2 } }),
    hit(put(move, "before", { logSeq: 1 })),
    hit(put(rej, "after", { phases: { battle: "moving" } })),
    hit(put(move, "after", { units: unit(move.after.units, "archer#2", 2) })),
    hit(put(move, "before", { units: unit(move.before.units, "archer#2", 2) })),
    hit(put(move, "fed", { phases: { battle: "idle" } })),
    hit(put(move, "after", { units: unit(move.after.units, "knight#1", -1) })),
    hit(put(move, "after", { occupancy: move.after.occupancy.map(([i, ids]) => [ids.includes("knight#1") ? i + 2 : i, ids] as [number, readonly string[]]) })),
  ], ["(a)5 clockMs", "(a)5 tick", "(a)12 logSeq", "(a)12 logSeq", "(a)9 phases", "(a)9 units", "(a)9 units", "(a)6 phases", "(a)2 units", "(a)1 occupancy"]);
});
test("chaos smoke, report-only (CEO Q6/Q7): both official boards, seeds 1-50, BTF defaults; a failure is printed and must replay, never asserted away", (t) => {
  for (const [stage, sides] of [["stage-fixed", ["player", "wolves"]], ["stage-weighted", ["player", "rival"]]] as const) {
    let failed = 0, steps = 0, rejects = 0;
    for (let seed = 1; seed <= 50; seed += 1) {
      const src = seedless(input(stage, seed));
      const live = { ...tools, node: process.version };
      const result = runChaos(src, { ...opts, ...live, sides: [...sides], intents: bot(seed) });
      assert.equal(result.hashes.length, result.run.moves.length);
      steps += result.run.moves.length; rejects += result.rejects.length;
      if (result.failure !== null) { failed += 1; t.diagnostic(JSON.stringify(result.failure)); assert.deepEqual(replayChaos(src, round(result.run), live).failure, result.failure); }
    }
    t.diagnostic(`chaos smoke ${stage} seeds 1-50: runs 50 failed ${failed} steps ${steps} rejects ${rejects}`);
  }
});
