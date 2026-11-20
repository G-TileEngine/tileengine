# Rebuild record: step 5a, units

Original brief: [`docs/maker/steps/step-05-units.md`](../maker/steps/step-05-units.md) on the merge (r3b, blob `2e2673e8`, sha256 `ce4ec0112291f60dbc332e3ff15290edc5a9dda9bd1680958381ae0612457d7e`, 267 lines): the 5a sections (L99-148), the 4c carries (L74-85), the count command (L94-95) and Delivery (L33-37). The same blob is on current main; the 5a branch and the base still had r2 (`015ef02b`), which differs only at L249 (docs-only stand-in shots). Do [`step-04c.md`](step-04c.md) first; this step needs step 4 merged (guide L20). This file records exactly what shipped.

Sources: PR #87 and branch `step/step-05a-units-r1-chatA` (r1 tip `266a35df`, r1 code head `aeedd130`; r2 tip `6eca1f52`, same code head); `handback/step-05a-units/r1/HANDBACK.md` at `266a35df` (HB1, blob `dc94b3d5`, 156 lines) and at `6eca1f52` / the merge (HB2, blob `5b049da4`, 156 lines, same path); Chief Of Staff verify report `/workspace/share/step-05a-verify/report.md` (V1, sha256 `0bb611775a5892921bf4cba5f91c7fb0a526f1381a4abc5fdbffed926e8ad5bd`, 39 lines). `docs/qa/step-05a-review.md` (QA1, git hash-object `3a7f88d5`, 42 lines, already on first parent `9e921760` and at the merge): **NOT OK**, one must-fix, in the HANDBACK only, no product, test or smoke change required (QA1:3). `docs/qa/step-05a-r2-recheck.md` (QA2, git hash-object `14723f42`, 11 lines, on main `0dc2c588`): **OK TO MERGE**, product and test code unchanged from r1 (QA2:5, QA2:9). Line numbers are at the commit named. Code line cites are at merge `b8c1084e` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `37f42de36a65be7157ed6a68c74b89d5dc315735`, the step-04 guide L166 erratum on main after the 4c merge (PR #86). Floor **1065** tests (guide L141: 4c's final count + N) |
| r1 commits | `aeedd130` feat(maker): units list, health and attack (code head, tree `f7f224a6`, HB1:3 / HB2:3), `266a35df` docs(handback): step-05a-units r1 (tree `f69b943e`, V1). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Product behaviour passed (1070/0, G7 358, smokes). QA **NOT OK** (QA1:3). One must-fix, in the HANDBACK only (QA1:3, QA1:8): § Decisions named three over-cap files, not `tests/editor/maker-law.test.ts` (2+/2− = 4 vs cap 3) (guide L95). Three should-fixes / notes also in the tip or the HANDBACK (QA1:36-38): five engine-kit `.txt` files in the tip commit; HB1:121 “Waits are `waitForFunction` only” was slightly loose for inherited s4a/s4b sleeps; HB1:3 still had the “PR: opened by Chief of Staff” boilerplate |
| r2 commits | one fast-forward commit on the same branch `step/step-05a-units-r1-chatA`, parent `266a35df`: `6eca1f52` docs(handback): step-05a-units r1 name the fourth over-cap file (tree `212657a3`, QA2:3). No product, test or smoke file changed |
| r2 verdict | QA **OK TO MERGE** (QA2:5). The must-fix passes: HB2:153 has the `maker-law.test.ts` sentence word for word, and HB2:146 says “the four over-cap files named” (QA2:7). The five raw `.txt` logs are gone (4 insertions and 4 deletions in `HANDBACK.md`, 6536 deletions of logs; QA2:6). HB2:121 now says “New waits are `waitForFunction` only; …”; HB2:3 is “PR: none yet from the branch” (QA2:8). Gate 338 + 20 = 358. Behaviour is unchanged (QA2:9) |
| Merge | PR #87 "Step 5a: units list and editor", merge commit `b8c1084eb68dc14f6e869829576514972ebaac4e`, 2026-11-20 15:27 (UK time). Tree `f902afa319ed17ce56c5773278bbbf4720aa9ac7` (the same tree QA predicted against `9e921760`; QA2:11). First parent `9e9217602bbe576301bea9d13aaa6dc5e3385535` (the step-05 guide r3b, six look-reference shots, the guide QA reviews, and the 5a r1 QA review, all docs-only after `37f42de3`), second parent `6eca1f52` |
| After the merge | main is `0dc2c58839131c48e5b30d9d0a3a61ff419f0072`, which adds `docs/qa/step-05a-r2-recheck.md`. Both `docs/qa/step-05a-review.md` and `docs/qa/step-05a-r2-recheck.md` are on main. Postmerge (`cos-tools/qa-postmerge.sh b8c1084e 6eca1f52`): PASS (QA, 2026-11-20): parent2 6eca1f52, noreply author and committer, src/tests/tools diff equals the tip, pins 5/5, 1070/0, smokes 0 failures. |
| Tests | 1065 + N=5 (`unit skeleton loads`, `empty template stage has a seed`, `units`, `knob widgets`, `resize rows use plain words`) = **1070 pass / 0 fail** (HB2:25-32, V1, QA1:13) |
| Size | Accepted measure, `git diff --shortstat 37f42de3..aeedd130 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5a-units/**'`, is 12 files, **338 insertions + 20 deletions = 358** ≤ 400 (G7: `docs/qa/handback-checklist.md` L26 and `BUILD_GUIDE.md` L123, insertions plus deletions; guide L94-95, L127, L141; QA1:20, QA2:9, HB2:33). The same shortstat holds at the r1 tip `266a35df`, the r2 tip `6eca1f52` and, with `':!docs/**'` also excluded, at the merge. r2 only edited the excluded hand-back. On the merge commit, also exclude `':!docs/**'` (or measure at the code head): main added ten docs files after the base, 71 insertions and 1 deletion, which are not this step. Without that exclusion the merge shortstat is 22 files, 409 insertions and 21 deletions. The s5a smoke is 74 lines, under its own cap of 130 (guide L125, L36; HB2:34) |
| Stamp | `node tools/maker/build.ts` writes stamp `1a9756512a29` at the code head and at the merge (same maker sources; r2 did not change it) |
| Smoke | No `tools/play-stage/` change, so S0 is not required (guide L35, L137). S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`) is unedited. The s5a smoke prints `SMOKE PASS` once, after checks 1–8 (including `8 targets`) at 390 and at 360, under google-chrome on port 8802; the s4c smoke does the same on port 8801 after its two-line wait edit, the s4b smoke on port 8800, and the s4a smoke on port 8799 (guide L35, L129, L145; HB2:36-119; V1; QA1:21-24) |

## (b) Files

From `git diff --name-status 37f42de3..6eca1f52 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions against the base (r1 values, which is what merged). The same 15 product files are on the merge tree `f902afa3`.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `data/templates/unit.json` | new | 17 (data, not counted) | v2 unit skeleton: `setupIds: []`, `stats: {}`, empty `history` (guide L113, L103) |
| `data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json` | edited | 1 (data, not counted) | Carry (a): add `"seed": 24301` (guide L114, L74) |
| `src/editor/unit/units.ts` | new | 37 (cap 60) | Pure: `newUnit`, `renameUnit`, `unitNameError`, `usedBy`, `deleteUnit`, `setStat`, `resetStat`, `applyRole`, `shown` (guide L115) |
| `tools/maker/widgets.ts` | new | 27 (cap 80) | The seven knob widgets (H5) plus the read-only “Not editable here” row; colour chips use style tokens only (guide L116) |
| `tools/maker/units.ts` | new | 162 (cap 90) | Units section, unit editor, name sheet, role chips, Health/Attack, delete refusal, Undo (guide L117). Over the file cap; named in HB2:153 |
| `tools/maker/project.ts` | edited | 4 (2+/2−, cap 10) | Mount the Units section via `units?: string` (guide L118) |
| `tools/maker/rooms.ts` | edited | 9 (5+/4−, cap 8) | Carry (b): `who` / `say` plain wording, and `say` is exported; `undo` uses `Record<string, string>` (guide L119). Over the file cap; named in HB2:153 |
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | edited | 4 (2+/2−; cap 2 for “L27 and L48 only”) | Carry (b): only the waits at L27 and L48 (guide L120). The two-line replace is the allowed edit, named deliberate in HB2:124 and HB2:152, not as an overrun |
| `tests/editor/units.test.ts` | new | 43 (cap 55) | Named tests `unit skeleton loads` and `empty template stage has a seed`, plus the model / wired test `units` (guide L121, L142-144) |
| `tests/tools/knob-widgets.test.ts` | new | 18 (cap 40) | Named test `knob widgets` (guide L122) |
| `tests/editor/stage-rooms.test.ts` | edited | 11 (cap 10) | Named test `resize rows use plain words` (guide L123, L85). Over the file cap; named in HB2:153 |
| `tests/editor/maker-law.test.ts` | edited | 4 (2+/2−, cap 3) | Scan `src/editor/unit/**` as well as the maker files (guide L124). Over the file cap; unnamed in HB1:153, named in HB2:153 (QA1 must-fix, fixed in r2) |
| `handoff/steps/tests/s5a-units/smoke.mjs` | new | 74 (cap 130) | Browser smoke, own cap, outside the 400 (guide L125, L36). Measures check 8 with the name sheet, the editor, the role sheet and the delete refusal open |
| `tools/maker/home.ts` | edited | 38 (28+/10−) | Extra, not in the guide table: the click router, the 6 s toast, in-place Health/Attack updates, and loading `unit.json` (HB2:153) |
| `tools/maker/app.css` | edited | 1 | Extra: `input.knob` is 48 px (HB2:153) |

No other product file. Nothing under `tools/play-stage/`, `tests/tools/golden/`, `fixtures/`, `tools/maker/stage.ts`, `tests/editor/stage-place.test.ts`, `package.json` or `package-lock.json`. Path and Dirt stay hidden.

One-job rule (`docs/qa/handback-checklist.md` §3 I, L67): no touched code file is over about 500 lines. The largest new or edited files are `tools/maker/units.ts` at 162 lines, `tools/maker/rooms.ts` at 137 and `tools/maker/home.ts` at 124. `tools/maker/stage.ts` is still 255 and was not touched.

## (c) Key code and git commands

`src/editor/unit/units.ts` is the pure units helper. `newUnit` (`units.ts:6`) clones the skeleton and writes only `id` and `name`; it does not write a `kind` or `formatVersion` literal (the scan is `tests/editor/units.test.ts:21`). `renameUnit` (`units.ts:7`) writes only `name`. `unitNameError` (`units.ts:8`) is “Give your unit a name” when the trimmed name is empty, and “Use 40 characters or fewer” over 40 code points. `usedBy` (`units.ts:13-20`) walks only the live `project.stages` list (the same shape as 4c `refsTo`) and the project `loadout` (`required` / `roster`):

```ts
export function usedBy(files: Record<string, Obj>, unitId: string): readonly string[] {
  const root = isObj(files["project.json"]) ? files["project.json"] : {}, proj = isObj(root["project"]) ? root["project"] : {}, byId = new Map<string, Obj>(), out: string[] = [];
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && typeof doc["id"] === "string") byId.set(doc["id"], doc);
  for (const id of list(proj["stages"])) { if (typeof id !== "string") continue; const doc = byId.get(id); if (doc !== undefined && stageHit(doc, unitId)) out.push(`Used by ${nameOf(doc)}. Remove it there first.`); }
  const gear = isObj(proj["loadout"]) ? proj["loadout"] : null;
  if ([...list(gear?.["required"]), ...list(gear?.["roster"])].includes(unitId)) out.push("Used in your team list. Remove it there first.");
  return out;
}
```

`stageHit` (`units.ts:9-12`) checks a stage `loadout.required` / `roster`, `neutrals[].unitId` and `enemyPool.entries[].unitId`. `deleteUnit` (`units.ts:21-23`) refuses with those reasons, and otherwise returns the same `files` (no path is dropped; hiding is session-only in the maker layer). `setStat` (`units.ts:24-26`) writes `{value, rev: 1}`. `resetStat` (`units.ts:27-30`) copies every other key (no `delete`). `applyRole` (`units.ts:31-33`) writes only keys in `perUnitKeys`. `shown` (`units.ts:34-37`) lists `units/*.json` files that are not hidden, sorted by id.

`tools/maker/units.ts` is the Units UI. `unitTail` (`units.ts:79-84`) paints the Units heading, one card per shown unit, and + Add unit. `unitPage` (`units.ts:93-102`) is the unit editor: top bar Back and the name only (no Test; that is 5b, guide L104, HB2:156), Name, “Start from a role”, and the Health / Attack sliders from `unit-roster` knobs with `per_unit: true` and `type === "slider"`. “Same as army” shows while the key is absent (`statBlock` at `units.ts:73-78`). There is no Look control and no `sprite` write. `unitClick` (`units.ts:116-162`) is the click handler. An unused delete pushes the id into `sess.hidden` and leaves the file (`units.ts:140-144`); Undo is one snapshot (`undo` at `units.ts:103-111`). `rolesOf` (`units.ts:48-57`) keeps only presets whose overrides are all `per_unit` keys.

`tools/maker/home.ts` is the extra counted file. Project-screen `u:*` acts and a unit-undo go through `unitClick` (`home.ts:80-94`). Saves are one at a time (`go` at `home.ts:20`, `gate = gate.then(() => run(act))`). A Health or Attack tick (`u:stat:`) updates the number and swaps “Same as army” for Reset in place, and does not rebuild the page (`home.ts:86-92`). The 6 s toast is not drawn on the unit editor (`home.ts:34`, `home.ts:85`). `boot` loads `data/templates/unit.json` through `rememberUnit` (`home.ts:117`). Slider `input` events dispatch `u:stat:<key>:<value>` (`home.ts:122`). `tools/maker/project.ts:3` accepts `units?: string`; L9 paints `${input.units ?? ""}` after the Maps tail and still has the project-screen Test button (not the unit-editor Test).

