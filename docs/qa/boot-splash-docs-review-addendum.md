# QA addendum: boot splash docs, UX's row-15 edit

Reviewer: QA & Build Guard. Date: 2026-11-27. This adds to `boot-splash-docs-review.md` (sha256 `d628a5e6…`).
Verdict: **NOT OK as edited.** One more must-fix, on top of the attribution must-fix.

## What I checked

- `roadmap.md` is now `da8c8c9a…` (288 lines), and `STATES.md` is still `2826fa6e…`.
- Diffed against the EA original (`roadmap.md.ea-dc42c5e3`), the only change is L95 (row 15), as CoS said.

## Must-fix 2: id clash. Rename the splash step; don't rewrite row 15

"35a", "35b" and "35c" are the cozy joint-map ids already in use. Row 12 is Items (35a), row 15 is Gather (35b) and row 18 is Shops (35c). "35b" as gather is also cited outside the roadmap:

- `handoff/change-notices/CN-027-tool-swing-format.md` L49 (ACCEPTED): "registered in `src/rules` (TSa / 35b / C2a)".
- `behaviour-library/behaviours.json` L36308 and L36319 on main `664f8303`.
- `behaviour-library/gaps.md` L757: "cozy 35a/35b/C2a/C8a".

Taking "(35b)" off row 15 cuts the roadmap's only link from those cites to the gather step. It also leaves the splash using an id that an accepted CN uses for something else. The new text "before step 15, since step 15 uses its bindings" also sits inside row 15 itself, so it now points at its own row.

Fix:

- Restore row 15 to the original text (`dc42c5e3` L95).
- Give the boot splash an id that isn't a cozy id: EA's pick, checked unused with `git grep -w`.
- Use the same id in the roadmap revision line, the new row, row 36's depends-on, and STATES §1.0 (heading and v1.2 status line).
