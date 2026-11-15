# step-34b-pixel-suite: QA's L2/L3 picture checks, the phone test page and the device log (renderer plan slice 34, part 34b; no CN; seams 36 and 37 updated)

Step id: step-34b-pixel-suite          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`11f14c18`** (`11f14c18a96dfc470606e5a4a38b9a3395ee0681`, main after PR #47, the step 34a merge: chatA r1 plus QA's A/B fix `0a102aa`; tree `7052bd00`; verified 681/0, pins unchanged). Branch: `step/step-34b-pixel-suite-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-34b-pixel-suite-r<N>.bundle 11f14c18..step/step-34b-pixel-suite-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-34b-pixel-suite/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: step 34a, merged `11f14c18` (`light.ts` `createLighting().plan` / `lightOps` bounded to the boxes and the view; `raf-driver.ts` `capFps`, `lite(mode)`, `stats.lite`, the device-pixel-content-box size; `tests/perf/stress-budget.ts`; `tests/runtime/scene/perf-34a.test.ts`). No format change, no CN, no import line moves.
Read first: BUILD_GUIDE.md §0 (helper rule), §3 (layout), §6 (green), §7, law 13; `docs/qa/renderer-test-research.md` (L1–L3, R2.2 budgets, R2.4 device protocol, the PX plants); `/workspace/scratch-ea/s34-scope-proposal.md` (`64cdc230…`, the 34b rows b1–b3); `/workspace/scratch-ea/integration-seams.md` (`ec59b6c0…`) seams 36–37; QA's r1 review `docs/qa/step-34b-review.md` (`d326dd85…`).

Kit: kit-1 r2 (guide-3), 2026-11-15. Engine Architect. r2 folds in QA's r1 review (`docs/qa/step-34b-review.md` `d326dd85`, NOT OK on tests and the phone page; `src` fine) and the user's r2 rulings (2026-11-15 04:01): QA's qfix `7592e356` (G-TileEngine noreply; tree `a1023ade`, on r1 `23661ac8`) is adopted as is (exact walk bounds, one warm-up lap exactly, tile width and height one at a time, the export gate on TypeScript's own import scan plus no symlinks / `import.meta` / computed `import()`, DONE at 60 s, `100dvh`, `touch-action`, a 400 for a malformed URL); EA r2 on top adds the printed phone link(s), the fixture-mode frame ring and the `.gitignore` lines. Prototyped on Node 24 with Chrome 156 (`/usr/bin/google-chrome`) and Playwright's Firefox: branch `r34b` on `11f14c18`: r1 `23661ac8`, QA's qfix `7592e356`, then **proto r2 `52c209219de6229b58465fcfe5f83a58d015f7bf`** (tree `0ff8292d`). `npm ci && npm run green` exits 0 with `tests 685 pass 685 fail 0` (681 + 4); `tsc` 0; lint (also over `tools/`), deps (106 modules, 0 violations), check:state and check:law pass; `npx tsc -p tools/tsconfig.json` 0 with the pixel suite's `npm i`. Sims unchanged (stage-fixed 48/2, stage-weighted 22/28); the 21 smoke lines match the Base (the heap line is report-only). Every draw list is byte-equal to the Base: `/workspace/scratch-ea/s34a-equal.ts` gives the same output on both (`lightraster dca58548…`, stress A–L hashes equal). The pixel suite passes: 44 ok (Chromium L2 + L3 at DPR 1/2/2.625/2.75/3, Firefox L2 + L3 at DPR 1); WebKit skipped (host libraries missing on the box). Plants: `/workspace/scratch-ea/s34b-plants.py` **17/17 green plants caught; 2/4 new tests fail on the Base** (the other two pin the harness and the pixel fixture, which equal the Base by design), and **7/7 pixel-suite plants caught**; QA's `qa-plants.py` (`qa-runs/step-34b-review/probes/`) **25/25 in scope (26 plants; B5 is outside green by Ruling 3)**. Bundle copy `/workspace/scratch-ea/kit-backup-r34b/r34b.bundle` (`11f14c18..r34b`, verified, sha256 `0babd14d…`); kit sha list `/workspace/scratch-ea/kit-backup-r34b/r2-kit-sha256.txt`.
Carries folded in: R-d / R-a (seam 36, walk counters), N8 (stress warm-up lap), the tighter L budget (R-a), R-b (hold decay, decided below), QA nit S3 (shore size), QA's "no other new map" nit (Decisions note), N9 (seams file). `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), the lock (`d7f64a09…`) and `src/types/core-types.ts` (`d6d08696…`) unchanged.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
After this step QA's picture checks run in real browsers, the CEO can measure the engine on his own phones, and nothing of that ships. A pixel suite in its own folder (`tools/pixel-suite/`, its own `package.json`, outside green) draws three fixed frames with the real Canvas2D in Chromium, Firefox and WebKit (WebKit where its host libraries are installed) and compares them with the recording canvas (L2), and opens the phone test page at DPR 1, 2, 2.625, 2.75 and 3 to check the backing store, `image-rendering: pixelated`, CSS scaling and the letterbox colour (L3). A phone test page (`tools/device-page/`, served by `node tools/serve.ts`, which prints the link to open on the phone) runs a fixed 60 s script on the real driver and shows frame-time p50/p95/max, dropped frames, draws, canvas MB, lite state and switches, a 60 fps cap toggle, a lite auto/on/off toggle and a pixel check. A green test proves nothing under `src/` reaches `tools/`, the overlay marker or the tests. The light walks get counters so a whole-map walk fails a shipped test, the stress script warms up before it judges and gives light alone a 2 ms budget, and a device-log template lets the CEO write down what he saw in plain words.

