# Rebuild record: step 10b, effect data (the effects/ slot and Test plays a saved effect)

Original brief: [`docs/maker/steps/step-10b-effect-data.md`](../maker/steps/step-10b-effect-data.md) on the merge (r2, blob `9f6c8728`, sha256 `8a5ecad2c7bae1848e0465afd73e80f164a649f716c33cffbd27df4705eb771a`, 112 lines). Delivery L18; Why one step L13; Goal L25; Read first L33; Rules L40; Build L50; Named tests L68; Smoke L76; Must NOT L80; Done when L84; Measured L89; Baseline republish L97; Carries L100. Count command L66; hard per-file caps L53–63; hard gate 400 at L64 (caps sum 184; trial 140). This is **10b**, roadmap step 10's data half, after 10a (carries before the engine effect path, merged as `c3e056ff`). It is not the Effect row editor (that is 10c). It teaches the reader `effects/`, the rows the format names, and Test playing a saved effect: the `effects/` slot and `knownKind`, `.deleted/` skip, `legacyEffectId` / `badEffectId` / `unknownFile`, effect-answer resolution (none, a loaded id, a bare BTF preset or its `builtin:effect/` alias, else `unknownRef`), `playDocsOf` `fxOf` and `effects`, `createPlayFx`'s `pick`, the `uploadTooLarge` hard row, and a failed `migrateProject` returning one `invalidValue` hard row. The branch still had the base r1 step file (sha256 `b38b56cc`, 110 lines); the merge keeps main's r2 guide (not in the Build table). Current main adds only the 10b r1 QA review. Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #104 and branch `step/step-10b-effect-data-r1-chatA` (r1 tip `7435eb15`, r1 code head `66aabd54`); `handback/step-10b-effect-data/r1/HANDBACK.md` at `7435eb15` and on the merge (HB, blob `2206c57b`, 109 lines, sha256 `21b4bc23e1ce3fe5a7c5b3ce79dd4ce6c2a134311a629e30487aebda6a58043e`); CoS verify report `/workspace/share/step-10b-r1-verify/report.md` (V, 43 lines, sha256 `36e80d5e1ed3aa936c1d3da5e92a6d8537f043ad0a43abe2dd52891f0a1cc224`, hash-object `a3f11ef72cf50153a6cdc6b842e7aa867d04d63a`). `docs/qa/step-10b-r1-review.md` on main `d16d6f5d` (QA, blob `7dee7a2c`, 15 lines, sha256 `aa0bf00be53c3ab13441c3c55eee04928a3ec212729c1cb4f5a6cd51db958532`): **OK TO MERGE**, no must-fix, no rework round; two nits carried into 10c. QA postmerge on `10ab12d6` **PASSED** (tree `ea5d968b`, parent 2 `7435eb15`, 1152/0, pins 5/5, smoke 0 fail). Line cites use HB, V and QA. Product line cites are at merge `10ab12d6` (tree `ea5d968b`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `0673be7eb7e7ea6cfb8a59a10ff620ed19397abe`, 2026-11-25 13:56 (UK time), tree `be16680c`. Floor **1152** tests (guide L9: 1146 + N=6). After this merge the floor is **1152**. The guide was trialled on `0673be7e` (plus the 10b r2 trial patch). The go-line named this same main. Later main `12b31b1f` added the 10b r2 / 10c r2 guides and pastes and the 10a rebuild record, docs-only. The product count against `12b31b1f` is the same 154 as against the go-line base |
| Main at merge | `12b31b1fbd73d45a71cbf0022d20a1b95401fa47`, 2026-11-25 14:23 (UK time), tree `b6fd2d77`, the 10a rebuild record + README row 26 + QA rebuild review, then the 10b r2 / 10c r2 guides and pastes + QA reviews, docs-only on `0673be7e`. This is the merge's first parent. Official 10b product against this parent is the same 154 as against the go-line base |
| r1 commits | on `step/step-10b-effect-data-r1-chatA`: `66aabd543387fa81123d2125f7ac13ce5f680a64` Step 10b: effect data (effects/ slot and Test plays a saved effect) (code head, tree `f209da261240e311b7265575b130f862707d0de6`, 2026-11-25 20:04 UK time), `7435eb159eec35d2fe27a377a4bcc63b1b1f5f93` docs(handback): step 10b effect data r1 (tree `568a1e84c8b3d74b743383a2302215c27bb7ca68`, 2026-11-25 20:06 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the r1 hand-back folder only: `HANDBACK.md` (109 lines). Smoke shots were produced and not committed; the tip folder holds `HANDBACK.md` only (HB, V, QA) |
| r1 verdict | Product green was 1152/0/0/0 and the official count was 154, with every cap kept (HB:21–32, V, QA). CoS verify of r1 was PASS (V). QA **OK TO MERGE**, no must-fix (QA). Predicted merge tree onto then-main `12b31b1f` was `ea5d968b` (V, QA; QA reproduced it with `git merge-tree`). That tree **differs from the tip tree** `568a1e84`, because main had moved by the 10a rebuild record and the 10b r2 / 10c r2 docs. PR #104 "Step 10b: effect data (r1, ChatA)" was opened from the branch after the hand-back (the HANDBACK PR line was already written as if it existed; QA, V, HB:3) |
| Merge | PR #104, merge commit `10ab12d629af2604e7ed828d134eff8aafd9caf7`, 2026-11-25 20:59 (UK time). Tree `ea5d968b9cfffe6dec3cadc59474accae50529a0` (the same tree CoS and QA predicted against main `12b31b1f`; V, QA). First parent `12b31b1fbd73d45a71cbf0022d20a1b95401fa47`, second parent `7435eb15`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. `npm test` on the merge was **1152 pass / 0 fail**. A full `npm run green` on the merge was also **1152/0** (typecheck, lint, depcruise, check:state, check:law clean) |
| After the merge | main is `d16d6f5d8a91bdfcf3dc9bc9192670fd2b51b266`, 2026-11-25 21:00 (UK time), tree `0e48853327ea8e68a61382273665ff259ebe9520`, which adds only `docs/qa/step-10b-r1-review.md` (15 insertions, sha256 `aa0bf00b`, hash-object `7dee7a2c`). QA postmerge on `10ab12d6` **PASSED** (tree `ea5d968b`, parent 2 `7435eb15`, 1152/0, pins 5/5, smoke 0 fail) |
| Tests | 1146 + N=6 (named tests 1–6 in `tests/project/effects-slot.test.ts`) = **1152 pass / 0 fail**. The `uploadTooLarge` re-pin does not change the count. Floor after this merge is **1152** (HB:25–32, V, QA) |

## (b) Files

From `git diff --name-status 0673be7e..66aabd54 -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the r1 code head (the accepted 10b measure). The same product files are on the merge tree `ea5d968b`. The r1 review doc landed on main `d16d6f5d` after the merge and is **not** in the official 400. The new s10b smoke is counted in the 400 (guide L11, L63).

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/project/load/types.ts` | M | 3 / 3 | 6 (L53) | yes. **6** (sha256 `5461bfef2b46e95e53336ad9a932384b73cd11bd6695fba3c0f0567cfda32ce6`) |
| `src/project/load/read-project.ts` | M | 8 / 6 | 16 (L54) | yes. **14** (sha256 `056c304132b4d8c38fd820531c70185c4e8464859273dedbb1ecd336b0c88d97`) |
| `tools/play-stage/project.ts` | M | 7 / 2 | 12 (L55) | yes. **9** (sha256 `9ca3d991aaaf0ca761f5e91e3c40e8f1ae779eb42601e341750890304b7aa3dd`) |
| `tools/play-stage/load.ts` | M | 1 / 1 | 2 (L56) | yes. **2** (sha256 `d4448c34aab31ecea07ed2b98986f5e175fbc6d73fdf5b9eb675fb26ac2a1397`) |
| `tools/play-stage/fx.ts` | M | 2 / 2 | 6 (L57) | yes. **4** (sha256 `af1d914da0b9e7b3e2373999e99f7549fab76545d6d888a05e5ebe86579dc537`) |
| `tools/play-stage/board.ts` | M | 1 / 1 | 2 (L58) | yes. **2** (sha256 `82cecb482abe0b65250e2f85cf93a123628cac06c29623d7915edf1a9118312e`) |
| `tools/maker/art.ts` | M | 3 / 3 | 6 (L59) | yes. **6** (sha256 `727f595a70ecc73c625cd961701bea6186dfa84051514acf90a17059a5c35ada`) |
| `tests/editor/art-upload.test.ts` | M | 1 / 1 | 2 (L60) | yes. **2** (sha256 `926723185910627ea01b0859ab9633e9119eb3b18fd857d5087abe1ac5c16238`) |
| `tools/maker/asset-check.ts` | M | 1 / 1 | 2 (L61) | yes. **2** (sha256 `3806bd71232f1406da2c00072d3220425f38ac7d5cce553ccfd4aaeae476e51a`) |
| `tests/project/effects-slot.test.ts` | A | 60 / 0 | 60 (L62) | yes. **60** (sha256 `f669526fd7ad23d769e2772e2561d7458d7f944a46e5f56df5de3e96a252969b`) |
| `handoff/steps/tests/s10b-effect-data/smoke.mjs` | A | 47 / 0 | 70 (L63) | yes. **47** (sha256 `9e20a4158a915183ee56843ce2a3011ca1417f7ea96513b7dfe00074b3a0da0f`) |

No diff under `src/core/`, `src/sim/`, `src/rules/`, `data/`, fixtures, the format docs, `behaviour-library/`, `tools/painter-proto/` or `ui-shell/`. The play stage still has no `tools/maker` or `src/editor` import. The only smoke path in the diff is the new s10b smoke; the only other test edit is the allowed `art-upload.test.ts` re-pin. Official G7 at the r1 code head or r1 tip against `0673be7e`, and at the merge against first parent `12b31b1f`, is **11 files changed, 134 insertions(+), 20 deletions(-)** = 154 ≤ 400. Every per-file cap is kept (several sit on their cap: `types.ts`, `load.ts`, `board.ts`, `art.ts`, `art-upload.test.ts`, `asset-check.ts`, `effects-slot.test.ts`). Caps sum 184 (guide L64) is not a second gate. The trial on `0673be7e` was 11 files, 140 counted lines. Shipped 154 is 14 above that trial (the new test is 60 vs the trial 52, the smoke is 47 vs 42: r2 built-in tests and the `drop` helper). No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base. No gh-pages. No new rAF, timer or loop.

## (c) Key code and git commands

Step 10b is the data + rule half of roadmap step 10 (guide L3, L13–16, Rules 1–7). It does not add the Effect row, picker, knobs, or Duplicate (those are 10c), and it does not add a built-ins library (10d). No format-doc edits, no `effectRef` change, no re-id or write-back of `setup_` effects, no export or APK work, no gh-pages. Nothing in `src/core`, `src/sim` or `src/rules`. The play stage still never imports `tools/maker` or `src/editor`. No new rAF, timer or loop. Only the Build-table files change.

**Slot and kinds (Rule 1).** `ProjectStore` gains `effects: Readonly<Record<string, BehaviourSetup>>` (`src/project/load/types.ts:15`). `SLOTS` maps `effects` to `"behaviour-setup"` (`:23`). `knownKind` accepts `effects/<name>.json` (`:28`).

**Reader (Rules 2–3).** In the load loop (`src/project/load/read-project.ts:95,110`), `effects/.deleted/` is skipped with no row (folded into the unknown-slot branch). A non-effect doc in `effects/` is `unknownFile` (`behaviourId`) and is not loaded. `setup_<ULID>` is `legacyEffectId` (info) and still loads; any other id shape is `badEffectId` (warning) and still loads; a well-formed `effect_<ULID>` loads with no id row. All load by exact id. No re-id, migration or write-back. An effect answer (`:64`) resolves `none`, then a loaded effect id (`Object.hasOwn(effects, fx)`), then a bare BTF id from the slice's effect presets (`:53`); `builtin:effect/<id>` is stripped only for that preset lookup (the stored answer is not rewritten). Anything else is `unknownRef` (warning) at `<setup path>#/answers/effect/value`, detail the id as stored. It never blocks Test.

**Play map (Rule 4).** `pickFx` (`tools/play-stage/project.ts:52–53`) writes `fxOf["<unitId>|<stock ref>"]` when the unit's basic-attack or line-shot setup answers a loaded effect id (`Object.hasOwn(store.effects, v)`); basic-attack maps `HOUSE_ATTACK`, line-shot maps `"line-shot"`. `playDocsOf` always returns `effects: Object.values(store.effects)` and includes `fxOf` only when it has keys (`:85`). `PlayDocs` gains `readonly effects?: …` and `readonly fxOf?: Readonly<Record<string, string>>` (`tools/play-stage/load.ts:23`). `effectRef` stays `"line-shot"` (`project.ts:71`).

**Swap (Rule 5).** `createPlayFx(docs?, pick?)` (`tools/play-stage/fx.ts:39,47`) swaps a cue's stock ref for `pick(caster, ref)` when that returns an id. `board.ts:95` passes a pick that reads `body.fxOf` by the cue's `unitId`, and returns undefined when the unit or `fxOf` is missing.

**uploadTooLarge (Rule 6).** `ArtRow.code` is `"uploadTypeUnsupported" | "uploadTooLarge"` (`tools/maker/art.ts:12`). The L34 over-size result is `{ code: "uploadTooLarge", severity: "hard", path: fileName, detail: JSON.stringify({ w, h, max: MAX_SIDE }) }`, from the header only (10a still reads 64 KiB). The line text stays. Art-upload test 3 is re-pinned to that row (`tests/editor/art-upload.test.ts:62`).

**Failed migrate (Rule 7).** `assetRows` (`tools/maker/asset-check.ts:15`) catches a failed `migrateProject` and returns one hard `invalidValue` row (`project.json`, `"unreadable"`) instead of checking the raw files. The `let docs = files` initialiser is dead (the catch returns); QA carried that nit into 10c (QA).

The six new named tests, in `tests/project/effects-slot.test.ts`, one import per line, at `:23`, `:31`, `:38`, `:45`, `:49` and `:55` (guide L68–74, V, QA):

```ts
test("10b D22b effects/ slot: effect docs load into project.effects; setup_<ULID> is legacyEffectId (info) and still loads; another id shape is badEffectId (warning) and still loads; a non-effect doc is unknownFile (behaviourId), not loaded; .deleted/ is skipped with no row", () => {
test("10b effect refs: an ability's effect answer naming no loaded effect is unknownRef (warning, runs as the stock drawing); none and a loaded id (new or legacy) give no row (built-ins: tests 5 and 6)", () => {
test("10b play path: Test plays the caster's saved effect by exact id (a legacy setup_ id too) for its line-shot and its basic attack; with no answer the stock drawing plays (150 ms saved vs 484 ms stock)", () => {
test("10b asset check (Law 12): when the project can't be migrated, assetRows says so with one hard row instead of checking the raw files", async () => {
test("10b r2 built-in answers: a bare BTF id matched against the slice's effect presets gives no row and runs stock; with no such preset in the slice it is unknownRef", () => {
test("10b r2 alias: builtin:effect/<id> reads as the bare id (no row) and is never rewritten; an alias naming no preset is unknownRef", () => {
```

Mutations, each file restored to the product base, then put back (guide L94, HB:58–74, V, QA): `types.ts` → tests 1–3 fail (pass 3 / fail 3); `read-project.ts` → tests 1–3, 5 and 6 fail (pass 1 / fail 5), and s10b step 1 ok at both widths, steps 2–4 fail at both widths (`SMOKE FAIL`); only the built-in check removed (`!builtins.has(bare)` so the warning always pushes) → tests 5 and 6 fail (QA reproduced this tighter pin); `project.ts` → test 3 only (dropping only the basic-attack map fails it too); `fx.ts` → test 3 only; `asset-check.ts` → test 4 only; `art.ts` → art-upload test 3 fails (pass 5 / fail 1).

s10b (`handoff/steps/tests/s10b-effect-data/smoke.mjs`, sha256 `9e20a4158a915183ee56843ce2a3011ca1417f7ea96513b7dfe00074b3a0da0f`, 47 lines, port 8815 r1) is `smoke.mjs . 8815 r1`: 8 ok lines and `SMOKE PASS` at 390 and 360 (4 ok at each width: 1 new, 2 saved, 3 legacy, 4 missing) (HB:57, V, QA). It uses `waitForFunction` only (QA). **`drop()`** (`:25`) deletes `window.__play`, `__docs` and `__fx` before steps 3 and 4, because Back to maker does not reload the page. ChatA's first run of this smoke failed steps 3 and 4 on a stale match (the helper was missing / undefined at that point). A review helper caught it as a must-fix; `drop()` was added and s10b was re-run (8 ok, `SMOKE PASS`) before the push (HB:57, HB:93–100). CoS verify and QA ran the shipped smoke, which already has `drop()`, and both got 8 ok first time (V, QA). No other smoke is edited. All 19 smokes were rerun solo at the guide counts and passed: S0 14, s3 18 (first run, no flake), s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8 (V, QA). Shots go to `handback/` and must not be committed. If s3 step 9 misses (sheet text ''), re-run it solo once; do not edit s3 in 10b (guide L78).

Export audit on the clean code head: `s8-audit.mjs` reports play-stage release **133**, baseline **147**, maker play tree **146** (the known loose `play-stage` filter), `AUDIT PASS` (V, QA, HB:76–83). HANDBACK also states the tight maker `play-stage/` count 133, and that `window.__play` is absent from the release trees. No audit script was committed. No new built file.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base, at `tools/effect-designer/page.ts:101` and `tools/maker/home.ts:88` twice. No new error (HB, V, QA). Leave them. Root `tsc --noEmit -p tsconfig.json` exits 0.

The official count command (guide L66, on a committed tree the `git add -N` is unnecessary):

```
# Product gate. The first parent of the merge is 12b31b1f
# (docs-only on the go-line base 0673be7e). Official command at
# the r1 code head or r1 tip against 0673be7e, or at the merge
# against first parent 12b31b1f:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   11 files changed, 134 insertions(+), 20 deletions(-)
#
# At 66aabd54 against 0673be7e: 11 files, 134 insertions, 20 deletions = 154.
# The same 154 at 10ab12d6 against 12b31b1f. At d16d6f5d (current
# main, which also adds the r1 review) against 12b31b1f, the official
# command without ':!docs/**' is 12 files, 149 insertions, 20
# deletions. Adding ':!docs/**' again gives 154.
#
# Trial on 0673be7e was 11 files, 140 counted lines.
#
# Named tests (npm test 1152/0, floor 1146 + N=6):
#   ✔ 10b D22b effects/ slot: …
#   ✔ 10b effect refs: …
#   ✔ 10b play path: …
#   ✔ 10b asset check (Law 12): …
#   ✔ 10b r2 built-in answers: …
#   ✔ 10b r2 alias: …
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
#   s10b (8815 r1) 8 ok (4 @390, 4 @360), SMOKE PASS
#
# read-project.ts mutation (base file restored): s10b step 1 ok at
# both widths; steps 2–4 fail at both widths; SMOKE FAIL; file restored.
#
# Export audit as above; s8-audit.mjs 133 / 147 / 146, empty hit list, AUDIT PASS.
```

## (d) What went wrong, in order, and the fix

**r1.** The slot, the answer rule, the play map, the swap, the `uploadTooLarge` row, the failed-migrate hard row, the six named tests and the new s10b smoke shipped in one feat commit and green was 1152/0. The official gate was 154, with every per-file cap kept. All 19 smokes passed at the guide counts, including s10b 8 ok at 390 and 360, after a first-run failure was fixed (below). The export audit was clean. The tip holds only `HANDBACK.md`. CoS verify of r1 was PASS (V). The predicted merge tree against then-main `12b31b1f` was `ea5d968b`, which differs from the tip tree because of the 10a rebuild record and the 10b r2 / 10c r2 docs.

**First-run s10b failure, fixed before the push.** ChatA's first run of the new smoke failed steps 3 and 4 on a stale match: Back to maker leaves `window.__docs`, `__play` and `__fx`, so those steps still read the previous Test. A review helper (HB:93) flagged the missing `drop` helper as a must-fix. `drop()` was added (`smoke.mjs:25`) and called before the later Tests; s10b was re-run (8 ok, `SMOKE PASS`) and that is the shipped file (HB:57, HB:93–100). CoS and QA verified the shipped smoke, not the broken first run.

No must-fix left for QA. QA's tighter mutation (changing `!builtins.has(bare)` to always push) fails effects-slot tests 5 and 6 only (QA). CoS reproduced the full-file `read-project.ts` and `art.ts` restorations (V).

QA **OK TO MERGE**, no must-fix, no rework round (QA). Two nits, carried into 10c: the dead `let docs = files` initialiser in `asset-check.ts:15` (the catch returns, so it is not a silent fallback), and the HANDBACK PR line. QA postmerge on `10ab12d6` **PASSED** (tree `ea5d968b`, parent 2 `7435eb15`, 1152/0, pins 5/5, smoke 0 fail).

HB:3 said `PR: opened by Chief Of Staff from the branch.`, which was not yet true at hand-back or at CoS verify (V, QA, HB:3). PR #104 was opened later, then merged.

## (e) Do it right first time

- The work is only in the 11 Build-table files. Do not edit `src/core`, `src/sim`, `src/rules`, data, fixtures, the format docs, behaviour-library, painter-proto or ui-shell. The play stage still never imports `tools/maker` or `src/editor`. Do not edit any other test or smoke. Leave every smoke except the new s10b unedited. The only new test is `tests/project/effects-slot.test.ts`.
- Data + rule only. No Effect row, picker or Duplicate (10c). No built-ins library (10d). No re-id, migration or write-back of `setup_` effects, no `effectRef` change, no export or APK, no new rAF, timer or loop. An effect answer resolves none, then a loaded effect id, then a bare BTF preset or its `builtin:effect/` alias; anything else is `unknownRef` and still opens Test. `playDocsOf` returns `effects` and `fxOf`; `createPlayFx` takes `pick`; `board.ts` passes that pick. The over-size upload row is `uploadTooLarge` with `{w,h,max}`. A failed `migrateProject` returns one hard `invalidValue` row and does not inspect raw files.
- Do not add the Effect row or a baseline republish in this step. The builder never publishes gh-pages. The baseline projects have no `effects/` docs, so 10b does not change the published pages. Any republish needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there.
- Measure with the count command (guide L66): `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'`. Count insertions plus deletions. **154** is the accepted number for this step (the trial was 140). The new s10b smoke is inside that count (cap 70). On a merge whose first parent is `12b31b1f`, measure against that parent (or at the code head against `0673be7e`), and do not treat later QA docs as 10b lines. Official wording: at `66aabd54` against `0673be7e`, and at `10ab12d6` against `12b31b1f`.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run of every smoke in § Smoke. Record the mutations (base file restored → what fails), including s10b steps 2–4 at both widths when `read-project.ts` is restored. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time. Do not commit smoke shots. Running s6c rewrites the 6c checkpoint fixture, and later smokes can write untracked shots under `handback/`; restore tracked files, do not commit the shots. If s3 step 9 misses, re-run it solo once; do not edit s3. If a later Test in s10b would read a stale `window.__docs` / `__play` / `__fx`, clear them (the shipped `drop()` helper) before that Test; do not leave the helper undefined.
- Do not treat the open 10b nits, or the 10c editor path, as 10b fixes.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only the r1 QA review):
#   git diff 10ab12d6 HEAD -- \
#     src/project/load/types.ts src/project/load/read-project.ts \
#     tools/play-stage/project.ts tools/play-stage/load.ts \
#     tools/play-stage/fx.ts tools/play-stage/board.ts \
#     tools/maker/art.ts tools/maker/asset-check.ts \
#     tests/editor/art-upload.test.ts tests/project/effects-slot.test.ts \
#     handoff/steps/tests/s10b-effect-data/smoke.mjs
#   (empty)

