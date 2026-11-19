# Rebuild record: step 4b, placing units and NPCs on the stage editor

Original brief: [`docs/maker/steps/step-04-stage-editor.md`](../maker/steps/step-04-stage-editor.md) r6, the 4b sections (L189-266) and the shared run rules (blob `35cc37db`, sha256 `d68a075a6ae2be61321afa3cf2e356e2d0b334e9cb448d759ab128ae209dab10`, 384 lines, the same on main, the base and at the merge). Do [`step-04a.md`](step-04a.md) and [`step-00b.md`](step-00b.md) first; this step starts on the S0b merge and needs 4a and 03b as well (guide L7, L18, L191). This file records exactly what shipped.

Sources: PR #85 and branches `step/step-04b-stage-place-r1-chatA` (r1 tip `429ad97b`, r1 code head `516cbfbe`) and `step/step-04b-stage-place-r2-chatA` (r2 tip `82e8ab1c`, r2 code head `d27a0d24`); `handback/step-04b-stage-place/r1/HANDBACK.md` at `429ad97b` (HB1, blob `e75f06ce`, 69 lines) and `handback/step-04b-stage-place/r2/HANDBACK.md` at `82e8ab1c` (HB2, blob `857ae527`, 39 lines); Chief Of Staff verify reports `/workspace/share/step-04b-verify/report.md` (V1, sha256 `c22cb0507afa172a1dd2748fcbefcde8fca9120936ae4b5b482ba19514348cad`, 50 lines) and `/workspace/share/step-04b-r2-verify/report.md` (V2, sha256 `381828e016a25b847d3d643030f2a26595078b16061fe53499b012c37fbfc323`, 30 lines). `docs/qa/step-04b-review.md` (QA1, git hash-object `2d500838`, 31 lines, already on main `4867f363` and at the merge): **NOT OK**, two must-fixes, both in test/harness files. `docs/qa/step-04b-r2-review.md` (QA2, git hash-object `49474b3f`, 39 lines, on main `07c369ea`): **OK TO OPEN PR**, product unchanged from r1. Line numbers are at the commit named. Code line cites are at merge `a85ae665` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `d62f87bc521115cff588282a48ce086535743207`, the step 00b merge (PR #84). Floor **1060** tests (guide L17, L251: the base's count + N; the go-line base is the 00b merge, already 1060, and already includes 4a and 03b) |
| r1 commits | `516cbfbe` maker: place units and NPC talk on the stage editor (code head, tree `a4b44f5d`, HB1:3), `429ad97b` hand-back (tree `4d1a434c`, V1). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Product behaviour passed. QA **NOT OK** (QA1:3). Two must-fixes, both in test/harness files, no product change required (QA1:3, QA1:8-9): the s4b smoke's `tap()` ended in `waitForTimeout(120)` and was flaky under CPU load; the maker-law / stage-place `kind` scan was `/"kind"\s*:/` and missed an unquoted `{ kind: "behaviour-setup" }` |
| r2 commits | on `step/step-04b-stage-place-r2-chatA`, built on the r1 tip: `d27a0d24` test: wait for stage redraw and catch an unquoted kind (code head, tree `025b6cae`, HB2:3), `82e8ab1c` hand-back (tree `1e80d27e`, V2, QA2:5). No product file changed |
| r2 verdict | QA **OK TO OPEN PR** (QA2:3). Both must-fixes pass. The smoke waits on cell labels or free-roam text after each save. The `kind` regex is `/["']?\bkind["']?\s*:/` with an unquoted plant. The `stage.ts:31` `kind: string` hit is a narrow, fail-closed allow-list (QA2:24-32). Gate 308 + 34 = 342. Behaviour is unchanged |
| Merge | PR #85 "Step 4b: stage place (r2)", merge commit `a85ae665cbb4db53b958be6e29b2f68ec56c4d60`, 2026-11-19 22:46 (UK time). Tree `e82c28d0a78b0eab01395e8596a45d6bf8dd2277` (the same tree CoS merged against `4867f363`; V2, QA2:38). First parent `4867f36301c4b0159d9e4cec0e41487b67405b4a` (the step-00b rebuild record and QA reviews, plus the 4b r1 QA review, all docs-only after `d62f87bc`), second parent `82e8ab1c` |
| After the merge | main is `07c369ea2af9412306d8f18b48f249357a08385d`, which adds the r2 QA review. Both `docs/qa/step-04b-review.md` and `docs/qa/step-04b-r2-review.md` are on main |
| Tests | 1060 + N=3 (`talk skeleton loads`, `talk limit: slice matches format`, `place rows, moves, talk and start new`) = **1063 pass / 0 fail** (HB2:13-21, V2, QA2:35) |
| Size | Accepted measure, `git diff --shortstat d62f87bc..d27a0d24 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4b-stage-place/**' ':!handback/**'`, is 8 files, **308 insertions + 34 deletions = 342** ≤ 400 (G7: `docs/qa/handback-checklist.md` L26 and `BUILD_GUIDE.md` L123, insertions plus deletions; guide L251 “as in 4a” L166, with the s4b smoke dir; `handback/**` is the accepted extra exclude; QA1:13, QA2:36, HB2:22). The same shortstat holds at the r2 tip `82e8ab1c`. r1 at `516cbfbe` was 306 + 34 = 340; the +2 is `tests/editor/stage-place.test.ts` (71 → 73). On the merge commit, also exclude `':!docs/**'` (or measure at the code head): main added four docs files after the base, 1195 insertions, which are not this step. Without that exclusion the merge shortstat is 12 files, 1503 insertions and 34 deletions. The s4b smoke is 51 lines, under its own cap of 130 (guide L227, L232; it was 49 in r1) |
| Stamp | `node tools/maker/build.ts <out>` writes `<out>/maker/index.html`, `<out>/maker/cb00d1cf815f/` and `<out>/play-stage/cb00d1cf815f/index.html` (HB1:37, QA1:16). The stamp is a content hash of the maker sources, so r2 did not change it |
| Smoke | No `tools/play-stage/` change, so S0 is not required (guide L36, L248, L262). S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`) is unedited. The s4b smoke prints `SMOKE PASS` once, after checks 1–8 at 390 and at 360, under google-chrome on port 8800; the s4a smoke does the same on port 8799 (guide L232, L262; HB2:25-29; V2; QA2:14-17) |

## (b) Files

From `git diff --name-status d62f87bc..82e8ab1c -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions against the base (the r2 values, which is what merged). The same 10 product files are on the merge tree `e82c28d0`.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `src/editor/stage/place.ts` | new | 66 (cap 70) | Pure: add, move and remove a placement; which place rows a tile gets; the refuse sentence; `hasEnemies` / `hasPlayer` / `infoText` (guide L220) |
| `src/editor/stage/talk.ts` | new | 26 (cap 35) | Pure: `talkLimit` from the slice, `talkKnobs`, `fillTalk` into a new talk setup (guide L221) |
| `src/editor/stage/paint.ts` | edited | 6 (6+, cap 10) | `startNew` clears neutrals and fixed enemy entries, then calls the existing `clearGround` (guide L222) |
| `tools/maker/stage.ts` | edited | 150 (122+/28−, cap 85) | Place rows, the picker, What do they do?, Talk, the placed-unit sheet, the Move chip, the free-roam / no-player-side info rows, Start new, the click router and the session. Over the file cap; the 4b sheet HTML moved to `stage-sheets.ts` as guide L223 allows (HB1:58; QA1:28) |
| `tools/maker/stage-sheets.ts` | new | 8 (inside the `stage.ts` cap) | Render-only sheet builders: place buttons, unit picker, ask/talk sheets, unit buttons, move chip (guide L223; QA1:23: not a pass-through) |
| `data/templates/setup.talk.json` | new | 15, data, not counted | Talk skeleton (D10). The only place a `kind` or `formatVersion` for a new setup is written (guide L204-205, L224) |
| `tests/editor/stage-place.test.ts` | new | 73 (cap 95; 71 in r1) | Named tests `talk skeleton loads` and `talk limit: slice matches format`, plus `place rows, moves, talk and start new` (guide L225, L252-261) |
| `tests/editor/maker-law.test.ts` | edited | 5 (3+/2−, cap 5) | Plant: no `kind` or `formatVersion` literal for a new document in `src/editor/stage/**`. r2 widens the regex and adds the unquoted plant (guide L226; QA1:9, QA2:21) |
| `handoff/steps/tests/s4b-stage-place/smoke.mjs` | new | 51 (cap 130; 49 in r1) | Browser smoke, own cap, outside the 400 (guide L227, L232). r2 replaces the 120 ms `tap()` sleep with `waitForFunction` waits |
| `tools/maker/home.ts` | edited | 8 (4+/4−) | Extra, not in the guide table: boot parses `setup.talk.json` through `parseProject` and skips it, so the skeleton is not copied into an empty project; the talk field clips to the slice max; `bytes` is passed into the stage session (HB1:59) |

No other product file. Nothing under `tools/play-stage/`, `tests/tools/golden/`, `fixtures/`, `src/` outside `src/editor/stage/`, `package.json` or `package-lock.json`. `src/editor/stage/sheet.ts` and `src/editor/stage/undo.ts` are untouched. Path and Dirt stay hidden (guide L199; HB1:56).

One-job rule (`docs/qa/handback-checklist.md` §3 I, L67): no touched code file is over about 500 lines. The largest is `stage.ts` at 255 lines. `stage-sheets.ts` holds the 4b sheet HTML, one job (QA1:23).

## (c) Key code and git commands

`place.ts` is the pure placement helper. Types at `src/editor/stage/place.ts:2-5`:

```ts
export type Cell = { readonly c: number; readonly r: number };
export type PlaceList = "spawn" | "npc" | "enemy";
export type PlaceRef = { readonly list: PlaceList; readonly index: number };
export type PlaceRow = { readonly id: PlaceList; readonly label: string };
```

`placeRows` (`place.ts:14-19`) always offers Your team start and NPC, and adds Enemy only when `enemyPool.mode` is `"fixed"`. `addSpawn`, `addNeutral` and `addEnemy` (`place.ts:37-43`) write only `{c,r}` or `{unitId, at: {c,r}}`. They do not write `side`, `facing` or `kind: "npc"` (guide L245). `refuse` (`place.ts:44`) is `"A unit stands here"` or `"<label> blocks units"`. `moveEntry` and `removeEntry` (`place.ts:45-57`) touch only that entry. `standHere` (`place.ts:58-62`) deletes `setupIds` and leaves the talk file. `attachTalk` (`place.ts:63-66`) sets `setupIds` to `[setupId]`.

The info rows (guide L206, plus the go-line extra) are `infoText` at `place.ts:31-36`:

```ts
export function infoText(stage: Obj, chosen: number): readonly string[] {
  const out: string[] = [];
  if (!hasEnemies(stage)) out.push("No enemies: free roam.");
  if (!hasPlayer(stage, chosen)) out.push("No player side: Test never reaches an outcome.");
  return out;
}
```

`meOf` (`place.ts:11`) defaults `loadout` to `"player"`, the format default, not a silent Law 12 default. The editor reads `infoText` in `tools/maker/stage.ts:159` as `infoText(got.stage, chosen(got.parsed, got.stage).length)`.

`talk.ts` never writes a talk-length number. `talkLimit` (`src/editor/stage/talk.ts:9`) reads `talk.line.max_len` from the slice at run time:

```ts
export function talkLimit(slice: Obj): number | null { const knob = talkKnob(slice, "line"); const max = knob?.["max_len"]; return typeof max === "number" && Number.isInteger(max) && max >= 0 ? max : null; }
```

`fillTalk` (`talk.ts:21-25`) copies the skeleton, sets a new `setup_<ULID>` id and the name `"<Unit name> talk"`, writes `answers.line` as `{ source: "user", value: line }` and every other defaulted knob as `{ source: "default" }` with no `value`. A knob with `no_default_reason` is skipped by `talkKnobs` (`talk.ts:14-15`). There is no `kind` or `formatVersion` literal in this file. The skeleton itself, `data/templates/setup.talk.json:2-3,9`, is the only place those keys are written for a new setup:

```json
"kind": "behaviour-setup",
"formatVersion": 3,
```

and `"createdAt": "2026-11-19T00:00:00Z"` (a carry: `fillTalk` does not set it; QA1:27).

`startNew` (`src/editor/stage/paint.ts:36-41`) keeps `clearGround` for 4a and widens the clear for 4b (guide L222; HB1:60):

```ts
export function startNew(map: Obj, stage: Obj): { readonly map: Obj; readonly stage: Obj } {
  const next = structuredClone(stage) as Obj, pool = isObj(next["enemyPool"]) ? { ...next["enemyPool"] } : null;
  next["neutrals"] = [];
  if (pool !== null && pool["mode"] === "fixed") next["enemyPool"] = { ...pool, entries: [] };
  return { map: clearGround(map), stage: next };
}
```

`playerSpawns` stay. `enemyPool.mode` is not changed. The Start new warning at `tools/maker/stage.ts:153` is the 4b sentence: "Every tile goes back to Floor, and every NPC and enemy is removed. Your team's start tiles stay. You can Undo this."

