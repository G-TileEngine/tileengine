# Step 06d: phone baseline page (baseline-06c)

r2, 2026-11-22, Engine Architect. Docs only. r2 applies QA `docs/qa/step-06d-guide-review.md` must-fixes 1 (one clock: host-rAF wrapper) and 2 (`home.ts` L54 cite) to r1 (`6cfb83d1`); nothing else changed. One builder run, gates on. **This is a tools step. It has no maker screen and changes no engine, play-stage or maker file.** Asked for by CoS after `/workspace/share/step-06c-baseline/REPORT.md`: no page on main can load the 6c checkpoint project and show a readout, so the phone baseline (roadmap L81; step 6 guide L226) can't be taken yet. Every number below comes from a trial run of this step on `c829fcb7` (see Measured).

Step id: `step-06d-baseline-page`. Revision: r1 for the first run, r2, r3 … for rework rounds.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `c829fcb7e3e1b33f3988a436c7662648d4e55905` (`c829fcb docs(rebuild): step 6c record r2 + QA review and recheck`; 6c merged as PR #92, `be4f47e1`). If CoS names a later main in the go-line, use that and its count.
**Test floor:** **1105 + 3 = 1108** on `c829fcb7` (measured: `npm test` gives 1105 pass, 0 fail on the base). N = 3 (the named tests below); state it in the hand-back.
**Needs:** step 6c merged (done). **Blocks:** the 6c phone baseline, and through it the reach and sight cache decision (step 6 guide L217, L226).
**Own smoke, port:** `handoff/steps/tests/s6d-baseline/smoke.mjs`, **8808**. Ports in use on `c829fcb7`: 8734 (`tools/serve.ts`), 8797 (S0), 8798 (s3), 8799–8801 (s4a–s4c), 8802–8804 (s5a–s5c), 8805–8807 (s6a–s6c). 8808 has no hit in `handoff/`, `tools/`, `tests/` or `docs/maker/steps/`.

## Delivery
Same as step 00b Delivery (`docs/maker/steps/step-00b-sides-from-data.md` L14–26) and `handoff/HAND-BACK.md`, with this step id.
- Branch `step/step-06d-baseline-page-r<N>-chatA` from the base. Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds `handback/step-06d-baseline-page/r<N>/HANDBACK.md` with the sections `handoff/HAND-BACK.md` lists, plus § Green, § Smoke, § Build and § Screenshot. Label the **Code head** (last product commit) apart from the docs-only **tip**.
- Gate: `npm ci && npm run green` exits 0 at the floor above. `npm test` alone is not enough.
- Push once, that branch only, through the one-shot credential helper in `handoff/HAND-BACK.md` (it reads `GH_BUILDER_TOKEN` from the shell). Never print, echo, log, commit or store the token, including in `.git/config`.
- Never push main, a tag or **gh-pages**. No force-push, no branch delete, no PR actions. CoS opens the PR.
- **No publish.** The builder builds `baseline-06c/` only into a temp folder for the smoke and § Build. Publishing it to the gh-pages subpath `baseline-06c/` is CoS's job after merge, **and only with the CEO's OK (CEO SEND, via CoS)**.

## Goal
In plain words: a small web page that opens the exact project the 6c checkpoint dumped (`handback/step-06c-checkpoint/r1/checkpoint.tileproj/`, name Skirmish: 6 × 6 map, Hero and Raider), starts it in the normal play stage, and lays a 34b-style readout over it. The CEO opens it on the S21 Ultra and the Red Magic 9 Pro, plays or waits until it says `DONE` (60 s), and screenshots it. The readout shows frame time p50 / p95 / max, dropped frames, canvas MB, heap peak (or `n/a`), and an honest `GC: n/a` line, because a phone browser can't see garbage collection (REPORT.md L43).

## Read first (lines checked on `c829fcb7`)
1. `/workspace/share/step-06c-baseline/REPORT.md` (CoS, 2026-11-22): what exists, what a phone browser can read, the lean path (L47–57).
2. `docs/maker/roadmap.md` L81 (the checkpoint and its baseline: frame time, allocations and GC on both phones); `docs/maker/steps/step-06-levels-win-rules.md` L217 (no caches until the baseline) and L226 (the baseline is not the builder's gate).
3. Play stage, **read only, no edits**:
   - `tools/play-stage/page.ts`: `startMatch(docs, back?, aim?)` L15, finds `#board` at L16 and throws without it; its rAF env L28; the dev-only globals L75 (stripped in release); the standalone boot L79–80, which runs **only if `#board` exists when the module is evaluated**.
   - `tools/play-stage/project.ts`: `openProject(files, stageId?)` L75–83 (`readProject`, then `playDocsOf`; returns `{docs, error}`); `openBundled()` L84–88; the demo's JSON imports L11–14 and `bundledFiles()` L26–30 (the pattern to copy).
   - `tools/play-stage/build.ts`: `ROOT` L8, `toJs` L16–19 (rewrites `.json` imports to `.json.js` and drops `with { type: "json" }`), `refuse` L20, `release` L22–29 (strips `// dev-only` lines), `build` L30–43 with the JSON inline in `walk` L35.
   - `tools/maker/home.ts` L15 and L54: the maker imports `startMatch` and makes `#board` itself **after** import, so the play-stage boot (L79–80) never fires. This page does the same.
4. The 34b device page, the readout to copy: `tools/device-page/page.ts` `heapOf` L26 (`performance.memory.usedJSHeapSize` peak, else n/a), `show` L28–41 (sorted gaps, `at(q) = s[floor(n·q)]` L29; dropped `> 25` ms and `> 50` ms L30; 60 s run L32; the text L40), `note` L42 (gaps only while `t − t0 < 60 000`); the host-rAF wrap L43 (one clock: `note()` runs in the same callback as the driver tick); `tools/device-page/bold.ts` `canvasMb` L45.
5. The checkpoint folder: 8 files (`project.json`, `catalogue/slice.json`, 1 map, 1 stage, 2 setups, 2 units). `openProject` on it gives `error === ""` and a match with a 6 × 6 grid and `sides.contest === true` (checked in the trial).
6. `tests/project/load/one-parser.test.ts` L5–6 (`ALLOW = []`) and L12–15 (scans `src/project/load` and `tools/play-stage`). It must pass **unedited**.
7. Smoke pattern: `handoff/steps/tests/s0-play-input/touch-smoke.mjs` L1–15 and L24–28 (env vars, static server, phone context 390/360 × 844, dsf 3, `isMobile`, `hasTouch`, console errors and outside requests).
8. Typecheck scope: root `tsconfig.json` L22 includes `src`, `tests`, `tools/host-example` only (no DOM lib), so tests may import only DOM-free files. `tools/tsconfig.json` adds DOM for `tools/**`.

## Rules
1. **A separate entry, not a flag.** New folder `tools/baseline/`. Nothing under `tools/play-stage/`, `tools/maker/`, `tools/device-page/`, `src/` or `fixtures/` changes. The release play-stage still boots `openBundled()` unchanged (`page.ts` L79–80); there is no new query flag anywhere.
2. **The existing loader, nothing new.** The page opens the project only through `openProject` (`project.ts` L75) and plays it only through `startMatch` (`page.ts` L15). No `JSON.parse`, `formatVersion`, `kind ===`, `fetch` or new reader in `tools/baseline/`.
3. **Bundle, don't fetch.** `tools/baseline/checkpoint.ts` imports the 8 files straight from `handback/step-06c-checkpoint/r1/checkpoint.tileproj/` with `with { type: "json" }`, copying `project.ts` L11–14 and L26–30. The build inlines them as `.json.js` (the play-stage `toJs`/walk path), so the page works offline from a gh-pages subpath and the phone measures exactly the dumped files. Why not fetch: it would need a network call and a JSON parse in the page (P2), a second copy of the folder in the output, and it breaks offline. Why not a copy under `fixtures/`: the baseline must be the dumped artefact, not a copy that can drift; the first named test pins the key list to the folder on disk. **Don't edit any file under `handback/step-06c-checkpoint/`.**
4. **Boot order.** `tools/baseline/index.html` has **no** `#board`. `tools/baseline/page.ts` imports `startMatch`, then makes `<canvas id="board">` and prepends it to `body` (`home.ts` L54 **appends**, because the maker has no `#read` already in the body; prepend keeps the existing overlay after the canvas in tree order), then calls `openCheckpoint()`. If `docs === null` it writes `baseline: the checkpoint did not open` and the error into the readout and starts nothing (no silent fallback to the demo, Law 12). Else `startMatch(docs)`.
5. **The readout (34b definitions, so numbers compare with `device-page/`).** A pure `tools/baseline/readout.ts` (no DOM), used by the page and the test:
   - `framesOf(gaps)`: sorted copy `s`; `p50 = s[floor(n·0.5)]`, `p95 = s[floor(n·0.95)]`, `max = s[n−1]`, all `0` for an empty list; `dropped` = gaps `> 25` ms (34b's threshold, `device-page/page.ts` L30, not 16.7 ms: a 60 Hz phone jitters past 16.7 all the time); `over50` = gaps `> 50` ms; `n`.
   - `canvasMbOf(sizes)` = Σ `width·height·4` / 1 048 576 over **every `<canvas>` in the document** (the play stage has one, `#board`). Offscreen sprite canvases aren't counted (the page can't reach the driver's backend in a release build); say so in § Build.
   - `heapPeakOf(peak, used)`: if `used` is a finite number, `max(peak ?? 0, used / 1 048 576)`, else `peak` unchanged. The page passes `performance.memory?.usedJSHeapSize` read through an `unknown` cast (Chromium only).
   - `readout({gaps, elapsedMs, canvasMb, heapMb, dpr})` returns exactly these lines, with `DONE` first once `elapsedMs ≥ 60 000`:
     `baseline 06c · Skirmish (checkpoint.tileproj)` / `frame ms p50 X p95 X max X` / `dropped (>25 ms) D over 50 ms B of N` / `canvas MB X · dpr R` / `heap MB peak X` or `heap MB peak n/a` / `GC: n/a (browsers don't expose it)`. Numbers to one decimal place.
6. **Measuring: one clock, a host-rAF wrapper.** Don't start a second `requestAnimationFrame` loop beside the play stage. Sample the way 34b does: 34b wraps the host rAF in the `env` it hands its own driver (`tools/device-page/page.ts` L43: `window.requestAnimationFrame((ts) => { note(); cb(ts); })`). `startMatch(docs, back?, aim?)` (`page.ts` L15) takes **no** env or rAF parameter. It builds its env at L28 as `(cb) => requestAnimationFrame(cb)`, which looks up the global at call time, and the driver is the only rAF caller in the play stage (`raf-driver.ts` L55, L66, L93). So, with no play-stage edit, the page keeps `host = window.requestAnimationFrame.bind(window)`, then sets `window.requestAnimationFrame = (cb) => host((ts) => { note(ts); cb(ts); })` **before** calling `startMatch`. Each host tick records `ts − prev` while `ts − t0 < 60 000` (as 34b L42), updates the heap peak, and rewrites `#read`. Once the text starts with `DONE` it is **locked**: `note` returns at once and never rewrites it again, so the CEO can screenshot it. `cb(ts)` still runs every tick, so play keeps going after `DONE`; it just isn't measured.
7. **Overlay.** `#read` is a `<pre>`: `position: fixed`, top `48px` (under the HUD top bar, `board.ts` L50 `HUD_TOP`), full width, `pointer-events: none`, dark see-through background, 13 px monospace. It has no buttons and blocks no tap.
8. **Builder.** `tools/baseline/build.ts` reuses `ROOT`, `toJs`, `release`, `refuse` and `sha` from `tools/play-stage/build.ts` (imports only; that file isn't edited). `build(out, commit, root = ROOT)`: commit must be 40 hex; refuses a non-empty `out`; walks from `tools/baseline/page.ts` in **release mode** (dev-only lines stripped), inlining JSON as `.json.js`; throws on any path matching `/editor|tools\/maker|catalogue\.json/`; writes `index.html` with `src="./page.ts"` → `src="./tools/baseline/page.js"` and the `data:,` icon (as play-stage `toHtml`); writes `build.json` `{commit, node, entry: "index.html", files: {name: sha256}}`. CLI: `node tools/baseline/build.ts <out> [commit, which must be HEAD]` with `refuse()` (clean checkout, HEAD only). All paths are relative, so `<out>` works as the gh-pages subpath `baseline-06c/`.
9. Game rules stay out of `src/core` and `src/sim`; nothing game-specific in engine code (this step changes no engine file). No plain-object lookup by a document key without `Object.hasOwn` or a `Map` (the trial needs none). Offline, no new dependencies.

## Build (caps are counted lines, insertions + deletions)
| File | Job | Trial | Cap |
|---|---|---|---|
| `tools/baseline/checkpoint.ts` | new: 8 JSON imports, `checkpointFiles()`, `openCheckpoint()` = `openProject(checkpointFiles())` (Rules 3) | 13 | 16 |
| `tools/baseline/readout.ts` | new, pure: `RUN_MS`, `DROP_MS`, `BAD_MS`, `GC_LINE`, `framesOf`, `canvasMbOf`, `heapPeakOf`, `readout` (Rules 5) | 16 | 22 |
| `tools/baseline/page.ts` | new entry: boot order, host-rAF wrapper, lock (Rules 4, 6) | 17 | 24 |
| `tools/baseline/index.html` | new: `<pre id="read">`, overlay CSS, no `#board` (Rules 4, 7) | 6 | 8 |
| `tools/baseline/build.ts` | new: release builder + CLI (Rules 8) | 24 | 28 |
| `tests/tools/baseline-page.test.ts` | new: the 3 named tests | 41 | 55 |
| `handoff/steps/tests/s6d-baseline/smoke.mjs` | new: the smoke (counted here) | 35 | 45 |

**Count command:** `git diff --shortstat <base>..HEAD -- . ':!handback/**'`. Hard gate **400**; the caps sum to **198**; the trial used **152** (152 +, 0 −). Going over any one cap is stop-and-report, not a quiet overrun.

## Named tests (all in `tests/tools/baseline-page.test.ts`; import only DOM-free files)
1. **`baseline page opens the checkpoint project`**: `Object.keys(checkpointFiles())` sorted equals the file list on disk under `handback/step-06c-checkpoint/r1/checkpoint.tileproj/`; `openCheckpoint()` gives `error === ""` and non-null `docs`; `createMatch(docs, 0)` has a 6 × 6 grid, `sides.contest === true` and `view().outcome === null`; the source of `tools/baseline/page.ts` imports `startMatch` from `../play-stage/page.ts` and calls `startMatch(opened.docs)` (or the builder's name for it); no file in `tools/baseline/` matches `JSON\.parse|formatVersion|kind === |tools\/maker|src\/editor|\bfetch\b` (comments included).
2. **`baseline readout maths on a fixed frame list`**: for `[16,17,16,18,16,30,16,17,55,16,16,17,16,16,16,17,16,16,16,20]`, `framesOf` is `{p50: 16, p95: 55, max: 55, dropped: 2, over50: 1, n: 20}`; `framesOf([])` is all zero; `canvasMbOf` of 1170 × 1536 plus 512 × 512 is the exact sum / 1 048 576; `heapPeakOf(null, undefined) === null`, `heapPeakOf(null, 8 MiB) === 8`, `heapPeakOf(12, 8 MiB) === 12`; `readout` at 1 s with `heapMb: null` gives the five lines of Rules 5 exactly (heap `n/a`) and no `DONE`; at 60 000 ms it starts `DONE\n` and shows `heap MB peak 9.3` for 9.25.
3. **`baseline build ships the checkpoint and no maker or editor code`**: `build()` into a temp folder with `"0".repeat(40)`; `index.html` points at `./tools/baseline/page.js`; the shipped `handback/…/checkpoint.tileproj/` files are exactly the 8 on disk plus `.js`; no shipped path matches `/editor|tools\/maker|catalogue\.json/`; shipped `tools/play-stage/page.js` has no `__play` or `dev-only`; a second `build()` into the same folder throws `not empty`.

## Smoke (`handoff/steps/tests/s6d-baseline/smoke.mjs`, port 8808)
`PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6d-baseline/smoke.mjs . 8808`. Copy the S0 smoke's head (L1–15). It calls `build(join(tmp, "baseline-06c"), "0".repeat(40), root)` (release mode) and serves `tmp`, so the page loads from **`/baseline-06c/`**, the real subpath. For each width 390 and 360 (height 844, dsf 3, `isMobile`, `hasTouch`): open `/baseline-06c/`; `page.waitForFunction` until the readout's `of N` has N ≥ 120 (timeout 20 s; no fixed sleep); then one `ok`/`FAIL` line each:
1. `#board` exists with width and height > 0, and `#hud` exists (the match started).
2. `frame ms p50 X p95 X max X` parses, with 0 < p50 ≤ p95 ≤ max.
3. `dropped (>25 ms) D over 50 ms B of N` parses, N ≥ 120.
4. `canvas MB X` parses, X > 0.
5. `heap MB peak` is a number or `n/a`.
6. The last line is exactly `GC: n/a (browsers don't expose it)`.
7. No page error, no console error, no request outside the origin.
Screenshot at 390 into the temp folder (attach it as § Screenshot). End with `SMOKE PASS`. The S0 smoke isn't required (no play-stage file changes); run it only if one does, which Rules 1 forbids.

## Must NOT
- No edit to any existing file: nothing under `src/`, `tools/play-stage/`, `tools/maker/`, `tools/device-page/`, `fixtures/`, `data/`, `behaviour-library/`, `handback/step-06c-checkpoint/`, existing tests or `handoff/steps/tests/` (other than the new `s6d-baseline/`). If an existing test fails, stop and report.
- No new query flag or build switch on the play stage, maker or device page. No `?project=` anywhere.
- No `fetch`, no `JSON.parse`, no storage, no outside URL in the page.
- No import of `tools/maker` or `src/editor` (the build throws on it; test 3 checks).
- No publish and no gh-pages push. No new framework, dependency or visual theme.
- No empty `catch` and no silent fallback (Law 12): a failed open shows its error.

## Done when
- **Gates:** `npm ci && npm run green` exits 0 at **1108** or more on `c829fcb7` (or the later base's count + 3), with `one-parser.test.ts` unedited and passing. `npx tsc --noEmit -p tools/tsconfig.json` shows **no error in `tools/baseline/`** (the base already has 3 errors in `tools/maker/home.ts` and `tools/effect-designer/page.ts`; leave them). Quote the count command; 400 or fewer, and each cap kept.
- **§ Green:** the `ℹ tests / pass / fail` lines and the 3 named tests' ✔ lines.
- **§ Smoke:** the 14 ok lines and `SMOKE PASS`.
- **§ Build:** `node tools/baseline/build.ts <empty dir>/baseline-06c` run on the clean Code head, then the file count, the `build.json` sha256, and one sentence: canvas MB counts on-screen canvases only.
- **§ Screenshot:** the 390 smoke shot.
- **Not the builder's gate:** CoS asks the CEO for SEND; with it, CoS builds from the merge sha (`node tools/baseline/build.ts <dir>/baseline-06c <merge sha>` on a clean checkout) and publishes `baseline-06c/`. Then the CEO, on each phone, opens `…/baseline-06c/` in Chrome (or Samsung Internet), keeps the screen on and the page in front (a hidden page pauses frames and shows as a huge max), plays or waits until `DONE`, and screenshots it. CoS records device, browser, p50 / p95 / max, dropped / over 50, canvas MB, heap peak or n/a, and `GC n/a`.

## Measured (trial run, 2026-11-22)
A `/tmp` worktree of `c829fcb7`, never committed or pushed; patch at `/tmp/s6d-trial.patch`.
- Base: `npm run green` exits 0, **1105 pass, 0 fail**. With the trial: exits 0, **1108 pass, 0 fail**; P2 passes unedited; `tsc -p tools/tsconfig.json` adds no error; `eslint` on the new files is clean.
- Count: 7 files, **152 +, 0 −** (checkpoint 13, readout 16, page 17, html 6, build 24, test 41, smoke 35).
- Smoke on 8808: 7/7 ok at 390 and 7/7 at 360, `SMOKE PASS` (headless Chrome 156: p50 16.6, p95 16.8, max 33.4, dropped 2 of 120, heap 4.5 MB at 390). r2 one-off check at 390: `DONE` after 60 s (3599 frames); the readout stayed byte-identical for the next 2 s while the play stage still asked for 120 frames (game not stopped); no console errors.
- Build: 140 files, 1.2 MB. It includes the demo fixture's 16 `.json.js` files, because `project.ts` imports them at load time (L11–14); they're never used here.

## Carries and risks (not this step)
- **Heap is Chromium-only and coarse.** `performance.memory` is non-standard; Chrome buckets it and rate-limits updates unless started with a flag a phone user can't set. Chrome and Samsung Internet on the S21 Ultra and Chrome on the Red Magic 9 Pro are Chromium, so expect a number on both; a non-Chromium browser shows `n/a`. **Not yet seen on the real phones.** It's a peak of JS heap, not an allocation count.
- **GC can't be measured** on a stock phone browser (REPORT.md L43). Real GC or allocation data needs a USB DevTools trace, which is a separate, CEO-assisted job if the frame numbers ever call for it.
- **Canvas MB isn't 34b's number.** 34b adds the driver's backend bytes (`bold.ts` L45); this page can't see them in release. Compare frame numbers with `device-page/`, not canvas MB.
- **Headless under-reads canvas MB.** In headless Chrome with dsf 3 the board's backing store stayed at CSS size (390 × 664), so the smoke only checks canvas MB > 0. Real phones size it to device pixels.
- **The scene is tiny** (6 × 6, two units). This baseline shows the floor cost of the play stage on each phone, not a stress test; the cache decision should read it that way.
