# QA kit review: step F1 look kit r1

Reviewer: QA & Build Guard. Date: 2026-11-27.

**Verdict: NOT OK TO SEND.** There are 2 must-fixes, and both are small.

## Files

All six files in `/workspace/share/f1/` pass `sha256sum -c`:

| File | sha256 | Lines |
|---|---|---|
| Guide | `7caae8af…` | 197 |
| Shipped test | `04de3ef2…` | 117 (7 titles) |
| Plants | `3663d57d…` | |
| Paste | `c1d7bc62…` | |
| Trial patch | `9eb5df4e…` | |
| Push list | `9c0f7f23…` | |

The base is main `e0455199` (tree `b54d90d4`).

## My run of the trial

I applied the trial patch to `e0455199` and committed it. The tree is `25a872ee`, matching the guide. Node is 24.22.1.

- **Green:** **1187/0**, the floor of 1180 plus 7. The shipped test is byte-identical in the trial.
- **tsc:** only the 3 base errors: `page.ts` L101, and `home.ts` twice, now at L93.
- **Smokes:** all 25 PASS solo, at the guide's counts.
- **Export audit:** 136 / 150 / 150, AUDIT PASS.
- **Plants:** 15/15 caught, and the tree is clean after.
- **Count:** 22 files, +234/−72 = **306**. Every file is within its cap.
- **Acceptance greps:**
  - No `class="btn"`.
  - No ⋯ or ▶ in the maker `.ts` files.
  - `tokens.css` is untouched.
  - The `app.css` diff is only the L51 `.undo` drop and L59–L68.
- **Rule 8:** I paired each edited line with its base line.
  - No edit adds a statement. The diffs are class swaps, icon and thumb insertions, `aria-pressed` on Grid lines, and the colour chip's `.sw` swap, which drops the inline `style` `;`.
  - The new lines (`const goes`, `const over`, `const undo`, the imports, `icons.ts`) hold one statement each.
- **Primaries:** at most one per file section. The ones on scrim sheets (effect, levels, Background, unit name, rename and resize) sit over a page with its own primary, and the test's split at `class="scrim"` covers that. Ruling 2's table matches the code.
- **Undo chip spec:** it matches style-spec § 7: 40 px visible, a 48 px hit area, 16 px left, the shadow and the 999 radius. The trial shots `b-undo-chip-360` and `c-tile-sheet-390` look right.

## Must-fixes

1. **The Undo chip's 48 px hit area is not pinned. The guide's claim is false.** Ruling 7 says the 48 px button box "keeps the smokes' 48 px touch check". I planted `.undo-chip { min-height: 0; padding: 0; }`. Then npm green, the shipped test, and the S0, s3, s4a, s4b and s9b smokes all still PASS, so nothing measures the chip.
   - **Fix:** the shipped test asserts the `.undo-chip` rule (`min-height: 48px`, `padding: 4px`, `z-index: 4`). Add a plant P16, "the Undo chip loses its 48 px hit area".
   - Reword Ruling 7's sentence, so it doesn't claim the smokes check the chip.
2. **The dropped Budgets icon is not recorded.** Style-spec § 7's shot list includes `budgets`, and plan L69 says "about 16 icons". The guide ships 15 and never mentions Budgets.
   - **Fix:** add a line to "Not in this step", with the reason in plain words: its `aria-hidden` SVG broke an existing test. Name which test, and give a target step, for example F2a with the ☰ menu's Budgets row.

## Notes (not blocking)

- **Ruling 7, "12 px above the map's bottom edge".** In the trial the chip sits at the bottom of the stage body, near the screen's bottom edge, not under the grid (shot `b-undo-chip-360`). That matches the spec's "above the tool bar" intent. Say "the stage body's bottom edge" so the builder doesn't move it up to the grid.
- **The 11 open questions to UX are fine.** Fold UX's answers into r2 along with these fixes. If an answer changes a primary, a chip or the Undo chip, the plants and test titles must follow.
- **Paste L1** is the token placeholder, as usual.
