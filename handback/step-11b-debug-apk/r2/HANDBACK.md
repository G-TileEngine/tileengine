# Hand-back step-11b-debug-apk r2
Step file: docs/maker/steps/step-11b-debug-apk.md (r3, sha256 46c01ee40d0cc672b03d90d52d44aae81032c33e7963508f8e71e24de81dd435, 140 lines). The guide is not in this branch. QA review: docs/qa/step-11b-handback-review.md on main 246033478360f6cec1ded7a118081920d9c95ec3 (sha256 f75650dd49c792ad1fac20ad9a71f0ae645e9a35cea8ece0427f2e9932382032, 31 lines).
Base commit: 773eb8c84f3ed886ccc25b88ddfa1ea6eb0770a9     Code head: ded0e331f395d3199f531decf823ef5050cb57cf     Code head tree: 2f92d8150642549e9ce32a1429b9219212dc7e78     Branch: step/step-11b-debug-apk-r2-chatA     PR: opened by Chief of Staff from the branch
Started from the r1 tip 68e6db8d2bf1ab2abe37c8e8af701607aaf25e89. New commits only. No rebase and no force-push.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged and was not pushed. The builder does not publish.

## Changed files
Against the base, the same six build-table files. Against the r1 tip, only the two must-fixes:
```
M	tests/tools/apk-11b.test.ts
M	tools/apk/debug-apk.sh
```
`git diff --shortstat 773eb8c84f3ed886ccc25b88ddfa1ea6eb0770a9..ded0e331f395d3199f531decf823ef5050cb57cf -- . ':!handback/**'` is `6 files changed, 263 insertions(+), 7 deletions(-)`. 263 + 7 = 270. Under 400.

Caps (insertions + deletions against the base): build.ts 72+6−/80, setup-sdk.sh 27/30, debug-apk.sh 36/36, eslint.config.mjs 1+1−/2, apk-11b.test.ts 75/80, smoke.mjs 52/52. debug-apk.sh is at its cap, not over. No other file changed in r2. The test file is still 75 lines: the two `assert.throws` gained matchers and no new line.

