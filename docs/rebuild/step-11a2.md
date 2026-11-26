# Rebuild record: step 11a2, the Build game sheets ("Your game is ready" and "Couldn't build your game")

Original brief: [`docs/maker/steps/step-11a2-ready-sheet.md`](../maker/steps/step-11a2-ready-sheet.md) on the merge (r4, blob `71877346`, sha256 `10e409e05d1a11ecbda57b9ff80fa3eb16f9607de07ad7ef618b36be241cc503`, 143 lines). Test floor L11; Where 11a2 sits L15; Delivery L20; Goal L28; Read first L37; Rules L44; Build table L51; Named tests L64; Smoke L69; Must NOT L73; Done when L81; Measured L87; Baseline republish L103; Carries L106; EA rulings L118; Changes from r2 L131, from r3 L140. Count command L62; hard per-file caps L54–59; hard gate 400 at L60 (caps sum 158; trial 142). Go-line paste `docs/maker/steps/step-11a2-paste.md` (blob `46dc4e2f`, sha256 `4ac8dfe2362447b8f054daed910db67c62ea41b5a0d50bd0464ae847c7755352`, 12 lines). This is **11a2**, roadmap step 11's second slice (EA ruling 2026-11-26: the 400 gate holds; the UX sheet moves to 11a2). It retires 11a's banner interim: after Build game's download, UX's **Your game is ready** sheet (the file name, UX's web-build body, **Share** only when `navigator.canShare({ files })` is true, **Done**), and for a build error the **Couldn't build your game** sheet (the plain reason, escaped, **Try again**, **Done**). It also folds in QA's 11a carries 1–2 in `tools/export/game.ts` (`FILES` as the one module-path source; dead defaults gone; zip bytes unchanged). It is not the APK (11b), budgets (11c) or the Render bundle (step 36). Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #108 and branch `step/step-11a2-ready-sheet-r1-chatA` (r1 code head `b7f6e500`, r1 tip `826b9f78`). `handback/step-11a2-ready-sheet/r1/HANDBACK.md` at `826b9f78` and on the merge (HB, blob `649020f9`, 111 lines, sha256 `ef8647c8a88007c40ae0373314ce3233972d0b0941862dc1bea9f28f22cdd29d`). CoS verify report: `/workspace/share/step-11a2-verify/report.md` (V1, sha256 `108878388c39b2aec93f53d9f1488cf7ff5f95e943cfed0852b91033f88ba8a0`): **PASS**, no must-fix. QA docs on main: `docs/qa/step-11a2-r3-guide-review.md` (QA-G3, blob `d226b6ec`, 24 lines, sha256 `f83b43ac309b4450af12d660f6a202d61daf3afdbe529a5721682ce87a42beb2`), `docs/qa/step-11a2-r4-11b-r3-kit-review.md` (QA-K4, blob `ee0ed59d`, 44 lines, sha256 `ddab43eb2bcea66be03c082511a0994fafc0c92e2351e781293f291401c1f3a0`: OK TO SEND), `docs/qa/step-11a2-handback-review.md` on main `7875033c` (QA1, blob `948abbf2`, 37 lines, sha256 `bb3e2eaf167676c80530713ad41f95011b18d1cb3bdcb0731cd3c422c58f103c`): **OK TO MERGE**. QA postmerge on `0d683870`: PASS (tree 3b5e2172, parents 761f36a7 + 826b9f78, noreply authors, src/tests/tools diff matches the tip, pins 5/5, green 1167/0, smoke 0 failed). Line cites use HB, V1 and QA1. Product line cites are at merge `0d683870` (tree `3b5e2172`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `1b34e5418efe65b8a1ffb09c29cd58b175ef1819`, 2026-11-26 13:51 (UK time), tree `8c7efab7`, docs-only on the 11a merge `7d73c74b` (PR #107, tree `522d02cc`). Floor **1167** tests (guide L11: 11a's 1165 + N=2). The r4 guide was trialled on this base (trial commit `8c061ebd`, patch `s11a2-trial-r4.patch`). Later main gained docs only: `0d8060a3` (the 11a rebuild record, README row 30, QA's 11a2 paste review) and `761f36a7` (this guide r4, the paste and QA's r3 and r4/11b-r3 reviews) |
| Main at merge | `761f36a7ef04581b7d809cceb6fd0fbb1befd054`, 2026-11-26 15:15 (UK time), tree `fafefa6a`, docs-only on the base. This is the merge's first parent. Official 11a2 product against it, and against the base, is **142** (6 Build-table files, +127/−15) |
| r1 commits | on `step/step-11a2-ready-sheet-r1-chatA`: `b7f6e5007b7c28f6de6b07e5e1399f26a22c8c1a` feat(maker): step 11a2 ready and error sheets (r1 code head, tree `28e1aafb093f323814607d9253ed78b991e4f3f3`, 2026-11-26 16:08 UK time), `826b9f78571e4b3126dd635a828af6d28accd505` docs(handback): step 11a2 ready sheet r1 (tree `3dd9e217ab54cb01bea0e9600444ea86d41073a2`, 2026-11-26 16:09 UK time). Linear, two commits on the base `1b34e541`, no merges, no rebase. Author and committer on both `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code head is the hand-back only |
| r1 verdict | Product green **1167/0**. Official product **142** (6 files, +127/−15), every cap kept, one file on cap (`export-11a.test.ts` 4/4). tools tsc only the 3 base errors (`home.ts` L91 did not move). All 23 smokes PASS first try (HB, QA1), including s11a2 8822 r1: 6 ok at 390 and 360. Export audit PASS 135/149/149 (the builder's self-run audit per the guide's Done when, and s8-audit by CoS and QA). Must-not list clean. CoS verify PASS (V1). Predicted merge tree onto main `761f36a7`: `3b5e2172` (V1, QA1). QA **OK TO MERGE**. No rework |
| Merge | PR #108, merge commit `0d6838703be427a4401c46f5847abb35957b1e88`, 2026-11-26 16:44 (UK time). Tree `3b5e217256ae4883f1640a9c4bcfa60b1aef4351` (the tree CoS and QA predicted; `merge-pr.sh --expect-tree`). First parent `761f36a7ef04581b7d809cceb6fd0fbb1befd054`, second parent `826b9f78571e4b3126dd635a828af6d28accd505`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #108: Step 11a2: Your game is ready / Couldn't build sheets (ChatA r1)`. Green on the merge **1167 pass / 0 fail** (`merge-pr.sh` `npm test`) |
| After the merge | main is `7875033c635d430da3915d54e71144c9dd779edd`, 2026-11-26 16:45 (UK time), tree `605313b8`, which adds only `docs/qa/step-11a2-handback-review.md` (37 insertions, sha256 `bb3e2eaf`, blob `948abbf2`). QA postmerge on `0d683870`: PASS (pins 5/5, green 1167/0, smoke 0 failed) |
| Tests | 1165 + N=2 (named tests 1–2 in `tests/tools/sheet-11a2.test.ts`) = **1167 pass / 0 fail**. Floor after this merge is **1167** (HB, V1, QA1) |

