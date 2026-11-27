import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { buildSheet } from "../../tools/maker/build-sheet.ts";
import { ICON_NAMES, icon } from "../../tools/maker/icons.ts";
import { projectScreen } from "../../tools/maker/project.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { bindStage, stageClick, stageScreen, type Host } from "../../tools/maker/stage.ts";
import { askSheet, goesSheet, placeButtons, talkSheet, unitButtons, unitPicker } from "../../tools/maker/stage-sheets.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { knobWidget } from "../../tools/maker/widgets.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const MAKER = join(root, "tools/maker");
const STAGE = "stage_01JDAS00000000000000000001";
const NOW = "2026-11-27T00:00:00.000Z";
const sources = readdirSync(MAKER).filter((name) => name.endsWith(".ts")).map((name) => ({ name, text: readFileSync(join(MAKER, name), "utf8") }));
const css = readFileSync(join(MAKER, "app.css"), "utf8");
const tags = (text: string): string[] => text.match(/<(?:button|label)\b[^>]*>/g) ?? [];
const rule = (selector: string): string => {
  const hits = css.split("\n").filter((line) => line.startsWith(`${selector} {`));
  assert.equal(hits.length, 1, `${selector} is set once`);
  return hits[0] ?? "";
};
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
const primaries = (html: string): number[] => html.split('class="scrim"').map((part) => part.split('class="btn primary').length - 1);
async function demo(id: string): Promise<{ host: Host; io: { store: ReturnType<typeof memoryStore>; id: string; now: string } }> {
  const text = readDir("fixtures/demo.tileproj");
  const parsed = parseProject(text);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) throw new Error("demo");
  const io = { store: memoryStore(), id, now: NOW };
  for (const [path, body] of Object.entries(text)) await io.store.write(`${prefix(id)}${path}`, body);
  bindStage(STAGE, id);
  return { host: { files: text, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false }, io };
}

test("F1 button roles: every maker button names its role (btn primary, ghost, danger or icon) or is a pick chip; no bare class=\"btn\" is left; + Add stage, New project, + Add unit and + New effect are ghost rows with the plus icon, so the selected look only means selected", () => {
  const bare = sources.flatMap(({ name, text }) => tags(text).filter((tag) => /class="btn(?:"| (?!primary|ghost|danger|icon)[^"]*")/.test(tag)).map((tag) => `${name}: ${tag}`));
  assert.deepEqual(bare, []);
  const rooms = sources.find((file) => file.name === "rooms.ts")?.text ?? "";
  assert.ok(rooms.includes('<button type="button" class="btn ghost stage-row" data-act="r:add">${icon("plus")}Add stage</button>'));
  assert.equal(/class="card new"/.test(sources.map(({ text }) => text).join("\n")), false);
  assert.ok([["home.ts", "new", "New project"], ["units.ts", "u:add", "Add unit"], ["effects.ts", "e:new", "New effect"]].every(([name, act, words]) => sources.find((file) => file.name === name)?.text.includes(`<button type="button" class="btn ghost stage-row" data-act="${act}">\${icon("plus")}${words}</button>`)));
});

test("F1 button order: at most one primary per screen and per sheet; Test is the stage's and the project page's primary", async () => {
  const { host, io } = await demo("f1order");
  const stage = stageScreen(STAGE, host);
  assert.match(stage, /class="btn primary" data-act="s:test"/);
  const cell = await stageClick("s:cell:0,0", STAGE, host, io);
  const view = await stageClick("s:view", STAGE, host, io);
  const project = projectScreen({ name: "My game", stages: 1, rows: [{ id: STAGE, name: "Stage 1" }], dirty: true, readOnly: false, banner: null, problems: [] });
  assert.match(project, /class="btn primary" data-act="test"/);
  const sheets = [placeButtons([{ id: "npc", label: "NPC" }, { id: "foe", label: "Enemy" }]), goesSheet("Stairs", [{ id: "s2", name: "Two" }]), unitPicker([{ id: "u", name: "Scout" }]), askSheet("Scout"), talkSheet("Scout", 80, "Hi"), unitButtons(true, true), buildSheet({ mode: "ready", file: "g.zip", share: true }), buildSheet({ mode: "error", reason: "x" })];
  for (const html of [stage, stageScreen(STAGE, cell), stageScreen(STAGE, view), project, ...sheets]) assert.ok(primaries(html).every((n) => n <= 1), html);
  assert.equal(primaries(unitButtons(true, true))[0], 0);
  assert.ok(sources.every(({ text }) => text.split("\n").every((line) => line.split('class="btn primary').length <= 2)));
});

