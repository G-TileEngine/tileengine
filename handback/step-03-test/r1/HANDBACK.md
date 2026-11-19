# Hand-back step-03-test r1
Step file: docs/maker/steps/step-03-test.md
Base commit: fdf29002ae7438152a1593a8529acecf6292b3f6     Code head: 24650f3d0f96d2f80feaa6dd5a3c512dd94deade     Tree: 1d2023e796411637ec1514b848cf60f597d65b48     Branch: step/step-03-test-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	handoff/steps/tests/s3-test/touch-smoke.mjs
A	src/editor/project/test-gate.ts
M	tests/editor/maker-law.test.ts
M	tests/editor/project-home.test.ts
A	tests/editor/test-gate.test.ts
M	tests/project/load/one-parser.test.ts
M	tests/tools/maker-build.test.ts
A	tests/tools/play-stage-source.test.ts
M	tools/maker/app.css
M	tools/maker/build.ts
M	tools/maker/home.ts
M	tools/maker/project.ts
A	tools/maker/test-launch.ts
M	tools/play-stage/page.ts
M	tools/play-stage/project.ts

## Green
npm test: 1047/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
N = 6 new tests. Floor 1041 + 6 = 1047. Line gate on this code head, `git diff --shortstat fdf29002ae7438152a1593a8529acecf6292b3f6..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s3-test/**' ':!handback/**'`: 232 insertions + 32 deletions = 264. Smoke script: 117 lines.
```
# tests 1047
# pass 1047
# fail 0
# skipped 0
# todo 0
```
Stamp: `6c319159a313`. Command: `node tools/maker/build.ts /tmp/maker-step3` at the code head. Output: `/tmp/maker-step3/maker/index.html`, `/tmp/maker-step3/maker/6c319159a313/`, `/tmp/maker-step3/play-stage/6c319159a313/index.html`, `/tmp/maker-step3/build.json` (commit 24650f3d0f96d2f80feaa6dd5a3c512dd94deade).

## Smoke
sha256 of handoff/steps/tests/s0-play-input/touch-smoke.mjs: d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941 (matches the frozen kit; not edited).
S0, `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`:
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
This step, `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798`:
```
ok   1 select @390: ok
ok   2 walk @390: ok
ok   3 attack @390: ok
ok   4 pan then select @390: ok
ok   5 talk @390: ok
ok   6 end turn @390: ok
ok   7 buttons @390: ok
ok   8 back to maker @390: ok
ok   1 select @360: ok
ok   2 walk @360: ok
ok   3 attack @360: ok
ok   4 pan then select @360: ok
ok   5 talk @360: ok
ok   6 end turn @360: ok
ok   7 buttons @360: ok
ok   8 back to maker @360: ok
TOUCH SMOKE PASS
```

## Screenshots
390×844, light, device scale 1. Served the build above on 127.0.0.1.
- [01-project-test.png](01-project-test.png) — project screen, Test enabled in the primary style.
- [02-blocked.png](02-blocked.png) — Can't play yet, with the map sentence and Fix.
- [03-play-back.png](03-play-back.png) — play stage opened by Test, Back to maker in the top bar.
- [04-missing.png](04-missing.png) — `?project=missing` shows the error and Back to maker, not the fixture.

## Shipped tests (sha256, unchanged)
This step ships no frozen test file and lists no test sha256 to copy. The new tests are written here. The existing one-parser scan is unchanged; a second test was added beside it.

## Helpers & self-review (required)
- Helper review: asked to check the uncommitted diff against the guide (gate, no demo fallback, import direction, one parser, R-E1 looks, save-fail, line caps). It had not returned before this hand-back. Self-review below is the check that landed.
- Self-review Done when: green 1047/0 including check:state and check:law, done. Empty template openProject has zero canopy and zero braziers; openBundled still has DEMO_LOOKS, done. Clean report is allowed; each S1 §8 hard code has a sentence; warnings do not block, done. Unreadable project and a missing id show an error and do not start, done. `test-launch: save fails, no launch` forces the store write to fail, does not start, and the project screen HTML contains the writeFailed sentence, done. Demo template through Test matches the parity golden and the folder bytes are unchanged, done. P2 existing scan unchanged; maker has one JSON.parse in project-files.ts and no formatVersion or kind ===; no play-stage file imports maker, done. Both smokes PASS at 390 and 360, done. QA checklist G1–G10: done. No token was printed, stored, or committed.

## Decisions & deviations (5–10 lines)
- tools/maker/home.ts is an extra edit. project.ts only paints the Test button. home.ts already owns clicks, so it saves, calls launchTest, boots `?project=`, and comes Back. launchTest takes the start function as an argument instead of importing page.ts, because page.ts uses the DOM and the Node typecheck has no DOM lib. home.ts passes startMatch. Nothing calls openBundled when a project fails.
- The empty template has no unit-roster, so openProject would throw before it could return looks. hp and atk are 1 only when that setup is missing. The demo still reads its roster knobs. openProject returns `{ canopy: [], braziers: [] }`. openBundled copies that result and puts DEMO_LOOKS back.
- Fix closes the blocked list. This step has no editor to open. A failed save shows its own sentence in the danger banner, not the Can't play yet sheet. Every brokenRef uses the guide's map sentence, one sentence per hard code.
- Maker build's fourth argument defaults to false, so the CLI stays a release build. The smoke passes true. Play-stage output uses the same 12-hex stamp, at `play-stage/<stamp>/`. The embedded canvas sets touch-action: none; the play page CSS already had it, and without it the browser ate the pan.
- During Test, the veil's Restart and Back both return to the maker. The HUD already wires both to restart, and this step does not restyle the HUD. The new control is a 48px "Back to maker" button in the top bar.
- Dropped the unused `.row` and `.row .btn` rules. `.project .sheet` keeps the blocked list in the page, like shot 39b, and `.banner` is a flex row so Fix sits on the right. project-home.test.ts now expects an enabled primary Test. maker-build.test.ts also copies fixtures/, because the maker bundle now includes those imports.
- Guidance caps exceeded, total still inside 400: tools/play-stage/project.ts is 11 insertions (cap 10) because openBundled is no longer one line; the two new test files are 22 + 72 = 94 (cap 90) because the parity golden and the save-fail screen share that file. Gate: 232 insertions + 32 deletions = 264. Smoke is 117 lines and is outside the 400. No cache grows with turns or edits.

## Next step (optional proposal)
- Step 4 can use the same Test launch. Fix still only closes the sheet.