## (b) Files

From `git diff --name-status 761f36a7..0d683870 -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` against the merge's first parent (the same as against the base `1b34e541` for these files). The new s11a2 smoke is counted in the 400.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tools/maker/build-sheet.ts` | M | 9 / 0 | 14 (L54) | yes. **9** (sha256 `982c7e51b0197128cdfe0a77a6f8c644ad589c1df779c5a9cfb85b8e725017a8`) |
| `tools/maker/home.ts` | M | 33 / 6 | 40 (L55) | yes. **39** (sha256 `7086d30c9de46ba097a0b25c7cde264635f522d4e3a41a50ce3d3f52b92a3c88`) |
| `tools/export/game.ts` | M | 9 / 7 | 20 (L56) | yes. **16** (sha256 `384b174e6cb9de5ceaef4d2da254bb02aa70e379359f76bf68f26b0da2df7e3e`) |
| `tests/tools/export-11a.test.ts` | M | 2 / 2 | 4 (L57) | yes. **4** on cap (sha256 `412a00d263c93327091e0c0ca3ad06e68abf8c7a3e0ef45501fa4f8bc9971c4f`) |
| `tests/tools/sheet-11a2.test.ts` | A | 15 / 0 | 20 (L58) | yes. **15** (sha256 `c23f39193095c76b787c85e9d29ae8e9f3ca64d13de2426a665a2aa2d13ac5bb`) |
| `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs` | A | 59 / 0 | 60 (L59) | yes. **59** (sha256 `21a3d99d613a77f79a273e305e99aec36f05a2204e5b88dbe85745339dafba83`) |

No diff under `src/`, `tools/play-stage/`, `tools/export/zip.ts`, `tools/maker/export.ts`, `tools/maker/app.css`, `tools/apk/`, `data/`, fixtures or the format docs. `export-11a.test.ts` changes only L61's name and L103's regex (Rule 3). No other test or smoke edited. Official count at the code head, the tip or the merge against first parent `761f36a7` is **6 files changed, 127 insertions(+), 15 deletions(-)** = 142 ≤ 400. Caps sum 158 is not a second gate. The r4 trial was also 142 (smoke 57, sheet test 16, `home.ts` 34+ 6−); ChatA's smoke is 59 and its sheet test 15. No new dependency, CSS or component; no network URL; no gh-pages; no new rAF, timer or loop.

## (c) Key code and git commands

Step 11a2 is the UX half of 11a r2's single-slice kit (EA ruling 1), re-trialled on the merged 11a (guide r3/r4). The sheet state is its own `built: BuildSheet` beside 11a's `building: BuildView`, so 11a's button code is untouched (EA ruling 3).

**Sheets (Rule 1).** `tools/maker/build-sheet.ts` (appended; `BuildView` and `buildButton` unchanged): `BuildSheet = { mode: "ready"; file; share } | { mode: "error"; reason } | null`; `esc` with literal entity strings (QA r3 nit); one `sheet(title, body, buttons)` on the scrim/sheet pattern (`data-sheet="build"`, Done last, `data-act="build:done"`); `buildSheet(null)` is `""`; ready = "Your game is ready" with UX's exact body ("Saved to Downloads as <file>. This is a web build: put it on any website host that takes HTML games, and anyone can play it in a browser. A phone app version comes in a later update."), the file escaped, **Share** (`data-act="build:share"`) only when `share` is true; error = "Couldn't build your game", the reason escaped, **Try again** (`data-act="build"`).

