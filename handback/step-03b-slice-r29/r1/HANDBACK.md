# Hand-back step-03b-slice-r29 r1
Step file: docs/maker/steps/step-03b-slice-r29.md
Base commit: fdb7ad56786ef7720d79fad088155992e933cf99     Code head: ffa43f404dde31162fcadd379262d9157d10ebca     Tree: 0b174cc9c2f7efcc0edec607c10fae96bd46fe91     Branch: step/step-03b-slice-r29-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	data/templates/demo.tileproj/catalogue/slice.json
M	data/templates/demo.tileproj/project.json
M	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000001.json
M	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000002.json
M	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000003.json
M	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000004.json
M	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000005.json
M	fixtures/demo.tileproj/catalogue/slice.json
M	fixtures/demo.tileproj/project.json
M	fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json
M	fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json
M	fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json
M	fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json
M	fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json
M	src/project/load/read-project.ts
A	tests/project/demo-slice-pin.test.ts
A	tests/project/load/picker-options.test.ts

## Green
npm test: 1051/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
N = 2 new tests. Floor 1049 + 2 = 1051.
```
# tests 1051
# pass 1051
# fail 0
# skipped 0
# todo 0
```
Line count at the code head, `git diff --shortstat fdb7ad56786ef7720d79fad088155992e933cf99..ffa43f404dde31162fcadd379262d9157d10ebca -- . ':!fixtures/**'`: 10 files changed, 3764 insertions(+), 182 deletions(-). That is over 400. The extra is the byte copy under `data/templates/demo.tileproj` (see Decisions). The same command with `:!data/templates/**` added, which is how steps 1 (Q9), 2 and 3 leave template JSON out of the count: 3 files changed, 25 insertions(+), 1 deletion(-).
Fixtures, `git diff --shortstat fdb7ad56786ef7720d79fad088155992e933cf99..ffa43f404dde31162fcadd379262d9157d10ebca -- fixtures/`: 7 files changed, 3739 insertions(+), 181 deletions(-). The tip's `..HEAD` form of the first command also counts this handback file.

## Slice
`sha256sum fixtures/demo.tileproj/catalogue/slice.json` prints `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3`. `catalogue_rev` is 29. 4,170 lines. Copied byte for byte from the handed `slice.rev29.json`. Not hand-edited. The maker template copy has the same sha.

## Re-answers
`rg -n clip_cues src tools` on this base prints nothing. `src/runtime/render/feel.ts` does not read a knob. The D20 exception does not apply, so `clip_cues` stays `source: "default"`.

| Setup | Knob | Done |
|---|---|---|
| `…0003` unit-roster | `piece_count` | user, value 3, rev 1, defaultRef unchanged |
| `…0004` basic-attack | `enemy_basic_crosses_barrier` | user, value false, rev 1, defaultRef unchanged |
| `…0005` line-shot | `neutrals_legal` | user, value false, rev 1, defaultRef unchanged |
| `…0005` line-shot | `hit_class` | user, value `"basic"`, rev 1, defaultRef unchanged |
| `…0005` line-shot | `mana_cost` | user, value 0, rev 1, defaultRef unchanged |
| `…0002` ability-presentation | `basic_style` | stays default |
| `…0002` ability-presentation | `spells_style` | stays default |
| `…0002` ability-presentation | `hand_placement` | stays default |
| `…0003` unit-roster | `opening_row` | stays default |
| `…0003` unit-roster | `clip_cues` | stays default (D20 check above) |
| `…0003` unit-roster | `team_colour` | stays default (D19: null is the side palette) |
| `…0005` line-shot | `ability_group` | stays default |

The two knobs rev 29 does not have, neither answered by a demo file:
- `adjacency-synergy.bonus` becomes `per_neighbour` with `mode: "per-neighbour"`. Rev 29 has both (`per_neighbour` slider 1–2, default 1; `mode` picker, default `gate`).
- `barrier-line.length` is dropped. `max_lines` is lines per use, not a length, and is not a substitute.

`basic-attack.damage` stays `source: "default"`. The talk line stays the existing user value `Hello, traveler.`. Every other existing user answer is unchanged.

