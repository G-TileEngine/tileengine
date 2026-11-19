# Rebuild record: step 03b, the real rev 29 slice in the demo

Original brief: [`docs/maker/steps/step-03b-slice-r29.md`](../maker/steps/step-03b-slice-r29.md) r3 (blob `d66e28a0`, sha256 `fd8f35d1612481bc49851cdce7716a9509e9afcd2c047ed5d8bd351e126d1838`, 136 lines, on main `992e7d87` and at the merge). Do [`step-03.md`](step-03.md) first; this step starts on its post-merge main. This is a data step with one small reader fix. It has no maker screen. This file records exactly what shipped.

Sources: PR #82 and branch `step/step-03b-slice-r29-r1-chatA` (tip `f45288d9`, code head `ffa43f40`); `handback/step-03b-slice-r29/r1/HANDBACK.md` at `f45288d9` (HB, blob `5227ec8b`, 137 lines); Chief Of Staff verify report `/workspace/share/step03b-verify/report.md` (V, sha256 `61955f07ef463e322d8c74bece0a648d863f11e682c89e2ff077c65a13d20462`, 217 lines). `docs/qa/step-03b-review.md` (QA, git hash-object `9dac9e1a`, local at `/workspace/tileengine/docs/qa/step-03b-review.md`): **OK TO OPEN PR**, with the G7 ruling accepting `':!data/templates/**'` at QA:21-48 (the ruling item was also recorded at V:100, V:106, V:115, V:125). Line numbers are at the commit named. Code line cites are at merge `402699d5` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `fdb7ad56786ef7720d79fad088155992e933cf99`, main after the step 3 r2b QA review. Floor **1049** tests (guide L8: the go-line base's count + N) |
| r1 commits | `ffa43f40` data(demo): swap in the rev 29 catalogue slice (code head, tree `0b174cc9`), `f45288d9` hand-back (tree `908c541e`) (V:23, V:27-28, HB:3). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Product checks passed. The official L122 shortstat as written was over 400 (V:3, V:106). QA accepted the counted gate with `':!fixtures/**' ':!data/templates/**'` (3 files, 25+/1−), because the template tree is a required byte-identical copy of the fixture (`tests/editor/project-home.test.ts:22`) |
| Merge | PR #82 "Step 03b: slice r29", merge commit `402699d52f7c8452d4e70eb698bd404ea9898c98`, 2026-11-19 16:18 (UK time). Tree `0598d3fef36f6163da1cb8d8b946261f189f0c8b` (the same tree CoS merged against `992e7d87`; V:185, V:187). First parent `992e7d87e8d3890af4a5983e709ebb83a353bc34` (the step-03 rebuild record and its QA review, one docs-only commit after `fdb7ad56`), second parent `f45288d9` |
| After the merge | main is still `402699d5`. No later docs-only commit has been added yet |
| Tests | 1049 + N=2 (pin, picker options) = **1051 pass / 0 fail** (HB:26-27, V:55-57, V:64) |
| Size | Official L122, `git diff --shortstat fdb7ad56..ffa43f40 -- . ':!fixtures/**'`, is 10 files, **3764 insertions + 182 deletions**, over 400, because it counts the template twin (HB:35, V:106). The gate QA accepted is `git diff --shortstat fdb7ad56..HEAD -- . ':!fixtures/**' ':!data/templates/**' ':!handback/**'` = 3 files, **25 insertions + 1 deletion**, under 400. Fixtures: 7 files, 3739+/181− (guide L122 second number; HB:36) |
| Stamp | `node tools/maker/build.ts <out>` writes `<out>/maker/index.html`, `<out>/maker/ab2063a60e79/` and `<out>/play-stage/ab2063a60e79/` (V:153). The stamp changed from step 3's `4d2ee9e86927` because the packed demo and reader bytes changed |
| Smoke | S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, unchanged. Step 3 is on this base, so both smokes run. Both print `TOUCH SMOKE PASS` at 390 and 360 under google-chrome: S0 is 14/14; s3 is 18/18 including checks 8 and 9 (guide L16-18, L128; HB:77-120; V:145, V:149, V:151) |

## (b) Files

From `git diff --name-status fdb7ad56..f45288d9 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions. The seven template files are a byte copy of the seven fixture files (same git blob ids). They are listed because they shipped; they are out of the accepted 400-line count.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `fixtures/demo.tileproj/catalogue/slice.json` | edited | 3883 (3718+/165−) | Replace the old 617-line stub with the real rev 29 slice, `catalogue_rev` 29, sha256 `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3`, 4,170 lines. Copied, not typed (guide L42-45, L123; HB:39) |
| `fixtures/demo.tileproj/project.json` | edited | 2 (1+/1−) | `project.catalogueRev` is 29 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` | edited | 2 (1+/1−) | Talk setup: catalogue rev 29. Talk line stays the existing user value |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` | edited | 2 (1+/1−) | Ability-presentation: catalogue rev 29. Style knobs stay default |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` | edited | 7 (4+/3−) | Unit-roster: catalogue rev 29. `piece_count` becomes a user answer of 3. `opening_row`, `clip_cues` and `team_colour` stay default |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` | edited | 7 (4+/3−) | Basic-attack: catalogue rev 29. `enemy_basic_crosses_barrier` becomes a user answer of `false`. `damage` stays default |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` | edited | 17 (10+/7−) | Line-shot: catalogue rev 29. `neutrals_legal` (false), `hit_class` (`"basic"`) and `mana_cost` (0) become user answers. `ability_group` stays default |
| `data/templates/demo.tileproj/…` (the same seven paths) | edited | same counts | Byte-identical twin of the fixture tree. Required by `tests/editor/project-home.test.ts:22`. New Demo is this template |
| `src/project/load/read-project.ts` | edited | 2 (1+/1−, cap 2) | One line: the picker check at L61 mirrors `registry.ts` L42, so `{value, label}` options work |
| `tests/project/demo-slice-pin.test.ts` | new | 9 (cap 12) | Pin the fixture slice's sha256 to `8547ed0a…`, outside `fixtures/`, so a hand edit fails |
| `tests/project/load/picker-options.test.ts` | new | 15 (cap 20) | A listed picker value passes; an unlisted or non-string value is a hard `invalidValue` |

Hand-back file `handback/step-03b-slice-r29/r1/HANDBACK.md` is on the merge tree but is excluded from this list, as it is not product. There is no `test-output.txt`. The folder uses the full step id (guide L14). Maps, stages and unit docs in both demo trees were not touched, and already shared blob ids across the two trees.

## (c) Key code and git commands

Every shipped file's full code (and, for the slice, the one shared blob) is in the appendix at the end of this file, taken from the merge commit `402699d5`. To see it in git:

```
git log --oneline fdb7ad56..f45288d9
git diff --stat fdb7ad56..f45288d9 -- . ':!handback/**' ':!docs/**'
git diff --shortstat fdb7ad56..HEAD -- . ':!fixtures/**' ':!data/templates/**' ':!handback/**'
git show 402699d5:src/project/load/read-project.ts
git show 402699d5:tests/project/demo-slice-pin.test.ts
sha256sum fixtures/demo.tileproj/catalogue/slice.json data/templates/demo.tileproj/catalogue/slice.json
```

**The slice is the real rev 29 catalogue, byte for byte.** `fixtures/demo.tileproj/catalogue/slice.json` (and the same path under `data/templates/`) has sha256 `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3`, git blob `2d59519b`, 4,170 lines, `catalogue_rev` 29 (guide L42, L123). It was copied from the handed `slice.rev29.json`, not typed (HB:39). `project.catalogueRev` is 29 (`fixtures/demo.tileproj/project.json:11`). Each of the five setups has `catalogue.rev` 29. `defaultRef.rev` values are unchanged from the base.

**The pin sits outside `fixtures/`.** `tests/project/demo-slice-pin.test.ts:6-8` reads the fixture slice bytes and hashes them with `node:crypto` to that sha256. The existing fixture-clean test in `tests/project/read-project.test.ts` was not edited: it rebuilds a catalogue from the fixture slice itself, so a hand-edited slice can still pass it (guide L61, L124). The pin is the guard that lets `fixtures/**` stay out of the 400 (guide L3, L62).

**The maker template is a byte copy of the fixture.** `tests/editor/project-home.test.ts:21-22` walks `data/templates/demo.tileproj` and then `assert.deepEqual(demo, walk(join(root, "fixtures/demo.tileproj")))`. That test was not edited in this step. At the merge, both trees have the same 16 paths and the same git blob id for every file. New Demo uses the template, so omitting the copy fails green (HB:126, HB:130).

**Picker options are `{value, label}`.** The real slice does not use plain strings. `src/project/load/read-project.ts:61` checks a picker with `options.some((opt) => (isObj(opt) && Object.hasOwn(opt, "value") ? opt["value"] : opt) === value)`, which mirrors `src/rules/behaviours/registry.ts:42` (guide L34, L92). No other reader change. The check is not looser than the registry: a value other than a listed string does not pass.

**Tests.** `tests/project/load/picker-options.test.ts:8-14` loads the clean demo (empty report), then tries `"not-an-option"`, `3`, `true` and `{ value: "all-menu" }` on the ability-presentation shortcut and expects one hard `invalidValue` at `setups/setup_01JDAT00000000000000000002.json#/answers/shortcut/value` (`:6`, `:13`). The pin test is `:6-8` as above.

