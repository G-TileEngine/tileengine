import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { BTF_LEVEL_RULES } from "../../src/btf-adapters/src/index.ts";
import { createClock } from "../../src/core/clock/index.ts";
import { LOG_FORMAT_VERSION, createLog, parseLog, type LogHeader } from "../../src/core/log/index.ts";
import { NOT_PLAIN, cellOf, plainCopy } from "../../src/core/plain.ts";
import { createRng } from "../../src/core/rng/index.ts";
import { createLevels, type LevelRules } from "../../src/rules/levels/index.ts";
import { createGestureMapper } from "../../src/runtime/input/index.ts";
import { CHAOS_KINDS, advance, chaosIntents, createWorld, replay, restore, snapshot, submit, type ChaosGen } from "../../src/sim/index.ts";
import { input } from "./input.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const kill = (code: string): void => { const run = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e", code], { cwd: root, timeout: 5000, encoding: "utf8" }); assert.equal(run.status, 0, `${run.stderr ?? ""}${run.stdout ?? ""}${String(run.error ?? "")}`); };
const boom = (good: Record<string, unknown>, key: string): Record<string, unknown> => { const o = { ...good }; Object.defineProperty(o, key, { enumerable: true, get() { throw new Error("x"); } }); return o; };
const holey = (first: unknown, at: 0 | 1): unknown[] => { const row = [first, first]; if (at === 0) delete row[0]; else delete row[1]; return row; };
const deepNest = (n = 100000): unknown => { let v: unknown = 1; for (let i = 0; i < n; i += 1) v = { a: v }; return v; };
function hostiles(good: object, key: string): { name: string; value: unknown }[] {
  const src = good as Record<string, unknown>, put = (value: unknown): Record<string, unknown> => ({ ...src, [key]: value });
  const cycle = (): unknown => { const o: Record<string, unknown> = { ...src }; o[key] = o; return o; };
  const miss = (): unknown => { const { [key]: _gone, ...rest } = src; void _gone; return rest; };
  const rev = (): unknown => { const p = Proxy.revocable(src, {}); p.revoke(); return p.proxy; };
  const rows: [string, () => unknown][] = [
    ["getter", () => boom(src, key)], ["get", () => new Proxy(src, { get() { throw new Error("x"); } })],
    ["ownKeys", () => new Proxy(src, { ownKeys() { throw new Error("x"); } })], ["revoked", rev],
    ["hole0", () => put(holey(src[key], 0))], ["hole1", () => put(holey(src[key], 1))], ["nest", () => put(deepNest())],
    ["cycle", cycle], ["bigint", () => put(1n)], ["map", () => put(new Map())], ["nan", () => put(Number.NaN)],
    ["inf", () => put(Number.POSITIVE_INFINITY)], ["wrong", () => put("bad")], ["missing", miss], ["null", () => null], ["string", () => "x"], ["array", () => [1]],
  ];
  return rows.map(([name, make]) => ({ name, value: make() }));
}
const flip = (good: object, key: string, later: unknown): { value: Record<string, unknown>; reads: () => number } => {
  const src = good as Record<string, unknown>; let n = 0; const first = src[key], value = { ...src };
  Object.defineProperty(value, key, { enumerable: true, get() { n += 1; return n === 1 ? first : later; } });
  return { value, reads: () => n };
};
const msg = (e: unknown): string => e instanceof Error ? e.message : "";
const BAD = new Set(["getter", "get", "ownKeys", "revoked", "hole0", "hole1", "nest", "cycle", "bigint", "map"]);
const UNIT: LevelRules = { ...BTF_LEVEL_RULES, bar: "unit" }, head: LogHeader = { seed: 1, formatVersion: LOG_FORMAT_VERSION, engineVersion: "e", projectHash: "p" };
const act = (): Record<string, unknown> => ({ id: "a", kind: "move", actor: "u", target: { pipe: "tile", at: { c: 1, r: 2 } }, durationMs: null, turns: null, effects: ["ok"] });
const mv = (over: object = {}): Record<string, unknown> => ({ id: "m", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: 0, r: 7 } }, durationMs: null, turns: null, effects: [], ...over });
test("the door copy (step 20) refuses a lying length, a hole and a poisoned prototype", () => {
  kill(`import { NOT_PLAIN, plainCopy } from "./src/core/plain.ts"; const trap = { configurable: true, enumerable: true, value: "guard", writable: true }; const liar = (len) => new Proxy([], { get: (_t, k) => (k === "length" ? len : "guard"), has: () => true, getOwnPropertyDescriptor: () => trap }); if (plainCopy(liar(Infinity), 4) !== NOT_PLAIN) process.exit(2); let reads = 0; const big = new Proxy([], { get: (_t, k) => { if (k === "length") return 1e9; reads += 1; return "guard"; }, has: () => true, getOwnPropertyDescriptor: () => trap }); if (plainCopy(big, 3, 100) !== NOT_PLAIN || reads !== 0) process.exit(3);`);
  const good = { a: [1, "x", true, null], b: { c: 2 } };
  for (const row of hostiles(good, "a")) { let got: unknown; assert.doesNotThrow(() => { got = plainCopy(row.value, 4); }); assert.equal(got === NOT_PLAIN, BAD.has(row.name), row.name); }
  const raw = JSON.parse('{"__proto__":{"admin":true},"constructor":{"x":1},"prototype":1,"z":-0,"a":[1]}') as { z: number; a: number[] };
  const copy = plainCopy(raw, 3) as { z: number; a: number[] };
  assert.deepEqual(copy, { z: 0, a: [1] }); assert.equal(Object.isFrozen(copy) && Object.isFrozen(copy.a) && Object.is(copy.z, 0) && Object.getPrototypeOf(copy) === Object.prototype && !Object.hasOwn({}, "admin"), true);
  const once = flip(good, "a", null); assert.deepEqual(plainCopy(once.value, 4), good); assert.equal(once.reads(), 1);
  let called = 0; const tagged = { z: 1, toJSON() { called += 1; return { z: 9 }; }, f() { return 1; }, [Symbol("s")]: 1 };
  assert.deepEqual(plainCopy(tagged, 2), { z: 1 }); assert.equal(called, 0);
  assert.equal(plainCopy({ a: { b: { c: 1 } } }, 2), NOT_PLAIN); assert.deepEqual(plainCopy({ a: { b: { c: 1 } } }, 3), { a: { b: { c: 1 } } });
  assert.equal(plainCopy([1, 2, 3], 1, 3), NOT_PLAIN); assert.deepEqual(plainCopy([1, 2, 3], 1, 4), [1, 2, 3]);
  const t = Date.now(); assert.equal(plainCopy(deepNest(), Number.POSITIVE_INFINITY), NOT_PLAIN); assert.equal(plainCopy(new Array(1e9), 1), NOT_PLAIN); assert.ok(Date.now() - t < 1500);
  assert.deepEqual(cellOf({ c: 1, r: 2 }), { c: 1, r: 2 }); assert.equal(cellOf({ c: Number.NaN, r: 0 }), null); assert.equal(cellOf({ c: 1.5, r: 0 }), null); assert.equal(cellOf(null), null);
});
test("moveTo keeps its own cell (step 20) when the caller edits it later", () => {
  const world = createWorld(input("stage-fixed")), cell = { c: 0, r: 7 };
  assert.equal(world.units.moveTo("knight#1", cell).ok, true); cell.c = 9;
  const at = world.units.get("knight#1")?.at;
  assert.equal(at !== undefined && Object.isFrozen(at) && at.c === 0 && at.r === 7 && world.units.occupantAt(at) === "knight#1" && world.units.occupantAt({ c: 0, r: 8 }) === undefined, true);
  for (const row of hostiles({ c: 1, r: 7 }, "c")) { const moved = world.units.moveTo("knight#1", row.value as never); assert.equal(!moved.ok && moved.reason === "outOfBounds" && world.units.get("knight#1")?.at.c === 0, true); }
});
test("clock.after says no politely (step 20) and reports a RangeError", () => {
  const clock = createClock(), errs: unknown[] = []; clock.onError((e) => errs.push(e));
  for (const ms of [Number.NaN, -1, 1.5, Number.POSITIVE_INFINITY, "10", null]) assert.equal(clock.after(ms as never, () => undefined).id, 0);
  assert.equal(clock.after(10, "cb" as never).id, 0); clock.advance(50); clock.step();
  assert.equal(errs.length === 7 && errs.every((e) => e instanceof RangeError && msg(e) === "after: ms must be an integer >= 0 and cb a function"), true);
  assert.ok(clock.after(10, () => undefined).id > 0);
});
test("the log door (step 20) stores the copy and reads its own text back", () => {
  const refuse = (v: unknown): void => assert.throws(() => createLog(head).append(0, v as never), (e: unknown) => msg(e) === "append: not an action");
  for (const key of ["target", "effects"]) for (const row of hostiles(act(), key)) refuse(row.value);
  refuse({ ...act(), target: { pipe: "tile", at: { c: Number.NaN, r: 0 } } }); refuse({ ...act(), turns: Number.NaN });
  const log = createLog(head), target = { pipe: "tile" as const, at: { c: 1, r: 2 } }, row = { ...act(), target };
  log.append(0, row as never); target.at.c = 9; assert.deepEqual(log.entries()[0]?.action.target, { pipe: "tile", at: { c: 1, r: 2 } });
  const swung = flip(act(), "effects", null); log.append(1, swung.value as never);
  assert.equal(swung.reads() === 1 && JSON.stringify(log.entries()[1]?.action.effects) === JSON.stringify(["ok"]), true);
  assert.deepEqual(parseLog(7 as never), { ok: false, error: "not JSON" }); assert.deepEqual(parseLog(null as never), { ok: false, error: "not JSON" });
  const text = log.toJSON(), parsed = parseLog(text); assert.equal(parsed.ok && parsed.log.toJSON() === text, true);
});
test("submit says no politely (step 20) and logs nothing", () => {
  kill(`import { createWorld, submit } from "./src/sim/index.ts"; import { input } from "./tests/sim/input.ts"; const trap = { configurable: true, enumerable: true, value: "guard", writable: true }; const effects = new Proxy([], { get: (_t, k) => (k === "length" ? Infinity : "guard"), has: () => true, getOwnPropertyDescriptor: () => trap }); const world = createWorld(input("stage-fixed")); submit(world, { id: "m", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: 0, r: 7 } }, durationMs: null, turns: null, effects }); if (world.notices.at(-1)?.code !== "actionRefused" || world.log.lastSeq() !== 0) process.exit(2);`);
  const world = createWorld(input("stage-fixed")), errs: unknown[] = []; world.clock.onError((e) => errs.push(e));
  const before = JSON.stringify(world.units.all());
  const feed = (v: unknown): void => { const n = world.notices.length; assert.doesNotThrow(() => submit(world, v as never)); assert.equal(world.notices.length === n + 1 && world.notices.at(-1)?.code === "actionRefused" && world.log.lastSeq() === 0, true); };
  for (const key of ["target", "effects"]) for (const row of hostiles(mv(), key)) feed(row.value);
  for (const row of hostiles(mv(), "durationMs")) if (row.name !== "missing") feed(row.value);
  feed(mv({ target: { pipe: "tile", at: null } })); feed(mv({ target: { pipe: "tile", at: { c: Number.NaN, r: 0 } } }));
  feed(mv({ target: { pipe: "tile", at: { c: Number.POSITIVE_INFINITY, r: 0 } } })); feed(mv({ target: { pipe: "tile", at: { c: 1.5, r: 0 } } }));
  feed(mv({ durationMs: -1 })); feed(mv({ durationMs: 1.5 })); feed(mv({ turns: Number.NaN }));
  const bare = mv(); delete bare.effects; feed(bare);
  let ref: unknown = "x"; for (let i = 0; i < 10; i += 1) ref = { ref }; feed(mv({ via: { presentation: "p", ref } }));
  advance(world, 500); assert.equal(JSON.stringify(world.units.all()) === before && errs.length === 0, true);
});
test("a hostile unlock (step 20) is refused by name and the log still reads back", () => {
  const world = createWorld({ ...input("stage-fixed"), levels: { rules: UNIT, pools: { knight: ["guard", "charge"] } } });
  world.levels?.gain("knight#1", "knight", 17); const id = world.levels?.offer("knight#1")?.[0] ?? "", state = (): string => JSON.stringify(world.levels?.state());
  const before = state();
  for (const at of [0, 1] as const) { const fx = [id, id]; if (at === 0) delete fx[0]; else delete fx[1]; const n = world.notices.length; assert.doesNotThrow(() => submit(world, { id: "h", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects: fx } as never)); assert.equal(world.notices.at(-1)?.code === "actionRefused" && world.notices.length === n + 1 && world.log.lastSeq() === 0 && state() === before, true); }
  const rows = [[], [""], [id, id], [7], null] as const;
  rows.forEach((effects) => { const n = world.notices.length; submit(world, { id: "u", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects } as never); assert.equal(world.notices.length === n + 1 && world.notices.at(-1)?.code === "unlockFailed", true); });
  assert.equal(world.log.lastSeq(), 3);
  const swung = flip({ id: "f", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects: [id] }, "effects", null);
  submit(world, swung.value as never); assert.equal(swung.reads() === 1 && world.log.lastSeq() === 4 && world.levels?.state().bars[0]?.abilities[0] === id, true);
  const text = world.log.toJSON(), parsed = parseLog(text); assert.equal(parsed.ok && parsed.log.toJSON() === text, true);
});
test("the world does what the log says (step 20) after a timed edit", () => {
  const world = createWorld(input("stage-fixed")), at = { c: 0, r: 7 };
  const action = mv({ durationMs: 200, target: { pipe: "tile", at } });
  submit(world, action as never); at.c = 5; advance(world, 200);
  assert.deepEqual(world.units.get("knight#1")?.at, { c: 0, r: 7 });
  assert.equal(JSON.stringify(snapshot(replay(input("stage-fixed"), world.log, world.clock.tick()))), JSON.stringify(snapshot(world)));
  const zero = createWorld(input("stage-fixed"));
  submit(zero, mv({ durationMs: null, target: { pipe: "tile", at: { c: -0, r: 7 } } }) as never);
  const text = zero.log.toJSON(), parsed = parseLog(text); assert.equal(parsed.ok && parsed.log.toJSON() === text, true);
});
test("createLevels refuses a hostile setup by name (step 20)", () => {
  const pools = { knight: ["guard", "charge"] }, range = (v: unknown): void => assert.throws(() => createLevels(v as never, createRng(1), () => {}), (e: unknown) => e instanceof RangeError && msg(e) === "createLevels: bad rules or pools");
  for (const row of hostiles(UNIT, "thresholds")) range({ rules: row.value, pools });
  for (const row of hostiles(pools, "knight")) if (row.name !== "missing") range({ rules: UNIT, pools: row.value });
  const swung = flip(pools, "knight", [""]), levels = createLevels({ rules: UNIT, pools: swung.value as never }, createRng(1), () => {});
  levels.gain("knight#1", "knight", 17); const offer = levels.offer("knight#1") ?? [];
  assert.equal(swung.reads() === 1 && offer.includes("") === false && offer.length > 0, true);
});
test("restore and createWorld say no politely (step 20)", () => {
  const src = input("stage-fixed"), world = createWorld(src), snap = snapshot(world), back = restore(src, world.log, snap);
  assert.equal(JSON.stringify(snapshot(back)), JSON.stringify(snap));
  const either = (e: unknown): boolean => msg(e) === "restore: snapshot is not plain data" || msg(e) === "restore: snapshot does not match the log";
  for (const row of hostiles(snap, "units")) assert.throws(() => restore(src, world.log, row.value as never), either);
  const t = Date.now();
  for (const tick of [1e9, -1, 1.5]) assert.throws(() => restore(src, world.log, { ...snap, tick } as never), (e: unknown) => msg(e) === "restore: snapshot does not match the log");
  assert.ok(Date.now() - t < 1500);
  for (const row of hostiles(src, "stage")) if (BAD.has(row.name)) { assert.throws(() => createWorld(row.value as never), (e: unknown) => msg(e) === "createWorld: input is not plain data"); assert.throws(() => replay(row.value as never, world.log, 0), (e: unknown) => msg(e) === "replay: input is not plain data" || msg(e) === "createWorld: input is not plain data"); }
});
test("the gesture mapper ignores what is not a pointer (step 20)", () => {
  const mapper = createGestureMapper({ cellPx: 16, tapMaxPx: 4, holdMs: 300 }, { cols: 3, rows: 3, unitAt: () => undefined });
  const sample = { kind: "down", id: 0, pointer: "touch", x: 8, y: 8, ms: 0 };
  for (const row of hostiles(sample, "x")) assert.deepEqual(mapper(row.value as never), []);
  assert.deepEqual(mapper({ ...sample, y: Number.NaN } as never), []); assert.deepEqual(mapper({ ...sample, y: Number.NEGATIVE_INFINITY } as never), []);
  assert.deepEqual(mapper(sample as never), []); assert.deepEqual(mapper({ ...sample, kind: "up", ms: 10 } as never), [{ type: "TargetCell", at: { c: 0, r: 0 } }]);
});
test("chaos-gen reads its settings once (step 20)", () => {
  const world = createWorld(input("stage-fixed")), mix = Object.fromEntries(CHAOS_KINDS.map((k) => [k, k === "legal" ? 1 : 0])) as ChaosGen["mix"];
  const gen: ChaosGen = { stream: "door", mix: { ...mix }, burst: 1, gestures: null }, legal = (): [] => [];
  const a = chaosIntents(gen, legal), b = chaosIntents({ ...gen, mix: { ...gen.mix } }, legal);
  (gen as { mix: ChaosGen["mix"] }).mix = { ...mix, legal: 0, stall: 50 };
  const budget = { kind: "side" as const, units: ["knight#1"] }, pull = (fn: ReturnType<typeof chaosIntents>): unknown[] => Array.from({ length: 40 }, () => fn(world, "player", budget));
  assert.deepEqual(pull(a), pull(b));
  for (const name of ["getter", "get", "ownKeys", "revoked"]) { const row = hostiles(gen, "mix").find((item) => item.name === name); assert.throws(() => chaosIntents(row?.value as never, legal)(world, "player", budget), (e: unknown) => e instanceof RangeError && msg(e) === "chaos-gen: gen must be plain data"); }
});
