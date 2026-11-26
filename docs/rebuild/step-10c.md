# Rebuild record: step 10c, the maker's effect editor (Effects list, edit, Duplicate, delete into .deleted/, the Effect row, effectNotRule)

Original brief: [`docs/maker/steps/step-10c-effect-editor.md`](../maker/steps/step-10c-effect-editor.md) on the merge (r2, blob `93dc05d4`, sha256 `5702669dae880fbd1ab45ffe487aabc48178f3723b978010de8c3b9826174593`, 110 lines). Where 10c sits L13; Delivery L19; Goal L26; Read first L36; Rules L44; Build L53; Named tests L67; Smoke L74; Must NOT L78; Done when L82; Measured L87; Baseline republish L95; Carries L98. Count command L65; hard per-file caps L56–62; hard gate 400 at L63 (caps sum 364; trial 254). The guide still prints the trial test-file cap of 90 at L61; **EA ruling 2026-11-26** raised only that file's cap to 92 so the two joined lines could be split (quoted in (d)). This is **10c**, roadmap step 10's editor half, after 10b (effect data, merged as `10ab12d6`). It is not the built-in effect library (that is 10d) and it does not take the full designer (steps, parts, pictures) into the maker (step 33). It teaches the Effects list, New, the play-drawn knobs, Duplicate, delete into `effects/.deleted/` with undo, the **Effect** row on basic attack and line shot (None and saved effects only; `a:fx:` writes only a listed id), and DSK `effectNotRule` at the same pointer `brokenRef` would use. The merge keeps main's r2 guide (not in the Build table; the branch never edited it). Current main adds only the 10c r1 rework review. Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #105 and branch `step/step-10c-effect-editor-r1-chatA` (r1 tip `26b9e8ec`, r1 code head `1fcb138d`; fix code `2d2e4064`, fix tip `a496ebe6`; rework code head `780eb650`, rework tip `68eaf1a2`); `handback/step-10c-effect-editor/r1/HANDBACK.md` at `68eaf1a2` and on the merge (HB, blob `445fc8cc`, 136 lines, sha256 `253dfab0b6af20a9ae5a596897da2610f3e1cf51d4ac79491812e2a02e40b358`). CoS verify reports: r1 `/workspace/share/step-10c-r1-verify/report.md` (V1, 45 lines, sha256 `003f42a51cce1d451bf1287e99a89a1acf2d1dec050b99f902748af08e934da2`, hash-object `40d357efa0217964e7db6dd254faa93dc16df83b`), **FAIL** on s10c; r1 fix `/workspace/share/step-10c-r1fix-verify/report.md` (V2, 44 lines, sha256 `a959887e84d597678bc06e7ee1858e9b4aca02df2d1decdedb868efe30774f6a`, hash-object `d3ac8aad95cf38d073373d2f515e867af68144f0`), **PASS**; r1 rework `/workspace/share/step-10c-r1rework-verify/report.md` (V3, 40 lines, sha256 `368aaad12ebbcc935a99828717b938915229b217c3c1b37ef9a529e2d60c64d2`, hash-object `4fcafd9236c65501cb1693fc83bcb151b649c387`), **PASS**. `docs/qa/step-10c-r1-review.md` on main `4f9eb79c` (QA1, blob `19481bc2`, 15 lines, sha256 `554a6b49fd0e5777cfd1f05792f9ff655c044996e822c8e8feeb5c97d8b72f0b`): **REWORK (one small fix), then OK TO MERGE**. `docs/qa/step-10c-r1-rework-review.md` on main `f0d61515` (QA2, blob `0a2751d3`, 9 lines, sha256 `9ca30389fb6db75e5175db0885b2aa107b9016a03b2da52338ddd30cc0c38f07`): **OK TO MERGE**. QA postmerge on `699bdb83` **PASSED** (2026-11-26 03:34 UK time; tree `d718df66`, parent 2 `68eaf1a2`, noreply, `merge-base..tip == parent1..merge`, pins 5/5, green 1157/0, smoke 0 fail; the only warning was that main had moved one commit by the QA rework review `f0d61515`, which was expected). Line cites use HB, V1, V2, V3, QA1 and QA2. Product line cites are at merge `699bdb83` (tree `d718df66`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `76fd750256e5342f3e6ff691b73b261fd62f3661`, 2026-11-25 21:10 (UK time), tree `87a580b4`, the 10b rebuild record + README row 27 + QA rebuild review. Floor **1157** tests (guide L9: 10b's 1152 + N=5). After this merge the floor is **1157**. The guide was trialled on `0673be7e` + the 10b r2 trial patch; the go-line re-pinned the base to this main after 10b merged. Later main `0a29cc18` (2026-11-25 21:12 UK time) added the 10c paste, then `4f9eb79c` added the r1 QA review, docs-only. The product count against `4f9eb79c` is the same 329 as against the go-line base |
| Main at merge | `4f9eb79cb1cebe0c8d3e884e5b0ec9d6cd6c85af`, 2026-11-26 02:09 (UK time), tree `45d42841`, the 10c paste then `docs/qa/step-10c-r1-review.md`, docs-only on `76fd7502`. This is the merge's first parent. Official 10c product against this parent is the same 329 as against the go-line base |
| r1 commits | on `step/step-10c-effect-editor-r1-chatA`: `1fcb138d378667b04573faf910badc5c9c1eacba` feat(maker): step 10c effect editor (r1 code head, tree `c377cca8db0d68c82f829814d6f226c1b7428a99`, 2026-11-25 23:18 UK time), `26b9e8ec4c3e5b1fbbe702d3836d21c2b33f3109` docs(handback): step 10c effect editor r1 (tree `d9dcb42fc2c5773981648d3e456f630d24291bec`, 2026-11-25 23:25 UK time). Then the fix and rework below. The whole branch is linear, six commits, no merges, fast-forward only. Author and committer on every commit `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Each tip vs its code head is the r1 hand-back folder only: `HANDBACK.md`. Smoke shots were produced and not committed |
| r1 verdict | Product green was 1157/0 and the official count was 320 (7 Build-table files, +308/−12), with every then-written cap kept, but **s10c was not green**. CoS verify of r1 was **FAIL** (V1, sha256 `003f42a5…`). First run: steps 3–4 timed out at 390, all 4 ok at 360; a solo retry failed steps 3–4 at both widths. Root cause (later named in the fix hand-back and confirmed by an instrumented dump): after `a:fx` saves, `paint()` replaces `#app` and the unit body scrolls back to the top, so the old `tap` had already measured `a:shut` and at 390 the touch hit `u:rename`. `a:shut` never ran, so Test (closed list only) never appeared. Predicted merge tree onto then-main `0a29cc18` was `ecb454ae` (V1); not merged |
| Fix commits | `2d2e4064a1ce280af2f11eefa2d48b7b5be91566` fix(maker): step 10c wait for the closed ability list before Test (tree `db1f30e3a4e1fa8b5ab33974f255afb7fe7aa674`, 2026-11-26 00:19 UK time), `a496ebe6d651b3abe22a307ba93d844669511326` docs(handback): step 10c effect editor r1 fix (tree `0df4f96553f8990fe50dba9149d3f5dcc1b4833e`, 2026-11-26 00:21 UK time). Fast-forward on `26b9e8ec`. The fix commit touches only `handoff/steps/tests/s10c-effect-editor/smoke.mjs` and `tools/maker/asset-check.ts` (the 10b dead-`let` carry). No build-table app change. Timeouts were not raised. No retry loops |
| Fix verdict | Official count became 327 (8 files, +314/−13), smoke 56/70. Green 1157/0. s10c solo **5/5**, 8 ok at 390 and 360 every time; the other 19 smokes PASS first try; audit PASS. CoS verify of the fix was **PASS** (V2, sha256 `a959887e…`). Predicted merge tree onto then-main `0a29cc18` was `ce0f2836` (V2, QA1). The two 10b carry nits were cleared: dead `let docs = files` removed (1+ 1−; migrate throw and success unchanged); HANDBACK PR line set to `PR: none yet; CoS opens it`. Cap-joins were **not** undone (putting `mint` back is 91/90 on `effects.ts`; splitting the two test lines is 92/90 against the then-written cap). The builder stopped and reported that, as asked |
| QA rework and EA ruling | QA **REWORK (one small fix), then OK TO MERGE** (QA1, sha256 `554a6b49…`, on main `4f9eb79c`). `effects.ts` 90/90 was **accepted**: the `(p) => \`${p}1\`` id function inlined at three writer calls is a helper inline, the same mint `levels.ts` uses, not two statements on one line. The test file was **not** accepted: `type Obj` + `isObj` and `steps` + `hist` were two statements per line, joined to fit the cap, against guide L65. Fix: split them to one statement per line (file 92), which needed the cap raised. **EA ruling 2026-11-26:** "the cap for tests/editor/effects-10c.test.ts rises from 90 to 92, only so the two joined lines (`type Obj`+`isObj`, `steps`+`hist`) can be split into one statement per line, as guide L65 requires. No other change: effects.ts stays at 90, every other cap stays as written, and the 400 hard gate stays." |
| Rework commits | `780eb650f015beceb9dce5da2e73d49c9e448ca1` test(editor): split the two joined lines in the 10c effect tests (tree `585d1d0cf5e0fb21f587906e71d4d7b0438b75d6`, 2026-11-26 02:20 UK time), `68eaf1a29f2114dd4c219d5852b879822f38a321` docs(handback): step 10c effect editor r1 line split (tree `8d002f5230127f64694bfc5486faf35aa7470470`, 2026-11-26 02:30 UK time). Fast-forward `a496ebe..68eaf1a`. The rework commit vs its parent is that one test file only (4+ 2−); the tip is HANDBACK only. The split is on the code head, not the docs tip |
| Rework verdict | Official count **329** (8 files, +316/−13). Test file 92/92, `effects.ts` 90/90. Green 1157/0. s10c solo **3/3**, 8 ok at 390 and 360 every time (V3). CoS verify of the rework was **PASS** (V3, sha256 `368aaad1…`). QA **OK TO MERGE** (QA2, sha256 `9ca30389…`). Predicted merge tree onto then-main `4f9eb79c` was `d718df66` (V3, QA2) |
| Merge | PR #105, merge commit `699bdb83cf3c4598ce5ce8e90935acfad9468fd4`, 2026-11-26 03:32 (UK time). Tree `d718df663cc14a6090af5699b0bb45781b03da9a` (the same tree CoS and QA predicted against main `4f9eb79c`; V3, QA2). First parent `4f9eb79cb1cebe0c8d3e884e5b0ec9d6cd6c85af`, second parent `68eaf1a2`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #105: Step 10c: effect editor (r1 + fix + rework, ChatA)`. Green on the merge **1157 pass / 0 fail** |
| After the merge | main is `f0d61515163fa79a7ff3be52000acd015ab2bd72`, 2026-11-26 03:33 (UK time), tree `7bff83afd3f657f5a4002827848c02d45f3ed253`, which adds only `docs/qa/step-10c-r1-rework-review.md` (9 insertions, sha256 `9ca30389`, hash-object `0a2751d3`). QA postmerge on `699bdb83` **PASSED** (2026-11-26 03:34 UK time; tree `d718df66`, parent 2 `68eaf1a2`, noreply, `merge-base..tip == parent1..merge`, pins 5/5, green 1157/0, smoke 0 fail). The only warning was that main had moved one commit by this QA review doc, which was expected |
| Tests | 1152 + N=5 (named tests 1–5 in `tests/editor/effects-10c.test.ts`) = **1157 pass / 0 fail**. Floor after this merge is **1157** (HB, V3, QA2) |

