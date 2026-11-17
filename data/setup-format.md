# Behaviour Setup format (`behaviour-setup` v3) and Preset format (`behaviour-preset` v2)

Owner: Data & Save Format Keeper. Status: DRAFT, doc revision **r30**, 2026-11-17 (r30 2026-11-17; r27–r29 2026-11-15; r26 2026-11-14; r23 2026-11-13; r20 2026-11-12) (r14 2026-11-09; London time, UTC+0).
Consumers: Editor & UX Designer (Edit screens, Preview), Engine Architect (runtime, Render), New Project wizard.
Companion: **[project-format.md](project-format.md)** (r14). It covers the project store that holds setups, presets, the catalogue slice, assets, maps, stages, units and Preview notes.

**Revision log**

- **r30 (2026-11-17, 01:1x): B1 rulings and text length (EA B1 r7; dsk-rulings/2026-11-17-phase1.md D4).** No format version change and no CN.
  - **Length unit:** every text length in this doc (`label` 1–48, `label_max_len`, `text` `max_len`, `name`) counts **Unicode code points** (`[...s].length`), not UTF-16 code units. The editor may display grapheme counts, but the stored rule is code points.
  - **List items (§2.9):** an `id` that fails the pattern is hard `invalidValue` and that layer is skipped. An empty or missing `label` is hard. A `label` over 48 (or `label_max_len`) is an `outOfRange` **warning** and the value is kept; notice detail `<behaviourId>.<knobId> <itemId>.label`.
  - **New check `strayValue` (§2.5), warning:** `source: "default"` with a stored `value`. The value is ignored (it resolves to the catalogue default), kept in storage, and dropped on the next write of that answer. The reverse (`user`/`preset` with no value, or a wrong JS type) stays hard `invalidValue`, and that layer is skipped.
  - **Override layers L2–L4:** `{value, rev}` with no `source`. A missing key or a null layer doc means unset. `null` is valid only on nullable knobs. L3/L4 take `per_unit` knobs only.
