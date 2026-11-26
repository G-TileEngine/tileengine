# Rebuild record: step 11b, a debug APK of an exported game (sideload on the CEO's phones)

Original brief: [`docs/maker/steps/step-11b-debug-apk.md`](../maker/steps/step-11b-debug-apk.md) on the merge (r3, blob `5e66d064`, sha256 `46c01ee40d0cc672b03d90d52d44aae81032c33e7963508f8e71e24de81dd435`, 140 lines). Test floor L9; Smoke L11; Where 11b sits L13; APK approach L18; Delivery L27; How the APK reaches the phones L37; Goal L43; Read first L52; Rules L58; Build table L65; Named tests L78; Smoke L83; Must NOT L87; Done when L93; Measured L99; Carries L109; EA rulings L118; Questions L124; Changes from r2 L127, from r1 L136. Count command L76; hard per-file caps L67–72; hard gate 400 at L74 (caps sum 280; trial 257). Go-line paste `docs/maker/steps/step-11b-paste.md` (blob `cabd22f8`, sha256 `326e1b47c789726cd7cd05c6b7d69196ca5fb4e447a95a6cc496a498b22cde0e`, 12 lines; base filled as `773eb8c8`, floor 1170). This is **11b**, roadmap step 11's third slice (CEO ruling 2026-11-24 18:03 London, guide L8: the APK joins step 11). It packs a **release** 11a export (or the demo, through the same path) as `www` inside the pinned Capacitor 6 wrapper and builds a **debug-signed** APK with one command, `sh tools/apk/debug-apk.sh [<game.zip>]`: minSdk 26 and portrait patched into the Capacitor 6 files (a file with nothing to patch stops the build), the INTERNET permission removed, only safe input taken (no dev export, no missing project module, no path leaving `www`, no non-empty `www`), and the JDK and cmdline-tools fetched by fixed URL and checked by sha256 (`setup-sdk.sh`). It is not release signing, a keystore, a store upload, a per-game app id, an icon or name per game, or 11c. Rulings from the CoS chat are labelled **EA ruling** or **CoS ruling**.

Sources: PR #109 (r1, closed as superseded) and PR #110 (r2, merged). Branches `step/step-11b-debug-apk-r1-chatA` (r1 code head `dfc93471`, r1 tip `68e6db8d`) and `step/step-11b-debug-apk-r2-chatA` (r2 code head `ded0e331`, r2 tip `50992e8d`, a fast-forward of the r1 tip). Hand-backs on the merge: `handback/step-11b-debug-apk/r1/HANDBACK.md` (HB1, blob `c75aabbb`, 125 lines, sha256 `e8ddb17d25ad1add7141e8a3491b90112a022ac870148529a26fedaea7b08847`) and `handback/step-11b-debug-apk/r2/HANDBACK.md` (HB2, blob `fb1f4a4b`, 117 lines, sha256 `48e3c75d7d78952d27b391d728bf5f7a6de3630ba7861b95c67b0a0d84fa5e5d`). CoS verify reports: r1 `/workspace/share/step-11b-verify/report.md` (V1, sha256 `e34d9dbe4e8f55100ced7dfc3c3c19f8a8d18b3d4316bc2e011caaf909626a90`): PASS, notes only; r2 `/workspace/share/step-11b-r2-verify/report.md` (V2, sha256 `344c38ffecf18214dc6d81deb2e3151184d90e32b52f2f3ba830663b05a2b9c5`): PASS, no must-fix. QA docs on main: `docs/qa/step-11b-handback-review.md` on `24603347` (QA1, blob `3983b84c`, 31 lines, sha256 `f75650dd49c792ad1fac20ad9a71f0ae645e9a35cea8ece0427f2e9932382032`): **REWORK (r2)**, two must-fixes; `docs/qa/step-11b-r2-review.md` on `7f1b1c3b` (QA2, blob `0eebf14f`, 27 lines, sha256 `78e09fe2b6a64e3826072021a0818dc909f15a6c6ea64ffdec6a34f2d692fd5b`): **OK TO MERGE**, expected tree `70960bc7`. QA's box APK check: `docs/qa/step-11b-apk-check.md` (QA3, blob `f962798e`, 17 lines, sha256 `a2bbb7cfc71c1add0685e4533652a4442f051bddfefbc595ea2caff99fdb2004`): **APK PASS**. The box APK built by CoS from the merge: § (g). Line cites use HB1, HB2, V1, V2, QA1, QA2 and QA3. Product line cites are at merge `71bc22db` (tree `70960bc7`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `773eb8c84f3ed886ccc25b88ddfa1ea6eb0770a9`, 2026-11-26 16:48 (UK time), tree `93f6723f`, docs-only on the 11a2 merge `0d683870` (PR #108, tree `3b5e2172`): `7875033c` adds QA's 11a2 review and `773eb8c8` adds this guide r3. Floor **1170** tests (guide L9: 11a2's 1167 + N=3). The r3 guide was trialled over the 11a2 r4 trial (trial commit `eaa35359`, patch `/workspace/share/s11/s11b-trial-r3.patch`, sha256 `b5e44f3b68a977bb98897fcf62ecaa10633ec36b051450651c6e956f743ce37a`, 257 counted lines; it also applies on `7875033c`, green 1170/0). Later main gained docs only: `1541a37b` (the 11a2 rebuild record, README row 31, the filled 11b paste) and `24603347` (QA1) |
| Main at merge | `246033478360f6cec1ded7a118081920d9c95ec3`, 2026-11-26 19:09 (UK time), tree `22007f6b`, docs-only on the base. This is the merge's first parent. Official 11b product against it, and against the base, is **270** (6 Build-table files, +263/−7) |
| r1 commits | on `step/step-11b-debug-apk-r1-chatA`: `dfc934713bccba802e79fdd2832086eb80c3dd73` feat(apk): step 11b debug APK of an exported game (r1 code head, tree `906453e367e75c7e015559e5bbe0661762775e35`, 2026-11-26 17:34 UK time), `68e6db8d2bf1ab2abe37c8e8af701607aaf25e89` docs(handback): step 11b debug apk r1 (tree `a76683b2ba4060c655ae6e9d43412d9bffc92852`, 17:40). Linear on the base, no merges. Author and committer on both `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Green **1170/0** (code head and tip). Official product **266** (6 files, +259/−7), every cap kept (smoke 52/52 on cap). tools tsc only the 3 base errors. 24 smokes PASS first try (HB1, QA1), s11b 8820 r1: 6 ok. Export audit 135/149/149. CoS verify PASS with notes (V1: no realpath in `debug-apk.sh`; duplicated HB1 sections). PR #109 opened; predicted tree onto `1541a37b` was `c1730ccf`. QA1 **REWORK**: (1) test 1 didn't pin the `apk: no minSdk` throw (QA M1 survived), (2) `debug-apk.sh` lost a relative zip path (`cd` before the read), plus HB1's duplicated sections. PR #109 closed: "Superseded by r2 PR #110"; the r1 branch kept |
| r2 commits | on `step/step-11b-debug-apk-r2-chatA`, new commits on the r1 tip: `ded0e331f395d3199f531decf823ef5050cb57cf` fix(apk): step 11b r2 pin minSdk throw and absolute zip path (r2 code head, tree `2f92d8150642549e9ce32a1429b9219212dc7e78`, 20:21), `50992e8ded1f3e16fc7f6f0316e21e2ef9316baa` docs(handback): step 11b debug apk r2 (tree `e774b4f673a9f3f30e9765310534f006d5d70578`, 20:24). Fast-forward, no rebase or force-push; noreply author and committer. r1 tip → r2 code head touches only `tests/tools/apk-11b.test.ts` (2 lines) and `tools/apk/debug-apk.sh` (+5/−1) |
| r2 verdict | Green **1170/0** (code head and tip, CoS and QA). Official product **270** (6 files, +263/−7), every cap kept, two files on cap (`debug-apk.sh` 36/36, smoke 52/52). tools tsc only the 3 base errors. 24 smokes PASS first run (HB2, QA2), s11b 6 ok. Audit 135/149/149. N16 (the minSdk throw deleted) fails test 1 (HB2; CoS reran it, V2). CoS verify PASS (V2). Predicted merge tree onto `24603347`: `70960bc7` (V2, QA2). QA2 **OK TO MERGE** |
| Merge | PR #110, merge commit `71bc22dba88eb608b7f065f88d246af89314b321`, 2026-11-26 22:06 (UK time). Tree `70960bc72b1699360911ead895bbb67ec1319a59` (the tree CoS and QA predicted; `merge-pr.sh --expect-tree`). First parent `246033478360f6cec1ded7a118081920d9c95ec3`, second parent `50992e8ded1f3e16fc7f6f0316e21e2ef9316baa`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #110: Step 11b: debug APK (ChatA r2)`. Green on the merge **1170 pass / 0 fail** |
| After the merge | main is `7f1b1c3b1b8c547b45607e64bc18dea95940a74e`, 2026-11-26 22:06 (UK time), tree `314c9bbf`, which adds only `docs/qa/step-11b-r2-review.md` (27 lines, sha256 `78e09fe2`, blob `0eebf14f`). CoS box APK from the merge: § (g) |
| Tests | 1167 + N=3 (named tests 1–3 in `tests/tools/apk-11b.test.ts`) = **1170 pass / 0 fail**. Floor after this merge is **1170** (HB2, V2, QA2) |

