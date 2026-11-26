# QA check: step 11b box APK (CoS, from merge 71bc22db)

Verdict: **PASS**. Fit for the CEO's private Drive folder once he types SEND. Nothing uploaded or sent.

## File
- /workspace/share/step-11b-apk/TileEngine-5ec146ce019b-debug.apk, 3914759 bytes, sha256 e2ff2aac010a082c5ce97af28ad503d56dccc2e5ac955193ad36639fb7a068a2. It matches the `.sha256` file and the copy in /workspace/apk-build/11b/tools/apk/artifacts/.
- Build worktree /workspace/apk-build/11b at HEAD 71bc22db, `git status --porcelain` empty. artifacts/apk-build.json names commit 71bc22db, playOnly true, minSdk 26.

## My own run (QA's build-tools 34.0.0 and JDK 17, not CoS's)
- aapt2 badging: com.tileengine.play, versionCode 1, sdkVersion 26, targetSdkVersion 34, launchable MainActivity. The only uses-permission is com.tileengine.play.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION (AndroidX). There is no android.permission.* and no INTERNET.
- Manifest xmltree: the activity has screenOrientation=1 (portrait). debuggable=true is expected for a debug build. The exported receiver guarded by android.permission.DUMP is AndroidX profileinstaller (stock).
- apksigner verify: Verifies with the v2 scheme, 1 signer, C=US, O=Android, CN=Android Debug, RSA 2048, cert sha256 c9b9c06f…d7131e.
- Contents: 612 files. assets/public holds index.html, build.json (commit 71bc22db), project/files.js (139239 bytes) and fixtures. No dev.js and no window.__ globals anywhere in assets.

## Carries
- WebView floor: needs Chrome 98+ (structuredClone in migrate.js). The phones are not yet checked.
- CEO phone install check, plus the old 11a2 download and Share-sheet check.
