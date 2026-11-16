# CN-021 (`variant_seed`): effect knob (format only, additive; absent = today's hash, no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-16 01:3x London. Status: **ACCEPTED** (DSK 2026-11-16 22:0x London, for ED-E5 step doc b7366e1f; filed PROPOSED 01:3x, CEO scope answers 01:34 via EA). Superseded text: d63ea816. Sources: Effect Designer scope r4 (`/workspace/share/effect-designer/scope.md`, sha256 `e77b396e`) §4.3, §6(b), §7 CN-021; EA GO 2026-11-16 to file CN-020–022.

Kind: format only, additive. The only Effect Designer CN that the runtime and pins can see. **No core-types change.** No version bump, no migration: the key is optional and absent = today's behaviour (the particle hash's last argument is the literal `0`). Older readers ignore the key, keep it on save (project-format §2, r13 R4), and play seed 0 silently.

Docs: setup-format **r29** §2.5 (`outOfRange`, `invalidValue`), §2.10.3 (absent = today; H2 on a wrong type). project-format **r39** §11.3 (`editor-prefs`). Catalogue request **L50** (`variant_seed` and the CN-020 `parts` knobs). **L51** covers presets (N5, ≤32 particles) and the default reaction table (CN-022). L49 is already `dim_lights`.

## Keys
| Key | Where | Shape | Absent means | Read by |
|---|---|---|---|---|
| `variant_seed` | effect knob | int **0…2³¹−1** | **0** (today's last hash argument) | editor (dice) and runtime (R2, particle hash) |

## Rules
1. **Absent and 0 are identical.** The writer writes **absent instead of 0**, so `lookHash` and the pins never see a stored 0. A load never rewrites a stored 0. A stored 0 becomes absent only when `variant_seed` itself is next written (a dice roll or a blend); an edit to any other field leaves it as stored (ED-E5 Q2).
2. **Runtime.** The particle hash becomes `hash32(mapSeed, e.id, i, variant_seed)`, with a missing seed read as 0. Today's last argument is the literal `0`, so an absent seed is byte-identical and **no pin moves**.
3. **Range.** An out-of-range or non-integer number warns `outOfRange` and plays as 0. The stored value is kept and never rewritten. A wrong JS type (`true`, an object, an array, a string) is H2 `invalidValue`.
4. **Older runtime.** A reader that doesn't know the key plays seed 0 silently (no warning).
5. **Dice history.** The 6-roll dice history is device-local `editor-prefs` (project-format §11.3), never project data, never exported, never shared. `editor-prefs` stays v1; an unknown key is tolerated.

## Core-types candidates
- None. The knob is a plain optional int. No CN-E batch change.

## Open (not this CN)
- Catalogue text for L50 / L51 (Librarian). Style @3 ramps wait for UX colour stops.

## Readers
- The host's particle hash (fx-live R2) and the Effect Designer dice. QA: no core-types sha change. Please check: (1) a document with no `variant_seed` hashes byte-identically to today (last argument 0) and no pin moves; (2) the writer omits a 0; (3) a stored 0 reads as 0 and becomes absent when `variant_seed` is next written, not on other edits; (4) 2³¹, −1 or 2.5 warn `outOfRange` and play as 0, value kept; (5) `true` is H2; (6) an older runtime with a non-zero seed still in the file plays 0 with no warning; (7) dice history is not in the project or the export closure.
