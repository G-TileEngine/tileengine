# Stage grid, live view: round 65 plan (Editor & UX Designer, 2026-11-11)

CEO brief via CoS (screenshot `/workspace/share/ceo-grid-floor1.jpg`, Floor 1). Goal: an RPG Maker-style stage grid
where you see the real tiles and sprites while you build, and you place things by tapping the board.
Rule kept: the profile (r64 `Experience.modeFor('stage')`) tailors the start; nobody is locked out. Same data, view only.

## 1. What the screenshot shows (problems)
- **Abstract squares.** River = light-blue squares, bricks = grey squares, units = letter circles (W, M). You build
  the game in your head and only see it on Play: the "back-and-forth dance".
- **The rail is the only way in.** Even "put a river here" means: pick a rail tool, open its sheet, choose a type,
  then tap. Users answer questions in tool sheets before they see anything.
- **No objects you can see.** There is no house; Objects only drops a placeholder marker, and it can't be moved,
  only toggled off and on again.
- **Selection is unclear.** The blue outline on an empty tile does nothing, and nothing offers what you could do next.
- **Grid lines are always on**, and the floating Undo and Map chips sit over the board.

## 2. Interaction model
- **Tap the board** (tap-to-place, primary in Basic): a small popover opens beside the tapped tile.
  - Empty tile: **NPC · Building · Terrain · Land**, then a short picker of real art (3 to 4 big thumbnails).
  - Placed thing: **Edit · Move · Delete**. NPCs also get **Assign behaviour**, listed first.
- **The rail** (Paint, Walls, Objects, Units, Move, More) stays for bulk and advanced work (primary in Advanced).
  While a rail tool is on, taps go to that tool as today, and the popover stays out of the way.
- **Popovers** sit beside the tile and flip left or right and up or down to stay on screen. They are at most 40% of
  the height, every target is 48px or more, nothing is hover-only, and Close, a tap outside or Esc dismisses them.

### Popover contents
| Tapped | First menu | Picker / next step |
|---|---|---|
| Empty tile | NPC, Building, Terrain, Land | NPC: Villager, Merchant, Guard, Elder → then "What do they do?" (role) |
| | | Building: House 2×2, Shop 2×2, Well 1×1, Tree 1×1 |
| | | Terrain: River (autotiled banks), Brick wall, Lava |
| | | Land: Grass, Brick path, Dirt |
| House / building | Edit, Move, Delete | Edit = swap the art (same picker) and "Blocks movement" on or off |
| Terrain or land tile | Edit, Move, Delete | Edit = swap type. Delete = back to Grass. After picking Terrain or Land, a "Painting River · Done" chip lets you keep tapping or dragging to paint more tiles |
| NPC | Assign behaviour, Edit, Move, Delete | Roles from `ux/npc-buildings-backlog.md`: Idle/Sit, Wander, Quest giver, Seller (role fields come later) |
| Hero or enemy unit | Edit, Move, Delete | Edit opens the existing unit menu (sprite, stats, behaviour) |

## 3. Move flow
- **Move** in the popover picks the thing up: it stays put, faded, and a **ghost** follows the finger, or each tap
  moves it to that tile. It snaps to the grid.
- **Footprint:** multi-tile objects show their whole footprint. It is **green** when it fits and **red** when it's
  blocked (off-map, river or wall, another building or a unit). A label says why in words, so colour is never the
  only cue.
- A bottom chip gives **Place here / Cancel**. Place is disabled while the footprint is red.
- **Drag:** press and drag a building, NPC or unit directly. Release drops it if green, or snaps it back if red.
  Dragging the empty board still pans as today.