The 4b sheets live in `tools/maker/stage-sheets.ts:3-8`: `placeButtons`, `unitPicker`, `askSheet`, `talkSheet`, `unitButtons`, `moveChip`. The ask/talk copy is "NPCs are neutral: no one can attack them, and they don't act." (guide L200). Place, Move, Delete and What do they do? are `.btn`, not `.choice`, so the 4a smoke's `.choice` list stays `Floor|Water|Wall block` (HB1:57). Pills say Enemy, not Foe (`stage.ts:48`, `teamOf` at `stage.ts:127`; HB1:61).

`tools/maker/home.ts` is the extra counted file. Boot at `home.ts:91` parses `setup.talk.json` through `parseProject` and calls `rememberTalk` (`stage.ts:28`), then `continue`s so the skeleton is not copied into an empty project. The talk input at `home.ts:96` clips with `stageLine` (`stage.ts:29`). `stageClick` is given `bytes` at `home.ts:78`.

The three named tests are in `tests/editor/stage-place.test.ts:23-73`. `talk skeleton loads` (`:23`) runs `readSetup` on the skeleton. `talk limit: slice matches format` (`:24-30`) reads the `line` (text, max N code points) sentence from `docs/maker/data/project-format.md` and `talk.line.max_len` from the demo slice, and writes neither number in the test (guide L260). `place rows, moves, talk and start new` covers the rest of L253-261.

After r2, that third test also holds the widened document-key scan (`stage-place.test.ts:50-53`):

```ts
const docRe = /\bformatVersion\b|["']?\bkind["']?\s*:/;
const srcFiles = ["src/editor/stage/talk.ts", "src/editor/stage/place.ts", "src/editor/stage/paint.ts", "tools/maker/stage.ts", "tools/maker/stage-sheets.ts"];
const hits = srcFiles.flatMap((rel) => readFileSync(join(root, rel), "utf8").split("\n").flatMap((line, i) => (docRe.test(line) ? [`${rel}:${i + 1}: ${line.trim()}`] : [])));
assert.deepEqual(hits, ["tools/maker/stage.ts:31: function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {"]);
```

That one allowed hit is `tools/maker/stage.ts:31`:

```ts
function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {
```

`kind` here is a folder-name parameter: L32 keeps a file whose path starts with that `kind` and a slash, then matches `doc["id"]`. See (d) for the ruling.

The s4b smoke at the merge is the r2 file (`handoff/steps/tests/s4b-stage-place/smoke.mjs`, 51 lines). `tap()` (`smoke.mjs:16`) returns as soon as the tap lands. `waitLabel` and `waitText` (`:19-20`) are `page.waitForFunction` on the cell `aria-label` or `document.body.innerText`, with a 15 s timeout. After each save the smoke waits: talk-save for the NPC label and the talk field gone (`:30`); enemy place, move, delete, undo, Start new, and the post-Test undo on the label or `"No enemies: free roam."` (`:31-45`). Opening Add here and the water refusal wait on `"Your team start"` and `"Water blocks units"` (`:28`, `:32`; HB2:37). `press()` still has `waitForTimeout(80)` at `:17` (HB2:36). Check 6 uses `window.__hud.hideBanner()` (`:34`); `__hud` is the existing DEV global at `tools/play-stage/page.ts:55` (QA2:13).

## (d) What went wrong, in order, and the fix

**r1.** The product shipped and green was 1063/0. The official gate was 306 + 34 = 340. Solo smokes passed. QA **NOT OK** (QA1:3) with two must-fixes, both in test/harness files; "No product code needs to change" (QA1:3).

1. **Flaky s4b smoke (QA1:8).** `tap()` in r1 `smoke.mjs` (at the r1 tip, L16) ended with `waitForTimeout(120)`. Checks 4, 5, 7 and 8 then read `aria-label` or `innerText` immediately, before the async save and re-render finished. QA reproduced this with 8 busy-loop CPU hogs: the smoke failed 3/3 (checks 7-8 in run 1, then 4-8 cascaded). Raising the sleep to 1500 ms passed 2/2, so this was smoke timing, not a product race. CoS's first r1 run also failed checks 7-8 at 390 only, then passed on two solo reruns (V1). Fix required: after each tap that saves, wait for the expected state (`page.waitForFunction` on the cell `aria-label`, or on the free-roam text) instead of a fixed pause. Keep the smoke within 130 lines.

2. **Unquoted `kind` (QA1:9).** `tests/editor/maker-law.test.ts:16` in r1 used `/"kind"\s*:/`. A planted `src/editor/stage/zz.ts` holding `export const d = { kind: "behaviour-setup" };` passed maker-law. The same file with `"kind":` failed, as it should. Guide L226 is "no `kind` or `formatVersion` literal for a new document in `src/editor/stage/**`", and in TypeScript the unquoted key is the likely way to write one. The source scan in `tests/editor/stage-place.test.ts` (`/\bformatVersion\b|"kind"\s*:/` in r1) had the same gap. Fix required: match `/["']?\bkind["']?\s*:/` and add an unquoted plant to the maker-law plant list; widen the stage-place scan too.

**r2.** Built on the r1 tip. The only changes are `handoff/steps/tests/s4b-stage-place/smoke.mjs`, `tests/editor/maker-law.test.ts`, `tests/editor/stage-place.test.ts`, and the r2 HANDBACK (QA2:8, V2, HB2:5-11). All seven product blobs are identical to r1 code head `516cbfbe`.

- `tap()` no longer sleeps 120 ms (`smoke.mjs:16`). The new helpers wait after every save, and also after the two non-save reads that used to ride the same pause (HB2:37). `press()` still waits 80 ms (`:17`); QA's failure was `tap()`'s 120 ms, and the go-line said to change nothing else (HB2:36). The smoke is 51 lines. QA reran s4b under 8 CPU-burn loops: **4/4 pass**; r1 failed 3/3 under the same load (QA2:16). CoS: 3/3 pass, including one run under 8 burns (V2).
- `maker-law.test.ts:16` is `/["']?\bkind["']?\s*:/`. The L34 plant list adds `unquoted.ts` with `export const d = { kind: "behaviour-setup" };`. QA planted `{ kind: "behaviour-setup" }`, `{ "kind": ... }` and `{ 'kind': ... }` under `src/editor/stage/`; maker-law failed 1/1 in each case (QA2:21). The stage-place scan uses the same regex (`:50-53`).

**The `stage.ts:31` allow-list (QA2:24-32).** The widened regex also matches the existing parameter `kind: string` at `tools/maker/stage.ts:31`. That parameter was not renamed, because this round forbids a product edit (QA1:3, HB2:38). The stage-place scan pins that one exact line, text included (`stage-place.test.ts:53`). QA's plants: an extra `kind:` in `place.ts` fails both tests; a new `kind:` in `stage.ts` fails stage-place; changed text at L31 fails; a line shift in `stage.ts` fails. It is not a broad skip. The line-number pin is brittle (any unrelated edit above L31 forces a pin update) but it fails closed, so it is accepted. Note for 4c: whoever edits `stage.ts` updates the pin (QA2:31). maker-law's doc rule only covers paths with a `/stage/` directory, which is `src/editor/stage/**` as guide L226 intends. `tools/maker/stage.ts` is not in that scope; a `kind:` added there is caught only by the stage-place scan (QA2:32).

QA **OK TO OPEN PR** (QA2:3). The merge tree is `e82c28d0`, as predicted (QA2:38, V2).

## (e) Do it right first time

- Start from the 00b merge `d62f87bc`. The floor is 1060 + 3 = 1063.
- Put placement math in `place.ts` and talk-setup filling in `talk.ts`. Do not write `side`, `facing` or `kind` on a placement, and do not put a `kind` or `formatVersion` literal in `src/editor/stage` or `tools/maker`.
- The Talk field limit is the slice `max_len` at run time. Do not write the number in code, in the guide, or in the parity test.
- Skip `wipeRule` is S0b's work, not 4b's. Do not change `tools/play-stage/`. The no-enemy info row is "No enemies: free roam." The go-line also requires "No player side: Test never reaches an outcome."
- If 4a left Path and Dirt out, adding them here needs play-stage frames and a change to the 4a smoke's `Floor|Water|Wall block` list. If you leave them hidden, say so in the hand-back. Do not grey them.
- If `stage.ts` passes about 150 lines, move the 4b sheets into `stage-sheets.ts` (guide L223). A file may go over its cap if the total stays within 400 and the hand-back says which file and why (guide L230, L141).
- A smoke that reads a label after a save must wait for that state, not `waitForTimeout`. A `kind` scan must match the unquoted TypeScript form, not only `"kind":`. If the widened regex hits a real `kind: string` parameter, pin that exact line, fail-closed; do not add a broad skip, and do not rename the parameter in a tests-only rework.
- Measure with the 4a excludes, swapping in `':!handoff/steps/tests/s4b-stage-place/**'`, and `':!handback/**'`. Count insertions plus deletions. 342 is the accepted r2 number. The smoke's own cap is 130.

## (f) Rebuild check

From a clean tree at `d62f87bc`, write the 10 product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit:

```bash
# Product gate. On the merge also exclude docs/**, because main added the
# step-00b record, the 00b QA reviews, and the 4b r1 QA review after
# d62f87bc; those are not this step. The branch itself did not touch docs,
# so the same command without ':!docs/**' at the code head is the QA
# measure and is also 308 + 34 = 342.
git diff --shortstat d62f87bc..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4b-stage-place/**' ':!handback/**' ':!docs/**'
#   8 files changed, 308 insertions(+), 34 deletions(-)

git diff --shortstat d62f87bc..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4b-stage-place/**' ':!handback/**'   # at the code head or r2 tip
#   8 files changed, 308 insertions(+), 34 deletions(-)

sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --stat d62f87bc..HEAD -- tests/tools/golden/   # empty

sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

npm ci && npm run green   # 1063 pass, 0 fail. Includes:
#   ✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
#   ✔ talk skeleton loads
#   ✔ talk limit: slice matches format
#   ✔ place rows, moves, talk and start new

# Smokes under google-chrome, at 390 and 360 CSS px:
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS

# The s4b smoke should also pass while 8 CPU-burn loops are running
# (QA's r1 repro). `wc -l handoff/steps/tests/s4b-stage-place/smoke.mjs`
# is 51.
```

Against the merge tree: on your rebuild branch, `git diff a85ae665 HEAD -- src/editor/stage/place.ts src/editor/stage/talk.ts src/editor/stage/paint.ts tools/maker/stage.ts tools/maker/stage-sheets.ts tools/maker/home.ts data/templates/setup.talk.json tests/editor/stage-place.test.ts tests/editor/maker-law.test.ts handoff/steps/tests/s4b-stage-place` must be empty. The blob table below lists the exact git blob id each file must have at `a85ae665`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id. The product blobs other than the two tests and the smoke must also match r1 code head `516cbfbe`.

## QA non-blockers carried forward

From QA1:27-31. QA2:39 says they still stand. The r2 allow-list note is QA2:24-32. None of these blocked the PR.

1. `data/templates/setup.talk.json:9` has a fixed `createdAt` of `2026-11-19T00:00:00Z`, and `fillTalk` (`talk.ts:21-25`) does not set it (`planSave` sets only `rev` and `updatedAt`), so every new talk setup gets that date. Guide L204 does not list `createdAt`. Carry for 4c or a guide note (QA1:27).
2. `tools/maker/stage.ts` grew 122+/28− against a guidance cap of 85, and is 255 lines at the merge. The 4b sheets moved to `stage-sheets.ts` (8 lines). The total stays within 400, and caps are guidance only (guide L223, L230; HB1:58; QA1:28).
3. The 4a carries are still open: `chosen()` at `stage.ts:35-41` still duplicates play-stage's roster-to-spawn pick and is now also the length passed into `infoText` (`stage.ts:159`); `src/editor/stage/undo.ts` is unchanged (uncapped session stack; HB1:64); `tests/editor/maker-law.test.ts:33-35` still makes its plant dir inside `src/editor/stage/` with no `try/finally` (QA1:29). The 4b guide does not make any of these a must-fix.
4. `09-play.png` was taken with the YOUR TURN banner still up (HB1:49). The top bar and units are visible, so it is acceptable (QA1:30).
5. Path and Dirt stay hidden, not greyed. There was line budget left (340 + ~30 ≤ 400 in r1). They stayed out because the 4a smoke pins `Floor|Water|Wall block` and the play stage still draws only water and wall-block besides floor (HB1:56). 4c can add them if it also updates the play-stage frames and accepts that the 4a choice list will change (HB1:69).
6. The `stage.ts:31` allow-list is accepted, fail-closed. Whoever edits `stage.ts` in 4c must update `stage-place.test.ts:53` (QA2:31).

## Blob check

