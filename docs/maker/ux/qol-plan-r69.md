# TileEngine — QoL plan, r69 (plan only)

**Owner:** Editor & UX Designer  
**Status:** PLAN. Local only. Publishes with the CEO’s SEND, never before.  
**Builds on:** live r67 converter, r65 stage tap-menus, and r68 (body-map walk, converter fixes, unit tap-to-edit, abilities list, Test, Place unit on the art view).  
**Also in r69:** Keep creates a project asset the stage catalogue can place (already planned).  
**This is not a build.** Live prototype files were read only.

Principles kept: don’t dumb it down; add help for amateurs; Basic and Advanced write the same data (Basic gets zero extra taps, depth under Advanced); a few buttons and sliders, no code; locked shell (thin top bar, bottom rail, sheets ≤ 40%, grid 75%+ when closed); calm r62 look; 48px+ targets; AA contrast; light and dark.

---

## Already in r68 — do not re-plan

Body-map walk; tolerance-0 fringe; pink hint; Light-from-top-left wrap and colour cap; tapping a unit in edit opens the editor menu, not the battle menu; tile tap menu and tooltip; Place unit stays on the art view with a snapping ghost; wall erase; the unit’s abilities list and badge, plus Test; Behaviour opens that list first, with an Add behaviour button (no longer jumps straight to the picker); the stage-card size label that currently reads `undefined×undefined` (in progress in r68 — do not re-plan it).

r68 is the floor this plan stands on. Gaps that remain after those fixes are what r69 is for.

---

## P1 — 1. Behaviour picker overhaul  *(headline)*

**Effort: L. Basic = modern browse (goal tiles, cards, role presets, suggested chips). Advanced = today’s searchable list, polished and grouped.**

### Problem

Even after r68 shows the unit’s list first, **Add behaviour** still opens a full-screen laundry list of the catalogue. Day-one starters come first, but they mix unit abilities (Movement Pattern, Basic Attack) with project rules (Action Budget, Damage Resolution, Win Condition, Army Roster). Rows are long catalogue names and truncated prose. A hint about “Ability Availability is Off by default” sits above the list. The first tap is often the wrong kind of thing. Then a 12-knob form (three questions all labelled “What costs an action?”, “placeholder value” tags, Back and Cancel side by side) sits between the pick and the list. Fine as an Advanced tool once muscle memory takes over. Wrong for a modern Basic audience.

### Tap counts

| Job | Before (today, r68) | After (Basic) |
|---|---|---|
| Add one ability from the unit’s list | Add → scroll the list → tap a row → Save on a knob form. **4–6 taps, plus scrolling and knobs.** | Add → a goal tile → a card. Defaults apply, back to the list. **3 taps, no scrolling, 0 knobs.** |
| Add a suggested pairing (e.g. has Teleport) | Same as above; nothing is suggested. | Tap the chip on the list. **1 tap.** |
| Give a unit a role (Warrior, Mage…) | Repeat the add path once per behaviour (**~15 taps** for a 3-item set). | Add → Start from a role → Use. **3 taps** for the set. |
| Find a known name (Advanced) | Search on the laundry list (already there). | Search on the grouped Advanced list. **Same or fewer.** |

Basic never pays extra taps to reach Advanced; “Browse all (Advanced)” is one control on the picker home.

### Basic flow

Add ability opens a **justified full-height picker with a clear Back** (not stuffed into the 40% sheet — visual cards need the room; today’s picker is already full-screen). The unit’s list stays one Back away.

1. **Home — goal tiles.** Seven categories, a 2-column grid: **Move, Attack, Defend, Support, Spells, Status, AI.** Plus “Start from a role”, suggested chips for this unit, and “Browse all (Advanced)”. Turns, mana and win rules stay in Settings, not in this list. **Support** is heals and buffs; Heal has moved out of Defend.
2. **A category — visual cards.** Two columns. Each card is a real catalogue behaviour, a mini grid (range, step shape, line, wave) or a simple icon, and a one-line plain description. Tap a card to add it with defaults and return to the list. Six cards is the no-scroll budget; overflow is “More in Advanced”, not a second laundry list.
3. **Role presets.** Warrior, Archer, Mage, Healer, Scout. One tap assigns a small set of catalogue behaviours with defaults on. The maker can remove any item after. Sets are listed below; anything the Librarian should confirm is marked.
4. **Suggested chips** live on the unit’s abilities list (the 40% sheet), not only inside the picker. They are based on what is already assigned.

