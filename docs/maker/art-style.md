# TileEngine art style

Status: **ruled 27 Nov 2026 (decision 5).** The CEO typed both answers in the Chief Of Staff's chat at 20:14 and 20:16 London.
- **Style:** the CEO called B r6b the best so far and a good **baseline**. It still needs more rounds.
- **Build now, swap later:** the CEO asked whether we could build on r6b now and swap in better art later. Building it in now is the Chief Of Staff's recommendation and isn't a CEO ruling yet.
- **Method (the CEO answered "Yes"):** port the Python bake recipes to JavaScript in `tools/art-bake/`, so the maker draws the art from recipes. This **replaces M1, M2 and M3**.
- **Void:** the 27 Nov 04:57 decision card that reported "M3" was false; the CEO did not pick it. It counts for nothing, and the M3 option draft is retired.

Evidence (team share, not in the repo): `/workspace/share/maker-look/art0/styles-code/`.
- `b-r6b/`: the baseline checkpoint (`SHA256SUMS` sha256 69e57b61…, README 1c2f902f…). Village at 48 px and 32 px, 1x, 4x and side-by-sides.
- `b-r6b-rain/`: the weather checkpoint (`SHA256SUMS` db395384…, README 94afafbd…). The same village in rain, 48 px, with a 4-frame GIF.
- `b-r6b-sprites/`: the in-engine test (README 485ddec3…, `manifest.json` 7187b351…). 30 sprites (26 props plus 4 units: knight-01, knight-02, boy and farmer) cut out with foot points and contact shadows, drawn by the maker's own renderer.
- Both checkpoints are frozen. Later rounds go in new folders.

## 1. Fixed for every tile and sprite
- **Grid:** square tiles. Every recipe takes the tile size as an input. The baseline is baked at 48 px (the main bake) and at 32 px. The plan default stays 32 px unless the CEO rules a different size. F3a moves the map and Test to 32 px from `map.tile`, and Test draws 16 px until then. F3b only brings the pack in.
- **Camera:** three-quarter top-down on a square grid, with no isometric diamonds. The ground tile stays square. Things that stand up (walls, trees, houses, units) show their front face and grow up into the tile above.
- **Light:** one sun from the top-left (`LIGHT` in `common.py`). Lit sides face up-left, and cast shadows fall short to the lower right. The same light applies to every tile, sprite and frame.
- **Baked from recipes, not live 3D:** the maker and the bake tool run the same JavaScript recipes to make PNGs. The phone only draws pictures. No WebGL, 3D library or AI service ships, and nothing goes online.
- **Deterministic:** the same recipe, seed and tile size give byte-identical PNGs on every run.
- **Shown sharp:** whole-number zoom and nearest filtering on the phone, as today.
- **Whole pixels:** foot points and placements are whole pixels. Python rounds half to even and the engine rounds half up, so half pixels drift by 1 px (seen in the sprites test).

## 2. The B look (what the baseline is)
- **Pixel mode:** each pixel stores a material and a ramp step, quantised to a hand-picked ramp of 4–8 steps. No blur, no smooth gradients.
- **Hand-authored stamps** for the shapes noise can't make: leaf clumps, grass tufts, bushes, flowers, roof shingles and ridges, sills, window boxes, knight parts, eave kicks and finials. They're placed, seeded and recoloured from the ramps.
- **Outline:** objects and units get a sel-out outline, dark from the neighbouring ramp and never pure black. Terrain has no outline: an edge is a cel break, one step darker on the shadow side and one lighter on the lit side.
- **Rim light:** a warm 1 px rim on the top-left edges of foliage, roofs and armour, used sparingly.
- **Shadows:** crisp two-tone cast shadows down-right, plus a contact shadow under each standing object. In the baseline they darken by multiply (about ×0.62), and overlapping shadows merge rather than stack.
- **Materials read at 1x:** trees as lit leaf clumps, roofs as shingle rows with a lit ridge, chimneys as coursed stone with a cream cap (r6b), crates and barrels that stand up (r6), walls with courses and sills.
- **Ground life:** seeded flowers, tufts and pebbles, and macro light and dark patches so repeats don't show.
- **Water:** deep in the middle with ripple dashes and a darker wet bank.
- **Known gaps carried into later rounds:** tree silhouettes still need more hand-shaped clusters, the knight is parked at its r5 pick, and there is no well yet (adding one needs a go while the uniqueness pass is on hold).

