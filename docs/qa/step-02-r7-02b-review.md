# QA recheck: step-02 r7, step-02b r1, step-03 r8 (order 2 → 02b → 3)

QA & Build Guard, 2026-11-19, Europe/London. Read-only. Files reviewed: `/workspace/share/maker-spec/step-02-home-save-load.md` (sha256 `d4e50404…7780`, 125 lines), `step-02b-play-stage-carries.md` (`d8324076…5218`, 76 lines) and `step-03-test.md` (`12e750b8…19e1`, 98 lines, r8). Main `67370831` still has step-03 **r7** (`c1aa1118…`, 97 lines), so r8 is the share copy only. r6 reference: `13167721` at `477e021e`. Carry-8 typecheck trial was run in a scratch worktree at `477e021e` (removed afterwards).

## 1. step-02 r7: NOT OK (one line)
- `diff` r6→r7 changes exactly L3, L16, L56, L57, L61–62 (which replace r6 L61–63), L64, L74–75 (which replace r6 L75–77), L109 and L115. Nothing else changed.
- **UX's carry cite is right.** In r6, L75 is the `## QA carries` heading, L76 is Carry A and L77 is Carry B. My earlier "L72–73" was wrong, so I accept L75–77.
- L56 adds `app.css` to the build output. L57 says tokens only, with no component, layout or media rules. L61 makes `app.css` counted (cap 40), moved verbatim with `.row` dropped, linked on `index.html` L6, with `bag.set` on `build.ts` L11. L62 takes carries A and B out (cap 0), and L74–75/L115 point to 02b. L16 keeps the S0 smoke, with the reason. L109 adds `':!handback/**'` and says `app.css` is counted. **All OK.**
- L64 re-total: 40+36+32+12+57+8+9+34+46+30+34+39 = **377** (375 without `.row`), and green is 1036+3 = **1039**. This matches my scratch run (377, 1039/0). The table caps sum to 400 (65+40+30+15+60+30+10+25+45+15+25+40). **OK.**
- **Fix: L14** still says only "with the files and sections `handoff/HAND-BACK.md` lists", and that list includes raw `test-output.txt`. No r7 line carries ruling 2. Append the 02b L15 sentence: "Put the `ℹ tests/pass/fail/…` summary lines in § Green; commit no raw test log."
- Non-blocking: L7 still names base `9fc49890`, while L64 re-totals against `772f7aa2` (r1's docs-only base). Either base works because the code is the same. The r2 hand-back should name the base it used, as r1 did.

## 2. step-02b r1: OK
- **Carry text:** L36–37 are byte-identical to r6 L76–77 (`diff` is empty).
- **Line counts:** the counts match r1's numstat. They are load 3/3, project 3/3, board 2/2, match 3/3, build 1/1, touch-play 4/3 and carries test 28, which adds up to **59 (44+/15−)**. Caps are 8+8+5+8+3+8+30 = **70**.
- **Floor and base:** L8 sets 1039 + N with N=2. L7 bases the run on step 2's merge, sha TBD, and says don't start before it.
- **Smoke:** L17 and L72 require it at 390 and 360, 7 ok lines each, sha `d528795e…`, with no sprite-id change.
- **Carry 8:** L38 and L45 make `PlayDocs.recipes` required. I checked this at `477e021e`: with `recipes?` changed to `recipes`, `tsc --noEmit` and eslint (play-stage plus both tests) are both clean. No other caller or test needs an edit, so L71's "no other test edit" holds.
- **Scope:** L45–51 and L63 limit the run to the 5 play-stage files, `touch-play.test.ts` and `play-stage-carries.test.ts`. Must NOT bans maker, template, fixture and kit edits, `JSON.parse` in play-stage, a second adapter and any module-level writes.
- **Done when:** L68–72 cover the gate with `':!handback/**'`, both carry tests, unchanged parity and play-stage tests, and the smoke. L15 commits no raw log.
- Optional: L10 leaves the 02b-or-step-3 order to CoS. CoS has now set it, so it could read: "02b goes first; step 3 bases on 02b's merge (L48 R-E1 edit rebases `project.ts`)."

## 3. step-03 r8: NOT OK (base, floor and Read-first assume no 02b)
No line cites step 2 for carry A/B, and none hard-codes 1036+N or 1041. R-E1's "line 61 on `772f7aa2`" (L48) is still true after 02b, which swaps lines one for one. The fixes:
1. **L7:** "main at the merge of step 2 (`step/step-02-home-save-load-r<N>-chatA`)" → "main at the merge of step 02b (`step/step-02b-play-stage-carries-r<N>-chatA`)". The sha stays TBD from CoS.
2. **L8:** "step 2's merged test count + N. Write it as step 2's final count + N" → "step 02b's merged test count + N (expected 1041 + N: 1036 + 3 from step 2 + 2 from 02b)".
3. **L9:** "1b and 2 merged" → "1b, 2 and 02b merged".
4. **L33:** "`tools/play-stage/load.ts` (now only `RECIPES`, `recipeOf`, `PlayDocs`, `docsToInput` …)" → add "after 02b: `RECIPES` is frozen, `recipeIn`, and `PlayDocs.recipes` is a required per-load map that `playDocsOf` returns; never write `RECIPES`".
5. **L86:** "**step 2's merged count + N**" → "**step 02b's merged count + N**". Add `':!handback/**'` to the line-count command, to match step-02 r7 L109 and 02b L68.
After these edits, push r8 to main, which still has r7.
