# Hand-back step-p1-4-line-shot r2
Step file: handoff/steps/step-p1-4-line-shot.md (sha256 c5947b0de34834947e16b1df10c998e474a7d1d360529b2352199809facd91c6)
Base commit: b7d4326781a909194853d486efb0025d61144ca6     Head commit: b8f0cbcd55b5be038427b6fc820f80c2633a8f21     Tree: 66193540bf8ec578d5de9bd9094ac1ee16136113     Branch: step/step-p1-4-line-shot-r2-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/btf-adapters/src/btf-defaults/spells.ts
M	src/btf-adapters/src/index.ts
M	src/project/read/index.ts
A	src/project/read/setups.ts
A	src/project/read/unit.ts
A	src/rules/battle/abilities.ts
M	src/rules/battle/battle.ts
M	src/rules/battle/damage.ts
M	src/rules/battle/index.ts
A	src/rules/battle/line-shot.ts
M	src/rules/behaviours/registry.ts
M	src/rules/behaviours/types.ts
M	src/rules/behaviours/xp-levels.ts
A	tests/parity/line-shot.parity.test.ts
A	tests/project/unit-setup.test.ts
A	tests/rules/battle-p14.test.ts
A	tests/rules/battle-qa-p14.test.ts
M	tests/rules/battle.test.ts
M	tests/rules/behaviours.test.ts

## Green
npm test: 948/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm run green: exit 0. npm test: 948 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 53031.429405. deps 143 modules / 455 deps. check:state OK (src). check:law OK (src).

## Shipped tests (sha256, unchanged)
671b62faa4709afe0ef30c14d60bb2056210a90db6544afa72a2cfbb19d626c8  tests/parity/line-shot.parity.test.ts
ec81381165776158efb376b0ad070680ebdf4376fd79b7924fd62b19a2d2f04f  tests/project/unit-setup.test.ts
c2e5966b25f81bd82b639db86a3e98f4a8110adb797eddf152d0cee813ad6425  tests/rules/battle-p14.test.ts
5f5043c48203d8464cc2a07e9a7785eca86c2e27b43b318960b69a1d7c6b2de8  tests/rules/battle-qa-p14.test.ts
575ffc369624870b88e3b47b009b4f09371cb5e36dfc153619554431809a506b  tests/rules/battle.test.ts
8bfaffc1eed7917a77c1b13e94b271230c585c4bc7aa9a010570de4405296dac  tests/rules/behaviours.test.ts

## Helpers & self-review (required)
- Helper battle (line-shot reach/damage/hitClass, own-key abilities, ally before range, unknown effects, L5 afterInstall on both install returns, code-point labels, nums() accepting int arrays while the picker still rejects them): launched and still running with no report after several minutes, then stopped. The same list was read against the shipped tests after they passed. No defect.
- Helper readers (abilityTableFor L0–L3, readUnit subset, readSetup catalogue, readStageOverrides skipping __proto__): finished without a loadable report. The unit-setup and ability-table tests passed, and the same source was read again after that. No defect. Overrides stay off CoreStage.
- Self-review: Acceptance done — npm ci exit 0; npm run green exit 0; 948/0/0/0 (duration_ms 53031.429405); typecheck, lint, deps, check:state, check:law exit 0. P1-3 is on the base (inOrthogonalReach, reachOf, createBattle, own-key stats) and the shipped imports match, so the step was not stopped. Catalogue rev 26 was not edited; the table hash pin matches. L5 still warns and does not scale damage. Caps: spells 6/12, btf index 1/2, read index 2/4, setups 30/40, unit 25/44, abilities 29/40, battle.ts 20/22, damage 11/20, battle index 2/4, line-shot 15/24, registry 6/8, types 4/6, xp-levels 2/4, parity 16/16, unit-setup 45/48, p14 89/95, qa pin 25/25, battle.test 2/4, behaviours 6/10; total 336 ≤ 400. Six shipped files byte-identical to the kit (QA pin 5f5043c4…). No Math.random, Date, or timers added. No core, catalogue, or migration edits. No painter-proto or ui-shell. Cites are towerChessSpells.ts, towerContest.ts, and towerChessHand.ts line numbers. G1 done, G2 done, G3 done (no phase writes), G4 done, G5 done, G6 done (only the step's 19 files), G7 done, G8 done, G9 the lines below, G10 this file.

## Decisions & deviations (5–10 lines)
- Base is b7d4326781a909194853d486efb0025d61144ca6 (P1-3 merged). The paste's floor 928 is the authoring floor. This main is 937 tests, so the floor used here is 937 + 11 = 948. The run is 948/0. The diff is that base to the head.
- 336 changed lines (316 insertions, 20 deletions). Every file is under its cap. battle.ts is 20 of 22. No file outside the step's list. No new dependency.
- plainCopy depth was already 4 on this base, so an ability row of reach/damage/effectRef survives. taken() keeps that copied abilities record. The hit looks up the actor's unitId with Object.hasOwn. A constructor, __proto__, or toString id is not an own key, so the shot is the default reach 3, damage 2, hitClass spell, and it does not throw.
- A line-shot with a resolved row uses that row's reach and damage, not atk and not basic reach. No row uses 3 and 2. Ally is still refused before range. Any other effect stays actionUnsupported. mana_cost is a knob that is read and left out of the result.
- abilityTableFor is L0 catalogue defaults, then L1 answers, then L2 overrides keyed by setup id, then L3 unit stats, and only for knobs that behaviour has. basic-attack therefore keeps damage 0. readUnit is its own v2 subset. readStageOverrides copies own keys and skips __proto__, constructor, prototype, and toString. readStage is unchanged and still drops overrides.
- L5 difficulty.damage stays a warning. afterInstall pushes layerNotApplied on both installOne returns, so installSetups and the invalidValue path both keep it. The value is not applied. Catalogue stays rev 26. nums() accepts an integer array, but the thresholds knob is still a picker, so an int-list is invalidValue until a later regen. Label length is Unicode code points. Nothing is cached.

## Next step (optional proposal)
- P1-5 can take bots and the action budget. Mana spend and a player door for the spell stay later.
