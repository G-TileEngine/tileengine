# QA review: step 8b guide r1 (stair phone check, no silent party drop)

Kit: guide /workspace/share/s8b/step-08b-stair-baseline.md (sha256 3ad8919d, 112 lines), paste step-08b-paste.md (62a6a533), trial patch s8b-trial.patch (177f370e). Base main 10ca0b0a.

Verdict: **NOT OK, one text must-fix (attribution).** The trial, the rules and the numbers all check out.

## Must-fix

1. **The kit says the party-drop ruling came from the CEO, but it came from EA.** Guide L3 says "It adds the CEO's ruling on QA's 8a carry", L22 says "(CEO ruling on QA's 8a carry, repro B)" and L45 says "(CEO ruling)". Paste L7 says "(2) the CEO ruling". EA's own handover says "My ruling on your repro B carry", and I can find no CEO message on it. Change all four to "EA ruling". If the CEO did rule on it, cite where he did instead. Then re-hash the guide and update the guide sha in paste L3.

## What I checked (trial patch in a fresh worktree at 10ca0b0a, npm ci)

- The patch applies cleanly: 8 files, +63/-26 = 89, and every file is within its Build-table cap (links 6/8, project 4/5, load 2/2, match 6/8, hud 7/9, page 15/18, readout 5/6, test 44/50).
- `npm run green` exits 0 with 1125 pass and 0 fail; tests 6, 10 and 11 pass. tsc shows the 3 base errors only.
- The s8 smoke (sha 0de37442, with the 8b folder argument) passes with 16 ok; S0 passes (TOUCH SMOKE PASS); the export audit passes.
- The rules match the trial code. The `inside` flood defaults to `free`, so 8a's behaviour and test 2 are unchanged. arriveIn passes `grid.inBounds`, so the flood is bounded by the map's cells (Law 13), and a null grid floods nothing. `bench` takes the members past `next.length`. `party()` appends benched members not already on the board, with their carried hp. `notPlaced` is reused, with no new code and no save-shape change.
- One clock: page.ts still has its 2 host-rAF lines and nothing new; the only setTimeout in the touched files (hud L25) was already in the base.
- The note row is an absolute div inside #hud, which has `pointer-events:none`, so it never blocks a tap on the board or a 48 px button. The `#top` rule is untouched for p19.
- The test file changes only the 7 joined import lines, which become 18 lines plus the readout import. Each line now holds one import, and the existing tests are unedited.
- The cites I spot-checked on 10ca0b0a are right: links L15, project L104/L107, placements L25, match L122, grid L49/L89, world L58, baseline-page test L11, QA r1 L73, baseline-06c-phones L31 (sha 37b95e53, whose rules match the guide's Done-when phone gate).

## Non-blocking notes

- A spilled member can land in a pocket that is walled off (test 10's 5,4) and cannot reach the rest of the stage. That is what the ruling asks for, and the note on rejoining at the next link covers it. I'm flagging it for the stair phone check, not for the build.

Recheck: I read only L3, L22, L45, paste L3/L7, and the new shas.
