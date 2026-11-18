# Effect Designer v3: a short UX view for the step after 34b

Owner: Editor & UX Designer · 2026-11-15 03:1x Europe/London · status: EARLY INPUT for the Engine Architect (not a spec, no build).
Asked by: the EA, after the CEO's order of 2026-11-15 03:02 (via CoS): the Effect Designer (core-5 tool) comes after 34b, on top of the step 33 live effects.
Builds on, and does not repeat: [`effect-designer.md`](effect-designer.md) (r3 screens, §3 flow, §4 knob map, §5 64-frame cap), [`effects-v2-plan.md`](effects-v2-plan.md) (§3.7 compact top strip and scrub, §5 timeline, §6 Reduce flashes, §16 Impact flash, §17 Feel tricks), [`effects-sprite-sync.md`](effects-sprite-sync.md) (§1 sync UI, §7 worked example, §9 kit brief, §10 EA answers), [`renderer-research-ux.md`](renderer-research-ux.md) (§6 tool habits, §7 mobile preview panel), and what step 33 shipped (`docs/core-spine-slices.md`: 33a player, 33h host hookup, 33i motion, 33b-1 Feel and shake, 33b-2 light and colour, 33b-3 particles and outline).

## 0. The short version

The engine can now do far more than the r3 designer shows: frame events, anchors, behind/front bands, particles, lights, Feel and shake. The risk is that the editor grows into a wall of knobs. My view is that v3 should stay **preset-first and result-first**: say what you want ("a slash", "fire"), see it play on your own unit on a real grid patch, and save. The step timeline stays, but only in Advanced. Everything new from step 33 arrives pre-set inside presets, so Basic gains no taps.

One finding matters before any build: **the project palette has no fire, ice or holy ramp.** The six ramp keys are `grass`, `dirt`, `stone`, `rock`, `water` and `bloom` (project-format §8 `ramps`, setup-format §2.10.3.2). "Basic uses palette-ramp colours only" (CEO) therefore cannot make a fire slash today. See §5 risk 1 and the open questions.

## 1. The core editing flow

### 1.1 From "I want a fire slash" to a saved effect

The user usually starts from an ability, because that is where the need shows up. The flow reuses r3's screens (effect-designer §3) and adds one filter row and a better preview.

1. On the ability's **Effect** row, tap **Design new** (r3 §3 step 7). The banner reads "Designing for Cleave".
2. A **"What is it?"** chip row sits above the preset grid: Slash · Shot · Burst · Aura · Heal · Buff · Ground. One tap filters the grid. The ability's own kind pre-selects a chip when it is obvious (a melee ability opens on Slash), so this is often zero taps.
3. A **colour** chip row offers the project's ramps (and, if the CEO agrees, the effect ramps from §5 risk 1). Tapping one recolours every tile in the grid at once, so the user picks a look already in their colour.
4. Tap a tile, for example **Slash arc**. It plays big in the compact top strip (effects-v2 §3.7) on the caster's real attack clip.
5. Tap **Save & use** (r3 §3 step 6; one compound action, one undo).

That is three taps when the chips are pre-selected (Design new, the tile, Save & use) and five at most. It matches the r3 Simple screen and the sync §7 promise of zero Basic taps for sync.

The "What is it?" chips and the colour row are editor filters over catalogue preset metadata. They store nothing in the effect document. Preset intent tags are a Librarian catalogue entry, not a DSK field. The chosen colour is written as the existing `tint_ramp` (CN-015).

### 1.2 The preview is a patch of the real game

The preview is the strongest teacher in every tool I checked (§6). For TileEngine it should be a small slice of the game, drawn by the same built bundle (effects-v2 §13.8, `fx-live.ts`), not a booth mock. The booth export already drops every §2.10.3 field (`boothDropsV2`, setup-format §2.10.3), so it cannot show step 33 work.

