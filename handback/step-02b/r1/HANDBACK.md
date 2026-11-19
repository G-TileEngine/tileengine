# Hand-back step-02b-play-stage-carries r1
Step file: docs/maker/steps/step-02b-play-stage-carries.md
Base commit: 34fda67498e1f1eac0f6bcff0fecd1f5678d3fa0     Code head: 1df36efc7f326f0fc29c9772cb3e5eaa8b84da1b     Tree: aa5bdf925a505485dc5bc5868a57c88c4270410d     Branch: step/step-02b-play-stage-carries-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	tests/tools/touch-play.test.ts
A	tests/tools/play-stage-carries.test.ts
M	tools/play-stage/board.ts
M	tools/play-stage/build.ts
M	tools/play-stage/load.ts
M	tools/play-stage/match.ts
M	tools/play-stage/project.ts

## Green
npm test: 1041/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
N = 2 new tests (carry A, carry B). Floor 1039 + 2 = 1041. Line gate on this code head, `git diff --shortstat <base>..HEAD -- . ':!handback/**'`: 45 insertions + 15 deletions = 60.
```
# tests 1041
# pass 1041
# fail 0
# skipped 0
# todo 0
```
Stamp: none. This step does not build the maker. Play-stage output has no stamp folder.

## Smoke
sha256 of handoff/steps/tests/s0-play-input/touch-smoke.mjs: d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941 (matches the frozen kit; not edited).
```
ok   1 select @390: ok
ok   2 walk @390: ok
ok   3 attack @390: ok
ok   4 pan then select @390: ok
ok   5 talk @390: ok
ok   6 end turn @390: ok
ok   7 buttons @390: ok
ok   1 select @360: ok
ok   2 walk @360: ok
ok   3 attack @360: ok
ok   4 pan then select @360: ok
ok   5 talk @360: ok
ok   6 end turn @360: ok
ok   7 buttons @360: ok
TOUCH SMOKE PASS
```

## Shipped tests (sha256, unchanged)
This step ships no frozen test file and lists no test sha256 to copy. The two new tests are written here. tests/tools/touch-play.test.ts is an existing test; only its name lookup changed.

## Helpers & self-review (required)
- Helper review: asked to check the uncommitted diff against the guide (carry A freeze and per-load map, required recipes, recipeIn without undefined, carry B escape, touch-play scope, caps). It had not returned before this hand-back. Self-review below is the check that landed.
- Self-review Done when: gates 1041/0 and both check scripts, done. Carry A test: RECIPES frozen, deep-equal to the snapshot after two loads, the demo load has aliases, the second load has none of those aliases, and its own unit name is Knight, done. Carry B test: emitted project.json.js has no raw U+2028/U+2029, contains the six-character escapes, and the import returns A then the separators then C, done. play-stage.test.ts still expects `export default ` plus the raw fixture (the fixture has neither character), parity and the other existing tests passed with no edit except the touch-play helpers, done. S0 smoke PASS at 390 and 360, sprite ids unchanged, done. QA checklist G1–G10: done (no extra file; every file is under its cap; total 60).

## Decisions & deviations (5–10 lines)
- PlayDocs.recipes is required (QA carry 8). recipeIn takes that map and does not accept undefined, so a missing map cannot fall through to "Unknown". A missing id still uses the existing fallback(id).
- playDocsOf copies RECIPES and writes aliases only on that copy. RECIPES is Object.freeze after module load. recipeOf stays exported; the constructor test and pixelsOf still use the starter map. Sprite ids are unchanged.
- Carry B escapes each raw U+2028 and U+2029 in the emitted .json.js. It does not parse the JSON and does not reject the project. The fixture has neither character, so the old equality check still passes.
- tests/tools/touch-play.test.ts looks names up in bundledDocs().recipes. No other line in that test changed. No maker, template, fixture, or frozen-kit edit.
- Counted lines, all under the file caps: load.ts 4+/3− (cap 8), project.ts 3+/3− (cap 8), board.ts 2+/2− (cap 5), match.ts 3+/3− (cap 8), build.ts 1+/1− (cap 3), touch-play.test.ts 4+/3− (cap 8), play-stage-carries.test.ts 28 (cap 30). Total 45 insertions + 15 deletions = 60. No cache grows with loads; each load builds one map and drops it with the docs.

## Next step (optional proposal)
- Step 3 bases on this merge. It also edits tools/play-stage/project.ts.
