# Rebuild record: step 3, Test opens the real play stage

Original brief: [`docs/maker/steps/step-03-test.md`](../maker/steps/step-03-test.md) r9 (blob `58c77102`, sha256 `0b8585552ffa51d0ea692f2de58d1cbe9c2c15f87d2fca0385bb138d73c2bc55`, on main `21e630e1` and at the merge). Do [`step-02.md`](step-02.md) and [`step-02b.md`](step-02b.md) first; this step starts on the 02b merge. This file records exactly what shipped.

Sources: PR #81 and branch `step/step-03-test-r1-chatA` (r1 tip `1ecea83d`, r2 tip `806e5825`, r2b tip `e9e5327d`, r2b code head `87508786`); `handback/step-03-test/r1/HANDBACK.md` at `1ecea83d` (HB1) and `handback/step-03-test/r2/HANDBACK.md` at `e9e5327d` (HB2); `docs/qa/step-03-review.md` (QA1, sha256 `e44de7a8d487fcc70a7792579680b1014bc194599aa7319e7c0ef5dd231f80d5`, blob `dbe5df6b`, 88 lines), `docs/qa/step-03-r2-review.md` (QA2, sha256 `d1dbd5e1e04f417b4c1e76378805b84d9f10a09d0d1ccaa4d87d4b3a51ce129c`, blob `8f0899c2`, 52 lines) and `docs/qa/step-03-r2b-review.md` (QA3, sha256 `b56e8b0a2d0f1c13601c58c0a88b01ba8883a8e2b60c2e11d20b8eb597179c87`, blob `d2fe0674`, 22 lines). Line numbers are at the commit named. Code line cites are at merge `b8f2b480` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `fdf29002ae7438152a1593a8529acecf6292b3f6`, the step 02b merge (PR #80). Floor **1041** tests (guide L8) |
| r1 commits | `24650f3d` feat (open Test in the real play stage; tree `1d2023e7`), `1ecea83d` hand-back (tree `a2d1c123`) |
| r1 verdict | QA **NOT OK** (QA1:9). Must-fixes 1–5: hide the maker for real, a favicon `data:` link, restore the army throw, a blocked sheet for Empty, and the tests and smoke that pin those (QA1:44-59) |
| r2 commits | on the same `-r1-chatA` branch: `ca9d603a` fix (keep a blocked Test on the project screen; code head, tree `d0f7a15e`), `806e5825` hand-back (tree `ed70eae0`) |
| r2 verdict | QA **NOT OK** (QA2:7). Product fixes 1–5 passed. Two harness items failed: s3 check 3 was flaky, and shot 03 hid Back to maker under the turn banner (QA2:9-10, :30, :38-41) |
| r2b commits | `87508786` test (wait for Attack before reading its box; code head, tree `6cfc43f4`), `e9e5327d` hand-back (tree `055a910a`). Touches only the s3 smoke (1+/1−), the retaken `03-play-back.png`, and HANDBACK.md (QA3:11) |
| r2b verdict | QA **OK TO OPEN PR** (QA3:7) |
| Merge | PR #81 "Step 3: Test plays the project", merge commit `b8f2b480cce6217c5816587feb96dcbe2360b565`, 2026-11-19 14:59 (UK time). Tree `422e62aba489568c9c7df39c75cec3436657a5ae` (the same tree QA merged against `ff65f945`; QA3:19). First parent `ff65f9452d7ebbdaf3c3d018eb0df6930e89e8b6` (step-02b rebuild, step-03 r1 and r2 QA, CEO law/roadmap and one-job-file docs after `21e630e1`), second parent `e9e5327d` |
| After the merge | main moved to `fdb7ad56786ef7720d79fad088155992e933cf99`, which only adds `docs/qa/step-03-r2b-review.md` on top of `b8f2b480` |
| Tests | 1041 + N=8 = **1049 pass / 0 fail** (QA2:33, QA3:17, HB2) |
| Size | `git diff --shortstat fdf29002..e9e5327d -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s3-test/**' ':!handback/**'` = 15 files, **266 insertions + 33 deletions = 299** ≤ 400 (guide L86; QA2:34). The s3 smoke is 129 lines, under its own cap of 130 (guide L55, L86) |
| Stamp | `node tools/maker/build.ts <out>` writes `<out>/maker/index.html`, `<out>/maker/4d2ee9e86927/` and `<out>/play-stage/4d2ee9e86927/index.html` (HB2, QA2:36). The r2b touch-up does not change the stamp |
| Smoke | S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, unchanged. Both smokes print `TOUCH SMOKE PASS` at 390 and 360 under google-chrome: S0 is 14/14; s3 is 18/18 including checks 8 (Back to maker) and 9 (Empty blocked). After r2b the s3 script passed 12 of 12 runs (QA3:13, :18; HB2) |

## (b) Files

From `git diff --name-status fdf29002..e9e5327d -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions. A raw `git diff fdf29002 b8f2b480` also shows `BUILD_GUIDE.md`; that change comes from main after the base, not from this step, and is omitted here.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `src/editor/project/test-gate.ts` | new | 23 (cap 50) | Pure: from a `readProject` report, allow or block Test, and turn each hard code into a sentence. Also maps `play: seed` and `play: army` through `playLine` |
| `tools/maker/test-launch.ts` | new | 40 (cap 40) | Save first. Parse with `project-files.ts`, gate, then `openProject`. Call `start` before pushing `?project=` / `?stage=` / `?from=`. A throw or a blocked open becomes a sheet sentence. Never call `openBundled` |
| `tools/play-stage/page.ts` | edited | 15 (8+/7−, cap 25) | Export `startMatch(docs, back)` so the maker can mount a match. The page itself still boots with `openBundled()` when `#board` is already on the page (dev and APK). Adds **Back to maker**. Must not import `tools/maker` |
| `tools/play-stage/project.ts` | edited | 20 (14+/6−, cap 10) | `openProject` takes an optional stage id. Empty looks `{ canopy: [], braziers: [] }` (R-E1). `docsToInput` is the readiness probe. `openBundled()` still applies `DEMO_LOOKS`. The army throw is restored; no hp/atk default. Over the cap because the readiness `try` replaced a one-line return (HB2) |
| `tools/maker/project.ts` | edited | 5 (3+/2−, cap 25) | Test is enabled and uses the primary style (`class="btn"`, `data-act="test"`). A blocked state is a "Can't play yet" banner, Fix, and a sheet of sentences |
| `tools/maker/home.ts` | edited | 38 (32+/6−) | Extra: clicks, save, `beginTest`, `enterPlay`, `fromUrl`. `project.ts` only paints the button. Hides `#app` only after `startMatch` returns |
| `tools/maker/build.ts` | edited | 12 (7+/5−, cap 20) | Also runs play-stage `build()` into `<out>/play-stage/<stamp>/`, same 12-hex stamp, `dev` flag passed through for the smoke |
| `tools/maker/app.css` | edited | 7 (4+/3−) | `.app[hidden] { display: none; }` so `display: flex` on `.app` cannot beat the `hidden` attribute. Drops unused `.row` / `.row .btn`. Sheet and banner layout for the blocked list |
| `tools/maker/index.html` | edited | 2 (1+/1−) | `<link rel="icon" href="data:,">` before `<title>`, so Chrome does not request `/favicon.ico` |
| `tests/editor/test-gate.test.ts` | new | 22 | A clean project is allowed; each S1 §8 hard code has a sentence; warnings do not block |
| `tests/tools/play-stage-source.test.ts` | new | 93 | R-E1 looks, Empty cannot open, Empty stays in the maker, start-throws, save-fail, unreadable, demo parity. With the gate test, 22+93=115 (cap 90); the hand-back says why (HB2) |
| `tests/tools/maker-build.test.ts` | edited | 9 (7+/2−, cap 10) | Play-stage output is in the tree; `openSaved` of a missing id shows the error and does not start |
| `tests/project/load/one-parser.test.ts` | edited | 9 (cap 15) | Existing load/play-stage scan unchanged (`ALLOW` empty). New maker scan: exactly one `JSON.parse`, in `project-files.ts`; no `formatVersion` or `kind ===`; no play-stage import of maker |
| `tests/editor/maker-law.test.ts` | edited | 2 (cap 5) | Scans `test-launch.ts` and `page.ts`. The fallback plant fails on `?? DEMO`, `?? openBundled(` or `\|\| openBundled(` |
| `tests/editor/project-home.test.ts` | edited | 2 (1+/1−) | Expects an enabled primary Test, no `--soon` |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` | new | 129 (own cap 130) | `?project=` smoke: New (Demo) → Test → seven S0 checks plus Back, then Empty is blocked. Outside the 400. r2b waits for `#attack` before reading its box |

Hand-back files under `handback/step-03-test/r1/` and `…/r2/` (HANDBACK.md and four 390×844 shots each) are on the merge tree but are excluded from this list, as they are not product. There is no `test-output.txt`. The folders use the full step id (guide L14). The r1 folder stays in history on the same `-r1-chatA` branch; QA accepted that (QA2:51, QA3:22).

## (c) Key code and git commands

Every file's full code is in the appendix at the end of this file, taken from the merge commit `b8f2b480`. To see it in git:

```
git log --oneline fdf29002..e9e5327d
git diff --stat fdf29002..e9e5327d -- . ':!handback/**' ':!docs/**'
git diff --shortstat fdf29002..e9e5327d -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s3-test/**' ':!handback/**'
git diff 806e5825..87508786          # the r2b smoke wait only
git show b8f2b480:tools/maker/test-launch.ts
```

**Test is a flow into the real play stage.** `tools/maker/project.ts:8` paints an enabled primary button, `<button type="button" class="btn" data-act="test">Test</button>`, with no `disabled` and no `--soon`. `home.ts:52` saves and launches through `launchTest`. That function (`tools/maker/test-launch.ts:33-39`) writes first; a failed save returns without calling `start` (`:35-37`). `play` (`:16-24`) parses the folder, runs `testGate`, then `openProject`. If `docs` is null it returns `fail([playLine(opened.error)])` (`:22`), a sheet sentence, not a demo. `start` runs inside a `try` (`:23`); `showUrl` runs only after it returns (`:24`).

**`enterPlay` hides the maker only after the match starts** (`tools/maker/home.ts:42-47`). It appends `#board` (`:43`), calls `startMatch` inside the `try` (`:45`), and sets `root.hidden = true` only after that returns (`:46`). On a throw it removes the canvas and rethrows (`:47`). `.app { display: flex }` would otherwise beat the `hidden` attribute; `tools/maker/app.css:2` is `.app[hidden] { display: none; }`.

**Back to maker.** `tools/play-stage/page.ts:13` exports `startMatch(docs, back?)`. When `back` is passed, `:56` prepends `#back-maker` to `#top`. The callback (`home.ts:45`) removes the canvas and the HUD, unhides `#app`, clears the query, and restores the project screen and its scroll. The page itself still boots with `openBundled()` only when `#board` is already in the document (`page.ts:59-60`, dev and APK).

**R-E1 and the readiness probe.** `openProject` (`tools/play-stage/project.ts:58-66`) is in one `try`. It passes an optional stage id to `playDocsOf` (`:31`, `:62`), sets `looks` to `{ canopy: [], braziers: [] }` (`:62`), then calls `docsToInput(docs)` (`:63`). Success returns `{ docs, error }`; an `Error` returns `{ docs: null, error: e.message }` (`:65`). `openBundled()` (`:67-70`) copies that result and puts `DEMO_LOOKS` back. Nothing invents a stage seed (`:55` still sets `host` only when `stage.seed` is a number).

**The army throw is restored.** `playDocsOf` at `:33` is `if (army === undefined) throw new Error("play: army");`, byte-equal to base `fdf29002` L33 (QA2:19). `:34` uses `must(…, "play: army")` for both knobs. There is no `army === undefined ? 1` default.

**Sheet sentences.** `src/editor/project/test-gate.ts:11-12` hold `"play: seed"` → "Stage 1 has no seed yet, so it can't be played" and `"play: army"` → "This project has no unit roster yet, so it can't be played". `playLine` (`:16`) maps those two; other text stays as written. `beginTest` (`home.ts:54`) puts save/open failures on the danger banner and play failures on `state.problems`, which `project.ts:7` renders as the Can't-play-yet sheet.

**Favicon.** `tools/maker/index.html:4` has `<link rel="icon" href="data:,">` before `<title>`. The smokes stay strict: any console error still fails check 7 (s3 `touch-smoke.mjs:106`).

**Build.** `tools/maker/build.ts:24` runs `playBuild(join(playRoot, stamp), commit, root, dev)` into `<out>/play-stage/<stamp>/`, then drops any other stamp folder (`:25`). The maker bundle includes the play-stage modules it imports; the play-stage bundle includes no maker code.