test("F1 pickers: every aria-pressed button is a .pick chip or a framed-pill toggle (the new-game wizard's .choice cards aside); a chip is 48 px, centres its label, pads 14 px each side without a swatch and draws the picked ring of style-spec § 7", async () => {
  const loose = sources.flatMap(({ name, text }) => tags(text).filter((tag) => tag.includes("aria-pressed") && !tag.includes('class="pick"') && !tag.includes('class="seg-opt"') && !(name === "home.ts" && tag.includes('class="choice"'))).map((tag) => `${name}: ${tag}`));
  assert.deepEqual(loose, []);
  assert.match(rule(".pick"), /justify-content: center;.*min-height: 48px; padding: 0 14px; border-radius: 999px;.*border: 2px solid var\(--line\);.*background: var\(--surface\);/);
  assert.equal(rule(".pick:has(.sw)"), ".pick:has(.sw) { padding: 0 14px 0 8px; }");
  assert.equal(rule('.pick[aria-pressed="true"]'), '.pick[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent); }');
  const pick = knobWidget({ id: "aim", label: "Aim", type: "picker", options: ["self", "foe"] }, "foe");
  assert.match(pick, /class="pick" data-act="k:pick:aim:foe" aria-pressed="true"/);
  const colour = knobWidget({ id: "tint", label: "Tint", type: "colour" }, "--danger");
  assert.match(colour, /class="pick"[^>]*aria-pressed="true"><span class="sw" style="background:var\(--danger\)"><\/span>/);
  const { host, io } = await demo("f1pick");
  const cell = await stageClick("s:cell:0,0", STAGE, host, io);
  assert.match(stageScreen(STAGE, cell), /class="pick" data-act="s:type:floor" aria-pressed="true"/);
  assert.match(stageScreen(STAGE, cell), /class="pick" data-act="s:type:water" aria-pressed="false"/);
});

test("F1 toggles: every on/off toggle (rules and knob toggles, Grid lines, Autosave here, On your team) is a two-option § 5 framed pill: the label as text outside the frame, then Off and On, exactly one pressed; only the option that isn't set carries the act; 40 px frame, 48 px options, 30 px accent pill", async () => {
  const off = knobWidget({ id: "wipe", label: "Wipe wins", type: "toggle" }, false);
  assert.equal(off, '<div class="seg-row"><span class="seg-label">Wipe wins</span><span class="seg" role="group" data-seg="k:toggle:wipe"><button type="button" class="seg-opt" aria-pressed="true" aria-label="Wipe wins: Off"><span>Off</span></button><button type="button" class="seg-opt" aria-pressed="false" aria-label="Wipe wins: On" data-act="k:toggle:wipe"><span>On</span></button></span></div>');
  const { host, io } = await demo("f1seg");
  const view = await stageClick("s:view", STAGE, host, io);
  const before = stageScreen(STAGE, view);
  const after = stageScreen(STAGE, await stageClick("s:grid", STAGE, view, io));
  for (const html of [before, after]) {
    const frame = html.match(/<span class="seg-label">Grid lines<\/span><span class="seg" role="group" data-seg="s:grid">(.*?)<\/span><\/div>/)?.[1] ?? "";
    const options = frame.match(/<button [^>]*>/g) ?? [];
    assert.deepEqual([options.length, options.filter((tag) => tag.includes('aria-pressed="true"')).length], [2, 1]);
    assert.ok(options.every((tag) => tag.includes('aria-pressed="true"') !== tag.includes('data-act="s:grid"')));
  }
  assert.notEqual(before.match(/aria-pressed="true" aria-label="Grid lines: (Off|On)"/)?.[0], after.match(/aria-pressed="true" aria-label="Grid lines: (Off|On)"/)?.[0]);
  const code = sources.map(({ text }) => text).join("\n");
  assert.ok(['seg("Autosave here", ', 'seg("Grid lines", ', 'seg("On your team", ', 'seg(label, value === true, '].every((call) => code.includes(call)));
  assert.match(rule(".seg"), /height: 40px;.*border: 1px solid var\(--seg-line\); border-radius: 12px; background: var\(--surface\);/);
  assert.match(rule(".seg-opt"), /min-height: 48px; margin: -5px 0;.*background: transparent;/);
  assert.match(rule(".seg-opt > span"), /height: 30px; margin: 0 4px;.*border-radius: 8px;/);
  assert.equal(rule('.seg-opt[aria-pressed="true"] > span'), '.seg-opt[aria-pressed="true"] > span { background: var(--accent); color: var(--accent-ink); }');
});

