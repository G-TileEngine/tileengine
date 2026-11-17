# step-b1-behaviour-runtime: Foundation B1. The behaviour runtime (ARCHITECTURE §3.1–3.2; behaviour-audit.md §4; foundation-plan.md r1 F1–F3): a registry by catalogue id, install with the answer layering L0–L4 plus L5 HP, typed `knobUnsupported` for every knob or value with no code, an in-engine catalogue slice (rev 26), and `xp-levels` and `terrain` registered so they read their settings. Pure rules code in `src/rules/behaviours/`; no sim, runtime, core or format change.

Step id: step-b1-behaviour-runtime          Revision: r<N> (start at r1; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`bb7df0fc`** (`bb7df0fcbc8db7ef02a6542cacdf7e362f36d6b0`, main: the ED-E5 kit (docs and kit tests under `handoff/` only) on top of `f8a451f5` (CN-021/CN-022); no file under `src/` or `tests/` differs from `f8a451f5`; test floor **835/0**). Branch: `step/step-b1-behaviour-runtime-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-b1-behaviour-runtime-r<N>.bundle bb7df0fc..step/step-b1-behaviour-runtime-r<N>`, then `git bundle verify`. Upload the bundle and a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: `handback/step-b1-behaviour-runtime/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: step 18 (merged): `src/rules/levels` (`LevelRules`, `createLevels`); core-types `CoreTileType`, `CoreTerrainKnobs`; `src/core/notice.ts` (`Notice`), `src/core/plain.ts` (`isRecord`). Sim input fields `tiles`, `terrain`, `levels` (unchanged).
Read first: BUILD_GUIDE.md §0, §2 (engine law), §6 (green); `data/setup-format.md` §2.1–2.6 (envelope, Answer, effective value, checks, active/inactive), §2.9.2–2.9.4 (lists, reserved ids, item fields); `data/project-format.md` §7.1 (value layering); DSK's A1 answers 22:23 (layering: unit stats L4 ?? L3 ?? L2 ?? L1, other knobs L2 ?? L1, L0 under L1, L5 last).
Kit: kit-1 **r8**, 2026-11-17. Engine Architect. Proto `/tmp/b1` branch `b1`, head **`32f9019c`** (`32f9019cc2c505501e05001f720a4124ad091da7`, tree `86e9011c`), 10 commits on the Base (r1 `7c588e15`, r2 `f6faf279`, r3 `226fc372`, QA pin `68eca030`, r4 `446ff9fe`, QA pin `f2f61867`, r5 `0650e78c`, QA pin `090551e4` = r6, r7 `e7466730`, QA pin `32f9019c` = r8; G-TileEngine noreply author and committer). 8 files, +433/−0 = **433 changed lines** (src 233, tests 200). Green **851/0** (835 + 13 EA + 3 QA). EA plants **99/99** (`b1-plants.py`); QA plants **31/32** (`b1-qa-plants-r4.py`, the r3 set with Q5 retargeted; Q2 is an equivalent mutant); `b1-qa-plants-r4-new.py` **10/12**; N3 and N4 needles are stale — the old 48-char hard cap — and are left unchanged (QA's files). Bundle backup `/workspace/share/step-b1-proto-r8.bundle` (r7: `step-b1-proto-r7.bundle`, r6: `step-b1-proto-r6.bundle`, r5: `step-b1-proto-r5.bundle`, r4: `step-b1-proto-r4.bundle`, r3: `step-b1-proto-r3.bundle`, r2: `step-b1-proto-r2.bundle`, r1: `step-b1-proto.bundle`).
Kit r2 changes (no builder REJECT; the kit changed before any build): DSK's setup-format **r29** rulings (§ DSK rulings) and QA's r1 read-only findings as ruled by EA (§ QA findings). Code: `strayValue`, `{value, rev}` layers with `nullable`, checks and notices only on active knobs, `unknownKnob` on every layer, `unknownBehaviour`, `unknownField`, a generated table hash stamp and generated gate defaults. Tests 10 → 12; plants 63 → 83.
Kit r3 changes (no builder REJECT): EA withdrew the r2 `inactiveValue` warning; **setup-format §2.6 and ARCHITECTURE §3.4 win**. Turning a gate off is a normal user action and the answers are kept (not dropped) so they come back when the gate turns on, so it is not a silent drop. A gated-off knob that holds a value resolves to nothing, gives no notice, and its stored value is untouched. Plants 78–79 now catch a notice for an inactive value and an inactive value leaking into the result.
Kit r4 changes (QA r3 NOT OK, `docs/qa/step-b1-review.md` sha256 `51b1676d…`; no builder REJECT): QA's pin `refs/cmp/b1-qa-fix-a` `68eca030` (tree `3152ae70`, parent `226fc372`) is adopted whole: `tests/rules/behaviours-qa.test.ts` (30 lines, 3 tests, sha256 `fb0c8d0b…`) ships unchanged next to EA's test (M1). On top: **M2** a layer document that is not a record warns `unknownKnob ${behaviour}.* (${layer})`; **S1** list items need an id matching `[a-z0-9][a-z0-9_-]{0,31}` and a 1–48 char string label (setup-format r29 L333/L336); **S2** an L5 result that is not finite is hard and L5 is skipped; **S3** the generator deep-freezes every catalogue table and `CATALOGUE` (restamped: the table hash is unchanged at `3b16c673…`, since freezing does not change the data). § QA review r3 has the rulings; § Not in this step has QA's report-only carries.
Kit r5 changes (QA r4 NOT OK; no builder REJECT): QA's pin `refs/cmp/b1-qa-r4-fix-a` `f2f61867` (tree `670d1976`, parent `446ff9fe`) is adopted whole: it adds 1 assert to `tests/rules/behaviours-qa.test.ts` (now 31 lines, sha256 `efd4b23a…`; N8, an uppercase item id is hard). **S5:** `TERRAIN` and `XP_LEVELS` are exported `Object.freeze`d (0 extra lines; their `knobs` are the deep-frozen catalogue tables), so `TERRAIN.knobs = []` or `XP_LEVELS.install = () => 42` throws `TypeError` and never reaches a later install. New carries in § Not in this step (rev 27, label length, null layer docs, L336 severity).
Kit r6 changes (doc only, no new EA code): QA's pin `refs/cmp/b1-qa-r5-fix-a` `090551e4` (tree `36e19104`, parent `0650e78c`) is adopted whole and is the r6 head (branch `b1` fast-forwarded, no EA commit): it adds 1 assert to `tests/rules/behaviours-qa.test.ts` (now 32 lines, sha256 `114dff37…`; `TERRAIN.knobs` and `XP_LEVELS.knobs` are frozen). The rev 27 carry now names B5 only; two report-only carries added (host-passed behaviour objects, install-function properties).
Kit r7 changes (DSK 00:23, no builder REJECT): a list-item label over 48 chars warns `outOfRange` and is kept as stored (the editor clips it for display); a missing, empty or non-string label stays hard, and the id pattern stays hard. New EA commit `e7466730` (tree `fc4c7833`, parent `090551e4`). Test 13 asserts a 49-char label is playable at L1 with notice `outOfRange terrain.tile_types bog.label`. Plant 91 is retargeted to drop the long-label warning; plant 99 catches a long label made hard again. The L336 carry is resolved. QA plants N3 and N4 missed (10/12): their needles still target the old `length <= 48` hard cap and are left unchanged (QA's files).
Kit r8 changes (QA r7 M5; doc only, no new EA code): QA's pin `refs/cmp/b1-qa-r7-fix-a` `32f9019c` (tree `86e9011c`, parent `e7466730`) is adopted whole and is the r8 head (branch `b1` fast-forwarded, no EA commit): it adds 1 assert to `tests/rules/behaviours-qa.test.ts` (now 33 lines, sha256 `b717565a…`): a 48-char label is silent, and a 49-char label warns `outOfRange` once and is kept at full length. New report-only carry: label length counts UTF-16 code units.
Carries: see § Not in this step. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) are unchanged. **No core-types change, no CoreUnit change, no CN, no sim change.** Six new rules files; deps 113 modules / 363 deps → **119 / 380**; the depcruise config is unchanged and passes (`rules-below-runtime`: rules imports only core, types and rules).

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Prerequisites (status at kit r8 time; EA checked, not assumed)
- **CEO order 22:45 (via CoS):** "Get all the things in the foundation working as originally intended." B1 is the first step of the foundation plan (`foundation-plan.md` r1 §4a).
- **DSK layering answers (22:23) — met:** no CoreUnit widening, no core-types change, no CN. B1 resolves plain documents handed in by the caller; the readers that load them (`readUnit`, stage overrides, difficulty) are B5.
- **Catalogue:** `behaviours.json` rev 26, sha256 `ea8b3302adccce6e144b00b02072bb191dddfe13f079ea6f6bfac57756e523b0` (64 behaviours, 567 knobs). B1 carries the xp-levels (19 knobs) and terrain (10 knobs) slice, generated by EA's `gen-catalogue.py` and byte-checked against the catalogue. The Librarian published rev 27 to `behaviours.json` at 23:29; B1 stays on rev 26, so the generator reads the archived `behaviour-library/_src/behaviours.rev26.json` (sha256 `ea8b3302…`, identical to the rev 26 file) and still asserts rev 26 and the sha.

## Goal
The catalogue lists 64 behaviours and 567 settings, but no engine code reads a single setting: the three behaviours with code (`xp-levels`, `terrain`, `effect`) take numbers fixed in code (`BTF_LEVEL_RULES`, a test tile list). After this step (pure rules logic in `src/rules/behaviours/`, testable in Node):
1. **A registry** maps each behaviour id to its implementation and its knob schema with the catalogue (BTF) defaults as data.
2. **Install/resolve** gives every knob an effective value by the layering (L0 catalogue default → L1 setup answer → L2 stage override → L3 unit stat → L4 stage unit override, L5 HP multiplier last), checks values like answers, and drops inactive knobs (gates).
3. **Nothing is silently ignored:** every active knob the behaviour does not read, every value it cannot play, and every setup for a behaviour with no code comes back as a typed `knobUnsupported` with a notice.
4. **`xp-levels` and `terrain` read their settings:** at the defaults they give exactly BTF's levelling and the confirmed tile types; an edited setting changes what reaches `createLevels` and the sim.

## Rulings (r8 text; § DSK rulings and § QA findings win where they differ)
1. **Place and layering.** New folder `src/rules/behaviours/`: `types.ts`, `catalogue.ts`, `registry.ts`, `xp-levels.ts`, `terrain.ts`, `index.ts`. Imports only `src/types`, `src/core/notice.ts`, `src/core/plain.ts` and `src/rules/levels` (types). No game rule enters `src/core` or `src/sim`. The catalogue file outside the repo is never read; the slice is data in `catalogue.ts`.
2. **Registry.** `createRegistry(defs)`: ids in order; an empty or repeated behaviour id, or a repeated knob id inside one def, throws `RangeError` (programming error). `get(id)` is a `Map` lookup (`"__proto__"`, `"toString"` → `undefined`). The result is frozen.
3. **Answers and layers (setup-format §2.2, project-format §7.1, DSK 22:23).** `SetupLayers = {answers?, stage?, unit?, stageUnit?}`, all plain records keyed by knob id, read with own keys only. L1 = `answers[k]`: `{source: "default"}` falls through (with a `value`: warning `strayValue`, see § DSK rulings); `source` `"user"` or `"preset"` with a `value` is L1; any other shape is `invalidValue`. L2/L3/L4 = `{value, rev}`; no `value` is `invalidValue`. Order: a `perUnit` knob is **L4 ?? L3 ?? L2 ?? L1**, any other knob **L2 ?? L1**, then L0 = the spec `default`. `unit`/`stageUnit` keys naming a non-`perUnit` knob of this behaviour warn `notPerUnit` and are ignored; keys not in the spec warn `unknownKnob` (r2, QA 3a).
4. **Checks (setup-format §2.5, C4).** A layer value the runtime can't read is a **hard** `invalidValue ${behaviour}.${knob} (${layer})` and that layer is skipped: slider not a finite number; toggle not a boolean; picker value not in `options`; list not an array of records, an item `id` not a string matching `^[a-z0-9][a-z0-9_-]{0,31}$`, an item `label` missing, not a string, or empty (r7, DSK 00:23, setup-format §2.5 / L333), ids repeated, or an `item` field present but not a boolean; `null` on a knob without `nullable: true` (r2). A label over 48 chars warns `outOfRange ${behaviour}.${knob} ${id}.label` and is kept (the editor clips it). Slider `outOfRange` (outside min–max) or else `offStep` (tolerance 1e-9) warns and the value is **used as is**, never clamped. Keys not in the spec on any layer warn `unknownKnob ${behaviour}.${key} (answers|stage|unit|stageUnit)`; a layer document that is a number, string, array or other non-record (not `undefined`/`null`) warns `unknownKnob ${behaviour}.* (${layer})` and is read as empty (r4, QA M2). Any hard notice → `playable: false`, `out: null`, the behaviour is not installed.
5. **Lists (§2.9.3–2.9.4).** For a non-L0 list value, each item reads absent `item` fields from their defaults; with `reserved`, an item key other than `id`, `label` or an `item` field warns `unknownField ${behaviour}.${knob} ${id}.${field}` and is kept (r2, QA 3d); each built-in (default) item whose id is missing warns `reservedMissing ${behaviour}.${knob} ${id}` and is appended (catalogue order). L0 is used as stored.
6. **L5 (HP).** For a knob with `l5: "hp"` and `ctx.difficulty.hp` set: `max(1, round(value × hp))` after all layers; `hp` not a finite number > 0, is a hard `invalidValue difficulty.hp for ${behaviour}.${knob}`; a result that is not finite (e.g. 1e308 × 2) is a hard `invalidValue ${behaviour}.${knob} (L5)`. Either way L5 is skipped and the value stays at its layer (r4, QA S2). The two messages differ so a bad multiplier and an overflow stay distinguishable (this keeps QA's Q7 observable). The host passes `difficulty` only for units in `appliesTo` (B5). Damage × is B2.
7. **Active knobs (setup-format §2.6).** `when: {knob, eq}` (same behaviour) is true when that knob is active and its effective value `=== eq`; `when: {gate}` reads `ctx.gates[name] === true` when the caller passes that name, else `GATE_DEFAULTS` (`uses-menu` true, `uses-card-hand` false = catalogue default `ability-presentation.shortcut = "all-menu"`); unknown gates are false; cycles are false. `GATE_DEFAULTS` is generated from the catalogue's `gates` rules evaluated at the catalogue defaults (r2, QA 2), never hand-written. Inactive knobs resolve to nothing: not in `knobs`, not read, not reported as `knobUnsupported`, and their checks are dropped (r2, §2.6). A value stored for an inactive knob (any layer, including a `source: "default"` stray) gives **no notice** and is left untouched in the input, so it comes back when the gate turns on (r3; setup-format §2.6, ARCHITECTURE §3.4).
8. **knobUnsupported.** `install(k)` gets a `KnobReader`: `get(knob)` returns the active effective value (inactive → `undefined`) and marks it read; `unsupported(knob, detail?)` records `why: "value"`. After install, every active knob not read is `why: "noCode"`. Each entry is `{code: "knobUnsupported", behaviour, knob, value, layer, why, detail?}` plus one notice `knobUnsupported ${behaviour}.${knob}[ ${detail}] (${why})`. Defaults count: a knob BTF uses that has no engine code is reported even at L0.
9. **installSetups(reg, setups, ctx).** In order, one result per behaviour id (`Map`). A repeated id warns `duplicateSetup` on the first and is skipped (the host picks the stage or project setup, B5). An id the registry lacks: `out: null`, `playable: true`, one warning `unknownBehaviour ${id} (${layer})` for each of answers/stage/unit/stageUnit that holds keys (r2, QA 3b), one `noBehaviour` entry per answer key (with its `value`), or one `"*"` entry when it has none. `outOf(got, def)` returns the typed `out` or `null`.
10. **xp-levels.** Reads `level_rule` (only `xp_table` plays; `pvp_kills` → `unsupported(level_rule, "pvp_kills levelling")`, `out: null`), `levels` (whole 1–thresholds length, else `unsupported(levels, "<v> needs 1–<n>")`, null), `thresholds` (the picker string split on commas, first `levels` entries), `xp_move` (whole ≥ 0, else unsupported, null), and under the menu gate `ability_unlock_levels` (≤ `levels`) and `unlock_pick_count` (whole ≥ 1, else unsupported, null). Result: `{bar: "side", thresholds, offerLevels, offerSize: pick ?? 1, xp: {move}}`; under the card-hand gate `offerLevels` is `[]`. At L0 it **equals `BTF_LEVEL_RULES`** (towerXp.ts XP_AT, LEVEL_CAP 9). `bar` is "side" (BTF; the catalogue has no knob).
11. **terrain.** `tile_types` → `tiles` (`{id, open, push_can_enter}`, catalogue order), `push_into_walls` → `terrain`. An item with `kills_on_landing`, `slows_move`, `trips` or `buildable` on → `unsupported(tile_types, "<id>.<flag>")`; `lanes_enabled` true → `unsupported(lanes_enabled, "lanes")`. At L0: the 15 built-ins with water `{open:false, push_can_enter:false}`, lava `{true, true}`, wall-block `{false, false}` (EA-confirmed 2026-11-09).
12. **Frozen catalogue (r4, QA S3).** `CATALOGUE`, `GATE_DEFAULTS`, `TILE_TYPES`, `XP_LEVELS_KNOBS` and `TERRAIN_KNOBS` are deep-frozen by the generated code. L0 values are that frozen data, shared read-only; a mutation attempt throws `TypeError` (ES modules are strict) and never leaks into the next install. Non-L0 lists are fresh copies per install; `Installed.knobs` is frozen. The behaviour definitions `XP_LEVELS` and `TERRAIN` are frozen too (r5, QA S5): assigning `knobs` or `install` throws.
13. **One clock, no randomness, bounded.** No `Math.random`, `Date`, timers; same input → same output. Gate depth ≤ knob count. No `Card`/`Deck` identifiers (knob ids are strings).

## DSK rulings (setup-format r29 §2.2, §2.5, §2.9.4; project-format §7.1) — r2
1. **Stray value (§2.2).** `{source: "default", value}` is a **warning** `strayValue ${behaviour}.${knob}`: the value is ignored, the answer resolves to L0 (or the next layer), the input is not mutated. `source` user/preset with no `value`, or a value of the wrong type, is a **hard** `invalidValue`: that layer is skipped and the knob falls to the next layer / L0.
2. **Item fields (§2.9.4).** An absent list-item field reads its item default; a non-boolean (wrong type) item field is a hard `invalidValue`. Preview/run use the field default for that row (the shipped `TERRAIN` does).
3. **Layer shapes (§7.1).** L2 = `stage.overrides.setups[behaviourId][knobId]`, L3 = `unit.stats[statKnobId]`, L4 = `stage.overrides.units[unitId][statKnobId]`; each `{value, rev}`, no `source`, no `presetRef`. A missing key = layer unset. Wrong type = hard, that layer skipped. Out of range = warning, the value plays. `null` is valid only on `nullable` knobs. L3/L4 accept only `per_unit` knobs (others: `notPerUnit` / `unknownKnob` warning, ignored). L2 lays over whichever setup won L1. Unit stats L4 ?? L3 ?? L2 ?? L1, other knobs L2 ?? L1, L5 difficulty last. Inactive knobs resolve to nothing.
Gap found and fixed in r2: r1 hard-checked values on inactive knobs (now dropped per §2.6) and treated a stray value as hard. Asserted in test 11; plants 64–72.

## QA findings (QA's r1 read-only review, EA rulings) — r2
1. **Catalogue drift.** `gen-catalogue.py` (EA, run on the Librarian's `behaviours.json`) asserts rev 26 / `ea8b3302…` and stamps `CATALOGUE.table` = sha256 of the canonical JSON `{gates, "xp-levels", terrain}` of the generated tables (`3b16c673b0afb3b3bae0fcac1909af1980168b30c7b1734595065e26f4a40eae`). Test 12 recomputes it from the exported tables, so a hand edit fails. To change the slice, regenerate from the Librarian's new rev; never hand-edit `catalogue.ts`. QA's proto-check re-runs `gen-catalogue.py` and requires the output byte-identical to `catalogue.ts`. `behaviours.json` is **not** vendored into the repo.
2. **Gate defaults** are derived by the generator from the catalogue `gates` rules (ruling 7); test 12 pins all-menu → `{uses-menu: true, uses-card-hand: false}`.
3. **No silent drops; all warnings, Play never blocked:** (a) `unknownKnob` on L3/L4 keys too; (b) `unknownBehaviour` per layer holding values, `playable` stays true; (c) withdrawn in r3: a value on a gated-off knob is kept, not dropped (setup-format §2.6, ARCHITECTURE §3.4), so it resolves to nothing with no notice and the input is untouched; (d) `unknownField` for unknown list-item fields, value kept. Asserted in tests 11–12; plants 73–83.
4. **Coverage honesty.** No real rev 26 knob in this slice (`xp-levels`, `terrain`) is `per_unit` or `l5: "hp"`. L3/L4 and L5 HP are therefore tested only through the test `ROSTER` fixture in `tests/rules/behaviours.test.ts`; real coverage arrives with `unit-roster` in **B2** and the readers in **B5**.

## QA review r3 (`docs/qa/step-b1-review.md` 51b1676d) — r4 rulings
- **M1 (adopted):** QA's pin `68eca030` is adopted whole; `tests/rules/behaviours-qa.test.ts` ships byte-identical (sha256 `b717565a044ce3fd530f4078a496e21187cab752b77d68ed2c23833fcee61ccf` after QA's r4 pin `f2f61867`, r5 pin `090551e4` and r7 pin `32f9019c`). It is not folded into EA's file, so QA's 3 tests and their asserts stay intact.
- **M2 (fixed):** ruling 4. Asserted in test 13; plants 84–85.
- **S1 (fixed, r7 DSK 00:23):** setup-format L333 says an item without `id` or `label` is a hard `invalidValue`, and a field of the wrong type is hard. The label must be a non-empty string; a missing, empty or non-string label is hard, and a bad id (not matching `[a-z0-9][a-z0-9_-]{0,31}`) is hard. A label over 48 chars warns `outOfRange` and is kept as stored (the editor clips it for display; setup-format §2.5). The whole list layer is skipped only on a hard item error. Built-in ids and labels all pass. Asserted in test 13; plants 86–91, 99.
- **S2 (fixed):** ruling 6. Asserted in test 13 (unit_hp 1e308 × hp 2: hard `invalidValue roster-test.unit_hp (L5)`, value stays 1e308 at L1); plants 92–93.
- **S3 (fixed):** ruling 12. Asserted in test 13 (pushing to the L0 `tile_types`, setting a knob default and a tile flag all throw; the next install still has 15 tiles and `BTF_LEVEL_RULES`); plants 94–96.
- **S4 (size):** see § Files (433 lines, band reason).
- **S5 (QA r4 review, fixed in r5):** behaviour definitions frozen (ruling 12). Asserted in test 13; plants 97–98. QA's r4 pin `f2f61867` (N8) and r5 pin `090551e4` (S5e/S5f: the def knob lists are frozen) adopted whole.
- **QA plants:** QA's r4 copy `b1-qa-plants-r4.py` (QA's r3 set; identical body to EA's adapted copy) catches 31/32 on r7 (Q2 is an equivalent mutant, as QA found). QA's `b1-qa-plants-r4-new.py` (N1–N12) catches **10/12**: N3 (`label unchecked`, needle includes `length <= 48`) and N4 (`label cap 49`) still target the old hard 48-char cap, so the needles no longer exist and are left unchanged (QA's files). N5 (empty label) still applies. In r4, `i["id"] !== ""` became the id pattern, so Q5's needle no longer exists. EA's copy `b1-qa-plants-r4.py` retargets only Q5 to the same mutation (empty id accepted: `ITEM_ID.test(i["id"])` → `(i["id"] === "" || ITEM_ID.test(i["id"]))`).

## CN / format questions (for DSK and the Librarian; report-only, nothing filed)
- **No new CN.** B1 reads only existing envelope fields and project-format §7.1 layers.
- See § Open questions.

## Open questions (r8: all resolved)
- **Librarian L1 (resolved):** "side" means BTF's lower strip; a `bar` knob comes in catalogue rev 27. B1 keeps `bar: "side"`.
- **Librarian L2 (resolved):** `levels` max stays 9; above the table length stays `knobUnsupported` (value).
- **Librarian L3 (resolved):** a level-set knob type comes in rev 27. B1 parses the single-option strings as given and **stays pinned to rev 26 `ea8b3302`**; rev 27 comes in B5, which regenerates the tables and rewrites the xp-levels install.
- **DSK D1–D3 (resolved):** setup-format r29, see § DSK rulings.
- **Modes M1 (resolved):** gate defaults (`uses-menu` true, `uses-card-hand` false) stand unless Modes objects; B6 resolves the real answers.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/rules/behaviours/types.ts` | new: `KnobType`, `Gate`, `KnobSpec`, `Layer`, `Resolved`, `SetupLayers`, `SetupIn`, `InstallCtx`, `KnobUnsupported`, `KnobReader`, `BehaviourDef`, `Installed`, `Registry` | 23 | 26 |
| `src/rules/behaviours/catalogue.ts` | new: `CATALOGUE`, `GATE_DEFAULTS`, `TILE_TYPES`, `XP_LEVELS_KNOBS`, `TERRAIN_KNOBS` (generated by `gen-catalogue.py` from rev 26, deep-frozen, table hash stamped) | 46 | 48 |
| `src/rules/behaviours/registry.ts` | new: `createRegistry`, `resolveKnob`, `installOne`, `installSetups`, `outOf` (rulings 2–9, § DSK rulings, § QA findings, § QA review r3, r7 DSK label ruling) | 117 | 120 |
| `src/rules/behaviours/xp-levels.ts` | new: `XP_LEVELS`, frozen (ruling 10) | 22 | 26 |
| `src/rules/behaviours/terrain.ts` | new: `TERRAIN` (frozen), `TerrainOut` (ruling 11) | 20 | 24 |
| `src/rules/behaviours/index.ts` | new: exports | 5 | 6 |
| `tests/rules/behaviours.test.ts` | new, shipped (13 tests) | 167 | 167 |
| `tests/rules/behaviours-qa.test.ts` | new, shipped: QA's pins `68eca030` + `f2f61867` + `090551e4` + `32f9019c` (3 tests), byte-identical | 33 | 33 |
Total ≤ 450 (band 400–500, reason given) changed lines (proto **433**: src 233, tests 200). **Band reason:** QA's pins (33 lines, adopted whole per M1) plus M2 and S1–S3 (+18 in EA's r4 commit), S5 (+2 test lines in r5) and r7's DSK label ruling (+3) on top of the r2 DSK rulings and QA r1 findings; without the pins B1 is 400. `docs/foundation/STATUS.md` is **not** in this slice: it is written in B1's merge-time doc commit (it needs the merge sha, and adding its ~99 lines here would put B1 at ~440, in the band).