**Wiring (Rule 2).** `home.ts`: `buildSheet(built)` appended to L47's sheets string; `let built: BuildSheet = null;` and `let builtFile: File | null = null;` on their own lines after the `behaviourId` line (so the tools-tsc error stays at L91); `download(file: File)`; `buildNow` keeps 11a's save-stop, sets `built = null;` on its own line before the busy paint (QA r3 must-fix: a rebuild closes the open sheet), keeps the refusal path, then builds `builtFile` (type `application/zip`), downloads it and sets `built = { mode: "ready", file, share: navigator.canShare?.({ files: [builtFile] }) === true }`; the catch sets `built = { mode: "error", reason }` instead of 11a's banner line. `shareBuild`: `navigator.share` in try/catch; only an `AbortError` returns quietly; any other rejection opens the error sheet with its message, or "Couldn't share your game." when empty (EA ruling 5); no empty catch (Law 12). ChatA also throws that fallback when `navigator.share` is undefined, inside the try (declared in HB; QA1 nit: unreachable, since Share only shows when `canShare` is true, and untested). `forgetBuild` nulls `built` and `builtFile`; `closeBuild` calls it and paints. Three new run lines before the `open:` line: `if (act.startsWith("open:")) forgetBuild();` (EA ruling 7), `build:share`, `build:done`.

**Export carries (Rule 4).** `tools/export/game.ts`: `FILES` imported from `../play-stage/game.ts` and used in `markPage` and for the module entry; `filesModule` over `Object.entries`; a missing `build.json` throws `Can't build: build.json`; one sorted entries list feeds both the sums and the zip (unique keys, `<` compare, the same order as before). Zip bytes unchanged (11a tests 1–4 and s11a).

**Test re-pin (Rule 3).** `export-11a.test.ts` test 3: its name now ends "shown as the plain reason in the error sheet (11a2)", and the L103 regex pins `built = { mode: "error", reason: e instanceof Error ? e.message : "Can't build" }` in `home.ts`.

**Named tests** 1–2 in `tests/tools/sheet-11a2.test.ts` (15/20), titles exactly as the guide L65–66. **Smoke** `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs`, port 8822 r1, s10c layout; its `tap` looks inside an open scrim first because Try again and Build game share `data-act="build"` (HB § Decisions); its `hold` delays or 404s only the play `build.json`. Steps at 390 and 360: 1 ready sheet (no Share when `canShare` is false; Done closes it); 2 Share shown, a forced build error, Try again: within 1 s the sheet is gone and the disabled Building… shows, then the ready sheet; 3 share rejecting with `AbortError` shows nothing, with `NotAllowedError` the error sheet shows its reason. 6 ok.

```
# Full product diff against the merge's first parent (the accepted product measure):
#
#   git diff 761f36a7 0d683870 -- \
#     tools/maker/build-sheet.ts \
#     tools/maker/home.ts \
#     tools/export/game.ts \
#     tests/tools/export-11a.test.ts \
#     tests/tools/sheet-11a2.test.ts \
#     handoff/steps/tests/s11a2-ready-sheet/smoke.mjs
#
# The hand-back (not in the 400):
#   git show 0d683870:handback/step-11a2-ready-sheet/r1/HANDBACK.md
#
# Product gate. Official command at the r1 code head or r1 tip against
# the base 1b34e541, or at the merge against first parent 761f36a7:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   6 files changed, 127 insertions(+), 15 deletions(-)
#
# At b7f6e500 against 1b34e541: 6 files, 127 insertions, 15 deletions = 142.
# At 0d683870 against 1b34e541 the same command also lists the docs-only
# main commits 0d8060a3 and 761f36a7; add ':!docs/**' to get 142 again.
#
# Trial r4 on 1b34e541 (8c061ebd) was 6 files, 142 counted lines.
#
# Named tests (npm test 1167/0, floor 1165 + N=2):
#   ✔ 11a2 ready sheet: …
#   ✔ 11a2 error sheet: …
#
# tools tsc: only effect-designer page.ts L101 and maker home.ts L91 (×2).
#
# Smokes: the builder used chrome-headless-shell (HB § Smoke), all 23 solo, first run:
#   S0 (8797) 14, s3 (8798) 18, s4a (8799) 16, s4b (8800) 16, s4c (8801) 16,
#   s5a (8802) 16, s5b (8803) 16, s5c (8804) 16, s6a (8805) 18, s6b (8806) 16,
#   s6c (8807) 18, s6d (8808) 14, s7 (8809) 20, s8 (8810 r1) 16, s9 (8811 r1) 12,
#   s8c (8812 r1) 8, s9b (8813 r1) 14, s9c (8814 r1) 6, s10b (8815 r1) 8,
#   s10c (8816 r1) 8, s10d (8817 r1) 8, s11a (8818 r1) 6, s11a2 (8822 r1) 6 (3 @390, 3 @360).
# QA reran all 23 solo (QA1); CoS reran s11a2 and s11a solo with /usr/bin/google-chrome: 6 ok each.
#
# Mutations (HB; each restored): M16 Share always shown → test 1, smoke 1–3;
#   M17 error sheet without Try again → test 2, smoke 2; M20 ready sheet never
#   opens → smoke 2–3; M21 error sheet never opens → 11a test 3, smoke 2–3;
#   M22 share() handed no file → smoke 2–3; M23 ready text says unzip → test 1,
#   smoke 1; M24 AbortError opens the error sheet → smoke 3; M25 refused share
#   swallowed → smoke 3; M31 built = null removed → smoke 2 (3 runs of 3);
#   M28 markPage names another module → 11a gameZip, s11a; M29 module zipped
#   under another name → 11a tests, s11a.
#   Survive: M26 forgetBuild keeps the zip and M27 opening a project keeps the
#   build, by design (EA ruling 6, QA-G3, QA1); M30 a missing build.json read
#   as "" again, equivalent (the commit regex fails, the same throw; QA1).
# QA's own plants (QA1): M31, M16, M24, M25: each caught.
#
# Export audit: builder self-run (three builders) and s8-audit.mjs both
# 135 / 149 / 149, 0 hits, AUDIT PASS. 11a2 adds no play file.
```

