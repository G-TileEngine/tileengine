# step-f1-look-kit: the look kit: button order, icons, picker chips, card thumbs, Undo chip (maker overhaul plan F1; style-spec r2 § 5 and § 7; CEO 27 Nov 03:53 "F0c, then F1")

Step id: step-f1-look-kit          Revision: r3b (r3 → r3b: guide only, UX ruled 2026-11-27 16:45; the On aria-label match carried to F2a by EA's size ruling, F1's line stays 380; r2 → r3: UX ruled 2026-11-27 16:09, via CoS: every on/off toggle becomes a two-option framed pill, and New project, + Add unit and + New effect become ghost rows with the plus icon; r1 → r2: QA kit review `docs/qa/step-f1-kit-review.md`, sha256 `61af4983…`, must-fixes 1–2, and UX's rulings of 15:4x)
Repo: https://github.com/G-TileEngine/tileengine (you push your own step branch only — see Delivery)
Base commit: main **`e0455199bb44d2722a15f0d63fdd741d67ff8028`** (tree `b54d90d4c9bc42f1611f2237581d4558b3169bf2`), docs-only on the **F0c merge `bde1e737`** (PR #113, ChatA). Checked from a fresh `/tmp` clone: green on `bde1e737` **1180 pass, 0 fail**, all checks OK; `bde1e737..e0455199` touches docs only. If main has moved by the go, CoS re-checks that it is docs-only on `e0455199` and that the trial patch applies.
Branch: step/step-f1-look-kit-r1-chatA, from the base. Never commit to main. Chief Of Staff opens the PR to main from your pushed branch.
Delivery (CN-028): one builder chat (ChatA), one QA review, and a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). Commit HANDBACK.md as the branch's last commit, then push once with `GH_BUILDER_TOKEN` through a one-shot credential helper (CN-028 § Token; keep the single quotes): `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-f1-look-kit-r1-chatA` (that branch only: never main, another branch or a tag; no force-push, no branch delete, no PR actions). The hand-back message quotes the branch, the full tip sha, the Base sha and the test counts. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the branch".
Hand-back location: in the repo, on that branch: handback/step-f1-look-kit/r1/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on:
- F0c (merged, `bde1e737`): nothing in F1 reads its code; it is the base.
- `docs/maker/style-spec.md` r2 (sha256 `8765d849…`): § 5 buttons, § 7 Button order, Icons, Picker chip, Card thumbnail, Undo chip; § 8 shots `f01` (sha256 `816838f5…`) and `f04` (`625b37af…`).
- `docs/maker/ux/maker-overhaul-plan.md` r6 (sha256 `7326ee29…`): L54 item 3(a), L69 (the F1 row), L82–L83, L235, L273, L276.
- Format: none read or written (tile-project 6, stage 2, no bump).
Read first: BUILD_GUIDE.md §2.2, §6, §7; `docs/qa/step-f1-kit-review.md` (sha256 `61af4983…`, the r1 kit review); style-spec § 5 (incl. the framed pill toggle) and § 7 in full; plan L69, L83 and § EA-8 L273–L276; UX's icon drawings (the § 7 icon set; the paths in Ruling 5 are UX's, verbatim).
Kit: r3, 2026-11-27. Trial commit `8ac4e69384639af55970210ddc852d4521ad889d` on `e0455199` (tree `4ccddd3fd01c4439b06295b23ef0d52788f9d077`), checked on a fresh GitHub clone: `f1-trial.patch` passes `git apply --check` on `e0455199` and gives the same tree; green **1188 pass, 0 fail**, plants **29/29** caught. Smokes on that clone: all 25 PASS solo at 390 and 360 (eight smokes edited by ruling, see Smoke lines): s0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8, s11a 6, s11a2 6, s11b 6, s11c1 6 ok (one runner stopped after s6a; s6b onward re-run solo on the same clone). Export audit **136 / 150 / 150**, 0 hits, the same as the base. EA's look check shots of the trial at 390 and 360 are on the box (`/workspace/share/f1/trial-shots/`, not pushed; View's Grid lines in both states). Not run: the builder's tap-path shots.
Carries: none filed; no pin moves.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Today every maker button is the same blue (`.btn` is the accent fill), so a sheet can hold a column of five primaries, and pickers are blue buttons whose picked state only shows on `.choice` cards (plan L54, item 3(a)). After F1:
- each screen and sheet has at most one blue button, every other button is ghost, and Delete-type buttons are red;
- the maker has one file of 16 line icons, used on Test, Back, Save, the top-bar tools, ⋯ menus, + Add stage and card thumbnails;
- every picker is a chip with a visible picked ring and a centred label, app-wide, and every on/off toggle is a two-option § 5 framed pill (label on the left, Off | On on the right);
- list cards lead with a 48 px thumbnail (its icon until pictures exist in F3b);
- the stage editor's full-width "Nothing to undo" bar becomes the floating Undo chip;
- + Add stage, New project, + Add unit and + New effect stop using the selected look (accent-soft fill, accent border) and become ghost rows with the plus icon, so that look only means selected.
No layout moves: screens, sections and tap paths stay as they are (F2a moves them). The map keeps today's coloured blocks with words (L83); no art, no swatches, no cell CSS.

