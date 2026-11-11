import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { BTF_FX_PRESET } from "../../src/btf-adapters/src/index.ts";
import { createGestureMapper, type Intent } from "../../src/runtime/input/index.ts";
import { CHAOS_CHECKS, CHAOS_KINDS, chaosIntents, createWorld, gestureRecipes, replayChaos, runChaos, runChaosGen, shrinkChaos, type ChaosCheck, type ChaosGen, type ChaosKind, type ChaosMix, type ChaosRecord, type ChaosView } from "../../src/sim/index.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { forward, reachFarRow, seedless } from "./ai.ts";
import { input } from "./input.ts";
import { asIntents } from "./seats.ts";
const hash = (text: string): string => createHash("sha256").update(text).digest("hex");
const round = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const need = (value: ChaosRecord | null): ChaosRecord => { if (value === null) throw new Error("missing"); return value; };
const tools = { victory: reachFarRow, checks: CHAOS_CHECKS, hash, engineSha: "9dad92a589ec53d71aa1564916a43dcd439e883d", node: "v24.22.1" };
const opts = { ...tools, ruleset: "reachFarRow", sides: ["player", "wolves"] as const, fuse: 60000, maxRounds: 40, maxSimMs: 600000, moveMs: 200, idPrefix: "m", presets: { fxOptions: BTF_FX_PRESET } };
const G = { cellPx: 64, tapMaxPx: 10, holdMs: 500 };
const ALL = Object.fromEntries(CHAOS_KINDS.map((kind) => [kind, 1])) as ChaosMix;
const gen: ChaosGen = { stream: "chaos", mix: ALL, burst: 3, gestures: G };
const idle = (): readonly [] => [];
const only = (kind: ChaosKind): ChaosGen => ({ stream: "chaos", mix: Object.fromEntries(CHAOS_KINDS.map((k) => [k, k === kind ? 1 : 0])) as ChaosMix, burst: 3, gestures: G });
const pair = [{ call: 0, side: "player", tick: 0, intent: { type: "SelectUnit", unitId: "knight#1" }, aim: null }, { call: 0, side: "player", tick: 0, intent: { type: "TargetCell", at: { c: 0, r: 5 } }, aim: null }];
test("the generator is a seeded IntentHook on its own named stream; runChaosGen records its settings; the run replays identically", () => {
  const src = seedless(input("stage-fixed", 3)), legal = () => asIntents(forward(3)), result = runChaosGen(src, { ...opts, gen, legal: legal() }), run = result.run;
  assert.deepEqual(runChaosGen(src, { ...opts, gen, legal: legal() }), result);
  assert.equal(result.outcome === "timeout" && result.failure === null && run.moves.length === 198 && result.rejects.length === 88, true);
  assert.deepEqual(run.moves[0], { call: 0, side: "player", tick: 0, intent: { type: "SelectUnit", unitId: "merchant#6#" }, aim: null });
  assert.deepEqual(run.options.presets, round({ fxOptions: BTF_FX_PRESET, chaosGen: gen }));
  assert.deepEqual(replayChaos(src, round(run), tools), result);
  assert.notDeepEqual(runChaosGen(src, { ...opts, gen: { ...gen, stream: "chaos-b" }, legal: legal() }).run.moves, run.moves);
  const quiet = (seed: number) => runChaosGen(seedless(input("stage-fixed", seed)), { ...opts, gen, legal: idle }).run.moves;
  assert.notDeepEqual(quiet(3), quiet(4));
  const hook = chaosIntents(gen, legal()); runChaos(src, { ...opts, intents: hook });
  assert.throws(() => runChaos(src, { ...opts, intents: hook }), /chaos-gen: one generator per run/);
  const fresh = chaosIntents(gen, idle), world = createWorld(src);
  for (let i = 0; i < 20; i += 1) assert.deepEqual(fresh(world, "player", { kind: "side", units: [] }), []);
});
test("generator settings are the caller's, with no defaults: a bad stream, mix, burst or gesture setting throws RangeError", () => {
  const world = createWorld(seedless(input("stage-fixed", 3))), call = (g: ChaosGen): void => { chaosIntents(g, idle)(world, "player", { kind: "side", units: ["knight#1"] }); };
  const mix = (m: object): ChaosGen => ({ ...gen, mix: m as ChaosMix }), drop = Object.fromEntries(CHAOS_KINDS.filter((k) => k !== "gesture").map((k) => [k, 1]));
  for (const g of [{ ...gen, stream: "" }, { ...gen, stream: "match" }, { ...gen, stream: "pool" }, mix(drop), mix({ ...ALL, extra: 1 }), mix({ ...ALL, box: -1 }), mix({ ...ALL, box: Number.NaN }), mix(Object.fromEntries(CHAOS_KINDS.map((k) => [k, 0]))), { ...gen, burst: 0 }, { ...gen, burst: 1.5 }, { ...gen, gestures: null }, { ...gen, gestures: { ...G, cellPx: 0 } }]) assert.throws(() => call(g), RangeError);
  assert.doesNotThrow(() => call({ ...gen, gestures: null, mix: { ...ALL, gesture: 0 } }));
});
test("each kind makes its documented batch; every reject is reported and passes the checks", () => {
  const src = seedless(input("stage-fixed", 3));
  const tag = (v: ChaosView): string => { const step = v.step, head = `${step.intent.type}${step.aim !== null ? "@" : ""}`; if (step.reject !== null) return `${head}:${step.reject}`; if (step.action === null) return `${head}:ok`; const id = step.action.actor, was = v.before.units.find((u) => u.id === id), now = v.after.units.find((u) => u.id === id); return `${head}:${was !== undefined && now !== undefined && (was.at.c !== now.at.c || was.at.r !== now.at.r) ? "move" : "stay"}`; };
  const want: Record<ChaosKind, string> = { legal: "SelectUnit:ok TargetCell:move", stall: "", offGrid: "SelectUnit:ok TargetCell:offGrid", foreign: "SelectUnit:noUnit SelectUnit:notOwn TargetCell:noEvent", taken: "SelectUnit:ok TargetCell:stay", cancel: "Cancel:illegal Cancel:ok SelectUnit:ok", confirm: "Confirm:noEvent Confirm@:noEvent SelectUnit:ok", box: "BoxSelect:noEvent", gesture: "BoxSelect:noEvent SelectUnit:ok TargetCell:move TargetCell:noEvent" };
  for (const kind of CHAOS_KINDS) {
    const views: ChaosView[] = [], result = runChaosGen(src, { ...opts, fuse: 1000, maxRounds: 12, checks: [...CHAOS_CHECKS, { id: "spy", run: (v) => { views.push(v); return null; } }], gen: only(kind), legal: asIntents(forward(3)) });
    assert.equal(result.failure, null); assert.equal([...new Set(views.map(tag))].sort().join(" "), want[kind]);
    if (kind === "stall") assert.equal(result.outcome === "timeout" && result.run.moves.length === 0, true);
    if (kind === "cancel" || kind === "confirm") { const type = kind === "cancel" ? "Cancel" : "Confirm", seen = new Map<number, number>(); for (const m of result.run.moves) if (m.intent.type === type) seen.set(m.call, (seen.get(m.call) ?? 0) + 1); assert.deepEqual([...new Set(seen.values())].sort(), [1, 2, 3]); }
    if (kind === "offGrid") for (const m of result.run.moves) if (m.intent.type === "TargetCell") assert.equal((m.intent.at.c === -1 || m.intent.at.c === 6) !== (m.intent.at.r === -1 || m.intent.at.r === 9), true);
  }
});
test("gesture recipes are the (a)10 edge cases and reach the player driver only through the touch mapper", () => {
  const world = createWorld(input("stage-fixed")), board = { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at: Sq) => world.units.occupantAt(at) };
  const play = (from: Sq, to: Sq): Intent[][] => gestureRecipes(from, to, 40, G).map((samples) => { const mapper = createGestureMapper(G, board); return samples.flatMap((sample) => [...mapper(sample)]); });
  const sel = (unitId: string): Intent => ({ type: "SelectUnit", unitId }), cell = (c: number, r: number): Intent => ({ type: "TargetCell", at: { c, r } }), box = (a: Sq, b: Sq): Intent => ({ type: "BoxSelect", from: a, to: b });
  const knight: Sq = { c: 0, r: 8 }, empty: Sq = { c: 2, r: 3 }, recipes = gestureRecipes(knight, empty, 40, G);
  assert.deepEqual(play(knight, empty), [[sel("knight#1")], [sel("knight#1"), cell(2, 3)], [box(knight, empty)], [sel("knight#1")], []]);
  assert.deepEqual(play(empty, knight), [[cell(2, 3)], [], [box(empty, knight)], [cell(2, 3)], []]);
  assert.deepEqual(recipes.map((list) => list.map((s) => `${s.kind}${s.id}`).join(",")), ["down0,up0", "down0,move0,up0", "down0,up0", "up1,down0,down0,down1,up1,up0", "down0,cancel0,up0"]);
  assert.deepEqual(recipes[0], [{ kind: "down", id: 0, pointer: "touch", x: 0, y: 512, ms: 40 }, { kind: "up", id: 0, pointer: "touch", x: 10, y: 512, ms: 539 }]);
});
test("the simple shrink: ddmin over the moves keeps a candidate only on the same invariant and key; same record in, same record out; the result replays", () => {
  const src = seedless(input("stage-fixed", 1));
  const low: ChaosCheck = { id: "planted:low", run: (v) => { const knight = v.after.units.find((u) => u.id === "knight#1"); if (knight !== undefined && knight.at.r < 6) return { key: "units", expected: "knight#1", actual: knight.at }; const archer = v.after.units.find((u) => u.id === "archer#2"); return archer !== undefined && archer.at.r < 6 ? { key: "occupancy", expected: "archer#2", actual: archer.at } : null; } };
  const row = (id: string, key: "units" | "occupancy"): ChaosCheck => ({ id: `planted:${id === "knight#1" ? "knight" : "archer"}`, run: (v) => { const u = v.after.units.find((x) => x.id === id); return u !== undefined && u.at.r < 6 ? { key, expected: id, actual: u.at } : null; } });
  const go = (checks: readonly ChaosCheck[]) => runChaosGen(src, { ...opts, fuse: 1000, checks, gen, legal: asIntents(forward(1)) });
  const failure = need(go([...CHAOS_CHECKS, low]).failure), live = { ...tools, checks: [...CHAOS_CHECKS, low] }, shrunk = shrinkChaos(src, failure, live);
  assert.equal(failure.moves.length === 116 && failure.firstDivergentSnapshotKey === "units" && shrunk.tries === 15 && shrunk.record.invariant === "planted:low" && shrunk.record.firstDivergentSnapshotKey === "units" && shrunk.record.stepIndex === 1, true);
  assert.deepEqual(shrunk.record.moves, pair); assert.deepEqual(replayChaos(src, round(shrunk.record), live).failure, shrunk.record); assert.deepEqual(shrinkChaos(src, round(failure), live), shrunk);
  const both = [row("knight#1", "units"), row("archer#2", "occupancy")], found = need(go([...CHAOS_CHECKS, ...both]).failure), cut = shrinkChaos(src, found, { ...tools, checks: [...CHAOS_CHECKS, ...both] });
  assert.equal(found.invariant === "planted:knight" && cut.record.invariant === "planted:knight" && cut.record.moves.length === 2, true); assert.deepEqual(cut.record.moves, pair);
  assert.throws(() => shrinkChaos(src, { ...failure, expected: "other" }, live), /chaos: record does not replay/);
  const now: ChaosCheck = { id: "planted:now", run: () => ({ key: "units", expected: 0, actual: 1 }) }, once = need(go([...CHAOS_CHECKS, now]).failure);
  assert.equal(once.moves.length, 1); assert.deepEqual(shrinkChaos(src, once, { ...tools, checks: [...CHAOS_CHECKS, now] }), { record: once, tries: 0 });
  let calls = 0, gate = 0;
  const flaky: ChaosCheck = { id: "planted:flaky", run: () => { calls += 1; return { key: "units", expected: "stable", actual: gate !== 0 && calls > gate ? calls : "stable" }; } };
  const flakyRun = need(go([...CHAOS_CHECKS, flaky]).failure); gate = calls * 2;
  assert.throws(() => shrinkChaos(src, flakyRun, { ...tools, checks: [...CHAOS_CHECKS, flaky] }), /chaos: shrunk record does not replay/);
});
test("chaos generator smoke, report-only (CEO Q6/Q7): both official boards, seeds 1-20, a swarm mix per seed, gestures on odd seeds; a failure is printed, shrunk and must replay, never asserted away", (t) => {
  for (const [stage, sides] of [["stage-fixed", ["player", "wolves"]], ["stage-weighted", ["player", "rival"]]] as const) {
    let failed = 0, steps = 0, rejects = 0, before = 0, after = 0;
    for (let seed = 1; seed <= 20; seed += 1) {
      const mix: Record<ChaosKind, number> = { ...ALL, legal: 6 }, zero = CHAOS_KINDS[seed % CHAOS_KINDS.length];
      if (zero !== undefined && zero !== "legal") mix[zero] = 0;
      if (seed % 2 === 0) mix.gesture = 0;
      const src = seedless(input(stage, seed)), live = { ...tools, node: process.version };
      const result = runChaosGen(src, { ...opts, ...live, sides: [...sides], gen: { stream: "chaos", mix, burst: 3, gestures: seed % 2 === 0 ? null : G }, legal: asIntents(forward(seed)) });
      assert.equal(result.hashes.length, result.run.moves.length); steps += result.run.moves.length; rejects += result.rejects.length;
      if (result.failure !== null) { failed += 1; const shrunk = shrinkChaos(src, round(result.failure), live); before += result.failure.moves.length; after += shrunk.record.moves.length; t.diagnostic(JSON.stringify({ failure: result.failure, shrunk })); assert.deepEqual(replayChaos(src, round(result.run), live).failure, result.failure); assert.deepEqual(replayChaos(src, round(shrunk.record), live).failure, shrunk.record); }
    }
    t.diagnostic(`chaos gen smoke ${stage} seeds 1-20: runs 20 failed ${failed} steps ${steps} rejects ${rejects} shrunk ${before}->${after}`);
  }
});