### Category membership (catalogue_rev 22, Librarian)

Only v1 grid-tactics behaviours. Nothing was invented. **Unclear** items are marked and should not be silently dropped or silently promoted.

| Goal tile | In Basic cards (catalogue id) | Unclear / notes | Not in this tile |
|---|---|---|---|
| **Move** | `step-pattern`, `teleport`, `reach-extension` | `teleport` **needs a summon** — default destination is “beside-own-summon”, not a generic blink. Marked on the card. | Push / pull (they move someone else → Status). |
| **Attack** | `basic-attack`, `line-shot`, `pierce-line`, `sky-drop`, `radial-volley`, `splash-hop` | `splash-hop` range is easy to misread (marked). `target-lock`, `multi-attacker`, `random-strikes` are real attacks but sit in “More in Advanced” so the grid does not scroll. | `damage-resolution` is a project-wide hit pipeline, not a unit attack → Settings / Advanced. |
| **Defend** | `shield-immunity`, `barrier-line`, `taunt` | Shield stays here in Basic (shields, walls, taunts), even though the catalogue group is “Support (heal/shield/buff)”. `barrier-line` and `taunt` are Control in the catalogue. | `barrier-payoff` (a wall-cash-in spell, not a defence). Heal / Cleanse / Revive / Stat Buff have moved to Support. |
| **Support** | `heal`, `cleanse`, `revive`, `stat-buff` | `stat-copy-swap`, `buffer-firer`, `on-death-trigger` are real Support-group items but sit in “More in Advanced” so the grid does not scroll. | Shield stays in Defend (see above). |
| **Spells** | `lane-sweep`, `cross-burst`, `cone-sweep`, `orbit-ring`, `summon-unit`, `pull-hook` | `sword-lifecycle` and `avatar-summon` are real but tightly tied to BTF flasks / holy swords — Advanced unless the Librarian says otherwise. | `shrinking-arena` is a match rule, not a unit spell. Line shots stay in Attack so cards are not duplicated. |
| **Status** | `stun-hold`, `trap-tile`, `slow-tiles`, `damage-over-time`, `push-knockback` | `ability-availability` (cooldowns) is a limiter, not a status; it appears as a **suggestion**, not a Status card. | `stat-buff` has moved to Support. |
| **AI** | `bot-ability-priority`, `reveal-intent` | `autonomous-ally` is catalogued under Summons, but it “acts by itself” — offer it here with a note, or keep it under Spells / Summons. | `auto-cast` is Modes, not v1. |

**Kept out of Basic browse on purpose** (they stay in Advanced, and in Settings where they belong): Ability Presentation, Action Budget, Mana Pool, Resource gain, Special Meter, XP and Level Rewards, Self-Damage for Value, Ability Refresh, Ability Availability (except as a suggestion), Damage Resolution, Win Condition, Army Roster, Neutral Guardians / Roamer, Objective Flask, Terrain, Stat Plates, Ability Effect, Hand and Draw, Reveal Enemy Hand, Modes (`resource-meter`, `auto-cast`).

### Role presets (one tap, catalogue behaviours only)

| Role | Assigns (ids) | Notes |
|---|---|---|
| Warrior | `step-pattern`, `basic-attack`, `shield-immunity` | Clean. |
| Archer | `step-pattern`, `line-shot`, `target-lock` | **Confirm with the Librarian:** `line-shot`’s default `caster_class` is `mage`. |
| Mage | `step-pattern`, `lane-sweep`, `damage-over-time` | — |
| Healer | `step-pattern`, `heal`, `cleanse` | Heal and Cleanse now live under the Support tile. |
| Scout | `step-pattern`, `reveal-intent`, `basic-attack` | **Teleport is not in this set** — it blinks beside a summon, so it would lie to a scout with no summon. |

### Suggested chips (first set — ship now)

**Decided:** ship this first set now; the Librarian will tighten the pairings later. Behaviours are all from the catalogue:

- Has `teleport` → `ability-availability` (“Add a cooldown”) and `stun-hold` (“Pair with Stun”).
- Has any attack (`basic-attack`, `line-shot`, …) and no status rider → `stun-hold` or `damage-over-time`.
- Has `heal` → `cleanse`.
- Has `shield-immunity` → `taunt`.
- Has `summon-unit` → `teleport` (this is the pairing the catalogue actually describes).
- Has only `step-pattern` → `basic-attack`.
- Empty list → the role-preset entry, not a random card.

