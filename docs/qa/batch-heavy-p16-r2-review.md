# QA review: Heavy-fix restack onto main 3ca06e6d (P1-6 r2 fold)
QA & Build Guard, 2026-11-17 (Europe/London, GMT). One review. Gates one at a time after a clear `pgrep`. GitHub and Drive were read-only. New file.

## Verdicts
- **Chain:** linear on `3ca06e6d` (tree `869fa698`, 957/0). E7 `915b1991` green **973/0**. P1-6 r2 `5e22ea60` gates **981/0 PASS** (floor 981, main `915b1991`), law PASS, stress SAME. E7p `ab4b87e8` green **988/0**. P1-7 `5fd7e1fd` green **993/0**. P1-8 `ad0cda10` green **997/0**. Tip P1-9 `8f1136f6` gates **1001/0 PASS** (floor 1001, main `ad0cda10`), law PASS, stress SAME.
- **E7 r2 `915b1991` (tree `1d736f13`, cap 376): OK TO SEND.** 372 lines. Parent-diff patch-id `cf3dad21` is identical to the approved restack `19b3d765`. The E7 step file on main is unchanged (still says authoring floor 971); STATUS in this list moves it to 973. "at least 971" still passes at 973.
- **P1-6 r2 `5e22ea60` (tree `5a686ab6`): OK TO SEND.** 499 lines (cap 500; size reason in the kit: six Heavy fixes folded). Heavy plants **6/6**. The `HIT_REFUSED_REASONS` / `HitRefusedReason` split (six D7 reasons; type adds `noShotRow`) is documented. Mid-line still-hits is tested (H1+H6). `wipeRule` callers (`battle.test.ts`, `bot-p15.test.ts`, P1-7 `SIDES`) all pass the player first. New id lookups use `Object.hasOwn` or a Map.
- **E7p r3+pin `ab4b87e8` (tree `f9abf035`): OK TO SEND.** 315 lines (cap 320). Pin patch-id `968e9f77` is identical to `e816e22d`. On this base the proto only adds the `readEffect` barrel line (P1-4 `readUnit` / `readSetup` already present).
- **P1-7 r2 `5fd7e1fd` (tree `21ccf3e4`): OK TO SEND.** 447 lines (cap 500; size reason: door rewritten on `noTarget` + aims from `BattleTarget.id`). QA plants **4/4** (empty-tile `noTarget` drop, `SIDES` reversed, spell effect dropped, `spellRef` via `in`).
- **P1-8 `ad0cda10` (tree `7e4e10ac`): OK TO SEND.** 162 lines. Patch-id `d6a391c4` is identical to approved `746df26d` / `0f5c24e5`.
- **P1-9 `8f1136f6` (tree `5be0eb63`): OK TO SEND.** 255 lines. Patch-id `f64ae1cc` is identical to approved `ea4a498b`; the P1-9 blobs match.
- **Push list: OK TO SEND.** `/workspace/share/heavy-fix-p16/push-sha256.txt` sha256 `34feab5a2a220cf59e4b095738c0f77ffa3cf4d9aa8e0275d45df3605a13291c`, 27/27 (4 new, 11 modified, 12 identical to `3ca06e6d`), every srcdir file matches, paths only under `docs/` and `handoff/`. Kit docs equal pastes from `## Goal`. Shipped tests are byte-identical to the tips. Trial apply on `3ca06e6d` (`/tmp/qa-heavy-trial`) is docs/handoff only and stays **957/0**, tsc 0, lint 0.
- **P1-4 proto-key pin change: ACCEPT.** `battle-qa-p14.test.ts` now expects `noShotRow` and HP unchanged, because `armed()` carries an explicit archer row. The own-key probe is still exercised (`constructor` / `__proto__` / `toString` must not throw). Plant X4 (drop `hasOwn` on the abilities lookup) is **caught**. Not weakened.

## Flags (not must-fixes)
- P1-6 Do not touch still says "pin files" while Files/Tests/Gates require the updated `battle-qa-p14.test.ts`. Unlike the E7 presets trap, Gates demand the kit copy, so a builder following Tests/Gates is fine. Wording leftover.
- The E7 step file on main still says floor 971; refresh it if that kit is re-issued (STATUS already 973).
- QA extras: damage `Infinity` is already rejected by `whole()`, but no shipped test names it (X1 plant missed). An own `__proto__` key in the abilities/reach table is accepted; `abilities[key] = rows` can pollute the copy's prototype. Existing tests do not catch it. Should-fix (`Object.create(null)` or `defineProperty`), not a claimed-fix miss.

Evidence: `docs/qa/qa-runs/batch-heavy/`. No must-fixes. No pin.
