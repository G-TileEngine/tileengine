# Step 10d: built-in effects in the Effect row (the 10 BTF presets, picked by bare id and played in Test)

r2, 2026-11-26, Engine Architect (roadmap step 10's last part: the built-in library that 10c left out; 10c guide L101 carry). One builder run (ChatA) and one QA review, with gates on. Every number below comes from a trial run on main `08d5b2dc` (see Measured). In this guide, rulings from the CoS chat are labelled **EA ruling**, and DSK's rulings are labelled **DSK to EA**. Nothing here is a CEO ruling.

Step id: `step-10d-builtin-effects`. Guide revision r2; the build is r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main **`08d5b2dc6b83510f3c4862513407e8bd6b7ad76f`** (`08d5b2d docs(rebuild): step 10c record + README row 28, QA rebuild review`). 10c merged as `699bdb83cf3c4598ce5ce8e90935acfad9468fd4` (PR #105, tree `d718df663cc14a6090af5699b0bb45781b03da9a`); 10b's merge `10ab12d629af2604e7ed828d134eff8aafd9caf7` (PR #104) is an ancestor. `699bdb83..08d5b2dc` is docs only (4 files under `docs/qa` and `docs/rebuild`). Green on the base: **1157 pass, 0 fail**.
**Authority:** DSK D22 / D22b / D29 in `handoff/dsk-rulings/2026-11-17-phase1.md` L69 (sha256 `90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8`, 77 lines). **DSK r42 ruling (DSK to EA, 2026-11-25; quoted in `step-10b-effect-data.md` L8 on main):** an `effect` answer resolves `none`, then an effect doc id, then a bare BTF id from the slice's `effect` presets (format L1402, 5a), else `unknownRef`; `builtin:effect/<id>` is an accepted alias of the bare id, never rewritten; **writers write bare ids**. Format, pinned on `08d5b2dc`: `docs/maker/data/project-format.md` r41 (sha256 `7d89c4f41bf45cd6d24927a63896fcad4a098fba49ce313115e023da0a88b06e`, 4160 lines): **§4 L385** (the slice holds "`effect` (with its presets, the BTF builtins) when any `effect` answer isn't `none`"), L1094 and L1151 (an `effect` answer is `none`, a BTF builtin id or an effect id), **L1402** (5a: "BTF builtin ids resolve from the slice's `effect` presets"), L1713 (an answer naming no builtin or effect runs as `none`). `docs/maker/data/setup-format.md` r30 (sha256 `9692917753a0823b3865cd5c958b59435a289ca78f0367cb1f9b990fb5f6a9b6`, 2976 lines): L340 (`ref {docs: "effect", builtin: […]}`), **L362** (the `effect` knob's builtins are `none` + the 10 BTF presets, on 39 owners), L446, **L454** ("`btf-holy-blade` = catalogue `effect` defaults plus that preset's overrides"). Catalogue: `tools/maker/catalogue.json` rev 30 (= `behaviour-library/behaviours.json` for `effect`): the `effect` behaviour at L28125, its 10 `btf-*` presets from L31697 (status `src`) and 9 `te-*` presets from L32218 (status `PROPOSED`).
**Test floor:** **1157 + 3 = 1160**. N = 3 (named tests 1–3, one new file). One existing assert is re-pinned (10b test 5, see Rule 5); the count doesn't change for it.
**Needs:** 10c (merged). **Blocks:** nothing in step 10; step 11 export reads the same resolution (format L1402).
**Smoke:** new **s10d**, port **8817** (free: no smoke or step doc uses it on the base), `r1` (8 ok across 390 and 360). It is counted in the 400.

## Where 10d sits
- **10b** resolves a built-in answer with no row but plays it as stock; **10c** offers None and saved effects only (`a:fx:` writes only a listed id). **10d** offers the built-ins in the same Effect row and makes Test draw them. Steps 11 (export) and 33 (the full designer, "Make my own from Holy blade", setup-format L455) stay later.
- **Data the engine already runs.** A built-in is not a new document and not new drawing code: its values are the catalogue `effect` defaults plus the preset's `overrides` (setup-format L454), fed to the play stage's existing effect table (`createPlayFx`) and drawn by the existing fx-doc path. No game rule moves; `src/rules` keeps `effectRef: "line-shot"`.
- **UX:** in-repo maker patterns only. The Effect row (10c) gets a **Built-in** sub-heading after the saved effects, one `choice` button per preset, `aria-pressed` on the current answer. Picking writes at once with the usual "Changed · Undo" (shown after **Back**, as for every unit-page edit today). No CSS change. Checked at 390 and 360.

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-10d-builtin-effects-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-10d-builtin-effects/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green (test counts), § Smoke (all 21 smokes and the mutations) and § Export audit. Label the **Code head** apart from the docs-only **tip**, and give both shas; quote the tip sha and the test counts. Don't commit a raw test log or smoke shots.
- **§ Helpers & self-review lists EVERY helper agent, script and one-off command file used** (QA carry from 10c: rework helper `f758338e` was missing from its HANDBACK and had to go in the rebuild record). One line each: what it was asked to do and what it found or changed. "None" if none.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN` (not in chat, logs or files), and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no branch delete, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words:
- **Pick a built-in.** The basic attack and line shot Effect row shows None, the saved effects, then **Built-in**: the 10 BTF effects (Purple Drop, Holy Blade, Cut, Wrath Cone, Heaven Sword, Chain Hook, Feather, Earth Spike, Spin & Fly, Spin & Split: the catalogue's `display_name`s). Tapping one stores its **bare id** (`btf-holy-blade`), and the project's catalogue slice gains the `effect` row so the id resolves (format §4 L385). The reader gives no row.
- **Test plays it.** Test draws the built-in for that unit's cast through the same table saved effects use. An alias answer (`builtin:effect/btf-cut`) plays the same preset and is never rewritten.
- **Safe when it can't.** A project on another catalogue rev (the case where + Add ability also stops) shows no built-ins and a crafted pick writes nothing. A cast whose picked id has no values draws stock.

**Not in 10d:** the 9 `te-*` presets (PROPOSED, not in the owners' `ref.builtin`); "Make my own from …" and preset provenance (step 33); built-in pictures (`blade`, `picture`) and other keys the play stage doesn't draw; the Effect row on the other 37 owners; re-slicing for saved-effect answers (question 1); export or APK (step 11); format-doc or catalogue edits (DSK's).

## Read first (lines checked on the base, `08d5b2dc`)
1. Resolution today: `src/project/load/read-project.ts` L56 (the slice's `effect` preset ids), L67 (the r42 order and alias). `tools/play-stage/project.ts` L52 (`pickFx`: saved ids only), L64 (`fxOf`), L72 (call), L85 (return). `tools/play-stage/fx.ts` L15 (`stock`), L39 (`createPlayFx`), L47 (the cast swap). `tools/play-stage/board.ts` L95. `tools/play-stage/load.ts` L23 (`PlayDocs`). `src/project/read/effect.ts` L34 (saved docs carry user answers only). `src/runtime/render/fx-doc.ts` L10–11 (`STEP_KEYS`, `KNOBS`: the keys it draws).
2. The row: `tools/maker/ability-panel.ts` L16 (`AbilityEdit`), L33 (`fxRow`), L42 (the open ability page), L75 (`a:fx:`). `tools/maker/units.ts` L32 (`texts`: a changed doc in the bag is written, the slice too), L136–138 (save after `abilityAct`). `tools/maker/home.ts` L45 (no toast on the unit page).
3. The slice pattern: `src/editor/unit/add.ts` L35 (`addCase`, the catalogue-rev gate), L65–74 (`addAbility` re-slices with `sliceDoc`); `src/project/slice-of.ts` L14 (`sliceDoc`); `tools/maker/catalogue.ts` L7 (`BUNDLED`). The demo slice (`fixtures/demo.tileproj/catalogue/slice.json`) has no `effect` row; each owner's `effect` knob has `ref.builtin` = `none` + the 10 `btf-*` ids.

## Rules
1. **Resolve (`src/project/builtin-fx.ts`, new, pure).** `fxBehaviour(cat)`: the `effect` row of a catalogue or slice. `builtinFx(slice, answer)`: strip a leading `builtin:effect/`, find that preset id in the slice's `effect` row, and return `{ id: <bare id>, values }` where `values` = every `effect` knob's `default` (as stored, nulls included), then the preset's `overrides` on top (setup-format L454); `undefined` for a non-string, an id not in the presets, or a slice with no `effect` row.
2. **List and slice (`src/editor/effect/builtins.ts`, new, pure).** `builtinRows(bag, bundled, behaviourId)`: the ids in that owner's `effect` knob `ref.builtin` (slice row), in order, keeping only ids found in the presets of the *source*: the slice's `effect` row if it has one, else `bundled` when `addCase(bag, bundled)` is `"same"`, else none. Each row is `{ id, name }`, name = the preset's `display_name` (else the id). `isBuiltin(answer, id)`: bare or alias. `withFx(bag, bundled)`: the bag as is if the slice has `effect`; `null` if the gate isn't `"same"`; else the bag with `catalogue/slice.json` = `sliceDoc(bundled, [...slice ids, "effect"])` (the `addAbility` pattern).
3. **Effect row (`ability-panel.ts`).** After the saved effects, when `builtinRows` isn't empty: `<p class="row">Built-in</p>` and one `choice` button per row, `data-act="a:fx:<id>"`, `aria-pressed` by `isBuiltin(cur, id)`. `a:fx:<value>` reads the open setup's `behaviourId`; a value in its `builtinRows` goes through `withFx` (null → `{ keep: true }`) and writes `setAnswer(answers, "effect", value, "none")` with the **bare** id; `none` and saved ids behave as in 10c; anything else stays `{ keep: true }`. `AbilityEdit` and `units.ts` are unchanged (the slice doc travels in the bag).
4. **Play (`project.ts`, `load.ts`, `fx.ts`, `board.ts`).** `pickFx` gains a `builtins` record: a saved id wins as before; otherwise `builtinFx(store.slice, v)` sets `fxOf[key] = id` and `builtins[id] = values`. `playDocsOf` returns `fxBuiltins` (only when non-empty); `PlayDocs` gains `readonly fxBuiltins?: Readonly<Record<string, Readonly<Record<string, unknown>>>>`. `createPlayFx(docs?, pick?, builtins?)` adds each as `{ rev: 1, values }` to its table, and the cast swaps the ref **only when the table has it** (else the cue keeps its stock ref; format L1713). `board.ts` passes `body.fxBuiltins`. One statement per line on every touched line (the cast loop is unjoined).
5. **Re-pin (`tests/project/effects-slot.test.ts`).** 10b test 5 asserted `fxOf` undefined for a built-in; it now names `btf-purple-drop`, and the name says 10d plays it. Its no-builtins `createPlayFx` line is unchanged and now checks the stock fallback.
6. **Layers.** Nothing in `src/core`, `src/sim` or `src/rules`; the maker only authors data. `tools/play-stage` imports `src/project` only (never `tools/maker` or `src/editor`). No new codes, no format-doc or catalogue edits, no CSS, no new rAF, timer or loop.

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `src/project/builtin-fx.ts` | new, `fxBehaviour`, `builtinFx` (Rule 1) | 24 [15] |
| `src/editor/effect/builtins.ts` | new, `builtinRows`, `isBuiltin`, `withFx` (Rule 2) | 40 [30] |
| `tools/maker/ability-panel.ts` | Built-in buttons, `a:fx:` for built-ins (Rule 3) | 26 [17+ 2−] |
| `tools/play-stage/project.ts` | `pickFx` built-ins, `fxBuiltins` (Rule 4) | 24 [12+ 5−] |
| `tools/play-stage/fx.ts` | `builtins` param, guarded swap (Rule 4) | 14 [8+ 2−] |
| `tools/play-stage/load.ts` | `fxBuiltins` on `PlayDocs` (Rule 4) | 2 [1+ 1−] |
| `tools/play-stage/board.ts` | pass `body.fxBuiltins` (Rule 4) | 2 [1+ 1−] |
| `tests/project/effects-slot.test.ts` | 10b test 5 re-pinned (Rule 5) | 4 [2+ 2−] |
| `tests/editor/effects-10d.test.ts` | new, named tests 1–3 (one statement per line) | 80 [61] |
| `handoff/steps/tests/s10d-builtin-effects/smoke.mjs` | new smoke (port 8817) | 70 [53] |
| **Total** | caps sum to 286 | **400 hard gate [213]** |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules'`. Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap; one statement per line in new src/ and tests/ code; the new smoke keeps the s10c smoke layout, as in the trial.

## Named tests (`tests/editor/effects-10d.test.ts`)
1. `10d resolve (DSK r42): a bare BTF id and its builtin:effect/ alias resolve from the slice's effect presets to the catalogue effect defaults plus the preset's overrides; an id not in the presets, or a slice with no effect row, resolves to nothing`.
2. `10d Effect row: the owner's ref.builtin presets (the 10 BTF ids, in order, by display_name) show under Built-in with no te-* preset; picking one writes the bare id and puts effect in the slice like Add ability, with no reader row; the alias reads as picked; an older catalogue offers none and writes nothing`.
3. `10d play: Test plays a built-in by its bare id (line shot) or alias (basic attack): fxOf names the bare id, fxBuiltins carries its values and the draw is the preset's, not stock; a picked id with no values draws stock; a saved effect id still plays its document` (on the bundled demo: Holy Blade draws 1 piece, the stock line shot 3).

## Smoke (`handoff/steps/tests/s10d-builtin-effects/smoke.mjs`, port 8817, r1)
Dev maker build, touch, at 390 and 360. Steps: 1 a new demo project, the archer's line shot shows **Built-in** with 10 `a:fx:btf-*` buttons and no `te-*`; 2 tapping Holy Blade stores `btf-holy-blade` and the slice gains `effect` (`__read()`), then Back, Back and **Undo** put both back; 3 pick it again, Test plays it (`__docs.fxOf["<archer>|line-shot"]` is `btf-holy-blade`, `__fx.values("btf-holy-blade").values.tint` is `#f4d56a`); 4 Back to maker, None, Test plays stock (no `fxOf` entry). 8 ok.
Then run every smoke solo, unedited: S0 `touch-smoke.mjs` 8797 (14 ok), s3 `touch-smoke.mjs` 8798 (18), s4a 8799 (16), s4b 8800 (16), s4c 8801 (16), s5a 8802 (16), s5b 8803 (16), s5c 8804 (16), s6a 8805 (18), s6b 8806 (16), s6c 8807 (18), s6d 8808 (14), s7 8809 (20), s8 8810 r1 (16), s9 8811 r1 (12), s8c 8812 r1 (8), s9b 8813 r1 (14), s9c 8814 r1 (6), s10b 8815 r1 (8), s10c 8816 r1 (8), **s10d 8817 r1 (8)**. All print SMOKE PASS. **Restore tracked files after each run** (`git checkout -- handback` and remove untracked shots). s6c rewrites the 6c checkpoint fixture, and s6d, s8c and s9c read it. If s3 step 9 or s8c steps 1–3 miss (known flakes), re-run that smoke solo once and record both runs.

## Must NOT
- No edits outside the Build table. Nothing in `src/core`, `src/sim`, `src/rules` (no game rules; the maker only authors data), `tools/effect-designer`, data, fixtures, `tools/maker/catalogue.json`, `behaviour-library`, the format docs, `painter-proto` or `ui-shell`. No edit to any other test or smoke.
- No `te-*` presets in the row; no new effect documents for built-ins; no rewrite of alias answers; no new drawing code or picture loading; no export or APK work.
- Never push main, a tag or gh-pages; no force-push; no branch or tag delete; no PR actions. The builder never publishes gh-pages. `GH_BUILDER_TOKEN` never in chat, logs, files or `.git/config`.

## Done when
- Green exits 0 at the floor (**1160**). `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101; maker `home.ts` ×2 at L89).
- All 21 smokes PASS with the counts above. `node /workspace/share/s8/s8-audit.mjs <worktree>` → AUDIT PASS.
- HANDBACK § Smoke records the mutations below; § Helpers lists every helper and script.

## Measured (trial run, 2026-11-26, a fresh `/tmp` clone of main `08d5b2dc` with `npm ci`, never committed or pushed)
- Base: `npm test` and green exit 0, **1157 pass, 0 fail**.
- Trial: green exit 0, **1160 pass, 0 fail** (eslint, depcruise, check:state and check:law clean); tools tsc shows only the 3 base errors.
- Count: 10 files, **200+ 13− (213)**, per the table.
- Smokes: all 21 PASS first run (S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, **s10d 8**); AUDIT PASS (134 / 148 / 147: one more file in each play tree, `src/project/builtin-fx.ts`).
- Mutations. Base file restored: `fx.ts` → 10b test 5 and test 3; `project.ts` → 10b test 5 and test 3; `ability-panel.ts` → test 2, and s10d steps 1–4 at both widths; `board.ts` → s10d step 3 at both widths. In the new code: defaults dropped from `builtinFx` → tests 1 and 3; alias not stripped → tests 1 and 3; `withFx` that doesn't re-slice → tests 1–3; the catalogue-rev gate dropped in `withFx` or in the row source → test 2; the swap without `table.has` → 10b test 5 and test 3.
- Trial patch: `/workspace/share/s10d/s10d-trial.patch` (sha256 `45f1fc7521222e19fa615e6e129fd2def61a9ea6c1206f7cbf0a731c4da02226`, 353 lines, 10 files, a diff over `08d5b2dc`; it excludes `handback/`). On a fresh `08d5b2dc` worktree it applies cleanly, green gives 1160/0, and s10d passes 3 of 3 solo runs there (8 ok each).
- Helpers used for the trial: `/workspace/share/s10d/allsmoke.sh` (runs the 21 smokes solo and restores `handback/` after each) and `/workspace/share/s8/s8-audit.mjs`.

## Baseline republish
- None needed: the baseline projects answer no built-in, so the published pages don't change. If CoS wants one anyway, publish only on the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there (the builder never publishes or pushes gh-pages). QA's post-publish walk runs **headless, at device scale 1** (360 and 390 wide). **Only the CEO's phones are real devices.**

## Carries
**Closed here:** the 10c L101 built-in library carry (picker, slice row, play table); DSK r42's writer side (bare ids).
**Still open, not 10d scope:**
- Built-in pictures: the play stage draws every step with its one spark sheet, so `blade`, `picture`, `tint`, `glow` and `spawn` are carried in the values but not drawn (fx-doc `STEP_KEYS` / `KNOBS`). Step 33 or step 11's Render.
- "Make my own from Holy blade" (setup-format L455) and `presetRef` provenance: step 33.
- The Effect row on the other 37 owners: with their play wiring.
- Unit-page Undo: the toast shows only after Back (`home.ts` L45), for every unit-page edit; UX may want it on the page.
- s3 flake (`touch-smoke.mjs` L119/L121); s8c flake (steps 1–3 at 390, "no hero", seen once in the 10c r2 trial); upload byte cap (DSK/UX).

## EA rulings in this guide
1. **Names and place:** the row shows each built-in by its preset `display_name`, under a "Built-in" sub-heading after the saved effects (the 10c row pattern).
2. **Rev gate:** built-ins are offered only when the slice already has `effect` or + Add ability's catalogue-rev gate is "same"; otherwise none are offered and a pick writes nothing (the existing "Update this project" offer in + Add ability is the way forward).
3. **Play path:** built-ins play through the existing play-stage effect table and fx-doc, with no new drawing; a picked id with no values draws stock.

## Questions for DSK (none block the build)
1. **Slice row for saved effects.** Format §4 L385 also wants `effect` in the slice when a saved-effect answer is set (and "every behaviour any … effect document uses"). 10c doesn't add it, and 10d adds it only on a built-in pick (Rule 2). Should a saved-effect pick re-slice too, and what happens on another catalogue rev?
2. **Null defaults.** Setup-format L454 says "catalogue `effect` defaults plus that preset's overrides". Built as stored, so `tint_ramp`, `pixel_scale` and `shake_ms` resolve to `null` (the play stage treats them as unset). Confirm, or name the rule.
3. **`te-*` ids.** The r42 reader (`read-project.ts` L56) accepts any preset id in the slice's `effect` row, so a `te-*` (PROPOSED) answer reads with no row and 10d plays it, though no owner's `ref.builtin` lists it. Should the reader accept only `ref.builtin` ids?
