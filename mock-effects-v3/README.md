# Effect Designer v3 mock (layers, beats, merge)

A clickable phone-first mock (390 × 844) of the Effect Designer v3. It shows the CEO's "not linear, effects merge" vision on top of the approved UX v3 flow.
Design note: `../../ux/design-notes/effect-designer-v3.md`. UX v3: `../../ux/effect-designer-v3-ux.md`. EA scope: `share/effect-designer/scope.md`.

Plain HTML, CSS and JS, with no build, no dependencies and no network. Open `index.html` straight from `file://` or from any static server. State lives in memory and resets on reload. The CSS token block is copied from `../css/app.css` (the r62 look), so the folder works on its own.

## Files
- `index.html`: the shell (thin top bar, preview strip, layer strip and meter, roll history, beat row, body, sheet, bottom bar).
- `js/fx-render.js`: the pixel renderer. Day uses btf-ashroad@3 effect ramps and night (House style: Moonlit) uses btf-moonlit@4, both from `ux/design-notes/effect-ramps/ramps.json` (sha 700f5e13903d). Light pop is a soft falloff in pixel rings, not a flat disc.
- `js/fx-model.js`: the editor-side model. Blend, take, dice, breed, fit (merge rule 4), house-style families and reactions. Both is joined steps, each with its own tint_ramp (the rim is the outer step’s ramp). A blend’s `variant_seed` is `hash(A.seed, B.seed, mix snap, base side)`. Shelf entries are references; a shelved layer is a one-part effect doc. Tiers v1 only switch extra steps on, and tier-up runs through Fit. The meter shows particles (of 32 on a preset, of 48 on a blend), draws of 60, and steps of 12.
- `js/fx-ui.js`: the UI, gestures and sheets, plus the `window.__fx` hooks the capture script uses.
- `scripts/capture.py`: Playwright capture plus the touch and contrast audit. It writes `shots/*.png`, `shots/shots.json` and `shots/touch-audit.json`.

## Try it
- **Basic, 3 taps:** Slash is pre-picked from Cleave. Tap a card, then tap **Save & use**.
- **Layers:** tap a chip (Shape, Colour, Sparks, Light, Punch or Trail) to see only that layer's 2–3 sliders.
- **Blend:** hold a card about 0.4 s, then drag it onto another card. The card you drop onto is A, the base, and owns the Hit (a small **leads** marker; tap it for the meaning). The default blend sheet shows the two parents, a Mix slider (snaps 0/25/50/75/100), a slim Steam **Try** when relevant, and **Fine-tune parts ›**. Per-part A/B/Both lives on that second page, or in a popover when you tap a layer chip. Variant B (`?blend=chips`) drops the Fine-tune row and coaches “Tap a part to pick A, B or Both” once. Tap alternatives: ⋯ → **Blend with…**, or hold a card → **Blend into current**. Keyboard: focus a card and press Shift+F10.
- **Take a part:** hold a card and release it without moving.
- **Shelf:** tap ♡ on a card, or **Shelf it** in a layer sheet.
- **Roll:** the 🎲 button in the preview.
- **Advanced:** shows the beat row. Tap a beat to take it from another effect, nudge it ±30 ms, start the effect there, or tap the rhythm.
- **Lab:** the bold ideas. **House style:** the project's defaults.
- **Mock controls:** ⋯ → "Mock: someone edits Fireball" or "Mock: Fireball is removed" shows the provenance chip states.

## Capture
```bash
/workspace/.pwvenv/bin/python scripts/capture.py    # tooling only; uses /usr/bin/google-chrome when present
```
The drag and long-press shots use real touch events (CDP `Input.dispatchTouchEvent`), not script calls.
