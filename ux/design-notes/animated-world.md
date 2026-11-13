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
