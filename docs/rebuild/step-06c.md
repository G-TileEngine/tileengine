# Rebuild record: step 6c, tactics checkpoint, Empty to a win

Original brief: [`docs/maker/steps/step-06-levels-win-rules.md`](../maker/steps/step-06-levels-win-rules.md) on the merge (r2, blob `c846699d`, sha256 `a80602396f4839157d1009166e84bd629c61c2c8ba5a9a1326f73f3fb3183192`), 6c section L197–226. Check 8 is L37; the count command is L82; caps sum 130 at L211; `checkpoint.test.ts` cap 90 at L207; smoke own cap 130 at L209. The file is unchanged from the 6c product base through the merge and current main.

Sources: PR #92 and branch `step/step-06c-checkpoint-r1-chatA` (tip `f2de1870`, code head `c028fbd2`); `handback/step-06c-checkpoint/r1/HANDBACK.md` at `f2de1870` and on the merge (HB, blob `a357dc06`, 193 lines); CoS verify report `/workspace/share/step-06c-verify/report.md` (V, 57 lines, sha256 `0abc4043ccbe1b94795eb5be8a4a63904a5f37ec049ce84422e5154391365d1d`, hash-object `aa5980039713182d6021da8a6ed116f91189088a`); QA review `docs/qa/step-06c-review.md` on main `dd731459` (QA, 59 lines, hash-object `6dc37f95fa14d7e89994bbbb1f569fdba3649e33`). Line cites use HB, V and QA.

## (a) Start and finish