## (d) What went wrong, in order, and the fix

The build (r1) was accepted first time; the rework was in the guide, before any build.

**Guide r2 did not fit the merged 11a.** QA's paste check (`docs/qa/step-11a2-paste-review.md`, `c6734a3c`) found r2's trial patch failed `git apply --check` on the 11a merge: ChatA's 11a uses `building` with `BuildView = "idle" | "busy"`, a `download(name, bytes)` that makes its own `File`, one-line refusal and catch blocks, and the banner pin on L103. EA re-trialled on the merge as r3 (new `built: BuildSheet`, `download(file)`, the reset in `run`, `closeBuild`/`forgetBuild`), added QA's 11a carries 1–2 (Rule 4) and the one-statement rule for all new code, and replaced the invisible s8-audit path with a self-run audit (guide L131–138).

**r3 → r4 (QA-G3 must-fix).** A rebuild left the old sheet up with Try again live. r4 adds `built = null;` on its own line before the busy paint, smoke 2's 1 s check after Try again with `build.json` delayed, and mutation M31; plus the literal-entity `esc` nit (guide L140–143). QA OK TO SEND on the r4 kit (QA-K4).

**The `build-sheet.ts` reset episode (HB § Helpers).** An early draft of ChatA's mutate script restored files with `git checkout`, which put `build-sheet.ts` back to the base; ChatA rewrote it to the reviewed source and re-ran the sheet tests before the recorded pass. QA confirmed the committed file matches Rule 1 and ran its own mutations on the committed code (QA1). Resolved; no gap.

**QA1 nit.** `shareBuild`'s `if (navigator.share === undefined) throw new Error("Couldn't share your game.");` is not in Rule 2. It is declared, not silent (Law 12 holds) and within the cap, but unreachable in practice (Share shows only when `canShare` is true) and untested.

HANDBACK's PR line was anticipatory; CoS opened PR #108 after the verify.

## (e) Do it right first time

