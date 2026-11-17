# step-p1-9-apk-wrapper: Phase 1 P1-9 "APK wrapper" (foundation-plan-phased.md §4, ~lines 84–98). Play-only Capacitor 6 wrapper in `tools/apk/` with its own `package.json` (the 5 root pins do not move): config, `build.ts` (`--web` builds play-stage into `www/`; `--apk` is ops), Android patches kept in the script because `cap sync` overwrites `MainActivity` (BTF `docs/APK.md` L21, L53; `scripts/android.mjs:96–175`), and tests that the www folder has no network URL and opens offline. Building, signing and uploading the APK itself is an ops task, not this step. Proof: kit-run headless Chromium smoke of the www/ output at 390×844 and 360 wide. The CEO's first real test is the APK (phone test 1 after E7 is dropped).

Step id: step-p1-9-apk-wrapper          Revision: r4 (restack on P1-8 r4, the CEO 18:52 render fold; smoke also checks the stage looks; 255 / cap 400; code unchanged)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: current main when you start (at kit authoring, `origin/main` is `1f779185b1f9b4d6cb33587820d187f948ef5b14`, runnable count **992**, with P1-6h, E7p and P1-6 r2 already merged; P1-7 r5 is building). **P1-8 must already be merged on that main** (and therefore P1-7, P1-6h, E7p, P1-6…P1-2, E7). Floor = that main's test count + 4. If P1-8 is not on main, or if P1-8's APIs on main differ from what the shipped tests import, **stop and report**. At kit authoring the stack after P1-8 r4 is 1007/0, so the authoring floor is **1011**. Branch: `step/step-p1-9-apk-wrapper-r<N>-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.
Hand-back location: `handback/step-p1-9-apk-wrapper/r<N>/HANDBACK.md`. Quote this step file's sha256 in full in it.
Depends on: P1-8 (play-stage FX + `tools/play-stage/build.ts` static build) and therefore P1-7 / E7p / P1-6…P1-2 / E6 / E7. Build order on main is E6 → P1-3 → P1-4 → P1-5 → E7 → P1-6 → E7p → P1-6h → P1-7 → P1-8 → **P1-9**. Work stops at P1-9 (CEO 2026-11-17 05:26).

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Goal
After P1-8 the play page plays spell effects in a browser, but there is no Android wrapper in the repo. After this step:
1. **Own package.** `tools/apk/package.json` pins Capacitor 6 (`@capacitor/core@6.2.0`, `@capacitor/app@6.0.3`, `@capacitor/android@6.2.0`, `@capacitor/cli@6.2.0`) the same way `tools/pixel-suite` keeps its own pins, so the 5 root pins do not move. `capacitor.config.json` uses appId `com.tileengine.play`, name `TileEngine`, `webDir` `www`, `androidScheme` `https`, `allowMixedContent` false, minSdk 26 (BTF `docs/APK.md` L24, L26, L47; `capacitor.config.json` L1–11 — adapt, do not paste the BTF tree).
2. **Web build.** `tools/apk/build.ts --web <out>` reuses `tools/play-stage/build.ts` to write a play-only static folder. It refuses a dirty checkout (same rule as play-stage). The www tree has no `http(s)` / `ws(s)` URL and no editor / effect-designer / painter-proto / ui-shell files. `apk-build.json` (written beside www, not inside it) records commit, `wwwSha256`, `playOnly: true`, appId, minSdk, `androidScheme`.
3. **Ops `--apk` path (do not run in this step).** After `cap sync android`, the script rewrites `MainActivity` and keeps minSdk 26 + portrait (`patchMainActivity` / `patchGradle`; BTF `scripts/android.mjs:96–175` and `docs/APK.md` L21, L53: sync overwrites the file, so the patch lives in the script). If Capacitor or the `android/` project is missing, `--apk` exits 2 with a message that CoS/EA run `npm i` and `cap add android` in `tools/apk` on the box. Builders must not install Capacitor, the Android SDK, or Gradle packages, and must not build or sign an APK.
4. **Tests and smoke.** Shipped tests call `buildWeb()` into a tmp dir (they do not use the dirty-checkout CLI). They prove the pins, the www scan, a planted URL / editor file is flagged, and the MainActivity / gradle patches. Kit-run headless Chromium serves that www/ output statically (not `tools/serve.ts`) at 390×844 and 360 wide, fails on any external request, and checks boot, 44 px targets, no sideways scroll, that the stage looks load (every picture loads, torch lights draw), and no page errors.

## Rulings made
- The wrapper is play-only (UX agreed). Editor, effect-designer, painter-proto and ui-shell stay out of www/.
- appId `com.tileengine.play`, name `TileEngine`, minSdk 26, `androidScheme` `https`, `allowMixedContent` false.
- The keystore stays on the box, outside the repo. This step does not create, copy or commit it.
- `--web` and the shipped tests must not require installing Capacitor or the Android SDK.
- BTF is a reference only: file:line cites, adapt, never paste whole trees (`docs/APK.md`, `capacitor.config.json` L1–11, `scripts/android.mjs:96–175`).

## Open questions
None that block this step.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `tools/apk/package.json` | new: own Capacitor 6 pins | 13 | 16 |
| `tools/apk/capacitor.config.json` | new: play-only Capacitor 6 config | 12 | 14 |
| `tools/apk/build.ts` | new: `--web`, scanners, `patchMainActivity` / `patchGradle`, ops `--apk` | 144 | 160 |
| `.gitignore` | ignore `tools/apk/{node_modules,package-lock.json,www,android,artifacts}`, plus `*.jks` and `*.keystore` (keystore stays on the box) | 7 | 8 |
| `tests/tools/apk.test.ts` | new, shipped, byte-identical | 79 | 79 |
Total ≤ 400 changed lines (proto **255**: tools 169, tests 79, gitignore 7; added+deleted). Hard cap 400. (Plan estimate was ~250; 255 stays under the cap.)

## Tests that prove it is done (4 new; ship the file byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-9-apk-wrapper/` to the same paths at the repo root. `tests/tools/apk.test.ts` (4 tests: own Capacitor 6 pins, root package unchanged, config appId / scheme / no mixed content / minSdk 26; www is a play-only static build with no network URL and an `apk-build.json` whose sha matches the tree; `patchMainActivity` is rewritten after a sync overwrite and `patchGradle` keeps minSdk 26 and portrait; `networkUrls` reports a planted http(s) URL and `playOnly` flags an editor file). N = 4. Earlier play-stage tests stay green.

