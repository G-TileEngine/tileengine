# Step 10c: the maker's effect editor (Effects list, edit, Duplicate, delete into .deleted/, the Effect row, effectNotRule)

r2, 2026-11-25, Engine Architect (r2: DSK r42 moves the `effectNotRule` path to the `brokenRef` pointer, plus QA's optional r1 nit (`docs/qa/step-10c-guide-review.md` `762e73ff…`): `a:fx:` checks the id against `effectRows` before writing; EA/DSK answers recorded; base moves to main `0673be7e` + 10b r2. r1: CEO go 2026-11-25 12:57 London, via CoS: roadmap step 10 approved, split into 10b effect data and 10c effect editor). One builder run (ChatA) and one QA review, with gates on. Every number below comes from a trial run on main `0673be7e` (10a merged) + the 10b r2 trial patch (see Measured). In this guide, rulings from the CoS chat are labelled **EA ruling**, not CEO rulings.

Step id: `step-10c-effect-editor`. Guide revision r2; the build is r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** **re-pinned to the 10b merge sha before the go-line.** 10a is merged (`c3e056ff`, PR #103); main is `0673be7eb7e7ea6cfb8a59a10ff620ed19397abe` (`0673be7 docs(qa): step 10a r1 review`, 1146/0). 10b isn't merged yet, so the trial ran on `0673be7e` + `/workspace/share/s10b/s10b-trial.patch` r2 (sha256 `7c5d05d1…`): green **1152 pass, 0 fail**. CoS names the 10b merge sha and its count in the go-line, and the builder uses that main.
**Authority:** DSK D22 / D22b / D29 in `handoff/dsk-rulings/2026-11-17-phase1.md` L69 (sha256 `90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8`, 77 lines). **DSK 10c ruling (DSK to EA, 2026-11-25; r42):** an id in `project.rules`, `stage.rules`, `unit.setupIds` or `neutrals[].setupIds` that resolves to an `effects/` doc (a legacy `setup_<ULID>` too) is `effectNotRule` (warning; where = **the same pointer `brokenRef` would use** at that site, e.g. `stages/<id>.json#/rules/<i>`; detail = the effect id), is ignored, and never gets H3 `brokenRef`; an id that resolves to nothing stays H3 `brokenRef`; the resolver checks `ProjectStore.effects` before H3. Format: `docs/maker/data/project-format.md` r41 (sha256 `7d89c4f41bf45cd6d24927a63896fcad4a098fba49ce313115e023da0a88b06e`) §6.7 L1147–1152 (doc, slot, ids, not rules), **the Effects list (K-1)** L1155–1165 (order, Duplicate), **Deleting (K-3)** L1188–1191; `setup-format.md` §2.10 L437–461. DSK also confirmed (r41): detail encodings as built, and `effects/` uses the `behaviour-setup` v3 version guard as built.
**Test floor:** **10b's merged count + 5** (1152 + 5 = **1157** in the trial). N = 5 (named tests 1–5, one new file). No existing test is re-pinned.
**Needs:** 10b (merged). **Blocks:** 10d (the built-in effect library).
**Smoke:** new **s10c**, port **8816**, `r1` (8 ok across 390 and 360). It is counted in the 400.

## Where 10c sits (E-lane, Effect Designer, steps 10b/10d/33)
- **E-lane (merged, not duplicated):** ED-E5 writer and dice (`ae7e7f0`, PR #59), ED-E6 designer page 1 (`1cdcd41`, PR #64), ED-E7 designer page 2 (`e4ff548`, PR #69) and ED-E7p ability play (`066b96f`, PR #71) built the **standalone dev Effect Designer** (`tools/effect-designer/`, `src/editor/effect/`): steps strip, presets, layers, Save & use. 10c **reuses** their code (the E5 `write` for every knob edit, `blankEffect`, `trashOf` and `SAVE.id` from `save.ts`) and **doesn't touch** `tools/effect-designer/`.
- **10c is the maker's basic editor** (roadmap row 10's editor half): an Effects list on the project screen, New, the play-drawn knobs, Duplicate, delete into `effects/.deleted/`, and an **Effect** row on the two play-wired abilities (basic attack, line shot). Steps, parts and pictures stay with the designer and step 33 (the full designer in the maker, roadmap L129).
- **10b** (before) reads `effects/` and plays a saved effect by exact id; 10c writes the docs and the `effect` answer that 10b plays. **10d** (after): the built-in library (see Carries).
- **UX:** `docs/maker/ux/effect-designer-v3-ux.md` moved to the private repo (sha256 `2622814f…`), so 10c follows the in-repo maker patterns: a project-screen section with a full sheet (`levels.ts`), the `⋯` menu sheet (`units.ts`, `rooms.ts`), the ability panel's knob widgets with **Reset to default** (`ability-panel.ts`, `widgets.ts`), the "Changed · Undo" / "Deleted · Undo" toasts, and the format's K-1/K-3 copy. No CSS change. Checked at 390 and 360.

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-10c-effect-editor-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-10c-effect-editor/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green (test counts), § Smoke (all 20 smokes and the mutations) and § Export audit. Label the **Code head** apart from the docs-only **tip**, and give both shas. Don't commit a raw test log or smoke shots.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words:
- **Effects on the project screen.** An **Effects** list, sorted by name then id, shows each effect with "Not used yet" or "N abilities use this", and **+ New effect**. New makes `effect_<ULID>` named "Effect N", with one stamp step so it draws something straight away.
- **Edit.** Tapping an effect opens a sheet: its name, and the knobs the play stage draws (tint ramp, hit timing, hit-stop, hit-white, shake, squash), each with Reset to default, plus Duplicate and ▶ Test. Every edit goes through the ED-E5 writer (history op, rev + 1) and saves at once.
- **Duplicate and delete.** The `⋯` menu duplicates (a fresh `effect_` id, "… copy" name, references left on the original) or deletes. Delete moves the file to `effects/.deleted/<id>.json`. A used effect warns with the count and also offers "Delete and switch N to None" in one action. Undo brings the file back.
- **Use it.** The basic attack and line shot get an **Effect** row: None or any saved effect. Test plays it through the 10b path.
- **effectNotRule** (DSK): an effect id in a rules or setup-id list is a warning and is ignored; Test still opens.

**Not in 10c:** the built-in library (10d); editing steps, parts or pictures (the designer, step 33); tags and search; the Effect row on other owners; purging `effects/.deleted/` after the undo window; export or APK (step 11); format-doc edits (DSK's).

## Read first (lines checked on the trial base: `0673be7e` + 10b r2)
1. Format §6.7: L1155–1165 (list order: name, case-insensitive, then id; Duplicate copies `answers` and `orphans`, a new `effect_<ULID>`, `rev: 1`, fresh history with one `set` op noted `duplicate`, `copiedFrom {setupId, rev, at}`, name + " copy" / " copy 2"; references not moved); L1188–1191 (K-3: plain delete warns with the count; "Delete and switch N abilities to None" is one action; undo restores the file from `effects/.deleted/`).
2. Reuse: `src/editor/effect/writer.ts` L7 (`WRITER`), L47 (`write`); `src/editor/effect/save.ts` L3 (`SAVE`), L14 (`blankEffect`), L25 (`trashOf`); `src/editor/project/home.ts` L8 (`ulid`), L16 (`copyName`); `src/editor/unit/panel.ts` (`panelOf`, `aimKind`, `setAnswer`); `tools/maker/widgets.ts` (`knobWidget`); the catalogue's `effect` behaviour in `tools/maker/catalogue.json` (`BUNDLED`; the project slice has no `effect` row).
3. Patterns: `tools/maker/levels.ts` (section, sheet, `planSave` + `commitWrites`, one-deep undo); `tools/maker/units.ts` L94 (`⋯` menu sheet); `tools/maker/ability-panel.ts` L40 (the open ability page), L82 (`a:reset:`).
4. Resolver: `src/project/load/read-project.ts` L19 (`has`), L23 (`refs`), L27 (`project.rules`), L35 (`stage.rules`), L36 (`neutrals[].setupIds`), L40 (`unit.setupIds`), L116 (the `refs` call).
5. Wiring: `tools/maker/home.ts` L11 (imports), L24 (`State.undo`), L39 (toast), L44 (project paint), L109 (before the unit block), L168 (`input`), L169 (`change`).
6. `planSave` (`src/editor/project/save.ts`) can't delete a file: a path missing from `next` renders as `""`. So a delete keeps the old text in the plan and removes the file after `commitWrites` (Rule 4).

## Rules
1. **Data (`src/editor/effect/list.ts`, new, pure).** `FX_KNOBS` = `hit_stop_ms, hit_white_ms, hit_white_mode, shake, shake_ms, squash, tint_ramp, connect` (the knobs fx-doc draws). `effectRows(bag)` (K-1 order, `used` = setups whose `effect` answer is that id). `newEffect` (`blankEffect` + `write` of one `stamp` step `s-1`, 0.25 s; name "Effect N", first free N). `editEffect` (only `FX_KNOBS`, through `write`; `undefined` resets). `renameEffect` (1–40 characters trimmed, rev + 1). `duplicateEffect` (per Read first 1; refuses an id that isn't `effect_<ULID>`). `deleteEffect(bag, id, toNone)` (doc to `trashOf(path)`; with `toNone` each user's answer becomes `{source: "user", value: "none"}`). No game rule; `src/editor` only.
2. **effectNotRule (`read-project.ts`).** A `rule(...)` helper next to `has`: an id that's an own key of `effects` pushes `effectNotRule` (warning, path = the pointer the call site would give `has`, e.g. `stages/<id>.json#/rules/<i>`; detail = the id); anything else goes to `has` as before. Use it at the four sites in Read first 4, and pass `effects` to `refs`. Nothing else changes. `playDocsOf` already skips ids that aren't setups, so the effect is ignored.
3. **Effects screen (`tools/maker/effects.ts`, new).** `effectsSection(files, readOnly)` (list, `⋯` and + New effect hidden when read-only), `effectsSheet(files, readOnly)` (the menu sheet, or the editor sheet: `panelOf(BUNDLED, { effect: FX_KNOBS }, "effect", answers)` with `knobWidget` and `e:reset:` buttons, the name field `data-fxname`, Duplicate and ▶ Test), `fxOpen()`, `effectsAct(act, host, io)` with acts `e:new`, `e:open:`, `e:menu:`, `e:close`, `e:dup:`, `e:delete:`, `e:none:`, `e:name:`, `e:set:`, `e:reset:`, `e:undo`, and `k:pick:` / `k:toggle:` while the sheet is open. Ids from `ulid(Date.parse(now), bytes())`.
4. **Save and undo.** Like `levels.ts`: `planSave` then `commitWrites`, keep the pre-action files as a one-deep undo, and `readTree` after. **Gone paths** (in the old files, not in the new) stay in the plan with their old text and are removed with `store.remove` after the commit. Undo restores the snapshot the same way, so the trash file goes and the live file comes back, and nothing is written as `""`. Read-only refuses with the existing "Open only" line.
5. **Effect row (`ability-panel.ts`).** On the open ability page, for `aimKind(behaviourId)` (basic attack, line shot) only: "Effect", then **None** and one button per `effectRows(bag)` row, `aria-pressed` on the current answer (`source: "default"` reads as none). `a:fx:<value>` writes `setAnswer(answers, "effect", value, "none")` and returns the usual "Changed · Undo", **only when `value` is `none` or an `effectRows(bag)` id**; any other value writes nothing (`{ keep: true }`). Built-ins aren't offered until 10d. `WIRED` is unchanged.
6. **Wiring (`home.ts`).** Import; `State.undo` gains `"effect"`; the toast sits above while `fxOpen()`; the project screen appends `effectsSection` after Levels and `effectsSheet` after the levels sheet; one block before the unit block routes `e:` acts, `k:` acts while `fxOpen()`, and Undo when `state.undo === "effect"` (same shape as the levels block); `data-knob` input goes to `e:set:` while `fxOpen()`; the name field saves on `change`, not `input` (keeps focus while typing).
7. **Layers.** Nothing in `src/core`, `src/sim`, `src/rules` or `tools/play-stage`. `tools/effect-designer` untouched. No new codes beyond the DSK ruling, no format-doc edits, no CSS, no new rAF, timer or loop.

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `src/project/load/read-project.ts` | `rule` helper (`brokenRef` pointer), four call sites, `effects` into `refs` (Rule 2) | 20 [8+ 6−] |
| `src/editor/effect/list.ts` | new, effect data (Rule 1) | 60 [42] |
| `tools/maker/effects.ts` | new, Effects section, sheets, acts, save and undo (Rules 3–4) | 90 [64] |
| `tools/maker/ability-panel.ts` | Effect row and the checked `a:fx:` (Rule 5) | 10 [5+ 1−] |
| `tools/maker/home.ts` | wiring (Rule 6) | 24 [12+ 5−] |
| `tests/editor/effects-10c.test.ts` | new, named tests 1–5 (one import per line) | 90 [62] |
| `handoff/steps/tests/s10c-effect-editor/smoke.mjs` | new smoke (port 8816) | 70 [49] |
| **Total** | caps sum to 364 | **400 hard gate [254]** |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules'`. Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Named tests (`tests/editor/effects-10c.test.ts`)
1. `10c effect data: New mints effect_<ULID> with one stamp step and a free name; the list sorts by name then id with its users; Duplicate copies answers under a fresh effect_ id (rev 1, one duplicate op, copiedFrom, ' copy' name) and references stay on the original`.
2. `10c edit: a knob goes through the ED-E5 writer (history op, rev + 1) and Test draws it; reset returns it to the default; a knob outside FX_KNOBS or a bad name changes nothing`.
3. `10c delete: the doc moves to effects/.deleted/ (the reader skips it, no row); its abilities then show unknownRef and run stock, or switch to none in the same action`.
4. `10c effectNotRule (DSK): an effect id (new or legacy setup_) in project.rules, stage.rules, unit.setupIds or neutrals[].setupIds is a warning at the pointer brokenRef would use and ignored, and Test still opens; an id that resolves to nothing stays brokenRef hard`.
5. `10c maker: the Effects section lists effects with use counts; New, a slider, Delete and Undo write through the store (trash file in, live file out, and back); the ability Effect row offers None and saved effects and sets the answer Test plays (an id not in the list writes nothing)` (`memoryStore`).

## Smoke (`handoff/steps/tests/s10c-effect-editor/smoke.mjs`, port 8816, r1)
Dev maker build, touch, at 390 and 360. Steps: 1 a new demo project shows an empty Effects list; 2 **+ New effect** mints `effect_<ULID>` and the shake slider writes `shake: 2` (`__read()`); 3 the archer's line shot Effect row picks it, and Test plays it (`__docs.fxOf["<archer>|line-shot"]` is the id, `__fx.values(id).values.shake` is 2); 4 the `⋯` menu Duplicates ("Effect 1 copy"), then "Delete and switch 1 to None" moves the file to `effects/.deleted/` with the answer set to none, and Undo brings both back. 8 ok.
Then run every smoke solo, unedited: S0 `touch-smoke.mjs` 8797 (14 ok), s3 `touch-smoke.mjs` 8798 (18), s4a 8799 (16), s4b 8800 (16), s4c 8801 (16), s5a 8802 (16), s5b 8803 (16), s5c 8804 (16), s6a 8805 (18), s6b 8806 (16), s6c 8807 (18), s6d 8808 (14), s7 8809 (20), s8 8810 r1 (16), s9 8811 r1 (12), s8c 8812 r1 (8), s9b 8813 r1 (14), s9c 8814 r1 (6), s10b 8815 r1 (8), **s10c 8816 r1 (8)**. All print SMOKE PASS. **Restore tracked files after each run** (`git checkout -- handback` and remove untracked shots). s6c rewrites the 6c checkpoint fixture, and s6d, s8c and s9c read it. If s3 step 9 misses (sheet text ''), re-run it solo once (known flake, carry).

## Must NOT
- No edits outside the Build table. Nothing in `src/core`, `src/sim`, `src/rules`, `tools/play-stage`, `tools/effect-designer`, data, fixtures, the format docs, behaviour-library, painter-proto or ui-shell. No edit to any other test or smoke.
- No built-ins in the Effect row; no steps, parts or picture editing; no re-id or migration of `setup_` effects; no `WIRED` change; no export or APK work; no gh-pages push or publish.

## Done when
- Green exits 0 at the floor (**1157** on the trial base). `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101; maker `home.ts` ×2, now at **L89** after the one added import line).
- All 20 smokes PASS with the counts above. `node /workspace/share/s8/s8-audit.mjs <worktree>` → AUDIT PASS.
- HANDBACK § Smoke records the mutations below.

## Measured (trial run, 2026-11-25, a fresh `/tmp` clone of main `0673be7e` + the 10b r2 trial patch, never committed or pushed)
- Base (10b r2 state): green exit 0, **1152 pass, 0 fail**.
- Trial: green exit 0, **1157 pass, 0 fail** (eslint, depcruise, check:state and check:law clean); tools tsc shows only the 3 base errors.
- Count: 7 files, **242+ 12− (254)**, per the table.
- Smokes: all 20 PASS (S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, **s10c 8**); AUDIT PASS (133 / 147 / 146). In the full r2 run s8c missed steps 1–3 at 390 once ("no hero"), then passed 3 of 3 solo re-runs unedited; if it misses, re-run it solo once.
- Mutations. Base file restored: `read-project.ts` → test 4; the pointer cut back to the doc path (`path.split("#")[0]`) → test 4; `ability-panel.ts` → test 5; the `a:fx:` `effectRows` check removed → test 5; and s10c steps 3–4 at both widths; `home.ts` → s10c steps 1–4 at both widths. In the new files: Duplicate without `copiedFrom` → test 1; list left unsorted → test 1; New without the seed step → tests 1–2; edit that skips the writer → tests 2 and 5; the `FX_KNOBS` guard removed → test 2; `toNone` ignored → test 3; gone files not removed → test 5; undo that doesn't remove the trash → test 5.
- Trial patch: `/workspace/share/s10c/s10c-trial.patch` (sha256 `98e4e124ba2663b2665986c7705977a5668d1cbc6c5865081a631520aeedf1fd`, 384 lines, 7 files, a diff over `0673be7e` + 10b r2; it excludes `handback/`). r1 → r2 code diff: `read-project.ts` (the pointer, and the `rule` doc comment), `ability-panel.ts` (the check, same line count), and test 4's expected paths plus one test 5 assert. Re-check it on the 10b merge when the Base is re-pinned.

## Baseline republish
- None needed: 10c changes only the maker, not the published baseline pages (audit counts unchanged). If CoS wants one anyway, publish only on the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there (the builder never publishes or pushes gh-pages). QA's post-publish walk runs **headless, at device scale 1** (360 and 390 wide). **Only the CEO's phones are real devices.**

## Carries
**Closed here:** roadmap row 10's editor half (Effects list, New, the play-drawn knobs, Duplicate minting `effect_`, delete into `.deleted/` with undo, the Effect row); DSK `effectNotRule`.
**Still open, not 10c scope:**
- **10d built-in library:** the catalogue's `effect.presets` (`btf-*`, `te-*`) override knobs (`blade`, `spawn`, `tint`, `glow`) that the play stage doesn't draw, so a playable library needs those presets as fx-doc values, a play-stage table and the Effect row's built-in buttons. 10b r2 already resolves a bare BTF id from the slice's `effect` presets (and the `builtin:effect/` alias) with no row; the project slice has no `effect` row yet, so 10d also adds it.
- `effects/.deleted/` purge after the undo window (§6.7 K-3); step 11's export must leave `.deleted/` out.
- Tags and search (K-1), the Effect row on other owners, "Make my own from Holy blade" (§2.10): with 10d or step 33.
- s3 flake (`touch-smoke.mjs` L119/L121); upload byte cap (DSK/UX).

## Questions for EA / DSK (all answered; recorded for QA)
1. **effectNotRule path:** DSK r42: the same pointer as `brokenRef` (Rule 2, test 4).
2. **Built-in answer spelling:** DSK r42: stored bare (`btf-holy-blade`), resolved from the slice's `effect` presets; `builtin:effect/<id>` is an accepted alias. Built in 10b r2.
3. **Basic knobs:** EA ruling: `FX_KNOBS` (the eight knobs the play stage draws) is the maker's basic set; steps, parts and pictures stay with the designer.
4. **Duplicate's op:** EA ruling (2026-11-25): `{seq: 1, at, kind: "set", changes: [], note: "duplicate"}`, `changes` stays empty.
