# Renderer research: the engine contract (EA)

**Owner:** Engine Architect · **Date:** 2026-11-13 (Europe/London) · **Status:** research only. There is no kit, no prototype and no format change in this pass (CEO order 00:17, scope add 00:20).
**Pairs with:**
- **UX section:** [`ux/renderer-research-ux.md`](../../ux/renderer-research-ux.md) (EUX, 422 lines, sha256 `1ebd6546`). It owns the **feel**: what makers see, defaults, previews, and how water, sway and moonlit look. Its A–D parts map to our §6–9 and are merged below with credit. Its header says this doc wins on the contract.
- **Testing section:** [`docs/qa/renderer-test-research.md`](../qa/renderer-test-research.md) (QA, 261 lines; probes in `/workspace/qa-runs/renderer-probe/`). Summarised in §10. QA's tags are kept on every number taken from it: **[S]** sourced, **[D]** existing TileEngine decision, **[M]** measured by QA, **[E]** estimate.
- **This doc owns the contract:** data shapes, clock timing, draw order, what the renderer reads, and what it costs.

**Existing decisions this builds on (they are not reopened here):** ARCHITECTURE-v0 §12.1–12.11 (layer stack, camera, 16×16 chunks at 1×, Canvas2D behind a `Renderer` interface, the integer path as the locked default, a 4096 px limit); BUILD_GUIDE laws (one clock in integer ms, no wall time in the core, rAF only in `src/runtime/host/raf-driver.ts`, no game rules in the core); Effects v2 §13 (dim, `lighter`, a pool of 96 particles, one player) and §18 (renderer roadmap, water mix, sway, glow layer, node mode later); project-format §6.2/§6.3 (AssetMeta `clips[]`, `anchor`, `tileProps.anim`, `noMirror`, well-known clip names); `ux/design-notes/animated-world.md` (moonlit, Atmosphere, Gives light, Sway/Flow); `/tmp/anim-tiles-audit.md` (a lost /tmp file; its findings are restated in §3 and §8).

---

## CEO summary (plain words)

**What we are choosing:** how the game draws its picture on phones so the pixel art stays sharp, scrolls smoothly, animates water and trees, and glows at night without draining the battery.

**Options we looked at:**
1. **Simple drawing (Canvas2D) now, faster drawing (WebGL) later, both behind one plug.** This is proven by Phaser, which ships both. Our turn-based maps need only a few hundred draws a frame.
2. **WebGL first.** It is the fastest for thousands of sprites, but phones can drop its memory when the app goes to the background, so it is more work and more risk for no visible gain today.
3. **A fixed small screen scaled up** (PICO-8 style) vs **show more of the map on bigger phones.** The fixed screen gives black bars on many phones. Showing more map always fills the screen with sharp pixels.

**Recommendation:** go with option 1. Every pixel is a whole number of screen pixels, and bigger phones simply see more tiles. The camera glides smoothly but always lands on whole pixels. Animations run off the one game clock, so water stays in step and trees sway out of step without any stored randomness. Glow and night are drawn as a separate see-through layer with pre-made glow shapes, never blurred into the art, and the game stops redrawing when nothing moves to save battery. WebGL waits until a project really needs thousands of moving sprites.

**Four questions for you (at the end, §12):** glow look (stepped or soft), whether torches keep some light during an ability's dim, the default sway, and whether tree canopies go see-through by default.

---

## 1. Whole-number pixel scaling on any phone

**What proven engines do:**
- **Godot** stretch mode `viewport` + scale mode `integer` renders at a base size and scales by whole numbers. Aspect `expand` shows more world on wider screens instead of adding bars. Its docs recommend `expand` with a base size for games that must fit many aspect ratios. [Godot: Multiple resolutions]
- **PICO-8** is a fixed 128×128 picture, scaled by a whole number with borders. It is simple, but it letterboxes on every phone shape. [PICO-8 manual]
- **Phaser** uses `pixelArt: true` (NEAREST sampling and `roundPixels: true`) together with the Scale Manager `FIT` or zoom. FIT on its own allows fractional scales. [Phaser config; Phaser round-pixels example]
- **Pixel-perfect scaling articles** say the same thing: only whole-number scales keep every art pixel the same size. A fractional scale makes some pixels one screen pixel wider than others (5/6 runs). [Moonflower "smooth camera"; web.dev devicePixelContentBox]

**QA's measured finding (we honour it):** a canvas whose backing store is sized in CSS pixels, with `image-rendering: pixelated`, shows art-pixel runs of **5/6** device px at DPR 2.625 and **6/5** at DPR 2.75 **[M]**. **The backing store must therefore be sized in device pixels, and the art scale `s` must be a whole number of device pixels.** Setting `canvas.width` also resets `imageSmoothingEnabled` to true **[M]** (the HTML spec agrees **[S]**), so the renderer sets it again after every resize. ARCH §12.5 already says this; it is now a tested rule (§10).