`tools/maker/widgets.ts` `knobWidget` (`widgets.ts:8-27`) renders slider, picker (string or `{value, label}`), toggle, ref, list, text (`max_len`) and colour. Colour chips use `PALETTE` (`widgets.ts:5`): `--accent`, `--ink`, `--danger`, `--ok`, `--warn`, with `background:var(${token})` and no colour literal (`widgets.ts:25`). An unknown type is a read-only “Not editable here” row (`widgets.ts:26`). `tools/maker/app.css:47` sizes `input.knob` to 48 px.

Carry (a). The Empty template stage ships `"seed": 24301` at `data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json:8`. A new stage still copies the first live stage's numeric seed (`takenSeed` at `src/editor/stage/rooms.ts:19-27`, applied in `addStage` at L30), which the 5a guide confirms (guide L74). That removes the `play: seed` throw (`tools/play-stage/load.ts:24`) for Empty projects. Test on Empty still throws `play: army` until the empty template grows a `unit-roster` setup (`tools/play-stage/project.ts:33`; guide L74, HB2:156).

Carry (b). The drop-list and post-confirm wording is `who` / `say` at `tools/maker/rooms.ts:41-46`:

```ts
const who = (list: string): string => (list === "playerSpawns" ? "Your team start" : list === "neutrals" ? "NPC" : "Enemy");
export function say(row: Drop, ask: boolean): string {
  if (row.code === "mapEntryDropped") return ask ? "A wall edge outside the new size will be removed" : "A wall edge was outside the map and was removed";
  const at = row.sq === null ? "" : ` at ${row.sq.c},${row.sq.r}`;
  return ask ? `${who(row.list)}${at} will be removed` : `${who(row.list)}${at} was outside the map and was removed`;
}
```

Those are the guide L80-85 strings. `say` is exported so the wording test can import it. `undo` types the write bag as `Record<string, string>` (`rooms.ts:86`) so `tsc` accepts that import (HB2:153). Any list other than `playerSpawns` or `neutrals` reads “Enemy” (`who` at L41; QA1:40; HB2:151).

The s4c smoke edit is deliberate. Only the waits at `handoff/steps/tests/s4c-stages-maps/smoke.mjs:27` and L48 changed: `"will go"` became `"will be removed"`, and `"placementDropped"` became `"was outside the map and was removed"`. sha256 before, on the 4c merge and on this base, is `ea0d674fd2cbbf3ca8c4e36d8996a0fde227556380185ad808481f26f73148d5`; after is `d885c3e8f895c3c67635d48defb5edeb38039e3429c93e497640b3b55aa7e5ab` (blob `70f45c02`). HB2:124-130 pastes the diff and the hashes; HB2:152 names the edit as deliberate. That after hash is the s4c reference for 5b, 5c and the post-merge check (guide L85).

`tools/maker/stage.ts` was not edited, so the 4b allow-list pin still matches. `tools/maker/stage.ts:31` is still:

```ts
function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {
```

and `tests/editor/stage-place.test.ts:53` still deepEquals that exact line (HB2:39, HB2:152). `chosen()` remains at `stage.ts:35-41`.

The five named tests are `tests/editor/units.test.ts:18` (`unit skeleton loads`), L19 (`empty template stage has a seed`), L20-43 (`units`: new `unit_<ULID>`, no `kind` / `formatVersion` literal in the helper, load through `readProject` with an empty report, rename keeps every other field, a role writes only `per_unit` keys, `setStat` reaches `playDocsOf(...).rules.stats`, `resetStat` then inherits army 9, used-unit delete is refused with both guide lines, unused delete leaves the file, Undo restores the card), `tests/tools/knob-widgets.test.ts:4-18` (`knob widgets`), and `tests/editor/stage-rooms.test.ts:79-88` (`resize rows use plain words`: no `placementDropped`, `mapEntryDropped`, `playerSpawns`, `neutrals`, `enemyPool` or `outsideMap` in any `say` output, and the listed sentences). `maker-law.test.ts:16` also scans `src/editor/unit`; L26 asserts `lawHits(…/src/editor/unit)` is empty.

The s5a smoke (`handoff/steps/tests/s5a-units/smoke.mjs`, 74 lines) has no `waitForTimeout`. `tap()` and `press()` (L15-16) return after the tap. `waitText` (L17) is `page.waitForFunction` on body text, 15 s. `open(act, mark)` (L26) waits until `[data-act=mark]` exists, then runs `big()` (L25). Check 8 collects those measurements in `sheetTiny` and prints `8 targets @${width}` (L69). The calls cover the Units section (L34), the name sheet (`open("u:add", "u:create")`, L37), the editor (L40), the role sheet (`open("u:role", "u:apply:btf-warrior")`, L48) and the Wolf delete refusal (L62). The guide L129 minimum is the editor and the role sheet. The inherited s4a `tap` / `press` still use `waitForTimeout(120)` and `waitForTimeout(80)`, and s4b `press` still uses `waitForTimeout(80)`; s5a and the edited s4c have none (HB2:121).

## (d) What went wrong, in order, and the fix

**r1.** The product shipped and green was 1070/0. The official gate was 338 + 20 = 358. Solo and CPU-burn smokes passed, including check 8 with the new sheets open. QA **NOT OK** (QA1:3) with one must-fix, in the HANDBACK only; “The product, tests and smokes need no change” (QA1:3).

1. **Not every over-cap file was named (QA1:8).** Guide L95: a file may go over its cap if the total stays within 400, and the hand-back names every file over its cap and why. HB1:153 named `tools/maker/units.ts` (162 vs 90), `tests/editor/stage-rooms.test.ts` (11 vs 10) and `tools/maker/rooms.ts` (5+/4− vs 8), plus the extra `home.ts` and `app.css`. Also over: `tests/editor/maker-law.test.ts` 2 insertions and 2 deletions (L16, the stage-or-unit doc scan; L26, the `lawHits(…/src/editor/unit)` assert) = 4 against a cap of 3. HB1:146 also said “the three over-cap files named.” Fix, as QA wrote it (QA1:10): in HB:153, after the `rooms.ts` sentence and before “Extra files:”, insert “`tests/editor/maker-law.test.ts` is 2 insertions and 2 deletions against a 3 cap (the stage-or-unit doc scan at L16, and the `lawHits(…/src/editor/unit)` assert at L26).” In HB:146, change “the three over-cap files named” to “the four over-cap files named.”

r1 should-fixes, also hand-back only (QA1:36-38): drop the five engine-kit `.txt` files from the tip (`changed-files.txt`, `checks-output.txt`, `stat.txt`, `typecheck-output.txt`, and a 6473-line `test-output.txt`); qualify HB:121 so it does not claim every wait, including inherited s4a/s4b helpers, is `waitForFunction` only; replace the “PR: opened by Chief of Staff” boilerplate.

**r2.** One commit on the r1 tip, same branch. The only change is the hand-back folder: four go-line edits in `HANDBACK.md` and the five raw logs deleted (`git diff --stat 266a35df..6eca1f52` is 6 files, 4 insertions, 6536 deletions). The five PNGs are unchanged. All 15 product blobs are identical to r1 code head `aeedd130` (QA2:9, HB2:5).

- HB2:153 has the `maker-law.test.ts` sentence word for word, including the U+2026 in `lawHits(…/src/editor/unit)`, and HB2:146 says “four over-cap files named” (QA2:7).
- HB2:121 is “New waits are `waitForFunction` only; the inherited s4a/s4b tap and press helpers keep their short waitForTimeout.” HB2:3 is “PR: none yet from the branch” (QA2:8).
- Against the code head, the r2 tip is `HANDBACK.md` plus the five PNGs only (QA2:9).

QA **OK TO MERGE** (QA2:5). The merge tree is `f902afa3`, as predicted onto `9e921760` (QA2:11).

## (e) Do it right first time