# Product gate. Official command at the r1 code head or r1 tip against
# 0673be7e, or at the merge against first parent 12b31b1f:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   11 files changed, 134 insertions(+), 20 deletions(-)
#
# At 66aabd54 against 0673be7e: 11 files, 134 insertions, 20 deletions = 154.
# The same 154 at 10ab12d6 against 12b31b1f. At d16d6f5d (current
# main, which also adds the r1 review) against 12b31b1f without
# ':!docs/**': 12 files, 149 insertions, 20 deletions. Adding
# ':!docs/**' again gives 154.
#
# Named tests (npm test 1152/0, floor 1146 + N=6):
#   ✔ 10b D22b effects/ slot: …
#   ✔ 10b effect refs: …
#   ✔ 10b play path: …
#   ✔ 10b asset check (Law 12): …
#   ✔ 10b r2 built-in answers: …
#   ✔ 10b r2 alias: …
#
# Smokes under google-chrome, at 390 and 360 CSS px, all solo, at
# the guide counts (S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16,
# s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16,
# s9 12, s8c 8, s9b 14, s9c 6, s10b 8). Mutations as above.
#
# Export audit as above; s8-audit.mjs 133 / 147 / 146, empty hit list.
```

## QA non-blockers carried forward

- **The HANDBACK PR line** ("opened by Chief Of Staff from the branch") was written before PR #104 existed (QA, V, HB:3). Carried into 10c.
- **Dead `let docs = files`** in `tools/maker/asset-check.ts:15`. The catch returns, so there is no silent fallback to the raw files (QA). Could be a bare declaration in a later touch. Carried into 10c.
- Several files sit on their cap (`types.ts`, `load.ts`, `board.ts`, `art.ts`, `art-upload.test.ts`, `asset-check.ts`, `effects-slot.test.ts`). Shipped 154 is 14 above the trial 140 (still ≤ 400 and under the caps sum 184); the new test is 60 vs the trial 52, and the smoke is 47 vs 42, which accounts for the rise (r2 built-in tests and the `drop` helper) (V).
- The audit script's maker-play figure is 146, the known loose filter (same as 8a–10a). HANDBACK also states the tight `play-stage/` count 133 (V, HB:76–83).
- Running s6c rewrites the 6c checkpoint fixture, and later smokes can write untracked shots under `handback/`. Restore tracked files after a local run; do not commit the shots.
- s3 `waitForTimeout` flake carry is still open; it did not fire on the verify or QA runs (s3 18 ok first time; s8c 8 ok first time) (V, QA, guide L105).
- **Still open, not 10b scope** (guide L100–106, QA): 10c (the Effect row and effect Duplicate) and 10d (the built-ins picker and library); the upload byte cap (a PNG whose header fits still reads whole); from 9b/9c and 10a, the "Stairs to <stage name>" info row, markers in the maker, Cover/Stretch, 8192 toggle, export shipping assets (step 11). Format docs were not edited (r41 is already on this step's starting main). No baseline republish: the baseline projects have no `effects/` docs; any republish needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there; the builder never publishes.
- **Closed here:** the D22b `effects/` slot and id rows; effect-answer resolution including DSK r42 built-in ids and the `builtin:effect/` alias; Test playing a saved effect (and a legacy `setup_` id) by exact id, with stock on a missing id; the `uploadTooLarge` hard row; a failed `migrateProject` returning one hard row instead of checking raw files.

## Blob check

Each file must have exactly this git blob id at `10ab12d6`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/project/load/types.ts` | `2487f40fd32a0d5f14e7d2e0bf1cdc4836c77936` | 30 |
| `src/project/load/read-project.ts` | `48151f811019e78572e10bb7e6adb8027fb9ea69` | 121 |
| `tools/play-stage/project.ts` | `ab0d90522c1aa6b35b6ffaa64ae028d4a3e1b06e` | 115 |
| `tools/play-stage/load.ts` | `e9dacadd6c7279d25a4f2fc92c4f1f21e323e5a2` | 28 |
| `tools/play-stage/fx.ts` | `fb532cef661adf1766e4e5fc7b4bbe71affb87c6` | 51 |
| `tools/play-stage/board.ts` | `2c1c0eb295aac17fa0f4b742eefdde65c4f597a9` | 160 |
| `tools/maker/art.ts` | `fdd7a9fef66d6bd7b76a9542518f2e5fdee45f02` | 75 |
| `tests/editor/art-upload.test.ts` | `2eace597141592b9420fbce99b9176768671b585` | 98 |
| `tools/maker/asset-check.ts` | `f6672a1e5f097533eae51aa1d6fbc919d334ac4e` | 25 |
| `tests/project/effects-slot.test.ts` | `e051234c9c1650e07722d8a99533f55fa73c1b39` | 60 |
| `handoff/steps/tests/s10b-effect-data/smoke.mjs` | `8f6567ddf53cba0fda3cbeef5f088b901fbcbefb` | 47 |

