# CN-019 (effect ramps): `fire`, `frost`, `holy`, `venom` palette ramp keys (format only, additive, render only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-15 06:3x London. Status: **ACCEPTED** (EA numbered CN-019 and accepted as written after the D1 read-back PASS, 2026-11-15 06:31 London) (D1 of the post-34 plan; EA GO 2026-11-15 06:24 after the CEO approved the plan at 06:23). Sources: CEO 2026-11-15 03:11 Q4 "yes" (`ux/effect-designer-v3-ux.md` CEO rulings: "Basic offers effect ramps (fire, frost, holy, venom) on top of the six terrain ramps, as new palette `ramps` keys"); EA first answer 2 (same file); UX risk 1 (the six project ramps are terrain ramps, so Basic can't make a fire, ice or holy look); EA plan `post34-diagnosis-plan.md` item 47 and slice D1 ("palette keys only").
Kind: format only, additive, render only. **core-types unchanged at `61fad786`** (CN-018 `d6d08696` is unaffected: ramp keys are plain strings there too). No version bump, no migration: every key is optional and absent = today's behaviour.

Docs: setup-format **r27** §2.10.3.2 (`tint_ramp` / `light_ramp` options, ramp resolution) and §12.5 L48, project-format **r37** §6.2.5 (`ramps` row and the effect-ramps bullet). Catalogue: the `tint_ramp` / `light_ramp` picker options in **L48** (rev 23).

## Keys
| Key | Where | Shape | Absent means | Read by |
|---|---|---|---|---|
| `fire` | paint-style `body.ramps` | `"#rrggbb"[]`, 2–8 colours, dark → light (the same shape as the six terrain ramps) | the key is missing: an effect naming it gets `fxRampMissing` | effect `tint_ramp` (knob and step) and step `light_ramp` only |
| `frost` | same | same | same | same |
| `holy` | same | same | same | same |
| `venom` | same | same | same | same |

- The six terrain keys (`grass`, `dirt`, `stone`, `rock`, `water`, `bloom`) are unchanged and stay required in a locked style. The four effect keys are **always optional**, even in a locked style.
- **Palette keys only.** No new effect or step field, no stored colour, no style pin on the effect (CN-015 ruling 7 holds). The effect stores the key; the host resolves it to colours and passes the resolved ramp to the runtime (EA ruling 2026-11-14).
- Terrain painting never reads the four keys, so no terrain look and no `lookHash` of an existing version moves.

## Resolution and fallback
1. An effect's `tint_ramp` / `light_ramp` key resolves against the project's `settings.paintStyleDefault`, or `btf-ashroad@2` when that setting is absent (setup-format §2.10.3.2, unchanged).
2. The resolved style version has the key: the ramp is used exactly like a terrain ramp (`tint_snap: "ramp"` snaps to it, `outline` uses its darkest step, a light uses its lightest step, `bright` moves up it).
3. The resolved style version lacks the key (every published version today, including `btf-ashroad@2`, `btf-moonlit@2` and `te-classic@1`), or the style can't be resolved: **`fxRampMissing`** once per effect (the existing CN-015 code) and that field plays as absent (today's hex tint, or `"#ffb048"` for a light). Nothing is rewritten.
4. Published style versions are immutable, so the keys arrive only in a **new** style version. A project gets them by pinning that version as `settings.paintStyleDefault` (new assets only; existing terrain pins and their asset ids never change).
5. A paint-style reader that doesn't know the keys keeps them (unknown keys are kept on save) and ignores them; they never make the `ramps` body field bad, so the per-field "bad body field → default" rule can't fire because of them.
6. Editor (not format): Basic should show only the effect ramps the resolved style has, so a maker doesn't pick a key that will warn.

## Colours
**No colour values are set by this CN.** Nothing in the repo gives stops for these effect ramps: the locked `btf-ashroad` / `btf-moonlit` bodies (project-format §17.9, `painter-proto/locked/2026-11-09/`) hold only the six terrain ramps, and `docs/painter-style-brief.md`'s `frost@1` stone ramp and lava rim colours are terrain looks, not effect ramps. The colour stops are supplied by UX in the style data ("drawn to sit with that style", UX risk 1); the format fixes only the key names and shape.

## Rulings
1. **Names:** `fire`, `frost`, `holy`, `venom`, as the CEO approved. `frost`, not `ice`, so it doesn't read as the `liquidEdge: "ice"` rim or the `frost@1` terrain recipe; `holy`, not `light`, which is the paint style's shading direction.
2. **Same shape as the terrain ramps** (2–8, dark → light), so the existing ramp rules (snap, outline, light, `bright`) need no new wording.
3. **No fallback to another key.** A missing `fire` doesn't borrow `bloom` or a hex: it is `fxRampMissing` and absent, the same as any missing key (one rule, no hidden second source).
4. **No new warning code.** `fxRampMissing` already covers a key the resolved style doesn't have.

## Core-types candidates
- None. Ramp keys are strings in the effect answers and in the style body; nothing is typed in core-types for them. No CN-E batch change.

## Open (not format)
- **Which style versions carry the keys, and when.** More styles are PARKED and `btf-ashroad` / `btf-moonlit` are locked (CEO 2026-11-09). Adding the keys means new versions (for example `btf-ashroad@3` / `btf-moonlit@3`, terrain ramps byte-identical) with UX-drawn stops. That's an art and CEO/EA call; until it happens every project gets `fxRampMissing` for these keys.

## Readers
- The host's ramp resolver (step 33b-2 path) and the Effect Designer's Basic colour list. QA: no core-types sha change, so no add-only check. Please check: (1) a style with all four keys resolves each one for `tint_ramp` and `light_ramp`; (2) `btf-ashroad@2` naming `fire` gives one `fxRampMissing` per effect and plays today's hex tint (`"#ffb048"` for a light); (3) adding the four keys to a test style leaves every terrain asset's pixels and `lookHash` unchanged; (4) a reader without the keys keeps them on save and doesn't mark `ramps` bad; (5) the 10 `btf-*` effect looks stay byte-identical (none names an effect ramp).
