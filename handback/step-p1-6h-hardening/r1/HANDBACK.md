# Hand-back step-p1-6h-hardening r1
Step file: handoff/steps/step-p1-6h-hardening.md (sha256 8108d93c9afd3a2e514542a26bd511389d4c5a7c5f0c46d0dc7409f6896a8a9c)
Base commit: 8e900ea5745fd1e3542a7a09285f6a728881a55d     Head commit: e2a6a85a50273a1c714e5e51e2cfa5560a90740c     Tree: 06be21d8c04efe872d57aeae7e5e3eb69e79343b     Branch: step/step-p1-6h-hardening-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/rules/battle/battle.ts
M	src/rules/turns/bot-ability-priority.ts
M	tests/rules/battle-p16-heavy.test.ts
M	tests/rules/bot-p15.test.ts
A	tests/rules/bot-p16h.test.ts
M	tests/rules/bot-qa-p15.test.ts
M	tests/tools/play-stage.test.ts
M	tools/play-stage/board.ts
M	tools/play-stage/page.ts

## Green
npm test: 992/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm run green: exit 0. npm test: 992 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 104985.409971. deps 148 modules / 470 deps. check:state OK (src). check:law OK (src).

## Smoke
PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core (playwright-core@1.59.1) CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome node handoff/steps/tests/step-p1-6h-hardening/smoke.mjs . 8792 /tmp/p1-6h-smoke.png
ok   no sideways scroll at 390: scrollWidth 390
ok   touch targets >= 44x44 at 390: 0 buttons, small []
ok   select knight at 390: {"ok":true,"id":"knight#1","start":{"c":0,"r":8},"reach":1,"overlays":1,"phase":"unitSelected"}
ok   two-tap walk at 390: {"ok":true,"preview":true,"stayed":true,"moving":"moving","phase":"idle","dest":{"c":0,"r":7},"end":{"c":0,"r":7},"walk":null}
ok   one rAF callback per frame at 390: 45 frames, 0 with >1
ok   page errors at 390: none
ok   no sideways scroll at 360: scrollWidth 360
ok   touch targets >= 44x44 at 360: 0 buttons, small []
ok   select knight at 360: {"ok":true,"id":"knight#1","start":{"c":0,"r":8},"reach":1,"overlays":1,"phase":"unitSelected"}
ok   two-tap walk at 360: {"ok":true,"preview":true,"stayed":true,"moving":"moving","phase":"idle","dest":{"c":0,"r":7},"end":{"c":0,"r":7},"walk":null}
ok   one rAF callback per frame at 360: 48 frames, 0 with >1
ok   page errors at 360: none
SMOKE PASS

## Shipped tests (sha256, byte-identical to the kit)
b3626ab77f99b8694bebaaa4b6376e8ee4a8ba01de3506b095ba628c16a8403b  tests/tools/play-stage.test.ts
72f5b0348a12e5cfbac55d111a06d888dac955f5235a320746fa289b3965caf4  tests/rules/bot-p16h.test.ts
06fc4fed5ac20ab95d4e3756cb56a8d76eeac62b524c33e9a2cc6b23f9c69104  tests/rules/battle-p16-heavy.test.ts
25cd5123a4edb942982b8c4e0c3fbdcfa97032569ef1c4c1ad2e7ee03e31384f  tests/rules/bot-p15.test.ts
4e60d10f1f8d0bcc31cb159baa91599f0e391b387d217c1d79ce10d89aa82b57  tests/rules/bot-qa-p15.test.ts