## (b) Files

From `git diff --name-status 24603347..71bc22db -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` against the merge's first parent (the same as against the base `773eb8c8` for these files). The new s11b smoke is counted in the 400.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tools/apk/build.ts` | M | 72 / 6 | 80 (L67) | yes. **78** (sha256 `af664891f2d6e7b2a8c3278e41349a1241161aced72cac2a117c6cb786d087d8`) |
| `tools/apk/setup-sdk.sh` | A | 27 / 0 | 30 (L68) | yes. **27** (sha256 `3ab7468b7200e9a7d891c854552f9e1f175c0a332993f4be205e5565249250e2`) |
| `tools/apk/debug-apk.sh` | A | 36 / 0 | 36 (L69) | yes. **36** on cap (sha256 `4b59751cfb2301a3d4ba976c93ec30601a09313c3e0543ab0026448edd924297`) |
| `eslint.config.mjs` | M | 1 / 1 | 2 (L70) | yes. **2** on cap (sha256 `3250f53e6350e4c8c6809f936963f57e9e23165178c611cdce7d3313c132e382`) |
| `tests/tools/apk-11b.test.ts` | A | 75 / 0 | 80 (L71) | yes. **75** (sha256 `c6cb7e0bf8d9cf1a9f60a25360d7563a019d95bf7f1466fe6e92c83f800ac500`) |
| `handoff/steps/tests/s11b-debug-apk/smoke.mjs` | A | 52 / 0 | 52 (L72) | yes. **52** on cap (sha256 `9c313e5b942d0234f82d35f15e7d95eaac335f404a78d925534fdc60ee1cb96d`) |

No diff under `src/`, `tools/play-stage/`, `tools/maker/`, `tools/export/`, `tools/baseline/`, `capacitor.config.json`, `tools/apk/package.json`, `package.json`, any lock file, `data/`, fixtures, the format docs, painter-proto or ui-shell. `tests/tools/apk.test.ts` not edited; no other test or smoke edited. Official count at the r2 code head, the r2 tip or the merge against first parent `24603347` is **6 files changed, 263 insertions(+), 7 deletions(-)** = 270 ≤ 400 (r1: 266). Caps sum 280 is not a second gate. The r3 trial was 257 (build.ts 67+5−, setup-sdk.sh 27, debug-apk.sh 33, test 76, smoke 47); ChatA's code is its own (V1: the same behaviour on every rule, QA1). No new dependency, no Capacitor pin change, no signing config, keystore, `.jks`, password, release task, upload or publish. No APK, `android/`, `www/`, `artifacts/` or `tools/apk` lock file in git (all already gitignored).

## (c) Key code and git commands