## 3. Palette
- The baseline ramps live in `b-r2/style_b2.py` (`R`), with r3's warmer grass and petal ramps and r6b's 8-step `chimney` stone ramp. There's one ramp per material: grass, leaf, bark, dirt, bank, water, three roofs, wall, timber, glass, door, stone, crate, barrel, fence, iron, glow, steel, leather, plume, two team colours, gold, shirts, pants, skin, hair, straw and flowers.
- The port moves these into one palette file in `tools/art-bake/`, which every recipe reads by material name. Recolouring a pack means editing that file, not the recipes.
- Terrain ramps map onto the paint style's six terrain ramps (`docs/maker/data/project-format.md` §6.2.5 `ramps`: grass, dirt, stone, rock, water, bloom). ART1a and the Data & Save Keeper set the exact mapping. Effects keep the Effect Designer's four ramps: fire, frost, holy and venom.
- No pure black or white. Bright accents (flowers, glints) stay rare, about 1% of pixels.
- The baseline colours aren't locked. ART2 locks the first pack's palette.

## 4. What the engine needs from the bake
1. **Recipes**, one per thing: tree, bush, rock, crate, barrel, lantern, fence, house (red, slate and wood roofs, with a chimney), unit (knight, boy, farmer, with team colour), plus ground (grass, path, pond and bank). Each takes a tile size and a seed and returns a sprite (material and step per pixel), its foot point, and its shadow shapes. Today they're `recipes.py` and the `style_b*.py` layers up to `b-r6b/style_b6b.py`.
2. **Shared blocks** the recipes call:
   - The sprite type (material, ramp step and shade per pixel).
   - Seeded hash and value noise (`hash2`, `vnoise`, `fbm`).
   - Ramp quantise and lerp (`ramp_q`, `ramp_lerp`).
   - Sphere lighting from the one sun (`sphere`).
   - Sel-out outline masks (`outline_masks`) and the rim pass.
   - The stamp grids and their legends (`b-r3/stamps.py`, `b-r3b/stamps2.py`).
   - Shadow masks (`shadow_mask`) and colourise.
3. **Palette:** the one ramps file from §3.
4. **Lighting and weather passes.** These run over the composed map in the engine, not baked into sprites, so one set of sprites works for sun, rain and night:
   - Sunny (the r6b look): multiply contact and cast shadows, the warm grade and vignette, dithered sun shafts on the ground and trees, and the sky band in the top row.
   - Rain (the `b-r6b-rain` look): soft shadows, an overcast grade, contact darkening, wet sheen and puddles, darker water with rain rings, warm window and lantern glow with spill, light fog that thickens toward the top, and rain streaks and splashes that change each frame.
   - Every pass reads a material id per pixel (which material is on top) as well as the colour.
   - The engine blends only normal and add today. It needs a multiply blend, or one shadow-mask layer per map, before shadows can match the baseline. Adding multiply to `Blend` is a format change for the Data & Save Keeper, not part of the bake.

## 5. Port check (pass/fail for the bake port)
- The JavaScript port of each recipe matches the Python checkpoint for the same seed and tile size: sprites pixel for pixel, and the graded village within 2 levels per channel with 0 px off by more than 2 (the rule the sprites export already passes).
- If float noise makes a pixel-for-pixel sprite match impossible, the Engine Architect sets the tolerance in the ART1a guide and QA checks it.
- The port stays in `tools/art-bake/` with its own `package.json`. No bake code or library reaches the root `package.json`, the engine or games.

## 6. Readability at 390 px (pass/fail for ART2)
- A 390 px phone shows the map at whole-number zoom with tiles at least 44 css px (the play-stage rule).
- A unit is about 1 tile tall and reads as a person with a clear team colour at 1x.
- Water, grass, path and wall blocks can be told apart at 1x without words.
- Objects that block movement (house, tree) look solid, and their shadows don't look like walls.
- Every ground tile tiles seamlessly with its neighbours (ART1b edges).

## 7. Swapping in better art later
- A new round edits recipes, stamps or the palette and gets a new checkpoint folder. The output format, foot points and engine passes don't change, so a swap is a re-bake with no maker or engine change.
- Every new round is judged by the CEO by eye at 1x and 4x against the last checkpoint.

## 8. Limits
- The baseline is a whole-village bake. The port bakes each tile and sprite on its own with the same camera and light.
- Path and pond edges need real edge and corner tiles (ART1b). The baseline ground is one picture.
- Prop placement needs footprints (a house is 2×1 tiles, foot at the footprint's bottom centre), a nudge for fine position, and "can't stand here" checks. That's maker UX for a later step, not part of the bake.
