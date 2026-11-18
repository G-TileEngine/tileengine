# House builder: what the renderer needs (EUX draft, 2026-11-14)

Brief: CEO 2026-11-12, Afterfolk clip (/workspace/share/house-builder/afterfolk-reference.md): "aim for something like this but more robust (when the time comes)". Dedicated tool, later. Per the CEO's 23:47 ruling his ideas are dreams to weigh; only what truly helps the engine is listed. Marks checked by the EA against main d5b36b5f (2026-11-14); #1 and #3 revised below.

Marks: (a) folds into 33b-3 or step 34 without forcing it, (b) steps 1-34 group review, (c) own step later.

1. **Roof hides when a unit, the cursor or a target is under it.** (c), with the house builder step. Today canopy.ts cuts `above` tiles per cell (the unit's cell and the one above), with no fade and no group. Proposed: one layer field, cut "cell" | "group"; "group" hides the whole connected block on that layer, so a roof vanishes as one piece and forest canopy keeps the per-cell cut. Small CN from DSK. Step 34's dirty-box repaint already covers the cost.
2. **Interior/exterior switch.** (b) Decide the model, no new renderer code either way: same map with the roof hidden (item 1), or door to a linked interior stage through the step 30 world link. My pick: same map for small houses, linked stage for big ones.
3. **Multi-tile pieces with correct depth.** (b) confirmed, and the sort already works: (r+1)*tileH + dy, then c, rank, z, order. A house anchored bottom-left on its front row sorts by its front edge and its art overflows up and right (r27), so units behind are covered and units in front draw over it. A unit inside the footprint is the only wrong case, which #1 and #6 solve. Gap, not renderer: `footprint` w×h is reserved but v1 plays 1×1, so units walk through back tiles; reading footprint for blocking is a later step (c).
4. **Lighting inside.** (a) confirmed. light.ts masks every light through `createSight` over the grid's `blocks`, so wall tiles stop light like sight and a torch inside doesn't leak. A door opening or shutting is a new blocks array, which the plan cache keys on. Thin edge walls between two open cells don't exist yet, so that part is (c).
5. **Doors and windows.** (a) A door is a two-pose prop (open, shut) and a lit window is a Gives-light prop. Nothing new.
6. **Wall cutaway** (front walls drop to a low stub when a unit is behind or inside). (c) Needs wall pieces tagged front/back, which only the house builder makes.
7. **Storeys** (ground floor, upper floor, roof views). (c) The renderer shows one level at a time; stacking levels belongs to the house builder step.
8. **Builder overlays** (snap footprint grid, ghost preview tinted valid/invalid, quick-fix highlight). (c) Editor overlay only, on the existing overlay layer; designed with the tool.

Weighed and left out: the isometric 3D view and free rotation (no 3D), roof pitch and overhang nodes (that is art, not renderer), live material cost (game data, not renderer).

EA, 2026-11-14: #2 and #5-#8 confirmed. Nothing needs to go into 33b-3 or step 34.