## Rulings
All rulings are EA (this kit) on the user's 34b brief (2026-11-15 02:28 London) and the CEO's answers (2026-11-14 23:24, via CoS: he runs the page on his own phone and a mid-range Android; lite turns on by itself on slow phones and the player can turn it off; uncapped by default with a 60 fps setting) unless a source is named. Every one is pinned.
1. **Pixel-identical** (user brief): every draw list, light op and light raster is byte-equal to the Base for the same inputs. The only `src` change is two counters. Pinned by: "pixel fixture: the recording canvas draws the L1 frames the browsers must match (QA L1/L2, step 34b)" (the three fixture frames' hashes) and the 34a stress-rig hash test, unchanged.
2. **Walk counters** (R-d / R-a, seam 36; bounds from QA's qfix, user ruling 2026-11-15 04:01): `createLighting().stats.squares` counts every square a light's box visits in `plan`; `lightOps(plan, fit, cam, glow?, walked?)` adds 1 to `walked.squares` per square visited, both passes. At 128² res 4, 390×844 at s 2, one 64 px torch at (300, 400): the plan visits **exactly** the light's box, (⌈364/res⌉ − ⌊236/res⌋) · (⌈464/res⌉ − ⌊336/res⌋) = **1024** squares. At each of three cameras (the map's top-left, middle (700, 900) and bottom-right) both op passes together visit at least **2 · ⌈artW/res⌉ · ⌈artH/res⌉ = 10388** squares (the view, twice) and at most that camera's floor−1 .. ceil+1 extent, clamped to the plan, plus the flush column, twice: **11232 / 11554 / 10914**, which the proto hits exactly. The whole map is 2 · 262144 = 524288. So a wider margin on either side, a counter bumped per row, per light or in one pass only, and a whole-map walk all fail. Pinned by: "light walk: the plan visits only each light's box and both op passes only the view's squares plus one margin, at the map's corners and middle, never the whole map (step 34b)".
3. **Stress warm-up and budgets** (N8; R-a): `runStress(name, o, now?, lapMs?)` runs one warm-up lap that is never judged, then `PERF.laps` judged laps; `LIMIT_MS` gives L (light alone) **2 ms** p95, every other scene keeps `PERF.limitMs` (4 ms); `judge(laps, limitMs = PERF.limitMs)`. The script stays out of `npm test`. Pinned by: "stress: one warm-up lap is never judged, light alone must hold 2 ms p95 and the rest 4 ms (step 34b)" (a fake clock: a 50 ms warm-up lap still passes A; a 50 ms warm-up and a 50 ms first judged lap fail A, so the warm-up is exactly one lap; 3 ms light frames fail L).
4. **Shore size** (QA nit S3; QA's qfix): the 34a shore test also changes `tileW` alone and then `tileH` alone (8, same tiles array) and asserts the foam is rebuilt each time, so its title is true; the title is unchanged. Pinned by: "shore: the water grid and foam are kept while tiles, water ids, style and size stay; a dig, a new style or a size change rebuilds (step 34a)".
5. **Export gate** (b2; QA R2.4 "export audit link", PX16; user ruling 2026-11-15 04:01): every file under `src/`, whatever its extension, is scanned with TypeScript's own import scan (`ts.preProcessFile`: static, side-effect, re-export, type-only, template-literal and commented `import()` specifiers), and none may resolve outside `src/`. `src/` may not contain a symlink, `import.meta`, a computed `import()` (anything but one plain string literal) or the `data-dev-overlay` marker; a future lazy load must use a literal specifier. `package.json` has no `main`, `exports`, `files`, `bin`, `module` or `browser` naming `tools`; the phone page keeps its marker. An export is built from `src/` only, so this keeps `tools/` out of every export. Pinned by: "export gate: nothing under src reaches tools/ (phone page, pixel suite, dev server), the dev overlay or tests, and package.json exposes no tools (step 34b)".
6. **Pixel suite outside green** (b1; ruling R5-1): `tools/pixel-suite/` has its own `package.json` (`playwright-core` 1.65.1, exact); the root `package.json` and lock do not change; green never needs a browser. `node tools/pixel-suite/run.ts` (after `npm i` in that folder) runs L2 and L3 and exits non-zero on any failure, printing one `ok`/`FAIL` line per check and a summary naming skipped browsers. Chromium comes from `CHROME_PATH` (default `/usr/bin/google-chrome`); Firefox and WebKit from Playwright's own builds when installed. L3 sets the real device scale with Chromium's `--force-device-scale-factor` (Playwright's emulated `deviceScaleFactor` does not reach `devicePixelContentBoxSize`, so a correct page would fail); Firefox and WebKit run L3 at DPR 1 only. Shipped verbatim; QA runs it on renderer PRs and before a release.
7. **Phone test page never ships** (b2; CEO 23:24; QA r1 M5, user ruling 2026-11-15 04:01): `tools/device-page/` uses the real `createDriver` on `window`; the overlay element carries `data-dev-overlay`; the page reads `performance.now()` (allowed: outside `src/`). The 60 s script shows "TURN THE PHONE SIDEWAYS NOW" from 38 to 45 s and, once 60 s have passed, the final readout with **DONE** (shown once; the numbers stop at 60 s). The canvas is `width:100vw; height:100vh; height:100dvh` (the dynamic viewport, so a mobile toolbar never hides the bottom), `touch-action:none`, and the buttons `touch-action:manipulation` (no double-tap zoom). Uncapped by default; the cap button recreates the driver with `capFps: 60`; the lite button cycles `driver.lite("auto" | "off" | "on")`; "run again" restarts with the same settings. `?fixture=<s>` draws the pixel fixture instead (L3 reads it); there the frame list is a ring of the last 3600 frames. Served only by `node tools/serve.ts [port]` (default 8734, all interfaces, read-only, `src/` and `tools/` only, `.ts` type-stripped, a malformed URL answers 400). Run directly, it prints one full phone link per IPv4, non-internal address of this computer (`os.networkInterfaces()`), as `http://<address>:<port>/tools/device-page/`, so the CEO copies the printed link and never looks up an address; with none it says to join the Wi-Fi. Pinned by the Ruling 5 test (marker), the pixel suite's L3 checks and Acceptance (by hand).
8. **Hold decay: keep, no decay** (R-b, EA decision for the user): the lite hold keeps doubling to 5 min and never shrinks within a session. Why: a decaying hold lets a borderline phone flap (on, off, on) every few seconds, which looks worse than staying in lite; at the 5 min cap a still-slow phone gets at most one ~4.8 s slow retry every 5+ min; a new session (page load) starts again at 10 s. The device log asks the CEO whether lite stayed on too long; if it did, decay comes back as a carry with his numbers. No code change; the 34a lite test stays as merged.
9. **Device log** (b3): `docs/qa/device-runs/TEMPLATE.md` (kit file, plain words, with QA's [E] budgets from R2.2 as "what good looks like"); one copy per phone and run.

## Files to create or change
- change `src/runtime/render/light.ts` (≤ 92; Ruling 2: two counters, no other change)
- change `tests/perf/stress-budget.ts` (≤ 53; shipped as the full file, verbatim; Ruling 3)
- change `tests/perf/fx-light-budget.ts` (≤ 38; shipped as the full file, verbatim; `judge`'s limit)
- change `tests/runtime/scene/perf-34a.test.ts` (≤ 69; shipped as the full file, verbatim; Ruling 4)
- create `tests/runtime/perf-34b.test.ts` (≤ 50; shipped, verbatim)
- create `tools/pixel-suite/package.json` (≤ 12), `fixture.ts` (≤ 21), `l2.ts` (≤ 17), `index.html` (≤ 5), `run.ts` (≤ 49) (all shipped, verbatim)
- create `tools/device-page/index.html` (≤ 9) and `tools/device-page/page.ts` (≤ 46) (Ruling 7; interface below)
- create `tools/serve.ts` (≤ 24) and `tools/tsconfig.json` (≤ 9: extends the root, adds the `DOM` lib, includes `**/*.ts`; the root tsconfig is unchanged)
- change `.gitignore` (≤ 11): append exactly the two lines `tools/pixel-suite/node_modules` and `tools/pixel-suite/package-lock.json` (no trailing slash, so a symlinked `node_modules` is ignored too)

Size (G7: insertions + deletions): the proto changes **235** lines (+223/−12) in 15 files: product `src` 9 (+5/−4) in 1 file; the phone page, server, tools tsconfig and `.gitignore` 74 in 5 files (written by you); shipped tests, rig and pixel suite 152 in 9 files. Inside the normal band (≤ 400). Each file's cap is its r2 proto count + 4.

| File | Base → proto / cap | Changes |
|---|---|---|
| `src/runtime/render/light.ts` | 87 → 88/92 | +5/−4 |
| `tests/perf/stress-budget.ts` | 44 → 49/53 | +10/−5 |
| `tests/perf/fx-light-budget.ts` | 34 → 34/38 | +2/−2 |
| `tests/runtime/scene/perf-34a.test.ts` | 64 → 65/69 | +2/−1 |
| `tests/runtime/perf-34b.test.ts` | 0 → 46/50 | +46 |
| `tools/pixel-suite/package.json` | 0 → 8/12 | +8 |
| `tools/pixel-suite/fixture.ts` | 0 → 17/21 | +17 |
| `tools/pixel-suite/l2.ts` | 0 → 13/17 | +13 |
| `tools/pixel-suite/index.html` | 0 → 1/5 | +1 |
| `tools/pixel-suite/run.ts` | 0 → 45/49 | +45 |
| `tools/device-page/index.html` | 0 → 5/9 | +5 |
| `tools/device-page/page.ts` | 0 → 42/46 | +42 |
| `tools/serve.ts` | 0 → 20/24 | +20 |
| `tools/tsconfig.json` | 0 → 5/9 | +5 |
| `.gitignore` | 5 → 7/11 | +2 |

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// render/light.ts
export function createLighting(): { plan(world: LightWorld, lights: readonly Light[], wash: number, dim: number, res: number, fx?: FxLit, allDark?: boolean): LightPlan; readonly stats: { plans: number; squares: number; masks: { computed: number } } } { // squares (s34b R-d): squares the light boxes visit, for the bound test
export function lightOps(plan: LightPlan, fit: Fit, cam: Cam, glow = "255,176,72", walked?: { squares: number }): FillOp[] { // walked (s34b R-d): squares the walk visits, for the bound test

// tools/serve.ts
export function serve(port: number): Promise<{ url: string; server: Server }> { … }

// tools/device-page/page.ts: element ids view, read, cap, lite, again, pixels; the overlay <div id="dev" data-dev-overlay>; ?fixture=<s>; and on window:
Object.assign(window, { l3: () => ({ backingW: canvas.width, backingH: canvas.height, cssW: canvas.clientWidth, cssH: canvas.clientHeight, dpr: devicePixelRatio, rendering: getComputedStyle(canvas).imageRendering, transform: getComputedStyle(canvas).transform, draws: driver?.stats.draws ?? 0 }), overlay: show });
// tools/device-page/index.html: the canvas fills the viewport (display:block; width:100vw; height:100vh; height:100dvh), image-rendering:pixelated, touch-action:none; buttons touch-action:manipulation; background = the clear colour #203040
// tools/serve.ts run directly: prints `http://<IPv4 non-internal address>:<port>/tools/device-page/` once per address (os.networkInterfaces())

// tests/perf/stress-budget.ts (test file; additions)
export const LIMIT_MS: Readonly<Record<string, number>> = { L: 2 }; // s34b: light alone (merged p95 ~1.3-1.6 ms); the rest PERF.limitMs
export function runStress(name: string, o: Stress, now = (): number => performance.now(), lapMs: number = PERF.lapMs): { got: ReturnType<typeof judge>; rig: ReturnType<typeof stressRig>; limit: number } { … }
// tests/perf/fx-light-budget.ts
export const judge = (laps: readonly (readonly number[])[], limitMs: number = PERF.limitMs): { stats: number[][]; p95: number[]; ok: boolean } => { … };
// tools/pixel-suite/fixture.ts: RASTERS, SCENE, VIEW, L1, CAMS, fnv, frames(canvas, makeCanvas, images, read); l2.ts: l2()
```
No other export is added or changed. New in `src/`: only `stats.squares` and the optional `walked` parameter.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) identical; the 21 smoke lines match the Base (the heap line is report-only).

## Existing tests changed by ruling (and only these)
- `tests/perf/stress-budget.ts`: `LIMIT_MS` and `runStress` added; the script's main block calls `runStress` (warm-up lap, scene budget); the rig is unchanged.
- `tests/perf/fx-light-budget.ts`: `judge` takes an optional limit (default `PERF.limitMs`); its own script is unchanged.
- `tests/runtime/scene/perf-34a.test.ts`: the shore test gains one tile-size line (Ruling 4).

## Tests that prove it is done
Shipped files (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-34b-pixel-suite/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/perf-34b.test.ts` | `tests/runtime/perf-34b.test.ts` | `37c07e6f7ade1019a5857cf755e1a0a0f70208700841b5fbcd19d00c0340e07b` |
| `tests/perf/stress-budget.ts` (full file) | `tests/perf/stress-budget.ts` | `f783f5c4807ff9528d8936d38c40bc5975f3649d94b86aa4001e8f86a385a4b2` |
| `tests/perf/fx-light-budget.ts` (full file) | `tests/perf/fx-light-budget.ts` | `ee3ee507cf5edd0e9b78f2c310d3da6a42c3b78bfefd85d04985e807ed2f9d74` |
| `tests/runtime/scene/perf-34a.test.ts` (full file) | `tests/runtime/scene/perf-34a.test.ts` | `2531c26e303e3d090327c2e25ff5f815c3f7ae1996a3fd7e89b93909a65c3c93` |
| `tools/pixel-suite/package.json` | `tools/pixel-suite/package.json` | `e97d5718fa99cc1c26dce4ea240a68bb1aa6e965ddbad34d4eff80dd34b842f1` |
| `tools/pixel-suite/fixture.ts` | `tools/pixel-suite/fixture.ts` | `dcb73ffe26cc334f7b1db0af9ed5332a419f7b6276723185471f7da0f5b0d76f` |
| `tools/pixel-suite/l2.ts` | `tools/pixel-suite/l2.ts` | `f6064e61b6931e3a3687e78917b298579ecb8308377e40b1061f51524533339f` |
| `tools/pixel-suite/index.html` | `tools/pixel-suite/index.html` | `5f775665a73a1a2b1ba327da9d3e9f8ccd439e5a344bceaffb80f56d49401318` |
| `tools/pixel-suite/run.ts` | `tools/pixel-suite/run.ts` | `c0250166a577957731e972a9f78d10291f01f6360749adc683386f229b390b8c` |

Titles (exact), `perf-34b.test.ts`:
- "light walk: the plan visits only each light's box and both op passes only the view's squares plus one margin, at the map's corners and middle, never the whole map (step 34b)"
- "stress: one warm-up lap is never judged, light alone must hold 2 ms p95 and the rest 4 ms (step 34b)"
- "pixel fixture: the recording canvas draws the L1 frames the browsers must match (QA L1/L2, step 34b)"
- "export gate: nothing under src reaches tools/ (phone page, pixel suite, dev server), the dev overlay or tests, and package.json exposes no tools (step 34b)"
The 34a titles are unchanged; `perf-34b` and `perf-34a` carry QA's qfix (r2). (You may add tests. The hand-back lists all nine shipped files' sha256, unchanged.)

Pixel suite (`cd tools/pixel-suite && npm i && cd ../.. && node tools/pixel-suite/run.ts`), proto output (`kit-backup-r34b/pixel-suite-r2.txt`): 44 `ok` lines (Chromium 4 L2 + 30 L3, Firefox 4 L2 + 6 L3), `pixel suite: 0 failed; skipped (not installed): webkit; L3 at DPR 1 only: firefox`. L1 frames `1:150x98:04b5748d`, `2:150x98:6865666d`, `3:150x98:846e2223` in Chromium and Firefox. Paste your run's summary line into HANDBACK.md and name the browsers it ran.

Timings (`node tests/perf/stress-budget.ts`, run alone, p95 per lap in ms; Base (no warm-up) → proto (warm-up, then judged)): see the "Timings" line under Example. Counts unchanged (A 27, B 113, C 181, E 181 draws; L 373 light ops on the last frame, which is now one lap later than the Base's 381).

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/s34b-plants.py <clone> <base clone> [--no-pixels]` (result `kit-backup-r34b/s34b-plants-r2-result.txt`) matches **full test titles**:
- W1–W6 walks: the whole-plan op walk (34a's L5), every column walked with the same ops, every glow row walked, the op counter dead, the plan walking the whole map instead of the box with the same output (QA's R-a P1), the plan counter dead.
- B1–B4 stress: the L budget back to 4 ms, no warm-up, the warm-up judged in lap 1, `judge` ignoring the scene's budget.
- S3 the shore memo ignoring tile size.
- E1–E5 export gate: a type-only import of the pixel suite into `src`, the overlay marker in `src`, `package.json` `files` with `tools`, a test helper imported into `src`, a dynamic import of the phone page.
- X1 the letterbox painted black.
Expected: **17/17 caught; 2/4 new tests fail on the Base** (walk bound, export gate); the stress-harness and fixture tests pass on the Base by design (harness-only; drawing equal), and so does the 34a shore test (the Base's memo already keys size). The R-a plant W5 also fails the stress script alone (L p95 ≈ 3.2 ms > 2 ms).
Pixel-suite plants (part 3, named as in QA's PX list): PX1 smoothing on, PX5 backing store = CSS size, PX5b CSS × rounded DPR (device-pixel-content-box ignored; caught at 2.625 and 2.75 only), PX6 `pixelated` removed, PX15 letterbox not the clear colour, PX17 a display-p3 context, PXc a CSS transform on the canvas. Expected **7/7 caught**. PX16 (the overlay imported into the render path) is E1/E5 in green.

QA's set: `qa-plants.py <clone>` (from `qa-runs/step-34b-review/probes/`) runs 26 plants, each against the full suite plus tsc, lint, deps and law: W1–W7 (one-sided and two-sided margins, the plan box +1, per-row / per-light / one-pass counters hiding whole walks, a running total), B1–B5 (two warm-up laps, half a lap, warm frames in the last lap, clipped frames; B5, the script losing the scene name, is outside green by Ruling 3 and not counted), S1–S2 (tile width only, tile height only), E1–E6 and X1–X6 (side-effect, template, commented and computed imports, symlinks, re-exports, a test file under `src`). Expected with r2: **25/25 in scope (26 plants; B5 is outside green by Ruling 3)**.

## Example
The CEO runs `node tools/serve.ts` on his laptop, opens `http://<laptop Wi-Fi address>:8734/tools/device-page/` on his iPhone and on a Helio G99 Android, and lets the 60 s script run (pan, s 1→4, 40 walking units, 4 looping effects; "TURN THE PHONE SIDEWAYS NOW" at 38 s). The overlay reads, for example, "frame ms p50 16.7 p95 17.0 max 21.3 / dropped (>25 ms) 2 over 50 ms 0 of 3590 / draws 3589 canvas MB 22.0 pixels PASS / lite off (auto, 0 switches)". He taps "60 fps cap", runs again, and fills `docs/qa/device-runs/2026-11-16-iphone.md` from the template. QA runs the pixel suite on the same commit; a build that loses `image-rendering: pixelated` or draws a P3 context fails there, and a build that imports the page into `src` fails green.
Timings (this box, p95 per lap, `kit-backup-r34b/timings-before.txt` / `timings-after.txt`): A 0.59/0.34/0.35 → 0.31/0.43/0.38; B 0.80/0.42/0.43 → 0.44/0.54/0.48; C 2.44/1.46/1.51 → 1.26/1.45/1.93; E 2.30/1.78/1.62 → 1.51/1.53/1.42; **L 1.33/0.99/1.57 → 0.96/1.09/0.99 (budget 2)**. The Base's slow first lap was the missing warm-up.

## Decisions note: what to name
- The two counters and their bounds (Ruling 2), and that they change no output.
- The warm-up lap, `LIMIT_MS` and why L is 2 ms (merged L p95 1.0–1.6 ms; the R-a plant is ≈ 3.2 ms).
- The export rule (an export is `src/` only; the gate's three checks).
- The pixel suite's real-DPR method and its skipped browsers.
- The hold decision (Ruling 8).
- Law 13 bounds (QA nit): no new maps or memos in `src/`. The bounded ones from 34a stay: the shore memo holds one entry; the actor maps live for one call; the driver's images, asked and recent maps ≤ `imagesMax` plus in-use ids, and its in-flight map holds only loads in progress; the lite windows are two fixed 60-entry arrays. The page's frame list lives for one 60 s run and resets on "run again"; in `?fixture=` mode it is a ring of the last 3600 frames (QA N1).

## Do not touch
`locked/`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `tsconfig.json`; `eslint.config.*`; `data/*.md`; `src/types/core-types.ts`; `src/core/**`; `src/fx/**`; every `src` file except `light.ts`; the sim; every existing test file except the three shipped copies; plus BUILD_GUIDE §7's never-edit list. `.gitignore` changes only by the two lines above. Never commit `tools/pixel-suite/node_modules` or `tools/pixel-suite/package-lock.json`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 685 tests passing and none failing, cancelled, skipped or todo.
- [ ] The nine shipped files are byte-identical to the sha256s above; `node tests/perf/stress-budget.ts`, run alone, exits 0 (after the warm-up lap, every lap's p95 ≤ 4 ms for A, B, C, E and ≤ 2 ms for L).
- [ ] `node tools/pixel-suite/run.ts` exits 0 with Chromium at least (L2 and L3 at all five DPRs); the summary line is in HANDBACK.md.
- [ ] `node tools/serve.ts` prints one `http://<address>:<port>/tools/device-page/` link per IPv4, non-internal address (paste its output into HANDBACK.md), and a malformed URL gets a 400 without stopping it.
- [ ] The phone page runs the 60 s script; every overlay field, button and the pixel check work in Chromium; DONE shows once 60 s have passed; the canvas CSS has `height:100dvh` (after `100vh`) and `touch-action:none`, the buttons `touch-action:manipulation` (a screenshot in the hand-back folder is welcome).
- [ ] The export gate holds: no symlink, `import.meta`, computed `import()` or import outside `src/` anywhere under `src/`.
- [ ] `.gitignore` ignores `tools/pixel-suite/node_modules` (a symlink too) and `tools/pixel-suite/package-lock.json`; neither is in the bundle.
- [ ] Sims and every pin unchanged; the smoke lines match the Base (heap delta excepted).
- [ ] Each file within its cap; changed lines (insertions + deletions) in total within 150–400 (the proto is 235).
- [ ] No draw list changes; `requestAnimationFrame` appears in `src/` only in `raf-driver.ts`; nothing in `src/` imports `tools/`.
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location, `handback/step-34b-pixel-suite/r<N>/HANDBACK.md` (Delivery).

## Not in this step (carries, with their target step)
- **After the CEO's device run**: re-tune Ruling 8 of 34a (25 / 18 ms, 2 windows, the hold) and decide hold decay from the log; set budgets from measured numbers (R2.2's [E] rows).
- **Pixel suite, later**: WebKit on a host with its libraries (or QA's Mac); throttled timing and the rAF-pending probe (QA R2.3 / R4 PX11–PX12), shimmer translation tests (R3.1), screenshot run-length at fractional DPR.
- **Seams**: 36 (per-call plan arrays and the one dark.fill; canvas2d's whole-plan repaint) and 37 (effects revision from the game) stay open.
- **The game side**: the settings toggles for lite and the 60 fps cap, built from `driver.lite` and `capFps`.

## Out of scope
Game rules. Format changes. A WebGL path. Changing any draw list. Hosting the phone page anywhere public.

## Kit files to push
All under `/workspace/tileengine`, full sha256 in `/workspace/scratch-ea/kit-backup-r34b/r2-kit-sha256.txt` and `/workspace/share/step34b/push-sha256.txt`:
- `handoff/steps/step-34b-pixel-suite.md` (this file)
- the nine shipped files under `handoff/steps/tests/step-34b-pixel-suite/` (table above)
- `docs/qa/device-runs/TEMPLATE.md`
- `handoff/README.md`, `docs/core-spine-slices.md`

## Open questions
Ruled (user 2026-11-15 04:01; QA concurs): QA's qfix adopted; the exact walk bounds (Ruling 2); `src` may not use `import.meta`, computed `import()` or symlinks (Ruling 5); DONE, `100dvh` and `touch-action` named (Ruling 7); the printed phone link and the TEMPLATE rewrite for the CEO; the fixture ring and the `.gitignore` lines. Concurred by QA, not changed: same-Wi-Fi hosting (no public copy), Chromium plus Firefox for 34b (WebKit later on a host with its libraries), R-b no hold decay (Ruling 8), and the BUILD_GUIDE §3 `tools/` line added by CoS at merge. None open.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 685 passing and 0 failing**. Paste the summary line into HANDBACK.md.
- The nine shipped files are **byte-identical** to the sha256s above; list each in HANDBACK.md, and paste the output of `node tests/perf/stress-budget.ts` run alone and the pixel suite's summary line.
- The bundle is `<Base 11f14c18>..step/step-34b-pixel-suite-r<N>` and passes `git bundle verify`. Each file stays within its cap (proto count + 4), and the total (insertions + deletions) is 150–400 changed lines (the proto is 235). Every pin unchanged.

## Delivery
On branch `step/step-34b-pixel-suite-r<N>` (base `11f14c18`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), run `git bundle create step-34b-pixel-suite-r<N>.bundle 11f14c18..step/step-34b-pixel-suite-r<N>` and then `git bundle verify`. Upload the bundle and a HAND-BACK-step-34b-pixel-suite-r<N>.md to Google Drive (chatB adds `-chatB` to both names, chatB2 adds `-chatB2`, and either chat adds `-2` if a name already exists). On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. The committed HANDBACK (`handback/step-34b-pixel-suite/r<N>/HANDBACK.md`, shape `handoff/HAND-BACK.md`, the branch's last commit) must quote this step file's sha256 in full, and its PR line must read `PR: opened by Chief Of Staff from the bundle`. Don't push and don't commit to main.
