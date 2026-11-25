# Step 10b r2 + 10c r2 guide review (one batch)

Verdict: **10b r2 OK TO SEND. 10c r2 OK TO SEND.** No must-fixes. This supersedes `step-10c-guide-review.md` (r1).

## Inputs (sha256 verified)
- 10b: step-10b-effect-data.md 8a5ecad2… (112 lines), step-10b-paste.md 94cf0297…, s10b-trial.patch 7c5d05d1…
- 10c: step-10c-effect-editor.md 5702669d… (110 lines), step-10c-paste.md 6035fe42…, s10c-trial.patch 98e4e124…
- Base: main 0673be7e (10a merged as c3e056ff). Main is now a14cbc1a, which only adds docs on top, so the Base still holds. Both patches apply cleanly, in order.

## 10b r2 trial (on 0673be7e)
- Count: 11 files, +122 / -18 = 140 (the hard gate is 400).
- Green: exit 0, 1152/0 (the floor is 1152). tsc shows the 3 base errors.
- Smokes: all 19 pass at their expected counts (s10b 8 ok). Audit PASS (133/147/146).
- DSK r42 order is in `warns`: none, then an own key of `effects`, then a bare id from the slice's `effect` presets (a leading `builtin:effect/` is stripped first), else `unknownRef` at `#/answers/effect/value`. Nothing is rewritten.
- The play path maps only loaded effect ids (`pickFx` uses `Object.hasOwn(store.effects, v)`), so a built-in runs stock. That matches the guide's scope (L28 and L31: the library is 10d).
- Mutation: with `!builtins.has(bare)` removed, tests 5 and 6 fail and nothing else does.
- r1 nits: both fixed. L106 marks the baseline-08b republish done (6d8b21b4), and s10b step 4 is the stock-drawing check, with the unknownRef row left to test 2.

## 10c r2 trial (on 0673be7e + 10b r2)
- Count: 7 files, +242 / -12 = 254.
- Green: exit 0, 1157/0 (10b count + 5). tsc shows the 3 base errors.
- Smokes: all 20 pass (s10c 8 ok, s8c 8 ok in my run). Audit PASS.
- The only change from r1 is that `effectNotRule` now uses brokenRef's pointer (for example `#/rules/0`, `#/setupIds/2`, `#/neutrals/2/setupIds/1`), re-pinned in test 4. Also, `a:fx:` writes only `none` or an id that is in `effectRows`; anything else returns `{ keep: true }`, and test 5 asserts that.
- Mutations: cutting the pointer back to the doc path fails test 4 only. Removing the `a:fx:` check fails test 5 only.
- My r1 law checks still hold: no empty catch, one-deep undo, `gone` limited to `.json` files in a tree that parsed, the existing touch classes, and built-ins left to 10d.

## Attribution
The r42 order is labelled as a DSK ruling to EA, and 10c Q4 as an EA ruling. The CEO appears only as the 2026-11-25 12:57 go (via CoS) and as the person who must type the OK for any republish. No one else's choice is labelled as a CEO ruling.

## Carry
s8c failed once in EA's full 10c run (steps 1–3 at 390, "no hero"), then passed 3 of 3 solo reruns, and it passed in both of my full runs. If the builder's handback shows it again, it should name the run, and CoS should track it as a flaky smoke. It is not a guide fault.