## (b) Files

From `git diff --name-status 76fd7502..780eb650 -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the rework code head (the accepted 10c measure). The same product files are on the merge tree `d718df66`. The r1 review landed on main `4f9eb79c` before the merge, and the rework review landed on `f0d61515` after the merge; neither is in the official 400. The new s10c smoke is counted in the 400 (guide L11, L62). `asset-check.ts` is not in the guide Build table; the fix go-line asked for the dead-initialiser removal and it is inside the official command.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/project/load/read-project.ts` | M | 9 / 6 | 20 (L56) | yes. **15** (sha256 `1fcc5ad7ec04dce660f36ceeafb7ae80ffcb2c2327c8e12cc65937b22e82146e`) |
| `src/editor/effect/list.ts` | A | 52 / 0 | 60 (L57) | yes. **52** (sha256 `c19d803240b464630e43f2eb44034725b972329cc8fbb093939bbb536aa448f4`) |
| `tools/maker/effects.ts` | A | 90 / 0 | 90 (L58) | yes. **90** (sha256 `2b59c5afb550a983be201ad9b8f01666221038c731cfc28e566c0316d638bafd`) |
| `tools/maker/ability-panel.ts` | M | 4 / 1 | 10 (L59) | yes. **5** (sha256 `f36928f8b5e6d307bd57e84358af42d0ab14bb46c039a7e3aea90c5f70509a64`) |
| `tools/maker/home.ts` | M | 12 / 5 | 24 (L60) | yes. **17** (sha256 `f0802a40fb06ae5e26dc668b9f8794f993906bcb3f435c2a54456f099929b402`) |
| `tests/editor/effects-10c.test.ts` | A | 92 / 0 | 92 (EA ruling 2026-11-26; guide L61 still prints 90) | yes. **92** (sha256 `b1f6beb41949a76819ef744b4edc349d8f625005c81ce9466f1cd1c924457bff`) |
| `handoff/steps/tests/s10c-effect-editor/smoke.mjs` | A | 56 / 0 | 70 (L62) | yes. **56** (sha256 `1f38730738b143f07f7232dc3f359907ec6a16ac9354b81df7d5261b97b432cc`) |
| `tools/maker/asset-check.ts` | M | 1 / 1 | n/a (not in the Build table) | yes, official command. **2** (sha256 `4bd1d8e3aabe3c50561d4498ea7989dac423a6aee135005aaf761faab3f3b69e`) |

No diff under `src/core/`, `src/sim/`, `src/rules/`, `tools/play-stage/`, `tools/effect-designer/`, `data/`, fixtures, the format docs, `behaviour-library/`, `tools/painter-proto/` or `ui-shell/`. The play stage still has no `tools/maker` or `src/editor` import. The only smoke path in the diff is the new s10c smoke; no other test or smoke is edited. Official G7 at the rework code head or rework tip against `76fd7502`, and at the merge against first parent `4f9eb79c`, is **8 files changed, 316 insertions(+), 13 deletions(-)** = 329 ≤ 400. Every Build-table cap is kept (`effects.ts` sits on 90; the test file sits on the raised cap 92). Caps sum 364 (guide L63) is not a second gate. The trial on `0673be7e` + 10b r2 was 7 files, 254 counted lines. Shipped 329 is 75 above that trial (the new test is 92 vs the trial 62, the smoke is 56 vs 49, `effects.ts` is 90 vs 64, `list.ts` is 52 vs 42, plus the allowed `asset-check.ts` 2). No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base. No gh-pages. No new rAF or loop. The only `setTimeout` in the product +lines is the existing 6s toast wired for `state.undo === "effect"` in `home.ts` (same pattern as levels/rules).

## (c) Key code and git commands

Step 10c is the editor half of roadmap step 10 (guide L13–17, Rules 1–7). It reuses the E-lane writer, `blankEffect`, `trashOf` and `SAVE.id`, and does not touch `tools/effect-designer`. It does not add a built-ins library (10d), does not edit steps, parts or pictures (step 33), and does not change `WIRED`. No format-doc edits, no re-id or write-back of `setup_` effects, no export or APK work, no gh-pages. Nothing in `src/core`, `src/sim`, `src/rules` or `tools/play-stage`. Only the Build-table files change, plus the one-line `asset-check.ts` carry the fix go-line named.

**Data (Rule 1).** `FX_KNOBS` is the eight knobs fx-doc draws (`src/editor/effect/list.ts:4`). `effectRows(bag)` (`:11`) lists live `effects/` docs only (no `.deleted/`, no built-ins), with `used` equal to the setups whose `effect` answer is that id, sorted by name then id. `newEffect` (`:22`) writes one `stamp` step `s-1` at 0.25 s through the ED-E5 writer, named "Effect N". `editEffect` (`:27`) accepts only `FX_KNOBS` (`:28`); `undefined` resets. `renameEffect` (`:33`) is 1–40 characters trimmed. `duplicateEffect` (`:39`) mints a fresh `effect_` id, `copiedFrom`, rev 1, one duplicate op with empty `changes`, and a " copy" name; references stay on the original; a non-`effect_` id is refused. `deleteEffect` (`:46`) moves the doc to `trashOf(path)`; with `toNone` each user's answer becomes `{source: "user", value: "none"}`. Pure `src/editor` only.

**effectNotRule (Rule 2).** `rule` (`src/project/load/read-project.ts:22–23`) sits next to `has`: an id that is an own key of `effects` pushes `effectNotRule` (warning, path = the pointer the call site would give `has`, detail = the id); anything else goes to `has`. It is used at `project.rules` (`:30`, `project.json#/project/rules/<i>`), `stage.rules` (`:38`, `stages/<id>.json#/rules/<i>`), `neutrals[].setupIds` (`:39`) and `unit.setupIds` (`:43`). `refs` takes `effects` (`:26`) and the load path passes them (`:118`). `playDocsOf` already skips ids that aren't setups, so the effect is ignored. An id that resolves to nothing stays H3 `brokenRef`.

**Effects screen and save (Rules 3–4).** `effectsSection` / `effectsSheet` / `effectsAct` / `fxOpen` (`tools/maker/effects.ts:18,23,29,72`). The list is hidden when read-only; the editor sheet is `panelOf(BUNDLED, { effect: FX_KNOBS }, "effect", answers)` with `knobWidget` and `e:reset:`. Save is `planSave` then `commitWrites`; gone paths stay in the plan with their old text and are `store.remove`d after the commit (`:45–51`); one-deep undo restores the snapshot, so the trash file goes and the live file comes back. Ids from `fresh` (`:66`, `effect_${ulid(...)}`). The prefix-plus-1 writer id is inlined as `(p) => \`${p}1\`` at the three writer calls (`:77`, `:83`, `:87`); QA accepted that as a helper inline, not a join (QA1). Putting a `mint` const back would be 91/90.

**Effect row (Rule 5).** `fxRow` (`tools/maker/ability-panel.ts:33`) renders only when `aimKind(behaviourId)` is set (basic attack, line shot): None plus one button per `effectRows` row, `aria-pressed` on the current answer (`source: "default"` reads as none). Built-ins are not offered. `a:fx:` (`:75`) writes `setAnswer(..., "effect", value, "none")` only when `value` is `none` or an `effectRows(bag)` id; any other value returns `{ keep: true }`. `WIRED` is unchanged. Test stays on the closed ability-list cards (`:48`).

**Wiring (Rule 6).** `home.ts` imports the effects module (`:12`). `State.undo` gains `"effect"` (`:25`). The toast sits `above` while `fxOpen()` (`:40`). The project screen appends `effectsSection` after Levels and `effectsSheet` after the levels sheet (`:45`). One block before the unit block (`:117–120`) routes `e:` acts, `k:` acts while `fxOpen()`, and Undo when `state.undo === "effect"`, and wires the existing 6s toast for that kind. `data-knob` input goes to `e:set:` while `fxOpen()` (`:175`); the name field saves on `change`, not `input` (`:176`).

**Failed-migrate carry.** `assetRows` (`tools/maker/asset-check.ts:15`) is a bare `let docs: Readonly<Record<string, unknown>>`; `docs` is assigned only from `migrateProject(files).files`. A throw still returns the one hard `invalidValue` row and never reads `docs`. Success still uses the migrated clone. Law 12 still passes.

The five new named tests, in `tests/editor/effects-10c.test.ts`, one import per line and one statement per line after the rework, at `:23`, `:32`, `:41`, `:50` and `:67` (guide L67–73, V3, QA2):

