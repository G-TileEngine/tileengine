# Hand-back step-p1-7-play-page-2 r1
Step file: handoff/steps/step-p1-7-play-page-2.md (sha256 6a1b739c00a30ccdc1ffd64b2631281deb0977efde3a7498fd5adbabf0d00e35)
Base commit: 1f779185b1f9b4d6cb33587820d187f948ef5b14     Head commit: dbbf29a85fb999c5ba9f27a0b4b1804a9c0e644e     Tree: 0fe7c65becf25fded7a9b8ebe81e7730ca4e0cdc     Branch: step/step-p1-7-play-page-2-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/sim/player.ts
M	src/sim/types.ts
A	tests/tools/play-stage-p17.test.ts
M	tools/play-stage/board.ts
A	tools/play-stage/camera-touch.ts
A	tools/play-stage/hud.ts
M	tools/play-stage/load.ts
A	tools/play-stage/match.ts
M	tools/play-stage/page.ts

## Green
npm test: 998/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm run green: exit 0 on the head tree. npm test: 998 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 99801.812683. deps 148 modules / 470 deps. check:state OK (src). check:law OK (src).

## Smoke
PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core (playwright-core@1.59.1) CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome node handoff/steps/tests/step-p1-7-play-page-2/smoke.mjs . 8793 /tmp/p1-7-smoke.png
ok   no sideways scroll at 390: scrollWidth 390
ok   touch targets >= 44x44 at 390: {"shown":[{"t":"Menu","w":48,"h":48,"show":true,"id":"menu"},{"t":"YOUR TURN","w":390,"h":96,"show":true,"id":"banner"},{"t":"End turn","w":62,"h":48,"show":true,"id":"end"}],"small":[],"end":true,"menu":true}
ok   cell CSS >= 44 after init at 390: {"s":12,"dpr":3,"css":64}
ok   pan + walk stays actMenu then Wait → idle at 390: {"ok":true,"panned":true,"moving":"moving","phase":"actMenu","waitOn":true,"afterWait":"idle","dest":{"c":0,"r":7},"end":{"c":0,"r":7},"start":{"c":0,"r":8}}
ok   wipe + End turn is a win at 390: {"won":{"outcome":"win","text":""},"painted":{"outcome":"win","text":"Victory","veil":true}}
ok   one rAF callback per frame at 390: 48 frames, 0 with >1
ok   page errors at 390: none
ok   no sideways scroll at 360: scrollWidth 360
ok   touch targets >= 44x44 at 360: {"shown":[{"t":"Menu","w":48,"h":48,"show":true,"id":"menu"},{"t":"YOUR TURN","w":360,"h":96,"show":true,"id":"banner"},{"t":"End turn","w":62,"h":48,"show":true,"id":"end"}],"small":[],"end":true,"menu":true}
ok   cell CSS >= 44 after init at 360: {"s":11,"dpr":3,"css":58.666666666666664}
ok   pan + walk stays actMenu then Wait → idle at 360: {"ok":true,"panned":true,"moving":"moving","phase":"actMenu","waitOn":true,"afterWait":"idle","dest":{"c":0,"r":7},"end":{"c":0,"r":7},"start":{"c":0,"r":8}}
ok   wipe + End turn is a win at 360: {"won":{"outcome":"win","text":""},"painted":{"outcome":"win","text":"Victory","veil":true}}
ok   one rAF callback per frame at 360: 48 frames, 0 with >1
ok   page errors at 360: none
SMOKE PASS

## Shipped tests (sha256, byte-identical to the kit)
e7d95afd556569c28d9ffdbbe66d114a49221ac98d6f0ccdb0620a0508b899df  tests/tools/play-stage-p17.test.ts