## Appendix: full code as merged (step 10b, PR #104)

New files are `git show 10ab12d6:<path>` in full. Edited files are `git diff 12b31b1f 10ab12d6 -- <path>`. (The product diff against the go-line base `0673be7e` is the same for these 11 files.)

### `src/project/load/types.ts` (edited)

```diff
diff --git a/src/project/load/types.ts b/src/project/load/types.ts
index fcdb193..2487f40 100644
--- a/src/project/load/types.ts
+++ b/src/project/load/types.ts
@@ -12,7 +12,7 @@ export type BehaviourSetup = Doc;
 export type ProjectStore = {
   readonly manifest: ProjectManifest; readonly slice: CatalogueSlice;
   readonly maps: Readonly<Record<string, GameMap>>; readonly stages: Readonly<Record<string, Stage>>;
-  readonly units: Readonly<Record<string, Unit>>; readonly setups: Readonly<Record<string, BehaviourSetup>>;
+  readonly units: Readonly<Record<string, Unit>>; readonly setups: Readonly<Record<string, BehaviourSetup>>; readonly effects: Readonly<Record<string, BehaviourSetup>>;
   readonly unknownFiles: Readonly<Record<string, unknown>>;
 };
 export type ProjectLoad =
@@ -20,11 +20,11 @@ export type ProjectLoad =
   | { readonly ok: false; readonly readOnly: false; readonly project: ProjectStore; readonly report: readonly ReportRow[] }
   | { readonly ok: false; readonly readOnly: true; readonly project: null; readonly report: readonly ReportRow[] };
 
-const SLOTS: Readonly<Record<string, string>> = { maps: "map", stages: "stage", units: "unit", setups: "behaviour-setup" };
+const SLOTS: Readonly<Record<string, string>> = { maps: "map", stages: "stage", units: "unit", setups: "behaviour-setup", effects: "behaviour-setup" };
 /** Known document path, or null when the file is kept as an unknown. */
 export function knownKind(path: string): string | null {
   if (path === "project.json") return "tile-project";
   if (path === "catalogue/slice.json") return "catalogue-slice";
-  const m = /^(maps|stages|units|setups)\/[^/]+\.json$/.exec(path);
+  const m = /^(maps|stages|units|setups|effects)\/[^/]+\.json$/.exec(path);
   return m === null ? null : SLOTS[m[1] ?? ""] ?? null;
 }
```

