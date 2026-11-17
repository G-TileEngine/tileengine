# Foundation status (completion record)

Replaces "done" messages to the CEO (CEO rule 2026-11-16 22:45). Created with B1; every step's merge-time doc commit updates it. EA writes, CoS pushes (19:20 rule). Plan: `foundation-plan.md` r1 §6.

- **Main:** `75df4642` (P1-2 QA build reviews, parent `1775d83a`, tree `a3c1172e`; floor 904/0) · **P1-1 walk / movement:** merged `7dde2f22` (PR #61, tree `14da7388`, ChatA r1; verify-merge 882/0) · **P1-2 battle:** merged `1775d83a` (PR #63, tree `ce99d97e`, ChatA r2; 904/0) · **P1-3..5:** r2 kits filed on `75df4642` (floors 917 / 928 / 937; P1-3 cap 420, others 400) · **ED-E7:** r2 kit filed (build after E6 merges) · **Catalogue snapshot:** rev 26, sha256 `ea8b3302…` (in `src/rules/behaviours/catalogue.ts`: xp-levels, terrain) · **Updated:** 2026-11-17 04:56 London (GMT)
- **Totals:** behaviours done 0/64 (partly registered: xp-levels, terrain, and P1-2 unit-roster / damage-resolution / win-condition) · knobs honoured 9/567 · functions done 0/26 (F1, F3 partly, F2 resolver maths)
- **States:** `not started` · `in kit` · `merged` (partly = some knobs honoured; the rest are reported `knobUnsupported`, never ignored).

## Plain words, newest first
- **ED-E7** (designer page 2): r2 kit filed. Build after E6 merges.
- **P1-3 / P1-4 / P1-5** (range and interact, line-shot, enemy turn): r2 kits filed, stacked on main `75df4642`. Not merged yet. Floors 917, 928 and 937.
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
| 2 | `action-budget` | B4; per-unit scope B31; focus knobs B33; P1-5 kit | in kit | 0/12 | (P1-5 r2 kit filed, not merged) | — | 0 | — |
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
| 13 | `basic-attack` | B3; P1-3 kit | in kit | 0/8 | (P1-3 r2 kit filed, not merged) | — | 0 | — |
| 14 | `damage-resolution` | B2; guard/soak order B19; **P1-2** hit_class + L5 warning | **merged (P1-2, partly)** | 1/3 | guard/soak knobs later (B19) | `tests/parity/battle.parity.test.ts` | 1 | `1775d83a` |
| 15 | `line-shot` | B3; P1-4 kit | in kit | 0/12 | (P1-4 r2 kit filed, not merged) | — | 0 | — |
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
| 55 | `bot-ability-priority` | B6 generic order; B32 custom order, per-side combos; P1-5 kit | in kit | 0/2 | (P1-5 r2 kit filed, not merged) | — | 0 | — |
| 56 | `reveal-intent` | B32 | not started | 0/6 | all (no code; main: catalogue-only) | — | 0 | — |
| 57 | `stat-plates` | B34 | not started | 0/19 | all (no code; main: catalogue-only) | — | 0 | — |
| 58 | `hand-and-draw` | B33 | not started | 0/7 | all (no code; main: catalogue-only) | — | 0 | — |
| 59 | `reveal-hand` | B33 | not started | 0/4 | all (no code; main: catalogue-only) | — | 0 | — |
| 60 | `effect` | E1–E5 (lane E); `effect` answer passed by B3+; plays in a match via E7p, hooked in B35 | not started | 0/44 | all (no code; main: coded+wired (values fixed in code, not read from settings)) | — | 0 | — |
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
| P1-3 range, interact | r2 kit filed (419 / cap 420) | pending | — | floor 917 |
| P1-4 line-shot | r2 kit filed (365 / cap 400) | pending | — | floor 928 |
| P1-5 enemy turn | r2 kit filed (313 / cap 400) | pending | — | floor 937 |
| ED-E7 designer page 2 | r2 kit filed | pending | — | build after E6 merges |
| B2–B38 | plan §4 | — | — | — |
