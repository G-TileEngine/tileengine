import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";
const root = "fixtures/demo.tileproj", where = "setups/setup_01JDAT00000000000000000002.json#/answers/shortcut/value";
const bag = (): Record<string, unknown> => { const out: Record<string, unknown> = {}, walk = (dir: string, base = ""): void => { for (const name of readdirSync(dir)) { const path = join(dir, name), rel = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, rel); else out[rel] = JSON.parse(readFileSync(path, "utf8")) as unknown; } }; walk(root); return out; };
test("picker options as {value, label}: a listed value passes; an unlisted or non-string value is invalidValue", () => {
  assert.deepEqual([...readProject(bag()).report], []);
  for (const value of ["not-an-option", 3, true, { value: "all-menu" }]) {
    const files = bag(), setup = files["setups/setup_01JDAT00000000000000000002.json"] as { answers: { shortcut: { value: unknown } } };
    setup.answers.shortcut.value = value; const got = readProject(files), row = got.report[0];
    assert.equal(got.report.length, 1); assert.equal(row?.code, "invalidValue"); assert.equal(row?.severity, "hard"); assert.equal(row?.path, where);
  }
});
