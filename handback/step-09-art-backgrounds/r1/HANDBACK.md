# Hand-back step-09-art-backgrounds r1
Step file: docs/maker/steps/step-09-art-backgrounds.md (r2, sha256 0de2c56f5ca87046b9938f74c87289e9d82f61282abb2303e92574aeb9ac5a03, 145 lines).
Base commit: 6e9d624fe560558a98a38195bbd5e8260619f973     Code head: f1fe4d14866ea79200c37d7b00f1fdcbb5ff4af5     Code head tree: 9842ca58a62003a1e9d7b3d2fe1880c9f887fe51     Branch: step/step-09-art-backgrounds-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged.

## Changed files
```
A	handoff/steps/tests/s9-art-backgrounds/smoke.mjs
M	src/editor/project/test-gate.ts
M	src/project/load/read-project.ts
M	src/runtime/render/chunk-plan.ts
M	src/runtime/render/draw-list.ts
M	src/runtime/render/index.ts
M	src/runtime/render/types.ts
A	tests/editor/art-backgrounds.test.ts
A	tools/maker/asset-check.ts
M	tools/maker/session.ts
M	tools/maker/store.ts
M	tools/maker/test-launch.ts
A	tools/play-stage/backdrop.ts
M	tools/play-stage/board.ts
M	tools/play-stage/load.ts
M	tools/play-stage/looks.ts
M	tools/play-stage/page.ts
M	tools/play-stage/project.ts
```
`git diff --shortstat 6e9d624fe560558a98a38195bbd5e8260619f973..f1fe4d14866ea79200c37d7b00f1fdcbb5ff4af5 -- . ':!handback/**'` is `18 files changed, 261 insertions(+), 28 deletions(-)`. 261 + 28 = 289. Under 400.

Caps (insertions + deletions): read-project 9/10, test-gate 4/5, types+index 6/8, draw-list 6/9, chunk-plan 8/10, backdrop.ts 14/22, load+project 7/10, page.ts 16/17, looks+board 10/15, store+test-launch 20/21, asset-check 25/30, session 8/14, art-backgrounds.test.ts 109/155, s9 smoke 47/70.

## Green
`npm ci` (135 packages) then `npm run green` on this code head exited 0. Floor 1134. Node's test runner prints `ok`, not `✔`.
```
# tests 1134
# pass 1134
# fail 0
# skipped 0
# todo 0
```
```
ok 102 - background refs: a missing asset is brokenRef, out-of-range depth and over 3 layers warn
ok 103 - backdropOf keeps file order, clamps depth, defaults repeat, and skips a layer with no asset
ok 104 - draw list: the backdrop draws first, at whole art px, by depth
ok 105 - chunked list draws the backdrop once, before the ground chunks
ok 106 - store: readTree skips assets, readBlob reads bytes, trash moves assets
ok 107 - test launch hands the stage its background and an art reader
ok 108 - autosave: two links in a row write in order, and each write reads the slot once
ok 109 - asset files (D29): a missing or changed file is H4 when a selected stage uses it, a warning when unused, and Test is refused naming the file
ok 110 - advancedRenderInactive (D29): one info row per stored field while advanced render is off, and nothing is rewritten
```
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three base errors only: `tools/effect-designer/page.ts(101,28)`, `tools/maker/home.ts(85,221)` and `tools/maker/home.ts(85,266)`. No new error. typecheck exit 0, lint exit 0, deps exit 0 (176 modules, 500 dependencies), check:state exit 0, check:law exit 0.

