# CN-010: authored light and moonlit swap (format only, additive, render only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-13 16:2x London. Confirmed by: Engine Architect 16:25 (r30/r21 as written).
Kind: format only, additive, render only. **core-types unchanged at `61fad786`** (it holds no AssetMeta, tileProps or effect steps). No version bump, no migration: every field is optional, absent = today's behaviour, so old projects load unchanged.

Docs: project-format **r31** (`82345d47`), setup-format **r22** (`0081144a`).

## Fields
- AssetMeta `lightSource?: {radius: int ≥ 1 (art px), colour?: "#rrggbb" (default "#ffb048")}`: sprite and image assets.
- Tileset `tileProps[i].lightSource?`: same shape, per tile.
- Map `objects[].lightSource?: LightSource | null`: per-placement override, replaced whole. `null` = no light. Absent = inherit.
- AssetMeta `nightVariant?: assetId`: on the day asset (tileset or sprite), pointing to its night asset.
- Effect dim step `dim_lights?: "half" | "dark"` (default `"half"`): half-size glow vs lights out while the dim plays.

## Warnings (never block, values never rewritten)
- `lightInvalid`: once per asset; that light is off.
- `nightVariantMismatch`: geometry differs, target missing, a chain or a cycle; the day asset is drawn.
- Unknown `dim_lights` plays as `"half"` with the usual unknown-option warning.

## Not in the format
- `fullyDark` stays a runtime field on `Light`; the host sets it from `dim_lights`.
- No naming rule for night art (names are free text).

## Also in r30 (text only)
- A non-array `ms` counts as `clipMsInvalid` (r29 rules); `ms: null` reads as absent.

## Readers
- Step 31 reads none of these. The host loader picks them up with the host shell. QA: there's no core-types sha change, so no add-only check is needed. Please check the reader against these docs when the host shell lands.