## How a planted bug is caught
EA plants 8/8 (`p1-9-plants.py`). `networkUrls` dropping a planted URL, `playOnly` never flagging an editor file, `allowMixedContent` left on, `androidScheme` set to `http`, minSdk falling back to 22, `patchMainActivity` dropping `FLAG_KEEP_SCREEN_ON`, the own `@capacitor/core` pin moving off 6.2.0, or `writeMeta` claiming the www is not play-only each fail a shipped test.

## Kit-run browser smoke (0 repo lines)
`handoff/steps/tests/step-p1-9-apk-wrapper/smoke.mjs` is required in the hand-back. From the repo root: `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-p1-9-apk-wrapper/smoke.mjs . 8796 /tmp/p1-9-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It builds www via `buildWeb()`, serves that folder statically (not `tools/serve.ts`), opens it headless at **390 × 844** and **360 wide** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute). Visible (not `display:none`) buttons must be ≥ 44×44. Any request that is not this localhost origin (or `data:` / `blob:`) is a FAIL. The www scan must report no network URL and play-only. Every picture must load (`__driver.stats.failed` 0, `backend.stats.missing` false), and the torch lights must draw (`backend.stats.lightBuilds` > 0), so the APK shows the P1-8 r4 stage looks.

## Ops (CoS/EA on the box; not the builder step)
Building, signing and uploading the APK is an ops task on the box. The release keystore stays on the box, **outside the repo** (e.g. `/workspace/apk-keys/`, CoS custody). Never committed, never copied into `www/` or into the APK. A debug key from another machine would force an uninstall; the same box keystore lets each update install over the last one.

The box already has JDK 17 at `~/opt/jdk17` and the Android SDK at `~/opt/android-sdk` (platform-tools, platforms;android-34, build-tools 34.0.0). `JAVA_HOME` / `ANDROID_HOME` may be unset — export them for the build. Do not install a second SDK. Gradle and the Capacitor npm packages download on first ops build (`npm i` in `tools/apk` only).

On the box, CoS/EA run:
1. `export JAVA_HOME=$HOME/opt/jdk17 ANDROID_HOME=$HOME/opt/android-sdk ANDROID_SDK_ROOT=$HOME/opt/android-sdk`
2. First time only, in `tools/apk`: `npm i` then `npx cap add android`.
3. From the repo root: `node tools/apk/build.ts --web tools/apk/www` then `node tools/apk/build.ts --apk`. The script syncs, patches `MainActivity` / gradle (minSdk 26, portrait), and runs `gradlew assembleDebug` (or `assembleRelease` when signing).
4. Sign the release APK with the box keystore (`apksigner`), write sha256 next to the artifact, and keep it out of the repo. Upload is a private Drive copy (a GitHub Release would be public and needs the CEO's SEND).

The emulator on this box cannot run (no KVM). QA's check of the build is the headless www/ smoke; the CEO's install is the real device test.

## CEO phone-test checklist (S21 Ultra and Red Magic 9 Pro)
This is the CEO's first real test (CEO 2026-11-17 05:26: phone test 1 after E7 is dropped). Same signed APK for both phones (both well above minSdk 26 = Android 8).
1. CoS uploads the signed APK to the CEO's private Drive (not a public GitHub Release).
2. On each phone: open the Drive file, allow "install unknown apps" for Drive/Files once, tap Install. Confirm it upgrades over a previous TileEngine install (same appId, same box keystore).
3. Open TileEngine with Wi-Fi off. The match boots (play-only: no editor, no effect-designer).
4. Play a match: walk, Wait, Attack (house default effect), Spell (the designed / editor-saved effect is live, then hits, then retires), Talk if a villager is in reach, End turn (the bot runs), a win and a loss, then Restart.
5. Portrait, the screen stays on, system bars stay hidden. The match itself has no network dependency.
6. Repeat on the other phone.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 1011 tests passing** (main's count at Base + 4, once P1-8 is on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on the stack: 1011/0.)
- [ ] If P1-8 is not on main, or if P1-8's APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 400 changed lines in total (255 in the proto). Hard cap 400.
- [ ] The shipped test file is byte-identical to the kit copy. Earlier play-stage tests stay green. The 5 root pins do not move.
- [ ] **Kit-run browser smoke (REQUIRED)** exits 0 with `SMOKE PASS` at 390×844 and 360 wide (www has no network URL, play-only, stage looks load and torches draw, no page errors, no sideways scroll, visible buttons ≥ 44×44, no external request).
- [ ] Never touch `painter-proto/` or `ui-shell/`. Game rules stay out of `src/core` and `src/sim`. BTF is used only via adapters or rewrites with file:line cites (listed above). Do not install Capacitor, the Android SDK, or Gradle, and do not build or sign an APK in this step.

## Floor
`npm run green` is at least **1011** tests passing (main's count at Base + 4, once P1-8 is on that main: 992 + 6 + 9 + 4). If main's count at Base (with P1-8 already merged) is C, the floor is C + 4.

## Not in this step
- Building, signing or uploading the APK (ops, above).
- Installing Capacitor, the Android SDK, Gradle, or an emulator image.
- r73 project loader / OPFS / `?project=`.
- A designer gh-pages publish, or CEO phone test 1 (dropped).

## Out of scope
painter-proto, ui-shell, GitHub push, core-types, catalogue edits, Phase 2.

## Do not touch
`painter-proto/`, `ui-shell/` (read-only reference is OK), `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts`, `src/sim/migrations`, play-stage shipped tests (including P1-6h), `/workspace/g-tile-engine` (read-only cites only), `/workspace/apk-test` (read-only). Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees. Do not write a keystore into the repo.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 1011 tests passing** and 0 failing (main's count at Base + 4). Paste the summary line and all kit-run browser smoke lines into HANDBACK.md.
- The shipped test file is **byte-identical** to the kit copy.
- The branch starts at the Base (P1-8 already on main). ≤ 400 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-9-apk-wrapper-r<N>-chatA` (base = current main when you start; P1-8 must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-9-apk-wrapper-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
