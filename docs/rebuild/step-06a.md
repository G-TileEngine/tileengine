# Rebuild record: step 6a, win rules and a playable Empty

Original brief: [`docs/maker/steps/step-06-levels-win-rules.md`](../maker/steps/step-06-levels-win-rules.md) on the merge (r2, blob `c846699d`, sha256 `a80602396f4839157d1009166e84bd629c61c2c8ba5a9a1326f73f3fb3183192`, 248 lines): the 6a sections (L86-146), Done when (L139-146), the count command (L82), Check 8 (L37), and the Empty / On-your-team behaviour (L97-98). The same blob is on current main, the product base, the tip and the code head. Do [`step-05c.md`](step-05c.md) first. This file records exactly what shipped.

Sources: PR #90 and branch `step/step-06a-win-rules-r1-chatA` (tip `c1500bb4`, code head `bda2ea6c`); `handback/step-06a-win-rules/r1/HANDBACK.md` at `c1500bb4` and on the merge (HB, blob `ab5e63c0`, 175 lines); Chief Of Staff verify report `/workspace/share/step-06a-verify/report.md` (V, sha256 `5bd18645346da4731735591033e68f59ce13b362250f2ed3c40dd7b1c904b467`, hash-object `c40a62b29b8cca8c535947653052736994a3542e`, 37 lines). `docs/qa/step-06a-review.md` (QA, git hash-object `2903cda2`, 79 lines, on main `0ac31c87`): **OK TO MERGE**, no must-fix (QA:3, QA:78-79). Line numbers are at the commit named. Code line cites are at merge `23b5755f` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `ae968eb052cd137e025dc95446280c8546d69c67`, step-06 guide r2 + QA reviews, 2026-11-21 18:19 (UK time). Floor **1082** tests (guide L140: 1082 + N; 5c's final count). After this merge the floor is **1093**. Current `origin/main` at merge time was `1b358d045bff9cb1901dfd0628d987a19da02d08` (2026-11-21 18:20 UK time), docs-only on top of the base: `handoff/dsk-rulings/2026-11-17-phase1.md` adds D25 and D26 and fixes the D3 line cites |
| r1 commits | `bda2ea6c5ee790857e3967eaac93f155d88c3e10` feat(maker): stage win rules and a playable Empty (code head, tree `8e2a63d8fc6b255f754c371b6c1a884fd5a2e603`, 2026-11-21 21:26 UK time), `c1500bb4f5c2883ff8a04f4e4bc64464b7c97c94` docs(handback): step-06a-win-rules r1 (tree `d6dd2f409147726d56cc0512265543489bfecfd2`, 2026-11-21 21:27 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the hand-back folder only (6 files, 175 insertions): `HANDBACK.md` and five pngs |
| r1 verdict | QA **OK TO MERGE** (QA:3). No must-fix, no rework round (QA:78-79). Green 1093/0, G7 392, s6a ×3 (one under CPU load), S0, s3 and s4a all pass (V, QA:7-18). Non-blockers (QA:73-76) are recorded below |
| Merge | PR #90 "Step 6a: win rules, Rules panel, On your team", merge commit `23b5755f691a0f18aaad7c373242f081423d2419`, 2026-11-21 23:04 (UK time). Tree `2c08b39140d60e1f0626561ade40dce361f6fbcb` (the same tree CoS and QA predicted against `1b358d04`; V, QA:20). First parent `1b358d04` (main at merge, not the product base), second parent `c1500bb4` |
| After the merge | main is `0ac31c878e99790447eaa59989e2c26d2cd7d199`, 2026-11-21 23:05 (UK time), which adds only `docs/qa/step-06a-review.md`. QA postmerge: Postmerge PASS (QA): merge 23b5755f, 1093/0, pins 5/5, smoke 0 failed. |
| Tests | 1082 + N=11 (`stage rule overrides project rule`, `first rule edit re-cuts the slice`, `win rule reaches Test`, `win rule needs P = B`, `wired win knob changes the adapter`, `empty template plays`, `empty board asks for a unit`, `old empty project gets the plain sentence`, `on your team writes the loadout`, `canUpdate refuses drifted knobs`, `addable keeps goal-less primaries`) = **1093 pass / 0 fail**. Floor after this merge is **1093** (HB:36-45, V, QA:8). The 5c `canUpdate` carry is closed (QA:8) |
| Size | Accepted measure of this step, `git diff --shortstat ae968eb0..bda2ea6c -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s6a-win-rules/**'`, is 21 files, **362 insertions + 30 deletions = 392** ≤ 400 (G7: `docs/qa/handback-checklist.md` L26 and `BUILD_GUIDE.md` L123, insertions plus deletions; guide L82, L127, L140; QA:10, V, HB:46). The same shortstat holds at the tip `c1500bb4` and against first parent `1b358d04` at the merge. Against the product base `ae968eb0` at the merge, the official command is 22 files, 365+31, because the merge also carries `handoff/dsk-rulings/2026-11-17-phase1.md` from first parent (3+/1−); that file is not a 6a product change. The 329 figure at guide L127 is the sum of file caps, not a second gate (QA:10). Without the excludes, at the code head: 26 files, 2355 insertions and 37 deletions (QA:10; the Empty slice and army are data). The s6a smoke is 76 lines, under its own cap of 130 (guide L125, L82; HB:47) |
| Stamp | `node tools/maker/build.ts` writes stamp `4eb4ed272938` at the code head, the tip and the merge (same maker and play-stage sources). The export audit used that stamp (HB:152-155, QA:25, V) |
| Smoke | `tools/play-stage/load.ts`, `match.ts` and `project.ts` changed, so S0 is required (guide L137, L143). S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`) is unedited. The s6a smoke prints `SMOKE PASS` once, after 18 ok lines at 390 and at 360, under google-chrome on port 8805, and also passes under eight CPU-burn loops; S0 on 8797, s3 on 8798 (after its one-line edit) and s4a on 8799 (after its one-line edit) all pass (guide L129, L143; HB:53-137; V; QA:14-18) |

## (b) Files

From `git diff --name-status ae968eb0..c1500bb4 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base (which is what the 6a step added). The same product files are on the merge tree `2c08b391`. The DSK rulings file on the merge is from first parent `1b358d04`, not from this branch.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `data/templates/empty.tileproj/**` | edited + new setup | data | Army setup, `project.rules`, slice at rev 30, `catalogueRev` 30 (guide L103). Uncounted |
| `data/templates/setup.rule.json` | new | 21 (data) | Rule skeleton (`name` "Rule"). Uncounted (guide L104) |
| `src/project/rule-of.ts` | new | 11 (cap 12) | Pure `ruleOf(project, stageId, behaviourId)` → `{source, setupId}` (guide L105) |
| `src/editor/rules/rules.ts` | new | 54 (cap 55) | Pure `setStageRule`, `resetStageRule`, source line from `ruleOf` (guide L106) |
| `src/editor/unit/team.ts` | new | 18 (cap 20) | Pure `onTeam`, `setTeam` (roster and `size`; D25) (guide L107) |
| `tools/maker/rules-panel.ts` | new | 87 (cap 60) | Rules sheet. Over the file cap; named in HB:172 |
| `tools/maker/stage.ts` | edited | 7 (4+/3−, cap 12) | Rules button and sheet mount; drop the occupied "A unit stands here" line (guide L109) |
| `tools/maker/units.ts` | edited | 5 (4+/1−, cap 12) | On your team toggle (guide L110) |
| `tools/maker/home.ts` | edited | 19 (13+/6−, cap 10) | Route `r:` and team acts, and rule Undo off the stage screen (guide L111). Over the file cap, inside the allowed +10 (guide L82); named in HB:172 |
| `src/rules/behaviours/wired.ts` | edited | 1 (cap 1) | `"win-condition": ["wipe_wins"]` (guide L112) |
| `tools/play-stage/project.ts` | edited | 12 (10+/2−, cap 8) | `win` from `WIN_CONDITION.install` on the `ruleOf` setup (guide L113). Over the file cap; named in HB:172 |
| `tools/play-stage/load.ts` | edited | 3 (2+/1−, cap 2) | `PlayDocs.win?: WinRule` (guide L114). Over the file cap; named in HB:172 |
| `tools/play-stage/match.ts` | edited | 6 (3+/3−, cap 3) | `body.win ?? installOne(WIN_CONDITION, {}).out` (guide L115). Over the file cap; named in HB:172 |
| `src/editor/project/test-gate.ts` + `tools/maker/test-launch.ts` | edited | 6 (3+ + 2+/1−, cap 10) | `emptyBoard`; the "Place a unit…" line returns before `start` (guide L116) |
| `tools/maker/unit-diagram.ts` | edited | 3 (2+/1−, cap 2) | `playLine(reason)` in `diagramHtml` (guide L117). Over the file cap; named in HB:172 |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` | edited | 2 (1+/1−, cap 1) | L122 only: the empty-blocked sentence (guide L118). Over the file cap; named in HB:172 |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | edited | 2 (1+/1−, cap 1) | L28 `note:` only (guide L119). Over the file cap; named in HB:172 |
| `tests/editor/rules.test.ts` | new | 102 (cap 60) | Eight of the eleven named tests (guide L120, L141-142). Over the file cap; named in HB:172 |
| `tests/editor/units.test.ts` | edited | 15 (14+/1−, cap 15) | `on your team writes the loadout` (guide L121) |
| `tests/tools/play-stage-source.test.ts` | edited | 6 (3+/3−, cap 8) | Empty opens; Test stays in the maker with the place-a-unit line (guide L122) |
| `tests/editor/add-ability.test.ts` | edited | 29 (25+/4−, cap 35) | Empty-minus-army reason line, plus the two 5c carry tests (guide L123) |
| `tests/editor/maker-law.test.ts` | edited | 4 (2+/2−, cap 2) | Scan `src/editor/rules/**` (guide L124). Over the file cap; named in HB:172 |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | new | 76 (cap 130) | Browser smoke, own cap, outside the 400 (guide L125). Measures check 8 with the Rules panel, the unit editor and the unit sheet open |

No other product file. Nothing under `tests/tools/golden/`, `behaviour-library/**`, `src/rules/behaviours/catalogue.ts`, `tools/maker/catalogue.ts`, `package.json` or `package-lock.json`. No levels / `xp-levels` / checkpoint work. No new CSS.

One-job rule (`docs/qa/handback-checklist.md` §3 I, L67): no touched code file is over about 500 lines. The largest are `tools/maker/stage.ts` at 264, `tools/maker/units.ts` at 183, `tools/play-stage/match.ts` at 171 and `tools/maker/home.ts` at 151.

## (c) Key code and git commands

The stage editor's top bar gains a ghost **Rules** button after View (`tools/maker/stage.ts:146`). The sheet is `tools/maker/rules-panel.ts` (87 lines), titled "Rules · \<stage name\>", with the wipe toggle (default On), a source line from `ruleOf`, Reset to default, the nobody-wins line when Off, and "You lose when all your units fall." only while On. `ruleOf` (`src/project/rule-of.ts:1-11`) is stage, then project, then `{ source: "default", setupId: "" }`. The first edit copies `setup.rule.json` and adds the id to `stage.rules`; `setStageRule` / `resetStageRule` live in `src/editor/rules/rules.ts`. P < B shows the 5c offer and writes nothing; P > B shows the newer note and Close only (`rules-panel.ts:43`; HB:167).

Test plays the stage rule. `winOf` (`tools/play-stage/project.ts:30-35`) installs `WIN_CONDITION` on the `ruleOf` setup and omits `PlayDocs.win` when the source is default and the slice has no `win-condition`. `createMatch` then keeps the engine default (`tools/play-stage/match.ts:21`):

```ts
  const win = body.win ?? installOne(WIN_CONDITION, {}).out;
```

`win === null` still throws (`match.ts:22`). After the first edit the slice contains `win-condition`, so Reset reads the slice default true and the setup stays; the source line stays "This stage's rule" (HB:166). `PlayDocs` gains `win?: WinRule` (`tools/play-stage/load.ts:22`). `WIRED` gains `"win-condition": ["wipe_wins"]` (`src/rules/behaviours/wired.ts:7`).

**On your team** sits under Attack (`tools/maker/units.ts:102`). A new unit starts Off: `newUnit` (`src/editor/unit/units.ts:6`) writes no loadout. `setTeam` (`src/editor/unit/team.ts:12-18`) is D25:

```ts
export function setTeam(files: Record<string, Obj>, unitId: string, on: boolean): Record<string, Obj> {
  const got = rootOf(files); if (got === null) return files;
  const roster = list(got.gear["roster"]).filter((id): id is string => typeof id === "string" && id !== unitId);
  if (on) roster.push(unitId);
  const loadout = { ...got.gear, roster, size: Math.max(1, roster.length) };
  return { ...files, "project.json": { ...got.root, project: { ...got.project, loadout } } };
}
```

It writes only `project.json`'s whole `loadout` object, appends without a duplicate, keeps any existing `required`, and never writes `stage.loadout`. Off removes. The named test is `tests/editor/units.test.ts:45-56`.

Empty is playable (D26). The army is `setup_01M7XPE6006A10000000000000` (not the Demo's), `catalogue.rev` 30, listed on `project.rules`, `project.catalogueRev` 30 (`data/templates/empty.tileproj/project.json:11, 18-20`). Every knob including `team_colour` (catalogue default `null`) is `{source:"default"}`; Health 9 / Attack 1 come from the catalogue, not typed numbers. `catalogue/slice.json` is byte-equal to `sliceOf(bundled, ["unit-roster", "terrain"])` (sha256 `3538f4fea781a30132895cafdf549017dcd594f8185986a30e059143003a5cc3`, 58259 bytes; HB:169, QA:23, V). An empty roster with `size` 1 is today's Empty loadout. No migration of projects saved from the old Empty (rev 1).

`emptyBoard` (`src/editor/project/test-gate.ts:19`) is no team unit on a start tile, no NPC and no enemy; one side only still plays. `tools/maker/test-launch.ts:25` returns "Place a unit on this stage to test it." before `start`. The occupied unit sheet is `tools/maker/stage.ts:154` (`h2` is the name and team, no "A unit stands here"); the paint refusal at `stage.ts:220` still uses that sentence when painting a closed type onto a busy tile (QA:23).

The adapter guard is unchanged in text and still throws (`tools/play-stage/project.ts:41-42`; it moved down from :33-34 because `winOf` was inserted above):

```ts
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
```

`diagramHtml` (`tools/maker/unit-diagram.ts:43`) runs that message through `playLine` (`test-gate.ts:16`) into `<p class="sub" data-diagram="off">`, so the visible line is "This project has no unit roster yet, so it can't be played". `diagramCells` still throws the raw `play: army`. The named tests are `the Empty template gives that visible reason line` (`tests/editor/add-ability.test.ts:94-102`, Empty minus its army) and `old empty project gets the plain sentence` (`tests/editor/rules.test.ts:93-102`).

The eight named tests in `tests/editor/rules.test.ts` start at `:35`, `:49`, `:61`, `:67`, `:77`, `:86`, `:87` and `:93`. The two 5c carry tests are `tests/editor/add-ability.test.ts:103` and `:114`.

The s6a smoke (`handoff/steps/tests/s6a-win-rules/smoke.mjs`, 76 lines) has no `waitForTimeout`. `tap()` and `press()` (L15-16) use `locator.waitFor` only. Every other wait is `page.waitForFunction`. Check 8 (`8 targets @${width}`, L71) collects via `big()` while the Rules panel is open (L32, L35), the occupied unit sheet is open (L51) and the unit editor (On your team) is open (L55, also L61-62). At 360, `cover()` asserts the toast overlaps no 48 px target of the Rules sheet (L36) or the unit editor (L55) (guide L37, L76, L129; HB:53).

Frozen smokes are one line each (HB:171). s3 L122 only: `"no unit roster yet"` → `"Place a unit on this stage to test it"` (sha256 `7c375c00…` → `7d8d570e…`). s4a L28 `note:` only: the occupied check is the sheet title containing `" · "` (sha256 `040e6011…` → `68a00fd3…`). S0 stays `d528795e…`.

Zero changes under `behaviour-library/**`, `src/rules/behaviours/catalogue.ts` or `tools/maker/catalogue.ts`. The export audit (HB:146-155, QA:25, V) builds play-stage and maker at forty zeros: `rg` of `tools/maker`, `src/editor`, `catalogue.json.js` and `behaviours.json` under the play-stage trees hits only the existing comment in `src/rules/behaviours/catalogue.js` (rev 26 stamp). `catalogue.json.js` ships only under the maker stamp `4eb4ed272938`.

## (d) What went wrong, in order, and the fix

**r1.** The product shipped in one feat commit and green was 1093/0. The official gate was 362 + 30 = 392. s6a passed three times (one under CPU load), as did S0, s3 and s4a, including check 8 with the Rules panel, the unit editor and the unit sheet open, and the toast-over-sheet assertion at 360. Every over-cap file is named in HB:172. The tip holds only `HANDBACK.md` and the five screenshots. A self-review fix landed in the code head, before the tip: rule Undo on the project screen was going to the room handler; the router now takes `undo` whenever `state.undo === "rule"`, and the 6 s timer repaints the project screen too (`tools/maker/home.ts:96`; HB:161).

QA **OK TO MERGE** (QA:3). No must-fix. The merge tree is `2c08b391`, as predicted (QA:20, V).

HB:3 said `PR: opened by Chief Of Staff from the branch` when CoS verified, before a PR existed (V item 10). After PR #90 that line is true (QA:28). It is not a product issue.

## (e) Do it right first time

- Start from the step-06-guide-r2-on-main commit `ae968eb0`, or from later main if it is still docs-only on that commit. The floor at the start of 6a is 1082 + N; this merge leaves the floor at 1093.
- Put the rule model in `src/editor/rules/rules.ts` and `src/project/rule-of.ts`, the team model in `src/editor/unit/team.ts`, and the Rules sheet in `tools/maker/rules-panel.ts`. Do not edit `behaviour-library/**` or `catalogue.ts`. Do not import `tools/maker` or `src/editor` into `tools/play-stage`. Do not add wipe or win logic outside `src/rules/battle/win.ts`. Do not put a default army in the adapter; the Empty fix is data (D26).
- A new unit starts Off (`newUnit` writes no loadout). `setTeam` writes only `project.loadout`, `size = max(1, |roster|)`, On appends, Off removes, `required` is kept, and no `stage.loadout` is written (D25).
- Leave the `play: army` throw in the adapter as a guard for old Empty projects. Map it through `playLine` for the visible sentence. Add a named test that an old Empty (no army, `catalogueRev` 1) is not migrated and still throws.
- If you edit `tools/play-stage/`, run S0 and keep sha256 `d528795e…`. Run an export audit: the maker catalogue must not appear in the play-stage or APK output.
- A file may go over its cap if the total stays within 400, but the hand-back must name **every** over-cap file and why (guide L82). `home.ts` may pass its cap by up to 10; `stage.ts` may pass by up to 5 in 6a. Extra files must also be named. Frozen-smoke edits must be exactly the named line, with sha256 before and after.
- A smoke that claims “every target is 48 px” must measure the Rules panel, the unit editor with On your team, and the stage sheet of a placed unit **while they are open**, and must print a `8 targets @<width>` line at 390 and at 360. At 360 also assert the toast covers no 48 px target of the open Rules sheet or unit editor. New waits are `waitForFunction`, not `waitForTimeout`.
- Paste the ok lines and `SMOKE PASS` from one solo run in § Smoke (guide L35). A CPU-burn note can follow the paste. The tip commit should hold `HANDBACK.md` and the screenshots, not raw test logs. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time.
- Measure with the count command (guide L82), with `':!handoff/steps/tests/s6a-win-rules/**'`. Count insertions plus deletions (checklist L26, `BUILD_GUIDE.md` L123). 392 is the accepted number for this step. On a merge whose first parent is not the product base, measure against that first parent (or at the code head), and do not treat first-parent docs or rulings files as 6a lines.

## (f) Rebuild check

From a clean tree at `1b358d04` (main at the merge, which already has D25/D26), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Measuring against the product base `ae968eb0` is also fine if you do not add the DSK rulings file; the official number below is against the first parent, which matches the code head.

```bash
# Product gate. The first parent of the merge is 1b358d04, not the product
# base ae968eb0. Official command at the code head, the tip, or the merge
# against 1b358d04:
git diff --shortstat 1b358d04..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s6a-win-rules/**' ':!docs/**'
#   21 files changed, 362 insertions(+), 30 deletions(-)

git diff --shortstat ae968eb0..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s6a-win-rules/**'
#   at the r1 code head or r1 tip:
#   21 files changed, 362 insertions(+), 30 deletions(-)
#   at the merge, this command also counts handoff/dsk-rulings/2026-11-17-phase1.md
#   (22 files, 365 insertions, 31 deletions). That file is not this step.

sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --stat 1b358d04..HEAD -- tests/tools/golden/   # empty

sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

git diff --stat 1b358d04..HEAD -- behaviour-library/ src/rules/behaviours/catalogue.ts tools/maker/catalogue.ts   # empty

npm ci && npm run green   # 1093 pass, 0 fail. Includes:
#   ✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
#   ✔ stage rule overrides project rule
#   ✔ first rule edit re-cuts the slice
#   ✔ win rule reaches Test
#   ✔ win rule needs P = B
#   ✔ wired win knob changes the adapter
#   ✔ empty template plays
#   ✔ empty board asks for a unit
#   ✔ old empty project gets the plain sentence
#   ✔ on your team writes the loadout
#   ✔ canUpdate refuses drifted knobs
#   ✔ addable keeps goal-less primaries

# Smokes under google-chrome, at 390 and 360 CSS px:
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805
#   18 ok lines @390 and @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798
#   ok 1-9 @390, ok 1-9 @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS

# The s6a smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s6a-win-rules/smoke.mjs` is 76.
# `node tools/maker/build.ts` writes stamp 4eb4ed272938.
# S0 is required (play-stage changed). Run the export audit in HB:146-155.
```

Against the merge tree: on your rebuild branch, `git diff 23b5755f HEAD -- src/editor/project/test-gate.ts src/editor/rules/rules.ts src/editor/unit/team.ts src/editor/unit/units.ts src/project/rule-of.ts src/rules/behaviours/wired.ts tools/maker/home.ts tools/maker/rules-panel.ts tools/maker/stage.ts tools/maker/test-launch.ts tools/maker/unit-diagram.ts tools/maker/units.ts tools/play-stage/load.ts tools/play-stage/match.ts tools/play-stage/project.ts tests/editor/add-ability.test.ts tests/editor/maker-law.test.ts tests/editor/rules.test.ts tests/editor/units.test.ts tests/tools/play-stage-source.test.ts data/templates/setup.rule.json data/templates/empty.tileproj/catalogue/slice.json data/templates/empty.tileproj/project.json data/templates/empty.tileproj/setups/setup_01M7XPE6006A10000000000000.json handoff/steps/tests/s3-test/touch-smoke.mjs handoff/steps/tests/s4a-stage-paint/smoke.mjs handoff/steps/tests/s6a-win-rules/smoke.mjs` must be empty. (`src/editor/unit/units.ts` is listed so a rebuild cannot silently edit `newUnit`; it is unchanged vs the base, so `git diff 23b5755f` is empty for it either way.) The blob table below lists the exact git blob id each 6a file must have at `23b5755f`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id. Those product blobs must also match code head `bda2ea6c`.

## QA non-blockers carried forward

From QA:73-76. None of these blocked the PR.

1. **Chrome / Node.** HB:51 is a Playwright headless shell. QA and CoS re-ran with `/opt/google/chrome/chrome` 156.0.8078.47. HB:4 is Node v22.23.3; `.nvmrc` pins 24 (QA:74).
2. **4a/4b/4c carries** are still open, including uncapped stage undo, the maker-law plant with no `try/finally`, talk `createdAt`, session-only unused delete, and Path and Dirt hidden (QA:75).
3. **Empty `play: army` guard.** Correctly left in place at `tools/play-stage/project.ts:41-42` (D26, guide L98). The new Empty template is playable; old Empty projects still hit the throw and see the plain sentence. Carry the guard until those old projects take the catalogue update path (D24).
4. **D22 effect ids** (`src/editor/effect/save.ts`) still due by step 10. The `catalogue.ts` regen to rev 30 remains its own run. Neither is in this diff (QA:76).

## Blob check

Each file must have exactly this git blob id at `23b5755f`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/editor/project/test-gate.ts` | `1a60ea7df07e69af592df78f2b37e74bdfd6b187` | 26 |
| `src/editor/rules/rules.ts` | `b2f1e639ed9cfc882a736af1308f819378e7112c` | 54 |
| `src/editor/unit/team.ts` | `64b2c6ab490266cd5822543b1e84a427688ec4d9` | 18 |
| `src/project/rule-of.ts` | `4213d75a63c80a6e643cb6e1afce99f1d0e65796` | 11 |
| `src/rules/behaviours/wired.ts` | `673a9ef95a65daf12b213a3731caf958c95e7baf` | 8 |
| `tools/maker/home.ts` | `59678efb99b1ab93b2f639277cc9ab56c204e5a6` | 151 |
| `tools/maker/rules-panel.ts` | `886fee255743a9dad76ef243e2fb5ffbf8aaa1bb` | 87 |
| `tools/maker/stage.ts` | `0907b4f4ce290efcdffdaa3c9ebb30bffe335474` | 264 |
| `tools/maker/test-launch.ts` | `fa49411a3a4285d05e9639c8afb3d5f0a2202fa8` | 43 |
| `tools/maker/unit-diagram.ts` | `5333c031b30be09a6cce8d5d95911b5887eb9b72` | 43 |
| `tools/maker/units.ts` | `bd7142ad6ebb311b043a036b71a2d4d79f50db93` | 183 |
| `tools/play-stage/load.ts` | `697739883387b78497e819e6e4a77693d955bf8a` | 27 |
| `tools/play-stage/match.ts` | `19703eb2dcab3b1571763e68e592c420a0bc6fc0` | 171 |
| `tools/play-stage/project.ts` | `0b067a0e95050f0dbd8e7a02bc151324d5dcfc44` | 80 |
| `tests/editor/add-ability.test.ts` | `7546a9d422de10e2715e451e50cd91300923ddc8` | 120 |
| `tests/editor/maker-law.test.ts` | `fb5a46aece68e07757b26a1eefc3cb9194cd2cb4` | 39 |
| `tests/editor/rules.test.ts` | `f91fac8af0bb118e4e97fa9a733cd200cbd1b30e` | 102 |
| `tests/editor/units.test.ts` | `61ae795747bedddc5d448400b59b915d82a944e2` | 56 |
| `tests/tools/play-stage-source.test.ts` | `17c7bb64fcb17eca40679febc71487d28687b5eb` | 93 |
| `data/templates/setup.rule.json` | `b7181bbaee5a32571b0e1bd690ca1fbb5a0a9fef` | 21 |
| `data/templates/empty.tileproj/catalogue/slice.json` | `7d321ca4cfa1786a56fb28cc3c00acde07cba194` | 1839 |
| `data/templates/empty.tileproj/project.json` | `950fb1dabce281a96adf1006031964050814c843` | 27 |
| `data/templates/empty.tileproj/setups/setup_01M7XPE6006A10000000000000.json` | `1bc3c09ab0ca9677fa199ccda722fa81cef45535` | 46 |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` | `eeb55b28448c188365fec21127f668d489ccc9c0` | 129 |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | `b089d6d1ac630ef1be21f4cd088f053d7bd24fc8` | 48 |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | `11c0639999f47707cb886a031716a508c0abe616` | 76 |

## Appendix: full code as merged (step 6a, PR #90)

New files are given in full. Edited files are given as the exact diff from `ae968eb0` to `23b5755f`, then in full as merged. Copy them byte for byte; the blob table checks you did. Product, tests, the smoke and the Empty / rule data are identical to code head `bda2ea6c`. The merge tree also carries `handoff/dsk-rulings/2026-11-17-phase1.md` from first parent `1b358d04` (D25/D26); that file is not a 6a product file and is not in this appendix. The hand-back is at the tip (and on the merge).

### `src/project/rule-of.ts` (new)

```ts
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export type RuleHit = { readonly source: "stage" | "project" | "default"; readonly setupId: string };
export type RuleBag = { readonly manifest: unknown; readonly stages: Readonly<Record<string, unknown>>; readonly setups: Readonly<Record<string, unknown>> };
/** Stage setup wins, else the project setup, else catalogue defaults. */
export function ruleOf(project: RuleBag, stageId: string, behaviourId: string): RuleHit {
  const stage = project.stages[stageId], root = isObj(project.manifest) && isObj(project.manifest["project"]) ? project.manifest["project"] : {};
  const hit = (ids: readonly unknown[], source: "stage" | "project"): RuleHit | null => { for (const id of ids) { if (typeof id !== "string") continue; const setup = project.setups[id]; if (isObj(setup) && setup["behaviourId"] === behaviourId) return { source, setupId: id }; } return null; };
  return hit(isObj(stage) ? list(stage["rules"]) : [], "stage") ?? hit(list(isObj(root) ? root["rules"] : undefined), "project") ?? { source: "default", setupId: "" };
}
```

### `src/editor/rules/rules.ts` (new)

```ts
import { sliceDoc, sliceOf, type CatalogueDoc } from "../../project/slice-of.ts";
import { ruleOf, type RuleBag, type RuleHit } from "../../project/rule-of.ts";
import { addCase, catalogueRev } from "../unit/add.ts";
import { resetAnswer, setAnswer } from "../unit/panel.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const behaviours = (doc: Obj): Obj[] => list(doc["behaviours"]).filter(isObj);
export function ruleBag(files: Obj): RuleBag {
  const stages: Record<string, Obj> = {}, setups: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(files)) {
    if (!isObj(doc) || typeof doc["id"] !== "string") continue;
    if (path.startsWith("stages/")) stages[doc["id"]] = doc; else if (path.startsWith("setups/")) setups[doc["id"]] = doc;
  }
  return { manifest: files["project.json"], stages, setups };
}
export const ruleLine = (source: RuleHit["source"]): string => source === "stage" ? "This stage's rule" : source === "project" ? "Same as project" : "Default rule";
const copyBag = (files: Obj): Record<string, Obj> => { const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(files)) if (isObj(doc)) bag[path] = doc; return bag; };
const usedIds = (slice: Obj): string[] => behaviours(slice).flatMap((row) => typeof row["id"] === "string" ? [row["id"]] : []);
function answersOf(row: Obj): Obj {
  const answers: Obj = {}; for (const knob of list(row["knobs"]).filter(isObj)) { if (typeof knob["id"] !== "string" || !Object.hasOwn(knob, "default") || (typeof knob["no_default_reason"] === "string" && knob["no_default_reason"] !== "")) continue; answers[knob["id"]] = { source: "default" }; } return answers;
}
function stageAt(files: Obj, stageId: string): { readonly path: string; readonly doc: Obj } | null { for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && doc["id"] === stageId) return { path, doc }; return null; }
function held(files: Obj, stage: Obj, behaviourId: string): { readonly path: string; readonly doc: Obj } | null { for (const id of list(stage["rules"])) if (typeof id === "string") { const doc = files[`setups/${id}.json`]; if (isObj(doc) && doc["behaviourId"] === behaviourId) return { path: `setups/${id}.json`, doc }; } return null; }
export type RuleWrite = { readonly mode: "wrote"; readonly bag: Record<string, Obj>; readonly slice: string } | { readonly mode: "older" | "newer" | "missing" };
export function setStageRule(files: Obj, skel: Obj, stageId: string, setupId: string, behaviourId: string, knob: string, value: unknown, bundled: CatalogueDoc): RuleWrite {
  const gate = addCase(files, bundled); if (gate.mode !== "same") return { mode: gate.mode === "newer" ? "newer" : "older" };
  const stage = stageAt(files, stageId), slice = files["catalogue/slice.json"]; if (stage === null || !isObj(slice)) return { mode: "missing" };
  const row = behaviours(bundled).find((item) => item["id"] === behaviourId); if (row === undefined) return { mode: "missing" };
  const spec = list(row["knobs"]).filter(isObj).find((item) => item["id"] === knob), def = spec?.["default"];
  const have = held(files, stage.doc, behaviourId);
  if (have !== null) {
    const answers = isObj(have.doc["answers"]) ? have.doc["answers"] : {}, bag = copyBag(files);
    bag[have.path] = { ...have.doc, answers: setAnswer(answers, knob, value, def) };
    return { mode: "wrote", bag, slice: "" };
  }
  const next = structuredClone(skel), catalogue = isObj(next["catalogue"]) ? { ...next["catalogue"] } : {};
  next["id"] = setupId; next["name"] = "Rule"; next["behaviourId"] = behaviourId; catalogue["rev"] = catalogueRev(bundled); next["catalogue"] = catalogue;
  next["answers"] = setAnswer(answersOf(row), knob, value, def);
  const ids = [...list(stage.doc["rules"]).filter((id): id is string => typeof id === "string"), setupId], used = usedIds(slice);
  if (!used.includes(behaviourId)) used.push(behaviourId);
  const sliced = sliceDoc(bundled, used); if (!isObj(sliced)) return { mode: "missing" };
  const bag = copyBag(files);
  bag[stage.path] = { ...stage.doc, rules: ids }; bag[`setups/${setupId}.json`] = next; bag["catalogue/slice.json"] = sliced;
  return { mode: "wrote", bag, slice: sliceOf(bundled, used) };
}
export function resetStageRule(files: Obj, stageId: string, behaviourId: string, knob: string): RuleWrite {
  const stage = stageAt(files, stageId); if (stage === null) return { mode: "missing" };
  const have = held(files, stage.doc, behaviourId); if (have === null) return { mode: "wrote", bag: files as Record<string, Obj>, slice: "" };
  const answers = isObj(have.doc["answers"]) ? have.doc["answers"] : {}, bag = copyBag(files);
  bag[have.path] = { ...have.doc, answers: resetAnswer(answers, knob) };
  return { mode: "wrote", bag, slice: "" };
}
export const sourceOf = (files: Obj, stageId: string, behaviourId: string): RuleHit => ruleOf(ruleBag(files), stageId, behaviourId);
```

### `src/editor/unit/team.ts` (new)

```ts
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
function rootOf(files: Record<string, Obj>): { readonly root: Obj; readonly project: Obj; readonly gear: Obj } | null {
  const root = files["project.json"]; if (!isObj(root) || !isObj(root["project"])) return null;
  const project = root["project"];
  return { root, project, gear: isObj(project["loadout"]) ? project["loadout"] : { roster: [], size: 1 } };
}
export function onTeam(files: Record<string, Obj>, unitId: string): boolean {
  const got = rootOf(files); return got !== null && list(got.gear["roster"]).includes(unitId);
}
export function setTeam(files: Record<string, Obj>, unitId: string, on: boolean): Record<string, Obj> {
  const got = rootOf(files); if (got === null) return files;
  const roster = list(got.gear["roster"]).filter((id): id is string => typeof id === "string" && id !== unitId);
  if (on) roster.push(unitId);
  const loadout = { ...got.gear, roster, size: Math.max(1, roster.length) };
  return { ...files, "project.json": { ...got.root, project: { ...got.project, loadout } } };
}
```

### `tools/maker/rules-panel.ts` (new)

```ts
import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { ruleLine, resetStageRule, setStageRule, sourceOf } from "../../src/editor/rules/rules.ts";
import { addCase, updateProject } from "../../src/editor/unit/add.ts";
import { panelOf } from "../../src/editor/unit/panel.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { sliceDoc } from "../project/slice-of.ts";
import { BUNDLED } from "./catalogue.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { knobWidget } from "./widgets.ts";
type Obj = Record<string, unknown>;
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type RulesHit = Host & { readonly banner: string | null; readonly toast?: string | null };
export type RulesIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
let open = false, skel: Obj | null = null, stack: DocText[] = [];
export function rememberRule(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function rulesOpen(): boolean { return open; }
export function rulesShut(): void { open = false; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function viewSlice(bag: Record<string, Obj>): Obj {
  const slice = bag["catalogue/slice.json"], rows = isObj(slice) ? list(slice["behaviours"]) : [];
  if (isObj(slice) && rows.some((row) => isObj(row) && row["id"] === "win-condition")) return slice;
  const cut = sliceDoc(BUNDLED, [...rows.flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []), "win-condition"]); return isObj(cut) ? cut : {};
}
function stageDoc(bag: Record<string, Obj>, stageId: string): Obj | null { for (const [path, doc] of Object.entries(bag)) if (path.startsWith("stages/") && doc["id"] === stageId) return doc; return null; }
function wipeOn(bag: Record<string, Obj>, stageId: string): boolean {
  const hit = sourceOf(bag, stageId, "win-condition"), setup = hit.setupId === "" ? undefined : bag[`setups/${hit.setupId}.json`], answers = isObj(setup) && isObj(setup["answers"]) ? setup["answers"] : {};
  return panelOf(viewSlice(bag), WIRED, "win-condition", answers).sections.flatMap((section) => [...section.knobs])[0]?.value === true;
}
export function rulesHtml(bag: Record<string, Obj>, stageId: string, readOnly: boolean): string {
  const stage = stageDoc(bag, stageId); if (stage === null) return "";
  const name = typeof stage["name"] === "string" ? stage["name"] : "Stage", gate = addCase(bag, BUNDLED);
  const close = `<button type="button" class="btn ghost" data-act="r:close">Close</button>`;
  const head = `<div class="scrim" data-sheet="rules"><div class="sheet" role="dialog"><h2>Rules · ${esc(name)}</h2>`;
  if (gate.mode === "newer" || readOnly) return `${head}<p>${esc(gate.mode === "newer" ? gate.text : "Made with a newer TileEngine. Open only.")}</p>${close}</div></div>`;
  if (gate.mode === "older") { const act = gate.update ? `<button type="button" class="btn" data-act="r:update">Update</button><button type="button" class="btn ghost" data-act="r:close">Not now</button>` : close; return `${head}<p>${esc(gate.text)}</p>${act}</div></div>`; }
  const hit = sourceOf(bag, stageId, "win-condition"), setup = hit.setupId === "" ? undefined : bag[`setups/${hit.setupId}.json`];
  const answers = isObj(setup) && isObj(setup["answers"]) ? setup["answers"] : {};
  const knob = panelOf(viewSlice(bag), WIRED, "win-condition", answers).sections.flatMap((section) => [...section.knobs])[0];
  const on = knob?.value === true, widget = knob === undefined ? "" : knobWidget({ id: knob.id, label: "Win by defeating every enemy", type: "toggle" }, on);
  const sub = knob === undefined ? "" : `<p class="sub">${esc(knob.label)}</p>`;
  const line = on ? `<p class="sub">You lose when all your units fall.</p>` : `<p>With this off, nobody wins: Test plays until you leave.</p>`;
  return `${head}<h2>How is this stage won?</h2><p class="sub">${esc(ruleLine(hit.source))}</p>${widget}${sub}${line}<button type="button" class="btn ghost" data-act="r:reset">Reset to default</button>${close}</div></div>`;
}
export function rulesSheet(files: DocText, stageId: string, readOnly: boolean): string { if (!open) return ""; const bag = bagOf(files); return bag === null ? "" : rulesHtml(bag, stageId, readOnly); }
const kept = (host: Host): RulesHit => ({ ...host, banner: null });
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): DocText { const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); if (slice !== "") next["catalogue/slice.json"] = slice; return next; }
async function commit(io: RulesIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
async function save(io: RulesIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): Promise<RulesHit> {
  const prev = stack; stack = [host.files];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after, slice));
  if (!wrote.ok) { stack = prev; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: "Changed · Undo" };
}
async function undo(io: RulesIo, host: Host): Promise<RulesHit> {
  const snap = stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
  const wrote = await commit(io, host.files, host.rev, snap);
  if (!wrote.ok) { stack = [snap]; return { files: host.files, rev: host.rev, readOnly: host.readOnly, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, readOnly: host.readOnly, banner: null, dirty: false, toast: null };
}
export async function rulesAct(act: string, stageId: string, host: Host, io: RulesIo): Promise<RulesHit> {
  if (act === "r:open") { open = true; return kept(host); }
  if (act === "r:close") { open = false; return kept(host); }
  if (act === "r:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
  const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
  if (act === "r:update") { const wrote = updateProject(bag, BUNDLED); return wrote === null ? kept(host) : save(io, host, bag, wrote.bag, wrote.slice); }
  if (addCase(bag, BUNDLED).mode !== "same") return kept(host);
  if (skel === null) return { ...kept(host), banner: "Can't open: setup.rule.json" };
  if (act !== "k:toggle:wipe_wins" && act !== "r:reset") return kept(host);
  const id = `setup_${ulid(Date.parse(io.now), io.bytes())}`;
  const got = act === "r:reset" ? resetStageRule(bag, stageId, "win-condition", "wipe_wins") : setStageRule(bag, skel, stageId, id, "win-condition", "wipe_wins", !wipeOn(bag, stageId), BUNDLED);
  if (got.mode !== "wrote" || (got.slice === "" && got.bag === bag)) return kept(host);
  return save(io, host, bag, got.bag, got.slice);
}
```

### `tests/editor/rules.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { resetStageRule, setStageRule, sourceOf } from "../../src/editor/rules/rules.ts";
import { readProject } from "../../src/project/load/index.ts";
import { sliceOf } from "../../src/project/slice-of.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { BUNDLED } from "../../tools/maker/catalogue.ts";
import { rulesHtml } from "../../tools/maker/rules-panel.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { launchTest } from "../../tools/maker/test-launch.ts";
import { diagramCells, diagramHtml, diagramOf } from "../../tools/maker/unit-diagram.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { openProject, playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), STAGE = "stage_01JDAS00000000000000000001", NOW = "2026-11-21T00:00:00.000Z";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const bagOf = (rel: string): Record<string, Obj> => { const parsed = parseProject(walk(rel)); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const skel = (): Obj => { const doc = JSON.parse(readFileSync(join(root, "data/templates/setup.rule.json"), "utf8")) as unknown; if (!isObj(doc)) throw new Error("skel"); return doc; };
const played = (files: Record<string, Obj>) => { const load = readProject(files); if (!load.ok || load.project === null) throw new Error(load.report.map((row) => row.code).join(" ")); return { load, docs: playDocsOf(load.project) }; };
const land = (m: ReturnType<typeof createMatch>): void => { m.endTurn(); for (let i = 0; i < 40 && m.walk !== null; i += 1) { m.world.clock.advance(40); m.sync(); } };
function fell(m: ReturnType<typeof createMatch>): void {
  const me = m.world.units.all().find((u) => u.alive && u.side === m.sides.order[0]), rules = m.world.rules; if (me === undefined || rules == null) throw new Error("me");
  for (const foe of m.world.units.all().filter((u) => u.alive && u.side !== me.side && u.side !== "neutral")) {
    if (![{ c: me.at.c, r: me.at.r - 1 }, { c: me.at.c + 1, r: me.at.r }, { c: me.at.c - 1, r: me.at.r }, { c: me.at.c, r: me.at.r + 1 }].some((at) => m.world.units.moveTo(foe.id, at, "move").ok)) throw new Error("beside");
    for (let n = 0; n < 40 && (rules.state().units.find((u) => u.id === foe.id)?.hp ?? 0) > 0; n += 1) { const note = rules.act({ id: `h${n}`, kind: "ability", actor: me.id, target: { pipe: "unit", unitId: foe.id }, durationMs: null, turns: null, effects: [] }); if (note !== null) throw new Error(note.message); }
    if ((rules.state().units.find((u) => u.id === foe.id)?.hp ?? 1) !== 0) throw new Error("hp");
  }
}
test("stage rule overrides project rule", () => {
  const demo = bagOf("fixtures/demo.tileproj");
  assert.equal(sourceOf(demo, STAGE, "win-condition").source, "default"); assert.equal(played(demo).docs.win, undefined);
  const off = setStageRule(demo, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED);
  assert.equal(off.mode, "wrote"); if (off.mode !== "wrote") return;
  const stagePath = Object.keys(off.bag).find((path) => path.startsWith("stages/") && off.bag[path]?.["id"] === STAGE) ?? "", stage = off.bag[stagePath];
  assert.ok(isObj(stage) && Array.isArray(stage["rules"])); if (!isObj(stage) || !Array.isArray(stage["rules"])) return;
  const id = stage["rules"].at(-1), root = off.bag["project.json"]; assert.equal(typeof id, "string"); if (!isObj(root) || !isObj(root["project"]) || typeof id !== "string") return;
  const projectBag = { ...off.bag, [stagePath]: { ...stage, rules: stage["rules"].filter((item) => item !== id) }, "project.json": { ...root, project: { ...root["project"], rules: [...(Array.isArray(root["project"]["rules"]) ? root["project"]["rules"] : []), id] } } };
  assert.equal(sourceOf(projectBag, STAGE, "win-condition").source, "project"); assert.equal(played(projectBag).docs.win?.wipe, false);
  assert.equal(sourceOf(off.bag, STAGE, "win-condition").source, "stage"); assert.equal(played(off.bag).docs.win?.wipe, false);
  const on = setStageRule(projectBag, skel(), STAGE, "setup_01RULE0000000000000000001B", "win-condition", "wipe_wins", true, BUNDLED);
  assert.equal(on.mode, "wrote"); if (on.mode !== "wrote") return; assert.equal(sourceOf(on.bag, STAGE, "win-condition").source, "stage"); assert.equal(played(on.bag).docs.win?.wipe, true);
});
test("first rule edit re-cuts the slice", () => {
  const demo = bagOf("fixtures/demo.tileproj"), slice = demo["catalogue/slice.json"]; assert.ok(isObj(slice)); if (!isObj(slice)) return;
  const used = (Array.isArray(slice["behaviours"]) ? slice["behaviours"] : []).flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []);
  const got = setStageRule(demo, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED);
  assert.equal(got.mode, "wrote"); if (got.mode !== "wrote") return; assert.equal(got.slice, sliceOf(BUNDLED, [...used, "win-condition"])); assert.deepEqual(got.bag["catalogue/slice.json"], JSON.parse(got.slice));
  const setup = got.bag["setups/setup_01RULE0000000000000000001A.json"], stage = got.bag[Object.keys(got.bag).find((path) => path.startsWith("stages/") && got.bag[path]?.["id"] === STAGE) ?? ""];
  assert.equal(isObj(stage) && Array.isArray(stage["rules"]) && stage["rules"].at(-1), "setup_01RULE0000000000000000001A");
  assert.ok(isObj(setup) && isObj(setup["answers"])); if (!isObj(setup) || !isObj(setup["answers"])) return;
  assert.deepEqual(setup["answers"]["wipe_wins"], { source: "user", value: false, rev: 1 });
  for (const [key, row] of Object.entries(setup["answers"])) if (key !== "wipe_wins") assert.deepEqual(row, { source: "default" });
  const load = readProject(got.bag); assert.equal(load.ok, true); assert.deepEqual([...load.report], []);
});
test("win rule reaches Test", () => {
  const demo = bagOf("fixtures/demo.tileproj"), got = setStageRule(demo, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED);
  assert.equal(got.mode, "wrote"); if (got.mode !== "wrote") return; const off = played(got.bag); assert.equal(off.docs.win?.wipe, false);
  const quiet = createMatch(off.docs, 20); fell(quiet); land(quiet); assert.equal(quiet.outcome, null);
  const live = createMatch(played(demo).docs, 20); fell(live); land(live); assert.equal(live.outcome, "win");
});
test("win rule needs P = B", () => {
  const older = bagOf("fixtures/demo.tileproj"), root = older["project.json"]; assert.ok(isObj(root) && isObj(root["project"])); if (!isObj(root) || !isObj(root["project"])) return;
  root["project"] = { ...root["project"], catalogueRev: BUNDLED.catalogue_rev - 1 };
  const offer = rulesHtml(older, STAGE, false); assert.equal(offer.includes("New abilities are available. Update this project to use them?"), true); assert.equal(offer.includes("k:toggle"), false); assert.equal(offer.includes("r:update"), true);
  const before = JSON.stringify(older); assert.equal(setStageRule(older, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED).mode, "older"); assert.equal(JSON.stringify(older), before);
  const newer = bagOf("fixtures/demo.tileproj"), next = newer["project.json"]; if (!isObj(next) || !isObj(next["project"])) return;
  next["project"] = { ...next["project"], catalogueRev: BUNDLED.catalogue_rev + 1 };
  const note = rulesHtml(newer, STAGE, false); assert.equal(note.includes("This project was made with a newer TileEngine. Update the app to add abilities."), true); assert.equal(note.includes("k:toggle") || note.includes("r:reset"), false);
  assert.equal(setStageRule(newer, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED).mode, "newer");
});
test("wired win knob changes the adapter", () => {
  assert.deepEqual(WIRED["win-condition"], ["wipe_wins"]);
  const demo = bagOf("fixtures/demo.tileproj"), got = setStageRule(demo, skel(), STAGE, "setup_01RULE0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED);
  assert.equal(got.mode, "wrote"); if (got.mode !== "wrote") return;
  const setup = got.bag["setups/setup_01RULE0000000000000000001A.json"]; assert.ok(isObj(setup) && isObj(setup["answers"])); if (!isObj(setup) || !isObj(setup["answers"])) return;
  setup["answers"] = { ...setup["answers"], mutual_wipe: { source: "user", value: "last-actor-loses", rev: 1 } };
  assert.equal(played(got.bag).docs.win?.wipe, false); assert.equal(played(got.bag).docs.win?.mutual, "last-actor-loses"); assert.equal(rulesHtml(got.bag, STAGE, false).includes("k:toggle:wipe_wins"), true); assert.equal(rulesHtml(got.bag, STAGE, false).includes("mutual_wipe"), false);
  const back = resetStageRule(got.bag, STAGE, "win-condition", "wipe_wins"); assert.equal(back.mode, "wrote"); if (back.mode !== "wrote") return; assert.equal(played(back.bag).docs.win?.wipe, true);
});
test("empty template plays", () => { const opened = openProject(bagOf("data/templates/empty.tileproj")); assert.notEqual(opened.docs, null); assert.equal(opened.error, ""); });
test("empty board asks for a unit", async () => {
  const id = "project_01JDEM00000000000000000001", store = memoryStore(), stored = walk("data/templates/empty.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  let started = false; const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(bagOf("data/templates/empty.tileproj")), from: "project", now: NOW, start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return; assert.equal(got.lines[0], "Place a unit on this stage to test it.");
});
test("old empty project gets the plain sentence", () => {
  const parsed = parseProject(walk("data/templates/empty.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const files = Object.fromEntries(Object.entries(parsed.files).filter(([path]) => !path.startsWith("setups/")));
  const rootDoc = files["project.json"]; if (!isObj(rootDoc) || !isObj(rootDoc["project"])) throw new Error("project");
  rootDoc["project"] = { ...rootDoc["project"], catalogueRev: 1, rules: [] };
  files["catalogue/slice.json"] = { kind: "catalogue-slice", formatVersion: 1, schema_version: 1, catalogue_rev: 1, gates: {}, behaviours: [] };
  const html = diagramHtml(diagramOf(files, "unit_missing", "line-shot", null));
  assert.equal(html.includes("This project has no unit roster yet, so it can&#39;t be played"), true); assert.equal(html.includes("play: army"), false);
  assert.throws(() => diagramCells(files, "unit_missing", "line-shot", null), (err: unknown) => err instanceof Error && err.message === "play: army");
});
```

### `data/templates/setup.rule.json` (new)

```json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_00000000000000000000000000",
  "rev": 0,
  "name": "Rule",
  "behaviourId": "rule",
  "catalogue": {
    "rev": 0
  },
  "createdAt": "2026-11-21T00:00:00.000Z",
  "updatedAt": "2026-11-21T00:00:00.000Z",
  "copiedFrom": null,
  "answers": {},
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 0,
    "ops": []
  }
}
```

### `data/templates/empty.tileproj/setups/setup_01M7XPE6006A10000000000000.json` (new)

```json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01M7XPE6006A10000000000000",
  "rev": 1,
  "name": "Army",
  "behaviourId": "unit-roster",
  "catalogue": {
    "rev": 30
  },
  "createdAt": "2026-11-21T00:00:00.000Z",
  "updatedAt": "2026-11-21T00:00:00.000Z",
  "copiedFrom": null,
  "answers": {
    "board_cols": {
      "source": "default"
    },
    "board_rows": {
      "source": "default"
    },
    "piece_count": {
      "source": "default"
    },
    "unit_hp": {
      "source": "default"
    },
    "unit_atk": {
      "source": "default"
    },
    "opening_row": {
      "source": "default"
    },
    "clip_cues": {
      "source": "default"
    },
    "team_colour": {
      "source": "default"
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 0,
    "ops": []
  }
}
```

### `handoff/steps/tests/s6a-win-rules/smoke.mjs` (new)

```js
// Step 6a win rules. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8805"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s6a-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s6a-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const cover = async (sheet) => page.evaluate((sel) => { const toast = document.querySelector(".toast"), box = document.querySelector(sel); if (toast === null || box === null) return "missing"; const t = toast.getBoundingClientRect(); return [...box.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); if (b.width < 48 || b.height < 48) return false; return b.left < t.right && b.right > t.left && b.top < t.bottom && b.bottom > t.top; }).map((el) => el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName).join("|"); }, sheet);
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 240)); } };
    const wiped = () => page.evaluate(() => window.__docs?.win?.wipe);
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
    await step("1 rules on", async () => {
      await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("Default rule") && document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 });
      await shot("01-rules-on"); tiny.push(...await big());
    });
    await step("2 rules off", async () => {
      await tap(page, "k:toggle:wipe_wins"); await waitText(page, "With this off, nobody wins: Test plays until you leave."); await shot("02-rules-off"); tiny.push(...await big());
      if (width === 360) { await page.waitForFunction(() => document.querySelector(".toast.above") !== null, null, { timeout: 15000 }); const hit = await cover("[data-sheet=rules] .sheet"); if (hit !== "") throw new Error(`toast ${hit}`); await page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 }); }
      await tap(page, "r:close"); await tap(page, "s:back"); await press(page, "Demo stage"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
      await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("This stage's rule") && document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
    });
    await step("3 test off", async () => {
      await tap(page, "r:close"); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs?.win?.wipe === false, null, { timeout: 15000 });
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="r:open"]') !== null, null, { timeout: 15000 });
    });
    await step("4 reset", async () => {
      await tap(page, "r:open"); await tap(page, "r:reset"); await page.waitForFunction(() => document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 });
      await tap(page, "r:close"); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs?.win?.wipe === true, null, { timeout: 15000 }); if (await wiped() !== true) throw new Error("wipe");
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:1,8"]') !== null, null, { timeout: 15000 });
    });
    await step("7 archer sheet", async () => {
      await tap(page, "s:cell:1,8"); await page.waitForFunction(() => (document.querySelector(".sheet h2")?.textContent ?? "").includes(" · ") && !document.body.innerText.includes("A unit stands here"), null, { timeout: 15000 });
      await shot("05-occupied"); tiny.push(...await big());
    });
    await step("8 editor", async () => {
      await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team"]') !== null, null, { timeout: 15000 });
      tiny.push(...await big()); if (width === 360) { await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector(".toast.above") !== null, null, { timeout: 15000 }); const hit = await cover(".scrim .sheet"); if (hit !== "") throw new Error(`toast ${hit}`); await page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 }); }
    });
    await step("5 empty hero", async () => {
      await tap(page, "u:back"); await tap(page, "s:back"); await press(page, "Back"); await press(page, "New project"); await press(page, "Empty", true); await press(page, "Continue"); await press(page, "Create");
      await tap(page, "u:add"); await page.locator("[data-unit]").fill("Hero"); await tap(page, "u:create");
      await page.waitForFunction(() => document.querySelector('[data-knob="unit_hp"]')?.value === "9" && document.querySelector('[aria-label="On your team"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
      await tap(page, "u:role"); await waitText(page, "Warrior (BTF)"); tiny.push(...await big()); await tap(page, "u:close");
      await page.locator('[aria-label="On your team"]').scrollIntoViewIfNeeded(); await shot("03-on-your-team"); tiny.push(...await big());
      await tap(page, "t:team"); await page.waitForFunction(() => { const files = window.__read(), gear = JSON.parse(files["project.json"]).project.loadout, id = gear.roster.at(-1); return gear.roster.length === 1 && gear.size === 1 && typeof id === "string" && String(files[`units/${id}.json`] ?? "").includes("Hero"); }, null, { timeout: 15000 });
    });
    await step("6 empty board", async () => {
      await tap(page, "u:back"); await press(page, "Blank"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 });
      await tap(page, "s:test"); await waitText(page, "Place a unit on this stage to test it.");
      const board = await page.evaluate(() => document.querySelector("#board") !== null || document.querySelector("#app")?.hidden === true); if (board) throw new Error("board");
      await shot("04-empty-board");
    });
    check(`8 targets @${width}`, tiny.length === 0 && errs.length === 0, tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `data/templates/empty.tileproj/project.json` (edited)

```diff
diff --git a/data/templates/empty.tileproj/project.json b/data/templates/empty.tileproj/project.json
index 6f8ccc9..950fb1d 100644
--- a/data/templates/empty.tileproj/project.json
+++ b/data/templates/empty.tileproj/project.json
@@ -8,10 +8,20 @@
     "createdAt": "2026-11-18T00:00:00Z",
     "updatedAt": "2026-11-18T00:00:00Z",
     "copiedFrom": null,
-    "catalogueRev": 1,
-    "settings": { "wrapEdges": false },
-    "stages": ["stage_01JDEM00000000000000000003"],
-    "rules": [],
-    "loadout": { "roster": [], "size": 1, "required": [] }
+    "catalogueRev": 30,
+    "settings": {
+      "wrapEdges": false
+    },
+    "stages": [
+      "stage_01JDEM00000000000000000003"
+    ],
+    "rules": [
+      "setup_01M7XPE6006A10000000000000"
+    ],
+    "loadout": {
+      "roster": [],
+      "size": 1,
+      "required": []
+    }
   }
 }
```

Full file as merged:

```json
{
  "kind": "tile-project",
  "formatVersion": 6,
  "project": {
    "id": "project_01JDEM00000000000000000001",
    "rev": 1,
    "name": "Empty",
    "createdAt": "2026-11-18T00:00:00Z",
    "updatedAt": "2026-11-18T00:00:00Z",
    "copiedFrom": null,
    "catalogueRev": 30,
    "settings": {
      "wrapEdges": false
    },
    "stages": [
      "stage_01JDEM00000000000000000003"
    ],
    "rules": [
      "setup_01M7XPE6006A10000000000000"
    ],
    "loadout": {
      "roster": [],
      "size": 1,
      "required": []
    }
  }
}
```

### `data/templates/empty.tileproj/catalogue/slice.json` (edited)

```diff
diff --git a/data/templates/empty.tileproj/catalogue/slice.json b/data/templates/empty.tileproj/catalogue/slice.json
index d8f12f4..7d321ca 100644
--- a/data/templates/empty.tileproj/catalogue/slice.json
+++ b/data/templates/empty.tileproj/catalogue/slice.json
@@ -1,6 +1,1839 @@
 {
   "kind": "catalogue-slice",
   "formatVersion": 1,
-  "catalogue_rev": 1,
-  "behaviours": []
+  "schema_version": 3,
+  "catalogue_rev": 30,
+  "gates": {
+    "uses-card-hand": {
+      "any": [
+        {
+          "knob": "ability-presentation.shortcut",
+          "eq": "all-cards"
+        },
+        {
+          "all": [
+            {
+              "knob": "ability-presentation.shortcut",
+              "eq": "custom"
+            },
+            {
+              "any": [
+                {
+                  "knob": "ability-presentation.basic_style",
+                  "eq": "card-hand"
+                },
+                {
+                  "knob": "ability-presentation.spells_style",
+                  "eq": "card-hand"
+                },
+                {
+                  "knob": "ability-presentation.custom_groups",
+                  "some": {
+                    "field": "style",
+                    "eq": "card-hand"
+                  }
+                }
+              ]
+            }
+          ]
+        }
+      ]
+    },
+    "uses-menu": {
+      "any": [
+        {
+          "knob": "ability-presentation.shortcut",
+          "eq": "all-menu"
+        },
+        {
+          "all": [
+            {
+              "knob": "ability-presentation.shortcut",
+              "eq": "custom"
+            },
+            {
+              "any": [
+                {
+                  "knob": "ability-presentation.basic_style",
+                  "eq": "unit-action-menu"
+                },
+                {
+                  "knob": "ability-presentation.spells_style",
+                  "eq": "unit-action-menu"
+                },
+                {
+                  "knob": "ability-presentation.custom_groups",
+                  "some": {
+                    "field": "style",
+                    "eq": "unit-action-menu"
+                  }
+                }
+              ]
+            }
+          ]
+        }
+      ]
+    }
+  },
+  "behaviours": [
+    {
+      "id": "unit-roster",
+      "name": "Army Roster and Opening Formation",
+      "group": "Objectives & Win",
+      "summary": "Which pieces a side starts with, their health and attack, and where they stand on turn one (own back rank, or front rank).",
+      "scope": "grid-tactics",
+      "starter_safe": true,
+      "knobs": [
+        {
+          "id": "board_cols",
+          "label": "Board columns",
+          "type": "slider",
+          "default": 6,
+          "min": 4,
+          "max": 9,
+          "step": 1,
+          "options": null,
+          "proposed": [
+            "min",
+            "max"
+          ],
+          "status": {
+            "default": "src",
+            "min": "PROPOSED",
+            "max": "PROPOSED",
+            "options": null,
+            "step": "src"
+          },
+          "rev": 1,
+          "default_history": [
+            {
+              "rev": 1,
+              "default": 6
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": []
+        },
+        {
+          "id": "board_rows",
+          "label": "Board rows",
+          "type": "slider",
+          "default": 9,
+          "min": 6,
+          "max": 12,
+          "step": 1,
+          "options": null,
+          "proposed": [
+            "default",
+            "min",
+            "max"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": "PROPOSED",
+            "max": "PROPOSED",
+            "options": null,
+            "step": "ai-match"
+          },
+          "rev": 1,
+          "default_history": [
+            {
+              "rev": 1,
+              "default": 9
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "ruling": {
+            "by": "CoS",
+            "date": "2026-11-09",
+            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
+          }
+        },
+        {
+          "id": "piece_count",
+          "label": "Pieces per side",
+          "type": "slider",
+          "default": 6,
+          "min": 1,
+          "max": 12,
+          "step": 1,
+          "options": null,
+          "proposed": [
+            "default"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": "ai-match",
+            "max": "ai-match",
+            "options": null,
+            "step": "ai-match"
+          },
+          "rev": 1,
+          "default_history": [
+            {
+              "rev": 1,
+              "default": 6
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [
+            "board_cols"
+          ],
+          "ruling": {
+            "by": "CoS",
+            "date": "2026-11-09",
+            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
+          }
+        },
+        {
+          "id": "unit_hp",
+          "label": "Health",
+          "type": "slider",
+          "default": 9,
+          "min": 1,
+          "max": 21,
+          "step": 1,
+          "options": null,
+          "proposed": [
+            "default",
+            "min"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": "PROPOSED",
+            "max": "ai-match",
+            "options": null,
+            "step": "ai-match"
+          },
+          "rev": 1,
+          "default_history": [
+            {
+              "rev": 1,
+              "default": 9
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "description": "Set per unit: the roster value is the default for every unit, and a unit can override it in that unit's own stats. L5 difficulty marker l5:'hp' (runtime difficulty.hp; B1 / P1-2).",
+          "per_unit": true,
+          "l5": "hp",
+          "ruling": {
+            "by": "CoS",
+            "date": "2026-11-09",
+            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
+          }
+        },
+        {
+          "id": "unit_atk",
+          "label": "Attack",
+          "type": "slider",
+          "default": 1,
+          "min": 0,
+          "max": 2,
+          "step": 1,
+          "options": null,
+          "proposed": [
+            "default",
+            "min",
+            "max"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": "PROPOSED",
+            "max": "PROPOSED",
+            "options": null,
+            "step": "ai-match"
+          },
+          "rev": 1,
+          "default_history": [
+            {
+              "rev": 1,
+              "default": 1
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "description": "Set per unit: the roster value is the default for every unit, and a unit can override it in that unit's own stats.",
+          "per_unit": true,
+          "ruling": {
+            "by": "CoS",
+            "date": "2026-11-09",
+            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
+          }
+        },
+        {
+          "id": "opening_row",
+          "label": "Opening row",
+          "type": "picker",
+          "default": "back",
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": [
+            {
+              "value": "back",
+              "label": "Six on the far rank"
+            },
+            {
+              "value": "second",
+              "label": "Six on the second rank"
+            },
+            {
+              "value": "front",
+              "label": "Five on the front rank (deck shape)",
+              "reads": {
+                "from": "deck",
+                "ref": "deck.openingFront",
+                "deck_from": "hand-and-draw.deck",
+                "type": "UnitId[]",
+                "length": 5,
+                "order": "west-to-east",
+                "optional": true,
+                "malformed": "not an array, or not exactly 5 entries",
+                "if_missing": {
+                  "use": "back",
+                  "warning": "openingShapeMissing",
+                  "once_per": "deck",
+                  "warning_source": "/workspace/tileengine/data/project-format.md §6.8 (openingFront row line 1126; rules lines 1135-1144; warning table line 1539); /workspace/tileengine/data/setup-format.md §12.4i (lines 2211-2216) and §12.5 L44 (line 2223)"
+                },
+                "bad_id": {
+                  "warning": "unknownRef",
+                  "slot": "empty",
+                  "note": "the other four are placed"
+                },
+                "type_source": "/workspace/tileengine/data/core-types.ts CoreDeck (line 194, MAY-MOVE): openingFront?: ReadonlyArray<UnitId> (line 203); UnitId = string (line 39)"
+              }
+            }
+          ],
+          "proposed": [],
+          "status": {
+            "default": "CEO-ruling",
+            "min": null,
+            "max": null,
+            "options": "CEO-ruling",
+            "step": null
+          },
+          "rev": 16,
+          "default_history": [
+            {
+              "rev": 1,
+              "default": "back"
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "description": "front reads the deck field openingFront (exactly five unit ids, west to east) of the bot side's deck (its effective hand-and-draw.deck). No deck, no openingFront, or a malformed one (not an array, or not exactly 5 entries) opens back with the warning openingShapeMissing, once per deck (once in total with no deck). An id that isn't a unit is unknownRef and that slot stays empty; the other four are placed. back and second ignore openingFront. Source: DSK project-format r14 §6.8, setup-format §12.4i/§12.5 (L44); type UnitId[] in core-types.ts CoreDeck (MAY-MOVE). DSK docs pinned to catalogue rev 17 / 544 knobs.",
+          "ruling_note": "rev 17: field and warning named by DSK (project-format r14 §6.8; setup-format §12.5 L44), replacing PENDING-DSK-NAME and the PROPOSED name frontShapeMissing.",
+          "ruling": {
+            "by": "CEO",
+            "date": "2026-11-09",
+            "note": "relayed via CoS/DSK L44; user's choice"
+          }
+        },
+        {
+          "id": "clip_cues",
+          "label": "Hit flash and attack lunge for units without clips",
+          "type": "toggle",
+          "default": true,
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": null,
+          "proposed": [
+            "default"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": null,
+            "max": null,
+            "options": null,
+            "step": null
+          },
+          "rev": 8,
+          "default_history": [
+            {
+              "rev": 8,
+              "default": true
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "proposed_options": [
+            false
+          ]
+        },
+        {
+          "id": "team_colour",
+          "label": "Team colour",
+          "type": "colour",
+          "default": null,
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": null,
+          "proposed": [
+            "default"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": null,
+            "max": null,
+            "options": null,
+            "step": null
+          },
+          "rev": 9,
+          "default_history": [
+            {
+              "rev": 8,
+              "default": "#badcff"
+            },
+            {
+              "rev": 9,
+              "default": null
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [
+            "ability-presentation.team_colours"
+          ],
+          "nullable": true,
+          "ruling": {
+            "by": "DSK",
+            "date": "2026-11-09",
+            "note": "L30: nullable, default null = palette; one source of truth (CoS ruling 'project default, army override' unchanged in substance)"
+          }
+        }
+      ],
+      "presets": [
+        {
+          "id": "btf-warrior",
+          "label": "Warrior (BTF)",
+          "deck": "Before The Fall",
+          "cards": "-",
+          "overrides": {
+            "unit_hp": 9,
+            "unit_atk": 1
+          },
+          "status": "src",
+          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 WARRIOR_HP = 9, stampTowerArmy :931-933 hp/ad; towerStrike.ts:33 WARRIOR_DMG = 1, statueStrike :214"
+        },
+        {
+          "id": "btf-archer",
+          "label": "Archer (BTF)",
+          "deck": "Before The Fall",
+          "cards": "-",
+          "overrides": {
+            "unit_hp": 6,
+            "unit_atk": 2
+          },
+          "status": "src",
+          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 BACK_HP = 6, stampTowerArmy :934-937 isArcher hp/ad; towerStrike.ts:34 RANGER_DMG = 2, statueStrike :218"
+        },
+        {
+          "id": "btf-mage",
+          "label": "Mage (BTF)",
+          "deck": "Before The Fall",
+          "cards": "-",
+          "overrides": {
+            "unit_hp": 6,
+            "unit_atk": 2
+          },
+          "status": "src",
+          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 BACK_HP = 6, stampTowerArmy :934-937 isMage hp/ad; towerStrike.ts:35 BACK_DMG = 2, statueStrike :219"
+        },
+        {
+          "id": "btf-cleric",
+          "label": "Cleric (BTF)",
+          "deck": "Before The Fall",
+          "cards": "-",
+          "overrides": {
+            "unit_hp": 5,
+            "unit_atk": 1
+          },
+          "status": "src",
+          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 CLERIC_HP = 5, stampTowerArmy :927-929 hp/ad; towerStrike.ts statueStrike :217 return 1 (cleric is not in the :33-35 damage constants)"
+        }
+      ],
+      "renamed_from": [],
+      "retired_knobs": [
+        {
+          "id": "team_colour_override",
+          "since_rev": 9,
+          "reason": "Folded into the nullable team_colour (null = palette) (setup-format r8 §12.7 Q5, L30).",
+          "fold": {
+            "into": "team_colour",
+            "when_false": "reset"
+          }
+        },
+        {
+          "id": "one_unit_per_tile",
+          "since_rev": 15,
+          "reason": "Cell density lives in the project setting settings.occupancy (project-format r14 §3.1; Engine Architect 2026-11-09).",
+          "convert": {
+            "to_setting": "settings.occupancy",
+            "map": {
+              "true": "strict1",
+              "false": "softStack"
+            },
+            "scope": "project-level unit-roster setup only; stage values kept inactive with occupancyStageValueIgnored",
+            "old_answer": "kept-inactive"
+          }
+        }
+      ],
+      "menu_order": [
+        {
+          "question": "Board size?",
+          "knob_ids": [
+            "board_cols",
+            "board_rows"
+          ]
+        },
+        {
+          "question": "How many pieces?",
+          "knob_ids": [
+            "piece_count"
+          ]
+        },
+        {
+          "question": "Health and attack?",
+          "knob_ids": [
+            "unit_hp",
+            "unit_atk"
+          ]
+        },
+        {
+          "question": "Where do they start?",
+          "knob_ids": [
+            "opening_row"
+          ]
+        },
+        {
+          "question": "Flash and lunge units that have no hit or attack clips?",
+          "knob_ids": [
+            "clip_cues"
+          ]
+        },
+        {
+          "question": "Team colour for this army (blank = project palette)",
+          "knob_ids": [
+            "team_colour"
+          ]
+        }
+      ],
+      "banned_combos": [
+        {
+          "id": "unit-roster.piece-count-gt-board-cols",
+          "when": {
+            "knob": "piece_count",
+            "op": "gt",
+            "value": "$board_cols"
+          },
+          "disable": {
+            "knob": "piece_count"
+          },
+          "reason": "Pieces can't fit on one opening row.",
+          "note": "value refers to another knob ($board_cols)"
+        }
+      ],
+      "composable_as": [],
+      "resolved_conflicts": [
+        {
+          "text": "Bot opening: BA 'five front A,M,C,C,W' and Terrain 'five front W,W,W,M,M' vs match-levels 'opens six on far rank'.",
+          "ruling": {
+            "by": "CEO",
+            "date": "2026-11-09",
+            "note": "relayed via CoS/DSK L44; user's choice: unit-roster.opening_row back (default) | second | front (per-deck five-piece shape)"
+          }
+        }
+      ]
+    },
+    {
+      "id": "terrain",
+      "name": "Terrain (what each tile id means)",
+      "group": "Map & Terrain",
+      "summary": "The single home for tile meanings: for each logic tile id, whether units can stand, land or spawn there, whether landing kills, whether a push can enter, and whether it slows or trips. Edge walls (earth lines) are not tiles in the code: they sit on a tile's n/e/s/w edge and live in Barrier Line. Walls on tile edges (the map's logic.edges) always block movement and adjacency across that edge: that is core grid behaviour with no knob. The two wall knobs only decide whether walls also block line of sight and shots.",
+      "scope": "grid-tactics",
+      "starter_safe": true,
+      "knobs": [
+        {
+          "id": "tile_types",
+          "label": "Tile types",
+          "type": "list",
+          "default": [
+            {
+              "id": "floor",
+              "label": "Floor",
+              "open": true,
+              "kills_on_landing": false,
+              "push_can_enter": true,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "fallen",
+              "label": "Fallen tile (abyss)",
+              "open": false,
+              "kills_on_landing": true,
+              "push_can_enter": true,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "flask",
+              "label": "Flask tile",
+              "open": false,
+              "kills_on_landing": false,
+              "push_can_enter": false,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "rising",
+              "label": "Rising tile (a unit is coming back here)",
+              "open": false,
+              "kills_on_landing": false,
+              "push_can_enter": false,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "tide",
+              "label": "Tide mark",
+              "open": false,
+              "kills_on_landing": false,
+              "push_can_enter": false,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "warp-mark",
+              "label": "Warp mark",
+              "open": false,
+              "kills_on_landing": false,
+              "push_can_enter": false,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "sword-mark",
+              "label": "Sword fade-in tile",
+              "open": false,
+              "kills_on_landing": false,
+              "push_can_enter": false,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "boss-cover",
+              "label": "Portal boss tile",
+              "open": false,
+              "kills_on_landing": false,
+              "push_can_enter": false,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "vines",
+              "label": "Vines",
+              "open": true,
+              "kills_on_landing": false,
+              "push_can_enter": true,
+              "slows_move": true,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "trap",
+              "label": "Trap",
+              "open": true,
+              "kills_on_landing": false,
+              "push_can_enter": true,
+              "slows_move": false,
+              "trips": true,
+              "buildable": false
+            },
+            {
+              "id": "water",
+              "label": "Water",
+              "open": false,
+              "kills_on_landing": false,
+              "push_can_enter": false,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "lava",
+              "label": "Lava",
+              "open": true,
+              "kills_on_landing": true,
+              "push_can_enter": true,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "wall-block",
+              "label": "Wall block",
+              "open": false,
+              "kills_on_landing": false,
+              "push_can_enter": false,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "path",
+              "label": "Path",
+              "open": true,
+              "kills_on_landing": false,
+              "push_can_enter": true,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            },
+            {
+              "id": "dirt",
+              "label": "Dirt",
+              "open": true,
+              "kills_on_landing": false,
+              "push_can_enter": true,
+              "slows_move": false,
+              "trips": false,
+              "buildable": false
+            }
+          ],
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": null,
+          "proposed": [],
+          "status": {
+            "default": "src",
+            "min": null,
+            "max": null,
+            "options": null,
+            "step": null
+          },
+          "rev": 23,
+          "default_history": [
+            {
+              "rev": 7,
+              "default": [
+                {
+                  "id": "floor",
+                  "label": "Floor",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "fallen",
+                  "label": "Fallen tile (abyss)",
+                  "open": false,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "flask",
+                  "label": "Flask tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "rising",
+                  "label": "Rising tile (a unit is coming back here)",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "tide",
+                  "label": "Tide mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "warp-mark",
+                  "label": "Warp mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "sword-mark",
+                  "label": "Sword fade-in tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "boss-cover",
+                  "label": "Portal boss tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "vines",
+                  "label": "Vines",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": true,
+                  "trips": false
+                },
+                {
+                  "id": "trap",
+                  "label": "Trap",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": true
+                }
+              ]
+            },
+            {
+              "rev": 9,
+              "default": [
+                {
+                  "id": "floor",
+                  "label": "Floor",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "fallen",
+                  "label": "Fallen tile (abyss)",
+                  "open": false,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "flask",
+                  "label": "Flask tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "rising",
+                  "label": "Rising tile (a unit is coming back here)",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "tide",
+                  "label": "Tide mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "warp-mark",
+                  "label": "Warp mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "sword-mark",
+                  "label": "Sword fade-in tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "boss-cover",
+                  "label": "Portal boss tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "vines",
+                  "label": "Vines",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": true,
+                  "trips": false
+                },
+                {
+                  "id": "trap",
+                  "label": "Trap",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": true
+                },
+                {
+                  "id": "water",
+                  "label": "Water",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "lava",
+                  "label": "Lava",
+                  "open": true,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "wall-block",
+                  "label": "Wall block",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                }
+              ]
+            },
+            {
+              "rev": 10,
+              "default": [
+                {
+                  "id": "floor",
+                  "label": "Floor",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "fallen",
+                  "label": "Fallen tile (abyss)",
+                  "open": false,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "flask",
+                  "label": "Flask tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "rising",
+                  "label": "Rising tile (a unit is coming back here)",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "tide",
+                  "label": "Tide mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "warp-mark",
+                  "label": "Warp mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "sword-mark",
+                  "label": "Sword fade-in tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "boss-cover",
+                  "label": "Portal boss tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "vines",
+                  "label": "Vines",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": true,
+                  "trips": false
+                },
+                {
+                  "id": "trap",
+                  "label": "Trap",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": true
+                },
+                {
+                  "id": "water",
+                  "label": "Water",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "lava",
+                  "label": "Lava",
+                  "open": true,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false
+                },
+                {
+                  "id": "wall-block",
+                  "label": "Wall block",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false
+                }
+              ]
+            },
+            {
+              "rev": 15,
+              "default": [
+                {
+                  "id": "floor",
+                  "label": "Floor",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "fallen",
+                  "label": "Fallen tile (abyss)",
+                  "open": false,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "flask",
+                  "label": "Flask tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "rising",
+                  "label": "Rising tile (a unit is coming back here)",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "tide",
+                  "label": "Tide mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "warp-mark",
+                  "label": "Warp mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "sword-mark",
+                  "label": "Sword fade-in tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "boss-cover",
+                  "label": "Portal boss tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "vines",
+                  "label": "Vines",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": true,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "trap",
+                  "label": "Trap",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": true,
+                  "buildable": false
+                },
+                {
+                  "id": "water",
+                  "label": "Water",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "lava",
+                  "label": "Lava",
+                  "open": true,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "wall-block",
+                  "label": "Wall block",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                }
+              ]
+            },
+            {
+              "rev": 23,
+              "default": [
+                {
+                  "id": "floor",
+                  "label": "Floor",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "fallen",
+                  "label": "Fallen tile (abyss)",
+                  "open": false,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "flask",
+                  "label": "Flask tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "rising",
+                  "label": "Rising tile (a unit is coming back here)",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "tide",
+                  "label": "Tide mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "warp-mark",
+                  "label": "Warp mark",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "sword-mark",
+                  "label": "Sword fade-in tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "boss-cover",
+                  "label": "Portal boss tile",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "vines",
+                  "label": "Vines",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": true,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "trap",
+                  "label": "Trap",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": true,
+                  "buildable": false
+                },
+                {
+                  "id": "water",
+                  "label": "Water",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "lava",
+                  "label": "Lava",
+                  "open": true,
+                  "kills_on_landing": true,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "wall-block",
+                  "label": "Wall block",
+                  "open": false,
+                  "kills_on_landing": false,
+                  "push_can_enter": false,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "path",
+                  "label": "Path",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                },
+                {
+                  "id": "dirt",
+                  "label": "Dirt",
+                  "open": true,
+                  "kills_on_landing": false,
+                  "push_can_enter": true,
+                  "slows_move": false,
+                  "trips": false,
+                  "buildable": false
+                }
+              ]
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "description": "Built-ins water, lava and wall-block are CONFIRMED engine defaults (Engine Architect 2026-11-09, L27) and the defaultTileType targets of the procedural recipes (project-format r13 section 6.2.2 / 6.4): water@2 and murk@1 give water, lava@2 gives lava, wall gives wall-block, ice@1 gives floor in v1 (slippery ice is a future tile type), the rest give floor. buildable (item field, rev 15, PROPOSED, modes: td; v1: false): whether a structure may be placed on the tile. False on every built-in, floor included: grid tactics has no building and BTF never places structures, so false keeps tactics unchanged; a TD project sets it on its own tile types (Engine Architect / Modes Designer MODES-v2 §3, DSK L41). An added item field, so stored lists are not flagged. Rev 23 (DSK L45): built-ins path and dirt (walkable land, like floor, not buildable); 15 reserved items. wall-block stays the only catalogue spelling; wall_block is a reader alias in the format only (setup-format §2.9.3 rule 7). Existing answers drift by §2.9.3 rules 4 and 6 (appended to the effective value, nothing written).",
+          "item_rulings": {
+            "water": {
+              "by": "Engine Architect",
+              "date": "2026-11-09",
+              "note": "L27 confirmed: open false, kills_on_landing false, push_can_enter false, slows_move false, trips false"
+            },
+            "lava": {
+              "by": "Engine Architect",
+              "date": "2026-11-09",
+              "note": "L27 confirmed: open true, kills_on_landing true, push_can_enter true, slows_move false, trips false"
+            },
+            "wall-block": {
+              "by": "Engine Architect",
+              "date": "2026-11-09",
+              "note": "L27 confirmed: open false, kills_on_landing false, push_can_enter false, slows_move false, trips false"
+            },
+            "path": {
+              "by": "Engine Architect",
+              "date": "2026-11-12",
+              "note": "L45: built-in walkable land path and dirt (EUX r65 Q-A1/Q-A4); same walkability as floor, not buildable"
+            },
+            "dirt": {
+              "by": "Engine Architect",
+              "date": "2026-11-12",
+              "note": "L45: built-in walkable land path and dirt (EUX r65 Q-A1/Q-A4); same walkability as floor, not buildable"
+            }
+          },
+          "item": {
+            "open": {
+              "type": "toggle",
+              "default": true
+            },
+            "kills_on_landing": {
+              "type": "toggle",
+              "default": false
+            },
+            "push_can_enter": {
+              "type": "toggle",
+              "default": true
+            },
+            "slows_move": {
+              "type": "toggle",
+              "default": false
+            },
+            "trips": {
+              "type": "toggle",
+              "default": false
+            },
+            "buildable": {
+              "type": "toggle",
+              "default": false
+            }
+          },
+          "reserved_ids": [
+            "floor",
+            "fallen",
+            "flask",
+            "rising",
+            "tide",
+            "warp-mark",
+            "sword-mark",
+            "boss-cover",
+            "vines",
+            "trap",
+            "water",
+            "lava",
+            "wall-block",
+            "path",
+            "dirt"
+          ]
+        },
+        {
+          "id": "lethal_landing_scope",
+          "label": "Deadly tiles kill on",
+          "type": "picker",
+          "default": "any",
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": [
+            {
+              "value": "any",
+              "label": "Any landing"
+            },
+            {
+              "value": "forced_only",
+              "label": "Only forced landings (push, pull)"
+            }
+          ],
+          "proposed": [
+            "default",
+            "options"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": null,
+            "max": null,
+            "options": "PROPOSED",
+            "step": null
+          },
+          "rev": 14,
+          "default_history": [
+            {
+              "rev": 14,
+              "default": "any"
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [
+            "tile_types"
+          ],
+          "description": "Which landings on a kills_on_landing tile kill. UX: the move highlight marks lethal cells and asks to confirm; the AI avoids them unless the scope or rules make it worthwhile.",
+          "ruling": {
+            "by": "Engine Architect",
+            "date": "2026-11-09",
+            "note": "lethal landing scope: any (default) or forced_only; shipped as DSK L36"
+          }
+        },
+        {
+          "id": "wall_blocks_los",
+          "label": "Walls block line of sight",
+          "type": "toggle",
+          "default": true,
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": null,
+          "proposed": [],
+          "status": {
+            "default": "src",
+            "min": null,
+            "max": null,
+            "options": null,
+            "step": null
+          },
+          "rev": 8,
+          "default_history": [
+            {
+              "rev": 8,
+              "default": true
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "proposed_options": [
+            false
+          ]
+        },
+        {
+          "id": "wall_blocks_shots",
+          "label": "Walls block shots",
+          "type": "toggle",
+          "default": true,
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": null,
+          "proposed": [],
+          "status": {
+            "default": "src",
+            "min": null,
+            "max": null,
+            "options": null,
+            "step": null
+          },
+          "rev": 8,
+          "default_history": [
+            {
+              "rev": 8,
+              "default": true
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "proposed_options": [
+            false
+          ]
+        },
+        {
+          "id": "push_into_walls",
+          "label": "Forced moves slam into walls",
+          "type": "toggle",
+          "default": false,
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": null,
+          "proposed": [
+            "default"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": null,
+            "max": null,
+            "options": null,
+            "step": null
+          },
+          "rev": 10,
+          "default_history": [
+            {
+              "rev": 10,
+              "default": false
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "description": "Slams into walls. On: a forced move that meets a wall-block or an edge wall stops on the last open cell and the core emits pushBlocked {unit, blocker: wall-block | edge | unit, cellsRemaining}; push-knockback's wall_slam_damage applies. Off: it still stops short, with no event.",
+          "ruling_note": "Engine Architect 2026-11-09 supersedes the rev-10 'wall-block tiles only' reading: push_into_walls now covers edge walls too (for the event). No unit enters a closed tile either way (invariant).",
+          "ruling": {
+            "by": "DSK",
+            "date": "2026-11-09",
+            "note": "L34: wall-block blocks ordinary moves and all forced movement"
+          }
+        },
+        {
+          "id": "lanes_enabled",
+          "label": "Board has lanes",
+          "type": "toggle",
+          "default": false,
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": null,
+          "proposed": [],
+          "status": {
+            "default": "CoS-default",
+            "min": null,
+            "max": null,
+            "options": null,
+            "step": null
+          },
+          "rev": 14,
+          "default_history": [
+            {
+              "rev": 14,
+              "default": false
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [],
+          "ruling": {
+            "by": "CoS",
+            "date": "2026-11-09",
+            "note": "lanes are an optional tile-region tag plus a rule hook, off by default"
+          }
+        },
+        {
+          "id": "lane_axis",
+          "label": "Lanes run along",
+          "type": "picker",
+          "default": "row",
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": [
+            {
+              "value": "row",
+              "label": "Rows (left to right)"
+            },
+            {
+              "value": "column",
+              "label": "Columns (top to bottom)"
+            }
+          ],
+          "proposed": [],
+          "status": {
+            "default": "src",
+            "min": null,
+            "max": null,
+            "options": "src",
+            "step": null
+          },
+          "rev": 14,
+          "default_history": [
+            {
+              "rev": 14,
+              "default": "row"
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [
+            "lanes_enabled"
+          ],
+          "active_when": {
+            "knob": "lanes_enabled",
+            "eq": true
+          }
+        },
+        {
+          "id": "lane_count",
+          "label": "Number of lanes",
+          "type": "slider",
+          "default": 3,
+          "min": 1,
+          "max": 9,
+          "step": 1,
+          "options": null,
+          "proposed": [
+            "min"
+          ],
+          "status": {
+            "default": "src",
+            "min": "PROPOSED",
+            "max": "ai-match",
+            "options": null,
+            "step": "ai-match"
+          },
+          "rev": 14,
+          "default_history": [
+            {
+              "rev": 14,
+              "default": 3
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [
+            "lanes_enabled"
+          ],
+          "active_when": {
+            "knob": "lanes_enabled",
+            "eq": true
+          }
+        },
+        {
+          "id": "lane_field_lanes",
+          "label": "Lane fields can land on",
+          "type": "picker",
+          "default": "centre-only",
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": [
+            {
+              "value": "centre-only",
+              "label": "The middle lane only"
+            },
+            {
+              "value": "any",
+              "label": "Any lane"
+            }
+          ],
+          "proposed": [],
+          "status": {
+            "default": "src",
+            "min": null,
+            "max": null,
+            "options": "src",
+            "step": null
+          },
+          "rev": 14,
+          "default_history": [
+            {
+              "rev": 14,
+              "default": "centre-only"
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [
+            "lanes_enabled"
+          ],
+          "description": "With an even lane_count, 'centre-only' covers both centre lanes (n/2 and n/2+1) (Engine Architect, DSK L43).",
+          "active_when": {
+            "knob": "lanes_enabled",
+            "eq": true
+          }
+        },
+        {
+          "id": "centre_lane",
+          "label": "Centre lane (even lane counts)",
+          "type": "picker",
+          "default": "lower",
+          "min": null,
+          "max": null,
+          "step": null,
+          "options": [
+            {
+              "value": "lower",
+              "label": "Lower (n/2)"
+            },
+            {
+              "value": "upper",
+              "label": "Upper (n/2 + 1)"
+            }
+          ],
+          "proposed": [
+            "default",
+            "options"
+          ],
+          "status": {
+            "default": "PROPOSED",
+            "min": null,
+            "max": null,
+            "options": "PROPOSED",
+            "step": null
+          },
+          "rev": 15,
+          "default_history": [
+            {
+              "rev": 15,
+              "default": "lower"
+            }
+          ],
+          "renamed_from": [],
+          "depends_on": [
+            "lanes_enabled",
+            "lane_count"
+          ],
+          "description": "Used where a behaviour needs one centre lane. lane_field_lanes 'centre-only' covers both centre lanes.",
+          "ruling": {
+            "by": "Engine Architect",
+            "date": "2026-11-09",
+            "note": "L43 even lane counts: a single-centre picker, default lower"
+          },
+          "active_when": {
+            "knob": "lanes_enabled",
+            "eq": true
+          }
+        }
+      ],
+      "presets": [],
+      "events": [
+        {
+          "id": "landedOn",
+          "when": "a move ends on a tile (normal, forced, warp/teleport, summon/placement); passing over never counts (EA 2026-11-09)"
+        },
+        {
+          "id": "pushBlocked",
+          "when": "push_into_walls on and a forced move meets a wall-block, an edge wall or a unit: {unit, blocker, cellsRemaining} (EA 2026-11-09)"
+        },
+        {
+          "id": "enteredLane",
+          "when": "lanes_enabled and a unit's move ends in another lane: {unit, lane} (rule hook, CoS 2026-11-09)"
+        }
+      ],
+      "renamed_from": [],
+      "retired_knobs": [],
+      "menu_order": [
+        {
+          "question": "What does each tile type mean?",
+          "knob_ids": [
+            "tile_types",
+            "lethal_landing_scope"
+          ]
+        },
+        {
+          "question": "Do walls block line of sight, shots and forced moves?",
+          "knob_ids": [
+            "wall_blocks_los",
+            "wall_blocks_shots",
+            "push_into_walls"
+          ]
+        },
+        {
+          "question": "Does the board have lanes?",
+          "knob_ids": [
+            "lanes_enabled"
+          ]
+        },
+        {
+          "question": "How are the lanes laid out?",
+          "knob_ids": [
+            "lane_axis",
+            "lane_count",
+            "lane_field_lanes",
+            "centre_lane"
+          ]
+        }
+      ],
+      "banned_combos": [],
+      "closure": "always",
+      "bans_note": "None known: the rev-13 coverage audit found no invalid knob combination in src or the docs (not an exhaustive proof).",
+      "composable_as": [],
+      "invariants": [
+        "No unit ever occupies a tile with open: false (Engine Architect 2026-11-09)."
+      ]
+    }
+  ]
 }
```

Full file as merged:

```json
{
  "kind": "catalogue-slice",
  "formatVersion": 1,
  "schema_version": 3,
  "catalogue_rev": 30,
  "gates": {
    "uses-card-hand": {
      "any": [
        {
          "knob": "ability-presentation.shortcut",
          "eq": "all-cards"
        },
        {
          "all": [
            {
              "knob": "ability-presentation.shortcut",
              "eq": "custom"
            },
            {
              "any": [
                {
                  "knob": "ability-presentation.basic_style",
                  "eq": "card-hand"
                },
                {
                  "knob": "ability-presentation.spells_style",
                  "eq": "card-hand"
                },
                {
                  "knob": "ability-presentation.custom_groups",
                  "some": {
                    "field": "style",
                    "eq": "card-hand"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    "uses-menu": {
      "any": [
        {
          "knob": "ability-presentation.shortcut",
          "eq": "all-menu"
        },
        {
          "all": [
            {
              "knob": "ability-presentation.shortcut",
              "eq": "custom"
            },
            {
              "any": [
                {
                  "knob": "ability-presentation.basic_style",
                  "eq": "unit-action-menu"
                },
                {
                  "knob": "ability-presentation.spells_style",
                  "eq": "unit-action-menu"
                },
                {
                  "knob": "ability-presentation.custom_groups",
                  "some": {
                    "field": "style",
                    "eq": "unit-action-menu"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "behaviours": [
    {
      "id": "unit-roster",
      "name": "Army Roster and Opening Formation",
      "group": "Objectives & Win",
      "summary": "Which pieces a side starts with, their health and attack, and where they stand on turn one (own back rank, or front rank).",
      "scope": "grid-tactics",
      "starter_safe": true,
      "knobs": [
        {
          "id": "board_cols",
          "label": "Board columns",
          "type": "slider",
          "default": 6,
          "min": 4,
          "max": 9,
          "step": 1,
          "options": null,
          "proposed": [
            "min",
            "max"
          ],
          "status": {
            "default": "src",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "src"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 6
            }
          ],
          "renamed_from": [],
          "depends_on": []
        },
        {
          "id": "board_rows",
          "label": "Board rows",
          "type": "slider",
          "default": 9,
          "min": 6,
          "max": 12,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min",
            "max"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 9
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "piece_count",
          "label": "Pieces per side",
          "type": "slider",
          "default": 6,
          "min": 1,
          "max": 12,
          "step": 1,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "ai-match",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 6
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "board_cols"
          ],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "unit_hp",
          "label": "Health",
          "type": "slider",
          "default": 9,
          "min": 1,
          "max": 21,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 9
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Set per unit: the roster value is the default for every unit, and a unit can override it in that unit's own stats. L5 difficulty marker l5:'hp' (runtime difficulty.hp; B1 / P1-2).",
          "per_unit": true,
          "l5": "hp",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "unit_atk",
          "label": "Attack",
          "type": "slider",
          "default": 1,
          "min": 0,
          "max": 2,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min",
            "max"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 1
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Set per unit: the roster value is the default for every unit, and a unit can override it in that unit's own stats.",
          "per_unit": true,
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "opening_row",
          "label": "Opening row",
          "type": "picker",
          "default": "back",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "back",
              "label": "Six on the far rank"
            },
            {
              "value": "second",
              "label": "Six on the second rank"
            },
            {
              "value": "front",
              "label": "Five on the front rank (deck shape)",
              "reads": {
                "from": "deck",
                "ref": "deck.openingFront",
                "deck_from": "hand-and-draw.deck",
                "type": "UnitId[]",
                "length": 5,
                "order": "west-to-east",
                "optional": true,
                "malformed": "not an array, or not exactly 5 entries",
                "if_missing": {
                  "use": "back",
                  "warning": "openingShapeMissing",
                  "once_per": "deck",
                  "warning_source": "/workspace/tileengine/data/project-format.md §6.8 (openingFront row line 1126; rules lines 1135-1144; warning table line 1539); /workspace/tileengine/data/setup-format.md §12.4i (lines 2211-2216) and §12.5 L44 (line 2223)"
                },
                "bad_id": {
                  "warning": "unknownRef",
                  "slot": "empty",
                  "note": "the other four are placed"
                },
                "type_source": "/workspace/tileengine/data/core-types.ts CoreDeck (line 194, MAY-MOVE): openingFront?: ReadonlyArray<UnitId> (line 203); UnitId = string (line 39)"
              }
            }
          ],
          "proposed": [],
          "status": {
            "default": "CEO-ruling",
            "min": null,
            "max": null,
            "options": "CEO-ruling",
            "step": null
          },
          "rev": 16,
          "default_history": [
            {
              "rev": 1,
              "default": "back"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "front reads the deck field openingFront (exactly five unit ids, west to east) of the bot side's deck (its effective hand-and-draw.deck). No deck, no openingFront, or a malformed one (not an array, or not exactly 5 entries) opens back with the warning openingShapeMissing, once per deck (once in total with no deck). An id that isn't a unit is unknownRef and that slot stays empty; the other four are placed. back and second ignore openingFront. Source: DSK project-format r14 §6.8, setup-format §12.4i/§12.5 (L44); type UnitId[] in core-types.ts CoreDeck (MAY-MOVE). DSK docs pinned to catalogue rev 17 / 544 knobs.",
          "ruling_note": "rev 17: field and warning named by DSK (project-format r14 §6.8; setup-format §12.5 L44), replacing PENDING-DSK-NAME and the PROPOSED name frontShapeMissing.",
          "ruling": {
            "by": "CEO",
            "date": "2026-11-09",
            "note": "relayed via CoS/DSK L44; user's choice"
          }
        },
        {
          "id": "clip_cues",
          "label": "Hit flash and attack lunge for units without clips",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 8,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "proposed_options": [
            false
          ]
        },
        {
          "id": "team_colour",
          "label": "Team colour",
          "type": "colour",
          "default": null,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 9,
          "default_history": [
            {
              "rev": 8,
              "default": "#badcff"
            },
            {
              "rev": 9,
              "default": null
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "ability-presentation.team_colours"
          ],
          "nullable": true,
          "ruling": {
            "by": "DSK",
            "date": "2026-11-09",
            "note": "L30: nullable, default null = palette; one source of truth (CoS ruling 'project default, army override' unchanged in substance)"
          }
        }
      ],
      "presets": [
        {
          "id": "btf-warrior",
          "label": "Warrior (BTF)",
          "deck": "Before The Fall",
          "cards": "-",
          "overrides": {
            "unit_hp": 9,
            "unit_atk": 1
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 WARRIOR_HP = 9, stampTowerArmy :931-933 hp/ad; towerStrike.ts:33 WARRIOR_DMG = 1, statueStrike :214"
        },
        {
          "id": "btf-archer",
          "label": "Archer (BTF)",
          "deck": "Before The Fall",
          "cards": "-",
          "overrides": {
            "unit_hp": 6,
            "unit_atk": 2
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 BACK_HP = 6, stampTowerArmy :934-937 isArcher hp/ad; towerStrike.ts:34 RANGER_DMG = 2, statueStrike :218"
        },
        {
          "id": "btf-mage",
          "label": "Mage (BTF)",
          "deck": "Before The Fall",
          "cards": "-",
          "overrides": {
            "unit_hp": 6,
            "unit_atk": 2
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 BACK_HP = 6, stampTowerArmy :934-937 isMage hp/ad; towerStrike.ts:35 BACK_DMG = 2, statueStrike :219"
        },
        {
          "id": "btf-cleric",
          "label": "Cleric (BTF)",
          "deck": "Before The Fall",
          "cards": "-",
          "overrides": {
            "unit_hp": 5,
            "unit_atk": 1
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 CLERIC_HP = 5, stampTowerArmy :927-929 hp/ad; towerStrike.ts statueStrike :217 return 1 (cleric is not in the :33-35 damage constants)"
        }
      ],
      "renamed_from": [],
      "retired_knobs": [
        {
          "id": "team_colour_override",
          "since_rev": 9,
          "reason": "Folded into the nullable team_colour (null = palette) (setup-format r8 §12.7 Q5, L30).",
          "fold": {
            "into": "team_colour",
            "when_false": "reset"
          }
        },
        {
          "id": "one_unit_per_tile",
          "since_rev": 15,
          "reason": "Cell density lives in the project setting settings.occupancy (project-format r14 §3.1; Engine Architect 2026-11-09).",
          "convert": {
            "to_setting": "settings.occupancy",
            "map": {
              "true": "strict1",
              "false": "softStack"
            },
            "scope": "project-level unit-roster setup only; stage values kept inactive with occupancyStageValueIgnored",
            "old_answer": "kept-inactive"
          }
        }
      ],
      "menu_order": [
        {
          "question": "Board size?",
          "knob_ids": [
            "board_cols",
            "board_rows"
          ]
        },
        {
          "question": "How many pieces?",
          "knob_ids": [
            "piece_count"
          ]
        },
        {
          "question": "Health and attack?",
          "knob_ids": [
            "unit_hp",
            "unit_atk"
          ]
        },
        {
          "question": "Where do they start?",
          "knob_ids": [
            "opening_row"
          ]
        },
        {
          "question": "Flash and lunge units that have no hit or attack clips?",
          "knob_ids": [
            "clip_cues"
          ]
        },
        {
          "question": "Team colour for this army (blank = project palette)",
          "knob_ids": [
            "team_colour"
          ]
        }
      ],
      "banned_combos": [
        {
          "id": "unit-roster.piece-count-gt-board-cols",
          "when": {
            "knob": "piece_count",
            "op": "gt",
            "value": "$board_cols"
          },
          "disable": {
            "knob": "piece_count"
          },
          "reason": "Pieces can't fit on one opening row.",
          "note": "value refers to another knob ($board_cols)"
        }
      ],
      "composable_as": [],
      "resolved_conflicts": [
        {
          "text": "Bot opening: BA 'five front A,M,C,C,W' and Terrain 'five front W,W,W,M,M' vs match-levels 'opens six on far rank'.",
          "ruling": {
            "by": "CEO",
            "date": "2026-11-09",
            "note": "relayed via CoS/DSK L44; user's choice: unit-roster.opening_row back (default) | second | front (per-deck five-piece shape)"
          }
        }
      ]
    },
    {
      "id": "terrain",
      "name": "Terrain (what each tile id means)",
      "group": "Map & Terrain",
      "summary": "The single home for tile meanings: for each logic tile id, whether units can stand, land or spawn there, whether landing kills, whether a push can enter, and whether it slows or trips. Edge walls (earth lines) are not tiles in the code: they sit on a tile's n/e/s/w edge and live in Barrier Line. Walls on tile edges (the map's logic.edges) always block movement and adjacency across that edge: that is core grid behaviour with no knob. The two wall knobs only decide whether walls also block line of sight and shots.",
      "scope": "grid-tactics",
      "starter_safe": true,
      "knobs": [
        {
          "id": "tile_types",
          "label": "Tile types",
          "type": "list",
          "default": [
            {
              "id": "floor",
              "label": "Floor",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "fallen",
              "label": "Fallen tile (abyss)",
              "open": false,
              "kills_on_landing": true,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "flask",
              "label": "Flask tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "rising",
              "label": "Rising tile (a unit is coming back here)",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "tide",
              "label": "Tide mark",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "warp-mark",
              "label": "Warp mark",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "sword-mark",
              "label": "Sword fade-in tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "boss-cover",
              "label": "Portal boss tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "vines",
              "label": "Vines",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": true,
              "trips": false,
              "buildable": false
            },
            {
              "id": "trap",
              "label": "Trap",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": true,
              "buildable": false
            },
            {
              "id": "water",
              "label": "Water",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "lava",
              "label": "Lava",
              "open": true,
              "kills_on_landing": true,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "wall-block",
              "label": "Wall block",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "path",
              "label": "Path",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "dirt",
              "label": "Dirt",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            }
          ],
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 23,
          "default_history": [
            {
              "rev": 7,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true
                }
              ]
            },
            {
              "rev": 9,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true
                },
                {
                  "id": "water",
                  "label": "Water",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "lava",
                  "label": "Lava",
                  "open": true,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "wall-block",
                  "label": "Wall block",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                }
              ]
            },
            {
              "rev": 10,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true
                },
                {
                  "id": "water",
                  "label": "Water",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "lava",
                  "label": "Lava",
                  "open": true,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "wall-block",
                  "label": "Wall block",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                }
              ]
            },
            {
              "rev": 15,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true,
                  "buildable": false
                },
                {
                  "id": "water",
                  "label": "Water",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "lava",
                  "label": "Lava",
                  "open": true,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "wall-block",
                  "label": "Wall block",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                }
              ]
            },
            {
              "rev": 23,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true,
                  "buildable": false
                },
                {
                  "id": "water",
                  "label": "Water",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "lava",
                  "label": "Lava",
                  "open": true,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "wall-block",
                  "label": "Wall block",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "path",
                  "label": "Path",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "dirt",
                  "label": "Dirt",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                }
              ]
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Built-ins water, lava and wall-block are CONFIRMED engine defaults (Engine Architect 2026-11-09, L27) and the defaultTileType targets of the procedural recipes (project-format r13 section 6.2.2 / 6.4): water@2 and murk@1 give water, lava@2 gives lava, wall gives wall-block, ice@1 gives floor in v1 (slippery ice is a future tile type), the rest give floor. buildable (item field, rev 15, PROPOSED, modes: td; v1: false): whether a structure may be placed on the tile. False on every built-in, floor included: grid tactics has no building and BTF never places structures, so false keeps tactics unchanged; a TD project sets it on its own tile types (Engine Architect / Modes Designer MODES-v2 §3, DSK L41). An added item field, so stored lists are not flagged. Rev 23 (DSK L45): built-ins path and dirt (walkable land, like floor, not buildable); 15 reserved items. wall-block stays the only catalogue spelling; wall_block is a reader alias in the format only (setup-format §2.9.3 rule 7). Existing answers drift by §2.9.3 rules 4 and 6 (appended to the effective value, nothing written).",
          "item_rulings": {
            "water": {
              "by": "Engine Architect",
              "date": "2026-11-09",
              "note": "L27 confirmed: open false, kills_on_landing false, push_can_enter false, slows_move false, trips false"
            },
            "lava": {
              "by": "Engine Architect",
              "date": "2026-11-09",
              "note": "L27 confirmed: open true, kills_on_landing true, push_can_enter true, slows_move false, trips false"
            },
            "wall-block": {
              "by": "Engine Architect",
              "date": "2026-11-09",
              "note": "L27 confirmed: open false, kills_on_landing false, push_can_enter false, slows_move false, trips false"
            },
            "path": {
              "by": "Engine Architect",
              "date": "2026-11-12",
              "note": "L45: built-in walkable land path and dirt (EUX r65 Q-A1/Q-A4); same walkability as floor, not buildable"
            },
            "dirt": {
              "by": "Engine Architect",
              "date": "2026-11-12",
              "note": "L45: built-in walkable land path and dirt (EUX r65 Q-A1/Q-A4); same walkability as floor, not buildable"
            }
          },
          "item": {
            "open": {
              "type": "toggle",
              "default": true
            },
            "kills_on_landing": {
              "type": "toggle",
              "default": false
            },
            "push_can_enter": {
              "type": "toggle",
              "default": true
            },
            "slows_move": {
              "type": "toggle",
              "default": false
            },
            "trips": {
              "type": "toggle",
              "default": false
            },
            "buildable": {
              "type": "toggle",
              "default": false
            }
          },
          "reserved_ids": [
            "floor",
            "fallen",
            "flask",
            "rising",
            "tide",
            "warp-mark",
            "sword-mark",
            "boss-cover",
            "vines",
            "trap",
            "water",
            "lava",
            "wall-block",
            "path",
            "dirt"
          ]
        },
        {
          "id": "lethal_landing_scope",
          "label": "Deadly tiles kill on",
          "type": "picker",
          "default": "any",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "any",
              "label": "Any landing"
            },
            {
              "value": "forced_only",
              "label": "Only forced landings (push, pull)"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": "any"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "tile_types"
          ],
          "description": "Which landings on a kills_on_landing tile kill. UX: the move highlight marks lethal cells and asks to confirm; the AI avoids them unless the scope or rules make it worthwhile.",
          "ruling": {
            "by": "Engine Architect",
            "date": "2026-11-09",
            "note": "lethal landing scope: any (default) or forced_only; shipped as DSK L36"
          }
        },
        {
          "id": "wall_blocks_los",
          "label": "Walls block line of sight",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 8,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "proposed_options": [
            false
          ]
        },
        {
          "id": "wall_blocks_shots",
          "label": "Walls block shots",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 8,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "proposed_options": [
            false
          ]
        },
        {
          "id": "push_into_walls",
          "label": "Forced moves slam into walls",
          "type": "toggle",
          "default": false,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 10,
          "default_history": [
            {
              "rev": 10,
              "default": false
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Slams into walls. On: a forced move that meets a wall-block or an edge wall stops on the last open cell and the core emits pushBlocked {unit, blocker: wall-block | edge | unit, cellsRemaining}; push-knockback's wall_slam_damage applies. Off: it still stops short, with no event.",
          "ruling_note": "Engine Architect 2026-11-09 supersedes the rev-10 'wall-block tiles only' reading: push_into_walls now covers edge walls too (for the event). No unit enters a closed tile either way (invariant).",
          "ruling": {
            "by": "DSK",
            "date": "2026-11-09",
            "note": "L34: wall-block blocks ordinary moves and all forced movement"
          }
        },
        {
          "id": "lanes_enabled",
          "label": "Board has lanes",
          "type": "toggle",
          "default": false,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "CoS-default",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": false
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "lanes are an optional tile-region tag plus a rule hook, off by default"
          }
        },
        {
          "id": "lane_axis",
          "label": "Lanes run along",
          "type": "picker",
          "default": "row",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "row",
              "label": "Rows (left to right)"
            },
            {
              "value": "column",
              "label": "Columns (top to bottom)"
            }
          ],
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": "src",
            "step": null
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": "row"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "lanes_enabled"
          ],
          "active_when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "lane_count",
          "label": "Number of lanes",
          "type": "slider",
          "default": 3,
          "min": 1,
          "max": 9,
          "step": 1,
          "options": null,
          "proposed": [
            "min"
          ],
          "status": {
            "default": "src",
            "min": "PROPOSED",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": 3
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "lanes_enabled"
          ],
          "active_when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "lane_field_lanes",
          "label": "Lane fields can land on",
          "type": "picker",
          "default": "centre-only",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "centre-only",
              "label": "The middle lane only"
            },
            {
              "value": "any",
              "label": "Any lane"
            }
          ],
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": "src",
            "step": null
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": "centre-only"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "lanes_enabled"
          ],
          "description": "With an even lane_count, 'centre-only' covers both centre lanes (n/2 and n/2+1) (Engine Architect, DSK L43).",
          "active_when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "centre_lane",
          "label": "Centre lane (even lane counts)",
          "type": "picker",
          "default": "lower",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "lower",
              "label": "Lower (n/2)"
            },
            {
              "value": "upper",
              "label": "Upper (n/2 + 1)"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 15,
          "default_history": [
            {
              "rev": 15,
              "default": "lower"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "lanes_enabled",
            "lane_count"
          ],
          "description": "Used where a behaviour needs one centre lane. lane_field_lanes 'centre-only' covers both centre lanes.",
          "ruling": {
            "by": "Engine Architect",
            "date": "2026-11-09",
            "note": "L43 even lane counts: a single-centre picker, default lower"
          },
          "active_when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        }
      ],
      "presets": [],
      "events": [
        {
          "id": "landedOn",
          "when": "a move ends on a tile (normal, forced, warp/teleport, summon/placement); passing over never counts (EA 2026-11-09)"
        },
        {
          "id": "pushBlocked",
          "when": "push_into_walls on and a forced move meets a wall-block, an edge wall or a unit: {unit, blocker, cellsRemaining} (EA 2026-11-09)"
        },
        {
          "id": "enteredLane",
          "when": "lanes_enabled and a unit's move ends in another lane: {unit, lane} (rule hook, CoS 2026-11-09)"
        }
      ],
      "renamed_from": [],
      "retired_knobs": [],
      "menu_order": [
        {
          "question": "What does each tile type mean?",
          "knob_ids": [
            "tile_types",
            "lethal_landing_scope"
          ]
        },
        {
          "question": "Do walls block line of sight, shots and forced moves?",
          "knob_ids": [
            "wall_blocks_los",
            "wall_blocks_shots",
            "push_into_walls"
          ]
        },
        {
          "question": "Does the board have lanes?",
          "knob_ids": [
            "lanes_enabled"
          ]
        },
        {
          "question": "How are the lanes laid out?",
          "knob_ids": [
            "lane_axis",
            "lane_count",
            "lane_field_lanes",
            "centre_lane"
          ]
        }
      ],
      "banned_combos": [],
      "closure": "always",
      "bans_note": "None known: the rev-13 coverage audit found no invalid knob combination in src or the docs (not an exhaustive proof).",
      "composable_as": [],
      "invariants": [
        "No unit ever occupies a tile with open: false (Engine Architect 2026-11-09)."
      ]
    }
  ]
}
```

### `src/editor/project/test-gate.ts` (edited)

```diff
diff --git a/src/editor/project/test-gate.ts b/src/editor/project/test-gate.ts
index c1719c3..1a60ea7 100644
--- a/src/editor/project/test-gate.ts
+++ b/src/editor/project/test-gate.ts
@@ -14,6 +14,9 @@ const SAY: Readonly<Record<string, string>> = {
 export const sentence = (row: ReportRow): string => SAY[row.code] ?? `Can't play: ${row.code}`;
 /** Map a play-stage throw (`play: seed`, `play: army`) onto the sheet sentence. Other text stays as written. */
 export const playLine = (error: string): string => { const line = SAY[error]; if (line !== undefined) return line; return error === "" ? "Can't play this project" : error; };
+const placed = (v: unknown): number => (Array.isArray(v) ? v.filter((row) => typeof row === "object" && row !== null && !Array.isArray(row)).length : 0);
+/** No team unit on a start tile, no NPC and no enemy. One side only still plays. */
+export const emptyBoard = (docs: { readonly stage: unknown; readonly chosen?: readonly string[] }): boolean => { const stage = docs.stage; if (typeof stage !== "object" || stage === null) return true; const doc = stage as Record<string, unknown>, pool = doc["enemyPool"]; return Math.min(docs.chosen?.length ?? 0, placed(doc["playerSpawns"])) === 0 && placed(doc["neutrals"]) === 0 && placed(typeof pool === "object" && pool !== null ? (pool as Record<string, unknown>)["entries"] : undefined) === 0; };
 export type TestGate = { readonly allowed: true } | { readonly allowed: false; readonly lines: readonly string[] };
 /** Hard rows block. Warnings do not. A read-only load blocks even when the report is empty. */
 export function testGate(report: readonly ReportRow[], readOnly: boolean): TestGate {
```

Full file as merged:

```ts
import type { ReportRow } from "../../project/load/types.ts";

/** Hard codes from S1 §8, one sentence each. Warnings are not in this table. */
const SAY: Readonly<Record<string, string>> = {
  brokenRef: "Stage 1 points at a map that's missing",
  invalidValue: "One value is the wrong kind of data",
  terrainLength: "The terrain list is a different length than the map",
  formatNewer: "Made with a newer TileEngine. Open only.",
  formatOlder: "This file is from an older TileEngine and can't be played.",
  notAProject: "Can't open: project.json missing",
  "play: seed": "Stage 1 has no seed yet, so it can't be played",
  "play: army": "This project has no unit roster yet, so it can't be played",
};
export const sentence = (row: ReportRow): string => SAY[row.code] ?? `Can't play: ${row.code}`;
/** Map a play-stage throw (`play: seed`, `play: army`) onto the sheet sentence. Other text stays as written. */
export const playLine = (error: string): string => { const line = SAY[error]; if (line !== undefined) return line; return error === "" ? "Can't play this project" : error; };
const placed = (v: unknown): number => (Array.isArray(v) ? v.filter((row) => typeof row === "object" && row !== null && !Array.isArray(row)).length : 0);
/** No team unit on a start tile, no NPC and no enemy. One side only still plays. */
export const emptyBoard = (docs: { readonly stage: unknown; readonly chosen?: readonly string[] }): boolean => { const stage = docs.stage; if (typeof stage !== "object" || stage === null) return true; const doc = stage as Record<string, unknown>, pool = doc["enemyPool"]; return Math.min(docs.chosen?.length ?? 0, placed(doc["playerSpawns"])) === 0 && placed(doc["neutrals"]) === 0 && placed(typeof pool === "object" && pool !== null ? (pool as Record<string, unknown>)["entries"] : undefined) === 0; };
export type TestGate = { readonly allowed: true } | { readonly allowed: false; readonly lines: readonly string[] };
/** Hard rows block. Warnings do not. A read-only load blocks even when the report is empty. */
export function testGate(report: readonly ReportRow[], readOnly: boolean): TestGate {
  const lines = report.filter((row) => row.severity === "hard").map(sentence);
  if (!readOnly && lines.length === 0) return { allowed: true };
  return { allowed: false, lines: lines.length > 0 ? lines : [SAY["formatNewer"] ?? "Made with a newer TileEngine. Open only."] };
}
```

### `src/rules/behaviours/wired.ts` (edited)

```diff
diff --git a/src/rules/behaviours/wired.ts b/src/rules/behaviours/wired.ts
index 4b99359..673a9ef 100644
--- a/src/rules/behaviours/wired.ts
+++ b/src/rules/behaviours/wired.ts
@@ -4,4 +4,5 @@ export const WIRED: Readonly<Record<string, readonly string[]>> = {
   "basic-attack": ["reach_mode", "custom_ns", "custom_ew"],
   "line-shot": ["range", "damage"],
   talk: ["line"],
+  "win-condition": ["wipe_wins"],
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
};
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 5b23aee..59678ef 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -7,6 +7,7 @@ import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts"
 import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
 import { addFind, rememberAbility } from "./add-ability.ts";
 import { DEV } from "./dev.ts"; // dev-only
+import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
 import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type AimAt, type PlayReady } from "./test-launch.ts";
@@ -14,7 +15,7 @@ import { startMatch } from "../play-stage/page.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
+type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
 const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
 let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve();
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
@@ -29,7 +30,7 @@ function sheet(): string {
   return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
 }
 function paint(): void {
-  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
+  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
@@ -89,8 +90,14 @@ async function fromUrl(): Promise<void> {
   state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
 }
 async function run(act: string): Promise<void> {
+  if (state.stageId !== null && store !== null && state.current !== null && ((state.screen === "stage" && (act.startsWith("r:") || (rulesOpen() && !unitEditing() && act.startsWith("k:")))) || (act === "undo" && state.undo === "rule"))) {
+    const hit = await rulesAct(act === "undo" ? "r:undo" : act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
+    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "rule"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || state.screen === "project") paint(); }, 6000); }
+    paint(); return;
+  }
   const unitUndo = act === "undo" && state.undo === "unit";
-  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
+  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
     const hadBanner = state.banner !== null;
     const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
@@ -112,13 +119,13 @@ async function run(act: string): Promise<void> {
     if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
     paint(); return;
   }
-  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
+  if (act.startsWith("stage:")) { rulesShut(); state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
   if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
     const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty;
     if (out.unitId !== undefined && !out.test) { openUnit(out.unitId); paint(); return; }
     if (out.test) return beginTest(out.unitId === undefined ? undefined : { unitId: out.unitId, ...(out.stageId === undefined ? {} : { stageId: out.stageId }) });
-    if (out.leave) state.screen = "project"; paint(); return;
+    if (out.leave) { rulesShut(); state.screen = "project"; } paint(); return;
   }
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
@@ -130,7 +137,7 @@ async function boot(): Promise<void> {
   try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
   try {
     const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
-    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
+    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/setup.rule.json")) { const parsed = parseProject({ "setups/setup.rule.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberRule(parsed.files["setups/setup.rule.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
     templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
   } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
 }
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
import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { backScreen, launchTest, openSaved, type AimAt, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
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
  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
  if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + edit + toast; return; }
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
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/setup.rule.json")) { const parsed = parseProject({ "setups/setup.rule.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberRule(parsed.files["setups/setup.rule.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) go(node.getAttribute("data-act") ?? ""); });
let held: { act: string; t: number } | null = null;
document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
void boot();
```

### `tools/maker/stage.ts` (edited)

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index 6b3d2f1..0907b4f 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -8,6 +8,7 @@ import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
 import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
 import type { ProjectFiles } from "../../src/project/load/types.ts";
 import { parseProject } from "./project-files.ts";
+import { rulesSheet } from "./rules-panel.ts";
 import { askSheet, moveChip, placeButtons, talkSheet, unitButtons, unitPicker } from "./stage-sheets.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 type Obj = Record<string, unknown>;
@@ -142,11 +143,11 @@ export function stageScreen(stageId: string, host: Host): string {
   const banner = host.banner === null ? "" : `<p class="banner bad" role="alert"${code === "" ? "" : ` data-error="${code}"`}>${esc(host.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
   const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
-  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
+  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button><button type="button" class="btn ghost" data-act="r:open">Rules</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
   const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
   const rows = sheetRows(got.slice, mark !== null);
   const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
-  const stood = mark === null ? "" : `<p>A unit stands here</p>${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
+  const stood = mark === null ? "" : `${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
   const place = mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
   const title = mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
   const where = mark === null && cell !== null ? `<p class="sub">Tile ${cell.c},${cell.r}</p>` : "";
@@ -162,7 +163,7 @@ export function stageScreen(stageId: string, host: Host): string {
   const who = sess.ask === null ? "" : askName(got.parsed, got.stage, sess.ask);
   const ask = sess.ask === null ? "" : sess.talking ? talkSheet(who, talkLimit(got.slice), sess.line) : askSheet(who);
   const pick = sess.pick === null ? "" : unitPicker(unitChoices(got.parsed));
-  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${pick}${ask}${view}${confirm}`;
+  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${pick}${ask}${view}${confirm}${rulesSheet(host.files, stageId, host.readOnly)}`;
 }
 function kept(host: Host): StageOut { return { ...host, leave: false, test: false }; }
 export async function stageClick(act: string, stageId: string, host: Host, io: Io): Promise<StageOut> {
```

Full file as merged:

```ts
import { badge, stageFor } from "../../src/editor/unit/panel.ts";
import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { paintCells, startNew } from "../../src/editor/stage/paint.ts";
import { addEnemy, addNeutral, addSpawn, attachTalk, infoText, moveEntry, placeRows, refuse, removeEntry, standHere, type PlaceList } from "../../src/editor/stage/place.ts";
import { closedType, sheetRows, typeLabel, type SheetRow } from "../../src/editor/stage/sheet.ts";
import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
import type { ProjectFiles } from "../../src/project/load/types.ts";
import { parseProject } from "./project-files.ts";
import { rulesSheet } from "./rules-panel.ts";
import { askSheet, moveChip, placeButtons, talkSheet, unitButtons, unitPicker } from "./stage-sheets.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Cell = { readonly c: number; readonly r: number };
type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string; readonly list: PlaceList; readonly index: number; readonly id: string; readonly n: number };
type Spot = { list: PlaceList; index: number; name: string };
export type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly banner: string | null; readonly dirty: boolean };
export type StageOut = Host & { readonly leave: boolean; readonly test: boolean; readonly unitId?: string; readonly stageId?: string };
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
function docAt(files: ProjectFiles, folder: string, id: string): { readonly path: string; readonly doc: Obj } | null {
  for (const [path, doc] of Object.entries(files)) if (path.startsWith(`${folder}/`) && isObj(doc) && doc["id"] === id) return { path, doc };
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
  const names = new Map<string, string>(), counts = new Map<string, number>();
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") { names.set(doc["id"], typeof doc["name"] === "string" ? doc["name"] : "Unit"); counts.set(doc["id"], badge(doc)); }
  const face = (id: string | undefined): { letter: string; name: string; id: string; n: number } => { const name = id === undefined ? "Unit" : names.get(id) ?? "Unit"; return { letter: name.slice(0, 1), name, id: id ?? "", n: id === undefined ? 0 : counts.get(id) ?? 0 }; };
  const out: Mark[] = [], team = chosen(files, stage);
  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name, list: "spawn", index: i, id: who.id, n: who.n }); });
  const pill = (entry: Obj, foe: boolean): string => { if (foe) return "Enemy"; const side = entry["side"]; return side === "player" ? "You" : typeof side === "string" && side !== "" && side !== "neutral" ? "Enemy" : "NPC"; };
  const put = (entry: unknown, foe: boolean, listName: PlaceList, index: number): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name, list: listName, index, id: who.id, n: who.n }); };
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
    const star = mark !== null && mark.n >= 1 ? `<span class="star">✦${mark.n}</span>` : "";
    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}"><span>${esc(text)}</span>${who}${star}</button>`;
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
  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button><button type="button" class="btn ghost" data-act="r:open">Rules</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
  const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
  const rows = sheetRows(got.slice, mark !== null);
  const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
  const stood = mark === null ? "" : `${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
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
  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${pick}${ask}${view}${confirm}${rulesSheet(host.files, stageId, host.readOnly)}`;
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
  if (act === "s:edit" || act === "s:try") {
    const mark = here(); if (mark === null || mark.id === "") return kept(host);
    if (act === "s:edit") { sess.sheet = null; return { ...kept(host), unitId: mark.id }; }
    const found = stageFor(got.parsed, mark.id); if (found === null) return kept(host);
    sess.sheet = null; return { ...host, leave: false, test: true, unitId: mark.id, stageId: found };
  }
  if (act === "s:move") { const mark = here(); if (mark === null) return kept(host); sess.moving = { list: mark.list, index: mark.index, name: mark.name }; sess.sheet = null; sess.note = null; return kept(host); }
  if (act === "s:move-cancel") { sess.moving = null; sess.note = null; return kept(host); }
  if (act === "s:delete") { const mark = here(); if (mark === null) return kept(host); sess.sheet = null; return commitStage(io, host, removeEntry(got.stage, mark), got.stage); }
  return kept(host);
}
```

### `tools/maker/test-launch.ts` (edited)

```diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index bacdd3d..fa49411 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -1,6 +1,6 @@
 import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
 import { planSave } from "../../src/editor/project/save.ts";