### `src/project/load/read-project.ts` (edited)

```diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index 72d2cf7..48151f8 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -46,10 +46,11 @@ function knobAt(slice: Obj, behaviourId: unknown, key: string): Obj | null {
   for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === behaviourId) for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === key) return knob;
   return null;
 }
-function warns(slice: Obj, project: Obj, maps: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
+function warns(slice: Obj, project: Obj, maps: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, effects: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
   const projectRev = project["catalogueRev"], settings = isObj(project["settings"]) ? project["settings"] : {}, advanced = settings["advancedRender"] === true, camera = isObj(settings["camera"]) ? settings["camera"] : {};
   if (!advanced && camera["pixelPerfect"] === false) rows.push(row("advancedRenderInactive", "info", "project.json#/project/settings/camera/pixelPerfect", "pixelPerfect"));
   const known = new Set(list(slice["behaviours"]).filter(isObj).map((b) => b["id"]));
+  const builtins = new Set<string>(); for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "effect") for (const preset of list(b["presets"])) if (isObj(preset) && typeof preset["id"] === "string") builtins.add(preset["id"]);
   const tiles = new Set<string>();
   for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string") tiles.add(item["id"]);
   if (slice["catalogue_rev"] !== undefined && slice["catalogue_rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", "catalogue/slice.json#/catalogue_rev"));
@@ -60,6 +61,7 @@ function warns(slice: Obj, project: Obj, maps: Readonly<Record<string, Doc>>, se
     const ns = isObj(answers["custom_ns"]) ? answers["custom_ns"]["value"] : undefined, ew = isObj(answers["custom_ew"]) ? answers["custom_ew"]["value"] : undefined, mode = isObj(answers["reach_mode"]) ? answers["reach_mode"]["value"] : undefined;
     if (setup["behaviourId"] === "basic-attack" && mode === "custom-cross" && typeof ns === "number" && typeof ew === "number" && ns !== ew) rows.push(row("layerNotApplied", "warning", `${path}#/answers/custom_ns`, "min(ns,ew)"));
     if (setup["behaviourId"] === "basic-attack" && isObj(answers["damage"]) && answers["damage"]["source"] !== "default" && answers["damage"]["source"] !== undefined) rows.push(row("layerNotApplied", "warning", `${path}#/answers/damage`, "unit_atk"));
