# Pixel Composer (reference for the frame-loop and Effects v2 work)

CEO standing approach 2026-11-12 20:39: no brand-new systems. Each iteration improves our existing tools by borrowing proven ideas from well-known tools. **No node editor.**

Reference: Pixel Composer by @MakhamDev (node-based procedural pixel art).
- [Waterfall](https://x.com/MakhamDev/status/1929808849948889215): procedural, with only the leaves hand-drawn.
- [Pixel tracking for knife trails](https://x.com/MakhamDev/status/2068129265883705371).
- [Valley piece](https://x.com/MakhamDev/status/2120675654207185363).

Candidate building blocks, added as simple layers next to the hand-drawn layers in Sprite Studio and the Effect Designer, each one a few sliders:
| Block | What it does | Where |
|---|---|---|
| Flow along a path | pixels or a texture stream along a drawn line (waterfalls, rivers, energy beams) | Sprite Studio frame loop, animated tiles, Effects v2 |
| Noise | animated value noise to break up flat areas (water, smoke, fire) | both |
| Colour ramp | maps noise or brightness onto the sprite's own palette, so the result stays within the colour limit and crisp | both (we already do this in the night water shimmer) |
| Trail that follows motion | a smear that follows a tracked pixel (knife trails, dash streaks) | Effects v2 (fits the smear_ms / smear_tiles fields) |

No build now.