-import { testGate, playLine } from "../../src/editor/project/test-gate.ts";
+import { testGate, playLine, emptyBoard } from "../../src/editor/project/test-gate.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import type { Looks } from "../play-stage/load.ts";
 import { openProject, type PlayOut } from "../play-stage/project.ts";
@@ -22,6 +22,7 @@ function play(input: LaunchBag, text: DocText): Launch {
   if (!gate.allowed) return fail(gate.lines, text, rev);
   const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
   if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
+  if (emptyBoard(opened.docs)) return fail(["Place a unit on this stage to test it."], text, rev);
   try { input.start(opened.docs, input.aim); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
   showUrl(input.id, stageOf(opened.docs), input.from, input.aim); return { ok: true, files: text, rev };
 }
```

Full file as merged:

```ts
import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { testGate, playLine, emptyBoard } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import type { Looks } from "../play-stage/load.ts";
import { openProject, type PlayOut } from "../play-stage/project.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
export type PlayReady = PlayOut & { readonly looks: Looks };
export type AimAt = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
type Start = (docs: PlayReady, aim?: AimAt) => void;
export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start };
export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
const showUrl = (id: string, stage: string, from: string, aim?: AimAt): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; const unit = aim?.unitId === undefined ? "" : `&unit=${encodeURIComponent(aim.unitId)}`; const ability = aim?.abilityId === undefined ? "" : `&ability=${encodeURIComponent(aim.abilityId)}`; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}${unit}${ability}`); };
function play(input: LaunchBag, text: DocText): Launch {
  const parsed = parseProject(text);
  if (!parsed.ok) return fail([parsed.message], text, 0);
  const load = readProject(parsed.files), gate = testGate(load.report, load.readOnly), rev = storedRev(parsed.files);
  if (!gate.allowed) return fail(gate.lines, text, rev);
  const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
  if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
  if (emptyBoard(opened.docs)) return fail(["Place a unit on this stage to test it."], text, rev);
  try { input.start(opened.docs, input.aim); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
  showUrl(input.id, stageOf(opened.docs), input.from, input.aim); return { ok: true, files: text, rev };
}
/** Read a saved folder and start its stage. No demo fallback. */
export async function openSaved(input: LaunchBag): Promise<Launch> {
  const text = await readTree(input.store, prefix(input.id));
  if (Object.keys(text).length === 0) return fail([`Can't open: no project ${input.id}`], text, 0);
  return play(input, text);
}
/** Save first. A failed save does not start a match. */
export async function launchTest(input: LaunchBag & { readonly stored: DocText; readonly next: DocText; readonly rev: number; readonly now: string }): Promise<Launch> {
  const plan = planSave(input.stored, input.next, input.rev, input.now);
  if (!plan.ok) return fail([plan.message], input.stored, input.rev);
  const wrote = await commitWrites(input.store, prefix(input.id), plan.writes);
  if (!wrote.ok) return fail([wrote.message], input.stored, input.rev);
  const text = await readTree(input.store, prefix(input.id));
  return play(input, text);
}
```

### `tools/maker/unit-diagram.ts` (edited)

```diff
diff --git a/tools/maker/unit-diagram.ts b/tools/maker/unit-diagram.ts
index 49f0e93..5333c03 100644
--- a/tools/maker/unit-diagram.ts
+++ b/tools/maker/unit-diagram.ts
@@ -1,4 +1,5 @@
 import { readProject, type ProjectFiles } from "../../src/project/load/index.ts";
