# Hand-back step-10a-carries r1
Step file: docs/maker/steps/step-10a-carries.md (r2, sha256 40ef961fab84cc129d2efa01f70f25a53cb857ce160c014ed5e651ce03b0eb7d, 119 lines).
Base commit: 31f4c0c4fb8d551464ae1aba41b8f4917141b42b     Code head: ffe56f93a9f415cf802f2ac734c12459eeae77f8     Code head tree: 3e5521a212a6fc0811fde520cacf0aedd32f22de     Branch: step/step-10a-carries-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged.

## Changed files
```
M	handoff/steps/tests/s4c-stages-maps/smoke.mjs
M	src/editor/effect/save.ts
M	src/rules/levels/levels.ts
A	tests/editor/carries-10a.test.ts
M	tests/editor/effect-e6-qa2.test.ts
M	tests/editor/effect-e6-save.test.ts
M	tests/editor/effect-e7-carries.test.ts
M	tests/tools/autosave-links.test.ts
M	tests/tools/baseline-page.test.ts
M	tools/baseline/index.html
M	tools/baseline/readout.ts
M	tools/effect-designer/page.ts
M	tools/effect-designer/store.ts
M	tools/maker/art.ts
M	tools/maker/home.ts
M	tools/maker/store.ts
M	tools/play-stage/board.ts
M	tools/play-stage/project.ts
```
`git diff --shortstat 31f4c0c4fb8d551464ae1aba41b8f4917141b42b..ffe56f93a9f415cf802f2ac734c12459eeae77f8 -- . ':!handback/**'` is `18 files changed, 82 insertions(+), 25 deletions(-)`. 82 + 25 = 107. Under 400, and under the caps' sum of 128.

Caps (insertions + deletions, trial in brackets): s4c smoke 2/4 [2], save.ts 2+2−/4 [2+2−], page.ts 1+1−/2, effect store.ts 1+1−/2, e6-save 4+4−/10, e6-qa2 1+1−/2, e7-carries 4+4−/10, board.ts 1+1−/2, maker store.ts 1+1−/2, art.ts 5/8 [5], home.ts 2+2−/4, levels.ts 2+2−/4, project.ts 2+1−/4, baseline html+readout together 2+2−/4, the two readout tests together 3+3−/6, carries-10a.test.ts 49/60 [44]. No file is over its cap.