**Tests.** `tests/editor/test-gate.test.ts:7-16` allows a clean project and a warning, and checks a sentence for each S1 §8 hard code. `tests/tools/play-stage-source.test.ts:31-40` asserts zero canopy and braziers on `openProject` of the saved Demo template, `docs: null` and `play: army` on Empty, and `DEMO_LOOKS` on `openBundled()`. `:41-48` is `test-launch: Empty stays in the maker` (start is never called; the line is the roster sentence). `:49-59` is `test-launch: start throws, maker stays` (a `start` that throws `play: seed` yields the seed sentence and no URL push). `:60-68` is `test-launch: save fails, no launch`. `:72` is the unreadable project. `:79` is the demo parity golden and a byte-identical folder. `tests/project/load/one-parser.test.ts:12-15` is the unchanged load/play-stage scan (`ALLOW` is still empty at `:6`). `:16-23` is the maker scan: one `JSON.parse`, in `project-files.ts`, no `formatVersion` or `kind ===`, and no play-stage import of maker. `tests/tools/maker-build.test.ts:31-33` checks `play-stage/<stamp>/index.html` and a missing id. `tests/editor/project-home.test.ts:45` expects the enabled Test button. `tests/editor/maker-law.test.ts:31-32` plants the openBundled fallback.

**s3 smoke.** `handoff/steps/tests/s3-test/touch-smoke.mjs:31` records the Test box before launch. Check 3 (`:49-52`) waits for `#attack` to be visible (r2b) before reading its box. Check 8 (`:108-114`) uses `elementFromPoint` at that box and fails if the maker's Test is still live (`:109-110`), then taps `#back-maker` and asserts the heading is "My game" with the query cleared. Check 9 (`:116-122`) does New → Empty (`exact: true`) → Create → Test and asserts `#app` is not `display: none`, there is no `#board`, the sheet contains "no unit roster yet", and Test is still present. The script is 129 lines (`:129` is the last line).

## (d) What went wrong, in order, and the fix

1. **r1: `/favicon.ico` 404 failed the s3 smoke under google-chrome** (QA1:16, :21-23). The smoke treats any console error as a fail (`touch-smoke.mjs:106`, the same rule as S0). Chrome requests `/favicon.ico` on the first page; `index.html` named no icon. Fix in r2: `<link rel="icon" href="data:,">` on `index.html:4`. Do not add a favicon exemption to the smoke (QA1:23, QA1:46).

2. **r1: the maker was never actually hidden** (QA1:27-32). `.app { display: flex }` (`app.css:1`) overrides the `hidden` attribute, so during Demo Test the maker's Test button stayed live under the board (the builder's r1 `03-play-back.png` showed it). Tapping it mid-match started a second match: two `#board`s, two Back buttons and two drivers. After Back, an orphan `#board` stayed. Fix in r2: `app.css:2` is `.app[hidden] { display: none; }`. `enterPlay` (`home.ts:42-47`) sets `root.hidden = true` only after `startMatch` returns, and removes the canvas on a throw. s3 check 8 pins that the Test box is no longer the maker's Test button.

3. **r1: Empty-template Test threw `play: seed` after the maker was hidden** (QA1:33-37). The Empty template's Blank stage has no numeric seed and no unit-roster. `testGate` allowed it. `openProject` returned docs (see (d) 4), `enterPlay` hid the maker and appended a canvas, then `docsToInput` threw `play: seed`. The click handler painted that text on the still-hidden maker; the user saw a blank canvas with no Back, and the URL was already `?project=…&stage=stage_01JDEM…03`. CoS ruled this a no-dead-buttons blocker. Fix in r2, option (b) not (a) (QA1:39-42): do not invent a seed or a roster (templates are step 2's; a seed alone would not make Empty playable). Use `docsToInput` itself as the readiness check (`project.ts:63`). Map `play: army` and `play: seed` to sheet sentences (`test-gate.ts:11-12`, `:16`; `test-launch.ts:22-23`). Empty now stays on the project screen with "This project has no unit roster yet, so it can't be played", 0 boards, and no URL push (QA2:25).

4. **r1 Law 12: a silent hp/atk default** (QA1:38). To let `openProject(Empty)` return looks for the then-worded L87 test, r1 replaced `throw "play: army"` with `hp0/atk0 = 1` when the roster was missing. That is a silent default, and it was outside the brief's "No other change" (guide L48). Fix in r2: restore base L33–34 (`project.ts:33-34`, QA2:19). Retarget the R-E1 test to the saved Demo template for empty looks, and assert `openProject(Empty)` is `docs: null` with `play: army` (`play-stage-source.test.ts:31-35`). UX should align L87's wording in a later docs pass (QA1:55).

5. **r2: s3 check 3 was a stable-gate flake** (QA2:38-41). `FAIL 3 attack @390: no attack` (`#attack` box was null) on 3 of 17 r2 runs. Every other line, including 8 and 9, always passed. The cause was the r2 smoke, not the product: r1 product plus the favicon and CSS fixes passed 20 of 20 with the r1 smoke, and failed check 3 on 2 of 12 with the r2 smoke. It is a race on the action button after the extra pre-Test step (the turn banner). Fix in r2b: `touch-smoke.mjs:52` starts with `await page.locator("#attack").waitFor({ state: "visible", timeout: 3000 });` on the same line; the file stays 129 lines (QA2:47, QA3:12). After that, s3 passed 12 of 12 runs, 18/18 each time (QA3:13).

6. **r2: shot 03 hid Back to maker** (QA2:30). `r2/03-play-back.png` at `806e5825` was taken while the "YOUR TURN" banner covered the top bar, so Back to maker and Recentre were hidden, against HANDBACK and guide L93. A live shot 2.5 s after Test showed Back to maker 114×48 at x 8. Shots 01, 02 and 04 were byte-identical to r1 and were accepted, because r2 did not change how those screens render (QA2:29). Fix in r2b: retake `03-play-back.png` after the banner clears. Back to maker and Recentre are visible, only the "YOUR TURN" label shows, and no maker Test shows through (QA3:14).

7. **r2b was OK and merged without a rebase** (QA3:7, :19). Merge-tree of `ff65f945` and `e9e5327d` was clean at tree `422e62ab`. Green on the product is 1049/0. PR #81 merged as `b8f2b480`. The merge keeps main's docs (r9 brief, the QA reviews, the CEO law/roadmap commits), not a different brief.

## (e) Do it right first time

- Base on `fdf29002`. Floor 1041, land at 1049 (N=8). Test is a flow into the real play stage, not a second battle inside the editor. Use `openProject` / `playDocsOf`; do not write a second adapter and do not call `openBundled` when a project fails.
- `.app[hidden] { display: none; }` must sit next to `.app { display: flex }`. Hide the maker only after `startMatch` returns. On a throw, remove the canvas and keep the maker visible. Pin this with `elementFromPoint` at the Test box.
- Put `<link rel="icon" href="data:,">` on the maker page so Chrome does not 404 `/favicon.ico`. Keep the smoke strict on console errors.
- Never default a missing roster or a missing seed. `docsToInput` is the readiness probe inside `openProject`. A throw becomes `docs: null` and a sheet sentence (`play: army`, `play: seed`), and `showUrl` does not run. Empty stays in the maker.
- `openProject` returns empty looks. Only `openBundled()` applies `DEMO_LOOKS`.
- Line gate: `git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s3-test/**' ':!handback/**'` is 400 or fewer. The s3 smoke has its own cap of 130. Caps in the file table are guidance; if a file goes over, the hand-back says which and why.
- The s3 `?project=` smoke must wait for `#attack` to be visible before reading its box. Run it under google-chrome, not only headless-shell. Paste PASS lines from more than one run if a check has been flaky.
- Take shot 03 after the turn banner has cleared, so Back to maker is in the top bar. The maker's Test must not show through.
- Commit no raw `test-output.txt`. Put the `ℹ tests/pass/fail/…` summary in HANDBACK.md § Green. The last commit adds only the hand-back. The folder is `handback/step-03-test/r<N>/`.
- Run both smokes, S0 unchanged (`d528795e…`) and s3, at 390 and 360. Do not edit the kit under `handoff/steps/tests/s0-play-input/`.
- Push: author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The token environment variable must hold the real token, not placeholder text. Never print or commit it.

## (f) Rebuild check

Run on the merge `b8f2b480` (tree `422e62ab`). `main` at `fdb7ad56` is this merge plus the QA r2b review doc only. Re-run on 2026-11-19 at the merge tree: `npm run green` exit 0 with 1049 pass / 0 fail; the official shortstat is 15 files, 266 insertions and 33 deletions (299); the stamp is `4d2ee9e86927`; S0 printed 14/14 ok and `TOUCH SMOKE PASS`; s3 printed 18/18 ok (including 8 and 9) at 390 and 360 and `TOUCH SMOKE PASS` (QA2, QA3, HB2).

```
git worktree add --detach /tmp/s03 b8f2b480 && cd /tmp/s03
npm ci && npm run green           # exit 0; tests 1049, fail 0
git diff --shortstat fdf29002..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s3-test/**' ':!handback/**'
#   15 files changed, 266 insertions(+), 33 deletions(-)
wc -l handoff/steps/tests/s3-test/touch-smoke.mjs   # 129
git diff --exit-code fdf29002 HEAD -- tools/play-stage/load.ts tools/play-stage/board.ts tools/play-stage/match.ts tools/play-stage/build.ts tools/maker/tokens.css
sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
node tools/maker/build.ts /tmp/s03-out
ls /tmp/s03-out/maker/ /tmp/s03-out/play-stage/   # index.html + 4d2ee9e86927/ in both
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798
#   ok 1-9 @390, ok 1-9 @360, then TOUCH SMOKE PASS
```

Against the merge tree: on your rebuild branch, `git diff b8f2b480 HEAD -- src/editor/project/test-gate.ts tools/maker tools/play-stage tests/editor tests/tools/play-stage-source.test.ts tests/tools/maker-build.test.ts tests/project/load/one-parser.test.ts handoff/steps/tests/s3-test` must be empty. The blob table below lists the exact git blob id each file must have at `b8f2b480`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id.

## QA non-blockers carried forward

From QA1:83-88, QA2:51-52 and QA3:22. None of these blocked the PR.

1. The maker bundle ships `fixtures/demo.tileproj` (16 files) through `project.ts`'s static imports for `openBundled`. The maker never calls `openBundled`, and the plant guards that. Carry: move the bundled demo into its own play-stage module in a later step (QA1:84).
2. The step 2 carries stay open: Effect Designer code in the maker bundle, and the OPFS DOM test (QA1:85).
3. On the missing-project screen, Back goes Home but can leave `?project=` in the URL, so a reload shows the error again. Clearing the query is a good idea (QA1:86).
4. `test-launch.ts` runs `readProject` twice (the gate, then `openProject`). It is the same single parser, so this is acceptable (QA1:87).
5. Accepted: the HANDBACK "PR: opened by Chief Of Staff" boilerplate, guide L7 still saying the 02b merge sha is TBD, and the per-file cap overruns, which are explained (QA1:88).
6. `handback/step-03-test/r1/` remains on the branch. It is not product and is outside the gate (QA2:51, QA3:22).
7. Shots 01, 02 and 04 in the r2 folder are byte-identical to r1. QA accepted them, because r2 did not change how those screens render (QA2:29).

## Blob check

Each file must have exactly this git blob id at `b8f2b480`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/editor/project/test-gate.ts` | `c1719c3acd3a20e8ea8f0b326dbbd903d16a812a` | 23 |
| `tools/maker/test-launch.ts` | `53dde8345b6f3cf6d0406f9d0ad55805384d1dca` | 40 |
| `tools/play-stage/page.ts` | `7b5c4bb60d267daa05ea17c11ae7312a28489373` | 60 |
| `tools/play-stage/project.ts` | `0703ead563495622fc431d9b8bc13098d0d64451` | 72 |
| `tools/maker/project.ts` | `28c48de59650ba513db32c791824d9cc9b381be5` | 9 |
| `tools/maker/home.ts` | `785f5c86514c9d8b6f94f34e86f2b649ad90a33b` | 83 |
| `tools/maker/build.ts` | `92e09531f34c849847513e699ceb38af7305a3d0` | 36 |
| `tools/maker/app.css` | `fbe9025c26c262edeb9be089658c022500379988` | 40 |
| `tools/maker/index.html` | `d5964a8ce435e93bc64903bf5ff6acc2f21a4244` | 9 |
| `tests/editor/test-gate.test.ts` | `e2a0522739e4765075d3170aa6bc498e8d48bc6c` | 22 |
| `tests/tools/play-stage-source.test.ts` | `fac0db19fdc08fe4e17f2bf0d504b3d2cf2e5d32` | 93 |
| `tests/tools/maker-build.test.ts` | `c5c961ea59aa92ec76b3bcead09e0ffb4b3073f2` | 35 |
| `tests/project/load/one-parser.test.ts` | `e0413b087bac2c0eccb0a8ea57a972b10343ed83` | 24 |
| `tests/editor/maker-law.test.ts` | `b52891277e9555bb9d287901f537444ae09e1aa2` | 36 |
| `tests/editor/project-home.test.ts` | `8fc2aa7cd08ce3794e082c82756665228ac21ebf` | 46 |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` | `b697bc55f3f02014625e5f210ec12705758a1f51` | 129 |

## Appendix: full code as merged (step 3, PR #81)
New files are given in full. Edited files are given as the exact diff from `fdf29002` to `b8f2b480`, then in full as merged. Copy them byte for byte; the blob table checks you did.

