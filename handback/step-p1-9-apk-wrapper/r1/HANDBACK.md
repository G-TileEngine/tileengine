# Hand-back step-p1-9-apk-wrapper r1
Step file: handoff/steps/step-p1-9-apk-wrapper.md (sha256 4141f87cd4707fef8e5e202d149f8fe8c2d47a002eb4ad087480986a19e896ea)
Base commit: 5833bed935b1b265f459e84438926ae5b9741577     Head commit: 44245970296bace1afcc2e2adbd5fa9b8daa5c64     Tree: d5049b19bd8bde66faf7fe4841d99a76e33bbfa0     Branch: step/step-p1-9-apk-wrapper-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	.gitignore
A	tests/tools/apk.test.ts
A	tests/tools/play-stage-p19.test.ts
A	tools/apk/build.ts
A	tools/apk/capacitor.config.json
A	tools/apk/package.json
M	tools/play-stage/board.ts
M	tools/play-stage/build.ts
A	tools/play-stage/dev.ts
M	tools/play-stage/hud.ts
M	tools/play-stage/load.ts
M	tools/play-stage/page.ts

## Green
npm test: 1014/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm run green: exit 0 on the head tree. npm test: 1014 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 57899.956317. deps 148 modules / 470 deps. check:state OK (src). check:law OK (src).

## Smoke
PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core (playwright-core@1.59.1) CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome node handoff/steps/tests/step-p1-9-apk-wrapper/smoke.mjs . 8796 /tmp/p1-9-smoke.png
ok   www has no network URL: none
ok   www is play-only: ok
ok   release www has no debug globals: none (dev www keeps them)
ok   map row 0 whole and tappable, banner up at 390: {"banner":"up","rowTop":50,"rowBottom":242,"canvasTop":48,"cols":2,"backing":1,"tapped":true,"bad":[]}
ok   map row 0 whole and tappable, banner dismissed at 390: {"banner":"dismissed","rowTop":50,"rowBottom":242,"canvasTop":48,"cols":2,"backing":1,"tapped":true,"bad":[]}
ok   no sideways scroll at 390: scrollWidth 390
ok   touch targets >= 44x44 at 390: {"shown":[{"t":"Menu","w":48,"h":48,"id":"menu"},{"t":"End turn","w":62,"h":48,"id":"end"}],"small":[],"end":true,"menu":true}
ok   stage looks load and torches draw at 390: {"failed":0,"errors":0,"missing":false,"lightBuilds":1,"draws":58}
ok   no page errors at 390: none
ok   no external request at 390: none
ok   map row 0 whole and tappable, banner up at 360: {"banner":"up","rowTop":50,"rowBottom":226,"canvasTop":48,"cols":3,"backing":1,"tapped":true,"bad":[]}
ok   map row 0 whole and tappable, banner dismissed at 360: {"banner":"dismissed","rowTop":50,"rowBottom":226,"canvasTop":48,"cols":3,"backing":1,"tapped":true,"bad":[]}
ok   no sideways scroll at 360: scrollWidth 360
ok   touch targets >= 44x44 at 360: {"shown":[{"t":"Menu","w":48,"h":48,"id":"menu"},{"t":"End turn","w":62,"h":48,"id":"end"}],"small":[],"end":true,"menu":true}
ok   stage looks load and torches draw at 360: {"failed":0,"errors":0,"missing":false,"lightBuilds":1,"draws":56}
ok   no page errors at 360: none
ok   no external request at 360: none
ok   release www runs with no debug globals at 390: {"globals":[],"w":390,"h":664,"hud":true,"errors":0}
SMOKE PASS

## Shipped tests (sha256, byte-identical to the kit)
feb483ebedf03115bd917976792bf2a86c587abb59705ca5af749bc2a8e503a8  tests/tools/apk.test.ts
6d368b89946b7eb16217291b4c2ee8cc4a9750604493df2164b51a9b2ad870b5  tests/tools/play-stage-p19.test.ts

