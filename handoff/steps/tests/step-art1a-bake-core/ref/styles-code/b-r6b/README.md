# B r6b: chimneys that match the concept (CEO 07:55 add, via CoS 08:05)

This is B r6 with only the chimneys on the three roofs rebuilt. The crate and barrel are r6's, the trees are r5's, and the knight stays parked. Nothing is pushed or public.

## What changed
- r6's chimney was a thin 7 px post, mostly hidden behind the ridge row. The new stack matches the concept's size: 12×20 at 48 px tiles and 8×13 at 32.
- It also sits in the concept's spot, about three-quarters of the way along the roof. Roughly half of it stands above the roof's top edge and half stands on the slope.
- Cap and top face, seen from above: a light stone rim, lit on the top and left and a step darker on the right. Inside the rim is a dark flue, which the far rim shades.
- A lip (the cap's front face), then a shadow row under the cap.
- Coursed stone below, with mortar rows and staggered joints. The left edge is lit, the right two columns fall into shade, and the base is darker where the stack meets the roof.
- Dark side edges over the shingles, plus a short shadow cast on the roof to the lower right, away from the top-left sun.
- It uses a new 8-step `chimney` stone ramp that runs up to the concept's cream-white cap. The old chimney is removed from the house recipe, not painted over.

## Files
- `b-r6b-chimneys-closeup.png`: the concept, r6 and r6b at 8x. There's one row each for the red, slate and wood houses.
- `b-r6b-48px-1x.png`, `-4x`, `-vs-concept`, `-vs-r6`: the village at 48 px.
- `b-r6b-32px-*`: the same at 32 px.
- `style_b6b.py`: `chimney_grid` and `house6`, layered on `../b-r6/style_b6.py`. Rebuild with `python3 style_b6b.py 48`, then `python3 style_b6b.py 32`.
