# Hand-back step-f2a2b-land-on-map r1
Step file: docs/maker/steps/step-f2a2b-land-on-map.md (r2, sha256 4ed8d0ea3a044da6906a6b111d85e8bbd5a5b4bbf38c9f794725712c6aa78407, 492 lines)
Base commit: fd87b91301f2b0eb6e890126d155ffa7919ad7bc     Head commit: a22f0f606f03a8158b1996696ce8ab3339ef4ba1     Tree: 15d31343981a7d8571ec0576130270cd2e50080c     Branch: step/step-f2a2b-land-on-map-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	handoff/steps/tests/s10b-effect-data/smoke.mjs
M	handoff/steps/tests/s10c-effect-editor/smoke.mjs
M	handoff/steps/tests/s10d-builtin-effects/smoke.mjs
M	handoff/steps/tests/s11a-export-mvp/smoke.mjs
M	handoff/steps/tests/s11a2-ready-sheet/smoke.mjs
M	handoff/steps/tests/s11b-debug-apk/smoke.mjs
M	handoff/steps/tests/s11c1-budgets/smoke.mjs
M	handoff/steps/tests/s3-test/touch-smoke.mjs
M	handoff/steps/tests/s4a-stage-paint/smoke.mjs
M	handoff/steps/tests/s4b-stage-place/smoke.mjs
M	handoff/steps/tests/s4c-stages-maps/smoke.mjs
M	handoff/steps/tests/s5a-units/smoke.mjs
M	handoff/steps/tests/s5b-abilities/smoke.mjs
M	handoff/steps/tests/s5c-add-ability/smoke.mjs
M	handoff/steps/tests/s6a-win-rules/smoke.mjs
M	handoff/steps/tests/s6b-levels/smoke.mjs
M	handoff/steps/tests/s6c-checkpoint/smoke.mjs
M	handoff/steps/tests/s7-stage-links/smoke.mjs
M	handoff/steps/tests/s8-autosave-links/smoke.mjs
M	handoff/steps/tests/s9-art-backgrounds/smoke.mjs
M	handoff/steps/tests/s9b-art-upload/smoke.mjs
M	tests/editor/project-home.test.ts
M	tests/tools/export-11a.test.ts
M	tests/tools/f1-look-kit.test.ts
A	tests/tools/f2a2-land-on-map.test.ts
M	tests/tools/play-stage-source.test.ts
M	tools/maker/effects.ts
M	tools/maker/home.ts
D	tools/maker/project.ts
M	tools/maker/stage.ts
M	tools/maker/test-launch.ts
M	tools/maker/units.ts

## Green
npm test: 1204/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
Code head: a22f0f606f03a8158b1996696ce8ab3339ef4ba1
Code tree: 15d31343981a7d8571ec0576130270cd2e50080c
Tip: this hand-back commit. A commit cannot store its own sha; the hand-back message quotes the full tip sha. Check: `git rev-parse HEAD^` is the code head above.
`npm ci && npm run green` exited 0 (1204 pass, 0 fail; floor 1203 + 1 = 1204).
tools tsc (`npx tsc --noEmit -p tools/tsconfig.json`): only the 3 base errors, exit 2 from tsc itself:
- tools/effect-designer/page.ts(101,28) TS18047
- tools/maker/home.ts(156,221) TS7053
- tools/maker/home.ts(156,266) TS7053

## Plants
handoff/steps/tests/step-f2a2b-land-on-map/plants-f2a2b.py: 27/27 caught. First run on the uncommitted tree, second run on the code head. Both restored the tree (clean after the second run). Kit `sha256sum -c SHA256SUMS` OK (SHA256SUMS 2e431ece65c3d404ffc79a54a5a02234a3d590c8189f71cb26e4b0f507f7cf8b).

## Smoke
All 25 smokes PASS solo at 390 and 360, first pass, no flake re-run. After each smoke, tracked handback files were restored (`git checkout -- handback` and `git clean -fd -- handback`) so s6c's rewrite of the checkpoint project did not fail later smokes. s11b on 8820 (the port was free). The 21 edited smokes are only the guide's Smoke lines.

| Smoke | Ok lines |
|---|---|
| s0 | 14 |
| s3 | 18 |
| s4a | 16 |
| s4b | 16 |
| s4c | 16 |
| s5a | 16 |
| s5b | 16 |
| s5c | 16 |
| s6a | 18 |
| s6b | 16 |
| s6c | 18 |
| s6d | 14 |
| s7 | 20 |
| s8 | 16 |
| s9 | 12 |
| s8c | 8 |
| s9b | 14 |
| s9c | 6 |
| s10b | 8 |
| s10c | 8 |
| s10d | 8 |
| s11a | 6 |
| s11a2 | 6 |
| s11b | 6 |
| s11c1 | 6 |

## Look
Fresh demo ("My game", one stage) at 390 and 360. Shots: `menu-390.png`, `menu-360.png`, `switch-390.png`, `switch-360.png`.