## Interfaces to match (quoted exactly; bodies elided)
```ts
export type KnobType = "slider" | "toggle" | "picker" | "list";
export type Gate = { readonly knob: string; readonly eq: unknown } | { readonly gate: string };
export type KnobSpec = { readonly id: string; readonly type: KnobType; readonly default: unknown; readonly min?: number; readonly max?: number; readonly step?: number; readonly options?: readonly unknown[]; readonly perUnit?: true; readonly nullable?: true; readonly l5?: "hp"; readonly when?: Gate; readonly item?: Readonly<Record<string, boolean>>; readonly reserved?: true };
export type Layer = "L0" | "L1" | "L2" | "L3" | "L4";
export type Resolved = { readonly value: unknown; readonly layer: Layer };
export type SetupLayers = { readonly answers?: unknown; readonly stage?: unknown; readonly unit?: unknown; readonly stageUnit?: unknown };
export type SetupIn = SetupLayers & { readonly behaviourId: string };
export type InstallCtx = { readonly gates?: Readonly<Record<string, boolean>>; readonly difficulty?: { readonly hp: number } };
export type KnobUnsupported = { readonly code: "knobUnsupported"; readonly behaviour: string; readonly knob: string; readonly value: unknown; readonly layer: Layer | null; readonly why: "noCode" | "value" | "noBehaviour"; readonly detail?: string };
export type KnobReader = { get(knob: string): unknown; unsupported(knob: string, detail?: string): void };
export type BehaviourDef<T = unknown> = { readonly id: string; readonly knobs: readonly KnobSpec[]; readonly install: (k: KnobReader) => T };
export type Installed<T = unknown> = { readonly id: string; readonly out: T | null; readonly knobs: Readonly<Record<string, Resolved>>; readonly unsupported: readonly KnobUnsupported[]; readonly notes: readonly Notice[]; readonly playable: boolean };
export type Registry = { readonly ids: readonly string[]; get(id: string): BehaviourDef | undefined };
// catalogue.ts
export const CATALOGUE: { readonly rev: 26; readonly sha: "ea8b3302adccce6e144b00b02072bb191dddfe13f079ea6f6bfac57756e523b0"; readonly table: "3b16c673b0afb3b3bae0fcac1909af1980168b30c7b1734595065e26f4a40eae" };
export const GATE_DEFAULTS: Readonly<Record<string, boolean>>;   // generated: { "uses-card-hand": false, "uses-menu": true }
export const TILE_TYPES: readonly Readonly<Record<string, unknown>>[];   // the 15 built-ins, catalogue order and fields; deep-frozen
export const XP_LEVELS_KNOBS: readonly KnobSpec[];   // 19, catalogue order
export const TERRAIN_KNOBS: readonly KnobSpec[];     // 10, catalogue order
// registry.ts
export function createRegistry(defs: readonly BehaviourDef[]): Registry;
export function resolveKnob(behaviour: string, s: KnobSpec, layers: SetupLayers, ctx?: InstallCtx): { resolved: Resolved; notes: Notice[] };
export function installOne<T>(def: BehaviourDef<T>, layers: SetupLayers, ctx?: InstallCtx): Installed<T>;
export function installSetups(reg: Registry, setups: readonly SetupIn[], ctx?: InstallCtx): Map<string, Installed>;
export const outOf: <T>(got: ReadonlyMap<string, Installed>, def: BehaviourDef<T>) => T | null;
// xp-levels.ts / terrain.ts
export const XP_LEVELS: BehaviourDef<LevelRules | null>;
export type TerrainOut = { readonly tiles: readonly CoreTileType[]; readonly terrain: Pick<CoreTerrainKnobs, "push_into_walls"> };
export const TERRAIN: BehaviourDef<TerrainOut>;
```
The knob specs in `catalogue.ts` must equal the catalogue rev 26 (id, type, default, min, max, step, option values, `active_when`, and for `tile_types` the item defaults and `reserved: true`), in catalogue order. QA checks it by re-running EA's `gen-catalogue.py` (byte-identical output) and test 12 checks the table hash stamp (§ QA findings 1).

