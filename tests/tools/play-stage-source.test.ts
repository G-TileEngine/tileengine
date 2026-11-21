import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { WIN_CONDITION, wipeRule } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createWorld, runMatch, snapshot } from "../../src/sim/index.ts";
import { projectScreen } from "../../tools/maker/project.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { launchTest, openSaved } from "../../tools/maker/test-launch.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { DEMO_LOOKS } from "../../tools/play-stage/looks.ts";
import { openBundled, openProject } from "../../tools/play-stage/project.ts";
import { loadFixture } from "./demo-fixture.ts";
const NOW = "2026-11-19T00:00:00.000Z";
const root = fileURLToPath(new URL("../..", import.meta.url));
const sha = (v: unknown): string => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const slug = (text: string): string => text.replaceAll("unit_01JDAN00000000000000000001", "knight").replaceAll("unit_01JDAN00000000000000000002", "archer").replaceAll("unit_01JDAN00000000000000000003", "cleric").replaceAll("unit_01JDAN00000000000000000004", "wolf").replaceAll("unit_01JDAN00000000000000000005", "villager").replaceAll("unit_01JDAN00000000000000000006", "crate").replaceAll("unit_01JDAN00000000000000000007", "merchant");
function readDir(rel: string): Record<string, string> {
  const out: Record<string, string> = {}, walk = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, next); else out[next] = readFileSync(path, "utf8"); } };
  walk(join(root, rel), ""); return out;
}
function readJson(rel: string): Record<string, unknown> {
  return Object.fromEntries(Object.entries(readDir(rel)).map(([path, text]) => [path, JSON.parse(text) as unknown]));
}
test("openProject on a saved demo has no demo dressing and the empty template plays", () => {
  const saved = openProject(readJson("data/templates/demo.tileproj"));
  assert.equal(saved.docs?.looks.canopy.length, 0); assert.equal(saved.docs?.looks.braziers.length, 0);
  const empty = openProject(readJson("data/templates/empty.tileproj"));
  assert.equal(empty.docs === null, false); assert.equal(empty.error, "");
  const demo = openBundled();
  assert.deepEqual(demo.docs?.looks.canopy, DEMO_LOOKS.canopy); assert.deepEqual(demo.docs?.looks.braziers, DEMO_LOOKS.braziers);
  const staged = openProject(loadFixture(), "stage_01JDAS00000000000000000001");
  const stage = staged.docs?.stage; assert.equal(typeof stage === "object" && stage !== null && "id" in stage && stage.id, "stage_01JDAS00000000000000000001");
});
test("test-launch: Empty stays in the maker", async () => {
  const id = "project_01JDEM00000000000000000001", store = memoryStore(), stored = readDir("data/templates/empty.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  let started = false;
  const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(readJson("data/templates/empty.tileproj")), from: "project", now: NOW, start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.equal(got.lines[0], "Place a unit on this stage to test it.");
});
test("test-launch: start throws, maker stays", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const pushed: string[] = [], loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }, prev = loc.history;
  loc.history = { pushState(_state, _title, url) { pushed.push(url); } };
  try {
    const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(readJson("data/templates/demo.tileproj")), from: "project", now: NOW, start() { throw new Error("play: seed"); } });
    assert.equal(got.ok, false); if (got.ok) return;
    assert.equal(got.lines[0], "Stage 1 has no seed yet, so it can't be played"); assert.deepEqual(pushed, []);
  } finally { if (prev === undefined) delete loc.history; else loc.history = prev; }
});
test("test-launch: save fails, no launch", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const next = { ...stored, "project.json": stored["project.json"]?.replace("\"name\": \"Demo\"", "\"name\": \"Demo 2\"") ?? "" };
  store.failOn(`${prefix(id)}project.json.tmp`);
  let started = false;
  const got = await launchTest({ store, id, stored, next, rev: storedRev(readJson("data/templates/demo.tileproj")), from: "project", now: NOW, start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.match(got.lines[0] ?? "", /Couldn't save/); assert.equal(store.files.get(`${prefix(id)}project.json`), stored["project.json"]);
  const html = projectScreen({ name: "Demo", stages: 1, dirty: true, readOnly: false, banner: got.lines[0] ?? null, problems: [] });
  assert.match(html, /Couldn(?:'|&#39;)t save/); assert.match(html, /data-act="test"/); assert.equal(html.includes("openBundled"), false);
});
test("an unreadable project shows the error and does not launch the demo", async () => {
  const store = memoryStore(); await store.write(`${prefix("bad")}project.json`, "{");
  let started = false;
  const got = await openSaved({ store, id: "bad", from: "project", start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.match(got.lines[0] ?? "", /Can't open/); assert.equal(got.lines.join(" ").includes("knight"), false);
});
test("Test on the demo template matches the parity golden and leaves the folder byte-identical", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const before = [...store.files.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  const got = await launchTest({ store, id, stored, next: stored, rev: 1, from: "project", now: NOW, start(docs) {
    const input = docsToInput(docs).input, win = installOne(WIN_CONDITION, {}).out, budget = installOne(ACTION_BUDGET, {}).out;
    if (win === null || budget === null) throw new Error("parity: rules");
    const world = createWorld(input);
    const result = runMatch(world, { sides: ["player", "wolves"], ai: botAbilityPriority({ actionsPerTurn: budget.actionsPerTurn, setup: docs.rules }), victory: wipeRule(win, ["player", "wolves"]), fuse: "off", maxRounds: 80, maxSimMs: 100000 });
    const hash = { outcome: result.outcome, snapshot: sha(JSON.parse(slug(JSON.stringify(snapshot(world))))), log: sha(slug(world.log.toJSON())), bus: sha(JSON.parse(slug(JSON.stringify(world.bus.history())))) };
    assert.deepEqual(hash, JSON.parse(readFileSync(new URL("./golden/demo-parity.json", import.meta.url), "utf8")) as unknown);
  } });
  assert.equal(got.ok, true);
  assert.deepEqual([...store.files.entries()].sort(([a], [b]) => (a < b ? -1 : 1)), before);
});
