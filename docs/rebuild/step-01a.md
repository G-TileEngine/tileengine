# Rebuild record: step 1a, project format reader (S1a)

Original brief: [`docs/maker/steps/step-01-project-format.md`](../maker/steps/step-01-project-format.md), section "1a — reader", and the data spec `docs/maker/data/s1-project-load.md` r3 (sha256 `f4e459c35de913c98a37dd1270dc83713699e9a1dba1dcc4fac91d02c9bf670b`). The brief the builder read was the version on base `f137ca26` (sha256 `0e7d7618478cb0a111960d890318ab79168c92980af837cedbab87102cfd2be1`). This file records exactly what shipped. Step 1b comes next, in `step-01b.md`.

Sources: PR #77 and branches `step/step-s1a-project-format-r1-chatA` (tip `5cf1a0fe`, rejected) and `…-r2-chatA` (tip `4c41903e`, merged); `handback/s1a-project-format/r1/HANDBACK.md` (HB1) and `r2/HANDBACK.md` (HB2); `docs/qa/step-s1a-handback-review.md` (QA); Chief Of Staff verify reports `/workspace/share/s1a-verify/report.md` (V1) and `report-r2.md` (V2). Line numbers are at the commit named.

## (a) Start and finish

| | Value |
|---|---|
| Base | main `f137ca266400f68eaf93f1d49eb5c5986831ee96` (step 1 FINAL r6 on top of `8a737c5f`, which is after S0), **1023** tests (V1:45) |
| r1 commits | `73be926` feat (reader), `b86151e` test (slice-of fix), `5cf1a0fe` hand-back. Tree `910dc3eb` (V1:18-30) |
| r1 verdict | QA **NOT OK**, one must-fix (QA:5-7) |
| r2 commits | on top of the r1 tip, no rebase: `619ec5fd` test (P2 keyed by exact line), `4c41903e` hand-back. Tree `a6ca429b` (V2:16-25) |
| Merge | PR #77 "Step 1a: project format reader (S1a r2)", merge commit `aa158fda573aac196965139700e4e9b5fd1bebd5`, 2026-11-18 21:43 (UK time). First parent `cbcf05b` (the QA review doc on main), second parent `4c41903e` |
| Tests | 1023 + N=11 = **1034 pass / 0 fail**. N = 7 reader tests + P1 ×2 + P2 + P3 (HB1:7) |
| Size | `git diff --shortstat f137ca26..4c41903e -- . ':!fixtures/**' ':!data/templates/**'` = 14 files, 390 + 8 = **398** ≤ 400 (V2:49-54). r1 was 387 (V1:53-58) |
| Play stage | untouched. `tools/play-stage` tree `010d1a21` same as the base (V2:36) |

## (b) Files

| File | Change | Lines | Purpose |
|---|---|---|---|
| `src/project/load/types.ts` | new | 30 | Load contract: `ProjectFiles`, `ReportRow`, `ProjectStore`, `ProjectLoad`, and `knownKind(path)` that maps a path to a document kind |
| `src/project/load/migrate.ts` | new | 40 | `versionRows` (hard refusal rows for bad, older or newer `formatVersion`) and `migrateProject` (tile-project 4→5→6 and map 4→5, in memory, deep copy, never writes) |
| `src/project/load/read-project.ts` | new | 110 | `readProject(files)`: pure, never throws, never mutates; version gate, migrate, read each document, cross-refs, warnings, sorted report |
| `src/project/load/index.ts` | new | 3 | Public exports |
| `src/project/read/unit.ts` | edit | 11 | Unit reader accepts `name`, `sprite: null`, and stats as `{ value, rev }` (Q3) |
| `tools/project/slice-of.ts` | new | 19 | `sliceOf(catalogue, ids)`: pure slice of the behaviour catalogue, dropping info keys; output is `JSON.stringify(…, null, 2) + "\n"` |
| `fixtures/demo.tileproj/**` (16 JSON) | new | data | The demo game as one project: `project.json`, `catalogue/slice.json`, 1 map, 1 stage, 7 units, 5 setups |
| `tests/tools/golden/demo-parity.json` | new | 1 | Parity golden captured from the old `DEMO_LOAD` before anything was deleted |
| `tests/project/read-project.test.ts` | new | 83 | Seven reader tests: clean fixture + slice byte-equal, (b) v4 upgrade, (c) v7 refused, (d) missing mapRef, (e) terrain length 53, (f) bad stat, (g) unknown keys and files kept |
| `tests/project/load/law12.test.ts` | new | 27 | Plant P1, two tests: a broken field is a hard row, never a default project; an empty `catch` under `src/project` or `tools/play-stage` fails |
| `tests/project/load/one-parser.test.ts` | new | 15 | Plant P2: no `JSON.parse`, `formatVersion` or `kind ===` in `src/project/load` (except `migrate.ts`) or `tools/play-stage` beyond 12 pinned base lines |
| `tests/project/load/version-reject.test.ts` | new | 17 | Plant P3: missing, `"6"`, `6.5`, `3`, `7` never become current |
| `tests/project/unit-setup.test.ts` | edit | 6 | Unit test follows the Q3 unit format |
| `handback/s1a-project-format/r1/HANDBACK.md`, `r2/HANDBACK.md` | new | 23, 13 | Hand-backs |

## (c) Key code and git commands

Every file's full code is in the appendix at the end of this file, taken from the merge commit `aa158fda`. To see it in git:

```
git log --oneline f137ca26..4c41903e
git diff --stat f137ca26..aa158fda -- src tools tests fixtures
git diff f137ca26..aa158fda -- src/project tools/project tests/project tests/tools/golden
git diff 5cf1a0fe..4c41903e          # the r2 rework only
git show aa158fda:src/project/load/read-project.ts
```

**How the reader is shaped** (`src/project/load/read-project.ts:74-79` at `aa158fda`): no `project.json` → `notAProject`; any version row → read-only refusal with `project: null`; a throw inside migration → one hard `invalidValue` row, never an empty catch.

```ts
export function readProject(files: ProjectFiles): ProjectLoad {
  if (!isObj(files) || !isObj(files["project.json"])) return { ok: false, readOnly: true, project: null, report: [row("notAProject", "hard", "project.json", "missing project.json")] };
  const gate = versionRows(files);
  if (gate.length > 0) return { ok: false, readOnly: true, project: null, report: sort(gate) };
  let migrated: { files: ProjectFiles; report: readonly ReportRow[] };
  try { migrated = migrateProject(files); } catch { return { ok: false, readOnly: true, project: null, report: [row("invalidValue", "hard", "project.json", "unreadable")] }; }
```

**The version gate** (`migrate.ts:4`, `:8-18`): accepted spans are `tile-project [4,6]`, `map [4,5]`, `stage [2,2]`, `unit [2,2]`, `behaviour-setup [3,3]`, `catalogue-slice [1,1]`. Not an integer → `invalidValue`; above the span → `formatNewer`; below → `formatOlder`. All hard.

`readProject` takes already-parsed objects (`ProjectFiles = Readonly<Record<string, unknown>>`, `types.ts:2`), not text. Parsing text is the caller's job.

## (d) What went wrong, in order, and the fix

