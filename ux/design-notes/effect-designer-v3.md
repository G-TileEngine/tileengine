# Effect Designer v3: layers, beats and merge (clickable mock)

Round: mock r1 · 2026-11-16 01:1x–02:0x Europe/London · Editor & UX Designer · status: MOCK for review (no engine code, nothing pushed).
Asked by the CEO (2026-11-16, "Can begin now"), relayed via the Editor & UX Designer. It builds on UX v3 ([`../effect-designer-v3-ux.md`](../effect-designer-v3-ux.md)), the EA's scope draft (`share/effect-designer/scope.md`, rulings a–e) and the CEO's 20:30 and 01:17 orders.
Prototype: `ui-shell/mock-effects-v3/` (open `index.html` from file://). Shots: `ui-shell/mock-effects-v3/shots/`.

## What was built
A self-contained phone mock, also laid out for tablet and PC, with a live pixel preview that really animates every layer. Merge, dice, house style and every experiment visibly change it.
- **Basic is unchanged and adds zero taps.** The path is still: "What is it?" chip (Slash pre-picked from Cleave), then a preset card, then **Save & use** (3 taps). The grid shows matching presets first, then "Other effects · blend or take parts from these", so merging partners are always in reach without changing the filter.
- **Layer strip (UX-L1).** Six chips under the preview: Shape, Colour, Sparks, Light, Punch, Trail. Tapping one opens a sheet of at most 40% with only that layer's 2–3 sliders, plus **Take from…**, **Roll this layer** and **Shelf it**.
- **Budget meter (EA steer, CEO 01:17).** One quiet line under the strip reads "Particles 20 of 48 · Draws 29 of 60". When an effect goes over, the line turns amber, names the overflow and shows **Fit to budget**. Fit follows merge rule 4: particles scale pro rata to ≤48 (≤32 for presets) and are never cut by step; lights keep the 2 largest; if more than 12 steps play, lowest-weight Linger steps drop first, then trail, then spread; a side’s last step in a beat is never removed; ties drop from the non-base side first. After a fit, one line says exactly what was trimmed (e.g. "Trimmed 2 linger steps, trail by 2 to fit") with Undo. Trims are never silent, and Save & use refuses while over and offers Fit.
- **Beat row (UX-L2, Advanced only).** Cast · Travel · Hit · Linger, with a playhead fill. Tap a beat to take it from another effect, nudge it ±30 ms, start the effect there, or **Tap the rhythm**. Travel shows a still dotted path and the caption **"Travel arrives in a later update"** (EA ruling e).
- **Merge by drag (UX-L3).** Hold a card for 0.4 s and drag it onto another; the target says "Drop to blend". The result is a **Blend card** in the grid plus a sheet:
  - The card dropped onto is **A, the base, and owns the Hit**. One-tap **⇄ Swap** makes the other side the base.
  - **Mix** snaps to 0/25/50/75/100.
  - Each layer (or, switched, each beat) is set to **A / B / Both**, and layer chips carry a tiny **A**, **B** or **A+B** badge for the side that won.
  - Element reactions show as a suggestion ("Fire + Frost often makes Steam · Try Steam").
  - Tap alternatives exist for everything: ⋯ → Blend with…, hold → Blend into current, and Shift+F10 on a focused card.
- **Take a part (UX-L4).** Hold any card and release to get **Take its sparks / colour / motion / timing**, **Blend into current** or **Shelf it**. A taken or blended layer keeps an origin chip with three states: **"from Fireball"**, **"Fireball changed · Update?"** (an amber dot on the layer chip; one tap pulls the change, one Undo) and **"source removed"** (it keeps its copy). There is no live inheritance (EA ruling a).
- **Shelf (UX-L5).** Effects and single layers, "6 of 48 · this project". Liking is not using: tap an item, then **Give … to** an ability slot, or add a shelved layer to the current effect. A shelf row sits above the library (scope §4.4).
- **Dice (UX-L6).** 🎲 in the preview rerolls the selected layer (or all layers) within bounds from a per-effect seed. The history row shows the last 6 rolls as small live thumbnails, labelled "last 6 rolls · on this device" (EA ruling b). Tap one to step back.
- **House style (UX-L7).** Ramp family (As made, Ember court, Moonlit, Wild), pixel size (Match or Chunky), Punch (As made or 0–3) and Motes. Copy: "this project's editor defaults … a value you set yourself is never changed" (EA ruling c). Grid thumbnails restyle at once; the current effect keeps the layers the maker touched.
- **Lab (CEO 01:17 bold ideas).** Ten ideas, each with its own tag (first / next / stretch / later) and a **live budget pill** computed for the current effect. **Breed** shows 6 children, 3 at a time: one plays, two hold a still frame, tap to play, swipe or Next 3, each flagged Fits or Over. **Combo fusion** shows a ready-made fused look swapping in, not a live blend (EA ruling d). **Living linger** is labelled "visual only". **Tiers** has Lv1/2/3. **Export** has an 8-frame sheet and an **Export clean** toggle that drops the "from" links. **World-aware linger** and **Draw the spell** are marked *later*.

## Experiments and their budget (CEO clarification: bold ideas, not breaking the engine)
These are mock cost-model numbers: particles of 48 and draws of 60 per effect. The meter flags any over and Fit trims sparks first, then linger steps, then spread tiles, then trail. The real counts must come from `fx-live` (`capCounts`, `FX_BUDGET`).

| Experiment | Tested on | Before → with it | Fits? | Fit result |
|---|---|---|---|---|
| Merge, default picks (Shape A, Colour Both, Sparks Both, Trail B) | Fireball × Frost shard | 28/36 → 33/54 | Yes | — (9 playable steps; joined colour is one step per beat) |
| Merge, Shape + Trail = Both | same | → 33/73 | **No** (draws, 18 steps) | 33/59: trimmed 2 linger steps, trail by 2 (12 steps). Particles already in cap, not cut by step |
| Merge, all Both, Mix 100 | Fireball × Thunder | → 38/78 | **No** (draws, 19 steps) | 38/60: trimmed 2 linger steps, trail by 3 |
| Breed (6 children, seed 9013) | Fireball × Frost shard | 13–32 particles, 25–73 draws | 5 of 6 fit | Child 2 is flagged (32/73); keeping it shows Fit. Each child also flips 1–2 discrete picks |
| Power-up tiers Lv2 / Lv3 | Fireball | 28/40 / 28/54 | Yes / Yes | v1 only switches extra steps on (Lv2 linger motes, Lv3 + a hit star). No value scaling. Later: value scaling |
| Combo fusion (ready-made swap) | Fireball + 2nd caster | → 26/33, on screen 33 of 120 | Yes | One fused effect replaces two hits |
| Living linger (4 tiles, visual only) | Fireball | → 44/61 | **No** (draws) | 44/52: trimmed 1 linger step, trail by 1 |
| House motes on | Fireball | → 34/40 | Yes | Meter still uses the 48 effect cap; Fit would use the 32 preset particle cap |
| Caster colours, Tap the rhythm, Element reactions | any | ±0 | Yes | Editor-only; they write a ramp key, timings or a suggestion |
| Export as asset | any | no game cost | — | Heap check before shipping (scope S0) |
| Draw the spell, World-aware linger (later) | — | same as travel / same as linger | Not tested | Need travel (R3) and world reads |

## Decisions and why
- **Merge is a drop, not a pane.** It works like crafting: the result is one more card in the grid, so blends can blend again (non-linear by construction). There's no node editor.
- **The drop target is the base.** That gives a stable rule for who owns the Hit (scope rule 1). Swap is one tap, so dropping onto the wrong card is never a trap.
- **Mix snaps to quarters.** Five readable stops beat a fiddly continuous slider on a phone, and each stop is a real, nameable result.
- **The layer strip is always visible, but sliders only appear for one layer.** That keeps the layer model discoverable without forcing it, and stops the editor becoming a wall of knobs (the Isberg failure).
- **The beat row is Advanced only (scope §5).** Basic users never meet timing. The rhythm pad is the "feel" route into timing, with no timeline.
- **The meter lives on the strip, not in a dialog.** It flags before save and explains every trim. That is the CEO's "risk means bold ideas, not breaking the engine".
- **The tap path is always shown.** Drag uses pointer events, with the touch-move default blocked only once a card is lifted, so scrolling the grid still works. Every gesture has a button route and a keyboard route.
- **The preview is honest about what the engine can't do yet.** Travel is a still path with a plain-words caption; fusion says it's a ready-made swap.

## What is mocked or not real
- The renderer is a stand-in for `fx-live` and the doc → LiveFx compiler (R1). Its shapes, units and board are drawn in code, and the light is a 2-step tint.
- The particle and draw numbers come from a mock cost model, not `capCounts` or `FX_BUDGET`.
- Presets, reactions, house families and ability slots are sample data. "Someone edits Fireball" and "Fireball removed" are mock controls in ⋯.
- Save, Give to and Export only show toasts; nothing is written. Turn, Night and 1×–3× (UX v3 §1.2) and the Advanced scrub timeline are not in this mock.
- Caster colours always picks Frost (from the Knight's blue palette); there's no real palette read.

## EA rulings (round 2, 2026-11-16) — the six questions from r1
1. **Both is joined steps.** Each step keeps its own `tint_ramp`. There is no `rim_ramp` field: the rim is the outer step’s ramp. The colour sheet now says this in those words.
2. **Fit follows merge rule 4** (particles pro rata to ≤48 / ≤32 for presets and never cut by step; lights keep the 2 largest; over 12 steps drops lowest-weight Linger first, then trail, then spread; never remove a side’s last step in a beat; ties drop from the non-base side first). Every trim is one line with Undo.
3. **A blend’s `variant_seed` = hash(A.seed, B.seed, mix snap, base side),** stored once and fixed. The same blend made twice looks the same. A reroll writes a new seed.
4. **Shelf entries are references only (≤48).** A shelved single layer becomes a one-part effect doc with `from` pointing at its source, and the shelf references that. No free-floating copies.
5. **Update? redoes only the layer or layers whose `from` changed,** as one undo, then re-runs Fit on the whole blend and shows the trim line if anything was cut.
6. **Tiers v1 only switch extra steps on.** Values stay inside the caps; no value scaling. Later: value scaling.

## Open questions left
None from the r1 list. Remaining product notes are in Round 2 (weak spots) below.

## Shot list (`ui-shell/mock-effects-v3/shots/`)
01-home · 01-home-dark · 02-layer-sparks · 02-layer-sparks-dark · 03-beat-row-travel · 03b-beat-hit-sheet · 04-drag-merge-mid · 05-blend-card · 05-blend-card-dark · 05c-blend-fine-tune · 05c-blend-fine-tune-dark · 05d-blend-chip-pop · 05v-blend-chips · 05v-blend-chips-dark · 06a-over-budget · 06b-fit-trimmed · 07-take-menu · 08a-prov-from · 08b-prov-changed · 08c-prov-removed · 09-shelf · 10-dice-history · 11-house-style · 11b-house-motes-fit · 12-lab · 12b-lab-lower · 13-breed · 14-combo-fusion · 15-living-linger-over · 16-tier-lv3 (Lv3 flagged, Steps 13 of 12) · 16b-tier-lv3-fit · 17-export-clean · 18-tap-rhythm · 30-pc-1280x800 · 31-tablet-820x1180. The old 05b two-column grid shot was dropped. Captions are in `shots/shots.json`.
Audit: `shots/touch-audit.json` covers 34 states, both themes, and phone, tablet and PC: 0 targets under 48 px and 0 AA contrast failures (min contrast 5.01:1).

---

## Round 2 · 2026-11-16 01:5x Europe/London · Editor & UX Designer · status: MOCK for review (no engine code, nothing pushed)

Asked by the EA’s rulings on the r1 mock, plus the r1 weak spots (blend sheet scrolling at 390 px, breed children too alike, moonlit fire going pink). CEO OK on the effect ramps at 01:45 London (“Colors are fine”); `ramps.json` is APPROVED, sha **700f5e13903d** (stops unchanged from the earlier 79b4a64b draft).

### What changed
- **Ramps.** The renderer bakes in the approved 6-stop fire/frost/holy/venom ramps, plus the matching terrain stops. Day (As made / Ember court / Wild) uses `btf-ashroad@3`. House style **Moonlit** switches the whole palette to `btf-moonlit@4` and no longer remaps fire → bloom (that remap was the pink stand-in). The night preview board tints toward moonlit stone so the fire reads on dark ground. Bloom stays a mock-only effect ramp (not a CN-019 key).
- **Both = joined steps.** Colour Both writes `colour.steps` (inner + outer), each with its own `tint_ramp`. There is no `rim_ramp` field; the rim is the outer step’s ramp. Shape Both still joins A and B shape steps, each carrying its source ramp. The colour sheet copy matches this.
- **Fit = merge rule 4.** Particles scale pro rata to ≤48 (≤32 for presets) and are never cut by step. Lights keep the 2 largest. If more than 12 steps play (or draws overflow), drop lowest-weight Linger steps first, then trail, then spread. A side’s last step in a beat is never removed; ties drop from the non-base side. The meter line always names the trim and offers Undo. Shots 06a/06b and the budget table were recaptured against this.
- **`variant_seed`.** `hash(A.seed, B.seed, mix snap, base side)`, stored once. The same blend made twice is identical; a reroll writes a new seed.
- **Shelf.** Entries are references only (≤48). Shelving a layer creates a one-part effect doc with `from` pointing at its source; the shelf points at that doc. Copy: “references only” and “one-part · from …”.
- **Update?** One undo redoes every layer whose `from` changed (re-blend those layers if the doc is a blend), then Fit runs on the whole blend and the trim line appears if anything was cut.
- **Tiers v1.** Lv2/Lv3 only switch extra steps on (a linger motes/lring, then an extra hit star/ring). Sparks, size, trail and light radius are unchanged. Shot 16 is now `16-tier-lv3` (Lv3 of Fireball is 28/54, fits). Lab copy includes “Later: value scaling.”
- **Blend sheet at 390 px.** Mix is a 5-stop 48 px segment; the six A/B/Both toggles sit in a compact two-column grid. Mix + all six rows are visible with no scrolling. Every toggle is still ≥ 48 px.
- **Breed.** After the mix × dice, each child also flips one or two discrete picks (kind, picture or ramp, on-palette only), driven by `variant_seed`. Children in shot 13 read as clearly different.
- **Light pop.** Soft falloff in concentric whole-pixel rings, using the lightest ramp step, instead of a two-stop flat disc.

### What worked
- The two-column blend grid, with the Layer/Beat switch in the head and Try Steam on the A/B row, fits in the 40% sheet (333 px of 338) without shrinking a target under 48 px.
- Moonlit fire now uses the approved `#200a24 … #ffefc4` night stops, so the house-style shot should no longer go pink.
- Breed with forced discrete flips (plus the existing value jitter) makes the six children diverge in kind, hit picture and/or ramp, and the same seed reproduces the litter.
- Fit on the Shape+Trail=Both case trims only linger then trail, leaves particles at 33, lands on 12 steps / 59 draws, and names it in one line.

### What failed or is still weak
- The A/B names plus Swap plus Try Steam are tight at 390 px (“owns the Hit” wraps). Readable, but not generous.
- The 12-step cap is enforced when Fit runs, not as a live meter flag. Lv3 is 13 playable steps and 28/54 (fits), so Fit is not offered. That’s consistent with “values stay inside the caps,” but a later meter could also name steps.
- The preset particle cap of 32 is applied inside Fit only; the meter still shows “of 48” (the per-effect budget). House motes on Fireball is 34/40 on the meter, and would scale to 32 only if the user taps Fit.
- Default Colour Both raises draws (33/54 vs r1’s 33/39) because the outer colour step is a real second draw. It still fits.
- Travel is still a still path; the renderer and cost model are still stand-ins; Save / Give to / Export are still toasts. Night’s board is a tint toward moonlit stone, not the full terrain painter.
- Light pop’s pixel rings are cheap and clearer than a disc, but they’re still a 2D tint under the units, not a true light volume.

### Commands
```bash
/workspace/.pwvenv/bin/python /workspace/tileengine/ui-shell/mock-effects-v3/scripts/capture.py
```
Playwright, Chromium (`/usr/bin/google-chrome`), 390×844 (and 1280×800 / 820×1180), DPR 2, has_touch. Opens `index.html` from `file://`. Writes `shots/*.png`, `shots/shots.json`, `shots/touch-audit.json`. Drag and long-press use CDP `Input.dispatchTouchEvent`.

## Round 2b · 2026-11-16 01:5x Europe/London · Editor & UX Designer

EA follow-ups, applied on disk only.
- **Live steps flag.** The meter now reads “Steps N of 12” next to particles and draws. It goes amber like the others and offers Fit. `cost.over` includes steps, so Save & use also refuses while over. Tier-up (Lab Lv1–3) runs through Fit as one undo: Lv2 of Fireball is 28/40/12 and stays; Lv3 is flagged at 28/54/13, then Fit trims 1 linger step to 28/51/11, with the same one-line “Trimmed 1 linger step to fit · Undo”. Lv3 can never save at 13 steps. Shot 16 shows the flag; 16b shows the fit.
- **Preset particle cap on the meter.** While editing a preset the particle meter reads “of 32” (blends stay “of 48”). Shot 11 is now House style on Fireball with motes: 34 of 32, amber, Fit offered. Shot 11b is the fit: “Trimmed particles 34→32 to fit”.

Command: `/workspace/.pwvenv/bin/python ui-shell/mock-effects-v3/scripts/capture.py`

## Round 3, blend declutter · 2026-11-16 02:1x Europe/London · Editor & UX Designer · status: MOCK for review (no engine code, nothing pushed)

CEO tested the blend sheet on his phone (the then-current `05-blend-card.png`) and said: “The blend could do with more cleanup. Everything seems **cramped**. Has to be a better way to present it all.” The old sheet put 18 A/B/Both buttons, 5 Mix buttons, Layer/Beat, Swap, Try Steam and two parent labels with wrapped sub-text (“base · owns the Hit”) on one surface well over 40% of the screen.

### What changed
- **Default sheet (progressive disclosure).** One parent row: Fireball thumb, a 48 px ⇄ Swap, Frost shard thumb. A small **leads** marker sits under A’s name (tap the A cluster to hear “A leads the blend and owns the Hit”). No “base · owns the Hit” sub-text. One Mix slider, labelled “more Fireball” / “more Frost shard”, still snapping to 0/25/50/75/100 as tick marks, not five buttons. Mix updates the preview live and writes one undo on release. Steam is one slim suggestion line with a 48 px **Try** text button, shown only when a reaction exists. One row: **Fine-tune parts ›**. Save & use, Shelf and Lab are unchanged.
- **Per-part A/B/Both left the home sheet.** While blending, tapping a layer chip (Shape A, Colour A+B, …) opens a small A / B / Both popover with a live preview (and Adjust… for the existing sliders). The blend sheet stays open. **Fine-tune parts** opens a second sheet page: one 56 px row per part, a small A/B/Both segmented control, and the By layer / By beat toggle in the head. Rows scroll if they would exceed the 40% cap (Trail sits just below the fold).
- **Variant B**, `?blend=chips` (or `?blend=B`): the same home sheet without the Fine-tune row. The top chips are the only per-part control. A one-time coach mark (sessionStorage) reads “Tap a part to pick A, B or Both”.
- Guards held: 48 px targets, AA contrast, Basic still adds zero taps, offline, no new dependencies, Fit / budget / undo behaviour unchanged. Scrim on the phone no longer covers the preview or the chip row, so chips stay tappable while the blend sheet is open.

### Sheet height on a 390 × 844 phone (Steam visible, Fireball × Frost shard)

| Variant | Height | % of 844 |
| --- | --- | --- |
| Default home (05) | 337.2 px | 40.0% |
| Default home, dark (05-dark) | 337.2 px | 40.0% |
| Fine-tune page (05c) | 337.6 px (max-height, body scrolls) | 40.0% |
| Variant B, chips-only (05v) | 277.2 px | 32.8% |
| Variant B, dark (05v-dark) | 277.2 px | 32.8% |

### What worked
- The default sheet finally has room: Mix is the main verb, parents and Steam are readable, and the 18 toggles are gone until asked for. It lands exactly on the 40% cap with Steam visible, and all controls (including Try and Swap) stay fully on-screen with 48 px targets.
- Fine-tune is the right place for the dense grid, and the chip popover is a faster path when you only want to flip one part.

### Honest take
The **default** (Fine-tune row + chip popover) reads cleaner than variant B as the product default. Mix and the two parents get to breathe, and “Fine-tune parts ›” is an obvious door for the rest, so a first-time blend does not start with 18 toggles or a lesson. Variant B is shorter and calmer still, but it buries every per-part pick behind a one-time coach and the top chips. The chips already show A/B badges, so experts may prefer it; discoverability is worse if the coach is dismissed and the Fine-tune row is gone. Keep B as a URL-selectable density option, not the default.

**CEO choice, 2026-11-16 02:18 Europe/London:** the Fine-tune parts row version is the default. Variant B stays behind `?blend=chips`.

### What is still weak
- Longer parent names will still ellipsize in the 56 px row (Fireball and Frost shard now fit).
- The chip popover overlaps the blend sheet by about 100 px (Adjust… sits over Mix). Usable, not tiny-tiny.
- Fine-tune’s sixth row is below the fold — intentional, but easy to miss without the scroll sliver.
- The leads meaning is a toast, not a persistent caption, as specified.

Command: `/workspace/.pwvenv/bin/python ui-shell/mock-effects-v3/scripts/capture.py`

## Round 3b · 2026-11-16 02:2x Europe/London · Editor & UX Designer

CEO chose the Fine-tune parts row version as the default on 2026-11-16 at 02:18 Europe/London. Variant B remains behind `?blend=chips`. Same guards, on disk only.

- **Meter wrap.** Particles, Draws and Steps now sit on one line at 390 px, with compact labels (`33/48 particles`, `54/60 draws`, `9/12 steps`) and no wrapping. The full “N of M” phrase stays on the aria-label. “Fit to budget” still fits on that same line when the meter is over. AA contrast and 48 px targets held.
- **Fine-tune sixth row.** All six parts now fit in the 40% sheet: 48 px rows (inset stroke, so the 48 px A/B/Both targets do not grow the row), no scroll. Shot 05c shows Trail on-screen.
- **Chip popover overlap.** The picker is a compact header (live thumb + name + Adjust… + close) over the A/B/Both row, then clamped above the blend sheet. It no longer overlaps the sheet (~48 px gap). Shot 05d.

Command: `/workspace/.pwvenv/bin/python ui-shell/mock-effects-v3/scripts/capture.py`

## Round 3c · 2026-11-16 02:3x Europe/London · Editor & UX Designer

CEO checked 05c on his phone: “The blue highlight in fine tune for what you've selected is too big and clipping on the other options above and below it.” Same guards, on disk only.

- **Framed A/B/Both.** Each control has a visible 1 px rounded frame (`--seg-line`, AA against the sheet: 3.82:1 light, 5.28:1 dark).
- **Inset selected pill.** The fill is a rounded pill inside the frame, with about 4 px padding all round, so it never reaches the row edges or the neighbouring options.
- **8 px gaps.** Visual frames are 40 px in 48 px rows (4 px margin each side), so adjacent frames have an 8 px gap. Hit targets stay 48 px via transparent padding.
- All six Fine-tune rows still fit in the 40% cap (337 px, 39.9% of 844; body does not scroll). The same pill style is on the Fine-tune Layer/Beat toggle and the chip popover’s A/B/Both. Checked in light and dark (shots 05c, 05c-dark, 05d).

Command: `/workspace/.pwvenv/bin/python ui-shell/mock-effects-v3/scripts/capture.py`
