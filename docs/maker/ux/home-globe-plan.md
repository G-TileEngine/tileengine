# Home globe carousel — plan only (after r70)

**Status:** ACCEPTED (the six UX questions, 2026-11-12 07:09 Europe/London) and BUILD approved 07:10, still unpublished. A live r71 build may land in `ui-shell` locally; nothing is published, and a publish still needs the CEO's own SEND. CEO direction 06:51, relayed by the Chief Of Staff: replace the stacked New project buttons with a 'globe' interface — "you flick to the left or right to get the next option. Think of text circling and attached to a 🌎 without the globe itself."

**Owner:** Editor & UX Designer  
**Live base:** gh-pages `141cae6` (r70). This plan sits on top of that.  
**Mocks:** `ui-shell/mock-globe/index.html` (standalone, real swipe physics)  
**Shots:** `ui-shell/screenshots/72g-*.png`  
**Capture:** `ui-shell/scripts/capture_72_globe.py`  
**Does not touch:** `ui-shell/js`, `ui-shell/css`, `ui-shell/index.html`. Nothing is published. A build needs the CEO's own SEND.

---

## 1. Goal

Keep the Home hero card. Replace the eight stacked New project buttons with a horizontal 3D ring carousel: option labels and icons sit on an invisible rotating ring. The front item is large and in focus. Neighbours shrink, fade and curve around the back. A flick left or right spins the ring with momentum and snap. There is no visible globe, no meridians, no sphere mesh.

Basic adds zero extra taps: the front item is the one the player is most likely to open, and a tap on it opens it.

## 2. Locked rules

Same as the rest of the editor:

- Phone-first. Thin top bar. Home has no bottom rail today and this plan does not add one. Sheets stay at most 40% if any confirm is needed later (unfollow-style), which this control does not need.
- Calm r62 look. No "Isberg Labs" density: no grid overlay, no neon, no visible wire globe.
- 48 px+ touch targets. AA contrast, light and dark.
- All code stays hidden. Short, plain words.

## 3. What stays

Exact r70 Home chrome and copy, from `ui-shell/index.html` `#screen-home`:

- Top bar: eyebrow **TileEngine**, title **New project**, bell.
- Hero card: **Make a grid game** / *Buttons and sliders only. No code. Built for RaiKynn, players, and indie makers — all stages authored in the engine.*
- **About** disclosure and the prototype hint, below the globe.
- The eight options, same labels and destinations:

| # | Label | Action (r70) | Proposed icon |
|---|---|---|---|
| 1 | Standalone engine | New Project wizard (`#btn-standalone`) | A 3×3 grid |
| 2 | Open blank stage | Stage editor (`data-nav="stage"`) | An empty frame |
| 3 | Studio profile | Studio profile | A person |
| 4 | Made games | Made games library | A small window of tiles |
| 5 | Thumbs-up chart | Monthly chart | A thumbs-up |
| 6 | Asset shop | Hub shop | A bag |
| 7 | Project settings | Project settings | A gear |
| 8 | Export project | Export project JSON | An outgoing arrow |

r70 buttons have no icons. The mock adds calm monoline icons so a label still reads as it curves away. They can be dropped if the CEO prefers text only.

## 4. Layout geometry

The ring is a CSS 3D circle in the XZ plane, seen with a perspective camera. Items are tangent to the ring (`rotateY` then `translateZ`), so the labels foreshorten as they curve around the back — attached to an invisible globe, without drawing one.

**Phone (390×844), content width 358 px:**

- Stage height: 248 px. Perspective: 900 px. Ring radius: 230 px.
- Item card: 176×72 px (icon + wrapping label, 48 px+ target). Width stays under the 8-gon chord (`2R tan(180°/N)` ≈ 191 px) so neighbour cards do not intersect the front card in 3D.
- Angular spacing: 360° / N. For the current 8 items that is **45°**.
- Visible: the front item plus two on each side (**5 of 8**). The three at the back are opacity 0 and `pointer-events: none`.
- Arrows (48×48) sit under the ring, flanking the caption, so side cards and a mid-spin are never covered by the chevrons. Dots sit in a row below that, in 48×48 hit areas. On a 390 px phone the eight dots use a 2 px overlap so each target stays 48 px wide.
- A one-line caption under the front item (**Q4 ACCEPTED**).
- No CSS `mask-image` on the 3D stage (it flattens compositing). Side items fade with the opacity curve alone.

**Scale / opacity / blur**, where φ is the shortest angle from the front (0 at the front, π at the back), and frontness = 0.5 + 0.5 cos φ:

- Scale = 0.55 + 0.45 × frontness. Front = 1.00, 45° ≈ 0.93, 90° ≈ 0.78, back = 0.55.
- Opacity = clamp(0, 1, (cos φ − cos 70°) / (1 − cos 70°)). Front = 1.00, 45° ≈ 0.68, 70° = 0. Items past 70° are `visibility: hidden` (opacity 0 alone can still leave a ghost face at the back of the ring).
- No CSS `blur()` or other filters on the 3D items. Filters flatten the preserved-3D tree and can leave a ghost box under a neighbour card. Depth is scale, opacity and `rotateY` only.
- z-index follows cos φ, so the front card paints on top.

