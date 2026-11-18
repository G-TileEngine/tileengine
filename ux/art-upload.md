# Art & Backgrounds: upload flow (TileEngine)

Owner: Editor & UX Designer · 2026-11-09 · status: DRAFT r6 (CEO rulings Q1–Q5 + D6 + D7 + D8, project-format r7–r10, Engine Architect r2 answers applied)
Mockups: `/workspace/tileengine/ui-shell/mock-art/` (own `index.html` + `art.css` + `js/art.js`, links `../css/app.css`, does not touch `ui-shell/index.html` or `js/app.js`).
Aligned with: `data/project-format.md` **r10** (AssetMeta v2 §6.2, §6.2.1 `derivedFrom`/`role` + `cropFrames`, §6.2.2 procedural origin (code tiles and shape tokens), §6.2.4 library copies + `credit`, units §6.3 clips, map **v5** §6.4 `background.layers[]`, `logic.edges`, `wallLook`/`Edge.look` + stock constants, **`objects[]`**, size §10 decoded meter, editor prefs §11.3, validation §13, §6.2.5 paint styles, §12 migration 005, §14.6d–f, §17.9), `docs/ARCHITECTURE-v0.md` §12 (v0.3/v0.4), `docs/target-size-limits.md` and `docs/asset-spec-proposal.md` (K1–K14, C14, C15).
`behaviour-library/behaviours.json` **rev 9** knobs used on these screens: `ability-presentation.team_colours`, `unit-roster.team_colour_override`, `unit-roster.team_colour`, `unit-roster.clip_cues`, `terrain.wall_blocks_los`, `terrain.wall_blocks_shots`, and `terrain.tile_types` (rev 9 adds `water`, `lava`, `wall-block`) for the walk-rules palette and "Units treat it as".

**The one rule (CEO):** art must never look worse than the upload. We never stretch, never blur, and only ever zoom pixel art by whole numbers with nearest-neighbour. Anything that could blur or stretch sits behind **Settings → Display → Advanced** (`settings.advancedRender`, off by default).

---

## 1. Research summary

| Tool | Tile size | Background methods | Sprite rules | Scaling / filtering |
|---|---|---|---|---|
| **RPG Maker MZ** | Fixed **48 × 48**. Sheets: A1 768×576, A2 768×576, A3 768×384, A4 768×720, A5 384×768 (8×16), B–E 768×768 (16×16); top-left tile of B must be blank [1] | Tile painting (A = lower layer with autotiles, B–E upper layers) [1]. **Parallax** background: any size, optional loop H/V, auto-scroll −32…32, "Show in the Editor"; a `!` prefix sets parallax to 0, which is how "parallax mapping" (one painted map image) works [1][2][3]. Map width/height 0–256 tiles [2] | Character frame = 1/12 of sheet width and 1/8 of height (8 characters per file, 3 patterns × 4 directions); **`$` prefix = one character per file (3×4)**; drawn 6 px above the tile; `!` removes the 6 px shift [1][4] | All images PNG. Odd image widths "may be blurred when displayed", even widths recommended [1] |
| **Tiled** | Any; set per tileset (tile width/height) [5] | Tileset painting on tile layers; **image layers** (one image as fore/background, Repeat X/Y, offsets, parallax) [5][6]; **infinite maps**, stored in chunks (default 16×16) [5][7] | Image-based tilesets support **margin** (top/left) and **spacing** between tiles; "collection of images" tilesets for odd-sized tiles; optional transparent colour [5][8][9] | Not a runtime; no scaling rules of its own |
| **SRPG Studio** | Map chip **32 × 32** by default; can be raised (e.g. 48×48) in Game Layout → Map Layout, then cursor/panel UI must match [10][11]. Below 32 isn't supported; users upscale 16 px tiles ×2 (community, unverified) [12] | Map chips (PNG/JPG/BMP) [10]. **One-picture map**: import a big image as a map chip, then "Paste map chip" at 0,0 and set terrain per cell, which is effectively auto-slice [13] | CharChip 192×320 sheet, **64 × 64 per frame** on 32 px tiles (bigger than a tile), 3 columns, 5 rows (front + 4 move directions) [10] | Not documented beyond fixed sizes. *Uncertain:* the 255×255 max map size in one search summary was not verified on the manual page (the manual's "up to 255" is about chips per file) |
| **Godot 4** | Any; TileSet tile size must be set before atlas creation; non-square allowed [14] | TileSet atlas from a tilesheet; atlas **Margins**, **Separation**, **Texture Region Size**, "Use Texture Padding" (1 px edge against bleeding); auto-creates tiles, skipping fully transparent regions [14] | Not prescribed | Pixel art: **Default Texture Filter = Nearest**; Stretch Mode `viewport`, Aspect `keep`; **Stretch Scale Mode `integer`** (4.2+) rounds the scale down and letterboxes the rest; `fractional` gives uneven pixels [15][16][17] |
| **Web platform** (our runtime) | — | — | — | `image-rendering: pixelated` keeps hard edges; non-integer `devicePixelRatio` can still make pixels uneven; draw at integer multiples only [18]. iOS Safari ≤ 17 canvas area limit 16,777,216 px (4096²), iOS 18: 8192² [19] (also ARCH §12.6) |

**What we take from each:** RPG Maker's exact required sizes and `$`-style single-character sheets (we detect the layout instead of using file-name prefixes); Tiled's margin/spacing and image layer with Repeat; SRPG Studio's "one-picture map" (auto-slice) and its proof that units taller than a tile are normal for SRPGs; Godot's Nearest + integer scale + letterbox as the default output model.

## 2. Our rules (exact numbers)