+import { playLine } from "../../src/editor/project/test-gate.ts";
 import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
 import { sliceDoc } from "../project/slice-of.ts";
 import { playDocsOf } from "../play-stage/project.ts";
@@ -39,4 +40,4 @@ export function diagramOf(files: ProjectFiles, unitId: string, behaviourId: stri
 }
 export function diagramCells(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null): readonly ReachCell[] { const view = diagramOf(files, unitId, behaviourId, answers); if ("reason" in view) throw new Error(view.reason); return view.cells; }
 const amp = String.fromCharCode(38), esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-export function diagramHtml(view: DiagramView): string { return "reason" in view ? `<p class="sub" data-diagram="off">${esc(view.reason)}</p>` : `<div class="reach-grid" role="img" aria-label="Reach">${view.cells.map((cell) => `<span${cell.on ? ' class="on"' : ""}>${cell.on ? "reach" : ""}</span>`).join("")}</div>`; }
+export function diagramHtml(view: DiagramView): string { return "reason" in view ? `<p class="sub" data-diagram="off">${esc(playLine(view.reason))}</p>` : `<div class="reach-grid" role="img" aria-label="Reach">${view.cells.map((cell) => `<span${cell.on ? ' class="on"' : ""}>${cell.on ? "reach" : ""}</span>`).join("")}</div>`; }
```

Full file as merged:

```ts
import { readProject, type ProjectFiles } from "../../src/project/load/index.ts";
import { playLine } from "../../src/editor/project/test-gate.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { sliceDoc } from "../project/slice-of.ts";
import { playDocsOf } from "../play-stage/project.ts";
import { BUNDLED } from "./catalogue.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export type ReachCell = { readonly c: number; readonly r: number; readonly on: boolean };
const grid = (reach: number | null): readonly ReachCell[] => Array.from({ length: 49 }, (_, i) => { const c = i % 7, r = Math.floor(i / 7); return { c, r, on: reach !== null && inOrthogonalReach({ c: 3, r: 3 }, { c, r }, reach) }; });
function shell(files: ProjectFiles): Obj | null { for (const [path, doc] of Object.entries(files)) if (path.startsWith("setups/") && isObj(doc)) return structuredClone(doc); return null; }
type Played = { readonly docs: ReturnType<typeof playDocsOf> } | { readonly reason: string };
function played(files: ProjectFiles): Played {
  const load = readProject(files);
  if (!load.ok || load.project === null) { const text = load.report.map((row) => [row.code, row.path, row.detail].filter((part) => part !== undefined).join(" ")).join("\n"); if (text === "") throw new Error("play: project"); return { reason: text }; }
  try { return { docs: playDocsOf(load.project) }; } catch (e) { if (!(e instanceof Error) || e.message === "") throw e; return { reason: e.message }; }
}
function withSlice(bag: Record<string, unknown>, behaviourId: string): void {
  const slice = bag["catalogue/slice.json"]; if (!isObj(slice) || list(slice["behaviours"]).some((row) => isObj(row) && row["id"] === behaviourId)) return;
  const ids = list(slice["behaviours"]).flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []);
  const cut = sliceDoc(BUNDLED, [...ids, behaviourId]); if (isObj(cut)) bag["catalogue/slice.json"] = cut;
}
function withCandidate(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null, on: boolean): ProjectFiles {
  const bag: Record<string, unknown> = structuredClone(files), path = `units/${unitId}.json`, unit = bag[path]; if (!isObj(unit)) return bag;
  const drop = new Set<string>(); for (const sid of list(unit["setupIds"])) { const setup = typeof sid === "string" ? bag[`setups/${sid}.json`] : undefined; if (typeof sid === "string" && isObj(setup) && setup["behaviourId"] === behaviourId) drop.add(sid); }
  const ids = list(unit["setupIds"]).filter((id) => typeof id === "string" && !drop.has(id)); if (!on) { bag[path] = { ...unit, setupIds: ids }; withSlice(bag, behaviourId); return bag; }
  const base = shell(files); if (base === null) return bag;
  const id = "setup_diagram", catalogue = isObj(base["catalogue"]) ? { ...base["catalogue"] } : {}, empty: Obj = {};
  catalogue["rev"] = 0; base["id"] = id; base["behaviourId"] = behaviourId; base["answers"] = answers === null ? empty : answers; base["catalogue"] = catalogue;
  bag[`setups/${id}.json`] = base; bag[path] = { ...unit, setupIds: [...ids, id] }; withSlice(bag, behaviourId); return bag;
}
export type DiagramView = { readonly cells: readonly ReachCell[] } | { readonly reason: string };
export function diagramOf(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null): DiagramView {
  const before = played(withCandidate(files, unitId, behaviourId, null, false)), after = played(withCandidate(files, unitId, behaviourId, answers, true));
  if ("reason" in before) return before; if ("reason" in after) return after;
  const a0 = before.docs.rules.abilities?.[unitId]?.length ?? 0, a1 = after.docs.rules.abilities?.[unitId]?.length ?? 0, grew = a1 > a0 ? after.docs.rules.abilities?.[unitId]?.[a1 - 1]?.reach : undefined;
  const r0 = before.docs.rules.reach?.[unitId], r1 = after.docs.rules.reach?.[unitId], reach = typeof grew === "number" ? grew : r1 !== r0 && typeof r1 === "number" ? r1 : null;
  return { cells: grid(reach) };
}
export function diagramCells(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null): readonly ReachCell[] { const view = diagramOf(files, unitId, behaviourId, answers); if ("reason" in view) throw new Error(view.reason); return view.cells; }
const amp = String.fromCharCode(38), esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export function diagramHtml(view: DiagramView): string { return "reason" in view ? `<p class="sub" data-diagram="off">${esc(playLine(view.reason))}</p>` : `<div class="reach-grid" role="img" aria-label="Reach">${view.cells.map((cell) => `<span${cell.on ? ' class="on"' : ""}>${cell.on ? "reach" : ""}</span>`).join("")}</div>`; }
```

### `tools/maker/units.ts` (edited)

```diff
diff --git a/tools/maker/units.ts b/tools/maker/units.ts
index 2d45557..bd7142a 100644
--- a/tools/maker/units.ts
+++ b/tools/maker/units.ts
@@ -3,6 +3,7 @@ import { addClick, addShut } from "./add-ability.ts";
 import { planSave } from "../../src/editor/project/save.ts";
 import { prefix, ulid } from "../../src/editor/project/home.ts";
 import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