**Contract (pure, Node-tested):**
- `deviceSize(css, dpr, exact?)` → backing `{w, h}`. Use `ResizeObserver` `devicePixelContentBoxSize` where it exists (Chromium). Otherwise use `round(css × dpr)`. WebKit has no `devicePixelContentBox` **[S]**, but iPhones use DPR 2 or 3. The CSS size is then set to `backing / dpr`.
- `fitView(device, s)` → `{artW: floor(devW / s), artH: floor(devH / s), padX, padY}`. **Variable view size** is the default: a bigger phone shows more tiles at the same `s`, and the leftover is < `s` device px per axis. That leftover is the letterbox, in `letterboxColour`.
- **The odd letterbox pixel goes bottom/right, from a floor offset** (decision R5-3): `padX = floor(remX / 2)`, so the extra pixel lands on the right/bottom. This matches the wall rule in ARCH §12.8.
- `sMin` stays as in ARCH §12.2: the largest integer at which the map still fills at least one axis, floored at 1. `sMax` is 6. Pinch snaps to steps.
- `settings.screenFit: crop` (an existing option) is overscan: no bars, centred crop. It never stretches.

**Notches, safe areas, rotation:**
- The world may draw under the notch, because decor is fine there. The **board rect** (playable grid) and the HUD stay inside `env(safe-area-inset-*)`. The host passes the safe rect as plain numbers, and the camera clamp uses it for "keep the board visible".
- **Rotation and DPR change:** `ResizeObserver` (and a `matchMedia("(resolution: …dppx)")` change) leads to a new backing size, a new `s`, the smoothing flag set again, the camera clamp applied again, and the **same focus cell kept**. No frame may be drawn at the old size (QA R3.5).
- **Phone example** (390×844 CSS at DPR 3 = 1170×2532 device): `s = 3` gives a 390×844 art-px view, which is 6.1×13.2 tiles at 64 px. `s = 2` gives 585×1266 art px. Both are crisp; the zoom choice is the maker's.

## 2. Pixel-snapped camera, smooth follow, no shimmer

**What proven engines do:**
- **Snap everything to the art grid** (Godot `snap_2d_transforms_to_pixel`, Phaser `roundPixels`). This is crisp, but a slow or eased camera moves in visible 1-art-px jumps at `s ≥ 2`. [Godot; Phaser]
- **Celeste:** the game renders at 320×180. Vanilla snaps the camera. The Motion Smoothing mod draws the low-res buffer at a **fractional offset during upscaling**, which gives a smooth camera with crisp sprites. It warns that backgrounds jitter unless they are offset in compositing ("Fancy" mode). [celeste-motion-smoothing]
- **Godot SubViewport trick:** render 1 art px larger than the view, then offset the container by the fractional camera remainder. [Moonflower]

**Our situation is easier.** We draw straight into a device-px canvas at integer `s`, so a sub-art-pixel camera step is just a whole number of device px. That is Celeste's smooth camera for free, with no extra buffer.

**Contract:**
- `snapCamera(x, y, s)` → `devX = round(x × s)`, `devY = round(y × s)` (ARCH §12.5). Every draw is `round(worldArtPx) × s − devCam`. Parallax uses `round(cameraOffset × depth)` in whole art px (ARCH §12.1).
- **No jitter between sprites and tiles:** world positions are rounded to **whole art px first**, and only then multiplied by `s` and shifted by the snapped camera. Tiles and sprites therefore always sit on the same art grid relative to each other, with no "mixels". The camera alone moves in device-px steps.
- **Follow without wobble:** when the camera follows a unit, its target is that unit's **rounded** art position, so the unit stays still on screen while the world scrolls.
- **Easing:** the 120 ms smoothstep (ARCH §12.2) runs on clock ms. Every eased frame still uses an integer `devX`; QA asserts this mid-ease **[D]**.
- **Units moving between cells** step by whole art px. A 64 px move over 300 ms is about 0.2 art px per 1 ms tick, so it looks smooth.

## 3. Frame player for tile and sprite anims

**What proven engines and tools do:** Aseprite gives per-frame `duration` in ms and tags with a direction. Godot `SpriteFrames` has fps plus a relative duration per frame. Godot tiles default to **synchronised** animation, with `TILE_ANIMATION_MODE_RANDOM_START_TIMES` to stagger them. Two lessons from Godot's bug history: the offset must be **stable per cell** and not re-rolled on redraw (PR #77257 review), and it must be **scaled to the full loop length**, not to 0–1 s (PR #86210). [Aseprite CLI; Godot TileSetAtlasSource; Godot PRs]

