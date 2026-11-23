# Rebuild record: step 7, stage links and the two-floor shop

Original brief: [`docs/maker/steps/step-07-stage-links.md`](../maker/steps/step-07-stage-links.md) on the merge (r4, blob `d482f594`, sha256 `07ed93ed1d89b1b9d4116455b451e36d8349a19ab2fed8582778dcf263d36016`, 236 lines). Delivery L14; Goal L21; Data L69; Rules L84; Build L119; Named tests L147; Smoke L169; Must NOT L190; Done when L196. Count command and hard per-file caps are L142–144; caps sum 302 at L143. The smoke has its own cap of 90, outside the 400 (L140, L142). The file is unchanged from the 7 product base through the merge; current main adds only the QA review.

Sources: PR #94 and branch `step/step-07-stage-links-r1-chatA` (tip `d1de6952`, code head `11928259`); `handback/step-07-stage-links/r1/HANDBACK.md` at `d1de6952` and on the merge (HB, blob `65b1407b`, 131 lines, sha256 `d12075b69a91f23518f454f31237ad9c04b772432c26dbf22b8c742f2291bf19`); CoS verify report `/workspace/share/step-07-verify/report.md` (V, 55 lines, sha256 `8995d3fd3ef22d8f39b3b04f8a282848329d319c1066c0b0b9b2dd8130f6651a`, hash-object `c39a1d214bb4724e4b15373aaf03427d2de95aaf`); QA review `docs/qa/step-07-review.md` on main `771b98ae` (QA, 19 lines, sha256 `b1ce44428a3f2f45b4ce7d87cf6d6408dfb110cd6b6007e32f8a0b384b5e8cf1`, hash-object `7bcb93ddfe9f87ba6ec0450acca653c957d38030`). Line cites use HB, V and QA. Product line cites are at merge `24ab0250` (tree `4cb2f241`, the tip tree).

## (a) Start and finish

