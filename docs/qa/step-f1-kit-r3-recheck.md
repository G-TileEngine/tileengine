# QA delta check: step F1 look kit, r2 to r3

Reviewer: QA & Build Guard. Date: 2026-11-27, about 16:55 London.

This check builds on:
- the r1 review, `step-f1-kit-review.md` (sha256 `61af4983…`);
- the r2 re-check, `step-f1-kit-r2-recheck.md` (sha256 `98167d73…`). That OK is superseded by this one.

**Verdict: OK TO SEND, for the r3 files below.**

## Files

`sha256sum -c SHA256SUMS` passed.

| File | sha256 | Lines |
|---|---|---|
| Guide | `053c286a…` | 198 |
| Test | `83ef2acf…` | 149 (8 titles) |
| Plants | `2f23d56c…` | 29 |
| Paste | `f314fea9…` | |
| Patch | `c0ea4042…` | |
| Push list | `4d9dc653…` | |

The base is main `e0455199`, and paste L1 is the token placeholder.

## My run of the trial

I applied the patch to `e0455199` and committed it. The tree is `4ccddd3f`, matching the guide.

- **Size:** 27 files, +292/−85 = **377**.
  - Each file is exactly at the cap the guide gives it, and the caps add up to 379. So a builder who stays inside every file cap can't go past 380, and the 3-line margin is safe by construction.
  - L177 says to stop and report if the build passes 380.
- **Green:** **1188/0**.
- **tsc:** only the 3 base errors.
- **Smokes:** all 25 PASS. My runner ran them in one pass, s0 to s11c1, with no stall, at the guide's counts. EA's runner stopping after s6a did not happen here.
- **Export audit:** 136 / 150 / 150, AUDIT PASS.
- **Plants:** **29/29** caught, including the new P20–P22 and P24–P29. The tree is clean after.

## What changed in r3

- **The `seg(label, on, act)` helper**, `widgets.ts` L9–L12.
  - It holds two statements on two lines: `const opt` (a single-expression arrow) and `return`. That's Rule 8 clean.
  - The 4 call sites (`widgets.ts` L20, `stage.ts` L155 and L161, `units.ts` L103) swap the old markup for `${seg(…)}` or `return seg(…)`, with no added statement.
  - Only the unset option carries `data-act`, so the act strings are the same as before and the handlers are untouched. P25 checks this.
  - The Off state shows Off pressed (P24), and exactly one option is pressed (P21).
- **`.seg-row`**, `app.css` L70: 48 px min-height, with the label on the left and the frame on the right. The shots `e-view-toggle-off-360` and `on-390` match.
- **The ghost rows.** New project, + Add unit and + New effect are `btn ghost stage-row` with the plus icon. P27–P29 catch the old looks.
  - New project's "Demo or empty" sub line is dropped, as UX ruled at 16:45 in Ruling 10. Nothing in the tests or smokes reads it.
- **Smoke edits.** There are eight smokes, 13+ 13−, matching the Smoke lines.
  - s6a L31/L38/L45, s6c L81 and s8 L34 now read the pressed option through `[data-seg=…] [aria-pressed="true"]` text. That's as strict as the old `aria-pressed` read.
  - The taps in s6a L35/L55/L63, s6c L57 and s8 L34 still use the same act. Note that s8 L34 is edited: its state checks changed, while its tap stays.
  - s5a and s5b now look for "Add unit" without the "+". That's a little looser, but still specific to the Units list.
- **Button words.** "Off" and "On" are the only new ones (guide L169, UX 16:09).

## Carry (not blocking)

- `app.css` L8 still has `.card.new` in its selector, and no markup uses `card new` any more, so that part is dead CSS. Drop it in F2a, since `app.css` is at its cap here.