**Contract (one engine clock, no wall time):**
- `frameAt(clip, tMs)` is a pure function. It works out each frame's ms (from `ms[]`, or `1000 / fps` rounded to `stepMs`), takes the loop total `T`, then `t = loop ? tMs mod T : min(tMs, T − 1)` and walks the prefix sums. A plan is cached per draw-list call only. There is no module-level cache (from the draft prototype).
- **`tMs` is `clockMs` from the engine clock** (`TickInfo.simMs`). The renderer only reads it. The host maps the rAF timestamp to ticks (decision R5-5). Debug timing goes through the host and `DebugPort`, never into the core.
- **Shared tiles in step:** every cell of the same `tileProps.anim` clip uses the same `tMs`, so water seams line up. This is the default for tiles.
- **Per-instance offsets (sway, torches, idle units):** `tMs + offsetMs` with `offsetMs = hash32(mapSeed, assetId, c, r) mod T` (`instanceOffset`; the word `phase` is reserved by `check:state`). It is **derived, not stored** (EUX Q5; parent leaning; Godot lessons). A stored field exists only if a maker overrides it, and that override **needs a CN (DSK)**. Tiles default to sync, objects default to stagger (EUX B table).
- **Hit-stop vs ambient:** there is still one clock. Effect and actor clips read `effectT = clockMs − frozenMs`, where `frozenMs` is the summed hit-stop of the playing effect. Ambient anims (water, torches, sway) read `clockMs` directly, so they keep running during hit-stop, as EUX Q4 and the parent leaning ask. This is a derived time, not a second clock. Reduced motion skips the freeze, as already ruled.
- **Hidden tab / offline / resume:** rAF stops while hidden, so the host stops ticking and anims freeze on their current frame. On resume the clock clamps `dt` at `maxFrameMs` (100 ms default), so there is no catch-up storm. Offline catch-up for idle modes is host-supplied and capped (law 1). Anims need no catch-up because `frameAt` is O(1) for any `tMs`.
- **Clock pile-up carry (step 25):** a long host-supplied `durationMs` steps the clock tick by tick. The 16,384 ms cap bounds it today. The fix is a **bulk clock step**: jump straight to the next due timer or subscriber, firing due work in order. It belongs in the host-driver slice (§11, slice 29). It is a `src/core/clock` API addition, not core-types or a format change: an engineering call.
- **Render on change:** `nextChangeMs(scene, tMs)` is the earliest frame boundary of any visible clip. A frame with no clock-crossing, camera, state or size change is **skipped via a dirty flag** (decision R5-4; QA budget: idle frame **0 draws [E]**).
- **One player for everything:** Sprite Studio, the tile sheet and the Effect Designer call the same `frameAt` and draw-list function (Effects v2 §13.8; EUX Q9: **yes**). Previews tick at the engine `stepMs` (10 ms default) and show the rounding: "200 ms = 20 ticks" in Advanced (EUX Q6). GIF delays are in 10 ms units **[S, GIF89a, via EUX]**, which matches a 10 ms step exactly.

## 4. Glow layer

| Option | Crisp? | Cost (mid-range phone) | Fit |
|---|---|---|---|
| **Pre-baked glow sprites + `lighter`** (Canvas2D) | Yes, if the sprite is drawn at art res with nearest scaling (stepped bands) | One `drawImage` per light. `lighter` is a cheap separable blend [MDN globalCompositeOperation] | **Ship first** (Effects v2 §13.2) |
| Glow painted into the sprite frames | Yes | Zero runtime cost, but it can't pulse on its own and it breaks the "glow off base pixels" rule | Only for emissive *base* colours (§8) |
| `soft-light` / `overlay` composites | They change contrast and hue across the art | Heavier blend math, varies by browser | **No.** It edits base pixels |
| Shader bloom (multi-pass blur, WebGL) | **No**, it blurs by design | Several full-screen passes. Arm measured an optimised bloom at about 3 ms a frame, and baked or plane bloom at under 1 ms [Arm guide; Arm Community] | **No** |
| WebGL additive `blendFunc(ONE, ONE)` | Yes, with NEAREST | Cheapest per light | Later, with the WebGL backend |

