import { xGo } from "../state/index.ts";
import type { ChaosCheck, ChaosFinding, ChaosMove, ChaosOptions, ChaosRecord, ChaosResult, ChaosRun, ChaosTools, ChaosView, IntentHook, Player, PlayerStep, SimInput, SimSnapshot, SimWorld, SnapshotKey } from "./types.ts";
import { createPlayer } from "./player.ts";
import { replay, snapshot } from "./run.ts";
import { runMatch } from "./driver-phase.ts";
import { createWorld } from "./world.ts";

const STOP = new Error("chaos: stop");
const KEYS = ["tick", "clockMs", "rngState", "units", "occupancy", "phases", "logSeq"] as const;
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
const json = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const requireBuild = (engineSha: string, node: string): void => { if (engineSha === "" || node === "") throw new RangeError("chaos: engineSha and node are required"); };
const firstKey = (a: SimSnapshot, b: SimSnapshot): SnapshotKey | null => KEYS.find((key) => !same(a[key], b[key])) ?? null;
function clockOf(view: ChaosView): ChaosFinding | null {
  const stepMs = view.world.clock.stepMs;
  for (const snap of [view.before, view.fed, view.after]) {
    const expected = snap.tick * stepMs;
    if (!Number.isInteger(snap.clockMs) || snap.clockMs !== expected) return { key: "clockMs", expected, actual: snap.clockMs };
  }
  const { prev, before, fed, after } = view;
  if (prev.tick <= before.tick && before.tick === fed.tick && fed.tick <= after.tick) return null;
  const late = before.tick !== fed.tick;
  return { key: "tick", expected: late ? before.tick : prev.tick > before.tick ? prev.tick : fed.tick, actual: late ? fed.tick : prev.tick > before.tick ? before.tick : after.tick };
}
function logOf(view: ChaosView): ChaosFinding | null {
  const n = view.step.action === null ? 0 : 1, expected = [view.prev.logSeq, view.prev.logSeq + n, view.prev.logSeq + n], actual = [view.before.logSeq, view.fed.logSeq, view.after.logSeq];
  return same(expected, actual) ? null : { key: "logSeq", expected, actual };
}
function pair(from: SimSnapshot, to: SimSnapshot): ChaosFinding | null {
  if (!same(from.units, to.units)) return { key: "units", expected: from.units, actual: to.units };
  return same(from.occupancy, to.occupancy) ? null : { key: "occupancy", expected: from.occupancy, actual: to.occupancy };
}
function stillOf(view: ChaosView): ChaosFinding | null {
  const { step, prev, before, after } = view;
  const gap = pair(prev, before);
  if (gap !== null) return gap;
  if (step.reject !== null) {
    return pair(before, after) ?? (before.logSeq !== after.logSeq ? { key: "logSeq", expected: before.logSeq, actual: after.logSeq } : same(before.phases, after.phases) ? null : { key: "phases", expected: before.phases, actual: after.phases });
  }
  if (step.action === null) return pair(before, after);
  const actor = step.action.actor, rest = (snap: SimSnapshot): SimSnapshot["units"] => snap.units.filter((u) => u.id !== actor);
  return same(rest(before), rest(after)) ? null : { key: "units", expected: before.units, actual: after.units };
}
function phaseOf(view: ChaosView): ChaosFinding | null {
  const { step, before, fed } = view;
  if (step.reject !== null || step.event === null) return null;
  const expected = { ...before.phases, battle: xGo(step.from, step.event) }; return same(fed.phases, expected) ? null : { key: "phases", expected, actual: fed.phases };
}
function gridOf(view: ChaosView): ChaosFinding | null {
  const bad = view.after.units.filter((u) => u.alive && !view.world.grid.isOpen(u.at)); return bad.length === 0 ? null : { key: "units", expected: [], actual: bad };
}
function occOf(view: ChaosView): ChaosFinding | null {
  const grid = view.world.grid, fromUnits = view.after.units.flatMap((u) => (u.alive ? [`${grid.index(u.at)}:${u.id}`] : [])).sort();
  const fromOcc = view.after.occupancy.flatMap(([i, ids]) => ids.map((id) => `${i}:${id}`)).sort();
  return same(fromUnits, fromOcc) ? null : { key: "occupancy", expected: fromUnits, actual: fromOcc };
}
export const CHAOS_CHECKS: readonly ChaosCheck[] = [
  { id: "(a)5", run: clockOf },
  { id: "(a)12", run: logOf },
  { id: "(a)9", run: stillOf },
  { id: "(a)6", run: phaseOf },
  { id: "(a)2", run: gridOf },
  { id: "(a)1", run: occOf }];
