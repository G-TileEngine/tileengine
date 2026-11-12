# Sprites — learn-from-keeps generator (v1–v7)

Offline grammar generator, no AI. Tiers T1 32px, T2 48px, T3 64px (CEO "16" meant T1). Only the CEO's eye passes a version; IoU scores are a guide and are biased against hand-tuned small tiers. Parked at v7 (CEO 16:25, usage).

Reproduce: `cd ui-shell/mock-gen-learn && python3 proto.py` (v7 default); `python3 proto.py v6|v5|v4` replays; `python3 proto.py icon` = frozen Icon style. Snapshots `out/keep-v5`, `out/keep-v6`. Shots `share/gen-learn/73g6-*`, `73g7-*`, CEO marks `ceo-1639-*`, `ceo-1705-*`.

## Keeps (frozen — do not regress)
- T3 axes (SHA ffa247186d5d1b15) and T3 handles, bit-exact with v3. Exception allowed: join the T3 axe shaft into the head (gap today).
- T1 sword: the simple cross. CEO likes it as is.
- T3 sword blade and handle. Icon style.

## What worked
- Per-size hand templates for T1/T2 beat downscaling T3 (v6–v7).
- T2 as a true midpoint between T1 and T3, not a shrunk T3 (v7).
- Mirror-symmetric guard with a 2px gap from the handle (v6).
- Default style: 1px dark-hue outline, 3-step shading, top-left light, ≤16 colours, hue-shifted shadows.

## What failed and why
- Same grammar and detail budget at every size: small sizes go muddy. Averaging downsample, fixed 1px outline eating small sprites, colour ramp collapsing, scoring tuned on 64 (§19A root cause).
- 16px icon tier: dropped in v6, not worth it.
- v1 claw-guard style: the look was fine; it was rejected because of a stray dark diagonal smudge across the grip below the guard (drawn by mistake). Bring v1 back as its own style without the smudge.
- Still weak at v7: T1/T2 axes (wing sharpness/length, cream lip, plate and fang), T3 sword guard vs target.

## Version log
| v | Change | CEO |
|---|---|---|
| v1 | chunky cyan claw guard | rejected for the grip smudge; style itself OK, return later |
| v3 | T3 handles locked | swords 0.68–0.70, axes 0.60–0.62; "keep iterating, no numeric bar" |
| v4 | axes only, swords frozen | — |
| v5 | snapshot out/keep-v5 | — |
| v6 | mirror guard, T1/T2 hand-tuned, 16px dropped; ~0.70–0.72 | — |
| v7 | flared axe wings, claw edge, cream lip, smaller plate/fang; sword T2 midpoint, 15 colours | parked; to-do in gen-learn-plan §22 |

Next fix when unparked (plan only, §19A): size-aware grammar, cleanup pass for clusters/stray pixels, converter re-picking 6–8 colours per size with hand-placed AA and selective outline.

## Tidy (CEO 2026-11-12 19:45): helps sometimes, not every time
To improve when the sprite passes resume. From reading `tidyLayer()` in `ui-shell/js/sprite-studio.js` (r63); not yet tested case by case.
- **Helps:** single stray pixels with no neighbours; a lone 1 px speck of another colour inside a part (3+ of its 4 sides agree); 1 px holes and gaps between two same-colour pixels; left/right evening when Both sides is on.
- **Doesn't help, and why:**
  - Specks of 2 px or more and small clusters (it only looks at single pixels).
  - Jaggies, banding and broken diagonal outlines (no line or outline rules).
  - Muddy colours and too many shades (no colour merge; that's the converter's job, §19A).
  - Weapon pixels are skipped on drawn sprites, so weapon mess stays.
  - Only the body, back and imported layers are tidied, not hair or other parts.
  - Evening copies whichever side has the pixel, so it can copy a mistake to the other side.
- **Next pass targets (plan):** remove clusters of 1–3 px, a clean-up for diagonal and outline lines, merging near-duplicate colours, and a before/after toggle so makers can see when Tidy made it worse.