The wrapper (`tools/apk/build.ts` `--web` / `--apk`, `capacitor.config.json` with `androidScheme: "https"`) was already on main from P1-9. 11b makes it take an 11a export and land the phone settings on Capacitor 6 (EA ruling 1: the pinned Capacitor 6 wrapper, the SDK's debug key only).

**Gradle and manifest (Rule 1).** `patchGradle(android)` sets `minSdkVersion` to 26 in `app/build.gradle` and `variables.gradle`, in the `=` and space forms; with no minSdk line in either it throws `apk: no minSdk` (an already-26 line still counts). It inserts `android:screenOrientation="portrait"` on the first `<activity` before its following whitespace (space or newline); none throws `apk: no activity`. It removes the indented self-closing INTERNET `uses-permission` line; none present is fine (EA ruling 4). No other permission is written (the AndroidX `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` is merged by the library).

**Safe input (Rules 2–3).** `gameWww(zip, www)` refuses a non-empty `www`, any entry whose path leaves `www` (`relative` is `..`, starts `../`, or empty; `..hidden` is allowed), a missing `index.html` / `build.json` / `project/files.js`, and any `playOnly`, `networkUrls` or `debugGlobals` hit; it writes `entry.data`. `zipCommit(www)` reads the commit from `www/build.json` (regex, as `gameZip`). `demoZip(commit)` builds a release play tree in a temp dir (`build(dir, commit, root, false)`), reads every play file as text, and calls `gameZip(play, fixtures/demo.tileproj, {})`; the temp dir is removed in `finally`. `--game <zip>` takes the zip as given; `--game` alone refuses a dirty checkout, then uses `demoZip(HEAD)`. Meta goes to `tools/apk/artifacts/apk-build.json` (gitignored) with `zipCommit(www)`.

**Scripts (Rule 4).** `setup-sdk.sh <dir>`: Temurin 17.0.21.1+2 and cmdline-tools 11076708 by fixed URL, `curl -fL` then `sha256sum -c` each, licences, `platform-tools`, `platforms;android-34`, `build-tools;34.0.0`, all under `<dir>`; prints the two exports. `debug-apk.sh [<zip>]`: needs `JAVA_HOME` and `ANDROID_HOME` (else exit 2 with the setup hint); r2 resolves a given zip with `realpath` **before** `cd "$HERE"` (QA1 must-fix 2); `npm install` (exact pins), `rm -rf www`, `node build.ts --game ["$ZIP"]`, `npx cap add android` only when `android/` is missing, `npx cap sync android`, `--apk`, `./gradlew --no-daemon -q assembleDebug`, copy to `artifacts/TileEngine-<first 12 hex of sha256(www/build.json)>-debug.apk`, print its sha256. One command per line. `eslint.config.mjs` ignores `tools/apk/android/**`, `www/**`, `artifacts/**` so green passes after a build.

**Named tests** 1–3 in `tests/tools/apk-11b.test.ts` (75/80), titles exactly as the guide L79–81. r2 gave test 1's two `assert.throws` their messages, `/apk: no minSdk/` and `/apk: no activity/` (QA1 must-fix 1). **Smoke** `handoff/steps/tests/s11b-debug-apk/smoke.mjs`, ports 8820 (release maker) and 8821 (the APK's `www`), r1, s10c layout: 1 zip, 2 play, 3 turn, at 390 and 360. 6 ok.

```
# Full product diff against the merge's first parent (the accepted product measure):
#
#   git diff 24603347 71bc22db -- \
#     tools/apk/build.ts \
#     tools/apk/setup-sdk.sh \
#     tools/apk/debug-apk.sh \
#     eslint.config.mjs \
#     tests/tools/apk-11b.test.ts \
#     handoff/steps/tests/s11b-debug-apk/smoke.mjs
#
# The hand-backs (not in the 400):
#   git show 71bc22db:handback/step-11b-debug-apk/r1/HANDBACK.md
#   git show 71bc22db:handback/step-11b-debug-apk/r2/HANDBACK.md
#
# r2 rework only:
#   git diff 68e6db8d ded0e331      (apk-11b.test.ts 2/2, debug-apk.sh +5/-1)
#
# Product gate. Official command at the r2 code head or tip against the
# base 773eb8c8, or at the merge against first parent 24603347:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   6 files changed, 263 insertions(+), 7 deletions(-)
#
# At ded0e331 against 773eb8c8: 6 files, 263 insertions, 7 deletions = 270.
# At 71bc22db against 773eb8c8 the same command also lists the docs-only
# main commits 1541a37b and 24603347; add ':!docs/**' to get 270 again.
# r1 (dfc93471) was 259 + 7 = 266. Trial r3 (eaa35359) was 257.
#
# Named tests (npm test 1170/0, floor 1167 + N=3):
#   ✔ 11b patchGradle on a Capacitor 6 android/ …
#   ✔ 11b gameWww: a release game export becomes www …
#   ✔ 11b demoZip and the scripts: …
#
# tools tsc: only effect-designer page.ts L101 and maker home.ts L91 (×2).
#
# Smokes: the builder used chrome-headless-shell (HB2 § Smoke), all 24 solo, first run:
#   S0 (8797) 14, s3 (8798) 18, s4a (8799) 16, s4b (8800) 16, s4c (8801) 16,
#   s5a (8802) 16, s5b (8803) 16, s5c (8804) 16, s6a (8805) 18, s6b (8806) 16,
#   s6c (8807) 18, s6d (8808) 14, s7 (8809) 20, s8 (8810 r1) 16, s9 (8811 r1) 12,
#   s8c (8812 r1) 8, s9b (8813 r1) 14, s9c (8814 r1) 6, s10b (8815 r1) 8,
#   s10c (8816 r1) 8, s10d (8817 r1) 8, s11a (8818 r1) 6, s11a2 (8822 r1) 6,
#   s11b (8820/8821 r1) 6 (3 @390, 3 @360).
# QA reran all 24 solo at r1 and r2 (QA1, QA2); CoS reran s11b solo with
# /usr/bin/google-chrome at both code heads: 6 ok each (V1, V2).
#
# Mutations, builder (HB1 N1–N15, HB2 N1–N16; each restored from an in-memory
# snapshot): N1 old patchGradle regex, N6 old "<activity " replace, N9 INTERNET
#   kept, N16 the "apk: no minSdk" throw deleted → test 1; N2 debugGlobals,
#   N3 missing-file check, N4 leaves-www check, N7 networkUrls, N8 playOnly
#   dropped → test 2; N5 demo built as dev, N11 demoZip without try/finally
#   (r1's first needle was a syntax error; redone as a valid body, r2 records
#   the valid form), N12 Temurin sha256sum -c removed, N13 gameZip handed no
#   play files, N15 debug-apk.sh not passing the zip to --game → test 3;
#   N10 zipCommit constant, N14 gameWww writing empty files → tests 2 and 3.
#   CoS reran N16 at ded0e331: test 1 fails ("did not match /apk: no minSdk/";
#   actual "apk: no activity"); restored, 3/3 (V2).
# QA's own 16 (QA1 at dfc93471): 13 caught; M1 (no-minSdk throw removed),
#   M14 (demo path skips refuse on a dirty checkout) and M15 (meta written
#   beside www) survived. At ded0e331 (QA2): 14 of 16 caught; only M14 and
#   M15 survive, both in the untested CLI branch (carry).
#
# Export audit: builder self-run (three builders) and s8-audit.mjs both
# 135 / 149 / 149, 0 hits, AUDIT PASS. 11b adds no play file.
```