### Advanced

The full searchable list stays. Polish only: group by the catalogue groups, keep Day-one tags, put Search first, move “Use a preset” off the primary button, drop the jargon paragraph at the top, and keep card-only rows hidden when the project uses the unit menu. Muscle memory still works.

### Mocks

Static HTML in `ui-shell/mock-qol/` (tokens from `css/app.css`). Rendered shots in `ui-shell/screenshots/69q-after-*.png` and contact sheets `69q-sheet-*.png`. Light and dark for the main screens. Picker is full-height with Back; suggested chips stay in the 40% unit sheet.

---


## P1 — 2. Stages overhaul: pick a type that narrows the catalogue

**Effort: M–L. Basic gets Safe and Battle as the main cards; Freestyle is shown as the third card and marked Advanced. Type filters the palette; how stages chain is a separate project setting.**

### Problem

**Add stage** makes a blank stage with no type. The palette is the whole unfiltered catalogue (NPC, Building, Terrain, Land; the enemy pool today lists Warrior A / Mage B, not real enemies). A maker building a village faces slimes, lava, and hostile behaviours next to a well. There is no way to start from a themed lair, and no warning if the stage’s purpose changes later.

The stage list currently also shows `undefined×undefined` for size. That label is an r68 fix — not this item.

### Type vs run layer (orthogonal)

Checked against `/workspace/portal` (Tower of Ascension, `TOWER_MODE`, `STAGE_WAVES`, `portalrealm`) and `/workspace/tileengine-modes` / `docs/engine-answers-starter-games.md`.

- **Stage type** = what the stage contains. A per-stage palette filter. **Decided labels:** **Safe**, **Battle**, **Freestyle**.
- **Run layer** = how stages chain. A project / world setting, not a per-stage type.

| Run layer ↓ · Type → | Safe | Battle | Freestyle |
|---|---|---|---|
| **Open-world wandering** (Pokémon style; Portal / Bloodline village + lanes is the closest cousin. Architect: camera / open-world wandering is later, not core v1.) | Hub, town, route | Encounter or gym on the route | A mixed route |
| **Stage-by-stage horde** (`STAGE_WAVES` 1-1…1-4. True Horde mode is later per engine-answers.) | Camp between waves | Wave floors | Mixed floors |
| **Fight, then loot or shop** (Tower of Ascension / `TOWER_MODE` camp and shop after a clear) | Camp or shop after a clear | Tower floors | Mixed |
| **Rogue run — death restarts** (Tower: “Begin wipes the run”. Portal realm is a timed survival cousin, not a full rogue loop.) | Camp / shop between floors | Run floors; death restarts | Mixed |

Odd mixes get a warning: an all-Safe horde, or an open world with only Battle stages.

The wizard can suggest a default run layer; the control itself lives in Settings as **How stages chain**. It does not appear on the type picker.

### The three types

**Safe** — a town, village or campfire. No threats by default.

- Visible: NPCs from the Starter Pack (Villager, Merchant, Guard, Elder, Child, Quest giver); buildings and props the live palette and pack already have (House, Shop, Well, Tree, and pack props such as rocks, fences, signs, barrels, crates, torches, tower, gate); land (Grass, Path, Dirt); water / river; brick wall.
- Hidden, with a visible count: **12 enemy items** (10 starter enemies + 2 bosses), **Lava**, `bot-ability-priority`, `trap-tile`, other threat-only items, and hostile NPC behaviours. A hero in a village still keeps `basic-attack`, movement, and Support — the filter hides threats you can place, not a hero’s own kit. **Decided.**
- **Add threat or event** (one toggle) unlocks enemies, Lava, and those threat behaviours for *this stage only*. The type stays Safe. Use it for a village attacked, or an ambush at a forest campfire.

**Battle** — almost everything is allowed. An NPC can still stand at a spawn; a caravan can be escorted.

