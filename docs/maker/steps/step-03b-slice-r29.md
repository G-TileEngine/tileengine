# Step 03b: the real rev 29 slice in the demo (D18)

r3, 2026-11-19, Editor & UX Designer. r3 applies QA's NOT OK on r2: a sha256 pin test outside `fixtures/`, so a hand-edited slice can't pass and `fixtures/**` can stay out of the 400 count; the base moves to `af9af6c0` (or the latest main at the go-line) with floor 1036 + N, and no longer waits on step 3; the picker fix now mirrors `registry.ts` exactly, and its test covers unlisted and non-string values; the hand-back must show the seed 24301 parity unchanged. The trial was re-run. r2: D19, D20 and the `d94f683c` rulings doc. r1: first draft. Docs only, written to the same cold-builder standard as step 2 and step 3. Source: DSK rulings `handoff/dsk-rulings/2026-11-17-phase1.md` (sha256 `aacb7e01c4a2baba3a9eae5fd14ca1b2a25a5f4cac6e3d1f32ee82b8d3fe164c`, 68 lines; was `24cba61e…` before the 2026-11-19 L63 step 9 to step 7 renumber, nothing else changed), D18 and the D18 update (Librarian, 2026-11-19: re-slice from live rev 29), D19 and D20. One builder run, gates on. **This is a data step with one small reader fix. It has no maker screen.** All measured numbers below come from a trial run of this step (see Measured).

