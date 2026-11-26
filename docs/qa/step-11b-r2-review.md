# QA review: step 11b debug APK r2 (PR #110)

Verdict: **OK TO MERGE**. Expected merge tree onto main 24603347 is `70960bc72b1699360911ead895bbb67ec1319a59` (confirmed with `git merge-tree --write-tree`). Floor 1170, no pin.

## Heads
- Branch step/step-11b-debug-apk-r2-chatA, fast-forward from r1 tip 68e6db8d.
- Code head ded0e331 (tree 2f92d815). Tip 50992e8d (tree e774b4f6) adds only handback/step-11b-debug-apk/r2/HANDBACK.md.
- CoS report /workspace/share/step-11b-r2-verify/report.md sha256 344c38ff…b9c5 (matches).

## Run at tip (my box)
- Green exit 0, 1170 pass, 0 fail. tsc: only the 3 base errors (page.ts L101, home.ts L91 x2).
- All 24 smokes PASS at guide counts (s11b ok=6). Export audit 135/149/149, AUDIT PASS.

## r1 must-fixes
1. Test 1 throws now match `/apk: no minSdk/` and `/apk: no activity/`. Mutation M1 (drop the minSdk throw) now fails test 1. Mutation set at code head: 14 of 16 caught; only M14 (refuse skip) and M15 (meta path) survive, both CLI-only carries from r1.
2. debug-apk.sh resolves the zip with `realpath` before `cd "$HERE"`, one statement per line, 36/36. Repro with stubbed npm, npx, node and gradlew, run from another folder with `game.zip`: build.ts got the absolute path and the file was found.
3. HANDBACK sections each appear once (Helpers & self-review, Decisions & deviations).

## Count and caps
270/400: build.ts 72+ 6−, setup-sdk.sh 27, debug-apk.sh 36, eslint 1+ 1−, apk-11b.test.ts 75, s11b smoke 52. All within caps; r2 diff touches only the test and debug-apk.sh.

## Carries (unchanged from r1, not blocking)
- CLI branch untested (M14, M15).
- zipCommit regex reads only pretty-printed build.json.
- Tests 2 and 3 leak temp dirs per green run.
- setup-sdk.sh not re-runnable into the same folder; platform-tools unversioned.
- After merge: aapt2 and apksigner check of CoS's box APK before any SEND; CEO phone check of 11a2 download and Share sheet; WebView structuredClone floor.
