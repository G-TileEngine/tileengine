import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_SPRITE_RECIPE_LIMITS, BTF_STAGE_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { RECIPE_CAPS, readSpriteRecipe } from "../../src/paint/recipe/index.ts";
import { DEFAULT_DOC_LIMITS, readManifest, readMap, readStage } from "../../src/project/read/index.ts";
import { SAVE_MIGRATIONS, createWorld, loadSave, migrateSave, replay, saveMatch, snapshot, submit, type LoadOptions, type SaveChains, type SaveLoad, type SimInput, type SimWorld } from "../../src/sim/index.ts";
import { SAMPLE } from "../paint/sample.ts";
import { input, move } from "./input.ts";
const meta = { projectId: "p1", savedAt: "2026-11-12T21:00:00Z" };
const msg = (e: unknown): string => e instanceof Error ? e.message : "";
const shot = (w: SimWorld): string => JSON.stringify(snapshot(w));
const play = (src: SimInput = input("stage-fixed"), at: readonly [number, number] = [0, 7]): { src: SimInput; world: SimWorld; text: string } => { const world = createWorld(src); submit(world, move("a", "knight#1", at[0], at[1], null)); return { src, world, text: saveMatch(world, meta) }; };
const code = (text: unknown, src: SimInput = input("stage-fixed"), opts?: LoadOptions, chains?: SaveChains): string => { try { const r: SaveLoad = loadSave(src, text, opts, chains); return r.ok ? "ok" : r.code + (r.needsMigration ? "+" : "-"); } catch (e) { return msg(e); } };
const patch = (text: string, fn: (s: Record<string, unknown>) => void): string => { const s = JSON.parse(text) as Record<string, unknown>; fn(s); return JSON.stringify(s); };
const logOf = (s: Record<string, unknown>): { header: { projectHash: string; seed: number }; entries: { seq: number }[] } => JSON.parse(String(s.log));
test("trusted saves (step 24)", () => {
  const { src, world, text } = play(); const save = JSON.parse(text) as { header: Record<string, string> };
  assert.deepEqual(Object.keys(save), ["kind", "formatVersion", "header", "log", "snapshot"]);
  assert.deepEqual(Object.keys(save.header), ["projectHash", "engineVersion", "projectId", "savedAt"]);
  const back = loadSave(src, text); assert.equal(back.ok && shot(back.world) === shot(world), true);
  assert.throws(() => saveMatch(world, { projectId: 5 as never, savedAt: meta.savedAt }), RangeError);
  assert.equal(code(text, { ...src, projectHash: "other" }) === "saveProjectMismatch-" && code(text, { ...src, engineVersion: "9" }) === "saveEngineMismatch-", true);
  assert.equal(code(patch(text, (s) => { s.formatVersion = 2; })) === "saveFormatNewer-", true);
  const junk = [5, "{", "[]", patch(text, (s) => { s.kind = "map"; }), patch(text, (s) => { s.log = 1; }), patch(text, (s) => { s.formatVersion = 1.5; }), patch(text, (s) => { s.header = { projectId: "p", savedAt: "t" }; })];
  assert.equal(junk.every((j) => code(j) === "load: not a match save"), true);
  assert.doesNotThrow(() => replay({ ...src, projectHash: "other" }, world.log, world.clock.tick()));
});
test("save opt-ins (step 24)", () => {
  const { src, world, text } = play(input("stage-fixed"), [99, 99]);
  const proj = loadSave({ ...src, projectHash: "other" }, text, { allowProjectMismatch: true }), eng = loadSave({ ...src, engineVersion: "9" }, text, { allowEngineMismatch: true });
  const one = (r: SaveLoad, name: string): boolean => r.ok && r.notices.length === 1 && r.notices[0]?.code === name && shot(r.world) === shot(world);
  assert.equal(one(proj, "saveProjectMismatch") && one(eng, "saveEngineMismatch"), true);
  assert.equal(code(text, { ...src, engineVersion: "9" }, { allowProjectMismatch: true }) === "saveEngineMismatch-" && code(text, { ...src, projectHash: "other" }, { allowEngineMismatch: true }) === "saveProjectMismatch-", true);
});
test("save migrations path (step 24)", () => {
  assert.deepEqual(Object.keys(SAVE_MIGRATIONS).sort(), ["match-save", "save"]);
  assert.equal(Object.keys(SAVE_MIGRATIONS.save).length + Object.keys(SAVE_MIGRATIONS["match-save"]).length === 0, true);
  const { text } = play(); const old = (n: number): string => patch(text, (s) => { s.formatVersion = n; });
  assert.equal(code(old(0)) === "saveFormatOlder+" && code(old(-3)) === "saveFormatOlder+", true);
  const s = { kind: "match-save" as const, formatVersion: 1 as const };
  const chains: SaveChains = { save: { 0: () => ({ kind: "save", formatVersion: 1 }) }, "match-save": { 0: () => ({ kind: "match-save", formatVersion: 1 }) } };
  assert.equal(migrateSave("match-save", s, 0) === null && migrateSave("match-save", s, 1) === s && (migrateSave("save", s, 0, 1, chains) as { kind: string }).kind === "save" && (migrateSave("match-save", s, 0, 1, chains) as { kind: string }).kind === "match-save", true);
  assert.equal(code(text) === "ok" && code(old(2)) === "saveFormatNewer-" && code(text, { ...input("stage-fixed"), projectHash: "x" }) === "saveProjectMismatch-", true);
});
test("the migrations hook is contained (step 24)", () => {
  const { src, world, text } = play(); const body = patch(text, (s) => { s.formatVersion = 0; });
  const reg = (step: SaveChains["match-save"][number]): SaveChains => ({ save: {}, "match-save": { 0: step } });
  const failed = (step: SaveChains["match-save"][number]): boolean => code(body, src, undefined, reg(step)) === "saveMigrationFailed+";
  const trap = (): Record<string, unknown> => { const o: Record<string, unknown> = { kind: "match-save", formatVersion: 1 }; Object.defineProperty(o, "log", { enumerable: true, get() { throw new Error("g"); } }); return o; };
  assert.equal(failed(() => { throw new Error("x"); }) && failed(() => new Proxy({}, { get() { throw new Error("x"); } }) as never) && failed(trap), true);
  assert.equal(failed(() => ({ kind: "match-save", formatVersion: 0 })) && failed(() => ({ kind: "save", formatVersion: 1 })), true);
  assert.equal([() => 5, () => null, () => "s", () => [], () => (() => undefined), () => ({ kind: "match-save", formatVersion: 1, map: new Map() })].every((fn) => failed(fn as never)), true);
  const honest = loadSave(src, body, undefined, reg(() => JSON.parse(text) as Record<string, unknown>));
  assert.equal(honest.ok && shot(honest.world) === shot(world), true);
  assert.equal(code(body, src, undefined, { save: { 0: () => JSON.parse(text) as Record<string, unknown> }, "match-save": {} }) === "saveFormatOlder+", true);
});
test("tamper reach (step 24)", () => {
  const { src, text } = play();
  assert.equal(code(patch(text, (s) => { const u = (s.snapshot as { units: { at: { c: number } }[] }).units[0]; if (u === undefined) throw new Error("unit"); u.at.c += 1; })) === "restore: snapshot does not match the log" && code(patch(text, (s) => { (s.snapshot as { rngState: { a: number } }).rngState.a = -1; })) === "restore: snapshot does not match the log", true);
  assert.equal(code(patch(text, (s) => { const log = logOf(s); log.header.projectHash = "edited"; s.log = JSON.stringify(log); })), "load: the log header is not the save header");
  const relabel = patch(text, (s) => { (s.header as { engineVersion: string }).engineVersion = "9.9.9"; });
  assert.equal(code(relabel) === "load: the log header is not the save header" && code(relabel, src, { allowEngineMismatch: true }) === "load: the log header is not the save header", true);
  assert.equal(code(patch(text, (s) => { const log = logOf(s); const e = log.entries[0]; if (e === undefined) throw new Error("entry"); e.seq = 9; s.log = JSON.stringify(log); })) === "load: bad entry" && code(patch(text, (s) => { const log = logOf(s); log.header.seed = 3; s.log = JSON.stringify(log); })).startsWith("replay: world seed "), true);
  const other = createWorld(src); submit(other, move("z", "knight#1", 99, 99, null));
  const got = loadSave(src, patch(text, (s) => { const alt = JSON.parse(saveMatch(other, meta)) as { log: string; snapshot: unknown }; s.log = alt.log; s.snapshot = alt.snapshot; }));
  assert.equal(got.ok && shot(got.world) === shot(other), true);
});
test("the log is read-only through an entry (step 24)", () => {
  const { world } = play(); const before = world.log.toJSON(); const entry = world.log.entries()[0]; if (entry === undefined) throw new Error("entry");
  assert.throws(() => { (entry.action as { kind: string }).kind = "x"; }, TypeError); assert.throws(() => { (entry as { tick: number }).tick = 3; }, TypeError);
  assert.throws(() => { (world.log.header as { seed: number }).seed = 1; }, TypeError); assert.throws(() => { (entry.action.effects as string[]).push("z"); }, TypeError);
  assert.equal(world.log.toJSON() === before && Object.isFrozen(entry) && Object.isFrozen(entry.action), true);
});
test("a direct reader refuses a live hostile document (step 24)", () => {
  const boom = new Proxy({}, { get() { throw new Error("boom"); } }); const rev = Proxy.revocable({}, {}); rev.revoke();
  const refused = (r: { readonly ok: boolean; readonly needsMigration?: boolean; readonly error?: string }): boolean => !r.ok && r.needsMigration === false && r.error === "unreadable document";
  assert.equal([readMap(boom), readManifest(boom), readStage(boom, BTF_STAGE_LIMITS), readMap(rev.proxy), readManifest(rev.proxy), readStage(rev.proxy, BTF_STAGE_LIMITS)].every(refused), true);
  const stage = JSON.parse(JSON.stringify(input("stage-fixed").stage)) as Record<string, unknown>;
  Object.defineProperty(stage, "id", { enumerable: true, get() { throw new Error("id"); } }); assert.equal(refused(readStage(stage, BTF_STAGE_LIMITS)), true);
  const cyc: Record<string, unknown> = { kind: "map", formatVersion: 5, id: "m" }; cyc.self = cyc; assert.doesNotThrow(() => readMap(cyc));
  assert.throws(() => readMap({}, null as never), RangeError); assert.throws(() => readManifest({}, null as never), RangeError); assert.throws(() => readStage(stage, null as never), RangeError);
});
test("restore checks before any work (step 24)", () => {
  const src = input("stage-fixed"), broken = { ...src, stage: { kind: "nope" } }, world = createWorld(src), text = saveMatch(world, meta);
  assert.throws(() => replay(broken, world.log, 1e9), (e: unknown) => msg(e) === "replay: tick or log over the limits");
  assert.equal(code(text, { ...broken, projectHash: "other" }) === "saveProjectMismatch-" && code(patch(text, (s) => { s.formatVersion = 7; }), broken) === "saveFormatNewer-", true);
});
test("one source for the BTF defaults (step 24)", () => {
  for (const k of ["totalRuns", "totalPoints", "totalTweaks", "bytes", "notices"] as const) assert.equal(BTF_SPRITE_RECIPE_LIMITS[k], RECIPE_CAPS[k][0]);
  assert.equal(BTF_STAGE_LIMITS.stages === DEFAULT_DOC_LIMITS.stages && (RECIPE_CAPS.historyBytes[1] ?? 0) < (RECIPE_CAPS.bytes[0] ?? 0), true);
  assert.equal(readSpriteRecipe(SAMPLE, { ...BTF_SPRITE_RECIPE_LIMITS, historyBytes: 1048576 }).ok, true);
  assert.throws(() => readSpriteRecipe(SAMPLE, { ...BTF_SPRITE_RECIPE_LIMITS, historyBytes: 1048577 }), { name: "RangeError", message: "readSpriteRecipe: limits must be integers >= 0" });
});
