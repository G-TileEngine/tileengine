import assert from "node:assert/strict"; import { readFileSync } from "node:fs"; import { test } from "node:test";
import { BTF_SPRITE_RECIPE_LIMITS as LIM, BTF_STAGE_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { DEFAULT_MATCH_LIMITS, PLAIN_NODES } from "../../src/core/limits.ts";
import { LOG_FORMAT_VERSION, createLog } from "../../src/core/log/index.ts";
import { NOT_PLAIN, plainCopy } from "../../src/core/plain.ts";
import { readSpriteRecipe } from "../../src/paint/recipe/index.ts";
import { DEFAULT_DOC_LIMITS, readManifest, readMap, readStage } from "../../src/project/read/index.ts";
import { createRng } from "../../src/core/rng/index.ts";
import { DEFAULT_LEVEL_LIMITS, createLevels } from "../../src/rules/levels/index.ts";
import { createWorld, runMatch, runTicks } from "../../src/sim/index.ts";
import { SAMPLE, copy, fieldPaths, getPath, setPath } from "../paint/sample.ts";
import { input, move } from "./input.ts";
const msg = (e: unknown): string => e instanceof Error ? e.message : "";
const err = (j: unknown, limits: unknown = LIM): string => { try { const r = readSpriteRecipe(j, limits as never); return r.ok || r.needsMigration ? "" : r.error; } catch (e) { return msg(e); } };
const notes = (j: unknown, limits: unknown = LIM): string[] => { const r = readSpriteRecipe(j, limits as never); if (!r.ok) throw new Error(r.needsMigration ? "migration" : r.error); return r.notices.map((n) => n.message); };
const fixed = JSON.parse(readFileSync(new URL("../fixtures/project/stage-fixed.json", import.meta.url), "utf8")) as Record<string, unknown>;
const stage = (patch: Record<string, unknown>, limits: unknown = BTF_STAGE_LIMITS): string => { const r = readStage({ ...fixed, ...patch }, limits as never); return r.ok || r.needsMigration ? "" : r.error; };
const man = (n: number): unknown => ({ kind: "tile-project", formatVersion: 6, project: { id: "p", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: Array<string>(n).fill("a"), rules: [], loadout: { roster: ["knight"], size: 1, required: [] } } });
const manText = (n: number, limits?: unknown): string => { try { const r = readManifest(man(n), limits as never); return r.ok || r.needsMigration ? "" : r.error; } catch (e) { return msg(e); } };
const cells = (n: number): { c: number; r: number }[] => Array.from({ length: n }, () => ({ c: 0, r: 0 }));
const rules = { bar: "unit" as const, thresholds: [1], offerLevels: [1], offerSize: 1, xp: { move: 1 } }, pools = { a: ["x"] };
test("recipe caps (step 23)", () => {
  for (const [key, n] of [["totalRuns", 7], ["totalPoints", 9], ["totalTweaks", 3], ["bytes", 1593]] as const) { assert.equal(err(SAMPLE, { ...LIM, [key]: n }), ""); assert.equal(err(SAMPLE, { ...LIM, [key]: n - 1 }), "over cap " + key); }
  assert.equal(LIM.totalRuns === 32768 && LIM.totalPoints === 32768 && LIM.totalTweaks === 32768 && LIM.bytes === 2097152 && LIM.notices === 256, true);
  const lit = copy(SAMPLE) as { light: number; raster: number }; lit.light = 1.5; lit.raster = 2; assert.deepEqual(notes(lit, { ...LIM, notices: 1 }), ["floatParam light", "and 1 more"]);
  let calls = 0; const boom = copy(SAMPLE) as { toJSON?: () => unknown }; boom.toJSON = () => { calls += 1; throw new Error("json"); }; assert.equal(notes(boom)[0] === undefined && calls === 0, true);
  for (const [key, n] of [["side", 4096], ["parts", 1048576], ["historyBytes", 1048576], ["totalRuns", 1048576], ["bytes", 16777216], ["notices", 2147483647]] as const) { assert.equal(err(SAMPLE, { ...LIM, [key]: n }), ""); assert.throws(() => readSpriteRecipe(SAMPLE, { ...LIM, [key]: n + 1 }), { name: "RangeError", message: "readSpriteRecipe: limits must be integers >= 0" }); }
  let n = 0; const counted = new Proxy(LIM, { get(t, k, r) { n += 1; return Reflect.get(t, k, r); } }); assert.equal(err(SAMPLE, counted) === "" && n === 15, true);
});
test("SE-01 carries (step 23)", () => {
  for (const w of ["x", 0, -3]) { const s = copy(SAMPLE) as { size: { w: unknown; h: number } }; s.size.w = w; s.size.h = 16; const r = readSpriteRecipe(s, { ...LIM, side: 16 }); if (!r.ok) throw new Error(r.needsMigration ? "migration" : r.error); assert.equal(r.doc.size.w === 16 && r.notices.length === 1 && r.notices[0]?.message === "badField size.w", true); }
  const clean = readSpriteRecipe(SAMPLE, LIM); if (!clean.ok) throw new Error(clean.needsMigration ? "migration" : clean.error);
  for (const path of fieldPaths(SAMPLE)) { const damaged = copy(SAMPLE); setPath(damaged, path, "?"); const got = readSpriteRecipe(damaged, LIM); if (!got.ok) throw new Error(path + " " + (got.needsMigration ? "migration" : got.error)); const parent = path.replace(/(?:\.[^.[]+|\[[0-9]+\])$/, ""); const hold = parent === path ? "" : parent; for (const other of fieldPaths(clean.doc)) { if (other === path || other.startsWith(path + ".") || other.startsWith(path + "[") || path.startsWith(other + ".") || path.startsWith(other + "[")) continue; if (hold !== "" && (other === hold || other.startsWith(hold + ".") || other.startsWith(hold + "["))) continue; assert.deepEqual(getPath(got.doc, other), getPath(clean.doc, other), path + " wiped " + other); } }
});
test("stage and manifest caps (step 23)", () => {
  const weighted = (n: number): unknown => ({ mode: "weighted", picks: 1, allowRepeats: true, spawns: cells(1), entries: Array.from({ length: n }, () => ({ unitId: "u", weight: 1 })) });
  const wave = (n: number): unknown => ({ mode: "waves", spawns: cells(1), waves: [{ turn: 1, entries: Array.from({ length: n }, () => ({ unitId: "u", count: 1 })) }] });
  assert.equal(stage({ enemyPool: weighted(145) }) === "over cap enemyPool" && stage({ enemyPool: weighted(144) }) === "" && stage({ enemyPool: wave(145) }) === "over cap enemyPool" && stage({ enemyPool: wave(144) }) === "", true);
  let reads = 0; const liar = new Proxy([], { get(_t, k) { if (k === "length") return 1e9; reads += 1; return { unitId: "u", weight: 1 }; } });
  assert.equal(stage({ enemyPool: { mode: "weighted", picks: 1, allowRepeats: true, spawns: cells(1), entries: liar } }) === "over cap enemyPool" && reads === 0, true);
  assert.equal(manText(1025) === "over cap stages" && manText(1024) === "" && manText(1025, { stages: 1025 }) === "", true);
  assert.equal(DEFAULT_DOC_LIMITS.stages === 1024 && BTF_STAGE_LIMITS.stages === 1024 && Object.isFrozen(BTF_STAGE_LIMITS), true);
  const seeded = readStage({ ...fixed, seed: -0 }, BTF_STAGE_LIMITS); assert.equal(seeded.ok && Object.is(seeded.doc.seed, 0), true);
});
test("explicit null limits are refused (step 23)", () => {
  assert.throws(() => readMap({}, { side: null } as never), (e: unknown) => msg(e) === "readMap: limits must be whole numbers from 1 to their ceilings");
  assert.throws(() => readStage(fixed, { ...BTF_STAGE_LIMITS, spots: null } as never), (e: unknown) => msg(e) === "readStage: limits must be integers >= 0");
  assert.throws(() => readSpriteRecipe(SAMPLE, { ...LIM, totalRuns: null } as never), (e: unknown) => msg(e) === "readSpriteRecipe: limits must be integers >= 0");
  assert.throws(() => createLevels({ rules, pools, limits: { ...DEFAULT_LEVEL_LIMITS, pool: null } as never }, createRng(1), () => undefined), (e: unknown) => msg(e) === "createLevels: limits must be whole numbers from 1 to their ceilings");
  assert.equal(err(SAMPLE, { ...LIM, totalRuns: undefined }), "");
  assert.throws(() => readMap({}, null as never), (e: unknown) => msg(e) === "readMap: limits must be whole numbers from 1 to their ceilings");
  assert.throws(() => readManifest(man(1), null as never), (e: unknown) => msg(e) === "readManifest: limits must be whole numbers from 1 to their ceilings");
  assert.throws(() => createWorld({ ...input("stage-fixed"), limits: null as never }), (e: unknown) => msg(e) === "createWorld: limits must be whole numbers from 1 to their ceilings");
});
test("drivers stop at the tick cap (step 23)", () => {
  const limits = { ...DEFAULT_MATCH_LIMITS, ticks: 50 }, opts = { sides: ["player", "wolves"] as const, fuse: "off" as const, maxRounds: 40, maxSimMs: 100000, victory: () => null };
  const idleW = createWorld({ ...input("stage-fixed"), limits }), idle = runMatch(idleW, { ...opts, ai: () => [] });
  const moveW = createWorld({ ...input("stage-fixed"), limits }), moved = runMatch(moveW, { ...opts, ai: () => [move("a", "knight#1", 0, 7, 3000)] });
  const tickW = createWorld({ ...input("stage-fixed"), limits }), ticked = runTicks(tickW, { sides: ["player"], everyMs: 30, maxSimMs: 100000, ai: () => [], victory: () => null });
  assert.equal(idle.outcome === "timeout" && idleW.clock.tick() === 50 && idle.rounds === 1, true);
  assert.equal(moved.outcome === "timeout" && moveW.clock.tick() === 50 && moved.rounds === 1, true);
  assert.equal(ticked.outcome === "timeout" && tickW.clock.tick() === 50, true);
});
test("the door copy (step 23)", () => {
  const wide: Record<string, number> = {}; for (let i = 0; i < 100; i += 1) wide["k" + String(i)] = 1;
  const copied = plainCopy(wide, 2, 101); assert.equal(plainCopy(wide, 2, 50) === NOT_PLAIN && copied !== NOT_PLAIN && Object.keys(copied as object).length === 100, true);
  let seen = 0; const len = PLAIN_NODES + 1; const row = new Proxy([] as unknown[], { get(_t, k) { if (k === "length") return len; seen += 1; return 0; }, has() { return true; }, getOwnPropertyDescriptor(_t, p) { return { configurable: true, enumerable: p !== "length", writable: true, value: p === "length" ? len : 0 }; } });
  assert.equal(plainCopy(row, 2, Infinity) === NOT_PLAIN && seen === 0, true);
  assert.throws(() => createLog({ seed: 1, formatVersion: LOG_FORMAT_VERSION, engineVersion: 5 as never, projectHash: "p" }), { name: "RangeError", message: "createLog: seed must be a uint32 and header text short" });
  assert.throws(() => createLog({ seed: 1, formatVersion: LOG_FORMAT_VERSION, engineVersion: "e", projectHash: true as never }), { name: "RangeError", message: "createLog: seed must be a uint32 and header text short" });
});