1. **A brief contradiction made an allowlist necessary** (QA:33). Step 1 r5 said "P2 has no exemptions", but the 1a file table forbade any play-stage edit, and the base play stage already had 12 lines that match the P2 pattern (`JSON.parse` of `build.json` in `build.ts` `ours`/`onlyBuild`, `formatVersion`/`kind` on the old `DEMO_*` constants in `load.ts`, `action.kind ===` in `match.ts`/`board.ts`; V2:71). The builder allowlisted them (HB1:11).
2. **Helper caught a weak slice test, fixed before hand-back** (HB1:15, commit `b86151e`). The slice test only round-tripped the committed file. Fix: `sliceOf` is given the eight ids plus a dropped effect entry and every dropped key, and must still equal `catalogue/slice.json` byte for byte.
3. **`behaviours.json` rev 28 isn't in the repo** (HB1:20). So `catalogue/slice.json` is committed `sliceOf` output at `catalogue_rev` 28, and can't be regenerated from source. Copy it byte for byte from the appendix.
4. **QA must-fix: the allowlist was keyed by line number** (QA:22-37). r1 had `const PLAY = ["board.ts:109", "build.ts:13", …]`. A different `JSON.parse` written on an allowlisted line number stayed green. Repro: replace `build.ts` line 13 with `export const ours = (text: string): boolean => { void JSON.parse(text); return true; };` and P2 still passes.
5. **r2 fix: key by file plus exact line text** (HB2:10, V2:58-81, commit `619ec5fd`). `PLAY` became a `Set` of `` `${name}\t${line}` ``; the scan pushes `name + "\t" + line`. QA's line-13 swap now fails, and a new parse appended to `build.ts` or `read-project.ts` still fails. r2 touched only `one-parser.test.ts` and the r2 hand-back, built on the r1 tip with no rebase (HB2:13, V2:27-30).
6. **r2 push got HTTP 403** (Chief Of Staff delivery notes; no repo file records this). The builder ran the push with the token variable still holding the go-line's placeholder text instead of the real token, so GitHub refused it. Fix: set `GH_BUILDER_TOKEN` to the real value in that shell, then rerun the same one-shot credential-helper push. The branch landed at `4c41903e`.
7. **`check-law.sh` doesn't scan for empty catches** (QA:41-43, HB1:10). The brief's Done-when implied it did. It prints `check:law OK (src)` even with a planted `catch {}`. The P1 plant (`law12.test.ts` test 2) owns that scan.
8. **Carry handed to 1b** (QA:39, V2:100): empty the allowlist once `build.ts` emits raw text; tighten the `kind ===` regex so `action.kind ===` doesn't trip; prove the `.json.js` load at minSdk 26.
9. **Not checked in 1a** (HB1:21): two talk lines (Q7), a side missing from `team_colours`, an off-map placement, a stat outside its knob range.

## (e) Do it right first time

- Base on `f137ca26`. Floor 1023, land at 1034 (N=11). Don't touch `tools/play-stage`, `check-law.sh`, package files, tsconfig, eslint or dep-cruiser.
- `readProject` is pure: it takes parsed objects, never throws (wrap migration and turn a throw into a hard row), never mutates `files` (`structuredClone`), and never invents a default project.
- Version rules: integer only; newer than current is read-only `formatNewer`; older than the floor is `formatOlder`. v4 upgrades in memory and is never written back.
- Every test asserts the input `files` object is unchanged. The fixture report must be `[]`.
- P2 allowlist (1a only): key each pinned line by file name plus the **exact full line text**, never by line number. 1b must empty it.
- An empty `catch {}` is caught by the P1 plant, not by `check-law.sh`.
- Capture the parity golden from the old `DEMO_LOAD` before deleting anything. Hashes: outcome `win`, snapshot `dc959c31…`, log `3278b95a…`, bus `30f1d900…` (full values in (f)).
- Copy `fixtures/demo.tileproj/**` and `catalogue/slice.json` byte for byte; the source catalogue isn't in the repo.
- Push: the token environment variable must hold the real token, not the placeholder text, before running the one-shot credential-helper push. Never print or commit it.

## (f) Rebuild check

```
git worktree add --detach /tmp/s1a aa158fda && cd /tmp/s1a
npm ci && npm run green           # exit 0; tests 1034, fail 0
node --test tests/project/read-project.test.ts tests/project/load/*.test.ts
cat tests/tools/golden/demo-parity.json
# {"outcome":"win","snapshot":"dc959c318ea82b78e37e6cfbefcc2904be17b9640ea95982d9a92d8968b75177","log":"3278b95a57fe08751cec91ecc220ed99d8ef75053148c52a5a7358e7f33a650b","bus":"30f1d9006882e8ba9edc55d2a47cdb0dc8dbd6202dd5cfab2ba236862f90fd80"}
git diff --name-only f137ca26..HEAD -- fixtures data/templates | rg -v '\.json$'   # empty
```

The parity golden is only asserted from 1b on (`tests/tools/play-stage-parity.test.ts`); in 1a it's a captured file. QA recaptured it from the unchanged `DEMO_LOAD` and got the same bytes (QA:19).

Against the merge tree: on your rebuild branch, `git diff aa158fda HEAD -- src tools/project tests/project tests/tools/golden fixtures` must be empty. The blob table below lists the exact git blob id each file must have; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id.

## Blob check

Each file must have exactly this git blob id at `aa158fda`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `fixtures/demo.tileproj/catalogue/slice.json` | `ea41249ce217bc450c3137d876f997995c9089d2` | 617 |
| `fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json` | `e6f3383fb37573474bbcf162ea3d0b7c087ea06d` | 143 |
| `fixtures/demo.tileproj/project.json` | `fdddf778fa9bfb4785d04b0b4ffa60ca7e66b366` | 48 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` | `0b11d12a20f1aeb30886e8bb1f003d1159c40f32` | 39 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` | `eba78ade350fda49a85a29bb448e089a89f6d179` | 93 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` | `9039e75739fd2bc763ddceea0b396f7ec0d2ec60` | 86 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` | `e70eb19788acda4d9427c1c4271cd54fa1bcf40f` | 89 |
| `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` | `e8708b798894a05a02d7e6aa11f35374ad7151b1` | 121 |
| `fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json` | `60796e7129c009b507476570595db80b3e6fc6c5` | 86 |
| `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json` | `548e82e3f52b25f2925426cfed2fac2b0d036b89` | 17 |
| `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json` | `2edfc3fa3b13cf1975a2468fbefdacc2ff59bf8c` | 29 |
| `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json` | `955bb38318ca4e816f5c5c68eefb9796d0ccdab5` | 22 |
| `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json` | `1f8839525259d514eddf0e3ff7278b57fbe52021` | 22 |
| `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000005.json` | `2f9ce57c26350b7cd2295f43598556ec51e2aeed` | 26 |
| `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000006.json` | `2b0dfe593199325d21d6800786ee2faa64c083b3` | 26 |
| `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000007.json` | `ae125ebfa898fa3cdc8a5ff14604c1c3a99c556f` | 26 |
| `src/project/load/index.ts` | `6097004a04ff8cd537d965b40b2eee8532d70c1a` | 3 |
| `src/project/load/migrate.ts` | `a8f01b0cc4237cc41b7a3d02c475674f7baf9c99` | 40 |
| `src/project/load/read-project.ts` | `a640273af6fa52f2711ab894f008cbc07ee7d24a` | 110 |
| `src/project/load/types.ts` | `fcdb1931e084676f6579dbb114b04fe6b9479680` | 30 |
| `src/project/read/unit.ts` | `e71190191ad083af6d9d31d087a956a0cb27e103` | 26 |
| `tests/project/load/law12.test.ts` | `94e3739415359ebf7ed5b9732507ca4513a9083a` | 27 |
| `tests/project/load/one-parser.test.ts` | `a907b6655be50ea2843b8fea88f69f8ad552e352` | 15 |
| `tests/project/load/version-reject.test.ts` | `6dfe522c4c4e619150fce923b060ddb1b1bc12da` | 17 |
| `tests/project/read-project.test.ts` | `d8bebdd62ab7b7f03f4216548e4e600953b32634` | 83 |
| `tests/project/unit-setup.test.ts` | `af3a40b19a104c6415775e027e5e410ee712151a` | 45 |
| `tests/tools/golden/demo-parity.json` | `a7d25f875f352431425329184614876631d71c28` | 1 |
| `tools/project/slice-of.ts` | `016afa9706d651957ad0c316b24faacadcccd39a` | 19 |

## Appendix: full code as merged (S1a, PR #77)
New files are given in full. Edited files are given as the exact diff from `f137ca26` to `aa158fda`, then in full as merged. Copy them byte for byte; the blob table checks you did.

### `fixtures/demo.tileproj/catalogue/slice.json` (new)

