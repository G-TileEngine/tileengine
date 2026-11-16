# Step P1 kit review (G3 light walls + G4b door gaps) — QA

Base `d867161c` · proto `refs/cmp/sp1-proto` = `8e9b17b8976a975ddd85585074d81ef1baf45200` (tree `2fa26097`, parent `d867161c`, noreply) · step `92fbe065` · paste `df5027bf` · plan `f2795ca0`.
Inputs copied to `docs/qa/qa-runs/step-p1/in/`; logs and plant scripts in `docs/qa/qa-runs/step-p1/out/`. No pushes; the only repo write is the new ref.

## Verdict: NOT OK — one must-fix (a one-line test change in a shipped file); the code itself is OK

**M1, a missed plant (Q2).** In `visibility.ts` `cut()`, drop the cell's own bit (`((w[y * cols + x] ?? 0) & b) | ` → ``), so only the neighbour's opposite bit counts. All 702 tests still pass. The one-sided case in `light-walls.test.ts` sets only the far cell's west bit (`8`), and every other wall is symmetric. A list with only the near cell's east bit would leak light and nothing catches it. EA's G2 plants the opposite half (own bit only), which is caught.
Fix: loop the one-sided check over both sides, `[[6, 8], [5, 2]]` (+2/−2 in the shipped file, so its sha changes). Diff in `out/q2-fix.diff` (sha `c8cea818`). With the fix, the proto passes 4/4, Q2 fails, and tsc is clean.

## Checks
1. `sha256sum -c` on the push list: OK on 3/3. Head and tree match. The shipped tests are byte-equal (`30197378`, `6f23cb22`).
2. Green 702/0 (0 cancelled, skipped or todo). tsc, lint, deps, state and law all exit 0. Sims are identical: fixed 48/2 `afc89d56`, weighted 22/28 `b8007292`. Smoke 20/21 are the same; only the heap line moved (+0.69 → +0.70 MiB). The pins and the do-not-touch diff are empty.
3. Rows (QA probes `post34/probes` on the proto, every section exits 0 in under 1 s):
   - 6 closed: S4 1e6/2e6 and X7 400k give `actionRefused`, and reload is ok.
   - 7 closed: X1 log stays 0.
   - 10 closed: `after(1e300)` and `after(2^53+2)` give RangeError and id 0.
   - 11 closed: C5 fires at ticks 1,1,2, ends at tick 2, and reports a RangeError; C6 tick 1.
   - 13 closed: X4/X5/X8 give the named refusal and `saveSnapshotPhasesInvalid`.
   - 14 closed as the brief requires: R4/X6 give `restore: the log is not plain data`, and the 1e9 liar no longer hangs.
4. Plants:
   - EA `sp1-plants.py`: **21/21** caught. On the base, all 6 door-gap tests fail and the light-walls file fails to load.
   - QA plants: **9/10**. Q1 wallsFrom ignores the grid, Q3 corner never blocked, Q4 cap `>=`, Q5 cap fixed at 16, Q6 cap only at submit (so `parseLog` accepts), Q8 wrong code for phases, Q9 step-in-tick still runs and Q10 INT_MAX refused are all caught by the shipped tests. Q7 (loadSave maps every restore error to the phases code) is caught only by the older `tamper reach (step 24)` test. **Q2 is missed → M1.**
5. Build law: no new clock or rAF, and the UNIT/TILE pipes are untouched. No scope creep (`log.ts` is outside the plan's list, as the step explains). Size is 201 = +179/−22 in 8 files, within 150–400.
   - Caps (changed lines): visibility 27/40, clock 29/40, run 25/40, log 2/4, actions 1/6, index 2/2, light.ts 0.
   - The paste has the §0.6 helpers rule and § Helpers & self-review.
6. Rulings:
   - `wallsFrom` as a host default, with absent walls byte-equal: agree (the BYTE test and G7 pin it). Until a host passes walls, light walls are off everywhere.
   - The effects cap reusing `limits.text`: agree. It lives in the shared `tooLong`, so the reader, `submit` and `parseLog` refuse the same actions (Q4–Q6).
   - `saveSnapshotPhasesInvalid` needs no format word: agree.
   - These can wait for D3 and are not musts:
     - S4: closed now.
     - Re-submitting getters: S7 logs 2 entries, in a consistent order.
     - Row-14 lying getters: `out/liar14.ts`. "tick then −5" gives a raw `RangeError: replayTicks: n must be an integer >= 0`, which is named but is not a restore text. NaN, 1e15 and action→null give `restore: snapshot does not match the log`. Nothing hangs, and only host-made logs can reach this, because `loadSave` goes through `parseLog`.
7. Drift: the paste matches the step on the step sha, rulings, file table, interfaces, acceptance and pins. The code matches the stated line counts (visibility 51→74, clock 139→146, actions 32→33, run 114→125).

## Nits
- N1: X3 still costs about +93 MB of transient heap, because `plainCopy` runs before the effects cap. Carry this.
- N2: Hostile S7 is not a real test (disposeFn is undefined); row 7 rests on `extra.ts` X1.
- N3: The step's Read-first and Acceptance point builders at `/workspace/scratch-ea/…` and QA's untracked `post34/probes`, which aren't on builder machines (as in 35g5a). Make that acceptance item QA-verified.
- N4: The brief says `render/{visibility,light}.ts`, but the kit changes `index.ts` and leaves `light.ts` alone. The step explains why, so this is fine.
- Carries: a C7 timer count cap (500k), the skip(MAX_SAFE) hang (G4 item 32), and lying getters in D3.

## r2 re-verify (2026-11-15, London): OK
`refs/cmp/sp1-proto-r2` = `a61498eebf8fd1ba2b27f11bd6ecde8fd529149d` (tree `afeeb6fe`, parent `8e9b17b8`, noreply, bundle `7315c662`).
- Push list `dc7f4b49`: 3/3 OK.
- The diff from r1 is only `light-walls.test.ts` (+2/−2), identical to q2-fix `c8cea818`; the file is `7fc41d97`.
- light-walls 4/4; the M1 plant now fails it; tsc 0; green 702/0. Other gates skipped (test-only diff).
- Step `d65a5522` and paste `1fd2cda2` cite `d65a5522` and `7fc41d97`.
- N1 is now a carry line. N3 is fixed: Read-first is this file only, and the probe item reads "(QA verifies, not the builder)". The scratch-ea path is left only in the step's "for QA" plants section.
- No other changes from r1. M1 is closed.