test("F1 danger: Delete, Remove, Remove link and Start new are always btn danger", () => {
  const soft = sources.flatMap(({ name, text }) => tags(text).filter((tag) => /data-act="[^"]*(?:delete|:del:|:drop:|unlink|fresh)/.test(tag) && !tag.includes("btn danger")).map((tag) => `${name}: ${tag}`));
  assert.deepEqual(soft, []);
  assert.match(unitButtons(false, false), /class="btn danger" data-act="s:delete">Delete</);
});

test("F1 icons: one maker file of 24 px line icons (stroke currentColor, fill only on play and more); Test buttons lead with play and ⋯ menus are the more icon", () => {
  assert.ok(ICON_NAMES.length >= 16);
  for (const name of ICON_NAMES) assert.match(icon(name), /^<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">.+<\/svg>$/);
  assert.deepEqual(ICON_NAMES.filter((name) => icon(name).includes("fill=")), ["play", "more"]);
  assert.match(rule(".ico"), /width: 24px; height: 24px;.*stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;/);
  const all = sources.map(({ text }) => text).join("\n");
  assert.equal(all.split("Test</button>").length, all.split('${icon("play")}Test</button>').length);
  assert.equal(/[⋯▶]/.test(all), false);
});

test("F1 card thumbnails: game rows, stage rows, maps, units, effects and levels cards lead with a 48 px thumb", () => {
  const project = projectScreen({ name: "My game", stages: 1, rows: [{ id: STAGE, name: "Stage 1" }], dirty: false, readOnly: false, banner: null, problems: [] });
  assert.match(project, /<div class="card"><span class="thumb"><svg class="ico"/);
  for (const [name, kind] of [["home.ts", "stages"], ["rooms.ts", "grid"], ["units.ts", "units"], ["effects.ts", "effects"], ["levels.ts", "levels"]]) assert.ok(sources.find((file) => file.name === name)?.text.includes(`class="card">\${thumb("${kind}")}`), name);
  assert.match(rule(".thumb"), /width: 48px; height: 48px; border-radius: 8px;.*background: var\(--surface-2\); border: 1px solid var\(--line\); color: var\(--muted\);/);
});

test("F1 Undo chip: no Nothing to undo bar; after a paint the chip floats with the undo icon and Undo, and it hides while a sheet is open; its button is the 48 px hit area, under the scrim, with the pill 12 px above the stage body's bottom edge plus the safe area", async () => {
  const { host, io } = await demo("f1undo");
  const fresh = stageScreen(STAGE, host);
  assert.equal(fresh.includes("undo-chip") || fresh.includes("Nothing to undo"), false);
  const open = await stageClick("s:cell:0,0", STAGE, host, io);
  const pick = await stageClick("s:type:water", STAGE, open, io);
  const done = await stageClick("s:done", STAGE, pick, io);
  assert.match(stageScreen(STAGE, done), /<div class="float"><button type="button" class="undo-chip" data-act="s:undo"><span><svg class="ico"[^>]*><path d="M9 14L4 9l5-5"\/>.*?<\/svg>Undo<\/span><\/button><\/div>/);
  const again = await stageClick("s:cell:1,1", STAGE, done, io);
  assert.equal(stageScreen(STAGE, again).includes("undo-chip"), false);
  assert.equal(rule(".undo-chip"), ".undo-chip { position: absolute; z-index: 4; left: 12px; bottom: calc(8px + env(safe-area-inset-bottom)); min-height: 48px; padding: 4px; border: 0; background: transparent; }");
  assert.match(rule(".undo-chip > span"), /min-height: 40px;.*border-radius: 999px; background: var\(--surface\); border: 1px solid var\(--line\); box-shadow: var\(--shadow\);/);
});
