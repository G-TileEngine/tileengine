# Rebuild record: step 2, Home, save and load

Original brief: [`docs/maker/steps/step-02-home-save-load.md`](../maker/steps/step-02-home-save-load.md) r8 (blob `7df0f328`, on main `b999f6e6`). The builder's branch still carried the r6 brief (blob `25c0ee1a`); the merge kept main's r8 (QA2:29). This file records exactly what shipped. Step 02b (play-stage carries A and B) comes after this merge.

Sources: PR #79 and branch `step/step-02-home-save-load-r1-chatA` (r1 tip `477e021e`, rejected on the line gate; r2 tip `46fd3346`, merged); `handback/step-02-home-save-load/r1/HANDBACK.md` at `477e021e` (HB1) and at `46fd3346` (HB2); `docs/qa/step-02-handback-review.md` (QA1), `docs/qa/step-02-r7-02b-review.md` (the r7 brief recheck) and `docs/qa/step-02-r2-review.md` (QA2); Chief Of Staff verify report `/workspace/share/step02-verify/report.md` (sha256 `7b04623230295893eb1d3134e071d1ccecac3bed9a8b0c6bc04c151cb3df207b`) r1 section (V1) and r2 section (V2). Line numbers are at the commit named.

## (a) Start and finish

| | Value |
|---|---|
| Base | `772f7aa27e0e27333ef54bf9dd68641a952b959c`, which is the smoke-refreeze `9fc49890` plus one docs-only commit (9 files under `docs/` and `handoff/steps/s0-play-input.md`; QA1:3). Same engine code as `9fc49890`. Floor **1036** tests |
| r1 commits | `55f8ca5` feat (home, save and load), `b90a14e` style (stack card lines and fill the phone frame), `6bb80d7` fix (drop empty project folders and pin Test in view; tree `4db9c105`), `477e021e` hand-back (tree `52421f1a`) (V1:192-198) |
| r1 verdict | QA **NOT OK**, one rework round: 39 lines of component CSS in the gate-exempt `tokens.css` made the counted run **436**, over 400 (QA1:5-9, :18) |
| r2 commits | on the same `-r1-chatA` branch, no rebase: `d797b8b` fix (count layout CSS in `app.css` and leave carries for 2b; code head, tree `4a934890`), `46fd3346` hand-back (tree `328d6199`) (V2:19-31) |
| r2 verdict | QA **OK TO OPEN PR** (QA2:5-7) |
| Merge | PR #79 "Step 2: Home, save and load (r2)", merge commit `34fda67498e1f1eac0f6bcff0fecd1f5678d3fa0`, 2026-11-19 03:04 (UK time). Tree `16b91d1bf3bc221ce9cf75a5a18a2b8057c3d0ab` (the same tree CoS and QA merged against `b999f6e6`; V2:142, QA2:24). First parent `b999f6e6` (step-02 r8, step-02b r2, step-03 r9 + QA step-02 reviews), second parent `46fd3346` |
| After the merge | main moved to `4e5a22013c3e2046fa9920a583488bc3c3e32aa6`, which only adds `docs/qa/step-02-r2-review.md` on top of `34fda674` |
| Tests | 1036 + N=3 (project-home, maker-law, maker-build) = **1039 pass / 0 fail**. The two r1 carry tests were removed (HB2, V2:59-62, QA2:10) |
| Size | `git diff --shortstat 772f7aa2..46fd3346 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**'` = 12 files, **377 insertions + 0 deletions** ≤ 400. `tools/maker/app.css` (39) is counted. `tokens.css` is excluded and holds only the token block (V2:74, QA2:14-15) |
| Stamp | `node tools/maker/build.ts <out>` writes `<out>/maker/index.html` and `<out>/maker/701bc957035c/` (V2:104, QA2:12) |
| Smoke | sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, unchanged. 7 ok at 390 and 7 at 360, `TOUCH SMOKE PASS` (V2:120, QA2:11) |
| Play stage | untouched vs the base. `tools/play-stage/` and `tests/tools/touch-play.test.ts` match `772f7aa2` byte for byte; `tests/tools/play-stage-carries.test.ts` is absent (V2:41, QA2:16) |

## (b) Files

From `git diff --name-status 772f7aa2..46fd3346 -- . ':!handback/**'`. Every path is new (A). Line counts are `git diff --numstat` insertions, which equal the file lengths.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `src/editor/project/home.ts` | new | 40 (cap 65) | Pure model, no I/O: `Row`, ULID `projectId`, name check (1–40 code points), `stampNew` / `renameTo` / `duplicate` / `copyName` (`"X copy"`, then `"X copy 2"`), `rowFrom` / `rowBlocked`, sort and relative-time subline, `restorePlan`, `LIVE` / `TRASH` prefixes |
| `src/editor/project/save.ts` | new | 36 (cap 40) | Pure write plan: `expectedRev` first (`staleRev`), then `formatNewer` (`readOnly`), then tmp-order writes (`docs`, `catalogue/slice.json`, `project.json` last) with one `project.rev` bump; `asWrites` for create/duplicate |
| `tools/maker/store.ts` | new | 32 (cap 30) | OPFS store over `opfsStore`, `memoryStore` for tests, `readTree`, `commitWrites` (write all `.tmp`, then rename; a failed tmp write deletes the tmps) and `movePrefix` (copy, remove files, then drop empty directories) |
| `tools/maker/project-files.ts` | new | 12 (cap 15) | The one folder-to-`ProjectFiles` parse: `JSON.parse` each `.json`, typed `unreadable` / `Can't open: …` if it isn't a JSON object. Must not import `src/editor/` |
| `tools/maker/home.ts` | new | 57 (cap 60) | Home UI: New (Demo or Empty), cards, ⋯ menu (Rename, Duplicate, Delete), Undo toast, Trash with Restore, banners, boot / OPFS refusal |
| `tools/maker/project.ts` | new | 8 (cap 30) | Opened-project screen: Back, name, Save (disabled when read-only), the greyed Test button (`disabled`, no `data-act`, `--soon` / `--soon-ink`) |
| `tools/maker/index.html` | new | 9 (cap 10) | Shell page. Three no-cache metas. Loads `./__STAMP__/tokens.css`, then `./__STAMP__/app.css`, then the stamped `home.js` |
| `tools/maker/build.ts` | new | 34 (cap 25) | `node tools/maker/build.ts <out>`: packs JS via play-stage `toJs` / `release` / `sha` / `refuse`, copies tokens, app.css and both templates, writes `templates/files.json`, stamps the folder (12 hex chars), writes `index.html` last, deletes stale stamp folders, writes `<out>/build.json`. Escapes U+2028 / U+2029 in emitted `.json.js` and does not `JSON.parse` the JSON |
| `tools/maker/tokens.css` | new | 80, data (uncounted) | Token block only, byte-identical to r1 `tokens.css` L1–80: `:root` (Light), `html[data-theme="dark"]`, the system `@media` dark rule, the `body` font stack and `font: inherit`. No component, layout or media rules (V2:45, QA2:15) |
| `tools/maker/app.css` | new | 39 (cap 40), **counted** | Every component, layout and media rule, `var(--token)` only, no colour literals. Byte-identical to r1 `tokens.css` L81–119, including the unused `.row` / `.row .btn` rules (QA2:15, :27) |
| `tests/editor/project-home.test.ts` | new | 46 (cap 45) | Names, ids, templates, save, rename, duplicate, trash, stale, failed write, corrupt load, greyed Test |
| `tests/tools/maker-build.test.ts` | new | 30 (cap 15) | Stamp stability and collision, stale-folder cleanup, no-cache metas, `files.json`, export audit, no-storage error |
| `tests/editor/maker-law.test.ts` | new | 34 (cap 25) | Plants: colour literals / `@import` / `@font-face` outside `tokens.css`; document literals; empty `catch`. Also checks `tokens.css` against the style-spec token table, value for value |
| `data/templates/demo.tileproj/**` (16 JSON) | new | data | File-for-file copy of `fixtures/demo.tileproj/`. Same bytes and the same git blob ids as in `step-01a.md` |
| `data/templates/empty.tileproj/**` (4 JSON) | new | data | Minimal valid project: `project.json`, `catalogue/slice.json`, one map `maps/map_01JDEM00000000000000000002.json` and one stage `stages/stage_01JDEM00000000000000000003.json` (ULID names, not `map.json` / `stage.json`) |