`````json
{
  "kind": "catalogue-slice",
  "formatVersion": 1,
  "schema_version": 3,
  "catalogue_rev": 28,
  "gates": {
    "uses-card-hand": {
      "id": "uses-card-hand"
    },
    "uses-menu": {
      "id": "uses-menu"
    }
  },
  "behaviours": [
    {
      "id": "ability-presentation",
      "closure": "when-used",
      "knobs": [
        {
          "id": "shortcut",
          "type": "picker",
          "rev": 1,
          "default": "all-menu",
          "options": [
            "all-menu",
            "basic-only"
          ]
        },
        {
          "id": "basic_style",
          "type": "picker",
          "rev": 1,
          "default": "button",
          "options": [
            "button"
          ]
        },
        {
          "id": "spells_style",
          "type": "picker",
          "rev": 1,
          "default": "button",
          "options": [
            "button"
          ]
        },
        {
          "id": "custom_groups",
          "type": "list",
          "rev": 1,
          "default": []
        },
        {
          "id": "hand_placement",
          "type": "picker",
          "rev": 1,
          "default": "bottom",
          "options": [
            "bottom"
          ]
        },
        {
          "id": "team_colours",
          "type": "list",
          "rev": 1,
          "default": []
        }
      ]
    },
    {
      "id": "basic-attack",
      "closure": "when-used",
      "knobs": [
        {
          "id": "reach_mode",
          "type": "picker",
          "rev": 1,
          "default": "same-as-step",
          "options": [
            "same-as-step",
            "one-tile-straight",
            "custom-cross"
          ]
        },
        {
          "id": "custom_ns",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 1,
          "max": 9,
          "step": 1
        },
        {
          "id": "custom_ew",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 1,
          "max": 9,
          "step": 1
        },
        {
          "id": "damage",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 0,
          "max": 9,
          "step": 1
        },
        {
          "id": "blocked_by_bodies",
          "type": "toggle",
          "rev": 1,
          "default": true
        },
        {
          "id": "enemy_basic_crosses_barrier",
          "type": "toggle",
          "rev": 1,
          "default": false
        },
        {
          "id": "ability_group",
          "type": "picker",
          "rev": 1,
          "default": "basic",
          "options": [
            "basic"
          ]
        },
        {
          "id": "effect",
          "type": "ref",
          "rev": 1,
          "default": "none"
        }
      ]
    },
    {
      "id": "line-shot",
      "closure": "when-used",
      "knobs": [
        {
          "id": "directions",
          "type": "picker",
          "rev": 1,
          "default": "orthogonal",
          "options": [
            "orthogonal"
          ]
        },
        {
          "id": "range",
          "type": "slider",
          "rev": 1,
          "default": 3,
          "min": 1,
          "max": 9,
          "step": 1
        },
        {
          "id": "damage",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 0,
          "max": 9,
          "step": 1
        },
        {
          "id": "stops_on_first",
          "type": "toggle",
          "rev": 1,
          "default": true
        },
        {
          "id": "barrier_blocks",
          "type": "toggle",
          "rev": 1,
          "default": true
        },
        {
          "id": "caster_class",
          "type": "picker",
          "rev": 1,
          "default": "any",
          "options": [
            "any",
            "archer"
          ]
        },
        {
          "id": "pair_doubles",
          "type": "toggle",
          "rev": 1,
          "default": false
        },
        {
          "id": "neutrals_legal",
          "type": "toggle",
          "rev": 1,
          "default": false
        },
        {
          "id": "hit_class",
          "type": "picker",
          "rev": 1,
          "default": "basic",
          "options": [
            "basic"
          ]
        },
        {
          "id": "mana_cost",
          "type": "slider",
          "rev": 1,
          "default": 0,
          "min": 0,
          "max": 9,
          "step": 1
        },
        {
          "id": "ability_group",
          "type": "picker",
          "rev": 1,
          "default": "spell",
          "options": [
            "spell"
          ]
        },
        {
          "id": "effect",
          "type": "ref",
          "rev": 1,
          "default": "none"
        }
      ]
    },
    {
      "id": "barrier-line",
      "closure": "when-used",
      "knobs": [
        {
          "id": "length",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 1,
          "max": 9,
          "step": 1
        }
      ]
    },
    {
      "id": "adjacency-synergy",
      "closure": "when-used",
      "knobs": [
        {
          "id": "bonus",
          "type": "slider",
          "rev": 1,
          "default": 0,
          "min": 0,
          "max": 9,
          "step": 1
        }
      ]
    },
    {
      "id": "unit-roster",
      "closure": "when-used",
      "knobs": [
        {
          "id": "board_cols",
          "type": "slider",
          "rev": 1,
          "default": 6,
          "min": 1,
          "max": 64,
          "step": 1
        },
        {
          "id": "board_rows",
          "type": "slider",
          "rev": 1,
          "default": 9,
          "min": 1,
          "max": 64,
          "step": 1
        },
        {
          "id": "piece_count",
          "type": "slider",
          "rev": 1,
          "default": 3,
          "min": 1,
          "max": 9,
          "step": 1
        },
        {
          "id": "unit_hp",
          "type": "slider",
          "rev": 1,
          "default": 9,
          "min": 1,
          "max": 99,
          "step": 1
        },
        {
          "id": "unit_atk",
          "type": "slider",
          "rev": 1,
          "default": 1,
          "min": 0,
          "max": 99,
          "step": 1
        },
        {
          "id": "opening_row",
          "type": "picker",
          "rev": 1,
          "default": "bottom",
          "options": [
            "bottom"
          ]
        },
        {
          "id": "clip_cues",
          "type": "list",
          "rev": 1,
          "default": []
        },
        {
          "id": "team_colour",
          "type": "picker",
          "rev": 1,
          "default": "side",
          "options": [
            "side"
          ]
        }
      ]
    },
    {
      "id": "talk",
      "closure": "when-used",
      "knobs": [
        {
          "id": "line",
          "type": "text",
          "rev": 1,
          "default": "",
          "max_len": 128
        },
        {
          "id": "effect",
          "type": "ref",
          "rev": 1,
          "default": "none"
        }
      ]
    },
    {
      "id": "terrain",
      "closure": "always",
      "knobs": [
        {
          "id": "tile_types",
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
          "item": {
            "open": true,
            "kills_on_landing": false,
            "push_can_enter": true,
            "slows_move": false,
            "trips": false,
            "buildable": false
          },
          "reserved": true
        },
        {
          "id": "lethal_landing_scope",
          "type": "picker",
          "default": "any",
          "options": [
            "any",
            "forced_only"
          ]
        },
        {
          "id": "wall_blocks_los",
          "type": "toggle",
          "default": true
        },
        {
          "id": "wall_blocks_shots",
          "type": "toggle",
          "default": true
        },
        {
          "id": "push_into_walls",
          "type": "toggle",
          "default": false
        },
        {
          "id": "lanes_enabled",
          "type": "toggle",
          "default": false
        },
        {
          "id": "lane_axis",
          "type": "picker",
          "default": "row",
          "options": [
            "row",
            "column"
          ],
          "when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "lane_count",
          "type": "slider",
          "default": 3,
          "min": 1,
          "max": 9,
          "step": 1,
          "when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "lane_field_lanes",
          "type": "picker",
          "default": "centre-only",
          "options": [
            "centre-only",
            "any"
          ],
          "when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        },
        {
          "id": "centre_lane",
          "type": "picker",
          "default": "lower",
          "options": [
            "lower",
            "upper"
          ],
          "when": {
            "knob": "lanes_enabled",
            "eq": true
          }
        }
      ]
    }
  ]
}
`````

### `fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json` (new)

