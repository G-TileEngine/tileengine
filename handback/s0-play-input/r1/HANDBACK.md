# Hand-back s0-play-input r1
Step file: docs/maker/steps/step-00-play-input.md (sha256 2c62a34212cbdf7c98d9db0d70cefb75f8a7b6aaa5b93928e8883d059fc7f262)
Base commit: 1b834c3162c33e698a6c389a286c63fc8dc994f4     Head commit: 6a5897ab0dda7dea64fef9269876917c07fd84a7     Tree: 9e8f47d812a68d70123a7a8b4df111c0b61aa737     Branch: step/step-s0-play-input-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	handoff/steps/tests/s0-play-input/touch-smoke.mjs
A	tests/tools/touch-play.test.ts
M	tools/play-stage/board.ts
M	tools/play-stage/hud.ts
M	tools/play-stage/match.ts
M	tools/play-stage/page.ts
A	tools/play-stage/touch.ts

## Green
npm test: 1023/0/0/0    typecheck: exit 0    lint: exit 1    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm test: 1023 pass, 0 fail, 0 cancelled, 0 skipped, 0 todo. duration_ms 101397.120197. Floor 1014 + 9. typecheck exit 0. deps exit 0 (148 modules, 470 dependencies). check:state OK (src). check:law OK (src). npm run lint exit 1 and therefore npm run green exit 1. The 15 eslint errors are only in ui-shell/mock-effects-v3/js/fx-render.js and fx-ui.js, added on this base by 15f73fb. Those files are on the do-not-touch list and are not in this diff. tools/play-stage and src are byte-identical between the step paste's base 501057027cc27321b631c40ed3ef7d5552ac792a and 1b834c3, so the lint failure is the base, not this step. eslint was not loosened.

## Smoke
PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core (playwright-core@1.64.0) CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
Viewport 390×844 and 360×844, deviceScaleFactor 3, isMobile, hasTouch. Node printed ExperimentalWarning: stripTypeScriptTypes while buildWeb stripped the dev www. That is stderr from the build, not a check. The run exited 0.
ok   1 select @390: ok
ok   2 walk @390: ok
ok   3 attack @390: ok
ok   4 pan then select @390: ok
ok   5 talk @390: ok
ok   6 end turn @390: ok
ok   7 buttons @390: ok
ok   1 select @360: ok
ok   2 walk @360: ok
ok   3 attack @360: ok
ok   4 pan then select @360: ok
ok   5 talk @360: ok
ok   6 end turn @360: ok
ok   7 buttons @360: ok
TOUCH SMOKE PASS

## Shipped tests (sha256)
The step does not pin a test-file hash. The builder wrote tests/tools/touch-play.test.ts. The nine titles match the step. sha256 of the file as committed:
fb892de92c6b9214cb1e3c0c2fb5674043ccab638784547b7ffed432ffc6e4b2  tests/tools/touch-play.test.ts

## Helpers & self-review
- Helper match-router review (53fe5f66-8e0a-4572-b2a9-00f8b4091648): reviewed match.ts feed, done set, choose, endTurn, closeTalk, recentreTarget and the board.ts feed wiring against R1–R6 and X1, X2, X6–X10, plus the legal edges in the tactics tables and whether each of the nine tests can fail if its plant is removed. No must-fix. One tap commits through api.intend twice, not back through feed. Off-aim targeting cancels and keeps the selection. Implicit Wait only when the entry was actMenu. constructor and __proto__ do not spend or throw. choose returns noTarget before ChooseAction. endTurn walks the legal edges then wipes. The side IIFE reads the live binding after finish(). The interact actMenu assign was already on the base. match.ts 65 changed lines (cap 85), board.ts 4 (cap 8).
- Helper touch/page/hud review (5ca4ccc6-4612-449a-bf13-3ab09c5517a4): reviewed touch.ts, the page.ts and hud.ts diffs, and zoomAt/clamp against X3–X5, X10, R5, R6 and the quoted createTouch signature. No must-fix. No dpr option, no DOM, no DEV in touch.ts. Hit, pan and pinch match the quote. Drag is hypot >= 10 CSS px and sends cancel. cancel() resets only a pointer id that is still down. Timestamps are monotonic. page.ts is 35 changed lines, hud.ts 11, touch.ts 63 lines. Hold stays holdMs 500 on the existing mapper. Recentre still uses band() (clientWidth times devicePixelRatio), same as seat, and that is acceptable because page.ts is at its cap and the hit box uses the backing store.
- Helper smoke review (522781e5-b2e5-4d47-a529-dc7e14ad28db): reviewed touch-smoke.mjs against the browser gate. One must-fix: step 6's wait accepted the end state only, so a turn that never visited wolves could still print ok. Fixed by wrapping play.bot before the tap and requiring that it was called with side wolves, then side player, turns + 1, idle, done size 0. Re-ran both widths. TOUCH SMOKE PASS. The cam.s fit and the step-6 knight frame are recorded as deviations, not product edits. 107 lines, cap 130.
- Self-review: Acceptance. npm ci exit 0 and npm test 1023/0/0/0 (floor 1023). npm run green does not exit 0: lint exit 1 on the base ui-shell mock, which this step must not edit (see Green and Decisions). typecheck exit 0. Touch smoke prints every ok line at 390 and at 360 and ends TOUCH SMOKE PASS. Only the seven listed files change. Changed lines outside the smoke: board 4/8, hud 11/25, match 65/85, page 35/35, touch 63/75, touch-play.test.ts 78/100, sum 256, under 400. touch-smoke.mjs is 107, under its own 130. src diff is empty, so the rules tables and gestures.ts are byte-identical to the base. Release build of tools/play-stage/build.ts with dev false completed (103 files) and no DEV token remains in the www. Unit ids go through world.units.get and the done Set only. This file quotes the step sha256 in full and names the 10 CSS px drag, the 500 ms hold, the done-set lifetime and the R4 order. QA checklist: G1 done for the suite (1023/0, no skip, only or todo; the nine titles ran). The step has no verbatim shipped-test blob to hash-compare. G2 done (tsc exit 0; no ts-ignore, ts-expect-error or any in the diff). G3 done (check:state OK; no src change). G4 done (TouchEv, TouchBox and createTouch match the quote; feed, closeTalk, recentreTarget, done and noTarget are on the match api). G5 done (do-not-touch paths absent, including ui-shell and camera-touch.ts). G6 done (only the seven files). G7 done (256 is inside 150–400; smoke counted outside at 107; no file over its cap). G8 done (check:law OK; release www has no DEV; no new dependency or clock). G9 done (decisions below match the diff). G10 done except the combined green exit, which fails on the base lint and is not fixable inside this file list.

