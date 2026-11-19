import assert from "node:assert/strict"; import { test } from "node:test";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os"; import { join } from "node:path"; import { fileURLToPath, pathToFileURL } from "node:url";
import { readProject } from "../../src/project/load/index.ts";
import { build } from "../../tools/play-stage/build.ts";
import { RECIPES } from "../../tools/play-stage/load.ts";
import { bundledFiles, playDocsOf } from "../../tools/play-stage/project.ts";
const SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", REPO = fileURLToPath(new URL("../../", import.meta.url));
test("carry A: RECIPES stays frozen and each load keeps its own aliases", () => {
  const snap = structuredClone(RECIPES), load = readProject(bundledFiles());
  if (!load.ok || load.readOnly || load.project === null) throw new Error("demo");
  const first = playDocsOf(load.project), id = "unit_01JOTHER000000000000000001", knight = load.project.units["unit_01JDAN00000000000000000001"];
  if (knight === undefined || first.recipes === undefined) throw new Error("knight");
  const second = playDocsOf({ ...load.project, units: { [id]: { ...knight, id, name: "Knight" } } }), aliases = Object.keys(first.recipes).filter((key) => !Object.hasOwn(RECIPES, key));
  assert.deepEqual(RECIPES, snap); assert.ok(aliases.length > 0);
  for (const key of aliases) assert.equal(second.recipes !== undefined && Object.hasOwn(second.recipes, key), false);
  assert.equal(second.recipes?.[id]?.name, "Knight"); assert.equal(Object.hasOwn(RECIPES, aliases[0] ?? ""), false);
});
test("carry B: U+2028 and U+2029 are escaped in .json.js and import back", async () => {
  const root = mkdtempSync(join(tmpdir(), "carry-b-")), out = mkdtempSync(join(tmpdir(), "carry-out-"));
  for (const dir of ["src", "tools", "fixtures"]) cpSync(join(REPO, dir), join(root, dir), { recursive: true });
  const file = join(root, "fixtures/demo.tileproj/project.json"), doc = JSON.parse(readFileSync(file, "utf8")) as { project: { name: string } };
  doc.project.name = "A\u2028B\u2029C"; writeFileSync(file, JSON.stringify(doc)); build(out, SHA, root);
  const emitted = readFileSync(join(out, "fixtures/demo.tileproj/project.json.js"), "utf8");
  assert.equal(emitted.includes("\u2028") || emitted.includes("\u2029"), false); assert.match(emitted, /\\u2028/); assert.match(emitted, /\\u2029/);
  const mod = await import(pathToFileURL(join(out, "fixtures/demo.tileproj/project.json.js")).href) as { default: { project: { name: string } } };
  assert.equal(mod.default.project.name, "A\u2028B\u2029C"); rmSync(root, { recursive: true }); rmSync(out, { recursive: true });
});
