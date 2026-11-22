# Rebuild record: step 6b, level curve editor and an XP strip in Test

Original brief: [`docs/maker/steps/step-06-levels-win-rules.md`](../maker/steps/step-06-levels-win-rules.md) on the merge (r2, blob `c846699d`, sha256 `a80602396f4839157d1009166e84bd629c61c2c8ba5a9a1326f73f3fb3183192`, 248 lines): the 6b sections (L150-194), Done when (L188-194), the count command (L82), Check 8 (L37), and the Levels / XP-strip behaviour (L152-160). The same blob is on current main, the product base, the tip and the code head. Do [`step-06a.md`](step-06a.md) first. This file records exactly what shipped.

Sources: PR #91 and branch `step/step-06b-levels-r1-chatA` (tip `40dba5e6`, code head `62963cea`); `handback/step-06b-levels/r1/HANDBACK.md` at `40dba5e6` and on the merge (HB, blob `dde52dea`, 187 lines); Chief Of Staff verify report `/workspace/share/step-06b-verify/report.md` (V, sha256 `46fbd93073c16729bc8dd95a7aa738da257d39d3095104c6dd18d48eac7126a1`, hash-object `24032d6dff8e894778dc6b7a6b72d4189886c047`, 36 lines). `docs/qa/step-06b-review.md` (QA, git hash-object `6a31f507`, 73 lines, on main `68a67a56`): **OK TO MERGE**, no must-fix (QA:3, QA:72-73). Line numbers are at the commit named. Code line cites are at merge `be8ce821` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `0ac31c878e99790447eaa59989e2c26d2cd7d199`, 6a QA review on main, 2026-11-21 23:05 (UK time). Floor **1093** tests (guide L189: 6a's final count + N). After this merge the floor is **1102**. Current `origin/main` at merge time was `f8bbd963a73e11aa1f6ca2e8c170575dae901fc2` (2026-11-21 23:19 UK time), docs-only on top of the base: `docs/rebuild/step-06a.md`, `docs/qa/rebuild-step-06a-review.md` and `docs/qa/rebuild-step-06a-recheck.md` |
| r1 commits | `62963cea27954cd108713c3b48e9b4c030de05e3` feat(maker): level curve editor and an XP strip in Test (code head, tree `25c6542551c0625ca8b943845d1ea8f459f18881`, 2026-11-22 05:40 UK time), `40dba5e60760bffd0085a24d323059d4afc3ab20` docs(handback): step-06b-levels r1 (tree `9bb6a11c7ecaed8eae2bd8527003423cab08fe79`, 2026-11-22 06:03 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the hand-back folder only (7 files, 187 insertions): `HANDBACK.md` and six pngs |
| r1 verdict | QA **OK TO MERGE** (QA:3). No must-fix, no rework round (QA:72-73). Green 1102/0, G7 310, s6b ×3 (one under CPU load; V:23, HB:43), S0, s3, s4a and s6a all pass (V:23, QA:8-14). Non-blockers (QA:67-70) are recorded below |
| Merge | PR #91 "Step 6b: levels, Level curve editor, XP strip", merge commit `be8ce821a3fcb66230eef179bc10ab0c45e7bba4`, 2026-11-22 07:29 (UK time). Tree `21adb8da4c99a834e62bff3f277b3647646001b9` (the same tree CoS and QA predicted against `f8bbd963`; V, QA:16). First parent `f8bbd963` (main at merge, not the product base), second parent `40dba5e6` |
| After the merge | main is `68a67a56787dcf439554a267a1af987479c5f745`, 2026-11-22 07:29 (UK time), which adds only `docs/qa/step-06b-review.md`. QA postmerge: Postmerge PASS (QA): merge be8ce821, 1102/0, pins 5/5, smoke 0 failed. |
| Tests | 1093 + N=9 (`turn on levels re-cuts the slice`, `threshold edit stores the whole list`, `list length follows levels`, `turn off detaches and keeps the file`, `wired level knobs change the adapter`, `levels reach Test`, `a move pays XP in Test`, `custom curve plays in Test`, `no levels, no strip`) = **1102 pass / 0 fail**. Floor after this merge is **1102** (HB:26, V:19, QA:8) |

## (b) Files

From `git diff --name-status 0ac31c87..40dba5e6 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base (which is what the 6b step added). The same product files are on the merge tree `21adb8da`. The three 6a docs on the merge are from first parent `f8bbd963`, not from this branch.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `src/editor/rules/levels.ts` | new | 62 (cap 70) | Pure `levelsOf`, `turnOn`, `turnOff`, `setLevels`, `setThreshold`, `resetCurve`, `setXpMove`, `curveOf` (guide L165) |
| `tools/maker/levels.ts` | new | 74 (cap 90) | Levels section card and the Level curve editor (guide L166) |
| `tools/maker/project.ts` | edited | 4 (2+/2−, cap 4) | Mount the Levels section (guide L167) |
| `tools/maker/home.ts` | edited | 17 (12+/5−, cap 8) | Route `l:` acts and level Undo (guide L168). Over the file cap, inside the allowed +10 (guide L82); named in HB:184 |
| `src/rules/behaviours/wired.ts` | edited | 1 (cap 1) | `"xp-levels": ["levels", "thresholds", "xp_move"]` (guide L169) |
| `tools/play-stage/project.ts` | edited | 13 (11+/2−, cap 8) | `levelsOf` via `XP_LEVELS.install` / `ruleOf`; omits `PlayDocs.levels` when the source is `"default"` (guide L170). Over the file cap; named in HB:184 |
| `tools/play-stage/load.ts` | edited | 5 (3+/2−, cap 3) | `PlayDocs.levels?: LevelSetup`; pass it in `docsToInput` (guide L171). Over the file cap; named in HB:184 |
| `tools/play-stage/match.ts` + `hud.ts` | edited | 11 (3+/1− + 5+/2−, cap 16) | `view().xp` and the XP strip (guide L172) |
| `tools/play-stage/page.ts` | edited | 4 (2+/2−) | Extra file, not in the 6b Build table: shorten the board by `XP_H` when the strip is shown (HB:181, HB:184) |
| `tests/editor/levels.test.ts` | new | 68 (cap 65) | Five of the nine named tests (guide L173, L190). Over the file cap; named in HB:184 |
| `tests/tools/play-levels.test.ts` | new | 48 (cap 45) | The other four named tests (guide L174, L191). Over the file cap; named in HB:184 |
| `tests/editor/maker-law.test.ts` | edited | 3 (cap 4) | Plant: no threshold or level literal from the catalogue in the two product files (guide L175) |
| `handoff/steps/tests/s6b-levels/smoke.mjs` | new | 93 (cap 130) | Browser smoke, own cap, outside the 400 (guide L176). Measures check 8 with the Level curve editor open and scrolled to Level 9 |

No other product file. Nothing under `tests/tools/golden/`, `behaviour-library/**`, `src/rules/behaviours/catalogue.ts`, `tools/maker/catalogue.ts`, `package.json` or `package-lock.json`. No 6c checkpoint work. No new CSS.

## (c) Key code and git commands

The project screen gains a **Levels** section under Units (`tools/maker/levels.ts:20-27`). Off is "Levels: Off" and **Turn on levels** (`:25`); On is "Levels: <n> · <total> XP to the top" and opens the Level curve editor (`:26`). The editor is a full sheet (Back, "Levels"): Number of levels 1-9 from the slice, one threshold row per level with a 1-99 slider and the value in words, **Reset curve**, XP per move 0-5, ▶ Test, and **Turn off levels**. `setLevels` (`src/editor/rules/levels.ts:51-56`) keeps list length = n and fills new rows from the slice default list. `resetCurve` (`:61`) writes `{source:"default"}`. `turnOff` (`:50`) detaches the setup from `project.rules` and keeps the file (D11). P < B shows the 5c Update offer and writes nothing; P > B shows the newer note (HB:182). `WIRED` gains `"xp-levels": ["levels", "thresholds", "xp_move"]` (`src/rules/behaviours/wired.ts:8`).

Test plays the attached setup. `levelsOf` (`tools/play-stage/project.ts:37-44`) installs `XP_LEVELS` on the `ruleOf` setup and omits `PlayDocs.levels` when the source is `"default"` (so Turn off, with the file still in the slice, has no strip; HB:180):

```ts
function levelsOf(store: ProjectStore, stage: Obj): PlayOut["levels"] {
  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "xp-levels"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
  if (hit.source === "default") return undefined;
  if (!isObj(setup)) throw new Error("play: xp-levels");
  const rules = XP_LEVELS.install({ get: (key) => knob(setup, store.slice, "xp-levels", key), unsupported(key, why) { throw new Error(why === undefined ? `play: xp-levels ${key}` : `play: xp-levels ${key} ${why}`); } });
  if (rules === null) throw new Error("play: xp-levels");
  return { rules, pools: {} };
}
```

`PlayDocs` gains `levels?: LevelSetup` (`tools/play-stage/load.ts:23`). `docsToInput` passes it only when present (`load.ts:27`). No pay or level-up logic is reimplemented in play-stage or the maker. The strip is display-only. `createMatch` reads `levels.state()` for level and xp, and `levels.rules.thresholds[level]` for the next cost, because `state()` has no need (`tools/play-stage/match.ts:133-134`; HB:180):

```ts
      const levels = play.world.levels, bars = levels === null ? null : levels.state().bars, bar = bars?.find((row) => row.id === me), at = levels === null ? undefined : levels.rules.thresholds[bar?.level ?? 0];
      const xp = levels === null ? null : { level: bar?.level ?? 0, now: bar?.xp ?? 0, need: typeof at === "number" ? at : 0, top: bar !== undefined && bar.level >= levels.rules.thresholds.length || typeof at !== "number" };
```

`hud.ts:34` renders "Level <k> · <xp>/<need> XP", or "Level <n> · Top level" when `top` is true. The board shortens by `XP_H` (28) only when `view().xp !== null` (`tools/play-stage/page.ts:54`; HB:181). The bundled demo never had the behaviour, so it has no strip (`no levels, no strip`).

The nine named tests are `turn on levels re-cuts the slice` (`tests/editor/levels.test.ts:25-35`), `threshold edit stores the whole list` (`:36-41`), `list length follows levels` (`:42-51`), `turn off detaches and keeps the file` (`:52-57`), `wired level knobs change the adapter` (`:58-68`), `levels reach Test` (`tests/tools/play-levels.test.ts:33-38`), `a move pays XP in Test` (`:39-42`), `custom curve plays in Test` (`:43-47`) and `no levels, no strip` (`:48`).

The Empty `play: army` adapter guard is unchanged in text and still throws (`tools/play-stage/project.ts:50-51`; it moved down from :41-42 because `levelsOf` was inserted above `playDocsOf`):

```ts
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
```

The s6b smoke (`handoff/steps/tests/s6b-levels/smoke.mjs`, 93 lines) has no `waitForTimeout`. `tap()`, `press()` and `slide()` (L16-17, L24) use `locator.waitFor` only, and so does the End turn tap (L68). Every other wait is `page.waitForFunction` (HB:37). Check 8 (`8 targets @${width}`, L88) collects via `big()` once, at L42, after the editor is open and `[data-row="8"]` (Level 9) is scrolled into the sheet (L39-41) (guide L37, L180; HB:43, QA:23, QA:68).

S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`), identical on the base, the code head, the tip and the merge. s3, s4a and s6a are unedited this step. The Empty template stage seed is still 24301. Golden `90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839` is unchanged.

Zero changes under `behaviour-library/**`, `src/rules/behaviours/catalogue.ts` or `tools/maker/catalogue.ts`. The export audit (HB:165-166, QA:21, V) builds play-stage and maker at forty zeros: stamp `ec57342595a1`. `rg` of `tools/maker`, `src/editor`, `catalogue.json.js` and `behaviours.json` under the play-stage trees hits only the existing comment in `src/rules/behaviours/catalogue.js` (rev 26). `catalogue.json.js` ships only under the maker stamp.

## (d) What went wrong, in order, and the fix

**r1.** The product shipped in one feat commit and green was 1102/0. The official gate was 294 + 16 = 310. s6b passed three times (one under CPU load), as did S0, s3, s4a and s6a, including check 8 with the Level curve editor open and scrolled to Level 9. Every over-cap file, and the extra file `page.ts`, is named in HB:184. The tip holds only `HANDBACK.md` and the six screenshots. A helper blocker landed in the code head, before the tip: Turn off still called `XP_LEVELS.install` because the slice still contained `xp-levels`, so Test would show the catalogue curve. `levelsOf` now returns undefined when `ruleOf` source is `"default"` and does not call `install` (`tools/play-stage/project.ts:39`; HB:171, HB:180).

QA **OK TO MERGE** (QA:3). No must-fix. The merge tree is `21adb8da`, as predicted (QA:16, V).

HB:3 said `PR: none yet from the branch`, which was true at hand-back and at CoS verify (no PR existed until after the hand-back).

## (e) Do it right first time

- Start from the step-06a-review-on-main commit `0ac31c87`, or from later main if it is still docs-only on that commit. The floor at the start of 6b is 1093 + N; this merge leaves the floor at 1102.
- Put the curve model in `src/editor/rules/levels.ts` and the Levels section / editor in `tools/maker/levels.ts`. Do not edit `behaviour-library/**` or `catalogue.ts`. Do not import `tools/maker` or `src/editor` into `tools/play-stage`. Do not add XP, level or threshold rule in play-stage or the maker beyond `XP_LEVELS.install` and reading `levels.state()` (guide L183). A display read of `levels.rules.thresholds[level]` for the strip's "need" is not a pay / level-up rule (HB:180).
- `levelsOf` must return undefined when `ruleOf` source is `"default"`, even if the slice still lists `xp-levels`. That is how Turn off (D11: the file stays) leaves Test with no strip. It is unlike 6a's `winOf`, which still plays through `installOne` on a default source.
- Leave the `play: army` throw in the adapter as a guard for old Empty projects.
- If you edit `tools/play-stage/`, run S0 and keep sha256 `d528795e…`. Run an export audit: the maker catalogue must not appear in the play-stage or APK output.
- A file may go over its cap if the total stays within 400, but the hand-back must name **every** over-cap file and why (guide L82). `home.ts` may pass its cap by up to 10. Extra files must also be named.
- A smoke that claims “every target is 48 px” must measure the 6b Check 8 state: the Levels section and the open Level curve editor scrolled to its last row (guide L37, L180). New waits are `waitForFunction`, not `waitForTimeout`.
- Paste the ok lines and `SMOKE PASS` from one solo run in § Smoke (guide L35). A CPU-burn note can follow the paste. The tip commit should hold `HANDBACK.md` and the screenshots, not raw test logs. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time.
- Measure with the count command (guide L82), with `':!handoff/steps/tests/s6b-levels/**'`. Count insertions plus deletions (checklist L26, `BUILD_GUIDE.md` L123). 310 is the accepted number for this step. On a merge whose first parent is not the product base, measure against that first parent (or at the code head), and do not treat first-parent docs as 6b lines.

## (f) Rebuild check

From a clean tree at `f8bbd963a73e11aa1f6ca2e8c170575dae901fc2` (main at the merge, which already has the 6a rebuild record and its QA docs), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Measuring against the product base `0ac31c87` is also fine if you do not add those docs files; the official number below is against the first parent, which matches the code head.

```bash
# Product gate. The first parent of the merge is f8bbd963, not the product
# base 0ac31c87. Official command at the code head, the tip, or the merge
# against f8bbd963:
git diff --shortstat f8bbd963..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s6b-levels/**'
#   13 files changed, 294 insertions(+), 16 deletions(-)

git diff --shortstat 0ac31c87..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s6b-levels/**'
#   at the r1 code head or r1 tip:
#   13 files changed, 294 insertions(+), 16 deletions(-)
#   at the merge, this command also counts the three 6a docs
#   (16 files, 6843 insertions, 16 deletions). Those files are not this step.
#   Adding ':!docs/**' at the merge against 0ac31c87 gives the official 310.

sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --stat f8bbd963..HEAD -- tests/tools/golden/   # empty

sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

git diff --stat f8bbd963..HEAD -- behaviour-library/ src/rules/behaviours/catalogue.ts tools/maker/catalogue.ts   # empty

npm ci && npm run green   # 1102 pass, 0 fail. Includes:
#   ✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
#   ✔ turn on levels re-cuts the slice
#   ✔ threshold edit stores the whole list
#   ✔ list length follows levels
#   ✔ turn off detaches and keeps the file
#   ✔ wired level knobs change the adapter
#   ✔ levels reach Test
#   ✔ a move pays XP in Test
#   ✔ custom curve plays in Test
#   ✔ no levels, no strip

# Smokes under google-chrome, at 390 and 360 CSS px:
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s6b-levels/smoke.mjs . 8806
#   16 ok lines @390 and @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798
#   ok 1-9 @390, ok 1-9 @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805
#   18 ok lines @390 and @360, then SMOKE PASS

# The s6b smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s6b-levels/smoke.mjs` is 93.
# `node tools/maker/build.ts` writes stamp ec57342595a1.
# S0 is required (play-stage changed). Run the export audit in HB:159-168.
```

Against the merge tree: on your rebuild branch, `git diff be8ce821 HEAD -- src/editor/rules/levels.ts tools/maker/levels.ts tests/editor/levels.test.ts tests/tools/play-levels.test.ts handoff/steps/tests/s6b-levels/smoke.mjs src/rules/behaviours/wired.ts tools/maker/home.ts tools/maker/project.ts tools/play-stage/hud.ts tools/play-stage/load.ts tools/play-stage/match.ts tools/play-stage/page.ts tools/play-stage/project.ts tests/editor/maker-law.test.ts` must be empty. The blob table below lists the exact git blob id each 6b file must have at `be8ce821`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id. Those product blobs must also match code head `62963cea`.

## QA non-blockers carried forward

From QA:67-70. None of these blocked the PR.

1. **Check 8 has one collection point.** `big()` runs once at `smoke.mjs:42`, with the editor open and Level 9 scrolled into the sheet. Guide L37 names one 6b state: the Levels section and the open Level curve editor scrolled to its last row. There is no second `big()` while the Levels card is unscrimmed. The Off-state **Turn on levels** control is not collected, because it cannot be on screen while the editor is open; it is already a 48 px `.btn` (QA:68, QA:23, HB:43). Not a product fail.
2. **Chrome / Node.** HB:41 is a Playwright headless shell. QA and CoS re-ran with `/opt/google/chrome/chrome` 156.0.8078.47. HB:4 is Node v22.23.3; `.nvmrc` pins 24 (QA:69).
3. **4a/4b/4c carries** are still open, including uncapped stage undo, the maker-law plant with no `try/finally`, talk `createdAt`, session-only unused delete, and Path and Dirt hidden (QA:70).
4. **Empty `play: army` guard.** Correctly left in place at `tools/play-stage/project.ts:50-51` (D26). After 6a it sat at :41-42; `levelsOf` was inserted above `playDocsOf`, so the line numbers moved. The new Empty template is playable; old Empty projects still hit the throw and see the plain sentence. **D22** effect ids and the `catalogue.ts` regen to rev 30 remain their own runs (QA:70).

## Blob check

Each file must have exactly this git blob id at `be8ce821`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/editor/rules/levels.ts` | `a7698db2c098eb956eaf967dec2071c81d563ce1` | 62 |
| `tools/maker/levels.ts` | `4b169cf03f928a4954f7815b24c521a60a6d5268` | 74 |
| `tests/editor/levels.test.ts` | `f3b827ec4476c726724ebab07923da580fc8186c` | 68 |
| `tests/tools/play-levels.test.ts` | `b1178ef1a211fcb96c094ed713c089fd5b26aeb2` | 48 |
| `handoff/steps/tests/s6b-levels/smoke.mjs` | `7b721ce868fc4623edee2f9df2712db4af435210` | 93 |
| `src/rules/behaviours/wired.ts` | `2685879f5e12bfc8af8194292f0c80cdc748b966` | 9 |
| `tools/maker/home.ts` | `fe0ae9c0331d3c0b609b9bc5fb4a7afbe18dc044` | 158 |
| `tools/maker/project.ts` | `434ea22941ca8d53993f47574f1ee644597effb6` | 10 |
| `tools/play-stage/hud.ts` | `1f83505cbe41fbecbc350b0e425d0cd63ca2f35a` | 40 |
| `tools/play-stage/load.ts` | `b46f4b3b5f8602d7fbf8c16840dabb663e3ae62f` | 28 |
| `tools/play-stage/match.ts` | `b99b6bb74ac93b1ee51e521c8939ff33e358ff4c` | 173 |
| `tools/play-stage/page.ts` | `6b7a56f1f093b16c9ba2dfb7c97d1253ee6fce06` | 80 |
| `tools/play-stage/project.ts` | `2d73625b14295bdc10705edfeebed3dad6706de1` | 89 |
| `tests/editor/maker-law.test.ts` | `9c880f675c3ac645e08d47635a30d49b939c95c9` | 42 |

## Appendix: full code as merged (step 6b, PR #91)

New files are given in full. Edited files are given as the exact diff from `0ac31c87` to `be8ce821`, then in full as merged. Copy them byte for byte; the blob table checks you did. Product, tests and the smoke are identical to code head `62963cea`. The merge tree also carries `docs/rebuild/step-06a.md`, `docs/qa/rebuild-step-06a-review.md` and `docs/qa/rebuild-step-06a-recheck.md` from first parent `f8bbd963`; those files are not 6b product files and are not in this appendix. The hand-back is at the tip (and on the merge).

### `src/editor/rules/levels.ts` (new)

```ts
import { sliceDoc, sliceOf, type CatalogueDoc } from "../../project/slice-of.ts";
import { addCase, catalogueRev } from "../unit/add.ts";
import { setAnswer } from "../unit/panel.ts";
type Obj = Record<string, unknown>;
type Bag = Record<string, Obj>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const behaviours = (doc: Obj): Obj[] => list(doc["behaviours"]).filter(isObj);
const ints = (v: unknown): number[] => (Array.isArray(v) ? v.filter((n): n is number => typeof n === "number" && Number.isInteger(n)) : []);
const copyBag = (files: Bag): Bag => { const bag: Bag = {}; for (const [path, doc] of Object.entries(files)) if (isObj(doc)) bag[path] = doc; return bag; };
export type LevelWrite = { readonly mode: "wrote"; readonly bag: Bag; readonly slice: string } | { readonly mode: "older" | "newer" | "missing" };
const held = (files: Bag): { readonly root: Obj; readonly project: Obj } | null => { const root = files["project.json"]; return isObj(root) && isObj(root["project"]) ? { root, project: root["project"] } : null; };
const spec = (files: Bag, id: string): Obj | null => { const slice = files["catalogue/slice.json"]; if (!isObj(slice)) return null; const row = behaviours(slice).find((item) => item["id"] === "xp-levels"); return row === undefined ? null : list(row["knobs"]).filter(isObj).find((item) => item["id"] === id) ?? null; };
const boxOf = (knob: Obj): { readonly min: number; readonly max: number } | null => { const min = knob["min"], max = knob["max"]; return typeof min === "number" && typeof max === "number" && Number.isInteger(min) && Number.isInteger(max) && min <= max ? { min, max } : null; };
const clamp = (n: number, min: number, max: number): number => n < min ? min : n > max ? max : n;
const answersOf = (setup: Obj): Obj => (isObj(setup["answers"]) ? setup["answers"] : { source: "unset" });
const readNum = (answers: Obj, knob: Obj): number | null => { const id = knob["id"]; if (typeof id !== "string") return null; const row = answers[id], raw = isObj(row) && row["source"] !== "default" && typeof row["value"] === "number" ? row["value"] : knob["default"]; return typeof raw === "number" && Number.isInteger(raw) ? raw : null; };
const readList = (answers: Obj, knob: Obj): number[] | null => { const row = answers["thresholds"], def = ints(knob["default"]); if (def.length === 0) return null; if (!(isObj(row) && row["source"] !== "default")) return def; if (!Array.isArray(row["value"])) return null; const got = ints(row["value"]); return got.length === row["value"].length ? got : null; };
export function levelsOf(files: Bag): Obj | null { const root = held(files); if (root === null) return null; for (const id of list(root.project["rules"])) { if (typeof id !== "string") continue; const doc = files[`setups/${id}.json`]; if (isObj(doc) && doc["behaviourId"] === "xp-levels") return doc; } return null; }
const kept = (files: Bag): Obj | null => { for (const [path, doc] of Object.entries(files)) if (path.startsWith("setups/") && isObj(doc) && doc["behaviourId"] === "xp-levels") return doc; return null; };
export type Curve = { readonly n: number; readonly total: number; readonly move: number; readonly rows: readonly number[]; readonly levelMin: number; readonly levelMax: number; readonly rowMin: number; readonly rowMax: number; readonly moveMin: number; readonly moveMax: number; readonly levelLabel: string; readonly moveLabel: string };
export function curveOf(files: Bag): Curve | null {
  const setup = levelsOf(files); if (setup === null) return null;
  const levels = spec(files, "levels"), thresholds = spec(files, "thresholds"), xp = spec(files, "xp_move"); if (levels === null || thresholds === null || xp === null) return null;
  const lb = boxOf(levels), rb = boxOf(thresholds), mb = boxOf(xp); if (lb === null || rb === null || mb === null) return null;
  const n0 = readNum(answersOf(setup), levels), full = readList(answersOf(setup), thresholds), move = readNum(answersOf(setup), xp); if (n0 === null || full === null || move === null) return null;
  const defaults = ints(thresholds["default"]), n = clamp(n0, lb.min, lb.max), rows: number[] = [];
  for (let i = 0; i < n; i += 1) { const raw = full[i] ?? defaults[i]; if (typeof raw !== "number") return null; rows.push(clamp(raw, rb.min, rb.max)); }
  if (typeof levels["label"] !== "string" || typeof xp["label"] !== "string") return null;
  return { n, total: rows.reduce((sum, v) => sum + v, 0), move: clamp(move, mb.min, mb.max), rows, levelMin: lb.min, levelMax: lb.max, rowMin: rb.min, rowMax: rb.max, moveMin: mb.min, moveMax: mb.max, levelLabel: levels["label"], moveLabel: xp["label"] };
}
export const curveTotal = (files: Bag): number | null => { const got = curveOf(files); return got === null ? null : got.total; };
const blank = (row: Obj): Obj => { const answers: Obj = {}; for (const knob of list(row["knobs"]).filter(isObj)) { if (typeof knob["id"] !== "string" || !Object.hasOwn(knob, "default")) continue; const reason = knob["no_default_reason"]; if (typeof reason === "string" && reason !== "") continue; answers[knob["id"]] = { source: "default" }; } return answers; };
const write = (files: Bag, answers: Obj): LevelWrite => { const setup = levelsOf(files); if (setup === null || typeof setup["id"] !== "string") return { mode: "missing" }; const bag = copyBag(files); bag[`setups/${setup["id"]}.json`] = { ...setup, answers }; return { mode: "wrote", bag, slice: "" }; };
const putList = (answers: Obj, knob: Obj, rows: readonly number[]): Obj => { const def = ints(knob["default"]), same = rows.length === def.length && rows.every((n, i) => n === def[i]); return { ...answers, thresholds: same ? { source: "default" } : { source: "user", value: [...rows], rev: 1 } }; };
export function turnOn(files: Bag, skel: Obj, setupId: string, bundled: CatalogueDoc): LevelWrite {
  const gate = addCase(files, bundled); if (gate.mode !== "same") return { mode: gate.mode === "newer" ? "newer" : "older" };
  const root = held(files), slice = files["catalogue/slice.json"]; if (root === null || !isObj(slice)) return { mode: "missing" };
  if (levelsOf(files) !== null) return { mode: "wrote", bag: files, slice: "" };
  const have = kept(files), id = have !== null && typeof have["id"] === "string" ? have["id"] : setupId, bag = copyBag(files);
  const ids = [...list(root.project["rules"]).filter((item): item is string => typeof item === "string")]; if (!ids.includes(id)) ids.push(id);
  bag["project.json"] = { ...root.root, project: { ...root.project, rules: ids } }; if (have !== null) return { mode: "wrote", bag, slice: "" };
  const row = behaviours(bundled).find((item) => item["id"] === "xp-levels"), cat0 = skel["catalogue"]; if (row === undefined || !isObj(cat0)) return { mode: "missing" };
  const next = structuredClone(skel), catalogue = { ...cat0 };
  next["id"] = setupId; next["name"] = "Rule"; next["behaviourId"] = "xp-levels"; catalogue["rev"] = catalogueRev(bundled); next["catalogue"] = catalogue; next["answers"] = blank(row);
  const used = behaviours(slice).flatMap((item) => typeof item["id"] === "string" ? [item["id"]] : []); if (!used.includes("xp-levels")) used.push("xp-levels");
  const sliced = sliceDoc(bundled, used); if (!isObj(sliced)) return { mode: "missing" };
  bag[`setups/${setupId}.json`] = next; bag["catalogue/slice.json"] = sliced; return { mode: "wrote", bag, slice: sliceOf(bundled, used) };
}
export function turnOff(files: Bag): LevelWrite { const root = held(files), setup = levelsOf(files); if (root === null || setup === null || typeof setup["id"] !== "string") return { mode: "missing" }; const bag = copyBag(files); bag["project.json"] = { ...root.root, project: { ...root.project, rules: list(root.project["rules"]).filter((item) => item !== setup["id"]) } }; return { mode: "wrote", bag, slice: "" }; }
export function setLevels(files: Bag, n: number): LevelWrite {
  const view = curveOf(files), setup = levelsOf(files), knob = spec(files, "levels"), listKnob = spec(files, "thresholds"); if (view === null || setup === null || knob === null || listKnob === null || !Number.isFinite(n)) return { mode: "missing" };
  const count = clamp(Math.round(n), view.levelMin, view.levelMax), full = readList(answersOf(setup), listKnob), defaults = ints(listKnob["default"]); if (full === null) return { mode: "missing" };
  const rows: number[] = []; for (let i = 0; i < count; i += 1) { const raw = full[i] ?? defaults[i]; if (typeof raw !== "number") return { mode: "missing" }; rows.push(clamp(raw, view.rowMin, view.rowMax)); }
  return write(files, putList(setAnswer(answersOf(setup), "levels", count, knob["default"]), listKnob, rows));
}
export function setThreshold(files: Bag, i: number, v: number): LevelWrite {
  const view = curveOf(files), setup = levelsOf(files), listKnob = spec(files, "thresholds"); if (view === null || setup === null || listKnob === null || !Number.isInteger(i) || i < 0 || i >= view.rows.length || !Number.isFinite(v)) return { mode: "missing" };
  return write(files, putList(answersOf(setup), listKnob, view.rows.map((n, at) => at === i ? clamp(Math.round(v), view.rowMin, view.rowMax) : n)));
}
export function resetCurve(files: Bag): LevelWrite { const setup = levelsOf(files); return setup === null ? { mode: "missing" } : write(files, { ...answersOf(setup), thresholds: { source: "default" } }); }
export function setXpMove(files: Bag, v: number): LevelWrite { const view = curveOf(files), setup = levelsOf(files), knob = spec(files, "xp_move"); if (view === null || setup === null || knob === null || !Number.isFinite(v)) return { mode: "missing" }; return write(files, setAnswer(answersOf(setup), "xp_move", clamp(Math.round(v), view.moveMin, view.moveMax), knob["default"])); }
```

### `tools/maker/levels.ts` (new)

```ts
import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { curveOf, resetCurve, setLevels, setThreshold, setXpMove, turnOff, turnOn, type LevelWrite } from "../../src/editor/rules/levels.ts";
import { addCase, updateProject } from "../../src/editor/unit/add.ts";
import { BUNDLED } from "./catalogue.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type LevelsHit = Host & { readonly banner: string | null; readonly toast?: string | null };
export type LevelsIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
let open = false, skel: Obj | null = null, stack: DocText[] = [];
export function rememberLevels(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function levelsOpen(): boolean { return open; }
function bagOf(files: DocText): Record<string, Obj> | null { const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag; }
const slider = (id: string, label: string, value: number, min: number, max: number): string => `<label class="sub" for="k-${esc(id)}">${esc(label)}</label><input id="k-${esc(id)}" class="knob" type="range" min="${min}" max="${max}" step="1" value="${value}" data-lvl="${esc(id)}" aria-label="${esc(label)}"><span class="sub" data-val="${esc(id)}">${value}</span>`;
export function levelsSection(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const gate = addCase(bag, BUNDLED), head = `<h2>Levels</h2>`;
  if (readOnly || gate.mode === "newer") return `${head}<div class="card"><p>${esc(gate.mode === "newer" ? gate.text : "Made with a newer TileEngine. Open only.")}</p></div>`;
  if (gate.mode === "older") return `${head}<div class="card"><p>${esc(gate.text)}</p>${gate.update ? `<button type="button" class="btn" data-act="l:update">Update</button>` : ""}</div>`;
  const view = curveOf(bag); if (view === null) return `${head}<div class="card"><span class="name">Levels: Off</span><button type="button" class="btn" data-act="l:on">Turn on levels</button></div>`;
  return `${head}<div class="card"><button type="button" class="grow card-hit" data-act="l:open"><span class="name">Levels: ${view.n} · ${view.total} XP to the top</span></button></div>`;
}
export function levelsSheet(files: DocText, readOnly: boolean): string {
  if (!open || readOnly) return "";
  const bag = bagOf(files), view = bag === null ? null : curveOf(bag); if (view === null) return "";
  const rows = view.rows.map((value, i) => `<div data-row="${i}"><label class="sub" for="k-row-${i}">Level ${i + 1}</label><input id="k-row-${i}" class="knob" type="range" min="${view.rowMin}" max="${view.rowMax}" step="1" value="${value}" data-lvl="row-${i}" aria-label="Level ${i + 1}"><span class="sub" data-val="row-${i}">${value} XP</span></div>`).join("");
  return `<div class="scrim" data-sheet="levels"><div class="sheet" role="dialog"><header class="topbar"><button type="button" class="btn ghost" data-act="l:close">Back</button><h1>Levels</h1></header>${slider("levels", view.levelLabel, view.n, view.levelMin, view.levelMax)}<h2>XP to reach each level</h2>${rows}<button type="button" class="btn ghost" data-act="l:reset">Reset curve</button>${slider("xp_move", view.moveLabel, view.move, view.moveMin, view.moveMax)}<button type="button" class="btn" data-act="test">▶ Test</button><button type="button" class="btn ghost" data-act="l:off">Turn off levels</button></div></div>`;
}
const keptHost = (host: Host): LevelsHit => ({ ...host, banner: null });
const texts = (stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): DocText => { const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); if (slice !== "") next["catalogue/slice.json"] = slice; return next; };
async function commit(io: LevelsIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
async function save(io: LevelsIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): Promise<LevelsHit> {
  const prev = stack; stack = [host.files];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after, slice));
  if (!wrote.ok) { stack = prev; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: "Changed · Undo" };
}
async function undo(io: LevelsIo, host: Host): Promise<LevelsHit> {
  const snap = stack.pop(); if (snap === undefined) return { ...keptHost(host), toast: null };
  const wrote = await commit(io, host.files, host.rev, snap);
  if (!wrote.ok) { stack = [snap]; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: null };
}
function apply(host: Host, io: LevelsIo, bag: Record<string, Obj>, got: LevelWrite): Promise<LevelsHit> {
  if (got.mode !== "wrote" || (got.slice === "" && got.bag === bag)) return Promise.resolve(keptHost(host));
  return save(io, host, bag, got.bag, got.slice);
}
export async function levelsAct(act: string, host: Host, io: LevelsIo): Promise<LevelsHit> {
  if (act === "l:open") { open = true; return keptHost(host); }
  if (act === "l:close") { open = false; return keptHost(host); }
  if (act === "l:undo") return undo(io, host);
  if (host.readOnly) return { ...keptHost(host), banner: "Made with a newer TileEngine. Open only." };
  const bag = bagOf(host.files); if (bag === null) return { ...keptHost(host), banner: "Can't open this project" };
  if (act === "l:update") { const wrote = updateProject(bag, BUNDLED); return wrote === null ? keptHost(host) : save(io, host, bag, wrote.bag, wrote.slice); }
  if (addCase(bag, BUNDLED).mode !== "same") return keptHost(host);
  if (act === "l:off") { open = false; return apply(host, io, bag, turnOff(bag)); }
  if (skel === null) return { ...keptHost(host), banner: "Can't open: setup.rule.json" };
  if (act === "l:on") return apply(host, io, bag, turnOn(bag, skel, `setup_${ulid(Date.parse(io.now), io.bytes())}`, BUNDLED));
  if (act === "l:reset") return apply(host, io, bag, resetCurve(bag));
  if (!act.startsWith("l:set:")) return keptHost(host);
  const rest = act.slice("l:set:".length), cut = rest.lastIndexOf(":"), key = rest.slice(0, cut), raw = Number(rest.slice(cut + 1));
  const row = key.startsWith("row-") ? Number(key.slice("row-".length)) : Number.NaN;
  const got = key === "levels" ? setLevels(bag, raw) : key === "xp_move" ? setXpMove(bag, raw) : Number.isInteger(row) ? setThreshold(bag, row, raw) : { mode: "missing" as const };
  return apply(host, io, bag, got);
}
```

### `tests/editor/levels.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { curveOf, levelsOf, setLevels, setThreshold, turnOff, turnOn } from "../../src/editor/rules/levels.ts";
import { readProject } from "../../src/project/load/index.ts";
import { sliceOf } from "../../src/project/slice-of.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { BUNDLED } from "../../tools/maker/catalogue.ts";
import { levelsAct, levelsSheet } from "../../tools/maker/levels.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), ID = "setup_01JXP00000000000000000001A";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const bagOf = (rel: string): Record<string, Obj> => { const parsed = parseProject(walk(rel)); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const skel = (): Obj => { const doc = JSON.parse(readFileSync(join(root, "data/templates/setup.rule.json"), "utf8")) as unknown; if (!isObj(doc)) throw new Error("skel"); return doc; };
const on = (files: Record<string, Obj>) => { const got = turnOn(files, skel(), ID, BUNDLED); if (got.mode !== "wrote") throw new Error(got.mode); return got; };
const played = (files: Record<string, Obj>) => { const load = readProject(files); if (!load.ok || load.project === null) throw new Error(load.report.map((row) => row.detail ?? row.code).join(" ")); return playDocsOf(load.project); };
const setup = (files: Record<string, Obj>): Obj => { const doc = files[`setups/${ID}.json`]; if (!isObj(doc) || !isObj(doc["answers"])) throw new Error("setup"); return doc["answers"]; };
const rules = (files: Record<string, Obj>): readonly unknown[] => { const rootDoc = files["project.json"]; if (!isObj(rootDoc) || !isObj(rootDoc["project"]) || !Array.isArray(rootDoc["project"]["rules"])) throw new Error("rules"); return rootDoc["project"]["rules"]; };
test("turn on levels re-cuts the slice", () => {
  const demo = bagOf("fixtures/demo.tileproj"), slice = demo["catalogue/slice.json"]; assert.equal(levelsOf(demo), null); assert.ok(isObj(slice));
  const used = (Array.isArray(slice["behaviours"]) ? slice["behaviours"] : []).flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []);
  const got = on(demo); assert.equal(got.slice, sliceOf(BUNDLED, [...used, "xp-levels"])); assert.deepEqual(got.bag["catalogue/slice.json"], JSON.parse(got.slice));
  assert.equal(rules(got.bag).includes(ID), true);
  const answers = setup(got.bag), cut = got.bag["catalogue/slice.json"], rows = isObj(cut) && Array.isArray(cut["behaviours"]) ? cut["behaviours"] : [], hit = rows.find((item) => isObj(item) && item["id"] === "xp-levels");
  const knobs = isObj(hit) && Array.isArray(hit["knobs"]) ? hit["knobs"].flatMap((knob) => isObj(knob) && typeof knob["id"] === "string" && Object.hasOwn(knob, "default") ? [knob["id"]] : []) : [];
  assert.ok(knobs.length >= 3 && knobs.every((id) => JSON.stringify(answers[id]) === "{\"source\":\"default\"}") && Object.keys(answers).length === knobs.length);
  const load = readProject(got.bag); assert.equal(load.ok, true); assert.deepEqual([...load.report], []);
  assert.equal(curveOf(got.bag)?.n, 9); assert.equal(curveOf(got.bag)?.total, 112);
});
test("threshold edit stores the whole list", () => {
  const got = on(bagOf("fixtures/demo.tileproj")), changed = setThreshold(got.bag, 0, 2); assert.equal(changed.mode, "wrote"); if (changed.mode !== "wrote") return;
  assert.deepEqual(setup(changed.bag)["thresholds"], { source: "user", value: [2, 11, 13, 11, 13, 14, 11, 11, 11], rev: 1 });
  const back = setThreshold(changed.bag, 0, 17); assert.equal(back.mode, "wrote"); if (back.mode !== "wrote") return;
  assert.deepEqual(setup(back.bag)["thresholds"], { source: "default" });
});
test("list length follows levels", () => {
  const got = on(bagOf("fixtures/demo.tileproj")), three = setLevels(got.bag, 3); assert.equal(three.mode, "wrote"); if (three.mode !== "wrote") return;
  assert.deepEqual(setup(three.bag)["thresholds"], { source: "user", value: [17, 11, 13], rev: 1 }); assert.deepEqual(setup(three.bag)["levels"], { source: "user", value: 3, rev: 1 });
  const five = setLevels(three.bag, 5); assert.equal(five.mode, "wrote"); if (five.mode !== "wrote") return;
  assert.deepEqual(setup(five.bag)["thresholds"], { source: "user", value: [17, 11, 13, 11, 13], rev: 1 }); assert.deepEqual(setup(five.bag)["levels"], { source: "user", value: 5, rev: 1 });
  const low = setThreshold(five.bag, 0, 0); assert.equal(low.mode, "wrote"); if (low.mode !== "wrote") return;
  const high = setThreshold(low.bag, 1, 100); assert.equal(high.mode, "wrote"); if (high.mode !== "wrote") return;
  const value = setup(high.bag)["thresholds"]; assert.ok(isObj(value) && Array.isArray(value["value"])); if (!isObj(value) || !Array.isArray(value["value"])) return;
  assert.deepEqual([value["value"][0], value["value"][1]], [1, 99]);
});
test("turn off detaches and keeps the file", () => {
  const got = on(bagOf("fixtures/demo.tileproj")), off = turnOff(got.bag); assert.equal(off.mode, "wrote"); if (off.mode !== "wrote") return;
  assert.equal(rules(off.bag).includes(ID), false); assert.ok(isObj(off.bag[`setups/${ID}.json`])); assert.equal(levelsOf(off.bag), null);
  const again = turnOn(off.bag, skel(), "setup_01JXP00000000000000000002A", BUNDLED); assert.equal(again.mode, "wrote"); if (again.mode !== "wrote") return;
  assert.equal(rules(again.bag).includes(ID), true); assert.equal(again.bag["setups/setup_01JXP00000000000000000002A.json"], undefined);
});
test("wired level knobs change the adapter", async () => {
  assert.deepEqual(WIRED["xp-levels"], ["levels", "thresholds", "xp_move"]);
  const got = on(bagOf("fixtures/demo.tileproj")), changed = setThreshold(got.bag, 0, 2); assert.equal(changed.mode, "wrote"); if (changed.mode !== "wrote") return;
  assert.deepEqual(played(changed.bag).levels?.rules.thresholds, [2, 11, 13, 11, 13, 14, 11, 11, 11]);
  const doc = changed.bag[`setups/${ID}.json`]; if (!isObj(doc) || !isObj(doc["answers"])) return;
  doc["answers"] = { ...doc["answers"], xp_basic: { source: "user", value: 5, rev: 1 } };
  assert.deepEqual(played(changed.bag).levels?.rules.xp, { move: 1 });
  const text: Record<string, string> = {}; for (const [path, file] of Object.entries(changed.bag)) text[path] = JSON.stringify(file);
  await levelsAct("l:open", { files: text, rev: 0, readOnly: false, dirty: false }, { store: memoryStore(), id: "p", now: "2026-11-21T00:00:00.000Z", bytes: () => new Uint8Array(16) });
  const html = levelsSheet(text, false); assert.equal(html.includes("xp_basic") || html.includes("XP per basic") || html.includes("Where the XP bar"), false); assert.equal(html.includes("Number of levels"), true);
});
```

### `tests/tools/play-levels.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import type { Action } from "../../src/core/log/index.ts";
import { setLevels, setThreshold, setXpMove, turnOff, turnOn } from "../../src/editor/rules/levels.ts";
import { readProject } from "../../src/project/load/index.ts";
import { submit } from "../../src/sim/actions.ts";
import { BUNDLED } from "../../tools/maker/catalogue.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { bundledDocs, playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), ID = "setup_01JXP00000000000000000001A", DEF = [17, 11, 13, 11, 13, 14, 11, 11, 11];
type Obj = Record<string, unknown>;
type Match = ReturnType<typeof createMatch>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const bagOf = (): Record<string, Obj> => { const parsed = parseProject(walk("fixtures/demo.tileproj")); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const skel = (): Obj => { const doc = JSON.parse(readFileSync(join(root, "data/templates/setup.rule.json"), "utf8")) as unknown; if (!isObj(doc)) throw new Error("skel"); return doc; };
const played = (files: Record<string, Obj>) => { const load = readProject(files); if (!load.ok || load.project === null) throw new Error(load.report.map((row) => row.detail ?? row.code).join(" ")); return playDocsOf(load.project); };
const wrote = <T extends { readonly mode: string; readonly bag?: Record<string, Obj> }>(got: T): Record<string, Obj> => { if (got.mode !== "wrote" || got.bag === undefined) throw new Error(got.mode); return got.bag; };
const on = (): Record<string, Obj> => wrote(turnOn(bagOf(), skel(), ID, BUNDLED));
const level = (m: Match): number => m.world.levels?.state().bars.find((bar) => bar.id === m.sides.me)?.level ?? -1;
function hop(m: Match, n: number): void {
  const id = m.world.units.all().find((u) => u.alive && u.side === m.sides.me)?.id, home = id === undefined ? undefined : m.world.units.get(id); if (id === undefined || home === undefined) throw new Error("me");
  let away: { c: number; r: number } | undefined;
  for (let r = 0; r < m.world.grid.rows && away === undefined; r += 1) for (let c = 0; c < m.world.grid.cols; c += 1) if ((c !== home.at.c || r !== home.at.r) && m.world.grid.isOpen({ c, r }) && !m.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r)) away = { c, r };
  if (away === undefined) throw new Error("cell");
  const a = { c: home.at.c, r: home.at.r };
  for (let i = 0; i < n; i += 1) { const action: Action = { id: `m${m.world.log.lastSeq()}-${i}`, kind: "move", actor: id, target: { pipe: "tile", at: i % 2 === 0 ? away : a }, durationMs: null, turns: null, effects: [] }; submit(m.world, action); }
}
test("levels reach Test", () => {
  assert.equal(played(bagOf()).levels, undefined);
  const docs = played(on()); assert.deepEqual(docs.levels?.rules.thresholds, DEF); assert.equal(docs.levels?.rules.xp.move, 1); assert.equal(docs.levels?.rules.bar, "side");
  assert.deepEqual(played(wrote(setLevels(on(), 3))).levels?.rules.thresholds, [17, 11, 13]);
  assert.equal(played(wrote(turnOff(on()))).levels, undefined);
});
test("a move pays XP in Test", () => {
  const m = createMatch(played(wrote(setThreshold(on(), 0, 2))), 20);
  assert.deepEqual(m.view().xp, { level: 0, now: 0, need: 2, top: false }); hop(m, 2); assert.equal(level(m), 1); assert.deepEqual(m.view().xp, { level: 1, now: 0, need: 11, top: false });
});
test("custom curve plays in Test", () => {
  let bag = wrote(setLevels(on(), 3)); for (const i of [0, 1, 2]) bag = wrote(setThreshold(bag, i, 5)); bag = wrote(setXpMove(bag, 1));
  const docs = played(bag); assert.deepEqual(docs.levels?.rules.thresholds, [5, 5, 5]); assert.equal(docs.levels?.rules.xp.move, 1);
  const m = createMatch(docs, 20); hop(m, 5); assert.equal(level(m), 1); hop(m, 5); assert.equal(level(m), 2);
});
test("no levels, no strip", () => { const m = createMatch(bundledDocs(), 20); assert.equal(m.view().xp, null); assert.equal(m.world.levels, null); });
```

### `handoff/steps/tests/s6b-levels/smoke.mjs` (new)

```js
// Step 6b levels. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6b-levels/smoke.mjs . 8806
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8806"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const { fitView } = await import(pathToFileURL(join(root, "src/runtime/render/fit.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s6b-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s6b-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const quiet = (page) => page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 });
const shotOf = async (page) => page.evaluate(() => { const c = document.querySelector("#board"), rect = c.getBoundingClientRect(), cam = window.__cam; return { w: c.width, h: c.height, left: rect.left, top: rect.top, rw: rect.width, rh: rect.height, x: cam.x, y: cam.y, s: cam.s }; });
const screenOf = (g, c, r) => { const k = g.w / g.rw, ky = g.h / g.rh, f = fitView(g.w, g.h, g.s, 16, 16); return { x: g.left + (f.padX + ((c + 0.5) * 16 - g.x) * f.s) / k, y: g.top + (f.padY + ((r + 0.5) * 16 - g.y) * f.s) / ky }; };
const tileOf = (cam, ox, oy) => { const f = fitView(cam.w, cam.h, cam.s, 16, 16); return { c: Math.floor(((ox * (cam.w / cam.rw) - f.padX) / f.s + cam.x) / 16), r: Math.floor(((oy * (cam.h / cam.rh) - f.padY) / f.s + cam.y) / 16) }; };
const tapCell = async (page, c, r) => { const g = await shotOf(page), at = screenOf(g, c, r); await page.evaluate(() => { window.__up = null; }); await page.touchscreen.tap(at.x, at.y); await page.waitForFunction(() => window.__up !== null, null, { timeout: 15000 }); const up = await page.evaluate(() => window.__up), tile = up === null ? null : tileOf(up.cam, up.x, up.y); if (up === null || up.trust !== true || tile === null || tile.c !== c || tile.r !== r) throw new Error(`tap ${c},${r} -> ${JSON.stringify(tile)}`); };
const slide = async (page, sel, value) => { const node = page.locator(sel); await node.waitFor({ timeout: 15000 }); await node.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, value); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = []; let saw = false;
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 400)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    await step("1 levels off then on", async () => {
      await page.locator('[data-act="l:on"]').scrollIntoViewIfNeeded(); await waitText(page, "Levels: Off"); await shot("01-levels-off");
      await tap(page, "l:on"); await waitText(page, "Levels: 9 · 112 XP to the top"); await quiet(page); await page.locator('[data-act="l:open"]').scrollIntoViewIfNeeded(); await shot("02-levels-on");
    });
    await step("2 editor rows", async () => {
      await tap(page, "l:open"); await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 9 && document.querySelector("[data-sheet=levels] h1")?.textContent === "Levels", null, { timeout: 15000 });
      await shot("03-editor-top");
      await page.locator('[data-row="8"]').scrollIntoViewIfNeeded(); await page.waitForFunction(() => { const row = document.querySelector('[data-row="8"]'), sheet = document.querySelector("[data-sheet=levels] .sheet"); if (row === null || sheet === null) return false; const b = row.getBoundingClientRect(), s = sheet.getBoundingClientRect(); return b.top < s.bottom && b.bottom > s.top; }, null, { timeout: 15000 });
      await shot("04-editor-scrolled"); tiny.push(...await big()); saw = true;
      await slide(page, '[data-lvl="levels"]', "3"); await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 3, null, { timeout: 15000 });
      await quiet(page); await tap(page, "l:close"); await page.waitForFunction(() => document.querySelector("[data-sheet=levels]") === null, null, { timeout: 15000 });
      await tap(page, "l:open"); await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 3, null, { timeout: 15000 });
    });
    await step("3 strip before", async () => {
      await slide(page, '[data-lvl="row-0"]', "2"); await slide(page, '[data-lvl="xp_move"]', "1");
      await page.waitForFunction(() => document.querySelector('[data-val="row-0"]')?.textContent === "2 XP", null, { timeout: 15000 });
      await quiet(page); await tap(page, "test"); await page.waitForFunction(() => document.querySelector("#xp")?.textContent === "Level 0 · 0/2 XP" && window.__play !== undefined, null, { timeout: 15000 });
      await shot("05-xp-before");
    });
    await step("4 two moves", async () => {
      await page.evaluate(() => { const c = document.querySelector("#board"); window.__up = null; c.addEventListener("pointerup", (e) => { const cam = window.__cam, b = c.getBoundingClientRect(); window.__up = { trust: e.isTrusted, x: e.offsetX, y: e.offsetY, cam: { w: c.width, h: c.height, rw: b.width, rh: b.height, x: cam.x, y: cam.y, s: cam.s } }; }, true); window.__hud.hideBanner(); window.__play.followId = null; });
      await page.waitForFunction(() => window.__driver.stats.draws > 0, null, { timeout: 15000 });
      const knight = await page.evaluate(() => window.__play.scene().units.find((u) => u.sprite === "starter:hero-sword").id);
      const hop = async () => {
        await page.evaluate((id) => { const u = window.__play.world.units.get(id), c = document.querySelector("#board"), cam = window.__cam, s = Math.max(1, Math.trunc(cam.s)); window.__play.followId = null; cam.follow = null; cam.x = Math.max(0, (u.at.c + 0.5) * 16 - Math.floor(c.width / s) / 2); cam.y = Math.max(0, (u.at.r + 0.5) * 16 - Math.floor(c.height / s) / 2); }, knight);
        const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r);
        await page.waitForFunction((id) => window.__play.selected === id && window.__play.reach.length > 0, knight, { timeout: 15000 });
        const cell = await page.evaluate(() => { const c = window.__play.reach[0]; return { c: c.c, r: c.r }; });
        await page.evaluate((p) => { window.__wait = () => { const u = window.__play.world.units.get(p.id); return window.__play.walk === null && u.at.c === p.c && u.at.r === p.r; }; }, { id: knight, ...cell });
        await tapCell(page, cell.c, cell.r); await page.waitForFunction(() => window.__wait(), null, { timeout: 15000 });
      };
      await hop();
      const turns = await page.evaluate(() => window.__play.view().turns);
      await page.evaluate((t0) => { window.__wait = () => window.__play.side === "player" && window.__play.view().mine === true && window.__play.view().turns === t0 + 1 && window.__play.world.phases.battle === "idle" && window.__play.done.size === 0; }, turns);
      const end = page.locator("#end"); await end.waitFor({ timeout: 15000 }); const box = await end.boundingBox(); if (box === null) throw new Error("no end"); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForFunction(() => window.__wait(), null, { timeout: 15000 });
      await hop();
      await page.waitForFunction(() => document.querySelector("#xp")?.textContent === "Level 1 · 0/11 XP", null, { timeout: 15000 });
      await shot("06-xp-after");
    });
    await step("5 reset curve", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="l:reset"]') !== null, null, { timeout: 15000 });
      await quiet(page); await tap(page, "l:reset"); await page.waitForFunction(() => ["17 XP", "11 XP", "13 XP"].every((t, i) => document.querySelector(`[data-val="row-${i}"]`)?.textContent === t), null, { timeout: 15000 });
    });
    await step("6 turn off", async () => {
      await quiet(page); await tap(page, "l:off"); await page.waitForFunction(() => document.body.innerText.includes("Levels: Off") && document.querySelector("[data-sheet=levels]") === null, null, { timeout: 15000 });
      await quiet(page); await tap(page, "test"); await page.waitForFunction(() => window.__play !== undefined && window.__driver.stats.draws > 0 && document.querySelector("#xp")?.textContent === "" && getComputedStyle(document.querySelector("#xp")).display === "none", null, { timeout: 15000 });
    });
    await step("7 reload", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.body.innerText.includes("Levels: Off"), null, { timeout: 15000 });
      await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game");
      await waitText(page, "Levels: Off"); await tap(page, "l:on"); await quiet(page); await tap(page, "l:open");
      await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 3 && ["17 XP", "11 XP", "13 XP"].every((t, i) => document.querySelector(`[data-val="row-${i}"]`)?.textContent === t), null, { timeout: 15000 });
    });
    check(`8 targets @${width}`, saw && tiny.length === 0 && errs.length === 0, !saw ? "not measured" : tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `src/rules/behaviours/wired.ts` (edited)

```diff
diff --git a/src/rules/behaviours/wired.ts b/src/rules/behaviours/wired.ts
index 673a9ef..2685879 100644
--- a/src/rules/behaviours/wired.ts
+++ b/src/rules/behaviours/wired.ts
@@ -5,4 +5,5 @@ export const WIRED: Readonly<Record<string, readonly string[]>> = {
   "line-shot": ["range", "damage"],
   talk: ["line"],
   "win-condition": ["wipe_wins"],
+  "xp-levels": ["levels", "thresholds", "xp_move"],
 };
```

Full file as merged:

```ts
/** Knob ids `playDocsOf` reads. Ids only, no rules. */
export const WIRED: Readonly<Record<string, readonly string[]>> = {
  "unit-roster": ["unit_hp", "unit_atk"],
  "basic-attack": ["reach_mode", "custom_ns", "custom_ew"],
  "line-shot": ["range", "damage"],
  talk: ["line"],
  "win-condition": ["wipe_wins"],
  "xp-levels": ["levels", "thresholds", "xp_move"],
};
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 59678ef..fe0ae9c 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -8,6 +8,7 @@ import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, un
 import { addFind, rememberAbility } from "./add-ability.ts";
 import { DEV } from "./dev.ts"; // dev-only
 import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
+import { levelsAct, levelsOpen, levelsSection, levelsSheet, rememberLevels } from "./levels.ts";
 import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type AimAt, type PlayReady } from "./test-launch.ts";