**Re-answers.** Twelve demo answers were `source: "default"` on a knob whose default changed. None of them is read by the play stage (guide L59, L65). Five become user answers at the old values: unit-roster `piece_count` = 3, basic-attack `enemy_basic_crosses_barrier` = false, line-shot `neutrals_legal` = false, `hit_class` = `"basic"`, `mana_cost` = 0. Seven stay default, including `clip_cues` (nothing in `src/` or `tools/` reads it, so D20's exception does not apply) and `team_colour` (D19: `null` is the side palette). `basic-attack.damage` stays default. The talk line stays `Hello, traveler.`. The two knobs rev 29 does not have are not answered in any demo file: `adjacency-synergy.bonus` becomes `per_neighbour` with `mode: "per-neighbour"`; `barrier-line.length` is dropped and `max_lines` is not a substitute (guide L55-57, HB:59-61, HB:63).

**Parity stays the 1a golden.** `node --test --test-reporter=tap "tests/**/*.test.ts"` prints `ok 1028 - (a) parity: seed 24301 bot versus bot equals the 1a golden`. `sha256sum tests/tools/golden/demo-parity.json` is `90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839` on the base and on the merge (guide L37). `git diff --stat fdb7ad56..HEAD -- tests/tools/golden/` is empty.

## (d) What went wrong, in order, and the fix

1. **The official L122 gate, as written, did not foresee the maker template.** Guide r3 and its trial were on `af9af6c0` (guide L3, L7), which has `data/staging` only — no `data/templates`. The Build list names only `fixtures/demo.tileproj` (guide L87-97). The official line command (guide L122) is `git diff --shortstat <base>..HEAD -- . ':!fixtures/**'` and must be 400 or fewer. The only use of the word "template" is "No new framework, starter template or app scaffold" (guide L108). "Rulings needed: None open" (guide L132).

2. **The go-line base already had step 2 and step 3.** The brief allows that (guide L7: "or the latest main"; L18 and L128: run the s3 smoke and the maker build if step 3 is on the base). On `fdb7ad56`, `tests/editor/project-home.test.ts:22` requires the template tree to equal the fixture, and New Demo is that template. Copying the seven changed fixture files into `data/templates/demo.tileproj` is required for green. The copy is byte-identical (same blob ids), not a second hand edit of the slice. The pin still guards the fixture; the identity test guards the template (V:88, V:94, V:96, HB:130).

3. **That copy blows the written 400-line command.** At the code head, official L122 is 10 files, 3764+/182−. At HEAD it is 11 files, 3901+/182−, because L122 also does not exclude `handback/**`. With `':!data/templates/**'` and `':!handback/**'` as well — the same exclusions steps 2 and 3 already use — the counted product is 3 files, 25+/1− (reader 1+/1−, picker test +15, pin test +9). The trial measured 26+/1− because it counted the pin test as 10 lines; the shipped pin test is 9, under the cap of 12 (guide L104; HB:133). The builder recorded the mismatch in Decisions and did not hide the lines (HB:129-131, V:123).

4. **QA accepted the exclusion, and the first run merged with no product rework.** The accepted gate is `git diff --shortstat <base>..HEAD -- . ':!fixtures/**' ':!data/templates/**'` (and `':!handback/**'` at HEAD), 3 files, 25+/1−, under 400. Merge-tree of `992e7d87` and `f45288d9` was clean at tree `0598d3fe`. Green is 1051/0. PR #82 merged as `402699d5`. A later docs pass can add `':!data/templates/**'` and `':!handback/**'` to guide L122.

## (e) Do it right first time

- Base on `fdb7ad56` (or the go-line sha). Floor 1049, land at 1051 (N=2: pin, picker options). This is a data step with one reader line. Do not wait for a later step, and do not add a maker screen.
- Copy the handed rev 29 slice into `fixtures/demo.tileproj/catalogue/slice.json` byte for byte. Do not type it. Also copy every changed demo file into `data/templates/demo.tileproj`, so the two trees stay equal. Do not change `tools/project/slice-of.ts`.
- Pin the slice sha256 `8547ed0a…` in a test outside `fixtures/`. Leave `tests/project/read-project.test.ts` and the parity golden alone.
- The picker check in `read-project.ts` must mirror `registry.ts:42`. A listed string passes; an unlisted or non-string value is `invalidValue`. Ship the named picker test that fails without that line.
- Re-answer the twelve default-changed knobs as the table says. Do not invent `adjacency-synergy.bonus` or `barrier-line.length`. Leave `basic-attack.damage` and `team_colour` as defaults. Keep `clip_cues` default unless something in `src/` or `tools/` reads it.
- Line gate: `git diff --shortstat <base>..HEAD -- . ':!fixtures/**' ':!data/templates/**' ':!handback/**'` is 400 or fewer. Also quote the official L122 command and the raw fixture shortstat. Caps in the file table are guidance.
- Commit no raw `test-output.txt`. Put the `ℹ tests/pass/fail/…` summary in HANDBACK.md § Green. The last commit adds only the hand-back, at `handback/step-03b-slice-r29/r<N>/`.
- Run both smokes when step 3 is on the base: S0 unchanged (`d528795e…`) and s3, at 390 and 360. `node tools/maker/build.ts` must still build. New (Demo) → Test must still play.
- Push: author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The token environment variable must hold the real token, not placeholder text. Never print or commit it.

## (f) Rebuild check

Run on the merge `402699d5` (tree `0598d3fe`). `main` at this write is that merge; no later commit has been added. Re-run on 2026-11-19 at the merge tree: `npm run green` exit 0 with 1051 pass / 0 fail; the accepted shortstat is 3 files, 25 insertions and 1 deletion; the slice sha256 is `8547ed0a…` on both trees; the golden sha is `90dde42a…`; S0 printed 14/14 ok and `TOUCH SMOKE PASS`; s3 printed 18/18 ok at 390 and 360 and `TOUCH SMOKE PASS` (V, HB).

```
git worktree add --detach /tmp/s03b 402699d5 && cd /tmp/s03b
npm ci && npm run green           # exit 0; tests 1051, fail 0
git diff --shortstat fdb7ad56..HEAD -- . ':!fixtures/**' ':!data/templates/**' ':!handback/**'
#   3 files changed, 25 insertions(+), 1 deletion(-)
sha256sum fixtures/demo.tileproj/catalogue/slice.json data/templates/demo.tileproj/catalogue/slice.json
#   8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3  (both)
diff -r fixtures/demo.tileproj data/templates/demo.tileproj
#   empty (the two trees are byte-identical)
sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --exit-code fdb7ad56 HEAD -- tests/tools/golden/ tools/play-stage tools/project/slice-of.ts tests/project/read-project.test.ts handoff/steps/tests
node --test --test-reporter=tap "tests/**/*.test.ts" | rg "parity: seed 24301"
#   ok 1028 - (a) parity: seed 24301 bot versus bot equals the 1a golden
node tools/maker/build.ts /tmp/s03b-out
ls /tmp/s03b-out/maker/ /tmp/s03b-out/play-stage/   # index.html + ab2063a60e79/ in maker; ab2063a60e79/ in play-stage
sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798
#   ok 1-9 @390, ok 1-9 @360, then TOUCH SMOKE PASS
```

Against the merge tree: on your rebuild branch, `git diff 402699d5 HEAD -- fixtures/demo.tileproj data/templates/demo.tileproj src/project/load/read-project.ts tests/project/demo-slice-pin.test.ts tests/project/load/picker-options.test.ts` must be empty. The blob table below lists the exact git blob id each file must have at `402699d5`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id.

## QA non-blockers carried forward

From QA:66-68. 1. Add `':!data/templates/**'` to guide L122 in a later docs pass. 2. The `/workspace/share` copy of the guide is stale, so cite main's. 3. The HANDBACK boilerplate "PR: opened by Chief Of Staff" is accepted. The line-gate ruling itself is accepted, not a leftover (see (d) 4). Step 2 carries that were already open (Effect Designer code in the maker bundle, the OPFS DOM test) are unchanged by this step.

## Blob check

Each file must have exactly this git blob id at `402699d5`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`. Each `data/templates/demo.tileproj/…` path has the same blob as the same path under `fixtures/demo.tileproj/`.

| File | git blob id | lines |
|---|---|---|
| `src/project/load/read-project.ts` | `d97f477cb737590be97e1e4612e6b78ab1a4744b` | 110 |
| `tests/project/demo-slice-pin.test.ts` | `2088cee70d67785201c7cd7a36354e8cc2ea97ea` | 9 |
| `tests/project/load/picker-options.test.ts` | `ec599963f12e346e108956ee7c90c8abae477486` | 15 |
| `fixtures/demo.tileproj/catalogue/slice.json` | `2d59519b6209b24f787b3db88e547f11716dad7a` | 4170 |
| `fixtures/demo.tileproj/project.json` | `8fd8573205135009f4ed4689647981c81d5e6951` | 48 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` | `df7032ecfdb9d21c9d7513a4bd6b0649bb34d3ea` | 39 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` | `e83cfb01d3ddb15a6c222809e4863e1379060efd` | 93 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` | `9aa5d7a029f1dd3b7dcf41dbde2caf7c03770fec` | 87 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` | `868d32bb763962bcc3451cb9ab5fc14e22850492` | 90 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` | `af711549718592244cd4354234b0714cd17c1565` | 124 |
| `data/templates/demo.tileproj/catalogue/slice.json` | `2d59519b6209b24f787b3db88e547f11716dad7a` | 4170 |
| `data/templates/demo.tileproj/project.json` | `8fd8573205135009f4ed4689647981c81d5e6951` | 48 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` | `df7032ecfdb9d21c9d7513a4bd6b0649bb34d3ea` | 39 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` | `e83cfb01d3ddb15a6c222809e4863e1379060efd` | 93 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` | `9aa5d7a029f1dd3b7dcf41dbde2caf7c03770fec` | 87 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` | `868d32bb763962bcc3451cb9ab5fc14e22850492` | 90 |
| `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` | `af711549718592244cd4354234b0714cd17c1565` | 124 |

## Appendix: full code as merged (step 03b, PR #82)
New files are given in full. Edited code and the small demo JSON files are given as the exact diff from `fdb7ad56` to `402699d5`, then in full as merged. The seven template files share git blob ids with the seven fixture files, so each JSON body is shown once (the fixture path). The slice is a 4,170-line near-total replace (the previous file was 617 lines); it is given in full once, not as a diff. Copy them byte for byte; the blob table checks you did.

### `tests/project/demo-slice-pin.test.ts` (new)
`````ts
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
// sliceOf(behaviours.json bba8c252, IDS)
test("demo slice pin: catalogue/slice.json is the rev 29 slice, byte for byte", () => {
  const bytes = readFileSync("fixtures/demo.tileproj/catalogue/slice.json");
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3");
});
`````

### `tests/project/load/picker-options.test.ts` (new)
`````ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";
const root = "fixtures/demo.tileproj", where = "setups/setup_01JDAT00000000000000000002.json#/answers/shortcut/value";
const bag = (): Record<string, unknown> => { const out: Record<string, unknown> = {}, walk = (dir: string, base = ""): void => { for (const name of readdirSync(dir)) { const path = join(dir, name), rel = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, rel); else out[rel] = JSON.parse(readFileSync(path, "utf8")) as unknown; } }; walk(root); return out; };
test("picker options as {value, label}: a listed value passes; an unlisted or non-string value is invalidValue", () => {
  assert.deepEqual([...readProject(bag()).report], []);
  for (const value of ["not-an-option", 3, true, { value: "all-menu" }]) {
    const files = bag(), setup = files["setups/setup_01JDAT00000000000000000002.json"] as { answers: { shortcut: { value: unknown } } };
    setup.answers.shortcut.value = value; const got = readProject(files), row = got.report[0];
    assert.equal(got.report.length, 1); assert.equal(row?.code, "invalidValue"); assert.equal(row?.severity, "hard"); assert.equal(row?.path, where);
  }
});
`````

### `src/project/load/read-project.ts` (edited)
Diff `fdb7ad56..402699d5`:

`````diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index a640273..d97f477 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -58,7 +58,7 @@ function warns(slice: Obj, projectRev: unknown, maps: Readonly<Record<string, Do
       const ans = answers[key]; if (!isObj(ans) || !Object.hasOwn(ans, "value")) continue;
       const knob = knobAt(slice, setup["behaviourId"], key); if (knob === null) continue;
       const value = ans["value"], type = knob["type"], where = `${path}#/answers/${key}/value`;
-      const bad = type === "slider" ? typeof value !== "number" || !Number.isFinite(value) : type === "toggle" ? typeof value !== "boolean" : type === "text" || type === "ref" ? typeof value !== "string" : type === "picker" ? typeof value !== "string" || (Array.isArray(knob["options"]) && !knob["options"].includes(value)) : type === "list" ? !Array.isArray(value) || value.some((item) => !isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string") : false;
+      const bad = type === "slider" ? typeof value !== "number" || !Number.isFinite(value) : type === "toggle" ? typeof value !== "boolean" : type === "text" || type === "ref" ? typeof value !== "string" : type === "picker" ? typeof value !== "string" || (Array.isArray(knob["options"]) && !knob["options"].some((opt) => (isObj(opt) && Object.hasOwn(opt, "value") ? opt["value"] : opt) === value)) : type === "list" ? !Array.isArray(value) || value.some((item) => !isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string") : false;
       if (bad) rows.push(row("invalidValue", "hard", where));
       if (type === "text" && typeof value === "string" && typeof knob["max_len"] === "number" && [...value].length > knob["max_len"]) rows.push(row("outOfRange", "warning", where));
       if (type === "slider" && typeof value === "number" && ((typeof knob["min"] === "number" && value < knob["min"]) || (typeof knob["max"] === "number" && value > knob["max"]))) rows.push(row("outOfRange", "warning", where));
`````

As merged:

`````ts
import { readManifest, readMap, readSetup, readStage, readUnit, type ReadResult } from "../read/index.ts";
import { migrateProject, versionRows } from "./migrate.ts";
import { knownKind, type Doc, type ProjectFiles, type ProjectLoad, type ProjectStore, type ReportRow, type Severity } from "./types.ts";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const LIMITS = { picks: 8, waveUnits: 16 } as const;
const row = (code: string, severity: Severity, path: string, detail?: string): ReportRow => (detail === undefined ? { code, severity, path } : { code, severity, path, detail });
const sort = (rows: readonly ReportRow[]): ReportRow[] => [...rows].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : a.code < b.code ? -1 : a.code > b.code ? 1 : 0));
const idOf = (doc: Obj): string | null => (typeof doc["id"] === "string" ? doc["id"] : null);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);

function note(res: ReadResult<unknown>, path: string, rows: ReportRow[]): void {
  if (res.ok) return;
  const stats = !res.needsMigration && res.error === "bad field stats";
  rows.push(row("invalidValue", "hard", stats ? `${path}#/stats` : path, res.needsMigration ? "needsMigration" : res.error));
}
function has(bag: Readonly<Record<string, unknown>>, id: unknown, path: string, rows: ReportRow[]): void {
  if (typeof id === "string" && !Object.hasOwn(bag, id)) rows.push(row("brokenRef", "hard", path, id));
}

