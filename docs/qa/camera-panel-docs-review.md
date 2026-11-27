# QA docs-only review: live camera panel roadmap row 11d

Reviewer: QA & Build Guard. Date: 2026-11-27.
Verdict: **NOT OK. One must-fix: the row's claims about the shipped camera don't match the code.**

## Files

- `/workspace/share/camera-panel/roadmap.md`: `12e4dd1b…`, 289 lines.
- `camera-panel.patch`: `fd9935a5…`.
- Base: main `664f8303` plus the boot splash r4 patch `b24d4a67`.
- On that base, the patch applies clean and the result is byte-identical to `roadmap.md`. The diff is L3 (the r15h note) plus the new row 11d (L87). `git grep -w 11d` on main finds nothing.

## Checked and OK

- **Attribution matches the CEO's own words in the CoS chat.** At 14:46 he asked for a pick of "lock on follow", "dead zone" etc. while walking in Test, then a Save into the step 1 files. At 14:49 he approved CoS's settings-not-code suggestion ("Okay can go ahead with your suggestion too"). "His examples" is right, and everything else is tagged EA.
- **The cited fields exist.** `settings.camera` `follow`, `followDeadZone`, `easeMs`, `edgePan` and `zoom` are in project-format.md's settings table, with defaults `fixed` / 0.6 / 120 / false / 1.
- **Style mapping.** "Lock on follow" as `follow: "selected"` with `followDeadZone: 0`, and "dead zone" as `followDeadZone` above 0, fit those types.
- **Order.** The row sits after 11 and before 12, and depends on 3 and 11c.

## Must-fix: play doesn't read `settings.camera` today

The row says "the shipped values come first", that "exported games read the same settings", and that a pick "changes the live camera at once". On main `664f8303`, none of the five fields reach the camera:

- `src/project/load/read-project.ts` L54–55 reads only `camera.pixelPerfect` (for the info row).
- `tools/play-stage/camera-touch.ts` keeps its own camera. `follow` is a unit id set by a tap (L10). `tickCam` (L20–24) eases with a fixed **180 ms**, not `easeMs` (default 120). It has no dead zone and no edge pan. Zoom comes from `seatCam` and pinch, not `camera.zoom`.
- `src/runtime/render/camera.ts` has clamp, snap, ease and toDevice, but no follow or dead-zone logic.

So the "dead zone" style isn't a shipped behaviour yet. It is new runtime work, just like look-ahead and room snap, only without a format change.

**Fix:**

- Say in the row that play doesn't read `settings.camera` yet, and cite `camera-touch.ts` L20–24 next to `camera.ts`.
- Put the wiring in scope, as an 11d sub-step or an earlier row. Play has to read `follow`, `followDeadZone`, `easeMs`, `edgePan` and `zoom` (both Test and the exported game), and add the dead-zone box. That should be done before the panel can save anything that has an effect.
- Size it against the 400 gate in the guide.

## Notes for the 11d guide (not blocking)

- The fixed 180 ms (camera-touch.ts L19: "the banner-scale hold, not a hidden engine rule") and the `easeMs` default of 120 have to be reconciled. The CEO should see one number.
- A tap-to-follow unit (`follow` = id) versus `follow: "selected"`: the guide should say which unit "selected" means in walk mode.
- **Frame time.** `tools/play-stage/page.ts` L56 calls `tickCam(cam, 16, …)` with a fixed 16 ms, not the frame clock's real dt. On a 120 Hz phone (the Red Magic 9 Pro) the camera eases twice as fast as on 60 Hz. The guide should pass the real frame dt from the one rAF clock, with no `setTimeout` and no sim-clock reads.
