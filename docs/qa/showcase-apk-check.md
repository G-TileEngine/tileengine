# QA APK check: steps 1-11 showcase (debug)

2026-11-26 23:59 London, QA & Build Guard.
- APK: /workspace/share/showcase-apk/TileEngine-12ee5d026849-debug.apk, 3958764 bytes, sha256 a2be6d8c82dac972409e15181907f88c97aa9bedf74673cb510329a470f7e643.
- Built by CoS from 98325f54.

**Verdict: APK PASS.**

## Checks (all run by me)
- Input zip: steps-1-11-game.zip sha256 7600a41f…9539. It matches my own zip from 98325f54 (see showcase-steps-1-11-check.md f547f883).
- Badging (aapt2):
  - Package com.tileengine.play, versionCode 1.
  - minSdk 26, targetSdk 34, compileSdk 34.
  - Launchable activity com.tileengine.play.MainActivity.
- Permissions: the only uses-permission is the app's own com.tileengine.play.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION, a signature-level permission the androidx core library adds. There's no INTERNET and no android.permission.* at all.
- Manifest: the main activity is screenOrientation 1 (portrait). The app is debuggable=true, as expected for a debug build.
- Signature: apksigner reports "Verifies" with v2. That's enough for minSdk 26, since v2 works from API 24.
  - Cert CN=Android Debug, SHA-256 c9b9c06f3b34c8d6ec739648d2d597b4f46104e466bba30a61b8165b16d7131e.
  - Same debug cert as before.
- Contents: assets/public has 139 files. `diff -r` against the unzipped zip shows the same 137 files byte for byte; the only additions are cordova.js and cordova_plugins.js from Capacitor.
  - build.json commit is 98325f54.
  - project/files.js sha256 is 8c768720, the same as in the zip.
  - project/assets/asset_0c8c7bfc05fb48c1.png sha256 is 0c8c7bfc…ce72, the same as the source in data/showcase.
- Export audit: no dev.js and no window.__ anywhere in assets/public.

## Not covered
- On-device behaviour: README phone rows 1–14 on the S21, with a shot per stage. That's the CEO's phone test.
- The known gaps stand: no weighted or waves pools, no save or Continue in exports, and budgets absent.
