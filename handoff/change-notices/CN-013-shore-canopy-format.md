# CN-013: authored shore foam and see-through canopy (format only, additive, render only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-13 18:0x London. Confirmed by: Engine Architect 17:59 (all 11 rulings); three amended by the CEO 18:04 via the CoS, relayed by the EA. r33 rulings 18:1x (QA s32 review d80cfa66; EA 18:12; DSK). r34 follow-ups 18:2x (EA 18:24). r35 QA s32 r2 fixes 18:4x (docs/qa/step-32-review.md 7fd085fa; EA 18:36; DSK accepts).
Kind: format only, additive, render only. **core-types unchanged at `61fad786`**. No version bump, no migration.

Docs: project-format **r35** (`ce7e9f53`). (Earlier: r34 `0644c4a8`.) profile-format has no CN-013 change (its r14 is CN-015 only).

## Fields
- Paint-style body `shore?: false | {foamPx?: 1–4 default 2, shallowPx?: 2–12 default 6, waveGap?: 4–16 default 8, frames?: 2–8 default 4, ms?: int 50–1000 default 250 (r34; equals the code constant SHORE_MS)}`, applies to the `water` slot. The shore follows `liquidEdge: "foam"` (the default): absent or `{}` means on with the defaults, and `false` means off (today's edge). **`shore: null` reads as absent** (on with defaults, no warning, matching `ms: null`) (r35). Other `liquidEdge` values never get the shore.
- `waveGap` must be a whole multiple of `frames`, so each frame moves the rings by `waveGap / frames` whole pixels: the loop is seamless with whole-pixel steps; some frames may show no ring when `shallowPx` is small (r35). The defaults 8 and 4 pass. This is not a coprime rule (gcd(4, 8) = 4, so a coprime rule would reject the defaults).
- Colours come from the water ramp: foam is the lightest step, wave is 1 step from light, shallow is 2 steps from light. There are no colour fields. A ramp with fewer than 3 steps clamps to the lightest step. No usable water ramp: `shoreInvalid` once per body ("no water ramp") and **the shore is off** (r35).
- Pinned or locked style versions are never edited, so turning the shore off or changing its params means a new style version.
- **Existing water maps gain foam on update** (a look change only, with no data change and no migration; the CEO was told through the CoS).
- When `accessibility.reduce_motion` is on, the shore's breathing foam and waves freeze on frame 0; the static foam line stays visible.
- Map `seeThroughCanopy?: boolean` (§6.4, top-level on the map document). Default false, absent means false, map stays v5, no migration. Set by makers only, never a player setting. The per-placement layer chip stays a later CN.

## Warnings (never block, values never rewritten)
- `shoreInvalid` (one name for all shore problems; the message names the field): once per style body when `waveGap` is not a whole multiple of `frames` (r33), and both fields use their defaults; and (r34) once per bad field on the object form, and that field uses its default. (r35) Once per body when the whole `shore` value is `true`, an array, a number or a string (field `"shore"`); the shore stays on with defaults. (r35) Once per body when there's no usable water ramp ("no water ramp"); the shore is off.
- Motion on styled water whose `anim` derives a clip keeps warning `motionInvalid` (r34; the message tells the maker to set `anim: null`).

## Readers
- Step 32 reads none of these from core-types. The host loader picks them up with the host shell. QA: there's no core-types sha change, so no add-only check is needed. Please check the reader against these docs when the host shell lands.
