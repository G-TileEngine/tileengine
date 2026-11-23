# QA review: step 8 guide r2 (autosave at links, split 8a then 8b)

QA & Build Guard, 2026-11-23 (GMT). Guide `docs/maker/steps/step-08-autosave-links.md` r2 (sha256 e77e0d7b…, 242 lines, copy in `/workspace/share/s8/`), trial `s8-trial.patch` (bd1db7f7), audit `s8-audit.mjs` (8bfef76b), DSK staged CN `data/staging/cn-session/` (diff 74fb9ff4, result 439f403d). Base e801c78d. Main is now 29f972f2, docs only over the base, so the code is the same.

## Verdict: NOT OK. One guide rework round (r3) with 5 must-fixes and 3 nits.

The trial reproduces exactly and the split is right. The must-fixes are about the save path being silent or overwriting a file it could not read, which D28 and Law 12 forbid.

## Reproduced (trial applied to e801c78d, real `npm ci`)

- core-types after the patch is 439f403d, the DSK staged result.
- Whole step: `npm run green` 1123 pass, 0 fail. depcruise clean. check:law OK. `tsc` shows only the 3 base errors.
- s8 smoke `handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810`: 8/8 at 390 and 360, SMOKE PASS (16 ok).
- S0 touch smoke (d528795e): 7/7 at both widths, TOUCH SMOKE PASS (14 ok).
- Export audit `s8-audit.mjs`: AUDIT PASS.
- Count as one step: 31 files, 330 +, 71 −, 401. Every Build row matches its numstat.
- 8a alone (page.ts and readout.ts back to base, test 6 and its `readout` import removed): `npm run green` **1122/0**, tsc 3 base errors, count **373** (29 files, 309 +, 64 −). See nit N1.
- Law: no new rAF, timer or loop. No game words in src or play-stage. No edits to src/core, data, behaviour-library, painter-proto or the ui-shell. The smoke uses waitForFunction only. The D28 points match the DSK rulings L76.
- Choice 2 (sessionVersion read in src/project): **OK**. Version reading stays with the reader, so the maker never names the field, which fits the one-parser rule (L12, L16).

## Must-fix (r3)

1. **A read error is not "no save" (Law 12, D28 point 2).** `tools/maker/session.ts` L12 wraps `store.read` in `catch { return null; }`. The store already returns null for a missing file (`tools/effect-designer/store.ts` L13), so this catch only hides real errors, and then `writeAutosave` (L20–21) overwrites the file it could not read.
   Repro (trial applied in a worktree; script `/tmp/q-s8-repro.ts` imports from `/workspace/q-s8`): put a formatVersion 2 session save in the slot of a memoryStore and make `read` throw for that path. `writeAutosave` returns `ok: true` and the v2 file is gone.
   Fix: no catch around the read. A read that throws writes nothing and reaches the banner (fix 2). Test 3 adds this case: the slot is left byte for byte.
2. **Never silent (Must NOT "no silent save failure", Law 12).**
   (a) `tools/maker/home.ts` L59 runs `void autosave(link, party)`, so a rejection is dropped and nothing shows. `commitWrites` throws at store.ts L22, and so will the read after fix 1. Rules 4 must route the rejection to `state.banner` too.
   (b) `openId` (home.ts L49) sets `resume` only when the read is ok and says nothing when the slot is refused or the read throws. Continue then vanishes with no word until the next autosave link. On open, a refused or throwing slot must set the banner with the same "can't be read (<code>). It is kept." wording, and the project must still open.
3. **Never write what the reader refuses.** `writeAutosave` writes any party, but `readSession` refuses one with empty `members` (or a non-integer value). After one such write, every later autosave is refused, and there is no Start fresh until the load menu, so one bad write locks the slot for good (the Risks single point of failure).
   Repro (same script): `writeAutosave` with `members: []` returns ok:true. `readAutosave` then gives invalidValue, and the next good `writeAutosave` returns ok:false "Autosave skipped: the saved game can't be read (invalidValue). It is kept."
   Fix: `writeAutosave` checks the new doc with `readSession` before writing and refuses with a banner if it fails. The party read gets no defaults: `match.ts` L124 `play.world.rules?.state().units ?? []` throws when rules are absent (play-stage docs always set rules, project.ts L79), and so does partyOf's `hp.get(u.id) ?? 0` (party.ts L10) for a living unit with no hp. Test 3 adds the empty-party case.
4. **The split handbacks collide.** Both parts commit `handback/step-08-autosave-links/r<N>/HANDBACK.md`, and the smoke shots go to the same folder. That means 8b r1 lands on 8a r1's merged file. Earlier splits each had their own folder (`handback/step-04a-stage-paint`, `step-04b-stage-place`, `step-06a-win-rules` … `step-06d-baseline-page`).
   Fix: use folders `handback/step-08a-autosave-links/` and `handback/step-08b-stair-baseline/` (matching the branches) and point the smoke's shot folder at 8a's. Give each part its own Done when, § Green and § Smoke:
   - 8a: the 8 named ✔ plus step 7's six, s8 16 ok, S0 14 ok, audit, 4 shots, floor 1122.
   - 8b: test 6 ✔, floor 8a + 1, the smokes it runs, and the phone check after 8b merges.
5. **SaveChains: make the `"session-save"` key required (choice 1, NOT OK as optional).** A required key removes the `chains[kind] ?? {}` fallback in `migrateSave` and the test's `SAVE_MIGRATIONS["session-save"] ?? {}`, and a chains value that forgets a kind then fails to compile instead of migrating nothing. The cost is about +2 lines in the test fixtures. Update the Must NOT, the trusted-saves row and the caps.

## Nits (fix with r3)

- N1. 8a/8b rows: test 6 is 8 lines with its `readout` import (test L14), not 7. So 8a's test row is 98 and 8a is 373, and 8b is 28, sitting exactly at its test-6 cap of 8. Update the Build rows and the Split numbers (or the cap).
- N2. Read first 4: the migrations index is 14 lines, so "L1–15" should be L1–14.
- N3. Carries (guide L219): "rebuild 07 L255" should be L256. Read first 11: "L246–255" should be L246–257.

## Not blocking

- Autosaves are fire-and-forget beside the next stage, so two quick links can overlap two writes. Running them through the maker's `gate` would serialize them.
- `arriveIn` passes `fromId ?? ""` into `arrival` (project.ts L103 area). It is internal only and never reaches an event, but letting null through would drop the sentinel.
- Resume notes are computed at `openId`'s rev, so after later edits in the same session a Continue can miss the "project changed" note. Refs still settle against the live files.
- The `startOf(...) ?? stages[0] ?? ""` cast. Fine while stages is non-empty, but say so in the Rules.
- The CN diff lives only on the box (`data/staging/cn-session/`), which is the step 7 precedent. DSK lands it with the 8a merge.
- `sides?.loadout ?? "player"` matches the base (placements.ts L23).
- Each part gets its own handback review and postmerge.

## r3 recheck scope

Only the fixed items: the 5 must-fixes, N1–N3, the new test cases in test 3, the counts and caps after the changes, and green at 1122 (8a) and 1123 (total) if the trial is refreshed.