- **Board:** the effect's own preview board (`booth_*`), default 3 × 2 for slashes and shots, 5 × 4 for big ground looks (effects-v2 §3.7). It shows the project's real tiles under the units and the caster's real clip with its events.
- **Hit mark:** the red mark snaps to `hitAt` (sync §1). The victim's hit-white, hit-stop, shiver, flash, shake and light pop all fire on it in the preview, exactly as in play.
- **Check buttons, one row of 48 px chips under the strip:** **Turn** (rotates the caster through its four facings, so the behind/front band swap is visible), **Night** (draws through the real light and moonlit path, so effect lights and "shaded by night" show), and **1× / 2× / 3×** (crisp check, renderer-research §7). Turn needs a preview unit with facing; booth pieces have none today (effect-designer §5). That is an editor-only preview state, no doc field.
- **Shake stays inside the strip.** The preview strip shakes, the editor chrome never does (the HUD-never-shakes rule). The preview honours the user's own Reduce motion and Shake setting.
- **Layout is unchanged:** thin top bar, compact top strip, scrolling body, 6-tool bottom rail. The strip does not become the main canvas (effects-v2 §3.7, CEO Q1). Any sheet stays at 40% or less.

### 1.3 Where the timeline lives

Basic has no timeline, only Replay and ½×/1×. Advanced keeps effects-v2 §3.7 as accepted: a scrub bar with overlapping step blocks coloured by kind, the red hit mark, and the caster's frame strip with event pins under it (sync §1, "Hit here"). Tapping a block opens that step's card. This is the RPG Maker and Aseprite lesson (§6): a frame-and-event timeline is the right model for timing, but it belongs to the people who want it.

## 2. Basic vs Advanced

**Basic (no new taps).** The r3 Simple controls stay (effect-designer §4): Name, Picture, Colour, Speed and Count shortcuts, Size, Hit flash. Three things change.

- **Colour** becomes ramp chips only (`tint_ramp`, CEO ruling). Hex and "Any colour" move to Advanced (sync R6). New documents write `tint_snap: "ramp"` and `pixel_scale: "match-sprite"` (Rule N, setup-format §2.10.3), so a Basic user gets crisp, palette-safe pixels without seeing either word.
- **One optional "Punch" toggle** sits after Hit flash. On, it writes `hit_stop_ms` 50, hit-white and `squash`; shake stays 0 unless the user raises it in Advanced, because shake is off by default (CEO Q1). Off by default, so it adds zero taps.
- **A budget line** reads "Particles 24 of 48" in quiet text under the preview when the effect has particles. Shipped presets stay at 32 or fewer (QA figure, sync §10). It is a line, not a warning box.

**Advanced (cards, collapsed, in this order).**
1. **Sync:** Starts when (`start_on`), Comes from (`anchor_point`), Follows the unit (`attach` / `detach`). Sync §1 wording.
2. **Steps:** the 12-step overlapping timeline (effects-v2 §5) and one card per step, with the r3 per-kind fields. The 64-step and 64-frame refusals (sync §10.1) show as the r3 greyed add button.
3. **Draw on:** Ground · Behind unit · Air · In front of unit · Screen (`draw_layer`, `depth_by_facing`).
4. **Particles:** motion (burst, attract, spiral-in, rise), count, life, pull (CN-017).
5. **Light:** Off · Steady · Pop, radius in tiles, light ramp (CN-015). A note appears when a pop is big enough to count as a flash under te-flash@3.
6. **Look:** outline, Any colour (`tint_snap: "rgb"`), pixel size 1–6, glow, spin, trail.
7. **Feel:** hit-stop chips 50/100/150, hit-white mode and target, squash, shake 0–3 with direction (§17, CN-015). The Impact flash disc stays 3 tiles by default (§16) and blast-star stays the 6th stock picture (§17.1).
8. **Preview board, Library tags, Timing & sound:** as r3.

## 3. Top 5 to build first

