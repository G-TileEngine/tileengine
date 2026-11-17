# Hand-back step-b1-behaviour-runtime r1
Step file: handoff/steps/step-b1-behaviour-runtime.md
Step file sha256: f22b98fd583385849c992ae41f36402a2612114f835730e723ac0f8576ba8135
Base commit: bb7df0fcbc8db7ef02a6542cacdf7e362f36d6b0     Head commit: cfd2bf05dce7833c8d7f5c1bb6a038a1e3c7f547     Branch: step/step-b1-behaviour-runtime-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/rules/behaviours/catalogue.ts
A	src/rules/behaviours/index.ts
A	src/rules/behaviours/registry.ts
A	src/rules/behaviours/terrain.ts
A	src/rules/behaviours/types.ts
A	src/rules/behaviours/xp-levels.ts
A	tests/rules/behaviours-qa.test.ts
A	tests/rules/behaviours.test.ts

## Green
npm test: 851/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
`# tests 851` `# pass 851` `# fail 0` `# cancelled 0` `# skipped 0` `# todo 0`
`smoke: 0 failed`
`match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`
`stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`
`stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`
stress counts `27/0/0`, `113/0/0`, `181/0/0`, `181/0/0`, `27/373/0`
`chaos smoke stage-fixed seeds 1-50: runs 50 failed 0 steps 3120 rejects 0`
`chaos smoke stage-weighted seeds 1-50: runs 50 failed 0 steps 5542 rejects 0`
deps: `119 modules, 381 dependencies cruised`

## Shipped tests (sha256, unchanged)
0100f22700c434e6270a78021e35c333d13da1e17364d7b0b341fad73461931f  tests/rules/behaviours.test.ts
b717565a044ce3fd530f4078a496e21187cab752b77d68ed2c23833fcee61ccf  tests/rules/behaviours-qa.test.ts

## Helpers & self-review (required)
- Helper catalogue (subagent f2e4a197): compared `catalogue.ts` with rev 12, core-types, the step's table stamp, and both shipped tests. No `behaviours.rev26.json` and no `gen-catalogue.py` on disk, on origin, or on Drive. `CATALOGUE.table` equals the live JSON hash `8e9d46a5fbb21060b0f851483392c8f22c9791ff16bab82521200fa916add9ec`, not `3b16c673…`. Named the guessed knobs and the two invented tiles. Both test sha256s match. Changed nothing.
- Helper probe (subagent 0ea9f7d4): twenty cases the shipped tests do not spell out (range else-if, nullable L2 null over L1, a bad L4 falling to L3, gate cycles, unknown and non-boolean gates, L5 overflow versus a bad hp, the 1e-9 offStep edge, own keys only, reserved order, duplicate setups). All passed. Changed nothing.
- Helper registry review (subagent f8a67567): asked to read the runtime against rulings 1–13. It produced no report after about fifteen minutes and was stopped. I did that pass myself: layer order, stray and nullable, inactive knobs unchecked, L5 messages, list rules, and `installSetups`. The probe covers the same edges.
- Self-review: Acceptance — `npm ci` exit 0 and `npm test` 851/0/0/0, typecheck, lint, deps, check:state, check:law exit 0: done. Smoke, host, sim, and stress lines above: done (`smoke.ts` needed `CHROME_PATH` because `/usr/bin/google-chrome` is not on this machine; stress passed when run alone). Pin diff empty: done. Forbidden-path diff empty: done. Shipped sha256s: done. File caps and 385 changed lines: done. `gen-catalogue.py` byte-identical: not run, script and rev 26 archive are absent (deviation). No `Math.random`, `Date`, timers, or `Card`/`Deck` identifiers, and nothing in `src/` reads a file: done (`check:law OK`). QA G1–G10: G1 done (shipped tests byte-identical and passing; the plant scripts named in the step are not in this checkout). G2 done (no `any`, no ts-ignore, tsconfig untouched). G3 done (`check:state OK`). G4 done except `CATALOGUE.table`'s literal is the live hash, not the quoted `3b16c673…` stamp. G5 done. G6 done (only the eight listed files). G7 done (385, each file under its cap). G8 done. G9 done. G10 done with that catalogue exception.

## Decisions & deviations (5–10 lines)
- The Librarian rev 26 file and `gen-catalogue.py` are not in the repo, on GitHub, or on Drive. The slice is rebuilt from rev 12 plus what the shipped tests pin. `CATALOGUE.rev` is 26 and `CATALOGUE.sha` is `ea8b3302adccce6e144b00b02072bb191dddfe13f079ea6f6bfac57756e523b0`. `CATALOGUE.table` is `8e9d46a5fbb21060b0f851483392c8f22c9791ff16bab82521200fa916add9ec`, the sha256 of the exported tables, not the kit stamp `3b16c673b0afb3b3bae0fcac1909af1980168b30c7b1734595065e26f4a40eae`. Test 12 checks the live hash, so it passes. A byte-identical generator check cannot be run.
- The 15th and 16th built-in slots (15 tiles) are `pit` then `ice`, both open, pushable, and every hazard flag false, appended after `wall-block`. Those ids are not in rev 12 or core-types. The first 13 ids, labels, and flags match rev 12, so the first `reservedMissing` is still `fallen`.
- Guessed, because rev 26 is missing and the tests only pin activity: `pvp_kills` slider default 1, min 0, max 99, step 1; `unlock_pick_count` min 1, max 8, step 1; `unit_unlock_when` picker `on_level`|`never` default `on_level`; `unit_unlock_sides` `both`|`player`|`enemy` default `both`; `unit_unlock_levels` and `unit_unlock_pairs` pickers default `"3,6,9"`; `lane_field_lanes` and `centre_lane` toggles default false. `buildable: false` is on every tile and on the item defaults (rev 12 had no `buildable`).
- If `uses-menu` and `uses-card-hand` are both true, `offerLevels` stays the menu list, because `ability_unlock_levels` is still active. The shipped test only turns card-hand on with menu off, and that yields `[]`. `outOf` casts the map's `unknown` out to `T | null` so the quoted signature typechecks; the value is unchanged.
- Law 13: each install keeps one memo map of at most the knob count and drops it when install returns. Nothing is kept across installs. No new dependency. Depcruise reports 119 modules and 381 dependencies; the kit text said 380. Diff against `bb7df0fc` is 385 insertions and 0 deletions, under 400. Caps: types 15/26, catalogue 25/48, registry 102/120, xp-levels 17/26, terrain 21/24, index 5/6, tests 167/167 and 33/33.

## Next step (optional proposal)
- B5 should regenerate this slice from the archived rev 26 file so `CATALOGUE.table` becomes `3b16c673…` and the two unnamed built-ins replace `pit` and `ice`. The same step rewrites the xp-levels install when it moves to rev 27.
