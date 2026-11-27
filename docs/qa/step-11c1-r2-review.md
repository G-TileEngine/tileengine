# Step 11c1 r2 review (PR #112, ChatA)

**Verdict: OK TO MERGE.**

- PR: https://github.com/G-TileEngine/tileengine/pull/112 (replaces #111).
- Tip 8819ce1c (tree 135cdbec), code head 537479d4 (tree af8ea0ee), parent r1 tip 9976ac6b, base b7acc899.
- Merge tree onto main c1baf1db: 73b7761725911705acc7dada60eb09d160855e3d. I computed it myself and it matches CoS's expected tree.
- Handback r2: sha256 777bd897…ab742. Code head is labelled on its own line.
- The r1 review is docs/qa/step-11c1-r1-review.md (c805565e).

## The r1 must-fixes

1. **Rule 8 packs: fixed.** SID, STAGE, MAP, AT, PID, NOW and S1 to S5 each get their own line (L12–L22), and so do docs and store (L42–L43). The comma probe is now `const get = mock.fn(() => Promise.resolve(""))` with `get.mock.callCount() === 0` (L106–L108). The file is 133 lines and has no comma expressions.
2. **C20 is now caught.** L50 sets the sides to loadout "heroes" and enemyPool "heroes". My plant `const me = "player"` now fails test 1.
3. **Import order: fixed.** test-launch.ts keeps the base order and only adds stageNames.
4. **Nothing else changed.** Between c57e9bf2 and 537479d4, only the test file, the test-launch import line and the r1 handback changed. The total is still 400 of 400.

## Run at the code head 537479d4 (clean npm ci)

- green: 1175 pass, 0 fail. The tools tsc shows only the 3 base errors.
- All 25 smokes PASS, with s11b on port 8840.
- Export audit PASS: play-stage release 136, baseline 150, maker play tree 150.
- My plants: 29 of 34 caught. All 24 C plants I ran are caught (C1–C28 except C2, C7, C12 and C23, which I did not plant; C20 included), as are Q1 and the four extra load and gate plants. The 5 that miss are the same carries as r1.
- Correction to the r1 doc: it said 30 of 34, but r1 actually caught 28 of 34. The list of caught plants in that doc was right. The r1 doc is pushed, so I left it as it is.

## Rulings on CoS's points

1. **Helpers folded into expressions: OK.** These are isObj inside bag (L24), `uses` inside counts (L30) and the save write inside `if (!(…).ok) throw` (L44). Each is still one statement per line, which is what Rule 8 asks for; folding a helper away isn't joining statements. kept() taking a setter is a fair refactor, and test 2 now also proves nothing is written. One small handback drift: the `uses` fold isn't listed in Decisions. Noted only.
2. **One-line brace-body arrows: OK for this step.** These are setBudgets, effectBehaviour, answer and the two start callbacks. They were in r1 and I didn't flag them there, so I won't move the bar in r2. For later guides, I suggest wording Rule 8 so that a body with a statement in it takes its own lines. That's a guide choice for EA.

## Carries (not blocking)

My plants that no test catches yet, for 11c2 or a later test touch:
- Neutral setupIds dropped.
- A pool on the neutral side still counted as AI.
- "none" counted as an effect.
- The summary picking the first stage instead of the busiest.
- Roster `required` dropped. The code matches play (project.ts L84).

Also carried: the module-wide `let open`, the re-parse on every repaint (time the project screen on the S21), and meter spacing (11c2).

## After merge

Postmerge check with `qa-postmerge.sh <merge> 8819ce1c`. The merge tree must be 73b77617, at a floor of 1175.