## (d) What went wrong, in order, and the fix

**Guide r1 → r3, before any build.** r1 and r2 called the EA's 11a trial API (`gameZip`'s old signature, `unzipStore`'s `.bytes`); r3 re-trialled on the merged 11a and the 11a2 r4 trial, dropped INTERNET (EA ruling 4, emulator proof), widened tests 1–3 and set caps (sum 280, trial 257) (guide L127–140).

**r1 rework (QA1 must-fix 1): the "no minSdk" throw was unpinned.** Test 1's first `assert.throws(() => patchGradle(bare))` had no message, so with the minSdk throw deleted the call went on and threw `apk: no activity`, and the test still passed (QA M1). That throw is the fix for P1-9's silent no-op ("a file with nothing to patch stops the build"). r2 gave both `assert.throws` calls their messages, as the trial did; N16 recorded.

**r1 rework (QA1 must-fix 2): a relative zip path was lost.** `debug-apk.sh` did `cd "$HERE"` before `build.ts` read `$1`, so `sh tools/apk/debug-apk.sh game.zip` from the repo root read `tools/apk/game.zip` (ENOENT). CoS flagged it in V1 as a note (the guide did not spell out `realpath`); QA made it a must-fix because the guide's one command is `sh tools/apk/debug-apk.sh [<game.zip>]`. r2 sets `ZIP=${1-}` and `ZIP=$(realpath "$ZIP")` before the `cd`, one statement per line, within the 36 cap (now on it). QA2 proved it with stubbed npm, npx, node and gradlew from another folder.

**HB1 duplicated sections.** "Helpers & self-review" and "Decisions & deviations" were each written twice (V1, QA1). HB2 writes each once.

**HB1 notes.** ChatA's only helper (8200ece7) returned no report and was stopped (it changed nothing); QA ran 16 mutations of its own instead. r1's first N11 needle left a bare `try` (a syntax error, reported as a test failure); a one-off redid it as the valid no-cleanup body, caught by test 3.

PR #109 (r1) was opened by CoS after V1 and closed after V2 as "Superseded by r2 PR #110"; the r1 branch is kept.

## (e) Do it right first time

