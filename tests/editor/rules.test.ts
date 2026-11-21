import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { resetStageRule, setStageRule, sourceOf } from "../../src/editor/rules/rules.ts";
import { readProject } from "../../src/project/load/index.ts";
import { sliceOf } from "../../src/project/slice-of.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { BUNDLED } from "../../tools/maker/catalogue.ts";
import { rulesHtml } from "../../tools/maker/rules-panel.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { launchTest } from "../../tools/maker/test-launch.ts";
import { diagramCells, diagramHtml, diagramOf } from "../../tools/maker/unit-diagram.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { openProject, playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), STAGE = "stage_01JDAS00000000000000000001", NOW = "2026-11-21T00:00:00.000Z";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const bagOf = (rel: string): Record<string, Obj> => { const parsed = parseProject(walk(rel)); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const skel = (): Obj => { const doc = JSON.parse(readFileSync(join(root, "data/templates/setup.rule.json"), "utf8")) as unknown; if (!isObj(doc)) throw new Error("skel"); return doc; };
const played = (files: Record<string, Obj>) => { const load = readProject(files); if (!load.ok || load.project === null) throw new Error(load.report.map((row) => row.code).join(" ")); return { load, docs: playDocsOf(load.project) }; };
const land = (m: ReturnType<typeof createMatch>): void => { m.endTurn(); for (let i = 0; i < 40 && m.walk !== null; i += 1) { m.world.clock.advance(40); m.sync(); } };
function fell(m: ReturnType<typeof createMatch>): void {
  const me = m.world.units.all().find((u) => u.alive && u.side === m.sides.order[0]), rules = m.world.rules; if (me === undefined || rules == null) throw new Error("me");
  for (const foe of m.world.units.all().filter((u) => u.alive && u.side !== me.side && u.side !== "neutral")) {
    if (![{ c: me.at.c, r: me.at.r - 1 }, { c: me.at.c + 1, r: me.at.r }, { c: me.at.c - 1, r: me.at.r }, { c: me.at.c, r: me.at.r + 1 }].some((at) => m.world.units.moveTo(foe.id, at, "move").ok)) throw new Error("beside");
    for (let n = 0; n < 40 && (rules.state().units.find((u) => u.id === foe.id)?.hp ?? 0) > 0; n += 1) { const note = rules.act({ id: `h${n}`, kind: "ability", actor: me.id, target: { pipe: "unit", unitId: foe.id }, durationMs: null, turns: null, effects: [] }); if (note !== null) throw new Error(note.message); }
    if ((rules.state().units.find((u) => u.id === foe.id)?.hp ?? 1) !== 0) throw new Error("hp");
  }
}
test("stage rule overrides project rule", () => {
  const demo = bagOf("fixtures/demo.tileproj");
  assert.equal(sourceOf(demo, STAGE, "win-condition").source, "default"); assert.equal(played(demo).docs.win, undefined);
  const off = setStageRule(demo, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED);
  assert.equal(off.mode, "wrote"); if (off.mode !== "wrote") return;
  const stagePath = Object.keys(off.bag).find((path) => path.startsWith("stages/") && off.bag[path]?.["id"] === STAGE) ?? "", stage = off.bag[stagePath];
  assert.ok(isObj(stage) && Array.isArray(stage["rules"])); if (!isObj(stage) || !Array.isArray(stage["rules"])) return;
  const id = stage["rules"].at(-1), root = off.bag["project.json"]; assert.equal(typeof id, "string"); if (!isObj(root) || !isObj(root["project"]) || typeof id !== "string") return;
  const projectBag = { ...off.bag, [stagePath]: { ...stage, rules: stage["rules"].filter((item) => item !== id) }, "project.json": { ...root, project: { ...root["project"], rules: [...(Array.isArray(root["project"]["rules"]) ? root["project"]["rules"] : []), id] } } };
  assert.equal(sourceOf(projectBag, STAGE, "win-condition").source, "project"); assert.equal(played(projectBag).docs.win?.wipe, false);
  assert.equal(sourceOf(off.bag, STAGE, "win-condition").source, "stage"); assert.equal(played(off.bag).docs.win?.wipe, false);
  const on = setStageRule(projectBag, skel(), STAGE, "setup_01RULE0000000000000000001B", "win-condition", "wipe_wins", true, BUNDLED);
  assert.equal(on.mode, "wrote"); if (on.mode !== "wrote") return; assert.equal(sourceOf(on.bag, STAGE, "win-condition").source, "stage"); assert.equal(played(on.bag).docs.win?.wipe, true);
});
test("first rule edit re-cuts the slice", () => {
  const demo = bagOf("fixtures/demo.tileproj"), slice = demo["catalogue/slice.json"]; assert.ok(isObj(slice)); if (!isObj(slice)) return;
  const used = (Array.isArray(slice["behaviours"]) ? slice["behaviours"] : []).flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []);
  const got = setStageRule(demo, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED);
  assert.equal(got.mode, "wrote"); if (got.mode !== "wrote") return; assert.equal(got.slice, sliceOf(BUNDLED, [...used, "win-condition"])); assert.deepEqual(got.bag["catalogue/slice.json"], JSON.parse(got.slice));
  const setup = got.bag["setups/setup_01RULE0000000000000000001A.json"], stage = got.bag[Object.keys(got.bag).find((path) => path.startsWith("stages/") && got.bag[path]?.["id"] === STAGE) ?? ""];
  assert.equal(isObj(stage) && Array.isArray(stage["rules"]) && stage["rules"].at(-1), "setup_01RULE0000000000000000001A");
  assert.ok(isObj(setup) && isObj(setup["answers"])); if (!isObj(setup) || !isObj(setup["answers"])) return;
  assert.deepEqual(setup["answers"]["wipe_wins"], { source: "user", value: false, rev: 1 });
  for (const [key, row] of Object.entries(setup["answers"])) if (key !== "wipe_wins") assert.deepEqual(row, { source: "default" });
  const load = readProject(got.bag); assert.equal(load.ok, true); assert.deepEqual([...load.report], []);
});
test("win rule reaches Test", () => {
  const demo = bagOf("fixtures/demo.tileproj"), got = setStageRule(demo, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED);
  assert.equal(got.mode, "wrote"); if (got.mode !== "wrote") return; const off = played(got.bag); assert.equal(off.docs.win?.wipe, false);
  const quiet = createMatch(off.docs, 20); fell(quiet); land(quiet); assert.equal(quiet.outcome, null);
  const live = createMatch(played(demo).docs, 20); fell(live); land(live); assert.equal(live.outcome, "win");
});
test("win rule needs P = B", () => {
  const older = bagOf("fixtures/demo.tileproj"), root = older["project.json"]; assert.ok(isObj(root) && isObj(root["project"])); if (!isObj(root) || !isObj(root["project"])) return;
  root["project"] = { ...root["project"], catalogueRev: BUNDLED.catalogue_rev - 1 };
  const offer = rulesHtml(older, STAGE, false); assert.equal(offer.includes("New abilities are available. Update this project to use them?"), true); assert.equal(offer.includes("k:toggle"), false); assert.equal(offer.includes("r:update"), true);
  const before = JSON.stringify(older); assert.equal(setStageRule(older, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED).mode, "older"); assert.equal(JSON.stringify(older), before);
  const newer = bagOf("fixtures/demo.tileproj"), next = newer["project.json"]; if (!isObj(next) || !isObj(next["project"])) return;
  next["project"] = { ...next["project"], catalogueRev: BUNDLED.catalogue_rev + 1 };
  const note = rulesHtml(newer, STAGE, false); assert.equal(note.includes("This project was made with a newer TileEngine. Update the app to add abilities."), true); assert.equal(note.includes("k:toggle") || note.includes("r:reset"), false);
  assert.equal(setStageRule(newer, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED).mode, "newer");
});
test("wired win knob changes the adapter", () => {
  assert.deepEqual(WIRED["win-condition"], ["wipe_wins"]);
  const demo = bagOf("fixtures/demo.tileproj"), got = setStageRule(demo, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED);
  assert.equal(got.mode, "wrote"); if (got.mode !== "wrote") return;
  const setup = got.bag["setups/setup_01RULE0000000000000000001A.json"]; assert.ok(isObj(setup) && isObj(setup["answers"])); if (!isObj(setup) || !isObj(setup["answers"])) return;
  setup["answers"] = { ...setup["answers"], mutual_wipe: { source: "user", value: "last-actor-loses", rev: 1 } };
  assert.equal(played(got.bag).docs.win?.wipe, false); assert.equal(played(got.bag).docs.win?.mutual, "last-actor-loses"); assert.equal(rulesHtml(got.bag, STAGE, false).includes("k:toggle:wipe_wins"), true); assert.equal(rulesHtml(got.bag, STAGE, false).includes("mutual_wipe"), false);
  const back = resetStageRule(got.bag, STAGE, "win-condition", "wipe_wins"); assert.equal(back.mode, "wrote"); if (back.mode !== "wrote") return; assert.equal(played(back.bag).docs.win?.wipe, true);
});
test("empty template plays", () => { const opened = openProject(bagOf("data/templates/empty.tileproj")); assert.notEqual(opened.docs, null); assert.equal(opened.error, ""); });
test("empty board asks for a unit", async () => {
  const id = "project_01JDEM00000000000000000001", store = memoryStore(), stored = walk("data/templates/empty.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  let started = false; const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(bagOf("data/templates/empty.tileproj")), from: "project", now: NOW, start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return; assert.equal(got.lines[0], "Place a unit on this stage to test it.");
});
test("old empty project gets the plain sentence", () => {
  const parsed = parseProject(walk("data/templates/empty.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const files = Object.fromEntries(Object.entries(parsed.files).filter(([path]) => !path.startsWith("setups/")));
  const rootDoc = files["project.json"]; if (!isObj(rootDoc) || !isObj(rootDoc["project"])) throw new Error("project");
  rootDoc["project"] = { ...rootDoc["project"], catalogueRev: 1, rules: [] };
  files["catalogue/slice.json"] = { kind: "catalogue-slice", formatVersion: 1, schema_version: 1, catalogue_rev: 1, gates: {}, behaviours: [] };
  const html = diagramHtml(diagramOf(files, "unit_missing", "line-shot", null));
  assert.equal(html.includes("This project has no unit roster yet, so it can&#39;t be played"), true); assert.equal(html.includes("play: army"), false);
  assert.throws(() => diagramCells(files, "unit_missing", "line-shot", null), (err: unknown) => err instanceof Error && err.message === "play: army");
});
