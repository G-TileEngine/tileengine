# CN-022 (project effect shelf): shelf, house style and reaction table (format only, additive, editor only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-16 01:3x London. Status: **ACCEPTED** (DSK 2026-11-16 22:0x London, for ED-E5 step doc b7366e1f; filed PROPOSED 01:3x, CEO scope answers 01:34 via EA). Superseded text: fe16101a. Sources: Effect Designer scope r4 (`/workspace/share/effect-designer/scope.md`, sha256 `e77b396e`) §4.3, §6(c), §7 CN-022, §12 Q6 (a) and Q7 (a): a fused look is ready-made (live fusion is a stretch only) and reactions are editor suggestions only, never read at match time; EA GO 2026-11-16 to file CN-020–022 as one block.

Kind: format only, additive, **editor only**, all in `project.json`. **No core-types change.** No version bump, no migration: every key is optional and absent = today's behaviour. Older readers ignore the new keys and keep them on save (project-format §2, r13 R4). The runtime and `lookHash` / pins never read them.

Docs: project-format **r39** §3.1 (`settings`, including `paintStyleDefault`), §3.3 (`used` is derived), §7.2 (export closure), §11.3 (`editor-prefs`). setup-format **r29** §2.5 (`overCap`, `outOfRange`, `invalidValue`), §2.10.3 Rule N / M3, §2.10.3.2 (`pixel_scale`, ramps, feel knobs), §2.10.2.5 / §2.10.2.7 (hit-stop, hit-white), §2.10.3.5 (particles). Catalogue request **L51** (presets N5 at ≤32 particles; the default element-reaction table). L50 is CN-020/021; L49 is already `dim_lights`.

## Keys
| Key | Where | Shape | Absent means | Read by |
|---|---|---|---|---|
| `effectShelf` | `project.json` (root) | `{ref: effectId, part?: partId}[]`, max 48 | no shelf (today) | editor only |
| `effectHouse` | `project.settings` | `{ramps?: key[] ≤4, pixel_scale?, punch?: 0–3, motes?: bool}` | no house defaults (today) | editor only |
| `effectReactions` | `project.json` (root) | `[{a: rampKey, b: rampKey, effect: effectId}]` | **off** (no suggestions) | editor only |

Scope §7 names the table `reactions`; this CN stores it as `effectReactions` so the project root is unambiguous. `effectHouse` lives under `settings` (EA-accepted DSK path). A wrong JS type on any of these fields is H2 `invalidValue`.

## Shelf
- Over 48 warns `overCap` and **keeps everything** (C4 / R4). The runtime never reads this list, so nothing is trimmed at play.
- A shelf `ref` does **not** count toward the export closure and does **not** set `used`. `used` stays derived from the closure (project-format §3.3, §7.2). No new stored flag.
- Shelf effects are ordinary effect documents (or builtin ids). A dangling `ref` or `part` is **info**.
- `part?` names one part of that effect (a single shelf layer); absent = the whole effect.

## House style (`settings.effectHouse`)
Editor defaults only. **Rule N / M3:** the editor writes them only into blank new documents and newly added parts (and that part's new steps). They never overwrite values that came from a preset or the maker.

1. **`ramps`.** Up to 4 palette ramp keys, resolved against `settings.paintStyleDefault` (absent → `btf-ashroad@2`, setup-format §2.10.3.2). A key the resolved style lacks is **hidden in the editor** and is never written into a new doc; there is no `fxRampMissing` from this table. Over 4 warns `overCap` and keeps all; the editor uses the first 4.
2. **`pixel_scale`.** Reuses the exact `pixel_scale` contract in setup-format §2.10.3.2 (r27 M2) **by reference**. This CN does not copy that contract. Absent or `null`, `"match-sprite"`, a JSON integer 1–6, and `"1"`–`"6"` as aliases, all mean what that section already says. When this field is set, Rule N writes it into blank new docs in place of the standing `"match-sprite"` write; when it is absent, that standing write is unchanged.
3. **`punch` (0–3) and `motes` (bool) are seeds, not new effect fields.** They write the existing knobs and steps below. `punch` 0, or absent, writes nothing (today). Out-of-range `punch` warns `outOfRange`, seeds as 0, value kept.

| `punch` | Writes (effect knobs) |
|---|---|
| 0 or absent | nothing (all left absent) |
| 1 | `hit_stop_ms` 50, `hit_white_ms` 40, `squash` true, `shake` 0 |
| 2 | `hit_stop_ms` 100, `hit_white_ms` 40, `squash` true, `shake` 1 |
| 3 | `hit_stop_ms` 150, `hit_white_ms` 80, `squash` true, `shake` 2 |

`shake_ms` and `shake_dir` stay absent (today's by-strength length; `"hit"`). `shake` 3 is left to Advanced. All values sit inside today's ranges (hit-stop 0–150, hit-white 0 or 40–200, shake 0–3).

**`motes: true`** adds one Linger step of kind `particles`: `particle_motion: "rise"`, `particle_count` 12, `particle_life_ms` 800, `particle_pull` 1000, `picture: "ember"`, `start_mode: "at-hit"`, `tint_ramp` = the house's first ramp, `part` = the Sparks part. **`motes: false` or absent** = no such step is added. Counts go through the existing 48-per-effect cap.

4. **Blank doc (ED-E5 Q8).** On a blank new document the house's first resolvable ramp is written as the effect-wide `tint_ramp` knob; new steps inherit it and are not given their own copy, except the `motes` step, which keeps its own `tint_ramp` per the motes paragraph above (deliberate: it reads the same if the knob is later changed by the maker). A house `pixel_scale` outside the §2.10.3.2 contract warns `outOfRange` and is ignored, so the standing `"match-sprite"` write stays; a wrong JS type is still H2 `invalidValue`.

## Reaction table (`effectReactions`)
Editor suggestions only (CEO Q7 (a); Q6 (a) is a ready-made fused look, not live fusion). The table is never read at match time and never changes play or `lookHash`. Absent = off. A dangling `effect` ref is **info**. `a` / `b` are palette ramp keys (including the four effect ramps). **Pairs are order-free:** `{a,b}` matches `{b,a}`, and `a == b` is allowed. If both orders are stored, the first stored row wins and the other is an **info** note; nothing is deleted.

## Core-types candidates
- None. Project editor data only.

## Open (not this CN)
- The default table and preset particle cap are L51 (Librarian). CN-023–025 wait. Style @3 ramps wait for UX colour stops.

## Readers
- The Effect Designer only. QA: no core-types sha change, no pin moves, no closure change. Please check: (1) a project without these keys is unchanged; (2) a shelf ref does not set `used` and is not in the export closure; (3) house style never overwrites a preset value; (4) a house ramp missing from the style is hidden and does not warn `fxRampMissing`; (5) `pixel_scale` follows §2.10.3.2 unchanged; (6) punch 1–3 and motes write only the named existing fields; (7) the reaction table is not consulted at match time; (8) older readers keep the keys on save.