Each file must have exactly this git blob id at `a85ae665`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/editor/stage/place.ts` | `e062a9a1bae240fcef98aa1d837bcdb9b9c1e135` | 66 |
| `src/editor/stage/talk.ts` | `d17ce543576a969507ea95239bc3223106128984` | 26 |
| `src/editor/stage/paint.ts` | `ba00d1affcf58e72433fa5387f4d4fb117ce1277` | 41 |
| `tools/maker/stage.ts` | `2a130f3ef9bcc41aa16fca3ec95a0b27c54ea689` | 255 |
| `tools/maker/stage-sheets.ts` | `a71f93f571a229d1be7cfe7b69232970c3d98138` | 8 |
| `tools/maker/home.ts` | `705d8c50df93cb4b8cbbc461be2b55951aaa4b57` | 98 |
| `data/templates/setup.talk.json` | `2bb8f21c5a5d2b1ff7625afe91649680bc24ccb0` | 15 |
| `tests/editor/stage-place.test.ts` | `a15c1fdcfc2dbd174e492227b23da5e4a110ce40` | 73 |
| `tests/editor/maker-law.test.ts` | `f5ab7af13140d6416246a17c3fab1f90ff7db577` | 36 |
| `handoff/steps/tests/s4b-stage-place/smoke.mjs` | `8210a2b9d2b28e5652db3301a6205c00da76a989` | 51 |

## Appendix: full code as merged (step 4b, PR #85)

New files are given in full. Edited files are given as the exact diff from `d62f87bc` to `a85ae665`, then in full as merged. Copy them byte for byte; the blob table checks you did. The smoke, `stage-place.test.ts` and `maker-law.test.ts` are the r2 versions.

### `src/editor/stage/place.ts` (new)

```ts
type Obj = Record<string, unknown>;
export type Cell = { readonly c: number; readonly r: number };
export type PlaceList = "spawn" | "npc" | "enemy";
export type PlaceRef = { readonly list: PlaceList; readonly index: number };
export type PlaceRow = { readonly id: PlaceList; readonly label: string };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const clone = (stage: Obj): Obj => structuredClone(stage) as Obj;
function bag(stage: Obj): Obj | null { return Object.hasOwn(stage, "sides") && isObj(stage["sides"]) ? stage["sides"] : null; }
/** `loadout` missing means the format default, the same one placements use. */
export function meOf(stage: Obj): string { const sides = bag(stage); if (sides === null || !Object.hasOwn(sides, "loadout") || typeof sides["loadout"] !== "string") return "player"; return sides["loadout"]; }
function neutralOf(stage: Obj): string { const sides = bag(stage); if (sides === null || !Object.hasOwn(sides, "neutrals") || typeof sides["neutrals"] !== "string") return "neutral"; return sides["neutrals"]; }
function resolved(stage: Obj, entry: Obj): string { return typeof entry["side"] === "string" ? entry["side"] : neutralOf(stage); }
export function placeRows(stage: Obj): readonly PlaceRow[] {
  const rows: PlaceRow[] = [{ id: "spawn", label: "Your team start" }, { id: "npc", label: "NPC" }];
  const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : null;
  if (pool !== null && pool["mode"] === "fixed") rows.push({ id: "enemy", label: "Enemy" });
  return rows;
}
export function hasPlayer(stage: Obj, chosen: number): boolean {
  const me = meOf(stage), spawns = list(stage["playerSpawns"]).filter(isObj).length;
  if (Math.min(chosen, spawns) > 0) return true;
  return list(stage["neutrals"]).some((entry) => isObj(entry) && resolved(stage, entry) === me);
}
export function hasEnemies(stage: Obj): boolean {
  const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : null;
  if (pool !== null && pool["mode"] === "fixed" && list(pool["entries"]).some(isObj)) return true;
  const me = meOf(stage);
  return list(stage["neutrals"]).some((entry) => isObj(entry) && resolved(stage, entry) !== "neutral" && resolved(stage, entry) !== me);
}
export function infoText(stage: Obj, chosen: number): readonly string[] {
  const out: string[] = [];
  if (!hasEnemies(stage)) out.push("No enemies: free roam.");
  if (!hasPlayer(stage, chosen)) out.push("No player side: Test never reaches an outcome.");
  return out;
}
export function addSpawn(stage: Obj, cell: Cell): Obj { const next = clone(stage), rows = [...list(next["playerSpawns"])]; rows.push({ c: cell.c, r: cell.r }); next["playerSpawns"] = rows; return next; }
export function addNeutral(stage: Obj, unitId: string, cell: Cell): Obj { const next = clone(stage), rows = [...list(next["neutrals"])]; rows.push({ unitId, at: { c: cell.c, r: cell.r } }); next["neutrals"] = rows; return next; }
export function addEnemy(stage: Obj, unitId: string, cell: Cell): Obj | null {
  const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : null;
  if (pool === null || pool["mode"] !== "fixed") return null;
  const next = clone(stage); next["enemyPool"] = { ...pool, entries: [...list(pool["entries"]), { unitId, at: { c: cell.c, r: cell.r } }] }; return next;
}
export function refuse(block: "closed" | "occupied" | null, label: string): string | null { return block === "occupied" ? "A unit stands here" : block === "closed" ? `${label} blocks units` : null; }
export function moveEntry(stage: Obj, ref: PlaceRef, cell: Cell): Obj {
  const next = clone(stage);
  if (ref.list === "spawn") { const rows = [...list(next["playerSpawns"])]; const cur = rows[ref.index]; if (isObj(cur)) rows[ref.index] = { ...cur, c: cell.c, r: cell.r }; next["playerSpawns"] = rows; return next; }
  const key = ref.list === "npc" ? "neutrals" : "enemyPool";
  if (key === "neutrals") { const rows = [...list(next["neutrals"])]; const cur = rows[ref.index]; if (isObj(cur)) rows[ref.index] = { ...cur, at: { c: cell.c, r: cell.r } }; next["neutrals"] = rows; return next; }
  const pool = isObj(next["enemyPool"]) ? next["enemyPool"] : {}; const rows = [...list(pool["entries"])]; const cur = rows[ref.index]; if (isObj(cur)) rows[ref.index] = { ...cur, at: { c: cell.c, r: cell.r } }; next["enemyPool"] = { ...pool, entries: rows }; return next;
}
export function removeEntry(stage: Obj, ref: PlaceRef): Obj {
  const next = clone(stage), drop = (rows: readonly unknown[]): unknown[] => rows.filter((_, i) => i !== ref.index);
  if (ref.list === "spawn") { next["playerSpawns"] = drop(list(next["playerSpawns"])); return next; }
  if (ref.list === "npc") { next["neutrals"] = drop(list(next["neutrals"])); return next; }
  const pool = isObj(next["enemyPool"]) ? next["enemyPool"] : {}; next["enemyPool"] = { ...pool, entries: drop(list(pool["entries"])) }; return next;
}
export function standHere(stage: Obj, index: number): Obj {
  const next = clone(stage), rows = [...list(next["neutrals"])], cur = rows[index];
  if (!isObj(cur)) return next;
  const copy = { ...cur }; delete copy["setupIds"]; rows[index] = copy; next["neutrals"] = rows; return next;
}
export function attachTalk(stage: Obj, index: number, setupId: string): Obj {
  const next = clone(stage), rows = [...list(next["neutrals"])], cur = rows[index];
  if (isObj(cur)) rows[index] = { ...cur, setupIds: [setupId] }; next["neutrals"] = rows; return next;
}
```

### `src/editor/stage/talk.ts` (new)

```ts
type Obj = Record<string, unknown>;
export type KnobUse = { readonly id: string; readonly use: "user" | "default" };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
function talkKnob(slice: Obj, id: string): Obj | null {
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "talk") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === id) return knob;
  return null;
}
export function talkLimit(slice: Obj): number | null { const knob = talkKnob(slice, "line"); const max = knob?.["max_len"]; return typeof max === "number" && Number.isInteger(max) && max >= 0 ? max : null; }
export function talkKnobs(slice: Obj): readonly KnobUse[] {
  const out: KnobUse[] = [];
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "talk") for (const knob of list(b["knobs"])) {
    if (!isObj(knob) || typeof knob["id"] !== "string") continue;
    const reason = Object.hasOwn(knob, "no_default_reason") ? knob["no_default_reason"] : undefined;
    if (typeof reason === "string" && reason !== "") continue;
    if (knob["id"] === "line") { out.push({ id: "line", use: "user" }); continue; }
    if (Object.hasOwn(knob, "default")) out.push({ id: knob["id"], use: "default" });
  }
  return out;
}
export function fillTalk(skeleton: Obj, id: string, unitName: string, rev: number, line: string, knobs: readonly KnobUse[]): Obj {
  const next = structuredClone(skeleton) as Obj, catalogue = isObj(next["catalogue"]) ? { ...next["catalogue"] } : {}, answers: Obj = {};
  next["id"] = id; next["name"] = `${unitName} talk`; catalogue["rev"] = rev; next["catalogue"] = catalogue;
  for (const knob of knobs) answers[knob.id] = knob.use === "user" ? { source: "user", value: line } : { source: "default" };
  next["answers"] = answers; return next;
}
```

### `tools/maker/stage-sheets.ts` (new)

```ts
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export const placeButtons = (rows: readonly { readonly id: string; readonly label: string }[]): string => rows.map((row) => `<button type="button" class="btn" data-act="s:place:${esc(row.id)}">${esc(row.label)}</button>`).join("");
export const unitPicker = (units: readonly { readonly id: string; readonly name: string }[]): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a unit</h2>${units.map((unit) => `<button type="button" class="btn" data-act="s:unit:${esc(unit.id)}">${esc(unit.name)}</button>`).join("")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
export const askSheet = (name: string): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><button type="button" class="btn" data-act="s:stand">Just stand here</button><button type="button" class="btn" data-act="s:talk-open">Talk</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
export const talkSheet = (name: string, max: number | null, line: string): string => { const cap = max === null ? "" : ` maxlength="${max}" data-max="${max}"`; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><input class="name-field" data-talk${cap} value="${esc(line)}" aria-label="Talk line"><button type="button" class="btn" data-act="s:talk-save">Save</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`; };
export const unitButtons = (npc: boolean): string => `<button type="button" class="btn" data-act="s:move">Move</button><button type="button" class="btn" data-act="s:delete">Delete</button>${npc ? `<button type="button" class="btn" data-act="s:ask">What do they do?</button>` : ""}`;
export const moveChip = (name: string): string => `<div class="chip" role="status"><span>Moving ${esc(name)} · Tap a tile</span><button type="button" class="btn" data-act="s:move-cancel">Cancel</button></div>`;
```

### `data/templates/setup.talk.json` (new)

```json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_00000000000000000000000000",
  "rev": 0,
  "name": "Talk",
  "behaviourId": "talk",
  "catalogue": { "rev": 0 },
  "createdAt": "2026-11-19T00:00:00Z",
  "updatedAt": "2026-11-19T00:00:00Z",
  "copiedFrom": null,
  "answers": {},
  "orphans": {},
  "history": { "cap": 200, "baseSeq": 0, "ops": [] }
}
```

### `tests/editor/stage-place.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev, ulid } from "../../src/editor/project/home.ts";
import { startNew } from "../../src/editor/stage/paint.ts";
import { addEnemy, addNeutral, addSpawn, attachTalk, hasEnemies, hasPlayer, infoText, moveEntry, placeRows, refuse, removeEntry, standHere } from "../../src/editor/stage/place.ts";
import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
import { readProject } from "../../src/project/load/index.ts";
import { readSetup } from "../../src/project/read/setups.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { bindStage, rememberTalk, stageClick, stageLine, stageScreen, type Host } from "../../tools/maker/stage.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), STAGE = "stage_01JDAS00000000000000000001", MAP = "stages/stage_01JDAS00000000000000000001.json", NOW = "2026-11-19T00:00:00.000Z", CLERIC = "unit_01JDAN00000000000000000003";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);
const readDir = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, walk = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, next); else out[next] = readFileSync(path, "utf8"); } }; walk(join(root, rel), ""); return out; };
const rest = (doc: Obj, key: string): Obj => Object.fromEntries(Object.entries(doc).filter(([k]) => k !== key));
const skeleton = (): Obj => { const parsed = parseProject({ "setups/setup.talk.json": readFileSync(join(root, "data/templates/setup.talk.json"), "utf8") }); if (!parsed.ok) throw new Error(parsed.message); const doc = parsed.files["setups/setup.talk.json"]; if (!isObj(doc)) throw new Error("skeleton"); return doc; };
test("talk skeleton loads", () => { assert.equal(readSetup(skeleton()).ok, true); });
test("talk limit: slice matches format", () => {
  const said = readFileSync(join(root, "docs/maker/data/project-format.md"), "utf8").match(/`line` \(text, max (\d+) code points\)/);
  const slice = JSON.parse(readFileSync(join(root, "fixtures/demo.tileproj/catalogue/slice.json"), "utf8")) as Obj;
  let max: number | null = null;
  for (const b of list(slice["behaviours"])) if (b["id"] === "talk") for (const knob of list(b["knobs"])) if (knob["id"] === "line" && typeof knob["max_len"] === "number") max = knob["max_len"];
  assert.equal(max, said === null ? null : Number(said[1])); assert.equal(talkLimit(slice), max);
});
test("place rows, moves, talk and start new", async () => {
  const stage: Obj = { history: { cap: 1, ops: [] }, name: "A", playerSpawns: [], neutrals: [], enemyPool: { mode: "fixed", entries: [] } };
  const spawned = addSpawn(stage, { c: 1, r: 2 }); assert.deepEqual(spawned["playerSpawns"], [{ c: 1, r: 2 }]); assert.deepEqual(rest(spawned, "playerSpawns"), rest(stage, "playerSpawns"));
  const npc = addNeutral(stage, "unit_a", { c: 2, r: 2 }); assert.deepEqual(npc["neutrals"], [{ unitId: "unit_a", at: { c: 2, r: 2 } }]); assert.deepEqual(rest(npc, "neutrals"), rest(stage, "neutrals"));
  const foe = addEnemy(stage, "unit_b", { c: 3, r: 2 }); assert.ok(foe !== null); if (foe === null) return;
  assert.deepEqual((foe["enemyPool"] as Obj)["entries"], [{ unitId: "unit_b", at: { c: 3, r: 2 } }]); assert.deepEqual(rest(foe, "enemyPool"), rest(stage, "enemyPool"));
  assert.equal(addEnemy({ enemyPool: { mode: "wave", entries: [] } }, "unit_b", { c: 0, r: 0 }), null);
  assert.deepEqual(placeRows(stage).map((row) => row.label), ["Your team start", "NPC", "Enemy"]); assert.equal(placeRows({ enemyPool: { mode: "wave" } }).some((row) => row.id === "enemy"), false);
  assert.equal(refuse("closed", "Water"), "Water blocks units"); assert.equal(refuse("occupied", "Floor"), "A unit stands here"); assert.equal(refuse(null, "Floor"), null);
  const moved = moveEntry(npc, { list: "npc", index: 0 }, { c: 4, r: 1 }); assert.deepEqual(list(moved["neutrals"])[0]?.["at"], { c: 4, r: 1 }); assert.deepEqual(rest(moved, "neutrals"), rest(npc, "neutrals"));
  const dropped = removeEntry(npc, { list: "npc", index: 0 }); assert.deepEqual(dropped["neutrals"], []); assert.deepEqual(rest(dropped, "neutrals"), rest(npc, "neutrals"));
  const fresh = startNew({ cols: 1, logic: { terrain: [1], palette: {} } }, foe); assert.deepEqual(fresh.stage["playerSpawns"], stage["playerSpawns"]); assert.deepEqual(fresh.stage["neutrals"], []); assert.deepEqual((fresh.stage["enemyPool"] as Obj)["entries"], []); assert.equal(hasEnemies(fresh.stage), false);
  const linked = attachTalk(npc, 0, "setup_x"), stood = standHere(linked, 0); assert.deepEqual(list(linked["neutrals"])[0]?.["setupIds"], ["setup_x"]); assert.equal(Object.hasOwn(list(stood["neutrals"])[0] ?? {}, "setupIds"), false);
  assert.equal(hasPlayer({ playerSpawns: [], neutrals: [] }, 0), false);
  assert.deepEqual(infoText({ playerSpawns: [], neutrals: [], enemyPool: { mode: "fixed", entries: [] } }, 0), ["No enemies: free roam.", "No player side: Test never reaches an outcome."]);
  const knobs = talkKnobs({ behaviours: [{ id: "talk", knobs: [{ id: "line", default: "Hi" }, { id: "effect", default: "none" }, { id: "skip", no_default_reason: "later" }] }] });
  assert.deepEqual([...knobs], [{ id: "line", use: "user" }, { id: "effect", use: "default" }]);
  const made = fillTalk(skeleton(), "setup_01JDAT00000000000000000099", "Cleric", 29, "Hello", knobs), answers = made["answers"];
  assert.ok(isObj(answers)); if (!isObj(answers)) return; assert.deepEqual(answers["line"], { source: "user", value: "Hello" }); assert.deepEqual(answers["effect"], { source: "default" }); assert.equal(Object.hasOwn(answers, "value") || Object.hasOwn(answers, "skip"), false);
  const docRe = /\bformatVersion\b|["']?\bkind["']?\s*:/;
  const srcFiles = ["src/editor/stage/talk.ts", "src/editor/stage/place.ts", "src/editor/stage/paint.ts", "tools/maker/stage.ts", "tools/maker/stage-sheets.ts"];
  const hits = srcFiles.flatMap((rel) => readFileSync(join(root, rel), "utf8").split("\n").flatMap((line, i) => (docRe.test(line) ? [`${rel}:${i + 1}: ${line.trim()}`] : [])));
  assert.deepEqual(hits, ["tools/maker/stage.ts:31: function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {"]);
  const text = readDir("fixtures/demo.tileproj"), parsed = parseProject(text); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const bare = structuredClone(parsed.files[MAP]) as Obj; bare["playerSpawns"] = []; bare["neutrals"] = []; bare["enemyPool"] = { mode: "fixed", entries: [] };
  bindStage(STAGE, "none"); const quiet = stageScreen(STAGE, { files: { ...text, [MAP]: JSON.stringify(bare) }, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false });
  assert.match(quiet, /No player side: Test never reaches an outcome\./); assert.match(quiet, /No enemies: free roam\./);
  rememberTalk(skeleton()); const id = "project_01JDAP00000000000000000001", io = { store: memoryStore(), id, now: NOW, bytes: () => new Uint8Array(16).fill(1) };
  for (const [path, body] of Object.entries(text)) await io.store.write(`${prefix(id)}${path}`, body);
  bindStage(STAGE, id); const host: Host = { files: text, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false };
  const open = await stageClick("s:cell:2,8", STAGE, host, io); assert.match(stageScreen(STAGE, open), /Your team start/); assert.match(stageScreen(STAGE, open), />Floor</);
  const ask = await stageClick("s:unit:" + CLERIC, STAGE, await stageClick("s:place:npc", STAGE, open, io), io); assert.match(stageScreen(STAGE, ask), /Just stand here/); assert.equal(stageScreen(STAGE, ask).includes("Hostile"), false);
  const limit = talkLimit(parsed.files["catalogue/slice.json"] as Obj); assert.ok(limit !== null); if (limit === null) return;
  const talking = await stageClick("s:talk-open", STAGE, ask, io); assert.equal([...stageLine(`${"x".repeat(limit)}yy`, limit)].length, limit); stageLine("Smoke hello", limit);
  const saved = await stageClick("s:talk-save", STAGE, talking, io); assert.equal(saved.banner, null);
  const back = parseProject(saved.files); assert.equal(back.ok, true); if (!back.ok) return;
  const load = readProject(back.files); assert.equal(load.ok && load.report.length === 0 && load.project !== null, true); if (load.project === null) return;
  assert.equal(playDocsOf(load.project).talk[`talk-${CLERIC}`], "Smoke hello");
  const setupId = `setup_${ulid(Date.parse(NOW), new Uint8Array(16).fill(1))}`, setup = back.files[`setups/${setupId}.json`]; assert.ok(isObj(setup)); if (!isObj(setup)) return; assert.equal(readSetup(setup).ok, true);
  const cleared = await stageClick("s:stand", STAGE, await stageClick("s:ask", STAGE, await stageClick("s:cell:2,8", STAGE, saved, io), io), io);
  const after = parseProject(cleared.files); assert.equal(after.ok, true); if (!after.ok) return; assert.ok(after.files[`setups/${setupId}.json`] !== undefined);
  const stageDoc = after.files[MAP]; assert.ok(isObj(stageDoc)); if (!isObj(stageDoc)) return; assert.equal(list(stageDoc["neutrals"]).some((entry) => entry["unitId"] === CLERIC && Object.hasOwn(entry, "setupIds")), false);
});
```

### `handoff/steps/tests/s4b-stage-place/smoke.mjs` (new)

```js
// Step 4b stage place smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8800"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const slice = JSON.parse(readFileSync(join(root, "fixtures/demo.tileproj/catalogue/slice.json"), "utf8"));
const max = slice.behaviours.find((b) => b.id === "talk").knobs.find((k) => k.id === "line").max_len;
const www = mkdtempSync(join(tmpdir(), "s4b-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); return box; };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); await page.waitForTimeout(80); };
const label = (page, c, r) => page.locator(`[data-act="s:cell:${c},${r}"]`).getAttribute("aria-label");
const waitLabel = (page, c, r, bit, on) => page.waitForFunction(([c, r, bit, on]) => { const n = document.querySelector(`[data-act="s:cell:${c},${r}"]`); const t = n ? (n.getAttribute("aria-label") ?? "") : ""; return on ? t.includes(bit) : t.length > 0 && !t.includes(bit); }, [c, r, bit, on], { timeout: 15000 });
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await step("1 add here", async () => { await tap(page, "s:cell:0,0"); await waitText(page, "Your team start"); const got = await page.evaluate(() => { const buttons = [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()); const choice = [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent.trim()); const small = [...document.querySelectorAll(".sheet button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { buttons, choice, small: small.length }; }); if (got.choice.join("|") !== "Floor|Water|Wall block" || !got.buttons.includes("Your team start") || !got.buttons.includes("NPC") || !got.buttons.includes("Enemy") || got.small !== 0) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
    await step("2 what", async () => { await tap(page, "s:cell:2,8"); await tap(page, "s:place:npc"); await tap(page, "s:unit:unit_01JDAN00000000000000000003"); await waitLabel(page, 2, 8, "NPC", true); const rows = await page.evaluate(() => [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()).filter((t) => t !== "Close")); if (rows.join("|") !== "Just stand here|Talk" || rows.some((t) => /Hostile|Wander|Seller|Quest/.test(t))) throw new Error(rows.join("|")); });
    await step("3 talk", async () => { await tap(page, "s:talk-open"); const input = page.locator("[data-talk]"); await input.fill("x".repeat(max + 3)); const n = await input.evaluate((el) => [...el.value].length); if (n !== max) throw new Error(`len ${n}`); await input.fill("Smoke hello"); await tap(page, "s:talk-save"); await page.waitForFunction(() => { const n = document.querySelector('[data-act="s:cell:2,8"]'); return ((n && n.getAttribute("aria-label")) || "").includes("NPC") && document.querySelector("[data-talk]") === null; }, null, { timeout: 15000 }); const who = await label(page, 2, 8); if (!String(who).includes("NPC")) throw new Error(String(who)); });
    await step("4 enemy", async () => { await tap(page, "s:cell:4,0"); await tap(page, "s:place:enemy"); await tap(page, "s:unit:unit_01JDAN00000000000000000004"); await waitLabel(page, 4, 0, "Enemy", true); const who = await label(page, 4, 0); if (!String(who).includes("Enemy")) throw new Error(String(who)); });
    await step("5 move", async () => { await tap(page, "s:cell:2,8"); await tap(page, "s:move"); await tap(page, "s:cell:0,3"); await waitText(page, "Water blocks units"); await tap(page, "s:cell:1,7"); await waitLabel(page, 1, 7, "NPC", true); const who = await label(page, 1, 7); if (!String(who).includes("NPC")) throw new Error(String(who)); });
    await step("6 test", async () => {
      await tap(page, "s:test"); await page.waitForFunction(() => location.search.includes("stage=") && window.__play !== undefined, null, { timeout: 15000 }); await page.evaluate(() => window.__hud.hideBanner());
      const live = await page.evaluate(() => { const units = window.__play.world.units.all(); const npc = units.find((u) => u.at.c === 1 && u.at.r === 7); const foe = units.find((u) => u.at.c === 4 && u.at.r === 0); const me = units.find((u) => u.at.c === 1 && u.at.r === 8); window.__play.feed({ type: "SelectUnit", unitId: me.id }); const err = window.__play.choose("talk"); window.__play.feed({ type: "TargetCell", at: { c: 1, r: 7 } }); return { npc: npc && npc.side, foe: foe && foe.side, err, text: window.__play.talk && window.__play.talk.text }; });
      if (live.npc !== "neutral" || live.foe === "player" || live.foe === "neutral" || live.foe == null || live.text !== "Smoke hello") throw new Error(JSON.stringify(live));
      await press(page, "Back to maker"); if ((await page.locator(".cell").count()) !== 54) throw new Error("not editor");
    });
    await step("7 undo", async () => { await tap(page, "s:cell:4,0"); await tap(page, "s:delete"); await waitLabel(page, 4, 0, "Enemy", false); if (String(await label(page, 4, 0)).includes("Enemy")) throw new Error("still there"); await tap(page, "s:undo"); await waitLabel(page, 4, 0, "Enemy", true); if (!String(await label(page, 4, 0)).includes("Enemy")) throw new Error("undo lost enemy"); });
    await step("8 roam", async () => {
      await tap(page, "s:fresh"); await tap(page, "s:fresh-go"); await waitText(page, "No enemies: free roam."); const gone = await page.evaluate(() => ({ text: document.body.innerText, pills: [...document.querySelectorAll(".pill")].map((n) => n.textContent) })); if (!gone.text.includes("No enemies: free roam.") || gone.pills.some((p) => p === "NPC" || p === "Enemy")) throw new Error(JSON.stringify(gone));
      await tap(page, "s:test"); await page.waitForFunction(() => location.search.includes("stage=") && window.__play !== undefined, null, { timeout: 15000 });
      const end = await page.evaluate(() => { const play = window.__play, before = play.side; play.endTurn(); return { before, after: play.side, outcome: play.outcome }; });
      if (end.after !== end.before || end.outcome !== null) throw new Error(JSON.stringify(end));
      await press(page, "Back to maker"); await tap(page, "s:undo"); await waitLabel(page, 1, 7, "NPC", true); await waitLabel(page, 4, 0, "Enemy", true); const back = await label(page, 1, 7); if (!String(back).includes("NPC") || !String(await label(page, 4, 0)).includes("Enemy")) throw new Error(String(back));
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `src/editor/stage/paint.ts` (edited)

Diff `d62f87bc` → `a85ae665`:

```diff
diff --git a/src/editor/stage/paint.ts b/src/editor/stage/paint.ts
index 6c1516f..ba00d1a 100644
--- a/src/editor/stage/paint.ts
+++ b/src/editor/stage/paint.ts
@@ -33,3 +33,9 @@ export function clearGround(map: Obj): Obj {
   const cells = terrain.map((_, i) => ({ c: i % cols, r: Math.floor(i / cols) }));
   return paintCells(map, cells, "floor");
 }
+export function startNew(map: Obj, stage: Obj): { readonly map: Obj; readonly stage: Obj } {
+  const next = structuredClone(stage) as Obj, pool = isObj(next["enemyPool"]) ? { ...next["enemyPool"] } : null;
+  next["neutrals"] = [];
+  if (pool !== null && pool["mode"] === "fixed") next["enemyPool"] = { ...pool, entries: [] };
+  return { map: clearGround(map), stage: next };
+}
```

As merged:

```ts
type Obj = Record<string, unknown>;
type Cell = { readonly c: number; readonly r: number };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
function keyFor(palette: Obj, typeId: string): { readonly key: string; readonly added: boolean } {
  let best: number | null = null;
  for (const [k, v] of Object.entries(palette)) {
    const n = Number(k);
    if (v === typeId && Number.isInteger(n) && n >= 0 && String(n) === k && (best === null || n < best)) best = n;
  }
  if (best !== null) return { key: String(best), added: false };
  const used = new Set<number>();
  for (const k of Object.keys(palette)) { const n = Number(k); if (Number.isInteger(n) && n >= 0 && String(n) === k) used.add(n); }
  let n = 0; while (used.has(n)) n += 1;
  return { key: String(n), added: true };
}
export function paintCells(map: Obj, cells: readonly Cell[], typeId: string): Obj {
  const next = structuredClone(map) as Obj;
  const cols = typeof next["cols"] === "number" && Number.isInteger(next["cols"]) ? next["cols"] : 0;
  const logic = isObj(next["logic"]) ? next["logic"] : {};
  const terrain = Array.isArray(logic["terrain"]) ? [...logic["terrain"]] : [];
  const palette: Obj = isObj(logic["palette"]) ? { ...logic["palette"] } : {};
  const got = keyFor(palette, typeId);
  if (got.added) palette[got.key] = typeId;
  const int = Number(got.key);
  for (const cell of cells) { const i = cell.r * cols + cell.c; if (Number.isInteger(i) && i >= 0 && i < terrain.length) terrain[i] = int; }
  next["logic"] = { ...logic, terrain, palette };
  return next;
}
export function clearGround(map: Obj): Obj {
  const cols = typeof map["cols"] === "number" && Number.isInteger(map["cols"]) && map["cols"] > 0 ? map["cols"] : 1;
  const logic = isObj(map["logic"]) ? map["logic"] : {};
  const terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [];
  const cells = terrain.map((_, i) => ({ c: i % cols, r: Math.floor(i / cols) }));
  return paintCells(map, cells, "floor");
}
export function startNew(map: Obj, stage: Obj): { readonly map: Obj; readonly stage: Obj } {
  const next = structuredClone(stage) as Obj, pool = isObj(next["enemyPool"]) ? { ...next["enemyPool"] } : null;
  next["neutrals"] = [];
  if (pool !== null && pool["mode"] === "fixed") next["enemyPool"] = { ...pool, entries: [] };
  return { map: clearGround(map), stage: next };
}
```

### `tools/maker/stage.ts` (edited)

Diff `d62f87bc` → `a85ae665`:

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index 90900ca..2a130f3 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -1,26 +1,32 @@
-import { prefix, type DocText } from "../../src/editor/project/home.ts";
+import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
 import { planSave } from "../../src/editor/project/save.ts";
-import { clearGround, paintCells } from "../../src/editor/stage/paint.ts";
+import { paintCells, startNew } from "../../src/editor/stage/paint.ts";
+import { addEnemy, addNeutral, addSpawn, attachTalk, infoText, moveEntry, placeRows, refuse, removeEntry, standHere, type PlaceList } from "../../src/editor/stage/place.ts";
 import { closedType, sheetRows, typeLabel, type SheetRow } from "../../src/editor/stage/sheet.ts";
+import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
 import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
 import type { ProjectFiles } from "../../src/project/load/types.ts";
 import { parseProject } from "./project-files.ts";
+import { askSheet, moveChip, placeButtons, talkSheet, unitButtons, unitPicker } from "./stage-sheets.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 type Obj = Record<string, unknown>;
 type Cell = { readonly c: number; readonly r: number };
-type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string };
+type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string; readonly list: PlaceList; readonly index: number };
+type Spot = { list: PlaceList; index: number; name: string };
 export type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly banner: string | null; readonly dirty: boolean };
 export type StageOut = Host & { readonly leave: boolean; readonly test: boolean };
-export type Io = { readonly store: MakerStore; readonly id: string; readonly now: string };
+export type Io = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes?: () => Uint8Array };
 export type Saved = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly dirty: boolean } | { readonly ok: false; readonly error: "writeFailed" | "staleRev" | "readOnly"; readonly message: string; readonly files: DocText; readonly rev: number; readonly dirty: true };
 const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
 const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type Sess = { id: string; project: string; draft: Obj | null; path: string | null; painting: string | null; label: string; stack: Obj[]; gridOn: boolean; sheet: Cell | null; view: boolean; confirm: boolean; note: string | null; sel: Cell | null };
-const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null });
-let sess: Sess = blank("", "");
+type Sess = { id: string; project: string; draft: Obj | null; path: string | null; stagePath: string | null; painting: string | null; label: string; stack: unknown[]; gridOn: boolean; sheet: Cell | null; view: boolean; confirm: boolean; note: string | null; sel: Cell | null; moving: Spot | null; pick: PlaceList | null; ask: number | null; talking: boolean; line: string };
+const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, stagePath: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null, moving: null, pick: null, ask: null, talking: false, line: "" });
+let sess: Sess = blank("", ""), skeleton: Obj | null = null;
 export function bindStage(id: string, project: string): void { if (sess.id !== id || sess.project !== project) sess = blank(id, project); }
+export function rememberTalk(doc: unknown): void { if (isObj(doc)) skeleton = doc; }
+export function stageLine(value: string, max: number): string { const next = Number.isInteger(max) && max >= 0 ? [...value].slice(0, max).join("") : value; sess.line = next; return next; }
 function same(a: Cell, b: Cell): boolean { return a.c === b.c && a.r === b.r; }
 function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {
   for (const [path, doc] of Object.entries(files)) if (path.startsWith(`${kind}/`) && isObj(doc) && doc["id"] === id) return { path, doc };
@@ -38,11 +44,11 @@ function marks(files: ProjectFiles, stage: Obj): readonly Mark[] {
   for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") names.set(doc["id"], typeof doc["name"] === "string" ? doc["name"] : "Unit");
   const face = (id: string | undefined): { letter: string; name: string } => { const name = id === undefined ? "Unit" : names.get(id) ?? "Unit"; return { letter: name.slice(0, 1), name }; };
   const out: Mark[] = [], team = chosen(files, stage);
-  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name }); });
-  const pill = (entry: Obj, foe: boolean): string => { if (foe) return "Foe"; const side = entry["side"]; return side === "player" ? "You" : typeof side === "string" && side !== "" && side !== "neutral" ? "Foe" : "NPC"; };
-  const put = (entry: unknown, foe: boolean): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name }); };
-  list(stage["neutrals"]).forEach((entry) => put(entry, false));
-  const pool = stage["enemyPool"]; if (isObj(pool) && pool["mode"] === "fixed") list(pool["entries"]).forEach((entry) => put(entry, true));
+  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name, list: "spawn", index: i }); });
+  const pill = (entry: Obj, foe: boolean): string => { if (foe) return "Enemy"; const side = entry["side"]; return side === "player" ? "You" : typeof side === "string" && side !== "" && side !== "neutral" ? "Enemy" : "NPC"; };
+  const put = (entry: unknown, foe: boolean, listName: PlaceList, index: number): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name, list: listName, index }); };
+  list(stage["neutrals"]).forEach((entry, i) => put(entry, false, "npc", i));
+  const pool = stage["enemyPool"]; if (isObj(pool) && pool["mode"] === "fixed") list(pool["entries"]).forEach((entry, i) => put(entry, true, "enemy", i));
   return out;
 }
 function tileId(map: Obj, c: number, r: number): string {
@@ -61,6 +67,18 @@ async function writeMap(io: Io, files: DocText, rev: number, map: Obj): Promise<
   const same = sess.draft === map; if (same) { sess.draft = null; sess.painting = null; sess.label = ""; sess.note = null; }
   return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev, dirty: !same };
 }