## Helpers & self-review
- Helper spell-door review (412068a5-266b-4801-bb8b-9674f11049c4): reviewed src/sim/types.ts and src/sim/player.ts against the spell door and the empty-tile refuse. No must-fix. ChooseAction.actionId adds "spell". PlayerOptions.spellOf is optional. pending and known include "spell". CONFIRM_TARGET attaches opts.spellOf?.(selected) only when pending is "spell", and only as an ability effect when the ref is non-empty. rejectOf still returns "noTarget" via occupantAt before feed and was not rewritten. Diffs are types.ts 4/8 and player.ts 6/16.
- Helper camera review (213f731b-bceb-4103-8e98-6f49c55172ce): reviewed camera-touch.ts against the 44 CSS floor, zoomAt, seatCam and the shipped camera tests. No must-fix. floorS is ceil(MIN_CELL_CSS * dpr / TILE). seatCam is max(box.s, floorS). zoomAt sMax is max(floorS, ceil(6 * dpr)), not scaleRange's 6, so the fitted s=12 @3x identity pinch stays at 12. A missing dpr defaults to 1, so zoomAt from s=4 lands above 4 and at most 6. Nit, not changed: tickCam feeds each call's dt to easeCamera as elapsed against 180 ms, so one call does not finish a 180 ms glide.
- Helper match/board review (51695ad8-b287-4fe5-9602-bfcd1e5ddce8): reviewed createMatch, createPlay autoWait, aims, the bot call and wipe. Must-fix: a basic or spell confirm left phases.battle at "resolving", so SELECT_UNIT was illegal and endTurn's END_TURN was a no-op on the phase (the host side variable still flipped). Fixed in tools/play-stage/match.ts. After an ability, settle() walks RESOLVE_DONE, then CHECK_END when wipeRule reports a winner or a loss, otherwise CHECK_NONE next "unitDone" and UNIT_DONE next "idle". Talk still assigns "actMenu" and does not take UNIT_DONE. Repro after the fix: spell and basic land in idle, SelectUnit accepts, endTurn from that idle runs the wolves and returns to player idle; a second line-shot that drops the last wolf to 0 sets outcome "win" and phase "play.result". The helper's other checks held: autoWait defaults true, createMatch passes false, wait is WAIT then UNIT_DONE, endTurn from actMenu waits first, aims map BattleTarget.id to unit.at, SIDES is ["player","wolves"], restart is a new match, the bot source is botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn }), DEFAULT_SPELL_REACH is named, and spell, talk and stats use Object.hasOwn.
- Self-review: Acceptance done. npm ci exit 0 and npm run green exit 0 with 998/0 (base 992 + 6); none cancelled, skipped or todo. typecheck, lint, deps, check:state and check:law each exit 0. Base 1f779185b1f9b4d6cb33587820d187f948ef5b14 is the P1-6h QA commit, so E7p and P1-6h are on it and the step was not stopped. Each file is inside its cap (types.ts 4/8, player.ts 6/16, board.ts 43/90, load.ts 2/8, camera-touch.ts 24/42, hud.ts 35/68, match.ts 117/140, page.ts 67/110, play-stage-p17.test.ts 86/86). Total 351 insertions + 33 deletions = 384, under the hard cap 500 and inside 150–400. The shipped test is byte-identical to handoff/steps/tests/step-p1-7-play-page-2/tests/tools/play-stage-p17.test.ts (cmp, sha256 above). P1-6h play-stage.test.ts stayed green. Kit smoke is SMOKE PASS at 390×844 and 360 wide (lines above). painter-proto/, ui-shell/, src/core, src/types/core-types.ts, src/rules/behaviours/catalogue.ts and src/sim/migrations are absent from the diff. hud.ts is not imported from tests/. No new BTF. QA checklist: G1 done (shipped test verbatim; the 6 new tests ran inside the 998; no .only, skip or todo added). G2 done (tsc exit 0; no ts-ignore, ts-expect-error or any added). G3 done (check:state OK on src; the only direct battle assign is the talk host write in tools/play-stage/match.ts, which the step requires because resolving has no edge to actMenu; ability uses xGo through go()). G4 done (the step quotes no interface block; spellOf, ChooseAction "spell", DEFAULT_SPELL_REACH, floorS and seatCam match what the shipped tests import). G5 done (do-not-touch paths absent). G6 done (only the nine files in the step table). G7 done: 384 is inside 150–400, every file is at or under its stated cap, the hard cap 500 holds, and lines were not padded. The kit's over-400 size reason does not apply to this diff. G8 done (check:law OK; no new clock, no new dependency). G9 done (decisions below). G10 done (each Acceptance line above).

## Decisions & deviations
- Base is 1f779185b1f9b4d6cb33587820d187f948ef5b14 (E7p and P1-6h merged, 992 tests). Floor used is 992 + 6 = 998. The run is 998/0. Changed lines are 384 (351 insertions, 33 deletions), inside 150–400 and under the hard cap of 500. The kit proto is 500 and wrote an over-400 reason; this diff does not cross 400, so that reason is not claimed here. No file was padded.
- File counts (insertions + deletions) against the step caps: types.ts 4/8, player.ts 6/16, board.ts 43/90, load.ts 2/8, camera-touch.ts 24/42, hud.ts 35/68, match.ts 117/140, page.ts 67/110, play-stage-p17.test.ts 86/86. No extra file. No new dependency.
- MIN_CELL_CSS stays 44. TILE stays 16. floorS(dpr) is ceil(44 * dpr / TILE), and a missing or non-positive dpr is treated as 1. seatCam sets cam.s to max(box.s, floorS). zoomAt snaps between floorS and max(floorS, ceil(6 * dpr)), then clampCamera. That is why an identity pinch on the fitted s=12 @3x camera stays at 12, and zoomAt(cam, 8) with the default dpr 1 lands above 4 and at most 6. The canvas band is clientHeight - 176 (the step's 44 px strip plus 132 px HUD) even though the drawn top strip is 48 px so the 48 px menu fits.
- DEFAULT_SPELL_REACH is 3, named in match.ts, used only when an ability row omits reach. It is not a silent ?? 3 in the engine. The bot call is exactly botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn }) where budget is installOne(ACTION_BUDGET, {}).out. SIDES is ["player", "wolves"]. Aim cells are BattleTarget.id mapped through units.get. Aim colours are #e04848 and #f08a30.
- After talk, the host writes phases.battle to "actMenu" (no xGo edge from resolving, and interact must not take UNIT_DONE). After a basic or spell confirm, settle() uses xGo: RESOLVE_DONE, then CHECK_END when wipeRule returns an outcome, otherwise CHECK_NONE next "unitDone" and UNIT_DONE next "idle". END_TURN is legal from idle and unitSelected only, so leaving the phase at resolving made End turn a phase no-op. The player is not capped at actionsPerTurn; only the seated bot is.
- tickCam eases with the dt it is given against 180 ms (page.ts passes 16 each frame). follow() records the id immediately; the glide is a per-frame step, not one 180 ms shot. The banner hold is 1260 ms, tap hides it, no fade. Attack, Spell, Talk and Wait use display none when hidden so the 44 px smoke check ignores them.
- Restart and Back call location.reload(). createDriver captures one clock, so the page does not swap in match.restart() in place. match.restart() is still a new createMatch of the same docs, which is what the shipped test calls. Quit is the same rebuild. There is no RETRY event and no stage list.
- Smoke used CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome and PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core (playwright-core@1.59.1). /usr/bin/google-chrome is not on this machine. smoke.mjs was not edited. No runtime cache was added; aims, the bot queue and the walk are replaced, not appended across frames.

## Next step (optional proposal)
- P1-8 can hook the line-shot cast into the match FX path. A player-side actionsPerTurn cap, and a Restart that rebuilds the driver without a full reload, can wait for that pass.