| Rule | Value | Where stored | Notes |
|---|---|---|---|
| Project tile size | **Suggested per platform in the New Project wizard; the user can change it** (CEO ruling 1). Allowed art sizes 16 · 24 · 32 · 48 · 64 · 96 · 128 | `settings.tileSize` | The wizard owns it. Art screens only show the chip **"32 px · from project settings"**; they never set it |
| Per-map tile size | "Project default" (null) or 16/48/64 … | `map.tile {w,h} \| null` | Tile sheets used by that map must match; a mismatch draws at native size, clipped, never stretched |
| Tile sheet | PNG (WebP lossless OK). Width and height whole multiples of the tile. Margin/spacing 0 by default | AssetMeta `tile`, `grid` | Leftover pixels: warn + Crop / Pad / Zoom ×k, each recorded as a `derivedFrom` op |
| Painted map image | **Exactly `cols × tile` by `rows × tile`** (20×15 at 32 px = 640×480); with parallax on, **at least** that size | `map.background.layers[0] {assetId, depth, repeat, fit?}` | Default `fit: "none"`, parallax off (`depth: 1`) |
| Parallax | **Off by default.** One **"Scroll speed"** slider 0–1 in 0.1 steps. It **is** `depth`, the scroll factor (0 = still, far away; 1 = moves with the map); there is no separate scroll field. Advanced: a layer list with a Repeat picker (none · x · y · both) per layer | `map.background.layers[] {assetId, depth 0..1, repeat, fit?}` (map v5, r7) | Layers draw far-to-near, **all under the tile layers** (no foreground parallax). Offset = `round(camera_px × depth)` in source px, × integer zoom, so layers stay sharp (whole pixels unless Advanced render is on). **Soft cap 3**: more warns ("memory is the real cost") but all draw. A saved depth outside 0–1 warns and is clamped |
| Background fit | `none` (default) · `tile` (always) · `cover` · `stretch` | `map.background.fit` | cover/stretch only with Advanced render; otherwise stored, greyed "needs Advanced render", drawn as `none` |
| Sprite frame | **width = 1 tile** (v1, CEO ruling 2); height 1×, 1.5× or 2× tile (32×32, 32×48, 32×64) | AssetMeta `frame`, `grid`, `anchor`, `clips` | Wider frames: greyed "2×2 and wide units are coming later" + **Crop to one tile wide** (the `cropFrames` op) / Cancel. Never stretched or shrunk. Tall units: the tap/hit area is the **base cell only** |
| Walk sheet | Frames across; rows down/left/right/up | AssetMeta `clips[]` | A 4-row sheet gets clips `down`, `left`, `right`, `up`; a 1-row sheet gets `idle`. Names are editable free text (1–32 chars) |
| Fix history | Crop · Pad · Zoom ×k · Make colour see-through · **Crop to one tile wide (`cropFrames`)** · Auto-slice · Remove repeats | AssetMeta `derivedFrom {assetId, ops[]}`; original asset `role:"source"` | Original **kept, never exported**. "Re-fix" replays from the original and re-points every reference as **one undo step** |
| Colour key | corner colour → fully transparent, exact match | `colourKey` op, **baked at import** | No transparent-colour field |
| Auto-slice | **Exact pixel repeats only** (CEO ruling 5); no "similar tiles" option | `slice` + `dedupe {removedCount}` ops | Cells / unique / padding are derived |
| Texture limit | **≤ 4096 px a side AND ≤ 16,777,216 px area** | `settings.maxImageSide` (4096) | Over: **Auto-slice at import** into pages (primary), or Crop. PC-only projects may raise to **8192** behind a warning toggle |
| Pages | exact pixel copies, aligned to tile multiples | parent `pages[]`, page assets `kind:"page"` | Hidden under the parent in the asset list |
| File size | soft warn over **20 MB** per file | — | Never blocks |
| Odd width/height | **info note only** | — | "Fine; some engines blur odd sizes slightly, we don't." |
| Size meters | always shown, never block. On disk: general 50 / 150 MB; per target (itch 450, Play 180, Apple 180 MB). **Memory when playing (decoded `w×h×4`), rated against the strictest selected target** (biggest stage): iOS / mobile web warn 256 MB, strong 448 MB · Android 240 / 360 MB · PC (web) 512 / 768 MB | `index.size.meters[]`, `index.size.decoded` | Over warn adds "Low-end phones may close the game"; never blocks |
| Map size | presets 6×9 · 12×12 · 20×15 · 32×24 · 64×48; sliders 4–256 | `map.cols/rows` | Warn above 256×256; no cap |
| Walk rules | Tile types from `terrain.tile_types` (Floor, Vines, Trap, Water, Lava, Wall block, plus the mode-specific types under "More types"); **walls are painted by tapping a tile edge** | `map.logic.terrain` (palette numbers) + `logic.palette` + `logic.edges` | Painting a ground tile writes its `tileProps.logic` type's palette number unless the cell was hand-painted. Wall rules: `terrain.wall_blocks_los`, `terrain.wall_blocks_shots` (both default on) |
| Wall look | **Line** (stock `#20242C`, width `max(1, round(tile/16))` source px = 2 at 32 px; width 1–3 and colour optional) · **Image** (a wall strip one tile wide, **centred** on the edge, **rotated 90° clockwise** on vertical edges, whole-number scale only; not one tile wide → warning) · **Invisible** (still blocks; a dashed overlay in the editor only, never in Preview or Render) | `map.wallLook {mode: line\|asset\|invisible, colour?, width?, assetId?}` is the map default; `logic.edges[].look` overrides one wall (r8) | **The look never changes blocking** (hint on screen). Drawn in the tile pass above the floor, below units. "Show wall rules on hover" (default on) |
| Code tiles | 8 recipes: `grass` `water` `stone` `sand` `dirt` `wood` `snow` `lava`; palette base + accent; pattern `noise` · `stripes` · `brick` · `waves`; size 1–4; variation integer 0–100 %; seed | AssetMeta `origin: {kind:"procedural", params: {terrains[]}}` (§6.2.2) | "Units treat it as" = a `terrain.tile_types` id, stored as `tileTypeOverrides[recipe]` **only when it differs** from the recipe default (water→water, lava→lava, others→floor) |
| Shape tokens | circle · square · triangle · diamond; glyph letter (bundled CC0 pixel font) · icon · none; optional `fill` | `origin.params.token` (§6.2.2) | **No team colour on the asset**: with no fill a unit takes its side's colour per stage; a prop draws in the engine neutral. "Bake to image" is greyed on team-coloured tokens |
| Paint style | **Ashroad v1** (`btf-ashroad@1`, day, default) · **Moonlit v1** (`btf-moonlit@1`, night), both **locked** (D8). `te-classic@1` is internal only (migration 005 pin), no card | `origin.params.paintStyle {id, version}` (r10, hashed, so a style update can never change a map by itself); embedded `paint-styles/<id>@<version>.json` | UI word is **"Style"**, never "preset". Style updates are **parked** (§10); the styles never change, so maps always look the same |
| Ship as | **Auto** (default) · Baked · Live, one choice for all code tiles and shapes | `project.render.proceduralShip` | Pixels are identical either way; the editor preview is always live |
| Library copies | Copied into the project on first use; the project copy always wins | `origin.builtin {libraryId, assetKey, rev}`, `credit {license, …}` | Licence label from `credit.license` (SPDX id, `CC0-1.0` shown as "CC0"; `own` as "Yours"). Newer library rev → a **notice** with "Update…" that keeps your edits. v1 library = Kenney CC0 packs only (D6): every line reads "CC0 · Kenney" |
| Map objects | A tree, rock or cottage on **one cell**; bottom-centre anchor, tall art overhangs upwards and **sorts by row with units** (object first at a tie). **Blocks movement: off by default.** When on, sight and shots follow the wall knobs unless set to Blocks / Lets through. Not units: no HP or side, can't be targeted | `map.objects[] {id, assetId, at {c,r}, blocks?, blocks_los?, blocks_shots?}` (r9) | No per-stage objects: "for different objects, use another map". Two objects on one cell is info; a blocking object on a spawn cell warns |
| Zoom | whole steps 1×–6× | `camera.*`, `pixelPerfect` (on) | Fractional only with Advanced render + pixel-perfect off ("may blur your art") |
| Screen fit | **Letterbox** (default) or **Crop** | `settings.screenFit`, `letterboxColour` | No "Shrink to fit" |
| Editor view state | last zoom, minimap on/off, active layer, walk-rules overlay | **`editor-prefs.json`** (per user, §11.3), never in the project | No UI change; these never mark a project as changed |

