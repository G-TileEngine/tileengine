# QA review: step 11b r2 guide (debug APK)

2026-11-26, QA & Build Guard. One review of the r2 kit, after the r1 review (`step-11b-guide-review.md`).

**Verdict: OK TO SEND** once 11a and 11a2 merge and CoS fills the placeholders.

## Kit checked (sha256, all match the EA's message)
- Guide `step-11b-debug-apk.md` 8f1b3976dab3b19db63b36f9f639f8505500977644145f1eb9f6db6fff988a00
- Paste `step-11b-paste.md` a7250cc922edccf0ec75e6c91bac31ed596b77fad45754a5511b4140a27b6d3c (token placeholder only)
- Trial patch `s11b-trial.patch` a22122d530aa5820e0138531d48daefd7a1013080e24159142bb6d35af8cc739

## Re-trial (fresh worktree: the 11a2 trial plus the 11b trial)
- Count 241/400 (6 files, +235 −6). Green 1170 pass, 0 fail. tsc: the 3 base errors only.
- All 24 smokes pass solo (s11b 8820 r1, 6 ok). Export audit 135 / 149 / 149, AUDIT PASS. Only the trial's own files in git status.
- Own mutations: putting INTERNET back and leaving the demo temp folder are both caught.

## r1 carries, checked
- INTERNET is dropped. `aapt2` on the r2 APK `TileEngine-b0fc68467847-debug.apk` (b95993293a1ee1042525b09a070a223135fcb9d5ab0981d92f8627af9c615d8b) lists only Capacitor's own receiver permission: com.tileengine.play, sdk 26, target 34, portrait, debuggable.
- The play-only and network-URL refusals are now tested (a network URL, an editor file).
- `apk-build.json` names the game zip's own commit, not the repo HEAD.
- `setup-sdk.sh` pins Temurin 17.0.21.1+2 and cmdline-tools 11076708 by sha256. The JDK pin matches Adoptium's published sha256 file; the cmdline-tools pin matches the box's copy.
- demoZip cleans up its temp folder on a throw (tested).
- Shared app id and no lock file are labelled as CoS rulings, not CEO rulings. CEO quote reads "top [sic: too]". Helpers are all listed.

## Carry (not blocking)
- `zipCommit`'s "names no commit" throw is untested: my mutation that disabled it survived. Add a one-line assert with a build.json that has no commit.
