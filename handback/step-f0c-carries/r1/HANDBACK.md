# Hand-back step-f0c-carries r1
Step file: docs/maker/steps/step-f0c-carries.md (r2, sha256 6c2e5a6328e163c6021a5165b2c552293d019c8731c1318a0f1a0a878fde56e7, 165 lines). Kit review: docs/qa/step-f0c-kit-review.md (sha256 c0839f656d40299217816505934804ed34e79f2fa231bf338d6d769da256fd2a).
Base commit: 49db9f47f83e54443c188f9a9354381df2f866f6     Code head: 97dab703753457376058474b24348c32971eb39d     Code head tree: 4a212c4d10bbb727bd08d5fd81e82eb392223c4a     Branch: step/step-f0c-carries-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged and was not pushed. The builder does not publish.

## Changed files
`git diff --name-status 49db9f47f83e54443c188f9a9354381df2f866f6..97dab703753457376058474b24348c32971eb39d -- . ':!handback'` is:
```
M	src/editor/project/test-gate.ts
M	src/project/load/budgets.ts
M	src/project/load/index.ts
M	src/project/load/read-project.ts
M	src/types/core-types.ts
A	tests/project/f0c-carries.test.ts
M	tests/smoke.test.ts
M	tools/maker/budgets.ts
M	tools/maker/export.ts
M	tools/maker/test-launch.ts
M	tools/play-stage/load.ts
M	tools/play-stage/project.ts
```
`git diff --shortstat 49db9f47f83e54443c188f9a9354381df2f866f6..97dab703753457376058474b24348c32971eb39d -- . ':!handback/**' ':!package-lock.json'` is `12 files changed, 167 insertions(+), 19 deletions(-)`. 167 + 19 = 186.

Caps (insertions + deletions) against the base, every file inside its Files-table cap: core-types.ts 7+ / 7, smoke.test.ts 1+ 1− / 2, budgets.ts 1+ 4− / 5, index.ts 2+ 2− / 4, read-project.ts 3+ 1− / 4, tools/maker/budgets.ts 2+ 1− / 3, test-gate.ts 21+ 2− / 28 (cap 26+ 2−), test-launch.ts 2+ 2− / 4, export.ts 2+ 2− / 4, play-stage/project.ts 3+ 3− / 6, play-stage/load.ts 2+ 1− / 3, f0c-carries.test.ts 121+ / 121. The guide and the plants script are not in this diff.

