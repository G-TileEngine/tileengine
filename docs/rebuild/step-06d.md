# Rebuild record: step 6d, phone baseline page

Original brief: [`docs/maker/steps/step-06d-baseline-page.md`](../maker/steps/step-06d-baseline-page.md) on the merge (r2, blob `76319620`, sha256 `04bc1e26a622f2f3e0e91f33884180c87c1e77db67cfdab8c0fd9535186761d0`, 111 lines). Delivery L12; Goal L21; Read first L24; Rules L38; Build L54; Named tests L67; Smoke L72; Must NOT L83; Done when L91. Count command and hard per-file caps are L65; caps sum 198 at L65. The file is unchanged from the 6d product base through the merge and current main.

Sources: PR #93 and branch `step/step-06d-baseline-page-r1-chatA` (tip `849c09f2`, code head `b5667b30`); `handback/step-06d-baseline-page/r1/HANDBACK.md` at `849c09f2` and on the merge (HB, blob `72d2242b`, 121 lines); CoS verify report `/workspace/share/step-06d-verify/report.md` (V, 59 lines, sha256 `8495ba8ea2e1c8ccd1288635215ecdad8ea4d6577afbd2a50d74d5b4a061eb26`, hash-object `502fdfad1c31e0a3afc169c4e5031017d1bffa5a`); QA review `docs/qa/step-06d-review.md` on main `9a5c1220` (QA, 55 lines, sha256 `3d26fb9be7bf4ef009d3f35b2308d30d862718ea02bc55fa911ab6699e14692e`, hash-object `a3996263f24291644310ee8f5c923018233953ef`). Line cites use HB, V and QA.

## (a) Start and finish

