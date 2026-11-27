# In-maker art test: B r6b props in TileEngine (CoS 27 Nov 09:45)

This is a local test only. Nothing was committed, pushed or published. The repo was cloned at main `b736cd97` to `/workspace/art-test-r6b` and stays clean (`git status` is empty). The maker was built locally to `/workspace/art-test-r6b-out`, and the test page was built to `/workspace/art-test-r6b-www`. The uniqueness pass is still on hold. `b-r6b/` and `b-r6b-rain/` are frozen and were only read.

## What's here
- `sprites/` holds the 26 props as transparent 48 px PNGs: 12 oaks, 3 houses with chimneys (red, slate, wood), 1 fence, 4 stones (one big), 3 bushes, a crate, a barrel and a lantern.
- `extras/` holds the 4 units (2 knights, boy, farmer). They're only there so the village matches r6b. The knight is parked.
- `shadows/` holds one contact-shadow PNG per sprite, using the same foot point.
- `manifest.json` gives each sprite's size and foot point, plus its r6b placement. The foot point is the spot it stands on, in whole px from the sprite's top-left. The placement is that foot in whole stage px at 48.
- `ground-48px-noshadow.png` and `ground-48px-withshadows.png` are the r6b ground on its own, used as the map picture.
- `ref-r6b-48px-nograde*.png` are the r6b bake before grade and light, kept for pixel checks.
- `export_sprites.py` re-exports everything with `PYTHONDONTWRITEBYTECODE=1 python3 export_sprites.py`. It only imports `../b-r6b/style_b6b.py`.
  - Check: the grade applied over the export's composite matches `b-r6b-48px-1x.png` to within 2 levels, with 0 px off by more than 2.
- `harness/` has the local test page:
  - `build-harness.ts` strips TileEngine's own renderer modules to JS with the repo's `toJs`. That's 23 modules: `buildDrawList`, `fitView`, `present` and the `canvas2d` backend.
  - `page.js` draws the sprites as standing objects with a px anchor at the foot point, the ground as a map picture (backdrop, depth 1) and the shadows as `fxGround` overlays.
  - `shots.mjs` takes the 390×844 screenshots at dpr 3 in headless Chrome.
- `sheets.py` makes the side-by-side sheets.
- `shots/` holds the screenshots and sheets:
  - Phone screenshots at 390×844: `engine-village-noshadow`, `engine-village-shadows`, `engine-snapped-shadows`, `engine-scrambled-shadows` and `engine-scrambled-noshadow`, plus `maker-play-stage` and `maker-home` from the local maker build as it is now.
  - `side-by-side-r6b-vs-engine.png`: the r6b bake next to the engine render, both at 2×.
  - `engine-placements-2x.png`: exact shadows, then snapped to tile, then scrambled.
  - `phone-390x844-now-vs-r6b.png`: the maker play-stage today next to the same renderer with the r6b sprites.
  - `*-canvas-raw.png` are the canvas backing at 1170×1056 (2×), used for the pixel checks.

## Important: how they were loaded
The maker build at `b736cd97` has no way to add a prop sprite yet:
- Art can only come in as a map picture. The Art panel's `addPicture` adds a background layer.
- The play-stage draws 16 px placeholder squares. `TILE = 16` is hard-coded in `tools/play-stage/load.ts`.

So the sprites went through the maker's own render core, the same `buildDrawList` and `canvas2d` the play-stage uses, set to 48 px tiles, on a local test page. That's as close as current main allows without changing the repo.

## What slips

### 1. Sprites: nothing
- With whole-pixel feet, the engine's render without shadows is **pixel-identical** to the r6b composite before grade (0 of 304,128 px differ, at clean 2× blocks).
- The first pass had 2 props (stone-02 and barrel) landing 1 px right. r6b put them on half pixels, and Python rounds half to even while the engine rounds half up. The export now writes whole-pixel feet and placements, so this can't happen again.
- Rule for later exports: feet and placements are whole px.
- Missing: **there's no well in r6b**. None was drawn, since that would be new art while the uniqueness pass is on hold. It needs a go to add.

### 2. Layout and contact
- **Sort and overlaps are right in every shot.** Sorting by foot puts trees, houses and units in front of or behind each other correctly, even scrambled.
- **The village layout needs nudges smaller than a tile.** The engine's standing `dx`/`dy` handle it, but the maker places one prop per tap on a tile.
  - Snapped to tile centres, feet move by up to 24 px across and 46 px down.
  - In `engine-snapped-shadows` the crate sits on the red house's wall line, the fence runs into the wood house, and the lantern and stones drift off the path edges.
- **Big props stand on tile edges, not tile centres.**
  - Houses are 120×99, a footprint 2 tiles wide, so their foot is on a tile edge and snapping shifts each house 24 px.
  - The fence's foot is its left post, so snapping shifts it a whole post.
  - Needed: a footprint size per prop (for example a house is 2×1 tiles) with the foot point at the footprint's bottom centre, and a nudge for fine position.
- **Scrambled placement has no checks.** Props land on the pond and the path, and big props near the map edge get cut off (the slate house at the right edge, and a knight on its roof). The maker needs "can't stand here" (water, edge) and footprint overlap warnings.
- **Contact shadows: there are none in the engine today.**
  - Drawn as `fxGround` overlays, shadows sit under all standing sprites and move with them (see the scrambled shot). The coverage matches r6b at 97%.
  - The tone is off. The engine only blends normal and add, so a flat translucent dark comes out lighter than r6b's ×0.62 multiply: mean brightness in shadow is 56 against 46. Overlapping shadows also stack darker instead of merging.
  - Needed: a multiply blend, or one shadow-mask layer per map.

### 3. Lighting layers: not in the engine yet, as expected
- There's no warm grade, vignette, sun shafts or lantern glow, so the engine render is cooler, greener and flatter than the checkpoint. See `side-by-side-r6b-vs-engine.png`.
- These are the planned engine layers (grade, contact and edge darkening, soft shadows, water glow) from the csoda reference. The `b-r6b-rain` checkpoint needs the same layers plus particles.

### 4. Ground
- The r6b ground (grass, paths, pond) is a per-pixel bake, so here it's one map picture.
- With real tiles, the path and pond edges need tile art (edges and corners). That's a separate job and isn't tested here.
