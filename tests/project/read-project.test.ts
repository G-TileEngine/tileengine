import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { readProject, type ProjectLoad } from "../../src/project/load/index.ts";
import { sliceOf, type CatalogueDoc } from "../../tools/project/slice-of.ts";
const root = join(dirname(fileURLToPath(import.meta.url)), "../../fixtures/demo.tileproj");
const MAP = "maps/map_01JDAM00000000000000000001.json", STAGE = "stages/stage_01JDAS00000000000000000001.json";
const ARCHER = "units/unit_01JDAN00000000000000000002.json", KNIGHT = "units/unit_01JDAN00000000000000000001.json";
const IDS = ["ability-presentation", "basic-attack", "line-shot", "barrier-line", "adjacency-synergy", "unit-roster", "talk", "terrain"];
function walk(dir: string, base = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const rel = base === "" ? ent.name : `${base}/${ent.name}`;
    if (ent.isDirectory()) Object.assign(out, walk(join(dir, ent.name), rel));
    else out[rel] = JSON.parse(readFileSync(join(dir, ent.name), "utf8")) as unknown;
  }
  return out;
}
const bag = (): Record<string, unknown> => walk(root);
const obj = (v: unknown): Record<string, unknown> => (typeof v === "object" && v !== null && !Array.isArray(v) ? v as Record<string, unknown> : {});
function kept(files: Record<string, unknown>): ProjectLoad {
  const before = structuredClone(files), got = readProject(files);
  assert.deepEqual(files, before);
  return got;
}
test("fixture clean, and slice-of is byte-equal to catalogue/slice.json", () => {
  const files = bag(), got = kept(files), text = readFileSync(join(root, "catalogue/slice.json"), "utf8");
  const raw = JSON.parse(text) as { schema_version: number; catalogue_rev: number; gates: unknown; behaviours: Record<string, unknown>[] };
  const drop = { sources: ["x"], variants: [], used_by: [], conflicts: [], needs_reverify: true };
  const behaviours = [...raw.behaviours.map((b) => ({ ...b, ...drop, knobs: Array.isArray(b["knobs"]) ? (b["knobs"] as Record<string, unknown>[]).map((knob) => ({ ...knob, default_source: "y", item_cites: [], item_sources: [] })) : [] })), { id: "effect", ...drop, knobs: [] }];
  const cat: CatalogueDoc = { schema_version: raw.schema_version, catalogue_rev: raw.catalogue_rev, gates: raw.gates, behaviours };
  assert.equal(got.ok, true); assert.equal(got.readOnly, false); assert.deepEqual([...got.report], []);
  assert.equal(sliceOf(cat, IDS), text);
  assert.deepEqual(raw.behaviours.map((b) => b["id"]), IDS);
  assert.equal(Object.keys(files).every((path) => path.endsWith(".json")), true);
});
test("(b) v4 tile-project and map upgrade to the v6/v5 store", () => {
  const clean = readProject(bag()), files = bag(), project = obj(files["project.json"]), render = obj(obj(project["project"])["render"]);
  project["formatVersion"] = 4; delete render["proceduralShip"]; delete render["credits"];
  const map = obj(files[MAP]); map["formatVersion"] = 4; map["background"] = { mode: "none" };
  const got = kept(files);
  assert.equal(got.ok, true); assert.equal(project["formatVersion"], 4); assert.deepEqual(got.project, clean.project);
  assert.deepEqual(got.report.filter((r) => r.code === "migrated").map((r) => r.detail), ["map 4→5", "tile-project 4→5", "tile-project 5→6"]);
});
test("(c) v7 is refused read-only and does not throw", () => {
  const files = bag(); obj(files["project.json"])["formatVersion"] = 7;
  assert.doesNotThrow(() => readProject(files));
  const got = kept(files);
  assert.equal(got.ok, false); assert.equal(got.readOnly, true); assert.equal(got.project, null);
  assert.equal(got.report[0]?.code, "formatNewer"); assert.equal(got.report[0]?.path.startsWith("project.json"), true);
});
test("(d) H3 missing mapRef is a hard brokenRef and the project stays", () => {
  const files = bag(); obj(files[STAGE])["mapRef"] = "map_missing";
  const got = kept(files), row = got.report.find((r) => r.code === "brokenRef");
  assert.equal(got.ok, false); assert.equal(got.readOnly, false); assert.notEqual(got.project, null);
  assert.equal(row?.severity, "hard"); assert.equal(row?.path, `${STAGE}#/mapRef`);
  assert.equal(got.project?.maps["map_01JDAM00000000000000000001"] !== undefined && got.project?.stages["stage_01JDAS00000000000000000001"] !== undefined, true);
});
test("(e) H5 terrain of length 53 is a hard terrainLength", () => {
  const files = bag(), logic = obj(obj(files[MAP])["logic"]);
  logic["terrain"] = (logic["terrain"] as unknown[]).slice(0, 53);
  const got = kept(files), row = got.report.find((r) => r.code === "terrainLength");
  assert.equal(got.ok, false); assert.equal(row?.severity, "hard"); assert.equal(row?.path, `${MAP}#/logic/terrain`);
  assert.equal(String(row?.detail).includes("53"), true);
});
test("(f) H2 archer stats.unit_hp.value string is a hard invalidValue", () => {
  const files = bag(), stats = obj(obj(files[ARCHER])["stats"]);
  obj(stats["unit_hp"])["value"] = "6";
  const got = kept(files), row = got.report.find((r) => r.code === "invalidValue" && r.path === `${ARCHER}#/stats`);
  assert.equal(got.ok, false); assert.equal(got.readOnly, false); assert.equal(row?.severity, "hard");
  assert.equal(got.project?.units["unit_01JDAN00000000000000000002"] !== undefined, true);
});
test("(g) unknown keys and an extra file are kept", () => {
  const files = bag();
  obj(files["project.json"])["futureKey"] = 1; obj(files[KNIGHT])["futureKey"] = { keep: true }; files["notes/x.json"] = { note: true };
  const got = kept(files);
  assert.equal(got.ok, true); assert.equal(obj(got.project?.manifest)["futureKey"], 1);
  assert.deepEqual(obj(got.project?.units["unit_01JDAN00000000000000000001"])["futureKey"], { keep: true });
  assert.deepEqual(got.project?.unknownFiles["notes/x.json"], { note: true });
  assert.equal(got.report.some((r) => r.code === "unknownFile" && r.severity === "warning" && r.path === "notes/x.json"), true);
});
