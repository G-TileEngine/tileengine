# Hand-back step-ed-e4-blend-core r1
Step file: handoff/steps/step-ed-e4-blend-core.md (sha256 ab04fa8038ccf26799450469e1d32e03dfc67fc23502b24f6051d48d75af7f5f)
Base commit: 5d4c00fbcebbe1c8aac220f12fdf19feb7ddcbd2     Head commit: 5f632999ceee658fd3dbf28a382335329cbe8ef3     Branch: step/step-ed-e4-blend-core-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/editor/effect/fit.ts
A	src/editor/effect/merge.ts
A	tests/editor/effect-e4-carries.test.ts
A	tests/editor/effect-e4-qa.test.ts
A	tests/editor/effect-e4-qa2.test.ts
A	tests/editor/effect-e4-qa3.test.ts
A	tests/editor/effect-e4-r2.test.ts
A	tests/editor/effect-e4-r3.test.ts
A	tests/editor/effect-e4.test.ts

## Green
npm test: 832/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci && npm run green: exit 0. 832 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 90548.261979. deps 113 modules / 363 deps. check:state OK (src). check:law OK (src).
smoke: 0 failed
match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.34 p95 0.63 ms; lap 2 p50 0.26 p95 0.50 ms; lap 3 p50 0.23 p95 0.47 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.41 p95 0.75 ms; lap 2 p50 0.40 p95 0.64 ms; lap 3 p50 0.39 p95 0.63 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.35 p95 3.69 ms; lap 2 p50 1.22 p95 1.76 ms; lap 3 p50 1.21 p95 1.73 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.76 p95 2.33 ms; lap 2 p50 1.72 p95 2.29 ms; lap 3 p50 1.72 p95 2.30 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.08 p95 1.46 ms; lap 2 p50 1.07 p95 1.40 ms; lap 3 p50 1.07 p95 1.46 ms; counts 27/373/0

## Shipped tests (sha256, unchanged)
a4b8052892d489169ae25745dbd6d60a50acf4fd051558359e262606878bc3dc  tests/editor/effect-e4.test.ts
9d350f3cdc67aa1fe29f2f14ada7ed73535e40b3a158fe544feb6cb1f62fc9dd  tests/editor/effect-e4-carries.test.ts
03323745d9eca7669f1df3128b04abda3f0d9f8ec410d8729db6c7aefebbfad3  tests/editor/effect-e4-qa.test.ts
367d2519996b029a98a850a91d690b44ddaecc7af48c5e3318339f8be12dedbe  tests/editor/effect-e4-r2.test.ts
e2385ec763b8e18e31fc7238c0333f8a31572ffae3ac9ba3c0e18db6040fc29c  tests/editor/effect-e4-qa2.test.ts
077aafe5272caafb30901aec6d53ff51f1ed06916c807a8920dc30476acc445e  tests/editor/effect-e4-r3.test.ts
9d8a3058564c3add1f0dc97cbf3a5c15347961ef0618f406683cfc546202eb15  tests/editor/effect-e4-qa3.test.ts

