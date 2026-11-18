# Hand-back s1a-project-format r1
Step file: docs/maker/steps/step-01-project-format.md (1a — reader; sha256 0e7d7618478cb0a111960d890318ab79168c92980af837cedbab87102cfd2be1). Also docs/maker/data/s1-project-load.md.
Base commit: f137ca266400f68eaf93f1d49eb5c5986831ee96  Head commit: b86151e64b8019f77354a09e0f4fe32c9f59c295  Tree: 483bf5b37c123c8ef4a4b77fc57d73082e23aadf  Branch: step/step-s1a-project-format-r1-chatA  PR: opened by Chief Of Staff from the branch
Node: v22.23.3  npm: 10.9.9  rg: ripgrep 14.1.1 (rev 4649aa9700)

## Green
npm test: 1034/0/0/0  typecheck: exit 0  lint: exit 0  deps: exit 0  check:state: exit 0  check:law: exit 0  npm run green: exit 0. N = 11 (7 reader tests + P1×2 + P2 + P3). Floor 1023+11 = 1034. fail 0. npm test duration_ms 57258. No play-stage edit. `git diff --name-only <base>..HEAD -- fixtures data/templates | rg -v '\.json$'` is empty.

## Plants
- P1 tests/project/load/law12.test.ts: a broken unit stat is hard invalidValue at units/u.json#/stats, the project is kept, and it is not the demo. Making note() return without a row fails that test (exit 1, then restored). An empty `catch {}` under src/project fails the scan (exit 1, then restored). check-law.sh is outside the 1a file table, so this plant owns the empty-catch scan. A comment-only catch already in guard.ts is not an empty body.
- P2 tests/project/load/one-parser.test.ts: JSON.parse, formatVersion or `kind ===` in src/project/load except migrate.ts fails. Adding JSON.parse to read-project.ts failed (exit 1, then restored). Play-stage lines already on base f137ca2 are allowlisted because 1a must not edit them; any new line fails. 1b removes the pre-existing build.ts parses.
- P3 tests/project/load/version-reject.test.ts: missing, "6", 6.5, 3 and 7 stay readOnly, project null, hard invalidValue / formatOlder / formatNewer, and no migrated row. versionRows returning [] failed the test (exit 1, then restored).

## Helpers & self-review
- Helper test review (02c526c2-4dcb-4eb6-a5f2-cc0d780ff163): the slice test only round-tripped the committed file. Fixed before this hand-back: sliceOf is given the eight ids plus a dropped effect entry and every dropped key, and must still equal catalogue/slice.json. The empty-catch regex stays `catch {}` so guard.ts comments do not fail green. (e) stays the required length-53 case; the reader uses cols*rows.
- Helper reader review (68d3cecf-99e5-4c3d-8bbc-bb93013eeff0): still running when this file was written. The same checks were done in the self-review below.
- Self-review: Acceptance gates done (1034/0, green exit 0). Caps: types 30/30, read-project 110/115, migrate 40/40, index 3/5, unit.ts diff 11/15, slice-of 19/25, read-project.test.ts 83/115, unit-setup diff 6/10. readProject does not throw or mutate files (a cycle becomes invalidValue; every test clones). Fixture report []. v4 store equals the v6 store and the input stays v4. v7 is refused. Golden captured from DEMO_LOAD before any delete: outcome win, snapshot dc959c318ea82b78e37e6cfbefcc2904be17b9640ea95982d9a92d8968b75177, log 3278b95a57fe08751cec91ecc220ed99d8ef75053148c52a5a7358e7f33a650b, bus 30f1d9006882e8ba9edc55d2a47cdb0dc8dbd6202dd5cfab2ba236862f90fd80. QA G1–G6 and G8 done. G7 counts this file. The raw test log is not a second file, so the step shortstat can stay within 400.

## Decisions & deviations
- behaviours.json rev 28 (sha e182b094) is not in the repo or on this machine. catalogue/slice.json is sliceOf output at catalogue_rev 28. terrain.tile_types is the engine's 15 reserved rows, including floor, water and wall-block. The other entries are the knobs the fixture answers, in the S1 order. Gates are only the ids uses-card-hand and uses-menu.
- Not checked: Q7 (two talk lines), a side missing from team_colours, an off-map placement, and a stat outside its knob range. Answer-value H2 and slider/text outOfRange are checked. A bad stat is invalidValue at #/stats, the field readUnit reports.
- Store documents are Doc, the migrated JSON. The full §16 types do not fit the 30-line types.ts cap. Unknown keys are kept.
- P2's play-stage allowlist and the untouched check-law.sh are the file-table limits above. No new dependency and no cache.
