# Hand-back step-19-pick-hardening r1
Step file: handoff/steps/step-19-pick-hardening.md
Base commit: 7a0de0c0ec8d8b7e2710b7dd799169fe6d8deb45     Head commit: dbf871ea2e3317054e9f0aa1a2a5b4464cd4da31     Branch: step/step-19-pick-hardening-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/rules/levels/levels.ts
M	src/sim/actions.ts
M	src/sim/chaos.ts
M	src/sim/exploit.ts
M	src/sim/types.ts
M	tests/rules/levels.test.ts
M	tests/sim/bot.test.ts
A	tests/sim/exploit-levels.test.ts
M	tests/sim/exploit.test.ts
M	tests/sim/levels.test.ts

## Green
npm test: 472/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- The one-id rule sits in `apply`, because a log read from JSON never passes the door. `submit` refuses an `unlock` whose `effects` is missing, not an array, or holds a non-string, and it does that after the disposed return and before `log.append`, so `packAction` cannot throw. A timed unlock is checked again when it lands. The merged `effects[0] ?? ""` read is gone: `[]`, `[""]` and two ids are logged, then `unlockFailed`, and `choose` is never asked for `""`.
- A pool entry `""` throws the step-18 `RangeError("createLevels: bad rules or pools")`. It is refused, not dropped and not clamped. `apply` also refuses `""` by name, so neither guard alone is the whole check.
- A malformed `effects` never reaches the log. `apply` reads `effects` again into a copy because a timed unlock can be changed after `submit` and before the clock fires it.
- `createLevels` reads `setup.rules` and `setup.pools` once, copies `bar`, `thresholds`, `offerLevels`, `offerSize`, `xp.move` and each pool, freezes that copy, and checks only the copy. `levels.rules` is that copy. A pool behind a getter is read once. `exploitWire` reads `stream` and each weight once into a frozen mix and draws only from that. `EXPLOIT_KINDS` and `CHAOS_CHECKS` (the array and each entry) are frozen. `chaos-gen.ts` still reads its mix live; that file is do-not-touch.
- `pick` is last in `ExploitKind` and `EXPLOIT_KINDS`. `mixOf` gives it weight 0, and `Rng.weighted` skips a weight that is not above zero, so the kind draw stays one `next()`. The sixteen base lines did not move: chaos 3120/0 and 5542/0; chaos-gen 1730/278 and 3154/563; exploit docs 581/1419 and 607/1393; exploit 1604/309, 1617/367, 2043/480 and 2299/592; the six levels histories; `npm run sim` 48/2 `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and 22/28 `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- `(e)1` reads the seat's pending offer from `view.before.levels`. The pick clears the offer, so `after` would be null and a fair unlock would look illegal. A fair unlock is quiet. Anything else on an unlock is `{ key: "levels", expected: that offer or null, actual: the action }`. Every other action stays on the old move check.
- `(a)9` compares `levels` with `JSON.stringify` only after the existing units, occupancy, `logSeq` and phases checks, and only for a refused step or an accepted step with no action. A step that has an action is unchanged. With levelling off both sides are missing, so they compare equal and the base lines stay.
- After the shared draws, a `pick` does `at = r.pick(PICK_AT)`, `who = r.pick([own, foeId, "", "ghost#9", "__proto__"])`, then one `next()` and sends the text once or twice. `who` goes through `JSON.stringify`. `at` is the raw index text, and `""` omits the index key. Diff is 207 insertions and 20 deletions (227 changed lines) on the 10 named files, under 400. No Change Notice. `main` was not committed to. The branch starts at `7a0de0c`, not at the kit commit. This chat uploads `step-19-pick-hardening-r1-chatB.bundle` and `HAND-BACK-step-19-pick-hardening-r1-chatB.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Seats in `runTicks`, and retiring the action hook, need the tick phase `play.running` and an M6 Change Notice. That step needs a CEO answer first. What an unlocked ability does is still not built.

## Kit files used
- handoff/steps/step-19-pick-hardening.md (user-supplied sha256; not in this tree) 6309fe0d27b383b0efbe375f0317e8554b3344663c9cd87214550f75901711ff
- BUILD_GUIDE.md (base 7a0de0c; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base 7a0de0c) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
