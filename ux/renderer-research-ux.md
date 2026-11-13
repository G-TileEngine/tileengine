# Renderer research — the UX side (frame player feel, preview and tuning)

**Owner:** Editor & UX Designer · **Date:** 2026-11-13 (Europe/London) · **Status:** research only, no build.
**Order:** CEO 00:17 London — renderer research before the kit, results over usage. Scope A–D added by the CEO at 00:20.
**Pairs with:** the Engine Architect's `docs/research/renderer-research.md`. The EA owns the **contract**: data shapes, timing from the one engine clock, draw order, what the renderer reads and what it costs (EA §1–9). This file owns the **feel**: what makers see and do, defaults, previews, and how water, sway and moonlit look. Where the two meet, this file points to the EA section and does not overrule it.
> Note: when this file was written (00:22–00:30 London) the EA doc was not yet on the box, so the pointers below use the section list the EA sent (§1 integer scaling, §2 camera, §3 frame player, §4 glow, §5 Canvas2D vs WebGL, §6 layers and y-sort, §7 handoff format, §8 palette, §9 light and shadow). If a pointer and the EA text disagree, the EA text wins for the contract.

**House rules that shape every recommendation:** no node editor, no brand-new systems (improve Sprite Studio, the Effect Designer, the tile sheet and the Atmosphere layer by borrowing proven ideas), no runtime dependencies, works offline. Locked shell: thin top bar, bottom rail of 6 tools, sheets ≤ 40% of the height, grid ≥ 75%, 48 px+ targets, AA contrast, light/dark/follow device, the calm r62 look, no "Isberg Labs" code wall. Basic adds zero taps; Advanced holds the rest.

**How sources were checked:** every link below was opened on 2026-11-13 and read, and all 52 were status-checked at 00:27 London. Four sites block automated fetches (403): the two TIGSource pages, the Stardew Modding Wiki and Red Bull. Their quotes were read from the page text (Stardew) or the search index's copy of the page (TIGSource, Red Bull); the links are real and open in a normal browser. Numbers marked *(verified)* come from the linked page or source code. Anything I could not verify is marked *(not verified)*. I did not invent numbers.

---

## 0. The short version

1. **Crisp comes from four habits:** whole-number zoom, whole-pixel positions, nearest-neighbour scaling, and soft pixels living only on an overlay. Every "mushy" case below breaks one of the four.
2. **Few frames, held well, beats many frames.** The tools that feel best let a maker hold one frame longer (Aseprite per-frame ms, Godot relative duration, Pixelorama multiplier) and loop by ping-pong.
3. **Sync connected things, stagger separate things.** Water tiles that touch must share a clock or the seams show. Trees, bushes, torches and idle units should start at different points, or a forest moves like a machine.
4. **Moonlit is a palette swap plus an overlay, never a blur.** That is already how `btf-moonlit` + `atmosphere.js` work; keep it, and make the editor previews match it.
5. **One player.** The preview in Sprite Studio, the tile sheet and the Effect Designer must play through the same engine function as the game (Effects v2 §13.8), on the engine clock. Today Sprite Studio previews on its own `setInterval(160)` timer, which is a mismatch to fix.

---

## 1. Tile and sprite animation timing

