# QA review: step 11b r1 handback (ChatA), PR #109

Date 2026-11-26, about 19:25 London (UTC+0). Reviewer: QA & Build Guard. Guide `docs/maker/steps/step-11b-debug-apk.md` r3 (46c01ee4). CoS verify report e34d9dbe…6a90.

**Verdict: REWORK (r2). Two must-fixes, both small. Not OK to merge yet.**

## What I checked (fresh worktrees, clean `npm ci`)
- Shas: base 773eb8c8, code head dfc93471 (tree 906453e3), tip 68e6db8d (tree a76683b2) adds only the HANDBACK. Merge preview onto main 1541a37b gives tree c1730ccf, as CoS said.
- Count 266/400, 6 files, every cap kept (build.ts 78/80, setup-sdk.sh 27/30, debug-apk.sh 32/36, eslint 2/2, test 75/80, smoke 52/52). Nothing outside the Build table, no pin or package change, no signing, key, release task or upload.
- At the tip: green exit 0, 1170 pass / 0 fail; tools tsc only the 3 base errors; all 24 smokes PASS at the guide counts (s11b 6 ok on 8820/8821, waitForFunction only); export audit 135 / 149 / 149, AUDIT PASS.
- Code against the EA trial: written differently but the same behaviour on every rule, except the two points below.
- My own 16 mutations at the code head (`node --test` on apk-11b and apk tests). Caught: activity throw removed, INTERNET kept, leaves-www check removed, zipCommit constant, non-empty www allowed, variables.gradle dropped, demo built as dev, finally cleanup removed, assembleRelease added, project/files.js not required, portrait never inserted, cmdline-tools sha check removed, debugGlobals dropped. Survived: M1, M14, M15 (below).

## Must-fix
1. **Test 1 does not pin the "no minSdk" throw.** Repro: in `tools/apk/build.ts` delete `if (!saw) throw new Error("apk: no minSdk");` and run `node --test tests/tools/apk-11b.test.ts`: all pass. The first `assert.throws(() => patchGradle(bare))` still passes because the call goes on and throws "apk: no activity". That throw is the fix for P1-9's silent no-op (the guide's "a file with nothing to patch stops the build", and test 1's own title). Fix: give the two `assert.throws` calls in test 1 their messages (`/apk: no minSdk/` and `/apk: no activity/`), as the trial did. Record it as a new mutation in § Smoke.
2. **`debug-apk.sh` loses a relative zip path.** Repro: from the repo root, `sh tools/apk/debug-apk.sh game.zip` fails with ENOENT, because the script does `cd "$HERE"` before `build.ts` reads the path, so `game.zip` is read from `tools/apk/`. The guide's one command is `sh tools/apk/debug-apk.sh [<game.zip>]`. Fix: make the zip path absolute before the `cd` (the trial used `realpath "$1"`), one statement per line, inside the 36 cap.

## HANDBACK (fix in r2)
- The "Helpers & self-review" and "Decisions & deviations" sections each appear twice. Write each once.

## Carries (not blocking)
- M14 (the demo path skips `refuse` on a dirty checkout) and M15 (meta written beside www) survive: the CLI branch has no test. Pin in the next tools/apk touch.
- `zipCommit` reads the commit by regex, so it only reads a pretty-printed build.json (the same read gameZip uses). Test 2's hand-made build.json has a trailing comma, so it is not valid JSON.
- Tests 2 and 3 leave temp folders behind on every green run (two play builds, the www folders, each `dir()`); this came from the trial.
- `setup-sdk.sh` cannot be re-run into the same folder (`unzip` without `-o`, and `mv` onto an existing `latest`). `platform-tools` is still unversioned (ChatA got 37.0.3).
- The only helper (8200ece7) returned no report, so this review ran 16 extra mutations.
- APK: § APK reads correctly (sdk 26, target 34, one AndroidX signature permission, no INTERNET, portrait, CN=Android Debug, project/files.js inside), but ChatA's binary is not on this box. After merge I check CoS's box APK with aapt2 and apksigner before any SEND.
- Old carries: the CEO phone check of the 11a2 download and Share sheet; the WebView structuredClone floor (EA, later step).

## For r2
Same base, floor 1170 (no new test; assertions only), count stays at most 400 with every cap. Branch `step/step-11b-debug-apk-r2-chatA`. I re-run green, the 24 smokes, the audit and M1 plus the relative-path repro, then give the expected merge tree.
