# Step 10b: effect data (the effects/ slot, its rows, and Test playing a saved effect)

r1, 2026-11-25, Engine Architect (CEO go 2026-11-25 12:57 London, via CoS: roadmap step 10 approved, split into 10b effect data and 10c effect editor, sequenced after the 10a carries). One builder run (ChatA) and one QA review, with gates on. Every number below comes from a trial run on `31f4c0c4` + the 10a trial patch (see Measured). In this guide, rulings from the CoS chat are labelled **EA ruling**, not CEO rulings.

Step id: `step-10b-effect-data`. Guide revision r1; the build is r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** **re-pinned to the 10a merge sha before the go-line.** 10a (`step-10a-carries.md` r2) isn't merged yet and its branch isn't on the remote, so the trial ran on main `31f4c0c4fb8d551464ae1aba41b8f4917141b42b` (`31f4c0c docs(maker): step 10a r2 guide + QA reviews`, holding project-format r41 `fddf499`) with `/workspace/share/s10/s10a-trial.patch` (sha256 `609769ef…`) applied: green **1146 pass, 0 fail**. 10b goes to ChatA only after 10a merges; CoS names the merge sha and its count in the go-line, and the builder uses that main.
**Authority:** DSK D22 / D22b / D29 in `handoff/dsk-rulings/2026-11-17-phase1.md` L69 (sha256 `90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8`, 77 lines). Format: `docs/maker/data/project-format.md` r41 on main (sha256 `7d89c4f41bf45cd6d24927a63896fcad4a098fba49ce313115e023da0a88b06e`; QA-reviewed as draft `edcc98f6`, `docs/qa/format-r41-review.md`): L296 (`effects/.deleted/`), L448 (`uploadTooLarge`), L1149–1152 (reader slot, ids, rules setups), §6.7 Deleting (dangling effect answer), L1680–1697 and L1744–1746 (codes, `notPlaced`, `advancedRenderInactive`).
**Test floor:** **10a's merged count + 4** (1146 + 4 = **1150** in the trial). N = 4 (named tests 1–4, one new file). The `uploadTooLarge` assert re-pins one existing test; the count doesn't change for it.
**Needs:** 10a (merged). **Blocks:** 10c (the editor writes the `effect` answer that 10b reads and plays).
**Smoke:** new **s10b**, port **8815**, `r1` (8 ok across 390 and 360). It is counted in the 400.

## Why one step, and what goes to 10c
- The roadmap rule splits a row into "data + rule" and "editor" (roadmap L70). 10b is the data + rule half: the reader learns `effects/`, the rows the format names, and Test plays a saved effect. 125 counted lines in the trial, so no further split.
- **The "rule" is presentation only.** `src/rules` uses `effectRef: "line-shot"` as the spell's identity (`battle.ts` L65, `bot-ability-priority` L28 and L95), so 10b doesn't change `effectRef`. It maps the cast cue's ref to the caster's saved effect in the play stage, by exact id. No game rule moves into `src/core`, `src/sim` or `src/rules`; the maker only authors data.
- **10c:** the Behaviour panel's Effect row (none, a built-in, or a saved effect, plus the basic knobs), the built-in picker, and **effect Duplicate** (D22: "a new or duplicated doc mints `effect_<ULID>`", L1150). Duplicate is an editor action and no Duplicate code exists, so it's 10c's; 10a already mints `effect_` for new docs.

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-10b-effect-data-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-10b-effect-data/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green (test counts), § Smoke (all 19 smokes and the mutations) and § Export audit. Label the **Code head** apart from the docs-only **tip**, and give both shas. Don't commit a raw test log or smoke shots.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words:
- **Saved effects load.** `readProject` reads `effects/<id>.json` into `project.effects`. A new effect is `effect_<ULID>`. A saved `setup_<ULID>` effect keeps working by its exact id, with an info row and no migration. Any other id shape loads with a warning; nothing is refused. Trash (`effects/.deleted/`) is skipped.
- **Test plays it.** When a unit's line-shot or basic-attack setup answers `effect` with a loaded effect id, Test draws that effect for that unit's cast. No answer, `none`, a built-in or a missing id draws the game's stock effect. A missing id is an `unknownRef` warning; it never blocks Test.
- **Two Law 12 carries from QA's r41 review:** an over-size upload gets its `uploadTooLarge` row, and the asset check stops swallowing a project it can't migrate.

