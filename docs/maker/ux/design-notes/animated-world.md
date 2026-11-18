# Animated tiles and objects (post-H2; no build until H2 is done)

CEO 2026-11-12 19:39: flowing rivers, swaying trees and bushes. He noticed the moonlit preset (he first called it "Night Ash" by mistake) already makes light sources (the blue crystal) glow and seems to animate the water.

## How the night preset does it today (from the code)
Source: `painter-proto/painter.js`, `scene.js`, `atmosphere.js`, `sprites.js`. CEO confirmed 22:10: the name is **moonlit**. In code the night look is the `btf-moonlit` paint style shown with the optional **Atmosphere** layer (`ATMO_DEFAULTS`, off by default). The day pair is `btf-ashroad`.

1. **Water really is animated, in two ways.**
   - Frame loop baked into the tile recipe: `water@2` has 8 frames (`water@1` had 7 and did not loop, which was a known seam bug). `animMs: 200` per frame, so a 1.6 s loop. Gloss streaks drift 1 px per frame, and the period of 8 closes the loop. Lava and murk also use 8 frames (lava at 160 ms, swamp at 260 ms).
   - Atmosphere "shimmer": palette cycling on the crisp water pixels. Each pixel keeps its water-ramp step (`waterStep`), and only the lighter steps (3 to 5) swap between neighbouring colours of the same locked ramp, on a phase of `t*4 + x*0.25 + y*0.5`. No new colours and no blur, so the pixel art stays crisp.
2. **Glows are an overlay, never edits to the art.**
   - The crystal (and flame) are in an `EMISSIVE` set, so they keep full colour when the scene goes dark.
   - Darkness: a navy wash (`rgba(3,8,26, 0.62 × intensity)`) on a separate overlay canvas, with soft holes cut at each light source.
   - Light colour: an additive radial gradient per light (warm, torch, teal, gold). Torches flicker fast (smooth noise at about 7–9 Hz), crystals breathe slowly (about 1.5–2 Hz).
   - Lane glow: soft teal blobs on cracked-lane pixels, pulsing with `0.75 + 0.25 sin(1.4 t)`.
   - Extras on the same overlay: 36 fireflies that drift and blink, 4 slow light rays, and an overall intensity of 0.8.
   - Rule that made it work: the crisp pixel map is never filtered. All soft pixels live on the overlay.