+    const fx = isObj(answers["effect"]) ? answers["effect"]["value"] : undefined; if (typeof fx === "string" && fx !== "none" && !Object.hasOwn(effects, fx)) { const bare = fx.startsWith("builtin:effect/") ? fx.slice("builtin:effect/".length) : fx; if (!builtins.has(bare)) rows.push(row("unknownRef", "warning", `${path}#/answers/effect/value`, fx)); }
     for (const key of Object.keys(answers)) {
       const ans = answers[key]; if (!isObj(ans) || !Object.hasOwn(ans, "value")) continue;
       const knob = knobAt(slice, setup["behaviourId"], key); if (knob === null) continue;
@@ -86,11 +88,11 @@ export function readProject(files: ProjectFiles): ProjectLoad {
   let migrated: { files: ProjectFiles; report: readonly ReportRow[] };
   try { migrated = migrateProject(files); } catch { return { ok: false, readOnly: true, project: null, report: [row("invalidValue", "hard", "project.json", "unreadable")] }; }
   const docs = migrated.files, rows: ReportRow[] = [...migrated.report];
-  const maps: Record<string, Doc> = {}, stages: Record<string, Doc> = {}, units: Record<string, Doc> = {}, setups: Record<string, Doc> = {}, unknownFiles: Record<string, unknown> = {}, stageAt: Record<string, string> = {}, mapAt: Record<string, string> = {};
+  const maps: Record<string, Doc> = {}, stages: Record<string, Doc> = {}, units: Record<string, Doc> = {}, setups: Record<string, Doc> = {}, effects: Record<string, Doc> = {}, unknownFiles: Record<string, unknown> = {}, stageAt: Record<string, string> = {}, mapAt: Record<string, string> = {};
   let slice: Doc = {}, manifest: Doc = {};
   for (const path of Object.keys(docs)) {
     const doc = docs[path], slot = knownKind(path);
-    if (slot === null) { unknownFiles[path] = doc; rows.push(row("unknownFile", "warning", path)); continue; }
+    if (slot === null) { if (path.startsWith("effects/.deleted/")) continue; unknownFiles[path] = doc; rows.push(row("unknownFile", "warning", path)); continue; }
     if (!isObj(doc)) { rows.push(row("invalidValue", "hard", path, "not an object")); continue; }
     const id = idOf(doc);
     if (slot === "tile-project") { manifest = doc; if ("index" in doc) rows.push(row("indexIgnored", "info", `${path}#/index`)); note(readManifest(doc), path, rows); }
@@ -105,15 +107,15 @@ export function readProject(files: ProjectFiles): ProjectLoad {
       if (!badLen) note(readMap(doc), path, rows);
     } else if (slot === "stage") { if (id !== null) { stages[id] = doc; stageAt[id] = path; } note(readStage(doc, LIMITS), path, rows); }
     else if (slot === "unit") { if (id !== null) units[id] = doc; note(readUnit(doc), path, rows); }
-    else { if (id !== null) setups[id] = doc; note(readSetup(doc), path, rows); }
+    else { if (path.startsWith("effects/")) { if (doc["behaviourId"] !== "effect") { unknownFiles[path] = doc; rows.push(row("unknownFile", "warning", path, "behaviourId")); continue; } if (/^setup_[0-9A-HJKMNP-TV-Z]{26}$/.test(id ?? "")) rows.push(row("legacyEffectId", "info", path)); else if (!/^effect_[0-9A-HJKMNP-TV-Z]{26}$/.test(id ?? "")) rows.push(row("badEffectId", "warning", path)); if (id !== null) effects[id] = doc; note(readSetup(doc), path, rows); } else { if (id !== null) setups[id] = doc; note(readSetup(doc), path, rows); } }
   }
   if (!Object.hasOwn(docs, "catalogue/slice.json")) rows.push(row("invalidValue", "hard", "catalogue/slice.json", "missing"));
   const manifestDoc = docs["project.json"];
   const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
   refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
-  warns(slice, project, maps, setups, rows);
+  warns(slice, project, maps, setups, effects, rows);
   rows.push(...placementDrops(stages, stageAt, maps, slice), ...mapEntryDrops(maps, mapAt));
   const hard = rows.some((r) => r.severity === "hard");
-  const store: ProjectStore = { manifest, slice, maps, stages, units, setups, unknownFiles };
+  const store: ProjectStore = { manifest, slice, maps, stages, units, setups, effects, unknownFiles };
   return { ok: !hard, readOnly: false, project: store, report: sort(rows) };
 }
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 983db4c..ab0d905 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -12,6 +12,7 @@ import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
 import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
 import type { CoreTileType } from "../../src/types/core-types.ts";
 import { docsToInput, RECIPES, type Looks, type PlayDocs, type Recipe } from "./load.ts";
+import { HOUSE_ATTACK } from "./fx.ts";
 import { backdropOf } from "./backdrop.ts";
 import { DEMO_LOOKS } from "./looks.ts";
 import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
@@ -48,6 +49,9 @@ function levelsOf(store: ProjectStore, stage: Obj): PlayOut["levels"] {
   if (rules === null) throw new Error("play: xp-levels");
   return { rules, pools: {} };
 }
+function pickFx(store: ProjectStore, id: string, setup: Obj, fxOf: Record<string, string>): void {
+  const behaviour = setup["behaviourId"] === "basic-attack" ? "basic-attack" : setup["behaviourId"] === "line-shot" ? "line-shot" : "", v = behaviour === "" ? undefined : knob(setup, store.slice, behaviour, "effect"); if (typeof v === "string" && Object.hasOwn(store.effects, v)) fxOf[`${id}|${behaviour === "basic-attack" ? HOUSE_ATTACK : "line-shot"}`] = v;
+}
 /** Adapter only. Document JSON is already read by readProject. */
 export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {}, sess = isObj(root["session"]) ? root["session"] : null, start = sess !== null && typeof sess["start"] === "string" ? sess["start"] : undefined;
@@ -57,7 +61,7 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
   const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
   const stepped = installOne(STEP_PATTERN, {}).out; if (stepped === null) throw new Error("play: step");
-  const stats: Record<string, { hp: number; atk: number }> = {}, reach: Record<string, number> = {}, abilities: Record<string, { reach: number; damage: number; effectRef: string }[]> = {}, names: Record<string, string> = {};
+  const stats: Record<string, { hp: number; atk: number }> = {}, reach: Record<string, number> = {}, abilities: Record<string, { reach: number; damage: number; effectRef: string }[]> = {}, names: Record<string, string> = {}, fxOf: Record<string, string> = {};
   for (const [id, unit] of Object.entries(store.units)) {
     const st = isObj(unit["stats"]) ? unit["stats"] : {}, hpBag = st["unit_hp"], atkBag = st["unit_atk"], row = { hp: num(isObj(hpBag) ? hpBag["value"] : undefined) ?? hp0, atk: num(isObj(atkBag) ? atkBag["value"] : undefined) ?? atk0 };
     stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
@@ -65,6 +69,7 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
       const setup = store.setups[sid]; if (setup === undefined) continue;
       if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "orth-only-1" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
       if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
+      pickFx(store, id, setup, fxOf);
     }
   }
   const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(root["loadout"]) ? root["loadout"] : {}, chosen: string[] = [];
@@ -77,7 +82,7 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
   const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
   const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage), backdrop = backdropOf(root, map);