## Helpers & self-review
- Helper apk/release review (9ef7df54-8ef7-413d-ade2-42db80a35323): reviewed tools/apk/build.ts, the Capacitor pins and config, and tools/play-stage/build.ts release() against the step and the shipped tests. No must-fix. Pins are core/android/cli 6.2.0 and app 6.0.3. appId is com.tileengine.play, androidScheme is https, allowMixedContent is false, minSdk is 26. networkUrls and playOnly scan the tree. patchMainActivity writes FLAG_KEEP_SCREEN_ON and hideSystemBars with no URL. patchGradle sets minSdk 26 and portrait. writeMeta records playOnly true. release drops the DEV import and if (DEV) lines and throws otherwise. The default build is a release build. debugGlobals and buildApk refuse a www that still has a debug path. No Capacitor, SDK or Gradle install, and no src/ change.
- Helper HUD/seed review (e899c99f-cfca-4603-bd38-7fdd92a333c5): reviewed board.ts, hud.ts, page.ts, load.ts and the kit smoke against the r5 layout and DEMO_SEED. No must-fix. boardBox sits between the bands. The canvas is position fixed to that box and reapplied on resize. The fit band is canvas.clientHeight. The banner is in the top bar, click-through, and still hides after 1260 ms. The plate and the action row stay in the foot. The hooks are one if (DEV) line plus the DEV import, both ending in // dev-only. DEMO_SEED is the only 24301.
- Helper caps review (a8605bd2-3787-4950-bc1c-186349d42e1a): checked git diff --numstat, cmp of both shipped tests, and the do-not-touch paths. No must-fix. Total 296 (287 insertions, 9 deletions), under 400. Every file is inside its cap. Both shipped tests match the kit. The diff does not touch src/, painter-proto/, ui-shell/, the root package.json or package-lock.json. tools/apk/build.ts never invokes npm, gradle or cap; the only execFileSync is git, and only when that file is the entrypoint.
- Self-review: Acceptance done. npm ci exit 0 and npm run green exit 0 with 1014/0 (base 1007 + 7); none cancelled, skipped or todo. typecheck, lint, deps, check:state and check:law each exit 0. P1-8 is on this main (c0ea6e96 is the parent of the branch base), and the shipped tests import the APIs that are on it, so the step was not stopped. Each file is inside its cap (gitignore 7/8, package.json 12/16, capacitor.config.json 12/14, apk/build.ts 94/160, play-stage/build.ts 13/14, dev.ts 2/4, board.ts 2/5, hud.ts 3/6, page.ts 9/12, load.ts 7/10, apk.test.ts 79/79, play-stage-p19.test.ts 56/60). Total 287 insertions + 9 deletions = 296, under the hard cap 400 and inside 150–400. Both shipped tests are byte-identical to the kit (cmp, sha256 above). Earlier play-stage tests stayed green inside the 1014. Kit smoke is SMOKE PASS at 390×844 and 360 wide, including the release www at /rel/ (lines above). painter-proto/, ui-shell/, src/core, src/types/core-types.ts, src/rules/behaviours/catalogue.ts and src/sim/migrations are absent from the diff. No Capacitor, Android SDK or Gradle package was installed, and no APK was built or signed. No new BTF paste. QA checklist: G1 done (both shipped tests verbatim; the 7 new tests ran inside the 1014; no .only, skip or todo added). G2 done (tsc exit 0; no ts-ignore, ts-expect-error or any added). G3 done (check:state OK on src; no new direct battle assign). G4 done (the step quotes no interface block; APP_ID, CAP, MIN_SDK, boardBox, HUD_TOP, ROW_FOOT, PLATE_H, HUD_FOOT, DEV_ONLY, release, buildWeb, debugGlobals and DEMO_SEED match what the shipped tests import). G5 done (do-not-touch paths absent). G6 done (only the twelve files in the step table). G7 done: 296 is inside 150–400, every file is at or under its stated cap, the hard cap 400 holds, and lines were not padded. G8 done (check:law OK; no new clock; the Capacitor pins are in tools/apk/package.json only and were not installed). G9 done (decisions below). G10 done (each Acceptance line above).

