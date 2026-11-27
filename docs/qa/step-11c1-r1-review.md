# Step 11c1 r1 review (PR #111, ChatA)

**Verdict: REWORK r2**, test file only. The code is right; the test packs lines to fit the cap, and one guide plant isn't really caught.

- PR: https://github.com/G-TileEngine/tileengine/pull/111. Tip 9976ac6b (tree a6b82860), code head c57e9bf2 (tree 5a9ba777), base b7acc899.
- Merge tree onto main 59306e31 is a84b4edd87eb8f9a5d7a687165c5b818b05802f0, which matches CoS's expected tree.
- Guide: /workspace/share/s11/step-11c1-budgets.md (d876765f).

## What passed (run at c57e9bf2)

- green: 1175 pass, 0 fail. The tools tsc shows only the 3 base errors (page.ts L101, home.ts L92 twice).
- All 25 smokes PASS (S0 through s11c1; s11b on port 8840 because 8820 is taken).
- Export audit PASS: play-stage release 136, baseline 150, maker play tree 150.
- Size: 14 code files, +390/-10 = 400 of 400. Five files are exactly on cap (load budgets.ts 112, app.css 1, three project.json files at 8 each). The test is 133 of 135.
- Code read against the guide: limitsOf, placed (fixed, weighted capped by spawns and by entries without repeats, waves as the largest wave), fx and effectCount, budgetRows (near when used >= warn, over when used > limit, detail with w and h), read-project pushes after `hard`, the test-gate line, stageNames for Test and Build game, the maker Budgets row with an aria-hidden meter, and the CSS line all match.
- My own plants on the builder code (string swaps, restored after each): 30 of 34 caught. Caught: C1, C3, C4, C5, C6, C8, C9, C10, C11, C13, C14, C15, C16, C17, C18, C19, C21, C22, C24, C25, C26, C27, C28, Q1, plus the non-object budgets row, stageTiles w+h, the detail without w and h, and the tiles line with w and h swapped.

## Must fix in r2 (tests/project/budgets-11c1.test.ts only)

1. **Rule 8 packs.** The guide says one statement per line in new tests, and "any join or pack to fit a cap is NOT OK". Unpacked, the file would be about 13 lines longer, over both the 135 test cap and the 400 total.
   - L12 packs 6 const bindings (SID, STAGE, MAP, AT, PID, NOW).
   - L13 packs 5 (S1 to S5).
   - L32 packs 2 (docs, store).
   - L109 is a comma expression: `() => (fetched = true, Promise.resolve(""))`. This is the same shape the 11a zip.ts comma had, which was accepted as "not a precedent", so it is not OK here. The handback's own § Helpers calls the earlier form a Rule 8 pack.
   - Fix: one binding per line. For the probe, use `import { mock, test } from "node:test"`, `const get = mock.fn(() => Promise.resolve(""))`, and assert `get.mock.callCount() === 0`. Then cut setup lines honestly to stay at 133 or under; the trial wrote this test one binding per line in 129. Code files stay byte-identical.
2. **C20 isn't really caught.** Test 1 sets `sides.loadout: "player"` (L40), which is the fallback. So the plant `const me = "player"` (the AI ignores the loadout side) passes every test. The handback lists C20 as caught, but its plant script isn't on the box, so I can't see which plant it ran.
   - Fix: give the loadout side a name other than "player" in the AI case (for example loadout and enemyPool both "heroes"), so that plant fails.
3. Put the test-launch.ts import back in its original order, adding only stageNames. It's cosmetic but costs no lines.

## Rulings on CoS's points

1. Being exactly at 400/400 with five files on cap is OK, as long as nothing is packed. The JSON and CSS caps are forced by their content, and load budgets.ts keeps one statement per line. r2 has to stay at 400 or under.
2. The L109 comma: NOT OK (must-fix 1).
3. The dense lines in src and tools (the for/if/else-if in maker budgets.ts, the fx chain, activeAi repeating its side expression) are each one statement, so they are OK under Rule 8 as written. Noted only.
4. The import re-sort: cosmetic drift, not a rework reason on its own. Revert it in r2 (must-fix 3).
5. Re-parsing on every repaint: known carry. Time the project screen on the S21.
6. Meter spacing: carry to 11c2. OK.

## Carries (not rework)

My plants that no test catches:
- Neutral setupIds dropped.
- A pool on the neutral side still counted as AI.
- "none" counted as an effect.
- The summary picking the first stage instead of the busiest.
- Roster `required` dropped. The code matches play (project.ts L84), but nothing tests it.

Also carried: the module-wide `let open` in maker budgets.ts.

## r2 re-review

Same checks. I'll diff the code files against c57e9bf2 and expect no change, then rerun the C20 plant and the four probe plants.
