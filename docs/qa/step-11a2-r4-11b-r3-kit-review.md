# QA: kit check, step 11a2 r4 and step 11b r3

2026-11-26, QA & Build Guard. This follows `step-11a2-r3-guide-review.md` (f83b43ac).

## 11a2 r4: OK TO SEND
- **Hashes match EA's message.**
  - Guide `10e409e0…` (143 lines).
  - Paste `4ac8dfe2…` (12 lines). Base is 1b34e541; only the token placeholder is left.
  - Patch `d84e8ddb…` (246 lines).
- **Patch r3 → r4 diff.** Only three changes:
  - `built = null;` on its own line before the busy `paint()`.
  - Smoke 2 delays build.json by 1.5 s and needs the sheet gone plus a disabled Building… within 1 s of Try again.
  - A literal `&` in `esc`.
- **My run on main 0d8060a3.**
  - Applies cleanly. Count 142 (127+ 15−); home.ts is 34+ 6− against its cap of 40.
  - Green 1167 pass, 0 fail. tsc shows only the 3 base errors.
  - 23/23 smokes pass. s11a2 passes 6/6 three times: once in the full run, twice solo.
  - Audit 135/149/149 PASS.
- **My mutation M31.** I removed `built = null;` and smoke 2 failed at 390 and 360. The r3 must-fix is closed.

## 11b r3: OK TO SEND after the 11a2 merge, with conditions
- **Hashes match.**
  - Guide `46c01ee4…` (140 lines).
  - Paste `d96d28c3…` (12 lines). `<11A2 MERGE SHA>` and `<11A2 COUNT>` are left for CoS to fill.
  - Patch `b5e44f3b…` (325 lines).
- **My run on 0d8060a3 + the 11a2 r4 trial + 11b r3.**
  - Applies cleanly. Count 257 (251+ 6−), inside every cap in the Build table.
  - Green 1170 pass, 0 fail. tsc shows only the 3 base errors.
  - Audit PASS. All 24 smokes pass; s8c needed a solo re-run, as the guide allows.
- **The code matches the merged 11a.**
  - demoZip calls `gameZip(play, text, {})`, and gameWww writes `entry.data`.
  - patchGradle covers `variables.gradle`, a multi-line `<activity` and the INTERNET line, and throws when there's nothing to patch.
  - debug-apk.sh builds assembleDebug only.
- **EA's r3 APKs, checked with aapt2 and apksigner.**
  - `47f8ea0be17c` (demo, sha256 2647f68d…) and `37dc0f0a3b64` (from a Build game zip, sha256 daad938e…).
  - Both show com.tileengine.play, sdk 26, target 34, portrait and debuggable.
  - The only permission is Capacitor's own receiver permission; there is no INTERNET.
  - Signer is CN=Android Debug. `assets/public/project/files.js` and `build.json` are inside.
- **Condition.** Before I OK the filled 11b paste, the 11b patch must pass `git apply --check` on the real 11a2 merge, because the builder's 11a2 code can differ from EA's trial. If it doesn't apply, EA re-trials it.

## Carries (not blocking)
1. **zipCommit's "names no commit" throw is still untested.** This was a carry from the r2 review. A one-line assert with a build.json that has no commit closes it.
2. **setup-sdk.sh installs `platform-tools` with no version.** assembleDebug doesn't need it. Drop it, or pin it in a later tools/apk touch.
3. **s8c failed in 2 of today's 3 full runs.** Both times it was "no hero" at 390, and it passed every solo re-run. If it fails solo, it gets its own fix.