## Green
`npm ci` (135 packages) then `npm run green` exited 0 on this code head. Floor 1175 + 5 = 1180. Node's test runner prints `ok`, not `✔`.
```
# tests 1180
# pass 1180
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 180 modules, 512 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101 (TS18047), and maker `home.ts` twice at L92 (TS7053).

## Plants
`handoff/steps/tests/step-f0c-carries/plants-f0c.py` (sha256 39f67d7b00f6f2b27d1d0e76d8bf6afb52c243b8de0acf5e0cb193a834ab730f), run from the repo root on this tree, then restored each file. 13/13 caught: P1 Test drops pool lines, P2 Build game drops them, P3 play keeps its own caps, P4 no reader check, P5 pool lines before hard lines, P6 stage id instead of name, P7 PLAY_LIMITS drift, P8 CN-029 not applied, P9 load.ts widened, P10 both project.ts caps widened, P11 arriveIn skips its stage check, P12 `.concat(more)` dropped, P13 break after the first refused stage.

## Smoke
Every smoke was run alone and unedited. Browser: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. `CHROME` was set. Tracked `handback` files were restored after each smoke. s3 passed on the first run (no flake, no re-run). s11b used port 8840.
- S0 `handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797` — 14 ok, TOUCH SMOKE PASS.
- s3 `handoff/steps/tests/s3-test/touch-smoke.mjs . 8798` — 18 ok, TOUCH SMOKE PASS. Step 9 at 390 passed.
- s4a `handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` — 16 ok, SMOKE PASS.
- s4b `handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` — 16 ok, SMOKE PASS.
- s4c `handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801` — 16 ok, SMOKE PASS.
- s5a `handoff/steps/tests/s5a-units/smoke.mjs . 8802` — 16 ok, SMOKE PASS.
- s5b `handoff/steps/tests/s5b-abilities/smoke.mjs . 8803` — 16 ok, SMOKE PASS.
- s5c `handoff/steps/tests/s5c-add-ability/smoke.mjs . 8804` — 16 ok, SMOKE PASS.
- s6a `handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805` — 18 ok, SMOKE PASS.
- s6b `handoff/steps/tests/s6b-levels/smoke.mjs . 8806` — 16 ok, SMOKE PASS.
- s6c `handoff/steps/tests/s6c-checkpoint/smoke.mjs . 8807` — 18 ok, SMOKE PASS.
- s6d `handoff/steps/tests/s6d-baseline/smoke.mjs . 8808` — 14 ok, SMOKE PASS.
- s7 `handoff/steps/tests/s7-stage-links/smoke.mjs . 8809` — 20 ok, SMOKE PASS.
- s8 `handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1` — 16 ok, SMOKE PASS.
- s9 `handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1` — 12 ok, SMOKE PASS.
- s8c `handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1` — 8 ok, SMOKE PASS.
- s9b `handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1` — 14 ok, SMOKE PASS.
- s9c `handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1` — 6 ok, SMOKE PASS.
- s10b `handoff/steps/tests/s10b-effect-data/smoke.mjs . 8815 r1` — 8 ok, SMOKE PASS.
- s10c `handoff/steps/tests/s10c-effect-editor/smoke.mjs . 8816 r1` — 8 ok, SMOKE PASS.
- s10d `handoff/steps/tests/s10d-builtin-effects/smoke.mjs . 8817 r1` — 8 ok, SMOKE PASS.
- s11a `handoff/steps/tests/s11a-export-mvp/smoke.mjs . 8818 r1` — 6 ok, SMOKE PASS.
- s11a2 `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs . 8822 r1` — 6 ok, SMOKE PASS.
- s11b `handoff/steps/tests/s11b-debug-apk/smoke.mjs . 8840 r1` — 6 ok, SMOKE PASS.
- s11c1 `handoff/steps/tests/s11c1-budgets/smoke.mjs . 8823 scratch` — 6 ok, SMOKE PASS. The scratch folder was deleted.

## Export audit
`/tmp/self-audit.mjs` (not committed). Three builders, commit `"0".repeat(40)`: play-stage `build(out, commit, root, false)` all files; baseline `build(out, commit, root)` all files; maker `build(out, commit, root, false)` only paths that start with `play/` or contain `play-stage`. No file name matching `tools/maker`, `src/editor`, `catalogue.json.js` or `behaviours.json`, and no content matching `tools/maker`, `src/editor`, `tileengine/saves` or `session-save`.
```
play	136 files	hits 0
baseline	150 files	hits 0
maker	150 files	hits 0
AUDIT PASS
```

## No-screen proof
390×844, `deviceScaleFactor` 1, screenshot `scale: "css"`, same script on a detached worktree of the base and on this tree. The maker build was dev, commit `"0".repeat(40)`. The map shot is the demo template's Demo stage grid. The Test shot is the play view after Test, with the play banner hidden the same way on both trees, then 300ms. Both pairs are byte-equal.
- `base-map.png` and `step-map.png`: 390×844, 27718 bytes, sha256 `87747d4df4b8bec7aeb3ba5fe1cab9b335d9556b34934e9508f5b9ae0997e8e9`. BYTE_EQUAL.
- `base-test.png` and `step-test.png`: 390×844, 10510 bytes, sha256 `a6828db87e4fc1bdf844d00ca37033e72ef22446d6c8dee2e80c6aa17e1e2fdc`. BYTE_EQUAL.

## Shipped tests (sha256, unchanged)
```
870970073f2d0f538e57ea10e132fd4d92eeb620355e730ec2af6c7c00e30479  tests/project/f0c-carries.test.ts
```
That is the sha256 in the step file. `src/types/core-types.ts` is `897d51dbb6cd40565bde772bd3167da7a4fb9771f7b8edac201bcb358d2f552f`, byte-equal to `data/staging/cn-budgets/core-types.staged.ts`. The smoke pin says the same sha. `data/staging/cn-budgets/` is unchanged.

## Helpers & self-review
- Helper (diff vs guide): read the step file, the plant anchors, the 12-file diff, Rule 8, the caps, the do-not-touch list, and the poolLines contract. Found CLEAN. No edit.
- Helper (Rule 8 and anchors): read test-gate.ts, the two maker call sites, project.ts L66 and L113–L114, load.ts L1–L30, and read-project.ts L1–L15. Found CLEAN. No edit.
- `/tmp/f0c-shots.mjs` (not committed): built the maker from the base worktree and from this tree and saved the two 390×844 pairs. Both pairs byte-equal.
- `/tmp/self-audit.mjs` (not committed): the export audit. AUDIT PASS, 136 / 150 / 150, 0 hits.
- `/tmp/allsmoke-f0c.sh` (not committed): the 25 smokes solo, `CHROME` set, tracked handback restored after each, scratch shots deleted. All 25 PASS. s3's first run was 18 ok.
- `handoff/steps/tests/step-f0c-carries/plants-f0c.py` (kit copy, not committed): 13/13 caught. Each plant was restored by the script.
- Worktree `/tmp/f0c-base` at 49db9f47 (detached): the base side of the no-screen shots. Not a commit.
- Self-review: Acceptance green 1180/0 done. Tools tsc only the 3 base errors done. Shipped test sha matches done. core-types sha and the smoke pin match, staging untouched done. Budget type declarations only in core-types done. `picks: 0` under tools/play-stage is empty done. Caps held, 186 ≤ 400 done. Rule 8 held (new bodies braced; dense lines only where Files names the edit) done. All 25 smokes PASS, no edits, done. No-screen pairs byte-equal, committed beside this file, done. Export audit 136/150/150 done. QA checklist: G1 done (plants 13/13), G2 done, G3 not touched, G4 quoted interfaces match, G5 do-not-touch held, G6 only the 12 named files, G7 186, G8 no new law surface, G9 this note, G10 the acceptance lines above. No token in the repo, no main push, no tag, no PR.

## Decisions & deviations
- `PLAY_LIMITS` is `{ picks: 0, waveUnits: 0 }`, next to `LIMITS` (`{ picks: 8, waveUnits: 16 }`), both exported. Play (`project.ts` L66 and L113, and `load.ts` `stageLimits`) and the gate read that one pair. The doc comment says play places fixed enemy lists only.
- Gate lines stay the 11c1 hard-row sentences first. Pool lines are appended with `.concat(more)`, in `Object.entries` order of the stored stages.
- The gate is project-wide: any stage the reader accepts and play would refuse blocks Test and Build game. `openProject` and `arriveIn` still refuse only the stage they open. Per stage, an empty pool line is exactly when that stage opens.
- `poolLines` calls `readStage` twice per stage, once with `LIMITS` and once with `PLAY_LIMITS`. There is no cache. Nothing is kept after the call.
- No new reserved words. `src/core` and `src/sim` are untouched. A weighted or waves pool is still not playable.
- The sandbox Node is v22.23.3. `.nvmrc` pins 24. Green passed on this Node. That is not a product change.
- test-gate.ts is 21+ 2−. The trial was 22+ 2−. Nothing was wrapped, split, or joined to move that count. The total is 186.

## Next step
- 11c2 stays on hold behind F6, with QA's 11c1 carries (neutral setup ids, a pool on the neutral side, `"none"` as an effect, the first stage in the summary, roster `required`, the module `let open`, the re-parse timing, meter spacing and tokens). Playing weighted pools and waves waits behind F6. After F6, Test's sheet can gain a "Use a fixed list" button. The 11a2 ready-sheet body is an 11c2 text change, not this step.