- Start from `37f42de3`. The floor is 1065 + 5 = 1070.
- Put the unit model in `src/editor/unit/units.ts` and the Units UI in `tools/maker/units.ts`. Do not write a `kind` or `formatVersion` literal on a unit. Rename changes `name` only. Delete is not a hard delete. No Look control, no `sprite` write, no rule logic in the editor, no `tools/play-stage/` change.
- Leave Test off the unit editor (5b adds the unit sheet, the ability list and the panel, and only then shows Test). Empty projects still throw `play: army` until the empty template grows a `unit-roster` setup (HB2:156; `tools/play-stage/project.ts:33`).
- Ship `"seed": 24301` on the Empty template stage, and keep the 4c seed-copy rule (guide L74). Replace the 4c `say()` raw format names with the exact guide L80-85 strings, and edit only the s4c smoke waits at L27 and L48 to match. Paste that diff and the before (`ea0d674f…`) / after (`d885c3e8…`) sha256 in § Smoke. Leave `tools/maker/stage.ts:31` unmoved.
- A file may go over its cap if the total stays within 400, but the hand-back must name **every** over-cap file and why (guide L95). Here that is `tools/maker/units.ts` (162 vs 90), `tests/editor/stage-rooms.test.ts` (11 vs 10), `tools/maker/rooms.ts` (5+/4− vs 8) and `tests/editor/maker-law.test.ts` (2+/2− vs 3). Extra files (`home.ts`, `app.css`) must also be named. The s4c 2+/2− git count against a cap of 2 is the allowed two-line wait replace, not an unnamed overrun, and must be described as deliberate.
- A smoke that claims “every target is 48 px” must measure each new sheet **while it is open**, and must print a `8 targets @<width>` line at 390 and at 360. After a save, wait for the expected state with `waitForFunction`, not `waitForTimeout`.
- Paste the ok lines and `SMOKE PASS` from one solo run in § Smoke (guide L35). A 3-run or CPU-burn note can follow the paste. The tip commit should hold `HANDBACK.md` and the screenshots, not raw test logs.
- Measure with the step-05 count command (guide L94-95), with `':!handoff/steps/tests/s5a-units/**'`. Count insertions plus deletions (checklist L26, `BUILD_GUIDE.md` L123). 358 is the accepted number. The smoke's own cap is 130. On a merge, also exclude `':!docs/**'`.

## (f) Rebuild check

From a clean tree at `37f42de3`, write the 15 product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit:

```bash
# Product gate. On the merge also exclude docs/**, because main added the
# step-05 guide r3b, the six look-reference shots, the guide QA reviews,
# and the 5a r1 QA review after 37f42de3; those are not this step. The
# branch itself did not touch docs, so the same command without
# ':!docs/**' at the code head is the QA measure and is also 338 + 20 = 358.
git diff --shortstat 37f42de3..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5a-units/**' ':!docs/**'
#   12 files changed, 338 insertions(+), 20 deletions(-)

git diff --shortstat 37f42de3..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5a-units/**'   # at the code head or r2 tip
#   12 files changed, 338 insertions(+), 20 deletions(-)

sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --stat 37f42de3..HEAD -- tests/tools/golden/   # empty

sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

sha256sum handoff/steps/tests/s4c-stages-maps/smoke.mjs
#   d885c3e8f895c3c67635d48defb5edeb38039e3429c93e497640b3b55aa7e5ab

npm ci && npm run green   # 1070 pass, 0 fail. Includes:
#   ✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
#   ✔ unit skeleton loads
#   ✔ empty template stage has a seed
#   ✔ units
#   ✔ knob widgets
#   ✔ resize rows use plain words

# Smokes under google-chrome, at 390 and 360 CSS px:
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s5a-units/smoke.mjs . 8802
#   ok 1-8 (including 8 targets) @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801
#   ok 1-7 and 8 targets @390, ok 1-7 and 8 targets @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS

# The s5a smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s5a-units/smoke.mjs` is 74.
# `wc -l handoff/steps/tests/s4c-stages-maps/smoke.mjs` is 73.
# `node tools/maker/build.ts` writes stamp 1a9756512a29.
```

Against the merge tree: on your rebuild branch, `git diff b8c1084e HEAD -- data/templates/unit.json data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json src/editor/unit/units.ts tools/maker/widgets.ts tools/maker/units.ts tools/maker/project.ts tools/maker/rooms.ts tools/maker/home.ts tools/maker/app.css tests/editor/units.test.ts tests/tools/knob-widgets.test.ts tests/editor/stage-rooms.test.ts tests/editor/maker-law.test.ts handoff/steps/tests/s4c-stages-maps/smoke.mjs handoff/steps/tests/s5a-units/smoke.mjs` must be empty. The blob table below lists the exact git blob id each file must have at `b8c1084e`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id. The product and test blobs (everything except the hand-back) must also match r1 code head `aeedd130`.

## QA non-blockers carried forward

From QA1:36-42 and the 4c record. None of these blocked the PR. The r1 tip's extra `.txt` files, the loose wait sentence and the PR boilerplate were should-fixes / nits and were fixed in r2 (QA2:6-8).

1. (Was 4c QA1 non-blocker 2, fixed in 5a.) Raw format names in `say()` are gone. `who` / `say` at `tools/maker/rooms.ts:41-46` use the guide L80-85 strings. The named test is `resize rows use plain words` (`tests/editor/stage-rooms.test.ts:79-88`). The s4c smoke waits were updated at L27 and L48 only (sha256 `ea0d674f…` → `d885c3e8…`).
2. (Was 4c QA1 non-blocker 1, confirmed and extended in 5a.) A new stage still copies the first listed stage's numeric `seed` when one exists (`takenSeed` at `src/editor/stage/rooms.ts:19-27`, applied in `addStage` at L30). The Empty template stage now ships `"seed": 24301` (`…/stage_01JDEM00000000000000000003.json:8`), so Test on Empty no longer throws `play: seed`. It still throws `play: army` until the empty template grows a `unit-roster` setup (`tools/play-stage/project.ts:33`; guide L74; HB2:156). That is a carry into 5b.
3. The `mapAt[id] ??` fallback to `maps/<id>.json` in `src/project/load/drops.ts:43` is still unreachable from `read-project.ts` (4c QA1:35). 5a did not edit that file.
4. `resizeMap` (`src/editor/stage/resize.ts:37`) still falls back to `cols` / `rows` 0 when they are missing. Format-invalid maps only (4c QA1:36). 5a did not edit that file.
5. (Was QA1 must-fix, fixed in r2.) File caps, guidance only (guide L95): `tools/maker/units.ts` is 162 vs 90; `tests/editor/stage-rooms.test.ts` is 11 vs 10; `tools/maker/rooms.ts` is 5+/4− vs 8; `tests/editor/maker-law.test.ts` is 2+/2− vs 3. The total is 358 ≤ 400. r2 names all four (HB2:153). The 4c over-cap files (`resize.ts` 63 vs 60, `read-project.ts` 4+/4− vs 3, and 4c's `tools/maker/rooms.ts` 136 vs 60, now 137) remain as named in the 4c record.
6. Delete of an unused unit is session-only: the card is hidden for this session and comes back after a reload, because files stay and `planSave` cannot drop a path (QA1:41; HB2:150). The same rule still applies to unused maps (4c).
7. `who()` maps any list other than `playerSpawns` or `neutrals` to “Enemy” (`tools/maker/rooms.ts:41`). Format-invalid only for a new list (QA1:40; HB2:151).
8. `usedBy` walks live stages in `project.stages` only (`src/editor/unit/units.ts:13-20`), the same as 4c `refsTo` (QA1:41).
9. The 4a/4b/4c carries are still open: `chosen()` at `tools/maker/stage.ts:35-41`, uncapped stage undo (`src/editor/stage/undo.ts`), the maker-law plant dir with no `try/finally`, the talk skeleton `createdAt`, and the `stage.ts:31` allow-list pin (QA1:42). `stage.ts` was not edited in 5a, so the pin at `stage-place.test.ts:53` still matches. Path and Dirt stay hidden. 5a also leaves Test off the unit editor; 5b should add the unit sheet on the stage, the ability list and the panel, and only then show Test (HB2:156).

## Blob check

Each file must have exactly this git blob id at `b8c1084e`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `data/templates/unit.json` | `788434305e8bd47b2181fffc00d88c327523a2c0` | 17 |
| `data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json` | `2fb54b97c4eb82c94df4a19b7845d705a5970b4d` | 14 |
| `src/editor/unit/units.ts` | `92dfdda22da733f78ab5a9d01cddb9fb8b38db3b` | 37 |
| `tools/maker/widgets.ts` | `e135f5feaf65866e5b51c7ecaaa3bbf375b96752` | 27 |
| `tools/maker/units.ts` | `dd00c3a994ac4a861991d69da8bea3d61411a603` | 162 |
| `tools/maker/project.ts` | `77ac94f11057a3c076903dc7dbc2ac22f55cd8dd` | 10 |
| `tools/maker/rooms.ts` | `cb3541d5b9acc7328c0adc3b93263b4b6c5bfc0d` | 137 |
| `tools/maker/home.ts` | `33f794b7ca20d72e36a0bb7752d42fbd18b8f530` | 124 |
| `tools/maker/app.css` | `ce0a2d19889a340adc74035016d41570de28e135` | 47 |
| `tests/editor/units.test.ts` | `733edb880f586de9862dbee344a6cb5826d3b3df` | 43 |
| `tests/tools/knob-widgets.test.ts` | `da2d90b33f720bf82a83ff57f34ee5d22e762b62` | 18 |
| `tests/editor/stage-rooms.test.ts` | `359dffc3ff9d7e6752278564be95c7104218c56c` | 88 |
| `tests/editor/maker-law.test.ts` | `79db56289b74d735c6ebda3599032ef3f97231cc` | 36 |
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | `70f45c02af1fd861bd7b3f41c1941b3e2779c87d` | 73 |
| `handoff/steps/tests/s5a-units/smoke.mjs` | `486c5d12054325dfe37ba8e597de87b07a4f40bf` | 74 |

## Appendix: full code as merged (step 5a, PR #87)

New files are given in full. Edited files are given as the exact diff from `37f42de3` to `b8c1084e`, then in full as merged. Copy them byte for byte; the blob table checks you did. The hand-back is the r2 file (same path as r1); product, tests and smokes are identical to r1 code head `aeedd130`.

### `data/templates/unit.json` (new)

```json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_00000000000000000000000000",
  "rev": 0,
  "name": "New unit",
  "sprite": null,
  "setupIds": [],
  "stats": {},
  "history": {
    "cap": 200,
    "baseSeq": 0,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
```

### `src/editor/unit/units.ts` (new)

```ts
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const clone = <T>(v: T): T => structuredClone(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const nameOf = (doc: Obj): string => (typeof doc["name"] === "string" ? doc["name"] : "Stage");
export function newUnit(skel: Obj, id: string, name: string): Obj { const doc = clone(skel); doc["id"] = id; doc["name"] = name; return doc; }
export function renameUnit(unit: Obj, name: string): Obj { const doc = clone(unit); doc["name"] = name; return doc; }
export function unitNameError(raw: string): string | null { const name = raw.trim(), n = [...name].length; return n === 0 ? "Give your unit a name" : n > 40 ? "Use 40 characters or fewer" : null; }
function stageHit(doc: Obj, unitId: string): boolean {
  const gear = isObj(doc["loadout"]) ? doc["loadout"] : null, pool = isObj(doc["enemyPool"]) ? doc["enemyPool"] : null;
  return list(gear?.["required"]).includes(unitId) || list(gear?.["roster"]).includes(unitId) || list(doc["neutrals"]).some((n) => isObj(n) && n["unitId"] === unitId) || list(pool?.["entries"]).some((e) => isObj(e) && e["unitId"] === unitId);
}
export function usedBy(files: Record<string, Obj>, unitId: string): readonly string[] {
  const root = isObj(files["project.json"]) ? files["project.json"] : {}, proj = isObj(root["project"]) ? root["project"] : {}, byId = new Map<string, Obj>(), out: string[] = [];
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && typeof doc["id"] === "string") byId.set(doc["id"], doc);
  for (const id of list(proj["stages"])) { if (typeof id !== "string") continue; const doc = byId.get(id); if (doc !== undefined && stageHit(doc, unitId)) out.push(`Used by ${nameOf(doc)}. Remove it there first.`); }
  const gear = isObj(proj["loadout"]) ? proj["loadout"] : null;
  if ([...list(gear?.["required"]), ...list(gear?.["roster"])].includes(unitId)) out.push("Used in your team list. Remove it there first.");
  return out;
}
export function deleteUnit(files: Record<string, Obj>, unitId: string): { readonly ok: true; readonly files: Record<string, Obj> } | { readonly ok: false; readonly reasons: readonly string[] } {
  const reasons = usedBy(files, unitId); return reasons.length > 0 ? { ok: false, reasons } : { ok: true, files };
}
export function setStat(unit: Obj, key: string, value: number): Obj {
  const doc = clone(unit), stats = { ...(isObj(doc["stats"]) ? doc["stats"] : {}) }; stats[key] = { value, rev: 1 }; doc["stats"] = stats; return doc;
}
export function resetStat(unit: Obj, key: string): Obj {
  const doc = clone(unit); if (!isObj(doc["stats"])) return doc; const stats: Obj = {};
  for (const [k, v] of Object.entries(doc["stats"])) if (k !== key) stats[k] = v; doc["stats"] = stats; return doc;
}
export function applyRole(unit: Obj, overrides: Readonly<Record<string, number>>, perUnitKeys: ReadonlySet<string>): Obj {
  let doc = unit; for (const [key, value] of Object.entries(overrides)) if (perUnitKeys.has(key)) doc = setStat(doc, key, value); return doc;
}
export function shown(files: Record<string, Obj>, hidden: readonly string[]): readonly { readonly id: string; readonly name: string }[] {
  const rows = Object.entries(files).flatMap(([path, doc]) => (!path.startsWith("units/") || !path.endsWith(".json") || !isObj(doc) || typeof doc["id"] !== "string" || hidden.includes(doc["id"]) ? [] : [{ id: doc["id"], name: typeof doc["name"] === "string" ? doc["name"] : "Unit" }]));
  return rows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
```

### `tools/maker/widgets.ts` (new)

```ts
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export type KnobOpt = string | { readonly value: string; readonly label: string };
export type KnobSpec = { readonly id: string; readonly label: string; readonly type: string; readonly min?: number | null; readonly max?: number | null; readonly step?: number | null; readonly max_len?: number | null; readonly options?: readonly KnobOpt[] | null; readonly builtin?: readonly string[] | null };
const PALETTE = ["--accent", "--ink", "--danger", "--ok", "--warn"] as const;
const optOf = (item: KnobOpt): { readonly value: string; readonly label: string } => (typeof item === "string" ? { value: item, label: item } : item);
const num = (v: number | null | undefined): string => (typeof v === "number" ? String(v) : "");
export function knobWidget(spec: KnobSpec, value: unknown): string {
  const id = esc(spec.id), label = esc(spec.label);
  if (spec.type === "slider") {
    const cur = typeof value === "number" ? String(value) : num(spec.min);
    return `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="knob" type="range" min="${esc(num(spec.min))}" max="${esc(num(spec.max))}" step="${esc(num(spec.step) || "1")}" value="${esc(cur)}" data-knob="${id}" aria-label="${label}"><span class="sub" data-val="${id}">${esc(cur)}</span>`;
  }
  if (spec.type === "picker") return `<p class="sub">${label}</p>${(spec.options ?? []).map(optOf).map((o) => `<button type="button" class="btn" data-act="k:pick:${id}:${esc(o.value)}" aria-pressed="${value === o.value ? "true" : "false"}">${esc(o.label)}</button>`).join("")}`;
  if (spec.type === "toggle") return `<button type="button" class="btn" data-act="k:toggle:${id}" aria-pressed="${value === true ? "true" : "false"}" aria-label="${label}">${label}</button>`;
  if (spec.type === "ref") {
    const builtins = spec.builtin ?? [];
    return builtins.length === 0 ? `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="name-field" data-knob="${id}" aria-label="${label}" value="${esc(typeof value === "string" ? value : "")}">` : `<p class="sub">${label}</p>${builtins.map((o) => `<button type="button" class="btn" data-act="k:pick:${id}:${esc(o)}" aria-pressed="${value === o ? "true" : "false"}">${esc(o)}</button>`).join("")}`;
  }
  if (spec.type === "list") {
    const items = Array.isArray(value) ? value.flatMap((item) => (typeof item === "object" && item !== null && "label" in item && typeof item.label === "string" ? [item.label] : [])) : [];
    return `<p class="sub">${label}</p>${items.map((item) => `<p class="sub">${esc(item)}</p>`).join("")}<input class="name-field" data-knob="${id}" aria-label="${label}" value="">`;
  }
  if (spec.type === "text") return `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="name-field" data-knob="${id}"${typeof spec.max_len === "number" ? ` data-max="${spec.max_len}"` : ""} aria-label="${label}" value="${esc(typeof value === "string" ? value : "")}">`;
  if (spec.type === "colour") return `<p class="sub">${label}</p>${PALETTE.map((token) => `<button type="button" class="btn" data-act="k:colour:${id}:${token}" aria-label="${label} ${token}" aria-pressed="${value === token ? "true" : "false"}" style="background:var(${token});color:var(--ink)">${esc(token)}</button>`).join("")}`;
  return `<p class="sub">${label}</p><p>Not editable here</p>`;
}
```

### `tools/maker/units.ts` (new)

```ts
import { planSave } from "../../src/editor/project/save.ts";
import { prefix, ulid } from "../../src/editor/project/home.ts";
import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
type DocText = Readonly<Record<string, string>>;
type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
type Sess = { project: string; mode: "add" | "rename" | "role" | "menu" | "note" | "edit" | null; unit: string; name: string; hint: string; lines: string[]; hidden: string[]; stack: Snap[] };
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type UnitHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly toast?: string | null; readonly shown?: string };
export type UnitIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const blank = (project: string): Sess => ({ project, mode: null, unit: "", name: "", hint: "", lines: [], hidden: [], stack: [] });
let sess: Sess = blank(""), skel: Obj | null = null;
export function rememberUnit(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function bindUnits(id: string): void { if (sess.project !== id) sess = blank(id); }
export function unitLine(value: string): void { sess.name = value; }
export function unitEditing(): boolean { return sess.mode === "edit" || sess.mode === "rename" || sess.mode === "role"; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); return next;
}
async function commit(io: UnitIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
function roster(bag: Record<string, Obj>): { readonly knobs: Obj[]; readonly presets: unknown[]; readonly army: Obj | null } {
  const slice = bag["catalogue/slice.json"], behaviours = isObj(slice) ? list(slice["behaviours"]) : [], beh = behaviours.find((b) => isObj(b) && b["id"] === "unit-roster");
  const knobs = isObj(beh) ? list(beh["knobs"]).filter(isObj) : [], presets = isObj(beh) ? list(beh["presets"]) : [];
  const army = Object.values(bag).find((doc) => doc["behaviourId"] === "unit-roster");
  return { knobs, presets, army: isObj(army) ? army : null };
}
function armyNum(army: Obj | null, knob: Obj): number | null {
  const key = typeof knob["id"] === "string" ? knob["id"] : "", answers = army !== null && isObj(army["answers"]) ? army["answers"] : null, row = answers === null ? undefined : answers[key];
  if (isObj(row) && row["source"] !== "default" && typeof row["value"] === "number") return row["value"];
  return typeof knob["default"] === "number" ? knob["default"] : null;
}
function perKeys(knobs: readonly Obj[]): Set<string> { return new Set(knobs.filter((k) => k["per_unit"] === true && typeof k["id"] === "string").map((k) => String(k["id"]))); }
function rolesOf(knobs: readonly Obj[], presets: readonly unknown[]): { readonly id: string; readonly label: string; readonly overrides: Record<string, number> }[] {
  const per = perKeys(knobs), out: { id: string; label: string; overrides: Record<string, number> }[] = [];
  for (const item of presets) {
    if (!isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string" || !isObj(item["overrides"])) continue;
    const keys = Object.keys(item["overrides"]); if (keys.length === 0 || keys.some((key) => !per.has(key) || typeof item["overrides"][key] !== "number")) continue;
    const overrides: Record<string, number> = {}; for (const key of keys) { const n = item["overrides"][key]; if (typeof n === "number") overrides[key] = n; }
    out.push({ id: item["id"], label: item["label"], overrides });
  }
  return out;
}
function specOf(knob: Obj): KnobSpec | null {
  if (typeof knob["id"] !== "string" || typeof knob["label"] !== "string" || typeof knob["type"] !== "string") return null;
  return { id: knob["id"], label: knob["label"], type: knob["type"], ...(typeof knob["min"] === "number" ? { min: knob["min"] } : {}), ...(typeof knob["max"] === "number" ? { max: knob["max"] } : {}), ...(typeof knob["step"] === "number" ? { step: knob["step"] } : {}) };
}
function ownNum(unit: Obj, key: string): number | null { const stats = isObj(unit["stats"]) ? unit["stats"] : null, bag = stats === null ? undefined : stats[key]; return isObj(bag) && typeof bag["value"] === "number" ? bag["value"] : null; }
const kept = (host: Host): UnitHit => ({ files: host.files, rev: host.rev, banner: null, dirty: host.dirty });
async function save(io: UnitIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<UnitHit> {
  const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after));
  if (!wrote.ok) { sess.stack = prev; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, toast };
}
function unitDoc(bag: Record<string, Obj>, id: string): { readonly path: string; readonly doc: Obj } | null {
  const path = `units/${id}.json`, doc = bag[path]; return isObj(doc) ? { path, doc } : null;
}
function statBlock(unit: Obj, knob: Obj, army: Obj | null): string {
  const spec = specOf(knob); if (spec === null || spec.type !== "slider") return "";
  const own = ownNum(unit, spec.id), armyValue = armyNum(army, knob), shownValue = own ?? armyValue; if (shownValue === null) return "";
  const reset = own === null ? `<p class="sub">Same as army</p>` : `<button type="button" class="btn ghost" data-act="u:reset:${esc(spec.id)}">Reset</button>`;
  return `${knobWidget({ ...spec, min: spec.min ?? null, max: spec.max ?? null, step: spec.step ?? null }, shownValue)}${reset}`;
}
export function unitTail(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const cards = shown(bag, sess.hidden).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="u:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="u:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
  const add = readOnly ? "" : `<button type="button" class="card new" data-act="u:add"><span class="grow"><span class="name">+ Add unit</span></span></button>`;
  return `<h2>Units</h2>${cards}${add}`;
}
function sheet(): string {
  const close = `<button type="button" class="btn ghost" data-act="u:close">Close</button>`;
  if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}${close}</div></div>`;
  if (sess.mode === "add" || sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${sess.mode === "add" ? "Unit name" : "Rename"}</h2><input class="name-field" data-unit value="${esc(sess.name)}" aria-label="Unit name"><p class="hint">${esc(sess.hint || "1-40 characters")}</p><button type="button" class="btn" data-act="${sess.mode === "add" ? "u:create" : "u:save-name"}">${sess.mode === "add" ? "Add" : "Save"}</button>${close}</div></div>`;
  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Unit")}</h2><button type="button" class="btn danger" data-act="u:delete">Delete</button>${close}</div></div>`;
  return "";
}
export function unitSheet(): string { return sess.mode === "add" || sess.mode === "menu" || sess.mode === "note" ? sheet() : ""; }
export function unitPage(files: DocText, readOnly: boolean, banner: string | null): string {
  const bag = bagOf(files), hit = bag === null ? null : unitDoc(bag, sess.unit); if (bag === null || hit === null) return "";
  const { knobs, presets, army } = roster(bag), roles = rolesOf(knobs, presets), name = typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit";
  const stats = knobs.filter((knob) => knob["per_unit"] === true && knob["type"] === "slider").map((knob) => statBlock(hit.doc, knob, army)).join("");
  const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn" data-act="u:role">Start from a role</button>`;
  const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
  const note = banner === null ? "" : `<p class="banner bad" role="alert">${esc(banner)}</p>`;
  const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${esc(name)}</button>`;
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
}
async function undo(io: UnitIo, host: Host): Promise<UnitHit> {
  const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
  const next: Record<string, string> = { ...host.files }; for (const [path, text] of Object.entries(snap.files)) next[path] = text;
  const wrote = await commit(io, host.files, host.rev, next);
  if (!wrote.ok) { sess.stack = [snap]; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true }; }
  sess.hidden = [...snap.hidden];
  for (const path of Object.keys(host.files)) if (snap.files[path] === undefined && path.startsWith("units/") && path.endsWith(".json")) sess.hidden.push(path.slice("units/".length, -".json".length));
  sess.mode = null; sess.lines = []; return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, toast: null };
}
function clamp(knob: Obj, value: number): number {
  const min = typeof knob["min"] === "number" ? knob["min"] : value, max = typeof knob["max"] === "number" ? knob["max"] : value, step = typeof knob["step"] === "number" && knob["step"] > 0 ? knob["step"] : 1;
  const snapped = Math.round((value - min) / step) * step + min; return Math.min(max, Math.max(min, snapped));
}
export async function unitClick(act: string, host: Host, io: UnitIo): Promise<UnitHit> {
  if (act === "u:close") { sess.mode = sess.mode === "rename" || sess.mode === "role" ? "edit" : null; sess.hint = ""; sess.lines = []; return kept(host); }
  if (act === "u:back") { sess.mode = null; sess.hint = ""; return kept(host); }
  if (act === "u:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
  if (act === "u:add") { sess.mode = "add"; sess.name = "New unit"; sess.hint = ""; return kept(host); }
  if (act === "u:role") { sess.mode = "role"; return kept(host); }
  if (act === "u:rename") { const bag = bagOf(host.files), hit = bag === null ? null : unitDoc(bag, sess.unit); sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : ""; sess.hint = ""; sess.mode = "rename"; return kept(host); }
  if (act.startsWith("u:open:")) { sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
  if (act.startsWith("u:menu:")) { const bag = bagOf(host.files), id = act.slice(7), hit = bag === null ? null : unitDoc(bag, id); sess.unit = id; sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit"; sess.mode = "menu"; return kept(host); }
  const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
  if (act === "u:create" || act === "u:save-name") {
    const err = unitNameError(sess.name); if (err !== null) { sess.hint = err; return kept(host); }
    const name = sess.name.trim();
    if (act === "u:create") {
      if (skel === null) return { ...kept(host), banner: "Can't open: templates" };
      const id = `unit_${ulid(Date.parse(io.now), io.bytes())}`, doc = newUnit(skel, id, name);
      const hit = await save(io, host, bag, { ...bag, [`units/${id}.json`]: doc }, "Changed · Undo"); if (hit.banner !== null) return hit;
      sess.mode = "edit"; sess.unit = id; sess.hint = ""; return hit;
    }
    const cur = unitDoc(bag, sess.unit); if (cur === null) return { ...kept(host), banner: "Can't open this" };
    const hit = await save(io, host, bag, { ...bag, [cur.path]: renameUnit(cur.doc, name) }, "Changed · Undo"); if (hit.banner === null) { sess.mode = "edit"; sess.hint = ""; }
    return hit;
  }
  if (act === "u:delete") {
    const got = deleteUnit(bag, sess.unit); if (!got.ok) { sess.mode = "note"; sess.lines = [...got.reasons]; return kept(host); }
    sess.stack = [{ files: host.files, hidden: [...sess.hidden] }]; sess.hidden = [...sess.hidden, sess.unit]; sess.mode = null; sess.lines = [];
    return { ...kept(host), toast: "Deleted · Undo" };
  }
  const cur = unitDoc(bag, sess.unit); if (cur === null) return { ...kept(host), banner: "Can't open this" };
  const { knobs, presets } = roster(bag);
  if (act.startsWith("u:apply:")) {
    const role = rolesOf(knobs, presets).find((item) => item.id === act.slice(8)); if (role === undefined) return kept(host);
    const hit = await save(io, host, bag, { ...bag, [cur.path]: applyRole(cur.doc, role.overrides, perKeys(knobs)) }, "Changed · Undo"); if (hit.banner === null) sess.mode = "edit"; return hit;
  }
  if (act.startsWith("u:reset:")) {
    const hit = await save(io, host, bag, { ...bag, [cur.path]: resetStat(cur.doc, act.slice(8)) }, "Changed · Undo"); return hit;
  }
  if (act.startsWith("u:stat:")) {
    const parts = act.split(":"), key = parts[2] ?? "", value = Number(parts.slice(3).join(":")), knob = knobs.find((item) => item["id"] === key);
    if (knob === undefined || !Number.isFinite(value) || knob["per_unit"] !== true) return kept(host);
    const next = clamp(knob, value); if (ownNum(cur.doc, key) === next) return { ...kept(host), shown: String(next) };
    const hit = await save(io, host, bag, { ...bag, [cur.path]: setStat(cur.doc, key, next) }, "Changed · Undo");
    return hit.banner === null ? { ...hit, shown: String(next) } : hit;
  }
  return kept(host);
}
```

### `tests/editor/units.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { ulid } from "../../src/editor/project/home.ts";
import { pop, push } from "../../src/editor/stage/undo.ts";
import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
import { readProject } from "../../src/project/load/index.ts";
import { readUnit } from "../../src/project/read/unit.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url));
const text = (rel: string): string => readFileSync(join(root, rel), "utf8");
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const bag = (rel: string): Record<string, Record<string, unknown>> => { const parsed = parseProject(walk(rel)); if (!parsed.ok) throw new Error(parsed.message); const out: Record<string, Record<string, unknown>> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (typeof doc === "object" && doc !== null && !Array.isArray(doc)) out[path] = doc as Record<string, unknown>; return out; };
const rest = (doc: Record<string, unknown>): Record<string, unknown> => Object.fromEntries(Object.entries(doc).filter(([k]) => k !== "name"));
test("unit skeleton loads", () => { const got = readUnit(JSON.parse(text("data/templates/unit.json")) as unknown); assert.equal(got.ok, true); if (!got.ok) return; assert.equal(got.doc.setupIds?.length, 0); assert.deepEqual(got.doc.stats, {}); });
test("empty template stage has a seed", () => { const doc = JSON.parse(text("data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json")) as { seed?: unknown }; assert.equal(doc.seed, 24301); });
test("units", () => {
  const src = text("src/editor/unit/units.ts"); assert.equal(/\bformatVersion\b|["']?\bkind["']?\s*:/.test(src), false);
  const bytes = new Uint8Array(16); bytes[0] = 1; const id = `unit_${ulid(1_700_000_000_000, bytes)}`, other = `unit_${ulid(1_700_000_000_001, bytes)}`;
  assert.match(id, /^unit_[0-9A-HJKMNP-TV-Z]{26}$/); assert.notEqual(id, other); assert.equal(unitNameError("  "), "Give your unit a name"); assert.equal(unitNameError("Scout"), null);
  const skel = JSON.parse(text("data/templates/unit.json")) as Record<string, unknown>, made = newUnit(skel, id, "Scout");
  assert.equal(made["id"], id); assert.equal(made["name"], "Scout"); const demo = bag("fixtures/demo.tileproj"), files = { ...demo, [`units/${id}.json`]: made };
  const loaded = readProject(files); assert.equal(loaded.ok && loaded.report.length === 0 && loaded.project !== null, true);
  const renamed = renameUnit(made, "Guide"); assert.equal(renamed["id"], id); assert.deepEqual(rest(renamed), rest(made)); assert.equal(`units/${String(renamed["id"])}.json`, `units/${id}.json`);
  const role = applyRole(made, { unit_hp: 6, unit_atk: 2, board_cols: 8 }, new Set(["unit_hp", "unit_atk"])); const stats = role["stats"] as Record<string, { value?: number }>;
  assert.equal(stats["unit_hp"]?.value, 6); assert.equal(stats["unit_atk"]?.value, 2); assert.equal(stats["board_cols"], undefined);
  const knight = "unit_01JDAN00000000000000000001", wolf = "unit_01JDAN00000000000000000004", knightPath = `units/${knight}.json`;
  const base = demo[knightPath]; if (base === undefined || loaded.project === null) throw new Error("demo");
  const raised = setStat(base, "unit_hp", 12), played = playDocsOf({ ...loaded.project, units: { ...loaded.project.units, [knight]: raised } });
  assert.equal(played.rules.stats[knight]?.hp, 12); const back = resetStat(raised, "unit_hp"), inherited = playDocsOf({ ...loaded.project, units: { ...loaded.project.units, [knight]: back } });
  assert.equal((back["stats"] as Record<string, unknown>)["unit_hp"], undefined); assert.equal(inherited.rules.stats[knight]?.hp, 9);
  const stage = structuredClone(demo["stages/stage_01JDAS00000000000000000001.json"]); if (stage === undefined) throw new Error("stage");
  const neutrals = Array.isArray(stage["neutrals"]) ? stage["neutrals"] : []; stage["neutrals"] = [...neutrals, { unitId: knight, at: { c: 0, r: 0 } }];
  const both = deleteUnit({ ...demo, "stages/stage_01JDAS00000000000000000001.json": stage }, knight);
  assert.equal(both.ok, false); if (both.ok) return; assert.deepEqual([...both.reasons], ["Used by Demo stage. Remove it there first.", "Used in your team list. Remove it there first."]);
  const wolfOnly = deleteUnit(demo, wolf); assert.equal(wolfOnly.ok, false); if (wolfOnly.ok) return; assert.deepEqual([...wolfOnly.reasons], ["Used by Demo stage. Remove it there first."]);
  const gone = deleteUnit(files, id); assert.equal(gone.ok, true); if (!gone.ok) return; assert.equal(gone.files[`units/${id}.json`], made);
  const before: readonly string[] = [], stack = push([before], before), hidden = [id];
  assert.equal(shown(files, hidden).some((row) => row.id === id), false); const undone = pop(stack); assert.equal(shown(files, undone?.snap ?? hidden).some((row) => row.id === id), true);
});
```

### `tests/tools/knob-widgets.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { knobWidget } from "../../tools/maker/widgets.ts";
test("knob widgets", () => {
  const slider = knobWidget({ id: "unit_hp", label: "Health", type: "slider", min: 1, max: 21, step: 1 }, 9);
  assert.match(slider, /Health/); assert.match(slider, /type="range"/); assert.match(slider, /min="1"/); assert.match(slider, /max="21"/); assert.match(slider, /value="9"/);
  const pick = knobWidget({ id: "p", label: "Pick", type: "picker", options: ["a", { value: "b", label: "Bee" }] }, "b");
  assert.match(pick, /Bee/); assert.match(pick, />a</); assert.match(pick, /aria-pressed="true"/);
  assert.match(knobWidget({ id: "t", label: "On", type: "toggle" }, true), /aria-pressed="true"/);
  assert.match(knobWidget({ id: "r", label: "Ref", type: "ref", builtin: ["basic", "spells"] }, "basic"), /basic/);
  assert.match(knobWidget({ id: "r2", label: "Ref", type: "ref" }, "none"), /value="none"/);
  assert.match(knobWidget({ id: "l", label: "List", type: "list" }, [{ id: "g", label: "Group" }]), /Group/);
  const text = knobWidget({ id: "x", label: "Line", type: "text", max_len: 140 }, "Hi");
  assert.match(text, /data-max="140"/); assert.match(text, /value="Hi"/);
  const colour = knobWidget({ id: "c", label: "Team colour", type: "colour" }, "--accent");
  assert.equal(/#[0-9a-fA-F]{3,8}\b|\brgb|\bhsl/.test(colour), false); assert.match(colour, /var\(--accent\)/);
  assert.equal(knobWidget({ id: "z", label: "Odd", type: "matrix" }, 1).includes("Not editable here"), true);
});
```

### `handoff/steps/tests/s5a-units/smoke.mjs` (new)

```js
// Step 5a units. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s5a-units/smoke.mjs . 8802
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8802"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s5a-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s5a-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const WOLF = "unit_01JDAN00000000000000000004", KNIGHT = "unit_01JDAN00000000000000000001";
const NAMES = ["Knight", "Archer", "Cleric", "Wolf", "Villager", "Crate", "Merchant"];
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const sheetTiny = []; let scout = "";
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? ""} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const open = async (act, mark) => { await tap(page, act); await page.waitForFunction((m) => document.querySelector(`[data-act="${m}"]`) !== null, mark, { timeout: 15000 }); sheetTiny.push(...await big()); };
    const step = async (name, fn) => { try { await fn(); const tiny = await big(); check(`${name} @${width}`, errs.length === 0 && tiny.length === 0, errs.length === 0 && tiny.length === 0 ? "ok" : [...errs, ...tiny].join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const setHp = async (n) => { await page.locator('[data-knob="unit_hp"]').evaluate((el, n) => { el.value = String(n); el.dispatchEvent(new Event("input", { bubbles: true })); }, n); await page.waitForFunction((n) => document.querySelector('[data-val="unit_hp"]')?.textContent === String(n), n, { timeout: 15000 }); };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Units");
    await step("1 units", async () => {
      await page.evaluate(() => { const h = [...document.querySelectorAll("h2")].find((n) => n.textContent === "Units"); h?.scrollIntoView({ block: "start" }); });
      const text = await page.evaluate(() => document.body.innerText); if (NAMES.some((name) => !text.includes(name)) || !text.includes("+ Add unit")) throw new Error(text);
      await shot("01-units"); sheetTiny.push(...await big());
    });
    await step("2 add", async () => {
      await open("u:add", "u:create"); await page.locator("[data-unit]").waitFor({ timeout: 15000 }); await shot("02-name");
      await page.locator("[data-unit]").fill("Scout"); await tap(page, "u:create");
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Start from a role"), null, { timeout: 15000 });
      await shot("03-editor"); sheetTiny.push(...await big());
      await tap(page, "u:back"); await waitText(page, "+ Add unit");
      scout = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].map((el) => el.getAttribute("data-act") ?? "").find((act) => act.startsWith("u:open:") && (document.querySelector(`[data-act="${act}"]`)?.textContent ?? "").includes("Scout")) ?? "");
      if (!scout.startsWith("u:open:unit_")) throw new Error(scout || "no scout");
      await tap(page, scout);
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout", null, { timeout: 15000 });
    });
    await step("3 role", async () => {
      await open("u:role", "u:apply:btf-warrior"); await waitText(page, "Warrior (BTF)"); await shot("04-roles");
      await tap(page, "u:apply:btf-warrior");
      await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "9" && document.querySelector('[data-val="unit_atk"]')?.textContent === "1" && !document.body.innerText.includes("Same as army"), null, { timeout: 15000 });
    });
    await step("4 health", async () => {
      await setHp(12); await tap(page, "u:back"); await waitText(page, "Units"); await tap(page, scout); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "12", null, { timeout: 15000 });
      await tap(page, "u:reset:unit_hp"); await waitText(page, "Same as army");
    });
    await step("5 delete", async () => {
      const id = scout.slice("u:open:".length); await tap(page, "u:back"); await waitText(page, "Units"); await open(`u:menu:${id}`, "u:delete"); await tap(page, "u:delete");
      await page.waitForFunction((id) => document.body.innerText.includes("Deleted · Undo") && document.querySelector(`[data-act="u:open:${id}"]`) === null, id, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction((id) => document.querySelector(`[data-act="u:open:${id}"]`) !== null, id, { timeout: 15000 });
    });
    await step("6 refuse", async () => {
      await open(`u:menu:${WOLF}`, "u:delete"); await tap(page, "u:delete"); await waitText(page, "Used by Demo stage. Remove it there first."); await shot("05-refuse"); sheetTiny.push(...await big()); await tap(page, "u:close");
      await open(`u:menu:${KNIGHT}`, "u:delete"); await tap(page, "u:delete"); await waitText(page, "Used in your team list. Remove it there first."); await tap(page, "u:close");
    });
    await step("7 reload", async () => {
      await page.reload({ waitUntil: "load" }); await waitText(page, "My game"); await press(page, "My game"); await waitText(page, "Units"); await tap(page, scout);
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Same as army") && document.querySelector('[data-val="unit_hp"]')?.textContent === "9", null, { timeout: 15000 });
    });
    check(`8 targets @${width}`, sheetTiny.length === 0, sheetTiny.length === 0 ? "ok" : [...new Set(sheetTiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json` (edited)

```diff
diff --git a/data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json b/data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json
index 2bed785..2fb54b9 100644
--- a/data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json
+++ b/data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json
@@ -5,6 +5,7 @@
   "rev": 1,
   "name": "Blank",
   "mapRef": "map_01JDEM00000000000000000002",
+  "seed": 24301,
   "playerSpawns": [],
   "neutrals": [],
   "enemyPool": { "mode": "fixed", "entries": [] },
```

Full file as merged:

```json
{
  "kind": "stage",
  "formatVersion": 2,
  "id": "stage_01JDEM00000000000000000003",
  "rev": 1,
  "name": "Blank",
  "mapRef": "map_01JDEM00000000000000000002",
  "seed": 24301,
  "playerSpawns": [],
  "neutrals": [],
  "enemyPool": { "mode": "fixed", "entries": [] },
  "loadout": null,
  "rules": []
}
```

### `handoff/steps/tests/s4c-stages-maps/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s4c-stages-maps/smoke.mjs b/handoff/steps/tests/s4c-stages-maps/smoke.mjs
index 0eaf619..70f45c0 100644
--- a/handoff/steps/tests/s4c-stages-maps/smoke.mjs
+++ b/handoff/steps/tests/s4c-stages-maps/smoke.mjs
@@ -24,7 +24,7 @@ try {
     const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
     const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? ""} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
     const open = async (act, mark) => { await tap(page, act); await page.waitForFunction((m) => document.querySelector(`[data-act="${m}"]`) !== null, mark, { timeout: 15000 }); sheetTiny.push(...await big()); };
-    const drop = async () => { await tap(page, "r:apply"); await waitText(page, "will go"); sheetTiny.push(...await big()); };
+    const drop = async () => { await tap(page, "r:apply"); await waitText(page, "will be removed"); sheetTiny.push(...await big()); };
     const step = async (name, fn) => { try { await fn(); const tiny = await big(); check(`${name} @${width}`, errs.length === 0 && tiny.length === 0, errs.length === 0 && tiny.length === 0 ? "ok" : [...errs, ...tiny].join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     const nudge = async (axis, from, to) => { const dir = to < from ? -1 : 1, label = axis === "c" ? "Columns" : "Rows"; for (let n = from; n !== to; n += dir) { await tap(page, `r:step:${axis}:${dir}`); await waitText(page, `${label} ${n + dir}`); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
@@ -45,7 +45,7 @@ try {
       await waitText(page, "0,8"); await shot("04-resize"); await tap(page, "r:close"); await gone(page, "Resize anyway"); await press(page, "Demo stage");
       await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); await tap(page, "s:back"); await waitText(page, "Maps");
       await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
-      await tap(page, "r:anyway"); await waitText(page, "placementDropped"); await press(page, "Demo stage");
+      await tap(page, "r:anyway"); await waitText(page, "was outside the map and was removed"); await press(page, "Demo stage");
       await page.waitForFunction(() => document.querySelectorAll(".cell").length === 16, null, { timeout: 15000 }); await tap(page, "s:back"); await waitText(page, "Maps");
     });
     await step("4 refuse map", async () => { await open(`r:menu:map:${MAP}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "Used by: Demo stage"); await shot("05-refuse"); await tap(page, "r:close"); });
```

Full file as merged:

```js
// Step 4c stages and maps. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8801"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s4c-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s4c-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const gone = (page, s) => page.waitForFunction((s) => !document.body.innerText.includes(s), s, { timeout: 15000 });
const MAP = "map_01JDAM00000000000000000001", DEMO = "stage_01JDAS00000000000000000001";
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); let id = ""; const sheetTiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? ""} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const open = async (act, mark) => { await tap(page, act); await page.waitForFunction((m) => document.querySelector(`[data-act="${m}"]`) !== null, mark, { timeout: 15000 }); sheetTiny.push(...await big()); };
    const drop = async () => { await tap(page, "r:apply"); await waitText(page, "will be removed"); sheetTiny.push(...await big()); };
    const step = async (name, fn) => { try { await fn(); const tiny = await big(); check(`${name} @${width}`, errs.length === 0 && tiny.length === 0, errs.length === 0 && tiny.length === 0 ? "ok" : [...errs, ...tiny].join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const nudge = async (axis, from, to) => { const dir = to < from ? -1 : 1, label = axis === "c" ? "Columns" : "Rows"; for (let n = from; n !== to; n += dir) { await tap(page, `r:step:${axis}:${dir}`); await waitText(page, `${label} ${n + dir}`); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Demo stage");
    await step("1 add", async () => {
      await shot("01-project"); await open("r:add", "r:new"); await shot("02-add"); await tap(page, "r:new");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1 && new URLSearchParams(location.search).get("stage") !== null, null, { timeout: 15000 });
      id = await page.evaluate(() => new URLSearchParams(location.search).get("stage") ?? "");
      const text = await page.evaluate(() => document.body.innerText); if (!text.includes("Stage 2") || id === "") throw new Error(text);
    });
    await step("2 rename", async () => {
      await tap(page, "s:back"); await waitText(page, "Maps"); await open(`r:menu:stage:${id}`, "r:rename"); await open("r:rename", "r:save-name"); await shot("03-rename");
      await page.locator("[data-room]").fill("Upstairs"); await tap(page, "r:save-name");
      await page.waitForFunction((id) => document.body.innerText.includes("Upstairs") && new URLSearchParams(location.search).get("stage") === id, id, { timeout: 15000 });
    });
    await step("3 resize", async () => {
      await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await waitText(page, "Columns 6"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
      await waitText(page, "0,8"); await shot("04-resize"); await tap(page, "r:close"); await gone(page, "Resize anyway"); await press(page, "Demo stage");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); await tap(page, "s:back"); await waitText(page, "Maps");
      await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
      await tap(page, "r:anyway"); await waitText(page, "was outside the map and was removed"); await press(page, "Demo stage");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 16, null, { timeout: 15000 }); await tap(page, "s:back"); await waitText(page, "Maps");
    });
    await step("4 refuse map", async () => { await open(`r:menu:map:${MAP}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "Used by: Demo stage"); await shot("05-refuse"); await tap(page, "r:close"); });
    await step("5 test", async () => {
      await press(page, "Upstairs"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 }); await tap(page, "s:test");
      await page.waitForFunction((id) => new URLSearchParams(location.search).get("stage") === id && window.__play !== undefined && window.__play.world.grid.cols === 1 && window.__play.world.grid.rows === 1, id, { timeout: 15000 });
      await page.evaluate(() => window.__hud.hideBanner()); await shot("06-play"); await press(page, "Back to maker");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 });
    });
    await step("6 undo", async () => {
      await tap(page, "s:back"); await waitText(page, "Upstairs"); await open(`r:menu:stage:${id}`, "r:delete"); await tap(page, "r:delete");
      await page.waitForFunction((id) => document.body.innerText.includes("Deleted · Undo") && document.querySelector(`[data-act="stage:${id}"]`) === null, id, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction((id) => document.querySelector(`[data-act="stage:${id}"]`) !== null, id, { timeout: 15000 });
    });
    await step("7 last stage", async () => {
      await open(`r:menu:stage:${id}`, "r:delete"); await tap(page, "r:delete");
      await page.waitForFunction((id) => document.querySelector(`[data-act="stage:${id}"]`) === null, id, { timeout: 15000 });
      await open(`r:menu:stage:${DEMO}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "A game needs at least one stage");
    });
    check(`8 targets @${width}`, sheetTiny.length === 0, sheetTiny.length === 0 ? "ok" : [...new Set(sheetTiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `tests/editor/maker-law.test.ts` (edited)

```diff
diff --git a/tests/editor/maker-law.test.ts b/tests/editor/maker-law.test.ts
index f5ab7af..79db562 100644
--- a/tests/editor/maker-law.test.ts
+++ b/tests/editor/maker-law.test.ts
@@ -13,7 +13,7 @@ export function lawHits(dir: string): string[] {
     readFileSync(path, "utf8").split("\n").forEach((line, i) => {
       const at = `${path}:${i + 1}`;
       if (!skip && colour.test(line)) hits.push(`${at} colour`); if (ts && (/"kind"\s*:\s*"tile-project"/.test(line) || /"kind"\s*:\s*"map"/.test(line))) hits.push(`${at} kind`);
-      if (ts && path.includes(`${sep}stage${sep}`) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
+      if (ts && (path.includes(`${sep}stage${sep}`) || path.includes(`${sep}unit${sep}`)) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
       if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
       if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
     });
@@ -23,7 +23,7 @@ export function lawHits(dir: string): string[] {
 const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
 const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
 test("maker law holds, tokens match, and each plant fails", () => {
-  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []);
+  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []); assert.deepEqual(lawHits(join(root, "src/editor/unit")), []);
   const css = readFileSync(join(root, "tools/maker/tokens.css"), "utf8"), darkAt = css.indexOf('html[data-theme="dark"]'), mediaAt = css.indexOf("@media (prefers-color-scheme: dark)"), bodyAt = css.indexOf("\nbody");
   for (const token of LIGHT) assert.ok(css.slice(0, darkAt).includes(token), token);
   for (const token of DARK) assert.ok(css.slice(darkAt, mediaAt).includes(token) && css.slice(mediaAt, bodyAt).includes(token), token);
```

Full file as merged:

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
      if (ts && (path.includes(`${sep}stage${sep}`) || path.includes(`${sep}unit${sep}`)) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
      if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
      if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
    });
  }
  return hits;
}
const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
test("maker law holds, tokens match, and each plant fails", () => {
  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []); assert.deepEqual(lawHits(join(root, "src/editor/unit")), []);
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

### `tests/editor/stage-rooms.test.ts` (edited)

```diff
diff --git a/tests/editor/stage-rooms.test.ts b/tests/editor/stage-rooms.test.ts
index d223625..359dffc 100644
--- a/tests/editor/stage-rooms.test.ts
+++ b/tests/editor/stage-rooms.test.ts
@@ -7,6 +7,7 @@ import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc } from "../
 import { resizeMap, type Drop } from "../../src/editor/stage/resize.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import { parseProject } from "../../tools/maker/project-files.ts";
+import { say } from "../../tools/maker/rooms.ts";
 import { playDocsOf } from "../../tools/play-stage/project.ts";
 const root = fileURLToPath(new URL("../..", import.meta.url));
 type Obj = Record<string, unknown>;
@@ -75,3 +76,13 @@ test("stages and maps", () => {
   assert.deepEqual(grownLogic["terrain"], [0, 1]); assert.equal((grownLogic["palette"] as Obj)["0"], "water"); assert.equal((grownLogic["palette"] as Obj)["1"], "floor");
   assert.deepEqual(((grown.map["layers"] as Obj[])[0] ?? {})["tiles"], ["keep", null]); assert.deepEqual(bare.logic.terrain, [0]); assert.equal(grown.rows.length, 0);
 });
+test("resize rows use plain words", () => {
+  const edge: Drop = { code: "mapEntryDropped", mapId: "m", field: "edges", index: 1, reason: "outsideMap", path: "p" };
+  const place = (list: "playerSpawns" | "neutrals" | "enemyPool", sq: { c: number; r: number } | null): Drop => ({ code: "placementDropped", stageId: "s", list, index: 0, reason: "outsideMap", path: "p", sq });
+  const rows = [edge, place("playerSpawns", { c: 0, r: 8 }), place("neutrals", { c: 3, r: 4 }), place("enemyPool", null)];
+  const text = rows.flatMap((row) => [say(row, true), say(row, false)]).join("\n");
+  for (const bad of ["placementDropped", "mapEntryDropped", "playerSpawns", "neutrals", "enemyPool", "outsideMap"]) assert.equal(text.includes(bad), false, bad);
+  assert.equal(say(edge, true), "A wall edge outside the new size will be removed"); assert.equal(say(edge, false), "A wall edge was outside the map and was removed");
+  assert.equal(say(place("playerSpawns", { c: 0, r: 8 }), true), "Your team start at 0,8 will be removed"); assert.equal(say(place("playerSpawns", { c: 0, r: 8 }), false), "Your team start at 0,8 was outside the map and was removed");
+  assert.equal(say(place("neutrals", { c: 3, r: 4 }), false), "NPC at 3,4 was outside the map and was removed"); assert.equal(say(place("enemyPool", null), true), "Enemy will be removed");
+});
```

Full file as merged:

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc } from "../../src/editor/stage/rooms.ts";
import { resizeMap, type Drop } from "../../src/editor/stage/resize.ts";
import { readProject } from "../../src/project/load/index.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { say } from "../../tools/maker/rooms.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url));
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);
const readDir = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, walk = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, next); else out[next] = readFileSync(path, "utf8"); } }; walk(join(root, rel), ""); return out; };
const bagOf = (rel: string): Record<string, Obj> => { const parsed = parseProject(readDir(rel)); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const rest = (doc: Obj, key: string): Obj => Object.fromEntries(Object.entries(doc).filter(([k]) => k !== key));
const proj = (files: Record<string, Obj>): Obj => { const rootDoc = files["project.json"]; if (!isObj(rootDoc) || !isObj(rootDoc["project"])) throw new Error("project"); return rootDoc["project"]; };
test("stages and maps", () => {
  const docRe = /\bformatVersion\b|["']?\bkind["']?\s*:/;
  const hits = ["src/editor/stage/rooms.ts", "src/editor/stage/resize.ts", "tools/maker/rooms.ts"].flatMap((rel) => readFileSync(join(root, rel), "utf8").split("\n").flatMap((line, i) => (docRe.test(line) ? [`${rel}:${i + 1}`] : [])));
  assert.deepEqual(hits, []);
  const empty = bagOf("data/templates/empty.tileproj"), skelS = docsIn(empty, "stages")[0], skelM = docsIn(empty, "maps")[0];
  if (skelS === undefined || skelM === undefined) throw new Error("skeleton");
  const added = addStage(empty, skelS.doc, skelM.doc, "stage_NEW", "map_NEW", "Stage 2", "Stage 2 map"), made = readProject(added);
  assert.equal(made.ok && made.report.length === 0, true);
  assert.deepEqual(proj(added)["stages"], ["stage_01JDEM00000000000000000003", "stage_NEW"]);
  const born = added["stages/stage_NEW.json"], bornMap = added["maps/map_NEW.json"];
  assert.ok(isObj(born) && isObj(bornMap)); if (!isObj(born) || !isObj(bornMap)) return;
  assert.equal(born["id"] === "stage_NEW" && born["name"] === "Stage 2" && born["mapRef"] === "map_NEW" && bornMap["id"] === "map_NEW" && bornMap["name"] === "Stage 2 map", true);
  const shared = addStage(empty, skelS.doc, null, "stage_OLD", String(skelM.doc["id"]), "Stage 2", "Stage 2 map"), sharedStage = shared["stages/stage_OLD.json"];
  assert.equal(shared["maps/map_NEW.json"], undefined); assert.ok(isObj(sharedStage) && sharedStage["mapRef"] === skelM.doc["id"]);
  const before = structuredClone(empty[skelS.path]); assert.ok(isObj(before)); if (!isObj(before)) return;
  const renamed = renameDoc(empty, skelS.path, "Upstairs")[skelS.path]; assert.ok(isObj(renamed)); if (!isObj(renamed)) return;
  assert.equal(renamed["name"], "Upstairs"); assert.deepEqual(rest(renamed, "name"), rest(before, "name")); assert.equal(renamed["id"], before["id"]); assert.equal(Object.keys(renamed).join(), Object.keys(before).join());
  const demo = bagOf("fixtures/demo.tileproj"), stage = docsIn(demo, "stages")[0], mapHit = docsIn(demo, "maps")[0];
  if (stage === undefined || mapHit === undefined || !isObj(mapHit.doc["logic"])) throw new Error("demo");
  const mapId = String(mapHit.doc["id"]); assert.deepEqual([...refsTo(demo, mapId)], ["Demo stage"]);
  const refusedMap = deleteMap(demo, mapId); assert.equal(refusedMap.ok, false); if (refusedMap.ok) return; assert.deepEqual([...refusedMap.usedBy], ["Demo stage"]);
  const refused = deleteStage(demo, String(stage.doc["id"])); assert.deepEqual(refused, { ok: false, reason: "A game needs at least one stage" });
  const seeded = addStage(demo, skelS.doc, skelM.doc, "stage_NEW", "map_NEW", "Stage 2", "Stage 2 map");
  assert.equal(isObj(seeded["stages/stage_NEW.json"]) && seeded["stages/stage_NEW.json"]["seed"], 24301);
  const rootDoc = structuredClone(seeded["project.json"]); assert.ok(isObj(rootDoc) && isObj(rootDoc["project"])); if (!isObj(rootDoc) || !isObj(rootDoc["project"])) return;
  rootDoc["project"]["render"] = { ...(isObj(rootDoc["project"]["render"]) ? rootDoc["project"]["render"] : {}), excludedStages: ["stage_NEW", "keep"] };
  const gone = deleteStage({ ...seeded, "project.json": rootDoc }, "stage_NEW"); assert.equal(gone.ok, true); if (!gone.ok) return;
  assert.ok(gone.files["stages/stage_NEW.json"] !== undefined); const left = proj(gone.files), render = left["render"];
  assert.equal(Array.isArray(left["stages"]) && left["stages"].includes("stage_NEW"), false);
  assert.ok(isObj(render) && Array.isArray(render["excludedStages"])); if (!isObj(render) || !Array.isArray(render["excludedStages"])) return;
  assert.deepEqual(render["excludedStages"], ["keep"]);
  const map = structuredClone(mapHit.doc), logic = map["logic"]; assert.ok(isObj(logic) && Array.isArray(logic["terrain"]) && Array.isArray(logic["edges"])); if (!isObj(logic) || !Array.isArray(logic["terrain"])) return;
  const oldN = logic["terrain"].length; logic["lanes"] = Array.from({ length: oldN }, (_, i) => (i === 0 ? 7 : 0)); logic["edges"] = [{ c: 0, r: 0, side: "e" }, { c: 5, r: 0, side: "n" }];
  const copy = structuredClone(stage.doc); copy["id"] = "stage_COPY"; copy["name"] = "Copy"; copy["playerSpawns"] = [{ c: 5, r: 0 }]; copy["neutrals"] = []; copy["enemyPool"] = { mode: "fixed", entries: [] };
  const listed = structuredClone(demo["project.json"]); assert.ok(isObj(listed) && isObj(listed["project"])); if (!isObj(listed) || !isObj(listed["project"])) return;
  listed["project"]["stages"] = [...(Array.isArray(listed["project"]["stages"]) ? listed["project"]["stages"] : []), "stage_COPY"];
  const files = { ...demo, "project.json": listed, [mapHit.path]: map, "stages/stage_COPY.json": copy }, snap = structuredClone(map);
  const sized = resizeMap(mapHit.path, map, docsIn(files, "stages"), 4, 10);
  assert.deepEqual(map, snap); assert.deepEqual([...refsTo(files, mapId)], ["Demo stage", "Copy"]);
  const terrain = (sized.map["logic"] as Obj)["terrain"], lanes = (sized.map["logic"] as Obj)["lanes"], tiles = ((sized.map["layers"] as Obj[])[0] ?? {})["tiles"];
  assert.equal(sized.map["cols"] === 4 && sized.map["rows"] === 10 && Array.isArray(terrain) && terrain.length === 40 && terrain[0] === logic["terrain"][0] && terrain[36] === 0, true);
  assert.equal(Array.isArray(lanes) && lanes.length === 40 && lanes[0] === 7 && lanes[36] === 0, true);
  assert.equal(Array.isArray(tiles) && tiles.length === 40 && tiles[0] === (list(mapHit.doc["layers"])[0]?.["tiles"] as unknown[] | undefined)?.[0] && tiles[36] === null, true);
  assert.equal(sized.rows.some((row) => JSON.stringify(row).includes("lanes")), false);
  const place = sized.rows.filter((row): row is Extract<Drop, { code: "placementDropped" }> => row.code === "placementDropped");
  assert.deepEqual(place.map((row) => [row.list, row.index, row.reason, row.sq, row.unitId ?? null, row.path.endsWith(`#/${row.list === "enemyPool" ? "enemyPool/entries" : row.list}/${row.index}`)]), [
    ["neutrals", 1, "outsideMap", { c: 4, r: 4 }, "unit_01JDAN00000000000000000007", true],
    ["neutrals", 2, "outsideMap", { c: 5, r: 4 }, "unit_01JDAN00000000000000000005", true],
    ["playerSpawns", 0, "outsideMap", { c: 5, r: 0 }, null, true],
  ]);
  assert.deepEqual(sized.rows.filter((row) => row.code === "mapEntryDropped"), [{ code: "mapEntryDropped", mapId, field: "edges", index: 1, reason: "outsideMap", path: `${mapHit.path}#/logic/edges/1` }]);
  const next: Record<string, Obj> = { ...files, [mapHit.path]: sized.map }; for (const item of sized.stages) next[item.path] = item.doc;
  const loaded = readProject(next); assert.equal(loaded.ok && loaded.project !== null && loaded.report.every((row) => row.severity !== "hard"), true); if (loaded.project === null) return;
  const played = playDocsOf(loaded.project).map as Obj; assert.equal(played["cols"] === 4 && played["rows"] === 10, true);
  const bare = { id: "m", cols: 1, rows: 1, logic: { terrain: [0], palette: { "0": "water" }, edges: [] }, layers: [{ tiles: ["keep"] }] };
  const grown = resizeMap("maps/m.json", bare, [], 2, 1), grownLogic = grown.map["logic"] as Obj;
  assert.deepEqual(grownLogic["terrain"], [0, 1]); assert.equal((grownLogic["palette"] as Obj)["0"], "water"); assert.equal((grownLogic["palette"] as Obj)["1"], "floor");
  assert.deepEqual(((grown.map["layers"] as Obj[])[0] ?? {})["tiles"], ["keep", null]); assert.deepEqual(bare.logic.terrain, [0]); assert.equal(grown.rows.length, 0);
});
test("resize rows use plain words", () => {
  const edge: Drop = { code: "mapEntryDropped", mapId: "m", field: "edges", index: 1, reason: "outsideMap", path: "p" };
  const place = (list: "playerSpawns" | "neutrals" | "enemyPool", sq: { c: number; r: number } | null): Drop => ({ code: "placementDropped", stageId: "s", list, index: 0, reason: "outsideMap", path: "p", sq });
  const rows = [edge, place("playerSpawns", { c: 0, r: 8 }), place("neutrals", { c: 3, r: 4 }), place("enemyPool", null)];
  const text = rows.flatMap((row) => [say(row, true), say(row, false)]).join("\n");
  for (const bad of ["placementDropped", "mapEntryDropped", "playerSpawns", "neutrals", "enemyPool", "outsideMap"]) assert.equal(text.includes(bad), false, bad);
  assert.equal(say(edge, true), "A wall edge outside the new size will be removed"); assert.equal(say(edge, false), "A wall edge was outside the map and was removed");
  assert.equal(say(place("playerSpawns", { c: 0, r: 8 }), true), "Your team start at 0,8 will be removed"); assert.equal(say(place("playerSpawns", { c: 0, r: 8 }), false), "Your team start at 0,8 was outside the map and was removed");
  assert.equal(say(place("neutrals", { c: 3, r: 4 }), false), "NPC at 3,4 was outside the map and was removed"); assert.equal(say(place("enemyPool", null), true), "Enemy will be removed");
});
```

### `tools/maker/app.css` (edited)

```diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index 6906b53..ce0a2d1 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -44,3 +44,4 @@ input.name-field { min-height: 48px; border: 2px solid var(--line); border-radiu
 .cell .who, .cell .pill { font-size: 10px; font-weight: 800; } .pill { border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--ink); padding: 1px 3px; }
 .dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
 .chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
+input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px; min-height: 48px; min-width: 48px; accent-color: var(--accent); }
```

Full file as merged:

```css
.app { height: 100dvh; min-height: 100dvh; background: var(--bg); color: var(--ink); display: flex; flex-direction: column; }
.app[hidden] { display: none; }
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
.banner { margin: 0; padding: 12px; border-radius: var(--radius); background: var(--warn-soft); border: 1px solid var(--warn-line); color: var(--warn); font-weight: 700; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.banner.bad { background: var(--danger-soft); border-color: var(--danger-line); color: var(--danger); }
.toast { position: fixed; left: 16px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 14px; background: var(--ink); color: var(--bg); font-weight: 650; }
.toast .btn { background: transparent; color: var(--bg); border-color: transparent; }
.scrim { position: fixed; inset: 0; z-index: 5; background: var(--scrim); display: flex; align-items: flex-end; justify-content: center; }
.sheet { width: min(390px, 100%); max-height: 85vh; overflow: auto; background: var(--surface); color: var(--ink); border-radius: 16px 16px 12px 12px; box-shadow: var(--sheet-shadow); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.sheet h2, .project h2 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
input.name-field { min-height: 48px; border: 2px solid var(--line); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--ink); }
.test-wrap { margin-top: auto; padding-top: 24px; }
.test-wrap .btn { width: 100%; min-height: 56px; }
.dot { display: inline-block; width: 8px; height: 8px; margin-left: 6px; border-radius: 999px; background: var(--accent); }
.project .sheet { position: static; width: auto; max-height: none; box-shadow: none; padding: 0; border-radius: 0; background: transparent; }
.project .sheet p { margin: 0; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
@media (min-width: 421px) {
  body { min-height: 100dvh; display: grid; place-items: center; }
  .app { width: 390px; height: 844px; min-height: 0; border-radius: 28px; overflow: hidden; box-shadow: var(--frame-shadow); }
  .toast { position: absolute; }
}
@media (max-width: 420px) {
  .app { border-radius: 0; height: 100dvh; }
}
.topbar.wrap { flex-wrap: wrap; } .topbar.wrap h1 { flex: 1 1 auto; min-width: 8.5rem; max-width: 100%; } .stage-row { width: 100%; min-height: 48px; flex: none; } .grid { display: grid; width: max-content; }
.cell { box-sizing: border-box; width: 48px; height: 48px; min-width: 48px; min-height: 48px; padding: 2px; border: 1px solid var(--line); color: var(--ink); font-size: 11px; font-weight: 700; line-height: 1.1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
.grid.off .cell { border-color: transparent; } .cell.on { outline: 3px solid var(--accent); outline-offset: -3px; } .t-floor { background: var(--surface); } .t-water { background: var(--accent-soft); } .t-wall { background: var(--line); } .t-other { background: var(--surface-2); }
.cell .who, .cell .pill { font-size: 10px; font-weight: 800; } .pill { border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--ink); padding: 1px 3px; }
.dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
.chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px; min-height: 48px; min-width: 48px; accent-color: var(--accent); }
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 0ad7ee8..33f794b 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -3,6 +3,7 @@ import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
+import { bindUnits, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
 import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
@@ -10,11 +11,13 @@ import { startMatch } from "../play-stage/page.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
-const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
-let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "";
+type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
+const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
+let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve();
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
 const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
+const fail = (e: unknown): void => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.");
+const go = (act: string): void => { gate = gate.then(() => run(act)).catch(fail); };
 const rowHtml = (row: Row): string => { const open = row.error === null, tag = open ? "button" : "div"; return `<article class="card"><${tag} class="grow card-hit"${open ? ` type="button" data-act="open:${row.id}"` : ""}><span class="name">${esc(row.name)}</span><span class="sub">${esc(row.error ?? subline(row, Date.now()))}</span>${row.badge === null ? "" : `<span class="badge">${esc(row.badge)}</span>`}</${tag}><button type="button" class="btn icon" data-act="menu:${row.id}" aria-label="Project menu">⋯</button></article>`; };
 function sheet(): string {
   if (state.screen === "pick") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a start</h2><button type="button" class="choice" data-act="tpl:demo" aria-pressed="${state.tpl === "demo" ? "true" : "false"}">Demo</button><button type="button" class="choice" data-act="tpl:empty" aria-pressed="${state.tpl === "empty" ? "true" : "false"}">Empty</button><button type="button" class="btn" data-act="toname">Continue</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
@@ -28,14 +31,14 @@ function paint(): void {
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }); return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly) }) + roomSheet(state.files) + toast; return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly), units: unitTail(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet()) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
   root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
 }
 async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
-async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; bindRooms(id); paint(); }
+async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; bindRooms(id); bindUnits(id); paint(); }
 async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
 async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
 async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
@@ -71,13 +74,28 @@ async function fromUrl(): Promise<void> {
   const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
   if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
   if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
-  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id);
+  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
 }
 async function run(act: string): Promise<void> {
+  const unitUndo = act === "undo" && state.undo === "unit";
+  if ((act.startsWith("u:") || unitUndo) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
+    const hadBanner = state.banner !== null;
+    const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
+    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
+    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
+    if (act.startsWith("u:stat:") && hit.banner === null && !hadBanner && typeof hit.shown === "string") {
+      const key = act.split(":")[2] ?? "", span = /^[A-Za-z0-9_-]+$/.test(key) ? document.querySelector(`[data-val="${key}"]`) : null;
+      if (span !== null) span.textContent = hit.shown;
+      const sib = span?.nextElementSibling;
+      if (sib instanceof HTMLElement && sib.tagName === "P" && sib.textContent === "Same as army") { const btn = document.createElement("button"); btn.type = "button"; btn.className = "btn ghost"; btn.setAttribute("data-act", `u:reset:${key}`); btn.textContent = "Reset"; sib.replaceWith(btn); }
+      return;
+    }
+    paint(); return;
+  }
   if ((act.startsWith("r:") || (act === "undo" && state.screen === "project")) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
     const hit = await roomClick(act === "undo" ? "r:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes, empty: templates.empty });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; if (state.screen === "project") paint(); }, 6000); }
+    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "room"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
     if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
     paint(); return;
   }
@@ -96,11 +114,11 @@ async function boot(): Promise<void> {
   try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
   try {
     const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
-    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
+    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
     templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
   } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
 }
-document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
-document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
+document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) go(node.getAttribute("data-act") ?? ""); });
+document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(`u:stat:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 void boot();
```

Full file as merged:

```ts
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
import { bindUnits, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve();
const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
const fail = (e: unknown): void => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.");
const go = (act: string): void => { gate = gate.then(() => run(act)).catch(fail); };
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
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly), units: unitTail(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet()) + (unitEditing() ? "" : toast); return; }
  const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
  const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
  const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
  root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
}
async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; bindRooms(id); bindUnits(id); paint(); }
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
  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
}
async function run(act: string): Promise<void> {
  const unitUndo = act === "undo" && state.undo === "unit";
  if ((act.startsWith("u:") || unitUndo) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
    const hadBanner = state.banner !== null;
    const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
    if (act.startsWith("u:stat:") && hit.banner === null && !hadBanner && typeof hit.shown === "string") {
      const key = act.split(":")[2] ?? "", span = /^[A-Za-z0-9_-]+$/.test(key) ? document.querySelector(`[data-val="${key}"]`) : null;
      if (span !== null) span.textContent = hit.shown;
      const sib = span?.nextElementSibling;
      if (sib instanceof HTMLElement && sib.tagName === "P" && sib.textContent === "Same as army") { const btn = document.createElement("button"); btn.type = "button"; btn.className = "btn ghost"; btn.setAttribute("data-act", `u:reset:${key}`); btn.textContent = "Reset"; sib.replaceWith(btn); }
      return;
    }
    paint(); return;
  }
  if ((act.startsWith("r:") || (act === "undo" && state.screen === "project")) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
    const hit = await roomClick(act === "undo" ? "r:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes, empty: templates.empty });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "room"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
    if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
    paint(); return;
  }
  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
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
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) go(node.getAttribute("data-act") ?? ""); });
document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(`u:stat:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
void boot();
```

### `tools/maker/project.ts` (edited)

```diff
diff --git a/tools/maker/project.ts b/tools/maker/project.ts
index 0761158..77ac94f 100644
--- a/tools/maker/project.ts
+++ b/tools/maker/project.ts
@@ -1,10 +1,10 @@
 const amp = String.fromCharCode(38);
 const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string }): string {
+export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string; readonly units?: string }): string {
   const reason = "Made with a newer TileEngine. Open only.";
   const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
   const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
   const rows = (input.rows ?? []).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}${input.units ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
 }
```

Full file as merged:

```ts
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string; readonly units?: string }): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
  const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
  const rows = (input.rows ?? []).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}${input.units ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
}
```

### `tools/maker/rooms.ts` (edited)

```diff
diff --git a/tools/maker/rooms.ts b/tools/maker/rooms.ts
index 2976751..cb3541d 100644
--- a/tools/maker/rooms.ts
+++ b/tools/maker/rooms.ts
@@ -38,10 +38,11 @@ async function commit(io: RoomIo, stored: DocText, rev: number, next: DocText):
   return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
 }
 const kept = (host: Host, banner: string | null): RoomHit => ({ files: host.files, rev: host.rev, banner, dirty: host.dirty, stageId: null });
-function say(row: Drop, ask: boolean): string {
-  if (row.code === "mapEntryDropped") return ask ? `Edge ${row.index} will go` : `mapEntryDropped edges ${row.index} outsideMap`;
+const who = (list: string): string => (list === "playerSpawns" ? "Your team start" : list === "neutrals" ? "NPC" : "Enemy");
+export function say(row: Drop, ask: boolean): string {
+  if (row.code === "mapEntryDropped") return ask ? "A wall edge outside the new size will be removed" : "A wall edge was outside the map and was removed";
   const at = row.sq === null ? "" : ` at ${row.sq.c},${row.sq.r}`;
-  return ask ? `${row.list} ${row.index}${at} will go` : `placementDropped ${row.list} ${row.index} outsideMap`;
+  return ask ? `${who(row.list)}${at} will be removed` : `${who(row.list)}${at} was outside the map and was removed`;
 }
 async function save(io: RoomIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<RoomHit> {
   const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
@@ -82,7 +83,7 @@ function titleOf(files: DocText): string {
 }
 async function undo(io: RoomIo, host: Host): Promise<RoomHit> {
   const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host, null), toast: null };
-  const next: DocText = { ...host.files }; for (const [path, text] of Object.entries(snap.files)) next[path] = text;
+  const next: Record<string, string> = { ...host.files }; for (const [path, text] of Object.entries(snap.files)) next[path] = text;
   const wrote = await commit(io, host.files, host.rev, next);
   if (!wrote.ok) { sess.stack = [snap]; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true, stageId: null }; }
   sess.hidden = [...snap.hidden]; for (const path of Object.keys(host.files)) if (snap.files[path] === undefined && path.startsWith("maps/") && path.endsWith(".json")) sess.hidden.push(path.slice("maps/".length, -".json".length));
```

Full file as merged:

```ts
import { checkName, prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc } from "../../src/editor/stage/rooms.ts";
import { resizeMap, type Drop } from "../../src/editor/stage/resize.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
type Sess = { project: string; mode: "add" | "menu" | "rename" | "resize" | "ask" | "note" | null; which: "stage" | "map"; target: string; cols: number; rows: number; name: string; lines: string[]; hidden: string[]; stack: Snap[] };
export type RoomHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly stageId: string | null; readonly toast?: string | null };
export type RoomIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array; readonly empty: DocText };
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const blank = (project: string): Sess => ({ project, mode: null, which: "stage", target: "", cols: 1, rows: 1, name: "", lines: [], hidden: [], stack: [] });
let sess: Sess = blank("");
export function bindRooms(id: string): void { if (sess.project !== id) sess = blank(id); }
export function roomLine(value: string): void { sess.name = value; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function skels(empty: DocText): { readonly stage: Obj; readonly map: Obj } | null {
  const bag = bagOf(empty); if (bag === null) return null; const stage = docsIn(bag, "stages")[0]?.doc, map = docsIn(bag, "maps")[0]?.doc;
  return stage !== undefined && map !== undefined ? { stage, map } : null;
}
function pathOf(files: Record<string, Obj>, folder: "stages" | "maps", id: string): string | null {
  return docsIn(files, folder).find(({ doc }) => doc["id"] === id)?.path ?? null;
}
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); return next;
}
async function commit(io: RoomIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
const kept = (host: Host, banner: string | null): RoomHit => ({ files: host.files, rev: host.rev, banner, dirty: host.dirty, stageId: null });
const who = (list: string): string => (list === "playerSpawns" ? "Your team start" : list === "neutrals" ? "NPC" : "Enemy");
export function say(row: Drop, ask: boolean): string {
  if (row.code === "mapEntryDropped") return ask ? "A wall edge outside the new size will be removed" : "A wall edge was outside the map and was removed";
  const at = row.sq === null ? "" : ` at ${row.sq.c},${row.sq.r}`;
  return ask ? `${who(row.list)}${at} will be removed` : `${who(row.list)}${at} was outside the map and was removed`;
}
async function save(io: RoomIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<RoomHit> {
  const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after));
  if (!wrote.ok) { sess.stack = prev; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true, stageId: null }; }
  sess.mode = null; return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, stageId: null, toast };
}
export function roomTail(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const maps = docsIn(bag, "maps").filter(({ doc }) => !sess.hidden.includes(String(doc["id"]))).map(({ doc }) => {
    const id = String(doc["id"]), name = typeof doc["name"] === "string" ? doc["name"] : "Map", used = refsTo(bag, id).length;
    const menu = readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:map:${esc(id)}" aria-label="Menu ${esc(name)}">⋯</button>`;
    return `<div class="card"><div class="grow"><span class="name">${esc(name)}</span><span class="sub">${esc(String(doc["cols"]))} × ${esc(String(doc["rows"]))} · Used by ${used} ${used === 1 ? "stage" : "stages"}</span></div>${menu}</div>`;
  }).join("");
  const add = readOnly ? "" : `<button type="button" class="card new" data-act="r:add"><span class="grow"><span class="name">+ Add stage</span></span></button>`;
  const lines = sess.mode === null ? sess.lines.map((line) => `<p class="sub">${esc(line)}</p>`).join("") : "";
  return `${add}<h2>Maps</h2>${maps}${lines}`;
}
export function roomSheet(files: DocText): string {
  if (sess.mode === null) return "";
  const close = `<button type="button" class="btn ghost" data-act="r:close">Close</button>`;
  const bag = bagOf(files);
  if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2><p>${esc(sess.lines[0] ?? "")}</p>${close}</div></div>`;
  if (sess.mode === "add") {
    const maps = bag === null ? [] : docsIn(bag, "maps").filter(({ doc }) => !sess.hidden.includes(String(doc["id"])));
    const uses = maps.map(({ doc }) => `<button type="button" class="btn" data-act="r:use:${esc(String(doc["id"]))}">Use map: ${esc(typeof doc["name"] === "string" ? doc["name"] : "Map")}</button>`).join("");
    return `<div class="scrim"><div class="sheet" role="dialog"><h2>Add stage</h2><button type="button" class="btn" data-act="r:new">New map</button>${uses}${close}</div></div>`;
  }
  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Edit")}</h2><button type="button" class="btn" data-act="r:rename">Rename</button>${sess.which === "map" ? `<button type="button" class="btn" data-act="r:resize">Resize</button>` : ""}<button type="button" class="btn danger" data-act="r:delete">Delete</button>${close}</div></div>`;
  if (sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Rename</h2><input class="name-field" data-room value="${esc(sess.name)}" aria-label="Name"><button type="button" class="btn" data-act="r:save-name">Save</button>${close}</div></div>`;
  if (sess.mode === "ask") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}<button type="button" class="btn danger" data-act="r:anyway">Resize anyway</button><button type="button" class="btn ghost" data-act="r:close">Cancel</button></div></div>`;
  const big = sess.cols > 256 || sess.rows > 256 ? `<p>Big maps may stutter on phones</p>` : "";
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2><p>Columns ${sess.cols}</p><button type="button" class="btn" data-act="r:step:c:-1" aria-label="Fewer columns">−</button><button type="button" class="btn" data-act="r:step:c:1" aria-label="More columns">+</button><p>Rows ${sess.rows}</p><button type="button" class="btn" data-act="r:step:r:-1" aria-label="Fewer rows">−</button><button type="button" class="btn" data-act="r:step:r:1" aria-label="More rows">+</button>${big}<button type="button" class="btn" data-act="r:apply">Apply</button>${close}</div></div>`;
}
function titleOf(files: DocText): string {
  const bag = bagOf(files), path = bag === null ? null : pathOf(bag, sess.which === "map" ? "maps" : "stages", sess.target), doc = path === null || bag === null ? null : bag[path];
  return isObj(doc) && typeof doc["name"] === "string" ? doc["name"] : "Edit";
}
async function undo(io: RoomIo, host: Host): Promise<RoomHit> {
  const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host, null), toast: null };
  const next: Record<string, string> = { ...host.files }; for (const [path, text] of Object.entries(snap.files)) next[path] = text;
  const wrote = await commit(io, host.files, host.rev, next);
  if (!wrote.ok) { sess.stack = [snap]; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true, stageId: null }; }
  sess.hidden = [...snap.hidden]; for (const path of Object.keys(host.files)) if (snap.files[path] === undefined && path.startsWith("maps/") && path.endsWith(".json")) sess.hidden.push(path.slice("maps/".length, -".json".length));
  sess.lines = []; sess.mode = null;
  return { files: await readTree(io.store, prefix(io.id)), rev: wrote.rev, banner: null, dirty: false, stageId: null, toast: null };
}
export async function roomClick(act: string, host: Host, io: RoomIo): Promise<RoomHit> {
  if (act === "r:close") { sess.mode = null; sess.lines = []; return kept(host, null); }
  if (act === "r:undo") return undo(io, host);
  if (host.readOnly) return kept(host, "Made with a newer TileEngine. Open only.");
  if (act === "r:add") { sess.mode = "add"; sess.lines = []; return kept(host, null); }
  if (act.startsWith("r:menu:")) {
    const body = act.slice(7), which = body.startsWith("map:") ? "map" : "stage";
    sess.which = which; sess.target = body.slice(which.length + 1); sess.name = titleOf(host.files); sess.mode = "menu"; sess.lines = []; return kept(host, null);
  }
  if (act === "r:rename") { sess.name = titleOf(host.files); sess.mode = "rename"; return kept(host, null); }
  if (act === "r:resize") {
    const bag = bagOf(host.files), path = bag === null ? null : pathOf(bag, "maps", sess.target), doc = path === null || bag === null ? null : bag[path];
    sess.cols = isObj(doc) && typeof doc["cols"] === "number" ? doc["cols"] : 1; sess.rows = isObj(doc) && typeof doc["rows"] === "number" ? doc["rows"] : 1; sess.mode = "resize"; return kept(host, null);
  }
  if (act.startsWith("r:step:")) { const parts = act.split(":"), delta = Number(parts[3]); if (parts[2] === "c") sess.cols = Math.max(1, sess.cols + delta); else sess.rows = Math.max(1, sess.rows + delta); return kept(host, null); }
  const bag = bagOf(host.files); if (bag === null) return kept(host, "Can't open this project");
  if (act === "r:new" || act.startsWith("r:use:")) {
    const sk = skels(io.empty); if (sk === null) return kept(host, "Can't open: templates");
    const stageId = `stage_${ulid(Date.parse(io.now), io.bytes())}`, existing = act.startsWith("r:use:") ? act.slice(6) : null, mapId = existing ?? `map_${ulid(Date.parse(io.now), io.bytes())}`;
    const n = list(isObj(bag["project.json"]) && isObj(bag["project.json"]["project"]) ? bag["project.json"]["project"]["stages"] : []).length + 1;
    const after = addStage(bag, sk.stage, existing === null ? sk.map : null, stageId, mapId, `Stage ${n}`, `Stage ${n} map`);
    const hit = await save(io, host, bag, after, "Changed · Undo"); return hit.banner === null ? { ...hit, stageId } : hit;
  }
  if (act === "r:save-name") {
    const name = sess.name.trim(), err = checkName(name); if (err !== null) return kept(host, err);
    const path = pathOf(bag, sess.which === "map" ? "maps" : "stages", sess.target); if (path === null) return kept(host, "Can't open this");
    return save(io, host, bag, renameDoc(bag, path, name), "Changed · Undo");
  }
  if (act === "r:delete" && sess.which === "map") {
    const got = deleteMap(bag, sess.target); if (!got.ok) { sess.mode = "note"; sess.lines = [`Used by: ${got.usedBy.join(", ")}`]; return kept(host, null); }
    sess.stack = [{ files: host.files, hidden: [...sess.hidden] }]; sess.hidden = [...sess.hidden, sess.target]; sess.mode = null; sess.lines = []; return { ...kept(host, null), toast: "Deleted · Undo" };
  }
  if (act === "r:delete") {
    const got = deleteStage(bag, sess.target); if (!got.ok) { sess.mode = "note"; sess.lines = [got.reason]; return kept(host, null); }
    return save(io, host, bag, got.files, "Deleted · Undo");
  }
  if (act === "r:apply" || act === "r:anyway") {
    const mapPath = pathOf(bag, "maps", sess.target), map = mapPath === null ? null : bag[mapPath]; if (mapPath === null || !isObj(map)) return kept(host, "Can't open this map");
    const sized = resizeMap(mapPath, map, docsIn(bag, "stages"), sess.cols, sess.rows);
    if (act === "r:apply" && sized.rows.length > 0) { sess.mode = "ask"; sess.lines = sized.rows.map((row) => say(row, true)); return kept(host, null); }
    const after: Record<string, Obj> = { ...bag, [mapPath]: sized.map }; for (const stage of sized.stages) if (bag[stage.path] !== stage.doc) after[stage.path] = stage.doc;
    const hit = await save(io, host, bag, after, "Changed · Undo"); if (hit.banner === null) sess.lines = sized.rows.map((row) => say(row, false)); return hit;
  }
  return kept(host, null);
}
```