`````json
{
  "kind": "map",
  "formatVersion": 5,
  "id": "map_01JDAM00000000000000000001",
  "rev": 1,
  "name": "Demo 6x9",
  "cols": 6,
  "rows": 9,
  "tile": null,
  "background": {
    "layers": []
  },
  "layers": [
    {
      "id": "ground",
      "tileset": null,
      "aboveUnits": false,
      "visible": true,
      "tiles": [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ]
    }
  ],
  "logic": {
    "terrain": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "palette": {
      "0": "floor",
      "1": "water",
      "2": "wall-block"
    },
    "edges": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `fixtures/demo.tileproj/project.json` (new)

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
    "catalogueRev": 28,
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

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000001",
  "rev": 1,
  "name": "Villager talk",
  "behaviourId": "talk",
  "catalogue": {
    "rev": 28
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

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000002",
  "rev": 1,
  "name": "Ability presentation",
  "behaviourId": "ability-presentation",
  "catalogue": {
    "rev": 28
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

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000003",
  "rev": 1,
  "name": "Army",
  "behaviourId": "unit-roster",
  "catalogue": {
    "rev": 28
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
      "source": "default",
      "rev": 0,
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

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000004",
  "rev": 1,
  "name": "Archer basic attack",
  "behaviourId": "basic-attack",
  "catalogue": {
    "rev": 28
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
      "source": "default",
      "rev": 0,
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

### `fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json` (new)

`````json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JDAT00000000000000000005",
  "rev": 1,
  "name": "Archer line shot",
  "behaviourId": "line-shot",
  "catalogue": {
    "rev": 28
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
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "hit_class": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "mana_cost": {
      "source": "default",
      "rev": 0,
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

### `fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json` (new)

`````json
{
  "kind": "stage",
  "formatVersion": 2,
  "id": "stage_01JDAS00000000000000000001",
  "rev": 1,
  "name": "Demo stage",
  "mapRef": "map_01JDAM00000000000000000001",
  "seed": 24301,
  "playerSpawns": [
    {
      "c": 0,
      "r": 8,
      "facing": "N"
    },
    {
      "c": 1,
      "r": 8
    }
  ],
  "neutrals": [
    {
      "unitId": "unit_01JDAN00000000000000000006",
      "at": {
        "c": 3,
        "r": 4
      }
    },
    {
      "unitId": "unit_01JDAN00000000000000000007",
      "at": {
        "c": 4,
        "r": 4
      },
      "facing": "W",
      "side": "player"
    },
    {
      "unitId": "unit_01JDAN00000000000000000005",
      "at": {
        "c": 5,
        "r": 4
      },
      "facing": "S",
      "setupIds": [
        "setup_01JDAT00000000000000000001"
      ]
    }
  ],
  "sides": {
    "enemyPool": "wolves"
  },
  "enemyPool": {
    "mode": "fixed",
    "entries": [
      {
        "unitId": "unit_01JDAN00000000000000000004",
        "at": {
          "c": 2,
          "r": 0
        },
        "facing": "S"
      },
      {
        "unitId": "unit_01JDAN00000000000000000004",
        "at": {
          "c": 3,
          "r": 0
        }
      }
    ]
  },
  "loadout": null,
  "rules": [],
  "overrides": {
    "setups": {},
    "units": {}
  },
  "difficulty": null,
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000001",
  "rev": 1,
  "name": "Knight",
  "sprite": null,
  "setupIds": [],
  "stats": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000002",
  "rev": 1,
  "name": "Archer",
  "sprite": null,
  "setupIds": [
    "setup_01JDAT00000000000000000004",
    "setup_01JDAT00000000000000000005"
  ],
  "stats": {
    "unit_hp": {
      "value": 6,
      "rev": 1
    },
    "unit_atk": {
      "value": 2,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000003",
  "rev": 1,
  "name": "Cleric",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 7,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000004",
  "rev": 1,
  "name": "Wolf",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 4,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000005.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000005",
  "rev": 1,
  "name": "Villager",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 4,
      "rev": 1
    },
    "unit_atk": {
      "value": 0,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000006.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000006",
  "rev": 1,
  "name": "Crate",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 3,
      "rev": 1
    },
    "unit_atk": {
      "value": 0,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `fixtures/demo.tileproj/units/unit_01JDAN00000000000000000007.json` (new)

`````json
{
  "kind": "unit",
  "formatVersion": 2,
  "id": "unit_01JDAN00000000000000000007",
  "rev": 1,
  "name": "Merchant",
  "sprite": null,
  "setupIds": [],
  "stats": {
    "unit_hp": {
      "value": 5,
      "rev": 1
    },
    "unit_atk": {
      "value": 0,
      "rev": 1
    }
  },
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": []
  },
  "createdAt": "2026-11-18T00:00:00Z",
  "updatedAt": "2026-11-18T00:00:00Z"
}
`````

### `src/project/load/index.ts` (new)

`````ts
export type { BehaviourSetup, CatalogueSlice, GameMap, ProjectFiles, ProjectLoad, ProjectManifest, ProjectStore, ReportRow, Severity, Stage, Unit } from "./types.ts";
export { migrateProject } from "./migrate.ts";
export { readProject } from "./read-project.ts";
`````

### `src/project/load/migrate.ts` (new)

`````ts
import { knownKind, type ProjectFiles, type ReportRow } from "./types.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const CUR: Readonly<Record<string, readonly [number, number]>> = { "tile-project": [4, 6], map: [4, 5], stage: [2, 2], unit: [2, 2], "behaviour-setup": [3, 3], "catalogue-slice": [1, 1] };
const push = (rows: ReportRow[], code: string, severity: ReportRow["severity"], path: string, detail: string): void => { rows.push({ code, severity, path, detail }); };

/** Hard refusal rows. Empty means every known document has an accepted version. */
export function versionRows(files: ProjectFiles): ReportRow[] {
  const rows: ReportRow[] = [];
  for (const path of Object.keys(files)) {
    const span = CUR[knownKind(path) ?? ""]; if (span === undefined) continue;
    const doc = files[path], ver = isObj(doc) ? doc["formatVersion"] : undefined, where = `${path}#/formatVersion`, detail = `found ${ver === undefined ? "missing" : JSON.stringify(ver)}, reads ≤ ${span[1]}`;
    if (typeof ver !== "number" || !Number.isInteger(ver)) push(rows, "invalidValue", "hard", where, detail);
    else if (ver > span[1]) push(rows, "formatNewer", "hard", where, detail);
    else if (ver < span[0]) push(rows, "formatOlder", "hard", where, detail);
  }
  return rows;
}
function layersOf(bg: Obj): Obj {
  const colour = typeof bg["colour"] === "string" ? { colour: bg["colour"] } : {}, fit = bg["fit"], tile = fit === "tile";
  if (bg["mode"] === "none" || bg["mode"] === "colour") return { ...colour, layers: [] };
  return { ...colour, layers: [{ assetId: bg["assetId"], depth: bg["mode"] === "parallax" && typeof bg["scroll"] === "number" ? bg["scroll"] : 1, repeat: tile ? "both" : "none", fit: tile ? "none" : typeof fit === "string" ? fit : "none" }] };
}

/** §12 in memory: tile-project 004, 005-lite, map 004. Deep copy. Never writes. */
export function migrateProject(files: ProjectFiles): { files: ProjectFiles; report: readonly ReportRow[] } {
  const copy = structuredClone(files) as Record<string, unknown>, report: ReportRow[] = [];
  for (const path of Object.keys(copy)) {
    const doc = copy[path]; if (!isObj(doc)) continue;
    const ver = doc["formatVersion"], project = isObj(doc["project"]) ? doc["project"] : null, assets = project?.["assets"];
    if (path === "project.json" && ver === 4 && project !== null && isObj(project["render"])) { const render = project["render"]; if (render["proceduralShip"] === undefined) render["proceduralShip"] = "auto"; if (render["credits"] === undefined) render["credits"] = true; }
    if (path === "project.json" && ver === 4) { doc["formatVersion"] = 5; push(report, "migrated", "info", path, "tile-project 4→5"); }
    if (path === "project.json" && doc["formatVersion"] === 5) {
      if (isObj(assets) && Object.values(assets).some((a) => isObj(a) && isObj(a["origin"]) && a["origin"]["kind"] === "procedural" && "terrains" in a && a["paintStyle"] === undefined)) push(report, "migrationDeferred", "warning", path, "tile-project 005");
      doc["formatVersion"] = 6; push(report, "migrated", "info", path, "tile-project 5→6");
    }
    if (knownKind(path) === "map" && ver === 4) { if (isObj(doc["background"]) && typeof doc["background"]["mode"] === "string") doc["background"] = layersOf(doc["background"]); doc["formatVersion"] = 5; push(report, "migrated", "info", path, "map 4→5"); }
  }
  return { files: copy, report };
}
`````

### `src/project/load/read-project.ts` (new)

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
      const bad = type === "slider" ? typeof value !== "number" || !Number.isFinite(value) : type === "toggle" ? typeof value !== "boolean" : type === "text" || type === "ref" ? typeof value !== "string" : type === "picker" ? typeof value !== "string" || (Array.isArray(knob["options"]) && !knob["options"].includes(value)) : type === "list" ? !Array.isArray(value) || value.some((item) => !isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string") : false;
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

### `src/project/load/types.ts` (new)

`````ts
/** S1 load contract. Store documents are the migrated JSON (unknown keys kept). */
export type ProjectFiles = Readonly<Record<string, unknown>>;
export type Severity = "hard" | "warning" | "info";
export type ReportRow = { readonly code: string; readonly severity: Severity; readonly path: string; readonly detail?: string };
export type Doc = Readonly<Record<string, unknown>>;
export type ProjectManifest = Doc;
export type CatalogueSlice = Doc;
export type GameMap = Doc;
export type Stage = Doc;
export type Unit = Doc;
export type BehaviourSetup = Doc;
export type ProjectStore = {
  readonly manifest: ProjectManifest; readonly slice: CatalogueSlice;
  readonly maps: Readonly<Record<string, GameMap>>; readonly stages: Readonly<Record<string, Stage>>;
  readonly units: Readonly<Record<string, Unit>>; readonly setups: Readonly<Record<string, BehaviourSetup>>;
  readonly unknownFiles: Readonly<Record<string, unknown>>;
};
export type ProjectLoad =
  | { readonly ok: true; readonly readOnly: false; readonly project: ProjectStore; readonly report: readonly ReportRow[] }
  | { readonly ok: false; readonly readOnly: false; readonly project: ProjectStore; readonly report: readonly ReportRow[] }
  | { readonly ok: false; readonly readOnly: true; readonly project: null; readonly report: readonly ReportRow[] };

const SLOTS: Readonly<Record<string, string>> = { maps: "map", stages: "stage", units: "unit", setups: "behaviour-setup" };
/** Known document path, or null when the file is kept as an unknown. */
export function knownKind(path: string): string | null {
  if (path === "project.json") return "tile-project";
  if (path === "catalogue/slice.json") return "catalogue-slice";
  const m = /^(maps|stages|units|setups)\/[^/]+\.json$/.exec(path);
  return m === null ? null : SLOTS[m[1] ?? ""] ?? null;
}
`````

### `src/project/read/unit.ts` (edited)
Diff `f137ca26..aa158fda`:

`````diff
diff --git a/src/project/read/unit.ts b/src/project/read/unit.ts
index 8597078..e711901 100644
--- a/src/project/read/unit.ts
+++ b/src/project/read/unit.ts
@@ -1,11 +1,11 @@
 import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr, strs, type ReadResult } from "./guard.ts";
 
 const SKIP = new Set(["__proto__", "constructor", "prototype", "toString"]);