## Decisions & deviations
- The branch was created from origin/main at 5833bed935b1b265f459e84438926ae5b9741577, which is the step's "current main when you start". The named SHA c0ea6e96a3837e7bf547ac37abd0644fae7a45bf is that commit's parent (QA: P1-8 build review). The only commit between them is "Add LICENSE: proprietary, all rights reserved". It adds no tests, so the floor stays 1007 + 7 = 1014. The diff is 5833bed..head and does not contain the LICENSE file. The run is 1014/0.
- Changed lines are 296 (287 insertions, 9 deletions). Proto was 353. Hard cap 400. Nothing was padded. tools/apk/build.ts is 94 lines against a 150 proto and a 160 cap because the ops path does not shell out to cap or gradle. File counts against the caps: gitignore 7/8, package.json 12/16, capacitor.config.json 12/14, apk/build.ts 94/160, play-stage/build.ts 13/14, dev.ts 2/4, board.ts 2/5, hud.ts 3/6, page.ts 9/12, load.ts 7/10, apk.test.ts 79/79, play-stage-p19.test.ts 56/60. No extra file. No root dependency.
- tools/apk/package.json sets "type": "module". Node otherwise treats that folder as typeless, because this package.json is the nearest one when it loads tools/apk/build.ts, and it warns. The pins are exact strings: @capacitor/core, @capacitor/android and @capacitor/cli at 6.2.0, @capacitor/app at 6.0.3. They were not installed.
- capacitor.config.json puts minSdkVersion 26 on the android object, beside allowMixedContent false. server.androidScheme is https. appId is com.tileengine.play, appName is TileEngine, webDir is www. MIN_SDK exported from build.ts is the same 26, and patchGradle and writeMeta use that constant.
- MainActivity is a short adapt. docs/APK.md and scripts/android.mjs are not in this checkout, so the patch was not pasted from them. The class package is com.tileengine.play. onCreate sets FLAG_KEEP_SCREEN_ON and calls hideSystemBars, which sets the immersive sticky, fullscreen and hide-navigation system-ui flags. The java has no http or ws URL. patchGradle replaces every minSdk and minSdkVersion number with 26 and adds android:screenOrientation="portrait" when the activity tag does not already have it. --apk was not run. If @capacitor/cli or android/ is missing, that path prints that CoS/EA run npm i and cap add android in tools/apk, then exits 2.
- release keeps a line marked // dev-only only when the code is exactly `import { DEV } from "./dev.ts";` or it starts with `if (DEV)`. Any other marked line throws "must be an if (DEV) statement". A DEV token on an unmarked line throws "DEV is used outside a dev-only line". build defaults dev to false, so a release www never walks dev.ts. writeMeta(file, commit, sha) always records playOnly true; the shipped test does not pass it the www directory. The --web CLI writes apk-build.json beside the out folder, not inside it.
- The banner rule sets box-sizing:border-box. Its 2px top and bottom borders would otherwise stick out of the 48px bar and cover the top of row 0. right:64px leaves the 48px Menu in the clear. #hud #banner{pointer-events:none} is the click-through. The 1260 ms hide is the existing timeout and was not changed. place() assigns the canvas to boardBox(innerHeight) and runs again on resize, and that handler sets seated back to false so the next frame reseats the camera. The fit band uses canvas.clientHeight. DEMO_SEED is 24301 and is the only such literal in load.ts.
- Smoke used CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome and PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core (playwright-core@1.59.1). /usr/bin/google-chrome is not on this machine. smoke.mjs was not edited. Node printed an ExperimentalWarning while stripping the build script; it is not a smoke check and the run still ended SMOKE PASS. No runtime cache was added. Restart and Back still call location.reload(); those lines were not edited.

## Next step (optional proposal)
- The step says builder work stops at P1-9. The signed APK is an ops job on the box (npm i and cap add android in tools/apk, then --web and --apk), with the keystore kept outside the repo.