## 3. Flows, step by step

### 3.1 Art hub (`#art-hub`, shots 01, 01b, 01c)
1. Map summary card, then the size meters: game size on disk per target, plus **Memory when playing** (all images, biggest stage) **rated** against the strictest selected target (§2), with "Low-end phones may close the game" over the warn level (shot 14).
2. "How do you want to make the background?" **Four** choices: Paint with tiles (Recommended) · One painted image · Cut a big image into tiles · **No art? Paint with code**.
3. Characters & view: Unit sprites (Upload or Built-in Library) · Shape units & props · Mix-and-match example · Look around the map · Display & screen fit.
4. Art in this project: one row per asset with its **source tag** (Code / Built-in / Uploaded). A fixed asset shows "Fixed: crop to 224 × 160", a **Re-fix** button and "◆ Original kept (not exported) · hills-raw.png · 250 × 190 px". Page assets are hidden under "N pieces"; `role:"source"` originals never get their own row. Each row shows its licence label (CC0 · Kenney / Yours / Generated). A library copy with a newer rev installed shows **"Newer version in library · rev 3; you have rev 2"** and **Update…**, which lists Picture (changed, ticked), Feet point (you edited this: kept unless ticked), Credit (same). "Your edits are kept. The old copy stays until you delete it. One undo step." It is a notice, never a warning (shot 11e).
5. **Credits file** (on by default): an editable CREDITS.txt filled from each asset's `credit`, with "Not required for CC0, but kind to credit" (shot 14b).

### 3.2 Map size (`#map-size`, shots 02–02c)
Presets; "Tile size for this map" (Project default = `map.tile: null`, or 16/48/64); width/height sliders 4–256; a live card (required image px, cells, phone view at 2×, memory); notes for "drag to pan", "over 4096 px: auto-sliced into N pieces", and "over 256×256".

### 3.3 Tileset painting (`#tileset` → `#tile-paint`, shots 03–04h, 11c, 15)
1. **Upload | Built-in Library** tabs. Upload shows the format guide and the checks (file and memory, whole tiles, odd size info, transparency, texture limit). "Tiles in this file are drawn at" 16–64 is pre-filled from an edge guess.
2. On a mismatch: Crop · Pad · Zoom ×k. The chosen fix shows "Fix steps · saved with the new copy" and "Original kept (not exported)".
3. Paint: tools Paint · Fill · Erase · Move · Undo. Layers **Ground · Decor · Above units · Walk rules**.
4. Walk rules palette: `terrain.tile_types` ids (Floor, Vines, Trap, Water, Lava, Wall block; rev 9). The label says "writes palette #1 = vines". Then **Wall (edge)**: tap near a tile edge to add or remove that wall, and drag along a line to draw several. Walls are stored once per physical wall (`e`→`w` of the right neighbour, `s`→`n` of the one below).
5. With the Wall tool selected, a small **All walls** row shows **Walls block sight** and **Walls block shots** (`terrain.wall_blocks_los` / `wall_blocks_shots`, both On).
6. **Wall look (this map)** (`map.wallLook`, r8): Look **Line · Image · Invisible**. Line: Width 1/2/3 px (stock = `max(1, round(tile/16))`, 2 at 32 px) and four colours led by stock `#20242C`; choosing a stock value stores nothing. Image: a strip one tile wide, centred, turned 90° clockwise on side walls, whole-number zoom; "This wall image isn't one tile wide…" warns otherwise. Invisible: "Still blocks. Nothing is drawn in Preview or the game; the editor shows a dashed line so you can find them." One wall can get its own look (`Edge.look`): **One wall's look…** then tap a wall (blue outline); "This wall": Map default · Line · Image · Invisible, plus colour and width for Line; "Only this wall. Blocking is the same in every look." Each change is one undo step (shot 04h). Hint: **"The look never changes blocking: every look blocks the same."** Also **Show wall rules on hover** (default On) and **Preview targeting** (shots 04e–04g).