- The work is only in the 6 Build-table files. Nothing in `src/`, `tools/play-stage`, `tools/maker`, `tools/export`, `capacitor.config.json`, `tools/apk/package.json`, data, fixtures or the format docs. No new dependency or pin change.
- Every throw a test claims to cover needs the message in `assert.throws(fn, /…/)`; a bare `assert.throws` passes on the next throw down. Plant each throw's removal as a mutation.
- In a script that `cd`s, make every path argument absolute (`realpath`) before the `cd`, and try the documented command from the repo root with a relative path.
- No signing config, keystore, `.jks`, password, release task, upload or publish. Every download pinned by URL and checked with `sha256sum -c`. Build output (`android/`, `www/`, `artifacts/`, the `tools/apk` lock file) stays gitignored and eslint-ignored; green must pass after an APK build.
- One statement or command per line in all new code and shell; never wrap, split or join to fit a cap.
- Write each HANDBACK section once; check the file before the docs commit. List every helper and script in § Helpers, including one that returned nothing.
- Restore mutation runs from snapshots and re-run the tests after the last restore.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only the QA r2 review):
#   git diff 71bc22db HEAD -- \
#     tools/apk/build.ts \
#     tools/apk/setup-sdk.sh \
#     tools/apk/debug-apk.sh \
#     eslint.config.mjs \
#     tests/tools/apk-11b.test.ts \
#     handoff/steps/tests/s11b-debug-apk/smoke.mjs
#   (empty)
#
# Product gate at the merge against first parent 24603347:
#   git diff --shortstat 24603347..71bc22db -- . ':!handback/**' ':!node_modules'
#   6 files changed, 263 insertions(+), 7 deletions(-)
#
# Green: npm ci && npm run green → 1170 pass / 0 fail, also after an APK build.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L91 ×2).
# Smokes: all 24 solo at the guide counts (the 23 in step-11a2.md plus s11b 6).
# Export audit: 135 / 149 / 149, AUDIT PASS.
# APK: § (g); same checks with aapt2 and apksigner.
```

## (g) The box APK (CoS, from the merge)

Built by CoS on the box after the merge, per guide L37–41 (EA ruling 2), from a fresh detached worktree of `71bc22db` at `/workspace/apk-build/11b` (clean tracked tree; outside the main checkout). SDK and JDK outside the repo: `sh tools/apk/setup-sdk.sh /workspace/apk-sdk/11b` (both downloads matched the pinned sha256; exit 0; prints `JAVA_HOME=/workspace/apk-sdk/11b/jdk-17.0.21.1+2`, `ANDROID_HOME=/workspace/apk-sdk/11b/android-sdk`). Installed: Temurin OpenJDK 17.0.21.1, cmdline-tools 11076708, platform-tools 37.0.3 (unversioned in the script), `platforms;android-34` revision 3, build-tools 34.0.0. Then `sh tools/apk/debug-apk.sh` with no zip (the demo), exit 0, about 21 s (Gradle cache already warm on the box).

| | Value |
|---|---|
| File | `tools/apk/artifacts/TileEngine-5ec146ce019b-debug.apk` (stamp = first 12 hex of `sha256sum www/build.json`), copied to `/workspace/share/step-11b-apk/` with a `.sha256` file. Not in git; not uploaded or sent |
| Size | **3914759** bytes |
| sha256 | `e2ff2aac010a082c5ce97af28ad503d56dccc2e5ac955193ad36639fb7a068a2` |
| `artifacts/apk-build.json` | commit `71bc22dba88eb608b7f065f88d246af89314b321` (the demo zip's `build.json`, which is HEAD), `wwwSha256` `adf4d2e58fcc6a522fd6bfe6dcafdb84697dab86bedd9569e628e436d031e1ef`, `playOnly` true, appId `com.tileengine.play`, minSdk 26, androidScheme `https` |
| `aapt2 dump badging` (build-tools 34.0.0) | `package: name='com.tileengine.play' versionCode='1' versionName='1.0'`, compileSdk 34; `sdkVersion:'26'`; `targetSdkVersion:'34'`; one `uses-permission`, `com.tileengine.play.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` (AndroidX); **no `android.permission.*`**, so no INTERNET; label `TileEngine`; launchable `com.tileengine.play.MainActivity` |
| Orientation | `aapt2 dump xmltree --file AndroidManifest.xml`: the activity has `android:screenOrientation=1` (portrait) |
| `apksigner verify --print-certs -v` | Verifies; v2 scheme only; 1 signer, `C=US, O=Android, CN=Android Debug`, RSA 2048; certificate SHA-256 `c9b9c06f3b34c8d6ec739648d2d597b4f46104e466bba30a61b8165b16d7131e` (the box's `~/.android/debug.keystore`; keep it, so each new APK installs over the last) |
| Contents | `assets/public/project/files.js` (139239 bytes), `assets/public/index.html` with `data-game="project/files.js"`, `assets/public/build.json` |
| Worktree after | `git status --short` empty; `android/`, `www/`, `artifacts/`, `node_modules/` and `package-lock.json` under `tools/apk` ignored. Green after the build in this worktree: `npm ci && npm run green` exit 0, **1170 pass / 0 fail**, and `git status --short` still empty |

**WebView floor.** The play tree's only `structuredClone` is in `src/project/load/migrate.js`; an Android System WebView older than Chrome **98** refuses every project (`invalidValue project.json unreadable`), as on the emulator's factory WebView 83 (guide L115). Both CEO phones (Samsung Galaxy S21 Ultra, Red Magic 9 Pro) should load if Android System WebView is 98+ (EA, guide L115); not yet checked on the phones. Before installing: Play Store → Android System WebView up to date (98+). Fix in `src/` or state the floor in a later step.

**Delivery.** Per EA ruling 2, the APK goes only to a private Google Drive folder shared with the CEO alone, on the CEO's SEND. Never a branch, release or public link. Nothing sent yet. The APK has the same size as ChatA's r1 demo APK (3914759 bytes). Its sha256 differs because `build.json` carries a different commit.

## QA non-blockers carried forward

- The CLI branch has no test: M14 (the demo path skips `refuse` on a dirty checkout) and M15 (meta written beside `www`) survive. Pin them the next time `tools/apk` is touched (QA1, QA2).
- `zipCommit` reads the commit by regex, so it only reads a pretty-printed `build.json` (the same read `gameZip` uses). Test 2's hand-made `build.json` has a trailing comma, so it isn't valid JSON (QA1).
- Tests 2 and 3 leave temp folders behind on every green run (two play builds, the `www` folders, each `dir()`). This came from the trial (QA1).
- `setup-sdk.sh` can't be re-run into the same folder (`unzip` without `-o`, `mv` onto an existing `latest`). `platform-tools` is still unversioned (37.0.3 on both builds) (QA1, QA kit carry 2).
- The CEO phone check of the 11a2 download and Share sheet (old carry). The WebView `structuredClone` floor (EA, later step; § (g)).
- **CoS rulings still open (guide L112–113):** the shared app id `com.tileengine.play` stays for debug APKs, so each new APK replaces the last; a per-game id waits for the store/release step. `tools/apk` has no lock file (`npm install` uses exact pins; transitive versions float).
- **Still open, not 11b scope:** UX "Game name" and "Icon" in project settings (11b has a fixed "TileEngine" name and the default icon), a splash, release signing, store upload, 11c, D9 upgrade-on-save, DSK E1–E4 follow-ups, §7.2 closure (step 36). There's no baseline republish and no gh-pages publish in 11b. A republish needs the CEO's own typed OK in QA's chat, naming the commit; the builder never publishes.
- **Closed here:**
  - P1-9's Gradle patch on Capacitor 6 (minSdk 26, portrait, throws when there's nothing to patch).
  - The INTERNET permission (DSK E6 Q4, EA ruling 4).
  - `--web`'s untracked `apk-build.json` (now in `artifacts/`).
  - Green after an APK build.
  - QA r1 kit carries: network and play-only refusals pinned, `apk-build.json` names the zip's commit, `setup-sdk.sh` pinned by sha256, `demoZip` cleans up on a throw.
  - QA1 must-fixes 1 and 2.
  - QA3 box APK check PASS (docs/qa/step-11b-apk-check.md, a2bbb7cf).

## Blob check

Each file must have exactly this git blob id at `71bc22db`. On a rebuild, run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/apk/build.ts` | `bd97e99bcfc3da9ba8eea6912d8b1ce1dfe5b041` | 160 |
| `tools/apk/setup-sdk.sh` | `34395a4399131e7b2df4ff2d246fcc06c985b1ac` | 27 |
| `tools/apk/debug-apk.sh` | `67c245020c66df1e78d7107fc7b330703ec2afbd` | 36 |
| `eslint.config.mjs` | `7e1ceb1d766e63cde37d9b198647c080acb36d3e` | 54 |
| `tests/tools/apk-11b.test.ts` | `ff17ed594b515c5641ffed4a175506faf8836b36` | 75 |
| `handoff/steps/tests/s11b-debug-apk/smoke.mjs` | `633cb1f51b69f47d1806299889dd57a2bd655a25` | 52 |

## Appendix: full code as merged (step 11b, PR #110)

New files are `git show 71bc22db:<path>` in full. Edited files are `git diff 24603347 71bc22db -- <path>` (the same against the base `773eb8c8`).

### `tools/apk/build.ts` (edited)