function play(input: SimInput, opts: ChaosOptions, recorded: readonly ChaosMove[] | null, expectSeed: number | null): ChaosResult {
  const world = createWorld(input);
  if (expectSeed !== null && world.seed !== expectSeed) throw new Error(`chaos: world seed ${world.seed} is not the record seed ${expectSeed}`);
  const moves: ChaosMove[] = [], hashes: string[] = [], rejects: number[] = [];
  let calls = 0, callNow = 0, n = 0, prev = snapshot(world);
  let held: { before: SimSnapshot; fed: SimSnapshot } | null = null;
  const stopped: { hit: { id: string; finding: ChaosFinding; snap: SimSnapshot; stepIndex: number } | null } = { hit: null };
  const nextId = (): string => `${opts.idPrefix}${n += 1}`;
  const hook: IntentHook = (w, side, budget) => {
    const at = calls; calls += 1; callNow = at;
    if (recorded === null) return opts.intents(w, side, budget);
    const rows = recorded.filter((m) => m.call === at);
    for (const row of rows) if (row.side !== side) throw new Error(`chaos: replay diverged at call ${at}`);
    return rows.map((row) => ({ intent: row.intent, aim: row.aim }));
  };
  const players: Player[] = opts.sides.map((side) => {
    const raw = createPlayer(world, { side, moveMs: opts.moveMs, nextId });
    return { side, history: () => raw.history(), feed(intent, aim) {
      const before = snapshot(world), step = raw.feed(intent, aim), aimAt = step.aim;
      held = { before, fed: snapshot(world) };
      moves.push({ call: callNow, side, tick: step.tick, intent: json(step.intent), aim: aimAt === null ? null : { c: aimAt.c, r: aimAt.r } });
      return step;
    } };
  });
  const onStep = (step: PlayerStep, live: SimWorld): void => {
    if (held === null) throw new Error("chaos: step without a feed");
    const after = snapshot(live);
    hashes.push(opts.hash(JSON.stringify(after)));
    if (step.reject !== null) rejects.push(moves.length - 1);
    const view: ChaosView = { step, prev, before: held.before, fed: held.fed, after, world: live };
    for (const check of opts.checks) {
      const finding = check.run(view);
      if (finding !== null) { stopped.hit = { id: check.id, finding, snap: after, stepIndex: moves.length - 1 }; throw STOP; }
    }
    prev = after;
  };
  let outcome: ChaosResult["outcome"] = "failed";
  try { outcome = runMatch(world, { sides: opts.sides, ai: () => { throw new Error("chaos: the ai hook was asked"); }, victory: opts.victory, fuse: opts.fuse, maxRounds: opts.maxRounds, maxSimMs: opts.maxSimMs, seats: players.map((player) => ({ player, intents: hook, onStep })) }).outcome; }
  catch (err) { if (err !== STOP) throw err; }
  const run: ChaosRun = { seed: world.seed, ruleset: opts.ruleset, options: { sides: opts.sides, fuse: opts.fuse, maxRounds: opts.maxRounds, maxSimMs: opts.maxSimMs, moveMs: opts.moveMs, idPrefix: opts.idPrefix, presets: json(opts.presets), checks: opts.checks.map((c) => c.id) }, moves: moves.slice(), engineSha: opts.engineSha, node: opts.node, engineVersion: input.engineVersion, projectHash: input.projectHash };
  const fail = (extra: Omit<ChaosRecord, keyof ChaosRun>): ChaosResult => ({ outcome: "failed", run, failure: { ...run, ...extra }, hashes, rejects });
  if (stopped.hit !== null) { const hit = stopped.hit; return fail({ stepIndex: hit.stepIndex, invariant: hit.id, firstDivergentSnapshotKey: hit.finding.key, expected: hit.finding.expected, actual: hit.finding.actual, tick: hit.snap.tick, clockMs: hit.snap.clockMs, snapshotHash: opts.hash(JSON.stringify(hit.snap)) }); }
  const live = snapshot(world), other = replay(input, world.log, live.tick);
  other.phases = { ...live.phases };
  const shot = snapshot(other), key = firstKey(shot, live);
  if (key !== null) return fail({ stepIndex: moves.length, invariant: "(a)4", firstDivergentSnapshotKey: key, expected: shot[key], actual: live[key], tick: live.tick, clockMs: live.clockMs, snapshotHash: opts.hash(JSON.stringify(live)) });
  return { outcome, run, failure: null, hashes, rejects };
}
export function runChaos(input: SimInput, opts: ChaosOptions): ChaosResult {
  requireBuild(opts.engineSha, opts.node);
  return play(input, opts, null, null);
}
export function replayChaos(input: SimInput, run: ChaosRun, tools: ChaosTools): ChaosResult {
  requireBuild(tools.engineSha, tools.node);
  if (tools.engineSha !== run.engineSha || tools.node !== run.node) throw new Error(`chaos: record is for ${run.engineSha} on Node ${run.node}`);
  const ids = tools.checks.map((c) => c.id);
  if (ids.length !== run.options.checks.length || ids.some((id, i) => id !== run.options.checks[i])) throw new Error("chaos: checks differ from the record");
  if (input.engineVersion !== run.engineVersion || input.projectHash !== run.projectHash) throw new Error("chaos: project differs from the record");
  const o = run.options;
  return play({ ...input, hostSeed: run.seed }, { ...tools, ruleset: run.ruleset, sides: o.sides, fuse: o.fuse, maxRounds: o.maxRounds, maxSimMs: o.maxSimMs, moveMs: o.moveMs, idPrefix: o.idPrefix, presets: o.presets, intents: () => [] }, run.moves, run.seed);
}