7. **Objects** layer (map.objects[], r9; shot 15): the palette shows library objects (Pine tree, Oak tree, Rock, Boulder, Cottage). Tap a cell to place one; tap an object to select it (blue outline on its cell); Erase removes it. The panel shows its name, cell and id, then **Blocks movement** (Off by default; blocking objects get a dashed red cell outline in this layer). With Blocks on: **Sight** and **Shots** each pick *Same as walls* (default, `null`, follows `terrain.wall_blocks_los` / `wall_blocks_shots`) · Blocks · Lets through. Hint: "Objects aren't units: they can't be targeted and have no HP or side. Every stage using this map gets the same objects; for different objects, use another map."

### 3.4 Painted image and parallax (`#bg-image`, shots 05–05j)
1. Exact size needed (cols × tile by rows × tile). An exact fit sits under the grid 1:1.
2. Mismatch: Crop (3×3 "keep which part"), Pad (border colour), Zoom ×k when exact, or "Change the map to N × M tiles". "Or keep the file and draw it…": As is · Repeat · Cover/Stretch (Advanced render only).
3. Over the texture limit: **Auto-slice at import** (primary) or Crop; the 8192 toggle appears only on PC projects.
4. **Scroll with parallax** (CEO ruling 3), **Off** by default. On: one **Scroll speed** slider for `layers[0].depth` (0 · still (far away) … 1 · moves with the map; "0.3 · far"), no separate scroll field, and a **live preview** where the camera pans, the background moves slower and the ground tiles move at full speed, all in whole pixels. With parallax on, an image bigger than the map is "Fine for parallax".
5. **Advanced · parallax layers**: the `layers[]` list (layer 1 is the farthest), each with its own Scroll speed slider, a **Repeat** picker (None · Across · Down · Both = `none|x|y|both`) and Remove. All layers draw under the tiles, far to near. Over 3 layers is a **soft cap**: a warning ("4 layers: more than 3. All of them still draw. Memory is the real cost …") but no block (shot 05j). A saved speed outside 0–1 warns and is clamped.

### 3.5 Auto-slice (`#auto-slice`, shots 06, 06b)
Cut into tile cells and keep **exact pixel repeats only** (no near-match option, CEO ruling 5). Shows "300 cells · 9 unique · 291 repeats removed" and the new sheet, then makes tiles + map. Stored as `derivedFrom.ops: [slice, dedupe {removedCount}]` on the new tileset, with the picture kept as `role:"source"`.

### 3.6 Sprite upload (`#sprite-upload`, shots 07–07f, 11, 11b, 11d)
1. **Upload | Built-in Library** tabs.
2. Detection: "Found 3 frames × 4 directions, each 32 × 48 px. Tall unit: stands on 1 tile and reaches 16 px into the tile above." Frame size steppers in 16 px steps.
3. **Animation names**: one text box per row, pre-filled `down / left / right / up` for 4 rows (`idle` for 1 row), editable. Units without attack or hit clips still get a hit flash and attack lunge when `unit-roster.clip_cues` is on (default).
4. Wrong size or no alpha: Crop / Pad; "Make the corner colour see-through" (recorded as a `colourKey` op, baked).
5. **Wider than one tile** (e.g. a 64 × 64 boss): a greyed note "**2×2 and wide units are coming later.** … We never stretch or shrink it." with **Crop to one tile wide** or **Cancel**. Crop to one tile wide is the **`cropFrames`** op `{frame: {w: 64, h: 64}, rect: {x: 16, y: 0, w: 32, h: 64}}`: one centre rect applied to every frame cell, recorded in `derivedFrom` and replayed from the kept original on Re-fix (shot 07f, "Fixed: every frame cropped to its middle 32 px"). Accept stays disabled while frames are wider than a tile.
6. Tall units: the grid preview outlines the **base cell only** as the tap/hit area and selection; the part above is drawn but not tappable.

### 3.7 Big map (`#big-map`, shots 08–08c)
Drag to pan, whole-step zoom 1×–6×, tap-to-jump minimap, Jump to units, Whole map. Fractional ¼ steps only with Advanced render + pixel-perfect off. Last zoom/minimap/layer are remembered per user in editor prefs, not in the project.

### 3.8 Display & screen fit (`#screen-fit`, shots 09–09e)
Letterbox (default, bar colour) or Crop at whole-step zoom. Pixel-perfect is locked on unless Advanced render is on (two-tap confirm). No Shrink to fit. Imported blur settings are shown as inactive.