## Helpers & self-review (required)
- Helper fit.ts (beat, count, connect, shift, join): probed the seven fit rulings from /tmp, without editing the repo. Shipped E1/E4 cases passed. One must-fix: a hit whose id is "" or missing was not protected from Fit's trim when connect_step did not name it, so the hit could move. Fixed in fit.ts inside the 37-line cap: the hit step's trim tag is cleared, and connect_step is written to the hit id for any string id, including "". A probe that wanted a string or null count left untouched on a scale was not adopted: E1 already writes that step's pro-rata share; only a non-finite or negative number is left in the doc.
- Helper blend, mix and punch: probed pairing, the minted hit id, punch caps and immutability from /tmp. Fifteen reported failures were checked against the rulings. Fourteen were the probe (a light part is not shape:hit, so a shape:hit mix does not pair them; an unknown pick does not invent a badge for a key neither card has; at t = 0.5 an absent winner knob stays absent). One was real: Fit can trim the only step of a moved part after the pre-fit drop, leaving a chip. The unused-moved-part drop now runs on the fitted doc. A one-sided finite scale value is still copied, and a non-finite punch value on the winner is kept as that winner's value.
- Helper meter and impact marks: meter matched countOf and badCounts (first 12, enabled steps, caps 48/32, 60, 2, 12, no repeated Fit line). impactMarks failed law 13: a beat named constructor, toString or __proto__ was an inherited key, so the span could be NaN, the call could throw, and a sixth beat could be stored. Beats are accumulated on a null-prototype object and returned through Object.fromEntries, so a normal record still deep-equals and at most one unknown beat is kept.
- Self-review: Acceptance done — npm ci && npm run green exit 0, 832/0/0/0/0 (re-run after the review fixes, duration_ms 90548.261979); smoke 0 failed; the host example prints the tick-460 line and exits 0; sim afc89d56… and b8007292…; stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 (run alone, C lap-3 p95 1.73 ms); pin diff empty (1e5dd82c, d7f64a09, 45a3dbaa, 4d7bbf48, d6d08696); runtime/sim/core/fx diff empty; seven shipped sha256s match; caps fit 37, merge 69, tests 71/45/35/35/22/19/11; total 344 ≤ 400; no Math.random, Date, timers, Card/Deck, or hp/mana/cost in the editor files; no UI files. QA checklist G1 done (seven shipped files verbatim), G2 done (tsc exit 0, eslint exit 0, no ts-ignore, no any; dynamic delete is only the three literal punch knobs and squash), G3 done (src/state untouched), G4 done (AB, Pick, Gauge, Meter, Span, Marks, Blend, MERGE, layerOf, keyOf, meter, impactMarks, blend, countOf, badCounts, lit, shiftOther and join match the quoted signatures; the side type is AB), G5 done (do-not-touch paths absent), G6 done (only fit.ts, merge.ts and the seven tests; this hand-back folder is the required delivery), G7 done (344, each file inside its cap), G8 done (deps 113/363, check:state and check:law exit 0), G9 done (decisions below), G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- MERGE punch caps are 150 / 200 / 3 and draws is 60. Scale keys are seconds, bend, hold_ms, fade_out_ms, particle_count, particle_life_ms, particle_pull, light_radius. Pick keys are kind, picture, tint_ramp, light_ramp, light_mode, particle_motion, ease. A missing or unknown pick is both. layerOf is the part kind when it is one of PARTS.kinds, else sparks for particles and shape otherwise. The key is layer:beat.
- beatOf: one named beat wins; otherwise list position is cast / hit / linger, refined to travel before the hit for a PATH.kinds step and to hit after the hit for at-hit unless hold_ms or fade_out_ms is a number above 0 (then linger). A part that names two or more beats and does not name the refined beat stays on the list-position beat, so the E1 multi-beat pin stays cast / hit / linger.
- The base hit is kept by stepTimes(base).hitIndex, never by id. If that id is not a string, is "", or repeats an earlier step's id, blend mints s- after join's ids and connect_step names it. When picks or Mix move the base hit, shiftOther moves other-side at-time steps by that delta after the drops, then Fit may shift them again after its own trims. Both clamps are 0..20000. A non-finite mix is 50; join and the seed get that clamped mix; t is snapMix of it over 100. The winner is A below 50, B above 50, and the base at 50.
- In a mix key the k-th base step pairs with the k-th other step. Both-finite scale values become A + (B − A) × t, particle_count and *_ms rounded whole and the rest to 0.01. If only one side is finite, that number is copied, so a NaN does not block the other side. Discrete fields come from the winner; an absent winner value is omitted. Unpaired steps stay. The badge for mix is the winning side, a or b, not "mix". Badge keys are inserted card A then card B.
- Punch both is the max of the finite values, else the only finite, else the base's. a or b copies that card, and an absent knob stays absent. Mix is round(A + (B − A) × t) when both are finite, else the winner's value, including a non-finite one. squash both is true if either side is true, else the base's; a, b and mix use the picked or winning card. A finite knob is capped only when it is strictly over 150, 200 or 3, and those Capped lines come after Fit's lines.
- A non-number particle_count still counts as 12, and a scale still writes that step's share, as in E1. A non-finite or negative number counts 0 and is left in the doc, with Bad count. A finite count over 48 is written as 48 on every particle step, including disabled and past 12, with Capped count only for an enabled step among the first 12 after the trims, numbered after the trims, from the pre-scale value, and those lines are first among Fit's. The meter adds a count line only when the messages do not already have it.
- A moved part with no remaining step is dropped after Fit, so a trim cannot leave a chip; every base part is kept. Fit clears the hit step's trim tag, so a hit with id "" or no id is not dropped, and connect_step is set to the hit id when that id is a string ("" included). Impact beats are filled on a null-prototype map and copied out with Object.fromEntries: the four named beats are always present, the first unknown beat may be added, and a later unknown is skipped. Nothing is cached. One blend is at most the base steps plus 12 moved steps, one badge per key, and at most 5 beat spans. No new file beyond merge.ts, no new dependency, pins unchanged. Deps are 113 modules / 363 deps.

## Next step (optional proposal)
- E5 can take dice, breed and CN-022. E7's chips sit on blend, meter, keyOf and impactMarks, and must show that the base hit stays when its key is picked for the other side, and that more than 6 parts show 6 chips. Not a change here.