-  return { manifest: store.manifest, map, stage, links: core.doc.links ?? [], rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }), ...(backdrop.length === 0 ? {} : { backdrop }) };
+  return { manifest: store.manifest, map, stage, links: core.doc.links ?? [], rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }), ...(backdrop.length === 0 ? {} : { backdrop }), effects: Object.values(store.effects), ...(Object.keys(fxOf).length > 0 ? { fxOf } : {}) };
 }
 export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
   try {
```

### `tools/play-stage/load.ts` (edited)

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index 7a1491b..e9dacad 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -20,7 +20,7 @@ export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
 export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly bench?: readonly { readonly unitId: string; readonly hp: number }[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup; readonly backdrop?: readonly { readonly assetId: string; readonly file: string; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" }[]; readonly art?: (file: string) => Promise<Blob | null> };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly fxOf?: Readonly<Record<string, string>>; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly bench?: readonly { readonly unitId: string; readonly hp: number }[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup; readonly backdrop?: readonly { readonly assetId: string; readonly file: string; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" }[]; readonly art?: (file: string) => Promise<Blob | null> };
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
```

### `tools/play-stage/fx.ts` (edited)

```diff
diff --git a/tools/play-stage/fx.ts b/tools/play-stage/fx.ts
index f55117b..fb532ce 100644
--- a/tools/play-stage/fx.ts
+++ b/tools/play-stage/fx.ts
@@ -36,7 +36,7 @@ const houseCue = (entry: { seq: number; tick: number; action: Action }, stepMs:
   return { id: `cast:${entry.seq}`, atMs: entry.tick * stepMs, caster: action.actor, ref: HOUSE_ATTACK, ...(target === undefined ? {} : { target }) };
 };
 
-export function createPlayFx(docs?: readonly unknown[]) {
+export function createPlayFx(docs?: readonly unknown[], pick?: (caster: string, ref: string) => string | undefined) {
   const table = new Map(stock);
   for (const doc of docs ?? []) { const read = readEffect(doc); if (read.ok) table.set(read.doc.id, { rev: read.doc.rev, values: read.doc.values }); }
   const engine = createCastFx({ sheetOf: () => FX_SHEET, clipOf: () => FX_CLIP, values: (ref) => table.get(ref) ?? null });
@@ -44,7 +44,7 @@ export function createPlayFx(docs?: readonly unknown[]) {
     engine,
     values: (ref: string) => table.get(ref) ?? null,
     ingest(log: { entries(): readonly { seq: number; tick: number; action: Action }[] }, stepMs: number, now: number) {
-      for (const entry of log.entries()) { const cue = cueFromEntry(entry, stepMs, refOf) ?? houseCue(entry, stepMs); if (cue !== null) engine.cast(cue); }
+      for (const entry of log.entries()) { const cue = cueFromEntry(entry, stepMs, refOf) ?? houseCue(entry, stepMs); if (cue !== null) engine.cast(pick === undefined ? cue : { ...cue, ref: pick(cue.caster, cue.ref) ?? cue.ref }); }
       return engine.effects(now);
     },
   };
```

### `tools/play-stage/board.ts` (edited)

```diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index 2f279fc..2c1c0eb 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -92,7 +92,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   const player = createPlayer(world, { side: sides.me, moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
   const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
   const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
-  const fx = createPlayFx(body.effects), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
+  const fx = createPlayFx(body.effects, (caster, ref) => { const id = world.units.get(caster)?.unitId; return id === undefined || body.fxOf === undefined ? undefined : body.fxOf[`${id}|${ref}`]; }), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
   let looks = dress(world.grid, body.looks), artBox: Record<string, SceneAsset> | null = null, artKey = "";
   const marks = (body.links ?? []).map((link) => ({ band: "fxGround" as const, sheet: { id: `play:link-${Object.hasOwn(SHAPE, link.type) ? link.type : "link"}`, columns: 1, fw: 16, fh: 16 }, x: link.at.c * TILE, y: link.at.r * TILE }));
   for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
```

### `tools/maker/art.ts` (edited)

```diff
diff --git a/tools/maker/art.ts b/tools/maker/art.ts
index fa48a1d..fdd7a9f 100644
--- a/tools/maker/art.ts
+++ b/tools/maker/art.ts
@@ -6,10 +6,10 @@ import type { ProjectFiles, ReportRow } from "../../src/project/load/types.ts";
 import { assetRows } from "./asset-check.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, type MakerStore } from "./store.ts";
-import { fits, readPicture } from "../play-stage/picture.ts";
+import { fits, MAX_SIDE, readPicture } from "../play-stage/picture.ts";
 const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
 const amp = String.fromCharCode(38), esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? `${amp}amp;` : ch === "<" ? `${amp}lt;` : ch === ">" ? `${amp}gt;` : ch === '"' ? `${amp}quot;` : `${amp}#39;`);
-export type ArtRow = { readonly code: "uploadTypeUnsupported"; readonly severity: "hard"; readonly path: string; readonly detail: string };
+export type ArtRow = { readonly code: "uploadTypeUnsupported" | "uploadTooLarge"; readonly severity: "hard"; readonly path: string; readonly detail: string };
 export type ArtResult = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly line: string; readonly row?: ArtRow };
 let shown = false, note: string | null = null, lines: readonly string[] = [];
 export const showArt = (): void => { shown = true; note = null; }, hideArt = (): void => { shown = false; note = null; }, setArtNote = (line: string | null): void => { note = line; }, setArtLines = (next: readonly string[]): void => { lines = next; };