## Parity
From the green run:
```
ok 1028 - (a) parity: seed 24301 bot versus bot equals the 1a golden
```
`sha256sum tests/tools/golden/demo-parity.json` on the base and on the tip:
```
90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839  tests/tools/golden/demo-parity.json
90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839  tests/tools/golden/demo-parity.json
```
`git diff --stat fdb7ad56786ef7720d79fad088155992e933cf99..ffa43f404dde31162fcadd379262d9157d10ebca -- tests/tools/golden/` is empty.

## Smoke
sha256 of handoff/steps/tests/s0-play-input/touch-smoke.mjs: d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941 (unedited).
Browser: Google Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome` (this sandbox has no `/usr/bin/google-chrome`).
S0, `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`:
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
Step 3 is on this base, so s3 ran too. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798`:
```
ok   1 select @390: ok
ok   2 walk @390: ok
ok   3 attack @390: ok
ok   4 pan then select @390: ok
ok   5 talk @390: ok
ok   6 end turn @390: ok
ok   7 buttons @390: ok
ok   8 back to maker @390: ok
ok   9 empty blocked @390: ok
ok   1 select @360: ok
ok   2 walk @360: ok
ok   3 attack @360: ok
ok   4 pan then select @360: ok
ok   5 talk @360: ok
ok   6 end turn @360: ok
ok   7 buttons @360: ok
ok   8 back to maker @360: ok
ok   9 empty blocked @360: ok
TOUCH SMOKE PASS
```
`node tools/maker/build.ts` is what that s3 smoke calls. New (Demo) → Test played, then Back to maker, then Empty stayed blocked.

## Shipped tests (sha256, unchanged)
This step ships no frozen test file. The two new tests are written here. `tests/project/read-project.test.ts` is unedited.

## Helpers & self-review (required)
- Helper review of the uncommitted diff against the step's rules 1–10, the 12 re-answers, the picker formula, the two test names, and the template identity. It found no bugs. It confirmed the template copy is required by `tests/editor/project-home.test.ts` and that omitting it fails green.
- Self-review: the slice sha is `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3` and was copied, not typed. Catalogue rev is 29 on the project and all 5 setups. defaultRef revs are unchanged. The five user re-answers and the seven stayed defaults match the table. `clip_cues` stays default. The two missing knobs are written above and are not in any demo file. `basic-attack.damage` stays default. The picker check still rejects a non-string, then matches an option or its `value`. The named picker test fails without that line (checked: the clean demo then reports shortcut, reach_mode, caster_class and hit_class). The pin test hashes the file bytes. The fixture-clean test and the parity golden are untouched. S0 sha is unchanged. Both smokes print TOUCH SMOKE PASS at 390 and 360. N = 2, green 1051/0. QA checklist G1–G10: done, with the line-count note in Decisions. No token was printed, stored, or committed.

## Decisions & deviations (5–10 lines)
- The Build list names only `fixtures/demo.tileproj`. This base also has `data/templates/demo.tileproj`, and `tests/editor/project-home.test.ts` requires the two trees to be byte-equal. The maker's New Demo is that template. The seven changed template files are a copy of the seven changed fixture files, including the slice, same sha. No line of the slice was typed.
- The go-line line command does not exclude `data/templates/**`, so it reports 3764 insertions and 182 deletions, over 400. That is the template twin of the fixture. Steps 1 (Q9), 2 and 3 do not count template JSON. With `:!data/templates/**` the count is 25 insertions and 1 deletion (reader +1/−1, picker test +15, pin test +9).
- `clip_cues` stays default. Nothing in `src/` or `tools/` reads it, so the true default shows no cue the old demo lacked.
- The pin test is 9 lines (the trial measured 10). It is under the cap of 12. The picker test is 15 lines, under the cap of 20.
- No new dependency, no golden edit, no play-stage edit, no smoke edit. No cache grows with turns or edits.

## Next step (optional proposal)
- Step 4b can pin the slice against the format. Whoever adds a `noDefault` check must also exempt a nullable knob whose default is null.
