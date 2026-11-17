# step-p1-9-apk-wrapper: Phase 1 P1-9 "APK wrapper" (foundation-plan-phased.md §4, ~lines 84–98). Play-only Capacitor 6 wrapper in `tools/apk/` with its own `package.json` (the 5 root pins do not move): config, `build.ts` (`--web` builds play-stage into `www/`; `--apk` is ops), Android patches kept in the script because `cap sync` overwrites `MainActivity` (BTF `docs/APK.md` L21, L53; `scripts/android.mjs:96–175`), and tests that the www folder has no network URL and opens offline. Building, signing and uploading the APK itself is an ops task, not this step. **r5 (QA must-fixes on r4b + CoS / Grok Heavy review of main `c913cbd5`):** no HUD part covers or takes taps from a board row, and the release build strips every dev / smoke path through a build-time `DEV` define with dead-code removal. Proof: kit-run headless Chromium smoke of the www/ output at 390×844 and 360 wide. The CEO's first real test is the APK (phone test 1 after E7 is dropped).

Step id: step-p1-9-apk-wrapper          Revision: r5 (QA must-fixes: board inset below the HUD with a click-through banner; release `DEV` define strips dev / smoke paths; `DEMO_SEED`; 353 / cap 400; on P1-8 r5)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: current main when you start (at kit authoring, `origin/main` is `c913cbd55c5abd65399711f369fa53c5f76b7e52`, runnable count **998**, with P1-7 merged (PR #73); P1-8 r5 is next and builds from that main). **P1-8 must already be merged on that main** (and therefore P1-7, P1-6h, E7p, P1-6…P1-2, E7). Floor = that main's test count + 7. If P1-8 is not on main, or if P1-8's APIs on main differ from what the shipped tests import, **stop and report**. At kit authoring the stack after P1-8 r5 is 1007/0, so the authoring floor is **1014**. Branch: `step/step-p1-9-apk-wrapper-r<N>-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.
Hand-back location: `handback/step-p1-9-apk-wrapper/r<N>/HANDBACK.md`. Quote this step file's sha256 in full in it.
Depends on: P1-8 (play-stage FX + `tools/play-stage/build.ts` static build) and therefore P1-7 / E7p / P1-6…P1-2 / E6 / E7. Build order on main is E6 → P1-3 → P1-4 → P1-5 → E7 → P1-6 → E7p → P1-6h → P1-7 → P1-8 → **P1-9**. Work stops at P1-9 (CEO 2026-11-17 05:26).

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Goal
After P1-8 the play page plays spell effects in a browser, but there is no Android wrapper in the repo. After this step:
1. **Own package.** `tools/apk/package.json` pins Capacitor 6 (`@capacitor/core@6.2.0`, `@capacitor/app@6.0.3`, `@capacitor/android@6.2.0`, `@capacitor/cli@6.2.0`) the same way `tools/pixel-suite` keeps its own pins, so the 5 root pins do not move. `capacitor.config.json` uses appId `com.tileengine.play`, name `TileEngine`, `webDir` `www`, `androidScheme` `https`, `allowMixedContent` false, minSdk 26 (BTF `docs/APK.md` L24, L26, L47; `capacitor.config.json` L1–11 — adapt, do not paste the BTF tree).
2. **Web build.** `tools/apk/build.ts --web <out>` reuses `tools/play-stage/build.ts` to write a play-only static folder. It refuses a dirty checkout (same rule as play-stage). The www tree has no `http(s)` / `ws(s)` URL and no editor / effect-designer / painter-proto / ui-shell files. `apk-build.json` (written beside www, not inside it) records commit, `wwwSha256`, `playOnly: true`, appId, minSdk, `androidScheme`.
3. **Ops `--apk` path (do not run in this step).** After `cap sync android`, the script rewrites `MainActivity` and keeps minSdk 26 + portrait (`patchMainActivity` / `patchGradle`; BTF `scripts/android.mjs:96–175` and `docs/APK.md` L21, L53: sync overwrites the file, so the patch lives in the script). If Capacitor or the `android/` project is missing, `--apk` exits 2 with a message that CoS/EA run `npm i` and `cap add android` in `tools/apk` on the box. Builders must not install Capacitor, the Android SDK, or Gradle packages, and must not build or sign an APK.
4. **Tests and smoke.** Shipped tests call `buildWeb()` into a tmp dir (they do not use the dirty-checkout CLI). They prove the pins, the www scan, a planted URL / editor file is flagged, and the MainActivity / gradle patches. Kit-run headless Chromium serves that www/ output statically (not `tools/serve.ts`) at 390×844 and 360 wide, fails on any external request, and checks boot, 44 px targets, no sideways scroll, that the stage looks load (every picture loads, torch lights draw), and no page errors.
5. **Board clear of the HUD (QA r4b must-fix 1).** `board.ts` exports `HUD_TOP = 48`, `ROW_FOOT = 88`, `PLATE_H = 44`, `HUD_FOOT = ROW_FOOT + PLATE_H` and `boardBox(viewH) = { top: HUD_TOP, height: max(0, viewH - HUD_TOP - HUD_FOOT) }`. `page.ts` places the `#board` canvas there (`position: fixed`, re-applied on `resize`), and its fit band is `canvas.clientHeight` (no more `- 176`). `hud.ts` builds its CSS from those constants. The YOUR TURN banner moves into the top bar (`top: 0`, `height: HUD_TOP`, `right: 64px` so Menu stays visible), and `#hud #banner{pointer-events:none}` makes it click-through; it still hides itself after 1260 ms. With the camera seated, map row 0 sits whole on the canvas below the top bar at 390 and 360 @3x, whether the banner is up or dismissed, and no HUD part (top bar, banner, plate, action row) overlaps it.
6. **Release strips dev / smoke paths (QA r4b must-fix 2, CoS / Heavy (a)).** New `tools/play-stage/dev.ts` holds the build-time define `export const DEV = true`. Dev / smoke-only code is a single line ending in `// dev-only` that is either `import { DEV } from "./dev.ts"` or an `if (DEV) …` statement; the window debug hooks (`__play`, `__driver`, `__cam`, `__hud`, `__fx`, `__link`) are one such line in `page.ts`. `tools/play-stage/build.ts` `build(out, commit, root, dev = false)`: a release build (the default: Render / gh-pages, `--web`, the APK) applies `release(src, rel)`. With `DEV` false those lines are dead and dropped, so `dev.ts` is never walked, and the build throws if a dev-only line is not of that form or if `DEV` is still used anywhere. Only the smoke's dev build (`buildWeb(out, commit, root, true)`) and source serving keep the hooks. `tools/apk/build.ts` exports `DEBUG_GLOBALS` (the six hooks, `DEV`, `// dev-only`) and `debugGlobals(dir)`, and `buildApk` refuses a www that has any.
7. **Seed constant (QA flag).** `load.ts` exports `DEMO_SEED = 24301`, used for `DEMO_STAGE.seed`, `DEMO_LOAD.hostSeed` and the `docsToInput` fallback (`docs.hostSeed ?? DEMO_SEED`).

## Rulings made
- The wrapper is play-only (UX agreed). Editor, effect-designer, painter-proto and ui-shell stay out of www/.
- appId `com.tileengine.play`, name `TileEngine`, minSdk 26, `androidScheme` `https`, `allowMixedContent` false.
- The keystore stays on the box, outside the repo. This step does not create, copy or commit it.
- `--web` and the shipped tests must not require installing Capacitor or the Android SDK.
- r5: the debug hooks stay available to the kit smokes only through source serving or the dev build. No release artefact (Render, gh-pages, www, APK) carries them, and the export audit proves that. `X3` (a second rAF is caught only by the P1-8 smoke) and `GROUND_OF` (an unknown terrain id paints as floor) are left as they are (QA carries).
- r5 layout: the talk bubble (`#bubble`, click-through, shown only while a line is said) may still sit over lower board rows; QA's must-fix covered the banner, top bar and bottom HUD.
- BTF is a reference only: file:line cites, adapt, never paste whole trees (`docs/APK.md`, `capacitor.config.json` L1–11, `scripts/android.mjs:96–175`).

## Open questions
None that block this step.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `tools/apk/package.json` | new: own Capacitor 6 pins | 13 | 16 |
| `tools/apk/capacitor.config.json` | new: play-only Capacitor 6 config | 12 | 14 |
| `tools/apk/build.ts` | new: `--web`, scanners, `patchMainActivity` / `patchGradle`, ops `--apk`; r5 debug-path audit | 150 | 160 |
| `.gitignore` | ignore `tools/apk/{node_modules,package-lock.json,www,android,artifacts}`, plus `*.jks` and `*.keystore` (keystore stays on the box) | 7 | 8 |
| `tools/apk/build.ts` (r5 part) | (counted above) `buildWeb(..., dev)`, `DEBUG_GLOBALS`, `debugGlobals`, `buildApk` refuses debug paths | — | — |
| `tools/play-stage/build.ts` | `DEV_ONLY`, `release()` (define + dead-code removal, with throws), `build(..., dev = false)` | 10 | 14 |
| `tools/play-stage/dev.ts` | new: `export const DEV = true` define | 2 | 4 |
| `tools/play-stage/board.ts` | `HUD_TOP`, `ROW_FOOT`, `PLATE_H`, `HUD_FOOT`, `boardBox` | 3 | 5 |
| `tools/play-stage/hud.ts` | CSS from the constants; banner in the top bar, click-through | 4 | 6 |
| `tools/play-stage/page.ts` | canvas inset to `boardBox`; band = `clientHeight`; DEV import + `if (DEV)` hooks line | 9 | 12 |
| `tools/play-stage/load.ts` | `DEMO_SEED` | 8 | 10 |
| `tests/tools/apk.test.ts` | new, shipped, byte-identical (unchanged from r4) | 79 | 79 |
| `tests/tools/play-stage-p19.test.ts` | new, shipped, byte-identical | 56 | 60 |
Total ≤ 400 changed lines (proto **353**: tools 211, tests 135, gitignore 7; added+deleted). Hard cap 400. (r4b was 255; r5 adds 98 for the two QA must-fixes, the release define and `DEMO_SEED`.)

## Tests that prove it is done (7 new; ship both files byte-identical)
Copy both byte-identical from `handoff/steps/tests/step-p1-9-apk-wrapper/` to the same paths at the repo root. `tests/tools/apk.test.ts` (4 tests: own Capacitor 6 pins, root package unchanged, config appId / scheme / no mixed content / minSdk 26; www is a play-only static build with no network URL and an `apk-build.json` whose sha matches the tree; `patchMainActivity` is rewritten after a sync overwrite and `patchGradle` keeps minSdk 26 and portrait; `networkUrls` reports a planted http(s) URL and `playOnly` flags an editor file). `tests/tools/play-stage-p19.test.ts` (3 tests): (1) the board box sits between the HUD bands, and with the seated camera row 0 is whole below the top bar at 390 and 360 @3x; the banner is in the top band and click-through, and the plate and row stay in the foot. (2) Export audit: `release` drops `if (DEV)` lines and the DEV import, and throws on an unguarded dev-only line or a leftover `DEV`; the release www has no debug path, no `dev.js` and no `Object.assign(window`; the dev www keeps all six hooks; a planted `__link` is flagged. (3) `DEMO_SEED` is the stage seed, the demo host seed and the fallback. N = 7. Earlier play-stage tests stay green.

## How a planted bug is caught
EA plants 8/8 (`p1-9-plants.py`). `networkUrls` dropping a planted URL, `playOnly` never flagging an editor file, `allowMixedContent` left on, `androidScheme` set to `http`, minSdk falling back to 22, `patchMainActivity` dropping `FLAG_KEEP_SCREEN_ON`, the own `@capacitor/core` pin moving off 6.2.0, or `writeMeta` claiming the www is not play-only each fail a shipped test.

r5: EA plants 9/9 (`p1-9-r5-plants.py`, shipped tests then kit smoke). Each of these is caught: the canvas not inset (smoke), the banner back over the board, the banner taking taps, the board box ignoring the bottom HUD, `release` keeping dev-only lines, the release build skipping the define, the hooks line not `DEV`-guarded, the audit missing `DEV`, and a stray host-seed literal.

## Kit-run browser smoke (0 repo lines)
`handoff/steps/tests/step-p1-9-apk-wrapper/smoke.mjs` is required in the hand-back. From the repo root: `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-p1-9-apk-wrapper/smoke.mjs . 8796 /tmp/p1-9-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It builds www via `buildWeb()`, serves that folder statically (not `tools/serve.ts`), opens it headless at **390 × 844** and **360 wide** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute). Visible (not `display:none`) buttons must be ≥ 44×44. Any request that is not this localhost origin (or `data:` / `blob:`) is a FAIL. The www scan must report no network URL and play-only. Every picture must load (`__driver.stats.failed` 0, `backend.stats.missing` false), and the torch lights must draw (`backend.stats.lightBuilds` > 0), so the APK shows the P1-8 r5 stage looks. r5 adds these checks: the release www has no debug path while the dev www keeps the hooks. With the YOUR TURN banner up and again after `hideBanner()`, at 390 and 360: map row 0 is whole on the canvas; every sampled point of each on-screen row-0 cell hits the canvas; no visible HUD part overlaps row 0; and a real touch tap on cell (0,0) reaches the canvas. The camera is reset to the top-left first, as it is seated at boot. The smoke measures with the canvas's real backing (`canvas.width / clientWidth`), because headless Chrome reports a 1x device-pixel box under an emulated @3x. Finally, the release www served at `/rel/` runs with none of the six globals and no page errors.

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
- [ ] `npm ci && npm run green` exits 0 with **at least 1014 tests passing** (main's count at Base + 7, once P1-8 is on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on the stack, P1-8 r5 over `6df67ab9`: 1014/0.)
- [ ] If P1-8 is not on main, or if P1-8's APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 400 changed lines in total (353 in the proto). Hard cap 400.
- [ ] Both shipped test files are byte-identical to the kit copies. Earlier play-stage tests stay green. The 5 root pins do not move.
- [ ] **Kit-run browser smoke (REQUIRED)** exits 0 with `SMOKE PASS` at 390×844 and 360 wide (www has no network URL, play-only, release www has no debug path, map row 0 whole and tappable with the banner up and dismissed, release www runs without globals, stage looks load and torches draw, no page errors, no sideways scroll, visible buttons ≥ 44×44, no external request).
- [ ] Never touch `painter-proto/` or `ui-shell/`. Game rules stay out of `src/core` and `src/sim`. BTF is used only via adapters or rewrites with file:line cites (listed above). Do not install Capacitor, the Android SDK, or Gradle, and do not build or sign an APK in this step.

## Floor
`npm run green` is at least **1014** tests passing (main's count at Base + 7, once P1-8 is on that main: 998 + 9 + 7). If main's count at Base (with P1-8 already merged) is C, the floor is C + 7.

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
- `npm ci && npm run green` exits 0 with **at least 1014 tests passing** and 0 failing (main's count at Base + 7). Paste the summary line and all kit-run browser smoke lines into HANDBACK.md.
- Both shipped test files are **byte-identical** to the kit copies.
- The branch starts at the Base (P1-8 already on main). ≤ 400 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-9-apk-wrapper-r<N>-chatA` (base = current main when you start; P1-8 must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-9-apk-wrapper-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
