# QA kit review: F2a2a (menu kit) and F2a2b (land on map), r1 (2026-11-28)

Reviewer: QA & Build Guard. Kits under /workspace/share/f2a2/ (SHA256SUMS 1becc63a, 96 entries, all OK). EA's split (SPLIT.md 80b8f9fb) is EA's ruling; the plan row edit stays with UX.

## F2a2a: OK TO SEND
- Guide c8d29a83 (177), paste 8bb3b29e, kit SHA256SUMS 3913bad9, test 22bb52ea (copied verbatim, cmp OK), plants-f2a2a.py d38040f1.
- f2a2a-trial.patch b6c9007a with `git am` on ce848f57 gives tree 5687d21b (matches EA). Counted 129 lines (test 65, app.css 14, game-menu.ts 44, icons.ts 6).
- Green 1203 pass, 0 fail. tsc: only the 3 base errors. Plants 16/16. All 25 smokes PASS at 390 and 360 with main's counts (s0 and s3 via touch-smoke.mjs).
- Rule 8 clean. Law 12: `menuSet` throws on an unknown view. Six icons byte-equal to Ruling 2; eyebrow and grabber CSS match Ruling 1 and style-spec L73/L77. Guide cites (plan L71/L86/L87, style-spec L71–L77/L91–L93, step-f1 L207–L212, icons L18, app.css L74) and doc hashes all check.
- Non-blocker: `sectionSheet(name: MenuView)` also accepts "none", "menu" and "switch"; a narrower type would be better in a later touch.

## F2a2b: must-fixes (3)
- Patch 4ddaf96f on the F2a2a trial gives tree 9c04b6c8 (matches). Counted 356 lines. Green 1204/0, tsc base 3, plants 22/22, all 25 smokes PASS at 390 and 360. Guide 8dc6daac cites check.
1. **Law 12, a lost error.** Trial home.ts L128 (`travel`): when a link arrival fails during Test it runs `out(); state.problems = [got.error]; paint();`. After this step nothing renders `state.problems` (the project page was its only reader), and `backScreen` now always returns "stage". So the error is dropped on every path; before, it showed whenever Test was started from the project page. Fix: `state.banner = got.error` (one for one, no new statement), plus a test pin and a plant.
2. **Rule 8.** The existing dense `if (act.startsWith("stage:")) { … }` line gains a statement (`menuSet("none");`). Editing inside dense lines is fine only when it adds no statement. Put it on its own line.
3. **A mock difference not listed.** In EA's own f02 compare shot, the Effects row meta reads "0" where f02 shows "10 built-in". This isn't under Open points. Either list it for UX (as Open point 9) or match the mock.

Non-blockers (fix in this round if cheap, otherwise carry):
- `countIn("units/")` and `countIn("effects/")` count files in a folder. They don't use the lists the sheets draw (`effectRows` filters by behaviourId and id), so the ☰ counts can drift from the sheets.
- Continue in ☰ starts Test with the menu view still "menu", so Back from Test reopens the ☰ sheet. Consider closing the menu when Test starts.
- There's no test or plant for the "This game has no stages" missing screen, or for moving to the first stage when the current one is deleted.
- After fix 1, `state.problems` has no reader. Remove it in a later step.
- SPLIT.md names the plant scripts `plants-f2a2.py a` and `plants-f2a2.py`, but the shipped scripts are plants-f2a2a.py and plants-f2a2b.py. That's wording only (box history).