### 3.9 No art? Paint with code (`#code-paint` → `#tile-paint`, shots 16, 16d, 16f, 10e)
Testing art is Kenney CC0 plus the two **locked** BTF styles (CEO D8). The style experiments, updates, placeholders and the Classic card are parked (§10).
A. **Pick a style** (shot 16). The default painter is the **painter prototype** (`painter-proto/`, brief `docs/painter-style-brief.md`). Only two cards: **Ashroad v1** (Day · village, `btf-ashroad@1`, selected by default) and **Moonlit v1** (Night · woods, `btf-moonlit@1`), each marked **🔒 Locked** with its pin ref and "In use" / "Not used yet". Card previews and the style panel are **real renders** of `painter-proto/painter.js` (made by `mock-art/scripts/make_painter_previews.mjs`, which only imports it), shown at 1× (cards at exact ½). The panel head reads "Pinned as btf-ashroad@1"; it shows "Real output of the painter prototype. Colours come from the style's 32 locked colours", its four terrains (Grass, Path, Water, Cobble / Cracked lane) and "**Pinned.** 3 maps use Ashroad: v1 on Floor 1, Floor 2, Floor 3. The style is locked, so your maps always look the same." The colour/pattern/size/variation sliders are hidden with the hint "The colour, pattern and size sliders are hidden: Ashroad locks its colours. Any colours a tile already had are kept, just not used." (`paletteIgnored`). No 4×4 seamless-texture options are shown: those details are pending from the Engine Architect.
B. **Units treat it as**: Floor · Vines · Trap · Water · Lava · Wall block plus **More types…** (the other `terrain.tile_types` ids). The recipe default is marked "· default" (water→Water, lava→Lava, others→Floor); the hint says "nothing extra is saved" for the default and "Saved because it differs from the default" otherwise (`tileTypeOverrides[recipe]`).
C. **Ship as** Auto (default) · Baked · Live (`project.render.proceduralShip`), one choice for all code tiles and shapes; pixels are identical either way (shot 10e).
D. **Paint the map** opens the normal painter (Paint/Fill/Erase/Undo, layers, walk rules, edge walls) with the style's tiles as the palette. Crisp by construction: no smoothing, whole-number zoom only.
E. **Load notice for migration 005** (Art hub top, shot 16d): "**Older code tiles were pinned to Classic v1 so they look exactly the same.** Updated when the project opened (1 tile sheet). It's saved the next time you save. Nothing else changed." [OK]. This is the only place the user sees Classic: `te-classic@1` is the internal pin for older code tiles, not a style you can pick.
F. **Style checks** (shot 16f; warnings, never blocking; shown in the mock via `__artPresetsApi.showChecks()`), each in plain words with its code underneath:
   - `paletteIgnored`: "Ashroad ground: Ashroad locks its colours, so this sheet's own colour settings aren't used. They're kept, not deleted." No fix (sliders hidden).
   - `styleRecipeMismatch`: "Night tiles: Moonlit v1 has no Snow, so the Snow tile is painted with Moonlit's colours and may not match." Fix **Pick another terrain**.
   - `styleMissingUsedBake`: "Lane tiles: Moonlit v1 isn't in this project or on this device. The tiles are drawn from their baked sheet, so they look right, but editing them needs Moonlit v1." Fix **Use the bake as an image**.
   - `styleVersionMismatch` is parked with the update flow (§10): with one locked version per style it has nothing to tell the user.

### 3.10 Shape units & props (`#shape-units`, shots 10d, 10f, 10g)
1. Unit | Prop. Shape: Circle · Square · Triangle · Diamond, drawn at 32 × 32 with a 1-px outline (no anti-aliasing).
2. **Fill** (optional `token.fill`): Units: **Team colour** (default, no fill) or **Fixed colour**. Team colour is **not saved on the shape**: each stage gives it the side's colour (`unit-roster.team_colour`, else `ability-presentation.team_colours` for that side), so one token works for both sides. The Player/Rival chips are only a preview. Props: **No fill (neutral)** draws in the engine's neutral grey, or Fixed colour (Stone, Wood, Leaf, Crystal).
3. **Use its own team colour** (`unit-roster.team_colour_override` + `team_colour`) is shown as a setting **on the unit that uses this shape**, not on the shape.
4. Glyph: **none**, a letter (bundled CC0 pixel font, baked in) or an icon (sword, shield, bow, star, heart, skull). On light colours the mark is drawn dark.
5. **Bake to image**: greyed on team-coloured tokens with "Team-coloured shapes stay generated: a picture would freeze one side's colour. Pick a fixed colour to bake." Enabled for a fixed fill (shots 10f, 10g).
6. Preview on a 5×3 grid at 2×.

### 3.11 Built-in Library (tabs in the sprite and tileset pickers, shots 11–11e)
1. Search box, category chips (sprites: All · Trees · Rocks · Houses · Units; tilesets: All · Grass · Water · Stone · Sand · Paths · Snow), a count line, and a 3-column thumbnail grid. Each card has a name, a size or tile count, and a small **Built-in** tag.
2. Tap a card: a detail card shows it larger with its size, "a copy goes into your project when you use it", and **"Licence: CC0 · Kenney · free to use and ship in your games"** (label from `credit.license` `CC0-1.0` + `credit.author`). Then "Use this sprite" / "Use this tile sheet" copies it in (`origin.builtin {libraryId, assetKey, rev}` + `credit`) (shot 11d).
3. v1 library = **Kenney CC0 packs only** (CEO D6). No studio (BTF) pack, premium packs or AI sprites are shown. The empty-state line reads "Free art that ships with TileEngine: Kenney CC0 packs only."
4. Updates: see §3.1 step 4 (notice + Update…, edits kept).
5. All thumbnails in the mock are placeholder art drawn by `js/art-more.js`, standing in for Kenney pack items.

### 3.12 Mix and match (`#mix-map`, shots 12, 12b)
An 11 × 10 map combining code-painted ground (grass, water, sand, stone, dirt), library trees, rocks and a cottage placed as **map objects** (one cell each; tall art overlaps the row above and sorts with units; the cottage and boulder block movement), the user's uploaded knight, and shape-token enemies in the Rival colour plus a Player-side ally. Courtyard walls are on tile edges, with the two wall toggles beneath. Zoom 1×/2×. "Art on this map" filters by source (All · Code · Built-in · Uploaded), and every row carries its tag and a note (recipe; copied into project · CC0 · Kenney; your file as uploaded).

### 3.13 Re-fix (`#refix`, shot 13)
From an asset row's **Re-fix**: shows the asset, "◆ Original kept (not exported)", "Re-fix starts again from your original file, so nothing gets worse each time", the fix choice (Crop/Pad + anchor), **Before / After** op text, "Used in Floor 1 · Floor 3 (2 layers)", "Undo: one step puts it all back", and a preview. Apply is disabled until something changes.

## 4. Validation messages (plain words)