- Surface enemies (Slime, Bat, Skeleton, Wolf, Goblin, Acolyte guard, plus the two bosses), Lava, and **themed lair sets**.
- **Goblin lair** — Goblins, rocks, torches, crates (real Starter Pack names).
- **Slime den** — Slimes and rocks, water nearby (the pack’s blob-enemy layout).
- **Bandit lair** — **unclear**. There are no bandits in the Starter Pack. Proposed stand-in: Acolyte guards + barrels, crates, torches.
- **Ruins, wreckage, ruined houses** — **planned / not in the pack**. Shown as marked, not invented as shippable art.
- **Decided:** a lair set is a prefab stamp plus a palette filter.
- **Decided:** NPCs stay non-hostile by default in Battle (Idle / Wander / Quest giver / Seller). Hostility is opt-in.

**Freestyle** — every asset, full freedom. Aimed at Advanced users. Shown as the third card so a mixed route is one tap away, and marked Advanced.

Changing type later warns if placed items would leave the visible palette. Items are **hidden, not deleted**. Switching Battle → Safe with a Goblin, a lava tile, and a Trap Tile already placed: “3 placed items will be hidden… Stay on Battle, or add a threat or event on the Safe stage to keep them visible.”

### Tap counts

| Job | Before | After |
|---|---|---|
| Add a stage and start placing | Add stage (**1 tap**), then the full catalogue. | Add stage → a type card. **2 taps**, then a filtered palette. |
| Unlock a fight on a Safe stage | Not possible without facing the whole catalogue. | **Add threat or event**, 1 tap. Type stays Safe. |
| Start from a themed lair | Not possible. | On a Battle stage, Themed sets → Use. **~3 taps** from Add stage. |
| Change type later | Not possible. | Type chip → confirm. **2–3 taps**, with the hide-not-delete warning. |

### Basic / Advanced

Basic makers see all three cards so the choice is honest; Freestyle is visually marked Advanced. Run layer stays in Settings, not on the type picker. The locked shell stays: the type picker and themed-sets list are full-height with Back; the filtered palette stays on the existing tap-to-place popover, with a type chip and the threat toggle on a slim bar, not a 40% sheet.

### Mocks

`ui-shell/mock-qol/10-stages-type-*.html` (light and dark), `11-stages-palette-safe-light.html`, `12-stages-palette-battle-light.html`, `13-stages-threat-light.html`, `14-stages-lairs-*.html`, `15-stages-change-type-light.html`, `16-stages-run-layer-*.html`. Rendered to `screenshots/69q-stages-*.png` and contact sheets `69q-sheet-stages-*.png`. Before shots: `69q-before-stage-select.png` (includes the r68 size-label bug) and `69q-before-empty-tile.png`.

## P1 — 3. The unit’s abilities list is the home

**Effort: M. Basic lands here. Advanced knobs are behind a row.**

r68 already lists assigned abilities, a ✦ count, remove, Test, and Add behaviour — but the list sits under Sprite / Stats / Behaviour / Sounds, naming is mixed (Behaviour chip, Abilities heading, “No behaviours yet”, “+ Add behaviour”), and a leftover Place-unit chip can cover the rows. The separate Unit editor still has a Behaviours heading whose only button is “Abilities”, then a second “Abilities” section that is actually Own sound.

**Fix:** Edit (and the Behaviour chip, renamed **Abilities** in Basic) lands on this list as the default tab. Sprite / Stats / Art are the other tabs, not a row that pushes the list off the first screen. Each row: short name, one plain line, Test, remove. Add ability opens item 1. The ✦ badge stays on the unit. Advanced keeps the word “behaviour” in the catalogue list. Remove stays one tap with Undo (no extra confirm in Basic).

**Taps:** see the current list — **2** (tap unit → Edit). Today the list is easy to miss under the four chips; after, it is the first thing on the sheet.

---

## P1 — 4. Ability knobs: defaults in Basic, a clean edit in Advanced

**Effort: M.**

**Problem:** Picking anything opens a long form. Labels repeat (“What costs an action?” ×3). “placeholder value” tags and catalogue prose leak through. Back and Cancel both go back.

**Fix:** Basic applies catalogue defaults and returns to the list (0 extra taps). Advanced / a row opens a single clean edit: unique labels, a mini preview where it helps, Test, Done. No placeholder tags. Flagged answers stay inline (the existing “needs a new look” rule, in plainer words).

---

## P1 — 5. Play starts on the stage

**Effort: S–M. Loadout, Preview and Render stay in Advanced.**

**Problem:** Play leaves the board for a Loadout screen (“0 / 4 slots filled”) with an achievement banner over the title, then a “Play test coming soon” page that says to use the toast from Stage → Play. Preview, Test and Play are three different doors.