```diff
diff --git a/tools/apk/build.ts b/tools/apk/build.ts
index d32e158..bd97e99 100644
--- a/tools/apk/build.ts
+++ b/tools/apk/build.ts
@@ -1,8 +1,11 @@
 import { execFileSync } from "node:child_process";
 import { createHash } from "node:crypto";
-import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
+import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
+import { tmpdir } from "node:os";
 import { dirname, join, relative } from "node:path";
 import { fileURLToPath } from "node:url";
+import { gameZip } from "../export/game.ts";
+import { unzipStore } from "../export/zip.ts";
 import { build, refuse, ROOT } from "../play-stage/build.ts";
 
 export const APP_ID = "com.tileengine.play", APP_NAME = "TileEngine", MIN_SDK = 26;
@@ -64,11 +67,24 @@ export function patchMainActivity(android: string): string {
   return dest;
 }
 export function patchGradle(android: string): void {
-  const gradle = join(android, "app/build.gradle");
-  writeFileSync(gradle, readFileSync(gradle, "utf8").replace(/\bminSdk(?:Version)?\s+\d+/g, (hit) => hit.replace(/\d+$/, String(MIN_SDK))));
+  const files = ["app/build.gradle", "variables.gradle"].map((rel) => join(android, rel)).filter((file) => existsSync(file));
+  let saw = false;
+  for (const file of files) {
+    const text = readFileSync(file, "utf8");
+    const re = /\bminSdk(?:Version)?(?:\s*=\s*|\s+)\d+/g;
+    if (re.test(text)) saw = true;
+    re.lastIndex = 0;
+    const next = text.replace(re, (hit) => hit.replace(/\d+$/, String(MIN_SDK)));
+    writeFileSync(file, next);
+  }
+  if (!saw) throw new Error("apk: no minSdk");
   const man = join(android, "app/src/main/AndroidManifest.xml");
-  const xml = readFileSync(man, "utf8");
-  writeFileSync(man, xml.includes('android:screenOrientation="portrait"') ? xml : xml.replace("<activity ", '<activity android:screenOrientation="portrait" '));
+  let xml = readFileSync(man, "utf8").replace(/^[ \t]*<uses-permission android:name="android.permission.INTERNET" \/>\r?\n/gm, "");
+  if (!xml.includes('android:screenOrientation="portrait"')) {
+    if (!/<activity\s/.test(xml)) throw new Error("apk: no activity");
+    xml = xml.replace(/<activity(\s)/, '<activity android:screenOrientation="portrait"$1');
+  }
+  writeFileSync(man, xml);
 }
 export function buildApk(www: string, android: string): void {
   const bad = debugGlobals(www);
@@ -90,5 +106,55 @@ if (process.argv[1] === fileURLToPath(import.meta.url)) {
     if (!existsSync(cap) || !existsSync(android)) { console.error("apk: Capacitor or android/ is missing. CoS/EA run npm i and cap add android in tools/apk on the box."); process.exit(2); }
     try { buildApk(dest ?? join(ROOT, "tools/apk/www"), android); }
     catch (err) { console.error(err instanceof Error ? err.message : String(err)); process.exit(1); }
-  } else { console.error("usage: node tools/apk/build.ts --web <out> | --apk"); process.exit(1); }
+  } else if (flag === "--game") {
+    void runGame(dest, head, dirty);
+  } else { console.error("usage: node tools/apk/build.ts --web <out> | --apk | --game [<zip>]"); process.exit(1); }
+}
+export function gameWww(zip: Uint8Array, www: string): void {
+  if (existsSync(www) && readdirSync(www).length > 0) throw new Error("apk: www is not empty");
+  mkdirSync(www, { recursive: true });
+  for (const entry of unzipStore(zip)) {
+    const dest = join(www, entry.name);
+    const rel = relative(www, dest);
+    if (rel === ".." || rel.startsWith("../") || rel === "") throw new Error(`apk: path leaves www: ${entry.name}`);
+    mkdirSync(dirname(dest), { recursive: true });
+    writeFileSync(dest, entry.data);
+  }
+  const need = ["index.html", "build.json", "project/files.js"];
+  const problems = [...need.filter((name) => !existsSync(join(www, name))).map((name) => `missing ${name}`), ...playOnly(www), ...networkUrls(www), ...debugGlobals(www)];
+  if (problems.length > 0) throw new Error(`apk: ${problems.join(", ")}`);
+}
+export function zipCommit(www: string): string {
+  const text = readFileSync(join(www, "build.json"), "utf8");
+  const commit = /"commit": "([0-9a-f]{40})"/.exec(text)?.[1];
+  if (commit === undefined) throw new Error("apk: no commit");
+  return commit;
+}
+export async function demoZip(commit: string, root: string = ROOT): Promise<Uint8Array> {
+  const dir = mkdtempSync(join(tmpdir(), "apk-play-"));
+  try {
+    build(dir, commit, root, false);
+    const play = Object.fromEntries(listFiles(dir).map((name) => [name, readFileSync(join(dir, name), "utf8")]));
+    const demo = join(root, "fixtures/demo.tileproj");
+    const text = Object.fromEntries(listFiles(demo).map((name) => [name, readFileSync(join(demo, name), "utf8")]));
+    return await gameZip(play, text, {});
+  } finally {
+    rmSync(dir, { recursive: true, force: true });
+  }
+}
+async function runGame(zipArg: string | undefined, head: string, dirty: string): Promise<void> {
+  try {
+    const why = zipArg === undefined ? refuse(head, undefined, dirty) : null;
+    if (why !== null) {
+      console.error(why);
+      process.exit(1);
+    }
+    const bytes = zipArg === undefined ? await demoZip(head) : new Uint8Array(readFileSync(zipArg));
+    const www = join(ROOT, "tools/apk/www");
+    gameWww(bytes, www);
+    writeMeta(join(ROOT, "tools/apk/artifacts/apk-build.json"), zipCommit(www), treeSha(www));
+  } catch (err) {
+    console.error(err instanceof Error ? err.message : String(err));
+    process.exit(1);
+  }
 }
```

### `tools/apk/setup-sdk.sh` (new)

```sh
#!/bin/sh
set -eu
if [ "$#" -ne 1 ]
then
  echo "usage: sh tools/apk/setup-sdk.sh <dir>" >&2
  exit 2
fi
DIR=$1
mkdir -p "$DIR"
JDK_URL="https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.21.1%2B2/OpenJDK17U-jdk_x64_linux_hotspot_17.0.21.1_2.tar.gz"
JDK_SHA="0b0ac5eab6db6abaec68c9913bcddb31321e5da411c45073d520d9c125e6f7b4"
curl -fL "$JDK_URL" -o "$DIR/jdk.tar.gz"
printf '%s  %s\n' "$JDK_SHA" "$DIR/jdk.tar.gz" | sha256sum -c -
tar -xzf "$DIR/jdk.tar.gz" -C "$DIR"
CMD_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
CMD_SHA="2d2d50857e4eb553af5a6dc3ad507a17adf43d115264b1afc116f95c92e5e258"
curl -fL "$CMD_URL" -o "$DIR/cmd.zip"
printf '%s  %s\n' "$CMD_SHA" "$DIR/cmd.zip" | sha256sum -c -
mkdir -p "$DIR/android-sdk/cmdline-tools"
unzip -q "$DIR/cmd.zip" -d "$DIR/android-sdk/cmdline-tools"
mv "$DIR/android-sdk/cmdline-tools/cmdline-tools" "$DIR/android-sdk/cmdline-tools/latest"
export JAVA_HOME="$DIR/jdk-17.0.21.1+2"
export ANDROID_HOME="$DIR/android-sdk"
yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$ANDROID_HOME" --licenses
"$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$ANDROID_HOME" "platform-tools" "platforms;android-34" "build-tools;34.0.0"
echo "export JAVA_HOME=$JAVA_HOME"
echo "export ANDROID_HOME=$ANDROID_HOME"
```

