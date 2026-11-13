# Effects ↔ sprites sync: the base for the Effects v2 player (step 33)

**Owner:** Editor & UX Designer · **Date:** 2026-11-13, 18:2x Europe/London · **Status:** research and recommendations only. No code, no format change, no push. Every new field is marked **needs a CN (DSK)**. Nothing here is final until the Engine Architect (EA) writes the step 33 kit and the CEO gives SEND.
**Order:** CEO, 2026-11-13 18:15 London, via Chief Of Staff. Give effects a very strong base and make them sync well with the sprite world and its animations before the EA writes the step 33 kit. Results come before usage (milestone leap).
**Builds on (not reopened unless a revision in §8 says so):**
- `ux/effects-v2-plan.md`: §3.8 budget, §13 Architect rulings, §13.8 one player, §15.4 fields, §16 Impact flash, §17 Feel tricks, and §17.10–17.12 (setup-format r20 §2.10.2, ACCEPTED).
- `ux/effect-designer.md`: §5, the 64-frame cap.
- `ux/renderer-research-ux.md` (EUX) and `docs/research/renderer-research.md` (EA §1–12).
- `data/project-format.md`: §6.2/§6.3 (clips, anchor, `noMirror`), §6.7 K-4 (64 ceiling, `flashRisk`) and §7.3 (clip fallbacks, `clip_cues`).
- `data/setup-format.md` §2.10.1–2.10.2.
- Design notes: `effects-v2.md`, `animated-world.md`, `sprites.md` and `pixel-composer-reference.md`.
- `ux/design-notes/spritecook-blog-readthrough.md`: rarity and reveal glow, outlines, light bands.
- `/workspace/share/effects-tricks/effect-tricks-research.md`.
- `docs/sprite-recipe-architecture.md`: skeleton and joints, `anims[].frames[{ms, pose}]`, and an anchor derived from the root joint.

**Step 31 terms, from the code** (main `6e117f0`: `src/runtime/render/light.ts`, `types.ts`, `draw-list.ts`):
- Bands: `BANDS = base, wash, fxAir, glow, ui`.
- Lights: `Light {x, y, radius, fullyDark?}`, with `BANDS_OF_LIGHT = 6`, `STEPS = 32`, `WASH_MAX = 0.62` and `DARK_CAP = 0.72`.
- Fills: darkness is `rgba(3,8,26,k/32)`. The glow fill is `rgba(255,176,72,…)` from band 4 up.
- **Hybrid torch dim:** while `dim > 0`, a light's radius halves and `fullyDark` lights go out.
- `createMoonlit()` swaps paired sheets.
- The standing sort key is `(footY, c, kind, z, docOrder)`.

**Link check (curl, 2026-11-13):** every link returned 200 unless it is marked.
- **[403]**: the site blocks our fetcher. I read the text through the search index, so the page is real but curl could not reach it.
- **[unverified]**: curl got a 406 or 500. I read the text through the search index or the earlier plan.
- 404s were dropped.

---

## Summary: the top 10 decisions (plain words)

1. **One hit moment per ability play (`hitAt`).** All of these key off one time:
   - the attacker's contact frame and the effect's `connect`;
   - the victim's hit clip, hit-white and hit-stop;
   - the Impact flash, shake and light pop;
   - the hit sound and the damage number.

   Today there are three separate "hit" clocks: the clip, the effect's `connect` and the generic `clip_cues` flash. That is the main reason effects feel off-beat.
2. **Sprite clips carry frame events** (`release`, `contact`, `step`, `end`), and effects can **start on them**. A fireball leaves the hand on the frame the hand opens, and a slash spark lands on the contact frame. Events live on the sprite's clip, so the sprite is their one home and every ability that uses it agrees.
3. **Each frame has named anchor points** (`foot`, `centre`, `head`, `hand`, `tip`), mirrored with facing.
   - Recipe sprites get them free from their joints.
   - Imported strips get `foot`, `centre` and `head` automatically. For `hand` and `tip` the maker drags a dot, with a "Same spot on all frames" option.
4. **Attach or spawn.** An effect piece either **follows** its anchor every tick (auras, charge-ups, held glows) or is **spawned** once and stays in the world (explosions, dust, scorch). Spawn is the default, because it matches today.
5. **Effects can sit in the units' own depth band.** "Behind unit" and "In front of unit" join Ground, Air and Screen, and are sorted with that unit's feet. They swap automatically when the unit faces up, so a sword arc goes behind the body when the unit faces away.
6. **Effects light the world through the step 31 light system,** not with their own glow maths. A step can add a short **light pop** in the same 6 stepped bands. The playing effect's light **doesn't halve during its own dim**; today's hybrid torch dim would halve it.
7. **Colour stays in the palette.**
   - Basic colours come from the project's ramps.
   - The tint ramp steps through ramp colours instead of blending RGB.
   - Additive drawing is kept to small cores.
   - Smoke and dust can be **"shaded by night"** using the same paired-sheet swap as moonlit.
8. **Whole pixels everywhere, at a matched pixel size.**
   - By default an effect's pixels are the same size as the sprite's pixels.
   - Rotation happens at art resolution from a 16-angle cache, never at device resolution.
   - Particles are 1–3 px squares on whole pixels.
   - Effects move on a **30 ms pose grid**, so the dirty flag can skip frames.
9. **Feel conventions are in whole pixels, with one stacking rule: take the max and cap it, never add.**
   - Hit-stop stays as ruled, plus an optional 1 px **victim jitter** while frozen (Smash-style).
   - **Screen shake comes back** as an off-by-default Feel toggle (needs the CEO): trauma² with seeded stepped noise, 1/2/3 art px, no rotation, never the HUD, and a player setting of Off / Low / Full.
   - The flash rules stay. Our 25% detector area matches WCAG's flash area within 6%.
