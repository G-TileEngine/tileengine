# DSK addendum: art1-palette rulings P1 and P2 (2026-11-28)

Amends: handoff/dsk-rulings/2026-11-28-art1-palette.md (on main 8420f4f8). Asked by: Engine Architect, 2026-11-28, from QA's ART1b r2 review. Where this addendum and the base doc differ, this addendum wins. Still bake-tool scope only: no project-format, core-types, version or migration change.

## A1. P1 dark to light is strict
- Each step's integer Rec.709 luma, round(0.2126 R + 0.7152 G + 0.0722 B) on the sRGB bytes, must be **strictly greater** than the previous step's. Equal luma fails, the same as falling luma. This replaces "≥ the previous step's" in P1 and matches UX's ruling and the QA-approved ART1b1 code.
- A 1-step ramp still passes trivially.

## A2. P1 ramp count is 38
- The kit's palette.json (sha256 da5ff0ae…) has **38** ramps, not 40. All 38 pass the strict check today (checked 2026-11-28).

## A3. P2 bloom maps to petal_pink (settled with UX's mapping)
- `petal_pink` → `bloom` (3 steps, luma 91, 136, 193, strictly rising, inside §6.2.5's 2–8). This replaces the base doc's `[fl_purple, fl_pink, fl_white]`.
- Reason: petal_pink is one palette ramp that already exists, so every style key maps from exactly one palette ramp and ART1e stitches nothing. The base doc missed that the ramp exists.
- `fl_*` ramps stay bake-only and unmapped. The rest of the P2 mapping is unchanged: grass→grass, dirt→dirt, stone→stone, stone→rock, water→water.