**Not in 10b:** the Effect row, picker and knobs; effect Duplicate; a built-ins library (built-ins run stock until 10c); export or APK (step 11); format-doc edits (DSK's); `effectRef` changes in `src/rules`; the brokenRef-vs-warning question for effect ids named in rules (EA/DSK question 2).

## Read first (lines checked on the trial base, `31f4c0c4` + 10a)
1. Format r41: L1149 reader slot (D22b: `effects/` is a `behaviour-setup` slot, `.deleted/` skipped, L296); L1150 ids (`effect_<ULID>`; `setup_<ULID>` → `legacyEffectId` info, path; other shapes → `badEffectId` warning, path; never refused); L1152 (effect setups named in rules: warning, ignored); §6.7 Deleting (a dangling effect answer gets a derived `unknownRef` and runs as `none`); L448 `uploadTooLarge {fileName, w, h, max: 4096}` ("merged 9b shows a plain message").
2. `src/project/load/types.ts` L12–17 (`ProjectStore`), L23 (`SLOTS`), L28 (`knownKind` regex); `src/project/load/read-project.ts` L49 (`warns`), L62 (the basic-attack damage line), L77 (the `advancedRenderInactive` fit row, already there), L92 (doc and slot), L107 (unit branch), L114 (`warns` call), L117 (the store).
3. Play: `tools/play-stage/project.ts` L60 (`abilities`), L66 (basic-attack), L67 (line-shot), L80 (return); `tools/play-stage/fx.ts` L32–36 (`houseCue`: a basic attack with no effects casts `HOUSE_ATTACK`), L39 (`createPlayFx`), L47 (the cast loop); `tools/play-stage/load.ts` (`PlayDocs`); `tools/play-stage/board.ts` L95 (`createPlayFx(body.effects)`).
4. Uploads and assets: `tools/maker/art.ts` L12 (`ArtRow`), L31 (`addPicture`), L34 (the plain "too big" line); `tests/editor/art-upload.test.ts` test 3 (`wide.row` undefined); `tools/maker/asset-check.ts` L15 (`catch { docs = files; }`).
5. Already done, no code: `notPlaced` is emitted at `src/project/read/placements.ts` L15 and L25 and 8b keeps members (`autosave-links.test.ts` L122, `placements.test.ts` L24); r41 L1693 now documents it. `advancedRenderInactive` for `fit` (QA drift (b)) is emitted at read-project L77 and tested (`art-backgrounds.test.ts` L103). D29 `assetFileMissing` / `assetHashMismatch` already match r41 (path + `detail` = assetId).

## Rules
1. **Slot (types.ts).** `ProjectStore` gains `readonly effects: Readonly<Record<string, BehaviourSetup>>`; `SLOTS` gains `effects: "behaviour-setup"`; `knownKind` accepts `effects/`. Version gating follows `SLOTS` like every other slot (see question 3).
2. **Reader (read-project.ts).** In the doc loop: skip `effects/.deleted/` with no row. An `effects/` doc whose `behaviourId` isn't `"effect"` is `unknownFile` (warning, detail `behaviourId`) and isn't loaded. Otherwise: `setup_<ULID>` → `legacyEffectId` (info, path); not `effect_<ULID>` and not legacy (or no id) → `badEffectId` (warning, path); every doc with an id loads into `effects` under its exact id. No re-id, no migration, nothing written back (D22).
3. **Dangling answer.** In the setups loop of `warns`, a string `answers.effect.value` that isn't `none`, doesn't start with `builtin:` and names no loaded effect gives `unknownRef` (warning, path `<setup path>#/answers/effect/value`, detail the id). The play path runs it as stock.
4. **Play map (project.ts, load.ts).** `playDocsOf` builds `fxOf`, keyed `<unitId>|<stock ref>`: a basic-attack setup maps `HOUSE_ATTACK`, a line-shot setup maps `"line-shot"`, and only when the answer is a loaded effect id (`Object.hasOwn(store.effects, v)`). It returns `effects: Object.values(store.effects)` and `fxOf` (only when non-empty). `PlayDocs` gains `readonly fxOf?: Readonly<Record<string, string>>`. `effectRef` stays `"line-shot"`.
5. **Play swap (fx.ts, board.ts).** `createPlayFx(docs?, pick?)`: the ingest loop casts `{ ...cue, ref: pick(cue.caster, cue.ref) ?? cue.ref }` when `pick` is given. `board.ts` passes a `pick` that maps the cue's world unit to its `unitId` and reads `body.fxOf`. The saved docs go through `readEffect` as before; nothing new is decoded.
6. **uploadTooLarge (art.ts).** `ArtRow.code` becomes `"uploadTypeUnsupported" | "uploadTooLarge"`. The L34 over-size result gains `row: { code: "uploadTooLarge", severity: "hard", path: fileName, detail: JSON.stringify({ w, h, max: MAX_SIDE }) }`, from the header only (10a reads 64 KiB). The line text stays. Re-pin art-upload test 3 to that row.
7. **Asset check (asset-check.ts, Law 12).** When `migrateProject` throws, return `[{ code: "invalidValue", severity: "hard", path: "project.json", detail: "unreadable" }]` in place of checking the raw files. One line.
8. **Layers.** Nothing in `src/core`, `src/sim` or `src/rules`. `tools/play-stage` never imports `tools/maker` or `src/editor`. No new codes beyond r41's, no format-doc edits, no new rAF, timer or loop.

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `src/project/load/types.ts` | store field, `SLOTS`, `knownKind` (Rule 1) | 6 [3+ 3−] |
| `src/project/load/read-project.ts` | slot branch, `.deleted/`, `unknownRef` answer row, store (Rules 2–3) | 16 [7+ 4−] |
| `tools/play-stage/project.ts` | `pickFx`, `fxOf`, effects in the return (Rule 4) | 12 [6+ 2−] |
| `tools/play-stage/load.ts` | `fxOf` on `PlayDocs` (Rule 4) | 2 [1+ 1−] |
| `tools/play-stage/fx.ts` | `pick` parameter and the swap (Rule 5) | 6 [3+ 2−] |
| `tools/play-stage/board.ts` | pass `pick` (Rule 5) | 2 [1+ 1−] |
| `tools/maker/art.ts` | `uploadTooLarge` row, `MAX_SIDE` import (Rule 6) | 6 [3+ 3−] |
| `tests/editor/art-upload.test.ts` | test 3 re-pinned (Rule 6) | 2 [1+ 1−] |
| `tools/maker/asset-check.ts` | the hard row on a failed migration (Rule 7) | 2 [1+ 1−] |
| `tests/project/effects-slot.test.ts` | new, named tests 1–4 (one import per line) | 60 [39] |
| `handoff/steps/tests/s10b-effect-data/smoke.mjs` | new smoke (port 8815) | 70 [42] |
| **Total** | caps sum to 184 | **400 hard gate [125]** |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules'`. Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Named tests (`tests/project/effects-slot.test.ts`)
1. `10b D22b effects/ slot: effect docs load into project.effects; setup_<ULID> is legacyEffectId (info) and still loads; another id shape is badEffectId (warning) and still loads; a non-effect doc is unknownFile (behaviourId), not loaded; .deleted/ is skipped with no row`.
2. `10b effect refs: an ability's effect answer naming no loaded effect is unknownRef (warning, runs as the stock drawing); none, a builtin and a loaded id (new or legacy) give no row`.
3. `10b play path: Test plays the caster's saved effect by exact id (a legacy setup_ id too) for its line-shot and its basic attack; with no answer the stock drawing plays (150 ms saved vs 484 ms stock)`: on the bundled demo, the archer (`unit_01JDAN00000000000000000002`) with `setup_…05` (line-shot) and `setup_…04` (basic-attack) answering a saved effect; `fxOf` names it, and at 200 ms the saved draw has ended while the stock draw is still live.
4. `10b asset check (Law 12): when the project can't be migrated, assetRows says so with one hard row instead of checking the raw files`.

## Smoke (`handoff/steps/tests/s10b-effect-data/smoke.mjs`, port 8815, r1)
Dev maker build, at 390 and 360. Steps: 1 new project; 2 saved effects load and the archer's shot plays its own (write an `effect_` doc, a legacy `setup_` doc, a `.deleted/` doc and a non-effect file into `effects/`, set the archer's answer, open Test, check `__docs.effects` ids, `fxOf` and `__fx.values`); 3 a legacy `setup_` effect plays by exact id; 4 a missing effect is a warning and Test still opens with the stock drawing. 8 ok.
Then run every smoke solo, unedited: S0 `touch-smoke.mjs` 8797 (14 ok), s3 `touch-smoke.mjs` 8798 (18), s4a 8799 (16), s4b 8800 (16), s4c 8801 (16), s5a 8802 (16), s5b 8803 (16), s5c 8804 (16), s6a 8805 (18), s6b 8806 (16), s6c 8807 (18), s6d 8808 (14), s7 8809 (20), s8 8810 r1 (16), s9 8811 r1 (12), s8c 8812 r1 (8), s9b 8813 r1 (14), s9c 8814 r1 (6), **s10b 8815 r1 (8)**. All print SMOKE PASS. **Restore tracked files after each run** (`git checkout -- handback` and remove untracked shots). s6c rewrites the 6c checkpoint fixture, and s6d, s8c and s9c read it. If s3 step 9 misses (sheet text ''), re-run it solo once (known flake, carry).

