# step-f2a2b-land-on-map: open a game on the stage editor, wire ☰ and the stage switcher, delete the project page (maker overhaul plan F2a, second half, slice 2 of 2; EA split, 28 Nov)

Step id: step-f2a2b-land-on-map          Revision: r2 (EA kit, 2026-11-28, one rework round after QA's kit review `docs/qa/step-f2a2-kit-review.md` sha256 `851c88d6…`)
Repo: https://github.com/G-TileEngine/tileengine (you push your own step branch only; see Delivery)
Base commit: **the F2a2a merge commit on main** (CoS fills in the sha in the go-line; **F2a2b follows on F2a2a's merge**, never before it). EA trialled on `ce848f57` + the F2a2a trial (commit `3b40888365c8a1117fc98cfc36b817f04cc9cc6e`, tree `5687d21b…`); the F2a2b r2 trial `f2a2b-trial.patch` applies on top of it and gives tree `3e180ff3ab1a1a64c51dca995ab45bf60ffd6a55` (r1 gave `9c04b6c8…`; r1 is history in `/workspace/share/f2a2b-r1/`). Green on the F2a2a trial is **1203 pass, 0 fail**. If the real F2a2a merge differs from the trial in anything but docs, handback and its kit folder, CoS stops and EA re-trials.
Branch: step/step-f2a2b-land-on-map-r1-chatA, from the F2a2a merge. Never commit to main. Chief Of Staff opens the PR to main from your pushed branch.
Delivery (CN-028): one builder chat (ChatA), one QA review, and a rework round on must-fixes. Commit HANDBACK.md as the branch's last commit, then push once with `GH_BUILDER_TOKEN` through the one-shot credential helper in handoff/HAND-BACK.md (that branch only: never main, another branch or a tag; no force-push, no branch delete, no PR actions). The hand-back message quotes the branch, the full tip sha, the code head sha, the Base sha and the test counts. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the branch".
Hand-back location: in the repo, on that branch: handback/step-f2a2b-land-on-map/r1/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on:
- **F2a2a merged** (`docs/maker/steps/step-f2a2a-menu-kit.md`): `tools/maker/game-menu.ts` (`gameMenu`, `stageSwitcher`, `sectionSheet`, `menuView`, `menuSet`), the six icons, the sheet and row CSS and `tests/tools/f2a2-menu-kit.test.ts` are on your base. You only wire them; do not edit them.
- `docs/maker/ux/maker-overhaul-plan.md` (sha256 `ef212329…`, on the base): **L71** (the F2a2 row: "Opening a game lands on the stage editor. ☰ sheet, stage switcher, project page deleted, Budgets (with F2a1's icon) and Build game move into ☰. Eyebrow section headers in its sheets (UX 15:4x) and the icons for ☰, the switcher, close, chevrons and the picked check. 14 smokes and 2 tests rebased | 340–390, plus about 10"); **L86** (the order line: … ART1a → F2a → ART1b …); **L87** (EA's F2a split note: F2a1 then F2a2, both in F2a's slot). Plan EA-3 (about L254–L262): the smokes and tests that pass through the project page.
- `docs/rebuild/step-f1.md` (sha256 `af2213b9…`) "QA non-blockers carried forward" **L207–L212**, fifth bullet: "Eyebrow headers (UX 15:4x); icons for ☰, the stage switcher, the tool bar, close and chevrons as they ship (F2a, F4)". F2a2a ships the six icons, the sheets and the one eyebrow; F2a2b wires them; the tool bar's icons stay with F4.
- `docs/rebuild/step-f2a1.md` (sha256 `5055ebe4…`) and `docs/qa/step-f2a1-review.md` (`dd6ec1d9…`): F2a1 put the budgets icon on the Budgets row; F2a2b mounts that row, unchanged, in ☰.
- `docs/maker/style-spec.md` r2 (sha256 `8765d849…`): **L71** § 7 Icons; **L73** eyebrow (4 px top margin; a count after a middot); **L76** stage editor top bar; **L77** modal sheet (40×4 grabber, h2, 48 px close; list rows 56 high with a `--muted` icon, name at 700, meta at 0.82rem, chevron; the picked stage shows a check instead of an icon); **L91–L93** shots. Shots `docs/maker/shots/f02-game-menu.png` (`2111ba98…`) and `f03-stage-switcher.png` (`a123337a…`).
- **UX ruling, 2026-11-28 00:22 London (binding; quoted in the Rulings).** **EA ruling, 2026-11-28 01:37 London: F2a2 runs as F2a2a then F2a2b** (485 counted as one step breaks the 400 cap; `SPLIT.md`).
- Format: none read or written (tile-project 6, stage 2, no bump). No play, export, build or `map.tile` change.
Read first: BUILD_GUIDE.md §2.2, §6, §7; the F2a2a guide; style-spec L71–L77; shots f02 and f03; `tools/maker/game-menu.ts`; this guide's Rulings in full.
Kit: `handoff/steps/tests/step-f2a2b-land-on-map/` (SHA256SUMS, `tests/tools/f2a2-land-on-map.test.ts`, `plants-f2a2b.py`). Copy the test verbatim to `tests/tools/`; the kit folder is not counted and is not edited.
F1 plants: the F1 kit's plants **P20 and P24 no longer apply** (F2a1 changed the On label they plant against; recorded in the F2a1 guide, Ruling 7). They stay dead here; that is expected and is not a regression. No other earlier kit's plants are touched except as listed under "Earlier kit pins".
Carries: `state.problems` is still written and has no reader after r2's travel fix; remove it in a later step (QA non-blocker; not cheap enough in this round: 397/400). Differences from the mocks are listed under "Open points".

> Working style (REQUIRED): use all your helper agents for review, tests and cross-checks, take your time, never rush, and self-review against Acceptance and the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Plan L71: opening a game lands on its stage editor, not on the project page. The stage bar's Back becomes a ☰ icon button that opens the **game menu** (the game's name, then 8 flat rows); the stage name in the bar becomes a button, with the down icon, that opens the **stage switcher** (the stages with the picked one checked, then + Add stage and the maps). Units, Effects and Levels & XP open from ☰ as sheets over the map. Budgets (with F2a1's icon) and Build game move into ☰. `tools/maker/project.ts` is deleted. Back from Test returns to the stage. No saved data, format or play change.

## Where step-f2a2b sits (placement card)
1. No new screen; one screen goes. Lives at: the stage editor's top bar and the two sheets over it (F2a2a's) · tap path: My games → a game → its first stage; ☰ → menu rows; stage name → switcher.
2. Changes or replaces: the project page (deleted) is replaced by the ☰ sheet and the switcher; the stage bar's Back is replaced by ☰.
3. Seen at once: ☰ top left, the stage name with a down chevron, each sheet's grabber, h2 and close.
4. Data path: unchanged (the same saves through `saveStage`) · read by Test/play: nothing new · demo data: unchanged · pictures: none.
5. Usable on landing: yes; the map is the first thing a maker sees.
6. Proof: the shipped test, 27 plants (F2a2a's 16 still caught, plus 11), all 25 smokes solo at 390 and 360 (21 edited), EA's f02/f03 comparison shots (box only).

## Rulings
4. **Budgets and Build rows are mounted as they are**: `budgetsRow(state.files)` and `buildButton(building)` go into the menu unchanged (F2a1's icon included), restyled flat by CSS scoped to `[data-sheet="game-menu"] .stage-row`. They get no chevron here, because adding one re-pins F2a1's shipped test (f2a1-carries L69), budgets-11c1 and export-11a (see Open points).
6. **Landing** (`home.ts` `openId` L56 and `fromUrl` L97–L105): a new `landOn(id, files, stage)` picks `stage ?? the first of stageRows(files)`, binds it, closes the menu and sets the screen to stage; a game with no stages shows the missing screen with "This game has no stages, so it can't open." (never a silent fallback). F2b adds "the last stage you edited"; here it is the first stage. `openId` no longer pushes a URL, so a reload returns to My games as on main.
7. **Leaving and saving**: ☰ → My games runs `leaveGame()` (shut rules, hide art, close the menu, forget the build, home, refresh). Opening a ☰ row other than Units, Effects or Levels saves the stage first (`saveStage`); a failed save repaints with its banner and stays. `saveCurrent` (L57) is deleted; Save calls `saveNow()` and Build calls `saveStage()` first; a failed build's lines go to the stage banner (the project page's problems sheet went with the page). The rooms handler (L142) runs on the stage; if the current stage was deleted it moves to the first stage; picking a stage from the switcher saves, switches and closes the menu.
8. **Back from Test** (`test-launch.ts` L21): `backScreen` maps "home" and "trash" to themselves and everything else to "stage" ("project" no longer exists). The stage error state's Back (`stage.ts` L142, F2a1) stays as it is; its F2a1 pin holds.
9. **Paint** (`home.ts` L48–L49): the stage branch becomes a Rule 8 block; it draws the stage, then the menu sheet (only when no build sheet and no unit page is open), then the child sheets (rooms, unit, levels, effects, build), art, the unit page and the toast; the project branch is deleted. The toast goes "above" while a menu sheet is open.

Rulings 1–3 and 5 (the eyebrow, the six icons, the rows and sheets, the menu view) are F2a2a's; read them in `step-f2a2a-menu-kit.md`. Here the stage bar renders the ☰ and switch buttons with those icons and CSS (`.topbar .btn.icon.bare`, `.topbar h1 .switch`, already in `app.css`).


10. **r2, Law 12 (QA must-fix 1).** In `enterPlay`'s `travel` (home.ts, r2 trial L127; L128 in r1): when a link arrival fails, `state.problems = [got.error]` becomes `state.banner = got.error` (one for one). After this step nothing renders `state.problems`, and `backScreen` always returns "stage", so the old assignment dropped the error. The shipped test pins the new statement; plant P23 catches a revert.
11. **r2, Rule 8 (QA must-fix 2).** The dense `if (act.startsWith("stage:")) { … }` line had gained `menuSet("none");`. That call is on its own line, and the whole block is reformatted per Rule 8 (braced bodies, one statement per line).
12. **r2, ☰ counts (QA non-blocker).** `countIn("units/")` / `countIn("effects/")` is replaced by `unitCount(state.files)` and `effectCount(state.files)`, exported from `units.ts` and `effects.ts`. They use the same lists the sheets draw: `shown(bag, sess.hidden)` and `effectRows(bag)`.
13. **r2, Continue (QA non-blocker).** `beginTest` calls `menuSet("none")` only when `menuView() === "menu"`, so Continue from ☰ does not reopen the game menu on Back from Test, while a Test started from the Levels or Effects editor keeps that sheet. Plant P26 catches a drop of that call.

## Files and edits (base line numbers are main's `ce848f57`; F2a2a added only to `icons.ts`, `app.css` and the new module)
### `tools/maker/stage.ts` L150 and `tools/maker/test-launch.ts` L21
(the stage error bar at L142 is untouched)
- `tools/maker/stage.ts` L150: `const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">${icon("back")}Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">${icon("grid"` → `const bar = `<header class="topbar wrap"><button type="button" class="btn icon bare" data-act="m:menu" aria-label="Game menu">${icon("menu")}</button><h1><button type="button" class="switch" data-act="m:switch"><span>${esc(name)}</span>${dot}${icon("down")}</button></h1><button type="button" class="btn ghost" data-act="s:view">${icon("grid"`
- `tools/maker/test-launch.ts` L21: `from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project"` → `from: string | null): "home" | "trash" | "stage" => from === "home" || from === "trash" ? from : "stage"`

### `tools/maker/project.ts`: deleted (`git rm`; 11 lines).
### `tools/maker/units.ts` and `tools/maker/effects.ts` (Ruling 12)
After `unitTail` and `effectsSection` respectively, 7 lines each, Rule 8:
```ts
export function unitCount(files: DocText): number {
  const bag = bagOf(files);
  if (bag === null) {
    return 0;
  }
  return shown(bag, sess.hidden).length;
}
```
```ts
export function effectCount(files: DocText): number {
  const bag = bagOf(files);
  if (bag === null) {
    return 0;
  }
  return effectRows(bag).length;
}
```

### `tools/maker/home.ts` (Rulings 4, 6–13)
Every new multi-line block is Rule 8. Edits inside existing dense lines are only those shown. Reference diff (`git diff -U1`, F2a2a trial / main for this file → r2 trial):
```diff
@@ -4,3 +4,3 @@ import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
-import { projectScreen } from "./project.ts";
+import { gameMenu, menuSet, menuView, sectionSheet, stageSwitcher } from "./game-menu.ts";
 import { buildButton, buildSheet, type BuildSheet, type BuildView } from "./build-sheet.ts";
@@ -10,3 +10,3 @@ import { buildGame, playBase } from "./export.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
-import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
+import { bindUnits, openUnit, rememberUnit, unitClick, unitCount, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
 import { addFind, rememberAbility } from "./add-ability.ts";
@@ -15,3 +15,3 @@ import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
 import { levelsAct, levelsOpen, levelsSection, levelsSheet, rememberLevels } from "./levels.ts";
-import { effectsAct, effectsSection, effectsSheet, fxOpen } from "./effects.ts";
+import { effectCount, effectsAct, effectsSection, effectsSheet, fxOpen } from "./effects.ts";
 import { bindStage, dropUndo, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
@@ -28,3 +28,3 @@ const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | "effect" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
+type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | "effect" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
 const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
@@ -43,3 +43,3 @@ function sheet(): string {
 function paint(): void {
-  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() || fxOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn ghost" data-act="undo">Undo</button></div>`;
+  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() || fxOpen() || menuView() !== "none" ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn ghost" data-act="undo">Undo</button></div>`;
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
@@ -47,4 +47,9 @@ function paint(): void {
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
-  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn ghost" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${budgetsRow(state.files)}${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built)) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "stage" && state.current !== null && state.stageId !== null) {
+    const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : "";
+    const child = roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built);
+    const menu = built === null && edit === "" ? menuSheet(state.stageId) : "";
+    root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + menu + child + artSheet(state.files, state.stageId, state.readOnly) + edit + toast;
+    return;
+  }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
@@ -54,5 +59,60 @@ function paint(): void {
 }
+function menuSheet(stageId: string): string {
+  const shown = menuView();
+  if (shown === "menu") {
+    const row = state.rows.find((item) => item.id === state.current);
+    return gameMenu({ name: row?.name ?? "Game", stages: stageRows(state.files).length, units: unitCount(state.files), effects: effectCount(state.files), budgets: budgetsRow(state.files), build: buildButton(building), dirty: state.dirty, readOnly: state.readOnly, resume: resume !== null });
+  }
+  if (shown === "switch") return stageSwitcher(stageRows(state.files), stageId, state.readOnly, roomTail(state.files, state.readOnly));
+  if (shown === "units") return sectionSheet(shown, unitTail(state.files, state.readOnly));
+  if (shown === "effects") return sectionSheet(shown, effectsSection(state.files, state.readOnly));
+  if (shown === "levels") return sectionSheet(shown, levelsSection(state.files, state.readOnly));
+  return "";
+}
+function landOn(id: string, files: DocText, stage: string | null): boolean {
+  const first = stage ?? stageRows(files)[0]?.id ?? null;
+  if (first === null) {
+    state.screen = "missing";
+    state.banner = "This game has no stages, so it can't open.";
+    paint();
+    return false;
+  }
+  state.stageId = first;
+  bindStage(first, id);
+  menuSet("none");
+  state.screen = "stage";
+  return true;
+}
+async function leaveGame(): Promise<void> {
+  rulesShut();
+  hideArt();
+  menuSet("none");
+  forgetBuild();
+  state.screen = "home";
+  state.banner = null;
+  state.problems = [];
+  history.pushState(null, "", location.pathname);
+  await refresh();
+  paint();
+}
+async function menuAct(which: string): Promise<void> {
+  if (which === "close") {
+    menuSet("none");
+    paint();
+    return;
+  }
+  if (which !== "units" && which !== "effects" && which !== "levels" && !await saveStage()) {
+    paint();
+    return;
+  }
+  if (which === "games") return leaveGame();
+  menuSet(which);
+  paint();
+}
+async function saveNow(): Promise<void> {
+  await saveStage();
+  paint();
+}
 async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
-async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
-async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
+async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; if (!landOn(id, text, null)) return; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
 async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
@@ -66,3 +126,3 @@ function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt, next?: Next): v
   const out = (): void => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; };
-  const travel = next === undefined ? undefined : (link: LinkEvent, party: SessionParty): void => { const got = next(docs, link, party); if (got.docs === null) { out(); state.problems = [got.error]; paint(); return; } if (link.autosave) saveTrip(link, party); canvas.remove(); document.querySelector("#hud")?.remove(); enterPlay(got.docs, scroll, undefined, next); };
+  const travel = next === undefined ? undefined : (link: LinkEvent, party: SessionParty): void => { const got = next(docs, link, party); if (got.docs === null) { out(); state.banner = got.error; paint(); return; } if (link.autosave) saveTrip(link, party); canvas.remove(); document.querySelector("#hud")?.remove(); enterPlay(got.docs, scroll, undefined, next); };
   try { startMatch(docs, out, aim, travel); root.hidden = true; } catch (e) { canvas.remove(); throw e; }
@@ -76,2 +136,5 @@ async function beginTest(aim?: AimAt & { readonly stageId?: string }, held?: Ses
   if (store === null || state.current === null) return;
+  if (menuView() === "menu") {
+    menuSet("none");
+  }
   const stageId = aim?.stageId ?? (state.screen === "stage" ? state.stageId : null);
@@ -103,10 +166,10 @@ async function fromUrl(): Promise<void> {
   if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
-  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
-  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
+  if (!landOn(id, got.files, stage)) return;
+  state.current = id; state.files = got.files; state.rev = got.rev; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
 }
 async function run(act: string): Promise<void> {
-  if (state.stageId !== null && store !== null && state.current !== null && ((state.screen === "stage" && (act.startsWith("r:") || (rulesOpen() && !unitEditing() && act.startsWith("k:")))) || (act === "undo" && state.undo === "rule"))) {
+  if (state.stageId !== null && store !== null && state.current !== null && ((state.screen === "stage" && ((act.startsWith("r:") && (act === "r:open" || rulesOpen())) || (rulesOpen() && !unitEditing() && act.startsWith("k:")))) || (act === "undo" && state.undo === "rule"))) {
     const hit = await rulesAct(act === "undo" ? "r:undo" : act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "rule"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || state.screen === "project") paint(); }, 6000); }
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "rule"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
     paint(); return;
@@ -114,15 +177,15 @@ async function run(act: string): Promise<void> {
   const unitUndo = act === "undo" && state.undo === "unit";
-  if (((act.startsWith("l:") && state.screen === "project") || (act === "undo" && state.undo === "level")) && store !== null && state.current !== null) {
+  if (((act.startsWith("l:") && state.screen === "stage") || (act === "undo" && state.undo === "level")) && store !== null && state.current !== null) {
     const hit = await levelsAct(act === "undo" ? "l:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "level"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "level"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
     paint(); return;
   }
-  if ((((act.startsWith("e:") || (fxOpen() && act.startsWith("k:"))) && state.screen === "project") || (act === "undo" && state.undo === "effect")) && store !== null && state.current !== null) {
+  if ((((act.startsWith("e:") || (fxOpen() && act.startsWith("k:"))) && state.screen === "stage") || (act === "undo" && state.undo === "effect")) && store !== null && state.current !== null) {
     const hit = await effectsAct(act === "undo" ? "e:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "effect"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "effect"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
     paint(); return;
   }
-  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
+  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && state.screen === "stage" && store !== null && state.current !== null && templates !== null) {
     const hadBanner = state.banner !== null;
@@ -130,3 +193,3 @@ async function run(act: string): Promise<void> {
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || (state.screen === "project" && !unitEditing())) paint(); }, 6000); }
+    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
     if (hit.play !== undefined) return beginTest({ unitId: hit.play.unitId, stageId: hit.play.stageId, ...(hit.play.abilityId === undefined ? {} : { abilityId: hit.play.abilityId }), ...(hit.play.aim === undefined ? {} : { aim: hit.play.aim }) });
@@ -141,10 +204,39 @@ async function run(act: string): Promise<void> {
   }
-  if ((act.startsWith("r:") || (act === "undo" && state.screen === "project")) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
+  if ((act.startsWith("r:") || (act === "undo" && state.undo === "room")) && state.screen === "stage" && store !== null && state.current !== null && templates !== null) {
     const hit = await roomClick(act === "undo" ? "r:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes, empty: templates.empty });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "room"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
-    if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
-    paint(); return;
+    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "room"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
+    const gone = !stageRows(state.files).some((row) => row.id === state.stageId);
+    const next = hit.stageId ?? (gone ? stageRows(state.files)[0]?.id ?? null : null);
+    if (next !== null) {
+      state.stageId = next;
+      bindStage(next, state.current);
+      history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(next)}&from=stage`);
+    }
+    if (hit.stageId !== null) {
+      menuSet("none");
+    }
+    paint();
+    return;
+  }
+  if (act.startsWith("m:") && state.screen === "stage") return menuAct(act.slice(2));
+  if (act.startsWith("stage:") && state.screen === "stage" && !await saveStage()) {
+    paint();
+    return;
+  }
+  if (act.startsWith("stage:")) {
+    menuSet("none");
+    rulesShut();
+    state.stageId = act.slice(6);
+    bindStage(state.stageId, state.current ?? "");
+    state.screen = "stage";
+    if (!state.readOnly) {
+      state.banner = null;
+    }
+    if (state.current !== null) {
+      history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`);
+    }
+    paint();
+    return;
   }
-  if (act.startsWith("stage:")) { rulesShut(); state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
   if ((act === "b:open" || act === "b:close" || act.startsWith("b:del:")) && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
@@ -158,3 +250,5 @@ async function run(act: string): Promise<void> {
     if (out.test) return beginTest(out.unitId === undefined ? undefined : { unitId: out.unitId, ...(out.stageId === undefined ? {} : { stageId: out.stageId }) });
-    if (out.leave) { rulesShut(); hideArt(); state.screen = "project"; } paint(); return;
+    if (out.leave) return leaveGame();
+    paint();
+    return;
   }
@@ -167,3 +261,3 @@ async function run(act: string): Promise<void> {
   if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
-  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "build") return buildNow(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
+  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveNow(); if (act === "test") return beginTest(); if (act === "build") return buildNow(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
 }
@@ -177,4 +271,6 @@ async function buildNow(): Promise<void> {
   if (store === null || state.current === null) return;
-  if (state.dirty) await saveCurrent();
-  if (state.dirty) return;
+  if (!await saveStage()) {
+    paint();
+    return;
+  }
   const id = state.current;
@@ -184,3 +280,3 @@ async function buildNow(): Promise<void> {
     const got = await buildGame(store, id, async (path) => { const res = await fetch(new URL(path, playBase(import.meta.url))); if (!res.ok) throw new Error(`Can't build: ${path}`); return res.text(); });
-    if (!got.ok) { state.problems = got.lines; building = "idle"; paint(); return; }
+    if (!got.ok) { state.banner = got.lines.join(" "); building = "idle"; paint(); return; }
     builtFile = new File([got.bytes as BlobPart], `${id}-game.zip`, { type: "application/zip" });
@@ -225,3 +321,3 @@ document.addEventListener("input", (ev) => { const node = ev.target; if (!(node
 document.addEventListener("change", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-fxname")) { go(`e:name:${node.value}`); return; } if (!(node instanceof HTMLInputElement) || !node.hasAttribute("data-art")) return; const file = node.files?.[0]; node.value = ""; if (file === undefined) return; gate = gate.then(async () => { if (store === null || state.current === null || state.stageId === null || state.screen !== "stage" || state.readOnly) return; if (!await saveStage()) { setArtNote(state.banner ?? "Couldn't save."); paint(); return; } let raw: Uint8Array; try { raw = await uploadBytes(file); } catch (e) { setArtNote(`Couldn't add ${file.name}: ${e instanceof Error ? e.message : "read failed"}`); paint(); return; } const got = await addPicture(store, state.current, state.files, state.rev, state.stageId, nowIso(), file.name, raw); if (!got.ok) { setArtNote(got.line); paint(); return; } state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); paint(); }).catch(fail); });
-document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
+document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
```

### Tests rebased (4; the plan said 2, see Open points)
Only these edits; each pins the same intent on the new surface.
- `tests/editor/project-home.test.ts` L10: `projectScreen } from "../../tools/maker/project.ts"` → `gameMenu } from "../../tools/maker/game-menu.ts"`
- `tests/editor/project-home.test.ts` L45: `const html = projectScreen({ name: "My game", stages: 1, dirty: true, readOnly: false, banner: null, problems: [] }); assert.match(html, /<button type="button" class="btn primary" data-act="test"><svg class="ico"[^>]*>.*?<\/svg>Test<\/button>/` → `const html = gameMenu({ name: "My game", stages: 1, units: 0, effects: 0, budgets: "", build: "", dirty: true, readOnly: false, resume: false }); assert.match(html, /<button type="button" class="list-row" data-act="save"><svg class="ico"[^>]*>.*?<\/svg><span class="grow">Save<\/span><span class="meta">Unsaved<\/span>/); assert.equal(html.includes("btn primary"), false`
- `tests/tools/export-11a.test.ts` L103: `state\.dirty\) await saveCurrent\(\);\n {2}if \(state\.dirty\) return` → `!await saveStage\(\)\) \{\n {4}paint\(\);\n {4}return;\n {2}\}\n {2}const id = state\.current`
- `tests/tools/f1-look-kit.test.ts` L9: `projectScreen } from "../../tools/maker/project.ts"` → `gameMenu, stageSwitcher } from "../../tools/maker/game-menu.ts"`
- `tests/tools/f1-look-kit.test.ts` L62: `Test is the stage's and the project page's primary", async (` → `Test is the stage's primary, and the game menu and stage switcher have none", async (`
- `tests/tools/f1-look-kit.test.ts` L68: `const project = projectScreen({ name: "My game", stages: 1, rows: [{ id: STAGE, name: "Stage 1" }], dirty: true, readOnly: false, banner: null, problems: [] }` → `const project = gameMenu({ name: "My game", stages: 1, units: 1, effects: 0, budgets: "", build: "", dirty: true, readOnly: false, resume: true }) + stageSwitcher([{ id: STAGE, name: "Stage 1" }], STAGE, false, ""`
- `tests/tools/f1-look-kit.test.ts` L69: `assert.match(project, /class="btn primary" data-act="test"/` → `assert.ok(primaries(project).every((n) => n === 0)`
- `tests/tools/f1-look-kit.test.ts` L130 deleted: `test("F1 card thumbnails: game rows, stage rows, maps, units, effects and levels cards lead with a 48 px thumb", () => {`
- `tests/tools/f1-look-kit.test.ts` L131 deleted: `const project = projectScreen({ name: "My game", stages: 1, rows: [{ id: STAGE, name: "Stage 1" }], dirty: false, readOnly: false, banner: null, problems: [] })`
- `tests/tools/f1-look-kit.test.ts` L132 deleted: `assert.match(project, /<div class="card"><span class="thumb"><svg class="ico"/);`
- `tests/tools/f1-look-kit.test.ts` new L130: `test("F1 card thumbnails: game rows, maps, units, effects and levels cards lead with a 48 px thumb", () => {`
- `tests/tools/play-stage-source.test.ts` L13: `projectScreen } from "../../tools/maker/project.ts"` → `stageScreen } from "../../tools/maker/stage.ts"`
- `tests/tools/play-stage-source.test.ts` L69: `const html = projectScreen({ name: "Demo", stages: 1, dirty: true, readOnly: false, banner: got.lines[0] ?? null, problems: []` → `const html = stageScreen("stage_01JDAS00000000000000000001", { files: stored, rev: storedRev(readJson("data/templates/demo.tileproj")), readOnly: false, banner: got.lines[0] ?? null, dirty: true`
- `tests/tools/play-stage-source.test.ts` L70: `html, /data-act="test"/` → `html, /data-act="s:test"/`

### Smoke lines (21 smokes edited; s0-play-input, s6d-baseline, s8c-baseline-walk and s9c-link-markers need none)
Convention: base line numbers; an empty left side means "append at the end of that line". Nothing else in those files changes.
- `s10b-effect-data` L27: `await press(page, "Demo stage"); await page.waitForFunction((` → `await page.waitForFunction((`
- `s10c-effect-editor` L24: `` → `await tap(page, "m:menu"); await tap(page, "m:effects");`
- `s10c-effect-editor` L34: `await page.waitForFunction((archer) => document.querySelector('[data-sheet="effect"]') === null && document.querySelector(".scrim"` → `await tap(page, "m:close"); await tap(page, "m:menu"); await tap(page, "m:units"); await page.waitForFunction((archer) => document.querySelector('[data-sheet="effect"]'`
- `s10c-effect-editor` L35: `line) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:open:${line` → `line) => document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:open:${line`
- `s10c-effect-editor` L37: `id) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:fx:${id` → `id) => document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:fx:${id`
- `s10c-effect-editor` L38: `"aria-pressed") === "true" && document.querySelector(".scrim") === null, id, { timeout: 15000` → `"aria-pressed") === "true" && document.querySelectorAll(".scrim").length < 2, id, { timeout: 15000`
- `s10c-effect-editor` L40: `id) => document.querySelector(".scrim") === null && document.querySelector('[data-act="a:shut"]'` → `id) => document.querySelectorAll(".scrim").length < 2 && document.querySelector('[data-act="a:shut"]'`
- `s10c-effect-editor` L41: `'[data-act="a:shut"]') === null && document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:test:${line` → `'[data-act="a:shut"]') === null && document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:test:${line`
- `s10c-effect-editor` L48: `page, `e:menu:${id` → `page, "m:close"); await tap(page, "m:menu"); await tap(page, "m:effects"); await tap(page, `e:menu:${id`
- `s10c-effect-editor` L50: `page, "undo"` → `page, "m:close"); await tap(page, "undo"`
- `s10d-builtin-effects` L17: `line) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 }); await tap(page, `a:open:${LINE}`); await page.waitForFunction((id) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:fx:${id` → `line) => document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 }); await tap(page, `a:open:${LINE}`); await page.waitForFunction((id) => document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:fx:${id`
- `s10d-builtin-effects` L24: `` → `await tap(page, "m:menu"); await tap(page, "m:units");`
- `s10d-builtin-effects` L37: `page, "undo"` → `page, "m:close"); await tap(page, "undo"`
- `s10d-builtin-effects` L41: `await openLine(page` → `await tap(page, "m:menu"); await tap(page, "m:units"); await openLine(page`
- `s11a-export-mvp` L25: `` → `await tap(page, "m:menu");`
- `s11a2-ready-sheet` L25: `` → `await tap(page, "m:menu");`
- `s11b-debug-apk` L24: `` → `await tap(page, "m:menu");`
- `s11c1-budgets` L26: `` → `await tap(page, "m:menu");`
- `s11c1-budgets` L39: `page, "test"` → `page, "m:close"); await tap(page, "s:test"`
- `s11c1-budgets` L40: `line) => document.body.innerText.includes("Can't play yet") && document.body.innerText.includes(line) && window.__play === undefined, LINE, { timeout: 15000 }); const h = await page.evaluate(() => document.querySelector(".project .sheet")?.getBoundingClientRect().height ?? 0); if (!(h > 0)) throw new Error(`sheet ${h}`` → `line) => (document.querySelector(".banner")?.textContent ?? "").includes(line) && window.__play === undefined, LINE, { timeout: 15000 }`
- `s11c1-budgets` L41: `page, "fix"); await page.waitForFunction(() => !document.body.innerText.includes("Can't play yet"), null, { timeout: 15000 }` → `page, "dismiss"); await page.waitForFunction((line) => !document.body.innerText.includes(line), LINE, { timeout: 15000 }); await tap(page, "m:menu"`
- `s11c1-budgets` L43: `page, "fix"); await page.evaluate(() => { delete window.__play; }); await tap(page, "test"` → `page, "m:close"); await tap(page, "dismiss"); await page.evaluate(() => { delete window.__play; }); await tap(page, "s:test"`
- `s3-test` L31: `"[data-act=test]"` → `'[data-act="s:test"]'`
- `s3-test` L109: `"[data-act=test]"` → `'[data-act="s:test"]'`
- `s3-test` L113: `"[data-act=test]"` → `'[data-act="s:test"]'`
- `s3-test` L114: `name !== "My game"` → `name !== "Demo stage"`
- `s3-test` L117: `page, "Back"` → `page, "Game menu"); await press(page, "My games"`
- `s3-test` L121: `".sheet")?.textContent ?? "", test: document.querySelector("[data-act=test]"` → `".banner")?.textContent ?? "", test: document.querySelector('[data-act="s:test"]'`
- `s4a-stage-paint` L24: `await press(page, "Demo stage"` → `await page.waitForSelector(".cell"`
- `s4a-stage-paint` L43: `await press(page, "Demo stage"); const a = await tile(page, 0, 0` → `const a = await tile(page, 0, 0`
- `s4b-stage-place` L27: `await press(page, "Demo stage");` → ``
- `s4c-stages-maps` L31: `` → `await tap(page, "m:switch");`
- `s4c-stages-maps` L39: `page, "s:back"` → `page, "m:switch"`
- `s4c-stages-maps` L45: `await press(page, "Demo stage"` → `await tap(page, `stage:${DEMO}``
- `s4c-stages-maps` L46: `page, "s:back"` → `page, "m:switch"`
- `s4c-stages-maps` L48: `await press(page, "Demo stage"` → `await tap(page, `stage:${DEMO}``
- `s4c-stages-maps` L49: `page, "s:back"` → `page, "m:switch"`
- `s4c-stages-maps` L61: `page, "s:back"` → `page, "m:switch"`
- `s5a-units` L30: `await waitText(page, "Units"` → `await tap(page, "m:menu"); await tap(page, "m:units"); await waitText(page, "Units"`
- `s5a-units` L39: `) => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Start from a role"` → `) => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Scout") && document.body.innerText.includes("Start from a role"`
- `s5a-units` L45: `) => document.querySelector("h1")?.textContent === "Scout", null, { timeout: 15000` → `) => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Scout"), null, { timeout: 15000`
- `s5a-units` L66: `await waitText(page, "Units"` → `await tap(page, "m:menu"); await tap(page, "m:units"); await waitText(page, "Units"`
- `s5a-units` L67: `) => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Same as army"` → `) => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Scout") && document.body.innerText.includes("Same as army"`
- `s5b-abilities` L27: `await press(page, "Demo stage");` → ``
- `s5b-abilities` L68: `'[data-act="s:back"]'` → `'[data-act="m:menu"]'`
- `s5b-abilities` L72: `'[data-act="s:back"]'` → `'[data-act="m:menu"]'`
- `s5b-abilities` L73: `page, "s:back"` → `page, "m:menu"); await tap(page, "m:units"`
- `s5b-abilities` L75: `) => document.querySelector("h1")?.textContent === "Spare" && document.body.innerText.includes("Place this unit on a stage to test it."` → `) => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Spare") && document.body.innerText.includes("Place this unit on a stage to test it."`
- `s5c-add-ability` L28: `await press(page, "Demo stage");` → ``
- `s6a-win-rules` L28: `await press(page, "Demo stage");` → ``
- `s6a-win-rules` L37: `page, "s:back"); await press(page, "Demo stage"` → `page, "m:switch"); await tap(page, "stage:stage_01JDAS00000000000000000001"`
- `s6a-win-rules` L58: `page, "s:back"); await press(page, "Back"` → `page, "m:menu"); await tap(page, "m:games"`
- `s6a-win-rules` L59: `page, "u:add"` → `page, "m:menu"); await tap(page, "m:units"); await tap(page, "u:add"`
- `s6a-win-rules` L66: `await press(page, "Blank"` → `await tap(page, "m:close"`
- `s6b-levels` L33: `` → `await tap(page, "m:menu"); await tap(page, "m:levels");`
- `s6b-levels` L80: `page, "test"` → `page, "m:close"); await tap(page, "s:test"`
- `s6b-levels` L83: `) => document.body.innerText.includes("Levels: Off"), null, { timeout: 15000` → `) => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000`
- `s6b-levels` L84: `` → `await tap(page, "m:menu"); await tap(page, "m:levels");`
- `handoff/steps/tests/s6c-checkpoint/smoke.mjs` L16 deleted: `const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await`
- `s6c-checkpoint` L32: `"h1")?.textContent === "Skirmish" && document.body.innerText.includes("Blank"), null, { timeout: 15000 }` → `"h1")?.textContent === "Blank", null, { timeout: 15000 }); await tap(page, "m:switch"`
- `s6c-checkpoint` L40: `await press(page, "Blank", true` → `await tap(page, "m:close"`
- `s6c-checkpoint` L52: `page, "s:back"` → `page, "m:menu"); await tap(page, "m:units"`
- `s6c-checkpoint` L54: `) => document.querySelector("h1")?.textContent === "Hero", null, { timeout: 15000` → `) => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Hero"), null, { timeout: 15000`
- `s6c-checkpoint` L68: `) => document.querySelector("h1")?.textContent === "Raider", null, { timeout: 15000` → `) => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Raider"), null, { timeout: 15000`
- `s6c-checkpoint` L73: `await press(page, "Blank", true` → `await tap(page, "m:close"`
- `s7-stage-links` L32: `await page.waitForFunction((` → `await tap(page, "m:switch"); await page.waitForFunction((`
- `s7-stage-links` L35: `page, "s:back"` → `page, "m:switch"`
- `s7-stage-links` L36: `page, "s:back"` → `page, "m:switch"`
- `s7-stage-links` L37: `await press(page, "Demo stage", true` → `await tap(page, "m:close"`
- `s8-autosave-links` L32: `await page.waitForFunction((` → `await tap(page, "m:switch"); await page.waitForFunction((`
- `s8-autosave-links` L35: `page, "s:back"); await page.waitForFunction(() => [...document.querySelectorAll("h2")].some((h) => h.textContent === "Stages"), null, { timeout: 15000 }); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:start"); await page.waitForFunction(() => document.querySelector(".sheet") === null, null, { timeout: 15000` → `page, "m:switch"); await page.waitForFunction(() => [...document.querySelectorAll("h2")].some((h) => h.textContent === "Stages"), null, { timeout: 15000 }); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:start"); await page.waitForFunction(() => document.querySelectorAll(".sheet").length < 2, null, { timeout: 15000`
- `s8-autosave-links` L36: `page, "s:back"` → `page, "m:switch"`
- `s8-autosave-links` L37: `page, "test"` → `page, `stage:${up}`); await tap(page, "s:test"`
- `s8-autosave-links` L38: `await page.waitForFunction((` → `await tap(page, "m:menu"); await page.waitForFunction((`
- `s9-art-backgrounds` L30: `page, "test"` → `page, "s:test"`
- `s9b-art-upload` L32: `page, `stage:${STAGE}`); await tap(page, "s:cell:0,0"` → `page, "s:cell:0,0"`
- `s9b-art-upload` L55: `page, "back"` → `page, "m:menu"); await tap(page, "m:games"`
- `s9b-art-upload` L59: `await page.waitForFunction(() => document.querySelector('[data-act="continue"]') !== null, null, { timeout: 15000 }); await tap(page, `stage:${STAGE}`` → `await tap(page, "m:menu"); await page.waitForFunction(() => document.querySelector('[data-act="continue"]') !== null, null, { timeout: 15000 }); await tap(page, "m:close"`
- `s9b-art-upload` L62: `page, "s:back"` → `page, "m:menu"`

### Earlier kit pins
- F2a1's shipped test (`tests/tools/f2a1-carries.test.ts`) passes unchanged, including its stage error-state Back (L142) and the Budgets row pins.
- F2a2a's shipped test (`tests/tools/f2a2-menu-kit.test.ts`) passes unchanged.
- The F1 kit folder's copies are history and are not edited; F1 plants P20 and P24 stay dead.

## Caps (counted: `git add -N . && git diff --numstat <your base> -- . ':!handback/**' ':!package-lock.json'`)

| File | + | − | counted (cap) |
|---|---|---|---|
| `handoff/steps/tests/s10b-effect-data/smoke.mjs` | 1 | 1 | 2 |
| `handoff/steps/tests/s10c-effect-editor/smoke.mjs` | 9 | 9 | 18 |
| `handoff/steps/tests/s10d-builtin-effects/smoke.mjs` | 4 | 4 | 8 |
| `handoff/steps/tests/s11a-export-mvp/smoke.mjs` | 1 | 1 | 2 |
| `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs` | 1 | 1 | 2 |
| `handoff/steps/tests/s11b-debug-apk/smoke.mjs` | 1 | 1 | 2 |
| `handoff/steps/tests/s11c1-budgets/smoke.mjs` | 5 | 5 | 10 |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` | 6 | 6 | 12 |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | 2 | 2 | 4 |
| `handoff/steps/tests/s4b-stage-place/smoke.mjs` | 1 | 1 | 2 |
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | 7 | 7 | 14 |
| `handoff/steps/tests/s5a-units/smoke.mjs` | 5 | 5 | 10 |
| `handoff/steps/tests/s5b-abilities/smoke.mjs` | 5 | 5 | 10 |
| `handoff/steps/tests/s5c-add-ability/smoke.mjs` | 1 | 1 | 2 |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | 5 | 5 | 10 |
| `handoff/steps/tests/s6b-levels/smoke.mjs` | 4 | 4 | 8 |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | 6 | 7 | 13 |
| `handoff/steps/tests/s7-stage-links/smoke.mjs` | 4 | 4 | 8 |
| `handoff/steps/tests/s8-autosave-links/smoke.mjs` | 5 | 5 | 10 |
| `handoff/steps/tests/s9-art-backgrounds/smoke.mjs` | 1 | 1 | 2 |
| `handoff/steps/tests/s9b-art-upload/smoke.mjs` | 4 | 4 | 8 |
| `tests/editor/project-home.test.ts` | 2 | 2 | 4 |
| `tests/tools/export-11a.test.ts` | 1 | 1 | 2 |
| `tests/tools/f1-look-kit.test.ts` | 5 | 7 | 12 |
| `tests/tools/f2a2-land-on-map.test.ts` | 29 | 0 | 29 |
| `tests/tools/play-stage-source.test.ts` | 3 | 3 | 6 |
| `tools/maker/effects.ts` | 7 | 0 | 7 |
| `tools/maker/home.ts` | 127 | 31 | 158 |
| `tools/maker/project.ts` | 0 | 11 | 11 |
| `tools/maker/stage.ts` | 1 | 1 | 2 |
| `tools/maker/test-launch.ts` | 1 | 1 | 2 |
| `tools/maker/units.ts` | 7 | 0 | 7 |
| **total** | 261 | 136 | **397** |

## Kit and plants
- `handoff/steps/tests/step-f2a2b-land-on-map/SHA256SUMS`: run `sha256sum -c SHA256SUMS` inside the folder first.
- `tests/tools/f2a2-land-on-map.test.ts` (1 test: the stage bar's ☰ button and switch button with the down icon; a single `s:back` left (the error bar); no `project.ts`, no `projectScreen`; Budgets and Build mounted in the menu; `unitCount`/`effectCount` used for the ☰ metas; `landOn` on open; the no-stages missing-screen banner; the deleted-current-stage move to the first stage; a failed Test travel writes `state.banner = got.error`; `beginTest` closes the menu; the menu drawn only without the build sheet; no "project" screen; `backScreen` mapping).
- `plants-f2a2b.py`: all 27 plants, each restored after its run. From the repo root on the finished tree, `python3 handoff/steps/tests/step-f2a2b-land-on-map/plants-f2a2b.py` must print `27/27 caught` (P1–P16 are F2a2a's and run against both tests; P17–P27 are this slice's, of which P23–P27 were added in r2). Write the plants' anchor strings verbatim.

## Acceptance
- `npm ci && npm run green` exits 0 with **1204 pass, 0 fail** (floor 1203 + 1); the shipped test copied verbatim.
- `tsc -p tools/tsconfig.json`: only the 3 base errors, `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` **L156** twice (TS7053; L93 before this step, moved by the added lines).
- Plants: 27/27 caught.
- Smokes: all 25, solo, each at 390 and 360, with the ok counts EA recorded: s0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s8c 8, s9 12, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8, s11a 6, s11a2 6, s11b 6, s11c1 6, all PASS.
- Look: at 390 the ☰ sheet matches f02 (h2 the game's name, the 8 rows in order, metas, chevrons, close) and the switcher matches f03 (h2 "Stages", the "STAGES" eyebrow, the check on the picked stage, + Add stage), within the Open points. Attach 390 and 360 shots of both in the hand-back.
- Rule 8 scan of the diff: clean (one statement per line in new code; no chained control headers; braced bodies; only an innermost `for (…) oneStatement;` or a braceless `if (…) continue;` / `if (…) return x;` on one line; the edits inside existing dense lines are only the quoted ones).
- Size: within the caps above; 400 is the hard gate.

## Must NOT
No edits outside the Files lists; nothing in src/**, tools/play-stage, tools/export, tools/apk, tools/art-bake, `tools/maker/game-menu.ts`, `tools/maker/icons.ts`, `tools/maker/app.css`, data/, fixtures/, the root package.json or package-lock.json, docs/maker/**, any other test or smoke, the F1, ART1a, F2a1 or F2a2 kit folders, painter-proto or ui-shell; no map.tile change; no new dependency; no other eyebrow or header change; no tool bar icons (F4); no "last stage" memory (F2b).

## Open points (EA flags for QA/UX: where the build differs from the f02/f03 mocks)
1. Budgets and Build rows are mounted as they are (F2a2b Ruling 4): no chevron, and the Budgets row reads "Budgets: all good" (its summary) rather than f02's "Budgets". The Budgets row is absent when a project has no budgets, as on main. Adding a chevron would re-pin F2a1's shipped test (f2a1-carries L69), budgets-11c1 and export-11a.
2. Continue (resume) stays as a ghost button under the ☰ rows; the plan doesn't place it.
3. Stage rows have no "Map · cols×rows" meta (f03 shows one); the ⋯ stage menu stays beside each row, and the Maps section follows + Add stage.
4. Landing goes to the first stage in `project.stages` (F2b adds the last stage edited). Deleting the current stage from the switcher moves to the first stage.
5. Non-picked switcher rows have a blank 24 px slot, as in the mock.
6. Tests rebased: 4 (project-home, play-stage-source, f1-look-kit, export-11a), not the plan's 2; smokes edited: 21 of 25, not the plan's 14 (EA-3 counted only those passing through the project page; ☰ and the switcher also move Back, Units, Effects, Levels and the stage list).
7. The stage bar keeps its existing second row (View, Background, Rules, Start new, Test) until F4's tool bar; f01's one-row bar is not this step.
8. On the project page "Can't play yet" was a sheet; on the stage the Test and Build gates show the stage banner with Dismiss.
9. **Effects meta (QA must-fix 3, listed for UX).** f02 shows "10 built-in"; this step's ☰ row shows a number, the count of project effect rows the Effects sheet draws (`effectCount` / `effectRows`), which is 0 on a fresh demo. The bundled/built-in count is available to the maker (`builtinRows` and `BUNDLED`, already used by the ability panel) without putting game rules in core, but the menu renders `String(host.effects)` in F2a2a's `game-menu.ts`, which this slice must not edit (F2a2a is OK TO SEND). A later touch can change that meta to a phrase such as "10 built-in". Until then the number matches the sheet, not the mock's wording.

## Places that change if UX re-rules the eyebrow
- `tools/maker/game-menu.ts`, `stageSwitcher`: `${head("Stages")}<p class="eyebrow">Stages</p>`.
- `tools/maker/app.css`: the `.eyebrow { … }` rule.
- `tests/tools/f2a2-menu-kit.test.ts`: the switcher test (one eyebrow "Stages"), the game menu test ("no eyebrow") and the eyebrow test (the exact rule; one use in tools/maker).
- `plants-f2a2a.py` and `plants-f2a2b.py`: P5, P6, P7, P8, P9.
- The F2a2a guide: Ruling 1, the CSS block and the Look note. This guide: the Look acceptance line.

## EA trial record
Trial `f2a2b-trial.patch` (r2) on the F2a2a trial: commit `47753a46bfa2dbc30b8836feeca202f517ef1cba` (tree `3e180ff3ab1a1a64c51dca995ab45bf60ffd6a55`), G-TileEngine identity. Checked on a fresh GitHub clone: F2a2a's patch on `ce848f57`, then `git am` of this patch gives that tree. Green **1204 pass, 0 fail**, all checks OK; tools tsc 3 base errors (page.ts L101; home.ts L156 ×2); plants 27/27; all 25 smokes PASS at 390 and 360 (`verify/b-r2/` on the box); Rule 8 scan of every changed line clean; counted **397** (under 400). r1 (tree `9c04b6c8…`) is kept as history in `/workspace/share/f2a2b-r1/`. EA's comparison shots against f01–f03 at 390 and 360 are on the box (`shots/`).

## Hand-back sections
Green (code head sha and tree, counts), Plants (`plants-f2a2b.py` output), Smoke (all 25 solo at 390 and 360 with their ok counts), Look (the shots), Rule 8 scan, Size (numstat against the caps), Helpers & self-review (EVERY helper agent, script and one-off command file you used, one line each; "None" if none).