- The work is only in the 6 Build-table files. Nothing in `src/`, `tools/play-stage`, `tools/export/zip.ts`, `tools/maker/export.ts`, `tools/maker/app.css`, `tools/apk`, data, fixtures or the format docs. In `export-11a.test.ts` only L61's name and L103's regex.
- UX's words only (title, body, Share, Done, Try again, and EA ruling 5's fallback). Share only when `canShare({ files })` is true. No "unzip" or "index.html". No empty catch: ignore only `AbortError`. No new CSS, component, dependency or network URL. No change to what Build game zips, the gate, the save-stop or the download name.
- `built = null;` on its own line before the busy paint; the open-project reset in `run`, not packed into `openId`.
- One statement per line in all new code, dense files included; never pack a new function, statement or act onto an existing line. Don't wrap, split or join to fit a cap (11a's zip.ts join is no precedent).
- Restore files in mutation runs from a snapshot, not `git checkout` against the base, and re-run the tests after the last restore.
- Run the export audit yourself per the guide's Done when and list the script in § Helpers; CoS and QA run s8-audit.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only the QA review):
#   git diff 0d683870 HEAD -- \
#     tools/maker/build-sheet.ts \
#     tools/maker/home.ts \
#     tools/export/game.ts \
#     tests/tools/export-11a.test.ts \
#     tests/tools/sheet-11a2.test.ts \
#     handoff/steps/tests/s11a2-ready-sheet/smoke.mjs
#   (empty)
#
# Product gate at the merge against first parent 761f36a7:
#   git diff --shortstat 761f36a7..0d683870 -- . ':!handback/**' ':!node_modules'
#   6 files changed, 127 insertions(+), 15 deletions(-)
#
# Green: npm ci && npm run green → 1167 pass / 0 fail.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L91 ×2).
# Smokes: all 23 solo at the guide counts (the 22 in step-11a.md plus s11a2 6).
# Export audit: 135 / 149 / 149, AUDIT PASS.
```

## QA non-blockers carried forward

- `shareBuild`'s `navigator.share === undefined` throw: declared, unreachable, untested (QA1 nit).
- The CEO phone check should include one real download in Chrome on Android (11a carry 3) and one real Share sheet, which headless runs can't show (QA1 carry 1).
- Open from 11a: `gameZip`'s regex second read of `build.json` (step 36); the save-fail stop pinned only by a source regex (QA1 carry 2).
- Open from 11b r2: `zipCommit`'s "names no commit" throw is untested (QA1 carry 3).
- s8c "no hero" @390 flake seen in earlier full runs; not seen on this verify (QA1 carry 4).
- UX question open: the error sheet's extra Done and the refused-share fallback line (guide Questions for UX).
- **Still open, not 11a2 scope** (guide L108–116): UX game name and icon (after 11b), the 11c overlay look, 11b (debug APK, bases on this merge), 11c, the WebView 98+ floor, D9 upgrade-on-save, DSK E1–E4 follow-ups, §7.2 closure (step 36). No baseline republish in 11a2; any republish needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there; the builder never publishes.
- **Closed here:** UX's ready and error sheets (11a's banner interim retired); QA 11a2 r1 must-fix (no empty catch on Share) and carries (`builtFile` let go on Done; build state forgotten when a project opens); QA r3 must-fix (`built = null` before the busy paint); QA 11a handback carries 1 (`FILES` one source) and 2 (dead defaults); QA's dense-lines note (Rule 5 wording); QA 11a carry 5 (builder-visible audit).

## Blob check

Each file must have exactly this git blob id at `0d683870`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/maker/build-sheet.ts` | `f466444496762d6932d274d52aeee79fb0e953b8` | 14 |
| `tools/maker/home.ts` | `4a5cb58bd1b463e72ad394d0c5456186b0b80f81` | 225 |
| `tools/export/game.ts` | `8720781e73558120a1b01dd55f2cce5b23fc8810` | 29 |
| `tests/tools/export-11a.test.ts` | `92f5c00557a81997e957a87868dde1a75bef9195` | 130 |
| `tests/tools/sheet-11a2.test.ts` | `029c93fe3471207bdc1ab07805cd268bf7a3d750` | 15 |
| `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs` | `e68498153aa16322e92484886f87d8cd25c4754f` | 59 |

## Appendix: full code as merged (step 11a2, PR #108)

New files are `git show 0d683870:<path>` in full. Edited files are `git diff 761f36a7 0d683870 -- <path>` (the same against the base `1b34e541`).

### `tools/maker/build-sheet.ts` (edited)

```diff
diff --git a/tools/maker/build-sheet.ts b/tools/maker/build-sheet.ts
index 454de9f..f466444 100644
--- a/tools/maker/build-sheet.ts
+++ b/tools/maker/build-sheet.ts
@@ -3,3 +3,12 @@ export function buildButton(view: BuildView): string {
   if (view === "busy") return `<button type="button" class="btn ghost stage-row" data-act="build" disabled aria-busy="true"><span class="spin"></span>Building…</button>`;
   return `<button type="button" class="btn ghost stage-row" data-act="build">Build game</button>`;
 }
+export type BuildSheet = { readonly mode: "ready"; readonly file: string; readonly share: boolean } | { readonly mode: "error"; readonly reason: string } | null;
+const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch === '"' ? "&quot;" : "&#39;");
+const sheet = (title: string, body: string, buttons: string): string => `<div class="scrim" data-sheet="build"><div class="sheet" role="dialog"><h2>${title}</h2><p>${body}</p>${buttons}<button type="button" class="btn ghost" data-act="build:done">Done</button></div></div>`;
+export function buildSheet(view: BuildSheet): string {
+  if (view === null) return "";
+  if (view.mode === "error") return sheet("Couldn't build your game", esc(view.reason), `<button type="button" class="btn" data-act="build">Try again</button>`);
+  const share = view.share ? `<button type="button" class="btn" data-act="build:share">Share</button>` : "";
+  return sheet("Your game is ready", `Saved to Downloads as ${esc(view.file)}. This is a web build: put it on any website host that takes HTML games, and anyone can play it in a browser. A phone app version comes in a later update.`, share);
+}
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 0e583b5..4a5cb58 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -3,7 +3,7 @@ import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, r
 import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
-import { buildButton, type BuildView } from "./build-sheet.ts";
+import { buildButton, buildSheet, type BuildSheet, type BuildView } from "./build-sheet.ts";
 import { buildGame, playBase } from "./export.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
 import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
@@ -44,7 +44,7 @@ function paint(): void {
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built)) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
@@ -158,11 +158,16 @@ async function run(act: string): Promise<void> {
   }
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
+  if (act.startsWith("open:")) forgetBuild();
+  if (act === "build:share") return shareBuild();
+  if (act === "build:done") return closeBuild();
   if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
   if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "build") return buildNow(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
 }
-function download(name: string, bytes: Uint8Array): void {
-  const file = new File([bytes as BlobPart], name), url = URL.createObjectURL(file), a = document.createElement("a");
+let built: BuildSheet = null;
+let builtFile: File | null = null;
+function download(file: File): void {
+  const url = URL.createObjectURL(file), a = document.createElement("a");
   a.href = url; a.download = file.name; a.click(); URL.revokeObjectURL(url);
 }
 async function buildNow(): Promise<void> {
@@ -170,14 +175,36 @@ async function buildNow(): Promise<void> {
   if (state.dirty) await saveCurrent();
   if (state.dirty) return;
   const id = state.current;
+  built = null;
   building = "busy"; state.problems = []; paint();
   try {
     const got = await buildGame(store, id, async (path) => { const res = await fetch(new URL(path, playBase(import.meta.url))); if (!res.ok) throw new Error(`Can't build: ${path}`); return res.text(); });
     if (!got.ok) { state.problems = got.lines; building = "idle"; paint(); return; }