@@ -15,7 +16,7 @@ import { startMatch } from "../play-stage/page.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
+type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
 const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
 let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve();
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
@@ -30,12 +31,12 @@ function sheet(): string {
   return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
 }
 function paint(): void {
-  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
+  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly), units: unitTail(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet()) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly), units: unitTail(state.files, state.readOnly), levels: levelsSection(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
@@ -97,6 +98,12 @@ async function run(act: string): Promise<void> {
     paint(); return;
   }
   const unitUndo = act === "undo" && state.undo === "unit";
+  if (((act.startsWith("l:") && state.screen === "project") || (act === "undo" && state.undo === "level")) && store !== null && state.current !== null) {
+    const hit = await levelsAct(act === "undo" ? "l:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
+    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "level"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
+    paint(); return;
+  }
   if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
     const hadBanner = state.banner !== null;
     const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
@@ -137,7 +144,7 @@ async function boot(): Promise<void> {
   try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
   try {
     const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
-    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/setup.rule.json")) { const parsed = parseProject({ "setups/setup.rule.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberRule(parsed.files["setups/setup.rule.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
+    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/setup.rule.json")) { const parsed = parseProject({ "setups/setup.rule.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberRule(parsed.files["setups/setup.rule.json"]); rememberLevels(parsed.files["setups/setup.rule.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
     templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
   } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
 }
@@ -145,7 +152,7 @@ document.addEventListener("click", (ev) => { const node = ev.target instanceof E
 let held: { act: string; t: number } | null = null;
 document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
 document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
-document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
+document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-lvl")) { go(`l:set:${node.getAttribute("data-lvl") ?? ""}:${node.value}`); return; } if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
 void boot();
```

Full file as merged:

```ts
import { aimKind } from "../../src/editor/unit/panel.ts";
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
import { addFind, rememberAbility } from "./add-ability.ts";
import { DEV } from "./dev.ts"; // dev-only
import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
import { levelsAct, levelsOpen, levelsSection, levelsSheet, rememberLevels } from "./levels.ts";
import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { backScreen, launchTest, openSaved, type AimAt, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
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
  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
  if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + edit + toast; return; }
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly), units: unitTail(state.files, state.readOnly), levels: levelsSection(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
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
function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt): void {
  const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
  try {
    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; }, aim);
    root.hidden = true;
  } catch (e) { canvas.remove(); throw e; }
}
async function saveStage(): Promise<boolean> {
  if (store === null || state.current === null) return false;
  const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
  state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
}
async function beginTest(aim?: AimAt & { readonly stageId?: string }): Promise<void> {
  if (store === null || state.current === null) return;
  const stageId = aim?.stageId ?? (state.screen === "stage" ? state.stageId : null);
  if (stageId !== null && state.screen === "stage" && !await saveStage()) { paint(); return; }
  const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
  const launched = aim?.unitId === undefined ? undefined : { ...(aim.abilityId === undefined ? { unitId: aim.unitId } : { unitId: aim.unitId, abilityId: aim.abilityId }), ...(aim.aim === undefined ? {} : { aim: aim.aim }) };
  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), now: nowIso(), start: (docs, at) => enterPlay(docs, scroll, at) });
  state.files = got.files; state.rev = got.rev;
  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
  state.dirty = false; state.problems = [];
}
function aimAt(text: DocText, unit: string, ability: string | null): AimAt {
  if (ability === null) return { unitId: unit };
  const parsed = parseProject(text); let behaviour = "";
  if (parsed.ok) for (const [path, doc] of Object.entries(parsed.files)) if (path.startsWith("setups/") && typeof doc === "object" && doc !== null && !Array.isArray(doc) && "id" in doc && doc["id"] === ability && typeof doc["behaviourId"] === "string") behaviour = doc["behaviourId"];
  const aim = aimKind(behaviour);
  return { unitId: unit, abilityId: ability, ...(aim === undefined ? {} : { aim }) };
}
async function fromUrl(): Promise<void> {
  const params = new URLSearchParams(location.search), id = params.get("project");
  if (id === null || store === null) return;
  const stage = params.get("stage"), from = params.get("from") ?? "project", unit = params.get("unit"), ability = params.get("ability");
  const text = await readTree(store, prefix(id)), aim = unit === null ? undefined : aimAt(text, unit, ability);
  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), ...(aim === undefined ? {} : { aim }), start: (docs, at) => enterPlay(docs, 0, at) });
  if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
}
async function run(act: string): Promise<void> {
  if (state.stageId !== null && store !== null && state.current !== null && ((state.screen === "stage" && (act.startsWith("r:") || (rulesOpen() && !unitEditing() && act.startsWith("k:")))) || (act === "undo" && state.undo === "rule"))) {
    const hit = await rulesAct(act === "undo" ? "r:undo" : act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "rule"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || state.screen === "project") paint(); }, 6000); }
    paint(); return;
  }
  const unitUndo = act === "undo" && state.undo === "unit";
  if (((act.startsWith("l:") && state.screen === "project") || (act === "undo" && state.undo === "level")) && store !== null && state.current !== null) {
    const hit = await levelsAct(act === "undo" ? "l:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "level"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
    paint(); return;
  }
  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
    const hadBanner = state.banner !== null;
    const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || (state.screen === "project" && !unitEditing())) paint(); }, 6000); }
    if (hit.play !== undefined) return beginTest({ unitId: hit.play.unitId, stageId: hit.play.stageId, ...(hit.play.abilityId === undefined ? {} : { abilityId: hit.play.abilityId }), ...(hit.play.aim === undefined ? {} : { aim: hit.play.aim }) });
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
  if (act.startsWith("stage:")) { rulesShut(); state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
  if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty;
    if (out.unitId !== undefined && !out.test) { openUnit(out.unitId); paint(); return; }
    if (out.test) return beginTest(out.unitId === undefined ? undefined : { unitId: out.unitId, ...(out.stageId === undefined ? {} : { stageId: out.stageId }) });
    if (out.leave) { rulesShut(); state.screen = "project"; } paint(); return;
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
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/setup.rule.json")) { const parsed = parseProject({ "setups/setup.rule.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberRule(parsed.files["setups/setup.rule.json"]); rememberLevels(parsed.files["setups/setup.rule.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) go(node.getAttribute("data-act") ?? ""); });
let held: { act: string; t: number } | null = null;
document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-lvl")) { go(`l:set:${node.getAttribute("data-lvl") ?? ""}:${node.value}`); return; } if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
void boot();
```

### `tools/maker/project.ts` (edited)

```diff
diff --git a/tools/maker/project.ts b/tools/maker/project.ts
index 77ac94f..434ea22 100644
--- a/tools/maker/project.ts
+++ b/tools/maker/project.ts
@@ -1,10 +1,10 @@
 const amp = String.fromCharCode(38);
 const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string; readonly units?: string }): string {
+export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string; readonly units?: string; readonly levels?: string }): string {
   const reason = "Made with a newer TileEngine. Open only.";
   const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
   const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
   const rows = (input.rows ?? []).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}${input.units ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}${input.units ?? ""}${input.levels ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
 }