10. **Mobile budgets are reconciled.**
    - The particle pool stays at 96, with 48 per effect as the cap and **shipped presets at ≤ 32** (QA's figure).
    - Effects get ≤ 60 draws each and ≤ 120 in total.
    - Particles are batched into one path fill per colour.
    - Tinted pictures are cached in an effect atlas at load.
    - Effect lights re-plan at ≤ 10 Hz.
    - The lite fallback is still decided once, at effect start.

**What this revises (§8):**
- Screen shake goes from DEFERRED to proposed.
- Draw layers gain the standing band.
- §13.1's "dim before units" becomes "punch from darkness".
- Multiply tint and RGB tint ramps become ramp-stepped colour.
- The chunky ×5 default becomes a matched pixel size (needs the CEO).
- `clip_cues` no longer double-flashes alongside hit-white.
- QA's particle numbers and §13.3's are reconciled.
- The 64 cap's wording is clarified (steps vs frames).

---

## 1. Anchoring effects to the sprite frame and pose

### Current approach
- **Effects place points from `steps[].anchor`.** The anchor is `caster`, `target`, or `screen` (flash only). Points are `{dc, dr}` tile offsets, and `rotate_with_facing` turns them.
- **Timing is effect-local.**
  - `start_mode` is one of after-last, with-last, at-time or at-hit.
  - The hit comes from `connect` + `connect_step`: hit = start + max(50, len) × connect.
  - `cue_name` / `cue_at` set the sound.
- **Sprites carry their own data.**
  - `clips[{name, frames, ms[], loop}]`.
  - `anchor`: bottom-centre by default, one per sprite, not per frame.
  - `noMirror`.
- **The runtime adds generic cues:** a 2-frame white hit flash and an attack lunge (`unit-roster.clip_cues`, default on).
- **Nothing links the attacker's attack clip to the effect.** A long wind-up clip and a fast effect start together, so the spark can land before the sword swings.
- **One shared clock already exists.** The engine frame player (`frameAt`, steps 27–31) and `effectT = clockMs − frozenMs` provide it.

### What the best references do
- **Frame events on the animation itself.**
  - [Spine events](https://esotericsoftware.com/spine-events) describe an event as "a trigger for something to happen during an animation… to spawn particle effects, hurt an enemy".
  - [GameMaker sprite Broadcast Messages](https://manual.gamemaker.io/monthly/en/The_Asset_Editors/Sprites.htm) place a string at the playhead on the sprite timeline ([Broadcast Messages](https://manual.gamemaker.io/monthly/en/The_Asset_Editors/Sequence_Properties/Broadcast_Messages.htm)).
  - Unity has [Animation Events](https://docs.unity3d.com/Manual/script-AnimationWindowEvent.html).
  - Godot has the [Call Method Track](https://docs.godotengine.org/en/stable/tutorials/animation/animation_track_types.html). Godot's docs warn that these events **don't run when previewed in the editor**. That is exactly the preview-vs-game mismatch our one player avoids.
- **RPG Maker MZ and MV put sound and flash timings on the frame numbers of a battle animation.** The flash tints the target, not the screen ([MZ animation settings](https://rpgmakerofficial.com/product/mz/course/new-anime/settei.html), [MV-style animations](https://rpgmakerweb.com/blog/making-mv-style-animations)). This is the closest "few taps" model to ours.
- **Fighting-game frame data** splits a move into startup, active and recovery, with startup counted up to the first frame that hits ([Dustloop, Using Frame Data](https://www.dustloop.com/w/Using_Frame_Data)). Contact is a frame, not a percentage.
- **Named points per frame.**
  - [Construct 3 image points](https://www.construct.net/en/make-games/manuals/construct-3/interface/animations-editor) **[403]** are per-frame named points, such as "the end of the player's gun". Makers get "Apply to whole animation" and 1 px arrow nudges. The origin sits at the feet so animations "grow upwards".
  - [Spine point attachments](https://esotericsoftware.com/spine-points) are a point plus a rotation on a bone, used "to spawn projectiles, particles". You animate the bone, not the point.
  - [Aseprite slices](https://www.aseprite.org/docs/slices/) have per-frame keys with an optional **pivot**, and [tags](https://www.aseprite.org/docs/tags/) group frames. Per-cel user data is discussed in a [forum thread](https://community.aseprite.org/t/how-to-associate-data-to-each-cel-frame/6307) and exported via [PR #5187](https://github.com/aseprite/aseprite/pull/5187).
- **Pixel-art attacks put the smear or contact on one frame, then overshoot by 1 px.** See Saint11's attack sheets, and Slynyrd's [Pixelblog 9](https://www.slynyrd.com/blog/2018/9/8/pixelblog-9-melee-attacks) and [Pixelblog 53](https://www.slynyrd.com/blog/2024/11/25/pixelblog-53-punches-and-kicks). [Saint11 Impact](https://saint11.art/img/pixel-tutorials/Impact-export.gif) holds one frame before a big impact.

### Recommendation
1. **Clip events, stored once, on the sprite.** An attack, cast or walk clip can carry events at frame indices:
   - `release`: a projectile or cast leaves.
   - `contact`: the weapon meets the target.
   - `step`: a foot plants.
   - `end`.
   - A custom name of up to 16 characters, for sound.

   An event's time is the sum of `ms[]` up to the start of its frame, on the clip's own `effectT`.
2. **Effects can start on an event.** A new effect-level field, `start_on`, takes `cast` (today: when the ability starts), `release` or `contact`. Step `start_mode`s stay as they are, relative to the effect start. Every accepted timing rule (after-last, at-hit, `connect`, the shockwave's 150 ms minimum) keeps working.
3. **One hit moment, `hitAt`.** It is a pure function of the ability play, and the first rule that applies wins:
   1. If the effect has a hit step: `hitAt = effectStart + effectHitOffset`, using the accepted `connect` / `connect_step` rule.
   2. Else, the `contact` event on the caster's clip.
   3. Else, the peak of the `clip_cues` lunge (today's generic behaviour).
   4. Else, the cast start.

   Everything tied to the hit reads `hitAt` (§5 and the brief).
4. **Fallbacks, so Basic adds zero taps.**
   - Library sprites and `Make walk cycle` output come with `release` and `contact` on the attack clip. A 4-frame walk gets `step` on frames 1 and 3.
   - A sprite with **no** events gets derived ones, which are never stored:
     - `contact` is the frame with the biggest pose change from the frame before (recipe sprites have joint deltas). Otherwise it is frame `floor(n/2)`.
     - `release` is the same frame.
5. **Anchor points.**
   - `foot` is today's anchor: bottom-centre by default (ARCH §12.7).
   - `centre` and `head` are derived per frame from the box of opaque pixels: its centre, and its top-centre plus 2 px.
   - `hand` and `tip` come from recipe joints tagged `hand` / `tip` at bake time (recipe sprites, zero taps), or from the maker's dot on imported strips.
   - All points are whole art px from the frame's top-left.
   - When a clip plays mirrored (`flipX`, from the §7.3 fallback), `x' = fw − 1 − x`.
   - Each facing clip has its own points, and a mirrored clip uses the mirror of its source.
   - A new field on the effect step, `anchor_point`, picks one. When it's absent it means `tile`, which is today's tile placement, so nothing moves.
6. **Attach or spawn.**
   - `attach: "spawn"` (default, as today) reads the anchor point **once**, when the step starts. After that the piece stays put in world art px.
   - `attach: "follow"` re-reads the anchor every tick, including the unit's move offset `dx/dy` and the current frame's point. During hit-stop the anchor freezes too, because the unit's clip reads `effectT`.
   - `detach: "end" | "hit"` lets a follow piece let go at `hitAt` and carry on as a spawn, for example a charge orb in the hand. Default `end`.
7. **Timing hooks.** The player emits runtime events: `fx:start`, `fx:release`, `fx:hit`, `fx:end`, `clip:event{name}`, and `fx:loop` for looped pieces. They are never stored, and never reach the rules or the log. Sound bindings (`cue_name`, audio-format battle cues) can bind to `hit`, which uses `hitAt`.
8. **Clock sync rules.**
   - The sprite clip and the effect share `effectT` (EA §3). Ambient animation keeps `clockMs`.
   - Event times are worked out in **ms**, then rounded **up** to ticks **once**, at play time. That's the same rule as §13.9 chaining, so nothing starts early and nothing drifts.
   - Holds (`ms[]` per frame) are just longer frames.
   - **Crossing rule:** when time jumps from t₁ to t₂ (a dropped frame, a 120 Hz panel, or a resume clamped at `maxFrameMs`), every event in (t₁, t₂] fires, in time order, then document order. Events are never tied to drawn frames, so a dropped frame can never skip a hit.

### UI: Basic vs Advanced
- **Basic (zero taps)**
  - The Effect Designer preview board shows the **caster's real attack clip**. This is already the CoS call: use the real sprites when the project has them.
  - The red hit mark **snaps to** `hitAt`.
  - Presets carry sensible `start_on` and `anchor_point` values:
    - Fireball: `release` + `hand`.
    - Slash: `contact` + `tip`.
    - Heal: `cast` + `centre`.
- **Advanced, "Sync" card**
  - **"Starts when: Ability starts · Hand lets go · Weapon hits"** chips (`start_on`).
  - **"Comes from: Tile · Feet · Body · Head · Hand · Weapon tip"** (`anchor_point`).
  - A **"Follows the unit"** toggle (`attach`). When it's on, it shows **"Lets go at the hit"** (`detach`).
- **Frame strip under the scrubber**
  - The caster's clip frames show as a thin strip under the timeline, with event pins.
  - The maker scrubs to a frame and taps **"Hit here"** (48 px). That writes `contact` on that sprite's clip.
  - A one-line notice explains the reach: "Saved to Archer's attack. Every ability using Archer uses it." Undo is available.
  - Sprite Studio's clip row has the same control: one home, two doors.
- **Anchor dot (imported strips)**
  - A 48 px drag handle on an enlarged frame, with 1 px nudge arrows.
  - **"Same spot on all frames"** (as in Construct) and "Copy from previous frame".
  - The dot snaps to whole art px.
  - Recipe sprites show the joint-derived dot read-only, with an "Edit in Sprite Studio" link. Under G8 HOLD this is design only.

### Data fields for the EA
| Field | Where | Shape / range | Default (absent) | Status |
|---|---|---|---|---|
| `clips[].events` | AssetMeta §6.2 | `[{frame: int ≥ 0 < frames.length, name: "release" \| "contact" \| "step" \| "end" \| string ≤ 16}]`, up to 16 per clip | derived (Rec 4) | **needs a CN (DSK)** |
| `clips[].points` | AssetMeta §6.2 | `{hand?, tip?, head?, centre?: ([x, y] \| null)[]}`, one entry per clip frame, whole numbers in frame art px | derived for centre/head; none for hand/tip (they fall back to `centre`) | **needs a CN (DSK)** |
| recipe joint tag `hand` / `tip` → baked `points` | sprite recipe → bake | joint tag | none | **needs a CN (DSK)** (joins EA §7's "recipe → bake anchor and tags" CN) |
| `effect.start_on` | effect §2.10 | `"cast" \| "release" \| "contact"` | `"cast"` (today) | **needs a CN (DSK)** |
| `steps[].anchor_point` | effect step | `"tile" \| "foot" \| "centre" \| "head" \| "hand" \| "tip"` | `"tile"` (today) | **needs a CN (DSK)** |
| `steps[].attach` / `steps[].detach` | effect step | `"spawn" \| "follow"` / `"end" \| "hit"` | `"spawn"` / `"end"` | **needs a CN (DSK)** |
| `hitAt`, runtime events | engine fx (runtime only) | pure function of (ability play, docs) | — | engine call, no CN |

### Tests and acceptance
- **A1, contact timing.** A clip has `ms [100, 100, 60, 200]` and `contact` on frame 2, so contact is at 200 ms. With `start_on: contact` and an at-hit spark, the spark's first drawn tick is at or after 200 ms and before 210 ms (10 ms steps).
- **A2, crossing rule.** One 120 ms frame gap that spans two events fires both, in order. A golden records the event list.
- **A3, mirror.** For a right-facing clip mirrored from the left, `hand` x = `fw − 1 − x_left` on every frame.
- **A4, follow plus hit-stop.** During the freeze, a followed orb draws at the same art px it had at `hitAt`.
- **A5, absent fields (the zero-migration guard).** Every r20 preset's draw list is byte-identical to the one built without step 33's sync fields.
- **A6, preview equals game.** The Effect Designer preview and the runtime draw list hash the same for the same (docs, t). Events fire in preview too, unlike Godot's editor.

---

## 2. Layer order and depth vs sprites and canopy

### Current approach
- **Effects v2 §13.1 order:** stage layers → dim → ground stamps → units → effect air → overlay → HUD.
- **EA §6 contract order:**
  1. Background.
  2. Ground.
  3. Walls.
  4. Ground marks, then effect ground stamps.
  5. The standing band, y-sorted by `(footY, c, kind, z, docOrder)`.
  6. `aboveUnits` canopies, with the see-through op.
  7. The darkness buffer: dim (with lit units punched out), then the moonlit wash, then holes and emissive punches.
  8. Effect air.
  9. Glow (`lighter`).
  10. Flash.
  11. HUD.
- **A conflict is open.** The EA flagged that §13.1's "dim before units" wording clashes with y-sort.
- **The code has a gap.** Today's bands are `base, wash, fxAir, glow, ui`. There is **no** effect-ground band and no flash band yet.
- **`draw_layer`** offers `ground | air | overlay`, labelled "Draw on".

### What the best references do
- **Godot `y_sort_enabled`.** A higher Y draws in front, but only items with the same `z_index` are compared ([CanvasItem](https://docs.godotengine.org/en/stable/classes/class_canvasitem.html)).
- **RPG Maker.** Events sit Below, Same as or Above characters (EUX §A).
- **Top-down action games.** The usual convention is to draw the weapon and its swing **behind the body when the character faces up**, and in front otherwise. Makers typically author it with Construct's per-frame image points or Spine's slot draw order.
- **SpriteCook's loot window.** A glow behind a window should be a **round or elliptical wash**, so the floor still shows through. It should not be a blurred copy of the rectangle ([post](https://www.spritecook.ai/blog/pixel-art-inventory-ui-loot-window)).

### Recommendation
1. **Five "Draw on" places.**
   - **Ground**, as today. Draws under every standing thing.
   - **Behind unit** and **In front of unit** (new). The piece joins the standing band, using its **anchor unit's** sort key with a sub-order of −1 or +1. It hugs that unit, and nothing can slip in between.
   - **Air**, as today. Draws above canopies and darkness.
   - **Screen** (today's overlay). Used for flash.
   - Dim keeps its own slot.
2. **Facing swap.** `depth_by_facing` (on by default) turns In front into Behind while the anchor unit faces N, and back for S, E and W. This is the "sword behind the head when walking away" rule. Behind-unit auras stay behind in every facing.
3. **Ground decal vs air.** Preset defaults put each kind of piece where it belongs:

   | Draw on | Pieces |
   |---|---|
   | Ground | runes, shockwave rings, scorch, dust |
   | Air | orbs, sparks, projectiles, smoke |
   | In front of unit | slash arcs, held glows |
4. **Canopy.**
   - Ground and standing-band pieces draw **under** canopies, which is correct: a fire on a tile under a tree sits under the leaves.
   - Air pieces draw **above** canopies, so the important bits are never hidden.
   - If the maker has turned on the see-through canopy op (step 32, makers only), it also triggers for the length of any effect whose anchor or target cell is under a canopy. That costs one alpha step per prop, which is already in the budget.
5. **Darkness (moonlit wash plus stage dim) vs effect pieces.** This replaces the wording in §13.1 and matches EA §6 step 7.
   - Air pieces draw above the darkness, so they are always fully lit.
   - Ground and standing-band pieces are **punched out of the darkness** by default (`lit: "self"`). This is the emissive punch EA §9 already applies to the playing effect.
   - Pieces with `lit: "scene"` (smoke, dust, rocks, debris) are **not** punched out, so the night darkens them like the ground.
   - In air, `lit: "scene"` pieces use the **paired moonlit picture**, through the same swap map as `createMoonlit()`. The colours stay exactly on the palette, at no runtime cost.
   - Stock pictures carry a default:

     | `lit` | Stock pictures |
     |---|---|
     | `"scene"` | `smoke`, `dust`, `rock` |
     | `"self"` | `orb`, `rune`, `spark`, `blast-star`, `ember` |

### UI
- **Basic:** nothing to set. Presets and stock pictures choose the place and `lit`.
- **Advanced:**
  - "Draw on" gains **Behind unit** and **In front of unit**, plus a **"Swap when facing away"** toggle (on by default).
  - A **"Shaded by night"** toggle sets `lit: scene`. The label is plain, and holding a finger on it flips the preview to moonlit.

### Fields
| Field | Shape | Default | Status |
|---|---|---|---|
| `steps[].draw_layer` new values | add `"behind-unit" \| "front-unit"` | `"air"` (unchanged) | **needs a CN (DSK)** (extends an ACCEPTED field) |
| `steps[].depth_by_facing` | bool | `true` | **needs a CN (DSK)** |
| `steps[].lit` | `"self" \| "scene"` | from the stock picture, else `"self"` (today) | **needs a CN (DSK)** |
| new render bands | `fxGround` (in base, after ground marks); standing-band fx entries; `flash` (after glow) | — | engine (EA), no CN |

### Tests
- **L1. Facing swap.** A unit faces N with a front-unit slash, so the slash draws before the unit sprite. When it faces S, the slash draws after.
- **L2. Canopy.** A unit stands one row behind a tree with a front-unit piece, so the canopy covers both. Air pieces are never covered.
- **L3. Night plus dim.** A `lit:self` ground rune keeps its exact day RGBA (palette closure). A `lit:scene` dust puff matches its moonlit pair.
- **L4. Stable order.** The same input gives the same draw list across 1,000 seeded runs.

---

## 3. Glow and light interplay

### Current approach
- **Step 31 light plan.** One art-res darkness plan with:
  - 6 light bands and 32 alpha steps;
  - `DARK_CAP` 0.72;
  - blue-black `rgba(3,8,26)`;
  - a warm glow fill (`255,176,72`) where band ≥ 4;
  - shadow masks from sight.
- **Hybrid torch dim.** While `dim > 0`, a light's radius halves, and `fullyDark` lights go out.
- **Effects v2 glow.** `lighter` blending for `blend: "add"` (orb, rings, sparks, flash). Budget: ≤ 2 glow layers per effect (QA).
- **Gap.** An effect has **no path to light the world**.
- **SpriteCook rarity and reveal ideas** are in the readthrough (#8).

### What the best references do
- **Celeste** draws its lights onto one small texture ([Noel Berry](https://noelberry.ca/posts/celeste_lighting/)). That is the same idea as our art-res buffer.
- **SpriteCook, stepped light.** Its [normal maps from outline](https://www.spritecook.ai/blog/pixel-art-normal-maps-from-outline) and [shadowcasting torchlight](https://www.spritecook.ai/blog/2d-shadowcasting-torchlight-fog-of-war) posts light in **about six bands** so it stays pixel art. Step 31 already does this.
- **SpriteCook, rarity reveals** ([loot window](https://www.spritecook.ai/blog/pixel-art-inventory-ui-loot-window)):
  - rarity colours are drawn in code;
  - each rarity reveals with more: sparkles, then a growing ring, then a light running around the border, then a **legendary flash used sparingly**;
  - the glow is a round wash, not a blur.
- **Arm, bloom cost (EA §4).** Baked or plane bloom costs under 1 ms, against about 3 ms for post-process bloom. So: no blur bloom.
- **MDN.** `lighter` is a cheap composite operation ([`globalCompositeOperation`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)).

### Recommendation
1. **Effects feed the light plan.**
   - A step may add one light, `{x, y, radius}`, at its anchor for the whole play window (hold and fade included).
   - Two shapes:
     - **steady**: the radius holds.
     - **pop**: the radius steps 0 → R → ⌈R·⅔⌉ → ⌈R·⅓⌉ → 0 over the step, in whole half-tiles. It lights the room like a flash, without a screen flash.
   - The light colour comes from the step's ramp (§4). That needs `Light.colour`, a runtime type the EA owns.
2. **The playing effect's light ignores the dim halving.**
   - The stage dim is usually *caused by* the effect. Step 31's `dim > 0 → radius/2` rule would therefore halve the effect's own light.
   - Effect lights carry `keepInDim`. The engine sets it and never stores it.
   - Torches keep the hybrid rule.
3. **Stepped glow, not soft.**
   - Halos around orbs are **pre-baked stepped glow sprites**: the same 6-band falloff at art res, nearest-scaled, drawn with `lighter`.
   - Large areas of light go through the light plan, not additive sprites.
   - `lighter` stays limited to small cores, rings and sparks. That keeps overdraw low and the base art crisp, and QA's palette check exempts only named ops.
4. **Light holes during dim.** As built in step 31, torch glow drops to half radius. Effect lights keep their full radius.
5. **A flash lights nearby sprites.**
   - At `hitAt`, an Impact flash or big hit may add a pop light (default R = 2 tiles).
   - Units inside it get the glow fill on the overlay, never on their base pixels.
   - The result is "the hit lights up the faces": RPG Maker-style, but it stays on the palette.
6. **Rarity and reveal glow.** A **"Reveal"** preset family, built from existing kinds with no new kind:

   | Tier | What plays |
   |---|---|
   | Common | a sparkle |
   | Rare | plus one ground ring (the §17.2 helper) |
   | Epic | plus a border runner: 2 sparks travelling the item's sprite box, 1 px, on the pose grid |
   | Legendary | plus one soft radial flash and a light pop |

   - Colours come from palette ramps: gold, violet, cyan, green.
   - The round wash is the §13.7 ellipse helper, filled in 3 stepped alpha bands with `lighter`. **No screen blend**: we keep to named ops only.
   - Legendary is the only tier that can count as a flash start. At the default radius it covers under 25%, so it counts 0.
7. **Cost control.**
   - Effect lights are capped at **2 per effect and 4 on screen**.
   - Their position snaps to the plan's `res` grid.
   - The plan is a per-pixel loop, so it must not re-run every tick. It re-plans only when a light's band radius changes, at most every 100 ms (10 Hz).
   - Lite fallback: one effect light, steady only.

### UI
- **Basic:**
  - "Gives light" is on for presets whose picture glows (orb, fire, holy).
  - Reveal is a preset pick, with a **Rarity** chip row (Common / Rare / Epic / Legendary).
- **Advanced:**
  - **"Lights the area"**: off / steady / pop, with a size slider in half-tiles from 0.5 to 6.
  - **"Keeps light in the dim"**: shown read-only ("on for this effect").

### Fields
| Field | Shape / range | Default | Status |
|---|---|---|---|
| `steps[].light` | `"off" \| "steady" \| "pop"` | `"off"` (today) | **needs a CN (DSK)** |
| `steps[].light_radius` | 0.5–6 tiles, step 0.5 | 2 | **needs a CN (DSK)** |
| `steps[].light_ramp` | ramp ref (palette) | the step's tint ramp | **needs a CN (DSK)** |
| `Light.colour`, `Light.keepInDim` | runtime type | — | engine (EA), no CN |
| `te-reveal-*` presets | catalogue presets, rarity variants | — | Librarian/Keeper preset rows, **needs a CN (DSK)** |

### Tests
- **G1. Own light ignores dim halving.** With dim 550‰ and the effect's own light at radius 3 tiles, the plan's lit cells equal the radius-3 set, not 1.5. A torch in the same plan is halved.
- **G2. Pop re-plans are bounded.** A pop light re-plans at most 5 times over its life (0, R, ⅔, ⅓, 0), so the `createLighting` stats count is ≤ 5.
- **G3. Palette closure.** No base pixel changes under a light. Only named overlay ops differ.
- **G4. Reveal is flash-safe.** A legendary Reveal at the default radius gives `flashRisk: false` under `te-flash@2` (or @3, see Q-EA6).

---

## 4. Palette and pixel-snapping consistency

### Current approach
- **Size:** effect sizes snap to whole zoom steps (`scale_snap: whole`). Uploads draw at `k = max(1, round(wanted/source))`. The stock default is ×5 (a 16 px picture on a 64 px tile).
- **Position:** rounds to whole art px (EA §2).
- **Rotation:** quarter turns in Basic, whole degrees in Advanced. §6.7 lists "rotation of pixel art" as still open.
- **Colour:**
  - 9 swatches plus "any colour" hex.
  - `tint_from → tint_to` is a hex ramp over time, so it passes through RGB in-between colours.
  - Stock pictures are tinted in code.
  - Additive `lighter` is used on small cores.
- **Sprites:** 1 px dark-hue outline, 3-step shading, ≤ 16 colours.
- **Colour cycling:** baked into frames (EA §8).

### What the best references do
- **Whole-number scale and positions.**
  - MDN's [Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) says "Avoid floating-point coordinates and use integers". See also [`imageSmoothingEnabled`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled).
  - Unity's [Pixel Perfect Camera](https://docs.unity3d.com/Packages/com.unity.2d.pixel-perfect@5.0/manual/index.html) snaps sprites to the pixel grid and warns against mixing pixel sizes.
- **Rotating pixel art** needs a dedicated algorithm such as RotSprite, or pre-drawn angles ([pixel-art scaling algorithms](https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms)). Rotating with nearest filtering at the scaled-up resolution creates "mixels": pixels smaller than the art pixel.
- **Smears** are 100% opaque, painted in the weapon's two brightest colours ([Wesnoth](https://wiki.wesnoth.org/How_to_create_motion_blurs)).
- **Fixed palette ramps** ([Lospec palettes](https://lospec.com/palette-list)). Pixel Composer's "colour ramp" maps values onto the sprite's own palette ([our note](design-notes/pixel-composer-reference.md)).
- **Colour cycling** changes only the pixels on its list ([EffectGames, Canvas Cycle](https://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html)).
- **Tinted outlines** (SpriteCook outline tools): each outline pixel is a dark shade of the colour next to it ([readthrough #5](design-notes/spritecook-blog-readthrough.md)).

### Recommendation
1. **Ramp-mapped tint (the main palette fix).**
   - Stock effect pictures are authored as **4–5 grey levels**.
   - The tint maps level i to step i of a chosen **project ramp**. It is a lookup, never a multiply.
   - A *tint ramp over time* steps **through ramp colours**: each RGB lerp value snaps to the nearest ramp step, so no off-palette in-betweens appear.
   - Basic swatches are the project's ramps.
   - "Any colour" hex moves to Advanced. It builds a 5-step ramp from the hex, with hue-shifted darker steps as in `sprites.md`. If the result falls outside the project palette, a quiet "Off-palette" chip shows.
   - Additive cores remain the one named exception.
2. **Matched pixel size (revision).**
   - By default an effect's art pixel is the same size as the **caster sprite's** (`pixel_scale: "match-sprite"`), so a spark's pixels match the hero's.
   - Big effects get their size from **procedurally drawn shapes**: the existing helpers draw rings, discs, fans and ellipses at native density at any radius. Stock pictures can also ship at 2–3 sizes. Either way, not from ×5 upscaling.
   - "Chunky ×k" stays as a deliberate style choice in Advanced (CEO Q2).
3. **Rotation at art res only.**
   - Quarter turns are exact flips (Basic).
   - Advanced angles are bucketed to **16 directions (22.5°)**.
   - Each (picture, frame, angle) is rendered once into an art-res cache with nearest filtering, then integer-scaled like any sprite. The EA picks the method; a RotSprite-style pass (3× upscale, rotate, downscale) at cache time is one option.
   - Nothing is ever rotated on the device-res canvas.
   - A moving projectile picks the nearest of 16 buckets (8 in lite).
4. **Particles.**
   - Each particle is a 1, 2 or 3 art px square, or a tiny stock frame. No rotation.
   - Positions come from the clock in integer fixed point (1/256 art px) and are **floored** to art px when drawn.
   - Size changes in whole steps (3 → 2 → 1).
   - Colour steps down the ramp with life (hot to cool), never with alpha. Only the last 2 steps fade, as named alpha steps (0.5, 0.25).
5. **Outline rule (`outline: auto`).**
   - Opaque, non-additive pieces bigger than 6 px (projectiles, rocks, blast stamps) get the project's sprite outline style: 1 px, the ramp's darkest step, or tinted by the neighbouring colour.
   - Glow, additive pieces, particles and smears get **no outline**. Light has no outline.
   - So effects read like the sprites they sit beside.
6. **Colour cycling for effects.** A rune pulse or lava pool cycles 3–4 ramp steps, **baked as frames** (EA §8). These frames count toward the picture's frame cap.
7. **No sub-pixel motion.** A slow piece moves in whole art px on the pose grid (§6), never by smooth fractions. This avoids the "sliding paper" pitfall from the tree-wind guide.

### UI
- **Basic:**
  - **Colour** is a row of project ramp chips (48 px). This adds zero taps, because it replaces the old swatch row.
  - At the default, Size steps say "Matches your sprites".
- **Advanced:**
  - "Any colour…", with the Off-palette chip.
  - **Pixel size:** Match sprites / Chunky ×2 / ×3…
  - **Outline:** Auto / On / Off.
  - **Angle:** whole degrees, with a "snaps to 16 directions" hint.

### Fields
| Field | Shape | Default | Status |
|---|---|---|---|
| `effect.tint_ramp` / `steps[].tint_ramp` | ramp id from the project palette | the effect's colour pick mapped to the nearest ramp | **needs a CN (DSK)** (hex `tint_*` stays, read as "Any colour") |
| `steps[].tint_snap` | `"ramp" \| "rgb"` | `"ramp"` for new docs; **absent = `"rgb"`** (today, so old docs show no visual change) | **needs a CN (DSK)** |
| `effect.pixel_scale` | `"match-sprite" \| int 1–6` | absent = today's `k` rule; new docs `"match-sprite"` | **needs a CN (DSK)**; CEO Q2 |
| `steps[].outline` | `"auto" \| "on" \| "off"` | `"auto"` for new docs; absent = `"off"` (today) | **needs a CN (DSK)** |
| stock pictures as grey-level masters | asset metadata `levels: 4–5` | — | Librarian + **needs a CN (DSK)** |

### Tests
- **P1. Palette closure.** Every non-additive effect pixel is in the project palette, at 1×, 2× and 3×.
- **P2. Run-length.** Every effect art pixel is exactly `s` device px. This extends QA's test to effects.
- **P3. Rotation buckets.** A 30° stamp equals its 22.5° cache entry and is drawn with integer arguments only.
- **P4. No device-res rotation.** The recording backend logs no device-res `rotate()` call for effects.
- **P5. Floor, not round.** A particle at x = 3.996 art px draws at 3. It never draws at 4 in one tick and 3 in the next, so there is no jitter.

---

## 5. Screen shake, hit-stop and flash conventions

### Current approach (accepted, kept)
- **Hit-stop** runs 0–150 ms (chips: 50 / 100 / 150).
  - View-time only. The effect, attacker and victim freeze equally.
  - When freezes overlap, they end at the latest end, capped at 150 ms past the first start.
  - Reduced motion sets it to 0. Reduce flashes on its own caps it at 50.
  - Allowed in timed and RTS modes (CEO F3).
- **Impact flash** is a 3-tile disc (CEO F2/F1).
- **te-flash@2** detector:
  - more than 3 starts in any 1000 ms;
  - a brightness change of ≥10% over ≥25% of a 390×844 screen;
  - plus the bigRed check.
- **Other hit looks:** hit-white for 40–200 ms; a shockwave that grows over max(150, len) ms; a blank-frame punch.
- **`clip_cues`:** a generic 2-frame white hit flash plus a lunge.
- **Screen shake is DEFERRED** (§17).

### What the best references do
- **Shake: Squirrel Eiserloh's trauma model.** From *Juicing Your Cameras With Math* ([GDC Vault](https://www.gdcvault.com/play/1023557/Math-for-Game-Programmers-Juicing)). I read the slides PDF through the search index **[unverified]**.
  - Keep a **trauma** value from 0 to 1. Each hit adds 0.2–0.5, and trauma decays linearly.
  - **Shake = trauma² (or trauma³).**
  - Drive the motion with **smoothed noise, not random values**. Smoothed noise "works with pause and slow-motion" and "is more easily reproducible on replay".
  - In 2D, shake both translation and rotation.
- **Shake: common tuning ranges.** The [Game Dev Cheat Sheet](https://gamedev-cheatsheet.com/concepts/screen-shake/) suggests trauma of 0.1–0.3 for small hits and 0.5–0.8 for explosions, decay of about 1 per second, and a maximum offset of about 1–3% of the view. It says to always offer an off setting.
- **Shake: other voices.**
  - Vlambeer kicks the camera opposite the shot ([Game Developer](https://www.gamedeveloper.com/design/vlambeer-co-founder-shares-advice-on-building-better-action-games), [RPG Playground notes](https://rpgplayground.com/research-making-a-juicy-game/), [talk](https://www.youtube.com/watch?v=AJdEqssNZ-U)).
  - [Juice It or Lose It](https://www.youtube.com/watch?v=Fy0aCDmgnxg) ([summary](https://gdad.wiki/wiki/sources/source-juice-it-or-lose-it)) warns about "freight train" overuse.
  - [Stray Pixels](https://straypixels.net/breakpoint-explosion-breakdown/) says shake hides the other effects.
- **Accessibility.**
  - [Xbox XAG 117](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117): "Avoid the use of camera shake… or provide an option to turn off".
  - [XAG 118](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/118) covers photosensitivity.
  - [Game Accessibility Guidelines, flicker](https://gameaccessibilityguidelines.com/avoid-flickering-images-and-repetitive-patterns/).
  - [WCAG 2.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html): no more than **3 flashes in any 1 s**, or stay below the general and red thresholds. The reference area is **341×256 CSS px = 87,296 px** (a 10° field), and saturated red gets a special test.
  - [WCAG 2.3.3 animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) and [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
  - [Trace PEAT](https://www.trace.umd.edu/peat/) is a flash analyser.
- **Hit-stop.**
  - [Celeste freeze frames](https://celeste.ink/wiki/Freeze_frames) are 3, 6 or 9 frames (50, 100 or 150 ms). Celeste freezes "Madeline, the timer, and all entities". Our view-time rule is deliberately narrower.
  - Sakurai's hitstop column ([Source Gaming](https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/) **[unverified, curl 406]**): both sides freeze for the same time, scaled by weight. In Smash the **victim vibrates while frozen**, which sells the hit without moving the camera.
- **Squash and stretch** keep mass the same ([Saint11 Squash](https://saint11.art/img/pixel-tutorials/Squash.gif)). For the 1 px overshoot, see Slynyrd above.

### Our check against WCAG (a confirmation, not a revision)
- Our rule is 25% of 390×844, which is 82,290 CSS px. WCAG's area is 87,296 CSS px. The two are within 6%, so te-flash@2's area rule already matches the standard.
- We count **starts**: a white flash is 1, the black after it is 2. That is stricter than WCAG's "pair of opposing changes", so it errs on the safe side.
- **Keep it.**

### Recommendation
1. **One stacking rule for every Feel item at the same `hitAt`: take the max, then cap. Never add.**
   - Hit-stop already works this way.
   - Shake uses trauma clamped at 1, as Eiserloh does, so it stays bounded.
   - Flashes are counted by the detector, never capped by the renderer (accepted).
2. **Screen shake: proposed back (CEO Q1)** as a **"Shake"** Feel toggle, off by default.
   - **Strengths:** 1, 2 or 3 = **1, 2 or 3 art px** at peak, lasting **120, 200 or 300 ms**. A finisher can go up to 4 (Advanced).
   - **Curve:** trauma². A hit adds 0.4, 0.7 or 1.0, decaying linearly to 0 over the length.
   - **Motion:** offsets are **whole art px**, sampled from **seeded integer value-noise stepped every 30 ms** (the pose grid), not every frame. It reads as pixel-art crunch and replays exactly.
   - **Direction:** the first sample is biased **along the hit direction**, from caster to target (the Vlambeer kick).
   - **No rotation.** Rotation turns pixel art to mush.
   - **What moves:** only the world camera. Never the HUD, the editor UI or the Effect Designer controls.
   - **View-time only:** it never touches the camera state, the rules or the log.
   - **Mode defaults:** strength 1 in turn-based modes. Timed and RTS modes are also 1, capped by the lag caveat.
3. **Player settings: Screen shake Off / Low / Full.**
   - Low is half strength, floored, so 1 px stays 1 px or becomes 0.
   - Reduced motion forces Off. Reduce flashes does not affect it, because shake is motion, not brightness.
   - It lives in the same accessibility group as `reduce_motion` and `reduce_flashes`.
4. **Hit-stop victim jitter.**
   - While frozen, the victim sprite alternates ±1 art px horizontally every 30 ms. The attacker and the effect stay still.
   - Off under reduced motion.
   - On by default whenever hit-stop is on, so it adds zero taps (CEO Q4). It is a much gentler substitute for shake.
5. **Per-mode hit-stop default.** When the maker turns the toggle on, it starts at **100 ms** in turn-based modes and **50 ms** in timed and RTS modes (because of the A-T1 lag caveat). It is still off by default, and the maker's chip pick overrides it.
6. **Hit flash on the sprite.**
   - `hit_white` stays as accepted, with a new mode, **`bright`**: each pixel moves 2 steps up its own ramp. It stays on the palette and is softer than white.
   - Recommend `bright` as the Reduce flashes default, instead of a plain outline.
   - **No double flash:** when the effect has `hit_white_ms > 0`, the generic `clip_cues` 2-frame white flash is suppressed for that `hitAt`.
7. **Squash and knockback (looks only).**
   - **Squash on hit:** one 60 ms frame, 2 px wider and 2 px shorter (area roughly kept). The bottom is anchored, so the foot stays put. It is nearest-resampled at art res, never fractional.
   - **Knockback `nudge`:** 2 art px away over 60 ms, back over 120 ms, with a 1 px overshoot settle. `knock1` follows the rules' move.
   - All of these are skipped under reduced motion.
8. **Default order at `hitAt` (same tick).**
   1. The hit-stop window opens.
   2. The victim's `hit` clip starts at `effectT`.
   3. Hit-white or bright.
   4. Impact flash white.
   5. Light pop.
   6. Shake trauma is added.
   7. Hit sound cue.
   8. Damage number.

   All of these derive from `hitAt`. None reads wall time.

### UI
- **Basic:** none of this adds a tap. The Feel row gains **Shake** (off by default) next to Hit-stop, Impact flash and the others.
- **Advanced:**
  - **Shake** chips: Light 1 / Medium 2 / Heavy 3, plus "Toward the hit" (on by default).
  - **Hit-stop** chips as accepted, plus **"Target shivers"** (on by default).
  - **Hit-white mode** chips: White / Bright / Tint / Black.
  - **Squash** toggle and **Knockback** picker (already under "Hit (looks only)").
- **Player settings:** **Screen shake Off / Low / Full**. The hub seizure warning is unchanged.

### Fields
| Field | Shape / range | Default | Status |
|---|---|---|---|
| `effect.shake` | int 0–4 art px (UI 0–3; 4 in Advanced) | 0 | **needs a CN (DSK)**; CEO Q1 |
| `effect.shake_ms` | 80–400 | 120 / 200 / 300 by strength | **needs a CN (DSK)** |
| `effect.shake_dir` | `"hit" \| "none"` | `"hit"` | **needs a CN (DSK)** |
| `effect.hit_stop_jitter` | bool | `true` when `hit_stop_ms > 0` | **needs a CN (DSK)**; CEO Q4 |
| `hit_white_mode` new value | add `"bright"` | — | **needs a CN (DSK)** |
| `effect.squash` | bool | false | **needs a CN (DSK)** |
| player `screen_shake` | `"off" \| "low" \| "full"`, in the accessibility group of `btf-hud-settings@1` | `"full"`; reduced motion forces `"off"` | **needs a CN (DSK)** (profile-format) |
| `clip_cues` suppression | runtime rule | — | engine (EA), no CN |

### Tests
- **F1. Shake stays bounded.** Two hits land 40 ms apart, each with shake 2. The peak offset is ≤ 2 art px plus the trauma clamp, every offset is a whole number of art px, and the HUD draw commands do not change.
- **F2. Shake replays.** The same seed and time give the same offsets, and the preview matches the game.
- **F3. Reduced motion.** Shake, jitter, squash and hit-stop are all 0.
- **F4. te-flash@2 parity.** No new field changes `flashRisk` on any r20 preset.
- **F5. No double flash.** With hit-white on, `clip_cues` emits no white frames for that hit.
- **F6. Jitter.** At hit-stop 100 ms, the victim's x alternates ±1 art px in 30 ms steps while the attacker's x stays constant.

---

## 6. Mobile performance

### Current approach
- **Particles (§3.8, §13.3):**
  - a shared pool of 96, with a soft cap of 48 per effect;
  - the oldest particle is dropped first;
  - a seeded visual stream, with clock-based positions.
- **Lite fallback:** decided once, when an effect starts. 30 fps is plausible but not promised.
- **QA budgets (EA §10):**
  - ≤ 300 draws per frame, and 0 draws on an idle frame;
  - overdraw max ≤ 4, mean ≤ 2;
  - particles ≤ 32 per effect and ≤ 128 on screen;
  - ≤ 2 glow layers per effect;
  - heap growth < 1 MiB.
- **Rendering (EA §5):**
  - Canvas2D now, WebGL2 later, behind the same draw list;
  - OffscreenCanvas on the main thread, for caches;
  - render on change, driven by a dirty flag.

### What the best references do
- **MDN, [Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas):**
  - pre-render repeated drawing offscreen;
  - use integer coordinates;
  - layer canvases;
  - avoid `shadowBlur`;
  - use `alpha: false` where possible.
- **web.dev, [canvas performance](https://web.dev/articles/canvas-performance):** batch calls and avoid state changes. The article is older, but the advice still holds.
- **Object pools** avoid garbage-collection spikes ([Nystrom, Object Pool](https://gameprogrammingpatterns.com/object-pool.html)).
- **Fixed-capacity emitters:** [Phaser particles](https://docs.phaser.io/phaser/concepts/gameobjects/particles) and [Godot GPUParticles2D](https://docs.godotengine.org/en/stable/classes/class_gpuparticles2d.html).
- **[Android frame pacing](https://developer.android.com/games/sdk/frame-pacing):** a steady rate is better than a high but uneven one.
- **Browser APIs:** [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) and [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas).

### Recommendation
1. **Particle numbers, reconciled.**
   - Pool: **96**, which is within QA's 128 on screen.
   - Slider cap: **48** per effect.
   - **Every shipped preset uses ≤ 32** particles, QA's per-effect figure. Above 32, the editor shows a quiet "May slow some phones" note.
   - Lite halves the count.
   - The pool is **preallocated typed arrays** (x, y, vx, vy, life, ramp step, size), with zero allocations per tick.
2. **Particles are drawn as batched rects.** Square particles of 1–3 px are grouped by colour into **one path of many `rect()`s, with one `fill()` per colour per band**. That is about 4–6 calls for 48 particles, instead of 48 `drawImage`s. All coordinates are whole device px.
3. **One effect atlas, built at load.**
   - Stock and uploaded effect pictures, plus their ramp-tinted variants and rotation buckets, are rendered into one effect atlas page (≤ 4096).
   - Nothing is tinted or rotated per frame: no `ctx.filter`, no per-frame `source-atop`.
   - The cache key is (picture, frame, ramp, angle bucket, k). Entries are evicted with the stage, through the step-17 dispose.
4. **Draw budget.**
   - Per effect: ≤ **60 draw commands**. All effects on screen: ≤ **120**. Both sit inside the 300 per frame.
   - Additive coverage: ≤ 25% of the screen per effect. Large areas of light go through the light plan instead (§3).
   - A flash is one fill.
   - Mean overdraw inside the fx bands: ≤ 1.5.
5. **A 30 ms pose grid.**
   - Particle and motion steps advance on a **30 ms grid**: 3 engine ticks, about 33 Hz.
   - Stamp frames keep their own `ms`. Hit-stop, flashes and blanks stay exact to the tick.
   - `nextChangeMs` returns the next grid or frame boundary, so the dirty flag skips the frames in between.
   - On a 120 Hz panel, an effect then draws about 33 times a second instead of 120. That saves battery, and it reads as pixel art animated "on twos".
   - Lite uses a 60 ms grid.
6. **Effect light re-plans:** at most 10 Hz and ≤ 2 per effect (§3), within the renderer's p95 of 4 ms.
7. **Lite fallback, decided once at effect start (as accepted).** It triggers on any of:
   - the player's `graphics: lite` setting;
   - the host's measured p95 frame time over the last 60 frames being above 20 ms;
   - `prefers-reduced-motion`, which also forces the reduced-motion rules.

   Lite means: half the particles, additive only on the core and the flash, one steady effect light, 8 rotation buckets and a 60 ms grid. We measure frame time rather than battery, because `navigator.getBattery` is not available on iOS.
8. **Canvas2D vs WebGL (consistent with EA §5).**
   - The effect draw list is backend-neutral: `DrawCmd`, `FillOp` and the rect batch.
   - Canvas2D ships first. A later WebGL2 backend makes additive drawing and particles one batch each, with no format change.
   - Rendering from a worker OffscreenCanvas stays parked.
9. **Frame pacing.**
   - Effects never run their own timer. The host maps rAF to ticks.
   - On resume, time is clamped by `maxFrameMs`. The crossing rule (§1) then fires any missed events once, in order.
   - Particles never replay in a burst, because they are pure functions of t.

### UI
- **Makers:** nothing new beyond the existing notices: "May slow some phones" (> 32 particles, or > 2 lights).
- **Players:** **Graphics: Normal / Lite**. This is an existing idea, kept as is.

### Fields
| Field | Shape | Default | Status |
|---|---|---|---|
| player `graphics` | `"normal" \| "lite"` | `"normal"` | **needs a CN (DSK)** if not already in the accessibility group |
| `fx_pose_ms` | engine constant 30 (lite 60) | — | engine (EA), no CN |

### Tests
- **M1, draw budget.** Recording backend, Astrologer at 390×844 and s = 3: ≤ 60 fx draws a frame, ≤ 300 in total, mean overdraw ≤ 2.0.
- **M2, pooling.** Heap growth stays under 1 MiB over 100 plays of Explosion.
- **M3, pose grid.** On a 120 Hz device, an effect with no stamp-frame changes draws ≤ 34 times a second (pose grid plus dirty flag).
- **M4, lite chosen once.** Flipping `graphics` mid-effect changes nothing until the next effect starts.
- **M5, real phone.** On a mid-range phone with Astrologer, Explosion, 2 effect lights and moonlit on, p95 frame time is ≤ 16.7 ms. 60 fps when possible; 30 fps stays the acceptance floor, as already ruled.

---

## 7. Worked example: "Archer, Fire arrow" in a few taps
1. **Pick the preset.** The maker picks **Fire arrow**. It sets:
   - `start_on: release` and `anchor_point: hand`;
   - a Fly step in air, whose picture rotates through 16 buckets;
   - an ember burst at the hit (≤ 16 particles);
   - a small shockwave on the ground;
   - a 2-tile pop light;
   - hit-stop off.
2. **Check the preview.** It plays the Archer's real `attack-right` clip.
   - The arrow leaves on frame 3, where the library clip has `release`.
   - The red hit mark sits where the arrow meets the foe.
3. **Fix a late release.** The maker feels the release comes too late. In Advanced, they scrub to frame 2, tap **"Hit here"**, then change the pin to **Lets go** using the pin's chip (Contact / Lets go). The change is saved on the Archer's clip.
4. **What happens at night and when facing away.**
   - At night the arrow glows (`lit: self`, plus the light pop), and the smoke after it is shaded by night.
   - Facing N changes nothing, because the arrow draws in air.
5. **Tap count:** three taps in Advanced, zero in Basic.

---

## 8. Whole-approach review: what I'd revise, and why

| # | Area | Before | Revise to | Why |
|---|---|---|---|---|
| R1 | Hit timing | The effect's `connect`, the clip's timing and `clip_cues` each imply their own "hit" | **One `hitAt`** (§1 Rec 3) | An off-beat hit is the most visible sync bug. Each of the three is fine alone and wrong together |
| R2 | Clip ↔ effect | Effects start with the ability and can't see the sprite | **`start_on` release/contact, plus clip events** | Sprites and effects need a shared beat. Spine, GameMaker and RPG Maker all do this |
| R3 | Anchors | Tile `{dc, dr}` from caster/target | **Add per-frame named points and attach/follow** | Hand-cast and weapon-tip effects are impossible today |
| R4 | Draw layers | ground / air / overlay; "dim before units" | **Add behind-unit / front-unit with a facing swap. Pieces are punched out of the darkness unless "shaded by night"** | Y-sort makes "before units" impossible (flagged by the EA). Slashes need depth |
| R5 | Effect light | None. The hybrid torch rule would halve an effect's light during its own dim | **Effect lights in the step 31 plan, with `keepInDim`** | One light system. An effect's dim mustn't dim its own light |
| R6 | Colour | Multiply tint, RGB tint ramps, 9 hex swatches | **Ramp-mapped tint, stepped through the ramp over time; project-ramp swatches; hex moves to Advanced** | RGB blends and multiplies invent colours that aren't in the palette (QA palette closure) |
| R7 | Pixel size | Stock 16 px pictures at ×5 by default, chunky next to 1× sprites | **Match the sprite's pixel size; draw big shapes procedurally** (CEO Q2) | Mixed pixel density is the clearest "amateur" tell in pixel art (Unity Pixel Perfect docs) |
| R8 | Rotation | Whole degrees; listed as "still open" | **16 angle buckets rendered at art res; never rotate at device res** | Closes the §6.7 open item without mixels |
| R9 | Screen shake | DEFERRED | **Proposed: off by default, whole px, trauma², no rotation, player setting Off/Low/Full** (CEO Q1) | The CEO asked for shake conventions, and the accessibility path is well documented (XAG 117) |
| R10 | Double flash | The `clip_cues` white flash and hit-white could both fire | **Suppress `clip_cues` when hit-white is set** | It's the same idea twice |
| R11 | Particle budget | §13.3 says 48/96; QA says 32/128 | **Pool 96, cap 48, presets ≤ 32** | Meets both without inventing a new number |
| R12 | Effect frame rate | Every rAF while an effect plays | **30 ms pose grid, with dirty-flag skips** | Saves battery on 120 Hz panels, and looks more like hand-drawn pixel art |
| R13 | 64 cap wording | effect-designer §5 says "64 frames"; project-format r25 says "64 steps" via `FX_FORMAT.maxFrames` | **EA to name both caps:** ≤ 64 steps (hostile-file guard) **and** ≤ 64 frames per effect picture strip, once strips play | Step 33 will play strips (today only their first frame plays), so the frame cap becomes real (Q-EA1) |
| R14 | Sprite Studio preview | Its own 160 ms timer and a multiply night tint | **Already carried:** one player plus the moonlit derivation. Clip events must preview there too | Same "preview equals game" rule |

**Kept: re-checked, and still the best choice.**
- blast-star as the 6th stock picture.
- The 3-tile Impact disc.
- Hit-stop in timed and RTS modes: view-time only, capped at 150.
- `at-hit`.
- The shockwave minimum of 150.
- te-flash@2, whose area rule matches WCAG within 6%.
- The 96-frame export soft cap.
- The §13.8 single engine frame player.
- moonlit = palette swap + Atmosphere layer. It's now also the path for "shaded by night" pieces.
- Node blocks later. Every new field here is a plain value that maps one-to-one onto a future node input (Event in, Anchor, Ramp, Light, Shake), so no graph is needed now.

---

## 9. EA kit brief for step 33 (concise)

### Scope
The Effects v2 player on the renderer:
- a pure (docs, t) → draw list + fill ops + light entries + runtime events;
- plus the thin painter.

It may split in two (EA §11):
- **33a:** player, bands, anchors, events.
- **33b:** particles, lights, Feel, detector hookup.

Everything lives in fx and the renderer. None of it goes in core, the rules or the log.

### Fields
All of these **need a CN (DSK)**. Absent means today's behaviour, so nothing needs migrating.

**Sprite**
- `clips[].events [{frame, name}]`, at most 16.
- `clips[].points {hand, tip, head, centre}`, per frame, in whole art px.
- Recipe joint tags `hand` / `tip`, baked into points.

**Effect: sync and depth**
- `start_on cast|release|contact`
- `steps[].anchor_point tile|foot|centre|head|hand|tip`
- `attach spawn|follow` and `detach end|hit`
- `draw_layer`, adding `behind-unit|front-unit`
- `depth_by_facing`
- `lit self|scene`

**Effect: light and colour**
- `light off|steady|pop`, `light_radius` 0.5–6, `light_ramp`
- `tint_ramp`, `tint_snap ramp|rgb`
- `pixel_scale match-sprite|1–6`
- `outline auto|on|off`

**Effect: feel**
- `shake` 0–4, `shake_ms` 80–400, `shake_dir`
- `hit_stop_jitter`
- `hit_white_mode`, adding `bright`
- `squash`

**Player:** `screen_shake off|low|full`, `graphics normal|lite`.

**Presets:** Fire arrow, Slash, `te-reveal-*` (rarity).

### Defaults
- `start_on cast`, `anchor_point tile`, `attach spawn`.
- `lit` comes from the stock picture.
- `light off`, `shake 0`.
- Jitter is on whenever hit-stop is on. When hit-stop is enabled, its chip defaults to 100 in turn-based modes and 50 in timed or RTS modes.
- New documents get `tint_snap ramp`, `outline auto` and `pixel_scale match-sprite` (the last pending CEO Q2).

### Events (runtime only)
- Emitted: `clip:event{name}`, `fx:start`, `fx:release`, `fx:hit`, `fx:end`, `fx:loop`.
- `hitAt` takes the first that applies: the effect's hit offset, the clip's `contact`, the lunge peak, the cast start.
- Times are in ms, rounded up to ticks once.
- Crossing rule: every event in (t₁, t₂] fires, in order.

### Ordering
**Bands, back to front:**
1. Background.
2. Ground.
3. Walls.
4. Ground marks.
5. **fxGround**.
6. Standing band: units and props, plus **fx behind/front entries** at the anchor unit's key ± 1, with the facing swap.
7. aboveUnits.
8. Darkness (dim + wash), with **lit:self fx punched out**.
9. **fxAir**.
10. Glow (`lighter`).
11. **Flash**.
12. HUD.

**Within a band:** layer, then start time, then document order (§13.6).

**At `hitAt`:** hit-stop → victim hit clip → hit-white → Impact flash → light pop → shake → sound → number.

**Stacking:** take the max, then cap. Never add. Shake uses a trauma clamp of 1.

### Budgets
- **Particles:** pool 96, ≤ 48 per effect, presets ≤ 32.
- **Draws:** ≤ 60 fx draws per effect, ≤ 120 fx in total, ≤ 300 per frame.
- **Additive:** ≤ 25% of the screen per effect.
- **Effect lights:** ≤ 2 per effect, ≤ 4 on screen, re-planned at ≤ 10 Hz.
- **Pose grid:** 30 ms (lite: 60).
- **Renderer:** p95 ≤ 4 ms. Heap growth < 1 MiB.
- **Lite:** decided once, when the effect starts.

### Acceptance tests
- **A1–A6:** events, anchors, mirror, follow + hit-stop, absent-field byte identity, preview = game.
- **L1–L4:** facing swap, canopy, night punch and paired sheet, stable order.
- **G1–G4:** keepInDim, pop re-plans ≤ 5, palette closure, Reveal flashRisk false.
- **P1–P5:** palette closure, run-length, rotation buckets, no device-res rotate, floor.
- **F1–F6:** integer shake with the HUD untouched, replay, reduced motion, te-flash parity, no double flash, jitter.
- **M1–M5:** draws, heap, pose grid at 120 Hz, lite chosen once, real phone.

### Open questions for the EA (8)
1. **64 cap.** Please confirm ≤ 64 **steps** (`fxTooManyFrames`, the hostile-file guard). Please also add ≤ 64 **frames per effect picture strip** once strips play. One refusal code or two?
2. **`hitAt` in timed/RTS modes.** Rules resolve at command time. Should the HP bar and damage number wait for `hitAt` (view lag ≤ the effect length), or show at once?
3. **Effect lights.** Is it acceptable to add `Light.colour` and `keepInDim` to the step 31 type, with re-plans gated to band-radius changes at ≤ 10 Hz, inside the 4 ms p95?
4. **Standing-band fx.** May fx entries join the sort key `(footY, c, kind, z, docOrder)`, with `kind` ordered fx-behind < unit < fx-front for the anchor unit only? And is the N-facing swap a renderer rule or a draw-list rule?
5. **`lit: scene` pieces in air.** Should they use paired moonlit pictures through the `createMoonlit` swap map, or sample the darkness plan at the anchor cell (one alpha step)? I prefer the paired sheets, because their colours match the palette exactly.
6. **Detector.** Does a light pop of radius ≥ ~2.5 tiles at 64 px (≥ 25% coverage) count as a flash start? If so, is that `te-flash@3`, with @2 frozen? Shake is never a flash.
7. **Pose grid.** Is a 30 ms fx grid with `nextChangeMs` skips compatible with the dirty-flag rule and the 120 Hz done-means (QA note a)?
8. **Rotation cache.** Should the 16 buckets be built at art res with a RotSprite-style pass at cache time (CPU, once), or with plain nearest rotation at art res? And what memory ceiling inside the 160 MB canvas budget?

### Open questions for the CEO (4)
1. **Bring screen shake back** as an off-by-default "Shake" toggle? It would be 1, 2 or 3 px, never move the HUD, give players an Off / Low / Full setting, and be forced off by reduced motion. *Recommended: yes.*
2. **Should effect pixels match the sprites' pixel size by default,** with "Chunky" as a style choice, instead of today's ×5 stock default? *Recommended: yes.*
3. **Should Basic colours come only from the project's palette ramps,** with "Any colour" moving to Advanced? *Recommended: yes.*
4. **Should the target shiver during hit-stop** (1 px, Smash-style), on whenever hit-stop is on? *Recommended: yes.*

---

## Sources (curl-checked 2026-11-13; 200 unless marked)

### Frame events
- [Spine events](https://esotericsoftware.com/spine-events)
- [Spine point attachments](https://esotericsoftware.com/spine-points)
- [GameMaker Sprites (Broadcast Messages)](https://manual.gamemaker.io/monthly/en/The_Asset_Editors/Sprites.htm)
- [GameMaker Broadcast Messages](https://manual.gamemaker.io/monthly/en/The_Asset_Editors/Sequence_Properties/Broadcast_Messages.htm)
- [Unity Animation Events](https://docs.unity3d.com/Manual/script-AnimationWindowEvent.html)
- [Godot animation track types](https://docs.godotengine.org/en/stable/tutorials/animation/animation_track_types.html)
- [RPG Maker MZ animation data](https://rpgmakerofficial.com/product/mz/course/new-anime/settei.html)
- [RPG Maker MV-style animations](https://rpgmakerweb.com/blog/making-mv-style-animations)
- [Dustloop frame data](https://www.dustloop.com/w/Using_Frame_Data)

### Points and pivots
- [Construct 3 Animations Editor](https://www.construct.net/en/make-games/manuals/construct-3/interface/animations-editor) **[403]**
- [Aseprite slices](https://www.aseprite.org/docs/slices/)
- [Aseprite tags](https://www.aseprite.org/docs/tags/)
- [Aseprite CLI](https://www.aseprite.org/docs/cli/)
- [Aseprite forum, per-cel data](https://community.aseprite.org/t/how-to-associate-data-to-each-cel-frame/6307)
- [Aseprite PR #5187](https://github.com/aseprite/aseprite/pull/5187)

### Depth
- [Godot CanvasItem](https://docs.godotengine.org/en/stable/classes/class_canvasitem.html)
- EUX §A and EA §6 (internal)

### Light and glow
- [Celeste lighting (Noel Berry)](https://noelberry.ca/posts/celeste_lighting/)
- [SpriteCook normal maps](https://www.spritecook.ai/blog/pixel-art-normal-maps-from-outline)
- [SpriteCook shadowcasting](https://www.spritecook.ai/blog/2d-shadowcasting-torchlight-fog-of-war)
- [SpriteCook loot window](https://www.spritecook.ai/blog/pixel-art-inventory-ui-loot-window)
- [MDN globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

### Pixel consistency
- [MDN Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [MDN imageSmoothingEnabled](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled)
- [Unity Pixel Perfect Camera](https://docs.unity3d.com/Packages/com.unity.2d.pixel-perfect@5.0/manual/index.html)
- [Pixel-art scaling algorithms (RotSprite)](https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms)
- [Wesnoth motion blurs](https://wiki.wesnoth.org/How_to_create_motion_blurs)
- [Lospec palettes](https://lospec.com/palette-list)
- [EffectGames colour cycling](https://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html)
- [Saint11 tutorials](https://saint11.art/blog/pixel-art-tutorials/)
- [Slynyrd Pixelblog 9](https://www.slynyrd.com/blog/2018/9/8/pixelblog-9-melee-attacks)
- [Slynyrd Pixelblog 53](https://www.slynyrd.com/blog/2024/11/25/pixelblog-53-punches-and-kicks)
- [Slynyrd Pixelblog 31](https://www.slynyrd.com/blog/2020/12/14/pixelblog-31-shmup-sprite-design)

### Feel and accessibility
- Screen shake and juice:
  - [Eiserloh, GDC Vault](https://www.gdcvault.com/play/1023557/Math-for-Game-Programmers-Juicing); slides [PDF](http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Eiserloh_Squirrel_JuicingYourCameras.pdf) **[unverified, curl 500]**
  - [Game Dev Cheat Sheet, screen shake](https://gamedev-cheatsheet.com/concepts/screen-shake/)
  - [Vlambeer, Game Developer](https://www.gamedeveloper.com/design/vlambeer-co-founder-shares-advice-on-building-better-action-games)
  - [RPG Playground notes](https://rpgplayground.com/research-making-a-juicy-game/)
  - [Art of Screenshake talk](https://www.youtube.com/watch?v=AJdEqssNZ-U)
  - [Juice It or Lose It talk](https://www.youtube.com/watch?v=Fy0aCDmgnxg)
  - [gdad.wiki summary](https://gdad.wiki/wiki/sources/source-juice-it-or-lose-it)
  - [Stray Pixels](https://straypixels.net/breakpoint-explosion-breakdown/)
- Hit-stop and squash:
  - [Celeste freeze frames](https://celeste.ink/wiki/Freeze_frames)
  - [Sakurai hitstop](https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/) **[unverified, curl 406]**
  - [Saint11 Squash](https://saint11.art/img/pixel-tutorials/Squash.gif)
  - [Saint11 Impact](https://saint11.art/img/pixel-tutorials/Impact-export.gif)
- Accessibility:
  - [WCAG 2.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
  - [WCAG 2.3.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
  - [XAG 117](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117)
  - [XAG 118](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/118)
  - [GAG flicker](https://gameaccessibilityguidelines.com/avoid-flickering-images-and-repetitive-patterns/)
  - [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
  - [Trace PEAT](https://www.trace.umd.edu/peat/)

### Performance
- [web.dev canvas performance](https://web.dev/articles/canvas-performance)
- [Object pool](https://gameprogrammingpatterns.com/object-pool.html)
- [Phaser particles](https://docs.phaser.io/phaser/concepts/gameobjects/particles)
- [Godot GPUParticles2D](https://docs.godotengine.org/en/stable/classes/class_gpuparticles2d.html)
- [Android frame pacing](https://developer.android.com/games/sdk/frame-pacing)
- [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [MDN OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)

### Dropped
Two guessed URLs returned 404 and were removed: the Aseprite user-data page, and the RPG Maker MZ help page (the official course page above replaces it).

## 10. EA answers (2026-11-13 18:33 London)

The EA plans to build in two parts: 33a covers the player, bands, anchors and events, and 33b covers particles, lights, Feel and the detector. Each part is 150–400 lines, and work starts once the CEO's 4 answers come back through CoS.

1. **64 cap:** both apply, at most 64 steps and at most 64 frames per picture strip. There is one refusal code, and its detail names the subject (steps or strip). DSK owns the final name. This stays separate from motionTooLarge, which is the CN-012 motion atlas.
2. **hitAt:** in every mode the view waits for hitAt, which covers the HP bar, the damage number and the death clip. Rules and the log commit at command time. View lag is capped at min(effect length, 500 ms). If instant RTS numbers are ever wanted, that's one renderer constant.
3. **Lights:** `colour` already exists (CN-010). `keepInDim` is runtime-only, like fullyDark. Re-plans happen at most 10 times a second, with at most 4 fx lights on screen. 33b gets a budget test: the 4 ms p95 holds only with the s34 dirty-box repaint, or with pops at most 10 times a second (the full repaint is about 3.3 ms at res 4).
4. **Bands:** the sort key is (footY, c, kind, z, docOrder), with fx-behind < unit < fx-front, for the anchor unit only. The N-facing swap is a draw-list rule.
5. **Night shading:** use the moonlit pairs through createMoonlit first. When there's no pair, sample the darkness at the anchor cell and apply one stepped alpha.
6. **Detector:** a light pop covering 25% or more of the screen counts as a flash start. The detector becomes te-flash@3, with @2 frozen for old replays. Shake never counts as a flash.
7. **Pose grid:** 30 ms, or 60 ms in lite. A frame is marked dirty when the soonest nextChangeMs across fx, motion and lights is reached, and that value must be the minimum over all of those sources.
8. **Rotation cache:** a RotSprite-style pass at art resolution, run once per picture and angle bucket on the CPU, with nearest rotation in lite. It has a 16 MB ceiling with LRU eviction, inside the 160 MB canvas budget and shared with the s32 light canvases.

The EA will send the field list to DSK as CNs with the kit.