## Smoke lines
Unchanged: `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0; chaos smoke 3120/0 and 5542/0. Host example: `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`.

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done (16 new: 13 EA + 3 QA; ship both files byte-identical)
| Shipped file (under `handoff/steps/tests/step-b1-behaviour-runtime/`) | Copy to | sha256 |
|---|---|---|
| `tests/rules/behaviours.test.ts` | same path | `0100f22700c434e6270a78021e35c333d13da1e17364d7b0b341fad73461931f` |
| `tests/rules/behaviours-qa.test.ts` | same path | `b717565a044ce3fd530f4078a496e21187cab752b77d68ed2c23833fcee61ccf` |

1. "B1 registry: one id per behaviour and per knob, repeats throw; the catalogue slice is stamped rev 26"
2. "B1 BTF parity: xp-levels at L0 is BTF_LEVEL_RULES and terrain at L0 is the 15 built-ins (water, lava, wall-block as confirmed); a world built from them matches the BTF one"
3. "B1 layering: an army knob is L2 ?? L1 ?? L0; a default-source answer falls through; a preset answer is L1"
4. "B1 unit stats: L4 ?? L3 ?? L2 ?? L1 ?? L0, then L5 HP = max(1, round(value × hp)); a bad multiplier is hard"
5. "B1 checks: a wrong type is a hard invalidValue (that layer skipped, nothing installed); out of range and off step warn and are used as is; unknown knobs warn"
6. "B1 knobUnsupported: every active knob with no code is reported, defaults included; inactive knobs are not; each has a notice"
7. "B1 gates: same-behaviour and named gates decide which knobs are active; pvp_kills and lanes are reported, not ignored"
8. "B1 edits change the game: fewer levels trim thresholds and offers, the second table and a pick of 2 reach createLevels; bad levels are refused"
9. "B1 terrain lists: an absent item field reads its default, a missing built-in warns and is appended, repeats and non-boolean flags are hard; push_into_walls reaches the sim"
10. "B1 installSetups: in order; a repeat warns and is skipped; a behaviour with no code reports every answer as noBehaviour"
11. "B1 r2 DSK rulings (setup-format r29 §2.2, §2.5, §2.6, §2.9.4): strayValue, {value, rev} layers, nullable, and no checks on inactive knobs"
12. "B1 r2 QA findings: the generated table is hash-stamped, gate defaults come from the catalogue, nothing is dropped without a warning, and a gated-off value is kept silently (§2.6)"
13. "B1 r4 QA review: a layer that is not a record warns, list items need a pattern id and a non-empty label, L5 stays finite, and the catalogue is frozen"
14. "B1 QA pin: own keys only, prototype-named item fields warn, empty ids and Infinity are hard" (`behaviours-qa.test.ts`)
15. "B1 QA pin: L5 rounds to nearest and touches only l5 knobs; range edges; stageUnit notPerUnit; L2 ignores source" (`behaviours-qa.test.ts`)
16. "B1 QA pin: a gate leaf on an inactive knob is false (§2.6); a buildable tile is reported" (`behaviours-qa.test.ts`)

## How a planted bug is caught (EA plants 99/99, `b1-plants.py` + list `b1-plants-list.py`; QA plants 31/32 `b1-qa-plants-r4.py`; QA plants 10/12 `b1-qa-plants-r4-new.py` (N3/N4 stale needles, left unchanged); run by `proto-check.sh --plants-file` / `qa-plants.sh --plants-file`)
Registry (1–3), value types (4–8), lists and built-ins (9–11), layer order and sources (12–19), range/step/L5 (20–26), unknown and per-unit warnings (27–28), gates (29–32, 60, 63), install and reporting (33–41), `outOf` (42), xp-levels (43–51, 58–59), terrain (52–57, 61), catalogue stamp (62); r2 DSK rulings: strayValue, `{value, rev}`, nullable, inactive checks (64–72); r2 QA findings: table hash and generated gate defaults (73–74), `unknownKnob` on unit layers (75), `unknownBehaviour` (76–77, 83), r3 inactive values per §2.6: a notice for an inactive value (78), an inactive value leaking into the result (79), `unknownField` (80–82); r4 QA review: non-record layer docs (84–85), item id and label (86–91), finite L5 (92–93), frozen catalogue (94–96); r5 QA review: frozen behaviour definitions (97–98); r7 DSK ruling: long-label `outOfRange` silent (91, retargeted) and a long label made hard (99). Every EA plant fails `tests/rules/behaviours.test.ts`. QA's 32 plants (Q1–Q32) run against both test files; all but the equivalent Q2 fail. Of QA's 12 r4 plants (N1–N12), N3 and N4 still needle the old 48-char hard cap and are left unchanged.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 851 passing** (835 + 16) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on `bb7df0fc`: 851/0; deps 119 modules / 380 deps; `check:law OK (src)`.)
- [ ] `node tools/pixel-suite/smoke.ts`, `node tools/host-example/match-picture.ts`, `npm run -s sim` and `node tests/perf/stress-budget.ts` print the § Smoke lines.
- [ ] `git diff bb7df0fc --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty (pins `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`). If a core-types or dependency-rule change seems needed, **stop and report**.
- [ ] `git diff bb7df0fc --stat -- src/core src/sim src/runtime src/fx src/editor src/project src/btf-adapters src/rules/levels src/rules/turns` is empty.
- [ ] Both shipped test files are byte-identical to the sha256s above.
- [ ] Each file within its cap; ≤ 450 changed lines in total (band 400–500, reason given).
- [ ] `python3 gen-catalogue.py` on catalogue rev 26 reproduces `src/rules/behaviours/catalogue.ts` byte-identical (QA).
- [ ] No `Math.random`, `Date`, timers or `Card`/`Deck` identifiers. Nothing in `src/` reads files or the catalogue folder.
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
835 → **851**: 835 (main `bb7df0fc` = `f8a451f5` for tests) + 13 EA (`tests/rules/behaviours.test.ts`) + 3 QA (`tests/rules/behaviours-qa.test.ts`, QA's floor 850 + EA's r4 test). Kit tests under `handoff/` are not run on main until merge.

