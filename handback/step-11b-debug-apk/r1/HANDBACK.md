# Hand-back step-11b-debug-apk r1
Step file: docs/maker/steps/step-11b-debug-apk.md (r3, sha256 46c01ee40d0cc672b03d90d52d44aae81032c33e7963508f8e71e24de81dd435, 140 lines). The guide is on the base (docs-only). CEO ruling 2026-11-24 18:03 London, as typed: "Since step 11 is an export section. Can add the apk stuff there top [sic: too]". Roadmap docs/maker/roadmap.md at 90c9cb9f, sha256 5f0e95ba6fc9ea8eb3ff140934e4dcc676f1497ad2c00b4fc0088798b4032cf0, L86 and L132. DSK E6 Q4: handoff/dsk-rulings/2026-11-26-step11.md (sha256 b73763e657c283fbfda23eb6017edfbb3a845d0e4f0f301c6590ddba3b0799df). INTERNET dropped by EA ruling 4. Shared app id com.tileengine.play is a CoS ruling.
Base commit: 773eb8c84f3ed886ccc25b88ddfa1ea6eb0770a9     Code head: dfc934713bccba802e79fdd2832086eb80c3dd73     Code head tree: 906453e367e75c7e015559e5bbe0661762775e35     Branch: step/step-11b-debug-apk-r1-chatA     PR: opened by Chief of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged and was not pushed. The builder does not publish. The APK was not sent anywhere.

## Changed files
```
M	eslint.config.mjs
A	handoff/steps/tests/s11b-debug-apk/smoke.mjs
A	tests/tools/apk-11b.test.ts
M	tools/apk/build.ts
A	tools/apk/debug-apk.sh
A	tools/apk/setup-sdk.sh
```
`git diff --shortstat 773eb8c84f3ed886ccc25b88ddfa1ea6eb0770a9..dfc934713bccba802e79fdd2832086eb80c3dd73 -- . ':!handback/**'` is `6 files changed, 259 insertions(+), 7 deletions(-)`. 259 + 7 = 266. Under 400.

Caps (insertions + deletions against the base): build.ts 72+6−/80, setup-sdk.sh 27/30, debug-apk.sh 32/36, eslint.config.mjs 1+1−/2, apk-11b.test.ts 75/80, smoke.mjs 52/52. No build-table file is over its cap. Nothing outside the build table was edited.

## Green
`npm ci` (135 packages; lockfile unchanged) then `npm run green` exited 0 on the code-head tree, before the APK build, and again after it (a built `tools/apk/android/`, `www/` and `artifacts/` present; those three are gitignored and eslint-ignored). Floor 1167 + 3 = 1170. Node's test runner prints `ok`, not `✔`.
```
# tests 1170
# pass 1170
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 179 modules, 506 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L91 (that line did not move). Same three after the APK build.

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback` and `git clean -fd -- handback`). Browser for every run: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. s6d and S0 still default to `/usr/bin/google-chrome`, which is not installed; those files were not edited. `CHROME` was set for the suite. No retry was needed (s3 and s8c passed on the first solo run). s6c's checkpoint fixture lives under `handback` and was restored with it before s6d, s8c and s9c.
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
- s11b `handoff/steps/tests/s11b-debug-apk/smoke.mjs . 8820 r1` — 6 ok (3 at 390 and 3 at 360), SMOKE PASS. Release maker on 8820, the APK `www` on 8821.
Mutations, each restored before the code commit (`/tmp/s11b-mutate.mjs`, in-memory snapshots, not `git checkout`). After the last restore the 11b tests passed and `git diff --shortstat` was still 259 insertions and 7 deletions.
- N1 main's `patchGradle` regex (`minSdkVersion = 22` no longer matches): caught (test 1).
- N6 main's `"<activity "` replace (the newline form is missed): caught (test 1).
- N9 INTERNET line kept: caught (test 1).
- N2 `debugGlobals` dropped from `gameWww`: caught (test 2).
- N3 the missing-file check dropped: caught (test 2).
- N4 the leaves-`www` check dropped: caught (test 2).
- N7 `networkUrls` dropped from `gameWww`: caught (test 2).
- N8 `playOnly` dropped from `gameWww`: caught (test 2).
- N5 `demoZip` building a dev tree: caught (test 3; `gameWww` refuses the zip).
- N10 `zipCommit` returning `"0".repeat(40)` instead of the file's commit: caught (tests 2 and 3).
- N11 `demoZip` without its cleanup: the script's first needle left a bare `try` (a syntax error, reported as not ok 1). A one-off then removed `try`/`finally` and left the body, which is valid and does not delete the temp dir. That form was caught by test 3 only.
- N12 `setup-sdk.sh` Temurin `sha256sum -c` removed (the hash constant left in place): caught (test 3; the file must contain two `sha256sum -c` checks).
- N13 `demoZip` handing `gameZip` no play files: caught (test 3).
- N14 `gameWww` writing empty files: caught (tests 2 and 3).
- N15 `debug-apk.sh` not handing the zip to `--game`: caught (test 3).

