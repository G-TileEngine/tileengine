# Step 1: Project format, reader, validation, versioning (the play stage loads a project)

- **Date:** 2026-11-18 · **Owner:** Data & Save Keeper · **Status:** FINAL r6 (r2: QA fixes for gates, floor and plants P1–P3, QA OK; r3: Q9 ruled; r4: EA rulings Q2/3/5/6/7; r5: Q2 build emits raw text, P2 has no exemptions (CoS); r6: base main `8a737c5f` after S0, floor 1023); EA FINAL OK and QA FINAL OK on 2026-11-18 for b9a2b54a; only this status line changed) · **Base:** main `8a737c5f` (S0 merged, PR #76) · **Builds after:** S0 (1b on main after S0 merges)
- **Sources:** this reuses `docs/maker/data/s1-project-load.md` r3 (560 lines, sha `f4e459c3`). Do not re-derive it. If this page and S1 disagree, S1 wins. Format docs live at `docs/maker/data/project-format.md` and `docs/maker/data/setup-format.md` (main `f2df5c40`, moved unedited).

**This step is two builder runs: 1a, then 1b.** Each is one run, 400 lines or fewer including tests, gates on.

## Goal

One game is one `.tileproj` project in its own files. The play stage stops using the hard-coded `DEMO_LOAD` (`tools/play-stage/load.ts`). It reads the demo from `fixtures/demo.tileproj/` through one pure `readProject(files)`, and with the same seed (24301) it plays exactly as it does today.

No new format. The minimum project is a strict subset of project-format. There are no new fields, no CN and no version bump.

### What a project is

One game is one folder. `files` keys are POSIX paths relative to that folder. An unknown file is kept and reported as a warning.

| Kind | Path | Current version | In this step |
|---|---|---|---|
| `tile-project` | `project.json` | 6 | yes |
| `catalogue-slice` | `catalogue/slice.json` | 1 | yes (generated, never hand-edited) |
| `map` | `maps/<id>.json` | 5 | yes |
| `stage` | `stages/<id>.json` | 2 | yes |
| `unit` | `units/<id>.json` | 2 | yes |
| `behaviour-setup` | `setups/<id>.json` | 3 | yes |

**Deferred:** assets, sprite-recipes, paint-styles, effect documents (only the builtin `none` and `btf-*` are referenced), decks, notes, achievements, audio, presets, `index`, saving, the export closure, catalogue drift, and H1/H4/H6.

**Absent means today's behaviour.** When a deferred field or file is missing, there is no migration.

The exact demo fixture JSON is in the S1 spec, §4. That section is the source of truth. Do not copy or rewrite it here. Layout and ids are in S1 §3.

## Read first

1. `docs/maker/data/s1-project-load.md` (DSK S1, committed with this guide: file layout §3, exact fixture JSON §4, reader contract §6, versions §7, validation §8, tests §9, line budget §10).
2. `docs/maker/data/project-format.md` §2, §3, §4, §6.3–6.5, §11, §12, §13, §16.
3. `docs/maker/data/setup-format.md` §2.1–2.5, §2.9, §9.
4. `handoff/dsk-rulings/2026-11-17-phase1.md` (D2–D5).
5. Existing code to reuse, not replace: `src/project/read/*` (per-document readers), `tools/play-stage/load.ts`, `tests/rules/bot-p15.test.ts` (match harness).

No ui-shell screenshots: this step has no screen.

### Reader contract

Code for `readProject` and `migrateProject` goes in `src/project/load/` (new). This is the load layer shared by the future maker and the play host. `createWorld` and `src/project/read/` still read only current versions and never migrate, apart from the Q3 alignment of `src/project/read/unit.ts`. `playDocsOf` lives in `tools/play-stage/project.ts`, not in `src/`: `src` never imports `tools` (`BUILD_GUIDE.md:64`), and the adapter builds play-stage keys (`talk-*`, `effectRef`).

```ts
export type ProjectFiles = Readonly<Record<string /* posix path in .tileproj */, unknown /* JSON.parse result */>>;
export type Severity = "hard" | "warning" | "info";
export type ReportRow = { readonly code: string; readonly severity: Severity; readonly path: string /* file#json/pointer */; readonly detail?: string };
export type ProjectStore = {                 // §16 "store"; documents as stored (after in-memory migration), unknown keys kept
  readonly manifest: ProjectManifest;        // §16 shape; index absent or ignored
  readonly slice: CatalogueSlice;
  readonly maps: Readonly<Record<string, GameMap>>; readonly stages: Readonly<Record<string, Stage>>;
  readonly units: Readonly<Record<string, Unit>>; readonly setups: Readonly<Record<string, BehaviourSetup>>;
  readonly unknownFiles: Readonly<Record<string, unknown>>;
};
export type ProjectLoad =
  | { readonly ok: true;  readonly readOnly: false; readonly project: ProjectStore; readonly report: readonly ReportRow[] }  // no hard rows
  | { readonly ok: false; readonly readOnly: false; readonly project: ProjectStore; readonly report: readonly ReportRow[] }  // hard rows: shown, not playable
  | { readonly ok: false; readonly readOnly: true;  readonly project: null;         readonly report: readonly ReportRow[] }; // refusal row first
export function readProject(files: ProjectFiles): ProjectLoad;              // pure; never throws; never mutates `files`
export function migrateProject(files: ProjectFiles): { files: ProjectFiles; report: readonly ReportRow[] }; // §7; the ONE chain
```

`playDocsOf` (in `tools/play-stage/project.ts`, 1b; same ~65 lines):
```ts
export function playDocsOf(p: ProjectStore, stageId?: string): PlayDocs & { chosen: readonly string[]; tiles: readonly CoreTileType[]; names: Readonly<Record<string, string>> };
```

- `readProject` order: find `project.json` (missing or not an object → refuse `notAProject`); version-gate every known document; run `migrateProject`; structural read and checks; build the store.
- Rows are sorted by path, then code, so the report is deterministic.
- `playDocsOf` uses the first `project.stages` entry by default. It throws only if handed a store whose load was not `ok`. Hosts must check `ok` first. It may call `readProject` output but must not `JSON.parse` or read `formatVersion` / `kind ===` itself (P2).
- 1b boot: `tools/play-stage` runs `readProject` synchronously at boot. If the load isn't `ok` or is `readOnly`, it shows the report rows, starts no match and never throws.
- Seams: `docsToInput` (`load.ts:36-38`) gains `chosen` and `tiles` inputs. 1b builds on main after S0 merges (both edit `match.ts` and `board.ts`). `createMatch()` with no docs must keep working for S0's tests. 1b deletes the villager fallback at `match.ts:84` (D2).

### Versions and migration

| Kind | Accepted | Older | Newer |
|---|---|---|---|
| `tile-project` | 4, 5, 6 | ≤ 3: `formatOlder` refusal (the 001–003 steps stay in ui-shell `project-store.js`) | ≥ 7: `formatNewer` refusal, read-only |
| `map` | 4, 5 | ≤ 3: `formatOlder` | ≥ 6: `formatNewer` |
| `stage` / `unit` / `behaviour-setup` / `catalogue-slice` | 2 / 2 / 3 / 1 | `formatOlder` | `formatNewer` |

The UX shell (`ui-shell`) is a prototype only and is never merged. It saves tile-project v4 and map v4. The reader upgrades them in memory through the one shared `docs/maker/data/project-format.md` §12 chain and never writes back. A newer file is refused read-only (`formatNewer`).

`migrateProject` is the only implementation of those §12 steps. It is pure and idempotent, runs on a deep copy, and **never writes back**. The result lives in memory only. The future maker calls the same function, and its save writes the result.

- **tile-project 004 (v4 → v5):** when `render` is an object, add `proceduralShip: "auto"` and `credits: true` if they're missing. When `render` is absent, leave it absent.
- **tile-project 005 (v5 → v6):** this slice has no assets. If any procedural asset with `terrains` lacks `paintStyle`, leave it untouched and add the warning `migrationDeferred` (`detail "tile-project 005"`). Otherwise it's only a version bump. The full re-id step comes with the assets slice (Q4).
- **map 004 (v4 → v5):** `background.mode` becomes `background.layers` exactly as in §12. Visual `layers[]` aren't touched.
- Each applied step adds an info row `migrated`.

Refusals are a hard row `{code, path, detail: "found N, reads ≤ M"}` with `readOnly: true` and `project: null`. They never throw, and nothing is changed or written. Unknown keys in known documents are kept. Unknown files are kept in `unknownFiles` and reported as `unknownFile` warnings.

### Validation

Hard errors that block play (subset of `docs/maker/data/project-format.md` §13):

| Check | Code | Notes |
|---|---|---|
| **H2** wrong JSON type | `invalidValue` | envelope fields, map `cols`/`rows`, terrain items, placements, `stats.*.value`, answer types |
| **H3** broken ref | `brokenRef` (PROPOSED) | stages, `mapRef`, rules and `setupIds`, loadout and placement unit ids |
| **H5** grid length ≠ `cols*rows` | `terrainLength` (PROPOSED) | `logic.terrain` or any `layers[].tiles` |
| Refusals | `formatNewer`, `formatOlder`, `notAProject` | hard, read-only; the file is not opened for play |

Warnings (the project still loads; the listed fallback applies):

| Check | Code |
|---|---|
| `text` over `max_len`, slider or stat out of range (Unicode code points); placement off the map (skipped) | `outOfRange` |
| `ref` not `none`, a `btf-*` builtin or an effect file (plays `none`); setup `behaviourId` not in the slice (setup ignored); palette id not in `tile_types` (plays `floor`); side not in `team_colours` (default side) | `unknownRef` |
| Slice or setup catalogue rev ≠ `project.catalogueRev` (read as stored) | `catalogueRevMismatch` (PROPOSED) |
| `custom-cross` with `ns ≠ ew` (uses `min(ns,ew)`, Q6); `basic-attack.damage` off its default (Q5); two talk lines for one unit (Q7) | `layerNotApplied` |
| tile-project 005 skipped (Q4) | `migrationDeferred` (PROPOSED) |
| Unknown file; migration applied; `index` present (ignored, recomputed later) | `unknownFile` / `migrated` / `indexIgnored` (PROPOSED) |

Everything else in §13 is not checked in this step, and plays as today. The demo fixture loads with `report: []`.

### Moving DEMO_LOAD into data

Full notes are in the S1 spec, §5. Short map:

| Today | Project home |
|---|---|
| `DEMO_MANIFEST` | `project.json` (`catalogueRev` 28, required setups in `rules`) |
| `DEMO_MAP` | `maps/map_….json`. Palette `rock` becomes `wall-block`. |
| `DEMO_STAGE` | `stages/stage_….json`. The demo's top-level `setupIds` is not a format key; the talk setup hangs off the villager's `neutrals[].setupIds`. |
| `RECIPES[].name` / `id` / `team` | `unit.name`; `unit.sprite: null` (starter picture is a tools-only fallback, never stored); side comes from the placement. |
| `DEMO_SETUP` stats, reach, abilities | army `unit-roster` plus per-unit `stats`, archer `basic-attack` and `line-shot` setups |
| `DEMO_TALK` | `talk.line` on the villager's talk setup. The demo spelling `"Hello, traveler."` is kept. |
| `DEMO_SEED` 24301 | `stage.seed` |
| `chosen ["knight","archer"]` | derived at runtime from the loadout, not stored |
| `DEMO_LOOKS` (canopy, braziers) | not project data. **Q1 RULED (CoS):** they stay as a view-only play-stage constant in `looks.ts` until `map.objects[]` exist. The two looks tests stay. |

**Adapter rules (EA 2026-11-18, main `f2df5c40`):** `unit_atk` is the only source of basic damage; never read `basic-attack.damage`, and if a setup moves it off its default, warn `layerNotApplied` pointing at `unit_atk` (Q5). Reach: `same-as-step` is the step-pattern reach, exact, with no warning; `one-tile-straight` is 1; `custom-cross` with `ns = ew` uses that value; with `ns ≠ ew`, warn `layerNotApplied` and use `min(ns,ew)`, not 1 (Q6). Talk stays keyed by unit, first wins, with `layerNotApplied` (Q7).

### Open questions

| Q | Status | Owner | Question |
|---|---|---|---|
| Q1 | **RULED (CoS)** | — | Canopy and braziers stay as a view-only play-stage constant in `looks.ts` until map objects exist. The two looks tests stay. |
| Q2 | **RULED (EA)** | EA | Inline the JSON. One play-stage module imports the fixture with `with {type:"json"}`. `tools/play-stage/build.ts` follows `.json` imports and writes `<file>.json.js` as `export default ` + the raw file text (no `JSON.parse`, no shape reads; all parsing and validation stays in `src/project/read/*`, and P2 gets no exemptions; CoS ruling 2026-11-18), so loading stays sync and offline with no fetch. The APK picks it up via `tools/apk/build.ts:6`. Add `resolveJsonModule` to tsconfig. One path for Node, browser, gh-pages and WebView: minSdk 26 doesn't guarantee JSON modules. No load or fixture path may contain `editor` (`tools/apk/build.ts:11`). |
| Q3 | **RULED (EA)** | EA | Align `src/project/read/unit.ts` to project-format §6.3 in 1a. It takes `stats` as `{knob:{value,rev}}`, flattens them to values, and reads `name`. Keep the `hasOwn`/`SKIP` key safety. `readProject` calls it, so there's one parser per document. `tests/project/unit-setup.test.ts` lines 10 and 16 change by this ruling. |
| Q4 | as written | EA | Defer tile-project 005 re-id and emit `migrationDeferred`. OK? |
| Q5 | **RULED (EA)** | EA | `unit_atk` is the only source. The adapter never reads `basic-attack.damage`. If a setup moves it off its default, warn `layerNotApplied` (`detail` points to `unit_atk`). Recommend the Librarian mark it `= unit attack` in the next catalogue rev. |
| Q6 | **RULED (EA)** | EA | `same-as-step` is the step-pattern reach, exact, with no warning (the engine plays orthogonal-1 and 2). `one-tile-straight` is 1. `custom-cross` with `ns = ew` uses that value. With `ns ≠ ew`, warn `layerNotApplied` and use `min(ns,ew)` (not 1). Per-axis reach is a later `src/rules` slice. |
| Q7 | **RULED (EA)** | EA | OK as written (keyed by unit, first wins, `layerNotApplied`). Per-placement talk needs a placement key on `ResolvedPlacement`, a future DSK CN with the maker NPC slice. 1b deletes the villager fallback at `match.ts:84` (D2). An empty talk line showing the name plus `…` is a UX matter for later and doesn't block this step. |
| Q8 | as written | EA | Leave unread `line-shot.mana_cost` with no warning, because the engine ignores mana today. OK? |
| Q9 | RULED (QA 2026-11-18) | QA | Fixture and template JSON under `fixtures/**` and `data/templates/**` isn't counted, on the two conditions in Done when. |
| Q10 | as written | DSK, after EA/QA sign-off | Record **D9**: the load layer runs §12 in memory, the sim never migrates, and add the PROPOSED codes to project-format §13 as r41. |

## Build

The whole slice is about 575 lines of code and tests, so it is split. The fixture JSON (about 270 lines plus the generated slice) is data and isn't counted (Q9 RULED, with the conditions in Done when). `playDocsOf`'s ~65 lines were already in 1b in r3; they stay in 1b at the new path, and are not moved from 1a. 1b stays ≈ 220, under 400, so no further split.

### 1a — reader, about 355 lines (no play-stage change)

The reader, the Q3 `readUnit` alignment, in-memory migration, validation, the demo fixture, the slice generator, the reader tests and the parity golden capture.

| File | Cap |
|---|---|
| `src/project/load/types.ts` | 30 |
| `src/project/load/read-project.ts` (version gate, structural read, H2/H3/H5, warnings; calls `readUnit`) | 115 |
| `src/project/load/migrate.ts` (tile-project 004, 005-lite, map 004) | 40 |
| `src/project/load/index.ts` | 5 |
| `src/project/read/unit.ts` (align to §6.3: take `{knob:{value,rev}}`, flatten to values, read `name`, keep hasOwn/SKIP) | 15 |
| `tools/project/slice-of.ts` (generates `catalogue/slice.json`) | 25 |
| `tests/project/read-project.test.ts` (S1 §9 b–g, clean fixture, slice byte-equal) | 115 |
| `tests/project/unit-setup.test.ts` (lines 10 and 16 change by Q3) | 10 |
| `fixtures/demo.tileproj/**` (not counted, Q9) and `tests/tools/golden/demo-parity.json` (counted, because it's outside the exempt paths) | data |

The parity golden is captured from today's `DEMO_LOAD` **before** any constant is deleted.

Tests in `tests/project/read-project.test.ts`, unless named:

- Fixture clean, and the generated slice is byte-equal to `catalogue/slice.json`.
- (b) v4 upgrade: a downgraded tile-project 4 / map 4 loads `ok`, gains `migrated` rows, matches the v6/v5 store, and does not mutate `files`.
- (c) v7 refused: `ok: false`, `readOnly: true`, `project: null`, first row `formatNewer` on `project.json`, no throw.
- (d) H3: missing `stage.mapRef` target → hard `brokenRef`; `ok` is false; the project is still returned.
- (e) H5: terrain of length 53 → hard `terrainLength`.
- (f) H2: `stats.unit_hp.value: "6"` → hard `invalidValue`.
- (g) Unknown keys are kept in the store; an extra file gives `unknownFile` and is kept.
- Q3: `tests/project/unit-setup.test.ts` lines 10 and 16 change by ruling (`readUnit` now takes `{knob:{value,rev}}` and reads `name`).

### 1b — play stage switch, about 220 lines

The `playDocsOf` adapter in `tools/play-stage/project.ts` (moved out of `src/project/load`; those ~65 lines were already in 1b, so they stay in 1b), the play-stage switch, the parity test, the existing test updates, and deleting the `DEMO_*` constants last. 1b builds on main after S0 merges (both edit `match.ts` and `board.ts`). `createMatch()` with no docs must keep working for S0's tests. Planned ≈ 220, under 400, so no further split.

| File | Cap |
|---|---|
| `tools/play-stage/project.ts` (`playDocsOf`) | 65 |
| `tools/play-stage/load.ts` rewrite (~20) plus `board.ts`, `match.ts`, `looks.ts`, `fx.ts`, `build.ts` edits (Q2: follow `.json` imports and write `<file>.json.js` as `export default ` + the raw file text (no `JSON.parse`, no shape reads; all parsing and validation stays in `src/project/read/*`, and P2 gets no exemptions; CoS ruling 2026-11-18); add `resolveJsonModule` to tsconfig; no load or fixture path may contain `editor`) | 45 |
| `tests/tools/demo-fixture.ts` | 20 |
| `tests/tools/play-stage-parity.test.ts` | 45 |
| Edits to the 5 existing play-stage test files (S1 §9 h) | 45 |

Delete `DEMO_MANIFEST`, `DEMO_MAP`, `DEMO_STAGE`, `DEMO_SETUP`, `DEMO_TALK`, `DEMO_LOAD` last.

Tests:

- (a) Parity, in `tests/tools/play-stage-parity.test.ts`: seed 24301, bot versus bot, hashes must equal the 1a golden (fixture unit ids rewritten to slugs before hashing).
- (h) Play stage fed from the fixture: `board.ts` and `match.ts` default to `demoDocs()`. Existing play-stage tests stay, with the id and talk updates listed in the S1 spec, §9. New assertions: the seven units' `hp`/`atk` match today, `chosen` is knight and archer, and `tiles` blocks water and wall-block. The two looks tests stay (Q1 RULED). `rock` checks read `wall-block`. `tools/play-stage` runs `readProject` synchronously at boot; if the load isn't `ok` or is `readOnly`, it shows the report rows, starts no match and never throws. `createMatch()` with no docs still works for S0's tests. The villager fallback at `match.ts:84` is deleted (D2).

## Must NOT

- No game rules in the loader or the play stage; the sim is unchanged and the adapter only builds a `BattleSetup`. The maker only edits data; the engine runs the rules. There is no second implementation.
- No demo names, pictures or colours in `src/`. Demo content is project data in the fixture (and later templates such as Ash Road are data too, never code). `src/project/load/` maps catalogue knobs generically.
- `readProject` never throws, never writes, never deletes, never mutates its input. No empty `catch`: every failure becomes a report row.
- No new format fields, no version bump, no saving (that is Step 2). Nothing ad-hoc is persisted. Talk, effects and dressing are setup answers, format fields, or a tools-only view constant — never a one-off field written to disk.
- Don't touch the frozen kit copies under `handoff/steps/tests/`.
- Don't fix the phone-input bugs here (MS-00 is its own step).
- The ui-shell is a prototype and is never merged.
- **No second parser (plant P2).** Document shapes are parsed only in `src/project/read/*`. `src/project/load/*` composes those readers and owns only `migrate.ts`. `tools/play-stage/*` gets typed objects from `readProject` and never reads `kind`, `formatVersion` or raw document JSON itself. `tools/play-stage/project.ts` may call `readProject` output but still must not `JSON.parse` or read `formatVersion` / `kind ===`.
- **No empty `catch` and no silent default (Law 12, plant P1).** Every caught failure becomes a report row with a code and path. Nothing is quietly replaced by a default value, an empty project or the demo.
- **No silently defaulted `formatVersion` (plant P3).** A missing, non-integer, unsupported-old or newer `formatVersion` is never treated as the current version. Supported old versions (tile-project 4–5, map 4) are upgraded with a visible `migrated` info row. Every other value is refused with a hard row and `project: null`, and the play stage shows that error text.
- No new framework, starter template or app scaffold. Build only inside the repo's existing stack, files and test gates, starting from current main.
  ("Starter template" here means a code or app scaffold. It doesn't cover the `.tileproj` data templates under `data/templates/`, which stay allowed.)

### Notes for Step 2 and 3

These steps stay data-first.

- Every save and every load goes through the same `.tileproj` files and the same `readProject` / `migrateProject` reader. No second path, and no shell-only shape.
- Starter content and templates are `.tileproj` data, not code. The demo fixture is the first of those projects.
- A failed save is always reported to the user. The failure is typed (`staleRev`, `readOnly`, or `writeFailed(path)`) and never silent. The old files stay intact: write to a temporary file, then rename. `docs/maker/data/project-format.md` §11.2 defines `saveProject` and says a save is blocked only by `staleRev` or `readOnly`, never by checks. It does not yet spell out the temporary-file-then-rename rule. Add that sentence to §11 when D9 / r41 is recorded (Q10). Steps 2–3 follow it anyway.

## Done when

- **Gates:** `npm test` at floor **1023 + N** (main `8a737c5f` after S0, PR #76) for 1a (N = the new tests 1a adds, stated in the run report), then **1a's merged floor + N** for 1b. Also `scripts/check-law.sh` and `scripts/check-state.sh` pass, and the line count is met.
- **Line count:** `git diff --shortstat <run base>..HEAD -- . ':!fixtures/**' ':!data/templates/**'` shows insertions plus deletions ≤ 400 per run (1a planned ≈ 355, 1b planned ≈ 220). Fixture and template JSON aren't counted (Q9 RULED), on two conditions:
  1. Only `.json` files go under `fixtures/**` and `data/templates/**`. A `.ts`, `.js` or `.mjs` file there fails the gate. The run report shows `git diff --name-only <run base>..HEAD -- fixtures data/templates | rg -v '\.json$'` returning nothing.
  2. Every fixture loads through `readProject`, either as `ok` or as the hard row it's meant to produce, in a named test, so no exempt file is dead data.
- **Plants (each must fail its named test if the bad code is put back):**
  - P1 `tests/project/load/law12.test.ts`: a document that makes a reader fail (non-object, broken field) gives a hard row with code and path, never a default or an empty project. `check-law.sh` also flags any empty `catch` under `src/project/` and `tools/play-stage/`.
  - P2 `tests/project/load/one-parser.test.ts`: scans `tools/play-stage/*.ts` and `src/project/load/*.ts` (except `migrate.ts`) and fails on `JSON.parse`, `formatVersion` or `kind ===` there. No exemptions: `tools/play-stage/build.ts` emits raw JSON text and never parses it, so it passes this scan too. `tools/play-stage/project.ts` may call `readProject` output but still must not `JSON.parse` or read `formatVersion` / `kind ===`.
  - P3 `tests/project/load/version-reject.test.ts`: `formatVersion` missing, `"6"`, `6.5`, `3` and `7` each give a hard row (`invalidValue`, `formatOlder` or `formatNewer`) with `project: null`, never the current version. In 1b, `play-stage` fed a rejected project shows the error text and doesn't fall back to the demo.
- Parity: seed 24301 bot-vs-bot equals the golden (outcome, snapshot, log and bus hashes).
- v4 project upgrades in memory to the v6 store and is never written back; v7 is refused read-only (`formatNewer`) without throwing.
- Broken map ref, bad terrain length and bad stat value each give their hard row; unknown keys and files are kept.
- Every test asserts the input `files` object is unchanged. The fixture report is `[]`.
- The two looks tests still pass (Q1 RULED).
- No `DEMO_*` constant left in `tools/play-stage/` (after 1b). `DEMO_LOOKS` dressing may remain as the view-only constant in `looks.ts`.

## Prototype lessons

- ui-shell `app.js` records behaviour only. Never copy it, and never merge the shell.
- ui-shell `js/project-store.js` holds the old in-browser 001–003 migrations. It's a record of behaviour only; read it to understand, never copy it. This step's reader starts at tile-project 4 / map 4.
- Copy the Effect Designer split: the model in `src/` (`src/editor/effect/*`, here `src/project/load/*`), a thin store, and the UI in `tools/`. Each file does one job.