| | Value |
|---|---|
| Base | `cbe0dc8a0ccbffb1df1f68520cf6aa6cae13f30b`, 6d guide r2 and its QA review/recheck on main, 2026-11-22 16:34 (UK time). Floor **1105** tests (guide L8 / L92: 6c's final count + N). After this merge the floor is **1108**. Current `origin/main` at merge time was that same base. It is docs-only on `c829fcb7` (the 6c rebuild record r2 and its QA review/recheck, plus the 6d guide files) |
| r1 commits | `b5667b30cfe01907beb1d11b23e4081f4d223bc0` feat(maker): phone baseline page for the 6c checkpoint (code head, tree `413afef075053f6a73c86380b60cb4ce85053313`, 2026-11-22 17:10 UK time), `849c09f27d3d0f0aff6dfb0f2aa2565441344f29` docs(handback): step-06d-baseline-page r1 (tree `06864daf38b2dadd649d55b696b7a81729545089`, 2026-11-22 17:12 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the hand-back folder only (2 files, 121 insertions): `HANDBACK.md` and `01-baseline.png` (V:7, QA:5) |
| r1 verdict | QA **OK TO MERGE** (QA:3). No must-fix, no rework round (QA:3, QA:53-55). Green 1108/0, official G7 162 with every per-file cap kept, s6d ×3 (one under CPU load; V:23, HB:40-92), tools tsc clean for `tools/baseline/` (V:21, QA:9). Non-blockers (QA:45-51, QA:20, QA:27) are recorded below |
| Merge | PR #93 "Step 6d: phone baseline page (r1, ChatA)", merge commit `aa2ef7e3ca463a9e1c72899910dd76990dafcd38`, 2026-11-22 20:35 (UK time). Tree `06864daf38b2dadd649d55b696b7a81729545089` (the same tree CoS and QA predicted against `cbe0dc8a`, and the tip tree, because main had not moved; V:37, QA:14). First parent `cbe0dc8a` (main at merge, which is also the product base), second parent `849c09f2`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| After the merge | main is `9a5c12205b79e61573cfa3a20e1940cdf350616f`, 2026-11-22 20:36 (UK time), tree `1d6358a701fa6871f00bd3d68a55c735c878ca30`, which adds only `docs/qa/step-06d-review.md` (55 insertions, sha256 `3d26fb9b`, hash-object `a3996263`). **QA postmerge: PASS.** Merge `aa2ef7e3` has tree `06864daf` and second parent tip `849c09f2`, 1108/0, pins 5/5, smoke ok, noreply author, merge equals tip. The only warning is the normal main-moved one (`9a5c1220`). The floor is now 1108. |
| Tests | 1105 + N=3 (`baseline page opens the checkpoint project`, `baseline readout maths on a fixed frame list`, `baseline build ships the checkpoint and no maker or editor code`) = **1108 pass / 0 fail**. Floor after this merge is **1108** (HB:19, V:21, QA:9) |

## (b) Files

From `git diff --name-status cbe0dc8a..b5667b30 -- . ':!handback/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base (which is what the 6d step added). The same product files are on the merge tree `06864daf`. The 6d guide docs on the merge are from first parent `cbe0dc8a`, not from this branch. The smoke is counted in this step (guide L65).

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tools/baseline/checkpoint.ts` | A | 14 / 0 | 16 (L57) | yes |
| `tools/baseline/readout.ts` | A | 18 / 0 | 22 (L58) | yes |
| `tools/baseline/page.ts` | A | 19 / 0 | 24 (L59) | yes |
| `tools/baseline/index.html` | A | 7 / 0 | 8 (L60) | yes |
| `tools/baseline/build.ts` | A | 28 / 0 | 28 (L61) | yes. sits on the cap, not over (HB:34, HB:117, QA:10) |
| `tests/tools/baseline-page.test.ts` | A | 38 / 0 | 55 (L62) | yes |
| `handoff/steps/tests/s6d-baseline/smoke.mjs` | A | 38 / 0 | 45 (L63) | yes (counted here) |

No existing file was edited: zero diff under `src/`, `tools/play-stage/`, `tools/maker/`, `tools/device-page/`, `fixtures/`, `data/`, `behaviour-library/`, `handback/step-06c-checkpoint/`, or any existing test, including `tests/project/load/one-parser.test.ts` (HB:16, HB:20, V:18, QA:13). Official G7 is **7 files changed, 162 insertions(+)** = 162 ≤ 400. Every per-file cap is kept. Caps sum 198 (guide L65) is not a second gate. No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base.

## (c) Key code and git commands

6d is a tools-only phone baseline page (guide L3, L21). It opens the exact 6c checkpoint project (`handback/step-06c-checkpoint/r1/checkpoint.tileproj/`, name Skirmish) through the existing loader and lays a 34b-style readout over the play stage. There is no maker screen and no engine, play-stage or maker edit.

`tools/baseline/checkpoint.ts` imports the eight dumped JSON files with `with { type: "json" }` (Rule 3) and exports `openCheckpoint()` as `openProject(checkpointFiles())` (`checkpoint.ts:14`; QA:18). The page has no `#board` in `index.html`; it imports `startMatch`, prepends `<canvas id="board">`, then calls `openCheckpoint()` (`page.ts:1-7`; Rule 4). If `docs === null` it writes `baseline: the checkpoint did not open` and the error and starts nothing (`page.ts:8`; no demo fallback). Else it wraps the host rAF **before** `startMatch(opened.docs)` (`page.ts:10,17-18`; Rule 6, V:18, QA:18). `requestAnimationFrame` appears exactly twice in `page.ts` (named test `:18`). There is no second rAF loop. The standalone play-stage boot still runs `openBundled()` only if `#board` already exists at module evaluation (`tools/play-stage/page.ts:79-80`, unedited), so it does not fire here. No new query flag and no `?project=`.

```ts
if (opened.docs === null) read.textContent = `baseline: the checkpoint did not open\n${opened.error}`;
else {
  const host = window.requestAnimationFrame.bind(window); let t0 = 0, prev = -1, peak: number | null = null, lock = false; const gaps: number[] = [];
```

```ts
  window.requestAnimationFrame = (cb) => host((ts) => { note(ts); cb(ts); });
  startMatch(opened.docs);
}
```

Gaps are pushed only while `ts - t0 < RUN_MS` (`page.ts:12`); `prev` starts at `-1`. Once the text starts with `DONE`, `note` returns at once and never rewrites it (`page.ts:11,15`); `cb(ts)` still runs, so play continues after `DONE` (Rule 6, QA:18). The readout is a pure `tools/baseline/readout.ts` using 34b definitions: p50 / p95 / max from `s[floor(n·q)]`, dropped `> 25` ms, over 50 ms, 60 s window, heap peak or `n/a`, and the fixed line `GC: n/a (browsers don't expose it)` (`readout.ts:1,15-18`; Rule 5, QA:19). Canvas MB is the sum of `width * height * 4` over every `<canvas>` in the document (`readout.ts:9-11`, `page.ts:14`; HB:96). Overlay: `#read` is a `<pre>`, `top: 48px`, full width, `pointer-events: none`, 13 px monospace (Rule 7, `index.html:4`; unnamed colours and padding at HB:112).

**`devicePixelRatio || 1` at `page.ts:14` is display-only, not a must-fix** (QA:27). It writes `dpr 1.0` only if the browser reports a falsy ratio. A normal page has a positive `devicePixelRatio` (the committed shot shows `3.0`, HB:101). It is not a silent substitute for heap or GC. It matches the unedited `tools/play-stage/page.ts:22`, so do not "fix" it in isolation.

```ts
    read.textContent = readout({ gaps, elapsedMs: ts - t0, canvasMb: canvasMbOf([...document.querySelectorAll("canvas")].map((el) => ({ width: el.width, height: el.height }))), heapMb: peak, dpr: devicePixelRatio || 1 });
```

**The 16 demo fixture packs that `tools/play-stage/project.ts` imports at load time (`:11-14`) are shipped in the release build but unused by this page** (guide L104, HB:117, QA:20). That is a carry. Do not "fix" it by editing `project.ts`. The eight checkpoint `.json.js` files are shipped and used. No shipped path matches `/editor|tools\/maker|catalogue\.json/`. Shipped `tools/play-stage/page.js` has no `__play` or `dev-only` (named test `:30-38`, QA:20).

The three named tests, closed on their last line (V:20, QA:9):

```ts
test("baseline page opens the checkpoint project", () => {
  assert.deepEqual(Object.keys(checkpointFiles()).sort(), disk(DIR, "").sort());
  const opened = openCheckpoint(); assert.equal(opened.error, ""); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const match = createMatch(opened.docs, 0); assert.equal(match.world.grid.cols, 6); assert.equal(match.world.grid.rows, 6); assert.equal(match.sides.contest, true); assert.equal(match.view().outcome, null);
  const page = readFileSync("tools/baseline/page.ts", "utf8"); assert.match(page, /from "\.\.\/play-stage\/page\.ts"/); assert.match(page, /startMatch\(opened\.docs\)/); assert.match(page, /baseline: the checkpoint did not open/); assert.match(page, /prev = -1/); assert.equal((page.match(/requestAnimationFrame/g) ?? []).length, 2);
  const hits = disk("tools/baseline", "tools/baseline").filter((rel) => BAD.test(readFileSync(rel, "utf8"))); assert.deepEqual(hits, []);
});
test("baseline readout maths on a fixed frame list", () => {
  assert.deepEqual(framesOf(GAPS), { p50: 16, p95: 55, max: 55, dropped: 2, over50: 1, n: 20 }); assert.deepEqual(framesOf([]), { p50: 0, p95: 0, max: 0, dropped: 0, over50: 0, n: 0 });
  assert.equal(framesOf([25]).dropped, 0); assert.equal(framesOf([50]).over50, 0); assert.equal(framesOf([50]).dropped, 1); assert.equal(framesOf([25.1]).dropped, 1); assert.equal(framesOf([50.1]).over50, 1);
  const bytes = 1170 * 1536 * 4 + 512 * 512 * 4; assert.equal(canvasMbOf([{ width: 1170, height: 1536 }, { width: 512, height: 512 }]), bytes / 1_048_576);
  assert.equal(heapPeakOf(null, undefined), null); assert.equal(heapPeakOf(null, 8 * 1_048_576), 8); assert.equal(heapPeakOf(12, 8 * 1_048_576), 12);
  const early = readout({ gaps: GAPS, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 2 }); assert.equal(early.startsWith("DONE"), false);
  assert.equal(early, "baseline 06c · Skirmish (checkpoint.tileproj)\nframe ms p50 16.0 p95 55.0 max 55.0\ndropped (>25 ms) 2 over 50 ms 1 of 20\ncanvas MB 1.0 · dpr 2.0\nheap MB peak n/a\nGC: n/a (browsers don't expose it)");
  const done = readout({ gaps: GAPS, elapsedMs: 60_000, canvasMb: 1, heapMb: 9.25, dpr: 2 }); assert.equal(done.startsWith("DONE\n"), true); assert.equal(done.includes("heap MB peak 9.3"), true);
});
test("baseline build ships the checkpoint and no maker or editor code", () => {
  const out = mkdtempSync(join(tmpdir(), "s6d-build-")); try {
    build(out, "0".repeat(40)); const html = readFileSync(join(out, "index.html"), "utf8"); assert.equal(html.includes('src="./tools/baseline/page.js"'), true);
    const shipped = tree(out, "").filter((rel) => rel.includes("checkpoint.tileproj/")); const want = disk(DIR, "").map((rel) => `${DIR}/${rel}.js`).sort();
    assert.deepEqual(shipped.sort(), want); assert.deepEqual(tree(out, "").filter((rel) => /editor|tools\/maker|catalogue\.json/.test(rel)), []);
    const page = readFileSync(join(out, "tools/play-stage/page.js"), "utf8"); assert.equal(page.includes("__play"), false); assert.equal(page.includes("dev-only"), false);
    assert.throws(() => build(out, "0".repeat(40)), /not empty/);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
```

The s6d smoke (`handoff/steps/tests/s6d-baseline/smoke.mjs`, 38 lines, port 8808) builds a release into a temp folder and serves it so the page loads from `/baseline-06c/` (`smoke.mjs:8,21`; guide L73). Waits are `waitForFunction` until `of N` has N ≥ 120 (`smoke.mjs:22`); no `waitForTimeout` (HB:39, V:23, QA:11). A non-empty `catch` answers a missing file with 404 (`smoke.mjs:10`; HB:115).

```js
    await page.waitForFunction(() => { const m = /of (\d+)/.exec(document.querySelector("#read")?.textContent ?? ""); return m !== null && Number(m[1]) >= 120; }, null, { timeout: 20000 });
```

S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, identical on the base, the code head, the tip and the merge (QA:13). Guide L81 / L3: S0 is required only if a play-stage file changes; it does not. No export audit is required (HB:37). QA still ran one on the 140-file release (QA:20, QA:51).

Build on the clean code head: `node tools/baseline/build.ts <empty dir>/baseline-06c` gives **140 files**, 661374 bytes (139 paths in `build.json` plus `build.json`). On Node v22.23.3, `build.json` sha256 is `f8eb6586c6f1fef51d37c7454319b2f7dfab489ac649eb95bbf9cdce128af243` (HB:96, V:22, QA:12). A rebuild on Node v24.22.1 changes only the `node` field; the 139 file hashes stay the same.

The official count command (guide L65):

```
# Product gate. The first parent of the merge is cbe0dc8a, which is also
# the product base. Official command at the code head, the tip, or the
# merge against cbe0dc8a:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**'
#   7 files changed, 162 insertions(+)
#
# The same 162 at the r1 code head or r1 tip against cbe0dc8a.
# Against c829fcb7 (the 6c-record commit, not this step's base), the
# official command also counts the three 6d guide docs already on
# cbe0dc8a (10 files, 318 insertions). Those files are not this step.
# Adding ':!docs/**' at the merge against c829fcb7 gives the official 162.

# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

# Named tests (npm test 1108/0, floor 1105 + N=3):
#   ✔ baseline page opens the checkpoint project
#   ✔ baseline readout maths on a fixed frame list
#   ✔ baseline build ships the checkpoint and no maker or editor code

# Smokes under google-chrome, at 390 and 360 CSS px:
#   s6d (8808) ×3, one under eight CPU-burn loops:
#     7 ok lines @390 and @360, then SMOKE PASS
#   S0 is not required this step (no play-stage change).

# The s6d smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s6d-baseline/smoke.mjs` is 38.
# `node tools/baseline/build.ts <empty>/baseline-06c` on the clean code
# head writes 140 files; build.json sha256 f8eb6586… on Node 22.23.3.
# S0 is not required. No export audit required. Canvas MB counts
# on-screen canvases only.
```

## (d) What went wrong, in order, and the fix

**r1.** The page shipped in one feat commit and green was 1108/0. The official gate was 162, with every per-file cap kept (`build.ts` sits on 28/28). s6d passed three times (one under CPU load), 7/7 at 390 and at 360, including the GC line and a quiet console. The build on the clean code head is 140 files; `build.json` sha256 matches on Node 22.23.3. No gap fix and no existing-file edit were needed. The tip holds only `HANDBACK.md` and `01-baseline.png`.

The first smoke's server logged `missing /index.html` for a request to `/` (the page is `/baseline-06c/`). The catch still returns 404 and, in the shipped smoke, no longer prints (HB:107). A first try of the readout test expected `[25, 50]` to have dropped 0; 50 is dropped because it is over 25. That assert was corrected before `npm run green` (HB:107).

QA **OK TO MERGE** (QA:3). No must-fix. The merge tree is `06864daf`, as predicted (QA:14, V:37).

HB:3 said `PR: none yet from the branch`, which was true at hand-back and at CoS verify (V:5, V:11, QA:22). No PR existed until after the hand-back. PR #93 was opened later (QA:50).

## (e) Do it right first time

- Start from the product base `cbe0dc8a`. Do not start from `9a5c1220` or `aa2ef7e3`, because both already contain the 6d merge. The floor at the start of 6d was 1105 + N; this merge leaves the floor at 1108.
- 6d is a tools step: only new files under `tools/baseline/`, the new test, and the new smoke. Do not edit `src/`, `tools/play-stage/`, `tools/maker/`, `tools/device-page/`, `fixtures/`, `data/`, `behaviour-library/`, or `handback/step-06c-checkpoint/`.
- Open the dumped checkpoint only through `openProject` / `openCheckpoint`, and play it only through `startMatch`. Bundle the eight JSON files at build time; do not `fetch` or `JSON.parse` in the page. Wrap the host rAF once, before `startMatch`. Lock the readout when it starts with `DONE`.
- Per-file caps on this step are hard (guide L65): going over any one cap is stop-and-report, not a quiet overrun. `build.ts` may sit on its cap. Caps sum is not a second gate.
- Do not edit `tools/play-stage/project.ts` to drop the 16 unused demo fixture packs that the release still ships because of that file's load-time imports (`:11-14`). That is a declared carry (guide L104, HB:117, QA:20).
- `devicePixelRatio || 1` at `page.ts:14` is a display fallback only (QA:27). Do not treat it as a product default for heap or GC. It matches the unedited `tools/play-stage/page.ts:22`, so do not "fix" it in isolation.
- If you edit `tools/play-stage/`, run S0 and keep sha256 `d528795e…`, and run an export audit. Otherwise S0 is not required.
- New waits are `waitForFunction`, not `waitForTimeout`. The smoke must load from `/baseline-06c/`.
- Paste the ok lines and `SMOKE PASS` from one solo run in § Smoke. A CPU-burn note can follow the paste. The tip commit should hold `HANDBACK.md` and the 390 screenshot, not raw test logs. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time.
- Measure with the count command (guide L65): `git diff --shortstat <base>..HEAD -- . ':!handback/**'`. Count insertions plus deletions (checklist L26, BUILD_GUIDE.md L123). 162 is the accepted number for this step. On a merge whose first parent is not the product base, measure against that first parent (or at the code head), and do not treat first-parent docs as 6d lines. Here the first parent is the product base.
- Publishing `baseline-06c/` is not the builder's gate. After merge, and only with the CEO's SEND via CoS, CoS builds from the merge sha and publishes that subpath (guide L19, L97; HB:121).

## (f) Rebuild check

From a clean tree at `cbe0dc8a0ccbffb1df1f68520cf6aa6cae13f30b` (the product base and the merge's first parent), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files.

```
# Product equality vs the merge (current main adds only the QA review):
#   git diff aa2ef7e3 HEAD -- tools/baseline tests/tools/baseline-page.test.ts \
#     handoff/steps/tests/s6d-baseline
#   (empty)

# Product gate. The first parent of the merge is cbe0dc8a, which is also
# the product base. Official command at the code head, the tip, or the
# merge against cbe0dc8a:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**'
#   7 files changed, 162 insertions(+)
#
# The same 162 at the r1 code head or r1 tip against cbe0dc8a.
# Against c829fcb7 (the 6c-record commit, not this step's base), the
# official command also counts the three 6d guide docs already on
# cbe0dc8a (10 files, 318 insertions). Those files are not this step.
# Adding ':!docs/**' at the merge against c829fcb7 gives the official 162.

# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

# Named tests (npm test 1108/0, floor 1105 + N=3):
#   ✔ baseline page opens the checkpoint project
#   ✔ baseline readout maths on a fixed frame list
#   ✔ baseline build ships the checkpoint and no maker or editor code

# Smokes under google-chrome, at 390 and 360 CSS px:
#   s6d (8808) ×3, one under eight CPU-burn loops:
#     7 ok lines @390 and @360, then SMOKE PASS
#   S0 is not required this step (no play-stage change).

# The s6d smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s6d-baseline/smoke.mjs` is 38.
# `node tools/baseline/build.ts <empty>/baseline-06c` on the clean code
# head writes 140 files; build.json sha256 f8eb6586… on Node 22.23.3.
# S0 is not required. No export audit required. Canvas MB counts
# on-screen canvases only.
```

## QA non-blockers carried forward

- **16 unused demo fixture packs in the release.** `tools/play-stage/project.ts:11-14` imports 16 `fixtures/demo.tileproj/**` files at load time, so the baseline build ships 16 `.json.js` copies that this page never uses. Declared at guide L104 and HB:117; confirmed in QA's export audit (QA:20). A carry; do not edit `project.ts` to drop them.
- **`page.ts:14` `devicePixelRatio || 1` is display-only.** Writes `dpr 1.0` only if the ratio is falsy. Not a silent fallback for heap or GC, and not a must-fix (QA:27). It matches the unedited `tools/play-stage/page.ts:22`, so do not "fix" it in isolation.
- **Heap 4.5–4.7 MB on Chrome 156 vs 9.5 in the hand-back.** HB:38 is a Playwright headless shell (a path, not a UA string). CoS and QA re-ran with `/opt/google/chrome/chrome` 156.0.8078.47. The smoke predicates passed; the ok-lines are not a byte-for-byte pin (QA:47, V:30).
- **Node v24.22.1 vs HB:4 v22.23.3.** `.nvmrc` pins 24. A code-head rebuild on Node 24 changes only the `build.json` `node` field; with `node` set to `22.23.3`, the sha256 matches `f8eb6586…` (QA:48, V:22).
- **Named-test serials** were 1049–1051 in the CoS run and 1053–1055 in QA's; HB quotes `ok 1018–1020`. The titles match (QA:49, V:31).
- **HB:3 PR line** was true at hand-back; PR #93 was opened later (QA:50).
- **Screenshot 121 vs 123 frames.** The check read 121; the committed shot is a moment later and says 123. Named at HB:99 (QA:21, V:33).
- Publishing `baseline-06c/` stays gated on the CEO's SEND via CoS (guide L19, L97; HB:121, QA:22).

## Blob check

Each file must have exactly this git blob id at `aa2ef7e3`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/baseline/checkpoint.ts` | `83a621f15c030aac9bc8d85e5502f275f9279534` | 14 |
| `tools/baseline/readout.ts` | `191c6e3501ced9053f8962438234d40142ff0cba` | 18 |
| `tools/baseline/page.ts` | `5c799cea169ab10a8f24a434e3fcb95e4d165550` | 19 |
| `tools/baseline/index.html` | `4328f0aad8eb1ccc2e4db295bbca77eedb6651a6` | 7 |
| `tools/baseline/build.ts` | `1ae168862bf13b3885501fa10804b7633e769394` | 28 |
| `tests/tools/baseline-page.test.ts` | `ce800c2493d3d004005203ccb91c7099cc5661a3` | 38 |
| `handoff/steps/tests/s6d-baseline/smoke.mjs` | `bc893b60395cd28c3f8d8f50f662b4218f5ca8e8` | 38 |

## Appendix: full code as merged (step 6d, PR #93)

All seven files are new on this step. The text below is `git show aa2ef7e3:<path>` in full.

### `tools/baseline/checkpoint.ts` (new)

```ts
import type { ProjectFiles } from "../../src/project/load/index.ts";
import { openProject } from "../play-stage/project.ts";
import project from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/project.json" with { type: "json" };
import slice from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/catalogue/slice.json" with { type: "json" };
import map from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/maps/map_01JDEM00000000000000000002.json" with { type: "json" };
import stage from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/stages/stage_01JDEM00000000000000000003.json" with { type: "json" };
import army from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/setups/setup_01M7XPE6006A10000000000000.json" with { type: "json" };
import shot from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/setups/setup_01M81X2F2HQQ17D2CWYR72DC9B.json" with { type: "json" };
import hero from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/units/unit_01M81X2BX5ANZS5PWVAFHNCASA.json" with { type: "json" };
import raider from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/units/unit_01M81X2PKRZ2NQKAHDV247ZRX3.json" with { type: "json" };
export function checkpointFiles(): ProjectFiles {
  return { "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDEM00000000000000000002.json": map, "stages/stage_01JDEM00000000000000000003.json": stage, "setups/setup_01M7XPE6006A10000000000000.json": army, "setups/setup_01M81X2F2HQQ17D2CWYR72DC9B.json": shot, "units/unit_01M81X2BX5ANZS5PWVAFHNCASA.json": hero, "units/unit_01M81X2PKRZ2NQKAHDV247ZRX3.json": raider };
}
export const openCheckpoint = (): ReturnType<typeof openProject> => openProject(checkpointFiles());
```

### `tools/baseline/readout.ts` (new)

```ts
export const RUN_MS = 60_000, DROP_MS = 25, BAD_MS = 50, GC_LINE = "GC: n/a (browsers don't expose it)";
export type FrameStats = { readonly p50: number; readonly p95: number; readonly max: number; readonly dropped: number; readonly over50: number; readonly n: number };
export function framesOf(gaps: readonly number[]): FrameStats {
  const s = [...gaps].sort((a, b) => a - b), n = s.length;
  if (n === 0) return { p50: 0, p95: 0, max: 0, dropped: 0, over50: 0, n: 0 };
  let dropped = 0, over50 = 0; for (const v of s) { if (v > DROP_MS) dropped += 1; if (v > BAD_MS) over50 += 1; }
  return { p50: s[Math.floor(n * 0.5)] ?? 0, p95: s[Math.floor(n * 0.95)] ?? 0, max: s[n - 1] ?? 0, dropped, over50, n };
}
export function canvasMbOf(sizes: readonly { readonly width: number; readonly height: number }[]): number {
  let bytes = 0; for (const box of sizes) bytes += box.width * box.height * 4; return bytes / 1_048_576;
}
export function heapPeakOf(peak: number | null, used: number | undefined): number | null {
  return typeof used === "number" && Number.isFinite(used) ? Math.max(peak ?? 0, used / 1_048_576) : peak;
}
export function readout(input: { readonly gaps: readonly number[]; readonly elapsedMs: number; readonly canvasMb: number; readonly heapMb: number | null; readonly dpr: number }): string {
  const f = framesOf(input.gaps), heap = input.heapMb === null ? "n/a" : input.heapMb.toFixed(1), head = input.elapsedMs >= RUN_MS ? "DONE\n" : "";
  return `${head}baseline 06c · Skirmish (checkpoint.tileproj)\nframe ms p50 ${f.p50.toFixed(1)} p95 ${f.p95.toFixed(1)} max ${f.max.toFixed(1)}\ndropped (>25 ms) ${f.dropped} over 50 ms ${f.over50} of ${f.n}\ncanvas MB ${input.canvasMb.toFixed(1)} · dpr ${input.dpr.toFixed(1)}\nheap MB peak ${heap}\n${GC_LINE}`;
}
```

### `tools/baseline/page.ts` (new)

```ts
import { startMatch } from "../play-stage/page.ts";
import { openCheckpoint } from "./checkpoint.ts";
import { canvasMbOf, heapPeakOf, readout, RUN_MS } from "./readout.ts";
const read = document.querySelector("#read");
if (!(read instanceof HTMLElement)) throw new Error("baseline: #read");
const board = document.createElement("canvas"); board.id = "board"; document.body.prepend(board);
const opened = openCheckpoint();
if (opened.docs === null) read.textContent = `baseline: the checkpoint did not open\n${opened.error}`;
else {
  const host = window.requestAnimationFrame.bind(window); let t0 = 0, prev = -1, peak: number | null = null, lock = false; const gaps: number[] = [];
  const note = (ts: number): void => {
    if (lock) return; if (t0 === 0) t0 = ts; if (prev >= 0 && ts - t0 < RUN_MS) gaps.push(ts - prev); prev = ts;
    peak = heapPeakOf(peak, (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize);
    read.textContent = readout({ gaps, elapsedMs: ts - t0, canvasMb: canvasMbOf([...document.querySelectorAll("canvas")].map((el) => ({ width: el.width, height: el.height }))), heapMb: peak, dpr: devicePixelRatio || 1 });
    if (read.textContent.startsWith("DONE")) lock = true;
  };
  window.requestAnimationFrame = (cb) => host((ts) => { note(ts); cb(ts); });
  startMatch(opened.docs);
}
```

### `tools/baseline/index.html` (new)

```html
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>baseline 06c</title>
<style>#read{position:fixed;top:48px;left:0;right:0;width:100%;margin:0;padding:4px 8px;box-sizing:border-box;pointer-events:none;background:rgba(8,10,16,.72);color:#f4efe2;font:13px monospace;z-index:5}</style>
</head>
<body><pre id="read"></pre><script type="module" src="./page.ts"></script></body>
</html>
```

### `tools/baseline/build.ts` (new)

```ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { refuse, release, ROOT, sha, toJs } from "../play-stage/build.ts";
const ENTRY = "tools/baseline/page.ts", PAGE = "tools/baseline/index.html", BAD = /editor|tools\/maker|catalogue\.json/;
export function build(out: string, commit: string, root: string = ROOT): string {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha"); else if (existsSync(out) && readdirSync(out).length > 0) throw new Error("build: not empty");
  const bag = new Map<string, string>(), seen = new Set<string>();
  const walk = (rel: string): void => {
    if (seen.has(rel)) return; seen.add(rel); if (BAD.test(rel)) throw new Error(`build: ${rel}`);
    const raw = readFileSync(join(root, rel), "utf8"), js = rel.endsWith(".json") ? `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}` : toJs(rel, release(raw, rel), walk);
    bag.set(rel.endsWith(".json") ? `${rel}.js` : rel.replace(/\.ts$/, ".js"), js);
  };
  walk(ENTRY);
  bag.set("index.html", readFileSync(join(root, PAGE), "utf8").replace('src="./page.ts"', 'src="./tools/baseline/page.js"').replace("</title>", '</title><link rel="icon" href="data:,">'));
  const files = Object.fromEntries([...bag].sort(([a], [b]) => (a < b ? -1 : 1))), sums = Object.fromEntries(Object.keys(files).map((k) => [k, sha(files[k] ?? "")]));
  const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files: sums }, null, 2)}\n`;
  if (existsSync(out)) rmSync(out, { recursive: true }); mkdirSync(out, { recursive: true });
  for (const [name, src] of Object.entries(files)) { const dest = join(out, name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, src); }
  writeFileSync(join(out, "build.json"), body); return body;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2], asked = process.argv[3], head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", cwd: ROOT })).trim(), dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8", cwd: ROOT }));
  const why = out === undefined ? "usage: node tools/baseline/build.ts <out folder> [commit, which must be HEAD]" : refuse(head, asked, dirty);
  if (why !== null || out === undefined) { console.error(why ?? "usage: node tools/baseline/build.ts <out folder> [commit, which must be HEAD]"); process.exit(1); }
  build(out, asked ?? head);
}
```

### `tests/tools/baseline-page.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build } from "../../tools/baseline/build.ts";
import { checkpointFiles, openCheckpoint } from "../../tools/baseline/checkpoint.ts";
import { canvasMbOf, framesOf, heapPeakOf, readout } from "../../tools/baseline/readout.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
const DIR = "handback/step-06c-checkpoint/r1/checkpoint.tileproj", GAPS = [16, 17, 16, 18, 16, 30, 16, 17, 55, 16, 16, 17, 16, 16, 16, 17, 16, 16, 16, 20];
const BAD = /JSON\.parse|formatVersion|kind === |tools\/maker|src\/editor|\bfetch\b/;
const disk = (at: string, base: string): string[] => { const out: string[] = []; for (const name of readdirSync(at)) { const path = join(at, name), rel = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) out.push(...disk(path, rel)); else out.push(rel); } return out; };
const tree = (at: string, base: string): string[] => { const out: string[] = []; for (const name of readdirSync(at)) { const path = join(at, name), rel = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) out.push(...tree(path, rel)); else out.push(rel); } return out; };
test("baseline page opens the checkpoint project", () => {
  assert.deepEqual(Object.keys(checkpointFiles()).sort(), disk(DIR, "").sort());
  const opened = openCheckpoint(); assert.equal(opened.error, ""); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const match = createMatch(opened.docs, 0); assert.equal(match.world.grid.cols, 6); assert.equal(match.world.grid.rows, 6); assert.equal(match.sides.contest, true); assert.equal(match.view().outcome, null);
  const page = readFileSync("tools/baseline/page.ts", "utf8"); assert.match(page, /from "\.\.\/play-stage\/page\.ts"/); assert.match(page, /startMatch\(opened\.docs\)/); assert.match(page, /baseline: the checkpoint did not open/); assert.match(page, /prev = -1/); assert.equal((page.match(/requestAnimationFrame/g) ?? []).length, 2);
  const hits = disk("tools/baseline", "tools/baseline").filter((rel) => BAD.test(readFileSync(rel, "utf8"))); assert.deepEqual(hits, []);
});
test("baseline readout maths on a fixed frame list", () => {
  assert.deepEqual(framesOf(GAPS), { p50: 16, p95: 55, max: 55, dropped: 2, over50: 1, n: 20 }); assert.deepEqual(framesOf([]), { p50: 0, p95: 0, max: 0, dropped: 0, over50: 0, n: 0 });
  assert.equal(framesOf([25]).dropped, 0); assert.equal(framesOf([50]).over50, 0); assert.equal(framesOf([50]).dropped, 1); assert.equal(framesOf([25.1]).dropped, 1); assert.equal(framesOf([50.1]).over50, 1);
  const bytes = 1170 * 1536 * 4 + 512 * 512 * 4; assert.equal(canvasMbOf([{ width: 1170, height: 1536 }, { width: 512, height: 512 }]), bytes / 1_048_576);
  assert.equal(heapPeakOf(null, undefined), null); assert.equal(heapPeakOf(null, 8 * 1_048_576), 8); assert.equal(heapPeakOf(12, 8 * 1_048_576), 12);
  const early = readout({ gaps: GAPS, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 2 }); assert.equal(early.startsWith("DONE"), false);
  assert.equal(early, "baseline 06c · Skirmish (checkpoint.tileproj)\nframe ms p50 16.0 p95 55.0 max 55.0\ndropped (>25 ms) 2 over 50 ms 1 of 20\ncanvas MB 1.0 · dpr 2.0\nheap MB peak n/a\nGC: n/a (browsers don't expose it)");
  const done = readout({ gaps: GAPS, elapsedMs: 60_000, canvasMb: 1, heapMb: 9.25, dpr: 2 }); assert.equal(done.startsWith("DONE\n"), true); assert.equal(done.includes("heap MB peak 9.3"), true);
});
test("baseline build ships the checkpoint and no maker or editor code", () => {
  const out = mkdtempSync(join(tmpdir(), "s6d-build-")); try {
    build(out, "0".repeat(40)); const html = readFileSync(join(out, "index.html"), "utf8"); assert.equal(html.includes('src="./tools/baseline/page.js"'), true);
    const shipped = tree(out, "").filter((rel) => rel.includes("checkpoint.tileproj/")); const want = disk(DIR, "").map((rel) => `${DIR}/${rel}.js`).sort();
    assert.deepEqual(shipped.sort(), want); assert.deepEqual(tree(out, "").filter((rel) => /editor|tools\/maker|catalogue\.json/.test(rel)), []);
    const page = readFileSync(join(out, "tools/play-stage/page.js"), "utf8"); assert.equal(page.includes("__play"), false); assert.equal(page.includes("dev-only"), false);
    assert.throws(() => build(out, "0".repeat(40)), /not empty/);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
```

### `handoff/steps/tests/s6d-baseline/smoke.mjs` (new)

```js
// Step 6d phone baseline. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6d-baseline/smoke.mjs . 8808
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { dirname, extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8808"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/baseline/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s6d-smoke-")); build(join(www, "baseline-06c"), "0".repeat(40), root);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const num = (text, re) => { const m = re.exec(text); return m === null ? null : Number(m[1]); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = [], ext = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("request", (r) => { const u = r.url(); if (!(u.startsWith(origin) || u.startsWith("data:") || u.startsWith("blob:"))) ext.push(u); });
    await page.goto(`${origin}/baseline-06c/`, { waitUntil: "load" });
    await page.waitForFunction(() => { const m = /of (\d+)/.exec(document.querySelector("#read")?.textContent ?? ""); return m !== null && Number(m[1]) >= 120; }, null, { timeout: 20000 });
    const text = await page.locator("#read").innerText(), board = await page.evaluate(() => { const c = document.querySelector("#board"); return { w: c instanceof HTMLCanvasElement ? c.width : 0, h: c instanceof HTMLCanvasElement ? c.height : 0, hud: document.querySelector("#hud") !== null }; });
    check(`1 board @${width}`, board.w > 0 && board.h > 0 && board.hud, `${board.w}x${board.h}`);
    const p50 = num(text, /frame ms p50 (\d+(?:\.\d+)?) p95/), p95 = num(text, /p95 (\d+(?:\.\d+)?) max/), max = num(text, /max (\d+(?:\.\d+)?)/);
    check(`2 frames @${width}`, p50 !== null && p95 !== null && max !== null && p50 > 0 && p50 <= p95 && p95 <= max, `${p50} ${p95} ${max}`);
    const d = num(text, /dropped \(>25 ms\) (\d+)/), b = num(text, /over 50 ms (\d+)/), n = num(text, /of (\d+)/);
    check(`3 dropped @${width}`, d !== null && b !== null && n !== null && n >= 120, `${d} ${b} of ${n}`);
    const mb = num(text, /canvas MB (\d+(?:\.\d+)?)/); check(`4 canvas @${width}`, mb !== null && mb > 0, String(mb));
    const heap = /heap MB peak (n\/a|\d+(?:\.\d+)?)/.exec(text); check(`5 heap @${width}`, heap !== null, heap === null ? "missing" : heap[1]);
    check(`6 gc @${width}`, text.trimEnd().endsWith("GC: n/a (browsers don't expose it)"), "line");
    check(`7 quiet @${width}`, errs.length === 0 && ext.length === 0, errs.concat(ext).join(" | ") || "ok");
    if (width === 390) { const shot = join(root, "handback/step-06d-baseline-page/r1/01-baseline.png"); mkdirSync(dirname(shot), { recursive: true }); await page.screenshot({ path: shot, scale: "css" }); }
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```