### `tools/apk/debug-apk.sh` (new)

```sh
#!/bin/sh
set -eu
HERE=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
if [ -z "${JAVA_HOME-}" ] || [ -z "${ANDROID_HOME-}" ]
then
  echo "apk: set JAVA_HOME and ANDROID_HOME (sh tools/apk/setup-sdk.sh <dir>)" >&2
  exit 2
fi
ZIP=${1-}
if [ -n "$ZIP" ]
then
  ZIP=$(realpath "$ZIP")
fi
cd "$HERE"
npm install
rm -rf www
if [ -n "$ZIP" ]
then
  node build.ts --game "$ZIP"
else
  node build.ts --game
fi
if [ ! -d android ]
then
  npx cap add android
fi
npx cap sync android
node build.ts --apk
cd android
./gradlew --no-daemon -q assembleDebug
cd "$HERE"
STAMP=$(sha256sum www/build.json | cut -c 1-12)
mkdir -p artifacts
OUT="artifacts/TileEngine-${STAMP}-debug.apk"
cp android/app/build/outputs/apk/debug/app-debug.apk "$OUT"
sha256sum "$OUT"
```

### `eslint.config.mjs` (edited)

```diff
diff --git a/eslint.config.mjs b/eslint.config.mjs
index 675221f..7e1ceb1 100644
--- a/eslint.config.mjs
+++ b/eslint.config.mjs
@@ -13,7 +13,7 @@ const storeGlobals = ["localStorage", "sessionStorage", "indexedDB"]
   .map((name) => ({ name, message: "Storage only in src/platform." }));
 
 export default tseslint.config(
-  { ignores: ["node_modules/**", "tests/fixtures/**", "dist/**", "handback/**", "ui-shell/**"] },
+  { ignores: ["node_modules/**", "tests/fixtures/**", "dist/**", "handback/**", "ui-shell/**", "tools/apk/android/**", "tools/apk/www/**", "tools/apk/artifacts/**"] },
   ...tseslint.configs.strict,
   {
     files: ["src/**/*.ts"],
```

