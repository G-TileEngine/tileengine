# TileEngine Project Store format (`tile-project` v6)

Owner: Data & Save Format Keeper. Status: DRAFT **r41** (r41 2026-11-25; r40 2026-11-17; r37–r39 2026-11-15; r26–r36 2026-11-13–14; r15–r25 items 2026-11-12), r14 2026-11-09 (London time, UTC+0).
Consumers:
- Engine Architect: runtime, Preview, Render, export
- Editor & UX Designer: Stage/Level Designer, Loadout, Preview/Render, the wizard
- QA & Build Guard: the export audit

Companion: **[setup-format.md](setup-format.md)** (r14) covers setups, presets, answers, checks, gates, history and catalogue drift. This file never restates those rules.

**Revision log**
- **r41 (2026-11-25, 05:xx): `effects/` reader slot, step 9 codes, `notPlaced` (dsk-rulings/2026-11-17-phase1.md D22, D22b, D29; EA 2026-11-24/25).** Doc text only: no version bump, no migration, no CN (the `effects` store field is `src/project/load/types.ts`, not core-types). (a) **D22b:** the reader loads `effects/<name>.json` as kind `behaviour-setup` into `ProjectStore.effects` beside `setups`; a doc there whose `behaviourId` isn't `"effect"` is `unknownFile` (detail `behaviourId`); `effects/.deleted/**` is skipped with no row (§2, §6.7). (b) **D22 codes:** `legacyEffectId` (info) and `badEffectId` (warning), never refused, nothing written back (§6.7, §13). (c) **`notPlaced`** names the §13 placement row, widened to loadout picks past the player spawns, which stay in the party (EA 2026-11-25). (d) **D29:** `advancedRenderInactive` (info, the L1692 row), `assetFileMissing` / `assetHashMismatch` (H4 when in the closure, a warning when unused), and the import-time `uploadTypeUnsupported` (png/jpg/webp by sniffed bytes) (§6.2, §13). (e) **K6 interim (EA):** until slice-on-import lands, an upload over 4096 px a side is refused at import with `uploadTooLarge` (§6.2). Still six hard errors.
- **r40 (2026-11-17, 01:1x): Phase 1 rulings (dsk-rulings/2026-11-17-phase1.md D1–D5).** Doc text only: no version bump and no CN. `neutrals[].setupIds` is DECIDED (§6.5), and the talk line and attack/talk effects are placement setup answers (catalogue rev 28, `e182b094`). `match-save` stays v1, with an optional engine-owned `snapshot.rules` that is compared only when present (§6.9.1). The shell upgrades tile-project 4→6 and map 4→5 through the §12 steps in the writer.
- **r39 (2026-11-15, 13:5x): catalogue rev 24 pin, with setup-format r29 (§12.4k pin pass, L49 `dim_lights` adopted).** Doc text only: no core-types change, no version bump, no migration; absent = today's behaviour.
  - (a) **§2 "Current catalogue pin":** `catalogue_rev` **24**, 63 behaviours, **563 knobs** (`behaviours.json` sha256 `342c400f…`). Counts are unchanged from rev 23.
  - (b) Effect field L49 `dim_lights` is in setup-format r29 (§12.4k, §12.5). The `pixel_scale` rule sentence in §6.7 is unchanged.
- **r38 (2026-11-15, 13:3x): catalogue rev 23 pin, with setup-format r28 (§12.4j pin pass, revs 18–23 adopted in one pass).** Doc text only: no core-types change, no version bump, no migration; absent = today's behaviour.
  - (a) **§2 "Current catalogue pin":** `catalogue_rev` **23**, 63 behaviours, **563 knobs** (`behaviours.json` sha256 `7f80c56f…`). It was rev 17, 544 knobs.
  - (b) **§6.4 tile types:** the built-ins `path` and `dirt` shipped in rev 23 (L45 ADOPTED), so a palette `path` or `dirt` now resolves to its own tile type. Nothing in a project changes on adoption.
  - (c) **§14 R14-16** is marked superseded by rev 23.
  - Effect fields (L46–L48), the te-* `connect` 0.02 fix, the `null` and no-default wording and request L49 `dim_lights` are in setup-format r28 (§2.10, §12.4j, §12.5). The `pixel_scale` rule sentence in §6.7 is unchanged.
- **r37 (2026-11-15, 06:3x): D1 text pass (post-34 plan, slice D1; EA GO 06:24 after the CEO approved the plan at 06:23), with setup-format r27.** Doc text only: no core-types change (pin `61fad786`; CN-018 `d6d08696` lands with 33b-3), no version bump, no migration; absent = today's behaviour.
  - (a) **M5, §13 H2:** in effect documents an unknown picker option is a warning, not H2; a wrong type stays H2.
  - (b) **§6.7:** the `pixel_scale` rule (M2, word for word as setup-format r27 §2.10.3.2), frozen step ids (M4) and Rule N provenance (M3) are pointed to from the effect section.
  - (c) **Effect ramps** (**CN-019** (`CN-019-effect-ramps-format.md`), ACCEPTED (EA 2026-11-15 06:31)): §6.2.5 `ramps` gains the optional keys `fire`, `frost`, `holy`, `venom` for effect `tint_ramp` / `light_ramp`. Palette keys only, no runtime field. No published style version changes.
  - (d) **N6:** the particles CN is referred to as CN-017 (r36 log, §6.7, §13).
- **r36 (2026-11-14, 02:2x): particle fields for 33b-3 (CN-017, numbered by the EA after filing), plus QA s32 r3 N-r3-1/2 shore nits.** EA confirmed all 7 CN-015 DSK rulings (CN-015 is now ACCEPTED). Render-only; no core-types change (`61fad786`); no version bump, no migration; every new field is optional and absent = today's behaviour.
  - (a) **CN-017 particles** (`staging/CN-particles-format.md`): the existing setup-format r17 `particles` kind is the 33b-3 format source (fields already in §2.10.1.3; tightened in setup-format r24 §2.10.3.5). `particle_motion` `"burst"` / `"attract"` / `"spiral-in"` / `"rise"` (unknown → `"burst"` + `outOfRange`); `particle_count` int 0–48 per step, default 12, step 1 (`outOfRange` clamps); **48 per effect** summed across all `particles` steps — over that, later steps are cut down at load in step order and **`fxParticlesOverCap` {count, limit: 48}** fires once (supersedes r17 `particlesOverSoftCap`); 32 is an editor note ("may slow some phones") only, never a format cap or warning; `particle_life_ms` 200–3000 default 800 (alias `particle_life`); `particle_pull` per-mille 0–2000 default 1000 (UI 0–2, step 0.1), read only by attract / spiral-in. Reuse `anchor`, `jitter`, `start_spread`, `size_spread`, `picture`; the old impact / sparks / `impact_radius` burst is unchanged. Runtime-only: shared pool of 96, oldest dropped first (QA's 128 ceiling cannot be reached); positions are clock-based from a derived seeded stream, never stored; `reduce_motion` skips particle motion (start/end stills). The `particles` kind joins the post-H2 CN-E2 unions batch; no core-types change in this CN.
  - (b) **s32 r3 nits** (docs/qa/step-32-review.md N-r3-1/2), §6.2.5 `shore` row and §13 `shoreInvalid`: (1) a `null` sub-field inside `shore` (e.g. `{ms: null}`) counts as absent and uses that field's default, with no warning, the same idea as whole `shore: null`. (2) With no usable water ramp, a bad whole `shore` value warns both the no-water-ramp notice and `shoreInvalid` once for field `"shore"`, and the shore is **off**. Staging CN-013 carries an erratum; the filed handoff copy is left as r35.
- **r35 (2026-11-13, 18:4x): step 33 Effects v2 (CN-014 33a sync and depth, CN-015 33b light, colour and feel), plus s32 r2 QA fixes.** CEO 18:35 via the EA; UX effects-sprite-sync 4e72b97e; DSK rulings. Render-only; no core-types change (`61fad786`); no version bump, no migration; every new field is optional and absent = today's behaviour. **ACCEPTED pending the EA's confirmation of the DSK rulings.**
  - (a) **CN-014** (`CN-014-effects-sync-format.md`): §6.2 `clips[].events` (≤ 16; over 16 warns `clipEventsOverCap` and the first 16 fire; bad entries `clipEventInvalid`) and `clips[].points` (`hand` / `tip` / `head` / `centre`, whole art px; `clipPointsInvalid`; no `foot` point, it's `anchor`); recipe `skeleton.joints[].tag` `hand` / `tip` baked into points (`jointTagDuplicate`); §6.7 the 64 ceiling covers picture strips with the **same** `fxTooManyFrames` code, the detail naming the subject (`steps` / `strip`). Effect fields in setup-format r23 §2.10.3.1.
  - (b) **CN-015** (`CN-015-effects-feel-format.md`): effect fields in setup-format r23 §2.10.3.2 (`light_mode` named to avoid the paint style's `light` and the step's `glow_*`; ramp keys resolve against `settings.paintStyleDefault`, `fxRampMissing`; ≤ 2 lit steps, `fxLightsOverCap`; `shake` 0–3 art px, a stored 4 plays as 3 with `outOfRange`; hit-stop jitter is a rule, not a field); §6.7 `flashRisk.detector` may be `te-flash@3` (@2 and @1 frozen); player `screen_shake` in profile-format r14 §3.3, and `graphics` Lite reuses the core `graphics` key (`low`). `pixel_scale`: absent keeps today's scale for old documents; the editor writes `"match-sprite"` into new ones (CEO Q2).
  - (c) **s32 r2 QA fixes** (docs/qa/step-32-review.md 7fd085fa; EA 18:36; DSK accepts), §6.2.5 `shore` row and §13 `shoreInvalid`: (1) `shore: null` reads as absent (on with defaults, no warning, like `ms: null`); `true`, an array, a number or a string warns `shoreInvalid` (field `"shore"`) once per body and the shore stays on with defaults. (2) No usable water ramp warns `shoreInvalid` once per body ("no water ramp") and the shore is **off**. (3) "No pose repeats" is replaced by: the loop is seamless with whole-pixel steps; some frames may show no ring when `shallowPx` is small. CN-012 and CN-013 bodies updated (doc rev and sha lines; CN-012 states the `motionInvalid` message for an animated cell tells the maker to set `anim: null`).
- **r34 (2026-11-13, 18:2x): s32 r2 follow-ups (EA 18:24).** Text only; render-only; no core-types change (`61fad786`); no version bump, no migration. (1) `shore.ms?` int 50–1000, default **250** (equals the code constant `SHORE_MS`; absent = 250). (2) Motion on styled water with a derived clip **keeps** warning `motionInvalid` (warn, don't block; the message tells the maker to set `anim: null`). (3) The per-field shore warning is named **`shoreInvalid`** (one name for all shore problems, message names the field); §13 row added. CN-013 body updated.
- **r33 (2026-11-13, 18:1x): QA s32 review d80cfa66; EA 18:12; DSK rulings.** Text and warning names only; render-only; no core-types change (`61fad786`); no version bump, no migration. (1) **Clip-wins is decided at load, per drawn cell**, not by whether a clip is playing. Motion is ignored with **`motionInvalid`** when the cell is animated: a tileset tile whose `tileProps[i].anim` (stored or derived) names a clip, or a sprite asset with a non-empty `clips[]`. Image assets have no clips. Under a paint style the water slot derives a clip from `anim`, so motion on styled water applies only with `anim: null`. (2) Combined parts each keep their own `ms` and advance on their own (`pose = floor(t / ms_part) mod n_part`). The baked atlas is the product of the parts' frame counts, capped at 64 (`motionTooLarge`). The runtime picks the atlas cell from the part indices, with no shared clip tick. **`sway.ms` is a stored field** (int 100–1000, default 400). (3) When `accessibility.reduce_motion` is on, cycle, scroll and sway draw frame 0, and the shore's breathing foam and waves also freeze on frame 0; the static foam line stays visible. (4) `waveGap` must be a whole multiple of `frames` (each frame moves the rings by `waveGap / frames` whole pixels, so the loop is seamless and no pose repeats). The defaults 8 and 4 pass. If it isn't a multiple, **`shoreInvalid`** warns once per style body and both fields use their defaults. Not a coprime rule (that would reject the defaults: gcd(4, 8) = 4). (5) Transparent pixels (alpha 0) and pixels whose colour isn't on the ramp never cycle. (6) Cross-references now cite the filed names `handoff/change-notices/CN-012-motion-format.md` and `handoff/change-notices/CN-013-shore-canopy-format.md` (the r32 changelog pointers are updated to match). (7) Sway `edge` is 1–4 (confirmed); the frame border counts as transparent for sway's edge detection. No core-types change.
- **r32 (2026-11-13, 18:0x): step 32 motion, shore and see-through canopy ACCEPTED** (Engine Architect confirmed all 11 rulings, 17:59; three amended by the CEO 18:04 via the CoS, relayed by the EA). Render-only, no core-types change (`61fad786`), no version bump, no migration. (a) AssetMeta **`motion`** (sprite, tileset, image; also `tileProps[i].motion`, replaced whole) with `cycle` / `scroll` / `sway`. Named `motion`, not `bake` (that name already means proceduralShip `bake` and `bakedFrom`) and not an `anim` extension (`tileProps.anim` is a clip name). Warnings **`motionInvalid`**, **`motionTooLarge`** (64-frame product cap, created by this CN). On a procedural asset, motion lives in the hashed params; a stored `motion` is ignored with `styleParamIgnored`. When `accessibility.reduce_motion` is on, every motion part draws frame 0. The phase offset is runtime-only, never stored. **CEO 18:04 via CoS:** no `leafy` tag; tools still write `motion.sway` automatically; makers switch it on or off per plant with **`objects[].motion?`** (replaced whole; `null` = no motion, absent = the asset's own). The river speed (1 px per 0.2 s) and sway timing are code constants, not format fields (no effect beyond the existing `scroll` / `sway` defaults). Filed as `handoff/change-notices/CN-012-motion-format.md`. (b) **CEO 18:04 via CoS: foam is on by default.** Paint-style body **`shore?: false | {foamPx?, shallowPx?, waveGap?, frames?}`** on the `water` slot: the shore follows `liquidEdge: "foam"` (the default); absent or `{}` means on with the defaults, and `false` means off (today's edge). Other `liquidEdge` values never get the shore. Existing water maps gain foam on update (a look change only, with no data change and no migration). Adding or changing `shore` on a pinned or locked style still means a new style version. Filed as `handoff/change-notices/CN-013-shore-canopy-format.md`. (c) **CEO 18:04 via CoS:** see-through canopy is a per-map maker field **`seeThroughCanopy?: boolean`** (§6.4; default false, absent means false, map stays v5, no migration), never a player setting. The per-placement layer chip stays a later CN. profile-format is unchanged (stays r13). §16 also catches up the r31 `lightSource` / `nightVariant` fields that were in the prose but missing from the TypeScript sketch, and §13 lists `lightInvalid` / `nightVariantMismatch`. No core-types change.
- **r31 (2026-11-13, 16:2x): r30 light fields ACCEPTED** (Engine Architect confirmed r30 as written, 16:25). `lightSource`, `tileProps[i].lightSource`, `objects[].lightSource`, `nightVariant`, `lightInvalid`, `nightVariantMismatch`. Filed as the format change note `staging/CN-light-format.md`. `fullyDark` stays runtime-only, set by the host from the dim step's `dim_lights`. No core-types change.
- **r30 (2026-11-13, 16:2x): step 31 light (Engine Architect).** (a) R2-N1 CONFIRMED: an `ms` that is present but not an array counts as `clipMsInvalid` under r29; `ms: null` reads as absent (no warning). (b) **PROPOSED, render-only, no core-types change:** `lightSource` on sprite/image AssetMeta and on `tileProps[i]`, an optional per-placement `objects[].lightSource` override, and `nightVariant` on AssetMeta for the moonlit swap; warnings `lightInvalid`, `nightVariantMismatch`. The dim behaviour lives on the effect's dim step (setup-format r21 `dim_lights`), not on assets or abilities. Additive and optional: old projects load unchanged, no version bump, no migration.
- **r29 (2026-11-13, 13:5x): invalid `ms[]` entries (QA step 30 review, Engine Architect).** Any entry that isn't a whole number ≥ 1 (NaN, non-finite, 0, negative, fractional, non-number) invalidates the whole `ms[]`: warning **`clipMsInvalid`** once per clip, and the clip plays by `fps` (8 if `fps` is absent or invalid). Stored value never rewritten. Text only; core-types unchanged at `61fad786`; no CN.
- **r28 (2026-11-13, 13:4x): clip warning names (Engine Architect, step 30 build).** `clipMsLength` (`ms.length ≠ frames.length`) and `clipFpsIgnored` (both `ms` and `fps` set). Padding may happen at play time in the render core instead of the reader; the result is the same and the stored `ms[]` is never rewritten. Text only; core-types unchanged at `61fad786`; no CN.
- **r27 (2026-11-13, 13:2x): off-size tiles are bottom-left anchored and not clipped (CEO 2026-11-13 13:20, direct; supersedes r26's top-left confirmation and K1's clip).** A tile larger than the cell overflows up and to the right; draw order makes lower rows cover higher ones. Render rule only: no field, type or version change, no stored data changes, no migration; core-types unchanged at `61fad786`; no CN.
- **r26 (2026-11-13, 13:2x): clip timing and off-size tiles clarified (QA step 27 A/B, Engine Architect; text only).** §6.2: a short `ms[]` pads with its last value, longer is cut to `frames.length`, empty means absent; `fps` must be a finite number > 0 (fractions allowed, e.g. the generator's 2.5), otherwise warning `clipFpsInvalid` and 8 is used; off-size tiles stay top-left anchored and clipped (K1 unchanged). No field, type or version change; core-types unchanged at `61fad786`; no CN.
- **r25 (2026-11-12, 22:5x): H4 hard ceilings, text only (Engine Architect, step 25, proto 78de054 on 18f7899).** §6.7 K-4 notes the 64-step ceiling per effect block (`fxTooManyFrames`, refused, never truncated). §13 lists the H4 refusal codes. core-types unchanged at `61fad786`. No format version change.
- **r24 (2026-11-12, 21:3x): `saveMigrationFailed` (Engine Architect H3 r3, QA must-fix; name accepted).** New refusal next to `saveFormatOlder` (§6.9.1, §13): the `migrations/save/` hook threw, or returned something hostile, still old or not plain data → `{ok: false, code: "saveMigrationFailed", needsMigration: true}`. The file is always kept untouched and shown read-only. core-types unchanged at `61fad786`. No format version change.
- **r23 (2026-11-12, 21:2x): CN-009 r2 SIGNED; §6.9.1 refinements (Engine Architect r2, commit c27d2e2).** core-types.ts is now `61fad786` and adds **`SaveHeader`** (the §6.9 `header`, one home for every save kind) and **`MatchSave`** (§6.9.1). New refusal **`saveFormatOlder`** (warning, `needsMigration: true`): an older file the `migrations/save/` hook can't bring up; no older-file code existed, so the name is new. Wording fixed: version and mismatch refusals are typed results; a malformed or edited file is refused by name, and the file is kept either way. Opt-in resume replays the log **up to the snapshot's tick** and never trusts the snapshot across a mismatch. No format version change.
- **r22 (2026-11-12, 21:1x): §6.9.1 `match-save` v1 (DECIDED; Engine Architect 2026-11-12 21:12, CN-009 findings F1–F4 accepted; step 24, H3 trusted saves).** A new player-data kind, separate from `save` v1: the command log is the truth, and the snapshot is a check value. It reuses the §6.9 `header` unchanged (no second copy of `engineVersion` / `projectHash`). Loading returns typed refusals and never throws (`saveFormatNewer`, `saveProjectMismatch`, new warning **`saveEngineMismatch`**). A mismatched save resumes only with an explicit host opt-in, keeping r14 (never deleted). Older versions go through the `migrations/save/` hook (empty), newer ones are read-only. Sync size: [sync-format.md](sync-format.md) r12 §5.5. **The core-types `MatchSave` type becomes final only when CN-009 is re-signed**; the f6c78db draft (afb69587) is superseded. core-types.ts is not touched in this rev. Plan only; no build without the CEO's SEND.
- **r21 (2026-11-12, 16:4x): `te-flash@2` pointer (ACCEPTED; CEO 2026-11-12 16:43 via the CoS; setup-format r20 §2.10.2.10).** §6.7 `flashRisk` accepts the detector `te-flash@2` (the Feel-tricks rules); `te-flash@1` stays frozen. No format version change and no migration. A build still needs the CEO's SEND.
- **r20 (2026-11-12, 14:57): Effects v2 pointers ACCEPTED (CEO 2026-11-12 14:56 via the CoS; setup-format r17 §2.10.1).** The r19 §6.7 and §7.2 5a/5b items are ACCEPTED with no text change. The v2 cap of 12 still applies only once the v2 player ships, and a build still needs CEO SEND.
- **r19 (2026-11-12, 14:5x): Effects v2 pointers (PROPOSED; CEO accepted the scope 14:42 via the CoS; the format is in setup-format r16 §2.10.1).**
  - §6.7 K-4: once the v2 effects player ships, it plays the first **12** steps, and `overCap` reads "Steps 13+ are saved but won't play".
  - New derived **`flashRisk`**: on `index.effects[]` and the project index, and in the Render manifest as output only.
  - §7.2 5a: Render writes the v2 player input, not `toSkillSpec`-shaped data. 5b: it walks the first 12 steps, and stock picture ids add credits only.
  - No stored field, no version bump and no migration.
- r1 (18:5x): first store design.
- **r18 (2026-11-12, 04:2x): sprite recipes folded in, ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1); pack provenance signed off by the EA.** (a) The ten sprite-recipe rulings' pointer text is folded in, marked ACCEPTED: §2 Layout `sprite-recipes/`, §6.2.2 the `sprite` arm of `ProcParams` and the team rule, §7.2 Not exported, §7.4 `live`/`bake`, §10 decoded sprite sheets, §11.2 `stripHistory`, §12 Kinds `sprite-recipe` v1 with its local guard, §13 H4 reach and the recipe notices, §16 `ProcSprite`. **`code.src` never reaches the hub:** the client strips it, and an upload still carrying it is **rejected** with `recipeCodeSource` (sync-format §6.2); there is no CEO-queue path. (b) `origin.procedural.from?` (r17): **EA signed off 2026-11-12 with conditions** (approved as written; outside params, never hashed, no migration, survives in SE-01's `stored`); pack-format.md is ACCEPTED r2. No format version change, no migration.
- **r17 (2026-11-12, 04:1x): asset packs pointer (PROPOSED; CEO Starter Pack direction 2026-11-12 04:08 via the CoS).** New companion **[pack-format.md](pack-format.md)** r1 (`asset-pack` v1). Two lines here, no format version change, no migration: (a) a pack item copy uses the existing **`origin.builtin {libraryId: <packId>, assetKey, rev}`** (hub packs fill `libraryId` with their `packId`); `builtinNotCC0` stays limited to the v1 built-in library; (b) the procedural origin gains optional **`from?: {libraryId, assetKey, rev}`** (not hashed, absent = not from a pack) so recipe copies can "Update from library" (§6.2.4). Nothing hub-only (hub id, badge, price, purchase) is written into projects.
- **r16 (2026-11-12, 00:5x): Engine Architect confirmations.** No format version changes and no migrations (`map` v5, `tile-project` v6).
  - **Footprint cells CONFIRMED (EA, 2026-11-12; §6.4):** `objects[].at` is the footprint's **bottom-left** cell, and `{w, h}` grows **right and up**. Row 0 is the top row, and north is `r−1`. The footprint covers columns `c … c+w−1` and rows `r−h+1 … r`. The "to confirm with the EA" note is removed. Until the EA's footprint slice lands, the runtime **occupies and hit-tests only `at`** (`footprintIgnored`).
  - **Tile types (EA; setup-format r15 §2.9.3, §12.5 L45):** walkable `path` and `dirt` are requested as built-in `terrain.tile_types` (catalogue rev 23, the Librarian's). **`wall-block` is the canonical blocking wall.** Readers accept **`wall_block`** as an alias, and writers emit `wall-block` (§6.4 palette).
- **r15 (2026-11-12, 00:5x; all PROPOSED; no format version changes, no migrations).** `tile-project` v6, `map` v5, `stage` v2 and `editor-prefs` v1 are unchanged; every addition is optional.
  - **EUX r65 Q-D1 (footprint):** there's **no `asset.tiles`**. The one home is the existing **`objects[].footprint {w, h}`** on the placement (§6.4). The editor now writes it, taking the picker's default from the Starter Pack or library entry; user art defaults to 1×1. Cells: `at` is the footprint's **bottom-left** cell, and it covers `c … c+w−1`, `r−h+1 … r` (confirmed by the EA in r16). The runtime still honours the 1×1 anchor until the EA's footprint slice lands (`footprintIgnored`, unchanged).
  - **EUX r65 Q-D2 (NPCs):** there's **no `kind: "npc"` and no `npcs[]` list**. An NPC is an ordinary unit placed in the existing **`stage.neutrals[]`** (side `neutral` by default). Its role is a behaviour setup on that placement: new optional **`neutrals[].setupIds?: setupId[]`** (§6.5). Which behaviour ids to use is the Librarian's Q-L1.
  - **EUX r65 Q-D3 (view prefs):** these go in **`editor-prefs.stageView?`** `{look?, gridLines?, tapMenus?}`, which is device-local, user-wide and never in the project (§11.3). The `tapMenus` default is derived from the profile's `modeFor("stage")` (profile-format r3 §1.11).
  - **r15 in place (00:5x): sync-format r6 pointers (CEO DECIDED 2026-11-12, H1–H12).** The only project-side effects: a hub listing derives its "AI-generated" label from `credit.aiGenerated`, and such assets may be sold (H9). A taken-down hub asset in a local project gets the notice `hubAssetWithdrawn` with "Replace it"; nothing is removed, and shipped games keep working offline (H8). Still nothing new is stored in projects.
  - **Hub provenance (CEO DECIDED 2026-11-12; sync-format r5 §6.5):** nothing new in projects. Local and offline import stays fully open. The only provenance is the existing optional `credit`. The Imagine converter writes `credit.source: "own, AI-generated (Grok Imagine)"` + `aiGenerated: true` (§6.2.4).
- **r14 (22:2x): catalogue rev 14** (515 knobs; setup-format r14 §12.4g). No format version changes and no migrations.
  - **Lane tag `logic.lanes?`** (§6.4; optional, read only with `terrain.lanes_enabled`).
  - **Decks:** `hand-and-draw.deck` ref (rev 14). `deck_size`'s old answer is kept inactive in `orphans`, never wiped. **Empty deck RULED** (Engine Architect): a card-hand group with no deck draws one copy of each of its abilities (runtime only) with `deckMissing`. Action-menu groups have no pile (§6.8).
  - **Push:** `push_into_walls` covers edge walls for the `pushBlocked` event. With it off: stops short, no event. `wall_slam_*` is push rules.
  - **Licence CI:** points to ARCHITECTURE v0.6.1 §14.2 (§6.2.4). Two licences, two source strings. Provisional fails library builds and release exports, and warns in dev. The check also runs on the export's `credits/licenses.json`. **The v1 built-in library stays Kenney-only:** the BTF assets are project content (or a later library revision), not built-in (R13-8 amended).
  - The `present-card-hand` references are fixed (it's `hand-and-draw`).
  - **22:2x in place: MODES-v2 items** (CEO mode order: tactics, then idle RPG, then tower defence), all **PROPOSED and not v1-blocking**:
    - `map.paths?`: ordered routes, orthogonal adjacency (§6.4);
    - a separate `save` v1 kind (SimSnapshot) plus `settings.offlineCapMs` (§6.9, §3.1);
    - `settings.occupancy` `strict1` | `softStack` | `laneSlots` (§3.1);
    - `buildable` as a `terrain.tile_types` field (Librarian request L41; adopted in rev 15).
    - `core-types.ts` gets an extensible event map.
  - **23:1x in place: audio-format r1 pointers (PROPOSED).** Audio data is defined only in **[audio-format.md](audio-format.md)** (Engine Architect audio rulings 1–4). This doc just points there: §3.1 `audio?`, §6.2 audio assets (`procedural-audio` origin, `loop`, `ext` `m4a`/`wav`), §7.2 step 5e, §10 two variants, §12 the `audio:1` section guard, §13 audio warnings (never H4), §16. No format version change and no migration: an absent `project.audio` is silence. `core-types.ts` is untouched (`055a182c`); its additions wait in audio-format §8, the core-types batch (pending).
  - **00:2x in place: audio-format r1 EA answers (PROPOSED until CEO rules).** Stage music moves to **`stage.audio?.music`** (§6.5); `project.audio.music` is `{title, menu, battle}` with per-field stage override of `battle` (same rule as `difficulty`). Bindings gain `duck?` / `match?`; library packs ship pre-encoded; `musicMode` / `musicDecodeMaxMs`; battle cues are tactics `ModeEventMap` keys. Pointers: §3.1, §6.5, §7.2 step 5e, §13. Shapes still live only in audio-format. `core-types.ts` untouched (`055a182c`).
  - **23:0x in place: profile-format r1 pointers (PROPOSED).** `project.gameSettings` (§3.1) is the game's customisation of a settings template, inherited from `btf-hud-settings@1`. `achievements/achievements.json` (§2, Kinds) holds the game-scoped achievement definitions, `achievement-set` v1. Both are defined only in **[profile-format.md](profile-format.md)**, so this doc just points there. Per-player values (settings values, the achievement ledger) are **never in the project**. No migration: both are optional and absent by default.
  - **23:0x in place: sync-format r4** (CEO scope ruling plus Engine Architect). The studio server stores only the account, profile and download manifest; shipped games use the bring-your-own-backend Online Kit. `settings.online` becomes `{sync, syncAdapter?, backend: {endpoint, clientId?}}`, where `backend` is shared with `@te/net` and `clientId` is public only. The export audit adds `secretInBundle` and `studioAdapterInGame`. The §6.9 pointer names r4. No migration.
  - **23:0x in place: `LicenseRef-TileEngine-UserOwn`** (Engine Architect; sync-format r3 §6.1). It's accepted in **end-user projects** with no `licenseUnlisted` (warn-only, as now), and **never** in the built-in library (CI rejects it). `…-Own` stays studio-only, and neither id is ever rewritten into the other.
  - **23:0x in place: online layer, sync-format r2** (Engine Architect calls; PROPOSED).
    - New optional **`settings.online = {sync, syncAdapter}`** (§3.1), default absent = off. No migration. It doesn't duplicate `extensions.online`, which stays the opaque user-module slot (§9).
    - §6.9: a save newer than the engine is **never loaded, kept untouched and never deleted** (`saveFormatNewer`); the old "refused" wording is replaced. Sim-owned fields must be integers; finite floats elsewhere are fine, and NaN/±Infinity/-0 are rejected at write with `invalidValue`.
    - The §6.9 pointer now names sync-format **r2**. `core-types.ts` is untouched (`055a182c`).
  - **22:5x in place: online-layer pointer and a Librarian nit.**
    - §6.9 points to the new **[sync-format.md](sync-format.md)** (r1, PROPOSED): an optional save sync layer. No change to the `save` v1 kind; core-types.ts is untouched.
    - The warning table's `openingShapeMissing` row now says it also fires **once in total when there's no deck** (matches §6.8 and rev 17).
  - **22:4x in place: catalogue rev 17** (63 behaviours, **544 knobs**; setup-format r14 §12.4i). **L44 adopted** (shipped in rev 16 + rev 17 as `deck.openingFront`, `unitId[]` of exactly 5).
    - `unitId[]` is canonical: the TS sketch uses the alias `UnitId` (also added to `core-types.ts`, along with a MAY-MOVE `CoreDeck`).
    - The `openingFront` wording matches the shipped behaviour: no deck → once in total.
  - **22:3x in place: CEO ruling on the bot opening** (2026-11-09, via the CoS).
    - `unit-roster.opening_row` has three values: `back` (default) | `second` | `front` (Librarian L44).
    - New optional deck field **`openingFront?: unitId[5]`** (west to east). It falls back to `back` with `openingShapeMissing`. No migration (§6.8).
  - **22:3x in place: `core-types.ts` handoff fixes.**
    - No eslint-disable comments; it lints clean under typescript-eslint recommended.
    - `CoreEventMap.actionLogged {seq: LogSeq, kind: ActionKind, durationMs}` (PROPOSED). `LogSeq` is 1-based, with the save's `logSeq` = the last applied, 0 = none.
    - Occupancy is project-wide in v1, and a per-stage override is FUTURE ONLY (§3.1).
  - **22:3x in place: catalogue rev 15** (63 behaviours, 538 knobs; setup-format r14 §12.4h; *superseded by rev 17 at 22:4x*). **L39–L43 adopted.**
    - `one_unit_per_tile` is retired into `settings.occupancy`, and `tile_types.buildable` is shipped.
    - `terrain.centre_lane` picks the single centre lane.
    - "No pipe" = `target_pipes: []` + `targeting: "none"`.
    - ~~Open: the bot opening default was pending a CEO ruling.~~ **Ruled** (CEO 2026-11-09 via the CoS): it's the user's choice of `back` / `second` / `front` (L44).
  - **22:3x in place: Engine Architect rulings.**
    - `settings.occupancy` is the **single source**. `one_unit_per_tile` is converted (`true` → `strict1`, `false` → `softStack`) and kept inactive in `orphans` (setup-format §8.2, L42).
    - The `offlineCapMs` default (8 h) is accepted.
    - A save `projectHash` mismatch **resumes** with `saveProjectMismatch` (or Start fresh, keeping a backup), and missing refs are dropped with `saveRefDropped` each.
    - Even `lane_count` has two centre lanes (`n/2`, `n/2 + 1`), and a single centre defaults to `n/2`.
    - Licence: strict FAIL only for the built-in library and **`settings.studioProject`** release exports. End-user projects get warnings and accept any licence string.
- **r13 (21:5x): Engine Architect rulings on the core-types GAPs.** No format version changes (still `tile-project` v6, `stage` v2, `map` v5), and no migration. Verified in §6.5: every addition is optional, and its default is today's behaviour.
  - **Placement `facing?: N|E|S|W|null`** on spawn, neutral, fixed-enemy and pool-spawn entries (`Sq & {facing?}`). Absent means no facing. N = up, E = right, S = down, W = left.
  - **`stage.seed?: int | null`**; the command-log header is a runtime shape, referenced only.
  - **Sides:** `neutral` reserved; `stage.sides?: {loadout, enemyPool, neutrals}` (defaults player / rival / neutral); a per-neutral `side?`; warning `sideUnassigned`.
  - **`wrapEdges`:** the v1 core ignores it and warns when it's true (`wrapEdgesIgnored`).
  - **`credit.status: "provisional"`** on the baked BTF props and sprites, with warning `creditProvisional` and a CI rule.
  - `core-types.ts` updated: the `ResolvedPlacement` runtime type, and only GAP 7 (L27) left. Writers keep unknown keys from now on.
- **r13 in place (22:0x): catalogue rev 13, Engine Architect rulings (gaps §19), owner and CoS/CEO rulings.** There are no format version changes and no migrations.
  - **Catalogue rev 13 (L35)** is adopted: `team_colours` has the built-ins `player` #badcff, `rival` #c44a3a and `neutral` #8a8f98, the reserved side ids player/rival/neutral, and `keyed_by: "side"`. All examples re-verified with 0 problems (setup-format r13 §12.4f).
  - **GAP 7 closed:** `water`, `lava` and `wall-block` are **CONFIRMED** (rev 10 + L34 values). New core invariant: no unit ever occupies an `open: false` tile. `ice@1` → `floor`. `kills_on_landing` fires on any move end, scoped by `terrain.lethal_landing_scope` (L36). With `push_into_walls` on, the unit stops on the last open cell, plus the `pushBlocked` event (§6.4).
  - **§6.2.5:** the full locked → format recipe table (24 recipes; reworked at 22:1x), cross-checked against `MANIFEST.json` and the locked `painter.js`. §17.9 is re-keyed to it (`grass@3`/`water@3`, new ids).
  - **Decks** (`decks/<id>.json`, `deck` v1): CoS-approved, **PROPOSED pending build** (§6.8).
  - **Ability modifiers** (setup-format r13 §2.11); PROPOSED at 22:0x, signed off at 22:1x.
  - **22:1x fixes (in place):**
    - **Credits split (CoS verified):** everything in `painter-proto` is code-drawn: `{RaiKynn, LicenseRef-TileEngine-Own, "own, procedural", aiGenerated: false}`, with no AI disclosure. Only the BTF game's image art (prop/sprite PNGs) is `"own, AI-generated (Grok Imagine)"`, `aiGenerated: true`.
    - **LICENSES.json shape** (Engine Architect): the own licence requires author RaiKynn, `source` and `aiGenerated`.
    - **Locked table** (rulings A–C): 7 shipped rows, with `lane@1`, `water@3` and `btf-ashroad@1`/`btf-moonlit@1` **defective, not publishable**. 15 parked recipes are reserved. `grass@2`/`sand@2`/`lava@2` are retired. Recipe count corrected to 24.
    - `pushBlocked.blocker` is `wall-block` | `edge` | `unit`, and `landedOn` is added (core-types `CoreEvent`).
    - **Modifiers signed off** (setup-format §2.11).
  - **BTF props and sprites (CEO 2026-11-09):** studio-own (corrected at 22:1x: only the BTF PNGs are AI-generated, and `painter-proto` output is procedural). The credit is RaiKynn / `LicenseRef-TileEngine-Own` / `source` / `aiGenerated: true`, and is no longer provisional. The built-in library is Kenney CC0 **or** studio-own with an explicit `source`. An AI-generated disclosure (info) is added. `credit.source` and `credit.aiGenerated` are optional and need no migration.
- **r12 (21:1x): ARCHITECTURE v0.6 §13 adopted** (§13.11 body fields, §13.12 `paintScale`, §13.3 macro texture; `painter.js`). `tile-project` stays v6, and `paint-style` goes v1 → v2.
  - **4×4 texture in the VARIANT slot:** `variants_t = macro.size²` (16), position-locked `(r mod 4) × 4 + (c mod 4)`, recomputed by "Re-tile layer".
    - Water takes the style's `anim.frames`, and every other slot has 1 frame (frame 0 = still).
    - `maskSet` `4bit | blob47 | recipe` is derived, not stored.
    - Overlays: one per cell, the highest priority; ties go by slot order grass, dirt, water, stone.
    - Sheets, bakes and measurements hold **only used cells**. Maps keep the theoretical index, and bakes store `bakedFrom.cellMap`. §17.1 is updated (0 used cells).
  - **Paint-style body fields** adopted as the Architect named them: `recipes` as a slot → `recipe@version` map, `liquidEdge`, `labels`, `anim` (8 × 200 default), `priority`, `macro`, `dither`, `paintSize`, `preview`, plus `palette`, `ramps`, `light`. `stoneKind` is retired with a converter.
    - Look recipes: `grass`, `water`, `sand` @2, plus 16 new @1 recipes. Prototype lava is `lava@2`. Default tile types are PROPOSED, pending L27.
  - *Amended in place (21:5x):*
    - **`core-types.ts`** is the single source for the engine core's read-only types (§16.1).
    - **Engine Architect rulings on the locked set** (§6.2.5): re-key with never-reuse to `@3` plus `importedFrom`; an exact-only float converter, with a `lookHash` check as an import-time reject (H1–H6 unchanged); `planks@1`/`forest@1` out; props, buildings and sprites stored as baked outputs.
  - *Amended in place (21:4x), CEO decision 2026-11-09 relayed by CoS:*
    - Style experiments are **PARKED**. Testing art is Kenney CC0 plus the locked BTF styles.
    - **Default styles: `btf-ashroad@2` and `btf-moonlit@2`**, with frozen look hashes from `painter-proto/locked/2026-11-09/MANIFEST.json` (§6.2.5). `@1` is superseded but still loads, is never wiped, and its id is never reused.
    - The new-recipe and style-expansion text is marked PARKED.
    - The manifest's hashes are **pixel fingerprints**, not the document `sha256`, so §17.9's `sha256` is unchanged and a `lookHash` was added. Manifest-vs-doc conflicts are listed in §6.2.5.
  - *Amended in place (21:1x), confirmed by the Engine Architect:*
    - `lava@2`, plus the rule that frozen ids are never reused and a clash takes the next version.
    - `te-classic@1`'s `recipes` shape.
    - `PAINT_PROC_CACHES_SCALED = false` for painter v0.6: scaled pixels live only in the counted chunk cache, so the line reads 0 with no double count. A future caching painter declares `true` and bumps its version.
  - **`params.paintScale`** (int ≥ 1, hashed, omitted at 1): `nativeScale = paintScale`; the tile warning uses `size × paintScale`; sheets and bakes stay at paint px; enlargement is an integer copy; wizard pairs table. Optional **`settings.paintStyleDefault`** (new assets only).
  - **Decoded memory (Keeper ruling):** used cells × paint px² × 4 × frames, **plus a separate `scaledCopies` line** (× `paintScale²`), counted whenever the engine caches scaled cells.
  - `placedEffects` stays in §6.5, and setup-format r12 points here. §17.9 is rewritten.
- **r11 (21:0x): catalogue rev 12 and the Engine Architect's r10 answers.** No format version change (still `tile-project` v6).
  - **Booth 2×2** (rev 12, CoS default, reversible): `booth_rows` 2, `booth_caster` `{c:0, r:1}`, `booth_foe` `{c:1, r:1}`; r grows downward (paint.ts L788).
    - Effects answering the booth knobs on default **do** change their `toSkillSpec` output (a 2×2 board, absolute points one row lower). The defaults-moved notice covers it, and the stored `{dc, dr}` points and the runtime don't move (§6.7).
  - Legacy points convert against the stored frame or `{0, 0}`, never the current default (setup-format r11 §8.2).
  - Rev 11 rulings recorded in §6.7: the `scale_snap` draw rule, and `blade` greyed under an uploaded picture.
  - **`te-classic@1` confirmed** by the Engine Architect. Old maps are never auto-pinned to `btf-ashroad` (§12, §14.6f).
  - **`paintStyle` reserved on token params:** hashed like every param, never written in v1, and ignored by the v1 reader (§6.2.5).
  - Still held: the 4×4 macro fields, the style `body` fields, and the ×2 display.
- **r10 (20:5x): paint styles, version pin** (CEO decision relayed by CoS through the Engine Architect; ARCH v0.6 §13). **`tile-project` v6.**
  - The painter prototype is the default "Paint with code". `btf-ashroad@1` (day) and `btf-moonlit@1` (night) are built-in **paint styles** ("style", never "preset", so they aren't confused with behaviour presets).
  - **The pin `params.paintStyle {id, version}` sits inside the hashed params**, so an updated style can't silently change a map. Published versions are immutable.
  - The project **embeds** each pinned version (`paint-styles/<id>@<version>.json`, kind `paint-style` v1; the embedded copy wins; Render reads only the store).
  - **Fallback order:** embedded copy → (editor only) installed same version → stored bake (warning) → H4. Still six hard errors.
  - **Upgrade** is explicit: preview, then pin + rebake as **one undo group**, per project or per map. The "update available" badge is editor-only and never stored.
  - **Migration tile-project 005:** unpinned terrain sheets are pinned to `te-classic@1` (pixel-identical) and re-identified, in memory, and written on the next save.
  - Example §17.9. The seamless 4×4 texture fields are **not** added yet (the Architect will send them).
  - Sections touched: §2, §6.2.2–6.2.5, §7.4, §12, §13, §14.6f, §16, §17.9.
- **r9 (20:2x):**
  - **Sheet layout v1 fix (in place, Engine Architect correction):** the frame count is per terrain, so `n = Σ_t variants × masks × frames_t`. Frame 0 is the still, with no separate still cell. The §17.1 code tile is back to 160 cells, 13 × 13, 832 × 832 px (was 320 / 1152 px under a uniform F = 5).
  - **v1 built-in library = Kenney CC0 only** (§14.6e, added in place; CoS via Engine Architect): `credit` stays general, and a non-CC0 library copy gets a `builtinNotCC0` warning only.
  - **Catalogue rev 10** (L27–L34; 468 knobs) adopted. All examples re-verified (setup-format r10 §12.4c–d).
  - *Amended in place at 20:2x (not yet forwarded) for **CoS §15 rulings** and rev 10, replacing the earlier r9 wording:*
    - **All** effect sizes snap whole by default (`effect.scale_snap`).
    - `rotate_with_facing` defaults to true, and is the identity when the anchor has no facing.
    - Points are `{dc, dr}` + `steps[].anchor` (caster default; `points_anchor` retired).
    - `wall-block` stops all forced movement; `push_into_walls` covers wall-block tiles only.
    - Merged preset recipes keep all 10 ids.
  - **Map `objects[]`** (CoS ruling b): tile-layer occupants with an optional `blocks`, drawn row-sorted with units (§6.4).
  - **`stage.placedEffects`** triggers (§6.5).
  - **Sheet layout v1** cell order fixed to terrain → variant → mask → frame, and the example recomputed (§6.2.2, §17.1).
  - Effect-point rounding (§6.7). Wall stock constants and the asset/invisible modes (§6.4).
  - **Rulings (CoS §15):**
    - Camera zoom and **all effect sizes** in whole steps; fractional only under `advancedRender` (§6.7).
    - `wall-block` stops all forced movement, and `terrain.push_into_walls` defaults off (L34, rev 10) (§6.4).
  - No format version changes.
- **r8 (20:1x):** Editor & UX art round 2 (`ux/art-upload.md` r2 §6) and Engine Architect answers (§14.6d).
  - **UX asks:**
    - Code tiles and shape tokens are **procedural params**; `origin.kind: "code"` is rejected (§6.2.2).
    - Team colour is resolved per stage and never stored.
    - Library identity and licence are confirmed (`credit.license`, expected on builtin copies).
    - New op `cropFrames` (§6.2.1).
    - Wall look: `map.wallLook` + `Edge.look` (§6.4). Parallax: already `background.layers[].depth`.
  - **Architect answers:**
    - **Sheet layout v1** is pinned, and bakes store `sheetLayout: 1`.
    - JCS over UTF-8, with a `floatParam` warning.
    - Effect points are **relative `{dc, dr}` + anchor**, with `rotate_with_facing` (L33); stage-authored effects use map cells (`stage.placedEffects`).
    - Map 004 `fit: tile` → `repeat: both` is confirmed identical.
  - No format version changes: everything new is optional with defaults. The examples are updated (§17.1, §17.4, §17.7).
- **r7 (20:0x):** Engine Architect's procedural painter and built-in library (`docs/procedural-and-library-proposal.md`, ARCH v0.5 §13–14). PL1–PL13 were reviewed (§14.6c).
  - **Procedural assets** (§6.2.2): `origin.kind = "procedural"`; params are canonical; the id is the JCS params hash; geometry is derived; the art lock applies.
  - **Bake** (§6.2.3): the procedural original becomes `role:"source"`.
  - **Library copies** (§6.2.4): `origin.builtin {libraryId, assetKey, rev}`, `credit`, and "Update from library" on the presets model.
  - Render ship modes and credits (§7.4); `layers[].autotile` (§6.4); H4 widened, still 6 hard errors (§13).
  - **`project.render.proceduralShip` and `project.render.credits`**, not `settings.*` and not knobs (§14.6c).
  - **Decoded-memory thresholds** from target-size-limits.md, per target, stage peak + project total, chunk-cache estimate shown; `"unrated"` retired (§10).
  - The r6 knobs (`wall_blocks_los`/`shots`, `clip_cues`) and `noMirror` are **confirmed by the Engine Architect**.
  - **CEO art answers (via CoS, 20:0x):**
    - The tile size suggestion follows the existing `settings.platform`. `settings.tileSize` stays explicitly stored, and a suggestion only seeds new projects (§3.1).
    - Units have a reserved `footprint`; v1 is 1×1 only, with tall sprites overhanging (§6.3).
    - **Parallax has one home: `map.background.layers[]`** `{assetId, depth 0..1, repeat none|x|y|both, fit?}`. The soft cap is 3 (it warns). Visual tile layers stay grid-locked, with no parallax factor. Old maps load unchanged with depth 1 via map 004 (§6.4; Editor & UX request, r7).
    - **The tile size suggestion table** (§3.1) is the only source the wizard reads: Mobile 64, PC 48, Both 64 (CoS).
    - Originals are kept and never exported (**confirmed**, §7.2).
    - `dedupe` is exact-match only, with no tolerance (**decided**, §6.2.1).
  - **Effect Designer (Editor & UX K-1–K-6, 20:0x)** (§6.7):
    - The Effects list is derived and sorted by name, then id. There's no cap. Duplicate gets a fresh history and " copy". Tags are project data.
    - Pictures are `assetId` refs (L32), and the closure walks owner → effect → picture.
    - Delete-and-switch and Save & use are compound actions with one undo. Steps 7+ are inactive in both Preview and Render.
    - Godmode for effects is all-stages only, plus an explicit "Fork for this stage".
  - **Catalogue rev 8** (L19–L26) is re-verified against every example (setup-format r8 §12.4b). `map` v4 → **v5**.
  - `tile-project` v4 → **v5** (migration 004), `map` v4 → **v5** (map 004).
- **r6 (19:5x):**
  - **Decided (Chief Of Staff, 2026-11-09):** share keeps originals by default; each wall is stored once; `objective-contest` is a single `spells` group; the ability-owner list (setup-format §2.9.5).
  - **Walls (Engine Architect):** edge blocking of movement and adjacency is **core grid** behaviour for any `logic.edges`. Line of sight and projectiles are two **`terrain` knobs**, `wall_blocks_los` and `wall_blocks_shots` (default true; request L24). `barrier-line` is in the closure only when a `barrier-line` setup exists, and adds only owner side, damage and destructible walls (§6.4, §7.2).
  - **Clip fallbacks and cues (Render):** a fixed 7-step resolution order, the optional AssetMeta flag `noMirror`, and generic hit-flash/lunge cues switched by the knob `unit-roster.clip_cues` (default on; request L25). The editor warns with the fallbacks in use, and nothing blocks (§6.2, §6.3, §7.3).
  - The decoded-memory meter stays `"unrated"` until the Architect sends **sourced** thresholds (§10).
- **r5 (19:5x):**
  - **Catalogue rev 7** (61 behaviours, 450 knobs). `terrain.tile_types` is the single home for tile meanings, and the map's logic **palette** names its ids (§6.4). Barrier edges are stored in **`map.logic.edges`** as `{c, r, side}` (§6.4). Named gates are copied into the slice (§4). `custom_groups` / `ability_group` are live (§5.1). `per_unit` stat keys (§6.3). `one_unit_per_tile` (§13). **Effect documents** in `effects/` (§6.7, setup-format §2.10). The ability-owner rule is in setup-format §2.9.5.
  - **Editor & UX art-upload gaps (`ux/art-upload.md` §6), Chief Of Staff rulings 1–8:** `AssetMeta.derivedFrom` (an ordered, replayable record of import fixes) and `role: "source"` originals (§6.2.1); auto-slice as `slice` + `dedupe` ops; derived `nativeScale` / `nativeTile`; facing clip names `down`/`left`/`right`/`up` (§6.3); colour key as an op; editor prefs outside the project (§11.3); a decoded-size meter (§10); and an odd-size info rule (§13).
  - `tile-project` v3 → **v4** (`tileProps.logic` becomes a tile type id) and `map` v3 → **v4** (`legend` → `palette`, plus `edges`) (§12).
- **r4 (19:4x):**
  - **CEO art stance (via CoS):** art must never look worse than the upload. `settings.advancedRender` (default `false`) gates the non-pixel-perfect options. While it is off, the reader treats `pixelPerfect` as true and background `fit` cover/stretch as `none`; `tile` stays allowed because it uses the integer path. Stored values are kept as inactive, like the shortcut rule (§3.1, §6.4, §7.2).
  - Engine Architect confirmed both render paths (ARCH §12.5 v0.4): `easeMs` defaults to 120 (0 = instant), `followDeadZone` stays 0.6, and with `pixelPerfect` off a fit-none map-size background scales with the camera.
  - Q11 is decided: difficulty applies to enemies by default, with `all` and `player` as options.
- **r3 (19:3x):**
  - **Asset spec** (Engine Architect `docs/asset-spec-proposal.md` r2 and ARCHITECTURE v0.3 §12, clashes K1–K15). AssetMeta v2 (§6.2), map v3 with visual `layers[]` and a separate `logic` grid (§6.4), map backgrounds with a fit mode, image pages, per-map tile size, `filter`, and camera/screen settings (§3.1). `tile-project` goes v2 → v3 and `map` goes v2 → v3 (§12). C4 and the freedom principle are applied: nothing new is hard beyond the reach of H3/H4/H5.
  - **Size meter** (CoS Q8, with confirmed figures from `docs/target-size-limits.md`): §10.
  - **Difficulty multiplier** (CoS Q9): §3.1, §6.5, §7.1 layer L5.
  - **Per-stage presentation** (CoS Q10). `stage.overrides.setups` is now keyed by **behaviour id**, so overrides survive a swap of the setup underneath. Stage goes v1 → v2 (§6.5, §12).
  - The Q7 leftover is fixed: `stage.loadout` replaces the project loadout whole (§6.6, §15).
  - CoS approved two of the Keeper's calls on 2026-11-09: setup v3 with checks derived on read, and `custom_groups` (list) plus `ability_group` (ref) (§14.4).
  - Render opens projects through the writer (§11.1).
- r2 (19:2x):
  - The project rulings P1–P6 are **CEO-approved 2026-11-09**. CEO scope calls S1–S4 apply.
  - The ARCHITECTURE v0.2 §11 rulings C1–C6 are Chief Of Staff rulings (§14).
  - Catalogue **rev 6** adopted: renames, nested gates, `required`, behaviour gates.
  - Matched to the CoS rulings on the ui-shell gaps: enemy pool on stages, loadout with a stage override, `_protoStats` import, OPFS, and option renames from the catalogue.
  - Stage is separate from map. Render stage selection. Unit stat layering. Strip-on-share. Size recording. `host` removed. `extensions.online`.

Grounded in:
- `END-GAME-REQUIREMENTS.md`, including "Scope calls".
- `docs/ARCHITECTURE-v0.md` §3.4 and §11.
- `g-tile-engine/src`:
  - `engine/pack.ts`: `declare`/`load`.
  - `image.ts` and `sprite.ts`.
  - `square.ts`: `StageCam`.
  - `chess/towerLoad.ts`.
  - `anniversary/board.ts`: `COLS 6`, `ROWS 9`.
  - `skillrig/spec.ts`: `Sq {c,r}`.
  - `chess/game/save.ts`: `migrate()`.
- The ui-shell prototype (`ui-shell/js/project-store.js`, `app.js`, 19:15).
- **Current catalogue pin (r39): `catalogue_rev` 24**, 63 behaviours, 563 knobs (setup-format r29 §12.4k; `CATALOGUE.md` internal only). *Earlier pins:* rev 23, 563 knobs (r38, §12.4j); rev 17, 544 knobs (r14 in place, 22:4x); rev 15, 538 knobs. *History:* catalogue `catalogue_rev` 7 with SCHEMA.md and gaps.md §13 (19:39).
- `ux/art-upload.md` r1 (Editor & UX Designer), §2 and §6.
- `docs/procedural-and-library-proposal.md` r1 and `ARCHITECTURE-v0.md` v0.5 §13–14 (19:55); `docs/target-size-limits.md` "Decoded memory".
- `docs/asset-spec-proposal.md` r2 (19:26) and `docs/target-size-limits.md` (19:27).

---

## 1. Principles
1. **One self-contained store.** Built-in art is copied in on first use (P4). Render reads only the store.
2. **Each authored fact lives in exactly one document.** The manifest `index` is computed on save, never edited, and never trusted over the files.
3. **Every document has `kind` and `formatVersion`**, with a migration chain per kind, run by the writer only (§11.1).
4. **Render input is a closure over the selected stages** (P2).
5. **Offline core** (S2). No network field exists outside `extensions` (§9).
6. **Warn, don't block** (S1, C4). Hard errors exist only where the game literally can't run (§13).
7. **Full editing on every platform** (S3). The same tree is used on desktop (folder), web (**OPFS directories**) and Android/iOS (`Directory.Data/tileengine/projects/`).
8. **Freedom principle, except for art (CEO, r4).** Where the engine has a preferred rule, the rule is the default and the alternatives are options that warn. **Art is the exception: it must never look worse than the upload.** Pixel-perfect drawing and exact-size backgrounds are locked-on defaults, and blurring or stretching options sit behind one explicit advanced opt-in, `settings.advancedRender` (§3.1).

## 2. Layout
```
<name>.tileproj/                   folder; zipped form = same tree; on web an OPFS directory tileengine/projects/<projectId>/
  project.json                     manifest: { kind, formatVersion, project (stored), extensions (opaque), index (computed) }
  catalogue/slice.json             catalogue slice at project.catalogueRev (§4)
  setups/<setupId>.json            behaviour-setup v3 (setup-format §2)
  presets/<presetId>@<rev>.json    embedded presets (setup-format §6.3–6.4)
  paint-styles/<id>@<version>.json embedded paint styles, one per pinned version (§6.2.5, r10)
  sprite-recipes/<recipeId>.json   sprite-recipe v1 (ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1)): Sprite Studio recipes, id `sprite_<ULID>` (sprite-recipe-rulings.md; EA sprite-recipe-architecture.md)
  maps/<mapId>.json                map v4: tile size, background, visual layers[], logic grid + palette + edges (§6.4)
  stages/<stageId>.json            stage v2: mapRef + placement + enemy pool + loadout override + rules + overrides + difficulty override (§6.5)
  units/<unitId>.json              unit v2: sprite, setups, own stat values (§6.3)
  decks/<deckId>.json              deck v1 (PROPOSED, r13): card copies per deck (§6.8)
  achievements/achievements.json   achievement-set v1, scope "game:<projectId>" (PROPOSED, 23:0x): game-scoped definitions only; defined in profile-format.md §2. Never per-player progress.
  effects/<effectId>.json          effect documents: behaviour-setup v3 of `effect` (§6.7, setup-format §2.10)
  effects/.deleted/<id>.json       undo trash for deleted effect documents (§6.7); the reader skips it with no row (r41)
  assets/<assetId>.<ext>           content-addressed files, including background, page and `role:"source"` originals (§6.2)
  notes/notes.json                 Preview notes. Editor-only; never exported, removed on share (§8, §11).
```
- Ids are `<kind>_<ULID>`. Assets are `asset_<first 16 hex of sha256(bytes)>`.
- Unknown files are kept and ignored, with a warning.
- **Unknown keys inside known documents are kept on save** (r13, R4), so optional fields added without a version bump survive older or narrower writers.
- **Not in the project:** per-user editor view state (last zoom, minimap, active layer, overlays) and meter thresholds live in `editor-prefs` (§11.3).

## 3. Manifest: `project.json`

### 3.1 Stored (`project`)
| Field | Type | Rule |
|---|---|---|
| `id`, `rev`, `name`, `createdAt`, `updatedAt` | | `rev` is +1 per save |
| `copiedFrom` | `{projectId, rev, at} \| null` | Set by duplicate or share (§11) |
| `catalogueRev` | int | The single catalogue pin. All setups and presets match it on save. |
| `settings` | `{platform, combat, camera, tileSize, fog, wrapEdges, screenFit, letterboxColour, maxImageSide}` | Wizard steps A–E, plus ARCH §12 (K9–K13). See the table below. **No caps**; ranges warn only (C4). |
| `difficulty` | `{hp: number, damage: number, appliesTo: "enemies" \| "all" \| "player"}` | **Q9, Q11 decided (CoS):** applies to enemies only by default; `all` and `player` are options. Defaults `{hp: 1.0, damage: 1.0, appliesTo: "enemies"}`. Stored once here; a stage may override fields (§6.5). Applied as layer L5 (§7.1). |
| `stages` | stageId[] | **The authored stage order.** It drives Stage select, the Preview selector and the Render order. |
| `rules` | setupId[] | Project-wide setups, **at most one per behaviour**. They include `ability-presentation` (required; holds the ability groups, §5.1), the army `unit-roster`, and optionally a `win-condition` that serves as the default for every stage. |
| `loadout` | `Loadout = {roster: unitId[], size: int ≥ 1, required: unitId[]}` | The project loadout (§6.6). A stage may override it. |
| `render` | `{excludedStages: stageId[], targets: ("browser" \| "android" \| "ios")[], proceduralShip: "auto" \| "bake" \| "live", credits: bool}` | P2, S4. Stored as exclusions, so new stages start ticked. r7: `proceduralShip` (default `auto`) and `credits` (default `true`), §7.4, §14.6c. |
| `assets` | `Record<assetId, AssetMeta>` | §6.2 |
| `audio?` | `ProjectAudio`, **defined in [audio-format.md](audio-format.md) §3** | **PROPOSED (23:1x / 00:2x).** Bindings `{id, event, soundId, variants?, volume?, pitchJitter?, cooldownMs?, duck?, match?}` keyed by event-registry keys (battle cues = tactics `ModeEventMap`). Music slots `{title, menu, battle}` (stage override is on the stage document, §6.5). `procedural: live \| bake`. Runtime `options` include `musicMode` / `musicDecodeMaxMs`. Section guard `audio:1`. Absent = silence; no migration. Player volumes are never here (profile-format). |
| `gameSettings?` | `game-settings` customisation, **defined in [profile-format.md](profile-format.md) §3.4** | **PROPOSED (r14 in place, 23:0x).** The game's customisation of a settings template: `template` (pin, e.g. `"btf-hud-settings@1"`, inherited from the BTF template, profile-format §3.3), `controls`, `added`. The shape lives in profile-format only; this row is a pointer. **Effective settings are computed, never stored.** Per-player values live in the game's `player-profile` and are **never in the project**. Absent = no settings screen customisation; no migration. |

**`settings` fields** (r3):

| Field | Type | Default | Notes / checks |
|---|---|---|---|
| `tileSize` | int px, **always stored** | Suggested from `settings.platform`, using the **tile size suggestion table** below | **Default tile size for maps** that don't set `map.tile` (K9). Warn outside 32–128. **CEO (r7):** the platform target is the existing `settings.platform` (Browser = `pc`, Mobile = `mobile`, Both = `both`); there's no second field. The wizard pre-fills the suggestion and the user can change it. The chosen value is written explicitly. **Changing `platform` later never rewrites `tileSize`.** The editor only shows "Suggested for Mobile: 64" beside it. |
| `camera.view` | `"top-down"` | | |
| **`advancedRender`** | bool | **false** | **r4, CEO art stance.** The one advanced opt-in for drawing that may blur or stretch art. **Only a direct user action in Settings → Advanced can set it**, behind a "may blur or stretch your art" confirmation. Presets, import, Godmode, migrations, duplicate and share **never** set it; share and import copy it as false. An absent field reads as false. |
| `camera.pixelPerfect` | bool | **true** | K10. **Effective only when `advancedRender` is true.** While it is false, the reader treats it as `true` whatever is stored: a stored `false` is kept, inactive and unused, the same rule as the presentation shortcut. On: zoom values are whole-number scale steps and art draws only at integer scale. Off (advanced): fractional zoom, with a "may blur your art" warning. |
| `camera.zoom`, `zoomMin`, `zoomMax` | number | 1, 1, 6 | With effective `pixelPerfect`, a fractional value gives a warning and the runtime rounds it to the nearest step (min 1). `zoomMin > zoomMax` warns, and they are swapped. |
| `camera.follow` | `"fixed" \| "selected"` | `"fixed"` | |
| `camera.followDeadZone` | number 0–1 | 0.6 | K11, confirmed. The inner box fraction (ARCH §12.2). Outside 0–1 warns and is clamped. |
| `camera.easeMs` | int ≥ 0 | **120** | K11, confirmed by the Architect (ARCH §12.5 v0.4). 0 = instant. |
| `camera.edgePan` | bool | false | |
| `screenFit` | `"letterbox" \| "crop"` | `"letterbox"` | K13 |
| `letterboxColour` | colour | `"#000000"` | K13. An unparseable value is an H2 hard error. |
| `maxImageSide` | int px | 4096 | K13. Import slices images above this side, or above 16,777,216 px area, into pages (§6.2). Raising it to 8192 warns ("fails on some Android and iOS ≤ 17 devices", ARCH §12.6). |
| `fog` | bool | false | |
| `occupancy` | `"strict1" \| "softStack" \| "laneSlots"` | `"strict1"` | **PROPOSED, MAY-MOVE (r14; MODES-v2 B3, which names these three).** It's the core's cell density model. `strict1`: one unit per cell (tactics). `softStack`: path creeps may share a cell (TD). `laneSlots`: fixed formation slots per lane (idle). **The v1 core implements `strict1` only.** Any other value is a **warning** (`occupancyUnsupported`), and it runs as `strict1`. It's kept as stored. **r14 (Engine Architect): this is the single source.** `unit-roster.one_unit_per_tile` is converted into it (`true` → `strict1`, `false` → `softStack`), and its old answer is kept inactive in `orphans` (setup-format §8.2, L42). The editor shows only this picker. **Project-wide in v1:** a per-stage occupancy override is **FUTURE ONLY** (not in v1). Stage values are kept inactive with `occupancyStageValueIgnored`. |
| `offlineCapMs` | int ms ≥ 0 | `28800000` (8 h; default accepted by the Engine Architect) | **The feature is PROPOSED, not v1-blocking (r14; MODES-v2 offline catch-up).** Caps offline catch-up for `save` documents (§6.9). `0` = no catch-up. A non-integer reads as its floor, with a warning. Above 7 days is a warning ("slow resume"), never a block. Used only by modes that write saves. |
| `online` | `{sync: bool, syncAdapter?: string, backend: {endpoint: string, clientId?: string} \| null}` \| absent | absent = `{sync: false, backend: null}` | **PROPOSED (r4 in place 23:0x; [sync-format.md](sync-format.md) r4 §5.4; ARCH v0.6.7 §5.2.1).** It's the **bring-your-own-backend Online Kit**: the studio hosts no shipped games. `sync` turns on cloud saves. `syncAdapter` names the adapter package (absent = `@te/sync-ref`). **`backend` is neutral and shared** by `@te/sync` and `@te/net` (multiplayer, FUTURE, ARCH §5.2). `endpoint` is the maker's **public `https://`** URL, and **`clientId` is public only** (an OAuth client id or publishable key). `@te/sync` and the adapter are bundled **only** when `sync` is `true`; otherwise the export audit FAILS. The audit also FAILS on `secretInBundle` (any secret-looking value) and `studioAdapterInGame` (`@te/sync-studio` in a game bundle). Warnings: `syncAdapterMissing`, `syncEndpointInvalid`. Not `extensions.online` (§9, the opaque user-module slot). No migration (the r2 shape was PROPOSED and never shipped). |
| `studioProject` | bool | `false` | **r14 (Engine Architect).** `true` marks a studio project (TileEngine's own), whose **release exports** get the **strict** licence CI (ARCH §14.2, §6.2.4). Absent = `false`. No migration. |
| `wrapEdges` | bool | false | **MAY-MOVE (r13, Engine Architect).** **The v1 core ignores it**, and `true` is a **warning** (`wrapEdgesIgnored`: "wrap isn't supported yet; edges don't wrap"). It's kept as stored. Future semantics (not v1): `none \| x \| y \| both`, plus line of sight and pathing across the seam. |
| `paintStyleDefault` | `{id, version}` \| absent | absent (the wizard then uses **`btf-ashroad@2`**, CEO 2026-11-09; `btf-moonlit@2` one tap away) | **r12 (ARCH v0.6 §13.4).** The style for **new** "Paint with code" assets only. It is **never read when painting**: every asset pins its own `params.paintStyle`. Not embedded by itself: the style is embedded when an asset first pins it. An unknown id or version is info, and the wizard falls back to its default. |

**Tile size suggestions (r7; the only source the wizard reads).** These are editor constants, `TILE_SIZE_SUGGESTION` (§16). They are never stored in a project; the chosen value is stored in `settings.tileSize`.

| `settings.platform` (wizard label) | Suggested `tileSize` | Why |
|---|---|---|
| `mobile` (Mobile) | **64** | Touch targets and readability on phones (wizard default since r3) |
| `pc` (Browser) | **48** | Desktop screens fit more tiles at a readable size (wizard default since r3) |
| `both` (Both) | **64** | **The smaller screen governs readability** (CoS, r7, for Editor & UX) |

- Seeds new projects only. Changing `platform` later never rewrites `tileSize`, and it never moves maps that set their own `map.tile`. Changing a suggestion in a later app version never touches existing projects.

**Not stored:**
- the player's chosen loadout units (runtime data, §6.6)
- ability groups as a manifest field (they are answers, §5.1)
- `host` / `host.limits` (C5: the in-game level maker is out of scope; migration drops them, §12)

### 3.2 Opaque (`extensions`): see §9

### 3.3 Computed on save (`index`)
| Field | From |
|---|---|
| `computedAt`, `projectRev`, `catalogueRev` | The save |
| `setups[] {id, behaviourId, rev, playable, warnings, used}` | `playable` and `warnings` come from setup-format §2.5; `used` means it is in the export closure |
| `behaviours[] {id, setupIds, active, used}` | `active` = the behaviour gate on at least one selected stage (§5) |
| `presets[] {ref, file \| null, referencedBy}` | `presetRef`s |
| `units[] {id, setupIds, onStages, used}` | Via loadouts, enemy pools and neutrals |
| `maps[] {id, cols, rows, usedByStages}` | |
| `stages[] {id, mapRef, selected}` | |
| `assets[] {id, sha256, bytes, mime, w, h, decodedBytes, nativeScale, usedBy, used}` | `decodedBytes = w×h×4` for images; `nativeScale` derived from `derivedFrom` (§6.2.1) |
| `effects[] {id, name, referencedBy, used}` | Effect documents and the owner answers that point at them (§6.7) |
| `presentation {groups: [{id, presentation}], usesCardHand, usesMenu}` | Resolved from the `ability-presentation` setup (§5.1); used by Render to pick modules |
| `export {stages, setups, behaviours, units, effects, assets, extensions, errors[], warnings[]}` | The closure (§7.2) and the §13 checks |
| `size {totalBytes, fileCount, files[], byKind, decoded, meters[], warnings[]}` | §10. Per-file sizes and the file count of the export closure, plus the decoded-size estimate. |
| `notes {open, total}` | |

On load the index is recomputed and the files win.

## 4. Catalogue slice: `catalogue/slice.json`
- **Contents:** `{kind:"catalogue-slice", formatVersion:1, schema_version, catalogue_rev, gates, behaviours[]}`. `gates` is the catalogue's named-gate table, copied whole (2 entries at rev 7).
  - It holds every behaviour any setup or effect document uses, plus every behaviour named by a gate leaf (after inlining named gates), a `ref.list`, or an `@` dependency of those (always `ability-presentation`). Plus every behaviour the slice marks **`closure: "always"`** (rev 9 ships it as `closure`, L31). Today that's only `terrain` (tile meanings and the wall knobs). `barrier-line` is included only through a setup, like any behaviour. Plus `effect` (with its presets, the BTF builtins) when any `effect` answer isn't `none`.
  - Entries are verbatim, minus `sources`, `variants`, `used_by`, `conflicts`, `needs_reverify`, `knobs[].default_source`, `item_cites` and `item_sources`.
  - It keeps `events`, `event_map`, `ruling`, option `status` / `ruling` / `note` and `single_option_reason`, because the editor shows them offline.
  - The catalogue no longer has `canonical_path` (rev 5).
- **Generated on save** by the writer, never edited.
- **Upgrades** run the renames and drift of setup-format §8.2 over every document (§12).

## 5. Enabled behaviours and gates (per stage)
- **Gate leaves resolve per stage**, using the §7.1 layering on that stage, so a stage that overrides `ability-presentation` gets its own gate results.
- A behaviour is **active on a stage** when its behaviour gate holds there (setup-format §2.6). It is **enabled** when one of its setups is in the closure and it is active on that stage. This feeds `@` dependencies.
- A gate behaviour with no setup resolves to catalogue defaults. That is only for display, because a missing `ability-presentation` setup is a hard error (§13).

### 5.1 Ability groups and presentation (C6)
- **One source:** the `ability-presentation` setup in `project.rules` (stage-overridable like any setup).
  - Answers (rev 7): `shortcut` (`all-menu` / `all-cards` / `custom`, required, asked in the wizard), `basic_style`, `spells_style` (required while Custom) and `hand_placement` (active when any group uses card hand). `hand_placement` is Architecture's `presentationLayout`.
  - **User-added groups** are one `list` answer, `custom_groups` (rev 7; reserved `basic`, `spells`; setup-format §2.9). There is no manifest field for them.
- **Group of an ability:** the owning behaviour's `ability_group` `ref` answer (rev 7: on 37 owners, default `spells`, `basic` on `step-pattern` and `basic-attack`; L22 adds `objective-contest` and `sword-lifecycle`, setup-format §2.9.5). `basic` holds move, basic attack and wait. Modifiers (`mana-gain`, `ability-refresh`, `adjacency-synergy`) have no group; they follow the ability they modify.
- **Resolved per stage** (and copied to `index.presentation` for the first selected stage, with Render resolving every stage):
  - `groups` = `basic`, `spells`, then each `custom_groups` item.
  - Each group's `presentation` = `unit-action-menu` under All menu; `card-hand` under All cards; under Custom, its own picker or item `style`.
  - `usesCardHand` / `usesMenu` = whether any group has that presentation.
- **"Any group uses card hand"** is the catalogue's named gate `uses-card-hand` (rev 7), including the `custom_groups` `some` branch (setup-format §2.6).
- **Per-stage presentation (CoS Q10).** A stage inherits the project's presentation. To change it on one stage, set knobs under `stage.overrides.setups["ability-presentation"]` (for example `{"shortcut": {"value": "all-cards", "rev": 1}}`). Gates, module selection and the closure resolve per stage (§5, §7.2).
  - An L2 override counts as an answer for `required` (setup-format §2.5). Setting `shortcut` to `custom` on a stage therefore needs `basic_style` and `spells_style` to be answered at the project setup or overridden on that stage. Otherwise H1 applies on that stage only.
  - A stage could instead replace the whole setup via `stage.rules`. That is allowed too, but the override is the documented way.
- **The shortcut is stored** (it is the required answer), and the per-group values are inactive and kept unless it is Custom. That matches "the shortcut sets every group" without a second copy.

## 6. Documents

### 6.1 Setups and presets
Defined in setup-format.md. Presets are editor-only and never exported.

### 6.2 Assets: AssetMeta v2 (P4, CEO-approved: each project copies the built-in art it uses; K1, K2, K5, K6, K12)
`project.assets: Record<assetId, AssetMeta>`. **Frame sizes, grids, anchors and clips are defined only here.** Units, maps and stages reference an asset by id and never restate its geometry. Units pick clips by name (§6.3).

| Field | Type | Applies to | Default | Check (C4) |
|---|---|---|---|---|
| `name`, `ext`, `origin` | `origin`: `upload {fileName, bakedFrom?}` \| `builtin {libraryId, assetKey, rev, src?}` \| `procedural {params}` (r7) | all | | `ext` is not stored for procedural. `origin.builtin.src` is legacy provenance only: never fetched, and audit-exempt (ARCH C9). §6.2.2–6.2.4 |
| `credit` | `{author?, license?, url?, title?, note?}` | any | absent | r7, §6.2.4. Render reads only this for credits. |
| `tileTypeOverrides` | `Record<recipeId, tileTypeId>` | procedural tilesets | `{}` | r7, §6.2.2 |
| `kind` | `"tileset" \| "sprite" \| "image" \| "background" \| "page" \| "audio"` | all | | `background` and `page` are new (K5). Any image kind may still be used as a background; `kind` is a picker hint. |
| `filter` | `"nearest" \| "smooth"` | images | `"nearest"` | **Info** when `ext` is `jpg` and the filter is `nearest`: JPEG artefacts show at integer zoom (K12). Never a block. |
| `tile {w, h}` | int px | tileset | `h = w` | Warn when ≠ the map's tile size: the tile is drawn at native size with its **bottom-left corner on the cell's bottom-left**, never stretched and **never clipped** (r27, CEO 13:20, replaces K1's top-left clip). A taller tile reaches up over the rows above and a wider one over the cells to its right; a smaller tile sits in the cell's bottom-left. Tiles are drawn row by row from top to bottom and left to right within a row (per layer), so a lower row's tile covers an upper row's overflow, the same as Tiled's right-down order. |
| `grid {columns, rows, margin, spacing}` | int | tileset, grid sprite sheets | margin 0, spacing 0. Columns and rows are derived from the image when absent: `(imgW − 2·margin + spacing) / (tile.w + spacing)`. | Warn on leftover pixels (K1) |
| `tileProps` | `Record<tileIndex, {anim?: clipName, logic?: tileTypeId, lightSource?: LightSource, motion?: Motion}>` | tileset | `{}` | **r5:** `logic` is a `terrain.tile_types` id. When painting, the editor writes that type's palette index (adding a palette entry if needed) into `map.logic.terrain` (§6.4). A painter default only; never read at runtime. An unknown id is info and is ignored. **r31 / r32:** `lightSource` and `motion` are per-tile overrides of the asset fields, each replaced whole (see those rows). |
| `frame {w, h}` | int px | sprite | the whole image (a single frame) | Warn if the image isn't a whole multiple (K2) |
| `layout` | `"grid" \| "packed"` | sprite | `"grid"` | |
| `frames[]` | `{name?, x, y, w, h}` | sprite, `layout:"packed"` | | Warn if a clip names a missing frame. The clip skips it, and uses frame 0 if none is left. |
| `anchor` | `{x, y, units: "px" \| "norm"} \| "auto"` | sprite | `{x: 0.5, y: 1, units: "norm"}` (bottom-centre) | `"auto"` = BTF `measureSprite` foot detection (K2). This fixes the "feet float above the slab" note in §17.5. |
| `clips[]` | `{name, frames: int[], fps?: number, ms?: int[], loop?: bool}` | sprite, tileset | none, which means static frame 0; `fps` 8; `loop` true | `name` is free text, 1–32 chars, unique per asset (a duplicate warns; the first wins). Well-known names: §6.3. Warn (**`clipMsLength`**, r28) if `ms.length ≠ frames.length`: a short `ms[]` is **padded with its last value**, a long one is cut to `frames.length`, and an empty `ms[]` counts as absent (r26; r28: the step 30 build pads at play time in the render core, which is equivalent; moving it into the reader is a later carry. The stored `ms[]` is never rewritten either way). If both `fps` and `ms` are given, `ms` wins, with warning **`clipFpsIgnored`** (r28). **Invalid `ms[]` (r29):** if any entry is not a whole number ≥ 1 (NaN, non-finite, 0, negative, fractional or not a number), the whole `ms[]` is ignored (r30: so is an `ms` that is present but not an array, e.g. a string, number or object; `ms: null` reads as absent with no warning) with warning **`clipMsInvalid`** (once per clip, checked before `clipMsLength`, which is then not raised), and the clip plays by `fps` (or 8). `clipFpsIgnored` is not raised in that case. The stored value is never rewritten. **`fps` (r26):** a finite number **> 0**; fractions are legal (the token generator writes 2.5). Absent means 8. 0, negative, non-finite or non-number gives warning **`clipFpsInvalid`** and the clip plays at 8; the value is kept as stored, never rewritten, and the load never fails. |
| **`clips[].events`** (r35, CN-014; ACCEPTED pending EA) | `{frame: int, name: string}[]`, at most **16** per clip | sprite (on a tileset clip it's kept and ignored silently) | absent, `null` or `[]` = **derived events**, never stored: `contact` = the frame with the biggest pose change from the frame before (recipe sprites: joint deltas), else `floor(n / 2)`; `release` = the same frame | `frame` is a 0-based index into the clip's `frames` (not the sheet), 0 ≤ `frame` < `frames.length`. `name` is `"release"`, `"contact"`, `"step"`, `"end"` or a custom name of 1–16 characters (for sound). An event's time is the sum of the clip's resolved per-frame ms (after the `ms[]` / `fps` rules above) up to the start of its frame, on the clip's `effectT`; same-frame events fire in stored order. The first `contact` in time feeds `hitAt` (setup-format §2.10.3). A bad entry (frame not a whole number in range, name empty, over 16 characters or not a string) is skipped with **`clipEventInvalid`** once per clip; a non-array `events` warns the same and reads as absent. Over 16 entries warns **`clipEventsOverCap`** once per clip: **the first 16 in stored order fire**, the rest are kept and never fire. Never rewritten. A mirrored fallback clip (§7.3 step 2) uses its source clip's events |
| **`clips[].points`** (r35, CN-014; ACCEPTED pending EA) | `{hand?, tip?, head?, centre?: ([x: int, y: int] \| null)[]}` | sprite (tileset: kept and ignored silently) | absent = derived per frame: `centre` = the centre of the frame's opaque-pixel box, `head` = its top-centre plus 2 px; `hand` / `tip` = none, and they fall back to `centre` | One entry per clip frame, whole art px from that frame's top-left, 0 ≤ x < frame w, 0 ≤ y < frame h. **A 1-entry list means "same spot on all frames"** (no warning). Any other length ≠ `frames.length` pads with its last entry or is cut, with **`clipPointsInvalid`**; so does a bad entry (not a pair of whole numbers, or outside the frame), which reads as `null` (the derived / fallback point). One warning per clip; the message names the point and the problem. **There is no `foot` point:** foot is the AssetMeta `anchor` (one source); a stored `points.foot` is kept and ignored with `clipPointsInvalid`. Mirroring (`x' = fw − 1 − x`) is runtime-only; each facing clip has its own points and a mirrored clip uses its source's |
| `pages[]` | `{assetId, x, y, w, h}` | any image over `settings.maxImageSide` or 16,777,216 px area | set by import (K6) | Each page is an ordinary `kind:"page"` asset. **`pageOf` is not stored**; it is derived from the parent's `pages[]` (one source). |
| **`derivedFrom`** | `{assetId, ops: DeriveOp[]}` | any image made by an import fix | absent = uploaded as-is | r5, §6.2.1 |
| **`role`** | `"source"` | the original upload of a derived asset | absent = a normal asset | r5, §6.2.1 |
| **`noMirror`** | bool | sprite | `false` | r6. `true` stops Render from mirroring left↔right to fill a missing facing (§7.3 step 2), for art that isn't symmetric (a sword hand, a shield, text). |
| **`lightSource`** (r30, ACCEPTED r31) | `{radius: int ≥ 1 /* art px */, colour?: "#rrggbb"}` | sprite, image; tilesets put it per tile in `tileProps[i].lightSource` | absent = no light; `colour` `"#ffb048"` | Render only (a torch, lamp, glowing crystal). Invalid (radius missing, not a whole number ≥ 1, unparseable colour) gives **`lightInvalid`** once per asset and no light; never rewritten. **Named `lightSource`, not `light`,** because a paint style's `light` already means shading direction (§6.2.5). How a light behaves under a stage dim is not stored here: the playing effect's dim step decides (setup-format §2.10.1 `dim_lights`). |
| **`nightVariant`** (r30, ACCEPTED r31) | `assetId` | tileset, sprite | absent = no night art; the day sheet is drawn under the night wash | The moonlit swap. Set on the **day** asset only, pointing at its night asset (e.g. painted with `btf-moonlit@2`). No naming rule: names are free text and ids are content hashes, so a link is the one source. The night asset must match `tile`/`grid` (tilesets) or `frame`/`layout`/`frames[]` (sprites); otherwise **`nightVariantMismatch`** and the day asset is drawn. A missing target, a chain or a cycle is ignored with the same warning. The night asset is in the closure only when a night stage uses it. |
| **`motion`** (r32, ACCEPTED EA 17:59) | `{cycle?, scroll?, sway?}` | sprite, tileset, image; tilesets may also set it per tile in `tileProps[i].motion` | absent = no motion; the asset draws as painted | Render only. Named **`motion`, not `bake`**, because `bake` already means proceduralShip `bake` and `bakedFrom` (§7.4, §6.2.3); it is not an `anim` extension (`tileProps.anim` is a clip name). The tile's object replaces the asset's whole, the same as `lightSource`. **`objects[].motion?` (CEO 18:04 via CoS):** a per-placement switch; makers turn it on or off per plant. It replaces the asset's (or tile's) whole motion. `null` = this placement has no motion; absent = inherit. Same checks as this row. **`cycle = {ramp, ms?: int 50–1000 default 150}`:** `ramp` is either `{name: <style ramp key>, steps: int[]}` (0-based indexes into the style's `ramps[name]`, dark to light, 2–8 of them, no repeats), used under a paint style, or a literal `"#rrggbb"[]` of 2–8 colours, allowed only on an asset with no style. It bakes one frame per step. **Transparent pixels (alpha 0) and pixels whose colour isn't on the ramp never cycle.** **`scroll = {step: int ≥ 1 dividing the tile size on that axis, axis?: "x"\|"y" default "x", ms?: int 50–1000 default 200}`:** bakes `size / step` frames. **`sway = {trunkFrom: int ≥ 0 (required), edge?: int 1–4 default 2, ms?: int 100–1000 default 400}`:** bakes 4 poses. **`ms` is a stored field** (int 100–1000, default 400), not only a code constant. **`edge` is 1–4** (default 2; confirmed r33). The frame border counts as transparent for sway's edge detection. Sway is set per asset, with no `leafy` tag; the tree, bush and grass recipes and the BTF bake script write `motion.sway` on their outputs. The phase offset is derived at runtime and never stored: sway uses the world-x travelling wave, and cycle and scroll use the per-instance hash. There is no stored offset field. The river speed (1 px per 0.2 s) and the default sway timing are code constants that match the format defaults (`scroll` `step` 1, `ms` 200; `sway.ms` 400). They have no format effect beyond those defaults; `sway.ms` remains a stored field. Combined parts each keep their own `ms` and advance on their own: `pose = floor(t / ms_part) mod n_part`. The baked atlas is the product of the parts' frame counts, capped at **64** (this field creates that cap; it is not the r25 effect-block 64-step cap). The runtime picks the atlas cell from the part indices, with no shared clip tick. Over the cap, **`motionTooLarge`** warns once per asset, motion is skipped and the asset draws as painted. **Clip-wins is decided at load, per drawn cell**, not by whether a clip is playing. Motion is ignored on that cell, with **`motionInvalid`** (once per asset), when the cell is animated: a tileset tile whose `tileProps[i].anim` (stored or derived) names a clip, or a sprite asset with a non-empty `clips[]`. Image assets have no clips. Under a paint style the water slot derives a clip from `anim`, so motion on styled water applies only with `anim: null`. A bad value, a colour list on a styled asset, an index-form ramp on an unstyled asset, or an out-of-range step gives **`motionInvalid`**, once per asset, and that part is skipped. The stored value is never rewritten. On a procedural asset, motion lives in the hashed params, like `anim`; a stored AssetMeta or `tileProps` `motion` is ignored with **`styleParamIgnored`** and kept (R4). When the player's `accessibility.reduce_motion` is on (profile-format §3.3), cycle, scroll and sway draw frame 0. The shore's breathing foam and waves also freeze on frame 0; the static foam line stays visible (§6.2.5 `shore`). |

- **Computed, not stored:** sha256, bytes, mime, w, h, the derived grid columns/rows, a page's parent, `decodedBytes`, and everything in §6.2.1's derived table.
- **Audio assets (`kind: "audio"`; PROPOSED, 23:1x):** the origin `procedural-audio {generator: "sfxr@N", params, seed}` (not the art `procedural` kind), the `loop?` field, the `ext` values `m4a`/`wav`, the audio `bakedFrom` and credits are defined only in [audio-format.md](audio-format.md) §2.
- The id is the content hash, `asset_<first 16 hex of sha256>` (K8: no clash). Exported URLs are relative: `assets/<id>.<ext>`.
- **Upload image types (r41, D29).** An image upload is exactly the `ext` enum's images: `png`, `jpg`, `webp` (mime `image/png`, `image/jpeg`, `image/webp`). The type comes from the sniffed bytes, never the file name; `.jpeg` is stored as `jpg`. An animated PNG or WebP is read as its first frame (clips come from sheets). Anything else (gif, svg, bmp, heic, avif, …) is refused at import **before any write** with `uploadTypeUnsupported` `{fileName, sniffed}`. That is an import-time reject, outside the load-time H list. **Until the K6 slice-on-import lands** (below), an upload over **4096 px on either side** is also refused at import before any write, from the header alone (never decoded), with `uploadTooLarge` `{fileName, w, h, max: 4096}` (EA 2026-11-25; merged 9b shows a plain message). `settings.maxImageSide` and the 8192 PC toggle come later, with the slicer. An import writes the file and its index entry in one `commitWrites`, so it never creates `assetFileMissing`.
- **Oversize images (K6).** Import slices any image over the limits into pages: an exact pixel copy, no resampling, each page ≤ `maxImageSide` and ≤ 16,777,216 px. The parent file stays in the store for the editor; only the pages are exported. An unsliced oversize image in the closure gives a **warning**, and Render slices it into pages in the build, without changing the store. Nothing blocks.
- **Editor list:** `page` assets are hidden and shown under their parent.
- **Resample at import (K14, Editor & UX):** "Shrink to fit" writes a **new** asset (`scale` op with `k` ½ or ¼, §6.2.1). It is never a runtime stretch.

#### 6.2.1 Import fixes: `derivedFrom`, `role: "source"` and derived facts (r5, art-upload rulings 1, 2, 3, 5)
**`derivedFrom = {assetId, ops: DeriveOp[]}`** is an ordered, replayable record of the fixes applied at import. Applying `ops` in order to the pixels of `assetId` gives this asset's pixels.

| `op` | Params | Meaning |
|---|---|---|
| `crop` | `x, y, w, h` (int px, in the image as it is at that step) | Keep that rectangle. The UI's 3×3 "keep which part?" anchor is only how the rectangle was chosen; the rectangle is what replays. |
| `pad` | `left, top, right, bottom` (int px ≥ 0), `fill: "transparent" \| "edge" \| "#rrggbb"` | Add borders |
| `scale` | `k`: an integer ≥ 2 (nearest-neighbour, pixel-exact), or `0.5` / `0.25` (box resample down: the explicit "make a smaller copy", K14) | Zoom ×k at import. Never at runtime. |
| `colourKey` | `colour: "#rrggbb"`, `tolerance?: int 0–255` (default 0 = exact) | Pixels of that colour become fully transparent. **Baked** at import (ruling 5); AssetMeta has no transparent-colour field. |
| **`cropFrames`** (r8) | `frame: {w, h}` (int px: the frame cell size of the image at that step; cells tile it row-major from the top-left), `rect: {x, y, w, h}` (int px, **relative to each cell**) | Crop **every** frame cell to `rect` and repack them in the same rows × columns. The new frame size is `rect.w × rect.h` ("Crop to one tile wide" = `x: (frame.w − tile)/2, w: tile`). The derived asset's stored `frame` must equal it; otherwise that's a warning. `nativeFrame` stays derived. No per-frame copies are stored. |
| `slice` | none: the cell size is this asset's own `tile {w,h}` | Cut into cells, row-major (auto-slice) |
| `dedupe` | `removedCount: int ≥ 0` | Drop cells that are exact pixel copies of an earlier cell, and pack the unique ones row-major into the sheet. **Exact pixel matches only, with no tolerance: decided by the CEO (r7, art answer 5).** RGBA is compared byte for byte after the earlier ops. There's no tolerance field, and none will be read. |

Rules:
- **`assetId` is always the original upload** (`role: "source"`), never another derived asset, so "re-fix" always replays from the original and there are no chains.
- **Order is meaningful:** the ops are applied in array order. Valid sequences: any of `crop`/`pad`/`scale`/`colourKey`, plus at most one `cropFrames` among them (sprites only), optionally followed by `slice`, then optionally `dedupe` (only right after `slice`). `cropFrames` and `slice` never appear together.
- **Re-fix** (`refixAsset`) edits the ops, replays them from the source, writes the result as a new content-addressed asset, and rewrites every reference (layers, sprites, backgrounds, `pages[]`, notes anchors excluded) in **one** op per document. The old derived asset becomes unused (info).
- **Replay check:** on Re-fix and in the export audit only (never on load), the reader compares the decoded-pixel hash of the replay with this asset's decoded pixels. A mismatch (e.g. a decoder change) is **info**, "this fix can't be replayed exactly". Byte hashes aren't compared, because PNG encoders differ.
- `page` assets don't carry `derivedFrom`; they are pixel copies, derived from the parent's `pages[]`.

**`role: "source"`** marks the original of a derived asset (ruling 1). From r7 it also marks the procedural original of a baked asset (§6.2.3):
- It is kept in the project, and shown under the derived asset ("Original"), not in the main list.
- **It is never in the export closure.** The closure is built by reference (§7.2), and nothing references a source except `derivedFrom`. "Use the original instead" in the editor clears `role` and re-points the reference. A file that references a `role:"source"` asset anyway gives a warning ("uses the unfixed original"), and the asset **is** exported, because the game must run (C4). The role is editor intent, never a reason to break a build.
- It is excluded from the "unused asset" info.
- **Share keeps sources by default** (§11.2), because a shared project is for editing and the original is what makes re-cropping possible. `shareProject(…, {stripSources: true})` removes them; the receiver then sees info "original not included; Re-fix unavailable" on the derived assets. A dangling `derivedFrom.assetId` is never H3, because the game doesn't need it.

**Derived, not stored** (reader `assetDerived(meta, store)`; rulings 2–3):

| Fact | Formula |
|---|---|
| `nativeScale` | The product of every `scale.k` in `derivedFrom.ops`; 1 when there's none. |
| `nativeTile {w, h}` (tilesets) | `tile / nativeScale`, e.g. a 64 px tile with `scale k:4` was drawn at 16 px. Shown as "16 px drawn at ×4". |
| `nativeFrame {w, h}` (sprites) | `frame / nativeScale` |
| `cells` (auto-slice) | `(W′ / tile.w) × (H′ / tile.h)`, where W′ × H′ is the source size after the ops before `slice` |
| `uniqueTiles` | `cells − removedCount` |
| `paddingCells` | `grid.columns × grid.rows − uniqueTiles`: blank cells that fill the last row of the sheet |
| `decodedBytes` | `w × h × 4` |

`removedCount` is the only stored count. It can't be derived from the sheet alone, because padding cells look like blank tiles.

Auto-slice example (the art-upload §3.5 numbers: a 640 × 480 painting on 32 px tiles gives 300 cells, 9 unique tiles and 291 repeats). Illustrative hashes:
```json
{
  "asset_4b6d8f0a2c4e6a8c": { "name": "castle.png", "kind": "image", "ext": "png", "origin": { "kind": "upload", "fileName": "castle.png" }, "role": "source" },
  "asset_5c7e9a1b3d5f7b9d": { "name": "Castle tiles", "kind": "tileset", "ext": "png", "origin": { "kind": "upload", "fileName": "castle.png" },
    "tile": { "w": 32, "h": 32 }, "grid": { "columns": 8, "rows": 2 },
    "derivedFrom": { "assetId": "asset_4b6d8f0a2c4e6a8c", "ops": [ { "op": "slice" }, { "op": "dedupe", "removedCount": 291 } ] } }
}
```
Derived: `cells` = 20 × 15 = 300, `uniqueTiles` = 9, `paddingCells` = 16 − 9 = 7, `nativeScale` = 1. The map that "Make tiles + map" writes is an ordinary map v4 whose ground layer reproduces the picture. The map doesn't link back; the tileset's `derivedFrom` is the link.


#### 6.2.2 Procedural assets: `origin.kind = "procedural"` (r7; ARCH v0.5 §13, proposal PL1–PL9, PL12)
A procedural asset is a tileset or sprite **painted from parameters** by `@te/paint-proc`. It has no file in the store.

```ts
origin: { kind: "procedural"; params: ProcParams }   // the single source of truth for its pixels
ProcParams = { painter: int, size: {w, h}, paintStyle?: {id, version: int}, terrains?: Terrain[], token?: Token }   // exactly one of terrains / token (r8: props are tokens); paintStyle: terrains only, required from v6 (r10, §6.2.5)
Terrain = { recipe, version: int, seed: uint32, palette?: {base, accent, shade?} | name,
            pattern?: {kind: "flat" | "noise" | "stripes" | "brick" | "waves" | "checker", scale?: 1–4, variation?: 0–100},
            edges?: {style, mask: 4 | 8, width, priority}, variants?: 1–8, anim?: null | {kind, frames: 2–8, ms} }
Token   = { recipe: "token", version: int, shape: "circle" | "square" | "triangle" | "diamond" | "hex",
            glyph: null | {type: "letter", value: string(1–2)} | {type: "icon", value: iconId},
            fill?: "#rrggbb", outline: {colour, width} | null, font: "pixel" | {family, weight}, shadow, seed, anim }
```
Field meanings and recipe defaults are the Architect's (proposal §2, ARCH §13.2–13.4). This file fixes only how they are stored and checked.

**Sprite recipes (r18, ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1)).**
- **`ProcParams` holds exactly one of `terrains` / `token` / `sprite`.** `sprite: {recipe: "sprite_<ULID>", hash: <64 hex sha256(JCS(paint form))>, variant?: string}`. `size` is **not stored** for `sprite` (it comes from the recipe). `paintScale` is allowed on `sprite`. `paintStyle` is reserved on `sprite` (as on tokens). An unknown arm is H4 reach.
- **Identity:** the asset id stays `asset_<16 hex sha256(JCS(params))>`; a committed recipe edit re-ids every asset that points at that recipe in one op per document, sharing one `group`. The recipe document itself keeps a stable `sprite_<ULID>` id with `rev` (rulings §3).
- **Paint form** (the hashed form = the live-ship form): the recipe minus `history`, `name`, `rev`, `createdAt`, `updatedAt`, `copiedFrom`, every part's `locked` and `promotedFrom`, and `code.src` (keep `code.out` + `outHash`) (rulings §2). Stored fields are int, string or bool only (`floatParam` warns, kept, floored).
- **Team rule:** the token rule below also covers **sprite recipe slots with `team: true`**: resolved per stage at draw time, never stored (rulings §7).
- **Joint tags and clip sync (r35, CN-014; ACCEPTED pending EA):** `skeleton.joints[].tag?: "hand" | "tip"` (absent = untagged; part of the hashed paint form, so only a recipe a maker edits changes id). The bake writes each tagged joint's per-frame position into the baked asset's `clips[].points.hand` / `.tip` (whole art px); a live procedural sprite derives the same points at paint time, never stored. Recipe anims may carry `anims[].events` with the `clips[].events` shape and rules (§6.2), and the bake copies them into the baked clips. On a procedural sprite asset, a stored AssetMeta `clips[].events` / `points` is ignored with `styleParamIgnored` and kept (R4), the same as `motion`. Two joints with the same tag warn **`jointTagDuplicate`** once per recipe; the first in `joints[]` order wins.
- **Pack copies:** a recipe item copied from an asset pack keeps the pack link in `origin.procedural.from?` (§6.2.4, r17).

**Editor & UX "code tile" and "shape token" recipes (art-upload r2 §6 gaps 2–3) are these params, not a new origin kind (r8).** `origin.kind: "code"` is **rejected**: it would be a second spelling of `procedural`.

| UX recipe field | Stored as | Notes |
|---|---|---|
| tiles[] | `terrains[]` | one entry per code tile; declared order = sheet order (sheet layout v1) |
| `terrain` (Grass, Water, Stone floor, Sand, Dirt, Wood floor, Snow, Lava) | `recipe` + `version` | recipe ids `grass`, `water`, `stone`, `sand`, `dirt`, `wood`, `snow`, `lava`. **r12:** under a BTF style the UX picks a **slot** (labelled by the style's `labels`), and the style's `recipes` fills `recipe` + `version`. See "Look recipes" below for the r12 recipe list. |
| `base`, `accent` | `palette {base, accent}` | `shade` is optional (the recipe derives it when absent) |
| `pattern` noise / stripes / bricks / waves | `pattern.kind` `noise` / `stripes` / `brick` / `waves` | stored values are singular ids; the UI label can say "Bricks" |
| `scale` 1–4 ("Pattern size") | `pattern.scale` (int) | |
| `variation` 0–100 % | `pattern.variation` (int percent) | integers keep params float-free (JCS rule below) |
| `seed` ("New mix") | `seed` (uint32) | |
| `logic` ("Units treat it as") | **not in params**: `tileTypeOverrides[recipe]` on AssetMeta, only when it differs from the recipe's `defaultTileType` | **logic stays derived (PL9).** The value must be a `terrain.tile_types` id (built-in or user). Water and lava defaults need **L27**. Two tiles with the same recipe and different meanings are two assets. |
| shape | `token.shape` | `triangle` added (r8); `hex` stays for the Architect's recipe |
| glyph `{type: letter | icon | none, value}` | `token.glyph` (`null` = none) | replaces r7's `initial`. A letter is 1–2 chars. Icons: `sword`, `shield`, `bow`, `star`, `heart`, `skull` (the Architect's icon set) |
| `propColour?` | `token.fill?` | **optional, with no fallback copy stored.** Absent → a unit's **team colour resolved per stage at runtime** from `unit-roster.team_colour` (`null` → `ability-presentation.team_colours` for the army's side, L30). A token placed with no side, or a prop, draws in the engine's fixed neutral (an engine constant, never written). |

- **Team colour is never stored on the asset.** One token serves both sides. Its fill is resolved when it is drawn (Preview: live). Render in bake mode bakes **one sheet per distinct resolved fill** that the closure needs, so the colour comes from the stage, not the asset.
- **Glyphs:** `font: "pixel"` (bundled, deterministic) is the default. A system-font letter (`font: {family}`) is **always baked**, at Render or on Bake (§7.4).
- **"Bake to image"** on a token with no `fill` is unavailable (info: "team-coloured tokens stay generated"). Baking would freeze one side's colour into a file. Tokens with a fixed `fill` (props) bake normally.

**PARKED (CEO 2026-11-09: style experiments parked; kept for reference, not active).** Nothing in this block is offered or registered beyond what the two locked default styles use.

**Look recipes (r12, ARCH v0.6 §13.2).** `Terrain.recipe` / `version` hold the **look recipe**, which pins the pixels. The style body's `recipes` says which look recipe fills which **slot** (`grass`, `dirt`, `water`, `stone`); the slot gives the painter's behaviour (liquid edge, curb, overhang).
- **New at version 2** (the v0.5 generic recipes keep @1 under `te-classic@1`): `water@2`. **r13: `grass@2` and `sand@2` are retired** (never published, frozen, never reused; Engine Architect ruling C). The locked painters are `grass@3` / `sand@3` (§6.2.5 table).
- **The 16 new @1 recipes:** `dirt@1`, `cobble@1`, `lane@1`, `cracked@1`, `sandstone@1`, `snow@1`, `trail@1`, `ice@1`, `frost@1`, `basalt@1`, `moss@1`, `ash@1`, `crust@1`, `marsh@1`, `mud@1`, `murk@1`.
- ~~`lava@2`~~ **r13: retired** (ruling C; frozen, never reused). The prototype's lava is **`lava@3`** (reserved, parked with `btf-lava@1`), because `lava@1` is the frozen v0.5 generic recipe in `te-classic@1`. Nothing stored changes.
  - **General rule: frozen ids are never reused.** A released `(id, version)`, whether a recipe, a paint style or a painter, is never given to a different implementation. A clash always takes the **next version** of that id.
- `wood` stays a generic recipe still to be written, outside the BTF styles. There's no `wall` recipe in the styles (walls are edges).
- **Default tile types for the new recipes (r13: CONFIRMED.** L27 shipped in rev 9, and the Engine Architect confirmed `water`/`lava`/`wall-block` on 2026-11-09, gaps §19.) They seed `map.logic.terrain` only when painting; `tileTypeOverrides` still wins:
  - `floor`: `grass@3`, `sand@3`, `dirt@1`, `cobble@1`, `lane@1`, `lane@2`, `cracked@1`, `sandstone@1`, `snow@1`, `trail@1`, **`ice@1`**, `frost@1`, `basalt@1`, `moss@1`, `ash@1`, `crust@1`, `marsh@1`, `mud@1`.
  - `water`: `water@2`, `water@3`, `murk@1`.
  - **`ice@1` → `floor`** (owner ruling, r13). It's a look, not a rule. Slipperiness would be a future rule or behaviour, never this default. It's PARKED with the experiments, and the user can retype it (`tileTypeOverrides`).
  - `lava`: `lava@3` (parked).
  - A recipe whose type isn't in the effective `tile_types` (a stage override that removed it) falls back to `floor`, with the existing warning.
- **Under a style:** a terrain's `palette`, `pattern`, `edges`, `variants` and `anim` params are **ignored, with a warning** (`paletteIgnored` / `styleParamIgnored`), and kept (R4). The style owns them. Only `recipe`, `version` and `seed` are read.

**Identity (PL2; Engine Architect r8).** `id = asset_<first 16 hex of sha256(JCS(origin.params))>`, where JCS is **RFC 8785** canonical JSON, encoded **UTF-8**, and the SHA-256 is over those bytes.
- **Params should be integers or strings.** A non-integer number anywhere in `params` is a **`floatParam` warning**, never blocking. It still hashes through JCS's number formatting, but it may not paint identically on every device. Percentages and scales are stored as integers (`variation: 18`, not `0.18`). It is the same id shape, so no reference changes form. JCS is required rather than "sorted keys, no whitespace", because number formatting has to be pinned too (`0.18` vs `1.8e-1`).
- Committing a param edit (on slider release, not per drag frame) gives a new id. The writer rewrites references in one op per document, like Re-fix.
- If a stored id ≠ the hash of the stored params (the file was hand-edited), that's **info**: it still paints. "Fix id" re-ids it as one op. It is never H4, because nothing is missing.

**What is stored, what is derived (PL4, PL5, PL9; one source of truth):**

| Field | Uploads and builtin copies | Procedural |
|---|---|---|
| `ext` | stored (the file's format) | **not stored**. A bake is always `png`. A stored `ext` is ignored, with info. |
| sha256 / bytes / mime | computed from the file | sha256 = the params hash; `bytes` and `mime` are `null` in the index |
| `w`, `h` | computed from the file | derived: the **used-cell** sheet size (r12) from `size` and the derived grid; `null` with no used cells |
| `tile`, `grid`, `clips`, `frame`, `anchor` | stored (§6.2) | **derived from params**, never stored. Present anyway → a warning, and ignored. |
| `tileProps.anim` | stored | derived (one clip per animated terrain) |
| `motion` (r32) | stored | lives in the hashed params, like `anim`. A stored AssetMeta or `tileProps` `motion` is ignored with `styleParamIgnored` and kept (R4) |
| `tileProps.logic` | stored | derived from the recipe's `defaultTileType`, overridden per recipe by **`tileTypeOverrides?: Record<recipeId, tileTypeId>`** on AssetMeta (outside `params`, so changing a painter default doesn't change the id or the pixels) |
| `nativeScale` | derived from `derivedFrom` | **`paintScale`** (r12; absent = 1). The painter draws at `size` (paint px) and the engine replicates pixels ×`paintScale`. |
| `filter` | stored | stored. `smooth` is **inactive unless `advancedRender`** (art lock) and reads as `nearest`. |

- **Sheet layout v1 (Engine Architect, r8; was an assumption in r7; r12: macro texture, mask sets, used cells).** This is how `grid`, `w`/`h` and cell indices are derived, and how a bake is laid out:
  - **Cells** are exactly `size` (**paint px**, the tile or frame size before `paintScale`), with no padding or extrude. Origin top-left, filled **row-major**.
  - **Cell order (Engine Architect r9, frame innermost):** **terrain** (`terrains[]` in declared order) → **variant** → **mask** → **frame**.
    - **Variant (r12, ARCH v0.6 §13.3).** Under a style with `macro.size` m > 1 (BTF styles: 4), the variant slot carries the seamless **m × m texture**'s quadrants, row-major: **`variants_t = m²` (16)**. With m = 1 (`te-classic@1`), it's `params.variants` (1–8), as before.
      - **Position-locked:** the brush writes `variant = (r mod 4) × 4 + (c mod 4)` (m = 4; in general `(r mod m) × m + (c mod m)`), counted from map cell (0, 0) (`macro.origin: "map"`). It's never random.
      - **"Re-tile layer"** recomputes every variant (and mask) from position and neighbours, as one op.
      - A stored variant that differs from its position quadrant is drawn as stored (no logic effect), with info "seam: re-tile".
    - **Mask: `maskSet: "4bit" | "blob47" | "recipe"`** (r12), **derived per terrain, never stored** (a stored copy could disagree with the recipe that defines it):
      - `4bit`: **0..15**; `blob47`: the **47-mask blob set in ascending mask value**. These are the generic recipes, from `edges.mask` 4 / 8; no autotile is one mask.
      - `recipe`: **the recipe lists its own masks**, the composite codes of ARCH v0.6 §13.3 in ascending order. `masks_t` is the recipe's declared count, fixed by `recipe@version`. Every BTF recipe uses this.
    - **Overlays (r12):** a cell has **at most one overlaying terrain: the highest `priority`** (style `body.priority`) among its neighbours. **Equal priority ties break by slot order `grass`, `dirt`, `water`, `stone`** (the earlier slot wins). `stone` never overlays (it gets its curb instead).
    - **The frame count is per terrain** (Engine Architect correction, r9): `n = Σ over terrains t of (variants_t × masks_t × frames_t)`.
      - Under a style, **the `water` slot takes the style's `anim.frames`** (`anim: null` → 1) and **every other slot has 1 frame**.
      - With `te-classic`, `frames_t` is the terrain's own `anim.frames`, or 1.
      - A terrain's block starts right after the previous terrain's block. There's no padding to a sheet-wide frame count, and static terrains aren't repeated.
    - **Animated terrains have no separate still.** **Frame 0 is the still**: it's drawn when animation is off and used for thumbnails.
  - **Index space vs. stored sheet (r12).** Map layers store the **theoretical** layout-v1 index of a cell's frame 0 (`offset_t + (variant × masks_t + maskOrdinal) × frames_t`). That index space is **never materialised**.
    - **The sheet that is painted, baked and measured holds only the cells actually used**, each with all its frames, packed in index order. **Its cell count is the used count**: `n_used = Σ over used (t, variant, mask) of frames_t`.
    - The derived `grid`, `w`/`h` and `decodedBytes` are of that used-cell sheet. With no used cells, `w`/`h` are `null` and `decodedBytes` is 0.
    - Used = referenced by any map layer in the project (for the index and Bake to image), or on selected stages (for Render).
    - `index.assets[].cells {used, theoretical}` shows both. `theoretical` is `null` when the mask set is `recipe` (the count lives in `@te/paint-proc`).
  - **Tokens:** frames in order.
  - **Columns** `cols = min(ceil(sqrt(n)), floor(4096 / tileW))` for `n` cells (n = `n_used` for procedural sheets). Rows grow until the sheet would pass **4096 px** high or **16,777,216 px²**; then a **new page** starts, using the auto-slice page rule (§6.2 `pages[]`, `page` assets, each laid out the same way).
  - **Fractional zoom** would need a **layout v2** with a 1 px extrude. v1 has none, which matches the art lock.
  - **Bakes store `sheetLayout: 1`** on the baked AssetMeta (beside `bakedFrom`). A procedural asset's layout comes from its `painter` version, so it's not stored. An unknown `sheetLayout` on a baked asset is a **warning**: the stored `grid` is still used, because a bake's geometry is stored.
- **Caches** (editor disk cache, memory LRU) are keyed by `(recipe, version, params hash, size)`. They are outside the project, safe to delete, and never authoritative.

**Paint scale (r12, ARCH v0.6 §13.12): paint small, show at a whole multiple.**
- **`params.paintScale`**: an integer ≥ 1, default **1**. It's **inside the hashed params** (it changes the look, so it changes the id).
  - Canonical form: writers **omit it when it's 1**, so every pre-r12 id is unchanged. A stored `paintScale: 1` is info, and "Fix id" strips it.
  - A non-integer, or a value < 1, is a warning: it reads as 1, the stored value is kept, and it's a `floatParam` if fractional.
  - Procedural **terrain** sheets only in v1. On a token it's ignored, with info.
- **`nativeScale = paintScale`** (it was always 1), so the asset row reads "32 px drawn at ×2", like scaled uploads.
- **The tile-size warning compares `paintSize × paintScale`** (the painted `size` × `paintScale`) **with the map tile.** Example: map tile 64, `size {32, 32}`, `paintScale: 2` → no warning.
  - Under a style, `size` should equal the body's `paintSize` (16 | 32 | 64 only). Anything else is a warning, `paintSizeOffStyle`.
  - The editor offers only `paintScale` values that divide the map tile.
- **The bake and the sheet stay at paint px.** Sheet layout v1 cells are `size`. A bake of a ×2 asset is a paint-px PNG that stores **`paintScale`** on its AssetMeta, beside `sheetLayout` (stored, because a bake's geometry is stored). Its `nativeScale` is that value.
- **Enlargement is an integer pixel copy, never `drawImage`.** Each paint pixel is replicated `paintScale × paintScale` in `@te/paint-proc`'s own buffer when the cell is written into a chunk (like the prototype's `scaleNearest`), then `putImageData`. Camera zoom multiplies on top through the integer path: screen px = `size × paintScale × zoom`.
- The macro texture side `P = size × macro.size` is in paint px and isn't affected by `paintScale`.
- **Wizard pairs** (editor constant `PAINT_PAIRS`, §16; the only source the wizard reads for "Paint with code"):

| Map tile | Paint size × `paintScale` | Note |
|---|---|---|
| 64 (mobile and both default) | 32 × 2 | the style brief's look |
| 96 | 32 × 3 | |
| 48 (PC default) | 16 × 3 | coarser; 48 × 1 isn't an allowed paint size |
| 32 | 32 × 1 | |
| 16 | 16 × 1 | |

**Art lock.** Painted pixels are drawn at exactly `size` × `paintScale` (an integer pixel copy, r12), through the integer path. `size × paintScale` ≠ the map tile is the ordinary tile-mismatch warning: drawn at native size and clipped, never scaled (§6.2 `tile`). Only `advancedRender` can enable smoothing (`filter`) or non-integer zoom, exactly as for uploads. A bake (§6.2.3) writes a 1× PNG and never resamples.

**Checks (C4):**

| Case | Level |
|---|---|
| `painter` newer than the engine, or `recipe` not registered, or recipe `version` unknown | **H4** (the art can't be produced; §13) |
| `paintStyle` version not embedded (r10, §6.2.5) | Editor: re-embed the installed same version (notice). Otherwise draw the stored bake (warning `styleMissingUsedBake`). Otherwise **H4**. |
| `paintStyle` on token params (reserved, r11) | Info `tokenStyleReserved`; ignored when painting, kept, and hashed |
| Embedded style `sha256` ≠ installed same version; terrain `palette` under a locked style; recipe not listed by the style; terrain sheet without `paintStyle` (v6) | Warning (`styleVersionMismatch`, `paletteIgnored`, `styleRecipeMismatch`, ignored; read as `te-classic@1`) |
| `seed` not a uint32; a palette colour unparseable | H2 |
| A `pattern` / `variants` / `anim` / `edges` number out of range | Warning. The stored value is kept, and the painter clamps when painting (R4: nothing stored is clamped). |
| `size × paintScale` ≠ the map tile (r12) | Warning (as uploads) |
| `paintScale` not an integer ≥ 1; `size` ≠ the style's `paintSize`; a param the style owns (`palette`, `pattern`, `edges`, `variants`, `anim`); a stored variant off its position quadrant | Warning (reads as 1; `paintSizeOffStyle`; `styleParamIgnored`); info "seam: re-tile" |
| A non-integer number in `params` | Warning `floatParam` (r8) |
| `tileTypeOverrides` value not in the effective `tile_types` | Warning; that tile runs as `floor` (as §6.4 palette) |
| `glyph.value` longer than 2 (letter) or not in the icon set | Warning; drawn without the glyph |
| `font: {family}` missing on this machine | Info: falls back to `system-ui`, then the pixel font (ARCH §13.5) |
| Stored geometry on a procedural asset; stored `ext`; id ≠ params hash | Info / warning as above |

#### 6.2.3 Bake to image, and originals (PL8, PL12)
`bakeAsset(assetId)` writes a **new upload** asset from the painted sheet at 1× (paint px), rewrites references (one op per document), and keeps the procedural asset as its original:
- **r12: only the used cells are baked** (§6.2.2 index space), all frames, packed in index order. The map layers' theoretical indices are **remapped** to the baked cells in the same ops. **`bakedFrom.cellMap: int[]`** stores the theoretical frame-0 index of each baked cell, in order. That's the one fact a bake can't derive, and "Back to generated" uses it to map indices back exactly.
- A baked sheet can't paint combinations it doesn't hold. Painting a new combination on a baked layer gives info: "baked: N cells; Back to generated to paint more".
- The baked asset: `origin: {kind: "upload", fileName: "<name> (baked).png", bakedFrom: {assetId, painter, paintStyle?: {id, version}, recipes: [{id, version}], cellMap?: int[], at}}`, **`sheetLayout: 1`**, **`paintScale?`** (r12, stored; `nativeScale`) (r8; `paintStyle` provenance r10, like `painter`, so it survives `stripSources`), with geometry **stored**, because it's an ordinary image now (`tile`, `grid`, `clips`, `tileProps`).
- **Modified from the proposal:** `bakedFrom` does **not** copy `params`. They live once, on the procedural original, which `bakedFrom.assetId` names. The proposal's copy would be a second, drifting copy of the params.
- **The procedural original gets `role: "source"`**, the same rule as upload originals (§6.2.1): hidden under the baked asset ("Generated original"), never in the closure, **kept on share**, and removed by `stripSources`. After stripping, "Back to generated" is unavailable (info), exactly like Re-fix.
- `bakedFrom` is provenance only. It is never replayed automatically, and it isn't `derivedFrom` (whose `assetId` is always an upload original).
- "Back to generated" is one op: it re-points references to the original, maps indices back through `cellMap` (r12), and clears its `role`.

#### 6.2.4 Built-in library copies and "Update from library" (PL1, PL10, PL11; ARCH §14)
```ts
origin: { kind: "builtin"; libraryId: string; assetKey: string; rev: int; src?: string }   // src: legacy BTF provenance only (C9)
// r17 (EA signed off 2026-11-12 with conditions; pack-format.md §4.2): procedural arm gains  from?: { libraryId: string; assetKey: string; rev: int }  (outside params, not hashed)
```
- **r17 asset packs ([pack-format.md](pack-format.md) ACCEPTED r2 §4; `from` EA signed off 2026-11-12 with conditions):** a copy from an installed asset pack (hub or library) is this same library copy, with `libraryId` = the pack's `packId` and `rev` = the pack rev; recipe items carry the same triple in `origin.procedural.from`. "Update from library" works on both. `builtinNotCC0` fires only for the v1 built-in library, never for a hub pack. The project never needs the pack, the hub or an entitlement to load, render or export (P4).
- **Copy on first use (P4):** the bytes go into `assets/` and the id is the content hash. Geometry comes from the library manifest and is then **owned by the project copy**, which the user may edit. A 16 px original scaled ×k is the r5 pair: a `role:"source"` original plus a derived asset with `derivedFrom {ops: [{op:"scale", k}]}`, both with the same `builtin` origin.
- **`credit {author?, license?, url?, title?, note?}`** (optional, any asset; r13 adds **`status?: "provisional"`** (absent = final), **`source?: string`** and **`aiGenerated?: boolean`** (default `false`), see below; all optional, no migration). **`license` is the licence field** (an SPDX id such as `CC0-1.0`, or `"own"` for the user's or BTF's own art). It is **expected on builtin copies**: if it's missing, that's a warning (r8, art-upload r2 gap 4). **v1 library = Kenney CC0 only (§14.6e):** v1 copies carry `author: "Kenney"`, `license: "CC0-1.0"`. **r14 (ARCHITECTURE v0.6.1 §14.2): the v1 *built-in* library stays Kenney-only.** Studio-own art (`license: "LicenseRef-TileEngine-Own"`, below) is **project content (or a later library revision), never the built-in library**. A copy from the v1 built-in library whose `license` isn't `CC0-1.0` gets a **`builtinNotCC0` warning**, never a block. Studio-own copies don't come from the built-in library, so they never trigger it; the hard reject is the Architect's `LICENSES.json` CI. The field stays general, so later packs need no migration. It is filled from `LICENSES.json` on copy, and typed by the user for uploads. **Render reads only `credit`** (principle 1: Render reads only the store). It never looks things up in the installed library, so a shared project builds the same credits anywhere. **Modified from the proposal**, which had Render prefer the library lookup: that would make two sources and break self-containment.
- **Provisional credits (r13, Engine Architect; general mechanism).** `credit.status: "provisional"` marks a credit that isn't final yet. Editor and Preview give the **warning `creditProvisional`**.
  - **CI rule (ARCHITECTURE v0.6.1 §14.2):** `provisional` **fails library builds and release exports**, and **only warns in dev builds** (Preview and non-release builds).
  - Removing `status` makes the credit final; there's no migration.
  - **No current entry is provisional:** the BTF props and sprites were made final by the CEO ruling below.
- **Studio-own art (r13; CEO 2026-11-09 via the CoS; split 22:1x after the CoS verified the sources).** There are two cases, both with license **`LicenseRef-TileEngine-Own`** (a valid SPDX LicenseRef, **not** CC0, and distinct from `"own"`, which stays the value for a user's own uploads):

| Case | `author` | `source` | `aiGenerated` | Disclosure |
|---|---|---|---|---|
| **`painter-proto` output**: the locked tiles/paint styles, characters, markers, buildings and Atmosphere. All code-drawn, no image files loaded; `refs/` crops are comparison-only. | `"RaiKynn"` | **`"own, procedural"`** | **`false`** | **None** |
| **BTF game image art**: the prop and sprite **PNGs** from the BTF game source and assets. Made with Grok Imagine. | `"RaiKynn"` | **`"own, AI-generated (Grok Imagine)"`** | **`true`** | Badge + credits note (required) |

  - Both are final (no `status`). **r14: they're project content (or a later library revision), NOT the v1 built-in library** (which stays Kenney-only, ARCHITECTURE v0.6.1 §14.2). **They can be pulled later** (CEO): removing them is a library change only. Project copies keep their bytes and credit (P4), and nothing migrates.
  - A procedural asset painted under a studio-own style (`btf-*`) is credited like `painter-proto` output (own, procedural, not AI). `te-classic` and other generated output keeps "Generated by TileEngine", CC0-1.0 (PL10).
  - **Licence CI: [ARCHITECTURE v0.6.1 §14.2](../docs/ARCHITECTURE-v0.md) is the rule.** This doc mirrors it, and §14.2 wins on any difference:
    - **Allowed licences:** `CC0-1.0` and `LicenseRef-TileEngine-Own`, nothing else.
    - `LicenseRef-TileEngine-Own` is accepted **only** with `author: "RaiKynn"` and the **required** fields `aiGenerated` (boolean) and `source`.
    - **There are exactly two `source` strings, each tied to its `aiGenerated` value:** `"own, procedural"` ↔ `false`, and `"own, AI-generated (Grok Imagine)"` ↔ `true`. Any other pairing fails.
    - `status: "provisional"` fails library builds and **studio** release exports, and only warns in dev builds and end-user projects.
    - The check runs on `LICENSES.json` **and on the export closure's `credits/licenses.json`** (§7.4).
    - The v1 built-in library stays Kenney-only (CC0-1.0).
    - **`LicenseRef-TileEngine-UserOwn`** (23:0x, Engine Architect; [sync-format.md](sync-format.md) r3 §6.1) is an end user's own work, with the uploader's account handle as `author`. It's **accepted in end-user projects** (no `licenseUnlisted`; warn-only checks as before). **The built-in library CI always rejects it**, and in a studio release export it's `licenseUnlisted` (FAIL) until §14.2 lists it. **`…-Own` and `…-UserOwn` are never rewritten into each other**, on import or anywhere else.
    - **Scope (r14, Engine Architect ruling; [ARCH §14.2](../docs/ARCHITECTURE-v0.md)):** the **strict FAIL** applies **only** to the **built-in library** and to **studio release exports**, which means projects with **`settings.studioProject: true`** (§3.1).
    - **End-user projects** (`studioProject` absent or `false`) run the **same checks as warnings**: `ownCreditIncomplete`, plus **`licenseUnlisted`** for a licence that isn't `CC0-1.0` / `LicenseRef-TileEngine-Own` / `LicenseRef-TileEngine-UserOwn`. **Any licence string is accepted**, including bare `"own"`. **Credits are still generated** (§7.4), and nothing blocks Play, Render or export.
    - When `aiGenerated` is `true`, the editor badge and the credits note are **required**.
    - The format mirrors this as a warning, **`ownCreditIncomplete`**, on a copy with that licence missing one of the three fields. The hard reject stays in CI.

```json
{
 "painter-proto output (baked prop bld:cottage:day)": {"author": "RaiKynn", "license": "LicenseRef-TileEngine-Own", "source": "own, procedural", "aiGenerated": false},
 "BTF game image art (sprite PNG)": {"author": "RaiKynn", "license": "LicenseRef-TileEngine-Own", "source": "own, AI-generated (Grok Imagine)", "aiGenerated": true}
}
```
- **Provenance from the Imagine → pixel converter and the hub (r15, PROPOSED; [sync-format.md](sync-format.md) r5 §6.5.5–6.5.6).**
  - The Imagine converter (`ux/pixel-editor-plan.md`, SE-14) writes, on Keep, the **existing** `credit.source: "own, AI-generated (Grok Imagine)"` and `credit.aiGenerated: true`, on the result and on its kept `role: "source"` original. Downscaling removes Grok's visible watermark, so this credit is the record. It's prefilled and user-editable. **No new field**, and the converter doesn't set `license`.
  - A hub download keeps its `credit`, with `url` = the hub page and `author` = the uploader's handle. Hub verification, badges, fingerprints and claims **never** enter a project.
  - **r15 in place (DECIDED CEO 2026-11-12, sync-format r6 §6.5.6):** on the hub, `credit.aiGenerated: true` also gives the listing an **"AI-generated" label** (derived, the same fact as the editor badge), and such assets **may be sold**.
  - **r15 in place (H8, sync-format r6 §6.5.4):** if a hub asset a project uses is later taken down, the editor shows **`hubAssetWithdrawn`** with "Replace it", matched by `sha256` on sync. The project copy is **never removed or changed**, and Play, Render, export and shipped games keep working offline.
  - **Metadata is informational, never trust:** `credit` can be edited, stripped or forged. Local import stays **fully open and offline**, with no provenance check and no new warning (CEO DECIDED, 2026-11-12, D4).
- **AI disclosure (r13, info, never a warning).**
  - The editor shows an "AI-generated" badge on any asset with `credit.aiGenerated: true`, and the size/credits panel lists them. **`aiGenerated: false` or absent shows no disclosure at all**, so `painter-proto` output never carries the badge or the note.
  - **Render's credits** (`project.render.credits`, §7.4) list each closure asset with an **"AI-generated"** note, and `licenses.json` carries `aiGenerated: true`. So a Steam-style AI disclosure can be generated from data alone.
  - Absent `aiGenerated` means `false`.
- **The presets model, mirrored:**

| Presets (setup-format §6) | Library assets |
|---|---|
| Copied on apply | Copied on first use |
| Embedded copy wins on load | **The project copy always wins.** The library is never read on load or by Render. |
| `presetRef.presetRev` < the library rev → "changed" hint | `origin.builtin.rev` < the installed library rev for that `assetKey` → a **notice** ("Library has a newer Tiny Town tile, rev 4; you have rev 2"), never a warning |
| `diffPreset` → `updateFromPreset`, ticked rows only, one undo step | `diffLibraryAsset` → `updateFromLibrary(assetId, fields)`: rows for **bytes**, each geometry field and `credit`. Each row is `same` / `differs` / `userEdited` (the project copy differs from the library entry at its own `rev`). `userEdited` rows are **unticked by default**. |

- **Additive, never wipes:** new bytes become a **new** asset id. When it's a derived pair, the new source is re-derived by replaying the same `derivedFrom.ops`. References are rewritten in one op per document. The old copy stays in the project (unused, info) until the user deletes it. User-edited geometry, clip names, `tileTypeOverrides` and `credit` are kept unless their row is ticked.
- If the library at `origin.rev` is no longer installed, every differing field counts as `userEdited` (safe default).
- **BTF `src` → library keys:** no automatic migration. An editor action, "Link to library", becomes available per asset only after the CEO confirms that BTF group (ARCH §14.1). Until then, `src` stays as legacy provenance.

#### 6.2.5 Paint styles: pinned, immutable versions (r10; CEO via CoS and Engine Architect, ARCH v0.6 §13)
The painter prototype (`painter-proto/`, `docs/painter-style-brief.md`) becomes the default **"Paint with code"**. **`btf-ashroad`** (day) and **`btf-moonlit`** (night) ship as the first built-in styles. ~~more will follow~~ **More styles are PARKED** (CEO, 2026-11-09).

**Locked defaults (CEO decision 2026-11-09, relayed by CoS).** Painter style experiments are parked. Testing art is **Kenney CC0 (§6.2.4) plus the locked `btf-ashroad` and `btf-moonlit`**. The baseline is `painter-proto/locked/2026-11-09/` (`MANIFEST.json`, "CEO-approved 2026-11-09", locked 21:25 London time).
- **Default styles: `btf-ashroad@2` (day) and `btf-moonlit@2` (night).** The wizard and `settings.paintStyleDefault` (when absent) use `btf-ashroad@2`.
- **`@1` is superseded but still loads.** Assets pinned to `@1` keep painting from their embed, are **never wiped and never auto-upgraded**, and show the "update available" badge (→ `@2`). Moving is only the explicit Upgrade. **Frozen ids are never reused:** a changed look is always a new `@version` ("quality work goes in new @versions only", manifest).
- **Frozen look hashes (`lookHash`)** are copied from the manifest. A look hash is the **first 16 hex of SHA-256 over the RGBA bytes of `paintMap(sampleMapFor(style), 32, style)`** (default seed `0x5eed`, frame 0; `check.mjs`). It's a **pixel fingerprint for the determinism CI**, and **not** the document `sha256` (SHA-256 of `JCS(body)`). Both are kept: `sha256` detects an edited body, and `lookHash` detects a changed look. The embed may carry `lookHash` (optional, 16 hex). An installed version whose painted fingerprint ≠ its `lookHash` fails CI, never a project load.

| Style | `lookHash` | Status |
|---|---|---|
| `btf-ashroad@2` | `f7571e963501a1a9` | **Default** |
| `btf-moonlit@2` | `267165eb236b4c74` | **Default** |
| `btf-ashroad@1` | `04e805181c5a4dc4` | Superseded; still loads. **Defective, not publishable** (r13 ruling A, QA goldens): import/history only, never in a release export |
| `btf-moonlit@1` | `38367703323e2366` | Superseded; still loads. **Defective, not publishable** (r13 ruling A) |
| `btf-desert@1`, `btf-snow@1`, `btf-lava@1`, `btf-swamp@1`, `btf-forest@1` | `01ee2c22d817ab17`, `6725cce9cc9135bc`, `f6c8338d8dd1792a`, `50b9682f1ec147d6`, `103c6b665d12f786` | Frozen in the manifest but **PARKED**: not offered |

**Manifest vs. this doc: conflicts, open for the Engine Architect.** The locked baseline wins on pixels, and these are naming and shape gaps only:
1. **Recipe ids clash with `te-classic@1`.** The locked painter names its recipes `grass@1`, `water@1`, `water@2`, `sand@1` and `lava@1`, but `grass@1`, `water@1`, `sand@1` and `lava@1` are the frozen v0.5 generics in `te-classic@1`. It also conflicts with this doc's `grass@2`, `sand@2` and `lava@2` (r12, confirmed `lava@2`). By "frozen ids are never reused", the locked recipes need non-clashing registered ids. This is a rename only; it doesn't move a pixel or a `lookHash`.
2. **Body shape differs from §13.11 / the r12 table:**
   - `macro: 4` (not `{size, origin}`);
   - `dither: {amp: 0.35, bloomSteps}`, a **float** (not `{kind, amplitude: 35, accentSteps}`, int-only for JCS);
   - `animMs` (not `anim {frames, ms}`; frames come from the recipe);
   - the extra fields `raised`, `superseded` and `note`;
   - no `palette`, `light`, `liquidEdge`, `paintSize` or `preview`;
   - an envelope `v: 1` (not `formatVersion: 2`).
3. **`btf-ashroad@2` uses `grass@1`**, not `grass@2`. `btf-moonlit@2` uses `lane@2` and `water@2`.
4. **Extra recipes** `planks@1` and `forest@1` (`btf-forest@1`) aren't in the r12 list (PARKED anyway).
5. The manifest also locks **sprites, buildings and Atmosphere** (`spriteHashes`), which this format doesn't model yet (out of scope here). **Resolved by ruling (4) below.**

**Engine Architect rulings on the locked set (2026-11-09; resolves conflicts 1–5).** The folder `painter-proto/locked/2026-11-09/` is **frozen and never re-exported**. Everything happens in the **import converter**, which builds the built-in library (`packages/library/paint-styles/`). **Correctness is proven by `lookHash` matching the manifest.**
1. **Re-key on import, never reuse.**
   - The locked `grass@1`, `water@1`, `sand@1` and `lava@1` clash with `te-classic@1`'s frozen recipes, so they become **`@3`**, or the next free version of that id. `@2` is already taken for all four: `grass@2`/`sand@2` (r12, PARKED), `lava@2` (confirmed; all three **retired** in r13, ruling C) and the locked `water@2`.
   - The other locked ids (`dirt@1`, `cobble@1`, `lane@1`, `lane@2`, `water@2`, and the parked ones) don't clash and keep their ids.
   - The converter rewrites each imported body's `recipes` to the new keys and stores provenance per recipe: **`importedFrom: "locked-2026-11-09:grass@1"`**.
   - So the defaults read: `btf-ashroad@2` = `{grass: "grass@3", dirt: "dirt@1", water: "water@2", stone: "cobble@1"}`, and `btf-moonlit@2` = `{grass: "grass@3", dirt: "dirt@1", water: "water@2", stone: "lane@2"}`.
   - Re-keying is a rename only: pixels and `lookHash` don't move.
2. **Float converter.** `dither.amp` 0.35 → `dither.amplitude` **35**, only when ×100 is an exact integer; `bloomSteps` → `accentSteps`.
   - Otherwise it's a **hard import error**, with no silent rounding.
   - The same envelope and shape mapping applies to every locked style: `macro: 4` → `{size: 4, origin: "map"}`; `animMs` → `anim {frames: <the water recipe's frames>, ms}`; `v: 1` → `formatVersion: 2`. `superseded`/`note` become library metadata, and are never in `body`.
   - Then the converter **bakes the sample map and checks `lookHash`**. **A mismatch rejects the import.**
   - **This is an import-time reject outside the load-time H list, and H1–H6 are unchanged** (still six). It runs only in the library build, before anything is written: a rejected style never reaches a project, so no project load can hit it. Projects only ever see published, hash-checked styles, and their existing H4 / fallback chain is unchanged.
3. **`planks@1` and `forest@1` are out.** Checked against the locked `painter.js`: `btf-ashroad@2` uses `grass@1`, `dirt@1`, `water@2`, `cobble@1`, and `btf-moonlit@2` uses `grass@1`, `dirt@1`, `water@2`, `lane@2`. Neither references `planks@1` or `forest@1` (only the parked `btf-forest@1` does), so neither is imported.
4. **No new format in v1 for the rest of the locked set.** The converter **stores outputs, not recipes**:
   - **Props and buildings** (`obj:*`, `bld:*` in `spriteHashes`) become **baked image assets placed through `map.objects[]`** (§6.4).
   - **Sprites** (`unit:*`) become **baked unit-token assets** (`kind: "sprite"`) with **AssetMeta `clips`** (§6.2).
   - Day and night are separate assets. Each output's pixels are checked against its manifest hash before it's written, and it enters projects as **project content** (an import: `origin.kind: "upload"` with the credit filled), until a later library revision carries it. It is **not** in the v1 built-in library (r14, ARCHITECTURE v0.6.1 §14.2), with the studio-own **procedural** credit `{author: "RaiKynn", license: "LicenseRef-TileEngine-Own", source: "own, procedural", aiGenerated: false}` (**r13, CEO ruling 2026-11-09**, corrected 22:1x: code-drawn, so not AI; §6.2.4). They're **not in the v1 built-in library** (Kenney-only), and they can be pulled later.
   - Atmosphere isn't imported in v1 (no format home), and stays parked.

5. **The locked → format recipe table (r13; reworked 22:1x per the Engine Architect's rulings A–C; for the QA harness: each locked recipe has exactly one mapping).**
   - **Source:** the locked `painter.js` `RECIPE_SPECS`, which has **24 recipes**. (Earlier r13 text said 25; that was a miscount.) Its file hash `21db7c82…` matches `MANIFEST.json` `sourceFiles`.
   - The 24 split exactly into: **7 shipped** (table), **15 reserved, parked** (list below) and **2 excluded**.
   - **Default** marks a recipe that `btf-ashroad@2` or `btf-moonlit@2` references. Each of those five has exactly one row.
   - **Defective** (ruling A; QA goldens) means the entry **is not publishable**. It exists only so that the superseded `btf-ashroad@1` / `btf-moonlit@1` resolve on import and in history (undo, old pins, embeds).
     - **It never goes into a release export:** the library CI and the export audit fail it, like `credit.status: "provisional"`.
     - A project pinned to a defective style gets the warning **`styleDefective`** ("Upgrade to @2 before a release build").

| # | Locked recipe | Format id | `importedFrom` | Used by (locked styles) | v1 |
|---|---|---|---|---|---|
| 1 | `grass@1` | **`grass@3`** (re-key) | `locked-2026-11-09:grass@1` | ashroad@1, **ashroad@2**, moonlit@1, **moonlit@2** | Shipped, **default** |
| 2 | `dirt@1` | `dirt@1` (unchanged) | — | ashroad@1, **ashroad@2**, moonlit@1, **moonlit@2** | Shipped, **default** |
| 3 | `water@1` | **`water@3`** (re-key) | `locked-2026-11-09:water@1` | ashroad@1, moonlit@1 (superseded) | **Defective, not publishable** (ruling A) |
| 4 | `water@2` | `water@2` (unchanged) | — | **ashroad@2**, **moonlit@2** | Shipped, **default** |
| 5 | `cobble@1` | `cobble@1` (unchanged) | — | ashroad@1, **ashroad@2** | Shipped, **default** |
| 6 | `lane@1` | `lane@1` (unchanged) | — | moonlit@1 (superseded) | **Defective, not publishable** (ruling A) |
| 7 | `lane@2` | `lane@2` (unchanged) | — | **moonlit@2** | Shipped, **default** |

   - **Styles:** `btf-ashroad@1` and `btf-moonlit@1` are also **defective, not publishable** (ruling A). See the style table above.
   - **Reserved, parked (ruling B; not shipped, ids held so they're never handed out again):**
     - `sand@3` (`locked-2026-11-09:sand@1`) and `lava@3` (`locked-2026-11-09:lava@1`);
     - `cracked@1`, `sandstone@1`, `snow@1`, `trail@1`, `ice@1`, `frost@1`, `ash@1`, `crust@1`, `basalt@1`, `marsh@1`, `mud@1`, `murk@1`, `moss@1` (unchanged ids).
     - They're used only by `btf-desert@1`, `btf-snow@1`, `btf-lava@1` and `btf-swamp@1`, and they **return with their styles** if the CEO signs off desert, snow, lava or swamp.
   - **Excluded (ruling 3):** `planks@1` and `forest@1`. Only the parked `btf-forest@1` uses them.
   - **Retired (ruling C):** the unpublished r12 names **`grass@2`, `sand@2` and `lava@2`** are **frozen and never reused**. Nothing pins them, so nothing migrates.
   - **Check result:**
     - `btf-ashroad@2` → rows 1, 2, 4, 5, and `btf-moonlit@2` → rows 1, 2, 4, 7. Each has exactly one row.
     - `water@2`'s other users (`btf-desert@1`, `btf-forest@1`) are parked, so they're not listed.
     - Mismatches A–C are **resolved** by rulings A–C.

**Name: "paint style"** (UI: "Style"; field `paintStyle`; document kind `paint-style`; folder `paint-styles/`). It is never called a "preset", so it can't be confused with behaviour presets (`presets/<id>@<rev>`, setup-format §6). The full field name also keeps it apart from `edges.style` and the wall look.

**Reuses the existing machinery** rather than adding a parallel one:
- The pin is a field **inside `origin.params`**, like `painter` and each recipe's `version`, so the procedural id already covers it (see Pin below).
- The copy-in-the-project rules are the **presets model** (embedded copy wins), mirrored as the library copies (§6.2.4) already do.
- The id string has the same `<id>@<n>` shape as embedded presets, with the engine's word `version` instead of `rev`.

**Pin.** `params.paintStyle = {id, version}`, e.g. `{"id": "btf-ashroad", "version": 1}` (ref string `btf-ashroad@1`).
- **One style per procedural terrain sheet.** v1 styles terrain sheets only.
- **Reserved on token params (r11, Engine Architect):** `paintStyle` is a legal, optional field on token params, kept for v2.
  - The v1 editor **never writes it**, and the v1 reader **ignores it when painting**, with info `tokenStyleReserved`. The value is kept (R4).
  - **The hash rule has no exceptions:** `id = sha256(JCS(params))` over the **whole** params object, so a reserved field is hashed too.
    - JCS leaves out absent members, so an unset field changes **no** id. Since v1 never sets it on a token, **no v1 token id changes**.
    - A file that does carry it (a v2 save, or a hand edit) gets a different id. That's correct, because v2 would paint it differently.
    - Keeping the field outside the hash until v2 would let one id stand for two looks once v2 reads it. It would also need a per-version hash rule, which is a second source of truth. **Rejected.**
- **It's part of the hashed params**: `id = asset_<16 hex of sha256(JCS(params))>` (§6.2.2). So **an updated style can never silently change an existing map**. A new version gives new params, a new id and a new asset, exactly like a committed param edit.
- **A published version is immutable and kept forever** (engine rule). The project never edits a style version; it only pins one.
- Under a style whose body locks the palette (both BTF styles), a terrain's `palette` is **ignored, with a warning** (`paletteIgnored`). It is kept, never cleared (R4). Which recipe versions a style supports is its body's `recipes` slot map (r12). A terrain whose `recipe@version` the style doesn't list is a warning (`styleRecipeMismatch`), and it paints as the nearest slot by its `defaultTileType` (ARCH v0.6 §13.2).
- A v6 terrain sheet with **no** `paintStyle` (hand-edited) reads as `te-classic@1` with a warning, and "Pin style" writes it.

**Embedded copy** (`paint-styles/<id>@<version>.json`, kind `paint-style` v2 since r12; v1 = r10/r11 drafts). Self-containment:
- The project embeds **each style version that any of its procedural assets pins**, including `role:"source"` originals and the originals named by `bakedFrom`.
- The **embedded copy wins**, and **Render reads only the store** (principle 1). Render never reads the installed style library, so a shared project paints the same anywhere, and a missing version should almost never happen.
- The document is `{kind, formatVersion: 2 (r12; v1 = r10/r11 drafts), id, version, name, painter, sha256, body}`.
  - **`body` field names belong to the Engine Architect** (ARCH v0.6 §13.11; adopted as proposed in r12). *The locked 2026-11-09 bodies use a different shape: see the conflicts above.* All values are integers or strings (JCS stays float-free):

| Field | Type / values | Default (BTF) |
|---|---|---|
| `palette` | `"locked" \| "from-params"` | `"locked"`; `te-classic`: `"from-params"` |
| `ramps` | `Record<"grass"\|"dirt"\|"stone"\|"rock"\|"water"\|"bloom", "#rrggbb"[]>`, 2–8 each, dark → light. **r37 effect ramps** (effect-ramps CN, EA to number): optional keys `"fire"\|"frost"\|"holy"\|"venom"`, same shape, read only by effect `tint_ramp` / `light_ramp` (never by terrain painting) | (all six terrain keys required when locked; the four effect keys are always optional and absent from every published version today) |
| `light` | `"top-left"` | `"top-left"` |
| `recipes` | `Record<slot "grass"\|"dirt"\|"water"\|"stone", "<recipe>@<version>">` (it replaces r10's recipe → version map, and is also the style's supported-recipe list for `styleRecipeMismatch`) | ashroad@2 `{grass: "grass@3", dirt: "dirt@1", water: "water@2", stone: "cobble@1"}` (r13 re-key, table above) |
| `liquidEdge` | `"foam" \| "ice" \| "ember" \| "murk"` | `"foam"` |
| `shore` (r32, ACCEPTED, CEO 18:04 via CoS) | `false \| {foamPx?: 1–4, shallowPx?: 2–12, waveGap?: 4–16, frames?: 2–8, ms?: 50–1000}` (the `water` slot) | The shore follows `liquidEdge: "foam"` (the default) on the water slot: **absent or `{}` means on** with defaults `foamPx` 2, `shallowPx` 6, `waveGap` 8, `frames` 4, `ms` 250 per frame (r34; the default equals the step 32 code constant `SHORE_MS`). `shore: false` means off (today's edge). **`shore: null` reads as absent** (on with defaults, no warning; the same rule as `ms: null`) (r35). A `null` sub-field on the object form (e.g. `{ms: null}`) also counts as absent and uses that field's default, with no warning (r36, N-r3-1). Any other non-object value (`true`, an array, a number or a string) warns **`shoreInvalid`** (field `"shore"`) once per body, and the shore stays on with defaults (r35), **except when there is no usable water ramp** (r36, N-r3-2; see below). Other `liquidEdge` values never get the shore. A bad field on the object form (wrong type or out of range, not `null`) warns **`shoreInvalid`** once per bad field (r34; message names the field) and that field uses its default. **`waveGap` must be a whole multiple of `frames`** (r33), so each frame moves the rings by `waveGap / frames` whole pixels: the loop is seamless with whole-pixel steps; some frames may show no ring when `shallowPx` is small (r35). The defaults 8 and 4 pass. If it isn't a multiple, **`shoreInvalid`** warns once per style body and both fields use their defaults. This is not a coprime rule (gcd(4, 8) = 4, so a coprime rule would reject the defaults). When `accessibility.reduce_motion` is on, the shore's breathing foam and waves freeze on frame 0; the static foam line stays visible. Colours come from the water ramp: foam is the lightest step, wave is 1 step from light, shallow is 2 steps from light. There are no colour fields. A ramp with fewer than 3 steps clamps to the lightest step. **No usable water ramp** (the style has no `water` ramp, or it's empty or not parseable as colours) warns **`shoreInvalid`** once per body ("no water ramp") and **the shore is off** (r35). When a bad whole `shore` value is also present, that body warns both the no-water-ramp notice and **`shoreInvalid`** once for field `"shore"`; the shore is still **off** (r36, N-r3-2). Pinned or locked style versions are never edited, so turning the shore off or changing its params means a new style version. **Existing water maps gain foam on update** (a look change only, with no data change and no migration; the CEO was told through the CoS). |
| `labels` | `Record<slot, string 1–24>` (display only, pinned with the look) | the slot name |
| `anim` | `{frames: 2–8, ms: 50–1000} \| null` (the `water` slot) | **`{frames: 8, ms: 200}`**. `murk@1` has 8 frames. **r33:** under a style the water slot derives a clip from `anim`, so `motion` on styled water applies only with `anim: null`. |
| `priority` | `Record<slot, int 0–100>` (higher overlays lower; ties: slot order) | `{stone: 30, grass: 20, dirt: 10, water: 5}` |
| `macro` | `{size: 1 \| 2 \| 4, origin: "map"}` | `{size: 4, origin: "map"}`; `te-classic`: `{size: 1}` |
| `dither` | `{kind: "bayer4", amplitude: 0–100, accentSteps: 1–3}` | `{kind: "bayer4", amplitude: 35, accentSteps: 3}` |
| `paintSize` | `16 \| 32 \| 64` only | 32 |
| `preview` | `{map: string}` (editor thumbnail only; optional) | `{map: "default"}` |

  - **Effect ramps (r37; **CN-019** (`CN-019-effect-ramps-format.md`), ACCEPTED (EA 2026-11-15 06:31)).** `fire`, `frost`, `holy` and `venom` exist only so that effect `tint_ramp` / `light_ramp` (setup-format §2.10.3.2) can name them; this is palette keys only, with no runtime field. A published style version is immutable, so the keys arrive only in a **new** style version; `btf-ashroad@2`, `btf-moonlit@2` and `te-classic@1` never gain them. A missing effect key is never a body warning: an effect naming it gets `fxRampMissing` once per effect and the field plays as absent. Terrain painting ignores the four keys, and a reader that doesn't know them keeps them and ignores them; they never make the `ramps` field bad. The colour stops are supplied by UX in the style data; the format fixes only the key names and shape.
  - A bad body field is a **warning per field**, and that field's default is used. Only "recipe not registered" or "painter too old" is H4.
  - **`te-classic@1`'s `recipes`** names only the slots it has: `grass@1`, `water@1`, `stone@1`. Its other frozen generics (`sand@1`, `wall@1`, `lava@1`) paint from their own v0.5 params, with no `styleRecipeMismatch`, because `palette: "from-params"` keeps v0.5 meaning. (Shape **confirmed by the Engine Architect**.)
  - **`stoneKind` is retired (r12), with a converter tombstone.** `paint-style` **v1 → v2** (migration `paint-style 001`) runs only on r10/r11 draft embeds; no version was published before r12, so no published body ever changes:
    - `stoneKind: "cobble" | "lane"` → `recipes.stone: "cobble@1" | "lane@1"`;
    - a number-valued `recipes` map (`{grass: 2, …}`) → `"<slot>@<n>"` per slot key, except `dirt`, which becomes `"dirt@1"` (r10's `dirt: 2` was wrong, ARCH §13.2);
    - then `sha256` is recomputed. The old body is kept in the `migrate` op's `before`, and nothing else changes. A v2 body with `stoneKind` gets a warning, and it's ignored.
  - `sha256` = SHA-256 over `JCS(body)`.
  - `painter` is the minimum painter version the style needs.
- The embed is written when a style version is first used (as presets are embedded on apply). An embed that nothing pins any more is dropped on save, with info. Old pins keep their embed for as long as anything pins them.
- Share always keeps the embeds (`stripSources` doesn't touch them). **Export:** in `live` ship mode the closure carries the used style bodies inside `game.json`'s params entries (§7.4). In `bake` mode, none ship.

**Resolving a pin when painting** (warn, don't block):
1. **The embedded copy.** If an installed built-in with the same `id@version` has a different `sha256`, the embedded copy still wins, with a warning `styleVersionMismatch`, because a published version is immutable.
2. **Editor only:** with no embed, the installed built-in of exactly that `id@version` is used and embedded, with a **notice**. Render never does this.
3. **A stored bake of this asset** (an upload whose `bakedFrom.assetId` is this asset): it's drawn instead, with a warning `styleMissingUsedBake` ("drawn from its baked sheet; edits need the style").
4. Only then **H4** (the existing "unknown painter/recipe version" handling, §13). There's still no seventh hard error.

**"Update available".** It's an editor badge, computed at runtime from the installed styles against the pins (a newer `version` of the same `id`). It's a **notice**, never a warning, and it's **never stored** (the index is computed from the store only).

**Upgrade** (`upgradePaintStyle({id, from, to, scope: "project" | {mapId}})`) is an explicit editor action, with a before/after preview first. It writes nothing until confirmed. Then, as **one undo group** (setup-format §4 rule 10, one op per touched document, all sharing `group`):
- It embeds `id@to`.
- For each procedural asset pinned to `id@from` in scope, it writes a **new** asset (same params with `version: to` → new id) and **rewrites references** in scope.
  - **Project scope** rewrites everything.
  - **Map scope** rewrites only that map's layers, background layers and objects. Other maps keep the old asset.
- **Rebake:** if references in scope pointed at a stored bake of the old asset, it bakes the new asset (§6.2.3, `bakedFrom` with the new pin) and points those references at the new bake.
- **Old pins keep working forever:** the old assets, bakes and embed stay until nothing uses them (unused → info; embed dropped on save as above). Undo restores the references and the previous state in one step.

**Migration:** tile-project 005 (§12) pins existing unpinned terrain sheets.

### 6.3 Unit (`units/<id>.json`, v2)
`{kind:"unit", formatVersion:2, id, rev, name, sprite: assetId|null, setupIds: setupId[], stats, footprint?, history, createdAt, updatedAt}`. `footprint` is optional with a 1×1 default, so this needs no version bump.
- **`stats: Record<statKnobId, {value, rev}>`** is partial: a missing key means "inherit the army value". Keys are `unit-roster` knob ids with `per_unit: true` (rev 7: `unit_hp`, `unit_atk`). Any other key is kept and ignored, with a warning.
- Values are checked like answers (setup-format §2.5): range is a warning, a wrong type is hard.
- `history` uses the setup Op shape. An inheriting stat is `before: {"inherited": true}`.
- **`footprint?: {w: int, h: int}`** (r7, CEO). Reserved for multi-tile units. **v1 supports only 1×1**, and a missing field reads as `{w: 1, h: 1}`, so old files are unchanged. A stored value other than 1×1 is a **warning** ("multi-tile units come later; this unit plays as 1×1"). It's kept as stored, never rewritten (R4). The writer doesn't offer it in v1. **Tall units** are 1 tile wide with a taller frame: the sprite overhangs upwards from its `anchor` (default bottom-centre, §6.2). Logic, occupancy and clicks use the 1×1 footprint only.
- **No `side`.** Side comes from use on a stage: by default the loadout is `player`, the enemy pool `rival` and `neutrals` `neutral`, and a stage may reassign them (`stage.sides`, `neutrals[].side`, §6.5, r13). Facing likewise lives only on placement entries (§6.5).
- **Replaces the shell's `_protoStats {hp, atk}`** (§12 import).
- **Sprite and animation:** `sprite` names the asset. The frame size, anchor and clips live only on that AssetMeta (§6.2). Units store no frame data. (If per-unit clip remapping is ever needed, it would be a name→name map, never frames.)
- **Well-known clip names (r5, ruling 4).** Clip names are free text. Render recognises these lowercase names; everything else is user-named and played only when something asks for it by name:
  - **Facings:** `down`, `left`, `right`, `up`.
  - **Actions:** `idle`, `move`, `attack`, `hit`, `die`.
  - **Naming:** a clip for one action in one facing is `<action>-<facing>` (e.g. `attack-left`). A bare action name (`attack`) is that action in any facing. A bare facing name (`left`) is `move` in that facing, which is what the import convention writes for a walk sheet.
  - What Render plays when a clip is missing is fixed, and is in **§7.3**. Units never store fallbacks.
- **Import convention, not a format rule:** a 4-row walk sheet gets the clips `down`, `left`, `right`, `up` (rows top to bottom, RPG Maker order), and a 1-row sheet gets `idle`. The user can rename or reorder them; the format stores only the resulting `clips[]`.

### 6.4 Map (`maps/<id>.json`, v5): visual layers and a separate logic grid (K3, K4, K9; r5 palette and edges; r7 parallax layers)
| Field | Type | Default | Notes |
|---|---|---|---|
| `kind`, `formatVersion: 5`, `id`, `rev`, `name`, `createdAt`, `updatedAt` | | | |
| `cols`, `rows` | int ≥ 1 | | No cap. The editor warns above 256×256 that phones may stutter (ARCH §12.3). |
| `tile` | `{w, h} \| null` | `null` = inherit `settings.tileSize` (square) | **K9.** A per-map tile size; non-square is allowed. `null` keeps one source: changing the project default moves every map that didn't set its own. |
| `background` | `{colour?: string, layers: BackgroundLayer[]}`; `BackgroundLayer = {assetId, depth: number, repeat: "none" \| "x" \| "y" \| "both", fit?: "none" \| "cover" \| "stretch"}` | `{layers: []}` (no colour = `letterboxColour`) | **K4, r7: the only home for background images and parallax**, below. v4 `mode`/`assetId`/`scroll`/`fit` are folded in by map 004. |
| `layers[]` | `{id, name?, tileset: assetId \| null, aboveUnits: bool, visible: bool, autotile?: 4 \| 8, tiles: (int \| null)[]}` | ≥ 1 layer | **Visual only, grid-locked** (no parallax: that lives only in `background.layers`). r7 (PL13): optional `autotile` (absent = none) lets the editor's "Re-tile layer" rebuild indices from the terrain slots. Masks are computed by the editor brush, never stored, never recomputed at runtime. Drawn bottom to top, above the background; `aboveUnits` layers draw over units (ARCH §12.1). `tiles` is row-major, length `cols*rows`, `null` = empty. |
| `seeThroughCanopy` (r32, ACCEPTED, CEO 18:04 via CoS) | `boolean` | `false`; absent means false | Maker-only, never a player setting. When true, above-layer tiles over a unit's cell and the cell above it are cut through. Map stays **v5**, no migration. The per-placement layer chip stays a later CN. |
| `logic` | `{terrain: int[], palette: Record<int, tileTypeId>, edges: Edge[], lanes?: int[] /* r14 */}` | `palette {"0": "floor"}`, `edges []` | **The only thing game logic reads** (movement, the TILE pipe, `core/grid`); never pixels or tile indices. `terrain` length is `cols*rows`. |

**Background layers and parallax (r7; CEO: parallax is a v1 option; Editor & UX: one home).**
- `background.layers[]` is drawn **first = farthest**, under every visual tile layer. `colour` (if set) fills behind them; absent = `letterboxColour`.
- **`depth`** (default **1**) is how far the layer moves relative to the camera: **1 = scrolls with the map** (locked to the grid), 0 = fixed to the screen, between = slower, so it reads as far away.
  - It's a number ≥ 0. Outside 0..1 is a **warning**: the stored value is kept, and it's drawn clamped to 0..1.
- **`repeat`** (default `none`): `x`, `y` or `both` tile the image at native size (the integer path; this replaces v4's `fit: "tile"`).
- **`fit`** (default `none`): `cover`/`stretch` are **only with `advancedRender`**, otherwise they read as `none` (table below).
- **One home:** visual tile layers have no depth. The map's painted background is just `layers[0]` with depth 1. There's no second `assetId` or `mode`.
- **Cap: 3 layers, soft (C4).** More than 3 is an `overCap` **warning** ("more than 3 background layers may slow phones"). Nothing is truncated, and all are drawn.
- **Editor UX (CEO):** the simple screen shows one painted background and one **Depth** slider (`layers[0].depth`). **Advanced** shows the list, with Add disabled at 3. Lists over 3 only come from files or imports.
- **Size checks:** a layer with depth 1 and `repeat: "none"` has the exact `requiredSize` rule below. Any other layer warns only when the image is smaller than its view travel on a non-repeated axis.
- **Art lock:** the offset is `round(cameraOffset × depth)` in whole art pixels, so pixels stay square and nothing resamples. Sub-pixel offsets are drawn only with `advancedRender` and `pixelPerfect` off.
- A paged image in a layer draws its pages in place (§6.2). A missing `assetId` is H3.

**Background colour and fit (K4).**
- **`requiredSize` is derived, not stored** (for depth-1 layers): `cols × tile.w` by `rows × tile.h`.
- **Fit mode, for when the image isn't the required size.** The exact size with `fit: "none"` is the **locked-on default** (CEO art stance):

| `fit` | Draws | Available | Check |
|---|---|---|---|
| `none` (default) | native size, top-left; the rest is `colour` or `letterboxColour` | always | Warn "background is W×H, map is W×H" (depth 1, no repeat) |
| ~~`tile`~~ | r7: use `repeat: "both"` (repeated at native size, the integer path) | always | Info. Pixel-perfect; good for BTF floor slabs. |
| `cover` | scaled to cover, preserving aspect, cropped | **only with `advancedRender`** | Warn "may blur or stretch your art" |
| `stretch` | scaled to exactly the map size | **only with `advancedRender`** | Warn "may blur or stretch your art" |

- **While `advancedRender` is false,** the reader resolves a stored `cover` or `stretch` as `none`. The stored value is kept, inactive and unused, and the editor shows it greyed out with "needs Advanced render". Nothing is rewritten.
- **With `pixelPerfect` effectively off** (advanced only), a `fit: "none"` background at map size scales with the camera, together with the tiles (ARCH §12.5 v0.4).

**Tile meanings: `logic.palette` → `terrain.tile_types` (r5, catalogue rev 7).** The meaning of a tile (open, kills on landing, push can enter, slows, trips) lives **only** in the `terrain` behaviour's `tile_types` list answer (setup-format §2.9.1). The map stores **which type is where**, never what a type does:
- `logic.terrain[i]` is a small int; `logic.palette[int]` names a `tile_types` id. Ints keep the grid compact and stable while type labels and fields change.
- **Resolution per stage:** `tile_types` resolves through §7.1 (stage override, else the project's `terrain` setup, else the catalogue default with its 10 built-in types). So one map can mean different things on two stages only through that one answer, never through the map.
- An int in `terrain` with no palette entry, or a palette id not in the effective `tile_types`, is a **warning**, and that cell runs as `floor` (a reserved id, so it always exists).
- **Tile-type id alias (r16; Engine Architect 2026-11-12; the one alias table is in setup-format r15 §2.9.3):** **`wall-block` is the canonical blocking wall.** A reader that meets **`wall_block`** (as written by the painter mock) in `logic.palette`, `tileProps[].logic` or `tileTypeOverrides` reads it as **`wall-block`**, with info `tileTypeAliasRead` (PROPOSED name). The cell blocks; it never silently plays as `floor`. Writers always emit `wall-block`, so a re-save normalises the value. The alias applies only when `wall_block` isn't itself an item in the effective `tile_types` (a user's own item with that id wins).
- **Walkable land `path` and `dirt` (r16; built-ins shipped in catalogue rev 23, setup-format §12.5 L45; adopted r38):** both are `open`, push can enter, and not buildable, the same as `floor`. Brick path and Dirt in the stage live view paint these ids. A palette `path` or `dirt` now resolves to its own built-in tile type. *(Before rev 23 it wasn't in the effective `tile_types`, so it gave the existing warning and ran as `floor`, which has the same walkability.)* Nothing breaks, and the project is unchanged on adoption.
- The palette may list ids the grid doesn't use (the painter keeps them); that's info, never a check.
- The map has no labels, colours or flags for terrain; `legend` (v3) is gone (map migration 003, §12).
- **Built-in types `water`, `lava`, `wall-block` (L27; r13: CONFIRMED by the Engine Architect with the rev 10 + L34 values, gaps §19).** `water`: not open, push can't enter. `lava`: open, kills on landing, push can enter. `wall-block`: not open, push can't enter. The procedural recipes' defaults are grass/sand/stone/dirt/wood/snow/ice → `floor`, water → `water`, lava → `lava`, wall → `wall-block`.
  - **Core invariant (r13): no unit ever occupies a tile with `open: false`.**
    - Placement onto one (a spawn, neutral, fixed entry or summon cell) is skipped, with a warning.
    - Movement and forced movement never end on one.
    - A stage override that closes an occupied tile type applies at stage start, so placement is checked against it.
  - **`kills_on_landing` (r13, Engine Architect)** applies at **any move end**: a normal move, a forced move, a warp or a summon. It **never applies mid-path**.
    - Its scope is the catalogue picker **`terrain.lethal_landing_scope`**: `any` (default) | `forced_only`. The **Librarian owns this knob** (request L36; it isn't in the rev 13 file read at 22:0x).
    - Until it ships, the scope reads as `any`.
  - **`wall-block` stops all forced movement** (CoS §15 Q5; rev 10 ships `push_can_enter: false`).
  - **`terrain.push_into_walls`** (toggle, default **`false`**, rev 10, L34) "slams into walls" (**r14, rev 14:** it covers wall-block tiles **and edge walls for the event**; edge walls always stop the move). **With it on (r13, Engine Architect):** a forced move that meets a wall-block, edge wall or unit **stops on the last open cell**, and the core emits the event **`pushBlocked {unit, blocker, cellsRemaining}`**. `blocker` is `wall-block` \| `edge` \| `unit`: the same event fires whenever a forced move stops early.
    - Any damage from that is a **rules knob on the push behaviour** (rev 14: `push-knockback.wall_slam_damage` 0–3, `wall_slam_scaling` flat | per_cell_remaining), never core.
    - With it off, the push still stops short (it doesn't enter), with **no event**. The invariant above holds either way: a unit never ends on the wall-block.
    - **Core events (r13, 22:1x; r14 adds `enteredLane`, and PROPOSED `actionLogged {seq, kind, durationMs}`, once per command-log entry, step 07):** `core-types.ts` holds a minimal `CoreEvent` union (MAY-MOVE): `landedOn {unit, cell, cause: move|forced|warp|place}`, which is where `kills_on_landing` resolves, and `pushBlocked`. The rest arrive with build step 07. Runtime only, never stored.
  - **Edge walls (`logic.edges`) always stop forced movement**, as core grid topology. No knob crosses them; a push-through-edge option would be a separate edge knob later.
- **Lane region tag: `logic.lanes?` (r14; CoS ruling: lanes are optional, off by default; catalogue rev 14 `terrain.lanes_enabled` / `lane_axis` / `lane_count` / `lane_field_lanes`).**
  - **Shape:** an optional `int[]`, **row-major, length `cols*rows`**, where `0` = no lane and `1..lane_count` = a lane id. It holds **only** the per-cell tag. Axis, count and which lanes hold lane fields stay in the terrain knobs, never in the map.
  - **Read only when the effective `terrain.lanes_enabled` is `true`** on the stage. Otherwise it's kept and ignored (R4), with no warning.
  - **Absent while lanes are enabled:** lanes are **derived** from the knobs. They're `lane_count` equal bands across the map, numbered from 1 at the top (`lane_axis: row`, lanes run left to right) or from 1 at the left (`column`). Band of a cell = `floor(i × lane_count / n) + 1`, where `i` is the row (or column) and `n` is `rows` (or `cols`). Derivation formula PROPOSED, for the Engine Architect to confirm.
  - **Present:** the tags win (hand-painted regions, e.g. BTF's `LaneId` top/mid/bot on a 6 × 9 board).
  - A value `> lane_count` or `< 0` is a warning, and it reads as `0`. A wrong length is a warning, and the whole array is ignored (derived lanes are used). It's **never H5**, because lanes are optional.
  - **Centre lanes (r14, Engine Architect).** With an odd `lane_count`, the centre is `(lane_count + 1) / 2`. With an **even** count, **both `lane_count / 2` and `lane_count / 2 + 1` are centre lanes**.
    - `lane_field_lanes: centre-only` means the centre lane(s): both of them for even counts.
    - Anything that needs **one** centre defaults to **`lane_count / 2`** (the lower index), and the choice is the terrain picker **`terrain.centre_lane`** `lower` | `upper` (default `lower`; gated on `lanes_enabled`; rev 15, L43 adopted).
  - The core emits `enteredLane {unit, lane}` when a move ends in another lane (rev 14 rule hook).
  - **Optional, so no migration and no version bump:** absent = no tags (`map` stays v5). It's in `core-types.ts` as MAY-MOVE.

  Excerpt (6 × 3 map, tagged rows: lane 1 top, 2 middle, 3 bottom):
```json
{"logic": {"terrain": [0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0], "palette": {"0": "floor"}, "edges": [], "lanes": [1,1,1,1,1,1, 2,2,2,2,2,2, 3,3,3,3,3,3]}}
```
- **Paths: `map.paths?` (r14 in place; PROPOSED, not v1-blocking; MODES-v2 tower defence "Path graph over `{c,r}`", B2).** `paths?: {id, cells: {c, r}[], contiguous?: boolean}[]`, an **ordered route** per entry.
  - `id` is unique in the map. `cells` are integer cells in walk order (the first is the spawn end, the last the exit end).
  - **`contiguous`** defaults to `true`. Then each step must be **adjacent per this doc's adjacency, which is orthogonal only**: `|dc| + |dr| = 1`. Edge walls (`logic.edges`) live between orthogonal neighbours, and "beside" is N/E/S/W (ARCH: `adjacency-synergy.shape` = `nesw`), so diagonals never count. `contiguous: false` is a waypoint list, where the gaps are filled by the runtime's pathing (`core/path`, Engine Architect).
  - **Checks, all warnings, never errors:**
    - a cell off the map (skipped);
    - a non-adjacent step while `contiguous` (it's kept, and the route is treated as broken there);
    - a step across an edge wall, or onto an `open: false` tile;
    - a duplicate `id` (the later one is ignored);
    - an empty `cells` (ignored).
  - **Paths are not lanes.** Lanes (`logic.lanes`) are **areas**: an unordered per-cell region tag. Paths are **ordered routes**: a sequence of cells. A cell may be on a path and in a lane, and neither field derives from the other. A multi-lane TD map is several paths, each of which may run through a lane.
  - It lives at **map level, beside `objects`**, not in `logic`. Movement and walkability still come only from `logic`, and a path is a route that rules and spawners name by `id` (e.g. a spawner's `pathId`). It's **optional, so no migration and no version bump** (`map` stays v5). It's in `core-types.ts` as MAY-MOVE.
  - **Not a map flag layer:** MODES-v2 B2's `walkable` = the tile type's `open`, and `blocked` = `open: false` or a blocking object. `buildable` is a `terrain.tile_types` item field (rev 15, L41 adopted: false on all 13 built-ins), and spawn/exit are a path's ends. So no `cellFlags` layer is added.

  Excerpt (one route on a 6 × 3 map):
```json
{"paths": [{"id": "west-road", "cells": [{"c": 5, "r": 1}, {"c": 4, "r": 1}, {"c": 3, "r": 1}, {"c": 3, "r": 2}, {"c": 2, "r": 2}, {"c": 1, "r": 2}, {"c": 0, "r": 2}], "contiguous": true}]}
```
- **No authored tile map exists in BTF** (gaps §13: `square.ts` `COLS 6`, `TOWER_RANKS 9`, every tile floor; the other types are runtime states). So `palette` is how authored maps place `vines`, `trap`, `fallen` or user types like `lava`; runtime states are written by the rules, not stored.

**Edge walls: `logic.edges` (r5).** Walls sit on a tile's edge, not on a tile (`towerTerrain.ts` `EarthSeam {col, rank, edge n|e|s|w, …}` L60), so they are not tile types and not in the palette.
- `Edge = {c, r, side: "n" | "e" | "s" | "w", look?: WallLook}`: the wall on that side of tile (c, r); `look` is visual only (r8, below). `Sq` coordinates, as everywhere else.
- **One record per physical wall.** The writer stores `e` as `w` of (c+1, r), and `s` as `n` of (c, r+1), whenever that neighbour is on the map. So only map-border walls keep `e`/`s`. The reader accepts any form, and a duplicate (the same wall twice) is info and counts once.
- **What a wall does (Engine Architect, r6):**
  - **Core grid, always:** a wall blocks movement and adjacency across that edge, both ways, for everyone. Pushes, steps, "beside" checks (adjacency-synergy, contest linking) and pathing all use the core grid's edge test. No behaviour or setup is needed.
  - **Line of sight and projectiles:** two catalogue knobs on **`terrain`**, `wall_blocks_los` and `wall_blocks_shots` (toggles, default `true`; request **L24**). Knobs, not `project.settings` fields, so undo, presets, stage overrides (`stage.overrides.setups.terrain`), Godmode and drift all work unchanged, and there is one home. Until L24 ships, the reader uses `true` for both.
  - **`barrier-line` adds only the extras, and only when a `barrier-line` setup exists in the stage's resolved rules:** walls an ability places get an owner side (`own_shots_pass`, `soaks_enemy_shots`), and walls become destructible (`line_hp`, damage, crumble). Authored map walls have no owner, so the side rules never apply to them. Without a `barrier-line` setup, authored walls are indestructible.
  - The runtime-only `EarthSeam` fields (`id`, `hp` left, `crumble`, `group`, `age`) are match state and never stored.
- An edge off the map is a **warning** and is skipped. `terrain.tile_types` never duplicates walls (gaps §13).

**Wall look (r8; art-upload r2 gap 6).** How a wall looks is user data, but it isn't logic. Each wall is still stored **once**, in `logic.edges`, and its look rides on that same record. There's no parallel list.
- **`map.wallLook?: WallLook`**: the map's default look, with the visual fields (beside `background` and `layers`). Absent = `{mode: "line"}`.
- **`Edge.look?: WallLook`**: an optional per-wall override of the whole look. Absent = the map default.
- `WallLook = {mode: "line" | "asset" | "invisible", colour?: "#rrggbb", width?: int px ≥ 1, assetId?}`:
  - `line` is the **stock style**. Absent `colour`/`width` use the engine's stock constants, which are never written.
  - `asset` draws `assetId` (an image of one horizontal wall, one tile long) along the edge at native size, rotated 90° for vertical edges, which is lossless. A length ≠ the tile width is a warning: it's drawn at native size and clipped.
  - `invisible` blocks exactly the same and draws nothing.
- **Logic never reads `look`.** Blocking, LOS and shots are unchanged (core grid + `terrain` knobs).
- `look.assetId` is in the closure and the stage packs (§7.2 step 5), and a missing one is H3.
- **Stock and modes (Engine Architect r9; the constants live in ARCHITECTURE §13/§12 and are only defaulted here):**
  - `line`: colour **`#20242C`**, width **`max(1, round(tileSize / 16))`** source px, unless `colour`/`width` are set.
  - `asset`: the image is **centred** on the edge, **rotated 90° clockwise** for vertical edges, and drawn at **whole-number scale only**. An image whose width ≠ the tile size gets a warning.
  - `invisible` **still blocks**. The editor draws a dashed overlay, which never appears in Preview or Render.
- **Old maps:** no `wallLook` and no `look` means stock-drawn walls, so they draw as the mock does today. These fields are optional, so `map` stays **v5** and there's **no migration step**.

**Map objects: `objects[]` (r9; CoS ruling, option b, CEO-backed).** Optional, absent = none, so old maps load unchanged and `map` stays **v5**.
- `MapObject = {id, assetId, at: {c, r}, footprint?: {w, h}, blocks?: bool, blocks_los?: bool | null, blocks_shots?: bool | null}`
  - `id`: `[a-z0-9][a-z0-9_-]{0,31}`, unique within the map.
  - `at`: integer `Sq`.
  - `lightSource?` (r30, ACCEPTED r31): overrides the asset's (or tile's) `lightSource` for this placement only, replaced whole; `null` = this placement gives no light. Absent = inherit. Same checks and `lightInvalid` as §6.2. This exists because asset ids are content hashes, so two torches with the same picture are one asset.
  - `motion?` (r32, CEO 18:04 via CoS): overrides the asset's (or tile's) `motion` for this placement only, replaced whole; `null` = this placement has no motion. Absent = inherit. Same checks and `motionInvalid` / `motionTooLarge` as §6.2. Makers switch it on or off per plant. There is no `leafy` tag; the tree, bush and grass recipes and the BTF bake script still write `motion.sway` on their outputs.
  - `footprint`: reserved, read as 1×1, exactly as `unit.footprint` (§6.3). Anything else is a warning, and it's placed as 1×1.
    - **r15 (PROPOSED; EUX r65 Q-D1; EA: "one object with a footprint"):** this is **the one home** for a placed object's size. There's **no asset-level `tiles`**: `tile {w, h}` on AssetMeta already means tileset cell pixels, and occupancy is placement logic, like `unit.footprint`.
    - **The editor may now write it.** Place and Move show and check the whole footprint: green or red, with the reason in words. The default for a new placement comes from the picker entry (the Starter Pack or library manifest, e.g. House 2×2, Well 1×1), **not** from project data. User-imported art defaults to 1×1, and Edit can change it.
    - **Cells (CONFIRMED, Engine Architect 2026-11-12; r16):** `at` is the footprint's **bottom-left** cell, and `{w, h}` grows **right and up**. Row 0 is the top row, and north is `r−1`. So the footprint covers columns **`c … c+w−1`** and rows **`r−h+1 … r`**, and bottom-anchored art stands on its bottom row. 1×1 is exactly today's behaviour. The art's anchor sits at the bottom-centre of the footprint's bottom row.
    - **Until the EA's footprint slice lands, the runtime occupies and hit-tests only `at`** (and blocks only `at` when `blocks: true`), with `footprintIgnored`. Editor Place and Move already check the whole footprint. The non-1×1 warning stays, worded "plays as 1×1 for now".
  - `blocks`: default `false`. When `true`, the cell is closed to movement and adjacency, and to forced movement too, through the core grid, like a not-open tile.
  - `blocks_los`, `blocks_shots`: default `null` = inherit `terrain.wall_blocks_los` / `wall_blocks_shots`. They're read only when `blocks` is `true`, and stored-but-unused otherwise (info).
- **What objects are:** **TILE-layer occupants**. They are not units, not in loadouts or pools, and **not UNIT-targetable**. Abilities that target a cell see the cell; the object is part of it. They have no HP, side, setups or clips (one still frame, or the asset's `idle` clip if it has one).
- **Drawing:** the sprite's `anchor` (default bottom-centre) sits on `at`, and tall art overhangs upwards like a tall unit.
  - **Draw order (r9):** background layers → tile layers (not `aboveUnits`) → walls → **units and objects together, row-sorted** (by `r`, then `c`; at a tie, the object draws before the unit) → `aboveUnits` tile layers.
- **Closure:** `objects[].assetId` is in the closure and the stage pack (§7.2 step 5). A missing asset is **H3**.
- **Checks (C4):**
  - An object off the map: warning, skipped.
  - Two objects on one cell: info.
  - A blocking object on a spawn, neutral or fixed-enemy cell: warning, and the unit is placed anyway.
  - `blocks_los` / `blocks_shots` set while `blocks` is false: info.
- **Stage overrides: not covered.** Map content (layers, logic, edges, objects) has no per-stage override in the stage model (§6.5 overrides cover knobs, units, loadout, rules and difficulty only; one map serves many stages, P1). A stage that needs different objects uses a second map. A per-stage object overlay would be a new override kind; it's noted for later, not added.

**Editor painting** may write both a visual tile and, from its `tileProps[i].logic` tile type, the matching palette index into `logic.terrain`, but the two are stored apart. Hand-painted logic always wins. Walls are painted on the Walk rules layer by tapping a tile edge.

- **One map serves many stages** (P1). **Maps hold no units, placements or enemy pool.** The shell's `maps[].placements` and `maps[].enemyPool` move to a stage on import (§12).

### 6.5 Stage (`stages/<id>.json`, v2) (P1, S1, C3, Q9, Q10)
| Field | Type | Rule |
|---|---|---|
| `kind`, `formatVersion`, `id`, `rev`, `name`, `createdAt`, `updatedAt` | | |
| `mapRef` | mapId | Required. Many stages may share a map. |
| `playerSpawns` | `(Sq & {facing?})[]` | Tiles where the chosen loadout units are placed, in order. r13: optional `facing` per entry. |
| `neutrals` | `{unitId, at: Sq, facing?, side?, setupIds?}[]` | Always-present neutral units. r13: optional `facing`, and a per-entry `side` override. **r15, DECIDED r40 (Phase 1): NPCs live here** (below). |
| `seed?` | `int \| null` | r13, MAY-MOVE. Absent/`null` = a fresh seed at play start. |
| `sides?` | `{loadout?, enemyPool?, neutrals?: sideId}` | r13. Defaults `player` / `rival` / `neutral`. |
| **`enemyPool`** | EnemyPool | Which enemies appear and how (below). References unit ids. |
| **`loadout`** | `Loadout \| null` | **Stage override.** `null` = use `project.loadout`. When set, it **replaces** the project loadout as a whole for this stage. |
| **`rules`** | setupId[] | **Stage rules, which override project rules.** At most one per behaviour. A setup here for a behaviour that is also in `project.rules` **replaces** the project setup on this stage. Others add behaviours on this stage only. |
| `overrides` | `{setups: Record<behaviourId, Record<knobId, {value, rev}>>, units: Record<unitId, Record<statKnobId, {value, rev}>>}` | Per-knob overlays for this stage (§7.1), including Godmode "this stage" saves. **`setups` is keyed by behaviour id** (r3), so it applies on top of whichever setup wins for that behaviour on this stage, project or stage rules. That is how a stage changes ability presentation: `overrides.setups["ability-presentation"]` (Q10). |
| **`difficulty`** | `{hp?: number, damage?: number, appliesTo?: …} \| null` | **Q9.** `null` = use `project.difficulty`. Each field present overrides that field only. |
| **`audio?`** | `{ music?: MusicSlot \| null }` (**defined in [audio-format.md](audio-format.md) §3.3**) | **PROPOSED (00:2x).** Stage battle-music override. Absent = inherit `project.audio.music.battle`. `music: null` = silence. A partial `MusicSlot` overrides `battle` **field by field**, the same rule as `difficulty` below. The Sound panel and Stage inspector both write this one field. No stage version bump (optional; absent = today's inherit/silence). |
| `history` | History | The setup Op shape. `knob` is a path: `setups/<behaviourId>/<knobId>`, `units/<unitId>/<knobId>`, `loadout`, `enemyPool`, `rules` or `difficulty`. |

**NPCs (r15; DECIDED r40 for Phase 1, dsk-rulings/2026-11-17-phase1.md D2/D5; EUX r65 Q-D2).** Phase 1 talk: the placement's `talk` setup answers `line` (text, max 140 code points) and `effect` (catalogue rev 28); attack's effect is that placement's `basic-attack.effect`. There's no `unit.talk` or `unit.fx`. An NPC is **an ordinary unit placed in `neutrals[]`**. There's no `kind: "npc"`, no `npcRole` and no separate `npcs[]` list, so there's one placement list and one unit format.
- **Picker → unit:** Villager, Merchant, Guard and Elder are Starter Pack unit templates. The first use copies one into `units/<id>.json`, the library-copy rule (P4); later placements reuse that unit.
- **Role (Assign behaviour) = `neutrals[].setupIds?: setupId[]`**, optional. These are behaviour setups for **this placement**, added to the unit's own `setupIds`. For the same behaviour the placement's setup wins (at most one per behaviour), the same rule as stage rules over project rules. Absent = the unit's own setups only. Role fields (wander area, stock, quest) are that setup's answers (setup-format), so there's no ad-hoc `fields` object.
- **Which behaviour ids** (`npc-role`: idle, wander, quest-giver, seller; IDEA, v1:false) is the Librarian's **Q-L1**. Until it ships, the mock keeps the role in mock state only and writes no setup.
- A `setupIds` entry that points at a missing setup is checked exactly like one in `unit.setupIds` (same check and level, §13). The editor never writes an id it doesn't have.
- Example (a Villager who wanders, placed at c 4, r 6, facing south; the setup id is illustrative until Q-L1):
```json
{"neutrals": [{"unitId": "unit_01JCK7A1B2C3D4E5F6G7H8J9K0", "at": {"c": 4, "r": 6}, "facing": "S", "setupIds": ["setup_01JCK7B2C3D4E5F6G7H8J9K0M1"]}]}
```
- **Move** writes the placement entry's `at` (`neutrals[]`, a fixed `enemyPool` entry, or a `playerSpawns` entry). Units have no position of their own (§6.3).

**Placement facing, seed and sides (r13; Engine Architect rulings on the core-types GAPs).** These are all optional. Absent means exactly today's behaviour.
- **`facing?: "N" | "E" | "S" | "W" | null`** (MAY-MOVE) goes **only on placement entries**:
  - each `playerSpawns` entry, which is now `Sq & {facing?}` (a plain `{c, r}` is still valid, so the existing `Sq[]` arrays don't change);
  - each `neutrals` entry and each **fixed** `enemyPool` entry (`{unitId, at, facing?}`; `at` stays a plain `Sq`);
  - each **weighted/waves** `spawns` entry (`Sq & {facing?}`).
  - **Absent or `null` means no facing**, so `rotate_with_facing` is the identity (§6.7). **Facing is never inferred from side.**
  - **The one mapping to clip suffixes (§6.2 facings): `N` = `up`, `E` = `right`, `S` = `down`, `W` = `left`.** Only the letter is stored, never a second field. Any other value is a warning, and it reads as no facing.
- **`seed?: int | null`** (MAY-MOVE): the match RNG seed for this stage. **Absent or `null` means a fresh seed at play start.** A non-integer is a warning, and it reads as `null`.
  - The **command-log header** records `{seed, formatVersion, engineVersion, projectHash}`. That's a **runtime shape owned by the Engine Architect** (core events/command log). It's referenced here, never stored in the project.
- **Sides.** Side ids are the keys of `ability-presentation.team_colours` (setup-format §2.9; built-in `player`, `rival`). **`neutral` is reserved** as a side id (catalogue rev 13, L35 shipped: built-ins `player` #badcff, `rival` #c44a3a, `neutral` #8a8f98; `keyed_by: "side"`).
  - **`sides?: {loadout?: sideId, enemyPool?: sideId, neutrals?: sideId}`** assigns each army or pool on this stage to a side. The keys are the existing field names, so there's no new vocabulary.
  - Defaults: **`loadout` = `"player"`, `enemyPool` = `"rival"`, `neutrals` = `"neutral"`.**
  - A **`neutrals` entry may carry `side?: sideId`** as a per-entry override.
  - An unknown side id is a **warning**: that army plays as its default side.
  - A `team_colours` entry that **no stage assigns** (neither `sides` nor a neutral `side`) is a **warning** (`sideUnassigned`), never an error. Built-in `player`/`rival` are exempt, because they're always assigned by default.
  - `PlacedEffect.side` (above) uses the same side ids.
- **No version bump, no migration (verified).** `stage` stays **v2**:
  - every new field is optional;
  - absent `facing` = no facing (today), absent `seed` = fresh seed (today, "runtime data"), absent `sides` = player / rival / neutral (today's "side comes from use", §6.3);
  - a plain `Sq` spawn is still a valid `Sq & {facing?}`.
  - So every v2 file reads identically, and nothing is rewritten. **Caveat:** an older writer that drops unknown keys would lose these fields on re-save. That's acceptable only because no app has shipped this format yet (DRAFT). From r13, **writers must keep unknown keys in known documents** (R4).

**Stage-authored effects: `stage.placedEffects?` (r9; triggers per the Engine Architect).** These are the only map-absolute effects, and they live in the stage, never in an effect document or the skill spec. They are driven by the one runtime clock / event bus.

| Field | Type | Default | Meaning |
|---|---|---|---|
| `id` | string | | unique in the stage |
| `effect` | effect document id \| BTF builtin id | | Like an owner's `effect` answer. Unknown → `unknownRef` warning, and it plays as `none`. |
| `at` | integer `{c, r}` | | Map cell. Off the map → warning, skipped. |
| `trigger` | `stage_start` \| `round_start` \| `turn_start` \| `unit_enters` \| `unit_ends_turn_on` \| `event` | | `unit_enters` / `unit_ends_turn_on` mean a unit enters, or ends its turn on, `at` |
| `side` | `any` \| `player` \| `rival` \| `<sideId>` | `any` | Whose turn, or which unit, counts. An unknown side is a warning and never fires. |
| `every` | int ≥ 1 | 1 | Fire on every n-th qualifying trigger |
| `from_round` | int ≥ 1 | 1 | Not before this round |
| `event` | stage event id | | Required iff `trigger: "event"`. Unknown → warning, never fires. |
| `repeat` | `once` \| `always` \| int ≥ 1 | `once` | How many times it can fire |
| `enabled` | bool | `true` | Off = kept, never fires |

- **Resolution:** through the **TILE pipe at `at`**, or the **UNIT pipe for the unit that triggered it** (`unit_enters`, `unit_ends_turn_on`).
- **Closure:** the named effect documents and their pictures (§7.2 steps 5a/5b), for selected stages.
- **Checks:** all of these are warnings (C4). No field here is hard, except H3 when `effect` names a deleted document that the stage still exports.

**Stage over project, explicitly:**
- **Rules:** for each behaviour, the stage setup if the stage has one, else the project setup. A replacing stage setup **does not inherit** the project setup's answers; its own default answers fall to the catalogue. The editor offers "Copy project setup into this stage" (a `duplicate`) to start from the project values.
- **Loadout:** `stage.loadout ?? project.loadout`. The replacement is whole: no field-by-field merge of roster, size or required.
- **Difficulty:** `{...project.difficulty, ...stage.difficulty}`, field by field.
- **Stage music (00:2x, PROPOSED):** effective battle slot = `{...(project.audio?.music.battle ?? {}), ...stage.audio.music}` when `stage.audio.music` is an object; `null` = silence; absent = inherit `battle` as-is ([audio-format.md](audio-format.md) §3.3).
- **Knob values:** `stage.overrides.setups[behaviourId]` sits above whichever setup won (§7.1).
- **Win rules:** the `win-condition` setup that wins by the rule above. With none, catalogue defaults apply, plus a warning.

**EnemyPool.** Every entry references a unit document by id:
- `{mode:"fixed", entries: [{unitId, at: Sq, facing?}]}`
- `{mode:"weighted", picks: int ≥ 0, allowRepeats: bool, spawns: (Sq & {facing?})[], entries: [{unitId, weight > 0}]}`
- `{mode:"waves", spawns: (Sq & {facing?})[], waves: [{turn: int ≥ 1, entries: [{unitId, count ≥ 1}]}]}`

The match RNG seed is runtime data. Fixed and waves examples:
```json
[
  { "mode": "fixed", "entries": [
    { "unitId": "unit_01JC9D3C4D5E6F7G8H9J0K1M2N", "at": { "c": 3, "r": 0 } },
    { "unitId": "unit_01JC9D2R3S4T5V6W7X8Y9Z0A1B", "at": { "c": 1, "r": 1 } } ] },
  { "mode": "waves", "spawns": [ { "c": 0, "r": 0 }, { "c": 5, "r": 0 } ], "waves": [
    { "turn": 1, "entries": [ { "unitId": "unit_01JC9D2R3S4T5V6W7X8Y9Z0A1B", "count": 2 } ] },
    { "turn": 4, "entries": [ { "unitId": "unit_01JC9D3C4D5E6F7G8H9J0K1M2N", "count": 1 }, { "unitId": "unit_01JC9D2R3S4T5V6W7X8Y9Z0A1B", "count": 1 } ] } ] }
]
```

### 6.6 Loadout (project level, with a stage override)
`Loadout = {roster, size, required}`:
- `roster`: the units the player may pick from
- `size`: how many they bring
- `required`: units every loadout includes

**The player's selection is runtime data**, never stored in the project. It is held by the running game. The shell's `loadoutSelected` is not imported; its `loadoutSlots` becomes `size`.

Checks are all **warnings**, each with a runtime fallback (C4):
- `required ⊄ roster`: required units count as roster members.
- `|required| > size`: the effective size is `|required|`.
- `size > |roster|`: the player brings the whole roster.
- `size > |playerSpawns|` on a selected stage: the extra units are not placed.

### 6.7 Effects (`effects/<id>.json`): effect documents (r5; setup-format §2.10; r7 Effect Designer rulings)
- Each file is a `behaviour-setup` v3 with `behaviourId: "effect"` and id `effect_<ULID>`. It is defined entirely by setup-format; this file only says where it lives and how it travels.
- **Reader slot (r41, D22b).** `readProject` loads each `effects/<name>.json` as kind `behaviour-setup` into `ProjectStore.effects: Record<id, BehaviourSetup>`, beside `setups` (no new kind). A doc there whose `behaviourId` isn't `"effect"` is not loaded and gets `unknownFile` (warning, detail `behaviourId`). `effects/.deleted/**` is skipped: no row, never loaded.
- **Ids (r41, D22).** A new or duplicated doc mints `effect_<ULID>`. A doc already saved as `setup_<ULID>` is accepted for ever and never re-id'd: `legacyEffectId` (info, path). Any other id shape is `badEffectId` (warning, path), still loaded. Neither is ever refused, and nothing is written back. Refs resolve by exact id, never by prefix.
- **Referenced by** each owner's `effect` answer (`"none"`, a BTF builtin id, or an effect id). One effect can serve any number of abilities, and it is stored once.
- **Not rules:** an `effect` setup in `project.rules`, `stage.rules` or `unit.setupIds` is a warning and is ignored.
- **Stage overrides** of an owner's `effect` answer work as for any knob (L2). An effect document itself is not stage-overridable; make a second effect document instead (see Godmode below).

**The Effects list (Editor & UX K-1).**
- **Source:** `index.effects[] {id, name, tags, referencedBy, used}` is derived from the files on read and never stored.
- **Order:** **sorted by `name`** (locale compare, case-insensitive), **then by `id`**, so the order is stable.
- **User ordering:** if it's ever wanted, it's an editor pref (`editor-prefs.json`, §11.3), never project data.
- **No count cap:** the 24-item cap went with `saved_effects`. Only the size meter applies (§10).
- **Duplicate** (`duplicateEffect`) is setup-format §5 applied to an effect document:
  - It copies `answers` (values, sources, `presetRef`) and `orphans`.
  - The copy gets a new `effect_<ULID>` and `rev: 1`.
  - Its **history is fresh**: one `set` op noted `duplicate`.
  - It gets `copiedFrom {setupId, rev, at}`, and `name` = original + `" copy"` (then `" copy 2"`, … if taken).
  - References are not moved: abilities keep pointing at the original.
- **Tags live in the project**, inside the effect document as the `effect.tags` answer.
  - They are not editor-only: spec.ts makes `tags` part of `SkillSpec` (L87), and `describeSkill()` writes them into the English sentence ("Tags: …", L842). So they travel with the document, appear in `describeSetup`, and are written by Render's `toSkillSpec` output.
  - They never change a rule.
  - The editor's search also reads them, from `index.effects[].tags`.

**Pictures (K-2).** An uploaded picture is an ordinary asset (`kind: "sprite"` or `"image"`; a strip plays its first frame until animation lands). The effect references it **by `assetId` inside the step**:
- **Step item field `picture: assetId | null`** (null = use the effect's picture).
- **Effect knob `picture`**, `ref {docs: "asset", builtin: ["none"]}`, default `"none"` = the stock `blade` drawing. This is what the Simple screen's single Picture control writes; a step's `picture` overrides it for that step only.
- Both **shipped in rev 9** (L32): `effect.picture` is `ref {docs: "asset", builtin: ["none"]}`, and `steps[].picture` is item type `asset` (`kinds: sprite, image`). While `picture` names an asset, the editor greys out `blade` (editor-only; no gate needed).
- **Checks:** a `picture` naming an id that isn't in `project.assets` gets `unknownRef` (warning) and draws the stock `blade`. An asset that exists but whose file is missing or wrong is H4, like any art in the closure.
- **Effect size (CoS §15 Q1; catalogue rev 10 `effect.scale_snap`):**
  - **All effect sizes snap to whole zoom steps by default.** That covers stock shapes (including `drawBlade()`), `scale`, `steps[].scale_from/scale_to`, and uploaded pictures (`effect.picture`, `steps[].picture`).
  - **`effect.scale_snap`** is a **stored knob**, `whole` (default) or `fractional`. **`fractional` takes effect only while `advancedRender` is on.** With it off, the stored value is **kept but read as `whole`**: the same keep-but-ignore pattern as inactive answers (§3.1 `pixelPerfect`). That's a **warning**, never a block, and nothing is rewritten (R4).
  - The 0.35–2.6 `scale` range stays.
  - **Draw rule (rev 11, Engine Architect; ARCH v0.6 §12):**
    - **Uploaded pictures:** `k = max(1, round(wanted_px / source_px))`, nearest filtering, at k × the integer zoom.
    - **Stock shapes:** each dimension in source px is `max(1, round(tile × factor × shapeScale))`, then the integer zoom. For example, `dh = max(1, round(tile × 0.72 × blade.scale))`.
    - `advancedRender` keeps the fractional path, with the blur warning. The rule is implemented in the engine's draw adapter, not by patching paint.ts `drawBlade()` (L757, fractional today). The engine gap is the Architect's, and it's planned.
  - **`blade` greyed under an uploaded picture (rev 11, Editor & UX):** `disabled_when {knob: "picture", in_docs: "asset"}`, reason "Using your picture", action "Switch back to stock drawing". It's UI-only: the value is kept and stored (keep-but-ignore), and `tint`, `glow`, `glow_size`, `scale` and `spin` still apply to the image.
  - **Camera zoom** snaps to whole steps (§3.1).
  - Rotation of pixel art is still open (effect-designer §6 Q1).

**Deleting (K-3).** Built-in effects (`btf-*`) are presets, not documents, so they **can't be deleted**.
- **Plain delete** of a used document **warns with the count** ("3 abilities use this; they'll show None"). It then deletes the document, and each `effect` answer that named it gets `parentChanged` plus a derived `unknownRef` (runs as `none`).
- **"Delete and switch N abilities to None"** is **one compound action** (setup-format §4 rule 10). It's one `set` op per referencing document (answer → `"none"`, `source: "user"`), plus the deletion, all sharing one `group`, so **one undo entry**.
- **Undo of a delete restores the file.** The writer keeps deleted effect documents in `effects/.deleted/<id>.json` until the next save after the action leaves the undo window. That folder is never in the closure, never shared, and never exported. The reader skips it with no row (r41).

**Effect points (Engine Architect; catalogue rev 10, L33 shipped; CoS §15).** The `tile`/`tiles` step fields (`trace_points`, `bounce_points`, `reel_tie`, `reel_land`, `reel_links`) hold **relative** points:
- Each point is **`{dc, dr}`** (real numbers; spec.ts `pointsOf()` keeps fractions), measured from the step's **`steps[].anchor: "caster" | "target"`** (default **`caster`**). Rev 9's `points_anchor` is retired, with a converter (setup-format r10 §8.2, §10.14).
- **`effect.rotate_with_facing`** (default **`true`**, CoS) turns the points with the anchor unit's facing.
  - **If the anchor unit has no facing, rotation is the identity** (Engine Architect). BTF pieces have no facing and every BTF preset point is `{0, 0}`, so BTF stays **pixel-identical**, and `pointsOf()` is unchanged.
- **Rounding (Engine Architect):** real `dc`/`dr` are for **placing** the effect only. Anything that **hits** a unit or a cell rounds **half-up per axis** to a cell, then goes through the **TILE** or **UNIT** pipe.
- **Booth knobs** are **round-trip metadata only**: the runtime ignores them, and they also serve as the Effect Designer's preview board.
  - **Rev 12 defaults (CoS, reversible):** `booth_cols` 2 (2–8), **`booth_rows` 2** (1–10), **`booth_caster` `{c:0, r:1}`**, **`booth_foe` `{c:1, r:1}`**. r grows **downward** (paint.ts L788, L824), so r = 1 is the bottom row.
    - The reason: on a 2×1 booth, a drop at ×5 starts above the board and gets clipped.
    - spec.ts `defaultSpec()` is still 2×1 (L199–201), and 2×1 stays a fine choice for flat effects. Rev 10–11 defaults were 2×1, `{0,0}`, `{1,0}`.
  - **Moving the default (checked, r11):**
    - An effect that answers the booth knobs **on default** follows the new default at drift (setup-format §8.2 step 6). So its **`toSkillSpec` output changes**: `board` 2×1 → 2×2, `caster`/`foe` one row lower, and every exported absolute point one row lower (`r = booth_caster.r + dr`). The **defaults-moved notice** ("Defaults moved: Booth rows 1 → 2, Caster square c0 r0 → c0 r1, Foe square c1 r0 → c1 r1") covers it.
    - The stored **relative `{dc, dr}` points don't move**, so Preview, Render and the runtime are unchanged. The booth draws the same shape, one row lower.
    - Effects with user booth answers are untouched.
    - Legacy absolute points are never converted against this default (setup-format r11 §8.2 `legacy_relative_to`).
- **Map-absolute cells exist only in stage-authored effects** (`stage.placedEffects`, §6.5), never in the effect document or the skill spec.
- **Off-board:**
  - **Effect Designer:** checked against `booth_cols × booth_rows` from the booth squares.
  - **At cast time:** the runtime clamps like `pointsOf()` and warns (Preview dev overlay, Render log).
  - **Index:** flags only a point that can't land on any selected map (|dc| ≥ cols or |dr| ≥ rows) as `effectPointOffBoard`.
- **`toSkillSpec` / `fromSkillSpec` round trip, re-checked for rev 10:**
  - **Booth → document:** booth cells `{c, r}` become `anchor: caster` and `dc = c − S.caster.c`, `dr = r − S.caster.r`, where S is **the imported spec's own** `caster` (never the catalogue default). `booth_*` take spec.ts `board`, `caster` and `foe` (as `user` answers when they differ from the default).
  - **Document → booth:** `c = A.c + dc`, `r = A.r + dr`, where A = `booth_caster` (anchor caster) or `booth_foe` (anchor target), with no rotation (booth pieces have no facing, so the identity rule applies).
  - **Spec → doc → spec is exact.** The round trip doc → spec → doc is exact through **`fromSkillSpec(spec, base)`**: importing over an existing document takes the answers spec.ts can't carry from `base` (`anchor`, `rotate_with_facing`, `scale_snap`, `picture`), and re-measures points from `base`'s anchors.
  - The **only lossy case** is a point outside the booth range (−1…cols+1). That gets a `boothClamp` notice on export, never a silent change.

**Over-cap steps (K-4).** spec.ts `normalize()` keeps `frames.slice(0, 6)` (L336), and `withFrames()` does the same (L604). So:
- Steps 7 and up are **kept** (R4) but **inactive**.
- **Preview and Render both play only the first 6.** Render's `toSkillSpec` output contains only those 6, so the two never differ ("Preview equals Render").
- The editor warns (`overCap`: "Steps 7+ are saved but won't play"). Save doesn't block. Assets reached only through steps 7+ are not in the closure.
- **r19 (Effects v2; ACCEPTED r20, CEO 2026-11-12 14:56; setup-format r17 §2.10.1.1):**
  - Once the **v2 effects player** ships (one player for Preview and Render, EA plan §13.8), the cap becomes **12**: steps 13+ are kept and inactive, with `overCap` reading "Steps 13+ are saved but won't play".
  - "Preview equals Render" holds because both call the same player.
  - The booth export (`toSkillSpec`) still keeps 6.
- **Hard ceiling (r25; EA H4, step 25):** an effect block may hold at most **64 steps**. Beyond that, `readFxOrder` refuses the block with `fxTooManyFrames` (also `fxTooLarge` over the H2 bytes limit and `fxTooDeep` for over-deep nesting). It is **never truncated**. This is a hostile-file guard, far above the play cap (12), so a real project never meets it: the editor stops adding steps at 64 (the "add step" control disables, no prompt), so a document saved by TileEngine can always be read back. The file is kept untouched either way.
- **Flash risk (r19; ACCEPTED r20; derived, never stored; setup-format §2.10.1.6):**
  - `index.effects[]` gains **`flashRisk?: FlashCheck`**, the shared `te-flash@1` detector run on the document.
  - The project index gains **`flashRisk`**, the OR over the effects in the §7.2 5a closure, with `effectIds[]` and the union of `reasons`.
  - Render writes the project result into the manifest as **`flashRisk {reasons, effectIds, detector}`** (absent when clear). That's output only, recomputed on every Render and never read back as project truth. The exported game uses it for the first-launch warning (CEO E1, DECIDED 14:56).
  - **r21 (ACCEPTED; setup-format r20 §2.10.2.10):** `detector` may be **`te-flash@2`**, the Feel-aware rules (circle flashes, rings, blanks, hit-white, smear, shine). @2 gives exactly @1's result on @1 documents, and **`te-flash@1` stays frozen** (never changed, id never reused). Because the value is derived and never stored as project truth, nothing is migrated: the next read or Render simply uses @2. Its extra inputs are numbers the project already holds: tile px at default zoom (`settings.tileSize`, `map.tile`) and unit sprite boxes from asset meta.
- **r35 (CN-014/CN-015, step 33; setup-format r23 §2.10.3):**
  - The 64 hard ceiling now covers **picture strips** too, with the **same code**: `fxTooManyFrames` refuses the block when it holds more than 64 steps or plays a picture strip of more than 64 frames. The detail names the subject: `{subject: "steps" | "strip", count, limit: 64, assetId?}`. Refused, never truncated; the effect plays as `"none"`; files kept untouched. Separate from `motionTooLarge` (CN-012).
  - `flashRisk.detector` may be **`te-flash@3`** (@2 + light pops of ≥ 25% coverage, setup-format §2.10.3.2). `te-flash@2` and `@1` stay frozen. Derived, so nothing migrates.
  - New effect fields (sync, depth, light, ramp colour, pixel size, outline, shake, squash) live only in setup-format §2.10.3; clip `events` / `points` in §6.2. All absent = today's draw list, byte-identical.
- **r36 (CN-017 particles, step 33b-3; setup-format r24 §2.10.3.5):** the existing r17 `particles` kind is the format source. Fields (optional, absent = today's behaviour): `particle_motion` (`"burst"` / `"attract"` / `"spiral-in"` / `"rise"`, default `"burst"`; unknown plays as `"burst"` with `outOfRange`); `particle_count` (int 0–48 per step, default 12, step 1; out of range clamps with `outOfRange`); **48 per effect** summed across all `particles` steps — over that, later steps are cut down at load in step order and **`fxParticlesOverCap` {count, limit: 48}** fires once; 32 is an editor note only, never a format cap or warning; `particle_life_ms` (200–3000, default 800; alias `particle_life`); `particle_pull` (per-mille 0–2000, default 1000, UI 0–2 step 0.1; only read by attract / spiral-in, ignored silently otherwise). Reuse `anchor`, `jitter`, `start_spread`, `size_spread`, `picture`. The old impact / sparks / `impact_radius` burst is unchanged. Runtime-only (not fields): one shared on-screen pool of 96, oldest dropped first (QA's 128 ceiling cannot be reached); positions are clock-based from a derived seeded stream, never stored; `reduce_motion` skips particle motion (start/end stills). No core-types change (`61fad786`).
- **r37 (D1; setup-format r27):** **`pixel_scale`** (setup-format §2.10.3.2, the only home): `pixel_scale` absent or `null` = today's `k` rule; `"match-sprite"` = the anchor unit's sprite pixel size; a JSON integer 1–6 = that pixel size; the strings `"1"`–`"6"` are read as aliases of the integers and rewritten to integers on edit (M6); anything else (0, 7, 2.5, other strings) warns once (`outOfRange` for a number, the unknown-option warning for a string, per M5) and plays as the `k` rule. Absent/`null` and `"match-sprite"` are distinct. **Step ids** are never reused in a document, even after a delete (setup-format §2.10, M4). **Rule N** never overwrites values that came from a preset (setup-format §2.10.3, M3). Basic `tint_ramp` / `light_ramp` may also name `fire`, `frost`, `holy`, `venom` (§6.2.5 `ramps`).

**Save & use (K-5)** = `createEffect` (+ any `set` ops) in the new document, and the owner's `effect` answer → the new id. That's **one compound action**, with one `group` and one undo entry (setup-format §4 rule 10).

**Godmode (K-6).** The Preview Godmode **Effect** section can save the effect's `steps`, `tint`, `cue_name` / `cue_at` and timing (`connect`, step `seconds`) fields, and any other `effect` answer.
- **Scope: All stages only**, written into the effect document, the same as r5. An effect is one shared document with no per-stage layer. A "this stage" scope would either write into a shared document (wrong) or silently fork it (two sources).
- Per-stage tuning is a separate, explicit button: **"Fork for this stage"**. It's one compound action:
  1. Duplicate the effect, with the Godmode values applied in the copy.
  2. Write an **L2 stage override** of the owner's `effect` answer → the copy.
  3. Use one `group` and one undo entry.
- This reuses the existing L2 layer, so there's no new scope.

- **Index:** unreferenced effect documents are info ("unused effect").
- **Closure (K-2):** §7.2 step 5a walks **active owners on selected stages → their resolved `effect` answers → effect documents**, then step 5b walks **those documents' `picture` assets** (effect knob and the first 6 steps). **An unused effect is not exported**, and neither are its pictures. **Presentation only:** no effect value changes a rule, so an effect never makes a stage unplayable except through `invalidValue`.

### 6.8 Decks (`decks/<id>.json`, `deck` v1): **CoS-approved, PROPOSED pending build** (r13; r14: deck ref shipped, empty deck ruled)
**Owner ruling, approved by the CoS (2026-11-09):** deck composition (how many copies of each card, per subclass) is **project data, not a behaviour**. It's content, like units. Nothing equivalent existed before:
- `hand-and-draw.deck_size` is one total, not a composition.
- Built-in setups' `builtin.deck` is a provenance label.
- So this is a new kind, not a reuse. It is **new**, so it has **no migration** (absent folder = no decks).

| Field | Type | Rule |
|---|---|---|
| `kind`, `formatVersion` | `"deck"`, `1` | |
| `id`, `rev`, `name` | `deck_<ULID>`, int ≥ 1, string | As other documents |
| `entries` | `{cardId: string, copies: int ≥ 0}[]` | One row per card. `copies: 0` keeps a card listed but out of the deck. A duplicate `cardId` is a warning, and its copies are summed. A non-integer or negative `copies` is a warning, and it reads as 0. |
| `subclass?` | string id | Which subclass this deck is for (e.g. a BTF subclass). Absent = any. Free id in v1. |
| `openingFront?` | `unitId[]` (TS `UnitId[]`), exactly 5, west to east | r14 (CEO ruling; catalogue rev 17 L44 reads `deck.openingFront`). The bot's front-rank shape when `opening_row` is `front`. Absent = none (below). |

- **What `cardId` names is PROPOSED:** an ability-owner setup id whose group plays as a card (setup-format §2.9.5). An unknown id is an `unknownRef` warning, and that row is skipped. The CoS/CEO and build may change this.
- **Behaviours reference decks; they never hold the counts.** **`hand-and-draw.deck`** (rev 14, L38) is a nullable `ref {docs: "deck"}`, default `null`. An unknown id is `unknownRef` (warning), and it reads as `null`.
  - **The pile size is derived** (Σ `copies`). `deck_size` is retired by a `derive` tombstone. Its old answer is **kept inactive** in `orphans` (visible, read for the notice `deckSizeDerived`, ignored by runtime), and it's **never wiped** (setup-format r14 §8.2, L39).
- **No deck chosen (`deck: null`), RULED by the Engine Architect (r14):**
  - It applies **only to a card-hand group**. **Action-menu groups have no pile**, so `deck` is irrelevant there.
  - The pile is **one copy of each ability in the group**. The warning **`deckMissing`** fires, and the **wizard prompts** for a deck.
  - **The derived pile is runtime-only and never written into the project. The user's `null` stays `null`** (one source of truth: no generated deck document, no filled-in answer).
- **`openingFront?` (r14 in place; CEO ruling 2026-11-09 via the CoS: the bot's opening formation is the user's choice).** It's an optional list of **exactly five unit ids, west to east**: the bot's front-rank shape when `unit-roster.opening_row` is **`front`**, labelled "Five on the front rank (deck shape)" (setup-format §12.4h/§12.4i; L44 shipped across catalogue rev 16 and 17).
  - **It reuses the existing unit reference**: a `unitId` (`units/<id>.json`), as in `neutrals[].unitId`, enemy-pool entries and `loadout.roster`. No new reference type is added.
  - **No existing field does this.** `entries` holds card copies, `subclass` is a label, and stage placements are per stage, not per deck.
  - **Which deck:** the deck the bot's side plays (its effective `hand-and-draw.deck`).
  - **Fallback (warn, never block):** with `opening_row: front` and no deck, no `openingFront`, or a malformed one (not an array, or not exactly 5 entries), the bot opens **`back`**. The warning **`openingShapeMissing`** fires **once per deck** (once in total when there's no deck).
    - A wrong length is part of that warning, never one of H1–H6.
    - An id that isn't a unit is **`unknownRef`** (warning), and that slot stays empty. The other four are placed.
  - **`back` and `second` ignore it** (kept, R4).
  - **No migration:** absent by default (`deck` stays v1).

  Example from the BTF docs. The class-to-id mapping isn't in this doc's examples, so these unit ids are **placeholders** (A = Archer, M = Mage, C = Cleric, W = Warrior). Black Angels (Raphael) is A, M, C, C, W, and Terrain (Ezekiel) is W, W, W, M, M:
```json
{
 "decks/deck_01JCD0BLACKANGELS0000000001.json": {
  "kind": "deck", "formatVersion": 1, "id": "deck_01JCD0BLACKANGELS0000000001", "rev": 1, "name": "Black Angels (Raphael)",
  "entries": [], "subclass": "black-angels",
  "openingFront": ["unit_PLACEHOLDER_ARCHER", "unit_PLACEHOLDER_MAGE", "unit_PLACEHOLDER_CLERIC", "unit_PLACEHOLDER_CLERIC", "unit_PLACEHOLDER_WARRIOR"]
 },
 "decks/deck_01JCD0TERRAIN00000000000001.json": {
  "kind": "deck", "formatVersion": 1, "id": "deck_01JCD0TERRAIN00000000000001", "rev": 1, "name": "Terrain (Ezekiel)",
  "entries": [], "subclass": "terrain",
  "openingFront": ["unit_PLACEHOLDER_WARRIOR", "unit_PLACEHOLDER_WARRIOR", "unit_PLACEHOLDER_WARRIOR", "unit_PLACEHOLDER_MAGE", "unit_PLACEHOLDER_MAGE"]
 }
}
```
- **Closure (§7.2 step 5c):** the decks named by a deck ref of a setup in the closure, and the card setups their entries name with `copies > 0`.
- **Undo, history and checks** work as for other documents. A deck no setup references is info ("unused").
### 6.9 Save documents (`save` v1): SimSnapshot (r14 in place; **PROPOSED, not v1-blocking**; MODES-v2 idle RPG, "Offline catch-up contract", B4)
A **separate document kind** for a running simulation's snapshot, used by idle offline catch-up (and later any mode's suspend/resume).
- **It's player data, not project data.** It lives in the host's player SaveStore (ARCH §5), **outside `<name>.tileproj/`**.
  - It's **never in the project export closure** (§7.2), and it **never edits project data**. Loading one changes only runtime state.
  - The project only declares the cap (`settings.offlineCapMs`, §3.1).

| Field | Type | Rule |
|---|---|---|
| `kind`, `formatVersion` | `"save"`, `1` | Its own migration chain, `migrations/save/` (§12). **r23:** older and the chain can't bring it up = `saveFormatOlder` (§6.9.1 codes apply to `save` too, as warnings; kept, never deleted). **A file newer than the engine is never loaded, kept untouched and never deleted:** the warning `saveFormatNewer` shows it read-only, and the player may start fresh in a new slot, never a crash ([sync-format.md](sync-format.md) §2.3). |
| `header` | `{projectHash: string, engineVersion: string, projectId: string, savedAt: string}` | `projectHash` and `engineVersion` are the same values as the command-log header (§6.5). **r23:** TS home core-types **`SaveHeader`** (CN-009), shared by `save` and `match-save` (§6.9.1). **A `projectHash` mismatch (r14, Engine Architect): resume, with the warning `saveProjectMismatch`. A save is never deleted.** The choices are **Resume** (default) or **Start fresh**, which keeps the old save as a backup (`<saveId>.backup-<savedAt>`). On resume, every entry that references an id missing from the running project (a `unitId`, `side`, phase key, or path/deck id inside `state`) is **dropped from the runtime state, each with its own warning `saveRefDropped`** naming the entry and the id. Nothing is silent, and the stored save file is unchanged until the next write. |
| `clockMs` | int ≥ 0 | The sim clock (one clock, fixed-step `advance`). A non-integer is refused as corrupt. **Sim-owned fields are integers** (`clockMs`, `logSeq`, all SimSnapshot timing, and the numbers inside `rngState`). Rules-owned `state`/`phases` may hold finite floats; NaN, ±Infinity and -0 are rejected at write with `invalidValue` (sync-format r2 §2.4). |
| `rngState` | string | Opaque `core/rng` state (seed plus position), owned by the Engine Architect. |
| `units` | `{instanceId, unitId, side: sideId, at: {c, r}, facing: "N"\|"E"\|"S"\|"W"\|null, slot?: int, state: object}[]` | Live units. **Occupancy is derived from `units[].at`** (and `slot` under `laneSlots`), so it isn't stored twice. `state` is the rules' per-unit runtime values. |
| `phases` | `Record<string, object>` | Phase snapshots keyed by phase id (prefixed: `idle.*`, `td.*`, STATES), each phase's own data |
| `logSeq` | int ≥ 0 | The last command-log sequence number applied, so a replay continues from it. **Same type and semantics as core-types `LogSeq`** (r14): entries are numbered from 1 in append order, `logSeq` is the `seq` of the last applied entry (= the last `actionLogged.seq`), and `0` means none applied. |
| `wallLeftAt` | string (ISO) \| null | Wall-clock time at background (MODES-v2 step 1). The catch-up uses `min(now − wallLeftAt, offlineCapMs)`. |

- **Catch-up** (MODES-v2, option A, preferred): `elapsed = min(now − wallLeftAt, settings.offlineCapMs)`, then `advance(fixedDt)` for `elapsed / fixedDt` steps from `clockMs` and `rngState`. Closed-form catch-up (option B) is a rules optimisation, not format.
- **The format version and migrations are separate from the project's.** A project migration never touches saves, and a save migration never touches the project.
- **Optional cloud sync (PROPOSED, 22:5x):** see **[sync-format.md](sync-format.md)** r4 (the bring-your-own-backend Online Kit; the studio server stores no saves). It wraps a save unchanged in a `save-envelope` (ULID ids, `rev`/`parentRev` compare-and-swap, `contentHash` over JCS), keeps both sides on conflict, and adds a separate `.tesave` export. The rules here are unchanged: saves stay outside the project export, and a save newer than the engine is kept byte-for-byte (read-only) rather than overwritten when the player starts fresh. With sync, it's held, never re-uploaded modified. Sync is switched on per project by `settings.online` (§3.1).


#### 6.9.1 Match saves (`match-save` v1): the log is the truth (r22; **DECIDED**, Engine Architect 2026-11-12 21:12, CN-009; step 24, H3)
A **separate document kind** for a match the player saves and later continues. It holds the command log and the snapshot at the save point. **The log is the truth:** a load replays the log and refuses a snapshot the replay doesn't reproduce.
- **Player data, not project data,** exactly like `save` v1: it lives in the host's player SaveStore, **outside `<name>.tileproj/`**, is **never in the export closure** (§7.2) and **never edits project data**.
- **Not a duplicate of `save` v1.** `save` v1 is **snapshot-truth** (idle catch-up and suspend/resume continue from `clockMs` / `rngState` / `units` / `phases`). `match-save` v1 is **log-truth** (continue by replaying `log`). Different truths need different kinds. Neither converts into the other, and **every shared part keeps one home:** the `header` object (§6.9, reused unchanged), the command-log header and `LogSeq` (§6.5, core-types), and the envelope and slot (sync-format §2.1, `bodyKind: "match-save"`).

| Field | Type | Rule |
|---|---|---|
| `kind`, `formatVersion` | `"match-save"`, `1` | Its own version, separate from the project's and from `save` v1's. |
| `header` | `{projectHash: string, engineVersion: string, projectId: string, savedAt: string}` | **The §6.9 `header`, reused unchanged** (same names, types and meaning). `engineVersion` and `projectHash` are not repeated at the top level. The command-log header inside `log` carries the same `engineVersion` and `projectHash`; a file where the two disagree is refused as edited (it is not a mismatch that can be resumed). |
| `log` | string | The command log as text (header `{seed, formatVersion, engineVersion, projectHash}` plus the entries, numbered from 1; the Engine Architect's command-log shape, §6.5). Read under the match limits before any replay. **Never trimmed, compacted or rewritten** to save space. |
| `snapshot` | SimSnapshot (engine-owned) | The state at the save point. **A check value, not truth:** if the replay doesn't reproduce it exactly, the load is refused. core-types types it `unknown`, so core-types stays a leaf. |

**Load order and refusals (F2; r23 wording).** `loadSave` checks, in order: `kind`, `formatVersion` (and the migration hook), the `header` fields, the log (within limits), the log header against the save header, the `header` against the running engine and project, the replay, then the snapshot. **Version and mismatch refusals are typed results, never a throw:** `{ok: false, code, needsMigration}` (the codes below). `replay` is the lower-level door and never refuses a mismatch itself; `loadSave` decides. The stored file is **never changed or deleted** by any refusal.

| `code` | Level | When | What happens |
|---|---|---|---|
| `saveFormatNewer` | warning | `formatVersion` newer than this engine knows | Read-only and held, kept byte-for-byte, never migrated down (§6.9, sync-format §2.3). The player may start fresh in a new slot. |
| `saveFormatOlder` (**new**, r23) | warning | `formatVersion` older than this engine and the `migrations/save/` hook can't bring it up (`needsMigration: true`) | Kept byte-for-byte, never patched, and shown read-only; not loaded. The player may start fresh in a new slot. Can't happen at v1 (nothing is older). |
| `saveMigrationFailed` (**new**, r24) | warning | the `migrations/save/` hook threw, or returned something hostile, still older than this engine, or not plain data (`needsMigration: true`) | The file is **always kept untouched** (no partial result is written) and **shown read-only**; not loaded. The player may start fresh in a new slot. |
| `saveTooLarge` / `saveTooDeep` / `saveSnapshotTickInvalid` (**new**, r25, EA H4) | warning | over the H2 bytes limit (2 MiB default, 16 MiB ceiling, checked before parsing) / nested too deep / on the opted-in mismatch resume path (`allowProjectMismatch` or `allowEngineMismatch`), `snapshot.tick` is not an integer ≥ 0 (null, negative, fractional, a string or missing; never treated as 0) | The file is **always kept untouched** and not loaded. `saveTooLarge` clears only if the host raises `limits.bytes`; it can only happen with a maxed log, which is already over the sync cap (`saveTooLargeToSync`, a separate code). |
| `saveEngineMismatch` (**new**, r22) | warning | `header.engineVersion` ≠ the running engine | Not resumed unless the host opts in (below). |
| `saveProjectMismatch` (r14 code, reused) | warning | `header.projectHash` ≠ the running project | Not resumed unless the host opts in (below). |

- `needsMigration` is `true` only with `saveFormatOlder` and `saveMigrationFailed` (r24). On every other refusal, and at v1, it is `false`.
- A file that isn't a match save, a bad or out-of-order log entry, a log header that disagrees with the save header, an edited seed, a log over the limits, or a snapshot the replay doesn't reproduce is **refused by name** (an error carrying the reason, not a typed code; r23). The file is kept, never deleted.
- **Not in scope:** signing saves. A rewritten but legal save (a whole other game played through the same rules) loads. Catching that belongs to the host and the online step.

**Host opt-in resume (keeps r14).** On `saveEngineMismatch` or `saveProjectMismatch` the choices are **Resume** or **Start fresh**, as in §6.9. Resume happens **only when the host passes an explicit opt-in** (never automatically). The log then replays **through the normal rules** on the running engine and project, **up to the snapshot's tick** (r23), and any entry that is now illegal is refused as usual, with the usual notice. **The snapshot is never trusted across a mismatch:** only its tick is read, and the resumed state is whatever the replay produces. A snapshot with no valid tick is refused by name. The load returns the `saveEngineMismatch` / `saveProjectMismatch` notices with the resumed world. The two opt-ins are separate (engine, project): a save with both mismatches needs both. Start fresh keeps the old file as a backup (`<saveId>.backup-<savedAt>`). **Nothing is ever deleted.** *Unlike `save` v1, an `engineVersion` difference is not just a notice here (sync-format §2.3), because replay depends on the engine.*

**Versions and migrations (F3).** Older files go through the save-side hook **`migrations/save/`**, with the `match-save` steps kept apart from the `save` v1 steps. The chain is **empty at v1**, and the hook is tested in step 24. A migrated file is written as a new local rev only on the next write (sync-format §2.2), and the original is never edited in place. Newer files: `saveFormatNewer`, read-only (above).

**Size (F4).** Locally there is no format cap beyond the match limits. **Sync:** the kit's **1 MiB per save envelope** (canonical JCS bytes, sync-format §5.5) applies unchanged. `saveNearSyncLimit` fires at 75%. Over the cap, the match save **stays local with `saveTooLargeToSync`**, never truncated, and the log is never shortened to fit. The step-24 file gives the largest log against the 1 MiB envelope.

**TypeScript (r23: final, CN-009 r2 SIGNED; core-types `61fad786`).** `SaveHeader = { readonly projectHash: string; readonly engineVersion: string; readonly projectId: string; readonly savedAt: string }` (the §6.9 `header`, one home) and `MatchSave = { readonly kind: "match-save"; readonly formatVersion: 1; readonly header: SaveHeader; readonly log: string; readonly snapshot: unknown }`. Both MAY-MOVE. The f6c78db draft (flat fields, sha afb69587) was never adopted. *The sync sketch's envelope header type is `SaveEnvelopeHeader` (sync-format r13), so `SaveHeader` has one meaning.*

Example (shortened; `log` and `snapshot` are illustrative):
```json
{"kind": "match-save", "formatVersion": 1, "header": {"projectHash": "sha256:9f2c", "engineVersion": "0.0.9", "projectId": "project_01JCF0P9Q8R7S6T5V4W3X2Y1Z0", "savedAt": "2026-11-12T21:12:00Z"}, "log": "{\"header\":{\"seed\":42,\"formatVersion\":1,\"engineVersion\":\"0.0.9\",\"projectHash\":\"sha256:9f2c\"},\"entries\":[]}", "snapshot": {"clockMs": 0}}
```

## 7. Values at runtime, the export closure and Preview

### 7.1 Value layering (P3, C2, C3). Each layer has exactly one home.
| Layer, lowest first | Stored in | Applies to |
|---|---|---|
| L0 catalogue default | `catalogue/slice.json` | every knob |
| L1 rules setup answer (the "army" layer for unit stats) | `setups/<id>.json`, where the setup is the stage's `rules` entry for that behaviour, else the `project.rules` entry | every knob |
| L2 stage knob override | `stage.overrides.setups[behaviourId][knobId]` | every knob, this stage |
| L3 unit stat | `unit.stats[statKnobId]` | per-unit stat knobs |
| L4 stage unit override | `stage.overrides.units[unitId][statKnobId]` | per-unit stat knobs, this stage |
| **L5 difficulty multiplier** | `project.difficulty`, field-overridden by `stage.difficulty` | the HP stat and dealt damage of the units in `appliesTo`, this stage |

- **Resolution:** a unit stat on a stage is `L4 ?? L3 ?? L2 ?? L1`. Any other knob is `L2 ?? L1`. L1 is the setup's effective value, which already falls back to L0. Inactive knobs resolve to nothing.
- **L5 is applied last, after all the overrides (Q9),** and is a multiplier, not a value, so it never hides a lower layer:
  - **HP:** `max(1, round(resolvedHp × hp))` for units in `appliesTo` (`enemies` = enemy-pool units; `player` = loadout units; `all` adds neutrals). The editor shows the base value and "×1.5 → 14" in the chip.
  - **Damage:** the runtime multiplies the final damage *dealt by* affected units, after damage resolution, by `damage` (rounded half up, min 0). No damage knob is rewritten.
  - Defaults are 1.0 and 1.0, so with no change it is a no-op.
- Layer chips: Default, Army/Project, Stage rules, Stage, Unit, Unit on this stage, plus a "Difficulty ×" badge.

**Godmode save-back (C2: "this stage" or "all stages").** Each save writes exactly one layer, as one Op (`note:"preview"`) in that document:

| Target | All stages | This stage |
|---|---|---|
| An effect answer (r7) | The effect document | **No this-stage scope.** "Fork for this stage" duplicates it, plus an L2 override of the owner's `effect` answer (§6.7) |
| A setup or army knob | L1. If the stage replaces this behaviour, write to the stage's setup; otherwise to the project setup, via `saveBackFromPreview`. | L2: `stage.overrides.setups[behaviourId]` |
| One unit's stat | L3: `unit.stats` | L4: `stage.overrides.units` |
| Difficulty | `project.difficulty` | `stage.difficulty` |

When the stage replaces the behaviour, "All stages" offers a second choice: "write to the project setup (affects other stages)" or "write to this stage's rules". The default is this stage's rules, so the edit lands where the stage reads it.

### 7.2 Export closure (P2)
1. `stages` = `project.stages` minus `render.excludedStages`, in order.
2. `units` = for each of those stages, `(stage.loadout ?? project.loadout).roster` ∪ its enemy pool units ∪ its `neutrals`.
3. `setups` = `project.rules` ∪ each stage's `rules` (minus project setups replaced on **every** selected stage) ∪ the units' `setupIds` ∪ (r13) the **`modifiers[].setupId`** of those setups (setup-format §2.11) ∪ (r15, DECIDED r40) each selected stage's **`neutrals[].setupIds`** (NPC roles, §6.5).
4. **`behaviours`** = the setups' behaviours that are **active on at least one selected stage**. Activity uses each behaviour's gate on that stage's resolved values (§5, setup-format §2.6).
   - Example (rev 6 and 7): `shortcut = custom`, `basic_style = unit-action-menu`, `spells_style = card-hand` (BTF). "Uses card hand" and "uses menu" are both true, so `hand-and-draw`, `reveal-hand` and `reveal-intent` are all exported, and both presentation modules ship.
   - With `shortcut = all-menu`, a `hand-and-draw` setup in `rules` stays in the store but is **not exported**, and neither is its card-hand presentation code (r14: there's no `present-card-hand` behaviour; the card-hand draw is `hand-and-draw`).
   - A `custom_groups` item with `style: card-hand` also makes "uses card hand" true (rev 7 `some` leaf).
   - **Map rules (r6; r7: read from the catalogue's `closure: "always"` flag, not hard-coded):** `terrain` is always in `behaviours` (tile meanings and the wall LOS/shot knobs; with no setup, its catalogue default). Edge blocking is core grid code and always ships. **`barrier-line` is in the closure only when a `barrier-line` setup is** (step 3), never because a map has edges.
5. `assets` (K7) = for the selected stages' maps, every `layers[].tileset`, every `background.layers[].assetId` (r7), every `objects[].assetId` (r9), and every `wallLook.assetId` / `logic.edges[].look.assetId` (r8), ∪ the units' `sprite`. **A paged image contributes its `pages[]` and not its parent.** Assets referenced only by unselected stages are left out. **`derivedFrom` is not a reference:** `role:"source"` originals are never pulled in (§6.2.1).
5a. **`effects`** = the effect documents named by the resolved `effect` answer of an active owner on a selected stage. BTF builtin ids resolve from the slice's `effect` presets. Render writes each as resolved values (`toSkillSpec`-shaped data), never as a document. **r19 (ACCEPTED r20):** with the v2 player, Render writes the v2 player input instead (setup-format §2.10.1.1; core-types CN-E1). That covers up to 12 steps and the v2 fields. The booth export keeps `toSkillSpec`.
5b. **Effect pictures (r7):** every `picture` asset of those effect documents (the effect knob and the first 6 steps' fields), through the same paged-image rule as step 5. They go in the stage pack of the stage whose owner uses the effect. **r19 (ACCEPTED r20):**
   - With the v2 player, this covers the first **12** steps.
   - Stock picture ids (`rune-circle`, `orbit-rings`, `spark`, `ember`, `smoke`; setup-format §2.10.1.4) ship with the effects player. They add a credit row only, never an `assets/` file.
5c. **`decks`** (r13, PROPOSED, §6.8): the decks named by a deck ref of a setup in the closure, plus the card setups their entries name with `copies > 0`.
5d. **Achievements and game settings** (23:0x, PROPOSED): `achievements/achievements.json`, if present, is copied into the Render bundle (profile-format §2.1). `project.gameSettings` travels with the manifest. Neither carries per-player values.
5e. **`audio`** (23:1x / 00:2x, PROPOSED): binding sounds, `project.audio.music` title/menu/battle, and each selected stage's effective music (`stage.audio?.music` over `battle`), defined in [audio-format.md](audio-format.md) §4.4.
6. `extensions` = the namespaces whose module is installed in the Render toolchain (§9).

**Hard errors** (the only things that stop Play or Render; see §13): H1–H6.

Sprites are resolved by the clip fallback order in §7.3.

**Render output** is a build artifact, never part of the store:
- resolved values per stage (with inactive knobs left out)
- resolved ability groups and `event_map` entries (setup-format §2.8)
- the behaviour modules, plus the presentation modules some group uses
- **the renderer's non-integer draw path only when `advancedRender` is true** and something actually uses it (effective `pixelPerfect: false`, or a selected stage's map background with `fit` `cover`/`stretch`). Otherwise Render ships only the integer path, and the export audit fails if the non-integer path is in the bundle.
- assets, and one `declare("stage:<stageId>", urls)` pack per stage, listing that stage's layer tilesets, background layers or their pages, and sprites
- `extensions.online` only when its module is present

**Not exported** (originals: **confirmed against the CEO's art answer 4, r7**: they are kept in the project, shared by default and never exported): the editor, presets, history, notes, painter caches, procedural originals of baked assets, slice provenance, the dev overlay, unselected stages, `role:"source"` originals, `derivedFrom` records, unused effect documents, and editor prefs (§11.3). `export.audit.json` sits beside the build; shipping anything outside the closure fails. **r18 (ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1)):** `sprite-recipes/` documents are never exported; under `live` only each used recipe's **paint form** travels in `game.json` params entries. **`code.src` is never exported in any mode** (export-audit **FAIL**, the `secretInBundle` class).

**Player save games inside exported games are out of scope** (§15).

### 7.3 Render: clip fallbacks and generic cues (r6, Engine Architect)
For a unit doing **action** *a* while facing *f*, Render resolves a clip in this order and **stops at the first hit**:

| Step | Tries | Notes |
|---|---|---|
| 1 | The exact action and facing: `a-f` (for `move`, also the bare facing name `f`) | |
| 2 | A **horizontal mirror** of the opposite facing (`left` ↔ `right` only): `a-left` mirrored for `right`, and vice versa | Skipped when the sprite's AssetMeta has `noMirror: true` (default false). `up`/`down` are never mirrored. |
| 3 | The same action facing `down` (`a-down`), then the same action in **any** facing (the bare `a`, then `a-left`, `a-right`, `a-up`, in that order) | |
| 4 | **`move`, `attack` and `hit` fall back to `idle`**, resolved through steps 1–3 | |
| 5 | **`die` falls back to `hit`, then `idle`** (each through steps 1–3), and the runtime adds a **fade-out** | The fade is generic runtime presentation, not a clip |
| 6 | A missing `idle` uses the **first frame of any clip** (clip order in `clips[]`). A sprite with no clips is one static frame, frame 0. | |
| 7 | If nothing is left (no `sprite`, or the asset can't load), a **procedural stand-in token**: a disc in the team colour with the unit name's initial | Also what Preview shows |

**Generic cues.** On top of whatever clip plays, the runtime adds a 2-frame white **hit flash** when a unit takes damage, and a small **attack lunge** toward the target. They are switched by **`unit-roster.clip_cues`** (toggle, default `true`; request **L25**). It is a knob for the same reason as the wall knobs: one home, plus undo, presets, stage overrides and Godmode. It's army-wide and not `per_unit`. Until L25 ships, the reader uses `true`.

**Editor report, warning only.** For every used sprite, the editor lists which steps it needs ("Archer: attack uses idle (step 4); right mirrored from left (step 2)"), as one warning per asset in the Play/Render reports and on the asset row. **Nothing blocks.** Step 7 shows as "no art: stand-in token".

The fallback order is fixed runtime behaviour, not stored data. Changing it is a runtime change, not a format change.

**Preview** uses the same closure. Its selector lists every stage, selected or not.

### 7.4 Render: shipping procedural assets (PL6; ARCH §13.6)
`project.render.proceduralShip: "auto" | "bake" | "live"` (default `"auto"`; ignored when the closure has no procedural asset):
- **`bake`:** Render paints each procedural asset in the closure into a PNG holding only the tile indices used on selected stages (all frames, at paint px; r12: the used-cell sheet of §6.2.2, with `paintScale` in `game.json`), remaps indices in `game.json`, and ships them as ordinary asset files in the per-stage packs. The bundle contains **no** `paint-proc` module (audit).
- **`live`:** Render ships `@te/paint-proc`, only the used recipes (and the pixel font if used), and each asset's canonical params inside `game.json`, plus the **embedded body of each pinned paint style version used** (r10, §6.2.5; never the installed library). The packs list params entries instead of URLs. **r18 (ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1)):** `live` also ships the paint form of each used sprite recipe (no `history`, `name`, `rev`, timestamps, `locked`, `promotedFrom` or `code.src`; with `code.out` + `outHash`); **`bake`** ships one PNG sheet per (sprite asset, resolved team fill), with no paint module and no recipe. A recipe whose `out` is missing or whose `outHash` doesn't match is drawn without its code ops (`codeOutMismatch`).
- **`auto`:** Render computes the exact bake size B and live size L **per project** and ships live if L < B, else bake. Both numbers and the choice go into `export.audit.json`.
- **Always baked, in every mode:** token cells with a system-font initial (`font: {family}`). They are baked on the render machine, and the audit excludes them from the pixel-identity check (ARCH §13.5).
- **Art lock in both modes:** 1× pixels through the integer path, `nearest`. The non-integer path ships only under `advancedRender` (§7.2), the same as for uploads.
- **Credits (PL10):** with `project.render.credits` (default `true`), Render writes `credits/CREDITS.txt` and `credits/licenses.json`, listing only closure assets: builtin copies and uploads from their `credit`, and procedural assets as "Generated by TileEngine". An asset with no `credit` is listed as "credit not provided" (info). **r13:** each line also prints `credit.source` when set, and an **"AI-generated"** note for `aiGenerated: true`, which `licenses.json` carries too (the AI disclosure, §6.2.4).

## 8. Preview notes: `notes/notes.json` (v2)
`{kind:"project-notes", formatVersion:2, rev, notes: Note[]}`. Notes merge as a union by id.

Each note has:
- `id`, `kind` (`bug`/`note`), `status` (`open`/`fixed`/`wontfix`), `text`, `createdAt`, `updatedAt`, `statusAt`
- `capture: {stageId, playMs, turn, projectRev, godmode: [{target: {kind:"setup", setupId} | {kind:"unit", unitId}, knobId, value}]}`
- `anchors: Anchor[]`

Anchors are snapshots. "Dangling" and "changed since" are computed, resolving renamed knobs through the slice's `renamed_from`:
- `{kind:"setup", setupId, setupRev}`
- `{kind:"answer", setupId, knobId, setupRev, answerRev}`
- `{kind:"asset", assetId}`
- `{kind:"stage", stageId}`
- `{kind:"tile", stageId, at}`
- `{kind:"unit", unitId}`

There are no caps on notes (S1). Notes are never exported (P5) and are removed on share (§11).

## 9. Extensions (S2: offline core)
- `project.json.extensions` is optional. **Core defines no network fields.**
- `extensions.online = {module, moduleVersion, config}` is reserved for a user-supplied online or P2P module. It is kept byte-for-byte, never validated beyond being an object, never migrated, and never read by core.
- **Render** includes it only when a module with that id is installed. Other `extensions.<name>` namespaces follow the same rules.
- **Share** strips `extensions.online` unless the user opts in (§11).

## 10. Size: always shown, never blocking (S1, CoS Q8)
**`index.size`** is computed over the export closure on every save:
- `totalBytes`, `fileCount`, and `files[] {path, bytes, kind}` for every file the build will contain from the store: `assets/<id>.<ext>` (pages instead of paged parents) and `game.json` (the resolved data, estimated).
- `byKind {tileset, sprite, image, background, page, audio, data, procedural}`. **`procedural` (PL7):** on save, the estimated cost of the procedural assets in the closure under `render.proceduralShip`: for `auto`, `min(estimated bake, painter constant + used recipes + params)`; for `bake` or `live`, that mode's estimate. Files in `files[]` are marked `estimate: true` (`paint-proc.js` for live, `assets/<id>.png` for bake). Render replaces them with exact numbers.
- **Audio (PROPOSED, [audio-format.md](audio-format.md) §4.3):** each shipped audio asset lists **two** files, `assets/<id>.ogg` (Opus) and `assets/<id>.m4a` (AAC), as `variants` under its one asset row. `byKind.audio` counts both. Live procedural audio counts in `byKind.procedural`.
- `meters[] {key, value, soft, strong, level: "ok" | "warn" | "strong"}` and `warnings[]`.

**Render** recomputes everything exactly over the real output, which adds code, `index.html` and the compressed packages, and writes it into `export.audit.json`.

**The size is always shown** in the editor and in Render. **Nothing ever blocks on size or count** (S1, C4).

**General meter (CoS ruling, on-disk bytes):** warns above **50 MB** total, and warns more strongly above **150 MB**. It applies to every target.

**Per-target meters** apply **only to the targets in `render.targets`**, alongside the general meter. The figures are from **`docs/target-size-limits.md`** (Engine Architect, checked 2026-11-09). Each is about 90% of a hard limit, or just under a soft user prompt:

| Target (`render.targets`) | Meter key | Warn | Strong warn | Platform limit | Source (per target-size-limits.md) |
|---|---|---|---|---|---|
| `browser` (itch.io HTML5) | `itch.html5.extracted_total` | 450 MB | 480 MB | 500 MB extracted (hard; raisable on request) | https://itch.io/docs/creators/html5 |
| | `itch.html5.single_file` (max of `files[].bytes`) | 180 MB | 190 MB | 200 MB per file | same |
| | `itch.html5.file_count` | 900 | 950 | 1,000 files | same |
| | `itch.html5.path_length` | 200 chars | 230 chars | **240 chars**: a path over 240 is flagged as over the limit | same |
| | `itch.html5.case_collision` | any two paths equal when lowercased | — | the server is case-sensitive; wrong case returns 403 | same |
| | `itch.html5.root_index` | `index.html` missing at the zip root (Render output check) | — | the ZIP must contain `index.html` | same |
| `android` (Google Play AAB) | `play.base_module` | 180 MB (mobile-data dialog, > 200 MB) | 450 MB | 500 MB base module, compressed | https://support.google.com/googleplay/android-developer/answer/9859372 , https://developer.android.com/guide/app-bundle/faq |
| `ios` (Apple App Store) | `apple.ota_cellular` | 180 MB | 195 MB | 200 MB over-the-air (an ASC warning, not a reject) | https://developer.apple.com/help/app-store-connect/manage-builds/view-builds-and-metadata/ |
| | `apple.uncompressed_app` | 3.6 GB | 3.8 GB | 4 GB uncompressed | https://developer.apple.com/help/app-store-connect/reference/app-uploads/maximum-build-file-sizes/ |

Notes:
- The Play and Apple meters are **compressed download size**. On save, `index.size` uses uncompressed bytes as an upper bound (so it can only warn early); Render replaces them with the real package sizes.
- The itch.io compressed upload size is not published, so it has no meter.
- target-size-limits.md flags the stale Play Games page (200 MB base) and prefers 500 MB, as here. It also lists the further Play asset-pack, `__TEXT` and ODR limits. Those meters are added when TileEngine builds use those paths.
- Thresholds are **user-wide editor settings**, not stored in the project, so updating them never changes a project.

**Decoded-memory meter (r5 ruling 7; thresholds r7, Engine Architect).** Phones fail on decoded pixels, not on bytes on disk, so `index.size.decoded` estimates memory:
- `images[] {assetId, w, h, bytes}`, `bytes = w × h × 4` (RGBA8), for every image the closure decodes: files (pages instead of paged parents) **and procedural sheets** (painted or baked, they decode the same).
  - **Procedural sheets (r12, Keeper ruling):** `bytes` = **used cells × paintSize² × 4 × frames_t at paint px**, i.e. `Σ over used (t, variant, mask) of size.w × size.h × 4 × frames_t`. That's the used-cell sheet of §6.2.2, never the theoretical one, which would overcount by orders of magnitude.
  - **Sprite sheets (r18, ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1)):** per sprite asset in the closure, `bytes = F × w × h × 4 × fills` at paint px (`F` = total baked frames after `gen` expansion and facings, `w × h` = recipe `size`, `fills` = distinct resolved team fills on the selected stages, 1 if none), plus `scaledCopies` when `paintScale > 1`. No new `byKind` keys: live recipes count in `byKind.procedural`, baked sheets in `byKind.sprite` (rulings §5).
  - **`scaledCopies {cached, bytes, countedBytes, assets[{assetId, paintScale, bytes}]}`** (r12) is the runtime ×`paintScale` copy of each used cell: `used cells × (size × paintScale)² × 4 × frames_t`, for assets (and bakes) with `paintScale` > 1.
    - **It's counted** in `totalBytes`, `stagePeak` and the thresholds **whenever the engine keeps it cached** (`cached`, the engine constant `PAINT_PROC_CACHES_SCALED` of the painter version the editor ships). The thresholds exist to warn before a device kills the app, so memory the engine really holds must count.
    - **It's labelled as its own line** in the meter: "Scaled ×k copies: N MB (cached)" or "(not cached; 0 MB counted)".
    - **`PAINT_PROC_CACHES_SCALED` is `false` for painter v0.6 (confirmed by the Engine Architect).** Scaled pixels live only in the renderer's chunk cache, which `chunkCacheBytes` already counts. So the line reads 0 (`countedBytes` 0), with **no double count**.
    - A future painter that caches scaled cells declares `true` **and bumps its painter version**. The line then counts with no format change.
- **`totalBytes`**: the project total, summed over the closure.
- **`stagePeak {stageId, bytes}`**: the largest per-stage sum over that stage's `declare("stage:<id>")` pack. This replaces r5's `residentEstimate`, because it's the same number with a clearer name.
- **`chunkCacheBytes`**: the runtime chunk-cache budget for each device class (ARCH §12.3: 96 MB on phones, 256 MB on desktop). It's shown **beside** the decoded number as "decoded + chunk cache = N MB (**estimate**)", with the note "w×h×4 undercounts GPU copies, atlases and audio". **Thresholds compare the decoded bytes only**, which is how the source table defines them.
- **Thresholds:** from **`docs/target-size-limits.md` → "Decoded memory"** (Engine Architect, sources and confidence listed there). They are not duplicated here, and they always **warn / strong-warn, never block**. Meters exist only for the targets in `render.targets`, two per target:

| Meter key | Applies when | Source row (target-size-limits.md) |
|---|---|---|
| `decoded.ios.stage_peak`, `decoded.ios.total` | `ios` targeted | iOS (Capacitor WKWebView) |
| `decoded.android.stage_peak`, `decoded.android.total` | `android` targeted | Android (Capacitor WebView). Warning text: **"may be killed on low-end devices"** |
| `decoded.web_mobile.stage_peak`, `decoded.web_mobile.total` | `browser` targeted and `settings.platform` is `mobile` or `both` (itch.io Mobile Friendly, phone browsers) | Web – mobile browser (same figures as iOS) |
| `decoded.web_desktop.stage_peak`, `decoded.web_desktop.total` | `browser` targeted and `settings.platform` is `pc` or `both` | Web – desktop browser |

- `"unrated"` is retired (r7). An old index is recomputed on load anyway.
- The upload screen shows each image's `w × h × 4` (art-upload §2 "Memory hint").

**Other soft counts** (unchanged): an image over `maxImageSide` or 16,777,216 px with no pages (§6.2, K6), and more than 1000 notes.

## 11. Packages, save, duplicate, share

### 11.1 Module split (C1)
| Package | Path | May do | Must not |
|---|---|---|---|
| **types** (shared) | `packages/project/src/types/` (`setup.ts`, `project.ts`, `catalogue.ts`) | Type declarations and constants (`HARD`) | Contain logic |
| **`@te/project`** (reader; runtime, Preview, Render, editor) | `packages/project/src/read/` | Parse **current-version** documents; `readCatalogue()` normalisation; gate evaluation; `effective`, `check`, `readiness`, `listMissing`; `resolveValue` / layering; `resolvePresentation`; `computeIndex` and `exportClosure` as **pure functions returning values**; `readBundle()` for exported games; `describeSetup` | Write files, run migrations, regenerate the slice, touch history or notes, share |
| **`@te/project-write`** (editor only) | `packages/project-write/src/` | Load-time migrations (`migrations/<kind>/NNN-*.ts`) and slice upgrade/renames; every Op (`editAnswer` … `saveBackGodmode`); `saveProject` (writes docs, **persists** the recomputed index, regenerates the slice); duplicate; `shareProject` (strip-on-share); notes writes; preset library I/O; prototype import | Be imported by the runtime (the export audit fails the build if it appears in a bundle) |

- **Old projects:** the editor loads through the writer, which migrates in memory and hands the reader current-version objects. The reader seeing an old version reports `needsMigration` and does nothing else.
- **Render opens the project through the writer** (`openProject`), so migrations, renames and drift run first, in memory. Render never saves the store back. Only an explicit save in the editor persists the migration. Render then uses the reader's `exportClosure`, `resolveValue` and `checkProject` on the migrated objects, and writes the bundle. The writer package is used by the Render toolchain, but it never enters the game bundle (audit).
- **Exported games:** these never contain project documents, only the Render bundle, so the runtime never needs migrations.

### 11.2 Save, duplicate, share (P5)
- **saveProject(store, expectedRev):** writes changed documents, regenerates the slice and the index, and bumps `rev`. **Saving is never blocked by checks**, only by `staleRev` or `readOnly`.
- **duplicateProject(store, name):** new `project.id` and `copiedFrom`; every file is copied, including notes.
- **shareProject(store, opts) → zip**:
  1. Write the tree without `notes/notes.json` (the receiver gets an empty one) and set `index.notes = {open:0, total:0}`.
  2. Drop `extensions.online` unless `opts.keepOnline`.
  3. Set `history.ops = []` everywhere if `opts.stripHistory` (r18: this covers `sprite-recipes/` history too; no change to the step).
  4. Drop unreferenced embedded preset revs.
  4a. **Keep `role:"source"` originals** (upload originals and, from r7, procedural originals of baked assets) unless `opts.stripSources` (r5, §6.2.1; **decided, CoS 2026-11-09**). Editor prefs and painter caches are never in the tree (§11.3).
  5. Set `copiedFrom` and keep `project.id`.
  6. The source store is **not modified**.

### 11.3 Editor prefs: per-user, never in the project (r5, art-upload ruling 6)
Per-user editor view state lives **outside** the project, so it is never exported, never shared, and never makes a project "changed":

| Platform | Location |
|---|---|
| Web | **OPFS** `tileengine/editor-prefs.json` (beside `tileengine/projects/` and `tileengine/presets/`) |
| Desktop | `<userData>/tileengine/editor-prefs.json` |
| Android / iOS | `Directory.Data/tileengine/editor-prefs.json` |

`{kind: "editor-prefs", formatVersion: 1, maps: Record<"<projectId>/<mapId>", {zoom, minimap: bool, activeLayer: layerId | "logic", walkRulesOverlay: bool}>, sizeThresholds?, stageView?}`.
- `activeLayer` is a `layers[].id` or `"logic"` (the Walk rules layer). An id that no longer exists falls back to the first layer.
- `sizeThresholds` holds the user-wide meter thresholds (§10).
- **`stageView?: {look?: "art" | "blocks", gridLines?: bool, tapMenus?: bool | null}`** (r15, PROPOSED; EUX r65 Q-D3). It's the stage View menu, user-wide (all projects) and device-local, like the other view state here; a phone and a tablet may differ.
  - Defaults: `look` `"art"`, `gridLines` `true`.
  - **`tapMenus` absent or `null` = derived:** On when the profile's `modeFor("stage")` is `basic`, Off when it's `advanced` (profile-format r3 §1.11). Flipping the toggle stores `true` or `false`, and "Use my setup" stores `null`. The mode is never copied here.
  - Never in the project, never in the studio profile, never synced. An unknown value is read as the default; no migration (`editor-prefs` stays v1).
- Tolerant loader: anything unreadable becomes defaults (zoom 1, minimap on when the map is bigger than the view, the first layer). It has its own migration chain under `migrations/editor-prefs/`, and is never read by the runtime or Render.

## 12. Versioning and migrations (writer only)
**Kinds:** `tile-project` v6, `paint-style` v2 (r12; v1 r10), `catalogue-slice` v1, `map` v5, `stage` v2, `unit` v2, `project-notes` v2, `behaviour-setup` v3, `behaviour-preset` v2, **`deck` v1** (r13, PROPOSED pending build; new, so no chain entries yet), **`achievement-set` v1** (23:0x, PROPOSED; owned by profile-format.md §2, which holds its chain). **`save` v1** (r14, PROPOSED) is player data outside the project, with its own chain `migrations/save/` (§6.9). **r22: `match-save` v1** (DECIDED, CN-009) is player data too; its steps sit in the same `migrations/save/` hook, apart from `save` v1's (empty; §6.9.1). Each kind has a pure, idempotent chain under `packages/project-write/src/migrations/<kind>/`. Files newer than the app open the project read-only. The `index` is recomputed, never migrated. **23:1x (PROPOSED):** `project.audio` carries its own section guard **`audio` v1** (`kind: "audio"`, `formatVersion: 1`) with an empty chain `migrations/audio/`. Absent = silent defaults, no migration ([audio-format.md](audio-format.md) §3.6). **r18:** **`sprite-recipe` v1** (ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1)), chain `migrations/sprite-recipe/` (empty), read by its **local guard** in `src/paint/recipe` (`readSpriteRecipe(json, limits)`, SE-01; older → `needsMigration`, newer → read-only), **not** in `CurrentFormatVersions`, no CN.

**paint-style 001 (v1 → v2)** (r12): `stoneKind` → `recipes.stone`, number-valued `recipes` → slot `"<recipe>@<n>"`, `sha256` recomputed (§6.2.5). Draft-era embeds only. It's pure and idempotent.

**tile-project 005 (v5 → v6)** (r10, paint styles; §6.2.5; **`te-classic@1` confirmed by the Engine Architect, r11**). It runs **at load, in memory**, and is **written only on the next save**, like every chain step:
- Each procedural asset with `terrains` and no `paintStyle` gets **`paintStyle: {id: "te-classic", version: 1}`**. That is the current built-in version of the look it was painted with: the ARCH v0.5 §13 recipes with the params' own palette. **Pixels are unchanged.**
  - **Old maps are never auto-pinned to `btf-ashroad`** (or any BTF style), by this or any later migration. That would repaint every old map in the new style, which is exactly what pins exist to prevent. Moving to a BTF style is only ever the explicit Upgrade (§6.2.5).
- Because the pin is in the hashed params, the asset is **re-identified**: a new id from `JCS(params)`. Every reference to it, in project.json, maps (layers, background layers, objects), units, stages and `bakedFrom` provenance, is rewritten in the same migration, with **one `migrate` op per document, sharing one `group`**.
- `paint-styles/te-classic@1.json` is embedded.
- Tokens are untouched. Upload, builtin and baked assets are untouched, except `bakedFrom.assetId` rewrites. `bakedFrom.paintStyle` is **not** back-filled: the old bake was painted unstyled, so its provenance stays as it was.
- It's pure and idempotent (a pinned asset is skipped). An older app opens a v6 project read-only.
- §17.1 is a v5 snapshot; §17.9 shows its code tile after 005 (`asset_7876f28255bb866d` → `asset_6da4af68c4ea5d42`).

**tile-project 001 (v1 → v2):**
- `stages: mapId[]` becomes stage ids. For each v1 map, create `stage_<ULID>` with `mapRef` = that map, `playerSpawns` from `placements` with `side:"player"`, an `enemyPool` (`fixed` from `side:"enemy"` placements), `loadout: null`, `rules: []`, and empty `overrides`.
- `win-condition` stays in `project.rules`, where it is now allowed as the all-stage default.
- Add `loadout = {roster: player-placed units, size: their count, required: []}` and `render = {excludedStages: [], targets: ["browser"]}`.
- **Drop `host` and `host.limits`** (C5). Add an `ability-presentation` setup only if missing, with `shortcut` left at `source:"default"`, so the user is asked (a required answer is a hard error until then, which matches "never picked silently").

**tile-project 002 (v2 → v3)** (r3, asset spec):
- Each `AssetMeta`: `slice {tileSize, cols, rows}` becomes `tile {w: tileSize, h: tileSize}` and `grid {columns: cols, rows, margin: 0, spacing: 0}`. `slice: null` becomes nothing, which means a single-frame sprite (K1). Add `filter: "nearest"` only where the user later chooses `smooth` (absent = nearest). Kinds are unchanged; an `image` used as a map background stays legal.
- `settings.camera`: add `pixelPerfect: true`. Round `zoom`, `zoomMin` and `zoomMax` to the nearest whole step (min 1), e.g. 1.0/0.75/2.0 → 1/1/2. Add `followDeadZone: 0.6` and `easeMs: 120` (K10, K11). Add `advancedRender: false` (r4). **No migration ever sets `advancedRender` to true**; a v2 project had no non-integer options, so nothing is lost.
- `settings`: add `screenFit: "letterbox"`, `letterboxColour: "#000000"`, `maxImageSide: 4096` (K13).
- Add `difficulty: {hp: 1, damage: 1, appliesTo: "enemies"}` (Q9).
- It records nothing it can't derive: `requiredSize`, `pageOf` and grid defaults stay computed.

**map 004 (v4 → v5)** (r7, background layers; runs with tile-project 004). Old maps draw exactly as before, **with no parallax** unless they already had it:
- `mode: "none"` → `{layers: []}`.
- `mode: "colour"` → `{colour, layers: []}`.
- `mode: "image"` → `{colour?, layers: [{assetId, depth: 1, repeat: fit == "tile" ? "both" : "none", fit: fit == "tile" ? "none" : (fit ?? "none")}]}`.
- `mode: "parallax"` → the same, with `depth: scroll ?? 1`.
- **`fit: "tile"` → `repeat: "both"` + `fit: "none"` is pixel-identical (confirmed, Engine Architect r8).** Both mean: native size, repeated on both axes from the map's top-left, through the integer path, at the same depth. v4 had no one-axis tiling, so `x`/`y` never come from migration.
- Visual `layers[]` are untouched. It's pure and idempotent (a v5 background has no `mode`), with one `migrate` op per map.

**tile-project 004 (v4 → v5)** (r7, procedural and library):
- Add `render.proceduralShip: "auto"` and `render.credits: true`.
- Assets are unchanged. Old `origin: {kind: "builtin", src}` stays valid as legacy provenance (no library key is guessed, §6.2.4). There are no procedural assets yet, so nothing else applies.
- The bump exists so that an older app opens a v5 project read-only instead of misreading a `procedural` origin.

**tile-project 003 (v3 → v4)** (r5, catalogue rev 7; runs before map 003, so the v3 legends are still readable):
- `tileProps[i].logic`: an int becomes a tile type id. It is looked up through the v3 `legend` of the maps whose layers use that tileset: the legend label is matched to an effective `tile_types` id or label (case-insensitive). `0` with no legend becomes `"floor"`. An int that can't be matched is dropped, with a notice (it was a painter default only, so nothing at runtime changes).
- No other field changes. `derivedFrom` and `role` are optional and absent on old assets (they were uploaded as-is as far as the store knows). `advancedRender` is untouched.

**map 003 (v3 → v4)** (r5):
- `logic.legend` → `logic.palette`. For every int used in `terrain` or keyed in `legend`, the palette entry is the effective `tile_types` id whose id or label matches the legend text (case-insensitive). `0` with no legend becomes `"floor"`. Unmatched ints become `"floor"`, listed in a notice ("3 terrain values had no tile type and now mean Floor").
- Add `logic.edges: []`. Drop `legend`.
- `terrain` ints are unchanged, so the grid is untouched.

**map 002 (v2 → v3)** (K3, lossless):
- `tileset` + `terrain` become `layers: [{id: "ground", tileset, aboveUnits: false, visible: true, tiles: terrain}]` and `logic: {terrain}` (the same ints today, so behaviour is unchanged).
- Add `tile: null` and `background: {mode: "none"}`.

**stage 001 (v1 → v2)** (Q9, Q10): re-key `overrides.setups` from setup id to that setup's `behaviourId`. If two keys map to one behaviour (only possible when the stage replaced a setup), keep the key of the setup that wins on this stage, and log the other in the `migrate` note. Add `difficulty: null`.

**map 001 (v1 → v2):** remove `placements` (and any `enemyPool`), which tile-project 001 moved into the stage.
**unit 001 (v1 → v2):** add `stats: {}` and an empty `history`. Any `_protoStats` is handled as in the import below.
**project-notes 001 (v1 → v2):** `tile {mapId}` becomes `tile {stageId}`; `capture.godmode[].setupId` becomes `target`.
**setup 001, setup 002, preset 001:** see setup-format §8.1.

**ui-shell prototype import** (sources: the legacy `localStorage` key `tileengine.project-vfs.v1`, a `{files}` map, plus `tileengine.presets.v1`, `tileengine.preset-library.v1` and `tileengine.preset-embed.v1`; these are **import-only**, and on web the result is written to OPFS):
1. Run the chains above on each file (the shell writes map v1 and unit v1).
2. **`maps[].enemyPool: [{unitId, weight?}]` → `stage.enemyPool`** of the stage made from that map: `{mode:"weighted", picks: entries.length, allowRepeats: false, spawns: [], entries: [{unitId, weight: weight ?? 1}]}`. Empty `spawns` gives a warning, so the user places them.
3. **`unit._protoStats {hp, atk}` → `unit.stats.unit_hp` / `unit_atk`**, only where they differ from the effective army value (the `unit-roster` setup, else catalogue 9 / 1). Then drop `_protoStats`.
4. The `app.js` state units (`hp`, `atk`, `x`, `y`) follow the same rule, and `x,y` become `playerSpawns`.
5. `loadoutSlots` becomes `project.loadout.size`. `loadoutSelected` is runtime data and is dropped.
6. Presets go to the user library (OPFS) and embeds.
7. The localStorage keys are left untouched. The import never writes them.

**Catalogue upgrade (slice rev → live rev).** Runs setup-format §8.2 steps 1–3 (behaviour, knob and option renames from `renamed_from` / `options[].renamed_from`) over **every** document before any check:
- setups and presets, including materialised built-ins and their ids
- `stage.overrides.setups` keys (behaviour renames), and their knob keys and option values
- `unit.stats` keys

Then:
- drift (defaults, added knobs, retired knobs)
- slice regeneration
- one load notice listing renames and moved defaults

Rev 6 → 7 adds no renames: it adds knobs (default answers, setup-format §8.2 step 5) and the `gates` table. Rev 4 → 6 covers:
- `card-recursion → ability-refresh` with `max_returns → max_refreshes`
- `bot-priority → bot-ability-priority`
- the eight knob renames
- the four option renames
- `style → shortcut` with `unit-action-menu → all-menu` and `card-hand → all-cards`

Gates, `depends_on`, bans and `event_map` are read from the new slice, so they follow automatically. Notes are not rewritten. Ban ids are opaque and survive.


## 13. Validation (C4 audit: errors only where the game can't run)
Load reports and never deletes. **Save is never blocked.**

| # | Hard error (blocks Play on that stage and Render) | Why it can't run |
|---|---|---|
| H1 | An active required answer is missing in a used setup (`requiredUnanswered`, `noDefault`), including no `ability-presentation` setup in the project | There is no value to run with, and the catalogue fallback must not be picked silently |
| H2 | `invalidValue` on an active answer, override or unit stat (wrong type, unknown picker option, unparseable colour, malformed list or list item, reserved or duplicate item id; setup-format §2.5). **r37 (M5): in effect documents an unknown option value on a picker is not H2:** it warns with the existing unknown-option warning (`outOfRange`; no separate code, setup-format §2.10.3.5) and the field plays its absent meaning. A wrong type stays H2 | The runtime can't interpret it |
| H3 | A broken reference: `stages`, `mapRef`, `rules`, override unit keys, loadout ids, enemy-pool and neutral `unitId`s, `sprite`, `objects[].assetId`, `layers[].tileset`, `background.layers[].assetId`, `objects[].assetId`, wall-look `assetId`s, `pages[].assetId`, `presetRef` with no embedded or library copy **only if** the setup's values need it (otherwise a notice) | The object doesn't exist |
| H4 | **The art can't be produced:** an asset or page file is missing, or its hash ≠ its id; or (r7) a procedural asset's `painter` is newer than the engine, or its `recipe` is unregistered, or its recipe `version` is unknown; or (r10) its pinned **paint style version** has no embedded copy, isn't installed (editor), and has no stored bake (§6.2.5) ; or (r18, ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1)) a sprite asset's recipe document is missing with no stored bake, its `raster` is newer than the engine, or its `ProcParams` arm is unknown. Recipe warnings (not H-level): `recipeMissingUsedBake`, `codeOutMismatch`, `jointCycle`, `floatParam` / `droppedKey` (reused), over-cap counts; info `spriteRecipeHashMismatch`. Still six hard errors. **Codes (r41, D29):** `assetFileMissing` `{assetId, path: "assets/<id>.<ext>"}` and `assetHashMismatch` `{assetId, path}`; H4 only when the asset is in a selected stage's closure | The art can't load or be painted, or isn't what the project references |
| H5 | `logic.terrain` or any `layers[].tiles` length ≠ `cols*rows` | The map can't be built |
| H6 | Zero selected stages (Render only) | There is nothing to build |

| Warning ("Play/Render anyway") | Runtime behaviour |
|---|---|
| Slider out of range or off step; unit stat or override out of range | The value is used as stored |
| Banned combo | Both values are used |
| `unknownRef` (e.g. a deleted ability group) | The knob default is used |
| Loadout contradictions (§6.6) | The fallbacks in §6.6 |
| No `win-condition` on a stage | Catalogue defaults |
| A tile in `playerSpawns`/`neutrals`/`at`/`spawns` is off the map | That placement is skipped |
| Two placements on one tile, when `unit-roster.one_unit_per_tile` (rev 7, default on) resolves to true on that stage (**rev 15: the knob is retired (L42). Read `settings.occupancy` = `strict1` instead**; a stage value is kept inactive with `occupancyStageValueIgnored`) | Both are placed. When it is off (`softStack`), there is no warning. |
| `notPlaced` (r41): enemy `spawns` fewer than `picks` or a wave's count; or loadout picks past the stage's `playerSpawns` | Enemy extras are skipped. Loadout members past the spawns **stay in the party** with their hp and spill to the nearest free cell or are benched (step 8b). Distinct from `placementDropped` (D17, off-map/resize). |
| `tileSize` outside 32–128; `zoomMin > zoomMax`; `followDeadZone` outside 0–1 | Used as stored (min/max swapped; dead zone clamped) |
| Fractional zoom while `pixelPerfect` is effective | Rounded to a step |
| `advancedRender` on, with `pixelPerfect` off or a `cover`/`stretch` background | Warn "may blur or stretch your art" on every Play/Render report |
| A stored `pixelPerfect: false` or `cover`/`stretch` while `advancedRender` is off | Info `advancedRenderInactive` (r41), one row per stored field, detail `{field: "pixelPerfect" \| "fit", path}`: "inactive: needs Advanced render" (resolved as true / `none`; the stored value is never rewritten) |
| `stage.overrides.setups` key for a behaviour that isn't in the stage's rules or the project's | Kept and ignored |
| Asset geometry (§6.2): tile ≠ map tile, leftover grid pixels, frame not a whole multiple, a clip naming a missing frame, `ms` length mismatch | The fallbacks in §6.2 |
| Background not the required size (by fit mode) | The fallbacks in §6.4 |
| Image over `maxImageSide` or 16.7M px with no pages; `maxImageSide` > 4096 | Render pages it in the build |
| `jpg` with `filter: nearest` | Info |
| Difficulty `hp` or `damage` ≤ 0 | Warn: "units start at 1 HP" / "deals no damage" (the HP floor is 1, damage is clamped at 0) |
| Difficulty outside 0.25–4 | Warn: "extreme" |
| Difficulty not a number | H2 (hard) |
| Size meters (§10) | — |
| Unknown files, or stale `excludedStages` ids (pruned) | — |
| Logic: a `terrain` int with no palette entry, or a palette id not in the stage's effective `tile_types` | That cell is `floor` |
| Logic: an edge off the map | Skipped |
| `wall_blocks_los` / `wall_blocks_shots` / `clip_cues` absent from the catalogue (before L24/L25) | Read as `true` |
| Logic: the same wall stored twice | Info; counted once |
| List over `max_items` / under `min_items`; a built-in list item missing (setup-format §2.9) | First N used / padded / the catalogue item used |
| `effect` answer naming no builtin or effect document (`unknownRef`) | Runs as `none` |
| An `effect` setup in `rules` or `unit.setupIds` | Ignored |
| A layer, sprite or background referencing a `role:"source"` asset | It is exported anyway |
| **Info:** an image whose width or height is odd (art-upload ruling 8; RPG Maker notes odd widths may blur). Import report and asset row only. | — |
| **Info:** `derivedFrom` replay mismatch; `derivedFrom.assetId` missing (e.g. after `stripSources`) | Re-fix unavailable |
| A used sprite resolved through clip fallbacks (§7.3 steps 2–7): one row per asset, listing the fallbacks in use | Render plays the fallback |
| Procedural: params number out of range; `size` ≠ map tile; stored geometry or `ext` on a procedural asset | Painter clamps at paint time / native size / ignored |
| Procedural: id ≠ params hash; system font missing; `filter: smooth` without `advancedRender` | Info (paints; fallback font; read as `nearest`) |
| Library: installed library has a newer `rev` for a copied `assetKey` | **Notice** only (§6.2.4) |
| Credits: a closure asset with no `credit` while `render.credits` is on | Info ("credit not provided") |
| Decoded-memory meters over warn / strong (§10) | — (Android: "may be killed on low-end devices") |
| `unit.footprint` other than 1×1 | Warning: plays as 1×1 |
| An effect point that can't land on any selected map (|dc| ≥ cols or |dr| ≥ rows; r8 relative points, **derived on read**); at cast time, any off-board point | Warning `effectPointOffBoard`; the runtime clamps like spec.ts `pointsOf()` and warns. The stored points are kept. |
| `builtin` copy with no `credit.license` | Warning |
| r13: `facing` not N/E/S/W/null (no facing); `seed` not an integer (fresh seed); unknown side id in `sides` / `neutrals[].side` (default side); a `team_colours` entry no stage assigns (`sideUnassigned`); `wrapEdges: true` (`wrapEdgesIgnored`); `credit.status: "provisional"` (`creditProvisional`); a unit placed on an `open: false` tile (skipped); a deck row with an unknown `cardId` (skipped) or bad `copies` (0); an ability modifier problem (setup-format §2.11) | Warning |
| r13: `credit.aiGenerated: true` (AI disclosure), an unused deck | Info |
| r14: `openingShapeMissing` (once per deck: `front` with no, or a malformed, `openingFront`; **or once in total when there's no deck**; runs `back`) | Warning |
| r14: `saveProjectMismatch`, `saveRefDropped` (one per dropped entry), `occupancyStageValueIgnored`, `licenseUnlisted` and `ownCreditIncomplete` in end-user projects | Warning |
| r22: `saveEngineMismatch` (a `match-save` from another engine; resumed only with the host opt-in, §6.9.1); `saveProjectMismatch` and `saveFormatNewer` on a `match-save` (§6.9.1). r23: `saveFormatOlder` (an older save the `migrations/save/` hook can't bring up; kept, not loaded; §6.9.1). r24: `saveMigrationFailed` (the hook threw, or returned something hostile, still old or not plain; the file is always kept untouched and shown read-only; §6.9.1). r25 (EA H4): `saveTooLarge`, `saveTooDeep`, `saveSnapshotTickInvalid` from `loadSave`; `fxTooLarge`, `fxTooDeep`, `fxTooManyFrames` (over 64 steps, or r35 a played picture strip over 64 frames, one code with `detail.subject` `steps` \| `strip`; never truncated; §6.7 K-4) from `readFxOrder`; the readers' `cyclic document` reason. All keep the file untouched | Warning |
| r14 (PROPOSED): `map.paths` problems (§6.4); `occupancyUnsupported`; `offlineCapMs` non-integer or over 7 days; a save's `projectHash` mismatch | Warning |
| r14: `deckMissing` (card-hand group with no deck); a `logic.lanes` value out of range (reads 0) or wrong length (ignored) | Warning |
| r14: `deckSizeDerived` (notice) | Info |
| 23:1x / 00:2x (PROPOSED, [audio-format.md](audio-format.md) §7): `unknownRef` / `outOfRange` on audio bindings and music, `audioFieldIgnored`, `generatorMissingUsedBake`, `audioUnavailable`, `audioFormatNewer`, **`audioTranscodeUnavailable`**. **Audio is outside H4's reach (EA-A9):** a missing or undecodable sound plays silent. | Warning (plus info rows there) |
| r13 (22:1x): `styleDefective` (pinned to a defective style); `ownCreditIncomplete`; `nestedModifierIgnored` (setup-format §2.11) | Warning |
| Map object off the map; blocking object on a spawn/unit cell; non-1×1 object footprint; `placedEffects` unknown effect/event/side or `at` off the map | Warning |
| Two objects on one cell; `blocks_los`/`blocks_shots` set while `blocks` is false | Info |
| Wall look `asset` length ≠ tile width; baked asset with unknown `sheetLayout` | Warning |
| `background.layers` > 3 (soft cap, all drawn); `depth` outside 0..1 (drawn clamped); a moving layer smaller than its view travel | Warning |
| r32 (ACCEPTED, EA 17:59; clip-wins restated r33): `motionInvalid` (once per asset: a bad value, a colour list on a styled asset, an index-form ramp on an unstyled asset, or an out-of-range step — that part is skipped; or, decided at load per drawn cell, when the cell is animated — a tileset tile whose `tileProps[i].anim` (stored or derived) names a clip, or a sprite asset with a non-empty `clips[]` — motion is ignored on that cell; image assets have no clips; under a paint style, motion on styled water applies only with `anim: null`); `motionTooLarge` (once per asset: the product of active motion parts would pass 64 frames; motion is skipped and the asset draws as painted). Combined parts keep their own `ms` and advance on their own; the runtime picks the atlas cell from the part indices, with no shared clip tick. Stored value never rewritten. A stored `motion` on a procedural asset is ignored with `styleParamIgnored`. r31 catch-up (accepted fields, omitted from this table in r31): `lightInvalid` (once per asset; that light is off); `nightVariantMismatch` (geometry differs, target missing, a chain or a cycle; the day asset is drawn). **r33:** `shoreInvalid` (once per style body: `waveGap` is not a whole multiple of `frames`; both fields use their defaults). A bad `shore` object-form field still warns per field under the existing unnamed body rule and uses that field's default | Warning |
| r33/r34/r35/r36: `shoreInvalid` (paint-style body, `water` slot; render-only; the message names the field): once per bad field on the object form of `shore` (r34), that field uses its default; or once per style body when `waveGap` isn't a whole multiple of `frames` (r33), both fields use their defaults; or (r35) once per body when the whole `shore` value is `true`, an array, a number or a string (field `"shore"`; the shore stays on with defaults, except with no usable water ramp — r36); `shore: null` reads as absent with no warning; or (r36, N-r3-1) a `null` sub-field on the object form (e.g. `{ms: null}`) counts as absent and uses that field's default, with no warning; or (r35) once per body when there's no usable water ramp ("no water ramp"; the shore is off); or (r36, N-r3-2) a bad whole value with no usable water ramp warns both the no-water-ramp notice and `shoreInvalid` once for field `"shore"`, and the shore is off | Warning |
| r35/r36 (CN-014/CN-015 ACCEPTED, CN-017 particles; render-only): `clipEventInvalid` (once per clip: a bad entry is skipped, a non-array `events` reads as absent), `clipEventsOverCap` (once per clip: over 16, the first 16 in stored order fire), `clipPointsInvalid` (once per clip: bad entry → `null`, length ≠ 1 or `frames.length` padded / cut, a stored `foot` ignored), `jointTagDuplicate` (once per recipe: first tagged joint wins), `fxRampMissing` (once per effect: `tint_ramp` / `light_ramp` key not in the resolved style; plays as absent), `fxLightsOverCap` (once per effect: lit steps 3+ draw no light), `fxParticlesOverCap` (r36, once per effect: the sum of `particle_count` across its `particles` steps exceeds 48; later steps are cut down at load in step order; `{count, limit: 48}`). Reused: `outOfRange` (`shake` above 3 plays as 3, `shake_ms`, `light_radius`, `pixel_scale`, `particle_count` / `particle_life_ms` / `particle_pull` out of range, unknown `particle_motion` plays as `"burst"`; value kept), `styleParamIgnored` (stored clip `events` / `points` on a procedural sprite), `fxTooManyFrames` (now with `detail.subject` `steps` \| `strip`) | Warning |
| r41 (D22): `legacyEffectId` (an `effects/` doc with a `setup_<ULID>` id) / `badEffectId` (any other non-`effect_<ULID>` id; still loaded) | Info / Warning |
| r41 (D22b): a doc in `effects/` whose `behaviourId` isn't `"effect"` | Warning `unknownFile` (detail `behaviourId`); not loaded |
| r41 (D29): `assetFileMissing` `{assetId, path}` / `assetHashMismatch` `{assetId, path}` on an asset no selected stage uses | Warning; the index entry is kept (in the closure these are **H4**) |
| Unused units, maps, setups, assets (excluding `role:"source"`), effect documents or presets | Info |

**C4 audit: what changed from r1/r3.** Now warnings:
- slider out of range (setup D1)
- off-step (setup D1 and D4: no longer rejected on edit)
- off-map tiles
- loadout `required ⊄ roster` and `|required| > size`
- a stage with no win rules
- `rules` repeating a behaviour (now the stage-over-project override, no longer an error)
- `tileSize` and zoom ranges
- the r1 "at most one unit per tile" error (now a warning under the L17 knob)
- r1 `host.limits` (removed)
- preset apply now applies out-of-range or off-step entries and warns, instead of skipping them

Still hard: H1–H6 (**six**, r7 too: the procedural "can't paint" cases widen H4's reach rather than adding H7). r5 adds **no** hard kinds: palette, edges, lists, effects, `derivedFrom`, decoded size and odd sizes are all warnings or info. r2: H1's required is active-only. r3: H3/H4/H5 **reach** extends to layers, backgrounds and pages (K7); there are no new hard kinds, and every other asset-spec rule is a warning or info (K1–K13).

## 14. Decisions

### 14.1 Project rulings: CEO-approved 2026-11-09
| # | Ruling | Applied in |
|---|---|---|
| P1 | A stage is not a map. A stage document holds `mapRef`, placement, enemy pool, loadout override, rules and overrides. One map serves many stages. | §2, §6.4, §6.5, §12 |
| P2 | Render exports a chosen subset of stages: all ticked by default, order kept, stored as `render.excludedStages` | §3.1, §7.2 |
| P3 | Each unit has its own stats over army `unit-roster` defaults, using layers L0–L4 (plus the L5 difficulty multiplier, Q9). Godmode asks "army/setup vs this unit" and "this stage vs all stages". | §6.3, §7.1 |
| P4 | Each project copies the built-in art it uses | §6.2 |
| P5 | Notes are never exported; strip-on-share removes them | §7.2, §8, §11.2 |
| P6 | `tie_result: "no-draw"` becomes `draw_handling: "clock-loss"`, with a load notice, via `options[].renamed_from` (shipped in rev 5) | setup-format §8.2, §10.5 |

### 14.2 Chief Of Staff rulings on ARCHITECTURE v0.2 §11 (2026-11-09; the CEO may override)
| # | Ruling | Applied in |
|---|---|---|
| C1 | A read-only reader and an editor-only writer, with shared types | §11.1, setup-format §8.1 and §9 |
| C2 | Godmode at "this stage" (L2/L4 in the stage doc) or "all stages" (L1/L3) | §7.1 |
| C3 | The stage gets an enemy pool, a loadout and rules that override project rules | §6.5, §6.6, §7.1 |
| C4 | Hard errors only where the game can't run; everything else warns; one-unit-per-tile becomes a knob | §13, setup-format §2.5 and §7. L17 requested. |
| C5 | Drop `host` and `host.limits` | §3.1, §12 |
| C6 | Per-group presentation, with All menu / All cards / Custom | §5.1, §7.2 step 4, setup-format §2.9 |
| C8 | Web presets and projects use OPFS (confirmed) | §1, §2, setup-format §6.3 |

### 14.3 Shell-gap rulings (Chief Of Staff, 2026-11-09)
- The enemy pool is on `stages[].enemyPool`, with import from `maps[].enemyPool`.
- The loadout is project-level with a stage override, and the selection is runtime data.
- `required` is hard only while active, and `ask_in_wizard` is a hint.
- `_protoStats` becomes `unit.stats`.
- OPFS for web, with localStorage as an import source only.
- Option renames come from `options[].renamed_from`.

### 14.4 Chief Of Staff rulings, 2026-11-09 (r3)
| # | Ruling | Applied in |
|---|---|---|
| Q7 | A stage may override the loadout. `stage.loadout` **replaces** `project.loadout` whole. | §6.5, §6.6, §7.2 |
| Q8 | Build size is always shown. Warn above 50 MB and more strongly above 150 MB; per-target meters from `target-size-limits.md` apply to the targeted platforms only; nothing blocks. | §10 |
| Q9 | Overrides plus an optional difficulty multiplier `{hp, damage}`, default 1.0, at project level and overridable by a stage. It is applied after all overrides, and only warns. | §3.1, §6.5, §7.1 (L5), §13 |
| Q11 | Difficulty applies to **enemies only by default**; `all` and `player` are options. **Decided.** | §3.1, §7.1 |
| R1 | **CEO art stance (via CoS):** art must never look worse than the upload. `pixelPerfect: true` and `fit: none` at exact map size are locked-on defaults. Turning `pixelPerfect` off, or `cover`/`stretch`, need `settings.advancedRender` (default false; a user action only, never set by presets, import, Godmode or migrations). `tile` stays available. When it is off, Render ships no non-integer path. | §1, §3.1, §6.4, §7.2, §12, §13 |
| Q10 | A stage may override ability presentation, and inherits it by default, via `stage.overrides.setups["ability-presentation"]`. | §5.1, §6.5 |
| A1 | **Approved (Keeper's call):** setup format v3, with checks derived on read | setup-format §2.2, §2.5, §8.1 |
| A2 | **Approved (Keeper's call):** `custom_groups` as a `list` answer plus `ability_group` as a `ref` | §5.1, setup-format §2.9 |

### 14.5 Engine Architect asset spec (proposal r2, ARCH v0.3 §12), adopted with C4 and the freedom principle
| K | Resolution |
|---|---|
| K1 | `tile {w,h}` and `grid {columns, rows, margin, spacing}` replace `slice` (§6.2, migration 002) |
| K2 | `frame`, `layout`, `frames[]`, `anchor` (default bottom-centre, or `"auto"`) and `clips[]`, **on AssetMeta only** (§6.2, §6.3) |
| K3 | Map v3: visual `layers[]` plus a separate `logic` grid. Logic never reads pixels. (§6.4) |
| K4 | `background` (r7: `{colour?, layers[]}`, each layer `{assetId, depth, repeat, fit?}`, soft cap 3; the only home of parallax). The exact size with `fit: none` is the locked default; `tile` is always available; `cover`/`stretch` only with `advancedRender` (§6.4, R1). |
| K5 | The `background` and `page` kinds, and their `byKind` keys (§6.2, §10) |
| K6 | Auto-paging at import; an unsliced oversize image warns, and Render pages it (§6.2) |
| K7 | Closure and per-stage packs include layer tilesets, backgrounds and pages (§7.2) |
| K8 | `asset_<16hex>` ids. No clash. |
| K9 | `map.tile`, `null` = inherit `settings.tileSize` (§6.4) |
| K10 | `camera.pixelPerfect` (default on). Off only with `advancedRender`, with a warning (§3.1, R1). Both render paths are confirmed by ARCH §12.5 v0.4. |
| K11 | `followDeadZone` 0.6, `easeMs` 120 (0 = instant), both confirmed (§3.1) |
| K12 | `filter` (default nearest); info for jpg + nearest (§6.2) |
| K13 | `screenFit`, `letterboxColour`, `maxImageSide` (§3.1) |
| K14 | Editor & UX: "Shrink to fit" becomes an explicit resample at import that writes a new asset (§6.2) |
| K15 | Compatible: margin and spacing go in the wizard's Advanced step |
| Open | **Resolved r5:** tile meanings live in `terrain.tile_types` (rev 7), and the map stores a `palette` (§6.4). Page assets are hidden under their parent. `pageOf` and `requiredSize` are derived, not stored. Parallax `scroll` lives on the map's use of the image, not the asset. |

### 14.6a Chief Of Staff rulings on the Editor & UX art-upload gaps (`ux/art-upload.md` §6), 2026-11-09 (r5)
| # | Ruling | Applied in |
|---|---|---|
| 1 | `AssetMeta.derivedFrom {assetId, ops[crop\|pad\|scale\|colourKey\|slice\|dedupe]}`, ordered and replayable. The original is kept as its own asset with `role:"source"`, excluded from the export closure. Share keeps it by default and `stripSources` removes it (**decided, CoS 2026-11-09**). | §6.2, §6.2.1, §7.2, §11.2 |
| 2 | Auto-slice = `slice` + `dedupe {removedCount}`; everything else is derived (cells, unique, padding) | §6.2.1 |
| 3 | The drawn size is recoverable from `scale`: derived `nativeScale`, `nativeTile`, `nativeFrame` | §6.2.1, `index.assets[].nativeScale` |
| 4 | A 4-row walk sheet defaults to clips `down`, `left`, `right`, `up`: an editable import convention. Clip names are free text; those 4 are well-known for Render facing. | §6.2, §6.3 |
| 5 | Colour see-through = a `colourKey` op, baked at import | §6.2.1 |
| 6 | Last zoom, minimap and active layer are per-user editor prefs (OPFS `tileengine/editor-prefs.json`), outside the project, never exported or shared | §2, §11.3 |
| 7 | Decoded-size meter (`w×h×4` per image, total, per-stage resident estimate), warning only, thresholds pending the Engine Architect | §10 |
| 8 | Odd image width or height: an info note, not a warning | §13 |

### 14.6b Catalogue rev 7 (r5)
- `terrain.tile_types` is the single home of tile meanings; the map palette names its ids (§6.4). Barrier walls are stored as `map.logic.edges {c, r, side}`, one record per physical wall (**decided, CoS 2026-11-09**). Blocking is core grid; LOS and shots are `terrain` knobs; `barrier-line` adds side, damage and destructible only when its setup exists (**Engine Architect, r6**) (§6.4, §7.2).
- **Ability owners (decided, CoS 2026-11-09):** `objective-contest` and `sword-lifecycle` are owners, and `avatar-summon` is not. `objective-contest` is one `spells` group for both the link and the contest moves (setup-format §2.9.5).
- **Clip fallbacks and cues (Engine Architect, r6):** §7.3. `noMirror` on AssetMeta; `clip_cues` is a knob.
- Effects are documents (§6.7; setup-format §2.10 and §12.6).
- `per_unit` keys (§6.3), `one_unit_per_tile` (§13), named gates in the slice (§4).

### 14.6c Procedural painter and built-in library: PL1–PL13 (r7, Engine Architect proposal r1)
| # | Verdict | Format decision (and pushback) |
|---|---|---|
| PL1 | **Modify** | Origin union `upload {fileName, bakedFrom?}` \| `builtin {libraryId, assetKey, rev, src?}` \| `procedural {params}` (§6.2.2–6.2.4). `tile-project` → v5 with migration 004, so older apps open the project read-only instead of misreading it. **Pushback:** no automatic `src` → `assetKey` mapping for BTF art. It's an explicit "Link to library" action, available only after the CEO confirms the group. |
| PL2 | **Accept, tightened** | Id = 16 hex of sha256 over **RFC 8785 (JCS)** canonical params. "Sorted keys, no whitespace" leaves number formatting open. Re-id only on commit. A stale id is info, never H4. |
| PL3 | **Accept** | H4 = "the art can't be produced": unknown `painter`, `recipe` or recipe `version`. Still exactly six hard errors. A bad seed or colour is H2. Out-of-range numbers are warnings and are clamped at paint time, never in the store. |
| PL4 | **Modify** | `ext` is **omitted** for procedural assets (not `"png"`), because the bake format is a Render fact. `bytes`/`mime` are `null` in the index; `w`/`h` are derived. |
| PL5 | **Accept** | Geometry and `tileProps.anim` are derived. Stored geometry on a procedural asset is ignored, with a warning. **Pushback:** pin the sheet layout (bands per terrain, columns per mask), because the format derives `grid`, `w` and `h` from it. |
| PL6 | **Accept** | §7.4. `bake` ships no painter (audit). System-font initials are always baked. |
| PL7 | **Modify** | `byKind.procedural` is the estimate under `proceduralShip` (min of the two under `auto`). **Pushback:** procedural sheets also count in `index.size.decoded`, because painted pixels cost the same memory. |
| PL8 | **Modify** | `bakedFrom {assetId, painter, recipes, at}` **without params**. They stay once, on the kept procedural original. |
| PL9 | **Modify** | `tileProps.logic` is derived from the recipe default; overrides go in `tileTypeOverrides` (outside params, unhashed). **Pushback:** `defaultTileType` must be a real `terrain.tile_types` id. Today only `floor` fits grass/sand/stone. Water/wall/lava need generic built-in types (Librarian **L27**). Until then the editor creates a user type on first paint, and walls should be painted as **edges** (map v4), not as a wall tile type. |
| PL10 | **Modify** | `credit` is copied onto the asset, and Render reads **only** that. **Pushback:** no Render lookup into the installed library, because the project must build the same credits anywhere (principle 1). `project.render.credits` toggles the files. |
| PL11 | **Modify** | The presets model (§6.2.4): copy on use, the project copy wins, a newer rev is a notice, and a field diff with user-edited rows unticked. New bytes make a new asset, the old copy is kept, and derived pairs re-derive by replaying `derivedFrom`. |
| PL12 | **Accept** | The procedural original of a baked asset becomes `role:"source"`: kept on share, removed by `stripSources`. |
| PL13 | **Accept** | `layers[].autotile?: 4 \| 8` (absent = none). It's an editor hint only, with no runtime meaning. |

**`proceduralShip` and `credits` go in `project.render`, not in `settings.*` and not in catalogue knobs.**
- Both are **per-project build packaging** choices. They change bytes and files in the bundle and never change gameplay, so they don't fit the "prefer knobs" rule, which covers gameplay or export choices that vary by stage or preset.
- Knobs are layered per stage and preset (setup-format §3), but one bundle can't ship half live and half baked, or two credits files. A knob would invite overrides that can't be honoured.
- They sit beside `targets` and `excludedStages`, which are the other "what Render produces" choices, and `settings.*` stays about how the game looks and plays.
- An in-game **Credits button** on the title screen would be a gameplay/UI choice. If it's wanted, it's a future knob request (`ui` behaviour), separate from writing the files.

### 14.6d Art round 2 (Editor & UX `art-upload.md` r2 §6) and Engine Architect answers (r8)
| # | Ask | Ruling |
|---|---|---|
| UX 1 | Parallax `background.layers[] {assetId, scroll}` | **Already in r7** as `background.layers[] {assetId, depth, repeat, fit?}` (§6.4). **`depth` is the scroll factor**; there's no second field. Soft cap 3. |
| UX 2 | Code tile, `origin {kind: "code"}` + `recipe` | **Kind rejected** (it duplicates `procedural`). Fields map onto `terrains[]` (§6.2.2 table). Logic stays derived (`tileTypeOverrides`); terrain meanings are real `tile_types` ids (L27). Added `stripes`, `pattern.scale`, `pattern.variation`; new recipes `dirt`/`wood`/`snow` for the Architect. |
| UX 3 | Shape token recipe | A `token` recipe in the same painter (§6.2.2). `triangle` and `glyph` added. **Team colour isn't stored**: resolved per stage from `unit-roster.team_colour` → palette (L30). `fill` is optional with no fallback copy. System-font glyphs are always baked. |
| UX 4 | Library item identity and licence | **Already in r7:** `builtin {libraryId, assetKey, rev}`, copy into the project (P4), the presets model, additive update (§6.2.4). The licence field already exists as **`credit.license`** (SPDX id). r8 makes it **expected on builtin copies** (missing → warning). |
| UX 5 | Per-frame crop | **`cropFrames {frame: {w, h}, rect: {x, y, w, h}}`**: one rect relative to each frame cell, applied to every frame (§6.2.1). `nativeFrame` is derived. There are no per-frame copies. |
| UX 6 | Wall look | `map.wallLook?` + `Edge.look?` on the same edge record (§6.4). Absent = stock line. No version change. |
| EA 1 | Sheet layout | **Pinned as v1** (§6.2.2); bakes store `sheetLayout: 1`. |
| EA 2 | Canonical JSON | RFC 8785 JCS over UTF-8; id = SHA-256 of the JCS bytes. Integer/string params; a float param is a `floatParam` **warning**, never blocking. |
| EA 3 | Effect points | Relative `{dc, dr}` + `steps[].anchor: caster \| target` (default caster); `rotate_with_facing` (default **true**, CoS; identity with no facing). Shipped in rev 10. Map-absolute points exist only in stage-authored effects (`stage.placedEffects`). Off-board → clamped + warned. Catalogue **L33** (setup-format r9). |
| EA 4 | `fit: "tile"` in map 004 | **Confirmed:** → `repeat: "both"`, `fit: "none"`, which is pixel-identical (§12 map 004). |

### 14.6e v1 built-in library: Kenney CC0 only (CoS via Engine Architect, 2026-11-09; r9)
| # | Ruling | Applied in |
|---|---|---|
| K1 | The v1 built-in library is **Kenney CC0 packs only**. No LimeZu, no CC BY. Premium packs and AI sprites are parked. ~~r13: widened by R13-8~~ **r14: not widened. The v1 built-in library stays Kenney-only** (ARCHITECTURE v0.6.1 §14.2). Studio-own art is project content (or a later library revision). | §6.2.4 |
| K2 | v1 library copies carry `credit.author: "Kenney"`, `credit.license: "CC0-1.0"` (filled from `LICENSES.json` on copy) | §6.2.4, §17.7 |
| K3 | `credit {author?, license?, url?, title?, note?}` stays **general** (any SPDX id or `"own"`), so later packs need **no migration and no format version change** | §6.2.4 |
| K4 | The format only **warns** (`builtinNotCC0`) on a library copy whose `license` isn't `CC0-1.0`. The **hard reject is the Architect's `LICENSES.json` CI**, not a load or Render error. It stays within the 6 hard errors. | §6.2.4 |
| K5 | **BTF art ownership is open** and not in the v1 library. **r13 (CEO): studio-own art may ship (R13-8): `painter-proto` output (procedural) and the BTF PNGs (AI-generated).** Legacy BTF copies (`origin.builtin` with `src` only, no `libraryId`) are provenance, not library items, so K4 doesn't apply to them, and nothing about them changes. | §6.2.4, §12 |

### 14.6f Paint styles: version pin (CEO via CoS and Engine Architect, 2026-11-09; r10)
| # | Ruling | Applied in |
|---|---|---|
| PS1 | The painter prototype is the default "Paint with code". `btf-ashroad` (day) and `btf-moonlit` (night) are the first built-in styles. **Updated (CEO 2026-11-09):** the defaults are the locked **`@2`** versions; `@1` is superseded but still loads; more styles are **PARKED**. | §6.2.5 |
| PS2 | Engine rule (ARCH v0.6 §13): ids like `btf-ashroad@1`; a published version is immutable and kept forever; the project pins `{id, version}`; the JCS + SHA-256 id includes the pin; upgrades are explicit, previewed, rebaked and undoable; an "update available" badge; a missing version uses the H4 handling | §6.2.2, §6.2.5, §13 |
| PS3 (Keeper) | **One name: "paint style"** (`paintStyle`, `paint-style`, `paint-styles/`). The pin goes in `params`, and the embed follows the presets model; there's no parallel machinery. | §2, §6.2.5 |
| PS4 (Keeper) | Self-contained: embed every pinned version; the embedded copy wins; Render reads only the store | §6.2.5, §7.4 |
| PS5 (Keeper) | Fallback: embedded → (editor) installed same version → stored bake (warning) → H4. Still six hard errors. | §6.2.2 checks, §13 |
| PS6 (Keeper) | Upgrade = one undo group (pin + references + rebake), project or map scope. Old pins work forever. | §6.2.5 |
| PS7 (Keeper; **confirmed by the Engine Architect, r11**) | Migration 005 pins unpinned terrain sheets to **`te-classic@1`** (the r7 recipes, pixel-identical). **Old maps are never auto-pinned to `btf-ashroad`.** It re-identifies them in memory, and they're written on the next save. | §12 |
| PS8 (Engine Architect; Keeper hash rule, r11) | `paintStyle` is reserved on token params. v1 never writes it and ignores it on read. It's **inside the hash** like every param; unset means no id change. | §6.2.5 |
| PS9 | **Held** until the Architect sends them: the seamless 4×4 macro fields, the style `body` fields, and the ×2 display | — |

### 14.6g ARCHITECTURE v0.6 §13 adoption (r12)
| # | Ruling | Applied in |
|---|---|---|
| PS10 | The 4×4 texture uses the **variant** slot: `variants_t = macro.size²`, position-locked `(r mod 4)·4 + (c mod 4)`, "Re-tile layer". Water frames = the style's `anim.frames`, other slots 1, frame 0 = still. | §6.2.2 |
| PS11 | `maskSet` `4bit \| blob47 \| recipe` (**derived**, Keeper: not stored, because the recipe defines it); one overlay per cell, the highest priority, ties by slot order grass, dirt, water, stone | §6.2.2 |
| PS12 | Bakes and measured sheets hold **used cells only**; maps keep theoretical indices; `bakedFrom.cellMap` | §6.2.2, §6.2.3, §7.4 |
| PS13 | Body fields as the Architect named them; `stoneKind` retired with a converter (`paint-style 001`); `grass`/`water`/`sand` @2, 16 new @1 recipes; default tile types PROPOSED pending L27 (**r13: confirmed**, R13-2/R13-3) | §6.2.2, §6.2.5, §12 |
| PS14 | `params.paintScale` (hashed, omitted at 1); `nativeScale = paintScale`; integer copy; wizard pairs; `settings.paintStyleDefault` | §3.1, §6.2.2 |
| PS15 (owner ruling) | Decoded = used cells × paint px² × 4 × frames, **plus** the ×`paintScale²` copy as a separate line, counted whenever the engine caches it | §10 decoded meter |
| PS16 (**confirmed by the Engine Architect**) | Prototype lava is **`lava@2`** (**r13: retired, ruling C; it's `lava@3`, parked**); frozen ids are never reused, and a clash takes the next version. The `te-classic@1` `recipes` shape. `PAINT_PROC_CACHES_SCALED = false` for painter v0.6 (no double count with the chunk cache); a caching painter declares `true` and bumps its version. | §6.2.2, §6.2.5, §10 |

### 14.6h r13 in place: owner, CoS/CEO and Engine Architect rulings (2026-11-09)
| # | Ruling | By | Applied in |
|---|---|---|---|
| R13-1 | **Deck composition is project data**, not a behaviour: `decks/<id>.json` `deck` v1 `{id, rev, name, entries[{cardId, copies ≥ 0}], subclass?}`. Behaviours reference deck ids and never hold counts. **CoS-approved, PROPOSED pending build.** No migration (new). | Keeper; CoS approved | §6.8, §7.2 5c, §12 Kinds |
| R13-2 | **`ice@1` defaults to `floor`**, not water. Slipperiness would be a future rule/behaviour. It's PARKED, and the user can retype it. | Keeper | §6.2.2 |
| R13-3 | **GAP 7 closed:** `water`/`lava`/`wall-block` CONFIRMED (rev 10 + L34). Invariant: no unit ever occupies an `open: false` tile. | Engine Architect | §6.4, core-types |
| R13-4 | `kills_on_landing` at any move end (normal, forced, warp, summon), never mid-path; scope `terrain.lethal_landing_scope` `any` \| `forced_only` (Librarian, L36) | Engine Architect | §6.4, core-types |
| R13-5 | `push_into_walls` on: stop on the last open cell, event `pushBlocked {unit, blocker: wall-block\|edge\|unit, cellsRemaining}` (`CoreEvent` with `landedOn`, MAY-MOVE); damage is a push-behaviour rules knob | Engine Architect | §6.4, setup-format L34 |
| R13-6 | Ability composition: `modifiers[] {setupId, role}`; scalers → primary → riders; soft cap 4; primary owns targeting/group/effect/cost. **SIGNED OFF** by the Engine Architect (22:1x): flat (`nestedModifierIgnored`), self/cycle = `invalidValue` (H2), missing = `unknownRef`. | Engine Architect (shape), Keeper (setupId) | setup-format §2.11, §7.2 step 3 |
| R13-7 | The locked → format recipe table: 24 recipes = 7 shipped + 15 reserved/parked + 2 excluded. `lane@1`, `water@3`, `btf-ashroad@1`, `btf-moonlit@1` are **defective, not publishable** (import/history only). `grass@2`/`sand@2`/`lava@2` are retired, never reused. | Engine Architect (rulings A–C) | §6.2.2, §6.2.5 ruling 5 |
| R13-8 | **Studio-own art may ship in the built-in library** (`LicenseRef-TileEngine-Own`, author `RaiKynn`). Two cases: (a) **`painter-proto` output** (tiles, characters, markers, buildings, Atmosphere; code-drawn, CoS-verified) → `source: "own, procedural"`, `aiGenerated: false`, **no disclosure**; (b) **BTF game image art** (prop and sprite PNGs, Grok Imagine) → `source: "own, AI-generated (Grok Imagine)"`, `aiGenerated: true`, with the badge and credits note required. The library = Kenney CC0 **or** studio-own with author, `source` and `aiGenerated` (K1/K4 widened; `builtinNotCC0` doesn't fire). Not provisional. **They can be pulled later.** | CEO via CoS; Engine Architect (CI shape) | §6.2.4, §6.2.5 ruling 4, §7.4 |
| R14-1 | **Amends R13-8:** studio-own art is **project content (or a later library revision), NOT the v1 built-in library** (Kenney-only). Licence CI = **ARCHITECTURE v0.6.1 §14.2**: `CC0-1.0` + `LicenseRef-TileEngine-Own` only; two source strings each tied to `aiGenerated`; `provisional` fails library builds and release exports, and warns in dev; also checks the export's `credits/licenses.json`. | Engine Architect | §6.2.4 |
| R14-2 | **Empty deck, RULED:** card-hand group only; with `hand-and-draw.deck` `null`, the pile = one copy of each ability in the group (runtime only, never written), `deckMissing`, wizard prompt. Action-menu groups have no pile. | Engine Architect | §6.8 |
| R14-3 | `deck_size`'s retired answer is **kept inactive** in `orphans` (visible, read for `deckSizeDerived`, ignored by runtime), never wiped. Librarian asked to rename `dropped-with-notice` (L39). | Keeper | setup-format §8.2 |
| R14-4 | Lane tag `logic.lanes?` (row-major ints, 0 = none), read only with `lanes_enabled`; absent = derived bands (formula PROPOSED for the Engine Architect) | Keeper (CoS: lanes optional) | §6.4, core-types |
| R14-5 | G2 correction: riders keep their targeting (re-anchored on the primary's targets); scalers lose it; no pipe = instant cast at the caster's cell (rev 15 encoding: `target_pipes: []` + `targeting: "none"`) | Engine Architect | setup-format §2.11 |
| R14-6 | `map.paths?` ordered routes; `contiguous` (default true) = orthogonal steps only; all problems are warnings; distinct from lanes (areas vs routes). **PROPOSED, not v1-blocking.** | Keeper (CEO mode order via MODES-v2) | §6.4, core-types |
| R14-7 | `save` v1 document (SimSnapshot: `header {projectHash, engineVersion}`, `clockMs`, `rngState`, `units`, `phases`, `logSeq`), its own migrations, never in the closure and never edits the project; `settings.offlineCapMs`. **PROPOSED.** | Keeper (MODES-v2) | §6.9, §3.1 |
| R14-8 | `settings.occupancy` `strict1` (default) \| `softStack` \| `laneSlots` (MODES-v2 names); the v1 core is `strict1` only and warns on the others. **PROPOSED.** | Keeper (MODES-v2) | §3.1, core-types |
| R14-9 | `buildable` is a `terrain.tile_types` toggle (L41, **adopted in rev 15**), not a core flag or map layer | Keeper | setup-format §12.5 |
| R14-10 | `settings.occupancy` is the single source; `one_unit_per_tile` is converted (true → strict1, false → softStack), with the old answer kept inactive in orphans; the editor shows only the occupancy picker (L42). `offlineCapMs` 8 h default accepted. | Engine Architect | §3.1, setup-format §8.2 |
| R14-11 | Save `projectHash` mismatch: Resume (default) with `saveProjectMismatch`, or Start fresh, keeping a backup; never delete; missing refs dropped, each with `saveRefDropped` | Engine Architect | §6.9 |
| R14-12 | Even `lane_count`: centre lanes `n/2` and `n/2 + 1`; a single centre defaults to `n/2`, as an option where a behaviour uses it (L43) | Engine Architect | §6.4 |
| R14-13 | Licence strict FAIL only for the built-in library and `settings.studioProject: true` release exports; end-user projects warn (`ownCreditIncomplete`, `licenseUnlisted`), accept any licence including `"own"`, and still generate credits | Engine Architect | §3.1, §6.2.4 (ARCH §14.2) |
| R14-14 | Catalogue rev 15 adopted (63 behaviours, 538 knobs; L39–L43); **superseded by rev 17** (544 knobs; L44, R14-16) | Librarian | setup-format §12.4h, §12.4i |
| R14-15 | **Bot opening formation is the user's choice** (CEO 2026-11-09 via the CoS): `unit-roster.opening_row` = `back` (default; six on the far rank) \| `second` (six on the second rank) \| `front` (five on the front rank, per-deck shapes). New optional deck field `openingFront?` (5 unit ids, west to east), with fallback to `back` + `openingShapeMissing` once per deck; bad ids `unknownRef`; no migration. Librarian L44. | CEO via CoS | §6.8, setup-format §12.4h/§12.5 |
| R14-16 | Catalogue rev 17 adopted (544 knobs); **superseded by rev 23** (563 knobs; setup-format r28 §12.4j). L44 shipped as `deck.openingFront` (`unitId[]`, exactly 5; `second` in rev 16; the `front` label is "Five on the front rank (deck shape)"). `UnitId` is the canonical unit-id alias (TS sketch, core-types). | Librarian; Keeper | §6.8, §16, core-types |
| R13-9 | Catalogue rev 13 (L35): neutral #8a8f98, reserved player/rival/neutral, `keyed_by: "side"` | Librarian | §6.5, setup-format §12.4f |

### 14.6 Scope calls S1–S4 (CEO)
- S1: editor-only levels, Stage select, enemy pools, Loadout, no caps (§6.5, §6.6, §10, §13)
- S2: offline core plus `extensions.online` (§9)
- S3: full editing on Android (§1)
- S4: Android and iOS targets (§3.1)

## 15. Out of scope, questions and conflicts
- **Out of scope:** player save games inside exported games; RNG and seeds; the online module's API; the in-game level maker (C5).
- **Resolved in r3:**
  - Q7: a per-stage loadout exists, and `stage.loadout` replaces the project loadout whole.
  - Q8, Q9, Q10: CoS rulings (§14.4).
- **X1 (conflict, Editor & UX):** `ux/new-project-wizard.md` still has the in-game level maker entry. Drop it (C5). Also K14, "Shrink to fit" becomes a resample at import.
- **X2 (conflict, Engine Architect):** ARCH §3.4 says the shortcut "is not stored separately". The catalogue stores it as the required `shortcut` answer. The effect is the same, with one source.
- **X3 resolved (r4):** ARCH §12.5 v0.4 supports both paths. The non-integer path is opt-in through `advancedRender`, and is shipped only when used.
- Q11 (difficulty scope) and Q12 (`easeMs`) are decided (§14.4, §3.1).
- **Librarian:** L11 and L13–L18 shipped in rev 7. Open: L19 (`effect` ref → effect documents; retire `saved_effects`), L20 (`min_items`, `max_items_hard`), L21 (item field types `colour`/`text`/`tile`/`tiles` + the missing skillrig fields), L22 (`ability_group` + `effect` on `objective-contest` and `sword-lifecycle`), L23 (reserved-id wording) (setup-format §12.5).
- **Engine Architect:** sheet layout v1, JCS, relative effect points and map 004 `fit: tile` are settled (r8, §14.6d). **Open:**
  - Confirm the cell order (variant before mask).
  - The recipes `dirt`/`wood`/`snow` and the icon set.
  - Per-fill bakes of team tokens.
  - Stock wall-line constants and `asset` wall drawing.
  - Triggers for `stage.placedEffects`.
  - **Map props:** art-upload r2 §3.12 places library trees and a cottage as tall props, but maps have no prop or object placement (only tile layers). That needs a home: proposed as a later map `objects[]` layer, not designed here.
- **CEO / CoS (from ARCH §14 and proposal §9):** BTF art groups need ownership confirmation before "Link to library" exists. Is `ownerConfirmation` per group or per file? That's a library-file question, not a project-format one.
- **Librarian:** L24 `terrain.wall_blocks_los` / `wall_blocks_shots`; L25 `unit-roster.clip_cues` (both Architect-confirmed r7); **L27** generic tile types for the procedural recipes. Team colours shipped in rev 8 as L26; setup-format r8 asks for a nullable `team_colour` (**L30**). Full list in setup-format §12.5.
- **Editor & UX, CEO questions in art-upload §5:** **answered (r7)**: tile size suggested per platform and stored explicitly; 1×1 footprint with tall overhang and `footprint` reserved; parallax as `background.layers[]` with `depth` (one home); exact dedupe.

## 16. TypeScript sketch
```ts
// packages/project/src/types/project.ts. Shared types only (C1).
import type { BehaviourSetup, BehaviourPreset, KnobValue, History, CheckRow } from "./setup";
export type Sq = { c: number; r: number };
export type AssetId = `asset_${string}`;
export type UnitId = string;   // r14: a unit document id (units/<id>.json); mirrors core-types UnitId
export type AssetKind = "tileset" | "sprite" | "image" | "background" | "page" | "audio";
// 23:1x / 00:2x PROPOSED: audio types (ProcAudioOrigin, AudioBinding, MusicSlot, ProjectAudio, StageAudio, AudioVariant) live in audio-format.md §9 until accepted.
export type Clip = { name: string; frames: number[]; fps?: number; ms?: number[]; loop?: boolean;
  events?: { frame: number; name: string }[];                                  // r35 CN-014, sprite; ≤ 16 fire
  points?: Partial<Record<"hand" | "tip" | "head" | "centre", ([number, number] | null)[]>> };   // r35 CN-014, whole art px; no foot (= anchor)
export type LightSource = { radius: number /* int ≥ 1, art px */; colour?: string /* "#rrggbb", default "#ffb048" */ };   // r30, ACCEPTED r31
export type MotionCycle = { ramp: { name: string; steps: number[] } | string[] /* "#rrggbb"[]; index form under a style; literal colours only on an unstyled asset */; ms?: number /* int 50–1000, default 150 */ };
export type MotionScroll = { step: number /* int ≥ 1, must divide the tile size on that axis */; axis?: "x" | "y" /* default "x" */; ms?: number /* int 50–1000, default 200 */ };
export type MotionSway = { trunkFrom: number /* int ≥ 0, required */; edge?: number /* int 1–4, default 2 */; ms?: number /* int 100–1000, default 400 */ };
export type Motion = { cycle?: MotionCycle; scroll?: MotionScroll; sway?: MotionSway };   // r32
export type DeriveOp =                                               // r5 §6.2.1, applied in order
  | { op: "crop"; x: number; y: number; w: number; h: number }
  | { op: "pad"; left: number; top: number; right: number; bottom: number; fill: "transparent" | "edge" | string }
  | { op: "scale"; k: number }                                       // integer ≥ 2, or 0.5 / 0.25
  | { op: "colourKey"; colour: string; tolerance?: number }
  | { op: "slice" }                                                  // cell = this asset's tile
  | { op: "dedupe"; removedCount: number }
  | { op: "cropFrames"; frame: { w: number; h: number }; rect: { x: number; y: number; w: number; h: number } };   // r8
export type ProcTerrain = { recipe: string; version: number; seed: number; palette?: { base: string; accent: string; shade?: string } | string;
  pattern?: { kind: "flat" | "noise" | "stripes" | "brick" | "waves" | "checker"; scale?: number; variation?: number /* int % */ };
  edges?: { style: "none" | "outline" | "bevel" | "autotile"; mask: 4 | 8; width: number; priority: number }; variants?: number;
  anim?: null | { kind: string; frames: number; ms: number } };
export type ProcToken = { recipe: "token"; version: number; shape: "circle" | "square" | "triangle" | "diamond" | "hex";
  glyph: null | { type: "letter"; value: string } | { type: "icon"; value: string }; fill?: string /* absent = team colour, resolved per stage; never stored */;
  outline: { colour: string; width: number } | null; font: "pixel" | { family: string; weight: number }; shadow: boolean; seed: number;
  anim: null | { kind: "bob" | "hit"; frames: number; ms: number } };
export type PaintStylePin = { id: string; version: number };   // r10, ref string `<id>@<version>`
export type PaintStyleDoc = { kind: "paint-style"; formatVersion: 2 /* r12 */; lookHash?: string /* 16 hex pixel fingerprint, MANIFEST 2026-11-09 */; id: string; version: number; name: string; painter: number; sha256: string /* of JCS(body) */; body: PaintStyleBody /* field names: Engine Architect, ARCH v0.6 §13.11 */ };
export type Slot = "grass" | "dirt" | "water" | "stone";
export type PaintStyleBody = { palette: "locked" | "from-params"; ramps?: Record<string, string[]>; light?: "top-left"; recipes: Partial<Record<Slot, string /* recipe@version */>>;
  liquidEdge?: "foam" | "ice" | "ember" | "murk"; labels?: Partial<Record<Slot, string>>; anim?: { frames: number; ms: number } | null; priority?: Partial<Record<Slot, number>>;
  macro?: { size: 1 | 2 | 4; origin: "map" }; dither?: { kind: "bayer4"; amplitude: number; accentSteps: number }; paintSize?: 16 | 32 | 64; preview?: { map: string }; shore?: false | { foamPx?: number; shallowPx?: number; waveGap?: number; frames?: number; ms?: number } /* r32, water slot; absent or {} = on when liquidEdge is foam; false = off */ };   // r12   // r10, immutable per version
export type MaskSet = "4bit" | "blob47" | "recipe";   // r12, derived per terrain (never stored)
export const PAINT_PAIRS = { 64: [32, 2], 96: [32, 3], 48: [16, 3], 32: [32, 1], 16: [16, 1] } as const;   // r12 wizard pairs: map tile → [paintSize, paintScale]
export type ProcParams = { painter: number; size: { w: number; h: number }; paintScale?: number /* r12: int ≥ 1, omitted at 1, hashed; terrains only */; paintStyle?: PaintStylePin /* terrains: required from v6; token: reserved (r11), never written in v1, ignored on read, hashed */; terrains?: ProcTerrain[]; token?: ProcToken; motion?: Motion /* r32; hashed; a stored AssetMeta motion on a procedural asset is ignored with styleParamIgnored */ };   // JCS (RFC 8785, UTF-8); ints/strings
// r18 (ACCEPTED (CEO 2026-11-12 04:22; sprite-recipe-rulings.md r1.1)): ProcParams also takes  sprite?: ProcSprite  (exactly one of terrains / token / sprite; size not stored for sprite; paintScale allowed; paintStyle reserved)
export type ProcSprite = { recipe: string /* sprite_<ULID> */; hash: string /* 64 hex sha256(JCS(paint form)) */; variant?: string };   // project.ts, not core-types
export type LibraryRef = { libraryId: string; assetKey: string; rev: number };   // r17/r18, pack-format.md §4.2 (EA signed off 2026-11-12)
export type MapObject = { id: string; assetId: AssetId; at: Sq; footprint?: { w: number; h: number } /* reserved, 1×1 */;
  blocks?: boolean /* default false */; blocks_los?: boolean | null; blocks_shots?: boolean | null /* null = inherit terrain knobs */;
  lightSource?: LightSource | null /* r30, ACCEPTED r31: per-placement override, replaced whole; null = no light */;
  motion?: Motion | null /* r32, CEO 18:04 via CoS: per-placement override, replaced whole; null = no motion */ };   // r9
export type WallLook = { mode: "line" | "asset" | "invisible"; colour?: string; width?: number; assetId?: AssetId };   // r8, visual only
export type AssetMeta = {                                            // v2 (r3; r5 adds derivedFrom, role). Geometry lives only here.
  name: string; kind: AssetKind; ext?: "png" | "webp" | "jpg" | "ogg" | "mp3";   // absent only for procedural
  origin: { kind: "upload"; fileName: string; bakedFrom?: { assetId: AssetId; painter: number; paintStyle?: PaintStylePin; cellMap?: number[] /* r12 */; recipes: { id: string; version: number }[]; at: string } }
        | { kind: "builtin"; libraryId?: string; assetKey?: string; rev?: number; src?: string }   // old copies: src only (legacy)
        | { kind: "procedural"; params: ProcParams; from?: LibraryRef /* r17; not hashed */ };   // ext absent; geometry derived
  credit?: { author?: string; license?: string /* SPDX id or "own"; expected on builtin copies */; url?: string; title?: string; note?: string; status?: "provisional" /* r13; absent = final */; source?: string /* r13 */; aiGenerated?: boolean /* r13; default false */ };
  sheetLayout?: 1;                                                   // bakes only (r8)
  paintScale?: number;                                               // bakes only (r12): nativeScale of a paint-px bake
  tileTypeOverrides?: Record<string, string>;                         // procedural: recipeId → tile type id
  filter?: "nearest" | "smooth";                                     // default nearest
  tile?: { w: number; h: number };                                   // tileset
  grid?: { columns?: number; rows?: number; margin?: number; spacing?: number }; // columns/rows derived when absent
  tileProps?: Record<string, { anim?: string; logic?: string /* tile type id (r5) */; lightSource?: LightSource /* r31 */; motion?: Motion /* r32 */ }>;
  frame?: { w: number; h: number }; layout?: "grid" | "packed"; frames?: { name?: string; x: number; y: number; w: number; h: number }[];
  anchor?: { x: number; y: number; units: "px" | "norm" } | "auto"; // default {0.5, 1, norm}
  clips?: Clip[];
  pages?: { assetId: AssetId; x: number; y: number; w: number; h: number }[]; // pageOf is derived
  derivedFrom?: { assetId: AssetId; ops: DeriveOp[] };              // assetId is a role:"source" asset
  role?: "source";
  noMirror?: boolean;                                                // r6, default false (§7.3 step 2)
  lightSource?: LightSource;                                         // r30, ACCEPTED r31; sprite, image; tilesets: tileProps[i]
  nightVariant?: AssetId;                                            // r30, ACCEPTED r31; on the day asset
  motion?: Motion;                                                   // r32; sprite, tileset, image; tilesets may also set tileProps[i].motion
};
export type AssetDerived = { nativeScale: number; nativeTile?: { w: number; h: number }; nativeFrame?: { w: number; h: number };
  cells?: number; uniqueTiles?: number; paddingCells?: number; decodedBytes: number | null; odd: boolean };   // never stored
export const TILE_SIZE_SUGGESTION: Record<"mobile" | "pc" | "both", number> = { mobile: 64, pc: 48, both: 64 };   // §3.1, editor-only, never stored
export type Difficulty = { hp: number; damage: number; appliesTo: "enemies" | "all" | "player" };
export type Loadout = { roster: UnitId[]; size: number; required: UnitId[] };
export type RenderSelection = { excludedStages: string[]; targets: ("browser" | "android" | "ios")[]; proceduralShip: "auto" | "bake" | "live"; credits: boolean };
export type ProjectStored = {
  id: string; rev: number; name: string; createdAt: string; updatedAt: string;
  copiedFrom: { projectId: string; rev: number; at: string } | null; catalogueRev: number;
  settings: { platform: "mobile" | "pc" | "both"; combat: "grid-tactics";
    camera: { view: "top-down"; pixelPerfect: boolean; follow: "fixed" | "selected"; followDeadZone: number; easeMs: number;
      zoom: number; zoomMin: number; zoomMax: number; edgePan: boolean };
    tileSize: number; fog: boolean; wrapEdges: boolean; occupancy?: "strict1" | "softStack" | "laneSlots" /* r14 PROPOSED */; offlineCapMs?: number /* r14 PROPOSED */; online?: { sync: boolean; syncAdapter?: string; backend: { endpoint: string; clientId?: string /* public only */ } | null } /* PROPOSED, sync-format r4 */; advancedRender: boolean /* default false; user action only */; screenFit: "letterbox" | "crop"; letterboxColour: string; maxImageSide: number };
  stages: string[]; rules: string[]; loadout: Loadout; difficulty: Difficulty; render: RenderSelection; assets: Record<AssetId, AssetMeta>;
  gameSettings?: unknown /* PROPOSED; shape owned by profile-format.md §3.4 (game-settings customisation); per-player values never here */;
};
export type Extensions = { online?: { module: string; moduleVersion: string; config: unknown }; [ns: string]: unknown };
export type Presentation = "unit-action-menu" | "card-hand";
export type ResolvedPresentation = { groups: { id: string; presentation: Presentation }[]; usesCardHand: boolean; usesMenu: boolean };
export type ProjectIndex = { computedAt: string; projectRev: number; catalogueRev: number;
  setups: { id: string; behaviourId: string; rev: number; playable: boolean; warnings: number; used: boolean }[];
  behaviours: { id: string; setupIds: string[]; active: boolean; used: boolean }[];
  presets: { ref: string; file: string | null; referencedBy: string[] }[];
  paintStyles: { ref: string /* <id>@<version> */; file: string | null /* null = not embedded */; usedBy: AssetId[] }[];   // r10
  units: { id: string; setupIds: string[]; onStages: string[]; used: boolean }[];
  maps: { id: string; cols: number; rows: number; usedByStages: string[] }[];
  stages: { id: string; mapRef: string; selected: boolean }[];
  assets: { id: AssetId; sha256: string; bytes: number | null; mime: string | null; w: number | null; h: number | null; decodedBytes: number | null; nativeScale: number; cells?: { used: number; theoretical: number | null } /* procedural, r12 */; usedBy: { kind: string; id: string }[]; used: boolean }[];
  effects: { id: string; name: string; tags: string[]; referencedBy: string[]; used: boolean }[];   // sorted by name, then id (r7)
  presentation: ResolvedPresentation;
  export: { stages: string[]; setups: string[]; behaviours: string[]; units: string[]; effects: string[]; assets: AssetId[]; extensions: string[];
    errors: { code: "H1" | "H2" | "H3" | "H4" | "H5" | "H6"; where: string; detail: string }[]; warnings: { code: string; where: string; detail: string }[] };
  size: { totalBytes: number; fileCount: number; files: { path: string; bytes: number; kind: AssetKind | "data" | "procedural"; estimate?: boolean }[];
    byKind: Record<AssetKind | "data" | "procedural", number>;
    decoded: { totalBytes: number; images: { assetId: AssetId; w: number; h: number; bytes: number }[]; stagePeak: { stageId: string; bytes: number } | null;
      chunkCacheBytes: { phone: number; desktop: number };
      scaledCopies?: { cached: boolean; bytes: number; countedBytes: number; assets: { assetId: AssetId; paintScale: number; bytes: number }[] } };   // r12   // shown as "decoded + chunk cache (estimate)"
    meters: { key: string; value: number; soft: number | null; strong: number | null; level: "ok" | "warn" | "strong" }[]; warnings: { code: string; detail: string }[] };
  notes: { open: number; total: number } };
export type ProjectManifest = { kind: "tile-project"; formatVersion: 6 /* r10 */; project: ProjectStored; extensions?: Extensions; index: ProjectIndex };
export type Layered = { value: KnobValue; rev: number };
export type Unit = { kind: "unit"; formatVersion: 2; id: string; rev: number; name: string; sprite: AssetId | null; setupIds: string[];
  stats: Record<string, Layered>; footprint?: { w: number; h: number } /* absent = 1×1; v1 plays 1×1 only */; history: History; createdAt: string; updatedAt: string };
export type BackgroundLayer = { assetId: AssetId; depth: number /* 0..1, default 1 = scrolls with the map */; repeat: "none" | "x" | "y" | "both";
  fit?: "none" | "cover" | "stretch" };                              // cover/stretch resolve to none unless advancedRender
export type MapBackground = { colour?: string; layers: BackgroundLayer[] };   // r7: the only home of parallax; soft cap 3 layers (warning)
export const BACKGROUND_LAYERS_SOFT_MAX = 3;
export type MapLayer = { id: string; name?: string; tileset: AssetId | null; aboveUnits: boolean; visible: boolean; autotile?: 4 | 8; tiles: (number | null)[] };   // grid-locked
export type Edge = { c: number; r: number; side: "n" | "e" | "s" | "w"; look?: WallLook };   // stored once per wall: e/s only on the map border
export type GameMap = { kind: "map"; formatVersion: 5; id: string; rev: number; name: string; cols: number; rows: number;
  tile: { w: number; h: number } | null; background: MapBackground; layers: MapLayer[]; wallLook?: WallLook; seeThroughCanopy?: boolean /* r32, CEO 18:04 via CoS; default false, absent = false; maker-only */; objects?: MapObject[]; paths?: { id: string; cells: Sq[]; contiguous?: boolean }[] /* r14 PROPOSED */;
  logic: { terrain: number[]; palette: Record<string, string /* terrain.tile_types id */>; edges: Edge[]; lanes?: number[] /* r14: 0 = none */ }; createdAt: string; updatedAt: string };
export type EditorPrefs = { kind: "editor-prefs"; formatVersion: 1;                 // §11.3, outside the project
  maps: Record<string /* projectId/mapId */, { zoom: number; minimap: boolean; activeLayer: string; walkRulesOverlay: boolean }>;
  sizeThresholds?: Record<string, { soft: number | null; strong: number | null }> };
export type Facing = "N" | "E" | "S" | "W";   // r13: N=up, E=right, S=down, W=left (clip suffixes)
export type SpawnSq = Sq & { facing?: Facing | null };   // r13; a plain Sq is valid
export type EnemyPool =
  | { mode: "fixed"; entries: { unitId: UnitId; at: Sq; facing?: Facing | null }[] }
  | { mode: "weighted"; picks: number; allowRepeats: boolean; spawns: SpawnSq[]; entries: { unitId: UnitId; weight: number }[] }
  | { mode: "waves"; spawns: SpawnSq[]; waves: { turn: number; entries: { unitId: UnitId; count: number }[] }[] };
export type PlacedEffect = { id: string; effect: string; at: Sq /* integer */;
  trigger: "stage_start" | "round_start" | "turn_start" | "unit_enters" | "unit_ends_turn_on" | "event";
  side?: string /* any | player | rival | sideId; default any */; every?: number; from_round?: number; event?: string;
  repeat?: "once" | "always" | number; enabled?: boolean };   // r9, stage-authored, map-absolute
export type Deck = { kind: "deck"; formatVersion: 1; id: string; rev: number; name: string;   // r13, PROPOSED pending build
  entries: { cardId: string; copies: number }[]; subclass?: string; openingFront?: UnitId[] /* r14: exactly 5, west→east (catalogue rev 17 L44) */ };
export type Stage = { kind: "stage"; formatVersion: 2; id: string; rev: number; name: string; mapRef: string; placedEffects?: PlacedEffect[];
  playerSpawns: SpawnSq[]; neutrals: { unitId: UnitId; at: Sq; facing?: Facing | null; side?: string; setupIds?: string[] /* r15, DECIDED r40: NPC role setups */ }[]; enemyPool: EnemyPool;
  seed?: number | null /* r13 */; sides?: { loadout?: string; enemyPool?: string; neutrals?: string } /* r13, sideIds */; loadout: Loadout | null; rules: string[];
  overrides: { setups: Record<string /*behaviourId*/, Record<string, Layered>>; units: Record<string, Record<string, Layered>> };
  difficulty: Partial<Difficulty> | null;
  history: History; createdAt: string; updatedAt: string };
export type Anchor =
  | { kind: "setup"; setupId: string; setupRev: number } | { kind: "answer"; setupId: string; knobId: string; setupRev: number; answerRev: number }
  | { kind: "asset"; assetId: AssetId } | { kind: "stage"; stageId: string } | { kind: "tile"; stageId: string; at: Sq } | { kind: "unit"; unitId: UnitId };
export type GodmodeTarget = { kind: "setup"; setupId: string } | { kind: "unit"; unitId: UnitId };
export type Note = { id: string; kind: "bug" | "note"; status: "open" | "fixed" | "wontfix"; text: string; createdAt: string; updatedAt: string; statusAt: string;
  capture: { stageId: string; playMs: number; turn: number | null; projectRev: number; godmode: { target: GodmodeTarget; knobId: string; value: KnobValue }[] };
  anchors: Anchor[] };
export type ProjectNotes = { kind: "project-notes"; formatVersion: 2; rev: number; notes: Note[] };
// @te/project (read): readProject(files) → {store, needsMigration[]}, computeIndex(store), exportClosure(store),
//   effectiveRender(settings, map) → {pixelPerfect, fit, nonIntegerPath: boolean}  (applies advancedRender),
//   resolveValue(store, stageId, target, knobId) → {value, base, layer: "L0"|"L1"|"L2"|"L3"|"L4", fromStageRules: boolean, difficulty?: number},
//   resolvePresentation(store, stageId) → ResolvedPresentation, activeBehaviours(store, stageId), checkProject(store) → {errors, warnings}, readBundle(json),
//   resolveTile(store, stageId, mapId, sq) → tile type item, wallsOf(map) → canonical Edge[], assetDerived(meta, store) → AssetDerived.
// @te/project-write: openProject (migrate + renames + drift), saveProject(store, expectedRev), duplicateProject, shareProject(store, {keepOnline?, stripHistory?, stripSources?}),
//   saveBackGodmode(store, {target, knobId, value, scope: "stage" | "all", stageId, allStagesTarget?: "project" | "stageRules"}), setDifficulty(store, scope, partial),
//   setStageLoadout(store, stageId, Loadout | null), setStageRules(store, stageId, setupIds), importPrototype(localStorageDump), addNote, setNoteStatus,
//   importAsset(file, ops: DeriveOp[]) → {source, derived}, refixAsset(store, assetId, ops), autoSlice(store, sourceId, tile) → {tileset, map},
//   paintLogic(map, sq, tileTypeId), toggleEdge(map, edge), createEffect, createProcedural(params), editProcedural(assetId, params) (re-ids + rewrites refs),
//   duplicateEffect(id), deleteEffect(id, {switchToNone?}), saveAndUseEffect(ownerSetupId, from?), forkEffectForStage(effectId, stageId, ownerSetupId, values),
//   bakeAsset(assetId), backToGenerated(bakedId), copyFromLibrary(libraryId, assetKey), diffLibraryAsset, updateFromLibrary(assetId, fields), retileLayer(map, layerId), readEditorPrefs / writeEditorPrefs.
```

### 16.1 Core read-only types (`core-types.ts`, 21:5x)
**[core-types.ts](core-types.ts)** is the **single source** of the minimal read-only types the engine core steps read (clock, grid + edges, unit + occupancy, events/command log, rng, state tables). It's destined for `packages/project/src/types`.
- **Contents:** map size and logic (r14: optional `lanes`), edges, tile-type walkability, `push_into_walls`, units, stage placement and setup refs, side ids, and version guards.
- Every field is `readonly`, mirrors a name in this file or setup-format exactly, and is tagged STABLE or MAY-MOVE.
- The core reads the post-migration shape only.
- Where the core needs something this format doesn't hold, it's listed there as a GAP, not added here. **r13:** all GAPs are resolved by the Engine Architect's rulings: GAPs 1–6 (facing, seed, sides, `wrapEdges`, footprint), and GAP 7 in place (22:0x: water/lava/wall-block confirmed, the open:false invariant, `lethal_landing_scope`). `ResolvedPlacement` is a **core runtime type**, kept separate and never stored.
- When a field it mirrors changes in this file, `core-types.ts` changes in the same revision. It must compile with `tsc --noEmit --strict`.

## 17. Examples
Asset hashes and byte counts are **illustrative**, because there are no art files on this machine. Everything else uses real catalogue rev 7 data and real engine paths. Map tiles are shown in full (6×9). The project is at `catalogueRev` 7. Its `terrain` setup is setup-format §10.10, and the `line-shot` setup that points at an effect document is setup-format §10.11.

Catalogue note (r7; r9; r11): §17.1–17.6 are **catalogue rev 7 snapshots**. Every knob id, option value, ref, reserved id, preset id and `per_unit` key in them was re-checked against **rev 8, 9, 10, 12, 13, 14 and 15** (`_gen/verify_r8.py`: 0 problems at rev 12; no example answers a booth knob, so the rev 12 default move only adds default answers). None of them has a `cue`, `team_colour_override`, `points_anchor` or point answer, so the rev 9/10 converters touch nothing; all 10 BTF effect ids still resolve. Loading them at rev 8 is ordinary drift (setup-format r8 §8.2, §10.12): the new knobs get default answers, `saved_effects` answers move to `orphans`, and nothing is flagged (added item fields aren't a change, setup-format r8 §8.2).

### 17.1 `project.json` (v5 snapshot; tile-project 005 pins its code tile to `te-classic@1`, shown in §17.9; r6: the black knight has `noMirror`, because its sword hand isn't symmetric; a `terrain` setup in rules; "My tiles" derived from a kept `role:"source"` original by crop + colour key + ×4, so `nativeScale` 4 = 16 px art; the archer is a 4-row walk sheet with facing clips; r7/r8: a **procedural code-tile** tileset (unused here, so it's in no closure; it would ship by `proceduralShip: "auto"`), `render.proceduralShip`/`credits`, and decoded meters per target with Architect thresholds)
Stage 2 is unticked for Render, and the online module is present. `project.rules` holds the required `ability-presentation` setup (All menu), the all-stage `win-condition`, and a `hand-and-draw` setup that is **kept but inactive**: no group uses card hand on any selected stage, so it is not exported (§7.2 step 4).
- The painted sky is over 4096 px, so its two pages are exported instead of it.
- The JPG floor tileset gets an info note.
- `index.size` targets browser and Android: the general meter, the itch.io HTML5 meters and the Play base module meter, all `ok`.
- Decoded meters (r7): `settings.platform` is `mobile`, so browser rates as **web mobile** (iOS figures) and Android as Android. Each has a stage peak and a project total, all `ok`. The editor shows "35.4 MB decoded + 96 MB chunk cache ≈ 131 MB (estimate)".
- The **code tile** asset (art-upload r2 §3.9: Grass + Water, Noise/Waves, pattern size 2/3, variation 18 %/30 %, "New mix" seeds) is a procedural tileset. It's in the index with `bytes`/`mime` null and `w`/`h` derived by **sheet layout v1** (r9 cell order terrain → variant → mask → frame). **r12: the stored/measured sheet holds only used cells.** This asset is unused, so `cells.used` = 0, `w`/`h` are `null` and `decodedBytes` is 0. Its **theoretical** index space is grass 2 variants × 16 masks × 1 frame (32) + water 2 × 16 × 4 frames (128) = **160 cells** (`cells.theoretical`). That would be a 13 × 13 grid, 832 × 832 px, if it were ever all used. It's `te-classic`-style generic recipes (`macro.size` 1, maskSet `4bit`), so variants stay random 0–1, not position-locked. The id is unchanged, because the layout isn't in `params`. All params are integers or strings, so there's no `floatParam`.
```json
{
 "kind": "tile-project",
 "formatVersion": 5,
 "project": {
  "id": "project_01JC9A1B2C3D4E5F6G7H8J9K0M",
  "rev": 18,
  "name": "Ascension Duel",
  "createdAt": "2026-11-09T19:10:00Z",
  "updatedAt": "2026-11-09T20:05:00Z",
  "copiedFrom": null,
  "catalogueRev": 7,
  "settings": {
   "platform": "mobile",
   "combat": "grid-tactics",
   "camera": {
    "view": "top-down",
    "pixelPerfect": true,
    "follow": "fixed",
    "followDeadZone": 0.6,
    "easeMs": 120,
    "zoom": 1,
    "zoomMin": 1,
    "zoomMax": 2,
    "edgePan": false
   },
   "tileSize": 64,
   "fog": false,
   "wrapEdges": false,
   "advancedRender": false,
   "screenFit": "letterbox",
   "letterboxColour": "#000000",
   "maxImageSide": 4096
  },
  "stages": ["stage_01JC9E1A2B3C4D5E6F7G8H9J0K", "stage_01JC9E2L3M4N5P6Q7R8S9T0V1W"],
  "rules": ["setup_01JC9G1A2B3C4D5E6F7G8H9J0K", "setup_01JC8Z6Q4M2W9K7T3R5N1B0XAA", "setup_01JC9F1X2Y3Z4A5B6C7D8E9F0G", "setup_01JC9F2H3J4K5M6N7P8Q9R0S1T", "setup_01JC9G2L3M4N5P6Q7R8S9T0V1W", "setup_01JC9H1T2E3R4R5A6I7N8T9Y0P"],
  "loadout": {
   "roster": ["unit_01JC9A5B6C7D8E9F0G1H2J3K4M", "unit_01JC9D1E2F3G4H5J6K7M8N9P0Q", "unit_01JC9D2R3S4T5V6W7X8Y9Z0A1B"],
   "size": 2,
   "required": ["unit_01JC9A5B6C7D8E9F0G1H2J3K4M"]
  },
  "difficulty": {
   "hp": 1,
   "damage": 1,
   "appliesTo": "enemies"
  },
  "render": {
   "excludedStages": ["stage_01JC9E2L3M4N5P6Q7R8S9T0V1W"],
   "targets": ["browser", "android"],
   "proceduralShip": "auto",
   "credits": true
  },
  "assets": {
   "asset_3f9a1c0e7b2d4a68": {
    "name": "Stone floor",
    "kind": "tileset",
    "ext": "jpg",
    "origin": {
     "kind": "builtin",
     "src": "/tower/stage/tower-floor-1.jpg?v=1"
    },
    "tile": {
     "w": 64,
     "h": 64
    },
    "grid": {
     "columns": 1,
     "rows": 1
    },
    "tileProps": {
     "0": {
      "logic": "floor"
     }
    }
   },
   "asset_9c4e2b7a1d0f5e33": {
    "name": "Angel warrior",
    "kind": "sprite",
    "ext": "png",
    "origin": {
     "kind": "builtin",
     "src": "/tower/season3/angel-warrior.png?v=3"
    },
    "frame": {
     "w": 64,
     "h": 64
    },
    "layout": "grid",
    "anchor": "auto",
    "clips": [
     {
      "name": "idle",
      "frames": [0, 1, 2, 3],
      "fps": 6
     },
     {
      "name": "attack",
      "frames": [4, 5, 6, 7],
      "ms": [80, 80, 60, 200],
      "loop": false
     }
    ]
   },
   "asset_7a2c9e4b0d1f3a55": {
    "name": "Angel archer",
    "kind": "sprite",
    "ext": "png",
    "origin": {
     "kind": "builtin",
     "src": "/tower/season3/angel-archer.png?v=2"
    },
    "frame": {
     "w": 64,
     "h": 64
    },
    "clips": [
     {
      "name": "down",
      "frames": [0, 1, 2, 3],
      "fps": 6
     },
     {
      "name": "left",
      "frames": [4, 5, 6, 7],
      "fps": 6
     },
     {
      "name": "right",
      "frames": [8, 9, 10, 11],
      "fps": 6
     },
     {
      "name": "up",
      "frames": [12, 13, 14, 15],
      "fps": 6
     }
    ],
    "grid": {
     "columns": 4,
     "rows": 4
    }
   },
   "asset_c08e5d3b2a7f1964": {
    "name": "Black knight",
    "kind": "sprite",
    "ext": "png",
    "origin": {
     "kind": "builtin",
     "src": "/tower/season3/black-knight.png?v=1"
    },
   "noMirror": true
   },
   "asset_7876f28255bb866d": {
    "name": "Meadow and lagoon (code tiles)",
    "kind": "tileset",
    "origin": {
     "kind": "procedural",
     "params": {
      "painter": 1,
      "size": {
       "w": 64,
       "h": 64
      },
      "terrains": [
       {
        "recipe": "grass",
        "version": 1,
        "seed": 1234,
        "palette": {
         "base": "#4f8a3c",
         "accent": "#7cb85a"
        },
        "pattern": {
         "kind": "noise",
         "scale": 2,
         "variation": 18
        },
        "edges": {
         "style": "autotile",
         "mask": 4,
         "width": 3,
         "priority": 1
        },
        "variants": 2,
        "anim": null
       },
       {
        "recipe": "water",
        "version": 1,
        "seed": 77,
        "palette": {
         "base": "#2f6fb0",
         "accent": "#8fc3ef"
        },
        "pattern": {
         "kind": "waves",
         "scale": 3,
         "variation": 30
        },
        "edges": {
         "style": "autotile",
         "mask": 4,
         "width": 3,
         "priority": 0
        },
        "variants": 2,
        "anim": {
         "kind": "ripple",
         "frames": 4,
         "ms": 180
        }
       }
      ]
     }
    },
    "tileTypeOverrides": {"grass": "vines"},
    "credit": {"author": "Generated by TileEngine", "license": "CC0-1.0"}
   },
   "asset_51d7e0a9c3b84f20": {
    "name": "My tiles",
    "kind": "tileset",
    "ext": "png",
    "origin": {
     "kind": "upload",
     "fileName": "forest-tiles.png"
    },
    "tile": {
     "w": 64,
     "h": 64
    },
    "grid": {
     "columns": 16,
     "rows": 8,
     "margin": 0,
     "spacing": 0
    },
    "clips": [
     {
      "name": "lava",
      "frames": [24, 25, 26, 27],
      "fps": 4
     }
    ],
    "tileProps": {
     "24": {
      "anim": "lava",
      "logic": "lava"
     }
    },
    "derivedFrom": {
     "assetId": "asset_0d1e2f3a4b5c6d7e",
     "ops": [
      {"op": "crop", "x": 2, "y": 0, "w": 256, "h": 128},
      {"op": "colourKey", "colour": "#ff00ff"},
      {"op": "scale", "k": 4}
     ]
    }
   },
   "asset_e2b4c6d8f0a1b3c5": {
    "name": "Sky (painted)",
    "kind": "background",
    "ext": "png",
    "origin": {
     "kind": "upload",
     "fileName": "sky.png"
    },
    "filter": "smooth",
    "pages": [
     {"assetId": "asset_a1c3e5f7092b4d6e", "x": 0, "y": 0, "w": 3600, "h": 1200},
     {"assetId": "asset_b2d4f6081a3c5e7f", "x": 3600, "y": 0, "w": 3600, "h": 1200}
    ]
   },
   "asset_a1c3e5f7092b4d6e": {
    "name": "Sky (painted) p1",
    "kind": "page",
    "ext": "png",
    "origin": {
     "kind": "upload",
     "fileName": "sky.png"
    },
    "filter": "smooth"
   },
   "asset_b2d4f6081a3c5e7f": {
    "name": "Sky (painted) p2",
    "kind": "page",
    "ext": "png",
    "origin": {
     "kind": "upload",
     "fileName": "sky.png"
    },
    "filter": "smooth"
   },
   "asset_0d1e2f3a4b5c6d7e": {
    "name": "My tiles (original)",
    "kind": "tileset",
    "ext": "png",
    "origin": {
     "kind": "upload",
     "fileName": "forest-tiles.png"
    },
    "role": "source"
   }
  }
 },
 "extensions": {
  "online": {
   "module": "my-p2p-relay",
   "moduleVersion": "0.3.1",
   "config": {
    "room": "ascension-duel"
   }
  }
 },
 "index": {
  "computedAt": "2026-11-09T20:05:00Z",
  "projectRev": 18,
  "catalogueRev": 7,
  "setups": [
   {"id": "setup_01JC9G1A2B3C4D5E6F7G8H9J0K", "behaviourId": "ability-presentation", "rev": 3, "playable": true, "warnings": 0, "used": true},
   {"id": "setup_01JC8Z6Q4M2W9K7T3R5N1B0XAA", "behaviourId": "mana-pool", "rev": 4, "playable": true, "warnings": 0, "used": true},
   {"id": "setup_01JC9F1X2Y3Z4A5B6C7D8E9F0G", "behaviourId": "unit-roster", "rev": 2, "playable": true, "warnings": 0, "used": true},
   {"id": "setup_01JC9F2H3J4K5M6N7P8Q9R0S1T", "behaviourId": "win-condition", "rev": 1, "playable": true, "warnings": 0, "used": true},
   {"id": "setup_01JC9F3U4V5W6X7Y8Z9A0B1C2D", "behaviourId": "win-condition", "rev": 1, "playable": true, "warnings": 0, "used": false},
   {"id": "setup_01JC9A7Z8Y9X0W1V2U3T4S5R6Q", "behaviourId": "trap-tile", "rev": 2, "playable": true, "warnings": 0, "used": true},
   {"id": "setup_01JC9B0A1B2C3D4E5F6G7H8J9K", "behaviourId": "line-shot", "rev": 1, "playable": true, "warnings": 0, "used": false},
   {"id": "setup_01JC9G2L3M4N5P6Q7R8S9T0V1W", "behaviourId": "hand-and-draw", "rev": 1, "playable": true, "warnings": 0, "used": false},
   {"id": "setup_01JC9H1T2E3R4R5A6I7N8T9Y0P", "behaviourId": "terrain", "rev": 2, "playable": true, "warnings": 0, "used": true}
  ],
  "behaviours": [
   {
    "id": "ability-presentation",
    "setupIds": ["setup_01JC9G1A2B3C4D5E6F7G8H9J0K"],
    "active": true,
    "used": true
   },
   {
    "id": "mana-pool",
    "setupIds": ["setup_01JC8Z6Q4M2W9K7T3R5N1B0XAA"],
    "active": true,
    "used": true
   },
   {
    "id": "unit-roster",
    "setupIds": ["setup_01JC9F1X2Y3Z4A5B6C7D8E9F0G"],
    "active": true,
    "used": true
   },
   {
    "id": "win-condition",
    "setupIds": ["setup_01JC9F2H3J4K5M6N7P8Q9R0S1T", "setup_01JC9F3U4V5W6X7Y8Z9A0B1C2D"],
    "active": true,
    "used": true
   },
   {
    "id": "trap-tile",
    "setupIds": ["setup_01JC9A7Z8Y9X0W1V2U3T4S5R6Q"],
    "active": true,
    "used": true
   },
   {
    "id": "line-shot",
    "setupIds": ["setup_01JC9B0A1B2C3D4E5F6G7H8J9K"],
    "active": true,
    "used": false
   },
   {
    "id": "hand-and-draw",
    "setupIds": ["setup_01JC9G2L3M4N5P6Q7R8S9T0V1W"],
    "active": false,
    "used": false
   },
   {
    "id": "terrain",
    "setupIds": ["setup_01JC9H1T2E3R4R5A6I7N8T9Y0P"],
    "active": true,
    "used": true
   }
  ],
  "presets": [
   {
    "ref": "preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q@1",
    "file": "presets/preset_01JC8Z0F1S7Y2D4H6J8K0M2P4Q@1.json",
    "referencedBy": ["setup_01JC8Z6Q4M2W9K7T3R5N1B0XAA"]
   },
   {
    "ref": "builtin:trap-tile/btf-trap@3",
    "file": "presets/builtin~trap-tile~btf-trap@3.json",
    "referencedBy": ["setup_01JC9A7Z8Y9X0W1V2U3T4S5R6Q"]
   }
  ],
  "units": [
   {
    "id": "unit_01JC9A5B6C7D8E9F0G1H2J3K4M",
    "setupIds": ["setup_01JC9A7Z8Y9X0W1V2U3T4S5R6Q"],
    "onStages": ["stage_01JC9E1A2B3C4D5E6F7G8H9J0K", "stage_01JC9E2L3M4N5P6Q7R8S9T0V1W"],
    "used": true
   },
   {
    "id": "unit_01JC9D1E2F3G4H5J6K7M8N9P0Q",
    "setupIds": [],
    "onStages": ["stage_01JC9E1A2B3C4D5E6F7G8H9J0K", "stage_01JC9E2L3M4N5P6Q7R8S9T0V1W"],
    "used": true
   },
   {
    "id": "unit_01JC9D2R3S4T5V6W7X8Y9Z0A1B",
    "setupIds": [],
    "onStages": ["stage_01JC9E1A2B3C4D5E6F7G8H9J0K", "stage_01JC9E2L3M4N5P6Q7R8S9T0V1W"],
    "used": true
   },
   {
    "id": "unit_01JC9D3C4D5E6F7G8H9J0K1M2N",
    "setupIds": [],
    "onStages": ["stage_01JC9E1A2B3C4D5E6F7G8H9J0K", "stage_01JC9E2L3M4N5P6Q7R8S9T0V1W"],
    "used": true
   }
  ],
  "maps": [
   {
    "id": "map_01JC9A4N5P6Q7R8S9T0V1W2X3Y",
    "cols": 6,
    "rows": 9,
    "usedByStages": ["stage_01JC9E1A2B3C4D5E6F7G8H9J0K", "stage_01JC9E2L3M4N5P6Q7R8S9T0V1W"]
   }
  ],
  "stages": [
   {"id": "stage_01JC9E1A2B3C4D5E6F7G8H9J0K", "mapRef": "map_01JC9A4N5P6Q7R8S9T0V1W2X3Y", "selected": true},
   {"id": "stage_01JC9E2L3M4N5P6Q7R8S9T0V1W", "mapRef": "map_01JC9A4N5P6Q7R8S9T0V1W2X3Y", "selected": false}
  ],
  "assets": [
   {
    "id": "asset_3f9a1c0e7b2d4a68",
    "sha256": "3f9a1c0e7b2d4a68000000000000000000000000000000000000000000000000",
    "bytes": 48211,
    "mime": "image/jpeg",
    "w": 64,
    "h": 64,
    "decodedBytes": 16384,
    "nativeScale": 1,
    "usedBy": [
     {"kind": "map", "id": "map_01JC9A4N5P6Q7R8S9T0V1W2X3Y"}
    ],
    "used": true
   },
   {
    "id": "asset_9c4e2b7a1d0f5e33",
    "sha256": "9c4e2b7a1d0f5e33000000000000000000000000000000000000000000000000",
    "bytes": 30577,
    "mime": "image/png",
    "w": 256,
    "h": 256,
    "decodedBytes": 262144,
    "nativeScale": 1,
    "usedBy": [
     {"kind": "unit", "id": "unit_01JC9A5B6C7D8E9F0G1H2J3K4M"}
    ],
    "used": true
   },
   {
    "id": "asset_7a2c9e4b0d1f3a55",
    "sha256": "7a2c9e4b0d1f3a55000000000000000000000000000000000000000000000000",
    "bytes": 28804,
    "mime": "image/png",
    "w": 256,
    "h": 256,
    "decodedBytes": 262144,
    "nativeScale": 1,
    "usedBy": [
     {"kind": "unit", "id": "unit_01JC9D1E2F3G4H5J6K7M8N9P0Q"},
     {"kind": "unit", "id": "unit_01JC9D2R3S4T5V6W7X8Y9Z0A1B"}
    ],
    "used": true
   },
   {
    "id": "asset_c08e5d3b2a7f1964",
    "sha256": "c08e5d3b2a7f1964000000000000000000000000000000000000000000000000",
    "bytes": 33120,
    "mime": "image/png",
    "w": 256,
    "h": 256,
    "decodedBytes": 262144,
    "nativeScale": 1,
    "usedBy": [
     {"kind": "unit", "id": "unit_01JC9D3C4D5E6F7G8H9J0K1M2N"}
    ],
    "used": true
   },
   {
    "id": "asset_51d7e0a9c3b84f20",
    "sha256": "51d7e0a9c3b84f20000000000000000000000000000000000000000000000000",
    "bytes": 161230,
    "mime": "image/png",
    "w": 1024,
    "h": 512,
    "decodedBytes": 2097152,
    "nativeScale": 4,
    "usedBy": [],
    "used": false
   },
   {
    "id": "asset_e2b4c6d8f0a1b3c5",
    "sha256": "e2b4c6d8f0a1b3c5000000000000000000000000000000000000000000000000",
    "bytes": 2911044,
    "mime": "image/png",
    "w": 7200,
    "h": 1200,
    "decodedBytes": 34560000,
    "nativeScale": 1,
    "usedBy": [
     {"kind": "map", "id": "map_01JC9A4N5P6Q7R8S9T0V1W2X3Y"}
    ],
    "used": true
   },
   {
    "id": "asset_a1c3e5f7092b4d6e",
    "sha256": "a1c3e5f7092b4d6e000000000000000000000000000000000000000000000000",
    "bytes": 1460210,
    "mime": "image/png",
    "w": 3600,
    "h": 1200,
    "decodedBytes": 17280000,
    "nativeScale": 1,
    "usedBy": [
     {"kind": "asset", "id": "asset_e2b4c6d8f0a1b3c5"}
    ],
    "used": true
   },
   {
    "id": "asset_b2d4f6081a3c5e7f",
    "sha256": "b2d4f6081a3c5e7f000000000000000000000000000000000000000000000000",
    "bytes": 1449873,
    "mime": "image/png",
    "w": 3600,
    "h": 1200,
    "decodedBytes": 17280000,
    "nativeScale": 1,
    "usedBy": [
     {"kind": "asset", "id": "asset_e2b4c6d8f0a1b3c5"}
    ],
    "used": true
   },
   {
    "id": "asset_0d1e2f3a4b5c6d7e",
    "sha256": "0d1e2f3a4b5c6d7e000000000000000000000000000000000000000000000000",
    "bytes": 9412,
    "mime": "image/png",
    "w": 260,
    "h": 128,
    "decodedBytes": 133120,
    "nativeScale": 1,
    "usedBy": [],
    "used": false
   },
   {
    "id": "asset_7876f28255bb866d",
    "sha256": "7876f28255bb866d36d09a5544d8792eff8a4c6f2c7e5ace90dbc092db892719",
    "bytes": null,
    "mime": null,
    "w": null,
    "h": null,
    "decodedBytes": 0,
    "nativeScale": 1,
    "cells": {"used": 0, "theoretical": 160},
    "usedBy": [],
    "used": false
   }
  ],
  "effects": [
   {
    "id": "effect_01JC9H2W3R4A5T6H7C8O9N0E1A",
    "name": "Wrath cone, then spin",
    "tags": [],
    "referencedBy": ["setup_01JC9B0A1B2C3D4E5F6G7H8J9K"],
    "used": false
   }
  ],
  "presentation": {
   "groups": [
    {"id": "basic", "presentation": "unit-action-menu"},
    {"id": "spells", "presentation": "unit-action-menu"}
   ],
   "usesCardHand": false,
   "usesMenu": true
  },
  "export": {
   "stages": ["stage_01JC9E1A2B3C4D5E6F7G8H9J0K"],
   "setups": ["setup_01JC9G1A2B3C4D5E6F7G8H9J0K", "setup_01JC8Z6Q4M2W9K7T3R5N1B0XAA", "setup_01JC9F1X2Y3Z4A5B6C7D8E9F0G", "setup_01JC9F2H3J4K5M6N7P8Q9R0S1T", "setup_01JC9A7Z8Y9X0W1V2U3T4S5R6Q", "setup_01JC9H1T2E3R4R5A6I7N8T9Y0P"],
   "behaviours": ["ability-presentation", "mana-pool", "unit-roster", "win-condition", "trap-tile", "terrain"],
   "units": ["unit_01JC9A5B6C7D8E9F0G1H2J3K4M", "unit_01JC9D1E2F3G4H5J6K7M8N9P0Q", "unit_01JC9D2R3S4T5V6W7X8Y9Z0A1B", "unit_01JC9D3C4D5E6F7G8H9J0K1M2N"],
   "effects": [],
   "assets": ["asset_3f9a1c0e7b2d4a68", "asset_9c4e2b7a1d0f5e33", "asset_7a2c9e4b0d1f3a55", "asset_c08e5d3b2a7f1964", "asset_a1c3e5f7092b4d6e", "asset_b2d4f6081a3c5e7f"],
   "extensions": ["online"],
   "errors": [],
   "warnings": [
    {"code": "jpgNearest", "where": "assets/asset_3f9a1c0e7b2d4a68", "detail": "info: JPEG with nearest filter may show artefacts at integer zoom"}
   ]
  },
  "size": {
   "totalBytes": 3057195,
   "fileCount": 7,
   "files": [
    {"path": "assets/asset_3f9a1c0e7b2d4a68.jpg", "bytes": 48211, "kind": "tileset"},
    {"path": "assets/asset_9c4e2b7a1d0f5e33.png", "bytes": 30577, "kind": "sprite"},
    {"path": "assets/asset_7a2c9e4b0d1f3a55.png", "bytes": 28804, "kind": "sprite"},
    {"path": "assets/asset_c08e5d3b2a7f1964.png", "bytes": 33120, "kind": "sprite"},
    {"path": "assets/asset_a1c3e5f7092b4d6e.png", "bytes": 1460210, "kind": "page"},
    {"path": "assets/asset_b2d4f6081a3c5e7f.png", "bytes": 1449873, "kind": "page"},
    {"path": "game.json", "bytes": 6400, "kind": "data"}
   ],
   "byKind": {
    "tileset": 48211,
    "sprite": 92501,
    "image": 0,
    "background": 0,
    "page": 2910083,
    "audio": 0,
    "data": 6400,
    "procedural": 0
   },
   "decoded": {
    "totalBytes": 35362816,
    "images": [
     {"assetId": "asset_3f9a1c0e7b2d4a68", "w": 64, "h": 64, "bytes": 16384},
     {"assetId": "asset_9c4e2b7a1d0f5e33", "w": 256, "h": 256, "bytes": 262144},
     {"assetId": "asset_7a2c9e4b0d1f3a55", "w": 256, "h": 256, "bytes": 262144},
     {"assetId": "asset_c08e5d3b2a7f1964", "w": 256, "h": 256, "bytes": 262144},
     {"assetId": "asset_a1c3e5f7092b4d6e", "w": 3600, "h": 1200, "bytes": 17280000},
     {"assetId": "asset_b2d4f6081a3c5e7f", "w": 3600, "h": 1200, "bytes": 17280000}
    ],
    "stagePeak": {
     "stageId": "stage_01JC9E1A2B3C4D5E6F7G8H9J0K",
     "bytes": 35362816
    },
    "chunkCacheBytes": {"phone": 96000000, "desktop": 256000000}
   },
   "meters": [
    {"key": "general.total", "value": 3057195, "soft": 50000000, "strong": 150000000, "level": "ok"},
    {"key": "itch.html5.extracted_total", "value": 3057195, "soft": 450000000, "strong": 480000000, "level": "ok"},
    {"key": "itch.html5.single_file", "value": 1460210, "soft": 180000000, "strong": 190000000, "level": "ok"},
    {"key": "itch.html5.file_count", "value": 7, "soft": 900, "strong": 950, "level": "ok"},
    {"key": "itch.html5.path_length", "value": 33, "soft": 200, "strong": 230, "level": "ok"},
    {"key": "play.base_module", "value": 3057195, "soft": 180000000, "strong": 450000000, "level": "ok"},
    {"key": "decoded.android.stage_peak", "value": 35362816, "soft": 160000000, "strong": 240000000, "level": "ok"},
    {"key": "decoded.android.total", "value": 35362816, "soft": 360000000, "strong": 512000000, "level": "ok"},
    {"key": "decoded.web_mobile.stage_peak", "value": 35362816, "soft": 160000000, "strong": 224000000, "level": "ok"},
    {"key": "decoded.web_mobile.total", "value": 35362816, "soft": 320000000, "strong": 448000000, "level": "ok"}
   ],
   "warnings": []
  },
  "notes": {
   "open": 1,
   "total": 2
  }
 }
}
```

### 17.2 `stages/stage_01JC9E1A2B3C4D5E6F7G8H9J0K.json` (v2: weighted pool, a **stage loadout override** that replaces the project loadout whole, a stage override of `mana-pool.regen` keyed by behaviour id, and the black knight's HP raised on this stage only; difficulty inherited)
```json
{
 "kind": "stage",
 "formatVersion": 2,
 "id": "stage_01JC9E1A2B3C4D5E6F7G8H9J0K",
 "rev": 7,
 "name": "Floor 1: First blood",
 "mapRef": "map_01JC9A4N5P6Q7R8S9T0V1W2X3Y",
 "playerSpawns": [
  {
   "c": 0,
   "r": 7
  },
  {
   "c": 1,
   "r": 7
  },
  {
   "c": 2,
   "r": 8
  }
 ],
 "neutrals": [],
 "enemyPool": {
  "mode": "weighted",
  "picks": 3,
  "allowRepeats": true,
  "spawns": [
   {
    "c": 1,
    "r": 1
   },
   {
    "c": 3,
    "r": 1
   },
   {
    "c": 4,
    "r": 0
   }
  ],
  "entries": [
   {
    "unitId": "unit_01JC9D2R3S4T5V6W7X8Y9Z0A1B",
    "weight": 3
   },
   {
    "unitId": "unit_01JC9D3C4D5E6F7G8H9J0K1M2N",
    "weight": 1
   }
  ]
 },
 "loadout": {
  "roster": [
   "unit_01JC9A5B6C7D8E9F0G1H2J3K4M",
   "unit_01JC9D1E2F3G4H5J6K7M8N9P0Q"
  ],
  "size": 2,
  "required": [
   "unit_01JC9A5B6C7D8E9F0G1H2J3K4M"
  ]
 },
 "rules": [],
 "overrides": {
  "setups": {
   "mana-pool": {
    "regen": {
     "value": 2,
     "rev": 1
    }
   }
  },
  "units": {
   "unit_01JC9D3C4D5E6F7G8H9J0K1M2N": {
    "unit_hp": {
     "value": 15,
     "rev": 1
    }
   }
  }
 },
 "difficulty": null,
 "history": {
  "cap": 200,
  "baseSeq": 1,
  "ops": [
   {
    "seq": 1,
    "at": "2026-11-09T19:52:00Z",
    "kind": "set",
    "changes": [
     {
      "knob": "loadout",
      "before": {
       "inherited": true
      },
      "after": {
       "value": {
        "roster": [
         "unit_01JC9A5B6C7D8E9F0G1H2J3K4M",
         "unit_01JC9D1E2F3G4H5J6K7M8N9P0Q"
        ],
        "size": 2,
        "required": [
         "unit_01JC9A5B6C7D8E9F0G1H2J3K4M"
        ]
       }
      }
     }
    ],
    "note": "stage loadout override"
   }
  ]
 },
 "createdAt": "2026-11-09T19:14:00Z",
 "updatedAt": "2026-11-09T19:52:00Z"
}
```

### 17.2b `stages/stage_01JC9E2L3M4N5P6Q7R8S9T0V1W.json` (v2: **stage rules override project rules**, so its own `win-condition` setup replaces the project one; **Q10** sets presentation to All cards on this stage only; **Q9** sets enemy HP ×1.5 on this stage)
On this stage, "uses card hand" is true, so `hand-and-draw` would be active here. The stage is unticked for Render, so the closure still excludes it. If it were ticked, `hand-and-draw` and its card-hand presentation would ship (r14: no `present-card-hand` behaviour exists).
```json
{
 "kind": "stage",
 "formatVersion": 2,
 "id": "stage_01JC9E2L3M4N5P6Q7R8S9T0V1W",
 "rev": 4,
 "name": "Floor 2: Sudden death",
 "mapRef": "map_01JC9A4N5P6Q7R8S9T0V1W2X3Y",
 "playerSpawns": [
  {
   "c": 0,
   "r": 8
  },
  {
   "c": 1,
   "r": 8
  }
 ],
 "neutrals": [],
 "enemyPool": {
  "mode": "fixed",
  "entries": [
   {
    "unitId": "unit_01JC9D3C4D5E6F7G8H9J0K1M2N",
    "at": {
     "c": 3,
     "r": 0
    }
   }
  ]
 },
 "loadout": null,
 "rules": [
  "setup_01JC9F3U4V5W6X7Y8Z9A0B1C2D"
 ],
 "overrides": {
  "setups": {
   "ability-presentation": {
    "shortcut": {
     "value": "all-cards",
     "rev": 1
    }
   }
  },
  "units": {}
 },
 "difficulty": {
  "hp": 1.5
 },
 "history": {
  "cap": 200,
  "baseSeq": 1,
  "ops": []
 },
 "createdAt": "2026-11-09T19:16:00Z",
 "updatedAt": "2026-11-09T19:40:00Z"
}
```

### 17.2c `setups/setup_01JC9G1A2B3C4D5E6F7G8H9J0K.json` (`ability-presentation`, answered in the wizard; migrated to rev 7, which added `custom_groups` as a default answer)
The per-group pickers are inactive under All menu: kept as defaults, never asked, and not required. `hand_placement` is inactive (no card group).
```json
{
 "kind": "behaviour-setup",
 "formatVersion": 3,
 "id": "setup_01JC9G1A2B3C4D5E6F7G8H9J0K",
 "rev": 3,
 "name": "Presentation",
 "behaviourId": "ability-presentation",
 "catalogue": {
  "rev": 7
 },
 "createdAt": "2026-11-09T19:10:00Z",
 "updatedAt": "2026-11-09T19:40:00Z",
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
  }
 },
 "orphans": {},
 "history": {
  "cap": 200,
  "baseSeq": 1,
  "ops": [
   {
    "seq": 1,
    "at": "2026-11-09T19:10:30Z",
    "kind": "set",
    "note": "wizard",
    "changes": [
     {
      "knob": "shortcut",
      "before": {
       "source": "default",
       "defaultRef": {
        "rev": 6
       },
       "needsReask": null
      },
      "after": {
       "source": "user",
       "value": "all-menu",
       "defaultRef": {
        "rev": 6
       },
       "needsReask": null
      }
     }
    ]
   },
   {
    "seq": 2,
    "at": "2026-11-09T19:40:00Z",
    "kind": "migrate",
    "changes": [],
    "note": "catalogue drift 6 → 7: added custom_groups (default)"
   }
  ]
 }
}
```

### 17.3 `units/unit_01JC9A5B6C7D8E9F0G1H2J3K4M.json` (own HP 12 over the army 9, saved back from Preview)
```json
{
 "kind": "unit",
 "formatVersion": 2,
 "id": "unit_01JC9A5B6C7D8E9F0G1H2J3K4M",
 "rev": 4,
 "name": "Warrior A",
 "sprite": "asset_9c4e2b7a1d0f5e33",
 "setupIds": [
  "setup_01JC9A7Z8Y9X0W1V2U3T4S5R6Q"
 ],
 "stats": {
  "unit_hp": {
   "value": 12,
   "rev": 1
  }
 },
 "history": {
  "cap": 200,
  "baseSeq": 1,
  "ops": [
   {
    "seq": 1,
    "at": "2026-11-09T19:33:00Z",
    "kind": "set",
    "note": "preview",
    "changes": [
     {
      "knob": "unit_hp",
      "before": {
       "inherited": true
      },
      "after": {
       "value": 12
      }
     }
    ]
   }
  ]
 },
 "createdAt": "2026-11-09T19:12:00Z",
 "updatedAt": "2026-11-09T19:33:00Z"
}
```

### 17.4 `maps/map_01JC9A4N5P6Q7R8S9T0V1W2X3Y.json` (v5, 6×9, shared by both stages; inherits a 64 px tile; the painted sky is one background layer at **depth 0.5** (what map 004 writes from the v4 `background {mode:"parallax", scroll: 0.5}`; the simple screen's Depth slider); one grid-locked ground layer; one ground layer; separate logic with a palette (`floor`, `vines`) and three walls: two between ranks 3 and 4, and one on the east border. r8: no `wallLook`, so walls draw as the stock line, except the border wall, whose `look` makes it invisible (it still blocks))
```json
{
 "kind": "map",
 "formatVersion": 5,
 "id": "map_01JC9A4N5P6Q7R8S9T0V1W2X3Y",
 "rev": 7,
 "name": "Floor 1",
 "cols": 6,
 "rows": 9,
 "tile": null,
 "background": {
  "layers": [
   {"assetId": "asset_e2b4c6d8f0a1b3c5", "depth": 0.5, "repeat": "none", "fit": "none"}
  ]
 },
 "layers": [
  {
   "id": "ground",
   "tileset": "asset_3f9a1c0e7b2d4a68",
   "aboveUnits": false,
   "visible": true,
   "tiles": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
 ],
 "logic": {
  "terrain": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "palette": {
   "0": "floor",
   "1": "vines"
  },
  "edges": [
   {"c": 2, "r": 4, "side": "n"},
   {"c": 3, "r": 4, "side": "n"},
   {"c": 5, "r": 6, "side": "e", "look": {"mode": "invisible"}}
  ]
 },
 "createdAt": "2026-11-09T19:11:00Z",
 "updatedAt": "2026-11-09T19:55:00Z"
}
```

### 17.5 `notes/notes.json`
```json
{
 "kind": "project-notes",
 "formatVersion": 2,
 "rev": 3,
 "notes": [
  {
   "id": "note_01JC9C1D2E3F4G5H6J7K8M9N0P",
   "kind": "bug",
   "status": "open",
   "text": "Mana went above 12 after a refund on kill. Cap should hold.",
   "createdAt": "2026-11-09T19:31:05Z",
   "updatedAt": "2026-11-09T19:31:05Z",
   "statusAt": "2026-11-09T19:31:05Z",
   "capture": {
    "stageId": "stage_01JC9E1A2B3C4D5E6F7G8H9J0K",
    "playMs": 84210,
    "turn": 6,
    "projectRev": 11,
    "godmode": [
     {
      "target": {
       "kind": "setup",
       "setupId": "setup_01JC8Z6Q4M2W9K7T3R5N1B0XAA"
      },
      "knobId": "regen",
      "value": 3
     }
    ]
   },
   "anchors": [
    {
     "kind": "answer",
     "setupId": "setup_01JC8Z6Q4M2W9K7T3R5N1B0XAA",
     "knobId": "cap",
     "setupRev": 4,
     "answerRev": 1
    },
    {
     "kind": "tile",
     "stageId": "stage_01JC9E1A2B3C4D5E6F7G8H9J0K",
     "at": {
      "c": 1,
      "r": 7
     }
    }
   ]
  },
  {
   "id": "note_01JC9C3Q4R5S6T7U8V9W0X1Y2Z",
   "kind": "note",
   "status": "fixed",
   "text": "Warrior sprite feet float above the slab.",
   "createdAt": "2026-11-09T19:32:40Z",
   "updatedAt": "2026-11-09T19:39:00Z",
   "statusAt": "2026-11-09T19:39:00Z",
   "capture": {
    "stageId": "stage_01JC9E1A2B3C4D5E6F7G8H9J0K",
    "playMs": 179950,
    "turn": 11,
    "projectRev": 11,
    "godmode": []
   },
   "anchors": [
    {
     "kind": "asset",
     "assetId": "asset_9c4e2b7a1d0f5e33"
    },
    {
     "kind": "unit",
     "unitId": "unit_01JC9A5B6C7D8E9F0G1H2J3K4M"
    }
   ]
  }
 ]
}
```

### 17.6 `catalogue/slice.json` (excerpt: the `gates` table and one behaviour, generated from live rev 7; the real slice also holds `ability-presentation`, `terrain` and every used behaviour)
```json
{
 "kind": "catalogue-slice",
 "formatVersion": 1,
 "schema_version": 3,
 "catalogue_rev": 7,
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
     "proposed": ["min", "max"],
     "status": {
      "default": "ai-match",
      "min": "PROPOSED",
      "max": "PROPOSED",
      "options": null,
      "step": "ai-match"
     },
     "rev": 1,
     "default_history": [
      {"rev": 1, "default": 6}
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
     "proposed": ["min", "max"],
     "status": {
      "default": "ai-match",
      "min": "PROPOSED",
      "max": "PROPOSED",
      "options": null,
      "step": "ai-match"
     },
     "rev": 1,
     "default_history": [
      {"rev": 1, "default": 9}
     ],
     "renamed_from": [],
     "depends_on": []
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
     "proposed": [],
     "status": {
      "default": "ai-match",
      "min": "ai-match",
      "max": "ai-match",
      "options": null,
      "step": "ai-match"
     },
     "rev": 1,
     "default_history": [
      {"rev": 1, "default": 6}
     ],
     "renamed_from": [],
     "depends_on": ["board_cols"]
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
     "proposed": ["min"],
     "status": {
      "default": "ai-match",
      "min": "PROPOSED",
      "max": "ai-match",
      "options": null,
      "step": "ai-match"
     },
     "rev": 1,
     "default_history": [
      {"rev": 1, "default": 9}
     ],
     "renamed_from": [],
     "depends_on": [],
     "per_unit": true
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
     "proposed": ["min", "max"],
     "status": {
      "default": "ai-match",
      "min": "PROPOSED",
      "max": "PROPOSED",
      "options": null,
      "step": "ai-match"
     },
     "rev": 1,
     "default_history": [
      {"rev": 1, "default": 1}
     ],
     "renamed_from": [],
     "depends_on": [],
     "per_unit": true
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
      {"value": "back", "label": "Own back row"},
      {"value": "front", "label": "Own front row"}
     ],
     "proposed": [],
     "status": {
      "default": "ai-match",
      "min": null,
      "max": null,
      "options": "ai-match",
      "step": null
     },
     "rev": 1,
     "default_history": [
      {"rev": 1, "default": "back"}
     ],
     "renamed_from": [],
     "depends_on": []
    },
    {
     "id": "one_unit_per_tile",
     "label": "One unit per tile",
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
     "rev": 7,
     "default_history": [
      {"rev": 7, "default": true}
     ],
     "renamed_from": [],
     "depends_on": [],
     "proposed_options": [false]
    }
   ],
   "presets": [],
   "renamed_from": [],
   "retired_knobs": [],
   "menu_order": [
    {
     "question": "Board size?",
     "knob_ids": ["board_cols", "board_rows"]
    },
    {
     "question": "How many pieces?",
     "knob_ids": ["piece_count"]
    },
    {
     "question": "Health and attack?",
     "knob_ids": ["unit_hp", "unit_atk"]
    },
    {
     "question": "Where do they start?",
     "knob_ids": ["opening_row"]
    },
    {
     "question": "Can two units share a tile?",
     "knob_ids": ["one_unit_per_tile"]
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
   ]
  }
 ]
}
```

### 17.7 Shape tokens (a baked prop and a live unit token) and a library copy (r7, r8: §6.2.2–6.2.4; `project.assets` excerpt)
- **Prop token** `asset_5fad61487b6526c9` (id = SHA-256 over the UTF-8 JCS bytes of its params): a diamond with a star icon and a fixed `fill` (UX `propColour`). After **Bake to image** it is the hidden `role:"source"` original, with no `ext` and no stored geometry.
- The baked PNG is an ordinary upload with stored geometry and `sheetLayout: 1` (2 bob frames → 2 cells, cols = min(ceil(√2), 64) = 2, so 128 × 64). `bakedFrom` names the original instead of copying params.
- **Unit token** `asset_fa56ce395a15b5bc`: a circle with the letter K and **no `fill`**, so its colour is the army's team colour, resolved per stage (`unit-roster.team_colour`, `null` → `team_colours`, L30). Bake to image is unavailable. Render's bake mode bakes one sheet per resolved fill. The pixel font means it's painted, not system-baked.
- The library copy carries `libraryId`/`assetKey`/`rev` and its copied `credit` with the licence (`credit.license`). If the installed Tiny Town is at rev 3, that's a notice, and "Update from library" diffs against rev 2.
```json
{
 "assets": {
  "asset_5fad61487b6526c9": {
   "name": "Star marker (prop)",
   "kind": "sprite",
   "origin": {
    "kind": "procedural",
    "params": {
     "painter": 1,
     "size": {
      "w": 64,
      "h": 64
     },
     "token": {
      "recipe": "token",
      "version": 1,
      "shape": "diamond",
      "glyph": {
       "type": "icon",
       "value": "star"
      },
      "fill": "#d9a441",
      "outline": {
       "colour": "#1a1a2e",
       "width": 2
      },
      "font": "pixel",
      "shadow": true,
      "seed": 9,
      "anim": {
       "kind": "bob",
       "frames": 2,
       "ms": 400
      }
     }
    }
   },
   "role": "source"
  },
  "asset_6b1f0c9e2d4a7358": {
   "name": "Star marker (prop) (baked)",
   "kind": "sprite",
   "ext": "png",
   "origin": {
    "kind": "upload",
    "fileName": "Star marker (prop) (baked).png",
    "bakedFrom": {
     "assetId": "asset_5fad61487b6526c9",
     "painter": 1,
     "recipes": [
      {
       "id": "token",
       "version": 1
      }
     ],
     "at": "2026-11-09T20:05:00Z"
    }
   },
   "sheetLayout": 1,
   "frame": {
    "w": 64,
    "h": 64
   },
   "layout": "grid",
   "clips": [
    {
     "name": "idle",
     "frames": [
      0,
      1
     ],
     "fps": 2.5
    }
   ],
   "credit": {
    "author": "Generated by TileEngine",
    "license": "CC0-1.0"
   }
  },
  "asset_fa56ce395a15b5bc": {
   "name": "Knight token",
   "kind": "sprite",
   "origin": {
    "kind": "procedural",
    "params": {
     "painter": 1,
     "size": {
      "w": 64,
      "h": 64
     },
     "token": {
      "recipe": "token",
      "version": 1,
      "shape": "circle",
      "glyph": {
       "type": "letter",
       "value": "K"
      },
      "outline": {
       "colour": "#1a1a2e",
       "width": 2
      },
      "font": "pixel",
      "shadow": true,
      "seed": 3,
      "anim": null
     }
    }
   }
  },
  "asset_8d2e4f6a0b1c3e57": {
   "name": "Tiny Town grass",
   "kind": "tileset",
   "ext": "png",
   "origin": {
    "kind": "builtin",
    "libraryId": "kenney-tiny-town",
    "assetKey": "tile_0000",
    "rev": 2
   },
   "tile": {
    "w": 16,
    "h": 16
   },
   "credit": {
    "author": "Kenney",
    "license": "CC0-1.0",
    "url": "https://kenney.nl/assets/tiny-town",
    "title": "Tiny Town"
   }
  }
 }
}
```

### 17.8 Map objects and stage-placed effects (r9; excerpts)
- `star-1` is decoration: the baked prop from §17.7, not blocking, drawn row-sorted with units.
- `crate-1` blocks movement and LOS (`blocks_los: null` inherits `terrain.wall_blocks_los`, default true), but lets shots pass (`blocks_shots: false`).
- **Stage-placed effects:** `vent-1` plays on any rival unit that ends its turn on c2 r5 from round 2 on, through the UNIT pipe. `opening` plays once at stage start, through the TILE pipe at c3 r4.
- Objects aren't stage-overridable (§6.4).
```json
{
 "map_excerpt": {
  "kind": "map",
  "formatVersion": 5,
  "objects": [
   {
    "id": "star-1",
    "assetId": "asset_6b1f0c9e2d4a7358",
    "at": {
     "c": 1,
     "r": 2
    }
   },
   {
    "id": "crate-1",
    "assetId": "asset_6b1f0c9e2d4a7358",
    "at": {
     "c": 4,
     "r": 6
    },
    "blocks": true,
    "blocks_los": null,
    "blocks_shots": false
   }
  ]
 },
 "stage_excerpt": {
  "kind": "stage",
  "formatVersion": 2,
  "placedEffects": [
   {
    "id": "vent-1",
    "effect": "btf-purple-drop",
    "at": {
     "c": 2,
     "r": 5
    },
    "trigger": "unit_ends_turn_on",
    "side": "rival",
    "every": 1,
    "from_round": 2,
    "repeat": "always",
    "enabled": true
   },
   {
    "id": "opening",
    "effect": "effect_01JC9H2W3R4A5T6H7C8O9N0E1A",
    "at": {
     "c": 3,
     "r": 4
    },
    "trigger": "stage_start",
    "repeat": "once"
   }
  ]
 }
}
```

### 17.9 Paint styles (r10; **rewritten r12** for ARCH v0.6 §13.11–13.12): a pinned BTF style at ×2, an embed, a migrated v5 code tile, a map-scope upgrade (excerpts)
- **`asset_a67365afdadeeae0`** (credit: studio-own, procedural, no AI disclosure, §6.2.4) is a "Paint with code" sheet in **`btf-ashroad@1`**: the `grass` slot (**`grass@3`**, r13 re-key of the locked `grass@1`, §6.2.5 table) and the `dirt` slot (`dirt@1`), painted at **32 px** and shown at **`paintScale: 2`** on a 64 px map (the wizard pair 64 = 32 × 2). There are no `palette`/`pattern`/`edges`/`variants` params: the style owns them.
  - Derived: `nativeScale` 2 ("32 px drawn at ×2"); no tile warning (32 × 2 = 64).
  - variants_t = 16 (macro 4, position-locked); maskSet `recipe`; frames_t = 1 for both slots (only `water` animates).
- **Used cells:** placed on a 12 × 8 map (ARCH §13.3's sample), it uses **92 cells** (frame 0 only; no water).
  - So the sheet is n = 92, cols = min(ceil(√92), 128) = **10**, rows = 10, giving **320 × 320 px at paint px**.
  - Decoded estimate = 92 × 32² × 4 × 1 = **376,832 B**.
  - The ×2 runtime copy would be 92 × 64² × 4 = **1,507,328 B**. It's shown as its own meter line, and counted only while the engine caches scaled cells (§10 `decoded.scaledCopies`; ARCH v0.6 doesn't, so it reads "not cached, 0 B").
- **`asset_6da4af68c4ea5d42`** is §17.1's code tile after tile-project 005. It has the same params plus `te-classic@1`; there's no `paintScale` (absent = 1, so the id is the same as r10's). Pixels are unchanged, and it's unused, so it has 0 used cells.
- Ids are real: the 16 hex of SHA-256 over the JCS params (integers and strings only).
```json
{
 "asset_a67365afdadeeae0": {
  "name": "Ashroad ground",
  "kind": "tileset",
  "origin": {
   "kind": "procedural",
   "params": {
    "painter": 1,
    "size": {
     "w": 32,
     "h": 32
    },
    "paintScale": 2,
    "paintStyle": {
     "id": "btf-ashroad",
     "version": 1
    },
    "terrains": [
     {
      "recipe": "grass",
      "version": 3,
      "seed": 24301
     },
     {
      "recipe": "dirt",
      "version": 1,
      "seed": 24302
     }
    ]
   }
  },
  "credit": {
   "author": "RaiKynn",
   "license": "LicenseRef-TileEngine-Own",
   "source": "own, procedural",
   "aiGenerated": false
  }
 },
 "asset_6da4af68c4ea5d42": {
  "name": "Meadow code tiles",
  "kind": "tileset",
  "origin": {
   "kind": "procedural",
   "params": {
    "painter": 1,
    "size": {
     "w": 64,
     "h": 64
    },
    "paintStyle": {
     "id": "te-classic",
     "version": 1
    },
    "terrains": [
     {
      "recipe": "grass",
      "version": 1,
      "seed": 1234,
      "palette": {
       "base": "#4f8a3c",
       "accent": "#7cb85a"
      },
      "pattern": {
       "kind": "noise",
       "scale": 2,
       "variation": 18
      },
      "edges": {
       "style": "autotile",
       "mask": 4,
       "width": 3,
       "priority": 1
      },
      "variants": 2,
      "anim": null
     },
     {
      "recipe": "water",
      "version": 1,
      "seed": 77,
      "palette": {
       "base": "#2f6fb0",
       "accent": "#8fc3ef"
      },
      "pattern": {
       "kind": "waves",
       "scale": 3,
       "variation": 30
      },
      "edges": {
       "style": "autotile",
       "mask": 4,
       "width": 3,
       "priority": 0
      },
      "variants": 2,
      "anim": {
       "kind": "ripple",
       "frames": 4,
       "ms": 180
      }
     }
    ]
   }
  },
  "tileTypeOverrides": {
   "grass": "vines"
  }
 }
}
```
`paint-styles/btf-ashroad@1.json` (`paint-style` **v2**: the body fields are the Engine Architect's, ARCH v0.6 §13.11; `stoneKind` is gone, replaced by `recipes.stone`; `sha256` is over `JCS(body)`). **21:4x:** `lookHash` is the manifest's frozen pixel fingerprint. `sha256` stays the body hash: it's a different quantity, so it isn't replaced by the manifest value. **r13 (22:0x):** the body is the converter's output for the locked `btf-ashroad@1` (§6.2.5 rulings 1–2 and the table): `grass@3`, `dirt@1`, `water@3` (7 frames), `cobble@1`. The ids and `sha256` here are recomputed; the ramps are still illustrative, and `btf-ashroad@1` is now superseded by the default `@2` and **defective, not publishable** (r13 ruling A: `styleDefective` until upgraded), which is exactly the upgrade shown below:
```json
{
 "kind": "paint-style",
 "formatVersion": 2,
 "id": "btf-ashroad",
 "version": 1,
 "name": "BTF Ashroad (day)",
 "painter": 1,
 "sha256": "48bfe2649bfef014351053d0cfa25a0d2e53869752ce65f57b27b2c1894f251c",
 "lookHash": "04e805181c5a4dc4",
 "body": {
  "palette": "locked",
  "ramps": {
   "grass": [
    "#353b14",
    "#474e1b",
    "#5a6323",
    "#6b7432",
    "#7f8640",
    "#9aa055"
   ],
   "dirt": [
    "#4d431f",
    "#6c592f",
    "#86653c",
    "#977244",
    "#a6804f",
    "#bc9866"
   ],
   "stone": [
    "#4e3c22",
    "#674e2a",
    "#83643d",
    "#967750",
    "#ad9474",
    "#c4b092"
   ],
   "rock": [
    "#4a3f30",
    "#6b5c46",
    "#8a7a62",
    "#a89880",
    "#c4b69c"
   ],
   "water": [
    "#123040",
    "#184658",
    "#1f5f6e",
    "#2c7a84",
    "#4c9ea0",
    "#a6d8cf"
   ],
   "bloom": [
    "#e8d36a",
    "#f4efe6",
    "#c97a9a",
    "#0a1428"
   ]
  },
  "light": "top-left",
  "recipes": {
   "grass": "grass@3",
   "dirt": "dirt@1",
   "water": "water@3",
   "stone": "cobble@1"
  },
  "liquidEdge": "foam",
  "labels": {
   "grass": "Grass",
   "dirt": "Path",
   "water": "Water",
   "stone": "Cobbles"
  },
  "anim": {
   "frames": 7,
   "ms": 200
  },
  "priority": {
   "stone": 30,
   "grass": 20,
   "dirt": 10,
   "water": 5
  },
  "macro": {
   "size": 4,
   "origin": "map"
  },
  "dither": {
   "kind": "bayer4",
   "amplitude": 35,
   "accentSteps": 3
  },
  "paintSize": 32,
  "preview": {
   "map": "default"
  }
 }
}
```
`paint-styles/te-classic@1.json` (written by tile-project 005; `palette: "from-params"`, so each terrain's own v0.5 params apply):
```json
{
 "kind": "paint-style",
 "formatVersion": 2,
 "id": "te-classic",
 "version": 1,
 "name": "Classic (v0.5 recipes)",
 "painter": 1,
 "sha256": "cbbbccbac6373cedf95c239ceec31b01711b1ccce82911a0c5afa2a161a7aa03",
 "body": {
  "palette": "from-params",
  "macro": {
   "size": 1,
   "origin": "map"
  },
  "recipes": {
   "grass": "grass@1",
   "water": "water@1",
   "stone": "stone@1"
  },
  "light": "top-left"
 }
}
```
`index` excerpt (derived): the paint styles, and the used-cell sheet and decoded lines for the ×2 asset:
```json
{
 "paintStyles": [
  {
   "ref": "btf-ashroad@1",
   "file": "paint-styles/btf-ashroad@1.json",
   "usedBy": [
    "asset_a67365afdadeeae0"
   ]
  },
  {
   "ref": "te-classic@1",
   "file": "paint-styles/te-classic@1.json",
   "usedBy": [
    "asset_6da4af68c4ea5d42"
   ]
  }
 ],
 "assets[]": [
  {
   "id": "asset_a67365afdadeeae0",
   "sha256": "a67365afdadeeae0deab45f1b61a7088396a9b9c2489584e1455739c6f9c1c9e",
   "bytes": null,
   "mime": null,
   "w": 320,
   "h": 320,
   "decodedBytes": 376832,
   "nativeScale": 2,
   "cells": {
    "used": 92,
    "theoretical": null
   },
   "usedBy": [
    {
     "kind": "map",
     "id": "map_01JCA1B2C3D4E5F6G7H8J9K0M1"
    }
   ],
   "used": true
  },
  {
   "id": "asset_6da4af68c4ea5d42",
   "sha256": "6da4af68c4ea5d4266f4057a6a37fa4b1a97ca06f47751f790255b5a2ef31cc5",
   "bytes": null,
   "mime": null,
   "w": null,
   "h": null,
   "decodedBytes": 0,
   "nativeScale": 1,
   "cells": {
    "used": 0,
    "theoretical": 160
   },
   "usedBy": [],
   "used": false
  }
 ],
 "size.decoded (excerpt)": {
  "images": [
   {
    "assetId": "asset_a67365afdadeeae0",
    "w": 320,
    "h": 320,
    "bytes": 376832
   }
  ],
  "scaledCopies": {
   "cached": false,
   "bytes": 1507328,
   "countedBytes": 0,
   "assets": [
    {
     "assetId": "asset_a67365afdadeeae0",
     "paintScale": 2,
     "bytes": 1507328
    }
   ]
  }
 }
}
```
- `cells.theoretical` is `null` for the BTF sheet: with maskSet `recipe` it's the recipe's declared composite count, which the reader takes from `@te/paint-proc` and which isn't needed for anything stored. For the `te-classic` sheet it's 160 (2 terrains × 2 variants × 16 masks × 1 + 4 frames).

**Upgrade, map scope, one undo group.** Assume `btf-ashroad@2` is installed later. The editor shows the "update available" badge, and the user previews the change and confirms it for map `map_01JCA1B2C3D4E5F6G7H8J9K0M1` only.
- The new asset `asset_2e9015fd2a295e31` (the same params with `version: 2`) is added, and `btf-ashroad@2` is embedded.
- The map's ground layer is re-pointed. Its variants stay position-locked, so the indices carry over unchanged.
- It's live (no stored bake), so nothing is rebaked.
- Both ops share `group`, so one Undo reverts both.
```json
{
 "project.json history.ops[+]": {
  "seq": 41,
  "at": "2026-11-09T20:52:00Z",
  "kind": "set",
  "group": "grp_01JCA2B3C4D5E6F7G8H9J0K1M2",
  "note": "Upgrade style btf-ashroad 1 → 2 (map map_01JCA1B2C3D4E5F6G7H8J9K0M1)",
  "changes": [
   {
    "knob": "assets/asset_2e9015fd2a295e31",
    "before": null,
    "after": {
     "value": "added (params as asset_a67365afdadeeae0, paintStyle.version 2)"
    }
   },
   {
    "knob": "paintStyles/btf-ashroad@2",
    "before": null,
    "after": {
     "value": "embedded"
    }
   }
  ]
 },
 "maps/map_01JCA1B2C3D4E5F6G7H8J9K0M1.json history.ops[+]": {
  "seq": 3,
  "at": "2026-11-09T20:52:00Z",
  "kind": "set",
  "group": "grp_01JCA2B3C4D5E6F7G8H9J0K1M2",
  "note": "Upgrade style btf-ashroad 1 → 2",
  "changes": [
   {
    "knob": "layers/ground/assetId",
    "before": {
     "value": "asset_a67365afdadeeae0"
    },
    "after": {
     "value": "asset_2e9015fd2a295e31"
    }
   }
  ]
 }
}
```
