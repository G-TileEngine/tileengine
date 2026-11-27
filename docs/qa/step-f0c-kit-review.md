# Step F0c kit review (CN-029 and the pools gate, EA r1)

**Verdict: NOT OK TO SEND. Kit rework r2.** The design is sound, but the kit's own acceptance fails on its trial, one play cap is missed, and the shipped test breaks the new Rule 8.

## What I checked

- Kit files in /workspace/share/f0c/ match SHA256SUMS (848c1aaf):
  - guide d0c75124 (158 lines)
  - shipped test 150c96d7 (98 lines)
  - plants-f0c.py 88ca5665 (27 lines)
  - paste 0a8db18e
  - trial patch c700c112
  - PUSH-LIST 99c8417b
- The trial patch applies with `git am` on b2cb571f and gives tree f9a7c15b, which matches the guide. The commit sha differs because `git am` sets a new committer date.
- The shipped test is byte-identical in the trial. core-types is 897d51db, byte-equal to DSK's staged copy, and the smoke pin says the same.
- The trial's numstat is 161 lines (+143/−18) in 11 files, which matches the Files table.
- Run at the trial:
  - green 1179 pass, 0 fail; tools tsc shows only the 3 base errors.
  - All 25 smokes PASS, with s11b on port 8840. (The kit left the smokes to the builder; I ran them on the trial.)
  - Export audit 136/150/150, PASS.
- Plants: plants-f0c.py caught 8 of 8. My extra plants: `.concat(more)` dropped is caught, and a `break` after the first refused stage is caught.

## Must fix in kit r2

1. **The acceptance grep fails on the trial, and one play cap is missed.**
   - `rg -n "picks: 0" tools/play-stage` finds `tools/play-stage/load.ts` L27, `stageLimits: { picks: 0, waveUnits: 0 }` in `docsToInput`.
   - That literal is the engine's own cap. project.ts passes it into the sim, and `src/sim/world.ts` L34–L36 reads the manifest, map and stage with it.
   - So Ruling 3's "one cap pair for play and the gate" isn't true yet. My plant widening L27 to picks 8 / waveUnits 16 passes every test.
   - Fix:
     - Add load.ts to Files so L27 reads PLAY_LIMITS (with its import). If StageLimits needs more than picks and waveUnits (world.ts L57 reads `notices`), shape it so the values still come from PLAY_LIMITS.
     - Update the caps and the total.
     - Add a test assertion and a plant for it.
2. **arriveIn's cap (project.ts L113) isn't pinned.** My plant widening it to picks 8 / waveUnits 16 passes every test. P3 covers L66 only. Fix: add an assertion that arriving into a weighted or waves stage fails the same way openProject does, and a plant for L113.
3. **The shipped test breaks Ruling 7.** L60 has `start: () => { started = true; }`, a brace body holding a statement on the line that opens the block. The guide's new Rule 8 forbids exactly that. Fix: `const start = mock.fn()`, assert `start.mock.callCount()` is 0, and drop `let started`. Re-hash the test and update the guide, paste and push list.
4. **Paste wording.** The tsc line names only "maker home.ts L92". Say the 3 base errors: effect-designer page.ts L101 and maker home.ts L92 twice, as the guide says.

## Design choices (EA asked)

- **Gate through `poolLines` as testGate's fourth argument, with the stage caps from read-project: OK.** Test and Build game call the same function. Once must-fix 1 lands, there is one source for the caps.
- **A gate text line, not a report row: OK.** It adds no format code, and `ok`, `readOnly` and the report stay unchanged, so no DSK ruling is needed.
- **Name the scope in the guide.** The gate refuses the whole project when any stage has such a pool, but openProject only refuses the stage it opens. Project-wide is the right choice, because a stage link can reach any stage and arriveIn then throws mid-game. But "exactly what play refuses" holds per stage, so put that one line in Ruling 4 and the Decisions note.
- Rule 8 is worded as I suggested in the 11c1 r2 review. My eight 11c1 carries stay with 11c2, as listed. The S21 repaint timing is correctly described as the CEO's phone check, relayed through CoS.
- The UX line is still open (Open questions 1). The go waits for UX's confirmation.

## r2 re-check

I'll hash-check the changed files, apply the new trial, run green and the plants (including the new ones and my load.ts and arriveIn plants), and repeat the grep. Smokes only if code outside the test changes beyond load.ts.
