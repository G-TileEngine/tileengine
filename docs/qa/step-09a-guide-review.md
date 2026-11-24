# QA guide review: step 09a art backgrounds (EA kit r1)

Verdict: **NOT OK, one must-fix (guide r2).** The trial passes on every gate.

Kit: guide `docs/maker/steps/step-09-art-backgrounds.md` (sha256 6affc6cf, 128 lines), paste `step-09-paste.md` (1d369af0, 11 lines), trial `s9-trial.patch` (792c369e). Base 053817f9.

## Trial, rerun by QA in a fresh worktree at 053817f9 with `npm ci`
- The patch applies cleanly. Green exit 0, **1132 pass / 0 fail**. tsc shows only the 3 base errors.
- Count `git add -N . && git diff --shortstat 053817f9 -- . ':!handback/**'`: 16 files +233/-22 = 255. Every per-file row matches the build table.
- No diff under src/core, src/sim, src/types, src/rules, data, fixtures, behaviour-library, painter-proto or ui-shell. No existing test is edited. No new rAF, timer or loop, and no `imageSmoothingEnabled`.
- s9 smoke on 8811: 8 ok, SMOKE PASS (390: 77,824 + 86,528 px, 0 blended; 360: 43,776 + 48,672, 0 blended). s8: SMOKE PASS. S0: TOUCH SMOKE PASS. s8-audit: AUDIT PASS.
- Test 7 against the base `session.ts` fails (6 pass, 1 fail), so the autosave race is real and Rules 7 closes it.
- The roadmap split rule (L70) is quoted correctly, and 9a is tested through project data only. The L40 "at the CEO's request" matches the stub on main (e095254).

## Must-fix (Law 12: no silent failure)
1. **Rules 4 (L49) and DSK Q2 (L126): a missing or undecodable background file is dropped silently.** In the trial `page.ts`, `art()` returning null makes the layer `null`, and a `createImageBitmap` rejection is swallowed by `Promise.allSettled`. Because Rules 5 has already set `bare`, the plain floor is undressed. So a map whose picture file is gone shows an empty floor with no word to the player or the maker. Repro: run s9 step 3, then delete `assets/asset_<sha16>.png` from OPFS and reopen. The board floor is blank, there is no message, and the driver's `failed` count stays 0.
   - r2 must keep the reader codes as they are (no new report code, which stays DSK's). It must surface the skip on the play stage in plain words, for example a line in the existing 8b `#note` row naming the file ("Background picture missing: assets/…png"), or a different visible route EA picks.
   - It must also say what the floor does when no layer decoded: dress it as before, or show the note.
   - Add a named test (or a smoke step) for the missing-file case. Adjust the caps and the floor to match.

## Non-blocking (note in the guide)
- **Law 13, bounded memory:** 9a decodes every layer at its full size into an OffscreenCanvas, with no pixel cap (overCap only warns). Only a hand-placed file can reach this before 9b, so it's fine for 9a. 9b's upload (Shrink to fit) must bound the pixel size. Please carry it into the 9b guide.
- `session.ts` `queue = run.catch(() => undefined)` is fine: the error still reaches the caller through `run`. Keep that sentence in Rules 7 so a builder doesn't "fix" it.
- Main has moved to 236ad423 (QA docs only). Name it in the go-line or keep 053817f9.
- The trial tests through `fixtures/demo.tileproj`. That is project data on disk, which fits roadmap L70.

## Rulings noted (not QA calls)
EA's rulings: the 9a/9b split; folding Rules 7 into this step; and the 8b bench rejoin, walled pocket and project.ts L102 as accepted behaviour (guide L112 says "user to confirm"). DSK still owes answers on Q1 and Q2, and UX on Q4.

r2 recheck: only the must-fix lines, the new test, caps, floor and count.