**Fix:** In Basic, Play plays the units already on this stage (or a clear on-stage “Playing Floor 1 · Exit” chip once the runtime exists). Loadout and Preview live under Advanced / More. Test on a unit (r68) stays the way to try one unit and, for Teleport, to pick a tile. The coming-soon battle menu remains Play-only, never edit.

**Taps to try the stage:** before **3+** (Play → pick loadout → Play again → placeholder). After **1**.

---

## P2 — 6. One chip at a time, banners off the board

**Effort: S.**

Place-unit, move, paint, “Place here / Overlaps…”, Map, and achievement toasts (“Make your first stage · +10”, “First play-test”) currently stack and cover tiles, lists and titles. **Fix:** one contextual chip; achievements wait until the board is clear, or sit in Profile. Map stays a corner chip, never under a banner.

---

## P2 — 7. Stats in the unit sheet, no engineer hints

**Effort: S–M. Basic sliders only. Advanced keeps inherit / clip cues / plates.**

The Unit editor is a full-screen hop whose hints say `null team_colour = inherit the side palette (rev 9 / L30)` and `unit-roster.clip_cues — for units without clips`. **Fix:** Health and Attack sliders live on the Stats tab of the same sheet. Plain language (“Uses the team colour” / “Flash when hit”). Jargon and plate style under Advanced. Same data.

**Taps to change health:** before **3** (Edit → Stats → full screen). After **2** (Edit → Stats tab).

---

## P2 — 8. Keep creates a project asset the stage can place

**Effort: M. Already planned for r69.**

After Convert → Keep, the sprite should become a project asset the stage catalogue and tap-to-place menus can use. Offer “Place on this stage” as a follow-on, not an extra hop in Basic if the maker is already mid-convert. This is the second r69 track, alongside this QoL plan.

---

## P2 — 9. Effect Designer is a real door

**Effort: S.**

“Open Effect Designer” and “Glow: add in Effects” are toasts (“coming later”), even though `ui-shell/mock-effects/` exists. **Fix:** More and the Sprite Studio glow link open that designer (or a stub screen with Back). No dead buttons. Depth stays Advanced.

---

## P2 — 10. Inline help for amateurs, jargon under Advanced

**Effort: S.**

Short “?” tips and one-line examples on the picker, the abilities list, Play, and Convert. Basic gets the tip; Advanced can hide it. Engineer strings (`wall_block`, rev numbers, `clip_cues`) never appear in Basic.

---

## P2 — 11. Leave More alone in Basic; don’t hide Sprite Studio

**Effort: S.**

Basic More is already short (Enemies, Map, Preview, Sound, Sprite Studio) with “6 more tools are tucked away” for Advanced. Keep that. Don’t bury Sprite Studio. Loadout, Stage loadout, Render and Game settings stay in Advanced (and Play no longer depends on them — item 5).

---

## P2 — 12. Studio profile overhaul

**Effort: M.** CEO direction 2026-11-12, 04:17, via Chief Of Staff, after testing live r68. The same “scroll down” problem as the behaviour picker: Avatar chips, then volume, stats and the full achievements list, all live on one long Studio profile page. The CEO’s shot (`/workspace/share/ceo/profile-r68.jpg`, Wolf selected, still showing a blank “W” initial) is the before.

**Fix, in four parts:**

1. **Tapping the avatar** (the initial, or later the picture) opens a **full-height panel with Back**. A 40% sheet cannot show 12 portraits, badges and borders without turning into another scroll trap, so the full-height pattern (same as the behaviour picker) is justified. Three tabs: **Pictures**, **Badges**, **Profile borders**. The long Avatar chip list leaves the profile home. An Initials option and “Upload… Coming later” stay on Pictures. Pictures are blank today; the CEO will make 12 Imagine busts tomorrow. Those portraits are planned in `ux/starter-pack-v2-plan.md` as a Studio avatars group of 12, **outside the 100** stage assets, authored with a square-bust prompt, 16-colour cap, no M/F pairs.

2. **Achievements** get their own button on the profile home. A **red notification badge** with a count appears when something new is unlocked, and clears when the list is opened (view). The badge is not colour-only: the numeral is visible, the button subtitle says “2 new”, and `aria-label` is “Achievements, 2 new”. The red on the badge is AA against its fill (deep red `#b42318` with white numerals, both themes). Hidden achievements still follow the existing rules (`ux/profile-achievements.md`): locked hidden cards stay “???” until unlock.

