# Rebuild record: step 8a, autosave at links and the session start

Original brief: [`docs/maker/steps/step-08-autosave-links.md`](../maker/steps/step-08-autosave-links.md) on the merge (r4, blob `73584e26`, sha256 `354038813c96a21af5814398082eacc3f2b0ded12d7357ebc906ea0ec70b41ee`, 247 lines). Delivery L19; Goal L26; Read first L39; Data L74; Rules L87; Build L119; Named tests L159; Smoke L173; Must NOT L192; Done when, 8a L198. Count command L154; hard per-file caps and the 8a/8b split L119–157; 8a caps sum 398 at L155. The s8 smoke has its own cap of 55, outside the 400 (L152, L154). The file is unchanged from the 8a product base through the merge; current main adds only the two QA reviews.

Sources: PR #96 and branches `step/step-08a-autosave-links-r1-chatA` (r1 tip `a9ccade3`, r1 code head `3d3d2539`) and `step/step-08a-autosave-links-r2-chatA` (r2 tip `c1219f71`, r2 code head `4f662831`); `handback/step-08a-autosave-links/r1/HANDBACK.md` at `a9ccade3` and on the merge (HB1, blob `408292cf`, 148 lines, sha256 `2141c519b1dc124861e62f5e37a8a65e9ce11c2e1e2748d2990339222d286432`); `handback/step-08a-autosave-links/r2/HANDBACK.md` at `c1219f71` and on the merge (HB2, blob `9cdf4453`, 113 lines, sha256 `c1d736868b4ba0f0011b63089b040c450da6f90fac7deda2718eb964e8fa5614`); CoS verify reports `/workspace/share/step-08a-verify/report.md` (V1, 68 lines, sha256 `2cea1967dc305f11cd3b42216618aaf854a48a9c239d0a8517554ffe15fafa60`, hash-object `bd5e3cfb5196c9a7d3857feef5f558fe8818a3c8`) and `/workspace/share/step-08a-r2-verify/report.md` (V2, 44 lines, sha256 `39cd11589ae0c647e166da0d519ec0dd71fb6ae3447b8912fd3c02933f7d31fc`, hash-object `de5e8c315fa6eebd20d8a815e9855fa463d7c379`). `docs/qa/step-08a-r1-review.md` on main `5034dd7a` and at the merge (QA1, blob `55e755da`, 83 lines, sha256 `03a1ebaaf83e33ee03eb233bf7e06e1fb6c7a9c02c293c9b3c54cb7e0972b77b`): **NOT OK**, 3 must-fixes, one rework round. `docs/qa/step-08a-r2-review.md` on main `10ca0b0a` (QA2, blob `516ed286`, 31 lines, sha256 `8dbb150f69b024ecc6cdacc645a802e0c2181871548429509d53af9ad949a8c0`): **OK TO MERGE**. Line cites use HB1, HB2, V1, V2, QA1 and QA2. Product line cites are at merge `a0c1dad2` (tree `21964006`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `9f7f7e526bf8655b903c7722c478bfe913d77405`, 2026-11-23 22:21 (UK time). Floor **1114** tests (guide L8 / L15 / L199: step 7's final count + N=8). After this merge the floor is **1122**. The base is docs and staging only on `e801c78d`: DSK D28, the step 8 guide r4 with its QA review and rechecks, and the staged CN `data/staging/cn-session/cn-session.diff` (sha256 `74fb9ff438163b6b31026977201f1b07c32094726d48798d7ce0ff331737b0a7`) |
| r1 commits | on `step/step-08a-autosave-links-r1-chatA`: `3d3d253966b6ba65559dfb1fd1d020641a3f1e6d` feat(session): autosave at a link and the session start (code head, tree `ca5f1598cf07b73780984d37a86fd52517843d5e`, 2026-11-24 03:50 UK time), `a9ccade3cce110c10f64d700280ffeb6ff95285e` docs(handback): step 8a autosave links r1 (tree `d8a232b93151b9a144fc46e6b143e5328db40703`, 2026-11-24 03:51 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the r1 hand-back folder only: `HANDBACK.md` and four 390×844 RGB shots (`01-autosave-on.png` … `04-continue.png`) (HB1:3, V1, QA1:8–9, QA1:24) |
| r1 verdict | Product green was 1122/0 and the official count was 355, with every cap kept (HB1:69, V1, QA1:16–21). QA **NOT OK, 3 must-fixes, one rework round (r2)** (QA1:3). (1) `arrival()` queued every neighbour, including walls, taken cells and off-map cells, out to Manhattan 512, so a party larger than the free cells walked about 525k cells (QA A 309 ms, B 358 ms) (QA1:28–39). (2) `tools/maker/test-launch.ts` L4 joined five imports to sit at 18/19 (guide L157) (QA1:56–59). (3) The Continue banner printed every `saveRefDropped` as `dropped unitId …`, including a missing `to` or `from` stage (QA1:63–70). PR #95 "Step 8a: autosave at links and the session start (r1, ChatA)" was opened from the r1 branch and later **closed unmerged** (2026-11-24 08:48 UK time) when the r2 PR opened. The r1 QA review is on main `5034dd7ae3739c065ff8cb24b5d7825c8894284e` (2026-11-24 04:51 UK time) |
| r2 commits | on `step/step-08a-autosave-links-r2-chatA`, cut from the r1 tip `a9ccade3` (allowed): `4f662831aa36258c0a2b51103f77b40d21f060bd` fix(session): flood arrival through free cells only (code head, tree `f1664e09a56665b5c3da114f346ca93bee28cc33`, 2026-11-24 05:08 UK time), `c1219f71357b3df07e49845fe03581ebe59e3754` docs(handback): step 8a autosave links r2 (tree `91618412ec9d506044ec65838b831b44514cfb08`, 2026-11-24 05:09 UK time). Linear, no merges. Same noreply identity. The product fix `a9ccade3..4f662831` touches only `src/rules/session/links.ts`, `tools/maker/test-launch.ts` and `tools/maker/home.ts` (+9/−6); test 2 and test 9 were not edited (QA2:8, V2). Tip vs code is `handback/step-08a-autosave-links/r2/HANDBACK.md` only (113 lines). The four r1 shots were not retaken (HB2, QA1:83) |
| r2 verdict | QA **OK TO MERGE** (QA2:3). All three must-fixes closed, and the full floor holds (QA2:3, QA2:11–23, V2). Green 1122/0; official count **356/400**; s8 16 ok and `SMOKE PASS`; S0 14 ok and `TOUCH SMOKE PASS`; export audit PASS. QA's own arrival A is **0.1–0.2 ms** (r1: 309 ms); test 8 median **0.89 ms** (QA2:13, QA2:19–22). Non-blockers and the open EA carry are recorded below |
| Merge | PR #96 "Step 8a r2: autosave links (QA must-fixes)", merge commit `a0c1dad28e8608318a8e67188d2150f0aa333bde`, 2026-11-24 08:51 (UK time). Tree `219640068d7f51562741a3c66f519f495f1d90a7` (the same tree CoS and QA predicted against main `5034dd7a`; V2, QA2:9). First parent `5034dd7ae3739c065ff8cb24b5d7825c8894284e` (the r1 QA review, docs-only on the product base), second parent `c1219f71`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Diff vs the r2 tip is only `docs/qa/step-08a-r1-review.md` (blob `55e755da`, the same as on `5034dd7a`) |
| After the merge | main is `10ca0b0ab587f0ebd7effde3db3f704e921123c5`, 2026-11-24 08:51 (UK time), tree `cec9e5507b55974d1ddf70a74f07bb99fec96048`, which adds only `docs/qa/step-08a-r2-review.md` (31 insertions, sha256 `8dbb150f`, hash-object `516ed286`). Both QA reviews are on main. The product pin in `tests/smoke.test.ts` L14 is `439f403d…`; CoS pins were bumped to that sha. The floor is now 1122. 8b has not started |
| Tests | 1114 + N=8 (named tests 1–5 and 7–9 in `tests/tools/autosave-links.test.ts`; named test 6 is 8b) = **1122 pass / 0 fail**. Floor after this merge is **1122** (HB2:20–21, V2, QA2:19) |

## (b) Files

From `git diff --name-status 9f7f7e52..4f662831 -- . ':!handback/**' ':!handoff/steps/tests/s8-autosave-links/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the r2 code head (the accepted 8a measure). The same product files are on the merge tree `21964006`. The step 8 guide docs on the merge are from first parent `5034dd7a`, not from this branch. The r1 review doc landed on the merge from that first parent and is **not** in the official 400. The smoke is **not** in the official 400 (guide L152, L154); it has its own cap of 55.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/types/core-types.ts` | M | 6 / 0 | 6 (L122) | yes. sits on the cap (HB1:69, QA2:21) |
| `tests/smoke.test.ts` | M | 1 / 1 | 2 (L123) | yes. sits on the cap (the pin line only) |
| `src/project/read/stage.ts` | M | 1 / 1 | 2 (L124) | yes. sits on the cap |
| `src/project/read/manifest.ts` | M | 3 / 1 | 6 (L125) | yes. 4 |
| `src/project/load/read-project.ts` | M | 1 / 0 | 1 (L126) | yes. sits on the cap |
| `src/project/read/session.ts` | A | 38 / 0 | 38 (L127) | yes. sits on the cap |
| `src/sim/migrations/save/index.ts` | M | 4 / 3 | 8 (L128) | yes. 7 |
| `tests/sim/trusted-saves.test.ts` | M | 5 / 5 | 10 (L129) | yes. sits on the cap (the session-save key and three literals only) |
| `src/rules/session/links.ts` | M | 11 / 6 | 21 (L130) | yes. 17. r2 changed one line inside that 17; numstat vs the base is unchanged from r1 |
| `src/rules/session/party.ts` | A | 16 / 0 | 19 (L131) | yes |
| `src/rules/battle/battle.ts` | M | 5 / 3 | 11 (L132) | yes. 8 |
| `src/rules/levels/levels.ts` | M | 8 / 4 | 12 (L133) | yes. sits on the cap |
| `src/rules/levels/types.ts` | M | 2 / 1 | 3 (L134) | yes. sits on the cap |
| `src/editor/stage/links.ts` | M | 1 / 0 | 2 (L135) | yes |
| `src/editor/stage/rooms.ts` | M | 6 / 0 | 7 (L136) | yes. 6 |
| `tools/play-stage/match.ts` | M | 3 / 1 | 7 (L137) | yes. 4 |
| `tools/play-stage/page.ts` | M | 3 / 2 | 5 (L138) | yes. sits on the cap |
| `tools/play-stage/project.ts` | M | 17 / 12 | 29 (L139) | yes. sits on the cap |
| `tools/maker/session.ts` | A | 23 / 0 | 26 (L140) | yes |
| `tools/maker/test-launch.ts` | M | 13 / 6 | 19 (L141) | yes. sits on the cap (r1 was 11 / 7 = 18, with the joined imports) |
| `tools/maker/home.ts` | M | 14 / 7 | 28 (L142) | yes. 21. r2 changed one line; numstat vs the base is unchanged from r1 |
| `tools/maker/stage.ts` | M | 3 / 2 | 5 (L143) | yes. sits on the cap |
| `tools/maker/rooms.ts` | M | 3 / 2 | 5 (L144) | yes. sits on the cap |
| `tools/baseline/checkpoint.ts` | M | 8 / 0 | 9 (L145) | yes. 8 |
| `fixtures/shop-stairs/project.json` | A | 1 / 0 | 3 for the folder (L146) | yes |
| `fixtures/shop-stairs/stages/stage_01JDES00000000000000000001.json` | A | 1 / 0 | (same 3) | yes |
| `fixtures/shop-stairs/stages/stage_01JDES00000000000000000002.json` | A | 1 / 0 | (same 3) | yes. the three files sit on the folder cap |
| `tests/tools/stage-links.test.ts` | M | 5 / 5 | 11 (L147) | yes. 10 (the `arriveIn` call sites only) |
| `tests/tools/autosave-links.test.ts` | A | 91 / 0 | 103 (L148) | yes |
| `handoff/steps/tests/s8-autosave-links/smoke.mjs` | A | 44 / 0 | 55 (L152) | no (own cap, outside the 400) |

No diff under `src/core`, `data/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`. In `src/sim`, only the required `session-save` registry key in `src/sim/migrations/save/index.ts`. In `fixtures/`, only the new `shop-stairs/` folder. `src/types/core-types.ts` changes only by DSK's staged diff. Existing tests and frozen smokes are unedited except the pin line in `tests/smoke.test.ts`, the trusted-saves key and literals, and the `arriveIn` call sites in `tests/tools/stage-links.test.ts`. `tests/project/load/one-parser.test.ts` and `tests/tools/baseline-page.test.ts` have zero diff (HB1:42, V2, QA2:19). 8b files (`tools/baseline/page.ts`, `tools/baseline/readout.ts`, and named test 6) are absent. Official G7 at the r2 code head or r2 tip against `9f7f7e52`, and at the merge against first parent `5034dd7a`, is **29 files changed, 294 insertions(+), 62 deletions(-)** = 356 ≤ 400 (r1 was 292+63 = 355). Every per-file cap is kept. Caps sum 398 (guide L155) is not a second gate. No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base.

## (c) Key code and git commands

Step 8a adds the D28 session save at an autosave link, the project session-start field, and the party hp / bar carry across a link (guide L7–8, L26, Rules 1–6). It does not add the stair phone baseline (`tools/baseline/page.ts`, `readout.ts`, named test 6); that is 8b (guide L9, L149–151, L204–208).

**CN.** Apply `data/staging/cn-session/cn-session.diff` (sha256 `74fb9ff438163b6b31026977201f1b07c32094726d48798d7ce0ff331737b0a7`, already on the base, +6 lines) to `src/types/core-types.ts` byte for byte. The base file is sha256 `fd27de06c035ab8c3767a31ad0cf2bf75fa74ca200487a6e2ea762f2d90e747d` (the step 7 CN result). The result must be `439f403d03b8c61ff679a51939c5834fc898f3b32c0c9ee6de7f59d3b5f247b5` (guide L77, HB1:68, V1). The staging folder also holds `core-types.fd27de06.ts` and `core-types.staged.ts` (blob `e75b1589`, the same blob as the merged `core-types.ts`). The diff adds `CoreLink.autosave?` (`core-types.ts:167`), `CoreProject.session?: { start: string }` (`:240`), and `SessionSave` plus `SessionParty` after `MatchSave` (`:324-327`). No formatVersion bump: tile-project stays 6, stage stays 2. Then move the pin in `tests/smoke.test.ts` L14 from `fd27de06…` to `439f403d…` (that one line only):

```ts
  assert.equal(sha, "439f403d03b8c61ff679a51939c5834fc898f3b32c0c9ee6de7f59d3b5f247b5");
```

`src/project/read/session.ts` and `tools/maker/session.ts` import `SessionSave` / `SessionParty` and never redefine them. `src/sim/migrations/save/index.ts` is the one chain home: `SaveKind` and `SAVE_MIGRATIONS` gain `"session-save"` with an empty chain at v1 (`:2-5`). `SESSION_FORMAT` is typed `SessionSave["formatVersion"]` and is 1 (`session.ts:4`).

**Session reader and the slot.** `readSession` (`session.ts:22-31`) accepts v1 only. Newer is `saveFormatNewer`; older is `saveFormatOlder` with `needsMigration: true`; a bad shape is `invalidValue`; `header.projectId` ≠ the slot's project is `invalidValue` with detail `projectId`. A `projectHash` or `engineVersion` difference is a notice (`saveProjectMismatch` / `saveEngineMismatch`), not a refusal. `settleSession` (`:33-37`) drops a missing `to`, `from`, or member `unitId` with `saveRefDropped` (message = that id): a missing `to` resumes at the session start; a missing `from` becomes `null`; missing members are filtered out. `readAutosave` (`tools/maker/session.ts:9-14`) reads `tileengine/saves/<projectId>/autosave.json`, runs `migrateSave("session-save", …)` first when `formatVersion` is older, maps a throw or a bad result to `saveMigrationFailed`, and has no `catch` on the slot read. `writeAutosave` (`:16-22`) builds the doc, runs `readSession` on it before any write, and if a prior file exists and `readAutosave` refuses it, returns `Autosave skipped:` + `keptLine` and does not overwrite. A link taken in a contest does not write: `autosaves(link, contest)` is `link.autosave === true && !contest` (`links.ts:18`), and `linkEvent` carries that flag (`:19`).

**Party carry and arrival.** New `src/rules/session/party.ts` holds `partyOf` (no hp default: missing hp throws `partyOf: no hp`, `:8`; dead units and a second living copy of the same `unitId` are skipped) and `carryInto` (hp map plus optional `LevelSetup.start` from the bar, `:12-15`). `match.party()` (`match.ts:122`) throws `play: party needs rules` when `rules` is null (no `?? []`) and is called **before** `stop()` on travel (`page.ts:82`: `const party = match.party(); stop(); travel(link, party)`). `startMatch`'s `travel` is `(link, party) => void` (`page.ts:17`).

`arriveIn` (`project.ts:96-107`) throws `play: stage id` when `fromId === ""` (`:97`; the same throw is at `match.ts:81` when the landed stage has no string id). It computes free cells from the target map (occupied by neutrals and the enemy pool, plus `grid.isOpen`; a null grid makes every cell not free, `:102-104`), calls `arrival(..., party.members.length, free)`, keeps a spawn's facing only when that same cell already had one, sets `chosen` from the carried members, and installs `carry` / `levels.start`. When `fromId` is `null` (a dropped `from`), it passes `"\u0000"` so there is no back link and arrival falls back to `playerSpawns` (`:104`).

`arrival` (`links.ts:9-16`) still prefers the target's first link back to the source, then fills the nearest free cells N E S W. The r2 body at `:15` continues before queueing any neighbour `free` refuses (`!free(n)`), so walls, taken cells and off-map cells are not walked. A 512 Manhattan bound remains for a `free` that is true everywhere. Named test 2 is unchanged: `free4` expects `(2,2) (3,2) (2,3)`; the shop hero lands on `(0,4)` and the raider on `(1,3)`, with the rival still on the stairs at `(1,4)` (`autosave-links.test.ts:31-35`, QA2:13, V2).

**Maker: start, toggle, banners, Continue.** `readManifest` accepts `project.session?: { start }` or rejects `bad("session")` (`manifest.ts:30-33`). `read-project.ts:28` adds a `brokenRef` at `project.json#/project/session/start` when `start` names no stage. `startOf` / `setStart` live in `src/editor/stage/rooms.ts` (`:50-53`); `setStart` writes the field even when it equals `stages[0]`. `deleteStage` refuses with `The game starts here. Pick another start first.` when `startOf(files) === stageId` (`:44`), before the existing link check. The rooms sheet has `Game starts here` (`tools/maker/rooms.ts:74,109`). `setAutosave` writes `autosave: true` or drops the key, never `false` (`src/editor/stage/links.ts:12`). `readStage`'s `links()` keeps `autosave` only when it is `true` (`stage.ts:41`). The stage sheet shows `Autosave here: On/Off` (`tools/maker/stage.ts:152,243`).

`home.ts:79` names a dropped ref by kind on the same line: `dropped the stage it was going to <id>`, `dropped the stage it came from <id>`, or `dropped unitId <id>`, by comparing `n.message` to `held.to` / `held.from`. `home.ts` stays 164 lines (21 against cap 28). `test-launch.ts` L4–8 are one import per line (r2); `isObj` is gone and `rec()` is inlined in `resumed()` (`:24-25`). The file sits on cap 19 (13+6).

The eight named tests, closed on their last line, all in `tests/tools/autosave-links.test.ts` (V2, QA2:19, guide L159; test 6 is 8b and is absent):

```ts
test("step 8 party: hp and the side bar cross a link, capped at max; dead members and second copies stay behind; a kept offer is open again", () => {
```

```ts
test("step 8 occupied arrival: taken or closed cells are skipped and the party fills the nearest free cells, N E S W", () => {
```

```ts
test("step 8 autosave: only an autosave link outside a battle saves; the session save round-trips; nothing is written over a refused or unreadable file, or for a party the reader refuses", async () => {
```

```ts
test("step 8 session start: read and checked, a new game starts there, and the start stage can't be deleted", () => {
```

```ts
test("step 8 link sheet: autosave on writes true, off drops the key, and readStage keeps it", () => {
```

```ts
test("step 8 link event: a stage with no string id throws instead of sending an empty from", () => {
```

```ts
test("step 8 link rebuild with the party carry and the autosave write fits the step 7 budget", async () => {
```

```ts
test("step 8 session save (D28): v1 only, migrated first by migrateSave, mismatches are notices, bad parties refused, dangling refs dropped", async () => {
```

They run at `:20-29`, `:31-35`, `:37-49`, `:51-58`, `:60-65`, `:67-70`, `:72-75` and `:77-91`. Test 8 drops the first 5 of 25 runs and asserts the even-count median is `< 4` ms. HB2 prints 1.30 ms on Node v22.23.3; CoS verify measured 0.76 ms on Node v24.22.1 (V2); QA's own green printed **0.89 ms** (QA2:13). All are under 4. r1's printed medians were 1.41 ms (HB1:68) and 0.91 ms (QA1:16).

The s8 smoke (`handoff/steps/tests/s8-autosave-links/smoke.mjs`, 44 lines, port 8810, fourth arg `r2` for the r2 shots folder) does a dev maker `build()` into a temp dir and serves it. Widths 390 and 360. Every wait is `waitForFunction`; `waitForTimeout` count is 0, and there is no init script (QA1:19). Checks 1–8 at both widths (16 ok) then `SMOKE PASS` (HB2, V2, QA2:22). Shots go to the hand-back folder at 390; r2 did not retake them.

S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, identical on the base, the r1 and r2 code heads, the tips and the merge (V2, QA2:22). Play-stage files change, so S0 on 8797 is required: 14 ok lines and `TOUCH SMOKE PASS`.

Export audit on the clean code head, counted on the play-stage tree, the baseline tree, and the maker build's `play-stage/` directory directly (not a loose path filter that also counts `maker/<stamp>/tools/play-stage/*.js`): **131 / 145 / 131**, empty hit list, `AUDIT PASS` (V1, V2). QA's `s8-audit.mjs` run also reports `AUDIT PASS`, with the maker play tree as 142 because of that loose filter (QA1:20, QA2:22). No audit or repro script was committed.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts:85` twice). The home.ts pair is the pre-existing `behaviourId` errors, at L85 on r1 and r2 (the file is 7 lines longer than the step 7 157-line file). No new error (HB2:42, V2, QA2:20). Leave them.

The official count command (guide L154):

```
# Product gate. The first parent of the merge is 5034dd7a, the r1 QA
# review, not the product base 9f7f7e52. Official command at the r2
# code head or r2 tip against 9f7f7e52, or at the merge against
# 5034dd7a:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' \
#     ':!handoff/steps/tests/s8-autosave-links/**'
#   29 files changed, 294 insertions(+), 62 deletions(-)
#
# The same 356 at the merge against 5034dd7a. Against 9f7f7e52 at the
# merge, the official command also counts docs/qa/step-08a-r1-review.md
# (30 files, 377 insertions, 62 deletions). That file is not this step.
# Adding ':!docs/**' at the merge against 9f7f7e52 gives the official 356.
# At 10ca0b0a (current main, which also adds the r2 review) against
# 9f7f7e52, the official command without ':!docs/**' is 31 files, 408 insertions,
# 62 deletions. Adding ':!docs/**' again gives 356.
#
# r1 was 29 files, 292 insertions, 63 deletions = 355, against 9f7f7e52.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# CN: base core-types.ts sha256 fd27de06…, staged diff 74fb9ff4…,
#     applied result and pin 439f403d….
#
# Named tests (npm test 1122/0, floor 1114 + N=8):
#   ✔ step 8 party: hp and the side bar cross a link, capped at max; dead members and second copies stay behind; a kept offer is open again
#   ✔ step 8 occupied arrival: taken or closed cells are skipped and the party fills the nearest free cells, N E S W
#   ✔ step 8 autosave: only an autosave link outside a battle saves; the session save round-trips; nothing is written over a refused or unreadable file, or for a party the reader refuses
#   ✔ step 8 session start: read and checked, a new game starts there, and the start stage can't be deleted
#   ✔ step 8 link sheet: autosave on writes true, off drops the key, and readStage keeps it
#   ✔ step 8 link event: a stage with no string id throws instead of sending an empty from
#   ✔ step 8 link rebuild with the party carry and the autosave write fits the step 7 budget
#   ✔ step 8 session save (D28): v1 only, migrated first by migrateSave, mismatches are notices, bad parties refused, dangling refs dropped
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s8 (8810 r2):
#     8 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# `wc -l handoff/steps/tests/s8-autosave-links/smoke.mjs` is 44.
# Export audit as above; direct counts 131 / 145 / 131, empty hit list.
```

## (d) What went wrong, in order, and the fix

**r1.** The session save, start field and party carry shipped in one feat commit and green was 1122/0. The official gate was 355, with every per-file cap kept (core-types 6/6, the pin 2/2, the stage reader 2/2, read-project 1/1, the session reader 38/38, trusted-saves 10/10, levels 12/12, level types 3/3, play-stage page 5/5, project.ts 29/29, maker stage 5/5, maker rooms 5/5, and shop-stairs 3/3 sit on their caps; test-launch was 18/19). s8 passed 16 ok and S0 passed 14 ok. The export audit was clean on a direct count. The tip holds only `HANDBACK.md` and the four 390 shots. CoS verify of r1 was PASS, with no must-fix found at that pass (V1). The predicted r1 merge tree against then-main (still the product base) was the tip tree `d8a232b9`.

QA **NOT OK** (QA1:3), three must-fixes:

1. **Arrival flood (Law 13).** `arrival()` pushed every neighbour into the queue until Manhattan 512. When fewer free cells existed than `size` (or when `grid` was null, so `free` was false everywhere), it walked the whole diamond, about 525k cells (QA1:28–30). QA's repro, kept outside the tree: A 309 ms with about 50–100 MB of heap churn; B (shop downstairs open only at 0,4 and 1,4, a raider on the stairs, party of 2) 358 ms; C (stock shop) 1.1 ms (QA1:33–35). The step 7 budget is under 4 ms. **Fix, r2:** queue a neighbour only if `free` accepts it (`links.ts:15`). N E S W order kept. Test 2's expected cells unchanged and still passing. QA's own rerun: A **0.1–0.2 ms** (r1: 309 ms). The B first-shot (4.1–4.5 ms) is a cold `arriveIn` start, not the old walk: with C run first, C takes 4.5 ms and B then takes 1.0 ms (QA2:13). CoS warmed 21-run medians: A 0.004 ms, B 0.532 ms, C 0.372 ms (V2). Builder medians: A 0.003 ms, B 0.901 ms, C 0.715 ms (HB2). The 512 bound remains for a `free` that is true everywhere.

2. **`test-launch.ts` joined imports (guide L157).** r1 L4 put five imports on one line so the file could sit at 18/19. Split the same way, it was 22 lines against a cap of 19. The guide says not to join lines to fit a cap; going over is stop-and-report (QA1:56–59). **Fix, r2:** one import per line at L4–8; the second `isObj` is gone (`rec` is inlined in `resumed`). Numstat 13/6 = 19/19, no joins in the three must-fix files (QA2:14, V2).

3. **Resume banner called a dropped stage a `unitId`.** r1 `home.ts:79` printed every `saveRefDropped` as `dropped unitId ${n.message}`. The reader also raises that code for a missing `to` or `from`, so a deleted stage showed `Continued. Since the save: dropped unitId stage_…` (QA1:63–65). **Fix, r2:** the same line now names the stage it was going to, the stage it came from, or the unit (QA2:15, V2). Same `home.ts` line count (164). Test 9 still passes and was not edited.

r2 was built on the r1 tip, so `3d3d2539..4f662831` also contains the r1 hand-back folder; the product fix itself is only those three files (V2). Shots were not retaken. QA **OK TO MERGE** (QA2:3). The merge tree is `21964006`, as predicted (QA2:9, V2). PR #95 was closed unmerged; PR #96 merged r2.

HB1:3 and HB2:4 said `PR: none yet from the branch.`, which was true at each hand-back and at each CoS verify (V1, V2). No PR existed until after the r2 hand-back. PR #96 was opened later.

## (e) Do it right first time

- Start from the product base `9f7f7e52`. Do not start from `5034dd7a`, `a0c1dad2` or `10ca0b0a`, because the first already has the r1 review and the last two already contain the 8a merge. The floor at the start of 8a was 1114 + N; this merge leaves the floor at 1122. 8b starts on 8a's merge, at 1122 + 1.
- Apply the staged CN `data/staging/cn-session/cn-session.diff` (sha256 `74fb9ff4…`) to `src/types/core-types.ts` (sha256 `fd27de06…`) byte for byte. The result must be `439f403d…`. Move only `tests/smoke.test.ts` L14. Do not bump `formatVersion`. Do not edit `one-parser.test.ts` or `baseline-page.test.ts`. Do not edit `src/core`, `data/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`. In `src/sim`, only the `session-save` registry key. In `fixtures/`, only `shop-stairs/`. Do not add 8b's `page.ts`, `readout.ts`, or named test 6.
- `SessionSave` / `SessionParty` live in `core-types.ts` only. The reader and `tools/maker/session.ts` import them and never redefine them. One chain home: `src/sim/migrations/save/index.ts`. `migrateSave` runs first on an older file; the reader itself reads v1 only. No `catch` on the slot read. Check the doc before any write. A refused or unreadable file is never overwritten. A contest writes nothing (Q7). `party()` is read before `stop()`. No `?? []` for hp or rules. A stage with no string id throws `play: stage id`, not `""`.
- Flood arrival only through cells `free` accepts. Keep N E S W order and test 2's expected cells. Do not queue walls, taken cells or off-map cells out to Manhattan 512.
- Per-file caps on this step are hard (guide L156): going over any one cap is stop-and-report, not a quiet overrun. Files may sit on their cap. Caps sum is not a second gate. The smoke cap of 55 is outside the 400. Don't wrap or split lines to dodge a cap, and don't join lines to fit one (guide L157). If 19 cannot be met on `test-launch.ts` without a join, stop and report; do not ship a join.
- The Continue banner must name the dropped kind (the stage it was going to, the stage it came from, or the unit) on the same `home.ts` line count.
- Do not treat the open EA carry (extra party members dropped with no notice when free cells are fewer than the party) as an 8a fix; it is for 8b planning (QA1:72–73, QA2:28). Do not treat the r1 joined imports in `tests/tools/autosave-links.test.ts` L1–7 as an r2 must-fix (QA2:27). Leave the three base tools tsc errors; `home.ts` stays at L85.
- Play-stage files change, so run S0 on 8797 and keep sha256 `d528795e…`, and run the export audit on the direct play-stage / baseline / maker `play-stage/` counts (131 / 145 / 131). New waits are `waitForFunction`, not `waitForTimeout`. Do not commit the audit script or QA's arrival repro.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run in § Smoke. Print test 8's median once in the hand-back, and for r2 also the arrival A/B times. The tip commit should hold `HANDBACK.md` (r2: that file only; the r1 shots stay in the r1 folder) and not raw test logs. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time. Rerun the shots only if the UI changed.
- Measure with the count command (guide L154): `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!handoff/steps/tests/s8-autosave-links/**'`. Count insertions plus deletions (checklist L26, BUILD_GUIDE.md L123). **356** is the accepted number for this step (r1 was 355). On a merge whose first parent is not the product base, measure against that first parent (or at the code head against `9f7f7e52`), and do not treat first-parent or later QA docs as 8a lines.
- The stair phone check is 8b, after 8b merges, and is not the builder's gate (guide L208). Do not pre-warm from this step.

## (f) Rebuild check

From a clean tree at `9f7f7e526bf8655b903c7722c478bfe913d77405` (the product base; the merge's first parent is `5034dd7a`, which already has the r1 review), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files. Apply the CN with the staged diff; do not hand-edit `core-types.ts`.

```
# Product equality vs the merge (current main adds only the r2 QA review;
# the r1 review is already on the merge from the first parent):
#   git diff a0c1dad2 HEAD -- src/types/core-types.ts tests/smoke.test.ts \
#     src/project/read src/project/load/read-project.ts \
#     src/sim/migrations/save/index.ts src/rules/session \
#     src/rules/battle/battle.ts src/rules/levels \
#     src/editor/stage/links.ts src/editor/stage/rooms.ts \
#     tools/play-stage tools/maker/session.ts tools/maker/test-launch.ts \
#     tools/maker/home.ts tools/maker/stage.ts tools/maker/rooms.ts \
#     tools/baseline/checkpoint.ts fixtures/shop-stairs \
#     tests/sim/trusted-saves.test.ts tests/tools/autosave-links.test.ts \
#     tests/tools/stage-links.test.ts handoff/steps/tests/s8-autosave-links
#   (empty)

# Product gate. Official command at the r2 code head or r2 tip against
# 9f7f7e52, or at the merge against first parent 5034dd7a:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' \
#     ':!handoff/steps/tests/s8-autosave-links/**'
#   29 files changed, 294 insertions(+), 62 deletions(-)
#
# The same 356 at the merge against 5034dd7a. Against 9f7f7e52 at the
# merge, the official command also counts docs/qa/step-08a-r1-review.md
# (30 files, 377 insertions, 62 deletions). That file is not this step.
# Adding ':!docs/**' at the merge against 9f7f7e52 gives the official 356.
# At 10ca0b0a (current main) against 9f7f7e52 without ':!docs/**': 31 files, 408
# insertions, 62 deletions. Adding ':!docs/**' again gives 356.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# CN: base core-types.ts sha256 fd27de06…, staged diff 74fb9ff4…,
#     applied result and pin 439f403d….
#
# Named tests (npm test 1122/0, floor 1114 + N=8):
#   ✔ step 8 party: hp and the side bar cross a link, capped at max; dead members and second copies stay behind; a kept offer is open again
#   ✔ step 8 occupied arrival: taken or closed cells are skipped and the party fills the nearest free cells, N E S W
#   ✔ step 8 autosave: only an autosave link outside a battle saves; the session save round-trips; nothing is written over a refused or unreadable file, or for a party the reader refuses
#   ✔ step 8 session start: read and checked, a new game starts there, and the start stage can't be deleted
#   ✔ step 8 link sheet: autosave on writes true, off drops the key, and readStage keeps it
#   ✔ step 8 link event: a stage with no string id throws instead of sending an empty from
#   ✔ step 8 link rebuild with the party carry and the autosave write fits the step 7 budget
#   ✔ step 8 session save (D28): v1 only, migrated first by migrateSave, mismatches are notices, bad parties refused, dangling refs dropped
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s8 (8810 r2):
#     8 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# `wc -l handoff/steps/tests/s8-autosave-links/smoke.mjs` is 44.
# Export audit as above; direct counts 131 / 145 / 131, empty hit list.
```

## QA non-blockers carried forward

- **`tests/tools/autosave-links.test.ts` L1–7 join imports** (from r1, untouched in r2). It is not a cap dodge: split, the file is about 102 against cap 103. House-style note for the next step that touches the file; not worth a second rework round, which the process does not allow (QA2:27, V2).
- **Cold `arriveIn` first-shot.** QA's B first-shot after the r2 fix is 4.1–4.5 ms; with C run first, B is 1.0 ms (QA2:13). The builder saw a first B of 6.6–12.4 ms and a cold stock-shop `arriveIn` of about 6.7 ms (HB2). CoS saw a first B of 6.2 then 4.4 ms (V2). This is module startup, not the old 525k-cell walk. The step 7 budget is a warm median under 4 ms (test 8 drops 5 warmups). Do not treat a cold first B over 4 ms as a product must-fix.
- **Open EA carry for 8b (from r1, still open):** when the stage's free cells number fewer than the party, the extra members are dropped with no notice. In QA's repro B, `chosen` is 2 but there is 1 spawn, and `match.party()` comes back with the hero only, so the next autosave loses the raider for good. The guide says "fills the nearest free cells instead of losing a unit" but is silent on this case. EA should rule on it, for example a notice or refusing the link (QA1:72–73, QA2:28). Do not "fix" it as part of an 8a rebuild.
- **r1 non-blockers still stand** (QA2:29, QA1:75–80): `levels.ts` L64 has unreachable narrowing (`continue`, `: null`, `: []`); `project.ts` L102, a null grid makes every cell not free (`openProject` then fails on the missing map or terrain anyway); `writeAutosave` reads the slot twice; `resumeNotes` is computed at `openId`'s rev (an existing carry).
- **Median 0.76 ms on Node 24 (CoS) vs 1.30 ms in the r2 hand-back (Node 22) vs QA's 0.89 ms.** All are well under the 4 ms assert (QA2:13, V2, HB2). The ok-lines and the assert, not the exact median, are the pin. The same holds for the arrival A/B medians (CoS 0.004 / 0.532, builder 0.003 / 0.901).
- **Export audit 142 vs 131.** QA's `s8-audit.mjs` reports the maker play tree as 142 because a loose path filter also counts `maker/<stamp>/tools/play-stage/*.js`. The direct `play-stage/` count is 131, matching play-stage and the builder (V1, V2, QA1:20, QA2:22). Not a product fail. Do not commit the trial script.
- **HB1:3 and HB2:4 PR lines** were true at each hand-back; PR #96 was opened later. PR #95 was closed unmerged.
- The stair phone check stays gated on CoS after 8b merges (guide L208). Do not pre-warm from this record.

## Blob check

Each file must have exactly this git blob id at `a0c1dad2`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/types/core-types.ts` | `e75b1589605725af6bda5cceb92351731dd1ce51` | 418 |
| `tests/smoke.test.ts` | `c629998e8bcb7bee00a9449faf26ffb1e160bf9d` | 15 |
| `src/project/read/stage.ts` | `c7f9b1621a615ba9efb7eb89dd8023d47069d37d` | 118 |
| `src/project/read/manifest.ts` | `e2fa843fc64425a44acd62b29760408de1d6bb45` | 35 |
| `src/project/load/read-project.ts` | `9bad62fcb46793c538dc1cf761224e5da5bc27f8` | 114 |
| `src/project/read/session.ts` | `dda10d890bbe4d23870328a0ec21a26f600f9dd2` | 38 |
| `src/sim/migrations/save/index.ts` | `c86a09d23113cc48ad49ddb7ba1665c1a605a906` | 15 |
| `tests/sim/trusted-saves.test.ts` | `f0fafec5e85b5a8ed569963e074ff8f380b699d4` | 93 |
| `src/rules/session/links.ts` | `dbd0af9a9f3e6eb58274204bd7b969b19f63d06a` | 19 |
| `src/rules/session/party.ts` | `b8d24dc7d3d94bea0a39eb4a7c6a1718402029d7` | 16 |
| `src/rules/battle/battle.ts` | `f484d3ba4956606c5473dd2aabf43bf764911e42` | 76 |
| `src/rules/levels/levels.ts` | `18ed2f30dbf60245094c4fa2c8bd3f074bacc9d6` | 93 |
| `src/rules/levels/types.ts` | `aa89d613caedddaca426f6b148dc5c4ccc521598` | 27 |
| `src/editor/stage/links.ts` | `01c99b6dabc7d06fc224f8b0979e84de8f9889b0` | 16 |
| `src/editor/stage/rooms.ts` | `92a6523350ce42bfddece603a3fb7a4a372b1d9f` | 57 |
| `tools/play-stage/match.ts` | `00bb726b8c42e9b77ca5158ae7daa07ff21f568e` | 178 |
| `tools/play-stage/page.ts` | `0047c0d9a213b3e056e9345ba0d9a7b3fa9da8ac` | 87 |
| `tools/play-stage/project.ts` | `688f175d1425f30efd97b5c33d8355ea816d381b` | 108 |
| `tools/maker/session.ts` | `0aef781774dfec316459a4ca4902b8c2188034f6` | 23 |
| `tools/maker/test-launch.ts` | `a8a17fa31c28d380a6ac4217006b58a04fc5ef5b` | 52 |
| `tools/maker/home.ts` | `ef8ab1465442f37f112e4edd1551f58545cc9fdb` | 164 |
| `tools/maker/stage.ts` | `d4631d24efe8011ebc5ac1196e53c6b9fba41f81` | 271 |
| `tools/maker/rooms.ts` | `e40e740a905c04506fea77be56358906f51956c9` | 138 |
| `tools/baseline/checkpoint.ts` | `382c8438f75fdde7f7db30b1c37aeb5a2887eb2c` | 22 |
| `fixtures/shop-stairs/project.json` | `13a14ad47011841faca2cd8929b7afae722dcb84` | 1 |
| `fixtures/shop-stairs/stages/stage_01JDES00000000000000000001.json` | `df95e477b80962abf9b4e53295d6a050d6da8c2b` | 1 |
| `fixtures/shop-stairs/stages/stage_01JDES00000000000000000002.json` | `ab2ceaf3a9700d62658fe36b65a4baa089046590` | 1 |
| `tests/tools/stage-links.test.ts` | `1766d5ca3821a80f05ae7e0f02a2ea1f4f1dcfb2` | 105 |
| `tests/tools/autosave-links.test.ts` | `a3c11db575a905dea77636c572ff64c28d4043d4` | 91 |
| `handoff/steps/tests/s8-autosave-links/smoke.mjs` | `010481d6d8d0b01f8d873fc47670aa848ec0d429` | 44 |


## Appendix: full code as merged (step 8a, PR #96)

New files are `git show a0c1dad2:<path>` in full. Edited files are `git diff 9f7f7e52 a0c1dad2 -- <path>`.

### `src/types/core-types.ts` (edited)

```diff
diff --git a/src/types/core-types.ts b/src/types/core-types.ts
index 8e34b6a..e75b158 100644
--- a/src/types/core-types.ts
+++ b/src/types/core-types.ts
@@ -164,6 +164,7 @@ export type CoreLink = {
   readonly type: LinkType;                                                      // MAY-MOVE
   readonly at: Sq;                                                              // MAY-MOVE: cell on this stage's map
   readonly to: string;                                                          // MAY-MOVE: target stage id (brokenRef hard if missing)
+  readonly autosave?: boolean;                                                  // MAY-MOVE (DSK D28): step 8 toggle; absent = off, never written false
 };
 export type CoreStage = VersionGuard<"stage"> & {
   readonly id: string;                                                          // STABLE: stage id
@@ -236,6 +237,7 @@ export type CoreProject = {
   readonly stages: ReadonlyArray<string>;               // STABLE: stage ids, in order
   readonly rules: ReadonlyArray<string>;                // STABLE: project-wide setup ids (≤ 1 per behaviour)
   readonly loadout: CoreLoadout;                        // STABLE
+  readonly session?: { readonly start: string };        // MAY-MOVE (DSK D28): new-game start stage id; absent = stages[0]
 };
 
 export type CoreProjectManifest = VersionGuard<"tile-project"> & {
@@ -319,6 +321,10 @@ export const UI_EVENT_KEYS = { "ui.click": true } as const satisfies
 export type SaveHeader = { readonly projectHash: string; readonly engineVersion: string; readonly projectId: string; readonly savedAt: string };
 /** `match-save` v1 (project-format §6.9.1, CN-009): the log is the truth, the snapshot a check value. MAY-MOVE. */
 export type MatchSave = { readonly kind: "match-save"; readonly formatVersion: 1; readonly header: SaveHeader; readonly log: string; readonly snapshot: unknown };
+/** `session-save` v1 (project-format §6.9.2, DSK D28): the safe-point save at a link (no sim snapshot, no log). MAY-MOVE. */
+export type SessionSave = { readonly kind: "session-save"; readonly formatVersion: 1; readonly header: SaveHeader; readonly from: string; readonly to: string; readonly party: SessionParty };
+/** The carried party: living members, each unitId once, in spawn order (hp ≥ 1); the side's level bar minus its id, or null. MAY-MOVE. */
+export type SessionParty = { readonly side: SideId; readonly members: ReadonlyArray<{ readonly unitId: UnitId; readonly hp: number }>; readonly bar: { readonly xp: number; readonly level: number; readonly banked: number; readonly offer: ReadonlyArray<string> | null; readonly abilities: ReadonlyArray<string> } | null };
 
 // ================================================================ EFFECTS V2 TYPES (effect documents; render only)
 // Post-H2 batch CN-E1–E5 (setup-format r26 §2.10.1.9, §2.10.2.12, §2.10.3.4–5; CN-014, CN-015, CN-017). Additive only.
```

### `tests/smoke.test.ts` (edited)

```diff
diff --git a/tests/smoke.test.ts b/tests/smoke.test.ts
index 7e879b1..c629998 100644
--- a/tests/smoke.test.ts
+++ b/tests/smoke.test.ts
@@ -11,5 +11,5 @@ test("smoke: engine root exports name and version", () => {
 
 test("smoke: core-types.ts is the pinned DSK copy", () => {
   const sha = createHash("sha256").update(readFileSync("src/types/core-types.ts")).digest("hex");
-  assert.equal(sha, "fd27de06c035ab8c3767a31ad0cf2bf75fa74ca200487a6e2ea762f2d90e747d");
+  assert.equal(sha, "439f403d03b8c61ff679a51939c5834fc898f3b32c0c9ee6de7f59d3b5f247b5");
 });
```

### `src/project/read/stage.ts` (edited)

```diff
diff --git a/src/project/read/stage.ts b/src/project/read/stage.ts
index 3ab2d89..c7f9b16 100644
--- a/src/project/read/stage.ts
+++ b/src/project/read/stage.ts
@@ -38,7 +38,7 @@ function links(v: unknown): CoreLink[] | undefined | null {
   if (v === undefined) return undefined;
   if (!Array.isArray(v)) return null;
   const out: CoreLink[] = [];
-  for (const x of v) { if (!isObj(x) || (x.type !== "stairs" && x.type !== "door" && x.type !== "gate") || !isStr(x.to)) return null; const at = cell(x.at); if (at === null) return null; out.push({ type: x.type, at, to: x.to }); }
+  for (const x of v) { if (!isObj(x) || (x.type !== "stairs" && x.type !== "door" && x.type !== "gate") || !isStr(x.to) || (x.autosave !== undefined && typeof x.autosave !== "boolean")) return null; const at = cell(x.at); if (at === null) return null; out.push({ type: x.type, at, to: x.to, ...(x.autosave === true ? { autosave: true } : {}) }); }
   return out;
 }
 function pool(v: unknown): CoreEnemyPool | null {
```

### `src/project/read/manifest.ts` (edited)

```diff
diff --git a/src/project/read/manifest.ts b/src/project/read/manifest.ts
index 3fce861..e2fa843 100644
--- a/src/project/read/manifest.ts
+++ b/src/project/read/manifest.ts
@@ -27,7 +27,9 @@ function readManifestDoc(json: unknown, lim: DocLimits): ReadResult<CoreProjectM
   const got = loadout(p.loadout); const stages = strs(p.stages); const rules = strs(p.rules);
   const settings = p.settings; const occ = isObj(settings) ? occupancy(settings.occupancy) : null;
   if (!isStr(p.id) || !isInt(p.rev, 0) || !isInt(p.catalogueRev, 0) || !isObj(settings) || typeof settings.wrapEdges !== "boolean" || occ === null || stages === null || rules === null || got === null) return bad("project");
+  const session = p.session === undefined ? undefined : isObj(p.session) && isStr(p.session.start) ? { start: p.session.start } : null;
+  if (session === null) return bad("session");
   const base = { wrapEdges: settings.wrapEdges };
-  const project = { id: p.id, rev: p.rev, catalogueRev: p.catalogueRev, settings: occ === undefined ? base : { ...base, occupancy: occ }, stages, rules, loadout: got };
+  const project = { id: p.id, rev: p.rev, catalogueRev: p.catalogueRev, settings: occ === undefined ? base : { ...base, occupancy: occ }, stages, rules, loadout: got, ...(session === undefined ? {} : { session }) };
   return fitted({ kind: "tile-project", formatVersion: CURRENT_FORMAT_VERSIONS["tile-project"], project }, lim, []);
 }
```

### `src/project/load/read-project.ts` (edited)

```diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index d7af3c3..9bad62f 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -25,6 +25,7 @@ function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonl
   const gear = isObj(project["loadout"]) ? project["loadout"] : {};
   list(project["stages"]).forEach((id, i) => has(stages, id, `project.json#/project/stages/${i}`, rows));
   list(project["rules"]).forEach((id, i) => has(setups, id, `project.json#/project/rules/${i}`, rows));
+  if (isObj(project["session"])) has(stages, project["session"]["start"], "project.json#/project/session/start", rows);
   list(gear["roster"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/roster/${i}`, rows));
   list(gear["required"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/required/${i}`, rows));
   for (const [id, stage] of Object.entries(stages)) {
```

### `src/project/read/session.ts` (new)

```ts
import type { Notice } from "../../core/notice.ts";
import type { SaveHeader, SessionParty, SessionSave } from "../../types/core-types.ts";
import { isInt, isObj, isStr } from "./guard.ts";
export const SESSION_FORMAT: SessionSave["formatVersion"] = 1;
const note = (code: string, message: string): Notice => ({ code, message });
const whole = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n >= 0;
const no = (code: "saveFormatNewer" | "saveFormatOlder" | "saveMigrationFailed" | "invalidValue", needsMigration: boolean, detail?: string) => detail === undefined ? { ok: false as const, code, needsMigration } : { ok: false as const, code, detail, needsMigration };
export type SessionRefusal = ReturnType<typeof no>;
export type SessionRead = { readonly ok: true; readonly save: SessionSave; readonly notes: readonly Notice[] } | SessionRefusal;
export function sessionVersion(doc: unknown): number | null { return isObj(doc) && isInt(doc["formatVersion"]) ? doc["formatVersion"] : null; }
export function sessionSave(header: SaveHeader, from: string, to: string, party: SessionParty): SessionSave { return { kind: "session-save", formatVersion: SESSION_FORMAT, header, from, to, party }; }
function readParty(v: unknown): SessionParty | SessionRefusal {
  if (!isObj(v) || !isStr(v["side"]) || !Array.isArray(v["members"])) return no("invalidValue", false, "party");
  const seen = new Set<string>(), members: { unitId: string; hp: number }[] = [];
  for (const m of v["members"]) { const id = isObj(m) ? m["unitId"] : undefined, hp = isObj(m) ? m["hp"] : undefined; if (!isStr(id) || typeof hp !== "number" || !Number.isInteger(hp) || hp < 1 || seen.has(id)) return no("invalidValue", false, "members"); seen.add(id); members.push({ unitId: id, hp }); }
  if (members.length < 1) return no("invalidValue", false, "members");
  const b = v["bar"]; if (b === null) return { side: v["side"], members, bar: null };
  if (!isObj(b) || !whole(b["xp"]) || !whole(b["level"]) || !whole(b["banked"]) || !(b["offer"] === null || (Array.isArray(b["offer"]) && b["offer"].every((a) => typeof a === "string"))) || !Array.isArray(b["abilities"]) || !b["abilities"].every((a) => typeof a === "string")) return no("invalidValue", false, "bar");
  const offer = b["offer"] === null ? null : b["offer"].filter((a): a is string => typeof a === "string"), abilities = b["abilities"].filter((a): a is string => typeof a === "string");
  return { side: v["side"], members, bar: { xp: b["xp"], level: b["level"], banked: b["banked"], offer, abilities } };
}
export function readSession(doc: unknown, want: { readonly projectId: string; readonly projectHash: string; readonly engineVersion: string }): SessionRead {
  if (!isObj(doc) || doc["kind"] !== "session-save" || !isInt(doc["formatVersion"])) return no("invalidValue", false);
  if (doc["formatVersion"] > SESSION_FORMAT) return no("saveFormatNewer", false);
  if (doc["formatVersion"] < SESSION_FORMAT) return no("saveFormatOlder", true);
  const header = doc["header"], hash = isObj(header) ? header["projectHash"] : undefined, engine = isObj(header) ? header["engineVersion"] : undefined, projectId = isObj(header) ? header["projectId"] : undefined, savedAt = isObj(header) ? header["savedAt"] : undefined;
  if (!isStr(hash) || !isStr(engine) || !isStr(projectId) || !isStr(savedAt) || !isStr(doc["from"]) || !isStr(doc["to"])) return no("invalidValue", false);
  if (projectId !== want.projectId) return no("invalidValue", false, "projectId");
  const party = readParty(doc["party"]); if ("ok" in party) return party;
  const notes: Notice[] = []; if (hash !== want.projectHash) notes.push(note("saveProjectMismatch", "saveProjectMismatch")); if (engine !== want.engineVersion) notes.push(note("saveEngineMismatch", "saveEngineMismatch"));
  return { ok: true, save: { kind: "session-save", formatVersion: 1, header: { projectHash: hash, engineVersion: engine, projectId, savedAt }, from: doc["from"], to: doc["to"], party }, notes };
}
export function settleSession(save: SessionSave, stageIds: readonly string[], unitIds: readonly string[], start: string): { readonly from: string | null; readonly to: string; readonly party: SessionParty; readonly notes: readonly Notice[] } {
  const notes: Notice[] = [], stages = new Set(stageIds), units = new Set(unitIds), members = save.party.members.filter((m) => units.has(m.unitId));
  if (!stages.has(save.to)) notes.push(note("saveRefDropped", save.to)); if (!stages.has(save.from)) notes.push(note("saveRefDropped", save.from));
  for (const m of save.party.members) if (!units.has(m.unitId)) notes.push(note("saveRefDropped", m.unitId));
  return { from: stages.has(save.from) ? save.from : null, to: stages.has(save.to) ? save.to : start, party: { side: save.party.side, members, bar: save.party.bar }, notes };
}
```

### `src/sim/migrations/save/index.ts` (edited)

```diff
diff --git a/src/sim/migrations/save/index.ts b/src/sim/migrations/save/index.ts
index e5c516b..c86a09d 100644
--- a/src/sim/migrations/save/index.ts
+++ b/src/sim/migrations/save/index.ts
@@ -1,8 +1,9 @@
 export type SaveStep = (doc: Readonly<Record<string, unknown>>) => Readonly<Record<string, unknown>>;
-export type SaveChains = Readonly<Record<"save" | "match-save", Readonly<Record<number, SaveStep>>>>;
+export type SaveKind = "save" | "match-save" | "session-save";
+export type SaveChains = Readonly<Record<SaveKind, Readonly<Record<number, SaveStep>>>>;
 export const SAVE_FORMAT = 1;
-export const SAVE_MIGRATIONS: SaveChains = Object.freeze({ save: Object.freeze({}), "match-save": Object.freeze({}) });
-export function migrateSave(kind: "save" | "match-save", doc: Readonly<Record<string, unknown>>, from: number, to = SAVE_FORMAT, chains: SaveChains = SAVE_MIGRATIONS): Readonly<Record<string, unknown>> | null {
+export const SAVE_MIGRATIONS: SaveChains = Object.freeze({ save: Object.freeze({}), "match-save": Object.freeze({}), "session-save": Object.freeze({}) });
+export function migrateSave(kind: SaveKind, doc: Readonly<Record<string, unknown>>, from: number, to = SAVE_FORMAT, chains: SaveChains = SAVE_MIGRATIONS): Readonly<Record<string, unknown>> | null {
   let cur = doc; const steps = chains[kind];
   for (let v = from; v < to; v += 1) {
     const step = steps[v]; if (step === undefined) return null;
```

### `tests/sim/trusted-saves.test.ts` (edited)

```diff
diff --git a/tests/sim/trusted-saves.test.ts b/tests/sim/trusted-saves.test.ts
index d150613..f0fafec 100644
--- a/tests/sim/trusted-saves.test.ts
+++ b/tests/sim/trusted-saves.test.ts
@@ -33,18 +33,18 @@ test("save opt-ins (step 24)", () => {
   assert.equal(code(text, { ...src, engineVersion: "9" }, { allowProjectMismatch: true }) === "saveEngineMismatch-" && code(text, { ...src, projectHash: "other" }, { allowEngineMismatch: true }) === "saveProjectMismatch-", true);
 });
 test("save migrations path (step 24)", () => {
-  assert.deepEqual(Object.keys(SAVE_MIGRATIONS).sort(), ["match-save", "save"]);
-  assert.equal(Object.keys(SAVE_MIGRATIONS.save).length + Object.keys(SAVE_MIGRATIONS["match-save"]).length === 0, true);
+  assert.deepEqual(Object.keys(SAVE_MIGRATIONS).sort(), ["match-save", "save", "session-save"]);
+  assert.equal(Object.keys(SAVE_MIGRATIONS.save).length + Object.keys(SAVE_MIGRATIONS["match-save"]).length + Object.keys(SAVE_MIGRATIONS["session-save"]).length === 0, true);
   const { text } = play(); const old = (n: number): string => patch(text, (s) => { s.formatVersion = n; });
   assert.equal(code(old(0)) === "saveFormatOlder+" && code(old(-3)) === "saveFormatOlder+", true);
   const s = { kind: "match-save" as const, formatVersion: 1 as const };
-  const chains: SaveChains = { save: { 0: () => ({ kind: "save", formatVersion: 1 }) }, "match-save": { 0: () => ({ kind: "match-save", formatVersion: 1 }) } };
+  const chains: SaveChains = { save: { 0: () => ({ kind: "save", formatVersion: 1 }) }, "match-save": { 0: () => ({ kind: "match-save", formatVersion: 1 }) }, "session-save": {} };
   assert.equal(migrateSave("match-save", s, 0) === null && migrateSave("match-save", s, 1) === s && (migrateSave("save", s, 0, 1, chains) as { kind: string }).kind === "save" && (migrateSave("match-save", s, 0, 1, chains) as { kind: string }).kind === "match-save", true);
   assert.equal(code(text) === "ok" && code(old(2)) === "saveFormatNewer-" && code(text, { ...input("stage-fixed"), projectHash: "x" }) === "saveProjectMismatch-", true);
 });
 test("the migrations hook is contained (step 24)", () => {
   const { src, world, text } = play(); const body = patch(text, (s) => { s.formatVersion = 0; });
-  const reg = (step: SaveChains["match-save"][number]): SaveChains => ({ save: {}, "match-save": { 0: step } });
+  const reg = (step: SaveChains["match-save"][number]): SaveChains => ({ save: {}, "match-save": { 0: step }, "session-save": {} });
   const failed = (step: SaveChains["match-save"][number]): boolean => code(body, src, undefined, reg(step)) === "saveMigrationFailed+";
   const trap = (): Record<string, unknown> => { const o: Record<string, unknown> = { kind: "match-save", formatVersion: 1 }; Object.defineProperty(o, "log", { enumerable: true, get() { throw new Error("g"); } }); return o; };
   assert.equal(failed(() => { throw new Error("x"); }) && failed(() => new Proxy({}, { get() { throw new Error("x"); } }) as never) && failed(trap), true);
@@ -52,7 +52,7 @@ test("the migrations hook is contained (step 24)", () => {
   assert.equal([() => 5, () => null, () => "s", () => [], () => (() => undefined), () => ({ kind: "match-save", formatVersion: 1, map: new Map() })].every((fn) => failed(fn as never)), true);
   const honest = loadSave(src, body, undefined, reg(() => JSON.parse(text) as Record<string, unknown>));
   assert.equal(honest.ok && shot(honest.world) === shot(world), true);
-  assert.equal(code(body, src, undefined, { save: { 0: () => JSON.parse(text) as Record<string, unknown> }, "match-save": {} }) === "saveFormatOlder+", true);
+  assert.equal(code(body, src, undefined, { save: { 0: () => JSON.parse(text) as Record<string, unknown> }, "match-save": {}, "session-save": {} }) === "saveFormatOlder+", true);
 });
 test("tamper reach (step 24)", () => {
   const { src, text } = play();
```

### `src/rules/session/links.ts` (edited)

```diff
diff --git a/src/rules/session/links.ts b/src/rules/session/links.ts
index 63242b9..dbd0af9 100644
--- a/src/rules/session/links.ts
+++ b/src/rules/session/links.ts
@@ -1,14 +1,19 @@
 import type { CoreLink, LinkType, Sq } from "../../types/core-types.ts";
 export const LINK_TYPES = ["stairs", "door", "gate"] as const satisfies readonly LinkType[];
-export type LinkEvent = { readonly type: "link"; readonly linkType: LinkType; readonly from: string; readonly to: string; readonly at: Sq };
+export type LinkEvent = { readonly type: "link"; readonly linkType: LinkType; readonly from: string; readonly to: string; readonly at: Sq; readonly autosave: boolean };
 export function linkAt(links: readonly CoreLink[], at: Sq): CoreLink | null {
   return links.find((link) => link.at.c === at.c && link.at.r === at.r) ?? null;
 }
 /** `back` is the target's first link in array order whose `to` is the source stage. */
-export function arrival(targetLinks: readonly CoreLink[], fromStageId: string, spawns: readonly Sq[]): readonly Sq[] {
+const key = (sq: Sq): string => `${sq.c},${sq.r}`;
+export function arrival(targetLinks: readonly CoreLink[], fromStageId: string, spawns: readonly Sq[], size = 0, free: (sq: Sq) => boolean = () => true): readonly Sq[] {
   const back = targetLinks.find((link) => link.to === fromStageId);
-  return back === undefined ? spawns : [back.at, ...spawns.filter((sq) => sq.c !== back.at.c || sq.r !== back.at.r)];
-}
-export function linkEvent(link: CoreLink, from: string): LinkEvent {
-  return { type: "link", linkType: link.type, from, to: link.to, at: link.at };
+  const base = back === undefined ? [...spawns] : [back.at, ...spawns.filter((sq) => sq.c !== back.at.c || sq.r !== back.at.r)];
+  const got = base.filter((sq) => free(sq)); if (size < 1 || got.length >= size) return size < 1 ? got : got.slice(0, size);
+  const origin = base[0]; if (origin === undefined) return got;
+  const seen = new Set(got.map(key)), been = new Set<string>([key(origin)]), q: Sq[] = [origin];
+  while (q.length > 0 && got.length < size) { const cur = q.shift(); if (cur === undefined) break; for (const [dc, dr] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) { const n = { c: cur.c + dc, r: cur.r + dr }, id = key(n); if (been.has(id) || Math.abs(n.c - origin.c) + Math.abs(n.r - origin.r) > 512 || !free(n)) continue; been.add(id); q.push(n); if (!seen.has(id)) { seen.add(id); got.push(n); if (got.length >= size) break; } } }
+  return got;
 }
+export function autosaves(link: CoreLink, contest: boolean): boolean { return link.autosave === true && !contest; }
+export function linkEvent(link: CoreLink, from: string, contest = false): LinkEvent { return { type: "link", linkType: link.type, from, to: link.to, at: link.at, autosave: autosaves(link, contest) }; }
```

### `src/rules/session/party.ts` (new)

```ts
import type { SessionParty } from "../../types/core-types.ts";
import type { LevelSetup } from "../levels/types.ts";
type Body = { readonly unitId: string; readonly side: string; readonly alive: boolean };
type Bar = { readonly id: string; readonly xp: number; readonly level: number; readonly banked: number; readonly offer: readonly string[] | null; readonly abilities: readonly string[] };
export type Party = SessionParty;
export function partyOf(units: readonly Body[], hp: Readonly<Record<string, number>>, side: string, bars: readonly Bar[] | null): Party {
  const seen = new Set<string>(), members: { unitId: string; hp: number }[] = [];
  for (const u of units) { if (!u.alive || u.side !== side || seen.has(u.unitId)) continue; if (!Object.hasOwn(hp, u.unitId)) throw new Error("partyOf: no hp"); const n = hp[u.unitId]; if (n === undefined) throw new Error("partyOf: no hp"); seen.add(u.unitId); members.push({ unitId: u.unitId, hp: n }); }
  const bar = bars === null ? undefined : bars.find((row) => row.id === side);
  return { side, members, bar: bar === undefined ? null : { xp: bar.xp, level: bar.level, banked: bar.banked, offer: bar.offer, abilities: bar.abilities } };
}
export function carryInto(party: Party, side: string): { readonly carry: { readonly side: string; readonly hp: Record<string, number> }; readonly start?: NonNullable<LevelSetup["start"]> } {
  const hp: Record<string, number> = Object.create(null); for (const m of party.members) hp[m.unitId] = m.hp;
  const bar = party.bar;
  return { carry: { side, hp }, ...(bar === null ? {} : { start: [{ id: side, xp: bar.xp, level: bar.level, banked: bar.banked, offer: bar.offer, abilities: bar.abilities }] }) };
}
```

### `src/rules/battle/battle.ts` (edited)

```diff
diff --git a/src/rules/battle/battle.ts b/src/rules/battle/battle.ts
index b694152..f484d3b 100644
--- a/src/rules/battle/battle.ts
+++ b/src/rules/battle/battle.ts
@@ -12,7 +12,7 @@ import type { UnitStats } from "./roster.ts";
 
 export const BATTLE_EVENTS: EventRegistry<NoModeEvents> = { mode: "battle", types: ["hit", "unit.died", "unit.interacted"] };
 export type ShotRow = { readonly reach: number; readonly damage: number; readonly effectRef: string };
-export type BattleSetup = { readonly base: UnitStats; readonly stats: Readonly<Record<string, UnitStats>>; readonly hitClass: HitClass; readonly reach?: ReachTable; readonly abilities?: Readonly<Record<string, readonly ShotRow[]>> };
+export type BattleSetup = { readonly base: UnitStats; readonly stats: Readonly<Record<string, UnitStats>>; readonly hitClass: HitClass; readonly reach?: ReachTable; readonly abilities?: Readonly<Record<string, readonly ShotRow[]>>; readonly carry?: { readonly side: string; readonly hp: Readonly<Record<string, number>> } };
 export type BattleState = { readonly units: readonly { readonly id: string; readonly hp: number; readonly alive: boolean }[] };
 export const HIT_REFUSED_REASONS = Object.freeze(["unknownActor", "deadActor", "notUnitAim", "aimMissed", "selfTarget", "deadTarget"] as const);
 export const HIT_FILTER_REASONS = Object.freeze(["outOfReach", "allyTarget"] as const);
@@ -35,12 +35,14 @@ function taken(setup: BattleSetup): BattleSetup {
   for (const key of Object.keys(statsIn)) { if (!Object.hasOwn(statsIn, key)) continue; const row = statsIn[key]; if (!pair(row)) throw new RangeError("createBattle: bad setup"); stats[key] = { hp: row.hp, atk: row.atk }; }
   if (isRecord(reachIn)) for (const key of Object.keys(reachIn)) { if (!Object.hasOwn(reachIn, key)) continue; const n = reachIn[key]; if (!whole(n, 1)) throw new RangeError("createBattle: bad setup"); reach[key] = n; }
   if (isRecord(abilitiesIn)) for (const key of Object.keys(abilitiesIn)) { if (!Object.hasOwn(abilitiesIn, key)) continue; const list = abilitiesIn[key]; if (!Array.isArray(list)) throw new RangeError("createBattle: bad setup"); const rows: ShotRow[] = []; for (const row of list) { if (!isRecord(row) || !whole(row.reach, 1) || !whole(row.damage, 0) || typeof row.effectRef !== "string") throw new RangeError("createBattle: bad setup"); rows.push({ reach: row.reach, damage: row.damage, effectRef: row.effectRef }); } abilities[key] = rows; }
-  return { base: { hp: copy.base.hp, atk: copy.base.atk }, stats, hitClass: klass as HitClass, ...(isRecord(reachIn) ? { reach } : {}), ...(isRecord(abilitiesIn) ? { abilities } : {}) };
+  const carryIn = copy.carry; let carry: { side: string; hp: Record<string, number> } | undefined;
+  if (carryIn !== undefined) { if (!isRecord(carryIn) || typeof carryIn.side !== "string" || !isRecord(carryIn.hp)) throw new RangeError("createBattle: bad setup"); const hp: Record<string, number> = Object.create(null); for (const key of Object.keys(carryIn.hp)) { if (!Object.hasOwn(carryIn.hp, key)) continue; const n = carryIn.hp[key]; if (!whole(n, 1)) throw new RangeError("createBattle: bad setup"); hp[key] = n; } carry = { side: carryIn.side, hp }; }
+  return { base: { hp: copy.base.hp, atk: copy.base.atk }, stats, hitClass: klass as HitClass, ...(isRecord(reachIn) ? { reach } : {}), ...(isRecord(abilitiesIn) ? { abilities } : {}), ...(carry === undefined ? {} : { carry }) };
 }
 export function createBattle(setup: BattleSetup, units: Units, grid: Grid, emit: (event: BusEvent<NoModeEvents>) => void): Battle {
   const cfg = taken(setup), hp = new Map<string, number>();
   const of = (id: string): UnitStats => (Object.hasOwn(cfg.stats, id) ? cfg.stats[id] : cfg.base) ?? cfg.base;
-  for (const u of units.all()) hp.set(u.id, of(u.unitId).hp);
+  for (const u of units.all()) { const max = of(u.unitId).hp, carried = cfg.carry !== undefined && u.side === cfg.carry.side && Object.hasOwn(cfg.carry.hp, u.unitId) ? cfg.carry.hp[u.unitId] : undefined; hp.set(u.id, carried === undefined ? max : Math.min(carried, max)); }
   const hitNo = (reason: HitRefusedReason | HitFilterReason): HitRefused => ({ code: "hitRefused", message: `hit refused (${reason})`, reason });
   return {
     state: () => ({ units: units.all().flatMap((u) => { const n = hp.get(u.id); return n === undefined ? [] : [{ id: u.id, hp: n, alive: u.alive }]; }) }),
```

### `src/rules/levels/levels.ts` (edited)

```diff
diff --git a/src/rules/levels/levels.ts b/src/rules/levels/levels.ts
index 1867093..18ed2f3 100644
--- a/src/rules/levels/levels.ts
+++ b/src/rules/levels/levels.ts
@@ -13,15 +13,15 @@ function bad(rules: LevelRules, pools: AbilityPools): boolean {
   return (rules.bar !== "side" && rules.bar !== "unit") || top < 1 || !ints(rules.thresholds, 1) || !rules.offerLevels.every((n) => Number.isInteger(n) && n >= 1 && n <= top) || !Number.isInteger(rules.offerSize) || rules.offerSize < 1 || !Number.isInteger(rules.xp.move) || rules.xp.move < 0 || rules.xp.move > 2147483647 || Object.values(pools).some((pool) => !Array.isArray(pool) || pool.some((a) => typeof a !== "string" || a === ""));
 }
 type Live = { id: string; pool: string; xp: number; level: number; banked: number; offer: string[] | null; abilities: string[] };
-function taken(setup: LevelSetup): { rules: LevelRules; pools: AbilityPools; limits: unknown } {
-  const copy = plainCopy(setup, 3);
+function taken(setup: LevelSetup): { rules: LevelRules; pools: AbilityPools; limits: unknown; start: unknown } {
+  const copy = plainCopy(setup, 4);
   if (copy === NOT_PLAIN || !isRecord(copy) || !isRecord(copy.rules) || !isRecord(copy.pools)) throw new RangeError("createLevels: bad rules or pools");
   const rulesIn = copy.rules, poolsIn = copy.pools;
   const bar = rulesIn.bar, thresholds = rulesIn.thresholds, offerLevels = rulesIn.offerLevels, offerSize = rulesIn.offerSize, xpIn = rulesIn.xp;
   if (!Array.isArray(thresholds) || !Array.isArray(offerLevels) || !isRecord(xpIn)) throw new RangeError("createLevels: bad rules or pools");
   const pools: Record<string, readonly string[]> = {}, move = xpIn.move;
   for (const key of Object.keys(poolsIn)) { const pool = poolsIn[key]; if (!Array.isArray(pool)) throw new RangeError("createLevels: bad rules or pools"); pools[key] = pool as readonly string[]; }
-  return { rules: Object.freeze({ bar, thresholds, offerLevels, offerSize, xp: Object.freeze({ move }) }) as LevelRules, pools: Object.freeze(pools), limits: copy.limits };
+  return { rules: Object.freeze({ bar, thresholds, offerLevels, offerSize, xp: Object.freeze({ move }) }) as LevelRules, pools: Object.freeze(pools), limits: copy.limits, start: copy.start };
 }
 function levelLimits(v: unknown): LevelLimits | null {
   const src = v === undefined ? DEFAULT_LEVEL_LIMITS : v; if (!isRecord(src)) return null; const out: Record<string, number> = {};
@@ -33,8 +33,12 @@ function over(rules: LevelRules, pools: AbilityPools, lim: LevelLimits): boolean
 }
 
 export function createLevels(setup: LevelSetup, rng: Rng, emit: (event: BusEvent<NoModeEvents>) => void): Levels {
-  const { rules, pools, limits } = taken(setup); if (bad(rules, pools)) throw new RangeError("createLevels: bad rules or pools"); const lim = levelLimits(limits); if (lim === null) throw new RangeError("createLevels: limits must be whole numbers from 1 to their ceilings"); if (over(rules, pools, lim)) throw new RangeError("createLevels: over the level caps");
+  const { rules, pools, limits, start } = taken(setup); if (bad(rules, pools)) throw new RangeError("createLevels: bad rules or pools");
+  const top = rules.thresholds.length, badStart = !Array.isArray(start) ? start !== undefined : start.some((row) => !isRecord(row) || typeof row.id !== "string" || !Number.isInteger(row.xp) || (row.xp as number) < 0 || !Number.isInteger(row.level) || (row.level as number) < 0 || (row.level as number) > top || !Number.isInteger(row.banked) || (row.banked as number) < 0 || (row.offer !== null && (!Array.isArray(row.offer) || row.offer.some((a) => typeof a !== "string"))) || !Array.isArray(row.abilities) || row.abilities.some((a) => typeof a !== "string"));
+  if (badStart) throw new RangeError("createLevels: bad start");
+  const lim = levelLimits(limits); if (lim === null) throw new RangeError("createLevels: limits must be whole numbers from 1 to their ceilings"); if (over(rules, pools, lim)) throw new RangeError("createLevels: over the level caps");
   const bars = new Map<string, Live>();
+  if (Array.isArray(start)) for (const row of start) { if (!isRecord(row) || typeof row.id !== "string" || typeof row.xp !== "number" || typeof row.level !== "number" || typeof row.banked !== "number") continue; const offer = row.offer === null ? null : Array.isArray(row.offer) ? row.offer.filter((a): a is string => typeof a === "string") : null; const abilities = Array.isArray(row.abilities) ? row.abilities.filter((a): a is string => typeof a === "string") : []; bars.set(row.id, { id: row.id, pool: row.id, xp: row.xp, level: row.level, banked: row.banked, offer, abilities }); }
   const poolOf = (key: string): readonly string[] => (Object.hasOwn(pools, key) ? pools[key] : undefined) ?? [];
   const draw = (have: readonly string[], key: string): string[] => {
     const cands: string[] = [], seen = new Set<string>(have);
```

### `src/rules/levels/types.ts` (edited)

```diff
diff --git a/src/rules/levels/types.ts b/src/rules/levels/types.ts
index a078dff..aa89d61 100644
--- a/src/rules/levels/types.ts
+++ b/src/rules/levels/types.ts
@@ -6,7 +6,8 @@ export type LevelRules = { readonly bar: "side" | "unit"; readonly thresholds: r
 /** The abilities a bar may unlock, in the maker's order: by side id when `bar` is "side", by unit document id (`UnitState.unitId`) when "unit". */
 export type AbilityPools = Readonly<Record<string, readonly string[]>>;
 export type LevelLimits = { readonly levels: number; readonly pool: number; readonly offer: number; readonly pools: number };
-export type LevelSetup = { readonly rules: LevelRules; readonly pools: AbilityPools; readonly limits?: LevelLimits };
+export type LevelStart = { readonly id: string; readonly xp: number; readonly level: number; readonly banked: number; readonly offer: readonly string[] | null; readonly abilities: readonly string[] };
+export type LevelSetup = { readonly rules: LevelRules; readonly pools: AbilityPools; readonly limits?: LevelLimits; readonly start?: readonly LevelStart[] };
 /** One bar (`id`: the side id or the unit instance id); `offer` is the pending pick (null = none), `banked` the XP held while it waits. */
 export type LevelBar = { readonly id: string; readonly xp: number; readonly level: number; readonly banked: number; readonly offer: readonly string[] | null; readonly abilities: readonly string[] };
 export type LevelsState = { readonly rngState: RngState; readonly bars: readonly LevelBar[] };
```

### `src/editor/stage/links.ts` (edited)

```diff
diff --git a/src/editor/stage/links.ts b/src/editor/stage/links.ts
index 758057e..01c99b6 100644
--- a/src/editor/stage/links.ts
+++ b/src/editor/stage/links.ts
@@ -9,6 +9,7 @@ export function addLink(stage: Obj, type: LinkType, c: number, r: number, to: st
   if (to === stage["id"]) return null; const next = clone(stage); next["links"] = [...list(stage["links"]).filter((link) => !onCell(link, c, r)), { type, at: { c, r }, to }]; return next;
 }
 export function removeLink(stage: Obj, c: number, r: number): Obj { const next = clone(stage); next["links"] = list(stage["links"]).filter((link) => !onCell(link, c, r)); return next; }
+export function setAutosave(stage: Obj, c: number, r: number, on: boolean): Obj { const next = clone(stage); next["links"] = list(stage["links"]).map((link) => { if (!isObj(link) || !onCell(link, c, r)) return link; const copy: Obj = { ...link }; if (on) copy["autosave"] = true; else delete copy["autosave"]; return copy; }); return next; }
 export function linksTo(files: Record<string, Obj>, id: string): readonly string[] {
   const root = files["project.json"], proj = isObj(root) && isObj(root["project"]) ? root["project"] : {}, live = list(proj["stages"]);
   return Object.entries(files).flatMap(([path, doc]) => !path.startsWith("stages/") || !isObj(doc) || typeof doc["id"] !== "string" || doc["id"] === id || !live.includes(doc["id"]) ? [] : list(doc["links"]).some((link) => isObj(link) && link["to"] === id) ? [typeof doc["name"] === "string" ? doc["name"] : "Stage"] : []);
```

### `src/editor/stage/rooms.ts` (edited)

```diff
diff --git a/src/editor/stage/rooms.ts b/src/editor/stage/rooms.ts
index cfc5b89..92a6523 100644
--- a/src/editor/stage/rooms.ts
+++ b/src/editor/stage/rooms.ts
@@ -41,11 +41,17 @@ export function renameDoc(files: Record<string, Obj>, path: string, name: string
 export function deleteStage(files: Record<string, Obj>, stageId: string): { readonly ok: true; readonly files: Record<string, Obj> } | { readonly ok: false; readonly reason: string } {
   const stages = list(inner(rootOf(files))["stages"]).filter((id): id is string => typeof id === "string");
   if (!stages.includes(stageId) || stages.length <= 1) return { ok: false, reason: "A game needs at least one stage" };
+  if (startOf(files) === stageId) return { ok: false, reason: "The game starts here. Pick another start first." };
   const named = linksTo(files, stageId); if (named.length > 0) return { ok: false, reason: `A link on ${named.join(", ")} leads here. Remove it first.` };
   const root = clone(rootOf(files)), proj = { ...inner(root) }; proj["stages"] = stages.filter((id) => id !== stageId);
   if (isObj(proj["render"]) && Array.isArray(proj["render"]["excludedStages"])) { const render = { ...proj["render"] }; render["excludedStages"] = list(render["excludedStages"]).filter((id) => id !== stageId); proj["render"] = render; }
   root["project"] = proj; return { ok: true, files: { ...files, "project.json": root } };
 }
+export function startOf(files: Record<string, Obj>): string | null { const session = inner(rootOf(files))["session"]; return isObj(session) && typeof session["start"] === "string" ? session["start"] : null; }
+export function setStart(files: Record<string, Obj>, stageId: string): Record<string, Obj> {
+  const stages = list(inner(rootOf(files))["stages"]).filter((id): id is string => typeof id === "string"); if (!stages.includes(stageId)) return files;
+  const root = clone(rootOf(files)), proj = { ...inner(root) }; proj["session"] = { start: stageId }; root["project"] = proj; return { ...files, "project.json": root };
+}
 export function deleteMap(files: Record<string, Obj>, mapId: string): { readonly ok: true } | { readonly ok: false; readonly usedBy: readonly string[] } {
   const usedBy = refsTo(files, mapId); return usedBy.length > 0 ? { ok: false, usedBy } : { ok: true };
 }
```

### `tools/play-stage/match.ts` (edited)

```diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index c4bf259..00bb726 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -6,6 +6,7 @@ import { submit } from "../../src/sim/actions.ts";
 import type { DoorIntent } from "../../src/sim/types.ts";
 import type { Outcome } from "../../src/state/index.ts";
 import { linkAt, linkEvent, type LinkEvent } from "../../src/rules/session/links.ts";
+import { partyOf } from "../../src/rules/session/party.ts";
 import type { Sq } from "../../src/types/core-types.ts";
 import { createPlay, spellRef } from "./board.ts";
 import { recipeIn, type PlayDocs } from "./load.ts";
@@ -77,7 +78,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     play.followId = null;
   };
   let tell: ((link: LinkEvent) => void) | null = null;
-  play.landed(() => { if (side !== me) { go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); return; } const who = play.selected === null ? undefined : play.world.units.get(play.selected), hit = who === undefined ? null : linkAt(body.links ?? [], who.at); if (hit === null) return; const from = body.stage; tell?.(linkEvent(hit, typeof from === "object" && from !== null && "id" in from && typeof from.id === "string" ? from.id : "")); });
+  play.landed(() => { if (side !== me) { go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); return; } const who = play.selected === null ? undefined : play.world.units.get(play.selected), hit = who === undefined ? null : linkAt(body.links ?? [], who.at); if (hit === null) return; const from = body.stage, id = typeof from === "object" && from !== null && "id" in from && typeof from.id === "string" ? from.id : null; if (id === null) throw new Error("play: stage id"); tell?.(linkEvent(hit, id, play.sides.contest && outcome === null)); });
   const wipe = (): void => { play.aims = []; talk = null; play.focus(null); play.followId = null; };
   const back = (): "unitSelected" | "actMenu" | null => {
     if (play.world.phases.battle !== "targeting") return null;
@@ -118,6 +119,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     },
     closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
     onLink(fn: (link: LinkEvent) => void): void { tell = fn; },
+    party() { const rules = play.world.rules; if (rules === null) throw new Error("play: party needs rules"); const hp: Record<string, number> = Object.create(null); for (const row of rules.state().units) { const u = play.world.units.get(row.id); if (u !== undefined && u.alive && u.side === me && !Object.hasOwn(hp, u.unitId)) hp[u.unitId] = row.hp; } const levels = play.world.levels; return partyOf(play.world.units.all(), hp, me, levels === null ? null : levels.state().bars); },
     recentreTarget(): Sq | null {
       const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
       if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
```

### `tools/play-stage/page.ts` (edited)

```diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 8e298c6..0047c0d 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -3,6 +3,7 @@ import { createLighting, fitView } from "../../src/runtime/render/index.ts";
 import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
 import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
 import type { LinkEvent } from "../../src/rules/session/links.ts";
+import type { SessionParty } from "../../src/types/core-types.ts";
 import { boardBox, fit, TILE } from "./board.ts";
 import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
 import { createHud, XP_H } from "./hud.ts";
@@ -13,7 +14,7 @@ import { createTouch } from "./touch.ts";
 import { DEV } from "./dev.ts"; // dev-only
 
 export type StartAim = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
-export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void, aim?: StartAim, travel?: (link: LinkEvent) => void): void {
+export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void, aim?: StartAim, travel?: (link: LinkEvent, party: SessionParty) => void): void {
 const canvas = document.querySelector("#board");
 if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
 const match = createMatch(docs);
@@ -78,7 +79,7 @@ if (aim?.unitId !== undefined) {
   }
 }
 if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link, __docs: docs }); // dev-only
-if (travel !== undefined) match.onLink((link) => { stop(); travel(link); });
+if (travel !== undefined) match.onLink((link) => { const party = match.party(); stop(); travel(link, party); });
 if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { stop(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
 driver.start();
 }
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 9b261c0..688f175 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -1,6 +1,9 @@
 import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
-import { readStage } from "../../src/project/read/stage.ts";
-import { arrival, type LinkEvent } from "../../src/rules/session/links.ts";
+import { readMap, readStage } from "../../src/project/read/index.ts";
+import { createGrid } from "../../src/core/grid/index.ts";
+import { arrival } from "../../src/rules/session/links.ts";
+import { carryInto } from "../../src/rules/session/party.ts";
+import type { SessionParty } from "../../src/types/core-types.ts";
 import { ruleOf } from "../../src/project/rule-of.ts";
 import { WIN_CONDITION } from "../../src/rules/battle/win.ts";
 import { XP_LEVELS } from "../../src/rules/behaviours/xp-levels.ts";
@@ -46,8 +49,8 @@ function levelsOf(store: ProjectStore, stage: Obj): PlayOut["levels"] {
 }
 /** Adapter only. Document JSON is already read by readProject. */
 export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
-  const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
-  const stage = store.stages[stageId ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
+  const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {}, sess = isObj(root["session"]) ? root["session"] : null, start = sess !== null && typeof sess["start"] === "string" ? sess["start"] : undefined;
+  const stage = store.stages[stageId ?? start ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
   const core = readStage(stage, { picks: 0, waveUnits: 0 }); if (!core.ok) throw new Error("play: stage");
   const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
   const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
@@ -90,14 +93,16 @@ export function openBundled(): ReturnType<typeof openProject> {
   return { docs: { ...got.docs, looks: DEMO_LOOKS }, error: got.error };
 }
 export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
-export function arriveIn(files: ProjectFiles, from: PlayOut, link: LinkEvent): ReturnType<typeof openProject> {
-  const fromId = isObj(from.stage) && typeof from.stage["id"] === "string" ? from.stage["id"] : "";
-  let path = ""; for (const [key, doc] of Object.entries(files)) if (key.startsWith("stages/") && isObj(doc) && doc["id"] === link.to) path = key;
+export function arriveIn(files: ProjectFiles, fromId: string | null, toId: string, party: SessionParty): ReturnType<typeof openProject> {
+  if (fromId === "") throw new Error("play: stage id");
+  let path = ""; for (const [key, doc] of Object.entries(files)) if (key.startsWith("stages/") && isObj(doc) && doc["id"] === toId) path = key;
   const stage = path === "" ? undefined : files[path], read = stage === undefined ? null : readStage(stage, { picks: 0, waveUnits: 0 });
-  if (read === null || !read.ok) return openProject(files, link.to);
-  const spots = read.doc.playerSpawns, next = arrival(read.doc.links ?? [], fromId, spots);
+  if (read === null || !read.ok) return openProject(files, toId);
+  let mapDoc: unknown; for (const [key, doc] of Object.entries(files)) if (key.startsWith("maps/") && isObj(doc) && doc["id"] === read.doc.mapRef) mapDoc = doc;
+  const map = mapDoc === undefined ? null : readMap(mapDoc), tiles = installOne(TERRAIN, {}).out?.tiles, grid = map !== null && map.ok && tiles !== undefined ? createGrid(map.doc, tiles) : null;
+  const taken = new Set<string>(); for (const n of read.doc.neutrals) taken.add(`${n.at.c},${n.at.r}`); const pool = read.doc.enemyPool; if (pool.mode === "fixed") for (const e of pool.entries) taken.add(`${e.at.c},${e.at.r}`); else for (const s of pool.spawns) taken.add(`${s.c},${s.r}`);
+  const free = (sq: { c: number; r: number }): boolean => !taken.has(`${sq.c},${sq.r}`) && grid !== null && grid.isOpen(sq), spots = read.doc.playerSpawns, next = arrival(read.doc.links ?? [], fromId ?? "\u0000", spots, party.members.length, free);
   const playerSpawns = next.map((sq) => { const hit = spots.find((s) => s.c === sq.c && s.r === sq.r); return hit !== undefined && hit.facing !== undefined ? { c: sq.c, r: sq.r, facing: hit.facing } : { c: sq.c, r: sq.r }; });
-  const opened = openProject({ ...files, [path]: { ...(isObj(stage) ? stage : {}), playerSpawns } }, link.to);
-  if (opened.docs === null) return opened;
-  return { docs: { ...opened.docs, chosen: from.chosen.slice(0, playerSpawns.length) }, error: opened.error };
+  const opened = openProject({ ...files, [path]: { ...(isObj(stage) ? stage : {}), playerSpawns } }, toId); if (opened.docs === null) return opened;
+  const side = read.doc.sides?.loadout ?? party.side, carried = carryInto(party, side), rules = { ...opened.docs.rules, carry: carried.carry }, levels = opened.docs.levels === undefined || carried.start === undefined ? opened.docs.levels : { ...opened.docs.levels, start: carried.start }; return { docs: { ...opened.docs, chosen: party.members.map((m) => m.unitId), rules, ...(levels === undefined ? {} : { levels }) }, error: opened.error };
 }
```

### `tools/maker/session.ts` (new)

```ts
import { SAVE_MIGRATIONS, migrateSave, type SaveChains } from "../../src/sim/migrations/save/index.ts";
import { SESSION_FORMAT, readSession, sessionSave, sessionVersion, type SessionRead } from "../../src/project/read/session.ts";
import type { SaveHeader, SessionParty, SessionSave } from "../../src/types/core-types.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, type MakerStore } from "./store.ts";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export const slotOf = (id: string): string => `tileengine/saves/${id}/autosave.json`;
export const keptLine = (why: string): string => `The saved game can't be read (${why}). It is kept.`;
export async function readAutosave(store: MakerStore, want: { readonly projectId: string; readonly projectHash: string; readonly engineVersion: string }, chains: SaveChains = SAVE_MIGRATIONS): Promise<SessionRead | null> {
  const text = await store.read(slotOf(want.projectId)); if (text === null) return null;
  const parsed = parseProject({ "autosave.json": text }); if (!parsed.ok) return { ok: false, code: "invalidValue", needsMigration: false };
  const doc = parsed.files["autosave.json"]; const fv = isObj(doc) ? sessionVersion(doc) : null; if (!isObj(doc) || fv === null) return { ok: false, code: "invalidValue", needsMigration: false };
  if (fv < SESSION_FORMAT) { let migrated: Readonly<Record<string, unknown>> | null; try { migrated = migrateSave("session-save", doc, fv, SESSION_FORMAT, chains); } catch { return { ok: false, code: "saveMigrationFailed", needsMigration: true }; } if (migrated === null) return { ok: false, code: "saveFormatOlder", needsMigration: true }; const read = readSession(migrated, want); return !read.ok && read.detail !== "projectId" ? { ok: false, code: "saveMigrationFailed", needsMigration: true } : read; }
  return readSession(doc, want);
}
export async function writeAutosave(store: MakerStore, header: SaveHeader, from: string, to: string, party: SessionParty): Promise<{ readonly ok: true; readonly save: SessionSave } | { readonly ok: false; readonly message: string }> {
  const save = sessionSave(header, from, to, party), check = readSession(save, { projectId: header.projectId, projectHash: header.projectHash, engineVersion: header.engineVersion });
  if (!check.ok) return { ok: false, message: `Autosave skipped: this game can't be saved (${check.detail === undefined ? check.code : `${check.code} ${check.detail}`}).` };
  const slot = slotOf(header.projectId), prior = await store.read(slot);
  if (prior !== null) { const got = await readAutosave(store, { projectId: header.projectId, projectHash: header.projectHash, engineVersion: header.engineVersion }); if (got !== null && !got.ok) return { ok: false, message: `Autosave skipped: ${keptLine(got.code)}` }; }
  const wrote = await commitWrites(store, `tileengine/saves/${header.projectId}`, [{ path: "autosave.json", text: JSON.stringify(save) }]);
  return wrote.ok ? { ok: true, save } : { ok: false, message: wrote.message };
}
```

### `tools/maker/test-launch.ts` (edited)

```diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index ae1dd9e..a8a17fa 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -2,6 +2,10 @@ import { prefix, storedRev, type DocText } from "../../src/editor/project/home.t
 import { planSave } from "../../src/editor/project/save.ts";
 import { testGate, playLine, emptyBoard } from "../../src/editor/project/test-gate.ts";
 import { readProject } from "../../src/project/load/index.ts";
+import { startOf } from "../../src/editor/stage/rooms.ts";
+import { settleSession } from "../../src/project/read/session.ts";
+import type { Notice } from "../../src/core/notice.ts";
+import type { SessionParty, SessionSave } from "../../src/types/core-types.ts";
 import type { Looks } from "../play-stage/load.ts";
 import { openProject, arriveIn, type PlayOut } from "../play-stage/project.ts";
 import type { LinkEvent } from "../../src/rules/session/links.ts";
@@ -9,24 +13,27 @@ import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 export type PlayReady = PlayOut & { readonly looks: Looks };
 export type AimAt = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
-export type Next = (from: PlayReady, link: LinkEvent) => { readonly docs: PlayReady | null; readonly error: string };
-export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
+export type Next = (from: PlayReady, link: LinkEvent, party: SessionParty) => { readonly docs: PlayReady | null; readonly error: string };
+export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly notes?: readonly Notice[] } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
 type Start = (docs: PlayReady, aim?: AimAt, next?: Next) => void;
-export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start };
+export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start; readonly resume?: SessionSave };
 export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
 const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
 const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
 const showUrl = (id: string, stage: string, from: string, aim?: AimAt): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; const unit = aim?.unitId === undefined ? "" : `&unit=${encodeURIComponent(aim.unitId)}`; const ability = aim?.abilityId === undefined ? "" : `&ability=${encodeURIComponent(aim.abilityId)}`; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}${unit}${ability}`); };
+function resumed(files: Parameters<typeof openProject>[0], save: SessionSave): { readonly docs: (PlayOut & { readonly looks: Looks }) | null; readonly error: string; readonly notes: readonly Notice[] } {
+  const root = files["project.json"], rec = (v: unknown): Record<string, unknown> | null => (typeof v === "object" && v !== null && !Array.isArray(v) ? v as Record<string, unknown> : null), project = rec(rec(root)?.["project"]), list = project?.["stages"], stages = Array.isArray(list) ? list.filter((id): id is string => typeof id === "string") : [], units: string[] = [], bag: Record<string, Record<string, unknown>> = {}; for (const [path, doc] of Object.entries(files)) { const row = rec(doc); if (row !== null) { bag[path] = row; if (path.startsWith("units/") && typeof row["id"] === "string") units.push(row["id"]); } } const kept = settleSession(save, stages, units, startOf(bag) ?? stages[0] ?? ""); const got = arriveIn(files, kept.from, kept.to, kept.party); return { docs: got.docs, error: got.error, notes: kept.notes };
+}
 function play(input: LaunchBag, text: DocText): Launch {
   const parsed = parseProject(text);
   if (!parsed.ok) return fail([parsed.message], text, 0);
   const load = readProject(parsed.files), gate = testGate(load.report, load.readOnly), rev = storedRev(parsed.files);
   if (!gate.allowed) return fail(gate.lines, text, rev);
-  const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
+  const opened = input.resume === undefined ? (input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId)) : resumed(parsed.files, input.resume);
   if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
   if (emptyBoard(opened.docs)) return fail(["Place a unit on this stage to test it."], text, rev);
-  try { input.start(opened.docs, input.aim, (from, link) => arriveIn(parsed.files, from, link)); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
-  showUrl(input.id, stageOf(opened.docs), input.from, input.aim); return { ok: true, files: text, rev };
+  try { input.start(opened.docs, input.aim, (from, link, party) => arriveIn(parsed.files, stageOf(from), link.to, party)); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
+  showUrl(input.id, stageOf(opened.docs), input.from, input.aim); const notes = "notes" in opened ? opened.notes : []; return notes.length > 0 ? { ok: true, files: text, rev, notes } : { ok: true, files: text, rev };
 }
 /** Read a saved folder and start its stage. No demo fallback. */
 export async function openSaved(input: LaunchBag): Promise<Launch> {
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 77b9c8c..ef8ab14 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -13,12 +13,17 @@ import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows,
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type AimAt, type Next, type PlayReady } from "./test-launch.ts";
 import { startMatch } from "../play-stage/page.ts";
+import { ENGINE_VERSION } from "../../src/index.ts";
+import type { Notice } from "../../src/core/notice.ts";
+import type { SessionParty, SessionSave } from "../../src/types/core-types.ts";
+import type { LinkEvent } from "../../src/rules/session/links.ts";
+import { keptLine, readAutosave, writeAutosave } from "./session.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
 type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
 const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
-let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve();
+let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve(), resume: SessionSave | null = null, resumeNotes: readonly Notice[] = [];
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
 const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
 const fail = (e: unknown): void => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.");
@@ -36,24 +41,25 @@ function paint(): void {
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly), units: unitTail(state.files, state.readOnly), levels: levelsSection(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: levelsSection(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
   root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
 }
 async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
-async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; bindRooms(id); bindUnits(id); paint(); }
+async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; resumeNotes = []; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; resumeNotes = got.notes; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
 async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
 async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
 async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
 async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
 async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
 async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
+function saveTrip(link: LinkEvent, party: SessionParty): void { if (store === null || state.current === null) return; const header = { projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION, projectId: state.current, savedAt: nowIso() }; writeAutosave(store, header, link.from, link.to, party).then((res) => { if (!res.ok) { state.banner = res.message; paint(); return; } resume = res.save; resumeNotes = []; }).catch((e: unknown) => { state.banner = `Autosave skipped (${e instanceof Error ? e.message : "error"}). The saved game is kept.`; paint(); }); }
 function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt, next?: Next): void {
   const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
   const out = (): void => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; };
-  const travel = next === undefined ? undefined : (link: Parameters<Next>[1]): void => { const got = next(docs, link); if (got.docs === null) { out(); state.problems = [got.error]; paint(); return; } canvas.remove(); document.querySelector("#hud")?.remove(); enterPlay(got.docs, scroll, undefined, next); };
+  const travel = next === undefined ? undefined : (link: LinkEvent, party: SessionParty): void => { const got = next(docs, link, party); if (got.docs === null) { out(); state.problems = [got.error]; paint(); return; } if (link.autosave) saveTrip(link, party); canvas.remove(); document.querySelector("#hud")?.remove(); enterPlay(got.docs, scroll, undefined, next); };
   try { startMatch(docs, out, aim, travel); root.hidden = true; } catch (e) { canvas.remove(); throw e; }
 }
 async function saveStage(): Promise<boolean> {
@@ -61,15 +67,16 @@ async function saveStage(): Promise<boolean> {
   const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
   state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
 }
-async function beginTest(aim?: AimAt & { readonly stageId?: string }): Promise<void> {
+async function beginTest(aim?: AimAt & { readonly stageId?: string }, held?: SessionSave): Promise<void> {
   if (store === null || state.current === null) return;
   const stageId = aim?.stageId ?? (state.screen === "stage" ? state.stageId : null);
   if (stageId !== null && state.screen === "stage" && !await saveStage()) { paint(); return; }
   const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
   const launched = aim?.unitId === undefined ? undefined : { ...(aim.abilityId === undefined ? { unitId: aim.unitId } : { unitId: aim.unitId, abilityId: aim.abilityId }), ...(aim.aim === undefined ? {} : { aim: aim.aim }) };
-  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), now: nowIso(), start: (docs, at, next) => enterPlay(docs, scroll, at, next) });
+  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), ...(held === undefined ? {} : { resume: held }), now: nowIso(), start: (docs, at, next) => enterPlay(docs, scroll, at, next) });
   state.files = got.files; state.rev = got.rev;
   if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
+  if (held !== undefined) { const parts: string[] = []; if (resumeNotes.some((n) => n.code === "saveProjectMismatch") || (got.notes ?? []).some((n) => n.code === "saveProjectMismatch")) parts.push("the project changed"); if (resumeNotes.some((n) => n.code === "saveEngineMismatch") || (got.notes ?? []).some((n) => n.code === "saveEngineMismatch")) parts.push("TileEngine changed"); for (const n of [...resumeNotes, ...(got.notes ?? [])]) if (n.code === "saveRefDropped") parts.push(n.message === held.to ? `dropped the stage it was going to ${n.message}` : n.message === held.from ? `dropped the stage it came from ${n.message}` : `dropped unitId ${n.message}`); if (parts.length > 0) state.banner = `Continued. Since the save: ${parts.join("; ")}`; }
   state.dirty = false; state.problems = [];
 }
 function aimAt(text: DocText, unit: string, ability: string | null): AimAt {
@@ -136,7 +143,7 @@ async function run(act: string): Promise<void> {
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
   if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
-  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "fix") { state.problems = []; paint(); }
+  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
 }
 async function boot(): Promise<void> {
   paint();
```

### `tools/maker/stage.ts` (edited)

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index fd882df..d4631d2 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -3,7 +3,7 @@ import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
 import { planSave } from "../../src/editor/project/save.ts";
 import { paintCells, startNew } from "../../src/editor/stage/paint.ts";
 import { addEnemy, addNeutral, addSpawn, attachTalk, infoText, moveEntry, placeRows, refuse, removeEntry, standHere, type PlaceList } from "../../src/editor/stage/place.ts";
-import { addLink, linkOn, removeLink } from "../../src/editor/stage/links.ts";
+import { addLink, linkOn, removeLink, setAutosave } from "../../src/editor/stage/links.ts";
 import { closedType, sheetRows, typeLabel, type SheetRow } from "../../src/editor/stage/sheet.ts";
 import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
 import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
@@ -149,7 +149,7 @@ export function stageScreen(stageId: string, host: Host): string {
   const names = stageRows(host.files), linked = mark === null && cell !== null ? linkOn(got.stage, cell.c, cell.r) : null, linkType = linked !== null && (linked["type"] === "stairs" || linked["type"] === "door" || linked["type"] === "gate") ? linked["type"] : null;
   const rows = sheetRows(got.slice, mark !== null);
   const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
-  const stood = linkType !== null ? `<button type="button" class="btn" data-act="s:unlink">Remove link</button>` : mark === null ? "" : `${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
+  const stood = linkType !== null ? `<button type="button" class="btn" data-act="s:autosave" aria-pressed="${linked?.["autosave"] === true ? "true" : "false"}">Autosave here: ${linked?.["autosave"] === true ? "On" : "Off"}</button><button type="button" class="btn" data-act="s:unlink">Remove link</button>` : mark === null ? "" : `${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
   const place = linkType === null && mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
   const linkBtns = place !== "" && names.some((row) => row.id !== stageId) ? `<p class="sub">Link</p>${(["stairs", "door", "gate"] as const).map((type) => `<button type="button" class="btn" data-act="s:link:${type}">${LINK_LABEL[type]}</button>`).join("")}` : "";
   const title = linkType !== null ? `${esc(LINK_LABEL[linkType])} to ${esc(typeof linked?.["to"] === "string" ? names.find((row) => row.id === linked["to"])?.name ?? "Stage" : "")}` : mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
@@ -240,6 +240,7 @@ export async function stageClick(act: string, stageId: string, host: Host, io: I
   if (act.startsWith("s:link:") && sess.sheet !== null) { const type = act.slice(7); if (type !== "stairs" && type !== "door" && type !== "gate") return kept(host); sess.link = type; return kept(host); }
   if (act.startsWith("s:to:") && sess.link !== null && sess.sheet !== null) { const id = act.slice(5); if (!stageRows(host.files).some((row) => row.id === id)) return kept(host); const next = addLink(got.stage, sess.link, sess.sheet.c, sess.sheet.r, id); if (next === null) return kept(host); sess.link = null; sess.sheet = null; return commitStage(io, host, next, got.stage); }
   if (act === "s:unlink" && sess.sheet !== null) { const at = sess.sheet; sess.link = null; sess.sheet = null; return commitStage(io, host, removeLink(got.stage, at.c, at.r), got.stage); }
+  if (act === "s:autosave" && sess.sheet !== null) { const at = sess.sheet, on = linkOn(got.stage, at.c, at.r)?.["autosave"] === true; return commitStage(io, host, setAutosave(got.stage, at.c, at.r, !on), got.stage); }
   if (act === "s:place:npc" || act === "s:place:enemy") { if (sess.sheet === null) return kept(host); sess.pick = act.endsWith("enemy") ? "enemy" : "npc"; return kept(host); }
   if (act.startsWith("s:unit:") && sess.pick !== null && sess.sheet !== null) {
     const id = act.slice(7), at = sess.sheet;
```

### `tools/maker/rooms.ts` (edited)

```diff
diff --git a/tools/maker/rooms.ts b/tools/maker/rooms.ts
index cb3541d..e40e740 100644
--- a/tools/maker/rooms.ts
+++ b/tools/maker/rooms.ts
@@ -1,6 +1,6 @@
 import { checkName, prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
 import { planSave } from "../../src/editor/project/save.ts";
-import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc } from "../../src/editor/stage/rooms.ts";
+import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc, setStart } from "../../src/editor/stage/rooms.ts";
 import { resizeMap, type Drop } from "../../src/editor/stage/resize.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
@@ -71,7 +71,7 @@ export function roomSheet(files: DocText): string {
     const uses = maps.map(({ doc }) => `<button type="button" class="btn" data-act="r:use:${esc(String(doc["id"]))}">Use map: ${esc(typeof doc["name"] === "string" ? doc["name"] : "Map")}</button>`).join("");
     return `<div class="scrim"><div class="sheet" role="dialog"><h2>Add stage</h2><button type="button" class="btn" data-act="r:new">New map</button>${uses}${close}</div></div>`;
   }
-  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Edit")}</h2><button type="button" class="btn" data-act="r:rename">Rename</button>${sess.which === "map" ? `<button type="button" class="btn" data-act="r:resize">Resize</button>` : ""}<button type="button" class="btn danger" data-act="r:delete">Delete</button>${close}</div></div>`;
+  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Edit")}</h2><button type="button" class="btn" data-act="r:rename">Rename</button>${sess.which === "stage" ? `<button type="button" class="btn" data-act="r:start">Game starts here</button>` : `<button type="button" class="btn" data-act="r:resize">Resize</button>`}<button type="button" class="btn danger" data-act="r:delete">Delete</button>${close}</div></div>`;
   if (sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Rename</h2><input class="name-field" data-room value="${esc(sess.name)}" aria-label="Name"><button type="button" class="btn" data-act="r:save-name">Save</button>${close}</div></div>`;
   if (sess.mode === "ask") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}<button type="button" class="btn danger" data-act="r:anyway">Resize anyway</button><button type="button" class="btn ghost" data-act="r:close">Cancel</button></div></div>`;
   const big = sess.cols > 256 || sess.rows > 256 ? `<p>Big maps may stutter on phones</p>` : "";
@@ -106,6 +106,7 @@ export async function roomClick(act: string, host: Host, io: RoomIo): Promise<Ro
   }
   if (act.startsWith("r:step:")) { const parts = act.split(":"), delta = Number(parts[3]); if (parts[2] === "c") sess.cols = Math.max(1, sess.cols + delta); else sess.rows = Math.max(1, sess.rows + delta); return kept(host, null); }
   const bag = bagOf(host.files); if (bag === null) return kept(host, "Can't open this project");
+  if (act === "r:start" && sess.which === "stage") { const after = setStart(bag, sess.target); return after === bag ? kept(host, null) : save(io, host, bag, after, "Changed · Undo"); }
   if (act === "r:new" || act.startsWith("r:use:")) {
     const sk = skels(io.empty); if (sk === null) return kept(host, "Can't open: templates");
     const stageId = `stage_${ulid(Date.parse(io.now), io.bytes())}`, existing = act.startsWith("r:use:") ? act.slice(6) : null, mapId = existing ?? `map_${ulid(Date.parse(io.now), io.bytes())}`;
```

### `tools/baseline/checkpoint.ts` (edited)

```diff
diff --git a/tools/baseline/checkpoint.ts b/tools/baseline/checkpoint.ts
index 83a621f..382c843 100644
--- a/tools/baseline/checkpoint.ts
+++ b/tools/baseline/checkpoint.ts
@@ -8,7 +8,15 @@ import army from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/setu
 import shot from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/setups/setup_01M81X2F2HQQ17D2CWYR72DC9B.json" with { type: "json" };
 import hero from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/units/unit_01M81X2BX5ANZS5PWVAFHNCASA.json" with { type: "json" };
 import raider from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/units/unit_01M81X2PKRZ2NQKAHDV247ZRX3.json" with { type: "json" };
+import shopProject from "../../fixtures/shop-stairs/project.json" with { type: "json" };
+import shopDown from "../../fixtures/shop-stairs/stages/stage_01JDES00000000000000000001.json" with { type: "json" };
+import shopUp from "../../fixtures/shop-stairs/stages/stage_01JDES00000000000000000002.json" with { type: "json" };
 export function checkpointFiles(): ProjectFiles {
   return { "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDEM00000000000000000002.json": map, "stages/stage_01JDEM00000000000000000003.json": stage, "setups/setup_01M7XPE6006A10000000000000.json": army, "setups/setup_01M81X2F2HQQ17D2CWYR72DC9B.json": shot, "units/unit_01M81X2BX5ANZS5PWVAFHNCASA.json": hero, "units/unit_01M81X2PKRZ2NQKAHDV247ZRX3.json": raider };
 }
 export const openCheckpoint = (): ReturnType<typeof openProject> => openProject(checkpointFiles());
+export function shopFiles(): ProjectFiles {
+  const files = { ...checkpointFiles() }; delete files["stages/stage_01JDEM00000000000000000003.json"];
+  return { ...files, "project.json": shopProject, "stages/stage_01JDES00000000000000000001.json": shopDown, "stages/stage_01JDES00000000000000000002.json": shopUp };
+}
+export const openShop = (): ReturnType<typeof openProject> => openProject(shopFiles());
```

### `fixtures/shop-stairs/project.json` (new)

```json
{"kind":"tile-project","formatVersion":6,"project":{"id":"project_01M81X22DNRFYKC2MHE6JECEM3","rev":12,"name":"Skirmish","createdAt":"2026-11-22T15:12:40.885Z","updatedAt":"2026-11-22T15:13:10.577Z","copiedFrom":null,"catalogueRev":30,"settings":{"wrapEdges":false},"stages":["stage_01JDES00000000000000000001","stage_01JDES00000000000000000002"],"rules":["setup_01M7XPE6006A10000000000000"],"loadout":{"roster":["unit_01M81X2BX5ANZS5PWVAFHNCASA"],"size":1,"required":[]}}}
```

### `fixtures/shop-stairs/stages/stage_01JDES00000000000000000001.json` (new)

```json
{"kind":"stage","formatVersion":2,"id":"stage_01JDES00000000000000000001","rev":1,"name":"Shop floor","mapRef":"map_01JDEM00000000000000000002","seed":24301,"playerSpawns":[{"c":0,"r":4}],"neutrals":[],"enemyPool":{"mode":"fixed","entries":[]},"loadout":null,"rules":[],"links":[{"type":"stairs","at":{"c":1,"r":4},"to":"stage_01JDES00000000000000000002"}]}
```

### `fixtures/shop-stairs/stages/stage_01JDES00000000000000000002.json` (new)

```json
{"kind":"stage","formatVersion":2,"id":"stage_01JDES00000000000000000002","rev":1,"name":"Upstairs","mapRef":"map_01JDEM00000000000000000002","seed":24301,"playerSpawns":[{"c":0,"r":4}],"neutrals":[],"enemyPool":{"mode":"fixed","entries":[]},"loadout":null,"rules":[],"links":[{"type":"stairs","at":{"c":1,"r":4},"to":"stage_01JDES00000000000000000001"}]}
```

### `tests/tools/stage-links.test.ts` (edited)

```diff
diff --git a/tests/tools/stage-links.test.ts b/tests/tools/stage-links.test.ts
index 1ababc7..1766d5c 100644
--- a/tests/tools/stage-links.test.ts
+++ b/tests/tools/stage-links.test.ts
@@ -46,19 +46,19 @@ test("stage link: landing on stairs takes the party to the linked stage, arrivin
   go(m, { c: 0, r: 1 }); assert.deepEqual(got.slice(), []); assert.deepEqual(heroAt(m), { c: 0, r: 1 });
   go(m, { c: 1, r: 1 }); go(m, { c: 1, r: 0 });
   assert.equal(got.length, 1); assert.equal(got[0]?.linkType, "stairs"); assert.equal(got[0]?.to, B); assert.deepEqual(got[0]?.at, { c: 1, r: 0 });
-  const up = arriveIn(files, docs, got[0] ?? got[0]); if (up.docs === null) throw new Error(up.error);
+  const up = arriveIn(files, A, B, { side: "player", members: docs.chosen.map((unitId) => ({ unitId, hp: 1000000000 })), bar: null }); if (up.docs === null) throw new Error(up.error);
   const mb = createMatch(up.docs, 200); assert.deepEqual(heroAt(mb), { c: 2, r: 1 }); assert.equal(mb.sides.contest, false);
   const back: LinkEvent[] = []; mb.onLink((ev) => back.push(ev)); go(mb, { c: 3, r: 1 }); go(mb, { c: 2, r: 1 });
   assert.equal(back.length, 1); assert.equal(back[0]?.to, A); assert.deepEqual(back[0]?.at, { c: 2, r: 1 });
-  const down = arriveIn(files, up.docs, back[0] ?? back[0]); if (down.docs === null) throw new Error(down.error);
+  const down = arriveIn(files, B, A, { side: "player", members: up.docs.chosen.map((unitId) => ({ unitId, hp: 1000000000 })), bar: null }); if (down.docs === null) throw new Error(down.error);
   assert.deepEqual(heroAt(createMatch(down.docs, 200)), { c: 1, r: 0 });
   const page = readFileSync("tools/play-stage/page.ts", "utf8");
   assert.equal(page.split("driver.dispose()").length - 1, 1);
   assert.equal(page.includes('const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };'), true);
 });
 test("stage link rebuild fits the frame budget", () => {
-  const files = linked(), from = docsOf(files, A), link: LinkEvent = { type: "link", linkType: "stairs", from: A, to: B, at: { c: 1, r: 0 } }, times: number[] = [];
-  for (let i = 0; i < 25; i += 1) { const t0 = performance.now(); const got = arriveIn(files, from, link); if (got.docs === null) throw new Error(got.error); createMatch(got.docs, 200).scene(); times.push(performance.now() - t0); }
+  const files = linked(), from = docsOf(files, A), times: number[] = [];
+  for (let i = 0; i < 25; i += 1) { const t0 = performance.now(); const got = arriveIn(files, A, B, { side: "player", members: from.chosen.map((unitId) => ({ unitId, hp: 1000000000 })), bar: null }); if (got.docs === null) throw new Error(got.error); createMatch(got.docs, 200).scene(); times.push(performance.now() - t0); }
   const sample = times.slice(5).sort((a, b) => a - b), mid = sample.length / 2, median = ((sample[mid - 1] ?? 0) + (sample[mid] ?? 0)) / 2;
   assert.ok(median < 4, String(median));
 });
@@ -97,7 +97,7 @@ test("stage link: arrival is the target's first link back to the source, in arra
   const files = linked(), bPath = `stages/${B}.json`, b = files[bPath]; if (!isObj(b)) throw new Error("b");
   const land = (links: readonly Obj[]): Sq => {
     const from = docsOf({ ...files, [bPath]: { ...b, links } }, A);
-    const got = arriveIn({ ...files, [bPath]: { ...b, links } }, from, { type: "link", linkType: "stairs", from: A, to: B, at: { c: 1, r: 0 } });
+    const got = arriveIn({ ...files, [bPath]: { ...b, links } }, A, B, { side: "player", members: from.chosen.map((unitId) => ({ unitId, hp: 1000000000 })), bar: null });
     if (got.docs === null) throw new Error(got.error); return heroAt(createMatch(got.docs, 200));
   };
   assert.deepEqual(land([{ type: "door", at: { c: 3, r: 1 }, to: A }, { type: "stairs", at: { c: 2, r: 1 }, to: A }]), { c: 3, r: 1 });
```

### `tests/tools/autosave-links.test.ts` (new)

```ts
import assert from "node:assert/strict"; import { test } from "node:test";
import { createRng } from "../../src/core/rng/index.ts"; import { setAutosave } from "../../src/editor/stage/links.ts"; import { deleteStage, setStart } from "../../src/editor/stage/rooms.ts";
import { readProject, type ProjectFiles } from "../../src/project/load/index.ts"; import { readManifest, readStage } from "../../src/project/read/index.ts"; import { readSession, sessionSave, settleSession } from "../../src/project/read/session.ts";
import { createLevels } from "../../src/rules/levels/index.ts"; import { arrival, autosaves } from "../../src/rules/session/links.ts"; import { partyOf } from "../../src/rules/session/party.ts";
import { SAVE_MIGRATIONS, type SaveChains } from "../../src/sim/migrations/save/index.ts"; import type { SaveHeader, SessionParty } from "../../src/types/core-types.ts";
import { shopFiles } from "../../tools/baseline/checkpoint.ts"; import { readAutosave, slotOf, writeAutosave } from "../../tools/maker/session.ts"; import { memoryStore, type MakerStore } from "../../tools/maker/store.ts";
import { createMatch } from "../../tools/play-stage/match.ts"; import { arriveIn, openProject } from "../../tools/play-stage/project.ts";
const S1 = "stage_01JDES00000000000000000001", S2 = "stage_01JDES00000000000000000002", H = "unit_01M81X2BX5ANZS5PWVAFHNCASA", R = "unit_01M81X2PKRZ2NQKAHDV247ZRX3", ID = "project_01M81X22DNRFYKC2MHE6JECEM3";
type Obj = Record<string, unknown>; type Match = ReturnType<typeof createMatch>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v), bad = (e: unknown, message: string): boolean => e instanceof Error && e.message === message;
const bag = (files: ProjectFiles): Record<string, Obj> => { const out: Record<string, Obj> = {}; for (const [k, v] of Object.entries(files)) if (isObj(v)) out[k] = v; return out; };
const party = (hp: number, members: SessionParty["members"] = [{ unitId: H, hp }]): SessionParty => ({ side: "player", members, bar: null });
const header: SaveHeader = { projectHash: "rev:12", engineVersion: "0.0.0", projectId: ID, savedAt: "2026-11-24T00:00:00.000Z" }, want = { projectId: ID, projectHash: "rev:12", engineVersion: "0.0.0" };
const hpOf = (m: Match): number | undefined => { const u = m.world.units.all().find((x) => x.unitId === H); return m.world.rules?.state().units.find((x) => x.id === u?.id)?.hp; };
const atOf = (m: Match, unitId: string, side: string): { c: number; r: number }[] => m.world.units.all().filter((u) => u.alive && u.unitId === unitId && u.side === side).map((u) => ({ c: u.at.c, r: u.at.r }));
const open = (files: ProjectFiles, from: string | null, to: string, body: SessionParty) => { const got = arriveIn(files, from, to, body); if (got.docs === null) throw new Error(got.error); return got.docs; };
const RULES = { bar: "side" as const, thresholds: [10], offerLevels: [1], offerSize: 1, xp: { move: 1 } }, free4 = (sq: { c: number; r: number }): boolean => sq.c >= 0 && sq.r >= 0 && sq.c < 4 && sq.r < 4 && !(sq.c === 2 && sq.r === 1);
const doc = (over: Obj = {}): Obj => ({ kind: "session-save", formatVersion: 1, header, from: S1, to: S2, party: party(2), ...over });
const boom = (m: Match, at: { c: number; r: number }): void => { const id = m.world.units.all().find((u) => u.alive && u.side === m.sides.me)?.id; if (id === undefined) throw new Error("hero"); if (m.world.phases.battle === "idle") m.feed({ type: "SelectUnit", unitId: id }); m.feed({ type: "TargetCell", at }); for (let i = 0; i < 40 && m.walk !== null; i += 1) { m.world.clock.advance(50); m.sync(); } };
test("step 8 party: hp and the side bar cross a link, capped at max; dead members and second copies stay behind; a kept offer is open again", () => {
  assert.equal(hpOf(createMatch(open(shopFiles(), S1, S2, party(2)), 200)), 2); assert.equal(hpOf(createMatch(open(shopFiles(), S1, S2, party(70)), 200)), 20);
  const docs = open(shopFiles(), S1, S2, party(20)); assert.throws(() => createMatch({ ...docs, rules: { ...docs.rules, carry: { side: "player", hp: { [H]: 0 } } } }, 200), (e: unknown) => bad(e, "createBattle: bad setup"));
  const got = partyOf([{ unitId: "a", side: "player", alive: true }, { unitId: "a", side: "player", alive: true }, { unitId: "b", side: "player", alive: false }], { a: 3, b: 1 }, "player", [{ id: "player", xp: 1, level: 2, banked: 4, offer: ["z"], abilities: ["q"] }]);
  assert.deepEqual(got.members, [{ unitId: "a", hp: 3 }]); assert.deepEqual(got.bar, { xp: 1, level: 2, banked: 4, offer: ["z"], abilities: ["q"] });
  const levels = createLevels({ rules: RULES, pools: { player: ["y"] }, start: [{ id: "player", xp: 1, level: 0, banked: 2, offer: ["y"], abilities: [] }] }, createRng(1), () => undefined);
  assert.deepEqual(levels.offer("player"), ["y"]); assert.equal(levels.state().bars[0]?.banked, 2);
  assert.throws(() => createLevels({ rules: RULES, pools: {}, start: [{ id: "player", xp: -1, level: 0, banked: 0, offer: null, abilities: [] }] }, createRng(1), () => undefined), (e: unknown) => bad(e, "createLevels: bad start"));
  assert.throws(() => createLevels({ rules: RULES, pools: {}, start: [{ id: "player", xp: 0, level: 0, banked: 0, offer: [1 as never], abilities: [] }] }, createRng(1), () => undefined), (e: unknown) => bad(e, "createLevels: bad start"));
  assert.throws(() => partyOf([{ unitId: "a", side: "player", alive: true }], {}, "player", null), (e: unknown) => bad(e, "partyOf: no hp"));
});
test("step 8 occupied arrival: taken or closed cells are skipped and the party fills the nearest free cells, N E S W", () => {
  assert.deepEqual(arrival([], "x", [{ c: 2, r: 2 }], 3, free4), [{ c: 2, r: 2 }, { c: 3, r: 2 }, { c: 2, r: 3 }]); assert.deepEqual(arrival([{ type: "stairs", at: { c: 2, r: 1 }, to: "x" }], "x", [{ c: 2, r: 2 }], 1, free4), [{ c: 2, r: 2 }]);
  const files = shopFiles(), path = `stages/${S2}.json`, stage = files[path]; if (!isObj(stage)) throw new Error("s2");
  const m = createMatch(open({ ...files, [path]: { ...stage, enemyPool: { mode: "fixed", entries: [{ unitId: R, at: { c: 1, r: 4 } }] } } }, S1, S2, party(20, [{ unitId: H, hp: 20 }, { unitId: R, hp: 2 }])), 200);
  assert.deepEqual(atOf(m, H, m.sides.me), [{ c: 0, r: 4 }]); assert.deepEqual(atOf(m, R, m.sides.me), [{ c: 1, r: 3 }]); assert.deepEqual(atOf(m, R, "rival"), [{ c: 1, r: 4 }]);
});
test("step 8 autosave: only an autosave link outside a battle saves; the session save round-trips; nothing is written over a refused or unreadable file, or for a party the reader refuses", async () => {
  const on = { type: "stairs" as const, at: { c: 1, r: 4 }, to: S2, autosave: true as const }; assert.equal(autosaves(on, false), true); assert.equal(autosaves(on, true), false); assert.equal(autosaves({ type: "stairs", at: { c: 1, r: 4 }, to: S2 }, false), false);
  const walked = (enemy: boolean): boolean => { const files = shopFiles(), path = `stages/${S1}.json`, stage = files[path]; if (!isObj(stage)) throw new Error("s1"); const links = [{ type: "stairs", at: { c: 1, r: 4 }, to: S2, autosave: true }], pool = enemy ? { mode: "fixed", entries: [{ unitId: R, at: { c: 3, r: 4 } }] } : stage["enemyPool"]; const m = createMatch(open({ ...files, [path]: { ...stage, links, enemyPool: pool } }, null, S1, party(20)), 200), got: { autosave: boolean }[] = []; m.onLink((ev) => got.push(ev)); boom(m, { c: 1, r: 4 }); const hit = got[0]; if (hit === undefined) throw new Error("link"); return hit.autosave; };
  assert.equal(walked(false), true); assert.equal(walked(true), false);
  const store = memoryStore(), body = party(2), wrote = await writeAutosave(store, header, S1, S2, body), back = await readAutosave(store, want);
  assert.equal(wrote.ok, true); assert.equal(back?.ok, true); if (back !== null && back.ok) assert.equal(back.save.to, S2); assert.equal([...store.files.keys()].some((k) => k.startsWith("tileengine/projects/")), false);
  const slot = slotOf(ID), keep = async (text: string): Promise<void> => { store.files.set(slot, text); const res = await writeAutosave(store, header, S1, S2, body); assert.equal(res.ok, false); assert.equal(store.files.get(slot), text); };
  await keep(JSON.stringify({ kind: "session-save", formatVersion: 2 })); await keep("{");
  store.files.set(slot, JSON.stringify(sessionSave({ ...header, projectHash: "rev:1" }, S1, S2, body))); assert.equal((await writeAutosave(store, header, S1, S2, body)).ok, true); assert.equal(store.files.get(slot)?.includes('"projectHash":"rev:12"'), true);
  const held = "{\"v\":2}", disk: MakerStore = { ...store, read: (path) => path === slot ? Promise.reject(new Error("disk")) : store.read(path) }; store.files.set(slot, held);
  await assert.rejects(() => writeAutosave(disk, header, S1, S2, body), (e: unknown) => bad(e, "disk")); assert.equal(store.files.get(slot), held);
  const fresh = memoryStore(); assert.equal((await writeAutosave(fresh, header, S1, S2, party(1, []))).ok, false); assert.equal(fresh.files.size, 0); assert.equal((await writeAutosave(fresh, header, S1, S2, body)).ok, true);
  const full = memoryStore(); full.failOn(`tileengine/saves/${ID}/autosave.json.tmp`); assert.equal((await writeAutosave(full, header, S1, S2, body)).ok, false);
});
test("step 8 session start: read and checked, a new game starts there, and the start stage can't be deleted", () => {
  const files = bag(shopFiles()), started = setStart(files, S2), man = readManifest(started["project.json"]); assert.equal(man.ok && man.doc.project.session?.start, S2);
  const opened = openProject(started); if (opened.docs === null) throw new Error(opened.error); const stage = opened.docs.stage; assert.equal(isObj(stage) && stage["id"], S2);
  const refused = deleteStage(started, S2); assert.equal(refused.ok, false); if (!refused.ok) assert.equal(refused.reason, "The game starts here. Pick another start first."); assert.equal(setStart(started, "no-such-stage"), started);
  const first = setStart(files, S1), again = readManifest(first["project.json"]); assert.equal(again.ok && again.doc.project.session?.start, S1);
  const root = structuredClone(files["project.json"]); if (!isObj(root) || !isObj(root["project"])) throw new Error("root");
  const gone = { ...files, "project.json": { ...root, project: { ...root["project"], session: { start: "missing-stage" } } } }, dangling = readProject(gone).report.find((row) => row.path === "project.json#/project/session/start");
  assert.equal(dangling?.code, "brokenRef"); assert.equal(dangling?.severity, "hard"); assert.equal(readManifest({ ...root, project: { ...root["project"], session: { start: 3 } } }).ok, false);
});
test("step 8 link sheet: autosave on writes true, off drops the key, and readStage keeps it", () => {
  const stage = bag(shopFiles())[`stages/${S1}.json`]; if (stage === undefined) throw new Error("s1");
  const on = setAutosave(stage, 1, 4, true), link = Array.isArray(on["links"]) ? on["links"][0] : undefined; assert.equal(isObj(link) && link["autosave"], true);
  const off = setAutosave(on, 1, 4, false), dropped = Array.isArray(off["links"]) ? off["links"][0] : undefined; assert.equal(isObj(dropped) && Object.hasOwn(dropped, "autosave"), false);
  const kept = readStage(on, { picks: 0, waveUnits: 0 }); assert.equal(kept.ok && kept.doc.links?.[0]?.autosave, true);
  assert.equal(readStage({ ...stage, links: [{ type: "stairs", at: { c: 1, r: 4 }, to: S2, autosave: "yes" }] }, { picks: 0, waveUnits: 0 }).ok, false);
});
test("step 8 link event: a stage with no string id throws instead of sending an empty from", () => {
  const opened = openProject(shopFiles()); if (opened.docs === null) throw new Error(opened.error);
  const m = createMatch(opened.docs, 200); m.onLink(() => undefined); if (isObj(opened.docs.stage)) opened.docs.stage["id"] = 7;
  assert.throws(() => boom(m, { c: 1, r: 4 }), (e: unknown) => bad(e, "play: stage id")); assert.throws(() => arriveIn(shopFiles(), "", S2, party(20)), (e: unknown) => bad(e, "play: stage id"));
});
test("step 8 link rebuild with the party carry and the autosave write fits the step 7 budget", async () => {
  const files = shopFiles(), store = memoryStore(), times: number[] = [], body = party(20);
  for (let i = 0; i < 25; i += 1) { const t0 = performance.now(); createMatch(open(files, S1, S2, body), 200).scene(); await writeAutosave(store, header, S1, S2, body); times.push(performance.now() - t0); }
  const sample = times.slice(5).sort((a, b) => a - b), mid = sample.length / 2, median = ((sample[mid - 1] ?? 0) + (sample[mid] ?? 0)) / 2; console.log(`step 8 rebuild median ${median.toFixed(2)} ms`); assert.ok(median < 4, String(median));
});
test("step 8 session save (D28): v1 only, migrated first by migrateSave, mismatches are notices, bad parties refused, dangling refs dropped", async () => {
  const older = readSession({ ...doc(), formatVersion: 0 }, want), newer = readSession({ ...doc(), formatVersion: 2 }, want);
  assert.equal(!older.ok && older.code, "saveFormatOlder"); assert.equal(!newer.ok && newer.code, "saveFormatNewer");
  const wrong = readSession(doc({ header: { ...header, projectId: "other" } }), want); assert.equal(!wrong.ok && wrong.code === "invalidValue" && wrong.detail, "projectId");
  const mis = readSession(doc({ header: { ...header, projectHash: "rev:1", engineVersion: "9" } }), want); assert.equal(mis.ok, true); if (mis.ok) assert.deepEqual(mis.notes.map((n) => n.code), ["saveProjectMismatch", "saveEngineMismatch"]);
  for (const members of [[], [{ unitId: H, hp: 2 }, { unitId: H, hp: 2 }], [{ unitId: H, hp: 0 }], [{ unitId: H, hp: 1.5 }]]) assert.equal(readSession(doc({ party: { side: "player", members, bar: null } }), want).ok, false);
  const store = memoryStore(), slot = slotOf(ID), v0 = { kind: "session-save", formatVersion: 0, header, from: S1, to: S2, party: { side: "player", members: [H], hp: { [H]: 2 } } };
  store.files.set(slot, JSON.stringify(v0)); const bare = await readAutosave(store, want); assert.equal(bare !== null && !bare.ok && bare.code, "saveFormatOlder");
  const lift = (row: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> => { const p = row["party"]; if (!isObj(p) || !Array.isArray(p["members"]) || !isObj(p["hp"]) || typeof p["side"] !== "string") throw new Error("party"); const hp = p["hp"]; return { ...row, formatVersion: 1, party: { side: p["side"], bar: null, members: p["members"].flatMap((id) => typeof id === "string" && typeof hp[id] === "number" ? [{ unitId: id, hp: hp[id] }] : []) } }; };
  const chains: SaveChains = { ...SAVE_MIGRATIONS, "session-save": { 0: lift } }, moved = await readAutosave(store, want, chains); assert.equal(moved?.ok, true); if (moved !== null && moved.ok) assert.equal(moved.save.party.members[0]?.hp, 2);
  const thrown: SaveChains = { ...SAVE_MIGRATIONS, "session-save": { 0: () => { throw new Error("nope"); } } }, failed = await readAutosave(store, want, thrown); assert.equal(failed !== null && !failed.ok && failed.code, "saveMigrationFailed");
  const settled = settleSession(sessionSave(header, "gone-from", "gone-to", party(2, [{ unitId: H, hp: 2 }, { unitId: "missing", hp: 3 }])), [S1, S2], [H, R], S2);
  assert.equal(settled.to, S2); assert.equal(settled.from, null); assert.deepEqual(settled.party.members, [{ unitId: H, hp: 2 }]); assert.equal(settled.notes.length === 3 && settled.notes.every((n) => n.code === "saveRefDropped"), true);
  assert.deepEqual(atOf(createMatch(open(shopFiles(), settled.from, settled.to, settled.party), 200), H, "player"), [{ c: 0, r: 4 }]);
});
```

### `handoff/steps/tests/s8-autosave-links/smoke.mjs` (new)

```js
// Step 08 autosave links. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8810", REV = "r1", PART = "step-08a-autosave-links"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev] [part]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s8-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/${PART}/${REV}`); mkdirSync(out, { recursive: true });
const DEMO = "stage_01JDAS00000000000000000001", MAP = "map_01JDAM00000000000000000001";
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const sheet = (page, title) => page.waitForFunction((t) => [...document.querySelectorAll(".sheet h2")].some((h) => h.textContent === t), title, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); }); const tiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`) }); };
    const see = async () => tiny.push(...await page.evaluate(() => [...document.querySelectorAll(".sheet button, .sheet input, [data-act='continue']")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 280)).catch(() => ""); check(`${name} @${width}`, false, `${String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 160)} || ${text}`); } };
    const hero = (at) => page.waitForFunction((at) => { const m = window.__play; return m !== undefined && m.walk === null && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === at.c && u.at.r === at.r); }, at, { timeout: 15000 });
    const go = async (from, to) => { await hero(from); await page.evaluate((p) => { const m = window.__play, id = m.world.units.all().find((u) => u.alive && u.side === m.sides.me && u.at.c === p.from.c && u.at.r === p.from.r).id; if (m.world.phases.battle === "idle") m.feed({ type: "SelectUnit", unitId: id }); m.feed({ type: "TargetCell", at: p.to }); }, { from, to }); };
    const quiet = () => page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 });
    let up = "";
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await step("1 new", async () => { await tap(page, "new"); await sheet(page, "Pick a start"); await tap(page, "toname"); await sheet(page, "Name it"); await tap(page, "create"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); });
    await step("2 upstairs", async () => { await tap(page, "r:add"); await sheet(page, "Add stage"); await see(); await tap(page, `r:use:${MAP}`); await page.waitForFunction((demo) => document.querySelectorAll(".cell").length === 54 && new URLSearchParams(location.search).get("stage") !== null && new URLSearchParams(location.search).get("stage") !== demo, DEMO, { timeout: 15000 }); up = await page.evaluate(() => new URLSearchParams(location.search).get("stage") ?? ""); if (up === "") throw new Error("stage"); });
    await step("3 stairs down, autosave on", async () => { await tap(page, "s:cell:3,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:place:spawn"); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:3,7"]')?.getAttribute("aria-label") ?? "").includes("You"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:link:stairs"); await sheet(page, "Stairs goes to"); await see(); await tap(page, `s:to:${DEMO}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:2,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await waitText(page, "Autosave here: Off"); await see(); await tap(page, "s:autosave"); await page.waitForFunction(() => document.querySelector('[data-act="s:autosave"]')?.getAttribute("aria-pressed") === "true" && (document.querySelector('[data-act="s:autosave"]')?.textContent ?? "").includes("Autosave here: On"), null, { timeout: 15000 }); await see(); await shot("01-autosave-on"); await tap(page, "s:close"); });
    await step("4 game starts upstairs, stairs up", async () => { await tap(page, "s:back"); await page.waitForFunction(() => [...document.querySelectorAll("h2")].some((h) => h.textContent === "Stages"), null, { timeout: 15000 }); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:start"); await page.waitForFunction(() => document.querySelector(".sheet") === null, null, { timeout: 15000 }); await quiet(); await tap(page, `stage:${DEMO}`); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54 && (document.querySelector("h1")?.textContent ?? "").includes("Demo stage"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:link:stairs"); await sheet(page, "Stairs goes to"); await see(); await tap(page, `s:to:${up}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); });
    await step("5 start can't be deleted", async () => { await tap(page, "s:back"); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:delete"); await waitText(page, "The game starts here. Pick another start first."); await see(); await shot("02-start-refusal"); await tap(page, "r:close"); });
    await step("6 test starts upstairs, stairs autosave", async () => { await quiet(); await tap(page, "test"); await page.waitForFunction((id) => window.__play !== undefined && window.__docs?.stage?.id === id, up, { timeout: 15000 }); await go({ c: 3, r: 7 }, { c: 2, r: 7 }); await page.waitForFunction((id) => { const m = window.__play; return m !== undefined && m.walk === null && window.__docs?.stage?.id === id && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === 0 && u.at.r === 7); }, DEMO, { timeout: 15000 }); await shot("03-downstairs"); });
    await step("7 continue", async () => { await press(page, "Back to maker", true); await page.waitForFunction(() => document.querySelector('[data-act="continue"]') !== null, null, { timeout: 15000 }); await see(); await page.evaluate(() => { delete window.__play; delete window.__docs; }); await tap(page, "continue"); await page.waitForFunction(() => { const m = window.__play; return m !== undefined && m.walk === null && window.__docs?.stage?.id === "stage_01JDAS00000000000000000001" && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === 0 && u.at.r === 7); }, null, { timeout: 15000 }); await shot("04-continue"); });
    check(`8 targets @${width}`, tiny.length === 0 && errs.length === 0, tiny.length === 0 && errs.length === 0 ? "ok" : [...new Set(tiny)].concat(errs).join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```
