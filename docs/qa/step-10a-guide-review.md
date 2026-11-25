# Step 10a guide review (carries): OK TO SEND, with 2 small wording edits

Guide /workspace/share/s10/step-10a-carries.md r1 (sha256 1cb9e5ba, 115 lines). Paste step-10a-paste.md (9ec00ffc, 11 lines). Trial patch s10a-trial.patch (609769ef, 324 lines). Base ea3b08f4.

## Re-run by QA (fresh worktree at ea3b08f4 with the trial patch applied)
- The patch applies cleanly: 18 files, +77 -25 = 102. Every file is within its Build-table cap.
- green: 1146/1146, 0 fail. tools tsc: only the 3 base errors.
- Smokes solo, 18/18 PASS: S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6. AUDIT PASS.
- Mutations: the base save.ts, store.ts, board.ts and art.ts each fail carries-10a. art.ts fails at load, because uploadBytes is missing. The base project.ts makes no difference, as the guide says. Removing the s4c placement line fails step 5 at 390 and 360.
- D22: SAVE.id is used only in saveAndUse's fresh-doc check (save.ts L35), so saved setup_ docs still save under their own id and file. play-stage-p18 (the saved setup_ effect, matched by exact id) stays unedited and green.
- Level-start tidy: the badStart guard (levels.ts L37) already checks every field the old loop filtered: id, xp, level, banked, offer as strings or null, and abilities as strings. The cast is safe and behaviour doesn't change.
- s4c fix matches my triage. Attribution is clean: the title change is an EA ruling, and D22 is DSK's.

## Edits before the go-line (wording only, no recount)
1. Guide L113: "publish only on the CEO's typed OK via CoS" should say the CEO's own typed OK in QA's chat, naming the commit. CoS verifies it there. A relayed OK doesn't count.
2. s3 smoke is flaky, and was before this step. Its step 9 failed once in 5 runs at 360 on the trial: `{"text":""}`. touch-smoke.mjs L121 reads the sheet straight after Test with no wait, and L119 uses waitForTimeout(80), which breaks the smoke rule. Add one line to § Smoke telling the builder: if s3 step 9 misses, re-run it solo once, and don't edit s3 in 10a. Add s3 L119/L121 to the carries, to be fixed with a waitForFunction in the next step that may touch smokes.

## Carry (not 10a)
- The upload path has no byte cap. A PNG whose header says it fits still reads whole, however large the file is, for example from padding. This goes to DSK/UX with the memory-meter carry.