| | Value |
|---|---|
| Base | `33538c8995f2ff57d4b1c3abd1c4a11803363105`, 2026-11-23 14:02 (UK time). Floor **1108** tests (guide L10 / L197: 6d's final count + N). After this merge the floor is **1114**. Current `origin/main` at merge time was that same base. It is docs and staging only since `ce4ded7e`: DSK D27 (`18902648`), this guide and its QA review and recheck (`f1113f23`), and the staged CN diff `data/staging/cn-links/cn-links.diff` (sha256 `1428ec8c0e7c60d3042c0d5c39192c3795541ab7c49a719ba4ccf7ddb6b664d2`) |
| r1 commits | `1192825996a72198a66e16f63e1fbcb45bf13c03` feat(stage): links swap the play stage when a player lands (code head, tree `4cc920afb88bfea23dbf07b5ed971287d8238af2`, 2026-11-23 20:27 UK time), `d1de69525cf324ddb5b4125aeb0ac22cc166186f` docs(handback): step 7 stage links r1 (tree `4cb2f241737f752e4621027d4ae74b10fa576ff7`, 2026-11-23 20:29 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the hand-back folder only: `HANDBACK.md` and five 390×844 RGB shots (`01-goes-to.png` … `05-back-down.png`) (V:6, QA:7) |
| r1 verdict | QA **OK TO MERGE** (QA:5). No must-fix, no rework round (QA:5, V:3). Green 1114/0, official G7 265 with every per-file cap kept, s7 on 8809 and S0 on 8797 both PASS, export audit clean, tools tsc still the three base errors only (V:20–21, QA:8–13). Non-blockers (QA:16–19) are recorded below |
| Merge | PR #94 "Step 7: stage links and the two-floor shop", merge commit `24ab02502b2822745f911f81977da44bf68ed521`, 2026-11-23 20:50 (UK time). Tree `4cb2f241737f752e4621027d4ae74b10fa576ff7` (the same tree CoS and QA predicted against `33538c89`, and the tip tree, because main had not moved; V:23, QA:5, QA:7). First parent `33538c89` (main at merge, which is also the product base), second parent `d1de6952`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| After the merge | main is `771b98ae9a2f0441b3007e11aa336b394bbc2977`, 2026-11-23 20:51 (UK time), tree `db15ccff6bb602b2370294b47605df488625b934`, which adds only `docs/qa/step-07-review.md` (19 insertions, sha256 `b1ce4442`, hash-object `7bcb93dd`). **QA postmerge: PASS** on `24ab0250` (tree `4cb2f241`, parent2 `d1de6952`, green 1114/0, smoke 0 failed, merge matches the tip; `771b98ae` adds only the review doc). Its one FAIL line was the CoS pin list still at `d6d08696`; the D27 CN move to `fd27de06` is expected, and the CoS pin is now bumped. |
| Tests | 1108 + N=6 (the six named tests in `tests/tools/stage-links.test.ts`) = **1114 pass / 0 fail**. Floor after this merge is **1114** (HB:31, V:20, QA:8) |

## (b) Files

From `git diff --name-status 33538c89..11928259 -- . ':!handback/**' ':!handoff/steps/tests/s7-stage-links/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base. The same product files are on the merge tree `4cb2f241`. The step 7 guide docs on the merge are from first parent `33538c89`, not from this branch. The smoke is **not** in the official 400 (guide L140, L142); it has its own cap of 90.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/types/core-types.ts` | M | 7 / 0 | 7 (L122) | yes. sits on the cap, not over (HB:50, QA:11, V:19) |
| `tests/smoke.test.ts` | M | 1 / 1 | 2 (L123) | yes. sits on the cap (the pin line only) |
| `src/project/read/stage.ts` | M | 11 / 2 | 16 (L124) | yes. 13 |
| `src/rules/session/links.ts` | A | 14 / 0 | 18 (L125) | yes |
| `src/editor/stage/links.ts` | A | 15 / 0 | 18 (L126) | yes |
| `src/editor/stage/rooms.ts` | M | 3 / 1 | 8 (L127) | yes. 4 |
| `src/editor/stage/resize.ts` | M | 3 / 3 | 8 (L128) | yes. 6 |
| `src/project/load/read-project.ts` | M | 1 / 0 | 3 (L129) | yes |
| `src/project/load/drops.ts` | M | 1 / 0 | 3 (L130) | yes |
| `tools/play-stage/project.ts` | M | 15 / 1 | 18 (L131) | yes. 16 |
| `tools/play-stage/load.ts` | M | 2 / 2 | 4 (L132) | yes. sits on the cap |
| `tools/play-stage/match.ts` | M | 4 / 1 | 8 (L133) | yes. 5 |
| `tools/play-stage/page.ts` | M | 10 / 4 | 16 (L134) | yes. 14 |
| `tools/maker/test-launch.ts` | M | 5 / 3 | 10 (L135) | yes. 8 |
| `tools/maker/home.ts` | M | 7 / 8 | 16 (L136) | yes. 15 |
| `tools/maker/stage.ts` | M | 19 / 13 | 34 (L137) | yes. 32 |
| `tools/maker/stage-sheets.ts` | M | 3 / 0 | 8 (L138) | yes |
| `tests/tools/stage-links.test.ts` | A | 105 / 0 | 105 (L139) | yes. sits on the cap |
| `handoff/steps/tests/s7-stage-links/smoke.mjs` | A | 47 / 0 | 90 (L140) | no (own cap, outside the 400) |

No diff under `src/core`, `src/sim`, `fixtures/`, `data/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`. Existing tests and frozen smokes are unedited except the one pin line in `tests/smoke.test.ts`. `tests/project/load/one-parser.test.ts` has zero diff (HB:32, V:18, V:22, QA:12). Official G7 is **18 files changed, 226 insertions(+), 39 deletions(-)** = 265 ≤ 400. Every per-file cap is kept. Caps sum 302 (guide L143) is not a second gate. No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base.

## (c) Key code and git commands

Step 7 puts `stage.links` on the stage document (not the map), wires a link placer in the maker, and swaps the play stage when a player-side unit lands on a link cell (guide L21–22, Rules 1–4). There is no autosave, no session start field, and no party hp / xp / level carry (Must NOT L193, Deferred L82; those are step 8).

**CN.** Apply `data/staging/cn-links/cn-links.diff` (sha256 `1428ec8c0e7c60d3042c0d5c39192c3795541ab7c49a719ba4ccf7ddb6b664d2`, already on the base) to `src/types/core-types.ts` byte for byte. The base file is sha256 `d6d0869644f3c9876aa1101d8a7248f8b5a18b3beabcb0b191c9c42fec88a366`. The result must be `fd27de06c035ab8c3767a31ad0cf2bf75fa74ca200487a6e2ea762f2d90e747d` (guide L81, HB:49, V:18, QA:12). The diff's filenames are `core-types.cc64602a.ts` and `core-types.staged.ts`. It adds `LinkType` and `CoreLink` (`core-types.ts:162-167`) and `CoreStage.links?: ReadonlyArray<CoreLink>` (`:186`). No formatVersion bump: `CurrentFormatVersions["stage"]` stays 2 (`core-types.ts:26`). Then move the pin in `tests/smoke.test.ts` L14 from `d6d08696…` to `fd27de06…` (that one line only):

```ts
  assert.equal(sha, "fd27de06c035ab8c3767a31ad0cf2bf75fa74ca200487a6e2ea762f2d90e747d");
```

**Engine rule, one reader.** New `src/rules/session/links.ts` imports `CoreLink`, `LinkType` and `Sq` from `core-types.ts` and does not redefine them (`links.ts:1-3`, V:22). It holds `LINK_TYPES`, `LinkEvent`, `linkAt`, `arrival` (doc comment: "first link in array order", `:7-10`) and `linkEvent`. There are no game words in `src/` or `tools/play-stage/` (V:22). `readStage` is the only link parser (`src/project/read/stage.ts:37-43,104`). `links(v)` returns `undefined` when the field is absent, `null` (then `bad("links")`) when the value is not an array or any entry has a bad `type`, `at` or `to`, and otherwise a `CoreLink[]`. It copies only `type`, `at` and `to`, so a stray `autosave` is ignored. `countOf` adds `tooMany(json.links, lim.spots)` → `overCap("links")` (`:80`). The result spreads `...(linkList === undefined ? {} : { links: linkList })` (`:116`). `playDocsOf` does no link parsing of its own: it calls `readStage(stage, { picks: 0, waveUnits: 0 })` and throws the existing `play: stage` if that read fails (`project.ts:51`); it sets `links: core.doc.links ?? []` (`:76`). `PlayDocs` gains `links?: readonly CoreLink[]` (`load.ts:23`).

`src/project/load/read-project.ts:37` adds one `refs()` line: a `to` equal to the stage's own id is `brokenRef` / `hard` at `#/links/<i>/to`; otherwise `has(stages, l["to"], …)`. `drops.ts:29` adds `["links", false, list(stage["links"])]` to `placementDrops`. `resize.ts:3` adds `"links"` to `PlaceDrop["list"]`, `:46` maps that key onto the `"links"` list name, and `:50` adds `cut("links", false, false)` to the resize chain.

**Delete refusal and the placer.** New `src/editor/stage/links.ts` holds `linkOn`, `addLink` (returns `null` for a self-link, `:9`), `removeLink`, and `linksTo` (display name `"Stage"` when a live stage has no string name, `:14`; QA:14, display-only). Each returns a copy (`structuredClone`, `:5`). `deleteStage` refuses with `A link on ${named.join(", ")} leads here. Remove it first.` when `linksTo` is non-empty (`rooms.ts:44`). The `refsTo` doc comment stays mapRef-only (`rooms.ts:11`).

In the stage editor, `Sess` gains `link: "stairs" | "door" | "gate" | null` (`stage.ts:27-28`). On an empty open tile, when another live stage exists, the Add here sheet shows a Link group (`s:link:<type>`, `:154,240`) and then `goesSheet` (`stage-sheets.ts:4-6`, `stage.ts:169`). `s:to:` commits `addLink` in one undo step only if it returns non-null and the id is a live stage (`:241`); the goes-to sheet never lists the stage itself (`:169`). A link tile shows `S↗` / `D↗` / `G↗`, with `, Stairs` (or Door / Gate) in its `aria-label` (`:102,105`), and a sheet "Stairs to \<name\>" with Remove link (`s:unlink`, `:152,155,242`).

**Play stage and Law 13.** When the player's side lands, `match.ts:80` checks `linkAt(body.links ?? [], who.at)` and calls `onLink` (`:120`). The enemy path is unchanged (WAIT / UNIT_DONE / `pump()` and return). On a player link it returns without `pump()`.

`startMatch` takes a fourth argument `travel?` (`page.ts:16`). The resize handler is named (`:57`); `addEventListener("resize", onResize)` is at `:58`. `stop()` is `driver.dispose(); removeEventListener("resize", onResize)` (`:59`). `driver.dispose()` appears once in `page.ts`, inside `stop`. Travel (`:81`) and Back to maker (`:82`) call `stop()`. `end.go` starts as `location.reload` (`:39`) and is reassigned after `stop` is in scope (`:60`) to `stop(); if (back !== undefined) back();`. Restart with `back` set calls `end.go()` (`:42`, HB:124, V:21). No new rAF, timer or loop: `requestAnimationFrame` appears only in the existing driver `HostEnv` (`page.ts:29`).

`arriveIn` (`project.ts:93-102`) opens `link.to` through `openProject`. It sets the target's `playerSpawns` to `arrival(...)` (keeping a spawn's facing only when that same cell already had one, `:99`) and `chosen` to `from.chosen.slice(0, playerSpawns.length)` (`:102`). The play stage does not import `tools/maker`. `test-launch.ts` exports `type Next` (`:12`) and `play()` passes `(from, link) => arriveIn(parsed.files, from, link)` (`:28`) — the files snapshot taken at Test. In `home.ts`, `enterPlay` lifts the old back body into `out()` (`:53-55`). `travel` calls `next`: on an error it runs `out()` and shows the error in `state.problems` (`:56`); otherwise it removes the canvas and `#hud` and calls `enterPlay(got.docs, scroll, undefined, next)`.

```ts
const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };
end.go = (): void => { stop(); if (back !== undefined) back(); };
```

```ts
if (travel !== undefined) match.onLink((link) => { stop(); travel(link); });
if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { stop(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
```

**`match.ts:80` `""` as `from` when the stage has no string id is a carry, not a must-fix** (QA:17). `linkEvent(hit, typeof from === "object" && from !== null && "id" in from && typeof from.id === "string" ? from.id : "")` defaults to `""`, and `arrival` then treats that as no back link and falls back to `playerSpawns`. QA notes this cannot happen after `readStage` validates the stage (`stage.ts` requires `id` as a string before the result is built), but a later tidy step should throw instead of defaulting. `arriveIn` has the same fallback at `project.ts:94`. Do not "fix" either in isolation as part of a step 7 rebuild.

The six named tests, closed on their last line, all in `tests/tools/stage-links.test.ts` (V:20, QA:8, guide L147–167):

```ts
test("stage link: landing on stairs takes the party to the linked stage, arriving on the stairs back", () => {
```

```ts
test("stage link rebuild fits the frame budget", () => {
```

```ts
test("stage link: the reader warns on a link off the map and refuses a link to a missing stage, to itself, or malformed", () => {
```

```ts
test("stage link: a stage a link leads to can't be deleted until the link is removed", () => {
```

```ts
test("stage link: a resize drops a link cell outside the map with a placementDropped row", () => {
```

```ts
test("stage link: arrival is the target's first link back to the source, in array order", () => {
```

They run at `:41-58`, `:59-64`, `:65-80`, `:81-86`, `:87-94` and `:95-105`. Test 1 also asserts `driver.dispose()` appears once, inside the exact `stop` string (`:56-57`). Test 2 times `arriveIn` + `createMatch` + `scene()`, drops the first 5 of 25 runs, and asserts the even-count median is `< 4` ms (`:62-63`). HB:49 prints 1.189 ms on Node v22.23.3; the CoS verify measured 0.763 ms on Node v24.22.1 (V:27, QA:18). Both are under 4.

The s7 smoke (`handoff/steps/tests/s7-stage-links/smoke.mjs`, 47 lines, port 8809) does a dev maker `build()` into a temp dir and serves it (`smoke.mjs:7-10`; guide L169–172). Widths 390 and 360. Every wait is `waitForFunction` (`:18,27,29,32-39`); `waitForTimeout` count is 0 (V:21, QA:9). Check 9 reads live `"resize"` counts via an `addInitScript` wrap (`:22,40-41`) and passes only on `{"maker":0,"play":1,"up":1,"down":1,"back":0}` at both widths (guide L185, HB:64, V:21, QA:9). Shots go to the hand-back folder at 390 (`:23`).

S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, identical on the base, the code head, the tip and the merge (V:21, QA:10). Play-stage files change, so S0 on 8797 is required: 14 ok lines and `TOUCH SMOKE PASS`.

Export audit on the clean code head (HB:97–108, V:21, guide L188):

```
node tools/play-stage/build.ts /tmp/s7-play
node tools/maker/build.ts /tmp/s7-maker
rg -n -e 'tools/maker' -e 'src/editor' -e 'catalogue.json.js' -e 'behaviours.json' /tmp/s7-play /tmp/s7-maker/play-stage
```

Both builds exit 0. No `tools/maker` or `src/editor` text, and no `catalogue.json.js` / `behaviours.json` files, in the play-stage tree or the maker build's `play-stage/` tree. The only `rg` hits are the pre-existing comment in `src/rules/behaviours/catalogue.js:4`.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts` twice). The home.ts pair is the pre-existing `behaviourId` errors, shifted 79→78 by the allowed `enterPlay` / `launchTest` edit (HB:32, V:20). Leave them.

The official count command (guide L142):

```
# Product gate. The first parent of the merge is 33538c89, which is also
# the product base. Official command at the code head, the tip, or the
# merge against 33538c89:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' \
#     ':!handoff/steps/tests/s7-stage-links/**'
#   18 files changed, 226 insertions(+), 39 deletions(-)
#
# The same 265 at the r1 code head or r1 tip against 33538c89.
# Against 771b98ae (current main, the QA-review commit, not this step's
# base), the official command also counts docs/qa/step-07-review.md
# (19 files, 245 insertions, 39 deletions). That file is not this step.
# Adding ':!docs/**' at the merge against 771b98ae gives the official 265.

# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

# CN: base core-types.ts sha256 d6d08696…, staged diff 1428ec8c…,
#     applied result and pin fd27de06….

# Named tests (npm test 1114/0, floor 1108 + N=6):
#   ✔ stage link: landing on stairs takes the party to the linked stage, arriving on the stairs back
#   ✔ stage link rebuild fits the frame budget
#   ✔ stage link: the reader warns on a link off the map and refuses a link to a missing stage, to itself, or malformed
#   ✔ stage link: a stage a link leads to can't be deleted until the link is removed
#   ✔ stage link: a resize drops a link cell outside the map with a placementDropped row
#   ✔ stage link: arrival is the target's first link back to the source, in array order

# Smokes under google-chrome, at 390 and 360 CSS px:
#   s7 (8809):
#     10 ok lines @390 and @360, check 9
#     {"maker":0,"play":1,"up":1,"down":1,"back":0}, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# `wc -l handoff/steps/tests/s7-stage-links/smoke.mjs` is 47.
# Export audit as above; only the pre-existing catalogue.js comment hits.
```

## (d) What went wrong, in order, and the fix

**r1.** The links shipped in one feat commit and green was 1114/0. The official gate was 265, with every per-file cap kept (core-types 7/7, the pin 2/2, load 4/4, and the named-test file 105/105 sit on their caps). s7 passed 10/10 at 390 and at 360, including check 9, and S0 passed 7/7 at each width. The export audit was clean. No gap fix and no extra rework commit were needed. The tip holds only `HANDBACK.md` and the five 390 shots.

`const stop` cannot be named in the earlier Restart closure, because it is declared after `createHud`. The shipped fix is the `end.go` reassignment at `page.ts:60` (HB:124). The named test guards the Restart path by asserting the `stop` source string (`stage-links.test.ts:56-57`); the smoke drives travel and Back, not Restart (guide L154).

A direct `assert.deepEqual(got, [])` after the plain-tile move would let tsc narrow `got` to `never`. The shipped assert is `assert.deepEqual(got.slice(), [])` (HB:125, `stage-links.test.ts:46`).

QA **OK TO MERGE** (QA:5). No must-fix. The merge tree is `4cb2f241`, as predicted (QA:5, QA:7, V:23).

HB:3 said `PR: none yet from the branch`, which was true at hand-back and at CoS verify (V:5, V:22). No PR existed until after the hand-back. PR #94 was opened later.

## (e) Do it right first time

- Start from the product base `33538c89`. Do not start from `771b98ae` or `24ab0250`, because both already contain the 7 merge. The floor at the start of 7 was 1108 + N; this merge leaves the floor at 1114.
- Apply the staged CN `data/staging/cn-links/cn-links.diff` (sha256 `1428ec8c…`) to `src/types/core-types.ts` (sha256 `d6d08696…`) byte for byte. The result must be `fd27de06…`. Move only `tests/smoke.test.ts` L14. Do not bump `formatVersion`. Do not edit `one-parser.test.ts` or any other existing test, and do not edit `src/core`, `src/sim`, `fixtures/`, `data/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`.
- `readStage` is the only link parser. `playDocsOf` must not parse links or throw `play: link`. `links.ts` must import `CoreLink`, `LinkType` and `Sq` from `core-types.ts` and must not redefine them. No "shop" or "home" in `src/` or `tools/play-stage/`. No `tools/maker` import from `tools/play-stage/`. No `session` field, no `link.autosave` read or write, no arrival field, no link id, no pre-warming.
- Law 13: name the resize handler, put `driver.dispose()` once inside `stop()`, and call `stop()` on travel, Back to maker, and Restart (via `end.go` if `stop` is declared later). No second rAF, timer or loop.
- Per-file caps on this step are hard (guide L144): going over any one cap is stop-and-report, not a quiet overrun. Files may sit on their cap. Caps sum is not a second gate. The smoke cap of 90 is outside the 400.
- Do not "fix" `match.ts:80` (or `project.ts:94`) to throw when the stage has no string id; that is QA's carry for a later tidy step (QA:17). Do not add party hp / xp / level carry, occupancy notices on arrival, or a mid-battle link lock; those are the step 7 guide carries (guide L225–228) and belong to step 8 or a later ruling.
- Play-stage files change, so run S0 on 8797 and keep sha256 `d528795e…`, and run the export audit (guide L188). New waits are `waitForFunction`, not `waitForTimeout`. Check 9 must be `{"maker":0,"play":1,"up":1,"down":1,"back":0}` at both widths.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run in § Smoke. Print test 2's median once in the hand-back. The tip commit should hold `HANDBACK.md` and the five 390 screenshots, not raw test logs. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time.
- Measure with the count command (guide L142): `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!handoff/steps/tests/s7-stage-links/**'`. Count insertions plus deletions (checklist L26, BUILD_GUIDE.md L123). 265 is the accepted number for this step. On a merge whose first parent is not the product base, measure against that first parent (or at the code head), and do not treat first-parent or later QA docs as 7 lines. Here the first parent is the product base.
- The phone check (stair swap plus first draw, S21 Ultra and Red Magic 9 Pro) is not the builder's gate (guide L201–202, HB:131). Do not pre-warm from this step.

## (f) Rebuild check

From a clean tree at `33538c8995f2ff57d4b1c3abd1c4a11803363105` (the product base and the merge's first parent), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files. Apply the CN with the staged diff; do not hand-edit `core-types.ts`.

```
# Product equality vs the merge (current main adds only the QA review):
#   git diff 24ab0250 HEAD -- src/types/core-types.ts tests/smoke.test.ts \
#     src/project/read/stage.ts src/rules/session/links.ts \
#     src/editor/stage src/project/load/read-project.ts src/project/load/drops.ts \
#     tools/play-stage tools/maker/test-launch.ts tools/maker/home.ts \
#     tools/maker/stage.ts tools/maker/stage-sheets.ts \
#     tests/tools/stage-links.test.ts handoff/steps/tests/s7-stage-links
#   (empty)

# Product gate. The first parent of the merge is 33538c89, which is also
# the product base. Official command at the code head, the tip, or the
# merge against 33538c89:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' \
#     ':!handoff/steps/tests/s7-stage-links/**'
#   18 files changed, 226 insertions(+), 39 deletions(-)
#
# The same 265 at the r1 code head or r1 tip against 33538c89.
# Against 771b98ae (current main, the QA-review commit, not this step's
# base), the official command also counts docs/qa/step-07-review.md
# (19 files, 245 insertions, 39 deletions). That file is not this step.
# Adding ':!docs/**' at the merge against 771b98ae gives the official 265.

# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

# CN: base core-types.ts sha256 d6d08696…, staged diff 1428ec8c…,
#     applied result and pin fd27de06….

# Named tests (npm test 1114/0, floor 1108 + N=6):
#   ✔ stage link: landing on stairs takes the party to the linked stage, arriving on the stairs back
#   ✔ stage link rebuild fits the frame budget
#   ✔ stage link: the reader warns on a link off the map and refuses a link to a missing stage, to itself, or malformed
#   ✔ stage link: a stage a link leads to can't be deleted until the link is removed
#   ✔ stage link: a resize drops a link cell outside the map with a placementDropped row
#   ✔ stage link: arrival is the target's first link back to the source, in array order

# Smokes under google-chrome, at 390 and 360 CSS px:
#   s7 (8809):
#     10 ok lines @390 and @360, check 9
#     {"maker":0,"play":1,"up":1,"down":1,"back":0}, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# `wc -l handoff/steps/tests/s7-stage-links/smoke.mjs` is 47.
# Export audit as above; only the pre-existing catalogue.js comment hits.
```

## QA non-blockers carried forward

- **`match.ts:80` passes `""` as `from` when the stage has no string id.** `linkEvent` then carries that empty id, and `arrival` falls back to `playerSpawns`. QA: this cannot happen after `readStage` validates the stage, but a later tidy step should throw instead of defaulting (QA:17). The same fallback is at `arriveIn` (`project.ts:94`). Do not "fix" it as part of a step 7 rebuild.
- **Party state isn't carried across a link.** `arriveIn` copies `chosen` only (`project.ts:102`) and opens a fresh stage; hp, xp and level reset to the unit recipe. That belongs to the session save, step 8 (guide L225, HB:127).
- **An arrival cell taken by a neutral or enemy.** `arrival` (`src/rules/session/links.ts:8-10`) does not check occupancy. `createUnits.place` (`src/core/unit/units.ts:41`, unedited this step) refuses a second body with `placeOccupied`. `src/sim/world.ts:59` (unedited) calls `units.place(p)` and ignores a failed place; the play stage does not show the notice. Home: the session layer, step 8 (guide L227).
- **A link in a contest stage fires mid-battle.** The placer allows it. On a player landing, `match.ts:80` calls `onLink` and returns without `pump()`; travel disposes the old match and starts a fresh one, so turn order is not left mid-transition. Whether a battle locks links is a later ruling (guide L228).
- **Test 2 median printed twice in HANDBACK** (HB:49 and HB:120). The go-line asked for it once. Not a gate (QA:18, V:28).
- **Median 0.763 ms on Node 24 vs 1.189 ms in the hand-back (Node 22).** Both are well under the 4 ms assert (QA:18, V:27). The ok-lines and the assert, not the exact median, are the pin.
- **Named-test serials** in the CoS run used `✔` and different numbers than HB's `ok 1100–1105`. The titles match (V:29).
- **HB:3 PR line** was true at hand-back; PR #94 was opened later.
- **Guide cite nits** (QA:19, verified at `24ab0250`): `raf-driver` `dispose()` is L97–101; `tools/play-stage/board.ts` L83–90 is the `sync` body through `onLand?.(); return;` and stops short of the function's brace at L95. Pre-existing, not a product fail.
- The phone check stays gated on CoS after merge (guide L201–202, HB:131). Do not pre-warm from this record.

## Blob check

Each file must have exactly this git blob id at `24ab0250`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/types/core-types.ts` | `8e34b6a1fd1f8cc682336673970b907a68742a97` | 412 |
| `tests/smoke.test.ts` | `7e879b121f478dcb0497c16e82ca911fb11c5a32` | 15 |
| `src/project/read/stage.ts` | `3ab2d89288d434d96c2b5b6a072c418ee83c19dc` | 118 |
| `src/rules/session/links.ts` | `63242b95dfa4cad4776e29d6ebfda5ec3eb7cee5` | 14 |
| `src/editor/stage/links.ts` | `758057e3fb7cf042deca99de61a0e66287a02266` | 15 |
| `src/editor/stage/rooms.ts` | `cfc5b89dd217c4df4e3b565cc439f842ab4ef3e4` | 51 |
| `src/editor/stage/resize.ts` | `7f709135f68d92853258863ad1ea46d2c155604f` | 63 |
| `src/project/load/read-project.ts` | `d7af3c32e421c5762bbc1c7f1c7897648dd777b9` | 113 |
| `src/project/load/drops.ts` | `0ccf9d96018cd2529c0440566dd381b18537ead6` | 52 |
| `tools/play-stage/project.ts` | `9b261c09f386a8cfbc072a58997c657c1f25c068` | 103 |
| `tools/play-stage/load.ts` | `3d55dc4c6f17c9a8fc4e377599a252be53fa2d48` | 28 |
| `tools/play-stage/match.ts` | `c4bf259e5cd60b2042f88f61bb533a08d55844e9` | 176 |
| `tools/play-stage/page.ts` | `8e298c636fb4a6a08b15150ae90e95a555487a33` | 86 |
| `tools/maker/test-launch.ts` | `ae1dd9e24b17a1f52f17a6ed740014a36498493c` | 45 |
| `tools/maker/home.ts` | `77b9c8ce77205e880988893297ee2e9fc5dd8247` | 157 |
| `tools/maker/stage.ts` | `fd882df1dc35344cf86c2e35c4266162e68fa19c` | 270 |
| `tools/maker/stage-sheets.ts` | `99e7990a2b50138b86f5c4c340639de64a5bb6e2` | 11 |
| `tests/tools/stage-links.test.ts` | `1ababc722c298fd25c0e3bffc78b2ce5ce638016` | 105 |
| `handoff/steps/tests/s7-stage-links/smoke.mjs` | `313c836959bc77b08af1bda031830fb31345a91d` | 47 |

## Appendix: full code as merged (step 7, PR #94)

New files are `git show 24ab0250:<path>` in full. Edited files are `git diff 33538c89 24ab0250 -- <path>`.

### `src/rules/session/links.ts` (new)

```ts
import type { CoreLink, LinkType, Sq } from "../../types/core-types.ts";
export const LINK_TYPES = ["stairs", "door", "gate"] as const satisfies readonly LinkType[];
export type LinkEvent = { readonly type: "link"; readonly linkType: LinkType; readonly from: string; readonly to: string; readonly at: Sq };
export function linkAt(links: readonly CoreLink[], at: Sq): CoreLink | null {
  return links.find((link) => link.at.c === at.c && link.at.r === at.r) ?? null;
}
/** `back` is the target's first link in array order whose `to` is the source stage. */
export function arrival(targetLinks: readonly CoreLink[], fromStageId: string, spawns: readonly Sq[]): readonly Sq[] {
  const back = targetLinks.find((link) => link.to === fromStageId);
  return back === undefined ? spawns : [back.at, ...spawns.filter((sq) => sq.c !== back.at.c || sq.r !== back.at.r)];
}
export function linkEvent(link: CoreLink, from: string): LinkEvent {
  return { type: "link", linkType: link.type, from, to: link.to, at: link.at };
}
```

### `src/editor/stage/links.ts` (new)

```ts
import type { LinkType } from "../../types/core-types.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const clone = <T>(v: T): T => structuredClone(v);
const onCell = (link: unknown, c: number, r: number): boolean => isObj(link) && isObj(link["at"]) && link["at"]["c"] === c && link["at"]["r"] === r;
export function linkOn(stage: Obj, c: number, r: number): Obj | null { const hit = list(stage["links"]).find((link) => onCell(link, c, r)); return isObj(hit) ? clone(hit) : null; }
export function addLink(stage: Obj, type: LinkType, c: number, r: number, to: string): Obj | null {
  if (to === stage["id"]) return null; const next = clone(stage); next["links"] = [...list(stage["links"]).filter((link) => !onCell(link, c, r)), { type, at: { c, r }, to }]; return next;
}
export function removeLink(stage: Obj, c: number, r: number): Obj { const next = clone(stage); next["links"] = list(stage["links"]).filter((link) => !onCell(link, c, r)); return next; }
export function linksTo(files: Record<string, Obj>, id: string): readonly string[] {
  const root = files["project.json"], proj = isObj(root) && isObj(root["project"]) ? root["project"] : {}, live = list(proj["stages"]);
  return Object.entries(files).flatMap(([path, doc]) => !path.startsWith("stages/") || !isObj(doc) || typeof doc["id"] !== "string" || doc["id"] === id || !live.includes(doc["id"]) ? [] : list(doc["links"]).some((link) => isObj(link) && link["to"] === id) ? [typeof doc["name"] === "string" ? doc["name"] : "Stage"] : []);
}
```

### `tests/tools/stage-links.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { addLink, removeLink } from "../../src/editor/stage/links.ts";
import { addStage, deleteStage, docsIn } from "../../src/editor/stage/rooms.ts";
import { resizeMap } from "../../src/editor/stage/resize.ts";
import { readProject } from "../../src/project/load/index.ts";
import { readStage } from "../../src/project/read/stage.ts";
import { arrival, type LinkEvent } from "../../src/rules/session/links.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { arriveIn, playDocsOf, type PlayOut } from "../../tools/play-stage/project.ts";
const DIR = "handback/step-06c-checkpoint/r1/checkpoint.tileproj";
const A = "stage_01JDEM00000000000000000003", B = "stage_BTEST0000000000000000001";
type Obj = Record<string, unknown>;
type Match = ReturnType<typeof createMatch>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(rel, ""); return out; };
const bagOf = (text: Record<string, string>): Record<string, Obj> => { const parsed = parseProject(text); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const stairs = (c: number, r: number, to: string): Obj => ({ type: "stairs", at: { c, r }, to });
function linked(): Record<string, Obj> {
  const bag = bagOf(walk(DIR)), aPath = `stages/${A}.json`, stage = bag[aPath]; if (!isObj(stage) || typeof stage["mapRef"] !== "string") throw new Error("stage");
  const cleared = { ...stage, enemyPool: { mode: "fixed", entries: [] } };
  const added = addStage({ ...bag, [aPath]: cleared }, cleared, null, B, stage["mapRef"], "Upstairs", "Upstairs map");
  const bPath = `stages/${B}.json`, b = added[bPath]; if (!isObj(b)) throw new Error("up");
  return { ...added, [aPath]: { ...cleared, links: [stairs(1, 0, B)] }, [bPath]: { ...b, name: "Upstairs", playerSpawns: [], neutrals: [], enemyPool: { mode: "fixed", entries: [] }, links: [stairs(2, 1, A)] } };
}
function docsOf(files: Record<string, Obj>, id: string): PlayOut {
  const load = readProject(files); if (!load.ok || load.project === null) throw new Error(load.report.map((row) => row.path).join(" "));
  return playDocsOf(load.project, id);
}
const heroAt = (m: Match): Sq => { const u = m.world.units.all().find((unit) => unit.alive && unit.side === m.sides.me); if (u === undefined) throw new Error("hero"); return { c: u.at.c, r: u.at.r }; };
function go(m: Match, at: Sq): void {
  const id = m.world.units.all().find((unit) => unit.alive && unit.side === m.sides.me)?.id; if (id === undefined) throw new Error("hero");
  if (m.world.phases.battle !== "idle") { m.endTurn(); for (let i = 0; i < 40 && (m.walk !== null || !m.view().mine); i += 1) { m.world.clock.advance(50); m.sync(); } }
  m.feed({ type: "SelectUnit", unitId: id }); m.feed({ type: "TargetCell", at });
  for (let i = 0; i < 40 && m.walk !== null; i += 1) { m.world.clock.advance(50); m.sync(); }
}
test("stage link: landing on stairs takes the party to the linked stage, arriving on the stairs back", () => {
  assert.deepEqual(arrival([], A, [{ c: 0, r: 0 }]), [{ c: 0, r: 0 }]);
  assert.deepEqual(arrival([{ type: "stairs", at: { c: 2, r: 1 }, to: A }], A, [{ c: 2, r: 1 }, { c: 0, r: 0 }]), [{ c: 2, r: 1 }, { c: 0, r: 0 }]);
  const files = linked(), docs = docsOf(files, A), m = createMatch(docs, 200), got: LinkEvent[] = [];
  m.onLink((ev) => got.push(ev));
  go(m, { c: 0, r: 1 }); assert.deepEqual(got.slice(), []); assert.deepEqual(heroAt(m), { c: 0, r: 1 });
  go(m, { c: 1, r: 1 }); go(m, { c: 1, r: 0 });
  assert.equal(got.length, 1); assert.equal(got[0]?.linkType, "stairs"); assert.equal(got[0]?.to, B); assert.deepEqual(got[0]?.at, { c: 1, r: 0 });
  const up = arriveIn(files, docs, got[0] ?? got[0]); if (up.docs === null) throw new Error(up.error);
  const mb = createMatch(up.docs, 200); assert.deepEqual(heroAt(mb), { c: 2, r: 1 }); assert.equal(mb.sides.contest, false);
  const back: LinkEvent[] = []; mb.onLink((ev) => back.push(ev)); go(mb, { c: 3, r: 1 }); go(mb, { c: 2, r: 1 });
  assert.equal(back.length, 1); assert.equal(back[0]?.to, A); assert.deepEqual(back[0]?.at, { c: 2, r: 1 });
  const down = arriveIn(files, up.docs, back[0] ?? back[0]); if (down.docs === null) throw new Error(down.error);
  assert.deepEqual(heroAt(createMatch(down.docs, 200)), { c: 1, r: 0 });
  const page = readFileSync("tools/play-stage/page.ts", "utf8");
  assert.equal(page.split("driver.dispose()").length - 1, 1);
  assert.equal(page.includes('const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };'), true);
});
test("stage link rebuild fits the frame budget", () => {
  const files = linked(), from = docsOf(files, A), link: LinkEvent = { type: "link", linkType: "stairs", from: A, to: B, at: { c: 1, r: 0 } }, times: number[] = [];
  for (let i = 0; i < 25; i += 1) { const t0 = performance.now(); const got = arriveIn(files, from, link); if (got.docs === null) throw new Error(got.error); createMatch(got.docs, 200).scene(); times.push(performance.now() - t0); }
  const sample = times.slice(5).sort((a, b) => a - b), mid = sample.length / 2, median = ((sample[mid - 1] ?? 0) + (sample[mid] ?? 0)) / 2;
  assert.ok(median < 4, String(median));
});
test("stage link: the reader warns on a link off the map and refuses a link to a missing stage, to itself, or malformed", () => {
  const files = linked(), aPath = `stages/${A}.json`, base = files[aPath]; if (!isObj(base)) throw new Error("a");
  const outside = readProject({ ...files, [aPath]: { ...base, links: [stairs(1, 0, B), { type: "door", at: { c: 9, r: 0 }, to: B }] } });
  const drop = outside.report.find((row) => row.path === `${aPath}#/links/1`);
  assert.deepEqual(drop, { code: "placementDropped", severity: "warning", path: `${aPath}#/links/1`, detail: "outsideMap" });
  const missing = readProject({ ...files, [aPath]: { ...base, links: [stairs(1, 0, B), { type: "gate", at: { c: 0, r: 1 }, to: "missing" }] } });
  const broke = missing.report.find((row) => row.path === `${aPath}#/links/1/to`);
  assert.equal(broke?.code, "brokenRef"); assert.equal(broke?.severity, "hard");
  const clean = readProject(bagOf(walk(DIR))); assert.equal(clean.report.some((row) => row.path.includes("/links/")), false);
  const self = readProject({ ...files, [aPath]: { ...base, links: [{ type: "door", at: { c: 0, r: 1 }, to: A }] } });
  const own = self.report.find((row) => row.path === `${aPath}#/links/0/to`);
  assert.equal(own?.code, "brokenRef"); assert.equal(own?.severity, "hard");
  const bad = { ...base, links: [{ type: "window", at: { c: 0, r: 1 }, to: B }] };
  assert.equal(readStage(bad, { picks: 0, waveUnits: 0 }).ok, false);
  assert.equal(readProject({ ...files, [aPath]: bad }).report.some((row) => row.severity === "hard" && row.path === aPath), true);
});
test("stage link: a stage a link leads to can't be deleted until the link is removed", () => {
  const files = linked(), aPath = `stages/${A}.json`, stage = files[aPath]; if (!isObj(stage)) throw new Error("a");
  assert.deepEqual(deleteStage(files, B), { ok: false, reason: "A link on Blank leads here. Remove it first." });
  const freed = deleteStage({ ...files, [aPath]: removeLink(stage, 1, 0) }, B); assert.equal(freed.ok, true);
  assert.equal(addLink(stage, "stairs", 0, 1, A), null);
});
test("stage link: a resize drops a link cell outside the map with a placementDropped row", () => {
  const files = linked(), mapId = files[`stages/${A}.json`]?.["mapRef"], map = docsIn(files, "maps").find((row) => row.doc["id"] === mapId);
  if (map === undefined) throw new Error("map");
  const sized = resizeMap(map.path, map.doc, docsIn(files, "stages"), 2, 2);
  assert.deepEqual(sized.rows.map((row) => row.code === "placementDropped" ? [row.code, row.list, row.path] : [row.code]), [["placementDropped", "links", `stages/${B}.json#/links/0`]]);
  const next = sized.stages.find((row) => row.path === `stages/${B}.json`)?.doc["links"];
  assert.deepEqual(next, []);
});
test("stage link: arrival is the target's first link back to the source, in array order", () => {
  assert.deepEqual(arrival([{ type: "gate", at: { c: 4, r: 4 }, to: "x" }, { type: "door", at: { c: 3, r: 1 }, to: A }, { type: "stairs", at: { c: 2, r: 1 }, to: A }], A, [{ c: 2, r: 1 }]), [{ c: 3, r: 1 }, { c: 2, r: 1 }]);
  const files = linked(), bPath = `stages/${B}.json`, b = files[bPath]; if (!isObj(b)) throw new Error("b");
  const land = (links: readonly Obj[]): Sq => {
    const from = docsOf({ ...files, [bPath]: { ...b, links } }, A);
    const got = arriveIn({ ...files, [bPath]: { ...b, links } }, from, { type: "link", linkType: "stairs", from: A, to: B, at: { c: 1, r: 0 } });
    if (got.docs === null) throw new Error(got.error); return heroAt(createMatch(got.docs, 200));
  };
  assert.deepEqual(land([{ type: "door", at: { c: 3, r: 1 }, to: A }, { type: "stairs", at: { c: 2, r: 1 }, to: A }]), { c: 3, r: 1 });
  assert.deepEqual(land([{ type: "door", at: { c: 2, r: 1 }, to: A }, { type: "stairs", at: { c: 3, r: 1 }, to: A }]), { c: 2, r: 1 });
});
```

### `handoff/steps/tests/s7-stage-links/smoke.mjs` (new)

```js
// Step 07 stage links. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s7-stage-links/smoke.mjs . 8809
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8809"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s7-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, "handback/step-07-stage-links/r1"); mkdirSync(out, { recursive: true });
const DEMO = "stage_01JDAS00000000000000000001", MAP = "map_01JDAM00000000000000000001";
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    await ctx.addInitScript(() => { let n = 0; const add = window.addEventListener, rem = window.removeEventListener; window.addEventListener = function (t, f, o) { if (t === "resize") n += 1; return add.call(this, t, f, o); }; window.removeEventListener = function (t, f, o) { if (t === "resize") n -= 1; return rem.call(this, t, f, o); }; Object.defineProperty(window, "__resizeN", { get: () => n }); });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); }); const tiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`), scale: "css" }); };
    const see = async () => tiny.push(...await page.evaluate(() => [...document.querySelectorAll(".sheet button, .sheet input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 400)); } };
    const hero = (at) => page.waitForFunction((at) => { const m = window.__play; return m !== undefined && m.walk === null && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === at.c && u.at.r === at.r); }, at, { timeout: 15000 });
    const go = async (from, to) => { await hero(from); await page.evaluate((p) => { const m = window.__play, id = m.world.units.all().find((u) => u.alive && u.side === m.sides.me && u.at.c === p.from.c && u.at.r === p.from.r).id; if (m.world.phases.battle === "idle") m.feed({ type: "SelectUnit", unitId: id }); m.feed({ type: "TargetCell", at: p.to }); }, { from, to }); };
    const landed = (tos, at) => page.waitForFunction(({ tos, at }) => { const m = window.__play, links = window.__docs === undefined ? null : window.__docs.links; if (m === undefined || m.walk !== null || links === null) return false; const got = links.map((l) => l.to); return got.length === tos.length && got.every((id, i) => id === tos[i]) && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === at.c && u.at.r === at.r); }, { tos, at }, { timeout: 15000 });
    const counts = {}; let up = "";
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await step("1 new", async () => { await tap(page, "new"); await tap(page, "toname"); await tap(page, "create"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); });
    await step("2 upstairs", async () => { await tap(page, "r:add"); await see(); await tap(page, `r:use:${MAP}`); await page.waitForFunction((demo) => document.querySelectorAll(".cell").length === 54 && new URLSearchParams(location.search).get("stage") !== null && new URLSearchParams(location.search).get("stage") !== demo, DEMO, { timeout: 15000 }); up = await page.evaluate(() => new URLSearchParams(location.search).get("stage") ?? ""); if (up === "") throw new Error("stage"); });
    await step("3 stairs down", async () => { await tap(page, "s:cell:2,7"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see(); await tap(page, "s:link:stairs"); await waitText(page, "Stairs goes to"); await see(); await shot("01-goes-to"); await tap(page, `s:to:${DEMO}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:2,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await waitText(page, "Remove link"); await see(); await shot("02-placed-link"); await tap(page, "s:close"); });
    await step("4 stairs up", async () => { await tap(page, "s:back"); await press(page, "Demo stage", true); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54 && (document.querySelector("h1")?.textContent ?? "").includes("Demo stage"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see(); await tap(page, "s:link:stairs"); await waitText(page, "Stairs goes to"); await see(); await tap(page, `s:to:${up}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await waitText(page, "Remove link"); await see(); await tap(page, "s:close"); });
    await step("5 refuse delete", async () => { await tap(page, "s:back"); await tap(page, `r:menu:stage:${up}`); await tap(page, "r:delete"); await waitText(page, "A link on Demo stage leads here. Remove it first."); await see(); await shot("03-refusal"); await tap(page, "r:close"); });
    await step("6 go up", async () => { counts.maker = await page.evaluate(() => window.__resizeN); await press(page, "Demo stage", true); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 }); await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 }); counts.play = await page.evaluate(() => window.__resizeN); await go({ c: 0, r: 8 }, { c: 0, r: 7 }); await landed([DEMO], { c: 2, r: 7 }); counts.up = await page.evaluate(() => window.__resizeN); await shot("04-upstairs"); });
    await step("7 go down", async () => { await go({ c: 2, r: 7 }, { c: 2, r: 8 }); await hero({ c: 2, r: 8 }); await page.evaluate(() => window.__play.endTurn()); await page.waitForFunction(() => { const m = window.__play; return m.walk === null && m.world.phases.battle === "idle" && m.side === m.sides.me; }, null, { timeout: 15000 }); await go({ c: 2, r: 8 }, { c: 2, r: 7 }); await landed([up], { c: 0, r: 7 }); counts.down = await page.evaluate(() => window.__resizeN); await shot("05-back-down"); });
    await step("8 back to maker", async () => { await press(page, "Back to maker", true); await page.waitForFunction(() => document.querySelector("#board") === null && document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); counts.back = await page.evaluate(() => window.__resizeN); });
    const flat = JSON.stringify(counts), want = JSON.stringify({ maker: 0, play: 1, up: 1, down: 1, back: 0 });
    check(`9 resize listeners flat @${width}`, flat === want && errs.length === 0, errs.length === 0 ? flat : errs.join(" | "));
    check(`10 targets @${width}`, tiny.length === 0 && errs.length === 0, tiny.length === 0 && errs.length === 0 ? "ok" : [...new Set(tiny)].concat(errs).join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `src/types/core-types.ts` (edited)

```diff
diff --git a/src/types/core-types.ts b/src/types/core-types.ts
index dbea6b4..8e34b6a 100644
--- a/src/types/core-types.ts
+++ b/src/types/core-types.ts
@@ -159,6 +159,12 @@ export type CoreEnemyPool =
   | { readonly mode: "waves"; readonly spawns: ReadonlyArray<SpawnSq>;
       readonly waves: ReadonlyArray<{ readonly turn: number; readonly entries: ReadonlyArray<{ readonly unitId: UnitId; readonly count: number }> }> };   // STABLE
 
+export type LinkType = "stairs" | "door" | "gate";                              // MAY-MOVE (DSK D27): label only in step 7; same engine rule for all
+export type CoreLink = {
+  readonly type: LinkType;                                                      // MAY-MOVE
+  readonly at: Sq;                                                              // MAY-MOVE: cell on this stage's map
+  readonly to: string;                                                          // MAY-MOVE: target stage id (brokenRef hard if missing)
+};
 export type CoreStage = VersionGuard<"stage"> & {
   readonly id: string;                                                          // STABLE: stage id
   readonly rev: number;                                                         // STABLE
@@ -177,6 +183,7 @@ export type CoreStage = VersionGuard<"stage"> & {
     readonly enemyPool?: SideId;                                                //   default "rival"
     readonly neutrals?: SideId;                                                 //   default "neutral"
   };
+  readonly links?: ReadonlyArray<CoreLink>;                                     // MAY-MOVE (DSK D27, step 7): absent = []; at most one per cell
   readonly enemyPool: CoreEnemyPool;                                            // STABLE
   readonly loadout: CoreLoadout | null;                                         // STABLE: null = use project loadout
   readonly rules: ReadonlyArray<string>;                                        // STABLE: setup ids; replace project rules per behaviour
```

### `tests/smoke.test.ts` (edited)

```diff
diff --git a/tests/smoke.test.ts b/tests/smoke.test.ts
index b03a832..7e879b1 100644
--- a/tests/smoke.test.ts
+++ b/tests/smoke.test.ts
@@ -11,5 +11,5 @@ test("smoke: engine root exports name and version", () => {
 
 test("smoke: core-types.ts is the pinned DSK copy", () => {
   const sha = createHash("sha256").update(readFileSync("src/types/core-types.ts")).digest("hex");
-  assert.equal(sha, "d6d0869644f3c9876aa1101d8a7248f8b5a18b3beabcb0b191c9c42fec88a366");
+  assert.equal(sha, "fd27de06c035ab8c3767a31ad0cf2bf75fa74ca200487a6e2ea762f2d90e747d");
 });
```

### `src/project/read/stage.ts` (edited)

```diff
diff --git a/src/project/read/stage.ts b/src/project/read/stage.ts
index 65528ca..3ab2d89 100644
--- a/src/project/read/stage.ts
+++ b/src/project/read/stage.ts
@@ -1,4 +1,4 @@
-import type { CoreEnemyPool, CoreLoadout, CoreStage, Facing, SpawnSq } from "../../types/core-types.ts";
+import type { CoreEnemyPool, CoreLink, CoreLoadout, CoreStage, Facing, SpawnSq } from "../../types/core-types.ts";
 import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr, strs, type ReadFail, type ReadResult } from "./guard.ts";
 import { UINT32_MAX, docLimits, fitted, overCap, tooMany, type DocLimits } from "./limits.ts";
 
@@ -34,6 +34,13 @@ function neutrals(v: unknown): CoreStage["neutrals"] | null {
   for (const x of v) { if (!isObj(x) || !isStr(x.unitId)) return null; const at = cell(x.at); const f = face(x.facing); const side = optStr(x.side); if (at === null || !f.ok || side === null) return null; out.push({ unitId: x.unitId, at, ...(f.facing === undefined ? {} : { facing: f.facing }), ...(side === undefined ? {} : { side }) }); }
   return out;
 }
+function links(v: unknown): CoreLink[] | undefined | null {
+  if (v === undefined) return undefined;
+  if (!Array.isArray(v)) return null;
+  const out: CoreLink[] = [];
+  for (const x of v) { if (!isObj(x) || (x.type !== "stairs" && x.type !== "door" && x.type !== "gate") || !isStr(x.to)) return null; const at = cell(x.at); if (at === null) return null; out.push({ type: x.type, at, to: x.to }); }
+  return out;
+}
 function pool(v: unknown): CoreEnemyPool | null {
   if (!isObj(v)) return null;
   if (v.mode === "fixed") {
@@ -70,6 +77,7 @@ function take(limits: StageLimits): { picks: number; waveUnits: number; doc: Doc
 function countOf(json: Record<string, unknown>, lim: DocLimits): ReadFail | null {
   if (tooMany(json.neutrals, lim.spots)) return overCap("neutrals");
   if (tooMany(json.playerSpawns, lim.spots)) return overCap("playerSpawns");
+  if (tooMany(json.links, lim.spots)) return overCap("links");
   const pool = json.enemyPool; if (!isObj(pool)) return null; const list = pool.mode === "fixed" ? pool.entries : pool.spawns;
   if ((pool.mode === "fixed" || pool.mode === "weighted" || pool.mode === "waves") && tooMany(list, lim.spots)) return overCap("enemyPool");
   if (pool.mode === "weighted" && tooMany(pool.entries, lim.spots)) return overCap("enemyPool");
@@ -93,6 +101,7 @@ function readStageDoc(json: unknown, lim: ReturnType<typeof take>): ReadResult<C
   const early = countOf(json, lim.doc); if (early !== null) return early;
   const playerSpawns = spawns(json.playerSpawns); if (playerSpawns === null) return bad("playerSpawns");
   const neutral = neutrals(json.neutrals); if (neutral === null) return bad("neutrals");
+  const linkList = links(json.links); if (linkList === null) return bad("links");
   const rawSeed = json.seed;
   const seed = rawSeed === undefined ? undefined : rawSeed === null ? null : typeof rawSeed === "number" && Number.isInteger(rawSeed) && rawSeed >= 0 && rawSeed <= UINT32_MAX ? (rawSeed === 0 ? 0 : rawSeed) : undefined;
   if (rawSeed !== undefined && seed === undefined) return bad("seed");
@@ -104,6 +113,6 @@ function readStageDoc(json: unknown, lim: ReturnType<typeof take>): ReadResult<C
   return fitted({
     kind: "stage", formatVersion: CURRENT_FORMAT_VERSIONS.stage, id: json.id, rev: json.rev, mapRef: json.mapRef,
     playerSpawns, neutrals: neutral, enemyPool, loadout: gear, rules,
-    ...(seed === undefined ? {} : { seed }), ...(sides === undefined ? {} : { sides }),
+    ...(seed === undefined ? {} : { seed }), ...(sides === undefined ? {} : { sides }), ...(linkList === undefined ? {} : { links: linkList }),
   }, lim.doc, []);
 }
```

### `src/editor/stage/rooms.ts` (edited)

```diff
diff --git a/src/editor/stage/rooms.ts b/src/editor/stage/rooms.ts
index 7b17891..cfc5b89 100644
--- a/src/editor/stage/rooms.ts
+++ b/src/editor/stage/rooms.ts
@@ -1,3 +1,4 @@
+import { linksTo } from "./links.ts";
 type Obj = Record<string, unknown>;
 const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
 const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
@@ -7,7 +8,7 @@ const inner = (doc: Obj): Obj => (isObj(doc["project"]) ? doc["project"] : {});
 export function docsIn(files: Record<string, Obj>, folder: "stages" | "maps"): { readonly path: string; readonly doc: Obj }[] {
   return Object.entries(files).flatMap(([path, doc]) => (path.startsWith(`${folder}/`) && isObj(doc) && typeof doc["id"] === "string" ? [{ path, doc }] : []));
 }
-/** Live stages (project.stages) whose mapRef is this id. Step 7 adds link targets. */
+/** Live stages (project.stages) whose mapRef is this id. Links target stages, not maps, so this stays mapRef-only. */
 export function refsTo(files: Record<string, Obj>, id: string): readonly string[] {
   const stages = docsIn(files, "stages");
   return list(inner(rootOf(files))["stages"]).flatMap((sid) => {
@@ -40,6 +41,7 @@ export function renameDoc(files: Record<string, Obj>, path: string, name: string
 export function deleteStage(files: Record<string, Obj>, stageId: string): { readonly ok: true; readonly files: Record<string, Obj> } | { readonly ok: false; readonly reason: string } {
   const stages = list(inner(rootOf(files))["stages"]).filter((id): id is string => typeof id === "string");
   if (!stages.includes(stageId) || stages.length <= 1) return { ok: false, reason: "A game needs at least one stage" };
+  const named = linksTo(files, stageId); if (named.length > 0) return { ok: false, reason: `A link on ${named.join(", ")} leads here. Remove it first.` };
   const root = clone(rootOf(files)), proj = { ...inner(root) }; proj["stages"] = stages.filter((id) => id !== stageId);
   if (isObj(proj["render"]) && Array.isArray(proj["render"]["excludedStages"])) { const render = { ...proj["render"] }; render["excludedStages"] = list(render["excludedStages"]).filter((id) => id !== stageId); proj["render"] = render; }
   root["project"] = proj; return { ok: true, files: { ...files, "project.json": root } };
```

### `src/editor/stage/resize.ts` (edited)

```diff
diff --git a/src/editor/stage/resize.ts b/src/editor/stage/resize.ts
index 1a644da..7f70913 100644
--- a/src/editor/stage/resize.ts
+++ b/src/editor/stage/resize.ts
@@ -1,6 +1,6 @@
 type Obj = Record<string, unknown>;
 type Sq = { readonly c: number; readonly r: number };
-export type PlaceDrop = { readonly code: "placementDropped"; readonly stageId: string; readonly list: "playerSpawns" | "neutrals" | "enemyPool"; readonly index: number; readonly reason: "outsideMap"; readonly path: string; readonly sq: Sq | null; readonly unitId?: string };
+export type PlaceDrop = { readonly code: "placementDropped"; readonly stageId: string; readonly list: "playerSpawns" | "neutrals" | "enemyPool" | "links"; readonly index: number; readonly reason: "outsideMap"; readonly path: string; readonly sq: Sq | null; readonly unitId?: string };
 export type EdgeDrop = { readonly code: "mapEntryDropped"; readonly mapId: string; readonly field: "edges"; readonly index: number; readonly reason: "outsideMap"; readonly path: string };
 export type Drop = PlaceDrop | EdgeDrop;
 const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
@@ -43,11 +43,11 @@ export function resizeMap(mapPath: string, map: Obj, stages: readonly { readonly
       const bag = pool && isObj(doc["enemyPool"]) ? doc["enemyPool"] : null;
       const entries = pool ? (bag !== null && bag["mode"] === "fixed" ? list(bag["entries"]) : []) : list(doc[key]);
       if (pool && (bag === null || bag["mode"] !== "fixed")) return;
-      const got = trim(entries, direct, cols, rows, path, pool ? "enemyPool" : key === "neutrals" ? "neutrals" : "playerSpawns", stageId);
+      const got = trim(entries, direct, cols, rows, path, pool ? "enemyPool" : key === "neutrals" ? "neutrals" : key === "links" ? "links" : "playerSpawns", stageId);
       drops.push(...got.drops); if (!got.changed) return;
       if (pool && bag !== null) put("enemyPool", { ...bag, entries: got.kept }); else put(key, got.kept);
     };
-    cut("playerSpawns", true, false); cut("neutrals", false, false); cut("enemyPool", false, true); return { path, doc: next ?? doc };
+    cut("playerSpawns", true, false); cut("neutrals", false, false); cut("enemyPool", false, true); cut("links", false, false); return { path, doc: next ?? doc };
   });
   const logic = isObj(map["logic"]) ? map["logic"] : {}, palette = isObj(logic["palette"]) ? { ...logic["palette"] } : {}, edges = list(logic["edges"]), keptEdges: unknown[] = [];
   edges.forEach((edge, i) => {
```

### `src/project/load/read-project.ts` (edited)

```diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index ff897fb..d7af3c3 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -34,6 +34,7 @@ function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonl
     list(stage["rules"]).forEach((sid, i) => has(setups, sid, `${path}#/rules/${i}`, rows));
     list(stage["neutrals"]).forEach((n, i) => { if (!isObj(n)) return; has(units, n["unitId"], `${path}#/neutrals/${i}/unitId`, rows); list(n["setupIds"]).forEach((sid, j) => has(setups, sid, `${path}#/neutrals/${i}/setupIds/${j}`, rows)); });
     list(pool["entries"]).forEach((e, i) => { if (isObj(e)) has(units, e["unitId"], `${path}#/enemyPool/entries/${i}/unitId`, rows); });
+    list(stage["links"]).forEach((l, i) => { if (!isObj(l)) return; const where = `${path}#/links/${i}/to`; if (l["to"] === id) rows.push(row("brokenRef", "hard", where, id)); else has(stages, l["to"], where, rows); });
   }
   for (const [id, unit] of Object.entries(units)) list(unit["setupIds"]).forEach((sid, i) => has(setups, sid, `units/${id}.json#/setupIds/${i}`, rows));
 }
```

### `src/project/load/drops.ts` (edited)

```diff
diff --git a/src/project/load/drops.ts b/src/project/load/drops.ts
index 0289a99..0ccf9d9 100644
--- a/src/project/load/drops.ts
+++ b/src/project/load/drops.ts
@@ -26,6 +26,7 @@ export function placementDrops(stages: Readonly<Record<string, Doc>>, stageAt: R
       ["playerSpawns", true, list(stage["playerSpawns"])],
       ["neutrals", false, list(stage["neutrals"])],
       ["enemyPool/entries", false, isObj(stage["enemyPool"]) && stage["enemyPool"]["mode"] === "fixed" ? list(stage["enemyPool"]["entries"]) : []],
+      ["links", false, list(stage["links"])],
     ];
     for (const [name, direct, entries] of lists) for (let i = 0; i < entries.length; i += 1) {
       const entry = entries[i]; if (!isObj(entry)) continue;
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 2d73625..9b261c0 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -1,4 +1,6 @@
 import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
+import { readStage } from "../../src/project/read/stage.ts";
+import { arrival, type LinkEvent } from "../../src/rules/session/links.ts";
 import { ruleOf } from "../../src/project/rule-of.ts";
 import { WIN_CONDITION } from "../../src/rules/battle/win.ts";
 import { XP_LEVELS } from "../../src/rules/behaviours/xp-levels.ts";
@@ -46,6 +48,7 @@ function levelsOf(store: ProjectStore, stage: Obj): PlayOut["levels"] {
 export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
   const stage = store.stages[stageId ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
+  const core = readStage(stage, { picks: 0, waveUnits: 0 }); if (!core.ok) throw new Error("play: stage");
   const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
   const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
   const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
@@ -70,7 +73,7 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
   const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
   const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage);
-  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }) };
+  return { manifest: store.manifest, map, stage, links: core.doc.links ?? [], rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }) };
 }
 export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
   try {
@@ -87,3 +90,14 @@ export function openBundled(): ReturnType<typeof openProject> {
   return { docs: { ...got.docs, looks: DEMO_LOOKS }, error: got.error };
 }
 export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
+export function arriveIn(files: ProjectFiles, from: PlayOut, link: LinkEvent): ReturnType<typeof openProject> {
+  const fromId = isObj(from.stage) && typeof from.stage["id"] === "string" ? from.stage["id"] : "";
+  let path = ""; for (const [key, doc] of Object.entries(files)) if (key.startsWith("stages/") && isObj(doc) && doc["id"] === link.to) path = key;
+  const stage = path === "" ? undefined : files[path], read = stage === undefined ? null : readStage(stage, { picks: 0, waveUnits: 0 });
+  if (read === null || !read.ok) return openProject(files, link.to);
+  const spots = read.doc.playerSpawns, next = arrival(read.doc.links ?? [], fromId, spots);
+  const playerSpawns = next.map((sq) => { const hit = spots.find((s) => s.c === sq.c && s.r === sq.r); return hit !== undefined && hit.facing !== undefined ? { c: sq.c, r: sq.r, facing: hit.facing } : { c: sq.c, r: sq.r }; });
+  const opened = openProject({ ...files, [path]: { ...(isObj(stage) ? stage : {}), playerSpawns } }, link.to);
+  if (opened.docs === null) return opened;
+  return { docs: { ...opened.docs, chosen: from.chosen.slice(0, playerSpawns.length) }, error: opened.error };
+}
```

### `tools/play-stage/load.ts` (edited)

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index b46f4b3..3d55dc4 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -2,7 +2,7 @@ import type { BattleSetup } from "../../src/rules/battle/battle.ts";
 import type { WinRule } from "../../src/rules/battle/win.ts";
 import type { LevelSetup } from "../../src/rules/levels/index.ts";
 import type { SimInput } from "../../src/sim/types.ts";
-import type { CoreTileType } from "../../src/types/core-types.ts";
+import type { CoreLink, CoreTileType } from "../../src/types/core-types.ts";
 
 export const TILE = 16;
 export const TEAM = { player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a } as const;
@@ -20,7 +20,7 @@ export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
 export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup };
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
```

### `tools/play-stage/match.ts` (edited)

```diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index b99b6bb..c4bf259 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -5,6 +5,7 @@ import { walkTo } from "../../src/rules/move/path.ts";
 import { submit } from "../../src/sim/actions.ts";
 import type { DoorIntent } from "../../src/sim/types.ts";
 import type { Outcome } from "../../src/state/index.ts";
+import { linkAt, linkEvent, type LinkEvent } from "../../src/rules/session/links.ts";
 import type { Sq } from "../../src/types/core-types.ts";
 import { createPlay, spellRef } from "./board.ts";
 import { recipeIn, type PlayDocs } from "./load.ts";
@@ -75,7 +76,8 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     go({ type: "UNIT_DONE", next: "idle" });
     play.followId = null;
   };
-  play.landed(() => { if (side === me) return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); });
+  let tell: ((link: LinkEvent) => void) | null = null;
+  play.landed(() => { if (side !== me) { go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); return; } const who = play.selected === null ? undefined : play.world.units.get(play.selected), hit = who === undefined ? null : linkAt(body.links ?? [], who.at); if (hit === null) return; const from = body.stage; tell?.(linkEvent(hit, typeof from === "object" && from !== null && "id" in from && typeof from.id === "string" ? from.id : "")); });
   const wipe = (): void => { play.aims = []; talk = null; play.focus(null); play.followId = null; };
   const back = (): "unitSelected" | "actMenu" | null => {
     if (play.world.phases.battle !== "targeting") return null;
@@ -115,6 +117,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
       wipe(); turns += 1; if (finish()) return; if (side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
     },
     closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
+    onLink(fn: (link: LinkEvent) => void): void { tell = fn; },
     recentreTarget(): Sq | null {
       const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
       if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
```

### `tools/play-stage/page.ts` (edited)

```diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 6b7a56f..8e298c6 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -2,6 +2,7 @@ import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/h
 import { createLighting, fitView } from "../../src/runtime/render/index.ts";
 import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
 import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
+import type { LinkEvent } from "../../src/rules/session/links.ts";
 import { boardBox, fit, TILE } from "./board.ts";
 import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
 import { createHud, XP_H } from "./hud.ts";
@@ -12,7 +13,7 @@ import { createTouch } from "./touch.ts";
 import { DEV } from "./dev.ts"; // dev-only
 
 export type StartAim = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
-export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void, aim?: StartAim): void {
+export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void, aim?: StartAim, travel?: (link: LinkEvent) => void): void {
 const canvas = document.querySelector("#board");
 if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
 const match = createMatch(docs);
@@ -35,9 +36,10 @@ const load = (id: string): Promise<OffscreenCanvas> => {
   g.putImageData(image, 0, 0);
   return Promise.resolve(baked);
 };
+const end = { go(): void { location.reload(); } };
 const hud = createHud({
   choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
-  restart: () => { if (back !== undefined) { driver.dispose(); back(); } else location.reload(); }, closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
+  restart: () => { if (back !== undefined) end.go(); else location.reload(); }, closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
 });
 const driver = createDriver({
   env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
@@ -52,7 +54,10 @@ const driver = createDriver({
 const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
 for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
 const place = (): void => { const box = boardBox(innerHeight - (match.view().xp === null ? 0 : XP_H)); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
-place(); addEventListener("resize", () => { place(); seated = false; });
+const onResize = (): void => { place(); seated = false; };
+place(); addEventListener("resize", onResize);
+const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };
+end.go = (): void => { stop(); if (back !== undefined) back(); };
 seat();
 if (aim?.unitId !== undefined) {
   const mine = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId && u.side === match.sides.me);
@@ -73,7 +78,8 @@ if (aim?.unitId !== undefined) {
   }
 }
 if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link, __docs: docs }); // dev-only
-if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { driver.dispose(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
+if (travel !== undefined) match.onLink((link) => { stop(); travel(link); });
+if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { stop(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
 driver.start();
 }
 const bootCanvas = document.querySelector("#board");
```

### `tools/maker/test-launch.ts` (edited)

```diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index fa49411..ae1dd9e 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -3,13 +3,15 @@ import { planSave } from "../../src/editor/project/save.ts";
 import { testGate, playLine, emptyBoard } from "../../src/editor/project/test-gate.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import type { Looks } from "../play-stage/load.ts";
-import { openProject, type PlayOut } from "../play-stage/project.ts";
+import { openProject, arriveIn, type PlayOut } from "../play-stage/project.ts";
+import type { LinkEvent } from "../../src/rules/session/links.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 export type PlayReady = PlayOut & { readonly looks: Looks };
 export type AimAt = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
+export type Next = (from: PlayReady, link: LinkEvent) => { readonly docs: PlayReady | null; readonly error: string };
 export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
-type Start = (docs: PlayReady, aim?: AimAt) => void;
+type Start = (docs: PlayReady, aim?: AimAt, next?: Next) => void;
 export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start };
 export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
 const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
@@ -23,7 +25,7 @@ function play(input: LaunchBag, text: DocText): Launch {
   const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
   if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
   if (emptyBoard(opened.docs)) return fail(["Place a unit on this stage to test it."], text, rev);
-  try { input.start(opened.docs, input.aim); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
+  try { input.start(opened.docs, input.aim, (from, link) => arriveIn(parsed.files, from, link)); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
   showUrl(input.id, stageOf(opened.docs), input.from, input.aim); return { ok: true, files: text, rev };
 }
 /** Read a saved folder and start its stage. No demo fallback. */
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index fe0ae9c..77b9c8c 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -11,7 +11,7 @@ import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
 import { levelsAct, levelsOpen, levelsSection, levelsSheet, rememberLevels } from "./levels.ts";
 import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
-import { backScreen, launchTest, openSaved, type AimAt, type PlayReady } from "./test-launch.ts";
+import { backScreen, launchTest, openSaved, type AimAt, type Next, type PlayReady } from "./test-launch.ts";
 import { startMatch } from "../play-stage/page.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
@@ -50,12 +50,11 @@ async function rename(): Promise<void> { if (store === null || state.menu === nu
 async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
 async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
 async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
-function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt): void {
+function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt, next?: Next): void {
   const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
-  try {
-    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; }, aim);
-    root.hidden = true;
-  } catch (e) { canvas.remove(); throw e; }
+  const out = (): void => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; };
+  const travel = next === undefined ? undefined : (link: Parameters<Next>[1]): void => { const got = next(docs, link); if (got.docs === null) { out(); state.problems = [got.error]; paint(); return; } canvas.remove(); document.querySelector("#hud")?.remove(); enterPlay(got.docs, scroll, undefined, next); };
+  try { startMatch(docs, out, aim, travel); root.hidden = true; } catch (e) { canvas.remove(); throw e; }
 }
 async function saveStage(): Promise<boolean> {
   if (store === null || state.current === null) return false;
@@ -68,7 +67,7 @@ async function beginTest(aim?: AimAt & { readonly stageId?: string }): Promise<v
   if (stageId !== null && state.screen === "stage" && !await saveStage()) { paint(); return; }
   const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
   const launched = aim?.unitId === undefined ? undefined : { ...(aim.abilityId === undefined ? { unitId: aim.unitId } : { unitId: aim.unitId, abilityId: aim.abilityId }), ...(aim.aim === undefined ? {} : { aim: aim.aim }) };
-  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), now: nowIso(), start: (docs, at) => enterPlay(docs, scroll, at) });
+  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), now: nowIso(), start: (docs, at, next) => enterPlay(docs, scroll, at, next) });
   state.files = got.files; state.rev = got.rev;
   if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
   state.dirty = false; state.problems = [];
@@ -85,7 +84,7 @@ async function fromUrl(): Promise<void> {
   if (id === null || store === null) return;
   const stage = params.get("stage"), from = params.get("from") ?? "project", unit = params.get("unit"), ability = params.get("ability");
   const text = await readTree(store, prefix(id)), aim = unit === null ? undefined : aimAt(text, unit, ability);
-  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), ...(aim === undefined ? {} : { aim }), start: (docs, at) => enterPlay(docs, 0, at) });
+  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), ...(aim === undefined ? {} : { aim }), start: (docs, at, next) => enterPlay(docs, 0, at, next) });
   if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
   if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
   state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
```

### `tools/maker/stage.ts` (edited)

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index 0907b4f..fd882df 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -3,13 +3,14 @@ import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
 import { planSave } from "../../src/editor/project/save.ts";
 import { paintCells, startNew } from "../../src/editor/stage/paint.ts";
 import { addEnemy, addNeutral, addSpawn, attachTalk, infoText, moveEntry, placeRows, refuse, removeEntry, standHere, type PlaceList } from "../../src/editor/stage/place.ts";
+import { addLink, linkOn, removeLink } from "../../src/editor/stage/links.ts";
 import { closedType, sheetRows, typeLabel, type SheetRow } from "../../src/editor/stage/sheet.ts";
 import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
 import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
 import type { ProjectFiles } from "../../src/project/load/types.ts";
 import { parseProject } from "./project-files.ts";
 import { rulesSheet } from "./rules-panel.ts";
-import { askSheet, moveChip, placeButtons, talkSheet, unitButtons, unitPicker } from "./stage-sheets.ts";
+import { askSheet, goesSheet, LINK_LABEL, moveChip, placeButtons, talkSheet, unitButtons, unitPicker } from "./stage-sheets.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 type Obj = Record<string, unknown>;
 type Cell = { readonly c: number; readonly r: number };
@@ -23,8 +24,8 @@ const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !
 const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type Sess = { id: string; project: string; draft: Obj | null; path: string | null; stagePath: string | null; painting: string | null; label: string; stack: unknown[]; gridOn: boolean; sheet: Cell | null; view: boolean; confirm: boolean; note: string | null; sel: Cell | null; moving: Spot | null; pick: PlaceList | null; ask: number | null; talking: boolean; line: string };
-const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, stagePath: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null, moving: null, pick: null, ask: null, talking: false, line: "" });
+type Sess = { id: string; project: string; draft: Obj | null; path: string | null; stagePath: string | null; painting: string | null; label: string; stack: unknown[]; gridOn: boolean; sheet: Cell | null; view: boolean; confirm: boolean; note: string | null; sel: Cell | null; moving: Spot | null; pick: PlaceList | null; ask: number | null; talking: boolean; line: string; link: "stairs" | "door" | "gate" | null };
+const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, stagePath: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null, moving: null, pick: null, ask: null, talking: false, line: "", link: null });
 let sess: Sess = blank("", ""), skeleton: Obj | null = null;
 export function bindStage(id: string, project: string): void { if (sess.id !== id || sess.project !== project) sess = blank(id, project); }
 export function rememberTalk(doc: unknown): void { if (isObj(doc)) skeleton = doc; }
@@ -93,15 +94,15 @@ function bundle(files: DocText, stageId: string): { readonly parsed: ProjectFile
   sess.path = map.path; sess.stagePath = stage.path; return { parsed: parsed.files, stage: stage.doc, map: sess.draft ?? (structuredClone(map.doc) as Obj), slice };
 }
 function tone(id: string): string { return id === "floor" || id === "water" ? id : id === "wall-block" ? "wall" : "other"; }
-function cellsHtml(map: Obj, slice: Obj, placed: readonly Mark[], sel: Cell | null): string {
+function cellsHtml(map: Obj, slice: Obj, stage: Obj, placed: readonly Mark[], sel: Cell | null): string {
   const cols = typeof map["cols"] === "number" ? map["cols"] : 0, rows = typeof map["rows"] === "number" ? map["rows"] : 0;
   let html = `<div class="grid${sess.gridOn ? "" : " off"}" style="grid-template-columns:repeat(${cols},48px)">`;
   for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
     const id = tileId(map, c, r), label = typeLabel(slice, id), mark = placed.find((item) => item.c === c && item.r === r) ?? null;
-    const text = mark !== null || label.length > 5 ? label.slice(0, 1) : label, on = sel !== null && sel.c === c && sel.r === r ? " on" : "";
+    const hit = list(stage["links"]).find((link) => isObj(link) && isObj(link["at"]) && link["at"]["c"] === c && link["at"]["r"] === r), word = isObj(hit) && hit["type"] === "stairs" ? "Stairs" : isObj(hit) && hit["type"] === "door" ? "Door" : isObj(hit) && hit["type"] === "gate" ? "Gate" : "", glyph = word === "Stairs" ? "S↗" : word === "Door" ? "D↗" : word === "Gate" ? "G↗" : "", text = glyph !== "" && mark === null ? glyph : mark !== null || label.length > 5 ? label.slice(0, 1) : label, on = sel !== null && sel.c === c && sel.r === r ? " on" : "";
     const who = mark === null ? "" : `<span class="who">${esc(mark.letter)}</span><span class="pill">${esc(mark.pill)}</span>`;
     const star = mark !== null && mark.n >= 1 ? `<span class="star">✦${mark.n}</span>` : "";
-    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}"><span>${esc(text)}</span>${who}${star}</button>`;
+    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}${word === "" ? "" : `, ${word}`}"><span>${esc(text)}</span>${who}${star}</button>`;
   }
   return `${html}</div>`;
 }
@@ -145,13 +146,15 @@ export function stageScreen(stageId: string, host: Host): string {
   const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
   const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button><button type="button" class="btn ghost" data-act="r:open">Rules</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
   const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
+  const names = stageRows(host.files), linked = mark === null && cell !== null ? linkOn(got.stage, cell.c, cell.r) : null, linkType = linked !== null && (linked["type"] === "stairs" || linked["type"] === "door" || linked["type"] === "gate") ? linked["type"] : null;
   const rows = sheetRows(got.slice, mark !== null);
   const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
-  const stood = mark === null ? "" : `${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
-  const place = mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
-  const title = mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
+  const stood = linkType !== null ? `<button type="button" class="btn" data-act="s:unlink">Remove link</button>` : mark === null ? "" : `${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
+  const place = linkType === null && mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
+  const linkBtns = place !== "" && names.some((row) => row.id !== stageId) ? `<p class="sub">Link</p>${(["stairs", "door", "gate"] as const).map((type) => `<button type="button" class="btn" data-act="s:link:${type}">${LINK_LABEL[type]}</button>`).join("")}` : "";
+  const title = linkType !== null ? `${esc(LINK_LABEL[linkType])} to ${esc(typeof linked?.["to"] === "string" ? names.find((row) => row.id === linked["to"])?.name ?? "Stage" : "")}` : mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
   const where = mark === null && cell !== null ? `<p class="sub">Tile ${cell.c},${cell.r}</p>` : "";
-  const sheet = host.readOnly || cell === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>${title}</h2>${where}${stood}${place}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
+  const sheet = host.readOnly || cell === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>${title}</h2>${where}${stood}${place}${linkBtns}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
   const view = sess.view ? `<div class="scrim"><div class="sheet" role="dialog"><h2>View</h2><button type="button" class="choice" data-act="s:grid">Grid lines: ${sess.gridOn ? "On" : "Off"}</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>` : "";
   const confirm = !host.readOnly && sess.confirm ? `<div class="scrim"><div class="sheet" role="dialog"><h2>Start new</h2><p>Every tile goes back to Floor, and every NPC and enemy is removed. Your team's start tiles stay. You can Undo this.</p><button type="button" class="btn danger" data-act="s:fresh-go">Start new</button><button type="button" class="btn ghost" data-act="s:close">Cancel</button></div></div>` : "";
   const undo = host.readOnly ? "" : `<button type="button" class="btn ghost undo" data-act="s:undo"${canUndo(sess.stack) ? "" : " disabled"}>${canUndo(sess.stack) ? "Undo" : "Nothing to undo"}</button>`;
@@ -163,13 +166,13 @@ export function stageScreen(stageId: string, host: Host): string {
   const who = sess.ask === null ? "" : askName(got.parsed, got.stage, sess.ask);
   const ask = sess.ask === null ? "" : sess.talking ? talkSheet(who, talkLimit(got.slice), sess.line) : askSheet(who);
   const pick = sess.pick === null ? "" : unitPicker(unitChoices(got.parsed));
-  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${pick}${ask}${view}${confirm}${rulesSheet(host.files, stageId, host.readOnly)}`;
+  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, got.stage, placed, sess.sel)}</div>${dock}${sheet}${sess.link === null ? "" : goesSheet(LINK_LABEL[sess.link], names.filter((row) => row.id !== stageId))}${pick}${ask}${view}${confirm}${rulesSheet(host.files, stageId, host.readOnly)}`;
 }
 function kept(host: Host): StageOut { return { ...host, leave: false, test: false }; }
 export async function stageClick(act: string, stageId: string, host: Host, io: Io): Promise<StageOut> {
   if (act === "s:back") { if (host.readOnly || sess.draft === null) return { ...host, leave: true, test: false }; const saved = await writeMap(io, host.files, host.rev, sess.draft); return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: host.readOnly ? host.banner : null, leave: true, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false }; }
   if (act === "s:test") return { ...host, leave: false, test: true };
-  if (act === "s:close") { sess.sheet = null; sess.view = false; sess.confirm = false; sess.pick = null; sess.ask = null; sess.talking = false; return kept(host); }
+  if (act === "s:close") { sess.sheet = null; sess.view = false; sess.confirm = false; sess.pick = null; sess.ask = null; sess.talking = false; sess.link = null; return kept(host); }
   if (act === "s:view") { sess.view = true; sess.sheet = null; sess.confirm = false; return kept(host); }
   if (act === "s:grid") { sess.gridOn = !sess.gridOn; return kept(host); }
   if (host.readOnly) return kept(host);
@@ -178,7 +181,7 @@ export async function stageClick(act: string, stageId: string, host: Host, io: I
   if (act === "s:fresh") { sess.confirm = true; sess.sheet = null; sess.view = false; return kept(host); }
   if (act === "s:undo") {
     const item = pop(sess.stack); if (item === null) return kept(host);
-    sess.stack = item.rest; sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.moving = null; sess.pick = null; sess.ask = null; sess.talking = false;
+    sess.stack = item.rest; sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.moving = null; sess.pick = null; sess.ask = null; sess.talking = false; sess.link = null;
     const snap = item.snap;
     if (isObj(snap) && typeof snap["cols"] === "number") {
       sess.draft = snap; const saved = await writeMap(io, host.files, host.rev, snap);
@@ -234,6 +237,9 @@ export async function stageClick(act: string, stageId: string, host: Host, io: I
   }
   const here = (): Mark | null => sess.sheet === null ? null : placed.find((item) => sess.sheet !== null && same(item, sess.sheet)) ?? null;
   if (act === "s:place:spawn" && sess.sheet !== null) { const at = sess.sheet; sess.sheet = null; return commitStage(io, host, addSpawn(got.stage, at), got.stage); }
+  if (act.startsWith("s:link:") && sess.sheet !== null) { const type = act.slice(7); if (type !== "stairs" && type !== "door" && type !== "gate") return kept(host); sess.link = type; return kept(host); }
+  if (act.startsWith("s:to:") && sess.link !== null && sess.sheet !== null) { const id = act.slice(5); if (!stageRows(host.files).some((row) => row.id === id)) return kept(host); const next = addLink(got.stage, sess.link, sess.sheet.c, sess.sheet.r, id); if (next === null) return kept(host); sess.link = null; sess.sheet = null; return commitStage(io, host, next, got.stage); }
+  if (act === "s:unlink" && sess.sheet !== null) { const at = sess.sheet; sess.link = null; sess.sheet = null; return commitStage(io, host, removeLink(got.stage, at.c, at.r), got.stage); }
   if (act === "s:place:npc" || act === "s:place:enemy") { if (sess.sheet === null) return kept(host); sess.pick = act.endsWith("enemy") ? "enemy" : "npc"; return kept(host); }
   if (act.startsWith("s:unit:") && sess.pick !== null && sess.sheet !== null) {
     const id = act.slice(7), at = sess.sheet;
```

### `tools/maker/stage-sheets.ts` (edited)

```diff
diff --git a/tools/maker/stage-sheets.ts b/tools/maker/stage-sheets.ts
index be80af8..99e7990 100644
--- a/tools/maker/stage-sheets.ts
+++ b/tools/maker/stage-sheets.ts
@@ -1,6 +1,9 @@
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
 export const placeButtons = (rows: readonly { readonly id: string; readonly label: string }[]): string => rows.map((row) => `<button type="button" class="btn" data-act="s:place:${esc(row.id)}">${esc(row.label)}</button>`).join("");
+export const LINK_LABEL = { stairs: "Stairs", door: "Door", gate: "Gate" } as const;
+export const linkRows = (rows: readonly { readonly id: string; readonly name: string }[]): string => rows.map((row) => `<button type="button" class="btn" data-act="s:to:${esc(row.id)}">${esc(row.name)}</button>`).join("");
+export const goesSheet = (label: string, rows: readonly { readonly id: string; readonly name: string }[]): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(label)} goes to</h2>${linkRows(rows)}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
 export const unitPicker = (units: readonly { readonly id: string; readonly name: string }[]): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a unit</h2>${units.map((unit) => `<button type="button" class="btn" data-act="s:unit:${esc(unit.id)}">${esc(unit.name)}</button>`).join("")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
 export const askSheet = (name: string): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><button type="button" class="btn" data-act="s:stand">Just stand here</button><button type="button" class="btn" data-act="s:talk-open">Talk</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
 export const talkSheet = (name: string, max: number | null, line: string): string => { const cap = max === null ? "" : ` maxlength="${max}" data-max="${max}"`; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><input class="name-field" data-talk${cap} value="${esc(line)}" aria-label="Talk line"><button type="button" class="btn" data-act="s:talk-save">Save</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`; };
```