## Helpers & self-review
- Helper taken() review (73b690a4-fd87-414b-a924-bd5d117822a1): reviewed taken() in src/rules/battle/battle.ts against the null-prototype ruling and tests/rules/battle-p16-heavy.test.ts. No must-fix. stats, reach and abilities are Object.create(null); keys use Object.hasOwn; each ability row is copied as {reach, damage, effectRef} and abilitiesIn is not passed through; whole() already rejects Infinity because Number.isInteger(Infinity) is false; plainCopy skips __proto__/constructor/prototype before the rebuild. Diff is 5 insertions and 5 deletions, 10 lines, under the cap of 20.
- Helper bot review (62009809-dbee-4418-b52a-6f8dc3e7c592): reviewed bot-ability-priority.ts, ACTION_BUDGET, and the board call. No must-fix. DEFAULT_STEP_REACH is 2 and documented as the P1-5 bot cap, not an engine rule. setup and actionsPerTurn are required. The throw matches /setup and actionsPerTurn required/. The source has no "hp: 1, atk: 1" and no "actionsPerTurn ?? 2". The board passes installOne(ACTION_BUDGET, {}).out.actionsPerTurn. Game rules stay in src/rules.
- Helper fit/intend review (be274f7c-c1b9-46ac-974d-a2a03fce078e): reviewed fit(), MIN_CELL_CSS, page.ts and intend(). No must-fix. MIN_CELL_CSS is 44. minS is ceil(44 * dpr / TILE). For a 12×9 map at 360 CSS @3x, fitted is 5 and minS is 9, so s is 9 and the cell is 48 CSS px. Demo 6×9 at 360@3x still fits (fitted 11). page.ts passes devicePixelRatio || 1. intend() was not edited: a foreign SelectUnit rejects notOwn and does not select; a walk beyond reach rejects notReachable, does not walk, and clears pending; a second tap on a non-reach tile clears the preview and does not walk.
- Self-review: Acceptance done. npm ci && npm run green exits 0 with 992/0 (base 988 + 4); none cancelled, skipped or todo. typecheck, lint, deps, check:state and check:law each exit 0. E7p is on the base 8e900ea5745fd1e3542a7a09285f6a728881a55d, so the step was not stopped. Each file is inside its cap (battle.ts 10/20, bot-ability-priority.ts 16/28, battle-p16-heavy.test.ts 12/16, bot-p15.test.ts 2/4, bot-p16h.test.ts 24/24, bot-qa-p15.test.ts 6/8, play-stage.test.ts 33/40, board.ts 11/20, page.ts 2/4). Total 97 insertions + 19 deletions = 116 ≤ 400. The five shipped tests are byte-identical to the kit (sha256s above). Kit smoke is SMOKE PASS at 390×844 and 360 wide (lines above). painter-proto/, ui-shell/, src/core, src/types/core-types.ts, src/rules/behaviours/catalogue.ts and src/sim are absent from the diff. No new BTF. QA checklist: G1 done (shipped tests verbatim and the new cases ran inside the 992). G2 done (tsc exit 0; no ts-ignore, ts-expect-error or any added). G3 done (check:state OK; this step does not write phase). G4 done (the step quotes no interface block; fit's new dpr argument, required bot options, DEFAULT_STEP_REACH and MIN_CELL_CSS match what the shipped tests import). G5 done (do-not-touch paths absent). G6 done (only the nine files in the step table). G7 done with a flag: 116 is under the 150–400 band, and the step proto is already 131, so lines were not padded; every file is at or under its stated cap; hard cap 400 holds. G8 done (check:law OK; no new clock, no new dependency). G9 done (decisions below name every default the diff introduces). G10 done (each Acceptance line above).

## Decisions & deviations
- Base is 8e900ea5745fd1e3542a7a09285f6a728881a55d (E7p merged, 988 tests). Floor used is 988 + 4 = 992. The run is 992/0. Changed lines are 116 (97 insertions, 19 deletions), under the hard cap of 400. The step proto is 131, already under the G7 150 line, so the under-150 result is the flag only and lines were not padded to enter the band.
- File counts (insertions + deletions) against the step caps: battle.ts 10/20, bot-ability-priority.ts 16/28, battle-p16-heavy.test.ts 12/16, bot-p15.test.ts 2/4, bot-p16h.test.ts 24/24, bot-qa-p15.test.ts 6/8, play-stage.test.ts 33/40, board.ts 11/20, page.ts 2/4. No extra file.
- MIN_CELL_CSS is 44 in tools/play-stage/board.ts. TILE stays 16. fitted is floor(min(devW / mapW, devH / mapH)). minS is ceil(MIN_CELL_CSS * dpr / TILE). s is max(minS, fitted). If minS or fitted is not a finite number at least 1, that side is treated as 1 so s never drops below 1. A map that cannot fit keeps this floor; pan or scroll is P1-7, not a smaller cell.
- page.ts passes devicePixelRatio || 1, so a missing or 0 devicePixelRatio does not collapse the floor. Demo 6×9 at 360 CSS @3x still fits: fitted is 11, which is above minS 9. At 390 CSS @3x fitted is 12.
- DEFAULT_STEP_REACH is 2, documented in bot-ability-priority.ts as the P1-5 bot step cap when the host omits stepReach. It is not an engine rule. The throw string is exactly "botAbilityPriority: setup and actionsPerTurn required" when setup is missing or actionsPerTurn is not an integer at least 1. The {hp:1, atk:1} fallback and "actionsPerTurn ?? 2" are gone.
- The board reads actionsPerTurn from installOne(ACTION_BUDGET, {}).out.actionsPerTurn. An empty install uses the knob default, 2. If out is null the board throws Error "play: action-budget" and does not seat the bot.
- taken() rebuilds stats, reach and abilities on Object.create(null), keeps a key only when Object.hasOwn is true, and copies each ability row as {reach, damage, effectRef}. whole() was already typeof number && Number.isInteger && n >= min, so Infinity was already rejected; the shipped test now calls it with Number.POSITIVE_INFINITY. No cache was added.
- intend() was not changed. A foreign SelectUnit still rejects "notOwn" and leaves selected null. A TargetCell off the reach list rejects "notReachable", does not walk, and clears pending. A second tap on a different non-reach tile clears the preview and does not walk. Smoke used CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome and PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core. /usr/bin/google-chrome is not on this machine. smoke.mjs was not edited.

## Next step (optional proposal)
- P1-7 should honour MIN_CELL_CSS (44) in fitBoard and zoomAt, keep these play-stage tests, and pan or scroll when the floor no longer fits the viewport.