+async function writeParts(io: Io, files: DocText, rev: number, parts: Readonly<Record<string, Obj>>): Promise<Saved> {
+  const next = { ...files }; for (const [path, doc] of Object.entries(parts)) next[path] = JSON.stringify(doc);
+  const plan = planSave(files, next, rev, io.now);
+  if (!plan.ok) return { ok: false, error: plan.error, message: plan.message, files, rev, dirty: true };
+  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes);
+  if (!wrote.ok) return { ok: false, error: "writeFailed", message: wrote.message, files, rev, dirty: true };
+  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev, dirty: false };
+}
+async function saveDocs(io: Io, host: Host, parts: Readonly<Record<string, Obj>>): Promise<StageOut> {
+  const saved = await writeParts(io, host.files, host.rev, parts);
+  return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: false, banner: null, leave: false, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false };
+}
 export async function stageCommit(io: Io, files: DocText, rev: number): Promise<Saved> {
   return sess.draft === null ? { ok: true, files, rev, dirty: false } : writeMap(io, files, rev, sess.draft);
 }
@@ -70,7 +88,7 @@ function bundle(files: DocText, stageId: string): { readonly parsed: ProjectFile
   const ref = stage.doc["mapRef"]; if (typeof ref !== "string") return { error: "Can't open this stage" };
   const map = docAt(parsed.files, "maps", ref); if (map === null) return { error: "Can't open this map" };
   const slice = parsed.files["catalogue/slice.json"]; if (!isObj(slice)) return { error: "Can't open: catalogue/slice.json" };
-  sess.path = map.path; return { parsed: parsed.files, stage: stage.doc, map: sess.draft ?? (structuredClone(map.doc) as Obj), slice };
+  sess.path = map.path; sess.stagePath = stage.path; return { parsed: parsed.files, stage: stage.doc, map: sess.draft ?? (structuredClone(map.doc) as Obj), slice };
 }
 function tone(id: string): string { return id === "floor" || id === "water" ? id : id === "wall-block" ? "wall" : "other"; }
 function cellsHtml(map: Obj, slice: Obj, placed: readonly Mark[], sel: Cell | null): string {
@@ -89,6 +107,29 @@ export function stageRows(files: DocText): { readonly id: string; readonly name:
   const root = parsed.files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {};
   return list(project["stages"]).flatMap((id) => { if (typeof id !== "string") return []; const stage = docAt(parsed.files, "stages", id); return stage === null ? [] : [{ id, name: typeof stage.doc["name"] === "string" ? stage.doc["name"] : id }]; });
 }
+function unitChoices(files: ProjectFiles): { readonly id: string; readonly name: string }[] {
+  const out: { id: string; name: string }[] = [];
+  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") out.push({ id: doc["id"], name: typeof doc["name"] === "string" ? doc["name"] : "Unit" });
+  return out;
+}
+function lineOf(files: ProjectFiles, stage: Obj, index: number): string {
+  const entry = list(stage["neutrals"])[index]; if (!isObj(entry)) return "";
+  for (const id of list(entry["setupIds"])) if (typeof id === "string") for (const [path, doc] of Object.entries(files)) {
+    if (!path.startsWith("setups/") || !isObj(doc) || doc["id"] !== id || !isObj(doc["answers"])) continue;
+    const line = doc["answers"]["line"]; if (isObj(line) && typeof line["value"] === "string") return line["value"];
+  }
+  return "";
+}
+function askName(files: ProjectFiles, stage: Obj, index: number): string {
+  const entry = list(stage["neutrals"])[index], id = isObj(entry) && typeof entry["unitId"] === "string" ? entry["unitId"] : "";
+  return unitChoices(files).find((unit) => unit.id === id)?.name ?? "Unit";
+}
+const teamOf = (pill: string): string => pill === "You" ? "Your team" : pill === "Enemy" ? "Enemy" : "NPC";
+async function commitStage(io: Io, host: Host, stage: Obj, prior: Obj, extra: Readonly<Record<string, Obj>> = {}): Promise<StageOut> {
+  if (sess.stagePath === null) return { ...host, banner: "Can't open this stage", leave: false, test: false };
+  const prev = sess.stack; sess.stack = push(prev, { stage: structuredClone(prior) });
+  const out = await saveDocs(io, host, { [sess.stagePath]: stage, ...extra }); if (out.banner !== null) sess.stack = prev; return out;
+}
 export function stageScreen(stageId: string, host: Host): string {
   const got = bundle(host.files, stageId);
   if ("error" in got) return `<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>Stage</h1></header><div class="body"><p class="banner bad" role="alert">${esc(got.error)}</p></div>`;
@@ -100,22 +141,32 @@ export function stageScreen(stageId: string, host: Host): string {
   const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
   const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
   const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
-  const rows = sheetRows(got.slice, sess.sheet !== null && placed.some((item) => same(item, sess.sheet as Cell)));
+  const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
+  const rows = sheetRows(got.slice, mark !== null);
   const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
-  const stood = sess.sheet !== null && placed.some((item) => same(item, sess.sheet as Cell)) ? `<p>A unit stands here</p>` : "";
-  const sheet = host.readOnly || sess.sheet === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Add here</h2><p class="sub">Tile ${sess.sheet.c},${sess.sheet.r}</p>${stood}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
+  const stood = mark === null ? "" : `<p>A unit stands here</p>${unitButtons(mark.pill === "NPC")}`;
+  const place = mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
+  const title = mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
+  const where = mark === null && cell !== null ? `<p class="sub">Tile ${cell.c},${cell.r}</p>` : "";
+  const sheet = host.readOnly || cell === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>${title}</h2>${where}${stood}${place}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
   const view = sess.view ? `<div class="scrim"><div class="sheet" role="dialog"><h2>View</h2><button type="button" class="choice" data-act="s:grid">Grid lines: ${sess.gridOn ? "On" : "Off"}</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>` : "";
-  const confirm = !host.readOnly && sess.confirm ? `<div class="scrim"><div class="sheet" role="dialog"><h2>Start new</h2><p>Start this stage's ground fresh? Every tile goes back to Floor. Units and NPCs stay. You can Undo this.</p><button type="button" class="btn danger" data-act="s:fresh-go">Start new</button><button type="button" class="btn ghost" data-act="s:close">Cancel</button></div></div>` : "";
+  const confirm = !host.readOnly && sess.confirm ? `<div class="scrim"><div class="sheet" role="dialog"><h2>Start new</h2><p>Every tile goes back to Floor, and every NPC and enemy is removed. Your team's start tiles stay. You can Undo this.</p><button type="button" class="btn danger" data-act="s:fresh-go">Start new</button><button type="button" class="btn ghost" data-act="s:close">Cancel</button></div></div>` : "";
   const undo = host.readOnly ? "" : `<button type="button" class="btn ghost undo" data-act="s:undo"${canUndo(sess.stack) ? "" : " disabled"}>${canUndo(sess.stack) ? "Undo" : "Nothing to undo"}</button>`;
-  const chip = sess.painting === null ? "" : `<div class="chip" role="status"><span>Painting ${esc(sess.label)} · Tap more tiles</span><button type="button" class="btn" data-act="s:done">Done</button></div>${sess.note === null ? "" : `<p class="sub">${esc(sess.note)}</p>`}`;
+  const noted = sess.note === null ? "" : `<p class="sub">${esc(sess.note)}</p>`;
+  const painting = sess.painting === null ? "" : `<div class="chip" role="status"><span>Painting ${esc(sess.label)} · Tap more tiles</span><button type="button" class="btn" data-act="s:done">Done</button></div>`;
+  const chip = `${painting}${sess.moving === null ? "" : moveChip(sess.moving.name)}${noted}`;
   const dock = undo === "" && chip === "" ? "" : `<div class="dock">${undo}${chip}</div>`;
-  return `${bar}<div class="body stage">${banner}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${view}${confirm}`;
+  const info = infoText(got.stage, chosen(got.parsed, got.stage).length).map((line) => `<p class="sub">${esc(line)}</p>`).join("");
+  const who = sess.ask === null ? "" : askName(got.parsed, got.stage, sess.ask);
+  const ask = sess.ask === null ? "" : sess.talking ? talkSheet(who, talkLimit(got.slice), sess.line) : askSheet(who);
+  const pick = sess.pick === null ? "" : unitPicker(unitChoices(got.parsed));
+  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${pick}${ask}${view}${confirm}`;
 }
 function kept(host: Host): StageOut { return { ...host, leave: false, test: false }; }
 export async function stageClick(act: string, stageId: string, host: Host, io: Io): Promise<StageOut> {
   if (act === "s:back") { if (host.readOnly || sess.draft === null) return { ...host, leave: true, test: false }; const saved = await writeMap(io, host.files, host.rev, sess.draft); return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: host.readOnly ? host.banner : null, leave: true, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false }; }
   if (act === "s:test") return { ...host, leave: false, test: true };
-  if (act === "s:close") { sess.sheet = null; sess.view = false; sess.confirm = false; return kept(host); }
+  if (act === "s:close") { sess.sheet = null; sess.view = false; sess.confirm = false; sess.pick = null; sess.ask = null; sess.talking = false; return kept(host); }
   if (act === "s:view") { sess.view = true; sess.sheet = null; sess.confirm = false; return kept(host); }
   if (act === "s:grid") { sess.gridOn = !sess.gridOn; return kept(host); }
   if (host.readOnly) return kept(host);
@@ -124,22 +175,43 @@ export async function stageClick(act: string, stageId: string, host: Host, io: I
   if (act === "s:fresh") { sess.confirm = true; sess.sheet = null; sess.view = false; return kept(host); }
   if (act === "s:undo") {
     const item = pop(sess.stack); if (item === null) return kept(host);
-    sess.stack = item.rest; sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = item.snap; const saved = await writeMap(io, host.files, host.rev, item.snap);
-    if (!saved.ok) return { ...host, dirty: true, banner: saved.message, leave: false, test: false };
-    return { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false };
+    sess.stack = item.rest; sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.moving = null; sess.pick = null; sess.ask = null; sess.talking = false;
+    const snap = item.snap;
+    if (isObj(snap) && typeof snap["cols"] === "number") {
+      sess.draft = snap; const saved = await writeMap(io, host.files, host.rev, snap);
+      if (!saved.ok) return { ...host, dirty: true, banner: saved.message, leave: false, test: false };
+      return { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false };
+    }
+    if (!isObj(snap)) return kept(host);
+    const map = isObj(snap["map"]) ? snap["map"] : null, stage = isObj(snap["stage"]) ? snap["stage"] : null, parts: Record<string, Obj> = {};
+    if (map !== null && sess.path !== null) parts[sess.path] = map;
+    if (stage !== null && sess.stagePath !== null) parts[sess.stagePath] = stage;
+    if (Object.keys(parts).length === 0) return kept(host);
+    sess.draft = null; return saveDocs(io, host, parts);
   }
-  if (act === "s:fresh-go" || act === "s:done") {
+  if (act === "s:fresh-go") {
+    const map = live(host.files); if (map === null || sess.path === null || sess.stagePath === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
+    const fresh = startNew(map, got.stage);
+    sess.stack = push(sess.stack, { map: structuredClone(map), stage: structuredClone(got.stage) });
+    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.moving = null; sess.draft = null; sess.pick = null; sess.ask = null; sess.talking = false;
+    return saveDocs(io, host, { [sess.path]: fresh.map, [sess.stagePath]: fresh.stage });
+  }
+  if (act === "s:done") {
     const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
-    const next = act === "s:fresh-go" ? clearGround(map) : map;
-    if (act === "s:fresh-go") sess.stack = push(sess.stack, structuredClone(map) as Obj);
-    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = next;
-    const saved = await writeMap(io, host.files, host.rev, next);
+    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = map;
+    const saved = await writeMap(io, host.files, host.rev, map);
     return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false };
   }
   if (act.startsWith("s:cell:")) {
     const [cs, rs] = act.slice(7).split(","), c = Number(cs), r = Number(rs);
     if (!Number.isInteger(c) || !Number.isInteger(r)) return kept(host);
     const cell = { c, r };
+    if (sess.moving !== null) {
+      const id = tileId(got.map, c, r), why = refuse(placed.some((item) => same(item, cell)) ? "occupied" : closedType(got.slice, id) ? "closed" : null, typeLabel(got.slice, id));
+      if (why !== null) { sess.note = why; sess.sel = cell; return { ...kept(host), dirty: true }; }
+      const next = moveEntry(got.stage, sess.moving, cell); sess.moving = null; sess.note = null; sess.sheet = null;
+      return commitStage(io, host, next, got.stage);
+    }
     if (sess.painting !== null) {
       const busy = placed.some((item) => same(item, cell));
       if (busy && closedType(got.slice, sess.painting)) { sess.note = "A unit stands here"; sess.sel = cell; return { ...kept(host), dirty: true }; }
@@ -157,5 +229,27 @@ export async function stageClick(act: string, stageId: string, host: Host, io: I
     sess.painting = row.id; sess.label = row.label; sess.draft = paintCells(map, [sess.sheet], row.id); sess.note = null; sess.sel = sess.sheet; sess.sheet = null;
     return { ...host, dirty: true, leave: false, test: false };
   }
+  const here = (): Mark | null => sess.sheet === null ? null : placed.find((item) => sess.sheet !== null && same(item, sess.sheet)) ?? null;
+  if (act === "s:place:spawn" && sess.sheet !== null) { const at = sess.sheet; sess.sheet = null; return commitStage(io, host, addSpawn(got.stage, at), got.stage); }
+  if (act === "s:place:npc" || act === "s:place:enemy") { if (sess.sheet === null) return kept(host); sess.pick = act.endsWith("enemy") ? "enemy" : "npc"; return kept(host); }
+  if (act.startsWith("s:unit:") && sess.pick !== null && sess.sheet !== null) {
+    const id = act.slice(7), at = sess.sheet;
+    if (sess.pick === "enemy") { const next = addEnemy(got.stage, id, at); if (next === null) return kept(host); sess.pick = null; sess.sheet = null; return commitStage(io, host, next, got.stage); }
+    const index = list(got.stage["neutrals"]).length; sess.pick = null; sess.sheet = null; sess.ask = index; sess.talking = false; sess.line = "";
+    return commitStage(io, host, addNeutral(got.stage, id, at), got.stage);
+  }
+  if (act === "s:stand" && sess.ask !== null) { const index = sess.ask; sess.ask = null; sess.talking = false; return commitStage(io, host, standHere(got.stage, index), got.stage); }
+  if (act === "s:talk-open" && sess.ask !== null) { sess.talking = true; sess.line = lineOf(got.parsed, got.stage, sess.ask); return kept(host); }
+  if (act === "s:talk-save" && sess.ask !== null) {
+    if (skeleton === null || io.bytes === undefined) return { ...host, banner: "Can't open: setup.talk.json", leave: false, test: false };
+    const rev = got.slice["catalogue_rev"]; if (typeof rev !== "number") return { ...host, banner: "Can't open: catalogue/slice.json", leave: false, test: false };
+    const index = sess.ask, id = `setup_${ulid(Date.parse(io.now), io.bytes())}`, name = askName(got.parsed, got.stage, index), line = sess.line;
+    sess.ask = null; sess.talking = false; sess.line = "";
+    return commitStage(io, host, attachTalk(got.stage, index, id), got.stage, { [`setups/${id}.json`]: fillTalk(skeleton, id, name, rev, line, talkKnobs(got.slice)) });
+  }
+  if (act === "s:ask") { const mark = here(); if (mark === null || mark.list !== "npc") return kept(host); sess.ask = mark.index; sess.sheet = null; sess.talking = false; sess.line = lineOf(got.parsed, got.stage, mark.index); return kept(host); }
+  if (act === "s:move") { const mark = here(); if (mark === null) return kept(host); sess.moving = { list: mark.list, index: mark.index, name: mark.name }; sess.sheet = null; sess.note = null; return kept(host); }
+  if (act === "s:move-cancel") { sess.moving = null; sess.note = null; return kept(host); }
+  if (act === "s:delete") { const mark = here(); if (mark === null) return kept(host); sess.sheet = null; return commitStage(io, host, removeEntry(got.stage, mark), got.stage); }
   return kept(host);
 }
```

As merged:

```ts
import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { paintCells, startNew } from "../../src/editor/stage/paint.ts";
import { addEnemy, addNeutral, addSpawn, attachTalk, infoText, moveEntry, placeRows, refuse, removeEntry, standHere, type PlaceList } from "../../src/editor/stage/place.ts";
import { closedType, sheetRows, typeLabel, type SheetRow } from "../../src/editor/stage/sheet.ts";
import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
import type { ProjectFiles } from "../../src/project/load/types.ts";
import { parseProject } from "./project-files.ts";
import { askSheet, moveChip, placeButtons, talkSheet, unitButtons, unitPicker } from "./stage-sheets.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Cell = { readonly c: number; readonly r: number };
type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string; readonly list: PlaceList; readonly index: number };
type Spot = { list: PlaceList; index: number; name: string };
export type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly banner: string | null; readonly dirty: boolean };
export type StageOut = Host & { readonly leave: boolean; readonly test: boolean };
export type Io = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes?: () => Uint8Array };
export type Saved = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly dirty: boolean } | { readonly ok: false; readonly error: "writeFailed" | "staleRev" | "readOnly"; readonly message: string; readonly files: DocText; readonly rev: number; readonly dirty: true };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type Sess = { id: string; project: string; draft: Obj | null; path: string | null; stagePath: string | null; painting: string | null; label: string; stack: unknown[]; gridOn: boolean; sheet: Cell | null; view: boolean; confirm: boolean; note: string | null; sel: Cell | null; moving: Spot | null; pick: PlaceList | null; ask: number | null; talking: boolean; line: string };
const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, stagePath: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null, moving: null, pick: null, ask: null, talking: false, line: "" });
let sess: Sess = blank("", ""), skeleton: Obj | null = null;
export function bindStage(id: string, project: string): void { if (sess.id !== id || sess.project !== project) sess = blank(id, project); }
export function rememberTalk(doc: unknown): void { if (isObj(doc)) skeleton = doc; }
export function stageLine(value: string, max: number): string { const next = Number.isInteger(max) && max >= 0 ? [...value].slice(0, max).join("") : value; sess.line = next; return next; }
function same(a: Cell, b: Cell): boolean { return a.c === b.c && a.r === b.r; }
function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {
  for (const [path, doc] of Object.entries(files)) if (path.startsWith(`${kind}/`) && isObj(doc) && doc["id"] === id) return { path, doc };
  return null;
}
function chosen(files: ProjectFiles, stage: Obj): readonly string[] {
  const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(project["loadout"]) ? project["loadout"] : {};
  const ids = [...list(gear["required"]), ...list(gear["roster"])].filter((id): id is string => typeof id === "string"), out: string[] = [];
  for (const id of ids) if (!out.includes(id)) out.push(id);
  const cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : out.length, list(stage["playerSpawns"]).length);
  return out.slice(0, cap);
}
function marks(files: ProjectFiles, stage: Obj): readonly Mark[] {
  const names = new Map<string, string>();
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") names.set(doc["id"], typeof doc["name"] === "string" ? doc["name"] : "Unit");
  const face = (id: string | undefined): { letter: string; name: string } => { const name = id === undefined ? "Unit" : names.get(id) ?? "Unit"; return { letter: name.slice(0, 1), name }; };
  const out: Mark[] = [], team = chosen(files, stage);
  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name, list: "spawn", index: i }); });
  const pill = (entry: Obj, foe: boolean): string => { if (foe) return "Enemy"; const side = entry["side"]; return side === "player" ? "You" : typeof side === "string" && side !== "" && side !== "neutral" ? "Enemy" : "NPC"; };
  const put = (entry: unknown, foe: boolean, listName: PlaceList, index: number): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name, list: listName, index }); };
  list(stage["neutrals"]).forEach((entry, i) => put(entry, false, "npc", i));
  const pool = stage["enemyPool"]; if (isObj(pool) && pool["mode"] === "fixed") list(pool["entries"]).forEach((entry, i) => put(entry, true, "enemy", i));
  return out;
}
function tileId(map: Obj, c: number, r: number): string {
  const cols = typeof map["cols"] === "number" ? map["cols"] : 0, logic = isObj(map["logic"]) ? map["logic"] : {}, terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [], palette = isObj(logic["palette"]) ? logic["palette"] : {}, value = terrain[r * cols + c], id = typeof value === "number" ? palette[String(value)] : undefined;
  return typeof id === "string" ? id : "floor";
}
function live(files: DocText): Obj | null {
  if (sess.draft !== null) return sess.draft; if (sess.path === null) return null; const parsed = parseProject(files); if (!parsed.ok) return null; const doc = parsed.files[sess.path]; return isObj(doc) ? structuredClone(doc) as Obj : null;
}
async function writeMap(io: Io, files: DocText, rev: number, map: Obj): Promise<Saved> {
  if (sess.path === null) return { ok: false, error: "writeFailed", message: "Can't open this stage", files, rev, dirty: true };
  const next = { ...files, [sess.path]: JSON.stringify(map) }, plan = planSave(files, next, rev, io.now);
  if (!plan.ok) return { ok: false, error: plan.error, message: plan.message, files, rev, dirty: true };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes);
  if (!wrote.ok) return { ok: false, error: "writeFailed", message: wrote.message, files, rev, dirty: true };
  const same = sess.draft === map; if (same) { sess.draft = null; sess.painting = null; sess.label = ""; sess.note = null; }
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev, dirty: !same };
}
async function writeParts(io: Io, files: DocText, rev: number, parts: Readonly<Record<string, Obj>>): Promise<Saved> {
  const next = { ...files }; for (const [path, doc] of Object.entries(parts)) next[path] = JSON.stringify(doc);
  const plan = planSave(files, next, rev, io.now);
  if (!plan.ok) return { ok: false, error: plan.error, message: plan.message, files, rev, dirty: true };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes);
  if (!wrote.ok) return { ok: false, error: "writeFailed", message: wrote.message, files, rev, dirty: true };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev, dirty: false };
}
async function saveDocs(io: Io, host: Host, parts: Readonly<Record<string, Obj>>): Promise<StageOut> {
  const saved = await writeParts(io, host.files, host.rev, parts);
  return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: false, banner: null, leave: false, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false };
}
export async function stageCommit(io: Io, files: DocText, rev: number): Promise<Saved> {
  return sess.draft === null ? { ok: true, files, rev, dirty: false } : writeMap(io, files, rev, sess.draft);
}
function bundle(files: DocText, stageId: string): { readonly parsed: ProjectFiles; readonly stage: Obj; readonly map: Obj; readonly slice: Obj } | { readonly error: string } {
  const parsed = parseProject(files); if (!parsed.ok) return { error: parsed.message };
  const stage = docAt(parsed.files, "stages", stageId); if (stage === null) return { error: "Can't open this stage" };
  const ref = stage.doc["mapRef"]; if (typeof ref !== "string") return { error: "Can't open this stage" };
  const map = docAt(parsed.files, "maps", ref); if (map === null) return { error: "Can't open this map" };
  const slice = parsed.files["catalogue/slice.json"]; if (!isObj(slice)) return { error: "Can't open: catalogue/slice.json" };
  sess.path = map.path; sess.stagePath = stage.path; return { parsed: parsed.files, stage: stage.doc, map: sess.draft ?? (structuredClone(map.doc) as Obj), slice };
}
function tone(id: string): string { return id === "floor" || id === "water" ? id : id === "wall-block" ? "wall" : "other"; }
function cellsHtml(map: Obj, slice: Obj, placed: readonly Mark[], sel: Cell | null): string {
  const cols = typeof map["cols"] === "number" ? map["cols"] : 0, rows = typeof map["rows"] === "number" ? map["rows"] : 0;
  let html = `<div class="grid${sess.gridOn ? "" : " off"}" style="grid-template-columns:repeat(${cols},48px)">`;
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
    const id = tileId(map, c, r), label = typeLabel(slice, id), mark = placed.find((item) => item.c === c && item.r === r) ?? null;
    const text = mark !== null || label.length > 5 ? label.slice(0, 1) : label, on = sel !== null && sel.c === c && sel.r === r ? " on" : "";
    const who = mark === null ? "" : `<span class="who">${esc(mark.letter)}</span><span class="pill">${esc(mark.pill)}</span>`;
    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}"><span>${esc(text)}</span>${who}</button>`;
  }
  return `${html}</div>`;
}
export function stageRows(files: DocText): { readonly id: string; readonly name: string }[] {
  const parsed = parseProject(files); if (!parsed.ok) return [];
  const root = parsed.files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {};
  return list(project["stages"]).flatMap((id) => { if (typeof id !== "string") return []; const stage = docAt(parsed.files, "stages", id); return stage === null ? [] : [{ id, name: typeof stage.doc["name"] === "string" ? stage.doc["name"] : id }]; });
}
function unitChoices(files: ProjectFiles): { readonly id: string; readonly name: string }[] {
  const out: { id: string; name: string }[] = [];
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") out.push({ id: doc["id"], name: typeof doc["name"] === "string" ? doc["name"] : "Unit" });
  return out;
}
function lineOf(files: ProjectFiles, stage: Obj, index: number): string {
  const entry = list(stage["neutrals"])[index]; if (!isObj(entry)) return "";
  for (const id of list(entry["setupIds"])) if (typeof id === "string") for (const [path, doc] of Object.entries(files)) {
    if (!path.startsWith("setups/") || !isObj(doc) || doc["id"] !== id || !isObj(doc["answers"])) continue;
    const line = doc["answers"]["line"]; if (isObj(line) && typeof line["value"] === "string") return line["value"];
  }
  return "";
}
function askName(files: ProjectFiles, stage: Obj, index: number): string {
  const entry = list(stage["neutrals"])[index], id = isObj(entry) && typeof entry["unitId"] === "string" ? entry["unitId"] : "";
  return unitChoices(files).find((unit) => unit.id === id)?.name ?? "Unit";
}
const teamOf = (pill: string): string => pill === "You" ? "Your team" : pill === "Enemy" ? "Enemy" : "NPC";
async function commitStage(io: Io, host: Host, stage: Obj, prior: Obj, extra: Readonly<Record<string, Obj>> = {}): Promise<StageOut> {
  if (sess.stagePath === null) return { ...host, banner: "Can't open this stage", leave: false, test: false };
  const prev = sess.stack; sess.stack = push(prev, { stage: structuredClone(prior) });
  const out = await saveDocs(io, host, { [sess.stagePath]: stage, ...extra }); if (out.banner !== null) sess.stack = prev; return out;
}
export function stageScreen(stageId: string, host: Host): string {
  const got = bundle(host.files, stageId);
  if ("error" in got) return `<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>Stage</h1></header><div class="body"><p class="banner bad" role="alert">${esc(got.error)}</p></div>`;
  const name = typeof got.stage["name"] === "string" ? got.stage["name"] : "Stage", placed = marks(got.parsed, got.stage);
  let users = 0; for (const [path, doc] of Object.entries(got.parsed)) if (path.startsWith("stages/") && isObj(doc) && doc["mapRef"] === got.stage["mapRef"]) users += 1;
  const note = users > 1 ? `<p class="sub">This map is used by ${users} stages. Painting changes all of them.</p>` : "";
  const code = host.banner !== null && host.banner.startsWith("Couldn't save") ? "writeFailed" : host.banner !== null && host.banner.startsWith("This project changed") ? "staleRev" : "";
  const banner = host.banner === null ? "" : `<p class="banner bad" role="alert"${code === "" ? "" : ` data-error="${code}"`}>${esc(host.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
  const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
  const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
  const rows = sheetRows(got.slice, mark !== null);
  const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
  const stood = mark === null ? "" : `<p>A unit stands here</p>${unitButtons(mark.pill === "NPC")}`;
  const place = mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
  const title = mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
  const where = mark === null && cell !== null ? `<p class="sub">Tile ${cell.c},${cell.r}</p>` : "";
  const sheet = host.readOnly || cell === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>${title}</h2>${where}${stood}${place}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
  const view = sess.view ? `<div class="scrim"><div class="sheet" role="dialog"><h2>View</h2><button type="button" class="choice" data-act="s:grid">Grid lines: ${sess.gridOn ? "On" : "Off"}</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>` : "";
  const confirm = !host.readOnly && sess.confirm ? `<div class="scrim"><div class="sheet" role="dialog"><h2>Start new</h2><p>Every tile goes back to Floor, and every NPC and enemy is removed. Your team's start tiles stay. You can Undo this.</p><button type="button" class="btn danger" data-act="s:fresh-go">Start new</button><button type="button" class="btn ghost" data-act="s:close">Cancel</button></div></div>` : "";
  const undo = host.readOnly ? "" : `<button type="button" class="btn ghost undo" data-act="s:undo"${canUndo(sess.stack) ? "" : " disabled"}>${canUndo(sess.stack) ? "Undo" : "Nothing to undo"}</button>`;
  const noted = sess.note === null ? "" : `<p class="sub">${esc(sess.note)}</p>`;
  const painting = sess.painting === null ? "" : `<div class="chip" role="status"><span>Painting ${esc(sess.label)} · Tap more tiles</span><button type="button" class="btn" data-act="s:done">Done</button></div>`;
  const chip = `${painting}${sess.moving === null ? "" : moveChip(sess.moving.name)}${noted}`;
  const dock = undo === "" && chip === "" ? "" : `<div class="dock">${undo}${chip}</div>`;
  const info = infoText(got.stage, chosen(got.parsed, got.stage).length).map((line) => `<p class="sub">${esc(line)}</p>`).join("");
  const who = sess.ask === null ? "" : askName(got.parsed, got.stage, sess.ask);
  const ask = sess.ask === null ? "" : sess.talking ? talkSheet(who, talkLimit(got.slice), sess.line) : askSheet(who);
  const pick = sess.pick === null ? "" : unitPicker(unitChoices(got.parsed));
  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${pick}${ask}${view}${confirm}`;
}
function kept(host: Host): StageOut { return { ...host, leave: false, test: false }; }
export async function stageClick(act: string, stageId: string, host: Host, io: Io): Promise<StageOut> {
  if (act === "s:back") { if (host.readOnly || sess.draft === null) return { ...host, leave: true, test: false }; const saved = await writeMap(io, host.files, host.rev, sess.draft); return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: host.readOnly ? host.banner : null, leave: true, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false }; }
  if (act === "s:test") return { ...host, leave: false, test: true };
  if (act === "s:close") { sess.sheet = null; sess.view = false; sess.confirm = false; sess.pick = null; sess.ask = null; sess.talking = false; return kept(host); }
  if (act === "s:view") { sess.view = true; sess.sheet = null; sess.confirm = false; return kept(host); }
  if (act === "s:grid") { sess.gridOn = !sess.gridOn; return kept(host); }
  if (host.readOnly) return kept(host);
  const got = bundle(host.files, stageId); if ("error" in got) return { ...host, banner: got.error, leave: false, test: false };
  const placed = marks(got.parsed, got.stage);
  if (act === "s:fresh") { sess.confirm = true; sess.sheet = null; sess.view = false; return kept(host); }
  if (act === "s:undo") {
    const item = pop(sess.stack); if (item === null) return kept(host);
    sess.stack = item.rest; sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.moving = null; sess.pick = null; sess.ask = null; sess.talking = false;
    const snap = item.snap;
    if (isObj(snap) && typeof snap["cols"] === "number") {
      sess.draft = snap; const saved = await writeMap(io, host.files, host.rev, snap);
      if (!saved.ok) return { ...host, dirty: true, banner: saved.message, leave: false, test: false };
      return { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false };
    }
    if (!isObj(snap)) return kept(host);
    const map = isObj(snap["map"]) ? snap["map"] : null, stage = isObj(snap["stage"]) ? snap["stage"] : null, parts: Record<string, Obj> = {};
    if (map !== null && sess.path !== null) parts[sess.path] = map;
    if (stage !== null && sess.stagePath !== null) parts[sess.stagePath] = stage;
    if (Object.keys(parts).length === 0) return kept(host);
    sess.draft = null; return saveDocs(io, host, parts);
  }
  if (act === "s:fresh-go") {
    const map = live(host.files); if (map === null || sess.path === null || sess.stagePath === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    const fresh = startNew(map, got.stage);
    sess.stack = push(sess.stack, { map: structuredClone(map), stage: structuredClone(got.stage) });
    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.moving = null; sess.draft = null; sess.pick = null; sess.ask = null; sess.talking = false;
    return saveDocs(io, host, { [sess.path]: fresh.map, [sess.stagePath]: fresh.stage });
  }
  if (act === "s:done") {
    const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = map;
    const saved = await writeMap(io, host.files, host.rev, map);
    return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false };
  }
  if (act.startsWith("s:cell:")) {
    const [cs, rs] = act.slice(7).split(","), c = Number(cs), r = Number(rs);
    if (!Number.isInteger(c) || !Number.isInteger(r)) return kept(host);
    const cell = { c, r };
    if (sess.moving !== null) {
      const id = tileId(got.map, c, r), why = refuse(placed.some((item) => same(item, cell)) ? "occupied" : closedType(got.slice, id) ? "closed" : null, typeLabel(got.slice, id));
      if (why !== null) { sess.note = why; sess.sel = cell; return { ...kept(host), dirty: true }; }
      const next = moveEntry(got.stage, sess.moving, cell); sess.moving = null; sess.note = null; sess.sheet = null;
      return commitStage(io, host, next, got.stage);
    }
    if (sess.painting !== null) {
      const busy = placed.some((item) => same(item, cell));
      if (busy && closedType(got.slice, sess.painting)) { sess.note = "A unit stands here"; sess.sel = cell; return { ...kept(host), dirty: true }; }
      const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
      sess.draft = paintCells(map, [cell], sess.painting); sess.note = null; sess.sel = cell; sess.sheet = null;
      return { ...host, dirty: true, leave: false, test: false };
    }
    sess.sheet = cell; sess.sel = cell; sess.view = false; sess.confirm = false; return kept(host);
  }
  if (act.startsWith("s:type:")) {
    const id = act.slice(7), rows = sheetRows(got.slice, sess.sheet !== null && placed.some((item) => sess.sheet !== null && same(item, sess.sheet))), row = rows.find((item) => item.id === id);
    if (row === undefined || sess.sheet === null) return kept(host);
    const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    if (sess.painting === null) sess.stack = push(sess.stack, structuredClone(map) as Obj);
    sess.painting = row.id; sess.label = row.label; sess.draft = paintCells(map, [sess.sheet], row.id); sess.note = null; sess.sel = sess.sheet; sess.sheet = null;
    return { ...host, dirty: true, leave: false, test: false };
  }
  const here = (): Mark | null => sess.sheet === null ? null : placed.find((item) => sess.sheet !== null && same(item, sess.sheet)) ?? null;
  if (act === "s:place:spawn" && sess.sheet !== null) { const at = sess.sheet; sess.sheet = null; return commitStage(io, host, addSpawn(got.stage, at), got.stage); }
  if (act === "s:place:npc" || act === "s:place:enemy") { if (sess.sheet === null) return kept(host); sess.pick = act.endsWith("enemy") ? "enemy" : "npc"; return kept(host); }
  if (act.startsWith("s:unit:") && sess.pick !== null && sess.sheet !== null) {
    const id = act.slice(7), at = sess.sheet;
    if (sess.pick === "enemy") { const next = addEnemy(got.stage, id, at); if (next === null) return kept(host); sess.pick = null; sess.sheet = null; return commitStage(io, host, next, got.stage); }
    const index = list(got.stage["neutrals"]).length; sess.pick = null; sess.sheet = null; sess.ask = index; sess.talking = false; sess.line = "";
    return commitStage(io, host, addNeutral(got.stage, id, at), got.stage);
  }
  if (act === "s:stand" && sess.ask !== null) { const index = sess.ask; sess.ask = null; sess.talking = false; return commitStage(io, host, standHere(got.stage, index), got.stage); }
  if (act === "s:talk-open" && sess.ask !== null) { sess.talking = true; sess.line = lineOf(got.parsed, got.stage, sess.ask); return kept(host); }
  if (act === "s:talk-save" && sess.ask !== null) {
    if (skeleton === null || io.bytes === undefined) return { ...host, banner: "Can't open: setup.talk.json", leave: false, test: false };
    const rev = got.slice["catalogue_rev"]; if (typeof rev !== "number") return { ...host, banner: "Can't open: catalogue/slice.json", leave: false, test: false };
    const index = sess.ask, id = `setup_${ulid(Date.parse(io.now), io.bytes())}`, name = askName(got.parsed, got.stage, index), line = sess.line;
    sess.ask = null; sess.talking = false; sess.line = "";
    return commitStage(io, host, attachTalk(got.stage, index, id), got.stage, { [`setups/${id}.json`]: fillTalk(skeleton, id, name, rev, line, talkKnobs(got.slice)) });
  }
  if (act === "s:ask") { const mark = here(); if (mark === null || mark.list !== "npc") return kept(host); sess.ask = mark.index; sess.sheet = null; sess.talking = false; sess.line = lineOf(got.parsed, got.stage, mark.index); return kept(host); }
  if (act === "s:move") { const mark = here(); if (mark === null) return kept(host); sess.moving = { list: mark.list, index: mark.index, name: mark.name }; sess.sheet = null; sess.note = null; return kept(host); }
  if (act === "s:move-cancel") { sess.moving = null; sess.note = null; return kept(host); }
  if (act === "s:delete") { const mark = here(); if (mark === null) return kept(host); sess.sheet = null; return commitStage(io, host, removeEntry(got.stage, mark), got.stage); }
  return kept(host);
}
```

### `tools/maker/home.ts` (edited)

Diff `d62f87bc` → `a85ae665`:

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 28a4578..705d8c5 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -2,7 +2,7 @@ import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, r
 import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
-import { bindStage, stageClick, stageCommit, stageRows, stageScreen } from "./stage.ts";
+import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
 import { startMatch } from "../play-stage/page.ts";
@@ -75,7 +75,7 @@ async function fromUrl(): Promise<void> {
 async function run(act: string): Promise<void> {
   if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; paint(); return; }
   if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
-    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso() });
+    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty; if (out.test) return beginTest(); if (out.leave) state.screen = "project"; paint(); return;
   }
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
@@ -88,11 +88,11 @@ async function boot(): Promise<void> {
   try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
   try {
     const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
-    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = await got.text(); }
+    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
     templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
   } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
 }
 document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