```ts
test("10c effect data: New mints effect_<ULID> with one stamp step and a free name; the list sorts by name then id with its users; Duplicate copies answers under a fresh effect_ id (rev 1, one duplicate op, copiedFrom, ' copy' name) and references stay on the original", () => {
test("10c edit: a knob goes through the ED-E5 writer (history op, rev + 1) and Test draws it; reset returns it to the default; a knob outside FX_KNOBS or a bad name changes nothing", () => {
test("10c delete: the doc moves to effects/.deleted/ (the reader skips it, no row); its abilities then show unknownRef and run stock, or switch to none in the same action", () => {
test("10c effectNotRule (DSK): an effect id (new or legacy setup_) in project.rules, stage.rules, unit.setupIds or neutrals[].setupIds is a warning at the pointer brokenRef would use and ignored, and Test still opens; an id that resolves to nothing stays brokenRef hard", () => {
test("10c maker: the Effects section lists effects with use counts; New, a slider, Delete and Undo write through the store (trash file in, live file out, and back); the ability Effect row offers None and saved effects and sets the answer Test plays (an id not in the list writes nothing)", async () => {
```

Mutations, each file restored, then put back (guide L92, HB, V1/QA1): `read-project.ts` (base file) → test 4; the pointer cut back to the doc path (`path.split("#")[0]`) → test 4; `ability-panel.ts` (base file) → test 5; the `a:fx:` `effectRows` check removed → test 5, and s10c steps 3–4 at both widths; `home.ts` → s10c steps 1–4 at both widths. In the new files: Duplicate without `copiedFrom` → test 1; list left unsorted → test 1; New without the seed step → tests 1–2; edit that skips the writer → tests 2 and 5; the `FX_KNOBS` guard removed → test 2; `toNone` ignored → test 3; gone files not removed → test 5; undo that doesn't remove the trash → test 5. QA1 reproduced the pointer, `a:fx:` and base `read-project.ts` pins (clean run 5/5).

s10c (`handoff/steps/tests/s10c-effect-editor/smoke.mjs`, sha256 `1f38730738b143f07f7232dc3f359907ec6a16ac9354b81df7d5261b97b432cc`, 56 lines, port 8816 r1) is `smoke.mjs . 8816 r1`: 8 ok lines and `SMOKE PASS` at 390 and 360 (4 ok at each width: 1 empty, 2 new shake, 3 row and test, 4 dup delete undo) (HB, V2, V3, QA1). The shipped `tap` waits until the control is under `elementFromPoint` and no covering `.scrim`, then taps once. After `a:fx` it waits for `aria-pressed` and no scrim (the unknown-id click uses a one-shot `MutationObserver` on `#app`); after `a:shut` it waits until the panel and scrim are gone and `a:test:` is in the DOM. Every timeout is still 15000; there is no retry loop. That is the fix for the r1 race (V1, V2, HB). CoS verify of r1 ran the pre-fix smoke and failed; CoS verify of the fix ran the shipped smoke 5/5, and the rework verify ran it 3/3, all 8 ok (V2, V3). No other smoke is edited. All 20 smokes were rerun solo at the guide counts on the fix (and the other 19 were first-try PASS on r1 too): S0 14, s3 18 (first run, no flake), s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, **s10c 8**. Shots go to `handback/` and must not be committed. If s3 step 9 misses (sheet text ''), re-run it solo once; do not edit s3 in 10c (guide L76).

Export audit on the clean tip: `s8-audit.mjs` reports play-stage release **133**, baseline **147**, maker play tree **146** (the known loose `play-stage` filter), tight play-stage directory **133**, `AUDIT PASS` (V2, V3, QA1, HB). No audit script was committed. No new built file. 10c changes only the maker, so the published baseline pages are unchanged.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base, at `tools/effect-designer/page.ts:101` and `tools/maker/home.ts:89` twice (the one added import line moved the home.ts errors from L88). No new error (HB, V3, QA2). Leave them. Root `tsc --noEmit -p tsconfig.json` exits 0.

The official count command (guide L65, on a committed tree the `git add -N` is unnecessary):

```
# Product gate. The first parent of the merge is 4f9eb79c
# (docs-only on the go-line base 76fd7502). Official command at
# the rework code head or rework tip against 76fd7502, or at the merge
# against first parent 4f9eb79c:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   8 files changed, 316 insertions(+), 13 deletions(-)
#
# At 780eb650 against 76fd7502: 8 files, 316 insertions, 13 deletions = 329.
# The same 329 at 699bdb83 against 4f9eb79c. At f0d61515 (current
# main, which also adds the r1 rework review) against 4f9eb79c, the official
# command without ':!docs/**' is 9 files, 325 insertions, 13
# deletions. Adding ':!docs/**' again gives 329.
#
# Trial on 0673be7e + 10b r2 was 7 files, 254 counted lines.
#
# Named tests (npm test 1157/0, floor 1152 + N=5):
#   ✔ 10c effect data: …
#   ✔ 10c edit: …
#   ✔ 10c delete: …
#   ✔ 10c effectNotRule (DSK): …
#   ✔ 10c maker: …
#
# Smokes under google-chrome, at 390 and 360 CSS px, all solo:
#   S0 (8797) 14 ok, TOUCH SMOKE PASS
#   s3 (8798) 18 ok, TOUCH SMOKE PASS
#   s4a (8799) 16 ok, SMOKE PASS
#   s4b (8800) 16 ok, SMOKE PASS
#   s4c (8801) 16 ok, SMOKE PASS
#   s5a (8802) 16 ok, SMOKE PASS
#   s5b (8803) 16 ok, SMOKE PASS
#   s5c (8804) 16 ok, SMOKE PASS
#   s6a (8805) 18 ok, SMOKE PASS
#   s6b (8806) 16 ok, SMOKE PASS
#   s6c (8807) 18 ok, SMOKE PASS
#   s6d (8808) 14 ok, SMOKE PASS
#   s7 (8809) 20 ok, SMOKE PASS
#   s8 (8810 r1) 16 ok, SMOKE PASS
#   s9 (8811 r1) 12 ok, SMOKE PASS
#   s8c (8812 r1) 8 ok, SMOKE PASS
#   s9b (8813 r1) 14 ok, SMOKE PASS
#   s9c (8814 r1) 6 ok, SMOKE PASS
#   s10b (8815 r1) 8 ok, SMOKE PASS
#   s10c (8816 r1) 8 ok (4 @390, 4 @360), SMOKE PASS
#
# ability-panel.ts mutation (a:fx: effectRows check removed): test 5
# fails; s10c steps 3–4 fail at both widths; file restored.
# home.ts (base file restored): s10c steps 1–4 fail at both widths.
#
# Export audit as above; s8-audit.mjs 133 / 147 / 146, empty hit list, AUDIT PASS.
```

## (d) What went wrong, in order, and the fix

**r1.** The list, the editor, Duplicate, delete-to-`.deleted/`, the Effect row, `effectNotRule`, the five named tests and the new s10c smoke shipped in one feat commit and green was 1157/0. The official gate was 320, with every then-written cap kept. The other 19 smokes passed at the guide counts. The tip holds only `HANDBACK.md`. CoS verify of r1 was **FAIL** (V1): s10c steps 3–4 did not reliably pass at both widths (first run failed at 390 only; a retry failed at both). Instrumented dumps showed `a:test:` missing because the ability panel was still open; at 390 a unit Rename sheet was also up. Root cause: after `a:fx` saves, `paint()` replaces `#app` and the unit body scrolls back to the top, so the old `tap` had already measured `a:shut` and the touch hit `u:rename`. `a:shut` never ran, and Test lives only on the closed list. Predicted merge tree onto then-main `0a29cc18` was `ecb454ae` (V1). Not merged.

**Fix, before QA.** The smoke now waits until that paint is done, taps `a:shut` only when it is the control under the point and no sheet is up, then waits until the panel and any scrim are gone and `a:test:` is in the DOM. Timeouts were not raised. No build-table app change. The same commit also removed the dead `let docs = files` in `asset-check.ts`. Official count 327, smoke 56/70. s10c 5/5 at both widths; the other 19 PASS first try; audit PASS. CoS verify of the fix was **PASS** (V2). Predicted merge tree onto then-main `0a29cc18` was `ce0f2836` (V2, QA1). Cap-joins were left: `mint` back is 91/90, splitting the test lines is 92/90 against the cap as then written.

**QA rework.** QA accepted `effects.ts` 90/90 (inlined id helper, not a join) and asked for the two test-file joins to be split, which needed EA to raise that file's cap 90 → 92 (QA1). EA ruling 2026-11-26 (quoted above) did exactly that and nothing else. The rework commit splits only `type Obj` / `isObj` and `steps` / `hist` (statement text unchanged). File 92, total 329, `effects.ts` untouched. CoS verify of the rework was **PASS** (V3). QA **OK TO MERGE** (QA2). Predicted merge tree onto then-main `4f9eb79c` was `d718df66` (V3, QA2), which is the merge tree.

The 10b carry nits are cleared: the dead `let` is gone, and the HANDBACK PR line is `PR: none yet; CoS opens it`. PR #105 was opened later, then merged. Helpers listed in HANDBACK: `8ac2d3eb`, `5cd4eb8e`, `0aeada01`, `32888914`, `97b9c27e`. QA's non-blocking nit: helper `f758338e` (the split must stay on the code head, not be attributed to the docs tip) was used and is not listed in § Helpers (QA2); record it here. The split is on `780eb650`.

QA postmerge on `699bdb83` **PASSED** (2026-11-26 03:34 UK time; tree `d718df66`, parent 2 `68eaf1a2`, noreply, `merge-base..tip == parent1..merge`, pins 5/5, green 1157/0, smoke 0 fail). The only warning was that main had moved one commit by the QA rework review `f0d61515`, which was expected.

## (e) Do it right first time

