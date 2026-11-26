# Step 11a kit review (guide, paste, trial) — QA

**Verdict: NOT OK TO SEND yet. One must-fix in the guide and one gate before the go-line.** Everything else in the trial passes.

## Kit checked (sha256, in /workspace/share/s11/)
- Guide `step-11a-export-mvp.md` d240218069eb5432079acadf3ca001d8c64c0da5dd372d4379caf00145d00950 (120 lines; the `-r1` copy is byte-identical)
- Paste `step-11a-paste.md` fbdf3a4557f1a100d0806638365202b4b950d2d67673dea5ca3d1062dbb8765b (`-r1` identical)
- Trial `s11a-trial.patch` 4a034da36d5a89a64904a18896a37d817d18fab6bf6e9782b505c0fb0aad4794 (`-r1` identical)

## Trial run (QA, on e9cf8fbd, worktree /workspace/q-11a)
- Patch applies clean. Count 8 files, 362+ 4− = 366/400, which matches the guide. Every file is under its cap.
- `npm run green`: pass 1165, fail 0, which matches the floor.
- tsc: the 3 base errors, with home.ts now at L90.
- All 22 smokes PASS solo under /opt/google/chrome/chrome with the expected counts, and s11a gives 6 ok.
- s8-audit: 135 / 149 / 149, AUDIT PASS.
- The Build game button uses `.btn` (48 px minimum), which meets the touch rule.
- The paste's token line is only the placeholder `<PASTE TOKEN HERE>`. No token value appears in the paste, the guide or the trial.
- Helpers: guide L95 lists allsmoke.sh, mutate.sh and s8-audit.mjs, which covers every 11a helper in the kit.
- QA's own mutations, run on export-11a.test.ts:
  - Dropping the `.tmp` filter from `shipped` is caught (test 2 fails).
  - Dropping the U+2028/2029 escape is not caught. Node accepts U+2028 inside string literals, so this is a nit and needs no action.
  - Dropping the `emptyBoard` refusal from buildGame is not caught by any 11a test. This is a carry (see below).

## Must-fix (guide, before the go-line)
1. **A failed save still exports the older copy.** This breaks Law 12, which bans silent fallbacks. `buildNow` in home.ts calls `if (state.dirty) await saveCurrent();` and then builds anyway. When the save fails, saveCurrent shows its line and returns, and Build then zips the older tree on disk and downloads it with no warning. Test does not do this: launchTest stops when the save fails. The guide should tell the builder to stop when the project is still dirty after the save, for example `if (state.dirty) return;` straight after the save. That is one line, and home.ts has room (20 of 22).

## Gate (not an EA code fix)
2. Guide L115 says DSK's Question 1 "should be answered before the go-line". That question asks whether project documents may ship in the export (format L1551 against roadmap L86). I can't find a DSK ruling on it on disk. Either DSK answers it, or the guide drops that line, before the go-line goes out.
3. The CEO quote "2026-11-24 18:03 London … Since step 11 is an export section. Can add the apk stuff there too." is labelled as relayed by CoS. I have no record of it, so CoS should confirm it is the CEO's own typed words. If CoS confirms, the label is fine.

## Carries (non-blocking; for the handback or a later step)
- No 11a test covers the `emptyBoard` refusal in buildGame. Test 4 has 3 lines left under its cap, so one assert there would pin it.
- In tools/maker/export.ts, a listed asset whose `readBlob` returns null is skipped without a word (copy() does the same). It should refuse with "Can't build: <name>".
- `playBase` does not check that `/maker/` is in the URL. Without it, the URL comes out wrong, and the build only fails later as "Can't build: build.json". The build.json shape is cast without a check.
- The `build` dispatch is appended to the existing joined `run()` line in home.ts. That follows the line's existing pattern, so it is not a new join.