1. **Intent and colour chips over a live preset grid.** Results first: most users should finish here, and every tool that people call easy (Juice FX, Particles Editor, PHOSPHOR) leads with presets.
2. **The preview as a real game patch on the shared player,** with hit mark on `hitAt`, real clips and tiles, and Turn / Night / 1×–3× chips. Without it, bands, lights and sync are invisible and the step 33 work cannot be judged.
3. **Ramp-only Basic colour with matched pixel size by default.** It keeps every effect crisp and in palette with no settings, which is the CEO's ruling and the clearest "pro" signal in pixel art (sync R7).
4. **The Punch toggle and the Feel card.** Hit-stop, hit-white, squash and shake are cheap, already shipped in 33b-1 and 33b-3, and are what makes an effect feel strong.
5. **The Advanced scrub timeline with the frame strip and "Hit here".** Timing fixes are the most common reason to leave Basic (sync §7 step 3), and the fields exist.

## 4. Defer

- **Node mode** (Pixel Composer reference), already parked by the CEO (effects-v2 §18).
- **Per-parameter curves** like Effekseer's F-curves or Unity's over-lifetime curves. Our look ramps (from/to plus ease) cover the common cases.
- **Per-frame cell placement** like the RPG Maker MV editor (up to 16 cells a frame). Too fiddly on a phone; motion steps do the job.
- **Physics beyond the four particle motions** (gravity, bounce, vortex, collisions) and drawn particle paths.
- **Standalone effect export** (GIF, sheets; effects-v2 §8, accepted). It waits until the designer runs on the shared player.
- **Smear, shine and blank-punch controls** (§17.3, §17.5, §17.7) beyond the presets that use them.
- **Onion skin** on the frame strip and drag-to-scrub on the frame strip itself (renderer-research §7 already marks onion skin Advanced).
- **Sound picking.** The preview stays silent until the sound panel lands.

## 5. Risks

1. **Basic cannot make fire, ice or holy looks.** The project ramps are terrain ramps (`grass`, `dirt`, `stone`, `rock`, `water`, `bloom`). The ashroad `bloom` ramp is yellow, off-white, pink and near-black. A fix would be a small set of effect ramps in each paint style (for example `fire`, `frost`, `holy`, `venom`), drawn to sit with that style. That **needs a CN (DSK)** and art work, and it needs the CEO's word, because it widens "palette only".
2. **Preview drift.** If the designer previews through the booth or a mock, users tune an effect that plays differently in game. The designer must call the same `fx-live` path (effects-v2 §13.8). The preview also needs a facing-capable stand-in unit for Turn.
3. **"Hit here" edits the sprite, not the effect.** It writes `clips[].events` on the sprite's AssetMeta, so every ability using that sprite changes (sync §1 notice). Sprites are parked at v7 with G8 HOLD. This is a data write, not sprite code, but it needs a clear yes before it ships.
4. **Phone cost of the preview loop.** A looping preview with particles, lights and Feel runs all the time while editing. It must use the 30 ms pose grid, the 34a auto-lite and the 4 ms p95 budget, and it should pause when the strip scrolls out of view.
5. **Creep towards the "Isberg Labs" feel.** Step 33 added around 20 effect and step fields (CN-014, CN-015, CN-017). If they all show at once the editor becomes a code wall. The guard is the card order in §2, collapsed by default, and the rule that a preset sets them all.
6. **Flashes and motion in a loop.** A looping preview repeats flashes, pops and shake. The preview must follow the user's Reduce flashes and Reduce motion, and shipped presets must pass te-flash@3 at default settings.

## 6. Research

All pages were opened on 2026-11-15 with WebSearch or WebFetch. I list only what the pages say. Anything not on a page is marked unverified.

