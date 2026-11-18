# ui-shell lessons for the new maker

r7, 2026-11-18, Editor & UX Designer. Docs only. The ui-shell is a prototype: reference only, never merged. This note keeps what the CEO's prototype testing taught us, so the real maker (tools/maker, engine-native, style-spec only) keeps the good patterns and drops the bad habits. New CEO feedback is added as numbered entries.

## Standing lessons (from `docs/maker/ux/r72-cleanup-plan.md`)
- No silent save failures: every load or save error is shown, typed and visible.
- Check uploads before using them.
- One voice in all copy.
- Every screen has a real empty state and a real error state.
- No XSS: user text is never injected as HTML.
- Long scrolling lists were replaced over the iterations by better tap-first versions (sheets, pickers, presets). The real maker starts from those versions, not from v1's lists.

## CEO feedback #1 (2026-11-18 22:46, via CoS): tap-to-add on the stage
**What worked.** Tap a tile on the stage preview and an **Add here** sheet opens, titled with the tile ("Tile 2,2"). It offers Unit, NPC, Building, Enemy, Lair sets and Terrain, with more rows below. After an NPC is placed, a follow-up sheet ("Merchant placed: What do they do? NPCs are friendly until you opt in to hostility.") offers Idle / Sit, Wander, Quest giver, Seller and Hostile · Off. The CEO called this great QoL. It made adding behaviours much faster and replaced v1's long scrolling list.

**What didn't.** None of those buttons did anything. The flow was a mock.

**The CEO's view.** The UI could still be better, but it served its purpose.

**Rules for the real stage editor (roadmap stage 3, step 4 on):**
1. Tap-to-add is the pattern: tap tile, then the **Add here** sheet, then place, then the **What do they do?** sheet.
2. Every option in both sheets is wired to real data and a real engine rule before it ships. An option that isn't wired yet is not shown (no dead buttons, no greyed 'soon' rows in the shipped maker).
3. The follow-up sheet's options are behaviour presets from the catalogue (e.g. Wander = neutral-roamer, Seller = npc-role vendor, Quest giver = quest slice). Each one writes `setupIds` on the placed unit or neutral. Fine-tuning opens the generic Behaviour panel.
4. Hostile stays off by default. NPCs are friendly until the user opts in.
5. The sheets follow `docs/maker/style-spec.md`, with 48 px targets, and work at 390 px. The visual polish can improve on the prototype.