### `src/editor/project/test-gate.ts` (new)
`````ts
import type { ReportRow } from "../../project/load/types.ts";

/** Hard codes from S1 §8, one sentence each. Warnings are not in this table. */
const SAY: Readonly<Record<string, string>> = {
  brokenRef: "Stage 1 points at a map that's missing",
  invalidValue: "One value is the wrong kind of data",
  terrainLength: "The terrain list is a different length than the map",
  formatNewer: "Made with a newer TileEngine. Open only.",
  formatOlder: "This file is from an older TileEngine and can't be played.",
  notAProject: "Can't open: project.json missing",
  "play: seed": "Stage 1 has no seed yet, so it can't be played",
  "play: army": "This project has no unit roster yet, so it can't be played",
};
export const sentence = (row: ReportRow): string => SAY[row.code] ?? `Can't play: ${row.code}`;
/** Map a play-stage throw (`play: seed`, `play: army`) onto the sheet sentence. Other text stays as written. */
export const playLine = (error: string): string => { const line = SAY[error]; if (line !== undefined) return line; return error === "" ? "Can't play this project" : error; };
export type TestGate = { readonly allowed: true } | { readonly allowed: false; readonly lines: readonly string[] };
/** Hard rows block. Warnings do not. A read-only load blocks even when the report is empty. */
export function testGate(report: readonly ReportRow[], readOnly: boolean): TestGate {
  const lines = report.filter((row) => row.severity === "hard").map(sentence);
  if (!readOnly && lines.length === 0) return { allowed: true };
  return { allowed: false, lines: lines.length > 0 ? lines : [SAY["formatNewer"] ?? "Made with a newer TileEngine. Open only."] };
}
`````

### `tools/maker/test-launch.ts` (new)
`````ts
import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { testGate, playLine } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import type { Looks } from "../play-stage/load.ts";
import { openProject, type PlayOut } from "../play-stage/project.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
export type PlayReady = PlayOut & { readonly looks: Looks };
export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
type Start = (docs: PlayReady) => void;
export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly start: Start };
const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
const showUrl = (id: string, stage: string, from: string): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}`); };
function play(input: LaunchBag, text: DocText): Launch {
  const parsed = parseProject(text);
  if (!parsed.ok) return fail([parsed.message], text, 0);
  const load = readProject(parsed.files), gate = testGate(load.report, load.readOnly), rev = storedRev(parsed.files);
  if (!gate.allowed) return fail(gate.lines, text, rev);
  const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
  if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
  try { input.start(opened.docs); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
  showUrl(input.id, stageOf(opened.docs), input.from); return { ok: true, files: text, rev };
}
/** Read a saved folder and start its stage. No demo fallback. */
export async function openSaved(input: LaunchBag): Promise<Launch> {
  const text = await readTree(input.store, prefix(input.id));
  if (Object.keys(text).length === 0) return fail([`Can't open: no project ${input.id}`], text, 0);
  return play(input, text);
}
/** Save first. A failed save does not start a match. */
export async function launchTest(input: LaunchBag & { readonly stored: DocText; readonly next: DocText; readonly rev: number; readonly now: string }): Promise<Launch> {
  const plan = planSave(input.stored, input.next, input.rev, input.now);
  if (!plan.ok) return fail([plan.message], input.stored, input.rev);
  const wrote = await commitWrites(input.store, prefix(input.id), plan.writes);
  if (!wrote.ok) return fail([wrote.message], input.stored, input.rev);
  const text = await readTree(input.store, prefix(input.id));
  return play(input, text);
}
`````

### `tools/play-stage/page.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 426456c..7b5c4bb 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -10,12 +10,10 @@ import { openBundled } from "./project.ts";
 import { createTouch } from "./touch.ts";
 import { DEV } from "./dev.ts"; // dev-only
 
+export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void): void {
 const canvas = document.querySelector("#board");
 if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
-const opened = openBundled();
-if (opened.docs === null) document.body.textContent = opened.error;
-else {
-const match = createMatch(opened.docs);
+const match = createMatch(docs);
 const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
 const cam: PlayCam = createCam(1);
 let seated = false;
@@ -37,7 +35,7 @@ const load = (id: string): Promise<OffscreenCanvas> => {
 };
 const hud = createHud({
   choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
-  restart: () => location.reload(), closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
+  restart: () => { if (back !== undefined) { driver.dispose(); back(); } else location.reload(); }, closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
 });
 const driver = createDriver({
   env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
@@ -51,9 +49,12 @@ const driver = createDriver({
 });
 const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
 for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
-const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px` }); };
+const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
 place(); addEventListener("resize", () => { place(); seated = false; });
 seat();
-if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link }); // dev-only
+if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link, __docs: docs }); // dev-only
+if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { driver.dispose(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
 driver.start();
 }
+const bootCanvas = document.querySelector("#board");
+if (bootCanvas instanceof HTMLCanvasElement) { const opened = openBundled(); if (opened.docs === null) document.body.textContent = opened.error; else startMatch(opened.docs); }
`````

As merged:

`````ts
import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createLighting, fitView } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { boardBox, fit, TILE } from "./board.ts";
import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
import { createHud } from "./hud.ts";
import { litPlan, picturesOf, sourceOf } from "./looks.ts";
import { createMatch } from "./match.ts";
import { openBundled } from "./project.ts";
import { createTouch } from "./touch.ts";
import { DEV } from "./dev.ts"; // dev-only

export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void): void {
const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const match = createMatch(docs);
const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
const cam: PlayCam = createCam(1);
let seated = false;
const dpr = (): number => devicePixelRatio || 1;
const band = (): { s: number; padX: number; padY: number; devW: number; devH: number } => {
  const ratio = dpr(), devW = canvas.clientWidth * ratio, devH = canvas.clientHeight * ratio;
  return { ...fit(devW, devH, match.world.grid.cols, match.world.grid.rows, ratio), devW, devH };
};
const seat = (): void => { const box = band(); if (canvas.clientWidth > 0) { seatCam(cam, box.s, dpr()); seated = true; } };
const env = { requestAnimationFrame: (cb: (ts: number) => void) => requestAnimationFrame(cb), cancelAnimationFrame: (id: number) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as HostEnv;
const load = (id: string): Promise<OffscreenCanvas> => {
  const px = pixels(id);
  if (px === undefined) return Promise.reject(new Error(id));
  const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
  if (g === null) return Promise.reject(new Error(id));
  const image = new ImageData(new Uint8ClampedArray(px.data), px.w, px.h);
  g.putImageData(image, 0, 0);
  return Promise.resolve(baked);
};
const hud = createHud({
  choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
  restart: () => { if (back !== undefined) { driver.dispose(); back(); } else location.reload(); }, closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
});
const driver = createDriver({
  env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
  view: () => {
    if (!seated) seat();
    const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
    if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
    hud.render(match.view());
    return { scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
  },
});
const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
place(); addEventListener("resize", () => { place(); seated = false; });
seat();
if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link, __docs: docs }); // dev-only
if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { driver.dispose(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
driver.start();
}
const bootCanvas = document.querySelector("#board");
if (bootCanvas instanceof HTMLCanvasElement) { const opened = openBundled(); if (opened.docs === null) document.body.textContent = opened.error; else startMatch(opened.docs); }
`````

### `tools/play-stage/project.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 7a0d8d4..0703ead 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -3,7 +3,7 @@ import { installOne } from "../../src/rules/behaviours/registry.ts";
 import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
 import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
 import type { CoreTileType } from "../../src/types/core-types.ts";
-import { RECIPES, type PlayDocs, type Recipe } from "./load.ts";
+import { docsToInput, RECIPES, type Looks, type PlayDocs, type Recipe } from "./load.ts";
 import { DEMO_LOOKS } from "./looks.ts";
 import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
 import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json" with { type: "json" }; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json" with { type: "json" }; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json" with { type: "json" }; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json" with { type: "json" };
@@ -55,10 +55,18 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length);
   return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes };
 }
-export function openProject(files: ProjectFiles): { docs: (PlayOut & { readonly looks: typeof DEMO_LOOKS }) | null; error: string } {
-  const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
-  if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
-  return { docs: { ...playDocsOf(load.project), looks: DEMO_LOOKS }, error };
+export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
+  try {
+    const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
+    if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
+    const looks: Looks = { canopy: [], braziers: [] }, docs = { ...playDocsOf(load.project, stageId), looks };
+    docsToInput(docs);
+    return { docs, error };
+  } catch (e) { if (!(e instanceof Error)) throw e; return { docs: null, error: e.message }; }
+}
+export function openBundled(): ReturnType<typeof openProject> {
+  const got = openProject(bundledFiles());
+  if (got.docs === null) return got;
+  return { docs: { ...got.docs, looks: DEMO_LOOKS }, error: got.error };
 }
-export const openBundled = (): ReturnType<typeof openProject> => openProject(bundledFiles());
 export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
`````

As merged:

`````ts
import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";
import { docsToInput, RECIPES, type Looks, type PlayDocs, type Recipe } from "./load.ts";
import { DEMO_LOOKS } from "./looks.ts";
import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json" with { type: "json" }; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json" with { type: "json" }; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json" with { type: "json" }; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json" with { type: "json" };
import u5 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000005.json" with { type: "json" }; import u6 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000006.json" with { type: "json" }; import u7 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000007.json" with { type: "json" };
import s1 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json" with { type: "json" }; import s2 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json" with { type: "json" }; import s3 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json" with { type: "json" }; import s4 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json" with { type: "json" }; import s5 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json" with { type: "json" };
type Obj = Record<string, unknown>;
export type PlayOut = PlayDocs & { readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[]; readonly names: Readonly<Record<string, string>>; readonly talk: Readonly<Record<string, string>> };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v), num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined), strs = (v: unknown): readonly string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const must = (v: number | undefined, why: string): number => { if (v === undefined) throw new Error(why); return v; };
function knob(setup: Obj, cat: Obj, behaviour: string, key: string): unknown {
  const answers = setup["answers"], row = isObj(answers) ? answers[key] : undefined;
  if (isObj(row) && row["source"] !== "default" && Object.hasOwn(row, "value")) return row["value"];
  const list = cat["behaviours"]; if (!Array.isArray(list)) return undefined;
  for (const b of list) if (isObj(b) && b["id"] === behaviour && Array.isArray(b["knobs"])) for (const k of b["knobs"]) if (isObj(k) && k["id"] === key) return k["default"];
  return undefined;
}
export const bundledFiles = (): ProjectFiles => ({
  "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDAM00000000000000000001.json": mapFile, "stages/stage_01JDAS00000000000000000001.json": stageFile,
  "units/unit_01JDAN00000000000000000001.json": u1, "units/unit_01JDAN00000000000000000002.json": u2, "units/unit_01JDAN00000000000000000003.json": u3, "units/unit_01JDAN00000000000000000004.json": u4, "units/unit_01JDAN00000000000000000005.json": u5, "units/unit_01JDAN00000000000000000006.json": u6, "units/unit_01JDAN00000000000000000007.json": u7,
  "setups/setup_01JDAT00000000000000000001.json": s1, "setups/setup_01JDAT00000000000000000002.json": s2, "setups/setup_01JDAT00000000000000000003.json": s3, "setups/setup_01JDAT00000000000000000004.json": s4, "setups/setup_01JDAT00000000000000000005.json": s5,
});
/** Adapter only. Document JSON is already read by readProject. */
export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
  const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
  const stage = store.stages[stageId ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
  const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
  const stepped = installOne(STEP_PATTERN, {}).out; if (stepped === null) throw new Error("play: step");
  const stats: Record<string, { hp: number; atk: number }> = {}, reach: Record<string, number> = {}, abilities: Record<string, { reach: number; damage: number; effectRef: string }[]> = {}, names: Record<string, string> = {};
  for (const [id, unit] of Object.entries(store.units)) {
    const st = isObj(unit["stats"]) ? unit["stats"] : {}, hpBag = st["unit_hp"], atkBag = st["unit_atk"], row = { hp: num(isObj(hpBag) ? hpBag["value"] : undefined) ?? hp0, atk: num(isObj(atkBag) ? atkBag["value"] : undefined) ?? atk0 };
    stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
    for (const sid of strs(unit["setupIds"])) {
      const setup = store.setups[sid]; if (setup === undefined) continue;
      if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "one-tile-straight" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
      if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
    }
  }
  const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(root["loadout"]) ? root["loadout"] : {}, chosen: string[] = [];
  for (const id of [...strs(gear["required"]), ...strs(gear["roster"])]) if (!chosen.includes(id)) chosen.push(id);
  const talk: Record<string, string> = {};
  for (const n of Array.isArray(stage["neutrals"]) ? stage["neutrals"] : []) if (isObj(n) && typeof n["unitId"] === "string") for (const sid of strs(n["setupIds"])) {
    const setup = store.setups[sid], key = `talk-${n["unitId"]}`; if (setup === undefined || setup["behaviourId"] !== "talk" || Object.hasOwn(talk, key)) continue;
    const line = knob(setup, cat, "talk", "line"); talk[key] = typeof line === "string" ? line : "";
  }
  const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
  const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length);
  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes };
}
export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
  try {
    const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
    if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
    const looks: Looks = { canopy: [], braziers: [] }, docs = { ...playDocsOf(load.project, stageId), looks };
    docsToInput(docs);
    return { docs, error };
  } catch (e) { if (!(e instanceof Error)) throw e; return { docs: null, error: e.message }; }
}
export function openBundled(): ReturnType<typeof openProject> {
  const got = openProject(bundledFiles());
  if (got.docs === null) return got;
  return { docs: { ...got.docs, looks: DEMO_LOOKS }, error: got.error };
}
export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
`````

### `tools/maker/project.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tools/maker/project.ts b/tools/maker/project.ts
index d015b69..28c48de 100644
--- a/tools/maker/project.ts
+++ b/tools/maker/project.ts
@@ -1,8 +1,9 @@
 const amp = String.fromCharCode(38);
 const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-export function projectScreen(input: { readonly name: string; readonly stages: number; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null }): string {
+export function projectScreen(input: { readonly name: string; readonly stages: number; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[] }): string {
   const reason = "Made with a newer TileEngine. Open only.";
   const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
   const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}<h2>${esc(input.name)}</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p><div class="test-wrap"><button type="button" class="btn soon" disabled style="background:var(--soon);color:var(--soon-ink)">Test</button></div></div>`;
+  const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p><div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
 }
`````

As merged:

`````ts
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export function projectScreen(input: { readonly name: string; readonly stages: number; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[] }): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
  const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p><div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
}
`````

### `tools/maker/home.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index fc9f91f..785f5c8 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -3,11 +3,13 @@ import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
+import { launchTest, openSaved, type PlayReady } from "./test-launch.ts";
+import { startMatch } from "../play-stage/page.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "trash" | "fatal"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean };
-const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, files: {}, rev: 0, dirty: false, readOnly: false };
+type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
+const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
 let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "";
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
 const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
