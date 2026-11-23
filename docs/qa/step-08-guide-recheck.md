# QA recheck: step 8 guide r3

QA & Build Guard, 2026-11-23 (GMT). Guide r3 `docs/maker/steps/step-08-autosave-links.md` (sha256 fd150a30…, 247 lines). Trials: `s8-trial.patch` (8a + 8b, bd04ed65…) and `s8a-trial.patch` (8a only, 849962b4…). Audit `s8-audit.mjs` (8bfef76b). Base e801c78d; main is 29f972f2, docs only. This rechecks the items in `step-08-guide-review.md` (1967c47e) only.

## Verdict: NOT OK, on one line only (Must NOT L195). Everything else is OK.

L195 says "No default (`?? []`, `?? 0`) in the party read", but the trial's party read still has one: `tools/play-stage/match.ts` L124 `play.world.levels?.state().bars ?? []`. Its behaviour is right: `world.levels` is `Levels | null` (`src/sim/types.ts` L50), and a project without levels has no bar. But a builder who copies the trial breaks the Must NOT as written, so the handback review would have to rule on it.
Fix, text only so the trial and counts don't change: L195 names the case, for example "No default (`?? []`, `?? 0`) for hp or rules in the party read; an absent `levels` (`null`) is no bar." For r4 I check only that the diff against r3 is that line (and the header).

## Must-fixes from the review

1. Read error is not "no save": OK. session.ts L14 has no catch, so a missing file is null and a throwing read rejects. Repro: a v2 file in the slot plus a store `read` that throws makes `writeAutosave` reject, and the file stays byte for byte. Test 3 covers it.
2. Nothing silent: OK. home.ts L59 has `autosave(...).catch(...)` going to `state.banner`. `openId` (L49) shows a refused or throwing slot through `keptLine`, and the project still opens.
3. Never write what the reader refuses: OK. `writeAutosave` checks the doc with `readSession` first. Repro: `members: []` and hp 1.5 each return ok:false and write nothing, and the next good write is ok. `partyOf` throws `partyOf: no hp`, and `party()` throws without rules (test 1). The L195 wording above is the only gap.
4. Separate handbacks: OK. The handback folders are `handback/step-08a-autosave-links/` and `handback/step-08b-stair-baseline/`, and the smoke's optional part argument works: 8a's shots land in 8a's folder, and `… r1 step-08b-stair-baseline` puts them in 8b's. Done when sections are split at L198 and L204.
5. SaveChains key required: OK. `migrateSave` reads `chains[kind]` with no fallback and the test has no `?? {}`. trusted-saves is 5/5 lines and the index is 4/3.
- Nits: OK. Test 6 is 8 lines (cap 10), L53 cites L1–14, L72 cites L246–257, L224 cites L256.

## Reproduced (fresh worktrees of e801c78d, real `npm ci`)

- 8a alone: green 1122/0, the 8 named ✔ lines, tsc only the 3 base errors (home.ts L89 ×2, effect-designer page.ts ×1), count 383 (29 files, 317 +, 66 −). s8 smoke 16 ok, SMOKE PASS. S0 (d528795e) 14 ok, TOUCH SMOKE PASS. AUDIT PASS.
- 8a + 8b: green 1123/0, depcruise clean (176 / 499), check:state and check:law OK, count 411 (31 files, 338 +, 73 −). The 8b delta is only `page.ts`, `readout.ts` and test 6 (28). s8 smoke 16 ok, S0 14 ok, AUDIT PASS.
- core-types is 439f403d in both. Every Build row matches its numstat: 8a 383 with caps 398, and 8b 28 with caps 34.

## Not blocking

- On success, `autosave()` reads the slot again. If that read throws, the banner says "Autosave skipped" even though the write landed. Only the wording is wrong.
- An autosave banner set during Test shows when the player returns to the maker, not in play.
- `noteLine` prints `dropped ${n.detail ?? ""}`. This is display text only.
- The earlier non-blockers stand: no `gate` serialization of autosaves, the internal `fromId ?? ""` into `arrival`, resume notes at `openId`'s rev, and the `startOf(...) ?? stages[0] ?? ""` cast.