```

Full file as merged:

```ts
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string; readonly units?: string; readonly levels?: string }): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
  const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
  const rows = (input.rows ?? []).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}${input.units ?? ""}${input.levels ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
}
```

### `tools/play-stage/hud.ts` (edited)

```diff
diff --git a/tools/play-stage/hud.ts b/tools/play-stage/hud.ts
index 675f1a8..1f83505 100644
--- a/tools/play-stage/hud.ts
+++ b/tools/play-stage/hud.ts
@@ -1,14 +1,16 @@
 import { HUD_TOP, PLATE_H, ROW_FOOT } from "./board.ts";
+export const XP_H = 28;
 export type HudView = {
   readonly turn: string; readonly side: string; readonly mine: boolean; readonly name: string; readonly hp: number; readonly max: number; readonly selected: boolean;
   readonly outcome: "win" | "lose" | "draw" | null; readonly turns: number; readonly talk: { readonly name: string; readonly text: string } | null;
+  readonly xp: { readonly level: number; readonly now: number; readonly need: number; readonly top: boolean } | null;
   readonly actions: { readonly basic: Btn; readonly spell: Btn; readonly talk: Btn; readonly wait: Btn; readonly end: Btn };
 };
 type Btn = { readonly show: boolean; readonly on: boolean };
 type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void; recentre(): void; closeTalk(): void };