## Must NOT
- No edits outside the Build table. Nothing in `src/core`, `src/sim`, `src/rules`, data, fixtures, the format docs, behaviour-library, painter-proto or ui-shell. No edit to any other test or smoke.
- No re-id, migration or write-back of `setup_` effects; no `effectRef` change; no Effect row, picker or Duplicate (10c); no export or APK work; no gh-pages push or publish.

## Done when
- Green exits 0 at the floor (**1150** on the trial base). `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101, maker `home.ts` ×2 at L88).
- All 19 smokes PASS with the counts above. `node /workspace/share/s8/s8-audit.mjs <worktree>` → AUDIT PASS.
- HANDBACK § Smoke records the mutations below (base file restored → what fails).

## Measured (trial run, 2026-11-25, a `/tmp` clone at `31f4c0c4` + 10a trial patch, never committed or pushed)
- Base (10a state): green exit 0, **1146 pass, 0 fail**.
- Trial: green exit 0, **1150 pass, 0 fail** (eslint, depcruise, check:state and check:law clean); tools tsc shows only the 3 base errors.
- Count: 11 files, **107+ 18− (125)**, per the table.
- Smokes: all 19 PASS (S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, **s10b 8**); AUDIT PASS (133 / 147 / 146).
- Mutations (restore the base file): `read-project.ts` → tests 1–3 fail and s10b steps 2–4 fail at both widths; `types.ts` → tests 1–3; `project.ts` → test 3 (dropping only the basic-attack map fails it too); `fx.ts` → test 3; `asset-check.ts` → test 4; `art.ts` → art-upload test 3.
- Trial patch: `/workspace/share/s10b/s10b-trial.patch` (sha256 `4f7b6b87ab687368fe6e3b6f42231c01bcbbb9b80263dd92c20d182e44d1cb2e`, 313 lines, 11 files, a diff over 10a; it excludes `handback/`). On a fresh `31f4c0c4` + `s10a-trial.patch` worktree it applies cleanly, green gives 1150/0 and s10b passes. Re-check it on the 10a merge when the Base is re-pinned.

## Baseline republish
- None needed: the baseline projects have no `effects/` docs, so 10b doesn't change the published pages. If CoS wants one anyway (or the open baseline-08b rebuild rides along), publish only on the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there (the builder never publishes or pushes gh-pages). QA's post-publish walk runs **headless, at device scale 1** (360 and 390 wide). **Only the CEO's phones are real devices.**

## Carries
**Closed here:** D22b read side (slot, `legacyEffectId`, `badEffectId`, `.deleted/`); the dangling-answer `unknownRef`; a saved effect playing in Test; `uploadTooLarge` (QA r41 drift (a)); `asset-check.ts` silent fallback (drift (c), Law 12). Closed by r41 with no code: `notPlaced` (the 8b widening); `advancedRenderInactive` fit (drift (b), already emitted and tested); D29 asset codes.
**Still open, not 10b scope:**
- 10c: the Effect row, built-ins picker and library, effect Duplicate minting `effect_`.
- Upload byte cap (QA 10a carry): a PNG whose header fits still reads whole. DSK/UX.
- s3 flake: `touch-smoke.mjs` L119 `waitForTimeout(80)` and L121; fix later with a `waitForFunction`.
- From 9b/9c and 10a: the "Stairs to <stage name>" info row; markers in the maker; Cover/Stretch, 8192 toggle, export shipping assets (step 11); baseline-08b republish.

## Questions for EA / DSK (none block the build)
1. **Detail encodings.** `ReportRow.detail` is a string. `uploadTooLarge` puts `fileName` in `path` and `{w, h, max}` as JSON in `detail`; `advancedRenderInactive` puts `field` in `detail` and the path in `path`. DSK: confirm, or name the encoding.
2. **Effect ids in rules.** An effect id named in `project.rules`, `stage.rules` or `unit.setupIds` gives today's `brokenRef` (hard); r41 L1152 says warning and ignored. Needs a code or a ruling; carry to 10c or a later step.
3. **Version gate.** `effects/` docs go through the `behaviour-setup` version gate, so an unknown `formatVersion` is a read-only refusal, while setup-format §2.10 says effects are "never refused" (meant for ids). DSK: confirm the gate applies.
4. **Built-ins** (`builtin:effect/<id>`) run stock until 10c ships a library; no row in 10b. EA: confirm.