-export type UnitRead = { readonly kind: "unit"; readonly formatVersion: 2; readonly id: string; readonly rev: number; readonly sprite?: string; readonly setupIds?: readonly string[]; readonly stats?: Readonly<Record<string, number>> };
+export type UnitRead = { readonly kind: "unit"; readonly formatVersion: 2; readonly id: string; readonly rev: number; readonly name?: string; readonly sprite?: string | null; readonly setupIds?: readonly string[]; readonly stats?: Readonly<Record<string, number>> };
 function statsOf(v: unknown): Record<string, number> | null {
   if (!isObj(v)) return null;
   const out: Record<string, number> = {};
-  for (const key of Object.keys(v)) { if (SKIP.has(key)) continue; const n = v[key]; if (typeof n !== "number" || !Number.isFinite(n)) return null; out[key] = n; }
+  for (const key of Object.keys(v)) { if (SKIP.has(key) || !Object.hasOwn(v, key)) continue; const n = v[key]; if (!isObj(n) || typeof n.value !== "number" || !Number.isFinite(n.value) || !isInt(n.rev, 0)) return null; out[key] = n.value; }
   return out;
 }
 export function readUnit(json: unknown): ReadResult<UnitRead> {
@@ -14,12 +14,13 @@ export function readUnit(json: unknown): ReadResult<UnitRead> {
     if (ver !== null) return ver;
     if (!isObj(json) || !isStr(json.id)) return bad("id");
     if (!isInt(json.rev, 0)) return bad("rev");
-    if (json.sprite !== undefined && !isStr(json.sprite)) return bad("sprite");
+    if (json.name !== undefined && !isStr(json.name)) return bad("name");
+    if (json.sprite !== undefined && json.sprite !== null && !isStr(json.sprite)) return bad("sprite");
     let setupIds: readonly string[] | undefined;
     if (json.setupIds !== undefined) { const ids = strs(json.setupIds); if (ids === null) return bad("setupIds"); setupIds = ids; }
     let stats: Record<string, number> | undefined;
     if (json.stats !== undefined) { const got = statsOf(json.stats); if (got === null) return bad("stats"); stats = got; }
-    const sprite = json.sprite;
-    return { ok: true, notices: [], doc: { kind: "unit", formatVersion: CURRENT_FORMAT_VERSIONS.unit, id: json.id, rev: json.rev, ...(sprite === undefined ? {} : { sprite }), ...(setupIds === undefined ? {} : { setupIds }), ...(stats === undefined ? {} : { stats }) } };
+    const sprite = json.sprite; const name = json.name;
+    return { ok: true, notices: [], doc: { kind: "unit", formatVersion: CURRENT_FORMAT_VERSIONS.unit, id: json.id, rev: json.rev, ...(typeof name === "string" ? { name } : {}), ...(sprite === undefined ? {} : { sprite }), ...(setupIds === undefined ? {} : { setupIds }), ...(stats === undefined ? {} : { stats }) } };
   }, json);
 }
`````

Full file at `aa158fda`:

`````ts
import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, guarded, isInt, isObj, isStr, strs, type ReadResult } from "./guard.ts";

const SKIP = new Set(["__proto__", "constructor", "prototype", "toString"]);
export type UnitRead = { readonly kind: "unit"; readonly formatVersion: 2; readonly id: string; readonly rev: number; readonly name?: string; readonly sprite?: string | null; readonly setupIds?: readonly string[]; readonly stats?: Readonly<Record<string, number>> };
function statsOf(v: unknown): Record<string, number> | null {
  if (!isObj(v)) return null;
  const out: Record<string, number> = {};
  for (const key of Object.keys(v)) { if (SKIP.has(key) || !Object.hasOwn(v, key)) continue; const n = v[key]; if (!isObj(n) || typeof n.value !== "number" || !Number.isFinite(n.value) || !isInt(n.rev, 0)) return null; out[key] = n.value; }
  return out;
}
export function readUnit(json: unknown): ReadResult<UnitRead> {
  return guarded(() => {
    const ver = checkVersion(json, "unit");
    if (ver !== null) return ver;
    if (!isObj(json) || !isStr(json.id)) return bad("id");
    if (!isInt(json.rev, 0)) return bad("rev");
    if (json.name !== undefined && !isStr(json.name)) return bad("name");
    if (json.sprite !== undefined && json.sprite !== null && !isStr(json.sprite)) return bad("sprite");
    let setupIds: readonly string[] | undefined;
    if (json.setupIds !== undefined) { const ids = strs(json.setupIds); if (ids === null) return bad("setupIds"); setupIds = ids; }
    let stats: Record<string, number> | undefined;
    if (json.stats !== undefined) { const got = statsOf(json.stats); if (got === null) return bad("stats"); stats = got; }
    const sprite = json.sprite; const name = json.name;
    return { ok: true, notices: [], doc: { kind: "unit", formatVersion: CURRENT_FORMAT_VERSIONS.unit, id: json.id, rev: json.rev, ...(typeof name === "string" ? { name } : {}), ...(sprite === undefined ? {} : { sprite }), ...(setupIds === undefined ? {} : { setupIds }), ...(stats === undefined ? {} : { stats }) } };
  }, json);
}
`````

### `tests/project/load/law12.test.ts` (new)

`````ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";

const project = { kind: "tile-project", formatVersion: 6, project: { id: "p", rev: 1, catalogueRev: 28, settings: { wrapEdges: false }, stages: [] as string[], rules: [] as string[], loadout: { roster: [] as string[], size: 0, required: [] as string[] } } };
const slice = { kind: "catalogue-slice", formatVersion: 1 };

