# Showcase project, steps 1–11 (draft, EA-9)

Source: `steps-1-11.tileproj/` (28 files, format v6; same layout as `fixtures/demo.tileproj`), made by `make-showcase.mjs` from `data/templates/demo.tileproj` through the maker's own pure writers (`turnOn`, `setStageRule`, `addStage`, `addLink`/`setAutosave`, `paintCells`, `fillTalk`/`attachTalk`, `newEffect`/`editEffect`, `withFx`, `addAbility`, `setStat`). Base: main `b7acc899`. Data only; no code change.
Packed with the maker's own Build game path (`buildGame` → `gameZip` over a release play tree): `showcase-game.zip`. APK: `sh tools/apk/debug-apk.sh showcase-game.zip` → `TileEngine-11bb0a50baab-debug.apk` (debug-signed, minSdk 26, target 34, no INTERNET).

Rebuild (fresh /tmp clone, `npm ci`):
```
node make-showcase.mjs <clone> <newDir>
node check-and-pack.mjs <clone> $(git -C <clone> rev-parse HEAD) <newDir>/steps-1-11.tileproj <out.zip>
JAVA_HOME=… ANDROID_HOME=… sh <clone>/tools/apk/debug-apk.sh <out.zip>
```

## Phone checklist (S21, APK or served zip; portrait 390-ish)
| # | Stage | Do | Expect (step) |
|---|---|---|---|
| 1 | Village | Open the app | Board with a painted village picture under the tiles (9a/9b); "Level 0 · 0/3 XP" strip (6); no "Back to maker" (11a) |
| 2 | Village | Tap Knight, move, tap again, attack a bandit | Select/move/attack by touch, second action works after a pan (S0) |
| 3 | Village | Archer: basic attack, then line shot | Holy Blade built-in plays on the attack (10d); "Showcase spark" saved effect (shake, hit-stop) on the line shot (10b/10c) |
| 4 | Village | Knight attacks | Its added basic attack (5) plays Cut via the `builtin:effect/` alias (10b/10d) |
| 5 | Village | Walk next to the Villager, Talk | Talk panel "Hello, traveler." (S0, 4b) |
| 6 | Village | Watch enemy turns | Enemies on side "bandits" act (wolf + Bandit); Merchant is on your side (S0b) |
| 7 | Village | Kill a unit (5 XP) | XP bar fills at 3 per level; level-ups and the level-2 pick show (6) |
| 8 | Village | Step on the door marker, bottom right | Door marker drawn (9c); travel to Wolf den keeps hp/xp/level (7, 8) |
| 9 | Wolf den | Look at the board | New 8×8 map: water, walls, vines (slow) (4a, 4c); allied villager. The stage loadout (size 2, 4b/5) applies when this stage starts fresh; by a link the whole party arrives (8) |
| 10 | Wolf den | Win or trade the last blow | Stage-only rule: mutual wipe → the side that acted last loses (6) |
| 11 | Wolf den | Stairs top right; door top left | Stairs to Siege; door back to Village (7, 9c) |
| 12 | Siege | Look at sides | Your side is "heroes", enemies "raiders" (S0b); Merchant talks "The gate behind you leads home." |
| 13 | Siege | Kill both raiders | Nobody wins (wipe_wins off): play continues until you leave (6) |
| 14 | Siege | Gate marker bottom left | Gate travel back to Village (7, 9c) |

## Coverage (steps 1–11, player/maker-visible)
| Feature (step) | Demo | Showcase | Note |
|---|---|---|---|
| Touch select/move/attack/spell/talk (S0) | yes | yes | |
| Sides from data, renamed sides, allies (S0b) | partly (wolves, ally) | yes (bandits, wolves, heroes/raiders) | |
| Project format, reader, versions (1) | yes | yes | |
| Terrain painting (4a), more maps/stages (4c) | 1 map | 3 maps, 3 stages, vines/path/water/walls | |
| Spawns, NPC, enemy placement, talk (4b) | yes | yes, 2 talkers | |
| Units, stats, + Add ability (5) | 7 units | + Bandit, Knight hp 12, Knight basic attack | roles (applyRole) not used |
| Levels/XP curve (6) | no | yes (thresholds 3/3/3) | |
| Win rules per stage (6) | default | default + 2 stage rules | |
| Stage loadout override (4b/5) | no | yes (size 2) | |
| Links stairs/door/gate, party carry (7, 8) | no | yes (4 links) | |
| Autosave at a link, Continue (8) | no | flag on Village door | **maker Test only**: the exported game/APK has no save or Continue (`tools/play-stage/page.ts` `runGame`) |
| Background picture, asset hash (9a/9b) | no | yes (96×144 PNG) | |
| Link markers (9c) | no | yes | "other kind" diamond not shown |
| Saved effect, built-in, alias (10b–10d) | no | yes | |
| Build game zip (11a/11a2), APK (11b) | demo only | yes, built from this project | ready/error sheets are maker UI |
| Weighted / waves enemy pools (format v6) | no | **no** | Expressible in v6 and `readProject` reports 0 rows, but the play stage reads every stage with `readStage(…, { picks: 0, waveUnits: 0 })` (`tools/play-stage/project.ts` L66), so Test, export and the APK refuse with "play: stage". No roadmap row schedules the play caps; needs a builder step (pass real caps). Gap: the Test gate lets it through. |
| Budgets (11c1) | no | absent key | not merged |
| Home, editors, Test, Build-game sheets, upload refusals (2–11a2) | template | n/a | maker UI; the maker has no .tileproj import, so the showcase opens in the maker only as a template (builder step) |

## QA pre-APK checklist
1. Tree sha: `find data/showcase/steps-1-11.tileproj -type f | sort | xargs sha256sum | sha256sum` matches the pushed value; `project.json` says formatVersion 6, catalogueRev 30, name "Showcase steps 1-11".
2. `node check-and-pack.mjs` on merged main: readProject ok, 0 rows (0 hard), assetRows 0, Test gate allowed, all 3 stages open in the play stage, all 4 links open, buildGame ok.
3. No test, smoke or build reads `data/showcase/` (`rg -l "data/showcase" tests tools handoff src` is empty; the maker bundles only `data/templates`); green count unchanged (1170 at `b7acc899` with the folder present).
4. The 400 gate is untouched: a docs/data push, not a builder step; 11c1's branch files (`data/templates/*`, `fixtures/demo.tileproj`) are not edited.
5. Zip from merged main boots at 390 and 360 with no page error, the background loads, no off-origin request (`proof-boot.log`).
6. APK: `debug-apk.sh <zip>` → aapt2 badging sdkVersion 26 / targetSdkVersion 34, no INTERNET, `project/files.js` and the asset inside; record the APK sha256.
7. S21: the phone checklist above, rows 1–14, with a screenshot per stage; note any row that fails by number.
8. Known gaps written on the QA sheet: no weighted/waves pools (play refuses them), no autosave/Continue in an exported game, budgets absent.
