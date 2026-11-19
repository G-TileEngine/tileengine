# TileEngine maker roadmap

r12, 2026-11-19 (r12: CoS's list from the outside reviews by GrokHeavy, Grok Build and Gemini, shared by the CEO and relayed by CoS: status as of main `0ea3c16e`; S1b merged; rows for 00b and 03b; steps 0 to 4c AGREED; TBD, PROPOSED and precedence rules; the greyed-Test exception is the only one; Effect Designer status corrected; post-launch marked DO NOT BUILD; internal checkpoints; risk rows; the cozy-split rule. r11: Behaviour Librarian answers to the six open items, 2026-11-19; r10: rule 2 names the greyed-Test exception, to match the step guides; r9: QA fixes plus CEO feedback #1 to #7, HUD kit row), Editor & UX Designer (CEO ask 22:17 via Chief Of Staff). Behaviours, NPC and BTF rows come from the Behaviour Librarian (input 2026-11-18). Docs only: no code, nothing pushed or published. QA reviews this file, then CoS pushes it.

**Status as of main `0ea3c16e`** (`0ea3c16 docs(maker): step 00b sides from data`, 2026-11-19). Shipped: step 0 (PR #76), S1a (PR #77) and S1b (PR #78, merge `57af7135`). In build: step 2. AGREED and build-ready, with QA-OK guides on main: steps 00b, 3, 03b, 4a, 4b and 4c. Everything after 4c is PROPOSED.

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
| — | 00b · **AGREED · build-ready** (go-line after 4a, before 4b) | **Step 00b (S0b, TP-4): sides from data.** The play stage builds its sides from `stage.sides` instead of the hard-coded `SIDES` (`tools/play-stage/match.ts` line 15), free roam when only one side is present, and colour by side | None (play stage only) | Steps 0, 1a, 1b | `docs/maker/steps/step-00b-sides-from-data.md` |
| — | 03b · **AGREED · build-ready** | **Step 03b: the real rev 29 slice in the demo (D18).** Swaps in the regenerated slice, re-answers the demo docs, pins the slice sha, keeps parity green | None (data, plus one reader fix) | Steps 0, 1a, 1b | `docs/maker/steps/step-03b-slice-r29.md` |
| — | 1 (with Step 1) | Demo extras basic-attack, line-shot and effect (ready, not frozen). In rev 30, `basic-attack.damage` becomes "= unit attack" (EA S1 Q5). Librarian: rev 30 lands before Step 2 and is small; 1b is not blocked (the fixture keeps damage at its default) | None | Step 1 | `behaviour-library/` rev 29 (rev 30 TBD) |

## Stage 2: minimal maker (Home, save/load, Test)
| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-01 | 2 · **AGREED · in build** | **Step 2: Home, save and load** | Home with project cards (New, Open, ⋯ Rename, Duplicate, Delete), Save, autosave | Step 1 | `docs/maker/steps/step-02-home-save-load.md`, `MS-01-home-and-projects.md`, shots 01, 18, 24 |
| MS-01 | 3 · **AGREED · build-ready** | **Step 3: Test opens the real play stage** | Test button. Validation errors in words (hard blocks), then the release play stage with `?project=<id>` | Steps 0 and 2 | `docs/maker/steps/step-03-test.md`, shots 39b, 68 |

## Stage 3: cozy foundations (each with a basic maker editor)
Every row ships the four parts named in JOINT-MAP r3: data, reader and validation, engine rule, and editor. Where a row would exceed 400 lines, it splits into "a: data + rule" and "b: editor". **In the gap between the two halves, nothing may use a hard-coded demo project**: the "a" half is tested through project data only. **The "b" editor half is the next go-line** after "a"; no other row goes between them. Cozy ids are shown in brackets.

Rows from step 5 on are **PROPOSED**. Don't build a PROPOSED row; ask CoS. The two **internal checkpoints** below are for the team only; a public milestone is the CEO's call.

| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-03 | 4a, 4b, 4c · **AGREED · build-ready** | Stage editor base: rooms and maps, tile painting (terrain) and placing units and neutrals | Stage editor with a **map/tile palette painter**. Placing uses the CEO-approved **tap-to-add** flow (tap tile, Add here sheet, then the What do they do? sheet), with every option wired before it ships | Step 3; 4b also needs 00b and 03b | `docs/maker/steps/step-04-stage-editor.md` (4a paint, 4b place, 4c stages and maps; its Go-line order). `ux/stage-grid-live-plan.md` is Rewrite and not a build instruction. `MS-03` TBD |
| — | after 4c · **internal checkpoint** | **Checkpoint (internal): a two-stage project made in the maker plays in Test.** Not a public milestone; that is the CEO's call | — | 4c | Outside reviews (GrokHeavy, Grok Build and Gemini), shared by the CEO and relayed by CoS, 2026-11-19 |
| MS-04 | 5 · PROPOSED | Units and classes: unit-roster with the btf-warrior, archer, mage and cleric presets (hp and atk per unit). Generic Behaviour panel for setups | Unit/Class editor plus the Behaviour panel: the + Add ability browse by goal, the unit's ability list (Test and × per row), the ✦N badge on the stage, and the unit sheet (Edit, Move, Delete, Test) | 4; the Behaviour-panel headroom check (Risks) | `ux/screen-map.md` (unit-editor to use-preset), `behaviour-library/SCHEMA.md`, `docs/maker/shell-lessons.md` #2 |
| — | after 5 · **internal checkpoint** | **Checkpoint (internal): a small tactics project (units, terrain, a win rule) made fully in the maker plays in Test.** Not a public milestone; that is the CEO's call | — | 5 | Outside reviews (GrokHeavy, Grok Build and Gemini), shared by the CEO and relayed by CoS, 2026-11-19 |
| MS-04 | 6 · PROPOSED | Levels and win rules: xp-levels, win-condition | **Level curve editor** (a thresholds list plus level-set pickers). **Rules panel** per stage | 5 | `behaviour-library/` rev 29 |
| MS-09 | 7 · PROPOSED | Items, stacks, loot (35a) | Items list plus loot table form | 4 | `docs/cozy/JOINT-MAP.md` #1 |
| MS-10 | 8 · PROPOSED | Game time, day/night, timers (C1a) | Time settings form (with a night preview from 0 to 1) | 4 | JOINT-MAP #2. `ux/weather-time-backlog.md` is an IDEA only |
| MS-03 | 9 · PROPOSED | Session and stage links: doors, stairs, gates and safe-point rollover (C3a, C3b). **Two-floor shop**: shop downstairs, home upstairs | Link placer on the stage editor (door, stairs, gate). **Risk guard:** a named test for the stage-link rebuild frame budget (one frame on the S21 Ultra; see Risks) | 4 | JOINT-MAP #3, GDD "Pitch". **EA ruling (2026-11-18): two linked stages**, shop downstairs and home upstairs, joined by a stairs link through the world link (C3a/C3b). JOINT-MAP F1 makes stairs, shop door and gates one link type, and autosave-at-stairs (C8a) needs a link event. One map with a hidden floor would need storeys and roof hide (MS-05, `house-builder-renderer-needs.md` #1/#6/#7). Same-map roof hide stays for small single-storey houses later |
| MS-03 | 10 · PROPOSED | Autosave at doors, stairs and sleep (C8a) | Autosave toggle on a link, plus a bed prop in the palette. **Single point of failure:** the session save needs a migration test (see Risks) | 9, Step 2 | JOINT-MAP #4, GDD "Saves" |
| MS-11 | 11 · PROPOSED | Gather and respawn (35b). tool-swing (gather) goes from IDEA to PROPOSED in the Librarian pass before 35b, since 35b uses its bindings (CN-027 shape); CN-027 is accepted as a format, with no code yet | Place a node, plus a respawn field | 7 | JOINT-MAP #5, `behaviour-library/CATALOGUE.md` tool-swing |
| MS-11 | 12 · PROPOSED | Planting with a night boost (C2a) | Crops list | 7, 8 | JOINT-MAP #6 |
| MS-12 | 13 · PROPOSED | Alchemy recipes and tiers (C2b) | Recipes list | 7 | JOINT-MAP #7 |
| MS-13 | 14 · PROPOSED | NPC shops and the player counter (35c). talk is ready. npc-role (vendor) is an IDEA and is promoted in the Librarian pass before 35c. 35c is vendor only | Shop stock form on a selected NPC. Talk panel gets a Shop slot (MS-00 §Talk) | 5, 7 | JOINT-MAP #8, `ux/npc-buildings-backlog.md` |
| — | — · PROPOSED | **Checkpoint: the first loop (shop, plant, craft, sell) plays from project data** | — | 7–14 | JOINT-MAP |
| MS-14 | 15 · PROPOSED | Quests: deadline, tier, optional run (35d) | Quest board editor | 7, 14 | JOINT-MAP #9 |
| MS-15 | 16 · PROPOSED | NPC walk, queue, schedules and visits (C4a, C4b). neutral-roamer's rev 29 knobs are BTF's portal monster (hp, atk, act, prey, needs_all, kill xp). For C4a the Librarian adds walk knobs: walk mode (wander/route/to-target), tiles per turn, home tile and leash radius, promoted in the pass just before C4a. npc-role visitor and schedule are promoted together for C4b | Schedule form on a selected NPC, plus the Behaviour panel | 14 | JOINT-MAP #10. Knob set confirmed by the Librarian (2026-11-19) |
| MS-16 | 17 · PROPOSED | Guild resolve, reputation and the results panel (C5a, C5b) | Guild odds form | 15 | JOINT-MAP #11 |
| MS-10 | 18 · PROPOSED | Offline closed form with an 8 h cap (C1b) | One field in Time settings | 8 | JOINT-MAP #12 |
| MS-17 | 19 · PROPOSED | Skill tree, gear and decor (C7a–c) | Tree node list. Decor uses the stage palette | 7 | JOINT-MAP #13 |
| MS-07 | with any row · PROPOSED | effect (ready) is used by cozy rows (Librarian) | Effect Designer: on main only as a ui-shell mock (`ui-shell/mock-effects-v3/`) and as a standalone dev page from the ED-E steps (`tools/effect-designer/`, `src/editor/effect/`), never in the maker. The maker version is step 29; don't wire in the mock | — | `ux/effect-designer-v3-ux.md` |

## Stage 4: turn-based stealth
This follows BTF you-go-I-go turns:
- After the player's turn, each enemy moves one tile toward its objective tile.
- If the player is caught, they flee and lose some of the loot they carry.
- The game autosaves at doors, stairs and sleep.
- Quitting mid-stealth restarts the stage.

| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-18 | 20 · PROPOSED | Sight and noise, with parity tests (C6a). Ready: cone-sweep shape plus `wall_blocks_los`. Noise is a plain stealth setting in `src/rules/stealth`, not a behaviour (Librarian 2026-11-19); a per-unit 'noisy' behaviour comes later only if a game needs it | Stealth settings in the Behaviour panel | 4, 5 | JOINT-MAP #14, `behaviour-library/` rev 29 |
| MS-18 | 21 · PROPOSED | Objective-tile walkers (C6b). **objective-walker is NOT in the catalogue yet**. The Librarian mines it in the pass before C6b (slice 14), any time after rev 30. It shares one objective-tile path with objective-contest: tagged objective points on the stage (guard posts, flask tiles), with the data shape owned by DSK. Being caught means fleeing and losing loot (`stealth.lossPct`, a plain stage/project stealth rule shown in the Rules panel, not a behaviour; Librarian 2026-11-19) | Guard placer plus **objective/patrol tile placer**, shared with objective-contest (flasks) | 20, 7 | JOINT-MAP #15, GDD "Stealth" |
| MS-18 | 22 · PROPOSED | Cone and meter render (C6c). reveal-intent (ready) shows the guard's next tile. stun-hold is optional | Preview toggle in Test (TBD) | 21 | JOINT-MAP #16 |
| MS-18 | 23 · PROPOSED | Saves in stealth: autosave at links and sleep, and quitting mid-stealth restarts the stage | Uses the row-10 toggles. No new screen (TBD) | 10, 21 | GDD "Saves" |
| — | 24 · PROPOSED | The four stealth stages as project data. Themes are *Proposed* (forest edge, deep wood, cave, ruins) | Built with the stage editor | 20–23 | JOINT-MAP #17, GDD "World" |

## Stage 5: the rest of the maker
| MS | Step order | Feature | Basic maker editor / screen | Depends on | Source doc |
|---|---|---|---|---|---|
| MS-02 | 25 · PROPOSED | New project wizard, trimmed to what the format supports | Wizard | Step 1, MS-03/04 | `ux/new-project-wizard.md` (to rewrite) |
| MS-19 | 26 · PROPOSED | Welcome quiz and starter presets | Quiz cards plus Skip | MS-02 | `ux/welcome-quiz-plan.md` (to rewrite) |
| MS-05 | 27 · PROPOSED | House builder: roof hide, wall cutaway, storeys, builder overlays | House builder tool | MS-03 | `ux/house-builder-renderer-needs.md` (items 1, 6, 7, 8 are "own step later") |
| MS-06 | 28 · PROPOSED | Sprite Studio (tidy). Keep (CEO #6). Must include working import into the stage/game preview, Start new, an **Invert** left/right button for Make walk, and Tidy polish (CEO); the proposed UX answer adds a Tidy before/after plus Keep original | Sprite Studio | Step 2 | `ux/pixel-editor-plan.md`, `shell-lessons.md` #6 |
| MS-07 | 29 · PROPOSED | Effect Designer (tidy, v3 layers, beats and merge). Keep (CEO #7): breed and the power-up tiers carry forward | Effect Designer | Step 2 | `ux/effect-designer-v3-ux.md`, `design-notes/effect-designer-v3.md`, `shell-lessons.md` #7 |
| MS-20 | 30 · PROPOSED | Art and backgrounds upload | Art upload flow | MS-03 | `ux/art-upload.md` |
| MS-21 | 31 · PROPOSED | Sound Studio / panel. Keep the base foundation (CEO #5). It needs iteration rounds like Sprite Studio and the Effect Designer before it ships | Sound panel | TBD (local draft docs/audio-module.md, not on main) | `ux/sound-panel.md`, `shell-lessons.md` #5 |
| MS-22 | 31a · PROPOSED | Game UI kit: HUD layout presets (Orbs, Portrait plates, Tactics corner, Minimal), dressed from the project palette (framed portraits, liquid orbs with shine and a drain trail, bevelled ability slots with cooldown sweep, ornate 9-slice). Styles games only; the editor stays on style-spec | HUD picker: one layout pick plus one look pick (Basic), parts in Advanced. The play and preview show the game HUD | MS-06, MS-07, the play stage HUD | `shell-lessons.md` #4, `design-notes/ai-sprites-and-ui-research.md`. MS-22 doc TBD |
| MS-08 | 32 · PROPOSED | Build game (export) | Build game screen | Stages 1–4 | TBD (no MS doc yet) |
| MS-08 | 33 · PROPOSED | Device-local save in exported games (C8c) | None (export option, TBD) | 32 | JOINT-MAP "After stage 4" |
| — | 34 · PROPOSED | Cozy template project: one day plus one stealth stage, then stages 2–4 (C8b), after Build game and the E7 phone OK | Shown as a New-project template | 32 | JOINT-MAP "After stage 4" |

## Risks
Source: Outside reviews (GrokHeavy, Grok Build and Gemini), shared by the CEO and relayed by CoS, 2026-11-19. Each guard is written into the named step's guide when that step is drafted.

| Risk | Guard | Where | Owner |
|---|---|---|---|
| The stage-link rebuild (changing stage through a door or stairs) stutters on a phone | A **phone frame budget**: the rebuild fits in one frame on the S21 Ultra, checked by a named test in the stage-link step | Step 9 | Step 9's guide author and builder; CoS runs the phone check |
| Session save is a **single point of failure**: a bad save or format change loses a player's game | A **migration test**: a save written by the previous format version loads after the change; flagged as a single point of failure in the guide | Step 10 (autosave, C8a) | Step 10's guide author; DSK for the format |
| The generic Behaviour panel can't hold the ~50 BTF combat behaviours (post-launch) | A **headroom check** before step 5: the panel's layout, browse-by-goal and menu-order data can take the full catalogue without a redesign | Before step 5 | EA and DSK |

## Behaviour editors (Librarian)
| Behaviour / system | Editor | MS | Stage |
|---|---|---|---|
| effect | Effect Designer. On main only as a ui-shell mock (`ui-shell/mock-effects-v3/`) and as a standalone dev page from the ED-E steps (`tools/effect-designer/`, `src/editor/effect/`), never in the maker. The maker version is step 29; don't wire in the mock | MS-07 | 3 (use), 5 (tidy) |
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
| Publish the engine app (editor plus game export) on Google Play and the App Store. P1-9's APK is game-only | After P1-9 | Plan needed later |
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
| `effects-sprite-sync.md` | Keep | Research base for step 33 effects. It's engine-side and still valid |
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
