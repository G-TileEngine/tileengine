# CN-026 (`ride`): effect step field (format only, additive, RISKY; absent = today)

Filed by: Data & Save Format Keeper, 2026-11-16 11:3x London. Status: **ACCEPTED** (DSK 2026-11-16 11:59 London; EA concurs). Amended 2026-11-16 11:4x to match ED-E2 r2/r3 (EA). Must be ACCEPTED before the E2 merge. Sources: step doc `step-ed-e2-travel-paths.md` **r3 (sha256 `63d8393d`; r1 was `c6f8530f`)** rulings 10–11, tests 8 and 11; Effect Designer scope r4 §13 M-B6.

Kind: format only, additive. **No core-types change.** No version bump, no migration: the field is optional and absent = today's behaviour. Older readers ignore the key, keep it on save (project-format §2, r13 R4) and play the step at its own anchor. Numbering: CN-023/024/025 stay reserved for drawn path, tiers and linger-by-tag (scope §7), so this is CN-026.

Docs: setup-format **r29** §2.5 (`unknownRef`, `invalidValue`), §2.10.x effect steps. Catalogue request **L52** (`ride` on `effect.steps` items). L50/L51 are CN-020/021/022's. The existing step fields E2 also uses are already in catalogue rev 24: `bend` (slider −2.5…2.5, default 0.8) and `bounce_points` (tiles, `max_items` 8, default `[]`, `{dc, dr}` since L33). Nothing new is needed for them.

## Keys
| Key | Where | Shape | Absent means | Read by |
|---|---|---|---|---|
| `ride` | `effect.steps[]` item, read only on kinds `particles`, `stamp`, `flash` | string, a step `id` in the same effect | the step plays at its own anchor (today) | runtime (fx-doc R3) and editor (flatten, beat row) |

## Rules
1. **Resolve.** `ride` names another step's `id` in the same effect; the first step with that id is the one meant (any position). If that step is among the first 12, enabled, and a travel kind (`straight`, `swerve`, `bounce`, `orbit`), the rider takes **its** path and timing. Riders have no path of their own (rule 1b).
1b. **Who can ride.** Only kinds `particles`, `stamp` and `flash` read `ride`. On any other kind the key is ignored with no note and kept on save; a travel step that names itself or another step keeps its own path. A `flash` rider with `flash_shape: "screen"` (the default) has no position, so it doesn't move and gets no note; only a `"circle"` flash follows the path (EA 11:44). A step's `light_mode` light moves with its step, so a lit stamp or particles step carries its light along the path.
2. **One hop.** The named step's own path is used; its own `ride`, if any, is not followed. So chains and cycles can't happen.
3. **Bad refs warn, never block.** An empty string, an unknown id, the step's own id, a non-travel step, a **disabled** step (`enabled: false`), or a step past the first 12 gives `unknownRef` at `steps[i].ride`, the value is kept, and the rider plays at its anchor.
4. **Wrong type.** A non-string (number, `true`, object, array, `null`) is H2 `invalidValue`, the same house rule as `pixel_scale` and `variant_seed` (EA ruling, step doc r2).
4b. **Disabled rider.** A rider with `enabled: false` plays nothing and gets no ride note.
5. **Fit.** If Fit drops the ridden step, the rider becomes `unknownRef` and plays at its anchor. The trim line already says a step went.
6. **Flatten.** Moved steps get fresh ids (E1 ruling 9 mint order). A moved step's `ride` naming a step on its own side is re-pointed to that step's fresh id. When a moved step's `ride` names no step on its own side, flatten **removes the key** (absent). It never keeps a dangling ride and never writes `null` (rule 8).
7. **Ids.** Step ids are never reused within an effect (M4), so a stale `ride` can never silently attach to a new step.
8. **Writer.** Clearing the field writes absent, never `""` or `null`.
9. **Look hash.** Absent is byte-identical to today, so no pin moves. A present `ride` is a real look change and is hashed like any other step field.

## Core-types candidates
- None. A plain optional string on a step item.

## Open (not this CN)
- L52 catalogue text (Librarian): `ride` on `effect.steps` items, type step-ref string, default absent, tagged RISKY; read on kinds `particles`, `stamp`, `flash` (L52's "sparks" = `particles`; "light" is not a kind, see rule 1b).

## Readers
- fx-doc (R3 paths) and fit.ts flatten. QA, please check: (1) a doc with no `ride` plays and hashes exactly as today; (2) `ride` onto a travel step in the first 12 takes its path and timing; (3) unknown id, empty string, self, a non-travel step and a step past 12 each give `unknownRef`, keep the value and play at the anchor; (4) a non-string or `null` is H2 `invalidValue`; (5) ride onto a step that itself rides uses that step's own path; (6) flatten re-points to the fresh id and removes a ride naming no step on its side (absent, never null); (7) the writer omits a cleared ride; (8) a disabled ridden step is `unknownRef` and the rider stays at its anchor; (9) a disabled rider plays nothing with no note; (10) `ride` on a travel or other non-rider kind is ignored silently and the step keeps its own path; (11) a screen flash rider stays put with no note, a circle flash rider follows the path.