## Where step-f1-look-kit sits (placement card)
1. Lives at: every maker screen that exists today: My games and its sheets; the project page (Stages, Maps, Units, Effects, Levels sections, Budgets row, Build game sheet); the stage editor, its top bar and every sheet it opens (tile sheet, View, Start new, links, Pick a unit, NPC talk); the unit page; the effect sheet; Background; Rules. · Tap path from the stage editor: 0 taps for the top bar (▶ Test the only blue button, ghost Back, View, Background, Rules with icons, red Start new) and the Undo chip (after one paint); 1 tap (a tile) for the terrain chips with the current tile ringed; 1 tap (Back) for the project page's thumbnails and blue Test.
2. Changes or replaces: replaces the stage editor's full-width Undo / "Nothing to undo" bar (`tools/maker/stage.ts` L161 on the base) with the floating Undo chip. Everything else is restyled in place: the same buttons, in the same places, with the same words. No new screen, section or ☰ row.
3. Seen at once: on landing in the stage editor, Test is the only blue button and Start new is red; after a paint, the Undo chip floats bottom-left over the map; tap a tile and the terrains are chips, the current one ringed. On the project page the cards show thumbnails, ⋯ is the more icon, and + Add stage, + Add unit and + New effect are ghost rows (New project too, on My games). View's Grid lines (and Autosave here, On your team, the Rules toggles) are a label with an Off | On framed pill. Nothing changes in Test or play.
4. Data path: none. No project file, format, save or reader change: written by nothing · read by Test/play: nothing (`tools/play-stage` and `tools/export` untouched; the export audit stays 136 / 150 / 150) · demo data: the demo template, unchanged.
5. Usable on landing: this step adds the minimum visible piece: it restyles screens that ship today, so it is usable the moment it lands.
6. Proof: 390×844 mock now: style-spec § 8 `f01` (Undo chip) and `f04` (terrain chips, one picked); the F0 mock sheet `kit.css` the parts come from. The handback has shots of the full tap path at 390×844 and 360: (a) stage editor on landing; (b) after painting one tile (Undo chip); (c) the tile sheet (terrain chips, current ringed); (d) the project page (thumbnails, blue Test); (e) the unit page (On your team Off | On, blue ▶ Test); (f) My games (New project ghost row); (g) View, Grid lines On and then Off. And the row it adds to the F6 tap-path table: "Look kit (F1) | stage editor: Test is the only primary; Undo chip after a paint; tile → picked terrain chip; View → Grid lines Off | On | 0–1".

