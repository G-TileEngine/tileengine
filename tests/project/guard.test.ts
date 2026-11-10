import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CURRENT_FORMAT_VERSIONS, checkVersion, readManifest, readMap, readStage } from "../../src/project/read/index.ts";

const load = (name: string): Record<string, unknown> => JSON.parse(readFileSync(new URL(`../fixtures/project/${name}.json`, import.meta.url), "utf8")) as Record<string, unknown>;
const project = { id: "p", rev: 1, catalogueRev: 1, stages: ["a"], rules: [], loadout: { roster: ["k"], size: 1, required: [] } };

test("current versions are accepted: map 5, stage 2, tile-project 6", () => {
  const manifest = { kind: "tile-project", formatVersion: 6, project: { ...project, settings: { wrapEdges: false } } };
  assert.equal(readMap(load("map-6x9")).ok && readStage(load("stage-fixed")).ok && readManifest(manifest).ok, true);
  assert.deepEqual([CURRENT_FORMAT_VERSIONS.map, CURRENT_FORMAT_VERSIONS.stage, CURRENT_FORMAT_VERSIONS["tile-project"]], [5, 2, 6]);
});
test("any other formatVersion needs migration and is never patched", () => {
  const map = load("map-6x9");
  for (const found of [4, 6]) {
    map.formatVersion = found;
    assert.deepEqual(readMap(map), { ok: false, needsMigration: true, kind: "map", found });
    assert.equal(map.formatVersion, found);
  }
  const stage = load("stage-fixed");
  stage.formatVersion = 1;
  assert.deepEqual(readStage(stage), { ok: false, needsMigration: true, kind: "stage", found: 1 });
  assert.equal(stage.formatVersion, 1);
});
test("not an object, wrong kind or a non-integer formatVersion is a hard error", () => {
  const hard = (json: unknown, error: string) => assert.deepEqual(checkVersion(json, "map"), { ok: false, needsMigration: false, error });
  hard(null, "not an object");
  hard({ kind: "stage", formatVersion: 5 }, "wrong kind stage");
  hard({ kind: "map", formatVersion: "5" }, "bad field formatVersion");
  assert.equal(checkVersion(load("map-6x9"), "map"), null);
});
test("manifest: settings pass through; wrapEdges is read, the grid owns its notice", () => {
  const ok = readManifest({ kind: "tile-project", formatVersion: 6, project: { ...project, settings: { wrapEdges: true, occupancy: "softStack" } } });
  assert.equal(ok.ok && ok.notices.length === 0 && ok.doc.project.settings.wrapEdges === true && ok.doc.project.settings.occupancy === "softStack", true);
  const bad = readManifest({ kind: "tile-project", formatVersion: 6, project: { ...project, settings: { wrapEdges: "yes" } } });
  assert.deepEqual(bad, { ok: false, needsMigration: false, error: "bad field project" });
});