☰ against f02: h2 is the game's name, grabber, borderless close, and the 8 rows in order (Stages & maps, Units, Effects, Levels & XP, Budgets, Build game, Save, My games). Metas: "1 stage", "7", "0", none, none, none, "Saved", none. Chevrons on the rows the menu draws. No eyebrow. Differences that are the Open points, not extra edits: Budgets reads "Budgets: all good" and Budgets and Build game have no chevron (open point 1); Effects is "0", the effect-row count, not f02's "10 built-in" (open point 9); the stage bar still has its second row (View, Background, Rules, Start new, Test) (open point 7). The demo template has 7 units and 1 stage; the mock's "Demo game" / "2 stages" / "6" is the picture, not this template.

Switcher against f03: h2 "Stages", eyebrow "STAGES" (markup "Stages"), check on the picked "Demo stage", blank slot is not needed (only one stage), ⋯ stage menu, + Add stage, then the Maps section. No "Map · cols×rows" meta on the stage row (open point 3).

## Rule 8 scan
New functions (`menuSheet`, `landOn`, `leaveGame`, `menuAct`, `saveNow`, the `beginTest` menu close, the rooms next block, the reformatted `stage:` handler) put one statement on each line. `menuSet("none")` is alone in the `stage:` handler and in `beginTest`. Allowed one-liners: `if (which === "games") return leaveGame();` and `if (act.startsWith("m:") && state.screen === "stage") return menuAct(act.slice(2));`. `unitCount` and `effectCount` are 7 lines each, braced. The remaining dense lines are the guide's quoted edits of lines that were already dense (`openId`, the travel callback, `buildNow`'s failure line, `saveCurrent` renamed to `saveNow` on the existing act line). No new chained control header.

## Size
`git diff --numstat fd87b91301f2b0eb6e890126d155ffa7919ad7bc -- . ':!handback/**' ':!package-lock.json'` is 261 additions, 136 deletions, 32 files, 397 counted lines. Under the 400 gate. Every file is on its cap.

| File | + | − | Counted | Cap |
|---|---|---|---|---|
| handoff/steps/tests/s10b-effect-data/smoke.mjs | 1 | 1 | 2 | 2 |
| handoff/steps/tests/s10c-effect-editor/smoke.mjs | 9 | 9 | 18 | 18 |
| handoff/steps/tests/s10d-builtin-effects/smoke.mjs | 4 | 4 | 8 | 8 |
| handoff/steps/tests/s11a-export-mvp/smoke.mjs | 1 | 1 | 2 | 2 |
| handoff/steps/tests/s11a2-ready-sheet/smoke.mjs | 1 | 1 | 2 | 2 |
| handoff/steps/tests/s11b-debug-apk/smoke.mjs | 1 | 1 | 2 | 2 |
| handoff/steps/tests/s11c1-budgets/smoke.mjs | 5 | 5 | 10 | 10 |
| handoff/steps/tests/s3-test/touch-smoke.mjs | 6 | 6 | 12 | 12 |
| handoff/steps/tests/s4a-stage-paint/smoke.mjs | 2 | 2 | 4 | 4 |
| handoff/steps/tests/s4b-stage-place/smoke.mjs | 1 | 1 | 2 | 2 |
| handoff/steps/tests/s4c-stages-maps/smoke.mjs | 7 | 7 | 14 | 14 |
| handoff/steps/tests/s5a-units/smoke.mjs | 5 | 5 | 10 | 10 |
| handoff/steps/tests/s5b-abilities/smoke.mjs | 5 | 5 | 10 | 10 |
| handoff/steps/tests/s5c-add-ability/smoke.mjs | 1 | 1 | 2 | 2 |
| handoff/steps/tests/s6a-win-rules/smoke.mjs | 5 | 5 | 10 | 10 |
| handoff/steps/tests/s6b-levels/smoke.mjs | 4 | 4 | 8 | 8 |
| handoff/steps/tests/s6c-checkpoint/smoke.mjs | 6 | 7 | 13 | 13 |
| handoff/steps/tests/s7-stage-links/smoke.mjs | 4 | 4 | 8 | 8 |
| handoff/steps/tests/s8-autosave-links/smoke.mjs | 5 | 5 | 10 | 10 |
| handoff/steps/tests/s9-art-backgrounds/smoke.mjs | 1 | 1 | 2 | 2 |
| handoff/steps/tests/s9b-art-upload/smoke.mjs | 4 | 4 | 8 | 8 |
| tests/editor/project-home.test.ts | 2 | 2 | 4 | 4 |
| tests/tools/export-11a.test.ts | 1 | 1 | 2 | 2 |
| tests/tools/f1-look-kit.test.ts | 5 | 7 | 12 | 12 |
| tests/tools/f2a2-land-on-map.test.ts | 29 | 0 | 29 | 29 |
| tests/tools/play-stage-source.test.ts | 3 | 3 | 6 | 6 |
| tools/maker/effects.ts | 7 | 0 | 7 | 7 |
| tools/maker/home.ts | 127 | 31 | 158 | 158 |
| tools/maker/project.ts | 0 | 11 | 11 | 11 |
| tools/maker/stage.ts | 1 | 1 | 2 | 2 |
| tools/maker/test-launch.ts | 1 | 1 | 2 | 2 |
| tools/maker/units.ts | 7 | 0 | 7 | 7 |
| Total | 261 | 136 | 397 | 397 |

