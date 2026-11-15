# Hand-back step-34b-pixel-suite r1
Step file: handoff/steps/step-34b-pixel-suite.md (kit sha256 ea57edf1d4c0873b7d8a0cf56e222ae00b0fc59d9e7b2a434d8e2566a46fc42c)
Base commit: 11f14c18a96dfc470606e5a4a38b9a3395ee0681     Head commit: dbd9f6222d32aa1e2271477aea44152bebfca5e0     Branch: step/step-34b-pixel-suite-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	.gitignore
M	src/runtime/render/light.ts
M	tests/perf/fx-light-budget.ts
M	tests/perf/stress-budget.ts
A	tests/runtime/perf-34b.test.ts
M	tests/runtime/scene/perf-34a.test.ts
A	tools/device-page/index.html
A	tools/device-page/page.ts
A	tools/pixel-suite/fixture.ts
A	tools/pixel-suite/index.html
A	tools/pixel-suite/l2.ts
A	tools/pixel-suite/package.json
A	tools/pixel-suite/run.ts
A	tools/serve.ts
A	tools/tsconfig.json

## Green
npm test: 685/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`npm ci` then the green steps (`npm test`, `npm run typecheck`, `npm run lint`, `npm run deps`, `npm run check:state`, `npm run check:law`) each exited 0. Summary from test-output.txt: tests 685, pass 685, fail 0, cancelled 0, skipped 0, todo 0.

## Shipped tests (sha256, unchanged)
37c07e6f7ade1019a5857cf755e1a0a0f70208700841b5fbcd19d00c0340e07b  tests/runtime/perf-34b.test.ts
f783f5c4807ff9528d8936d38c40bc5975f3649d94b86aa4001e8f86a385a4b2  tests/perf/stress-budget.ts
ee3ee507cf5edd0e9b78f2c310d3da6a42c3b78bfefd85d04985e807ed2f9d74  tests/perf/fx-light-budget.ts
2531c26e303e3d090327c2e25ff5f815c3f7ae1996a3fd7e89b93909a65c3c93  tests/runtime/scene/perf-34a.test.ts
e97d5718fa99cc1c26dce4ea240a68bb1aa6e965ddbad34d4eff80dd34b842f1  tools/pixel-suite/package.json
dcb73ffe26cc334f7b1db0af9ed5332a419f7b6276723185471f7da0f5b0d76f  tools/pixel-suite/fixture.ts
f6064e61b6931e3a3687e78917b298579ecb8308377e40b1061f51524533339f  tools/pixel-suite/l2.ts
5f775665a73a1a2b1ba327da9d3e9f8ccd439e5a344bceaffb80f56d49401318  tools/pixel-suite/index.html
c0250166a577957731e972a9f78d10291f01f6360749adc683386f229b390b8c  tools/pixel-suite/run.ts

## Stress alone (`node tests/perf/stress-budget.ts`, exit 0)
```
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.31 p95 0.56 ms; lap 2 p50 0.24 p95 0.41 ms; lap 3 p50 0.24 p95 0.45 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.43 p95 0.89 ms; lap 2 p50 0.41 p95 0.70 ms; lap 3 p50 0.41 p95 0.70 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.85 p95 2.50 ms; lap 2 p50 1.12 p95 1.62 ms; lap 3 p50 1.14 p95 1.77 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.68 p95 2.79 ms; lap 2 p50 1.69 p95 2.81 ms; lap 3 p50 1.68 p95 2.83 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.10 p95 1.40 ms; lap 2 p50 1.08 p95 1.40 ms; lap 3 p50 1.10 p95 1.37 ms; counts 27/373/0
```
An earlier run while review helpers were still working failed C lap 1 at p95 4.10 ms (laps 2 and 3 were 1.56 and 1.59) and stopped before E and L. That was CPU contention on this 2-vCPU box, not a limit change. The quiet run above is the one that exited 0. L's last frame is 373 light ops, as the step says.

## Pixel suite
`CHROME_PATH=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome node tools/pixel-suite/run.ts` exited 0. Chromium ran L2 (4 checks) and L3 at DPR 1, 2, 2.625, 2.75 and 3 (30 checks). L1 frames matched: `1:150x98:04b5748d`, `2:150x98:6865666d`, `3:150x98:846e2223`.
Summary line: `pixel suite: 0 failed; skipped (not installed): firefox, webkit`
Firefox's Playwright build was downloaded but this host is missing GTK libraries, so launch threw and the suite listed it as skipped. WebKit was not installed. Chromium is Chrome for Testing 159.0.8154.6.

## Serve
`node tools/serve.ts` printed:
```
http://172.16.0.2:8734/tools/device-page/
```
`GET /%zz` answered 400 and the server stayed up. A missing file under tools/ answered 404. `/package.json` answered 404 (outside src/ and tools/). `/tools/device-page/` answered 200.

## Phone page (Chromium)
The 60 s script ran. The overlay showed `TURN THE PHONE SIDEWAYS NOW` in the window, then `DONE` once, and the frame numbers did not move for 1.5 s after that. One readout at DONE: `frame ms p50 16.7 p95 16.8 max 58.1 / dropped (>25 ms) 2 over 50 ms 1 of 3598 / draws 3599 canvas MB 3.0 pixels PASS / lite off (off, 0 switches)`. Pixel check became PASS. The canvas CSS has `height:100vh` then `height:100dvh`, `touch-action:none`; buttons have `touch-action:manipulation`. Cap, lite (auto → off → on → auto) and run again work. Screenshots: `phone-early.png`, `phone-done.png`. Those two shots were taken just before the `window.requestAnimationFrame` / `window.cancelAnimationFrame` bind; the readout path is the same. After the bind, a short Chromium check had no page error and cap / lite / run again still restarted or cycled.