Hand-back files under `handback/step-02-home-save-load/r1/` (HANDBACK.md, five 390×844 shots, and the small `changed-files` / `stat` / `checks` / `typecheck` texts) are on the merge tree but are excluded from this list, as they are not product. There is no `test-output.txt` in the tree (V2:49, QA2:16).

## (c) Key code and git commands

Every file's full code is in the appendix at the end of this file, taken from the merge commit `34fda674`. To see it in git:

```
git log --oneline 772f7aa2..46fd3346
git diff --stat 772f7aa2..46fd3346 -- . ':!handback/**'
git diff --shortstat 772f7aa2..46fd3346 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**'
git diff 477e021e..46fd3346          # the r2 rework only
git diff --exit-code 772f7aa2 34fda674 -- tools/play-stage tests/tools/touch-play.test.ts
git show 34fda674:tools/maker/store.ts
```

**A missing `project.json` is not "Newer version"** (`src/editor/project/home.ts:27-28` at `34fda674`). `rowFrom` checks the parsed object first and returns a blocked row:

```ts
export function rowFrom(id: string, files: ProjectFiles): Row {
  if (!isObj(files["project.json"])) return rowBlocked(id, "Can't open: project.json missing");
```

**Empty folders are not listed, and empty directories are removed.** After a move, `movePrefix` deletes the leftover directory tree (`tools/maker/store.ts:26-31`). `refresh` skips a folder with no files (`tools/maker/home.ts:31`, `if (Object.keys(text).length === 0) continue`). That is the r1 fix for the fake "Newer version" card and the Undo duplicate (HB2, V1:198, :354).

**The Undo toast stays up if restore fails** (`tools/maker/home.ts:38`). When the id is already taken, a failed `commitWrites` does `say(got.message); return` without clearing `state.toast`. On the success path (and only then) it does `window.clearTimeout(timer); state.toast = null`.

**Test is the only greyed control** (`tools/maker/project.ts:7`): `<button type="button" class="btn soon" disabled style="background:var(--soon);color:var(--soon-ink)">Test</button>`. It has no `data-act`, so the click dispatcher in `home.ts` never sees it. Save is disabled only for a read-only (newer) project, as the brief requires (QA1:40, QA2:20).

**The r2 CSS split** (`tools/maker/build.ts:11` and `index.html:6`): `bag.set("tokens.css", …)` then `bag.set("app.css", …)`; the shell links tokens, then app.css, then `home.js`, all under `./__STAMP__/`.

**Save order** (`src/editor/project/save.ts:13-14`): `expectedRev` (`staleRev`) is checked before `formatNewer` (`readOnly`). That order was a helper fix in r1 (HB2).

## (d) What went wrong, in order, and the fix

1. **r1 helper: delete left the OPFS folder** (HB1, HB2, commit `6bb80d7`, V1:198). After a move, empty directories stayed. OPFS `list` still returned the project id, so Home showed a card for a folder with no `project.json`. The reader treated that as a newer, read-only project (a fake "Newer version" badge). Undo then saw the id as taken and duplicated the project. Fix: `movePrefix` drops the empty directory tree (`store.ts:30-31`); `refresh` skips a folder with no files (`home.ts:31`).

2. **r1 helper: a missing `project.json` said "Newer version"** (HB1, HB2, V1:354). A folder that still had other files but no `project.json` went through `rowFrom` as read-only newer. Fix: `rowFrom` returns `rowBlocked(id, "Can't open: project.json missing")` (`home.ts:28`). A corrupt JSON file is `Can't open: …` from `parseProject` (`project-files.ts`), with no open button (QA1:14, QA2:18).

3. **r1 helper: the Undo toast was cleared before restore finished** (HB1, HB2). `restore` now clears the toast only after a successful write or move (`home.ts:38`). A failed `commitWrites` returns without clearing it; a thrown `movePrefix` leaves the toast up and the click-handler's `catch` shows the error.

4. **r1 QA must-fix: component CSS hid in the uncounted `tokens.css`** (QA1:5-9, :18, :24-27). Guide r6 allowed `tokens.css` as data. L1–80 were the token block (allowed). L81–119 (39 lines) were layout, cards, buttons, toast, the 390×844 frame and the phone media rule. Counted in, the run was 397 + 39 = **436**, over the 400 limit. No style-only cut fitted inside 400 without packing rules onto one line. Fix in r2 (`d797b8b`): move L81–119 verbatim to the new counted `tools/maker/app.css`, leave `tokens.css` ending at L80, link and pack `app.css` immediately after tokens. The unused `.row` / `.row .btn` rules were kept (see (e) and QA2:27). The stamp changed to `701bc957035c` because `app.css` is a new packed file (QA1:27, V2:104).

5. **r1 QA must-fix: a 6298-line `test-output.txt` in the hand-back** (QA1:19, :28, V1:366). S1a and S1b had committed HANDBACK.md only, with the summary in § Green. r2 deleted `test-output.txt` and put the `ℹ tests/pass/fail/…` lines in § Green (HB2, V2:49). The small `changed-files`, `stat`, `checks` and `typecheck` texts were allowed to stay (QA1:19).