### `tests/tools/apk-11b.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { demoZip, gameWww, listFiles, patchGradle, zipCommit } from "../../tools/apk/build.ts";
import { gameZip } from "../../tools/export/game.ts";
import { zipStore } from "../../tools/export/zip.ts";
import { build, ROOT } from "../../tools/play-stage/build.ts";
const enc = new TextEncoder();
const dir = (): string => mkdtempSync(join(tmpdir(), "apk-11b-"));
const readTree = (root: string): Record<string, string> => Object.fromEntries(listFiles(root).map((name) => [name, readFileSync(join(root, name), "utf8")]));
const files = (rows: readonly (readonly [string, string])[]): Uint8Array => zipStore(rows.map(([name, body]) => ({ name, data: enc.encode(body) })));
const COMMIT = "c".repeat(40);
const BASE: readonly (readonly [string, string])[] = [["index.html", "<canvas id=\"board\"></canvas>\n"], ["build.json", `{\n  "commit": "${COMMIT}",\n}\n`], ["project/files.js", "export default {}\n"]];
test("11b patchGradle on a Capacitor 6 android/ (minSdkVersion = 22 in variables.gradle, a multi-line <activity>, the INTERNET permission) sets minSdk 26 and portrait and drops INTERNET; with no minSdk line or no <activity> it throws", () => {
  const android = dir();
  try {
    mkdirSync(join(android, "app/src/main"), { recursive: true });
    writeFileSync(join(android, "variables.gradle"), "ext { minSdkVersion = 22 }\n");
    writeFileSync(join(android, "app/build.gradle"), "android { minSdkVersion 21 }\n");
    writeFileSync(join(android, "app/src/main/AndroidManifest.xml"), "<manifest>\n    <uses-permission android:name=\"android.permission.INTERNET\" />\n    <application>\n        <activity\n            android:name=\".MainActivity\">\n        </activity>\n    </application>\n</manifest>\n");
    patchGradle(android);
    const vars = readFileSync(join(android, "variables.gradle"), "utf8");
    const gradle = readFileSync(join(android, "app/build.gradle"), "utf8");
    const man = readFileSync(join(android, "app/src/main/AndroidManifest.xml"), "utf8");
    assert.equal(vars.includes("minSdkVersion = 26") && gradle.includes("minSdkVersion 26") && man.includes('android:screenOrientation="portrait"') && !man.includes("android.permission.INTERNET"), true);
    const bare = dir();
    mkdirSync(join(bare, "app/src/main"), { recursive: true });
    writeFileSync(join(bare, "app/build.gradle"), "android { compileSdk 34 }\n");
    writeFileSync(join(bare, "app/src/main/AndroidManifest.xml"), "<manifest><application></application></manifest>\n");
    assert.throws(() => patchGradle(bare), /apk: no minSdk/);
    writeFileSync(join(bare, "variables.gradle"), "ext { minSdkVersion = 22 }\n");
    assert.throws(() => patchGradle(bare), /apk: no activity/);
    rmSync(bare, { recursive: true, force: true });
  } finally {
    rmSync(android, { recursive: true, force: true });
  }
});
test("11b gameWww: a release game export becomes www and passes the play-only, offline and debug checks; a dev export, a zip with no project module, a network URL, an editor file, a path leaving www and a non-empty www are refused", async () => {
  const playDir = dir();
  const devDir = dir();
  const www = dir();
  build(playDir, COMMIT, ROOT, false);
  build(devDir, COMMIT, ROOT, true);
  const demo = readTree(join(ROOT, "fixtures/demo.tileproj"));
  const release = await gameZip(readTree(playDir), demo, {});
  const dev = await gameZip(readTree(devDir), demo, {});
  rmSync(www, { recursive: true, force: true });
  gameWww(release, www);
  assert.equal(listFiles(www).includes("index.html") && listFiles(www).includes("build.json") && listFiles(www).includes("project/files.js") && zipCommit(www) === COMMIT, true);
  assert.throws(() => gameWww(dev, dir()), /apk:/);
  assert.throws(() => gameWww(files(BASE.filter(([name]) => name !== "project/files.js")), dir()), /missing project\/files\.js/);
  assert.throws(() => gameWww(files([...BASE, ["net.js", "export const u = \"https://example.com/x\";\n"]]), dir()), /net\.js: https:\/\/example\.com\/x/);
  assert.throws(() => gameWww(files([...BASE, ["src/editor/x.js", "export default 1;\n"]]), dir()), /src\/editor\/x\.js/);
  assert.throws(() => gameWww(files([["../out.txt", "no\n"], ...BASE]), dir()), /leaves www: \.\.\/out\.txt/);
  assert.throws(() => gameWww(release, www), /www is not empty/);
});
test("11b demoZip and the scripts: the demo export carries fixtures/demo.tileproj as the project module and its build.json commit, and a failed demo build leaves no temp folder; setup-sdk.sh pins Temurin and cmdline-tools by sha256; debug-apk.sh builds assembleDebug only (no release signing, keystore or store upload) into the gitignored artifacts/, and .gitignore keeps android/, www, artifacts and key files out (eslint skips the first three)", async () => {
  const commit = "a".repeat(40);
  const zip = await demoZip(commit);
  const www = dir();
  gameWww(zip, www);
  assert.equal(readFileSync(join(www, "project/files.js"), "utf8").includes("\"name\": \"Demo\"") && zipCommit(www) === commit, true);
  const before = readdirSync(tmpdir()).filter((name) => name.startsWith("apk-play-"));
  await assert.rejects(demoZip("not-a-sha"));
  assert.deepEqual(readdirSync(tmpdir()).filter((name) => name.startsWith("apk-play-")), before);
  const setup = readFileSync("tools/apk/setup-sdk.sh", "utf8");
  const sh = readFileSync("tools/apk/debug-apk.sh", "utf8");
  const ignore = readFileSync(".gitignore", "utf8");
  const lint = readFileSync("eslint.config.mjs", "utf8");
  assert.equal(setup.includes("OpenJDK17U-jdk_x64_linux_hotspot_17.0.21.1_2.tar.gz") && setup.includes("0b0ac5eab6db6abaec68c9913bcddb31321e5da411c45073d520d9c125e6f7b4") && setup.includes("commandlinetools-linux-11076708_latest.zip") && setup.includes("2d2d50857e4eb553af5a6dc3ad507a17adf43d115264b1afc116f95c92e5e258") && (setup.match(/sha256sum -c/g) ?? []).length === 2, true);
  assert.equal(sh.includes("assembleDebug") && sh.includes('--game "$ZIP"') && sh.includes("artifacts/") && !sh.includes("assembleRelease") && !sh.includes("signingConfig") && !sh.includes("keystore") && !/password/i.test(sh) && !sh.includes(".jks"), true);
  assert.equal(ignore.includes("tools/apk/android") && ignore.includes("tools/apk/www") && ignore.includes("tools/apk/artifacts") && ignore.includes("*.jks") && ignore.includes("*.keystore") && lint.includes("tools/apk/android/**") && lint.includes("tools/apk/www/**") && lint.includes("tools/apk/artifacts/**"), true);
});
```

### `handoff/steps/tests/s11b-debug-apk/smoke.mjs` (new)

```js
// Step 11b debug apk. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s11b-debug-apk/smoke.mjs . 8820 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8820", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const { gameWww } = await import(pathToFileURL(join(root, "tools/apk/build.ts")).href);
const makerDir = mkdtempSync(join(tmpdir(), `s11b-maker-${REV}-`)), www = mkdtempSync(join(tmpdir(), `s11b-www-${REV}-`));
build(makerDir, "0".repeat(40), root, false);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" };
const listen = (dir, port) => new Promise((ok) => { const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(dir, "." + path); if (!file.startsWith(resolve(dir) + sep) && file !== resolve(dir)) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } }); srv.listen(port, "127.0.0.1", () => ok(srv)); });
const maker = await listen(makerDir, Number(PORT)), game = await listen(www, Number(PORT) + 1);
const makerOrigin = `http://127.0.0.1:${PORT}`, gameOrigin = `http://127.0.0.1:${Number(PORT) + 1}`;
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${makerOrigin}/maker/`, { waitUntil: "load" }); await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    let gp = null;
    await step("1 zip", async () => {
      await page.waitForFunction(() => document.querySelector('[data-act="build"]') !== null, null, { timeout: 15000 });
      const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build"); const dl = await pending;
      rmSync(www, { recursive: true, force: true });
      gameWww(new Uint8Array(readFileSync(await dl.path())), www);
    });
    await step("2 play", async () => {
      const off = [];
      gp = await ctx.newPage();
      gp.on("request", (rq) => { const u = rq.url(); if (u.startsWith(gameOrigin) || u.startsWith("data:") || u.startsWith("blob:")) return; off.push(u); });
      gp.on("pageerror", (e) => errs.push(String(e)));
      await gp.goto(`${gameOrigin}/index.html`, { waitUntil: "load" });
      await gp.waitForFunction(() => { const banner = document.querySelector("#banner"), board = document.querySelector("#board"); const box = board instanceof HTMLElement ? board.getBoundingClientRect() : null; return banner?.textContent === "YOUR TURN" && box !== null && box.width > 0 && box.height > 0 && document.querySelector("#back-maker") === null && window.__play === undefined; }, null, { timeout: 15000 });
      if (off.length > 0) throw new Error(off[0]);
    });
    await step("3 turn", async () => {
      if (gp === null) throw new Error("no game");
      const end = gp.locator("#end"); await end.waitFor({ timeout: 15000 }); const box = await end.boundingBox(); if (box === null) throw new Error("end");
      await gp.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await gp.waitForFunction(() => document.querySelector("#banner")?.textContent === "ENEMY TURN", null, { timeout: 15000 });
      await gp.waitForFunction(() => document.querySelector("#banner")?.textContent === "YOUR TURN", null, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); maker.close(); game.close(); rmSync(makerDir, { recursive: true, force: true }); rmSync(www, { recursive: true, force: true }); }
```