## Green
`npm ci` (135 packages) then `npm run green` on this code head exited 0. Floor 1146. Node's test runner prints `ok`, not `✔`.
```
# tests 1146
# pass 1146
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0. check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L88. `behaviourId` was not moved.

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback`) and untracked shots removed. Browser for every run: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. s6d and S0 still default to `/usr/bin/google-chrome`, which is not installed; those files were not edited. S0 sha `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`. s8 sha `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`.
- S0 `handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797` — 14 ok, TOUCH SMOKE PASS.
- s3 `handoff/steps/tests/s3-test/touch-smoke.mjs . 8798` — 18 ok, TOUCH SMOKE PASS.
- s4a `handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` — 16 ok, SMOKE PASS.
- s4b `handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` — 16 ok, SMOKE PASS.
- s4c `handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801` — 16 ok, SMOKE PASS (8 at 390 and 8 at 360).
- s5a `handoff/steps/tests/s5a-units/smoke.mjs . 8802` — 16 ok, SMOKE PASS.
- s5b `handoff/steps/tests/s5b-abilities/smoke.mjs . 8803` — 16 ok, SMOKE PASS.
- s5c `handoff/steps/tests/s5c-add-ability/smoke.mjs . 8804` — 16 ok, SMOKE PASS.
- s6a `handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805` — 18 ok, SMOKE PASS.
- s6b `handoff/steps/tests/s6b-levels/smoke.mjs . 8806` — 16 ok, SMOKE PASS.
- s6c `handoff/steps/tests/s6c-checkpoint/smoke.mjs . 8807` — 18 ok, SMOKE PASS. The checkpoint fixture was restored before the later smokes that read it.
- s6d `handoff/steps/tests/s6d-baseline/smoke.mjs . 8808` — 14 ok, SMOKE PASS.
- s7 `handoff/steps/tests/s7-stage-links/smoke.mjs . 8809` — 20 ok, SMOKE PASS.
- s8 `handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1` — 16 ok, SMOKE PASS.
- s9 `handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1` — 12 ok, SMOKE PASS.
- s8c `handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1` — 8 ok, SMOKE PASS.
- s9b `handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1` — 14 ok, SMOKE PASS.
- s9c `handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1` — 6 ok, SMOKE PASS.
s4c mutation, then restored before the code commit: the placement line was removed and the second `s:test` kept. Step 5 failed at both widths (`waitForFunction` timeout), SMOKE FAIL. The committed smoke still places the team start.
```
FAIL 5 test @390: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 5 test @360: page.waitForFunction: Timeout 15000ms exceeded.
SMOKE FAIL
```

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run by importing `tools/play-stage/build.ts`, `tools/baseline/build.ts` and `tools/maker/build.ts` (dev false, commit 40 zeros) and was not committed. Files were counted with `readdir` `withFileTypes` and `isFile` only. `grep` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save` and `__play`, and `find` for `catalogue.json.js` / `behaviours.json`:
```
play	133 files	grep empty	find empty
baseline	147 files	grep empty	find empty
maker play-stage directory	133 files	grep empty	find empty
```
The loose path filter (any maker-build path containing `play-stage`, the count the trial's script prints) is 146 files, also grep empty. AUDIT PASS. No new built file. `window.__play` is absent from the release trees.

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. The new test file, as committed:
```
8c75b5211aaf9acf9ec9275152cd5412ba2996824ca9076b49a570c4693fb2e1  tests/editor/carries-10a.test.ts
```
The three effect tests and the two readout tests were re-pinned, as Rule 3 and Rule 9 require. No other test or smoke was edited. s8 and S0 shas are above.

## Helpers & self-review
- Helper 8f913177: asked to review the diff against Rules 1–9, the caps, and the must-not list, and not to edit. It had not returned when this note was written. No change came from it.
- Self-review: Rules 1–9 done. Named tests 1–4 done (effect_ accepted and setup_ refused for a new id, with the exact invalidValue message; an existing setup_ doc saved again under `effects/<setup id>.json` with that id and the owner's effect answer; 5000×10 PNG and GIF stop at 65536 bytes; a fitting PNG and a head-less JPG read whole; a small file reads whole; a throwing write aborts and rethrows and a good write closes; `play:link-constructor` is undefined; a missing shop map returns `openProject`'s error). Done-when: green 1146/0 done; tools tsc only the 3 base errors done; 107 ≤ 400 and every cap kept done; all 18 smokes PASS at the guide counts done; s4c mutation recorded done; export audit empty done. QA G1 the four named tests fail if the id rule, the short read, the abort, or the link/map tidy is reverted. G2 root typecheck exit 0, no new ignore or any. G3 no new phase writes. G4 no quoted interface changed. G5 nothing in src/core, src/sim, data, fixtures, or format docs. G6 only the build-table files. G7 107 and each cap kept. G8 no new rAF, timer, or loop. G9 this note. G10 s4c shows the empty-board sentence, then a placed team start, then play, at 390 and 360. Done.

## Decisions & deviations
- The fresh-id message is `a new effect needs a fresh effect_<ULID> at effects/<id>.json`. Rule 2's quoted words are that clause. Only `setup_` became `effect_`. Test 39 still matches the clause. A well-formed `setup_<ULID>` is now an invalid new id, and the Z-alphabet success case is `effect_7Z…`.
- No effect Duplicate exists, so D22's Duplicate line has no code to change. Saved `setup_` effect docs are not re-id'd, migrated, or written back. Owner ids such as `setup_O` stay. `play-stage-p18.test.ts` was not edited.
- `uploadBytes` reads `file.slice(0, 65536)`, then `readPicture`. It returns that head when the file is no bigger, when the header is over 4096 px a side, or when it is not a picture and `sniffed` does not start with `damaged`. Otherwise it reads the whole file. `addPicture` is unchanged, so nothing is decoded, hashed, or written before its checks.
- The level-start loop still skips a missing `start` (`Array.isArray`). After the badStart guard the row is `LevelStart`: a null `offer` stays null, otherwise `[...offer]`; abilities are `[...abilities]`. The unreachable `continue`, `: null` and `: []` are gone.
- A null grid returns `openProject(files, toId)` before `arrival`. `free` and `inside` no longer test `grid !== null`. The baseline `<title>` and both readout lines drop `06c `. There is no step tag.
- s4c adds two lines and no other smoke was edited. With the placement line removed and the second `s:test` kept, step 5 times out at 390 and 360. The committed smoke still places the unit.
- `/workspace/share/s8/s8-audit.mjs` is not on disk. The check above was reproduced and not committed. Direct counts stay 133 / 147 / 133. The loose maker play-stage filter is 146, grep empty. s6d and S0 need `CHROME` set to the headless shell; those files were not edited.
- The new test file is 49 lines against a cap of 60 (the trial was 44). No line was wrapped, split, or joined to fit a cap. No new dependency, no new code, no new rAF, timer, or loop. `tools/play-stage` still does not import `tools/maker`.

## Next step
- Not this step: roadmap step 10, as 10b (the `effects/` slot, `legacyEffectId` / `badEffectId`, and `effectRef` from data) and 10c (the Effect row). It stays PROPOSED until CoS gives the go. Format docs were not edited. A baseline-08b republish that picks up this title and the 9c markers needs the CEO's own typed OK in QA's chat, naming the commit. The builder does not publish.