test("P1: a non-object or a broken field is a hard row, never a default project", () => {
  const broken = { "project.json": project, "catalogue/slice.json": slice, "units/u.json": { kind: "unit", formatVersion: 2, id: "u", rev: 1, stats: { unit_hp: { value: "no", rev: 1 } } } };
  const before = structuredClone(broken), got = readProject(broken);
  assert.deepEqual(broken, before); assert.equal(got.ok, false); assert.equal(got.readOnly, false); assert.notEqual(got.project, null);
  assert.equal(got.report.some((r) => r.code === "invalidValue" && r.severity === "hard" && r.path === "units/u.json#/stats"), true);
  assert.equal(got.project?.units["u"] !== undefined, true); assert.equal(JSON.stringify(got.project).includes("\"Demo\""), false);
  const naked = readProject({ "project.json": project, "catalogue/slice.json": slice, "units/u.json": 1 });
  assert.equal(naked.ok, false); assert.equal(naked.readOnly, true); assert.equal(naked.project, null);
  assert.equal(naked.report.some((r) => r.code === "invalidValue" && r.severity === "hard" && r.path.startsWith("units/u.json")), true);
  const root = readProject({ "project.json": [] });
  assert.equal(root.ok, false); assert.equal(root.project, null); assert.equal(root.report[0]?.code, "notAProject"); assert.equal(root.report[0]?.path, "project.json");
});

test("P1: an empty catch under src/project or tools/play-stage fails this plant", () => {
  const hits: string[] = [];
  const walk = (dir: string): void => { for (const ent of readdirSync(dir, { withFileTypes: true })) { const path = join(dir, ent.name); if (ent.isDirectory()) walk(path); else if (ent.name.endsWith(".ts") && /catch(?:\s*\([^)]*\))?\s*\{\s*\}/.test(readFileSync(path, "utf8"))) hits.push(path); } };
  walk("src/project"); walk("tools/play-stage"); assert.deepEqual(hits, []);
});
`````

### `tests/project/load/one-parser.test.ts` (new)

`````ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
const RE = /JSON\.parse|formatVersion|kind ===/;
const PLAY = new Set(["board.ts\t    if (stepped.action?.kind === \"move\" && stepped.path !== undefined && selected !== null) {","build.ts\texport const ours = (text: string): boolean => { try { const v = JSON.parse(text) as Record<string, unknown>; return Object.keys(v).join() === \"commit,node,entry,files\" && typeof v[\"commit\"] === \"string\" && /^[0-9a-f]{40}$/.test(v[\"commit\"]) && typeof v[\"node\"] === \"string\" && v[\"entry\"] === \"index.html\" && typeof v[\"files\"] === \"object\" && v[\"files\"] !== null && !Array.isArray(v[\"files\"]); } catch { return false; } };","build.ts\texport const onlyBuild = (out: string, text: string): boolean => { const files = (JSON.parse(text) as { files: Record<string, unknown> }).files; return readdirSync(out, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).every((e) => { const name = relative(out, join(e.parentPath, e.name)).replaceAll(\"\\\\\", \"/\"); return name === \"build.json\" || Object.hasOwn(files, name); }); };","load.ts\texport const DEMO_MANIFEST = { kind: \"tile-project\", formatVersion: 6, project: { id: \"demo\", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: [\"stage-demo\"], rules: [] as string[], loadout: { roster: [\"knight\", \"archer\", \"cleric\"], size: 3, required: [\"knight\"] } } };","load.ts\texport const DEMO_MAP = { kind: \"map\", formatVersion: 5, id: \"map-6x9\", rev: 1, cols: 6, rows: 9, logic: { terrain: \"000000000000020000100000110000100000000022000000000000\".split(\"\").map(Number), palette: { \"0\": \"floor\", \"1\": \"water\", \"2\": \"rock\" }, edges: [] as const } };","load.ts\t  kind: \"stage\", formatVersion: 2, id: \"stage-demo\", rev: 1, mapRef: \"map-6x9\", seed: DEMO_SEED, setupIds: [\"talk-villager\"],","match.ts\t      if (action.kind === \"move\" && landMove(action)) return;","match.ts\t      if (typeof step === \"object\" && step !== null && \"action\" in step && step.action?.kind === \"interact\") {","match.ts\t      } else if (typeof step === \"object\" && step !== null && \"action\" in step && step.action?.kind === \"ability\") settle();","match.ts\t      const list = kind === \"spell\" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === \"talk\" ? \"interact\" : \"basic\", rules);","match.ts\t      const step = baseIntend({ type: \"ChooseAction\", actionId: kind === \"talk\" ? \"interact\" : kind, unitId: id });","match.ts\t      play.aims = cells(list); play.aimKind = kind === \"spell\" ? \"spell\" : \"basic\"; return null;"]);
function hits(dir: string, skip: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) for (const line of readFileSync(join(dir, name), "utf8").split("\n")) if (RE.test(line)) out.push(name + "\t" + line);
  return out;
}
test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===", () => {
  assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !PLAY.has(hit)), []);
});
`````

### `tests/project/load/version-reject.test.ts` (new)

`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";

const body = { id: "p", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: [] as string[], rules: [] as string[], loadout: { roster: [] as string[], size: 0, required: [] as string[] } };

