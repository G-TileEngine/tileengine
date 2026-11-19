# QA review: maker step guides, cold-builder revision

QA & Build Guard, 2026-11-18, Europe/London. Read-only. No edits to the guides or any other bot's files, and no GitHub writes. Repo `/workspace/tileengine-repo`: `git fetch -q origin`; `origin/main` is `9fc498903ac615e75014f597e54af49fab547e27` (`test(s0): touch smoke finds units by starter sprite id (post-1b refreeze, QA OK)`, 23:55 Europe/London). That commit is a one-file descendant of `57af7135` (PR #78 merge). Floor is still **1036**. Share copies in `/workspace/share/maker-spec/` are byte-identical to the local files below. Audit: `/workspace/share/step-guide-audit/report.md`. This doc is local for CoS to push.

Checked (sha256, lines; prefixes/suffixes and counts all match the request):

| File | Rev | Lines | sha256 |
|---|---|---:|---|
| `docs/maker/steps/step-00-play-input.md` and `handoff/steps/s0-play-input.md` (same bytes) | header r5 | 175 | `7969b6263d92dd253330275136af020f74f00da4624f1cb00da02a0ce3e3cece` |
| `docs/maker/steps/step-01-project-format.md` | r7 | 266 | `66c2d05e06ecda1e5fde5852f935492c46068fb1ec57cbcaf81ac9d35326108e` |
| `docs/maker/steps/step-02-home-save-load.md` | r5 | 123 | `dbca3206fd5bc0152e2e2b84297df48e033a2caf845852488b6a59042ccf352e` |
| `docs/maker/steps/step-03-test.md` | r6 | 97 | `cd18fa632ec618b2741e76bcbeff0e2a1c19aa78ec76604635f13029a4d0e3c1` |
| `docs/maker/roadmap.md` | r10 | 208 | `f36574efc3e981f3da6b238cca595b0cd0dc4c6a19987595bac70fbdafbd095f` |
| `docs/maker/shell-lessons.md` | r8 | 121 | `fe01d7cbde592ac0789157c53471c7fb8e4c72d524ec25ff87c336884b0cc25e` |
| `docs/maker/maker-spec/MS-01-home-and-projects.md` | r2 | 88 | `9d9cad41eaa712f93aba77db5d9d7d1b9efff0ff7cda5b20dfe48a0586b98fcc` |

style-spec §1 is sha256 `fb418efc761e330ecd41277e0edaa5ddbbfd6e4b809e5dd0cdd6dfcb2bbf3d1c`. The EA ruling in step 3 was verified verbatim against Engine Architect (`54975d7b-2712-409f-a30f-3095a7f2f8a1`).

## Verdicts

| File | Verdict |
|---|---|
| step-00 / s0-play-input (header r5) | **OK** (`7969b626`) |
| step-01 r7 | **NOT OK** (`66c2d05e`) |
| step-02 r5 | **NOT OK** (`dbca3206`) |
| step-03 r6 | **NOT OK** (`cd18fa63`) |
| roadmap r10 | **OK** (`f36574ef`) |
| shell-lessons r8 | **OK** (`fe01d7cb`) |
| MS-01 r2 | **NOT OK** (`9d9cad41`) |
| Build stamp scheme | **NOT OK** — see sign-off |
| tokens.css recipe | **NOT OK** — see sign-off |

Overall: not ready for the step 2 go-line until the numbered fixes land. Recheck just those.

## Must-fixes

1. **`step-01-project-format.md:5` and `:14`.** 1b is no longer waiting to merge. **Change L5 to:** 1b status: SHIPPED. PR #78, merge `57af7135`. 1b based on `aa158fda` and landed at **1036** tests. Current main `9fc4989` is the post-1b S0 smoke refreeze (the smoke file only; floor still 1036). **Change L14** so the 1b branch is history (`r1 shipped`), not "waiting to merge." The rest of the r7 audit fixes (Delivery, file-name rule, Q4/Q8, P2 allowlist emptied to `[]`, line numbers as hints, floors as history) are in place.