| Case | Level | Message |
|---|---|---|
| Good sheet | ok | "48 tiles (8 across × 6 down), each 32 × 32 px" |
| Not whole tiles | error (blocks *Accept* only) | "Not whole tiles. 250 × 190 px doesn't split into 32 px tiles: 26 px left over across, 30 px left over down. We never stretch art to fit." |
| Drawn at another size | warn | "These tiles look 16 px, but this project uses 32 px. Zoom them ×2 so each pixel becomes a 2 × 2 block. Nothing gets blurry." |
| Background wrong size | error | "Wrong size. This map needs exactly 640 × 480 px. Yours is 700 × 500 px (60 px too wide, 20 px too tall). We never stretch it." |
| Parallax, bigger image | ok | "Fine for parallax: 960 × 480 px is bigger than the map (640 × 480 px). The extra shows as it scrolls." |
| Parallax over soft cap | warn | "4 layers: more than 3. All of them still draw. Memory is the real cost: each layer counts on the memory meter (N MB for these layers)." |
| Parallax speed out of range | warn | "Saved scroll speed 1.4 is outside 0–1. Drawn as 1." |
| Over texture limit | warn | "Too big for phones to load in one piece. … Nothing is blocked: pick a fix." |
| Large file | warn | "Large file: 24.0 MB. Over 20 MB makes the game slow to download. It still works." |
| Odd size | info | "Odd width (99 × 200 px). Fine; some engines blur odd sizes slightly, we don't." |
| JPG tiles/sprites | warn | "JPG blurs pixel edges and can't be see-through. Save as PNG for tiles and sprites." |
| Sprite no alpha | warn | "No see-through background. The unit will show as a 32 × 48 box on the map." |
| Frames don't fit | error | "Frames don't fit. … We never stretch it." |
| Wide unit | note (greyed) | "2×2 and wide units are coming later. Frames are 64 px wide; in this version a unit is one tile (32 px) wide and can be taller. Crop each frame to its middle 32 px, or cancel. We never stretch or shrink it." |
| Crop to one tile wide | toast + fix log | "Each frame cropped to 32 px wide" · "Fixed: every frame cropped to its middle 32 px" |
| Bake to image (team colour) | info (greyed button) | "Team-coloured shapes stay generated: a picture would freeze one side's colour. Pick a fixed colour to bake." |
| Units treat it as | hint | "Grass is Floor by default, so nothing extra is saved." / "Saved because it differs from the default (Floor)." |
| Library update | notice | "Newer version in library · rev 3; you have rev 2" → Update…: "Your edits are kept. The old copy stays until you delete it. One undo step." |
| Wall look | hint | "The look never changes blocking: every look blocks the same." |
| Invisible walls | hint | "Still blocks. Nothing is drawn in Preview or the game; the editor shows a dashed line so you can find them." |
| Object panel | hint | "Objects aren't units: they can't be targeted and have no HP or side. Every stage using this map gets the same objects; for different objects, use another map." |
| Wall image not one tile wide | warn | "This wall image isn't one tile wide. It's drawn at its own size, centred and clipped." |
| Style pinned | hint | "Pinned. 3 maps use Ashroad: v1 on Floor 1, Floor 2, Floor 3. A map stays on its version until you choose to update it." |
| Migration 005 | notice | "Older code tiles were pinned to Classic v1 so they look exactly the same." |
| paletteIgnored / styleRecipeMismatch / styleMissingUsedBake | warn (never blocks) | See §3.9 step F |
| Credits file | hint | "Adds CREDITS.txt to your game, listing the art it uses and each licence. Not required for CC0, but kind to credit." |
| Fix applied | info | "Fix steps · saved with the new copy … Original kept (not exported). Re-fix any time from the art list." |
| Re-fix | info | "Re-fix starts again from your original file, so nothing gets worse each time." / toast "Re-fixed. Both maps now use the new copy. Undo puts it all back." |
| Original missing | info | "Original not included · Re-fix unavailable" |
| Wall tool | label | "Wall · tap a tile edge to add or remove a wall. Walls sit between tiles." |
| Tile type | label | "Tile type: Vines · writes palette #1 = vines. Art doesn't change." |
| Code walls card | toast | "Walls sit on tile edges. In Paint, choose Walk rules → Wall and tap an edge." |
| Memory meter | warn / strong | Rated per strictest target (§2); over warn: "Low-end phones may close the game." Never blocks |
| Inactive stored value | info | "Saved as cover, but it's inactive: needs Advanced render. Drawn as "As is" until then. Nothing was changed." |
| Fractional zoom | warn | "Not a whole step: may blur your art" |

## 5. CEO decisions (2026-11-09) — formerly open questions

