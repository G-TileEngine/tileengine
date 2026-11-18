# Unit "When it dies" — UX backlog (Editor & UX Designer)

Status: LOGGED as IDEA (CEO 2026-11-10, t51u). Not designed, not v1 unless CEO says.
Reference: ref-btf-acolyte-orbs.jpg (BTF: the four starter acolyte guards drop purple orbs; orbs fly to the killer's pieces to deal damage; orbs later combine to spawn a stronger enemy).

## Placement
- Unit editor → new row "When it dies" (under Abilities). Opens a list of effects; "+ Add effect". Several effects can stack, run top to bottom (reorderable, ▲▼ buttons, never drag-only).
- Each effect = one pick + a few sliders/pickers. No script.

## Effect set (proposal)
1. Drop loot — pick item or loot table; Chance slider (0–100%); Amount.
2. Curse the killer — pick a status (poison, burn, slow…) + strength + turns. Target: the unit that killed it / all its allies / tiles around.
3. Drop orbs (BTF acolyte style) — Count; what an orb does: fly to the enemy's pieces and hit for N / sit on the tile until picked up.
4. Orbs combine — "When N orbs are on the board, they merge into <unit>" (pick unit, pick N). Ties into 3.
5. Start or unlock a quest — pick quest: "Killing this unit unlocks / starts quest X" (only this specific placed unit, or any of this type).
6. Spawn units — pick unit + count + where (same tile / nearby).
7. Leave something on the tile — hazard, wall, or object for N turns.
8. Play a sound / effect — ties into Own sound bindings (action "dies").
- Quest kill counts are automatic (Kill N objective), no setting needed; note it in the row helper text.

## Scope choice per effect
- "All units of this type" (set in the unit editor) vs "Only this one" (set from the tap-an-NPC/unit menu on the stage). Per-unit overrides the type.

## Needs from others
- Librarian: on-death behaviours from BTF (acolyte orbs, merge spawn) as catalogue entries with tested numbers.
- Architect: event order (death → effects → quest count), orb flight on the grid.
- DSK: unit.onDeath[] format, loot tables.