-    download(`${id}-game.zip`, got.bytes);
-  } catch (e) { state.banner = e instanceof Error ? e.message : "Can't build"; }
+    builtFile = new File([got.bytes as BlobPart], `${id}-game.zip`, { type: "application/zip" });
+    download(builtFile);
+    built = { mode: "ready", file: builtFile.name, share: navigator.canShare?.({ files: [builtFile] }) === true };
+  } catch (e) { built = { mode: "error", reason: e instanceof Error ? e.message : "Can't build" }; }
   building = "idle"; paint();
 }
+async function shareBuild(): Promise<void> {
+  if (builtFile === null || built === null || built.mode !== "ready") return;
+  try {
+    if (navigator.share === undefined) throw new Error("Couldn't share your game.");
+    await navigator.share({ files: [builtFile], title: builtFile.name });
+  } catch (e) {
+    if (e instanceof Error && e.name === "AbortError") return;
+    built = { mode: "error", reason: e instanceof Error && e.message !== "" ? e.message : "Couldn't share your game." };
+    paint();
+  }
+}
+function forgetBuild(): void {
+  built = null;
+  builtFile = null;
+}
+function closeBuild(): void {
+  forgetBuild();
+  paint();
+}
 async function boot(): Promise<void> {
   paint();
   try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
```

### `tools/export/game.ts` (edited)

```diff
diff --git a/tools/export/game.ts b/tools/export/game.ts
index 1d4323d..8720781 100644
--- a/tools/export/game.ts
+++ b/tools/export/game.ts
@@ -1,27 +1,29 @@
+import { FILES } from "../play-stage/game.ts";
 import { zipStore } from "./zip.ts";
 export const KEEP_OUT = ["notes/", "sprite-recipes/"];
 export const shipped = (path: string): boolean => path.endsWith(".json") && !path.split("/").includes(".deleted") && !KEEP_OUT.some((pre) => path.startsWith(pre));
-export const filesModule = (text: Readonly<Record<string, string>>): string => `export default {\n${Object.keys(text).filter(shipped).sort().map((path) => `${JSON.stringify(path)}: ${text[path] ?? ""}`).join(",\n")}\n};\n`;
+export const filesModule = (text: Readonly<Record<string, string>>): string => `export default {\n${Object.entries(text).filter(([path]) => shipped(path)).sort(([a], [b]) => (a < b ? -1 : 1)).map(([path, body]) => `${JSON.stringify(path)}: ${body}`).join(",\n")}\n};\n`;
 export function markPage(html: string): string {
   if (!html.includes(`<canvas id="board">`)) throw new Error("Can't build: index.html");
-  return html.replace(`<canvas id="board">`, `<canvas id="board" data-game="project/files.js">`);
+  return html.replace(`<canvas id="board">`, `<canvas id="board" data-game="${FILES}">`);
 }
 const sha256 = async (data: Uint8Array): Promise<string> => [...new Uint8Array(await crypto.subtle.digest("SHA-256", data.slice()))].map((b) => b.toString(16).padStart(2, "0")).join("");
 export async function gameZip(play: Readonly<Record<string, string>>, text: Readonly<Record<string, string>>, assets: Readonly<Record<string, Uint8Array>>): Promise<Uint8Array> {
-  const raw = play["build.json"] ?? "";
+  const raw = play["build.json"];
+  if (raw === undefined) throw new Error("Can't build: build.json");
   const commit = /\n {2}"commit": "([0-9a-f]{40})",\n/.exec(raw)?.[1];
   const node = /\n {2}"node": "([^"\\]*)",\n/.exec(raw)?.[1];
   if (commit === undefined || node === undefined) throw new Error("Can't build: build.json");
   const enc = new TextEncoder();
   const files = new Map<string, Uint8Array>();
   for (const [name, body] of Object.entries(play)) if (name !== "build.json") files.set(name, enc.encode(name === "index.html" ? markPage(body) : body));
-  files.set("project/files.js", enc.encode(filesModule(text)));
+  files.set(FILES, enc.encode(filesModule(text)));
   for (const [name, bytes] of Object.entries(assets)) if (!name.split("/").includes(".deleted")) files.set(`project/assets/${name}`, bytes);