### What well-known games and tools do
- **RPG Maker MZ autotile water** *(verified, source code)*: `Tilemap.update()` adds 1 per game frame and sets `animationFrame = Math.floor(animationCount / 30)`, so each step lasts 30 game frames (500 ms at 60 fps). A1 water picks its picture with `[0, 1, 2, 1][animationFrame % 4]`: **3 drawn frames played as a 4-step ping-pong**, a 2-second loop. Waterfalls use `animationFrame % 3`. **Every animated tile on the map shares one counter**, so all water moves in lockstep. Source: [RPG Maker MZ API, Tilemap.js](https://developer.rpgmakerweb.com/rpg-maker-mz/Tilemap.js.html). Makers who wanted other speeds wrote plugins, e.g. [autotile water speed](https://forums.rpgmakerweb.com/threads/autotile-water-speed-animation-adjustment.183752/) ("60 frames = 1 second", default 10).
- **Tiled** *(verified)*: the Tile Animation Editor gives each tile "a single linear looping animation", each new frame gets **100 ms by default**, you double-click a duration to change it, and a live preview sits in the corner; View > Show Tile Animations previews them on the map. [Tiled manual, Editing Tilesets](https://doc.mapeditor.org/en/stable/manual/editing-tilesets/).
- **Aseprite** *(verified)*: each frame has its own duration (Frame Properties, P), and you can set several at once. Tags hold an animation and play **Forward, Reverse or Ping-pong**. [Frame duration](https://www.aseprite.org/docs/frame-duration/) · [Tags](https://www.aseprite.org/docs/tags/).
- **Godot SpriteFrames** *(verified)*: an animation has a speed in fps and each frame a **relative** duration (default 1.0; 2.0 shows twice as long). Loop modes are none, linear and **ping-pong**, and in ping-pong the end frames play once, not twice. [SpriteFrames](https://docs.godotengine.org/en/stable/classes/class_spriteframes.html).
- **Pixelorama** *(verified via the project's own discussion)*: one project FPS plus a per-frame duration factor set from the frame's Properties dialog; a user asked for it to be editable straight in the timeline because the dialog is slow for fine-tuning. [Pixelorama discussion #1365](https://github.com/Orama-Interactive/Pixelorama/discussions/1365).
- **Unity AnimatedTile, via the LDtk importer** *(verified)*: tiles can take a **random start time or start frame from a range**, and a random speed range, "so every start will be different". [LDtkToUnity, Animated Tiles](https://cammin.github.io/LDtkToUnity/documentation/Topics/topic_AnimatedTiles.html).
- **Slynyrd (Raymond Schlitter)** *(verified)*: his animated waterfall scene uses a **6-frame loop** for the flow and the sparkly surface, with "simple linear movements", and a splash that must "loop in sync with the flow". [Pixelblog 10, Water in Motion](https://www.slynyrd.com/blog/2018/10/12/pixelblog-10-water-in-motion).

### Integer scaling and pixel snapping
- **Godot** *(verified)*: since 4.2 the stretch scale mode can be `integer`; at a 2.133× fractional scale "each pixel in the viewport corresponds to 2.133×2.133 pixels… uneven pixel scaling which results in incorrect appearance of pixel art". Integer mode rounds down and adds bars. [Multiple resolutions](https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html). Its AnimatedSprite2D docs also warn that a centred texture can sit between pixels and look deformed unless snapping is on. [AnimatedSprite2D](https://docs.godotengine.org/en/stable/classes/class_animatedsprite2d.html).
- **Unity Pixel Perfect Camera** *(verified)*: *Pixel Snapping* stops sub-pixel movement; *Upscale Render Texture* renders at the reference resolution so rotated pixels stay "unaliased and unrotated"; *Retro AA* (bilinear) reduces shimmer but "can make pixels look blurry". [Pixel Perfect Camera reference](https://docs.unity3d.com/Manual/urp/2d-pixelperfect-ref.html).
- **Browser canvas** *(verified)*: `image-rendering: pixelated` scales by nearest neighbour to the nearest whole multiple and then smooths the rest; `crisp-edges` keeps nearest neighbour all the way. [MDN image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering). Our painter already sets `imageSmoothingEnabled = false` before drawing the map.
- **Sea of Stars** *(verified)*: Sabotage and CDRIN spent research time on **image stability**: they wanted pixel-aligned rendering with smooth movement, which caused flicker in animations and movement, especially with multi-layer backgrounds and characters following each other. [CDRIN, Sea of Stars](https://www.cdrin.com/sea-of-stars-collaboration-innovante-sabotage/) (French).

### Crisp vs mushy
| Reads crisp | Turns mushy | Why |
|---|---|---|
| 2–8 frames, each 100–500 ms, with one held key frame | 12+ in-between frames at 1–2 px moves | in-betweens blur the silhouette; the eye reads it as smear |
| Whole-number zoom (1×, 2×, 3×) | 2.5× zoom, or a CSS-stretched canvas | some source pixels become 2 screen pixels and some 3 |
| Positions in whole art pixels | Tweening a unit by 0.37 px per frame | bilinear sampling or uneven rounding makes edges shimmer |
| Loops that close (frame 8 → frame 1 is one normal step) | Loops with a jump at the seam | the eye catches the hitch every cycle (`water@1` had this bug) |
| Separate props staggered | 40 bushes on the same frame | global sync looks mechanical |

### What it means for TileEngine
- **Keep `water@2`** (8 frames × 200 ms = 1.6 s). It is faster than RPG Maker's 2 s ping-pong; that suits our calmer, glossier water. Lava 160 ms and swamp 260 ms already give each liquid its own pace.
- **Connected tiles share one clock; separate objects get a start offset.** Water, lava and lane tiles that touch must stay in sync or seams show at tile edges. Trees, bushes, banners, torches and idle units get a per-copy start offset from the map seed (stable, like the LDtk/Unity random start, but seeded so the same map always looks the same). The painter already does this for idle units: `["idle0","idle1"][(frame + o.c) % 2]` staggers by column.
- Timing values snap to the engine clock (EA §3). The maker sees ms; the engine rounds to ticks and never starts early.

---

## 2. Water and shore foam

### Frame loops vs palette cycling
- **Mark Ferrari** *(verified)*: colour cycling works like theatre marquee bulbs — "each affected pixel on screen is holding completely still… but changing colors in a looping sequence", and neighbouring pixels in offset sequences read as moving bands. [Q&A with Mark J. Ferrari](https://www.effectgames.com/effect/article-Q_A_with_Mark_J_Ferrari.html). His GDC 2016 talk covers colour cycling and palette shifting "to create complex and realistic background animation effects without frame-animation": [GDC Vault](https://gdcvault.com/play/1023586/8-Bit-8-Bitish-Graphics) · [YouTube](https://www.youtube.com/watch?v=aMcJ1Jvtef0).
- **Living Worlds in HTML5** (Joe Huckaby) *(verified)*: the demo's controls are Time of day, Zoom (Native/Max), **Cycle speed ¼ ½ 1 2 4** and **Cycle mode Classic / Blend**. [Demo](https://www.effectgames.com/demos/worlds/). Huckaby's write-up: in Standard mode colours "shift positions in whole steps"; in BlendShift they "fade smoothly into each other". [Old School Color Cycling with HTML5](https://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html).
- **RPG Maker A1 water**: frame swap of 3 pictures in ping-pong, all in sync (see §1).

### Crisp vs mushy
- **Crisp:** whole-step cycling inside a locked ramp (Classic mode); a frame loop where highlights move 1 px per frame and the loop closes; foam drawn as 2–3 frames of hard pixels.
- **Mushy:** BlendShift-style cross-fades on small tiles (they make new in-between colours, so the ramp is no longer locked and a 32 px tile looks blurry); scrolling a water texture by fractions of a pixel; a blurred caustic overlay on top of the base pixels.
- *My judgement, not a source:* Blend mode suits big painted backdrops like Ferrari's; on 32–64 px game tiles at 2–3× it reads as soft. TileEngine should stay with whole steps.

### Foam edges (kept here on purpose; autotiles themselves are parked, see Later)
- RPG Maker draws the shore as part of the animated A1 autotile, so **foam moves in step with the water** (same counter). Tiled and LDtk have no built-in foam; it is a separate animated tile or decor. Pyxel Edit cannot animate tiles at all ([Pyxel Edit forum](https://pyxeledit.com/forum/thread/1050-can-you-make-a-tile-with-animation.html), *verified*).
- **For TileEngine:** foam is a 2–3 frame edge strip on the water side of a shore, **played on the same clock as the water** it borders (ping-pong is fine), and it is drawn in the water ramp's top steps, so the moonlit swap covers it for free. It should not get a phase offset.

### What it means for TileEngine
Both of today's methods stay, because they do different jobs: the frame loop moves shapes (gloss streaks), the shimmer moves light (steps 3–5 of the water ramp on the phase `t*4 + x*0.25 + y*0.5`). The shimmer is already Ferrari-style and already crisp (whole steps, no new colours). The UX change is only to expose it as the **Shimmer** option of the planned *Moves* toggle (animated-world.md), with a speed choice copied from Living Worlds: ½× / 1× / 2×.

---

## 3. Swaying trees and bushes

### What games and tools do
- **Taiji** (Matthew VanDevander) *(verified)*: rotating whole trees at the game's low fixed resolution produced "edges sliding across the image"; adding noise to hide it put "a lot of noise along edges"; distorting the whole leaf area looked "underwater". What worked: distortion only on the outside edges plus selected inner pixels, chosen by a hand-made **wind map**. [71. Trees in the Wind](https://taiji-game.com/2020/10/20/71-trees-in-the-wind/).
- **Godot Shaders, "Wind with pixel snapping"** *(verified)*: moves whole texture pixels (rounded offsets) instead of vertices, has a **cutoff row** below which nothing moves (the trunk stays put), and offsets the cycle by world x so nearby plants don't move in lockstep. [Shader page](https://godotshaders.com/shader/wind-with-pixel-snapping/).
- **Unity Pixel Perfect Camera**: rotating at full resolution makes smooth high-res diagonals that clash with the art; *Upscale Render Texture* keeps rotated pixels square (see §1).
- **Blasphemous** *(verified, interview)*: the team aimed to be "purist" — "trying not to use any fancy shaders… There is nothing that is not pixel art". [Hollywood Reporter](https://www.hollywoodreporter.com/movies/movie-news/blasphemous-designer-purist-approach-games-pixel-art-style-1238370/). So their motion is hand-animated frames.

### Crisp vs mushy
- **Crisp:** 2–4 hand frames; the canopy moves 1 px (at most 2) by whole pixels; trunk and roots never move; a short hold at each end of the sway; each tree starts at its own point.
- **Mushy:** rotating the sprite (sliding edges at low res, or mixed resolution at high res); sub-pixel shader offsets with filtering; sine motion every render frame (too smooth for the art's frame rate); every tree in sync.

### What it means for TileEngine
The planned **Sway** preset already says "whole steps only". Borrow two specific ideas: Taiji's **wind map** becomes a "What moves" brush in Sprite Studio Advanced (paint the pixels allowed to sway; default = the top half of the sprite, i.e. the cutoff row), and the Godot cutoff becomes the Basic default. No shader editor, no rotation. Sway is generated as real frames (2 or 4) at save time, so the game plays frames like any other sprite.

---

## 4. Night and moonlit glow

### What games do
- **Celeste** (Noel Berry) *(verified)*: each light's "spotlight" is drawn to a texture and walls cut their shadow shapes out of it; all light masks live on one big texture (2048×2048, up to 256 lights, 1 channel each). The game screen is **320×180**. [Remaking Celeste's Lighting](https://noelfb.com/posts/celeste_lighting/index.html). Light is its own layer over the pixel art.
- **Stardew Valley** *(verified, modding wiki)*: a map property `Light` sets "a circlet of light around the tile coordinates", and `NightTiles` swaps a lamp to its **"on" sprite after dark** (`DayTiles` keeps the "off" sprite by day). [Stardew Modding Wiki](https://stardewmodding.wiki.gg/wiki/Tutorial:_Making_a_New_Area). So: a sprite swap for the lamp itself plus a soft light on top. That is exactly our *Gives light* + emissive pattern.
- **Eastward** (Pixpil) *(verified)*: "retro-pixel + 3D lighting"; objects are made into "(very) simple meshes" with normal maps "for minor details"; lighting is "general deferred shading", letting designers place many lights and tune ambient tone. [TIGSource devlog, first post](https://forums.tigsource.com/index.php?topic=51383.0) · [reply #123](https://forums.tigsource.com/index.php?topic=51383.120) · [Red Bull interview](https://www.redbull.com/int-en/eastward-interview) (TIGSource and Red Bull quotes read from the search index's copy; the sites block automated fetches). Beautiful, but it is a 3D pipeline; TileEngine has no 3D, so we take the *mood tools* (ambient tone, many small lights), not the meshes.
- **Octopath Traveler (HD-2D), as a contrast** *(verified)*: Digital Foundry highlights its "high quality bokeh depth of field", which needs "3D logic running underneath". [Digital Foundry](https://www.digitalfoundry.net/articles/digitalfoundry-2018-octopath-traveler-a-hybrid-game-for-a-hybrid-console). Triangle Strategy's producers describe the HD-2D look as like "a diorama". [Nintendo Life on the 4Gamer interview](https://www.nintendolife.com/news/2022/05/triangle-strategy-producers-talk-hd-2d-and-why-other-devs-havent-used-it). Lovely in 3D; on flat pixel art, DoF and bloom over the sprites blur the pixels — the opposite of our rule.
- **Sea of Stars** *(verified)*: dynamic shadows and ambient occlusion on a pixel-aligned render, with heavy work on stability (CDRIN, above). Its player-controlled day/night is widely described, but I did not find a first-party technical source for *how* the day/night palette is done *(not verified)*.
- **Hyper Light Drifter**: the PlayStation Blog post by Alex Preston stresses "a striking and specific palette" per area ([PlayStation Blog](https://blog.playstation.com/archive/2014/03/14/closer-look-hyper-light-drifter-coming-soon-ps4-ps-vita)). I found no first-party source on its glow technique; community guesses (bloom, additive sprites) are *not verified* and not used here. GDC talk exists: [GDC Vault](https://www.gdcvault.com/play/1024062/-Hyper-Light-Drifter-Secrets) (business/design, not rendering).
- **RPG Maker MZ** *(verified)*: *Tint Screen* adds −255..255 to R, G, B plus a gray amount, with presets Normal, Dark, Sepia, Sunset, **Night**, over 1–999 frames (1 frame = 1/60 s); pictures and message windows are not tinted. *Flash Screen* shows a colour "for just an instant" and fades back. [RPG Maker help, Screen commands](https://rpgmakerofficial.com/product/MV_Help/page/01_10_10.html) (MV help page; MZ uses the same commands).

### Crisp vs mushy
- **Crisp:** night as a **palette swap** of the base art (every pixel still a ramp colour); darkness as a flat wash on an overlay with soft holes; glow added on the overlay; emissive ramps (flame, crystal) kept at full colour so lights read as sources.
- **Mushy:** blur or bloom applied to the base pixels; a multiply tint that turns every colour grey-blue and kills the ramps' contrast; a glow drawn at fractional size and scaled with smoothing *into* the map.

### What it means for TileEngine
Moonlit already follows the crisp column: the `btf-moonlit` paint style is a full set of night ramps (palette swap for terrain); sprites get `SPRITE_NIGHT`, derived once by integer maths from the day ramps, with `flame` and `crystal` kept as `EMISSIVE`; the overlay holds the navy wash (`rgba(3,8,26, 0.62×intensity)`), the `destination-out` light holes and the `lighter` glows. The one weak spot is the editors: **Sprite Studio's night preview uses a whole-image `multiply` with `#6a7cb4`**, which is a tint, not the swap the game uses. A maker tunes a sprite against the wrong night. Fix: the preview calls the same night derivation as the game (see §C).

---

## 5. Stage dim around a focus

### What tactics games do
- **Effects v2 target clip** (our own reference): floor and walls go dark navy while the caster, the dummy and the effect stay at full brightness (effects-v2-plan §2, beat 1).
- **Fire Emblem** *(verified)*: from Radiant Dawn and New Mystery of the Emblem onward, an impending critical hit is announced "with a bright flash and distinct noise"; crits have longer class animations. [Fire Emblem Wiki, Critical hit](https://fireemblemwiki.org/wiki/Critical_hit). That is a focus beat built from a flash plus a held pose — close to our Impact flash + hit-stop.
- **Into the Breach** *(verified)*: Justin Ma: "we would sacrifice cool ideas for the sake of clarity every time"; the team cut weapons that couldn't be shown clearly and added animated tooltips that *show* a weapon working. [Game Developer](https://www.gamedeveloper.com/design/-i-into-the-breach-i-dev-on-ui-design-sacrifice-cool-ideas-for-the-sake-of-clarity-every-time-) · [GDC Vault, Design Postmortem](https://gdcvault.com/play/1025772/-Into-the-Breach-Design). Lesson for dim: the board must stay readable — dim must never hide which tiles are affected.
- **Advance Wars**: fan sources say the screen darkens behind the CO Power animation; the Wars Wiki page I read does not describe the visuals, so this is *not verified*. [Wars Wiki, CO Power](https://warswiki.org/wiki/CO_Power).
- **Triangle Strategy**: HD-2D (3D scene); its focus tools are camera and DoF, which we don't have. Contrast only.

### Crisp vs mushy
- **Crisp:** one flat dim fill (or multiply) over terrain and props, units and the effect above it; dim eases in over 100–300 ms and out after; affected tiles keep an outline or marker above the dim.
- **Mushy:** a blurred vignette over the board; dimming that also darkens the units; dim plus moonlit darkness stacking into near-black so nothing reads.

### What it means for TileEngine
Already planned and ruled (Effects v2 §3.1, §13.1): *Dim the stage* toggle in Simple, *How dark* 0–85% (default 55%) with fade in/out in Advanced, draw order stage → dim → ground stamps → units → effect air → flash → HUD. The UX additions are in §D: a combined-darkness cap with moonlit, and keeping target markers above the dim.

---

## 6. Creator preview and tuning UI in tools — what translates to a phone

| Tool | What it gives the maker | Translate to touch? |
|---|---|---|
| Aseprite | per-frame ms, set several at once; tags with Forward/Reverse/Ping-pong; onion skin with prev/next counts and red/blue tint ([onion skin](https://www.aseprite.org/docs/onion-skinning/)) | **Yes:** ping-pong toggle; "hold ×2/×3" on a frame chip; onion skin as a single toggle (1 back, 1 ahead) in Advanced |
| Pyxel Edit | no tile animation (forum, above) | Lesson: animated tiles are a real gap people ask for |
| RPG Maker MZ | A1 water just moves; Tint Screen presets incl. Night; Flash Screen; durations in 1/60 s frames | **Yes:** presets first, sliders second. **No:** frames-of-1/60 units — we show ms |
| Tiled | one linear loop per tile, 100 ms default, drag frames in, double-tap a duration, live preview, map-wide preview toggle | **Yes:** live preview on the map, multi-select "apply duration" |
| Godot SpriteFrames / AnimatedSprite2D | fps + relative frame duration; linear/ping-pong/none; `speed_scale` | **Yes:** base speed slider + per-frame hold; a preview speed (½×/1×/2×) that does not change the saved value |
| LDtk | no built-in tile animation; importers add it by text data ([issue #1108](https://github.com/deepnight/ldtk/issues/1108)) | Lesson: keep animation in the asset, not as typed text |
| Pixelorama | project FPS + per-frame factor in a dialog; users want it inline | **Yes:** edit hold right on the frame strip, no dialog |
| Pixel Composer | preview panel with **tile view** (repeat horizontally/vertically/both), split view, onion skin, colour pick ([preview panel](https://docs.pixel-composer.com/interfaces/preview_panel.html)) | **Yes:** "Tile 3×3" view to check seams; split day/moonlit view. **No:** the node graph (CEO: no node editor) |
| Unity Light 2D | blend styles Multiply/Additive; overlapping lights add by default; "use only one or two different blend styles in a scene" ([Blend 2D lights](https://docs.unity3d.com/Manual/urp/2d-light-blend-modes.html)) | **Yes** as a rule we already follow: one darkness wash + one additive glow pass |
| Living Worlds demo | time of day, zoom native/max, cycle speed ¼–4, Classic/Blend | **Yes:** day/moonlit toggle, 1×/2×/3× crisp check, speed chips |

Desktop habits that do **not** translate: hover previews, right-click Properties dialogs, keyboard frame stepping (we use 48 px ‹ › buttons), tiny timeline cells (we use frame chips ≥ 48 px wide, scrolled sideways).

---

## A. Layers and z-order with y-sort (feel side; contract in EA §6)

### What tools do
- **RPG Maker MZ** *(verified)*: event Priority is *Below characters* (walk over it), *Same as characters* (blocks, NPCs, doors, chests) or *Above characters* (walk under it); tiles marked with a **star** draw above characters, and an *Above* event draws above star tiles ("a bird flying high above the trees"). Character sprites sit centred and bottom-aligned on their 48×48 tile. [MZ help, Map Event Settings](https://rpgmakerofficial.com/product/MZ_help-en/01_09_03.html) · [RPG Maker blog, Event Priorities](https://www.rpgmakerweb.com/blog/event-priorities-and-triggers).
- **Tiled** *(verified)*: object layers draw **Top Down** (sorted by y; default) or by manual/index order. [Scripting API, ObjectGroup](https://www.mapeditor.org/docs/scripting/classes/ObjectGroup.html). The UI label moved from "Manual" to "Index Order" and back ([PR #4157](https://github.com/mapeditor/tiled/pull/4157)).
- **Godot** *(verified)*: `y_sort_enabled` — "child CanvasItem nodes with a higher Y position are rendered in front"; a non-sorting child keeps its own children together at its Y. [CanvasItem](https://docs.godotengine.org/en/stable/classes/class_canvasitem.html).
- **LDtk** *(verified)*: layers stack in a fixed order; tile arrays come "in display order"; entities follow **placement order**, and a long-standing request asks for y-sort ([issue #334](https://github.com/deepnight/ldtk/issues/334), [layer instances](https://ldtk.io/docs/game-dev/json-overview/layer-instances/)).
- **Today in TileEngine** (`painter-proto/scene.js`): objects are sorted by **row, then column**, and each sprite is **bottom-aligned** to its tile (`oy = TOP + (r+1)*T − S.h`). Ground shadows are drawn before the sprite.

### Crisp vs mushy (here: readable vs confusing)
- **Readable:** feet decide order; a unit one row "behind" a tree is partly covered by the canopy; tall props never cover the unit standing *on* their tile.
- **Confusing:** a unit hidden entirely behind a big canopy in a tactics game (you lose a piece); order flipping mid-walk; a tall sprite sorted by its top edge.

### Layer stack makers should picture (names for the UI, order per EA §6 and Effects v2 §13.1)
1. **Ground** (terrain tiles, water, foam) → 2. **Ground marks** (baked shadows, rune circles, paths) → 3. **Stage dim** (only during an effect) → 4. **Standing things**, y-sorted together: units, trees, props, buildings → 5. **Effect air** (orbs, sparks) → 6. **Light** (moonlit wash, holes, glows; on the overlay) → 7. **Flash** → 8. **HUD**.
Open: whether the moonlit wash sits above units (as in the prototype, where units are inside the darkened scene) or below them. See questions.

### Creator UI
- **Basic (zero taps):** everything sorts by feet. Trees, buildings and units "just work". The foot line defaults to the sprite's bottom row.
- **Advanced:** in Sprite Studio, a **Foot line** handle (drag a 48 px handle up/down on the preview; for a sprite with a shadow skirt or floating crystal). On a placed prop: **Layer** chips *Ground / Standing / Above everything* (RPG Maker's Below / Same / Above, in plain words). **See-through canopy** toggle on tall props (default on): when a unit, the cursor or a target marker is behind the canopy, the canopy shows at reduced opacity on the overlay. *This last one is my proposal; I did not find a source that documents it in the games above.*
- Walking between rows: during a move the unit sorts by its current foot position, not its start or end tile (Godot model). Contract: EA §6.

---

## B. One handoff format from Sprite Studio and Effect Designer to the renderer (feel side; contract in EA §7)

### What tools hand off
- **Aseprite JSON** *(verified)*: `--sheet` + `--data` writes a sheet and JSON; frames carry a duration (the CLI lists a `{duration}` field for "the duration of the current frame"); `meta.frameTags` lists `{name, from, to}` per tag (tags also store direction: forward/reverse/ping-pong per the Tags doc); `meta.slices` carries bounds, 9-slice centre and an optional **pivot**, relative to the slice. [CLI](https://www.aseprite.org/docs/cli/) · [Slices](https://aseprite.org/docs/slices/) · [exporter source](https://github.com/aseprite/aseprite/blob/main/src/app/doc_exporter.cpp).
- **Godot SpriteFrames** *(verified)*: named animations, fps per animation, relative duration per frame, loop mode none/linear/ping-pong. No pivot in SpriteFrames itself; the node has `offset` and `centered`.
- **GIF previews** *(verified)*: GIF delays are in hundredths of a second ([GIF89a spec](https://www.w3.org/Graphics/GIF/spec-gif89a.txt)), so 200 ms and 160 ms export exactly; a 16.7 ms tick does not. Keep preview timings on 10 ms steps where possible.

### What we output today
- **Sprite Studio** (`ui-shell/js/sprite-studio.js`): walk styles of 2, 4 or 6 frames (`bob`, `four`, `six`) × 4 directions; *Walk left* is the mirror of *Side*; facing changes which parts show. Save says "PNG + frames"; there is **no per-frame ms, no tag names, no anchor field** — placement is bottom-aligned by the painter. The live preview runs on `setInterval(draw, 160)` (600 ms with reduced motion), i.e. its own clock.
- **Effect Designer** (`ux/effect-designer.md`): steps timed in **seconds**; uploaded strips **play their first frame only**; the **64-frame cap** per effect block (settled: engine refuses `fxTooManyFrames`, editor stops at 64). Effects v2 adds GIF preview with fps choices 6–30 and the 96 soft cap on export packs.

### Proposed handoff fields — each needs a CN (DSK), none final
| Field (working name) | Feel it gives | Basic default | Note |
|---|---|---|---|
| `frame_ms` per frame (or `base_ms` + `hold` ×1/×2/×3) | holds and uneven timing | all frames equal, from the speed slider | needs a CN (DSK) |
| `loop`: loop / ping-pong / once | breathing, sway, water with fewer frames | loop | needs a CN (DSK) |
| `tags` (idle, walk, attack, hit, sway) | one strip, several moves | from the walk style | needs a CN (DSK) |
| `anchor` (foot point, x,y in art px) | correct y-sort and shadows | bottom-centre | needs a CN (DSK) |
| `facing` set + `mirror_left` | fewer drawings | down/up/side, left = mirror | exists as editor behaviour; data shape needs a CN (DSK) |
| `phase`: sync / stagger | lockstep vs natural | sync for tiles, stagger for objects | needs a CN (DSK) |
| `light` (colour, radius, flicker/breathe) and emissive ramps | *Gives light* | off; on for torches/crystals in the library | needs a CN (DSK) |
| frame count | — | — | **64 cap per effect block is settled** |

### Making the editor preview match the game exactly
1. **One player** (Effects v2 §13.8): Sprite Studio, the tile sheet and the Effect Designer call the same pure engine function (asset + time → draw list) that the game uses, on the engine clock — retire Sprite Studio's own 160 ms timer.
2. **Same rounding:** the preview shows ms, but plays the tick-rounded value; the frame chip can show "200 ms (12 ticks)" in Advanced only.
3. **Same palette path:** the moonlit preview uses the game's night derivation, not a multiply tint (§C).
4. **Same zoom rule:** previews draw at whole-number zoom only (§Preview panel, crisp check).

---

## C. Palette and colour handling (feel side; contract in EA §8)

### What games and tools do
- **Locked ramps + cycling slots:** Ferrari's colour cycling depends on the palette order — a range of slots rotates while the pixels stay still (sources in §2). Living Worlds also switches whole palettes by **time of day** (demo control, verified).
- **Palette swap vs tint:** RPG Maker's *Tint Screen* is a whole-screen colour offset with a Night preset (verified, §4); it is quick but shifts every colour by the same amount. Stardew swaps lamp sprites at night (`NightTiles`) and adds light circles (verified, §4).
- **Colour limits:** Aseprite can convert to indexed colour and swap a palette from the command line (`--color-mode indexed`, `--palette`, verified in the CLI options).

### What TileEngine does today (`painter-proto`)
- Terrain: each paint style holds **locked ramps** per material (e.g. `btf-moonlit@2` water = 6 steps `#06101c … #7fc4d8`; bloom, grass, dirt, stone, rock likewise). Day (`btf-ashroad`) and night (`btf-moonlit`) are two full ramp sets — a **palette swap**.
- Sprites: 5-step ramps (`SPRITE_DAY`: skin, hair, steel, cloak, … teamA, teamB, crystal, flame). Night is `moon(rgb) = (0.5r+6, 0.56g+10, 0.72b+22)`, computed once and frozen; `flame` and `crystal` are **emissive** and keep their day colours; team colours stay readable.
- Shimmer uses only steps 3–5 of the water ramp (cycling slots); no new colours.
- Shadows under units are baked by stepping each ground pixel **2 steps down its own ramp** (`darken(…, 2)`), so shadows never leave the palette.

### Crisp vs mushy
- **Crisp:** every base pixel is a ramp colour in both looks; glow and darkness live on the overlay; cycling moves whole steps.
- **Mushy:** a multiply tint over the art (greys the ramps and kills hue contrast); glow baked into base pixels; blend-cycling that invents in-between colours.

### Creator UI
- **Basic (zero taps):** Moonlit is a look switch on the map (already exists as a paint style). Sprites made in Sprite Studio get their night ramps automatically; light-source parts (flame, crystal) stay bright.
- **Advanced (Sprite Studio palette sheet):** per ramp, a **"Glows at night"** toggle (adds it to the emissive set; default on for flame and crystal); a **Night look** strip that shows each ramp's day and moonlit colours side by side, with a "Nudge" slider (−/+ one step lighter) if a sprite gets lost at night; a **Shimmer colours** picker on water-like tiles (choose which steps cycle, default steps 3–5). A colour counter stays in the save line (it already shows "N colours").
- Keep moonlit as **swap + overlay**. Do not add a tint mode. Fix the Sprite Studio night preview to use the moon derivation.

---

## D. The 2D light and shadow model (feel side; contract in EA §9)

### What games and tools do
- **Overlay with holes:** Celeste draws each light then cuts wall shadows out (verified, §4). Our Atmosphere does the same idea without walls: a navy wash with `destination-out` radial holes, then `lighter` colour glows.
- **Emissive pixels:** Stardew's lit-lamp sprite swap; our `EMISSIVE` ramps.
- **Blend discipline:** Unity's docs advise using "only one or two different blend styles in a scene" for cost (verified, §6).
- **Drop vs baked shadows:** RPG Maker characters have no shadow of their own by default (*not verified as a rule; I did not find a doc that says so*). Our painter bakes a 19×5 ellipse ground shadow by ramp step-down under units and most objectives. Eastward's real cast shadows need 3D meshes (verified) — out of scope.
- **Flash and freeze:** RPG Maker *Flash Screen* (verified); Fire Emblem's crit flash (verified); Effects v2 §16 Impact flash and §17.4 hit-stop (Sakurai: attacker and victim freeze for the same time).

### How the pieces fit (feel)
| Piece | Lives on | Moves how | Maker control |
|---|---|---|---|
| Base art (day or moonlit ramps) | crisp map | frames / shimmer only | look switch |
| Baked ground shadow | crisp map, ramp step-down | follows the unit's foot | Advanced: Shadow size S/M/L/off |
| Emissive ramps | crisp map | never darkened | "Glows at night" |
| Darkness wash + light holes | overlay | holes follow lights; torches flicker ~7–9 Hz, crystals breathe ~1.5–2 Hz (prototype values) | *Gives light*: colour, radius, Flicker/Breathe |
| Additive glow | overlay | same as holes | Advanced: Glow strength |
| Stage dim | between stage and units | eases in/out | Effects v2 §3.1 |
| Flash | overlay above effects | one soft flash by default | Effects v2 §16, Reduce flashes |

### Tie-ins
- **Gives light** (animated-world.md) writes the same light entry the prototype reads (`x, y, kind, r`), and lists the prop's emissive ramps. Library torches, lanterns and crystals come with it on, so Basic adds zero taps.
- **Stage dim + moonlit:** both darken. Proposal: cap the **combined** darkness so terrain never drops below the moonlit ramp's step 1 equivalent (exact cap for the EA to set), and let *Gives light* holes stay open through the dim at reduced size, so the room still has its torches. Effects v2 §13.1 currently says wall torches dim — I suggest the *torch sprite* dims but its glow hole survives at ~50%. Needs EA/CEO call.
- **Impact flash:** stays on the flash overlay, never on base pixels. Reduce flashes rules unchanged (§6, §13.5).
- **Hit-stop:** freezes the playing effect and the two units for the same time (§17.4). Proposal for feel: **ambient light keeps running** (torches keep flickering, water keeps moving), so the freeze reads as the hit, not as a lag spike. Reduced motion skips the freeze (already ruled).

### Crisp vs mushy
- **Crisp:** soft gradients only on the overlay; base pixels untouched; shadows inside the ramp.
- **Mushy:** glow drawn into the map; shadows as semi-transparent black over the art (greys the ramp); too many blend modes stacked.

---

## 7. Recommendations for TileEngine

### Default timings (Basic, zero taps)
| Thing | Default | Range in Advanced | Basis |
|---|---|---|---|
| Water (`water@2`) | 8 frames × 200 ms, sync | 100–400 ms | current recipe; RPG Maker uses 500 ms × 4-step ping-pong |
| Lava / swamp | 160 ms / 260 ms, sync | 100–400 ms | current recipes |
| Shore foam | 2–3 frames, ping-pong, **water's clock** | follows water | RPG Maker A1 behaviour |
| Water shimmer | 1×, steps 3–5 | ½× / 1× / 2× | atmosphere.js; Living Worlds speed chips |
| Tree / bush sway | 2 frames (bush) or 4 frames (tree), 1 px, ~300 ms, hold on the ends, **stagger** | 1–2 px, 200–500 ms | Taiji, Godot cutoff; ms values are my starting guess, to be tuned by eye *(not from a source)* |
| Torch flicker | overlay noise ~7–9 Hz, stagger | Flicker / Breathe | prototype |
| Crystal breathe | ~1.5–2 Hz, stagger | | prototype |
| Idle units | 2 frames, staggered by column | — | prototype `(frame + o.c) % 2` |
| Walk | 4-frame style, 160 ms per frame | 100–300 ms | current Sprite Studio preview |

### Sliders and toggles
- **Basic (no new taps):** library tiles and props arrive animated, lit and staggered. The moonlit look and the preview's day/moonlit chip are the only switches a beginner meets.
- **Advanced, tile sheet:** *Moves* (Frames / Shimmer), Speed (ms), Loop/Ping-pong, Hold ×1/×2/×3 per frame, *Same time / Staggered*.
- **Advanced, Sprite Studio:** the same frame controls, plus Foot line, What moves (sway brush), Glows at night per ramp, Night nudge, Shadow size.
- **Advanced, objects:** *Sway / Flow*, *Gives light*, Layer (Ground / Standing / Above), See-through canopy.
- **Effect Designer:** unchanged from Effects v2; its preview gains the same panel below.

### Mobile preview panel (one design shared by the tile sheet, Sprite Studio and the Effect Designer)
Sits in the existing sheet (≤ 40% height) — for the Effect Designer, inside the accepted compact top strip (Effects v2 §3.7), not a new canvas. All targets ≥ 48 px, AA contrast in light and dark.
```
┌─────────────────────────────────────────────┐
│  [ preview at 2× — 3×3 tiles of the asset ] │
│                                             │
├─────────────────────────────────────────────┤
│ ▶/❚❚   ‹  ━━━━━━●━━━━━━━  ›    0.80/1.60 s   │  play/pause · step · scrub · clock
│ ½× 1× 2×  │ ☀ Day  ☾ Moonlit │ ⇆ Staggered  │  speed · look · phase offset
│ Crisp 1× 2× 3×  │ ⊞ Tile 3×3 │ ◐ Onion (Adv) │  crisp check · seams · onion skin
└─────────────────────────────────────────────┘
```
- **Play/Pause, ‹ › step, scrub, clock.** Scrub snaps to frames. Speed ½×/1×/2× changes the preview only, never the saved value.
- **Day / Moonlit:** draws through the real night path (palette swap + overlay); emissive parts glow. Optional split view (left day, right moonlit) in Advanced, from Pixel Composer's split preview.
- **Phase offset (Same time / Staggered):** shows 3×3 copies so the maker sees lockstep vs natural; tiles default to Same time, objects to Staggered.
- **Crisp check 1× / 2× / 3×:** whole-number zoom only. If the device would show the game at a fractional scale, a quiet line says so ("Your screen shows this at 2.6×; the game uses 2× with a border"). No warning wall.
- **Tile 3×3:** repeats the tile to show seams and loop closure (Pixel Composer tile view; our "loop closes" check from animated-world.md sits here as a ✓/✕ badge).
- **Onion skin (Advanced):** 1 frame back, 1 ahead, tinted (Aseprite's red/blue idea).
- **Reduced motion:** the panel shows frame 0 and keeps scrub and step working (so makers can still check frames), no autoplay; flashes follow Reduce flashes.

### Three maker walk-throughs (to test the design against)
**1. "My river should flow and foam" (Basic, zero new taps)**
1. Paint water with the stock Water tile. It already moves (8 × 200 ms) and shimmers at night.
2. Paint the shore. Foam appears on the water side of the edge and moves with the water.
3. Tap the map's look chip ☾ to check moonlit. Done.

**Advanced variant:** open the tile sheet → Water → *Moves*. Speed 200 → 260 ms for a lazy river; *Shimmer* ½×. The preview strip shows Tile 3×3 with the "loop closes ✓" badge. Saving changes every water tile on the map (they share one clock).

**2. "A bush that rustles" (Sprite Studio)**
1. Draw the bush (or pick one from the library, which already sways).
2. Advanced → *Sway*: Amount 1 px, Speed ~300 ms. Only the top half moves by default (the cutoff row is shown as a dashed line on the preview).
3. Optional: *What moves* brush to paint just the leaf tips (Taiji's wind map, in one brush).
4. Preview: switch *Same time* ↔ *Staggered* to see 9 copies move together or naturally. Staggered is the saved default for objects.
5. Save. Sway is stored as 2 or 4 real frames (counts toward any frame cap like other frames).

**3. "A torch that lights the room at night"**
1. Place the library torch. It already has *Gives light* (warm, radius 3 tiles, Flicker) and its flame ramp glows at night.
2. Switch to moonlit. The navy wash darkens the room; a soft hole opens around the torch; the flame pixels stay bright.
3. Advanced: colour chips (warm, torch, teal, gold — the prototype's four), radius slider in tiles, Flicker / Breathe.
4. Cast an ability with *Dim the stage*: the room dims further, units and the effect stay lit, and (if the EA agrees, Q3) the torch keeps a smaller glow.

### Mush checklist for QA (one line per check, run at 1×, 2×, 3× on a real phone)
- [ ] No source pixel shows as two different widths (zoom is whole-number).
- [ ] Moving units land on whole art pixels each frame (no shimmer on edges).
- [ ] No base pixel outside the active ramps (sample with a colour picker; glow is overlay-only).
- [ ] Water, lava and foam tiles show no seam at tile edges, day or moonlit.
- [ ] Loops close: last frame → first frame looks like any other step.
- [ ] Trees and bushes are visibly out of step with each other; water tiles are in step.
- [ ] No rotation on any pixel sprite except quarter turns (orbit rings use the integer ellipse helper).
- [ ] Moonlit: flame and crystal pixels unchanged from day; team colours still tell sides apart.
- [ ] Stage dim on a moonlit map: every unit and target marker still readable.
- [ ] Editor preview and the exported game show the same frame at the same time (one player).
- [ ] Reduced motion: frame 0 still, scrub works, no autoplay, Reduce flashes on.

---

## 8. Open questions

### For the Engine Architect
1. **Moonlit wash vs units:** in the prototype the night wash covers the whole scene, units included. Should units sit under the wash (night-tinted by palette, then washed) or above it (palette only)? And where does the wash sit relative to effect air and stage dim in §6's order?
2. **Combined darkness cap** when stage dim runs on a moonlit map: what is the floor, and is it a clamp on dim amount or on the final colour?
3. **Light holes during stage dim:** may *Gives light* holes survive the dim at reduced size (suggested ~50%), given §13.1 says wall torches dim?
4. **Hit-stop and the ambient clock:** can torches, water and sway keep running while the effect and two units freeze, given the one engine clock? (Suggest a separate "world ambient" time that hit-stop does not pause.)
5. **Phase offset data:** seeded per-copy start offset from the map seed — fine as an engine-derived value, or does it need a stored field (needs a CN (DSK))?
6. **Tick rounding shown to makers:** should the editor show "200 ms (12 ticks)" in Advanced, and which tick rate is canonical for previews and GIF export (GIF is in 10 ms units)?
7. **Foot line / anchor:** is bottom-centre the default the renderer will assume when the field is absent, matching today's bottom-aligned placement in scene.js?
8. **Sway as baked frames vs live offset:** I recommend baking 2–4 frames at save time (no shader). Does that fit the frame budget and the 64-frame cap if a prop has sway plus other tags?
9. **One player for sprites and tiles:** can Sprite Studio and the tile sheet call the same draw-list function as Effects v2 §13.8, replacing Sprite Studio's 160 ms timer?
10. **See-through canopy:** is a per-prop overlay fade on occluding canopies cheap enough on a mid-range phone, or should it be an outline instead?

### For the CEO
1. Keep moonlit as **palette swap + overlay** only (no tint mode)? Recommended yes.
2. Torches during an ability: keep a little of their glow through the stage dim (cosier, clearer room), or go fully dark like the reference clip?
3. Default sway: subtle (1 px, bushes 2 frames) everywhere, or only on trees?
4. Is "See-through canopy" on by default, or do you prefer units simply drawn in front of tall props in battles?

---

## Later (parked, one line each)
- **Atlas packing:** pack sprite and tile frames into shared sheets for speed (Aseprite `--sheet-pack` is the reference); after the handoff format settles.
- **Map-editor decor and glow props:** edge decor, scatter along edge, lamp posts with *Gives light*; when the map editor is scheduled.
- **Autotiles:** RPG Maker-style A1/A2 autotiles and terrain sets; with the map editor. (Foam stays in §2.)

---

## Sources (all opened 2026-11-13)
- RPG Maker MZ [Tilemap.js](https://developer.rpgmakerweb.com/rpg-maker-mz/Tilemap.js.html)
- [water speed plugin thread](https://forums.rpgmakerweb.com/threads/autotile-water-speed-animation-adjustment.183752/)
- [Screen commands](https://rpgmakerofficial.com/product/MV_Help/page/01_10_10.html)
- [Map Event Settings](https://rpgmakerofficial.com/product/MZ_help-en/01_09_03.html)
- [Event priorities blog](https://www.rpgmakerweb.com/blog/event-priorities-and-triggers)
- Tiled [Editing Tilesets](https://doc.mapeditor.org/en/stable/manual/editing-tilesets/)
- [ObjectGroup API](https://www.mapeditor.org/docs/scripting/classes/ObjectGroup.html)
- Aseprite [Frame duration](https://www.aseprite.org/docs/frame-duration/)
- [Tags](https://www.aseprite.org/docs/tags/)
- [Onion skinning](https://www.aseprite.org/docs/onion-skinning/)
- [CLI](https://www.aseprite.org/docs/cli/)
- [Slices](https://aseprite.org/docs/slices/)
- Godot [SpriteFrames](https://docs.godotengine.org/en/stable/classes/class_spriteframes.html)
- [AnimatedSprite2D](https://docs.godotengine.org/en/stable/classes/class_animatedsprite2d.html)
- [CanvasItem](https://docs.godotengine.org/en/stable/classes/class_canvasitem.html)
- [Multiple resolutions](https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html)
- LDtk [issue #1108](https://github.com/deepnight/ldtk/issues/1108)
- [issue #334](https://github.com/deepnight/ldtk/issues/334)
- [LDtkToUnity animated tiles](https://cammin.github.io/LDtkToUnity/documentation/Topics/topic_AnimatedTiles.html)
- [Pixelorama #1365](https://github.com/Orama-Interactive/Pixelorama/discussions/1365)
- [Pixel Composer preview panel](https://docs.pixel-composer.com/interfaces/preview_panel.html)
- [Pyxel Edit forum](https://pyxeledit.com/forum/thread/1050-can-you-make-a-tile-with-animation.html)
- Unity [Pixel Perfect Camera](https://docs.unity3d.com/Manual/urp/2d-pixelperfect-ref.html)
- [Blend 2D lights](https://docs.unity3d.com/Manual/urp/2d-light-blend-modes.html)
- [MDN image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering)
- [GIF89a spec](https://www.w3.org/Graphics/GIF/spec-gif89a.txt)
- Mark Ferrari [GDC Vault](https://gdcvault.com/play/1023586/8-Bit-8-Bitish-Graphics)
- [YouTube](https://www.youtube.com/watch?v=aMcJ1Jvtef0)
- [Q&A](https://www.effectgames.com/effect/article-Q_A_with_Mark_J_Ferrari.html)
- [Living Worlds demo](https://www.effectgames.com/demos/worlds/)
- [Color cycling article](https://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html)
- [Slynyrd Pixelblog 10](https://www.slynyrd.com/blog/2018/10/12/pixelblog-10-water-in-motion)
- [Taiji, Trees in the Wind](https://taiji-game.com/2020/10/20/71-trees-in-the-wind/)
- [Godot Shaders wind](https://godotshaders.com/shader/wind-with-pixel-snapping/)
- [Noel Berry, Celeste lighting](https://noelfb.com/posts/celeste_lighting/index.html)
- [Stardew Modding Wiki](https://stardewmodding.wiki.gg/wiki/Tutorial:_Making_a_New_Area)
- Eastward [TIGSource](https://forums.tigsource.com/index.php?topic=51383.0)
- [TIGSource p.7](https://forums.tigsource.com/index.php?topic=51383.120)
- [Red Bull](https://www.redbull.com/int-en/eastward-interview)
- [Digital Foundry, Octopath](https://www.digitalfoundry.net/articles/digitalfoundry-2018-octopath-traveler-a-hybrid-game-for-a-hybrid-console)
- [Nintendo Life, Triangle Strategy](https://www.nintendolife.com/news/2022/05/triangle-strategy-producers-talk-hd-2d-and-why-other-devs-havent-used-it)
- [CDRIN, Sea of Stars](https://www.cdrin.com/sea-of-stars-collaboration-innovante-sabotage/)
- [PlayStation Blog, HLD](https://blog.playstation.com/archive/2014/03/14/closer-look-hyper-light-drifter-coming-soon-ps4-ps-vita)
- [GDC Vault, HLD](https://www.gdcvault.com/play/1024062/-Hyper-Light-Drifter-Secrets)
- [Hollywood Reporter, Blasphemous](https://www.hollywoodreporter.com/movies/movie-news/blasphemous-designer-purist-approach-games-pixel-art-style-1238370/)
- [Fire Emblem Wiki, Critical hit](https://fireemblemwiki.org/wiki/Critical_hit)
- [Game Developer, Into the Breach](https://www.gamedeveloper.com/design/-i-into-the-breach-i-dev-on-ui-design-sacrifice-cool-ideas-for-the-sake-of-clarity-every-time-)
- [GDC Vault, Into the Breach](https://gdcvault.com/play/1025772/-Into-the-Breach-Design)
- [Wars Wiki, CO Power](https://warswiki.org/wiki/CO_Power)
- [Tiled PR #4157](https://github.com/mapeditor/tiled/pull/4157)
- [LDtk layer instances](https://ldtk.io/docs/game-dev/json-overview/layer-instances/)
- [Aseprite exporter source](https://github.com/aseprite/aseprite/blob/main/src/app/doc_exporter.cpp)