3. **Rewards** are badges and profile borders, equipped from those two tabs. They are earned by completing achievements, by **your** assets being bought N times in the shop, and by building lots of games. Locked rewards show how to earn them and a progress bar (for example “Sold 7/10”). Thresholds are accepted (profile-format r8 §1.12.9): sales badges at 10/50/250 plus a border at 100 (paid sales only); published games at 1/5/20 plus a border at 10; a border at 10 achievements and a badge for all 20. One badge and one border at a time. Sale counts show only on the owner’s profile; visitors see just the badge. Metric rewards pay no coins.

4. The **profile home** keeps the hero (tappable avatar, name, coins, How to earn), My setup, Appearance (Light / Dark / Follow device), and the Achievements button. It no longer lists every avatar chip or the full achievements catalogue. Editor preview volume and Reset achievements stay under Advanced, so the first screen does not scroll.

**Taps** (already on Studio profile):

| Job | Before | After |
|---|---|---|
| Change avatar | Scroll past Appearance to the 12 chips, then 1 tap. The hero still shows initials, because the pictures are blank. | Tap the avatar (**1**) → Pictures is the default tab → tap a picture (**2**). No scroll on the home. |
| Open achievements | Scroll past avatars, volume and stats to the list on the same page. Easy to miss; no “new” mark at the top. | **1 tap** on Achievements. The badge and “2 new” clear on view. |
| See a locked reward | Not available. | Avatar → Badges or Borders → tap a locked item. **3 taps**, then a 40% sheet with how to earn and the bar. |
| Change theme | 1 tap, if Appearance is still on screen. Getting here from the stage is still ⋯ → Profile (**3 taps**). | Still **1 tap** on the home, and Appearance is now always visible without scrolling. |

**P3 item 15 (Appearance in one fewer hop)** may **merge into this**. Theme chips stay on the profile home (as that item already asked). The leftover work — adding the same three chips to View or ⋯ so the stage is 1 fewer hop — can be done with this item, or stay a small P3. Don’t remove Appearance from Profile.

**Ledger — decided (profile-format.md r7 §1.12, PROPOSED).** The UI follows these answers; it does not invent a ledger format. Counts are read from `profile.rewards.metrics` (read-only; stubbed in the adapter until the server copy exists). Locked hints say **Sold** (listings) and **Published** (games), not “built”.

1. **Sale count.** Metric **`assetSales`**: total paid sales across all of the account’s hub listings, derived from production `hubAssetPurchase` entries for this uploader. Refunds, self-purchases, young-buyer purchases, free downloads and sandbox sales do not count.
2. **Games.** Metric **`gamesPublished`**, from `gamePublished` coin entries (one per game, ever). Not `projectCreated`, `wizardCompleted`, `buildStarted` or `exportCompleted`.
3. **Reward definitions.** Cosmetics live in a **`te-cosmetics`** manifest (`key`, `slot`, `title`, `assetKey`, `unlockedBy`). How they’re earned is an **achievement-set** definition with `trigger.metric` and `count`. Verified creator and Made by TileEngine are trust marks, not cosmetics.
4. **Equipped cosmetics.** `prefs.badgeId` and `prefs.borderId`, LWW per field with `prefStamps` like `avatarId`. A locked or unknown key is kept but shown as none (`cosmeticNotUnlocked` / `cosmeticUnknown`).
5. **“New” on the Achievements button.** Device-local **`editor-prefs.achievementsSeen`** (a list of ids). “New” = unlocked in `achievements[]` or `rewards` and not in that list. Opening the list adds every unlocked id.
6. **Chart badges.** Game of the Month and Asset of the Month appear in the **Badges** tab (`unlockedBy: {coinReason: …}`), derived from existing coin entries, and can be equipped.
7. **Thresholds — accepted (r8 §1.12.9):** sales badges at **10 / 50 / 250** plus a border at **100** (paid sales only); published games at **1 / 5 / 20** plus a border at **10**; a border at **10** achievements and a badge for all **20**. One badge and one border at a time. Sale counts are only visible on the owner’s profile. Metric rewards pay no coins.

