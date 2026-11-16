# CN-020 (effect parts): `parts[]` / `part` and editor-only `from` (format only, additive, editor only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-16 01:3x London. Status: **ACCEPTED** (DSK 2026-11-16 19:1x London; EA asked, for the ED-E4 merge). Filed PROPOSED 2026-11-16 01:3x (CEO scope answers 01:34 via EA); amended 01:5x (moonlit@4); accepted with two notes below (ED-E4 `step-ed-e4-blend-core.md` sha256 `efd8af73`). Rules 1–7 are unchanged from `9a73b99c`. Sources: Effect Designer scope r4 (`/workspace/share/effect-designer/scope.md`, sha256 `e77b396e`) §4.1–4.2, §6(a), §7 CN-020, §12 Q1 (flatten + `from`, update only on tap); EA GO 2026-11-16 to file CN-020–022.

Kind: format only, additive, **editor only**. **No core-types change.** No version bump, no migration: every key is optional and absent = today's behaviour. Older readers ignore the new keys and keep them on save (project-format §2, r13 R4). The runtime and `lookHash` / pins ignore all of it.

Docs: setup-format **r29** §2.1 (`rev`), §2.5 (`outOfRange`, `invalidValue`, `unknownRef`, `overCap`), §2.10 document rules (M4), §2.10.1.3 (`draw_layer` vs `layer_kind` / `layer_delay`), §2.10.3 Rule N / M3. Catalogue request **L50** (with CN-021). L49 is already `dim_lights`.

## Keys
| Key | Where | Shape | Absent means | Read by |
|---|---|---|---|---|
| `parts` | effect list knob (L50) | `{id, kind, beats, from?, nudge_ms?, label?}[]`, max 6 | no part metadata (today) | editor only |
| `part` | `steps` item | part `id` (string) | the step isn't tagged to a part | editor only |

- **Name note.** The stored names are `parts` and `part`, kept apart from `layer_kind`, `layer_delay` and `draw_layer` (setup-format §2.10.1.3). The UI may still label them "Layer".
- **`kind`:** `"shape"` \| `"colour"` \| `"sparks"` \| `"light"` \| `"punch"` \| `"trail"`.
- **`beats`:** an array of `"cast"` \| `"travel"` \| `"hit"` \| `"linger"` (one or more).
- **`from?`:** `{effect, rev}` provenance. `from.rev` is the source effect document's existing envelope `rev` (setup-format §2.1, +1 per logged op; the same counter the index already tracks for setups). No new counter.
- **`nudge_ms?`:** optional int ms on the 30 ms grid (scope §4.3). Absent = 0. Editor only; the flattened step timing is the play source. A non-integer or off-grid value warns `outOfRange` / `offStep` and is kept.

## Rules
1. **Editor only.** Play, the runtime and `lookHash` ignore `parts`, `part`, `from` and `nudge_ms`. Parts are flattened into ordinary steps and knobs, so play never breaks.
2. **Ids (M4).** Part ids and step ids are never reused within an effect, including after a delete. The writer mints a fresh `id` for every part it adds or duplicates. A stored duplicate `id` is H2 `invalidValue`, as for any list.
   - *Note (ED-E4).* Part ids are never reused, including across a blend: every part and step moved from the other side gets a freshly minted id (`p-…`, `s-…`), never its source id, even when the two ids differ. A blend that would reuse an id is a writer bug.
3. **`from`.** A dangling or cyclic `from` is **info only**, never a warning or a block. Hub and export keep `from` as inert data. The editor's "Export clean" option strips it (EA ruling).
4. **Unknown values.** An unknown `kind` or `beats` value warns `outOfRange` and is kept (M5: a wrong JS type stays H2 `invalidValue`).
5. **Dangling `part`.** A step whose `part` matches no part id in this document warns `unknownRef` and is kept. Play is unchanged (rule 1).
6. **Over cap.** More than 6 parts warns `overCap` and keeps all (C4 / R4). The runtime does not trim this list.
   - *Note (ED-E4).* A blended effect may hold more than 6 parts (both sides' parts of one kind). That is valid data: it warns `overCap` and keeps all, and no part is dropped or merged on save. The editor's chip strip shows at most 6 (E7); that is display only.
7. **`label`.** Optional. The editor may write one for the chip; when absent it shows `kind`. A missing label is not H2.

## Core-types candidates
- None. These keys are editor metadata; nothing is typed in core-types for them.

## Open (not this CN)
- CN-023–025 (drawn path, tiers, linger by tile tag) wait. Style versions `btf-ashroad@3` / `btf-moonlit@4` wait for UX colour stops.

## Readers
- The Effect Designer only. QA: no core-types sha change, no pin moves, no migration. Please check: (1) an effect with no `parts` / `part` is byte-identical to today; (2) `fx-live` and `lookHash` ignore the keys; (3) a dangling or cyclic `from` is info and play is unchanged; (4) hub/export keep `from`, and "Export clean" strips it; (5) an older writer keeps the keys on save; (6) a reused part id is refused on edit and is H2 in a stored file; (7) `parts` / `part` are not confused with `layer_kind`, `layer_delay` or `draw_layer`.
