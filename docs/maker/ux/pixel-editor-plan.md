# Sprite Studio — flagship pixel/sprite editor plan (Editor & UX, draft r1, 2026-11-11)

Status: PLAN for CoS + Engine Architect. CEO approved the 6-point approach; CEO input wanted on 4–6.
Name is a working title ("Sprite Studio").

## 0. Bar (point 4)
A brand-new user, tablet, no tutorial, makes a walking 32x32 hero (4-direction or side walk, ≥4 frames) in under 10 minutes.
Measured with: timed session, screen recording, "where did they stall" log. Pass = 8 of 10 testers under 10 min.
Phone (390x844) must also work; tablet is the benchmark device.

## 1. Research (Librarian leads; I add the UX teardown)
Teardown of Aseprite, Pixelorama, Procreate (+ Procreate Dreams for animation), the AIgamedv sprite tools, plus Pixquare/Resprite (touch-native pixel apps, the real tablet competitors).
For each: first 5 minutes (where beginners quit), touch handling, animation/onion skin, palette/shading help, export.
Output: docs/research/sprite-editor-what-we-beat.md — a table "they do / beginners quit at / we do instead".

## 2. Shape-language core (Architect owns format; DSK owns file shape)
Sprite = recipe: parts (shapes: blob, capsule, rect, polygon, stroke-path, pixel patch), each with a palette slot, outline rule, shading rule (light direction + ramp steps), plus a skeleton (named joints) for poses.
Renderer bakes recipe → pixels at the target size (16/24/32/48/64), deterministic, whole-pixel snap.
Gives for free: instant recolour (palette slots, ties to the status-tint principle and master-sprite variants), resize re-draw (not scale blur), poses/walk cycles from joint keyframes, variants.
"Pixel patch" part = hand-painted pixels stored as-is, so nothing is ever lost when the recipe can't describe a stroke.
Extends the existing code-tile recipes (art-upload.md §3.9, btf-ashroad/moonlit) — terrain and sprites share one recipe language and palette ramps.

## 3. Two ways in, one result
- Draw (Basic): pencil/brush/fill/eraser/eyedropper; strokes become recipe parts (closed stroke → shape, line → stroke-path, dabs → pixel patch). Auto-outline and auto-shade toggles on by default.
- Shape (Advanced): same sprite as a parts list with sliders (size, roundness, outline, shade steps, light angle) and a palette panel.
- Code (Advanced, hidden behind "Show recipe"): read/edit the recipe as text for power users. Never required.
- One undo history across all three. Basic/Advanced follows the editor-wide P1 principle.

## UX shape (touch-first, progressive disclosure)
- Locked shell: thin top bar, bottom rail, sheet ≤40%, canvas ≥75%; dark mode; targets ≥48px; nothing hover-only.
- Start with 5 tools on the rail: Pencil, Eraser, Fill, Colour, Undo/Redo (sheet bar). Then revealed when needed: Shapes, Select/Move, Mirror (symmetry), Layers/Parts, Frames, Shade, Outline, Recolour, Pose.
  Reveal rule: a tool unlocks by use or by a "More" tap, with a one-line hint; nothing modal.
- Gestures: one finger draws, two-finger pan/pinch zoom, two-finger tap undo, three-finger tap redo, long-press eyedropper. Pencil/stylus pressure optional. Palm rejection when a stylus is seen.
- Start screen: "What are you making?" Hero / Enemy / Item / Tile / Effect → size preset + template body (e.g. a hero base you can draw over or reshape). Blank canvas always available.
- Walk in 3 taps: Frames → "Make walk cycle" → pick style (bob, 4-frame, 6-frame) from the skeleton; then tweak frames with onion skin.
- Live preview: the sprite walking on a real TileEngine tile, in day and night tint.
- Export: into the project's sprite slots (same slot mapper as store packs); PNG + recipe kept; drawing history kept (provenance for the hub).

## 4–6 CEO input wanted
- (4) Confirm the bar wording above, the walk definition (directions, frame count), and pass rate. Beta testers from Reddit pixel-art forums: when, and how many.
- (5) Slices with A/B builds + QA — see proposed order below.
- (6) Which BTF sprites are the proof set. Proposal: 1 angelic piece, 2 plates (hp, dmg-venom), 2 arrows (plain, poison-pierce), 1 fx frame set (gust 2 or tide 5), 1 status (draught). Pass = CEO can't tell remake from original at game size, or prefers the remake.
- Taste: the default style. Proposal: 1px dark-hue outline (not black), 3-step shading ramp, top-left light, limited palette per sprite (≤16), hue-shifted shadows. CEO judges by eye in round SE-A/B.

## Slices (proposal, numbered "SE-nn", each 150–400 lines, A/B + QA like the engine)
- SE-00 research doc (Librarian) + UX teardown (me) — no code; can start now.
- SE-01 recipe format v0 + deterministic baker (shapes, palette slots, outline, shade) with golden-image tests. (Architect/DSK)
- SE-02 canvas + 5 starter tools + one undo + touch gestures (my prototype first, then Grok Build).
- SE-03 strokes → recipe parts, pixel patch fallback.
- SE-04 palette + recolour/variant action + status tints (P2) + master-sprite variants.
- SE-05 Shape/Advanced panel (same data) + "Show recipe".
- SE-06 frames, onion skin, skeleton + "Make walk cycle".
- SE-07 import clean-up pass (white snap, brightness match, magenta key) + slot export.
- SE-08 style pass with CEO by eye (A/B builds of default style).
- SE-09 BTF proof-set remakes + the 10-minute tablet test (internal), then Reddit beta.