@@ -21,8 +23,9 @@ function sheet(): string {
 function paint(): void {
   const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
+  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner }) + toast; return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems }) + toast; return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
@@ -36,11 +39,34 @@ async function rename(): Promise<void> { if (store === null || state.menu === nu
 async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
 async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
 async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
+function enterPlay(docs: PlayReady, scroll: number): void {
+  const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
+  try {
+    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; const from = new URLSearchParams(location.search).get("from"); state.screen = from === "home" || from === "trash" ? from : "project"; state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; });
+    root.hidden = true;
+  } catch (e) { canvas.remove(); throw e; }
+}
+async function beginTest(): Promise<void> {
+  if (store === null || state.current === null) return;
+  const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
+  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: "project", now: nowIso(), start: (docs) => enterPlay(docs, scroll) });
+  state.files = got.files; state.rev = got.rev;
+  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); state.banner = save ? line : null; state.problems = save ? [] : got.lines; paint(); return; }
+  state.dirty = false; state.problems = [];
+}
+async function fromUrl(): Promise<void> {
+  const params = new URLSearchParams(location.search), id = params.get("project");
+  if (id === null || store === null) return;
+  const stage = params.get("stage"), from = params.get("from") ?? "project";
+  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
+  if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
+  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = "project"; state.readOnly = false; state.dirty = false; state.problems = [];
+}
 async function run(act: string): Promise<void> {
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
-  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
+  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
   if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
-  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent();
+  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "fix") { state.problems = []; paint(); }
 }
 async function boot(): Promise<void> {
   paint();
@@ -48,7 +74,7 @@ async function boot(): Promise<void> {
   try {
     const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
     const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = await got.text(); }
-    templates = { demo, empty }; await refresh(); state.screen = "home"; paint();
+    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
   } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
 }
 document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
`````

As merged:

`````ts
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { launchTest, openSaved, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "";
const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
const rowHtml = (row: Row): string => { const open = row.error === null, tag = open ? "button" : "div"; return `<article class="card"><${tag} class="grow card-hit"${open ? ` type="button" data-act="open:${row.id}"` : ""}><span class="name">${esc(row.name)}</span><span class="sub">${esc(row.error ?? subline(row, Date.now()))}</span>${row.badge === null ? "" : `<span class="badge">${esc(row.badge)}</span>`}</${tag}><button type="button" class="btn icon" data-act="menu:${row.id}" aria-label="Project menu">⋯</button></article>`; };
function sheet(): string {
  if (state.screen === "pick") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a start</h2><button type="button" class="choice" data-act="tpl:demo" aria-pressed="${state.tpl === "demo" ? "true" : "false"}">Demo</button><button type="button" class="choice" data-act="tpl:empty" aria-pressed="${state.tpl === "empty" ? "true" : "false"}">Empty</button><button type="button" class="btn" data-act="toname">Continue</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
  if (state.screen === "menu") { const row = state.rows.find((item) => item.id === state.menu), ok = row?.error === null; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(row?.name ?? "Project")}</h2>${ok ? `<button type="button" class="btn ghost" data-act="askrename">Rename</button><button type="button" class="btn ghost" data-act="duplicate">Duplicate</button>` : ""}<button type="button" class="btn danger" data-act="delete">Delete</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`; }
  if (state.screen !== "name" && state.screen !== "rename") return "";
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
}
function paint(): void {
  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
  if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems }) + toast; return; }
  const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
  const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
  const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
  root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
}
async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; paint(); }
async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
function enterPlay(docs: PlayReady, scroll: number): void {
  const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
  try {
    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; const from = new URLSearchParams(location.search).get("from"); state.screen = from === "home" || from === "trash" ? from : "project"; state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; });
    root.hidden = true;
  } catch (e) { canvas.remove(); throw e; }
}
async function beginTest(): Promise<void> {
  if (store === null || state.current === null) return;
  const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: "project", now: nowIso(), start: (docs) => enterPlay(docs, scroll) });
  state.files = got.files; state.rev = got.rev;
  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); state.banner = save ? line : null; state.problems = save ? [] : got.lines; paint(); return; }
  state.dirty = false; state.problems = [];
}
async function fromUrl(): Promise<void> {
  const params = new URLSearchParams(location.search), id = params.get("project");
  if (id === null || store === null) return;
  const stage = params.get("stage"), from = params.get("from") ?? "project";
  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
  if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = "project"; state.readOnly = false; state.dirty = false; state.problems = [];
}
async function run(act: string): Promise<void> {
  if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
  if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "fix") { state.problems = []; paint(); }
}
async function boot(): Promise<void> {
  paint();
  try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
  try {
    const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = await got.text(); }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
document.addEventListener("input", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-name")) state.name = node.value; });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && state.screen === "project") void saveCurrent(); });
void boot();
`````

### `tools/maker/build.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tools/maker/build.ts b/tools/maker/build.ts
index 63322f0..92e0953 100644
--- a/tools/maker/build.ts
+++ b/tools/maker/build.ts
@@ -2,18 +2,18 @@ import { execFileSync } from "node:child_process";
 import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
 import { dirname, join } from "node:path";
 import { fileURLToPath } from "node:url";
-import { ROOT, refuse, release, sha, toJs } from "../play-stage/build.ts";
+import { ROOT, build as playBuild, refuse, release, sha, toJs } from "../play-stage/build.ts";
 const ENTRY = "tools/maker/home.ts";
-const collect = (root: string): Map<string, string> => {
+const collect = (root: string, dev: boolean): Map<string, string> => {
   const bag = new Map<string, string>(), seen = new Set<string>(), temps: string[] = [];
-  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, release(raw, rel), walk)); };
+  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
   const walkDir = (dir: string, rel: string): void => { for (const name of readdirSync(dir).sort()) { const path = join(dir, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(path).isDirectory()) walkDir(path, next); else { const key = `templates/${next}`; bag.set(key, readFileSync(path, "utf8")); temps.push(key); } } };
   walk(ENTRY); bag.set("tokens.css", readFileSync(join(root, "tools/maker/tokens.css"), "utf8")); bag.set("app.css", readFileSync(join(root, "tools/maker/app.css"), "utf8")); walkDir(join(root, "data/templates"), ""); bag.set("templates/files.json", `${JSON.stringify({ files: temps }, null, 2)}\n`); return bag;
 };
 /** `<out>/maker/index.html` is the only unstamped file. The stamp is 12 hex chars of the sorted path+sha list. */
-export function build(out: string, commit: string, root: string = ROOT): string {
+export function build(out: string, commit: string, root: string = ROOT, dev = false): string {
   if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha");
-  const bag = collect(root), names = [...bag.keys()].sort(), stamp = sha(names.map((name) => `${name} ${sha(bag.get(name) ?? "")}`).join("\n")).slice(0, 12);
+  const bag = collect(root, dev), names = [...bag.keys()].sort(), stamp = sha(names.map((name) => `${name} ${sha(bag.get(name) ?? "")}`).join("\n")).slice(0, 12);
   const maker = join(out, "maker"), dir = join(maker, stamp);
   if (existsSync(dir) && names.some((name) => !existsSync(join(dir, name)) || readFileSync(join(dir, name), "utf8") !== (bag.get(name) ?? ""))) throw new Error(`build: maker/${stamp} already exists with different files`);
   mkdirSync(dir, { recursive: true });
@@ -21,6 +21,8 @@ export function build(out: string, commit: string, root: string = ROOT): string
   const html = readFileSync(join(root, "tools/maker/index.html"), "utf8").replaceAll("__STAMP__", stamp);
   writeFileSync(join(maker, "index.html"), html);
   for (const name of readdirSync(maker)) if (name !== stamp && name !== "index.html") rmSync(join(maker, name), { recursive: true });
+  const playRoot = join(out, "play-stage"); playBuild(join(playRoot, stamp), commit, root, dev);
+  for (const name of readdirSync(playRoot)) if (name !== stamp) rmSync(join(playRoot, name), { recursive: true });
   const files: Record<string, string> = { "maker/index.html": sha(html) }; for (const name of names) files[`maker/${stamp}/${name}`] = sha(bag.get(name) ?? "");
   const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files }, null, 2)}\n`;
   writeFileSync(join(out, "build.json"), body); return body;
`````

As merged:

`````ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, build as playBuild, refuse, release, sha, toJs } from "../play-stage/build.ts";
const ENTRY = "tools/maker/home.ts";
const collect = (root: string, dev: boolean): Map<string, string> => {
  const bag = new Map<string, string>(), seen = new Set<string>(), temps: string[] = [];
  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
  const walkDir = (dir: string, rel: string): void => { for (const name of readdirSync(dir).sort()) { const path = join(dir, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(path).isDirectory()) walkDir(path, next); else { const key = `templates/${next}`; bag.set(key, readFileSync(path, "utf8")); temps.push(key); } } };
  walk(ENTRY); bag.set("tokens.css", readFileSync(join(root, "tools/maker/tokens.css"), "utf8")); bag.set("app.css", readFileSync(join(root, "tools/maker/app.css"), "utf8")); walkDir(join(root, "data/templates"), ""); bag.set("templates/files.json", `${JSON.stringify({ files: temps }, null, 2)}\n`); return bag;
};
/** `<out>/maker/index.html` is the only unstamped file. The stamp is 12 hex chars of the sorted path+sha list. */
export function build(out: string, commit: string, root: string = ROOT, dev = false): string {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha");
  const bag = collect(root, dev), names = [...bag.keys()].sort(), stamp = sha(names.map((name) => `${name} ${sha(bag.get(name) ?? "")}`).join("\n")).slice(0, 12);
  const maker = join(out, "maker"), dir = join(maker, stamp);
  if (existsSync(dir) && names.some((name) => !existsSync(join(dir, name)) || readFileSync(join(dir, name), "utf8") !== (bag.get(name) ?? ""))) throw new Error(`build: maker/${stamp} already exists with different files`);
  mkdirSync(dir, { recursive: true });
  for (const name of names) { const dest = join(dir, name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, bag.get(name) ?? ""); }
  const html = readFileSync(join(root, "tools/maker/index.html"), "utf8").replaceAll("__STAMP__", stamp);
  writeFileSync(join(maker, "index.html"), html);
  for (const name of readdirSync(maker)) if (name !== stamp && name !== "index.html") rmSync(join(maker, name), { recursive: true });
  const playRoot = join(out, "play-stage"); playBuild(join(playRoot, stamp), commit, root, dev);
  for (const name of readdirSync(playRoot)) if (name !== stamp) rmSync(join(playRoot, name), { recursive: true });
  const files: Record<string, string> = { "maker/index.html": sha(html) }; for (const name of names) files[`maker/${stamp}/${name}`] = sha(bag.get(name) ?? "");
  const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files }, null, 2)}\n`;
  writeFileSync(join(out, "build.json"), body); return body;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2], asked = process.argv[3];
  if (out === undefined) { console.error("usage: node tools/maker/build.ts <out folder> [commit, which must be HEAD]"); process.exit(1); }
  const head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", cwd: ROOT })).trim(), dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8", cwd: ROOT })), why = refuse(head, asked, dirty);
  if (why !== null) { console.error(why); process.exit(1); }
  build(out, asked ?? head);
}
`````

### `tools/maker/app.css` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index f934171..fbe9025 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -1,4 +1,5 @@
 .app { height: 100dvh; min-height: 100dvh; background: var(--bg); color: var(--ink); display: flex; flex-direction: column; }
+.app[hidden] { display: none; }
 .topbar { min-height: var(--header-h); display: flex; align-items: center; gap: 8px; padding: 10px 16px 8px; background: var(--surface); border-bottom: 1px solid var(--line); }
 .topbar h1 { flex: 1; margin: 0; font-size: 1.05rem; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
 .body { flex: 1; min-height: 0; overflow: auto; padding: 16px 16px calc(20px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 12px; }
@@ -15,7 +16,7 @@
 .btn.danger { background: var(--danger-soft); color: var(--danger); border-color: var(--danger-line); }
 .btn.icon { width: 48px; padding: 0; background: var(--surface); border-color: var(--line); color: var(--ink); }
 .badge { display: inline-flex; padding: 3px 9px; border-radius: 999px; border: 1.5px solid var(--warn-line); background: var(--warn-soft); color: var(--warn); font-size: 0.78rem; font-weight: 800; }
-.banner { margin: 0; padding: 12px; border-radius: var(--radius); background: var(--warn-soft); border: 1px solid var(--warn-line); color: var(--warn); font-weight: 700; }
+.banner { margin: 0; padding: 12px; border-radius: var(--radius); background: var(--warn-soft); border: 1px solid var(--warn-line); color: var(--warn); font-weight: 700; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
 .banner.bad { background: var(--danger-soft); border-color: var(--danger-line); color: var(--danger); }
 .toast { position: fixed; left: 16px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 14px; background: var(--ink); color: var(--bg); font-weight: 650; }
 .toast .btn { background: transparent; color: var(--bg); border-color: transparent; }
@@ -26,8 +27,8 @@ input.name-field { min-height: 48px; border: 2px solid var(--line); border-radiu
 .test-wrap { margin-top: auto; padding-top: 24px; }
 .test-wrap .btn { width: 100%; min-height: 56px; }
 .dot { display: inline-block; width: 8px; height: 8px; margin-left: 6px; border-radius: 999px; background: var(--accent); }
-.row { display: flex; gap: 8px; }
-.row .btn { flex: 1; }
+.project .sheet { position: static; width: auto; max-height: none; box-shadow: none; padding: 0; border-radius: 0; background: transparent; }
+.project .sheet p { margin: 0; }
 :focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
 @media (min-width: 421px) {
   body { min-height: 100dvh; display: grid; place-items: center; }
`````