- The work is only in the 7 Build-table files, plus `asset-check.ts` when a go-line names that one carry. Do not edit `src/core`, `src/sim`, `src/rules`, `tools/play-stage`, `tools/effect-designer`, data, fixtures, the format docs, behaviour-library, painter-proto or ui-shell. The play stage still never imports `tools/maker` or `src/editor`. Do not edit any other test or smoke. Leave every smoke except the new s10c unedited. The only new test is `tests/editor/effects-10c.test.ts`.
- Editor only. No built-ins in the Effect row (10d). No steps, parts or picture editing (step 33). No re-id or migration of `setup_` effects, no `WIRED` change, no export or APK, no new rAF, timer or loop beyond wiring the existing 6s toast for `undo === "effect"`. `effectNotRule` uses the same pointer `brokenRef` would use. `a:fx:` writes only `none` or an `effectRows` id. Delete goes to `effects/.deleted/` with a one-deep undo that restores the live file and removes the trash; do not write `""`.
- Do not add a built-ins picker or a baseline republish in this step. The builder never publishes gh-pages. 10c does not change the published baseline pages (audit counts unchanged). Any republish needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there.
- Measure with the count command (guide L65): `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'`. Count insertions plus deletions. **329** is the accepted number for this step (the trial was 254; the r1 fix was 327). The new s10c smoke is inside that count (cap 70). On a merge whose first parent is `4f9eb79c`, measure against that parent (or at the rework code head against `76fd7502`), and do not treat later QA docs as 10c lines. Official wording: at `780eb650` against `76fd7502`, and at `699bdb83` against `4f9eb79c`.
- Don't wrap, split or join lines to dodge or fit a cap (guide L65). The test-file cap is **92** by the EA ruling of 2026-11-26, only so `type Obj` / `isObj` and `steps` / `hist` can be one statement per line. `effects.ts` stays 90; the inlined `(p) => \`${p}1\`` helper is accepted (not a join). Every other cap stays as written. The 400 hard gate stays.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run of every smoke in § Smoke. Record the mutations (file restored → what fails), including s10c steps 3–4 at both widths when the `a:fx:` check or `home.ts` is restored. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time. Do not commit smoke shots. Running s6c rewrites the 6c checkpoint fixture, and later smokes can write untracked shots under `handback/`; restore tracked files, do not commit the shots. If s3 step 9 misses, re-run it solo once; do not edit s3.
- After `a:fx` (or any act that saves and `paint()`s), do not measure `a:shut` on a stale box. Wait until paint is done, tap only when `a:shut` is the element under the point and no sheet is up, then wait until the panel and scrim are gone and `a:test:` is in the DOM. Do not raise timeouts or add a retry loop to hide a race. Test is on the closed ability list only.
- List helpers actually used in HANDBACK § Helpers, including ones that only reviewed an uncommitted fix (QA2 flagged `f758338e` as missing).

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only the r1 rework review):
#   git diff 699bdb83 HEAD -- \
#     src/project/load/read-project.ts src/editor/effect/list.ts \
#     tools/maker/effects.ts tools/maker/ability-panel.ts \
#     tools/maker/home.ts tools/maker/asset-check.ts \
#     tests/editor/effects-10c.test.ts \
#     handoff/steps/tests/s10c-effect-editor/smoke.mjs
#   (empty)

# Product gate. Official command at the rework code head or rework tip against
# 76fd7502, or at the merge against first parent 4f9eb79c:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   8 files changed, 316 insertions(+), 13 deletions(-)
#
# At 780eb650 against 76fd7502: 8 files, 316 insertions, 13 deletions = 329.
# The same 329 at 699bdb83 against 4f9eb79c. At f0d61515 (current
# main, which also adds the r1 rework review) against 4f9eb79c without
# ':!docs/**': 9 files, 325 insertions, 13 deletions. Adding
# ':!docs/**' again gives 329.
#
# Named tests (npm test 1157/0, floor 1152 + N=5):
#   ✔ 10c effect data: …
#   ✔ 10c edit: …
#   ✔ 10c delete: …
#   ✔ 10c effectNotRule (DSK): …
#   ✔ 10c maker: …
#
# Smokes under google-chrome, at 390 and 360 CSS px, all solo, at
# the guide counts (S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16,
# s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16,
# s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8). Mutations as above.
#
# Export audit as above; s8-audit.mjs 133 / 147 / 146, empty hit list.
```

## QA non-blockers carried forward

- Helper `f758338e` was used on the rework (to keep the line split on the code head, not attributed to the docs tip) and is not listed in HANDBACK § Helpers (QA2). The helpers that are listed are `8ac2d3eb`, `5cd4eb8e`, `0aeada01`, `32888914` and `97b9c27e`.
- `effects.ts` sits on its cap at 90/90 with the prefix-plus-1 id helper inlined; QA accepted that. The test file sits on the raised cap 92. Shipped 329 is 75 above the trial 254 (still ≤ 400 and under the caps sum 364).
- The audit script's maker-play figure is 146, the known loose filter (same as 8a–10b). HANDBACK also states the tight `play-stage/` count 133 (V2, V3, HB).
- Running s6c rewrites the 6c checkpoint fixture, and later smokes can write untracked shots under `handback/`. Restore tracked files after a local run; do not commit the shots.
- s3 `waitForTimeout` flake carry is still open; it did not fire on the verify or QA runs (s3 18 ok first time; s8c 8 ok first time) (V2, V3, QA1, guide L104).
- **Still open, not 10c scope** (guide L98–104, QA): 10d (the built-in effect library and the Effect row's built-in buttons); `effects/.deleted/` purge after the undo window (step 11's export must leave `.deleted/` out); tags and search, the Effect row on other owners, "Make my own from Holy blade"; from 9b/9c, 10a and 10b, the upload byte cap, the "Stairs to <stage name>" info row, markers in the maker, Cover/Stretch, 8192 toggle, export shipping assets (step 11). Format docs were not edited (r41 is already on this step's starting main). No baseline republish: 10c changes only the maker; any republish needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there; the builder never publishes.
- **Closed here:** the Effects list, New, the play-drawn knobs, Duplicate minting `effect_`, delete into `effects/.deleted/` with undo, the Effect row on basic attack and line shot (None and saved effects; unknown `a:fx` writes nothing), DSK `effectNotRule` at the `brokenRef` pointer, the s10c paint/`a:shut` race, the test-file cap-join split under the EA ruling, and the two 10b carry nits (dead `let docs = files`, HANDBACK PR line).

## Blob check

Each file must have exactly this git blob id at `699bdb83`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/project/load/read-project.ts` | `6d2e2feb6005415c3e3ed69f12f8dd2ab440c32e` | 124 |
| `src/editor/effect/list.ts` | `855d3cd6e6b3eec14e17cbf566f02e73d8a14108` | 52 |
| `tools/maker/effects.ts` | `5fedbe63158d04b8ed9e3c849ae097c471354880` | 90 |
| `tools/maker/ability-panel.ts` | `4726458c573b778e49816485dff3ebdc8fdef369` | 91 |
| `tools/maker/home.ts` | `bf6779c9c9bd12844942ec0b72ed2e545c55fa0f` | 179 |
| `tools/maker/asset-check.ts` | `5ec210f51bf5fbf9c6c7c79d64e16dcc8b9e210f` | 25 |
| `tests/editor/effects-10c.test.ts` | `70df59c323e19e4b320d5b7b181e5d75f01167cf` | 92 |
| `handoff/steps/tests/s10c-effect-editor/smoke.mjs` | `4f434523e796cd7faab9a555e890f55753417818` | 56 |

## Appendix: full code as merged (step 10c, PR #105)

New files are `git show 699bdb83:<path>` in full. Edited files are `git diff 4f9eb79c 699bdb83 -- <path>`. (The product diff against the go-line base `76fd7502` is the same for these 8 files.)

### `src/project/load/read-project.ts` (edited)

```diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index 48151f8..6d2e2fe 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -19,12 +19,15 @@ function note(res: ReadResult<unknown>, path: string, rows: ReportRow[]): void {
 function has(bag: Readonly<Record<string, unknown>>, id: unknown, path: string, rows: ReportRow[]): void {
   if (typeof id === "string" && !Object.hasOwn(bag, id)) rows.push(row("brokenRef", "hard", path, id));
 }
+function rule(effects: Readonly<Record<string, unknown>>, bag: Readonly<Record<string, unknown>>, id: unknown, path: string, rows: ReportRow[]): void {
+  if (typeof id === "string" && Object.hasOwn(effects, id)) rows.push(row("effectNotRule", "warning", path, id)); else has(bag, id, path, rows);
+}
 
-function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonly<Record<string, Doc>>, stages: Readonly<Record<string, Doc>>, units: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
+function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonly<Record<string, Doc>>, stages: Readonly<Record<string, Doc>>, units: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, effects: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
   const project = isObj(manifest["project"]) ? manifest["project"] : {};
   const gear = isObj(project["loadout"]) ? project["loadout"] : {};
   list(project["stages"]).forEach((id, i) => has(stages, id, `project.json#/project/stages/${i}`, rows));
-  list(project["rules"]).forEach((id, i) => has(setups, id, `project.json#/project/rules/${i}`, rows));
+  list(project["rules"]).forEach((id, i) => rule(effects, setups, id, `project.json#/project/rules/${i}`, rows));
   if (isObj(project["session"])) has(stages, project["session"]["start"], "project.json#/project/session/start", rows);
   list(gear["roster"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/roster/${i}`, rows));
   list(gear["required"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/required/${i}`, rows));
@@ -32,12 +35,12 @@ function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonl
     const path = at[id] ?? `stages/${id}.json`;
     const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : {};
     has(maps, stage["mapRef"], `${path}#/mapRef`, rows);
-    list(stage["rules"]).forEach((sid, i) => has(setups, sid, `${path}#/rules/${i}`, rows));
-    list(stage["neutrals"]).forEach((n, i) => { if (!isObj(n)) return; has(units, n["unitId"], `${path}#/neutrals/${i}/unitId`, rows); list(n["setupIds"]).forEach((sid, j) => has(setups, sid, `${path}#/neutrals/${i}/setupIds/${j}`, rows)); });
+    list(stage["rules"]).forEach((sid, i) => rule(effects, setups, sid, `${path}#/rules/${i}`, rows));
+    list(stage["neutrals"]).forEach((n, i) => { if (!isObj(n)) return; has(units, n["unitId"], `${path}#/neutrals/${i}/unitId`, rows); list(n["setupIds"]).forEach((sid, j) => rule(effects, setups, sid, `${path}#/neutrals/${i}/setupIds/${j}`, rows)); });
     list(pool["entries"]).forEach((e, i) => { if (isObj(e)) has(units, e["unitId"], `${path}#/enemyPool/entries/${i}/unitId`, rows); });
     list(stage["links"]).forEach((l, i) => { if (!isObj(l)) return; const where = `${path}#/links/${i}/to`; if (l["to"] === id) rows.push(row("brokenRef", "hard", where, id)); else has(stages, l["to"], where, rows); });
   }
