# Step 10c guide review (effect editor), r1

Verdict: **OK TO SEND.** No must-fixes.

Inputs (sha256 verified): step-10c-effect-editor.md f4f065ed…, step-10c-paste.md d4a644c9…, s10c-trial.patch 17d408f8…. Trial applied on 31f4c0c4 + 10a + 10b.

## Results on the trial
- Size: 7 files, +242 / -12 = 254; every file is under its cap.
- Green: exit 0, 1155 pass / 0 fail (floor = 10b merge count + 5).
- tsc: the 3 base errors (the home.ts ones move to L89, as the guide says).
- Smokes: all 20 pass at their expected counts, s10b 8 ok and s10c 8 ok included. s10c uses waitForFunction only.
- Export audit: PASS (133/147/146).
- Mutations: reverting read-project fails test 4 only, and reverting ability-panel fails test 5 only, as the guide says.

## Law checks
- One clock: no new timers except the existing 6 s toast pattern.
- Law 12: no empty catch. Bad knob values, unknown keys and non-finite sliders return the host unchanged (no write). Read-only gives a visible banner.
- Law 13: undo holds one snapshot (`stack = [host.files]`).
- Deletion (`gone`): only `.json` paths missing from the next tree get removed. `bagOf` returns null (no save) unless every `.json` parses as an object, so a skipped doc can't be deleted by accident.
- Touch: uses the existing `btn` and `card` classes (44/48 px).
- Scope: library built-ins are left for 10d, as the guide says.

## Nits (non-blocking)
- `a:fx:<id>` stores whatever id the DOM sends, without checking it is in `effectRows`. That's harmless today because the DOM only offers listed rows.
- The menu's "they'll show None" wording for a plain Delete is right, because an unknown ref plays the stock effect.
