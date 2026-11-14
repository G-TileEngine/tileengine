# CN-018: core-types effects v2 batch (CN-E2, CN-E3, CN-E5 + particle fields), ACCEPTED, lands with step 33b-3

Filed by: Data & Save Format Keeper, 2026-11-14 18:1x London. Status: **ACCEPTED** (EA numbered CN-018, 2026-11-14 18:15 London; lands in the 33b-3 kit after QA's add-only check; pin stays 61fad786 until then) (post-H2; base step 33b-2 merged, main d5b36b5f). Nothing on main; `data/core-types.ts` is untouched.
Kind: core-types, **additive only** (69 added lines, 0 removed or changed; no renames, no removals). No format version bump, no migration.

- Base: `data/core-types.ts` **61fad786** (`core-types.next.ts` f00c722c is stale: its CN-004 content already landed in 61fad786, and it lacks CN-009 `SaveHeader`/`MatchSave`, so it was not used).
- Staged: `staging/core-types.cnE.ts` **d6d08696** (sha256 d6d0869644f3c9876aa1101d8a7248f8b5a18b3beabcb0b191c9c42fec88a366); diff `staging/core-types.cnE.diff` **883b33cc**.
- Check: `tsc --noEmit --strict` (TypeScript 5.9.3) passes on the staged file and on the base.
- **No 00–07 card imports:** the new section imports nothing and references no `CoreDeck` or card type; it's a separate "EFFECTS V2 TYPES" block read only by the fx/Render layer and the detector.

## Additions (all MAY-MOVE; every member taken from the docs)
| Type | Members | Source |
|---|---|---|
| `StepKind` | 9 catalogue motion kinds (`straight`…`scratch`) + `dim`, `stamp`, `particles`, `flash` | CN-E2; setup-format §2.10.1.3; catalogue effect `steps.kind` |
| `StartMode` | `after-last`, `with-last`, `at-time`, `at-hit` | CN-E2 + amend; §2.10.1.2, §2.10.2.1 |
| `DrawLayer` / `FxDrawLayer` | `ground`, `air`, `overlay` / + `behind-unit`, `front-unit` | CN-E2 + amend; §2.10.1.3, §2.10.3.1, CN-014 |
| `Blend` | `normal`, `add` | CN-E2; §2.10.1.3 |
| `ParticleMotion` | `burst`, `attract`, `spiral-in`, `rise` | CN-E2; §2.10.3.5, CN-017 |
| `FxAnchor` | `caster`, `target`, `screen` | CN-E2 amend; §2.10.2.2 |
| `FlashShape` | `screen`, `circle` | CN-E2 amend; §2.10.2.2 |
| `ShineStyle` | `simple`, `extra` | CN-E2 amend; §2.10.2.8 |
| `FeelTarget` | `stamp`, `target`, `caster` | CN-E2 amend; §2.10.2.7 |
| `HitWhiteMode` | `white`, `tint`, `black`, `bright` | CN-E2 amends; §2.10.2.7, §2.10.3.2, CN-015 |
| `FxLightMode` | `off`, `steady`, `pop` | CN-E2 amend; §2.10.3.2, CN-015 |
| `StartOn` | `cast`, `release`, `contact` | CN-E2 amend; §2.10.3.1, CN-014 |
| `AnchorPoint` | `tile`, `foot`, `centre`, `head`, `hand`, `tip` | CN-E2 amend; §2.10.3.1, CN-014 |
| `FxLit` | `self`, `scene` | CN-E2 amend; §2.10.3.1, CN-014 |
| `FxParticleStepFields` | optional `particle_motion`, `particle_count` (0–48, per-effect sum), `particle_life_ms` (200–3000), `particle_pull` (per-mille 0–2000) | CN-017; §2.10.1.3, §2.10.3.5; project-format r36 |
| `FlashDetectorId` | `te-flash@1`, `te-flash@2`, `te-flash@3` | CN-E3 + amends; CN-015 |
| `FlashReason`, `FlashCheck` | `tooMany`, `bigRed`; `{flashRisk: boolean, reasons, worstWindowMs}` | CN-E3; §2.10.1.6, project-format §6.7 |
| `FxPictureId` / `FxStepPicture` | 5 stock ids + `blast-star` / `FxPictureId \| "none" \| asset id` | CN-E5 + amend; §2.10.1, §2.10.2.9 |

## Not included
- **Notice/warning code union and `Notice.detail?`:** core-types 61fad786 has no Notice type or code union to extend (codes live in the docs). Not added; `fxTooManyFrames` detail stays in `message` until a Notice type exists.
- **CN-E4 setting keys** (`reduce_flashes`, `reduce_motion`, `screen_shake`, `EditorPrefsPreview.previewReduceFlashes`): core-types has no settings-key pattern to extend.
- **CN-E1** (v2 effect player input): project-format §7.2 5a only names it; no field list to type without guessing.

## Readers
- QA: add-only check of the diff against 61fad786, `tsc --strict`, and no import of the new block from core steps 00–07. EA reviews before anything lands; core-types stays pinned at 61fad786 until then.