-  for (const [id, unit] of Object.entries(units)) list(unit["setupIds"]).forEach((sid, i) => has(setups, sid, `units/${id}.json#/setupIds/${i}`, rows));
+  for (const [id, unit] of Object.entries(units)) list(unit["setupIds"]).forEach((sid, i) => rule(effects, setups, sid, `units/${id}.json#/setupIds/${i}`, rows));
   const assets = isObj(project["assets"]) ? project["assets"] : {}; for (const [id, map] of Object.entries(maps)) list(isObj(map["background"]) ? map["background"]["layers"] : undefined).forEach((layer, i) => { if (isObj(layer)) has(assets, layer["assetId"], `maps/${id}.json#/background/layers/${i}/assetId`, rows); });
 }
 
@@ -112,7 +115,7 @@ export function readProject(files: ProjectFiles): ProjectLoad {
   if (!Object.hasOwn(docs, "catalogue/slice.json")) rows.push(row("invalidValue", "hard", "catalogue/slice.json", "missing"));
   const manifestDoc = docs["project.json"];
   const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
-  refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
+  refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, effects, rows);
   warns(slice, project, maps, setups, effects, rows);
   rows.push(...placementDrops(stages, stageAt, maps, slice), ...mapEntryDrops(maps, mapAt));
   const hard = rows.some((r) => r.severity === "hard");
```

### `tools/maker/ability-panel.ts` (edited)

```diff
diff --git a/tools/maker/ability-panel.ts b/tools/maker/ability-panel.ts
index ec1c6c4..4726458 100644
--- a/tools/maker/ability-panel.ts
+++ b/tools/maker/ability-panel.ts
@@ -1,4 +1,5 @@
 import { aimKind, detach, panelOf, resetAnswer, setAnswer, stageFor, type PanelKnob, type PanelModel } from "../../src/editor/unit/panel.ts";
+import { effectRows } from "../../src/editor/effect/list.ts";
 import { WIRED } from "../../src/rules/behaviours/wired.ts";
 import { addChrome } from "./add-ability.ts";
 import { diagramHtml, diagramOf } from "./unit-diagram.ts";
@@ -29,6 +30,7 @@ function rowsOf(bag: Record<string, Obj>, unit: Obj, slice: Obj, skip: string):
   }
   return html;
 }
