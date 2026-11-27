import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { budgetsRow, budgetsTap } from "../../tools/maker/budgets.ts";
import { ICON_NAMES, icon, thumb } from "../../tools/maker/icons.ts";
import { levelsSection } from "../../tools/maker/levels.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { bindStage, stageClick, stageScreen, type Host } from "../../tools/maker/stage.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { bindUnits, openUnit, unitPage } from "../../tools/maker/units.ts";
import { knobWidget, seg } from "../../tools/maker/widgets.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const STAGE = "stage_01JDAS00000000000000000001";
const ARCHER = "unit_01JDAN00000000000000000002";
const NOW = "2026-11-27T00:00:00.000Z";
const BUDGETS = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>';
const css = readFileSync(join(root, "tools/maker/app.css"), "utf8");
const readDir = (rel: string): Record<string, string> => {
  const out: Record<string, string> = {};
  const walk = (at: string, base: string): void => {
    for (const name of readdirSync(at)) {
      const path = join(at, name);
      const next = base === "" ? name : `${base}/${name}`;
      if (statSync(path).isDirectory()) walk(path, next);
      else out[next] = readFileSync(path, "utf8");
    }
  };
  walk(join(root, rel), "");
  return out;
};
const DEMO = readDir("fixtures/demo.tileproj");
const labels = (html: string): string[][] => [...html.matchAll(/class="seg-opt" aria-pressed="(true|false)" aria-label="([^"]*)"/g)].map((hit) => [hit[1] ?? "", hit[2] ?? ""]);
async function demo(id: string): Promise<{ host: Host; io: { store: ReturnType<typeof memoryStore>; id: string; now: string } }> {
  const parsed = parseProject(DEMO);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) throw new Error("demo");
  const io = { store: memoryStore(), id, now: NOW };
  for (const [path, body] of Object.entries(DEMO)) await io.store.write(`${prefix(id)}${path}`, body);
  bindStage(STAGE, id);
  return { host: { files: DEMO, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false }, io };
}

test('F2a1 toggles: the On option\'s aria-label is "{label}: On", matching Off\'s "{label}: Off" (UX 16:45), on every framed-pill toggle, and the 7 smoke lines read the new label', async () => {
  assert.deepEqual(labels(knobWidget({ id: "wipe", label: "Wipe wins", type: "toggle" }, false)), [["true", "Wipe wins: Off"], ["false", "Wipe wins: On"]]);
  assert.deepEqual(labels(knobWidget({ id: "wipe", label: "Wipe wins", type: "toggle" }, true)), [["false", "Wipe wins: Off"], ["true", "Wipe wins: On"]]);
  assert.deepEqual(labels(seg("On your team", true, "t:team")), [["false", "On your team: Off"], ["true", "On your team: On"]]);
  const { host, io } = await demo("f2a1seg");
  const view = stageScreen(STAGE, await stageClick("s:view", STAGE, host, io));
  assert.deepEqual(labels(view).map(([, name]) => name), ["Grid lines: Off", "Grid lines: On"]);
  const smokes = ["s6a-win-rules", "s6c-checkpoint"].map((name) => readFileSync(join(root, "handoff/steps/tests", name, "smoke.mjs"), "utf8"));
  assert.deepEqual(smokes.map((text) => text.split('[aria-label="On your team: On"]').length - 1), [3, 4]);
  assert.equal(smokes.some((text) => text.includes('[aria-label="On your team"]')), false);
});

test("F2a1 dead CSS: app.css has no .card.new (no markup uses it since F1); the picked .choice rule stays as it was", () => {
  assert.equal(css.includes(".card.new"), false);
  const picked = css.split("\n").filter((line) => line.startsWith('.choice[aria-pressed="true"] {'));
  assert.deepEqual(picked, ['.choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }']);
});

test("F2a1 Budgets icon: UX's budgets line icon (shot f02) leads the Budgets row's button; the button's words, its act and the four aria-hidden meters are unchanged", () => {
  assert.equal(icon("budgets"), BUDGETS);
  assert.ok(ICON_NAMES.includes("budgets"));
  const shut = budgetsRow(DEMO);
  assert.ok(shut.includes(`<button type="button" class="btn ghost stage-row" data-act="budgets" aria-expanded="false">${BUDGETS}Budgets: all good</button>`));
  budgetsTap(() => undefined);
  const open = budgetsRow(DEMO);
  budgetsTap(() => undefined);
  assert.equal((open.match(/<meter [^>]*aria-hidden="true"><\/meter>/g) ?? []).length, 4);
  assert.equal(open.split('aria-hidden="true"').length - 1, 5);
  assert.ok(open.includes(`aria-expanded="true">${BUDGETS}Budgets: all good</button>`));
});

test("F2a1 placements (F1 carry F-b): the stage error state's Back has the back icon, the unit page's rename button has the edit icon, and the read-only levels card has the levels thumb", async () => {
  const { host } = await demo("f2a1fb");
  const broken = stageScreen("stage_01JDAS0000000000000000NONE", host);
  assert.ok(broken.startsWith(`<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">${icon("back")}Back</button><h1>Stage</h1></header>`));
  bindUnits("f2a1fb");
  openUnit(ARCHER);
  assert.match(unitPage(DEMO, false, null), new RegExp(`data-act="u:rename">${icon("edit").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^<]+</button>`));
  assert.equal(unitPage(DEMO, true, null).includes('data-act="u:rename"'), false);
  assert.ok(levelsSection(DEMO, true).includes(`<div class="card">${thumb("levels")}<p>Made with a newer TileEngine. Open only.</p></div>`));
  assert.ok(levelsSection(DEMO, false).includes(`<div class="card">${thumb("levels")}`));
});
