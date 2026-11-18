import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";

const project = { kind: "tile-project", formatVersion: 6, project: { id: "p", rev: 1, catalogueRev: 28, settings: { wrapEdges: false }, stages: [] as string[], rules: [] as string[], loadout: { roster: [] as string[], size: 0, required: [] as string[] } } };
const slice = { kind: "catalogue-slice", formatVersion: 1 };

test("P1: a non-object or a broken field is a hard row, never a default project", () => {
  const broken = { "project.json": project, "catalogue/slice.json": slice, "units/u.json": { kind: "unit", formatVersion: 2, id: "u", rev: 1, stats: { unit_hp: { value: "no", rev: 1 } } } };
  const before = structuredClone(broken), got = readProject(broken);
  assert.deepEqual(broken, before); assert.equal(got.ok, false); assert.equal(got.readOnly, false); assert.notEqual(got.project, null);
  assert.equal(got.report.some((r) => r.code === "invalidValue" && r.severity === "hard" && r.path === "units/u.json#/stats"), true);
  assert.equal(got.project?.units["u"] !== undefined, true); assert.equal(JSON.stringify(got.project).includes("\"Demo\""), false);
  const naked = readProject({ "project.json": project, "catalogue/slice.json": slice, "units/u.json": 1 });
  assert.equal(naked.ok, false); assert.equal(naked.readOnly, true); assert.equal(naked.project, null);
  assert.equal(naked.report.some((r) => r.code === "invalidValue" && r.severity === "hard" && r.path.startsWith("units/u.json")), true);
  const root = readProject({ "project.json": [] });
  assert.equal(root.ok, false); assert.equal(root.project, null); assert.equal(root.report[0]?.code, "notAProject"); assert.equal(root.report[0]?.path, "project.json");
});

test("P1: an empty catch under src/project or tools/play-stage fails this plant", () => {
  const hits: string[] = [];
  const walk = (dir: string): void => { for (const ent of readdirSync(dir, { withFileTypes: true })) { const path = join(dir, ent.name); if (ent.isDirectory()) walk(path); else if (ent.name.endsWith(".ts") && /catch(?:\s*\([^)]*\))?\s*\{\s*\}/.test(readFileSync(path, "utf8"))) hits.push(path); } };
  walk("src/project"); walk("tools/play-stage"); assert.deepEqual(hits, []);
});
