# Effects v2 (plan only; build after H2)

Source: the @mozza_dev Astrologer clip, researched on the web. Full spec `ux/effects-v2-plan.md`; data format setup-format r20 §2.10.2 (ACCEPTED).

## CEO decisions
- Current preview layout stays. GIF is the default preview.
- No flash cap for makers; Astrologer preset uses one soft flash; players get Reduce flashes; a flash_risk detector (te-flash@2) shows a seizure warning before hub games load.
- 12 overlapping steps; Ground size up to 8 tiles; own-art Astrologer preset.
- Feel tricks (16:43): blast-star is the 6th stock picture; Impact flash disc stays 3 tiles; hit-stop allowed in timed and RTS modes.

## Rules worth remembering
- Hit-stop is view-time only (never game clock, log or rules); freezes effect, attacker and victim equally; overlaps end at the latest end, capped 150ms past first start; reduced motion 0, Reduce flashes caps 50.
- New start mode at-hit (hit + start_at_ms), falls back to after-last with a warning.
- fade_out runs after the hold. Shockwave grows over max(150, len) ms. A blank hides only this effect's other steps.

## 2026-11-13 18:2x London: effects ↔ sprites sync (step 33 base)
- **The ask.** CEO order 18:15, via CoS, a milestone leap: before the EA writes the step 33 Effects v2 player kit, give effects a strong base that stays in step with sprites. The full write-up and the EA brief are in [`../effects-sprite-sync.md`](../effects-sprite-sync.md).
- **What changed (all plan only; each new field needs a CN (DSK)):**
  - **One hit moment (`hitAt`).** The attacker's contact frame, the effect's `connect`, the victim's hit, hit-white, hit-stop, the flash, shake, the light pop and the hit sound all key off one time.
  - **Sprite clips carry frame events.** The events are `release`, `contact`, `step` and `end`, and an effect can start on one (`start_on`).
  - **Named anchor points per frame.** `foot`, `centre`, `head`, `hand` and `tip`, mirrored with facing. Effect pieces can follow a point or spawn at it.
  - **Two new depth layers.** "Behind unit" and "In front of unit" sort with that unit and swap when it faces N.
  - **Effects light the world.** Effect light runs through the step 31 light plan, at full radius during the effect's own dim.
  - **Palette-safe colour.** Tints map to the project ramps, ramps step through ramp colours, and smoke can be "shaded by night".
  - **Matched pixel size, art-res rotation.** Effect pixels match the sprite's pixel size. Rotation uses 16 buckets drawn at art resolution.
  - **30 ms pose grid.** Effects animate on it, which saves battery on 120 Hz screens.
  - **Shake proposed, with victim jitter.** Screen shake is proposed (whole pixels, trauma², no rotation; players get Off/Low/Full). The hit-stop victim jitter adds 1 px.
- **Revised:**
  - Screen shake: DEFERRED → proposed (CEO Q1).
  - §13.1 "dim before units" → effect pieces punched out of the darkness.
  - Multiply and RGB tint ramps → ramp-stepped tints.
  - ×5 chunky default → matched pixel size (CEO Q2).
  - `clip_cues` no longer double-flashes alongside hit-white.
  - Particles: QA's figures and §13.3's reconciled to pool 96, cap 48, presets ≤ 32.
  - 64 cap: the EA is asked to name both the steps cap and the frames cap.
- **Kept after a re-check:** every §2.10.2 Feel decision, the 64/96 caps, the §13.8 single frame player, and moonlit (palette swap + Atmosphere). te-flash@2's 25% area is 82,290 CSS px, within 6% of WCAG's 87,296, so the detector already matches the standard.
- **Why.** Spine, GameMaker, Unity, Godot and RPG Maker all put events on animation frames. Construct, Spine and Aseprite all put named points on frames. Eiserloh's shake model is trauma². XAG 117 asks for a shake off-switch.
