# Cozy showcase — r3 re-sequence (data + maker editor per slice)
Modes Designer, 2026-11-18, on the CEO's 18 Nov order via CoS. Planning only. Supersedes the r2 build order in JOINT-MAP.md (kept as JOINT-MAP.r2.md); the per-system table there still stands.

## Rule for every cozy slice (stage 3)
A slice is done only when it ships all four:
1. **Project data**: its section in the project format (versioned, demo-free), with defaults.
2. **Reader + validation**: read, validate, migrate; bad data gives a clear error, never a crash.
3. **Engine rule**: the runtime reads only that data (no hard-coded cozy values; BTF/cozy numbers are editable defaults).
4. **Basic maker editor**: a plain list/form panel in the maker (Home > project > panel), save/load through stage 2, and a **Test** run that loads the edited data.
Budget: each slice gains roughly +100–150 lines for data/reader/editor over the r2 engine estimate; keep ≤400 per PR by splitting into "a: data+rule" and "b: editor" where needed. Estimates, not measured.

## Prerequisites (stages 1–2, not mine; assumed)
Project format v1 + reader + versioning with DEMO_LOAD moved to data; maker Home, save/load, Test.

## Stage 3 — cozy slice order
| # | Slice (r2 ids) | Project data | Basic maker editor |
|---|---|---|---|
| 1 | Items, stacks, loot (35a) | `items[]`, `lootTables[]`, currency item | Items list + loot table form |
| 2 | Game time, day/night, timers (C1a) | `time` {dayLengthMs, phases, start} | Time settings form (preview night 0..1) |
| 3 | Session + stage links, stairs/doors, safe-point rollover (C3a, C3b) | `session` start, `map.links[]` | Link placer on the stage editor (door, stairs, gate) |
| 4 | Autosave at doors, stairs, sleep (C8a) | `link.autosave`, bed object `sleep` | Toggle on a link; bed prop in palette |
| 5 | Gather + respawn (35b) | `gatherables[]` {item, respawn} | Place node + respawn field |
| 6 | Planting + night boost (C2a) | `crops[]` {stages, growMs, nightRate} | Crops list |
| 7 | Alchemy recipes + tiers (C2b) | `recipes[]` {inputs, output, tierRule, craftMs} | Recipes list |
| 8 | NPC shops + player counter (35c) | vendor role on `stage.neutrals[]`, `stock[]`, prices | Shop stock form on a selected NPC |
| — | **First loop playable from project data** (shop, plant, craft, sell) | | |
| 9 | Quests + deadline + tier + optional run (35d) | `quests[]` {steps, deadline, tier, runsAllowed} | Quest board editor |
| 10 | NPC walk/queue, schedules, visits (C4a, C4b) | behaviour setups per NPC (Librarian) | Schedule form on a selected NPC |
| 11 | Guild resolve + reputation + results panel (C5a, C5b) | `guild` {odds, payouts}, `rep` curve | Guild odds form |
| 12 | Offline closed form, 8 h cap (C1b) | `time.offlineCapMs` | One field in Time settings |
| 13 | Skill tree, gear, decor (C7a–c) | `tree[]`, gear modifiers on items, decor props | Tree node list; decor uses the stage palette |

## Stage 4 — turn-based stealth (each with data + editor too)
14 C6a sight + noise + parity tests (`stealth` setup knobs; can start early, engine-only test). 15 C6b objective-tile walkers, one tile per enemy turn, caught = flee + lose loot (`guards[]` {objectiveTiles}, `stealth.lossPct`); editor: place guard + patrol tiles. 16 C6c cone + meter render. 17 the four stealth stages as project data.

## After stage 4 (folds into stage 5)
C8c device-local save in exported games; C8b cozy template project (1 day + 1 stealth stage, then 2–4), after Build game and E7 phone OK.