| # | Question | Decision | Where it shows |
|---|---|---|---|
| D1 | Default tile size | Suggested per platform in the wizard; the user can change it. The wizard owns it | Art screens show the chip "32 px · from project settings" only |
| D2 | Units wider than a tile | v1: **tall units one tile wide only**. Wider: greyed "2×2 and wide units are coming later", Crop to one tile wide or Cancel; never stretch | §3.6 step 5, shot 07e |
| D3 | Parallax in v1 | **Yes, as an option**: "Scroll with parallax" off by default, one depth slider, live preview; up to ~3 layers under Advanced | §3.4 steps 4–5, shots 05h, 05i |
| D4 | Keep the original after a fix | Keep, never export (`role:"source"`); Re-fix replays from it | §3.13, shot 13 |
| D5 | Auto-slice dedupe | Exact repeats only; no near-identical option | §3.5 |
| D7 | Default "Paint with code" painter and style versions (relayed by the Engine Architect, 2026-11-09 20:52 GMT) | The painter prototype is the default. Built-in styles **`btf-ashroad` (day)** and **`btf-moonlit` (night)**, shown with a version ("Ashroad v1", "Moonlit v1"), plus four placeholders "More styles coming". **A project stays pinned to the version it used** (per map). A newer version shows an **"Update available"** badge; updating is **opt-in, for this map or the whole project**, through a before/after preview (slider or side by side) with **Update** / **Keep current**, as **one undo step**. **Nothing updates silently.** The 4×4 seamless-texture details are pending from the Engine Architect and aren't designed here | Pins kept (§3.9, shot 16); placeholders, badge and upgrade flow **parked by D8** (§10); aligned with project-format r10 §6.2.5 (pin `{id, version}`, e.g. `btf-ashroad@1`) |
| D8 | Painter style experiments parked (CEO call, 2026-11-09 21:48 GMT) | Testing art = **Kenney CC0 + the locked `btf-ashroad` and `btf-moonlit` styles**. The Style picker lists **only Ashroad v1 and Moonlit v1**, shown as locked. No "More styles coming" placeholders, no Classic card (Classic stays only as the internal migration-005 pin in the load notice). No v2 stand-in and no "Update available" badge. The update design is kept in §10 so it can come back. No new painter work | §3.9, §10, shots 16, 16d, 16f; parked shots in `screenshots/parked/` |
| D6 | Built-in Library contents and licence (relayed 20:22 GMT) | v1 library = **Kenney CC0 packs only**; the "CC0 or our own" rule stays. No CC BY items, so **no "CC BY: credit added" label and no CC BY auto-credit**. Every built-in licence line reads **"CC0 · Kenney"**. The greyed "Studio pack (pending)" category is **removed** (BTF art isn't in the v1 library). Credits file stays **on by default** with "Not required for CC0, but kind to credit". Premium packs and AI sprites are parked and not shown | §3.1 step 5, §3.11, shots 11d, 14b |

### Open questions for the CEO
None from this round. (Code tiles in export → Engine Architect: "Ship as" Auto/Baked/Live. Shape tokens in finished games → allowed. Library scope → D6.)

## 6. Gaps

**Resolved** (removed from the list; reflected above):
- *project-format r5:* fix history (`derivedFrom`, `role:"source"`, Re-fix), auto-slice link (`slice` + `dedupe`), drawn-at size, 4-row clip names, colour key as a baked op, editor view state in `editor-prefs.json`, decoded-size meter, odd-size info.
- *project-format r7/r8 (§14.6d):* parallax layers (`background.layers[] {assetId, depth, repeat, fit?}`, depth = scroll factor, soft cap 3); code tiles and shape tokens (procedural origin §6.2.2, no `kind:"code"`); library identity + licence (`origin.builtin`, `credit.license`); per-frame crop (`cropFrames`); wall look (`map.wallLook` + `Edge.look`).
- *project-format r10:* paint style pin and embed (§6.2.5), Update available as a computed notice, map/project-scope upgrade as one undo group (parked, D8), migration 005 to `te-classic@1`, and the style warnings (three shown; `styleVersionMismatch` parked).
- *project-format r9:* map objects (`map.objects[]`), wall stock constants and modes (line `#20242C` / `max(1, tile/16)`, centred CW-rotated art, editor-only dashed invisible walls), Kenney-only library (§14.6e).
- *Engine Architect:* Ship as (`project.render.proceduralShip`); shapes allowed in exported games with the bundled CC0 pixel font; parallax offset `round(camera_px × depth)` × integer zoom; decoded-memory thresholds (rated meter); edge walls drawn in the tile pass above floor, below units, stock 2-source-px line; no foreground parallax.

**Note:** all parallax layers draw under the tile layers (no foreground parallax in v1), and a tall unit's tap/hit area is its base cell only.

**Still open**
1. **4×4 seamless texture (Engine Architect).** Pending; nothing about it appears in the mock (r10 §6.2.5 also leaves the macro fields out).
2. **Style body and recipe versions (Engine Architect).** The style `body` (palette ramps, recipe list) is opaque to the format; the mock's "Moonlit has no Snow" example assumes the recipe list from the brief.
3. **Recipes `dirt` / `wood` / `snow` (Engine Architect).** New for the painter (ARCH §13 has 6 recipes).
4. **Default tile types for water/lava (Librarian L27).** The picker already uses the rev 9 ids `water`, `lava`, `wall-block`.

## 7. Sources
1. RPG Maker MZ Help, Asset Standards: https://rpgmakerofficial.com/product/MZ_help-en/01_11_01.html
2. RPG Maker MZ Help, Map Properties: https://rpgmakerofficial.com/product/MZ_help-en/01_07_03.html
3. RPG Maker blog, Parallax Mapping in MZ: https://www.rpgmakerweb.com/blog/parallax-mapping-in-mz-basics-and-tips
4. RPG Maker Forums, `$`/`!` prefixes: https://forums.rpgmakerweb.com/threads/turn-tileset-piece-into-a-character-mz.174294/
5. Tiled, TMX Map Format: https://doc.mapeditor.org/en/stable/reference/tmx-map-format/
6. Tiled, Working with Layers (image layers, Repeat X/Y): https://doc.mapeditor.org/en/latest/manual/layers/
7. Tiled, Using Infinite Maps: https://doc.mapeditor.org/en/stable/manual/using-infinite-maps/
8. Tiled manual, Editing Tilesets (margin/spacing): https://github.com/bjorn/tiled/blob/master/docs/manual/editing-tilesets.rst
9. Tiled Scripting API, Tileset (margin, spacing, transparent colour): https://www.mapeditor.org/docs/scripting/classes/Tileset.html
10. SRPG Studio manual, Resource Format: https://srpgstudio.com/english/help/material.html
11. SRPG Studio manual (Map Layout / Resource Layout): https://srpgstudio.com/english/help/index.html and http://www.srpgstudio.com/lecture/largemap.html
12. Steam community, 16 px tiles in SRPG Studio (community, not official): https://steamcommunity.com/app/857320/discussions/0/778678997657595760/
13. SRPG Studio lecture, One-picture map (一枚絵マップの使用): http://srpgstudio.com/lecture/mapillust.html
14. Godot docs, Using TileSets: https://docs.godotengine.org/en/stable/tutorials/2d/using_tilesets.html
15. Godot docs, Multiple resolutions (stretch modes, integer scale mode): https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html
16. GDQuest, Pixel art setup in Godot 4: https://www.gdquest.com/library/pixel_art_setup_godot4/
17. Pixel-perfect settings in Godot 4: https://imrecsige.dev/snippets/pixel-perfect-settings-in-godot-4
18. MDN, Crisp pixel art look with image-rendering: https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look
19. "Canvas is finally usable on Safari" (iOS canvas limits): https://lionpuro.com/posts/canvas-is-finally-usable-on-safari/ (more device limits in ARCH §12.6)

## 8. Screenshots (390 × 844, DPR 2)
`ui-shell/mock-art/screenshots/` (64 files):
01-art-hub-pick-method · 01b-asset-list-pieces-under-parent · 01c-art-hub-four-methods · 02-map-size-picker · 02b-map-size-huge · 02c-map-size-over-texture-limit · 03-tileset-format-guide · 03b-tileset-ok · 03c-tileset-wrong-size-crop-pad · 03d-tileset-wrong-size-padded · 03e-tileset-16px-zoom-x2 · 04-tile-paint · 04b-tile-paint-stroke-and-fill · 04c-tile-paint-walk-rules-layer · 04d-edge-walls · 04e-wall-targeting-cue · 04f-wall-look-image · 04g-wall-look-invisible-editor-dashed · 04h-one-wall-own-look · 05-painted-image-exact · 05b-painted-image-mismatch-crop · 05b2-painted-image-crop-keep-top-left · 05c-painted-image-too-small-pad · 05d-painted-image-zoom-x2 · 05e-over-limit-auto-slice · 05f-over-limit-pc-8192-toggle · 05g-background-fit-cover-inactive · 05h-parallax-option · 05i-parallax-layers · 05j-parallax-over-soft-cap · 06-auto-slice-result · 06b-auto-slice-tileset-preview · 07-sprite-tall-unit-detected · 07b-sprite-grid-preview · 07c-sprite-frame-size-edit · 07d-sprite-wrong-size-no-alpha · 07e-sprite-wide-unit-coming-later · 07f-sprite-crop-frames-one-tile-wide · 08-big-map-pan-zoom-minimap · 08b-big-map-minimap-jump-3x · 08c-fractional-zoom-warning-advanced · 09-screen-fit-letterbox · 09b-screen-fit-crop · 09c-advanced-render-confirm · 09d-imported-blur-settings-inactive · 09e-advanced-on-pixel-perfect-off-warns · 10d-shape-units-team-colour · 10e-ship-as-picker · 10f-shape-bake-greyed-team-colour · 10g-shape-prop-fixed-fill-bakes · 11-library-tab-sprites · 11b-library-search-category · 11c-library-tilesets · 11d-library-licence-cc0-kenney · 11e-library-newer-version · 12-mix-and-match-map · 12b-asset-list-sources · 13-refix-original-kept · 14-decoded-meter-rated · 14b-credits-file · 15-map-objects · 16-paint-presets-versioned · 16d-migration-notice · 16f-style-warnings

Parked (CEO 2026-11-09, not re-captured; captured before D8, so they still show the old picker, placeholders and the v2 stand-in): `screenshots/parked/` (7 files): 10-paint-with-code-pick-terrain · 10b-code-tile-sliders · 10c-code-tiles-painted · 16b-update-available-badge · 16c-update-before-after · 16c2-update-side-by-side · 16e-pin-style-fix

## 9. Run and capture
```bash
cd /workspace/tileengine/ui-shell && python3 -m http.server 8765
# http://127.0.0.1:8765/mock-art/index.html#art-hub  (also #code-paint, #shape-units, #mix-map, #refix …)
python3 mock-art/scripts/make_test_images.py     # deterministic PIL test images
node mock-art/scripts/make_painter_previews.mjs  # real painter-proto previews (imports painter.js read-only)
.venv/bin/python mock-art/scripts/capture.py     # all screenshots
```

## 10. Parked (CEO 2026-11-09)
Kept so it can come back. Nothing here is in the mock's default screens or capture run. Shots in `ui-shell/mock-art/screenshots/parked/` are from the last run before D8.

**Style picker extras.** A **Classic v1** card (your colours, `te-classic@1`) and a row of four greyed **"More styles coming"** placeholders after the BTF cards.

**Classic style editor** (parked shots 10, 10b, 10c). 1. **Pick a terrain**: Grass, Water, Stone floor, Sand, Dirt, Wood floor, Snow, Lava, each a recipe drawn pixel by pixel at 32 × 32; **Walls** is a dashed card marked "edge tool" (walls go on tile edges). 2. **Live swatch**: one tile at 4× and a 3×3 repeat at 2× ("no seams"). 3. **Sliders and buttons**, one per stored field of the procedural origin (§6.2.2): terrain → `recipe`; Base / Accent colour → `palette {base, accent}`; Pattern Noise · Stripes · Bricks · Waves → `pattern.kind`; Pattern size Fine…Large → `pattern.scale` 1–4; Variation → `pattern.variation`; "New mix" → `seed`. 4. **Add tile** saves to "Your code tiles". (The mock keeps this code; `__artPresetsApi.internalClassic()` drives it only to build the capture's test tileset.)

**Update available** (parked shot 16b). When the installed painter has a newer version of a style, the card shows **"Update available · v2"** (computed from the installed styles, never stored) and the panel shows the notice with **Update this map…** and **Update whole project…** ("Optional. Nothing updates by itself; you see a before/after first.").

**Before/after** (`#preset-update`, parked shots 16c, 16c2). "Ashroad v1 → v2", scope **This map | Whole project**, compare **Slider | Side by side** (same spot, both versions, 1×), then Changes (how the style's tiles look) · Stays the same (your painting, walk rules, walls, objects) · Applies to · Stays on v1 · Baked sheets "Rebaked in scope" · Pin `btf-ashroad@1 → btf-ashroad@2` · Undo "One step puts it all back". **Keep current** ("Kept Ashroad v1. Nothing changed.") and **Update** ("Floor 2 now uses Ashroad v2 · one undo step"). Nothing is written until Update (`upgradePaintStyle`, one undo group). The mock's v2 was a labelled stand-in (same painter, another seed); it and its images are removed.

**Pin style** (parked shot 16e). Art hub → Code tile styles: a sheet with no `paintStyle` shows "No style pinned" and "This sheet has no style pinned, so it's drawn as Classic v1. Pin it so it can never change look by itself." with **Pin style** (writes `te-classic@1`, one undo step). Parked because migration 005 already pins every unpinned sheet at load (16d), and with no updates or Classic picker there is nothing more to pin.

**`styleVersionMismatch`.** "Ashroad v1: This project's copy of Ashroad v1 isn't the same as the one on this device. Your project's copy is used, so your maps look as saved." Nothing to fix. Comes back with style versions.