6. **r1 QA must-fix: play-stage carries A and B left this step** (QA1:26, guide r7/r8). They were 59 changed lines on `tools/play-stage/{board,build,load,match,project}.ts`, `tests/tools/touch-play.test.ts` and new `tests/tools/play-stage-carries.test.ts` (N=2 of r1's N=5). r2 reverted those five play-stage files and `touch-play.test.ts` to the base and removed the carry test. Green fell from 1041 to **1039** (N=3). The carries, their tests and the S0 smoke as a play-stage gate live in step 02b (`docs/maker/steps/step-02b-play-stage-carries.md`). Step 2 still runs the S0 smoke because the maker build imports `tools/play-stage/build.ts` (QA1:29, guide r8 L16).

7. **r2 also labelled the hand-back "Code head"** (`d797b8b9` / tree `4a934890`), as QA1 ruling 4 asked (HB2, V2:19-21). The folder stayed `handback/…/r1/` on the same `-r1-chatA` branch; QA accepted that (QA2:28).

8. **r2 was OK and merged without a rebase** (QA2:5-7, :24). Merge-tree of `b999f6e6` and `46fd3346` was clean at tree `16b91d1b`. Green on that tree was 1039/0, and the smoke printed 14/14 ok with PASS (V2:142-144, QA2:24). PR #79 merged as `34fda674`. The merge keeps main's docs (r8 brief, step 02b, step 03 r9, the roadmap), not the branch's older r6 brief.

## (e) Do it right first time

- Base on `772f7aa2` (or `9fc49890`: same code). Floor 1036, land at 1039 (N=3: project-home, maker-law, maker-build). Do not edit `tools/play-stage`, `tests/tools/touch-play.test.ts`, package files, tsconfig, eslint or dep-cruiser. Carries A and B are step 02b, after this merge.
- `tokens.css` holds only the token block (the r1 L1–80 shape): `:root`, dark, the system `@media` dark rule, the `body` font stack and `font: inherit`. Every component, layout and media rule goes in counted `tools/maker/app.css` (`var(--token)` only, no colour literals). Link and pack `app.css` immediately after `tokens.css`.
- Line gate: `git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**'` is 400 or fewer. `app.css` is inside that count. Templates are `.json` only.
- After a move, drop empty OPFS directories and do not list a folder with no files. A missing `project.json` is `Can't open: project.json missing`, never a "Newer version" card. Clear the Undo toast only after a successful restore.
- Test is the only control that is shown but does not work: visible, `disabled`, `--soon`, no click handler. No Empty trash, no deep links, no other greyed control.
- Commit no raw `test-output.txt`. Put the `ℹ tests/pass/fail/…` summary in HANDBACK.md § Green.
- Still run the frozen S0 smoke (`d528795e…`) at 390 and 360, because the maker build imports `tools/play-stage/build.ts`. Do not edit the kit under `handoff/steps/tests/`.
- Copy `data/templates/demo.tileproj/**` byte for byte from `fixtures/demo.tileproj/`. The Empty template uses ULID file names, not `map.json` / `stage.json`.
- The unused `.row` / `.row .btn` rules in `app.css` L29–30 were accepted for this step; drop them in the next maker-touching step (QA2:27).
- Push: author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The token environment variable must hold the real token, not placeholder text. Never print or commit it.

## (f) Rebuild check

Run on the merge `34fda674` (tree `16b91d1b`). `main` at `4e5a2201` is this merge plus the QA r2 review doc only. Re-run on 2026-11-19 at the merge tree: `npm run green` exit 0 with 1039 pass / 0 fail; the official shortstat is 12 files, 377 insertions; the build stamp is `701bc957035c`; the smoke printed every ok line at 390 and 360 and `TOUCH SMOKE PASS` (V2, QA2).

```
git worktree add --detach /tmp/s02 34fda674 && cd /tmp/s02
npm ci && npm run green           # exit 0; tests 1039, fail 0
git diff --shortstat 772f7aa2..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**'
#   12 files changed, 377 insertions(+)
git diff --exit-code 772f7aa2 HEAD -- tools/play-stage tests/tools/touch-play.test.ts   # empty
test ! -f tests/tools/play-stage-carries.test.ts
git diff --name-only 772f7aa2..HEAD -- data/templates | rg -v '\.json$'   # empty
diff -q -r data/templates/demo.tileproj fixtures/demo.tileproj           # identical
git show 477e021e:tools/maker/tokens.css | sed -n '1,80p' | diff - tools/maker/tokens.css   # empty
wc -l tools/maker/tokens.css tools/maker/app.css   # 80 and 39
node tools/maker/build.ts /tmp/s02-out
ls /tmp/s02-out/maker/              # index.html and 701bc957035c/
sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
```

Against the merge tree: on your rebuild branch, `git diff 34fda674 HEAD -- src/editor/project tools/maker tests/editor tests/tools/maker-build.test.ts data/templates` must be empty. The blob table below lists the exact git blob id each file must have at `34fda674`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id.

## QA non-blockers carried forward

From QA2:32-33 (r1 carries 1–7 and 9–11, unchanged) and QA2:26-30 (r2 rulings). Carry 8 (`PlayDocs.recipes` should be required) now belongs to step 02b.

1. The maker bundle ships Effect Designer and render code it doesn't use (7 files, 38 KB) because `store.ts` reuses `opfsStore` from `tools/effect-designer/store.ts`, which the brief required. Move `opfsStore` to a neutral module in Step 3 or later (QA1:44).
2. The OPFS test only greps the source (`maker-build.test.ts`). Add a DOM-level check in Step 3 (QA1:45).
3. The toast reads "Deleted · Undo" plus an Undo button, so Undo shows twice. Change the text to "Deleted" (QA1:46).
4. `saveCurrent` (`home.ts:33`) plans against in-memory files, so `staleRev` never checks the disk. Harmless while there are no in-screen editors; it must re-read `project.json` before editors land (QA1:47).
5. `home.ts` files any non-demo template path under Empty, a silent default. Route by folder name and refuse unknown ones (QA1:48).
6. A rename failure in `commitWrites` (`store.ts:23`) can leave tmps or partial renames. Disclosed in the hand-back (QA1:49, HB2).
7. The maker-law empty-catch regex only matches a catch on one line (QA1:50).
8. *(moved to 02b)* `PlayDocs.recipes` is optional (QA1:51, QA2:33).
9. Add `--header-h` and `--radius` to style-spec's "Also in the token block" list (QA1:52).
10. Guide gate lines should add `':!handback/**'` (step 3 too). r8 of this brief already does (QA1:53).
11. Home has no `--hero` block, unlike shot 01. UX should confirm that MS-01 governs (QA1:54).
12. **r2:** the unused `.row` / `.row .btn` rules in `app.css` L29–30 were kept. Drop them in the next maker-touching step (Step 3) (QA2:27).
13. **r2:** from Step 3 on, a rework gets an `r<N>` folder and title, as `handoff/HAND-BACK.md` says (QA2:28).
14. **Note:** a PR merge commit puts `477e021e` (and its 6298-line `test-output.txt` blob) into main's history but not into its tree. The repo is private. The tree of `34fda674` does not contain that log (QA2:30).

## Blob check

Each file must have exactly this git blob id at `34fda674`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `data/templates/demo.tileproj/catalogue/slice.json` | `ea41249ce217bc450c3137d876f997995c9089d2` | 617 |
| `data/templates/demo.tileproj/maps/map_01JDAM00000000000000000001.json` | `e6f3383fb37573474bbcf162ea3d0b7c087ea06d` | 143 |
| `data/templates/demo.tileproj/project.json` | `fdddf778fa9bfb4785d04b0b4ffa60ca7e66b366` | 48 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` | `0b11d12a20f1aeb30886e8bb1f003d1159c40f32` | 39 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` | `eba78ade350fda49a85a29bb448e089a89f6d179` | 93 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` | `9039e75739fd2bc763ddceea0b396f7ec0d2ec60` | 86 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` | `e70eb19788acda4d9427c1c4271cd54fa1bcf40f` | 89 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` | `e8708b798894a05a02d7e6aa11f35374ad7151b1` | 121 |
| `data/templates/demo.tileproj/stages/stage_01JDAS00000000000000000001.json` | `60796e7129c009b507476570595db80b3e6fc6c5` | 86 |
| `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000001.json` | `548e82e3f52b25f2925426cfed2fac2b0d036b89` | 17 |
| `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000002.json` | `2edfc3fa3b13cf1975a2468fbefdacc2ff59bf8c` | 29 |
| `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000003.json` | `955bb38318ca4e816f5c5c68eefb9796d0ccdab5` | 22 |
| `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000004.json` | `1f8839525259d514eddf0e3ff7278b57fbe52021` | 22 |
| `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000005.json` | `2f9ce57c26350b7cd2295f43598556ec51e2aeed` | 26 |
| `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000006.json` | `2b0dfe593199325d21d6800786ee2faa64c083b3` | 26 |
| `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000007.json` | `ae125ebfa898fa3cdc8a5ff14604c1c3a99c556f` | 26 |
| `data/templates/empty.tileproj/catalogue/slice.json` | `d8f12f48e7e3bfc3d446b272e8db8fb4dd80355f` | 6 |
| `data/templates/empty.tileproj/maps/map_01JDEM00000000000000000002.json` | `6f0f518ba4947657dd840d6ddc94c4ff08c9bd6d` | 10 |
| `data/templates/empty.tileproj/project.json` | `6f8ccc9d17599fa3f5032eff09b422e6d1b7f29f` | 17 |
| `data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json` | `2bed7853330475ace5ffcf8adc5b1aa4d25124da` | 13 |
| `src/editor/project/home.ts` | `058f75390db5348908925525ad959e0ba2005178` | 40 |
| `src/editor/project/save.ts` | `5dee8f8da8303334d5350abe4f2082a19d9407a1` | 36 |
| `tests/editor/maker-law.test.ts` | `98f2ff4756357f885cc51d0a81b9f2eb461f071f` | 34 |
| `tests/editor/project-home.test.ts` | `80d1eaa66f1536508a8c734c014b26bd88f9ccca` | 46 |
| `tests/tools/maker-build.test.ts` | `29878ea7a8144bb24960d0ce30d1d69fa6f31ba2` | 30 |
| `tools/maker/app.css` | `f934171c79569a33a3bf1fcd3e3ee28ec0f78d39` | 39 |
| `tools/maker/build.ts` | `63322f04a8d35eed466928552b2dcf2292d49164` | 34 |
| `tools/maker/home.ts` | `fc9f91fb7bfd4c2e8cfcae3eac04c9b8c6c6ba6b` | 57 |
| `tools/maker/index.html` | `0dd500343afb3cf3687a82a4a9ba830559eb0741` | 9 |
| `tools/maker/project-files.ts` | `0766961848fbf80adcde8f0dbab2f3935d870276` | 12 |
| `tools/maker/project.ts` | `d015b691d9ce252331fa0a591a561772b04616f2` | 8 |
| `tools/maker/store.ts` | `ad28718718b34a49616da0a88b6259427fe668cc` | 32 |
| `tools/maker/tokens.css` | `8ed7c820ac388ca338214155cfe276de93ce7bcd` | 80 |

## Appendix: full code as merged (step 2, PR #79)

New files are given in full, taken from `34fda674`. There are no edited-vs-base product files in this step (the r1 play-stage edits were reverted). Copy them byte for byte; the blob table checks you did.

### `data/templates/demo.tileproj/catalogue/slice.json` (new)

`````json
{
  "kind": "catalogue-slice",
  "formatVersion": 1,
  "schema_version": 3,
  "catalogue_rev": 28,
  "gates": {
    "uses-card-hand": {
      "id": "uses-card-hand"
    },
    "uses-menu": {
      "id": "uses-menu"
    }
  },
  "behaviours": [
    {
      "id": "ability-presentation",
      "closure": "when-used",
      "knobs": [
        {
          "id": "shortcut",
          "type": "picker",
          "rev": 1,
          "default": "all-menu",
          "options": [
            "all-menu",
            "basic-only"
          ]
        },
        {
          "id": "basic_style",
          "type": "picker",
          "rev": 1,
          "default": "button",
          "options": [
            "button"
          ]
        },
        {
          "id": "spells_style",
          "type": "picker",
          "rev": 1,
          "default": "button",
          "options": [
            "button"
          ]
        },
        {
          "id": "custom_groups",
          "type": "list",
          "rev": 1,
          "default": []
        },
        {
          "id": "hand_placement",
          "type": "picker",
          "rev": 1,
          "default": "bottom",
          "options": [
            "bottom"
          ]
        },
        {
          "id": "team_colours",
          "type": "list",
          "rev": 1,
          "default": []
        }
      ]
    },
    {
      "id": "basic-attack",
      "closure": "when-used",
      "knobs": [
        {
          "id": "reach_mode",
          "type": "picker",
          "rev": 1,
          "default": "same-as-step",
          "options": [
            "same-as-step",
            "one-tile-straight",
            "custom-cross"
          ]
        },
        {
          "id": "custom_ns",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 1,
          "max": 9,
          "step": 1
        },
        {
          "id": "custom_ew",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 1,
          "max": 9,
          "step": 1
        },
        {
          "id": "damage",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 0,
          "max": 9,
          "step": 1
        },
        {
          "id": "blocked_by_bodies",
          "type": "toggle",
          "rev": 1,
          "default": true
        },
        {
          "id": "enemy_basic_crosses_barrier",
          "type": "toggle",
          "rev": 1,
          "default": false
        },
        {
          "id": "ability_group",
          "type": "picker",
          "rev": 1,
          "default": "basic",
          "options": [
            "basic"
          ]
        },
        {
          "id": "effect",
          "type": "ref",
          "rev": 1,
          "default": "none"
        }
      ]
    },
    {
      "id": "line-shot",
      "closure": "when-used",
      "knobs": [
        {
          "id": "directions",
          "type": "picker",
          "rev": 1,
          "default": "orthogonal",
          "options": [
            "orthogonal"
          ]
        },
        {
          "id": "range",
          "type": "slider",
          "rev": 1,
          "default": 3,
          "min": 1,
          "max": 9,
          "step": 1
        },
        {
          "id": "damage",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 0,
          "max": 9,
          "step": 1
        },
        {
          "id": "stops_on_first",
          "type": "toggle",
          "rev": 1,
          "default": true
        },
        {
          "id": "barrier_blocks",
          "type": "toggle",
          "rev": 1,
          "default": true
        },
        {
          "id": "caster_class",
          "type": "picker",
          "rev": 1,
          "default": "any",
          "options": [
            "any",
            "archer"
          ]
        },
        {
          "id": "pair_doubles",
          "type": "toggle",
          "rev": 1,
          "default": false
        },
        {
          "id": "neutrals_legal",
          "type": "toggle",
          "rev": 1,
          "default": false
        },
        {
          "id": "hit_class",
          "type": "picker",
          "rev": 1,
          "default": "basic",
          "options": [
            "basic"
          ]
        },
        {
          "id": "mana_cost",
          "type": "slider",
          "rev": 1,
          "default": 0,
          "min": 0,
          "max": 9,
          "step": 1
        },
        {
          "id": "ability_group",
          "type": "picker",
          "rev": 1,
          "default": "spell",
          "options": [
            "spell"
          ]
        },
        {
          "id": "effect",
          "type": "ref",
          "rev": 1,
          "default": "none"
        }
      ]
    },
    {
      "id": "barrier-line",
      "closure": "when-used",
      "knobs": [
        {
          "id": "length",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 1,
          "max": 9,
          "step": 1
        }
      ]
    },
    {
      "id": "adjacency-synergy",
      "closure": "when-used",
      "knobs": [
        {
          "id": "bonus",
          "type": "slider",
          "rev": 1,
          "default": 0,
          "min": 0,
          "max": 9,
          "step": 1
        }
      ]
    },
    {
      "id": "unit-roster",
      "closure": "when-used",
      "knobs": [
        {
          "id": "board_cols",
          "type": "slider",
          "rev": 1,
          "default": 6,
          "min": 1,
          "max": 64,
          "step": 1
        },
        {
          "id": "board_rows",
          "type": "slider",
          "rev": 1,
          "default": 9,
          "min": 1,
          "max": 64,
          "step": 1
        },
        {
          "id": "piece_count",
          "type": "slider",
          "rev": 1,
          "default": 3,
          "min": 1,
          "max": 9,
          "step": 1
        },
        {
          "id": "unit_hp",
          "type": "slider",
          "rev": 1,
          "default": 9,
          "min": 1,
          "max": 99,
          "step": 1
        },
        {
          "id": "unit_atk",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 0,
          "max": 99,
          "step": 1
        },
        {
          "id": "opening_row",
          "type": "picker",
          "rev": 1,
          "default": "bottom",
          "options": [
            "bottom"
          ]
        },
        {
          "id": "clip_cues",
          "type": "list",
          "rev": 1,
          "default": []
        },
        {
          "id": "team_colour",
          "type": "picker",
          "rev": 1,
          "default": "side",
          "options": [
            "side"
          ]
        }
      ]
    },
    {
      "id": "talk",
      "closure": "when-used",
      "knobs": [
        {
          "id": "line",
          "type": "text",
          "rev": 1,
          "default": "",
          "max_len": 128
        },
        {
          "id": "effect",
          "type": "ref",
          "rev": 1,
          "default": "none"
        }
      ]
    },
    {
      "id": "terrain",
      "closure": "always",
      "knobs": [
        {
          "id": "tile_types",
          "type": "list",
          "default": [
            {
              "id": "floor",
              "label": "Floor",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "fallen",
              "label": "Fallen tile (abyss)",
              "open": false,
              "kills_on_landing": true,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "flask",
              "label": "Flask tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "rising",
              "label": "Rising tile (a unit is coming back here)",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "tide",
              "label": "Tide mark",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "warp-mark",
              "label": "Warp mark",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "sword-mark",
              "label": "Sword fade-in tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "boss-cover",
              "label": "Portal boss tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "vines",
              "label": "Vines",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": true,
              "trips": false,
              "buildable": false
            },
            {
              "id": "trap",
              "label": "Trap",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": true,
              "buildable": false
            },
            {
              "id": "water",
              "label": "Water",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "lava",
              "label": "Lava",
              "open": true,
              "kills_on_landing": true,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "wall-block",
              "label": "Wall block",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "path",
              "label": "Path",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "dirt",
              "label": "Dirt",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            }
          ],
          "item": {
            "open": true,
            "kills_on_landing": false,
            "push_can_enter": true,
            "slows_move": false,
            "trips": false,
            "buildable": false
          },
          "reserved": true
        },
        {
          "id": "lethal_landing_scope",
          "type": "picker",
          "default": "any",
          "options": [
            "any",
            "forced_only"
          ]
        },
        {
          "id": "wall_blocks_los",
          "type": "toggle",
          "default": true
        },
        {
          "id": "wall_blocks_shots",
          "type": "toggle",
          "default": true
        },
        {
          "id": "push_into_walls",
          "type": "toggle",
          "default": false
        },
        {
          "id": "lanes_enabled",
          "type": "toggle",
          "default": false
        },
        {
          "id": "lane_axis",
          "type": "picker",
          "default": "row",
          "options": [
            "row",
            "column"
          ],
          "when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "lane_count",
          "type": "slider",
          "default": 3,
          "min": 1,
          "max": 9,
          "step": 1,
          "when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "lane_field_lanes",
          "type": "picker",
          "default": "centre-only",
          "options": [
            "centre-only",
            "any"
          ],
          "when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "centre_lane",
          "type": "picker",
          "default": "lower",
          "options": [
            "lower",
            "upper"
          ],
          "when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        }
      ]
    }
  ]
}
`````

### `data/templates/demo.tileproj/maps/map_01JDAM00000000000000000001.json` (new)

`````json
{
  "kind": "map",
  "formatVersion": 5,
  "id": "map_01JDAM00000000000000000001",
  "rev": 1,
  "name": "Demo 6x9",
  "cols": 6,
  "rows": 9,
  "tile": null,
  "background": {
    "layers": []
  },
  "layers": [
    {
      "id": "ground",
      "tileset": null,
      "aboveUnits": false,
      "visible": true,
      "tiles": [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ]
    }
  ],
  "logic": {
    "terrain": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "palette": {
      "0": "floor",
      "1": "water",
      "2": "wall-block"
    },
    "edges": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/demo.tileproj/project.json` (new)

`````json
{
  "kind": "tile-project",
  "formatVersion": 6,
  "project": {
    "id": "project_01JDAP00000000000000000001",
    "rev": 1,
    "name": "Demo",
    "createdAt": "2026-11-18T00:00:00Z",
    "updatedAt": "2026-11-18T00:00:00Z",
    "copiedFrom": null,
    "catalogueRev": 28,
    "settings": {
      "wrapEdges": false
    },
    "difficulty": {
      "hp": 1,
      "damage": 1,
      "appliesTo": "enemies"
    },
    "stages": [
      "stage_01JDAS00000000000000000001"
    ],
    "rules": [
      "setup_01JDAT00000000000000000002",
      "setup_01JDAT00000000000000000003"
    ],
    "loadout": {
      "roster": [
        "unit_01JDAN00000000000000000001",
        "unit_01JDAN00000000000000000002",
        "unit_01JDAN00000000000000000003"
      ],
      "size": 3,
      "required": [
        "unit_01JDAN00000000000000000001"
      ]
    },
    "render": {
      "excludedStages": [],
      "targets": [
        "browser"
      ],
      "proceduralShip": "auto",
      "credits": true
    },
    "assets": {}
  }
}
`````

### `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000001",
  "rev": 1,
  "name": "Villager talk",
  "behaviourId": "talk",
  "catalogue": {
    "rev": 28
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "line": {
      "source": "user",
      "value": "Hello, traveler.",
      "rev": 1,
      "defaultRef": {
        "rev": 28
      },
      "needsReask": null
    },
    "effect": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 28
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000002",
  "rev": 1,
  "name": "Ability presentation",
  "behaviourId": "ability-presentation",
  "catalogue": {
    "rev": 28
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "shortcut": {
      "source": "user",
      "value": "all-menu",
      "rev": 1,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    },
    "basic_style": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    },
    "spells_style": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    },
    "custom_groups": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 7
      },
      "needsReask": null
    },
    "hand_placement": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    },
    "team_colours": {
      "source": "user",
      "value": [
        {
          "id": "player",
          "label": "Player side",
          "colour": "#2f6fad"
        },
        {
          "id": "rival",
          "label": "Rival side",
          "colour": "#c44a3a"
        },
        {
          "id": "neutral",
          "label": "Neutral side",
          "colour": "#c6a15a"
        },
        {
          "id": "wolves",
          "label": "Wolves",
          "colour": "#b23b32"
        }
      ],
      "rev": 1,
      "defaultRef": {
        "rev": 13
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000003",
  "rev": 1,
  "name": "Army",
  "behaviourId": "unit-roster",
  "catalogue": {
    "rev": 28
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "board_cols": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "board_rows": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "piece_count": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "unit_hp": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "unit_atk": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "opening_row": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 16
      },
      "needsReask": null
    },
    "clip_cues": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 8
      },
      "needsReask": null
    },
    "team_colour": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 9
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000004",
  "rev": 1,
  "name": "Archer basic attack",
  "behaviourId": "basic-attack",
  "catalogue": {
    "rev": 28
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "reach_mode": {
      "source": "user",
      "value": "custom-cross",
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "custom_ns": {
      "source": "user",
      "value": 3,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "custom_ew": {
      "source": "user",
      "value": 3,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "damage": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "blocked_by_bodies": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "enemy_basic_crosses_barrier": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "ability_group": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 7
      },
      "needsReask": null
    },
    "effect": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 8
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000005",
  "rev": 1,
  "name": "Archer line shot",
  "behaviourId": "line-shot",
  "catalogue": {
    "rev": 28
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "directions": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "range": {
      "source": "user",
      "value": 3,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "damage": {
      "source": "user",
      "value": 2,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "stops_on_first": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "barrier_blocks": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": null
    },
    "caster_class": {
      "source": "user",
      "value": "archer",
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "pair_doubles": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "neutrals_legal": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "hit_class": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "mana_cost": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 13
      },
      "needsReask": null
    },
    "ability_group": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 7
      },
      "needsReask": null
    },
    "effect": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 8
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `data/templates/demo.tileproj/stages/stage_01JDAS00000000000000000001.json` (new)

`````json
{
  "kind": "stage",
  "formatVersion": 2,
  "id": "stage_01JDAS00000000000000000001",
  "rev": 1,
  "name": "Demo stage",
  "mapRef": "map_01JDAM00000000000000000001",
  "seed": 24301,
  "playerSpawns": [
    {
      "c": 0,
      "r": 8,
      "facing": "N"
    },
    {
      "c": 1,
      "r": 8
    }
  ],
  "neutrals": [
    {
      "unitId": "unit_01JDAN00000000000000000006",
      "at": {
        "c": 3,
        "r": 4
      }
    },
    {
      "unitId": "unit_01JDAN00000000000000000007",
      "at": {
        "c": 4,
        "r": 4
      },
      "facing": "W",
      "side": "player"
    },
    {
      "unitId": "unit_01JDAN00000000000000000005",
      "at": {
        "c": 5,
        "r": 4
      },
      "facing": "S",
      "setupIds": [
        "setup_01JDAT00000000000000000001"
      ]
    }
  ],
  "sides": {
    "enemyPool": "wolves"
  },
  "enemyPool": {
    "mode": "fixed",
    "entries": [
      {
        "unitId": "unit_01JDAN00000000000000000004",
        "at": {
          "c": 2,
          "r": 0
        },
        "facing": "S"
      },
      {
        "unitId": "unit_01JDAN00000000000000000004",
        "at": {
          "c": 3,
          "r": 0
        }
      }
    ]
  },
  "loadout": null,
  "rules": [],
  "overrides": {
    "setups": {},
    "units": {}
  },
  "difficulty": null,
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000001.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000001",
  "rev": 1,
  "name": "Knight",
  "sprite": null,
  "setupIds": [],
  "stats": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000002.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000002",
  "rev": 1,
  "name": "Archer",
  "sprite": null,
  "setupIds": [
    "setup_01JDAT00000000000000000004",
    "setup_01JDAT00000000000000000005"
  ],
  "stats": {
    "unit_hp": {
      "value": 6,
      "rev": 1
    },
    "unit_atk": {
      "value": 2,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000003.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000003",
  "rev": 1,
  "name": "Cleric",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 7,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000004.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000004",
  "rev": 1,
  "name": "Wolf",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 4,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000005.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000005",
  "rev": 1,
  "name": "Villager",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 4,
      "rev": 1
    },
    "unit_atk": {
      "value": 0,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000006.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000006",
  "rev": 1,
  "name": "Crate",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 3,
      "rev": 1
    },
    "unit_atk": {
      "value": 0,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/demo.tileproj/units/unit_01JDAN00000000000000000007.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000007",
  "rev": 1,
  "name": "Merchant",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 5,
      "rev": 1
    },
    "unit_atk": {
      "value": 0,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `data/templates/empty.tileproj/catalogue/slice.json` (new)

`````json
{
  "kind": "catalogue-slice",
  "formatVersion": 1,
  "catalogue_rev": 1,
  "behaviours": []
}
`````

### `data/templates/empty.tileproj/maps/map_01JDEM00000000000000000002.json` (new)

`````json
{
  "kind": "map",
  "formatVersion": 5,
  "id": "map_01JDEM00000000000000000002",
  "rev": 1,
  "name": "Blank",
  "cols": 1,
  "rows": 1,
  "logic": { "terrain": [0], "palette": { "0": "floor" }, "edges": [] }
}
`````

### `data/templates/empty.tileproj/project.json` (new)

`````json
{
  "kind": "tile-project",
  "formatVersion": 6,
  "project": {
    "id": "project_01JDEM00000000000000000001",
    "rev": 1,
    "name": "Empty",
    "createdAt": "2026-11-18T00:00:00Z",
    "updatedAt": "2026-11-18T00:00:00Z",
    "copiedFrom": null,
    "catalogueRev": 1,
    "settings": { "wrapEdges": false },
    "stages": ["stage_01JDEM00000000000000000003"],
    "rules": [],
    "loadout": { "roster": [], "size": 1, "required": [] }
  }
}
`````

### `data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json` (new)

`````json
{
  "kind": "stage",
  "formatVersion": 2,
  "id": "stage_01JDEM00000000000000000003",
  "rev": 1,
  "name": "Blank",
  "mapRef": "map_01JDEM00000000000000000002",
  "playerSpawns": [],
  "neutrals": [],
  "enemyPool": { "mode": "fixed", "entries": [] },
  "loadout": null,
  "rules": []
}
`````

### `src/editor/project/home.ts` (new)

`````ts
import { readProject, type ProjectFiles } from "../../project/load/index.ts";
export type DocText = Readonly<Record<string, string>>;
export type Row = { readonly id: string; readonly name: string; readonly updatedAt: string; readonly stages: number; readonly readOnly: boolean; readonly fixing: number; readonly error: string | null; readonly badge: string | null };
const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export const LIVE = "tileengine/projects/", TRASH = "tileengine/projects/.deleted/";
export const prefix = (id: string, trash = false): string => `${trash ? TRASH : LIVE}${id}/`;
export function ulid(now: number, bytes: Uint8Array): string {
  if (bytes.length !== 16) throw new Error("ulid: need 16 bytes");
  const t = Math.floor(now); let n = Number.isFinite(t) && t > 0 ? t : 0;
  const time = Array.from({ length: 10 }, () => { const c = B32[n % 32] ?? "0"; n = Math.floor(n / 32); return c; }).reverse().join("");
  return time + [...bytes].map((b) => B32[b % 32] ?? "0").join("");
}
export const projectId = (now: number, bytes: Uint8Array): string => `project_${ulid(now, bytes)}`;
export function checkName(raw: string): string | null { const name = raw.trim(), n = [...name].length; return n === 0 ? "Give your game a name" : n > 40 ? "Use 40 characters or fewer" : null; }
export function copyName(name: string, taken: readonly string[]): string { const base = `${name} copy`; if (!taken.includes(base)) return base; let i = 2; while (taken.includes(`${base} ${i}`)) i += 1; return `${base} ${i}`; }
function manifest(files: DocText): Record<string, unknown> { const raw = files["project.json"]; if (raw === undefined) throw new Error("missing project.json"); const doc = JSON.parse(raw) as unknown; if (!isObj(doc) || !isObj(doc["project"])) throw new Error("missing project.json"); return doc; }
export function stampNew(files: DocText, name: string, id: string, now: string): DocText { const err = checkName(name); if (err !== null) throw new Error(err); const doc = manifest(files), project = doc["project"] as Record<string, unknown>; project["id"] = id; project["name"] = name.trim(); project["rev"] = 1; project["createdAt"] = now; project["updatedAt"] = now; project["copiedFrom"] = null; return { ...files, "project.json": JSON.stringify(doc) }; }
export function renameTo(files: DocText, name: string): DocText { const err = checkName(name); if (err !== null) throw new Error(err); const doc = manifest(files); (doc["project"] as Record<string, unknown>)["name"] = name.trim(); return { ...files, "project.json": JSON.stringify(doc) }; }
export function duplicate(files: DocText, newId: string, now: string, taken: readonly string[]): DocText {
  const doc = manifest(files), project = doc["project"] as Record<string, unknown>;
  const prevName = typeof project["name"] === "string" ? project["name"] : "Project", prevId = typeof project["id"] === "string" ? project["id"] : "", prevRev = typeof project["rev"] === "number" ? project["rev"] : 0;
  project["id"] = newId; project["name"] = copyName(prevName, taken); project["copiedFrom"] = { projectId: prevId, rev: prevRev, at: now }; project["updatedAt"] = now;
  return { ...files, "project.json": JSON.stringify(doc) };
}
export function rowBlocked(id: string, message: string): Row { const error = message.startsWith("Can't open:") ? message : `Can't open: ${message}`; return { id, name: "Project", updatedAt: "", stages: 0, readOnly: false, fixing: 0, error, badge: null }; }
export function rowFrom(id: string, files: ProjectFiles): Row {
  if (!isObj(files["project.json"])) return rowBlocked(id, "Can't open: project.json missing");
  const load = readProject(files), root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null, hard = load.report.filter((item) => item.severity === "hard").length;
  return { id, name: project !== null && typeof project["name"] === "string" ? project["name"] : "Project", updatedAt: project !== null && typeof project["updatedAt"] === "string" ? project["updatedAt"] : "", stages: project !== null && Array.isArray(project["stages"]) ? project["stages"].length : 0, readOnly: load.readOnly, fixing: load.readOnly ? 0 : hard, error: null, badge: load.readOnly ? "Newer version" : hard > 0 ? `Needs fixing (${hard})` : null };
}
export function sortRows(rows: readonly Row[]): readonly Row[] { return [...rows].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0)); }
export function subline(row: Row, nowMs: number): string {
  if (row.error !== null) return row.error;
  const then = Date.parse(row.updatedAt), sec = Number.isFinite(then) ? Math.max(0, Math.floor((nowMs - then) / 1000)) : -1;
  const ago = sec < 0 ? "unknown" : sec < 60 ? "just now" : sec < 3600 ? `${Math.floor(sec / 60)} min ago` : sec < 86400 ? `${Math.floor(sec / 3600)} h ago` : `${Math.floor(sec / 86400)} d ago`;
  return `Edited ${ago} · ${row.stages} ${row.stages === 1 ? "stage" : "stages"}`;
}
export function restorePlan(id: string, idTaken: boolean, files: DocText, newId: string, now: string, taken: readonly string[]): { readonly id: string; readonly files: DocText } { return idTaken ? { id: newId, files: duplicate(files, newId, now, taken) } : { id, files }; }
export function storedRev(files: ProjectFiles): number { const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null; return project !== null && typeof project["rev"] === "number" ? project["rev"] : 0; }
`````

### `src/editor/project/save.ts` (new)

`````ts
import { versionRows } from "../../project/load/migrate.ts";
import type { ProjectFiles, ReportRow } from "../../project/load/types.ts";
export type DocText = Readonly<Record<string, string>>;
export type SavePlan = { readonly ok: true; readonly writes: readonly { readonly path: string; readonly text: string }[] } | { readonly ok: false; readonly error: "staleRev" | "readOnly" | "writeFailed"; readonly path: string; readonly message: string; readonly rows: readonly ReportRow[] };
const MSG = { staleRev: "This project changed somewhere else. Reopen it to see the latest.", readOnly: "Made with a newer TileEngine. Open only." } as const;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const DOC = /^(?:maps|stages|units|setups)\/[^/]+\.json$/;
const fail = (error: "staleRev" | "readOnly" | "writeFailed", path: string, message: string): SavePlan => ({ ok: false, error, path, message, rows: [{ code: error, severity: "hard", path, detail: message }] });
export function planSave(stored: DocText, next: DocText, expectedRev: number, now: string): SavePlan {
  const parsed: Record<string, unknown> = {};
  for (const [path, text] of Object.entries(stored)) { if (!path.endsWith(".json")) continue; try { parsed[path] = JSON.parse(text) as unknown; } catch { return fail("writeFailed", path, `Can't open: ${path} invalid JSON`); } }
  const root = parsed["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null, rev = project !== null && typeof project["rev"] === "number" ? project["rev"] : null;
  if (rev !== expectedRev) return fail("staleRev", "project.json", MSG.staleRev);
  if (versionRows(parsed as ProjectFiles).some((row) => row.code === "formatNewer")) return fail("readOnly", "project.json", MSG.readOnly);
  const changed = [...new Set([...Object.keys(stored), ...Object.keys(next)])].filter((path) => (stored[path] ?? null) !== (next[path] ?? null));
  if (changed.length === 0) return { ok: true, writes: [] };
  const render = (path: string, manifestDoc: boolean): string => {
    const text = (manifestDoc ? next[path] ?? stored[path] : next[path]) ?? "";
    if (!manifestDoc && !DOC.test(path) && path !== "catalogue/slice.json") return text;
    let doc: unknown; try { doc = JSON.parse(text) as unknown; } catch { throw new Error(path); }
    if (!isObj(doc)) throw new Error(path);
    if (manifestDoc && isObj(doc["project"])) { doc["project"]["rev"] = rev + 1; doc["project"]["updatedAt"] = now; } else { if (typeof doc["rev"] === "number") doc["rev"] += 1; doc["updatedAt"] = now; }
    return JSON.stringify(doc);
  };
  try {
    const writes = changed.filter((path) => path !== "project.json" && path !== "catalogue/slice.json").sort().map((path) => ({ path, text: render(path, false) }));
    if (changed.includes("catalogue/slice.json")) writes.push({ path: "catalogue/slice.json", text: render("catalogue/slice.json", false) });
    writes.push({ path: "project.json", text: render("project.json", true) });
    return { ok: true, writes };
  } catch (e) { const path = e instanceof Error ? e.message : "project.json"; return fail("writeFailed", path, `Couldn't save ${path}. Your phone may be full. Your last save is safe.`); }
}
export function asWrites(files: DocText): { readonly path: string; readonly text: string }[] {
  const writes = Object.entries(files).filter(([path]) => path !== "project.json").sort(([a], [b]) => (a < b ? -1 : 1)).map(([path, text]) => ({ path, text })), project = files["project.json"];
  if (project !== undefined) writes.push({ path: "project.json", text: project });
  return writes;
}
`````

### `tests/editor/maker-law.test.ts` (new)

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
  const dir = mkdtempSync(join(tmpdir(), "law-"));
  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
  rmSync(dir, { recursive: true });
});
`````

### `tests/editor/project-home.test.ts` (new)

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
  const html = projectScreen({ name: "My game", stages: 1, dirty: true, readOnly: false, banner: null }); assert.match(html, /<button[^>]*disabled[^>]*>Test<\/button>/); assert.match(html, /var\(--soon\)/); assert.equal(/onclick|addEventListener/.test(html), false);
});
`````

### `tests/tools/maker-build.test.ts` (new)

`````ts
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { test } from "node:test";
import { build } from "../../tools/maker/build.ts";
import { ROOT } from "../../tools/play-stage/build.ts";
const SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; });
test("maker build stamps, refuses a collision, drops stale folders, and audits the output", () => {
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
  const src = mkdtempSync(join(tmpdir(), "maker-src-")); for (const dir of ["src", "tools", "data"]) cpSync(join(ROOT, dir), join(src, dir), { recursive: true });
  const proj = join(src, "data/templates/empty.tileproj/project.json"); writeFileSync(proj, readFileSync(proj, "utf8") + "\n");
  const out3 = mkdtempSync(join(tmpdir(), "maker-")); build(out3, SHA, src); const next = readdirSync(join(out3, "maker")).find((name) => name !== "index.html");
  assert.notEqual(next, stamp); writeFileSync(join(maker, stamp, "tokens.css"), "changed"); assert.throws(() => build(out, SHA), /different files/);
  build(out, SHA, src); assert.deepEqual(readdirSync(maker).filter((name) => name !== "index.html"), [next]);
  assert.match(readFileSync(join(ROOT, "tools/maker/home.ts"), "utf8"), /This browser can't save projects here\. Open the app from its web address\./);
  for (const dir of [out, out2, out3, src]) rmSync(dir, { recursive: true });
});
`````

### `tools/maker/app.css` (new)

`````css
.app { height: 100dvh; min-height: 100dvh; background: var(--bg); color: var(--ink); display: flex; flex-direction: column; }
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
.banner { margin: 0; padding: 12px; border-radius: var(--radius); background: var(--warn-soft); border: 1px solid var(--warn-line); color: var(--warn); font-weight: 700; }
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
.row { display: flex; gap: 8px; }
.row .btn { flex: 1; }
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

### `tools/maker/build.ts` (new)

`````ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, refuse, release, sha, toJs } from "../play-stage/build.ts";
const ENTRY = "tools/maker/home.ts";
const collect = (root: string): Map<string, string> => {
  const bag = new Map<string, string>(), seen = new Set<string>(), temps: string[] = [];
  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, release(raw, rel), walk)); };
  const walkDir = (dir: string, rel: string): void => { for (const name of readdirSync(dir).sort()) { const path = join(dir, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(path).isDirectory()) walkDir(path, next); else { const key = `templates/${next}`; bag.set(key, readFileSync(path, "utf8")); temps.push(key); } } };
  walk(ENTRY); bag.set("tokens.css", readFileSync(join(root, "tools/maker/tokens.css"), "utf8")); bag.set("app.css", readFileSync(join(root, "tools/maker/app.css"), "utf8")); walkDir(join(root, "data/templates"), ""); bag.set("templates/files.json", `${JSON.stringify({ files: temps }, null, 2)}\n`); return bag;
};
/** `<out>/maker/index.html` is the only unstamped file. The stamp is 12 hex chars of the sorted path+sha list. */
export function build(out: string, commit: string, root: string = ROOT): string {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha");
  const bag = collect(root), names = [...bag.keys()].sort(), stamp = sha(names.map((name) => `${name} ${sha(bag.get(name) ?? "")}`).join("\n")).slice(0, 12);
  const maker = join(out, "maker"), dir = join(maker, stamp);
  if (existsSync(dir) && names.some((name) => !existsSync(join(dir, name)) || readFileSync(join(dir, name), "utf8") !== (bag.get(name) ?? ""))) throw new Error(`build: maker/${stamp} already exists with different files`);
  mkdirSync(dir, { recursive: true });
  for (const name of names) { const dest = join(dir, name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, bag.get(name) ?? ""); }
  const html = readFileSync(join(root, "tools/maker/index.html"), "utf8").replaceAll("__STAMP__", stamp);
  writeFileSync(join(maker, "index.html"), html);
  for (const name of readdirSync(maker)) if (name !== stamp && name !== "index.html") rmSync(join(maker, name), { recursive: true });
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

### `tools/maker/home.ts` (new)

`````ts
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "trash" | "fatal"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean };
const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, files: {}, rev: 0, dirty: false, readOnly: false };
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
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner }) + toast; return; }
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
async function run(act: string): Promise<void> {
  if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
  if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent();
}
async function boot(): Promise<void> {
  paint();
  try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
  try {
    const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = await got.text(); }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
document.addEventListener("input", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-name")) state.name = node.value; });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && state.screen === "project") void saveCurrent(); });
void boot();
`````

### `tools/maker/index.html` (new)

`````html
<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>My games</title>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0">
<link rel="stylesheet" href="./__STAMP__/tokens.css"><link rel="stylesheet" href="./__STAMP__/app.css"><script type="module" src="./__STAMP__/tools/maker/home.js"></script>
</head>
<body><div id="app" class="app"></div></body>
</html>
`````

### `tools/maker/project-files.ts` (new)

`````ts
import type { ProjectFiles } from "../../src/project/load/types.ts";
export type Unreadable = { readonly ok: false; readonly error: "unreadable"; readonly path: string; readonly message: string };
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export function parseProject(files: Readonly<Record<string, string>>): { readonly ok: true; readonly files: ProjectFiles } | Unreadable {
  const out: Record<string, unknown> = {};
  for (const [path, text] of Object.entries(files)) {
    if (!path.endsWith(".json")) { out[path] = text; continue; }
    try { const doc = JSON.parse(text) as unknown; if (!isObj(doc)) return { ok: false, error: "unreadable", path, message: `Can't open: ${path} is not a JSON object` }; out[path] = doc; }
    catch (e) { return { ok: false, error: "unreadable", path, message: `Can't open: ${path} ${e instanceof SyntaxError ? e.message : "invalid JSON"}` }; }
  }
  return { ok: true, files: out };
}
`````

### `tools/maker/project.ts` (new)

`````ts
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export function projectScreen(input: { readonly name: string; readonly stages: number; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null }): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
  const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}<h2>${esc(input.name)}</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p><div class="test-wrap"><button type="button" class="btn soon" disabled style="background:var(--soon);color:var(--soon-ink)">Test</button></div></div>`;
}
`````

### `tools/maker/store.ts` (new)

`````ts
import { opfsStore, type Dir } from "../effect-designer/store.ts";
export type MakerStore = { read(path: string): Promise<string | null>; write(path: string, text: string): Promise<void>; remove(path: string): Promise<void>; list(dir: string): Promise<string[]>; rename(from: string, to: string): Promise<void> };
export type WriteResult = { readonly ok: true } | { readonly ok: false; readonly error: "writeFailed"; readonly path: string; readonly message: string; readonly rows: readonly { readonly code: "writeFailed"; readonly severity: "hard"; readonly path: string; readonly detail: string }[] };
type Handle = { move?: (dir: Dir, name: string) => Promise<void> };
const failed = (path: string): WriteResult => { const message = `Couldn't save ${path}. Your phone may be full. Your last save is safe.`; return { ok: false, error: "writeFailed", path, message, rows: [{ code: "writeFailed", severity: "hard", path, detail: message }] }; };
export function memoryStore(): MakerStore & { readonly files: Map<string, string>; failOn(path: string): void } {
  const files = new Map<string, string>(); let fail = "";
  return { files, failOn(path) { fail = path; }, async read(path) { return files.has(path) ? files.get(path) ?? "" : null; }, async write(path, text) { if (fail !== "" && path === fail) throw new Error("full"); files.set(path, text); }, async remove(path) { files.delete(path); }, async rename(from, to) { if (fail !== "" && to === fail) throw new Error("full"); const text = files.get(from); if (text === undefined) throw new Error(`missing ${from}`); files.set(to, text); files.delete(from); }, async list(dir) { const pre = dir.endsWith("/") ? dir : `${dir}/`, names = new Set<string>(); for (const key of files.keys()) if (key.startsWith(pre)) { const rest = key.slice(pre.length), cut = rest.indexOf("/"); if (rest !== "") names.add(cut === -1 ? rest : rest.slice(0, cut)); } return [...names].sort(); } };
}
export function makerStore(root: Dir): MakerStore {
  const base = opfsStore(root);
  return { read: (path) => base.read(path), write: (path, text) => base.write(path, text), remove: (path) => base.remove(path), list: (dir) => base.list(dir), async rename(from, to) { const parts = from.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const handle = await dir.getFileHandle(leaf) as Handle, destParts = to.split("/"), destLeaf = destParts.pop() ?? ""; let dest = root; for (const part of destParts) dest = await dest.getDirectoryHandle(part, { create: true }); if (handle.move !== undefined) { await handle.move(dest, destLeaf); return; } const text = await base.read(from); if (text === null) throw new Error(`missing ${from}`); await base.write(to, text); await base.remove(from); } };
}
export async function readTree(store: MakerStore, folder: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {}, pre = folder.endsWith("/") ? folder : `${folder}/`;
  const walk = async (dir: string, rel: string): Promise<void> => { for (const name of await store.list(dir)) { const child = `${dir}${name}`, next = rel === "" ? name : `${rel}/${name}`; let text: string | null = null, dirChild = false; try { text = await store.read(child); } catch (e) { if (e instanceof Error && e.name === "TypeMismatchError") dirChild = true; else throw e; } if (dirChild || (text === null && (await store.list(`${child}/`)).length > 0)) await walk(`${child}/`, next); else if (text !== null) out[next] = text; else throw new Error(`missing ${child}`); } };
  await walk(pre, ""); return out;
}
export async function commitWrites(store: MakerStore, folder: string, writes: readonly { readonly path: string; readonly text: string }[]): Promise<WriteResult> {
  if (writes.length === 0) return { ok: true };
  const pre = folder.endsWith("/") ? folder : `${folder}/`, tmps: string[] = [];
  for (const write of writes) { const tmp = `${pre}${write.path}.tmp`; try { await store.write(tmp, write.text); tmps.push(tmp); } catch (e) { const pending: string[] = []; for (const tmpPath of tmps) { try { await store.remove(tmpPath); } catch (c) { pending.push(`${tmpPath}: ${c instanceof Error ? c.message : "remove failed"}`); } } if (pending.length > 0) throw new Error(`${e instanceof Error ? e.message : "write failed"}; cleanup ${pending.join("; ")}`); return failed(write.path); } }
  for (const write of writes) { try { await store.rename(`${pre}${write.path}.tmp`, `${pre}${write.path}`); } catch { return failed(write.path); } }
  return { ok: true };
}
export async function movePrefix(store: MakerStore, from: string, to: string): Promise<void> {
  const files = await readTree(store, from), src = from.endsWith("/") ? from : `${from}/`, dest = to.endsWith("/") ? to : `${to}/`, wrote: string[] = [];
  for (const [rel, text] of Object.entries(files)) { try { await store.write(`${dest}${rel}`, text); wrote.push(rel); } catch (e) { for (const relDone of wrote) await store.remove(`${dest}${relDone}`); throw e; } }
  for (const rel of Object.keys(files)) await store.remove(`${src}${rel}`);
  const drop = async (dir: string): Promise<void> => { const pre = dir.endsWith("/") ? dir : `${dir}/`; for (const name of await store.list(pre)) await drop(`${pre}${name}`); await store.remove(pre.slice(0, -1)); };
  await drop(src);
}
`````

### `tools/maker/tokens.css` (new)

`````css
:root {
  --bg: #f4f5f7;
  --surface: #ffffff;
  --surface-2: #f8f9fb;
  --ink: #12141a;
  --muted: #5c6578;
  --line: #d8dde8;
  --accent: #2f5bff;
  --accent-ink: #ffffff;
  --accent-soft: #e8edff;
  --danger: #b42318;
  --danger-soft: #fef3f2;
  --warn: #93370d;
  --warn-soft: #fffaeb;
  --warn-line: #fedf89;
  --ok: #1d6b3a;
  --ok-soft: #ecfdf3;
  --soon: #98a2b3;
  --focus: #1a3fd4;
  --seg-line: #7a8394;
  --shadow: 0 8px 24px rgba(18,20,26,.08);
  --hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff);
  --hero-ink: #fff;
  --scrim: rgba(15,23,42,.45);
  --sheet-shadow: 0 -8px 32px rgba(0,0,0,.18);
  --danger-line: #fecdca;
  --soon-ink: #fff;
  --frame-bg: #0e1118;
  --frame-shadow: 0 20px 60px rgba(0,0,0,.45);
  --header-h: 56px;
  --radius: 16px;
}
html[data-theme="dark"] {
  --bg: #0f1218;
  --surface: #1a1f2a;
  --surface-2: #151a23;
  --ink: #e8ecf5;
  --muted: #9aa3b5;
  --line: #2c3444;
  --accent: #6b8cff;
  --accent-ink: #0b1020;
  --accent-soft: #1e2a4a;
  --danger: #ff8a7a;
  --danger-soft: #3a1c1a;
  --warn: #f5c26b;
  --warn-soft: #3a2e14;
  --warn-line: #6b5420;
  --ok: #7bd99a;
  --ok-soft: #14301f;
  --soon: #6b7385;
  --focus: #8aa4ff;
  --seg-line: #8a92a3;
  --shadow: 0 8px 24px rgba(0,0,0,.45);
}
@media (prefers-color-scheme: dark) {
  html[data-appearance="system"] {
    --bg: #0f1218;
    --surface: #1a1f2a;
    --surface-2: #151a23;
    --ink: #e8ecf5;
    --muted: #9aa3b5;
    --line: #2c3444;
    --accent: #6b8cff;
    --accent-ink: #0b1020;
    --accent-soft: #1e2a4a;
    --danger: #ff8a7a;
    --danger-soft: #3a1c1a;
    --warn: #f5c26b;
    --warn-soft: #3a2e14;
    --warn-line: #6b5420;
    --ok: #7bd99a;
    --ok-soft: #14301f;
    --soon: #6b7385;
    --focus: #8aa4ff;
    --seg-line: #8a92a3;
    --shadow: 0 8px 24px rgba(0,0,0,.45);
  }
}
body { margin: 0; background: var(--frame-bg); color: var(--ink); font-family: "Segoe UI", system-ui, -apple-system, sans-serif; font-size: 16px; }
button, input { font: inherit; }
`````