As merged:

`````css
.app { height: 100dvh; min-height: 100dvh; background: var(--bg); color: var(--ink); display: flex; flex-direction: column; }
.app[hidden] { display: none; }
.topbar { min-height: var(--header-h); display: flex; align-items: center; gap: 8px; padding: 10px 16px 8px; background: var(--surface); border-bottom: 1px solid var(--line); }
.topbar h1 { flex: 1; margin: 0; font-size: 1.05rem; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.body { flex: 1; min-height: 0; overflow: auto; padding: 16px 16px calc(20px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 12px; }
.card, .choice { display: flex; align-items: center; gap: 10px; min-height: 72px; padding: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); text-align: left; color: var(--ink); }
.card-hit { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 4px; flex: 1; min-height: 48px; background: transparent; color: var(--ink); border: 0; box-shadow: none; padding: 0; text-align: left; }
.card.new, .choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }
.card .grow, .choice { flex: 1; }
.card .grow { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.name { font-weight: 700; font-size: 16px; }
.sub, .hint { margin: 0; color: var(--muted); font-size: 0.82rem; line-height: 1.4; }
.btn { min-height: 48px; min-width: 48px; border-radius: 14px; border: 2px solid transparent; padding: 0 14px; font-weight: 700; background: var(--accent); color: var(--accent-ink); }
.btn.ghost { background: var(--surface); border-color: var(--line); color: var(--ink); }
.btn.soon, .btn:disabled { background: var(--soon); color: var(--soon-ink); border-color: transparent; }
.btn.danger { background: var(--danger-soft); color: var(--danger); border-color: var(--danger-line); }
.btn.icon { width: 48px; padding: 0; background: var(--surface); border-color: var(--line); color: var(--ink); }
.badge { display: inline-flex; padding: 3px 9px; border-radius: 999px; border: 1.5px solid var(--warn-line); background: var(--warn-soft); color: var(--warn); font-size: 0.78rem; font-weight: 800; }
.banner { margin: 0; padding: 12px; border-radius: var(--radius); background: var(--warn-soft); border: 1px solid var(--warn-line); color: var(--warn); font-weight: 700; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.banner.bad { background: var(--danger-soft); border-color: var(--danger-line); color: var(--danger); }
.toast { position: fixed; left: 16px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 14px; background: var(--ink); color: var(--bg); font-weight: 650; }
.toast .btn { background: transparent; color: var(--bg); border-color: transparent; }
.scrim { position: fixed; inset: 0; background: var(--scrim); display: flex; align-items: flex-end; justify-content: center; }
.sheet { width: min(390px, 100%); max-height: 85vh; overflow: auto; background: var(--surface); color: var(--ink); border-radius: 16px 16px 12px 12px; box-shadow: var(--sheet-shadow); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.sheet h2, .project h2 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
input.name-field { min-height: 48px; border: 2px solid var(--line); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--ink); }
.test-wrap { margin-top: auto; padding-top: 24px; }
.test-wrap .btn { width: 100%; min-height: 56px; }
.dot { display: inline-block; width: 8px; height: 8px; margin-left: 6px; border-radius: 999px; background: var(--accent); }
.project .sheet { position: static; width: auto; max-height: none; box-shadow: none; padding: 0; border-radius: 0; background: transparent; }
.project .sheet p { margin: 0; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
@media (min-width: 421px) {
  body { min-height: 100dvh; display: grid; place-items: center; }
  .app { width: 390px; height: 844px; min-height: 0; border-radius: 28px; overflow: hidden; box-shadow: var(--frame-shadow); }
  .toast { position: absolute; }
}
@media (max-width: 420px) {
  .app { border-radius: 0; height: 100dvh; }
}
`````

### `tools/maker/index.html` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tools/maker/index.html b/tools/maker/index.html
index 0dd5003..d5964a8 100644
--- a/tools/maker/index.html
+++ b/tools/maker/index.html
@@ -1,7 +1,7 @@
 <!doctype html>
 <html lang="en" data-theme="light">
 <head>
-<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>My games</title>
+<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><link rel="icon" href="data:,"><title>My games</title>
 <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0">
 <link rel="stylesheet" href="./__STAMP__/tokens.css"><link rel="stylesheet" href="./__STAMP__/app.css"><script type="module" src="./__STAMP__/tools/maker/home.js"></script>
 </head>