The front card uses the primary fill (`--accent` / `--accent-ink`). Neighbours use the ghost treatment (`--surface` / `--ink` / `--line`). Only the front card is a reading target for AA; receding labels are wayfinding and will drop below AA as they fade, which is why the live region and listbox name always speak the front item in full.

**Caption (Q4 ACCEPTED):** one muted line under the ring, e.g. "Start the New Project wizard". It swaps with the front item and does not add a tap.

## 5. Physics

No canvas library. A single `requestAnimationFrame` loop runs only while dragging, coasting, or snapping, then sleeps.

- Work in item space: `pos` is a float, item *i* lives at integer *i*.
- Drag: 108 px of horizontal travel = 1 item on the phone (a little more on wide layouts, scaled to radius). Swipe left brings the right-hand neighbour forward.
- On release, velocity is the average of the last ~80 ms of movement.
- Coast: `vel *= 0.92` per frame at 60 fps (frame-rate independent).
- When `|vel|` drops under 0.012 items/frame, snap to the nearest item with a short spring (stiffness 0.18, damping 0.75), about 200–280 ms. On snap end, `pos` is normalised to `[0, N)` and the live region announces.
- The ring **loops infinitely** (Q1 ACCEPTED). Export project sits next to Standalone engine.

## 6. Gestures, taps, keyboard, pointer

**Flick vs vertical scroll.** The page still scrolls. The globe claims the pointer only after 8 px of movement, and only if `|dx| ≥ |dy|`. Once claimed, the gesture stays horizontal until release. A mostly vertical move is left to the page.

**Taps**

- Movement under 10 px is a tap, not a flick.
- Tap the front item (or press Enter / Space) to open it.
- Tap a visible side item to bring it to the front. It does not open.
- Tap an arrow to step one item. Tap a dot to jump to that item (shortest path if the ring loops).

**Mouse and trackpad (tablet / PC)**

- Drag on the stage, same physics as a finger.
- Wheel or trackpad over the stage spins the ring (`deltaX` if present, otherwise `deltaY`). 80 px of wheel = 1 item. After the wheel pauses (~80 ms) it snaps. Wheel outside the stage scrolls the page.

**Keyboard**, when the stage is focused:

- Left / Right: previous / next.
- Home / End: first / last (Standalone engine / Export project, in list order).
- Enter or Space: open the front item.
- The stage is a single tab stop (`tabindex="0"`). Arrows are also tab stops. Dots are click-only, not in the tab order.
- A 3 px `--focus` ring is drawn on the stage for `:focus-visible`.

**Open.** The existing r70 navigation. Opening an item stores it in device-local prefs (`homeLast` on `tileengine.editor-prefs.v1`). The next time Home opens, that item is in front. First time, or if the stored id is unknown: **Standalone engine** (Q2 ACCEPTED).

## 7. List view toggle (Q6 ACCEPTED)

A small **Globe / List** segmented toggle sits in a header row just above the ring (and above the stacked list, when that is showing). It is for everyone, not only reduced-motion users.

- Each segment is at least **48×48** px, calm r62 treatment: a single 14 px rounded group with a `--line` border, the selected segment filled with `--accent-soft` and `--ink`. Light and dark.
- Default is **Globe**. Basic adds zero extra taps: the front item (last-used, or Standalone engine the first time) is ready to open. The toggle is there if someone wants the stacked list; they do not have to use it.
- The choice is remembered **per device** in the existing editor prefs store (`tileengine.editor-prefs.v1`), proposed keys: `homeView` (`"globe"` | `"list"`, default `"globe"`), alongside `homeLast` and `homeHintSeen`. No new format and no new store.
- `prefers-reduced-motion: reduce` **forces the stacked list**, even if `homeView` is `"globe"`. The pref is not overwritten. The toggle **stays visible**. The List segment is selected (it matches what is on screen). The Globe segment stays visible but is `aria-disabled`, and a quiet one-line note reads: "This device asked for less motion, so the list stays on." When reduced motion is off again, the saved `homeView` returns.
- In List view the eight r70 buttons are shown in their original order, with the last-used item (or Standalone engine) using the primary fill at its usual place in the list — we do not reorder the list, so the Primary treatment moves to that row. Keyboard and screen-reader users get ordinary buttons. No spin, no 3D, no first-run wiggle.

## 8. Accessibility and reduced motion

- The stage is a `listbox` with `aria-roledescription="carousel"` and `aria-label="New project options"`.
- Each option is `role="option"` with `aria-selected` on the front item and `aria-activedescendant` on the listbox.
- A polite live region announces `{label}, {n} of {N}` when a snap or a key move settles, not while dragging.
- Reduced motion is described in §7: it forces the list, the toggle stays visible, and the saved Globe/List pref is kept.

## 9. Tablet and PC

From 768 px the shell is no longer a 390 px phone frame. It becomes a wider rounded stage, still centred on the dark page:

- Tablet (~1024×768): stage about 720 px wide, radius 320 px, perspective 1200 px, item 200×80, stage height 300 px.
- PC (~1280×800): stage about 880 px wide, same radius family so the ring does not feel lost in the width. Hero stays above the globe, same copy, a little more padding.
- The front item stays the same control. Basic still adds zero taps.
- Mouse drag, wheel, and the keyboard map in §6 all apply.

## 10. Edge cases

- **8 items is already 7+.** 45° spacing and the opacity curve keep five visible and the back three gone. The front card does not shrink.
- **More than 8:** keep spacing at `360° / N`, keep about five visible by tightening the opacity cutoff, and do not shrink the front card. If we ever pass ~12, swap the dots for a quiet `3 of N` counter so the dot row does not wrap into a second line.
- **Fewer than 3:** fall back to the stacked list. (Home has 8, so this is only a safety.)
- **Last-used missing or unknown:** Standalone engine.
- **First-run hint:** a muted chip, "Flick left or right", over the lower part of the stage. It shows once, then is stored as seen. It goes away on the first flick, key, arrow, or after about 6 seconds. A very small one-shot nudge (±0.18 item, no spin around the back) can play under the hint; it is off when reduced motion is on, and the capture script freezes it.
- **Haptics (Q5 ACCEPTED):** a 10 ms `navigator.vibrate` tick on each snap, off when reduced motion is on. Fail quietly if the API is missing or blocked.

## 11. Performance

- CSS 3D only: `perspective` on the stage, `transform: rotateY() translateZ() scale()` on items, `will-change: transform` only while the ring is moving.
- `backface-visibility: hidden`. No canvas, no WebGL, no Three.js or other library.
- One rAF loop, stopped when `vel` is 0 and the snap has settled.
- 8 DOM nodes for the options. Do not put `mask-image`, CSS filters, overflow clipping, or non-3D siblings inside the preserved-3D stage; they flatten the ring or leave a ghost box.

## 12. Build estimate

The CEO approved the r71 **build** at 07:10 Europe/London. Folding this into the live Home is about **half a day**: new `css/home-globe-r71.css` and `js/home-globe-r71.js`, plus minimal hooks in `index.html` and `app.js`. The eight r70 Home actions stay the same. Publish still needs its own SEND.

## 13. CEO decisions (ACCEPTED 07:09 Europe/London)

Relayed by the Chief Of Staff. These are locked for the r71 build. The build itself was approved at 07:10; publish still needs its own SEND.

1. **Loop forever.** The ring loops infinitely. Export project sits next to Standalone engine.
2. **Open on the last-opened option.** Remember the last option they opened (device-local prefs). Use **Standalone engine** the first time, or if the stored id is unknown.
3. **Both** dots and arrows.
4. **Yes.** Show a short one-line description under the front item (for example "Start the New Project wizard").
5. **Yes.** A light haptic tick (`navigator.vibrate`) on each snap, on phones that allow it. Off when reduced motion is on.
6. **Add a List view toggle for everyone**, not only reduced motion. Remembered per device. Reduced motion still forces the list, and the toggle stays visible. Globe remains the default, so Basic adds zero taps.

## 14. Mock and shots

Interactive mock: `ui-shell/mock-globe/index.html`. It mirrors the r70 hero and labels, with working flick physics, the Globe/List toggle, arrows, dots, caption, keyboard, wheel, light and dark, and the reduced-motion list (toggle still visible). Opening an item in the mock shows a toast only; the live r71 build navigates as r70 did.

Screenshots, all from `scripts/capture_72_globe.py`:

- `72g-phone-light-front.png` — 390×844, light, front = Standalone engine, first-run hint visible
- `72g-phone-light-midspin.png` — mid-spin between Standalone engine and Open blank stage
- `72g-phone-light-side.png` — Studio profile brought to the front
- `72g-phone-dark.png` — dark, front = Standalone engine
- `72g-phone-toggle-globe.png` — Globe segment selected, ring visible
- `72g-phone-toggle-list.png` — List segment selected, stacked r70 buttons
- `72g-phone-reduced.png` — reduced-motion stacked list, toggle still visible
- `72g-phone-keyboard.png` — keyboard focus ring on the stage
- `72g-tablet.png` — 1024×768 wide layout
- `72g-pc.png` — 1280×800 wide layout
- `72g-sheet.png` — contact sheet of the phone shots
- `72g-sheet-wide.png` — tablet and PC
- `72g-audit-report.json` — console errors (expect none) and target sizes

## 15. Caveats

- The six UX answers are ACCEPTED and the r71 build was approved at 07:10. Nothing is published without a separate CEO SEND.
- Icons are new (r70 buttons are text-only). The caption is now accepted (Q4).
- The mid-spin shot is a frozen pose, not a video.
- Home still has no signed-out state (an r70 gap); this plan does not add one.
- `homeView` / `homeLast` / `homeHintSeen` live on the existing device-local editor prefs key, not in the synced profile document.

### Asset-only Home option NAMED (CEO 15:03 London, via CoS)
Label: **"Make assets"**. It is the 9th Home globe option, placed next to Standalone engine (it also appears in the List view). Replaces the "Asset only (name TBD)" placeholder. Building it still needs CEO SEND.
