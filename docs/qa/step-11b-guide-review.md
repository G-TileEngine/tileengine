# Step 11b kit review (guide, paste, trial) — QA

**Verdict: OK TO SEND once 11a merges and CoS fills in `<11A MERGE SHA>` and `<11A COUNT>`.** There are no must-fixes in 11b. If 11a r2 changes `tools/export/game.ts`, re-apply the 11b trial on top of 11a r2 before the go-line. QA will re-run it in the 11a r2 pass.

## Kit checked (sha256, in /workspace/share/s11/)
- Guide `step-11b-debug-apk.md` 35b4129e26d14639e6c6a05d970125b3b57473a027801b2ebb80d7e76870aab4 (`-r1` identical)
- Paste `step-11b-paste.md` 8534b0ce02bac42fa243cddb36e3c946bbc9cf69ae05dcf4aa1b6b71d5784fcc (`-r1` identical)
- Trial `s11b-trial.patch` ec9f5c93ac17925d9c3b18c339b58aaf1c53db2c7b1e1c61ded3415a44f4cb51 (`-r1` identical)

## Trial run (QA: e9cf8fbd plus the 11a trial committed as 53aed3ea, then the 11b trial; worktree /workspace/q-11b)
- The patch applies clean. The count is 6 files, 214+ 6− = 220/400, matching the Build table, and every file is under its cap.
- Green gave pass 1168 and fail 0, which meets the floor (1165 + 3). Tools tsc shows only the 3 base errors.
- All 23 smokes passed solo, run with /opt/google/chrome/chrome. s11a gave 6 ok and s11b gave 6 ok, at both 390 and 360. s11b only waits with waitForFunction, and it checks for no requests to other origins and no dev path.
- s8-audit gave 135 / 149 / 149 and AUDIT PASS, so 11b leaves the audit counts unchanged.
- I checked the trial APK (e4447ac7…8f14) with `aapt2 dump badging`:
  - The package is `com.tileengine.play`.
  - `sdkVersion` is 26 and `targetSdkVersion` is 34.
  - The screen is locked to portrait (`screenOrientation=1`).
  - It is `debuggable=true`, as expected for a debug build.
  - www carries `index.html`, `build.json` and `project/files.js`.

  This means P1-9's Gradle no-op is fixed.
- The paste's token line holds only the placeholder. The scripts only run `assembleDebug`, and test 3 checks there is no keystore, release signing or upload.
- Helpers: guide L102 lists every helper, including s11b-keep-zip.mjs, allsmoke-11b.sh and the android-tools scripts.
- QA's own mutations on apk-11b.test.ts:
  - Removing the `hits === 0` throw is caught by test 1.
  - Removing the leaves-www check is caught by test 2.
  - Removing `playOnly` and `networkUrls` from gameWww is **not caught**. That is a carry.

## Carries (non-blocking)
- Test 2 has 8 lines left under its cap. One assert there would pin the network and play-only refusals, for example a zip whose JS holds an `https://` URL being refused.
- With a zip, `--game` writes `apk-build.json` with the repo HEAD as the commit, not the commit in the zip's `build.json`. The metadata should name the zip's commit, or both.
- `setup-sdk.sh` fetches the "latest" Temurin 17 and the cmdline-tools zip without checking a sha256. This is acceptable for a box-only tool, but pinning it would make it reproducible.
- `demoZip` only removes its temp folder on success. A throw leaves the folder in `/tmp`.
- The INTERNET permission is still in the manifest (guide Q2 and DSK E6 Q4). It stays open for a device check.
- Both guides quote the CEO's 2026-11-24 18:03 line with "too". CoS's transcript shows he typed "top", which was a typo. Quote him exactly, for example "there top [sic: too]".
