import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { gameMenu, menuSet, menuView, stageSwitcher } from "../../tools/maker/game-menu.ts";
import { ICON_NAMES, icon } from "../../tools/maker/icons.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const read = (rel: string): string => readFileSync(join(root, rel), "utf8");
const maker = readdirSync(join(root, "tools/maker")).filter((name) => name.endsWith(".ts")).map((name) => read(`tools/maker/${name}`));
const HOST = { name: "Quest", stages: 2, units: 3, effects: 1, budgets: '<button type="button" class="btn ghost stage-row" data-act="b:row">B</button>', build: '<button type="button" class="btn ghost stage-row" data-act="build">G</button>', dirty: true, readOnly: false, resume: false };
const ROWS = [{ id: "stage_a", name: "Cave" }, { id: "stage_b", name: "Town" }];
const acts = (html: string): string[] => [...html.matchAll(/data-act="([^"]*)"/g)].map((hit) => hit[1] ?? "");
const DRAW: Record<string, string> = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  down: '<path d="M7 10l5 5 5-5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  games: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
};

test("F2a2 icons: UX's six drawings, byte for byte, in the icon set (UX ruling 00:22)", () => {
  for (const [name, draw] of Object.entries(DRAW)) {
    assert.ok((ICON_NAMES as readonly string[]).includes(name), name);
    assert.equal(icon(name as Parameters<typeof icon>[0]), `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${draw}</svg>`);
  }
});

test("F2a2 game menu: h2 is the game's name, 8 flat rows in UX's order, no eyebrow, a grabber and a 48px close", () => {
  const html = gameMenu(HOST);
  assert.match(html, /^<div class="scrim" data-sheet="game-menu"><div class="sheet" role="dialog"><div class="grabber"><\/div><div class="sheet-head"><h2>Quest<\/h2><button type="button" class="btn icon" data-act="m:close" aria-label="Close">/);
  assert.deepEqual(acts(html), ["m:close", "m:switch", "m:units", "m:effects", "m:levels", "b:row", "build", "save", "m:games"]);
  assert.deepEqual([...html.matchAll(/<span class="grow">([^<]*)<\/span>/g)].map((hit) => hit[1]), ["Stages &amp; maps", "Units", "Effects", "Levels &amp; XP", "Save", "My games"]);
  assert.equal(html.split(DRAW.chevron ?? "").length - 1, 6);
  assert.ok(html.includes(`${DRAW.games}</svg><span class="grow">My games</span>`));
  assert.equal(html.includes("eyebrow"), false);
  assert.equal(html.includes("btn primary"), false);
  assert.ok(gameMenu({ ...HOST, resume: true }).endsWith('<button type="button" class="btn ghost" data-act="continue">Continue</button></div></div>'));
});

test('F2a2 stage switcher: h2 "Stages", one eyebrow "Stages", the picked stage shows the check, the others a blank slot', () => {
  const html = stageSwitcher(ROWS, "stage_b", false, "<p>TAIL</p>");
  assert.ok(html.includes('<div class="sheet-head"><h2>Stages</h2>'));
  assert.deepEqual([...html.matchAll(/class="eyebrow">([^<]*)</g)].map((hit) => hit[1]), ["Stages"]);
  assert.ok(html.includes('data-act="stage:stage_a" aria-current="false"><span class="slot"></span><span class="grow">Cave</span>'));
  assert.ok(html.includes(`data-act="stage:stage_b" aria-current="true"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${DRAW.check}</svg><span class="grow">Town</span>`));
  assert.ok(html.endsWith("<p>TAIL</p></div></div>"));
  assert.equal(stageSwitcher(ROWS, "stage_b", true, "").includes("r:menu:stage:"), false);
});

test("F2a2 eyebrow: the exact rule, used once in the maker; the grabber is CSS", () => {
  const css = read("tools/maker/app.css");
  assert.ok(css.includes(".eyebrow { margin: 4px 0 0; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }"));
  assert.ok(css.includes(".grabber { flex: none; width: 40px; height: 4px; border-radius: 999px; background: var(--line); align-self: center; }"));
  assert.equal(maker.join("").split('class="eyebrow"').length - 1, 1);
});

test("F2a2 menu view: only the six named views; anything else throws (Law 12)", () => {
  menuSet("switch");
  assert.equal(menuView(), "switch");
  assert.throws(() => menuSet("project"), /maker: no menu view project/);
  menuSet("none");
});