test("P3: missing, string, fractional, older and newer formatVersion never become current", () => {
  const cases: readonly (readonly [unknown, string])[] = [[undefined, "invalidValue"], ["6", "invalidValue"], [6.5, "invalidValue"], [3, "formatOlder"], [7, "formatNewer"]];
  for (const [ver, code] of cases) {
    const doc: { kind: string; project: typeof body; formatVersion?: unknown } = { kind: "tile-project", project: body };
    if (ver !== undefined) doc.formatVersion = ver;
    const files = { "project.json": doc }, before = structuredClone(files), got = readProject(files);
    assert.deepEqual(files, before, String(ver)); assert.equal(got.ok, false, String(ver)); assert.equal(got.readOnly, true, String(ver));
    assert.equal(got.project, null, String(ver)); assert.equal(got.report[0]?.code, code, String(ver)); assert.equal(got.report[0]?.severity, "hard", String(ver));
    assert.equal(got.report[0]?.path.startsWith("project.json"), true, String(ver)); assert.equal(got.report.some((r) => r.code === "migrated"), false, String(ver));
  }
});
`````

### `tests/project/read-project.test.ts` (new)

`````ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { readProject, type ProjectLoad } from "../../src/project/load/index.ts";
import { sliceOf, type CatalogueDoc } from "../../tools/project/slice-of.ts";
const root = join(dirname(fileURLToPath(import.meta.url)), "../../fixtures/demo.tileproj");
const MAP = "maps/map_01JDAM00000000000000000001.json", STAGE = "stages/stage_01JDAS00000000000000000001.json";
const ARCHER = "units/unit_01JDAN00000000000000000002.json", KNIGHT = "units/unit_01JDAN00000000000000000001.json";
const IDS = ["ability-presentation", "basic-attack", "line-shot", "barrier-line", "adjacency-synergy", "unit-roster", "talk", "terrain"];
function walk(dir: string, base = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const rel = base === "" ? ent.name : `${base}/${ent.name}`;
    if (ent.isDirectory()) Object.assign(out, walk(join(dir, ent.name), rel));
    else out[rel] = JSON.parse(readFileSync(join(dir, ent.name), "utf8")) as unknown;
  }
  return out;
}
const bag = (): Record<string, unknown> => walk(root);
const obj = (v: unknown): Record<string, unknown> => (typeof v === "object" && v !== null && !Array.isArray(v) ? v as Record<string, unknown> : {});
function kept(files: Record<string, unknown>): ProjectLoad {
  const before = structuredClone(files), got = readProject(files);
  assert.deepEqual(files, before);
  return got;
}
test("fixture clean, and slice-of is byte-equal to catalogue/slice.json", () => {
  const files = bag(), got = kept(files), text = readFileSync(join(root, "catalogue/slice.json"), "utf8");
  const raw = JSON.parse(text) as { schema_version: number; catalogue_rev: number; gates: unknown; behaviours: Record<string, unknown>[] };
  const drop = { sources: ["x"], variants: [], used_by: [], conflicts: [], needs_reverify: true };
  const behaviours = [...raw.behaviours.map((b) => ({ ...b, ...drop, knobs: Array.isArray(b["knobs"]) ? (b["knobs"] as Record<string, unknown>[]).map((knob) => ({ ...knob, default_source: "y", item_cites: [], item_sources: [] })) : [] })), { id: "effect", ...drop, knobs: [] }];
  const cat: CatalogueDoc = { schema_version: raw.schema_version, catalogue_rev: raw.catalogue_rev, gates: raw.gates, behaviours };
  assert.equal(got.ok, true); assert.equal(got.readOnly, false); assert.deepEqual([...got.report], []);
  assert.equal(sliceOf(cat, IDS), text);
  assert.deepEqual(raw.behaviours.map((b) => b["id"]), IDS);
  assert.equal(Object.keys(files).every((path) => path.endsWith(".json")), true);
});
test("(b) v4 tile-project and map upgrade to the v6/v5 store", () => {
  const clean = readProject(bag()), files = bag(), project = obj(files["project.json"]), render = obj(obj(project["project"])["render"]);
  project["formatVersion"] = 4; delete render["proceduralShip"]; delete render["credits"];
  const map = obj(files[MAP]); map["formatVersion"] = 4; map["background"] = { mode: "none" };
  const got = kept(files);
  assert.equal(got.ok, true); assert.equal(project["formatVersion"], 4); assert.deepEqual(got.project, clean.project);
  assert.deepEqual(got.report.filter((r) => r.code === "migrated").map((r) => r.detail), ["map 4→5", "tile-project 4→5", "tile-project 5→6"]);
});
test("(c) v7 is refused read-only and does not throw", () => {
  const files = bag(); obj(files["project.json"])["formatVersion"] = 7;
  assert.doesNotThrow(() => readProject(files));
  const got = kept(files);
  assert.equal(got.ok, false); assert.equal(got.readOnly, true); assert.equal(got.project, null);
  assert.equal(got.report[0]?.code, "formatNewer"); assert.equal(got.report[0]?.path.startsWith("project.json"), true);
});
test("(d) H3 missing mapRef is a hard brokenRef and the project stays", () => {
  const files = bag(); obj(files[STAGE])["mapRef"] = "map_missing";
  const got = kept(files), row = got.report.find((r) => r.code === "brokenRef");
  assert.equal(got.ok, false); assert.equal(got.readOnly, false); assert.notEqual(got.project, null);
  assert.equal(row?.severity, "hard"); assert.equal(row?.path, `${STAGE}#/mapRef`);
  assert.equal(got.project?.maps["map_01JDAM00000000000000000001"] !== undefined && got.project?.stages["stage_01JDAS00000000000000000001"] !== undefined, true);
});
test("(e) H5 terrain of length 53 is a hard terrainLength", () => {
  const files = bag(), logic = obj(obj(files[MAP])["logic"]);
  logic["terrain"] = (logic["terrain"] as unknown[]).slice(0, 53);
  const got = kept(files), row = got.report.find((r) => r.code === "terrainLength");
  assert.equal(got.ok, false); assert.equal(row?.severity, "hard"); assert.equal(row?.path, `${MAP}#/logic/terrain`);
  assert.equal(String(row?.detail).includes("53"), true);
});
test("(f) H2 archer stats.unit_hp.value string is a hard invalidValue", () => {
  const files = bag(), stats = obj(obj(files[ARCHER])["stats"]);
  obj(stats["unit_hp"])["value"] = "6";
  const got = kept(files), row = got.report.find((r) => r.code === "invalidValue" && r.path === `${ARCHER}#/stats`);
  assert.equal(got.ok, false); assert.equal(got.readOnly, false); assert.equal(row?.severity, "hard");
  assert.equal(got.project?.units["unit_01JDAN00000000000000000002"] !== undefined, true);
});
test("(g) unknown keys and an extra file are kept", () => {
  const files = bag();
  obj(files["project.json"])["futureKey"] = 1; obj(files[KNIGHT])["futureKey"] = { keep: true }; files["notes/x.json"] = { note: true };
  const got = kept(files);
  assert.equal(got.ok, true); assert.equal(obj(got.project?.manifest)["futureKey"], 1);
  assert.deepEqual(obj(got.project?.units["unit_01JDAN00000000000000000001"])["futureKey"], { keep: true });
  assert.deepEqual(got.project?.unknownFiles["notes/x.json"], { note: true });
  assert.equal(got.report.some((r) => r.code === "unknownFile" && r.severity === "warning" && r.path === "notes/x.json"), true);
});
`````

### `tests/project/unit-setup.test.ts` (edited)
Diff `f137ca26..aa158fda`:

`````diff
diff --git a/tests/project/unit-setup.test.ts b/tests/project/unit-setup.test.ts
index e45ea24..af3a40b 100644
--- a/tests/project/unit-setup.test.ts
+++ b/tests/project/unit-setup.test.ts
@@ -7,13 +7,13 @@ const unit = (more: Record<string, unknown> = {}) => ({ kind: "unit", formatVers
 const setup = (more: Record<string, unknown> = {}) => ({ kind: "behaviour-setup", formatVersion: 3, id: "ls", behaviourId: "line-shot", catalogue: { rev: 26 }, ...more });
 
 test("readUnit: v2 subset sprite, setupIds, stats; a bad field is refused; core identity is kept", () => {
-  const ok = readUnit(unit({ sprite: "mage.png", setupIds: ["ls", "ba"], stats: { reach: 4, damage: 3 } }));
+  const ok = readUnit(unit({ name: "Mage", sprite: "mage.png", setupIds: ["ls", "ba"], stats: { reach: { value: 4, rev: 1 }, damage: { value: 3, rev: 1 } } }));
   assert.equal(ok.ok, true);
-  if (ok.ok) assert.deepEqual(ok.doc, { kind: "unit", formatVersion: 2, id: "mage", rev: 1, sprite: "mage.png", setupIds: ["ls", "ba"], stats: { reach: 4, damage: 3 } });
+  if (ok.ok) assert.deepEqual(ok.doc, { kind: "unit", formatVersion: 2, id: "mage", rev: 1, name: "Mage", sprite: "mage.png", setupIds: ["ls", "ba"], stats: { reach: 4, damage: 3 } });
   assert.equal(readUnit(unit()).ok, true);
   assert.equal(readUnit(unit({ sprite: 1 })).ok, false);
   assert.equal(readUnit(unit({ setupIds: [1] })).ok, false);
-  assert.equal(readUnit(unit({ stats: { reach: "x" } })).ok, false);
+  assert.equal(readUnit(unit({ stats: { reach: { value: "x", rev: 1 } } })).ok, false);
   assert.equal(readUnit({ kind: "unit", formatVersion: 1, id: "mage", rev: 1 }).ok, false);
 });
 
`````

Full file at `aa158fda`:

`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { readSetup, readStage, readStageOverrides, readUnit } from "../../src/project/read/index.ts";

const L = { picks: 8, waveUnits: 16 };
const unit = (more: Record<string, unknown> = {}) => ({ kind: "unit", formatVersion: 2, id: "mage", rev: 1, ...more });
const setup = (more: Record<string, unknown> = {}) => ({ kind: "behaviour-setup", formatVersion: 3, id: "ls", behaviourId: "line-shot", catalogue: { rev: 26 }, ...more });

test("readUnit: v2 subset sprite, setupIds, stats; a bad field is refused; core identity is kept", () => {
  const ok = readUnit(unit({ name: "Mage", sprite: "mage.png", setupIds: ["ls", "ba"], stats: { reach: { value: 4, rev: 1 }, damage: { value: 3, rev: 1 } } }));
  assert.equal(ok.ok, true);
  if (ok.ok) assert.deepEqual(ok.doc, { kind: "unit", formatVersion: 2, id: "mage", rev: 1, name: "Mage", sprite: "mage.png", setupIds: ["ls", "ba"], stats: { reach: 4, damage: 3 } });
  assert.equal(readUnit(unit()).ok, true);
  assert.equal(readUnit(unit({ sprite: 1 })).ok, false);
  assert.equal(readUnit(unit({ setupIds: [1] })).ok, false);
  assert.equal(readUnit(unit({ stats: { reach: { value: "x", rev: 1 } } })).ok, false);
  assert.equal(readUnit({ kind: "unit", formatVersion: 1, id: "mage", rev: 1 }).ok, false);
});

test("readSetup keeps answers; readStageOverrides is additive and readStage still loads a stage that carries them", () => {
  const s = readSetup(setup({ answers: { reach: { source: "user", value: 4, rev: 1 } } }));
  assert.equal(s.ok, true);
  if (s.ok) assert.equal(s.doc.behaviourId, "line-shot");
  const noCat = readSetup({ kind: "behaviour-setup", formatVersion: 3, id: "ls", behaviourId: "line-shot" });
  assert.equal(noCat.ok, false);
  assert.equal(noCat.ok === false && "error" in noCat ? noCat.error : "", "bad field catalogue");
  const stage = { kind: "stage", formatVersion: 2, id: "s", rev: 1, mapRef: "m", playerSpawns: [{ c: 0, r: 0 }], neutrals: [], enemyPool: { mode: "fixed", entries: [] }, loadout: null, rules: [], overrides: { ls: { reach: 4 } } };
  const ov = readStageOverrides(stage);
  assert.equal(ov.ok, true);
  if (ov.ok) assert.deepEqual(ov.doc, { ls: { reach: 4 } });
  const bag: Record<string, unknown> = Object.create(null);
  bag.ls = { reach: 4 };
  bag["__proto__"] = { x: 1 };
  const proto = readStageOverrides({ overrides: bag });
  assert.equal(proto.ok, true);
  if (proto.ok) {
    assert.equal(Object.getPrototypeOf(proto.doc), Object.prototype);
    assert.equal("x" in proto.doc, false);
    assert.deepEqual(proto.doc, { ls: { reach: 4 } });
  }
  const st = readStage(stage, L);
  assert.equal(st.ok, true);
  if (st.ok) assert.equal("overrides" in st.doc, false);
  assert.equal(readStageOverrides({ overrides: 1 }).ok, false);
});
`````

### `tests/tools/golden/demo-parity.json` (new)

`````json
{"outcome":"win","snapshot":"dc959c318ea82b78e37e6cfbefcc2904be17b9640ea95982d9a92d8968b75177","log":"3278b95a57fe08751cec91ecc220ed99d8ef75053148c52a5a7358e7f33a650b","bus":"30f1d9006882e8ba9edc55d2a47cdb0dc8dbd6202dd5cfab2ba236862f90fd80"}
`````

### `tools/project/slice-of.ts` (new)

`````ts
const DROP = new Set(["sources", "variants", "used_by", "conflicts", "needs_reverify", "default_source", "item_cites", "item_sources"]);

function copy(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(copy);
  if (typeof v !== "object" || v === null) return v;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(v)) { if (!DROP.has(key)) out[key] = copy((v as Record<string, unknown>)[key]); }
  return out;
}

export type CatalogueDoc = { readonly schema_version: number; readonly catalogue_rev: number; readonly gates: unknown; readonly behaviours: readonly Record<string, unknown>[] };

/** Pure slice: catalogue order, ids only, dropped info keys removed. `JSON.stringify(., null, 2) + "\\n"`. */
export function sliceOf(catalogue: CatalogueDoc, ids: readonly string[]): string {
  const want = new Set(ids);
  const behaviours = catalogue.behaviours.filter((b) => want.has(String(b["id"]))).map(copy);
  const slice = { kind: "catalogue-slice", formatVersion: 1, schema_version: catalogue.schema_version, catalogue_rev: catalogue.catalogue_rev, gates: catalogue.gates, behaviours };
  return `${JSON.stringify(slice, null, 2)}\n`;
}
`````

### History: the rejected r1 P2 test and the r2 change

r1 (`5cf1a0fe`, rejected by QA) keyed the allowlist by line number. Do not ship this version:

`````ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const RE = /JSON\.parse|formatVersion|kind ===/;
const PLAY = ["board.ts:109", "build.ts:13", "build.ts:14", "load.ts:20", "load.ts:21", "load.ts:23", "match.ts:63", "match.ts:90", "match.ts:96", "match.ts:102", "match.ts:105", "match.ts:108"];
function hits(dir: string, skip: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) readFileSync(join(dir, name), "utf8").split("\n").forEach((line, i) => { if (RE.test(line)) out.push(`${name}:${i + 1}`); });
  return out;
}