Mocks: `ui-shell/mock-qol/20-profile-*.html` … `25-profile-*.html`. Shots `ui-shell/screenshots/69p-profile-*.png`, including a before/after contact sheet against the CEO’s r68 screenshot.

---

## P3 — 13. Sound sheet is a junk drawer

**Effort: S–M.**

Library, Made here, upload, Own sound, generator sliders, events, unit overrides and Try it all share a 40% sheet, and other chips can cover the rows. **Fix later:** a Basic “pick a sound and Try it” view; the rest under Advanced or a full-height panel with Back.

---

## P3 — 14. Home leads with Make and Open

**Effort: S.**

Home is a tall stack: Standalone engine, Open blank stage, Profile, Made games, Thumbs-up chart, Asset shop, Project settings, Export. **Fix later:** two clear actions (Make a game, Open a stage); hub, shop and export sit below or in Profile. Export remains a JSON placeholder until it is real.

---

## P3 — 15. Appearance in one fewer hop

**Effort: S.**

Light / Dark / Follow device lives on Studio profile (Stage → ⋯ → Profile, **3 taps**). Add the same three chips to View or ⋯. Don’t remove them from Profile. **May merge into P2 item 12:** the profile home now keeps these chips above the fold; the remaining hop-cut (chips on View or ⋯) can ship with that overhaul or stay here.

---

## Open questions for the CEO

### Behaviour picker — decided

1. **Support tile** — **Yes.** A seventh goal tile, Support, holds heals and buffs. Heal (and Cleanse, Revive, Stat Buff) have moved out of Defend. Defend keeps Shield, Barrier Line, and Taunt. Mocked in light and dark.
2. **Role sets** — **The five roles stay:** Warrior, Archer, Mage, Healer, Scout. Archer still flags that Line Shot’s default caster class is mage. Scout still omits Teleport (it blinks beside a summon).
3. **Project rules** — **Turns, mana and win rules stay in Settings**, not in Basic browse.
4. **Picker chrome** — **Full-height picker with a Back button.** Suggested chips stay in the 40% unit sheet.
5. **Naming** — **“Abilities” in Basic, “behaviour” in Advanced.**
6. **Suggestion pairings** — **Ship the first set now**; the Librarian will tighten them later.
7. A screen recording may still follow; this plan can be adjusted from it.

### Stages — decided

The CEO confirmed the CoS picks. These are final, not provisional:

1. **Lair sets** — a prefab stamp plus a filter.
2. **NPCs in Battle** — non-hostile by default (Idle / Wander / Quest giver / Seller). Hostility is opt-in.
3. **Scripted fight on a Safe stage** — only via the “Add threat or event” toggle, or by using Freestyle. The toggle does not change the type; the stage stays Safe.
4. **Naming** — **Safe**, **Battle**, **Freestyle**, and **How stages chain**.
5. **Threat-behaviour boundary** — Safe hides enemy units, Lava, `bot-ability-priority`, `trap-tile`, other threat-only items, and hostile NPC behaviours. Village heroes keep `basic-attack` (and their usual movement and Support).

---

## Mock index

