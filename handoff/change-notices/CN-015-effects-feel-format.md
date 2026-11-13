# CN-015 (33b): effect light, ramp colour, pixel size, outline and feel; player shake; te-flash@3 (format only, additive, render only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-13 18:4x London. Status: **ACCEPTED pending the EA's confirmation of the DSK rulings.** Sources: UX `ux/effects-sprite-sync.md` (`4e72b97e`) §9 fields, §10 EA answers 18:33; CEO 18:35 via the EA (Q1–Q4); DSK rulings. CN-011 stays reserved for scene-pin.
Kind: format only, additive, render only. **core-types unchanged at `61fad786`**. No version bump, no migration: every field is optional and absent = today's behaviour.

Docs: setup-format **r23** (`193e4075`) §2.10.3.2–2.10.3.4, project-format **r35** (`ce7e9f53`) §6.7 and §13, profile-format **r14** (`d700d891`) §3.3 and §9.0. Catalogue request **L48** (after L47).

## Fields
| Field | Home | Type / range | Absent means | Warnings |
|---|---|---|---|---|
| `light_mode` | effect step | `"off"\|"steady"\|"pop"` | `"off"` (today) | `fxLightsOverCap` (lit steps 3+ in one effect draw no light). UX draft `light` = reader alias |
| `light_radius` | effect step | slider, tiles 0.5–6, step 0.5 | 2 | `outOfRange` (clamped, kept) |
| `light_ramp` | effect step | ramp key `grass\|dirt\|stone\|rock\|water\|bloom` | the step's `tint_ramp`, else the effect's, else `"#ffb048"`; the light colour is the ramp's lightest step | `fxRampMissing` |
| `tint_ramp` | effect knob and effect step (step wins) | ramp key | today's hex tint (`tint_*`, `impact_colour`) | `fxRampMissing` (plays as absent). When set, hex `tint_*` is kept and ignored |
| `tint_snap` | effect step | `"ramp"\|"rgb"` | **`"rgb"`** (today); new steps get `"ramp"` | — |
| `pixel_scale` | effect knob | `"match-sprite"\|int 1–6` | **today's `k` rule for old documents; the editor writes `"match-sprite"` into new documents (CEO Q2)** | `outOfRange` |
| `outline` | effect step | `"auto"\|"on"\|"off"` | **`"off"`** (today); new steps get `"auto"` | — |
| `shake` | effect knob | int **0–3** art px | 0 = none (today) | `outOfRange`: a stored 4 (or more) plays as 3, a negative as 0; never rewritten |
| `shake_ms` | effect knob | int 80–400 | 120 / 200 / 300 by strength 1 / 2 / 3 | `outOfRange` |
| `shake_dir` | effect knob | `"hit"\|"none"` | `"hit"` | unknown → `"hit"` |
| `hit_white_mode` | effect knob (extends §2.10.2.7) | += `"bright"` (2 steps up its own ramp; off-ramp pixels draw as `white`) | `"white"` (unchanged) | old readers: unknown → `"white"` |
| `squash` | effect knob | toggle | `false` (today) | — |
| `screen_shake` | player profile, `btf-hud-settings@1` §3.3 `accessibility`, core | `"off"\|"low"\|"full"` | `"full"`; `low` = max(1, floor(px / 2)); forced off by `reduce_motion` or device reduced motion | — |
| `graphics` (existing core key, reused) | player profile §3.3 | `low` = Lite, `mid` / `high` = Normal | `"high"` (unchanged) | aliases: `"lite"` → `low`, `"normal"` → `high` |

Ramp keys resolve against `settings.paintStyleDefault` (absent → `btf-ashroad@2`), so Preview equals the game on every stage.

## Rulings where DSK departs from the EA/UX list
1. **`light_mode`, not `light` or `glow`.** Bare `light` collides with the paint style's `light` (shading direction) next to AssetMeta `lightSource`; `glow` collides with the step's existing `glow_on` / `glow_from` / `glow_to` (the picture's glow look). `light_radius` and `light_ramp` keep UX's names (no clash). UX's draft `light` is read as an alias on effect steps.
2. **`shake` is 0–3, not 0–4** (CEO Q1: 1–3 px). UX's Advanced 4 is dropped; a stored 4 plays as 3 with `outOfRange` and is never rewritten. The HUD, editor UI and Effect Designer controls never shake.
3. **No `hit_stop_jitter` field.** CEO Q4 makes the shiver unconditional whenever hit-stop is on (±1 art px every 30 ms, victim only, off under reduced motion), so there's nothing to store. A stored `hit_stop_jitter` answer is kept in `orphans` and never read. EUX: please drop the "Target shivers" chip. An opt-out would need a later additive CN.
4. **No new `graphics: normal | lite` key.** profile-format §3.3 already has the core `graphics` (`low` / `mid` / `high`); Lite = `low`. A second key would duplicate it.
5. **`screen_shake` Low = max(1, floor(px / 2)).** UX's text had "floored, 1 px becomes 0"; the brief's minimum of 1 keeps Low distinct from Off.
6. **Rule N** for `pixel_scale`, `tint_snap` and `outline`: absent keeps today's look for old documents, and the editor writes the new default into new documents and steps. `"match-sprite"` with no anchor sprite falls back to today's `k` rule.
7. **Ramp references are ramp keys resolved against `settings.paintStyleDefault`** (no ramp type, no colour field, no style pin on the effect). **EA to confirm** that reading `paintStyleDefault` for effect colours is acceptable (it stays unread when painting).

## Detector
- **`te-flash@3`** = @2 plus one rule: a `light_mode: "pop"` step is one flash start at its pop when π(`light_radius` × T)² / (390 × 844) ≥ 25% (≈ 2.5 tiles at 64 px). Steady lights and shake never count; `bright` counts like `white`. Same result as @2 on every document without a pop light or `bright`. **`te-flash@2` and `@1` stay frozen** (pinned versions are never edited; ids never reused). It's derived and never stored, so nothing migrates. `flashRisk.detector` (project-format §6.7) and `flashCheck.detector` (profile-format §9.0) may be `te-flash@3`.

## Not in the format (runtime only)
- `keepInDim`, `fullyDark`, `Light.colour` (set from `light_ramp`), the 2 lights per effect / 4 on screen / 10 Hz re-plan budget, the pose grid, lite selection, rotation buckets, `clip_cues` suppression when `hit_white_ms` > 0, the stacking rule (max, then cap), the trauma curve and the shake noise.

## Core-types candidates (CN only, not staged; wait until after H2, then a new CN through the EA, sha to QA)
- CN-E2 amend: `HitWhiteMode` += `"bright"`, new union `FxLightMode`. CN-E3 amend: detector `"te-flash@3"`. None is needed in `61fad786` for step 33b.

## Readers
- The step 33b player and the detector read these from the documents and the profile. QA: no core-types sha change, so no add-only check. Please check against these docs (G1–G4, P1–P5, F1–F6, M1–M5), including byte identity with every field absent and te-flash@2 = @3 on @2-only documents.