- **RPG Maker MV animation editor** ([MV help, Animation Settings](https://rpgmakerofficial.com/product/MV_Help/page/01_08_09.html)). Good: a frame list with cells, **Tween** between two frames, **Batch** and **Shift** for many cells, **Change Target** to preview on different enemies, Position Head/Center/Feet/Screen, and an "SE and Flash Timing" list with flash on Target, Screen or Hide Target. Bad for us: up to 200 frames and 16 cells a frame placed by hand with right-click menus and double-clicks, which does not translate to touch. Take: the frame-event list and Position = our events and anchors; preview on your real target.
- **RPG Maker MZ and Effekseer** ([official blog, MV-style animations in MZ 1.4.0](https://rpgmakerweb.com/blog/making-mv-style-animations); [forum thread](https://forums.rpgmakerweb.com/threads/custom-2-d-attack-animations.178567/)). MZ's default animations use Effekseer, and the blog says it "can be tough to get used to". The 1.4.0 update added back the MV cell editor via "Create MV-compatible data". On the forum, one user says they "resisted Effekseer for a while because it seemed so complicated" until a YouTube tutorial. Take: a powerful external particle tool pushed users away; a simple sheet-and-timing editor was restored. That is exactly the "needs a YouTube guide" failure we avoid.
- **Effekseer** ([site](https://effekseer.github.io/en/), [tool reference](https://effekseer.github.io/Help_Tool/en/ToolReference/index.html), [F-curve](https://effekseer.github.io/Helps/18x/Tool/en/ToolReference/fcurve.html)). Good: free and open source; a parent-child node tree where child particles spawn relative to parents; F-curves on a 0–100 particle-life timeline or on absolute frames; 2D sheet export. Bad: about 20 parameter windows, dockable desktop panes, frames at 60 a second. Take: parent-child spawning is what our steps plus `at-hit` already give; skip curves for now.
- **Aseprite** ([tags docs](https://aseprite.cosmolau.top/docs/tags), [Tag API](https://aseprite.org/api/tag)). Good: named tags over frame ranges with Forward, Reverse and Ping-pong, per-tag repeats, per-frame durations. (The tags doc link is a mirror; the official API page confirms the same properties.) Take: name a range, set its direction and repeats; our clip events are the same idea at a single frame.
- **Pixel Composer** ([VFX Spawner node](https://docs.pixel-composer.com/nodes/particle/vfx/main/vfx_spawner.html)). Good: one Spawner exposes sprite, spawn timing, lifespan, direction, colour on spawn, colour by palette index, colour over lifetime, path following, physics, ground bounce and wiggles, with On Create / On Step / On Destroy outputs. Bad for a phone: it is a node graph. Take: "colour by palette index" supports our ramp-only rule; the event outputs map to future node blocks.
- **Unity 2D particles** ([module reference](https://docs.unity3d.com/Manual/ParticleSystemModules.html), [Color over Lifetime](https://docs.unity.com/en-us/engine/6000.0/manual/visual-effects/particle-systems/particle-system-modules/part-sys-color-over-life-module)). Good: modules you switch on one by one (Main, Emission, Shape, Color over Lifetime and more). Bad: Start Color and Color over Lifetime multiply per channel, which invents off-palette colours (sync R6). Take: switch-on modules = our collapsed cards.
- **Godot 2D particles** ([2D particle systems](https://docs.godotengine.org/en/stable/tutorials/2d/particle_systems_2d.html)). Good: plain controls such as Lifetime, One Shot, Explosiveness (0 = steady, 1 = all at once), Randomness, and **Fixed FPS** to render particles at a low frame rate. Take: Explosiveness is a good plain slider name, and Fixed FPS confirms our 30 ms pose grid idea.
- **Pixel FX Designer, CodeManu** ([itch page](https://codemanu.itch.io/particle-fx-designer), [docs](https://codemanu.itch.io/pixel-fx-designer-documentation)). Good: palette import up to 256 colours, the option to **ignore palette colours** (for example drop blues for fire), custom dithering, seamless loops, back/front particle layers, an **import reference** image to see the effect over your game art, Basic/Motion/Timeline tabs. Bad: desktop only; the docs warn long PNG exports can crash low-VRAM GPUs and GIF export is experimental. Take: "ignore colours" is a neat way to keep fire inside a palette; the reference image is our real-sprite preview.
- **Juice FX, CodeManu** ([itch page](https://codemanu.itch.io/juicefx)). Good: presets for "quick results", flash, scale, skew, shake, wobble, outline, Pixel Art vs HD mode, save your own presets. v2 beta added a node graph ([devlog](https://codemanu.itch.io/juicefx/devlog/422445/juice-fx-v2000beta-released)). Bad: Windows only. Take: preset-first plus a small set of named juice moves is the same shape as our Punch toggle. The Steam pages for both tools say a newer tool, SpriteMancer, covers most of their features; I did not open it (unverified).
- **Phone-friendly makers.** [Particles Editor (glideengine)](https://glideengine.itch.io/particles-editor) is the closest: iOS and Mac, templates, layers, importing your own game assets to preview against, pixelate on render, PNG export. A user comment asks for an export frame-rate option. [PHOSPHOR VFX](https://sinopskyd.itch.io/phosphor) is a free browser pixel VFX tool with 72 presets, palette lock and deterministic renders, but its page says "Phones aren't supported". I found no phone-first tool that ties effects to a character's attack frames. That looks like an open gap TileEngine can own (a judgement, not a measured fact).

**What the research says overall.** Tools people call easy lead with presets and a preview over your own art. Tools people call hard lead with nodes, curves and many panes. Only the RPG Maker editor ties effects to the target, and only through a flash-and-sound list. None put the effect on the attacker's frame events, which step 33 now does.

## 7. Open questions

**For the EA**
1. Can the designer preview run `fx-live` inside the compact strip with a facing-capable stand-in unit, with shake clipped to the strip and paused when it scrolls off screen?
2. Effect ramps (`fire`, `frost`, `holy`, `venom` per paint style): would you rather add them as extra `ramps` keys (needs a CN (DSK)), or resolve them from the style's existing colours?
3. Preset intent tags for the "What is it?" chips: is a Librarian catalogue field enough, or do you want them in the effect document (needs a CN (DSK))?

**For the CEO**
4. Basic colour: may Basic offer a few effect ramps (fire, frost, holy, venom) next to the project's six, drawn to fit each style? Without them a Basic fire slash isn't possible.
5. Under G8 HOLD, may "Hit here" in the Effect Designer write the attack frame onto the sprite's clip (a data change, not sprite code), or should it stay effect-only until Sprite Studio unparks?

## EA first answers (2026-11-15 03:09, final with the post-34b scope)
1. fx-live in the strip: yes. The driver renders to any canvas, so the strip is a small editor-host canvas with a 4-facing stand-in unit. Shake is a draw offset inside that canvas, so it is clipped by construction and the HUD never shakes. Pause-off-screen lives in the editor host (IntersectionObserver plus pausing the driver), not in core.
2. Effect ramps: EA leans towards named effect ramps (fire, frost, holy, venom) as new palette `ramps` keys, which needs a CN (DSK). Pulling from style colours would break the Basic = palette-ramp rule. Waits on the CEO's answer to Q4.
3. Chip tag: ~~an optional `tags` field, needs a CN (DSK)~~. Corrected 2026-11-15 06:17 (EA): `effect.tags` already exists (since catalogue rev 8): a list of `{id, label}`, at most 4 items, labels up to 16 characters, indexed in `index.effects[].tags`. The chips read and write it, so no CN is needed. Words like fire, slash and heal are an editor suggestion list, not a fixed set. Four tags per effect is enough for the 7 chips, because an effect carries one or two. Raising `max_items` would be an L-request to DSK, and none is needed now.
The EA folds the top 5 into the Effect Designer scope after 34b.

## CEO rulings (2026-11-15)
- **03:11, Q4: yes.** Basic offers effect ramps (fire, frost, holy, venom) on top of the six terrain ramps, as new palette `ramps` keys (needs a CN (DSK), per the EA).
- **03:17, Q5: effect-only.** The Advanced "Hit here" marker stays inside the effect. Nothing is written to the sprite clip while G8 HOLD stands.
- **03:14, order:** after 34b comes the group diagnosis and polish, then the Effect Designer, then game types. This view rests until then.