+const fxRow = (bag: Record<string, Obj>, behaviourId: string, answers: Obj): string => { if (aimKind(behaviourId) === undefined) return ""; const cur = isObj(answers["effect"]) && answers["effect"]["source"] !== "default" && typeof answers["effect"]["value"] === "string" ? answers["effect"]["value"] : "none"; return `<p class="row">Effect</p><button type="button" class="choice" data-act="a:fx:none" aria-pressed="${cur === "none"}">None</button>${effectRows(bag).map((row) => `<button type="button" class="choice" data-act="a:fx:${esc(row.id)}" aria-pressed="${cur === row.id}">${esc(row.name)}</button>`).join("")}`; };
 export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boolean): string {
   const slice = bag["catalogue/slice.json"]; if (!isObj(slice)) return "";
   const id = typeof unit["id"] === "string" ? unit["id"] : "", placed = stageFor(bag, id), ids = list(unit["setupIds"]).filter((item): item is string => typeof item === "string");
@@ -37,7 +39,7 @@ export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boole
   if (openId !== "" && isObj(open) && typeof open["behaviourId"] === "string") {
     const model = panelOf(slice, WIRED, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : {});
     const marks = diagramHtml(diagramOf(bag, id, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : null));
-    return `<h2>Abilities</h2><button type="button" class="btn ghost" data-act="a:shut">Back</button><h2>${esc(model.name)}</h2>${panelHtml(model)}${marks}${rowsOf(bag, unit, slice, openId)}`;
+    return `<h2>Abilities</h2><button type="button" class="btn ghost" data-act="a:shut">Back</button><h2>${esc(model.name)}</h2>${panelHtml(model)}${fxRow(bag, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : {})}${marks}${rowsOf(bag, unit, slice, openId)}`;
   }
   const cards = ids.flatMap((sid) => {
     const setup = bag[`setups/${sid}.json`]; if (!isObj(setup) || typeof setup["behaviourId"] !== "string") return [];
@@ -70,6 +72,7 @@ export function abilityAct(act: string, bag: Record<string, Obj>, unitId: string
   if (!isObj(unit)) return { keep: true };
   if (act === "a:shut") { openId = ""; return { keep: true }; }
   if (act.startsWith("a:open:")) { openId = act.slice(7); return { keep: true }; }
+  if (act.startsWith("a:fx:")) { const value = act.slice(5); if (value !== "none" && !effectRows(bag).some((row) => row.id === value)) return { keep: true }; const setup = bag[`setups/${openId}.json`]; if (!isObj(setup)) return { keep: true }; const answers = isObj(setup["answers"]) ? setup["answers"] : {}; return { bag: { ...bag, [`setups/${openId}.json`]: { ...setup, answers: setAnswer(answers, "effect", value, "none") } }, toast: "Changed · Undo" }; }
   if (act === "a:test" || act.startsWith("a:test:")) {
     const stageId = stageFor(bag, unitId); if (stageId === null) return { keep: true };
     const abilityId = act === "a:test" ? undefined : act.slice(7);
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 346cf57..bf6779c 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -9,6 +9,7 @@ import { addFind, rememberAbility } from "./add-ability.ts";
 import { DEV } from "./dev.ts"; // dev-only
 import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
 import { levelsAct, levelsOpen, levelsSection, levelsSheet, rememberLevels } from "./levels.ts";
+import { effectsAct, effectsSection, effectsSheet, fxOpen } from "./effects.ts";
 import { bindStage, dropUndo, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type AimAt, type Next, type PlayReady } from "./test-launch.ts";
@@ -21,7 +22,7 @@ import { keptLine, readAutosave, writeAutosave } from "./session.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
+type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | "effect" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
 const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
 let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve(), resume: SessionSave | null = null;
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
@@ -36,12 +37,12 @@ function sheet(): string {
   return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
 }
 function paint(): void {
-  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
+  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() || fxOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: levelsSection(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
@@ -113,6 +114,12 @@ async function run(act: string): Promise<void> {
     if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "level"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
     paint(); return;
   }
+  if ((((act.startsWith("e:") || (fxOpen() && act.startsWith("k:"))) && state.screen === "project") || (act === "undo" && state.undo === "effect")) && store !== null && state.current !== null) {
+    const hit = await effectsAct(act === "undo" ? "e:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
+    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "effect"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
+    paint(); return;
+  }
   if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
     const hadBanner = state.banner !== null;
     const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
@@ -165,8 +172,8 @@ document.addEventListener("click", (ev) => { const node = ev.target instanceof E
 let held: { act: string; t: number } | null = null;
 document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
 document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
-document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-lvl")) { go(`l:set:${node.getAttribute("data-lvl") ?? ""}:${node.value}`); return; } if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
-document.addEventListener("change", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement) || !node.hasAttribute("data-art")) return; const file = node.files?.[0]; node.value = ""; if (file === undefined) return; gate = gate.then(async () => { if (store === null || state.current === null || state.stageId === null || state.screen !== "stage" || state.readOnly) return; if (!await saveStage()) { setArtNote(state.banner ?? "Couldn't save."); paint(); return; } let raw: Uint8Array; try { raw = await uploadBytes(file); } catch (e) { setArtNote(`Couldn't add ${file.name}: ${e instanceof Error ? e.message : "read failed"}`); paint(); return; } const got = await addPicture(store, state.current, state.files, state.rev, state.stageId, nowIso(), file.name, raw); if (!got.ok) { setArtNote(got.line); paint(); return; } state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); paint(); }).catch(fail); });
+document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-lvl")) { go(`l:set:${node.getAttribute("data-lvl") ?? ""}:${node.value}`); return; } if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(fxOpen() ? `e:set:${key}:${node.value}` : key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
+document.addEventListener("change", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-fxname")) { go(`e:name:${node.value}`); return; } if (!(node instanceof HTMLInputElement) || !node.hasAttribute("data-art")) return; const file = node.files?.[0]; node.value = ""; if (file === undefined) return; gate = gate.then(async () => { if (store === null || state.current === null || state.stageId === null || state.screen !== "stage" || state.readOnly) return; if (!await saveStage()) { setArtNote(state.banner ?? "Couldn't save."); paint(); return; } let raw: Uint8Array; try { raw = await uploadBytes(file); } catch (e) { setArtNote(`Couldn't add ${file.name}: ${e instanceof Error ? e.message : "read failed"}`); paint(); return; } const got = await addPicture(store, state.current, state.files, state.rev, state.stageId, nowIso(), file.name, raw); if (!got.ok) { setArtNote(got.line); paint(); return; } state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); paint(); }).catch(fail); });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
 void boot();
```

### `tools/maker/asset-check.ts` (edited)

```diff
diff --git a/tools/maker/asset-check.ts b/tools/maker/asset-check.ts
index f6672a1..5ec210f 100644
--- a/tools/maker/asset-check.ts
+++ b/tools/maker/asset-check.ts
@@ -12,7 +12,7 @@ function usedIds(project: Record<string, unknown>, files: Readonly<Record<string
 }
 /** H4 at Test only. Hard when a selected stage's map names the asset, else a warning. The index entry is kept. */
 export async function assetRows(store: MakerStore, folder: string, files: Readonly<Record<string, unknown>>): Promise<ReportRow[]> {
-  let docs = files; try { docs = migrateProject(files).files; } catch { return [{ code: "invalidValue", severity: "hard", path: "project.json", detail: "unreadable" }]; }
+  let docs: Readonly<Record<string, unknown>>; try { docs = migrateProject(files).files; } catch { return [{ code: "invalidValue", severity: "hard", path: "project.json", detail: "unreadable" }]; }
   const root = docs["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, assets = isObj(project["assets"]) ? project["assets"] : {}, used = usedIds(project, docs), pre = folder.endsWith("/") ? folder : `${folder}/`, rows: ReportRow[] = [];
   for (const [id, meta] of Object.entries(assets)) {
     if (!isObj(meta) || typeof meta["ext"] !== "string") continue;
```

### `src/editor/effect/list.ts` (new)

```ts
import { copyName } from "../project/home.ts";
import { SAVE, blankEffect, trashOf } from "./save.ts";
import { WRITER, write, type Row } from "./writer.ts";
export const FX_KNOBS = ["hit_stop_ms", "hit_white_ms", "hit_white_mode", "shake", "shake_ms", "squash", "tint_ramp", "connect"] as const;
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
export type EffectRow = { readonly id: string; readonly name: string; readonly used: number };
const revOf = (doc: Obj): number => (typeof doc["rev"] === "number" ? doc["rev"] : 0);
const catRev = (bag: Record<string, Obj>): number => { const project = bag["project.json"]?.["project"]; return isObj(project) && typeof project["catalogueRev"] === "number" ? project["catalogueRev"] : 0; };
const clone = (v: unknown): Obj => (isObj(v) ? structuredClone(v) : {});
export function effectRows(bag: Record<string, Obj>): EffectRow[] {
  const rows: EffectRow[] = [];
  for (const [path, doc] of Object.entries(bag)) {
    if (!path.startsWith("effects/") || path.slice("effects/".length).includes("/") || doc["behaviourId"] !== "effect" || typeof doc["id"] !== "string") continue;
    const id = doc["id"]; let used = 0;
    for (const [sp, setup] of Object.entries(bag)) { const answers = sp.startsWith("setups/") ? setup["answers"] : undefined; if (isObj(answers) && isObj(answers["effect"]) && answers["effect"]["value"] === id) used += 1; }
    rows.push({ id, name: typeof doc["name"] === "string" ? doc["name"] : id, used });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
const pathOf = (bag: Record<string, Obj>, id: string): string | null => { for (const [path, doc] of Object.entries(bag)) if (path.startsWith("effects/") && !path.slice("effects/".length).includes("/") && doc["id"] === id) return path; return null; };
export function newEffect(bag: Record<string, Obj>, id: string, at: string, mint: (prefix: string) => string): Record<string, Obj> {
  const names = effectRows(bag).map((row) => row.name); let n = 1; while (names.includes(`Effect ${n}`)) n += 1;
  const doc = write(blankEffect(id, `Effect ${n}`, at, catRev(bag)), { steps: [{ id: "s-1", kind: "stamp", seconds: 0.25 }] }, { at, mint });
  return { ...bag, [`effects/${id}.json`]: doc };
}
export function editEffect(bag: Record<string, Obj>, id: string, knob: string, value: unknown, at: string, mint: (prefix: string) => string): Record<string, Obj> {
  if (!(FX_KNOBS as readonly string[]).includes(knob)) return bag;
  const path = pathOf(bag, id); if (path === null) return bag;
  const doc = bag[path] ?? {}, next = write(doc, { [knob]: value }, { at, mint });
  return next === doc ? bag : { ...bag, [path]: next };
}
export function renameEffect(bag: Record<string, Obj>, id: string, raw: string, at: string): Record<string, Obj> {
  const name = raw.trim(), n = [...name].length; if (n < 1 || n > 40) return bag;
  const path = pathOf(bag, id); if (path === null) return bag;
  const doc = bag[path] ?? {}; if (doc["name"] === name) return bag;
  return { ...bag, [path]: { ...doc, name, rev: revOf(doc) + 1, updatedAt: at } };
}
export function duplicateEffect(bag: Record<string, Obj>, id: string, newId: string, at: string): Record<string, Obj> | null {
  if (!SAVE.id.test(id) || !SAVE.id.test(newId)) return null;
  const path = pathOf(bag, id); if (path === null) return null;
  const doc = bag[path] ?? {}, name = typeof doc["name"] === "string" ? doc["name"] : "Effect";
  const copy: Row = { ...doc, id: newId, name: copyName(name, effectRows(bag).map((row) => row.name)), rev: 1, createdAt: at, updatedAt: at, copiedFrom: { setupId: id, rev: revOf(doc), at }, answers: clone(doc["answers"]), orphans: clone(doc["orphans"]), history: { cap: WRITER.cap, baseSeq: 0, ops: [{ seq: 1, at, kind: "set", changes: [], note: "duplicate" }] } };
  return { ...bag, [`effects/${newId}.json`]: copy };
}
export function deleteEffect(bag: Record<string, Obj>, id: string, toNone: boolean): Record<string, Obj> {
  const path = pathOf(bag, id); if (path === null) return bag;
  const next: Record<string, Obj> = {}; for (const [key, doc] of Object.entries(bag)) if (key !== path) next[key] = doc;
  next[trashOf(path)] = bag[path] ?? {};
  if (toNone) for (const [sp, setup] of Object.entries(next)) { const answers = sp.startsWith("setups/") ? setup["answers"] : undefined; if (isObj(answers) && isObj(answers["effect"]) && answers["effect"]["value"] === id) next[sp] = { ...setup, answers: { ...answers, effect: { source: "user", value: "none" } } }; }
  return next;
}
```

### `tools/maker/effects.ts` (new)

```ts
import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { deleteEffect, duplicateEffect, editEffect, effectRows, FX_KNOBS, newEffect, renameEffect } from "../../src/editor/effect/list.ts";
import { panelOf, type PanelKnob } from "../../src/editor/unit/panel.ts";
import { BUNDLED } from "./catalogue.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type EffectsHit = Host & { readonly banner: string | null; readonly toast?: string | null };
export type EffectsIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const OPEN = "Made with a newer TileEngine. Open only.";
let mode: "closed" | "menu" | "edit" = "closed", openId = "", stack: DocText[] = [];
export function fxOpen(): boolean { return mode !== "closed"; }
function bagOf(files: DocText): Record<string, Obj> | null { const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag; }
const kept = (host: Host): EffectsHit => ({ ...host, banner: null });
const specOf = (knob: PanelKnob): KnobSpec => ({ id: knob.id, label: knob.label, type: knob.type, ...(knob.min === undefined ? {} : { min: knob.min }), ...(knob.max === undefined ? {} : { max: knob.max }), ...(knob.step === undefined ? {} : { step: knob.step }), ...(knob.max_len === undefined ? {} : { max_len: knob.max_len }), ...(knob.options === undefined ? {} : { options: knob.options }), ...(knob.builtin === undefined ? {} : { builtin: knob.builtin }) });
const useLine = (n: number): string => (n === 0 ? "Not used yet" : n === 1 ? "1 ability uses this" : `${n} abilities use this`);
export function effectsSection(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const rows = effectRows(bag).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="e:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span><span class="sub">${useLine(row.used)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="e:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
  const add = readOnly ? "" : `<button type="button" class="card new" data-act="e:new"><span class="grow"><span class="name">+ New effect</span></span></button>`;
  return `<h2>Effects</h2>${rows}${add}`;
}
export function effectsSheet(files: DocText, readOnly: boolean): string {
  if (mode === "closed" || readOnly) return "";
  const bag = bagOf(files); if (bag === null) return "";
  const row = effectRows(bag).find((item) => item.id === openId), name = row?.name ?? "Effect";
  if (mode === "menu") { const used = row?.used ?? 0, warn = used === 0 ? "" : `<p>${used === 1 ? "1 ability uses" : `${used} abilities use`} this; they'll show None</p>`, none = used === 0 ? "" : `<button type="button" class="btn danger" data-act="e:none">Delete and switch ${used} to None</button>`; return `<div class="scrim" data-sheet="effects"><div class="sheet" role="dialog"><h2>${esc(name)}</h2>${warn}<button type="button" class="btn" data-act="e:dup">Duplicate</button><button type="button" class="btn danger" data-act="e:delete">Delete</button>${none}<button type="button" class="btn ghost" data-act="e:close">Close</button></div></div>`; }
  let doc: Obj | null = null; for (const [path, item] of Object.entries(bag)) if (path.startsWith("effects/") && !path.slice("effects/".length).includes("/") && item["id"] === openId) doc = item;
  const answers = doc !== null && isObj(doc["answers"]) ? doc["answers"] : {}, knobs = panelOf(BUNDLED, { effect: FX_KNOBS }, "effect", answers).sections.flatMap((section) => [...section.knobs]);
  const body = knobs.map((knob) => `${knobWidget(specOf(knob), knob.value)}<button type="button" class="btn ghost" data-act="e:reset:${esc(knob.id)}">Reset to default</button>`).join("");
  return `<div class="scrim" data-sheet="effect"><div class="sheet" role="dialog"><header class="topbar"><button type="button" class="btn ghost" data-act="e:close">Back</button><h1>${esc(name)}</h1></header><input class="name-field" data-fxname value="${esc(name)}" aria-label="Effect name">${body}<button type="button" class="btn" data-act="e:dup">Duplicate</button><button type="button" class="btn" data-act="test">▶ Test</button></div></div>`;
}
function applyBag(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
  const next: Record<string, string> = {};
  for (const [path, text] of Object.entries(stored)) if (before[path] === undefined || after[path] !== undefined) next[path] = text;
  for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc);
  return next;
}
async function commit(io: EffectsIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const gone = Object.keys(stored).filter((path) => next[path] === undefined), plan: Record<string, string> = { ...next };
  for (const path of gone) { const text = stored[path]; if (text !== undefined) plan[path] = text; }
  const save = planSave(stored, plan, rev, io.now); if (!save.ok) return { ok: false, message: save.message };
  const wrote = await commitWrites(io.store, prefix(io.id), save.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  for (const path of gone) await io.store.remove(`${prefix(io.id)}${path}`);
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: save.writes.length > 0 ? rev + 1 : rev };
}
async function save(io: EffectsIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<EffectsHit> {
  if (after === before) return kept(host);
  const prev = stack; stack = [host.files];
  const wrote = await commit(io, host.files, host.rev, applyBag(host.files, before, after));
  if (!wrote.ok) { stack = prev; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast };
}
async function undo(io: EffectsIo, host: Host): Promise<EffectsHit> {
  const snap = stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
  const wrote = await commit(io, host.files, host.rev, snap);
  if (!wrote.ok) { stack = [snap]; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: null };
}
const fresh = (io: EffectsIo): string => `effect_${ulid(Date.parse(io.now), io.bytes())}`;
const knobValue = (bag: Record<string, Obj>, key: string, raw: string, toggle: boolean): unknown => {
  const knob = panelOf(BUNDLED, { effect: FX_KNOBS }, "effect", {}).sections.flatMap((section) => [...section.knobs]).find((item) => item.id === key);
  if (toggle) { let doc: Obj | null = null; for (const [path, item] of Object.entries(bag)) if (item["id"] === openId && path.startsWith("effects/") && !path.slice("effects/".length).includes("/")) doc = item; const answers = doc !== null && isObj(doc["answers"]) ? doc["answers"] : {}; const cur = isObj(answers[key]) && answers[key]?.["source"] !== "default" ? answers[key]?.["value"] : knob?.def; return cur !== true; }
  return knob?.type === "slider" ? Number(raw) : raw;
};
export async function effectsAct(act: string, host: Host, io: EffectsIo): Promise<EffectsHit> {
  if (act === "e:close") { mode = "closed"; return kept(host); }
  if (act === "e:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: OPEN };
  const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
  if (act === "e:new") { const id = fresh(io); openId = id; mode = "edit"; return save(io, host, bag, newEffect(bag, id, io.now, (p) => `${p}1`), "Changed · Undo"); }
  if (act.startsWith("e:open:")) { openId = act.slice(7); mode = "edit"; return kept(host); }
  if (act.startsWith("e:menu:")) { openId = act.slice(7); mode = "menu"; return kept(host); }
  if (act === "e:dup") { const next = duplicateEffect(bag, openId, fresh(io), io.now); return next === null ? kept(host) : save(io, host, bag, next, "Changed · Undo"); }
  if (act === "e:delete" || act === "e:none") { mode = "closed"; return save(io, host, bag, deleteEffect(bag, openId, act === "e:none"), "Deleted · Undo"); }
  if (act.startsWith("e:name:")) return save(io, host, bag, renameEffect(bag, openId, act.slice(7), io.now), "Changed · Undo");
  if (act.startsWith("e:reset:")) return save(io, host, bag, editEffect(bag, openId, act.slice(8), undefined, io.now, (p) => `${p}1`), "Changed · Undo");
  if (act.startsWith("e:set:") || act.startsWith("k:pick:") || act.startsWith("k:toggle:")) {
    const toggle = act.startsWith("k:toggle:"), head = toggle ? "k:toggle:" : act.startsWith("k:pick:") ? "k:pick:" : "e:set:";
    const rest = act.slice(head.length), cut = toggle ? -1 : rest.indexOf(":"), key = toggle ? rest : rest.slice(0, cut), raw = toggle ? "" : rest.slice(cut + 1);
    return save(io, host, bag, editEffect(bag, openId, key, knobValue(bag, key, raw, toggle), io.now, (p) => `${p}1`), "Changed · Undo");
  }
  return kept(host);
}
```

### `tests/editor/effects-10c.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { deleteEffect, duplicateEffect, editEffect, effectRows, newEffect, renameEffect } from "../../src/editor/effect/list.ts";
import { SAVE } from "../../src/editor/effect/save.ts";
import { prefix } from "../../src/editor/project/home.ts";
import { asWrites } from "../../src/editor/project/save.ts";
import { readProject } from "../../src/project/load/index.ts";
import { abilityAct, abilityOpen, abilityView } from "../../tools/maker/ability-panel.ts";
import { effectsAct, effectsSection } from "../../tools/maker/effects.ts";
import { commitWrites, memoryStore } from "../../tools/maker/store.ts";
import { createPlayFx } from "../../tools/play-stage/fx.ts";
import { openProject, playDocsOf } from "../../tools/play-stage/project.ts";
import { loadFixture, U } from "../tools/demo-fixture.ts";
const AT = "2026-11-25T12:00:00.000Z", FX = "effect_01JDB10C00000000000000000A", FY = "effect_01JDB10C00000000000000000D", LEG = "setup_01JDB10C00000000000000000B", COPY = "effect_01JDB10C00000000000000000C", MISS = "setup_01JDB10C00000000000000000Y", LINE = "setups/setup_01JDAT00000000000000000005.json", STAGE = "stages/stage_01JDAS00000000000000000001.json", STAMP = [{ id: "s-1", kind: "stamp", seconds: 0.25 }];
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const bagOf = (): Record<string, Obj> => { const bag: Record<string, Obj> = {}; for (const [k, v] of Object.entries(loadFixture())) if (isObj(v)) bag[k] = structuredClone(v); return bag; };
const doc = (bag: Record<string, Obj>, id: string): Obj => { const hit = bag[`effects/${id}.json`]; if (!isObj(hit)) throw new Error(id); return hit; };
const steps = (d: Obj): unknown => { const a = d["answers"]; return isObj(a) && isObj(a["steps"]) ? a["steps"]["value"] : null; };
const hist = (d: Obj): Obj[] => { const h = d["history"]; return isObj(h) && Array.isArray(h["ops"]) ? h["ops"].filter(isObj) : []; };
const answer = (bag: Record<string, Obj>, id: string): Record<string, Obj> => { const row = bag[LINE]; if (!isObj(row)) throw new Error("line"); const prev = isObj(row["answers"]) ? row["answers"] : {}; return { ...bag, [LINE]: { ...row, answers: { ...prev, effect: { source: "user", value: id, rev: 1 } } } }; };
const play = (files: Record<string, Obj>) => { const load = readProject(files); if (load.project === null) throw new Error(load.report.map((r) => `${r.code} ${r.path}`).join(" ")); return playDocsOf(load.project); };
test("10c effect data: New mints effect_<ULID> with one stamp step and a free name; the list sorts by name then id with its users; Duplicate copies answers under a fresh effect_ id (rev 1, one duplicate op, copiedFrom, ' copy' name) and references stay on the original", () => {
  const made = newEffect(bagOf(), FX, AT, (p) => `${p}1`); assert.equal(SAVE.id.test(FX), true); assert.equal(doc(made, FX)["name"], "Effect 1"); assert.deepEqual(steps(doc(made, FX)), STAMP);
  const named = renameEffect(newEffect(made, FY, AT, (p) => `${p}1`), FY, "Alpha", AT), used = answer(named, FX), rows = effectRows(used);
  assert.deepEqual(rows.map((r) => [r.name, r.id, r.used]), [["Alpha", FY, 0], ["Effect 1", FX, 1]]);
  const copy = duplicateEffect(used, FX, COPY, AT); if (copy === null) throw new Error("dup"); const c = doc(copy, COPY), op = hist(c)[0];
  assert.equal(c["name"], "Effect 1 copy"); assert.equal(c["rev"], 1); assert.deepEqual(c["copiedFrom"], { setupId: FX, rev: doc(used, FX)["rev"], at: AT }); assert.deepEqual(steps(c), steps(doc(used, FX)));
  assert.equal(op?.["seq"], 1); assert.equal(op?.["kind"], "set"); assert.equal(op?.["note"], "duplicate"); assert.deepEqual(op?.["changes"], []); assert.equal(hist(c).length, 1);
  const line = copy[LINE]; assert.equal(isObj(line) && isObj(line["answers"]) && isObj(line["answers"]["effect"]) && line["answers"]["effect"]["value"] === FX, true);
});
test("10c edit: a knob goes through the ED-E5 writer (history op, rev + 1) and Test draws it; reset returns it to the default; a knob outside FX_KNOBS or a bad name changes nothing", () => {
  const made = newEffect(bagOf(), FX, AT, (p) => `${p}1`), before = doc(made, FX), n = hist(before).length, rev = before["rev"];
  const edited = editEffect(made, FX, "shake", 2, AT, (p) => `${p}1`), next = doc(edited, FX), op = hist(next).at(-1), ch = op !== undefined && Array.isArray(op["changes"]) ? op["changes"].filter(isObj)[0] : undefined;
  assert.equal(typeof rev === "number" && next["rev"] === rev + 1 && hist(next).length === n + 1 && ch?.["knob"] === "shake", true); assert.deepEqual(steps(next), STAMP);
  const docs = play(answer(edited, FX)); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], FX); assert.equal(createPlayFx(docs.effects).values(FX)?.values["shake"], 2);
  const reset = editEffect(edited, FX, "shake", undefined, AT, (p) => `${p}1`), back = doc(reset, FX)["answers"]; assert.equal(isObj(back) && isObj(back["shake"]) && back["shake"]["source"] === "default", true);
  assert.equal(createPlayFx(play(answer(reset, FX)).effects).values(FX)?.values["shake"], undefined);
  assert.equal(editEffect(edited, FX, "picture", "x", AT, (p) => `${p}1`), edited); assert.equal(renameEffect(edited, FX, "  ", AT), edited); assert.equal(renameEffect(edited, FX, "x".repeat(41), AT), edited);
});
test("10c delete: the doc moves to effects/.deleted/ (the reader skips it, no row); its abilities then show unknownRef and run stock, or switch to none in the same action", () => {
  const bag = answer(newEffect(bagOf(), FX, AT, (p) => `${p}1`), FX), gone = deleteEffect(bag, FX, false);
  assert.equal(gone[`effects/${FX}.json`], undefined); assert.ok(isObj(gone[`effects/.deleted/${FX}.json`])); assert.equal(effectRows(gone).some((r) => r.id === FX), false);
  const load = readProject(gone); assert.equal(load.report.some((r) => r.code === "unknownRef" && r.detail === FX && r.severity === "warning"), true);
  const docs = play(gone); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], undefined); assert.equal(createPlayFx(docs.effects).ingest({ entries: () => [{ seq: 1, tick: 0, action: { id: "a1", kind: "ability" as const, actor: `${U.archer}#2`, target: null, durationMs: null, turns: null, effects: ["line-shot"] } }] }, 10, 200).length, 1);
  const none = deleteEffect(bag, FX, true), row = none[LINE]; const fx = isObj(row) && isObj(row["answers"]) ? row["answers"]["effect"] : undefined;
  assert.equal(isObj(fx) && fx["source"] === "user" && fx["value"] === "none", true); assert.equal(effectRows(none).length, 0);
  assert.equal(readProject(none).report.some((r) => r.code === "unknownRef" && r.detail === FX), false); assert.equal(play(none).fxOf?.[`${U.archer}|line-shot`], undefined);
});
test("10c effectNotRule (DSK): an effect id (new or legacy setup_) in project.rules, stage.rules, unit.setupIds or neutrals[].setupIds is a warning at the pointer brokenRef would use and ignored, and Test still opens; an id that resolves to nothing stays brokenRef hard", () => {
  const bag = newEffect(bagOf(), FX, AT, (p) => `${p}1`); bag[`effects/${LEG}.json`] = { ...doc(bag, FX), id: LEG };
  const root = bag["project.json"]; if (!isObj(root) || !isObj(root["project"]) || !Array.isArray(root["project"]["rules"])) throw new Error("project");
  bag["project.json"] = { ...root, project: { ...root["project"], rules: [...root["project"]["rules"], FX] } };
  const stage = bag[STAGE]; if (!isObj(stage) || !Array.isArray(stage["neutrals"])) throw new Error("stage");
  const neutrals = stage["neutrals"].map((n, i) => (isObj(n) && i === 2 ? { ...n, setupIds: [...(Array.isArray(n["setupIds"]) ? n["setupIds"] : []), LEG] } : n));
  bag[STAGE] = { ...stage, rules: [LEG], neutrals };
  const unitPath = `units/${U.archer}.json`, unit = bag[unitPath]; if (!isObj(unit) || !Array.isArray(unit["setupIds"])) throw new Error("unit");
  bag[unitPath] = { ...unit, setupIds: [...unit["setupIds"], FX] };
  const load = readProject(bag), at = (path: string, detail: string) => load.report.find((r) => r.path === path && r.detail === detail);
  assert.equal(at("project.json#/project/rules/2", FX)?.code, "effectNotRule"); assert.equal(at("project.json#/project/rules/2", FX)?.severity, "warning");
  assert.equal(at(`${STAGE}#/rules/0`, LEG)?.code, "effectNotRule"); assert.equal(at(`${STAGE}#/neutrals/2/setupIds/1`, LEG)?.code, "effectNotRule"); assert.equal(at(`${unitPath}#/setupIds/2`, FX)?.code, "effectNotRule");
  assert.equal(load.report.some((r) => r.code === "brokenRef" && (r.detail === FX || r.detail === LEG)), false); assert.notEqual(openProject(bag).docs, null);
  const miss = bagOf(), mroot = miss["project.json"]; if (!isObj(mroot) || !isObj(mroot["project"]) || !Array.isArray(mroot["project"]["rules"])) throw new Error("miss");
  miss["project.json"] = { ...mroot, project: { ...mroot["project"], rules: [...mroot["project"]["rules"], MISS] } };
  const hard = readProject(miss).report.find((r) => r.detail === MISS); assert.equal(hard?.code, "brokenRef"); assert.equal(hard?.severity, "hard"); assert.equal(hard?.path, "project.json#/project/rules/2"); assert.equal(openProject(miss).docs, null);
});
test("10c maker: the Effects section lists effects with use counts; New, a slider, Delete and Undo write through the store (trash file in, live file out, and back); the ability Effect row offers None and saved effects and sets the answer Test plays (an id not in the list writes nothing)", async () => {
  const pid = "project_01JDAP00000000000000000001", text: Record<string, string> = {};
  for (const [k, v] of Object.entries(bagOf())) text[k] = JSON.stringify(v);
  const store = memoryStore(); assert.equal((await commitWrites(store, prefix(pid), asWrites(text))).ok, true);
  const io = { store, id: pid, now: AT, bytes: () => new Uint8Array(16).fill(1) }, host = (files: Record<string, string>, rev: number) => ({ files, rev, readOnly: false, dirty: false });
  let hit = await effectsAct("e:new", host(text, 1), io); if (hit.banner !== null) throw new Error(hit.banner);
  const rel = Object.keys(hit.files).find((p) => p.startsWith("effects/") && !p.slice("effects/".length).includes("/")); if (rel === undefined) throw new Error("new");
  const made = JSON.parse(hit.files[rel] ?? "") as unknown; if (!isObj(made) || typeof made["id"] !== "string" || !SAVE.id.test(made["id"])) throw new Error("id"); const id = made["id"];
  const section = effectsSection(hit.files, false); assert.equal(section.includes("Effect 1") && section.includes("Not used yet"), true);
  hit = await effectsAct("e:set:shake:2", host(hit.files, hit.rev), io); if (hit.banner !== null) throw new Error(hit.banner);
  const saved = JSON.parse(store.files.get(`${prefix(pid)}${rel}`) ?? "") as unknown; if (!isObj(saved)) throw new Error("saved");
  assert.equal(isObj(saved["answers"]) && isObj(saved["answers"]["shake"]) && saved["answers"]["shake"]["value"] === 2 && hist(saved).length >= 2, true);
  const shown = { ...hit.files }, body = JSON.parse(shown[LINE] ?? "") as unknown; if (!isObj(body)) throw new Error("setup");
  shown[LINE] = JSON.stringify({ ...body, answers: { ...(isObj(body["answers"]) ? body["answers"] : {}), effect: { source: "user", value: id, rev: 1 } } });
  assert.equal(effectsSection(shown, false).includes("1 ability uses this"), true);
  hit = await effectsAct("e:delete", host(hit.files, hit.rev), io); const pre = prefix(pid);
  assert.equal(store.files.has(`${pre}${rel}`), false); assert.equal(store.files.has(`${pre}effects/.deleted/${id}.json`), true);
  hit = await effectsAct("e:undo", host(hit.files, hit.rev), io);
  assert.equal(store.files.has(`${pre}${rel}`), true); assert.equal(store.files.has(`${pre}effects/.deleted/${id}.json`), false);
  const bag: Record<string, Obj> = {}; for (const [k, v] of Object.entries(hit.files)) { const parsed = JSON.parse(v) as unknown; if (isObj(parsed)) bag[k] = parsed; }
  abilityOpen("setup_01JDAT00000000000000000005"); const unit = bag[`units/${U.archer}.json`]; if (!isObj(unit)) throw new Error("unit");
  const html = abilityView(bag, unit, false); assert.equal(html.includes(">None<") && html.includes(">Effect 1<"), true);
  const set = abilityAct(`a:fx:${id}`, bag, U.archer); if (!("bag" in set)) throw new Error("fx");
  const docs = play(set.bag); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], id); assert.equal(createPlayFx(docs.effects).values(id)?.values["shake"], 2);
  assert.equal("keep" in abilityAct("a:fx:effect_01JDB10C00000000000000000Y", bag, U.archer), true);
});
```

### `handoff/steps/tests/s10c-effect-editor/smoke.mjs` (new)

```js
// Step 10c effect editor. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s10c-effect-editor/smoke.mjs . 8816 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8816", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s10c-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005", ID = /^effect_[0-9A-HJKMNP-TV-Z]{26}$/;
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const slide = async (page, sel, value) => { const node = page.locator(sel); await node.waitFor({ timeout: 15000 }); await node.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, value); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    let id = "";
    await step("1 empty", async () => { await page.waitForFunction(() => document.body.innerText.includes("Effects") && !document.body.innerText.includes("Not used yet") && document.querySelector('[data-act="e:new"]') !== null, null, { timeout: 15000 }); });
    await step("2 new shake", async () => {
      await tap(page, "e:new"); await page.waitForFunction(() => document.querySelector('[data-knob="shake"]') !== null, null, { timeout: 15000 }); await slide(page, '[data-knob="shake"]', "2");
      await page.waitForFunction(() => Object.entries(window.__read()).some(([p, text]) => p.startsWith("effects/") && !p.slice(8).includes("/") && JSON.parse(text).answers?.shake?.value === 2), null, { timeout: 15000 });
      id = await page.evaluate(() => { const hit = Object.entries(window.__read()).find(([p]) => p.startsWith("effects/") && !p.slice(8).includes("/")); return hit ? JSON.parse(hit[1]).id : ""; });
      if (!ID.test(id)) throw new Error(id || "no id");
    });
    await step("3 row and test", async () => {
      await tap(page, "e:close"); await page.waitForFunction((archer) => document.querySelector('[data-sheet="effect"]') === null && document.querySelector(".scrim") === null && document.querySelector(`[data-act="u:open:${archer}"]`) !== null, ARCHER, { timeout: 15000 });
      await tap(page, `u:open:${ARCHER}`); await page.waitForFunction((line) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, `a:open:${LINE}`);
      await page.waitForFunction((id) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:fx:${id}"]`) !== null && document.querySelector('[data-act="a:fx:none"]') !== null && document.querySelector('[data-act="a:shut"]') !== null, id, { timeout: 15000 });
      await tap(page, `a:fx:${id}`); await page.waitForFunction((id) => document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true" && document.querySelector(".scrim") === null, id, { timeout: 15000 });
      await page.evaluate(() => new Promise((resolve) => { const root = document.querySelector("#app"), obs = new MutationObserver(() => { obs.disconnect(); resolve(true); }); if (root !== null) obs.observe(root, { childList: true }); const b = document.createElement("button"); b.setAttribute("data-act", "a:fx:effect_01JDB10C00000000000000000Y"); document.body.appendChild(b); b.dispatchEvent(new MouseEvent("click", { bubbles: true })); b.remove(); }));
      await page.waitForFunction((id) => document.querySelector(".scrim") === null && document.querySelector('[data-act="a:shut"]') !== null && document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true", id, { timeout: 15000 });
      await tap(page, "a:shut"); await page.waitForFunction((line) => document.querySelector('[data-act="a:shut"]') === null && document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, `a:test:${LINE}`);
      await page.waitForFunction(({ id, archer }) => window.__docs?.fxOf?.[`${archer}|line-shot`] === id && window.__fx?.values(id)?.values?.shake === 2, { id, archer: ARCHER }, { timeout: 15000 });
    });
    await step("4 dup delete undo", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="u:back"]') !== null || document.querySelector('[data-act="e:new"]') !== null, null, { timeout: 15000 });
      if (await page.locator('[data-act="u:back"]').count()) await tap(page, "u:back");
      await tap(page, `e:menu:${id}`); await tap(page, "e:dup"); await page.waitForFunction(() => document.body.innerText.includes("Effect 1 copy"), null, { timeout: 15000 }); await tap(page, "e:none");
      await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]); return files[`effects/${id}.json`] === undefined && files[`effects/.deleted/${id}.json`] !== undefined && setup.answers.effect.value === "none"; }, id, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]); return files[`effects/${id}.json`] !== undefined && files[`effects/.deleted/${id}.json`] === undefined && setup.answers.effect.value === id && Object.values(files).some((text) => { try { return JSON.parse(text).name === "Effect 1 copy"; } catch { return false; } }); }, id, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

