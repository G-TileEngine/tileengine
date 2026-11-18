# MS-00 Play input and Talk (Editor & UX Designer, 2026-11-18)

Docs only. Builder: Grok Build / GrokHeavy. The engine keeps all rules; this spec covers only input, selection state and HUD in `tools/play-stage`. Base phone: 390×844 CSS (S21 Ultra, Red Magic 9 Pro).

## 1. Purpose and keep/drop
- Keep: HUD row (Attack, Spell, Talk, Wait, End turn), turn banner, unit plate, pinch zoom, one-finger pan, follow camera.
- Change: tap handling, confirm model, End Turn, Talk bubble → Talk panel.
- Drop: double-tap-to-centre (replaced by a Recentre button).

## 2. What the P1-9 code does today (snapshot `/workspace/apk-build/tileengine/tools/play-stage`, read-only)
These match all four CEO phone failures. Line numbers are from that snapshot.
| # | Code | Effect on phone |
|---|---|---|
| F1 | `board.ts` L101–106: a TargetCell needs **two taps on the same cell** (1st = preview, 2nd = confirm). | Every move/attack/talk needs a double tap... |
| F2 | `page.ts` L73: a 2nd tap within **280 ms** goes to `centre()` and is **never sent** as `up`. | ...and a quick 2nd tap is eaten, so attack/talk "do nothing" and the 2nd action "sometimes fails". |
| F3 | `page.ts` L51: tap → board coords use `box.s` and `padX/padY` only, **not `cam.x/cam.y/cam.s`**. | After a pan or zoom, taps land on the wrong cell, so a unit can't be selected. |
| F4 | `page.ts` L60/L74: 2nd finger down sends no `cancel`; `pointercancel` doesn't reset `drag`; no `setPointerCapture`. | After a pinch or a drag off-canvas, the gesture mapper can stay "pressed" and ignore the next tap. |
| F5 | `match.ts` L99: `endTurn()` only clears state when phase is `actMenu`; in `unitSelected` or `targeting` it skips straight on. | With a unit selected or a target mode open, End Turn fails or leaves stale state. |
The wolf side runs through `bot` with no pointer input, which is why it alone works.

## 3. Gestures (one handler on the canvas)
- `setPointerCapture` on down. Track pointers in a map.
- **Tap:** one pointer, moved < 10 CSS px from down, lifted < 350 ms. Sent as one `down`+`up` pair. No double-tap meaning at all.
- **Pan:** one pointer moved ≥ 10 px. Send `cancel` once, then pan. Pan delta is divided by `cam.s` so the map follows the finger 1:1.
- **Pinch:** a 2nd pointer down sends `cancel` for the 1st, then zooms (whole-number steps, as today). Ends when all pointers lift; no tap fires.
- `pointercancel` and `lostpointercapture` reset everything (pointers, drag, pinch).
- **Hit test:** `world = (offsetPx * dpr − pad) / cam.s + cam.{x,y}`, then `floor(/ TILE)`. One function, used by tap and Recentre. Hit area = cell + 8 px slop, never < 48 CSS px; if the cell is under 48 px, prefer the nearest unit within 24 px.
- Panning never changes selection, mode or menu. Panning is allowed in every phase, enemy turn included.

## 4. Selection and turn state (player side)
States: **Idle → Selected → Targeting(move | attack | spell | talk) → Animating → Selected or Idle**.
- **Tap own unit (has actions left):** Selected. Ring on unit, reach tiles shown, plate shows. Tap another own unit: switch to it (unless mid-animation).
- **Move is direct:** in Selected, tapping a blue reach tile **moves at once** (one tap). The path preview shows while the finger is down. No 2nd confirm tap (replaces F1).
- **Attack / Spell / Talk:** HUD button → Targeting. Targets from engine `targetsFor` highlighted (attack red, talk blue, spell gold). **One tap on a highlighted target acts.** If exactly one target, it is pre-marked and a bottom chip "Attack Wolf" (48 px) also confirms.
- **Tap anything else in Targeting:** back to Selected (selection kept). Tap empty ground in Selected: Idle.
- **Per unit:** `moved` and `acted` from the engine's action budget. HUD greys spent buttons; a fully spent unit dims and can't be selected (toast "Done this turn").
- **Animating:** taps ignored except pan/pinch. Lock ends when the walk or fx reports done (`endsAt`), with a **1.5 s fallback** that forces settle. After a move the unit stays Selected and the HUD shows Attack, Talk, Wait.
- Disabled buttons say why on tap: "No one next to you", "Already attacked".

## 5. End turn
- Fixed 56 px button bottom-right of the HUD row, outside the board.
- Always first: clear pending, preview, aims, Targeting and selection, close Talk panel (fixes F5). Then end the side.
- If own units still have actions: chip "2 units can still act · End turn" (tap again to confirm, or tap away to cancel).
- Disabled only while the enemy turn runs (banner shown). Re-enabled when YOUR TURN banner shows.

## 6. Camera
- One-finger pan, pinch zoom, **Recentre** button (48 px, top bar) centres on the selected unit, or the first own unit.
- Follow only while a unit animates and only if it would leave the screen; any pan stops follow (as `pan()` does now).
- Clamp to map edges as today.

## 7. Talk panel (replaces the bubble)
- Opens on a talk act from `unit.interacted`. Bottom sheet, ≤ 35% height, above the HUD row, safe-area padded.
- Contents: portrait 48 px (unit sprite frame), name in bold, text 16 px at screen resolution (EA ruling), typed at 30 chars/s.
- Tap the panel: finish the line; tap again or **Close** (48 px): close. Empty text: show the name and "…".
- Board ignores taps while open; pan still allowed. Talk spends the action.
- Reserved row for later buttons (Shop, Quest) for the cozy game; hidden in MS-00.

## 8. Project data
None new. Reads unit talk line and effects from setups per DSK D5. No save writes in play.

## 9. Acceptance checks (both phones, 20 runs each, 0 failures)
1. Tap hero, tap reach tile: moves with one tap.
2. Move, Attack, tap enemy: hit lands; enemy HP drops on plate.
3. Move, Talk, tap NPC: panel opens with text; Close works.
4. Two different heroes each act in one turn.
5. Pan far, zoom in, then tap a hero: it's selected (not a neighbour cell).
6. Pinch, lift both fingers, tap: tap registers.
7. Tap Attack then End turn: turn ends cleanly, enemies act, YOUR TURN returns.
8. Fast double tap on an enemy in Attack mode: exactly one attack.
9. Every disabled button shows a reason on tap.
10. Drag finger off the screen edge mid-pan, then tap: tap works.

## 10. Out of scope
HUD restyle (parked spec), Spell picker detail, Items, shop/quest UI, accessibility pass (parked to after P1-9).