`````

As merged:

`````html
<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><link rel="icon" href="data:,"><title>My games</title>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0">
<link rel="stylesheet" href="./__STAMP__/tokens.css"><link rel="stylesheet" href="./__STAMP__/app.css"><script type="module" src="./__STAMP__/tools/maker/home.js"></script>
</head>
<body><div id="app" class="app"></div></body>
</html>
`````

### `tests/editor/test-gate.test.ts` (new)
`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { sentence, testGate } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import { loadFixture } from "../tools/demo-fixture.ts";
const HARD = ["brokenRef", "invalidValue", "terrainLength", "formatNewer", "formatOlder", "notAProject"] as const;
test("a clean project is allowed and each hard code has its sentence", () => {
  const load = readProject(loadFixture());
  assert.equal(testGate(load.report, load.readOnly).allowed, true);
  assert.equal(testGate([{ code: "outOfRange", severity: "warning", path: "x" }], false).allowed, true);
  for (const code of HARD) {
    const row = { code, severity: "hard" as const, path: code === "brokenRef" ? "stages/stage.json#/mapRef" : "project.json" };
    const gate = testGate([row], false);
    assert.equal(gate.allowed, false); if (gate.allowed) return;
    assert.equal(gate.lines[0], sentence(row)); assert.equal(gate.lines[0]?.includes(code), false);
  }
  const manifest = loadFixture()["project.json"];
  if (typeof manifest !== "object" || manifest === null) throw new Error("project");
  const newer = readProject({ ...loadFixture(), "project.json": { ...manifest, formatVersion: 7 } });
  const refused = testGate(newer.report, newer.readOnly);
  assert.equal(refused.allowed, false); if (!refused.allowed) assert.match(refused.lines[0] ?? "", /newer TileEngine/);
});
`````

### `tests/tools/play-stage-source.test.ts` (new)
`````ts
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { WIN_CONDITION, wipeRule } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createWorld, runMatch, snapshot } from "../../src/sim/index.ts";
import { projectScreen } from "../../tools/maker/project.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { launchTest, openSaved } from "../../tools/maker/test-launch.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { DEMO_LOOKS } from "../../tools/play-stage/looks.ts";
import { openBundled, openProject } from "../../tools/play-stage/project.ts";
import { loadFixture } from "./demo-fixture.ts";
const NOW = "2026-11-19T00:00:00.000Z";
const root = fileURLToPath(new URL("../..", import.meta.url));
const sha = (v: unknown): string => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const slug = (text: string): string => text.replaceAll("unit_01JDAN00000000000000000001", "knight").replaceAll("unit_01JDAN00000000000000000002", "archer").replaceAll("unit_01JDAN00000000000000000003", "cleric").replaceAll("unit_01JDAN00000000000000000004", "wolf").replaceAll("unit_01JDAN00000000000000000005", "villager").replaceAll("unit_01JDAN00000000000000000006", "crate").replaceAll("unit_01JDAN00000000000000000007", "merchant");
function readDir(rel: string): Record<string, string> {
  const out: Record<string, string> = {}, walk = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, next); else out[next] = readFileSync(path, "utf8"); } };
  walk(join(root, rel), ""); return out;
}
function readJson(rel: string): Record<string, unknown> {
  return Object.fromEntries(Object.entries(readDir(rel)).map(([path, text]) => [path, JSON.parse(text) as unknown]));
}
test("openProject on a saved demo has no demo dressing and Empty cannot open", () => {
  const saved = openProject(readJson("data/templates/demo.tileproj"));
  assert.equal(saved.docs?.looks.canopy.length, 0); assert.equal(saved.docs?.looks.braziers.length, 0);
  const empty = openProject(readJson("data/templates/empty.tileproj"));
  assert.equal(empty.docs, null); assert.equal(empty.error, "play: army");
  const demo = openBundled();
  assert.deepEqual(demo.docs?.looks.canopy, DEMO_LOOKS.canopy); assert.deepEqual(demo.docs?.looks.braziers, DEMO_LOOKS.braziers);
  const staged = openProject(loadFixture(), "stage_01JDAS00000000000000000001");
  const stage = staged.docs?.stage; assert.equal(typeof stage === "object" && stage !== null && "id" in stage && stage.id, "stage_01JDAS00000000000000000001");
});
test("test-launch: Empty stays in the maker", async () => {
  const id = "project_01JDEM00000000000000000001", store = memoryStore(), stored = readDir("data/templates/empty.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  let started = false;
  const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(readJson("data/templates/empty.tileproj")), from: "project", now: NOW, start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.equal(got.lines[0], "This project has no unit roster yet, so it can't be played");
});
test("test-launch: start throws, maker stays", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const pushed: string[] = [], loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }, prev = loc.history;
  loc.history = { pushState(_state, _title, url) { pushed.push(url); } };
  try {
    const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(readJson("data/templates/demo.tileproj")), from: "project", now: NOW, start() { throw new Error("play: seed"); } });
    assert.equal(got.ok, false); if (got.ok) return;
    assert.equal(got.lines[0], "Stage 1 has no seed yet, so it can't be played"); assert.deepEqual(pushed, []);
  } finally { if (prev === undefined) delete loc.history; else loc.history = prev; }
});
test("test-launch: save fails, no launch", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const next = { ...stored, "project.json": stored["project.json"]?.replace("\"name\": \"Demo\"", "\"name\": \"Demo 2\"") ?? "" };
  store.failOn(`${prefix(id)}project.json.tmp`);
  let started = false;
  const got = await launchTest({ store, id, stored, next, rev: storedRev(readJson("data/templates/demo.tileproj")), from: "project", now: NOW, start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.match(got.lines[0] ?? "", /Couldn't save/); assert.equal(store.files.get(`${prefix(id)}project.json`), stored["project.json"]);
  const html = projectScreen({ name: "Demo", stages: 1, dirty: true, readOnly: false, banner: got.lines[0] ?? null, problems: [] });
  assert.match(html, /Couldn(?:'|&#39;)t save/); assert.match(html, /data-act="test"/); assert.equal(html.includes("openBundled"), false);
});
test("an unreadable project shows the error and does not launch the demo", async () => {
  const store = memoryStore(); await store.write(`${prefix("bad")}project.json`, "{");
  let started = false;
  const got = await openSaved({ store, id: "bad", from: "project", start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.match(got.lines[0] ?? "", /Can't open/); assert.equal(got.lines.join(" ").includes("knight"), false);
});
test("Test on the demo template matches the parity golden and leaves the folder byte-identical", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const before = [...store.files.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  const got = await launchTest({ store, id, stored, next: stored, rev: 1, from: "project", now: NOW, start(docs) {
    const input = docsToInput(docs).input, win = installOne(WIN_CONDITION, {}).out, budget = installOne(ACTION_BUDGET, {}).out;
    if (win === null || budget === null) throw new Error("parity: rules");
    const world = createWorld(input);
    const result = runMatch(world, { sides: ["player", "wolves"], ai: botAbilityPriority({ actionsPerTurn: budget.actionsPerTurn, setup: docs.rules }), victory: wipeRule(win, ["player", "wolves"]), fuse: "off", maxRounds: 80, maxSimMs: 100000 });
    const hash = { outcome: result.outcome, snapshot: sha(JSON.parse(slug(JSON.stringify(snapshot(world))))), log: sha(slug(world.log.toJSON())), bus: sha(JSON.parse(slug(JSON.stringify(world.bus.history())))) };
    assert.deepEqual(hash, JSON.parse(readFileSync(new URL("./golden/demo-parity.json", import.meta.url), "utf8")) as unknown);
  } });
  assert.equal(got.ok, true);
  assert.deepEqual([...store.files.entries()].sort(([a], [b]) => (a < b ? -1 : 1)), before);
});
`````

### `tests/tools/maker-build.test.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tests/tools/maker-build.test.ts b/tests/tools/maker-build.test.ts
index 29878ea..c5c961e 100644
--- a/tests/tools/maker-build.test.ts
+++ b/tests/tools/maker-build.test.ts
@@ -4,10 +4,12 @@ import { tmpdir } from "node:os";
 import { dirname, join, relative } from "node:path";
 import { test } from "node:test";
 import { build } from "../../tools/maker/build.ts";
+import { openSaved } from "../../tools/maker/test-launch.ts";
+import { memoryStore } from "../../tools/maker/store.ts";
 import { ROOT } from "../../tools/play-stage/build.ts";
 const SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
 const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; });
-test("maker build stamps, refuses a collision, drops stale folders, and audits the output", () => {
+test("maker build stamps, refuses a collision, drops stale folders, and audits the output", async () => {
   const out = mkdtempSync(join(tmpdir(), "maker-")), out2 = mkdtempSync(join(tmpdir(), "maker-"));
   build(out, SHA); build(out2, SHA);
   const maker = join(out, "maker"), stamp = readdirSync(maker).find((name) => name !== "index.html") ?? "";
@@ -20,11 +22,14 @@ test("maker build stamps, refuses a collision, drops stale folders, and audits t
   const temps = walk(join(maker, stamp, "templates")).map((path) => relative(join(maker, stamp), path).replaceAll("\\", "/")).filter((path) => path !== "templates/files.json").sort();
   assert.deepEqual([...listed.files].sort(), temps);
   for (const file of walk(join(maker, stamp))) { const rel = relative(join(maker, stamp), file).replaceAll("\\", "/"), text = readFileSync(file, "utf8"); assert.equal(rel.endsWith(".ts") || rel.endsWith(".map") || rel.includes("ui-shell") || rel.endsWith("dev.js"), false); if (/\.(js|css|html)$/.test(rel)) assert.equal(/\/\/ dev-only|\bDEV\b|sourceMappingURL|window\.__/.test(text), false); if (rel.endsWith(".js")) for (const spec of text.matchAll(/(?:from|import)\s+"(\.[^"]+)"/g)) assert.equal(statSync(join(dirname(file), spec[1] ?? "")).isFile(), true); }
-  const src = mkdtempSync(join(tmpdir(), "maker-src-")); for (const dir of ["src", "tools", "data"]) cpSync(join(ROOT, dir), join(src, dir), { recursive: true });
+  const src = mkdtempSync(join(tmpdir(), "maker-src-")); for (const dir of ["src", "tools", "data", "fixtures"]) cpSync(join(ROOT, dir), join(src, dir), { recursive: true });
   const proj = join(src, "data/templates/empty.tileproj/project.json"); writeFileSync(proj, readFileSync(proj, "utf8") + "\n");
   const out3 = mkdtempSync(join(tmpdir(), "maker-")); build(out3, SHA, src); const next = readdirSync(join(out3, "maker")).find((name) => name !== "index.html");
   assert.notEqual(next, stamp); writeFileSync(join(maker, stamp, "tokens.css"), "changed"); assert.throws(() => build(out, SHA), /different files/);
   build(out, SHA, src); assert.deepEqual(readdirSync(maker).filter((name) => name !== "index.html"), [next]);
   assert.match(readFileSync(join(ROOT, "tools/maker/home.ts"), "utf8"), /This browser can't save projects here\. Open the app from its web address\./);
+  assert.equal(statSync(join(out, "play-stage", next ?? "", "index.html")).isFile(), true);
+  let started = false; const missing = await openSaved({ store: memoryStore(), id: "missing", from: "project", start() { started = true; } });
+  assert.equal(started, false); assert.equal(missing.ok, false); if (!missing.ok) assert.match(missing.lines.join("\n"), /no project missing/);
   for (const dir of [out, out2, out3, src]) rmSync(dir, { recursive: true });
 });
`````

As merged:

`````ts
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { test } from "node:test";
import { build } from "../../tools/maker/build.ts";
import { openSaved } from "../../tools/maker/test-launch.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { ROOT } from "../../tools/play-stage/build.ts";
const SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; });
test("maker build stamps, refuses a collision, drops stale folders, and audits the output", async () => {
  const out = mkdtempSync(join(tmpdir(), "maker-")), out2 = mkdtempSync(join(tmpdir(), "maker-"));
  build(out, SHA); build(out2, SHA);
  const maker = join(out, "maker"), stamp = readdirSync(maker).find((name) => name !== "index.html") ?? "";
  assert.equal(readdirSync(maker).filter((name) => name !== "index.html").length, 1); assert.match(stamp, /^[0-9a-f]{12}$/);
  assert.equal(readdirSync(join(out2, "maker")).find((name) => name !== "index.html"), stamp); assert.equal(statSync(join(out, "build.json")).isFile(), true);
  const html = readFileSync(join(maker, "index.html"), "utf8");
  for (const meta of ["no-cache, no-store, must-revalidate", 'Pragma" content="no-cache"', 'Expires" content="0"']) assert.ok(html.includes(meta));
  for (const ref of html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)) assert.equal(statSync(join(maker, ref[1] ?? "")).isFile(), true);
  const listed = JSON.parse(readFileSync(join(maker, stamp, "templates/files.json"), "utf8")) as { files: string[] };
  const temps = walk(join(maker, stamp, "templates")).map((path) => relative(join(maker, stamp), path).replaceAll("\\", "/")).filter((path) => path !== "templates/files.json").sort();
  assert.deepEqual([...listed.files].sort(), temps);
  for (const file of walk(join(maker, stamp))) { const rel = relative(join(maker, stamp), file).replaceAll("\\", "/"), text = readFileSync(file, "utf8"); assert.equal(rel.endsWith(".ts") || rel.endsWith(".map") || rel.includes("ui-shell") || rel.endsWith("dev.js"), false); if (/\.(js|css|html)$/.test(rel)) assert.equal(/\/\/ dev-only|\bDEV\b|sourceMappingURL|window\.__/.test(text), false); if (rel.endsWith(".js")) for (const spec of text.matchAll(/(?:from|import)\s+"(\.[^"]+)"/g)) assert.equal(statSync(join(dirname(file), spec[1] ?? "")).isFile(), true); }
  const src = mkdtempSync(join(tmpdir(), "maker-src-")); for (const dir of ["src", "tools", "data", "fixtures"]) cpSync(join(ROOT, dir), join(src, dir), { recursive: true });
  const proj = join(src, "data/templates/empty.tileproj/project.json"); writeFileSync(proj, readFileSync(proj, "utf8") + "\n");
  const out3 = mkdtempSync(join(tmpdir(), "maker-")); build(out3, SHA, src); const next = readdirSync(join(out3, "maker")).find((name) => name !== "index.html");
  assert.notEqual(next, stamp); writeFileSync(join(maker, stamp, "tokens.css"), "changed"); assert.throws(() => build(out, SHA), /different files/);
  build(out, SHA, src); assert.deepEqual(readdirSync(maker).filter((name) => name !== "index.html"), [next]);
  assert.match(readFileSync(join(ROOT, "tools/maker/home.ts"), "utf8"), /This browser can't save projects here\. Open the app from its web address\./);
  assert.equal(statSync(join(out, "play-stage", next ?? "", "index.html")).isFile(), true);
  let started = false; const missing = await openSaved({ store: memoryStore(), id: "missing", from: "project", start() { started = true; } });
  assert.equal(started, false); assert.equal(missing.ok, false); if (!missing.ok) assert.match(missing.lines.join("\n"), /no project missing/);
  for (const dir of [out, out2, out3, src]) rmSync(dir, { recursive: true });
});
`````

### `tests/project/load/one-parser.test.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tests/project/load/one-parser.test.ts b/tests/project/load/one-parser.test.ts
index bdf6dfb..e0413b0 100644
--- a/tests/project/load/one-parser.test.ts
+++ b/tests/project/load/one-parser.test.ts
@@ -13,3 +13,12 @@ test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion
   assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
   assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !ALLOW.includes(hit)), []);
 });
+test("P2 maker: one JSON.parse in project-files.ts, no formatVersion or kind ===, and play-stage does not import maker", () => {
+  const names = readdirSync("tools/maker").filter((name) => name.endsWith(".ts"));
+  const lines = names.flatMap((name) => readFileSync(join("tools/maker", name), "utf8").split("\n").map((line) => `${name}\t${line}`));
+  const parses = lines.filter((line) => line.includes("JSON.parse"));
+  assert.equal(parses.length, 1); assert.match(parses[0] ?? "", /^project-files\.ts/);
+  assert.deepEqual(lines.filter((line) => /formatVersion|kind === /.test(line)), []);
+  const imported = readdirSync("tools/play-stage").filter((name) => name.endsWith(".ts") && /tools\/maker|\.\.\/maker\//.test(readFileSync(join("tools/play-stage", name), "utf8")));
+  assert.deepEqual(imported, []);
+});
`````

As merged:

`````ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
const RE = /JSON\.parse|formatVersion|(?<!action\??\.)kind === (?!"(?:spell|talk)")/;
const ALLOW: readonly string[] = [];
function hits(dir: string, skip: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) for (const line of readFileSync(join(dir, name), "utf8").split("\n")) if (RE.test(line)) out.push(name + "\t" + line);
  return out;
}
test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===", () => {
  assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !ALLOW.includes(hit)), []);
});
test("P2 maker: one JSON.parse in project-files.ts, no formatVersion or kind ===, and play-stage does not import maker", () => {
  const names = readdirSync("tools/maker").filter((name) => name.endsWith(".ts"));
  const lines = names.flatMap((name) => readFileSync(join("tools/maker", name), "utf8").split("\n").map((line) => `${name}\t${line}`));
  const parses = lines.filter((line) => line.includes("JSON.parse"));
  assert.equal(parses.length, 1); assert.match(parses[0] ?? "", /^project-files\.ts/);
  assert.deepEqual(lines.filter((line) => /formatVersion|kind === /.test(line)), []);
  const imported = readdirSync("tools/play-stage").filter((name) => name.endsWith(".ts") && /tools\/maker|\.\.\/maker\//.test(readFileSync(join("tools/play-stage", name), "utf8")));
  assert.deepEqual(imported, []);
});
`````

### `tests/editor/maker-law.test.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tests/editor/maker-law.test.ts b/tests/editor/maker-law.test.ts
index 98f2ff4..b528912 100644
--- a/tests/editor/maker-law.test.ts
+++ b/tests/editor/maker-law.test.ts
@@ -28,6 +28,8 @@ test("maker law holds, tokens match, and each plant fails", () => {
   for (const token of LIGHT) assert.ok(css.slice(0, darkAt).includes(token), token);
   for (const token of DARK) assert.ok(css.slice(darkAt, mediaAt).includes(token) && css.slice(mediaAt, bodyAt).includes(token), token);
   assert.match(css, /button, input \{ font: inherit; \}/);
+  const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
+  assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
   const dir = mkdtempSync(join(tmpdir(), "law-"));
   for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
   rmSync(dir, { recursive: true });
`````

As merged:

`````ts
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../..", import.meta.url));
const files = (dir: string): string[] => statSync(dir).isDirectory() ? readdirSync(dir).flatMap((name) => files(join(dir, name))) : [dir];
export function lawHits(dir: string): string[] {
  const hits: string[] = [], colour = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|@import\b|@font-face\b|font-family\s*:/, empty = /catch(?:\s*\([^)]*\))?\s*\{(?:\s*\/\*[\s\S]*?\*\/|\s*\/\/[^\n]*)?\s*\}/;
  for (const path of files(dir)) {
    if (!/\.(ts|css|html)$/.test(path)) continue;
    const skip = path.endsWith("tokens.css"), ts = path.endsWith(".ts");
    readFileSync(path, "utf8").split("\n").forEach((line, i) => {
      const at = `${path}:${i + 1}`;
      if (!skip && colour.test(line)) hits.push(`${at} colour`); if (ts && (/"kind"\s*:\s*"tile-project"/.test(line) || /"kind"\s*:\s*"map"/.test(line))) hits.push(`${at} kind`);
      if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
      if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
    });
  }
  return hits;
}
const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
test("maker law holds, tokens match, and each plant fails", () => {
  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []);
  const css = readFileSync(join(root, "tools/maker/tokens.css"), "utf8"), darkAt = css.indexOf('html[data-theme="dark"]'), mediaAt = css.indexOf("@media (prefers-color-scheme: dark)"), bodyAt = css.indexOf("\nbody");
  for (const token of LIGHT) assert.ok(css.slice(0, darkAt).includes(token), token);
  for (const token of DARK) assert.ok(css.slice(darkAt, mediaAt).includes(token) && css.slice(mediaAt, bodyAt).includes(token), token);
  assert.match(css, /button, input \{ font: inherit; \}/);
  const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
  assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
  const dir = mkdtempSync(join(tmpdir(), "law-"));
  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
  rmSync(dir, { recursive: true });
});
`````

### `tests/editor/project-home.test.ts` (edited)
Diff `fdf29002..b8f2b480`:

`````diff
diff --git a/tests/editor/project-home.test.ts b/tests/editor/project-home.test.ts
index 80d1eaa..8fc2aa7 100644
--- a/tests/editor/project-home.test.ts
+++ b/tests/editor/project-home.test.ts
@@ -42,5 +42,5 @@ test("names, ids, templates, save, rename, duplicate, trash, stale, corrupt, gre
   const trash = memoryStore(); for (const w of asWrites(made)) await trash.write(`${prefix(idA)}${w.path}`, w.text); const kept = await readTree(trash, prefix(idA));
   await movePrefix(trash, prefix(idA), prefix(idA, true)); await movePrefix(trash, prefix(idA, true), prefix(idA)); assert.deepEqual(await readTree(trash, prefix(idA)), kept);
   await movePrefix(trash, prefix(idA), prefix(idA, true)); for (const w of asWrites(made)) await trash.write(`${prefix(idA)}${w.path}`, w.text); const restored = restorePlan(idA, true, kept, idB, NOW, ["My game"]); assert.notEqual(restored.id, idA); assert.equal(proj(restored.files).copiedFrom?.projectId, idA); assert.deepEqual(restorePlan(idA, false, kept, idB, NOW, []).files, kept);
-  const html = projectScreen({ name: "My game", stages: 1, dirty: true, readOnly: false, banner: null }); assert.match(html, /<button[^>]*disabled[^>]*>Test<\/button>/); assert.match(html, /var\(--soon\)/); assert.equal(/onclick|addEventListener/.test(html), false);
+  const html = projectScreen({ name: "My game", stages: 1, dirty: true, readOnly: false, banner: null, problems: [] }); assert.match(html, /<button type="button" class="btn" data-act="test">Test<\/button>/); assert.equal(html.includes("--soon"), false); assert.equal(/onclick|addEventListener/.test(html), false);
 });
`````

As merged:

`````ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { checkName, copyName, duplicate, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, stampNew, type DocText } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { readProject } from "../../src/project/load/index.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { projectScreen } from "../../tools/maker/project.ts";
import { commitWrites, memoryStore, movePrefix, readTree } from "../../tools/maker/store.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), NOW = "2026-11-19T00:00:00.000Z";
const DOC = /^(?:project\.json|catalogue\/slice\.json|(?:maps\/map|stages\/stage|units\/unit|setups\/setup)_[0-9A-HJKMNP-TV-Z]{26}\.json)$/;
const walk = (dir: string, rel = ""): DocText => { const out: Record<string, string> = {}; for (const name of readdirSync(dir)) { const path = join(dir, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(path).isDirectory()) Object.assign(out, walk(path, next)); else out[next] = readFileSync(path, "utf8"); } return out; };
const revOf = (text: string): number => { const doc = JSON.parse(text) as { rev?: number; project?: { rev?: number } }; return doc.project?.rev ?? doc.rev ?? -1; };
const proj = (files: DocText): { id: string; name: string; copiedFrom: { projectId: string; rev: number; at: string } | null } => (JSON.parse(files["project.json"] ?? "{}") as { project: { id: string; name: string; copiedFrom: { projectId: string; rev: number; at: string } | null } }).project;
test("names, ids, templates, save, rename, duplicate, trash, stale, corrupt, greyed Test", async () => {
  assert.deepEqual([checkName("  "), checkName("  My game  "), checkName("x".repeat(41)), copyName("X", []), copyName("X", ["X copy"])], ["Give your game a name", null, "Use 40 characters or fewer", "X copy", "X copy 2"]);
  const idA = projectId(1_700_000_000_000, new Uint8Array(16).fill(1)), idB = projectId(1_700_000_000_000, new Uint8Array(16).fill(2));
  assert.match(idA, /^project_[0-9A-HJKMNP-TV-Z]{26}$/); assert.notEqual(idA, idB); assert.equal(asWrites(stampNew(walk(join(root, "data/templates/empty.tileproj")), "My game", idA, NOW)).at(-1)?.path, "project.json");
  const demo = walk(join(root, "data/templates/demo.tileproj")), empty = walk(join(root, "data/templates/empty.tileproj"));
  assert.deepEqual(demo, walk(join(root, "fixtures/demo.tileproj")));
  for (const bag of [demo, empty, stampNew(demo, "Demo", idA, NOW), stampNew(empty, "Blank", idB, NOW)]) { assert.ok(Object.keys(bag).every((p) => DOC.test(p))); const parsed = parseProject(bag); assert.equal(parsed.ok, true); if (!parsed.ok) return; const load = readProject(parsed.files); assert.equal(load.ok, true); assert.deepEqual([...load.report], []); }
  const made = stampNew(empty, "My game", idA, NOW), mem = memoryStore(); assert.equal((await commitWrites(mem, prefix(idA), asWrites(made))).ok, true);
  const back = parseProject(await readTree(mem, prefix(idA))), again = parseProject(made); assert.equal(back.ok && again.ok, true); if (!back.ok || !again.ok) return;
  const loaded = readProject(back.files), direct = readProject(again.files); assert.equal(loaded.ok && direct.ok, true); assert.deepEqual(loaded.project, direct.project); assert.deepEqual([...loaded.report], []);
  const named = renameTo(made, "Renamed"), plan = planSave(made, named, 1, NOW); assert.equal(plan.ok, true); if (!plan.ok) return;
  assert.deepEqual(plan.writes.map((w) => w.path), ["project.json"]); assert.equal(revOf(plan.writes[0]?.text ?? ""), 2);
  const before = new Map(mem.files); await commitWrites(mem, prefix(idA), plan.writes); for (const [path, text] of before) if (!path.endsWith("/project.json")) assert.equal(mem.files.get(path), text);
  const mapPath = Object.keys(made).find((p) => p.startsWith("maps/")) ?? "", map = JSON.parse(made[mapPath] ?? "{}") as { rev: number };
  const both = planSave(made, { ...made, [mapPath]: JSON.stringify({ ...map, name: "Changed" }) }, 1, NOW); assert.equal(both.ok, true); if (!both.ok) return;
  assert.equal(both.writes.at(-1)?.path, "project.json"); assert.equal(revOf(both.writes.find((w) => w.path === mapPath)?.text ?? ""), map.rev + 1); assert.equal(revOf(both.writes.at(-1)?.text ?? ""), 2); assert.equal(both.writes.some((w) => w.path.startsWith("stages/")), false);
  const notes = { ...made, "notes/notes.json": "{\"note\":true}\n" }, copy = duplicate(notes, idB, NOW, ["My game"]);
  assert.equal(copy["notes/notes.json"], notes["notes/notes.json"]); assert.equal(copy[mapPath], made[mapPath]); assert.equal(proj(copy).id, idB); assert.equal(proj(copy).name, "My game copy"); assert.deepEqual(proj(copy).copiedFrom, { projectId: idA, rev: 1, at: NOW });
  assert.equal(proj(duplicate(notes, projectId(2, new Uint8Array(16).fill(3)), NOW, ["My game", "My game copy"])).name, "My game copy 2");
  const stale = planSave(made, named, 9, NOW); assert.equal(stale.ok, false); if (stale.ok) return; assert.equal(stale.error, "staleRev"); const snap = new Map(mem.files); assert.equal((await commitWrites(mem, prefix(idA), [])).ok, true); assert.deepEqual([...mem.files], [...snap]);
  mem.failOn(`${prefix(idA)}project.json.tmp`); const broken = await commitWrites(mem, prefix(idA), both.writes); assert.equal(broken.ok, false); if (broken.ok) return; assert.match(broken.message, /^Couldn't save /); assert.equal(broken.rows[0]?.code, "writeFailed");
  for (const [path, text] of snap) if (!path.endsWith(".tmp")) assert.equal(mem.files.get(path), text);
  const v7doc = JSON.parse(made["project.json"] ?? "{}") as { formatVersion: number }; v7doc.formatVersion = 7; const v7 = { ...made, "project.json": JSON.stringify(v7doc) }, parsedV7 = parseProject(v7); assert.equal(parsedV7.ok, true); if (!parsedV7.ok) return;
  const row = rowFrom(idA, parsedV7.files); assert.equal(row.readOnly, true); assert.equal(row.badge, "Newer version"); const refused = planSave(v7, v7, 1, NOW); assert.equal(refused.ok, false); if (refused.ok) return; assert.equal(refused.error, "readOnly"); assert.match(refused.message, /Open only/);
  const bad = parseProject({ ...made, [mapPath]: "{" }); assert.equal(bad.ok, false); if (bad.ok) return; assert.match(bad.message, new RegExp(`^Can't open: ${mapPath}`)); assert.match(rowBlocked(idA, bad.message).error ?? "", /^Can't open:/);
  const trash = memoryStore(); for (const w of asWrites(made)) await trash.write(`${prefix(idA)}${w.path}`, w.text); const kept = await readTree(trash, prefix(idA));
  await movePrefix(trash, prefix(idA), prefix(idA, true)); await movePrefix(trash, prefix(idA, true), prefix(idA)); assert.deepEqual(await readTree(trash, prefix(idA)), kept);
  await movePrefix(trash, prefix(idA), prefix(idA, true)); for (const w of asWrites(made)) await trash.write(`${prefix(idA)}${w.path}`, w.text); const restored = restorePlan(idA, true, kept, idB, NOW, ["My game"]); assert.notEqual(restored.id, idA); assert.equal(proj(restored.files).copiedFrom?.projectId, idA); assert.deepEqual(restorePlan(idA, false, kept, idB, NOW, []).files, kept);
  const html = projectScreen({ name: "My game", stages: 1, dirty: true, readOnly: false, banner: null, problems: [] }); assert.match(html, /<button type="button" class="btn" data-act="test">Test<\/button>/); assert.equal(html.includes("--soon"), false); assert.equal(/onclick|addEventListener/.test(html), false);
});
`````

### `handoff/steps/tests/s3-test/touch-smoke.mjs` (new)
`````js
// Step 3 ?project= touch smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8798"] = process.argv;
if (!WT) { console.error("usage: node touch-smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT);
const { fitView } = await import(pathToFileURL(join(root, "src/runtime/render/fit.ts")).href);
const { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s3-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const shot = async (page) => page.evaluate(() => { const c = document.querySelector("#board"), rect = c.getBoundingClientRect(), cam = window.__cam; return { w: c.width, h: c.height, left: rect.left, top: rect.top, rw: rect.width, rh: rect.height, x: cam.x, y: cam.y, s: cam.s }; });
const screenOf = (g, c, r) => { const k = g.w / g.rw, ky = g.h / g.rh, f = fitView(g.w, g.h, g.s, 16, 16); return { x: g.left + (f.padX + ((c + 0.5) * 16 - g.x) * f.s) / k, y: g.top + (f.padY + ((r + 0.5) * 16 - g.y) * f.s) / ky, f }; };
const tileOf = (cam, ox, oy) => { const f = fitView(cam.w, cam.h, cam.s, 16, 16); return { c: Math.floor(((ox * (cam.w / cam.rw) - f.padX) / f.s + cam.x) / 16), r: Math.floor(((oy * (cam.h / cam.rh) - f.padY) / f.s + cam.y) / 16) }; };
const tapCell = async (page, c, r) => { const g = await shot(page), at = screenOf(g, c, r); await page.evaluate(() => { window.__up = null; }); await page.touchscreen.tap(at.x, at.y); await page.waitForTimeout(60); const up = await page.evaluate(() => window.__up), tile = up === null ? null : tileOf(up.cam, up.x, up.y); if (up === null || up.trust !== true || tile === null || tile.c !== c || tile.r !== r) throw new Error(`tap ${c},${r} -> ${JSON.stringify({ at, up, tile })}`); };
const until = async (page, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await page.evaluate(() => window.__wait())) return; await page.waitForTimeout(40); } throw new Error("timeout"); };
const fingers = async (page, pts) => { const cdp = await page.context().newCDPSession(page); const send = (type, at) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: at.map((p, i) => ({ x: p[0], y: p[1], id: i + 1 })) }); await send("touchStart", pts); for (let i = 1; i <= 6; i += 1) await send("touchMove", pts.map((p) => [p[0] + p[2] * i, p[1] + p[3] * i])); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await cdp.detach(); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }); await btn.first().waitFor({ timeout: 15000 }); await btn.first().scrollIntoViewIfNeeded(); const box = await btn.first().boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); await page.waitForTimeout(80); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); const errs = [], ext = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("request", (r) => { const u = r.url(); if (!(u.startsWith(origin) || u.startsWith("data:") || u.startsWith("blob:"))) ext.push(u); });
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    const testAt = await page.locator("[data-act=test]").boundingBox(); if (testAt === null) throw new Error("no test");
    await press(page, "Test");
    await page.waitForFunction(() => location.search.includes("project=") && window.__play !== undefined && window.__hud !== undefined && window.__driver.stats.draws > 0, null, { timeout: 15000 });
    const opened = await page.evaluate(() => { const p = window.__docs.manifest.project, q = new URLSearchParams(location.search); return { id: p.id, name: p.name, query: q.get("project"), canopy: window.__docs.looks.canopy.length, braziers: window.__docs.looks.braziers.length }; });
    if (opened.name !== "My game" || opened.id !== opened.query || opened.id === "project_01JDAP00000000000000000001" || opened.canopy !== 0 || opened.braziers !== 0) throw new Error(JSON.stringify(opened));
    await page.evaluate(() => { const c = document.querySelector("#board"); window.__up = null; c.addEventListener("pointerup", (e) => { const cam = window.__cam, b = c.getBoundingClientRect(); window.__up = { trust: e.isTrusted, x: e.offsetX, y: e.offsetY, cam: { w: c.width, h: c.height, rw: b.width, rh: b.height, x: cam.x, y: cam.y, s: cam.s } }; }, true); window.__hud.hideBanner(); window.__play.followId = null; const s = Math.max(1, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
    await page.waitForTimeout(80);
    const knight = await page.evaluate(() => window.__play.scene().units.find((u) => u.sprite === "starter:hero-sword").id);
    const turns0 = await page.evaluate(() => window.__play.view().turns);
    const step = async (name, ms, fn) => { try { await Promise.race([fn(), new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]); check(`${name} @${width}`, true, "ok"); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await step("1 select", 5000, async () => { const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r); const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`selected ${sel}`); });
    await step("2 walk", 5000, async () => {
      const cell = await page.evaluate(() => { const c = window.__play.reach[0]; return c ? { c: c.c, r: c.r } : null; }); if (cell === null) throw new Error("no reach");
      const from = await page.evaluate((id) => { const u = window.__play.world.units.get(id); return { c: u.at.c, r: u.at.r }; }, knight);
      await page.evaluate((p) => { window.__wait = () => { const u = window.__play.world.units.get(p.id); return window.__play.walk === null && u.at.c === p.c && u.at.r === p.r && window.__play.world.phases.battle === "actMenu"; }; }, { id: knight, c: cell.c, r: cell.r });
      await tapCell(page, cell.c, cell.r); await until(page, 4800);
      const moved = await page.evaluate((p) => { const u = window.__play.world.units.get(p.id); return u.at.c !== p.c || u.at.r !== p.r; }, { id: knight, c: from.c, r: from.r }); if (!moved) throw new Error("still at start");
    });
    await step("3 attack", 5000, async () => {
      const placed = await page.evaluate((id) => { const play = window.__play, me = play.world.units.get(id), occ = (c, r) => play.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r); const spots = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: me.at.c + dc, r: me.at.r + dr })).filter((p) => play.world.grid.inBounds(p) && play.world.grid.isOpen(p) && !occ(p.c, p.r)); const wolf = play.scene().units.find((u) => u.sprite === "starter:enemy-wolf" && u.alive); if (spots[0] === undefined || wolf === undefined || !play.world.units.moveTo(wolf.id, spots[0], "move").ok) return null; return { id: wolf.id, c: spots[0].c, r: spots[0].r, before: play.world.log.entries().filter((e) => e.action.kind === "ability").length }; }, knight);
      if (placed === null) throw new Error("no neighbour");
      await page.locator("#attack").waitFor({ state: "visible", timeout: 3000 }); const btn = await page.locator("#attack").boundingBox(); if (btn === null) throw new Error("no attack");
      await page.touchscreen.tap(btn.x + btn.width / 2, btn.y + btn.height / 2); await page.waitForTimeout(40); await tapCell(page, placed.c, placed.r);
      const got = await page.evaluate((p) => { const play = window.__play, hp = play.world.rules.state().units.find((u) => u.id === p.id)?.hp ?? 99; return { hp, phase: play.world.phases.battle, done: play.done.has(p.knight), logs: play.world.log.entries().filter((e) => e.action.kind === "ability").length, before: p.before }; }, { ...placed, knight });
      if (!(got.hp < 4 && got.phase === "idle" && got.done && got.logs === got.before + 1)) throw new Error(JSON.stringify(got));
    });
    await step("4 pan then select", 5000, async () => {
      await page.evaluate(() => { const c = document.querySelector("#board"); window.__play.followId = null; const s = Math.max(window.__cam.s, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
      const g0 = await shot(page), s0 = g0.s; await fingers(page, [[g0.left + 28, g0.top + g0.rh - 28, -8, 0], [g0.left + 52, g0.top + g0.rh - 28, 8, 0]]);
      const g1 = await shot(page); if (!(g1.s > s0)) throw new Error(`zoom ${s0}->${g1.s}`);
      const pan = await shot(page); await fingers(page, [[pan.left + pan.rw / 2, pan.top + pan.rh / 2, -20, 0]]);
      const g2 = await shot(page), grew = g2.x - g1.x, want = (120 * (g2.w / g2.rw)) / g2.s; if (!(g2.x > 0 && Math.abs(grew - want) <= 0.5)) throw new Error(`pan x ${g1.x}->${g2.x} grew ${grew} want ${want}`);
      const spot = await page.evaluate(() => {
        const play = window.__play, cam = window.__cam, c = document.querySelector("#board"), s = Math.max(1, Math.trunc(cam.s)), artW = Math.floor(c.width / s), artH = Math.floor(c.height / s);
        const open = (col, row) => play.world.grid.inBounds({ c: col, r: row }) && play.world.grid.isOpen({ c: col, r: row }) && !play.world.units.all().some((u) => u.alive && u.at.c === col && u.at.r === row);
        const on = (col, row) => (col + 0.5) * 16 > cam.x + 16 && (col + 0.5) * 16 < cam.x + artW - 16 && (row + 0.5) * 16 > cam.y + 16 && (row + 0.5) * 16 < cam.y + artH - 16;
        let ar = null, vi = null;
        for (let r = 0; r < play.world.grid.rows && ar === null; r += 1) for (let col = 0; col < play.world.grid.cols; col += 1) { if (!on(col, r) || !open(col, r)) continue; const nb = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: col + dc, r: r + dr })).find((p) => on(p.c, p.r) && open(p.c, p.r)); if (nb !== undefined) { ar = { c: col, r }; vi = nb; break; } }
        if (ar === null || vi === null) return null;
        const archer = play.scene().units.find((u) => u.sprite === "starter:hero-staff" && u.alive), villager = play.scene().units.find((u) => u.sprite === "starter:npc-villager" && u.alive);
        if (archer === undefined || villager === undefined || !play.world.units.moveTo(archer.id, ar, "move").ok || !play.world.units.moveTo(villager.id, vi, "move").ok) return null;
        return { archer: archer.id, ac: ar.c, ar: ar.r, vc: vi.c, vr: vi.r };
      });
      if (spot === null) throw new Error("no on-screen pair");
      await tapCell(page, spot.ac, spot.ar); const sel = await page.evaluate(() => window.__play.selected);
      const g3 = await shot(page), at = screenOf(g3, spot.ac, spot.ar), dpr = await page.evaluate(() => devicePixelRatio || 1);
      const oldC = Math.floor((((at.x - g3.left) * dpr) - at.f.padX) / g3.s / 16), oldR = Math.floor((((at.y - g3.top) * dpr) - at.f.padY) / g3.s / 16);
      if (sel !== spot.archer || (oldC === spot.ac && oldR === spot.ar)) throw new Error(JSON.stringify({ sel, spot, oldC, oldR }));
      await page.evaluate((s) => { window.__spot = s; }, spot);
    });
    await step("5 talk", 5000, async () => {
      const live = await page.evaluate((t0) => ({ side: window.__play.side, turns: window.__play.view().turns, t0 }), turns0); if (live.side !== "player" || live.turns !== live.t0) throw new Error(JSON.stringify(live));
      const spot = await page.evaluate(() => window.__spot), talk = await page.locator("#talk").boundingBox(); if (talk === null || spot === null) throw new Error("no talk");
      await page.touchscreen.tap(talk.x + talk.width / 2, talk.y + talk.height / 2); await page.waitForTimeout(40); await tapCell(page, spot.vc, spot.vr);
      const panel = await page.evaluate(() => { const n = document.querySelector("#sheet"), q = n.getBoundingClientRect(), st = getComputedStyle(n); return { show: st.display !== "none", h: q.height, text: n.textContent ?? "", vh: innerHeight }; });
      if (!(panel.show && panel.h > 0 && panel.h <= panel.vh * 0.35 && panel.text.includes("Villager") && panel.text.includes("Hello, traveler."))) throw new Error(JSON.stringify(panel));
      const close = await page.locator("#close").boundingBox(); if (close === null || close.width < 44 || close.height < 44) throw new Error("close");
      await page.touchscreen.tap(close.x + close.width / 2, close.y + close.height / 2); await page.waitForTimeout(40);
      const after = await page.evaluate((s) => { const n = document.querySelector("#sheet"); return { hidden: getComputedStyle(n).display === "none", phase: window.__play.world.phases.battle, knight: window.__play.done.has(s.knight), archer: window.__play.done.has(s.archer) }; }, { ...spot, knight });
      if (!(after.hidden && after.phase === "idle" && after.knight && after.archer)) throw new Error(JSON.stringify(after));
    });
    await step("6 end turn", 10000, async () => {
      const end = await page.locator("#end").boundingBox(); if (end === null) throw new Error("no end");
      await page.evaluate((t0) => {
        const play = window.__play; window.__saw = false; const bot = play.bot.bind(play);
        play.bot = (world, side) => { if (side === "wolves") window.__saw = true; return bot(world, side); };
        window.__wait = () => window.__saw === true && play.side === "player" && play.view().turns === t0 + 1 && play.world.phases.battle === "idle" && play.done.size === 0;
      }, turns0);
      await page.touchscreen.tap(end.x + end.width / 2, end.y + end.height / 2); await until(page, 9000);
      await page.evaluate((id) => { const u = window.__play.world.units.get(id), c = document.querySelector("#board"), cam = window.__cam, s = Math.max(1, Math.trunc(cam.s)); window.__play.followId = null; cam.follow = null; cam.x = Math.max(0, (u.at.c + 0.5) * 16 - Math.floor(c.width / s) / 2); cam.y = Math.max(0, (u.at.r + 0.5) * 16 - Math.floor(c.height / s) / 2); }, knight);
      const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r);
      const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`reselect ${sel}`);
    });
    await step("7 buttons", 5000, async () => {
      const hud = await page.evaluate(() => [...document.querySelectorAll("button")].filter((b) => { const s = getComputedStyle(b), q = b.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0; }).map((b) => { const q = b.getBoundingClientRect(); return { id: b.id, w: q.width, h: q.height }; }));
      const small = hud.filter((b) => b.w < 44 || b.h < 44); if (small.length > 0 || !hud.some((b) => b.id === "recentre") || errs.length > 0 || ext.length > 0) throw new Error(JSON.stringify({ small, recentre: hud.some((b) => b.id === "recentre"), errs, ext }));
    });
    await step("8 back to maker", 5000, async () => {
      const live = await page.evaluate((b) => { const n = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return n instanceof Element && n.closest("[data-act=test]") !== null; }, testAt);
      if (live) throw new Error("test still live");
      const back = await page.locator("#back-maker").boundingBox(); if (back === null || back.width < 48 || back.height < 48) throw new Error("no back");
      await page.touchscreen.tap(back.x + back.width / 2, back.y + back.height / 2);
      await page.waitForFunction(() => document.querySelector("[data-act=test]") !== null && !location.search.includes("project="));
      const name = await page.locator("h1").innerText(); if (name !== "My game") throw new Error(name);
    });
    await step("9 empty blocked", 15000, async () => {
      await press(page, "Back"); await press(page, "New project");
      const empty = page.getByRole("button", { name: "Empty", exact: true }); await empty.waitFor({ timeout: 15000 }); const box = await empty.boundingBox(); if (box === null) throw new Error("empty");
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(80);
      await press(page, "Continue"); await press(page, "Create"); await press(page, "Test");
      const got = await page.evaluate(() => ({ app: getComputedStyle(document.querySelector("#app")).display, board: document.querySelector("#board") !== null, text: document.querySelector(".sheet")?.textContent ?? "", test: document.querySelector("[data-act=test]") !== null }));
      if (got.app === "none" || got.board || !got.text.includes("no unit roster yet") || !got.test) throw new Error(JSON.stringify(got));
    });
    await ctx.close();
  };
  await run(390); await run(360);
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
console.log(bad === 0 ? "TOUCH SMOKE PASS" : `TOUCH SMOKE FAIL (${bad})`);
process.exit(bad === 0 ? 0 : 1);
`````