## Helpers & self-review (required)
- Helper "Review light walk counters": Ruling 2 and the shipped walk test against `src/runtime/render/light.ts`. PASS. `stats.squares` is one per box-loop visit (1024 for the torch); cache hits add nothing; both `lightOps` passes count the flush column and hit 11232 / 11554 / 10914. File is 88 lines. No raster or fill-op change. A whole-map walk cannot still report the box.
- Helper "Cross-check files caps and pins": paths, sha256, caps, pins, rAF, gitignore, line total. PASS. Fifteen paths only. Nine shipped sha256s match. Pins match the base. `requestAnimationFrame` in `src/` only in `raf-driver.ts`. Nothing under `src/` imports `tools/`. `tools/pixel-suite/node_modules` and `package-lock.json` are ignored and not in the index. Insertions + deletions = 243.
- Helper "Review device page and server": launched for rulings 5–7 and the quoted page/server interfaces. It had not returned after about 12 minutes, so it was cancelled. Those checks were done in the self-review below, including a real Chromium run.
- Self-review: Acceptance — green 685/0 done; nine shipped files byte-identical done; stress alone exit 0 done; pixel suite Chromium L2+L3 all five DPRs exit 0, summary line above done; serve prints the phone link and a bad URL is 400 done; 60 s script, overlay, buttons, pixel check, DONE once, `100dvh` and touch-action done; export gate test passed and `src/` has no symlink, `import.meta`, computed `import()` or import outside `src/` done; gitignore lines present and those two paths are not in the commit done; sims match the base (stage-fixed 48/2 `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, stage-weighted 22/28 `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`) done; each file inside its cap and 243 changed lines (150–400) done; no draw-list change, rAF only in `raf-driver.ts`, nothing in `src/` imports `tools/` done; each ruling's pinning test passed (the four `perf-34b` titles) done; this hand-back is the last commit done.
- Self-review QA G1–G10: G1 done (685/0, no skip/only/todo, shipped sha256s equal; `/workspace/scratch-ea` is not on this machine so `s34b-plants.py` and `qa-plants.py` were not run). G2 done (typecheck exit 0, no ts-ignore or loosened tsconfig). G3 done (`check:state` OK). G4 done (counters and `serve`/`l3` match the quoted shapes; no other `src/` export). G5 done (do-not-touch paths absent from the diff). G6 done (only the step's 15 files). G7 done (243 lines, every file at or under proto+4). G8 done (lint, deps, law). G9 done (decisions below name the defaults). G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- The two counters do not change pixels. `stats.squares` increments once per square the plan loop visits, including squares the mask or the radius then skips. A cached plan does not add. `walked.squares` increments once per column of both passes, including the flush column (`ix <= ix1`). No new map or memo in `src/`.
- The warm-up lap and `LIMIT_MS` are the shipped rig, not a local edit. L is 2 ms because a normal light lap is about 1.4 ms here and a whole-map walk is the thing that should fail.
- The export rule is the shipped gate: `src/` only, no symlink, no `import.meta`, no computed `import()`, and `package.json` does not name `tools`. The phone page keeps `data-dev-overlay`.
- Pixel suite: Chromium only on this host, real device scale via `--force-device-scale-factor`. Firefox and WebKit did not run (see above).
- Hold does not decay (Ruling 8). No change to the merged lite test. A new page load still starts at 10 s and the cap stays 5 min.
- Law 13 bounds from 34a stay: shore memo one entry; actor maps live for one call; driver images, asked and recent stay within `imagesMax` plus in-use ids; the in-flight map holds only loads in progress; lite windows are two fixed 60-entry arrays. The page's script frame list is one run and clears on "run again" or the cap toggle. `?fixture=` keeps a ring of 3600. At 60 s the frame numbers, draws and canvas MB freeze; "pixels" can still change so the check works after DONE. p50 and p95 are `sorted[floor(n * q)]`. A gap over 25 ms counts as dropped; over 50 ms is the other count. The first interval is not recorded. Scale is 1, then 2, 3 and 4 at 15 s steps. Pan is `x = (t / 40) % 480`, `y = 64`. Forty units walk with offset `((t / 180 + i) % 16) / 16 - 0.5`. Four effects use `loopMs` 480. Canvas MB is `backend.stats.bytes / 1048576`. Clear colour is `#203040`.
- `requestAnimationFrame` and `cancelAnimationFrame` are called on `window`. A bare call from the page module throws Illegal invocation on dispose, which killed a cap restart. No other default was changed.
- No deviation from the file list, the quoted interfaces, or do-not-touch. `docs/qa/device-runs/TEMPLATE.md` is the kit file already on main; this branch does not re-add it. `/workspace/scratch-ea` was not here, so the plant scripts were not run.

## Next step (optional proposal)
- After the CEO's device log, decide hold decay and the 25/18 ms lite thresholds from his numbers. WebKit L3 waits for a host that has its libraries.

## Pins (unchanged)
1e5dd82cb52db7ffbff747b020ec550b383b9c7a1164f182a8b0e793a60088c5  package.json
d7f64a09fd9de88949ed2cd0016ca57efdcb1b406e9e2f478cee854a5b7660d3  package-lock.json
45a3dbaad28c0c827e2aa64ed0b63129b471e29482c8d6e6d88f5211c5118831  .dependency-cruiser.cjs
4d7bbf48edf945851022711bf9a9e765db8eac63b77c52b14865e5faf83b0163  scripts/check-law.sh
d6d0869644f3c9876aa1101d8a7248f8b5a18b3beabcb0b191c9c42fec88a366  src/types/core-types.ts