+import { onTeam, setTeam } from "../../src/editor/unit/team.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 import { knobWidget, type KnobSpec } from "./widgets.ts";
@@ -98,12 +99,13 @@ export function unitPage(files: DocText, readOnly: boolean, banner: string | nul
   const bag = bagOf(files), hit = bag === null ? null : unitDoc(bag, sess.unit); if (bag === null || hit === null) return "";
   const { knobs, presets, army } = roster(bag), roles = rolesOf(knobs, presets), name = typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit";
   const stats = knobs.filter((knob) => knob["per_unit"] === true && knob["type"] === "slider").map((knob) => statBlock(hit.doc, knob, army)).join("");
+  const team = readOnly ? "" : `<button type="button" class="btn" data-act="t:team" aria-pressed="${onTeam(bag, sess.unit) ? "true" : "false"}" aria-label="On your team">On your team</button><p class="sub">Starts on your team's start tiles, in this order.</p>`;
   const abilities = abilityView(bag, hit.doc, readOnly);
   const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn" data-act="u:role">Start from a role</button>`;
   const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
   const note = banner === null ? "" : `<p class="banner bad" role="alert">${esc(banner)}</p>`;
   const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${esc(name)}</button>`;
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${team}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
 }
 async function undo(io: UnitIo, host: Host): Promise<UnitHit> {
   const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
@@ -169,6 +171,7 @@ export async function unitClick(act: string, host: Host, io: UnitIo): Promise<Un
   if (act.startsWith("u:reset:")) {
     const hit = await save(io, host, bag, { ...bag, [cur.path]: resetStat(cur.doc, act.slice(8)) }, "Changed · Undo"); return hit;
   }
+  if (act === "t:team") return save(io, host, bag, setTeam(bag, sess.unit, !onTeam(bag, sess.unit)), "Changed · Undo");
   if (act.startsWith("u:stat:")) {
     const parts = act.split(":"), key = parts[2] ?? "", value = Number(parts.slice(3).join(":")), knob = knobs.find((item) => item["id"] === key);
     if (knob === undefined || !Number.isFinite(value) || knob["per_unit"] !== true) return kept(host);
```

Full file as merged:

```ts
import { abilityAct, abilityOpen, abilityShut, abilityView, type AbilityPlay } from "./ability-panel.ts";
import { addClick, addShut } from "./add-ability.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { prefix, ulid } from "../../src/editor/project/home.ts";
import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
import { onTeam, setTeam } from "../../src/editor/unit/team.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
type DocText = Readonly<Record<string, string>>;
type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
type Sess = { project: string; mode: "add" | "rename" | "role" | "menu" | "note" | "edit" | null; unit: string; name: string; hint: string; lines: string[]; hidden: string[]; stack: Snap[] };
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type UnitHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly toast?: string | null; readonly shown?: string; readonly play?: AbilityPlay };
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
export function openUnit(id: string): void { abilityShut(); addShut(); sess.unit = id; sess.mode = "edit"; sess.hint = ""; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice = ""): DocText {
  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc);
  if (slice !== "") next["catalogue/slice.json"] = slice; return next;
}
async function commit(io: UnitIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
function roster(bag: Record<string, Obj>): { readonly knobs: readonly Obj[]; readonly presets: readonly unknown[]; readonly army: Obj | null } {
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
    const over = item["overrides"], keys = Object.keys(over); if (keys.length === 0 || keys.some((key) => !per.has(key) || typeof over[key] !== "number")) continue;
    const overrides: Record<string, number> = {}; for (const key of keys) { const n = over[key]; if (typeof n === "number") overrides[key] = n; }
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
async function save(io: UnitIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string, slice = ""): Promise<UnitHit> {
  const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after, slice));
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
  const team = readOnly ? "" : `<button type="button" class="btn" data-act="t:team" aria-pressed="${onTeam(bag, sess.unit) ? "true" : "false"}" aria-label="On your team">On your team</button><p class="sub">Starts on your team's start tiles, in this order.</p>`;
  const abilities = abilityView(bag, hit.doc, readOnly);
  const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn" data-act="u:role">Start from a role</button>`;
  const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
  const note = banner === null ? "" : `<p class="banner bad" role="alert">${esc(banner)}</p>`;
  const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${esc(name)}</button>`;
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${team}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
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
  if (act === "u:back") { sess.mode = null; sess.hint = ""; addShut(); return kept(host); }
  if (act === "u:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
  if (act.startsWith("a:") || act.startsWith("k:") || act.startsWith("g:")) {
    const live = bagOf(host.files); if (live === null) return { ...kept(host), banner: "Can't open this project" };
    if (act.startsWith("g:")) {
      const id = act.startsWith("g:add:") ? `setup_${ulid(Date.parse(io.now), io.bytes())}` : "";
      const hit = addClick(act, live, sess.unit, id);
      if ("bag" in hit) { if (hit.open !== undefined) abilityOpen(hit.open); return save(io, host, live, hit.bag, hit.toast, hit.slice); }
      return kept(host);
    }
    const hit = abilityAct(act, live, sess.unit);
    if ("play" in hit) return { ...kept(host), play: hit.play };
    if ("bag" in hit) return save(io, host, live, hit.bag, hit.toast);
    return kept(host);
  }
  if (act === "u:add") { sess.mode = "add"; sess.name = "New unit"; sess.hint = ""; return kept(host); }
  if (act === "u:role") { sess.mode = "role"; return kept(host); }
  if (act === "u:rename") { const bag = bagOf(host.files), hit = bag === null ? null : unitDoc(bag, sess.unit); sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : ""; sess.hint = ""; sess.mode = "rename"; return kept(host); }
  if (act.startsWith("u:open:")) { abilityShut(); addShut(); sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
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
  if (act === "t:team") return save(io, host, bag, setTeam(bag, sess.unit, !onTeam(bag, sess.unit)), "Changed · Undo");
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

### `tools/play-stage/load.ts` (edited)

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index 33b37c8..6977398 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -1,4 +1,5 @@
 import type { BattleSetup } from "../../src/rules/battle/battle.ts";
+import type { WinRule } from "../../src/rules/battle/win.ts";
 import type { SimInput } from "../../src/sim/types.ts";
 import type { CoreTileType } from "../../src/types/core-types.ts";
 
@@ -18,7 +19,7 @@ export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
 export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>> };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule };
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
```

Full file as merged:

```ts
import type { BattleSetup } from "../../src/rules/battle/battle.ts";
import type { WinRule } from "../../src/rules/battle/win.ts";
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
export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule };
export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
  if (hostSeed === undefined) throw new Error("play: seed");
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
}
```

### `tools/play-stage/match.ts` (edited)

```diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index fcde4e2..19703eb 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -18,9 +18,9 @@ type Btn = { readonly show: boolean; readonly on: boolean };
 export function createMatch(docs?: PlayDocs, moveMs = 200) {
   const body = docs ?? bundledDocs(), play = createPlay(body, moveMs, false), rules = body.rules, lines = body.talk ?? {}, names = body.names ?? {};
   const baseIntend = play.intend, baseSync = play.sync;
-  const win = installOne(WIN_CONDITION, {});
-  if (win.out === null) throw new Error("play: win-condition");
-  const me = play.sides.me, order = play.sides.order, wiped = play.sides.contest ? wipeRule(win.out, order) : null;
+  const win = body.win ?? installOne(WIN_CONDITION, {}).out;
+  if (win === null) throw new Error("play: win-condition");
+  const me = play.sides.me, order = play.sides.order, wiped = play.sides.contest ? wipeRule(win, order) : null;
   let side = me, outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [], armed: "unitSelected" | "actMenu" | null = null;
   const spent = new Set<string>();
   const spellList = (id: string): { id: string }[] => {
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
      return {
        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
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

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 1e7b33b..0b067a0 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -1,4 +1,6 @@
 import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
+import { ruleOf } from "../../src/project/rule-of.ts";
+import { WIN_CONDITION } from "../../src/rules/battle/win.ts";
 import { installOne } from "../../src/rules/behaviours/registry.ts";
 import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
 import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
@@ -25,6 +27,12 @@ export const bundledFiles = (): ProjectFiles => ({
   "units/unit_01JDAN00000000000000000001.json": u1, "units/unit_01JDAN00000000000000000002.json": u2, "units/unit_01JDAN00000000000000000003.json": u3, "units/unit_01JDAN00000000000000000004.json": u4, "units/unit_01JDAN00000000000000000005.json": u5, "units/unit_01JDAN00000000000000000006.json": u6, "units/unit_01JDAN00000000000000000007.json": u7,
   "setups/setup_01JDAT00000000000000000001.json": s1, "setups/setup_01JDAT00000000000000000002.json": s2, "setups/setup_01JDAT00000000000000000003.json": s3, "setups/setup_01JDAT00000000000000000004.json": s4, "setups/setup_01JDAT00000000000000000005.json": s5,
 });
+function winOf(store: ProjectStore, stage: Obj): PlayOut["win"] {
+  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "win-condition"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
+  if (hit.source !== "default" && !isObj(setup)) throw new Error("play: win-condition");
+  if (hit.source === "default" && !(Array.isArray(store.slice["behaviours"]) && store.slice["behaviours"].some((row) => isObj(row) && row["id"] === "win-condition"))) return undefined;
+  return WIN_CONDITION.install({ get: (key) => knob(isObj(setup) ? setup : {}, store.slice, "win-condition", key), unsupported(key, why) { throw new Error(why === undefined ? `play: win-condition ${key}` : `play: win-condition ${key} ${why}`); } });
+}
 /** Adapter only. Document JSON is already read by readProject. */
 export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
@@ -52,8 +60,8 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   }
   const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
   const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
-  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length);
-  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes };
+  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage);
+  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }) };
 }
 export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
   try {
```

Full file as merged:

```ts
import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
import { ruleOf } from "../../src/project/rule-of.ts";
import { WIN_CONDITION } from "../../src/rules/battle/win.ts";
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
  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage);
  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }) };
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

### `tests/editor/add-ability.test.ts` (edited)

```diff
diff --git a/tests/editor/add-ability.test.ts b/tests/editor/add-ability.test.ts
index 6419b42..7546a9d 100644
--- a/tests/editor/add-ability.test.ts
+++ b/tests/editor/add-ability.test.ts
@@ -3,7 +3,7 @@ import { readFileSync, readdirSync, statSync } from "node:fs";
 import { join } from "node:path";
 import { test } from "node:test";
 import { fileURLToPath } from "node:url";
-import { addAbility, addCase, addable, byGoal, updateProject, type AddEntry } from "../../src/editor/unit/add.ts";
+import { addAbility, addCase, addable, byGoal, canUpdate, updateProject, type AddEntry } from "../../src/editor/unit/add.ts";
 import { detach } from "../../src/editor/unit/panel.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
@@ -93,7 +93,28 @@ test("diagram comes from the engine", () => {
 });
 test("the Empty template gives that visible reason line", () => {
   const parsed = parseProject(walk("data/templates/empty.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return;
-  const html = diagramHtml(diagramOf(parsed.files, "unit_missing", "line-shot", null));
-  assert.equal(html.includes("play: army"), true); assert.equal(html.includes("reach-grid"), false); assert.equal(html.includes("data-diagram=\"off\""), true);
-  assert.throws(() => diagramCells(parsed.files, "unit_missing", "line-shot", null), (e: unknown) => e instanceof Error && e.message === "play: army");
+  const files = Object.fromEntries(Object.entries(parsed.files).filter(([path]) => !path.startsWith("setups/")));
+  const rootDoc = files["project.json"]; if (isObj(rootDoc) && isObj(rootDoc["project"])) rootDoc["project"] = { ...rootDoc["project"], rules: [] };
+  const html = diagramHtml(diagramOf(files, "unit_missing", "line-shot", null));
+  assert.equal(html.includes("This project has no unit roster yet, so it can&#39;t be played"), true); assert.equal(html.includes("play: army"), false);
+  assert.equal(html.includes("reach-grid"), false); assert.equal(html.includes("data-diagram=\"off\""), true);
+  assert.throws(() => diagramCells(files, "unit_missing", "line-shot", null), (e: unknown) => e instanceof Error && e.message === "play: army");
+});
+test("canUpdate refuses drifted knobs", () => {
+  const bag = demo(), slice = bag["catalogue/slice.json"]; assert.ok(isObj(slice)); if (!isObj(slice)) return;
+  const next = structuredClone(slice), row = (Array.isArray(next["behaviours"]) ? next["behaviours"] : []).find((item) => isObj(item) && item["id"] === "line-shot");
+  const knob = isObj(row) && Array.isArray(row["knobs"]) ? row["knobs"].find((item) => isObj(item) && item["id"] === "range") : undefined;
+  assert.ok(isObj(knob) && typeof knob["max"] === "number"); if (!isObj(knob) || typeof knob["max"] !== "number") return; knob["max"] += 1;
+  assert.equal(canUpdate(next, BUNDLED), false);
+  const rootDoc = bag["project.json"]; assert.ok(isObj(rootDoc) && isObj(rootDoc["project"])); if (!isObj(rootDoc) || !isObj(rootDoc["project"])) return;
+  rootDoc["project"] = { ...rootDoc["project"], catalogueRev: B - 1 }; bag["catalogue/slice.json"] = next;
+  const gate = addCase(bag, BUNDLED); assert.equal(gate.mode, "older"); if (gate.mode !== "older") return;
+  assert.equal(gate.update, false); assert.equal(gate.text, "This project needs a bigger update than the maker can do yet."); assert.equal(updateProject(bag, BUNDLED), null);
+});
+test("addable keeps goal-less primaries", () => {
+  const bundled = structuredClone(BUNDLED);
+  for (const row of bundled.behaviours) { if (row["id"] === "line-shot") delete row["goal"]; if (row["id"] === "basic-attack") row["goal"] = "flying"; }
+  const cards = addable(bundled, WIRED, { setupIds: [] }, {});
+  assert.deepEqual(cards.map((card) => card.id).sort(), ["basic-attack", "line-shot"]);
+  const last = byGoal(cards).at(-1); assert.equal(last?.title, "Other abilities"); assert.deepEqual(last?.cards.map((card) => card.id).sort(), ["basic-attack", "line-shot"]);
 });
```

Full file as merged:

```ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { addAbility, addCase, addable, byGoal, canUpdate, updateProject, type AddEntry } from "../../src/editor/unit/add.ts";
import { detach } from "../../src/editor/unit/panel.ts";
import { readProject } from "../../src/project/load/index.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { BUNDLED, revCase } from "../../tools/maker/catalogue.ts";
import { addChrome } from "../../tools/maker/add-ability.ts";
import { abilityAct } from "../../tools/maker/ability-panel.ts";
import { diagramCells, diagramHtml, diagramOf } from "../../tools/maker/unit-diagram.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { openProject, playDocsOf } from "../../tools/play-stage/project.ts";
import { sliceOf } from "../../tools/project/slice-of.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), KNIGHT = "unit_01JDAN00000000000000000001", ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005", SID = "setup_01JDADD0000000000000000001";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const demo = (): Obj => { const parsed = parseProject(walk("fixtures/demo.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return {}; const bag: Obj = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const skel = (): Obj => { const doc = JSON.parse(readFileSync(join(root, "data/templates/setup.ability.json"), "utf8")) as unknown; assert.ok(isObj(doc)); return doc; };
const idsOf = (slice: Obj): string[] => (Array.isArray(slice["behaviours"]) ? slice["behaviours"] : []).flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []);
const B = BUNDLED.catalogue_rev;
test("rev case same: add re-cuts the slice", () => {
  assert.equal(revCase(B, B), "same");
  const bag = demo(), slice = bag["catalogue/slice.json"], unit = bag[`units/${KNIGHT}.json`]; assert.ok(isObj(slice) && isObj(unit) && Array.isArray(slice["behaviours"])); if (!isObj(slice) || !isObj(unit) || !Array.isArray(slice["behaviours"])) return;
  slice["behaviours"] = slice["behaviours"].filter((row) => !(isObj(row) && row["id"] === "line-shot"));
  const used = idsOf(slice); assert.equal(used.includes("line-shot"), false);
  const got = addAbility(bag, skel(), KNIGHT, SID, "line-shot", BUNDLED); assert.equal(got.mode, "added"); if (got.mode !== "added") return;
  assert.equal(got.slice, sliceOf(BUNDLED, [...used, "line-shot"])); assert.match(got.slice, /"id": "line-shot"/);
  const again = addAbility(got.bag, skel(), KNIGHT, `${SID}x`, "line-shot", BUNDLED); assert.equal(again.mode, "missing");
  const setup = got.bag[`setups/${SID}.json`]; assert.ok(isObj(setup) && isObj(setup["answers"])); if (!isObj(setup) || !isObj(setup["answers"])) return;
  const want = BUNDLED.behaviours.find((row) => row["id"] === "line-shot")?.["knobs"];
  const keys = (Array.isArray(want) ? want : []).flatMap((knob) => isObj(knob) && typeof knob["id"] === "string" && Object.hasOwn(knob, "default") && !(typeof knob["no_default_reason"] === "string" && knob["no_default_reason"] !== "") ? [knob["id"]] : []);
  assert.deepEqual(Object.keys(setup["answers"]).sort(), [...keys].sort());
  for (const key of keys) assert.deepEqual(setup["answers"][key], { source: "default" });
  const load = readProject(got.bag); assert.equal(load.ok, true); assert.deepEqual([...load.report], []); assert.equal(load.project !== null, true); if (load.project === null) return;
  assert.equal(playDocsOf(load.project).rules.abilities?.[KNIGHT]?.[0]?.reach, 3);
});
test("rev case older: offer first, no rev-B entry", () => {
  assert.equal(revCase(B - 1, B), "older");
  const bag = demo(), rootDoc = bag["project.json"]; assert.ok(isObj(rootDoc) && isObj(rootDoc["project"])); if (!isObj(rootDoc) || !isObj(rootDoc["project"])) return;
  rootDoc["project"] = { ...rootDoc["project"], catalogueRev: B - 1 };
  const before = JSON.stringify(bag["catalogue/slice.json"]), gate = addCase(bag, BUNDLED);
  assert.equal(gate.mode, "older"); if (gate.mode !== "older") return; assert.equal(gate.text, "New abilities are available. Update this project to use them?"); assert.equal(gate.update, true);
  const refused = addAbility(bag, skel(), KNIGHT, SID, "line-shot", BUNDLED); assert.equal(refused.mode, "older"); assert.equal(JSON.stringify(bag["catalogue/slice.json"]), before);
  const wrote = updateProject(bag, BUNDLED); assert.ok(wrote !== null); if (wrote === null) return;
  const project = wrote.bag["project.json"]; assert.ok(isObj(project) && isObj(project["project"])); if (!isObj(project) || !isObj(project["project"])) return;
  assert.equal(project["project"]["catalogueRev"], B);
  for (const [path, doc] of Object.entries(wrote.bag)) if (path.startsWith("setups/") && isObj(doc) && isObj(doc["catalogue"])) assert.equal(doc["catalogue"]["rev"], B);
  const load = readProject(wrote.bag); assert.deepEqual([...load.report], []);
});
test("rev case newer: add is off", () => {
  assert.equal(revCase(B + 1, B), "newer");
  const bag = demo(), rootDoc = bag["project.json"], unit = bag[`units/${KNIGHT}.json`]; assert.ok(isObj(rootDoc) && isObj(rootDoc["project"]) && isObj(unit)); if (!isObj(rootDoc) || !isObj(rootDoc["project"]) || !isObj(unit)) return;
  rootDoc["project"] = { ...rootDoc["project"], catalogueRev: B + 1 };
  const gate = addCase(bag, BUNDLED); assert.equal(gate.mode, "newer"); if (gate.mode !== "newer") return;
  assert.equal(gate.text, "This project was made with a newer TileEngine. Update the app to add abilities.");
  const html = addChrome(bag, unit, false); assert.equal(html.includes("+ Add ability"), false); assert.equal(html.includes(gate.text), true); assert.equal(html.includes("g:add:"), false);
  const opened = openProject(bag); assert.equal(opened.docs !== null, true);
});
test("remove doesn't prune", () => {
  const bag = demo(), slice = bag["catalogue/slice.json"], unit = bag[`units/${ARCHER}.json`]; assert.ok(isObj(slice) && isObj(unit)); if (!isObj(slice) || !isObj(unit)) return;
  const before = JSON.stringify(slice), dropped = detach(unit, LINE), files: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(bag)) if (isObj(doc)) files[path] = doc;
  const hit = abilityAct(`a:drop:${LINE}`, files, ARCHER);
  assert.equal(Array.isArray(dropped["setupIds"]) && dropped["setupIds"].includes(LINE), false);
  assert.equal(JSON.stringify(slice), before); assert.match(before, /line-shot/);
  assert.equal("bag" in hit, true); if (!("bag" in hit)) return;
  assert.equal(JSON.stringify(hit.bag["catalogue/slice.json"]), before); assert.equal(hit.bag[`setups/${LINE}.json`], files[`setups/${LINE}.json`]);
});
test("missing goal goes to Other", () => {
  const cards: AddEntry[] = [{ id: "basic-attack", name: "Basic", summary: "hit", goal: "attack" }, { id: "bare", name: "Bare", summary: "none", goal: "" }, { id: "flyer", name: "Flyer", summary: "air", goal: "flying" }];
  const bins = byGoal(cards); assert.equal(bins.at(-1)?.title, "Other abilities"); assert.equal(bins[0]?.title, "Attack");
  assert.deepEqual(bins.at(-1)?.cards.map((card) => card.id), ["bare", "flyer"]); assert.equal(bins.length, 2);
  const load = readProject(demo()); assert.deepEqual([...load.report], []);
});
test("only wired primaries are offered", () => {
  const bag = demo(), unit = bag[`units/${KNIGHT}.json`]; assert.ok(isObj(unit)); if (!isObj(unit)) return;
  const cards = addable(BUNDLED, WIRED, unit, bag); assert.deepEqual(cards.map((card) => card.id).sort(), ["basic-attack", "line-shot"]);
  assert.equal(cards.every((card) => WIRED[card.id] !== undefined), true);
});
test("diagram comes from the engine", () => {
  const bag = demo(), on = (reach: number): string[] => { const cells: string[] = []; for (let r = 0; r < 7; r += 1) for (let c = 0; c < 7; c += 1) if (inOrthogonalReach({ c: 3, r: 3 }, { c, r }, reach)) cells.push(`${c},${r}`); return cells; };
  const mark = (answers: Obj | null): string[] => diagramCells(bag, KNIGHT, "line-shot", answers).filter((cell) => cell.on).map((cell) => `${cell.c},${cell.r}`);
  assert.deepEqual(mark(null), on(3)); assert.deepEqual(mark({ range: { source: "user", value: 2, rev: 1 } }), on(2)); assert.notDeepEqual(mark(null), mark({ range: { source: "user", value: 2, rev: 1 } }));
  const bare = demo(), live = bare["catalogue/slice.json"]; if (!isObj(live) || !Array.isArray(live["behaviours"])) return;
  live["behaviours"] = live["behaviours"].filter((row) => !(isObj(row) && row["id"] === "line-shot"));
  const held = bare[`setups/${LINE}.json`]; if (isObj(held)) held["answers"] = { range: { source: "default" }, damage: { source: "default" } };
  assert.deepEqual(diagramCells(bare, KNIGHT, "line-shot", null).filter((cell) => cell.on).map((cell) => `${cell.c},${cell.r}`), on(3));
});
test("the Empty template gives that visible reason line", () => {
  const parsed = parseProject(walk("data/templates/empty.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const files = Object.fromEntries(Object.entries(parsed.files).filter(([path]) => !path.startsWith("setups/")));
  const rootDoc = files["project.json"]; if (isObj(rootDoc) && isObj(rootDoc["project"])) rootDoc["project"] = { ...rootDoc["project"], rules: [] };
  const html = diagramHtml(diagramOf(files, "unit_missing", "line-shot", null));
  assert.equal(html.includes("This project has no unit roster yet, so it can&#39;t be played"), true); assert.equal(html.includes("play: army"), false);
  assert.equal(html.includes("reach-grid"), false); assert.equal(html.includes("data-diagram=\"off\""), true);
  assert.throws(() => diagramCells(files, "unit_missing", "line-shot", null), (e: unknown) => e instanceof Error && e.message === "play: army");
});
test("canUpdate refuses drifted knobs", () => {
  const bag = demo(), slice = bag["catalogue/slice.json"]; assert.ok(isObj(slice)); if (!isObj(slice)) return;
  const next = structuredClone(slice), row = (Array.isArray(next["behaviours"]) ? next["behaviours"] : []).find((item) => isObj(item) && item["id"] === "line-shot");
  const knob = isObj(row) && Array.isArray(row["knobs"]) ? row["knobs"].find((item) => isObj(item) && item["id"] === "range") : undefined;
  assert.ok(isObj(knob) && typeof knob["max"] === "number"); if (!isObj(knob) || typeof knob["max"] !== "number") return; knob["max"] += 1;
  assert.equal(canUpdate(next, BUNDLED), false);
  const rootDoc = bag["project.json"]; assert.ok(isObj(rootDoc) && isObj(rootDoc["project"])); if (!isObj(rootDoc) || !isObj(rootDoc["project"])) return;
  rootDoc["project"] = { ...rootDoc["project"], catalogueRev: B - 1 }; bag["catalogue/slice.json"] = next;
  const gate = addCase(bag, BUNDLED); assert.equal(gate.mode, "older"); if (gate.mode !== "older") return;
  assert.equal(gate.update, false); assert.equal(gate.text, "This project needs a bigger update than the maker can do yet."); assert.equal(updateProject(bag, BUNDLED), null);
});
test("addable keeps goal-less primaries", () => {
  const bundled = structuredClone(BUNDLED);
  for (const row of bundled.behaviours) { if (row["id"] === "line-shot") delete row["goal"]; if (row["id"] === "basic-attack") row["goal"] = "flying"; }
  const cards = addable(bundled, WIRED, { setupIds: [] }, {});
  assert.deepEqual(cards.map((card) => card.id).sort(), ["basic-attack", "line-shot"]);
  const last = byGoal(cards).at(-1); assert.equal(last?.title, "Other abilities"); assert.deepEqual(last?.cards.map((card) => card.id).sort(), ["basic-attack", "line-shot"]);
});
```

### `tests/editor/maker-law.test.ts` (edited)

```diff
diff --git a/tests/editor/maker-law.test.ts b/tests/editor/maker-law.test.ts
index 0a5ec3c..fb5a46a 100644
--- a/tests/editor/maker-law.test.ts
+++ b/tests/editor/maker-law.test.ts
@@ -13,7 +13,7 @@ export function lawHits(dir: string): string[] {
     readFileSync(path, "utf8").split("\n").forEach((line, i) => {
       const at = `${path}:${i + 1}`;
       if (!skip && colour.test(line)) hits.push(`${at} colour`); if (ts && (/"kind"\s*:\s*"tile-project"/.test(line) || /"kind"\s*:\s*"map"/.test(line))) hits.push(`${at} kind`);
-      if (ts && (path.includes(`${sep}stage${sep}`) || path.includes(`${sep}unit${sep}`)) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
+      if (ts && (path.includes(`${sep}stage${sep}`) || path.includes(`${sep}unit${sep}`) || path.includes(`${sep}rules${sep}`)) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
       if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
       if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
     });
@@ -23,7 +23,7 @@ export function lawHits(dir: string): string[] {
 const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
 const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
 test("maker law holds, tokens match, and each plant fails", () => {
-  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []); assert.deepEqual(lawHits(join(root, "src/editor/unit")), []);
+  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []); assert.deepEqual(lawHits(join(root, "src/editor/unit")), []); assert.deepEqual(lawHits(join(root, "src/editor/rules")), []);
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
  const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["doc.ts", "export const v = \"formatVersion\";\n"], ["unquoted.ts", "export const d = { kind: \"behaviour-setup\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
  rmSync(dir, { recursive: true });
});
```

### `tests/editor/units.test.ts` (edited)

```diff
diff --git a/tests/editor/units.test.ts b/tests/editor/units.test.ts
index 733edb8..61ae795 100644
--- a/tests/editor/units.test.ts
+++ b/tests/editor/units.test.ts
@@ -5,7 +5,8 @@ import { test } from "node:test";
 import { fileURLToPath } from "node:url";
 import { ulid } from "../../src/editor/project/home.ts";
 import { pop, push } from "../../src/editor/stage/undo.ts";
-import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
+import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError, usedBy } from "../../src/editor/unit/units.ts";
+import { setTeam } from "../../src/editor/unit/team.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import { readUnit } from "../../src/project/read/unit.ts";
 import { parseProject } from "../../tools/maker/project-files.ts";
@@ -41,3 +42,15 @@ test("units", () => {
   const before: readonly string[] = [], stack = push([before], before), hidden = [id];
   assert.equal(shown(files, hidden).some((row) => row.id === id), false); const undone = pop(stack); assert.equal(shown(files, undone?.snap ?? hidden).some((row) => row.id === id), true);
 });
+test("on your team writes the loadout", () => {
+  const empty = bag("data/templates/empty.tileproj"), skel = JSON.parse(text("data/templates/unit.json")) as Record<string, unknown>, id = "unit_01TEAM0000000000000000001A";
+  const files: Record<string, Record<string, unknown>> = { ...empty, [`units/${id}.json`]: newUnit(skel, id, "Scout") };
+  const gear = (doc: Record<string, Record<string, unknown>>): { roster: string[]; size: number; required: unknown[] } => (doc["project.json"]?.["project"] as { loadout: { roster: string[]; size: number; required: unknown[] } }).loadout;
+  const stages = JSON.stringify(Object.entries(files).filter(([path]) => path.startsWith("stages/")));
+  assert.equal(gear(files).roster.length, 0);
+  const on = setTeam(files, id, true), once = gear(on);
+  assert.equal(once.roster.at(-1), id); assert.equal(once.roster.length, 1); assert.equal(once.size, 1); assert.deepEqual(once.required, gear(files).required);
+  assert.equal(gear(setTeam(on, id, true)).roster.length, 1); assert.equal(JSON.stringify(Object.entries(on).filter(([path]) => path.startsWith("stages/"))), stages);
+  const off = setTeam(on, id, false); assert.deepEqual(gear(off).roster, []); assert.equal(gear(off).size, 1); assert.equal(deleteUnit(off, id).ok, true); assert.equal(deleteUnit(on, id).ok, false);
+  assert.deepEqual([...usedBy(on, id)], ["Used in your team list. Remove it there first."]);
+});
```

Full file as merged:

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { ulid } from "../../src/editor/project/home.ts";
import { pop, push } from "../../src/editor/stage/undo.ts";
import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError, usedBy } from "../../src/editor/unit/units.ts";
import { setTeam } from "../../src/editor/unit/team.ts";
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
test("on your team writes the loadout", () => {
  const empty = bag("data/templates/empty.tileproj"), skel = JSON.parse(text("data/templates/unit.json")) as Record<string, unknown>, id = "unit_01TEAM0000000000000000001A";
  const files: Record<string, Record<string, unknown>> = { ...empty, [`units/${id}.json`]: newUnit(skel, id, "Scout") };
  const gear = (doc: Record<string, Record<string, unknown>>): { roster: string[]; size: number; required: unknown[] } => (doc["project.json"]?.["project"] as { loadout: { roster: string[]; size: number; required: unknown[] } }).loadout;
  const stages = JSON.stringify(Object.entries(files).filter(([path]) => path.startsWith("stages/")));
  assert.equal(gear(files).roster.length, 0);
  const on = setTeam(files, id, true), once = gear(on);
  assert.equal(once.roster.at(-1), id); assert.equal(once.roster.length, 1); assert.equal(once.size, 1); assert.deepEqual(once.required, gear(files).required);
  assert.equal(gear(setTeam(on, id, true)).roster.length, 1); assert.equal(JSON.stringify(Object.entries(on).filter(([path]) => path.startsWith("stages/"))), stages);
  const off = setTeam(on, id, false); assert.deepEqual(gear(off).roster, []); assert.equal(gear(off).size, 1); assert.equal(deleteUnit(off, id).ok, true); assert.equal(deleteUnit(on, id).ok, false);
  assert.deepEqual([...usedBy(on, id)], ["Used in your team list. Remove it there first."]);
});
```

### `tests/tools/play-stage-source.test.ts` (edited)

```diff
diff --git a/tests/tools/play-stage-source.test.ts b/tests/tools/play-stage-source.test.ts
index fac0db1..17c7bb6 100644
--- a/tests/tools/play-stage-source.test.ts
+++ b/tests/tools/play-stage-source.test.ts
@@ -28,11 +28,11 @@ function readDir(rel: string): Record<string, string> {
 function readJson(rel: string): Record<string, unknown> {
   return Object.fromEntries(Object.entries(readDir(rel)).map(([path, text]) => [path, JSON.parse(text) as unknown]));
 }
-test("openProject on a saved demo has no demo dressing and Empty cannot open", () => {
+test("openProject on a saved demo has no demo dressing and the empty template plays", () => {
   const saved = openProject(readJson("data/templates/demo.tileproj"));
   assert.equal(saved.docs?.looks.canopy.length, 0); assert.equal(saved.docs?.looks.braziers.length, 0);
   const empty = openProject(readJson("data/templates/empty.tileproj"));
-  assert.equal(empty.docs, null); assert.equal(empty.error, "play: army");
+  assert.equal(empty.docs === null, false); assert.equal(empty.error, "");
   const demo = openBundled();
   assert.deepEqual(demo.docs?.looks.canopy, DEMO_LOOKS.canopy); assert.deepEqual(demo.docs?.looks.braziers, DEMO_LOOKS.braziers);
   const staged = openProject(loadFixture(), "stage_01JDAS00000000000000000001");
@@ -44,7 +44,7 @@ test("test-launch: Empty stays in the maker", async () => {
   let started = false;
   const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(readJson("data/templates/empty.tileproj")), from: "project", now: NOW, start() { started = true; } });
   assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
-  assert.equal(got.lines[0], "This project has no unit roster yet, so it can't be played");
+  assert.equal(got.lines[0], "Place a unit on this stage to test it.");
 });
 test("test-launch: start throws, maker stays", async () => {
   const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
```

Full file as merged:

```ts
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { WIN_CONDITION, wipeRule } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createWorld, runMatch, snapshot } from "../../src/sim/index.ts";
import { projectScreen } from "../../tools/maker/project.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { launchTest, openSaved } from "../../tools/maker/test-launch.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { DEMO_LOOKS } from "../../tools/play-stage/looks.ts";
import { openBundled, openProject } from "../../tools/play-stage/project.ts";
import { loadFixture } from "./demo-fixture.ts";
const NOW = "2026-11-19T00:00:00.000Z";
const root = fileURLToPath(new URL("../..", import.meta.url));
const sha = (v: unknown): string => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const slug = (text: string): string => text.replaceAll("unit_01JDAN00000000000000000001", "knight").replaceAll("unit_01JDAN00000000000000000002", "archer").replaceAll("unit_01JDAN00000000000000000003", "cleric").replaceAll("unit_01JDAN00000000000000000004", "wolf").replaceAll("unit_01JDAN00000000000000000005", "villager").replaceAll("unit_01JDAN00000000000000000006", "crate").replaceAll("unit_01JDAN00000000000000000007", "merchant");
function readDir(rel: string): Record<string, string> {
  const out: Record<string, string> = {}, walk = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, next); else out[next] = readFileSync(path, "utf8"); } };
  walk(join(root, rel), ""); return out;
}
function readJson(rel: string): Record<string, unknown> {
  return Object.fromEntries(Object.entries(readDir(rel)).map(([path, text]) => [path, JSON.parse(text) as unknown]));
}
test("openProject on a saved demo has no demo dressing and the empty template plays", () => {
  const saved = openProject(readJson("data/templates/demo.tileproj"));
  assert.equal(saved.docs?.looks.canopy.length, 0); assert.equal(saved.docs?.looks.braziers.length, 0);
  const empty = openProject(readJson("data/templates/empty.tileproj"));
  assert.equal(empty.docs === null, false); assert.equal(empty.error, "");
  const demo = openBundled();
  assert.deepEqual(demo.docs?.looks.canopy, DEMO_LOOKS.canopy); assert.deepEqual(demo.docs?.looks.braziers, DEMO_LOOKS.braziers);
  const staged = openProject(loadFixture(), "stage_01JDAS00000000000000000001");
  const stage = staged.docs?.stage; assert.equal(typeof stage === "object" && stage !== null && "id" in stage && stage.id, "stage_01JDAS00000000000000000001");
});
test("test-launch: Empty stays in the maker", async () => {
  const id = "project_01JDEM00000000000000000001", store = memoryStore(), stored = readDir("data/templates/empty.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  let started = false;
  const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(readJson("data/templates/empty.tileproj")), from: "project", now: NOW, start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.equal(got.lines[0], "Place a unit on this stage to test it.");
});
test("test-launch: start throws, maker stays", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const pushed: string[] = [], loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }, prev = loc.history;
  loc.history = { pushState(_state, _title, url) { pushed.push(url); } };
  try {
    const got = await launchTest({ store, id, stored, next: stored, rev: storedRev(readJson("data/templates/demo.tileproj")), from: "project", now: NOW, start() { throw new Error("play: seed"); } });
    assert.equal(got.ok, false); if (got.ok) return;
    assert.equal(got.lines[0], "Stage 1 has no seed yet, so it can't be played"); assert.deepEqual(pushed, []);
  } finally { if (prev === undefined) delete loc.history; else loc.history = prev; }
});
test("test-launch: save fails, no launch", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const next = { ...stored, "project.json": stored["project.json"]?.replace("\"name\": \"Demo\"", "\"name\": \"Demo 2\"") ?? "" };
  store.failOn(`${prefix(id)}project.json.tmp`);
  let started = false;
  const got = await launchTest({ store, id, stored, next, rev: storedRev(readJson("data/templates/demo.tileproj")), from: "project", now: NOW, start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.match(got.lines[0] ?? "", /Couldn't save/); assert.equal(store.files.get(`${prefix(id)}project.json`), stored["project.json"]);
  const html = projectScreen({ name: "Demo", stages: 1, dirty: true, readOnly: false, banner: got.lines[0] ?? null, problems: [] });
  assert.match(html, /Couldn(?:'|&#39;)t save/); assert.match(html, /data-act="test"/); assert.equal(html.includes("openBundled"), false);
});
test("an unreadable project shows the error and does not launch the demo", async () => {
  const store = memoryStore(); await store.write(`${prefix("bad")}project.json`, "{");
  let started = false;
  const got = await openSaved({ store, id: "bad", from: "project", start() { started = true; } });
  assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
  assert.match(got.lines[0] ?? "", /Can't open/); assert.equal(got.lines.join(" ").includes("knight"), false);
});
test("Test on the demo template matches the parity golden and leaves the folder byte-identical", async () => {
  const id = "project_01JDAP00000000000000000001", store = memoryStore(), stored = readDir("data/templates/demo.tileproj");
  for (const [path, text] of Object.entries(stored)) await store.write(`${prefix(id)}${path}`, text);
  const before = [...store.files.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  const got = await launchTest({ store, id, stored, next: stored, rev: 1, from: "project", now: NOW, start(docs) {
    const input = docsToInput(docs).input, win = installOne(WIN_CONDITION, {}).out, budget = installOne(ACTION_BUDGET, {}).out;
    if (win === null || budget === null) throw new Error("parity: rules");
    const world = createWorld(input);
    const result = runMatch(world, { sides: ["player", "wolves"], ai: botAbilityPriority({ actionsPerTurn: budget.actionsPerTurn, setup: docs.rules }), victory: wipeRule(win, ["player", "wolves"]), fuse: "off", maxRounds: 80, maxSimMs: 100000 });
    const hash = { outcome: result.outcome, snapshot: sha(JSON.parse(slug(JSON.stringify(snapshot(world))))), log: sha(slug(world.log.toJSON())), bus: sha(JSON.parse(slug(JSON.stringify(world.bus.history())))) };
    assert.deepEqual(hash, JSON.parse(readFileSync(new URL("./golden/demo-parity.json", import.meta.url), "utf8")) as unknown);
  } });
  assert.equal(got.ok, true);
  assert.deepEqual([...store.files.entries()].sort(([a], [b]) => (a < b ? -1 : 1)), before);
});
```

### `handoff/steps/tests/s3-test/touch-smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s3-test/touch-smoke.mjs b/handoff/steps/tests/s3-test/touch-smoke.mjs
index b697bc5..eeb55b2 100644
--- a/handoff/steps/tests/s3-test/touch-smoke.mjs
+++ b/handoff/steps/tests/s3-test/touch-smoke.mjs
@@ -119,7 +119,7 @@ try {
       await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(80);
       await press(page, "Continue"); await press(page, "Create"); await press(page, "Test");
       const got = await page.evaluate(() => ({ app: getComputedStyle(document.querySelector("#app")).display, board: document.querySelector("#board") !== null, text: document.querySelector(".sheet")?.textContent ?? "", test: document.querySelector("[data-act=test]") !== null }));
-      if (got.app === "none" || got.board || !got.text.includes("no unit roster yet") || !got.test) throw new Error(JSON.stringify(got));
+      if (got.app === "none" || got.board || !got.text.includes("Place a unit on this stage to test it") || !got.test) throw new Error(JSON.stringify(got));
     });
     await ctx.close();
   };
```

Full file as merged:

```js
// Step 3 ?project= touch smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8798"] = process.argv;
if (!WT) { console.error("usage: node touch-smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT);
const { fitView } = await import(pathToFileURL(join(root, "src/runtime/render/fit.ts")).href);
const { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s3-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const shot = async (page) => page.evaluate(() => { const c = document.querySelector("#board"), rect = c.getBoundingClientRect(), cam = window.__cam; return { w: c.width, h: c.height, left: rect.left, top: rect.top, rw: rect.width, rh: rect.height, x: cam.x, y: cam.y, s: cam.s }; });
const screenOf = (g, c, r) => { const k = g.w / g.rw, ky = g.h / g.rh, f = fitView(g.w, g.h, g.s, 16, 16); return { x: g.left + (f.padX + ((c + 0.5) * 16 - g.x) * f.s) / k, y: g.top + (f.padY + ((r + 0.5) * 16 - g.y) * f.s) / ky, f }; };
const tileOf = (cam, ox, oy) => { const f = fitView(cam.w, cam.h, cam.s, 16, 16); return { c: Math.floor(((ox * (cam.w / cam.rw) - f.padX) / f.s + cam.x) / 16), r: Math.floor(((oy * (cam.h / cam.rh) - f.padY) / f.s + cam.y) / 16) }; };
const tapCell = async (page, c, r) => { const g = await shot(page), at = screenOf(g, c, r); await page.evaluate(() => { window.__up = null; }); await page.touchscreen.tap(at.x, at.y); await page.waitForTimeout(60); const up = await page.evaluate(() => window.__up), tile = up === null ? null : tileOf(up.cam, up.x, up.y); if (up === null || up.trust !== true || tile === null || tile.c !== c || tile.r !== r) throw new Error(`tap ${c},${r} -> ${JSON.stringify({ at, up, tile })}`); };
const until = async (page, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await page.evaluate(() => window.__wait())) return; await page.waitForTimeout(40); } throw new Error("timeout"); };
const fingers = async (page, pts) => { const cdp = await page.context().newCDPSession(page); const send = (type, at) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: at.map((p, i) => ({ x: p[0], y: p[1], id: i + 1 })) }); await send("touchStart", pts); for (let i = 1; i <= 6; i += 1) await send("touchMove", pts.map((p) => [p[0] + p[2] * i, p[1] + p[3] * i])); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await cdp.detach(); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }); await btn.first().waitFor({ timeout: 15000 }); await btn.first().scrollIntoViewIfNeeded(); const box = await btn.first().boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); await page.waitForTimeout(80); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); const errs = [], ext = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("request", (r) => { const u = r.url(); if (!(u.startsWith(origin) || u.startsWith("data:") || u.startsWith("blob:"))) ext.push(u); });
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    const testAt = await page.locator("[data-act=test]").boundingBox(); if (testAt === null) throw new Error("no test");
    await press(page, "Test");
    await page.waitForFunction(() => location.search.includes("project=") && window.__play !== undefined && window.__hud !== undefined && window.__driver.stats.draws > 0, null, { timeout: 15000 });
    const opened = await page.evaluate(() => { const p = window.__docs.manifest.project, q = new URLSearchParams(location.search); return { id: p.id, name: p.name, query: q.get("project"), canopy: window.__docs.looks.canopy.length, braziers: window.__docs.looks.braziers.length }; });
    if (opened.name !== "My game" || opened.id !== opened.query || opened.id === "project_01JDAP00000000000000000001" || opened.canopy !== 0 || opened.braziers !== 0) throw new Error(JSON.stringify(opened));
    await page.evaluate(() => { const c = document.querySelector("#board"); window.__up = null; c.addEventListener("pointerup", (e) => { const cam = window.__cam, b = c.getBoundingClientRect(); window.__up = { trust: e.isTrusted, x: e.offsetX, y: e.offsetY, cam: { w: c.width, h: c.height, rw: b.width, rh: b.height, x: cam.x, y: cam.y, s: cam.s } }; }, true); window.__hud.hideBanner(); window.__play.followId = null; const s = Math.max(1, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
    await page.waitForTimeout(80);
    const knight = await page.evaluate(() => window.__play.scene().units.find((u) => u.sprite === "starter:hero-sword").id);
    const turns0 = await page.evaluate(() => window.__play.view().turns);
    const step = async (name, ms, fn) => { try { await Promise.race([fn(), new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]); check(`${name} @${width}`, true, "ok"); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await step("1 select", 5000, async () => { const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r); const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`selected ${sel}`); });
    await step("2 walk", 5000, async () => {
      const cell = await page.evaluate(() => { const c = window.__play.reach[0]; return c ? { c: c.c, r: c.r } : null; }); if (cell === null) throw new Error("no reach");
      const from = await page.evaluate((id) => { const u = window.__play.world.units.get(id); return { c: u.at.c, r: u.at.r }; }, knight);
      await page.evaluate((p) => { window.__wait = () => { const u = window.__play.world.units.get(p.id); return window.__play.walk === null && u.at.c === p.c && u.at.r === p.r && window.__play.world.phases.battle === "actMenu"; }; }, { id: knight, c: cell.c, r: cell.r });
      await tapCell(page, cell.c, cell.r); await until(page, 4800);
      const moved = await page.evaluate((p) => { const u = window.__play.world.units.get(p.id); return u.at.c !== p.c || u.at.r !== p.r; }, { id: knight, c: from.c, r: from.r }); if (!moved) throw new Error("still at start");
    });
    await step("3 attack", 5000, async () => {
      const placed = await page.evaluate((id) => { const play = window.__play, me = play.world.units.get(id), occ = (c, r) => play.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r); const spots = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: me.at.c + dc, r: me.at.r + dr })).filter((p) => play.world.grid.inBounds(p) && play.world.grid.isOpen(p) && !occ(p.c, p.r)); const wolf = play.scene().units.find((u) => u.sprite === "starter:enemy-wolf" && u.alive); if (spots[0] === undefined || wolf === undefined || !play.world.units.moveTo(wolf.id, spots[0], "move").ok) return null; return { id: wolf.id, c: spots[0].c, r: spots[0].r, before: play.world.log.entries().filter((e) => e.action.kind === "ability").length }; }, knight);
      if (placed === null) throw new Error("no neighbour");
      await page.locator("#attack").waitFor({ state: "visible", timeout: 3000 }); const btn = await page.locator("#attack").boundingBox(); if (btn === null) throw new Error("no attack");
      await page.touchscreen.tap(btn.x + btn.width / 2, btn.y + btn.height / 2); await page.waitForTimeout(40); await tapCell(page, placed.c, placed.r);
      const got = await page.evaluate((p) => { const play = window.__play, hp = play.world.rules.state().units.find((u) => u.id === p.id)?.hp ?? 99; return { hp, phase: play.world.phases.battle, done: play.done.has(p.knight), logs: play.world.log.entries().filter((e) => e.action.kind === "ability").length, before: p.before }; }, { ...placed, knight });
      if (!(got.hp < 4 && got.phase === "idle" && got.done && got.logs === got.before + 1)) throw new Error(JSON.stringify(got));
    });
    await step("4 pan then select", 5000, async () => {
      await page.evaluate(() => { const c = document.querySelector("#board"); window.__play.followId = null; const s = Math.max(window.__cam.s, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
      const g0 = await shot(page), s0 = g0.s; await fingers(page, [[g0.left + 28, g0.top + g0.rh - 28, -8, 0], [g0.left + 52, g0.top + g0.rh - 28, 8, 0]]);
      const g1 = await shot(page); if (!(g1.s > s0)) throw new Error(`zoom ${s0}->${g1.s}`);
      const pan = await shot(page); await fingers(page, [[pan.left + pan.rw / 2, pan.top + pan.rh / 2, -20, 0]]);
      const g2 = await shot(page), grew = g2.x - g1.x, want = (120 * (g2.w / g2.rw)) / g2.s; if (!(g2.x > 0 && Math.abs(grew - want) <= 0.5)) throw new Error(`pan x ${g1.x}->${g2.x} grew ${grew} want ${want}`);
      const spot = await page.evaluate(() => {
        const play = window.__play, cam = window.__cam, c = document.querySelector("#board"), s = Math.max(1, Math.trunc(cam.s)), artW = Math.floor(c.width / s), artH = Math.floor(c.height / s);
        const open = (col, row) => play.world.grid.inBounds({ c: col, r: row }) && play.world.grid.isOpen({ c: col, r: row }) && !play.world.units.all().some((u) => u.alive && u.at.c === col && u.at.r === row);
        const on = (col, row) => (col + 0.5) * 16 > cam.x + 16 && (col + 0.5) * 16 < cam.x + artW - 16 && (row + 0.5) * 16 > cam.y + 16 && (row + 0.5) * 16 < cam.y + artH - 16;
        let ar = null, vi = null;
        for (let r = 0; r < play.world.grid.rows && ar === null; r += 1) for (let col = 0; col < play.world.grid.cols; col += 1) { if (!on(col, r) || !open(col, r)) continue; const nb = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: col + dc, r: r + dr })).find((p) => on(p.c, p.r) && open(p.c, p.r)); if (nb !== undefined) { ar = { c: col, r }; vi = nb; break; } }
        if (ar === null || vi === null) return null;
        const archer = play.scene().units.find((u) => u.sprite === "starter:hero-staff" && u.alive), villager = play.scene().units.find((u) => u.sprite === "starter:npc-villager" && u.alive);
        if (archer === undefined || villager === undefined || !play.world.units.moveTo(archer.id, ar, "move").ok || !play.world.units.moveTo(villager.id, vi, "move").ok) return null;
        return { archer: archer.id, ac: ar.c, ar: ar.r, vc: vi.c, vr: vi.r };
      });
      if (spot === null) throw new Error("no on-screen pair");
      await tapCell(page, spot.ac, spot.ar); const sel = await page.evaluate(() => window.__play.selected);
      const g3 = await shot(page), at = screenOf(g3, spot.ac, spot.ar), dpr = await page.evaluate(() => devicePixelRatio || 1);
      const oldC = Math.floor((((at.x - g3.left) * dpr) - at.f.padX) / g3.s / 16), oldR = Math.floor((((at.y - g3.top) * dpr) - at.f.padY) / g3.s / 16);
      if (sel !== spot.archer || (oldC === spot.ac && oldR === spot.ar)) throw new Error(JSON.stringify({ sel, spot, oldC, oldR }));
      await page.evaluate((s) => { window.__spot = s; }, spot);
    });
    await step("5 talk", 5000, async () => {
      const live = await page.evaluate((t0) => ({ side: window.__play.side, turns: window.__play.view().turns, t0 }), turns0); if (live.side !== "player" || live.turns !== live.t0) throw new Error(JSON.stringify(live));
      const spot = await page.evaluate(() => window.__spot), talk = await page.locator("#talk").boundingBox(); if (talk === null || spot === null) throw new Error("no talk");
      await page.touchscreen.tap(talk.x + talk.width / 2, talk.y + talk.height / 2); await page.waitForTimeout(40); await tapCell(page, spot.vc, spot.vr);
      const panel = await page.evaluate(() => { const n = document.querySelector("#sheet"), q = n.getBoundingClientRect(), st = getComputedStyle(n); return { show: st.display !== "none", h: q.height, text: n.textContent ?? "", vh: innerHeight }; });
      if (!(panel.show && panel.h > 0 && panel.h <= panel.vh * 0.35 && panel.text.includes("Villager") && panel.text.includes("Hello, traveler."))) throw new Error(JSON.stringify(panel));
      const close = await page.locator("#close").boundingBox(); if (close === null || close.width < 44 || close.height < 44) throw new Error("close");
      await page.touchscreen.tap(close.x + close.width / 2, close.y + close.height / 2); await page.waitForTimeout(40);
      const after = await page.evaluate((s) => { const n = document.querySelector("#sheet"); return { hidden: getComputedStyle(n).display === "none", phase: window.__play.world.phases.battle, knight: window.__play.done.has(s.knight), archer: window.__play.done.has(s.archer) }; }, { ...spot, knight });
      if (!(after.hidden && after.phase === "idle" && after.knight && after.archer)) throw new Error(JSON.stringify(after));
    });
    await step("6 end turn", 10000, async () => {
      const end = await page.locator("#end").boundingBox(); if (end === null) throw new Error("no end");
      await page.evaluate((t0) => {
        const play = window.__play; window.__saw = false; const bot = play.bot.bind(play);
        play.bot = (world, side) => { if (side === "wolves") window.__saw = true; return bot(world, side); };
        window.__wait = () => window.__saw === true && play.side === "player" && play.view().turns === t0 + 1 && play.world.phases.battle === "idle" && play.done.size === 0;
      }, turns0);
      await page.touchscreen.tap(end.x + end.width / 2, end.y + end.height / 2); await until(page, 9000);
      await page.evaluate((id) => { const u = window.__play.world.units.get(id), c = document.querySelector("#board"), cam = window.__cam, s = Math.max(1, Math.trunc(cam.s)); window.__play.followId = null; cam.follow = null; cam.x = Math.max(0, (u.at.c + 0.5) * 16 - Math.floor(c.width / s) / 2); cam.y = Math.max(0, (u.at.r + 0.5) * 16 - Math.floor(c.height / s) / 2); }, knight);
      const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r);
      const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`reselect ${sel}`);
    });
    await step("7 buttons", 5000, async () => {
      const hud = await page.evaluate(() => [...document.querySelectorAll("button")].filter((b) => { const s = getComputedStyle(b), q = b.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0; }).map((b) => { const q = b.getBoundingClientRect(); return { id: b.id, w: q.width, h: q.height }; }));
      const small = hud.filter((b) => b.w < 44 || b.h < 44); if (small.length > 0 || !hud.some((b) => b.id === "recentre") || errs.length > 0 || ext.length > 0) throw new Error(JSON.stringify({ small, recentre: hud.some((b) => b.id === "recentre"), errs, ext }));
    });
    await step("8 back to maker", 5000, async () => {
      const live = await page.evaluate((b) => { const n = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return n instanceof Element && n.closest("[data-act=test]") !== null; }, testAt);
      if (live) throw new Error("test still live");
      const back = await page.locator("#back-maker").boundingBox(); if (back === null || back.width < 48 || back.height < 48) throw new Error("no back");
      await page.touchscreen.tap(back.x + back.width / 2, back.y + back.height / 2);
      await page.waitForFunction(() => document.querySelector("[data-act=test]") !== null && !location.search.includes("project="));
      const name = await page.locator("h1").innerText(); if (name !== "My game") throw new Error(name);
    });
    await step("9 empty blocked", 15000, async () => {
      await press(page, "Back"); await press(page, "New project");
      const empty = page.getByRole("button", { name: "Empty", exact: true }); await empty.waitFor({ timeout: 15000 }); const box = await empty.boundingBox(); if (box === null) throw new Error("empty");
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(80);
      await press(page, "Continue"); await press(page, "Create"); await press(page, "Test");
      const got = await page.evaluate(() => ({ app: getComputedStyle(document.querySelector("#app")).display, board: document.querySelector("#board") !== null, text: document.querySelector(".sheet")?.textContent ?? "", test: document.querySelector("[data-act=test]") !== null }));
      if (got.app === "none" || got.board || !got.text.includes("Place a unit on this stage to test it") || !got.test) throw new Error(JSON.stringify(got));
    });
    await ctx.close();
  };
  await run(390); await run(360);
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
console.log(bad === 0 ? "TOUCH SMOKE PASS" : `TOUCH SMOKE FAIL (${bad})`);
process.exit(bad === 0 ? 0 : 1);
```

### `handoff/steps/tests/s4a-stage-paint/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s4a-stage-paint/smoke.mjs b/handoff/steps/tests/s4a-stage-paint/smoke.mjs
index 78d1e03..b089d6d 100644
--- a/handoff/steps/tests/s4a-stage-paint/smoke.mjs
+++ b/handoff/steps/tests/s4a-stage-paint/smoke.mjs
@@ -25,7 +25,7 @@ try {
     await step("1 grid", async () => { const grid = await page.evaluate(() => { const cells = [...document.querySelectorAll(".cell")]; const box = cells[0].getBoundingClientRect(); return { n: cells.length, w: box.width, h: box.height }; }); if (grid.n !== 54 || grid.w < 48 || grid.h < 48) throw new Error(JSON.stringify(grid)); });
     await step("2 sheet", async () => { await tap(page, "s:cell:0,0"); const got = await page.evaluate(() => { const rows = [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent); const small = [...document.querySelectorAll("button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { rows, small: small.length, title: document.querySelector(".sheet h2")?.textContent, here: document.body.innerText.includes("Tile 0,0") }; }); if (got.title !== "Add here" || !got.here || got.rows.join("|") !== "Floor|Water|Wall block" || got.small !== 0) throw new Error(JSON.stringify(got)); });
     await step("3 paint", async () => { await tap(page, "s:type:water"); await tap(page, "s:cell:1,0"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); const a = await tile(page, 0, 0), b = await tile(page, 1, 0), chip = await page.locator(".chip").count(); if (a !== "water" || b !== "water" || chip !== 0) throw new Error(`${a} ${b} chip ${chip} ${await page.locator(".banner").textContent()}`); });
-    await step("4 occupied", async () => { await tap(page, "s:cell:2,0"); const got = await page.evaluate(() => ({ rows: [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent), note: document.body.innerText.includes("A unit stands here") })); if (got.rows.join("|") !== "Floor" || !got.note) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
+    await step("4 occupied", async () => { await tap(page, "s:cell:2,0"); const got = await page.evaluate(() => ({ rows: [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent), note: (document.querySelector(".sheet h2")?.textContent ?? "").includes(" · ") })); if (got.rows.join("|") !== "Floor" || !got.note) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
     await step("5 undo", async () => { await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "floor"); const a = await tile(page, 0, 0), b = await tile(page, 1, 0); if (a !== "floor" || b !== "floor") throw new Error(`${a} ${b}`); });
     await step("6 test", async () => {
       await tap(page, "s:cell:0,0"); await tap(page, "s:type:water"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); await tap(page, "s:test");
```

Full file as merged:

```js
// Step 4a stage paint smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8799"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s4a-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(120); return box; };
const settle = async (page, fn) => page.waitForFunction(fn, null, { timeout: 8000 });
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); await page.waitForTimeout(80); };
const tile = (page, c, r) => page.locator(`[data-act="s:cell:${c},${r}"]`).getAttribute("data-tile");
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await step("1 grid", async () => { const grid = await page.evaluate(() => { const cells = [...document.querySelectorAll(".cell")]; const box = cells[0].getBoundingClientRect(); return { n: cells.length, w: box.width, h: box.height }; }); if (grid.n !== 54 || grid.w < 48 || grid.h < 48) throw new Error(JSON.stringify(grid)); });
    await step("2 sheet", async () => { await tap(page, "s:cell:0,0"); const got = await page.evaluate(() => { const rows = [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent); const small = [...document.querySelectorAll("button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { rows, small: small.length, title: document.querySelector(".sheet h2")?.textContent, here: document.body.innerText.includes("Tile 0,0") }; }); if (got.title !== "Add here" || !got.here || got.rows.join("|") !== "Floor|Water|Wall block" || got.small !== 0) throw new Error(JSON.stringify(got)); });
    await step("3 paint", async () => { await tap(page, "s:type:water"); await tap(page, "s:cell:1,0"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); const a = await tile(page, 0, 0), b = await tile(page, 1, 0), chip = await page.locator(".chip").count(); if (a !== "water" || b !== "water" || chip !== 0) throw new Error(`${a} ${b} chip ${chip} ${await page.locator(".banner").textContent()}`); });
    await step("4 occupied", async () => { await tap(page, "s:cell:2,0"); const got = await page.evaluate(() => ({ rows: [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent), note: (document.querySelector(".sheet h2")?.textContent ?? "").includes(" · ") })); if (got.rows.join("|") !== "Floor" || !got.note) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
    await step("5 undo", async () => { await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "floor"); const a = await tile(page, 0, 0), b = await tile(page, 1, 0); if (a !== "floor" || b !== "floor") throw new Error(`${a} ${b}`); });
    await step("6 test", async () => {
      await tap(page, "s:cell:0,0"); await tap(page, "s:type:water"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); await tap(page, "s:test");
      await page.waitForFunction(() => location.search.includes("stage=") && window.__play !== undefined, null, { timeout: 15000 });
      await page.evaluate(() => window.__hud.hideBanner());
      const live = await page.evaluate(() => { const units = window.__play.world.units.all(); const knight = units.find((u) => String(u.unitId).endsWith("000001")); return { water: window.__play.world.grid.tileTypeAt({ c: 0, r: 0 }).id, knight: knight !== undefined && knight.at.c === 0 && knight.at.r === 8, stage: new URLSearchParams(location.search).get("stage") }; });
      if (live.water !== "water" || !live.knight || live.stage !== "stage_01JDAS00000000000000000001") throw new Error(JSON.stringify(live));
      await press(page, "Back to maker"); const back = await page.evaluate(() => ({ name: document.querySelector("h1")?.textContent, cells: document.querySelectorAll(".cell").length })); if (!String(back.name).includes("Demo stage") || back.cells !== 54) throw new Error(JSON.stringify(back));
    });
    await step("7 start new", async () => {
      await tap(page, "s:fresh"); await tap(page, "s:close"); if (await tile(page, 0, 0) !== "water") throw new Error("cancel painted");
      await tap(page, "s:fresh"); await tap(page, "s:fresh-go"); await settle(page, () => [...document.querySelectorAll(".cell")].every((b) => b.getAttribute("data-tile") === "floor")); const all = await page.evaluate(() => [...document.querySelectorAll(".cell")].every((b) => b.getAttribute("data-tile") === "floor")); if (!all) throw new Error("not floor");
      await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "water"); if (await tile(page, 0, 0) !== "water") throw new Error("undo lost water");
    });
    await step("8 reload", async () => { await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game"); await press(page, "Demo stage"); const a = await tile(page, 0, 0); if (a !== "water") throw new Error(String(a)); });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```
