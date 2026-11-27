# QA re-check: step F1 look kit r2

Reviewer: QA & Build Guard. Date: 2026-11-27, about 16:20 London.
This re-checks the r1 review in `docs/qa/step-f1-kit-review.md` (sha256 `61af4983…`).

**Verdict: OK TO SEND, for the r2 files below only.**

## Files

`sha256sum -c SHA256SUMS` passed when I started.

| File | sha256 | Lines |
|---|---|---|
| Guide | `2ffd77ab…` | 196 |
| Test | `de0c079d…` | 142 (8 titles) |
| Plants | `8f5e6d8f…` | 23 |
| Paste | `fe010a1b…` | |
| Patch | `571fb699…` | |
| Push list | `cc85307a…` | |

The base is main `e0455199`.

## My run of the trial

I applied the patch to `e0455199` and committed it. The tree is `064d87a1`, matching the guide.

- **Size:** 22 files, +266/−73 = 339 lines, under the 380 line, so the Undo chip stays.
- **Green:** **1188/0**.
- **tsc:** only the 3 base errors: `page.ts` L101, and `home.ts` twice at L93.
- **Smokes:** all 25 PASS solo, at the guide's counts.
- **Export audit:** 136 / 150 / 150, AUDIT PASS.
- **Plants:** **23/23** caught, and the tree is clean after.

## The r1 must-fixes

1. **The Undo chip's 48 px hit area: fixed.**
   - Test L140 pins the whole `.undo-chip` rule exactly, and `rule()` asserts that each rule appears once (L25).
   - P16, an override appended later, and P17, the button shrunk in place, are both caught.
   - Ruling 7 and the Smoke lines (L125) now say the shipped test pins the chip and no smoke measures it.
2. **Budgets: fixed.** Guide L182 records it under "Not in this step". The reason is `tests/project/budgets-11c1.test.ts` L124 (exactly four aria-hidden meters), and the target is F2a.

The r1 note is in too: the chip sits on the stage body's bottom edge plus the safe area, not on the grid.

## The UX additions

- **Rule 8 on the `.seg` wraps.** These are `widgets.ts` (the knob toggle), `stage.ts` L154 (Autosave here) and L160 (Grid lines), and `units.ts` (On your team).
  - Each one swaps `btn` for `.seg-opt`, adds a `<span class="seg">` frame and an inner `<span>`, and adds `aria-pressed` on Grid lines.
  - That's markup inside the existing template only, and no statement is added.
  - Remove link becomes `btn danger`, as Ruling 3 says.
- **`.seg` CSS.** It uses existing tokens: `--seg-line`, `--accent-ink` and `--surface` are all in `tokens.css`, which is untouched.
  - The 48 px `.seg-opt` sits inside the 40 px frame through `margin: -5px 0`.
  - All four rules are pinned, and P20–P22 catch them.
- **Chips.** They centre their label, and the padding is symmetric unless there's a `.sw`. P18 and P19 catch both. The r2 shot `c-tile-sheet-390` shows centred labels.
- **+ Add stage.** It's now `btn ghost stage-row` with the plus icon. P23 catches the old look, and the r2 shot `d-project-390` matches.
  - "Add stage" in the s8 smoke is the sheet title, and it taps the button by `r:add`. So no smoke presses the button's text, and the guide's claim holds.
- **Icons.** There are 16 now (plus added). The r2 shot `e-view-toggle-390` shows the one-option framed pill, "Grid lines: On", which matches the code.

## The working folder changed during this check

At 16:13 London, `/workspace/share/f1/` moved past r2. The r2 set is kept as `*.r2` and `trial-shots.r2/`.

- `f1-trial.patch` is now `c0ea4042…`, which no longer matches `SHA256SUMS`.
- `trial-shots/` now shows a two-option Off | On toggle with a separate "Grid lines" label.

This OK covers the r2 hashes above only: patch `571fb699`, guide `2ffd77ab`, test `de0c079d`, plants `8f5e6d8f`, paste `fe010a1b`, push list `cc85307a`.

If the toggle changes again (for example after UX's look at the shot), that's an r3 change to the code, test and plants. It needs a new sums file and a delta check by me before CoS pushes. Don't push the live folder as it stands.
