import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { BTF_MATCH_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { createClock } from "../../src/core/clock/index.ts";
import { DEFAULT_MATCH_LIMITS, MATCH_CEILINGS, type MatchLimits } from "../../src/core/limits.ts";
import { LOG_FORMAT_VERSION, createLog, parseLog, readAction, type Action, type LogHeader } from "../../src/core/log/index.ts";
import { createRng } from "../../src/core/rng/index.ts";
import { createLevels } from "../../src/rules/levels/index.ts";
import { createGestureMapper } from "../../src/runtime/input/index.ts";
import { advance, createWorld, replay, restore, snapshot, submit } from "../../src/sim/index.ts";
import { input } from "./input.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const kill = (code: string): void => { const run = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e", code], { cwd: root, timeout: 5000, encoding: "utf8" }); assert.equal(run.status, 0, `${run.stderr ?? ""}${run.stdout ?? ""}${String(run.error ?? "")}`); };
const msg = (e: unknown): string => e instanceof Error ? e.message : "";
const capped = (over: Partial<MatchLimits>): MatchLimits => ({ ...DEFAULT_MATCH_LIMITS, ...over });
const head = (over: Partial<LogHeader> = {}): LogHeader => ({ seed: 1, formatVersion: LOG_FORMAT_VERSION, engineVersion: "e", projectHash: "p", ...over });
const act = (over: Partial<Action> = {}): Action => ({ id: "a", kind: "move", actor: "u", target: { pipe: "tile", at: { c: 0, r: 1 } }, durationMs: null, turns: null, effects: [], ...over });
const wait = (id: string, over: Partial<Action> = {}): Action => ({ id, kind: "wait", actor: "knight#1", target: null, durationMs: null, turns: null, effects: [], ...over });
const long = (n: number): string => "x".repeat(n);
const LIM = "createWorld: limits must be whole numbers from 1 to their ceilings", SEED = "createLog: seed must be a uint32 and header text short", OVER = "replay: tick or log over the limits";

