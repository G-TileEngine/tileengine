# QA handback review: step-03b-slice-r29 r1

QA & Build Guard, 2026-11-19, Europe/London. Read-only, after `git fetch`. I used fresh `/tmp/q` worktrees and removed them afterwards. No GitHub writes.
- **Commits:** tip `f45288d9` (tree `908c541e`), code head `ffa43f40` (tree `0b174cc9`), base `fdb7ad56`. Linear, 2 commits.
- **Guide:** main's `docs/maker/steps/step-03b-slice-r29.md` (blob `d66e28a0`, sha256 `fd8f35d1…`, 136 lines; the same blob is on the branch). `/workspace/share/maker-spec/step-03b-slice-r29.md` (`a72d3352`) is the older r3 text, differing only in the DSK pin (L3/L28). Line cites below are to main.

## Verdict: OK TO OPEN PR (no must-fixes)

## Re-run
- **Green at the tip:** `npm ci && npm run green` exit 0, **1051/0**, 0 skipped, 0 cancelled, 0 todo. Floor 1049 + N=2. Typecheck, lint, deps, check:state and check:law OK.
- **Slice:** sha256 `8547ed0a…dab3`, `catalogue_rev` 29, 4,170 lines (guide L42/L123). `tools/project/slice-of.ts` is unchanged (`46f42e33`).
- **Parity:** TAP gives `ok 1028 - (a) parity: seed 24301 bot versus bot equals the 1a golden`. The golden is `90dde42a` on base and tip, and `git diff --stat` of `tests/tools/golden/` is empty (L125).
- **Named tests pass:** "demo slice pin…" (L126), "picker options as {value, label}…" and "fixture clean, and slice-of is byte-equal…" (L124, `read-project.test.ts` unedited).
- **Mutation checks:**
  - With the base `read-project.ts` restored, the picker test fails, 0/1 (L93).
  - With the slice hand-edited (`max_len` 140 → 141), the pin test fails while the old byte-equal test still passes (Rules 9).
- **S0 smoke:** sha `d528795e…` is unedited. 14/14 ok and PASS under `/usr/bin/google-chrome`.
- **s3 smoke:** **5 of 5 runs PASS**, 18/18 each (390 and 360, including 8 back and 9 empty blocked).
- **Maker build and export audit:** `node tools/maker/build.ts` builds (stamp `ab2063a6`). The release file set equals the base build's. The only changed files are the 7 demo JSON (fixture `.json.js` and template copies) plus `read-project.js`. There are no dev globals and no maker/editor code in the play-stage bundle. The template slice in the bundle has sha `8547ed0a`.

## Line gate ruling (G7): ACCEPT `':!data/templates/**'`
1. **The template files are an exact twin of the fixture.** All 7 changed `data/templates/demo.tileproj/*` files have the same blob as their fixture twin at the tip:
   - `catalogue/slice.json` `2d59519b`
   - `project.json` `8fd85732`
   - `setup…0001` `df7032ec`, `…0002` `e83cfb01`, `…0003` `9aa5d7a0`, `…0004` `868d32bb`, `…0005` `af711549`
   - The whole 16-file template tree equals the fixture tree blob for blob, at both base and tip.
   - `tests/editor/project-home.test.ts:22` asserts `deepEqual(demo template, fixtures/demo.tileproj)`, and New (Demo) is that template.
2. **The data changes are exactly what the guide asks for.**
   - The slice is the verbatim rev 29 file, held by the pin, so it is not hand-written.
   - `catalogueRev` is 28 → 29, and the 5 setups have `catalogue.rev` 28 → 29 (Rules 2).
   - There are exactly 5 user re-answers (Re-answers L69–73): `…0003` piece_count 3; `…0004` enemy_basic_crosses_barrier false; `…0005` neutrals_legal false, hit_class "basic", mana_cost 0. Each has rev 1 with `defaultRef` unchanged. The 7 others stay default.
   - `rg clip_cues src tools` finds nothing, so the D20 exception does not apply.
3. **Precedent.** The step 2 guide L109 and the step 3 guide L86 both already exclude `':!data/templates/**' ':!fixtures/**'`. The 03b guide (written on `af9af6c0`, before `data/templates/` existed) excludes only `fixtures/**` (L122). Its own reason, data plus the pin (L62), covers the twin equally, because `project-home.test.ts:22` pins the twin to the pinned fixture.
4. **The counted files.** The counts are below:
   | Command | Result |
   |---|---|
   | `fdb7ad56..ffa43f40 -- . ':!fixtures/**' ':!data/templates/**'` | 3 files, **25 + 1 = 26** ≤ 400 |
   | L122 as written | 10 files, 3764 + 182 (11 files, 3901 + 182 at the tip, because it also counts the HANDBACK) |
   | `fixtures/` raw data size | 7 files, 3739 + 181 |

   The 3 counted files:
   - `src/project/load/read-project.ts` L61, +1/−1. The picker check mirrors `registry.ts` L42 exactly.
   - `tests/project/load/picker-options.test.ts` +15.
   - `tests/project/demo-slice-pin.test.ts` +9.

   That is 1 line under the trial's 27 (L104), because the pin test is 9 lines, not 10.

   **G7 reasoning:** generated files and test fixtures are excluded. The twin is byte-identical generated data that a test pins to the pinned fixture. Counting it would double-count one data change, and the guide says a split can't help (L105).

## Other checks: pass
- **Do-not-touch** (L109–117), each with no diff:
  - `slice-of.ts`, goldens, `handoff/steps/tests/**`, `tools/play-stage/**`, `tools/maker/**`, `src/editor/**`
  - `read-project.test.ts`, `play-stage-carries.test.ts`, `one-parser.test.ts`
  - No new report code, no `noDefault` check, no `barrier-line.length`/`adjacency-synergy.bonus`, no new dependency.
- **File list (G6):** the Build table (L89–95) plus the 7 template twins, which are named and justified in HANDBACK § Decisions.
- **Build law:**
  - No clock or rAF change, and no copied trees (data plus 1 line).
  - Law 12: no empty catch or default. The fix is stricter than `includes` only for object options, and non-strings stay `invalidValue`.
  - Law 13: no new state.
- **Plants and carries:** P1/P2/P3, carries A/B/8 and R-E1 code are untouched (no play-stage or plant diff). The s3 smoke still proves 0 canopy and 0 braziers on Demo Test.
- **§3 I one job:** `read-project.ts` (110 lines) still has one job, "reads a project's files into a store and a report". The tests are single-purpose and the JSON is data-exempt. There are no pass-through files.
- **HANDBACK:** accurate on shas, N, 1051/0, slice, re-answers, parity line, the golden sha, both counts and smoke lines. The browser path is `/usr/local/bin/google-chrome` (sandbox), and I re-ran under `/usr/bin`.
- **Merge:** `git merge-tree --write-tree origin/main(992e7d87) f45288d9` is clean, tree **`0598d3fef36f6163da1cb8d8b946261f189f0c8b`**. `docs/` equals main's (main adds only the step-03 rebuild record and its review). `npm test` on the merge result is 1051/0.

## Non-blockers
1. Guide L122's gate command lacks `':!data/templates/**'`. UX should align it with steps 2/3 in the next docs pass. CoS's go-line should quote the corrected command.
2. The `/workspace/share` copy of the guide is stale, the pre-`aacb7e01` r3 text. Main's copy is the one to cite.
3. The HANDBACK "PR: opened by Chief Of Staff" boilerplate is accepted as before.