-  const names = [...files.keys()].sort();
+  const sorted = [...files.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
   const sums: Record<string, string> = {};
-  for (const name of names) sums[name] = await sha256(files.get(name) ?? new Uint8Array());
+  for (const [name, data] of sorted) sums[name] = await sha256(data);
   const build = `${JSON.stringify({ commit, node, entry: "index.html", files: sums }, null, 2)}\n`;
-  const entries = names.map((name) => ({ name, data: files.get(name) ?? new Uint8Array() }));
+  const entries = sorted.map(([name, data]) => ({ name, data }));
   entries.push({ name: "build.json", data: enc.encode(build) });
   return zipStore(entries);
 }
```

### `tests/tools/export-11a.test.ts` (edited)

```diff
diff --git a/tests/tools/export-11a.test.ts b/tests/tools/export-11a.test.ts
index 0e32e5c..92f5c00 100644
--- a/tests/tools/export-11a.test.ts
+++ b/tests/tools/export-11a.test.ts
@@ -58,7 +58,7 @@ test("11a gameZip: the play tree with its page naming the project module, the pr
   const meta = JSON.parse(textOf(entries.find((entry) => entry.name === "build.json")?.data ?? new Uint8Array())) as { files: Record<string, string> };
   assert.equal(entries.some((entry) => entry.name === "index.html") && entries.some((entry) => entry.name === "build.json") && entries.some((entry) => entry.name === "project/files.js") && entries.some((entry) => entry.name === "project/assets/ok.png") && !entries.some((entry) => entry.name.split("/").includes(".deleted") || entry.name.endsWith(".tmp") || entry.name.endsWith(".txt") || entry.name.startsWith("notes/") || entry.name.startsWith("sprite-recipes/")) && !js.includes("notes/") && !js.includes(".deleted") && !js.includes("scratch.tmp") && textOf(entries.find((entry) => entry.name === "index.html")?.data ?? new Uint8Array()).includes('data-game="project/files.js"') && entries.filter((entry) => entry.name !== "build.json").every((entry) => meta.files[entry.name] === createHash("sha256").update(entry.data).digest("hex")) && clean(entries) && apkOk(entries), true);
 });