test("the door budget (step 21) refuses a huge array at its length", () => {
  kill(`import { NOT_PLAIN, plainCopy } from "./src/core/plain.ts"; import { createWorld, submit } from "./src/sim/index.ts"; import { input } from "./tests/sim/input.ts"; const trap = { configurable: true, enumerable: true, value: 0, writable: true }; const liar = (len, box) => new Proxy([], { get: (_t, k) => { if (k === "length") return len; box.n += 1; return 0; }, has: () => true, getOwnPropertyDescriptor: () => trap }); const box = { n: 0 }; if (plainCopy(liar(1e9, box), 3) !== NOT_PLAIN || box.n !== 0) process.exit(2); const fx = { n: 0 }; const world = createWorld(input("stage-fixed")); submit(world, { id: "m", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: 0, r: 7 } }, durationMs: null, turns: null, effects: liar(1e9, fx) }); if (world.notices.at(-1)?.code !== "actionRefused" || world.log.lastSeq() !== 0 || fx.n !== 0) process.exit(3); const ch = { n: 0 }; let named = ""; try { createWorld({ ...input("stage-fixed"), chosen: liar(1e9, ch) }); } catch (e) { named = e instanceof Error ? e.message : ""; } if (named !== "createWorld: input is not plain data" || ch.n !== 0) process.exit(4); for (const len of [-1, 1.5, NaN, Infinity]) { const hit = { n: 0 }; if (plainCopy(liar(len, hit), 2, Infinity) !== NOT_PLAIN || hit.n !== 0) process.exit(5); } let nest = 1; for (let i = 0; i < 40; i += 1) nest = { a: nest }; try { createWorld({ ...input("stage-fixed"), terrain: nest }); process.exit(6); } catch (e) { if (!(e instanceof Error) || e.message !== "createWorld: input is not plain data") process.exit(7); } const n = 2 ** 20; if (plainCopy(new Array(n + 1).fill(0), 1) !== NOT_PLAIN) process.exit(8); const ok = plainCopy(new Array(n - 1).fill(0), 1); if (!Array.isArray(ok) || ok.length !== n - 1) process.exit(9);`);
});
test("the log caps (step 21) refuse a bad seed, a long string and a log past its caps", () => {
  for (const seed of [-1, 2 ** 32, 1.5]) assert.throws(() => createLog(head({ seed })), (e: unknown) => msg(e) === SEED);
  assert.equal(createLog(head({ seed: 2 ** 32 - 1 })).header.seed, 2 ** 32 - 1); assert.throws(() => createLog(head({ projectHash: long(129) })), (e: unknown) => msg(e) === SEED);
  assert.equal(readAction(act({ durationMs: 16384 })) !== null && readAction(act({ durationMs: 16385 })) === null, true);
  assert.equal(readAction(act({ actor: long(129) })) === null && readAction(act({ effects: [long(129)] })) === null && readAction(act({ via: { presentation: "p", ref: long(129) } })) === null, true);
  assert.equal(readAction(act({ actor: long(128), effects: [long(128)], via: { presentation: long(128), ref: long(128) } })) !== null, true);
  const low = createLog(head(), undefined, capped({ ticks: 4, entries: 2 })); low.append(4, act()); assert.throws(() => low.append(5, act()), (e: unknown) => msg(e) === "tick");
  const one = createLog(head(), undefined, capped({ entries: 1 })); one.append(0, act()); assert.throws(() => one.append(0, act()), (e: unknown) => msg(e) === "append: log full");
  const raw = JSON.parse(one.toJSON()) as { header: LogHeader; entries: { tick: number }[] }; raw.entries.push({ tick: 9 });
  assert.deepEqual(parseLog(JSON.stringify(raw), capped({ entries: 1 })), { ok: false, error: "too many entries" });
  raw.entries.pop(); if (raw.entries[0]) raw.entries[0].tick = 131073; assert.deepEqual(parseLog(JSON.stringify(raw)), { ok: false, error: "bad entry" });
  assert.deepEqual(parseLog(JSON.stringify({ header: { ...raw.header, seed: 2 ** 32 }, entries: [] })), { ok: false, error: "bad header" });
  const round = createLog(head()); round.append(1, act()); const text = round.toJSON(), parsed = parseLog(text); assert.equal(parsed.ok && parsed.log.toJSON() === text, true);
});
test("submit says logFull (step 21) once the log holds its entries", () => {
  const world = createWorld({ ...input("stage-fixed"), limits: capped({ entries: 2 }) });
  submit(world, wait("s", { durationMs: 16385 })); submit(world, wait(long(129)));
  assert.equal(world.log.lastSeq() === 0 && world.notices.at(-1)?.code === "actionRefused", true);
  submit(world, wait("a")); submit(world, wait("b")); assert.doesNotThrow(() => submit(world, wait("c")));
  assert.equal(world.log.lastSeq() === 2 && world.notices.at(-1)?.code === "logFull" && world.notices.at(-1)?.message === "log full", true);
});
test("submit says timeLimit (step 21) when the clock is past the tick cap", () => {
  const world = createWorld({ ...input("stage-fixed"), limits: capped({ ticks: 30 }) });
  advance(world, 300); submit(world, wait("t")); assert.equal(world.clock.tick() === 30 && world.log.lastSeq() === 1, true);
  advance(world, 10); assert.doesNotThrow(() => submit(world, wait("u")));
  assert.equal(world.clock.tick() === 31 && world.log.lastSeq() === 1 && world.notices.at(-1)?.code === "timeLimit" && world.notices.at(-1)?.message === "time limit", true);
});
test("replay and restore stop at the tick cap (step 21) before any tick runs", () => {
  const src = input("stage-fixed"), world = createWorld(src), snap = snapshot(world), got = parseLog(world.log.toJSON());
  if (!got.ok) throw new Error(got.error);
  const fixed: LogHeader = { seed: 24301, formatVersion: LOG_FORMAT_VERSION, engineVersion: "0.0.0", projectHash: "test" };
  const empty = createLog(fixed), fat = createLog(fixed, undefined, capped({ entries: 2 })); fat.append(0, wait("a")); fat.append(0, wait("b"));
  const t = Date.now(), run = (fn: () => void): string => { try { fn(); return ""; } catch (e) { return msg(e); } };
  assert.equal(run(() => replay(src, empty, 131073)) === OVER && run(() => replay(src, empty, -1)) === OVER && run(() => replay(src, empty, 1.5)) === OVER, true);
  const tick = 2 ** 31 - 1;
  assert.equal(run(() => restore(src, got.log, { ...snap, tick, clockMs: tick * 10 })) === OVER && run(() => replay({ ...src, limits: capped({ entries: 1 }) }, fat, 0)) === OVER && Date.now() - t < 1500, true);
  assert.throws(() => replay({ ...input("stage-weighted"), limits: capped({ entries: 0 }) }, empty, 0), (e: unknown) => e instanceof RangeError && msg(e) === LIM);
  assert.deepEqual(snapshot(restore(src, got.log, snap)), snap);
});
test("notices per match (step 21) keep one line and count the rest", () => {
  const world = createWorld({ ...input("stage-fixed"), limits: capped({ notices: 3 }) });
  for (let i = 0; i < 10; i += 1) submit(world, { id: `m${i}`, kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: -1, r: 0 } }, durationMs: null, turns: null, effects: [] });
  assert.equal(world.notices.length === 4 && world.notices[3]?.code === "noticesCapped" && world.notices[3]?.message === "and 7 more", true);
});
test("createWorld checks the caps (step 21) before it builds", () => {
  const weighted = input("stage-weighted");
  for (const over of [{ entries: 0 }, { ticks: MATCH_CEILINGS.ticks + 1 }, { durationMs: 1.5 }, { text: Number.NaN }]) assert.throws(() => createWorld({ ...weighted, limits: capped(over) }), (e: unknown) => e instanceof RangeError && msg(e) === LIM);
  const { notices: _gone, ...missing } = DEFAULT_MATCH_LIMITS; void _gone;
  assert.throws(() => createWorld({ ...weighted, limits: missing as MatchLimits }), (e: unknown) => e instanceof RangeError && msg(e) === LIM);
  assert.doesNotThrow(() => createWorld({ ...weighted, limits: MATCH_CEILINGS }));
  assert.throws(() => createWorld({ ...weighted, hostSeed: 2 ** 32 }), (e: unknown) => e instanceof RangeError && msg(e) === SEED);
  assert.throws(() => createWorld({ ...weighted, hostSeed: -1 }), (e: unknown) => e instanceof RangeError && msg(e) === SEED);
  const made = createWorld({ ...input("stage-fixed"), limits: capped({ notices: 4 }) });
  assert.equal(Object.isFrozen(MATCH_CEILINGS) && Object.isFrozen(DEFAULT_MATCH_LIMITS) && Object.isFrozen(BTF_MATCH_LIMITS) && Object.isFrozen(made.limits) && made.limits.notices === 4, true);
  assert.deepEqual(BTF_MATCH_LIMITS, DEFAULT_MATCH_LIMITS);
});
test("the linear draw (step 21) matches the base draw and stays fast", () => {
  const pool = ["a", "b", "c", "d", "e", "f", "g", "h"], rules = { bar: "unit" as const, thresholds: [1], offerLevels: [1], offerSize: 3, xp: { move: 1 } };
  const oracle = (seed: number): string[] => {
    const rng = createRng(seed), cands: string[] = [];
    for (const a of pool) if (!cands.includes(a)) cands.push(a);
    for (let i = 0; i < 3; i += 1) { const j = i + rng.int(cands.length - i), L = cands[i], R = cands[j]; if (L !== undefined && R !== undefined) { cands[i] = R; cands[j] = L; } }
    return cands.slice(0, 3);
  };
  const live = (seed: number): readonly string[] => { const levels = createLevels({ rules, pools: { u: pool } }, createRng(seed), () => undefined); levels.gain("id", "u", 1); return levels.offer("id") ?? []; };
  for (let s = 1; s <= 20; s += 1) assert.deepEqual(live(s), oracle(s));
  const many = Array.from({ length: 4096 }, (_, i) => String(i)), t0 = Date.now();
  const big = createLevels({ rules: { ...rules, offerSize: 8 }, pools: { u: many }, limits: { levels: 64, pool: 4096, offer: 8, pools: 256 } }, createRng(1), () => undefined);
  for (let i = 0; i < 256; i += 1) big.gain(String(i), "u", 1);
  assert.equal(big.offer("0")?.length === 8 && big.offer("255")?.length === 8 && Date.now() - t0 < 500, true);
});
test("options are read once (step 21) and place keeps a frozen cell", () => {
  let n = 0; const clock = createClock({ get stepMs() { n += 1; return n === 1 ? 20 : 5; } });
  assert.equal(clock.stepMs === 20 && n === 1 && createClock({ get stepMs(): number { throw new Error("no"); } }).stepMs === 10, true);
  const opts = { cellPx: 64, tapMaxPx: 8, holdMs: 400 }, map = createGestureMapper(opts, { cols: 4, rows: 4, unitAt: () => undefined });
  opts.cellPx = 1; const down = { kind: "down" as const, id: 1, pointer: "touch" as const, x: 70, y: 10, ms: 0 };
  assert.deepEqual([...map(down), ...map({ ...down, kind: "up", ms: 30 })], [{ type: "TargetCell", at: { c: 1, r: 0 } }]);
  const at = { c: 0, r: 7 }, world = createWorld(input("stage-fixed")), placed = world.units.place({ unitId: "pawn", side: "player", at, facing: null });
  at.c = 4; const cell = placed.ok ? world.units.get(placed.id)?.at : undefined;
  assert.equal(cell !== undefined && Object.isFrozen(cell) && cell.c === 0 && cell.r === 7 && world.units.place({ unitId: "wolf", side: "player", at: { c: Number.NaN, r: 0 }, facing: null }).ok === false, true);
});