test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===", () => {
  assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !PLAY.includes(hit)), []);
});
`````

r2 change (`5cf1a0fe..4c41903e`), which is what merged:

`````diff
diff --git a/tests/project/load/one-parser.test.ts b/tests/project/load/one-parser.test.ts
index 71c16c5..a907b66 100644
--- a/tests/project/load/one-parser.test.ts
+++ b/tests/project/load/one-parser.test.ts
@@ -2,16 +2,14 @@ import assert from "node:assert/strict";
 import { readdirSync, readFileSync } from "node:fs";
 import { join } from "node:path";
 import { test } from "node:test";
-
 const RE = /JSON\.parse|formatVersion|kind ===/;
-const PLAY = ["board.ts:109", "build.ts:13", "build.ts:14", "load.ts:20", "load.ts:21", "load.ts:23", "match.ts:63", "match.ts:90", "match.ts:96", "match.ts:102", "match.ts:105", "match.ts:108"];
+const PLAY = new Set(["board.ts\t    if (stepped.action?.kind === \"move\" && stepped.path !== undefined && selected !== null) {","build.ts\texport const ours = (text: string): boolean => { try { const v = JSON.parse(text) as Record<string, unknown>; return Object.keys(v).join() === \"commit,node,entry,files\" && typeof v[\"commit\"] === \"string\" && /^[0-9a-f]{40}$/.test(v[\"commit\"]) && typeof v[\"node\"] === \"string\" && v[\"entry\"] === \"index.html\" && typeof v[\"files\"] === \"object\" && v[\"files\"] !== null && !Array.isArray(v[\"files\"]); } catch { return false; } };","build.ts\texport const onlyBuild = (out: string, text: string): boolean => { const files = (JSON.parse(text) as { files: Record<string, unknown> }).files; return readdirSync(out, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).every((e) => { const name = relative(out, join(e.parentPath, e.name)).replaceAll(\"\\\\\", \"/\"); return name === \"build.json\" || Object.hasOwn(files, name); }); };","load.ts\texport const DEMO_MANIFEST = { kind: \"tile-project\", formatVersion: 6, project: { id: \"demo\", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: [\"stage-demo\"], rules: [] as string[], loadout: { roster: [\"knight\", \"archer\", \"cleric\"], size: 3, required: [\"knight\"] } } };","load.ts\texport const DEMO_MAP = { kind: \"map\", formatVersion: 5, id: \"map-6x9\", rev: 1, cols: 6, rows: 9, logic: { terrain: \"000000000000020000100000110000100000000022000000000000\".split(\"\").map(Number), palette: { \"0\": \"floor\", \"1\": \"water\", \"2\": \"rock\" }, edges: [] as const } };","load.ts\t  kind: \"stage\", formatVersion: 2, id: \"stage-demo\", rev: 1, mapRef: \"map-6x9\", seed: DEMO_SEED, setupIds: [\"talk-villager\"],","match.ts\t      if (action.kind === \"move\" && landMove(action)) return;","match.ts\t      if (typeof step === \"object\" && step !== null && \"action\" in step && step.action?.kind === \"interact\") {","match.ts\t      } else if (typeof step === \"object\" && step !== null && \"action\" in step && step.action?.kind === \"ability\") settle();","match.ts\t      const list = kind === \"spell\" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === \"talk\" ? \"interact\" : \"basic\", rules);","match.ts\t      const step = baseIntend({ type: \"ChooseAction\", actionId: kind === \"talk\" ? \"interact\" : kind, unitId: id });","match.ts\t      play.aims = cells(list); play.aimKind = kind === \"spell\" ? \"spell\" : \"basic\"; return null;"]);
 function hits(dir: string, skip: (name: string) => boolean): string[] {
   const out: string[] = [];
-  for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) readFileSync(join(dir, name), "utf8").split("\n").forEach((line, i) => { if (RE.test(line)) out.push(`${name}:${i + 1}`); });
+  for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) for (const line of readFileSync(join(dir, name), "utf8").split("\n")) if (RE.test(line)) out.push(name + "\t" + line);
   return out;
 }
-
 test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===", () => {
   assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
-  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !PLAY.includes(hit)), []);
+  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !PLAY.has(hit)), []);
 });
`````