-const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
+const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#xp{position:absolute;left:0;right:0;bottom:${ROW_FOOT + PLATE_H}px;height:${XP_H}px;display:none;align-items:center;padding:0 8px;background:#101826;color:#f4efe2;pointer-events:none;z-index:2}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
 export function createHud(act: Act): { hideBanner(): void; render(view: HudView): void } {
-  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
+  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="xp" aria-live="polite"></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
   document.body.append(root);
   const q = (id: string): HTMLElement => { const n = root.querySelector(`#${id}`); if (!(n instanceof HTMLElement)) throw new Error(id); return n; };
   const banner = q("banner"), veil = q("veil"), sheet = q("sheet");
@@ -29,6 +31,7 @@ export function createHud(act: Act): { hideBanner(): void; render(view: HudView)
     for (const key of ["basic", "spell", "talk", "wait", "end"] as const) { const b = buttons[key], row = view.actions[key]; b.style.display = row.show ? "block" : "none"; b.style.opacity = row.on ? "1" : "0.4"; }
     const said = view.talk; sheet.style.display = said === null ? "none" : "block"; if (said !== null) { const name = sheet.querySelector("b"), text = sheet.querySelector("span"); if (name !== null) name.textContent = said.name; if (text !== null) text.textContent = said.text === "" ? "…" : said.text; }
     const over = view.outcome !== null; veil.style.display = over ? "flex" : "none";
+    const xp = q("xp"), row = view.xp; xp.style.display = row === null ? "none" : "flex"; xp.textContent = row === null ? "" : row.top ? `Level ${row.level} · Top level` : `Level ${row.level} · ${row.now}/${row.need} XP`;
     const title = q("card").querySelector("h2"), blurb = q("card").querySelector("p");
     if (over && title !== null && blurb !== null) { title.textContent = view.outcome === "win" ? "Victory" : view.outcome === "lose" ? "Defeat" : "Draw"; blurb.textContent = view.outcome === "lose" ? "Your units fell" : "All enemies defeated"; q("turns").textContent = `${view.turns} turns`; }
     if (!held) banner.style.display = "none";
```

Full file as merged:

```ts
import { HUD_TOP, PLATE_H, ROW_FOOT } from "./board.ts";
export const XP_H = 28;
export type HudView = {
  readonly turn: string; readonly side: string; readonly mine: boolean; readonly name: string; readonly hp: number; readonly max: number; readonly selected: boolean;
  readonly outcome: "win" | "lose" | "draw" | null; readonly turns: number; readonly talk: { readonly name: string; readonly text: string } | null;
  readonly xp: { readonly level: number; readonly now: number; readonly need: number; readonly top: boolean } | null;
  readonly actions: { readonly basic: Btn; readonly spell: Btn; readonly talk: Btn; readonly wait: Btn; readonly end: Btn };
};
type Btn = { readonly show: boolean; readonly on: boolean };
type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void; recentre(): void; closeTalk(): void };
const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#xp{position:absolute;left:0;right:0;bottom:${ROW_FOOT + PLATE_H}px;height:${XP_H}px;display:none;align-items:center;padding:0 8px;background:#101826;color:#f4efe2;pointer-events:none;z-index:2}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
export function createHud(act: Act): { hideBanner(): void; render(view: HudView): void } {
  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="xp" aria-live="polite"></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
  document.body.append(root);
  const q = (id: string): HTMLElement => { const n = root.querySelector(`#${id}`); if (!(n instanceof HTMLElement)) throw new Error(id); return n; };
  const banner = q("banner"), veil = q("veil"), sheet = q("sheet");
  const buttons: Record<"basic" | "spell" | "talk" | "wait" | "end", HTMLElement> = { basic: q("attack"), spell: q("spell"), talk: q("talk"), wait: q("wait"), end: q("end") };
  let held = true;
  const hideBanner = (): void => { held = false; banner.style.display = "none"; };
  banner.addEventListener("click", hideBanner); q("menu").addEventListener("click", () => act.menu());
  q("attack").addEventListener("click", () => act.choose("basic")); q("spell").addEventListener("click", () => act.choose("spell"));
  q("talk").addEventListener("click", () => act.choose("talk")); q("wait").addEventListener("click", () => act.wait()); q("end").addEventListener("click", () => act.endTurn());
  q("recentre").addEventListener("click", () => act.recentre()); q("close").addEventListener("click", () => act.closeTalk());
  q("restart").addEventListener("click", () => act.restart()); q("back").addEventListener("click", () => act.restart());
  window.setTimeout(hideBanner, 1260);
  const render = (view: HudView): void => {
    q("pill").textContent = view.turn; banner.textContent = view.turn; banner.style.background = view.mine ? "#14213d" : "#6b1d2a";
    q("plate").style.display = view.selected ? "flex" : "none"; q("who").textContent = view.name; q("hpText").textContent = `${view.hp}/${view.max}`;
    const bar = q("hp").querySelector("i"); if (bar instanceof HTMLElement) bar.style.width = `${view.max <= 0 ? 0 : Math.max(0, Math.min(120, Math.round((120 * view.hp) / view.max)))}px`;
    q("end").style.outlineColor = view.mine ? "#2f6fad" : "#b23b32";
    for (const key of ["basic", "spell", "talk", "wait", "end"] as const) { const b = buttons[key], row = view.actions[key]; b.style.display = row.show ? "block" : "none"; b.style.opacity = row.on ? "1" : "0.4"; }
    const said = view.talk; sheet.style.display = said === null ? "none" : "block"; if (said !== null) { const name = sheet.querySelector("b"), text = sheet.querySelector("span"); if (name !== null) name.textContent = said.name; if (text !== null) text.textContent = said.text === "" ? "…" : said.text; }
    const over = view.outcome !== null; veil.style.display = over ? "flex" : "none";
    const xp = q("xp"), row = view.xp; xp.style.display = row === null ? "none" : "flex"; xp.textContent = row === null ? "" : row.top ? `Level ${row.level} · Top level` : `Level ${row.level} · ${row.now}/${row.need} XP`;
    const title = q("card").querySelector("h2"), blurb = q("card").querySelector("p");
    if (over && title !== null && blurb !== null) { title.textContent = view.outcome === "win" ? "Victory" : view.outcome === "lose" ? "Defeat" : "Draw"; blurb.textContent = view.outcome === "lose" ? "Your units fell" : "All enemies defeated"; q("turns").textContent = `${view.turns} turns`; }
    if (!held) banner.style.display = "none";
  };
  return { hideBanner, render };
}
```

### `tools/play-stage/load.ts` (edited)

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index 6977398..b46f4b3 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -1,5 +1,6 @@
 import type { BattleSetup } from "../../src/rules/battle/battle.ts";
 import type { WinRule } from "../../src/rules/battle/win.ts";
+import type { LevelSetup } from "../../src/rules/levels/index.ts";
 import type { SimInput } from "../../src/sim/types.ts";
 import type { CoreTileType } from "../../src/types/core-types.ts";
 
@@ -19,9 +20,9 @@ export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
 export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup };
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
-  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
+  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo", ...(docs.levels === undefined ? {} : { levels: docs.levels }) }, talk: docs.talk };
 }
```

Full file as merged:

```ts
import type { BattleSetup } from "../../src/rules/battle/battle.ts";
import type { WinRule } from "../../src/rules/battle/win.ts";
import type { LevelSetup } from "../../src/rules/levels/index.ts";
import type { SimInput } from "../../src/sim/types.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";

export const TILE = 16;
export const TEAM = { player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a } as const;
export type Recipe = { readonly id: string; readonly name: string };
const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown" });
export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
  knight: { id: "starter:hero-sword", name: "Knight" },
  archer: { id: "starter:hero-staff", name: "Archer" },
  cleric: { id: "starter:hero-cleric", name: "Cleric" },
  crate: { id: "starter:prop-crate", name: "Crate" },
  merchant: { id: "starter:npc-merchant", name: "Merchant" },
  villager: { id: "starter:npc-villager", name: "Villager" },
  wolf: { id: "starter:enemy-wolf", name: "Wolf" },
});
export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup };
export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
  if (hostSeed === undefined) throw new Error("play: seed");
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo", ...(docs.levels === undefined ? {} : { levels: docs.levels }) }, talk: docs.talk };
}
```

### `tools/play-stage/match.ts` (edited)

```diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index 19703eb..b99b6bb 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -130,8 +130,10 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
       const basic = on ? targetsFor(play.world.grid, play.world.units, unit.id, "basic", rules) : [], interact = on ? targetsFor(play.world.grid, play.world.units, unit.id, "interact", rules) : [], spells = on ? spellList(unit.id) : [];
       const btn = (show: boolean, hot: boolean): Btn => ({ show, on: hot });
       const spellOn = on && spellRef(rules, unit.unitId) !== undefined;
+      const levels = play.world.levels, bars = levels === null ? null : levels.state().bars, bar = bars?.find((row) => row.id === me), at = levels === null ? undefined : levels.rules.thresholds[bar?.level ?? 0];
+      const xp = levels === null ? null : { level: bar?.level ?? 0, now: bar?.xp ?? 0, need: typeof at === "number" ? at : 0, top: bar !== undefined && bar.level >= levels.rules.thresholds.length || typeof at !== "number" };
       return {
-        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
+        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk, xp,
         actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
       };
     },
```

Full file as merged:

```ts
import type { Action } from "../../src/core/log/index.ts";
import { inOrthogonalReach, targetsFor, wipeRule, WIN_CONDITION } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { walkTo } from "../../src/rules/move/path.ts";
import { submit } from "../../src/sim/actions.ts";
import type { DoorIntent } from "../../src/sim/types.ts";
import type { Outcome } from "../../src/state/index.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { createPlay, spellRef } from "./board.ts";
import { recipeIn, type PlayDocs } from "./load.ts";
import { bundledDocs } from "./project.ts";

/** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
export const DEFAULT_SPELL_REACH = 3;
type Talk = { readonly name: string; readonly text: string };
type Btn = { readonly show: boolean; readonly on: boolean };

export function createMatch(docs?: PlayDocs, moveMs = 200) {
  const body = docs ?? bundledDocs(), play = createPlay(body, moveMs, false), rules = body.rules, lines = body.talk ?? {}, names = body.names ?? {};
  const baseIntend = play.intend, baseSync = play.sync;
  const win = body.win ?? installOne(WIN_CONDITION, {}).out;
  if (win === null) throw new Error("play: win-condition");
  const me = play.sides.me, order = play.sides.order, wiped = play.sides.contest ? wipeRule(win, order) : null;
  let side = me, outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [], armed: "unitSelected" | "actMenu" | null = null;
  const spent = new Set<string>();
  const spellList = (id: string): { id: string }[] => {
    const actor = play.world.units.get(id), bag = rules.abilities;
    if (actor === undefined) return [];
    const row = bag !== undefined && Object.hasOwn(bag, actor.unitId) ? bag[actor.unitId]?.[0] : undefined;
    const reach = row?.reach ?? DEFAULT_SPELL_REACH, out: { id: string }[] = [];
    for (const foe of play.world.units.all()) if (foe.alive && foe.id !== actor.id && foe.side !== actor.side && foe.side !== "neutral" && inOrthogonalReach(actor.at, foe.at, reach)) out.push({ id: foe.id });
    return out;
  };
  const cells = (list: readonly { id: string }[]): Sq[] => list.flatMap((t) => { const u = play.world.units.get(t.id); return u === undefined ? [] : [u.at]; });
  const go = (e: Parameters<typeof play.go>[0]): void => { play.go(e); };
  const finish = (): boolean => {
    const from = play.world.phases.battle;
    if (from !== "idle" && from !== "unitSelected") return false;
    go({ type: "END_TURN" }); go({ type: "SIDE_END" });
    const got = wiped?.(play.world, { round, side }) ?? null;
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return true; }
    const i = order.indexOf(side), last = i + 1 >= order.length;
    go({ type: "CHECK_NONE", next: last ? "roundEnd" : "sideStart" });
    if (last) { go({ type: "ROUND_END" }); round += 1; go({ type: "ROUND_BEGIN" }); }
    side = order[(i + 1) % order.length] ?? me; if (side === me) spent.clear(); go({ type: "SIDE_BEGIN" }); return false;
  };
  const landMove = (action: Action): boolean => {
    const at = action.target !== null && action.target.pipe === "tile" ? action.target.at : undefined, unit = play.world.units.get(action.actor);
    if (at === undefined || unit === undefined) return false;
    play.focus(action.actor); play.followId = action.actor; go({ type: "SELECT_UNIT", unitId: action.actor });
    const path = walkTo(play.world.grid, play.world.units, action.actor, play.step.reach, at);
    if (path === null || path.length === 0) return false;
    go({ type: "TAP_MOVE_CELL", at: { c: at.c, r: at.r } });
    const dur = moveMs * path.length;
    submit(play.world, { ...action, durationMs: dur });
    play.arm({ path, from: { c: unit.at.c, r: unit.at.r }, t0: play.world.clock.now(), dur });
    return play.walk !== null;
  };
  const pump = (): void => {
    while (queue.length > 0 && play.walk === null) {
      const action = queue.shift(); if (action === undefined) break;
      if (action.kind === "move" && landMove(action)) return;
      if (action.kind !== "move") submit(play.world, action);
    }
    if (queue.length === 0 && play.walk === null && side !== me && !finish() && side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
  };
  /** Ability confirm lands in `resolving`. Walk the legal edges back to `idle` (or `play.result` on a wipe) so the player can select again and End turn. Talk stays on `actMenu` and does not take `UNIT_DONE`. */
  const settle = (): void => {
    if (play.world.phases.battle !== "resolving") return;
    if (play.selected !== null) spent.add(play.selected);
    go({ type: "RESOLVE_DONE" });
    const got = wiped?.(play.world, { round, side }) ?? null;
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return; }
    go({ type: "CHECK_NONE", next: "unitDone" });
    go({ type: "UNIT_DONE", next: "idle" });
    play.followId = null;
  };
  play.landed(() => { if (side === me) return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); });
  const wipe = (): void => { play.aims = []; talk = null; play.focus(null); play.followId = null; };
  const back = (): "unitSelected" | "actMenu" | null => {
    if (play.world.phases.battle !== "targeting") return null;
    const from = armed === "unitSelected" ? "unitSelected" : "actMenu";
    baseIntend({ type: "Cancel" }); if (from === "unitSelected") go({ type: "UNDO_MOVE" }); armed = null; return from;
  };
  const spend = (): void => { if (play.world.phases.battle !== "actMenu") return; if (play.selected !== null) spent.add(play.selected); go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); play.followId = null; };
  const api = Object.assign(play, {
    intend(intent: DoorIntent) {
      const step = baseIntend(intent);
      if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "interact") {
        const target = step.action.target, id = target !== null && target.pipe === "unit" ? target.unitId : undefined, u = id === undefined ? undefined : play.world.units.get(id);
        const key = u === undefined ? "" : `talk-${u.unitId}`;
        const text = key !== "" && Object.hasOwn(lines, key) ? lines[key] ?? "" : "";
        talk = { name: u === undefined ? "" : names[u.unitId] ?? recipeIn(body.recipes, u.unitId).name, text };
        play.world.phases = { ...play.world.phases, battle: "actMenu" };
      } else if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "ability") settle();
      return step;
    },
    sync() { baseSync(); },
    choose(kind: "basic" | "spell" | "talk"): string | null {
      const id = play.selected; if (id === null) return "noUnit";
      const list = kind === "spell" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === "talk" ? "interact" : "basic", rules);
      if (list.length === 0) return "noTarget";
      const from = play.world.phases.battle;
      const step = baseIntend({ type: "ChooseAction", actionId: kind === "talk" ? "interact" : kind, unitId: id });
      if (!("reject" in step) || step.reject !== null) return "reject" in step && step.reject !== null ? step.reject : "illegal";
      armed = from === "unitSelected" ? "unitSelected" : "actMenu";
      play.aims = cells(list); play.aimKind = kind === "spell" ? "spell" : "basic"; return null;
    },
    wait() { spend(); },
    endTurn() {
      if (play.walk !== null || side !== me || outcome !== null) return;
      if (play.world.phases.battle === "targeting") back();
      const now = play.world.phases.battle;
      if (now === "actMenu") spend(); else if (now === "unitSelected") baseIntend({ type: "Cancel" });
      wipe(); turns += 1; if (finish()) return; if (side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
    },
    closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
    recentreTarget(): Sq | null {
      const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
      if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
      const own = play.world.units.all().find((u) => u.alive && u.side === me);
      return own === undefined ? null : { c: own.at.c, r: own.at.r };
    },
    restart: () => createMatch(docs, moveMs),
    view() {
      const id = play.selected, unit = id === null ? undefined : play.world.units.get(id), phase = play.world.phases.battle, on = unit !== undefined && unit.alive;
      const max = unit === undefined ? 0 : (Object.hasOwn(rules.stats, unit.unitId) ? rules.stats[unit.unitId]?.hp : rules.base.hp) ?? rules.base.hp;
      const hp = on ? play.world.rules?.state().units.find((u) => u.id === unit.id)?.hp ?? max : 0;
      const menu = on && (phase === "unitSelected" || phase === "actMenu" || phase === "targeting");
      const basic = on ? targetsFor(play.world.grid, play.world.units, unit.id, "basic", rules) : [], interact = on ? targetsFor(play.world.grid, play.world.units, unit.id, "interact", rules) : [], spells = on ? spellList(unit.id) : [];
      const btn = (show: boolean, hot: boolean): Btn => ({ show, on: hot });
      const spellOn = on && spellRef(rules, unit.unitId) !== undefined;
      const levels = play.world.levels, bars = levels === null ? null : levels.state().bars, bar = bars?.find((row) => row.id === me), at = levels === null ? undefined : levels.rules.thresholds[bar?.level ?? 0];
      const xp = levels === null ? null : { level: bar?.level ?? 0, now: bar?.xp ?? 0, need: typeof at === "number" ? at : 0, top: bar !== undefined && bar.level >= levels.rules.thresholds.length || typeof at !== "number" };
      return {
        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk, xp,
        actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
      };
    },
  });
  Object.defineProperty(api, "side", { get: () => side });
  Object.defineProperty(api, "outcome", { get: () => outcome });
  Object.defineProperty(api, "talk", { get: () => talk });
  Object.defineProperty(api, "done", { get: () => spent });
  const same = (a: Sq, b: Sq): boolean => a.c === b.c && a.r === b.r;
  const listed = (list: readonly Sq[], at: Sq): boolean => list.some((c) => same(c, at));
  const atOf = (intent: DoorIntent): Sq | null => {
    if (intent.type === "TargetCell") return intent.at;
    if (intent.type !== "SelectUnit") return null;
    const u = play.world.units.get(intent.unitId); return u === undefined ? null : u.at;
  };
  const ready = (id: string): boolean => { const u = play.world.units.get(id); return u !== undefined && u.alive && u.side === me && !spent.has(id); };
  const commit = (at: Sq): unknown => { const cell = { c: at.c, r: at.r }; api.intend({ type: "TargetCell", at: cell }); return api.intend({ type: "TargetCell", at: cell }); };
  play.feed = (intent: DoorIntent): unknown => {
    if (talk !== null || play.walk !== null || side !== me || outcome !== null) return undefined;
    const phase = play.world.phases.battle, at = atOf(intent);
    if (phase === "targeting" && at !== null && listed(play.aims, at)) return commit(at);
    if (phase === "targeting") {
      const from = back(); play.aims = []; talk = null; play.followId = null;
      if (intent.type === "SelectUnit" && ready(intent.unitId) && intent.unitId !== play.selected) { if (from !== "unitSelected") spend(); return api.intend(intent); }
      return undefined;
    }
    if (intent.type === "SelectUnit" && !ready(intent.unitId)) return undefined;
    if (phase === "unitSelected" && intent.type === "TargetCell") {
      if (at !== null && listed(play.reach, at)) return commit(at);
      baseIntend({ type: "Cancel" }); wipe(); return undefined;
    }
    if (phase === "actMenu" && intent.type === "SelectUnit" && intent.unitId !== play.selected) { spend(); return api.intend(intent); }
    if (phase === "actMenu" && intent.type === "SelectUnit") return undefined;
    return api.intend(intent);
  };
  return api as typeof api & { readonly side: string; readonly outcome: Outcome | null; readonly talk: Talk | null; readonly done: ReadonlySet<string>; readonly sides: typeof play.sides };
}
```

### `tools/play-stage/page.ts` (edited)

```diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 64dacdf..6b7a56f 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -4,7 +4,7 @@ import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
 import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
 import { boardBox, fit, TILE } from "./board.ts";
 import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
-import { createHud } from "./hud.ts";
+import { createHud, XP_H } from "./hud.ts";
 import { litPlan, picturesOf, sourceOf } from "./looks.ts";
 import { createMatch, DEFAULT_SPELL_REACH } from "./match.ts";
 import { openBundled } from "./project.ts";
@@ -51,7 +51,7 @@ const driver = createDriver({
 });
 const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
 for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
-const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
+const place = (): void => { const box = boardBox(innerHeight - (match.view().xp === null ? 0 : XP_H)); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
 place(); addEventListener("resize", () => { place(); seated = false; });
 seat();
 if (aim?.unitId !== undefined) {
```

Full file as merged:

```ts
import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createLighting, fitView } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { boardBox, fit, TILE } from "./board.ts";
import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
import { createHud, XP_H } from "./hud.ts";
import { litPlan, picturesOf, sourceOf } from "./looks.ts";
import { createMatch, DEFAULT_SPELL_REACH } from "./match.ts";
import { openBundled } from "./project.ts";
import { createTouch } from "./touch.ts";
import { DEV } from "./dev.ts"; // dev-only

export type StartAim = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void, aim?: StartAim): void {
const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const match = createMatch(docs);
const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
const cam: PlayCam = createCam(1);
let seated = false;
const dpr = (): number => devicePixelRatio || 1;
const band = (): { s: number; padX: number; padY: number; devW: number; devH: number } => {
  const ratio = dpr(), devW = canvas.clientWidth * ratio, devH = canvas.clientHeight * ratio;
  return { ...fit(devW, devH, match.world.grid.cols, match.world.grid.rows, ratio), devW, devH };
};
const seat = (): void => { const box = band(); if (canvas.clientWidth > 0) { seatCam(cam, box.s, dpr()); seated = true; } };
const env = { requestAnimationFrame: (cb: (ts: number) => void) => requestAnimationFrame(cb), cancelAnimationFrame: (id: number) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as HostEnv;
const load = (id: string): Promise<OffscreenCanvas> => {
  const px = pixels(id);
  if (px === undefined) return Promise.reject(new Error(id));
  const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
  if (g === null) return Promise.reject(new Error(id));
  const image = new ImageData(new Uint8ClampedArray(px.data), px.w, px.h);
  g.putImageData(image, 0, 0);
  return Promise.resolve(baked);
};
const hud = createHud({
  choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
  restart: () => { if (back !== undefined) { driver.dispose(); back(); } else location.reload(); }, closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
});
const driver = createDriver({
  env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
  view: () => {
    if (!seated) seat();
    const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
    if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
    hud.render(match.view());
    return { scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
  },
});
const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
const place = (): void => { const box = boardBox(innerHeight - (match.view().xp === null ? 0 : XP_H)); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
place(); addEventListener("resize", () => { place(); seated = false; });
seat();
if (aim?.unitId !== undefined) {
  const mine = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId && u.side === match.sides.me);
  if (mine === undefined) {
    const body = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId);
    if (body !== undefined) { const b = band(), shown = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, body.at, shown, 0, TILE, 0); clamp(cam, shown, match.world.grid.cols, match.world.grid.rows); }
  } else {
    match.feed({ type: "SelectUnit", unitId: mine.id });
    if (aim.aim === "basic" || aim.aim === "spell") {
      const kind = aim.aim;
      if (match.choose(kind) !== null) match.intend({ type: "ChooseAction", actionId: kind, unitId: mine.id });
      const table = kind === "spell" ? docs.rules.abilities?.[mine.unitId]?.[0]?.reach : docs.rules.reach?.[mine.unitId];
      const reach = typeof table === "number" && Number.isInteger(table) && table >= 1 ? table : kind === "spell" ? DEFAULT_SPELL_REACH : match.step.reach;
      const cells: { c: number; r: number }[] = [];
      for (let r = 0; r < match.world.grid.rows; r += 1) for (let c = 0; c < match.world.grid.cols; c += 1) if (inOrthogonalReach(mine.at, { c, r }, reach)) cells.push({ c, r });
      match.aims = cells; match.aimKind = kind;
    }
  }
}
if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link, __docs: docs }); // dev-only
if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { driver.dispose(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
driver.start();
}
const bootCanvas = document.querySelector("#board");
if (bootCanvas instanceof HTMLCanvasElement) { const opened = openBundled(); if (opened.docs === null) document.body.textContent = opened.error; else startMatch(opened.docs); }
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 0b067a0..2d73625 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -1,6 +1,7 @@
 import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
 import { ruleOf } from "../../src/project/rule-of.ts";
 import { WIN_CONDITION } from "../../src/rules/battle/win.ts";
+import { XP_LEVELS } from "../../src/rules/behaviours/xp-levels.ts";
 import { installOne } from "../../src/rules/behaviours/registry.ts";
 import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
 import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
@@ -33,6 +34,14 @@ function winOf(store: ProjectStore, stage: Obj): PlayOut["win"] {
   if (hit.source === "default" && !(Array.isArray(store.slice["behaviours"]) && store.slice["behaviours"].some((row) => isObj(row) && row["id"] === "win-condition"))) return undefined;
   return WIN_CONDITION.install({ get: (key) => knob(isObj(setup) ? setup : {}, store.slice, "win-condition", key), unsupported(key, why) { throw new Error(why === undefined ? `play: win-condition ${key}` : `play: win-condition ${key} ${why}`); } });
 }
+function levelsOf(store: ProjectStore, stage: Obj): PlayOut["levels"] {
+  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "xp-levels"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
+  if (hit.source === "default") return undefined;
+  if (!isObj(setup)) throw new Error("play: xp-levels");
+  const rules = XP_LEVELS.install({ get: (key) => knob(setup, store.slice, "xp-levels", key), unsupported(key, why) { throw new Error(why === undefined ? `play: xp-levels ${key}` : `play: xp-levels ${key} ${why}`); } });
+  if (rules === null) throw new Error("play: xp-levels");
+  return { rules, pools: {} };
+}
 /** Adapter only. Document JSON is already read by readProject. */
 export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
@@ -60,8 +69,8 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   }
   const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
   const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
-  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage);
-  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }) };
+  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage);
+  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }) };
 }
 export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
   try {
```

Full file as merged:

```ts
import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
import { ruleOf } from "../../src/project/rule-of.ts";
import { WIN_CONDITION } from "../../src/rules/battle/win.ts";
import { XP_LEVELS } from "../../src/rules/behaviours/xp-levels.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";
import { docsToInput, RECIPES, type Looks, type PlayDocs, type Recipe } from "./load.ts";
import { DEMO_LOOKS } from "./looks.ts";
import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json" with { type: "json" }; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json" with { type: "json" }; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json" with { type: "json" }; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json" with { type: "json" };
import u5 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000005.json" with { type: "json" }; import u6 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000006.json" with { type: "json" }; import u7 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000007.json" with { type: "json" };
import s1 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json" with { type: "json" }; import s2 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json" with { type: "json" }; import s3 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json" with { type: "json" }; import s4 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json" with { type: "json" }; import s5 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json" with { type: "json" };
type Obj = Record<string, unknown>;
export type PlayOut = PlayDocs & { readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[]; readonly names: Readonly<Record<string, string>>; readonly talk: Readonly<Record<string, string>> };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v), num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined), strs = (v: unknown): readonly string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const must = (v: number | undefined, why: string): number => { if (v === undefined) throw new Error(why); return v; };
function knob(setup: Obj, cat: Obj, behaviour: string, key: string): unknown {
  const answers = setup["answers"], row = isObj(answers) ? answers[key] : undefined;
  if (isObj(row) && row["source"] !== "default" && Object.hasOwn(row, "value")) return row["value"];
  const list = cat["behaviours"]; if (!Array.isArray(list)) return undefined;
  for (const b of list) if (isObj(b) && b["id"] === behaviour && Array.isArray(b["knobs"])) for (const k of b["knobs"]) if (isObj(k) && k["id"] === key) return k["default"];
  return undefined;
}
export const bundledFiles = (): ProjectFiles => ({
  "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDAM00000000000000000001.json": mapFile, "stages/stage_01JDAS00000000000000000001.json": stageFile,
  "units/unit_01JDAN00000000000000000001.json": u1, "units/unit_01JDAN00000000000000000002.json": u2, "units/unit_01JDAN00000000000000000003.json": u3, "units/unit_01JDAN00000000000000000004.json": u4, "units/unit_01JDAN00000000000000000005.json": u5, "units/unit_01JDAN00000000000000000006.json": u6, "units/unit_01JDAN00000000000000000007.json": u7,
  "setups/setup_01JDAT00000000000000000001.json": s1, "setups/setup_01JDAT00000000000000000002.json": s2, "setups/setup_01JDAT00000000000000000003.json": s3, "setups/setup_01JDAT00000000000000000004.json": s4, "setups/setup_01JDAT00000000000000000005.json": s5,
});
function winOf(store: ProjectStore, stage: Obj): PlayOut["win"] {
  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "win-condition"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
  if (hit.source !== "default" && !isObj(setup)) throw new Error("play: win-condition");
  if (hit.source === "default" && !(Array.isArray(store.slice["behaviours"]) && store.slice["behaviours"].some((row) => isObj(row) && row["id"] === "win-condition"))) return undefined;
  return WIN_CONDITION.install({ get: (key) => knob(isObj(setup) ? setup : {}, store.slice, "win-condition", key), unsupported(key, why) { throw new Error(why === undefined ? `play: win-condition ${key}` : `play: win-condition ${key} ${why}`); } });
}
function levelsOf(store: ProjectStore, stage: Obj): PlayOut["levels"] {
  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "xp-levels"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
  if (hit.source === "default") return undefined;
  if (!isObj(setup)) throw new Error("play: xp-levels");
  const rules = XP_LEVELS.install({ get: (key) => knob(setup, store.slice, "xp-levels", key), unsupported(key, why) { throw new Error(why === undefined ? `play: xp-levels ${key}` : `play: xp-levels ${key} ${why}`); } });
  if (rules === null) throw new Error("play: xp-levels");
  return { rules, pools: {} };
}
/** Adapter only. Document JSON is already read by readProject. */
export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
  const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
  const stage = store.stages[stageId ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
  const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
  const stepped = installOne(STEP_PATTERN, {}).out; if (stepped === null) throw new Error("play: step");
  const stats: Record<string, { hp: number; atk: number }> = {}, reach: Record<string, number> = {}, abilities: Record<string, { reach: number; damage: number; effectRef: string }[]> = {}, names: Record<string, string> = {};
  for (const [id, unit] of Object.entries(store.units)) {
    const st = isObj(unit["stats"]) ? unit["stats"] : {}, hpBag = st["unit_hp"], atkBag = st["unit_atk"], row = { hp: num(isObj(hpBag) ? hpBag["value"] : undefined) ?? hp0, atk: num(isObj(atkBag) ? atkBag["value"] : undefined) ?? atk0 };
    stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
    for (const sid of strs(unit["setupIds"])) {
      const setup = store.setups[sid]; if (setup === undefined) continue;
      if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "orth-only-1" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
      if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
    }
  }
  const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(root["loadout"]) ? root["loadout"] : {}, chosen: string[] = [];
  for (const id of [...strs(gear["required"]), ...strs(gear["roster"])]) if (!chosen.includes(id)) chosen.push(id);
  const talk: Record<string, string> = {};
  for (const n of Array.isArray(stage["neutrals"]) ? stage["neutrals"] : []) if (isObj(n) && typeof n["unitId"] === "string") for (const sid of strs(n["setupIds"])) {
    const setup = store.setups[sid], key = `talk-${n["unitId"]}`; if (setup === undefined || setup["behaviourId"] !== "talk" || Object.hasOwn(talk, key)) continue;
    const line = knob(setup, cat, "talk", "line"); talk[key] = typeof line === "string" ? line : "";
  }
  const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
  const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage);
  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }) };
}
export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
  try {
    const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
    if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
    const looks: Looks = { canopy: [], braziers: [] }, docs = { ...playDocsOf(load.project, stageId), looks };
    docsToInput(docs);
    return { docs, error };
  } catch (e) { if (!(e instanceof Error)) throw e; return { docs: null, error: e.message }; }
}
export function openBundled(): ReturnType<typeof openProject> {
  const got = openProject(bundledFiles());
  if (got.docs === null) return got;
  return { docs: { ...got.docs, looks: DEMO_LOOKS }, error: got.error };
}
export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
```

### `tests/editor/maker-law.test.ts` (edited)

```diff
diff --git a/tests/editor/maker-law.test.ts b/tests/editor/maker-law.test.ts
index fb5a46a..9c880f6 100644
--- a/tests/editor/maker-law.test.ts
+++ b/tests/editor/maker-law.test.ts
@@ -33,6 +33,9 @@ test("maker law holds, tokens match, and each plant fails", () => {
   const addPlant = (text: string): string[] => text.split("\n").flatMap((line, i) => { const goal = /["'](?:move|attack|defend|support|spells|status|ai)["']/.test(line), ident = /["'][a-z0-9]+(?:-[a-z0-9]+)+["']/.test(line); return [/["']group["']/.test(line) ? `${i + 1} group` : "", goal && ident ? `${i + 1} goal-id` : ""].filter((hit) => hit !== ""); });
   for (const rel of ["src/editor/unit/add.ts", "tools/maker/add-ability.ts"]) assert.deepEqual(addPlant(readFileSync(join(root, rel), "utf8")), [], rel);
   assert.deepEqual(addPlant('const x = { "line-shot": "attack" };\nconst y = "group";\n'), ["1 goal-id", "2 group"]);
+  const curvePlant = (text: string): string[] => text.split("\n").flatMap((line, i) => /\b(?:17|99|112)\b|\[\s*17\s*,\s*11/.test(line) ? [`${i + 1} curve`] : []);
+  for (const rel of ["src/editor/rules/levels.ts", "tools/maker/levels.ts"]) assert.deepEqual(curvePlant(readFileSync(join(root, rel), "utf8")), [], rel);
+  assert.deepEqual(curvePlant("const t = [17, 11, 13];\nconst n = 112;\nconst m = 99;\n"), ["1 curve", "2 curve", "3 curve"]);
   const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
   for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["doc.ts", "export const v = \"formatVersion\";\n"], ["unquoted.ts", "export const d = { kind: \"behaviour-setup\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
   rmSync(dir, { recursive: true });
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
      if (ts && (path.includes(`${sep}stage${sep}`) || path.includes(`${sep}unit${sep}`) || path.includes(`${sep}rules${sep}`)) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
      if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
      if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
    });
  }
  return hits;
}
const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
test("maker law holds, tokens match, and each plant fails", () => {
  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []); assert.deepEqual(lawHits(join(root, "src/editor/unit")), []); assert.deepEqual(lawHits(join(root, "src/editor/rules")), []);
  const css = readFileSync(join(root, "tools/maker/tokens.css"), "utf8"), darkAt = css.indexOf('html[data-theme="dark"]'), mediaAt = css.indexOf("@media (prefers-color-scheme: dark)"), bodyAt = css.indexOf("\nbody");
  for (const token of LIGHT) assert.ok(css.slice(0, darkAt).includes(token), token);
  for (const token of DARK) assert.ok(css.slice(darkAt, mediaAt).includes(token) && css.slice(mediaAt, bodyAt).includes(token), token);
  assert.match(css, /button, input \{ font: inherit; \}/);
  const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
  assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
  const addPlant = (text: string): string[] => text.split("\n").flatMap((line, i) => { const goal = /["'](?:move|attack|defend|support|spells|status|ai)["']/.test(line), ident = /["'][a-z0-9]+(?:-[a-z0-9]+)+["']/.test(line); return [/["']group["']/.test(line) ? `${i + 1} group` : "", goal && ident ? `${i + 1} goal-id` : ""].filter((hit) => hit !== ""); });
  for (const rel of ["src/editor/unit/add.ts", "tools/maker/add-ability.ts"]) assert.deepEqual(addPlant(readFileSync(join(root, rel), "utf8")), [], rel);
  assert.deepEqual(addPlant('const x = { "line-shot": "attack" };\nconst y = "group";\n'), ["1 goal-id", "2 group"]);
  const curvePlant = (text: string): string[] => text.split("\n").flatMap((line, i) => /\b(?:17|99|112)\b|\[\s*17\s*,\s*11/.test(line) ? [`${i + 1} curve`] : []);
  for (const rel of ["src/editor/rules/levels.ts", "tools/maker/levels.ts"]) assert.deepEqual(curvePlant(readFileSync(join(root, rel), "utf8")), [], rel);
  assert.deepEqual(curvePlant("const t = [17, 11, 13];\nconst n = 112;\nconst m = 99;\n"), ["1 curve", "2 curve", "3 curve"]);
  const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["doc.ts", "export const v = \"formatVersion\";\n"], ["unquoted.ts", "export const d = { kind: \"behaviour-setup\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
  rmSync(dir, { recursive: true });
});
```

