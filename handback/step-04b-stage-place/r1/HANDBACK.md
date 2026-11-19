# Hand-back step-04b-stage-place r1
Step file: docs/maker/steps/step-04-stage-editor.md (r6, 4b sections and the shared run rules)
Base commit: d62f87bc521115cff588282a48ce086535743207     Code head: 516cbfbefb08b5c84cb437c7affa75efe9c16d4b     Tree: a4b44f5d23205129f3df0f746500245aeddbddf4     Branch: step/step-04b-stage-place-r1-chatA     PR: opened by Chief of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	data/templates/setup.talk.json
A	handoff/steps/tests/s4b-stage-place/smoke.mjs
M	src/editor/stage/paint.ts
A	src/editor/stage/place.ts
A	src/editor/stage/talk.ts
M	tests/editor/maker-law.test.ts
A	tests/editor/stage-place.test.ts
M	tools/maker/home.ts
A	tools/maker/stage-sheets.ts
M	tools/maker/stage.ts

## Green
`npm ci && npm run green` exits 0. N = 3 new tests. Floor 1060 + 3 = 1063.
npm test: 1063/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
```
# tests 1063
# pass 1063
# fail 0
# skipped 0
# todo 0
```
Line count at the code head, `git diff --shortstat d62f87bc521115cff588282a48ce086535743207..516cbfbefb08b5c84cb437c7affa75efe9c16d4b -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4b-stage-place/**' ':!handback/**'`: 8 files changed, 306 insertions(+), 34 deletions(-). 306 insertions + 34 deletions = 340.
The smoke script is 49 lines.
Named tests `talk skeleton loads` and `talk limit: slice matches format` are in the green run.

## Smoke
No file under `tools/play-stage/` changed, so S0 was not run. `handoff/steps/tests/s0-play-input/touch-smoke.mjs` is still sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser: Google Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome` (this sandbox has no `/usr/bin/google-chrome`).
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` printed `SMOKE PASS` once, after the 390 run and the 360 run. Checks 1–8 were ok at both widths.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` printed `SMOKE PASS` once, after the 390 run and the 360 run. Checks 1–8 were ok at both widths.
Build output: `/tmp/s4b-maker-build` (`maker/index.html`, `maker/cb00d1cf815f/`, `play-stage/cb00d1cf815f/index.html`). `build.json` commit is the code head.

## Screenshots
390×844, deviceScaleFactor 1, light, Chrome.
- `01-add-here.png` Add here: Your team start, NPC, Enemy, then Floor, Water, Wall block
- `02-unit-picker.png` unit picker
- `03-what.png` Cleric placed: What do they do?
- `04-talk.png` Talk line field and Save
- `05-unit-sheet.png` Cleric · NPC, Move, Delete, What do they do?
- `06-move-chip.png` Moving Cleric · Tap a tile
- `07-start-new.png` Start new warning (4b text)
- `08-free-roam.png` No enemies: free roam. Team start tiles stay
- `09-play.png` play stage opened by Test, placed units on the board. The YOUR TURN banner is still up

## Helpers & self-review
- Helper: mapped the save path, the one parser, the build URL for templates, `readSetup`, `playDocsOf`, the demo cells, the law plant, the 4a smoke's exact choice text, and the format sentence for the talk limit. No product code from that pass was kept until it compiled and the named tests passed.
- Self-review: Add here on an empty open tile lists Your team start, NPC, and Enemy only when the pool is fixed, done; those rows are hidden on a closed or occupied tile, done; What do they do? is Just stand here and Talk only, done; the talk setup is filled from the skeleton with a new `setup_<ULID>`, a user line, and default knobs with no value, done; the field limit is the slice `max_len` at runtime, done; empty line allowed, done; Move, Delete, and the refuse sentences done; Delete has no confirm and leaves the setup file, done; Start new clears ground, neutrals, and fixed enemies, keeps player starts, and is one undo, done; undo covers place, move, delete, What do they do?, and Start new, and a paint undo is still one map snapshot, done; "No enemies: free roam." done; "No player side: Test never reaches an outcome." done; no side, facing, or kind on a placement, done; no `JSON.parse` and no kind or formatVersion literal in the stage editor or a second parse in the maker, done; Path and Dirt stay hidden, done; 4a smoke still passes, done; no play-stage change, S0 not run, done; line gate 306 insertions + 34 deletions = 340 and smoke 49 done.

## Decisions & deviations
- Path and Dirt stay hidden, not greyed. The 4a smoke requires the Add here `.choice` text to be exactly Floor, Water, Wall block, and the play stage still draws only water and wall-block besides floor. There is line budget left. The 4a smoke is why they stay out, not the cap. 4c can add them.
- Place rows and Move, Delete, and What do they do? are `.btn`, not `.choice`. The 4a smoke reads `.choice` and would fail if those rows were choices. Occupied tiles still show the Floor choice and the sentence "A unit stands here".
- `tools/maker/stage.ts` is 255 lines, over the about-150 note. The 4b sheets moved to `tools/maker/stage-sheets.ts` (8 lines), which the guide allows. The session, the save, and the click router stayed in `stage.ts`.
- Extra counted file: `tools/maker/home.ts`. Boot parses `setup.talk.json` through `parseProject` and skips it, so the skeleton is not copied into an empty project. The talk field clips to the slice max there. The click path passes `bytes` into the stage session.
- `clearGround` stays. `startNew` calls it, then clears neutrals and fixed enemy entries. 4a still paints through `clearGround`.
- Pills say Enemy, not Foe. A hostile side that is not the player side is Enemy. Sheet titles use Your team, NPC, and Enemy.
- A stage with no player side shows "No player side: Test never reaches an outcome." That sentence is the extra product rule, not a guide line. It sits with the free-roam line when both apply.
- The Enemy row is absent, not greyed, when `enemyPool.mode` is not fixed. A closed tile refuses a move with "<label> blocks units" (Water → "Water blocks units"). An occupied tile says "A unit stands here".
- Undo stores either a raw map (a paint snapshot, detected by `cols` being a number) or `{ map?, stage? }`. One snapshot per edit. The stack is dropped when the project id or the stage id changes, or the page reloads. It is not written into the project. A long session keeps one clone per edit, the same bound as 4a. Setup files are never deleted.
- `Date.parse` and `crypto.getRandomValues` stay in the maker. `src/` does not call them. The setup id is `setup_` plus the existing `ulid`. No new dependency.
- The maker-law plant flags `formatVersion` or `"kind":` in any `.ts` file under a `stage` directory. The one `JSON.parse` in `tools/maker` stays in `project-files.ts`.

## Next step (optional proposal)
- 4c can add Path and Dirt if it also updates the play-stage frames and accepts that the 4a choice list will change.