## Export audit
Written and run as `/tmp/s11b-audit.mjs` (not committed). Three builders, commit `"0".repeat(40)`, dev false: `tools/play-stage/build.ts` `build(out, commit, root, false)` all files; `tools/baseline/build.ts` `build(out, commit, root)` all files; `tools/maker/build.ts` `build(out, commit, root, false)` only paths that start with `play/` or contain `play-stage`. Walk: no file name matching `tools/maker`, `src/editor`, `catalogue.json.js` or `behaviours.json`, and no file content matching `tools/maker`, `src/editor`, `tileengine/saves` or `session-save`.
```
play	135 files	hits 0
baseline	149 files	hits 0
maker	149 files	hits 0
135 / 149 / 149
AUDIT PASS
```
11b adds no play file.

## APK
Command, after the code commit, with a clean tracked tree: `sh tools/apk/debug-apk.sh` (no zip, so the demo). JDK: Temurin 17.0.21.1+2 (`JAVA_HOME=/tmp/te-sdk/jdk-17.0.21.1+2`, `java -version` OpenJDK 17.0.21.1). SDK: cmdline-tools 11076708, platform-tools 37.0.3, `platforms;android-34` (version 3), build-tools 34.0.0 (`ANDROID_HOME=/tmp/te-sdk/android-sdk`). Installed by `sh tools/apk/setup-sdk.sh /tmp/te-sdk` outside the repo; both downloads matched the pinned sha256.
File: `tools/apk/artifacts/TileEngine-43ff3268fa3c-debug.apk` (the stamp is the first 12 hex of `sha256sum www/build.json`). Size: 3914759 bytes. sha256: `f636aa1613dcf110f413f652c6a8cb8dc6977756b902dd69c9b33754bc83d07c`.
`aapt2 dump badging` (build-tools 34.0.0):
```
package: name='com.tileengine.play' versionCode='1' versionName='1.0' platformBuildVersionName='14' platformBuildVersionCode='34' compileSdkVersion='34' compileSdkVersionCodename='14'
sdkVersion:'26'
targetSdkVersion:'34'
uses-permission: name='com.tileengine.play.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'
```
No `android.permission.INTERNET`. The source manifest's first activity has `android:screenOrientation="portrait"`. `aapt2 dump xmltree` reports `android:screenOrientation=1` (portrait) on `com.tileengine.play.MainActivity`. `apksigner verify --print-certs`: `Signer #1 certificate DN: C=US, O=Android, CN=Android Debug`. `unzip -l` shows `assets/public/project/files.js` (139239 bytes). `assets/public/index.html` carries `data-game="project/files.js"`. `artifacts/apk-build.json` names commit `dfc934713bccba802e79fdd2832086eb80c3dd73` (the demo zip's own `build.json` commit, which is HEAD). The APK, `android/`, `www/`, `artifacts/` and the tools/apk lock file are gitignored and were not committed. The APK was not uploaded or sent.

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. As committed at the code head:
```
597e0ba44e6824cbfdf232ccfe7ee5373300a84a875f586ea3be98cbd6eeb97f  tests/tools/apk-11b.test.ts
9c313e5b942d0234f82d35f15e7d95eaac335f404a78d925534fdc60ee1cb96d  handoff/steps/tests/s11b-debug-apk/smoke.mjs
```
The new test is 75 lines. The new smoke is 52 lines. `tests/tools/apk.test.ts` was not edited. No other test or smoke was edited.

