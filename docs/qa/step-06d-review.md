# QA review: Step 6d r1 (phone baseline page)

**Verdict: OK TO MERGE.** No must-fix. One review, no rework round.

Branch `step/step-06d-baseline-page-r1-chatA`, tip `849c09f27d3d0f0aff6dfb0f2aa2565441344f29` (tree `06864daf38b2dadd649d55b696b7a81729545089`), code head `b5667b30cfe01907beb1d11b23e4081f4d223bc0` (tree `413afef075053f6a73c86380b60cb4ce85053313`), base `cbe0dc8a0ccbffb1df1f68520cf6aa6cae13f30b`. Current `origin/main` is still that base (docs-only on `c829fcb7`: the 6d guide r2 and its QA review and recheck). Guide: `docs/maker/steps/step-06d-baseline-page.md` r2, blob `76319620`, sha256 `04bc1e26a622f2f3e0e91f33884180c87c1e77db67cfdab8c0fd9535186761d0`, 111 lines, same on the base, the tip, the code head, current main, and `/workspace/share/s6d/step-06d-baseline-page.md`. r2 applies the guide-review must-fixes (one clock; `home.ts` L54 append cite). Go-line `/workspace/share/step-06d-goline.md`. CoS report `/workspace/share/step-06d-verify/report.md` (sha256 `8495ba8ea2e1c8ccd1288635215ecdad8ea4d6577afbd2a50d74d5b4a061eb26`, hash-object `502fdfad`, 59 lines) was used as a pointer only. Tip vs code head is `handback/step-06d-baseline-page/r1/` only (2 files, 121 insertions: `HANDBACK.md` blob `72d2242b`, 121 lines, and `01-baseline.png` 390×844 RGB). Both branch commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>`. HANDBACK has a **Code head** label (HB:3). No raw `.txt` / `.log` test output is in the tip.

## Numbers (my own runs on a fresh worktree at the tip, real `npm ci`)

- `npm run green` exits 0: **1108** pass, 0 fail, 0 skipped, 0 todo. Floor 1105 + N=3. All three named tests are present, close on their last line, and passing: `baseline page opens the checkpoint project` (`tests/tools/baseline-page.test.ts:14-20`), `baseline readout maths on a fixed frame list` (`:21-29`), `baseline build ships the checkpoint and no maker or editor code` (`:30-38`). `one-parser.test.ts` is unedited and passing. `typecheck`, `lint`, `deps` (172 modules, 492 dependencies), `check:state` and `check:law` each exit 0. `npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts:79` twice); none in `tools/baseline/`. Those two source files are unedited vs the base.
- **Count:** official command at the code head and at the tip: `git diff --shortstat cbe0dc8a..HEAD -- . ':!handback/**'` → **7 files changed, 162 insertions(+)** = 162 ≤ 400. Per-file (insertions / cap, guide L57–63, L65): checkpoint 14/16, readout 18/22, page 19/24, html 7/8, build **28/28**, test 38/55, smoke 38/45. Every cap is kept (build sits on the cap, not over). Caps sum 198 is not a second gate. The seven files are all new; nothing else is in the official diff. Lockfile unchanged.
- **Smokes** (`/opt/google/chrome/chrome` 156.0.8078.47, `PLAYWRIGHT_CORE` playwright-core under `/tmp/pw`, this box Node v24.22.1), port 8808, page loaded from `/baseline-06c/`. Two idle runs, both **7/7 at 390 and 7/7 at 360**, `SMOKE PASS`. Waits are `waitForFunction` (`smoke.mjs:22`); no `waitForTimeout`. Board 390×664 / 360×664; p50 16.6 ≤ p95 16.7 ≤ max; N ≥ 120; canvas MB 1 / 0.9; heap a number (~4.5–4.7 MB); last line `GC: n/a (browsers don't expose it)`; quiet. CoS already ran ×3 including one under CPU load (V:23); I did not repeat the loaded run. The smoke overwrites `01-baseline.png`; the committed file was restored afterwards.
- **Build** on a clean code-head worktree at `b5667b30`: `node tools/baseline/build.ts <empty>/baseline-06c` exits 0. **140 files**, 661374 bytes (139 paths in `build.json` plus `build.json`). `commit` is the code head, `entry` is `index.html`. This box is Node v24.22.1, so the written `build.json` sha256 is `4e8ead1c…`. Replacing only the `node` field with `22.23.3` (the builder's node, HB:96) yields **`f8eb6586c6f1fef51d37c7454319b2f7dfab489ac649eb95bbf9cdce128af243`**, matching the claim. All 139 file hashes verify. Canvas MB counts on-screen canvases only (HB Build; `page.ts:14` / `readout.ts:9-10`).
- **Pins 5/5 and S0:** zero diff vs the base in `package.json`, the lockfile, `.dependency-cruiser.cjs`, `scripts/check-law.sh`, and `src/types/core-types.ts`. `handoff/steps/tests/s0-play-input/touch-smoke.mjs` sha256 is still `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` on base, code head and tip. No diff under `src/`, `tools/play-stage/`, `tools/maker/`, `tools/device-page/`, `fixtures/`, `data/`, `behaviour-library/`, or `handback/step-06c-checkpoint/`. S0 is not required (guide L3 / L81; no play-stage edit).
- **Merge tree:** `git merge-tree --write-tree cbe0dc8a0ccbffb1df1f68520cf6aa6cae13f30b 849c09f27d3d0f0aff6dfb0f2aa2565441344f29` is clean and gives **`06864daf38b2dadd649d55b696b7a81729545089`**, the tip tree, because current main is the product base and has not moved.

## Checked OK

- **6d behaviour / one clock.** `openCheckpoint()` is `openProject(checkpointFiles())` (`checkpoint.ts:14`); the eight JSON files are imported with `with { type: "json" }`, no `JSON.parse` or `fetch`. Failed open writes `baseline: the checkpoint did not open` and the error and starts nothing (`page.ts:8`); no fallback to the demo. Else the page installs `host = window.requestAnimationFrame.bind(window)` and `window.requestAnimationFrame = (cb) => host((ts) => { note(ts); cb(ts); })` **before** `startMatch(opened.docs)` (`page.ts:10,17-18`). `requestAnimationFrame` appears exactly twice in `page.ts` (named test `:18`). There is no second rAF loop. Gaps are pushed only while `ts - t0 < RUN_MS` (`page.ts:12`); `prev` starts at `-1`. Once the text starts with `DONE`, `note` returns at once and never rewrites it (`page.ts:11,15`); `cb(ts)` still runs, so play continues. `openBundled()` is unchanged (no play-stage edit); index.html has no `#board`, so the play-stage boot (L79–80) does not fire. No new query flag, no `?project=`.
- **Readout / Law 13 / overlay.** 34b definitions: dropped > 25 ms, over 50 ms, 60 s window, heap `n/a` or a number, fixed `GC: n/a (browsers don't expose it)`. Empty `framesOf([])` is all zero (explicit branch at `readout.ts:5`). The gaps list is bounded by the 60 s window, then the lock. Overlay: `#read` is a `<pre>`, `top: 48px` (`HUD_TOP`), `pointer-events: none`, 13 px monospace, dark see-through background, no buttons (Rule 7). Existing HUD buttons stay 48 px (`hud.ts`). New wait is `waitForFunction`.
- **Export audit of the 140-file release.** `index.html` points at `./tools/baseline/page.js`. Shipped tree: `tools/baseline/` (page, checkpoint, readout), `tools/play-stage/` (11 runtime files), `src/` runtime (core, runtime, rules, sim, state, project load/read), the eight checkpoint `.json.js` files, and the 16 demo fixture `.json.js` files (because `tools/play-stage/project.ts` imports them at load time; declared at guide L104 / HB:117; never used by this page). No path matches `/editor|tools\/maker|catalogue\.json/`. No `behaviours.json`. Shipped `tools/play-stage/page.js` has no `__play` or `dev-only`. No editor, maker, device-page, or dev-overlay file. Nothing else unexpected.
- **Screenshot.** Committed `01-baseline.png` is 390×844, light (RGB). It matches the caption at HB:100–102: YOUR TURN and Menu; the six readout lines (`p50 16.6`, `p95 16.7`, `max 33.4`, `dropped 1 of 123`, `canvas MB 1.0`, `dpr 3.0`, `heap 9.5`, `GC: n/a (browsers don't expose it)`); a dark board with one gray-brown band; End turn at the bottom right; white page below; no level strip. HB:99 already names the 121-vs-123 frame lag between the check and the shot. Screenshots are not the builder's gate.
- **Doc vs code / attribution.** HANDBACK claims I checked (SHAs, trees, N=3 titles, 162, per-file caps, build.json sha on Node 22.23.3, Code head, no play-stage edit, one clock) match the tree. HB:3 "PR: none yet from the branch" was true at hand-back / CoS verify time (V:5, V:11); the PR is #93, opened after. No CoS / UX / EA / builder choice is labelled a CEO ruling. Overlay colours and padding are named in HB:112 as values the step did not specify. Publish of `baseline-06c/` stays gated on the CEO's SEND via CoS (guide L19, L97; HB:121).

## Law 12 — every `catch` / `??` / `||` default in `tools/baseline/*`

**`tools/baseline/page.ts`**
- `:14` `devicePixelRatio || 1` — writes `dpr 1.0` only if the browser reports a falsy ratio. A normal page has a positive `devicePixelRatio` (the smoke shot shows `3.0`). Not a silent substitute for heap or GC, and not a fail-open path. Not a must-fix.
- No `catch`. Failed open is the explicit L8 sentence, then the function returns without wrapping rAF or calling `startMatch`.

**`tools/baseline/readout.ts`**
- `:7` `s[Math.floor(n * 0.5)] ?? 0` (and the p95 / max `?? 0`). Reachable only if `n > 0` and an index is missing; the `n === 0` case is the explicit all-zero return at `:5`. Same identity as 34b. Named test pins `framesOf([])`.
- `:13` `peak ?? 0` inside `heapPeakOf` when `used` is a finite number — the first sample, documented in guide Rule 5. If `used` is not a finite number, `peak` is unchanged and stays `null` → the label `n/a`. Fail-closed for missing memory.

**`tools/baseline/build.ts`**
- `:17` `files[k] ?? ""` when hashing a name taken from `Object.keys(files)` — the same bag, same pattern as play-stage `build.ts`. A missing key would hash an empty string; it cannot happen for keys just listed.
- `:26` `why ?? "usage: …"` — only on the CLI error path (`why !== null || out === undefined`), then `process.exit(1)`. Fail-closed.
- `:27` `asked ?? head` — omitted commit means HEAD; `refuse()` already rejected a dirty tree or a non-HEAD asked sha.

**`tools/baseline/checkpoint.ts`**, **`index.html`:** none.

No empty `catch` in the product files. Heap is a number or the label `n/a`; GC is the fixed n/a line; a failed open does not fall back to the demo.

The smoke's `??` env / URL / MIME defaults, `catch { 404 }`, and `waitForFunction` `?? ""` are the copied S0 server shape (not product). The wait is not swallowed: a throw leaves the `try` and Node exits non-zero.

## Non-blockers

- **Heap 4.5–4.7 MB here vs 9.5 in the hand-back.** HB Smoke used a Playwright headless shell; I used `/opt/google/chrome/chrome` 156.0.8078.47. The smoke predicates passed on both of my runs. Not a byte-for-byte pin (V:30).
- **Node v24.22.1 vs HB v22.23.3.** `.nvmrc` pins 24. A code-head rebuild on this box changes only the `build.json` `node` field; the 139 file hashes are identical and, with `node` set to `22.23.3`, the build.json sha256 matches `f8eb6586…`.
- **Named-test serials** were 1053–1055 here (`✔`); HB quotes `ok 1018–1020`. The titles match (V:31).
- **HB:3 PR line** was true at hand-back; PR #93 was opened later.
- **Export audit** is not required by the guide (no play-stage edit; HB:37). I still ran one on the 140-file release; the only extra pack is the declared demo fixtures.

## Must-fix

None.
