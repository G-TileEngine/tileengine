import assert from "node:assert/strict"; import { test } from "node:test"; import { getHeapSpaceStatistics, setFlagsFromString } from "node:v8"; import { runInNewContext } from "node:vm";
import { BTF_FX_READ_LIMITS, BTF_SPRITE_RECIPE_LIMITS, BTF_STAGE_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { DEFAULT_MATCH_LIMITS, TEXT_BYTES, TEXT_BYTES_MAX, textOver } from "../../src/core/limits.ts";
import { parseLog } from "../../src/core/log/index.ts";
import { readFxOrder } from "../../src/fx/order/index.ts";
import { RECIPE_CAPS, readSpriteRecipe } from "../../src/paint/recipe/index.ts";
import { readManifest, readMap, readStage } from "../../src/project/read/index.ts";
import { advance, createWorld, feedIntent, loadSave, restore, saveMatch, snapshot, submit } from "../../src/sim/index.ts";
import { SAMPLE, fieldPaths, getPath } from "../paint/sample.ts";
import { input, move } from "./input.ts";
setFlagsFromString("--expose-gc"); const gc = runInNewContext("gc") as () => void; // in-test gc, so package.json keeps its pin
const bigHeap = (): number => getHeapSpaceStatistics().filter((s) => s.space_name.endsWith("large_object_space")).reduce((n, s) => n + s.space_used_size, 0);
const FX = BTF_FX_READ_LIMITS, LIM = DEFAULT_MATCH_LIMITS, src = input("stage-fixed");
const world = createWorld(src); submit(world, move("a", "knight#1", 0, 7, null)); advance(world, world.clock.stepMs);
const save = saveMatch(world, { projectId: "p1", savedAt: "2026-11-12T21:00:00Z" }), logText = world.log.toJSON(), shot = snapshot(world);
const code = (v: { ok: boolean; code?: string; error?: string; needsMigration?: boolean }): string => v.ok ? "" : (v.code ?? v.error ?? "");
const fxText = (n: number): string => `SKILLRIG v1\n${JSON.stringify({ frames: Array.from({ length: n }, () => ({ kind: "straight", seconds: 0.3 })), connect: 0.5 })}\n`;
const msg = (e: unknown): string => e instanceof Error ? e.message : "";
test("text doors check size before the parse (step 25)", (t) => {
  const spy = t.mock.method(JSON, "parse"), big = " ".repeat(TEXT_BYTES + 1), deep = "[".repeat(33), small = { ...src, limits: { ...LIM, bytes: 16 } };
  assert.equal(code(parseLog(big)) === "over cap bytes" && code(parseLog(deep)) === "over cap depth" && code(parseLog(logText, small.limits)) === "over cap bytes", true);
  assert.equal(code(loadSave(src, big)) === "saveTooLarge" && code(loadSave(src, deep)) === "saveTooDeep" && code(loadSave(small, save)) === "saveTooLarge", true);
  const block = "{" + "[".repeat(33) + "]".repeat(33) + "}";
  assert.equal(readFxOrder(big, FX).notices[0]?.code === "fxTooLarge" && readFxOrder(block, FX).notices[0]?.code === "fxTooDeep" && readFxOrder(fxText(1), { ...FX, bytes: 16 }).notices[0]?.code === "fxTooLarge", true);
  assert.equal(code(parseLog(logText, { ...LIM, bytes: TEXT_BYTES_MAX + 1 })) === "bad limits", true);
  assert.throws(() => readFxOrder(fxText(1), { ...FX, bytes: TEXT_BYTES_MAX + 1 }), RangeError);
  assert.equal(spy.mock.calls.length, 0);
  parseLog("[".repeat(32) + "]".repeat(32)); assert.equal(spy.mock.calls.length, 1); spy.mock.restore();
  const wide = { ...src, limits: { ...LIM, bytes: TEXT_BYTES_MAX } }, got = loadSave(src, save), cap = loadSave(wide, save);
  assert.equal(parseLog(logText).ok && parseLog(logText, wide.limits).ok && got.ok && cap.ok, true);
  assert.equal(textOver('"' + '\\"' + "[".repeat(40) + '"', TEXT_BYTES) === null && textOver("[".repeat(33), TEXT_BYTES) === "depth", true);
  assert.equal(TEXT_BYTES === RECIPE_CAPS.bytes[0] && TEXT_BYTES_MAX === RECIPE_CAPS.bytes[1], true);
});
test("an effect block keeps its frames bounded and raw is opt-in (step 25)", () => {
  const held = readFxOrder(fxText(64), FX).order, over = readFxOrder(fxText(65), FX), qa = readFxOrder(fxText(5000), FX), huge = readFxOrder(fxText(100000), FX);
  assert.equal(held?.steps.length === 6 && held.inactive.length === 58 && held.inactiveStyles.length === 58 && held.raw === undefined, true);
  assert.equal(over.order === null && over.notices[0]?.code === "fxTooManyFrames" && qa.order === null && qa.notices[0]?.code === "fxTooManyFrames", true);
  assert.equal(huge.order === null && huge.notices[0]?.code === "fxTooLarge" && readFxOrder(fxText(1), FX, { raw: true }).order?.raw !== undefined, true);
});
test("a resumed save refuses a bad snapshot tick (step 25)", () => {
  const withTick = (tick: unknown): string => { const doc = JSON.parse(save) as { snapshot: Record<string, unknown> }; if (tick === undefined) delete doc.snapshot.tick; else doc.snapshot.tick = tick; return JSON.stringify(doc); };
  for (const tick of [null, -1, 1.5, "7", undefined]) {
    const text = withTick(tick), eng = loadSave({ ...src, engineVersion: "9.9.9" }, text, { allowEngineMismatch: true }), proj = loadSave({ ...src, projectHash: "other" }, text, { allowProjectMismatch: true });
    assert.equal(!eng.ok && eng.code === "saveSnapshotTickInvalid" && eng.needsMigration === false && !proj.ok && proj.code === "saveSnapshotTickInvalid" && proj.needsMigration === false, true);
  }
  const back = loadSave({ ...src, projectHash: "other" }, save, { allowProjectMismatch: true }); if (!back.ok) throw new Error(back.code); assert.deepEqual(snapshot(back.world), shot);
});
test("restore checks the clock on the world's own step (step 25)", () => {
  assert.deepEqual(snapshot(restore(src, world.log, shot)), shot);
  for (const clockMs of [shot.clockMs + 1, shot.clockMs * 2, 0, -world.clock.stepMs]) assert.throws(() => restore(src, world.log, { ...shot, clockMs }), (e: unknown) => msg(e) === "restore: snapshot does not match the log");
  assert.throws(() => restore(src, world.log, { ...shot, tick: 1e9 }), (e: unknown) => msg(e) === "restore: snapshot does not match the log");
});
test("a direct reader names a cycle (step 25)", () => {
  const loop = (): Record<string, unknown> => { const o: Record<string, unknown> = {}; o.kind = o; return o; };
  const named = (r: { ok: boolean; error?: string; needsMigration?: boolean }): boolean => !r.ok && r.needsMigration === false && r.error === "cyclic document";
  assert.equal(named(readMap(loop())) && named(readManifest(loop())) && named(readStage(loop(), BTF_STAGE_LIMITS)), true);
  const shared: Record<string, unknown> = { n: 1 }, doc = { kind: shared, extra: shared }, sharedRead = readMap(doc);
  assert.equal(!sharedRead.ok && !sharedRead.needsMigration && sharedRead.error === "wrong kind object", true);
  const trap = new Proxy({}, { get() { throw new Error("boom"); } }), trapped = readMap(trap);
  assert.equal(!trapped.ok && !trapped.needsMigration && trapped.error === "unreadable document", true);
  assert.throws(() => readMap(trap, { side: 0 }), RangeError); assert.throws(() => readManifest(trap, { stages: 0 }), RangeError); assert.throws(() => readStage(trap, { picks: 1.5, waveUnits: 1 }), RangeError);
});
test("callers get a copy of a unit, never the live record (step 25)", () => {
  const unit = world.units.get("knight#1"); if (unit === undefined) throw new Error("unit");
  assert.equal(Object.isFrozen(unit) && Object.isFrozen(unit.at) && world.units.all().every((u) => Object.isFrozen(u) && Object.isFrozen(u.at)), true);
  assert.throws(() => { (unit.at as { c: number }).c = 9; }, TypeError); world.units.push("knight#1", "e", 1);
  const moved = world.units.get("knight#1"); assert.equal(moved !== undefined && Object.isFrozen(moved.at), true);
  const off = { dx: 1, dy: 2 }; assert.equal(world.units.setOffset("knight#1", off), true); off.dx = 9;
  assert.equal(world.units.get("knight#1")?.offset?.dx === 1 && Object.isFrozen(world.units.get("knight#1")?.offset), true);
  let n = 0; world.phases = { battle: "idle" };
  const picked = feedIntent(world, { get type() { n += 1; return n === 1 ? "SelectUnit" : "Cancel"; }, unitId: "knight#1" } as never);
  assert.equal(picked?.type === "SELECT_UNIT" && n === 1 && feedIntent(world, new Proxy({}, { get() { throw new Error("boom"); } }) as never) === null, true);
});
test("every part field is read (step 25)", () => {
  const got = readSpriteRecipe(SAMPLE, BTF_SPRITE_RECIPE_LIMITS); if (!got.ok) throw new Error("error" in got ? got.error : "migration");
  for (const path of fieldPaths(SAMPLE)) assert.notEqual(getPath(got.doc, path), undefined, path);
});
test("the recipe size count copies nothing over the cap (step 25)", () => {
  // load-proof: collect first, then count only the large-object heap (a copy of fat's 3M-entry list lands there, ~16 MiB or more; scan garbage never does)
  const fat = { ...SAMPLE, extra: Array.from({ length: 3000000 }, (_, i) => i) };
  gc(); const before = bigHeap(), got = readSpriteRecipe(fat, { ...BTF_SPRITE_RECIPE_LIMITS, bytes: 1000000 }), grew = bigHeap() - before;
  assert.equal(!got.ok && "error" in got && got.error === "over cap bytes" && grew < 1024 * 1024, true, "large-object growth " + String(grew));
  const odd = { ...SAMPLE, box: 1n }, refused = readSpriteRecipe(odd, BTF_SPRITE_RECIPE_LIMITS); assert.equal(!refused.ok && "error" in refused && refused.error === "not plain JSON", true);
});
