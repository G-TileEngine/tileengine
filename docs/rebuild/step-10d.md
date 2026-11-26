# Rebuild record: step 10d, built-in effects in the Effect row (the 10 BTF presets, picked by bare id and played in Test)

Original brief: [`docs/maker/steps/step-10d-builtin-effects.md`](../maker/steps/step-10d-builtin-effects.md) on the merge (r2, blob `e6c273a5`, sha256 `96e9e894ce850f7388c14f8cfacebec7e0f978afe6e3beab33b5d76fc2d46e0b`, 112 lines). Where 10d sits L13; Delivery L18; Goal L26; Read first L34; Rules L39; Build L47; Named tests L64; Smoke L69; Must NOT L73; Done when L78; Measured L83; Baseline republish L92; Carries L95. Count command L62; hard per-file caps L50–59; hard gate 400 at L61 (caps sum 286; trial 213). This is **10d**, roadmap step 10's last part: the built-in library that 10c left out (10c guide L101 carry, merged as `699bdb83`). It is not export (step 11) and it does not take the full designer, "Make my own from Holy blade", pictures, or the Effect row on the other 37 owners, into the maker (step 33). It teaches the **Built-in** sub-heading on basic attack and line shot (the 10 BTF presets, no `te-*`), picking one writes the bare id and re-slices `effect` into the catalogue like Add ability, an alias reads as pressed and is never rewritten, and Test plays the preset's values through the existing `createPlayFx` table (a saved id still wins; a picked id with no values draws stock). The merge keeps main's r2 guide (not in the Build table; the branch never edited it). Current main adds only the 10d r1 review. Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #106 and branch `step/step-10d-builtin-effects-r1-chatA` (r1 code head `d0230b29`, r1 tip `07f12d8d`); `handback/step-10d-builtin-effects/r1/HANDBACK.md` at `07f12d8d` and on the merge (HB, blob `73aad7d0`, 119 lines, sha256 `055c96efc5ee1f4c4c09e67badb6df667a12d67ac9b8456e3490dd35dd231146`). CoS verify report: r1 `/workspace/share/step-10d-r1-verify/report.md` (V1, 51 lines, sha256 `118d02d326d469651ec242770c7bacd35240bdd42ee427febcbd0b426c9c3194`, hash-object `c105b4e558a588c7a4440113c48c052febb43091`), **PASS**. `docs/qa/step-10d-r1-review.md` on main `beda5948` (QA1, blob `ba119cdb`, 42 lines, sha256 `eae9cff5d321b7cb70107e9b3ced2794a90b98486448da691e1c377fb86c391d`): **OK TO MERGE**. QA postmerge on `a8f2e2fd` **PASSED**: 1160/0, 1 warning (main moved by `beda5948`). Line cites use HB, V1 and QA1. Product line cites are at merge `a8f2e2fd` (tree `ed4a2bf3`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `ef25669ab76a53cabb69196d05709c79a17b44ff`, 2026-11-26 04:13 (UK time), tree `f443d4d5`, the 10d guide r2. Floor **1160** tests (guide L9: 10c's 1157 + N=3). After this merge the floor is **1160**. The guide was trialled on `08d5b2dc` (the 10c rebuild record + README row 28); the go-line is this guide-r2 commit. Later main `de22e8af` (2026-11-26 04:14 UK time) added the 10d paste, docs-only. The product count against `de22e8af` is 264; the official shortstat against this go-line base is 276 because it also includes the already-on-main paste |
| Main at merge | `de22e8af3939800e5ff3a63edea60ee98b77bbc9`, 2026-11-26 04:14 (UK time), tree `72ad9175`, the 10d paste on `ef25669a`, docs-only. This is the merge's first parent and the parent of the feat commit. Official 10d product against this parent is **264** (10 Build-table files, +252/−12) |
| r1 commits | on `step/step-10d-builtin-effects-r1-chatA`: `d0230b29fa28b1635b9104128bc4a579f5e1d54a` feat(maker): step 10d built-in effects (r1 code head, tree `f893ebc3a7e227d4cf2a7b23ef4e58c3c127221b`, 2026-11-26 05:27 UK time), `07f12d8d878c7af6ce62be321728ec578e0afc39` docs(handback): step 10d builtin effects r1 (tree `ed4a2bf3ee9007ccea3749005ae4425d4995ac5b`, 2026-11-26 05:37 UK time). The branch is linear, two commits on `de22e8af`, no merges, no rebase. Author and committer on both commits `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code head is the r1 hand-back folder only: `HANDBACK.md`. Smoke shots were produced and not committed |
| r1 verdict | Product green was **1160/0**. Official product vs current main (and vs the feat parent) is **264** (10 files, +252/−12), with every cap kept. The official shortstat against the go-line base is **276** (11 files, +264/−12) because it includes the inherited paste. tools tsc only the 3 base errors. All 21 smokes PASS first try, including s10d 8817 r1: 8 ok at 390 and at 360. Export audit PASS 134/148/147. Must-not list clean. CoS verify of r1 was **PASS** (V1, sha256 `118d02d3…`). Predicted merge tree onto then-main `de22e8af` was `ed4a2bf3` (V1, QA1), which equals the tip tree because main is an ancestor. QA **OK TO MERGE** (QA1, sha256 `eae9cff5…`). No fix or rework |
| Merge | PR #106, merge commit `a8f2e2fd8e059df3f35dc53f5b51397a0476aaa7`, 2026-11-26 07:56 (UK time). Tree `ed4a2bf3ee9007ccea3749005ae4425d4995ac5b` (the same tree CoS and QA predicted against main `de22e8af`; V1, QA1). First parent `de22e8af3939800e5ff3a63edea60ee98b77bbc9`, second parent `07f12d8d878c7af6ce62be321728ec578e0afc39`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #106: Step 10d: built-in effects (ChatA r1)`. Green on the merge **1160 pass / 0 fail** (`merge-pr.sh` `npm test`) |
| After the merge | main is `beda5948e3ab14807edecee4ea3b51acf93a21fa`, 2026-11-26 07:57 (UK time), tree `7968d1ff55f37325038de0389b94a66a683ff8ae`, which adds only `docs/qa/step-10d-r1-review.md` (42 insertions, sha256 `eae9cff5`, blob `ba119cdb`). QA postmerge on `a8f2e2fd` **PASSED**: 1160/0, 1 warning (main moved by `beda5948`). |
| Tests | 1157 + N=3 (named tests 1–3 in `tests/editor/effects-10d.test.ts`) = **1160 pass / 0 fail**. Floor after this merge is **1160** (HB, V1, QA1) |

## (b) Files

