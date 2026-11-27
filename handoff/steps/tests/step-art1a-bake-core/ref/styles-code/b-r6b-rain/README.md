# B r6b-rain: the r6b village in rain (CEO 08:26, demo only)

The CEO asked: "So how would the map look with rain and a gloomy vibe?" This is the r6b village at 48 px. The sprites and ground are r6b's, unchanged. The weather and light are engine layers on top, following the csoda lighting reference (`../../refs/csoda/`). Nothing is pushed or public, and the uniqueness pass stays on hold.

## Layers, in order
1. **Soft shadows.** The cast-shadow mask is blurred (about 8 px at 48) and weakened to about 60%, so overcast light has no hard sun edges.
2. **Overcast grade.** It replaces the sunset grade and the sun shafts. The image is darker and cooler, saturation is a bit under half, and the vignette is flatter. The sky band becomes low grey cloud.
3. **Contact darkening.** A soft dark band around the foot of every standing object. Wet ground is darkest there.
4. **Wet surfaces.**
   - Ground and road are darker.
   - The lit top edges of roof rows, stone, chimneys, the fence, the crate and the barrel catch a cool sky sheen.
   - Puddles on the road and in low ground reflect the sky, with a dark far edge and a light near lip.
5. **Water.** It's deeper and darker toward the middle, with rain rings.
6. **Warm accents.** The windows and the lantern are lit warm, with a soft halo and warm spill on the wet ground below.
7. **Light fog.** It's thicker toward the top, which is farther away.
8. **Rain.**
   - About 900 slanted streaks that fall a step each frame.
   - Pixel rings at three growth stages on the road, puddles and water.
   - Tiny crown splashes on the grass.
   - The splashes change every frame.

All of these are screen-space passes over a composed frame plus an id pass that records which material is on top at each pixel. That's the shape they'd take as engine layers, not baked into sprites.

## Files
- `b-r6b-rain-48px-4x.png`: the full stage at 4x.
- `b-r6b-rain-48px-vs-r6b.png`: sunny r6b beside the rain version.
- `b-r6b-rain-48px-1x.png`: the same stage at 1x.
- `b-r6b-rain-48px-2x.gif`: 4 frames of the rain at 2x, 110 ms per frame, looping.
- `style_rain.py`: rebuild with `python3 style_rain.py`.
