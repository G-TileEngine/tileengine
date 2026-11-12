# Hand-back step-18-card-free-levelling r1
Step file: handoff/steps/step-18-card-free-levelling.md
Base commit: 573ae0cd2d43b7c30613a1182f2ee53e09d51ab7     Head commit: a7fd6dafcce14486065d183a2431958e429e95e3     Branch: step/step-18-card-free-levelling-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/index.ts
A	src/btf-adapters/src/levels.ts
A	src/rules/levels/index.ts
A	src/rules/levels/levels.ts
A	src/rules/levels/types.ts
M	src/sim/actions.ts
M	src/sim/chaos.ts
M	src/sim/driver-phase.ts
M	src/sim/index.ts
M	src/sim/player.ts
M	src/sim/run.ts
M	src/sim/types.ts
M	src/sim/world.ts
A	tests/rules/levels.test.ts
M	tests/sim/bot.test.ts
M	tests/sim/gc.test.ts
A	tests/sim/levels.test.ts

## Green
npm test: 214/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- The mechanism lives in `src/rules/levels` (rules may import core; nothing imports sim). Core stays empty of mode behaviour, and sim only wires the world. `level.reached` and `level.unlocked` are mode events, added by declaration merging in `src/rules/levels/types.ts` (`declare module "../../types/core-types.ts"`). `core-types.ts` is untouched. `LEVEL_EVENTS` is registered only when `SimInput.levels` is set.
- A landed move is the only XP source: the engine has no attacks or kills yet, and a move is BTF's first listed source. XP is paid in `apply` after `moveTo` succeeds (`levels.gain(bar.id, bar.pool, world.levels.rules.xp.move)`), so a failed move pays nothing and replaying the log pays the same XP at the same tick. No other action pays XP.
- `ChooseAbility` is a door intent (`DoorIntent` in `src/sim/types.ts`), not a runtime gesture, so M7's five intents stay. An accepted pick submits an instant `unlock` whose `effects` carry the ability id, not the index, so the log reads on its own. It has no state-table event, and the driver lands a step only when both `action` and `event` are set, so a pick adds no phase and no tick. A logged unlock that is not in that bar's pending offer, or with levelling off, pushes the notice `unlockFailed` and changes nothing else. A missing `effects[0]` is passed as `""`, so `choose` returns false and the same notice is pushed.
- `bar` is read in one place, `barOf` (`rules.bar === "side" ?` once), plus the door's side check. Under `"side"` the side owns the bar, the offer, the pick and the unlock: the bar id and the pool key are the side id, any seat of that side picks, `unitId` is not read, and the logged actor is the side id. Under `"unit"` the bar id is the unit instance and the pool key is `unitId`. The rules tests use both bars; the side-bar test and the btf-side smoke cover `"side"`; the door, disposed, every-reject and btf-unit / quick-unit smokes cover `"unit"`.
- Off stays byte-identical: `createWorld` creates no `"levels"` rng and passes no registry, and the snapshot adds the `levels` key only when `world.levels !== null`. Checked by the ten base lines in this test run (chaos 3120/0 and 5542/0; chaos-gen 1730/278 and 3154/563; exploit docs 581/1419 and 607/1393; exploit 1604/309, 1617/367, 2043/480 and 2299/592) plus `npm run sim` (48/2 `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and 22/28 `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`).
- Draw order, as built: `pool = Object.hasOwn(pools, key) ? pools[key] : []` (an inherited key such as `constructor` is not a pool); candidates keep pool order and the first copy; if `cands.length <= offerSize` the offer is those candidates and the rng is not touched; otherwise exactly `offerSize` swaps, `j = i + rng.int(cands.length - i)`. An empty offer is not stored (`offer` stays null) but `level.reached` still carries `[]`. The rules test re-derives that shuffle on a fresh `"levels"` stream and pins seed 1 as `rally, charge, guard` after exactly three `next()` calls. `choose` itself does not draw; paying the old banked XP after the pick can open the next offer, which draws then. At the top level, leftover and banked XP are dropped.
- Diff is 331 insertions and 20 deletions (351 changed lines) on the 17 named files, under 400. No Change Notice. `main` was not committed to. The GC test also holds `clock.onRender(pin)` before dispose, next to `onTick`; the subscription after dispose was already there.
- `step-18-card-free-levelling-r1-chatB.bundle` and `HAND-BACK-step-18-card-free-levelling-r1-chatB.md` were already on Drive and this chat did not upload them, so they were left untouched. This chat uploads `step-18-card-free-levelling-r1-chatB2.bundle` and `HAND-BACK-step-18-card-free-levelling-r1-chatB2.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- What an unlocked ability does (the unit action menu, casting, the card-hand add-on, ahead/behind sheets at 2, 5 and 8, kill XP) is not built here. The same `unlock` action and the same thresholds are the seam.

## Kit files used
- handoff/steps/step-18-card-free-levelling.md (user-supplied sha256; not in this tree) e7087e6273506bcaed3fa9905bd75bc56c5b22252d2a97dd349dc2e321178be0
- BUILD_GUIDE.md (base 573ae0c; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base 573ae0c) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