-test("11a buildGame: a saved project goes through the Test gate into a zip of the play tree, the saved tree and its assets; a project Test refuses (a hard reader error, a missing picture a stage uses while openProject would still play, or an empty board) builds nothing, and a save that fails stops Build; a missing listed picture, a bad build.json or a page not under /maker/ throws Can't build, shown as the plain reason in the banner (interim until 11a2); playBase maps maker/<stamp>/ to play-stage/<stamp>/", async () => {
+test("11a buildGame: a saved project goes through the Test gate into a zip of the play tree, the saved tree and its assets; a project Test refuses (a hard reader error, a missing picture a stage uses while openProject would still play, or an empty board) builds nothing, and a save that fails stops Build; a missing listed picture, a bad build.json or a page not under /maker/ throws Can't build, shown as the plain reason in the error sheet (11a2); playBase maps maker/<stamp>/ to play-stage/<stamp>/", async () => {
   const store = memoryStore();
   await put(store, demo());
   const built = await buildGame(store, PID, get);
@@ -100,7 +100,7 @@ test("11a buildGame: a saved project goes through the Test gate into a zip of th
   assert.throws(() => playBase("http://127.0.0.1/play/ab/home.js"), /Can't build: \/maker\//);
   assert.equal(playBase("http://127.0.0.1/maker/abc123def456/tools/maker/home.js"), "http://127.0.0.1/play-stage/abc123def456/");
   const home = readFileSync("tools/maker/home.ts", "utf8");
-  assert.equal(/if \(state\.dirty\) await saveCurrent\(\);\n {2}if \(state\.dirty\) return;/.test(home) && /state\.banner = e instanceof Error \? e\.message : "Can't build"/.test(home), true);
+  assert.equal(/if \(state\.dirty\) await saveCurrent\(\);\n {2}if \(state\.dirty\) return;/.test(home) && /built = \{ mode: "error", reason: e instanceof Error \? e\.message : "Can't build" \}/.test(home), true);
 });
 test("11a play boot: Build game straight after opening ships each saved document byte for byte (a raw U+2028 and a v4 map included, nothing from notes/), and the zip's module plays the same as Test (old docs read up in memory by load/migrate.js, DSK E7)", async () => {
   const text = demo();
```

### `tests/tools/sheet-11a2.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSheet } from "../../tools/maker/build-sheet.ts";
const BODY = "Saved to Downloads as my.zip. This is a web build: put it on any website host that takes HTML games, and anyone can play it in a browser. A phone app version comes in a later update.";
test("11a2 ready sheet: names the file, says it is a web build in UX's words, shows Share only when the zip can be shared, and Done; never says unzip or index.html; no build, no sheet", () => {
  const on = buildSheet({ mode: "ready", file: "my.zip", share: true });
  const off = buildSheet({ mode: "ready", file: "my.zip", share: false });
  assert.equal(buildSheet(null), "");
  assert.equal(on.includes("Your game is ready") && on.includes(BODY) && on.includes('data-act="build:share"') && on.includes("Share") && on.includes('data-act="build:done"') && on.includes("Done") && !on.includes("unzip") && !on.includes("index.html"), true);
  assert.equal(off.includes(BODY) && !off.includes('data-act="build:share"') && !off.includes("Share") && off.includes('data-act="build:done"') && !off.includes("unzip") && !off.includes("index.html"), true);
});
test("11a2 error sheet: Couldn't build your game with the plain reason, escaped, and Try again", () => {
  const html = buildSheet({ mode: "error", reason: "Can't build: <build.json>" });
  assert.equal(html.includes("Couldn't build your game") && html.includes("Can&#39;t build: &lt;build.json&gt;") && html.includes('data-act="build">Try again') && html.includes('data-act="build:done"') && !html.includes("unzip") && !html.includes("index.html") && !html.includes("Can't build: <build.json>"), true);
});
```

### `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs` (new)

```js
// Step 11a2 ready sheet. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s11a2-ready-sheet/smoke.mjs . 8822 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8822", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s11a2-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
let hold = 0;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } const slow = path.includes("/play-stage/") && path.endsWith("/build.json"); if (slow && hold < 0) { rs.writeHead(404); rs.end("missing"); return; } try { const body = readFileSync(file); const send = () => { rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); }; if (slow && hold > 0) setTimeout(send, hold); else send(); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const scrim = document.querySelector(".scrim"); const el = (scrim ?? document).querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (scrim !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const stub = async (page, kind) => page.evaluate((kind) => { const set = (key, fn) => { try { navigator[key] = fn; } catch { Object.defineProperty(navigator, key, { configurable: true, writable: true, value: fn }); } }; if (kind === "off") set("canShare", () => false); if (kind === "on") { set("canShare", () => true); set("share", async (data) => { window.__share = data && data.files && data.files[0] ? data.files[0].name : ""; }); } if (kind === "abort") { window.__n = 0; set("canShare", () => true); set("share", async () => { window.__n += 1; throw new DOMException("dismissed", "AbortError"); }); } if (kind === "block") set("share", async () => { throw new DOMException("Sharing was blocked", "NotAllowedError"); }); }, kind);
try {
  const run = async (width) => {
    hold = 0;
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    let id = "";
    await step("1 ready", async () => {
      await page.waitForFunction(() => document.querySelector('[data-act="build"]') !== null, null, { timeout: 15000 });
      id = await page.evaluate(() => JSON.parse(window.__read()["project.json"]).project.id); await stub(page, "off");
      const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build"); const dl = await pending;
      if (dl.suggestedFilename() !== `${id}-game.zip`) throw new Error(dl.suggestedFilename());
      const sheet = await page.locator('[data-sheet="build"]').textContent();
      if (sheet === null || !sheet.includes(`Saved to Downloads as ${id}-game.zip. This is a web build`) || sheet.includes("unzip") || sheet.includes("index.html") || await page.locator('[data-act="build:share"]').count() !== 0 || await page.locator('[data-act="build:done"]').count() !== 1) throw new Error(sheet ?? "no sheet");
      await tap(page, "build:done"); await page.waitForFunction(() => document.querySelector('[data-sheet="build"]') === null, null, { timeout: 5000 });
    });
    await step("2 again", async () => {
      await stub(page, "on"); hold = -1; await tap(page, "build");
      await page.waitForFunction(() => { const s = document.querySelector('[data-sheet="build"]'); return s !== null && (s.textContent ?? "").includes("Couldn't build your game") && (s.textContent ?? "").includes("Can't build: build.json"); }, null, { timeout: 15000 });
      hold = 1500; const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build");
      await page.waitForFunction(() => { const s = document.querySelector('[data-sheet="build"]'); const b = document.querySelector('[data-act="build"]'); return s === null && b instanceof HTMLButtonElement && b.disabled && (b.textContent ?? "").includes("Building"); }, null, { timeout: 1000 });
      const dl = await pending; if (dl.suggestedFilename() !== `${id}-game.zip`) throw new Error(dl.suggestedFilename());
      await page.waitForFunction(() => document.querySelector('[data-act="build:share"]') !== null, null, { timeout: 15000 });
      await tap(page, "build:share"); await page.waitForFunction((name) => window.__share === name, `${id}-game.zip`, { timeout: 5000 });
      await tap(page, "build:done"); await page.waitForFunction(() => document.querySelector('[data-sheet="build"]') === null, null, { timeout: 5000 }); hold = 0;
    });
    await step("3 share", async () => {
      await stub(page, "abort"); const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build"); await pending;
      await page.waitForFunction(() => document.querySelector('[data-sheet="build"] h2')?.textContent === "Your game is ready", null, { timeout: 15000 });
      await tap(page, "build:share");
      await page.waitForFunction(() => (window.__n ?? 0) >= 1 && document.querySelector('[data-sheet="build"] h2')?.textContent === "Your game is ready" && !(document.querySelector('[data-sheet="build"]')?.textContent ?? "").includes("Couldn't build"), null, { timeout: 5000 });
      await stub(page, "block"); await tap(page, "build:share");
      await page.waitForFunction(() => { const s = document.querySelector('[data-sheet="build"]'); return s !== null && (s.textContent ?? "").includes("Couldn't build your game") && (s.textContent ?? "").includes("Sharing was blocked"); }, null, { timeout: 5000 });
      await tap(page, "build:done"); await page.waitForFunction(() => document.querySelector('[data-sheet="build"]') === null, null, { timeout: 5000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```