## Shipped tests (sha256, unchanged)
ca0a98d8288f376adb11f20568172d9afa48254e236f5082c559e4bb6c5474ba  tests/tools/f2a2-land-on-map.test.ts

## Helpers & self-review (required)
- Helper 0b7838d5-a68c-4455-87e3-3d8c0da4dd10: reviewed the uncommitted diff against the caps, the kit sha, Rule 8, and the 27 plant strings → OK. 32 files, +261/−136 = 397. `game-menu.ts`, `icons.ts` and `app.css` absent. `project.ts` deleted. Land-on-map test matches the kit hash. Failed travel is `state.banner = got.error`. `unitCount` and `effectCount` are used in `menuSheet`. `menuSet("none")` is on its own line in the `stage:` handler and in `beginTest`. It did not edit.
- Script /tmp/f2a2b-smokes.sh: all 25 smokes solo, restore handback after each. SMOKES_ALL_PASS. Ok counts in § Smoke. s11b on 8820.
- Script /tmp/f2a2b-look.mjs: ☰ and switcher shots at 390 and 360. The first run timed out: `.first()` tapped the stage-bar `m:switch`, which sits under the scrim. The second run taps `[data-sheet="game-menu"] [data-act="m:switch"]` and passed. Shots are in this folder.
- Script /tmp/f2a2b-rule8.py: report-only scan of added lines. Its 9 flags are the quoted dense-line edits plus two allowed `if (…) return` lines the scanner splits on the first `)`. No change from it.
- Kit script handoff/steps/tests/step-f2a2b-land-on-map/plants-f2a2b.py: 27/27 caught, twice (before the code commit and on the code head).
- One-off /tmp/f2a2b-home.patch and /tmp/f2a2b-home.diff: the guide's home.ts fence, applied with `patch -p1` (dry-run first). +127/−31, the cap.
- The smoke-line applicator was an inline python, not a saved file. It ran twice: the first pass stopped because `s8` L38's old string occurs twice; the second pass replaced only the first and wrote `s9` and `s9b`.
- The green run (`npm ci`, `npm test`, typecheck, lint, deps, check:state, check:law, tools tsc) was an inline shell, not a saved file. Logs: /tmp/f2a2b-test-output.txt, /tmp/f2a2b-typecheck-output.txt, /tmp/f2a2b-checks-output.txt, /tmp/f2a2b-tools-tsc.txt, /tmp/f2a2b-npm-ci.txt.
- Self-review: Acceptance done. `npm ci && npm run green` 1204/0. Tools tsc only the 3 base errors, home.ts at L156 twice. Shipped test sha unchanged. Plants 27/27, tree clean. All 25 smokes PASS with the recorded ok counts. Look shots attached; differences are the Open points. Rule 8 scan clean (section above). Counted lines 397, each file on its cap. Nothing outside the Files list. `game-menu.ts`, `icons.ts` and `app.css` not edited. QA checklist: G1 done (shipped sha, plants 27/27); G2 done (root typecheck exit 0; tools tsc still only the 3 base errors); G3 done (src untouched); G4 done (quoted signatures unchanged); G5 done (do-not-touch paths absent from the diff); G6 done (only the 32 Files-list paths plus this handback); G7 done (397, under 400, each cap held); G8 done (lint, deps, check:state, check:law exit 0); G9 done (decisions below); G10 done.

## Decisions & deviations (5–10 lines)
- No deviation from the quoted edits. `home.ts` is the guide diff. The other product files are the quoted replacements, the two 7-line count functions, the `project.ts` delete, and the kit test copied byte for byte.
- Base is fd87b91301f2b0eb6e890126d155ffa7919ad7bc, not the guide's 1a6d16a4. CoS said everything since the F2a2a merge is docs or handoff only, and the trial patch applies. Counted lines are against this base (397).
- `s8` L38's old string `await page.waitForFunction((` occurs twice. Only the first was replaced (the wait that the guide's line number points at, before Continue). The second, after tapping continue, stays. The file is still +5/−5.
- Open point 9 is left as listed. The Effects meta is `effectCount` (0 on a fresh demo), not "10 built-in". `game-menu.ts` was not edited. `state.problems` is still written and has no reader after the travel line; carried, not removed.
- Look shots are a fresh demo named "My game": 1 stage, 7 units, Effects 0, Budgets "Budgets: all good" with no chevron, switcher without a map-size meta on the stage row. Those are the Open points and the demo template, not extra edits.
- Smokes were first pass, no re-run of s3 step 9 or s8c steps 1–3. s11b on 8820. F1 plants P20 and P24 stay dead, as the guide says is expected.
- No new dependency. No last-stage memory. No other eyebrow or header. F2a2a files were not edited.

## Next step (optional proposal)
- F2b can remember the last stage edited. A later touch can change the Effects meta to a phrase such as "10 built-in" without this slice editing `game-menu.ts`.
