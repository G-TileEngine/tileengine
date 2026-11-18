# Editor ideas and principles logged 2026-11-10/11 (via Chief Of Staff). All PARKED / IDEA unless marked.

## Principles (apply across the editor now)
- P1 Basic + Advanced: most systems come in two modes writing the SAME data; switch either way any time. Basic = engine fills stock content/templates; Advanced = full depth. Makers choose what to hand-craft.
- P2 Status = recolour what's on the board, not icons/text (BTF): purple plate poison, yellow plate invincible, projectile aura from a buff (purple Piercing Shot after Poison), colour-coded melodies + matching sounds. Spell variants reuse one base sprite in new colours.
  Editor: per-status palette row (plate tint, projectile aura, sound) + "Make recolour variant" action on any sprite.
- P3 Code-drawn terrain is the default art style (consistency). Image-AI (Grok Imagine) for hero pieces and units.

## Literature aid (parked; with plugin/AI work after foundation)
- Optional button on a dialogue line → 3 reworded versions; pick one or keep own. Extra: write in own language → English options.
- Opt-in only; maker-chosen online AI service or on-device model. Original never replaced without the maker's pick.

## Basic quest maker (parked, with the quest tab)
- Pick stage + named NPC + one-line quest. Offline: sentence template with dropdowns "[stage] / [NPC] / [kill | fetch | reach | talk]" (or fixed-pattern parser); AI free text opt-in (same opt-in as Literature aid).
- Engine fills stock dialogue (give / in progress / turn in), objectives, markers, reward hook. Same quest data as Advanced; "Open in Advanced".

## Import: master-sprite variants + clean-up pass (CEO-approved to try)
- Master sprite: maker approves one; colour variants via hue shift / palette swap in-engine (no regenerating shading). Ties to P2 recolour action.
- Opt-in clean-up on import: snap near-white greys to white (white-point + threshold sliders), match brightness to master, key out magenta bg. Before/after preview; original kept.
- Tile seams: reuse BTF 'slab' technique (lane field MD), not new autotile edges.

## Store: BTF combat sprites = paid asset pack (parked with store)
- 85 files: plates (hp, hp-ward, hp-stand, dmg, dmg-venom), arrows (plain, holy, poison, poison-pierce, empower-pierce, back-arrow, raphael), fx single + frame sets (heaven-sword 6, thunder 7, tide 5, gust 2, five melodies), status (draught, mana, energy, gust), 28 angelic pieces. Not engine defaults.
- Store must handle: buy → import into the project's sprite slots (slot mapping screen) → recolour with hue-shift and clean-up tools.

## Store & hub monetisation vision (not a build step)
- Only a £5 subscription: bonus features, no creative advantage.
- Listings free or gold coins; real money later (after gold works + legal/Google research). Studio takes no cut.
- Gold buys ad spots + premium promoted hub section, clearly labelled, separate from top 100.
- Vote top-100 favours free and gold assets; no pay-to-stay-on-top.
- Gold easy to earn (a few assets/day), never feels time-gated.
- Code-drawn art is the flagship (no stolen-asset risk); keep drawing history as provenance.
- Risks: gold farming/bots, vote rigging, inflation, stolen uploads (report + takedown), free-pack flooding.

## Home hub (main menu) — hub & shell UX
- Everyone lands here before Build or Preview games/assets (League of Legends client model).
- Slots: shout-outs + featured small creator, events, gold-bought promoted section (labelled), leaderboard highlights. Then big Build / Play buttons.