## Rulings
1. **Every button names its role** (style-spec § 5; plan L69): a `<button>` or `<label>` with class `btn` also carries exactly one of `primary`, `ghost`, `danger` or `icon`; a picker option is `class="pick"` instead. `primary` is a marker only: the `.btn` rule stays the accent fill and no `.btn.primary` CSS is added. No bare `class="btn"` remains in `tools/maker`. **+ Add stage** (UX extra, 2026-11-27 15:4x): the project page's `card new` button (`rooms.ts` `roomTail`) becomes `<button type="button" class="btn ghost stage-row" data-act="r:add">${icon("plus")}Add stage</button>`, the same ghost row as Budgets and Build game, so the selected look (accent-soft fill, accent border) only ever means selected. No smoke or test reads its text (smokes tap `r:add`). **UX ruled 2026-11-27 16:09:** the same for My games' New project (`home.ts`, `data-act="new"`; its "Demo or empty" sub line goes, as a ghost row is one line), + Add unit (`units.ts`, `u:add`) and + New effect (`effects.ts`, `e:new`): `<button type="button" class="btn ghost stage-row" data-act="…">${icon("plus")}{New project | Add unit | New effect}</button>`. No `card new` button is left in the maker (the `.card.new` CSS on L8 stays, untouched). Pinned by: "F1 button roles: every maker button names its role (btn primary, ghost, danger or icon) or is a pick chip; no bare class=\"btn\" is left; + Add stage, New project, + Add unit and + New effect are ghost rows with the plus icon, so the selected look only means selected".
2. **One primary per screen or sheet** (§ 7 Button order: "one primary per screen or sheet … No column of primaries"; on the stage editor that's ▶ Test). The primaries (EA table; **UX ruled 2026-11-27 15:4x: accepted**, with Share primary and Done ghost on the build-ready sheet, Update primary on the offer sheets, Add picture primary on Background, and on the project page Test primary and Continue ghost):

| Screen or sheet | Primary | Data-act |
|---|---|---|
| Stage editor | Test | `s:test` |
| Project page | Test | `test` |
| Pick a start / Name it, Rename | Continue / Create, Save name | `toname` / `create`, `dore` |
| Project missing | Back to maker | `back` |
| NPC talk | Save | `s:talk-save` |
| Stage or map Rename / Resize | Save / Apply | `r:save-name` / `r:apply` |
| Unit name (add or rename) | Add / Save | `u:create`, `u:save-name` |
| Unit page / Effect sheet / Levels sheet | Test (play icon) | `a:test` / `test` / `test` |
| Build error / Build ready | Try again / Share | `build` / `build:share` |
| Background | Add picture (the label) | `data-art` |
| Update offer (abilities, rules) | Update | `g:update`, `r:update` |

Every other button is ghost, including: the toast's Undo, painting Done, Move's Cancel, the unit sheet (Edit, Move, Test, What do they do?), place, link and stage rows, Just stand here and Talk, both Duplicates, + Add ability, Start from a role and its roles, Use map, New map, Rename, Game starts here, Resize, − and +, the project page's Continue, the levels card's Update and Turn on levels, a per-ability Test and the unit sheet's Test (UX ruled 2026-11-27 15:4x: both ghost). Pinned by: "F1 button order: at most one primary per screen and per sheet; Test is the stage's and the project page's primary".
3. **Danger buttons** (§ 7: "Delete and Start new are always danger"): Delete (`delete`, `u:delete`, `r:delete`, `e:delete`, `s:delete`), Remove (`b:del:`), Remove link (`s:unlink`), × (`a:drop:`), Start new (`s:fresh`, `s:fresh-go`) are `btn danger`. Base changes: `s:delete`, `s:unlink`, `a:drop:` were blue, `s:fresh` and `b:del:` were ghost. **UX ruled 2026-11-27 15:4x:** Remove link is danger; a × is danger only when it deletes something (the ability row's × removes the ability, so it is danger); a × that closes a sheet stays ghost (the maker has none today). Pinned by: "F1 danger: Delete, Remove, Remove link and Start new are always btn danger".
4. **Picker chips** (§ 7 Picker chip; fixes item 3(a) app-wide): these become `class="pick"` with `aria-pressed`: the knob widgets' picker, ref built-ins and colour (`widgets.ts`); the ability's effect choices (`ability-panel.ts`, were `.choice`); the stage tile sheet's terrains (were `.choice`; `aria-pressed` is true for the tile's current terrain, `tileId(got.map, cell.c, cell.r) === row.id`). The colour chip drops its full-button inline background for a 28 px `.sw` swatch: `<span class="sw" style="background:var(${token})"></span>` before the token name. **UX ruled 2026-11-27 15:4x:** a chip with no swatch has symmetric padding (`0 14px`), the label is centred in every chip, and chips stay full width in today's column sheets (the § 7 `.chips` row waits for F4). New CSS, exact (app.css L59–L62 in the trial):
   `.pick { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 14px; border-radius: 999px; border: 2px solid var(--line); background: var(--surface); color: var(--ink); font-weight: 700; font-size: 0.9rem; }`
   `.pick[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent); }`
   `.pick:has(.sw) { padding: 0 14px 0 8px; }`
   `.sw { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--line); flex: none; }`
   The class is `pick`, not `chip`: `.chip` is today's status strip ("Painting … · Tap more tiles", "Moving …"), and smokes s4a and s6c wait for `.chip` to be gone. The New game wizard's Demo/Empty stay `.choice` cards (§ 5 choice card; UX ruled 2026-11-27 15:4x). Pinned by: "F1 pickers: every aria-pressed button is a .pick chip or a framed-pill toggle (the new-game wizard's .choice cards aside); a chip is 48 px, centres its label, pads 14 px each side without a swatch and draws the picked ring of style-spec § 7".
4b. **Toggles are a two-option framed pill** (§ 5 Framed pill toggle, for a 2–3-way choice; UX ruled 2026-11-27 15:4x that toggles keep the framed pill, and **UX ruled 2026-11-27 16:09** that a frame with one option is not OK: it reads as a selected chip, and Off would be an empty frame). Every on/off toggle (the knob toggle in `widgets.ts`, used by the Rules sheet; View's Grid lines; Autosave here; On your team) is built by one new helper in `widgets.ts`:
   `seg(label, on, act)` → `<div class="seg-row"><span class="seg-label">{label}</span><span class="seg" role="group" data-seg="{act}">{Off option}{On option}</span></div>`, each option `<button type="button" class="seg-opt" aria-pressed="{set}" aria-label="{label}: Off | {label}"[ data-act="{act}"]><span>Off | On</span></button>`.
   The label is plain text on the left, outside the frame; the frame sits on the right with Off then On; exactly one option is pressed, and the inset pill sits on it. **Only the option that isn't set carries `data-act`**, so tapping the set option does nothing and tapping the other one sends today's act (`k:toggle:{id}`, `s:grid`, `s:autosave`, `t:team`), whose handler flips the value as on the base. Handlers, saved data and undo are unchanged. The On option's `aria-label` is the label itself (so `[aria-label="On your team"]` still reads the on state), the Off option's is "{label}: Off". **New button words "Off" and "On"** (UX ruled 2026-11-27 16:09): the one exception to "no new words on any button". CSS (L70–L74): `.seg-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; }`; `.seg { display: inline-flex; align-items: center; flex: none; height: 40px; box-sizing: border-box; border: 1px solid var(--seg-line); border-radius: 12px; background: var(--surface); }`; `.seg-opt { min-height: 48px; margin: -5px 0; padding: 0; border: 0; background: transparent; color: var(--ink); font-weight: 700; }`; `.seg-opt > span { display: inline-flex; align-items: center; height: 30px; margin: 0 4px; padding: 0 12px; border-radius: 8px; }`; `.seg-opt[aria-pressed="true"] > span { background: var(--accent); color: var(--accent-ink); }`. So the frame is 40 px, each option's hit area 48 px (`margin: -5px 0`), and the pill 30 px, 4 px in from the frame. Pinned by: "F1 toggles: every on/off toggle (rules and knob toggles, Grid lines, Autosave here, On your team) is a two-option § 5 framed pill: the label as text outside the frame, then Off and On, exactly one pressed; only the option that isn't set carries the act; 40 px frame, 48 px options, 30 px accent pill".
5. **Icons** (§ 7 Icons: inline SVG, 24 px, viewBox `0 0 24 24`, stroke currentColor 2 px, round caps and joins, no fill except play and more, in one maker file; no icon font, emoji or package): new `tools/maker/icons.ts` holds 16 icons, UX's drawings verbatim: play, undo, more, back, save, build, rules, image, grid, units, stages, effects, levels, edit, plus, resize. `icon(name)` returns `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">…</svg>`. Where they go: play before every "Test" (stage, project, unit page, per ability, effect, levels, the unit sheet); back on Back (stage, project, unit page, Trash); save on Save; build on Build game (idle); grid on View; image on Background; rules on Rules; edit on Edit and Rename; resize on Resize; undo in the Undo chip; plus on Add stage, New project, Add unit and New effect (their "+" character goes); more replaces every ⋯ (5 places); the card thumbs below. "▶ " goes (the play icon replaces it); "+ Add ability" keeps its "+" (smoke s5c presses it by text). The Budgets icon is not in F1 (Not in this step). New CSS (L63–L65): `.ico { width: 24px; height: 24px; flex: none; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; vertical-align: middle; }`, `.btn > .ico { margin: -2px 6px 0 -2px; }`, `.btn.icon > .ico { margin: 0; }`. Pinned by: "F1 icons: one maker file of 24 px line icons (stroke currentColor, fill only on play and more); Test buttons lead with play and ⋯ menus are the more icon".
6. **Card thumbnails** (§ 7 Card thumbnail: "48×48, radius 8, `--surface-2` fill, 1 px `--line` border … or its icon in `--muted` when there is none"): `thumb(name)` = `<span class="thumb">${icon(name)}</span>`, first in the card: My games rows (stages, as in `f07`), project stage rows (stages), maps (grid), units (units), effects (effects), the levels card (levels). Icon only: no card has a picture until F3b (UX ruled 2026-11-27 15:4x: icon-only, the stages icon on game rows). CSS (L66): `.thumb { box-sizing: border-box; width: 48px; height: 48px; border-radius: 8px; flex: none; display: grid; place-items: center; background: var(--surface-2); border: 1px solid var(--line); color: var(--muted); }`. Pinned by: "F1 card thumbnails: game rows, stage rows, maps, units, effects and levels cards lead with a 48 px thumb".
7. **Undo chip, kept in F1** (§ 7 Undo chip; the trial is 377 counted lines, under the 380 that would move it to F4): the dock's Undo / "Nothing to undo" button goes; the dock now renders only when a status chip or note shows. After the stage body: `<div class="float"><button type="button" class="undo-chip" data-act="s:undo"><span>${icon("undo")}Undo</span></button></div>`, rendered only when `!host.readOnly`, `canUndo(sess.stack)` and no stage sheet is open (`over`, the joined tile, links, Pick a unit, NPC, View, Start new and Rules sheets, is `""`). CSS (L67–L69): `.float { position: relative; height: 0; }`; `.undo-chip { position: absolute; z-index: 4; left: 12px; bottom: calc(8px + env(safe-area-inset-bottom)); min-height: 48px; padding: 4px; border: 0; background: transparent; }`; `.undo-chip > span { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 14px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); font-weight: 700; color: var(--ink); }`. Where it sits: `.float` is a zero-height box right after the stage body (`.body.stage`), so the pill shows 40 px high, 16 px from the left and **12 px above the stage body's bottom edge plus `env(safe-area-inset-bottom)`** (UX ruled 2026-11-27 15:4x). That is near the bottom of the screen, or just above the dock when a status chip shows; there is no tool bar until F4. Don't move it up to the grid. The 48 px hit area is the button box itself (`min-height: 48px; padding: 4px` around the 40 px pill), and `z-index: 4` sits under `.scrim` (5). No smoke measures the chip, so the shipped test pins the `.undo-chip` rule byte for byte, and app.css must set it once (QA must-fix 1). Pinned by: "F1 Undo chip: no Nothing to undo bar; after a paint the chip floats with the undo icon and Undo, and it hides while a sheet is open; its button is the 48 px hit area, under the scrim, with the pill 12 px above the stage body's bottom edge plus the safe area".
8. **Rule 8** (QA Ruling 7, as in F0c): one statement per line in all new code; any body that holds a statement takes its own lines. Never pack a new statement onto an existing line. The only edits inside existing dense lines are the class swaps, icon and thumb insertions, `seg(…)` calls, and `aria-pressed` additions this guide names (Files). `seg` is a new function with one statement per line. The new lines in `stage.ts` are `const goes`, `const over` and `const undo`, one statement each.
9. **No map look, no art** (plan L83, L110, L273): the `.cell` rules (app.css L42–L46), `tokens.css`, `.choice`, `.card` and `.chip` rules stay byte-for-byte. F3's cell styles go to `tools/maker/cells.css` later, not here. Pinned by: Acceptance (`git diff` of those lines is empty).
10. **New project's sub line** (UX ruled 2026-11-27 16:45): dropping New project's "Demo or empty" sub line in the plus ghost row is OK; the wizard's Demo and Empty cards say it.

## Files to create or change
- create `tools/maker/icons.ts` (≤ 24; Ruling 5)
- change `tools/maker/app.css` (≤ 17+ 1−; Rulings 4–7: append L59–L74, drop `.undo { width: 100%; }` from L51)
- change `tools/maker/stage.ts` (≤ 14+ 10−; two imports, top bar roles and icons, terrain chips, `seg(…)` for Grid lines and Autosave, Remove link, link rows, Done, the Undo chip)
- change `tools/maker/stage-sheets.ts` (≤ 8+ 7−; import, ghost rows, Talk Save primary, unit sheet roles and icons, Cancel)
- change `tools/maker/home.ts` (≤ 9+ 8−; import, row thumb and more icon, Continue, Create/Save name, toast Undo, Back to maker, project Continue, Trash Back icon, New project row)
- change `tools/maker/project.ts` (≤ 4+ 3−; import, Save and Back icons, stage-row thumb and more icon, Test primary with play)
- change `tools/maker/rooms.ts` (≤ 9+ 8−), `tools/maker/units.ts` (≤ 9+ 8−), `tools/maker/widgets.ts` (≤ 9+ 4−; `seg` and the toggle), `tools/maker/ability-panel.ts` (≤ 7+ 6−), `tools/maker/effects.ts`, `tools/maker/levels.ts` (≤ 5+ 4− each), `tools/maker/build-sheet.ts` (≤ 4+ 3−), `tools/maker/add-ability.ts`, `tools/maker/art.ts` (≤ 2+ 2− each), `tools/maker/rules-panel.ts` (≤ 1+ 1−): roles, icons, thumbs, chips, `seg(…)` and plus rows per Rulings 1–6 (caps are the trial's counts: the total must stay ≤ 380)
- change `tests/editor/project-home.test.ts`, `tests/editor/stage-editor.test.ts` (1+ 1− each; Existing tests changed by ruling)
- change the eight smokes in Smoke lines (13+ 13− in all; only the lines named there)
- create `tests/tools/f1-look-kit.test.ts` (the shipped file, verbatim)
(Nothing else. An extra file must be named and justified in the Decisions note, or it is a REJECT.)

Size: 150–400 changed lines; F1's own target is 300–380 (plan L276). The trial changes **377** lines (+292/−85) in 27 files (count: `git add -N . && git diff --numstat <base> -- . ':!handback/**' ':!package-lock.json'`, QA's G7):

| File | Trial / cap |
|---|---|
| `tools/maker/icons.ts` | 24+ / 24 |
| `tools/maker/app.css` | 17+ 1− / 18 |
| `tools/maker/stage.ts` | 14+ 10− / 24 |
| `tools/maker/stage-sheets.ts` | 8+ 7− / 15 |
| `tools/maker/home.ts` | 9+ 8− / 17 |
| `tools/maker/rooms.ts` | 9+ 8− / 17 |
| `tools/maker/units.ts` | 9+ 8− / 17 |
| `tools/maker/widgets.ts` | 9+ 4− / 13 |
| `tools/maker/ability-panel.ts` | 7+ 6− / 13 |
| `tools/maker/effects.ts`, `levels.ts` | 5+ 4− each / 9 each |
| `tools/maker/project.ts`, `build-sheet.ts` | 4+ 3− each / 7 each |
| `tools/maker/add-ability.ts`, `art.ts` | 2+ 2− each / 4 each |
| `tools/maker/rules-panel.ts` | 1+ 1− / 2 |
| two existing tests | 1+ 1− each / 2 each |
| eight smokes | 13+ 13− in all / 26 |
| `tests/tools/f1-look-kit.test.ts` | 149+ / 149 (shipped, verbatim) |
| **Total** | **377 / 400**; F1's own limit is **380** (over it, stop and report: the Undo chip would move to F4) |

Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Interfaces to match (quoted exactly)
```ts
// tools/maker/icons.ts
export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as readonly IconName[];
export const icon = (name: IconName): string => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name]}</svg>`;
export const thumb = (name: IconName): string => `<span class="thumb">${icon(name)}</span>`;
```
`PATHS` is a `const` object (`as const`) in this order: play, undo, more, back, save, build, rules, image, grid, units, stages, effects, levels, edit, plus, resize. Its values are UX's paths as in the trial patch, byte for byte (only play's path and more's three circles carry `fill="currentColor"`). `tools/maker/widgets.ts` gains `export function seg(label: string, on: boolean, act: string): string;` (Ruling 4b; `label` arrives escaped). No other exported signature changes.

## Smoke lines
All 25 smokes PASS solo at 390 and 360 (ports as in the 11c1 guide; s11b on 8840). Eight are edited by ruling, nothing else in them:
- `s4a-stage-paint/smoke.mjs` L26 and L28: `".sheet .choice"` → `".sheet .pick"` (Ruling 4: terrains are chips).
- `s4b-stage-place/smoke.mjs` L28: the same.
- `s9b-art-upload/smoke.mjs` L27, the `undo` helper: `return b instanceof HTMLButtonElement && b.disabled !== on && b.textContent === (on ? "Undo" : "Nothing to undo");` → `return on ? b instanceof HTMLButtonElement && b.textContent === "Undo" : b === null;` (Ruling 7: with nothing to undo there is no button).
- `s5a-units/smoke.mjs` L33 and L41, `s5b-abilities/smoke.mjs` L73: `"+ Add unit"` → `"Add unit"` (Ruling 1, UX 16:09: the "+" is the plus icon now).
- `s6a-win-rules/smoke.mjs` L31 and L45, `s6c-checkpoint/smoke.mjs` L81: `document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "true"` → `document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "On"`; s6a L38: the same with `"false"` → `"Off"` (Ruling 4b: the act now sits on the option that isn't set, so the state is read from the pressed option).
- `s8-autosave-links/smoke.mjs` L34: `await waitText(page, "Autosave here: Off");` → `await page.waitForFunction(() => document.querySelector('[data-seg="s:autosave"] [aria-pressed="true"]')?.textContent === "Off", null, { timeout: 15000 });`, and its check `document.querySelector('[data-act="s:autosave"]')?.getAttribute("aria-pressed") === "true" && (document.querySelector('[data-act="s:autosave"]')?.textContent ?? "").includes("Autosave here: On")` → `document.querySelector('[data-seg="s:autosave"] [aria-pressed="true"]')?.textContent === "On" && document.body.innerText.includes("Autosave here")` (Ruling 4b).
Smokes that tap a toggle do so unedited: `tap(page, "k:toggle:wipe_wins")` (s6a L35), `tap(page, "t:team")` (s6c L57) and `tap(page, "s:autosave")` (s8 L34) hit the one option carrying the act, the one that isn't set, so each still flips the value. The `[aria-label="On your team"]` checks (s6a L54, L60, L62; s6c L57, L62, L63, L69) are unedited: that label is the On option's, whose `aria-pressed` is the on state. The touch smokes (s0, s3) and every smoke's 48 px check pass at 390 and 360. The smokes don't measure the Undo chip (it has no 48 px check of its own); the shipped test pins it (Ruling 7).

## Existing tests changed by ruling (and only these)
- `tests/editor/project-home.test.ts` L45 ("names, ids, templates, save, rename, duplicate, trash, stale, corrupt, greyed Test"): `/<button type="button" class="btn" data-act="test">Test<\/button>/` → `/<button type="button" class="btn primary" data-act="test"><svg class="ico"[^>]*>.*?<\/svg>Test<\/button>/` (Rulings 2 and 5).
- `tests/editor/stage-editor.test.ts` L57 ("stage editor paints, clears, lists rows, undoes and keeps a failed save"): `assert.match(stageScreen(STAGE, host), /Nothing to undo/);` → `assert.doesNotMatch(stageScreen(STAGE, host), /undo-chip/);` (Ruling 7). Its `/>Undo</` on L56 still matches.

## Tests that prove it is done
Shipped tests (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a weakened, renamed or deleted one is a REJECT unless "Existing tests changed by ruling" names it; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-f1-look-kit/`) | Copy to | sha256 |
|---|---|---|
| `tests/tools/f1-look-kit.test.ts` | `tests/tools/f1-look-kit.test.ts` | `83ef2acf241e6c1aa9117b19d778cea27745a9219e259817735faeec50df45f5` |
Titles they hold (exact):
- "F1 button roles: every maker button names its role (btn primary, ghost, danger or icon) or is a pick chip; no bare class=\"btn\" is left; + Add stage, New project, + Add unit and + New effect are ghost rows with the plus icon, so the selected look only means selected": scans every `<button>`/`<label>` tag in `tools/maker/*.ts`; the exact markup of the four plus rows, and no `class="card new"` anywhere in the maker source.
- "F1 button order: at most one primary per screen and per sheet; Test is the stage's and the project page's primary": renders the stage editor (landing, tile sheet, View), the project page, the stage sheets, the unit sheet (no primary) and both build sheets, splits each at `class="scrim"`, and counts `btn primary` ≤ 1 per part; no source line holds two.
- "F1 pickers: every aria-pressed button is a .pick chip or a framed-pill toggle (the new-game wizard's .choice cards aside); a chip is 48 px, centres its label, pads 14 px each side without a swatch and draws the picked ring of style-spec § 7": source scan; the `.pick`, `.pick:has(.sw)` and picked-ring CSS lines; a picker and a colour knob (with its `.sw`); the tile sheet with Floor (tile 0,0's terrain) pressed and Water not.
- "F1 toggles: every on/off toggle (rules and knob toggles, Grid lines, Autosave here, On your team) is a two-option § 5 framed pill: the label as text outside the frame, then Off and On, exactly one pressed; only the option that isn't set carries the act; 40 px frame, 48 px options, 30 px accent pill": the exact knob toggle markup in the Off state; View's Grid lines rendered before and after `s:grid`, each with the label before the frame, two options, exactly one pressed and the act only on the other, and the pressed option changing; the four `seg(…)` calls; the five `.seg` CSS lines.
- "F1 danger: Delete, Remove, Remove link and Start new are always btn danger": every delete, `:del:`, `:drop:`, unlink and fresh act.
- "F1 icons: one maker file of 24 px line icons (stroke currentColor, fill only on play and more); Test buttons lead with play and ⋯ menus are the more icon": ≥ 16 icons, each wrapper exact; fills only on play and more; the `.ico` CSS; every `Test</button>` follows the play icon; no "⋯" or "▶" left in the maker source.
- "F1 card thumbnails: game rows, stage rows, maps, units, effects and levels cards lead with a 48 px thumb": the project page renders a thumb; the five other cards start with `thumb(…)`; the `.thumb` CSS.
- "F1 Undo chip: no Nothing to undo bar; after a paint the chip floats with the undo icon and Undo, and it hides while a sheet is open; its button is the 48 px hit area, under the scrim, with the pill 12 px above the stage body's bottom edge plus the safe area": a fresh stage shows neither; paint water at 0,0 → the exact chip markup; open tile 1,1 → no chip; the `.undo-chip` rule exact; the pill CSS.
Every CSS rule the test reads must appear once in app.css (a second `.undo-chip { … }` that overrides it fails).
(You may add tests. The hand-back lists each shipped file's sha256, unchanged.) Floor: **1180 + 8 = 1188**.

## How a planted bug is caught (for QA)
`handoff/steps/tests/step-f1-look-kit/plants-f1.py` (sha256 `2f23d56c076a066f29556426c96bd789a36fedc82416ddd0bd1f8f3a67fad2ef`), run from the repo root on a clean F1 tree: **29/29 caught** in the trial: P1 a second primary on the stage top bar, P2 a second primary in a sheet, P3 a bare btn, P4 a picker that is not a chip, P5 a picked chip without the ring, P6 the current terrain not picked, P7 the colour chip drops its swatch, P8 Delete not red, P9 Start new not red, P10 Test without the play icon, P11 a filled line icon, P12 the ⋯ character back, P13 a card without its thumb, P14 the Undo chip with nothing to undo, P15 the Undo chip over an open sheet, P16 the Undo chip loses its 48 px hit area (QA's plant: `.undo-chip { min-height: 0; padding: 0; }` appended), P17 the Undo chip's button shrunk in place, P18 a chip with its label left-aligned, P19 a chip without a swatch padded 8 px on the left, **P20 a toggle with one option (On only), P21 both options pressed, P22 the label inside the frame**, P23 + Add stage back in the selected look, **P24 Off never pressed (the Off state shows no set option), P25 the set option still carries the act, P26 the framed pill's set option not filled, P27 New project back in the selected look, P28 + Add unit back in the selected look, P29 + New effect without the plus icon**. Each plant is one exact edit; the script asserts it applies once and restores the file.

## Example
A creator opens the demo's stage. On the base the top bar is a row of five buttons with Test as blue as the rest, and a grey "Nothing to undo" bar fills the bottom. After F1, Test is the only blue button and leads with the play icon, Back, View, Background and Rules are white with icons, and Start new is red. She taps tile 0,0: the sheet lists Floor, Water and Wall block as full-width chips with centred words, Floor ringed. She taps Water, a second tile, then Done: an "Undo" chip with the undo icon floats bottom-left over the map. On the project page each stage, unit and effect card leads with a grey 48 px thumbnail, and + Add stage, + Add unit and + New effect are plain white rows with the plus icon. In View, "Grid lines" sits on the left and an Off | On frame on the right, with the blue pill on On; she taps Off, the pill moves to Off and the grid lines go.

## Decisions note: what to name
- The primary on each screen and sheet (Ruling 2's table, as UX ruled).
- Why the class is `pick`, not `chip` (`.chip` is the status strip; Ruling 4).
- The Undo chip's hit area: a transparent 48 px button around a 40 px pill (Ruling 7, pinned by the shipped test, not by a smoke); its `z-index` under `.scrim`; that it sits on the stage body's bottom edge, not on the grid.
- The two-option framed pill: only the option that isn't set carries the act; the On option's `aria-label` is the label (Ruling 4b).
- That `over` joins the stage's own sheets; the Background sheet (rendered by `home.ts`) covers the chip with its scrim instead.
- That icons go next to text, never replacing words a smoke presses ("Back", "Stages", "+ Add ability"); the four plus rows' "+" becomes the plus icon (Ruling 1), with the s5a and s5b lines edited by name.
- Runtime bounds (BUILD_GUIDE law 13): nothing retained; `icon()` builds a string per render, with no cache.

## Do not touch
- `tools/maker/tokens.css`; app.css L1–L50 and L52–L58 (the base's lines, including the `.cell` rules L42–L46, `.choice`, `.card`, `.chip`, `.toast`); `tools/maker/cells.css` (F3's, doesn't exist yet).
- `src/**`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/art-bake`, `.gitignore`, `data/`, `fixtures/`, the format docs, `docs/maker/style-spec.md`, `docs/maker/shots/`, `painter-proto`, `ui-shell`; plus BUILD_GUIDE §7's never-edit list.
- Any smoke or existing test beyond the lines named above. No new dependency, font or image file. No new words on any button, except "Off" and "On" in the toggles' framed pills (UX ruled 2026-11-27 16:09).

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least **1188** tests passing (green = BUILD_GUIDE §6).
- [ ] `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors: `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` twice (TS7053), L92 on the base and L93 after F1's import line.
- [ ] The shipped test file is byte-identical to its listed sha256; plants-f1.py: 29/29 caught.
- [ ] `rg -n 'class="btn"' tools/maker` finds nothing; `rg -n '[⋯▶]' tools/maker --glob '*.ts'` finds nothing.
- [ ] `git diff <base> -- tools/maker/tokens.css` is empty, and app.css's diff is only the L51 `.undo` removal and the appended L59–L74.
- [ ] Each file within its cap; at most **380** counted lines (trial 377); over 380, stop and report (the Undo chip would move to F4).
- [ ] Rule 8 (Ruling 8): no new statement packed onto a line.
- [ ] All 25 smokes PASS solo at 390 and 360 with only the edits in Smoke lines.
- [ ] Export audit as in the 11c1 guide's Done when: **136 / 150 / 150** files, 0 hits (unchanged; F1 touches no play file).
- [ ] The tap-path shots (a)–(g) at 390×844 and 360 are in the handback (g in both states), beside `f01` and `f04`.
- [ ] Hand-back complete per handoff/HAND-BACK.md at the hand-back location above.

## Not in this step (carries, with their target step)
- **The Budgets icon (QA must-fix 2):** style-spec § 7 lists it and plan L69 says about 16 icons. It is deferred because its `aria-hidden="true"` SVG on the Budgets row broke an existing test: `tests/project/budgets-11c1.test.ts` L124, in "11c1 maker: the Budgets row after the stages in UX's words: one summary line, and on tap the four rows with used of limit, a near or over suffix and an aria-hidden meter", which counts exactly four `aria-hidden="true"` (the four meters). Target: **F2a**, with the ☰ game menu's Budgets row (that step moves the row and re-pins the test by ruling).
- Eyebrow headers (§ 7 marks them F1; plan L69 doesn't): **F2a** (UX ruled 2026-11-27 15:4x).
- The § 7 `.chips` wrap row: chips stay full width in today's sheets until **F4**'s tool sheets (UX ruled 2026-11-27 15:4x).
- The unit page's 72×72 big thumb (§ 7; shot `f08` ships in F4).
- Icons for ☰, the stage switcher, the tool bar, close and chevrons (F2a, F4 as they ship).
- Pictures in thumbnails and chips (F3b); the terrain chip's swatch or picture (F3b; no swatches before the art, L83).
- The 11a2 ready-sheet body: rides with 11c2 after F6 (unchanged).
- (a) The On option's aria-label becomes `{label}: On`, to match Off's `{label}: Off` (UX ruled 2026-11-27 16:45): **F2a**. It needs 7 smoke edits at 2 counted lines each (s6a L54/L60/L62, s6c L57/L62/L63/L69), which would put F1 at 391/380. F2a pins the label pair in the toggles test and adds a plant.
- (b) `+ Add ability` gets the plus icon: **F2b** (UX ruled 2026-11-27 16:45).

## Out of scope
- Any layout move (F2a, F2b, F4), the map's look (F3a, F3b), any art.
- Any project, format or play change.

## Open questions
None. UX ruled all 11 r1 questions on 2026-11-27 15:4x (via CoS): the r1 defaults stand, with the additions folded into Rulings 1, 2, 3, 4, 4b, 6 and 7 and Not in this step. UX's 16:09 rulings (two-option toggles; the other plus rows) are in Rulings 1, 4b and 5.