## Proposed spot in the step order
The sim core spine (steps 16–18) is headless and doesn't need the editor; the sprite editor doesn't need the sim.
Proposal: run it as a parallel track.
- Now: SE-00 research + my clickable prototype of the SE-02 flow (in ui-shell, no Grok Build cost).
- SE-01 (recipe format + baker) goes to Grok Build right after step 18 (card-free levelling), because the format has to be frozen before any editor code.
- Then alternate: one engine step, one SE step, so neither stalls. Architect to confirm.

## Risks
- Generic look → strong default style (CEO by eye), pixel-patch escape hatch, style packs later.
- Stroke-to-recipe guessing wrong → always show "Keep as pixels" undo; never lose a stroke.
- Scope creep → progressive disclosure; v1 cuts: no 2x2 units yet (matches art rulings), no AI generation inside (Grok Imagine stays an import route).

## Answers to the Architect (2026-11-11, for docs/sprite-recipe-architecture.md)
1. Pencil must produce these ops (no raster-only dead end):
   - pixelRun (row runs at a part/layer, palette slot not raw RGB): every pencil and eraser dab. This is the floor: anything drawable is a valid recipe.
   - fill (flood within a part's mask, palette slot), and clear/erase as a pixelRun with slot 0.
   - promote: an optional, always-reversible upgrade of a closed stroke into shape (blob/polygon/capsule/rect) or an open stroke into strokePath. It keeps the source pixelRuns inside the op so "Keep as pixels" restores them exactly.
   - mirror flag per part (symmetry drawing writes once, mirrored at bake).
   - Every op is tagged with a part id, so recolour, outline and shading apply to hand-drawn pixels too. Outline and shading are rules on the part, never baked pixels.
2. Undo: yes, please make the editor history an op log in the format, but as a separate optional block (history[] of op batches, one batch per gesture). The recipe itself stays the folded result. The history can be stripped at export, and it is kept for hub provenance. One history covers the Draw, Shape and Code views; a slider drag counts as one batch. Cap it with a size meter and offer a "Squash history" button.
3. Sliders per shape (Basic shows the first four; Advanced shows all):
   - Size (w, h), Position (x, y snap), Roundness (corner/blob tension), Rotation (whole-pixel friendly: 0/45/90 steps plus free in Advanced).
   - Outline: on/off, thickness 0–2px, colour mode (darker hue of fill / chosen slot), sides (all / outer only).
   - Shade: light angle (shared per sprite by default, override per part), steps 1–4, strength, highlight on/off, dither none/checker.
   - Colour: palette slot picker (not RGB); hue-shift shadows on/off.
   - Joint anchor: which skeleton joint it follows (for poses and walk).
   - Z-order up/down, mirror, visible/lock.
   - strokePath extra: width 1–3px, cap round/square. pixelRun parts: no geometry sliders, just colour, outline and shade rules.

## CEO DECISIONS (2026-11-11, via CoS) — locked
1. Bar: a walk is 4 directions × 4 frames, made in under 10 minutes; pass = 8 of 10 testers.
2. Reddit beta testers come in only for the final test (SE-09).
3. Proof set approved: angelic piece, hp + dmg-venom plates, plain + poison-pierce arrows, gust or tide frames, draught. Pass = CEO can't tell them from the originals at game size.
4. Default style approved as a start (1px dark-hue outline, 3-step shade, top-left light, ≤16 colours, hue-shifted shadows); CEO judges by eye in the SE-08 A/B builds.
5. Parallel track yes: research and the prototype start now; SE-01 after step 18; engine and SE steps alternate after that.
ID MAPPING (merged plan): the CEO's 'SE-08 style A/B' = merged **SE-15**; 'SE-09 Reddit final test + BTF proofs' = merged **SE-16**. Use merged ids from now on.
Facings (format §1.5 @afaf9ec0): down / up / side, plus sideMirror; one skeleton; per-facing visible/z/geom overrides. The facing picker switches overrides, not separate drawings.

## Architect review edits ACCEPTED (2026-11-11, joint plan docs/sprite-recipe-architecture.md @2a34775f)
These replace the wording above, which stays for history:
- 'pixel patch' → pixelRun (always palette slots).
- The baker is the src/paint rasteriser, baking at stage load.
- Rotation: quarter turns plus mirror in Basic; any whole degree in Advanced.
- Dither: none / checker / bayer4 (bayer4 only in Advanced).
- Slice ids: engine SE-01–SE-04; my editor slices become SE-09–SE-16 (old SE-02→SE-09 … SE-09→SE-16). SE-09 creates src/editor/. Each editor slice proves round-trips R1–R4 and leaves the hash tests unchanged.
- Export adds bakeAsset plus PNG and frame JSON.
- 'Parallel track' → alternating track.
- Reddit beta = SE-16 (the final test), BTF proofs and the 10-minute test in SE-16.

## CEO engine answers (2026-11-11, via CoS; format §6 @10521144) — locked, mirrored in UX
a. Shipped games never run recipes live; they get the frozen output only. (UX: the export says "Baked to pixels".)
b. Hard sprite edges only; glows come from the FX layer. (UX: no soft or anti-aliased brush; the glow toggle sends you to the Effect Designer.)
c. Rotation: Basic is quarter turns plus mirror, Advanced is any whole degree.
d. Drawing-code changes are versioned; old sprites never change unless the maker upgrades. (UX: an "Upgrade look" badge with before/after, Update / Keep current, one undo step, same as the style-pin flow D7.)
e. Drawing history is kept on hub uploads by default and always stripped from game exports. (UX: the export sheet note "Drawing history isn't included in games"; the hub upload toggle "Keep drawing history (proves it's yours)" is on by default.)

## Prototype r62 (2026-11-11, Editor & UX) — clickable, in-memory mock
Where: `ui-shell` → stage editor More → **Sprite Studio**, or dev route `index.html#sprite-studio`. Code: `js/sprite-studio.js` + "Sprite Studio" CSS section; capture `scripts/capture_62.py`; screenshots 62a–62l, 62z; audit `screenshots/62-touch-audit-report.json` (0 undersized, 0 JS errors, 0 AA contrast fails; canvas 85% with the sheet closed, sheet ≤39.9%; tablet 1024×1366 canvas 91% with the sheet docked right).
Folds in the accepted Architect review, format §1.5 facings, and CEO rules b–e.

**Real (works on the canvas):** pixel drawing in palette slots only (pencil 1/2/3px, hard edges, no soft brush), eraser, flood fill, one undo/redo history per gesture (sheet bar + Undo button), Mirror (draws both sides), auto 1px dark-hue Outline, 3-step top-left Shade with Dither None/Checker (Bayer only in Advanced), 15 of 16 slots in 5 hue-shifted ramps, Recolour ramp swap (one undo step), Turn 90° + Mirror in Basic (any whole degree slider in Advanced, not applied), start sheet (Hero/Enemy/Item/Tile/Effect/Blank, width 16–64 suggested from the tile size, height same or taller, faint hero template, licence line "Made by TileEngine · free to use"), progressive reveal (9 locked tools, one tap adds to the bar, no modal), facings Down/Up/Side + Left = Side mirrored (same drawing; parts shown/hidden and reordered: Up hides the face and puts the back detail on top), Make walk cycle (Bob/4-frame/6-frame, default 4) → 4×4 strip walk down/up/left/right, per-frame touch-up (only that frame changes), onion skin, live preview walking on an Ashroad tile with night as a scene tint, Upgrade look before/after (Update / Keep current as one undo step), gestures (one finger draws, pinch/pan, hold = eyedropper, 2-finger tap undo, 3-finger tap redo; listed in the ? sheet with Zoom −/Fit/+ buttons).
**Mocked:** no recipe format or real ops (pixels are a flat slot array per part; "Make shape" chip is only a state toggle), walk frames are pixel shifts (1px bob, one leg's pixels lifted) not skeleton poses, Shapes/Select/Pose are placeholder sheets, "+ Add" colour is a toast, the glow link ("Glow: add in Effects") shows a toast instead of opening the Effect Designer, Save shows the toast "Saved to your project's sprites · PNG + frames · drawing history kept" (nothing written), Upload to hub is a mock (nothing leaves the device) with "Keep drawing history (proves it's yours)" on by default, export sheet states "Baked to pixels · drawing history isn't included in games". No persistence; leaving the screen keeps state only in memory.
**Known gaps:** on phone the Frames and Export sheets scroll a little for their last controls (the facing picker and Upload to hub); Side facing reuses the front-drawn body (a real side view needs its own drawing or recipe parts); stylus pressure and palm rejection are not simulated; frame strip thumbnails are small (40px art in 48px targets); Advanced rotation slider only updates its label.

## GUARDRAIL (CEO 2026-11-11) — every SE round
Anti-example: 'Isberg Labs Pixel & Animation' (Reddit). It has a wall of code on the left, tiny menus, an asset list and a dense palette strip, and the CEO felt he'd "need a YouTube guide" to use it. Avoid that feeling.
The r62 look ("easy on the eye, no information overload") is the reference. Check every round with: no code on screen by default, at most 5 starter tools, one sheet at a time, plain words, nothing smaller than 48px, and palette slots never a dense strip.
Research: docs/research/se-00-sprite-editor-research.md (Librarian). Live mock-up: https://g-tileengine.github.io/tileengine/#sprite-studio (CoS publishes; never push gh-pages myself; each publish needs CEO SEND).

## Prototype r63 Basic mode (2026-11-11, Editor & UX) — CEO feedback t60u, plan approved t61u
Why: the CEO tried r62 and said it "felt more like an advanced mode"; his hero came out flat orange with no edge or shading because Outline/Shade sat locked behind More. Basic now does the drawing work for non-artists. Advanced is the r62 editor, unchanged. Both modes write the same data (P1).
Where: same route (stage More → Sprite Studio, or `index.html#sprite-studio`). Code: `js/sprite-studio.js`, `index.html` (mode switch + "Outline + shading on" badge), "Sprite Studio r63: Basic mode" CSS section. Capture `scripts/capture_63.py`; screenshots 63a–63s; audit `screenshots/63-touch-audit-report.json` (0 undersized, 0 JS errors, 0 contrast fails, light + dark).

**Built (works):**
- **Basic / Advanced switch** in the top bar. Basic is the default. Switching keeps the drawing; going to Advanced turns Outline and Shade into real toggles (already on, added to the bar), so the look doesn't jump.
- **Ready-made hero.** Start → "Start with a ready-made hero" (32×32, no size picking in Basic). The Parts sheet opens with thumbnail chips: Body (Classic, Sturdy, Small), Hair (Short, Long, Spiky, None), Outfit (Tunic, Armour, Robe), Weapon (Sword, Staff, Bow, None). That's 144 combos, all code-drawn on the grid, each with front, back (Up facing) and side-face layers. Every combo is checked to be already tidy.
- **Part id on every pixel.** Each part (Skin, Hair, Shirt, Trousers, Boots, Weapon) owns one 3-step colour set, so the palette slot itself carries the part id. Recolour, outline and shade apply to hand-drawn pixels too.
- **Outline + 3-step shade always on in Basic**, applied as render rules (1px dark-hue edge, light from the top left, hand-tuned hue-shifted ramps). They're never baked into the data. A calm badge says "✓ Outline + shading on".
- **Colour by part.** Tap a part chip, then one of 6–8 big 3-stripe swatches. The whole part recolours in every frame, as one undo step. Pencil draws in the chosen part.
- **Tidy.** It removes stray pixels and lone specks, fills 1px gaps, and, when "Both sides" is on, evens left and right (weapons are never touched). It runs until stable and shows a Before/After sheet with counts and "Undo Tidy" (one undo step).
- **Fixed Basic rail of 5:** Parts · Colour · Pencil · Tidy · Walk. Nothing is locked, and More doesn't exist in Basic. Pencil's second tap gives Draw/Erase, 1–2px and Both sides.
- **Walk + preview in 2 taps:** Walk → Make walk cycle (4 ways × 4 frames) shows the Day/Night preview right away, with Down/Up/Left/Right preview direction and "Touch up frames" (the r62 per-frame sheet).
- **Timed non-artist run** (scripted, real taps): Start, 4 presets, 3 part recolours, Tidy, then walk and preview took **15 taps**, about 45–60 s for a person versus the 10-minute bar.

**Mocked:** presets are hand-coded pixel sets, not recipe shapes or skeleton parts. Swapping a preset rebuilds the hero and replaces pencil touch-ups (it says so; Undo restores them). Walk is still the r62 pixel-shift walk. Side view reuses the front body. No real save or export.

**Known gaps:**
- 6 parts × 3 steps = 18 slots, over the ≤16 default-style cap when all six sets differ (the live hero shows about 24 baked colours including outline lines). It needs a rule, such as Boots/Weapon sharing a set or 2-step small parts.
- The dashed mirror line is always shown in Basic because Both sides is on by default.
- Thumbnails are small (32px), so hair differences are subtle at a glance.
- The Basic title shortens to "Hero" to fit the switch; in Advanced it may show as "Hero…".
- Tidy's gap rule can fill a deliberate 1px slit, though it's undoable.
- Basic presets exist for Hero only. Enemy, Item and others start blank with the guide.

## Imagine → pixel style converter (CEO 2026-11-12, approved, via CoS) — lives in SE-14 (old SE-07) import clean-up
Plain JavaScript only, no AI, runs in the browser on the device (nothing uploaded). Not chibi conversion, not in-editor generation.

**Flow (Basic: 3 taps — Import picture → Convert → Keep):**
1. Import a PNG/JPG (file picker or camera roll). The original is kept untouched beside the result, always.
2. Background: auto-detect magenta key, else the colour in the four corners (flood fill from edges with a tolerance slider). A "Pick background" eyedropper as a fallback.
3. Crop to the subject's box, then downscale to 32 or 64 px (choice chip; 32 default to match the walking-hero bar). Area-average / majority-colour downscale, not nearest, so thin lines survive.
4. Snap to palette: either "Auto (≤16 colours)" (median-cut / k-means in JS) or "Use my style ramp" (locked project ramps). Colour-count slider 4–16.
5. Clean up strays: remove lone pixels and 1px islands, fill 1px holes (same code as the Basic Tidy button).
6. Outline: 1px dark-hue outline (the shared live outline rule, not baked).
7. Re-shade (optional toggle, default on): 3 steps, top-left light, hue-shifted shadows — the same live shade rule as Basic.
8. Group into parts: connected regions of the same palette family become recipe parts (e.g. Skin, Hair, Shirt, Weapon), auto-named by colour with a rename chip, so the result recolours by part like a Basic hero instead of being a flat bitmap. Fallback: anything unsorted lands in one "Pixels" patch part.

**Screen:** Before/After slider (drag the divider) on the canvas, a ≤40% sheet with 4 controls in Basic (Size 32/64, Colours, Re-shade on/off, Background tolerance); Advanced adds downscale method, outline colour, island size, part merge threshold. Undo per step; "Back to original" always there.

**Four directions:** converts one image per direction. "Match to master" on the 2nd–4th image reuses the first one's palette, part names, size, scale and foot line, so the set stays consistent; any colour not in the master is snapped to its nearest master colour and flagged.

**Help text in the UI (known limits):** works best with simple, front-facing art on a plain background; small details like eyes or straps may need a quick pencil touch-up; one picture per direction — use Match to master to keep all four looking the same.

**Prototype r66 (proposed):** clickable proto in ui-shell (Sprite Studio → Import → Convert), real JS pipeline on the CEO's own picture, tablet layout, local only until CEO SEND. Then it's the spec for SE-14.

**CEO-locked defaults (2026-11-12, via CoS)** — in `IC_DEFAULTS` at the top of `ui-shell/js/imagine-convert.js`:
- **Background: magenta key** is the default (he asks Imagine for magenta). Corner colour and Pick background (eyedropper) are the fallback, e.g. for sprites with pink in them. When the sprite has pink inside, a plain-words hint shows: "Your sprite has pink in it. Try Corner colour or Pick background."
- **Size: 32 px** (64 is one tap).
- **Palette: Auto from his art**. The locked style ramp is one tap: the "My style" chip in the Basic Adjust sheet.

## Prototype r66 (2026-11-12, Editor & UX) — local only, not published (needs CEO SEND via CoS)
Where: Sprite Studio start screen → **Import picture** (or dev: `index.html?noquiz#sprite-studio`, then `ImagineConvert.open()`). Code: new `js/imagine-convert.js` + `css/imagine-convert.css`; small hooks in `js/sprite-studio.js` (start-screen button, `importConverted`, `renderRecipe`, per-direction picture layers, part list from the picture); `index.html` (1 link + 1 script). Capture `scripts/capture_66.py`; screenshots 66a–66r, hero `66-before-after-pair.png`; audit `screenshots/66-touch-audit-report.json`: 0 undersized, 0 JS errors, 0 contrast fails (light + dark), 0 off-device requests; canvas 85% with the sheet closed, sheet 39.9%; tablet 820×1180 docks the sheet right (canvas 89%). Test pictures (made for the test, no CEO sample yet): `assets/test-imagine/` knight on magenta, knight back view on magenta (for Up), mage on white, ranger on a soft gradient, fairy (pink) on mint.

**Real (plain JS on canvas, no AI, no network):**
- File picker `accept="image/*"` (camera roll on a tablet) + **Try a sample**. The original is kept untouched; work happens on a copy (max 640 px).
- Background: magenta auto-detect (border majority) with flood fill from the edges + enclosed magenta holes; if no magenta border → corner colour (bilinear between the 4 corners, so gradients key) with a note; **Pick background** eyedropper; tolerance slider; one ring of anti-alias fringe removed; pink-inside detection + hint.
- Crop to the subject box (ignores specks) → downscale to 32/64 by **most common colour** per cell (or **average**, Advanced), 40% coverage, 1px margin for the outline, foot line on the bottom row.
- Palette: Auto = median cut + k-means (4–16, default 12) · My style = the art's colours locked to the nearest TileEngine default-style ramp step (placeholder until a project ramp exists).
- Clean-up (Tidy rules): strays, colour specks (high-contrast single pixels like eyes are kept), 1px holes, islands ≤ N px (Advanced).
- Parts: colours merged by similarity (Advanced merge slider) into ≤8 named parts (auto-named by colour family: Blue, Steel, Skin…), tiny groups → **Pixels**; rename chip (suggested names or type); recolour by part with the same swatch sets as a Basic hero, plus **Original**.
- Outline = Sprite Studio's live 1px dark-hue rule (Advanced: dark hue / one dark colour / none). Re-shade on = hue-shifted 3-step ramps + top-left light on the whole silhouette; off = the art's own tones.
- Before/After drag divider (48px knob), Undo/Redo per step, **Back to original** always on screen once converted, **Keep** → the sprite in Sprite Studio (Basic Colour/Pencil/Tidy/Walk all work on it; Parts sheet explains it came from a picture).
- **4 ways**: one picture per direction; Match to master (default on) reuses palette, parts + names + recolours, size, scale and foot line; off-master colours are flagged (count + dashed markers, toggle). Keep brings all converted directions as facing layers (Up/Right/Left; Left falls back to mirrored Right).

**Tap counts:** Basic **3 taps** — Import picture → Convert → Keep (plus picking the file in the phone's picker). Switch to the style ramp: 1 tap. 64 px: 1 tap. Pink fallback: 1 tap on the hint (Corner colour).

**Mocked / not yet:** no real save of the original or recipe file (in memory, like r62–r65); "My style" uses the default style, not a project ramp; Keep forces Match to master on extra directions; no per-direction re-crop UI.

**Known gaps / quality (32 px, defaults):**
- Knight (magenta): reads well — blue tunic, steel arms/legs, brown boots, sword as a 1px diagonal. Face is ~4 skin pixels, no eyes (pencil touch-up, as the help says). 64 px looks much closer to the art.
- Mage (white): good silhouette and staff; purple robe a bit busy (gold trim becomes brown specks).
- Ranger (gradient): keys cleanly; dark cloak and trousers merge into one murky mass at 32 px.
- Fairy (pink on mint): keys via corner colour; wings dominate and the chibi face is lost at 32 px; 64 px is better. On magenta, the magenta key eats pink edges → the hint shows, Corner colour fixes it in one tap.
- Shade count: 6–8 parts × 3 steps + outline lines = 20–33 shades, over the ≤16 style cap (same open rule as r63).
- Re-shade bakes its tones at conversion (the Basic per-part live shade over-lit small fragmented parts in testing); outline stays live. New pencil pixels on a kept picture don't auto-shade.
- Match-to-master flags only colours (not shape/pose); with a very different picture (Ranger as Left) it flags 81 px in 7 colours.
- The Basic Adjust sheet fits the 4 controls; Advanced and Parts sheets scroll a little on phone.
- Older capture scripts (r63) need `?noquiz` now (test harness only; r63 timed run still 15 taps, r64/r65 audits still clean).

## Prototype r67 (2026-11-12, Editor & UX) — study pipeline wired into the real converter; local only, not published (needs CEO SEND via CoS)
CEO verdict pt85u: "These three were the best. And okay we will do your method." (Combo A@16, A+r66 H&W@20, A+r66 H&W@24.) Backups of every changed file: `/workspace/r67-backup/`.

**Code:** the study engine moved to `ui-shell/js/convert-engine.js` (IIFE, `window.ConvertEngine`; Node `module.exports`); `study/convert-study.js` now just re-exports it, so the study scripts and the app run the same code (browser output is pixel-identical to the approved 66e study renders: 0 px difference on mage, knight and fairy at 32 and 64). `js/imagine-convert.js` calls it; `css/imagine-convert.css` adds the Look sheet; `index.html` +1 script; `js/sprite-studio.js` +2 small hooks (hidden "twin" parts recolour with their part; one near-black outline stays on recolour). New `study/analyse-table.js` (writes `study/out/analyse-r67.json`). Capture `scripts/capture_67.py`; shots 67a–67w, hero `67-before-after-pair.png`; audit `screenshots/67-touch-audit-report.json`.

**What the user sees:**
- **Default = Crisp (Combo A) at 16 colours:** 2-pass downscale, k-means OKLab palette, near-black outline, no clean-up, feature protection on. Magenta key and 32 px stay the CEO-locked defaults.
- **Convert opens the new Look sheet** (rail button 🎨 Look): 7 look chips (Crisp, 16-bit = snes-new with the weapon fix, Cel, HD-2D "64 px", Game Boy, PICO-8, Vector), a ★ on the suggested one, and one plain-words reason line from Analyse.
- **Detail** (Basic): Standard 16 · Detailed 20 · Extra detailed 24. Detailed = the A+r66 head-and-weapon hybrid, computed live in the browser: the real r66 functions run on the same picture, then the head box and weapon zone get the extra colours; noise gate on; armoured sprites keep their own head. Detail is for Crisp and 16-bit (dashed and off for the other looks, with a note).
- HD-2D is 64 px only: tapping it switches to 64; picking 32 while on HD-2D goes back to Crisp.
- Adjust: Size, Colours (Auto from my art / My style), Background, Tolerance. Advanced adds Shrink by (2-pass / Most common), Outline (Near-black / Dark hue / None), Tidy stray pixels, Light from top left, Merge. The r66 colours slider is gone (Detail replaces it); re-shade moved to Advanced ("Light from top left").
- Help shows the Imagine prompt tip for the chosen look.
- Everything from r66 kept: Before/After divider, original kept, Undo/Redo, Back to original, Parts recolour + rename, 4 ways + Match to master + flags, pink hint, eyedropper.

**Exact colours after Keep:** each engine colour becomes one tone of a part (no re-shading), so Standard is 100% pixel-identical in Sprite Studio. Detail adds hidden twin parts where r66's brown outline (hair, staff) differs from the part's line: 99.5% identical at 32, 99.9–100% at 64 (all 5 samples). Twins recolour with their part in the converter and in Sprite Studio.

**Measured (capture_67, phone 390×844):**
- 0 undersized targets, 0 JS errors, 0 contrast fails (light + dark), 0 off-device requests.
- Canvas 85.1% with the sheet closed; the Look sheet is 39.9% (scrolls slightly to the Detail note). Tablet 820×1180 docks it on the right (canvas 89%).
- Taps: Basic is still **3** (Import picture → Convert → Keep). A look: 1 tap. Detail: 1 tap.
- Time per conversion (median of 5, average of 5 samples, headless Chromium on the box): Standard 107 ms new picture / 47–50 ms setting change; Detailed 136–147 ms / 79–92 ms.

**Analyse (64 px, CEO ranking):** fairy → PICO-8, then 16-bit; knight and knight back → Crisp, Vector strong second; mage and ranger → Crisp, 16-bit second; knight at 32 unchanged by the warrior rule. 7/7 against the r67 table. Against the old 66c table, rows 3–6 now suggest Crisp instead of 16-bit (16-bit or Vector is the runner-up), as the CEO asked for Combo A as the general choice.

**Gaps:** Detail is about 30–45 ms slower (it runs both pipelines). It doesn't apply to Cel, HD-2D, Game Boy, PICO-8 or Vector. Detail at 32 leaves 0.5% of pixels (about 2–5 outline pixels) on a neighbouring line colour after Keep. `capture_66.py` no longer runs as-is (it taps the removed colours slider and the Basic re-shade toggle); its checks are ported into `capture_67.py`. The r63 script still needs `?noquiz` (test harness only).

## Prototype r68 (2026-11-12, Editor & UX) — local only, not published (needs CEO SEND via CoS)

Built on r67 (gh-pages 95aca17). No git, no publishing. Originals backed up in `/workspace/r68-backup/`.

**A · Walk from a Body map.** Sprite Studio guesses a body map (head, trunk, arms, legs split, weapon, wings; winged sprites keep the head to its own half). A sheet with brush/eraser fixes any region. Walk frames move each region (contact/passing) and fill the cracks (2 passes). Each direction has its own picture; a missing back view shows "Needs back view". There are Mirror and "Keep weapon in same hand" toggles. Auto path: Convert → Keep → Walk → Make walk cycle (0 Body-map taps). Fixing a region takes 3 taps.
**B · Tolerance 0 fringe.** Below tolerance 40, the edge ring always uses at least the tolerance-40 distance plus a blend test (edge ≈ inner colour mixed with the key). Soft winged knight at 64 px, magenta-tinted pixels: 115 → 20 at tol 0 (tol 40: 13). Default output unchanged.
**C · Pink hint.** Shows only when ≥2% of sprite pixels are within OKLab 0.12 of #FF00FF (flat key and edge pixels excluded). Purple knight and pink fairy: no hint. Truly magenta fairy: hint.
**D · Extras row.** Equal-width tick chips on one row, label centred, no overlap with Merge.
**E · Light from top left.** Synthetic re-shade colours are capped at (cap − base colours). Knight Crisp16: 24 → 16 colours; fairy: 20 → 16. Fixed palettes unchanged.
**F · Unit tap in edit mode.** Opens Edit / Move / Delete (+ Behaviour for NPCs, Test for heroes). The battle menu appears only in Play/Test; Attack and Items show "Coming soon" (disabled, toast on tap).
**G · Tile tap menu.** Root cause: a saved walk-rules overlay re-armed the Walls tool when the stage reloaded, so taps toggled walls and showed wall tips. A 400 ms dedupe also ate real taps. A third cause: the unit long-press timer never cleared because the stage captures the pointer, so a unit placed during a press popped a menu and swallowed the next tap. All fixed. Wall tips are anchored to their tile and are never shown on hover on touch. Repeat test: 10/10, and fast repeat 10/10.
**H · Place unit on the art view.** Arm → tap a tile → the ghost shows "✓ Fits here" / "✕ Blocked by …" → Place here (3 taps). "Unit" is also in the empty-tile menu. The abstract grid appears only via View → Simple blocks.
**I · Erase.** The Paint sheet has ⌫ Erase (tap or drag): walls, then buildings/objects, then terrain → floor. Tapping a wall edge opens Wall → Delete. Long press asks "Delete this wall?" (Delete wall / Keep it).
**J · Abilities + Test.** The unit sheet lists Abilities, each with ×, and has + Add behaviour and ▶ Test. There's a ✦N badge on the stage, and the toast "Teleport added to Warrior A". Test runs on the current stage: unit tap → Attack / Spells (n) / Items. Spells lists the abilities; unwired ones show "Not playable yet". Teleport follows the catalogue (default destination: beside own summon). With no summon it says so and offers "any empty tile (test only)". The highlighted tiles, a blink, and a plain-words log: "Warrior A used Teleport: moved from tile 2,8 to tile 5,5. It didn't use an action." Exit test restores the stage exactly; nothing is saved.
**K · Behaviour opens abilities first.** Behaviour (unit sheet and unit editor) opens the same J list, not a copy. "+ Add behaviour" (48 px) opens the picker. Back and Use preset return to the list with the new row, the updated ✦ count and the toast. Empty state: "No behaviours yet." + Add behaviour. Tap count: unit → Edit → Behaviour = 3.

**Captures:** `scripts/capture_68.py` (A–F) and `scripts/capture_68_stage.py` (F–K). The audit reports 0 undersized targets, 0 contrast fails and 0 JS errors.
**Gaps:** No real battle runtime: Attack/Items are "Coming soon", and only Teleport is playable in Test. By default Teleport needs a summon. Test uses 1-based tile numbers in the log.
**L · Stage card size.** Levels › Stages cards showed "undefined×undefined" because the list passes stage records (which have only a `mapRef`) into a template that read `cols`/`rows`. The card now reads the size from the stage's map, falls back to the project's first map and then the default map size, and shows e.g. "6×9" for the seeded Floor 1/Floor 2. The card actions are now a 4-column grid of 48 px targets ("Move up" was 46 px). Shot: `68-stages-card-size.png`.

## Prototype r69 (2026-11-12, Editor & UX) — local only, not published (needs CEO SEND via CoS)

Built on r68 (gh-pages 137ea2b, on top of c817f8c). No git, no publishing. Originals backed up in `/workspace/r69-backup/`. Plan: `ux/qol-plan-r69.md`.

**1 · Behaviour picker overhaul.** Advanced keeps the searchable grouped list (word: “behaviour”). Basic opens a full-height picker with Back: seven goal tiles (Move, Attack, Defend, Support, Spells, Status, AI), visual cards with a mini grid and a one-line description, and five role presets (Warrior, Archer, Mage, Healer, Scout). Support holds heals and buffs; Heal has left Defend. Turns, mana and win rules stay in Settings. Suggested chips (Teleport → cooldown / Stun, Heal → Cleanse, and the other first pairings) sit on the 40% unit sheet; the Librarian can tighten them later. Most Basic assignments are 3 taps, no scrolling: Add ability → Support → Heal. Unclear catalogue notes stay on the cards (Teleport “Needs a summon”).

**3 · Abilities list is the unit-sheet home.** Edit lands on Abilities / Stats / Art tabs. Basic says “Abilities” and “+ Add ability”; Advanced says “behaviour” / “+ Add behaviour”. Each row has a short name, a plain line, Test, and remove (Undo). Suggested chips sit above the list.

**4 · Defaults in Basic, a clean edit in Advanced.** Tapping a Basic card applies catalogue defaults and returns to the list (0 knobs). Advanced still opens the form; repeated “What costs an action?” labels use the knob’s own name, “placeholder value” tags are gone, Cancel is hidden (Back + Done).

**5 · Play starts on the stage.** In Basic, Play stays on the board with a “Playing Floor 1 · Exit” chip and uses the units already placed (runtime still a placeholder). Loadout remains the Advanced / More path.

**2 · Stages overhaul (CEO answers, decided).** Add stage opens a type picker: **Safe**, **Battle**, **Freestyle**, plus **How stages chain** as a project setting. Safe hides 12 enemy items, Lava, Bot Ability Priority, Trap Tile, other threat-only items and hostile NPC behaviours; village heroes keep Basic Attack. A fight on a Safe stage needs the “Add threat or event” toggle (type stays Safe) or Freestyle. Battle NPCs are friendly by default; hostility is opt-in. Lair sets are a prefab stamp plus a filter (Goblin lair, Slime den; Bandit lair is a marked stand-in). Changing type later hides, and does not delete, items that would leave the palette. Existing typeless stages stay Freestyle so nothing is hidden by surprise.

**8 · Keep creates a project asset.** Convert → Keep still opens Sprite Studio, and also stores a placeable project asset. A follow-on “Kept art” entry appears in Add here.

**12 · Studio profile overhaul.** Tapping the avatar opens a full-height Pictures / Badges / Borders panel with Back. The long chip list leaves the profile home. Achievements is its own button, with an AA red count badge (`#b42318` on white) that clears on view; locked hidden cards stay “???”. Locked rewards show how to earn them and a progress bar (Sold / Published, not “built”). Portrait art is placeholder SVGs on the existing `avatar_*` ids. Follows profile-format r8 §1.12: metrics from `profile.rewards.metrics` (read-only adapter stub), cosmetics from a stub `te-cosmetics` manifest (`unlockedBy`), equip via `prefs.badgeId` / `prefs.borderId` with prefStamps, “new” via device-local `editor-prefs.achievementsSeen`. Month-chart badges are in the Badges tab and equippable; Verified creator and Made by TileEngine are trust marks, not cosmetics. Thresholds are accepted (profile-format r8 §1.12.9): sales 10/50/250 + border 100 (paid sales only); published 1/5/20 + border 10; achievements border 10 and a badge at 20. One badge and one border at a time. Sale counts show only on the owner’s profile; visitors see just the badge. Metric rewards pay no coins. Volume and Reset stay under Advanced. Appearance chips stay on the home; they are also in View (item 15).

**P2 (partial).** Stats sliders live on the unit sheet (plain language in Basic). Effect Designer is a real door (More + Sprite Studio “Glow: add in Effects”). Appearance (Light / Dark / Follow device) is also in View. More still shows Sprite Studio; Loadout stays Advanced.

**Captures:** `scripts/capture_69.py`. Audit: 0 undersized targets, 0 contrast fails, 0 JS errors, 0 off-device requests. Phone 390×844 and tablet 820×1180. Best shots: `69-picker-home-light.png`, `69-picker-home-dark.png`, `69-abilities-suggested-light.png`, `69-play-on-stage.png`, `69-stages-type-light.png`, `69-stages-palette-safe.png`.

**Gaps:** Play and Test still have no full battle runtime (same as r68). Kept art may draw as a generic prop if the stage hasn’t loaded its PNG yet. Ruins, wreckage and bandits are not in the Starter Pack. Run-layer “odd mix” is a hint, not a blocking dialog. Sound sheet and Home (Make / Open) were not reached. Achievement toasts are not fully queued off the board. Child and Quest giver exist in the pack list but not yet in the live NPC palette (Villager, Merchant, Guard, Elder only).
