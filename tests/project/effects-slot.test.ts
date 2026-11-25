import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { readProject } from "../../src/project/load/index.ts";
import { stepTimes } from "../../src/runtime/render/fx-doc.ts";
import { assetRows } from "../../tools/maker/asset-check.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { createPlayFx, HOUSE_ATTACK, LINE_SHOT_DOC } from "../../tools/play-stage/fx.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
import { loadFixture, U } from "../tools/demo-fixture.ts";
const FRESH = "effect_01JDB10B00000000000000000A", LEGACY = "setup_01JDB10B00000000000000000B", BAD = "effect_not_an_ulid", GONE = "effect_01JDB10B00000000000000000Z", LINE = "setups/setup_01JDAT00000000000000000005.json", BASIC = "setups/setup_01JDAT00000000000000000004.json", ARCHER = `${U.archer}#2`;
const EFFECT = (JSON.parse(readFileSync(new URL("../../behaviour-library/behaviours.json", import.meta.url), "utf8")) as { behaviours: { id?: string }[] }).behaviours.find((b) => b.id === "effect");
const fxDoc = (id: string): Record<string, unknown> => ({ kind: "behaviour-setup", formatVersion: 3, id, rev: 1, behaviourId: "effect", catalogue: { rev: 30 }, answers: { steps: { source: "user", value: [{ kind: "stamp", seconds: 0.15 }] } } });
const filesOf = (): Record<string, unknown> => ({ ...loadFixture() });
const answer = (files: Record<string, unknown>, path: string, value: string): void => { const doc = files[path]; if (typeof doc !== "object" || doc === null || Array.isArray(doc)) throw new Error(path); const bag = doc as Record<string, unknown>, prev = bag["answers"], answers = typeof prev === "object" && prev !== null && !Array.isArray(prev) ? prev as Record<string, unknown> : {}; answers["effect"] = { source: "user", value, rev: 1 }; bag["answers"] = answers; };
const addEffect = (files: Record<string, unknown>): void => { const slice = files["catalogue/slice.json"]; if (typeof slice !== "object" || slice === null || Array.isArray(slice) || EFFECT === undefined) throw new Error("slice"); const bag = slice as Record<string, unknown>; bag["behaviours"] = [...(Array.isArray(bag["behaviours"]) ? bag["behaviours"] : []), structuredClone(EFFECT)]; };
const act = (effects: readonly string[], actor = ARCHER): Action => ({ id: "a1", kind: "ability", actor, target: null, durationMs: null, turns: null, effects });
const read = (files: Record<string, unknown>) => { const load = readProject(files); if (load.project === null) throw new Error(load.report.map((r) => r.code).join(" ")); return load; };
const at = (load: ReturnType<typeof read>, code: string, path: string) => load.report.filter((r) => r.code === code && r.path === path);
const shot = (effects: readonly string[]) => ({ entries: () => [{ seq: 1, tick: 0, action: act(effects) }] });
const bash = { entries: () => [{ seq: 2, tick: 0, action: act([], `${U.archer}#1`) }] };
test("10b D22b effects/ slot: effect docs load into project.effects; setup_<ULID> is legacyEffectId (info) and still loads; another id shape is badEffectId (warning) and still loads; a non-effect doc is unknownFile (behaviourId), not loaded; .deleted/ is skipped with no row", () => {
  const files = filesOf(); files[`effects/${FRESH}.json`] = fxDoc(FRESH); files[`effects/${LEGACY}.json`] = fxDoc(LEGACY); files[`effects/${BAD}.json`] = fxDoc(BAD);
  files["effects/talk.json"] = { ...fxDoc("setup_01JDB10B00000000000000000C"), behaviourId: "talk" }; files["effects/.deleted/effect_01JDB10B00000000000000000D.json"] = fxDoc("effect_01JDB10B00000000000000000D");
  const load = read(files), fx = load.project.effects;
  assert.equal(fx[FRESH]?.["id"], FRESH); assert.equal(fx[LEGACY]?.["id"], LEGACY); assert.equal(fx[BAD]?.["id"], BAD); assert.equal(fx["setup_01JDB10B00000000000000000C"], undefined); assert.equal(fx["effect_01JDB10B00000000000000000D"], undefined);
  assert.equal(at(load, "legacyEffectId", `effects/${LEGACY}.json`)[0]?.severity, "info"); assert.equal(at(load, "badEffectId", `effects/${BAD}.json`)[0]?.severity, "warning"); assert.equal(at(load, "unknownFile", "effects/talk.json")[0]?.detail, "behaviourId");
  assert.equal(load.report.some((r) => r.path.includes(".deleted")), false); assert.equal(load.project.unknownFiles["effects/.deleted/effect_01JDB10B00000000000000000D.json"], undefined);
});
test("10b effect refs: an ability's effect answer naming no loaded effect is unknownRef (warning, runs as the stock drawing); none and a loaded id (new or legacy) give no row (built-ins: tests 5 and 6)", () => {
  const files = filesOf(); files[`effects/${FRESH}.json`] = fxDoc(FRESH); files[`effects/${LEGACY}.json`] = fxDoc(LEGACY);
  answer(files, LINE, GONE); answer(files, BASIC, "none"); answer(files, "setups/setup_01JDAT00000000000000000001.json", FRESH); answer(files, "setups/setup_01JDAT00000000000000000002.json", LEGACY);
  const load = read(files), row = at(load, "unknownRef", `${LINE}#/answers/effect/value`), docs = playDocsOf(load.project);
  assert.equal(row.length, 1); assert.equal(row[0]?.severity, "warning"); assert.equal(row[0]?.detail, GONE); assert.equal(load.report.some((r) => r.code === "unknownRef" && (r.detail === "none" || r.detail === FRESH || r.detail === LEGACY)), false);
  assert.equal(createPlayFx(docs.effects, (caster, ref) => docs.fxOf?.[`${caster.split("#")[0]}|${ref}`]).ingest(shot(["line-shot"]), 10, 200).length, 1); assert.equal(stepTimes(LINE_SHOT_DOC).endMs, 484);
});
test("10b play path: Test plays the caster's saved effect by exact id (a legacy setup_ id too) for its line-shot and its basic attack; with no answer the stock drawing plays (150 ms saved vs 484 ms stock)", () => {
  const plain = playDocsOf(read(filesOf()).project), files = filesOf(); files[`effects/${FRESH}.json`] = fxDoc(FRESH); files[`effects/${LEGACY}.json`] = fxDoc(LEGACY); answer(files, LINE, FRESH); answer(files, BASIC, LEGACY);
  const docs = playDocsOf(read(files).project), pick = (caster: string, ref: string) => docs.fxOf?.[`${caster.split("#")[0]}|${ref}`], saved = createPlayFx(docs.effects, pick), hit = createPlayFx(docs.effects, pick);
  assert.equal(docs.rules.abilities?.[U.archer]?.[0]?.effectRef, "line-shot"); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], FRESH); assert.equal(docs.fxOf?.[`${U.archer}|${HOUSE_ATTACK}`], LEGACY);
  assert.equal(saved.ingest(shot(["line-shot"]), 10, 100).length, 1); assert.equal(saved.ingest(shot(["line-shot"]), 10, 200).length, 0); assert.equal(hit.ingest(bash, 10, 100).length, 1); assert.equal(hit.ingest(bash, 10, 200).length, 0);
  assert.equal(plain.fxOf, undefined); assert.equal(createPlayFx(plain.effects).ingest(shot(["line-shot"]), 10, 200).length, 1); assert.equal(stepTimes({ steps: [{ kind: "stamp", seconds: 0.15 }] }).endMs, 150);
});
test("10b asset check (Law 12): when the project can't be migrated, assetRows says so with one hard row instead of checking the raw files", async () => {
  const files = { "project.json": { formatVersion: 6, project: { assets: { asset_dead: { ext: "png" } }, stages: ["s"] } }, "stages/s.json": { id: "s", mapRef: "m" }, "maps/m.json": { id: "m", background: { layers: [{ assetId: "asset_dead" }] } }, boom: () => 0 };
  assert.deepEqual(await assetRows(memoryStore(), "proj/", files), [{ code: "invalidValue", severity: "hard", path: "project.json", detail: "unreadable" }]);
});
test("10b r2 built-in answers: a bare BTF id matched against the slice's effect presets gives no row and runs stock; with no such preset in the slice it is unknownRef", () => {
  const bare = filesOf(); answer(bare, LINE, "btf-purple-drop"); const missing = read(bare); assert.equal(at(missing, "unknownRef", `${LINE}#/answers/effect/value`)[0]?.detail, "btf-purple-drop");
  const files = filesOf(); addEffect(files); answer(files, LINE, "btf-purple-drop"); const load = read(files), docs = playDocsOf(load.project);
  assert.equal(load.report.some((r) => r.code === "unknownRef" && r.detail === "btf-purple-drop"), false); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], undefined);
  assert.equal(createPlayFx(docs.effects, (caster, ref) => docs.fxOf?.[`${caster.split("#")[0]}|${ref}`]).ingest(shot(["line-shot"]), 10, 200).length, 1);
});
test("10b r2 alias: builtin:effect/<id> reads as the bare id (no row) and is never rewritten; an alias naming no preset is unknownRef", () => {
  const files = filesOf(), alias = "builtin:effect/btf-purple-drop", bad = "builtin:effect/not-a-preset"; addEffect(files); answer(files, LINE, alias); answer(files, BASIC, bad);
  const load = read(files), setup = load.project.setups["setup_01JDAT00000000000000000005"], answers = setup?.["answers"], effect = typeof answers === "object" && answers !== null && !Array.isArray(answers) ? (answers as Record<string, unknown>)["effect"] : undefined;
  assert.equal(at(load, "unknownRef", `${LINE}#/answers/effect/value`).length, 0); assert.equal(at(load, "unknownRef", `${BASIC}#/answers/effect/value`)[0]?.detail, bad);
  assert.equal(typeof effect === "object" && effect !== null && !Array.isArray(effect) && (effect as Record<string, unknown>)["value"], alias);
});