function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonly<Record<string, Doc>>, stages: Readonly<Record<string, Doc>>, units: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
  const project = isObj(manifest["project"]) ? manifest["project"] : {};
  const gear = isObj(project["loadout"]) ? project["loadout"] : {};
  list(project["stages"]).forEach((id, i) => has(stages, id, `project.json#/project/stages/${i}`, rows));
  list(project["rules"]).forEach((id, i) => has(setups, id, `project.json#/project/rules/${i}`, rows));
  list(gear["roster"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/roster/${i}`, rows));
  list(gear["required"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/required/${i}`, rows));
  for (const [id, stage] of Object.entries(stages)) {
    const path = at[id] ?? `stages/${id}.json`;
    const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : {};
    has(maps, stage["mapRef"], `${path}#/mapRef`, rows);
    list(stage["rules"]).forEach((sid, i) => has(setups, sid, `${path}#/rules/${i}`, rows));
    list(stage["neutrals"]).forEach((n, i) => { if (!isObj(n)) return; has(units, n["unitId"], `${path}#/neutrals/${i}/unitId`, rows); list(n["setupIds"]).forEach((sid, j) => has(setups, sid, `${path}#/neutrals/${i}/setupIds/${j}`, rows)); });
    list(pool["entries"]).forEach((e, i) => { if (isObj(e)) has(units, e["unitId"], `${path}#/enemyPool/entries/${i}/unitId`, rows); });
  }
  for (const [id, unit] of Object.entries(units)) list(unit["setupIds"]).forEach((sid, i) => has(setups, sid, `units/${id}.json#/setupIds/${i}`, rows));
}

function knobAt(slice: Obj, behaviourId: unknown, key: string): Obj | null {
  if (typeof behaviourId !== "string") return null;
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === behaviourId) for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === key) return knob;
  return null;
}
function warns(slice: Obj, projectRev: unknown, maps: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
  const known = new Set(list(slice["behaviours"]).filter(isObj).map((b) => b["id"]));
  const tiles = new Set<string>();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string") tiles.add(item["id"]);
  if (slice["catalogue_rev"] !== undefined && slice["catalogue_rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", "catalogue/slice.json#/catalogue_rev"));
  for (const [id, setup] of Object.entries(setups)) {
    const path = `setups/${id}.json`, answers = isObj(setup["answers"]) ? setup["answers"] : {};
    if (isObj(setup["catalogue"]) && setup["catalogue"]["rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", `${path}#/catalogue/rev`));
    if (known.size > 0 && typeof setup["behaviourId"] === "string" && !known.has(setup["behaviourId"])) rows.push(row("unknownRef", "warning", `${path}#/behaviourId`, setup["behaviourId"]));
    const ns = isObj(answers["custom_ns"]) ? answers["custom_ns"]["value"] : undefined, ew = isObj(answers["custom_ew"]) ? answers["custom_ew"]["value"] : undefined, mode = isObj(answers["reach_mode"]) ? answers["reach_mode"]["value"] : undefined;
    if (setup["behaviourId"] === "basic-attack" && mode === "custom-cross" && typeof ns === "number" && typeof ew === "number" && ns !== ew) rows.push(row("layerNotApplied", "warning", `${path}#/answers/custom_ns`, "min(ns,ew)"));
    if (setup["behaviourId"] === "basic-attack" && isObj(answers["damage"]) && answers["damage"]["source"] !== "default" && answers["damage"]["source"] !== undefined) rows.push(row("layerNotApplied", "warning", `${path}#/answers/damage`, "unit_atk"));
    for (const key of Object.keys(answers)) {
      const ans = answers[key]; if (!isObj(ans) || !Object.hasOwn(ans, "value")) continue;
      const knob = knobAt(slice, setup["behaviourId"], key); if (knob === null) continue;
      const value = ans["value"], type = knob["type"], where = `${path}#/answers/${key}/value`;
      const bad = type === "slider" ? typeof value !== "number" || !Number.isFinite(value) : type === "toggle" ? typeof value !== "boolean" : type === "text" || type === "ref" ? typeof value !== "string" : type === "picker" ? typeof value !== "string" || (Array.isArray(knob["options"]) && !knob["options"].some((opt) => (isObj(opt) && Object.hasOwn(opt, "value") ? opt["value"] : opt) === value)) : type === "list" ? !Array.isArray(value) || value.some((item) => !isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string") : false;
      if (bad) rows.push(row("invalidValue", "hard", where));
      if (type === "text" && typeof value === "string" && typeof knob["max_len"] === "number" && [...value].length > knob["max_len"]) rows.push(row("outOfRange", "warning", where));
      if (type === "slider" && typeof value === "number" && ((typeof knob["min"] === "number" && value < knob["min"]) || (typeof knob["max"] === "number" && value > knob["max"]))) rows.push(row("outOfRange", "warning", where));
    }
  }
  for (const [id, map] of Object.entries(maps)) {
    const palette = isObj(map["logic"]) && isObj(map["logic"]["palette"]) ? map["logic"]["palette"] : {};
    for (const key of Object.keys(palette)) { const name = palette[key]; if (tiles.size > 0 && typeof name === "string" && !tiles.has(name)) rows.push(row("unknownRef", "warning", `maps/${id}.json#/logic/palette/${key}`, name)); }
  }
}

/** Pure project read. Never throws, never writes, never mutates `files`. */
export function readProject(files: ProjectFiles): ProjectLoad {
  if (!isObj(files) || !isObj(files["project.json"])) return { ok: false, readOnly: true, project: null, report: [row("notAProject", "hard", "project.json", "missing project.json")] };
  const gate = versionRows(files);
  if (gate.length > 0) return { ok: false, readOnly: true, project: null, report: sort(gate) };
  let migrated: { files: ProjectFiles; report: readonly ReportRow[] };
  try { migrated = migrateProject(files); } catch { return { ok: false, readOnly: true, project: null, report: [row("invalidValue", "hard", "project.json", "unreadable")] }; }
  const docs = migrated.files, rows: ReportRow[] = [...migrated.report];
  const maps: Record<string, Doc> = {}, stages: Record<string, Doc> = {}, units: Record<string, Doc> = {}, setups: Record<string, Doc> = {}, unknownFiles: Record<string, unknown> = {}, stageAt: Record<string, string> = {};
  let slice: Doc = {}, manifest: Doc = {};
  for (const path of Object.keys(docs)) {
    const doc = docs[path], slot = knownKind(path);
    if (slot === null) { unknownFiles[path] = doc; rows.push(row("unknownFile", "warning", path)); continue; }
    if (!isObj(doc)) { rows.push(row("invalidValue", "hard", path, "not an object")); continue; }
    const id = idOf(doc);
    if (slot === "tile-project") { manifest = doc; if ("index" in doc) rows.push(row("indexIgnored", "info", `${path}#/index`)); note(readManifest(doc), path, rows); }
    else if (slot === "catalogue-slice") slice = doc;
    else if (slot === "map") {
      if (id !== null) maps[id] = doc;
      const n = typeof doc["cols"] === "number" && typeof doc["rows"] === "number" ? doc["cols"] * doc["rows"] : -1;
      const terrain = isObj(doc["logic"]) && Array.isArray(doc["logic"]["terrain"]) ? doc["logic"]["terrain"] : null;
      const badLen = terrain !== null && terrain.length !== n;
      if (badLen && terrain !== null) rows.push(row("terrainLength", "hard", `${path}#/logic/terrain`, `found ${terrain.length}`));
      if (list(doc["layers"]).some((layer) => isObj(layer) && Array.isArray(layer["tiles"]) && layer["tiles"].length !== n)) rows.push(row("terrainLength", "hard", `${path}#/layers`));
      if (!badLen) note(readMap(doc), path, rows);
    } else if (slot === "stage") { if (id !== null) { stages[id] = doc; stageAt[id] = path; } note(readStage(doc, LIMITS), path, rows); }
    else if (slot === "unit") { if (id !== null) units[id] = doc; note(readUnit(doc), path, rows); }
    else { if (id !== null) setups[id] = doc; note(readSetup(doc), path, rows); }
  }
  if (!Object.hasOwn(docs, "catalogue/slice.json")) rows.push(row("invalidValue", "hard", "catalogue/slice.json", "missing"));
  const manifestDoc = docs["project.json"];
  const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
  refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
  warns(slice, project["catalogueRev"], maps, setups, rows);
  const hard = rows.some((r) => r.severity === "hard");
  const store: ProjectStore = { manifest, slice, maps, stages, units, setups, unknownFiles };
  return { ok: !hard, readOnly: false, project: store, report: sort(rows) };
}
`````

### `fixtures/demo.tileproj/project.json` (edited; `data/templates/demo.tileproj/project.json` is the same blob)
Diff `fdb7ad56..402699d5`:

`````diff
diff --git a/fixtures/demo.tileproj/project.json b/fixtures/demo.tileproj/project.json
index fdddf77..8fd8573 100644
--- a/fixtures/demo.tileproj/project.json
+++ b/fixtures/demo.tileproj/project.json
@@ -8,7 +8,7 @@
     "createdAt": "2026-11-18T00:00:00Z",
     "updatedAt": "2026-11-18T00:00:00Z",
     "copiedFrom": null,
-    "catalogueRev": 28,
+    "catalogueRev": 29,
     "settings": {
       "wrapEdges": false
     },
`````

As merged:

`````json
{
  "kind": "tile-project",
  "formatVersion": 6,
  "project": {
    "id": "project_01JDAP00000000000000000001",
    "rev": 1,
    "name": "Demo",
    "createdAt": "2026-11-18T00:00:00Z",
    "updatedAt": "2026-11-18T00:00:00Z",
    "copiedFrom": null,
    "catalogueRev": 29,
    "settings": {
      "wrapEdges": false
    },
    "difficulty": {
      "hp": 1,
      "damage": 1,
      "appliesTo": "enemies"
    },
    "stages": [
      "stage_01JDAS00000000000000000001"
    ],
    "rules": [
      "setup_01JDAT00000000000000000002",
      "setup_01JDAT00000000000000000003"
    ],
    "loadout": {
      "roster": [
        "unit_01JDAN00000000000000000001",
        "unit_01JDAN00000000000000000002",
        "unit_01JDAN00000000000000000003"
      ],
      "size": 3,
      "required": [
        "unit_01JDAN00000000000000000001"
      ]
    },
    "render": {
      "excludedStages": [],
      "targets": [
        "browser"
      ],
      "proceduralShip": "auto",
      "credits": true
    },
    "assets": {}
  }
}
`````

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` (edited; `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` is the same blob)
Diff `fdb7ad56..402699d5`:

`````diff
diff --git a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json
index 0b11d12..df7032e 100644
--- a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json
+++ b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json
@@ -6,7 +6,7 @@
   "name": "Villager talk",
   "behaviourId": "talk",
   "catalogue": {
-    "rev": 28
+    "rev": 29
   },
   "createdAt": "2026-11-18T00:00:00Z",
   "updatedAt": "2026-11-18T00:00:00Z",
`````

As merged:

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000001",
  "rev": 1,
  "name": "Villager talk",
  "behaviourId": "talk",
  "catalogue": {
    "rev": 29
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "line": {
      "source": "user",
      "value": "Hello, traveler.",
      "rev": 1,
      "defaultRef": {
        "rev": 28
      },
      "needsReask": null
    },
    "effect": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 28
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` (edited; `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` is the same blob)
Diff `fdb7ad56..402699d5`:

`````diff
diff --git a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json
index eba78ad..e83cfb0 100644
--- a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json
+++ b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json
@@ -6,7 +6,7 @@
   "name": "Ability presentation",
   "behaviourId": "ability-presentation",
   "catalogue": {
-    "rev": 28
+    "rev": 29
   },
   "createdAt": "2026-11-18T00:00:00Z",
   "updatedAt": "2026-11-18T00:00:00Z",
`````

As merged:

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000002",
  "rev": 1,
  "name": "Ability presentation",
  "behaviourId": "ability-presentation",
  "catalogue": {
    "rev": 29
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "shortcut": {
      "source": "user",
      "value": "all-menu",
      "rev": 1,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    },
    "basic_style": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    },
    "spells_style": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    },
    "custom_groups": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 7
      },
      "needsReask": null
    },
    "hand_placement": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    },
    "team_colours": {
      "source": "user",
      "value": [
        {
          "id": "player",
          "label": "Player side",
          "colour": "#2f6fad"
        },
        {
          "id": "rival",
          "label": "Rival side",
          "colour": "#c44a3a"
        },
        {
          "id": "neutral",
          "label": "Neutral side",
          "colour": "#c6a15a"
        },
        {
          "id": "wolves",
          "label": "Wolves",
          "colour": "#b23b32"
        }
      ],
      "rev": 1,
      "defaultRef": {
        "rev": 13
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` (edited; `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` is the same blob)
Diff `fdb7ad56..402699d5`:

`````diff
diff --git a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json
index 9039e75..9aa5d7a 100644
--- a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json
+++ b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json
@@ -6,7 +6,7 @@
   "name": "Army",
   "behaviourId": "unit-roster",
   "catalogue": {
-    "rev": 28
+    "rev": 29
   },
   "createdAt": "2026-11-18T00:00:00Z",
   "updatedAt": "2026-11-18T00:00:00Z",
@@ -29,8 +29,9 @@
       "needsReask": null
     },
     "piece_count": {
-      "source": "default",
-      "rev": 0,
+      "source": "user",
+      "value": 3,
+      "rev": 1,
       "defaultRef": {
         "rev": 1
       },
`````

As merged:

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000003",
  "rev": 1,
  "name": "Army",
  "behaviourId": "unit-roster",
  "catalogue": {
    "rev": 29
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "board_cols": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "board_rows": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "piece_count": {
      "source": "user",
      "value": 3,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "unit_hp": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "unit_atk": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "opening_row": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 16
      },
      "needsReask": null
    },
    "clip_cues": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 8
      },
      "needsReask": null
    },
    "team_colour": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 9
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` (edited; `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` is the same blob)
Diff `fdb7ad56..402699d5`:

`````diff
diff --git a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json
index e70eb19..868d32b 100644
--- a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json
+++ b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json
@@ -6,7 +6,7 @@
   "name": "Archer basic attack",
   "behaviourId": "basic-attack",
   "catalogue": {
-    "rev": 28
+    "rev": 29
   },
   "createdAt": "2026-11-18T00:00:00Z",
   "updatedAt": "2026-11-18T00:00:00Z",
