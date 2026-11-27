# styles-code: B, C and D redrawn in code (CEO 06:31 ask)

Same village layout as the M2 stage: 12×10 tiles at 32 px, plus a 32 px top overlap row, so the 1x canvas is 384×352.
Everything is drawn from code and baked offline with Python 3, numpy and Pillow, on the bake machine only. No library ships to the phone, because the output is just PNGs. No concept pixels are copied: the concepts in ../styles/ are only used for the side-by-side.

## Rebuild
    python3 style_b.py   # B, modern HD pixel
    python3 style_c.py   # C, cozy soft-lit (imports B's kit and overrides it)
    python3 style_d.py   # D, hand-painted (about 15 s)
    sha256sum -c SHA256SUMS

Shared code: common.py has the layout, noise, ramps and sprite class. recipes.py has one recipe per object (tree, house, unit, prop) returning a material and shade sprite plus shadow shapes. engine.py places, shadows, colours and composites.

## Method per style
- **B (pixel mode):** each pixel stores a material and a shade, quantised to a 6-8 step hand-picked ramp. It adds a sel-out outline (dark from the neighbour's ramp), a warm rim on top-left edges, crisp 2-tone cast shadows, a sunset sky band and a warm grade.
- **C (pixel mode, with B's kit):** warmer and lighter ramps, 2 px plus-shaped flowers on a jittered grid, notched lily pads, softer outlines, a golden sky and a light grade.
- **D (painted mode):** rendered at 128 px per tile with continuous ramps, oriented brush-stroke noise, light shafts, a soft dark rim instead of outlines, blurred shadows, a caustic web on the water and Voronoi cobbles on the bank. It is box-filtered down to 32 px and 64 px.

## Files
| style | 1x | 4x | side-by-side |
|---|---|---|---|
| B | b-hd-pixel-32px-1x.png | b-hd-pixel-32px-4x.png | b-hd-pixel-32px-vs-concept.png |
| C | c-cozy-32px-1x.png | c-cozy-32px-4x.png | c-cozy-32px-vs-concept.png |
| D 32 px | d-painted-32px-1x.png | d-painted-32px-4x.png | d-painted-32px-vs-concept.png |
| D 64 px | d-painted-64px-1x.png | d-painted-64px-2x.png (same 1536 px width as the 4x files) | d-painted-64px-vs-concept.png |

## Verdicts (honest, one line each)
- **B:** close. The palette, houses, path, pond, units and shadows match. The trees' leaf clumps and scalloped edges are less defined than in the concept, which needs hand-authored cluster shapes rather than noise.
- **C:** close. The warm light, flowers, lily pads and soft outlines are there. The concept's trees have brighter yellow highlights and its grass is a touch warmer and calmer. Closing that is ramp tuning plus the same tree-cluster work as B.
- **D:** mood close, detail not. The golden light shafts, dark vignette, soft shadows, painted path and cobbled pond read like the concept. The pines are stacked chevrons, not the concept's round, lush tiers. **At 32 px, the brush texture and needle detail turn to mush, so the 64 px version is also shown, and it holds the painted look much better.** Getting closer needs per-tier hand-shaped pine silhouettes and 64 px tiles for D.

## Shared blockers
- Leaf and pine silhouettes: noise blobs can't match hand-drawn clusters, so a small library of authored cluster masks is the next step.
- Detail density: a concept tile is about 85 px across, against 32 px here.
- The kit is Python. A production version would need porting to the repo's tools/art-bake language, with the EA.
