# NPCs & Buildings — UX backlog (Editor & UX Designer)

Status: LOGGED, not designed yet. Picked up when the NPCs/Buildings section comes up.

## Idea 1 — Tap-an-NPC role menu (CEO via QA & Build Guard, 2026-11-10)

- Tap (click on PC) an NPC on the stage grid → a small menu opens beside it.
- Pick the NPC's role:
  - Sit / Idle
  - Wander within an area of tiles (e.g. walking around a shop)
  - Quest giver
  - Seller
- Each role shows a few fields only:
  - Wander: paint the area of tiles to wander in.
  - Seller: stock list (items, prices).
  - Quest giver: quest to give + its reward.
- Quick tools in the same menu: duplicate, rotate (facing), delete, settings.
- Goal: end users set up quests and shops with no script at all.
- Reference: menu idea from https://x.com/AreadneMaria/status/2114898325451444419 (sheep: Idle / Graze / Walk / Jump + duplicate, rotate, delete, settings). Ignore the clip's 3D look and free movement; only the tap-for-a-role menu matters.
- Constraint: all movement stays on the tile grid.
- Behaviours themselves: Behaviour Librarian (same idea sent there). UX here = the menu, fields, and phone touch flow.

### Open UX notes (to resolve when designed)
- Phone: menu as a small popover anchored to the NPC, falling back to the contextual sheet (≤40% height) if it would cover too much grid. Targets ≥48px, both themes.
- Wander area: reuse the Paint tool's tile-area brush, shown as a tinted overlay only while the NPC is selected.
- Stock list and quest picker need DSK formats (item, quest, reward) and Librarian behaviours before mocks.

### Librarian rev 19 (2026-11-10)
- behaviours.json `Ideas` list → `npc-role` ('NPCs and buildings', IDEA, v1:false). Roles idle / wander / quest-giver / seller. Menu order: role first, then that role's settings.

## Idea 2 — Quest giver → quest-chain tab (CEO spec via CoS, 2026-11-10) — IDEA, not v1
- Maker picks Quest on an NPC → confirm pop-up: "This NPC will become a quest giver and the quest editor will open. Are you sure?" (Yes / Cancel).
- Yes → a new tab opens holding all of that NPC's quest content.
- In the tab: write the dialogue; set the order of objectives; pick each objective from a basic set: Go to a place, Talk to an NPC, Kill N of a unit, Bring back an item.
- Phone-first, no scripting. Objective list = reorderable rows (drag handle ≥48px plus ▲▼ buttons, never drag-only); "Go to a place" picks a tile/area on the grid; "Talk to"/"Kill N" pick from the stage's units; "Bring back" picks an item + count.