| | Value |
|---|---|
| Base | `68a67a56787dcf439554a267a1af987479c5f745`, 6b QA review on main, 2026-11-22 07:29 (UK time). Floor **1102** tests (guide L220: 6b's final count + N). After this merge the floor is **1105**. Current `origin/main` at merge time was `c89e39b6021615d6a8fe2d5dff45dfc637ff9c55` (2026-11-22 07:44 UK time), docs-only on top of the base: `docs/rebuild/step-06b.md`, `docs/qa/rebuild-step-06b-review.md` and `docs/qa/rebuild-step-06b-recheck.md` |
| r1 commits | `c028fbd2012999089951cff90a7442cf675e7428` feat(maker): tactics checkpoint from Empty to a win (code head, tree `2549e455247708b54ce494616d44d9a0612d764b`, 2026-11-22 15:19 UK time), `f2de1870c0e1ea86fd3655083f4fb3831b94cc09` docs(handback): step-06c-checkpoint r1 (tree `1624456ec4c7322b107ad7a3dbe53412f0f08139`, 2026-11-22 15:20 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the hand-back folder only (17 files, 2623 insertions): `HANDBACK.md`, eight pngs, and `checkpoint.tileproj/` written by the smoke (V:7, HB:172) |
| r1 verdict | QA **OK TO MERGE** (QA:3). No must-fix, no rework round (QA:3, QA:58-59). Green 1105/0, official G7 119, s6c ×3 (one under CPU load; V:23, HB:31), S0, s3, s4a, s6a and s6b all pass (V:22-23, QA:13-14). Non-blockers (QA:52-56) are recorded below |
| Merge | PR #92 "Step 6c: tactics checkpoint, Empty to a win", merge commit `be4f47e1f7768a3c694c24fb86fbe3203b8ff3fb`, 2026-11-22 16:00 (UK time). Tree `3832f731820c4a58786ad114790c3645daf34913` (the same tree CoS and QA predicted against `c89e39b6`; V:36, QA:16). First parent `c89e39b6` (main at merge, not the product base), second parent `f2de1870`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| After the merge | main is `dd7314595c1d9a146ea35576eddfba6765051d59`, 2026-11-22 16:01 (UK time), tree `23604d5827c3c6ce28cdea83cfa72af811d2f6f5`, which adds only `docs/qa/step-06c-review.md` (59 insertions, hash-object `6dc37f95`). QA postmerge PASS: merge `be4f47e1` (tree `3832f731`), parent 2 is tip `f2de1870`, 1105/0, pins 5/5, smoke ok, noreply author, merge vs tip shows only the three main docs; the only WARN is the normal main-moved (`dd731459`). Floor is now 1105. |
| Tests | 1102 + N=3 (`tactics checkpoint: Empty to a win`, `checkpoint win comes from the rule`, `checkpoint project loads clean`) = **1105 pass / 0 fail**. Floor after this merge is **1105** (HB:14, V:21, QA:8) |

## (b) Files

From `git diff --name-status 68a67a56..c028fbd2 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base (which is what the 6c step added). The same product files are on the merge tree `3832f731`. The three 6b docs on the merge are from first parent `c89e39b6`, not from this branch.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tests/editor/checkpoint.test.ts` | A | 119 / 0 | 90 (guidance, L207) | yes. **119 against cap 90**, named at HB:190 |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | A | 119 / 0 | 130 (own, L209) | no (smoke exclude) |

No product, maker, or play-stage file was edited. No gap-fix file (HB:11, HB:182, V:18). Official G7 is **1 file changed, 119 insertions(+)** = 119 ≤ 400. Caps sum 130 (guide L211) is not a second gate. `home.ts` was not edited. No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base.

## (c) Key code and git commands

6c is a tactics checkpoint only (guide L197–226, roadmap L81). A project built from Empty in the maker plays in Test to a win. There is no new screen and no catalogue or play-stage edit.

The scripted test starts from `data/templates/empty.tileproj` and `stampNew`, uses the named exported editor functions, and saves through `planSave` / `memoryStore` / `launchTest` (`tests/editor/checkpoint.test.ts:36-55,100-107`; V:18, QA:19). `start` is called (`:104-105`). `createMatch(docs, 0)` reaches `outcome === "win"` within 30 turns with the Raider dead and the XP strip's level ≥ 1 (`fight` at `:68-85`, asserted at `:84`). The Off-rule test leaves `outcome` null after the Raider falls and End turn (`:108-112,83`). `readProject` is clean, the slice equals `sliceOf(BUNDLED, ids)`, ids are exactly `line-shot`, `terrain`, `unit-roster`, `win-condition`, `xp-levels`, and every setup has D16 answers (`:113-119`). No Demo file, no hand-written project, no level-set picker or offer. The smoke writes `checkpoint.tileproj/` from `window.__read()`, not by hand (`smoke.mjs:112`; HB:172). The p18 intend helpers are not exported, so the fight inlines `intend` / `choose` of the same family (HB:190, V:31); that meets Done when L221 in substance (QA:19).

The three named tests, closed on their last line (V:20, QA:8):

```ts
test("tactics checkpoint: Empty to a win", async () => {
  const { stamped, next } = built(), plan = planSave(stamped, next, 1, NOW); if (!plan.ok) throw new Error(plan.error + " " + plan.message + " " + plan.path);
  const store = memoryStore(); assert.equal((await commitWrites(store, prefix(PID), asWrites(stamped))).ok, true);
  let docs: Parameters<typeof createMatch>[0];
  const got = await launchTest({ store, id: PID, stored: stamped, next, rev: 1, from: "project", now: NOW, start(ready) { docs = ready; } });
  assert.equal(got.ok, true); if (docs === undefined) throw new Error("start");
  fight(createMatch(docs, 0), false);
});
test("checkpoint win comes from the rule", () => {
  const { bag } = built(), off = wrote(setStageRule(bag, json("data/templates/setup.rule.json"), STAGE, "setup_01JWIN0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED));
  const load = readProject(off); if (!load.ok || load.project === null) throw new Error("load");
  fight(createMatch(playDocsOf(load.project), 0), true);
});
test("checkpoint project loads clean", () => {
  const { next, bag } = built(), parsed = parseProject(next); if (!parsed.ok) throw new Error(parsed.path + " " + parsed.message);
  const load = readProject(parsed.files); assert.equal(load.ok, true); assert.deepEqual([...load.report], []);
  const slice = bag["catalogue/slice.json"], ids = isObj(slice) && Array.isArray(slice["behaviours"]) ? slice["behaviours"].flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []) : [];
  assert.equal(next["catalogue/slice.json"], sliceOf(BUNDLED, ids)); assert.equal(d16(bag), true);
  assert.deepEqual([...ids].sort(), ["line-shot", "terrain", "unit-roster", "win-condition", "xp-levels"].sort());
});
```

**Guide L213 Attack 5 vs Empty `unit_atk` max 2 — a guide-wording carry, not a product fail.** The Empty slice (`data/templates/empty.tileproj/catalogue/slice.json`) has `unit_atk` default 1, min 0, max 2. Catalogue edits are forbidden. The smoke slides the Attack slider to 5 and waits until the shown number is 2 (`smoke.mjs:56`); the dumped Hero has `unit_atk.value` 2; shots 04 / 04b show Attack 2 at the slider max (HB:183, QA:20, V:18). Existing `setStat` (`src/editor/unit/units.ts:24-26`) does not clamp, so the scripted test still writes 5 as the step names (`checkpoint.test.ts:43`); `readProject` does not range-check unit stats (HB:183). The kill is line-shot damage 2 against Raider Health 2, so Attack is not what wins. Do not "fix" this by raising the slice max. A later guide typo can say 2.

```ts
  bag = { ...bag, [`units/${HERO}.json`]: setStat(setStat(newUnit(unit, HERO, "Hero"), "unit_hp", 20), "unit_atk", 5) };
```

```ts
export function setStat(unit: Obj, key: string, value: number): Obj {
  const doc = clone(unit), stats = { ...(isObj(doc["stats"]) ? doc["stats"] : {}) }; stats[key] = { value, rev: 1 }; doc["stats"] = stats; return doc;
}
```

```js
      await slide(page, '[data-knob="unit_atk"]', "5"); await page.waitForFunction(() => document.querySelector('[data-val="unit_atk"]')?.textContent === "2", null, { timeout: 15000 }); await quiet(page);
```

**Done-when / smoke split on levels.** L221 requires the named win test to have the XP strip's level ≥ 1; the test turns levels on and sets the first threshold to 1 (`:51-52,79,84`; V:32, QA:21). Guide L213 does not ask the smoke to turn levels on; it does not, and shot 08 is Victory in 2 turns with no strip (HB:185). That is not doc-vs-code drift.

The s6c smoke (`handoff/steps/tests/s6c-checkpoint/smoke.mjs`, 119 lines) has no `waitForTimeout`. Text and DOM waits are `waitForFunction`. `locator.waitFor` remains only inside `tap`, `press` and `slide` (`:15-16,19`; HB:25, V:24, QA:12). Check 8's `see()` / `big()` runs while each listed sheet is open (`:36` resize, `:44` Add here, `:53` unit name, `:57` Hero editor, `:58` goals, `:60` ability cards, `:61` line-shot panel, `:67` Raider name, `:70` Raider editor, `:74` Add here again, `:76` unit picker, `:82` Rules), then `9 check 8` at `:114` (HB:31, guide L37 / L213, V:24, QA:23). There is no `see()` on the Victory veil (`:111` only takes the shot). Restart / Back are existing play-stage HUD buttons. Check 8 was ok at 390 and 360. Not a product fail.

S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`), identical on the base, the code head, the tip and the merge. Guide L224 / go-line: S0 is required only if a play-stage file changes; it was still run and is unedited (V:22, QA:13). s3, s4a, s6a and s6b are unedited this step. The Empty template stage seed is still 24301. Golden `90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839` is unchanged.

Zero changes under `behaviour-library/**`, `src/`, `tools/`, `src/rules/behaviours/catalogue.ts`, `tools/maker/catalogue.ts`, `package.json` or the lockfile. No export audit (guide L35 / L224, HB:28, V:22, QA:15). `node tools/maker/build.ts` on a clean tree still writes stamp **`ec57342595a1`** (maker and play-stage), unchanged from 6b (QA:15).

The official count command (guide L82) with `s6c-checkpoint`:

```
# Product gate. The first parent of the merge is c89e39b6, not the product
# base 68a67a56. Official command at the code head, the tip, or the merge
# against c89e39b6:
#
#   git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' \
#     ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' \
#     ':!handoff/steps/tests/s6c-checkpoint/**'
#   1 file changed, 119 insertions(+)
#
# The same 119 at the r1 code head or r1 tip against 68a67a56.
# At the merge, the official command against 68a67a56 also counts the three
# 6b docs (4 files, 1680 insertions). Those files are not this step.
# Adding ':!docs/**' at the merge against 68a67a56 gives the official 119.

# Golden tests/tools/golden/demo-parity.json sha256
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839

# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

# Named tests (npm test 1105/0, floor 1102 + N=3):
#   ✔ tactics checkpoint: Empty to a win
#   ✔ checkpoint win comes from the rule
#   ✔ checkpoint project loads clean

# Smokes under google-chrome, at 390 and 360 CSS px:
#   s6c (8807) ×3, one under eight CPU-burn loops:
#     18 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#   s3 (8798):
#     ok 1-9 @390, ok 1-9 @360, then TOUCH SMOKE PASS
#   s4a (8799):
#     ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
#   s6a (8805):
#     18 ok lines @390 and @360, then SMOKE PASS
#   s6b (8806):
#     16 ok lines @390 and @360, then SMOKE PASS

# The s6c smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s6c-checkpoint/smoke.mjs` is 119.
# `node tools/maker/build.ts` writes stamp ec57342595a1.
# S0 is not required this step (no play-stage change). No export audit.
```

## (d) What went wrong, in order, and the fix

**r1.** The checkpoint shipped in one feat commit and green was 1105/0. The official gate was 119. s6c passed three times (one under CPU load), as did S0, s3, s4a, s6a and s6b, including Check 8 on every listed sheet at 390 and 360. The only counted file, `tests/editor/checkpoint.test.ts`, is **119 against guidance cap 90**; HB:190 names it and why (the fight is in the file because the p18 intend helpers are not exported; the D16 walk and dead-foe asserts stayed). No gap fix was needed (HB:11, HB:182). The tip holds only `HANDBACK.md`, the eight screenshots, and `checkpoint.tileproj/` dumped by the smoke.

The guide's smoke list says Hero Attack 5 (L213); Empty `unit_atk` max is 2. The builder documented this at HB:183, slid to 5 and waited for 2 in the UI, and left the scripted `setStat(..., "unit_atk", 5)` as written. That is a stale number in the guide, not a product fail and not a silent omit (V:18, QA:20). Do not raise the slice max.

QA **OK TO MERGE** (QA:3). No must-fix. The merge tree is `3832f731`, as predicted (QA:16, V:36).

HB:3 said `PR: none yet from the branch`, which was true at hand-back and at CoS verify (V:5, V:11, QA:25). No PR existed until after the hand-back.

## (e) Do it right first time

- Start from the step-06b-review-on-main commit `68a67a56`, or from later docs-only main such as `c89e39b6`. Do not start from `dd731459`, which already contains the 6c merge. The floor at the start of 6c was 1102 + N; this merge leaves the floor at 1105.
- 6c is a checkpoint only: a new scripted test and a new smoke. Do not edit `behaviour-library/**`, `catalogue.ts`, `src/`, or `tools/` unless a named gap fix is required, and then name it in § Decisions. Do not import `tools/maker` or `src/editor` into `tools/play-stage`.
- Do not raise the Empty slice `unit_atk` max to honour guide L213's Attack 5. That number is stale wording. The UI already clamps to 2. A later guide typo can say 2.
- If the p18 intend helpers are not exported, inline the same family of `intend` / `choose` calls in the scripted fight and name any cap overrun that causes (guide L82, HB:190). A file may go over its cap if the total stays within 400, but the hand-back must name **every** over-cap file and why. Caps sum is not a second gate.
- Turn levels on in the named win test so the XP strip's level is ≥ 1 (guide L221). The smoke need not turn levels on unless the smoke list asks it to (L213).
- If you edit `tools/play-stage/`, run S0 and keep sha256 `d528795e…`, and run an export audit. Otherwise S0 is not required.
- New waits are `waitForFunction`, not `waitForTimeout`. A smoke that claims Check 8 must collect while each listed sheet is open (guide L37, L213). There is no requirement to `see()` the Victory veil; Restart / Back are existing play-stage HUD buttons.
- Paste the ok lines and `SMOKE PASS` from one solo run in § Smoke (guide L35). A CPU-burn note can follow the paste. The tip commit should hold `HANDBACK.md`, the screenshots, and the dumped `checkpoint.tileproj/`, not raw test logs. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time.
- Measure with the count command (guide L82), with `':!handoff/steps/tests/s6c-checkpoint/**'`. Count insertions plus deletions (checklist L26, BUILD_GUIDE.md L123). 119 is the accepted number for this step. On a merge whose first parent is not the product base, measure against that first parent (or at the code head), and do not treat first-parent docs as 6c lines.
- The phone baseline (guide L226, roadmap L81) is not the builder's gate. CoS/CEO open `checkpoint.tileproj` on the S21 Ultra and the Red Magic 9 Pro.

## (f) Rebuild check

From a clean tree at `c89e39b6021615d6a8fe2d5dff45dfc637ff9c55` (the merge's first parent, docs-only on the product base `68a67a56`), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files.

```
# Product equality vs the merge (current main adds only the QA review):
#   git diff be4f47e1 HEAD -- tests/editor/checkpoint.test.ts \
#     handoff/steps/tests/s6c-checkpoint/smoke.mjs
#   (empty)

# Product gate. The first parent of the merge is c89e39b6, not the product
# base 68a67a56. Official command at the code head, the tip, or the merge
# against c89e39b6:
#
#   git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' \
#     ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' \
#     ':!handoff/steps/tests/s6c-checkpoint/**'
#   1 file changed, 119 insertions(+)
#
# The same 119 at the r1 code head or r1 tip against 68a67a56.
# At the merge, the official command against 68a67a56 also counts the three
# 6b docs (4 files, 1680 insertions). Those files are not this step.
# Adding ':!docs/**' at the merge against 68a67a56 gives the official 119.

# Golden tests/tools/golden/demo-parity.json sha256
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839

# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

# Named tests (npm test 1105/0, floor 1102 + N=3):
#   ✔ tactics checkpoint: Empty to a win
#   ✔ checkpoint win comes from the rule
#   ✔ checkpoint project loads clean

# Smokes under google-chrome, at 390 and 360 CSS px:
#   s6c (8807) ×3, one under eight CPU-burn loops:
#     18 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#   s3 (8798):
#     ok 1-9 @390, ok 1-9 @360, then TOUCH SMOKE PASS
#   s4a (8799):
#     ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
#   s6a (8805):
#     18 ok lines @390 and @360, then SMOKE PASS
#   s6b (8806):
#     16 ok lines @390 and @360, then SMOKE PASS

# The s6c smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s6c-checkpoint/smoke.mjs` is 119.
# `node tools/maker/build.ts` writes stamp ec57342595a1.
# S0 is not required this step (no play-stage change). No export audit.
```

## QA non-blockers carried forward

- **Guide L213 still says Attack 5.** Documented at HB:183; see (c). Fix the guide later; do not change the slice (QA:53, QA:20).
- **Check 8 has no collection on the Victory veil.** Restart / Back are existing play-stage controls. Not a product fail (QA:54, V:24).
- **Chrome / Node.** HB:29 is a Playwright headless shell; CoS and QA re-ran with `/opt/google/chrome/chrome` 156.0.8078.47. HB:4 is Node v22.23.3; `.nvmrc` pins 24 (QA:55, V:30). Do not invent a UA string; HB:29 gives a path, not a UA.
- **Standing 4a/4b/4c/D22 carries** are still open, as after 6b. The scripted test writes `unit_atk` 5 while the maker stores 2 (`setStat` has no range clamp); named at HB:183, and it does not affect the win (QA:56).
- **`catalogue.ts` regen to rev 30** remains its own run, as after 6b.

## Blob check

Each file must have exactly this git blob id at `be4f47e1`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tests/editor/checkpoint.test.ts` | `d06f7b37e151b636bd2072dbbb52ab3cda2b2f77` | 119 |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | `56afa62474a1fcab0b2b66da7fb8a6869bd509ea` | 119 |

## Appendix: full code as merged (step 6c, PR #92)

Both files are new on this step. The text below is `git show be4f47e1:<path>` in full.

### `tests/editor/checkpoint.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, stampNew } from "../../src/editor/project/home.ts";
import { planSave, asWrites } from "../../src/editor/project/save.ts";
import { setThreshold, turnOn } from "../../src/editor/rules/levels.ts";
import { setStageRule } from "../../src/editor/rules/rules.ts";
import { paintCells } from "../../src/editor/stage/paint.ts";
import { addEnemy, addSpawn } from "../../src/editor/stage/place.ts";
import { resizeMap } from "../../src/editor/stage/resize.ts";
import { addAbility } from "../../src/editor/unit/add.ts";
import { setTeam } from "../../src/editor/unit/team.ts";
import { newUnit, setStat } from "../../src/editor/unit/units.ts";
import { readProject } from "../../src/project/load/index.ts";
import { sliceOf } from "../../src/project/slice-of.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { BUNDLED } from "../../tools/maker/catalogue.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { commitWrites, memoryStore } from "../../tools/maker/store.ts";
import { launchTest } from "../../tools/maker/test-launch.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), NOW = "2026-11-22T00:00:00.000Z", PID = "project_01JSKIRM0000000000000000001";
const STAGE = "stage_01JDEM00000000000000000003", MAP = "maps/map_01JDEM00000000000000000002.json", STG = "stages/stage_01JDEM00000000000000000003.json";
const HERO = "unit_01JHERO0000000000000000001", RAIDER = "unit_01JRAID0000000000000000001";
type Obj = Record<string, unknown>;
type Match = ReturnType<typeof createMatch>;
type Sq = { readonly c: number; readonly r: number };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const json = (rel: string): Obj => { const doc = JSON.parse(readFileSync(join(root, rel), "utf8")) as unknown; if (!isObj(doc)) throw new Error(rel); return doc; };
const bagOf = (text: Record<string, string>): Record<string, Obj> => { const parsed = parseProject(text); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const wrote = <T extends { readonly mode: string; readonly bag?: Record<string, Obj> }>(got: T): Record<string, Obj> => { if (got.mode !== "wrote" || got.bag === undefined) throw new Error(got.mode); return got.bag; };
function built(): { readonly stamped: Record<string, string>; readonly next: Record<string, string>; readonly bag: Record<string, Obj> } {
  const stamped = stampNew(walk("data/templates/empty.tileproj"), "Skirmish", PID, NOW), bag0 = bagOf(stamped), stage0 = bag0[STG], map0 = bag0[MAP];
  if (!isObj(stage0) || !isObj(map0)) throw new Error("blank");
  const sized = resizeMap(MAP, map0, [{ path: STG, doc: stage0 }], 6, 6);
  let bag: Record<string, Obj> = { ...bag0, [MAP]: paintCells(sized.map, [0, 1, 2, 4, 5].map((c) => ({ c, r: 2 })), "wall-block") };
  for (const row of sized.stages) bag = { ...bag, [row.path]: row.doc };
  const unit = json("data/templates/unit.json"), ability = json("data/templates/setup.ability.json"), rule = json("data/templates/setup.rule.json");
  bag = { ...bag, [`units/${HERO}.json`]: setStat(setStat(newUnit(unit, HERO, "Hero"), "unit_hp", 20), "unit_atk", 5) };
  bag = setTeam(bag, HERO, true);
  const added = addAbility(bag, ability, HERO, "setup_01JLINE000000000000000001A", "line-shot", BUNDLED); if (added.mode !== "added") throw new Error(added.mode);
  bag = { ...added.bag, [`units/${RAIDER}.json`]: setStat(newUnit(unit, RAIDER, "Raider"), "unit_hp", 2) };
  const stage = bag[STG]; if (!isObj(stage)) throw new Error("stage");
  const foe = addEnemy(addSpawn(stage, { c: 0, r: 0 }), RAIDER, { c: 5, r: 5 }); if (foe === null) throw new Error("enemy");
  bag = { ...bag, [STG]: foe };
  const ruled = wrote(setStageRule(bag, rule, STAGE, "setup_01JWIN0000000000000000001A", "win-condition", "wipe_wins", true, BUNDLED));
  const turned = turnOn(ruled, rule, "setup_01JXP10000000000000000001A", BUNDLED); if (turned.mode !== "wrote" || turned.slice === "") throw new Error(turned.mode);
  const curved = wrote(setThreshold(turned.bag, 0, 1));
  const next: Record<string, string> = {}; for (const [path, doc] of Object.entries(curved)) next[path] = path === "catalogue/slice.json" ? turned.slice : JSON.stringify(doc);
  return { stamped, next, bag: curved };
}
const tick = (m: Match): void => { m.world.clock.advance(m.world.clock.stepMs); m.sync(); };
const key = (at: Sq): string => `${at.c},${at.r}`;
function stepOf(m: Match, from: Sq, foe: Sq): Sq {
  const prev = new Map<string, string>([[key(from), ""]]), q: Sq[] = [from];
  const open = (at: Sq): boolean => at.c >= 0 && at.r >= 0 && at.c < m.world.grid.cols && at.r < m.world.grid.rows && m.world.grid.isOpen(at) && m.world.units.occupantAt(at) === undefined;
  while (q.length > 0) {
    const at = q.shift(); if (at === undefined) break;
    if (inOrthogonalReach(at, foe, 3)) { let cur = key(at); while (prev.get(cur) !== key(from) && prev.get(cur) !== "") cur = prev.get(cur) ?? ""; const [c, r] = cur.split(","); return { c: Number(c), r: Number(r) }; }
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) { const n = { c: at.c + dc, r: at.r + dr }; if (prev.has(key(n)) || !open(n)) continue; prev.set(key(n), key(at)); q.push(n); }
  }
  throw new Error("path");
}
function fight(m: Match, off: boolean): void {
  let leveled = false;
  const mine = (): string => { const id = m.world.units.all().find((u) => u.alive && u.side === m.sides.me)?.id; if (id === undefined) throw new Error("hero"); return id; };
  const foeAt = (): Sq | null => { const u = m.world.units.all().find((u) => u.alive && u.side !== m.sides.me && u.side !== "neutral"); return u === undefined ? null : { c: u.at.c, r: u.at.r }; };
  if (foeAt() === null) throw new Error("foe");
  const shoot = (id: string, at: Sq): void => { if (m.world.phases.battle === "idle") m.intend({ type: "SelectUnit", unitId: id }); const no = m.choose("spell"); if (no !== null) throw new Error(no); m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); };
  for (let n = 0; n < 30 && m.outcome === null && foeAt() !== null; n += 1) {
    const id = mine(), foe = foeAt(); if (foe === null) break;
    const me = m.world.units.get(id); if (me === undefined) throw new Error("hero");
    if (inOrthogonalReach(me.at, foe, 3)) { shoot(id, foe); break; }
    const at = stepOf(m, me.at, foe); m.intend({ type: "SelectUnit", unitId: id }); m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); tick(m);
    if ((m.view().xp?.level ?? 0) >= 1) leveled = true;
    const moved = m.world.units.get(id), left = foeAt(); if (moved !== undefined && left !== null && inOrthogonalReach(moved.at, left, 3)) { shoot(id, left); break; }
    m.endTurn(); for (let i = 0; i < 12; i += 1) tick(m);
  }
  if (off) { assert.equal(foeAt(), null); assert.equal(m.outcome, null); m.endTurn(); assert.equal(m.outcome, null); return; }
  assert.equal(foeAt(), null); assert.equal(m.outcome, "win"); assert.equal(leveled, true); assert.ok(m.view().turns <= 30);
}
const d16 = (bag: Record<string, Obj>): boolean => {
  const slice = bag["catalogue/slice.json"], rows = isObj(slice) && Array.isArray(slice["behaviours"]) ? slice["behaviours"] : [];
  let seen = 0;
  for (const [path, doc] of Object.entries(bag)) {
    if (!path.startsWith("setups/")) continue;
    if (!isObj(doc) || !isObj(doc["answers"]) || typeof doc["behaviourId"] !== "string") return false;
    const hit = rows.find((row) => isObj(row) && row["id"] === doc["behaviourId"]); if (!isObj(hit) || !Array.isArray(hit["knobs"])) return false;
    const knobs = hit["knobs"].flatMap((knob) => isObj(knob) && typeof knob["id"] === "string" && Object.hasOwn(knob, "default") && !(typeof knob["no_default_reason"] === "string" && knob["no_default_reason"] !== "") ? [knob["id"]] : []);
    const answers = doc["answers"]; if (knobs.length === 0 || Object.keys(answers).length !== knobs.length || knobs.some((id) => !Object.hasOwn(answers, id))) return false;
    for (const id of knobs) { const row = answers[id]; if (!(isObj(row) && (JSON.stringify(row) === "{\"source\":\"default\"}" || (row["source"] === "user" && row["rev"] === 1 && Object.hasOwn(row, "value") && Object.keys(row).length === 3)))) return false; }
    seen += 1;
  }
  return seen >= 4;
};
test("tactics checkpoint: Empty to a win", async () => {
  const { stamped, next } = built(), plan = planSave(stamped, next, 1, NOW); if (!plan.ok) throw new Error(plan.error + " " + plan.message + " " + plan.path);
  const store = memoryStore(); assert.equal((await commitWrites(store, prefix(PID), asWrites(stamped))).ok, true);
  let docs: Parameters<typeof createMatch>[0];
  const got = await launchTest({ store, id: PID, stored: stamped, next, rev: 1, from: "project", now: NOW, start(ready) { docs = ready; } });
  assert.equal(got.ok, true); if (docs === undefined) throw new Error("start");
  fight(createMatch(docs, 0), false);
});
test("checkpoint win comes from the rule", () => {
  const { bag } = built(), off = wrote(setStageRule(bag, json("data/templates/setup.rule.json"), STAGE, "setup_01JWIN0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED));
  const load = readProject(off); if (!load.ok || load.project === null) throw new Error("load");
  fight(createMatch(playDocsOf(load.project), 0), true);
});
test("checkpoint project loads clean", () => {
  const { next, bag } = built(), parsed = parseProject(next); if (!parsed.ok) throw new Error(parsed.path + " " + parsed.message);
  const load = readProject(parsed.files); assert.equal(load.ok, true); assert.deepEqual([...load.report], []);
  const slice = bag["catalogue/slice.json"], ids = isObj(slice) && Array.isArray(slice["behaviours"]) ? slice["behaviours"].flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []) : [];
  assert.equal(next["catalogue/slice.json"], sliceOf(BUNDLED, ids)); assert.equal(d16(bag), true);
  assert.deepEqual([...ids].sort(), ["line-shot", "terrain", "unit-roster", "win-condition", "xp-levels"].sort());
});
```

### `handoff/steps/tests/s6c-checkpoint/smoke.mjs` (new)

```js
// Step 6c tactics checkpoint. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6c-checkpoint/smoke.mjs . 8807
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { dirname, extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8807"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s6c-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, "handback/step-06c-checkpoint/r1"); mkdirSync(out, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const quiet = (page) => page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 });
const slide = async (page, sel, value) => { const node = page.locator(sel); await node.waitFor({ timeout: 15000 }); await node.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, value); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = [];
    if (width === 390) rmSync(join(out, "checkpoint.tileproj"), { recursive: true, force: true });
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const see = async () => { tiny.push(...await big()); };
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 400)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await step("1 new empty", async () => {
      await tap(page, "new"); await tap(page, "tpl:empty"); await tap(page, "toname"); await page.locator("[data-name]").fill("Skirmish"); await tap(page, "create");
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Skirmish" && document.body.innerText.includes("Blank"), null, { timeout: 15000 });
    });
    await step("2 resize 6x6", async () => {
      const menu = await page.evaluate(() => document.querySelector('[data-act^="r:menu:map:"]')?.getAttribute("data-act") ?? ""); if (menu === "") throw new Error("map");
      await tap(page, menu); await tap(page, "r:resize"); await waitText(page, "Columns 1"); await see();
      for (let i = 0; i < 5; i += 1) { await tap(page, "r:step:c:1"); await tap(page, "r:step:r:1"); }
      await page.waitForFunction(() => document.body.innerText.includes("Columns 6") && document.body.innerText.includes("Rows 6"), null, { timeout: 15000 });
      await tap(page, "r:apply"); await page.waitForFunction(() => document.querySelector('[data-act="r:apply"]') === null && document.body.innerText.includes("6 × 6"), null, { timeout: 15000 }); await quiet(page);
      await press(page, "Blank", true); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 36 && document.body.innerText.includes("No enemies: free roam.") && document.body.innerText.includes("No player side: Test never reaches an outcome."), null, { timeout: 15000 });
      await shot("02-stage");
    });
    await step("3 wall gap", async () => {
      await tap(page, "s:cell:0,2"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see();
      await tap(page, "s:type:wall-block"); await waitText(page, "Painting Wall block");
      for (const act of ["s:cell:1,2", "s:cell:2,2", "s:cell:4,2", "s:cell:5,2"]) await tap(page, act);
      await tap(page, "s:done");
      await page.waitForFunction(() => document.querySelector(".chip") === null && ["0,2", "1,2", "2,2", "4,2", "5,2"].every((at) => document.querySelector(`[data-act="s:cell:${at}"]`)?.getAttribute("data-tile") === "wall-block") && document.querySelector('[data-act="s:cell:3,2"]')?.getAttribute("data-tile") !== "wall-block", null, { timeout: 15000 });
      await shot("03-walls");
    });
    await step("4 hero", async () => {
      await tap(page, "s:back"); await page.waitForFunction(() => document.querySelector('[data-act="u:add"]') !== null, null, { timeout: 15000 });
      await tap(page, "u:add"); await page.locator("[data-unit]").fill("Hero"); await see(); await tap(page, "u:create");
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Hero", null, { timeout: 15000 });
      await slide(page, '[data-knob="unit_hp"]', "20"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "20", null, { timeout: 15000 }); await quiet(page);
      await slide(page, '[data-knob="unit_atk"]', "5"); await page.waitForFunction(() => document.querySelector('[data-val="unit_atk"]')?.textContent === "2", null, { timeout: 15000 }); await quiet(page);
      await see(); await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 }); await quiet(page);
      await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-sheet="goals"]') !== null, null, { timeout: 15000 }); await see();
      const bin = await page.evaluate(() => document.querySelector('[data-goal="Attack"]')?.getAttribute("data-act") ?? ""); if (bin === "") throw new Error("bin"); await tap(page, bin);
      await page.waitForFunction(() => document.querySelector('[data-sheet="cards"]') !== null, null, { timeout: 15000 }); await see(); await tap(page, "g:add:line-shot");
      await page.waitForFunction(() => document.querySelector('[data-act="a:shut"]') !== null && document.querySelector('[data-knob="range"]')?.value === "3" && document.querySelector('[data-knob="damage"]')?.value === "2", null, { timeout: 15000 }); await see();
      await tap(page, "a:shut"); await page.waitForFunction(() => document.body.innerText.includes("Line Shot") && document.querySelector('[aria-label="On your team"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 });
      await page.locator('[aria-label="On your team"]').scrollIntoViewIfNeeded(); await shot("04-hero");
      await page.locator('[data-role="card"]').last().scrollIntoViewIfNeeded(); await shot("04b-ability");
    });
    await step("5 raider", async () => {
      await tap(page, "u:back"); await quiet(page); await tap(page, "u:add"); await page.locator("[data-unit]").fill("Raider"); await see(); await tap(page, "u:create");
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Raider", null, { timeout: 15000 });
      await slide(page, '[data-knob="unit_hp"]', "2"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "2" && document.querySelector('[data-act="u:reset:unit_hp"]') !== null && document.querySelector('[aria-label="On your team"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
      await see(); await shot("05-raider"); await tap(page, "u:back"); await quiet(page);
    });
    await step("6 place", async () => {
      await press(page, "Blank", true); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 36, null, { timeout: 15000 });
      await tap(page, "s:cell:0,0"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see(); await tap(page, "s:place:spawn"); await quiet(page);
      await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("aria-label") ?? "").includes("Hero"), null, { timeout: 15000 });
      await tap(page, "s:cell:5,5"); await tap(page, "s:place:enemy"); await page.waitForFunction(() => [...document.querySelectorAll(".sheet h2")].some((n) => n.textContent === "Pick a unit"), null, { timeout: 15000 }); await see();
      const foe = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].find((el) => el.getAttribute("data-act")?.startsWith("s:unit:") && el.textContent === "Raider")?.getAttribute("data-act") ?? ""); if (foe === "") throw new Error("raider");
      await tap(page, foe); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:5,5"]')?.getAttribute("aria-label") ?? "").includes("Raider"), null, { timeout: 15000 }); await shot("06-placed");
    });
    await step("7 rules on", async () => {
      await tap(page, "r:open"); await page.waitForFunction(() => document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "true" && document.body.innerText.includes("Win by defeating every enemy") && document.body.innerText.includes("Default rule"), null, { timeout: 15000 });
      await see(); await shot("07-rules"); await tap(page, "r:close"); await page.waitForFunction(() => document.querySelector('[data-sheet="rules"]') === null, null, { timeout: 15000 });
    });
    await step("8 victory", async () => {
      await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined && document.querySelector("#veil") !== null, null, { timeout: 15000 });
      await page.evaluate(() => { window.__snap = () => { const m = window.__play, all = m.world.units.all(), me = all.find((u) => u.alive && u.side === m.sides.me), foe = all.find((u) => u.alive && u.side !== m.sides.me && u.side !== "neutral"), xp = m.view().xp; return { id: me ? me.id : "", at: me ? { c: me.at.c, r: me.at.r } : null, foe: foe ? { c: foe.at.c, r: foe.at.r } : null, phase: m.world.phases.battle, outcome: m.outcome, level: xp ? xp.level : 0, turns: m.view().turns, side: m.side, mine: m.sides.me }; }; });
      let leveled = false;
      const read = () => page.evaluate(() => window.__snap());
      const flush = () => page.evaluate(() => { const m = window.__play; for (let i = 0; i < 40; i += 1) { m.world.clock.advance(400); m.sync(); } window.__hud.render(m.view()); });
      const shoot = async (s) => {
        if (s.phase === "idle") { await page.evaluate((id) => window.__play.feed({ type: "SelectUnit", unitId: id }), s.id); await page.waitForFunction((id) => window.__play.selected === id && window.__play.world.phases.battle === "unitSelected", s.id, { timeout: 15000 }); }
        const no = await page.evaluate(() => window.__play.choose("spell")); if (no !== null) throw new Error(String(no));
        await page.waitForFunction(() => window.__play.world.phases.battle === "targeting", null, { timeout: 15000 });
        await page.evaluate((at) => window.__play.feed({ type: "TargetCell", at }), s.foe); await flush();
        await page.waitForFunction(() => window.__play.outcome === "win" || window.__play.world.phases.battle === "idle", null, { timeout: 15000 });
      };
      for (let n = 0; n < 30; n += 1) {
        const s = await read(); if (s.outcome === "win") break; if (s.foe === null || s.at === null || s.id === "") throw new Error(JSON.stringify(s)); if (s.level >= 1) leveled = true;
        const can = (a, b) => a !== null && b !== null && (a.c === b.c || a.r === b.r) && Math.abs(a.c - b.c) + Math.abs(a.r - b.r) <= 3 && Math.abs(a.c - b.c) + Math.abs(a.r - b.r) >= 1;
        if (can(s.at, s.foe)) { await shoot(s); break; }
        const stepAt = await page.evaluate(({ id, foe }) => { const m = window.__play, from = m.world.units.get(id).at, key = (c, r) => c + "," + r, open = (c, r) => c >= 0 && r >= 0 && c < m.world.grid.cols && r < m.world.grid.rows && m.world.grid.isOpen({ c, r }) && m.world.units.occupantAt({ c, r }) === undefined, prev = new Map([[key(from.c, from.r), ""]]), q = [{ c: from.c, r: from.r }]; while (q.length) { const at = q.shift(), d = Math.abs(at.c - foe.c) + Math.abs(at.r - foe.r); if ((at.c === foe.c || at.r === foe.r) && d >= 1 && d <= 3) { let cur = key(at.c, at.r); while (prev.get(cur) !== key(from.c, from.r) && prev.get(cur) !== "") cur = prev.get(cur); const [c, r] = cur.split(","); return { c: Number(c), r: Number(r) }; } for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n2 = { c: at.c + dc, r: at.r + dr }, k = key(n2.c, n2.r); if (prev.has(k) || !open(n2.c, n2.r)) continue; prev.set(k, key(at.c, at.r)); q.push(n2); } } return null; }, { id: s.id, foe: s.foe });
        if (stepAt === null) throw new Error("path " + JSON.stringify(s));
        await page.evaluate((p) => { const m = window.__play; if (m.world.phases.battle === "idle") m.feed({ type: "SelectUnit", unitId: p.id }); m.feed({ type: "TargetCell", at: p.at }); }, { id: s.id, at: stepAt }); await flush();
        await page.waitForFunction((at) => { const m = window.__play, me = m.world.units.all().find((u) => u.side === m.sides.me); return m.walk === null && me !== undefined && me.at.c === at.c && me.at.r === at.r && m.world.phases.battle === "actMenu"; }, stepAt, { timeout: 15000 });
        const now = await read(); if (now.level >= 1) leveled = true; if (can(now.at, now.foe)) { await shoot(now); break; }
        const turns = now.turns; await page.evaluate(() => window.__play.endTurn()); await flush();
        await page.waitForFunction((t0) => { const m = window.__play; return m.side === m.sides.me && m.world.phases.battle === "idle" && m.walk === null && m.view().turns === t0 + 1; }, turns, { timeout: 15000 });
      }
      const end = await read(); if (end.outcome !== "win" || end.turns > 30) throw new Error(JSON.stringify({ ...end, leveled }));
      await page.evaluate(() => window.__hud.render(window.__play.view()));
      await page.waitForFunction(() => document.querySelector("#veil h2")?.textContent === "Victory", null, { timeout: 15000 }); await shot("08-victory");
      if (width === 390) { const files = await page.evaluate(() => window.__read()); for (const [rel, text] of Object.entries(files)) { const file = join(out, "checkpoint.tileproj", rel); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); } }
    });
    check(`9 check 8 @${width}`, tiny.length === 0 && errs.length === 0, tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```
