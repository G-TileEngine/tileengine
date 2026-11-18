import assert from "node:assert/strict";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";

const body = { id: "p", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: [] as string[], rules: [] as string[], loadout: { roster: [] as string[], size: 0, required: [] as string[] } };

test("P3: missing, string, fractional, older and newer formatVersion never become current", () => {
  const cases: readonly (readonly [unknown, string])[] = [[undefined, "invalidValue"], ["6", "invalidValue"], [6.5, "invalidValue"], [3, "formatOlder"], [7, "formatNewer"]];
  for (const [ver, code] of cases) {
    const doc: { kind: string; project: typeof body; formatVersion?: unknown } = { kind: "tile-project", project: body };
    if (ver !== undefined) doc.formatVersion = ver;
    const files = { "project.json": doc }, before = structuredClone(files), got = readProject(files);
    assert.deepEqual(files, before, String(ver)); assert.equal(got.ok, false, String(ver)); assert.equal(got.readOnly, true, String(ver));
    assert.equal(got.project, null, String(ver)); assert.equal(got.report[0]?.code, code, String(ver)); assert.equal(got.report[0]?.severity, "hard", String(ver));
    assert.equal(got.report[0]?.path.startsWith("project.json"), true, String(ver)); assert.equal(got.report.some((r) => r.code === "migrated"), false, String(ver));
  }
});