## Green
`npm ci` (135 packages) then `npm run green` exited 0 on the code-head tree, before the APK rebuild and again after it (a built `tools/apk/android/`, `www/` and `artifacts/` present). Floor 1170. Node's test runner prints `ok`, not `✔`.
```
# tests 1170
# pass 1170
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 179 modules, 506 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L91.

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback` and `git clean -fd -- handback`). Browser: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. `CHROME` was set. No retry (s3 and s8c passed on the first solo run).
- S0 `handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797` — 14 ok, TOUCH SMOKE PASS.
- s3 `handoff/steps/tests/s3-test/touch-smoke.mjs . 8798` — 18 ok, TOUCH SMOKE PASS.
- s4a `handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` — 16 ok, SMOKE PASS.
- s4b `handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` — 16 ok, SMOKE PASS.
- s4c `handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801` — 16 ok, SMOKE PASS.
- s5a `handoff/steps/tests/s5a-units/smoke.mjs . 8802` — 16 ok, SMOKE PASS.
- s5b `handoff/steps/tests/s5b-abilities/smoke.mjs . 8803` — 16 ok, SMOKE PASS.
- s5c `handoff/steps/tests/s5c-add-ability/smoke.mjs . 8804` — 16 ok, SMOKE PASS.
- s6a `handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805` — 18 ok, SMOKE PASS.
- s6b `handoff/steps/tests/s6b-levels/smoke.mjs . 8806` — 16 ok, SMOKE PASS.
- s6c `handoff/steps/tests/s6c-checkpoint/smoke.mjs . 8807` — 18 ok, SMOKE PASS.
- s6d `handoff/steps/tests/s6d-baseline/smoke.mjs . 8808` — 14 ok, SMOKE PASS.
- s7 `handoff/steps/tests/s7-stage-links/smoke.mjs . 8809` — 20 ok, SMOKE PASS.
- s8 `handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1` — 16 ok, SMOKE PASS.
- s9 `handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1` — 12 ok, SMOKE PASS.
- s8c `handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1` — 8 ok, SMOKE PASS.
- s9b `handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1` — 14 ok, SMOKE PASS.
- s9c `handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1` — 6 ok, SMOKE PASS.
- s10b `handoff/steps/tests/s10b-effect-data/smoke.mjs . 8815 r1` — 8 ok, SMOKE PASS.
- s10c `handoff/steps/tests/s10c-effect-editor/smoke.mjs . 8816 r1` — 8 ok, SMOKE PASS.
- s10d `handoff/steps/tests/s10d-builtin-effects/smoke.mjs . 8817 r1` — 8 ok, SMOKE PASS.
- s11a `handoff/steps/tests/s11a-export-mvp/smoke.mjs . 8818 r1` — 6 ok, SMOKE PASS.
- s11a2 `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs . 8822 r1` — 6 ok, SMOKE PASS.
- s11b `handoff/steps/tests/s11b-debug-apk/smoke.mjs . 8820 r1` — 6 ok (3 at 390 and 3 at 360), SMOKE PASS.
Mutations, each restored from an in-memory snapshot before the code commit (`/tmp/s11b-mutate.mjs`). After the last restore the apk tests passed and the diff was only the two r2 files.
- N1 main's `patchGradle` regex: caught (test 1).
- N6 main's `"<activity "` replace: caught (test 1).
- N9 INTERNET kept: caught (test 1).
- N2 `debugGlobals` dropped: caught (test 2).
- N3 missing-file check dropped: caught (test 2).
- N4 leaves-www check dropped: caught (test 2).
- N7 `networkUrls` dropped: caught (test 2).
- N8 `playOnly` dropped: caught (test 2).
- N5 `demoZip` building a dev tree: caught (test 3).
- N10 `zipCommit` returning a constant: caught (tests 2 and 3).
- N11 `demoZip` with the body kept and no `try`/`finally`: caught (test 3).
- N12 Temurin `sha256sum -c` removed: caught (test 3).
- N13 `demoZip` handing `gameZip` no play files: caught (test 3).
- N14 `gameWww` writing empty files: caught (tests 2 and 3).
- N15 `debug-apk.sh` not handing the zip to `--game`: caught (test 3).
- N16 the `apk: no minSdk` throw deleted: caught (test 1). Restored.

Relative zip, from the repo root, after the code commit: `sh tools/apk/debug-apk.sh game.zip` where `game.zip` is a relative path (a `demoZip` of commit `a` repeated 40 times, 770220 bytes, not committed). Exit 0. It wrote `artifacts/TileEngine-fee037048772-debug.apk` (sha256 `90e62ae23bd6bd2b6ec71f3cb8d25ec1cb62d91e3414b20a1a6450f0278fb374`). No ENOENT. `game.zip` was then deleted.

## Export audit
Written and run as `/tmp/s11b-audit.mjs` (not committed). Three builders, commit `"0".repeat(40)`, dev false: `tools/play-stage/build.ts` `build(out, commit, root, false)` all files; `tools/baseline/build.ts` `build(out, commit, root)` all files; `tools/maker/build.ts` `build(out, commit, root, false)` only paths that start with `play/` or contain `play-stage`. Walk: no file name matching `tools/maker`, `src/editor`, `catalogue.json.js` or `behaviours.json`, and no file content matching `tools/maker`, `src/editor`, `tileengine/saves` or `session-save`.
```
play	135 files	hits 0
baseline	149 files	hits 0
maker	149 files	hits 0
135 / 149 / 149
AUDIT PASS
```