Prototype shots (CEO's phone, gh-pages shell, 2026-11-18): "Tap a tile: Add here sheet" and "Merchant placed: behaviour sheet". They were passed by CoS and aren't stored in the repo.

## CEO feedback #2 (2026-11-18 22:54, via CoS): abilities
**What worked.**
1. **The word "abilities".** Users see "abilities", not "behaviours". The catalogue and the data keep the word behaviour (`behaviour-library/`, `setupIds`); only the user-facing word changes.
2. **Browse by goal.** **+ Add ability** opens a streamlined sheet:
   - a **Suggested for this unit** chip (e.g. "+ Pair with Stun");
   - **Start from a role** (Warrior, Archer, Mage…);
   - **Browse by goal** cards: Move (walk, step, reach), Attack (strikes and shots), Defend (shields, walls, taunts), Support (heals, cleanses, buffs), Spells (waves, bursts, summons), Status (stun, poison, push) and AI (how a bot chooses).

   Each goal lists its abilities with a search box ("Tap a card to add it with defaults"). For example, Status holds Stun, Trap Tile, Slow Tiles, Damage over Time and Push. Each card has a small tile diagram showing how it acts on the grid. This replaced the long list, and it saves rebuilding the demo after every addition, because the picture gives the gist.
3. **Star count badge.** A unit with abilities shows a star badge with the count (✦4) on the stage preview, so it's easy to track what's been added.
4. **Simple removal.** Hold or tap a unit to get a sheet titled with its name and team ("Warrior A · Your team") with Edit, Move, Delete and Test. Edit shows its ability list, where each row (e.g. Basic Attack, Taunt, Lane Sweep) has **Test** and **×**. Tap × to remove one. Below the list are **+ Add ability** and a whole-unit **▶ Test**.

**The CEO's view.** The latest iteration is much more user friendly, easy to understand, and gives a lot of information without clutter.

**Rules for the real ability editor (roadmap MS-04, step 5 on):**
1. The flow is the pattern: + Add ability, then suggested, role or goal, then the goal's cards with tile diagrams, then tap to add with defaults, then fine-tune in the ability panel (sliders and pickers in catalogue menu order, bans greyed, Reset to default).
2. Only wired abilities are shown, the same as #1. A goal card with no wired abilities is hidden. Roles and suggestions offer only wired abilities.
3. Every per-ability **Test** and the whole-unit **▶ Test** must actually run the engine (the play stage) on that unit. There are no mock results.
4. The tile diagrams are drawn from the ability's own data (its shape and range), never hand-drawn per card, so they can't drift from what the engine does.
5. The ✦N badge counts the unit's attached setups and updates as soon as one is added or removed. Removal is one undo step.
6. Goal groups, role presets and suggestions come from catalogue data (Librarian), not from code lists in the screen.
7. The sheets follow `style-spec.md`, with 48 px targets, at 390 px, and an AA-contrast badge.

Prototype shots (CEO's phone, 2026-11-18, passed by CoS, not stored in the repo): "Browse by goal", "Status abilities with tile diagrams", "Star count badge on unit", "Hold unit: Edit, Move, Delete, Test", "Assigned abilities list with Test and remove" and "Add ability sheet".

## CEO feedback #3 (2026-11-18 22:56, via CoS): studio hub
**What he tested.** The studio hub, with a bottom bar of Shop, Games, Creators and Requests. The Made games screen has a Recommended card on top ("Ashroad Skirmish · RaiKynn · game · 210 all-time thumbs · Fresh pick each time you open this screen") and a two-column grid of game cards (cover, title, maker, store such as ITCH or APP STORE, a "Yours" tag on your own games, and the creator row). The screen has Back, a bell and a "Proposed: not final" banner.

**The CEO's view.** Good across the board. Most functions partly work in a simple test zone, and he found nothing to change in what he tested. It just needs to actually work.

**Rules for the real hub (roadmap post-launch, after the online layer):**
1. Keep the hub's layout and flows as they are: the four tabs, Recommended on top, the card grid and the creator rows.
2. Build each part engine-native (tools/maker, style-spec only) once its data and the optional online layer (accounts, asset hub) exist. Never ship a tab or button before its data and server side work, the same as #1 and #2.
3. Thumbs, the chart, Recommended and the coin rules follow `docs/maker/ux/social-hub-plan.md` and `coins-library-chart.md` (earn-only coins, Apple 3.2.2 and Google Play rules).
4. The core maker stays offline-first. Without the online layer the hub is hidden, never a mock.

Prototype shot (CEO's phone, 2026-11-18, passed by CoS, not stored in the repo): "Studio hub Made games".

## CEO feedback #4 (2026-11-18 22:58, via CoS): thumbs-up chart, and the web-browser feel
**Thumbs-up chart: keep.** He tested the chart: Games and Shop assets tabs, asset of the month, the leading entry, the daily update and votes left. He found it pretty much okay. Same as #3: the layout and flows stay as they are, and the real build just makes it work, engine-native, once its data and the online layer exist. It follows `coins-library-chart.md` (one thumbs-up per account per day, never for your own game, earn-only coins). It's hidden when offline, never a mock.

**Web-browser feel: game UI must not look like an AI 'website'.** CEO, earlier session, re-sent by CoS 2026-11-18 23:02:
> "Yes, UI was the bigger concern. Whether its claude, chatgpt, grokbuild, they love to make the game UI boxes and circles. Think of how dungeon crawlers have their circle, one is split into mana, the other health, then on either side or bellow is abilities. Or MMORPGs with healthplates and mana at the top left with a character profile icon. Typically one glance at most AIgamedev posts and i can tell 'that is A.I hallmark'. So need a way to avoid 'website' standard style and aim for more tripleA standards. Having something that can make that can go a long way in terms of polishing how everything looks when combined together."

**Answer: a game UI kit built from proven HUD layouts** (roadmap MS-22):
1. **Start from a layout preset, never a blank box:**
   - **Orbs:** dungeon-crawler health and mana orbs (one may be split), with the ability bar between or below them;
   - **Portrait plates:** MMO style, a top-left portrait with health and mana plates;
   - **Tactics corner;**
   - **Minimal.**
2. **Dress it with real game parts from the project palette:**
   - framed portraits;
   - liquid-fill orbs with glass shine and a drain trail;
   - bevelled ability slots with a cooldown sweep;
   - ornate 9-slice frames.

   No flat boxes or plain circles.
3. **Basic is two taps:** one layout pick plus one look pick. Advanced opens the parts.
4. **Scope (CEO 2026-11-13):** the kit styles **games only**. The editor stays on the calm r62 look (`style-spec.md`, no other theme). The editor's play and preview always show the game's own HUD exactly as players will see it.
5. **Offline:** TileEngine never calls an AI service. Outside AI art stays 'bring your own picture'.
6. Same as #1 to #3: no HUD part ships before the engine draws it for real.

Not tested, so not marked: `profile-achievements.md`, `starter-pack-v2-plan.md`.

## CEO feedback #5 (2026-11-18 23:22, via CoS): Sound Studio
> "A sleeper hit... very barebone and barely got any love (iterations)... i was happy with the base foundation."

**Keep.** The base foundation stays. It needs the same iteration rounds that Sprite Studio and the Effect Designer got before it ships as MS-21.

## CEO feedback #6 (2026-11-18 23:22, via CoS): Sprite Studio
> "Great feature... very easy to use."

Importing into the game preview never worked.

**What the CEO asked for:**
- **(a)** There is no way to start fresh: he had to close and reload the shell, and the stage preview has the same problem. He wants a **clear-all / start-anew button beside View, with a warning**, in every tool, not only Sprite Studio.
- **(b)** In the Make walk bug, depending on the sprite, walk left looks like walking right and vice versa. He wants an **Invert** control that swaps left and right.
- **(c)** Tidy needs a lot more polish, because the result is sometimes uglier than the original.

**Proposed UX answer (Editor & UX Designer, not CEO rules):**
- Start new is one undo step, or it can be recovered from trash the way project delete can.
- Invert is one undo step.
- Tidy shows a before/after and offers **Keep original**, so it never replaces the original without the user's pick.

**Overall good. Keep.** MS-06 must ship a working **import into the stage/game preview**, with a real Test.

## CEO feedback #7 (2026-11-18 23:22, via CoS): Effect Designer
> "The iterations were really good."

He spent 1–2 hours fiddling. Breed plus the power-up tiers make crazy combinations. Little negative: "A solid foundation that can only go up from there."

**Keep.** MS-07 carries breed and the power-up tiers forward as they are.
