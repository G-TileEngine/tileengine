# Hand-back step-00b-sides-from-data r1
Step file: docs/maker/steps/step-00b-sides-from-data.md
Base commit: 02efdd040ce0384c08b0a51fb310fc7737df7de5     Code head: aeb9a6230164c6219fd818755cd91e643def1255     Tree: ae6496387b00a63ad963dbda4893adbe86816037     Branch: step/step-00b-sides-from-data-r1-chatA     PR: opened by Chief of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	tests/tools/play-stage-sides.test.ts
M	tools/play-stage/board.ts
M	tools/play-stage/hud.ts
M	tools/play-stage/load.ts
M	tools/play-stage/looks.ts
M	tools/play-stage/match.ts
A	tools/play-stage/sides.ts

## Green
`npm ci && npm run green` exits 0. N = 7 new tests. Floor 1053 + 7 = 1060.
npm test: 1060/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
```
# tests 1060
# pass 1060
# fail 0
# skipped 0
# todo 0
```
Line count at the code head, `git diff --shortstat 02efdd040ce0384c08b0a51fb310fc7737df7de5..aeb9a6230164c6219fd818755cd91e643def1255 -- . ':!handback/**'`: 7 files changed, 130 insertions(+), 37 deletions(-). 130 insertions + 37 deletions = 167.
P2 ("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===") passed with no edit to `one-parser.test.ts`.

## Sides
Each of the 7 failed on the base `02efdd0` before the change (0 pass, 7 fail). Tests 1, 2, 3 and 5 threw on a missing `play.sides`. Test 4's villager log assertion was false. Test 6 compared the wolf pixel with `TEAM.enemy`, which did not exist. Test 7 found `wolves` in `board.ts`.
✔ sides: the demo builds [player, wolves] from data, wolves act on End Turn, and the turn returns
✔ sides: an enemy pool on the default side 'rival' gets enemy turns and can be wiped for a win
✔ sides: a stage with one side at start is free roam: no outcome, End Turn returns to the player
✔ sides: a neutral placed with side = the enemy side ('rival') acts and is targetable
✔ sides: a neutral with no side is never targeted, never acts and is not counted for the wipe
✔ sides: unit colour comes from side, not the recipe
✔ sides: no play-stage file names the wolves or reads a recipe team

## Parity
✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
`sha256sum tests/tools/golden/demo-parity.json` on the base and on the tip: both `90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839`.
`git diff --stat 02efdd040ce0384c08b0a51fb310fc7737df7de5..HEAD -- tests/tools/golden/` is empty.

## Smoke
`sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs`: `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (unedited).
Browser: `/usr/local/bin/google-chrome`. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. Scripts unchanged.
S0, port 8797:
```
ok   1 select @390: ok
ok   2 walk @390: ok
ok   3 attack @390: ok
ok   4 pan then select @390: ok
ok   5 talk @390: ok
ok   6 end turn @390: ok
ok   7 buttons @390: ok
ok   1 select @360: ok
ok   2 walk @360: ok
ok   3 attack @360: ok
ok   4 pan then select @360: ok
ok   5 talk @360: ok
ok   6 end turn @360: ok
ok   7 buttons @360: ok
TOUCH SMOKE PASS
```
Step 3, port 8798 (`handoff/steps/tests/s3-test/touch-smoke.mjs`):
```
ok   1 select @390: ok
ok   2 walk @390: ok
ok   3 attack @390: ok
ok   4 pan then select @390: ok
ok   5 talk @390: ok
ok   6 end turn @390: ok
ok   7 buttons @390: ok
ok   8 back to maker @390: ok
ok   9 empty blocked @390: ok
ok   1 select @360: ok
ok   2 walk @360: ok
ok   3 attack @360: ok
ok   4 pan then select @360: ok
ok   5 talk @360: ok
ok   6 end turn @360: ok
ok   7 buttons @360: ok
ok   8 back to maker @360: ok
ok   9 empty blocked @360: ok
TOUCH SMOKE PASS
```
Step 4a, port 8799 (`handoff/steps/tests/s4a-stage-paint/smoke.mjs`):
```
ok   1 grid @390: ok
ok   2 sheet @390: ok
ok   3 paint @390: ok
ok   4 occupied @390: ok
ok   5 undo @390: ok
ok   6 test @390: ok
ok   7 start new @390: ok
ok   8 reload @390: ok
ok   1 grid @360: ok
ok   2 sheet @360: ok
ok   3 paint @360: ok
ok   4 occupied @360: ok
ok   5 undo @360: ok
ok   6 test @360: ok
ok   7 start new @360: ok
ok   8 reload @360: ok
SMOKE PASS
```

## Decisions & deviations
- The guide's line numbers were re-checked on `02efdd0` before the edit and still match: `match.ts` SIDES 15, wipe 25, side 26, finish 38–48, pump 67, landed 80, endTurn 113 and 117, recentre 123, view 136, ready 152, feed 155; `board.ts` bake 45, createPlayer 73, worn 76, scene 132; `looks.ts` dressPx 34–41; `load.ts` TEAM 6; `hud.ts` 25 and 28. Step 4a had not moved them.
- `me` is `"player"` when `stage.sides.loadout` is not a string. That is the format default (§6.5), the same one `resolvePlacements` already uses, not a silent default.
- `contest` is true only when two or more non-neutral sides have a unit. `order` always starts with `me`, so a one-side stage is `["player"]` and free roam never calls `wipeRule`.
- `TEAM.wolves` is renamed `TEAM.enemy` at the same hex `0xb23b32`. No new colour and no new art. Recipe names and ids are unchanged. `Recipe.team` is gone.
- The sheet id is `play:anim:<recipe>@<paint>`. The scene sprite id stays the recipe id for the first paint of that recipe, so the demo sprites stay `starter:hero-sword`, `starter:enemy-wolf`, `starter:hero-staff` and `starter:npc-villager`. A later unit of the same recipe in another paint uses `<recipe>@<paint>`. A plain `play:anim:<recipe>` with no `@` paints neutral. `play:anim:constructor` stays undefined. `pixelsOf` of a plain recipe id bakes `TEAM.neutral`.
- The paint map is built once per match from the units present at start. It does not grow with frames. No file under `src/` changed. Path and Dirt are not this step. `tools/host-example/` and `scripts/sim.ts` are untouched.
- Every file is inside its cap: sides.ts 12 (cap 25), match.ts +15/−17 (cap 35), board.ts +8/−5 (cap 20), looks.ts +3/−2 (cap 10), load.ts +10/−10 (cap 22), hud.ts +3/−3 (cap 8), the new test 79 lines (cap 110). No extra product file.

## Helpers & self-review
- Helper: mapped `createMatch`, `units.all`, the log actor (instance id), `targetsFor`, the pixel path, `createPlayer`, and the End Turn drain, and re-checked the guide's line numbers on this base. Those facts are what the seven tests use. No product change came from it.
- A second helper was asked to review the diff against the Done-when and Must-not lists. It had not returned by hand-back, so the checks below are the self-review.
- Self-review: sides from `sidesOf` once per match done; free roam skips `wipeRule` done; no hard-coded side in `match.ts` done; neutral stays out of `order` and a sided neutral acts done; colour is `paintOf` and `TEAM.enemy` done; sprite ids stable and the plain bake is neutral done; no `src/` edit done; no existing test, golden, fixture or smoke script edit done; no new dependency done; no `JSON.parse`, `formatVersion` or `kind ===` in `tools/play-stage` done; document keys in `sides.ts` use `Object.hasOwn` done; no empty catch done. Green 1060/0, lines 130 insertions + 37 deletions = 167, parity, and the three smokes done.