2. **`step-02-home-save-load.md:7` and `:16`.** The stated base `57af7135` does not contain the frozen smoke the Delivery block requires. On `57af7135`, `handoff/steps/tests/s0-play-input/touch-smoke.mjs` is sha256 `a4a607b2…` and still looks up `unitId === "knight"`, which fails after 1b. The refrozen smoke `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` is on current main `9fc4989` (and at `/workspace/share/s1b-smoke/touch-smoke.mjs`). A cold builder who checks out the stated base, then checks the sha as instructed, is stuck: the guide says do not edit the frozen kit and does not give another path. **Change L7 base to** `9fc498903ac615e75014f597e54af49fab547e27` (the smoke refreeze on the PR #78 merge). Floor stays **1036 + N**. Say not to start from `57af7135` alone. **On L16**, keep the repo path and the `d528795e` sha, and say: check that sha before you run it; if it does not match, stop (do not run the old `knight` lookup).

3. **`step-02-home-save-load.md:48`.** "step 3's play stage reuses this file" contradicts the EA ruling. **Change** the last sentence of the `project-files.ts` row to: this is maker-side file I/O only; step 3's maker calls `openProject(files)` from `tools/play-stage/project.ts`, and no `tools/play-stage` file imports `tools/maker`. Keep "must not import anything under `src/editor/`" (`tools/play-stage/build.ts` / apk refuse an `editor` path).

4. **`step-03-test.md:53`.** The P2 edit is the right shape, but a cold builder who applies one shared regex will break the existing play-stage scan. On main, `tests/project/load/one-parser.test.ts` uses `/JSON\.parse|formatVersion|(?<!action\??\.)kind === (?!"(?:spell|talk)")/` and `ALLOW = []`. **Change L53 to:** keep that load/play-stage scan unchanged (empty `ALLOW`, including the `action.kind === "spell"|"talk"` / `action?.kind ===` exception). Add `tools/maker` as a **separate** scan that bans `formatVersion` and `kind ===` outright and allows exactly one `JSON.parse` in `tools/maker/project-files.ts`, pinned by file name plus a count of 1 (not by line text). Add a check that no `tools/play-stage` file imports from `tools/maker`. The EA guide line on L38 is verbatim and may stand.

5. **Build stamp scheme (`step-02-home-save-load.md:40` and `:112`).** The 12-hex stamp over sorted paths and sha256 sums, with only `index.html` unstamped and written last, is the right idea. It is not yet complete enough to sign off. Add all four:

   - **Same-input test.** Two builds of the same input produce the same 12-character stamp; changing one source file produces a new one. L112 already has the second half only.
   - **Collision.** If `<out>/maker/<stamp>/` already exists, it must be byte-identical or the build refuses.
   - **Stale folders.** After `index.html` is written, remove other `<out>/maker/<not-current-stamp>/` directories, or require a clean `<out>`.
   - **No-cache on the unstamped file.** Phones cache old files, which is why stamps exist; if `index.html` is cached, the scheme fails. Mark `maker/index.html` no-cache (a `Cache-Control: no-cache` meta, and a publish note that `maker/index.html` and, in step 3, `play-stage/index.html` are served `Cache-Control: no-cache`, while `/<stamp>/` may be immutable). The export-audit set on L112 (no `dev.js`, no `\bDEV\b`, no `window.__`, no `sourceMappingURL`, no `.map`, nothing from `ui-shell/`) can stand.

6. **tokens.css recipe (`step-02-home-save-load.md:64–69` and `:95`).** The recipe itself is the right way to turn style-spec §1 (`fb418efc`, a table plus a list, not a CSS block) into CSS: `:root` light + also-list + `font: inherit`, `html[data-theme="dark"]`, the `prefers-color-scheme` / `data-appearance="system"` block, and the §2 system font stack on `body`. It is the only colour-literal file, uncounted in the cap, and `@import` / web fonts / `@font-face` stay banned. Two plant gaps remain:

   - L69 and L95 check "every token name and value **in the table**." Extend the plant to the **Also in the token block** list as well (`--hero`, `--hero-ink`, `--scrim`, `--sheet-shadow`, `--danger-line`, `--soon-ink`, `--frame-bg`, `--frame-shadow`), value for value, including the dark / `prefers-color-scheme` rules where they apply.
   - Spell out the combined table cells so value-for-value is unambiguous: `--danger` / `--danger-soft`, `--warn` / `--warn-soft` / `--warn-line`, and `--ok` / `--ok-soft` are separate tokens; the Light/Dark cells hold two (or three) values.

7. **`MS-01-home-and-projects.md:61–62` vs `step-02-home-save-load.md:99`.** The user-facing error strings do not match, and MS-01's readOnly line is wrong (a read-only project still opens). **Align both files to the step-02 wording:**
   - `staleRev`: `This project changed somewhere else. Reopen it to see the latest.`
   - `readOnly`: `Made with a newer TileEngine. Open only.`
   (MS-01 currently says "This game changed…" and "Update the app to open it.")

8. **`MS-01-home-and-projects.md:57`.** §5 still names card skeletons as the loading state. Step 2 defers skeletons (L92) and ships the text "Loading your games…" (L91). **Change L57** to: step 2 shows "Loading your games…"; card skeletons are a later step. The intro already says step 2 ships only part of this spec; this row needs the same tag.

## Sign-offs

**Build stamp scheme: NOT OK.** Hash over the full stamped-folder content, deterministic and sorted: yes (L40). Only `index.html` unstamped, written last: yes. Export audit: yes (L112). Missing: the same-input test, collision handling, stale-folder cleanup, and no-cache on `index.html` (fix 5).

**tokens.css recipe: NOT OK.** Copied from style-spec §1 (`fb418efc`) by a followable recipe, not by a false "verbatim" paste; only colour-literal file; uncounted; no web fonts or `@import`; system font stack from §2 is intended. The theme plant does not yet check the also-list or the combined cells (fix 6).

## Checks

| # | Check | Result |
|---|---|---|
| 1 | Hashes, lines, share copies | **Pass.** All seven match. step-00 and `handoff/steps/s0-play-input.md` are byte-identical. Share copies are byte-identical. |
| 2 | Cold-builder: paths, commands, base, floor, cap, plants, Done-when | **Fail until fixes 1–4.** After those, step 2 and 3 are paste-ready: Delivery, branch, HANDBACK, `npm ci && npm run green`, shortstat with `..HEAD` and `':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css'` (step 3 also excludes `s3-test/**`), 400-line hard gate, plants, and concrete Done-when. Cited read-first paths exist on main, except files this step creates (`tools/maker/**`, `src/editor/project/**`, the new tests, `data/templates/`, `handoff/steps/tests/s3-test/touch-smoke.mjs`). No unnamed chat rulings once L48 and L53 are fixed. The audit's step 0–3 and top fixes are in, except step 1 still says 1b is waiting (fix 1) and the smoke sha is not on the stated step-2 base (fix 2). |
| 3 | Facts: base, floor, caps, shortstat | **Floor 1036 + N is current.** S0 / 1a / 1b are merged (PR #76 / #77 / #78). step-00 reads as shipped/history; the body from `## Goal` on is unchanged from main. Caps: step 2 is 400 (file caps sum to 400). Step 3's hard gate is 400 (file caps sum to 290). The audit's older "caps sum to 300" and this briefing's "Step 3 300" are the planned file-cap sum, not a new hard cap; standing rule remains each run ≤ 400. Shortstat exclusions include `':!tools/maker/tokens.css'` and the fixtures/templates exclusions. **Base:** use `9fc4989`, not `57af7135` alone (fix 2). |
| 4 | Smoke `d528795e` | **On current main, not on `57af7135`.** The guides cite the repo path and the right sha, and do not claim the sha was already on `57af7135`. They do not give a runnable tree or fallback path until fix 2. They do not tell a builder to take a main copy that still looks up `knight`. `PLAYWRIGHT_CORE` / `CHROME` stay as placeholders; S0 L116 has the standing values (`playwright-core@1.59.1` already on the box, `CHROME=/usr/bin/google-chrome`). A pointer there would help but is not a must-fix. |
| 5 | Previous QA holds for steps 2/3, plus 1b carries | **Pass**, with one narrow Q9 note. Present: only `.json` under `data/templates/**` (step 2 L107); both templates load through `readProject` in a named test (L110); Q9's "every fixture loads through `readProject` in a named test" remains in step 1 (L249–250); release build has no `page.ts` fixture fallback for a missing `?project=` (step 3 L52, L90); a failed `?project=` shows the error, never the fixture; each `maker-law` plant is shown failing (step 2 L114); `maker-build.test` runs the full export-audit set (L112); unavailable OPFS shows a visible error, no silent memory fallback (L112); theme plant with `tokens.css` as the only colour-literal file, checked value-for-value against the style-spec table (L95, extend per fix 6); a failed save blocks Test (`test-launch: save fails, no launch`, step 3 L87); `TOUCH SMOKE PASS`; 390×844 light shots compared with the references. Carries A and B are in step 2 L72–L73 with tests. **Note:** step 2's json-only name check covers `data/templates` only, not `fixtures`. That is enough if this run does not touch `fixtures/` (it should not); say so, or add `fixtures` to the `git diff --name-only` line. |
| 6 | Step 3 P2 and EA ruling | **Quote verified.** The L38 guide line matches EA's words exactly, including that `readProject` takes already-parsed objects. The changed P2 still catches `JSON.parse`, `formatVersion` and doc-kind checks outside `src/project/read/*` and `migrate.ts`, **if** the existing load/play-stage scan is kept (fix 4). The import-direction rule (maker → engine, never engine → maker, no ui-shell) is a named check in `one-parser.test.ts` (L53, L89). |
| 7 | Greyed-Test exception, attribution, MS-01 screens | **Exception is named and does not break rule 2**, once MS-01 copy is aligned (fixes 7–8). Roadmap r10 L18 and shell-lessons r8 L23 add the same exception: visible, `--soon`, not clickable, enable condition is step 3. Reason is stated. Diffs against last OK (roadmap r9 `531eb831`, shell-lessons r7 `5da9bc36`) are that exception plus the revision line. CEO-vs-UX attribution in those two files is unchanged and stays clean (`Proposed UX answer` still labels #6 extras). MS-01 Test row and shots path (`docs/maker/shots/`) match step 2; error strings and the loading state do not (fixes 7–8). |

## Notes (not must-fixes)

- Step 3 L3 and L86 keep a 400-line hard gate. That matches prior QA ("each run ≤ 400") and S0. Do not silently lower it to 300 without a new ruling.
- Point step 2 L16 and step 3 L17 at S0 L116 for `PLAYWRIGHT_CORE` and `CHROME=/usr/bin/google-chrome`.
- MS-01 L12 still "keeps" a `homeLast` pref that step 2 does not mention; the Trash table row still names Empty trash. The intro already defers those. Tag the rows if you want the spec to be skimmable on its own.
- Step 3 should say the new P2 and import-direction checks are proven by planting the bad pattern and seeing the test fail, as step 2 L114 already requires for `maker-law`.
- `ui-shell/README.md` in the roadmap audit is already labelled "local, not on main."

After the pass, recheck just the numbered fixes.
