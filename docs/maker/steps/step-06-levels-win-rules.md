# Step 6: Levels and win rules (MS-04): the Rules panel per stage, the Level curve editor, the tactics checkpoint

r2, 2026-11-21, Editor & UX Designer. Docs only. r2 applies QA `docs/qa/step-06-guide-review.md` (blob `8daae079`) to r1 (`eaaa951b`), and folds in the owner rulings on r1: CoS (level-set pickers out of step 6), EA (Rulings 1 and 4 below) and DSK D25/D26 (rulings doc pending push; current `handoff/dsk-rulings/2026-11-17-phase1.md` is sha256 `bd423f8f…`). All step 6 rulings are closed. Written against main `ecee084d209e17d2091bbe539c0990f84680ebea` (step 5 closed: 5c merged as PR #89, `5a2c8e79`; rebuild record `docs/rebuild/step-05c.md`; **1082 tests**, `step-05c.md` L18). Roadmap r15 row MS-04 / step 6 (`docs/maker/roadmap.md` L80: "Levels and win rules: xp-levels, win-condition | **Level curve editor** (a thresholds list plus level-set pickers). **Rules panel** per stage"), editors table L192–193, and the internal tactics checkpoint after 6 (L81). The format template is `docs/maker/steps/step-05-units.md` r3b (blob `2e2673e8`). There is no MS-04 spec file; this guide, `docs/maker/data/project-format.md` §6.5 (stage `rules`, L1047; stage over project, L1105–1111) and the engine code below stand in for it.

**This step is three builder runs: 6a, then 6b, then 6c.** Each is 400 counted lines or fewer including tests, gates on.
- **6a: win rules and a playable Empty.** The Rules panel on each stage (win by defeating every enemy), the stage's win rule reaching Test, **On your team** in the unit editor, the Empty template fix for `play: army` (ruled below), and the 5b/5c carries. About 330 counted lines.
- **6b: levels.** The Level curve editor on the project screen (Number of levels, XP to reach each level, XP per move), levels reaching Test, and an XP strip in the play stage. About 315 counted lines.
- **6c: the tactics checkpoint.** A scripted test and a smoke that build a small tactics project from **Empty**, fully in the maker, and play it to a win in Test. About 130 counted lines. The roadmap's level-set pickers are **out of step 6** (CoS; Rulings 2).

## Header

| | 6a | 6b | 6c |
|---|---|---|---|
| Step id | `step-06a-win-rules` | `step-06b-levels` | `step-06c-checkpoint` |
| Revision | r1 for the first run, r2, r3 … for rework rounds | same | same |
| Base commit | main `ecee084d`, or a later main if CoS names one | main at the 6a merge. **TBD** (CoS supplies it) | main at the 6b merge. **TBD** |
| Test floor | **1082 + N** (or the later base's count + N) | 6a's final count + N. **TBD** | 6b's final count + N. **TBD** |
| Needs | step 5 merged (done) | 6a merged | 6b merged |
| Own smoke, port | `handoff/steps/tests/s6a-win-rules/smoke.mjs`, **8805** | `handoff/steps/tests/s6b-levels/smoke.mjs`, **8806** | `handoff/steps/tests/s6c-checkpoint/smoke.mjs`, **8807** |

Ports in use on `ecee084d`: 8734 (`tools/serve.ts` L31), 8797 (S0), 8798 (s3), 8799 (s4a), 8800 (s4b), 8801 (s4c), 8802 (s5a), 8803 (s5b), 8804 (s5c); 8811–8813 were used by step 3 r2 runs. 8805–8807 are free (no hit in `handoff/`, `tools/`, `tests/`).

Repo: https://github.com/G-TileEngine/tileengine (private). N is the number of tests the run adds; state it in the hand-back.

## Go-line order
CoS sends each go-line only when everything before it has merged. Each run names its own base sha and floor; never reuse another run's numbers.
1. **6a** goes on `ecee084d` (or later main).
2. **6b** waits on 6a.
3. **6c** waits on 6b. It is the checkpoint alone; no level-set pickers (CoS, Rulings 2).

## Delivery (each run)
Same as step 5 Delivery (`step-05-units.md` L33–37) with this run's step id: branch `step/<step id>-r<N>-chatA` from the base; commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`; the last commit adds `handback/<step id>/r<N>/HANDBACK.md` with § Screenshots and § Smoke; gate `npm ci && npm run green`; push once through the one-shot helper in `handoff/HAND-BACK.md`; no token in any output; never push main or a tag, no force-push, no PR actions; CoS opens the PR.
- **Hand-back hygiene:** commit no raw test log (put the `ℹ tests / pass / fail …` lines in § Green). Label the **Code head** (the last product commit) separately from the docs-only **tip** (the hand-back commit), as in 5a–5c.
- **Smokes:** (1) this run's own smoke prints `SMOKE PASS` at 390 and 360 CSS px; (2) the S0 touch smoke (`node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`), **frozen and unedited** at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, for any `tools/play-stage/` change (6a and 6b change it); (3) in 6a, the **s3** and **s4a** smokes after their one-line edits (carries below). Paste every ok line in § Smoke.
- **Export audit (required whenever a run touches `tools/play-stage/`: 6a, 6b, and 6c if a play-stage file changes):** a release `tools/play-stage/build.ts` `build()`, and the play-stage tree from `tools/maker/build.ts`, contain no `tools/maker` or `src/editor` code and no bundled catalogue (`catalogue.json.js`, `behaviours.json`). Play and export read only `catalogue/slice.json`. Paste the command and its result (an empty hit list) in the hand-back.
- **Smoke pattern:** copy `handoff/steps/tests/s5c-add-ability/smoke.mjs` (86 lines): `build()` from `tools/maker/build.ts` in dev mode, a static server on 127.0.0.1, `page.waitForFunction` for every wait, never `waitForTimeout` or a fixed sleep; `tap()` / `press()` use `locator.waitFor` only; one `ok` / `FAIL` line per check; widths 390 and 360; screenshots at 390. Own cap 130 lines, outside the 400.
- **Check 8, the 48 px check, measured with sheets open** (same definition as s4c L25–26 and s5c L81): every time the smoke opens a sheet or panel, it collects each visible `button` or `input` smaller than 48 × 48 CSS px; check 8 passes only if that list is empty at that width. In 6a: the Rules panel, the unit editor with On your team, the stage sheet of a placed unit; in 6b: the Levels section and the open Level curve editor scrolled to its last row; in 6c: every sheet the checkpoint flow opens.

## Goal
In an opened project, the user decides **how each stage is won** and, if they want, **how the side levels up**. Both are data the engine already plays: `win-condition` (`src/rules/battle/win.ts`) and `xp-levels` with the levels runtime (`src/rules/behaviours/xp-levels.ts`, `src/rules/levels/levels.ts`). Today the play stage ignores both: `createMatch` installs the win rule with catalogue defaults (`tools/play-stage/match.ts` L21–23) and `docsToInput` never passes `levels` (`tools/play-stage/load.ts` L25). Step 6 makes the project's setups reach Test, gives each a phone editor of a few toggles and sliders, and ends when a project made from **Empty** plays to a win. No code is shown; users see "Rules" and "Levels".

## Read first
1. `docs/maker/roadmap.md` r15: Rules 1, 2 (L11, L27: the greyed Test is the **only** dead-button exception, never copied), 4; row MS-04 step 6 (L80); the tactics checkpoint and its phone baseline (L81); editors table L192–193. Engine laws: `BUILD_GUIDE.md` §2 and §2.2 laws 14–20.
2. `docs/maker/steps/step-05-units.md` r3b: Rules 1–8, 12, 14 (L57–71) still hold; Rulings needed L251–259 (Ruling 7 is closed here).
3. `docs/maker/data/project-format.md`: §3.1 project `rules` (L314: project-wide setups, at most one per behaviour, an optional all-stage `win-condition`), §6.5 stage `rules` (L1047, stage replaces project per behaviour), stage over project (L1105–1111: "With none, catalogue defaults apply"), loadout (L315, L1041: `size` int ≥ 1; spawns take the chosen units in order). `docs/maker/data/setup-format.md` §2 (answers, D16).
4. The catalogue, read only (no edits): `behaviour-library/behaviours.json` rev 30, entries `win-condition` (13 knobs; first `menu_order` question "Does a wipe win, and what if both sides are wiped out together?") and `xp-levels` (20 knobs; `levels` slider 1–9 default 9, `thresholds` int-list default `[17,11,13,11,13,14,11,11,11]` min 1 max 99, `xp_move` slider 0–5 default 1, `ability_unlock_levels` level-set, `unlock_pick_count` slider 1–3). Both have `composable_as: []`: never cards in + Add ability (step 5 Rule 11); they get these editors instead.
5. Code (line numbers on `ecee084d`; re-check on each base):
   - Play adapter `tools/play-stage/project.ts`: `playDocsOf` L29–57, the army lookup and the `play: army` throws L33–34, `knob()` L16–22, `openProject` L58–66. `tools/play-stage/load.ts`: `PlayDocs` L21, `docsToInput` L22–26. `tools/play-stage/match.ts`: win install L21–23, `finish` L36–46, `view()` L134. `tools/play-stage/hud.ts` (37 lines). `tools/play-stage/sides.ts` `sidesOf` (contest needs two sides).
   - Engine: `src/rules/battle/win.ts` (`WIN_CONDITION` L15 reads only `wipe_wins` and `mutual_wipe`; `wipeRule` L17–29). `src/rules/behaviours/xp-levels.ts` (`install` L6–16; `ability_unlock_levels` is read only when it is a string, L15). `src/rules/behaviours/catalogue.ts` (generated, rev 26, L3–4; `XP_LEVELS_KNOBS` L14–34, `thresholds` is a two-option picker there, L18). `src/rules/levels/types.ts` (`LevelRules` L5, `LevelSetup` L9), `levels.ts` `createLevels` L35. `src/sim/types.ts` L33 (`SimInput.levels?`), `src/sim/world.ts` L61, `src/sim/actions.ts` L18 (XP paid when a move lands), L10–13 (`unlock`). `src/rules/behaviours/wired.ts` (`WIRED`, 4 entries).
   - Maker: `src/editor/project/test-gate.ts` (`SAY` L4–13, `playLine` L16), `tools/maker/test-launch.ts` `play` L18–27 (`start` at L25), `tools/maker/unit-diagram.ts` (`played` L13–17, `diagramHtml` L42), `src/editor/unit/add.ts` (`addable` L19, `addCase` L35, `canUpdate` L43, `addAbility` L65, `updateProject` L76), `src/editor/unit/panel.ts` (`setAnswer` L12, `resetAnswer` L13, `panelOf` L22), `tools/maker/widgets.ts` `knobWidget` L8, `src/editor/unit/units.ts` (`usedBy` L13–20, "Used in your team list" L18), `tools/maker/units.ts` (180 lines), `tools/maker/stage.ts` (263 lines; the occupied block L149), `src/editor/stage/place.ts` (`hasPlayer` L20, `infoText` L31–35), `tools/maker/project.ts` `projectScreen` L3.
   - Templates: `data/templates/empty.tileproj/` (catalogueRev **1**, empty slice, `project.rules: []`, a 1 × 1 map, stage seed 24301, loadout `{roster: [], size: 1, required: []}`), `data/templates/demo.tileproj/` (catalogueRev 30; army `setup_01JDAT00000000000000000003.json` = `unit-roster`; slice of 8 incl. `terrain`; no `win-condition` or `xp-levels`).
6. Shots (see **Shots**). 7. `docs/maker/style-spec.md` (the only visual system: tokens, type, spacing, radii, §5 buttons, cards, sheets, chips, framed pill toggle L54, §6 390 px and 360 px rules).

## Rules this step must keep (all three runs)
1. **Step 5 Rules 1–8, 12 and 14 stand** (`step-05-units.md` L58–65, L69, L71): no button before it works (left out, not greyed); the maker only authors data; skeleton copies and `setup_<ULID>` ids; D16 answers; detach, never delete (D11); one parser, no `JSON.parse` / `formatVersion` / `kind ===` in maker code; every change saved, every failure shown; no caches.
2. **Wired means it runs in Test.** `WIRED` gains exactly what the play stage plays: 6a `"win-condition": ["wipe_wins"]`; 6b `"xp-levels": ["levels", "thresholds", "xp_move"]`. Left out, with the reason: `mutual_wipe` (the engine reads it, but no ability in Test hits two sides at once, so "both sides fall together" never happens; `win.ts` L26), the time and tiebreak knobs (no engine code: `install` L11–14 reads only two knobs), `xp_basic` and the kill XP knobs (`LevelRules.xp` has only `move`, `types.ts` L5), `bar` (one strip position is built), `level_rule` (`pvp_kills` is `v1: false`), and every other `xp-levels` knob.
3. **Stage over project (format L1105–1111).** The adapter takes, per behaviour, the stage's `rules` setup, else the `project.rules` setup, else catalogue defaults. One helper, `ruleOf` in `src/project/rule-of.ts`, used by the adapter and the editor for `win-condition` and `xp-levels` (the play stage still imports nothing from `tools/maker` or `src/editor`). The Rules panel writes only **stage** setups; the Level curve editor writes only the **project** setup (a stage `xp-levels` override is read, never written, in step 6).
4. **Rules come from the engine.** The adapter turns answers into engine values by calling the engine's own `WIN_CONDITION.install` and `XP_LEVELS.install` with a slice-backed reader (`get(k)` = `knob(setup, slice, behaviourId, k)`; `unsupported(k, why)` throws `play: <behaviourId> <k> <why>`, Law 12). **The slice (rev 30) is the only spec:** the reader takes values and defaults from the project's slice; the adapter never imports `XP_LEVELS_KNOBS` or any other `catalogue.ts` table. `install`'s own `unsupported()` checks stay the runtime guard. No threshold, level or wipe logic in `tools/play-stage` or the maker, in 6a and 6b alike (EA Ruling 1). **No step 6 run touches `src/rules/behaviours/catalogue.ts`.**
5. **New setups the 5c way.** A first Rules or Levels edit copies `data/templates/setup.rule.json` (new skeleton, data), fills D16 answers, and re-cuts the slice as `sliceOf(bundled, used ids + new id)` (one code path with `addAbility`). P = B only; P < B shows 5c's update offer first; P > B shows the newer-project note and no edit control (D24).
6. **Plain words, phone first.** Every control is one of: toggle, slider, framed pill, a row of sliders. 48 px targets, AA contrast, words as well as colour; no code, ids or knob names on screen.

## The `play: army` carry: ruled (UX)
**Step 6 fixes it, in 6a.** Root cause: the Empty template has no army (`unit-roster`) setup and an empty slice (catalogueRev 1), so `playDocsOf` throws at L33; units made there can't be Tested, have no Health/Attack sliders or roles (5a reads the slice's `unit-roster`), no terrain to paint (4a reads the slice's `terrain`), and since 5c the diagram prints the raw `play: army`. The checkpoint (6c) needs a project made from Empty to play, so it can't wait.
- **Fix in data, not in the adapter.** `data/templates/empty.tileproj/` gains a `unit-roster` setup with its own new `setup_<ULID>` (not the Demo's `setup_01JDAT…03`), `catalogue.rev` 30, listed in `project.rules`. Its answers are the rev 30 defaults per D16, generated from the catalogue, not typed (on `ecee084d` they give Health 9, Attack 1: `unit_hp` / `unit_atk` defaults in `behaviours.json` rev 30; if they ever differ, the catalogue wins). Its slice is the byte-exact output of `sliceOf(bundled rev 30, ["unit-roster", "terrain"])`, generated, never hand-edited; `project.catalogueRev` 30. Later catalogue updates follow D24. No format or version change (DSK D26). All `.json`, not counted. Checked on `ecee084d`: an Empty bag with that setup opens through `openProject` with an empty error.
- **The throw stays** at L33–34 as a fault guard for a broken project (Law 12). Its sentence is already plain (`test-gate.ts` L12). Projects saved from the old Empty (catalogueRev 1) load fine and only Test shows that sentence, no crash; no migration (Rulings 4; named test **`old empty project gets the plain sentence`**).
- **An empty board doesn't start, and Test is not greyed.** Test stays a live button (roadmap Rule 2 forbids copying the greyed Test). If the stage would start with **no unit at all** (no chosen team unit with a start tile, no NPC, no enemy), tapping Test shows the plain line **"Place a unit on this stage to test it."** in the launch sheet and stays in the maker. A stage with units on one side only still plays, as today ("No enemies: free roam.", "No player side: Test never reaches an outcome.", `place.ts` L33–34). This differs from a "both sides" gate on purpose: NPC-only talk stages (4b) and free roam must keep working.
- **The diagram speaks plainly.** `diagramHtml` shows `playLine(reason)` instead of the raw message.

## Carries (where each lands)
| Carry | From | Lands | Fix or named test |
|---|---|---|---|
| Empty throws `play: army`; diagram shows the raw line | 5a–5c, step 5 Ruling 7; `step-05c.md` L180 | **6a** | Above. Named tests **`empty template plays`**, **`empty board asks for a unit`**, **`old empty project gets the plain sentence`**; re-pointed tests below |
| No named test for the P < B "bigger update" path | 5c QA (`step-05c-review.md` L32) | **6a** | **`canUpdate refuses drifted knobs`** in `add-ability.test.ts`: a slice whose `line-shot` `range` max differs from bundled → `canUpdate` false, `addCase` gives "This project needs a bigger update than the maker can do yet." with `update: false`, and `updateProject` is not offered |
| `missing goal goes to Other` doesn't drive `addable()` | 5c QA (L31) | **6a** | **`addable keeps goal-less primaries`**: a bundled copy with `line-shot` `goal` deleted and another wired primary at `goal: "flying"` → both are in `addable(...)` and in `byGoal(...)`'s last bin, Other abilities |
| HB:168 overclaims shots 02/03 (controls below the fold) | 5b QA (`step-05b-review.md` L32) | **every run** | No edit to the merged 5b hand-back. Rule for 6a–6c § Screenshots: a caption names only what is visible in that 390×844 frame; a screen taller than the frame gets a second, scrolled shot (`<nn>b-…-scrolled.png`) |
| `.toast.above` at 360 overlaps the scrimmed stage topbar | 5b QA (L31) | **6a** | **Accepted, no product change** (UX): the topbar is under the scrim and not a target while a sheet is open. Pinned: s6a check 8 at 360 also asserts the toast box covers no 48 px target of the open sheet (Rules panel, unit editor) |
| Occupied sheet keeps "A unit stands here" | 5b QA (L30) | **6a** | Remove the `<p>A unit stands here</p>` from `stage.ts` L149 (the sheet title "<Name> · <side>" already says it, as step 5 L155 intended). The paint refusal at `stage.ts` L219 and `place.ts` L44 keep the sentence. Frozen s4a check 4 (`s4a-stage-paint/smoke.mjs` L28) waits on it: change only its `note:` test to the sheet title containing " · " |
| `catalogue.ts` regen to rev 30 (`gen-catalogue.py`, `CATALOGUE` hash test updated; today rev 26, `thresholds` a two-option picker, L3–4, L18) | EA Ruling 1 | **not step 6** | Its own small run, required before anything validates `xp-levels` through the registry (`installOne`). Owner: EA writes the kit, then a builder runs it. No step 6 run touches `catalogue.ts` |
| D22 effect ids (`src/editor/effect/save.ts`, `effect_<ULID>`) | DSK D22 (L69) | **not step 6** | Due before or in step 10 (engine effect path, roadmap L85). Step 6 touches no effect file |

## Count command (each run)
`git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/<this run's smoke dir>/**'` is **400 or fewer** (insertions plus deletions, G7; `docs/qa/handback-checklist.md` L26, `BUILD_GUIDE.md` L123). Only `.json` goes under `data/templates/**`; no run edits `behaviour-library/**` (no catalogue edits in step 6) or `src/rules/behaviours/catalogue.ts` (generated, EA's). **Per-file caps are guidance:** a file may pass its cap if the run stays within 400; the hand-back names every file over its cap and why. **Named overruns allowed up front:** `tools/maker/home.ts` (the click router) may pass its cap by up to 10 lines in each run, and in 6a `tools/maker/stage.ts` may pass its cap by up to 5; name them anyway. No file may pass ~500 lines (`stage.ts` is 263 today).

---

## 6a: win rules and a playable Empty

### 6a Behaviour
- **Rules on the stage.** The stage editor's top bar gains a ghost **Rules** button (after View; the bar already wraps). It opens a sheet titled "Rules · <stage name>" with one section, "How is this stage won?":
  - **Win by defeating every enemy** (toggle; the slice label for `wipe_wins` may be shown as the sub-line). Default On.
  - A source line: "Default rule" (no setup), "Same as project" (a `project.rules` win-condition, read only here) or "This stage's rule".
  - **Reset to default** (writes `{source: "default"}`, D16).
  - When Off, the line: "With this off, nobody wins: Test plays until you leave."
  - Lose is not a control: the engine's wipe rule also loses when all your units fall (`win.ts` L27); the sheet says "You lose when all your units fall." only while the toggle is On.
  - The first change copies `setup.rule.json`, adds the id to `stage.rules` (Rule 5). Every change saves; one Undo step each.
- **Test plays the stage's rule.** With wipe On, Test ends in Victory or Defeat as today; with it Off, no outcome is ever set after the last enemy falls.
- **On your team** (unit editor, under Attack): a toggle. **A new unit starts Off** (not on your team): + Add unit writes no loadout (`newUnit`, `src/editor/unit/units.ts` L6), so enemies and NPCs made in the Units section never take your start tiles by accident; the user turns it On. On appends the unit id to the end of `project.loadout.roster` (no duplicates; roster order is spawn order); Off removes it; `size` = max(1, roster length). `setTeam` writes the whole `project.loadout` object each time, never a `stage.loadout` override, never `required`, and keeps any existing `required` (DSK D25). An empty roster with size 1 is today's Empty state, covered by the §6.6 size > roster warning fallback; no new report row. A sub-line: "Starts on your team's start tiles, in this order." This also unblocks 5a's refusal "Used in your team list. Remove it there first.", which had no control to act on.
- **Empty is playable** (ruling above). **Empty board:** "Place a unit on this stage to test it." **Occupied sheet:** no "A unit stands here" line.

### 6a Build
| File | Job | Cap |
|---|---|---|
| `data/templates/empty.tileproj/**` | army setup, `project.rules`, slice at rev 30, `catalogueRev` 30 (data) | data |
| `data/templates/setup.rule.json` | new skeleton (`name` "Rule"), data | data |
| `src/project/rule-of.ts` | new, pure: `ruleOf(project, stageId, behaviourId)` → `{source: "stage" \| "project" \| "default", setupId}` (Rule 3). | 12 |
| `src/editor/rules/rules.ts` | new, pure: `setStageRule(files, skel, stageId, setupId, behaviourId, knob, value, bundled)` (creates via Rule 5, else `setAnswer`); `resetStageRule`; the source line from `ruleOf`. | 55 |
| `src/editor/unit/team.ts` | new, pure: `onTeam(files, unitId)`, `setTeam(files, unitId, on)` (roster and `size`). | 20 |
| `tools/maker/rules-panel.ts` | new: the Rules sheet through `panelOf(slice, WIRED, "win-condition", answers)` and `knobWidget`; offer / newer note from 5c. | 60 |
| `tools/maker/stage.ts` edit | Rules button and sheet mount; drop the L149 line. | 12 |
| `tools/maker/units.ts` edit | On your team toggle. | 12 |
| `tools/maker/home.ts` edit | Route `r:` and team acts. | 10 |
| `src/rules/behaviours/wired.ts` edit | `"win-condition": ["wipe_wins"]`. | 1 |
| `tools/play-stage/project.ts` edit | `win` from `WIN_CONDITION.install` (Rule 4) on the `ruleOf` setup, in `PlayOut`. | 8 |
| `tools/play-stage/load.ts` edit | `PlayDocs.win?: WinRule`. | 2 |
| `tools/play-stage/match.ts` edit | `body.win ?? installOne(WIN_CONDITION, {}).out` at L21. | 3 |
| `src/editor/project/test-gate.ts` + `tools/maker/test-launch.ts` edit | `emptyBoard(docs)`; in `play` (L18–27) the "Place a unit…" line returns before `start` at L25. | 10 |
| `tools/maker/unit-diagram.ts` edit | `playLine(reason)` in `diagramHtml`. | 2 |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` edit | L122 only: `"no unit roster yet"` → `"Place a unit on this stage to test it"`. | 1 |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` edit | L28 `note:` only (carry). | 1 |
| `tests/editor/rules.test.ts` | new (see Done when). | 60 |
| `tests/editor/units.test.ts` edit | `on your team writes the loadout`. | 15 |
| `tests/tools/play-stage-source.test.ts` edit | The test titled "…Empty cannot open" (L31): retitle; its Empty asserts L34–35 → Empty opens (`docs` non-null, `error` ""); L36–39 (bundled and staged demo checks) stay; L41–48 → still not started, `lines[0]` "Place a unit on this stage to test it." | 8 |
| `tests/editor/add-ability.test.ts` edit | L94–99 re-pointed to Empty minus its army (plain sentence in the HTML, `diagramCells` still throws `play: army`); the two 5c carry tests. | 35 |
| `tests/editor/maker-law.test.ts` edit | Scan `src/editor/rules/**`. | 2 |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | new smoke, own cap. | 130 (own) |

Caps sum to **329**. Frozen-smoke edits are deliberate: § Decisions names them, pastes `git diff <base> -- <file>` (exactly one changed line each) and the sha256 before (s3 `7c375c00…`, s4a `040e6011…`) and after. The after values are the references for 6b, 6c and post-merge.

**6a smoke (port 8805).** `node handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805`. Checks: 1. New (Demo), open its stage, Rules: "Default rule", the toggle On. 2. Turn it Off: the "nobody wins" line; Back, reopen: Off, "This stage's rule". 3. Test: the dev global `__docs.win.wipe` is `false` (`tools/play-stage/page.ts` L75). Back. 4. Rules → Reset to default; Test: `__docs.win.wipe` is `true`. (The outcome itself is proven by the named test `win rule reaches Test`.) 5. New (Empty): the Units section's + Add unit "Hero" shows Health 9, role chips and On your team **Off** (a new unit starts Off); turn it On: `project.json` roster ends with Hero, `size` 1 (dev read). 6. Test on the empty stage: "Place a unit on this stage to test it.", no board. 7. Tap the Demo Archer: the sheet has no "A unit stands here". 8. Check 8 with the Rules panel, the unit editor and the unit sheet open, plus the toast-over-sheet assertion at 360.

### 6a Must NOT
- **No other theme or visual system.** Only the tokens, type, spacing, radii and components in `docs/maker/style-spec.md`: no template theme, no CSS framework, no web or icon fonts, no new colours.
- **No new framework, starter template, app scaffold, borrowed theme or other visual system.** Build only inside the existing stack, files and gates, from current main.
- No greyed or disabled Test; no "coming soon" control; no time limit, tiebreak or mutual-wipe control (Rule 2).
- No wipe or win logic outside `src/rules/battle/win.ts`; no default army in the adapter (the fix is data).
- No catalogue edit; no `catalogue.ts` edit; no `behaviour-library/**` change. No empty `catch`, no silent default (Law 12).
- No frozen kit edit beyond the two named lines; S0 `d528795e` unedited. Offline, no new dependencies. 48 px targets, AA contrast in light and dark.

### 6a Done when
- **Gates:** `npm ci && npm run green` exits 0 at **1082 + N** or more (offline, no new dependencies). Count command with `s6a-win-rules`.
- **Named tests (`rules.test.ts`):** `stage rule overrides project rule` (stage setup wins; project setup used when the stage has none; defaults when neither); `first rule edit re-cuts the slice` (`catalogue/slice.json` = `sliceOf(bundled, used + "win-condition")`, D16 answers, empty load report); `win rule reaches Test` (`playDocsOf(...).win.wipe` false after Off; a `createMatch` with the last enemy at 0 HP after End turn has `outcome` null when Off and `"win"` by default); `win rule needs P = B` (older: the 5c offer, nothing written; newer: no control); `wired win knob changes the adapter`.
- **Named tests (elsewhere):** `empty template plays`; `empty board asks for a unit`; `old empty project gets the plain sentence`; `on your team writes the loadout` (a new unit is not on the roster; On appends once, no duplicate; `size` = max(1, roster length); `required` kept; no `stage.loadout` written; Off removes; `usedBy` then allows delete); `canUpdate refuses drifted knobs`; `addable keeps goal-less primaries`.
- **Smokes:** s6a, S0, s3 and s4a pass at 390 and 360 (S0 and s3 at their own widths).
- **Openable app page:** `node tools/maker/build.ts <out>` gives `<out>/maker/index.html` and `<out>/play-stage/`; served on 127.0.0.1 and opened at **390 px**, the Rules panel, On your team and the Empty flow work as above and match the shots (Shots).
- **Screenshots:** one 390×844 light-theme screenshot per screen: Rules panel (On), Rules panel (Off, with the line), unit editor with On your team, the empty-board line, the occupied unit sheet. Captions name only what is in the frame.
- **Not the builder's gate:** the phone check (S21 Ultra, Red Magic 9 Pro) is a CoS/CEO pass.

---

## 6b: levels

### 6b Behaviour
- **Levels section** on the project screen, under Units: one card. Off: "Levels: Off" and **Turn on levels**. On: "Levels: <n> · <total> XP to the top" (the sum of the shown thresholds); tap: the **Level curve editor**.
- **Turn on levels** adds an `xp-levels` setup to `project.rules` (Rule 5; P < B offer, P > B note).
- **Level curve editor** (full sheet; top bar Back, "Levels"):
  - **Number of levels:** slider, min/max/label from the slice (`levels`, 1–9).
  - **XP to reach each level:** the thresholds list, one row per level 1 … n, each "Level <k>" with a slider (min 1, max 99 from the slice) and the value in words ("17 XP"). The list length always equals n (EA Ruling 1): lowering n drops the last rows; raising n adds rows filled from the slice's default list at that index. Each value stays within the slice's min 1 / max 99 (the engine also needs `levels` ≤ list length, `xp-levels.ts` L10). **Reset curve** puts the list back to `{source: "default"}`.
  - **XP per move:** slider (`xp_move`, 0–5).
  - **▶ Test** (step 3's Test on the first stage) and **Turn off levels** (detach from `project.rules`, D11; the file stays). One Undo step per change; every change saves.
- **Levels in Test.** The adapter passes `levels: { rules, pools: {} }` (Rule 4; `rules.bar` is `"side"` from `install`) through `docsToInput` into `SimInput.levels`, so the engine pays XP when a move lands (`actions.ts` L18) and levels the side up at each threshold. The play stage shows an **XP strip** under the board for your side: "Level <k> · <xp>/<need> XP", or "Level <n> · Top level"; text, AA, not a target, `aria-live="polite"`. No strip when the project has no levels. Nothing is offered on level-up in step 6 (no pools; Rulings 2).

### 6b Build
| File | Job | Cap |
|---|---|---|
| `src/editor/rules/levels.ts` | new, pure: `levelsOf(files)` (setup or null), `turnOn(files, skel, setupId, bundled)`, `turnOff(files)`, `setLevels`, `setThreshold(i, v)` (writes the whole list, clamped to slice min/max; the default list again → `{source:"default"}`), `setLevels` keeps list length = n, `resetCurve`, `setXpMove`, `curveTotal`. | 70 |
| `tools/maker/levels.ts` | new: Levels section card and the editor. | 90 |
| `tools/maker/project.ts` edit | Mount the Levels section. | 4 |
| `tools/maker/home.ts` edit | Route `l:` acts. | 8 |
| `src/rules/behaviours/wired.ts` edit | `"xp-levels": ["levels", "thresholds", "xp_move"]`. | 1 |
| `tools/play-stage/project.ts` edit | `levels` from `XP_LEVELS.install` via `ruleOf` (Rule 4). | 8 |
| `tools/play-stage/load.ts` edit | `PlayDocs.levels?: LevelSetup`; pass it in `docsToInput`. | 3 |
| `tools/play-stage/match.ts` + `hud.ts` edit | `view().xp` from `play.world.levels?.state()` for your side; the strip. | 16 |
| `tests/editor/levels.test.ts` | new (see Done when). | 65 |
| `tests/tools/play-levels.test.ts` | new: adapter and match (see Done when). | 45 |
| `tests/editor/maker-law.test.ts` edit | Plant: no threshold or level literal from the catalogue in `src/editor/rules/levels.ts` or `tools/maker/levels.ts`. | 4 |
| `handoff/steps/tests/s6b-levels/smoke.mjs` | new smoke, own cap. | 130 (own) |

Caps sum to **314**.

**6b smoke (port 8806).** Checks: 1. New (Demo), project screen: "Levels: Off", Turn on levels: "Levels: 9 · 112 XP to the top". 2. Open the editor: 9 threshold rows; Number of levels to 3: 3 rows; Back, reopen: 3. 3. Set the Level 1 row to 2 XP and XP per move to 1; ▶ Test: the strip reads "Level 0 · 0/2 XP". 4. Land two Knight moves with taps as the S0 smoke does (End turn between them if the move budget needs it): "Level 1 · 0/11 XP". 5. Back; Reset curve: rows read 17, 11, 13. 6. Turn off levels; Test: no strip. 7. Reload: the editor shows the last saved state. 8. Check 8 with the Levels section and the editor open, scrolled to its last row.

### 6b Must NOT
- Everything in 6a Must NOT, plus: no XP, level or threshold rule in `tools/play-stage` or the maker beyond calling `XP_LEVELS.install` and reading `levels.state()`; no `catalogue.ts` edit or regeneration (carry below; EA's kit).
- No `bar`, kill-XP, PvP or card-hand controls; no level-up offer, pool or unlock UI (out of step 6, Rulings 2).
- No cache of XP or level state outside the engine (Rule 1 / law 15). No edit to the S0 kit.
- No `tools/maker` or `src/editor` import into `tools/play-stage`.

### 6b Done when
- **Gates:** green at 6a's final count + N. Count command with `s6b-levels`.
- **Named tests (`levels.test.ts`):** `turn on levels re-cuts the slice` (D16, empty report, `project.rules` has it); `threshold edit stores the whole list` (a changed row writes all entries; setting it back writes `{source:"default"}`); `list length follows levels` (3 → 3 entries; back to 5 → rows 4–5 from the slice defaults; values stay within 1–99); `turn off detaches and keeps the file`; `wired level knobs change the adapter`.
- **Named tests (`play-levels.test.ts`):** `levels reach Test` (`playDocsOf(...).levels.rules.thresholds` = the first n entries; no setup → no `levels`); `a move pays XP in Test` (`createMatch` with thresholds `[2, …]` and `xp_move` 1: two landed moves → level 1); `custom curve plays in Test` (thresholds `[5, 5, 5]`, `levels` 3, `xp_move` 1: five landed moves → level 1, ten → level 2; read through the slice only); `no levels, no strip` (the bundled demo's `view().xp` is null, and S0 stays green).
- **Smokes:** s6b and S0 `SMOKE PASS` / `TOUCH SMOKE PASS` at 390 and 360.
- **Openable app page, Look matches the shots, Screenshots** (Levels section Off and On, the editor top, the editor scrolled, the XP strip in Test before and after a level-up), **not the builder's gate**: as in 6a.

---

## 6c: the tactics checkpoint

### 6c Behaviour
- **The checkpoint (roadmap L81):** a small tactics project made **fully in the maker** from **Empty** (units with abilities, terrain, and a win rule) plays in Test to a win. No hand-edited JSON, no Demo file.
- **No level-set pickers.** MS-04's "level-set pickers" (roadmap L80) are deferred until EA and the Librarian rule on unlocks (CoS ruling, citing the CEO's 13 Nov "no forced features"): no battle rule reads `bar.abilities` after an `unlock`, `install` reads `ability_unlock_levels` only as a string (`xp-levels.ts` L15; the slice stores an array), and no project data names a pool.
- No new screen otherwise: 6c fills any gap the checkpoint finds only with a fix inside an existing screen, named in § Decisions.

### 6c Build
| File | Job | Cap |
|---|---|---|
| `tests/editor/checkpoint.test.ts` | new: the scripted checkpoint (Done when). | 90 |
| Gap fixes found by the checkpoint | each named in § Decisions with its file. | 40 |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | new smoke, own cap; it also writes the finished project to `handback/<step id>/r<N>/checkpoint.tileproj/` for the phone baseline. | 130 (own) |

Caps sum to **130**.

**6c smoke (port 8807).** At 390: 1. New (Empty) "Skirmish". 2. Open its stage, resize the map to 6 × 6 (4b). 3. Paint a Wall block row with a gap (a closed Terrain type from the slice, now in Empty's slice). 4. + Add unit "Hero": Health 20, Attack 5, On your team; + Add ability: line shot. 5. + Add unit "Raider": Health 2. 6. Stage: Your team start at 0,0; Enemy "Raider" at 5,5. 7. Rules: Win by defeating every enemy is On. 8. Test: drive the Hero through dev globals (`__play`) with `waitForFunction` on each phase until the veil reads "Victory" (cap: 30 of your turns). 9. Check 8 on every sheet opened above, at 390 and 360. Screenshots at 390 of steps 2–8.

### 6c Must NOT
- Everything in 6a and 6b Must NOT, plus: no level-set picker, level-up offer or mock offer; no Demo template, fixture or hand-written project file in the checkpoint; no direct writes to project files in the scripted test (only exported editor functions and the save path).
- No reach, sight or path cache (the baseline decides that).

### 6c Done when
- **Gates:** green at 6b's final count + N. Count command with `s6c-checkpoint`.
- **Named test `tactics checkpoint: Empty to a win`** (`checkpoint.test.ts`): starting from `data/templates/empty.tileproj` and `stampNew`, using only exported editor functions (`resizeMap`, `paintCells`, `newUnit`, `setStat`, `setTeam`, `addAbility`, `addSpawn`, `addEnemy`, `setStageRule`, `turnOn` / `setThreshold`), save through `planSave` into `memoryStore`, then `launchTest`: `start` is called; `createMatch(docs, 0)`, driven with the intent helpers of `tests/tools/play-stage-p18.test.ts`, reaches `outcome === "win"` within 30 of your turns, and the XP strip's level is ≥ 1 on the way.
- **Named test `checkpoint win comes from the rule`:** the same project with the stage rule Off: after the Raider falls and End turn, `outcome` stays null.
- **Named test `checkpoint project loads clean`:** `readProject` on the saved files gives an empty report; the slice equals `sliceOf(bundled, used ids)`; every setup has D16 answers.
- **Smokes:** s6c `SMOKE PASS` at 390 and 360; S0 only if a play-stage file changed.
- **Openable app page, Look matches the shots, Screenshots** (each checkpoint screen, ending on Victory), **not the builder's gate**: as in 6a.
- **Phone baseline, not the builder's gate (roadmap L81):** CoS/CEO open `checkpoint.tileproj` on the S21 Ultra and Red Magic 9 Pro and record frame time, allocations and GC. Reach and sight caches come only if that shows a tick repeating work.

---

## Shots (look reference)
On main, in `docs/maker/shots/`: `24-project-settings.png` (section cards and the slider card: the Levels section and the editor's rows, 6b), `s5-assigned-abilities-test-remove.png` (row list layout: the threshold rows), `68-unit-tap-edit-basic-light.png` and `s4-hold-unit-menu.png` (the unit sheet, 6a), `68-test-battle-menu.png` (play-stage HUD: the XP strip sits under the board in that HUD's type and colours, 6b), `39b-hard-blocked.png` (the line style for "Place a unit on this stage to test it."), `18-undo-toast.png`. **No reference exists** for the Rules sheet, the Level curve editor or the XP strip: follow `style-spec.md` §5 (sheet L48, toggle as framed pill L54, slider card as in `24-project-settings.png`) and §6. After QA OK, CoS may add the builders' 390 shots as `s6a-rules-panel.png`, `s6b-level-curve.png` and `s6b-xp-strip.png` (these files don't exist yet).

## Rulings (all closed for step 6)
None is open; none blocks 6a.
1. **EA Ruling 1 — CLOSED, yes with changes.** The adapter calls `WIN_CONDITION.install` and `XP_LEVELS.install` directly (not `installOne`), because the generated engine table is rev 26 (`catalogue.ts` L3–4) and holds `thresholds` as a two-option picker (L18). The slice (rev 30) is the only spec: values and defaults come from the slice; the adapter never imports `XP_LEVELS_KNOBS` or other `catalogue.ts` tables; widgets keep thresholds within slice min 1 / max 99 with list length = levels; `install`'s `unsupported()` checks stay the runtime guard (Rule 4). No level or wipe logic in `tools/play-stage` or the maker, in 6a and 6b alike. Pinned by `custom curve plays in Test` (6b). The `catalogue.ts` regen is a carry (above), not step 6.
2. **Level-set pickers — CLOSED by CoS: out of step 6.** MS-04's "level-set pickers" are deferred until EA and the Librarian rule on unlocks (what fills a side's pool, what an unlocked ability does in Test). CEO 13 Nov, as cited by CoS: no forced features.
3. **DSK D25 — CLOSED, yes.** On your team: `size` = max(1, roster length); `setTeam` writes the whole `project.loadout` only (never a `stage.loadout` override, which replaces whole, §6.6); On appends to the end, no duplicates (roster order = spawn order); Off removes; never writes `required`, keeps any existing one. Empty roster with size 1 stays covered by the §6.6 size > roster warning fallback; no new row.
4. **EA + DSK D26 — CLOSED, yes, no migration.** Old Empty saves (catalogueRev 1) load fine; only Test shows the plain sentence from the L33 throw plus `playLine`, no crash; pinned by `old empty project gets the plain sentence` (6a). The new Empty template: generated byte-exact slice, own `setup_<ULID>`, rev 30 defaults read from the catalogue, `catalogueRev` 30; updates follow D24; no format or version change, no CN. DSK may add a lint row for catalogueRev-1 projects later; not a blocker.

Step 5 Rulings 1–6 (`step-05-units.md` L253–258) stay open as written there; Ruling 7 is closed by this guide.

## Not in this step
Time limits, turn timers, timeout, draw and tiebreak rules, and `mutual_wipe` (no engine code, or never reached in Test); a project-wide win rule editor (read only here); stage `xp-levels` overrides (read, never written); kill or ability XP, PvP levelling, XP bar position, card-hand levels, unit-pair unlocks; level-set pickers and level-up offers (deferred, Rulings 2); the `catalogue.ts` regen (its own run); old Empty project migration; the phone baseline itself (CoS/CEO); D22 effect ids (before or in step 10); budgets and a phone-like Test (step 11).

## Prototype lessons
- shell-lessons #1 rule 2: only wired options. The catalogue offers 13 win knobs and 20 level knobs; Test plays 1 and 3. Show those, say why the rest wait.
- The greyed Test was the one dead-button exception (roadmap L27). An empty board gets a plain line on tap, not a grey button.
- Keep the split: pure model in `src/editor/rules/`, UI in `tools/maker/`, rules in the engine.
