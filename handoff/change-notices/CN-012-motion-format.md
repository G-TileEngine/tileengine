# CN-012: authored motion (colour cycle, scroll and sway) (format only, additive, render only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-13 18:0x London. Confirmed by: Engine Architect 17:59 (all 11 rulings); three amended by the CEO 18:04 via the CoS, relayed by the EA. r33 rulings 18:1x (QA s32 review d80cfa66; EA 18:12; DSK). r34/r35 follow-ups 18:2x / 18:4x (EA 18:24, 18:36; QA 7fd085fa).
Kind: format only, additive, render only. **core-types unchanged at `61fad786`** (it holds no AssetMeta, tileProps or paint-style body). No version bump, no migration: every field is optional; absent motion = today's behaviour (painted frames, no bake), so old projects load unchanged.

Docs: project-format **r35** (`ce7e9f53`). (Earlier: r33 `d11aa573`, r34 `0644c4a8`.)

## Fields
- AssetMeta `motion?: {cycle?, scroll?, sway?}`: sprite, tileset and image assets. Named `motion`, not `bake` (that name already means proceduralShip `bake` and `bakedFrom`) and not an `anim` extension (`tileProps.anim` is a clip name).
- Tileset `tileProps[i].motion?`: same shape, per tile; the tile's object replaces the asset's whole, the same as `lightSource`.
- Map `objects[].motion?: Motion | null`: per-placement override, replaced whole (CEO 18:04 via CoS: makers switch it on or off per plant). `null` = no motion on that placement. Absent = inherit the asset's (or tile's) own. There is no `leafy` tag; the tree, bush and grass recipes and the BTF bake script still write `motion.sway` on their outputs.
- `cycle = {ramp, ms?: int 50–1000 default 150}`. `ramp` is either `{name: <style ramp key>, steps: int[]}` (0-based indexes into the style's `ramps[name]`, dark to light, 2–8 of them, no repeats), used under a paint style, or a literal `"#rrggbb"[]` of 2–8 colours, allowed only on an asset with no style. Bakes one frame per step. Transparent pixels (alpha 0) and pixels whose colour isn't on the ramp never cycle.
- `scroll = {step: int ≥ 1 dividing the tile size on that axis, axis?: "x"|"y" default "x", ms?: int 50–1000 default 200}`. Bakes `size / step` frames.
- `sway = {trunkFrom: int ≥ 0 (required), edge?: int 1–4 default 2, ms?: int 100–1000 default 400}`. Bakes 4 poses. Set per asset, with no `leafy` tag. **`ms` is a stored field** (int 100–1000, default 400). **`edge` is 1–4** (default 2; confirmed r33). The frame border counts as transparent for sway's edge detection.
- Combined parts each keep their own `ms` and advance on their own: `pose = floor(t / ms_part) mod n_part`. The baked atlas is the product of the parts' frame counts, capped at 64. The runtime picks the atlas cell from the part indices, with no shared clip tick.
- On a procedural asset, `motion` lives in the hashed params, like `anim`. A stored AssetMeta or `tileProps` `motion` is ignored with `styleParamIgnored` and kept (R4).

## Warnings (never block, values never rewritten)
- `motionInvalid`: once per asset. A bad value, a colour list on a styled asset, an index-form ramp on an unstyled asset, or an out-of-range step: that part is skipped. **Clip-wins is decided at load, per drawn cell**, not by whether a clip is playing. Motion is ignored on that cell when the cell is animated: a tileset tile whose `tileProps[i].anim` (stored or derived) names a clip, or a sprite asset with a non-empty `clips[]`. Image assets have no clips. Under a paint style the water slot derives a clip from `anim`, so motion on styled water applies only with `anim: null`. **The `motionInvalid` message for an animated cell tells the maker to set `anim: null`** (r34; restated r35).
- `motionTooLarge`: once per asset, when the product of the active parts' frame counts would pass 64 (this CN creates that cap; it is not the r25 effect-block 64-step cap). Motion is skipped and the asset draws as painted.

## Not in the format
- The phase offset is derived at runtime and never stored. Sway uses the world-x travelling wave; cycle and scroll use the per-instance hash. There is no stored offset field.
- When the player's `accessibility.reduce_motion` is on (profile-format §3.3), cycle, scroll and sway draw frame 0. The shore's breathing foam and waves also freeze on frame 0; the static foam line stays visible (CN-013).
- The river speed (1 px per 0.2 s) and the default sway timing are code constants that match the format defaults (`scroll` `step` 1, `ms` 200; `sway.ms` 400). They have no format effect beyond those defaults; `sway.ms` remains a stored field.

## Readers
- Step 32's bake functions take frames + params and do not read stored meta. The host loader picks these fields up with the host shell. QA: there's no core-types sha change, so no add-only check is needed. Please check the reader against these docs when the host shell lands.
