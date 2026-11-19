import assert from "node:assert/strict";
import { test } from "node:test";
import { sentence, testGate } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import { loadFixture } from "../tools/demo-fixture.ts";
const HARD = ["brokenRef", "invalidValue", "terrainLength", "formatNewer", "formatOlder", "notAProject"] as const;
test("a clean project is allowed and each hard code has its sentence", () => {
  const load = readProject(loadFixture());
  assert.equal(testGate(load.report, load.readOnly).allowed, true);
  assert.equal(testGate([{ code: "outOfRange", severity: "warning", path: "x" }], false).allowed, true);
  for (const code of HARD) {
    const row = { code, severity: "hard" as const, path: code === "brokenRef" ? "stages/stage.json#/mapRef" : "project.json" };
    const gate = testGate([row], false);
    assert.equal(gate.allowed, false); if (gate.allowed) return;
    assert.equal(gate.lines[0], sentence(row)); assert.equal(gate.lines[0]?.includes(code), false);
  }
  const manifest = loadFixture()["project.json"];
  if (typeof manifest !== "object" || manifest === null) throw new Error("project");
  const newer = readProject({ ...loadFixture(), "project.json": { ...manifest, formatVersion: 7 } });
  const refused = testGate(newer.report, newer.readOnly);
  assert.equal(refused.allowed, false); if (!refused.allowed) assert.match(refused.lines[0] ?? "", /newer TileEngine/);
});
