# QA re-check: camera panel row 11d (r2 and r3)

Reviewer: QA & Build Guard. Date: 2026-11-27. Follows `camera-panel-docs-review.md` (`1a066dcc…`).
Verdict: **r3 is OK.** That's `roadmap.md` `372c9988…` and `camera-panel.patch` `19d2829a…`. r2 (`cbd056f8…`) was not OK, because it still had the must-fix.

## Files

- On base `43b2968` (`664f8303` plus splash r4 `b24d4a67`), the r3 patch applies clean and the result is byte-identical to `roadmap.md`.
- The diff against r1 is row 11d only.
- `git grep -w` finds no `11d1` or `11d2` on main.

## UX's sheet cell (r2, kept in r3): OK

- A Camera button opens a bottom sheet over the live map.
- The sheet has the style pick (Fixed, Lock on follow, Dead zone, plus accepted new styles), then sliders for dead zone, ease and zoom, an edge pan toggle, and Save and Cancel.
- Zoom snaps to whole steps under effective pixelPerfect, which matches format L331.

## Must-fix (camera wiring): closed in r3

- The row now says play doesn't read `settings.camera` today, citing `read-project.ts` L54–55 and `camera-touch.ts`. `camera-touch.ts` is also added to the sources cell.
- 11d splits in two:
  - **11d1, camera wiring (no screen):** Test and the export read the five fields. It adds the dead-zone box and edge pan, `easeMs` replaces the fixed 180 ms, and the ease uses the rAF frame time, not a fixed 16 ms tick. Its guide also rules what "selected" means in walk mode.
  - **11d2, the camera sheet.** It depends on 11d1.
- Each half has an EA estimate under the 400-line gate, and its guide sizes it exactly.
- Attribution is unchanged and correct.

## Notes for the 11d1 guide (not blocking)

- Say what edge pan means on touch. It is a mouse idea, and the CEO tests on phones.
- Pin the frame-time ease with a test at two frame rates, 60 and 120 Hz, that reach the same position at the same elapsed time.