- **r29 (2026-11-15, 13:5x): catalogue rev 24 adopted (§12.4k pin pass; L49 `dim_lights`).** `catalogue_rev` **24**: **63 behaviours, 563 knobs** (`behaviours.json` sha256 `342c400f…`, built from this doc at r28 `bcedf511`). Counts are unchanged from rev 23 (30 presets). Doc text only: no core-types change, no format version change, no migration; absent = today's behaviour. This supersedes the rev 23 pin.
  - **L49 ADOPTED** as shipped: `effect.steps` item `dim_lights`, a picker `"half"`|`"dark"` with default `"half"`; absent reads `"half"`. The steps knob rev is 24. All btf-*/te-* presets and recipes are byte-identical to rev 23.
  - The catalogue's option labels are the Librarian's wording, so EUX may replace them (they're labels, not stored values). The catalogue validator rejects unknown `dim_lights` values in catalogue data only; the reader rule (an unknown value plays as half, warns, and is kept) stays the runtime rule for documents.
  - The §12.5 L49 header now says ADOPTED. §12.4j is marked historical; the pins moved in the Inputs list and project-format r39 §2.
- **r28 (2026-11-15, 13:3x): catalogue revs 18–23 adopted in one pass (§12.4j pin pass; EA order: D1, then the Librarian's rev 23, then this pass).** `catalogue_rev` **23**: **63 behaviours, 563 knobs**: 215 sliders, 145 pickers, 95 toggles, 82 refs, 11 colours, 7 lists, 6 text, 2 tiles (`behaviours.json` sha256 `7f80c56f…`, built from this doc at r27 `17d2041b`). Doc text only: no core-types change, no format version change, no migration; absent = today's behaviour. This supersedes the rev 17 pins.
  - **L45–L48 ADOPTED** as shipped, checked field by field against §2.9.3 and §2.10.1–§2.10.3, including the r27 `pixel_scale` picker and the CN-019 ramp options (§12.4j). The "nothing is live / written until the Librarian ships it" notes in §2.10.1 and §2.10.2 are updated, and the §2.9.1 `tile_types` row now says shipped.
  - **gaps.md §29 rulings:** (1) `te-explosion` and `te-pickup-sparkle` `connect` `0` → **`0.02`**, which is what 0 played as (spec.ts `normalize()` clamp, EA 2026-11-15 13:33; the minimum stays 0.02) (§2.10.2.9). (2) `null` and no-default wording for `pixel_scale`, the step items `light_ramp` / `tint_ramp`, and the knobs `tint_ramp` / `shake_ms` (§2.9.4, §2.10.3.2, §7, §8.2 step 5). (3) The §12.5 L48 header now says ACCEPTED. (4) New request **L49** `dim_lights` (§12.5). (5) `te-*` presets in the owners' effect ref builtins: open, Effect Designer scope (§12.4j).
  - The `pixel_scale` rule sentence is unchanged, byte for byte, everywhere it appears. §12.4i is marked historical; the pins moved in the Inputs list and project-format r38 §2.
- **r27 (2026-11-15, 06:3x): D1 text pass (post-34 plan, slice D1; EA GO 06:24 after the CEO approved the plan at 06:23). Doc text only: no core-types change (pin `61fad786`; CN-018 `d6d08696` lands with 33b-3), no version bump, no migration; every rule keeps absent = today's behaviour.** Source: DSK `staging/effect-designer-format-view.md` (`a41df1c5`) M2–M6 and N6; EA rulings (b) and item 30.
  - **M2 `pixel_scale`** (§2.9.4, §2.10.3.2, L48): a nullable picker, default `null`, reusing the r8 L30 `nullable` pattern; no new field. The rule, word for word (EA G2b item 10): `pixel_scale` absent or `null` = today's `k` rule; `"match-sprite"` = the anchor unit's sprite pixel size; a JSON integer 1–6 = that pixel size; the strings `"1"`–`"6"` are read as aliases of the integers and rewritten to integers on edit (M6); anything else (0, 7, 2.5, other strings) warns once (`outOfRange` for a number, the unknown-option warning for a string, per M5) and plays as the `k` rule. Absent/`null` and `"match-sprite"` are distinct. It replaces r23's "clamped at use" note. Rule N still writes `"match-sprite"` into new documents.
  - **M3 Rule N provenance** (§2.10.3): Rule N writes only into blank new documents and newly added steps. It never overwrites values that came from a preset, so `presetRef` and "Reset to preset" survive ("Make my own from …" keeps the preset's values).
  - **M4 frozen step ids** (§2.10 document rules, §2.10.1.5): a step id is never reused in its document, including after a delete.
  - **M5** (§2.5 `invalidValue` row; project-format r37 §13 H2): an unknown option value on an effect-document picker is a warning, not H2. A wrong type stays H2.
  - **M6 alias normalisation on edit** (§2.10.1.8, §2.10.3.3): writers emit the canonical name and value; the old stored value stays in the op's `before`, and a step item key also keeps an orphan copy (§8.2 pattern).
  - **Effect ramps** (§2.10.3.2, L48): `tint_ramp` / `light_ramp` may also name `fire`, `frost`, `holy`, `venom`, new optional palette `ramps` keys (**CN-019** (`CN-019-effect-ramps-format.md`), ACCEPTED (EA 2026-11-15 06:31); project-format r37 §6.2.5).
  - **N6:** the particles CN is referred to as CN-017 (§2.10.3, §2.10.3.5, the r24 log line). `FlashCheck.detector` is not added.
  - **L48 amended** (§12.5): the nullable `pixel_scale` picker and the four effect ramp options. The §12.4j pin pass waits for the Librarian's rev 23.
- **r26 (2026-11-14, 18:1x):** wording fix only (QA D-1, no rule change). §2.10.3.2 `te-flash@3` pop-light coverage: added "(exact threshold ≈2.53 tiles, so 3 tiles is the first allowed half-tile radius)" after "≈ 2.5 tiles at 64 px"; same text in CN-015.
- **r25 (2026-11-14, 03:2x):** wording fix only. `screen_shake` Low: 0 px stays 0, otherwise max(1, floor(px / 2)) (QA 33b-1).
- **r24 (2026-11-14, 02:2x): particle fields for 33b-3 (CN-017, numbered by the EA after filing), new §2.10.3.5.** EA confirmed all 7 CN-015 DSK rulings (CN-015 is now ACCEPTED). The `particles` kind and fields were already ACCEPTED in r17 §2.10.1.3; this rev tightens the per-effect cap and names **`fxParticlesOverCap`**. `particle_count` 0–48 per step (`outOfRange` clamps); 48 is the per-effect sum — over that, later steps are cut down at load in step order and `fxParticlesOverCap` {count, limit: 48} fires once (supersedes r17 `particlesOverSoftCap`). 32 is an editor note only. Unknown `particle_motion` plays as `"burst"` with `outOfRange`. `particle_life_ms` and `particle_pull` (per-mille, UI 0–2) stay as r17; pull is ignored silently except on attract / spiral-in. Runtime-only: pool of 96, oldest dropped first; clock-based seeded positions; `reduce_motion` skips particle motion (start/end stills). Pointer: project-format r36 §6.7 / §13. No core-types change (`61fad786`), no version bump, no migration.
- **r23 (2026-11-13, 18:4x): step 33 Effects v2 fields, new §2.10.3 (CN-014 33a sync and depth, CN-015 33b light, colour and feel; ACCEPTED pending the EA's confirmation of the DSK rulings).** CEO 18:35 via the EA; UX effects-sprite-sync 4e72b97e; DSK rulings.
  - Sync and depth: `start_on`, `steps[].anchor_point`, `attach` / `detach`, `draw_layer` += `"behind-unit"` / `"front-unit"`, `depth_by_facing`, `lit` (absent = `"self"`, today; the editor writes the stock picture's default). The 64 ceiling covers steps and picture strips with the one existing code `fxTooManyFrames`, the detail naming the subject.
  - Light, colour and feel: `light_mode` / `light_radius` / `light_ramp` (not `light`, not `glow`; UX's `light` is a reader alias), `tint_ramp`, `tint_snap`, `pixel_scale`, `outline`, `shake` 0–3 art px (CEO 1–3 px; a stored 4 plays as 3), `shake_ms`, `shake_dir`, `hit_white_mode` += `"bright"`, `squash`. Hit-stop jitter is a rule with no field (CEO Q4). Detector `te-flash@3`, with @2 and @1 frozen.
  - Rule N: where the CEO's default differs from today (`pixel_scale` `"match-sprite"`, `tint_snap` `"ramp"`, `outline` `"auto"`), absent keeps today's behaviour for old documents and the editor writes the new default into new ones.
  - New request **L48** (§12.5), queued after L47. Pointers: project-format r35 (§6.2 clip `events` / `points`, §6.7, §13) and profile-format r14 (§3.3 `screen_shake`, `graphics` Lite = `low`; §9.0 `te-flash@3`). `keepInDim` and `fullyDark` stay runtime-only. No core-types change (`61fad786`), no version bump, no migration.
- **r20 (2026-11-12, 16:4x): §2.10.2 Feel tricks ACCEPTED (CEO 2026-11-12 16:43 via the CoS, all as recommended; plan only, a build needs the CEO's SEND for Effects v2).**
  - **F1–F3 DECIDED:** F1 `blast-star` is the sixth engine stock picture (CC0, credited TileEngine, not AI). F2 the Impact flash disc stays at 3 tiles by default. F3 hit-stop plays in timed and real-time modes, capped at 150 ms, view only.
  - **EA confirmed all five points**, with additions written in: the `"at-hit"` fallback (§2.10.2.1), the blank scope (§2.10.2.4), ring growth time and radius (§2.10.2.3), hit-stop on the attacker and victim (§2.10.2.5), and the `te-flash@2` rules, with @1 frozen (§2.10.2.10).
  - The r19 "a reappearing step after a blank is one more start" rule is replaced by the EA's wording: steps that resume after it count normally.
  - **L47** is unblocked; it ships after L45 and L46 (§12.5).
  - The CN-E2/E3/E5 amendments wait until after H2 (not staged).
  - Pointers: project-format r21 §6.7 (accepts `te-flash@2`) and profile-format r13 §9.0 (`flashInput` carries tile size and sprite boxes).
  - No format version change and no migration.
- **r19 (2026-11-12, 16:3x; Feel tricks, PROPOSED; CEO liked plan §16 at 15:19 and §17 at 15:37 via the CoS, plan only; a build needs CEO SEND).** New **§2.10.2**, which is PROPOSED and **not part of ACCEPTED §2.10.1** (nothing in §2.10.1 changes). It answers EUX `ux/effects-v2-plan.md` K-IF1 and K-T1–K-T8:
  - `start_mode` `"at-hit"`;
  - circle flashes (`flash_shape`, `flash_radius`, centre = `anchor` + `"screen"`);
  - Shockwave folded into the flash rings (`wave_from`, `wave_thickness_px`, `look_ease`);
  - blank steps (`blank_ms`, `picture: "none"`);
  - effect knobs `hit_stop_ms` and `hit_white_*`;
  - smear and shine fields;
  - presets `te-explosion` and `te-pickup-sparkle`, and the stock picture `blast-star`;
  - detector **`te-flash@2`** (identical to @1 on every existing document).
  - New request **L47** (§12.5), not to be sent until accepted, queued after L46. CEO questions **F1–F3** and CN amendments (not staged) are in §2.10.2.12.
  - No format version change and no migration. project-format and profile-format are unchanged (pointers wait for acceptance).
- **r18 (2026-11-12, 14:58): the four Keeper-added fields are final (EA final rulings 2026-11-12 14:58, relayed by the owner; EUX confirmed; these supersede the plan §15.1 wording of 14:55).** `fade_out_ms`, `enabled`, `stamp_rotate` and `connect_step` are now ACCEPTED, with nothing pending.
  - **`fade_out_ms`:** keeps the r17 meaning. The fade runs **after the hold, not inside it**. It overlaps the next step, doesn't delay `"after-last"`, and counts toward the effect end.
    - The ramp is in integers: `fadeTicks` = `fade_out_ms` rounded up to ticks, and alpha = `floor(lastAlpha × ticksLeft / fadeTicks)`, reaching 0 on the last tick.
    - It applies to `dim` and `stamp` only. On any other kind it gets the warning `fadeOutIgnored` and is ignored.
  - **`enabled: false`** (changed from r17's "not counted for timing"): the step is kept and not drawn, but it **keeps its time slot**. Its start, `len` and hold still feed `"after-last"`, so turning it off never moves later steps or the hit.
  - **`stamp_rotate`:** confirmed as rotation over time, not a duplicate of `spin`. It's a linear turn over `len` only, and the angle is held through the hold and fade.
  - **`connect_step`:** an unknown id gives `unknownRef` and falls back to the default. A disabled step is a valid target with no warning. The default is the last step in list order, whether enabled or not. The hit time is rounded up to ticks once.
  - L46 is still a pending Librarian request, queued after L45. The engine track is queued after H4. A build still needs CEO SEND.
  - No format version change and no migration.
- **r17 (2026-11-12, 14:57): §2.10.1 Effects v2 ACCEPTED (CEO 2026-11-12 14:56 via the CoS: "Take all four").** E1–E4 are DECIDED as proposed, with the proposal text kept.
  - **Exception:** four fields were Keeper additions that EUX and the EA haven't confirmed yet: `fade_out_ms`, `enabled`, `stamp_rotate` and `connect_step`. They're marked **ACCEPTED pending EUX/EA field confirmation**, not final.
  - **L46** stays a pending Librarian request. E3 unblocks it, and it's still queued after L45.
  - A build still needs CEO SEND.
  - No format version change and no migration.
- **r16 (2026-11-12, 14:5x; Effects v2, PROPOSED; CEO accepted the scope 14:42 via the CoS, build needs CEO SEND).** No format version changes (`behaviour-setup` v3) and no migrations.
  - New **§2.10.1 Effects v2 format**, the only home for the v2 effect fields. It answers EUX `ux/effects-v2-plan.md` §11 Q1–Q9:
    - steps 6 → 12 (soft), steps 13+ kept and not played;
    - the booth export (`toSkillSpec`) keeps 6 and drops v2 content with `boothDropsV2`;
    - timing `start_mode` / `start_at_ms` / `hold_ms` / `fade_out_ms`;
    - kinds `dim` / `stamp` / `particles` / `flash` and their fields, each with a range and a cap;
    - five stock picture ids;
    - `connect` keeps its meaning, plus `connect_step`;
    - `flash_risk` derived by the detector, never stored on the effect.
  - New request **L46** (§12.5): the catalogue changes and the preset `te-astrologer-awakening` with recipe `awakening`.
  - CEO questions E1–E4 and core-types candidates CN-E1–E5 (not staged) are in §2.10.1.9.
  - Pointers: project-format r19 §6.7 / §7.2; profile-format r11 §3.3 / §3.7 / §3.8 / §9.0.
- **r15 (2026-11-12, 00:5x; Engine Architect confirmations, PROPOSED until the Librarian ships rev 23).** No format version changes (`behaviour-setup` v3, `behaviour-preset` v2) and no migrations.
  - **Request L45 (§12.5):** walkable built-in `terrain.tile_types` **`path`** and **`dirt`**, in the rev-15 item shape (`open: true`, `push_can_enter: true`, everything else `false`, the same as `floor`). That's 13 → **15** reserved items. It needs **catalogue rev 23**, which is the Librarian's to ship (`behaviours.json` is at rev 22 and isn't edited here). §2.9.1 lists it as requested.
  - **Tile-type id alias (§2.9.3 rule 7):** **`wall-block` is the canonical blocking wall.** Readers accept **`wall_block`** as an alias, and writers always emit `wall-block`. It's one table, and the only home for tile-type id aliases; project-format r16 §6.4 points here.
  - **§2.9.3 rule 6 (new):** when a catalogue rev newly reserves an id that a stored list already has as a user item (e.g. a project that added its own `path`), that item is **adopted as the built-in**, keeping its fields as user edits (drift as rule 5). It's never the hard `invalidValue`.
  - **Pin status (noted, not changed):** this doc and project-format still pin **rev 17** (L9, L91, §12.4i; project-format §2 "Current catalogue pin"). The Librarian's gaps.md §23–§24 says the DSK docs were "re-pinned in pass_rev18", but no rev-18 pin is recorded here, and `behaviours.json` is now at **rev 22**. Revs 18–22 (and rev 23 for L45) need a §12.4j adoption pass, then both pins move together. **r28: done:** revs 18–23 are adopted in §12.4j, and both docs now pin rev 23. **r29: done:** rev 24 is adopted in §12.4k, and both docs now pin rev 24.
- **r14 in place (22:5x):** Librarian nit: §12.4i's `front` label line now points to §12.4i, not §12.4h. No rule changes. (Companion: project-format §6.9 now points to the PROPOSED `sync-format.md`; setups are unaffected.)
- **r14 in place (22:4x): catalogue rev 17 adopted** (`catalogue_rev` **17**: **63 behaviours, 544 knobs**: 210 sliders, 135 pickers, 93 toggles, 82 refs, 11 colours, 6 lists, 5 text, 2 tiles; §12.4i). **L44 adopted** (`second` shipped in rev 16; `deck.openingFront` named in rev 17). The "expected mismatch" note is removed. This supersedes the rev 15 pins in the three lines below.
- **r14 in place (22:3x):** `opening_row` ruled (CEO: the user's choice, `back`/`second`/`front`). L44 is recorded in §12.5. *(The rev 15 "expected mismatch" note was removed at 22:4x: `second` shipped in rev 16, and L44 is adopted, §12.4i.)*
- **r14 in place (22:3x):** occupancy is project-wide in v1, and a per-stage override is FUTURE ONLY (§8.2 converter note). There are no rule changes; companion project-format r14 (with the `core-types.ts` `actionLogged` and lint fixes).
- **r14 in place (22:3x): catalogue rev 15 adopted** (*superseded by rev 17, 544 knobs, at 22:4x*) (`catalogue_rev` **15**: **63 behaviours, 538 knobs**: 209 sliders, 133 pickers, 90 toggles, 82 refs, 11 colours, 6 lists, 5 text, 2 tiles; §12.4h). The format version is unchanged. **L39–L43 are adopted as shipped.**
  - **Mismatch fixed:** "no pipe" is now `target_pipes: []` plus the behaviour field `targeting: "none"` (not `target_pipes: none`).
  - New in the catalogue: `composable_as` may hold `trigger`, and the mode-scoped behaviours (`modes`, `v1: false`) are `resource-meter` and `auto-cast`.
  - **`unit-roster.opening_row` ruled (CEO 2026-11-09 via the CoS):** a picker of `back` (default) | `second` | `front`. **L44** was sent and is now **adopted** (shipped in rev 16 + 17, §12.4i).
- **r14 (22:2x): catalogue rev 14 adopted** (`catalogue_rev` **14**: 61 behaviours, **515 knobs**: 200 sliders, 125 pickers, 88 toggles, 82 refs, 11 colours, 5 lists, 2 text, 2 tiles; §12.4g). The format version is unchanged (`behaviour-setup` v3).
  - **Composition metadata** is adopted under the Librarian's names: `composable_as`, `target_pipes`, `numeric_inputs`, `adjusts`. Also `ability_field` (L37) and the knob `deck` (L38). None duplicates an r13 field, so there are no renames.
  - **§2.11, Engine Architect correction:** `modifierFieldIgnored` covers group/effect/cost on all modifiers, and targeting only on scalers. Riders keep their targeting, re-anchored on the primary's resolved targets. `target_pipes: none` means an instant cast. The example is fixed: Heavenly Sword's primary is `sky-drop` (castHeavenCard() L859).
  - **Modifier field-name check:** rev 14's documents use `setupId` (`composition_rules.document_shape`). `behaviourId` appears only in the catalogue's own `compositions[]` examples. So we keep one field, `setupId`, and send the Librarian a wording correction (L40).
  - **`derive` tombstone:** the format **keeps** the old `deck_size` answer (in `orphans`, inactive, visible, read for the notice `deckSizeDerived`, ignored by runtime). It's never wiped. We ask the Librarian to change `dropped-with-notice` to keep-inactive (L39).
  - **The deck ref is RULED by the Engine Architect** (project-format r14 §6.8). L36–L38 shipped.
  - **22:3x in place:** the knob → project-setting converter `one_unit_per_tile` → `settings.occupancy` (§8.2, with an example; L42 `kept-inactive`), and **L43** for the lane centre option.
  - **22:2x in place:** request **L41** `terrain.tile_types.buildable` (MODES-v2 tower defence; PROPOSED, not v1-blocking). There are no rule changes here, and project-format r14 adds the PROPOSED `map.paths`, `save` kind and occupancy setting.
- **r13 in place (22:0x):** the format version is unchanged.
  - **Catalogue rev 13** adopted (502 knobs; L35 shipped; §12.4f).
  - **L27 confirmed** (GAP 7 closed): water/lava/wall-block, no unit on an `open: false` tile.
  - **L34 reworded:** with `push_into_walls` on, the unit stops on the last open cell, plus `pushBlocked`.
  - **New requests:** L36 `lethal_landing_scope`, L37 `ability_field` tags, L38 deck ref.
  - **New §2.11 ability `modifiers[]`** (G2). PROPOSED at 22:0x and **signed off at 22:1x**, with three rules: flat (`nestedModifierIgnored`), self/cycle = `invalidValue` (H2, still 6 hard errors), and missing = `unknownRef`.
- **r13 (21:5x):** side ids (project-format r13 §6.5). `ability-presentation.team_colours` items are **keyed by side id**, and **`neutral` is a reserved side id**, with a built-in colour entry requested as **L35**. No rule changes otherwise; the format version is unchanged.
- **r12 (21:1x):** a one-line pointer to stage-placed effects (project-format r12 §6.5) in §2.9.4. No rule changes; companion project-format r12.
- **r11 (21:0x): catalogue rev 11 and rev 12 adopted.** `catalogue_rev` **12**: 61 behaviours, 468 knobs, counts unchanged. The format version is unchanged (v3).
  - **Rev 12 booth 2×2** (CoS, reversible): `booth_rows` 2, `booth_caster` `{c:0, r:1}`, `booth_foe` `{c:1, r:1}` (§2.9.4).
    - Default booth answers follow the move, which changes `toSkillSpec` output. The defaults-moved notice covers it, and the stored `{dc, dr}` points don't move.
  - **L33 converter worded exactly** (§8.2): legacy absolute points convert relative to the effect's **stored** `booth_caster`, or `{0, 0}` if none was stored, **never** the current default. The new converter field **`legacy_relative_to`** is documented.
    - §10.14 is fixed: it had converted "relative to the default", and is now shown as a 9 → 12 drift.
  - **Rev 11:** `disabled_when` / `in_docs` / `disabled_reason` (UI-only greying, keep-but-ignore) are recorded, and the `toSkillSpec` export reads the booth answers (§2.9.4, §12.4e).
- **r10 (20:2x): catalogue rev 9, then rev 10, adopted.** `catalogue_rev` **10**: 61 behaviours, **468 knobs** (164 sliders, 119 pickers, 87 toggles, 79 refs, 11 colours, 5 lists, 2 tiles, 1 text). L27–L34 shipped.
  - *Amended in place at 20:2x (not yet forwarded) for **CoS §15** and rev 10:*
    - `scale_snap` (whole by default for all effect sizes).
    - `rotate_with_facing` defaults to true, and is the identity without a facing.
    - `steps[].anchor` replaces `points_anchor`; the knob-level `tile` type; booth knobs.
    - Migration fields `retired_item_fields` / `value_converters` (§8.2, §10.14).
    - Preset recipes keep all 10 ids. L33/L34 shipped.
  - **Drift 8 → 9 runs the `convert` (cue → cue_name) and `fold` (team_colour_override → team_colour) tombstones without losing answers:** the source and value are carried over, old answers are kept in `orphans`, and a folded value is recorded (§8.2, §10.13).
  - **New types:** the knob type `text`, colour `nullable`, list `label_max_len`, the `asset` item type, and `{docs: "asset"}` refs (§2.9, §9). The behaviour field `closure` replaces `export`.
  - Examples re-verified (§12.4c).
  - **L33** and **L34** shipped in rev 10 (§12.4d).
- **r9 (20:1x):** **effect points become relative** (Engine Architect).
  - The `tile`/`tiles` item values are `{dc, dr}` with an anchor `caster | target` (default caster), plus a new knob `rotate_with_facing` (default off) and booth-frame knobs, so `toSkillSpec`/`fromSkillSpec` stay lossless. This is request **L33** (§2.9.4, §12.5).
  - The §12.7 Q3 off-board rule is updated: clamped and warned at cast time.
  - No format version change.
- **r8 (20:0x): catalogue rev 8 adopted** (`catalogue_rev` 8, 61 behaviours, 461 knobs; L19–L26 shipped). The format version is **unchanged (v3)**. Every example is re-verified (§12.4b), and rev 7 → 8 drift is shown in §10.12.
  - **gaps.md §14 rulings** (§12.7):
    - A knob-level **`text`** type, with `effect.cue` → `cue_name` (L28).
    - Tags capped at 16 through the list field `label_max_len` (L29).
    - Off-board effect points become a derived warning in the project index.
    - `team_colour` becomes nullable, default `null` = palette, and `team_colour_override` is retired (L30).
    - `export` is renamed `closure: "always"` (L31).
    - Both validator test changes are accepted.
  - The list drift rule: **added item fields are not a change** for flags (§8.2).
  - **Compound actions** share an op `group`, giving one undo across documents (§4 rule 10). Request **L32** covers effect pictures. `KnobValue` admits `null` for nullable knobs (§9).
  - New request **L27**: generic built-in tile types for procedural recipes (project-format r7 §14.6c PL9).
  - L24/L25 are **confirmed by the Engine Architect**.
- **r7 (19:5x):** the ability-owner classification (§2.9.5) is **decided by the Chief Of Staff (2026-11-09)**, including `objective-contest` as one `spells` group. Requests L24 (`terrain.wall_blocks_los` / `wall_blocks_shots`) and L25 (`unit-roster.clip_cues`) come from project-format r6 (walls, clip cues). No format change.
- **r6 (19:5x): catalogue rev 7 adopted** (`catalogue_rev` 7, 61 behaviours, 450 knobs: 162 sliders, 118 pickers, 82 toggles, 74 refs, 10 colours, 4 lists). The format version is **unchanged (v3)**: rev 7 needs no change to the stored shape, only wider value types and derived rules.
  - `list` and `ref` knobs are live (L13): `custom_groups`, plus `ability_group` and `effect` refs on 37 owners (§2.9). The `some` leaf and named gates (§2.6). `not`/`ne` are rejected (§2.6). `max_items` / `min_items` are soft caps (§2.9.2). Reserved-id rules (§2.9.3). Item field types (§2.9.4).
  - **Effects are their own documents** (§2.10): a `behaviour-setup` of the `effect` behaviour, stored in the project's `effects/` folder and referenced by id from each owner's `effect` answer.
  - The ability-owner rule, with the 8 borderline behaviours classified (§2.9.5): 2 more owners (`objective-contest`, `sword-lifecycle`).
  - Answers to gaps.md §13 are in §12.6; requests L19–L23 are in §12.5. New examples §10.10–10.11.
- r1 (18:44): first design.
- r2 (18:49): Chief Of Staff decisions D1–D5.
- r3 (19:01): catalogue rev 3; gaps.md §8 Q1–Q6; `active_when`, unlimited pairs, built-in presets, rulings; format v1 → v2 (migration 001).
- r5 note (19:4x): project-format r4 changes only render settings, so the setup format is unchanged. Its `advancedRender` gate reuses this doc's inactive-value rule (§2.6): a stored value that doesn't apply is kept and ignored, never rewritten.
- **r5 (19:3x)**, following project-format r3:
  - CoS **approved** on 2026-11-09 the Keeper's two calls: format v3 with checks derived on read (§2.2, §2.5, §8.1), and `custom_groups` (list) plus `ability_group` (ref) (§2.9). They are marked "proposed" only until the Librarian ships them.
  - Stage knob overrides are keyed by behaviour id (`stage.overrides.setups[behaviourId][knobId]`, §4 rule 9, §8.2). A stage override counts as an answer for `required` (§2.5).
  - Request L18 (terrain types).
- **r4 (19:2x):**
  - **Catalogue rev 6 adopted** (`schema_version` 3, `catalogue_rev` 6, 59 behaviours, 351 knobs). Rev 5 and rev 6 renames migrate through `renamed_from` on behaviours, knobs and options (§8.2, §10.5–10.7).
  - **Nested gates** `{any}` / `{all}` (§2.6). Behaviour-level `active_when` (§2.6). `required` and `ask_in_wizard` (§2.5). Option `status` / `ruling` / `note` (§2.7). `events` / `event_map` (§2.8).
  - **C4 "warn, don't block"** (Chief Of Staff): only a missing required answer, a value the runtime can't read, or a broken reference is a hard error. Range, step and bans are warnings with "Play anyway" (§2.5, §7, §12).
  - **Format v2 → v3 (migration 002 `derive-checks`).** Checks that are a pure function of the current values and the catalogue are now derived on read and never stored. `needsReask` keeps only event flags (§2.2, §8.1).
  - **C6 ability groups:** new knob types `list` and `ref`, and the "any group uses card hand" gate (§2.9; Librarian requests L13–L16).
  - Gate-only changes don't bump `knob.rev` (§8.3).
  - Godmode save-back targets the layers in project-format §7.1. Web preset storage is OPFS (§6.3).
  - The CoS project rulings P1–P6 are **CEO-approved 2026-11-09**.

Inputs read in full:
- **Skill spec shape:** `/workspace/g-tile-engine/src/chess/skillrig/spec.ts` (941 lines: `SkillSpec v:1`, `normalize()`, `describeSkill()`, `loadStore()` / `saveStore()`).
- **Catalogue (current pin, r29):** `behaviours.json` **`catalogue_rev` 24: 63 behaviours, 563 knobs** (§12.4k; sha256 `342c400f…`; `CATALOGUE.md` internal only). *Earlier pins:* rev 23, 563 knobs (§12.4j); rev 17, 544 knobs (§12.4i); rev 15, 538 knobs (§12.4h). *History:* `/workspace/tileengine/behaviour-library/behaviours.json` (19:39:44) and `SCHEMA.md` (19:38:56), London time (UTC+0): `catalogue_rev` 7, 61 behaviours, 450 knobs. There are 2 named gates (`uses-card-hand`, `uses-menu`) with 31 `{gate}` references, and no inline copies of the presentation gate. Plus gaps.md §13. (r4–r5 were written against rev 6.)
- Architecture: `/workspace/tileengine/docs/ARCHITECTURE-v0.md` §3.4 and §11 (C1–C11).
- The ui-shell prototype (`ui-shell/js/*.js`, 19:15).

House rules carried over from `spec.ts`:
1. Named fields plus one English sentence. `describeSetup()` is derived and never stored.
2. Integer version literal on every document.
3. A tolerant loader that never throws.
4. Text export: `TILESETUP v3\n<sentence>\n\n<json>`.
5. Bug fixes name a field.

---

## 1. Terms

| Term | Meaning | Source of truth |
|---|---|---|
| behaviour | `behaviours[].id` | The catalogue. In a project, its embedded slice (project-format §4). |
| knob | `behaviours[].knobs[]`. Fields used by setups: `id, type, default, min, max, step, options[{value, label, renamed_from?, status?, ruling?, note?}], rev, default_history, renamed_from, depends_on, active_when?, unlimited_toggle?, required?, ask_in_wizard?`. Info only: `label, ruling, proposed_options, single_option_reason, status`. | catalogue |
| question | `menu_order[] = {question, knob_ids[]}`. A UI grouping only. | catalogue |
| **answer** | The setup's value for **one knob**. It is the unit of edit, reset, undo and re-ask. | setup doc |
| setup | One saved, named configuration of one behaviour | `<project>/setups/<id>.json` |
| effect document | A setup of the `effect` behaviour, referenced by owners' `effect` answers (§2.10) | `<project>/effects/<id>.json` |
| preset | A named, reusable, **partial** set of answers | User library, plus project embeds `<project>/presets/<id>@<rev>.json`. Built-ins come from catalogue `behaviours[].presets` (§6.4). |
| active / inactive | Whether an answer currently matters (§2.6) | Derived, never stored |
| check | A derived validity result for one answer (§2.5) | Derived, never stored |

---

## 2. Setup document (`formatVersion: 3`)

### 2.1 Envelope

| Field | Type | Rule |
|---|---|---|
| `kind` | `"behaviour-setup"` | |
| `formatVersion` | `3` | §8.1 |
| `id` | `setup_<ULID>` | Never reused |
| `rev` | int ≥ 0 | +1 per logged op. Save with `expectedRev`, or get `staleRev`. |
| `name` | 1–48 chars | |
| `behaviourId` | catalogue id | Rewritten by a behaviour rename (§8.2) |
| `catalogue` | `{ rev: int }` | The `catalogue_rev` the answers were last migrated to. **Inside a project it equals the project's `catalogueRev`.** |
| `createdAt`, `updatedAt` | ISO-8601 UTC | |
| `copiedFrom` | `{setupId, rev, at} \| null` | Set only by duplicate |
| `answers` | `Record<knobId, Answer>` | One entry per live knob. No other keys. |
| `orphans` | `Record<oldKnobId, Orphan>` | Answers of retired knobs. Kept, never used. |
| `history` | `History` | §4 |

### 2.2 Answer

| Field | Type | Rule |
|---|---|---|
| `source` | `"default" \| "user" \| "preset"` | |
| `value` | `KnobValue` | **Absent iff `source = "default"`.** Defaults live only in the catalogue. `KnobValue = number \| string \| boolean \| ListItem[]` (`ListItem[]` only for `list` knobs, §2.9; `ref` values are strings). |
| `presetRef` | `{ presetId, presetRev, name }` | Present iff `source = "preset"` (D2) |
| `rev` | int ≥ 0 | +1 on every change to this answer |
| `defaultRef` | `{ rev: int }` | The knob's catalogue `rev` when this answer was last migrated. Drift means `knob.rev > defaultRef.rev`. The old default is the `default_history` entry with the largest `rev ≤ defaultRef.rev`. |
| `needsReask` | `Reask \| null` | **Event flags only.** Stored because they record that something *happened*. It never changes `value`. |

`Reask = { reason, by?, at, note? }`. Stored reasons, highest first (one flag per answer; a lower one is recomputed when the higher is resolved):

| reason | Set when | `by` |
|---|---|---|
| `parentChanged` | A non-gating `depends_on` parent changed, and this answer's source is `user` or `preset` (R1) | `{knob}` (`"knobId"` or `"behaviourId.knobId"`) or `{behaviour}` for `@` deps |
| `catalogueChanged` | Drift: `knob.rev > defaultRef.rev` and the source is `user` or `preset` | — |
| `renamed` | Re-keyed through a knob, option or behaviour `renamed_from` | `{knob: oldId}` and/or `{option: oldValue}` and/or `{behaviour: oldId}` |

All are **warnings**. None blocks Play or Render. The validity of the current value is a derived check (§2.5), not a stored flag: in r3, `noDefault`, `outOfRange`, `offStep` and `bannedCombo` were stored. They could go stale whenever the catalogue, a gate or another answer moved, which was a second source of truth. Migration 002 drops them (§8.1).

**Inactive answers** (§2.6) never get a new flag. An existing flag is kept, hidden, and ignored until the answer becomes active again.

### 2.3 Catalogue pin
- `catalogue.rev` is a `catalogue_rev`. If it equals the live rev, drift is skipped. Otherwise §8.2 runs.
- `schema_version` is **not** pinned. One catalogue reader, `readCatalogue()`, absorbs the file's shape (§12.2 Q6).

### 2.4 Effective value
```
effective(a) = a.source === "default" ? knob.default : a.value   // never clamped, never snapped
```
- Setting a value equal to the default keeps `source:"user"`. Reset is the only way back to `default`.
- A warning-level check (§2.5) does not stop a value being effective. The runtime uses the stored value as-is (C4: users may break their own game).

### 2.5 Checks and readiness (D1 as amended by C4)
`check(doc, ctx) → CheckRow[]` is derived on every read from the answers, the catalogue (slice) and the project context (cross-behaviour gates, `@` deps). It is **never stored**. **Inactive answers are never checked** (§2.6).

| Check | Fires on an **active** answer when | Severity |
|---|---|---|
| `requiredUnanswered` | `knob.required === true` and `source === "default"` (the catalogue default of a required knob is a docs/test fallback and is never picked silently, per SCHEMA.md) | **hard** |
| `noDefault` | `knob.default === null` and `source === "default"` (0 knobs at rev 8; the rule stays) | **hard** |
| `invalidValue` | The runtime can't read the value: wrong JS type; picker value not in `options[].value` (r27, M5: **except on effect-document pickers**, where an unknown option is a warning and plays the field's absent meaning; project-format §13 H2); colour not parseable; `list` item missing `id`/`label`, a duplicate `id`, a user item reusing a reserved id (§2.9.3), or an item field of the wrong type (§2.9.4); `ref` value not a string | **hard** |
| `strayValue` (r30) | `source === "default"` but a `value` is stored. Ignored (resolves to the catalogue default), kept in storage, dropped on the next write of the answer. | warning |
| `outOfRange` | slider `v < min` or `v > max`; a `text` over `max_len`, or a list `label` over 48 / `label_max_len` (r30, counted in code points) | warning |
| `offStep` | slider `(v - min) / step` is not an integer (tolerance 1e-9) | warning |
| `unknownRef` | `ref` value names no current target (§2.9, §2.10). Runtime fallback: the knob's `default`. | warning |
| `overCap` / `underCap` | A `list` has more than `max_items` / fewer than `min_items` items (§2.9.2). The runtime uses the first `max_items`, or pads from the catalogue default. | warning (hard only if the knob says `max_items_hard`; none at rev 7) |
| `reservedMissing` | A built-in item of the catalogue default is missing from the list (§2.9.3). The runtime uses the catalogue item. | warning |
| `bannedCombo` | A ban fires, treating inactive knobs as absent. `by: {banId}`. | warning |

- **`readiness(doc, ctx) = { playable, missing: MissingRow[], warnings: CheckRow[] }`.** `playable` is false iff any hard check fires on an active answer.
- **Preview** won't start a match with a non-playable behaviour. Warnings show a banner with "Play anyway".
- **Render** refuses only hard checks in used setups (project-format §7.2). Warnings appear in the export report with "Render anyway".
- `listMissing` returns the hard rows in `menu_order` order, so Play and Render jump to `missing[0]`.
- **A stage override counts as an answer.** When project-format resolves a stage, an L2 `stage.overrides.setups[behaviourId][knobId]` value on a required knob satisfies `requiredUnanswered` for that stage (project-format §5.1, Q10).
- **`required` respects `active_when`.** `ability-presentation.basic_style` and `spells_style` are `required` but active only under `shortcut = custom`, so under All menu or All cards they are never asked and never block. Switching to Custom makes them active with `source:"default"`, so `requiredUnanswered` appears at once: there is no stored flag to write, which is how one `set` op on the shortcut stays the whole change (§2.6).
- **`ask_in_wizard`** is a wizard hint only. The New Project wizard asks every active `ask_in_wizard` knob (today `shortcut`, and the two per-group pickers under Custom). It has no effect on checks or storage.

### 2.6 Active and inactive answers (`active_when`, nested gates, behaviour gates)
**Gate grammar (catalogue rev 7):**
```
Gate = { knob: "knobId" | "behaviourId.knobId", eq: KnobValue }               // leaf; never on a list knob
     | { knob: "behaviourId.knobId", some: { field: string, eq: scalar } }    // leaf; list knobs only (L14)
     | { any: Gate[] }   // ≥ 2 entries; true if one is true
     | { all: Gate[] }   // ≥ 2 entries; true if all are true
     | { gate: "name" }  // top-level catalogue gates[name] (L16); names don't nest
```
- `knobs[].active_when?: Gate` and `behaviours[].active_when?: Gate` (the behaviour gate, which replaced rev 4's `presentation`).
- **Reconciling the two leaf forms.** The catalogue form is the dotted path (`"behaviourId.knobId"`), the same syntax as `depends_on`, so one reference syntax covers both. Rev 4's `{behaviour?, knob, eq}` is accepted by `readCatalogue()` and normalised to the dotted form. Ban `when` / `disable` keep `{behaviour?, knob}`, because that is a different object with its own `op` and `value`; `readCatalogue()` normalises them to the same internal `KnobRef` type.

**Evaluation (derived, never stored):**
```
activeBehaviour(B, ctx) = !B.active_when || evalGate(B.active_when, B, ctx)
active(a)               = activeBehaviour(B, ctx) && (!knob.active_when || evalGate(knob.active_when, B, ctx))
evalGate({knob, eq}) = active(target) && effective(target) === eq      // target resolved in the same behaviour or via the project
evalGate({any: gs})  = gs.some(evalGate)
evalGate({all: gs})  = gs.every(evalGate)
evalGate({knob, some: {field, eq}}) = active(list) && effective(list).some(item => item[field] === eq)
evalGate({gate: n})  = evalGate(catalogue.gates[n])                      // inlined by readCatalogue()
```
- **Named gates (rev 7):** `uses-card-hand` and `uses-menu` are each defined once in the top-level `gates`, and referenced 31 times. `readCatalogue()` inlines them, so evaluation and the `depends_on` rule see the expanded leaves. The slice copies `gates` (project-format §4).
- **`some`** is true when any item of the **active** list answer has `item[field] === eq`. An empty list is false. It is allowed only on picker or toggle item fields (§2.9.4).
- **A leaf on an inactive answer is false.** That makes activity transitive: for example, `hand_placement` is inactive whenever both group pickers are inactive and the shortcut isn't All cards.
- **Why "false" is safe:** the grammar has no negation, and `eq` and `some` are the only leaf ops, so a gate can only become *more* true as more answers become active or more items match. There is no third "unknown" state to store.
- **No negation (rev 7, L15 shipped).** `not`, `ne`, `none` and `neq` anywhere in a gate (including inside `some`), and `eq` on a list knob, are catalogue validation errors. `readCatalogue()` reports them and treats that gate as false (so the knob is inactive), never as true. Ban `when` keeps `ne`, because bans are checks, not gates.
- **Cross-behaviour leaves** are resolved by the project at the stage being played (project-format §5): the stage layer, then the project setup, then the catalogue default. With no setup for the gate behaviour, its catalogue default is used. A `required` gate knob such as `shortcut` with no setup is itself a project hard error (project-format §13), so this fallback only feeds display.
- **Cycles:** the catalogue validator rejects gate cycles. If one is ever loaded, every knob on the cycle is treated as inactive, and `readCatalogue()` reports a catalogue error.
- **Gating edges:** every knob named by **any leaf anywhere** in a knob's or its behaviour's gate tree is a gating edge, and must appear in `depends_on`. R1 skips gating edges, because changing a gate only changes activity.
- **What an inactive answer means:**
  - **Storage:** kept exactly as it is (`source`, `value`, `presetRef`, `rev`, `needsReask`). Nothing is written when a gate flips.
  - **Checks:** none (§2.5). That includes `required`.
  - **Readiness:** not counted.
  - **Re-ask:** no new flags. Existing flags are hidden.
  - **Bans:** treated as absent.
  - **Runtime:** Render leaves it out of the resolved config.
  - **On re-activation:** checks apply at once, because they are derived. `parentChanged` is not raised for parent changes that happened while it was inactive.
- **Inactive behaviour:** all its answers are inactive. Its setups are skipped by readiness and Render, and it does not count as enabled for `@` deps. The behaviour gate is authoritative. Knob gates inside it that repeat it are redundant and harmless; the catalogue validator keeps them equal.
- **Mass gating:** changing a gate answer is **one `set` op on that answer only**. The 31 named-gate references (24 card/menu knobs, 3 behaviours, and the `ability_group`/`effect` refs of `reveal-hand` and `reveal-intent`) get zero `AnswerChange` entries and zero stored flags. (r4 said 25; the Librarian's count of 24 at rev 6 is right.) One undo restores the gate and the whole gated set.
- **Unlimited pairs** (`unlimited_toggle`) are unchanged from r3: the slider is gated by `{knob:"<id>_unlimited", eq:false}`, so while unlimited is on it is inactive, kept, unchecked and unflagged. At rev 6 the same pattern also appears inside a nested gate: `ability-availability.uses_per_match` has `all[enabled = true, uses_per_match_unlimited = false]`.

### 2.7 Provenance statuses, rulings and option metadata
Setups do **not** store or depend on any of these. They are catalogue facts shown as info chips:
- **Knob** `status`, `ruling {by, date, note}` and `proposed_options`, as in r3: a "Default by Chief Of Staff, 2026-11-09" chip, and a "proposed" chip.
- **Option** `status`, `ruling` and `note` (rev 5): an info chip on that option row in the picker, e.g. `draw_handling = clock-loss` shows its ruling and note on tap. (The catalogue text still reads "pending CEO; reversible"; P6 is now CEO-approved, so the Librarian should update it.) They never affect checks.
- `single_option_reason` (rev 5): shown as the picker's helper text, info only.

A ruling that moves a default is an ordinary default move (`rev` bump plus a `default_history` entry), and the D3 notice applies.

### 2.8 Events (`events`, `event_map`): no setup or project storage
- `behaviours[].events[] {id, when}` and `hand-and-draw.event_map[]` are **runtime wiring declared by the catalogue**. Setups store nothing for them, and projects store nothing either.
- **Values:** `event_map` reads its numbers through knob paths (`n_from`, `levels_from`, `when`). Those paths are ordinary answers, resolved through the normal layering (project-format §7.1), and checked like any answer.
- **Render** copies the `event_map` entries of active behaviours into the resolved config. An entry whose emitting behaviour is not enabled is dropped (no event, no draw). An entry whose `n_from` knob is inactive is dropped too.
- **Renames:** paths inside `event_map` come from the catalogue, so they are already current.

### 2.9 List and ref knobs (catalogue rev 7, L13 shipped)
Two knob types let one answer hold a user-editable list, and let other answers point into it.

| Type | `value` | Catalogue fields | Checks |
|---|---|---|---|
| **`list`** | `ListItem[]`, ordered. `ListItem = {id, label, [field]: ItemValue}` | `item: Record<field, ItemFieldSpec>` (§2.9.4); `default: ListItem[]`; `reserved_ids?: string[]`; `max_items?`, `min_items?` (§2.9.2). Info only: `item_cites`, `item_sources`. | `invalidValue` (hard): an item without `id` or `label`, a duplicate `id`, a user item reusing a reserved id, a field of the wrong type. Field range/step: `outOfRange` / `offStep` warnings, as for knobs. `overCap`, `underCap`, `reservedMissing`: warnings. |
| **`ref`** | string (an id) | `ref: {list: "behaviourId.knobId", builtin: string[]}` or **`ref: {docs: "effect", builtin: string[]}`** (§2.10, request L19). Valid ids = `builtin` ∪ the ids in that list's effective value (or ∪ the project's effect document ids). | `unknownRef` (warning). The runtime falls back to `default`, which is always a builtin id. |

- `id`: `[a-z0-9][a-z0-9_-]{0,31}` (a bad id is hard `invalidValue`); `label`: 1–48 **Unicode code points** (r30; empty or missing is hard, over the limit is an `outOfRange` warning and is kept). Items are matched **by id**, never by position, for diffs, presets and drift.
- A list answer is **one answer**: editing one item is one `set` op on that answer, and undo restores the whole list. `viewSetup` exposes item rows and the writer offers `editListItem`, `addListItem`, `removeListItem`, `moveListItem`, each of which is one `set` op on the answer (§11).
- A stage override (project-format §6.5) of a list replaces the whole list on that stage. There is no per-item overlay; one value, one home.
- Presets store the whole list. `diffPreset` shows per-item rows (`added`, `removed`, `changed`), but applies the list as one answer.

#### 2.9.1 Lists and refs at rev 8 (r8; was rev 7)
| Knob | Item fields | Reserved ids | Default | Cap |
|---|---|---|---|---|
| `ability-presentation.custom_groups` | `style` (picker: unit-action-menu, card-hand) | `basic`, `spells` | `[]` | none |
| `terrain.tile_types` | `open`, `kills_on_landing`, `push_can_enter`, `slows_move`, `trips` (toggles) | the 10 default ids: floor, fallen, flask, rising, tide, warp-mark, sword-mark, boss-cover, vines, trap | the 10 reserved items | none |
| `effect.steps` | 31 fields (`kind` with 9 motion kinds, `seconds`, `release`, …) | none | one step | `max_items: 6` |
| `effect.cue` (rev 8) | `name` (text, ≤ 32) | none | `[]` | `max_items: 1`. **To become the `text` knob `cue_name` (L28, §12.7 Q1).** |
| `effect.tags` (rev 8) | none (`{id, label}`) | none | `[]` | `max_items: 4`; `label_max_len: 16` requested (L29) |
| `ability-presentation.team_colours` (rev 8, L26) | `colour` | none | built-in `player` #badcff, `rival` #c44a3a, **`neutral` #8a8f98 (rev 13, L35)**; `keyed_by: "side"`; reserved player/rival/neutral | none |
| ~~`effect.saved_effects`~~ | | | | **Retired since rev 8** (L19). Old answers move to `orphans` (§10.12). |
| ~~`effect.cue`~~ | | | | **Retired since rev 9** with `convert` → the `text` knob `effect.cue_name` (L28, §10.13) |
| `effect.tags` (rev 9) | | | | `label_max_len: 16` **shipped** (L29) |
| `terrain.tile_types` (rev 9) | | + `water`, `lava`, `wall-block` (L27; **r13: CONFIRMED** by the Engine Architect, rev 10 + L34 values) | 13 reserved items | |
| `terrain.tile_types` (rev 23, **shipped**, L45; r15; adopted r28, §12.4j) | | + **`path`**, **`dirt`** (walkable land; Engine Architect 2026-11-12). **`wall-block` is the canonical wall id**; `wall_block` is a reader alias only (§2.9.3 rule 7) | 15 reserved items | |

- `ability_group` (ref into `custom_groups`, builtin `basic`/`spells`) and `effect` (builtin `none` + the 10 BTF presets) sit on the same **39** owners (rev 8: + `objective-contest` `spells`, `sword-lifecycle` `basic`, L22). `basic` is the default on `step-pattern`, `basic-attack` and `sword-lifecycle`; `spells` on the other 36.
- Deleting a group raises `parentChanged` on the user-set `ability_group` answers that pointed at it (R1), plus a derived `unknownRef` warning. They run as their default until fixed.
- "Any group uses card hand" is now the catalogue's named gate `uses-card-hand` (§2.6), which includes the `custom_groups` `some` branch.

#### 2.9.2 `max_items` / `min_items` (gaps §13 Q1)
- **Catalogue fields** on `list` knobs: `max_items?: int ≥ 1`, `min_items?: int ≥ 0`. Absent or `null` = no cap (S1).
- **Soft by default (C4).** Over the cap is an `overCap` **warning**. The stored list is **never truncated** (R4), and the runtime uses the first `max_items` items. Under `min_items` is `underCap`; the runtime pads from the catalogue default's items.
- **Hard only when the runtime literally can't run:** the catalogue marks such a cap `max_items_hard: true` (request L20). None qualifies at rev 7.
- **spec.ts check:** `normalize()` does `o.frames.slice(0, 6)` and `withFrames()` does `frames.slice(0, 6)`; `saveStore()` keeps `blades.slice(-24)`, `bursts.slice(-24)`, `abilities.slice(0, 24)`. The booth **silently drops** extra steps and runs. So the runtime can run with 7+ steps: `effect.steps` 6 is a **soft** cap, and our only difference from spec.ts is that we keep the extra items and warn instead of dropping them silently. An empty `frames` falls back to one seed step (`[seed]`), which is our `underCap` padding rule with `min_items: 1` (request L20).
- The editor's Add button is disabled at the cap, with "Steps 7+ won't play". Lists over the cap only come from files, presets or imports.

#### 2.9.3 Reserved ids (gaps §13 Q3)
`reserved_ids` are ids users can't create. One rule covers both uses:
1. **A reserved id may appear in a list only if the catalogue default has an item with that id.** Those items are **built-in items**. (`terrain.tile_types`: all 10 defaults. `custom_groups`: none, because `basic` and `spells` live in `basic_style` / `spells_style`.) So yes: defaults using the reserved ids is fine, and it's exactly what makes them built-ins.
2. **Built-in items: fields and `label` are editable; `id` can't be renamed and the item can't be deleted.** The writer refuses both (`readOnly {item}`). Order is free.
3. **Users may add items with new ids.** An id that equals a reserved id or an existing item's id is **refused on edit** (`invalidValue {item: "reservedId" | "duplicateId"}`). If a file has one anyway, it's the hard `invalidValue` check, because two items would claim one id at runtime.
4. **A built-in item missing from a stored list** (a hand-edited file, or a reserved item the catalogue adds later) is a `reservedMissing` warning. The **effective** value appends the catalogue item. Nothing is written.
5. **Drift.** A list answer on `source:"default"` follows the catalogue default. Once the user edits any item, the answer is `user`, and a later change to a built-in item's default gives `catalogueChanged` (D3). `diffPreset`-style per-item rows show which built-in items moved, and "Take the new defaults for built-in items" is one `set` op. A reserved id that the catalogue retires turns the user's item into an ordinary user item.
6. **Newly reserved ids (r15).** When a catalogue rev reserves an id that a stored list already holds as a **user** item, that item is **adopted as the built-in item**. It keeps its fields and `label` as user edits (so rule 5's drift applies, `catalogueChanged`) and becomes undeletable and unrenamable from then on. It's **never** the hard `invalidValue` check, because the file was valid when written. Info `reservedIdAdopted` (PROPOSED name). Nothing is rewritten on load.
7. **Tile-type id aliases (r15; Engine Architect 2026-11-12). This table is the only home:**

| Old id (read only) | Canonical id (written) | Applies to |
|---|---|---|
| `wall_block` | **`wall-block`** | `terrain.tile_types` item ids and every reference to one: map `logic.palette`, AssetMeta `tileProps[].logic`, `tileTypeOverrides` (project-format r16 §6.4) |

   - **Readers accept the old id** and resolve it to the canonical one, with info `tileTypeAliasRead` (PROPOSED name). **Writers always emit the canonical id**, so a re-save normalises it.
   - The alias applies **only when the old id doesn't resolve as written**: a user's own item that's really called `wall_block` stays itself.
   - A list holding **both** `wall_block` (user) and `wall-block` (built-in) keeps both; references go to whichever id they spell. That's unchanged.

#### 2.9.4 Item field types (gaps §13 Q4)
Kept minimal: the three knob types, `colour`, and three for the skillrig gaps. **No nested lists**; nesting is what documents are for (§2.10).

| `type` | Stored value | Spec fields | Used for (spec.ts) | Gate `some`? |
|---|---|---|---|---|
| `picker` | string | `options[{value, label}]`, `default` | motion `kind`, `release`, `lock`, `pull` | yes |
| `toggle` | boolean | `default` | tile flags, `scale_on` | yes |
| `slider` | number | `min`, `max`, `step`, `default` | `seconds`, `bend`, ramp `from`/`to` | no |
| **`colour`** | `#rrggbb` or `rgba(…)`, stored lowercased | `default` | the per-step tint ramp: two fields `tint_from` / `tint_to` plus `tint_on`, like the existing `scale_*` / `glow_*` ramps. **No ramp type.** | no |
| **`text`** | string | `max_len` (default 48), `default` | cue name (`cue.name`), labels. Display data only; never a gate leaf, never in a ban. | no |
| **`tile`** | `{c, r} \| null`; **r9 (L33): `{dc, dr} \| null`**, relative to the step's anchor | `nullable?`, `default` | reel `land` (nullable), `tie` | no |
| **`asset`** (rev 9, L32) | `assetId \| null` | `kinds: ("sprite" \| "image")[]`, `default: null` | `effect.steps[].picture` | no |
| knob type **`tile`** (rev 10) | `{c, r}` | `default` | `effect.booth_caster`, `booth_foe` (round-trip metadata; the runtime ignores them) | no |
| **`tiles`** | `{c, r}[]`; **r9 (L33): `{dc, dr}[]`** | `max_items`, `default: []` | trace `points` (≤ 80), bounce `points` (≤ 8), reel `links` (≤ 6) | no |

- **Relative effect points (r9, Engine Architect; L33 — shipped in rev 10, CoS §15 defaults).**
  - Each point is `{dc, dr}`: numbers, because spec.ts `pointsOf()` uses `num()` and keeps fractions. They're measured from the step's **`anchor: "caster" | "target"`** (picker item field, default `caster`; it replaces rev 9's `points_anchor`).
  - **`rotate_with_facing`** (effect knob, toggle, default **`true`**, CoS §15) turns them with the anchor unit's facing. **If the anchor unit has no facing, it's the identity** (Engine Architect). BTF pieces have no facing and their points are `{0, 0}`, so BTF is pixel-identical and `pointsOf()` is unchanged.
  - **Lossless booth round trip:** the effect keeps spec.ts's booth frame as four knobs, `booth_cols` (2–8), `booth_rows` (1–10), `booth_caster`, `booth_foe` (tiles). **Rev 12 defaults (CoS, reversible): board 2×2, caster c0 r1, foe c1 r1**, with r growing downward (paint.ts L788). Rev 10–11 defaults were spec.ts `defaultSpec()`'s 2×1, c0 r0, c1 r0. `fromSkillSpec` subtracts the imported spec's own anchor square; `toSkillSpec` adds the effect's booth square back.
    - Default booth answers follow a default move (§8.2 step 6), so `toSkillSpec` output moves with it (a bigger board, points one row lower). The defaults-moved notice covers it. The stored `{dc, dr}` points, Preview and Render don't move. They double as the Effect Designer's preview board.
  - Map-absolute points live only in stage-authored effects (project-format r8 `stage.placedEffects`), never in an effect document.
  - **Stage-placed effects (`stage.placedEffects`: triggers, map-absolute cells) are defined only in project-format §6.5**, not here (r12 pointer).
- (Rev 8–9 meaning, history) `{c, r}` was spec.ts `Sq`: integer tile coordinates. **Off-board points (r8, §12.7 Q3)** are a **derived on-read** warning: the catalogue has no board, so the project index checks each used effect against each selected stage's map in spec.ts's `pointsOf()` range (−1…cols+1). The effect editor checks against the booth board. They're never clamped in storage (the runtime clamps like `pointsOf`).
- `tiles.max_items` is soft, exactly as in §2.9.2.
- Effect `tags` (spec.ts `tags: string[]`, "library labels, not a mechanic") are an **effect-document** knob of type `list` with no item fields (`{id, label}` only), not a new field type. **The label is capped at 16**, following spec.ts, through the list field `label_max_len` (r8, L29).
- **Knob-level `text` (r8, L28):** the same spec as the item `text` (`max_len`, `default`), but as a whole knob. It's display data only: never a gate leaf, a ban or `per_unit`. Over `max_len` is `outOfRange`. First use: `effect.cue_name`.
- **Nullable colour knobs (r8, L30):** `nullable: true` lets the answer be `null` ("inherit"). First use: `unit-roster.team_colour`, where `null` means the `team_colours` entry for the army's side on that stage.
- **Nullable picker, `effect.pixel_scale` (r27, M2; shipped in rev 23 as L48, adopted r28):** the same L30 `nullable: true` pattern on a picker knob, **default `null`** (the absent meaning). Its options are `"match-sprite"` and the JSON integers 1–6, so this one picker holds a string and numbers (`KnobValue` already admits both). No new field and no new knob type. `pixel_scale` absent or `null` = today's `k` rule; `"match-sprite"` = the anchor unit's sprite pixel size; a JSON integer 1–6 = that pixel size; the strings `"1"`–`"6"` are read as aliases of the integers and rewritten to integers on edit (M6); anything else (0, 7, 2.5, other strings) warns once (`outOfRange` for a number, the unknown-option warning for a string, per M5) and plays as the `k` rule. Absent/`null` and `"match-sprite"` are distinct. Full row: §2.10.3.2. **r28:** `pixel_scale` is the only field of the step 33 set where `null` is part of the stored contract. Rev 23 also marks the step items `light_ramp` and `tint_ramp` nullable, but there `null` is reader tolerance only: it reads exactly as absent, and writers emit absent (§2.10.3.2).
- Request **L21**: add `colour`, `text`, `tile`, `tiles` to the item spec, then add the skillrig fields that rev 7 left out (trace and bounce points, reel land/tie/links, the tint ramp, cue name and time, tags).

#### 2.9.5 What counts as an ability owner (gaps §13 Q5)
**Rule:** a behaviour is an ability owner if it **registers at least one action that the controlling side chooses and triggers, and that appears as a unit-action-menu row or a card**. The test is "the player picks it". Not owners: passive rules, automatic triggers, units that act on their own, and **modifiers** (they change another ability's cost, condition or output, and follow that ability's group). Owners get `ability_group` and `effect`; nothing else marks them (one source).

| Behaviour | Owner? | Evidence (src) | Group |
|---|---|---|---|
| `action-budget` | **No** | Rules. Focus is not its own action: `towerChess.ts` `legalSteps()` L517–523 only reads `cards.focusId` / `focusLeft`, which a played card binds; `towerSeek.ts` L168 "A three-action card spends the tape, then the focus". Focus is a cost mode of card plays. | — |
| `avatar-summon` | **No** | Triggered by the flask count; the player never picks it (`avatar.md`, catalogue summary) | — |
| `objective-contest` | **Yes** | `towerContest.ts` `contestTap()` L725–740: the player taps the flask while beside it, which returns `"link"`; `towerChess.ts` L1611–1617 then spends the action (`chess.left = 0`). The contest moves are dealt as cards: `towerContest.ts` L2 "You lock three cards from the row". | `spells` |
| `autonomous-ally` | **No** | Acts on its own each turn (`towerAvatar.ts`; summary "A unit the player does not control") | — |
| `sword-lifecycle` | **Yes** | The leap is the sword's player-commanded attack: `towerLucifer.ts` L1164 `bladeTargets()` "A fresh sword can fly at any foe with an open neighboring tile. After that leap, it only bites a neighbor." | **`basic`** (it is that unit's attack) |
| `mana-gain` | **No** | Modifier: "An ability or event that puts mana back" | follows the ability |
| `ability-refresh` | **No** | Modifier: "a used ability becomes usable again" | follows the ability |
| `adjacency-synergy` | **No** | Modifier: "Abilities check who is beside whom" | follows the ability |

**Decided (Chief Of Staff, 2026-11-09):** this classification stands. `objective-contest` and `sword-lifecycle` are owners; `avatar-summon` and the other five are not. `objective-contest` is **one `spells` group** for both the link and the contest moves. That makes 39 owners once **L22** ships (add `ability_group` + `effect` to `objective-contest` and `sword-lifecycle`).

### 2.10 Effects are their own documents (gaps §13 Q2)
**Decision:** a per-ability effect is **its own document**, `<project>/effects/<id>.json`, and abilities reference it by id. That document is a **`behaviour-setup` (v3) of the catalogue behaviour `effect`**, not a new kind.

Why documents, not nested lists:
- **An ability needs a whole effect** (22 knobs, a 6-step list of 31-field items). Nesting that inside a list item would need lists of lists of objects in one answer. Undo, presets, drift and checks would all have to recurse, and one effect used by three abilities would be stored three times (two sources of truth once one is edited).
- **One source per effect:** an effect used by many abilities is stored once and referenced by id, like a map used by many stages.

Why a `behaviour-setup` of `effect`, not a separate `effect-spec` kind mirroring spec.ts field by field:
- **The schema already exists once**, in the catalogue's `effect` behaviour (22 knobs mined from spec.ts with citations). A second hand-written schema would be a duplicate source of truth that drifts from the catalogue.
- It gets everything for free: per-answer edit/reset/undo, presets (the 10 BTF effects are `builtin:effect/<id>`), renames and drift, derived checks, duplicate.
- **The spec.ts shape is kept at the edges.** House rules 1–3 already come from spec.ts: named fields, one English sentence, an integer version literal, and a loader that never throws. For effects:
  - `describeSetup()` for an effect returns skillrig's own sentence: `describeSkill(toSkillSpec(doc))`.
  - **Import** from the booth (pasted spec text, or the booth's localStorage store via `loadStore()`): `parseSkillSpec()` / `normalize()` from spec.ts, then `fromSkillSpec()` maps fields to answers (`source:"user"`). Booth-only fields (`game`, `board`, `caster`, `foe`, `base`, `stack`, `aim`, legacy top-level `motion`/`seconds`) are dropped with a notice; `name` becomes the document `name`.
  - **Export to the booth:** `toSkillSpec(doc)` fills `board`/`caster`/`foe` from the effect's `booth_*` answers (rev 10+; `defaultSpec()` for the other booth fields) and keeps only the first 6 steps (the booth would truncate anyway; a notice says so). **r16:** it also drops the v2-only kinds and fields, with `boothDropsV2` (§2.10.1.1).

**Document rules:**
- `id`: `effect_<ULID>`; `kind: "behaviour-setup"`, `behaviourId: "effect"`, otherwise exactly §2.1. Effect documents live **only** in `effects/`; an `effect` setup in `project.rules`, `stage.rules` or `unit.setupIds` is a warning and is ignored.
- An owner's **`effect` answer** is `"none"`, a BTF builtin id (e.g. `"btf-holy-blade"` = catalogue `effect` defaults plus that preset's overrides), or an effect document id. Anything else is `unknownRef` (warning) and runs as `none` (the game's own drawing).
- "Make my own from Holy blade" creates an effect document, applies `builtin:effect/btf-holy-blade` to it (`source:"preset"`, `presetRef`), and sets the owner's `effect` answer to the new id: one op in each document.
- **Step ids are frozen per document (r27, M4).** The writer mints a fresh `id` for every step it adds or duplicates (for example `s-` + a lowercase ULID) and **never reuses a step id in that document**, including the id of a deleted step. So a deleted step can't silently retarget `connect_step` (§2.10.1.5) or the hit point, and undo across a delete still names the same step. Undo of a delete brings the step back with its own id. Ids already stored (BTF presets, older documents) are kept as they are.
- Deleting an effect document that's still referenced asks first, then raises `parentChanged` on the referencing answers (R1 through the project) and leaves them as `unknownRef` warnings.
- **Presentation only.** No effect answer changes a game rule; checks are warnings except `invalidValue`.
- **L19 shipped in rev 8:** `effect` refs are `{docs: "effect", builtin: […]}` on all 39 owners, and `effect.saved_effects` is tombstoned. The reader's stopgap (ignore `ref.list`) is retired.
- **Effects v2 (r16; ACCEPTED r17, CEO 2026-11-12 14:56 via CoS):** the 12-step cap, overlap timing, the new kinds, the stock pictures, `connect_step` and flash safety are all in **§2.10.1**.
- **Feel tricks (r19; **ACCEPTED r20**, CEO 2026-11-12 16:43 via CoS):** Impact flash and plan §17 are in **§2.10.2**.

### 2.10.1 Effects v2 format (r16; **ACCEPTED r17**, CEO 2026-11-12 14:56 via the CoS; scope accepted 14:42; a build still needs CEO SEND)
**r17 status:** the whole section is ACCEPTED. **r18:** the four Keeper-added fields (`fade_out_ms`, `enabled`, `stamp_rotate`, `connect_step`) are **final** (EA final rulings 2026-11-12 14:58, relayed by the owner; EUX confirmed). The engine track is queued after H4. ~~Exception (r17): Their behaviour is accepted, but EUX or the EA may still rename or reshape them before L46 ships. Every other field and rule is final.~~
This is the only home for the v2 fields of an effect document. The schema itself stays in the catalogue `effect` behaviour (§2.10). Every change below is a catalogue change, so it's **request L46** to the Behaviour Librarian (§12.5). **r28:** L46 shipped in catalogue rev 23 and is adopted (§12.4j), so the editor may save these fields. A build still needs CEO SEND. Answers EUX `ux/effects-v2-plan.md` §11 Q1–Q9, using the Engine Architect's rulings in plan §13.

**Two rules hold for everything below.**
- **Old effects don't move.** Every new field is optional, and its absent value means exactly today's behaviour. The 10 `btf-*` looks stay pixel-identical. There's **no migration and no rewrite**. A reader fills absent fields at use and writes nothing.
- **Warn, don't block.** The only hard error is `invalidValue` on a wrong type (§2.10 "Presentation only"). Ranges are clamped at use with the value kept, like every slider. The one exception is flash, which is never clamped for safety (rule 6).

#### 2.10.1.1 Step cap: 6 → 12 (Q1)
- `effect.steps.max_items` goes from **6 to 12**, still soft. `min_items` stays 1.
- **The v2 player** (one pure engine function plus a thin painter, plan §13.8) **plays the first 12 steps in list order**, in both Preview and Render.
- **Steps 13+ are saved, warned and not played.** This is the same pattern as today's 7th step (project-format §6.7 K-4): the `overCap` notice now reads "Steps 13+ are saved but won't play". The steps are never trimmed.
- **Until the v2 player ships**, today's skillrig path still plays the first 6, and `overCap` keeps its r14 wording.
- **The booth export, `toSkillSpec`, still keeps only the first 6 steps**, with the existing notice. It also drops whatever spec.ts can't carry, with one notice, **`boothDropsV2`**: "The booth can't show stage dim, stamps, particles, flashes, blend, layers or overlap; they were left out." It drops:
  - steps whose `kind` is `dim`, `stamp`, `particles` or `flash`;
  - the step fields from rule 3.
  - Why drop them: spec.ts `normalizeMotion()` would quietly turn an unknown kind into the seed motion.
  - The booth then plays the kept steps one after another.
  - Import from the booth (`fromSkillSpec`) is unchanged.
- **Render no longer writes `toSkillSpec`-shaped data**, because that shape holds only 6 steps and none of the v2 fields. It writes the v2 player's input (project-format §7.2 5a; core-types candidate CN-E1).

#### 2.10.1.2 Timing: `start_mode`, `start_at_ms`, `hold_ms` (Q2, Q9)
| Item field | Type | Range (cap) | Default when absent | Meaning |
|---|---|---|---|---|
| `start_mode` | picker `"after-last"` \| `"with-last"` \| `"at-time"` | — | `"after-last"` | When this step starts. Unknown value → `"after-last"` + warning |
| `start_at_ms` | int ms | 0–20000 | 0 | Used only by `"at-time"`: ms from the effect's start |
| `hold_ms` | int ms | 0–20000 | 0 | How long the step stays on its last frame after its length. **A duration, not a toggle** |
| `fade_out_ms` | int ms | 0–5000 | 0 = hard cut | **`dim` and `stamp` only** (r18, final). The fade runs **after the hold**, from the step's last alpha down to 0. It overlaps the next step, **doesn't delay** an `"after-last"` chain, and counts toward the effect end. Integer ramp: `fadeTicks = ceil(fade_out_ms / tick)`; alpha = `floor(lastAlpha × ticksLeft / fadeTicks)`, 0 on the last tick. On any other kind it's kept and ignored, with the warning `fadeOutIgnored`. The preset needs it for the dim and the rune (plan §7) |

- **Clock.** Everything runs on the engine's one clock and is rounded to ticks. A step's length is the existing **`seconds` field, unchanged**: still seconds, 0.15–3, frozen for BTF. The player reads it as `len = round(seconds × 1000)` ms.
- **Start times, in list order** over the first 12 steps (rule 1). **Disabled steps count:** `enabled: false` keeps its slot (r18).
  - The first step: `"after-last"` and `"with-last"` both start at **0**.
  - `"after-last"`: start = previous start + previous `len` + previous `hold_ms`. This is the Architect's chain.
  - `"with-last"`: start = the previous step's start.
  - `"at-time"`: start = `start_at_ms`.
  - Effect end = the largest `start + len + hold_ms + fade_out_ms`.
- **No migration.** With all three fields absent, every step is `"after-last"` with hold 0. That's exactly today's one-after-another sequence.
- **"Keep until the effect ends"** is a UX shortcut. It writes a plain number into `hold_ms`, set to the effect end without this step, minus this step's own end, floored at 0. It's never a stored flag, and it doesn't update itself if the other steps change later.
- **Units.** All new time fields are integers in ms and their names end in **`_ms`**. That keeps them distinct from the seconds-based `seconds` and `cue_at`, so a value can't be read 1000× off. Sliders may still show seconds.
- **Draft names** from the plan and mock (`start_at`, a numeric `hold`, `particle_life`, `flash_seconds`) are read as aliases once (rule 8). Writers always emit the `_ms` names.

#### 2.10.1.3 New kinds and fields (Q3, Q9)
`steps[].kind` gains **`dim`**, **`stamp`**, **`particles`** and **`flash`**; the 9 existing kinds are unchanged. A field only applies to the kinds named in its row. On any other kind it's kept and ignored silently, like `row_count` on a straight step today.

| Item field | Kinds | Type | Range (cap) | Default | Notes |
|---|---|---|---|---|---|
| `enabled` | all | toggle | — | `true` | `false` = kept and **not drawn**, but it **keeps its time slot** (r18, final): its start, `len` and `hold_ms` still feed the next `"after-last"` step, so turning a step off (including through `dim_stage` / `flash`) never moves later steps or the hit. Backs the Simple **Dim the stage** / **Flash** shortcuts without deleting a tuned step (rule 3a) |
| `blend` | all | picker `"normal"` \| `"add"` | — | `"normal"` | `"add"` = `lighter` pass (plan §13.2). Separate from `glow*` |
| `draw_layer` | all | picker `"ground"` \| `"air"` \| `"overlay"` (r23: += `"behind-unit"` \| `"front-unit"`, §2.10.3.1) | — | `"air"` | Draw order per plan §13.1. Not to be confused with `layer_kind`/`layer_delay`, the existing "second motion" fields (UI label "Draw on", not "Layer") |
| `ground_size` | `stamp` on `ground` | slider, tiles | **1–8** (ACCEPTED), step 0.25 | 3 | Replaces `scale` for ground stamps (`scale` is kept and ignored there). Whole tiles when `scale_snap` is whole |
| `stamp_rotate` | `stamp` | int degrees, **rotation over time** | −1440–1440 | 0 | r18, final. A linear turn over the step's `len` only: angle = `spin + trunc(stamp_rotate × elapsed / len)`, held at the final angle through the hold and fade. The fixed angle stays `spin`, so there's no duplicate. Basic UI offers quarter turns; Advanced any whole degree (plan §13.7) |
| `dim_amount` | `dim` | int per-mille | **0–850** | 550 | UI shows 0–85%. The darkness at any moment is `dim_amount` × the step's `fade_*` ramp. A dim step draws in the dim slot of plan §13.1, so it ignores `draw_layer` |
| `dim_keep_units` | `dim` | toggle | — | `true` | v2 always keeps units and the playing effect lit (plan §13.1); `false` is kept, plays as `true`, and gives a notice until a later track |
| `dim_lights` (r21; ACCEPTED r22, EA 16:25; project-format r31) | `dim` | option | `half` \| `dark` | `half` | What authored lights (`lightSource`) do while this dim step plays: `half` keeps a half-size glow (torches stay lit), `dark` puts them out. Per effect, so each ability's effect chooses. An unknown value plays as `half` with the usual unknown-option warning; kept, never rewritten. Render only. |
| `particle_motion` | `particles` | picker `"burst"` \| `"attract"` \| `"spiral-in"` \| `"rise"` | — | `"burst"` | UI: Burst out / Pull in / Spiral in / Rise. Unknown value plays as `"burst"` with `outOfRange` (r24, §2.10.3.5; no separate unknown-enum code) |
| `particle_count` | `particles` | int | **0–48** per step, step 1; out of range clamps with `outOfRange` (kept). **48 per effect** summed across all `particles` steps (r24, §2.10.3.5): over that, later steps are cut down at load in step order and **`fxParticlesOverCap` {count, limit: 48}** fires once (supersedes r17 `particlesOverSoftCap`). 32 is an editor note ("may slow some phones") only, never a format cap or warning. Runtime pool of 96 (oldest dropped first) is not stored | 12 | |
| `particle_life_ms` | `particles` | int ms | **200–3000** | 800 | Draft name `particle_life` is a reader alias (§2.10.1.8). Out of range clamps with `outOfRange` |
| `particle_pull` | `particles` | int per-mille | **0–2000**, stored step 100 (UI 0–2, default 1, step 0.1) | 1000 | Used by `attract` and `spiral-in` only; ignored silently otherwise (r24, §2.10.3.5). Out of range clamps with `outOfRange` |
| `flash_strength` | `flash` | int per-mille | **0–1000** | 550 | 0 = rings only, no white overlay (preset step 6) |
| `flash_ms` | `flash` | int ms | slider **40–2000**; engine sanity cap 1–10000 | 100 | The white overlay's length. It can be longer than the step; the step then ends at `max(len, flash_ms)` |
| `wave_rings` | `flash` | int | **0–4** | 2 | Shockwave rings |
| `wave_radius` | `flash` | slider, tiles | **0.5–8**, step 0.25 | 2 | |

- **Reused fields, not new ones:**
  - `anchor`, `jitter`, `start_spread`, `size_spread` and `picture` apply to `particles` and `stamp`.
  - The flash and ring colour is the step's existing `tint_on`/`tint_from`/`tint_to`; it's white when `tint_on` is false. There's no `flash_colour` field.
  - The existing `impact`, `sparks`, `impact_radius` and `impact_colour` stay as they are, so BTF looks don't move.
- **Clash check, done against catalogue rev 22 and the docs:** no new name matches any existing effect knob or step field.
  - The near misses were renamed or are kept apart on purpose:
    - `draw_layer` vs `layer_kind` (labels kept apart);
    - `particle_count` follows the `row_count`/`orbit_count` pattern;
    - `stamp_rotate` vs `spin` (`spin` is a rest angle);
    - `flash_ms` vs `seconds` (overlay length vs step length).
  - `stage_dim` is **not** added as a stored knob (rule 3a).
- **3a. Simple shortcuts are `ui_derived`, not stored** (like `speed` and `count`):
  - **`dim_stage`** maps to `steps.enabled` of the dim steps. Turning it on with no dim step inserts one at its defaults, with `start_mode` `"at-time"`.
  - **`flash`** maps to `steps.enabled` of the flash steps whose `flash_strength` is above 0.
  - **`speed`** also scales `start_at_ms`, `hold_ms`, `fade_out_ms`, `particle_life_ms` and `flash_ms`, each clamped to its range.
  - **`count`** also scales `particle_count` on the `particles` steps, capped at 48.

#### 2.10.1.4 Built-in picture ids (Q4)
- The new ids are **`rune-circle`**, **`orbit-rings`**, **`spark`**, **`ember`** and **`smoke`**. They're **engine stock effect pictures**, in the same family as the stock `blade` drawings. They are **not** entries in the built-in asset library, which stays Kenney-only for v1 (project-format K1, R13-8). CEO E3 (DECIDED 14:56) confirms this.
- **Where they're allowed:**
  - `effect.picture`: `ref {docs: "asset", builtin: ["none", "rune-circle", "orbit-rings", "spark", "ember", "smoke"]}`.
  - `steps[].picture` changes from item type `asset` to the same `ref`, still nullable (null = inherit). Every stored value (`null` or an `asset_<16 hex>`) stays valid.
  - `orbit-rings` is drawn by the renderer's ellipse helper (plan §13.7), tinted by the step. The other four are small PNGs shipped with the effects player.
- **Clash check:**
  - `asset_<16 hex>` ids can't collide with these names.
  - No existing builtin `ref` value uses them.
  - `ember` is also a `liquidEdge` value; that's a different field, so there's no conflict.
  - The v1 mock's `lib_spark` stand-in is mock-only, not format.
  - These ids are **frozen once shipped** and never reused.
- **Credits and closure:**
  - Each referenced id adds a credit row to the Render's licence list: `CC0-1.0`, author "TileEngine", `aiGenerated: false` (drawn by hand or made in code).
  - It adds nothing to `assets/`.
  - See project-format §7.2 5b.

#### 2.10.1.5 `connect` stays the hit point (Q8)
- **`connect` keeps its name and its meaning.** It's the 0–1 point, inside the **hit step's own length**, where the hit lands. **Chaining is `start_mode: "after-last"`** (rule 2), never `connect`. Nothing is renamed, so no alias is needed.
- **New effect knob `connect_step`** (r18, final; string step `id`; absent = the **last of the first 12 steps in list order, enabled or not**, which is today's rule). It picks which step the hit lands in. Hit time = that step's start + `max(50, len) × connect`, in ms, **rounded up to ticks once**. That's spec.ts `connectTime()` with the v2 start time.
- **Old effects stay identical:** when the timing fields and `connect_step` are absent, the hit step's start is the sum of the earlier `seconds`, exactly as spec.ts does it.
- Step ids are never reused in a document (§2.10 document rules, r27 M4), so after a delete `connect_step` can't land on a different step that took the old id.
- `connect_step` must name an existing step among the first 12. An unknown id gives `unknownRef` (warning) and falls back to the default. **A disabled step is a valid target**: the hit lands at that step's time, with no warning.
- **Not "a fraction of the total"** (EUX's suggestion). That would move the hit in every multi-step effect. For example, two 0.48 s steps with `connect` 0.92 hit at 0.922 s today but would hit at 0.883 s. The UI can still **show and drag a hit mark on the full timeline**: dropping it writes `connect_step` + `connect`.
- **`cue_at`'s max** goes from 12 to **20 s**, so a cue can sit anywhere in a 12-step effect (L46).

#### 2.10.1.6 Flash safety: derived, never a stored toggle (Q7)
- **On the effect:** `flash_risk` is **computed on read** by the Architect's shared pure detector, `te-flash@1`, run on the document (plan §13.5). Its output is `{flashRisk, reasons: ("tooMany" | "bigRed")[], worstWindowMs}`.
  - It's shown as a quiet notice, `flashRisk`, never a block.
  - It's **not stored in the effect document**, so the maker can't clear it while the effect is risky. The only way to clear it is to change the effect.
  - **There's no flash cap.** Flash values play as authored, unless the player's reduce-flashes is on (profile-format §3.3).
- **On the project:** derived (project-format §6.7, §7.2). The **hub listing** stores a server-computed copy (profile-format §9.0).
- **Preset check:** the Astrologer preset (L46) has one flash start (step 7), and its overlay is white, so it trips neither `tooMany` nor `bigRed`. That's the QA acceptance case for the detector.

#### 2.10.1.7 Player settings (Q6)
Reduce flashes and reduced motion are **player settings**, defined in profile-format §3.3. Effect documents never store them.

#### 2.10.1.8 Reader aliases (draft names only; writers never emit them)
| Read | As |
|---|---|
| `start_at` (number, ms) | `start_at_ms` |
| `hold` (number, ms) | `hold_ms`. **`hold: true`/`false` is not read**: it's kept in place and gives a notice, because it never shipped and its meaning is gone |
| `particle_life` (ms) | `particle_life_ms` |
| `flash_seconds` (s) | `flash_ms` = round(s × 1000) |
| `stage_dim` (effect knob) | ignored with a notice: it's `ui_derived` |

**Normalising aliases on edit (r27, M6; also §2.10.2.11 and §2.10.3.3).** Readers keep accepting every alias, and a load never rewrites one. When the editor writes a step or knob that holds an alias, it writes the canonical name and value instead (`particle_life` → `particle_life_ms`, step `light` → `light_mode`, `pixel_scale` `"1"`–`"6"` → the integers, and the other rows of these tables); when both are present the canonical one wins, as on read. Nothing is wiped: the old stored value stays in that op's `before` in `history`, and for a `steps` item key the whole old list is also kept as an orphan copy (`orphans["steps#items"]`), the same pattern as a retired item field (§8.2). No second live key is left behind. A boolean `hold` keeps its rule (kept in place, with a notice), and ignored names (`stage_dim`, `hit_stop_jitter`) stay as these tables say.

#### 2.10.1.9 CEO questions (E1–E4) and core-types candidates
**All four are DECIDED (CEO 2026-11-12 14:56 via the CoS: "Take all four"), as recommended.** The proposal text is kept below.
- **E1 (local and sideloaded games):** **DECIDED (CEO 2026-11-12 14:56).** does an exported game that isn't from the hub show the seizure warning? **Recommended: yes, on first launch on each device.** It shows again after an update that newly adds flash risk, offering Continue and Reduce flashes. It reads the Render manifest's `flashRisk`. The editor's Preview shows only the maker's notice, with no screen.
- **E2:** **DECIDED (CEO 2026-11-12 14:56).** are `reduce_flashes` and `reduce_motion` core settings in every game, and can a game hide `reduce_flashes`? **Recommended: core in every game, and `reduce_flashes` can't be hidden.**
- **E3:** **DECIDED (CEO 2026-11-12 14:56).** are the five pictures engine stock pictures (CC0-1.0, credited "TileEngine", drawn by hand or made in code, not AI), outside the Kenney-only library rule? **Recommended: yes.**
- **E4 (hub games hosted elsewhere):** **DECIDED (CEO 2026-11-12 14:56).** **Recommended:**
  - The hub checks the effect data the editor sends when the game is listed, and shows the warning before it opens the link.
  - Web links carry `te_reduce_flashes=1` when the player picks Reduce flashes.
  - Store links show "Turn on Reduce flashes in the game's settings".
  - A listing that was never checked shows "Not checked for flashes" and no warning screen.

Core-types candidates, **CN only, not staged**:
- **CN-E1:** the v2 effect player input, the Render's resolved effect, replacing the `toSkillSpec`-shaped data.
- **CN-E2:** the step unions `StepKind`, `StartMode`, `DrawLayer`, `Blend` and `ParticleMotion`.
- **CN-E3:** `FlashCheck {flashRisk, reasons, worstWindowMs}` and the detector id `"te-flash@1"`.
- **CN-E4:** the setting keys `reduce_flashes` and `reduce_motion`, and `EditorPrefsPreview.previewReduceFlashes`.
- **CN-E5:** the `FxPictureId` union of the five ids.

### 2.10.2 Feel tricks: Impact flash and §17 (r19; **ACCEPTED r20**, CEO 2026-11-12 16:43 via the CoS; a separate section from §2.10.1; plan only, a build needs the CEO's SEND for Effects v2)
**Status (r20): ACCEPTED** (CEO 2026-11-12 16:43 via the CoS: F1–F3 as recommended; the EA confirmed every point, and its additions are written in below). The CEO liked plan §16 (15:19) and §17 (15:37), plan only. It's a separate section from §2.10.1, and nothing in §2.10.1 changes. No build until Effects v2 gets the CEO's SEND. Answers EUX `ux/effects-v2-plan.md` **K-IF1** (§16) and **K-T1–K-T8** (§17.9), using the Architect's A-IF1 (§16.1) and A-T1–A-T7 (plan "17.1"). Every change here is a catalogue change, so it's request **L47** (§12.5), **unblocked (r20)**. **r28:** L47 shipped in catalogue rev 23 and is adopted (§12.4j), so the editor may write these fields and option values.

The §2.10.1 rules hold unchanged: **every new field is optional and absent = today's play** (no Feel toggle on, no shine, no hit-stop, screen-wide flash), **no migration, no rewrite**, warn don't block (only `invalidValue`, i.e. H2, is hard), ranges are clamped at use with the value kept, flash is never capped, and every time field is an integer in ms ending in `_ms`.

#### 2.10.2.1 One new start mode: `"at-hit"` (used by §16 and every §17 trick)
EUX's plan writes "`start_mode: "at-time"` = the hit" many times. A number copied from the hit goes stale as soon as the maker changes the hit step, so the hit-timed steps get their own mode instead.
- **`start_mode` gains `"at-hit"`:** start = the hit time (§2.10.1.5, rounded up to ticks once) + `start_at_ms`. Under `"at-hit"`, **`start_at_ms` is the offset after the hit** (same field, same 0–20000 range; it's the origin that changes with the mode, like today's `"at-time"`). No second offset field.
- **Order:** start times are still computed in list order. An `"at-hit"` step **at or before `connect_step` in list order** (including the hit step itself) would be a cycle: it plays as `"after-last"` with the warning **`atHitBeforeHit`**. **EA (r20):** that fallback also keeps the hit time from depending on itself. A later `"after-last"` step chains from an `"at-hit"` step as usual.
- **Pinning the hit:** when the editor inserts an `"at-hit"` step and `connect_step` is absent, it first writes `connect_step` = the current hit step's id in the same op group, so appending steps never moves the hit (the default "last step" rule would otherwise pick the new step).
- Old v2 readers: an unknown `start_mode` already plays as `"after-last"` with a warning (§2.10.1.2). `toSkillSpec` already drops `start_mode`.

#### 2.10.2.2 Impact flash: circle flashes (K-IF1, K-T2)
| Item field | Kinds | Type | Range (cap) | Default when absent | Notes |
|---|---|---|---|---|---|
| `flash_shape` | `flash` | picker `"screen"` \| `"circle"` | — | `"screen"` | `"screen"` = today's full overlay. `"circle"` = an integer midpoint filled disc, drawn as spans in the overlay layer (A-IF1). Affects the overlay only; `wave_rings` are unchanged |
| `flash_radius` | `flash` with `"circle"` | slider, tiles | **1–8**, step 0.25 | **3** | Radius in tiles; the player rounds the pixel radius to a whole number (A-IF1). Kept and ignored on `"screen"` |

- **Centre = the existing step field `anchor`, not a new `flash_center`.** `anchor` (`"caster"` \| `"target"`, default `"caster"`) already places `particles`, `stamp` and the Astrologer flash steps. **"Hit tile" is `"target"`** (the foe's tile). L47 adds one option, **`"screen"`** = the screen centre; only `flash` reads it, and on any other kind it plays as `"caster"` with the notice `anchorScreenIgnored`. The catalogue default stays `"caster"` (one default); the Impact flash toggle and the presets write `"target"` explicitly.
- **Black / dark is just the existing step tint** (`tint_on` + `tint_from`/`tint_to`), white when `tint_on` is false (§2.10.1.3). No `flash_colour`.
- **One pair of fields covers §16 and §17** (K-T2): Impact flash, the Explosion discs and any small pickup flash all use `flash_shape` + `flash_radius` + `anchor`.
- **The Impact flash toggle writes two steps** (Basic, off by default):
  ```json
  [
    {"id": "impact-white", "label": "Impact flash", "kind": "flash", "start_mode": "at-hit", "start_at_ms": 0, "seconds": 0.15, "anchor": "target", "draw_layer": "overlay", "flash_shape": "circle", "flash_radius": 3, "flash_strength": 1000, "flash_ms": 40, "wave_rings": 0},
    {"id": "impact-black", "label": "Impact flash (dark)", "kind": "flash", "start_mode": "at-hit", "start_at_ms": 40, "seconds": 0.15, "anchor": "target", "draw_layer": "overlay", "flash_shape": "circle", "flash_radius": 3, "flash_strength": 1000, "flash_ms": 40, "wave_rings": 0, "tint_on": true, "tint_from": "#000000", "tint_to": "#000000"}
  ]
  ```
  - The black frame is timed by its `start_at_ms` offset, not by `"after-last"`, because a step's `len` can't go under 150 ms (`seconds` min 0.15, frozen). At 30 fps both 40 ms values round up to 2 ticks (67 ms), so the frames meet exactly. The Advanced "beat" control writes `flash_ms` on both and the second step's offset together.
  - **The toggle is `ui_derived`, never stored** (like `dim_stage`/`flash`): it's on when the effect has an enabled `"at-hit"` white circle flash with offset 0 followed in list order by an `"at-hit"` black circle flash. Off sets `enabled: false` on that pair. (The Explosion discs are dark then white, so they don't read as the toggle.)
- **The 40–200 ms "beat" cap for the Explosion discs is a UI slider limit.** The data range of `flash_ms` stays the ACCEPTED 40–2000; a field has one range for every step.

#### 2.10.2.3 Shockwave: reuse the flash rings (K-T3)
**Fold, don't add a second ring path.** A shockwave ring is a `flash` step with **`flash_strength: 0`** (rings only, no overlay, exactly as the Astrologer's step 6) and `wave_rings: 1`, with `draw_layer: "ground"` for the toggle's default path. So `wave_radius` is `radius_to`, and there's one ring definition. Two fields are added, and the ease reuses an existing step field:

| Item field | Kinds | Type | Range (cap) | Default when absent | Notes |
|---|---|---|---|---|---|
| `wave_from` | `flash` | slider, tiles | **0–8**, step 0.25 | **0** (grows from the centre) | The ring's start radius (EUX `radius_from`). The Shockwave toggle writes **0.5** |
| `wave_thickness_px` | `flash` | int px at default zoom | **1–16** | **3** | Ring line thickness (EUX `ring_thickness_px`). Integer, cached per (rx, ry, thickness, tint, zoom) (A-T3) |
| *(reused)* `wave_radius` | `flash` | slider, tiles | 0.5–8 (ACCEPTED) | 2 | = EUX `radius_to`. The toggle writes **4** |
| *(reused)* `look_ease` | all | picker `"linear"` \| `"out"` \| `"in-out"` | — | `"linear"` | The existing step ease for the look ramps now also eases the ring radius. **EUX's `"fast-out"` is `"out"`**; the toggle writes `"out"`. A step-level `ease` isn't added: `ease` is already an effect knob |

- **Grow time (EA r20):** ring growth time = **`max(150, len)` ms, rounded up to ticks once**. The radius is a whole number per tick, from the integer fast-out table. `len` is `seconds` (0.15–3 s), so the shortest grow is **150 ms, not 80**. The toggle writes `seconds` 0.24. A second ring is a second ring-only `flash` step (`draw_layer: "air"`, thinner, `"at-hit"` with an offset), or `wave_rings: 2` on the same step.
- **Reduce flashes** plays at most **one** ring per step (it's already the rings path). A hollow ring's coverage is the annulus (A-T3), so normally 0 starts.
- `ground_size` stays the size of ground **pictures**; it isn't a ring radius.
- The Shockwave toggle is `ui_derived`: on when the effect has an enabled `"at-hit"` ring-only flash step on `"ground"`.

#### 2.10.2.4 Blank punch (K-T4)
| Item field | Kinds | Type | Range (cap) | Default when absent | Notes |
|---|---|---|---|---|---|
| `blank_ms` | `stamp` | int ms | **0, or 40–200** (cap 200; 1–39 plays as 40 with `outOfRange`) | **0** = not a blank | When > 0 the step is a **blank**: it draws nothing, and its `len` is `blank_ms` (`seconds` is kept and ignored, the same pattern as `scale` on ground stamps) |

- **How it's written:** a real step, `{"kind": "stamp", "picture": "none", "blank_ms": 40, "start_mode": "at-hit", "enabled": true, ...}`. It's valid and distinct from both other cases:
  - `"picture": "none"` is an explicit empty picture. L47 adds `"none"` to `steps[].picture` `ref.builtin` (today only `effect.picture` has it). **`null` still means inherit**.
  - **`enabled: false`** = a hidden step (Simple kind-toggles). **`blank_ms > 0`** = a deliberate blank that plays. Different fields, so no ambiguity.
- **What a blank does (EA r20):** a blank hides **only this effect's other steps** while it plays (their clocks keep running), never other effects, units or the HUD. The stage still draws too. That's what makes it a gap, even under overlapping steps. It keeps its time slot, so `"after-last"` after it is start + `blank_ms` + `hold_ms`.
- **`blank_at` isn't added:** placement is already `start_mode`. "hit" = `"at-hit"`; "step-start" = list it right after that step with `"with-last"`. Both are read as aliases (§2.10.2.11).
- **No repeat field** (agreed). Lightning-style waits are more blank steps.
- **Detector (EA r20):** a blank is never a flash start, and steps that resume after it count normally.
- Reduce flashes: never plays the blank flicker (player-side, plan §17.3). `speed` scales `blank_ms`, clamped.

#### 2.10.2.5 Hit-stop (K-T5)
| Effect knob | Type | Range (cap) | Default when absent | Notes |
|---|---|---|---|---|
| `hit_stop_ms` | int ms | **0–150**, hard cap **150** (higher values are kept and play as 150) | **0** = off | UI chips 50 / 100 / 150; the toggle writes 50 |

- **Placement: an effect knob next to `connect`/`connect_step`, not a step field.** The hit belongs to the effect: `connect`, `connect_step`, `impact`, `impact_colour` and `impact_radius` are all effect knobs. A field on the hit step would be orphaned whenever `connect_step` moves. This is still **not a second clock**: it's one number that the player reads at the hit (A-T1).
- **Timing (A-T1):** `freezeTicks = ceil(hit_stop_ms / tick)`, a whole number of ticks. It's a **view-time offset**: from the hit for `freezeTicks`, this effect, the attacker and the victim draw at the hit time; after that they draw at clock − `freezeTicks`. So, in view time, **everything in this effect after the hit, and its end, is delayed by `freezeTicks`**. The stored times (`start_at_ms`, `hold_ms`, …) never change, and the rules, the command log and the engine clock are never paused. Steps drawing at the hit (e.g. Impact flash's first frame) are held through the freeze.
- **EA r20:** `hit_stop_ms` is **view time only**. Per A-T1, the **attacker and victim freeze for the same length**, not just this effect. Overlapping freezes end at the latest end, capped at 150 ms past the first start. Reduced motion means 0; Reduce flashes alone caps it at 50. These are player-side, never stored.
- **CEO F3 (DECIDED 16:43):** hit-stop plays in timed and real-time modes too, capped at 150 ms, view only (a frozen unit's drawing may lag its real state by up to 150 ms; the rules never wait).
- **Detector:** not a flash. It computes with **freeze 0**, which packs the later starts tightest (worst case).
- `speed` doesn't scale it (it's a frame-length feel).

#### 2.10.2.6 Smear (K-T6)
| Item field | Kinds | Type | Range (cap) | Default when absent | Notes |
|---|---|---|---|---|---|
| `smear_ms` | `stamp` + the 9 motion kinds | int ms | **0, or 40–120** (cap 120) | **0** = off | The toggle writes 40. One 100% opaque fan / arc frame in the air layer (A-T5) |
| `smear_remnant_ms` | same | int ms | **0, or 40–120** | **0** = no remnant | The thinner second frame. **Replaces EUX's `smear_remnant` bool:** one field, 0 = off, so a bool and a length can't disagree |
| `smear_tiles` | same | nullable slider, tiles | **1–8**, step 0.25 | **`null` = auto**: the step's path length, capped at 8 | |

- **Kinds:** the 9 travel motions (the path is the arc) and `stamp` (the sweep comes from `stamp_rotate`). On `dim`/`particles`/`flash` it's kept and ignored silently.
- **When:** on the hit step, the smear starts at the hit; on any other step, it's the last `smear_ms` of the step's `len`. The remnant follows it at once. It doesn't move later steps.
- **Colours:** the two brightest of the picture / tint, as A-T5 says; no colour field.
- `toSkillSpec` drops the smear fields from motion steps (`boothDropsV2`); the step itself is kept.
- Reduced motion skips it; Reduce flashes keeps it only under 25% coverage (player-side).

#### 2.10.2.7 Hit-white (K-T7)
| Effect knob | Type | Range (cap) | Default when absent | Notes |
|---|---|---|---|---|
| `hit_white_ms` | int ms | **0, or 40–200** (cap 200) | **0** = off | The toggle writes 40. Starts at the hit. A unit recolour on the units layer, not an overlay (A-T6) |
| `hit_white_target` | picker `"target"` \| `"caster"` \| `"stamp"` | — | `"target"` | `"stamp"` = every stamp step drawing at the hit |
| `hit_white_mode` | picker `"white"` \| `"tint"` \| `"black"` (r23: += `"bright"`, §2.10.3.2) | — | `"white"` | `"tint"` uses the existing effect knob **`impact_colour`** (the hit's colour); no new colour field |

- An effect knob for the same reason as hit-stop: it's a property of the hit. One shot per hit; no pulse field.
- **The detector sees it without a new coverage field.** It uses numbers the project already stores, never pixels:
  - `"target"`/`"caster"`: the **sprite box** = the unit sprite's frame size from its asset meta × default zoom. The effect doc doesn't know which unit plays it, so it takes the **largest** box among the units whose setups reference this effect (the project closure). If none is known (e.g. an effect alone in the editor), 1 tile (the Preview dummy).
  - `"stamp"`: the stamp's drawn box (`ground_size` tiles on the ground, or the picture box × `scale_to` in air).
  - One start per hit when that box covers ≥25% of 390×844 and the brightness change is ≥10% (white and black always count; `"tint"` compares the luma of `impact_colour` with the 128 reference, or the dimmed luma under a dim). `bigRed` uses the same box with `impact_colour`.
- Reduce flashes: an outline or a ≤20% / ≤80 ms dip (player-side).

#### 2.10.2.8 Shine (K-T8)
| Item field | Kinds | Type | Range (cap) | Default when absent | Notes |
|---|---|---|---|---|---|
| `shine_ms` | `stamp` | int ms | **0, or 80–800** (cap 800) | **0** = no shine | The toggle writes 320 (4 × 80). Starts at the step's start |
| `shine_style` | `stamp` | picker `"simple"` \| `"extra"` | — | `"simple"` | `"extra"` adds the short white → gold → highlight on the same object (engine colours in v2) |
| `shine_loop_rest_ms` | `stamp` | int ms | **0–5000** | **0** = play once | Repeats `shine_ms` + rest, on the clock, until the step's `len + hold_ms` ends. Never makes the effect endless |
| `shine_angle` | `stamp` | int degrees | **0–179** | **45** | Whole degrees |
| `shine_on` | `stamp` | picker `"stamp"` \| `"target"` \| `"caster"` | — | `"stamp"` | `"stamp"` = this stamp's picture. `"target"`/`"caster"` = that unit's sprite box; the stamp's own picture still draws unless it's `"none"` |

- A step that only shines is a `stamp` with `"picture": "none"` and `shine_on` set. If `shine_ms` > `len`, the step ends at `max(len, shine_ms)` (the `flash_ms` precedent).
- `speed` scales `shine_ms` and `shine_loop_rest_ms`, clamped.
- **Detector:** an `"extra"` play is one start when its box covers ≥25%. `"simple"` counts only if the band area (the EA's band × box) reaches 25%, so normally 0. **Every loop counts.**

#### 2.10.2.9 Presets and the stock picture (K-T1, K-T8)
- **New stock picture `blast-star`**: an engine stock effect picture under the E3 rule (CC0-1.0, author "TileEngine", hand-drawn or made in code, `aiGenerated: false`, not a library entry). It's allowed on `effect.picture` and `steps[].picture`. It's frozen once shipped and never reused. It adds one credit row when referenced. **CEO F1 (DECIDED 16:43):** `blast-star` is the sixth engine stock picture under E3.
- **`te-explosion`** ("Explosion", recipe `explosion`, `deck: null`). It's a one-shot skeleton of existing kinds. Its hit is step 1 at time 0 (the blast *is* the hit). It's never applied to existing effects; the maker picks it:
  ```json
  {
    "id": "te-explosion", "label": "Explosion", "display_name": "Explosion",
    "deck": null, "recipe": "explosion", "status": "PROPOSED",
    "overrides": {
      "impact": false, "connect_step": "ex-1", "connect": 0.02,
      "steps": [
        {"id": "ex-1", "label": "Contrast disc", "kind": "flash", "seconds": 0.15, "anchor": "target", "draw_layer": "overlay", "flash_shape": "circle", "flash_radius": 3, "flash_strength": 1000, "flash_ms": 80, "wave_rings": 0, "tint_on": true, "tint_from": "#14101f", "tint_to": "#14101f"},
        {"id": "ex-2", "label": "White disc", "kind": "flash", "start_mode": "at-hit", "start_at_ms": 80, "seconds": 0.15, "anchor": "target", "draw_layer": "overlay", "flash_shape": "circle", "flash_radius": 3, "flash_strength": 1000, "flash_ms": 80, "wave_rings": 0},
        {"id": "ex-3", "label": "Shockwave", "kind": "flash", "start_mode": "at-hit", "start_at_ms": 80, "seconds": 0.24, "anchor": "target", "draw_layer": "ground", "flash_strength": 0, "wave_rings": 1, "wave_from": 0.5, "wave_radius": 4, "wave_thickness_px": 3, "look_ease": "out", "tint_on": true, "tint_from": "#fff4d6", "tint_to": "#fff4d6"},
        {"id": "ex-4", "label": "Blast", "kind": "stamp", "start_mode": "at-hit", "start_at_ms": 80, "seconds": 0.3, "anchor": "target", "draw_layer": "air", "picture": "blast-star", "fade_out_ms": 120, "scale_on": true, "scale_from": 0.6, "scale_to": 1.6, "tint_on": true, "tint_from": "#fff7c2", "tint_to": "#ff8a1f"},
        {"id": "ex-5", "label": "Embers", "kind": "particles", "start_mode": "at-hit", "start_at_ms": 80, "seconds": 0.6, "anchor": "target", "picture": "ember", "particle_motion": "burst", "particle_count": 12, "particle_life_ms": 600},
        {"id": "ex-6", "label": "Smoke rises", "kind": "particles", "start_mode": "at-hit", "start_at_ms": 240, "seconds": 1.0, "anchor": "target", "picture": "smoke", "particle_motion": "rise", "particle_count": 8, "particle_life_ms": 1200},
        {"id": "ex-7", "label": "Smoke linger", "kind": "stamp", "start_mode": "at-hit", "start_at_ms": 240, "seconds": 0.6, "hold_ms": 400, "fade_out_ms": 800, "anchor": "target", "draw_layer": "air", "picture": "smoke", "scale_on": true, "scale_from": 1.0, "scale_to": 1.4}
      ]
    }
  }
  ```
  - **Checks:** 7 steps (≤ 12); 12 + 8 = **20 particles** (≤ 48); ends at **2.04 s** (ex-7: 240 + 600 + 400 + 800). Every `"at-hit"` step comes after the hit step. The palette is white → yellow → orange, so no `bigRed`. Smoke `hold_ms` 400 and `fade_out_ms` 800 match plan §17.1. A "second blast" is copied steps with a larger offset (EUX: 80–2000, default 200), with no new field.
  - **Flash count: at most 2 starts, so the shipped preset never trips `flashRisk`.** But the "3 tiles counts as 0" in plan §17.1 depends on the tile size. With `settings.tileSize` 48 (PC), a 3-tile disc is 144 px, about 20% of the screen, so **0** starts. With **64 (Mobile/Both)** it's 192 px, about **35%**, so **2** starts. Then the preset plus a big Impact flash within 1 s makes 4, which trips it (quiet notice). The break-even radius is 162 / tileSize tiles (2.5 at 64, 3.4 at 48). **CEO F2 (DECIDED 16:43):** the default disc stays at 3 tiles.
  - **`connect` 0.02 (r28; gaps.md §29 item 1):** the draft said `0`, which is below `connect`'s minimum of 0.02. 0.02 is what 0 played as (spec.ts `normalize()` clamp, EA 2026-11-15 13:33), so nothing looks different, and the catalogue stores 0.02 (rev 23). The minimum stays 0.02.
  - "Blast size 4 tiles" (plan §17.1): tiles only apply to **ground** pictures (`ground_size` 1–8). An air stamp uses the existing `scale_*` (0.35–2.6×), so the preset uses scale 0.6 → 1.6.
- **`te-pickup-sparkle`** ("Pickup sparkle", recipe `pickup`, `deck: null`):
  ```json
  {
    "id": "te-pickup-sparkle", "label": "Pickup sparkle", "display_name": "Pickup sparkle",
    "deck": null, "recipe": "pickup", "status": "PROPOSED",
    "overrides": {
      "hit": "none", "damage_label": "none", "impact": false, "connect_step": "pk-1", "connect": 0.02,
      "steps": [
        {"id": "pk-1", "label": "Shine", "kind": "stamp", "seconds": 0.32, "anchor": "target", "draw_layer": "air", "picture": "none", "shine_ms": 320, "shine_style": "simple", "shine_angle": 45, "shine_on": "target"},
        {"id": "pk-2", "label": "Sparks", "kind": "particles", "start_mode": "at-hit", "start_at_ms": 0, "seconds": 0.3, "anchor": "target", "blend": "add", "picture": "spark", "particle_motion": "burst", "particle_count": 6, "particle_life_ms": 200},
        {"id": "pk-3", "label": "Ring", "kind": "flash", "start_mode": "at-hit", "start_at_ms": 0, "seconds": 0.24, "anchor": "target", "draw_layer": "air", "flash_strength": 0, "wave_rings": 1, "wave_from": 0, "wave_radius": 1, "wave_thickness_px": 2, "look_ease": "out", "tint_on": true, "tint_from": "#ffd34d", "tint_to": "#ffd34d"}
      ]
    }
  }
  ```
  - **Checks:** 3 steps, 6 particles, ends at 0.32 s, one-shot, `"simple"` shine and a 1-tile hollow ring, so **0 starts**.
  - **`connect` 0.02 (r28; gaps.md §29 item 1):** the draft said `0`, which is below `connect`'s minimum of 0.02. 0.02 is what 0 played as (spec.ts `normalize()` clamp, EA 2026-11-15 13:33), so nothing looks different, and the catalogue stores 0.02 (rev 23). The minimum stays 0.02.
  - Spark life: the plan's 80–400 ms is under the ACCEPTED `particle_life_ms` minimum of **200**. The preset uses 200, and the UI slider can run 200–400. The ACCEPTED range isn't changed.
  - The ring radius 0.5–3 is a UI limit inside the ACCEPTED `wave_radius` 0.5–8.
  - **Heal / Level-up** are tint answers on this preset (maker edits), not new presets or ids in this round.

#### 2.10.2.10 Detector: `te-flash@2` (flash_risk stays computed on read)
These tricks give the detector inputs that `te-flash@1` doesn't read (circle size, unit recolour, blanks, smear, shine). So **the Feel-aware rules are a new detector id, `te-flash@2`**, not a silent change to @1.
- **EA r20:** coverage comes from document shapes and sprite boxes at default zoom. Brightness is measured against luma 128, or against the dimmed luma during a dim. Loops are expanded over 1000 ms plus one period. @2 must give exactly @1's result on @1 docs, and **@1 stays frozen**.
- **Same output, same rules for old documents.** On any document without §2.10.2 fields, @2 gives exactly the @1 result. That's a QA acceptance test, run on the 10 `btf-*` looks and on `te-astrologer-awakening` (1 start, no `flashRisk`). @2 adds:
  - **circle flash:** coverage = π(`flash_radius` × T)² / (390 × 844), where T = tile px at default zoom (the largest of `settings.tileSize` and any `map.tile` in the closure). `"screen"` = 100%, as @1. Clipping at the screen edge is ignored (conservative). `anchor: "screen"` doesn't change coverage.
  - **rings:** the annulus `wave_from`…`wave_radius` with `wave_thickness_px` (A-T3); normally 0.
  - **blank:** never a flash start; steps that resume after it count normally (§2.10.2.4).
  - **hit-stop:** never a start; times use freeze 0 (§2.10.2.5).
  - **smear:** (sweep / 360) × π × outer², with outer = `smear_tiles` × T (auto = path length capped at 8), inner taken as 0 (conservative), and the sweep from the step's path (A-T5). The colour is `tint_to` if `tint_on`, else assumed white (worst case).
  - **hit-white:** the sprite box rule in §2.10.2.7.
  - **shine:** §2.10.2.8, every loop counted.
  - **Loops:** counted every time; an endless loop is expanded over a 1000 ms window plus one period (A-T4).
- **Inputs outside the effect doc are numbers, never images:** T and the unit sprite boxes come from the project (settings, maps, asset meta). The Render's `flashInput` (profile-format §9.0) must carry them so the hub server can recompute.
- **Hub:** listings stamped `te-flash@1` are re-derived with @2 by the existing rule ("re-derived when the detector version changes", profile-format §9.0). Any client-sent copy is still ignored. `te-flash@1` stays frozen: its rules never change, and the id is never reused.
- Never stored on the effect, never a block, no maker cap (unchanged).

#### 2.10.2.11 Reader aliases (EUX's draft names; writers never emit them)
| Read | As |
|---|---|
| `flash_center` `"hit"` / `"caster"` / `"screen"` | `anchor` `"target"` / `"caster"` / `"screen"` |
| `radius_from` (tiles) | `wave_from` |
| `radius_to` (tiles) | `wave_radius` |
| `ring_thickness_px` | `wave_thickness_px` |
| step `ease` `"fast-out"` / `"linear"` | `look_ease` `"out"` / `"linear"` |
| `blank_at` `"hit"` / `"step-start"` | `start_mode` `"at-hit"` / `"with-last"` |
| `smear_remnant: true` / `false` (no `smear_remnant_ms`) | `smear_remnant_ms` 40 / 0 |
| `start_mode: "at-time"` with a `start_at_ms` equal to the hit time | **not** rewritten: kept as `"at-time"` (it may be intended) |

#### 2.10.2.12 Booth, clash check, `ui_derived`, CEO questions and core-types candidates
- **Booth:** `toSkillSpec` still keeps only the first 6 steps and drops the v2 kinds and fields. It also drops every §2.10.2 field and the effect knobs `hit_stop_ms`/`hit_white_*`. `boothDropsV2` reads: "The booth can't show stage dim, stamps, particles, flashes, blend, layers, overlap or Feel tricks; they were left out."
- **Clash check** (catalogue rev 22 and the data docs): none of `flash_shape`, `flash_radius`, `wave_from`, `wave_thickness_px`, `blank_ms`, `hit_stop_ms`, `smear_ms`, `smear_remnant_ms`, `smear_tiles`, `hit_white_ms`, `hit_white_target`, `hit_white_mode`, `shine_ms`, `shine_style`, `shine_loop_rest_ms`, `shine_angle`, `shine_on`, `blast-star`, `te-explosion`, `te-pickup-sparkle`, `"at-hit"` or `anchor: "screen"` exists today. Rejected on purpose: a step-level `ease` (clashes with the effect knob `ease`), `flash_center` (duplicates `anchor`), `radius_from`/`radius_to` (duplicate the wave fields), `blank_at` (duplicates `start_mode`), and `smear_remnant` (duplicates `smear_remnant_ms`).
- **`ui_derived` toggles** (never stored): Impact flash (§2.10.2.2), Shockwave (§2.10.2.3), Blank punch (any enabled step with `blank_ms` > 0), Hit-stop (`hit_stop_ms` > 0), Smear (`smear_ms` > 0), Hit-white (`hit_white_ms` > 0), Shine (`shine_ms` > 0). Off writes 0 or `enabled: false`; nothing tuned is deleted.
- **CEO questions (F1–F3): all DECIDED as recommended (CEO 2026-11-12 16:43 via the CoS).** F1 yes; F2 keep 3 tiles; F3 yes, capped at 150, view only. The questions as asked: **F1:** is `blast-star` a sixth engine stock picture under E3? Recommended: yes. **F2:** keep the default disc at 3 tiles, which is 2 flash starts on 64 px tiles (Mobile/Both, never trips alone), or use 2 tiles (0 starts at 64 px)? Recommended: keep 3. **F3:** may hit-stop play in timed/RTS modes, where a frozen unit's drawing lags its real state by up to 150 ms (A-T1 caveat)? Recommended: yes, capped at 150, view only.
- **EA confirmed (r20)** all five points: `"at-hit"` and its cycle rule; the blank's scope; ring growth time; hit-stop on view time; and the @2 inputs (T, sprite boxes). The additions are written in §2.10.2.1/3/4/5/10.
- **Core-types candidates, CN only, not staged** (r20: they **wait until after H2**, then a new CN through the EA, with the sha to QA):
  - **CN-E2 amend:** `StartMode` += `"at-hit"`; an anchor union += `"screen"`; new unions `FlashShape`, `ShineStyle`, `FeelTarget` (`"stamp"|"target"|"caster"`), `HitWhiteMode`.
  - **CN-E3 amend:** detector id `"te-flash@1" | "te-flash@2"`.
  - **CN-E5 amend:** `FxPictureId` += `"blast-star"`; the step picture admits `"none"`.

### 2.10.3 Effects v2 step 33: sync, depth, light, colour, feel and particles (r23; r24 §2.10.3.5; CN-014 33a, CN-015 33b **ACCEPTED** (EA confirmed all 7 DSK rulings, 2026-11-14 02:2x), CN-017 33b-3 particles)
**Sources:** UX `ux/effects-sprite-sync.md` (sha256 `4e72b97e…`) §9 (fields) and §10 (EA answers 18:33); CEO 2026-11-13 18:35 via the EA (Q1 shake back at 1–3 px, HUD never shakes, players get Off/Low/Full; Q2 effect pixels match the sprite pixel size by default; Q3 Basic colours from palette ramps only; Q4 the target shivers 1 px during hit-stop). This is the only home for these effect fields; the schema stays in the catalogue `effect` behaviour, so every row is **request L48** (§12.5; shipped in catalogue rev 23, adopted r28, §12.4j). Clip fields (`events`, `points`) and the recipe joint tag live in project-format §6.2 (r35), and player keys in profile-format §3.3 (r14).

**The §2.10.1 rules hold.** Every field is optional and its absent value is exactly today's behaviour: the 10 `btf-*` looks and every r20 preset stay byte-identical (UX test A5). No version bump, no migration, no rewrite. Warn, don't block: the only hard error stays `invalidValue` on a wrong type (H2); ranges clamp at use with the stored value kept; an unknown picker value plays as the default with the existing unknown-option warning (as `start_mode`). Where the CEO's default differs from today's, **absent keeps today's behaviour and the editor writes the new default into new documents and new steps** (rule N below).

**Rule N (new-document defaults; r27 M3 provenance).** "New docs get X" means the editor writes X into a **blank** new effect document (its knobs) and into each **newly added** step (that step's item only). It's written as an ordinary value in the same op as the create or add (`source: "user"` for a knob, a plain field in the new step item), with the op `note: "new-doc"`. It is never a reader default, so an old document reads exactly as before. **Rule N never overwrites values that came from a preset:** a document started from a `btf-*` or `te-*` look ("Make my own from …") keeps the preset's answers as they are (`source: "preset"`, `presetRef`), so "Reset to preset", the preset diff and the changed hint survive; a preset can carry these values itself. A step the maker adds later to such a document gets Rule N in its own new item only, and no other item or knob is touched. Fields with rule N: `pixel_scale` → `"match-sprite"` (CEO Q2), `tint_snap` → `"ramp"`, `outline` → `"auto"`, and `lit` → the stock picture's default.

#### 2.10.3.1 Sync and depth (CN-014, step 33a)
| Field | Home | Type | Range / options | Absent means | Notes and warnings |
|---|---|---|---|---|---|
| `start_on` | effect knob | picker | `"cast"` \| `"release"` \| `"contact"` | `"cast"` (today: the effect starts when the ability starts) | `release` / `contact` start the whole effect at that event's time on the caster's playing clip (stored or derived events, project-format §6.2). A caster with no clip (stand-in token) starts at `cast`, silently. Step `start_mode`s stay relative to the effect start; `connect`, `"at-hit"` and the 150 ms shockwave minimum are unchanged |
| `anchor_point` | `steps` item, all kinds except `dim` | picker | `"tile"` \| `"foot"` \| `"centre"` \| `"head"` \| `"hand"` \| `"tip"` | `"tile"` (today's tile placement) | Picks a point on the current frame of the unit chosen by the existing `anchor` (`caster` / `target`). `foot` = the sprite's AssetMeta `anchor` (one source; there is no stored `foot` point). `hand` / `tip` with no point on that frame fall back to `centre`. Ignored silently with `anchor: "screen"`. Named `anchor_point`, not `anchor` (taken by the unit pick) |
| `attach` | `steps` item, all kinds except `dim` | picker | `"spawn"` \| `"follow"` | `"spawn"` (today: placed once at step start) | `follow` re-reads the anchor every tick, including the unit's move offset; it freezes during hit-stop with the unit |
| `detach` | `steps` item | picker | `"end"` \| `"hit"` | `"end"` | `hit` lets a `follow` piece let go at `hitAt` and carry on as a spawn. Kept and ignored silently with `attach: "spawn"` |
| `draw_layer` (extends §2.10.1.3) | `steps` item | picker | += `"behind-unit"` \| `"front-unit"` | `"air"` (unchanged) | Joins the standing band at the anchor unit's sort key, behind / in front (EA §10.4). With `anchor: "screen"` or no anchor unit it plays as `"air"`, silently. Older readers see an unknown option and play `"air"` |
| `depth_by_facing` | `steps` item | toggle | — | `true` | Only on `"front-unit"`: it draws as `"behind-unit"` while the anchor unit faces N. Kept and ignored on any other layer. It can't change an old document, because `"front-unit"` is new |
| `lit` | `steps` item | picker | `"self"` \| `"scene"` | **`"self"`** (today: pieces are fully lit / punched out of the darkness) | `scene`: ground and standing-band pieces are darkened like the ground; `scene` in air uses the paired moonlit picture via `createMoonlit()`, else one stepped alpha sampled at the anchor cell (EA §10.5). **Rule N:** the editor writes the stock picture's default on step creation or picture change (`scene` for `smoke`, `dust`, `rock`; `self` otherwise) |

- **64 refusal, one code (EA §10.1).** `readFxOrder` refuses the effect block with the existing **`fxTooManyFrames`** (r25) when it holds more than 64 steps **or** when a picture strip it plays has more than 64 frames. The refusal detail names the subject: `{subject: "steps" | "strip", count, limit: 64, assetId?}` (`assetId` for a strip). Refused, **never truncated**; the effect plays as `"none"` (the game's own drawing) and every file is kept untouched. The editor stops adding steps at 64 and won't pick a strip over 64 frames as an effect picture. This is not `motionTooLarge` (CN-012's motion atlas) and not the 12-step play cap (`overCap`).
- **Runtime only, never stored:** `hitAt` (EA §10.2; first rule that applies: the effect's hit offset, the clip's `contact`, the lunge peak, the cast start), the emitted events (`clip:event{name}`, `fx:start`, `fx:release`, `fx:hit`, `fx:end`, `fx:loop`), the crossing rule, the mirrored point `x' = fw − 1 − x`, the bands (`fxGround`, standing-band fx entries, `flash`) and the pose grid. **`keepInDim` and `fullyDark` stay runtime-only.**

#### 2.10.3.2 Light, colour and feel (CN-015, step 33b)
| Field | Home | Type | Range / options | Absent means | Notes and warnings |
|---|---|---|---|---|---|
| `light_mode` | `steps` item, all kinds except `dim` | picker | `"off"` \| `"steady"` \| `"pop"` | `"off"` (today: effects add no light) | Feeds the step 31 light plan. **Named `light_mode`, not `light`** (a paint style's `light` is shading direction, AssetMeta has `lightSource`) **nor `glow`** (the step's `glow_on` / `glow_from` / `glow_to` already mean the picture's glow look). UX's draft `light` is a reader alias (§2.10.3.3). At most **2** lit steps per effect: steps 3+ are kept and their light isn't drawn, warning **`fxLightsOverCap`** (once per effect) |
| `light_radius` | `steps` item | slider, tiles | **0.5–6**, step 0.5 | 2 | Tiles, like `flash_radius` (not art px like `lightSource.radius`). Kept and ignored with `light_mode: "off"` |
| `light_ramp` | `steps` item | picker | a ramp key: `"grass"` \| `"dirt"` \| `"stone"` \| `"rock"` \| `"water"` \| `"bloom"`; r27 effect ramps `"fire"` \| `"frost"` \| `"holy"` \| `"venom"` (effect-ramps CN) | the step's `tint_ramp`, else the effect's, else the `lightSource` default colour `"#ffb048"` | The light colour is that ramp's lightest step. No colour field (the runtime `Light.colour` is set from this). A stored `null` reads exactly as absent (r28); writers emit absent |
| `tint_ramp` | effect knob **and** `steps` item (the step's wins) | picker | a ramp key, as `light_ramp` | today's hex tint (`tint_on` / `tint_from` / `tint_to`, `impact_colour`) | Ramp-mapped tint stepped through the ramp over time (palette closure). When set, the hex `tint_*` fields are kept and ignored (one live source); Advanced "Any colour" clears `tint_ramp`. Basic offers ramps only (CEO Q3). Knob: no default (absent = today's behaviour). Step item: a stored `null` reads exactly as absent (r28); writers emit absent |
| `tint_snap` | `steps` item | picker | `"ramp"` \| `"rgb"` | **`"rgb"`** (today) | `ramp` snaps every tinted pixel to the nearest colour of the resolved ramp (or of the style palette when there's no `tint_ramp`). **Rule N:** new steps get `"ramp"` |
| `pixel_scale` | effect knob | **nullable** picker (r27, M2; the L30 pattern, default `null`) | `"match-sprite"` \| JSON int 1–6 (`"1"`–`"6"` read as aliases) | **today's `k` rule** (rev 11 `scale_snap` draw rule, §12 confirmations); `null` means the same | **The rule (r27, M2; EA G2b item 10 word for word):** `pixel_scale` absent or `null` = today's `k` rule; `"match-sprite"` = the anchor unit's sprite pixel size; a JSON integer 1–6 = that pixel size; the strings `"1"`–`"6"` are read as aliases of the integers and rewritten to integers on edit (M6); anything else (0, 7, 2.5, other strings) warns once (`outOfRange` for a number, the unknown-option warning for a string, per M5) and plays as the `k` rule. Absent/`null` and `"match-sprite"` are distinct. **Absent keeps today's scale for old documents; the editor writes `"match-sprite"` into new documents (CEO Q2, rule N).** `match-sprite`: effect pixels are drawn at the anchor unit's sprite pixel size (its native scale at the current zoom); with no sprite it falls back to today's `k` rule. An int is screen px per art px at default zoom. The stored value is kept (only an alias is rewritten, and only on edit). A wrong JS type (`true`, an object, an array) stays H2 `invalidValue`. Works with `scale_*` / `scale_snap` unchanged: those size the piece, this sizes its pixels |
| `outline` | `steps` item | picker | `"auto"` \| `"on"` \| `"off"` | **`"off"`** (today) | 1 art px outline in the resolved ramp's darkest step (no colour field). `auto` = the engine's rule (EA). **Rule N:** new steps get `"auto"` |
| `shake` | effect knob | int, art px | **0–3** | **0 = no shake** (today) | **Reconciled to the CEO's 1–3 px (Q1):** UX's 0–4 scale is narrowed to 0–3; there is no 4. A stored 4 (or any value above 3) plays as 3, a negative as 0, with **`outOfRange`**; the stored value is never rewritten. Shake moves the world camera only; **the HUD, editor UI and Effect Designer controls never shake.** View-time only (never camera state, rules or log), whole art px, no rotation, trauma clamped at 1, never counted as a flash. The Feel toggle writes 1 |
| `shake_ms` | effect knob | int ms | **80–400** | by strength: 120 / 200 / 300 for 1 / 2 / 3 | Clamped at use, value kept (`outOfRange`). Kept and ignored with `shake: 0`. No default (absent = today's behaviour) (r28) |
| `shake_dir` | effect knob | picker | `"hit"` \| `"none"` | `"hit"` | `hit` biases the first sample from caster to target |
| `hit_white_mode` (extends §2.10.2.7) | effect knob | picker | += `"bright"` | `"white"` (unchanged) | `bright`: each pixel moves 2 steps up its own ramp (clamped at the lightest); a pixel not on any ramp draws as `"white"` would. Older readers see an unknown option and play `"white"` |
| `squash` | effect knob | toggle | — | `false` (today) | At `hitAt`: one 60 ms frame on the target, 2 px wider and 2 px shorter, bottom anchored, nearest-resampled at art res. Skipped under reduced motion |

- **Hit-stop jitter: a rule, not a field (CEO Q4).** Whenever the effective `hit_stop_ms` > 0, the victim alternates ±1 art px horizontally every 30 ms while frozen; the attacker and the effect stay still; off under reduced motion. There's **no `hit_stop_jitter` field**: "on whenever hit-stop is on" leaves nothing to store, and an opt-out would contradict the CEO's answer. A stored `hit_stop_jitter` answer (UX draft name) is an extra key: it's kept in `orphans` by the existing rule (§7 "`answers` keys = live knob ids", on load) and never read. If UX later needs an opt-out, it's a later additive CN (`false` only). Not to be confused with the existing step field `jitter`.
- **Player side (profile-format r14 §3.3):** `screen_shake` `off` | `low` | `full` (default `full`; `low`: 0 stays 0, otherwise max(1, floor(px / 2)); reduced motion forces `off`). **`graphics: normal | lite` is not a new key:** it reuses the core `graphics` setting (`low` = Lite). Lite is decided once, when the effect starts (EA).
- **Ramp resolution (`tint_ramp`, `light_ramp`, `tint_snap`, `outline`, `bright`).** Ramp keys resolve against the project's `settings.paintStyleDefault` (absent → `btf-ashroad@2`), the same pinned style the wizard uses, so Preview equals the game on every stage. A key the resolved style doesn't have, or an unresolvable style, warns **`fxRampMissing`** once per effect and that field plays as absent (today's hex tint, or `"#ffb048"` for a light). Pinned styles are never edited. **Effect ramps (r27, **CN-019** (`CN-019-effect-ramps-format.md`), ACCEPTED (EA 2026-11-15 06:31)):** `fire`, `frost`, `holy` and `venom` are optional palette `ramps` keys (project-format §6.2.5) and resolve exactly like the six terrain keys. A style version without them (every published version today, `btf-ashroad@2` included) gives `fxRampMissing` and the field plays as absent.
- **Catalogue defaults and `null` (r28; gaps.md §29 item 2; catalogue rev 23).** Each field keeps one meaning, with no second way to say absent:
  - **`pixel_scale` is the only field here where `null` is part of the stored contract** (a nullable picker, §2.9.4): absent and `null` mean the same, and the editor may write `null`.
  - The step items **`light_ramp`** and **`tint_ramp`** are nullable in the catalogue with default `null`. That's reader tolerance only: a stored `null` reads **exactly as absent** (the step inherits: `tint_ramp` from the effect's `tint_ramp`, `light_ramp` by the chain in its row, else today's behaviour). The editor writes absent, never `null`, so clearing a ramp removes the field.
  - The knobs **`tint_ramp`** and **`shake_ms`** have **no default (absent = today's behaviour)**: today's hex tint, and the by-strength length of 120 / 200 / 300 ms. The catalogue marks them with `no_default_reason`. At drift they get no answer, so the key stays absent (§8.2 step 5).
  - This covers the step 33 fields only. The other nullable fields in this format (`team_colour`, `steps[].picture`, `reel_land`, `smear_tiles`, the deck ref) are unchanged.
- **Detector `te-flash@3` (EA §10.6).** @3 = @2 plus one rule: a `light_mode: "pop"` step counts as one flash start at its pop when its coverage π(`light_radius` × T)² / (390 × 844) ≥ 25% (≈ 2.5 tiles at 64 px) (exact threshold ≈2.53 tiles, so 3 tiles is the first allowed half-tile radius). Steady lights and shake never count; `bright` hit-white counts like `white` (conservative, §2.10.2.7 sprite box rule). @3 gives exactly @2's result on every document without a pop light or `bright`. **`te-flash@2` and `te-flash@1` stay frozen**: pinned versions are never edited and ids are never reused. Derived, never stored, so nothing migrates (project-format §6.7, profile-format §9.0).
- **Runtime only, never stored:** `keepInDim`, `fullyDark`, `Light.colour` (set from `light_ramp`), the pose grid (30 ms, lite 60), lite selection, rotation buckets, the `clip_cues` suppression when `hit_white_ms` > 0, and the stacking rule (max, then cap; never add).

#### 2.10.3.3 Reader aliases (UX draft names; writers never emit them)
| Read | As |
|---|---|
| step `light` `"off"` / `"steady"` / `"pop"` | `light_mode` (only on effect steps; when both are present `light_mode` wins and `light` is kept and ignored silently) |
| `hit_stop_jitter` | not read: kept in `orphans` (a rule, not a field) |
| `pixel_scale` `"1"`–`"6"` (strings, r27 M2) | the integers 1–6 |

On edit, writers normalise these to the canonical name and value (r27, M6; §2.10.1.8).

#### 2.10.3.4 Booth, clash check and core-types candidates
- **Booth:** `toSkillSpec` drops every §2.10.3 field; `boothDropsV2` gains "sync, depth, light, ramp colours, pixel size, outline or shake".
- **Clash check** (catalogue rev 22 and the data docs): none of `start_on`, `anchor_point`, `attach`, `detach`, `depth_by_facing`, `lit`, `light_mode`, `light_radius`, `light_ramp`, `tint_ramp`, `tint_snap`, `pixel_scale`, `outline`, `shake`, `shake_ms`, `shake_dir`, `squash`, `screen_shake` exists today. Rejected on purpose: bare `light` (paint style `light`), `glow` / `glow_radius` / `glow_ramp` (the step's `glow_*` fields), a stored `foot` point (AssetMeta `anchor`), `hit_stop_jitter` (a rule) and a new player `graphics: normal | lite` key (duplicates core `graphics`).
- **Core-types candidates, CN only, not staged** (they wait until after H2, then a new CN through the EA, with the sha to QA): **CN-E2 amend** `HitWhiteMode` += `"bright"`; new unions `StartOn`, `AnchorPoint`, `FxDrawLayer` (+ `"behind-unit"` / `"front-unit"`), `FxLit`, `FxLightMode`; **CN-E3 amend** detector `"te-flash@3"`. The `particles` kind and `ParticleMotion` already sit on the CN-E2 unions batch (§2.10.1.9). core-types `61fad786` holds none of these today, so step 33 needs no core-types change.

#### 2.10.3.5 Particles (CN-017, step 33b-3; ACCEPTED 2026-11-14 02:29)
The `particles` kind and its fields were already ACCEPTED in §2.10.1.3 (r17). This subsection is the 33b-3 format source the EA asked for: it tightens the per-effect cap and does not invent a second kind or a second set of fields. `te-flash@2` and `@1` stay frozen (pinned detector docs are never edited; they never contained these cap rules). New recipes that need these fields go with `te-flash@3`.

| Field | Home | Type / range | Absent means | Warnings |
|---|---|---|---|---|
| `particle_motion` | `particles` step | `"burst"` \| `"attract"` \| `"spiral-in"` \| `"rise"` | `"burst"` | unknown plays as `"burst"` with `outOfRange` (no separate unknown-enum code; same rule as `start_mode`) |
| `particle_count` | `particles` step | int **0–48**, default 12, step 1 | 12 | Per-step out of range clamps with `outOfRange` (kept). **48 is per effect**, summed across all its `particles` steps: over that, later steps are cut down at load in step order and **`fxParticlesOverCap` {count, limit: 48}** fires once (`count` is the pre-cut sum; supersedes r17 `particlesOverSoftCap`). **32 is an editor note only** ("may slow some phones"), never a format cap or warning |
| `particle_life_ms` | `particles` step | int ms **200–3000**, default 800 | 800 | `outOfRange`. Draft name `particle_life` is a reader alias (§2.10.1.8); writers emit `particle_life_ms` |
| `particle_pull` | `particles` step | int per-mille **0–2000**, default 1000, stored step 100 (UI 0–2, default 1, step 0.1) | 1000 | `outOfRange`. The r17 stored form is kept, so a stored 1000 still means 1 and nothing migrates. Only read by `attract` and `spiral-in`; ignored silently otherwise |

- **Reused, not duplicated:** `anchor`, `jitter`, `start_spread`, `size_spread`, `picture`. The old `impact` / `sparks` / `impact_radius` burst is unchanged, so BTF looks do not move.
- **Runtime only, never stored:** one shared on-screen pool of **96**, oldest dropped first, so QA's ceiling of 128 can never be reached; positions are clock-based from a derived seeded visual-random stream (plan §13.3); `reduce_motion` skips particle motion (start and end stills only — the player setting in profile-format §3.3; effect documents never store it).
- **Booth:** `toSkillSpec` already drops `particles` steps (`boothDropsV2`, §2.10.1.1).
- **Core-types:** the `particles` kind joins the post-H2 CN-E2 unions batch; no core-types change in this CN (`61fad786`). (r27: later typed in CN-018, core-types `d6d08696`, ACCEPTED 2026-11-14, which lands with 33b-3.)

---

### 2.11 Ability composition: `modifiers[]` (r13; G2; **SIGNED OFF by the Engine Architect**, 22:1x; corrected r14)
**Where abilities live today:** an ability is **one ability-owner setup** (§2.9.5). That's a `behaviour-setup` document whose `behaviourId` is the owner, and whose answers hold its targeting knobs, `ability_group`, `effect` and `mana_cost` (`cost` / `focus_cost` on three owners, rev 13). Rules lists reference it **by setup id**. spec.ts `SkillSpec` is the effect's look (`effect` documents, §2.10). It has no composition field, so nothing is reused from there. Today a hit plus a rider spans two owners with no link (coverage G2: Heavenly Sword = **`sky-drop`** + `push-knockback` (r14 fix: castHeavenCard() L859 drops a sword on the foe; it isn't `line-shot`); Divine Retribution = `sky-drop` + `ability-refresh`; Stronger Together = `buffer-firer` + `adjacency-synergy`).

**Shape:** the primary's setup gains an optional **`modifiers: {setupId, role: "scaler" | "rider"}[]`**, default `[]`.
- **`setupId`, not a behaviour id with inline answers.** The primary is stored as a setup and referenced by setup id, so a modifier is referenced the same way. Each modifier's answers then get drift, presets, checks, Godmode and history for free. Inline answers would be a second home for knob values, with none of that machinery. The name reuses `setupId` (rules, `unit.setupIds`).
- **Execution order:** all **scalers** (in list order), then the **primary**, then all **riders** (in list order).
- **The primary owns group, effect and cost, and the targeting pipe** (r14 correction, Engine Architect). The tags are the catalogue's knob field **`ability_field`**: `targeting` | `group` | `effect` | `cost` (L37, shipped in rev 14).
  - **On every modifier**, answers tagged `group`, `effect` or `cost` are **ignored**.
  - **On scalers only**, answers tagged `targeting` are **ignored** too. A scaler never targets.
  - **Riders keep their `targeting` knobs**, **re-anchored**: the origin is the primary's **resolved target(s)**, not the caster. For example, Heavenly Sword's push rider aims away from the unit the sword hit.
  - An ignored `source: "user"` answer gets the warning **`modifierFieldIgnored`**, and it's kept (R4). Ignored defaults are silent.
- **Catalogue metadata (rev 14; the Librarian's names, adopted; catalogue only, never stored in a setup):**
  - **`composable_as`**: a behaviour may be `primary` / `scaler` / `rider` / **`trigger`** (rev 15: auto-cast; a trigger is never a primary, and its use is mode-scoped). A modifier whose role isn't in its behaviour's `composable_as` gets a warning, and it's skipped.
  - **`target_pipes`**: `unit` and/or `tile`, the first being the default. **No pipe (rev 15, superseding rev 14's `target_pipes: none`):** `target_pipes: []` plus the behaviour field **`targeting: "none"`**.
    - That's an instant cast: the state flow **skips targeting** (CHOOSE_ACTION goes straight to resolve), the resolve context gets the caster only, and any location **defaults to the caster's cell** (Engine Architect).
    - Riders on a no-pipe primary anchor on the caster. Self-target is the UNIT pipe with the caster.
    - The 9 no-pipe primaries are `mana-gain`, `special-meter`, `radial-volley`, `random-strikes`, `cone-sweep`, `orbit-ring`, `trap-tile`, `reveal-intent` and `reveal-hand`.
  - **`numeric_inputs`**: the primary's sliders that scalers may change.
  - **`adjusts`**: the inputs a scaler changes. A scaler that adjusts none of its primary's `numeric_inputs` gets a warning, and it has no effect.
  - The catalogue's `compositions[]` are reference mappings at **behaviour** level (`modifiers[].behaviourId`), because the catalogue has no setups. When the editor instantiates one, it creates one setup per behaviour and writes their **`setupId`**s. **There's no second field in documents.**
- **Soft cap 4:** above 4 is the warning `modifiersOverCap`, and all of them still run. Never a block.
- **Signed-off rules (Engine Architect, 22:1x):**
  1. **Modifiers are flat.** A modifier's own `modifiers` are ignored, with the warning **`nestedModifierIgnored`**.
  2. **A self-reference** (a `setupId` equal to the primary's id) **or a cycle back to the primary** (a modifier whose own `modifiers` name the primary) is **`invalidValue`**.
     - **Checked against the 6 hard errors:** `invalidValue` on an active answer is already **H2** (project-format §13), so it adds no seventh class, and H1–H6 stay at 6.
     - It's refused on edit, so only a hand-edited file can carry one.
     - Kept as hard (H2), not demoted to a warning.
  3. **A missing `setupId`** gives the warning **`unknownRef`**, and the ability runs without that modifier.
- **Other checks** (warnings):
  - a modifier that is an effect document (skipped);
  - a modifier setup that's also in `rules` (`modifierAlsoRule`: it also runs on its own).
- **Closure:** a primary in the closure brings its modifier setups (project-format r13 §7.2 step 3). The "≤ 1 setup per behaviour in `rules`" rule doesn't apply to modifiers, so two abilities can each have their own `push-knockback` rider setup.
- **No migration and no version bump:** `modifiers` is optional, and absent/`[]` is today's behaviour (`behaviour-setup` stays v3). Writers keep unknown keys (project-format §2).

Example (catalogue rev 15; corrected r14), Heavenly Sword: the primary is **`sky-drop`** (castHeavenCard() L859; SWORD_DMG 2, SWORD_COST 2), with a `push-knockback` **rider** (knockBack() L1260, knock 1). The rider setup is an ordinary `push-knockback` setup. Its `mana_cost`/`ability_group`/`effect` are ignored, and its push is re-anchored on the unit the sword hit.
```json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JCB1H3V5N7S9W1D3S5W7O9RD",
  "rev": 3,
  "name": "Heavenly Sword",
  "behaviourId": "sky-drop",
  "catalogue": {"rev": 15},
  "createdAt": "2026-11-09T22:00:00Z",
  "updatedAt": "2026-11-09T22:14:00Z",
  "copiedFrom": null,
  "answers": {
    "range": {"source": "default", "value": 2, "rev": 1, "defaultRef": {"rev": 1}, "needsReask": null},
    "base_damage": {"source": "user", "value": 2, "rev": 1, "defaultRef": {"rev": 1}, "needsReask": null},
    "mana_cost": {"source": "user", "value": 2, "rev": 1, "defaultRef": {"rev": 1}, "needsReask": null},
    "ability_group": {"source": "default", "value": "spells", "rev": 1, "defaultRef": {"rev": 1}, "needsReask": null},
    "effect": {"source": "default", "value": "none", "rev": 1, "defaultRef": {"rev": 1}, "needsReask": null}
  },
  "modifiers": [
    {"setupId": "setup_01JCB1K4N0CK8ACK1R1DER0001", "role": "rider"}
  ],
  "orphans": {},
  "history": {"cap": 200, "baseSeq": 0, "ops": []}
}
```

---

## 3. Dependency model

Edges are read only from the catalogue's `knobs[].depends_on`. It includes every ban `$ref` edge and every gate leaf.

| Form | Meaning | Example (rev 7) |
|---|---|---|
| `"knobId"` | A knob in the same behaviour | `mana-pool.start → cap` |
| `"behaviourId.knobId"` | A knob in another behaviour | `mana-gain.ability_cap → mana-pool.cap`; `hand-and-draw.deck → ability-presentation.shortcut` (gating, via `{gate}`; rev 14, was `deck_size`); `line-shot.ability_group → ability-presentation.custom_groups` (ref target); `slow-tiles.move_penalty → terrain.tile_types` |
| `"@behaviourId"` | That behaviour is enabled in the project (§2.6, project-format §5) | `action-budget.helper_unlocks_action → @summon-unit`, `line-shot.barrier_blocks → @barrier-line` |

Rules:
- **R1.** When a parent's effective value changes (for `@`: when the behaviour is enabled or disabled), flag every **active** child whose source is `user` or `preset` with `parentChanged`. Default children are not flagged. **Gating edges are skipped (§2.6).**
- **R2.** Bans are derived checks (§2.5), evaluated with inactive knobs treated as absent. Ops: `eq|ne|gt|gte|lt|lte`. Behaviour-level disables are reported by the project check.
- **R3.** A stored flag is cleared by set or resolve, by reset, or by undo of the op that raised it.
- **R4.** No rule ever deletes, clamps or snaps a stored value.
- **R1 for lists and refs.** A list parent "changes" when its effective value changes in a way the child can see: for a `ref` child, only when the item it names is removed or renamed (editing another item's fields doesn't flag it); for any other child (e.g. `trap-tile.damage → terrain.tile_types`), on any change. An effect document being deleted is a parent change for the `effect` answers that named it (§2.10).
- **R5.** Cross-behaviour and `@` parents are evaluated by the project. It calls `flagFromProject(setup, parentRef)`, which is logged as a `flag` op.

---

## 4. Undo history

```
history = { cap: 200, baseSeq: int, ops: Op[] }
Op = { seq, at, kind, changes: AnswerChange[], target?: seq, presetRef?, note?, group? }
kind ∈ "set" | "reset" | "resolve" | "preset" | "presetUpdate" | "flag" | "migrate" | "undo" | "redo"
AnswerChange = { knob, before: AnswerState, after: AnswerState }   // AnswerState = Answer minus rev
```
1. Append-only. Ops are only dropped by cap compaction.
2. One user action is one op, including the flags it raised or cleared.
3. `undo` reverts the newest undoable op that is not already undone, and appends `{kind:"undo", target}`.
4. `redo` is allowed only while no forward op has been appended since the last undo.
5. `migrate` ops are barriers. History before a barrier keeps its old knob ids and values. It is never rewritten by renames, and undo can't cross it.
6. Undo and redo bump the answer `rev` and the doc `rev`.
7. Cap 200. `baseSeq` advances when ops are dropped. History is never needed to load.
8. History is not exported by Render.
9. **Preview / Godmode save-back** writes exactly one op (`note: "preview"`) in the one document that holds the chosen layer: "All stages" → the setup (L1) or unit; "This stage" → the stage's override (`stage.overrides.setups[behaviourId][knobId]`, keyed by behaviour id) or `stage.overrides.units`. The layer table is project-format §7.1. (r8: restates the rule that §12.2 C2 and §11 cite.)
10. **Compound actions (r8; Effect Designer K-3, K-5, K-6).** One user action that writes several documents gives each document its own op as usual. All of those ops carry the same **`group: "grp_<ULID>"`**.
   - Undo or redo of any op in a group applies to **every op in that group**, newest document first, as **one undo entry**.
   - If one of those documents has a later, non-undone op, the group undo is refused with "changed since; undo there first". Nothing is half-undone.
   - The creation or deletion of a whole document in the group (Save & use, delete-and-switch, fork) is undone by restoring or removing that file (project-format §6.7).
9. **Godmode save-back** (project-format §7.1). Tweaks stay in memory in Preview. "Save" asks *what* (this setup's knob, the army knob, or this unit's stat) and *where* (all stages or this stage), then writes exactly one layer:
   - **All stages, setup or army knob:** `saveBackFromPreview(setup, tweaks)` writes **one** `set` op with `note:"preview"` covering all that setup's tweaked knobs. When the stage replaces this behaviour with its own setup (project-format §6.5 `rules`), this targets that stage setup instead.
   - **This stage, a knob of a project setup:** writes `stage.overrides.setups[behaviourId][knobId]`, one op in the stage's history. It applies on top of whichever setup wins on that stage.
   - **Unit stats:** `unit.stats` (all stages) or `stage.overrides.units` (this stage).
   - Values are written as tweaked. Warning checks show afterwards; they are never rejected (C4). Only `invalidValue` tweaks are refused, per knob, and returned in `skipped[]`.

---

## 5. Duplicate

`duplicate(doc, name?)` creates a new `id`, sets `copiedFrom`, sets `rev = 0` on the doc and every answer, and starts **an empty history**. Answers are copied as-is, including `presetRef` and `needsReask`. History is reset because undo in the copy would otherwise revert edits made before the copy existed; `copiedFrom` keeps the provenance.

---

## 6. Presets (`formatVersion: 2`)

### 6.1 Document

| Field | Type | Rule |
|---|---|---|
| `kind` | `"behaviour-preset"` | |
| `formatVersion` | `2` | Unchanged in r4. Presets store no flags, so migration 002 doesn't apply. |
| `id` | `preset_<ULID>` or `builtin:<behaviourId>/<id>` | The same id in the library and in project embeds |
| `rev` | int ≥ 1 | +1 per saved edit. For built-ins, the `catalogue_rev`. |
| `name` | 1–48 chars | Unique per `behaviourId` in the library |
| `behaviourId` | catalogue id | Rewritten by behaviour renames |
| `catalogue` | `{ rev }` | |
| `answers` | `Record<knobId, {value} \| {reset:true}>` | Partial. Keys and option values are rewritten by renames (§8.2). |
| `createdAt`, `updatedAt` | ISO UTC, or `null` for built-ins | |
| `builtin?` | `{deck, cards, status, source, notes?}` | Built-ins only (§6.4) |

The content hash is computed when needed, never stored: sha256 of canonical `{behaviourId, answers}` **after rename normalisation**. It is used only to detect a fork or a changed built-in.

### 6.2 Save, apply, update (D2)
- **savePreset(setup, name, knobs?)** writes rev 1 to the user library. By default it captures the non-default answers.
- **applyPreset(setup, preset, mode)** copies values (`overlay` by default, or `fillUnset`). Each written answer gets `source:"preset"` and `presetRef`. It is one `preset` op.
  - Entries with warning checks (out of range, off step) **are applied** and show their warning (C4).
  - Entries that fail `invalidValue`, or whose knob no longer exists, are skipped and returned in `skipped[]`.
  - It embeds `<id>@<rev>` in the project.
- **Changed hint:** `presetRef.presetRev <` the newest known rev of that preset id.
- **diffPreset(setup, preset)** returns `PresetDiffRow[]` (`same | differs | userOverrode | invalid`). **updateFromPreset(setup, preset, knobIds)** applies only the ticked rows, as one `presetUpdate` op.
- Editing a preset-sourced answer sets `source:"user"` and drops `presetRef`.
- **Presets are editor-only.** Render never ships them.

### 6.3 Storage (D5; web confirmed as OPFS)

| Platform | User library | Project embeds |
|---|---|---|
| Desktop | `<userData>/tileengine/presets/<presetId>.json` | `<project>/presets/<presetId>@<rev>.json` |
| Web | **OPFS** `tileengine/presets/<presetId>.json` (one storage API for projects and presets, ARCH C8) | the project's OPFS directory |
| Android / iOS | `Directory.Data/tileengine/presets/<presetId>.json` | the project's app-files directory |

- The library holds the latest rev only. A project embeds every rev that a `presetRef` points to, and unreferenced revs are dropped on save.
- **Resolving a `presetRef`:** the embedded `<id>@<rev>` wins. If it is missing, use the library copy when its rev matches, and embed it. Otherwise keep the value and add a load notice.
- **Legacy:** the ui-shell's `localStorage` keys (`tileengine.presets.v1`, `tileengine.preset-library.v1`, `tileengine.preset-embed.v1`) are an **import source only** (project-format §12). Nothing writes to them.

| Library vs embedded | Load | Optional action |
|---|---|---|
| Library rev is newer | Embedded wins; the hint shows | Diff, then `updateFromPreset` |
| Embedded rev is newer | Embedded wins | "Add to my library" |
| Same rev, different hash | Embedded wins | "Save as new preset" |
| Not in the library | Embedded wins | "Add to my library" (same id) |

### 6.4 Built-in presets (catalogue `behaviours[].presets`)
They are read-only `behaviour-preset` documents generated from the catalogue. There is no second preset system.
- `id = "builtin:<behaviourId>/<id>"`, `name = label`, `answers = {k: {value: v}}` from `overrides`, `rev = catalogue_rev`, provenance in `builtin{}`.
- Apply, diff and update work as for user presets. Editing gives "Save as my preset".
- While the project's slice rev equals `presetRev`, a built-in is resolved **from the slice**. When the slice upgrades, every referenced built-in rev is first materialised as `presets/builtin~<behaviourId>~<id>@<rev>.json`.
- **Behaviour renames** rewrite the id: `builtin:card-recursion/btf-pride-in-numbers` → `builtin:ability-refresh/btf-pride-in-numbers`, in `presetRef.presetId` and in the materialised doc's `id`. The file name is kept.
- **Changed hint for built-ins** compares content hashes after rename normalisation. Example: `btf-card-hand` at rev 4 (`style: card-hand`, normalised to `shortcut: all-cards`) differs from rev 6 (`shortcut: custom`, `spells_style: card-hand`, …), so the hint shows (§10.7).

---

## 7. Validation of ops and documents

On every op and on save. Load never rejects; it reports. Value checks are the derived checks of §2.5, which skip inactive answers.

| Check | On op (edit, apply, save-back) | On load |
|---|---|---|
| `kind`, `id`, `behaviourId` present | — | Refuse the doc and report it |
| `answers` keys = live knob ids | Reject `unknownKnob` | Extra key: `renamed_from` or `orphans`. Missing knob: add a default answer (none for a knob with no catalogue default, §8.2 step 5). |
| `value` iff `source !== "default"`; `presetRef` iff `source === "preset"` | Enforced | Repair, with a `migrate` note |
| `invalidValue` (type, picker option, colour syntax, list item shape, reserved or duplicate item id) | **Reject** `invalidValue {type \| options \| colour \| item}` | Kept; derived hard check |
| Built-in list item renamed or deleted (§2.9.3) | **Reject** `readOnly {item}` | `reservedMissing` warning; effective value appends it |
| List over `max_items` / under `min_items` | Accept, with a warning (the editor's Add button stops at the cap) | Derived warning; never truncated |
| Slider range or step | **Accept**, return `warnings[]` (C4) | Derived warning |
| `ref` target exists | Accept, with a warning | Derived warning |
| Bans | Accept, with a warning | Derived warning |
| `catalogue.rev` = project `catalogueRev` | Enforced on save | Run drift (§8.2) |

- Accepted colours are stored lowercased (`spec.ts` `hex()`). Accepted numbers are rounded to the step's decimals, to remove float noise only.
- **D4 changed by C4:** off-step values used to be rejected on edit; now they are accepted with an `offStep` warning. The UI slider still emits on-grid values, so off-step values only come from files, presets or Godmode.

---

## 8. Migration

### 8.1 Format versions
Migrations live in **`packages/project-write/src/migrations/{setup,preset}/NNN-<slug>.ts`** (ARCH C1: writer only). Each is a pure, idempotent function `vN → vN+1` that logs one `migrate` op and has a fixture `test/fixtures/{setup,preset}/vN.json`. The read-only `@te/project` reader accepts only current versions (project-format §11.1).

- **001 `pin-revs` (v1 → v2)**, setups and presets: unchanged from r3. The pin becomes `{rev}`, `defaultRef` becomes `{rev}` via the legacy `kh1` hash, `comboIndex` becomes `banId`, and the hashes are deleted.
- **002 `derive-checks` (v2 → v3)**, setups only:
  1. Drop `needsReask` whose reason is `noDefault`, `outOfRange`, `offStep` or `bannedCombo`. These are now derived (§2.5).
  2. Keep `parentChanged`, `catalogueChanged` and `renamed`.
  3. In `history`, before/after states keep their old reasons. History is pre-barrier and is never re-read for checks.
  4. Log `migrate` with the note `"002 derive-checks"`.

### 8.2 Catalogue drift (`catalogue.rev < live catalogue_rev`)
Steps run in this order, in one pass, and produce one `migrate` op per document:

1. **Behaviour rename.** If `behaviourId` is in some live behaviour's `renamed_from`, rewrite `behaviourId`; then rewrite built-in preset ids (§6.4) and `Reask.by.behaviour`. Rev 5: `card-recursion → ability-refresh`, `bot-priority → bot-ability-priority`.
2. **Knob renames, looked up in the new behaviour.** For each answer key not live: find the live knob whose `renamed_from` contains it and re-key it, keeping `source`, `value`, `presetRef` and `rev+1`. This step runs after step 1, so **a knob rename inside a renamed behaviour** resolves naturally (`card-recursion.max_returns` → `ability-refresh.max_refreshes`, §10.6). Renames are scoped per behaviour: `card_cap → ability_cap` in both `mana-gain` and `self-cost` are two separate entries. Then rewrite `Reask.by.knob`.
3. **Option renames.** For picker answers with a `value`, if the value is not live and some live option's `renamed_from` contains it, rewrite the value. This applies to `user` and `preset` sources alike, so the user's choice is kept under the new name. **Option renames come from the catalogue's `options[].renamed_from` only.** The r3 fallback rule table is retired now that rev 5 ships the field.
4. **Retired knobs** (`retired_knobs[] {id, since_rev, reason}`) move to `orphans`. **Retired behaviours** open read-only.
5. **Added knobs** get default answers. **r28:** an added knob with no catalogue default (`no_default_reason`; rev 23 `effect.tint_ramp`, `effect.shake_ms`) gets no answer: its key stays absent, which is today's behaviour. (Rev 7 → 8 adds `team_colours`, the two wall knobs, `clip_cues`, `team_colour_override`/`team_colour`, `cue`, `tags`, and `ability_group` + `effect` on 2 owners, §12.4b. Rev 6 → 7 adds `custom_groups`, `one_unit_per_tile`, `tile_types`, the 22 `effect` knobs, and `ability_group` + `effect` on 37 owners: all `source:"default"`, no flags, no notice beyond "N new settings".)
6. **Default moves.** `knob.rev > defaultRef.rev`: default answers follow the new default and are listed in the defaults-moved notice. User and preset answers never change, and get `catalogueChanged`.
7. Set `defaultRef.rev = knob.rev` on every answer, and `catalogue.rev = live`.
8. **Flags:** the highest stored reason applies: `parentChanged > catalogueChanged > renamed`. A renamed answer whose knob `rev` also moved gets `catalogueChanged`, with the rename in `note`.

**List answers:** option renames (step 3) also apply to picker fields inside items, matched per field through the item spec's `options[].renamed_from` (none at rev 8).
- **Added item fields (r8):** a stored item missing a field reads it at the item spec `default`. Nothing is written. **When the only list-spec change since `defaultRef.rev` is added fields**, step 6 sets no `catalogueChanged`, because no stored value means anything different. A changed type, range, option set or default of an *existing* field still flags.
- **Conversions on retirement (r8 rule; live in rev 9, details and the no-loss guarantees in §10.13):** a `convert` carries the old answer's **source**, `presetRef` and converted value. A `fold` with the toggle on makes a default `into` answer explicit (`user`) whenever its old effective value ≠ the new default. With the toggle off, it resets `into` and stores any user value in `orphans.<toggle>.folded.previous`. The old answer always goes to `orphans` unchanged.
- **`derive` tombstones (rev 14; owner rule).** A `derive` retires a knob whose value is now **derived** from another (rev 14: `hand-and-draw.deck_size` → the sum of the chosen deck's `entries[].copies`).
  - **The format never wipes the answer.** The catalogue's `old_answer` is **`kept-inactive`** (rev 15, L39 adopted; rev 14 said `dropped-with-notice`). The old answer goes to **`orphans`** unchanged, like every retirement (step 4). There it's **kept as an inactive answer**:
    - still **visible** in the setup view ("Replaced by the deck's size");
    - still **read for the notice** (`deckSizeDerived`, which shows the old total next to the derived one);
    - **ignored by runtime and Render**.
  - Nothing is converted into a generated deck, because a total names no cards. We've asked the Librarian to rename the value to keep-inactive (L39).
- **Knob → project setting conversion: `unit-roster.one_unit_per_tile` → `settings.occupancy` (r14 in place; Engine Architect ruling; catalogue tombstone requested as L42).** `settings.occupancy` (project-format §3.1) is the **single source** of cell density. The knob is retired by a **convert** tombstone whose target is the project setting, not a knob.
  - **Value map:** `true` → `"strict1"`, `false` → `"softStack"`.
  - **Which answer converts:** the project-level `unit-roster` setup (the one in `project.rules`). If `settings.occupancy` is already set, the writer **leaves it alone**, and the conversion only records the orphan. With no setup, or a `default` answer (`true`), nothing is written, because absent = `strict1` already.
  - **Never wiped:** the old answer goes to `orphans.one_unit_per_tile` unchanged, as an **inactive answer** (visible, ignored by runtime), the same as `derive` (above).
  - **Stage overrides** (`stage.overrides.setups["unit-roster"].one_unit_per_tile`) and stage-rule setups can't map onto a project-wide setting. They're kept as stored, inactive, with the warning `occupancyStageValueIgnored` naming the stage. Nothing is dropped. **Occupancy is project-wide in v1. A per-stage occupancy override is FUTURE ONLY**: no field exists for it, and these kept values are what a future override would read.
  - The writer performs it in drift step 4 as **one op per touched document** (the setup's `migrate` op and a `project.json` `settings.occupancy` op), sharing a `group` (§4 rule 10), so one undo reverts both.
  - **The editor shows only the occupancy picker.** The orphan is listed under "Replaced settings".

  Example: a rev 14 project whose `unit-roster` setup had `one_unit_per_tile: false` (user), at the drift that carries the L42 tombstone:
```json
{
  "setups/setup_01JC9G1A2B3C4D5E6F7G8H9J0K.json": {
    "answers": {},
    "orphans": {
      "one_unit_per_tile": {
        "answer": {"source": "user", "value": false, "rev": 1, "defaultRef": {"rev": 7}, "needsReask": null},
        "removedAtRev": 15,
        "reason": "converted: settings.occupancy (L42)"
      }
    }
  },
  "project.json project.settings.occupancy": "softStack",
  "history ops (one group)": [
    {"doc": "setups/setup_01JC9G1A2B3C4D5E6F7G8H9J0K.json", "kind": "migrate", "group": "grp_01JCC0CC0PANCY0000000000001", "note": "one_unit_per_tile → settings.occupancy (kept inactive)"},
    {"doc": "project.json", "kind": "set", "group": "grp_01JCC0CC0PANCY0000000000001", "knob": "settings/occupancy", "before": null, "after": {"value": "softStack"}}
  ]
}
```
- **Item-level migration fields (catalogue rev 10; adopted under the Librarian's names).** These sit next to knob `renamed_from` (step 2) and knob tombstones (`retired_knobs` with `convert` / `fold`, step 4), one level down, on a `list` knob:
  - **`retired_item_fields[] {id, since_rev, reason, convert?: {to, map?: Record<oldValue, newValue>, points?: rule}}`** retires an **item field**. In step 4, for each stored item that has the field:
    - When `convert` is present, write `to` from `map[oldValue]`, and apply its `points` rule to that item's point fields.
    - Then drop the old field from the item. The whole old list is kept in the `migrate` op's `before`, and a user list also keeps an orphan copy (`orphans["<knob>#items"]`), so nothing is lost.
    - Rev 10: `steps[].points_anchor` → `anchor` (`board` → `caster`, with points shifted by the **legacy frame** below; `caster`/`target` unchanged).
  - **`value_converters[] {since_rev, fields, from, to, relative_to?, legacy_relative_to?, rule}`** rewrites stored item **values** whose shape changed. It runs after `retired_item_fields`, once, for answers whose `defaultRef.rev < since_rev`.
    - **`legacy_relative_to`** (rev 12; `{c, r}`; required whenever `relative_to` is set) is the frame legacy values were authored in when the document stored none. The catalogue validator pins it to the `relative_to` knob's default **at `since_rev`**, so a later default move can't change what old values mean.
    - **The L33 converter (rev 10, worded in rev 12):** `trace_points`, `bounce_points`, `reel_land`, `reel_tie`, `reel_links` go from `{c, r}` to `{dc, dr}` with `dc = c − F.c`, `dr = r − F.r`.
      - **Legacy absolute points convert relative to the effect's stored `booth_caster`, or `{0, 0}` if none was stored. They never convert relative to the current default.**
      - F is the answer `booth_caster` **stored in that document** before drift. A `default` answer resolves through `default_history` at its own `defaultRef.rev`, not at the live rev. Otherwise F = `legacy_relative_to` = `{c:0, r:0}` (spec.ts's 2×1 frame).
      - `booth_caster` didn't exist before rev 10, so a rev ≤ 9 document always uses `{0, 0}`. The `booth_caster` default answer that step 5 adds **after** the conversion is never used for it, so a 9 → 12 drift does not shift points by the new default's row.
  - **Flags:** a converted `user`/`preset` list gets `catalogueChanged` with the converter in `note`, because the shape changed even if the look didn't. `default` answers just follow.
  - Both are pure and idempotent, like every drift step: a converted item has no old field and is already `{dc, dr}`.
  - The same steps run on presets and on stage overrides of list knobs.
- **(r8 text)** **Conversions on retirement (r8, L28/L30):** a tombstone may carry `convert {to, from: "first-item-field", field}` (a one-item list → a scalar on another knob) or `fold {into, when_false: "reset"}` (a retired toggle folded into a nullable knob). They run in step 4, **before** the answer moves to `orphans`, and are logged in the same `migrate` op. The orphan keeps the original answer. Item ids are user data and are never renamed by drift; a retired reserved id just makes that item a user item (§2.9.3).

Every document that stores knob ids or option values gets the same steps 1–3:
- presets (library, embedded and materialised built-ins)
- `stage.overrides.setups[behaviourId][knobId]`: behaviour keys (step 1), knob keys (step 2) and option values (step 3)
- `unit.stats` keys (`unit-roster`; no renames so far)

Project-format §12 runs these in the slice upgrade, before any check. **Cross-behaviour gates, `depends_on`, bans and `event_map` follow renames automatically**, because they are read from the new slice and never stored in our documents. Notes anchors and `capture.godmode` are snapshots and are not rewritten; "changed since" and dangling checks resolve them through the rename map.

**Ban ids are opaque.** A ban keeps its id across renames (`mana-gain.card-cap-gt-mana-pool-cap` still names `card_cap`). Bans are derived checks now (§2.5), so no stored `banId` can dangle, and r3's L12 is withdrawn.

**Defaults-moved notice**, e.g. `Defaults moved: Starting mana 6 → 14, Can pull allies none → off.` Old values come from `default_history`. Renamed option values compare by their new names, because `default_history` stores current option values (SCHEMA.md rev 5), so a rename alone never shows as a moved default.

### 8.3 What bumps `knob.rev` (decision, r4)
The format uses `knob.rev` for exactly two things:
- (a) choosing which default answers follow a default move, plus the notice
- (b) raising `catalogueChanged` on user and preset answers, meaning "the meaning or the valid set of this value may have changed; re-check it".

Activity and readiness are **derived live** from the current slice (§2.5, §2.6), so they never need a drift signal.

**Decision:** bump `rev` when a change can alter what a stored value means or whether it is valid: `type`, `default`, `min`, `max`, `step`, the set of option values, list `item` fields, `reserved_ids`, `max_items`/`min_items`, `ref` targets, or a semantic change to what the knob does. (Rev 7 SCHEMA.md adopts this rule; no existing knob changed `rev` in the rev 7 pass.) **Do not bump** for `active_when`, behaviour gates, gating `depends_on` edges, `required`, `ask_in_wizard`, labels, `status`, `ruling`, `note` or `single_option_reason`.

Why not bump on gate changes:
- A gate change can't make a stored value wrong. It only changes whether the value is used, which is recomputed on every read anyway.
- A bump would put `catalogueChanged` on every user answer of a re-gated knob, which is noise: rev 6 re-gated 24 knobs.
- The rename of a gate's options (`card-hand → all-cards`) already moves through the gate knob's own rename path.

The Librarian's choice to keep `rev` is therefore right. Note that 11 of the 24 re-gated knobs are at rev 6 anyway; that is harmless if they had other changes, but per this rule don't bump for the gate alone.

---
## 9. TypeScript sketch

```ts
// packages/project/src/types/setup.ts. Shared types only, no logic; both @te/project and @te/project-write import them (ARCH C1).
export type Sq = { c: number; r: number };                                  // spec.ts Sq
export type ItemValue = string | number | boolean | Sq | Sq[] | null;       // §2.9.4: picker/text/colour | slider | toggle | tile | tiles
export type ListItem = { id: string; label: string; [field: string]: ItemValue };
export type KnobValue = number | string | boolean | ListItem[] | null;   // null only for nullable knobs (r8, L30)
export type Source = "default" | "user" | "preset";
export type StoredReason = "parentChanged" | "catalogueChanged" | "renamed";
export type Reask = { reason: StoredReason; by?: { knob?: string; behaviour?: string; option?: string }; at: string; note?: string };
export type PresetRef = { presetId: string; presetRev: number; name: string };
export type Answer = {
  source: Source;
  value?: KnobValue;          // absent iff source === "default"
  presetRef?: PresetRef;      // present iff source === "preset"
  rev: number;
  defaultRef: { rev: number };
  needsReask: Reask | null;   // event flags only (§2.2)
};
export type AnswerState = Omit<Answer, "rev">;
export type OpKind = "set" | "reset" | "resolve" | "preset" | "presetUpdate" | "flag" | "migrate" | "undo" | "redo";
export type Op = { seq: number; at: string; kind: OpKind; changes: { knob: string; before: AnswerState; after: AnswerState }[]; target?: number; presetRef?: PresetRef; note?: string; group?: string /* §4 rule 10, r8 */ };
export type History = { cap: number; baseSeq: number; ops: Op[] };
export type BehaviourSetup = {
  kind: "behaviour-setup"; formatVersion: 3; id: string; rev: number; name: string;
  behaviourId: string; catalogue: { rev: number }; createdAt: string; updatedAt: string;
  copiedFrom: { setupId: string; rev: number; at: string } | null;
  answers: Record<string, Answer>;
  modifiers?: { setupId: string; role: "scaler" | "rider" }[];   // r13, signed off (§2.11); absent = []; flat
  orphans: Record<string, { answer: Answer; removedAtRev: number | null; reason: string; folded?: { into: string; previous: Answer } /* r10 */ }>;
  history: History;
};
export type BehaviourPreset = {
  kind: "behaviour-preset"; formatVersion: 2; id: string; rev: number; name: string;
  behaviourId: string; catalogue: { rev: number };
  createdAt: string | null; updatedAt: string | null;           // null only when builtin is set
  answers: Record<string, { value: KnobValue } | { reset: true }>;
  builtin?: { deck: string; cards: string; status: string; source: string; notes?: string[] };
};
// Catalogue shapes as normalised by readCatalogue() (rev 4 {behaviour?,knob} leaves become dotted paths)
export type KnobPath = string;                                   // "knobId" | "behaviourId.knobId"
export type Gate =
  | { knob: KnobPath; eq: KnobValue }
  | { knob: KnobPath; some: { field: string; eq: string | boolean } } // list knobs only; picker/toggle fields
  | { any: Gate[] } | { all: Gate[] }                            // ≥ 2 entries each
  | { gate: string };                                            // named gate; inlined by readCatalogue(). No not/ne (rejected).
export type ItemFieldSpec =
  | { type: "picker"; options: { value: string; label: string; renamed_from?: string[] }[]; default: string }
  | { type: "toggle"; default: boolean }
  | { type: "slider"; min: number; max: number; step: number; default: number }
  | { type: "colour"; default: string }
  | { type: "text"; max_len?: number; default: string }                // L21
  | { type: "tile"; nullable?: boolean; default: Sq | null }           // L21
  | { type: "tiles"; max_items?: number; default: Sq[] }               // L21
  | { type: "asset"; kinds: ("sprite" | "image")[]; default: null };  // L32, rev 9
export type ListKnobExtras = { item: Record<string, ItemFieldSpec>; reserved_ids?: string[]; max_items?: number | null; min_items?: number | null; max_items_hard?: boolean; label_max_len?: number /* L29, default 48 */ };
export type TextKnobExtras = { max_len?: number /* default 48; Unicode code points, [...s].length (r30) */ };            // knob type "text" (L28)
export type ColourKnobExtras = { nullable?: boolean };                         // L30
export type Tombstone = { id: string; since_rev: number; reason: string;
  convert?: { to: string; from: "first-item-field"; field: string }; fold?: { into: string; when_false: "reset" } };   // L28, L30
export type BehaviourClosure = { closure?: "always" };                        // L31 (rev 8 name: export)
export type RefSpec = { list: KnobPath; builtin: string[] } | { docs: "effect" | "asset" | "deck"; builtin: string[] };   // docs: L19, asset: L32 (rev 9), deck: L38 (rev 14)
// Derived, never stored (packages/project/src/read/check.ts)
export type CheckCode = "requiredUnanswered" | "noDefault" | "invalidValue" | "outOfRange" | "offStep" | "unknownRef" | "overCap" | "underCap" | "reservedMissing" | "bannedCombo";
// effectPointOffBoard is a project-index warning (project-format r7 §13), not a setup check: it needs a map.
export const HARD: ReadonlySet<CheckCode> = new Set(["requiredUnanswered", "noDefault", "invalidValue"]);
export type CheckRow = { knobId: string; code: CheckCode; severity: "hard" | "warning"; banId?: string; itemId?: string; field?: string; detail?: string };
export type MissingRow = { knobId: string; label: string; question: string; code: "requiredUnanswered" | "noDefault" | "invalidValue"; value?: KnobValue;
  allowed: { min?: number; max?: number; step?: number; options?: string[] } };
export type Readiness = { playable: boolean; missing: MissingRow[]; warnings: CheckRow[] };
export type PresetDiffRow = { knob: string; label: string; setup: { source: Source; effective?: KnobValue; presetRef?: PresetRef };
  preset: { value: KnobValue } | { reset: true; catalogueDefault: KnobValue | null }; status: "same" | "differs" | "userOverrode" | "invalid"; appliedFromRev: number | null };
// Reader (@te/project): isActive, activeBehaviour, evalGate, effective, check, readiness, listMissing, describeSetup, diffPreset,
//   refTargets(knob, ctx), toSkillSpec(effectDoc) (effects only).
// Writer (@te/project-write): editAnswer, resetAnswer, resolveReask, undo, redo, duplicate, applyPreset, updateFromPreset, savePreset,
//   saveBackFromPreview, flagFromProject, migrate (001, 002, drift), editListItem, addListItem, removeListItem, moveListItem,
//   createEffect(from?: builtinId), importSkillSpec(text) (via spec.ts parseSkillSpec/normalize + fromSkillSpec).
```

---

## 10. Examples (catalogue_rev 6 for §10.1–10.8, rev 7 for §10.9–10.11, rev 7 → 8 drift in §10.12; all re-verified against rev 8, §12.4b)
The rev 6 examples stay valid documents. Loaded at rev 7, drift step 5 adds the new knobs (`ability_group`, `effect` on owners; `custom_groups`) as default answers, with no flags.

### 10.1 Setup: `mana-pool`

Knobs at rev 6 (unchanged since rev 2): `start` slider default 14 rev 2, `cap` slider default 14 rev 1, `regen` slider default 1 rev 1, `skip_first_turn` toggle default true rev 1, `refill_on_basic` toggle default false rev 1. Ban `mana-pool.start-gt-cap`.

`start` = 10 ≤ `cap` = 12, so the ban doesn't fire; the stored `parentChanged` flag records that `cap` moved after `start` was set. `check()` returns no rows, so it is playable.
```json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JC8Z6Q4M2W9K7T3R5N1B0XAA",
  "rev": 5,
  "name": "Tight economy",
  "behaviourId": "mana-pool",
  "catalogue": {
    "rev": 6
  },
  "createdAt": "2026-11-09T18:50:00Z",
  "updatedAt": "2026-11-09T19:20:00Z",
  "copiedFrom": null,
  "answers": {
    "start": {
      "source": "user",
      "value": 10,
      "rev": 2,
      "defaultRef": {
        "rev": 2
      },
      "needsReask": {
        "reason": "parentChanged",
        "by": {
          "knob": "cap"
        },
        "at": "2026-11-09T18:51:00Z"
      }
    },
    "cap": {
      "source": "preset",
      "value": 12,
      "presetRef": {
        "presetId": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
        "presetRev": 1,
        "name": "Short game"
      },
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "regen": {
      "source": "preset",
      "value": 2,
      "presetRef": {
        "presetId": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
        "presetRev": 1,
        "name": "Short game"
      },
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "skip_first_turn": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "refill_on_basic": {
      "source": "default",
      "rev": 2,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 1,
    "ops": [
      {
        "seq": 1,
        "at": "2026-11-09T18:50:30Z",
        "kind": "set",
        "changes": [
          {
            "knob": "start",
            "before": {
              "source": "default",
              "defaultRef": {
                "rev": 2
              },
              "needsReask": null
            },
            "after": {
              "source": "user",
              "value": 10,
              "defaultRef": {
                "rev": 2
              },
              "needsReask": null
            }
          }
        ]
      },
      {
        "seq": 2,
        "at": "2026-11-09T18:51:00Z",
        "kind": "preset",
        "presetRef": {
          "presetId": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
          "presetRev": 1,
          "name": "Short game"
        },
        "changes": [
          {
            "knob": "cap",
            "before": {
              "source": "default",
              "defaultRef": {
                "rev": 1
              },
              "needsReask": null
            },
            "after": {
              "source": "preset",
              "value": 12,
              "presetRef": {
                "presetId": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
                "presetRev": 1,
                "name": "Short game"
              },
              "defaultRef": {
                "rev": 1
              },
              "needsReask": null
            }
          },
          {
            "knob": "regen",
            "before": {
              "source": "default",
              "defaultRef": {
                "rev": 1
              },
              "needsReask": null
            },
            "after": {
              "source": "preset",
              "value": 2,
              "presetRef": {
                "presetId": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
                "presetRev": 1,
                "name": "Short game"
              },
              "defaultRef": {
                "rev": 1
              },
              "needsReask": null
            }
          },
          {
            "knob": "start",
            "before": {
              "source": "user",
              "value": 10,
              "defaultRef": {
                "rev": 2
              },
              "needsReask": null
            },
            "after": {
              "source": "user",
              "value": 10,
              "defaultRef": {
                "rev": 2
              },
              "needsReask": {
                "reason": "parentChanged",
                "by": {
                  "knob": "cap"
                },
                "at": "2026-11-09T18:51:00Z"
              }
            }
          }
        ]
      },
      {
        "seq": 3,
        "at": "2026-11-09T18:52:00Z",
        "kind": "set",
        "changes": [
          {
            "knob": "refill_on_basic",
            "before": {
              "source": "default",
              "defaultRef": {
                "rev": 1
              },
              "needsReask": null
            },
            "after": {
              "source": "user",
              "value": true,
              "defaultRef": {
                "rev": 1
              },
              "needsReask": null
            }
          }
        ]
      },
      {
        "seq": 4,
        "at": "2026-11-09T18:53:00Z",
        "kind": "undo",
        "target": 3,
        "changes": [
          {
            "knob": "refill_on_basic",
            "before": {
              "source": "user",
              "value": true,
              "defaultRef": {
                "rev": 1
              },
              "needsReask": null
            },
            "after": {
              "source": "default",
              "defaultRef": {
                "rev": 1
              },
              "needsReask": null
            }
          }
        ]
      },
      {
        "seq": 5,
        "at": "2026-11-09T19:20:00Z",
        "kind": "migrate",
        "changes": [],
        "note": "002 derive-checks; catalogue 3 → 6: no knob of mana-pool moved"
      }
    ]
  }
}
```

### 10.2 Migration 002 `derive-checks` on one answer (v2 → v3)
Before (v2, `trap-tile`, saved by r3 with a stored check):
```json
{
  "formatVersion": 2,
  "answers": {
    "max_traps": {
      "source": "user",
      "value": 9,
      "rev": 2,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": {
        "reason": "outOfRange",
        "at": "2026-11-09T19:00:00Z"
      }
    }
  }
}
```
After (v3): the stored `outOfRange` is dropped. `check()` derives it again **only while `max_traps` is active**, and now as a warning.
```json
{
  "formatVersion": 3,
  "answers": {
    "max_traps": {
      "source": "user",
      "value": 9,
      "rev": 2,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": null
    }
  }
}
```

### 10.3 Preset: embedded r1 and library r2
Project file `presets/preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q@1.json` (this copy wins):
```json
{
  "kind": "behaviour-preset",
  "formatVersion": 2,
  "id": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
  "rev": 1,
  "name": "Short game",
  "behaviourId": "mana-pool",
  "catalogue": {
    "rev": 6
  },
  "createdAt": "2026-11-09T18:45:00Z",
  "updatedAt": "2026-11-09T18:45:00Z",
  "answers": {
    "cap": {
      "value": 12
    },
    "regen": {
      "value": 2
    }
  }
}
```
Library file (`<library>/preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q.json`, r2):
```json
{
  "kind": "behaviour-preset",
  "formatVersion": 2,
  "id": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
  "rev": 2,
  "name": "Short game",
  "behaviourId": "mana-pool",
  "catalogue": {
    "rev": 6
  },
  "createdAt": "2026-11-09T18:45:00Z",
  "updatedAt": "2026-11-09T19:05:00Z",
  "answers": {
    "cap": {
      "value": 10
    },
    "regen": {
      "value": 2
    },
    "skip_first_turn": {
      "value": false
    }
  }
}
```
`diffPreset(setup §10.1, library r2)`:
```json
[
  {
    "knob": "cap",
    "label": "Mana cap",
    "setup": {
      "source": "preset",
      "effective": 12,
      "presetRef": {
        "presetId": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
        "presetRev": 1,
        "name": "Short game"
      }
    },
    "preset": {
      "value": 10
    },
    "status": "differs",
    "appliedFromRev": 1
  },
  {
    "knob": "regen",
    "label": "Mana gained each turn",
    "setup": {
      "source": "preset",
      "effective": 2,
      "presetRef": {
        "presetId": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q",
        "presetRev": 1,
        "name": "Short game"
      }
    },
    "preset": {
      "value": 2
    },
    "status": "same",
    "appliedFromRev": 1
  },
  {
    "knob": "skip_first_turn",
    "label": "No regen on the first turn",
    "setup": {
      "source": "default",
      "effective": true
    },
    "preset": {
      "value": false
    },
    "status": "differs",
    "appliedFromRev": null
  }
]
```

### 10.4 Unlimited pair under C4: `trap-tile`
- `max_traps_unlimited`: toggle, default **true**, rev 3.
- `max_traps`: slider, default 3, range 1–6, step 1, rev 3, `active_when {"knob": "max_traps_unlimited", "eq": false}`.

A hand-edited file set the cap to 9 while unlimited was on:
```json
{
  "max_traps_unlimited": {
    "source": "default",
    "rev": 0,
    "defaultRef": {
      "rev": 3
    },
    "needsReask": null
  },
  "max_traps": {
    "source": "user",
    "value": 9,
    "rev": 1,
    "defaultRef": {
      "rev": 3
    },
    "needsReask": null
  }
}
```
- While unlimited is on: `max_traps` is inactive, so there are no checks and nothing shows.
- The user turns unlimited off: one `set` op on `max_traps_unlimited`. `check()` now returns `{knobId:"max_traps", code:"outOfRange", severity:"warning"}`.
- **Play is not blocked** (C4). The banner reads "Traps at once is 9, above the usual 1–6", with "Play anyway". The runtime uses 9. In r3 this blocked Play.

### 10.5 Knob and option rename: `win-condition.tie_result: "no-draw"` (rev 2 → rev 6, P6)
At rev 6, `draw_handling` (rev 3) has `renamed_from ["tie_result"]`, and its option `clock-loss` has `renamed_from ["no-draw"]`, status `CoS-default` with a ruling. Saved at rev 2 (excerpt):
```json
{
  "behaviourId": "win-condition",
  "catalogue": {
    "rev": 2
  },
  "answers": {
    "tie_result": {
      "source": "user",
      "value": "no-draw",
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    }
  }
}
```
After loading at rev 6 (excerpt; the other win-condition answers are unchanged or newly added as defaults):
```json
{
  "behaviourId": "win-condition",
  "catalogue": {
    "rev": 6
  },
  "answers": {
    "draw_handling": {
      "source": "user",
      "value": "clock-loss",
      "rev": 2,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": {
        "reason": "catalogueChanged",
        "by": {
          "knob": "tie_result",
          "option": "no-draw"
        },
        "at": "2026-11-09T19:20:00Z",
        "note": "renamed tie_result → draw_handling; option no-draw → clock-loss (P6, CEO-approved 2026-11-09)"
      }
    },
    "clock_loss_rule": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 5
      },
      "needsReask": null
    },
    "behind_order": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 5
      },
      "needsReask": null
    },
    "tiebreak_first": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": null
    },
    "tiebreak_second": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": null
    },
    "tiebreak_still_level": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": null
    }
  }
}
```
- Step 2 re-keys `tie_result` to `draw_handling`, and step 3 maps `no-draw` to `clock-loss`. The source stays `user`.
- Knob rev 3 > 1, so `catalogueChanged` outranks `renamed`, and the note records both renames.
- `clock_loss_rule` is new and active (`draw_handling = clock-loss`), so it resolves to its default `side-on-move` ("side on move loses", as P6 specifies). `behind_order` and `tiebreak_*` are inactive.
- The load notice reads: "Renamed: When the match ends level ('No draw' is now 'Clock loss')."
- r3 gave a blocking `outOfRange` here. It is gone, because the catalogue now carries the option rename.

### 10.6 Knob rename inside a renamed behaviour: `card-recursion` → `ability-refresh` (rev 4 → rev 6)
At rev 6, `ability-refresh` has `renamed_from ["card-recursion"]`; `max_refreshes` ← ["max_returns"]; `max_refreshes_unlimited` ← ["max_returns_unlimited"]. All five knobs are at rev 5. Saved at rev 4, after applying the built-in Pride in Numbers (excerpt):
```json
{
  "behaviourId": "card-recursion",
  "catalogue": {
    "rev": 4
  },
  "answers": {
    "condition": {
      "source": "preset",
      "value": "cast-below-mana",
      "presetRef": {
        "presetId": "builtin:card-recursion/btf-pride-in-numbers",
        "presetRev": 4,
        "name": "Pride in Numbers (BTF)"
      },
      "rev": 1,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "cost_step": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    },
    "max_returns": {
      "source": "preset",
      "value": 1,
      "presetRef": {
        "presetId": "builtin:card-recursion/btf-pride-in-numbers",
        "presetRev": 4,
        "name": "Pride in Numbers (BTF)"
      },
      "rev": 1,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": null
    },
    "max_returns_unlimited": {
      "source": "preset",
      "value": false,
      "presetRef": {
        "presetId": "builtin:card-recursion/btf-pride-in-numbers",
        "presetRev": 4,
        "name": "Pride in Numbers (BTF)"
      },
      "rev": 1,
      "defaultRef": {
        "rev": 3
      },
      "needsReask": null
    },
    "expires": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 1
      },
      "needsReask": null
    }
  }
}
```
After loading at rev 6:
```json
{
  "behaviourId": "ability-refresh",
  "catalogue": {
    "rev": 6
  },
  "answers": {
    "condition": {
      "source": "preset",
      "value": "cast-below-mana",
      "presetRef": {
        "presetId": "builtin:ability-refresh/btf-pride-in-numbers",
        "presetRev": 4,
        "name": "Pride in Numbers (BTF)"
      },
      "rev": 1,
      "defaultRef": {
        "rev": 5
      },
      "needsReask": {
        "reason": "catalogueChanged",
        "at": "2026-11-09T19:20:00Z",
        "note": "behaviour renamed card-recursion → ability-refresh (rev 5)"
      }
    },
    "cost_step": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 5
      },
      "needsReask": null
    },
    "max_refreshes": {
      "source": "preset",
      "value": 1,
      "presetRef": {
        "presetId": "builtin:ability-refresh/btf-pride-in-numbers",
        "presetRev": 4,
        "name": "Pride in Numbers (BTF)"
      },
      "rev": 2,
      "defaultRef": {
        "rev": 5
      },
      "needsReask": {
        "reason": "catalogueChanged",
        "at": "2026-11-09T19:20:00Z",
        "note": "renamed max_returns → max_refreshes inside renamed behaviour"
      }
    },
    "max_refreshes_unlimited": {
      "source": "preset",
      "value": false,
      "presetRef": {
        "presetId": "builtin:ability-refresh/btf-pride-in-numbers",
        "presetRev": 4,
        "name": "Pride in Numbers (BTF)"
      },
      "rev": 2,
      "defaultRef": {
        "rev": 5
      },
      "needsReask": {
        "reason": "catalogueChanged",
        "at": "2026-11-09T19:20:00Z",
        "note": "renamed max_returns_unlimited → max_refreshes_unlimited"
      }
    },
    "expires": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 5
      },
      "needsReask": null
    }
  }
}
```
- Step 1 rewrites `behaviourId` and `presetRef.presetId`. Step 2 then finds `max_returns` in the **new** behaviour's `renamed_from`.
- The default answers' `defaultRef` moves 1 → 5 with no notice, because their `default_history` has no entry after rev 1.
- The preset answers get `catalogueChanged` (knob rev 5 > their `defaultRef`), with the rename in `note`.
- The materialised `presets/builtin~card-recursion~btf-pride-in-numbers@4.json` keeps its file name, and its doc `id` and answer keys are rewritten. Its normalised hash equals the rev 6 built-in (`condition`, `max_refreshes: 1`, `max_refreshes_unlimited: false`), so no changed hint shows.

### 10.7 Option renames, nested gates and `required`: `ability-presentation` (rev 5 → rev 6)
At rev 6, `shortcut` (rev 6, `required`, `ask_in_wizard`) has `renamed_from ["style"]`, with options `all-menu` ← ['unit-action-menu'], `all-cards` ← ['card-hand'], `custom`. `basic_style` and `spells_style` are `required` with `active_when {"knob": "shortcut", "eq": "custom"}`. `hand_placement` has the nested "any group uses card hand" gate (§2.9). Saved at rev 5 (an all-cards project):
```json
{
  "behaviourId": "ability-presentation",
  "catalogue": {
    "rev": 5
  },
  "answers": {
    "style": {
      "source": "user",
      "value": "card-hand",
      "rev": 1,
      "defaultRef": {
        "rev": 4
      },
      "needsReask": null
    }
  }
}
```
After loading at rev 6:
```json
{
  "behaviourId": "ability-presentation",
  "catalogue": {
    "rev": 6
  },
  "answers": {
    "shortcut": {
      "source": "user",
      "value": "all-cards",
      "rev": 2,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": {
        "reason": "catalogueChanged",
        "by": {
          "knob": "style",
          "option": "card-hand"
        },
        "at": "2026-11-09T19:20:00Z",
        "note": "renamed style → shortcut; option card-hand → all-cards"
      }
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
    "hand_placement": {
      "source": "default",
      "rev": 0,
      "defaultRef": {
        "rev": 6
      },
      "needsReask": null
    }
  }
}
```
Evaluation:
- `shortcut = all-cards`, so `basic_style` and `spells_style` are inactive: not asked, not checked, and not required.
- `hand_placement` is active through the first `any` branch, and resolves to its default `hand-docked`.
- `hand-and-draw` and `reveal-hand` (behaviour gate: uses card hand) are active. `reveal-intent` (uses menu) is inactive.
- `check()` returns no hard rows, so it is playable.

The user picks **Custom**: one `set` op on `shortcut` only. The two group pickers become active with `source:"default"`, and `listMissing` immediately returns:
```json
[
  {
    "knobId": "basic_style",
    "label": "Basic actions (move, basic attack, wait): how are they picked?",
    "question": "Custom: how is each ability group picked?",
    "code": "requiredUnanswered",
    "allowed": {
      "options": [
        "unit-action-menu",
        "card-hand"
      ]
    }
  },
  {
    "knobId": "spells_style",
    "label": "Spells and abilities: how are they picked?",
    "question": "Custom: how is each ability group picked?",
    "code": "requiredUnanswered",
    "allowed": {
      "options": [
        "unit-action-menu",
        "card-hand"
      ]
    }
  }
]
```
Play and Render jump to that question. With `basic_style = unit-action-menu` and `spells_style = card-hand` (BTF), both presentation gates are true, so `hand-and-draw` and `reveal-intent` are both active. One undo of the shortcut op removes both rows, and nothing was ever written to the pickers.

### 10.8 Built-in preset as a document: `ability-presentation` / `btf-card-hand` (rev 6, ARCH C11)
```json
{
  "kind": "behaviour-preset",
  "formatVersion": 2,
  "id": "builtin:ability-presentation/btf-card-hand",
  "rev": 6,
  "name": "Before The Fall (menu for basics, cards for spells)",
  "behaviourId": "ability-presentation",
  "catalogue": {
    "rev": 6
  },
  "createdAt": null,
  "updatedAt": null,
  "answers": {
    "shortcut": {
      "value": "custom"
    },
    "basic_style": {
      "value": "unit-action-menu"
    },
    "spells_style": {
      "value": "card-hand"
    },
    "hand_placement": {
      "value": "hand-docked"
    }
  },
  "builtin": {
    "deck": "Before The Fall",
    "cards": "all",
    "status": "src",
    "source": "/workspace/tileengine/docs/ARCHITECTURE-v0.md §3.4 / §11 C11: BTF basic -> action-menu, spells -> card-hand, hand always on screen; /workspace/g-tile-engine/src/chess/game/towerChessHand.ts (spells are dealt as cards)"
  }
}
```
A project that applied this preset at rev 4 (`style: card-hand`) normalises the old preset to `shortcut: all-cards`. Its hash differs from rev 6, so the hint shows, and the diff offers `shortcut → custom`, `basic_style → unit-action-menu`, `spells_style → card-hand` and `hand_placement → hand-docked`.

### 10.9 User groups and `ability_group` (rev 7, shipped)
`ability-presentation` setup answer:
```json
{
  "custom_groups": {
    "source": "user",
    "value": [
      {
        "id": "items",
        "label": "Items",
        "style": "unit-action-menu"
      },
      {
        "id": "ultimates",
        "label": "Ultimates",
        "style": "card-hand"
      }
    ],
    "rev": 1,
    "defaultRef": {
      "rev": 7
    },
    "needsReask": null
  }
}
```
`summon-unit` setup answer, a `ref` into the list above:
```json
{
  "ability_group": {
    "source": "user",
    "value": "ultimates",
    "rev": 1,
    "defaultRef": {
      "rev": 7
    },
    "needsReask": null
  }
}
```
- Under `shortcut = custom` with both built-in pickers on `unit-action-menu`, the `some` leaf is still true (`ultimates`), so the card-hand behaviours stay active.
- Deleting `ultimates` gives `ability_group` a `parentChanged` flag and an `unknownRef` warning, and it runs as `spells`.


### 10.10 Reserved list items: `terrain.tile_types` (rev 7)
One built-in item's label is edited (allowed), and one user item `lava` is added. The 10 reserved ids are all present; `lava` is new, so it passes §2.9.3. Two edits mean two `set` ops on the one answer.
```json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_01JC9H1T2E3R4R5A6I7N8T9Y0P",
  "rev": 2,
  "name": "Forest terrain",
  "behaviourId": "terrain",
  "catalogue": {
    "rev": 7
  },
  "createdAt": "2026-11-09T19:48:00.000Z",
  "updatedAt": "2026-11-09T19:50:00.000Z",
  "copiedFrom": null,
  "answers": {
    "tile_types": {
      "source": "user",
      "value": [
        {"id": "floor", "label": "Floor", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": false},
        {"id": "fallen", "label": "Fallen tile (abyss)", "open": false, "kills_on_landing": true, "push_can_enter": true, "slows_move": false, "trips": false},
        {"id": "flask", "label": "Flask tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
        {"id": "rising", "label": "Rising tile (a unit is coming back here)", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
        {"id": "tide", "label": "Tide mark", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
        {"id": "warp-mark", "label": "Warp mark", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
        {"id": "sword-mark", "label": "Sword fade-in tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
        {"id": "boss-cover", "label": "Portal boss tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
        {"id": "vines", "label": "Thick vines", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": true, "trips": false},
        {"id": "trap", "label": "Trap", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": true},
        {"id": "lava", "label": "Lava", "open": true, "kills_on_landing": true, "push_can_enter": true, "slows_move": false, "trips": false}
      ],
      "rev": 2,
      "defaultRef": {
        "rev": 7
      },
      "needsReask": null
    }
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 0,
    "ops": [
      {
        "seq": 1,
        "at": "2026-11-09T19:49:00.000Z",
        "kind": "set",
        "changes": [
          {
            "knob": "tile_types",
            "before": {"source": "default", "defaultRef": {"rev": 7}, "needsReask": null},
            "after": {
              "source": "user",
              "value": [
                {"id": "floor", "label": "Floor", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": false},
                {"id": "fallen", "label": "Fallen tile (abyss)", "open": false, "kills_on_landing": true, "push_can_enter": true, "slows_move": false, "trips": false},
                {"id": "flask", "label": "Flask tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "rising", "label": "Rising tile (a unit is coming back here)", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "tide", "label": "Tide mark", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "warp-mark", "label": "Warp mark", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "sword-mark", "label": "Sword fade-in tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "boss-cover", "label": "Portal boss tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "vines", "label": "Thick vines", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": true, "trips": false},
                {"id": "trap", "label": "Trap", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": true}
              ],
              "defaultRef": {
                "rev": 7
              },
              "needsReask": null
            }
          }
        ],
        "note": "edit item vines.label"
      },
      {
        "seq": 2,
        "at": "2026-11-09T19:50:00.000Z",
        "kind": "set",
        "changes": [
          {
            "knob": "tile_types",
            "before": {
              "source": "user",
              "value": [
                {"id": "floor", "label": "Floor", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": false},
                {"id": "fallen", "label": "Fallen tile (abyss)", "open": false, "kills_on_landing": true, "push_can_enter": true, "slows_move": false, "trips": false},
                {"id": "flask", "label": "Flask tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "rising", "label": "Rising tile (a unit is coming back here)", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "tide", "label": "Tide mark", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "warp-mark", "label": "Warp mark", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "sword-mark", "label": "Sword fade-in tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "boss-cover", "label": "Portal boss tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "vines", "label": "Thick vines", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": true, "trips": false},
                {"id": "trap", "label": "Trap", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": true}
              ],
              "defaultRef": {
                "rev": 7
              },
              "needsReask": null
            },
            "after": {
              "source": "user",
              "value": [
                {"id": "floor", "label": "Floor", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": false},
                {"id": "fallen", "label": "Fallen tile (abyss)", "open": false, "kills_on_landing": true, "push_can_enter": true, "slows_move": false, "trips": false},
                {"id": "flask", "label": "Flask tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "rising", "label": "Rising tile (a unit is coming back here)", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "tide", "label": "Tide mark", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "warp-mark", "label": "Warp mark", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "sword-mark", "label": "Sword fade-in tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "boss-cover", "label": "Portal boss tile", "open": false, "kills_on_landing": false, "push_can_enter": false, "slows_move": false, "trips": false},
                {"id": "vines", "label": "Thick vines", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": true, "trips": false},
                {"id": "trap", "label": "Trap", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": true},
                {"id": "lava", "label": "Lava", "open": true, "kills_on_landing": true, "push_can_enter": true, "slows_move": false, "trips": false}
              ],
              "defaultRef": {
                "rev": 7
              },
              "needsReask": null
            }
          }
        ],
        "note": "add item lava"
      }
    ]
  }
}
```
- `removeListItem(doc, "tile_types", "vines")` → `readOnly {item: "vines"}`. `addListItem(…, {id: "floor", …})` → `invalidValue {item: "reservedId"}`.
- If rev 8 changes `trap.trips`'s default, this answer (source `user`) gets `catalogueChanged`, and the per-item diff offers "Take the new defaults for built-in items".
- The map's logic palette names these ids (project-format §6.4): `lava` can be painted as soon as it exists.

### 10.11 Effect document and an owner's `effect` ref (rev 7)
`effects/effect_01JC9H2W3R4A5T6H7C8O9N0E1A.json`: started from the BTF built-in `btf-wrath-cone` (one `preset` op), then a second step was added (one `set` op). `saved_effects` is still a live knob at rev 7, so it has a default answer; it is hidden and unused. **At rev 8 it's retired** and drifts to `orphans` (§10.12).
```json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "effect_01JC9H2W3R4A5T6H7C8O9N0E1A",
  "rev": 2,
  "name": "Wrath cone, then spin",
  "behaviourId": "effect",
  "catalogue": {
    "rev": 7
  },
  "createdAt": "2026-11-09T19:51:00.000Z",
  "updatedAt": "2026-11-09T19:52:00.000Z",
  "copiedFrom": null,
  "answers": {
    "blade": {"source": "preset", "value": "wrath", "presetRef": {"presetId": "builtin:effect/btf-wrath-cone", "presetRev": 7, "name": "Wrath blade cone slash"}, "rev": 1, "defaultRef": {"rev": 7}, "needsReask": null},
    "tint": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "glow": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "glow_size": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "scale": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "spin": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "trail": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "spawn": {"source": "preset", "value": "from-caster", "presetRef": {"presetId": "builtin:effect/btf-wrath-cone", "presetRev": 7, "name": "Wrath blade cone slash"}, "rev": 1, "defaultRef": {"rev": 7}, "needsReask": null},
    "drop": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "edge": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "ease": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "steps": {
      "source": "user",
      "value": [
        {"id": "step-1", "label": "Step 1", "kind": "cone", "seconds": 0.48, "release": "together", "lock": "target", "pierce": 0, "bend": 0.8, "row_count": 3, "row_gap": 0.7, "orbit_count": 6, "orbit_radius": 1.05, "orbit_turns": 1, "cone_rows": 4, "cone_angle": -32, "cone_ribbon": 1.15, "reel_reach": 3, "reel_pull": "yank", "reel_anchor": "you", "look_ease": "linear", "scale_on": false, "scale_from": 1.2, "scale_to": 1.2, "glow_on": false, "glow_from": 16, "glow_to": 16, "fade_on": false, "fade_from": 1, "fade_to": 1, "jitter": 0, "start_spread": 0, "size_spread": 0, "layer_kind": "none", "layer_delay": 0},
        {"id": "step-2", "label": "Step 2", "kind": "orbit", "seconds": 0.6, "release": "together", "lock": "target", "pierce": 0, "bend": 0.8, "row_count": 3, "row_gap": 0.7, "orbit_count": 3, "orbit_radius": 1.05, "orbit_turns": 0.5, "cone_rows": 4, "cone_angle": -32, "cone_ribbon": 1.15, "reel_reach": 3, "reel_pull": "yank", "reel_anchor": "you", "look_ease": "linear", "scale_on": false, "scale_from": 1.2, "scale_to": 1.2, "glow_on": false, "glow_from": 16, "glow_to": 16, "fade_on": false, "fade_from": 1, "fade_to": 1, "jitter": 0, "start_spread": 0, "size_spread": 0, "layer_kind": "none", "layer_delay": 0}
      ],
      "rev": 2,
      "defaultRef": {
        "rev": 7
      },
      "needsReask": null
    },
    "hit": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "nudge": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "connect": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "damage_label": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "impact": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "impact_colour": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "sparks": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "impact_radius": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "cue_at": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
    "saved_effects": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null}
  },
  "orphans": {},
  "history": {
    "cap": 200,
    "baseSeq": 0,
    "ops": [
      {
        "seq": 1,
        "at": "2026-11-09T19:51:00.000Z",
        "kind": "preset",
        "presetRef": {
          "presetId": "builtin:effect/btf-wrath-cone",
          "presetRev": 7,
          "name": "Wrath blade cone slash"
        },
        "changes": [
          {
            "knob": "blade",
            "before": {"source": "default", "defaultRef": {"rev": 7}, "needsReask": null},
            "after": {"source": "preset", "value": "wrath", "presetRef": {"presetId": "builtin:effect/btf-wrath-cone", "presetRev": 7, "name": "Wrath blade cone slash"}, "defaultRef": {"rev": 7}, "needsReask": null}
          },
          {
            "knob": "spawn",
            "before": {"source": "default", "defaultRef": {"rev": 7}, "needsReask": null},
            "after": {"source": "preset", "value": "from-caster", "presetRef": {"presetId": "builtin:effect/btf-wrath-cone", "presetRev": 7, "name": "Wrath blade cone slash"}, "defaultRef": {"rev": 7}, "needsReask": null}
          },
          {
            "knob": "steps",
            "before": {"source": "default", "defaultRef": {"rev": 7}, "needsReask": null},
            "after": {
              "source": "preset",
              "value": [
                {"id": "step-1", "label": "Step 1", "kind": "cone", "seconds": 0.48, "release": "together", "lock": "target", "pierce": 0, "bend": 0.8, "row_count": 3, "row_gap": 0.7, "orbit_count": 6, "orbit_radius": 1.05, "orbit_turns": 1, "cone_rows": 4, "cone_angle": -32, "cone_ribbon": 1.15, "reel_reach": 3, "reel_pull": "yank", "reel_anchor": "you", "look_ease": "linear", "scale_on": false, "scale_from": 1.2, "scale_to": 1.2, "glow_on": false, "glow_from": 16, "glow_to": 16, "fade_on": false, "fade_from": 1, "fade_to": 1, "jitter": 0, "start_spread": 0, "size_spread": 0, "layer_kind": "none", "layer_delay": 0}
              ],
              "presetRef": {
                "presetId": "builtin:effect/btf-wrath-cone",
                "presetRev": 7,
                "name": "Wrath blade cone slash"
              },
              "defaultRef": {
                "rev": 7
              },
              "needsReask": null
            }
          }
        ]
      },
      {
        "seq": 2,
        "at": "2026-11-09T19:52:00.000Z",
        "kind": "set",
        "note": "add item step-2",
        "changes": [
          {
            "knob": "steps",
            "before": {
              "source": "preset",
              "value": [
                {"id": "step-1", "label": "Step 1", "kind": "cone", "seconds": 0.48, "release": "together", "lock": "target", "pierce": 0, "bend": 0.8, "row_count": 3, "row_gap": 0.7, "orbit_count": 6, "orbit_radius": 1.05, "orbit_turns": 1, "cone_rows": 4, "cone_angle": -32, "cone_ribbon": 1.15, "reel_reach": 3, "reel_pull": "yank", "reel_anchor": "you", "look_ease": "linear", "scale_on": false, "scale_from": 1.2, "scale_to": 1.2, "glow_on": false, "glow_from": 16, "glow_to": 16, "fade_on": false, "fade_from": 1, "fade_to": 1, "jitter": 0, "start_spread": 0, "size_spread": 0, "layer_kind": "none", "layer_delay": 0}
              ],
              "presetRef": {
                "presetId": "builtin:effect/btf-wrath-cone",
                "presetRev": 7,
                "name": "Wrath blade cone slash"
              },
              "defaultRef": {
                "rev": 7
              },
              "needsReask": null
            },
            "after": {
              "source": "user",
              "value": [
                {"id": "step-1", "label": "Step 1", "kind": "cone", "seconds": 0.48, "release": "together", "lock": "target", "pierce": 0, "bend": 0.8, "row_count": 3, "row_gap": 0.7, "orbit_count": 6, "orbit_radius": 1.05, "orbit_turns": 1, "cone_rows": 4, "cone_angle": -32, "cone_ribbon": 1.15, "reel_reach": 3, "reel_pull": "yank", "reel_anchor": "you", "look_ease": "linear", "scale_on": false, "scale_from": 1.2, "scale_to": 1.2, "glow_on": false, "glow_from": 16, "glow_to": 16, "fade_on": false, "fade_from": 1, "fade_to": 1, "jitter": 0, "start_spread": 0, "size_spread": 0, "layer_kind": "none", "layer_delay": 0},
                {"id": "step-2", "label": "Step 2", "kind": "orbit", "seconds": 0.6, "release": "together", "lock": "target", "pierce": 0, "bend": 0.8, "row_count": 3, "row_gap": 0.7, "orbit_count": 3, "orbit_radius": 1.05, "orbit_turns": 0.5, "cone_rows": 4, "cone_angle": -32, "cone_ribbon": 1.15, "reel_reach": 3, "reel_pull": "yank", "reel_anchor": "you", "look_ease": "linear", "scale_on": false, "scale_from": 1.2, "scale_to": 1.2, "glow_on": false, "glow_from": 16, "glow_to": 16, "fade_on": false, "fade_from": 1, "fade_to": 1, "jitter": 0, "start_spread": 0, "size_spread": 0, "layer_kind": "none", "layer_delay": 0}
              ],
              "defaultRef": {
                "rev": 7
              },
              "needsReask": null
            }
          }
        ]
      }
    ]
  }
}
```
`line-shot` setup answers that point at it (the `ability_group` stays on its default `spells`):
```json
{
  "ability_group": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null},
  "effect": {"source": "user", "value": "effect_01JC9H2W3R4A5T6H7C8O9N0E1A", "rev": 1, "defaultRef": {"rev": 7}, "needsReask": null}
}
```
- `describeSetup` = skillrig's `describeSkill(toSkillSpec(doc))`. `steps` has 2 of max 6 items, so there is no `overCap`.
- `toSkillSpec` maps `steps[]` to `frames[]` (`kind` + the kind's fields → `motion`; `scale_*`/`glow_*`/`fade_*` → `look` ramps; `jitter`/`start_spread`/`size_spread` → `spread`; `layer_kind`/`layer_delay` → `layer`).

### 10.12 Drift rev 7 → 8 on the effect document (r8)
Loading §10.11 at rev 8 is one `migrate` op:
- `saved_effects` goes to `orphans` (tombstone since 8).
- `cue` and `tags` are added as default answers.
- Every `defaultRef.rev` follows its knob `rev`: `steps` is 8 and the rest are 7.
- `steps` (source `user`) **is not flagged**: rev 8 only **added** item fields (`trace_points`, `bounce_points`, `reel_land`, `reel_tie`, `reel_links`, `tint_on`, `tint_from`, `tint_to`), and the stored items read them at their defaults (§8.2 list rule, r8).
```json
{
  "catalogue": {"rev": 8},
  "answers_added": {
    "cue": {"source": "default", "rev": 0, "defaultRef": {"rev": 8}, "needsReask": null},
    "tags": {"source": "default", "rev": 0, "defaultRef": {"rev": 8}, "needsReask": null}
  },
  "orphans": {
    "saved_effects": {"answer": {"source": "default", "rev": 0, "defaultRef": {"rev": 7}, "needsReask": null}, "removedAtRev": 8, "reason": "Superseded by effect documents (effects/<id>.json, setup-format r6 §2.10, L19); the effect ref now points at documents."}
  },
  "op": {
    "seq": 3,
    "at": "2026-11-09T20:05:00.000Z",
    "kind": "migrate",
    "note": "catalogue 7 → 8: 2 new settings; saved_effects retired; steps gained 8 item fields (defaults)",
    "changes": [
      {"knob": "steps", "before": {"source": "user", "defaultRef": {"rev": 7}, "needsReask": null}, "after": {"source": "user", "defaultRef": {"rev": 8}, "needsReask": null}}
    ]
  }
}
```
- This excerpt shows only the changed parts; the stored document keeps the §2.1 shape.
- Added and orphaned answers are named in the `note`, the same as §10.1's `migrate` op, so `changes` lists only answers that existed before.
- The `steps` change elides `value`, which drift never touches.
- A `line-shot` `effect` answer (§10.11) that names the document is unchanged: the doc ref is still valid under `{docs: "effect"}`.

### 10.13 Drift rev 8 → 9: `cue` → `cue_name` (convert) and `team_colour_override` (fold) (r10)
**Effect document with a user cue** (rev 8 answer `cue: [{id: "c1", label: "Cue", name: "slash_heavy"}]`, source `user`). Step 4's convert runs before the orphan move:
- `cue_name` gets **`source: "user"`, value `"slash_heavy"`** (`value[0].name`; an empty list gives `""`), `rev: 1`, and `defaultRef {rev: 9}`. It's flagged `renamed` with the note "converted from cue".
- The old `cue` answer moves to `orphans` **unchanged**, so nothing is lost and the conversion can be re-derived.
- A `preset` source stays `preset` with its `presetRef`. A `default` source gives a default `cue_name` (`""`).
- If `cue_name` already has a non-default answer (a re-run, or a hand edit), it's left alone (idempotent).

**`unit-roster` setup with the override on and the colour at its old default**: rev 8 `team_colour_override: true` (user) and `team_colour` default (= `#badcff` at rev 8). Fold, `when_false: "reset"`:
- The toggle's effective value was **true**, so `team_colour` is **kept, and made explicit**. A default answer whose **old** effective value (`default_history` at the stored `defaultRef.rev`) differs from the **new** default (`null` = palette) is written as **`source: "user"`, value `"#badcff"`**. The army keeps its fixed colour instead of silently switching to the palette.
- When the toggle was **false**, `team_colour` is reset to its default (`null`, the palette), which is what the army was showing. If `team_colour` held a user value then, that value goes **into the orphan record** (`orphans.team_colour_override.folded = {into: "team_colour", previous: <answer>}`), so it's never lost and the editor can offer "Restore my old colour".
- In both cases the toggle's answer moves to `orphans`.
```json
{
  "catalogue": {"rev": 9},
  "answers_changed": {
    "team_colour": {"source": "user", "value": "#badcff", "rev": 1, "defaultRef": {"rev": 9}, "needsReask": {"reason": "renamed", "by": {"knob": "team_colour_override"}, "at": "2026-11-09T20:20:00.000Z", "note": "folded: override was on, kept the rev 8 colour"}}
  },
  "orphans": {
    "team_colour_override": {"answer": {"source": "user", "value": true, "rev": 1, "defaultRef": {"rev": 8}, "needsReask": null}, "removedAtRev": 9, "reason": "Folded into the nullable team_colour (null = palette) (setup-format r8 §12.7 Q5, L30).", "folded": {"into": "team_colour", "previous": {"source": "default", "rev": 0, "defaultRef": {"rev": 8}, "needsReask": null}}}
  },
  "op": {"seq": 4, "at": "2026-11-09T20:20:00.000Z", "kind": "migrate", "note": "catalogue 8 → 9: team_colour_override folded into team_colour (kept #badcff)",
    "changes": [{"knob": "team_colour", "before": {"source": "default", "defaultRef": {"rev": 8}, "needsReask": null}, "after": {"source": "user", "value": "#badcff", "defaultRef": {"rev": 9}, "needsReask": {"reason": "renamed", "by": {"knob": "team_colour_override"}, "at": "2026-11-09T20:20:00.000Z", "note": "folded: override was on, kept the rev 8 colour"}}}]}
}
```
- **Other layers get the same per-layer rule:**
  - **Presets:** a preset storing `team_colour_override: true` and a colour keeps the colour; `false` drops `team_colour`. A preset `cue` becomes `cue_name`.
  - **Stage overrides:** `stage.overrides.setups["unit-roster"].team_colour_override: true` with no colour override writes the effective colour as a `team_colour` override; `false` writes `team_colour: null`. The old key is moved to the stage's `migrate` note.
- Each document still gets one `migrate` op.

### 10.14 Drift rev 9 → 12: `points_anchor` → `anchor`, `{c, r}` → `{dc, dr}` (r10; **fixed r11**)
A user step list stored at rev 9 with a booth-anchored trace (`points_anchor: "board"`). Rev 9 had no `booth_caster` knob, so nothing is stored.
- `retired_item_fields` turns `board` into `anchor: "caster"`. `value_converters` rewrites the points relative to **`legacy_relative_to` `{0, 0}`**: no `booth_caster` was stored, and the current default `{0, 1}` is never used.
- *(r10 text said "relative to `booth_caster` … the default `{0, 0}`". That is wrong since rev 12 moved the default; fixed here.)*
- The new knobs (`scale_snap`, `rotate_with_facing`, `booth_*`) then arrive as default answers at rev 12 values (`booth_rows` 2, `booth_caster` `{0, 1}`, `booth_foe` `{1, 1}`).
- The list is flagged `catalogueChanged`, and the old list is kept as an orphan copy.
```json
{
  "before_item": {"id": "step-1", "label": "Step 1", "kind": "trace", "points_anchor": "board", "trace_points": [{"c": 1, "r": 0}, {"c": 2, "r": 1.5}]},
  "after_item": {"id": "step-1", "label": "Step 1", "kind": "trace", "anchor": "caster", "trace_points": [{"dc": 1, "dr": 0}, {"dc": 2, "dr": 1.5}]},
  "op": {"seq": 5, "at": "2026-11-09T20:24:00.000Z", "kind": "migrate", "note": "catalogue 9 → 12: points_anchor → anchor (board → caster); points {c,r} → {dc,dr} relative to legacy_relative_to {0,0} (no stored booth_caster); 6 new settings",
    "changes": [{"knob": "steps", "before": {"source": "user", "defaultRef": {"rev": 9}, "needsReask": null}, "after": {"source": "user", "defaultRef": {"rev": 12}, "needsReask": {"reason": "catalogueChanged", "at": "2026-11-09T20:24:00.000Z", "note": "value_converters: {c,r} → {dc,dr}"}}}]}
}
```
- `rotate_with_facing` is `true` by default, but booth and BTF pieces have no facing, so rotation is the identity and the trace draws exactly as before.
- The stored points are identical to the old absolute ones (the frame was `{0, 0}`), and Preview and Render are unchanged.
- **Exporting to the booth at rev 12 defaults** gives `board` 2×2, caster `{0, 1}` and the points `{c: 1, r: 1}`, `{c: 2, r: 2.5}`: the same shape relative to the caster, one row lower on the bigger board. That's the default move, listed in the defaults-moved notice. A user who wants the old frame back sets `booth_rows` 1 and `booth_caster` `{0, 0}`, and the export returns `{c: 1, r: 0}`, `{c: 2, r: 1.5}`.

---

## 11. What the Edit screens need

Writer calls are pure: `(input) → { doc, changed, flagged, unflagged, warnings } | { error }`. Persist with `saveSetup(doc, expectedRev)`. Reader calls never mutate.
Errors: `unknownKnob`, `invalidValue {type | options | colour | item}`, `staleRev`, `nothingToUndo`, `nothingToRedo`, `wrongBehaviour`, `readOnly`, `duplicateName`. **Range, step, ref and ban problems are never errors; they come back in `warnings[]`.**

| Call | Package | Input | Output / effect |
|---|---|---|---|
| `loadSetup(raw, slice, presets)` | writer | JSON, plus the project slice and preset stores | `{doc, notices[], readOnly}`. Runs §8 in memory. |
| `viewSetup(doc, ctx)` | reader | — | Rows by question: `{knobId, label, type, min, max, step, options[{value, label, status?, ruling?, note?, proposed?}], helper (single_option_reason), effective, source, isDefault, active, required, pairedWith?, ruling?, presetName?, presetChanged?, needsReask, checks[], canReset}`. Inactive rows are collapsed. |
| `check`, `readiness`, `listMissing` | reader | — | §2.5 |
| `listNeedsReask` | reader | — | Stored flags (`parentChanged > catalogueChanged > renamed`) and then warning checks |
| `wizardQuestions(slice, ctx)` | reader | — | Active `ask_in_wizard` knobs, in `menu_order` |
| `editAnswer(doc, knobId, value, expectedRev?, note?)` | writer | — | `set` op, then R1 |
| `saveBackFromPreview(doc, tweaks)` | writer | Godmode tweaks for this setup | One `set` op with `note:"preview"`. `invalidValue` tweaks go in `skipped[]`. For the stage and unit layers, see project-format `saveBackGodmode`. |
| `resetAnswer`, `resolveReask`, `undo`, `redo`, `canUndo`, `canRedo`, `duplicate` | writer / reader | — | §4, §5 |
| `savePreset`, `applyPreset`, `diffPreset`, `updateFromPreset`, `listPresets`, `addPresetToLibrary`, `forkPresetToLibrary` | writer (`diffPreset`, `listPresets`: reader) | — | §6 |
| `isActive(doc, knobId, ctx)`, `activeBehaviour(behaviourId, ctx)` | reader | — | §2.6 |
| `describeSetup` | reader | — | Starts with the first hard row, or "ready to play" plus a warning count. For effect documents: skillrig's `describeSkill` sentence. |
| `editListItem(doc, knobId, itemId, field, value)`, `addListItem(doc, knobId, item, index?)`, `removeListItem(doc, knobId, itemId)`, `moveListItem(doc, knobId, itemId, index)` | writer | — | One `set` op on the list answer. Refuses `readOnly {item}` (built-in rename/delete) and `invalidValue {item}` (reserved/duplicate id, bad field). Over the cap: accepted with `overCap`. |
| `refTargets(knobId, ctx)` | reader | — | `[{id, label, builtin: bool}]`: builtins plus the current list items or effect documents |
| `createEffect(project, fromBuiltin?)`, `importSkillSpec(project, text)`, `exportSkillSpec(doc)` | writer / reader | — | §2.10 |

Screen rules:
1. Source chips: Default, You, or "Preset rN". Option and knob rulings show as info chips.
2. Reset appears only when the source is not `default`.
3. Play and Render are disabled only by hard rows, and they jump to `listMissing[0]`. Warnings show a banner with "Play anyway" / "Render anyway".
4. Never blank, clamp or snap a value.
5. Show the preset-changed hint, and a diff sheet with one Apply button that makes one undo step.
6. The defaults-moved and renamed banner shows once per load.
7. Sliders use `step`. Colour knobs use a picker that emits `#rrggbb` (or `rgba(…)` when alpha < 1).
8. Preview's "Save" asks what and where (§4 rule 9). Each target produces one undo step.
9. The ability-presentation screen offers All menu / All cards / Custom. Custom reveals the per-group pickers and the user-group list.
10. List rows: built-in items show a lock on id and no delete; the Add button stops at `max_items` with the reason.
11. Each owner has an "Effect" row: None, the 10 BTF effects, the project's effect documents, and "Make my own…" (§2.10).

---

## 12. Decisions

### 12.1 Chief Of Staff decisions D1–D5 (2026-11-09; the CEO may override), as amended by C4

| # | Decision | r4 status |
|---|---|---|
| D1 | Play is blocked while a required answer is missing | **Amended by C4.** Blocked only by hard checks on active answers: `requiredUnanswered`, `noDefault`, `invalidValue`. Out-of-range and off-step values are warnings now (they blocked in r3). |
| D2 | Presets are copied on apply. "Update from preset" diffs per answer and is one undo step. | Unchanged |
| D3 | Default answers follow the catalogue, with a notice. User and preset values never change. | Unchanged. Renamed options keep the user's choice under the new name. |
| D4 | `step` is a catalogue field, and off-step values are rejected on edit | **Amended by C4.** Off-step values are accepted with a warning everywhere. Never snapped. |
| D5 | Library plus `<id>@<rev>` embeds; embedded wins | Unchanged. Web storage is OPFS (§6.3). |

### 12.2 Chief Of Staff rulings from ARCHITECTURE v0.2 §11 (2026-11-09; the CEO may override)

| # | Ruling | Here |
|---|---|---|
| C1 | Split into the read-only `@te/project` and the editor-only `@te/project-write`, with shared types | §8.1, §9, §11. Boundaries: project-format §11.1. |
| C2 | Godmode "this stage" / "all stages" | §4 rule 9, project-format §7.1 |
| C4 | Warn, don't block | §2.5, §6.2, §7, §10.4, §12.1. Full audit: project-format §13. |
| C6 | Per-group presentation | §2.6, §2.9, §10.7–10.9 (rev 7: shipped as named gates plus `custom_groups`) |

CoS project rulings P1–P6 are **CEO-approved 2026-11-09** (project-format §14). P6 (`no-draw → clock-loss`) is in §10.5.

### 12.3 Earlier Librarian answers (gaps.md §8, r3), still valid
- Q1: migration 001 resolves `defaultRef.rev` once.
- Q2: `knobHash` is retired; `rev` is the only drift signal.
- Q3: `@behaviourId`, which rev 5 adopted.
- Q4: tombstones `{id, since_rev, reason}`, which rev 5 adopted.
- Q5: no `canonical_path`, removed in rev 5.
- Q6: pin `catalogue.rev` only.

### 12.3a Keeper calls approved by the Chief Of Staff (2026-11-09)
| # | Call | Here |
|---|---|---|
| A1 | Format v3: checks that are a pure function of the values and the catalogue are derived on read, and `needsReask` stores event flags only (migration 002) | §2.2, §2.5, §8.1 |
| A2 | Ability groups: `custom_groups` is a `list` answer in `ability-presentation`, and each ability-owning behaviour has an `ability_group` `ref` answer (default `spells`) | §2.9. Shipped in rev 7. |

### 12.4 Catalogue rev 5 and rev 6: confirmed or adjusted

| Feature | Keeper decision |
|---|---|
| Behaviour renames (`card-recursion → ability-refresh`, `bot-priority → bot-ability-priority`) | **Confirmed.** §8.2 step 1, then knob renames looked up in the new behaviour (§10.6). Built-in preset ids are rewritten. |
| Knob renames (`card_costs_action`, `focus_card_actions`, `focus_card_mana`, `card_cap` ×2, `card_offer_levels`, `lucifer_draw_levels`, `cards_locked`, `barrier_blocks_leap`, `max_returns`, `max_returns_unlimited`, and rev 6 `style`) | **Confirmed.** §8.2 step 2, scoped per behaviour. Applies to setups, presets, stage overrides and unit stats. |
| Option renames (`on-cast`, `card-stays`, `acolyte-deck`, `no-draw`, and rev 6 `unit-action-menu → all-menu`, `card-hand → all-cards`) | **Confirmed.** §8.2 step 3, from `options[].renamed_from` only. The fallback rule is retired. |
| Dotted gate leaves vs `{behaviour?, knob, eq}` | **Confirmed dotted** for gates (same syntax as `depends_on`). The reader normalises the old form. Bans keep their own `{behaviour?, knob}` objects. |
| Nested `any` / `all` | **Confirmed.** A leaf on an inactive answer is false. Please don't add negation (L15). |
| Behaviour-level `active_when` | **Confirmed** as authoritative for behaviour activity (§2.6). |
| `required` | **Confirmed, active-only.** A default-source answer on an active required knob is a hard check. |
| `ask_in_wizard` | Wizard hint only |
| `single_option_reason`; option `status` / `ruling` / `note` | Info only (§2.7) |
| `events`, `event_map` | **No setup or project storage.** Render wiring only (§2.8). |
| Ban ids keep their old text | **Fine.** They are opaque, and bans are derived (L12 withdrawn). |
| Gate change and `knob.rev` | **Don't bump** (§8.3) |

### 12.4a Catalogue rev 7: confirmed or adjusted
| Feature | Keeper decision |
|---|---|
| `list` / `ref` (L13): `custom_groups`, `ability_group` ×37, `effect` ×37 | **Confirmed** (§2.9). `effect`'s target moves to effect documents (§2.10, L19). |
| `some` leaf (L14) | **Confirmed.** Picker/toggle item fields only; false on an inactive or empty list. |
| No negation (L15) | **Confirmed.** A rejected gate reads as false. |
| Named gates (L16): 2 definitions, 31 refs | **Confirmed.** Inlined by `readCatalogue()`; copied into the slice. |
| `per_unit` (L11) on `unit_hp`, `unit_atk` | **Confirmed.** They are the only `unit.stats` keys (project-format §6.3). `sword-lifecycle.unit_hp/unit_atk` stay as they are: they are a template, not per-unit. |
| `one_unit_per_tile` (L17) | **Confirmed.** Off removes the overlap warning per stage (project-format §13). |
| `terrain.tile_types` (L18) | **Confirmed** as the single home of tile meanings; the map palette refers to its ids (project-format §6.4). Edges stay in `barrier-line`, and the map stores authored wall positions in `logic.edges`. |
| Rev rule (gate changes don't bump) | **Confirmed**; extended to list fields (§8.3) |
| `max_items` | **Adopted** as a soft cap (§2.9.2) |
| Reserved ids in the catalogue default | **Adopted**; r4's "a reserved id is always invalid" is replaced by §2.9.3 |
| `effect.saved_effects` | **Superseded** by effect documents (§2.10). Retire it (L19). |
| `item_cites`, `item_sources` | Info only. The slice drops them, like `default_source`. |

### 12.4b Catalogue rev 8: confirmed or adjusted (r8)
`catalogue_rev` 8 has 61 behaviours and **461 knobs**: 162 sliders, 118 pickers, 86 toggles, 78 refs, 11 colours and 6 lists. L19–L26 shipped. The stored shape needs no format change (still `behaviour-setup` v3, `behaviour-preset` v2).

| Feature | Keeper decision |
|---|---|
| L19: 39 `effect` refs → `{docs: "effect", builtin: none + 10}`; `effect.saved_effects` tombstoned since 8 | **Confirmed.** Drift step 4 moves the old answer to `orphans` (§10.12). The reader's "ignore `ref.list`" stopgap (§2.10) is retired. |
| L20: soft `max_items`, `max_items_hard` in the schema, `effect.steps` `min_items: 1` | **Confirmed** |
| L21: item `colour`/`text`/`tile`/`tiles` and the skillrig fields; `effect.cue`, `effect.tags` | **Confirmed**, with three adjustments in §12.7: `cue` becomes a knob-level `text` (L28), tags are capped at 16 (L29), and off-board points are a derived warning. |
| L22: `ability_group` + `effect` on `objective-contest` (`spells`) and `sword-lifecycle` (`basic`); 39 owners | **Confirmed** (§2.9.5) |
| L23: reserved-id rules 1–4 in the validator | **Confirmed** (§2.9.3) |
| L24: `terrain.wall_blocks_los` / `wall_blocks_shots` | **Confirmed**; the Engine Architect confirmed them too (r8) |
| L25: `unit-roster.clip_cues` | **Confirmed**; the Engine Architect confirmed it too (r8) |
| L26: `ability-presentation.team_colours` (project palette) + `unit-roster.team_colour_override` / `team_colour` | Home **confirmed**. **Adjusted:** `team_colour` becomes nullable with default `null` = inherit the palette, and the override toggle is retired (L30, §12.7 Q5). |
| Behaviour field `export: "always" \| "with-setup"` | **Kept, renamed** to `closure` (L31, §12.7 Q4) |
| Validator test changes | **Accepted** (§12.7 Q6) |

**Drift rev 7 → 8** (§8.2, one `migrate` op per document):
- **Added knobs**, as `source:"default"` answers: `team_colours`; `wall_blocks_los` / `wall_blocks_shots`; `clip_cues`, `team_colour_override`, `team_colour`; `cue`, `tags`; `ability_group` + `effect` on 2 owners.
- **Retired:** `saved_effects` moves to `orphans`.
- **List item fields added** (`effect.steps` gained 8): stored items read them at the item spec default. Nothing is written and **nothing is flagged** (§8.2 list rule, r8).
- **Re-verification:** every example here and in project-format r7 was checked against rev 8 (knob ids, option values, slider ranges, list item fields, reserved ids, ref targets, preset ids, `per_unit` stat keys). There were 0 problems. The only retired answer is §10.11's `saved_effects`. The checker is `/workspace/scratch-format/_gen/verify_r8.py`.

### 12.4c Catalogue rev 9: confirmed or adjusted (r10)
| Item | Keeper decision |
|---|---|
| L27 `water` / `lava` / `wall-block` (**r13: CONFIRMED**, Engine Architect, gaps §19) | **Confirmed**, with one change: **`wall-block` blocks forced movement** (ruling, 2026-11-09), so `push_can_enter` → `false` (L34). |
| L28 `text` + `effect.cue_name`, `cue` convert | **Confirmed**; drift in §10.13 |
| L29 `label_max_len`, tags 16 | **Confirmed** |
| L30 nullable `team_colour`, override fold | **Confirmed**; drift in §10.13, with no answer lost |
| L31 `closure: "always"` (terrain only) | **Confirmed**; barrier-line has none |
| L32 `asset` item type, `steps[].picture`, `effect.picture` | **Confirmed** (project-format r9 §6.7) |
| Fade, `cue_at`, `pierce`, `jitter`, `size_spread` steps (0.01 / 0.5 / 0.02 / 0.01), per spec.ts | **Accepted.** Source precision beats the 0.05 we suggested. |
| `steps.points_anchor` `board` (default) / `caster` / `target` | **Superseded by rev 10:** retired into `steps[].anchor` (caster default) with a converter (§10.14) |
| `effect.ui_derived`, preset `display_name` / `blurb` | Info only; the slice drops `ui_derived`, and keeps `display_name` / `blurb` for the editor |
| gaps §15 Q1 effect scale | **CoS:** all effect sizes (stock shapes, including `drawBlade`, and uploads) snap to whole zoom steps by default. That's `effect.scale_snap`, a stored knob, `whole` by default (rev 10). `fractional` takes effect only with `advancedRender`; otherwise it's kept and read as `whole`, with a warning (project-format r9 §6.7). `drawBlade`'s fractional scale is an engine gap. |
| Q2 rotation | **CoS:** `rotate_with_facing`, default **true**; the identity when the anchor unit has no facing (Engine Architect) |
| Q3 preset merge | **CoS:** merged into recipes (rev 10 preset field `recipe`: `drop` = purple-drop/cut/heaven-sword/feather/spike; `holy-drop` = holy-blade; `cone` = wrath-cone; `reel` = chain-hook; `spin-fly-together` = spin-fly-together; `spin-split` = spin-split). **All 10 built-in ids are kept 1:1**, so every stored `effect` answer and `presetRef.presetId` (`builtin:effect/btf-*`) resolves unchanged. **No alias table and no migration is needed.** If a later rev ever removes an id, it must ship `renamed_from` on the preset (§6.4 drift step 1 rules); never a silent drop. |
| Q4 blade vs picture | Editor greys out `blade` while `picture` ≠ `none`. No gate needed. |
| Q5 wall-block push | **CoS:** stops all forced movement (`push_can_enter: false`). `terrain.push_into_walls` defaults to false and covers wall-block tiles only. Edge walls always stop forced movement (core topology). Shipped in rev 10. |
| Q6 off-board with anchors | As the Librarian says: the on-read check is `board`-only. The runtime clamps and warns for relative anchors (project-format r9 §6.7). |

**Re-verification:** every example in both files was re-checked against rev 9 (`_gen/verify_r8.py`): **0 problems**. No example holds a `cue` or `team_colour_override` answer, so rev 9 changes nothing in them beyond ordinary drift. §10.13 shows both conversions.

### 12.4d Catalogue rev 10: confirmed (r10)
| Item | Keeper decision |
|---|---|
| L33: `{dc, dr}` points, `steps[].anchor` (caster default), `points_anchor` retired with convert, `rotate_with_facing` (true), `booth_cols` 2 (2–8), `booth_rows` 1 (1–10), `booth_caster` {0,0}, `booth_foe` {1,0}, knob type `tile` | **Confirmed as shipped.** The `to/fromSkillSpec` round trip was re-checked (project-format r9 §6.7): exact both ways via `fromSkillSpec(spec, base)`, and lossy only past the booth range (a `boothClamp` notice). |
| L34: `wall-block.push_can_enter: false`; `terrain.push_into_walls` (false), wall-block tiles only | **Confirmed.** Edge walls always stop forced movement. |
| `effect.scale_snap` `whole` / `fractional` | **Confirmed** as a stored knob, with keep-but-ignore while `advancedRender` is off (warning) |
| `retired_item_fields`, `value_converters` | **Adopted under these names** (§8.2) |
| preset `recipe` field (Q3) | **Confirmed**; ids unchanged (§12.4c Q3) |

**Re-verification at rev 10:** all examples in both files (`_gen/verify_r8.py`): **0 problems**. No example holds `points_anchor` or point values, so the rev 10 converters change nothing in them; §10.14 shows the conversion.

### 12.4e Catalogue rev 11 and rev 12: confirmed (r11)
| Item | Keeper decision |
|---|---|
| Rev 11 `rotate_with_facing`: identity without a facing; facing never inferred from side | **Confirmed** (matches the r10 rule; §2.9.4) |
| Rev 11 `scale_snap` draw rule (uploads `k = max(1, round(wanted/source))`; stock dims `max(1, round(tile × factor × shapeScale))`) | **Confirmed**; recorded in project-format r11 §6.7. The engine gap is the Architect's. |
| Rev 11 knob fields `disabled_when` (gate grammar plus the `in_docs` leaf, legal only there), `disabled_reason {text, action?}` | **Confirmed as UI-only.** A disabled knob's answer is **kept and stored** and still drifts and migrates. It's the keep-but-ignore pattern (no check, no flag). `in_docs` is evaluated on the answer's current value against `{docs}` refs. First use: `effect.blade`. |
| Rev 12 booth 2×2 (`booth_rows` 2, `booth_caster` `{0,1}`, `booth_foe` `{1,1}`) | **Confirmed**: a CoS default, reversible. It's an ordinary default move (step 6 and the notice). `toSkillSpec` output of default answers moves, and the `{dc, dr}` points don't. |
| Rev 12 `value_converters[].legacy_relative_to` | **Adopted** (§8.2). The L33 converter is worded as the Librarian asked. |

**Re-verification at rev 12:** every example in both files: 0 problems (`_gen/verify_r8.py`). §10.14 was the only example that converted relative to a default; it's fixed.

### 12.4f Catalogue rev 13: adopted (r13 in place)
`catalogue_rev` **13**: 61 behaviours, **502 knobs** (rev 12: 468).
- **`mana_cost`** is added to 34 owners. These are added knobs, so they get default answers at drift (§8.2 rule 5). Nothing is flagged.
- **`bans_note`** is a behaviour-level text field. It's catalogue only and never stored in setups.
- **`keyed_by: "side"`** and **`item_rulings`** are info for the reader. Items stay matched by id.
- **L35 shipped:** `team_colours` = `player` #badcff, `rival` #c44a3a, `neutral` #8a8f98 (PROPOSED colour, Engine Architect ruling), and `reserved_ids` player/rival/neutral. The format-level reservation from r13 now matches the catalogue.
  - A user list from rev 8–12 without a `neutral` item gets the defaults-moved notice. The **neutral side then draws from the catalogue default item** (a reserved id always resolves).
  - A user item `neutral` from before rev 13 is matched by id to the built-in, and its colour is kept.
- The slider default-range validator check is the Librarian's. It isn't a format rule.
- **Re-verification at rev 13:** every example in both files: 0 problems (`_gen/verify_r8.py`). No example held a `team_colours` answer, so none needed a change. The new §2.11 example is a rev 13 snapshot.

### 12.4g Catalogue rev 14: adopted (r14)
`catalogue_rev` **14**: 61 behaviours, **515 knobs** (rev 13: 502).
- **Added knobs:** `mana-gain` becomes "Resource gain", an owner (`target`, `condition`, `mana_cost`, `ability_group`, `effect`); `hand-and-draw.deck`; `terrain.lethal_landing_scope`; `terrain.lanes_enabled` / `lane_axis` / `lane_count` / `lane_field_lanes`; `push-knockback.wall_slam_damage` / `wall_slam_scaling`.
  - These all arrive as default answers at drift, and nothing is flagged (§8.2 rule 5).
  - The 12 widened ranges (CoS, PROPOSED) flag nothing: a stored value stays valid. The editor's `outsideBtf` is a warning.
- **Retired:** `hand-and-draw.deck_size`, by a `derive` tombstone. The answer is kept in `orphans` (§8.2, owner rule; L39).
- **Behaviour/catalogue-level fields** are **catalogue only, never stored in setups**: `composable_as`, `target_pipes`, `numeric_inputs`, `adjusts`, `aliases`, `invariants`, `resource_ref`, `resolved_conflicts`, top-level `composition_rules` and `compositions[]`.
  - Knob fields `ability_field` and the ref `docs: "deck"` (+ `nullable`) are read by the reader (§2.11, project-format §6.8).
- **Name check (owner brief):** none of `composable_as`, `target_pipes`, `numeric_inputs`, `adjusts`, `ability_field` or `deck` duplicates an r13 field. r13's modifier `role` is an instance value, and `composable_as` lists the roles a behaviour allows. **No renames.**
- **EA terrain items:** `push_into_walls` now covers edge walls **for the event** (`pushBlocked`), and edge walls still always stop the move. With it off, a forced move still stops short, with no event. `wall_slam_*` is push-behaviour rules. `enteredLane {unit, lane}` is a lanes rule hook.
- **No `present-card-hand` behaviour exists.** The card-hand draw is `hand-and-draw` (rev 14 note). The two project-format references are fixed.
- **Re-verification at rev 14:** every example in both files: 0 problems (`_gen/verify_r8.py`). The §2.11 example is now a rev 14 `sky-drop` snapshot.

### 12.4h Catalogue rev 15: adopted (r14 in place, 22:3x)
*Historical: the current pin is rev 24 (§12.4k). This section records the rev 15 adoption as it was.*
`catalogue_rev` **15**: **63 behaviours, 538 knobs** (rev 14: 61 / 515). **L39–L43 adopted**, and the docs match the shipped catalogue:
- **L39:** `derive.old_answer: "kept-inactive"` (§8.2).
- **L40:** `composition_rules.ruling.note` says `{setupId, role}` (§2.11).
- **L41:** `tile_types.buildable` is false on all 13 built-ins. The list knob bumps to rev 15, but an added item field flags nothing (§8.2 r8 rule).
- **L42:** `one_unit_per_tile` is retired by `convert.to_setting` → `settings.occupancy` (§8.2 converter, as drafted).
- **L43:** `terrain.centre_lane`.
- **Mismatch fixed:** "no pipe" is `target_pipes: []` + `targeting: "none"` (§2.11). The rev 14 text said `target_pipes: none`.
- **Also new, catalogue only:** `composable_as` `trigger`; mode-scoped behaviours `resource-meter` (scaler) and `auto-cast` (trigger), with `modes: ["idle-rpg", "td"]`, `v1: false` and `scope: "modes-proposed"`. A project may store setups for them, but v1 runs nothing for them (inactive, info).
- **G5:** 15 added threshold knobs get default answers at drift, and nothing is flagged.
- **Defaults moved to code values:** `random-strikes.neutrals_targetable` → true, `radial-volley.barrier_soaks` → false, `target-lock.lock_when` → after-launch. These are the ordinary defaults-moved notice (step 6). User answers are unchanged.
- **`unit-roster.opening_row`: RULED** (CEO 2026-11-09, via the CoS; closes gaps §21 conflict 7): **the bot's opening formation is the user's choice.** It's a picker of three values:
  - **`back`**: six on the far rank. **Default, preselected**, so existing data is unchanged.
  - **`second`**: six on the second rank, not the back row.
  - **`front`** ("Five on the front rank (deck shape)"): five on the front rank, read from **`deck.openingFront`** (`unitId[]`, exactly 5, west to east; the bot side's effective `hand-and-draw.deck`; project-format §6.8). **`back` and `second` ignore it.**
    - **No deck at all, or a missing or malformed shape** (not an array, or not exactly 5 entries) → it opens **`back`** with **`openingShapeMissing`**: once per deck, or **once in total when there's no deck**.
    - **A bad id** (not a unit) → **`unknownRef`**. That slot stays empty, and the other four are still placed.
  - The catalogue change is **L44**, **adopted**: `second` shipped in rev 16, and `deck.openingFront` was named in rev 17 (§12.4i). The added option flags nothing (§8.2 step 6).
- **Re-verification at rev 15:** every example in both files: 0 problems (`_gen/verify_r8.py`).

### 12.4i Catalogue rev 16 and 17: adopted (r14 in place, 22:4x)
*Historical: the current pin is rev 24 (§12.4k). This section records the rev 16 and 17 adoption as it was.*
`catalogue_rev` **17**: **63 behaviours (61 grid + 2 modes), 544 knobs** (rev 15: 538). The validator is clean, and **`CATALOGUE.md`** is promoted (internal only; the draft is no longer built).
- **L44 adopted:** rev 16 shipped `opening_row` = `back` | `second` | `front`, and rev 17 named the `front` option's `reads.ref` **`deck.openingFront`** (`unitId[]`, length 5, west to east, `deck_from: hand-and-draw.deck`).
  - The fallback is `back` + `openingShapeMissing` (once per deck, or once in total with no deck), and a bad id is `unknownRef` with its slot empty.
  - The `front` label is DSK's "Five on the front rank (deck shape)". The docs match the shipped option exactly (§12.4i, project-format §6.8).
  - **There's no mismatch left:** the earlier "`second` would fail" note is removed.
- **Catalogue-only fields** (never stored in setups): status `CONFIRMED`, `code_differs`, `source_divergence` and the option field `reads`. `reads` documents a rule that this format owns (§6.8), so the format stays the single source of the rule.
- **Added knobs** (default answers at drift, nothing flagged): `teleport.needs_action_left`, `objective-contest.green_spends_action`, `special-meter.first_scope`, `xp-levels.level_rule`, `xp-levels.pvp_kills`, `sword-lifecycle.rival_steps_back_after_leap`.
- **Defaults moved by ruling** (the ordinary defaults-moved notice; user answers are unchanged): `radial-volley.barrier_soaks` → true (CEO), `teleport.spends_action` → false, `sword-lifecycle.landing_needs_clear_line` → off (CoS), and the 87 docs-only defaults → status PROPOSED (status only, values unchanged).
- **Re-verification at rev 17:** every example in both files: 0 problems (`_gen/verify_r8.py`).

### 12.4j Catalogue rev 18–23: adopted (r28)
*Historical: the current pin is rev 24 (§12.4k). This section records the rev 18–23 adoption as it was.*
`catalogue_rev` **23**: **63 behaviours (61 grid + 2 modes), 563 knobs**: 215 sliders, 145 pickers, 95 toggles, 82 refs, 11 colours, 7 lists, 6 text, 2 tiles (rev 17: 544 knobs; 210 / 135 / 93 / 82 / 11 / 6 / 5 / 2). Also 357 menu steps, 36 bans, 30 presets, 9 effect recipes, and 1 idea (not a behaviour, not counted). `behaviours.json` sha256 `7f80c56f…` matches the Librarian's (checked 2026-11-15 13:3x). Validator 0/0 and breaktest23 503 checks with 0 failures (gaps.md §29). It was built from this doc at r27 (`17d2041b`) and project-format r37 (`8ebcbead`). Revs 18–23 are adopted together, and this supersedes the rev 17 pin (§12.4i).
- **Rev 18 (notes only; 544 knobs):** option `reads.type_source`, `source_divergence.ruling_note`, and the catalogue's own `warning_source` line refs re-pointed at these docs. No knob rev moved. *Correction (gaps.md §23–§24, rev 23):* rev 18 didn't re-pin these docs. This section is the re-pin.
- **Rev 19 (546 knobs):**
  - Knob fields `v1: false` + `future_note`, and future options (`v1: false` + `note`). Catalogue only, never stored. A future knob's answer is kept and drifts like any other.
  - Top-level `ideas[]` (first entry `npc-role`, status IDEA). An idea isn't a behaviour and is never stored in setups.
  - Added knobs `sword-lifecycle.landing_check_tiles` (picker `"8"` | `"4"`, default `"8"`) and `xp-levels.unlock_pick_count` (slider 3, range 1–3).
  - Default moved by ruling: `sword-lifecycle.landing_needs_clear_line` → on (CEO 2026-11-10; knob rev 19).
- **Rev 20 (550 knobs, 27 presets):** the CoS v1 rule, recorded as `ruling` / `ruling_note` (catalogue only). Added knobs `xp-levels.unit_unlock_when`, `unit_unlock_levels`, `unit_unlock_pairs` (list, items `{first, second}`, `max_items` 3 soft, default `[]`) and `sword-lifecycle.seam_blocks_diagonal_landing` (off). New presets `btf-bot-pairs-statues`, `-acolytes`, `-terrain`, `-choir`.
- **Rev 21 (550 knobs):** idea fields `objective_types`, `specs`, `unresolved_refs`, and the behaviour field `rulings[]` (first use `barrier-line`). Catalogue only, never stored. No knob or default changed.
- **Rev 22 (551 knobs):** added knob `xp-levels.unit_unlock_sides` (picker `both` | `bot_only`, default `both`).
- **Rev 23 (563 knobs, 30 presets):** L45–L48 (below) and the SCHEMA.md "Rev 23" validator extension, which is backward compatible (rev 22 still validates 0/0). It adds nullable pickers whose default is `null`, mixed string and integer option values, strict typed matching (`"3"` is never 3), option `renamed_from` as accepted spellings, nullable picker and slider items, the item type `ref` (`{docs: "asset"}`), and `item_absent_reads_default` on `effect.steps`. All of it fits this format as written: `KnobValue` already admits strings, numbers and `null` (§9), and `item_absent_reads_default` is the r8 added-item-field rule (§8.2). There's no new stored field. This also answers the r27 L48 question: the schema can hold the mixed nullable picker.
- **Drift from rev 17 to 23 (§8.2):** the 19 added knobs get default answers (step 5) and nothing is flagged. The two knobs with no default get no answer (step 5, r28). `landing_needs_clear_line` follows its moved default (step 6, the defaults-moved notice; user answers are unchanged). `tile_types` and `steps` change only by added items or added item fields, so they don't flag `catalogueChanged` (r8 rule; `tile_types` by §2.9.3 rules 4 and 6). No migration and no format version change.
- **L45 ADOPTED:** `terrain.tile_types` gains the built-ins `path` and `dirt` (items and `reserved_ids`, 13 → 15) in exactly the §12.5 shape (`open`, `push_can_enter`, everything else `false`, the same as `floor`). Knob rev 23, with a `default_history` entry. `wall-block` stays the only catalogue spelling, and `wall_block` stays our reader alias (§2.9.3 rule 7). A project that already had its own `path` or `dirt` item gets it adopted as the built-in (§2.9.3 rule 6).
- **L46 ADOPTED**, matching §2.10.1.1–§2.10.1.4:
  - `steps` `max_items` 12 (soft), `min_items` 1;
  - the kinds `dim`, `stamp`, `particles`, `flash`, and every item field with the §2.10.1.2/3 type, range and default;
  - the five stock pictures, with `steps[].picture` now an item `ref` (nullable, default `null` = inherit);
  - `connect_step` (text, default `""`), the `connect` label, `cue_at` max 20;
  - `ui_derived` `dim_stage` and `flash`, with `speed` and `count` extended;
  - recipe `awakening` and preset `te-astrologer-awakening`, which matches the §12.5 JSON step for step.
- **L47 ADOPTED**, matching §2.10.2:
  - the item fields `flash_shape` … `shine_on`, `start_mode` += `"at-hit"`, `anchor` += `"screen"`, and the picture builtins `none` and `blast-star`;
  - the effect knobs `hit_stop_ms` (0–150), `hit_white_ms` (0–200), `hit_white_target` and `hit_white_mode`;
  - the seven `ui_derived` entries, recipes `explosion` and `pickup`, and presets `te-explosion` and `te-pickup-sparkle`, which match §2.10.2.9 step for step (for `connect`, see gaps item 1 below).
- **L48 ADOPTED, with the r27 amendments:**
  - All 11 step item fields; `draw_layer` += `"behind-unit"` / `"front-unit"`; `hit_white_mode` += `"bright"`. The effect knobs are `start_on` (default `"cast"`), `tint_ramp`, `pixel_scale`, `shake` (0–3, step 1, default 0), `shake_ms` (80–400), `shake_dir` (default `"hit"`) and `squash` (default `false`).
  - **`pixel_scale`:** a nullable picker, default `null`, with the options `"match-sprite"` and the integers 1–6. Each integer option carries `renamed_from` `["1"]` … `["6"]`. That is our alias rule (§2.9.4, §2.10.3.2) exactly, and the catalogue stores the canonical integers (M6). Because the aliases are option `renamed_from`, §8.2 step 3 also rewrites them at drift, with the old value kept in the op's `before`, which gives the same result as M6.
  - **`tint_ramp` (knob and step item) and `light_ramp`:** the options are the six terrain keys plus `fire`, `frost`, `holy` and `venom` (CN-019).
  - **Defaults:** `tint_snap` `"rgb"`, `outline` `"off"` and `lit` `"self"` are the absent meanings. The Rule N values stay editor writes (§12.5 L48 item 4).
  - **Range notes, not mismatches:** `blank_ms`, `smear_ms`, `smear_remnant_ms`, `hit_white_ms` and `shine_ms` are plain sliders from 0 in the catalogue. Their "0, or 40–N" gap stays a reader rule in §2.10.2. The `flash_ms` engine sanity cap (1–10000) lives in this doc only.
- **No spec mismatch found** between the shipped L45–L48 and these docs: names, types, options, defaults and ranges all match, apart from the te-* `connect` value fixed below. Nothing in the catalogue needs fixing.
- **gaps.md §29 items for DSK (r28 rulings):**
  1. `te-explosion` and `te-pickup-sparkle` `connect`: the minimum stays 0.02 (EA 2026-11-15 13:33; spec.ts `normalize()` clamps). The doc JSON now says **0.02**, which is what 0 played as (§2.10.2.9). These are PROPOSED draft bodies in this doc, so they were edited. The ids aren't changed.
  2. Defaults wording: §2.10.3.2 "Catalogue defaults and `null`", plus §2.9.4, §7 and §8.2 step 5.
  3. The §12.5 L48 header now says ACCEPTED (the EA passed D1 2026-11-15 06:31; CN-019 ACCEPTED).
  4. `dim_lights` is requested as **L49** (§12.5). It isn't adopted until it ships.
  5. Librarian wording for the te-* blurbs and for labels these docs don't give: accepted as Librarian wording (§29 odd item 7).
- **Re-verification at rev 23:** every example in both files: 0 problems (`_gen/verify_r8.py` against the live rev 23 `behaviours.json`, 65 values checked). Separately, the three te-* preset JSON blocks (§2.10.2.9, §12.5 L46) match the shipped presets field for field.
- **Open (not blocking):**
  - The te-* presets aren't in the 39 owner knobs' `effect` ref builtins (gaps §29 odd item 6; never requested). That's an **Effect Designer scope item**, with no action now.
  - L49 `dim_lights` (§12.5).
  - Which paint style version carries the `fire` / `frost` / `holy` / `venom` ramps, and when, is an Effect Designer scope item (art and CEO question; UX supplies the colours). Until then they warn `fxRampMissing` and play as absent.
  - The knobs `tint_ramp` and `shake_ms` aren't nullable in rev 23, so a stored `null` there is a wrong type. Writers never emit it, because the editor writes absent. If a `null` tolerance is wanted there too, that's a Librarian change, and it hasn't been requested.

### 12.4k Catalogue rev 24: adopted (r29)
`catalogue_rev` **24**: **63 behaviours (61 grid + 2 modes), 563 knobs**, 30 presets (counts unchanged from rev 23). `behaviours.json` sha256 `342c400f…` matches the Librarian's (checked 2026-11-15 13:5x). It was built from this doc at r28 (`bcedf511`). Validator 0/0, the dry rebuild is byte-identical, and breaktest24 passes 534 checks with 0 failures. This supersedes the rev 23 pin (§12.4j).
- **L49 ADOPTED:** `effect.steps` item `dim_lights`, a picker `"half"`|`"dark"` with default `"half"`; absent reads `"half"`. The steps knob rev is 24. Counts are unchanged at 63 behaviours, 563 knobs and 30 presets, and all btf-*/te-* presets and recipes are byte-identical to rev 23.
- The catalogue's option labels are the Librarian's wording, so EUX may replace them (they're labels, not stored values).
- The catalogue validator rejects unknown `dim_lights` values in catalogue data only. The doc's reader rule (an unknown value plays as half, warns, and is kept) stays the runtime rule for documents.
- **Re-verification at rev 24:** every example in both files: 0 problems (`_gen/verify_r8.py` against the live rev 24 `behaviours.json`).

### 12.5 Open catalogue requests
- **L46 (**ADOPTED in rev 23**, r28 §12.4j, shipped as below; r16; Effects v2, CEO scope accepted 2026-11-12 14:42 via the CoS; EA rulings in plan §13; PROPOSED, to be sent by the owner; for the next catalogue rev after L45). **r17:** the format is ACCEPTED and E3 is DECIDED, which unblocks the request. It's **still pending with the Librarian** and queued after L45. **r18:** all four Keeper-added fields are final (§2.10.1). The engine track is queued after H4.** Changes to the `effect` behaviour. The format is set in §2.10.1, which is the only home for these fields: please copy ranges and defaults from there, not from this list.
  1. **`steps`:**
     - set `max_items` 6 → **12** (soft) and update `default_source` (the booth still slices to 6);
     - bump the knob `rev`. Old lists aren't flagged, because these are only added item fields (§8.2, r8 rule).
  2. **New step kinds:** `dim` "Dim the stage", `stamp` "Stamp a picture", `particles` "Particles", `flash` "Flash and rings".
  3. **New item fields, with the §2.10.1.2/3 types, ranges and defaults:**
     - `start_mode`, `start_at_ms`, `hold_ms`, `fade_out_ms`;
     - `enabled`, `blend`, `draw_layer`, `ground_size`, `stamp_rotate`;
     - `dim_amount`, `dim_keep_units`;
     - `particle_motion`, `particle_count`, `particle_life_ms`, `particle_pull`;
     - `flash_strength`, `flash_ms`, `wave_rings`, `wave_radius`.
  4. **Pictures:**
     - `effect.picture` `ref.builtin` += `rune-circle`, `orbit-rings`, `spark`, `ember`, `smoke`;
     - `steps[].picture` goes from `{type: "asset"}` to `{type: "ref", ref: {docs: "asset", builtin: [the same five]}, default: null}`, with nullable kept.
  5. **New effect knob `connect_step`:**
     - type: text, the id of a step in the list;
     - default `""` = the last of the first 12 steps, enabled or not;
     - `connect` gets the label "When the hit lands in the hit step", with **no other change** to `connect`.
     - `cue_at` max 12 → **20**.
  6. **`ui_derived`:**
     - add `dim_stage` and `flash`;
     - extend `speed` and `count` (§2.10.1.3 rule 3a).
  7. **Preset and recipe.** New recipe **`awakening`** and preset **`te-astrologer-awakening`**:
     - `deck: null`, not a `btf-*` id;
     - display name "Astrologer awakening";
     - blurb and credit from plan §7: "Inspired by @mozza_dev's Astrologer awakening skill. Pictures and motion are TileEngine's own."
     - The booth is 5 × 4, which fits `booth_cols` 2–8 and `booth_rows` 1–10.
     - Steps not shown take the item defaults:
  ```json
  {
    "id": "te-astrologer-awakening", "label": "Astrologer awakening", "display_name": "Astrologer awakening",
    "deck": null, "recipe": "awakening", "status": "PROPOSED",
    "overrides": {
      "hit": "none", "damage_label": "none", "impact": false, "connect_step": "step-7",
      "booth_cols": 5, "booth_rows": 4, "booth_caster": {"c": 1, "r": 2}, "booth_foe": {"c": 3, "r": 2},
      "steps": [
        {"id": "step-1", "label": "Dim the stage", "kind": "dim", "start_mode": "at-time", "start_at_ms": 500, "seconds": 0.4, "hold_ms": 6300, "fade_out_ms": 600, "dim_amount": 550, "fade_on": true, "fade_from": 0, "fade_to": 1},
        {"id": "step-2", "label": "Rune circle", "kind": "stamp", "start_mode": "at-time", "start_at_ms": 700, "seconds": 0.5, "hold_ms": 3900, "fade_out_ms": 300, "anchor": "target", "draw_layer": "ground", "ground_size": 3.5, "picture": "rune-circle", "fade_on": true, "fade_from": 0, "fade_to": 1, "glow_on": true, "glow_from": 6, "glow_to": 6},
        {"id": "step-3", "label": "Orb and rings", "kind": "stamp", "start_mode": "at-time", "start_at_ms": 800, "seconds": 1.4, "anchor": "target", "draw_layer": "air", "blend": "add", "picture": "orbit-rings", "stamp_rotate": 180, "scale_on": true, "scale_from": 0.6, "scale_to": 1.2, "glow_on": true, "glow_from": 16, "glow_to": 24},
        {"id": "step-4", "label": "Rings shatter", "kind": "particles", "start_mode": "at-time", "start_at_ms": 2100, "seconds": 1.2, "anchor": "target", "blend": "add", "picture": "spark", "particle_motion": "spiral-in", "particle_count": 20, "particle_life_ms": 1000, "particle_pull": 1200},
        {"id": "step-5", "label": "Point drops in", "kind": "straight", "start_mode": "at-time", "start_at_ms": 3250, "seconds": 2.2, "blend": "add", "picture": "spark", "glow_on": true, "glow_from": 20, "glow_to": 20},
        {"id": "step-6", "label": "Foot rings", "kind": "flash", "start_mode": "at-time", "start_at_ms": 4900, "seconds": 0.6, "anchor": "target", "flash_strength": 0, "wave_rings": 2, "wave_radius": 0.75, "tint_on": true, "tint_from": "#67e8f9", "tint_to": "#67e8f9"},
        {"id": "step-7", "label": "Flash and shockwave", "kind": "flash", "start_mode": "at-time", "start_at_ms": 5500, "seconds": 0.7, "anchor": "target", "draw_layer": "overlay", "flash_strength": 550, "flash_ms": 100, "wave_rings": 2, "wave_radius": 4},
        {"id": "step-8", "label": "Smoke", "kind": "particles", "start_mode": "at-time", "start_at_ms": 6200, "seconds": 2.0, "anchor": "target", "picture": "smoke", "particle_motion": "rise", "particle_count": 8, "particle_life_ms": 1800},
        {"id": "step-9", "label": "Embers", "kind": "particles", "start_mode": "with-last", "seconds": 2.2, "anchor": "target", "blend": "add", "picture": "ember", "particle_motion": "rise", "particle_count": 12, "particle_life_ms": 2000}
      ]
    }
  }
  ```
  - **Checks:**
    - 9 steps, which is at most 12;
    - 20 + 8 + 12 = **40 particles**, under the soft cap of 48;
    - the effect ends at 8.4 s;
    - one flash start, white, so no `flash_risk` (§2.10.1.6).
    - The preset's `seconds` stay within 0.15–3, because long beats use `hold_ms`.
    - The orb in plan §7 is `spark` with glow, so no sixth picture is needed.
  - **No BTF preset changes:** the 10 `btf-*` presets keep their stored overrides, and the absent v2 fields keep them pixel-identical.
  - The **Keeper doesn't edit `behaviours.json`**. This is a request.
- **L45 (**ADOPTED in rev 23**, r28 §12.4j, shipped exactly as below; r15; Engine Architect 2026-11-12, EUX r65 Q-A1/Q-A4; sent by the owner; for catalogue rev 23).** Add two **built-in walkable land** items to `terrain.tile_types` (and to `reserved_ids`), so Brick path and Dirt mean something without a user type. Use the rev-15 item shape:
  ```json
  [
    {"id": "path", "label": "Path", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": false, "buildable": false},
    {"id": "dirt", "label": "Dirt", "open": true, "kills_on_landing": false, "push_can_enter": true, "slows_move": false, "trips": false, "buildable": false}
  ]
  ```
  - It's the same walkability as `floor`: cosmetic land, not walls. Edge walls stay in `map.logic.edges`.
  - `tile_types` bumps its knob `rev` (append a `default_history` entry), exactly as rev 9 did for L27. Existing answers drift by §2.9.3 rules 4 and 6: the new built-ins are appended to the effective value, and nothing is written.
  - **No catalogue rename for `wall_block`:** the catalogue id was always `wall-block`. The alias is a reader rule in this format (§2.9.3 rule 7), because the stray spelling comes from the painter mock (`ui-shell/js/stage-live.js`, `index.html`). Please keep `wall-block` as the only catalogue spelling.
  - After rev 23 ships, the Keeper adopts revs 18–23 together in a new §12.4j and moves the rev-17 pins (L9, L91 here; project-format §2). **Done (r28):** §12.4j adopts revs 18–23, and the pins say rev 23 (the Inputs list; project-format r38 §2).
- **L44 (r14; CEO ruling 2026-11-09 via the CoS; sent by the owner; **ADOPTED**: `second` in rev 16, `reads` → `deck.openingFront` in rev 17, exactly as below).** `unit-roster.opening_row` gets three options: `back` "Six on the far rank" (default, unchanged), **`second` "Six on the second rank"** (new), and `front` "Five on the front rank (deck shape)".
  - `front` reads the deck field `openingFront` (`unitId[]`, exactly 5, west to east; project-format r14 §6.8). If there's no deck, or the shape is missing or malformed, it runs `back` with `openingShapeMissing` (once per deck, or once in total with no deck). A bad id is `unknownRef`, with its slot empty and the other four placed. `back`/`second` ignore it.
  - Please cite the ruling in `ruling` and move gaps §21 conflict 7 to `resolved_conflicts`.
- **L42 (r14; **ADOPTED in rev 15**, shipped exactly as drafted: Engine Architect ruling: `settings.occupancy` is the single source).** Retire `unit-roster.one_unit_per_tile` with a **convert** tombstone to the project setting:
  ```
  { "id": "one_unit_per_tile", "since_rev": 15,
    "reason": "Cell density lives in the project setting settings.occupancy (project-format r14 §3.1; Engine Architect 2026-11-09).",
    "convert": { "to_setting": "settings.occupancy", "map": { "true": "strict1", "false": "softStack" },
                 "scope": "project-level unit-roster setup only; stage values kept inactive with occupancyStageValueIgnored",
                 "old_answer": "kept-inactive" } }
  ```
  - `old_answer: "kept-inactive"`: the answer stays in `orphans`, visible and ignored by runtime, and is never dropped. `to_setting` is new: a convert whose target is a project setting, not a knob. Please add it to SCHEMA.md next to `convert.to`.
  - Remove the knob from the unit-roster menu, because the editor shows only the occupancy picker.
- **L43 (r14; **ADOPTED in rev 15** as the terrain-wide picker `terrain.centre_lane` `lower` | `upper`, default `lower`, gated on `lanes_enabled`; Engine Architect, even lane counts).** With an even `lane_count`, the centre lanes are `n/2` and `n/2 + 1`. `lane_field_lanes: centre-only` covers both. Any behaviour that needs **one** centre lane should expose a picker `centre_lane: lower | upper`, default `lower` (= `n/2`).
- **L41 (r14; **ADOPTED in rev 15**: false on all 13 built-ins, `tile_types` rev 15, modes td, not v1; MODES-v2 tower defence, PROPOSED, not v1-blocking).** Add an item field **`buildable`** (toggle, default `false`) to `terrain.tile_types`, so placement can check "buildable ∧ empty ∧ in budget" (MODES-v2 §3, `PLACE_STRUCTURE`).
  - It belongs on the tile type, like `open` / `push_can_enter`. **It's not a core flag and not a map layer** (project-format r14 §6.4).
  - Default `false` on all 13 built-ins, so tactics and BTF are unchanged. A TD project sets it on its own types.
  - This is an added item field, so stored lists aren't flagged (§8.2, r8 rule).
- **L39 (r14; **ADOPTED in rev 15**: `old_answer: "kept-inactive"`, notes updated; owner rule, never wipe).** The `derive` tombstone on `hand-and-draw.deck_size` has `old_answer: "dropped-with-notice"`. Please change it to **`"kept-inactive"`**: the old answer stays in `orphans`, visible and read for `deckSizeDerived`, and is ignored by runtime (§8.2). The `note` should say "kept as an inactive answer", not "dropped".
  - Also update `hand-and-draw.deck.default_source`/`note`. "What the pile holds with no deck" is now **ruled** (Engine Architect, project-format r14 §6.8): a card-hand group with no deck draws **one copy of each ability in the group**, runtime only, with `deckMissing` and a wizard prompt. The stored `null` stays `null`.
- **L40 (r14; **ADOPTED in rev 15**: `ruling.note` now `{setupId, role}`, plus a `mapping_note`; wording).** Modifiers in documents are **`{setupId, role}`** (§2.11, signed off), as `composition_rules.document_shape` already says. Please fix `composition_rules.ruling.note` ("modifiers[] {behaviour, role}"), and say that `compositions[].modifiers[].behaviourId` is a catalogue-level reference mapping, not the document field. No catalogue field changes.
- **L36 (r13; **SHIPPED in rev 14**; Engine Architect, gaps §19).** `terrain.lethal_landing_scope`: picker `any` (default) | `forced_only`. `kills_on_landing` applies at any move end (normal, forced, warp, summon) and never mid-path, and `forced_only` limits it to forced landings. **The Librarian owns the knob.** It's referenced by project-format r13 §6.4 and core-types `CoreTerrainKnobs` (MAY-MOVE until shipped; it reads `any` until then).
- **L37 (r13; **SHIPPED in rev 14**; G2 modifiers, §2.11).** Tag the owner knobs that only a primary may hold: `ability_field: "targeting" | "group" | "effect" | "cost"`. Until then the reader treats `ability_group`, `effect`, `mana_cost`, `cost` and `focus_cost` as owner fields, and targeting is untagged (not yet ignored).
- **L38 (r13; **SHIPPED in rev 14**; decks, project-format §6.8).** A deck ref `ref: {docs: "deck", builtin: []}` on the draw and hand rules (`hand-and-draw` first). Retire `hand-and-draw.deck_size` with a converter once it ships, because the total is derived from the deck (Σ `copies`).
- **L35 (r13; Engine Architect sides ruling). SHIPPED in rev 13 (§12.4f):** `neutral` #8a8f98. The original request was to add a built-in `team_colours` item **`{id: "neutral", label: "Neutral side", colour}`**, so `neutral` becomes a reserved id under §2.9 rule 1. The colour is the engine's fixed neutral, which the Architect supplies.
  - Until it ships: `neutral` is reserved at format level, and neutrals draw in the engine's fixed neutral.
  - A user item with id `neutral` gets a warning, and its colour is kept. At drift it is treated like a built-in item answer, so the colour survives as a user value.
  - Items stay keyed by side id (project-format r13 §6.5 `stage.sides`). An item no stage assigns gets the warning `sideUnassigned`, never an error.
- **Shipped in rev 7:** L11, L13, L14, L15, L16, L17, L18. **Shipped in rev 8:** L19–L26 (confirmed in §12.4b; L26 adjusted by L30). **Shipped in rev 9:** L27–L32 (§12.4c). **Shipped in rev 10:** L33, L34 (§12.4d). The L33/L34 entries below are kept as history.
- **L27 (r8).** Generic built-in `terrain.tile_types` for the procedural recipes' `defaultTileType`, so painted water/wall/lava mean something without a user type. Proposed reserved ids: `water` (not open, push can't enter), `lava` (kills on landing), `wall-block` (not open). Then the Architect's recipes name `floor`/`water`/`lava`/`wall-block` (project-format r7 §14.6c PL9). Defaults are **PROPOSED**: BTF has no such tiles.
- **L28 (r8).** Knob type `text` (`max_len`, `default`). Retire `effect.cue` (since 9) with `convert → cue_name` and add `effect.cue_name` (`text`, `max_len` 32, default `""`) (§12.7 Q1).
- **L29 (r8).** List field `label_max_len`; `effect.tags` sets `16` (§12.7 Q2).
- **L30 (r8).** `nullable` on colour knobs. `unit-roster.team_colour` becomes nullable, default `null` (= the palette entry for the army's side), with `depends_on` = `ability-presentation.team_colours` only. Retire `team_colour_override` (since 9) with `fold {into: "team_colour", when_false: "reset"}` (§12.7 Q5).
- **L31 (r8).** Rename the behaviour field `export` → `closure`, with the single value `"always"` (`terrain`). Remove it from `barrier-line` (§12.7 Q4).
- **L32 (r8; Effect Designer L-5, K-2).** Uploaded effect pictures:
  - A new item field type **`asset`** (`assetId | null`, `kinds: ["sprite", "image"]`).
  - A step field **`steps[].picture`** (default `null` = the effect's picture).
  - An effect knob **`picture`**, `ref {docs: "asset", builtin: ["none"]}`, default `"none"` = the stock `blade`.
  - `{docs: "asset"}` refs resolve against `project.assets` (project-format r7 §6.7).
- **L34 (r10; shipped; reworded r13 per the Engine Architect).** `terrain.push_into_walls`: optional toggle, default `false` (requested by the CEO/CoS), with **`wall-block.push_can_enter: false`**. **r14 (rev 14, Engine Architect):** "slams into walls". It covers wall-block tiles **and edge walls for the event**. Edge walls always stop the move, and so does a wall-block (it's never entered).
  - **With it on:** a forced move that meets a wall-block, an edge wall or a unit **stops on the last open cell**, and the core emits **`pushBlocked {unit, blocker: wall-block | edge | unit, cellsRemaining}`**. `push-knockback.wall_slam_damage` / `wall_slam_scaling` apply (rules). The unit never enters the wall-block (no unit ever occupies an `open: false` tile).
  - **Damage** from that is a **rules knob on the push behaviour** (`push-knockback`), never core.
  - With it off, it still stops short, with **no event**.
- **L33 (r9; Engine Architect; open against rev 9).** Rev 9's `steps.points_anchor` (`board` default / `caster` / `target`) is the right field. Please make **`caster` the default**, keep `board` only as the value booth imports may carry, and finish the rest:
  - (a) The `tile`/`tiles` item values change to `{dc, dr}` (numbers). This bumps `steps.rev`: default answers follow, and user lists get `catalogueChanged` with a converter `c,r → dc,dr` relative to `booth_caster`. **(r11 note, shipped as `legacy_relative_to` in rev 12:)** a legacy conversion uses the effect's **stored** `booth_caster`, or `{0, 0}` if none was stored, never the current default.
  - (b) The step item field: rev 9's `points_anchor`, default → `caster` (was `board`).
  - (c) An effect knob **`rotate_with_facing`** (toggle, default `false`, citing spec.ts `pointsOf()`, which has no facing).
  - (d) Effect knobs `booth_cols` (slider 2–8), `booth_rows` (1–10), `booth_caster`, `booth_foe` (tile), with defaults from `defaultSpec()` (spec.ts L199–201), so `to/fromSkillSpec` are lossless.
- Validator cases for L28–L31, and the two test changes (§12.7 Q6).
- `card_cost_override` is still skipped (no request).

- **L47 (**ADOPTED in rev 23**, r28 §12.4j, shipped as below; r19; Feel tricks, plan §16 + §17; **UNBLOCKED r20**: §2.10.2 ACCEPTED, CEO 2026-11-12 16:43 via the CoS; to be sent by the owner; **ships after L45 and L46**).** Changes to the `effect` behaviour. The format is set in **§2.10.2**, the only home for these fields: copy ranges and defaults from there.
  1. **`steps` item fields:** `flash_shape`, `flash_radius`, `wave_from`, `wave_thickness_px`, `blank_ms`, `smear_ms`, `smear_remnant_ms`, `smear_tiles` (nullable), `shine_ms`, `shine_style`, `shine_loop_rest_ms`, `shine_angle`, `shine_on`. Bump the `steps` knob `rev` (only added fields, so old lists aren't flagged).
  2. **Option additions:** `start_mode` += `"at-hit"`; `anchor` += `"screen"`; `steps[].picture` `ref.builtin` += `"none"` and `"blast-star"`; `effect.picture` `ref.builtin` += `"blast-star"`.
  3. **Effect knobs:** `hit_stop_ms`, `hit_white_ms`, `hit_white_target`, `hit_white_mode`.
  4. **`ui_derived`:** `impact_flash`, `shockwave`, `blank_punch`, `hit_stop`, `smear`, `hit_white`, `shine` (§2.10.2.12); extend `speed` (§2.10.2.4/8).
  5. **Presets and recipes:** `te-explosion` (recipe `explosion`) and `te-pickup-sparkle` (recipe `pickup`), as the JSON in §2.10.2.9.
  - No BTF or Astrologer preset changes. The Keeper doesn't edit `behaviours.json`; this is a request.

- **L48 (**ADOPTED in rev 23**, r28 §12.4j, shipped as below with the r27 amendments; r23; Effects v2 step 33, CN-014 33a + CN-015 33b; **ACCEPTED** (the EA passed D1 2026-11-15 06:31; CN-019 ACCEPTED); to be sent by the owner; **ships after L47**).** Changes to the `effect` behaviour. The format is set in **§2.10.3**, the only home for these fields: copy ranges and defaults from there.
  1. **`steps` item fields:** `anchor_point`, `attach`, `detach`, `depth_by_facing`, `lit`, `light_mode`, `light_radius`, `light_ramp`, `tint_ramp`, `tint_snap`, `outline`. Bump the `steps` knob `rev` (only added fields, so old lists aren't flagged).
  2. **Option additions:** `draw_layer` += `"behind-unit"`, `"front-unit"`; `hit_white_mode` += `"bright"`; **r27:** the ramp-key options of `tint_ramp` (knob and item) and `light_ramp` are the six terrain keys plus `"fire"`, `"frost"`, `"holy"`, `"venom"` (effect-ramps CN).
  3. **Effect knobs:** `start_on`, `tint_ramp`, `pixel_scale` (**r27 amendment, M2:** a **nullable** picker (the r8 L30 `nullable` pattern), **default `null`**, values `"match-sprite"` and the JSON integers 1–6, with the strings `"1"`–`"6"` as aliases of the integers; the rule, word for word: `pixel_scale` absent or `null` = today's `k` rule; `"match-sprite"` = the anchor unit's sprite pixel size; a JSON integer 1–6 = that pixel size; the strings `"1"`–`"6"` are read as aliases of the integers and rewritten to integers on edit (M6); anything else (0, 7, 2.5, other strings) warns once (`outOfRange` for a number, the unknown-option warning for a string, per M5) and plays as the `k` rule. Absent/`null` and `"match-sprite"` are distinct. Tell the Keeper if the catalogue schema can't hold a nullable picker with mixed string and integer values), `shake` (int 0–3), `shake_ms`, `shake_dir`, `squash`. **No `hit_stop_jitter` knob** (a rule).
  4. **Rule N defaults** for new documents and steps (`pixel_scale` `"match-sprite"`, `tint_snap` `"ramp"`, `outline` `"auto"`, `lit` from the stock picture) are editor writes, not catalogue defaults: the catalogue default stays the absent meaning (for `pixel_scale` that is `null`). Rule N never overwrites preset values (r27, M3).
  - Presets (`te-reveal-*`, Fire arrow, Slash) are a separate later request. The Keeper doesn't edit `behaviours.json`; this is a request.
  - **r28, as shipped:** the knobs `tint_ramp` and `shake_ms` have no default (absent = today's behaviour; `no_default_reason`), and the step items `light_ramp` / `tint_ramp` are nullable with default `null`, which reads exactly as absent (§2.10.3.2). No catalogue change is asked for.

- **L49 (**ADOPTED in rev 24**, r29 §12.4k, shipped as below; r28; gaps.md §29 item 5; shipped in rev 24, 2026-11-15; EA approved).** Add the `dim` step field **`dim_lights`** to the `effect.steps` items. The format is set in **§2.10.1.3** (r21; ACCEPTED r22, EA 2026-11-13 16:25; project-format r31), which is the only home for it: copy it from there.
  1. **Item field `dim_lights`:** picker `"half"` | `"dark"`, default **`"half"`**. It applies to `dim` steps only, and on any other kind it's kept and ignored silently, like every kind-scoped field.
  2. **Meaning:** `half` keeps a half-size glow on authored lights (`lightSource`) while the dim plays (torches stay lit), and `dark` puts them out. An unknown value plays as `half` with the usual unknown-option warning, and it's kept, never rewritten. Render only.
  3. Bump the `steps` knob `rev`. It's an added item field, so stored lists aren't flagged, and with `item_absent_reads_default` an absent field reads as `"half"` (§8.2, r8 rule).
  - No preset changes: `te-astrologer-awakening` step-1 has no `dim_lights`, so it plays `half`. The Keeper doesn't edit `behaviours.json`. **Adopted as shipped in rev 24** (§12.4k).

### 12.6 gaps.md §13 answers (Keeper, r6)
1. **`max_items`:** a soft cap (warning, the runtime uses the first N, never truncated). It is hard only with `max_items_hard: true` when the runtime can't run, and none qualifies: spec.ts slices to 6 and runs (§2.9.2).
2. **Per-ability effects:** effect **documents**, `effects/<id>.json`, as `behaviour-setup` of `effect`, referenced by id. The BTF built-ins are `builtin:effect/<id>`; the spec.ts shape is kept through `toSkillSpec`/`fromSkillSpec` and `describeSkill` (§2.10).
3. **Reserved ids:** fine in the catalogue default, which is what makes an item built-in. Built-ins can be edited but not renamed or deleted; users may add new ids; reserved or duplicate ids are rejected (§2.9.3).
4. **Item field types:** `picker`, `toggle`, `slider`, plus `colour`, `text`, `tile`, `tiles`. No ramp type (use two fields) and no nested lists (§2.9.4).
5. **Ability owner:** "registers an action the controlling side picks and triggers, shown as a menu row or a card". `objective-contest` (one `spells` group) and `sword-lifecycle` are owners; the other 6 are not (§2.9.5). **Decided, CoS 2026-11-09.**

### 12.7 gaps.md §14 answers (Keeper, r8)
1. **Cue name. Ruling: add a knob-level `text` type** (cheap: the item `text` spec already exists).
   - A `text` knob stores a string, with `max_len` (default 48) and `default`. Over `max_len` is `outOfRange` (warning). The value is kept, and the runtime trims it like spec.ts. The editor's input stops at `max_len`.
   - It's display data only: never a gate leaf, never in a ban, never `per_unit`.
   - **`effect.cue` (one-item list) → `effect.cue_name`** (`text`, `max_len` 32, default `""` = no cue = spec.ts `cue: null`). Keep `cue_at` as it is. `toSkillSpec` writes `cue = cue_name ? {name: cue_name, at: cue_at} : null`.
   - Moving `at` into the item is rejected: a one-item list stays a workaround.
   - **Catalogue (L28):** retire `cue` (tombstone since 9) with **`convert: {to: "cue_name", from: "first-item-field", field: "name"}`**. Drift writes `value[0].name` (or `""`) as a `user` answer, or a default answer when the old answer was default. `cue_at` needs no `active_when`, because a text knob can't be a leaf. The editor greys it out while `cue_name` is empty.
2. **Tag length. Ruling: 16, following spec.ts.** Add the list field **`label_max_len?: int`** (default 48 = today's `label` rule). `effect.tags` sets 16.
   - Over the cap is `outOfRange` (warning, kept). Export to the booth trims to 16, like `normalize()`. The editor input stops at 16.
   - `max_items: 4` stays soft (§2.9.2). (L29)
3. **Off-board coordinates. Ruling: a derived on-read warning, outside the catalogue.**
   - The catalogue stays board-free. The `tile`/`tiles` specs need no bounds.
   - In a project, the index checks each effect document used by an active owner against each selected stage's map. Points outside −1…cols+1 × −1…rows+1 (spec.ts `pointsOf()` range) get `effectPointOffBoard {effect, stage, step, field, index}` (warning). The runtime clamps as `pointsOf()` does, and nothing stored changes.
   - Outside a project (the effect editor alone), the check uses the booth preview board, the spec.ts default `cols 2–8 × rows 1–10` (`normalize()` L317–318).
   - This replaces §2.9.4's "`outOfRange` without a board". Nothing is asked of the catalogue.
   - **r9 update (relative points, L33):** off-board can only be known at cast time. The runtime clamps like `pointsOf()` and warns. The index flags only points that can't land on any selected map.
4. **The `export` field. Ruling: keep it, rename it to `closure`, and give it a single value.**
   - Keeping it makes the catalogue the single source for "always in the closure", replacing the hard-coded `terrain` rule in project-format §7.2.
   - **`closure?: "always"`**, absent = the ordinary by-use rule.
   - Why rename: the rule decides closure membership, which Preview's pack plan uses as well as Render's export. Also, `export` is already the name of `index.export` and of the Render step.
   - **Drop `"with-setup"`** from `barrier-line`: it is the ordinary rule, and two spellings of one rule would drift. The barrier-line note belongs in its summary or `default_source`. (L31)
5. **`team_colour`. Ruling: nullable, default `null` = inherit the palette entry for the side this army plays on that stage.** That entry is `team_colours` `player` for the loadout and `rival` for enemy pools, and the runtime knows the side per stage. One source of truth.
   - **Retire `team_colour_override`.** "null vs a colour" already says whether there's an override, so a toggle would be a second copy of that fact.
   - The editor shows "Use project palette (Player side)" as a checkbox that writes `null` or a colour.
   - **Catalogue (L30):**
     - Colour knobs get `nullable?: true`; `team_colour` is `nullable`, with default `null` and `depends_on: ["ability-presentation.team_colours"]` only.
     - `team_colour_override` is tombstoned since 9 with `fold: {into: "team_colour", when_false: "reset"}`. Drift resets `team_colour` to its default (`null`) when the retired toggle's effective value was `false`, and otherwise keeps it. Then the toggle moves to `orphans`.
     - The CoS ruling (project default, per-army override) is unchanged in substance.
6. **Validator tests. Both are accepted.**
   - (a) Drop the `ref missing depends_on` case on `heal.effect`: doc refs have no list dependency. Replace it with two broken-file cases: a `{docs: "effect"}` builtin that isn't an `effect` preset, and a doc ref that has `depends_on` on a list.
   - (b) "Catalogue default breaks a soft check" stays an **error**. C4 (warn, don't block) is about user answers. A catalogue's own default has to pass its own checks, or every new project would start with warnings it can't explain.
   - Please also add cases for L28–L31: a `text` default over `max_len`; `label_max_len` < 1; `nullable` on a non-colour knob; a `convert` / `fold` naming a missing knob; `closure` values other than `"always"`.