## 4. View toggles (top bar "View" button → small menu)
- **Look:** Art (default) or **Simple blocks** (today's coloured squares and letter tokens). This is the
  "logic view" pro engines keep, and it's handy to see walkable versus blocked.
- **Grid lines:** On or Off (Off = seamless art). Walls and selection still show.
- **Tap menus:** On or Off. On by default in Basic and Off by default in Advanced, and either can switch.
- Saved per user in the profile (view prefs); never written to the project.

## 5. Basic vs Advanced (from `Experience.modeFor('stage')`)
| | Basic | Advanced |
|---|---|---|
| Tap the board | Opens tap menus | Selects only (tap menus Off), unless switched On in View |
| Rail | Shown, all tools | Shown, primary |
| Look | Art | Art (Simple blocks one tap away) |
| Grid lines | On | On |
Everything in both modes stays reachable: View menu, rail, ⋯ menu, Settings › My setup.

## 6. Undo
- Every tap-menu action is **one undo step** on the existing stage Undo stack (`state.paintHistory`): place,
  delete, move, swap art, assign role, and a paint run (one step per run, not per tile).
- The existing Undo button undoes them, in order, mixed with rail strokes. The Move and Painting chips sit above Undo so it stays reachable.

## 7. Maps to existing data (same data, view only)
| On screen | Data it writes (unchanged formats unless noted) |
|---|---|
| River, Brick wall, Lava, Grass | `map.logic.terrain` + `palette` via `ProjectStore.paintLogicTile` (water, wall_block, lava, floor) |
| Brick path, Dirt | same, new tile type ids `path`, `dirt` (**Q-A1**) |
| House, Shop, Well, Tree | `map.objects[]` via `addMapObject` / `updateMapObject` (`at`, `assetId`, `blocks`); footprint from the asset (**Q-D1**) |
| Move | `updateMapObject(id, {at})` for objects, `unit.x/y` for units, terrain index swap for tiles |
| NPC + role | unit in the stage's units with `kind: "npc"`, `npcRole` (**Q-D2**, **Q-L1**) |
| Art shown | resolved from `assetId` / tile type → Starter Pack recipe (code-drawn now; pack art later) |
| Look, Grid lines, Tap menus | user view prefs only, never the project |
Autotiled river banks are worked out at draw time from the neighbouring tiles; nothing extra is saved.

## 8. Phone vs tablet
- **Phone 390×844:** grid at 75% or more with sheets closed; popovers anchor beside the tile, or above or below it
  on narrow edges, at most 40% of the height; pickers are one row of 3 to 4 thumbnails (64px).
- **Tablet:** same popovers, bigger tiles; the board is centred, with room for the popover beside it. No separate layout.

## 9. Open questions
**Engine Architect**
- Q-A1: Add `path` (walkable) and `dirt` tile types to the terrain catalogue? Today there is only floor, water,
  wall-block and so on, and `wall_block` vs `wall-block` id spelling differ between the painter and the catalogue.
- Q-A2: Are multi-tile objects one object with a footprint (my preference), or one object per tile? Does the
  runtime hit-test the footprint, or only the anchor tile?
- Q-A3: Autotile rule set for water and path edges (4-bit edge mask in the mock; corners later). Is it computed at
  runtime from terrain, or baked at export?
- Q-A4: Is the CEO's grey "bricks" a blocking wall or a walkable brick path? The mock shows his grey as Brick wall
  (wall_block) and adds Brick path as a separate Land type.

**Data & Save Keeper**
- Q-D1: Footprint field: `asset.tiles: {w,h}` on the asset, or `object.size` on the placement? The mock uses
  asset-level `tiles`.
- Q-D2: NPC as a unit with `kind:"npc"` + `npcRole: {id, fields}`, or a separate `npcs[]` list?
- Q-D3: Where do view prefs live: in `profile.experience` (next to `areas`) or in a separate `profile.view`?

**Behaviour Librarian**
- Q-L1: The `npc-role` IDEA (idle/wander/quest-giver/seller): which behaviour ids should Assign behaviour write?

## 10. Mock status (round 65, local only, not public)
- Built in `ui-shell` as `js/stage-live.js` + `css/stage-live.css`, with 4 small hooks in `app.js` and a View button in `index.html`.
- Taps: a house takes 3 (tile › Building › House), and an NPC with a role takes 4 (tile › NPC › Villager › Wander).
  The old way was 2 taps for a 1×1 tree marker only (no house possible), or 5+ taps for a generic unit with a generic
  behaviour (no NPC roles).
- Also fixes an r64 bug: with a mouse, tile clicks were lost because the stage's pointer capture retargeted them.

## 11. Not in round 65
Role fields (wander area, stock list, quest editor), corner autotiles, real Starter Pack art files, multi-select,
rotation of buildings, a copy/duplicate action.

## Architect answers (2026-11-11, docs/engine-answers-round65-stage-grid.md sha c24b3472)
- Grey bricks = `wall-block` (blocks). Walkable `path` and `dirt` become catalogue tiles (DSK's call, not core). Edge walls stay separate.
- Multi-tile buildings: one object with a footprint; core only honours 1x1 anchor today. Full footprint + hit-testing is a LATER step (not 17/18). Mock footprints, label 'later'.
- Autotile: never stored, computed from neighbours at draw/bake, so moving re-flows for free.
- Tap-to-place is UX over the existing writers.

## DSK answers (2026-11-12)
- Q-D1: there's no asset.tiles. Footprint goes on map.objects[].footprint{w,h} (format r15 §6.4); the default comes from the Starter Pack or library entry, and user art is 1×1. `at` is the bottom-left cell (still to confirm with the EA). The core treats it as 1×1 until the footprint slice lands, so keep the 'later' label.
- Q-D2: an NPC is a normal unit placed in stage.neutrals[]. Its role is neutrals[].setupIds, which overrides the unit's own setup, and role fields are that setup's answers. Behaviour ids wait on the Librarian's Q-L1. Move writes the placement's `at`.
- Q-D3: the view toggles are device-local in editor-prefs.stageView{look,gridLines,tapMenus} (§11.3), never synced and not per project. A null tapMenus means on in Basic and off in Advanced.
- TODO next stage round: rename the painter's wall_block to wall-block, and move the stageView storage to the editor-prefs shape. DSK is adding path and dirt to the catalogue.
