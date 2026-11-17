# Hand-back step-p1-6-play-page-1 r2
Step file: handoff/steps/step-p1-6-play-page-1.md (sha256 5f52cc93361edb674a1fd31163ad7bf46557fe339ad2980a9b66cdccb2220a19)
Base commit: bbce4c7543635581d508067b3de0611750b9773c     Head commit: e3f786196a807e37fb684909a469048c3a7e9141     Tree: 9f8af7de0866673d2857b3931cad1572c4aa866c     Branch: step/step-p1-6-play-page-1-r2-chatA     PR: not opened
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/rules/battle/battle.ts
M	src/rules/battle/win.ts
M	src/sim/player.ts
M	src/sim/types.ts
M	tests/rules/battle-p14.test.ts
A	tests/rules/battle-p16-heavy.test.ts
M	tests/rules/battle-qa-p14.test.ts
M	tests/sim/bot.test.ts
A	tests/tools/play-stage.test.ts
A	tools/play-stage/board.ts
A	tools/play-stage/build.ts
A	tools/play-stage/index.html
A	tools/play-stage/load.ts
A	tools/play-stage/page.ts

## Green
npm test: 981/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm run green: exit 0. npm test: 981 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 56307.249357. deps 146 modules / 462 deps. check:state OK (src). check:law OK (src).

## Smoke
PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core (playwright-core@1.59.1) CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome (Chrome for Testing 159.0.8154.6) node handoff/steps/tests/step-p1-6-play-page-1/smoke.mjs . 8792 /tmp/p1-6-smoke.png
ok   no sideways scroll at 390: scrollWidth 390
ok   touch targets >= 44x44 at 390: 0 buttons, small []
ok   select knight at 390: {"ok":true,"id":"knight#1","start":{"c":0,"r":8},"reach":1,"overlays":1,"phase":"unitSelected"}
ok   two-tap walk at 390: {"ok":true,"preview":true,"stayed":true,"moving":"moving","phase":"idle","dest":{"c":0,"r":7},"end":{"c":0,"r":7},"walk":null}
ok   one rAF callback per frame at 390: 48 frames, 0 with >1
ok   page errors at 390: none
ok   no sideways scroll at 360: scrollWidth 360
ok   touch targets >= 44x44 at 360: 0 buttons, small []
ok   select knight at 360: {"ok":true,"id":"knight#1","start":{"c":0,"r":8},"reach":1,"overlays":1,"phase":"unitSelected"}
ok   two-tap walk at 360: {"ok":true,"preview":true,"stayed":true,"moving":"moving","phase":"idle","dest":{"c":0,"r":7},"end":{"c":0,"r":7},"walk":null}
ok   one rAF callback per frame at 360: 48 frames, 0 with >1
ok   page errors at 360: none
SMOKE PASS

## Shipped tests (sha256, byte-identical to the kit)
63a3796ab1db746fe065208eefde93affe4bfee37c39e8a5d686bcd511b6d5dd  tests/tools/play-stage.test.ts
ace769c28c39df234382cfac8f6b2ae051d432564f64eae3bdb29cd3633329e7  tests/rules/battle-p16-heavy.test.ts
4ad35b1f058cba5761d4c3a357b91087104adfd2349a80b34e37153b7767ca8a  tests/rules/battle-p14.test.ts
3b9c2ea6dc2eb59dfcf20777a053fd934f02f8e9d7b0c7ccc625b6144541c264  tests/rules/battle-qa-p14.test.ts
9e6d388644a38b75b67b7889b6051cce32c70377fd50117c92732a006cbc490a  tests/sim/bot.test.ts

## Helpers & self-review
- Helper Heavy review (H1–H6 against battle.ts, win.ts, player.ts, types.ts and the four shipped battle/bot tests): no must-fix. allyTarget stays before noShotRow, noShotRow stays before reach, HIT_REFUSED_REASONS stays the six D7 reasons, whole() rejects NaN and non-integers, damage 0 does not kill, a mid-line body is not a block, empty-tile CONFIRM_TARGET is noTarget before feedIntent, and pending===null is still noAction. Those four files are 15 changed lines.
- Helper play-stage review (index.html, load.ts, board.ts, page.ts, build.ts against the step, play-stage.test.ts, and smoke.mjs): no must-fix. One rAF, moveMs default 200, recipeOf uses Object.hasOwn, docsToInput keeps the caller talk, reach is the step-pattern default 1, the second tap feeds and writes the offset, build() rewrites the script to page.js and does not call git, board.ts and load.ts typecheck without DOM. Line counts: index.html 6, load.ts 35, board.ts 109, page.ts 32, build.ts 41.
- Self-review: Acceptance holds. npm ci && npm run green exits 0 with 981/0 (base 973 + 8). Typecheck, lint, deps, check:state and check:law each exit 0. P1-5 and E7 are on the base (bbce4c7); the shipped imports match, so the step was not stopped. Kit smoke at 390×844 and 360 wide is SMOKE PASS (lines above). Shipped tests are byte-identical to the kit. Caps: battle.ts 11/28, win.ts 1/2, player.ts 1/8, types.ts 2/3, battle-p16-heavy.test.ts 59/59, battle-p14.test.ts 2/2, battle-qa-p14.test.ts 11/11, bot.test.ts 2/2, play-stage.test.ts 78/78, index.html 6/8, load.ts 35/85, board.ts 109/165, page.ts 32/45, build.ts 41/48. Total 390 ≤ 500 (377 insertions, 13 deletions). No painter-proto, ui-shell, src/core, catalogue, or migration edits. No btf-adapters import from play-stage. The bot is constructed and not run. Phases move only through xGo. A missing line-shot row is noShotRow, not a silent 3/2.

## Decisions & deviations
- Base is bbce4c7543635581d508067b3de0611750b9773c (P1-5 and E7 merged, 973 tests). Floor used is 973 + 8 = 981. The run is 981/0.
- 390 changed lines in Base..e3f7861. Size reason: P1-6 r2 folds six Heavy-review fixes (and their plants) into the play-page kit so they land before the P1-6 go-line without an extra build round.
- The bundled demo is the 6×9 stage-fixed layout plus a neutral villager. starter:hero-cleric and starter:prop-crate are kept. Talk stays host-owned (talk-villager). After a walk this step auto-WAITs back to idle. Reach is orthogonal-1 (1), not a special 2.
- Chrome on this machine is Chrome for Testing under /opt/pw-browsers, not /usr/bin/google-chrome. The kit smoke ran against that binary with playwright-core@1.59.1.

## Next step (optional proposal)
- P1-7 can set autoWait false, stop at actMenu, run the bot on End turn, and add the line-shot player door.
