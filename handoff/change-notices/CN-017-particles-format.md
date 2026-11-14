# CN-017 (33b-3): effect particle fields (format only, additive, render only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-14 02:2x London. Status: **ACCEPTED** (EA numbered CN-017 and accepted as written, 2026-11-14 02:29 London; ships with step 33b-3). Sources: UX `ux/effects-v2-plan.md` §3.3 and §3.8 perf table (~line 153); EA request 02:2x (particles need a format source before 33b-3); DSK rulings. CN-011 stays reserved for scene-pin.
Kind: format only, additive, render only. **core-types unchanged at `61fad786`**. No version bump, no migration: every field is optional and absent = today's behaviour.

Docs: setup-format **r24** §2.10.1.3 and §2.10.3.5, project-format **r36** §6.7 and §13. The `particles` kind and its fields were already ACCEPTED in setup-format r17 §2.10.1 (plan §3.3); this CN is the 33b-3 format source and tightens the per-effect cap. `te-flash@2` and `@1` stay frozen (pinned detector docs are never edited; they never contained these cap rules). New recipes that need these fields go with `te-flash@3`.

## Fields
These live on `particles` steps only (te-flash@3 recipes). On any other kind they are kept and ignored silently, like today. Writers emit the `_ms` / per-mille names already ACCEPTED in §2.10.1; draft names are reader aliases.

| Field | Home | Type / range | Absent means | Warnings |
|---|---|---|---|---|
| `kind: "particles"` | effect step | existing r17 kind | — | — |
| `particle_motion` | `particles` step | `"burst" \| "attract" \| "spiral-in" \| "rise"` | `"burst"` | unknown value plays as `"burst"` with `outOfRange` (no separate unknown-enum code; same "unknown picker → default + warning" rule as `start_mode`) |
| `particle_count` | `particles` step | int **0–48**, default 12, step 1 | 12 | Per-step out of range clamps with `outOfRange` (kept). **48 is per effect**, summed across all its `particles` steps: over that, later steps are cut down at load in step order and **`fxParticlesOverCap` {count, limit: 48}** fires once (supersedes r17 `particlesOverSoftCap`). **32 is an editor note only** ("may slow some phones"), never a format cap or warning |
| `particle_life_ms` | `particles` step | int ms **200–3000**, default 800 | 800 | `outOfRange`. Draft name `particle_life` is a reader alias (§2.10.1.8); writers emit `particle_life_ms` |
| `particle_pull` | `particles` step | int per-mille **0–2000**, default 1000, stored step 100 (UI 0–2, default 1, step 0.1) | 1000 | `outOfRange`. Already the r17 stored form (same per-mille pattern as `dim_amount` / `flash_strength`), so a stored 1000 keeps meaning 1 and nothing migrates. Only read by `attract` and `spiral-in`; ignored silently otherwise |

**Reused, not duplicated:** `anchor`, `jitter`, `start_spread`, `size_spread`, `picture`. The old `impact` / `sparks` / `impact_radius` burst is unchanged, so BTF looks do not move.

## Rulings
1. **The kind is not new.** It was ACCEPTED in setup-format r17 §2.10.1. This CN does not invent a second `particles` kind or a second set of fields.
2. **The 48 cap is a hard per-effect sum**, not a soft per-step hint. A single step above 48 is clamped first with `outOfRange`. If the remaining sum still exceeds 48, later `particles` steps (document step order) have their counts cut down at load until the sum is 48, and `fxParticlesOverCap` {count, limit: 48} fires once (`count` is the pre-cut sum). A stored value is never rewritten.
3. **32 is not a cap.** The editor may show "may slow some phones" at 32; the format never warns at 32.
4. **`particle_pull` stays per-mille** (0–2000, default 1000). The plan's 0–2 / default 1 / step 0.1 is the UI scale, already noted in r17. Storing a 0–2 float would misread every existing example (e.g. `1200`) and need a migration.
5. **`particle_life` is the draft alias** of the stored field `particle_life_ms` (200–3000, default 800). Writers never emit `particle_life`.

## Not in the format (runtime only)
- One shared on-screen pool of **96**, oldest dropped first, so QA's ceiling of 128 can never be reached. The pool size is not a stored field.
- Positions are clock-based from a derived seeded visual-random stream, never stored (plan §13.3), so replays and previews match.
- `reduce_motion` skips particle motion (start and end stills only). Effect documents never store this; it is the player setting in profile-format §3.3.

## Core-types candidates (CN only, not staged; wait until after H2, then a new CN through the EA, sha to QA)
- The `particles` kind and `ParticleMotion` already sit on the post-H2 **CN-E2 unions** batch (setup-format §2.10.1.9). This CN stages no core-types change. Nothing is needed in `61fad786` for step 33b-3.

## Readers
- The step 33b-3 player reads these from the effect document. QA: no core-types sha change, so no add-only check. Please check the 48 sum cap (later steps cut down, one `fxParticlesOverCap`), per-step `outOfRange`, unknown `particle_motion` → `"burst"`, `particle_pull` ignored on `burst` / `rise`, the 96 pool (oldest dropped; 128 unreachable), clock-based seeded positions, and `reduce_motion` start/end stills. Documents with every field absent stay byte-identical.
