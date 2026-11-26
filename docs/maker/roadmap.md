# TileEngine maker roadmap

r15, 2026-11-19; r15d 2026-11-26: 11a2 ready sheet split out of 11a by the EA (Editor & UX Designer edit); r15c status pass 2026-11-26 (Editor & UX Designer, from CoS and EA: status as of main `e9cf8fbd`; rows 00b, 2, 3, 03b and 4a–4c marked shipped; 8c added to row 8; steps 9 (9a–9c) and 10 (10a–10d) marked shipped; step 11 takes the APK work (CEO 2026-11-24 18:03, via CoS) and splits into 11a, 11b and 11c, row text drafted by EA); r15b status fixes 2026-11-24 (Editor & UX Designer, from EA's handover and CoS: status as of main `8ab22996`; steps 5, 6, 7 and 8 marked shipped; step 9 split into 9a/9b and still PROPOSED; art-upload source marked private). (r15: optimisation guards, proposed by CoS and CEO-approved 2026-11-19 14:42: a phone baseline at the tactics checkpoint, a rebuild measurement and pre-warm rule at steps 7 and 8, budgets and a phone-like Test at step 11, and a pointer to the engine's Optimisation laws. r14: outside feedback on the engine-first order (GrokHeavy, ChatGPT, Gemini, Grok Build), shared by the CEO; changes proposed by CoS. These are proposals, not CEO rulings. The export MVP moves to the end of the early block (11) with a vertical-slice acceptance test and its exclusions; the Effect Designer splits into the engine effect path (10, early) and the full designer tidy (33, stage 5); art upload is 9; later stage 5 rows shift by one; old-to-new table now has r12, r13 and r14 columns. r13: CEO decision 2026-11-19 01:41 to reorder engine-first, on an order CoS proposed and relayed. PROPOSED rows reordered engine-first and renumbered 5 to 37; new export MVP (9) and its checkpoint; autosave split into doors and stairs (8) and sleep (14); tactics checkpoint moved after 6; old-to-new table; cross-refs and dependencies updated. r12: CoS's list from the outside reviews by GrokHeavy, Grok Build and Gemini, shared by the CEO and relayed by CoS: status as of main `0ea3c16e`; S1b merged; rows for 00b and 03b; steps 0 to 4c AGREED; TBD, PROPOSED and precedence rules; the greyed-Test exception is the only one; Effect Designer status corrected; post-launch marked DO NOT BUILD; internal checkpoints; risk rows; the cozy-split rule. r11: Behaviour Librarian answers to the six open items, 2026-11-19; r10: rule 2 names the greyed-Test exception, to match the step guides; r9: QA fixes plus CEO feedback #1 to #7, HUD kit row), Editor & UX Designer (CEO ask 22:17 via Chief Of Staff). Behaviours, NPC and BTF rows come from the Behaviour Librarian (input 2026-11-18). Docs only: no code, nothing pushed or published. QA reviews this file, then CoS pushes it.

**Status as of main `e9cf8fbd`** (`e9cf8fb docs(rebuild): step 10d record + README row 29 + QA rebuild review`, 2026-11-26). Shipped: step 0 (PR #76), S1a (PR #77), S1b (PR #78, merge `57af7135`), and every step after them through 10d: 2 (PR #79), 02b (PR #80), 3 (PR #81), 03b (PR #82), 4a (PR #83), 00b (PR #84), 4b–4c (PRs #85, #86), 5a–5c (PRs #87–#89), 6a–6d (PRs #90–#93, tactics checkpoint reached), 7 (PR #94), 8a–8c (PRs #96, #98, #100), 9a–9c (PRs #99, #101, #102) and 10a–10d (PRs #103–#106). Next: step 11a, guide drafted, waiting on the CEO's go and DSK question 1. Everything from step 11 on is PROPOSED. **Order:** engine-first since r13 (CEO decision 2026-11-19 01:41, order proposed by CoS); see the old-to-new table.

**Read these four rules before you build anything:**
- **TBD means no document gives the answer. Stop and ask CoS. Never fill it in.**
- **Don't build a PROPOSED row; ask CoS.** Only rows marked AGREED are build-ready, and only with a step guide in `docs/maker/steps/`.
- **A `docs/maker/steps/` guide outranks every other doc**, including this roadmap, the maker specs, the UX plans and the design notes. Files marked **Rewrite** in the audit below, and everything in `ui-shell/`, are **not build instructions**, even when they are more detailed. **Never copy code from them.**
- **The greyed Test button (Rules 2) is the ONLY dead-button exception. Don't copy it.**

This page lists every planned engine feature and assigns it to the five agreed stages. It gives each feature a proposed MS (maker spec) number and a step order. After the stage tables come the post-launch rows, the CEO decisions that still need a plan, and an audit of every existing plan doc. MS numbers and step orders are proposals until CoS and the step owners agree them. CoS agreed (2026-11-18) that the wizard sits in stage 5 and the stage editor starts stage 3. Where a source doc doesn't say something, the cell reads TBD.

**Key sources** (main is `0ea3c16e`):
- Steps: `docs/maker/steps/`
- Maker specs: `docs/maker/maker-spec/`
- Style: `docs/maker/style-spec.md`
- Cozy order: `docs/cozy/JOINT-MAP.md` r3 and `docs/cozy/GDD.md` v0.1
- MS outline: `share/maker-spec/ux-plan-2026-11-18.md` (box only, not on main)
- Behaviour catalogue: `behaviour-library/` (box only, not on main) rev 29 (`bba8c252`). It has 65 behaviours, 570 knobs and 40 presets. Each behaviour has defaults, limits, bans, BTF cites and a menu question order.
- Engine laws, including the Optimisation laws: `BUILD_GUIDE.md` §2 and §2.2 (laws 14–20)

## Rules
1. **The maker only authors data, and the engine runs the rules.** No rule logic lives in a screen.
2. **Nothing ships early.** No screen or button ships before the step that makes it work. A maker editor ships in the same slice as its data, reader and engine rule (JOINT-MAP r3, "Rule for every cozy slice").
   - Named exception: the **greyed Test** button on step 2's project screen. It is visible, styled `--soon`, not clickable, and step 3 wires it (`docs/maker/steps/step-02-home-save-load.md`, Rules 1). **This is the ONLY exception, and it must not be copied.** No other screen may show a greyed, dead or "coming soon" control.
3. **The ui-shell is reference only and is never merged.** It is good for behaviour and screenshots, never for code. A step guide in `docs/maker/steps/` outranks it and every other doc (see the four rules at the top).
4. **Project-file shape (Librarian):**
   - A setup stores only the knob values that differ from the default.
   - The manifest pins `catalogueRev`.
   - Setups attach through `setupIds` on stages, neutrals and units.
5. **Standing lines for every maker step:**
   - **Read first** includes `docs/maker/style-spec.md`.
   - **Must NOT:**
     - no new framework, starter template or app scaffold;
     - no other theme or visual system.
   - Build only inside the repo's existing stack, files and test gates, starting from current main.
   - **Slices (every step):**
     - 400 lines or fewer, with the gates on: `npm test` at floor+N, `scripts/check-law.sh` and `scripts/check-state.sh`;
     - offline, no new dependencies;
     - 48 px targets and AA contrast.
   - **From Step 2 on (maker UI steps), Done when:** S0 and Step 1 are data-only, and `tools/maker/build.ts` isn't on main until Step 2.
     - the step ships an openable app page built by `node tools/maker/build.ts <out>`;
     - the page works at 390 px and matches its `docs/maker/shots/` reference;
     - the handback attaches one 390×844 light-theme screenshot per screen.
6. **Who builds and who approves.** Code is written by Grok Build and GrokHeavy; this team writes plans and docs only. Nothing goes public without the CEO's typed OK.
7. **Ability editing (behaviours are called abilities on screen, CEO 2026-11-18):** every behaviour uses one generic ability panel (the **Behaviour panel** in this doc) unless the Behaviour editors table below names its own editor. You add one through **+ Add ability**: Suggested for this unit, Start from a role, or Browse by goal (Move, Attack, Defend, Support, Spells, Status, AI), then cards with tile diagrams, tap to add with defaults. Then you set sliders and pickers in the catalogue's menu question order. Banned combos are greyed out, and Reset to default is always there. Only wired abilities are shown, and every per-ability Test runs the engine (`shell-lessons.md` #2).
8. **Start new in every tool (CEO #6):** the CEO asked for a Start new / Clear all button beside View, with a warning, in every tool and the stage preview. It ships with each tool's own step (the stage preview from Step 4), so it is never a dead control on an earlier screen. The proposed UX answer adds one undo step (`shell-lessons.md` #6).

## Stage 1: project format, reader and play-stage load
| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-00 | 0 · **AGREED · SHIPPED** (PR #76) | **s0-play-input: S0 play-stage touch input, selection state and Talk panel** | Play stage only: tap, pan and pinch, a battle menu, End Turn and a Talk panel | P1-9 APK | `docs/maker/steps/step-00-play-input.md`, `docs/maker/maker-spec/MS-00-play-input-and-talk.md` |
| — | 1 · **AGREED · SHIPPED** (S1a PR #77; S1b PR #78, merge `57af7135`) | **Step 1: Project format, reader, validation, versioning (the play stage loads a project)** | None (data only). The play stage loads a project | S0 | `docs/maker/steps/step-01-project-format.md`, `docs/maker/data/s1-project-load.md`, `project-format.md`, `setup-format.md` |
| — | 1 (with Step 1) | Phase 1 behaviours ready: step-pattern, talk, xp-levels, terrain, unit-roster, damage-resolution and win-condition (frozen and cited) | None yet. Editors come in stage 3 | B1 behaviour runtime | `behaviour-library/` rev 29, `docs/foundation/STATUS.md` |
| — | 00b · **AGREED · SHIPPED** (PR #84, merge `d62f87bc`) | **Step 00b (S0b, TP-4): sides from data.** The play stage builds its sides from `stage.sides` instead of the hard-coded `SIDES` (`tools/play-stage/match.ts` line 15), free roam when only one side is present, and colour by side | None (play stage only) | Steps 0, 1a, 1b | `docs/maker/steps/step-00b-sides-from-data.md` |
| — | 03b · **AGREED · SHIPPED** (PR #82, merge `402699d5`) | **Step 03b: the real rev 29 slice in the demo (D18).** Swaps in the regenerated slice, re-answers the demo docs, pins the slice sha, keeps parity green | None (data, plus one reader fix) | Steps 0, 1a, 1b | `docs/maker/steps/step-03b-slice-r29.md` |
| — | 1 (with Step 1) | Demo extras basic-attack, line-shot and effect (ready, not frozen). In rev 30, `basic-attack.damage` becomes "= unit attack" (EA S1 Q5). Librarian: rev 30 lands before Step 2 and is small; 1b is not blocked (the fixture keeps damage at its default) | None | Step 1 | `behaviour-library/` rev 29 (rev 30 TBD) |

## Stage 2: minimal maker (Home, save/load, Test)
| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-01 | 2 · **AGREED · SHIPPED** (PR #79, merge `34fda674`; carries in 02b, PR #80, merge `fdf29002`) | **Step 2: Home, save and load** | Home with project cards (New, Open, ⋯ Rename, Duplicate, Delete), Save, autosave | Step 1 | `docs/maker/steps/step-02-home-save-load.md`, `MS-01-home-and-projects.md`, shots 01, 18, 24 |
| MS-01 | 3 · **AGREED · SHIPPED** (PR #81, merge `b8f2b480`) | **Step 3: Test opens the real play stage** | Test button. Validation errors in words (hard blocks), then the release play stage with `?project=<id>` | Steps 0 and 2 | `docs/maker/steps/step-03-test.md`, shots 39b, 68 |

## Stage 3: general engine systems, then cozy foundations (each with a basic maker editor)
**Engine-first order (CEO decision 2026-11-19 01:41, his words: "Yes, reorder engine-first"; order proposed by CoS).** The general systems every game needs come first (stage 3a), then the cozy features (stage 3b), then stealth (stage 4). Art upload moved here from stage 5. The engine effect path (step 10, split from the Effect Designer in r14) and the export MVP (step 11) are new; the full Effect Designer stays in stage 5 (step 33). Old step numbers are in each row as "(r13: N; r12: M)" and in the **Old-to-new step numbers** table after stage 5.

Every row ships the four parts named in JOINT-MAP r3: data, reader and validation, engine rule, and editor. Where a row would exceed 400 lines, it splits into "a: data + rule" and "b: editor". **In the gap between the two halves, nothing may use a hard-coded demo project**: the "a" half is tested through project data only. **The "b" editor half is the next go-line** after "a"; no other row goes between them. Cozy ids are shown in brackets.

Rows from step 11 on are **PROPOSED**. Don't build a PROPOSED row; ask CoS. The **internal checkpoints** below are for the team only; a public milestone is the CEO's call.

### Stage 3a: general engine systems
| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-03 | 4a, 4b, 4c · **AGREED · SHIPPED** (4a PR #83 `02efdd04`, 4b PR #85 `a85ae665`, 4c PR #86 `9bbd115a`) | Stage editor base: rooms and maps, tile painting (terrain) and placing units and neutrals | Stage editor with a **map/tile palette painter**. Placing uses the CEO-approved **tap-to-add** flow (tap tile, Add here sheet, then the What do they do? sheet), with every option wired before it ships | Step 3; 4b also needs 00b and 03b | `docs/maker/steps/step-04-stage-editor.md` (4a paint, 4b place, 4c stages and maps; its Go-line order). `ux/stage-grid-live-plan.md` is Rewrite and not a build instruction. `MS-03` TBD |
| — | after 4c · **internal checkpoint** | **Checkpoint (internal): a two-stage project made in the maker plays in Test.** Not a public milestone; that is the CEO's call | — | 4c | Outside reviews (GrokHeavy, Grok Build and Gemini), shared by the CEO and relayed by CoS, 2026-11-19 |
| MS-04 | 5 · **AGREED · SHIPPED** (5a PR #87 `b8c1084`, 5b PR #88 `c66760b`, 5c PR #89 `5a2c8e7`) (r13: 5; r12: 5) | Units and classes: unit-roster with the btf-warrior, archer, mage and cleric presets (hp and atk per unit). Generic Behaviour panel for setups | Unit/Class editor plus the Behaviour panel: the + Add ability browse by goal, the unit's ability list (Test and × per row), the ✦N badge on the stage, and the unit sheet (Edit, Move, Delete, Test) | 4; the Behaviour-panel headroom check (Risks) | `ux/screen-map.md` (unit-editor to use-preset), `behaviour-library/SCHEMA.md`, `docs/maker/shell-lessons.md` #2 |
| MS-04 | 6 · **AGREED · SHIPPED** (6a PR #90 `23b5755`, 6b PR #91 `be8ce82`, 6c PR #92 `be4f47e`, 6d PR #93 `aa2ef7e`) (r13: 6; r12: 6) | Levels and win rules: xp-levels, win-condition | **Level curve editor** (a thresholds list plus level-set pickers). **Rules panel** per stage | 5 | `behaviour-library/` rev 29 |
| — | after 6 · **internal checkpoint** (was after 5) | **Checkpoint (internal): a small tactics project (units with abilities, terrain, and a win rule) made fully in the maker plays in Test.** Moved after 6 because win rules land in step 6. **Baseline measurement:** on the S21 Ultra (mid) and the Red Magic 9 Pro (high), record frame time, allocations and GC. Reach and sight caches are added only if the measurement shows a tick repeating the work. Not a public milestone; that is the CEO's call | — | 6 | Outside reviews (GrokHeavy, Grok Build and Gemini), shared by the CEO and relayed by CoS, 2026-11-19; moved after 6 in CoS's engine-first proposal ("Steps 5 and 6 ... end at the small tactics checkpoint"), which the CEO approved 2026-11-19 01:41; baseline proposed by CoS, CEO-approved 2026-11-19 14:42 |
| MS-03 | 7 · **AGREED · SHIPPED** (PR #94, merge `24ab025`) (r13: 7; r12: 9) | Session and stage links: doors, stairs, gates and safe-point rollover (C3a, C3b). **Two-floor shop**: shop downstairs, home upstairs | Link placer on the stage editor (door, stairs, gate). **Risk guard:** a named test for the stage-link rebuild frame budget (one frame on the S21 Ultra; see Risks). **Measure** the stair/door rebuild plus first draw against the one-frame budget. Pre-warm the next stage only if it misses the budget and memory fits: adjacent stages only, discardable, never mutating the active sim. Needs no items and no time | 4 (4c: stages and maps) | JOINT-MAP #3, GDD "Pitch". **EA ruling (2026-11-18): two linked stages**, shop downstairs and home upstairs, joined by a stairs link through the world link (C3a/C3b). JOINT-MAP F1 makes stairs, shop door and gates one link type, and autosave-at-stairs (C8a) needs a link event. One map with a hidden floor would need storeys and roof hide (MS-05, `house-builder-renderer-needs.md` #1/#6/#7). Same-map roof hide stays for small single-storey houses later |
| MS-03 | 8 · **AGREED · SHIPPED** (8a PR #96 `a0c1dad2`, 8b PR #98 `42cc84b4`, 8c baseline walk draws units PR #100 `cd48ebdc`) (r13: 8; r12: 10) | Autosave at doors and stairs (C8a, part 1). Sleep is split out to step 14, because sleep rolls the day over and needs game time (step 13) | Autosave toggle on a link. **Measure** the stair/door rebuild plus first draw, with the autosave, against the one-frame budget; pre-warm only as in step 7. **Single point of failure:** the session save needs a migration test (see Risks). Needs no items and no time | 7, Step 2 | JOINT-MAP #4, GDD "Saves" |
| MS-20 | 9 · **AGREED · SHIPPED** (9a PR #99 `ab64d4fb`, 9b PR #101 `a1d01698`, 9c PR #102 `9088feb2`) (r13: 10; r12: 30) · no longer held for P1-9: the CEO moved the APK work to step 11 (2026-11-24 18:03, via CoS) | Art and backgrounds upload, split per the 400-line rule above: **9a** data, checks and Test drawing of backgrounds (guide `docs/maker/steps/step-09-art-backgrounds.md`); **9b** the upload editor (guide `steps/step-09b-art-upload.md`); **9c** a marker on every stage link cell (guide `steps/step-09c-link-markers.md`) | Art upload flow (9b) | 4 (MS-03) | `ux/art-upload.md` moved to the private repo on 2026-11-19 (stub on main); the public guide cites only `data/project-format.md` §6.2 and §6.4 |
| MS-07 | 10 · **AGREED · SHIPPED** (CEO go 2026-11-25 12:57 London, via CoS) · four parts, all merged: **10a carries** (PR #103, `c3e056ff`; guide `steps/step-10a-carries.md`), **10b effect data** (reader slot, rows, play path; PR #104, `10ab12d6`; guide `steps/step-10b-effect-data.md`), **10c effect editor** (the Effect row, effect Duplicate; PR #105, `699bdb83`; guide `steps/step-10c-effect-editor.md`) and **10d built-in effects** (the 10 BTF presets in the Effect row, played in Test; PR #106, `a8f2e2fd`; guide `steps/step-10d-builtin-effects.md`) (new: split from r13 11 / r12 29) | **Engine effect path:** an attack or spell plays an engine effect saved in the project. A basic picker (`"none"`, a built-in, or a saved effect) and the effect behaviour's own knobs, through the Behaviour panel. **No** layers, beats, merge, breed or power-up tiers (those are step 33), and the ui-shell mock is never wired in. **Reuse on main:** the effect document is a `behaviour-setup` v3 of `effect` in `effects/<id>.json` (setup-format §2.10, line 437; project-format §2 layout line 294 and §6.7 line 1144); `readEffect` reads it (`src/project/read/effect.ts` lines 34–36, `EffectDoc` line 4); the player is `createPlayFx` (`tools/play-stage/fx.ts` lines 39–51) on `createCastFx` / `cueFromEntry` (`src/runtime/scene/cast-fx.ts` lines 38 and 18), with values typed `FxDocValues` (`src/runtime/render/fx-doc.ts` line 6); test F17 (`tests/tools/play-stage-p18.test.ts` line 36) shows a saved effect doc driving the match. `src/editor/effect/save.ts` (`SAVE` line 3, `blankEffect` line 14) writes the document. **Gap (before 10b; closed by 10b–10d):** `readProject` doesn't know `effects/` (`knownKind`, `src/project/load/types.ts` lines 25–30), so an effect file loads as `unknownFile` (`read-project.ts` line 85); `playDocsOf` hard-codes `effectRef: "line-shot"` (`tools/play-stage/project.ts` line 43) and never passes `effects`, so `board.ts` line 76 gets only the two stock effects (`fx.ts` lines 8–15); and the id rule differs: project-format §6.7 line 1145 says `effect_<ULID>`, `save.ts` line 3 says `setup_<ULID>` (DSK to settle). The play stage can't import `src/editor/` (the build refuses `editor` paths), so the maker writes the doc and the play stage reads it only through `readEffect` | An **Effect** row on each ability in the Behaviour panel: pick none, a built-in, or a saved effect, plus the basic knobs | 5 (abilities must exist), Step 2 | setup-format §2.10, project-format §6.7, `shell-lessons.md` #7; split by CoS (outside feedback on the engine-first order (GrokHeavy, ChatGPT, Gemini, Grok Build), shared by the CEO; changes proposed by CoS. These are proposals, not CEO rulings) |
| MS-08 | 11 · PROPOSED (r13: 9; r12: new) · split: **11a export MVP** (guide `steps/step-11a-export-mvp.md`), **11a2 ready sheet** (guide `steps/step-11a2-ready-sheet.md`, after 11a merges), **11b debug APK** (guide `steps/step-11b-debug-apk.md`, after 11a2 merges) and **11c budgets and phone-like Test** (guide TBD; waits on rulings) | **Build game, export MVP:** exports a tactics project as a playable static web build, and (CEO 2026-11-24 18:03 London, via CoS: "Since step 11 is an export section. Can add the apk stuff there top [sic: too]") as a debug APK to sideload. **It is a restricted run of the same pipeline the full export (step 36) uses**: the play tree from `tools/play-stage/build.ts` `build()` and the checks in `tools/apk/build.ts` (play-only `FORBIDDEN`, offline `networkUrls`, debug globals). **Not a second build system.** **11a:** Build game saves, runs Test's gate, and downloads one zip: the play tree, the saved project as one module (`project/files.js`), its pictures, and a `build.json`; it never carries `.tmp` files, any `.deleted/` trash folder (such as `effects/.deleted/`), `notes/` or `sprite-recipes/` (DSK E5(a), `20c8ce84`). **11b:** the P1-9 Capacitor 6 wrapper turns that zip (or the demo) into one debug-signed APK (the SDK's debug key, never in the repo); CoS builds the CEO's copy on the box and shares it privately on his SEND. **Excluded:** release signing, store upload, device save (37), the §7.2 closure (36). **Vertical-slice acceptance test:** make a small tactics project in the maker, save it, Build game, open that build outside the maker (the web build, then the APK on the CEO's phones), and play it to a win. **11c, budgets and a phone-like Test (CEO-approved 2026-11-19 14:42):** the maker shows unit, active-AI, effect and stage-size budgets, each with a hard limit and a warning, plus a phone-like Test with auto-lite and a frame-time overlay. The early export uses the same caps as the full export. Auto-lite drops decorative effects before sim quality | One **Build game** button on the project screen, after the stages (11a): `Building…` while it works; then a **Your game is ready** sheet, or **Couldn't build your game** with Try again (11a2; look ruled by UX 2026-11-26). Until 11a2 merges, 11a shows build errors in the existing project banner; no maker UI for the APK (11b is a box build). App name and icon per game come later (UX ruling to follow); 11b uses a fixed TileEngine name and icon; no maker UI for the APK (11b is a box build) | 6, Step 3; after 9 and 10 so the project's art and effects travel in the build; 11a2 after 11a; 11b after 11a2 | Proposed by CoS in the engine-first order the CEO approved 2026-11-19 01:41; moved to the end of the early block and scoped by CoS in r14; APK added by the CEO 2026-11-24 18:03; split 11a/11b/11c by the Engine Architect 2026-11-26, and 11a2 split out of 11a by the EA 2026-11-26 (the 400 gate holds) (outside feedback on the engine-first order (GrokHeavy, ChatGPT, Gemini, Grok Build), shared by the CEO; changes proposed by CoS. These are proposals, not CEO rulings) |
| — | after 11 · **internal checkpoint** (r13: after 9) | **Checkpoint (internal): the tactics project, exported with step 11, plays as a web build outside the maker, to a win** (the step 11 acceptance test). Not a public milestone; that is the CEO's call | — | 11 | Proposed by CoS in the engine-first order the CEO approved 2026-11-19 01:41; moved in r14 |

### Stage 3b: cozy foundations
| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-09 | 12 · PROPOSED (r13: 12; r12: 7) | Items, stacks, loot (35a) | Items list plus loot table form | 4 | `docs/cozy/JOINT-MAP.md` #1 |
| MS-10 | 13 · PROPOSED (r13: 13; r12: 8) | Game time, day/night, timers (C1a) | Time settings form (with a night preview from 0 to 1) | 4 | JOINT-MAP #2. `ux/weather-time-backlog.md` is an IDEA only |
| MS-03 | 14 · PROPOSED (r13: 14; r12: 10 (split)) | Autosave at sleep (C8a, part 2): a bed prop whose sleep autosaves and rolls the day over | Bed prop in the palette, plus its autosave toggle | 8, 13 | JOINT-MAP #4 (bed object `sleep`), GDD "Saves"; split proposed by UX in r13 (sleep rolls the day, so it needs time); a proposal, not a CEO ruling |
| MS-11 | 15 · PROPOSED (r13: 15; r12: 11) | Gather and respawn (35b). tool-swing (gather) goes from IDEA to PROPOSED in the Librarian pass before 35b, since 35b uses its bindings (CN-027 shape); CN-027 is accepted as a format, with no code yet | Place a node, plus a respawn field | 12 | JOINT-MAP #5, `behaviour-library/CATALOGUE.md` tool-swing |
| MS-11 | 16 · PROPOSED (r13: 16; r12: 12) | Planting with a night boost (C2a) | Crops list | 12, 13 | JOINT-MAP #6 |
| MS-12 | 17 · PROPOSED (r13: 17; r12: 13) | Alchemy recipes and tiers (C2b) | Recipes list | 12 | JOINT-MAP #7 |
| MS-13 | 18 · PROPOSED (r13: 18; r12: 14) | NPC shops and the player counter (35c). talk is ready. npc-role (vendor) is an IDEA and is promoted in the Librarian pass before 35c. 35c is vendor only | Shop stock form on a selected NPC. Talk panel gets a Shop slot (MS-00 §Talk) | 5, 12 | JOINT-MAP #8, `ux/npc-buildings-backlog.md` |
| — | — · PROPOSED | **Checkpoint: the first loop (shop, plant, craft, sell) plays from project data** | — | 12–18 | JOINT-MAP |
| MS-14 | 19 · PROPOSED (r13: 19; r12: 15) | Quests: deadline, tier, optional run (35d) | Quest board editor | 12, 18 | JOINT-MAP #9 |
| MS-15 | 20 · PROPOSED (r13: 20; r12: 16) | NPC walk, queue, schedules and visits (C4a, C4b). neutral-roamer's rev 29 knobs are BTF's portal monster (hp, atk, act, prey, needs_all, kill xp). For C4a the Librarian adds walk knobs: walk mode (wander/route/to-target), tiles per turn, home tile and leash radius, promoted in the pass just before C4a. npc-role visitor and schedule are promoted together for C4b | Schedule form on a selected NPC, plus the Behaviour panel | 18 | JOINT-MAP #10. Knob set confirmed by the Librarian (2026-11-19) |
| MS-16 | 21 · PROPOSED (r13: 21; r12: 17) | Guild resolve, reputation and the results panel (C5a, C5b) | Guild odds form | 19 | JOINT-MAP #11 |
| MS-10 | 22 · PROPOSED (r13: 22; r12: 18) | Offline closed form with an 8 h cap (C1b) | One field in Time settings | 13 | JOINT-MAP #12 |
| MS-17 | 23 · PROPOSED (r13: 23; r12: 19) | Skill tree, gear and decor (C7a–c) | Tree node list. Decor uses the stage palette | 12 | JOINT-MAP #13 |
| MS-07 | with any row · PROPOSED | effect (ready) is used by cozy rows (Librarian) | Effect Designer: on main only as a ui-shell mock (`ui-shell/mock-effects-v3/`) and as a standalone dev page from the ED-E steps (`tools/effect-designer/`, `src/editor/effect/`), never in the maker. The maker gets the engine effect path at step 10 and the full designer at step 33; don't wire in the mock | — | `ux/effect-designer-v3-ux.md` |

## Stage 4: turn-based stealth
This follows BTF you-go-I-go turns:
- After the player's turn, each enemy moves one tile toward its objective tile.
- If the player is caught, they flee and lose some of the loot they carry.
- The game autosaves at doors, stairs and sleep.
- Quitting mid-stealth restarts the stage.

| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-18 | 24 · PROPOSED (r13: 24; r12: 20) | Sight and noise, with parity tests (C6a). Ready: cone-sweep shape plus `wall_blocks_los`. Noise is a plain stealth setting in `src/rules/stealth`, not a behaviour (Librarian 2026-11-19); a per-unit 'noisy' behaviour comes later only if a game needs it | Stealth settings in the Behaviour panel | 4, 5 | JOINT-MAP #14, `behaviour-library/` rev 29 |
| MS-18 | 25 · PROPOSED (r13: 25; r12: 21) | Objective-tile walkers (C6b). **objective-walker is NOT in the catalogue yet**. The Librarian mines it in the pass before C6b (slice 14), any time after rev 30. It shares one objective-tile path with objective-contest: tagged objective points on the stage (guard posts, flask tiles), with the data shape owned by DSK. Being caught means fleeing and losing loot (`stealth.lossPct`, a plain stage/project stealth rule shown in the Rules panel, not a behaviour; Librarian 2026-11-19) | Guard placer plus **objective/patrol tile placer**, shared with objective-contest (flasks) | 24, 12 | JOINT-MAP #15, GDD "Stealth" |
| MS-18 | 26 · PROPOSED (r13: 26; r12: 22) | Cone and meter render (C6c). reveal-intent (ready) shows the guard's next tile. stun-hold is optional | Preview toggle in Test (TBD) | 25 | JOINT-MAP #16 |
| MS-18 | 27 · PROPOSED (r13: 27; r12: 23) | Saves in stealth: autosave at links and sleep, and quitting mid-stealth restarts the stage | Uses the step 8 and step 14 autosave toggles. No new screen (TBD) | 8, 14, 25 | GDD "Saves" |
| — | 28 · PROPOSED (r13: 28; r12: 24) | The four stealth stages as project data. Themes are *Proposed* (forest edge, deep wood, cave, ruins) | Built with the stage editor | 24–27 | JOINT-MAP #17, GDD "World" |

## Stage 5: the rest of the maker
| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-02 | 29 · PROPOSED (r13: 29; r12: 25) | New project wizard, trimmed to what the format supports | Wizard | Step 1, MS-03/04 | `ux/new-project-wizard.md` (to rewrite) |
| MS-19 | 30 · PROPOSED (r13: 30; r12: 26) | Welcome quiz and starter presets | Quiz cards plus Skip | MS-02 | `ux/welcome-quiz-plan.md` (to rewrite) |
| MS-05 | 31 · PROPOSED (r13: 31; r12: 27) | House builder: roof hide, wall cutaway, storeys, builder overlays | House builder tool | MS-03 | `ux/house-builder-renderer-needs.md` (items 1, 6, 7, 8 are "own step later") |
| MS-06 | 32 · PROPOSED (r13: 32; r12: 28) | Sprite Studio (tidy). Keep (CEO #6). Must include working import into the stage/game preview, Start new, an **Invert** left/right button for Make walk, and Tidy polish (CEO); the proposed UX answer adds a Tidy before/after plus Keep original | Sprite Studio | Step 2 | `ux/pixel-editor-plan.md`, `shell-lessons.md` #6 |
| MS-07 | 33 · PROPOSED (r13: 11; r12: 29) | Effect Designer, full tidy (v3 layers, beats and merge). Keep (CEO #7): breed and the power-up tiers carry forward. Builds on the step 10 engine effect path; the ui-shell mock is never wired in | Effect Designer | 10 (engine effect path), 5, Step 2 | `ux/effect-designer-v3-ux.md`, `design-notes/effect-designer-v3.md`, `shell-lessons.md` #7 |
| MS-21 | 34 · PROPOSED (r13: 33; r12: 31) | Sound Studio / panel. Keep the base foundation (CEO #5). It needs iteration rounds like Sprite Studio and the Effect Designer before it ships | Sound panel | TBD (local draft docs/audio-module.md, not on main) | `ux/sound-panel.md`, `shell-lessons.md` #5 |
| MS-22 | 35 · PROPOSED (r13: 34; r12: 31a) | Game UI kit: HUD layout presets (Orbs, Portrait plates, Tactics corner, Minimal), dressed from the project palette (framed portraits, liquid orbs with shine and a drain trail, bevelled ability slots with cooldown sweep, ornate 9-slice). Styles games only; the editor stays on style-spec | HUD picker: one layout pick plus one look pick (Basic), parts in Advanced. The play and preview show the game HUD | MS-06, MS-07, the play stage HUD | `shell-lessons.md` #4, `design-notes/ai-sprites-and-ui-research.md`. MS-22 doc TBD |
| MS-08 | 36 · PROPOSED (r13: 35; r12: 32) | Build game (full export: store, signing, everything the MVP left out). Builds on the step 11 export MVP, the same pipeline | Build game screen | 11 (export MVP), stages 1–4 | TBD (no MS doc yet) |
| MS-08 | 37 · PROPOSED (r13: 36; r12: 33) | Device-local save in exported games (C8c) | None (export option, TBD) | 36 | JOINT-MAP "After stage 4" |
| — | 38 · PROPOSED (r13: 37; r12: 34) | Cozy template project: one day plus one stealth stage, then stages 2–4 (C8b), after Build game and the E7 phone OK | Shown as a New-project template | 36 | JOINT-MAP "After stage 4" |

## Old-to-new step numbers (r12, r13, r14)
Use this table to read an older doc that cites a roadmap step by its r12 or r13 number. The **Depends on** cells above use the r14 numbers.

| r12 | r13 | r14 | Note |
|---|---|---|---|
| 0–4c, 00b, 03b | same | same | AGREED, unchanged |
| 5 | 5 | 5 |  |
| 6 | 6 | 6 |  |
| checkpoint after 5 | checkpoint after 6 | checkpoint after 6 | win rules land in 6 |
| 9 | 7 | 7 | session and stage links |
| 10 | 8 and 14 | 8 and 14 | split: doors and stairs (8); sleep and the bed prop (14) |
| 30 | 10 | 9 | art and backgrounds upload |
| 29 | 11 | 10 and 33 | split in r14: engine effect path (10); full Effect Designer tidy (33, stage 5) |
| — (new) | 9 | 11 | export MVP; its checkpoint moves to after 11 |
| 7 | 12 | 12 |  |
| 8 | 13 | 13 |  |
| 11 | 15 | 15 |  |
| 12 | 16 | 16 |  |
| 13 | 17 | 17 |  |
| 14 | 18 | 18 |  |
| first-loop checkpoint (after 7–14) | after 12–18 | after 12–18 |  |
| 15 | 19 | 19 |  |
| 16 | 20 | 20 |  |
| 17 | 21 | 21 |  |
| 18 | 22 | 22 |  |
| 19 | 23 | 23 |  |
| 20 | 24 | 24 |  |
| 21 | 25 | 25 |  |
| 22 | 26 | 26 |  |
| 23 | 27 | 27 |  |
| 24 | 28 | 28 |  |
| 25 | 29 | 29 |  |
| 26 | 30 | 30 |  |
| 27 | 31 | 31 |  |
| 28 | 32 | 32 |  |
| 31 | 33 | 34 | sound |
| 31a | 34 | 35 | UI kit |
| 32 | 35 | 36 | full export |
| 33 | 36 | 37 | device save |
| 34 | 37 | 38 | cozy template |

## Risks
Source: Outside reviews (GrokHeavy, Grok Build and Gemini), shared by the CEO and relayed by CoS, 2026-11-19. Each guard is written into the named step's guide when that step is drafted.

| Risk | Guard | Where | Owner |
|---|---|---|---|
| The stage-link rebuild (changing stage through a door or stairs) stutters on a phone | A **phone frame budget**: the rebuild fits in one frame on the S21 Ultra, checked by a named test in the stage-link step | Step 7 (was 9) | Step 7's guide author and builder; CoS runs the phone check |
| Session save is a **single point of failure**: a bad save or format change loses a player's game | A **migration test**: a save written by the previous format version loads after the change; flagged as a single point of failure in the guide | Steps 8 and 14 (autosave, C8a; were 10) | Their guide authors; DSK for the format |
| The generic Behaviour panel can't hold the ~50 BTF combat behaviours (post-launch) | A **headroom check** before step 5: the panel's layout, browse-by-goal and menu-order data can take the full catalogue without a redesign | Before step 5 | EA and DSK |

## Behaviour editors (Librarian)
| Behaviour / system | Editor | MS | Stage |
|---|---|---|---|
| effect | Effect Designer. On main only as a ui-shell mock (`ui-shell/mock-effects-v3/`) and as a standalone dev page from the ED-E steps (`tools/effect-designer/`, `src/editor/effect/`), never in the maker. The maker gets the engine effect path at step 10 and the full designer at step 33; don't wire in the mock | MS-07 | 3 (use; engine effect path, step 10), 5 (full designer, step 33) |
| terrain | Map/tile palette painter | MS-03 | 3 |
| unit-roster plus class presets (btf-warrior, archer, mage, cleric) | Unit/Class editor (hp and atk per unit) | MS-04 | 3 |
| xp-levels | Level curve editor (a thresholds list plus level-set pickers) | MS-04 | 3 |
| win-condition | Rules panel per stage | MS-04 | 3 |
| objective-contest (flasks) and stealth patrol points | Objective tile placer on the map (shared tool) | MS-18 | 4 |
| hand-and-draw | Deck editor (later) | TBD | Post-launch: **POST-LAUNCH, DO NOT BUILD** |
| Everything else | Generic Behaviour panel, shown as abilities (browse by goal with tile diagrams, menu order, bans greyed out, reset to default, wired only, a real Test per ability) | MS-04 | 3 on |

## Post-launch: POST-LAUNCH, DO NOT BUILD
No row in this table is a build instruction. Each row is marked **POST-LAUNCH, DO NOT BUILD**.

| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| TBD | **POST-LAUNCH, DO NOT BUILD** | About 50 BTF combat behaviours (line, radial, sky-drop, bounce, barriers, summons, sword-lifecycle, hand-and-draw and others). They are catalogued but have no engine code: a content layer, filled in as games need them | Behaviour panel. Deck editor for hand-and-draw | Engine code per behaviour | `behaviour-library/CATALOGUE.md`, `coverage.md` |
| TBD | **POST-LAUNCH, DO NOT BUILD** | Unit "When it dies" (BTF orbs) | TBD | BTF behaviours | `ux/on-death-backlog.md` (IDEA) |
| TBD | **POST-LAUNCH, DO NOT BUILD** | 'UI export with purpose' (CEO 2026-11-13): save just the UI as Personal use, Own game or AI-made game (browser, PC, mobile); PNGs plus a 9-slice sheet, engine exports (Godot, Unity, Phaser, HTML/CSS), and an AI guide plus prompt (Grok Build first) | Export sheet in the UI kit | MS-22 | Not yet documented (plan needed later) |
| TBD | **POST-LAUNCH, DO NOT BUILD** | Weather and animated world (rivers, trees) | TBD | MS-10 | `ux/weather-time-backlog.md`, `design-notes/animated-world.md` |
| TBD | **POST-LAUNCH, DO NOT BUILD** | Social hub, studio profile and achievements, coins, library and chart. Keep the tested hub layout and flows (`shell-lessons.md` #3) | Hub tabs: Shop, Games, Creators, Requests | Online layer | `ux/social-hub-plan.md`, `profile-achievements.md`, `coins-library-chart.md` |
| TBD | **POST-LAUNCH, DO NOT BUILD** | Starter Pack v2 (free hub pack) | Hub listing | Asset hub | `ux/starter-pack-v2-plan.md` |
| TBD | **POST-LAUNCH, DO NOT BUILD** | Sprite generator from keeps, and the Imagine-to-pixel converter | Inside Sprite Studio | MS-06 | `ux/gen-learn-plan.md` (on hold), `converter-quality-study.md` |
| TBD | **POST-LAUNCH, DO NOT BUILD** | Online-play step (server-authoritative, with the 5 MUST items) | TBD | Online layer | `docs/chaos-player-outline.md` §10 |

## CEO decisions with no repo doc yet (plan needed later)
TileEngine is **not open source**.

| Decision | When | Status |
|---|---|---|
| Publish the engine app (editor plus game export) on Google Play and the App Store. The step 11b debug APK (on the P1-9 wrapper) is game-only and sideloaded | After step 11b | Plan needed later |
| AI extension kit plus connector (Roblox Studio-style): a user's AI adds NPCs, behaviours, stages and effects through our tools. Work is saved via our servers under HS Studio creator terms. Test with Grok 4.8 | TBD | Plan needed later |
| Accessibility, prompted by a blind dev's audio-only games. `design-notes/editor-behaviours.md` (ARIA, reference only) is a starting point | Before launch | Plan needed later |
| Translator and literature helpers | TBD | Plan needed later |
| Paid asset store (e.g. a BTF combat sprite pack). Gold coins are earn-only, with no coins for visiting store pages, per Apple guideline 3.2.2 and Google Play rules | TBD | Plan needed later |
| Optional online layer on the CEO's Fly.io: accounts, cloud saves, asset hub. The core stays offline-first | TBD | Plan needed later |
| Two chaos players: game-side, and dev-side security and exploit testing. The engine outline exists in `docs/chaos-player-outline.md` §9 and `docs/qa/chaos-player-invariants.md`; the maker/product plan does not | Dev-side slice starts once the first save, import and reward events exist (§9) | Plan needed later |

## Audit of existing plans
Verdicts:
- **Keep:** still good.
- **Rewrite:** rewrite for the new maker (tools/maker, engine-native, style-spec only).
- **Drop:** retire or archive it.

Paths are under `docs/maker/ux/` on main unless the row says otherwise.

| Doc | Verdict | Reason |
|---|---|---|
| `art-upload.md` (r6) | Rewrite | The flow and CEO rulings hold, but it is built on `ui-shell/mock-art` and `app.css`. It becomes MS-20 |
| `coins-library-chart.md` | Keep: still good (CEO #3, #4) | The hub's Recommended pick and the thumbs-up chart passed the CEO's test (`shell-lessons.md` #3, #4). Recheck it against the earn-only coin rule (Apple 3.2.2) before use |
| `converter-quality-study.md` | Keep (post-launch) | A study only. The findings stay valid for a later Sprite Studio import |
| `effect-designer-v3-ux.md` | Keep | Current UX input for the Effect Designer (MS-07). CEO: "the iterations were really good" (#7) |
| `effect-designer.md` (r3) | Drop | Superseded by v3 and the ED-E steps, and built on `ui-shell/mock-effects` |
| `effects-sprite-sync.md` | Keep | Research base for engine-build step 33 effects (old engine numbering, not roadmap step 33). It's engine-side and still valid |
| `effects-v2-plan.md` | Keep | Scope accepted. Its data (setup-format r20 §2.10.2) is engine-native |
| `game-settings-template.md` | Rewrite | A useful BTF in-game settings default. It needs an engine-native screen and current format refs |
| `gen-learn-plan.md` | Keep (on hold) | Plan only, with a CEO hold (G8). Post-launch |
| `home-globe-plan.md` | Rewrite | The r71 globe carousel is a ui-shell build. Fold it into a later MS-01 revision, with style-spec tokens only |
| `house-builder-renderer-needs.md` | Keep | Renderer needs confirmed by the EA. It feeds MS-05 and the two-floor shop ruling (two linked stages) |
| `ideas-backlog-2026-11-11.md` | Keep | Principles (Basic + Advanced on the same data) still apply. The ideas stay parked |
| `new-project-wizard.md` | Rewrite | First draft against the ui-shell. Trim it to what the Step 1 format supports (MS-02). No redesign was found (CoS asked) |
| `npc-buildings-backlog.md` | Rewrite | Fold it into MS-13 and MS-15 with npc-role and neutral-roamer from the catalogue |
| `on-death-backlog.md` | Keep (post-launch) | IDEA, not v1 |
| `pixel-editor-plan.md` | Rewrite (design kept) | The CEO calls it great and easy to use (#6). The plan is ui-shell based, so it becomes MS-06 engine-native, with the #6 fixes |
| `profile-achievements.md` | Keep (post-launch) | Short draft aligned with profile-format. It needs the online layer first |
| `qol-plan-r69.md` | Rewrite | The behaviour picker and stage-type ideas carry into MS-04 and MS-03. The rest is shell QoL |
| `r72-cleanup-plan.md` (ui-shell lessons, summarised in `docs/maker/shell-lessons.md`) | Keep (as lessons) | Its lessons become rules for the new maker: no silent save failures, check uploads, one voice, even empty and error states, no XSS. Not a build plan |
| `renderer-research-ux.md` | Keep | Research only, and still valid for the play stage and previews |
| `screen-map.md` | Rewrite | The screen list and behaviour flow are the outline for MS-03 and MS-04. It still cites the ui-shell and catalogue rev 5 |
| `social-hub-plan.md` | Keep: still good (CEO #3) | Accepted on 2026-11-12. The CEO found nothing to change (2026-11-18, `shell-lessons.md` #3). Keep the layout and flows; build engine-native once the data and online layer exist |
| `sound-panel.md` | Rewrite (design kept) | The CEO is happy with the base foundation (#5). It's a draft tied to the shell, and its companion `audio-authoring.md` is missing. It becomes MS-21 after more iteration |
| `stage-grid-live-plan.md` (r65) | Rewrite | The live grid and tap-to-place ideas stay, along with the DSK and EA answers. It becomes MS-03, engine-native |
| `starter-pack-contents.md` | Rewrite | The v1 contents list is superseded by v2's art decision (CEO Grok Imagine art) |
| `starter-pack-v2-plan.md` | Keep (post-launch) | Accepted on 2026-11-12. The hub pack waits for the asset hub |
| `validator-todo.md` | Keep | H1–H6 hard errors feed Step 1 validation and Step 3 hard blocks (shot 39b) |
| `weather-time-backlog.md` | Keep (IDEA) | Day/night moves to C1a (MS-10). Weather stays post-launch |
| `welcome-quiz-plan.md` | Rewrite | The r64 quiz on the ui-shell. It becomes MS-19 after MS-02. No redesign was found |
| `design-notes/README.md` | Keep | Standing order to write design notes |
| `design-notes/ai-sprites-and-ui-research.md` | Keep | Research for Sprite Studio and the game UI kit (MS-22) |
| `design-notes/animated-world.md` | Keep (post-launch) | No build until after H2 |
| `design-notes/editor-behaviours.md` | Keep | Reference only, with no dependency. It is a seed for accessibility |
| `design-notes/effect-designer-v3.md` | Keep | The v3 mock record for MS-07 |
| `design-notes/effects-v2.md` | Keep | Short summary of the accepted Effects v2 |
| `design-notes/home-globe.md` | Rewrite | Goes with home-globe-plan |
| `design-notes/pixel-composer-reference.md` | Keep | Standing approach: borrow proven ideas, no node editor |
| `design-notes/shell-and-look.md` | Rewrite | Its look rules now live in `style-spec.md`. Keep only the rules the style-spec doesn't cover |
| `design-notes/sprites.md` | Keep (parked) | Generator parked at v7 |
| `design-notes/turn-banner.md` | Keep | Style goal for the play stage banner |
| `ux/design-notes/effect-ramps.md` plus `effect-ramps/` (local, not on main) | Keep | ED S0 colour stops. Held local by CoS (2026-11-18), outside this push; decide later |
| `ux/design-notes/held-item-motions.md` (local, not on main) | Keep | A sketch for tool-swing (MS-11). Held local by CoS (2026-11-18), outside this push; decide later |
| `ux/design-notes/refs/` (repo root, on main; 6 files under `ai-sprites-ui/`) | Keep | Reference images only |
| `ux/effects-v2-ref/`, `ux/ref-btf-acolyte-orbs.jpg` (local, not on main) | Keep | Reference images only. Held local by CoS (2026-11-18), outside this push; decide later |
| `ui-shell/README.md` (local, not on main) | Keep (reference) | Describes the prototype. It is reference only and never merged |
| `behaviour-library/behaviours.json`, `SCHEMA.md` (box only, not on main) | Keep | Source of truth for knob schemas. The maker reads these |
| `behaviour-library/CATALOGUE.md`, `README.md` (box only, not on main) | Keep | Generated |
| `behaviour-library/coverage.md` (box only, not on main) | Keep | BTF provenance |
| `behaviour-library/gaps.md` (box only, not on main) | Keep, plus an index | Good, but long (804 lines). It needs an open-items index |
| `behaviour-library/_audit/f8a451f5-audit.md` (box only, not on main) | Rewrite | Stale: written against an old main. Redo it against current main |
| `behaviour-library/_audit/phase1-freeze.md` (box only, not on main) | Rewrite | Partly superseded (the CEO superseded phase1-recut at 01:31). Rewrite it as a per-stage behaviour list |
| Menu question order data (catalogue) | Keep the data, rewrite the screens | Re-map its screens from the ui-shell to the engine-native maker |
