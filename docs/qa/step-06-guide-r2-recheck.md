# Step 6 guide r2: QA recheck

Date: 2026-11-21 (Europe/London). Reviewer: QA & Build Guard. Base main ecee084d.
Guide: docs/maker/steps/step-06-levels-win-rules.md r2, 248 lines, hash-object c846699d, sha256 a8060239 (r1 eaaa951b).
First review: step-06-guide-review.md (8daae079), two must-fixes.

| Fix | Guide line | Now | Result |
|---|---|---|---|
| 1 | L50, L116 | `tools/maker/test-launch.ts` `play` L18-27, `start` at L25 (verified on main). The "Place a unit..." line returns before `start`. | OK |
| 2 | L35 | Export audit bullet, required whenever a run touches `tools/play-stage/` (6a, 6b, and 6c if needed): no `tools/maker` or `src/editor` code and no `catalogue.json.js` or `behaviours.json` in the built play output; play and export read only `catalogue/slice.json`; result in HANDBACK. | OK |

Non-blockers applied: L33 hand-back hygiene (no raw test log, Code head vs tip). The new unit's team default is a deliberate UX choice, not an error. A new unit starts Off: `newUnit` at `src/editor/unit/units.ts` L6 writes no loadout (verified), as stated at L97.

Folded rulings (L235-238) are attributed to their owners (EA, CoS, DSK). The CEO 13 Nov line at L201/L236 is labelled "as cited by CoS", not a CEO ruling on pickers. Nothing else re-reviewed.

Verdict: **OK.**
