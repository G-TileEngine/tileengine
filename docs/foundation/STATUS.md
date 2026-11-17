# Foundation status (completion record)

Replaces "done" messages to the CEO (CEO rule 2026-11-16 22:45). Created with B1; every step's merge-time doc commit updates it. EA writes, CoS pushes (19:20 rule). Plan: `foundation-plan.md` r1 §6.

- **Main:** `8e900ea5` (`8e900ea5745fd1e3542a7a09285f6a728881a55d`, P1-6h kit filed; floor 988/0) · **P1-1 walk / movement:** merged `7dde2f22` (PR #61, tree `14da7388`, ChatA r1; verify-merge 882/0) · **P1-2 battle:** merged `1775d83a` (PR #63, tree `ce99d97e`, ChatA r2; 904/0) · **ED-E6:** merged `1cdcd41f` (PR #64, ChatA r1; QA build review on `9ac26da8`; 922/0) · **P1-3:** merged `9dfd92fe` (PR #66, r3) · **P1-4:** merged `0ddeafc6` (PR #67, r2); QA build review on `69fad867` · **P1-5:** merged `f60f2805` (PR #68, r2); QA build review on `3ca06e6d` · **ED-E7:** merged (PR #69; QA review on `bbce4c75`) · **P1-6 r2:** merged `d87d0515` (PR #70, ChatA rewrite, 390 lines / cap 500); QA build review on `70c4d07d`; 981/0 · **E7p r3:** merged `066b96f7` (PR #71; QA build review on `ee9dd22b`; 988/0) · **P1-6h r1:** kit filed on main `8e900ea5`, building next (131 / cap 400; floor 992) · **P1-7 r5 / P1-8 r3 / P1-9 r3:** re-gated on P1-6h (authoring floors 998 / 1002 / 1006); P1-7 is 500 / cap 500 on ChatA hooks with the live 44 CSS camera floor; design stops at P1-9 until the CEO's APK tests · **Catalogue snapshot:** rev 26, sha256 `ea8b3302…` (in `src/rules/behaviours/catalogue.ts`: xp-levels, terrain) · **Updated:** 2026-11-17 18:12 London (GMT)
- **Totals:** behaviours done 0/64 (partly registered: xp-levels, terrain, and P1-2 unit-roster / damage-resolution / win-condition) · knobs honoured 9/567 · functions done 0/26 (F1, F3 partly, F2 resolver maths)
- **States:** `not started` · `in kit` · `merged` (partly = some knobs honoured; the rest are reported `knobUnsupported`, never ignored).

## Plain words, newest first
- **P1-6h hardening kit (after E7p, before P1-7):** five further QA-triaged Grok Heavy findings (44 CSS px cell floor with pan instead of shrink; bot `actionsPerTurn` from ACTION_BUDGET and required `setup`; `taken()` copies onto `Object.create(null)` plus a JSON `__proto__` plant and a `whole()` Infinity test; foreign-side / beyond-reach / second-tap play-page tests; P1-7 doc flags cleaned). Not folded into P1-7: hardening is 131 lines and stays its own step (floor 992). Authoring floors from main 981: E7p 988, P1-6h 992, P1-7 r5 998, P1-8 r3 1002, P1-9 r3 1006. P1-6h `4d2fc2ed` is QA OK TO SEND (unchanged). P1-7 r5 is 500 / cap 500: camera, HUD, spell door, talk and end-turn plus 6 tests, added through hooks and new files (`camera-touch.ts`, `hud.ts`, `match.ts`) on ChatA's merged board, load and page, with the live 44 CSS camera floor (`seatCam`, `zoomAt` `sMax >= floorS`) (458+42). The 850-line ChatA rewrite (r3) was rejected — a kit cannot raise its own cap. Shipped `play-stage-p17.test.ts` includes the 360/390 @3x floor test. The E7 step-file floor-971 text is unchanged. Design still stops at P1-9 until the CEO's APK tests.
- **P1-6 r2 and E7 merged.** P1-6 r2 landed as `d87d0515` (PR #70, ChatA rewrite, 981/0 after the QA review at `70c4d07d`). E7 landed earlier (PR #69). E7p merged as `066b96f7` (PR #71, 988/0); P1-6h kit filed at `8e900ea5`.
- **P1-6 r2 Heavy-review fixes folded:** six QA-triaged findings (noShotRow, `whole` reach/ShotRow, mid-line still hits, `sides[0]` JSDoc, empty-tile `noTarget`, and the P1-4 mid-line test gap) land in the P1-6 kit so they are on main before the P1-6 go-line, with no extra build round (499 / cap 500). Later steps re-gated on `3ca06e6d` (957/0; P1-5 is now on main). Authoring floors: E7 973, P1-6 r2 981, E7p 988, P1-7 r2 993, P1-8 997, P1-9 1001. Design still stops at P1-9 until the CEO's APK tests.
- **P1-5 r2 merged** at `f60f2805` (PR #68), with QA build review on `3ca06e6d`, 957/0. P1-3 r3 (`9dfd92fe`, PR #66) and P1-4 r2 (`0ddeafc6`, PR #67) landed earlier, after the batch-2 kit filing (`6d5bfbbe`, parent `9ac26da8`).
- **Batch 2 kits filed:** P1-6 (play page 1), E7p (ability-play r3, QA pin adopted), P1-7 (play page 2), P1-8 (spell effects) and P1-9 (APK wrapper; `*.jks` and `*.keystore` are gitignored). Those kits were restacked in this filing onto current main (P1-6 as r2).
- **ED-E7** (designer page 2): r2 kit filed; docfix filed (CEO phone test 1 after E7 is dropped; the CEO's first real test is the APK). Tests unchanged vs r2. Restacked on the merged E6 ChatA code; authoring floor 973 on this main.
- **ED-E6** (designer page 1): merged at `1cdcd41f` (PR #64, ChatA r1). Floor was 922/0 on `9ac26da8` before P1-3 r3 and P1-4 r2 landed.
- **P1-2** (battle): a hit subtracts the attacker's attack, a unit at 0 HP leaves the board in the same step, and a refused hit is one of six frozen reasons. Settings for roster, damage class and wipe-win are live; a unit id that is a prototype key still takes the base 9/1. Merged at `1775d83a` (PR #63).
- **P1-1** (walk / movement): a unit can walk straight (north, east, south or west, no turning) up to its step reach, the scene gets the path, and a tile out of reach is refused. Merged at `7dde2f22` (PR #61).
- **B1** (behaviour runtime): the engine now has a list of behaviours that reads your settings, starting from Before The Fall's numbers. Levelling and tile types read your settings; anything not built yet is listed as "not supported yet" instead of being ignored.

## Standing defaults (CEO can change)
- **Q1:** resource-meter and auto-cast count in foundation-done (B36); tool-swing stays in its own lane.
- **Q2:** the turn timer is 60 s, editable (BTF code had 30 s).
- **Q3:** the 200 settings without a BTF number start at the Librarian's proposed values, marked "proposed" and editable.
- **Q4:** after B7, attacks and control are built side by side.
- **Q5:** export, the stage-select and loadout screens, and Godmode save-back come after the foundation.

## Table 1: behaviours (64)
| # | id | step | state | knobs honoured | knobUnsupported | parity file | parity cases | merge sha |
|---|---|---|---|---|---|---|---|---|
| 1 | `ability-presentation` | B6 groups; B35 hand_placement, team colours | not started | 0/6 | all (no code; main: catalogue-only) | — | 0 | — |
| 2 | `action-budget` | B4; per-unit scope B31; focus knobs B33; P1-5 | **merged (P1-5 r2)** | 0/12 | (merged PR #68; knob remainder later if any) | — | 0 | `f60f2805` |
| 3 | `mana-pool` | B4 | not started | 0/6 | all (no code; main: catalogue-only) | — | 0 | — |
| 4 | `mana-gain` | B22 | not started | 0/9 | all (no code; main: catalogue-only) | — | 0 | — |
| 5 | `special-meter` | B24 | not started | 0/11 | all (no code; main: catalogue-only) | — | 0 | — |
| 6 | `xp-levels` | B1 (partial); B23 (all 19 knobs; today 5) | **merged (B1, partly)** | 6/19 | xp_basic, xp_kill_summon, xp_contest_win, xp_kill_neutral, xp_kill_unit, choice_levels, unit_unlock_when (+3 gated: sides, levels, pairs); value: level_rule pvp_kills; card-hand gate: level_card_offer_levels, level_draw_levels | `tests/rules/behaviours.test.ts` (L0 = BTF; full parity file later) | 1 | `9ebb9413` |
| 7 | `self-cost` | B22 | not started | 0/10 | all (no code; main: catalogue-only) | — | 0 | — |
| 8 | `ability-refresh` | B22 | not started | 0/5 | all (no code; main: catalogue-only) | — | 0 | — |
| 9 | `ability-availability` | B4 | not started | 0/6 | all (no code; main: catalogue-only) | — | 0 | — |
| 10 | `step-pattern` | B3 | not started | 0/7 | all (no code; main: pieces unused) | — | 0 | — |
| 11 | `teleport` | B16 | not started | 0/6 | all (no code; main: pieces unused) | — | 0 | — |
| 12 | `reach-extension` | B17 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 13 | `basic-attack` | B3; P1-3 | **merged (P1-3 r3)** | 0/8 | (merged PR #66; knob remainder later if any) | — | 0 | `9dfd92fe` |
| 14 | `damage-resolution` | B2; guard/soak order B19; **P1-2** hit_class + L5 warning | **merged (P1-2, partly)** | 1/3 | guard/soak knobs later (B19) | `tests/parity/battle.parity.test.ts` | 1 | `1775d83a` |
| 15 | `line-shot` | B3; P1-4 | **merged (P1-4 r2)** | 0/12 | (merged PR #67; knob remainder later if any) | — | 0 | `0ddeafc6` |
| 16 | `pierce-line` | B11 | not started | 0/8 | all (no code; main: catalogue-only) | — | 0 | — |
| 17 | `radial-volley` | B12 | not started | 0/11 | all (no code; main: catalogue-only) | — | 0 | — |
| 18 | `sky-drop` | B13 | not started | 0/8 | all (no code; main: catalogue-only) | — | 0 | — |
| 19 | `splash-hop` | B12 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 20 | `random-strikes` | B11 | not started | 0/8 | all (no code; main: catalogue-only) | — | 0 | — |
| 21 | `multi-attacker` | B12 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 22 | `target-lock` | B11 | not started | 0/3 | all (no code; main: pieces unused) | — | 0 | — |
| 23 | `lane-sweep` | B13 | not started | 0/10 | all (no code; main: catalogue-only) | — | 0 | — |
| 24 | `cross-burst` | B14 | not started | 0/8 | all (no code; main: catalogue-only) | — | 0 | — |
| 25 | `cone-sweep` | B14 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 26 | `orbit-ring` | B14 | not started | 0/8 | all (no code; main: catalogue-only) | — | 0 | — |
| 27 | `shrinking-arena` | B24 | not started | 0/5 | all (no code; main: catalogue-only) | — | 0 | — |
| 28 | `stun-hold` | B15 | not started | 0/9 | all (no code; main: catalogue-only) | — | 0 | — |
| 29 | `trap-tile` | B17 | not started | 0/10 | all (no code; main: catalogue-only) | — | 0 | — |
| 30 | `slow-tiles` | B17 | not started | 0/8 | all (no code; main: catalogue-only) | — | 0 | — |
| 31 | `damage-over-time` | B15 | not started | 0/8 | all (no code; main: catalogue-only) | — | 0 | — |
| 32 | `push-knockback` | B16 | not started | 0/12 | all (no code; main: pieces unused) | — | 0 | — |
| 33 | `pull-hook` | B16 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 34 | `taunt` | B15 | not started | 0/5 | all (no code; main: catalogue-only) | — | 0 | — |
| 35 | `barrier-line` | B18 | not started | 0/11 | all (no code; main: catalogue-only) | — | 0 | — |
| 36 | `barrier-payoff` | B18 | not started | 0/10 | all (no code; main: catalogue-only) | — | 0 | — |
| 37 | `shield-immunity` | B19 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 38 | `heal` | B19 | not started | 0/6 | all (no code; main: catalogue-only) | — | 0 | — |
| 39 | `stat-buff` | B19 | not started | 0/12 | all (no code; main: catalogue-only) | — | 0 | — |
| 40 | `stat-copy-swap` | B20 | not started | 0/5 | all (no code; main: catalogue-only) | — | 0 | — |
| 41 | `buffer-firer` | B20 | not started | 0/12 | all (no code; main: catalogue-only) | — | 0 | — |
| 42 | `cleanse` | B20 | not started | 0/6 | all (no code; main: catalogue-only) | — | 0 | — |
| 43 | `revive` | B21 | not started | 0/9 | all (no code; main: catalogue-only) | — | 0 | — |
| 44 | `on-death-trigger` | B21 | not started | 0/8 | all (no code; main: catalogue-only) | — | 0 | — |
| 45 | `adjacency-synergy` | B21 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 46 | `summon-unit` | B25 | not started | 0/9 | all (no code; main: catalogue-only) | — | 0 | — |
| 47 | `sword-lifecycle` | B26 | not started | 0/18 | all (no code; main: pieces unused) | — | 0 | — |
| 48 | `autonomous-ally` | B25 | not started | 0/5 | all (no code; main: catalogue-only) | — | 0 | — |
| 49 | `avatar-summon` | B29 | not started | 0/3 | all (no code; main: catalogue-only) | — | 0 | — |
| 50 | `win-condition` | B2 wipe; B30 clocks, timeout, tiebreaks; **P1-2** wipe / mutual | **merged (P1-2, partly)** | 2/13 | clocks, timeout, tiebreaks later (B30) | `tests/rules/battle.test.ts` | 1 | `1775d83a` |
| 51 | `unit-roster` | B2 hp/atk; B5 opening_row, piece_count; B34 clip_cues, team_colour; **P1-2** hp/atk | **merged (P1-2, partly)** | 2/8 | opening_row, piece_count, clip/colour later | `tests/rules/battle.test.ts` | 1 | `1775d83a` |
| 52 | `neutral-guardians` | B27 | not started | 0/13 | all (no code; main: pieces unused) | — | 0 | — |
| 53 | `neutral-roamer` | B27 | not started | 0/9 | all (no code; main: catalogue-only) | — | 0 | — |
| 54 | `objective-contest` | B28 + B29 | not started | 0/18 | all (no code; main: catalogue-only) | — | 0 | — |
| 55 | `bot-ability-priority` | B6 generic order; B32 custom order, per-side combos; P1-5 | **merged (P1-5 r2)** | 0/2 | (merged PR #68; knob remainder later if any) | — | 0 | `f60f2805` |
| 56 | `reveal-intent` | B32 | not started | 0/6 | all (no code; main: catalogue-only) | — | 0 | — |
| 57 | `stat-plates` | B34 | not started | 0/19 | all (no code; main: catalogue-only) | — | 0 | — |
| 58 | `hand-and-draw` | B33 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 59 | `reveal-hand` | B33 | not started | 0/4 | all (no code; main: catalogue-only) | — | 0 | — |
| 60 | `effect` | E1–E5 (lane E); `effect` answer passed by B3+; plays in a match via E7p, hooked in B35 | merged (E7p r3) | 0/44 | (E7p merged `066b96f7`; main: coded+wired, values fixed in code) | — | 0 | — |
| 61 | `terrain` | B1 (partial); B10 (all 10 knobs; today 2) | **merged (B1, partly)** | 3/10 (partial) | lethal_landing_scope, wall_blocks_los, wall_blocks_shots, lanes_* (lanes_enabled true = value); tile_types item flags kills_on_landing, slows_move, trips, buildable when on | `tests/rules/behaviours.test.ts` (L0 = BTF; full parity file later) | 1 | `9ebb9413` |
| 62 | `resource-meter` | B36 (Q1) | not started | 0/5 | all (no code; main: catalogue-only) | — | 0 | — |
| 63 | `auto-cast` | B36 (Q1) | not started | 0/3 | all (no code; main: catalogue-only) | — | 0 | — |
| 64 | `tool-swing` | Tool-swing lane TS-R/TSa (Q1); registered in B36 if moved in | not started | 0/2 | all (no code; main: catalogue-only) | — | 0 | — |

## Table 2: functions (F1–F26)
| F | step | state | test file | merge sha |
|---|---|---|---|---|
| F1 registry by catalogue id | B1 | **merged (B1, partly)** | `tests/rules/behaviours.test.ts` | — |
| F2 resolver L0–L5 + knobUnsupported | B1 (maths L0–L4, L5 HP) · B5 (readers) | **merged (B1, partly)**, partly | `tests/rules/behaviours.test.ts` | — |
| F3 catalogue snapshot in engine | B1, extended per step | **merged (B1, partly)**, 2 of 64 | `tests/rules/behaviours.test.ts` | — |
| F4–F26 | see plan §3 | not started | — | — |

## Table 3: steps
| step | size planned / actual | QA pick | merge sha | verify-merge |
|---|---|---|---|---|
| B1 behaviour runtime | 340 / 340 (proto) | — | — | — |
| P1-1 walk / movement | 265 (kit) / 259 | ChatA r1 | `7dde2f22` | PASS 882/0 |
| P1-2 battle | ChatA r2 (build pin included) | ChatA r2 | `1775d83a` | 904/0 (docs on `75df4642`) |
| P1-3 range, interact | ChatA r3 | ChatA r3 | `9dfd92fe` | merged PR #66 (on main 957/0; QA docs on `b7d4326` / `69fad867`) |
| P1-4 line-shot | ChatA r2 | ChatA r2 | `0ddeafc6` | merged PR #67 (on main 957/0; QA docs on `69fad867`) |
| P1-5 enemy turn | ChatA r2 | ChatA r2 | `f60f2805` | merged PR #68 (on main 957/0; QA docs on `3ca06e6d`) |
| ED-E6 designer page 1 | ChatA r1 | ChatA r1 | `1cdcd41f` | 922/0 (QA docs on `9ac26da8`) |
| ED-E7 designer page 2 | r2 kit + docfix | ChatA r2 | (PR #69) | merged (QA on `bbce4c75`) |
| P1-6 play page 1 | r2 (499 / cap 500; Heavy-review fixes folded) | ChatA r2 | `d87d0515` | merged PR #70 (981/0; QA on `70c4d07d`) |
| ED-E7p ability play | r3 (315 / cap 320; QA pin adopted) | ChatA | `066b96f7` | merged PR #71 (988/0; QA on `ee9dd22b`) |
| P1-6h hardening | r1 kit filed (131 / cap 400; QA OK TO SEND) | pending | — | authoring floor 992 |
| P1-7 play page 2 | r5 kit filed (500 / cap 500; ChatA hooks + live 44 CSS camera floor) | pending | — | authoring floor 998 |
| P1-8 spell effects | r3 kit filed (174 / cap 400; unused PlayFx import dropped) | pending | — | authoring floor 1002 |
| P1-9 APK wrapper | r3 kit filed (255 / cap 400; `*.jks`/`*.keystore` ignored; restack on P1-8 r3) | pending | — | authoring floor 1006 |
| B2–B38 | plan §4 | — | — | — |
