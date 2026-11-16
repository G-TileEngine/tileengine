# Hand-back step-ed-e1-converter-seed r1
Step file: handoff/steps/step-ed-e1-converter-seed.md (sha256 ac4a8494f54a96d20499319f43f24f7ac842ce91f03924b54a1ca058f3411916)
Base commit: 3c969024bf5096fd8d78787c3f3c1446564d12e8     Head commit: eaa7656b88dc75e46c31d0600ec9061cb20d2583     Branch: step/step-ed-e1-converter-seed-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/editor/effect/fit.ts
A	src/editor/effect/parts.ts
A	src/runtime/render/fx-doc.ts
M	src/runtime/render/fx-live.ts
M	src/runtime/render/fx-particles.ts
A	tests/editor/effect-e1-qa2.test.ts
A	tests/editor/effect-e1.test.ts
A	tests/runtime/render/fx-doc.test.ts

## Green
npm test: 753/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm run green: 753 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. deps 110 modules / 352 deps. check:state OK (src). check:law OK (src).
smoke: 0 failed
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
stress counts: 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0

## Shipped tests (sha256, unchanged)
197a8733a8ec03a8d9928b3a062740cf2d3f57892695f904fd5bea37b8ca397a  tests/runtime/render/fx-doc.test.ts
9f54691bb4d2f20dab25a501d17af016208f7af0887d92e761b9dd6734c49885  tests/editor/effect-e1.test.ts
fe03968e117398ed6bb87b9a1e554b669e8be056f9b2d878f00318dbc3a879d6  tests/editor/effect-e1-qa2.test.ts

## Helpers & self-review (required)
- Helper gates: caps, pins, shipped sha256s, quoted interfaces, forbidden tokens, import direction, and ancestry against 3c969024..dbb5ed1 → PASS on all seven checks. exportClean is a const arrow with the quoted callable type. No code change from it. Totals below are after the cycle fix (314 lines).
- Helper converter: rulings 1–5 and 11–12, including a hand simulation of the timing fixture (starts 0/400/400/1000/580/880, hit 550, ends 900/700, end 1300, unscoped hit 742) → PASS. No code change.
- Helper editor: asked to trace tests 4–11 and the diamond-cycle case. It had not reported after about twelve minutes, so it was stopped. The same pass was done in the probe below.
- Probe (17 cases outside the shipped tests): absent and clamped seconds and connect, at-hit then after-last, disabled slot, purity, 30+20 spark scale, light tie, 20000 clamp, blend snap, and a source with two parts pointing at one acyclic effect. That last case failed on the first fromInfo (false cycle). Fixed by an active-path walk. Probe re-run: 0 failed. Shipped E1 tests 11/11 after the fix.
- Self-review: Acceptance done — green 753/0 (test, typecheck, lint, deps, check:state, check:law each exit 0); smoke 0 failed; sim afc89d56… and b8007292…; stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0; pin diff empty (package.json 1e5dd82c, lock d7f64a09, depcruise 45a3dbaa, check-law 4d7bbf48, core-types d6d08696); shipped sha256s match; file caps 56/1/7/55/65/33/62/35 within 60/4/12/55/65/40/70/37; total 314 ≤ 400; no Math.random, Date, timers, Card/Deck, hp/mana/cost in the new src; no UI files. QA checklist G1 done (shipped tests verbatim, 11/11), G2 done (tsc exit 0, no ts-ignore, no any, strictness untouched), G3 done (no phase writes; src/state untouched), G4 done (exported names, params and return types match the quoted interfaces), G5 done (do-not-touch paths absent), G6 done (only the eight listed files), G7 done (314, each file inside its cap), G8 done (deps, check:state, check:law exit 0), G9 done (decisions below), G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- The first step always starts at 0, including an at-time first step (ruling 2). No shipped test covers that case.
- connect outside 0.02–1 is clamped and noted once as outOfRange "connect". seconds and an unknown start_mode are noted as steps[i].seconds and steps[i].start_mode. unknown connect_step is "connect_step <id>". atHitBeforeHit and noPicture are steps[i].
- at-time and at-hit starts clamp to 0..20000 (DOC.msMax). hold_ms is not clamped. Piece ms is len plus fade for stamp and dim only. hold delays the next after-last and is included in the timing end, not in piece ms.
- An absent particles count counts as 12 when fitting. An absent light radius counts as 2. A missing fit side counts as base. snapMix is nearest 25 via Math.round (half up), then clamped to 0..100 (37→25, 38→50). blendSeed runs both seeds through variantSeed first, so a bad seed contributes 0. writeSeed(0) omits the key. flatten accepts preset and does not call fit; ruling 9 does not fit.
- fromInfo: a repeat still on the active path, or a walk back to this effect, is a cycle. A shared acyclic source is current or changed, not a cycle. fit pins connect_step only when it is absent or empty (carry e, left for E4). Nothing is cached across calls. Disabled steps are still weighted (carry c). beatOf uses list position when a part names more than one beat (ruling 10, carry d). The scene link still dedupes a variant_seed note by code and message across effects (carry a); fx-live itself notes once per effect per frame.
- No extra file, no signature change, no new dependency. Carries (a), (c), (d), (e), (f) and (g) are unchanged and not fixed here.

## Next step (optional proposal)
- E4 can pin connect_step when the id names no step (carry e), and can take mix scaling and the punch cap (carry f). Stock picture sheets are still an open engine-data step: sheetOf null is noPicture today.