From `git diff --name-status de22e8af..d0230b29 -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` insertions and deletions against current main (also the feat parent and the merge's first parent), at the r1 code head (the accepted 10d product measure). The same product files are on the merge tree `ed4a2bf3`. The r1 review landed on main `beda5948` after the merge; it is not in the official 400. The new s10d smoke is counted in the 400 (guide L11, L59). The inherited paste `docs/maker/steps/step-10d-paste.md` is on the first parent already (blob `77af2c1a`, identical on the merge) and is not a builder product edit; it is the 11th file only when the official command is run against the go-line base `ef25669a`.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/project/builtin-fx.ts` | A | 23 / 0 | 24 (L50) | yes. **23** (sha256 `3e9fc8d114793d33a09cc34a8bd082fa6955e3b6fd94321f78299e18ca425891`) |
| `src/editor/effect/builtins.ts` | A | 34 / 0 | 40 (L51) | yes. **34** (sha256 `96409e2b954b001c56d74c026e02f4c813333499be926fd40f3acfcf34256ad2`) |
| `tools/maker/ability-panel.ts` | M | 24 / 2 | 26 (L52) | yes. **26** on cap (sha256 `4e1f31cee723db777c11229a44f27b454b5c7a35ea0dae849a6ca5ecccbaa411`) |
| `tools/play-stage/project.ts` | M | 12 / 4 | 24 (L53) | yes. **16** (sha256 `d4f5afc11f406f0262c22e76a6ea8cdcb90607d2e032d528108987c3fa8e7c10`) |
| `tools/play-stage/fx.ts` | M | 10 / 2 | 14 (L54) | yes. **12** (sha256 `85868ac2faf68c41482db462520dc1d0906fbad13c46c4f7f65e0a25c398249e`) |
| `tools/play-stage/load.ts` | M | 1 / 1 | 2 (L55) | yes. **2** on cap (sha256 `377a3f13712fab57d968e2ef9f200c6e354ad195c2aa563adca0c1101825b411`) |
| `tools/play-stage/board.ts` | M | 1 / 1 | 2 (L56) | yes. **2** on cap (sha256 `21e79d9df36a15b5e5aed0b1a53d91027760615ca79d506799e9f471289db488`) |
| `tests/project/effects-slot.test.ts` | M | 2 / 2 | 4 (L57) | yes. **4** on cap (sha256 `db88903fd210701af4d1dfbc850c20bdc8a67fe71e2c894f4626940ece296b53`) |
| `tests/editor/effects-10d.test.ts` | A | 77 / 0 | 80 (L58) | yes. **77** (sha256 `62a494b0eb51d96d6eb90772877073cc1a9dae332c6304cf072d7d16738727ba`) |
| `handoff/steps/tests/s10d-builtin-effects/smoke.mjs` | A | 68 / 0 | 70 (L59) | yes. **68** (sha256 `96b063bf9d83df4759897a8818162cf62a7ac268180fbad6f27d19079ee870f2`) |

No diff under `src/core/`, `src/sim/`, `src/rules/`, `tools/effect-designer/`, `data/`, fixtures, `tools/maker/catalogue.json`, the format docs, `behaviour-library/`, `tools/painter-proto/` or `ui-shell/`. `tools/play-stage/` is in the Build table and imports `src/project/builtin-fx.ts` only (never `tools/maker` or `src/editor`). The only smoke path in the diff is the new s10d smoke; the only other test edited is the 10b test 5 re-pin in `effects-slot.test.ts`. Official G7 at the r1 code head or r1 tip against `de22e8af`, and at the merge against first parent `de22e8af`, is **10 files changed, 252 insertions(+), 12 deletions(-)** = 264 ≤ 400. Against the go-line base `ef25669a` the same command is **11 files changed, 264 insertions(+), 12 deletions(-)** = 276 ≤ 400, the extra 12 insertions being the inherited paste. Every Build-table cap is kept (`ability-panel.ts`, `load.ts`, `board.ts` and `effects-slot.test.ts` sit on cap). Caps sum 286 (guide L61) is not a second gate. The trial on `08d5b2dc` was 10 files, 213 counted lines (200+ 13−). Shipped 264 is 51 above that trial (the new test is 77 vs the trial 61, the smoke is 68 vs 53, `builtins.ts` is 34 vs 30, `builtin-fx.ts` is 23 vs 15, plus small rises in the play-stage files). No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base and vs main. No gh-pages. No new rAF, timer or loop. No `te-*` in the `src/` or `tools/` product diff.

## (c) Key code and git commands

Step 10d is the built-in-library half of roadmap step 10 (guide L13–17, Rules 1–6). A built-in is not a new document and not new drawing code: its values are the catalogue `effect` defaults plus the preset's `overrides`, fed to the existing `createPlayFx` table and drawn by the existing fx-doc path. `src/rules` keeps `effectRef: "line-shot"`. It does not add `te-*` presets, does not edit steps, parts or pictures (step 33), does not re-slice for saved-effect answers, and does not change export or APK (step 11). No format-doc or catalogue edits. Nothing in `src/core`, `src/sim` or `src/rules`. Only the 10 Build-table files change.

**Resolve (Rule 1).** `fxBehaviour(cat)` (`src/project/builtin-fx.ts:5`) is the `effect` row of a catalogue or slice. `builtinFx(slice, answer)` (`:9`) strips a leading `builtin:effect/`, finds that preset id in the slice's `effect` row, and returns `{ id: <bare id>, values }` where `values` are every `effect` knob's `default` as stored (nulls included, `Object.hasOwn`), then the preset's `overrides` on top. `undefined` for a non-string, an id not in the presets, or a slice with no `effect` row. Pure `src/project` only.

**List and slice (Rule 2).** `builtinRows(bag, bundled, behaviourId)` (`src/editor/effect/builtins.ts:7`) walks that owner's `effect` knob `ref.builtin` in order and keeps only ids found in the *source* presets: the slice's `effect` row if it has one (`fxBehaviour(slice)`), else `bundled` when `addCase` is `"same"`, else none. Calling `fxBehaviour` on the owner row would look for a nested catalogue and hide Built-in after a pick (HB). Each row is `{ id, name }`, name = `display_name` else the id. `isBuiltin(answer, id)` (`:22`) is bare or alias. `withFx(bag, bundled)` (`:25`) returns the bag as is if the slice already has `effect`; `null` if the catalogue-rev gate isn't `"same"`; else the bag with `catalogue/slice.json` = `sliceDoc(bundled, [...slice ids, "effect"])` (the `addAbility` pattern). The `!isObj(sliced)` guard is unreachable (`sliceDoc` always returns an object) and was left (HB, QA1). Pure `src/editor` only.

**Effect row (Rule 3).** `fxRow` (`tools/maker/ability-panel.ts:35`) still starts with None and the saved effects, then when `builtinRows` isn't empty appends `<p class="row">Built-in</p>` and one `choice` button per row, `data-act="a:fx:<id>"`, `aria-pressed` by `isBuiltin(cur, id)`. `a:fx:` (`:84`) now requires the open setup's `behaviourId` to be a string before the 10c none/saved write (otherwise `{ keep: true }`). A value in that owner's `builtinRows` goes through `withFx` (`null` → `{ keep: true }`) and `setAnswer(..., value, "none")` with the **bare** id; `none` and saved ids behave as in 10c; anything else stays `{ keep: true }`. Alias acts are not in `builtinRows` and are not rewritten. `AbilityEdit` and `units.ts` are unchanged. The file sits on its cap at 26/26.

**Play (Rule 4).** `pickFx` (`tools/play-stage/project.ts:53`) gains a `builtins` record: a saved id wins as before; otherwise `builtinFx(store.slice, v)` sets `fxOf[key] = id` and `builtins[id] = values`. `playDocsOf` (`:93`) returns `fxBuiltins` only when non-empty. `PlayDocs` (`tools/play-stage/load.ts:23`) gains `readonly fxBuiltins?: …`. `createPlayFx(docs?, pick?, builtins?)` (`tools/play-stage/fx.ts:39`) adds each builtin as `{ rev: 1, values }` to its table, and the unjoined cast loop swaps the ref **only when `table.has(next)`** (else the cue keeps its stock ref; format L1713). `board.ts:95` passes `body.fxBuiltins`. The pre-existing long `board.ts` and `playDocsOf` return lines only gained an argument or a spread (HB).

**Re-pin (Rule 5).** 10b test 5 in `tests/project/effects-slot.test.ts` now names `btf-purple-drop` in the title and the `fxOf` assert ("10d plays it"). Its no-builtins `createPlayFx` line is unchanged and still expects stock ingest length 1 (the guarded swap's fallback). No other test was edited.

**Named tests** are 1–3 in `tests/editor/effects-10d.test.ts` (77/80, one statement per line; HB). Test 1 (`:29`) resolves a bare BTF id and its alias to defaults plus overrides (tint `#f4d56a`, blade `holy`, shake 0, a straight step) and returns nothing for a missing id or a slice with no effect row. Test 2 (`:39`) shows the 10 BTF ids under Built-in with no `te-*`, writes the bare id and re-slices, reads the alias as pressed, and offers none / writes nothing on catalogue rev 1. Test 3 (`:59`) plays a bare id (line shot) and an alias (basic attack): `fxOf` names the bare id, `fxBuiltins` carries the values, Holy Blade draws 1 piece, a pick with no values draws the 3-piece stock line shot, and a saved effect id still plays its document. Test 3 checks the basic-attack draw by piece count (the house attack is also one piece) (HB).

**Smoke.** `handoff/steps/tests/s10d-builtin-effects/smoke.mjs`, port 8817 r1, keeps the s10c layout (guide L62): `PLAYWRIGHT_CORE` / `CHROME`, the hit-test `tap` (`elementFromPoint`, scrim guard, `scrollIntoView`), and every timeout 15000. No retry loop. Steps at 390 and 360: 1 Built-in with 10 `a:fx:btf-*` and no `te-*`; 2 Holy Blade stores `btf-holy-blade` and the slice gains `effect`, then Undo puts both back; 3 Test plays tint `#f4d56a`; 4 None plays stock (no `fxOf` entry). 8 ok.

```
# Full product diff against the merge's first parent (the accepted product measure).
# The same 10 files against the go-line base also include the inherited paste:
#
#   git diff de22e8af a8f2e2fd -- \
#     src/project/builtin-fx.ts src/editor/effect/builtins.ts \
#     tools/maker/ability-panel.ts \
#     tools/play-stage/project.ts tools/play-stage/fx.ts \
#     tools/play-stage/load.ts tools/play-stage/board.ts \
#     tests/project/effects-slot.test.ts tests/editor/effects-10d.test.ts \
#     handoff/steps/tests/s10d-builtin-effects/smoke.mjs

# The hand-back (not in the 400):
#   git show a8f2e2fd:handback/step-10d-builtin-effects/r1/HANDBACK.md

# Product gate. The first parent of the merge is de22e8af
# (docs-only on the go-line base ef25669a). Official command at
# the r1 code head or r1 tip against de22e8af, or at the merge
# against first parent de22e8af:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   10 files changed, 252 insertions(+), 12 deletions(-)
#
# At d0230b29 against de22e8af: 10 files, 252 insertions, 12 deletions = 264.
# The same 264 at a8f2e2fd against de22e8af. At d0230b29 (or a8f2e2fd)
# against the go-line base ef25669a: 11 files, 264 insertions, 12
# deletions = 276, the extra file being the inherited paste.
# At beda5948 (current main, which also adds the r1 review) against
# de22e8af, the official command without ':!docs/**' is 11 files,
# 294 insertions, 12 deletions. Adding ':!docs/**' again gives 264.
#
# Trial on 08d5b2dc was 10 files, 213 counted lines.
#
# Named tests (npm test 1160/0, floor 1157 + N=3):
#   ✔ 10d resolve (DSK r42): …
#   ✔ 10d Effect row: …
#   ✔ 10d play: …
#
# Smokes: the builder used chrome-headless-shell (HB § Smoke); CoS and QA reruns used /opt/google/chrome/chrome, at 390 and 360 CSS px, all solo:
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
#   s10c (8816 r1) 8 ok, SMOKE PASS
#   s10d (8817 r1) 8 ok (4 @390, 4 @360), SMOKE PASS
#
# Mutations (each restored; 10b test 3 stayed pass on the fx.ts,
# project.ts and unguarded-swap plants):
#   fx.ts restored → 10d test 3 fail, 10b test 5 fail, 10b test 3 pass.
#   project.ts restored → the same three outcomes.
#   ability-panel.ts restored → 10d test 2 fail; s10d steps 1–4 fail at both widths.
#   board.ts restored → s10d steps 1, 2 and 4 ok; step 3 FAIL at both widths.
#   Defaults dropped from builtinFx → 10d tests 1 and 3 fail.
#   Alias not stripped → 10d tests 1 and 3 fail.
#   withFx returns the bag without sliceDoc → 10d tests 1, 2 and 3 fail.
#   Catalogue-rev gate dropped in withFx → 10d test 2 fail.
#   Row-source gate dropped → 10d test 2 fail.
#   Swap without table.has → 10d test 3 fail and 10b test 5 fail.
# QA's own plants (QA1) match: unguarded swap, catalogue-rev gate,
# empty builtinFx values, aria-pressed by bare id only.
#
# Export audit as above; s8-audit.mjs 134 / 148 / 147, empty hit list, AUDIT PASS.
```

## (d) What went wrong, in order, and the fix

r1 was accepted first time. There was no s10c-style smoke race, no cap-join rework, and no second product commit.

The official shortstat against the claimed go-line base `ef25669a` is 11 files / 276, while the Build table and the feat commit are 10 files / 264. The 11th file is `docs/maker/steps/step-10d-paste.md` (12 insertions), already on main `de22e8af`, identical blob `77af2c1a`. It is not HANDBACK (excluded from the official command) and not a builder product edit. CoS and QA both recorded this (V1, QA1, HB). The product that lands on main is 264.

HANDBACK's PR line was anticipatory: `PR: opened by Chief Of Staff from the branch` (no PR existed at hand-back time). Same class of nit as 10c r1. CoS opened PR #106 after the verify passed. Not a must-fix (V1, QA1).

QA notes, not must-fixes (QA1): (1) HANDBACK § Export audit says `/workspace/share/s8/s8-audit.mjs` "is not on disk"; after the box refresh it is. The builder ran an equivalent local check; CoS and QA ran the real script (PASS, same 134/148/147). Wording drift only. (2) `a:fx:` returns `{ keep: true }` when the open setup's `behaviourId` is not a string, before the 10c none/saved write. Not reachable from the UI (the Effect row needs that id), recorded in Decisions, and left because the file is 26/26. Carry for the next touch of `ability-panel.ts`. (3) The builder's first green run died at test 685 and was re-run; CoS used the prior periodic 1160/0 at the tip, and QA's own green completed at 1160/0. (4) DSK questions 1–3 in the guide stay open (not 10d scope).

QA postmerge on `a8f2e2fd` **PASSED**: 1160/0, 1 warning (main moved by `beda5948`).

## (e) Do it right first time

- The work is only in the 10 Build-table files. Do not edit `src/core`, `src/sim`, `src/rules`, `tools/effect-designer`, data, fixtures, `tools/maker/catalogue.json`, the format docs, behaviour-library, painter-proto or ui-shell. `tools/play-stage` is in the table and may import `src/project/builtin-fx.ts` only; it still never imports `tools/maker` or `src/editor`. Do not edit any other test or smoke except the 10b test 5 re-pin. Leave every smoke except the new s10d unedited. The only new test is `tests/editor/effects-10d.test.ts`.
- Built-ins only. No `te-*` presets, no new effect documents, no alias rewrite, no new drawing code, no CSS, no new rAF, timer or loop. Writers write the bare id. Alias reads as pressed. A saved id still wins; `createPlayFx` swaps the ref only when the table has it, otherwise stock (format L1713). A project on another catalogue rev shows no built-ins and a crafted pick writes nothing. The Effect row stays only on basic attack and line shot. Do not take pictures, "Make my own from Holy blade", or export / APK in this step.
- Do not add a baseline republish in this step. The published pages answer no built-in. The builder never publishes gh-pages. Any republish needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there.
- Don't wrap, split or join lines to dodge or fit a cap (guide L62). One statement per line in new `src/` and `tests/` code; the new smoke keeps the s10c smoke layout (hit-test `tap`, 15000 timeouts, no retry loops). The 400 hard gate stays. Caps sum 286 is not a second gate.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run of every smoke in § Smoke. Record the mutations (file restored → what fails), including s10d steps 1–4 at both widths when `ability-panel.ts` is restored, and step 3 at both widths when `board.ts` is restored. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time. Do not commit smoke shots. Running s6c rewrites the 6c checkpoint fixture, and later smokes can write untracked shots under `handback/`; restore tracked files, do not commit the shots. If s3 step 9 misses, re-run it solo once; do not edit s3.
- List helpers actually used in HANDBACK § Helpers, including uncommitted scripts. The 10d note lists `f5e7a87d`, `be284aae`, `a9e95058`, and `/tmp/s10d-allsmoke.sh`, `/tmp/s10d-mut.sh`, `/tmp/s10d-audit.mjs`.
- When the official shortstat against the go-line base is one file above the Build table, check whether that file is an already-on-main paste (or other docs-only inherit), not a product miss and not HANDBACK. Report the product measure against current main as well.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only the r1 review):
#   git diff a8f2e2fd HEAD -- \
#     src/project/builtin-fx.ts src/editor/effect/builtins.ts \
#     tools/maker/ability-panel.ts \
#     tools/play-stage/project.ts tools/play-stage/fx.ts \
#     tools/play-stage/load.ts tools/play-stage/board.ts \
#     tests/project/effects-slot.test.ts tests/editor/effects-10d.test.ts \
#     handoff/steps/tests/s10d-builtin-effects/smoke.mjs
#   (empty)

# Product gate. Official command at the r1 code head or r1 tip against
# de22e8af, or at the merge against first parent de22e8af:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   10 files changed, 252 insertions(+), 12 deletions(-)
#
# At d0230b29 against de22e8af: 10 files, 252 insertions, 12 deletions = 264.
# The same 264 at a8f2e2fd against de22e8af. At d0230b29 (or a8f2e2fd)
# against the go-line base ef25669a: 11 files, 264 insertions, 12
# deletions = 276, the extra file being the inherited paste.
# At beda5948 (current main, which also adds the r1 review) against
# de22e8af without ':!docs/**': 11 files, 294 insertions, 12 deletions.
# Adding ':!docs/**' again gives 264.
#
# Named tests (npm test 1160/0, floor 1157 + N=3):
#   ✔ 10d resolve (DSK r42): …
#   ✔ 10d Effect row: …
#   ✔ 10d play: …
#
# Smokes: the builder used chrome-headless-shell (HB § Smoke); CoS and QA reruns used /opt/google/chrome/chrome, at 390 and 360 CSS px, all solo, at
# the guide counts (S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16,
# s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16,
# s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8). Mutations as above.
#
# Export audit as above; s8-audit.mjs 134 / 148 / 147, empty hit list.
```

## QA non-blockers carried forward

- HANDBACK's PR line was anticipatory at hand-back time; CoS opened PR #106 after the verify. Helpers listed: `f5e7a87d`, `be284aae`, `a9e95058`, and the three uncommitted `/tmp/s10d-*.sh` / `.mjs` scripts (HB, V1, QA1).
- Four Build-table files sit on their cap (`ability-panel.ts` 26/26, `load.ts` 2/2, `board.ts` 2/2, `effects-slot.test.ts` 4/4). Shipped 264 is 51 above the trial 213 (still ≤ 400 and under the caps sum 286).
- `a:fx:`'s early `{ keep: true }` when `behaviourId` is not a string is unreachable from the UI and was left because the file is on cap. Carry for the next touch of `ability-panel.ts` (QA1).
- The audit script's maker-play figure is 147 (one more file than 10c, `src/project/builtin-fx.ts`). Play-stage release 134, baseline 148. HANDBACK also records a local `/tmp/s10d-audit.mjs`; CoS and QA ran `/workspace/share/s8/s8-audit.mjs` (V1, QA1).
- Running s6c rewrites the 6c checkpoint fixture, and later smokes can write untracked shots under `handback/`. Restore tracked files after a local run; do not commit the shots.
- s3 `waitForTimeout` flake carry is still open; it did not fire on the verify or QA runs (s3 18 ok first time; s8c 8 ok first time) (V1, QA1, HB).
- **Still open, not 10d scope** (guide L73–76, L95, L109, QA1): DSK questions 1–3; step 11 (export reads the same resolution; `.deleted/` must stay out); step 33 ("Make my own from Holy blade", pictures, `blade` / `picture` / `tint` / `glow` / `spawn` drawing, the Effect row on the other 37 owners); the 9 `te-*` presets; tags and search; from 9b/9c, 10a, 10b and 10c, the upload byte cap, the "Stairs to <stage name>" info row, markers in the maker, Cover/Stretch, 8192 toggle, `effects/.deleted/` purge after the undo window. Format docs were not edited. No baseline republish: the published pages answer no built-in; any republish needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there; the builder never publishes.
- **Closed here:** the Built-in sub-heading on basic attack and line shot (10 BTF ids, no `te-*`), picking writes the bare id and re-slices `effect`, alias reads as pressed and is never rewritten, Test plays builtin values through `fxBuiltins` and the guarded `createPlayFx` swap (saved ids still win; missing values draw stock), the 10b test 5 re-pin, and the 11-vs-10 official-count explanation (inherited paste).

## Blob check

Each file must have exactly this git blob id at `a8f2e2fd`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/project/builtin-fx.ts` | `2d3166b43503fd1affc0376566453ed9635acb4f` | 23 |
| `src/editor/effect/builtins.ts` | `e5a47aa9915953cd6a308f008746b4de03274929` | 34 |
| `tools/maker/ability-panel.ts` | `37446685e3470054435a734240e1f0ebccd076c8` | 113 |
| `tools/play-stage/project.ts` | `c5caa383b258c3e04da64dfd88a9e468ae3c7dd3` | 123 |
| `tools/play-stage/fx.ts` | `01842e72ad173bed54dd8a01e2663a553adc5c19` | 59 |
| `tools/play-stage/load.ts` | `24bdee601ba5a36ca53df6da0ada29ef3a6cba59` | 28 |
| `tools/play-stage/board.ts` | `f9283a3cb462068500f6b92ddbe6a938a93d6094` | 160 |
| `tests/project/effects-slot.test.ts` | `c2ffef0e5aead1561b7a0efd50d1893ecec70ff7` | 60 |
| `tests/editor/effects-10d.test.ts` | `48d8e61f5781e4c769c7bc2f9bbeb5ff88afdc08` | 77 |
| `handoff/steps/tests/s10d-builtin-effects/smoke.mjs` | `b13d358d69dadaf437aa7a53b555a6cdc7378a7d` | 68 |

## Appendix: full code as merged (step 10d, PR #106)

New files are `git show a8f2e2fd:<path>` in full. Edited files are `git diff de22e8af a8f2e2fd -- <path>`. (Against the go-line base `ef25669a` these 10 files are the same; that shortstat also lists the inherited paste, which is unchanged.)


### `tools/maker/ability-panel.ts` (edited)

```diff
diff --git a/tools/maker/ability-panel.ts b/tools/maker/ability-panel.ts
index 4726458..3744668 100644
--- a/tools/maker/ability-panel.ts
+++ b/tools/maker/ability-panel.ts
@@ -1,5 +1,7 @@
 import { aimKind, detach, panelOf, resetAnswer, setAnswer, stageFor, type PanelKnob, type PanelModel } from "../../src/editor/unit/panel.ts";
 import { effectRows } from "../../src/editor/effect/list.ts";
+import { builtinRows, isBuiltin, withFx } from "../../src/editor/effect/builtins.ts";
+import { BUNDLED } from "./catalogue.ts";
 import { WIRED } from "../../src/rules/behaviours/wired.ts";
 import { addChrome } from "./add-ability.ts";
 import { diagramHtml, diagramOf } from "./unit-diagram.ts";
@@ -30,7 +32,14 @@ function rowsOf(bag: Record<string, Obj>, unit: Obj, slice: Obj, skip: string):
   }
   return html;
 }
-const fxRow = (bag: Record<string, Obj>, behaviourId: string, answers: Obj): string => { if (aimKind(behaviourId) === undefined) return ""; const cur = isObj(answers["effect"]) && answers["effect"]["source"] !== "default" && typeof answers["effect"]["value"] === "string" ? answers["effect"]["value"] : "none"; return `<p class="row">Effect</p><button type="button" class="choice" data-act="a:fx:none" aria-pressed="${cur === "none"}">None</button>${effectRows(bag).map((row) => `<button type="button" class="choice" data-act="a:fx:${esc(row.id)}" aria-pressed="${cur === row.id}">${esc(row.name)}</button>`).join("")}`; };
+const fxRow = (bag: Record<string, Obj>, behaviourId: string, answers: Obj): string => {
+  if (aimKind(behaviourId) === undefined) return "";
+  const cur = isObj(answers["effect"]) && answers["effect"]["source"] !== "default" && typeof answers["effect"]["value"] === "string" ? answers["effect"]["value"] : "none";
+  const saved = effectRows(bag).map((row) => `<button type="button" class="choice" data-act="a:fx:${esc(row.id)}" aria-pressed="${cur === row.id}">${esc(row.name)}</button>`).join("");
+  const built = builtinRows(bag, BUNDLED, behaviourId);
+  const extra = built.length === 0 ? "" : `<p class="row">Built-in</p>${built.map((row) => `<button type="button" class="choice" data-act="a:fx:${esc(row.id)}" aria-pressed="${isBuiltin(cur, row.id)}">${esc(row.name)}</button>`).join("")}`;
+  return `<p class="row">Effect</p><button type="button" class="choice" data-act="a:fx:none" aria-pressed="${cur === "none"}">None</button>${saved}${extra}`;
+};
 export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boolean): string {
   const slice = bag["catalogue/slice.json"]; if (!isObj(slice)) return "";
   const id = typeof unit["id"] === "string" ? unit["id"] : "", placed = stageFor(bag, id), ids = list(unit["setupIds"]).filter((item): item is string => typeof item === "string");
@@ -72,7 +81,20 @@ export function abilityAct(act: string, bag: Record<string, Obj>, unitId: string
   if (!isObj(unit)) return { keep: true };
   if (act === "a:shut") { openId = ""; return { keep: true }; }
   if (act.startsWith("a:open:")) { openId = act.slice(7); return { keep: true }; }
-  if (act.startsWith("a:fx:")) { const value = act.slice(5); if (value !== "none" && !effectRows(bag).some((row) => row.id === value)) return { keep: true }; const setup = bag[`setups/${openId}.json`]; if (!isObj(setup)) return { keep: true }; const answers = isObj(setup["answers"]) ? setup["answers"] : {}; return { bag: { ...bag, [`setups/${openId}.json`]: { ...setup, answers: setAnswer(answers, "effect", value, "none") } }, toast: "Changed · Undo" }; }
+  if (act.startsWith("a:fx:")) {
+    const value = act.slice(5);
+    const setup = bag[`setups/${openId}.json`];
+    if (!isObj(setup) || typeof setup["behaviourId"] !== "string") return { keep: true };
+    const answers = isObj(setup["answers"]) ? setup["answers"] : {};
+    const behaviourId = setup["behaviourId"];
+    if (builtinRows(bag, BUNDLED, behaviourId).some((row) => row.id === value)) {
+      const next = withFx(bag, BUNDLED);
+      if (next === null) return { keep: true };
+      return { bag: { ...next, [`setups/${openId}.json`]: { ...setup, answers: setAnswer(answers, "effect", value, "none") } }, toast: "Changed · Undo" };
+    }
+    if (value !== "none" && !effectRows(bag).some((row) => row.id === value)) return { keep: true };
+    return { bag: { ...bag, [`setups/${openId}.json`]: { ...setup, answers: setAnswer(answers, "effect", value, "none") } }, toast: "Changed · Undo" };
+  }
   if (act === "a:test" || act.startsWith("a:test:")) {
     const stageId = stageFor(bag, unitId); if (stageId === null) return { keep: true };
     const abilityId = act === "a:test" ? undefined : act.slice(7);
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index ab0d905..c5caa38 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -1,3 +1,4 @@
+import { builtinFx } from "../../src/project/builtin-fx.ts";
 import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
 import { readMap, readStage } from "../../src/project/read/index.ts";
 import { createGrid } from "../../src/core/grid/index.ts";
@@ -49,8 +50,14 @@ function levelsOf(store: ProjectStore, stage: Obj): PlayOut["levels"] {
   if (rules === null) throw new Error("play: xp-levels");
   return { rules, pools: {} };
 }
-function pickFx(store: ProjectStore, id: string, setup: Obj, fxOf: Record<string, string>): void {
-  const behaviour = setup["behaviourId"] === "basic-attack" ? "basic-attack" : setup["behaviourId"] === "line-shot" ? "line-shot" : "", v = behaviour === "" ? undefined : knob(setup, store.slice, behaviour, "effect"); if (typeof v === "string" && Object.hasOwn(store.effects, v)) fxOf[`${id}|${behaviour === "basic-attack" ? HOUSE_ATTACK : "line-shot"}`] = v;
+function pickFx(store: ProjectStore, id: string, setup: Obj, fxOf: Record<string, string>, builtins: Record<string, Obj>): void {
+  const behaviour = setup["behaviourId"] === "basic-attack" ? "basic-attack" : setup["behaviourId"] === "line-shot" ? "line-shot" : "";
+  const v = behaviour === "" ? undefined : knob(setup, store.slice, behaviour, "effect");
+  const key = `${id}|${behaviour === "basic-attack" ? HOUSE_ATTACK : "line-shot"}`;
+  if (typeof v === "string" && Object.hasOwn(store.effects, v)) fxOf[key] = v;
+  const hit = typeof v === "string" && !Object.hasOwn(store.effects, v) ? builtinFx(store.slice, v) : undefined;
+  if (hit !== undefined) fxOf[key] = hit.id;
+  if (hit !== undefined) builtins[hit.id] = hit.values;
 }
 /** Adapter only. Document JSON is already read by readProject. */
 export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
@@ -62,6 +69,7 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
   const stepped = installOne(STEP_PATTERN, {}).out; if (stepped === null) throw new Error("play: step");
   const stats: Record<string, { hp: number; atk: number }> = {}, reach: Record<string, number> = {}, abilities: Record<string, { reach: number; damage: number; effectRef: string }[]> = {}, names: Record<string, string> = {}, fxOf: Record<string, string> = {};
+  const builtins: Record<string, Obj> = {};
   for (const [id, unit] of Object.entries(store.units)) {
     const st = isObj(unit["stats"]) ? unit["stats"] : {}, hpBag = st["unit_hp"], atkBag = st["unit_atk"], row = { hp: num(isObj(hpBag) ? hpBag["value"] : undefined) ?? hp0, atk: num(isObj(atkBag) ? atkBag["value"] : undefined) ?? atk0 };
     stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
@@ -69,7 +77,7 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
       const setup = store.setups[sid]; if (setup === undefined) continue;
       if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "orth-only-1" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
       if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
-      pickFx(store, id, setup, fxOf);
+      pickFx(store, id, setup, fxOf, builtins);
     }
   }
   const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(root["loadout"]) ? root["loadout"] : {}, chosen: string[] = [];
@@ -82,7 +90,7 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
   const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
   const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage), backdrop = backdropOf(root, map);
-  return { manifest: store.manifest, map, stage, links: core.doc.links ?? [], rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }), ...(backdrop.length === 0 ? {} : { backdrop }), effects: Object.values(store.effects), ...(Object.keys(fxOf).length > 0 ? { fxOf } : {}) };
+  return { manifest: store.manifest, map, stage, links: core.doc.links ?? [], rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }), ...(backdrop.length === 0 ? {} : { backdrop }), effects: Object.values(store.effects), ...(Object.keys(fxOf).length > 0 ? { fxOf } : {}), ...(Object.keys(builtins).length > 0 ? { fxBuiltins: builtins } : {}) };
 }
 export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
   try {
```

### `tools/play-stage/fx.ts` (edited)

```diff
diff --git a/tools/play-stage/fx.ts b/tools/play-stage/fx.ts
index fb532ce..01842e7 100644
--- a/tools/play-stage/fx.ts
+++ b/tools/play-stage/fx.ts
@@ -36,15 +36,23 @@ const houseCue = (entry: { seq: number; tick: number; action: Action }, stepMs:
   return { id: `cast:${entry.seq}`, atMs: entry.tick * stepMs, caster: action.actor, ref: HOUSE_ATTACK, ...(target === undefined ? {} : { target }) };
 };
 
-export function createPlayFx(docs?: readonly unknown[], pick?: (caster: string, ref: string) => string | undefined) {
+export function createPlayFx(docs?: readonly unknown[], pick?: (caster: string, ref: string) => string | undefined, builtins?: Readonly<Record<string, Readonly<Record<string, unknown>>>>) {
   const table = new Map(stock);
   for (const doc of docs ?? []) { const read = readEffect(doc); if (read.ok) table.set(read.doc.id, { rev: read.doc.rev, values: read.doc.values }); }
+  if (builtins !== undefined)
+    for (const [id, values] of Object.entries(builtins)) table.set(id, { rev: 1, values });
   const engine = createCastFx({ sheetOf: () => FX_SHEET, clipOf: () => FX_CLIP, values: (ref) => table.get(ref) ?? null });
   return {
     engine,
     values: (ref: string) => table.get(ref) ?? null,
     ingest(log: { entries(): readonly { seq: number; tick: number; action: Action }[] }, stepMs: number, now: number) {
-      for (const entry of log.entries()) { const cue = cueFromEntry(entry, stepMs, refOf) ?? houseCue(entry, stepMs); if (cue !== null) engine.cast(pick === undefined ? cue : { ...cue, ref: pick(cue.caster, cue.ref) ?? cue.ref }); }
+      for (const entry of log.entries()) {
+        const cue = cueFromEntry(entry, stepMs, refOf) ?? houseCue(entry, stepMs);
+        if (cue === null) continue;
+        const next = pick?.(cue.caster, cue.ref);
+        const ref = next !== undefined && table.has(next) ? next : cue.ref;
+        engine.cast(pick === undefined ? cue : { ...cue, ref });
+      }
       return engine.effects(now);
     },
   };
```

### `tools/play-stage/load.ts` (edited)

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index e9dacad..24bdee6 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -20,7 +20,7 @@ export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
 export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly fxOf?: Readonly<Record<string, string>>; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly bench?: readonly { readonly unitId: string; readonly hp: number }[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup; readonly backdrop?: readonly { readonly assetId: string; readonly file: string; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" }[]; readonly art?: (file: string) => Promise<Blob | null> };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly fxOf?: Readonly<Record<string, string>>; readonly fxBuiltins?: Readonly<Record<string, Readonly<Record<string, unknown>>>>; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly bench?: readonly { readonly unitId: string; readonly hp: number }[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup; readonly backdrop?: readonly { readonly assetId: string; readonly file: string; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" }[]; readonly art?: (file: string) => Promise<Blob | null> };
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
```

### `tools/play-stage/board.ts` (edited)

```diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index 2c1c0eb..f9283a3 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -92,7 +92,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   const player = createPlayer(world, { side: sides.me, moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
   const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
   const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
-  const fx = createPlayFx(body.effects, (caster, ref) => { const id = world.units.get(caster)?.unitId; return id === undefined || body.fxOf === undefined ? undefined : body.fxOf[`${id}|${ref}`]; }), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
+  const fx = createPlayFx(body.effects, (caster, ref) => { const id = world.units.get(caster)?.unitId; return id === undefined || body.fxOf === undefined ? undefined : body.fxOf[`${id}|${ref}`]; }, body.fxBuiltins), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
   let looks = dress(world.grid, body.looks), artBox: Record<string, SceneAsset> | null = null, artKey = "";
   const marks = (body.links ?? []).map((link) => ({ band: "fxGround" as const, sheet: { id: `play:link-${Object.hasOwn(SHAPE, link.type) ? link.type : "link"}`, columns: 1, fw: 16, fh: 16 }, x: link.at.c * TILE, y: link.at.r * TILE }));
   for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
```

### `tests/project/effects-slot.test.ts` (edited)

```diff
diff --git a/tests/project/effects-slot.test.ts b/tests/project/effects-slot.test.ts
index e051234..c2ffef0 100644
--- a/tests/project/effects-slot.test.ts
+++ b/tests/project/effects-slot.test.ts
@@ -46,10 +46,10 @@ test("10b asset check (Law 12): when the project can't be migrated, assetRows sa
   const files = { "project.json": { formatVersion: 6, project: { assets: { asset_dead: { ext: "png" } }, stages: ["s"] } }, "stages/s.json": { id: "s", mapRef: "m" }, "maps/m.json": { id: "m", background: { layers: [{ assetId: "asset_dead" }] } }, boom: () => 0 };
   assert.deepEqual(await assetRows(memoryStore(), "proj/", files), [{ code: "invalidValue", severity: "hard", path: "project.json", detail: "unreadable" }]);
 });
-test("10b r2 built-in answers: a bare BTF id matched against the slice's effect presets gives no row and runs stock; with no such preset in the slice it is unknownRef", () => {
+test("10b r2 built-in answers: a bare BTF id matched against the slice's effect presets gives no row and 10d plays it; with no such preset in the slice it is unknownRef", () => {
   const bare = filesOf(); answer(bare, LINE, "btf-purple-drop"); const missing = read(bare); assert.equal(at(missing, "unknownRef", `${LINE}#/answers/effect/value`)[0]?.detail, "btf-purple-drop");
   const files = filesOf(); addEffect(files); answer(files, LINE, "btf-purple-drop"); const load = read(files), docs = playDocsOf(load.project);
-  assert.equal(load.report.some((r) => r.code === "unknownRef" && r.detail === "btf-purple-drop"), false); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], undefined);
+  assert.equal(load.report.some((r) => r.code === "unknownRef" && r.detail === "btf-purple-drop"), false); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], "btf-purple-drop");
   assert.equal(createPlayFx(docs.effects, (caster, ref) => docs.fxOf?.[`${caster.split("#")[0]}|${ref}`]).ingest(shot(["line-shot"]), 10, 200).length, 1);
 });
 test("10b r2 alias: builtin:effect/<id> reads as the bare id (no row) and is never rewritten; an alias naming no preset is unknownRef", () => {
```

### `src/project/builtin-fx.ts` (new)

```ts
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const PREFIX = "builtin:effect/";
export function fxBehaviour(cat: unknown): Obj | undefined {
  if (!isObj(cat)) return undefined;
  return list(cat["behaviours"]).find((row): row is Obj => isObj(row) && row["id"] === "effect");
}
export function builtinFx(slice: unknown, answer: unknown): { readonly id: string; readonly values: Obj } | undefined {
  if (typeof answer !== "string") return undefined;
  const id = answer.startsWith(PREFIX) ? answer.slice(PREFIX.length) : answer;
  const row = fxBehaviour(slice);
  if (row === undefined) return undefined;
  const preset = list(row["presets"]).find((item): item is Obj => isObj(item) && item["id"] === id);
  if (preset === undefined) return undefined;
  const values: Obj = {};
  for (const knob of list(row["knobs"]))
    if (isObj(knob) && typeof knob["id"] === "string" && Object.hasOwn(knob, "default")) values[knob["id"]] = knob["default"];
  const over = preset["overrides"];
  if (isObj(over))
    for (const key of Object.keys(over)) values[key] = over[key];
  return { id, values };
}
```

### `src/editor/effect/builtins.ts` (new)

```ts
import { fxBehaviour } from "../../project/builtin-fx.ts";
import { sliceDoc, type CatalogueDoc } from "../../project/slice-of.ts";
import { addCase } from "../unit/add.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export function builtinRows(bag: Record<string, Obj>, bundled: CatalogueDoc, behaviourId: string): readonly { readonly id: string; readonly name: string }[] {
  const slice = bag["catalogue/slice.json"];
  if (!isObj(slice)) return [];
  const owner = list(slice["behaviours"]).find((row): row is Obj => isObj(row) && row["id"] === behaviourId);
  const knob = owner === undefined ? undefined : list(owner["knobs"]).find((item): item is Obj => isObj(item) && item["id"] === "effect");
  const ref = knob !== undefined && isObj(knob["ref"]) ? knob["ref"]["builtin"] : undefined;
  const live = fxBehaviour(slice);
  const source = live !== undefined ? live : addCase(bag, bundled).mode === "same" ? fxBehaviour(bundled) : undefined;
  if (source === undefined) return [];
  const name = new Map(list(source["presets"]).flatMap((item): [string, string][] => (isObj(item) && typeof item["id"] === "string" ? [[item["id"], typeof item["display_name"] === "string" ? item["display_name"] : item["id"]]] : [])));
  const out: { id: string; name: string }[] = [];
  for (const id of list(ref))
    if (typeof id === "string" && name.has(id)) out.push({ id, name: name.get(id) ?? id });
  return out;
}
export function isBuiltin(answer: string, id: string): boolean {
  return answer === id || answer === `builtin:effect/${id}`;
}
export function withFx(bag: Record<string, Obj>, bundled: CatalogueDoc): Record<string, Obj> | null {
  const slice = bag["catalogue/slice.json"];
  if (!isObj(slice)) return null;
  if (fxBehaviour(slice) !== undefined) return bag;
  if (addCase(bag, bundled).mode !== "same") return null;
  const ids = list(slice["behaviours"]).flatMap((row) => (isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []));
  const sliced = sliceDoc(bundled, [...ids, "effect"]);
  if (!isObj(sliced)) return null;
  return { ...bag, "catalogue/slice.json": sliced };
}
```

### `tests/editor/effects-10d.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { builtinRows, withFx } from "../../src/editor/effect/builtins.ts";
import { effectRows } from "../../src/editor/effect/list.ts";
import { builtinFx } from "../../src/project/builtin-fx.ts";
import { readProject } from "../../src/project/load/index.ts";
import { abilityAct, abilityOpen, abilityView } from "../../tools/maker/ability-panel.ts";
import { BUNDLED } from "../../tools/maker/catalogue.ts";
import { createPlayFx, HOUSE_ATTACK } from "../../tools/play-stage/fx.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
import { loadFixture, U } from "../tools/demo-fixture.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const LINE = "setups/setup_01JDAT00000000000000000005.json", BASIC = "setups/setup_01JDAT00000000000000000004.json", OPEN = "setup_01JDAT00000000000000000005";
const IDS = ["btf-purple-drop", "btf-holy-blade", "btf-cut", "btf-wrath-cone", "btf-heaven-sword", "btf-chain-hook", "btf-feather", "btf-spike", "btf-spin-fly-together", "btf-spin-split"];
const NAMES = ["Purple Drop", "Holy Blade", "Cut", "Wrath Cone", "Heaven Sword", "Chain Hook", "Feather", "Earth Spike", "Spin & Fly", "Spin & Split"];
const bagOf = (): Record<string, Obj> => Object.fromEntries(Object.entries(loadFixture()).flatMap(([k, v]) => (isObj(v) ? [[k, structuredClone(v)]] : [])));
const play = (files: Record<string, Obj>) => {
  const load = readProject(files);
  if (load.project === null) throw new Error(load.report.map((r) => r.code).join(" "));
  return { load, docs: playDocsOf(load.project) };
};
const put = (bag: Record<string, Obj>, path: string, value: string): void => {
  const row = bag[path];
  if (!isObj(row)) throw new Error(path);
  bag[path] = { ...row, answers: { ...(isObj(row["answers"]) ? row["answers"] : {}), effect: { source: "user", value, rev: 1 } } };
};
const cast = (effects: readonly string[], actor: string) => ({ entries: () => [{ seq: 1, tick: 0, action: { id: "a1", kind: "ability" as const, actor, target: null, durationMs: null, turns: null, effects } }] });
test("10d resolve (DSK r42): a bare BTF id and its builtin:effect/ alias resolve from the slice's effect presets to the catalogue effect defaults plus the preset's overrides; an id not in the presets, or a slice with no effect row, resolves to nothing", () => {
  const bare = bagOf();
  assert.equal(builtinFx(bare["catalogue/slice.json"], "btf-holy-blade"), undefined);
  const next = withFx(bare, BUNDLED);
  if (next === null) throw new Error("slice");
  const hit = builtinFx(next["catalogue/slice.json"], "btf-holy-blade");
  assert.equal(hit?.id === "btf-holy-blade" && hit.values["tint"] === "#f4d56a" && hit.values["blade"] === "holy" && hit.values["shake"] === 0 && Array.isArray(hit.values["steps"]) && isObj(hit.values["steps"][0]) && hit.values["steps"][0]["kind"] === "straight", true);
  assert.deepEqual(builtinFx(next["catalogue/slice.json"], "builtin:effect/btf-holy-blade"), hit);
  assert.equal(builtinFx(next["catalogue/slice.json"], "not-a-preset"), undefined);
});
test("10d Effect row: the owner's ref.builtin presets (the 10 BTF ids, in order, by display_name) show under Built-in with no te-* preset; picking one writes the bare id and puts effect in the slice like Add ability, with no reader row; the alias reads as picked; an older catalogue offers none and writes nothing", () => {
  const bag = bagOf();
  assert.deepEqual([builtinRows(bag, BUNDLED, "line-shot").map((row) => row.id), builtinRows(bag, BUNDLED, "line-shot").map((row) => row.name)], [IDS, NAMES]);
  abilityOpen(OPEN);
  const unit = bag[`units/${U.archer}.json`];
  if (!isObj(unit)) throw new Error("unit");
  assert.equal(abilityView(bag, unit, false).includes(">Built-in<") && abilityView(bag, unit, false).indexOf(">Built-in<") < abilityView(bag, unit, false).indexOf("a:fx:btf-purple-drop") && !abilityView(bag, unit, false).includes("a:fx:te-"), true);
  const set = abilityAct("a:fx:btf-holy-blade", bag, U.archer);
  if (!("bag" in set)) throw new Error("pick");
  assert.equal(isObj(set.bag[LINE]) && isObj(set.bag[LINE]["answers"]) && isObj(set.bag[LINE]["answers"]["effect"]) ? set.bag[LINE]["answers"]["effect"]["value"] : "", "btf-holy-blade");
  assert.equal(builtinFx(set.bag["catalogue/slice.json"], "btf-holy-blade")?.id, "btf-holy-blade");
  assert.equal(play(set.bag).load.report.some((r) => r.code === "unknownRef" && r.detail === "btf-holy-blade") || effectRows(set.bag).some((row) => row.id === "btf-holy-blade"), false);
  put(set.bag, LINE, "builtin:effect/btf-holy-blade");
  assert.equal(abilityView(set.bag, unit, false).includes('data-act="a:fx:btf-holy-blade" aria-pressed="true"'), true);
  const old = bagOf();
  const root = old["project.json"];
  if (!isObj(root) || !isObj(root["project"])) throw new Error("project");
  old["project.json"] = { ...root, project: { ...root["project"], catalogueRev: 1 } };
  assert.equal(builtinRows(old, BUNDLED, "line-shot").length === 0 && withFx(old, BUNDLED) === null && !abilityView(old, unit, false).includes(">Built-in<") && "keep" in abilityAct("a:fx:btf-holy-blade", old, U.archer), true);
});
test("10d play: Test plays a built-in by its bare id (line shot) or alias (basic attack): fxOf names the bare id, fxBuiltins carries its values and the draw is the preset's, not stock; a picked id with no values draws stock; a saved effect id still plays its document", () => {
  const bag = bagOf();
  abilityOpen(OPEN);
  const set = abilityAct("a:fx:btf-holy-blade", bag, U.archer);
  if (!("bag" in set)) throw new Error("pick");
  put(set.bag, BASIC, "builtin:effect/btf-holy-blade");
  const docs = play(set.bag).docs;
  const pick = (caster: string, ref: string) => docs.fxOf?.[`${caster.split("#")[0]}|${ref}`];
  assert.equal(docs.fxOf?.[`${U.archer}|line-shot`] === "btf-holy-blade" && docs.fxOf?.[`${U.archer}|${HOUSE_ATTACK}`] === "btf-holy-blade" && docs.fxBuiltins?.["btf-holy-blade"]?.["tint"] === "#f4d56a" && docs.fxBuiltins?.["btf-holy-blade"]?.["shake"] === 0, true);
  const drawn = createPlayFx(docs.effects, pick, docs.fxBuiltins).ingest(cast(["line-shot"], `${U.archer}#2`), 10, 100)[0];
  assert.equal(drawn?.pieces.length === 1 && isObj(drawn.pieces[0]) && drawn.pieces[0]["kind"] === "straight" && createPlayFx(docs.effects, pick, docs.fxBuiltins).ingest(cast([], `${U.archer}#1`), 10, 100)[0]?.pieces.length === 1, true);
  assert.equal(createPlayFx(docs.effects, pick).ingest(cast(["line-shot"], `${U.archer}#2`), 10, 100)[0]?.pieces.length, 3);
  const savedId = "effect_01JDB10D00000000000000000A";
  set.bag[`effects/${savedId}.json`] = { kind: "behaviour-setup", formatVersion: 3, id: savedId, rev: 1, behaviourId: "effect", catalogue: { rev: 30 }, answers: { steps: { source: "user", value: [{ kind: "stamp", seconds: 0.15 }] } } };
  put(set.bag, LINE, savedId);
  const again = play(set.bag).docs;
  const played = createPlayFx(again.effects, (caster, ref) => again.fxOf?.[`${caster.split("#")[0]}|${ref}`], again.fxBuiltins).ingest(cast(["line-shot"], `${U.archer}#2`), 10, 100)[0];
  assert.equal(again.fxOf?.[`${U.archer}|line-shot`] === savedId && played?.pieces.length === 1 && isObj(played.pieces[0]) && played.pieces[0]["kind"] === "stamp", true);
});
```

### `handoff/steps/tests/s10d-builtin-effects/smoke.mjs` (new)

```mjs
// Step 10d built-in effects. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s10d-builtin-effects/smoke.mjs . 8817 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8817", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s10d-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005", HOLY = "btf-holy-blade";
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const openLine = async (page) => { await tap(page, `u:open:${ARCHER}`); await page.waitForFunction((line) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 }); await tap(page, `a:open:${LINE}`); await page.waitForFunction((id) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:fx:${id}"]`) !== null && document.querySelector('[data-act="a:shut"]') !== null, HOLY, { timeout: 15000 }); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    await step("1 builtins", async () => {
      await openLine(page);
      const got = await page.evaluate(() => ({ btf: document.querySelectorAll('[data-act^="a:fx:btf-"]').length, te: document.querySelector('[data-act^="a:fx:te-"]') !== null, head: document.body.innerText.includes("Built-in") }));
      if (got.btf !== 10 || got.te || !got.head) throw new Error(JSON.stringify(got));
    });
    await step("2 pick undo", async () => {
      await tap(page, `a:fx:${HOLY}`);
      await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]), slice = JSON.parse(files["catalogue/slice.json"]); return setup.answers?.effect?.value === id && slice.behaviours.some((row) => row.id === "effect"); }, HOLY, { timeout: 15000 });
      await tap(page, "a:shut");
      await page.waitForFunction((line) => document.querySelector('[data-act="a:shut"]') === null && document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, "u:back");
      await page.waitForFunction(() => document.querySelector('[data-act="undo"]') !== null, null, { timeout: 15000 });
      await tap(page, "undo");
      await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]), slice = JSON.parse(files["catalogue/slice.json"]); return setup.answers?.effect?.value !== id && !slice.behaviours.some((row) => row.id === "effect"); }, HOLY, { timeout: 15000 });
    });
    await step("3 test", async () => {
      await openLine(page);
      await tap(page, `a:fx:${HOLY}`);
      await page.waitForFunction((id) => document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true", HOLY, { timeout: 15000 });
      await tap(page, "a:shut");
      await page.waitForFunction((line) => document.querySelector('[data-act="a:shut"]') === null && document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, `a:test:${LINE}`);
      await page.waitForFunction(({ id, archer }) => window.__docs?.fxOf?.[`${archer}|line-shot`] === id && window.__fx?.values(id)?.values?.tint === "#f4d56a", { id: HOLY, archer: ARCHER }, { timeout: 15000 });
    });
    await step("4 none stock", async () => {
      await press(page, "Back to maker");
      await page.waitForFunction((archer) => document.querySelector('[data-act="u:back"]') !== null || document.querySelector(`[data-act="u:open:${archer}"]`) !== null, ARCHER, { timeout: 15000 });
      if (await page.locator('[data-act="u:back"]').count() === 0) await openLine(page);
      else {
        await page.waitForFunction((line) => document.querySelector(`[data-act="a:open:${line}"]`) !== null || document.querySelector('[data-act="a:shut"]') !== null, LINE, { timeout: 15000 });
        if (await page.locator(`[data-act="a:open:${LINE}"]`).count()) await tap(page, `a:open:${LINE}`);
      }
      await page.waitForFunction(() => document.querySelector('[data-act="a:fx:none"]') !== null, null, { timeout: 15000 });
      await tap(page, "a:fx:none");
      await tap(page, "a:shut");
      await page.waitForFunction((line) => document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, `a:test:${LINE}`);
      await page.waitForFunction((archer) => window.__play !== undefined && window.__docs?.fxOf?.[`${archer}|line-shot`] === undefined, ARCHER, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```