Step id: `step-03b-slice-r29`. Revision: r1 for the first run, r2, r3 … for rework rounds.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `af9af6c0` (`af9af6c docs(rebuild): baseline + step 0/1a/1b rebuild records`), or the latest main when CoS sends the go-line. CoS names the exact sha in the go-line. **Do not wait for step 3.**
**Test floor:** **1036 + N** on `af9af6c0`. If CoS gives a later base, the floor is that base's count + N, and CoS gives the number. N is the number of tests this run adds (2 or more: see Build); state it in the hand-back.
**Needs:** steps 0, 1a and 1b merged (all on `af9af6c0`). It does not need step 2 or step 3. **Blocks:** step 4b (see step 4's Go-line order).

## Delivery
Same shape as step 0 (`docs/maker/steps/step-00-play-input.md`, Delivery) and `handoff/HAND-BACK.md`.
- Branch: `step/step-03b-slice-r29-r<N>-chatA`, from the base above. Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds `handback/step-03b-slice-r29/r<N>/HANDBACK.md` (with the files and sections `handoff/HAND-BACK.md` lists, plus § Slice, § Re-answers, § Parity and § Smoke).
- Gate: `npm ci && npm run green` exits 0 at the floor above. `npm run green` runs `npm test`, typecheck, lint, deps, `check:state` (`scripts/check-state.sh`) and `check:law` (`scripts/check-law.sh`). `npm test` alone is not enough.
- **Touch smoke.** The bundled demo is play-stage input, so the smokes below must print `TOUCH SMOKE PASS` at 390 and at 360 CSS px, with the ok lines pasted in HANDBACK.md § Smoke:
  1. The S0 smoke, unchanged: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`. **Required.** It is frozen at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`; check that sha before you run it.
  2. **Only if step 3 is already on the base** (the file `handoff/steps/tests/s3-test/touch-smoke.mjs` exists): step 3's `?project=` smoke, unchanged: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798`.
- Push once, that branch only, through the one-shot credential helper that `handoff/HAND-BACK.md` gives (it reads `GH_BUILDER_TOKEN` from the shell; keep the single quotes).
- Never push main or a tag. No force-push, no branch delete, no PR actions.
- **No token in any output.** Never print, echo, log, commit or store the token, including in `.git/config`. No token value may appear in any file, log, screenshot or message. If it ever does, say so in the hand-back.
- Chief Of Staff opens the PR. The hand-back message quotes the branch, the full tip sha, the base sha, the test counts, the slice sha, the smoke PASS lines, the parity line (see Done when) and both line counts.

## Goal
`fixtures/demo.tileproj/catalogue/slice.json` on main says `catalogue_rev: 28`, but it is not the rev 28 catalogue (D18). Its talk `line` has `max_len` 128 and default `""`; about 40 knob fields differ from the real catalogue; the gates are id stubs; and it has two knobs the catalogue doesn't have. This step puts the **real rev 29 slice** in the demo, moves the demo to rev 29, keeps every demo choice that the demo really made, and keeps the parity golden green. After this step the demo slice's talk `line` limit is the catalogue's (D14), so step 4b's slice-vs-format test can pass.

## Read first
1. `handoff/dsk-rulings/2026-11-17-phase1.md` (sha256 `aacb7e01…`, 68 lines; was `24cba61e…` before the 2026-11-19 L63 step 9 to step 7 renumber, nothing else changed): D14 (talk limit), D16 (unset knobs), D18 and the D18 update, D19 (nullable defaults), D20 (the re-answer split).
2. `docs/maker/data/setup-format.md` §2 (answers: `source`, `value`, `rev`, `defaultRef`; a default answer stores no `value`).
3. `docs/maker/data/project-format.md` §2 (layout), §3.1 (`project.catalogueRev`), §6 (the NPCs block: the talk `line` limit).
4. Code, names and lines checked on main `af9af6c0` (its code is the same as the earlier main; that commit adds docs only):
   - `tools/project/slice-of.ts` (`sliceOf(catalogue, ids)`, sha256 `46f42e333aa7f3e432b6fb3e8aabcb5d33a61f03522364a2765d9bba86698591`; the slice generator. Use it, do not change it).
   - `src/project/load/read-project.ts` (`readProject`; the answer check at line 61; the rev check at lines 49 and 52).
   - `src/rules/behaviours/registry.ts` `accept`: line 39 (`null` passes only when the knob is `nullable`) and line 42 (a picker value passes only when it `===` an option, or an option's `value` when the option is an object with an own `value` key). The reader fix mirrors line 42.
   - `tools/play-stage/project.ts` (`playDocsOf`; which knobs the play stage reads: see Re-answers).
   - `tests/project/read-project.test.ts`, test **"fixture clean, and slice-of is byte-equal to catalogue/slice.json"** (the fixture must load with an empty report, and `sliceOf` must give the slice byte for byte; its `IDS` list fixes the 8 ids and their order).
   - `tests/tools/play-stage-parity.test.ts`, test **"(a) parity: seed 24301 bot versus bot equals the 1a golden"** (line 16; it compares against `tests/tools/golden/demo-parity.json`, line 23, sha256 `90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839` on `af9af6c0`). This step keeps it green and never touches the golden.

## The slice (facts, checked 2026-11-19)
| Item | Value |
|---|---|
| Target file | `slice.rev29.json`, `catalogue_rev` 29, **sha256 `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3`**, 4,170 lines |
| Made from | the live catalogue `behaviours.json`, `catalogue_rev` 29, sha256 `bba8c252d11bad381b65d01bc2ab18116ce2d01213843ac7271d722ad5aa0f97` |
| Made by | `sliceOf(catalogue, IDS)` from `tools/project/slice-of.ts` (sha `46f42e33…`, the same file as on main), with `IDS` = `ability-presentation, basic-attack, line-shot, barrier-line, adjacency-synergy, unit-roster, talk, terrain`, in that order |
| Replaces | `fixtures/demo.tileproj/catalogue/slice.json` on main, sha256 `c2cacc1b19e38e1e3eab53070b6f1bee03ce562e7dae8cf2d9120f4492357501`, 617 lines |
| Librarian check | **Done.** The Librarian confirmed rev 29 as live (D18 update, 2026-11-19). |

The catalogue is not in the repo. **CoS hands the builder `slice.rev29.json` (or `behaviours.json` bba8c252) with the go-line.** The builder either copies `slice.rev29.json` in and checks its sha, or reruns `sliceOf` on `behaviours.json` with the `IDS` above and checks that the output's sha is `8547ed0a…`. Either way, § Slice in the hand-back quotes the full sha. **Never hand-edit the slice** (not even the 128).

## Rules
1. **Swap, don't patch.** The new `catalogue/slice.json` is byte-equal to `slice.rev29.json`. No line of it is typed by hand.
2. **The whole demo moves to rev 29.** `project.json` `project.catalogueRev` becomes 29, and each of the 5 setups' `catalogue.rev` becomes 29. Otherwise `readProject` gives `catalogueRevMismatch` rows and the fixture is not clean. Leave every `defaultRef.rev` as it is: all 36 already equal the rev 29 knob revs (checked).
3. **Picker options are `{value, label}` in the real catalogue.** The old fake slice had plain strings. `readProject` checks a picker answer with `options.includes(value)` (line 61), so with the real slice every picker answer fails as a hard `invalidValue` (measured: 3 rows, on `shortcut`, `reach_mode` and `caster_class`). Fix that one check so that it **mirrors `registry.ts` line 42 exactly**: the value must still be a string (the existing `typeof value !== "string"` test stays), and it must `===` an option, or that option's `value` when the option is an object with an own `value` key: `options.some((opt) => (isObj(opt) && Object.hasOwn(opt, "value") ? opt["value"] : opt) === value)`. So an unlisted string, a number, a boolean, `null` or an object stays a hard `invalidValue`. This is the only code change. It adds no new rule.
4. **Re-answer as `source: "user"` where the demo made a real choice (D18; split confirmed by D20).** A demo answer that is `source: "default"` now takes the rev 29 default. Where the old default is still a legal rev 29 value, write it back as `source: "user"` with that `value` (rev 1, `defaultRef` unchanged): these are the 5 rows marked **user** in Re-answers. Where the old default is not a legal rev 29 value, leave the answer as `source: "default"`: these are the 7 other rows, and D20 rules that each rev 29 default means the same as the old value. **One exception (D20):** if `clip_cues: true` shows hit-flash or lunge cues that the old demo didn't show, answer it `{source: "user", value: false}` instead. Check this and say in § Re-answers which way it went (the trial result is under Re-answers). The exact list is in **Re-answers**. Units carry no answers (every demo unit has `stats: {}` and `setupIds: []`), so no unit file changes.
5. **The two knobs that rev 29 doesn't have (D18 update).** No demo document answers either knob, so neither mapping touches a demo file. Write them down in § Re-answers anyway:
   - `adjacency-synergy.bonus` becomes `per_neighbour` with `mode: "per-neighbour"`. Rev 29 has both knobs (`per_neighbour`: slider 1–2, default 1; `mode`: picker, default `gate`).
   - `barrier-line.length` is **dropped**. It has no home in rev 29. `max_lines` is lines per use, not a length, so it is **not** a substitute.
6. **`basic-attack.damage` stays at its default** until rev 30 adds "= unit attack". The demo's answer stays `source: "default"`; `layerNotApplied` stays quiet.
7. **Parity stays green, unchanged (D20).** The play stage reads only `unit-roster.unit_hp`, `unit-roster.unit_atk`, `basic-attack.reach_mode`, `custom_ns`, `custom_ew`, `line-shot.range`, `line-shot.damage`, `talk.line` and `terrain` (`playDocsOf`). None of their demo values change, so the parity golden must not change. **The golden stays exactly as it is on the base. If the parity test fails, the builder stops, pushes nothing, and reports the failure to CoS. The builder never regenerates, re-records or edits the golden.**
8. **Nullable knobs with a `null` default (D19).** Rev 29's `unit-roster.team_colour` has `nullable: true` and `default: null`. That `null` means "use the side's palette colour"; it is a real default, so the demo's `{source: "default"}` answer is legal and stays. `noDefault` (setup-format §2.5) fires only when `default === null` **and** `nullable !== true`. **Checked on the trial:** `readProject` on `772f7aa2` has no `noDefault` check at all (no `noDefault` or `nullable` in `src/project/`), so it gives no row for `team_colour` today, and D19 changes no behaviour in this step. So 03b adds no code and no test for it. Whoever later adds a `noDefault` check to the reader must add the `nullable` exemption with it. (The engine's own check, `accept` in `src/rules/behaviours/registry.ts` line 39, already lets `null` through when `nullable` is true.)
9. **The slice is pinned outside `fixtures/`.** The existing test "fixture clean, and slice-of is byte-equal to catalogue/slice.json" (`tests/project/read-project.test.ts` lines 28–38) **rebuilds its catalogue from the fixture slice itself** (lines 30–33) and then checks that `sliceOf` gives that same text back. So a hand-edited slice still passes it (checked on the trial: with `max_len` changed to 141, it passes). A new test outside `fixtures/` pins the slice's sha256 to `8547ed0a…`, so a hand edit fails. The catalogue stays out of the repo for now; the pin is the guard.
10. **Line count.** Counted the same way as step 2 and step 3: `fixtures/**` is data and is excluded. That is safe because of the pin (Rules 9): no byte of the slice can change without a counted change to the pin test. See Measured for both numbers.

## Re-answers (measured on the trial)
12 demo answers are `source: "default"` on a knob whose default changed between the old slice and rev 29. None of them is read by the play stage.

| Setup (`setup_01JDAT…`) | Knob | Old default → rev 29 default | Old value legal in rev 29? | Do |
|---|---|---|---|---|
| `…0003` unit-roster | `piece_count` | 3 → 6 | yes (slider 1–12) | **user, 3** |
| `…0004` basic-attack | `enemy_basic_crosses_barrier` | false → true | yes | **user, false** |
| `…0005` line-shot | `neutrals_legal` | false → true | yes | **user, false** |
| `…0005` line-shot | `hit_class` | `basic` → `spell` | yes | **user, `"basic"`** |
| `…0005` line-shot | `mana_cost` | 0 → 2 | yes (slider 0–14) | **user, 0** |
| `…0002` ability-presentation | `basic_style` | `button` → `unit-action-menu` | no | stays default |
| `…0002` ability-presentation | `spells_style` | `button` → `unit-action-menu` | no | stays default |
| `…0002` ability-presentation | `hand_placement` | `bottom` → `hand-docked` | no | stays default |
| `…0003` unit-roster | `opening_row` | `bottom` → `back` | no | stays default |
| `…0003` unit-roster | `clip_cues` | `[]` (list) → `true` (toggle) | no | stays default (D20 check: see below) |
| `…0003` unit-roster | `team_colour` | `side` (picker) → `null` (colour, `nullable: true`) | no | stays default (D19: `null` = side palette) |
| `…0005` line-shot | `ability_group` | `spell` → `spells` (ref) | no | stays default |

**The `clip_cues` check (D20), done on the trial: it stays `default`.** No code on `af9af6c0` reads `clip_cues`: there is no match for it in `src/` or `tools/`, and the play stage reads only the knobs listed in Rules 7. The play stage's hit and attack feel (`src/runtime/render/feel.ts`) does not depend on any knob. So `true` shows no cue the old demo didn't show, and the D20 exception does not apply. The builder repeats this check on the base (`rg -n clip_cues src tools`). If anything reads `clip_cues` by then, use the exception and say so.

The demo's existing `source: "user"` answers all stay as they are. They are all legal in rev 29 once Rules 3 is in (checked). The talk line "Hello, traveler." stays `user`; the rev 29 default is "Hello, traveller.".

## Build
| File | Job | Cap |
|---|---|---|
| `fixtures/demo.tileproj/catalogue/slice.json` | Replace with `slice.rev29.json` (Rules 1). Data, not counted. | data |
| `fixtures/demo.tileproj/project.json` | `catalogueRev` 28 → 29. Data, not counted. | data |
| `fixtures/demo.tileproj/setups/setup_01JDAT0000000000000000000{1..5}.json` | `catalogue.rev` 28 → 29 in all 5; the 5 re-answers in `…0003`, `…0004` and `…0005` (Re-answers). Data, not counted. | data |
| `src/project/load/read-project.ts` edit | Line 61: the picker check mirrors `registry.ts` line 42 (Rules 3). One line. | 2 |
| `tests/project/load/picker-options.test.ts` | new, named test **`picker options as {value, label}: a listed value passes; an unlisted or non-string value is invalidValue`**: the demo loads with an empty report; then, one at a time, set `shortcut` in `…0002` to an unlisted string (`"not-an-option"`), a number (`3`), a boolean (`true`) and an object (`{value: "all-menu"}`), and each time the report is exactly one hard `invalidValue` at `setups/setup_01JDAT00000000000000000002.json#/answers/shortcut/value`. It must fail without the `read-project.ts` fix. | 20 |
| `tests/project/demo-slice-pin.test.ts` | new, named test **`demo slice pin: catalogue/slice.json is the rev 29 slice, byte for byte`**: reads the file's bytes, hashes them with `node:crypto` `createHash("sha256")`, and asserts `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3` (Rules 9). A comment names the source: `sliceOf(behaviours.json bba8c252, IDS)`. No new dependency. | 12 |
| `tests/project/read-project.test.ts` | **No edit expected.** Its `IDS` and the `sliceOf` byte-equal check already pass with the new slice (measured). If it fails, stop and report. | 0 |

**Hard gate: 400 counted lines.** The caps sum to 34. The trial run used 27 counted lines.

## Measured (trial run, 2026-11-19, re-run for r3)
The trial applied exactly the Build above to a copy of main whose code is the same as `af9af6c0` (`af9af6c0` adds docs only, checked). It was not pushed. `npm run green` exits 0.
- `npm test`: **1038 pass, 0 fail** (1036 + 2). Parity (a) and "fixture clean, and slice-of is byte-equal" pass, and `tests/tools/golden/demo-parity.json` is unchanged (`90dde42a…`). Typecheck, lint, deps, `check:state` and `check:law` pass.
- The picker test fails without the reader fix (checked). With the slice's talk `max_len` hand-edited to 141, the pin test fails and the old byte-equal test still passes (checked), which is why the pin is needed.
- Without the reader fix, the swapped demo gives 3 hard `invalidValue` rows. Without the rev bumps, it also gives `catalogueRevMismatch`.
- **Counted lines** (fixtures excluded, as in step 2 and step 3): `3 files changed, 26 insertions(+), 1 deletion(-)` (reader +1/−1, picker test +15, pin test +10). **Fits the 400 gate.**
- **Raw lines with fixtures:** the slice alone is `+3718 / −165` (617 → 4,170 lines). `project.json` `+1/−1`. Setups: `…0001` `+1/−1`, `…0002` `+1/−1`, `…0003` `+4/−3`, `…0004` `+4/−3`, `…0005` `+10/−7`. Total with code: about **+3,765 / −182**. **If fixtures were counted, 03b would be about 9 to 10 times over the gate.** The JSON is generated data, so it is excluded, the same as step 2 and step 3 exclude `fixtures/**`. A split would not help: the slice is one generated file and can't be cut.

## Must NOT
- **No new framework, starter template or app scaffold** (for example TanStack Start, a sandbox preview server, borrowed visual themes). Build only inside the repo's existing stack, files and test gates, starting from the base above. No other theme or visual system.
- No hand edit of `catalogue/slice.json` (Rules 1). No change to `tools/project/slice-of.ts`.
- No change to any parity golden, smoke or file under `handoff/steps/tests/`.
- No play-stage change (`tools/play-stage/**`), and no maker UI change.
- No reader change beyond the one picker check (Rules 3). No new report code. The picker check must not get looser than `registry.ts` line 42: no value other than a listed string passes.
- No `barrier-line.length` and no `adjacency-synergy.bonus` anywhere. No `max_lines` used as a length.
- No `source: "user"` answer for `basic-attack.damage` (Rules 6).
- No `source: "user"` answer with a value that isn't legal in rev 29. No `source: "user"` answer for `team_colour` (D19).
- No new `noDefault` check in the reader in this step (Rules 8).
- No regenerated, re-recorded or edited golden (Rules 7).
- **No empty `catch` and no silent default (Law 12).**
- Offline, no new dependencies.

## Done when
- **Gates:** `npm ci && npm run green` exits 0 at **1036 + N** or more on `af9af6c0` (or the later base's count + N) (N stated in the hand-back). That includes `scripts/check-law.sh` and `scripts/check-state.sh`. **Line count:** `git diff --shortstat <base>..HEAD -- . ':!fixtures/**'` is 400 or fewer. The hand-back also quotes `git diff --shortstat <base>..HEAD -- fixtures/` as the raw data size.
- **Slice:** `sha256sum fixtures/demo.tileproj/catalogue/slice.json` prints `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3`, and its `catalogue_rev` is 29. § Slice quotes it.
- **Fixture clean:** "fixture clean, and slice-of is byte-equal to catalogue/slice.json" passes with no edit to that test.
- **Parity, shown in the hand-back.** § Parity in HANDBACK.md pastes (1) the `✔ (a) parity: seed 24301 bot versus bot equals the 1a golden` line from the gate run, (2) `sha256sum tests/tools/golden/demo-parity.json` on the base and on the tip, which must be the same, and (3) `git diff --stat <base>..HEAD -- tests/tools/golden/`, which must be empty. If parity fails, stop and report (Rules 7).
- **Pin:** "demo slice pin: catalogue/slice.json is the rev 29 slice, byte for byte" passes.
- **Re-answers:** § Re-answers lists the 12 rows from the table above with what was done, the two knob mappings from Rules 5, and which way the `clip_cues` check went (D20).
- **No maker screen here.** The openable-page, look and screenshot lines of step 2 and step 3 don't apply. Instead, the bundled demo still plays in the play stage: the S0 touch smoke passes at 390 and 360 (see Delivery). If step 2 and step 3 are already on the base, `node tools/maker/build.ts <out>` must also still build, and **New (Demo) → Test** must still play the demo (step 3's smoke).
- **Not the builder's gate:** CoS checks that the demo plays the same on a phone after merge.

## Rulings needed
None open.
- **Librarian:** canonical check of the slice. **Done:** the Librarian confirmed rev 29 as live (D18 update, 2026-11-19).
- **DSK:** `team_colour` with a `null` default. **Answered by D19** (Rules 8).
- **DSK:** the re-answer split. **Answered by D20** (Rules 4).
- **Owed by DSK, not by this step:** the setup-format §2.5 `noDefault` row edit for D19, with project-format r41.