@@ -56,8 +56,9 @@
       "needsReask": null
     },
     "enemy_basic_crosses_barrier": {
-      "source": "default",
-      "rev": 0,
+      "source": "user",
+      "value": false,
+      "rev": 1,
       "defaultRef": {
         "rev": 1
       },
`````

As merged:

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000004",
  "rev": 1,
  "name": "Archer basic attack",
  "behaviourId": "basic-attack",
  "catalogue": {
    "rev": 29
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "reach_mode": {
      "source": "user",
      "value": "custom-cross",
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "custom_ns": {
      "source": "user",
      "value": 3,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "custom_ew": {
      "source": "user",
      "value": 3,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "damage": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "blocked_by_bodies": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "enemy_basic_crosses_barrier": {
      "source": "user",
      "value": false,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "ability_group": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 7
      },
      "needsReask": null
    },
    "effect": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 8
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` (edited; `data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` is the same blob)
Diff `fdb7ad56..402699d5`:

`````diff
diff --git a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json
index e8708b7..af71154 100644
--- a/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json
+++ b/fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json
@@ -6,7 +6,7 @@
   "name": "Archer line shot",
   "behaviourId": "line-shot",
   "catalogue": {
-    "rev": 28
+    "rev": 29
   },
   "createdAt": "2026-11-18T00:00:00Z",
   "updatedAt": "2026-11-18T00:00:00Z",
@@ -72,24 +72,27 @@
       "needsReask": null
     },
     "neutrals_legal": {
-      "source": "default",
-      "rev": 0,
+      "source": "user",
+      "value": false,
+      "rev": 1,
       "defaultRef": {
         "rev": 1
       },
       "needsReask": null
     },
     "hit_class": {
-      "source": "default",
-      "rev": 0,
+      "source": "user",
+      "value": "basic",
+      "rev": 1,
       "defaultRef": {
         "rev": 1
       },
       "needsReask": null
     },
     "mana_cost": {
-      "source": "default",
-      "rev": 0,
+      "source": "user",
+      "value": 0,
+      "rev": 1,
       "defaultRef": {
         "rev": 13
       },
`````

As merged:

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000005",
  "rev": 1,
  "name": "Archer line shot",
  "behaviourId": "line-shot",
  "catalogue": {
    "rev": 29
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z",
  "copiedFrom": null,
  "answers": {
    "directions": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "range": {
      "source": "user",
      "value": 3,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "damage": {
      "source": "user",
      "value": 2,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "stops_on_first": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "barrier_blocks": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": null
    },
    "caster_class": {
      "source": "user",
      "value": "archer",
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "pair_doubles": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "neutrals_legal": {
      "source": "user",
      "value": false,
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "hit_class": {
      "source": "user",
      "value": "basic",
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "mana_cost": {
      "source": "user",
      "value": 0,
      "rev": 1,
      "defaultRef": {
        "rev": 13
      },
      "needsReask": null
    },
    "ability_group": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 7
      },
      "needsReask": null
    },
    "effect": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 8
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  }
}
`````

### `fixtures/demo.tileproj/catalogue/slice.json` (edited; `data/templates/demo.tileproj/catalogue/slice.json` is the same blob)
No short diff is useful (3,718 insertions and 165 deletions against a 617-line stub). Full file as merged. sha256 `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3`, git blob `2d59519b`, 4,170 lines.

`````json
{
  "kind": "catalogue-slice",
  "formatVersion": 1,
  "schema_version": 3,
  "catalogue_rev": 29,
  "gates": {
    "uses-card-hand": {
      "any": [
        {
          "knob": "ability-presentation.shortcut",
          "eq": "all-cards"
        },
        {
          "all": [
            {
              "knob": "ability-presentation.shortcut",
              "eq": "custom"
            },
            {
              "any": [
                {
                  "knob": "ability-presentation.basic_style",
                  "eq": "card-hand"
                },
                {
                  "knob": "ability-presentation.spells_style",
                  "eq": "card-hand"
                },
                {
                  "knob": "ability-presentation.custom_groups",
                  "some": {
                    "field": "style",
                    "eq": "card-hand"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    "uses-menu": {
      "any": [
        {
          "knob": "ability-presentation.shortcut",
          "eq": "all-menu"
        },
        {
          "all": [
            {
              "knob": "ability-presentation.shortcut",
              "eq": "custom"
            },
            {
              "any": [
                {
                  "knob": "ability-presentation.basic_style",
                  "eq": "unit-action-menu"
                },
                {
                  "knob": "ability-presentation.spells_style",
                  "eq": "unit-action-menu"
                },
                {
                  "knob": "ability-presentation.custom_groups",
                  "some": {
                    "field": "style",
                    "eq": "unit-action-menu"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "behaviours": [
    {
      "id": "ability-presentation",
      "name": "Ability Presentation",
      "group": "Presentation",
      "summary": "How abilities are shown and picked, per ability group. Groups (Architecture v0.2 §3.4): `basic` (move, basic attack, wait) and `spells` (every ability a behaviour registers). Each group uses a unit action menu or a card hand; styles may be mixed in one project (CEO 2026-11-09). This is presentation only: abilities cost, target and resolve the same either way.",
      "scope": "grid-tactics",
      "starter_safe": true,
      "knobs": [
        {
          "id": "shortcut",
          "label": "How do players pick abilities?",
          "type": "picker",
          "default": "all-menu",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "all-menu",
              "label": "All menu",
              "renamed_from": [
                "unit-action-menu"
              ]
            },
            {
              "value": "all-cards",
              "label": "All cards",
              "renamed_from": [
                "card-hand"
              ]
            },
            {
              "value": "custom",
              "label": "Custom per group"
            }
          ],
          "proposed": [],
          "status": {
            "default": "CEO-ruling",
            "min": null,
            "max": null,
            "options": "CEO-ruling",
            "step": null
          },
          "rev": 6,
          "default_history": [
            {
              "rev": 4,
              "default": "all-menu"
            }
          ],
          "renamed_from": [
            "style"
          ],
          "depends_on": [],
          "required": true,
          "ask_in_wizard": true,
          "ruling": {
            "by": "CEO (relayed by Chief Of Staff)",
            "date": "2026-11-09",
            "note": "CEO ruling 2026-11-09, relayed by CoS: presentation styles may be mixed within one project (per ability group)"
          },
          "default_note": "Required wizard question. 'All menu' is a fallback for docs and tests only; it is never picked silently for a user. All menu / All cards set every group; Custom shows the per-group pickers."
        },
        {
          "id": "basic_style",
          "label": "Basic actions (move, basic attack, wait): how are they picked?",
          "type": "picker",
          "default": "unit-action-menu",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "unit-action-menu",
              "label": "Unit action menu"
            },
            {
              "value": "card-hand",
              "label": "Card hand"
            }
          ],
          "proposed": [],
          "status": {
            "default": "CEO-ruling",
            "min": null,
            "max": null,
            "options": "CEO-ruling",
            "step": null
          },
          "rev": 6,
          "default_history": [
            {
              "rev": 6,
              "default": "unit-action-menu"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "shortcut"
          ],
          "required": true,
          "ask_in_wizard": true,
          "ruling": {
            "by": "CEO (relayed by Chief Of Staff)",
            "date": "2026-11-09",
            "note": "CEO ruling 2026-11-09, relayed by CoS: presentation styles may be mixed within one project (per ability group)"
          },
          "active_when": {
            "knob": "shortcut",
            "eq": "custom"
          },
          "default_note": "Required only while shortcut = Custom (inactive answers are never asked or validated)."
        },
        {
          "id": "spells_style",
          "label": "Spells and abilities: how are they picked?",
          "type": "picker",
          "default": "unit-action-menu",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "unit-action-menu",
              "label": "Unit action menu"
            },
            {
              "value": "card-hand",
              "label": "Card hand"
            }
          ],
          "proposed": [],
          "status": {
            "default": "CEO-ruling",
            "min": null,
            "max": null,
            "options": "CEO-ruling",
            "step": null
          },
          "rev": 6,
          "default_history": [
            {
              "rev": 6,
              "default": "unit-action-menu"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "shortcut"
          ],
          "required": true,
          "ask_in_wizard": true,
          "ruling": {
            "by": "CEO (relayed by Chief Of Staff)",
            "date": "2026-11-09",
            "note": "CEO ruling 2026-11-09, relayed by CoS: presentation styles may be mixed within one project (per ability group)"
          },
          "active_when": {
            "knob": "shortcut",
            "eq": "custom"
          },
          "default_note": "Required only while shortcut = Custom (inactive answers are never asked or validated)."
        },
        {
          "id": "custom_groups",
          "label": "Extra ability groups",
          "type": "list",
          "default": [],
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 7,
          "default_history": [
            {
              "rev": 7,
              "default": []
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "item": {
            "style": {
              "type": "picker",
              "options": [
                {
                  "value": "unit-action-menu",
                  "label": "Unit action menu"
                },
                {
                  "value": "card-hand",
                  "label": "Card hand"
                }
              ],
              "default": "unit-action-menu"
            }
          },
          "reserved_ids": [
            "basic",
            "spells"
          ]
        },
        {
          "id": "hand_placement",
          "label": "Where does the hand show?",
          "type": "picker",
          "default": "hand-docked",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "hand-docked",
              "label": "Always visible"
            },
            {
              "value": "hand-in-menu",
              "label": "Cards entry in the unit menu"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 6,
          "default_history": [
            {
              "rev": 6,
              "default": "hand-docked"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "ability-presentation.shortcut",
            "ability-presentation.basic_style",
            "ability-presentation.spells_style",
            "ability-presentation.custom_groups"
          ],
          "proposed_options": [
            "hand-in-menu"
          ],
          "active_when": {
            "gate": "uses-card-hand"
          }
        },
        {
          "id": "team_colours",
          "label": "Team colours (code-drawn tokens)",
          "type": "list",
          "default": [
            {
              "id": "player",
              "label": "Player side",
              "colour": "#badcff"
            },
            {
              "id": "rival",
              "label": "Rival side",
              "colour": "#c44a3a"
            },
            {
              "id": "neutral",
              "label": "Neutral side",
              "colour": "#8a8f98"
            }
          ],
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 13,
          "default_history": [
            {
              "rev": 8,
              "default": [
                {
                  "id": "player",
                  "label": "Player side",
                  "colour": "#badcff"
                },
                {
                  "id": "rival",
                  "label": "Rival side",
                  "colour": "#c44a3a"
                }
              ]
            },
            {
              "rev": 13,
              "default": [
                {
                  "id": "player",
                  "label": "Player side",
                  "colour": "#badcff"
                },
                {
                  "id": "rival",
                  "label": "Rival side",
                  "colour": "#c44a3a"
                },
                {
                  "id": "neutral",
                  "label": "Neutral side",
                  "colour": "#8a8f98"
                }
              ]
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "One colour per side id. player = the loadout, rival = enemy pools, neutral = neutrals, unless a stage reassigns them (stage.sides). A user entry whose id no stage uses is kept and gets the warning sideUnassigned, never an error.",
          "keyed_by": "side",
          "item_rulings": {
            "neutral": {
              "by": "Engine Architect",
              "date": "2026-11-09",
              "note": "side id 'neutral' is reserved; team_colours items are keyed by side id (project-format r13 section 6.5 stage.sides)"
            }
          },
          "item": {
            "colour": {
              "type": "colour",
              "default": "#badcff"
            }
          },
          "reserved_ids": [
            "player",
            "rival",
            "neutral"
          ],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "freedom principle: project default, army override"
          }
        }
      ],
      "presets": [
        {
          "id": "btf-card-hand",
          "label": "Before The Fall (menu for basics, cards for spells)",
          "deck": "Before The Fall",
          "cards": "all",
          "overrides": {
            "shortcut": "custom",
            "basic_style": "unit-action-menu",
            "spells_style": "card-hand",
            "hand_placement": "hand-docked"
          },
          "status": "src",
          "source": "/workspace/tileengine/docs/ARCHITECTURE-v0.md §3.4 / §11 C11: BTF basic -> action-menu, spells -> card-hand, hand always on screen; /workspace/g-tile-engine/src/chess/game/towerChessHand.ts (spells are dealt as cards)"
        }
      ],
      "renamed_from": [],
      "retired_knobs": [],
      "menu_order": [
        {
          "question": "How do players pick abilities?",
          "knob_ids": [
            "shortcut"
          ]
        },
        {
          "question": "Custom: how is each ability group picked?",
          "knob_ids": [
            "basic_style",
            "spells_style"
          ]
        },
        {
          "question": "Any extra ability groups, and how is each picked?",
          "knob_ids": [
            "custom_groups"
          ]
        },
        {
          "question": "Card hand: where does the hand show?",
          "knob_ids": [
            "hand_placement"
          ]
        },
        {
          "question": "Team colours for code-drawn tokens",
          "knob_ids": [
            "team_colours"
          ]
        }
      ],
      "banned_combos": [],
      "bans_note": "None known: the rev-13 coverage audit found no invalid knob combination in src or the docs (not an exhaustive proof).",
      "composable_as": []
    },
    {
      "id": "basic-attack",
      "name": "Basic Attack (reach and damage)",
      "group": "Attacks & Shots",
      "summary": "A piece's free-of-mana attack. By default it hits the tiles that piece could step to, for the piece's attack value. Some classes have their own reach (Cleric reaches farther east-west, Acolytes step diagonally but hit only straight).",
      "scope": "grid-tactics",
      "starter_safe": true,
      "knobs": [
        {
          "id": "reach_mode",
          "label": "Reach",
          "type": "picker",
          "default": "same-as-step",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "same-as-step",
              "label": "Same tiles it can step to"
            },
            {
              "value": "custom-cross",
              "label": "Custom reach (set north-south and east-west)"
            },
            {
              "value": "orth-only-1",
              "label": "One tile straight only"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": "same-as-step"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "targeting",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "custom_ns",
          "label": "Custom reach north-south",
          "type": "slider",
          "default": 2,
          "min": 1,
          "max": 3,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 2
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "reach_mode"
          ],
          "ability_field": "targeting",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          },
          "active_when": {
            "knob": "reach_mode",
            "eq": "custom-cross"
          }
        },
        {
          "id": "custom_ew",
          "label": "Custom reach east-west",
          "type": "slider",
          "default": 3,
          "min": 1,
          "max": 3,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 3
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "reach_mode"
          ],
          "ability_field": "targeting",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          },
          "active_when": {
            "knob": "reach_mode",
            "eq": "custom-cross"
          }
        },
        {
          "id": "damage",
          "label": "Damage = attack value",
          "type": "slider",
          "default": 1,
          "min": 0,
          "max": 16,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 1
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "blocked_by_bodies",
          "label": "Bodies block a ranged basic",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "enemy_basic_crosses_barrier",
          "label": "Enemy basic crossing a barrier hits the barrier instead",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "ability_group",
          "label": "Ability group",
          "type": "ref",
          "default": "basic",
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 7,
          "default_history": [
            {
              "rev": 7,
              "default": "basic"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "ability-presentation.custom_groups"
          ],
          "ability_field": "group",
          "ref": {
            "list": "ability-presentation.custom_groups",
            "builtin": [
              "basic",
              "spells"
            ]
          }
        },
        {
          "id": "effect",
          "label": "Effect",
          "type": "ref",
          "default": "none",
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 7,
              "default": "none"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "effect",
          "ref": {
            "docs": "effect",
            "builtin": [
              "none",
              "btf-purple-drop",
              "btf-holy-blade",
              "btf-cut",
              "btf-wrath-cone",
              "btf-heaven-sword",
              "btf-chain-hook",
              "btf-feather",
              "btf-spike",
              "btf-spin-fly-together",
              "btf-spin-split"
            ]
          }
        }
      ],
      "presets": [],
      "renamed_from": [],
      "retired_knobs": [],
      "menu_order": [
        {
          "question": "Does the attack reach the same tiles as the step?",
          "knob_ids": [
            "reach_mode"
          ]
        },
        {
          "question": "If not, set its reach",
          "knob_ids": [
            "custom_ns",
            "custom_ew"
          ]
        },
        {
          "question": "How much damage?",
          "knob_ids": [
            "damage"
          ]
        },
        {
          "question": "What can block it?",
          "knob_ids": [
            "blocked_by_bodies",
            "enemy_basic_crosses_barrier"
          ]
        },
        {
          "question": "Which ability group is it in?",
          "knob_ids": [
            "ability_group"
          ]
        },
        {
          "question": "Which effect does it play?",
          "knob_ids": [
            "effect"
          ]
        }
      ],
      "banned_combos": [
        {
          "id": "basic-attack.reach-mode-eq-custom-cross",
          "when": {
            "knob": "reach_mode",
            "op": "eq",
            "value": "custom-cross"
          },
          "disable": {
            "knob": "reach_mode",
            "value": "custom-cross"
          },
          "reason": "Acolytes hit orthogonally only; a custom reach with diagonals breaks that.",
          "note": "applies only to Acolyte pieces; piece class is not a knob here"
        }
      ],
      "composable_as": [
        "primary"
      ],
      "target_pipes": [
        "unit"
      ],
      "numeric_inputs": [
        "damage"
      ]
    },
    {
      "id": "line-shot",
      "name": "Line Shot (stops on first hit)",
      "group": "Attacks & Shots",
      "summary": "A shot travels in a straight line up to a set range and hits the first body it meets. Can be limited to certain directions, can need a living caster class, and can double when the caster has the right neighbour.",
      "scope": "grid-tactics",
      "starter_safe": false,
      "knobs": [
        {
          "id": "directions",
          "label": "Directions",
          "type": "picker",
          "default": "orthogonal",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "orthogonal",
              "label": "Straight lines (N, E, S, W)"
            },
            {
              "value": "east-west",
              "label": "East or west only"
            },
            {
              "value": "diagonal",
              "label": "Diagonals only"
            }
          ],
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": "src",
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": "orthogonal"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "targeting"
        },
        {
          "id": "range",
          "label": "Range (tiles)",
          "type": "slider",
          "default": 3,
          "min": 1,
          "max": 4,
          "step": 1,
          "options": null,
          "proposed": [
            "min",
            "max"
          ],
          "status": {
            "default": "src",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "src"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 3
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "targeting"
        },
        {
          "id": "damage",
          "label": "Damage",
          "type": "slider",
          "default": 2,
          "min": 1,
          "max": 3,
          "step": 1,
          "options": null,
          "proposed": [
            "min",
            "max"
          ],
          "status": {
            "default": "src",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "src"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 2
            }
          ],
          "renamed_from": [],
          "depends_on": []
        },
        {
          "id": "stops_on_first",
          "label": "Stops on first body",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "barrier_blocks",
          "label": "Earth lines stop the shot",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 3,
          "default_history": [
            {
              "rev": 3,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "@barrier-line"
          ],
          "proposed_options": [
            false
          ],
          "depends_note": "earth lines are edges, not tiles (towerTerrain.ts EarthSeam); they live in Barrier Line"
        },
        {
          "id": "caster_class",
          "label": "Needs living class",
          "type": "picker",
          "default": "mage",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "warrior",
              "label": "Warrior"
            },
            {
              "value": "cleric",
              "label": "Cleric"
            },
            {
              "value": "mage",
              "label": "Mage"
            },
            {
              "value": "archer",
              "label": "Archer"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": "mage"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "pair_doubles",
          "label": "Doubles with a neighbour pair",
          "type": "toggle",
          "default": false,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": false
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "@adjacency-synergy"
          ],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          },
          "depends_note": "needs the Adjacency Synergy behaviour for the neighbour check"
        },
        {
          "id": "neutrals_legal",
          "label": "Can target neutral guardians",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": []
        },
        {
          "id": "hit_class",
          "label": "Counts as",
          "type": "picker",
          "default": "spell",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "spell",
              "label": "Spell hit"
            },
            {
              "value": "basic",
              "label": "Basic hit"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": "spell"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "mana_cost",
          "label": "Mana cost",
          "type": "slider",
          "default": 2,
          "min": 0,
          "max": 14,
          "step": 1,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": "src",
            "max": "src",
            "options": null,
            "step": "src"
          },
          "rev": 13,
          "default_history": [
            {
              "rev": 13,
              "default": 2
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "cost"
        },
        {
          "id": "ability_group",
          "label": "Ability group",
          "type": "ref",
          "default": "spells",
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 7,
          "default_history": [
            {
              "rev": 7,
              "default": "spells"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "ability-presentation.custom_groups"
          ],
          "ability_field": "group",
          "ref": {
            "list": "ability-presentation.custom_groups",
            "builtin": [
              "basic",
              "spells"
            ]
          }
        },
        {
          "id": "effect",
          "label": "Effect",
          "type": "ref",
          "default": "none",
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 7,
              "default": "none"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "effect",
          "ref": {
            "docs": "effect",
            "builtin": [
              "none",
              "btf-purple-drop",
              "btf-holy-blade",
              "btf-cut",
              "btf-wrath-cone",
              "btf-heaven-sword",
              "btf-chain-hook",
              "btf-feather",
              "btf-spike",
              "btf-spin-fly-together",
              "btf-spin-split"
            ]
          }
        }
      ],
      "presets": [
        {
          "id": "btf-fireball",
          "label": "Fireball (BTF)",
          "deck": "Before The Fall",
          "cards": "Fireball",
          "overrides": {
            "barrier_blocks": true
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerTerrain.ts earthStops()"
        }
      ],
      "renamed_from": [],
      "retired_knobs": [],
      "menu_order": [
        {
          "question": "Which directions, and how far?",
          "knob_ids": [
            "directions",
            "range"
          ]
        },
        {
          "question": "How much damage, and what kind of hit?",
          "knob_ids": [
            "damage",
            "hit_class"
          ]
        },
        {
          "question": "Does it stop on the first body, and do earth lines stop it?",
          "knob_ids": [
            "stops_on_first",
            "barrier_blocks"
          ]
        },
        {
          "question": "Which class uses it?",
          "knob_ids": [
            "caster_class"
          ]
        },
        {
          "question": "Any neighbour bonus?",
          "knob_ids": [
            "pair_doubles"
          ]
        },
        {
          "question": "Can it hit neutral guardians?",
          "knob_ids": [
            "neutrals_legal"
          ]
        },
        {
          "question": "How much mana does it cost?",
          "knob_ids": [
            "mana_cost"
          ]
        },
        {
          "question": "Which ability group is it in?",
          "knob_ids": [
            "ability_group"
          ]
        },
        {
          "question": "Which effect does it play?",
          "knob_ids": [
            "effect"
          ]
        }
      ],
      "banned_combos": [],
      "bans_note": "None known: the rev-13 coverage audit found no invalid knob combination in src or the docs (not an exhaustive proof).",
      "composable_as": [
        "primary"
      ],
      "target_pipes": [
        "unit"
      ],
      "numeric_inputs": [
        "damage",
        "mana_cost"
      ]
    },
    {
      "id": "barrier-line",
      "name": "Barrier Line on a Tile Seam (earth) and Cage",
      "group": "Control (stun/trap/push/pull)",
      "summary": "A wall sits on the edge between two tiles, not on a tile. A seam blocks only the side it sits on. It blocks steps for both sides and soaks enemy shots that would cross it; your own shots pass. Variants grow one wall facing an enemy, scatter walls round enemies, or box an enemy in on three sides. It joins a project's closure only through a setup (the ordinary rule); a map's edges alone never pull it in, and without it authored walls are indestructible.",
      "scope": "grid-tactics",
      "starter_safe": false,
      "knobs": [
        {
          "id": "placement",
          "label": "Placed",
          "type": "picker",
          "default": "facing-edge",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "facing-edge",
              "label": "On the edge facing the enemy"
            },
            {
              "value": "random-enemy-seams",
              "label": "On random edges around enemies"
            },
            {
              "value": "cage",
              "label": "A three-sided cage"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": "facing-edge"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "targeting",
          "description": "Edges go through the TILE pipe as a cell plus an edge side (N/E/S/W) (Engine Architect 2026-11-09).",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "line_hp",
          "label": "Wall health",
          "type": "slider",
          "default": 1,
          "min": 1,
          "max": 2,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "max"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "ai-match",
            "max": "PROPOSED",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 1
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "blocks_steps",
          "label": "Blocks steps (both sides)",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "A seam blocks only the side it sits on.",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "soaks_enemy_shots",
          "label": "Soaks enemy shots crossing it",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "A seam blocks only the side it sits on.",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "own_shots_pass",
          "label": "Own shots pass",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "A seam blocks only the side it sits on.",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "max_lines",
          "label": "Lines per use",
          "type": "slider",
          "default": 3,
          "min": 1,
          "max": 3,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "card-list",
            "options": null,
            "step": "card-list"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 3
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "cage_distance",
          "label": "Cage target distance (exact)",
          "type": "slider",
          "default": 2,
          "min": 1,
          "max": 3,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min",
            "max"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "card-list"
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 1,
              "default": 2
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "placement"
          ],
          "ruling_note": "CoS 2026-11-09 ruling 7: docs-only default accepted as a PROPOSED adjustable design value.",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "locked range widened, default stays the BTF value"
          },
          "default_note": "BTF uses 2. Range 1-3 is PROPOSED (CoS 2026-11-09, freedom principle): 1 = adjacent cage; 3 = half the 6-wide board. Other values are allowed; the editor warns (outsideBtf), never blocks."
        },
        {
          "id": "cage_turns",
          "label": "Cage lasts (your turns)",
          "type": "slider",
          "default": 2,
          "min": 1,
          "max": 3,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min",
            "max"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 2
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "placement"
          ],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "mana_cost",
          "label": "Mana cost",
          "type": "slider",
          "default": 2,
          "min": 0,
          "max": 14,
          "step": 1,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": "src",
            "max": "src",
            "options": null,
            "step": "src"
          },
          "rev": 13,
          "default_history": [
            {
              "rev": 13,
              "default": 2
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "cost"
        },
        {
          "id": "ability_group",
          "label": "Ability group",
          "type": "ref",
          "default": "spells",
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 7,
          "default_history": [
            {
              "rev": 7,
              "default": "spells"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "ability-presentation.custom_groups"
          ],
          "ability_field": "group",
          "ref": {
            "list": "ability-presentation.custom_groups",
            "builtin": [
              "basic",
              "spells"
            ]
          }
        },
        {
          "id": "effect",
          "label": "Effect",
          "type": "ref",
          "default": "none",
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 7,
              "default": "none"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ability_field": "effect",
          "ref": {
            "docs": "effect",
            "builtin": [
              "none",
              "btf-purple-drop",
              "btf-holy-blade",
              "btf-cut",
              "btf-wrath-cone",
              "btf-heaven-sword",
              "btf-chain-hook",
              "btf-feather",
              "btf-spike",
              "btf-spin-fly-together",
              "btf-spin-split"
            ]
          }
        }
      ],
      "presets": [],
      "renamed_from": [],
      "retired_knobs": [],
      "menu_order": [
        {
          "question": "How is the wall placed, and how many?",
          "knob_ids": [
            "placement",
            "max_lines"
          ]
        },
        {
          "question": "How tough is it?",
          "knob_ids": [
            "line_hp"
          ]
        },
        {
          "question": "What does it block?",
          "knob_ids": [
            "blocks_steps",
            "soaks_enemy_shots",
            "own_shots_pass"
          ]
        },
        {
          "question": "Cage options",
          "knob_ids": [
            "cage_distance",
            "cage_turns"
          ]
        },
        {
          "question": "How much mana does it cost?",
          "knob_ids": [
            "mana_cost"
          ]
        },
        {
          "question": "Which ability group is it in?",
          "knob_ids": [
            "ability_group"
          ]
        },
        {
          "question": "Which effect does it play?",
          "knob_ids": [
            "effect"
          ]
        }
      ],
      "banned_combos": [
        {
          "id": "barrier-line.placement-eq-cage",
          "when": {
            "knob": "placement",
            "op": "eq",
            "value": "cage"
          },
          "disable": {
            "knob": "cage_distance"
          },
          "reason": "The cage can't be aimed south (source text: N, E or W only).",
          "note": "direction rule, not a knob"
        }
      ],
      "rulings": [
        {
          "by": "CEO",
          "date": "2026-11-10",
          "note": "direct; seams block only their facing edge",
          "applies_to": [
            "placement",
            "blocks_steps",
            "soaks_enemy_shots",
            "own_shots_pass"
          ]
        }
      ],
      "composable_as": [
        "primary"
      ],
      "target_pipes": [
        "tile"
      ],
      "numeric_inputs": [
        "line_hp",
        "max_lines",
        "cage_distance",
        "cage_turns",
        "mana_cost"
      ],
      "invariants": [
        "A seam blocks only the side it sits on. A seam cuts only the one side neighbour across its edge; tiles on its other sides and corners are not blocked, so with a seam to a unit's left or right, attacks aimed from the north or south still hit (CEO 2026-11-10, direct; /workspace/g-tile-engine/src/chess/game/towerTerrain.ts seamBlocks() lines 1251-1263 (per edge: a seam cuts only the one side neighbour across it; corners return false))."
      ]
    },
    {
      "id": "adjacency-synergy",
      "name": "Adjacency Synergy (1 or 2 neighbours)",
      "group": "Adjacency",
      "summary": "'Beside' means one tile N, S, E or W, never diagonal. Abilities check who is beside whom: some need one neighbour of a named class (a gate), some scale per neighbour, some need two pieces beside each other, and some copy or spread to neighbours.",
      "scope": "grid-tactics",
      "starter_safe": false,
      "knobs": [
        {
          "id": "shape",
          "label": "What counts as beside",
          "type": "picker",
          "default": "nesw",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "nesw",
              "label": "N, E, S or W (never diagonal)"
            },
            {
              "value": "king-8",
              "label": "All 8 surrounding tiles"
            }
          ],
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": "src",
            "step": null
          },
          "rev": 5,
          "default_history": [
            {
              "rev": 1,
              "default": "nesw"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "proposed_options": [
            "king-8"
          ]
        },
        {
          "id": "mode",
          "label": "How it uses neighbours",
          "type": "picker",
          "default": "gate",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "gate",
              "label": "Needs a neighbour to work"
            },
            {
              "value": "per-neighbour",
              "label": "For each neighbour"
            },
            {
              "value": "two-beside-each-other",
              "label": "Two of your pieces side by side"
            },
            {
              "value": "copy-to-neighbours",
              "label": "Neighbours copy its stats"
            },
            {
              "value": "self-and-beside-area",
              "label": "Affects it and everyone beside it"
            },
            {
              "value": "hop-to-target-neighbours",
              "label": "Hops to the target's neighbours"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": "gate"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "min_neighbours",
          "label": "Neighbours needed",
          "type": "slider",
          "default": 1,
          "min": 1,
          "max": 2,
          "step": 1,
          "options": null,
          "proposed": [
            "max"
          ],
          "status": {
            "default": "src",
            "min": "src",
            "max": "PROPOSED",
            "options": null,
            "step": "src"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 1
            }
          ],
          "renamed_from": [],
          "depends_on": []
        },
        {
          "id": "class_filter",
          "label": "Neighbour must be",
          "type": "picker",
          "default": "any-ally",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "any-ally",
              "label": "Any ally"
            },
            {
              "value": "warrior",
              "label": "Warrior"
            },
            {
              "value": "cleric",
              "label": "Cleric"
            },
            {
              "value": "mage",
              "label": "Mage"
            },
            {
              "value": "archer",
              "label": "Archer"
            },
            {
              "value": "enemy",
              "label": "An enemy"
            }
          ],
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": "src",
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": "any-ally"
            }
          ],
          "renamed_from": [],
          "depends_on": []
        },
        {
          "id": "measured_from",
          "label": "Count around",
          "type": "picker",
          "default": "own-piece",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "own-piece",
              "label": "Around your piece"
            },
            {
              "value": "target-enemy",
              "label": "Around the target enemy"
            }
          ],
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": "src",
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": "own-piece"
            }
          ],
          "renamed_from": [],
          "depends_on": []
        },
        {
          "id": "per_neighbour",
          "label": "Bonus per neighbour",
          "type": "slider",
          "default": 1,
          "min": 1,
          "max": 2,
          "step": 1,
          "options": null,
          "proposed": [
            "max"
          ],
          "status": {
            "default": "src",
            "min": "src",
            "max": "PROPOSED",
            "options": null,
            "step": "src"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 1
            }
          ],
          "renamed_from": [],
          "depends_on": []
        },
        {
          "id": "counts_self",
          "label": "Piece counts itself",
          "type": "toggle",
          "default": false,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": false
            }
          ],
          "renamed_from": [],
          "depends_on": []
        }
      ],
      "presets": [],
      "renamed_from": [],
      "retired_knobs": [],
      "menu_order": [
        {
          "question": "What counts as beside?",
          "knob_ids": [
            "shape",
            "counts_self"
          ]
        },
        {
          "question": "How does the ability use neighbours?",
          "knob_ids": [
            "mode"
          ]
        },
        {
          "question": "Beside which class, and around whom?",
          "knob_ids": [
            "class_filter",
            "measured_from"
          ]
        },
        {
          "question": "How many neighbours, and how much each?",
          "knob_ids": [
            "min_neighbours",
            "per_neighbour"
          ]
        }
      ],
      "banned_combos": [
        {
          "id": "adjacency-synergy.counts-self-eq-true",
          "when": {
            "knob": "counts_self",
            "op": "eq",
            "value": true
          },
          "disable": {
            "knob": "counts_self",
            "value": true
          },
          "reason": "Every source rule excludes the piece itself."
        }
      ],
      "composable_as": [
        "scaler"
      ],
      "adjusts": [
        "damage",
        "base_damage",
        "amount",
        "bonus"
      ]
    },
    {
      "id": "unit-roster",
      "name": "Army Roster and Opening Formation",
      "group": "Objectives & Win",
      "summary": "Which pieces a side starts with, their health and attack, and where they stand on turn one (own back rank, or front rank).",
      "scope": "grid-tactics",
      "starter_safe": true,
      "knobs": [
        {
          "id": "board_cols",
          "label": "Board columns",
          "type": "slider",
          "default": 6,
          "min": 4,
          "max": 9,
          "step": 1,
          "options": null,
          "proposed": [
            "min",
            "max"
          ],
          "status": {
            "default": "src",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "src"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 6
            }
          ],
          "renamed_from": [],
          "depends_on": []
        },
        {
          "id": "board_rows",
          "label": "Board rows",
          "type": "slider",
          "default": 9,
          "min": 6,
          "max": 12,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min",
            "max"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 9
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "piece_count",
          "label": "Pieces per side",
          "type": "slider",
          "default": 6,
          "min": 1,
          "max": 12,
          "step": 1,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "ai-match",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 6
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "board_cols"
          ],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "unit_hp",
          "label": "Health",
          "type": "slider",
          "default": 9,
          "min": 1,
          "max": 21,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 9
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Set per unit: the roster value is the default for every unit, and a unit can override it in that unit's own stats. L5 difficulty marker l5:'hp' (runtime difficulty.hp; B1 / P1-2).",
          "per_unit": true,
          "l5": "hp",
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "unit_atk",
          "label": "Attack",
          "type": "slider",
          "default": 1,
          "min": 0,
          "max": 2,
          "step": 1,
          "options": null,
          "proposed": [
            "default",
            "min",
            "max"
          ],
          "status": {
            "default": "PROPOSED",
            "min": "PROPOSED",
            "max": "PROPOSED",
            "options": null,
            "step": "ai-match"
          },
          "rev": 1,
          "default_history": [
            {
              "rev": 1,
              "default": 1
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Set per unit: the roster value is the default for every unit, and a unit can override it in that unit's own stats.",
          "per_unit": true,
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "Ruling 7: docs-only default accepted as a PROPOSED adjustable design value (source doc kept)."
          }
        },
        {
          "id": "opening_row",
          "label": "Opening row",
          "type": "picker",
          "default": "back",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "back",
              "label": "Six on the far rank"
            },
            {
              "value": "second",
              "label": "Six on the second rank"
            },
            {
              "value": "front",
              "label": "Five on the front rank (deck shape)",
              "reads": {
                "from": "deck",
                "ref": "deck.openingFront",
                "deck_from": "hand-and-draw.deck",
                "type": "UnitId[]",
                "length": 5,
                "order": "west-to-east",
                "optional": true,
                "malformed": "not an array, or not exactly 5 entries",
                "if_missing": {
                  "use": "back",
                  "warning": "openingShapeMissing",
                  "once_per": "deck",
                  "warning_source": "/workspace/tileengine/data/project-format.md §6.8 (openingFront row line 1126; rules lines 1135-1144; warning table line 1539); /workspace/tileengine/data/setup-format.md §12.4i (lines 2211-2216) and §12.5 L44 (line 2223)"
                },
                "bad_id": {
                  "warning": "unknownRef",
                  "slot": "empty",
                  "note": "the other four are placed"
                },
                "type_source": "/workspace/tileengine/data/core-types.ts CoreDeck (line 194, MAY-MOVE): openingFront?: ReadonlyArray<UnitId> (line 203); UnitId = string (line 39)"
              }
            }
          ],
          "proposed": [],
          "status": {
            "default": "CEO-ruling",
            "min": null,
            "max": null,
            "options": "CEO-ruling",
            "step": null
          },
          "rev": 16,
          "default_history": [
            {
              "rev": 1,
              "default": "back"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "front reads the deck field openingFront (exactly five unit ids, west to east) of the bot side's deck (its effective hand-and-draw.deck). No deck, no openingFront, or a malformed one (not an array, or not exactly 5 entries) opens back with the warning openingShapeMissing, once per deck (once in total with no deck). An id that isn't a unit is unknownRef and that slot stays empty; the other four are placed. back and second ignore openingFront. Source: DSK project-format r14 §6.8, setup-format §12.4i/§12.5 (L44); type UnitId[] in core-types.ts CoreDeck (MAY-MOVE). DSK docs pinned to catalogue rev 17 / 544 knobs.",
          "ruling_note": "rev 17: field and warning named by DSK (project-format r14 §6.8; setup-format §12.5 L44), replacing PENDING-DSK-NAME and the PROPOSED name frontShapeMissing.",
          "ruling": {
            "by": "CEO",
            "date": "2026-11-09",
            "note": "relayed via CoS/DSK L44; user's choice"
          }
        },
        {
          "id": "clip_cues",
          "label": "Hit flash and attack lunge for units without clips",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 8,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "proposed_options": [
            false
          ]
        },
        {
          "id": "team_colour",
          "label": "Team colour",
          "type": "colour",
          "default": null,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 9,
          "default_history": [
            {
              "rev": 8,
              "default": "#badcff"
            },
            {
              "rev": 9,
              "default": null
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "ability-presentation.team_colours"
          ],
          "nullable": true,
          "ruling": {
            "by": "DSK",
            "date": "2026-11-09",
            "note": "L30: nullable, default null = palette; one source of truth (CoS ruling 'project default, army override' unchanged in substance)"
          }
        }
      ],
      "presets": [
        {
          "id": "btf-warrior",
          "label": "Warrior (BTF)",
          "deck": "Before The Fall",
          "cards": "-",
          "overrides": {
            "unit_hp": 9,
            "unit_atk": 1
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 WARRIOR_HP = 9, stampTowerArmy :931-933 hp/ad; towerStrike.ts:33 WARRIOR_DMG = 1, statueStrike :214"
        },
        {
          "id": "btf-archer",
          "label": "Archer (BTF)",
          "deck": "Before The Fall",
          "cards": "-",
          "overrides": {
            "unit_hp": 6,
            "unit_atk": 2
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 BACK_HP = 6, stampTowerArmy :934-937 isArcher hp/ad; towerStrike.ts:34 RANGER_DMG = 2, statueStrike :218"
        },
        {
          "id": "btf-mage",
          "label": "Mage (BTF)",
          "deck": "Before The Fall",
          "cards": "-",
          "overrides": {
            "unit_hp": 6,
            "unit_atk": 2
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 BACK_HP = 6, stampTowerArmy :934-937 isMage hp/ad; towerStrike.ts:35 BACK_DMG = 2, statueStrike :219"
        },
        {
          "id": "btf-cleric",
          "label": "Cleric (BTF)",
          "deck": "Before The Fall",
          "cards": "-",
          "overrides": {
            "unit_hp": 5,
            "unit_atk": 1
          },
          "status": "src",
          "source": "/workspace/g-tile-engine/src/chess/game/towerChess.ts:92 CLERIC_HP = 5, stampTowerArmy :927-929 hp/ad; towerStrike.ts statueStrike :217 return 1 (cleric is not in the :33-35 damage constants)"
        }
      ],
      "renamed_from": [],
      "retired_knobs": [
        {
          "id": "team_colour_override",
          "since_rev": 9,
          "reason": "Folded into the nullable team_colour (null = palette) (setup-format r8 §12.7 Q5, L30).",
          "fold": {
            "into": "team_colour",
            "when_false": "reset"
          }
        },
        {
          "id": "one_unit_per_tile",
          "since_rev": 15,
          "reason": "Cell density lives in the project setting settings.occupancy (project-format r14 §3.1; Engine Architect 2026-11-09).",
          "convert": {
            "to_setting": "settings.occupancy",
            "map": {
              "true": "strict1",
              "false": "softStack"
            },
            "scope": "project-level unit-roster setup only; stage values kept inactive with occupancyStageValueIgnored",
            "old_answer": "kept-inactive"
          }
        }
      ],
      "menu_order": [
        {
          "question": "Board size?",
          "knob_ids": [
            "board_cols",
            "board_rows"
          ]
        },
        {
          "question": "How many pieces?",
          "knob_ids": [
            "piece_count"
          ]
        },
        {
          "question": "Health and attack?",
          "knob_ids": [
            "unit_hp",
            "unit_atk"
          ]
        },
        {
          "question": "Where do they start?",
          "knob_ids": [
            "opening_row"
          ]
        },
        {
          "question": "Flash and lunge units that have no hit or attack clips?",
          "knob_ids": [
            "clip_cues"
          ]
        },
        {
          "question": "Team colour for this army (blank = project palette)",
          "knob_ids": [
            "team_colour"
          ]
        }
      ],
      "banned_combos": [
        {
          "id": "unit-roster.piece-count-gt-board-cols",
          "when": {
            "knob": "piece_count",
            "op": "gt",
            "value": "$board_cols"
          },
          "disable": {
            "knob": "piece_count"
          },
          "reason": "Pieces can't fit on one opening row.",
          "note": "value refers to another knob ($board_cols)"
        }
      ],
      "composable_as": [],
      "resolved_conflicts": [
        {
          "text": "Bot opening: BA 'five front A,M,C,C,W' and Terrain 'five front W,W,W,M,M' vs match-levels 'opens six on far rank'.",
          "ruling": {
            "by": "CEO",
            "date": "2026-11-09",
            "note": "relayed via CoS/DSK L44; user's choice: unit-roster.opening_row back (default) | second | front (per-deck five-piece shape)"
          }
        }
      ]
    },
    {
      "id": "talk",
      "name": "Talk",
      "group": "UI & Feedback",
      "summary": "A short spoken line on a stage neutral, with an optional effect when the line plays. Attached via stage.neutrals[].setupIds (project-format §6.5). Phase 1 interact. Not an ability owner: no ability_group; composable_as is empty. The npc-role IDEA (idle / wander / quest-giver / seller) stays an idea and may share a later placement's setupIds.",
      "scope": "grid-tactics",
      "starter_safe": true,
      "knobs": [
        {
          "id": "line",
          "label": "What they say",
          "type": "text",
          "default": "Hello, traveller.",
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "CONFIRMED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 28,
          "default_history": [
            {
              "rev": 28,
              "default": "Hello, traveller."
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "The line this person says when talked to. max_len 140 is a Unicode code-point count. Missing or empty line shows nothing (D2). Status CONFIRMED: DSK D5 decided the exact default 'Hello, traveller.' (sha256 cf0c9d3b). There is no DSK-ruling status value; CONFIRMED is the status used elsewhere for DSK-accepted decided values (effect.parts). Used on stage.neutrals[].setupIds (project-format §6.5). Related IDEA: npc-role (idle / wander / quest-giver / seller) stays an idea; talk is the Phase 1 placement greet line. A later placement may carry both in setupIds. Rev 29: setup-format r30 (sha256 96929177) — text max_len is a Unicode code-point count (`TextKnobExtras` in §9; r30 length unit). `strayValue` is a §2.5 warning (source \"default\" with a stored value), not a §2.9 rule (§2.9 is list and ref knobs; r30 also counts list labels in code points). project-format r40 (sha256 f4427708) — stage.neutrals[].setupIds is DECIDED (§6.5).",
          "max_len": 140,
          "ruling": {
            "by": "DSK",
            "date": "2026-11-17",
            "note": "2026-11-17-phase1.md D2/D5 (sha256 cf0c9d3b): talk is a setup answer on stage.neutrals[].setupIds (project-format §6.5); line max_len 140 Unicode code points, default \"Hello, traveller.\"; fx.talk maps to talk.effect (default none = house default). There is no DSK-ruling status value; line/default uses CONFIRMED, the status used for DSK-accepted decided values (e.g. effect.parts)."
          }
        },
        {
          "id": "effect",
          "label": "Effect",
          "type": "ref",
          "default": "none",
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 28,
          "default_history": [
            {
              "rev": 28,
              "default": "none"
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Which effect plays when this person is talked to (D5 fx.talk). Default 'none' is the house default (the game's own drawing). PROPOSED, like the other presentation effect knobs.",
          "ref": {
            "docs": "effect",
            "builtin": [
              "none",
              "btf-purple-drop",
              "btf-holy-blade",
              "btf-cut",
              "btf-wrath-cone",
              "btf-heaven-sword",
              "btf-chain-hook",
              "btf-feather",
              "btf-spike",
              "btf-spin-fly-together",
              "btf-spin-split"
            ]
          },
          "ruling": {
            "by": "DSK",
            "date": "2026-11-17",
            "note": "2026-11-17-phase1.md D2/D5 (sha256 cf0c9d3b): talk is a setup answer on stage.neutrals[].setupIds (project-format §6.5); line max_len 140 Unicode code points, default \"Hello, traveller.\"; fx.talk maps to talk.effect (default none = house default). There is no DSK-ruling status value; line/default uses CONFIRMED, the status used for DSK-accepted decided values (e.g. effect.parts)."
          }
        }
      ],
      "presets": [],
      "renamed_from": [],
      "retired_knobs": [],
      "menu_order": [
        {
          "question": "What does this person say?",
          "knob_ids": [
            "line"
          ]
        },
        {
          "question": "Which effect does it play?",
          "knob_ids": [
            "effect"
          ]
        }
      ],
      "banned_combos": [],
      "bans_note": "None: no knob combination is banned.",
      "composable_as": []
    },
    {
      "id": "terrain",
      "name": "Terrain (what each tile id means)",
      "group": "Map & Terrain",
      "summary": "The single home for tile meanings: for each logic tile id, whether units can stand, land or spawn there, whether landing kills, whether a push can enter, and whether it slows or trips. Edge walls (earth lines) are not tiles in the code: they sit on a tile's n/e/s/w edge and live in Barrier Line. Walls on tile edges (the map's logic.edges) always block movement and adjacency across that edge: that is core grid behaviour with no knob. The two wall knobs only decide whether walls also block line of sight and shots.",
      "scope": "grid-tactics",
      "starter_safe": true,
      "knobs": [
        {
          "id": "tile_types",
          "label": "Tile types",
          "type": "list",
          "default": [
            {
              "id": "floor",
              "label": "Floor",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "fallen",
              "label": "Fallen tile (abyss)",
              "open": false,
              "kills_on_landing": true,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "flask",
              "label": "Flask tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "rising",
              "label": "Rising tile (a unit is coming back here)",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "tide",
              "label": "Tide mark",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "warp-mark",
              "label": "Warp mark",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "sword-mark",
              "label": "Sword fade-in tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "boss-cover",
              "label": "Portal boss tile",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "vines",
              "label": "Vines",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": true,
              "trips": false,
              "buildable": false
            },
            {
              "id": "trap",
              "label": "Trap",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": true,
              "buildable": false
            },
            {
              "id": "water",
              "label": "Water",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "lava",
              "label": "Lava",
              "open": true,
              "kills_on_landing": true,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "wall-block",
              "label": "Wall block",
              "open": false,
              "kills_on_landing": false,
              "push_can_enter": false,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "path",
              "label": "Path",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            },
            {
              "id": "dirt",
              "label": "Dirt",
              "open": true,
              "kills_on_landing": false,
              "push_can_enter": true,
              "slows_move": false,
              "trips": false,
              "buildable": false
            }
          ],
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 23,
          "default_history": [
            {
              "rev": 7,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true
                }
              ]
            },
            {
              "rev": 9,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true
                },
                {
                  "id": "water",
                  "label": "Water",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "lava",
                  "label": "Lava",
                  "open": true,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "wall-block",
                  "label": "Wall block",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                }
              ]
            },
            {
              "rev": 10,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true
                },
                {
                  "id": "water",
                  "label": "Water",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "lava",
                  "label": "Lava",
                  "open": true,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false
                },
                {
                  "id": "wall-block",
                  "label": "Wall block",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false
                }
              ]
            },
            {
              "rev": 15,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true,
                  "buildable": false
                },
                {
                  "id": "water",
                  "label": "Water",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "lava",
                  "label": "Lava",
                  "open": true,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "wall-block",
                  "label": "Wall block",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                }
              ]
            },
            {
              "rev": 23,
              "default": [
                {
                  "id": "floor",
                  "label": "Floor",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "fallen",
                  "label": "Fallen tile (abyss)",
                  "open": false,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "flask",
                  "label": "Flask tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "rising",
                  "label": "Rising tile (a unit is coming back here)",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "tide",
                  "label": "Tide mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "warp-mark",
                  "label": "Warp mark",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "sword-mark",
                  "label": "Sword fade-in tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "boss-cover",
                  "label": "Portal boss tile",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "vines",
                  "label": "Vines",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": true,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "trap",
                  "label": "Trap",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": true,
                  "buildable": false
                },
                {
                  "id": "water",
                  "label": "Water",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "lava",
                  "label": "Lava",
                  "open": true,
                  "kills_on_landing": true,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "wall-block",
                  "label": "Wall block",
                  "open": false,
                  "kills_on_landing": false,
                  "push_can_enter": false,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "path",
                  "label": "Path",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                },
                {
                  "id": "dirt",
                  "label": "Dirt",
                  "open": true,
                  "kills_on_landing": false,
                  "push_can_enter": true,
                  "slows_move": false,
                  "trips": false,
                  "buildable": false
                }
              ]
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Built-ins water, lava and wall-block are CONFIRMED engine defaults (Engine Architect 2026-11-09, L27) and the defaultTileType targets of the procedural recipes (project-format r13 section 6.2.2 / 6.4): water@2 and murk@1 give water, lava@2 gives lava, wall gives wall-block, ice@1 gives floor in v1 (slippery ice is a future tile type), the rest give floor. buildable (item field, rev 15, PROPOSED, modes: td; v1: false): whether a structure may be placed on the tile. False on every built-in, floor included: grid tactics has no building and BTF never places structures, so false keeps tactics unchanged; a TD project sets it on its own tile types (Engine Architect / Modes Designer MODES-v2 §3, DSK L41). An added item field, so stored lists are not flagged. Rev 23 (DSK L45): built-ins path and dirt (walkable land, like floor, not buildable); 15 reserved items. wall-block stays the only catalogue spelling; wall_block is a reader alias in the format only (setup-format §2.9.3 rule 7). Existing answers drift by §2.9.3 rules 4 and 6 (appended to the effective value, nothing written).",
          "item_rulings": {
            "water": {
              "by": "Engine Architect",
              "date": "2026-11-09",
              "note": "L27 confirmed: open false, kills_on_landing false, push_can_enter false, slows_move false, trips false"
            },
            "lava": {
              "by": "Engine Architect",
              "date": "2026-11-09",
              "note": "L27 confirmed: open true, kills_on_landing true, push_can_enter true, slows_move false, trips false"
            },
            "wall-block": {
              "by": "Engine Architect",
              "date": "2026-11-09",
              "note": "L27 confirmed: open false, kills_on_landing false, push_can_enter false, slows_move false, trips false"
            },
            "path": {
              "by": "Engine Architect",
              "date": "2026-11-12",
              "note": "L45: built-in walkable land path and dirt (EUX r65 Q-A1/Q-A4); same walkability as floor, not buildable"
            },
            "dirt": {
              "by": "Engine Architect",
              "date": "2026-11-12",
              "note": "L45: built-in walkable land path and dirt (EUX r65 Q-A1/Q-A4); same walkability as floor, not buildable"
            }
          },
          "item": {
            "open": {
              "type": "toggle",
              "default": true
            },
            "kills_on_landing": {
              "type": "toggle",
              "default": false
            },
            "push_can_enter": {
              "type": "toggle",
              "default": true
            },
            "slows_move": {
              "type": "toggle",
              "default": false
            },
            "trips": {
              "type": "toggle",
              "default": false
            },
            "buildable": {
              "type": "toggle",
              "default": false
            }
          },
          "reserved_ids": [
            "floor",
            "fallen",
            "flask",
            "rising",
            "tide",
            "warp-mark",
            "sword-mark",
            "boss-cover",
            "vines",
            "trap",
            "water",
            "lava",
            "wall-block",
            "path",
            "dirt"
          ]
        },
        {
          "id": "lethal_landing_scope",
          "label": "Deadly tiles kill on",
          "type": "picker",
          "default": "any",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "any",
              "label": "Any landing"
            },
            {
              "value": "forced_only",
              "label": "Only forced landings (push, pull)"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": "any"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "tile_types"
          ],
          "description": "Which landings on a kills_on_landing tile kill. UX: the move highlight marks lethal cells and asks to confirm; the AI avoids them unless the scope or rules make it worthwhile.",
          "ruling": {
            "by": "Engine Architect",
            "date": "2026-11-09",
            "note": "lethal landing scope: any (default) or forced_only; shipped as DSK L36"
          }
        },
        {
          "id": "wall_blocks_los",
          "label": "Walls block line of sight",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 8,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "proposed_options": [
            false
          ]
        },
        {
          "id": "wall_blocks_shots",
          "label": "Walls block shots",
          "type": "toggle",
          "default": true,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 8,
          "default_history": [
            {
              "rev": 8,
              "default": true
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "proposed_options": [
            false
          ]
        },
        {
          "id": "push_into_walls",
          "label": "Forced moves slam into walls",
          "type": "toggle",
          "default": false,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [
            "default"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 10,
          "default_history": [
            {
              "rev": 10,
              "default": false
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "description": "Slams into walls. On: a forced move that meets a wall-block or an edge wall stops on the last open cell and the core emits pushBlocked {unit, blocker: wall-block | edge | unit, cellsRemaining}; push-knockback's wall_slam_damage applies. Off: it still stops short, with no event.",
          "ruling_note": "Engine Architect 2026-11-09 supersedes the rev-10 'wall-block tiles only' reading: push_into_walls now covers edge walls too (for the event). No unit enters a closed tile either way (invariant).",
          "ruling": {
            "by": "DSK",
            "date": "2026-11-09",
            "note": "L34: wall-block blocks ordinary moves and all forced movement"
          }
        },
        {
          "id": "lanes_enabled",
          "label": "Board has lanes",
          "type": "toggle",
          "default": false,
          "min": null,
          "max": null,
          "step": null,
          "options": null,
          "proposed": [],
          "status": {
            "default": "CoS-default",
            "min": null,
            "max": null,
            "options": null,
            "step": null
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": false
            }
          ],
          "renamed_from": [],
          "depends_on": [],
          "ruling": {
            "by": "CoS",
            "date": "2026-11-09",
            "note": "lanes are an optional tile-region tag plus a rule hook, off by default"
          }
        },
        {
          "id": "lane_axis",
          "label": "Lanes run along",
          "type": "picker",
          "default": "row",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "row",
              "label": "Rows (left to right)"
            },
            {
              "value": "column",
              "label": "Columns (top to bottom)"
            }
          ],
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": "src",
            "step": null
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": "row"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "lanes_enabled"
          ],
          "active_when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "lane_count",
          "label": "Number of lanes",
          "type": "slider",
          "default": 3,
          "min": 1,
          "max": 9,
          "step": 1,
          "options": null,
          "proposed": [
            "min"
          ],
          "status": {
            "default": "src",
            "min": "PROPOSED",
            "max": "ai-match",
            "options": null,
            "step": "ai-match"
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": 3
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "lanes_enabled"
          ],
          "active_when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "lane_field_lanes",
          "label": "Lane fields can land on",
          "type": "picker",
          "default": "centre-only",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "centre-only",
              "label": "The middle lane only"
            },
            {
              "value": "any",
              "label": "Any lane"
            }
          ],
          "proposed": [],
          "status": {
            "default": "src",
            "min": null,
            "max": null,
            "options": "src",
            "step": null
          },
          "rev": 14,
          "default_history": [
            {
              "rev": 14,
              "default": "centre-only"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "lanes_enabled"
          ],
          "description": "With an even lane_count, 'centre-only' covers both centre lanes (n/2 and n/2+1) (Engine Architect, DSK L43).",
          "active_when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "centre_lane",
          "label": "Centre lane (even lane counts)",
          "type": "picker",
          "default": "lower",
          "min": null,
          "max": null,
          "step": null,
          "options": [
            {
              "value": "lower",
              "label": "Lower (n/2)"
            },
            {
              "value": "upper",
              "label": "Upper (n/2 + 1)"
            }
          ],
          "proposed": [
            "default",
            "options"
          ],
          "status": {
            "default": "PROPOSED",
            "min": null,
            "max": null,
            "options": "PROPOSED",
            "step": null
          },
          "rev": 15,
          "default_history": [
            {
              "rev": 15,
              "default": "lower"
            }
          ],
          "renamed_from": [],
          "depends_on": [
            "lanes_enabled",
            "lane_count"
          ],
          "description": "Used where a behaviour needs one centre lane. lane_field_lanes 'centre-only' covers both centre lanes.",
          "ruling": {
            "by": "Engine Architect",
            "date": "2026-11-09",
            "note": "L43 even lane counts: a single-centre picker, default lower"
          },
          "active_when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        }
      ],
      "presets": [],
      "events": [
        {
          "id": "landedOn",
          "when": "a move ends on a tile (normal, forced, warp/teleport, summon/placement); passing over never counts (EA 2026-11-09)"
        },
        {
          "id": "pushBlocked",
          "when": "push_into_walls on and a forced move meets a wall-block, an edge wall or a unit: {unit, blocker, cellsRemaining} (EA 2026-11-09)"
        },
        {
          "id": "enteredLane",
          "when": "lanes_enabled and a unit's move ends in another lane: {unit, lane} (rule hook, CoS 2026-11-09)"
        }
      ],
      "renamed_from": [],
      "retired_knobs": [],
      "menu_order": [
        {
          "question": "What does each tile type mean?",
          "knob_ids": [
            "tile_types",
            "lethal_landing_scope"
          ]
        },
        {
          "question": "Do walls block line of sight, shots and forced moves?",
          "knob_ids": [
            "wall_blocks_los",
            "wall_blocks_shots",
            "push_into_walls"
          ]
        },
        {
          "question": "Does the board have lanes?",
          "knob_ids": [
            "lanes_enabled"
          ]
        },
        {
          "question": "How are the lanes laid out?",
          "knob_ids": [
            "lane_axis",
            "lane_count",
            "lane_field_lanes",
            "centre_lane"
          ]
        }
      ],
      "banned_combos": [],
      "closure": "always",
      "bans_note": "None known: the rev-13 coverage audit found no invalid knob combination in src or the docs (not an exhaustive proof).",
      "composable_as": [],
      "invariants": [
        "No unit ever occupies a tile with open: false (Engine Architect 2026-11-09)."
      ]
    }
  ]
}
`````
