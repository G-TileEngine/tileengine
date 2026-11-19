# Hand-back step-03-test r2
Step file: docs/maker/steps/step-03-test.md
Base commit: fdf29002ae7438152a1593a8529acecf6292b3f6     Code head: ca9d603a0050a137b226a22849f46f587663fbe4     Tree: d0f7a15ee7ec76707c0a20fb41bae92b111753b5     Branch: step/step-03-test-r1-chatA     PR: opened by Chief Of Staff from the branch
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
M	tools/maker/index.html
M	tools/maker/project.ts
A	tools/maker/test-launch.ts
M	tools/play-stage/page.ts
M	tools/play-stage/project.ts

## Green
npm test: 1049/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
N = 8 new tests. Floor 1041 + 8 = 1049. Line gate on this code head, `git diff --shortstat fdf29002ae7438152a1593a8529acecf6292b3f6..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s3-test/**' ':!handback/**'`: 266 insertions + 33 deletions = 299. Smoke script: 129 lines.
```
# tests 1049
# pass 1049
# fail 0
# skipped 0
# todo 0
```
Stamp: `4d2ee9e86927`. Command: `node tools/maker/build.ts /tmp/maker-step3-r2` at the code head. Output: `/tmp/maker-step3-r2/maker/index.html`, `/tmp/maker-step3-r2/maker/4d2ee9e86927/`, `/tmp/maker-step3-r2/play-stage/4d2ee9e86927/index.html`, `/tmp/maker-step3-r2/build.json` (commit ca9d603a0050a137b226a22849f46f587663fbe4).

## Smoke
sha256 of handoff/steps/tests/s0-play-input/touch-smoke.mjs: d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941 (matches the frozen kit; not edited).
Browser: Google Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome` (this sandbox has no `/usr/bin/google-chrome`).
S0, `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`:
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
This step, `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798`:
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

## Screenshots
390×844, light, device scale 1. Served the release build above on 127.0.0.1. Google Chrome.
- [01-project-test.png](01-project-test.png) — project screen, Test enabled in the primary style.
- [02-blocked.png](02-blocked.png) — Can't play yet, with the map sentence and Fix.
- [03-play-back.png](03-play-back.png) — play stage opened by Test, Back to maker in the top bar, maker hidden.
- [04-missing.png](04-missing.png) — `?project=missing` shows the error and Back to maker, not the fixture.

## Shipped tests (sha256, unchanged)
This step ships no frozen test file and lists no test sha256 to copy. The new tests are written here. The existing one-parser scan is unchanged; a second test was added beside it.

## Helpers & self-review (required)
- Helper review of the r2 diff against docs/qa/step-03-review.md must-fixes 1–5 (hide, favicon, army throw, launch order, tests). It had not returned before this hand-back. Self-review below is the check that landed.
- Self-review must-fixes: `.app[hidden] { display: none }` is the line after `.app`, and s3 check 8 asserts elementFromPoint at the Test box is not that button, done. `<link rel="icon" href="data:,">` is before `<title>`; the smoke still fails on any console error, done. `play: army` is thrown again and both hp/atk 1 defaults are gone. `openProject` builds docs, calls `docsToInput` in one try, and returns `{ docs: null, error: e.message }` on a throw, done. `play: seed` and `play: army` use the review's sentences. A blocked open shows that sentence on the Can't-play-yet sheet, not the danger banner. `start` runs before `showUrl`; a throw does not push the URL. `enterPlay` adds the canvas, runs `startMatch`, hides the maker only after it returns, and on a throw removes the canvas and rethrows, done. R-E1 asserts empty looks on the saved demo and `docs: null` / `play: army` on Empty. `test-launch: Empty stays in the maker` and `test-launch: start throws, maker stays` are the two new tests. N = 8, green 1049/0. s3 check 9 empty blocked passes at 390 and 360. Smoke is 129 lines. S0 sha is unchanged. Both smokes print TOUCH SMOKE PASS under Google Chrome. QA checklist G1–G10: done. No token was printed, stored, or committed.

## Decisions & deviations (5–10 lines)
- r2 follows docs/qa/step-03-review.md. The maker hides with `.app[hidden] { display: none }` because `.app { display: flex }` was beating the hidden attribute. The icon link is `data:,` so Chrome does not request `/favicon.ico`. No seed is invented.
- `openProject` probes with `docsToInput`. A throw becomes `docs: null` and `e.message` (`play: army`, `play: seed`). `playLine` turns those two into the review's sentences. Anything else stays as written. Save failures still use the danger banner. Play failures use the sheet.
- `launchTest` calls `start` first. The URL is pushed only after it returns. `enterPlay` hides `#app` only after `startMatch` returns. A throw removes the canvas and rethrows, and `launchTest` turns that into the sheet sentence.
- The Empty smoke step uses an exact button name. `getByRole` name "Empty" also matches the New project card ("Demo or empty") and was creating a second demo. The smoke still fails on any console error. It is 129 lines.
- tools/maker/home.ts and tools/maker/index.html are extra edits. home.ts already owns clicks. index.html is the favicon fix QA asked for. Guidance caps exceeded, total inside 400: tools/play-stage/project.ts is 14 insertions (cap 10) because the readiness try replaced the one-line return; tests/editor/test-gate.test.ts plus tests/tools/play-stage-source.test.ts are 22 + 93 = 115 (cap 90) because Empty, the thrown start, and the parity golden share the source file. Gate: 266 insertions + 33 deletions = 299.
- Dropped `.row` stays dropped. Test stays an enabled primary button. No cache grows with turns or edits.

## Next step (optional proposal)
- Step 4 can use the same Test launch. Fix still only closes the sheet.