- **Battery:** glow costs fill rate. Keep lights in an **art-res overlay buffer** (390×844 art px ≈ 0.33 MP at `s = 3`, versus 2.96 MP device) and scale it once with nearest. Redraw that buffer only when a light moves or flickers. Torch flicker of about 7–9 Hz and crystal breathing of about 1.5–2 Hz (prototype values, `animated-world.md`) set the redraw rate, not 60 Hz. QA budget: **≤ 2 glow layers per effect [E]**.
- **The look question (CEO Q1):** stepped art-res glow (fully crisp, matches the art) vs smooth device-res gradients (today's moonlit prototype look). Both keep all soft pixels on the overlay, so the base art stays crisp either way. Engineering recommends **stepped** as the default, because it passes QA's run-length test with the blend class limited to named ops.

## 5. Batching, dirty rects, Canvas2D vs WebGL

- **Draw-call reality:** WebGL batchers (Phaser's multi-texture batcher) merge thousands of sprites into a few calls [Phaser 4 rendering concepts]. Canvas2D issues one call per `drawImage`, but in Chromium and WebKit it is GPU-backed, and a few hundred calls a frame is fine on mid-range phones. Our SRPG load with baked chunks is about 10–30 draws per layer **[D §12.4]**. QA budget: **≤ 300 draws per frame, chunk layers ≤ 12 blits each [E]**.
- **Static layers into chunks:** 16×16 tiles at 1× in `OffscreenCanvas` (iOS 16.4+), LRU 96 MB on phones (ARCH §12.3). Animated tiles are drawn as live sprites over the chunk and never re-baked per frame. This is the main batching win on Canvas2D.
- **Dirty rects vs full redraw:** with a moving camera, dirty rects save little and add bug surface. We **redraw the whole view from chunks when dirty, and nothing when clean** (render on change, §3). Drawing is dirty-driven on rAF, with an **optional host cap at 60 for battery and no cap by default** (decision R5-7). On 120 Hz panels (8.3 ms frame) the dirty flag already stops redundant frames when nothing moves.
- **OffscreenCanvas in a worker:** possible, but it adds a message boundary and a second copy of the draw list. v1 uses OffscreenCanvas **for caches on the main thread only**; worker rendering is parked.
- **Context loss:** WebGL contexts are lost routinely on mobile backgrounding and memory pressure. Handle `webglcontextlost` / `restored` and rebuild every GPU resource [MDN]. Chrome hibernates backgrounded Canvas2D rather than losing it, and support for the Canvas2D `contextlost` event varies [Chromium commits; MDN contextlost]. **Design rule:** every canvas or texture is a cache rebuildable from data. On loss, blank or resume: mark everything dirty and rebuild at `rebuilds_per_frame` (2).
- **Recommendation:** ship **Canvas2D** behind the backend adapter (`begin / draw(list) / end`, matching ARCH §12.4's `beginFrame, drawImage, fillRect, endFrame`). Add a **WebGL2** backend when ARCH's trigger hits (> ~2,000 animated sprites per frame) or when LUT palette shaders are wanted (§8). The pure draw list is the same for both.

## 6. Layer and z-order rules (engine side; feel: EUX §A)

**What proven tools do:** Godot `y_sort_enabled` draws higher-Y children in front, and **y-sort compares only items with the same `z_index`**. `y_sort_origin` moves the sort point per tile [Godot CanvasItem, TileMapLayer]. Phaser `setDepth(n)` uses one number, with a stable order within equal depth [Phaser docs]. RPG Maker uses Below / Same / Above characters, plus star tiles that draw above [via EUX A]. Tiled draws object layers Top Down, sorted by y [via EUX A].

**Credit, EUX §A:** feet decide draw order (**row, then column, bottom-aligned**), matching `painter-proto/scene.js` and ARCH §12.1 step 4. **Advanced** adds a **Foot line** handle, **Layer chips** (Ground / Standing / Above) and an optional **see-through canopy**.

**Contract, the full draw order** (extends ARCH §12.1 and Effects v2 §13.1; see the contradiction note below):
1. Background layers (parallax, whole art px).
2. Ground tile layers (chunks), plus animated tiles as live sprites.
3. Walls (baked walls chunk layer).
4. Ground marks: baked blob shadows, then **effect ground stamps**.
5. **Standing band, sorted by one key:** units, `map.objects`, and props whose Layer chip is "Standing". Key = `(footY, c, kind, z, docOrder)`:
   - `footY` = the visual foot row in art px, so a moving unit sorts by its current foot, not its start or end tile (EUX A, Godot model).
   - At a tie, objects draw before units (ARCH §12.1), then unit `z`, then document order. The order is total and stable.
6. `aboveUnits` tile layers and "Above" props: roofs and canopies. The see-through fade is a **named layer op** with a fixed alpha step set (decision R5-6).
7. **Darkness overlay**, one art-res buffer, built in this order:
   - stage dim fill, with **lit units punched out** (units stay lit during dim, §13.1);
   - moonlit wash over it;
   - light holes and emissive masks punched out (`destination-out`).
   - Combined darkness is capped (§9). The buffer is then scaled once with nearest.
8. Effect air (orbs, sparks).
9. Additive glow (`lighter`).
10. Flash overlay.
11. HUD (screen space, not scaled by camera zoom).

This gives the parent's order: **base → wash → stage dim → fx air → glow → UI**. Wash and dim share one buffer.

- **Multi-tile props** (footprint is reserved and read as 1×1 in v1): the sort key is the **bottom row** of the footprint, and the canopy part can be authored as an `aboveUnits` tile or an "Above" prop. **Units passing behind trees:** a unit north of the trunk has a smaller `footY`, so it draws first and the canopy covers it. A unit on the tree's own tile draws after it (same row, object first), so a tall prop never covers the unit standing on its tile (EUX A "readable").
- **See-through canopy cost (EUX Q10):** affordable **per tile or per prop, not per pixel**.
  - Per prop: one extra `drawImage` at an alpha step.
  - Per `aboveUnits` tile in a chunk: draw the chunk with an even-odd clip that excludes the faded tiles, then draw those tiles at the alpha step. That is about +1 clip and +2–6 draws per hidden unit, inside QA's **≤ 300 draws [E]**.
  - Per-pixel masks would need a scratch composite per prop each frame, so they are rejected. QA will verify against the budget on the first build.
- **Contradiction flagged (not resolved silently):** Effects v2 §13.1/§13.4 literally say "dim draws **before** units". Y-sort puts units and props in **one** band, so a dim layer cannot sit between them without breaking occlusion. The proposal above keeps §13.1's intent (props dim, units and the playing effect stay lit) by punching lit units out of the dim in the overlay. **§13.1's wording needs an Architect update when the kit is written.** Units drawn after the dim would otherwise show through canopies.
- **Engine vs feel:** Layer chips and the Foot line are editor data. The renderer only needs `layer: ground | standing | above` per placed prop and the asset `anchor`. A per-placement `layer` field **needs a CN (DSK)**. `anchor` exists (§7).

## 7. One handoff format: Sprite Studio and Effect Designer to the renderer (feel: EUX §B)

**Aseprite, for comparison:** `--sheet` + `--data` (json-hash or array) gives per-frame `frame` rects and a `duration` in ms. `--list-tags` adds `meta.frameTags {name, from, to, direction}`; the direction is forward, reverse or ping-pong, plus repeat. `--list-slices` adds `meta.slices[].keys[{frame, bounds, center?, pivot?}]`, so pivots can vary per frame. [Aseprite CLI, Slices; Nerulio]

**What already exists in our formats (read before asking for CNs):**
- **AssetMeta** (project-format §6.2): `frame {w, h}`, `layout grid | packed` + `frames[]` rects, **`clips[{name, frames: int[], fps?, ms?: int[], loop?}]`** (per-frame ms exists), **`anchor {x, y, units} | "auto"`** (default bottom-centre, ARCH §12.7), `noMirror`, and `tileProps.anim` for tiles.
- **Unit clips** (§6.3): the well-known names `<action>-<facing>`, with the 7-step fallback including the mirror (ARCH §12.9). Placement `facing N|E|S|W`.
- **Sprite recipe** (`src/paint/recipe/types.ts`): `Anim {name, loop, gen?, frames: Frame[{ms, pose, parts, runs}]}`. The BTF limits are `anims: 32, frames: 64`.
- **Effects:** `FX_FORMAT.maxFrames 64` (refused as `fxTooManyFrames`), `maxSteps 6`.
- **The 64-frame cap is settled** (EUX B, parent).

**Credit, EUX §B:** the handoff fields are frame ms/hold, loop mode, tags, anchor (foot point), facing with mirror, offset (EUX: phase), and light. **Per the parent's instruction each is marked "needs a CN (DSK)".** The engine note says how much of each already exists, so DSK can scope each CN small:

| Field | Already in the format? | Status |
|---|---|---|
| frame ms / hold | `clips[].ms[]` (AssetMeta), `Frame.ms` (recipe) | **needs a CN (DSK)** only for `hold` sugar and for the bake to write `ms[]` |
| loop mode (loop / once / ping-pong) | `loop: bool` exists; ping-pong does not | **needs a CN (DSK)** for ping-pong, or ping-pong can be expanded into `frames[]` at bake time with no field |
| tags | the clip `name` acts as a tag | **needs a CN (DSK)** only if the bake must group several clips under one tag |
| anchor (foot point) | `anchor` exists, default bottom-centre | **needs a CN (DSK)** for the recipe → bake path (the recipe has no anchor) and any per-frame pivot |
| facing + mirror | clip naming + `noMirror` exist | **needs a CN (DSK)** only for an explicit facing set on recipes |
| offset (EUX: phase; sync / stagger) | none | **needs a CN (DSK)** for the per-clip default and the maker override; engine-derived otherwise (§3) |
| light (colour, radius, flicker / breathe) + emissive ramps | none | **needs a CN (DSK)** |
| frame count | 64 cap | **settled** |

- **One handoff rule:** the renderer reads **only baked AssetMeta strips and clips**, never recipes. Sprite Studio and the Effect Designer bake to that shape. This one-door rule keeps the renderer simple.
- **Default anchor:** bottom-centre `{x: 0.5, y: 1, units: "norm"}` when the field is absent (EUX Q7: **yes**, already ARCH §12.7).
- **Sway:** baked 2–4 frame loops fit (EUX Q8: **yes**). Even 4 sway frames on top of idle (4) plus 4 facings × walk (6) is 32 frames, well under 64. This also matches the CEO's "sway from painted frame loops". UX's earlier "Sway moves pixels by whole steps" (animated-world.md) is reconciled because the bake *is* that whole-step move.
- **Carry (EUX mismatch):** Sprite Studio's night preview uses a **multiply tint `#6a7cb4`** and its own **`setInterval(draw, 160)`** (`ui-shell/js/sprite-studio.js` L976–988). It must move to the one engine frame player (Effects v2 §13.8) and to the moonlit palette derivation (§8). Owner: ui-shell / UX. EA does not touch ui-shell.

## 8. Palette and colour handling (feel: EUX §C)

**Credit, EUX §C:** **moonlit is a palette swap plus an overlay, with no tint mode.** Day `btf-ashroad` and night `btf-moonlit` are two full locked-ramp sets. Sprite night colours come from a frozen `moon(rgb)` derivation, and `flame` / `crystal` are emissive. Shimmer cycles water steps 3–5 only. Blob shadows are baked as a 2-step ramp step-down, so they never leave the palette.

**Contract:**
- **Locked ramps stay in the art.** Every base pixel is a ramp colour in both looks. Glow, darkness, dim and fades live only on the overlay and named ops (QA palette closure, §10).
- **Day → moonlit = asset swap** (paired baked assets). It is exact, costs nothing at runtime, and doubles decoded memory for swapped sets; the §12.11 meter counts it. LUT swap is a later WebGL feature. Tint is rejected because it shifts every colour by the same amount and greys the ramps (EUX C).
- **Colour cycling (Ferrari):** browsers have **no indexed canvas**. Huckaby's Canvas Cycle rewrites only the pre-listed cycling pixels into RGBA each step [EffectGames]. **For us: bake each cycle into frames at load** (6 steps = 6 frames of that tile). At runtime it is then just a clip on the one frame player, with no `ImageData` per frame. Smooth "BlendShift" in-between colours are **rejected**, because they invent off-ramp colours (EUX C "mushy"). WebGL later can use an index texture plus a palette texture with no format change, provided the format stores **cycle slots as ramp indices**. That field **needs a CN (DSK)**.
- **River scroll:** bake it as frames too (`tileW / speed` frames), or draw a source-rect offset into a pre-tiled 2×-wide strip. It is one draw either way. The scroll field **needs a CN (DSK)**.
- **Cost:** Canvas2D with baked frames costs only memory. WebGL with an index texture costs one texture fetch. Indexed images would need a decode path, so they are parked.

## 9. 2D light and shadow model (feel: EUX §D)

**Credit, EUX §D:** **emissive pixels keep their colour, light holes sit on the overlay, and stage dim goes through the same wash.** This is the prototype's `atmosphere.js` model: a navy wash `rgba(3,8,26, 0.62 × intensity)`, `destination-out` holes, then `lighter` colour. Celeste's lighting also composites lights onto one small texture because the screen is tiny [Noel Berry]. Eastward's cast shadows need 3D meshes and normal maps, so they are out of scope [Game Developer].

**Contract:**
- **One art-res darkness buffer** per frame (§6, step 7). It is redrawn only when a light, dim level or wash level changes (dirty flag).
- **Emissive:** `EMISSIVE` ramps (flame, crystal), Gives-light props and the playing effect are punched out of the darkness, so they keep full colour. Emissive masks are baked per frame at bake time (alpha of the emissive-ramp pixels), so the punch is one draw.
- **Units vs the wash** (EUX Q1, parent leaning): units sit **under** the moonlit wash (they are in the scene) **unless emissive or lit**. Lit units are punched out of the dim only, not the wash.
- **Combined darkness cap** (EUX Q2): the cap is a **clamp on the dim amount**, not on final colours. `aDim = min(dim, 1 − (1 − cap) / (1 − aWash))`, with `cap = 0.72` total darkness **[E]**, tuned on the first build so terrain never reads darker than the moonlit ramp's step 1. It is pure integer maths at fixed alpha steps.
- **Light holes survive dim** (EUX Q3, parent leaning): the torch *sprite* dims, but its glow hole stays open at **50% radius** during dim. **This changes Effects v2 §13.1's "wall torches dim" for the glow hole only.** That ruling is flagged for the CEO as UX's Q2 because it is taste.
- **Shadows:** baked blob shadows (ramp step-down, palette-safe) in ground marks. Drop shadows are baked silhouettes, optional later. No dynamic occluder shadows.
- **Stage dim:** quantised to fixed alpha steps (8) for goldens. It eases over Effects v2 timings on the clock.
- **Cost:** about 1 fill + N light draws + M punches + 1 scaled blit per dirty frame. 16 lights is about 20 draws, well inside **≤ 300 [E]**. Fill rate is about 0.33 MP at art res.

## 10. Testing (QA section, credit: QA, `docs/qa/renderer-test-research.md`)

**Three layers:**
- **L1 recording renderer (Node, gates `green`):** a fake backend that records every draw. It asserts integer args, `dw = sw × s`, draw order, counts and overdraw, and hashes RGBA from a tiny nearest blitter.
- **L2 real canvas readback** (Playwright: Chromium, Firefox, WebKit): the same RGBA as L1.
- **L3 compositor screenshots** at DPR 1 / 2 / 2.625 / 2.75 / 3: the backing store maps 1:1 and `pixelated` is set.
- **Two checks per artefact:** palette closure + run-length (+ exact hash). Each catches what the other misses **[M]**.

**Budgets (QA R2.2):**
- renderer p95 **≤ 4 ms [E]**;
- app work **≤ 10 ms [S]**;
- dropped frames **≤ 1 %, none > 50 ms [E]**;
- sustained p95 **≤ 1.25× [E]**;
- **≤ 300 draws per frame, chunk layers ≤ 12 [E]**;
- idle frame **0 draws [E]**;
- canvas ≤ 4096 px per side **[D]**;
- live canvas bytes **≤ 160 MB [E]**;
- heap growth **< 1 MiB large-object [E]**;
- particles **≤ 32 per effect, ≤ 128 on screen [E]**;
- glow layers **≤ 2 per effect [E]**;
- overdraw **max ≤ 4, mean ≤ 2.0 [E]**.
- *Note:* QA's particle numbers differ from Effects v2 §13.3 (pool 96, soft 48 per effect). That is flagged for QA/UX to reconcile; the engine keeps §13.3 until then.

**Decisions on QA's R5 questions** (parent rulings, recorded):
1. L2/L3 tools (Playwright, pixelmatch) live **outside the main `package.json`**, in their own folder and package.
2. The fake renderer lives in **`tests/`**, as a test backend of the draw-adapter interface.
3. The odd letterbox pixel goes **bottom/right**, from a floor offset.
4. Unchanged frames are **skipped via a dirty flag**.
5. **The core never sees rAF.** The host maps the rAF time to engine ticks, the renderer reads `clockMs`, and debug timing goes through the host and `DebugPort`.
6. Roof fade and see-through are **designed blending**, as named layer ops with a fixed alpha step set.
7. Drawing is **dirty-driven on rAF**, with an optional host cap at 60 for battery and **no cap by default**.

**QA done-means notes (to carry into each renderer kit):**
- (a) The device run tests at the panel's real rate (**120 Hz, 8.3 ms frame**) **and** with the 60 cap.
- (b) Plants for a **missed dirty flag**: a state change or anim tick with no redraw. The frame after a change must match its golden.
- (c) The palette check **exempts only the named fade / see-through ops at the fixed alpha steps.** This doc's wash, dim and glow are therefore also named ops with fixed steps, so the exemption list stays explicit.

## 11. Ranked slice list (proposal, steps 27..N; each 150–400 lines, one subsystem)

| # | Slice | Contents | Gate / needs |
|---|---|---|---|
| 27 | **Render core (pure)** | `backingSize`, `fitView`, `scaleRange`/`snapScale`, `snapCamera`, clamp/ease, `frameAt` (`nextMs`) + `hash32`/`instanceOffset`, draw list with bands, the y-sort key and `dueMs`, `needsDraw`. Node tests; no DOM | **No CN:** no pinned rule covers `src/runtime/**` beyond `input`, so the own-folder fence is a test; a depcruise rule joins the next pin CN. Written: `handoff/steps/step-27-render-core.md` |
| 28 | **Canvas2D backend + chunk cache** | Adapter, 1× chunks, LRU, smoothing reset, rebuild on loss; L1 recording backend in `tests/` | — |
| 29 | **Host frame driver** | `raf-driver.ts` → ticks, dirty-flag skip, optional 60 cap, visibility pause, **bulk clock step** (pile-up carry), `DebugPort` timing | Clock API addition (engineering) |
| 30 | **World → scene adapter** | Reads world + project: map layers, AssetMeta clips, unit clip fallback + `noMirror`, foot positions during moves. Read-only | — |
| 31 | **Light & glow** | Darkness buffer, holes, emissive punches, dim cap, `lighter` glow sprites, seeded flicker | Emissive/light fields **need a CN (DSK)** for authored lights; stock library lights can ship first |
| 32 | **Animated world extras** | Colour-cycle bake, river scroll, sway bake, offset override, see-through canopy op | **CN (DSK)** for cycle slots, scroll, the offset override, layer chip |
| 33 | **Effects v2 player on the renderer** | Effect + time → draw list (§13.8), particles pool, flash detector hookup | May split in two |
| 34 | **Perf + device acceptance** | QA L2/L3 package, budgets, 120 Hz + 60 cap device run, lite fallback | QA |
| later | WebGL2 backend; LUT palettes; node mode (Effects v2 §18); **parked:** atlas packing, map-editor decor props, autotiles | | |

## 12. Open questions

**For the CEO (taste only):**
1. **Glow look:** stepped pixel glow (fully crisp, recommended) or smooth soft glow like today's moonlit prototype? Both leave the art itself crisp.
2. **Torches during an ability's dim** (EUX CEO Q2): keep their glow at about half size (recommended, and it changes the §13.1 wording) or go fully dark?
3. **Default sway** (EUX CEO Q3): subtle everywhere, or trees only?
4. **See-through canopy default** (EUX CEO Q4): on (recommended for tactics readability) or off?
- Already answered with UX's recommendation, for the CEO to confirm: moonlit = palette swap + overlay, no tint (EUX CEO Q1).

**Engineering calls (made here, with reasons):**
- **EUX Q1:** units under the wash unless emissive or lit. Reason: they are in the scene, and lit units read as lit.
- **EUX Q2:** clamp on the dim amount, cap 0.72 [E]. Reason: it is pure and per-layer, and readable art is guaranteed.
- **EUX Q3:** holes survive at 50% (pending CEO Q2).
- **EUX Q4:** ambient keeps running during hit-stop via derived `effectT`. Reason: it is cosmetic, on the one clock.
- **EUX Q5:** per-instance offset derived from map seed + cell. Reason: no stored randomness; an override needs a CN.
- **EUX Q6:** canonical preview tick = engine `stepMs` (10 ms), rounding shown in Advanced. Reason: it matches GIF 10 ms units.
- **EUX Q7:** default anchor bottom-centre. Reason: already ARCH §12.7.
- **EUX Q8:** baked 2–4 frame sway fits the 64 cap.
- **EUX Q9:** one player for Studio, tiles and effects (§13.8).
- **EUX Q10:** see-through per tile or prop, not per pixel. Reason: QA budget.
- **Open engineering:** chunk size stays 16; `rebuilds_per_frame` 2; the `src/runtime/render` depcruise rule (a CN for pins); the bulk clock-step API shape; QA vs §13.3 particle caps; the §13.1 wording update.

**CNs for DSK (none changed here):** offset override, light/emissive fields, cycle slots as ramp indices, river scroll, per-placement layer chip, ping-pong/hold sugar, the recipe → bake anchor and tags.

**Carries:**
- Sprite Studio's multiply tint `#6a7cb4` + `setInterval(160)` must move to the one player and the moon derivation (ui-shell / UX).
- The clock pile-up bulk step (slice 29).
- The §13.1 dim wording.
- QA/§13.3 particle caps.

## Sources

- Godot docs: Multiple resolutions (stretch modes, integer scale): https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html
- Godot CanvasItem (`y_sort_enabled`, `z_index`): https://docs.godotengine.org/en/stable/classes/class_canvasitem.html
- Godot TileMapLayer (`y_sort_origin`): https://docs.godotengine.org/en/stable/classes/class_tilemaplayer.html
- Godot TileSetAtlasSource (animation modes, random start): https://docs.godotengine.org/en/stable/classes/class_tilesetatlassource.html
- Godot PR #77257 (tile animation modes; stable per-cell offset): https://github.com/godotengine/godot/pull/77257
- Godot PR #86210 (random start scaled to loop duration): https://github.com/godotengine/godot/pull/86210
- Godot 2D lights and shadows: https://docs.godotengine.org/en/stable/tutorials/2d/2d_lights_and_shadows.html
- Phaser config (`pixelArt`, `roundPixels`, `antialias`): https://phaser.io/oss/docs/api-documentation/class/core-config
- Phaser round-pixels example: https://phaser.io/oss/examples/v4.1.0/game%20config/view/round-pixels
- Phaser 4 rendering concepts (batcher, `pixelArt`, `smoothPixelArt`): https://phaser.io/tutorials/phaser-4-rendering-concepts
- PICO-8 manual (128×128 screen, `pal()` palette tricks): https://www.lexaloffle.com/dl/docs/pico-8_manual.html
- Aseprite CLI (`--sheet`, `--data`, `--list-tags`, `--list-slices`): https://www.aseprite.org/docs/cli/
- Aseprite slices (pivot): https://aseprite.app/docs/slices/
- Nerulio, keeping Aseprite tags, durations and pivots: https://nerulio.com/en/game/keep-aseprite-tags-when-packing/
- Celeste Motion Smoothing (fractional offset compositing): https://github.com/FancyFurret/celeste-motion-smoothing
- Noel Berry, Remaking Celeste's Lighting: https://noelfb.com/posts/celeste_lighting/index.html
- Moonflower Games, Pixel-art smooth camera: https://apples.moonflowergames.com/articles/pixel-art-smooth-camera-anti-aliasing/
- Eastward creators on pixel art (3D meshes, normal maps): https://www.gamedeveloper.com/art/eastward-s-creators-share-insights-on-making-pixel-art-adventures
- Joseph Huckaby, Old School Color Cycling with HTML5 (Mark Ferrari art): https://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html
- Canvas Cycle source: https://github.com/jhuckaby/canvascycle
- Lospec palette list (locked palettes and ramps): https://lospec.com/palette-list
- MDN `globalCompositeOperation` (`lighter`, `destination-out`, `soft-light`): https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
- MDN `imageSmoothingEnabled`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
- MDN `image-rendering`: https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
- MDN `devicePixelRatio`: https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
- web.dev, pixel-perfect rendering with devicePixelContentBox: https://web.dev/articles/device-pixel-content-box
- MDN `OffscreenCanvas`: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- MDN `webglcontextlost`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
- MDN `contextlost` (Canvas2D): https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/contextlost_event
- Chromium, canvas background context-loss removal: https://github.com/chromium/chromium/commit/9167501f173b2ee1c718e324b0fa7e7b179bb0e4
- MDN Page Visibility API (rAF paused when hidden): https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- Gaffer On Games, Fix Your Timestep (fixed step + interpolation): https://gafferongames.com/post/fix_your_timestep/
- Arm Guide for Unity Developers, Bloom (avoid post-process bloom on mobile; baked bloom costs almost nothing): https://support.arm.com/documentation/102259/0100/Bloom
- Arm Community, post-processing on mobile (bloom 3 ms/frame cut to < 1 ms with baked and plane bloom): https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/post-processing-effects-on-mobile-optimization-and-alternatives
- GIF89a spec (delays in 1/100 s), via EUX: https://www.w3.org/Graphics/GIF/spec-gif89a.txt
- Internal: ARCHITECTURE-v0 §12; BUILD_GUIDE laws; ux/effects-v2-plan.md §3.8, §13, §18; ux/design-notes/animated-world.md; data/project-format.md §6.2–6.3; ux/renderer-research-ux.md (EUX); docs/qa/renderer-test-research.md (QA).