-document.addEventListener("input", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-name")) state.name = node.value; });
+document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 void boot();
```

As merged:

```ts
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
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
  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }); return; }
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, rows: stageRows(state.files), dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems }) + toast; return; }
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
function enterPlay(docs: PlayReady, scroll: number): void {
  const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
  try {
    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; });
    root.hidden = true;
  } catch (e) { canvas.remove(); throw e; }
}
async function saveStage(): Promise<boolean> {
  if (store === null || state.current === null) return false;
  const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
  state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
}
async function beginTest(): Promise<void> {
  if (store === null || state.current === null) return;
  const stageId = state.screen === "stage" ? state.stageId : null;
  if (stageId !== null && !await saveStage()) { paint(); return; }
  const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), now: nowIso(), start: (docs) => enterPlay(docs, scroll) });
  state.files = got.files; state.rev = got.rev;
  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
  state.dirty = false; state.problems = [];
}
async function fromUrl(): Promise<void> {
  const params = new URLSearchParams(location.search), id = params.get("project");
  if (id === null || store === null) return;
  const stage = params.get("stage"), from = params.get("from") ?? "project";
  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
  if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = [];
}
async function run(act: string): Promise<void> {
  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; paint(); return; }
  if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty; if (out.test) return beginTest(); if (out.leave) state.screen = "project"; paint(); return;
  }
  if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
  if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "fix") { state.problems = []; paint(); }
}
async function boot(): Promise<void> {
  paint();
  try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
  try {
    const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
void boot();
```

### `tests/editor/maker-law.test.ts` (edited)

Diff `d62f87bc` → `a85ae665`:

```diff
diff --git a/tests/editor/maker-law.test.ts b/tests/editor/maker-law.test.ts
index 0c6f119..f5ab7af 100644
--- a/tests/editor/maker-law.test.ts
+++ b/tests/editor/maker-law.test.ts
@@ -1,6 +1,6 @@
 import assert from "node:assert/strict";
 import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
-import { join } from "node:path";
+import { join, sep } from "node:path";
 import { test } from "node:test";
 import { fileURLToPath } from "node:url";
 const root = fileURLToPath(new URL("../..", import.meta.url));
@@ -13,6 +13,7 @@ export function lawHits(dir: string): string[] {
     readFileSync(path, "utf8").split("\n").forEach((line, i) => {
       const at = `${path}:${i + 1}`;
       if (!skip && colour.test(line)) hits.push(`${at} colour`); if (ts && (/"kind"\s*:\s*"tile-project"/.test(line) || /"kind"\s*:\s*"map"/.test(line))) hits.push(`${at} kind`);
+      if (ts && path.includes(`${sep}stage${sep}`) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
       if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
       if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
     });
@@ -30,6 +31,6 @@ test("maker law holds, tokens match, and each plant fails", () => {
   const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
   assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
   const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
-  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
+  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["doc.ts", "export const v = \"formatVersion\";\n"], ["unquoted.ts", "export const d = { kind: \"behaviour-setup\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
   rmSync(dir, { recursive: true });
 });
```

As merged:

```ts
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, sep } from "node:path";
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
      if (ts && path.includes(`${sep}stage${sep}`) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
      if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
      if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
    });
  }
  return hits;
}
const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
test("maker law holds, tokens match, and each plant fails", () => {
  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []);
  const css = readFileSync(join(root, "tools/maker/tokens.css"), "utf8"), darkAt = css.indexOf('html[data-theme="dark"]'), mediaAt = css.indexOf("@media (prefers-color-scheme: dark)"), bodyAt = css.indexOf("\nbody");
  for (const token of LIGHT) assert.ok(css.slice(0, darkAt).includes(token), token);
  for (const token of DARK) assert.ok(css.slice(darkAt, mediaAt).includes(token) && css.slice(mediaAt, bodyAt).includes(token), token);
  assert.match(css, /button, input \{ font: inherit; \}/);
  const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
  assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
  const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["doc.ts", "export const v = \"formatVersion\";\n"], ["unquoted.ts", "export const d = { kind: \"behaviour-setup\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
  rmSync(dir, { recursive: true });
});
```

