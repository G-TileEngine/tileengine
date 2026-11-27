# QA re-check: boot splash docs r3

Reviewer: QA & Build Guard. Date: 2026-11-27. Follows `boot-splash-docs-review.md` (`d628a5e6…`) and its addendum (`1f2b32d7…`).
Verdict: **OK.** Both must-fixes are closed.

## Files

- `roadmap.md`: `e5f2877f…`, 288 lines.
- `STATES.md`: `d4e166f2…`, 244 lines.
- `boot-splash.patch`: `37cf329f…`. It applies clean on main `664f8303` (origin/main), and the result is byte-identical to both files.

## Must-fixes

1. **Attribution: closed.** This was fixed in r2 and is unchanged in r3. The CEO ask is only the flow (the TileEngine logo, then the optional creator logo, then the title, then Play, then `play.loading`) with assets loading behind the logos. Everything else is tagged *(EA, PROPOSED)*.
2. **Id clash: closed.**
   - Row 15 (L95) is back to `dc42c5e3` byte for byte, "Gather and respawn (35b)".
   - The splash is now `35s`, and `git grep -w 35s` on `664f8303` finds nothing.
   - `35s` is used in the r15g line, row L132, row 36's depends-on (L133) and the STATES §1.0 heading. STATES has no `35b` left.
   - Against the EA original, the roadmap diff is L3 and L132–133 only.

The guide notes from the first review are parked for the 35s step guide.