## Smoke
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell node handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1`
```
ok   1 new @390: ok
ok   2 no background @390: ok
ok   3 painted @390: ok
ok   4 assets @390: ok
ok   5 missing @390: ok
ok   6 won't open @390: ok
ok   1 new @360: ok
ok   2 no background @360: ok
ok   3 painted @360: ok
ok   4 assets @360: ok
ok   5 missing @360: ok
ok   6 won't open @360: ok
SMOKE PASS
```
s8 file sha256 `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited. `node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1 step-09-art-backgrounds`
```
ok   1 new @390: ok
ok   2 upstairs @390: ok
ok   3 stairs down, autosave on @390: ok
ok   4 game starts upstairs, stairs up @390: ok
ok   5 start can't be deleted @390: ok
ok   6 test starts upstairs, stairs autosave @390: ok
ok   7 continue @390: ok
ok   8 targets @390: ok
ok   1 new @360: ok
ok   2 upstairs @360: ok
ok   3 stairs down, autosave on @360: ok
ok   4 game starts upstairs, stairs up @360: ok
ok   5 start can't be deleted @360: ok
ok   6 test starts upstairs, stairs autosave @360: ok
ok   7 continue @360: ok
ok   8 targets @360: ok
SMOKE PASS
```
S0 file sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, unedited. `node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`
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
Browser: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. Shots were not committed.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run from `/tmp/s9-audit.mjs` (not committed). Release builds, dev false, commit 40 zeros. `grep -R -F` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save`, and `find` for `catalogue.json.js` / `behaviours.json`:
```
play	132 files	grep empty	find empty
baseline	146 files	grep empty	find empty
maker play-stage	132 files	grep empty	find empty
```

## Shipped tests (sha256)
The step file does not pin a shipped test. The new test file, as committed:
```
152d933341ede8e55c0368646f592b922340cc74414885cf926af98fb823d135  tests/editor/art-backgrounds.test.ts
```
No existing test or smoke was edited. s8 and S0 shas are above.

## Helpers & self-review
- Helper c304b00e: D29 asset rows, H4 severity, v4 map migration, test-gate sentences, and test 8's v4 assertion → PASS. Migration is a clone; a format-4 `mode: "image"` missing file is hard; `none`/`colour` stays a warning; excluded stages do not count.
- Helper b078511f: draw path (Rules 3, tests 3–4), integer origin, repeat, zero-size skip, chunked once-first, no `backdrop: undefined` → PASS.
- Helper 7a88f154: Law 12, floor rule, backdropOf, scene memo → two findings. (1) An `art()` throw rejected `Promise.all` and dropped a sibling that had already decoded. Fixed in the code head: the read sits in the same `try`, the note is `Background picture <file> couldn't be opened`, `failed` increments, and the other layers still settle. (2) `board.scene()` already allocates a new `assets` object every call, so the link scene identity changes every frame and the driver already redrew. That predates 9a; the trial did not cache it. The merged scene is still memoised on the link scene identity. Not changed (looks+board stays 10/15).
- Helper 36534f9e: store readBlob/readTree/movePrefix, `play()` art on the next stage, writeAutosave queue and one slot read, tests 1–9 → PASS. Only new test file under `tests/`.
- Self-review: Rules 1–8 done. Named tests 1–9 done (each asserts the guide's outcome). Done-when: green 1134/0 done; tools tsc only the 3 base errors done; 289 ≤ 400 and every cap kept done; s9 12 ok SMOKE PASS done; s8 16 ok SMOKE PASS done; S0 14 ok TOUCH SMOKE PASS done; export audit empty done. QA G1 tests green done; G2 src typecheck exit 0, no new ignore/any done; G3 check:state done; G4 Backdrop matches the guide's `{sheet, depth, repeat}` done; G5 no core/sim/types/rules/data/fixtures/behaviour-library/painter-proto/ui-shell and no existing test edit done; G6 only the build-table files done; G7 289 and per-file caps done; G8 check:law and one-clock done (no new rAF, timer, or loop); G9 decisions below done; G10 acceptance lines done.

## Decisions & deviations
- Report rows keep the existing shape. `advancedRenderInactive` detail is the field name (`pixelPerfect` or `fit`) and the path is the file path. Asset rows use path `assets/<id>.<ext>` and detail the asset id. No new report code. Nothing is rewritten: `pixelPerfect: false` and `fit` cover/stretch stay stored and are read as true / `none` while `advancedRender` is not exactly `true`.
- `assetRows` runs `migrateProject` on a copy before deciding hard or warning, so a format-4 map's `background.assetId` counts as a layer (map 004). The stored project is not migrated by the check. An unused missing file stays a warning and the index entry stays.
- The night wash (`WASH` 0.5, darkness 9/32) tints the board. The smoke treats washed `#ff00ff` as magenta when `r ≥ 160`, `g ≤ 30`, `b ≥ 160`, and washed `#00ffff` as cyan when `r ≤ 30`, `g ≥ 160`, `b ≥ 160`. At 390 that is 77,824 and 86,528 px. A blend pixel is one whose blue leads both other channels by more than 20, so a smeared seam counts and the board's grey-blue `149,168,183` does not. Plain floor goes bare only after at least one layer drew.
- A throw from `art()` (OPFS `readBlob` rethrows anything other than not-found or type-mismatch) uses the same "couldn't be opened" note as a file that is not a picture. A null blob stays the "missing" note. Each adds 1 to `stats.failed`.
- `writeAutosave` keeps `queue = run.catch(() => undefined)` so the caller still receives the error and the next write is not blocked. Each write calls `readAutosave` once.
- Backdrop depth clamps to 0..1 at look time (absent or not finite = 1). A repeat that is not `none|x|y|both` is `none`. `fit` is ignored. No new dependency, no upload screen, no byte writer.

## Next step
- 9b is the upload editor (D29 3): sniff png/jpg/webp, refuse anything else before a write, and bound the decoded pixel size. Duplicate should copy `assets/` with that writer. The project screen does not show the H4 rows yet; only Test does.
