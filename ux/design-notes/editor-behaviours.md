# Editor behaviours, borrowed from Vercel's UI SDK (reference only)

CEO 2026-11-12 22:05. We **don't install it**: TileEngine ships no runtime dependencies and works offline. Reference: [vercel-labs/ui](https://github.com/vercel-labs/ui) (beta, `@ui-sdk/core`). It packages keyboard navigation, focus, selection, dismissal, popups, drag and drop and the ARIA (screen-reader attributes) they need as reusable "behaviors", for example `createFocusRecovery`. We copy the ideas, not the code.

Today each module rolls its own popups: `closePop` in stage-live, `openSheet` in sprite-studio, plus others in welcome and qol. That is the main thing to unify.

Only what the editors need, in plain JS, as one small shared file (`ui-shell/js/te-behave.js`, about 150 lines):

| # | Pattern | Needed by | Plain-JS plan |
|---|---|---|---|
| 1 | **One way to open and close popups and sheets** | All three editors: Sprite Studio sheets (Tidy, Preview, Colours), Effect Designer step menus, map editor prop and NPC menus, stage-live pop | `te.open(el, {from})` / `te.close()`. Keeps a stack so only the top popup closes. Esc, the back gesture (`popstate`), a tap outside, and the close button all call `te.close()`. On a hash change, close everything (stage-live does this already). |
| 2 | **Focus returns to the right place** | Same screens, plus the PC keyboard path | `open` remembers `document.activeElement` and `close` focuses it again. If that element is gone (after a delete), fall back to its row or the tool button (like `createFocusRecovery`). While a popup is open, Tab stays inside it. |
| 3 | **Consistent selection** | Sprite Studio frames and parts, Effect Designer steps, map editor tiles and props | One `te.select(list, item, {multi})` model: tap selects, a second tap opens settings, long-press or Shift adds to the selection, Esc clears. Sets `aria-selected`, with one style for selected items across tools. |
| 4 | **Drag and drop that works by touch** | Reordering Sprite Studio frames, reordering Effect Designer steps, placing props on the map editor's edge decoration and grid | Pointer Events only (`pointerdown/move/up` + `setPointerCapture`), not HTML5 `draggable`, which doesn't work on phones. Start a drag after a 6 px move or a 300 ms hold, so scrolling still works. The drop target is highlighted, Esc or a cancel snaps back, and there are always Move up/down buttons as the keyboard and screen-reader way. |
| 5 | **Screen-reader labels** | Every icon-only button (bottom rail, tool chips, frame thumbs), sliders, and the live preview | `aria-label` on icon buttons; sliders use `<input type=range>` with a label and `aria-valuetext` ("200 ms per frame"); popups use `role=dialog` with `aria-modal` and `aria-labelledby`; one shared `aria-live=polite` region for "Tidied: 3 stray…"-style messages (the existing `say()`). |

Not needed now: comboboxes, menus with typeahead, virtualised lists, a full roving-tabindex system.

**Engine-side?** None of this touches the engine or the save formats. It is all editor and ui-shell code. The only engine-side link is that exported games should reuse #1, #2 and #5 for in-game menus, if the Architect wants that.