## APK
Command, after the code commit, tracked tree clean: `sh tools/apk/debug-apk.sh` (no zip, the demo). `JAVA_HOME=/tmp/te-sdk/jdk-17.0.21.1+2` (Temurin 17.0.21.1+2). `ANDROID_HOME=/tmp/te-sdk/android-sdk` (cmdline-tools 11076708, platform-tools 37.0.3, platforms;android-34, build-tools 34.0.0). Not sent anywhere. Gitignored.
File: `tools/apk/artifacts/TileEngine-48e26e52b4b1-debug.apk`. Size: 3921729 bytes. sha256: `0f84f26037452c1184dfc72991122873c64a21d34f8bd02c8ee1939f76235436`.
`aapt2 dump badging`: `package: name='com.tileengine.play'`, `sdkVersion:'26'`, `targetSdkVersion:'34'`, one `uses-permission` (`com.tileengine.play.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`). No `android.permission.INTERNET`.
Manifest: the activity source line is `android:screenOrientation="portrait"`. `aapt2 dump xmltree` on `com.tileengine.play.MainActivity` has `android:screenOrientation=1` (portrait).
`apksigner verify --print-certs`: Signer #1 certificate DN: `C=US, O=Android, CN=Android Debug`.
`unzip -l` shows `assets/public/project/files.js` (139239 bytes). `assets/public/index.html` has `data-game="project/files.js"`.
`artifacts/apk-build.json` names commit `ded0e331f395d3199f531decf823ef5050cb57cf` (the demo zip's `build.json`, which is HEAD).

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. As committed at the code head:
```
c6cb7e0bf8d9cf1a9f60a25360d7563a019d95bf7f1466fe6e92c83f800ac500  tests/tools/apk-11b.test.ts
9c313e5b942d0234f82d35f15e7d95eaac335f404a78d925534fdc60ee1cb96d  handoff/steps/tests/s11b-debug-apk/smoke.mjs
```
The test is 75 lines. The smoke is 52 lines and was not edited in r2. `tests/tools/apk.test.ts` was not edited.

## Helpers & self-review
No helper agent this round.
- `/tmp/s11b-allsmoke.sh` (not committed, the r1 script reused): ran the 24 smokes solo, set `CHROME`, restored `handback` after each. `SUITE_FAIL=0`. No retry.
- `/tmp/s11b-audit.mjs` (not committed, the r1 script reused): the export audit above. AUDIT PASS.
- `/tmp/s11b-mutate.mjs` (not committed): N1–N15 from r1, with N11 now the valid no-cleanup body and N16 added (delete the `apk: no minSdk` throw). In-memory snapshots, not `git checkout`. `MUTATE_FAIL=0`. Restored tests passed. Not committed.
- Self-review: must-fix 1 done (test 1's two `assert.throws` match `/apk: no minSdk/` and `/apk: no activity/`; N16 fails test 1 and was restored). Must-fix 2 done (`realpath` before `cd`; from the repo root a relative `game.zip` exits 0). Nothing else in any product file changed. Rules 1–5 otherwise unchanged from r1. Green 1170/0 before and after the demo APK done. Tools tsc only the 3 base errors done. 270 ≤ 400 done. Every cap kept (debug-apk.sh 36/36). All 24 smokes PASS done. N1–N16 recorded done. Export audit 135/149/149 done. § APK rechecked on the rebuilt demo. Helpers and decisions are each written once. No release signing, keystore, password or `.jks`. No APK, `android/`, `www/`, `artifacts/` or lock file committed. No token in the repo, no main push, no tag, no PR.

## Decisions & deviations
- Test 1's first bare tree still has no minSdk line, so the expected error is `/apk: no minSdk/`. After `variables.gradle` is added, the manifest still has no `<activity`, so the expected error is `/apk: no activity/`. No other assertion moved.
- `debug-apk.sh` sets `ZIP=${1-}` and, when that is non-empty, `ZIP=$(realpath "$ZIP")`, both before `cd "$HERE"`. Each `if` body is its own line. No argument still runs `node build.ts --game` with no path. `--game "$ZIP"` is unchanged. The file is 36 lines, the cap.
- The relative-path proof used a throwaway `game.zip` in the repo root. It is not a product file and was deleted before this commit. The § APK numbers are the no-zip demo, not that zip's APK.
- Counted size against the base is 270. No line was wrapped, split or joined to fit a cap. No behaviour outside the two must-fixes was changed.

## Next step
- Nothing in step 11 is blocked by 11b (11c is independent). QA's carries (a CLI test for `refuse` and for meta beside `www`, `zipCommit` on pretty JSON, temp dirs left by tests 2 and 3, `setup-sdk.sh` not re-runnable, unversioned platform-tools, the WebView `structuredClone` floor) stay open. No publish is part of 11b.
