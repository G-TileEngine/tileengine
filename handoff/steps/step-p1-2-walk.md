# step-p1-2-walk: Phase 1 P1-2 "Battle" merge-time record (foundation-plan-phased.md §3). The `world.rules` hook is live: `createBattle`, frozen D7 `HIT_REFUSED_REASONS`, unit-roster / damage-resolution / win-condition from BTF numbers, `snapshot.rules`, and an own-key `stats` lookup so a prototype-key unit id takes the base 9/1.

This is the merge-time record for P1-2 (same family as `handoff/steps/step-p1-1-walk.md`). The builder kit remains `handoff/steps/step-p1-2-battle.md` on main. EA writes, CoS pushes.

- **Merge:** `1775d83ad3eaa4f25b0ddc55403d9f62169cbcec` — Merge PR #63: P1-2 Battle (ChatA r2). Tree `ce99d97eeab6e3d3b019689aa7500a6a81b513f9`. Parents: `82326beb3dab3fa775b752bdfefa1b3bea23d5e3` (main before the merge) and `67b8887c643798531d923878d7140510b4c24cf1` (branch tip).
- **Tip of the merged branch:** `67b8887c643798531d923878d7140510b4c24cf1` (tree `3fc9f35f2ca2d9841ac3d9a7226e4549cbb9d889`, "P1-2: hand back r2").
- **Main after the QA docs commit:** `75df464243426061340d27372e1e97b485843ded` (tree `a3c1172eb324cc7297e9e8fcaf317b3a467a7db3`, parent = the merge). Adds only `docs/qa/step-p1-2-build.md` and `docs/qa/step-p1-2-build-r2.md`.
- **Test count:** **904/0** at both the merge and `75df4642` (882 on `82326beb` + 21 P1-2 tests + the constructor own-key pin). Author `G-TileEngine <G-TileEngine@users.noreply.github.com>`.
- **Updated:** 2026-11-17 04:56 London (GMT).

## What landed
- `SimInput.rules` / `snapshot.rules` (DSK D1) and the `world.rules` hook: every `ability` and `interact` goes through `createBattle`. Absent = off: those kinds stay `actionUnsupported`, snapshots as before.
- Frozen D7 list `HIT_REFUSED_REASONS`: `unknownActor`, `deadActor`, `notUnitAim`, `aimMissed`, `selfTarget`, `deadTarget`. A refused hit changes nothing.
- `unit-roster` (default 9/1, L3 per unit document, L5 scales HP only), `damage-resolution` (`hit_class`; L5 `difficulty.damage` warns `layerNotApplied` and plays as 1), `win-condition` (wipe / mutual wipe). BTF defaults in `BTF_BATTLE_DEFAULTS`.
- Own-key `stats` lookup (`Object.hasOwn`): a unit document id that is an `Object.prototype` key (`constructor`) takes base HP 9 and atk 1. Pin `tests/rules/battle-qa-build.test.ts` (commits `32dd1a7a`, `79e4f83e`) landed in ChatA r2.

## QA notes
- Kit reviews already on main: `docs/qa/step-p1-2-review.md` (sha256 `6cf7772ef2010ff2d181c3b69b4d13402fe58ea9ad80c53c92aa15383c166b7d`) and `docs/qa/step-p1-2-r2-review.md` (sha256 `7f0db06dea1f27510bd1e48434f7a76bfa409ffb7c5d483ba8f3cf7870e7278e`).
- Build reviews filed on main as `75df4642`: `docs/qa/step-p1-2-build.md` (sha256 `c0994b841f2fd8fdde689c90a306d1f40385260f42d1ed69090563ab4a98ad03`) and `docs/qa/step-p1-2-build-r2.md` (sha256 `667921d928fd82d02a0bc851724fa68f4f529878060e63240ce817409f530e72`). The r2 / build pin is the constructor own-key lookup above.
- `docs/foundation/STATUS.md` was not updated in the merge or the reviews commit; the same filing that adds this record marks P1-2 merged and files the P1-3..5 r2 kits and the ED-E7 r2 kit.

## Not in this record
Builder instructions, a new ChatA branch, or a change to `step-p1-2-battle.md`. Those stay as they were at merge.