## Helpers & self-review
- Helper 8200ece7-00d0-4ff1-9fa4-e32e10ecb5da: asked to review the uncommitted diff against Rules 1–5, the caps and the must-not list, read-only, and not to edit. It returned no report and was stopped. It changed nothing.
- `/tmp/s11b-allsmoke.sh` (not committed): ran the 24 smokes solo, set `CHROME`, restored `handback` after each. `SUITE_FAIL=0`. No retry.
- `/tmp/s11b-audit.mjs` (not committed): the export audit above. AUDIT PASS.
- `/tmp/s11b-mutate.mjs` (not committed): applied N1–N15 from in-memory snapshots and restored the three product files. `MUTATE_FAIL=0`. The N11 needle in that script left a bare `try` (see § Smoke). The files on disk after the script matched the snapshots.
- One-off (not saved as a file): rewrote `demoZip` to the same body with no `try`/`finally`, ran `node --test tests/tools/apk-11b.test.ts`, and wrote the original bytes back. Test 3 failed; the restore matched. Not committed.
- Self-review: Rules 1–4 done (`patchGradle` sets minSdk 26 in both files and either form, portrait on the first `<activity` plus its whitespace, throws when there is nothing to patch, and drops the INTERNET line; `gameWww` writes `entry.data` and refuses a non-empty www, a path that leaves www, a missing index.html / build.json / project/files.js, and any playOnly, networkUrls or debugGlobals hit; `zipCommit` reads `www/build.json`; `demoZip` is a release play build plus the demo fixture through `gameZip(play, text, {})` with `finally` cleanup; `--game` with no zip refuses a dirty checkout; meta goes to `tools/apk/artifacts/apk-build.json`; both scripts are pinned, and `debug-apk.sh` runs `assembleDebug` only). Rule 5 done: one statement per line in the new tools, shell and test code; the only edited dense line is the CLI usage string; the smoke keeps the s10c layout. Named tests 1–3 use the guide's titles. Done-when: green 1170/0 before and after the APK done; tools tsc only the 3 base errors done; 266 ≤ 400 done; every cap kept done; all 24 smokes PASS at the guide counts, no retry, done; mutations recorded done; export audit 135/149/149 done; § APK filled from the demo build. QA G1 the plants above fail when the matching behaviour is reverted. G2 root typecheck exit 0. G3 no new phase writes. G4 no quoted interface changed. G5 nothing in src/, tools/play-stage, tools/maker, tools/export, tools/baseline, data, fixtures, the format docs, painter-proto or ui-shell. G6 no new dependency and no Capacitor pin change. G7 266 counted lines. G8 lint, deps, check:state and check:law exit 0. G9 the decisions below match the diff. G10 no token in the repo, no main push, no tag, no PR. No release signing, keystore, password or `.jks` in the diff.

## Decisions & deviations
- Portrait is inserted before the whitespace that already followed `<activity`, so both `<activity ` and `<activity` plus a newline match. No `<activity` throws `apk: no activity`. No minSdk line in either gradle file throws `apk: no minSdk`. An already-26 line still counts as a hit.
- The INTERNET removal matches the indented self-closing line with a space before `/>` and its newline. None present is fine. No other permission is added. The AndroidX signature permission in the built APK is merged by the library, not written by this step.
- A zip path leaves `www` when `relative` is `..`, starts with `../`, or is empty. A name such as `..hidden` is not treated as a slip.
- `demoZip` calls `build(dir, commit, root, false)`, reads every play file as text into `play` (`build.json` included), and passes `fixtures/demo.tileproj` as text with no assets. The temp directory is removed in `finally`, including when `build` throws.
- `--game` with a zip path does not call `refuse`. With no zip it does, then uses `demoZip(HEAD)`. `writeMeta` records `zipCommit(www)`, not a separate HEAD read. The meta file is `tools/apk/artifacts/apk-build.json`, which is gitignored.
- `setup-sdk.sh` runs `curl -fL` and `sha256sum -c` for Temurin 17.0.21.1+2 and cmdline-tools 11076708, then `yes | sdkmanager --licenses` and the three packages. On this box that pipeline exited 0 under `sh` (`set -eu`, no pipefail). `debug-apk.sh` passes `"$ZIP"` through to `--game`.
- A single-line `if` with one body is one statement, the same reading as 11a2. No line was wrapped, split or joined to fit a cap. The smoke's packed lines are the s10c layout. Counted size is 266.
- Test 3 runs the demo zip through `gameWww` and checks the on-disk module plus `zipCommit`. That is what catches a dev tree, a `zipCommit` that ignores the file, and empty writes. It also requires two `sha256sum -c` lines, so dropping only the Temurin check fails.

## Next step
- Nothing in step 11 is blocked by 11b (11c is independent). Release signing, a per-game id, the store, and the WebView `structuredClone` floor are out of this step. No publish is part of 11b. The APK reaches the CEO only through CoS, on his SEND.