## How a maker would set up an animated tile or object (plan)
Few buttons, no code. Basic adds zero taps: stock animated tiles (water, lava, swamp) already move.
- **Tile sheet, "Moves" toggle** on a tile. Options: Frames (draw or import 2–8 frames, with a speed slider of 100–400 ms per frame and a check that the loop closes), or Shimmer (pick the colours that swap; uses the tile's own palette).
- **Object "Sway / Flow" presets** for trees, bushes and banners: Sway (amount 1–2 px, speed, random offset per copy so a forest doesn't move in lockstep), Flow (for rivers: direction arrow and speed). These move pixels by whole steps only, so nothing blurs.
- **"Gives light" toggle** on an object: colour, radius in tiles, Flicker (torch) or Breathe (crystal). It feeds the glow layer and stays lit at night.
- **Smoke / particles** on an object (chimney, volcano): Strength (Light or Strong), rate, drift direction. See the reference below.
- Previews play live in the sheet, and reduced motion freezes everything on frame 0.

## References (style only, not our art)
- **"Tiny volcano" smoke by @RafaRPM_** ([post](https://x.com/RafaRPM_/status/2120622595972235548)), clip at `share/animated-world/rafarpm-tiny-volcano.mp4`. CEO: a strong version for volcanos and a lighter one for chimneys. Credit the artist; it is a style reference only, not our art.
- **Pixel Composer by @MakhamDev** (node-based procedural pixel art). See [pixel-composer-reference.md](pixel-composer-reference.md).

## Edge decoration (future map editor; no build until it's scheduled)
CEO 2026-11-12 20:22: props around the outside of the playable grid (lamp posts, fences, rocks, bushes, broken walls), so a map feels like a place instead of a board.
- Both ways: a hand-placed **decor layer** outside the grid, and **Scatter along edge**. Scatter fills the border from a chosen prop set using a seed, so the same map always looks the same. Makers can Re-roll the seed, then tweak or delete single props by hand.
- Light-source props (lanterns, lamp posts) use the same "Gives light" toggle and tie into the glow layer above.
- Decor is never part of the playable grid and can't block moves.
- Reference: @Thelastnecro24's Day 51 devlog (a pixel lamp post with a lantern, made in Godot). Style reference only.

## Renderer research (2026-11-13)
CEO order 00:17 (results over usage): researched the "frame player feel" in RPG Maker MZ, Tiled, Aseprite, Godot, LDtk, Pixelorama, Pixel Composer, Unity 2D, and games (Celeste, Stardew, Eastward, Octopath/Triangle Strategy as contrast, Sea of Stars, Taiji, Blasphemous, Fire Emblem, Into the Breach), plus layers/y-sort, the handoff format, palette and light (CEO scope 00:20).
- Crisp = whole-number zoom, whole-pixel positions, nearest-neighbour, soft pixels only on the overlay. Mush = bilinear, fractional zoom, sub-pixel motion, rotation, blur/bloom on base pixels, too many in-betweens.
- RPG Maker water: 3 frames ping-pong at 500 ms, all tiles in sync. Keep our `water@2` (8 × 200 ms). Sync tiles that touch; stagger separate props (sway, torches, idle units).
- Sway: frames or whole-pixel offsets on the canopy only (Taiji wind map, Godot cutoff row); rotation reads as sliding edges.
- Moonlit stays palette swap + overlay. Found: Sprite Studio's night preview uses a multiply tint and its own 160 ms timer, so it doesn't match the game. Fix both with the one player.
- Proposed handoff fields (frame ms/hold, loop, tags, anchor, phase, light) each need a CN (DSK); the 64-frame cap is settled.
Full write-up: [../renderer-research-ux.md](../renderer-research-ux.md)

## SpriteCook tree wind and travelling waves (step 32 reference)
CEO-approved art reference for step 32 ("subtle sway on everything leafy"), via CoS 2026-11-13. Sources: SpriteCook, [How to make pixel art trees move in the wind](https://www.spritecook.ai/blog/pixel-art-trees-wind-animation) (2026-11-10; full text at `/workspace/share/renderer-refs/spritecook-tree-wind.md`), and @asynkimo, ['traveling waves'](https://x.com/asynkimo/status/2121230694860890582) (clip at `/workspace/refs/asynkimo-traveling-waves.mp4`). Code licence unstated: **ideas only, no code copied.**

**Art side (how the tree is authored)**
- Three layers on the tree's own canvas: **leaf clumps** (one per bright mass of leaves; their oak has 14), a fixed **trunk** layer (wood, roots, anything that must not move), and a darker **inside** layer under the clumps, so a gap between two clumps shows shadowed tree, never the ground.
- **Outline pixels belong to the neighbouring clump**, not the trunk, or the outline stays behind when the clump moves.
- Pines split by branch tiers instead (8 on theirs); the narrowest leaf rows are the gaps between tiers.

**Motion**
- Each clump walks a **1 px loop** (up, right, down, back), whole pixels only, at **10 poses a second** even when the game runs at 60.
- **Edge clumps loose, centre stiff** (centre moves about a third as far); in a light breeze only the outer clumps move.
- Timing is a **travelling wave**: each clump is delayed by how far downwind it sits, in world position, so the wave carries from one tree to the next (their clip: 1.54 s per loop, crests 69 px apart, about 45 px/s).
- **Gusts with still air between**: in a gust the loop widens to 2–3 px and the canopy leans downwind and springs back (oak about 2.2 s per swing, bush about 1 s); away from gusts the loop shrinks to zero.
- Pitfalls they list: gaps that show the ground (inside layer missing), constant jitter (never-still loops), random timing, half-pixel offsets that blur or shimmer, and a new pose every frame (looks like sliding paper).

**UX implication**
Sprite Studio or the map editor needs a **"split canopy into clumps"** step. Basic: *Auto-split* with a **Clumps** slider (fewer/more), the trunk found automatically and the inside layer made for the maker. Advanced: **paint clumps** by hand (each clump a colour, like the body-map brush) and paint the trunk. Library trees and bushes come pre-split, so Basic adds zero taps.

**Where this updates my earlier sway notes** (above, and [renderer-research-ux §3 and §7](../renderer-research-ux.md))
- *2–4 baked frames at ~300 ms* → **per-clump 1 px loop at 100 ms (10 poses/s)**. Baked frames can't carry a wave that runs across trees or gusts, so this points to live whole-pixel offsets per clump. That is a renderer contract question for the Engine Architect (his §3 frame player; my earlier question 8 on baked sway vs the 64-frame cap). Until he decides, baked frames stay the fallback for tiny bushes.
- *Canopy only* → still right, refined: the trunk layer is fixed and the canopy moves **in clumps**, edge more than centre.
- *Seeded random offset per copy* → **timing by world position** (the travelling wave). A seed can still vary a tree's stiffness, but random timing is now a listed pitfall.
- *"What moves" brush (Taiji wind map)* → becomes the **clump brush** in Advanced: painting clumps also marks what moves; unpainted = trunk.
- *Subtle sway on everything, always* → **still air between gusts**. My earlier CEO question ("default sway: subtle everywhere, or only on trees?") now also asks whether gusts are on by default.
