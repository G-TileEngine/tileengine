import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { readManifest, readMap, readStage, type StageLimits } from "../../src/project/read/index.ts";
import { BTF_STAGE_LIMITS } from "../../src/btf-adapters/src/index.ts";

const load = (name: string): Record<string, unknown> => JSON.parse(readFileSync(new URL(`../fixtures/project/${name}.json`, import.meta.url), "utf8")) as Record<string, unknown>;
const text = (v: { ok: boolean; needsMigration?: boolean; error?: string }): string => v.ok || v.needsMigration ? "" : (v.error ?? "");
const lim: StageLimits = { picks: 4, waveUnits: 5 };
const stage = (pool: unknown, limits: StageLimits = lim): string => text(readStage({ ...load("stage-weighted"), enemyPool: pool }, limits));
const spot = [{ c: 0, r: 0 }];
const wave = (counts: readonly number[], turn = 0): unknown => ({ mode: "waves", spawns: spot, waves: [{ turn, entries: counts.map((count) => ({ unitId: "wolf", count })) }] });
const weighted = (picks: number, weight = 1): unknown => ({ mode: "weighted", picks, allowRepeats: true, spawns: spot, entries: [{ unitId: "wolf", weight }] });
const project = { id: "p", rev: 1, catalogueRev: 1, stages: ["a"], rules: [], loadout: { roster: ["k"], size: 1, required: [] }, settings: { wrapEdges: false } };

test("B2: a wrong kind is object for any object or array, else the old String text, in all three readers", () => {
  const hostile = { toString(): string { throw new Error("boom"); }, valueOf(): number { throw new Error("boom"); } };
  const read = (kind: unknown, doc: "map" | "stage" | "manifest"): string => text(doc === "map" ? readMap({ ...load("map-6x9"), kind }) : doc === "stage" ? readStage({ ...load("stage-fixed"), kind }, BTF_STAGE_LIMITS) : readManifest({ kind, formatVersion: 6, project }));
  for (const doc of ["map", "stage", "manifest"] as const) for (const kind of [hostile, [], {}]) assert.equal(read(kind, doc), "wrong kind object");
  assert.equal(read(7, "map") === "wrong kind 7" && read(null, "stage") === "wrong kind null" && read("stage", "map") === "wrong kind stage", true);
});
test("B3: picks and a wave's summed counts are capped by the caller; at the cap reads; bad limits throw", () => {
  assert.equal(stage(weighted(4)) === "" && stage(weighted(5)) === "bad field enemyPool" && stage(weighted(1e9)) === "bad field enemyPool", true);
  assert.equal(stage(wave([2, 3])) === "" && stage(wave([3, 3])) === "bad field enemyPool" && stage(wave([1e9])) === "bad field enemyPool" && stage(wave([5], 1)) === "", true);
  for (const limits of [{ picks: -1, waveUnits: 0 }, { picks: 1.5, waveUnits: 1 }, { picks: 1, waveUnits: Number.NaN }]) assert.throws(() => readStage(load("stage-fixed"), limits), (err: unknown) => err instanceof RangeError && err.message === "readStage: limits must be integers >= 0");
  assert.deepEqual(BTF_STAGE_LIMITS, { picks: 144, waveUnits: 144, side: 64, objects: 1024, edges: 16384, footprint: 8, spots: 144, waves: 256, turn0: 144, text: 128, notices: 256 });
  assert.equal(readStage(load("stage-fixed"), BTF_STAGE_LIMITS).ok && readStage(load("stage-weighted"), BTF_STAGE_LIMITS).ok, true);
});
test("B4: a weighted weight must be finite; 0, negative and 2.5 still read", () => {
  assert.equal(stage(weighted(1, Number.POSITIVE_INFINITY)) === "bad field enemyPool" && stage(weighted(1, Number.NEGATIVE_INFINITY)) === "bad field enemyPool", true);
  assert.equal(stage(weighted(1, 0)) === "" && stage(weighted(1, -1)) === "" && stage(weighted(1, 2.5)) === "", true);
});
test("a map palette key __proto__ is dropped with one notice on both returns; a fixture has none", () => {
  const held = JSON.parse(JSON.stringify(load("map-6x9")).replace('"0":"floor"', '"__proto__":"x","0":"floor"')) as { logic: { palette: object } };
  const notice = '[{"code":"droppedKey","message":"palette key __proto__ dropped"}]';
  for (const map of [held, { ...held, objects: [] }]) {
    const read = readMap(map);
    assert.equal(read.ok && !Object.hasOwn(read.doc.logic.palette, "__proto__") && read.doc.logic.palette["0"] === "floor" && JSON.stringify(read.notices) === notice, true);
  }
  const plain = readMap(load("map-6x9"));
  assert.equal(plain.ok && plain.notices.length === 0, true);
});