@@ -31,7 +31,7 @@ export async function uploadBytes(file: Blob): Promise<Uint8Array> {
 export async function addPicture(store: MakerStore, id: string, files: DocText, rev: number, stageId: string, now: string, fileName: string, bytes: Uint8Array): Promise<ArtResult> {
   const pic = readPicture(bytes);
   if (!pic.ok) return { ok: false, line: typeLine(fileName, pic.sniffed), row: { code: "uploadTypeUnsupported", severity: "hard", path: fileName, detail: pic.sniffed } };
-  if (!fits(pic.w, pic.h)) return { ok: false, line: `${fileName} is too big: ${pic.w} × ${pic.h} px. A picture can be at most 4096 px a side. Nothing was saved.` };
+  if (!fits(pic.w, pic.h)) return { ok: false, line: `${fileName} is too big: ${pic.w} × ${pic.h} px. A picture can be at most 4096 px a side. Nothing was saved.`, row: { code: "uploadTooLarge", severity: "hard", path: fileName, detail: JSON.stringify({ w: pic.w, h: pic.h, max: MAX_SIDE }) } };
   const parsed = parseProject(files); if (!parsed.ok) return { ok: false, line: parsed.message };
   const found = locate(parsed.files, stageId); if (found === null) return { ok: false, line: "Can't open this map" };
   const assetId = `asset_${hex(await crypto.subtle.digest("SHA-256", new Uint8Array(bytes))).slice(0, 16)}`, stem = fileName.replace(/\.[^./\\]+$/, "").slice(0, 64), name = stem === "" ? "Picture" : stem;
```

### `tests/editor/art-upload.test.ts` (edited)

```diff
diff --git a/tests/editor/art-upload.test.ts b/tests/editor/art-upload.test.ts
index 848486f..2eace59 100644
--- a/tests/editor/art-upload.test.ts
+++ b/tests/editor/art-upload.test.ts
@@ -59,7 +59,7 @@ test("upload refusals write nothing: other types are uploadTypeUnsupported {file
   assert.equal(gif.line, "Can't use cat.png: it's a gif file. Use a PNG, JPG or WebP picture.");
   assert.deepEqual(gif.row, { code: "uploadTypeUnsupported", severity: "hard", path: "cat.png", detail: "gif" });
   const wide = await addPicture(store, PID, files, rev, STAGE, NOW, "wide.png", png(5000, 10));
-  assert.equal(wide.ok, false); if (wide.ok) return; assert.equal(wide.line, "wide.png is too big: 5000 × 10 px. A picture can be at most 4096 px a side. Nothing was saved."); assert.equal(wide.row, undefined);
+  assert.equal(wide.ok, false); if (wide.ok) return; assert.equal(wide.line, "wide.png is too big: 5000 × 10 px. A picture can be at most 4096 px a side. Nothing was saved."); assert.deepEqual(wide.row, { code: "uploadTooLarge", severity: "hard", path: "wide.png", detail: JSON.stringify({ w: 5000, h: 10, max: 4096 }) });
   assert.equal(shot(store), before); assert.deepEqual(await store.list(`${prefix(PID)}assets/`), []); assert.equal(files["project.json"], textOf(root)["project.json"]);
 });
 test("background sheet: lines show this map's D29 asset rows (hard when a played stage uses it), and Remove takes the layer off but keeps the asset", async () => {
```

### `tools/maker/asset-check.ts` (edited)

```diff
diff --git a/tools/maker/asset-check.ts b/tools/maker/asset-check.ts
index 20d5434..f6672a1 100644
--- a/tools/maker/asset-check.ts
+++ b/tools/maker/asset-check.ts
@@ -12,7 +12,7 @@ function usedIds(project: Record<string, unknown>, files: Readonly<Record<string
 }
 /** H4 at Test only. Hard when a selected stage's map names the asset, else a warning. The index entry is kept. */
 export async function assetRows(store: MakerStore, folder: string, files: Readonly<Record<string, unknown>>): Promise<ReportRow[]> {
-  let docs = files; try { docs = migrateProject(files).files; } catch { docs = files; }
+  let docs = files; try { docs = migrateProject(files).files; } catch { return [{ code: "invalidValue", severity: "hard", path: "project.json", detail: "unreadable" }]; }
   const root = docs["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, assets = isObj(project["assets"]) ? project["assets"] : {}, used = usedIds(project, docs), pre = folder.endsWith("/") ? folder : `${folder}/`, rows: ReportRow[] = [];
   for (const [id, meta] of Object.entries(assets)) {
     if (!isObj(meta) || typeof meta["ext"] !== "string") continue;
```

### `tests/project/effects-slot.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { readProject } from "../../src/project/load/index.ts";
import { stepTimes } from "../../src/runtime/render/fx-doc.ts";
import { assetRows } from "../../tools/maker/asset-check.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { createPlayFx, HOUSE_ATTACK, LINE_SHOT_DOC } from "../../tools/play-stage/fx.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
import { loadFixture, U } from "../tools/demo-fixture.ts";
const FRESH = "effect_01JDB10B00000000000000000A", LEGACY = "setup_01JDB10B00000000000000000B", BAD = "effect_not_an_ulid", GONE = "effect_01JDB10B00000000000000000Z", LINE = "setups/setup_01JDAT00000000000000000005.json", BASIC = "setups/setup_01JDAT00000000000000000004.json", ARCHER = `${U.archer}#2`;
const EFFECT = (JSON.parse(readFileSync(new URL("../../behaviour-library/behaviours.json", import.meta.url), "utf8")) as { behaviours: { id?: string }[] }).behaviours.find((b) => b.id === "effect");
const fxDoc = (id: string): Record<string, unknown> => ({ kind: "behaviour-setup", formatVersion: 3, id, rev: 1, behaviourId: "effect", catalogue: { rev: 30 }, answers: { steps: { source: "user", value: [{ kind: "stamp", seconds: 0.15 }] } } });
const filesOf = (): Record<string, unknown> => ({ ...loadFixture() });
const answer = (files: Record<string, unknown>, path: string, value: string): void => { const doc = files[path]; if (typeof doc !== "object" || doc === null || Array.isArray(doc)) throw new Error(path); const bag = doc as Record<string, unknown>, prev = bag["answers"], answers = typeof prev === "object" && prev !== null && !Array.isArray(prev) ? prev as Record<string, unknown> : {}; answers["effect"] = { source: "user", value, rev: 1 }; bag["answers"] = answers; };
const addEffect = (files: Record<string, unknown>): void => { const slice = files["catalogue/slice.json"]; if (typeof slice !== "object" || slice === null || Array.isArray(slice) || EFFECT === undefined) throw new Error("slice"); const bag = slice as Record<string, unknown>; bag["behaviours"] = [...(Array.isArray(bag["behaviours"]) ? bag["behaviours"] : []), structuredClone(EFFECT)]; };
const act = (effects: readonly string[], actor = ARCHER): Action => ({ id: "a1", kind: "ability", actor, target: null, durationMs: null, turns: null, effects });
const read = (files: Record<string, unknown>) => { const load = readProject(files); if (load.project === null) throw new Error(load.report.map((r) => r.code).join(" ")); return load; };
const at = (load: ReturnType<typeof read>, code: string, path: string) => load.report.filter((r) => r.code === code && r.path === path);
const shot = (effects: readonly string[]) => ({ entries: () => [{ seq: 1, tick: 0, action: act(effects) }] });
const bash = { entries: () => [{ seq: 2, tick: 0, action: act([], `${U.archer}#1`) }] };
test("10b D22b effects/ slot: effect docs load into project.effects; setup_<ULID> is legacyEffectId (info) and still loads; another id shape is badEffectId (warning) and still loads; a non-effect doc is unknownFile (behaviourId), not loaded; .deleted/ is skipped with no row", () => {
  const files = filesOf(); files[`effects/${FRESH}.json`] = fxDoc(FRESH); files[`effects/${LEGACY}.json`] = fxDoc(LEGACY); files[`effects/${BAD}.json`] = fxDoc(BAD);
  files["effects/talk.json"] = { ...fxDoc("setup_01JDB10B00000000000000000C"), behaviourId: "talk" }; files["effects/.deleted/effect_01JDB10B00000000000000000D.json"] = fxDoc("effect_01JDB10B00000000000000000D");
  const load = read(files), fx = load.project.effects;
  assert.equal(fx[FRESH]?.["id"], FRESH); assert.equal(fx[LEGACY]?.["id"], LEGACY); assert.equal(fx[BAD]?.["id"], BAD); assert.equal(fx["setup_01JDB10B00000000000000000C"], undefined); assert.equal(fx["effect_01JDB10B00000000000000000D"], undefined);
  assert.equal(at(load, "legacyEffectId", `effects/${LEGACY}.json`)[0]?.severity, "info"); assert.equal(at(load, "badEffectId", `effects/${BAD}.json`)[0]?.severity, "warning"); assert.equal(at(load, "unknownFile", "effects/talk.json")[0]?.detail, "behaviourId");
  assert.equal(load.report.some((r) => r.path.includes(".deleted")), false); assert.equal(load.project.unknownFiles["effects/.deleted/effect_01JDB10B00000000000000000D.json"], undefined);
});
test("10b effect refs: an ability's effect answer naming no loaded effect is unknownRef (warning, runs as the stock drawing); none and a loaded id (new or legacy) give no row (built-ins: tests 5 and 6)", () => {
  const files = filesOf(); files[`effects/${FRESH}.json`] = fxDoc(FRESH); files[`effects/${LEGACY}.json`] = fxDoc(LEGACY);
  answer(files, LINE, GONE); answer(files, BASIC, "none"); answer(files, "setups/setup_01JDAT00000000000000000001.json", FRESH); answer(files, "setups/setup_01JDAT00000000000000000002.json", LEGACY);
  const load = read(files), row = at(load, "unknownRef", `${LINE}#/answers/effect/value`), docs = playDocsOf(load.project);
  assert.equal(row.length, 1); assert.equal(row[0]?.severity, "warning"); assert.equal(row[0]?.detail, GONE); assert.equal(load.report.some((r) => r.code === "unknownRef" && (r.detail === "none" || r.detail === FRESH || r.detail === LEGACY)), false);
  assert.equal(createPlayFx(docs.effects, (caster, ref) => docs.fxOf?.[`${caster.split("#")[0]}|${ref}`]).ingest(shot(["line-shot"]), 10, 200).length, 1); assert.equal(stepTimes(LINE_SHOT_DOC).endMs, 484);
});
test("10b play path: Test plays the caster's saved effect by exact id (a legacy setup_ id too) for its line-shot and its basic attack; with no answer the stock drawing plays (150 ms saved vs 484 ms stock)", () => {
  const plain = playDocsOf(read(filesOf()).project), files = filesOf(); files[`effects/${FRESH}.json`] = fxDoc(FRESH); files[`effects/${LEGACY}.json`] = fxDoc(LEGACY); answer(files, LINE, FRESH); answer(files, BASIC, LEGACY);
  const docs = playDocsOf(read(files).project), pick = (caster: string, ref: string) => docs.fxOf?.[`${caster.split("#")[0]}|${ref}`], saved = createPlayFx(docs.effects, pick), hit = createPlayFx(docs.effects, pick);
  assert.equal(docs.rules.abilities?.[U.archer]?.[0]?.effectRef, "line-shot"); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], FRESH); assert.equal(docs.fxOf?.[`${U.archer}|${HOUSE_ATTACK}`], LEGACY);
  assert.equal(saved.ingest(shot(["line-shot"]), 10, 100).length, 1); assert.equal(saved.ingest(shot(["line-shot"]), 10, 200).length, 0); assert.equal(hit.ingest(bash, 10, 100).length, 1); assert.equal(hit.ingest(bash, 10, 200).length, 0);
  assert.equal(plain.fxOf, undefined); assert.equal(createPlayFx(plain.effects).ingest(shot(["line-shot"]), 10, 200).length, 1); assert.equal(stepTimes({ steps: [{ kind: "stamp", seconds: 0.15 }] }).endMs, 150);
});
test("10b asset check (Law 12): when the project can't be migrated, assetRows says so with one hard row instead of checking the raw files", async () => {
  const files = { "project.json": { formatVersion: 6, project: { assets: { asset_dead: { ext: "png" } }, stages: ["s"] } }, "stages/s.json": { id: "s", mapRef: "m" }, "maps/m.json": { id: "m", background: { layers: [{ assetId: "asset_dead" }] } }, boom: () => 0 };
  assert.deepEqual(await assetRows(memoryStore(), "proj/", files), [{ code: "invalidValue", severity: "hard", path: "project.json", detail: "unreadable" }]);
});
test("10b r2 built-in answers: a bare BTF id matched against the slice's effect presets gives no row and runs stock; with no such preset in the slice it is unknownRef", () => {
  const bare = filesOf(); answer(bare, LINE, "btf-purple-drop"); const missing = read(bare); assert.equal(at(missing, "unknownRef", `${LINE}#/answers/effect/value`)[0]?.detail, "btf-purple-drop");
  const files = filesOf(); addEffect(files); answer(files, LINE, "btf-purple-drop"); const load = read(files), docs = playDocsOf(load.project);
  assert.equal(load.report.some((r) => r.code === "unknownRef" && r.detail === "btf-purple-drop"), false); assert.equal(docs.fxOf?.[`${U.archer}|line-shot`], undefined);
  assert.equal(createPlayFx(docs.effects, (caster, ref) => docs.fxOf?.[`${caster.split("#")[0]}|${ref}`]).ingest(shot(["line-shot"]), 10, 200).length, 1);
});
test("10b r2 alias: builtin:effect/<id> reads as the bare id (no row) and is never rewritten; an alias naming no preset is unknownRef", () => {
  const files = filesOf(), alias = "builtin:effect/btf-purple-drop", bad = "builtin:effect/not-a-preset"; addEffect(files); answer(files, LINE, alias); answer(files, BASIC, bad);
  const load = read(files), setup = load.project.setups["setup_01JDAT00000000000000000005"], answers = setup?.["answers"], effect = typeof answers === "object" && answers !== null && !Array.isArray(answers) ? (answers as Record<string, unknown>)["effect"] : undefined;
  assert.equal(at(load, "unknownRef", `${LINE}#/answers/effect/value`).length, 0); assert.equal(at(load, "unknownRef", `${BASIC}#/answers/effect/value`)[0]?.detail, bad);
  assert.equal(typeof effect === "object" && effect !== null && !Array.isArray(effect) && (effect as Record<string, unknown>)["value"], alias);
});
```

### `handoff/steps/tests/s10b-effect-data/smoke.mjs` (new)

```js
// Step 10b effect data. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s10b-effect-data/smoke.mjs . 8815 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8815", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s10b-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const FRESH = "effect_01JDB10B00000000000000000A", LEGACY = "setup_01JDB10B00000000000000000B", ARCHER = "unit_01JDAN00000000000000000002", GONE = "effect_01JDB10B00000000000000000Z";
const doc = (id) => JSON.stringify({ kind: "behaviour-setup", formatVersion: 3, id, rev: 1, behaviourId: "effect", catalogue: { rev: 30 }, answers: { steps: { source: "user", value: [{ kind: "stamp", seconds: 0.15 }] } } });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const put = (rel, text) => page.evaluate(async ({ rel, text }) => { const id = JSON.parse(window.__read()["project.json"]).project.id, root = await navigator.storage.getDirectory(), parts = `tileengine/projects/${id}/${rel}`.split("/"), leaf = parts.pop(); let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await w.write(text); await w.close(); window.__write(rel, text); }, { rel, text });
    const setAnswer = (value) => page.evaluate(async (value) => { const id = JSON.parse(window.__read()["project.json"]).project.id, rel = "setups/setup_01JDAT00000000000000000005.json", root = await navigator.storage.getDirectory(), parts = `tileengine/projects/${id}/${rel}`.split("/"), leaf = parts.pop(); let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const handle = await dir.getFileHandle(leaf), raw = JSON.parse(await (await handle.getFile()).text()); raw.answers.effect = { source: "user", value, rev: 1 }; const text = JSON.stringify(raw); const w = await handle.createWritable(); await w.write(text); await w.close(); window.__write(rel, text); }, value);
    const drop = () => page.evaluate(() => { delete window.__play; delete window.__docs; delete window.__fx; });
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await step("1 new", async () => { await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); });
    await step("2 saved", async () => {
      await put(`effects/${FRESH}.json`, doc(FRESH)); await put(`effects/${LEGACY}.json`, doc(LEGACY)); await put(`effects/.deleted/${GONE}.json`, doc(GONE)); await put("effects/talk.json", JSON.stringify({ kind: "behaviour-setup", formatVersion: 3, id: "setup_01JDB10B00000000000000000C", rev: 1, behaviourId: "talk", catalogue: { rev: 30 } }));
      await setAnswer(FRESH); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs !== undefined && window.__fx !== undefined, null, { timeout: 15000 });
      const got = await page.evaluate(({ FRESH, LEGACY, ARCHER, GONE }) => { const ids = (window.__docs.effects ?? []).map((d) => d.id), fx = window.__docs.fxOf ?? {}; return { fresh: ids.includes(FRESH), legacy: ids.includes(LEGACY), gone: ids.includes(GONE) || ids.includes("setup_01JDB10B00000000000000000C"), fx: fx[`${ARCHER}|line-shot`], rev: window.__fx.values(FRESH)?.rev }; }, { FRESH, LEGACY, ARCHER, GONE });
      if (!got.fresh || !got.legacy || got.gone || got.fx !== FRESH || got.rev !== 1) throw new Error(JSON.stringify(got));
    });
    await step("3 legacy", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 }); await setAnswer(LEGACY); await drop(); await tap(page, "s:test"); await page.waitForFunction(({ id, archer }) => window.__docs?.fxOf?.[`${archer}|line-shot`] === id, { id: LEGACY, archer: ARCHER }, { timeout: 15000 });
      const got = await page.evaluate(({ LEGACY, ARCHER }) => ({ fx: (window.__docs.fxOf ?? {})[`${ARCHER}|line-shot`], rev: window.__fx.values(LEGACY)?.rev }), { LEGACY, ARCHER }); if (got.fx !== LEGACY || got.rev !== 1) throw new Error(JSON.stringify(got));
    });
    await step("4 missing", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 }); await setAnswer("effect_01JDB10B00000000000000000Y"); await drop(); await tap(page, "s:test"); await page.waitForFunction((archer) => window.__play !== undefined && window.__docs !== undefined && window.__docs.fxOf?.[`${archer}|line-shot`] === undefined, ARCHER, { timeout: 15000 });
      const got = await page.evaluate(({ ARCHER, FRESH, LEGACY }) => { const fx = window.__docs.fxOf ?? {}, picked = Object.values(fx); return { open: window.__play !== undefined, shot: fx[`${ARCHER}|line-shot`] ?? null, picked: picked.includes(FRESH) || picked.includes(LEGACY), stock: window.__fx.values("line-shot") !== null }; }, { ARCHER, FRESH, LEGACY });
      if (!got.open || got.shot !== null || got.picked || !got.stock) throw new Error(JSON.stringify(got));
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

