# Step 5: Units and abilities (MS-04): the unit editor, the ability panel, + Add ability

r2, 2026-11-20, Editor & UX Designer. Docs only. r2 applies QA `docs/qa/step-05-guide-r1-review.md` (blob `ea310135`) to r1 (`d6603ab8`). Written against main `a6538ee18dfdf198a96c79634314d6683c7172b2` (step 4 closed: 4c merged as PR #86, `9bbd115a`; 1065 tests). Roadmap r15 row MS-04 / step 5 (`docs/maker/roadmap.md` L79) and its Risks row L184 (Behaviour-panel headroom). The format template is `docs/maker/steps/step-04-stage-editor.md` r6. There is no MS-04 spec file yet; this guide, `docs/maker/shell-lessons.md` CEO feedback #2 (L30–53) and the two rulings below stand in for it:
- **EA headroom ruling** `/workspace/share/step5-headroom/ea-ruling.md` (2026-11-20, against `a6538ee1`, 38 lines, sha256 `fa64927ddfe1fd0ca2bb9ccba5ec3238690150056573132f13bd8a2ac602b106`): **YES**, the panel holds the ~50 BTF combat behaviours with no redesign, given guards H1–H5 (Rules 9–13). Box-only; CoS pushes it with this guide.
- **DSK rulings** `handoff/dsk-rulings/2026-11-17-phase1.md` at sha256 `bd423f8fcf2c68a3b7d0e913f069b63ec50e23fbfae5537dd859b46bb79f1649` (72 lines, on main from `8816be0`; `a6538ee1` has `aacb7e01…`, 68 lines, without D22–D24): **D23** (goal field, L71) and **D24** (addable list, L72). D22 (effect ids) is step 10, not here.

**This step is three builder runs: 5a, then 5b, then 5c.** Each is 400 counted lines or fewer including tests, gates on.
- **5a: units.** A Units list on the project screen; add, rename and delete a unit; Health and Attack with Start from a role and Reset; the seven knob widgets (H5). Also the 4c carries (plain resize wording, Empty-template seed). About 360 counted lines.
- **5b: abilities on a unit.** The unit sheet on the stage (Edit, Move, Delete, Test), the ✦N badge, the unit's ability list (Test and × per row), the ability panel (H1 sections, H3 rows, H5 wired-only), and Test that runs the engine on that unit. About 380 counted lines.
- **5c: + Add ability.** Browse by goal (D23) from the engine-bundled catalogue (D24), tile diagrams from data, the three catalogue-rev cases. About 320 counted lines.

## Header

| | 5a | 5b | 5c |
|---|---|---|---|
| Step id | `step-05a-units` | `step-05b-abilities` | `step-05c-add-ability` |
| Revision | r1 for the first run, r2, r3 … for rework rounds | same | same |
| Base commit | main `a6538ee1`, or a later main if CoS names one | main at the 5a merge. **TBD** (CoS supplies it) | main at the 5b merge, after the 5c data is on main (Needs). **TBD** |
| Test floor | **1065 + N** (or the later base's count + N) | 5a's final count + N. **TBD** | 5b's final count + N. **TBD** |
| Needs | step 4 merged (done) | 5a merged | 5b merged; **catalogue rev 30** with `goal` filled in (Librarian, D23) at `behaviour-library/behaviours.json` **on main** (CoS pushes it; today it is box-only, rev 29, 0 of 65 behaviours have `goal`); and the demo template and fixture re-cut to rev 30 (the D18 path, a data step like 03b), or every Demo project shows the update offer first (Rules 13) |
| Own smoke, port | `handoff/steps/tests/s5a-units/smoke.mjs`, **8802** | `handoff/steps/tests/s5b-abilities/smoke.mjs`, **8803** | `handoff/steps/tests/s5c-add-ability/smoke.mjs`, **8804** |

Ports in use on `a6538ee1`: 8734 (`tools/serve.ts` L31), 8797 (S0), 8798 (s3), 8799 (s4a), 8800 (s4b; also step 2's example server), 8801 (s4c); 8811–8813 were used by step 3 r2 runs (`handback/step-03-test/r2/HANDBACK.md` L57). 8802–8804 are free.

Repo: https://github.com/G-TileEngine/tileengine. N is the number of tests the run adds; state it in the hand-back.

## Go-line order
CoS sends each go-line only when everything before it has merged. Each run names its own base sha and floor; never reuse another run's numbers.
1. **5a** goes on `a6538ee1` (or later main).
2. **5b** waits on 5a.
3. **5c** waits on 5b **and** on catalogue rev 30 on main (Needs). Without goals, 5c still builds and stays green: every primary lands in the **Other abilities** card (Rules 10). Without `behaviours.json` on main, 5c can't start.

## Delivery (each run)
Same as step 4 Delivery (`docs/maker/steps/step-04-stage-editor.md` L29–40), with this run's step id. In short: branch `step/<step id>-r<N>-chatA` from the base; commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`; the last commit adds `handback/<step id>/r<N>/HANDBACK.md` with § Screenshots and § Smoke; gate `npm ci && npm run green`; push once through the one-shot helper in `handoff/HAND-BACK.md`; no token in any output; never push main or a tag, no force-push, no PR actions; CoS opens the PR.
- **Smokes:** (1) this run's own smoke prints `SMOKE PASS` at 390 and 360 CSS px; (2) the S0 touch smoke (`node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`, frozen at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`) for any `tools/play-stage/` change (5b changes it); (3) in 5a, the **s4c smoke** after its two-line edit (4c carry b): `node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801`. Paste every ok line in § Smoke.
- **Smoke pattern:** copy `handoff/steps/tests/s4c-stages-maps/smoke.mjs` (73 lines): `build()` from `tools/maker/build.ts` in dev mode, a static server on 127.0.0.1, `page.waitForFunction` for every wait (L17–18, L26), never a fixed sleep; one `ok` / `FAIL` line per check; widths 390 and 360; screenshots at 390 (L24). Own cap 130 lines, outside the 400.
- **Check 8, the 48 px check, measured with sheets open** (same definition as s4c L25–26 and L68): every time the smoke opens a sheet or panel, it collects each visible `button` or `input` smaller than 48 × 48 CSS px; check 8 passes only if that list is empty at that width. In 5a: the unit editor and the role sheet; in 5b: the unit sheet, the ability list and an open ability panel; in 5c: + Add ability, a goal's card list, the update offer.

## Goal
In an opened project the user makes and edits **units**: a name, Health and Attack (or a role), and **abilities**. On the stage, tapping a placed unit gives its sheet (Edit, Move, Delete, Test). Edit shows the unit's abilities, each with **Test** and **×**, and below them **+ Add ability** and **▶ Test**. + Add ability browses by goal, with a tile diagram on each card. Every row is wired: it changes what the play stage does, and every Test runs the real play stage on that unit. The maker only writes data; the engine runs the rules. Users see "abilities"; data keeps "behaviour" (shell-lessons #2 L32).

## Read first
1. `docs/maker/roadmap.md` r15: Rules 1, 2, 4; row MS-04 step 5 (L79); the tactics checkpoint after 6 (L81, baseline measurement); Risks L184. Engine laws: `BUILD_GUIDE.md` §2 and §2.2 laws 14–20 (L44–50).
2. `docs/maker/shell-lessons.md` r8 (on main sha256 `fe01d7cb…`, blob `0b467bbf`): Standing lessons; #1 rule 2 (only wired options); **#2 abilities, L30–53** (the flow, rules 1–7).
3. The EA headroom ruling and DSK D23/D24 (above), and DSK D10, D11, D12, D16 (`handoff/dsk-rulings/2026-11-17-phase1.md` L55–61).
4. `docs/maker/data/project-format.md`: §3.1 (`catalogueRev`), §4 (the slice holds only used behaviours), §6.3 (unit, L872: `name`, `sprite`, `setupIds`, `stats` partial: a missing key inherits the army value), §6.5 (placements, `loadout`, `seed?` L1071).
5. `docs/maker/data/setup-format.md` §1 (Terms: `question`, `menu_order`; D23 adds `goal`), §2 (answers: `source`, `value`; a default answer stores no value), §8.2 (drift).
6. Code (line numbers on `a6538ee1`; re-check on each base):
   - The play adapter: `tools/play-stage/project.ts` `playDocsOf` L29–57. It reads per-unit `stats.unit_hp` / `unit_atk` (L38), the army `unit-roster` setup (L33–34), and from each unit's `setupIds` only `basic-attack` (`reach_mode`, `custom_ns`, `custom_ew`, L42) and `line-shot` (`range`, `damage`, L43). Nothing else in a unit's setups reaches the match today.
   - The engine reach: `src/rules/battle/range.ts` `inOrthogonalReach` L4–7, `reachOf` L8; `src/rules/battle/targets.ts` L6–12; `src/rules/battle/line-shot.ts` L3–15.
   - Readers: `src/project/read/unit.ts` `readUnit` L11–26; `src/project/read/setups.ts` `readSetup`; `src/project/read/placements.ts` `resolvePlacements` L17–45.
   - Step 4 maker code: `tools/maker/stage.ts` (255 lines; `docAt` L31, the unit rows L147), `tools/maker/stage-sheets.ts` (`unitButtons` L7, `unitPicker` L4), `tools/maker/rooms.ts` (`say` L41–45), `src/editor/stage/rooms.ts` (`takenSeed` L19–27, `addStage` L28–36), `src/editor/stage/talk.ts` (the skeleton-fill pattern), `tools/maker/project.ts` `projectScreen` L3, `tools/maker/test-launch.ts` (`LaunchBag` L12, `play` L17–26), `tools/maker/build.ts` (36 lines), `tests/editor/stage-place.test.ts` L50–53 (the kind scan and its pin).
   - Catalogue: `tools/project/slice-of.ts` `sliceOf` L14–19 (`DROP` L1), `src/rules/behaviours/catalogue.ts` (`CATALOGUE` rev 26 meta only; no addable list on main), `src/project/load/read-project.ts` L50 and L53 (`catalogueRevMismatch`).
   - Templates: `data/templates/demo.tileproj/` (catalogueRev 29, slice of 8 behaviours, byte-equal to the fixture slice), `data/templates/empty.tileproj/` (catalogueRev 1, empty slice, one stage with **no** `seed`, no setups), `data/templates/setup.talk.json` (D10).
7. Shots (see **Shots**). 8. `docs/maker/style-spec.md` (the only visual system: tokens, type, spacing, radii, buttons, cards, sheets, chips, pills, §6 390 px and 360 px rules).

## Rules this step must keep (all three runs)
1. **No button before it works (roadmap rule 2; shell-lessons #1 rule 2, #2 rule 2).** Every row, card, knob and button is wired to data the play stage really plays. Anything not wired is **left out, not greyed**. The one CEO exception is inside the ability panel: a value a ban forbids is shown greyed with its reason (#2 rule 1, "bans greyed").
2. **The maker only authors data (roadmap rule 1).** The editor writes unit docs, setup docs, `setupIds`, `stats` and `catalogue/slice.json`. It never decides reach, damage or targets. Diagrams come from the engine's own functions (5c), never from a second copy of the rules.
3. **File names and new documents (step 4 Rules 3–4; D10).** New docs are copied from whole-document `.json` skeletons under `data/templates/` and filled in (ids, names, `catalogue.rev`, answers). No `kind` or `formatVersion` literal in code. Ids are `unit_<ULID>` / `setup_<ULID>`, never reused. Rename changes `name` only.
4. **Setups store only what differs (roadmap rule 4; D16).** A new ability setup writes `{source: "default"}` with no `value` for every slice knob with a default; a `no_default_reason` knob stays absent. A knob set back to its default goes back to `{source: "default"}`. **Reset to default** does the same. Unit stats: a value equal to the army value is still stored only if the user set it; **Reset** removes the key (inherit, §6.3).
5. **Remove is detach, never delete (D11).** × on an ability removes its id from `unit.setupIds`; the setup file stays on disk. Delete unit is refused while any stage uses it (names the stages), like 4c's `refsTo`; an unused unit's file stays on disk too. Each is one Undo step (session-only, D12).
6. **Import direction and the one parser (step 3, step 4 Rules 6).** The maker imports the play stage, never the reverse. No `JSON.parse`, `formatVersion` or `kind ===` in `tools/maker` (except the one `JSON.parse` in `project-files.ts`) or `src/editor/**`. The bundled catalogue is read through the build, not parsed in maker code (5c).
7. **Every change is saved, every failure shown** (step 2 Save rules), through step 2's save plan and store.
8. **No caches (tactics-checkpoint law; `BUILD_GUIDE.md` law 15, roadmap L81).** Step 5 adds no reach, sight or path cache. Diagrams and the badge are computed when drawn; nothing is memoised across renders. Caches come only after the tactics-checkpoint measurement shows a tick repeating work.
9. **H1 layout (EA).** The ability panel has one folding section per `menu_order` question, knobs in `knob_ids` order; the first section starts open; the panel scrolls; no fixed or max heights on panel parts. A knob with `depends_on` shows only when its condition holds (from data, e.g. `custom_ns` / `custom_ew` on `reach_mode`).
10. **H2 goal (EA; DSK D23).** The goal comes only from `behaviours[].goal` in the catalogue (one of `move`, `attack`, `defend`, `support`, `spells`, `status`, `ai`). Never from `group`, never from an id-to-goal table in `tools/maker` (plant). Card titles: Move, Attack, Defend, Support, Spells, Status, AI, in that order, then **Other abilities**, listed last: every primary whose `goal` is absent or not one of the seven goes there, never hidden, and no report row (D23). The goal list and each goal's card list scroll (Attack has ~10).
11. **H3 cards vs rows (EA).** `composable_as` decides, read from data: `"primary"` (alone or with others) is a goal card in + Add ability; `"rider"`, `"scaler"`, `"trigger"` show as rows inside an ability's panel, never as cards; `[]` is never offered in + Add ability.
12. **H5 wired only, seven widgets (EA).** "Wired" is an engine-exported list (5b `src/rules/behaviours/wired.ts`), not a catalogue flag. The maker filters by it. Widgets: slider, picker, toggle, ref, list, text, colour. A knob of any other type renders a read-only row "Not editable here", never a crash.
13. **H4 / D24 addable list and the three rev cases.** + Add ability lists entries of the **engine-bundled** catalogue `behaviour-library/behaviours.json` at its `catalogue_rev` B, filtered by `wired.ts` and Rule 11. Adding re-cuts the slice as `sliceOf(bundled, used ids + new id)` (catalogue order, one code path, no append). Only when `project.catalogueRev` = B. Older project: + Add ability first shows the update offer (exact words in 5c). Newer project: + Add ability is not shown; a note says why. Removing an ability never prunes the slice. The play stage and export read only `catalogue/slice.json`; the bundled catalogue ships in the maker bundle only.
14. **Words, not only colour; 48 px; AA** (step 4 Rules 14). The ✦N badge has text, AA contrast.

## Carries from step 4c (5a)
**(a) Seed rule.** A new stage copies the first live stage's `seed` (already on main: `src/editor/stage/rooms.ts` `takenSeed` L19–27, applied in `addStage` L30). This was the 4c builder's choice (`handback/step-04c-stages-maps/r1/HANDBACK.md` L56). QA flagged it for CoS/UX to confirm (`docs/qa/step-04c-review.md` L32), and UX confirms it here. It is not a CEO ruling. Keep it; no code change. **And** the Empty template's stage ships a seed: add `"seed": 24301` (the demo stage's value) to `data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json`. Why: today an Empty project's stage has no `seed`, so every stage added to it has none, and the play stage throws `play: seed` (`tools/play-stage/load.ts` L24). One `.json` line (excluded from the count) removes the `play: seed` throw for Empty projects (Test there still stops at `play: army` until Ruling 7), and copying keeps every later stage deterministic with no format change (`seed?` is already in project-format §6.5, L1071). Named test **`empty template stage has a seed`**. **DSK/EA note:** project-format L1071 says an absent seed means "a fresh seed at play start", but the play stage throws instead; this rule sidesteps it for maker projects. EA/DSK should reconcile the two (Rulings needed).

**(b) Plain resize wording.** `tools/maker/rooms.ts` `say` (L41–45) shows raw format names (L42–44). Replace them with these exact strings (`<c>,<r>` from `sq`; " at <c>,<r>" is left out when `sq` is null). The list labels match 4b's sheet words.

| Case (L) | Old (`a6538ee1`) | New |
|---|---|---|
| edge, before (L42) | `Edge <index> will go` | `A wall edge outside the new size will be removed` |
| edge, after (L42) | `mapEntryDropped edges <index> outsideMap` | `A wall edge was outside the map and was removed` |
| placement, before (L44) | `<list> <index> at <c>,<r> will go` | `Your team start at <c>,<r> will be removed` / `NPC at <c>,<r> will be removed` / `Enemy at <c>,<r> will be removed` |
| placement, after (L44) | `placementDropped <list> <index> outsideMap` | `Your team start at <c>,<r> was outside the map and was removed` (same for `NPC`, `Enemy`) |

List label: `playerSpawns` → `Your team start`, `neutrals` → `NPC`, `enemyPool` → `Enemy`. The frozen s4c smoke waits on the old text at L27 (`"will go"`) and L48 (`"placementDropped"`): 5a changes those two waits to `"will be removed"` and `"was outside the map and was removed"`, nothing else in that file, and runs the s4c smoke. This is a deliberate edit of a merged smoke. The hand-back names it as deliberate in § Decisions. It pastes `git diff <base> -- handoff/steps/tests/s4c-stages-maps/smoke.mjs`, which must show exactly two changed lines (L27, L48). It quotes the file's sha256 before (`ea0d674f…` on `a6538ee1`) and after. The after value is the s4c reference for 5b, 5c and the post-merge check. No other s4c line changes. Named test **`resize rows use plain words`** (no `placementDropped`, `mapEntryDropped`, `playerSpawns`, `neutrals`, `enemyPool` or `outsideMap` in any `say` output).

**(c) The `stage.ts:31` kind pin.** `tests/editor/stage-place.test.ts` L53 pins exactly one allowed hit of its kind scan (L50–52): `tools/maker/stage.ts:31: function docAt(files: ProjectFiles, kind: string, id: string): …`. Any edit above L31 moves it and fails the test. 5b edits `stage.ts`, so 5b renames that parameter to `folder` (as `src/editor/stage/rooms.ts` `docsIn` L7 already does) and changes L53 to expect `[]`. Then no pin is left. Counted (2 lines).

## Erratum for step 4 (CoS applies; not a builder task)
The brief named step-04 guide **L122**. On `a6538ee1` L122 is the heading `### 4a Build` and holds no count command. The count command is **L166**, and it already has `':!data/templates/**'` (4b L251 and 4c L340 say "as in 4a"). What it lacks is `':!handback/**'`, which QA adds by hand in every review (for example `docs/qa/step-04c-review.md` L17). Erratum, L166:
- Old: ``git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4a-stage-paint/**'``
- New: ``git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!handoff/steps/tests/s4a-stage-paint/**'``

## Count command (each run)
`git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/<this run's smoke dir>/**'` is **400 or fewer** (insertions plus deletions, G7; `docs/qa/handback-checklist.md` L26, `BUILD_GUIDE.md` L123). Only `.json` goes under `data/templates/**` or `behaviour-library/**`; no builder run edits `behaviour-library/**` (CoS pushes the Librarian's file). **Caps are guidance:** a file may pass its cap if the run stays within 400; the hand-back names every file over its cap and why.

---

## 5a: units

### 5a Behaviour
- **Units section** on the project screen, under Maps (step 4c): each unit as a 48 px card with its name, and **+ Add unit**. Tap a card: the **unit editor**.
- **+ Add unit:** a name sheet ("Unit name", 1–40 code points trimmed, default "New unit"; an empty name shows "Give your unit a name"). It copies `data/templates/unit.json` (new, a whole v2 unit doc with `setupIds: []`, `stats: {}`, empty `history`) and opens the editor.
- **Unit editor:** top bar Back, the unit name, Test (5b; not shown in 5a). Body: **Name** (rename sheet), **Start from a role**, **Health** and **Attack**.
  - **Start from a role:** chips from the slice's `unit-roster` `presets` (labels such as "Warrior (BTF)"), only presets whose `overrides` hold only knobs with `per_unit: true` (read from the slice). Tapping one writes those values into `unit.stats` (`{value, rev}`). Today: Warrior, Archer, Mage, Cleric (BTF).
  - **Health / Attack:** the slider widget for `unit-roster` `unit_hp` / `unit_atk` (label, min, max from the slice). The value shown is the unit's own or, if absent, the army value from the project's `unit-roster` setup, with the words "Same as army". **Reset** removes the key.
- **Delete unit** (⋯ on its card): refused while anything uses it, naming each use: "Used by Demo stage. Remove it there first." for a stage (`loadout.required`/`roster`, `neutrals[].unitId`, `enemyPool.entries[].unitId`), and "Used in your team list. Remove it there first." for the project `loadout` (`required`, `roster`). Otherwise removed from the list (file stays, Rule 5); Undo toast.
- **Look:** a new unit plays with the play stage's fallback look (by name, `tools/play-stage/load.ts` L8–19). No Look control in step 5 (see Rulings needed).

### 5a Build
| File | Job | Cap |
|---|---|---|
| `data/templates/unit.json` | new skeleton (data, not counted) | data |
| `data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json` | add `"seed": 24301` (carry a; data) | data |
| `src/editor/unit/units.ts` | new, pure: `newUnit(skel, id, name)`, `renameUnit`, `usedBy(files, unitId)` (stage names and the team list), `deleteUnit` (refused if used), `setStat(unit, key, value)`, `resetStat`, `applyRole(unit, overrides, perUnitKeys)`. | 60 |
| `tools/maker/widgets.ts` | new: the seven knob widgets (H5) from a slice knob spec: slider, picker (options as strings or `{value, label}`), toggle, ref, list, text (`max_len`), colour (picker over the project palette tokens, no colour literal), plus the read-only "Not editable here" row; 48 px, labels from the slice. | 80 |
| `tools/maker/units.ts` | new: Units section, unit editor, name sheet, role chips, Health/Attack, delete refusal, Undo. | 90 |
| `tools/maker/project.ts` edit | Mount the Units section. | 10 |
| `tools/maker/rooms.ts` edit | Carry b strings. | 8 |
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` edit | Carry b: L27 and L48 waits only. | 2 |
| `tests/editor/units.test.ts` | new (see Done when). | 55 |
| `tests/tools/knob-widgets.test.ts` | new: one render per widget type, `{value, label}` options, unknown type → read-only row, no throw. | 40 |
| `tests/editor/stage-rooms.test.ts` edit | Named test `resize rows use plain words`. | 10 |
| `tests/editor/maker-law.test.ts` edit | Scan `src/editor/unit/**` and the new maker files. | 3 |
| `handoff/steps/tests/s5a-units/smoke.mjs` | new smoke, own cap, not counted. | 130 (own) |

Caps sum to **358**.

**5a smoke (port 8802).** `node handoff/steps/tests/s5a-units/smoke.mjs . 8802`. Checks: 1. New (Demo), open it: the Units section lists the demo's 7 units. 2. + Add unit, name "Scout": its card appears and the editor opens. 3. Tap the "Warrior (BTF)" role: Health reads 9 and Attack 1. 4. Set Health to 12, Back, reopen: 12. Reset: "Same as army". 5. Delete "Scout": gone, Undo brings it back. 6. Delete "Wolf" (enemy pool): refused, naming Demo stage; delete "Knight" (project loadout): refused, "Used in your team list". 7. Reload: the editor shows the last saved state. 8. Check 8 with the editor and the role sheet open.

### 5a Must NOT
- **No other theme or visual system.** Only the tokens, type, spacing, radii and components in `docs/maker/style-spec.md`: no template theme, no CSS framework, no web or icon fonts, no new colours. The step 2 theme plant covers new `tools/maker/**` files.
- **No new framework, starter template, app scaffold, borrowed theme or other visual system.** Build only inside the existing stack, files and gates, from current main.
- No rule logic in the editor; no stat value or role in code (they come from the slice).
- No `side`, position or `kind`/`formatVersion` literal written on a unit. No Look control, no `sprite` write.
- No hard delete; no `history` ops (D12).
- No empty `catch`, no silent default (Law 12). No `tools/play-stage/` change in 5a.
- Don't touch frozen kits other than the two s4c waits. Offline, no new dependencies. 48 px targets, AA contrast in light and dark.

### 5a Done when
- **Gates:** `npm ci && npm run green` exits 0 at **1065 + N** or more (offline, no new dependencies). Count command as above, with `s5a-units`.
- **Named tests:** `unit skeleton loads` (`data/templates/unit.json` through `readUnit`); `empty template stage has a seed`; `resize rows use plain words`.
- **Model tests (`units.test.ts`):** a new unit has a new `unit_<ULID>`, no `kind`/`formatVersion` literal in the code that made it, and loads through `readProject` with an empty report; rename keeps id, path and every other field byte-equal; a role writes only `per_unit: true` keys; Reset removes the key and `playDocsOf` then gives the army value; delete of a used unit is refused with each use named (stage and team list); Undo restores.
- **Wired (`units.test.ts`):** a stat edit changes `playDocsOf(...).rules.stats[unitId]` (so it reaches the match).
- **Smokes:** s5a and s4c `SMOKE PASS` at 390 and 360. § Smoke says no play-stage file changed.
- **Openable app page:** `node tools/maker/build.ts <out>` gives `<out>/maker/index.html`; served on 127.0.0.1 and opened at **390 px**, the Units section and unit editor work as above and match the shots (Shots).
- **Screenshots:** one 390×844 light-theme screenshot per screen: Units section, + Add unit name sheet, unit editor, role chips, delete refusal.
- **Not the builder's gate:** the phone check (S21 Ultra, Red Magic 9 Pro) is a CoS/CEO pass.

---

## 5b: abilities on a unit

### 5b Behaviour
- **Unit sheet (shell-lessons #2 point 4):** tap or hold a placed unit on the stage (hold = pointer up ≥ 500 ms after pointer down on the same cell, from event timestamps; no timer). The sheet is titled "<Name> · <Your team | NPC | Enemy>" with **Edit**, **Move**, **Delete**, **Test**, and for an NPC also **What do they do?** (4b). It replaces 4b's "A unit stands here" block; the paint rows below stay as in 4b.
- **Edit** opens the unit editor (5a) with its **Abilities** list: one row per `setupIds` entry whose behaviour has `"primary"` in `composable_as` (Rule 11), titled by the slice `name`, each with **Test** and **×**. Below the list: **+ Add ability** (5c; not shown in 5b) and **▶ Test** (whole unit). Tap a row: its **ability panel**.
- **Ability panel:** Rule 9 sections; only knobs in `wired.ts` for that behaviour (Rule 12); each knob through its 5a widget; **Reset to default** per knob. Rider, scaler and trigger behaviours attached to this unit show as rows inside the panel (Rule 11). Every change saves (one Undo step per change).
- **×** detaches (Rule 5), one Undo step; the badge updates at once.
- **✦N badge:** on each stage cell whose unit has N ≥ 1 attached setups, a badge "✦N" (text, AA). It counts `unit.setupIds` and updates on add and remove (#2 rule 5).
- **Test (per ability) and ▶ Test (whole unit):** save, then step 3's Test on the first stage (in `project.stages` order) where the unit takes part (loadout, NPCs or enemy pool), with `&unit=<unitId>` and, per ability, `&ability=<setupId>`. The play stage starts with that unit selected if it is on the player side, and the tested ability's aim open (basic attack: the basic aim; line-shot: the spell aim); on another side, the camera starts on it. If the unit takes part in no stage, no Test is shown, and the line "Place this unit on a stage to test it." is.

### 5b Build
| File | Job | Cap |
|---|---|---|
| `src/rules/behaviours/wired.ts` | new (EA owns the list): `WIRED: Readonly<Record<behaviourId, readonly knobId[]>>`, exactly what `playDocsOf` reads today: `unit-roster` [`unit_hp`, `unit_atk`], `basic-attack` [`reach_mode`, `custom_ns`, `custom_ew`], `line-shot` [`range`, `damage`], `talk` [`line`]. Ids only, no rules. Export from `index.ts`. | 13 |
| `tests/rules/wired.test.ts` | new: **named test `wired list matches the play adapter`**: for each listed knob, a non-default value (with its `depends_on` parent set so the knob is live, e.g. `reach_mode: "custom-cross"` for `custom_ns`/`custom_ew`) changes `playDocsOf` output; for each other knob of those behaviours in the slice, it leaves the output deep-equal. | 40 |
| `src/editor/unit/panel.ts` | new, pure: `panelOf(slice, wired, behaviourId, answers)` → sections (Rule 9, `depends_on`), rows vs cards (Rule 11); `setAnswer` (equal to default → `{source:"default"}`), `resetAnswer`, `detach(unit, setupId)`, `badge(unit)`. | 70 |
| `tools/maker/ability-panel.ts` | new: ability list (Test, ×, ▶ Test, the "Place this unit…" line), the panel with `<details>` sections, widgets from 5a. | 85 |
| `tools/maker/stage.ts` edit | Unit sheet title and buttons, tap/hold, ✦N on cells; rename `docAt`'s `kind` to `folder` (carry c). | 25 |
| `tools/maker/stage-sheets.ts` edit | `unitButtons` gets Edit and Test. | 4 |
| `tests/editor/stage-place.test.ts` edit | L53 expects `[]` (carry c). | 1 |
| `tools/maker/test-launch.ts` edit | Pass `unit` and `ability` through `LaunchBag` to the start function and the URL. | 10 |
| `tools/play-stage/page.ts` / `board.ts` edit | Start options `{unitId?, abilityId?}`: select the first live player unit with that `unitId` and open the aim; otherwise centre on it. S0 smoke. | 15 |
| `tools/play-stage/project.ts` edit | L42 tests `"one-tile-straight"`, but the slice option is `"orth-only-1"` (it plays as reach 1 only through `reachOf`'s missing-key default). Match the slice value (EA confirms). | 1 |
| `tests/editor/ability-panel.test.ts` | new (see Done when). | 60 |
| `tests/tools/ability-panel-layout.test.ts` + `tests/fixtures/maker/big-ability.json` | **named test `panel layout: 18 knobs, 7 questions, 5 in one, at 360`** (H1), with a fixture as big as sword-lifecycle (18 knobs, 7 questions, 5 knobs in one). | 55 |
| `handoff/steps/tests/s5b-abilities/smoke.mjs` | new smoke, own cap. | 130 (own) |

Caps sum to **379**.

**5b smoke (port 8803).** Checks: 1. New (Demo), open the stage, tap the Archer: the sheet reads "Archer · Your team" with Edit, Move, Delete, Test. 2. Edit: the list shows the Archer's basic attack and line shot, each with Test and ×; the cell shows ✦2. 3. Open line shot: sections in `menu_order` order with only Range and Damage; set Range to 4, Back, reopen: 4. 4. Test on line shot: the play stage starts with the Archer selected and the spell aim open, reaching 4 tiles in a straight line (dev globals). Back. 5. × on line shot: ✦1; Undo: ✦2. 6. ▶ Test: the match starts with the Archer selected. 7. A unit in no stage shows "Place this unit on a stage to test it." and no Test. 8. Check 8 with the unit sheet, the list and an open panel.

### 5b Must NOT
- Everything in 5a Must NOT, plus: no knob, row or Test that the play stage doesn't play (Rule 12); no mock Test results (#2 rule 3).
- No goal grouping, + Add ability or catalogue reads in 5b.
- No cache of reach, targets or badge counts (Rule 8). No edit to the S0 kit.
- No `tools/maker` or `src/editor` import into `tools/play-stage`.

### 5b Done when
- **Gates:** green at 5a's final count + N. Count command with `s5b-abilities`.
- **Named tests:** `wired list matches the play adapter`; `panel layout: 18 knobs, 7 questions, 5 in one, at 360` (7 `<details>`, the first open, knobs in `knob_ids` order, the five in one section, no fixed or max height on the panel's classes in `app.css`, no sideways overflow); `unknown knob type is read-only`.
- **Model tests (`ability-panel.test.ts`):** only wired knobs listed; `depends_on` hides `custom_ns`/`custom_ew` unless `custom-cross`; setting a default value writes `{source:"default"}` with no `value`; Reset does the same; detach removes only that id and keeps the setup file; `badge` counts `setupIds`; a rider/scaler/trigger is a row, never a card; a changed Range reaches `playDocsOf(...).rules.abilities`.
- **Smokes:** s5b and S0 `SMOKE PASS` / `TOUCH SMOKE PASS` at 390 and 360.
- **Openable app page, Look matches the shots, Screenshots** (unit sheet, ability list with ✦N, ability panel, the Test start with the unit selected), **not the builder's gate**: as in 5a.

---

## 5c: + Add ability

### 5c Behaviour
- **+ Add ability** under the ability list (#2 point 2). It opens a sheet: **Browse by goal** cards (Rule 10) with a count each; only goals with at least one addable ability are shown; **Other abilities** last. Tap a goal: its cards, a search box ("Tap a card to add it with defaults"), each card with its name, its `summary`, and a **tile diagram**. Tap a card: a new setup is added with defaults and its panel opens (#2 rule 1). The **Suggested for this unit** chip and **Start from a role** inside + Add ability are **not shown** in step 5: no catalogue data drives them yet (#2 rule 6; Rulings needed).
- **Addable list (Rule 13):** bundled catalogue entries that are in `WIRED`, have `"primary"` in `composable_as`, and aren't already on this unit.
- **Rev cases (D24):** with B = the bundled `catalogue_rev` and P = `project.catalogueRev`:
  - **P = B:** + Add ability works as above.
  - **P < B:** + Add ability opens the offer first: "New abilities are available. Update this project to use them?" with **Update** and **Not now**. Update re-cuts the slice at B with the project's used ids, sets `catalogueRev` and each setup's `catalogue.rev` to B, and saves (one save; Undo restores). It is offered only when the used behaviours' knobs (ids, types, defaults, options, limits) are the same in the project's slice and at B, so no answer drifts (setup-format §8.2). Otherwise the sheet says "This project needs a bigger update than the maker can do yet." with **Close** only (Rulings needed).
  - **P > B:** + Add ability is not shown; the list says "This project was made with a newer TileEngine. Update the app to add abilities." The project still loads and plays from its own slice.
- **Tile diagram (#2 rule 4):** from the ability's own data through the engine: run `playDocsOf` on the project with the candidate setup at its defaults (or the current answers in the panel), take that unit's reach (`rules.reach` / `rules.abilities[].reach`), and mark a 7 × 7 grid with the engine's `inOrthogonalReach` (`src/rules/battle/range.ts` L4–7) from the centre. Cells in words as well as colour ("reach"), AA. Computed when drawn, never stored (Rule 8).
- **Remove never prunes** (D24): after ×, the slice keeps the entry.

### 5c Build
| File | Job | Cap |
|---|---|---|
| `tools/maker/build.ts` edit | Ship `behaviour-library/behaviours.json` as `catalogue.json.js` (the `.json.js` path the play-stage build uses) under the maker stamp only. The play-stage and APK builds must not contain it. | 6 |
| `tools/maker/catalogue.ts` | new: import the bundled catalogue; `revCase(P, B)` → `same` / `older` / `newer`. | 25 |
| `src/editor/unit/add.ts` | new, pure: `addable(bundled, wired, unit)`; `byGoal(entries)` (seven goals then Other, from `goal` only); `addAbility(files, skel, unitId, setupId, bundled)` (new setup from `data/templates/setup.ability.json`, D16 answers, `sliceOf(bundled, used + new)`); `canUpdate(slice, bundled)` and `updateProject(files, bundled)`. | 85 |
| `data/templates/setup.ability.json` | new skeleton (data). | data |
| `tools/maker/add-ability.ts` | new: the + Add ability sheet, goal cards, card list with search, the offer and the newer-project note. | 90 |
| `tools/maker/unit-diagram.ts` | new: the diagram through `playDocsOf` + `inOrthogonalReach`. | 30 |
| `tests/editor/add-ability.test.ts` | new (see Done when). | 80 |
| `tests/tools/maker-build.test.ts` edit | The maker output has the catalogue; the play-stage build output doesn't. | 5 |
| `handoff/steps/tests/s5c-add-ability/smoke.mjs` | new smoke, own cap. | 130 (own) |

Caps sum to **321**. `behaviour-library/**` is data and not counted.

**5c smoke (port 8804).** Checks: 1. New (Demo) at P = B (after the rev 30 re-cut; else first tap Update), open the Knight's editor, + Add ability: the goal cards show, Other last if any primary lacks a goal. 2. Open Attack (or the goal holding line shot): each card shows a diagram. 3. Add line shot to the Knight: its panel opens; the list shows it; the stage shows ✦1. 4. Test on it: the Knight starts selected with the spell aim. 5. ×, then reopen + Add ability: line shot is offered again; `catalogue/slice.json` still has it (dev read). 6. A project with `catalogueRev` lowered by one: the offer text shows; Update; + Add works. 7. A project with `catalogueRev` raised by one: no + Add ability, the newer-project note shows. 8. Check 8 with + Add ability, a goal's list and the offer open.

### 5c Must NOT
- Everything in 5a and 5b Must NOT, plus: no id-to-goal table or goal list from `group` in `tools/maker` or `src/editor` (plant: `maker-law.test.ts` fails on a `goal` value literal next to a behaviour id, and on `["']group["']` in the add code); no hard-coded ability list; no diagram drawn per card by hand.
- No rev-B entry in an older slice; no prune on remove; no catalogue in the play-stage or APK bundle.
- No Suggested chip or role row inside + Add ability; no greyed goal or card.
- No `JSON.parse` of the catalogue in maker code.

### 5c Done when
- **Gates:** green at 5b's final count + N. Count command with `s5c-add-ability`.
- **Named tests (`add-ability.test.ts`):**
  - `rev case same: add re-cuts the slice` — `catalogue/slice.json` equals `sliceOf(bundled, used + new)` byte for byte; the new setup has D16 answers and loads with an empty report; `playDocsOf` gives the new ability.
  - `rev case older: offer first, no rev-B entry` — + Add returns the offer; adding without Update is refused; the slice is unchanged; after Update, `catalogueRev` and every setup's `catalogue.rev` are B and the report is empty.
  - `rev case newer: add is off` — no addable list, the note text, and the project still opens through `openProject`.
  - `remove doesn't prune` — after detach the slice is byte-equal to before.
  - `missing goal goes to Other` — a primary with no `goal`, or `goal: "flying"`, is listed under Other abilities, last; no report row; no card hidden.
  - `only wired primaries are offered` — `[]`, rider, scaler and trigger entries and unwired ids are never cards.
  - `diagram comes from the engine` — line shot at range 3 marks exactly the cells `inOrthogonalReach` gives, and changes when Range changes.
- **Smokes:** s5c `SMOKE PASS` at 390 and 360. S0 only if a play-stage file changed.
- **Openable app page, Look matches the shots, Screenshots** (goal cards, a goal's cards with diagrams, the update offer, the newer-project note, the panel after adding), **not the builder's gate**: as in 5a.

---

## Shots (look reference)
On main: `docs/maker/shots/68-unit-tap-edit-basic-light.png` (the unit sheet, 5b), `68-test-battle-menu.png` (Test), `24-project-settings.png` (project screen sections, 5a), `18-undo-toast.png`. The CEO's six prototype shots for #2 ("Browse by goal", "Status abilities with tile diagrams", "Star count badge on unit", "Hold unit: Edit, Move, Delete, Test", "Assigned abilities list with Test and remove", "Add ability sheet"; shell-lessons L53) are **not in the repo**. CoS adds them to `docs/maker/shots/` before 5b, or the look check for those screens is style-spec only.

## Rulings needed
None blocks 5a. Open:
1. **EA:** confirm `wired.ts` as knob-level (`behaviourId → knobIds`), since the ruling says "id list" and the maker must hide unwired knobs too; and the `"orth-only-1"` fix at `project.ts` L42 (5b).
2. **EA:** `custom_ns` and `custom_ew` are two sliders but the play adapter uses `min(ns, ew)` (L42), because engine reach is one orthogonal number. Show both (diagram shows the real reach) or one? Default in this guide: show both, diagram tells the truth.
3. **EA/DSK:** absent `stage.seed` = "fresh seed at play start" (project-format L1071) vs `play: seed` thrown (`load.ts` L24). Carry (a) sidesteps it for maker projects.
4. **DSK/EA:** the P < B update when knobs drift (setup-format §8.2) is not built; 5c offers Update only when nothing drifts. Who builds full drift, and when?
5. **Librarian:** catalogue rev 30 with `goal` on every primary (D23), pushed to main as `behaviour-library/behaviours.json`; data for "Suggested for this unit" and role presets inside + Add ability (#2 rule 6), or they stay out.
6. **DSK/EA:** a unit **Look**: may `unit.sprite` hold a starter recipe id (`starter:hero-sword`), and will the play stage read it before the name match? Until then, new units play with the fallback look.
7. **EA:** the Empty template has no `unit-roster` setup and an empty slice, so `playDocsOf` throws `play: army` (L33) on any Empty project; units made there can't be Tested until the Empty template gains an army setup (data) or the adapter gets a default.

## Not in this step
Look/sprite picker; Suggested chip and roles inside + Add ability; effect pickers (`effect` knobs; step 10); ability groups and presentation (`ability_group`, `ability-presentation`); xp-levels and win rules (step 6, own editors); copy or duplicate ability; full catalogue drift; any reach or sight cache (after the checkpoint measurement).

## Prototype lessons
- shell-lessons #2: the goal-first browse with tile diagrams replaced a long list and saved rebuilding the demo after each add. Keep the flow; every card real.
- The ui-shell ability mocks returned fake Test results; here every Test runs the play stage (#2 rule 3).
- Keep the split: pure model in `src/editor/unit/`, UI in `tools/maker/`, rules in the engine.