| File | What |
|---|---|
| `ui-shell/mock-qol/01-picker-home-*.html` | Basic goal-tiles home, seven tiles including Support, light and dark |
| `ui-shell/mock-qol/02-picker-attack-*.html` | Attack card grid, light and dark |
| `ui-shell/mock-qol/03-picker-move-*.html` | Move card grid (Teleport marked “Needs a summon”) |
| `ui-shell/mock-qol/07-picker-support-*.html` | Support card grid (Heal, Cleanse, Revive Fallen, Stat Buff) |
| `ui-shell/mock-qol/08-picker-defend-*.html` | Defend card grid (Shield, Barrier Line, Taunt) |
| `ui-shell/mock-qol/04-picker-roles-*.html` | Role presets (five roles, unchanged) |
| `ui-shell/mock-qol/05-picker-advanced-*.html` | Advanced grouped list |
| `ui-shell/mock-qol/06-abilities-suggested-*.html` | Suggested chips on the 40% abilities list |
| `ui-shell/mock-qol/10-stages-type-*.html` | New-stage type picker, three cards, light and dark |
| `ui-shell/mock-qol/11-stages-palette-safe-light.html` | Safe palette with hidden counts and threat toggle Off |
| `ui-shell/mock-qol/12-stages-palette-battle-light.html` | Battle palette (enemies, Lava, ruins marked, themed sets) |
| `ui-shell/mock-qol/13-stages-threat-light.html` | Safe stage with “Add threat or event” On |
| `ui-shell/mock-qol/14-stages-lairs-*.html` | Battle themed lair sets |
| `ui-shell/mock-qol/15-stages-change-type-light.html` | Change type later — hide-not-delete warning |
| `ui-shell/mock-qol/16-stages-run-layer-*.html` | How stages chain (project setting) |
| `ui-shell/screenshots/69q-before-*.png` | Real screenshots of the current prototype |
| `ui-shell/screenshots/69q-after-*.png` | Rendered picker mocks |
| `ui-shell/screenshots/69q-stages-*.png` | Rendered Stages mocks |
| `ui-shell/screenshots/69q-sheet-picker-home.png` | Before / after the picker, light (seven goal tiles) |
| `ui-shell/screenshots/69q-sheet-picker-home-dark.png` | Before / after, dark |
| `ui-shell/screenshots/69q-sheet-picker-cards.png` | Attack and Move category cards |
| `ui-shell/screenshots/69q-sheet-picker-support.png` | Support and Defend cards, light and dark |
| `ui-shell/screenshots/69q-sheet-picker-roles.png` | Role presets |
| `ui-shell/screenshots/69q-sheet-suggested.png` | Suggested chips |
| `ui-shell/screenshots/69q-sheet-picker-advanced.png` | Advanced list vs today’s picker |
| `ui-shell/screenshots/69q-sheet-picker-flow.png` | 3-tap Basic flow |
| `ui-shell/screenshots/69q-sheet-stages-type.png` | New-stage type picker, before / after, light and dark |
| `ui-shell/screenshots/69q-sheet-stages-palette.png` | Safe vs Battle filtered palettes |
| `ui-shell/screenshots/69q-sheet-stages-threat.png` | Threat toggle and change-type warning |
| `ui-shell/screenshots/69q-sheet-stages-lairs.png` | Lair sets and the run layer |
| `ui-shell/mock-qol/20-profile-home-*.html` | Studio profile home after the overhaul, light and dark |
| `ui-shell/mock-qol/21-profile-avatars-*.html` | Avatar panel, Pictures tab, light and dark |
| `ui-shell/mock-qol/22-profile-badges-light.html` | Avatar panel, Badges tab |
| `ui-shell/mock-qol/23-profile-borders-light.html` | Avatar panel, Borders tab |
| `ui-shell/mock-qol/24-profile-achievements-light.html` | Achievements list, with New marks |
| `ui-shell/mock-qol/25-profile-reward-locked-*.html` | Locked reward 40% sheet (“Sold 7/100”) |
| `ui-shell/screenshots/69p-profile-*.png` | Rendered profile mocks |
| `ui-shell/screenshots/69p-profile-sheet-before-after.png` | Before (CEO r68 shot) / after, dark |

Audit notes: `ui-shell/screenshots/69q-audit-report.json` and `ui-shell/scripts/audit_qol_r69.py`.

---

## r69 build order

Plan only, still local. Start from the r68 code once r68 lands. Do not edit live prototype files until then. P1 first, in this order:

1. **Behaviour picker overhaul** (item 1). Full-height picker with Back; seven goal tiles including Support; “Abilities” in Basic and “behaviour” in Advanced; first suggestion pairings shipped as listed; turns / mana / win rules stay in Settings. Builds on the r68 abilities list and the Add-behaviour door.
2. **Stages overhaul** (item 2). Type picker, filtered palettes, threat toggle, themed sets, change-type warning, and the “How stages chain” setting. The `undefined×undefined` size label should already be fixed in r68 — do not redo it here.
3. **Abilities list as the unit-sheet home** (item 3). Naming follows the decided split.
4. **Ability knobs: defaults in Basic** (item 4).
5. **Play starts on the stage** (item 5).

Then P2, roughly in this order: one chip at a time (6); stats in the unit sheet (7); **Keep creates a project asset** (8) — already a second r69 track, and it can run alongside 1–2; Effect Designer door (9); inline help (10); leave More alone (11) is mostly a don’t-regress rule; **Studio profile overhaul (12)** — after the editor items, because it is a hub/profile change and the Imagine avatar art arrives after the plan. P1 order is unchanged.

Then P3: sound sheet (13), Home (14), Appearance (15). Item 15 may merge into item 12.