## Decisions & deviations
- Diff base is 1b834c3162c33e698a6c389a286c63fc8dc994f4, the origin/main this chat checked out. The step paste still names 501057027cc27321b631c40ed3ef7d5552ac792a. That commit is an ancestor, and tools/play-stage plus src do not differ between them. The branch is step/step-s0-play-input-r1-chatA, as this chat required. The paste's branch name step/s0-play-input-r1-chatA was not used. No extra file. No new dependency.
- Changed lines outside touch-smoke.mjs are 256 (board 3+1, hud 6+5, match 59+6, page 5+30, touch.ts 63, touch-play.test.ts 78). Caps 8, 25, 85, 35, 75 and 100. The smoke is 107 insertions, cap 130, outside the 400. The stat above includes it (321 insertions, 42 deletions) because the hand-back stat command does. Nothing was padded. The pointer map holds only live contacts, so it does not grow with frames.
- Drag starts at 10 CSS px or more (hypot of the client delta >= 10), which is MS-00's pan threshold. Under 10 stays a tap. The hold is the mapper's existing holdMs 500 in board.ts. touch.ts does not set another hold. The done set is a Set of unit ids in match.ts, and finish() clears it only when the side becomes player again.
- End Turn from targeting sends Cancel, then UNDO_MOVE only if choose() was armed from unitSelected, then spend() from actMenu or Cancel from unitSelected, then wipe() (aims empty, talk null, focus(null), followId null), then finish() and the wolf pump. An off-aim tap in targeting uses the same Cancel and UNDO_MOVE but does not focus(null), so the selection stays (R1, back to Selected). Implicit Wait runs only when that entry was actMenu. A tap on a done, foreign or dead unit is ignored.
- createTouch's options are exactly {match, cam, box}. zoomAt's dpr argument is the backing-store kx, so on a phone where the canvas is device pixels it matches ceil(6·dpr). Timestamps are clamped up to the last sent ms so a backwards timeStamp cannot throw. cancel() resets only when that id is still in the pointer map, so lostpointercapture after pointerup does not drop the other finger.
- After `if (side !== "player") return`, TypeScript narrows side to "player" for the rest of endTurn even though finish() assigns it. The wolves check reads `const next = ((): Side => side)()`. That is the same binding. It is not a cast of a phase and not a ts-ignore.
- The hit box uses canvas.width / rect.width, with the 300×150 raw-canvas fallback to clientWidth times devicePixelRatio before the first frame. band() and Recentre still use clientWidth times devicePixelRatio, because those lines were already the seat path and page.ts is at 35 changed lines. On a phone the backing store matches that product. The headless shell here does not: deviceScaleFactor is 3 and the canvas stays 1×, so seatCam would put the knight off the canvas.
- The smoke therefore sets cam.s to floor(min(canvas.width/96, canvas.height/144)) and, before the step-6 reselect, frames the knight. Both writes are camera placement, not input. Step 6 also wraps play.bot and requires a wolves call before it accepts the return to player, because the wolf turn can finish before the next poll. /usr/bin/google-chrome is not on this box. The binary was the Playwright headless shell above, and playwright-core is 1.64.0 rather than the paste's 1.59.1. page.evaluate is given one argument. The release www was built with dev false and contains no DEV token.
- npm run green exits 1 only because eslint reports 15 errors in ui-shell/mock-effects-v3, which 15f73fb added on this base. The step forbids editing ui-shell and forbids loosening eslint. This diff does neither. Tests, typecheck, deps, check:state and check:law pass.

## Next step (optional proposal)
- S0b is the step's own carry: SIDES is still ["player","wolves"], and one wolf can take both actions. The base lint on the Effect Designer v3 mock needs its own notice, because no play-stage step can make npm run green exit 0 while that mock stays on the do-not-touch list.