## Perf (phone floor)
No runtime code changes. Install runs once per match setup, never per frame; 29 knobs (plus 4 layer scans for unknown keys and held values), linear in knobs + answer keys.

## Not in this step (carries, with their target step)
- Effect registered through the registry (44 knobs, per-owner `effect` answers, L2 ?? L1): needs an ability owner → B3 passes the `effect` answer, E7p plays it, B35 hooks it (foundation-plan §2 row 60).
- The readers that build `SetupLayers` from project files (`readUnit`, stage overrides, difficulty, setup docs; the stage-vs-project L1 pick) and `layerNotApplied` → **B5**.
- Damage × (L5) and every hp/atk knob (`unit-roster`) → **B2**.
- The remaining xp-levels knobs (XP for attacks and kills, choice levels, unit unlocks, card offers, pvp_kills) → **B23**; terrain lethal landing, slow, trap, LOS, shots, lanes → **B10**.
- Named gates from the real `ability-presentation` answers (`resolvePresentation`) → **B6**. Tile-type alias `wall_block` → reader (B5).
- QA report-only (r3 review): unknown `ctx.gates` names and non-boolean gate values (read as false, silently) → **B6** with the real gates; `rev` is not checked on any layer → **B5** readers; a behaviour-level `active_when` is not evaluated (none in xp-levels or terrain at rev 26) → the first step that registers a behaviour with one; `out.tiles` is a fresh unfrozen array per install, noted as harmless.
- **REV 27 CARRY (QA r4):** catalogue rev 27 adds `xp-levels.bar`; `thresholds` becomes an int-list with an array default; `level_card_offer_levels`, `ability_unlock_levels`, `choice_levels`, `unit_unlock_levels` and `level_draw_levels` become level-set arrays; the Librarian's legacy comma-string read gives a `legacyConverted` notice. `xp-levels.ts` parses comma strings today, so the step that moves B1 to rev 27 is **B5** (the authored data readers step): it moves to rev 27 and must **rewrite the xp-levels install**, not just regenerate `catalogue.ts`, or it will give empty thresholds.
- The 48-character label limit is hard-coded in `registry.ts`; read `label_max_len` when the schema exposes it → **B5**.
- Report-only (QA r7): label length is counted in UTF-16 code units (`String.length`), not characters, so an emoji counts double. This is harmless because the limit only warns. DSK defines the unit with `label_max_len` in **B5**.
- A `null` layer document is treated as absent (no notice), per DSK's "missing key = unset" (r29 §7.1 ruling 3); only non-record, non-null docs warn (M2).
- L336 severity is resolved (DSK 00:23, setup-format §2.5): the id pattern is hard; a list-item label must be a non-empty string (hard `invalidValue` if missing, empty, or not a string, L333). A label over 48 chars is a warning `outOfRange` and is kept as stored (the editor clips it for display).
- Report-only (QA r5): `createRegistry` does not freeze host-passed behaviour objects (only the shipped `XP_LEVELS`/`TERRAIN` are frozen) → **B5** decides when hosts can register behaviours. Extra properties on install functions are never read by the runtime and are harmless.
- `docs/foundation/STATUS.md` (64 rows, standing defaults Q1–Q5) → B1's merge-time doc commit; its honesty test `tests/foundation/status.test.ts` → later B-step.

## Out of scope
UI, the editor writer, any format or catalogue change, sim wiring (`createWorld` callers keep passing `tiles`, `terrain`, `levels`; B2/B5/B7 wire install into a host).

## Do not touch
`painter-proto/`, `ui-shell/`, `src/core`, `src/sim`, `src/types/core-types.ts`, every pin file, `BTF_LEVEL_RULES` (kept as the parity reference).

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 851 passing and 0 failing**. Paste the summary line, the smoke line, the host example line, and the sim and stress lines into HANDBACK.md.
- Both shipped test files are **byte-identical** to the sha256s above.
- Base **`bb7df0fc`**. The bundle is `bb7df0fc..step/step-b1-behaviour-runtime-r<N>` and passes `git bundle verify`. Total ≤ 450 changed lines (band 400–500, reason given). Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
On branch `step/step-b1-behaviour-runtime-r<N>` (base `bb7df0fc`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). Run `git bundle create step-b1-behaviour-runtime-r<N>.bundle bb7df0fc..step/step-b1-behaviour-runtime-r<N>`, then `git bundle verify`. Upload the bundle and HANDBACK.md to the CEO's Drive. Push nothing to GitHub.
