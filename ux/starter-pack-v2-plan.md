# Starter Pack v2 — plan only (after r69)

**Status:** **Accepted 2026-11-12** (CEO, 04:19 Europe/London, via Chief Of Staff). Plan and static mocks only. Not built. Built after r69. Goes live only on the CEO’s SEND. Does not block r69 (this work never edits `ui-shell/js`, `ui-shell/css` or `index.html`).  
**CEO direction:** 2026-11-12, 04:08 Europe/London, via Chief Of Staff. Decisions accepted 04:19.  
**Mocks:** `ui-shell/mock-pack/` · shots `ui-shell/screenshots/70p-*.png`. Studio avatars (outside the 100) are also planned here; profile mocks are `ui-shell/screenshots/69p-profile-*.png`.

A Starter Pack of **about 100 preset assets** that every user gets from the start, covering what **Safe**, **Battle** and **Freestyle** stages need for now. The CEO will make the art in Grok Imagine and author the pack in Sprite Studio through a **dev-only** mode. **Buildings stay out** — they will get their own tool, like Sprite Studio, later.

This replaces the v1 contents draft (`ux/starter-pack-contents.md`, pack id `tileengine-starter-pack@1`) as the art-asset plan. v1’s UI icons, frames, SFX, music and portraits stay on that backlog and are **not** in this 100. House, Shop, Tower and Gate are also out (buildings). Well and a traveller’s tent stay as **small props**.

---

## What already exists (have vs new)

The live prototype does not ship 100 finished sprites. What we can reuse:

| Source | What is real today | How this plan treats it |
|---|---|---|
| Sprite Studio parts (r63) | Bodies classic / sturdy / small; outfits tunic, armour, robe; weapons sword, staff, bow, none | Previews for Warrior, Mage, Archer, Healer, Scout. **Have (code-drawn preview).** Imagine art will replace these. |
| v1 pack list | 8 unisex class names: knight, mage, archer, rogue, cleric, brawler, ranger, bard | Knight → **Warrior**. Cleric → **Healer**. Rogue → **Scout**. Ranger stays an Archer (or Scout) skin, not its own class. Brawler and Bard stay as Wave 2 extras. **Decided.** |
| 5 roles (r69, CEO 👍) | Warrior, Archer, Mage, Healer, Scout | The classes every user meets first. Each gets a **male and female** sprite. |
| Live stage (`stage-live.js`) | Tiles: Grass, Brick path, Dirt, River, Brick wall, Lava. Props: Tree, Well (House and Shop exist but are out). NPCs: Villager, Merchant, Guard, Elder | **Have.** Child and Quest giver are named in v1 but Child is not in the live NPC list, and Quest giver is a role without its own sprite. |
| Welcome pack preview | 4 hero thumbs + slime shapes (green, horned, spiky, blue) | **Have (preview shape)** for those slimes. |
| v1 enemy *names* | slimes, bats, skeletons, wolves, goblins, acolyte guards; 2 bosses | **Listed in v1, no Imagine art yet.** |
| v1 prop *names* | barrels, crates, torches, signs, fences, rocks, chest | **Listed in v1, not drawn on the live stage.** |
| Known gaps (r69) | No bandits. No ruins. No wreckage. The bandit-lair mock used Acolyte guards plus barrels, crates and torches as stand-ins. | **New.** Wave 1 closes all three gaps so a Battle stage can use real bandits, a ruined wall, rubble and a wrecked cart. |

**Have** means live or preview art already exists (usually code-drawn). **Listed** means the v1 pack named it, but there is no sprite to tag yet. **New** is not in v1.

---

## (a) Sprite Studio dev mode

A hidden authoring path for the CEO (and later pack maintainers). Ordinary users never see it. Exported games never include it.

### Unlock

- Open Sprite Studio with a local URL flag, same idea as the existing test-only `?noquiz`: **`?packdev`**.
- Only then does a quiet **Pack author** chip appear in the Sprite Studio top bar, plus **Tag for pack** on the rail after a Keep, and a **Pack** item that opens the progress board.
- There is no My setup toggle, no Advanced reveal, and no hidden gesture in the normal app. If the flag is missing, the chip, the rail button, batch import and export are not in the DOM.
- Player builds and exported games strip this code. A pack asset in a user’s project is just a normal library sprite; it does not carry authoring tools.

### Flow: Convert → Tag → Add to pack

The happy path reuses the live converter and the r68 body-map walk. Nothing new in Basic for normal users.

1. **Convert.** Import an Imagine picture (magenta `#FF00FF` background, or mint `#00FF80` if the character is pink). Crisp at Standard 16 is the default. Keep. Import a back view (and a side view if the pose does not mirror). **Make walk cycle** is 0 extra taps on the auto path (r68).
2. **Tag.** A 40% sheet opens over the canvas. Tags are **guessed** from the file name and the kind of sprite (unit vs prop vs tile), and shown as a short summary with QA ticks. If the guesses are right, the CEO just taps **Add to pack**. **Change tags** opens a full-height chip editor (category, stage types, hostility, lair, default behaviours, prop flags).
3. **Add to pack.** A 40% confirm sheet recaps the name, tags, QA ticks and the new pack count, then writes the asset into the pack.

Guessed from a name like `enemy-bandit-thug-front.png`: category Enemy, display name “Bandit Thug”, visible on Battle (and therefore Freestyle), Hostile, walk cycle required, lair set “Bandit lair”, default behaviours `step-pattern`, `basic-attack`, and “When it dies: drop loot”.

### Tags

| Tag | What it is | Who sees it |
|---|---|---|
| Category | Heroes, NPC, Enemy, Prop, Ruins & wreckage, Hazard, Terrain, Effect / pickup | Everyone, as catalogue groups |
| Stage types | **Safe**, **Battle**. Freestyle always sees every pack asset, so it is not a chip the author has to turn on. | Filters the stage palette (r69). |
| Role / class | Warrior, Archer, Mage, Healer, Scout, plus Brawler and Bard in Wave 2 | Heroes; hidden for other categories |
| Sex variant | Male / Female / Not set | Heroes and villager NPCs; hidden otherwise |
| Hostility | Friendly / Hostile | Units. NPCs default to Friendly. Enemies default to Hostile. Battle NPCs stay friendly unless the maker opts in (already decided). |
| Prop flags | Walkable, Blocks sight, Blocks shots | Props, ruins, wreckage, some hazards. Hidden for units. |
| Lair set | Goblin lair, Slime den, Bandit lair, Ruins, Beast woods. Multiple allowed. | Enemies, props and ruins that belong in a stamp |
| Default behaviours | Chips from the Librarian catalogue, suggested by role | Units. Shipped on the asset so a placed unit already has a kit. |

Default behaviour pairings (first ship now; the Librarian tightens later, as decided for r69):

| Role or kind | Ships with |
|---|---|
| Warrior | `step-pattern`, `basic-attack`, `shield-immunity` |
| Archer | `step-pattern`, `line-shot`, `target-lock` |
| Mage | `step-pattern`, `lane-sweep`, `damage-over-time` |
| Healer | `step-pattern`, `heal`, `cleanse` |
| Scout | `step-pattern`, `reveal-intent`, `basic-attack` |
| Brawler | `step-pattern`, `basic-attack` |
| Bard | `step-pattern`, `heal` (stand-in until a Bard kit is agreed) |
| Village NPC | `idle`. Wander / Seller / Quest giver stay available as roles; Seller and Quest giver are not v1-true yet. |
| Town guard | `idle`, `step-pattern` (friendly). Not hostile NPC behaviour. |
| Enemy | `step-pattern`, `basic-attack`, and “When it dies: drop loot” |
| Boss / miniboss | Same as Enemy, plus a second attack left as a suggested chip (`lane-sweep` or `basic-attack`) |

Safe still hides enemy units and hostile NPC behaviours, and village heroes still keep `basic-attack`.

### Batch import

In Pack author only: drop a folder (or pick many files). Files follow `category-name-sex-view.png` where sex and view are optional (`hero-warrior-m-front.png`, `prop-barrel.png`, `enemy-goblin-grunt-back.png`). All run through Crisp Standard 16, then sit in a tag queue with guesses filled. The CEO walks the queue: confirm, or fix one sheet, then next. Views with the same stem (`…-front`, `…-back`, `…-side`) are grouped into one asset before tagging.

### Pack versioning and export

- Pack id **`tileengine-starter-pack@2`**. `@1` stays the current free listing until a SEND publishes `@2`. Later published drops use `@2.1`, `@2.2`, and so on, so a listing can say what changed. In-progress authoring only bumps the content hash. **Decided.**
- Each asset stores `addedAt`, `rev`, tags, QA results, and a pointer to its Sprite Studio recipe (and optional Imagine source).
- **Export pack** writes a bundle the engine can ship: recipes + thumbnails + tag index + credits line (“Made by TileEngine · free to use”).
- Editing tags or replacing art bumps the asset `rev` and the pack’s content hash. The `@2` integer only moves for a published pack drop (`@2.1` is an open question).
- Export is dev-only. It does not publish. Publishing still needs the CEO’s SEND, through Chief Of Staff.

### Per-asset QA checklist

All of these must be green before **Add to pack** is enabled (the confirm sheet can still open, but the button stays off if something fails):

1. **≤16 colours** (Crisp Standard). This is a **hard cap**. A Detailed (20) or Extra (24) convert can be kept for inspection, but the pack copy must pass 16. There is no “Accept extra colours” tick in the default flow. **Decided.**
2. **Outline present** — a near-black outline, as in the default Crisp look.
3. **Walk, units only** — 4 directions × 4 frames. A missing back view shows the existing “Needs back view” flag and fails QA until a back picture is imported or the CEO ticks “Mirror for back” on a sprite that allows it.
4. **Name** — non-empty, unique in the pack.
5. **One-line description** — shown in the catalogue. Guessed from the name if left blank, but the confirm sheet asks for a glance.

Also checked, but not blocking: leftover magenta/mint key pixels, and (for props) at least one of walkable / blocks sight / blocks shots being set.

### Progress board

Full-height Pack author home, opened from the **Pack** chip.

- A single count, e.g. **37/100 done**, with a calm bar.
- Filters: All · Wave 1 · Needs art · QA failed. 48px chips.
- Category rows with their own `done/total`.
- Each asset is a 48px+ row: thumb, name, have/listed/new, wave, and a status (Done, Needs walk, Needs art, QA).
- Wave 1 sits at the top until it is finished, so a playable Safe town and a Battle skirmish exist early.
- **Export pack** is on this screen, not in the confirm sheet.

The 37/100 figure in the mocks is a mid-authoring example (Wave 1 mostly in, a few Wave 2 started). It is not a ship target.

### Tap counts (per asset)

| Job | Taps | Notes |
|---|---|---|
| New unit, guesses right, auto walk | **8** | Import front → Convert → Keep → Import back → Tag → (glance) Add to pack → Confirm. Walk is 0 taps on the auto path. |
| Same, plus a side view | **9** | One more import. Left is mirrored (“Keep weapon in same hand” stays). |
| New unit, fix a body-map region | **11** | The r68 fix path is 3 taps, then Tag → Add → Confirm. |
| New prop, tile, pickup or effect (no walk) | **6** | Import → Convert → Keep → Tag → Add → Confirm. |
| Batch folder of *N* units, guesses right | **2 + 3N** | Pick folder (1), Convert all (1), then Tag + Add + Confirm on each. |
| Fix tags later from the board | **2** | Open the row, save. |

Basic makers are unchanged: they never see these taps. Their Sprite Studio path stays Import → Convert → Keep (3 taps).

### Shell, Basic and Advanced

Dev mode is not a third user mode. It is a hidden authoring overlay on Sprite Studio.

- The locked shell stays: thin top bar, bottom rail, confirm/Tag sheets at most **40%** of the height, canvas **75%** or more when the sheet is closed.
- The **Tag** sheet stays at 40%: it reviews the guessed name, tags, kit and QA, with **Change tags** (a full-height chip editor, same pattern as the behaviour picker) and **Add to pack**. Unselected chips live in Change tags, so the first glance is a confirm, not a form. The **Add to pack** confirm is also a 40% sheet.
- Light and dark, 48px+ targets, AA contrast, calm r62 look. No code, ids or JSON on screen (file stems can appear as a muted hint in dev only).

---

## (b) Draft list of 100 assets

Counts use **one row per catalogue asset** (a hero’s four walk views are one asset; Ashroad’s autotile corners live inside the Grass / River / Wall tiles, not as extra rows). Moonlit is one bundled night palette, not a second copy of every tile.

**Stage types in the table** are where the asset **surfaces** in the palette. Freestyle always sees everything, so it is omitted. Safe hides enemies, hazards, wreckage, the weapon rack, and hostile NPC behaviours, as already decided. Village heroes keep `basic-attack`. Decorative ruins (ruined wall, crumbled pillar) are allowed on Safe so a village can feel old; wreckage stays Battle-only.

**Walk cycle** is yes for every unit (heroes, NPCs, enemies, bosses). No for props, ruins, wreckage, hazards, tiles, pickups and effects. Bats still get a 4×4 flap treated as a walk.

Imagine prompts all start from the approved template. Only the subject / pose line changes. The shared body is:

> full-body chibi, standing pose, whole body in frame, flat cel shading with 2–3 tones, bold dark outlines, simple shapes, about 12 colours, no gradients, texture, glow or ground shadow, plain magenta `#FF00FF` background

Use mint `#00FF80` instead of magenta when the character is pink. For the other directions, change only the pose line: “facing away” (back / Walk up), “facing right” (side). Props and pickups keep the shading and background rules, and swap the opening to “isolated prop, whole object in frame, slight three-quarter view, no ground shadow”. Tiles: “top-down 16×16 game tile, seamless edges where it is a floor, whole tile in frame”.

### Totals

| Category | Count | Wave 1 | Wave 2 | Wave 3 | Have | Listed | New |
|---|---:|---:|---:|---:|---:|---:|---:|
| Heroes (5 roles × M/F, plus Brawler and Bard × M/F) | 14 | 6 | 8 | 0 | 5 | 2 | 7 |
| NPC villagers | 8 | 4 | 4 | 0 | 4 | 2 | 2 |
| Enemies — goblins, bandits, slimes, undead/acolytes, beasts, bosses | 22 | 5 | 9 | 8 | 1 | 8 | 13 |
| Props | 18 | 7 | 7 | 4 | 2 | 7 | 9 |
| Ruins & wreckage | 8 | 3 | 4 | 1 | 0 | 0 | 8 |
| Hazards | 6 | 1 | 2 | 3 | 1 | 1 | 4 |
| Terrain / tile sets | 10 | 5 | 4 | 1 | 6 | 3 | 1 |
| Effects / pickups | 14 | 1 | 7 | 6 | 0 | 14 | 0 |
| **Total** | **100** | **32** | **45** | **23** | **19** | **37** | **44** |

**By stage type** (palette visibility; Freestyle = all 100):

| Surfaces on | Count | What’s in |
|---|---:|---|
| Safe and Battle | 59 | All 14 heroes and 8 NPCs; 17 of 18 props (everything except the weapon rack); 2 decorative ruins (ruined wall, crumbled pillar); all 10 terrain rows; 8 non-combat pickups and effects (coin, potion, key, gem, scroll, heart, heal sparkle, level-up). |
| Battle only | 41 | All 22 enemies; all 6 hazards (including Lava); 4 wreckage pieces (cart, timber, broken crate, debris); rubble pile and collapsed arch; the weapon rack; 6 combat pickups and effects (hit burst, slash, arrow, magic orb, poison cloud, bomb). |

### Wave 1 — 32 assets, a playable Safe town and a Battle skirmish

Enough to place a village (two villagers, a merchant, a guard, trees, fence, campfire, a chest, coin, and the five Ashroad land tiles) and a fight (Warrior and friends vs a goblin pair, a slime, a bandit and a wolf, with lava, a ruined wall, rubble and a wrecked cart). Bandit, ruin and wreckage gaps all close here.

1. `hero-warrior-m` — Warrior (male) — Heroes — Safe+Battle — walk yes — **have** (code-drawn knight / armour preview) — *a male chibi knight in steel armour and a blue tunic, sword in his right hand, facing the camera*
2. `hero-warrior-f` — Warrior (female) — Heroes — Safe+Battle — walk yes — **new** — *a female chibi knight in steel armour and a blue tunic, sword in her right hand, facing the camera*
3. `hero-archer-m` — Archer (male) — Heroes — Safe+Battle — walk yes — **have** (code-drawn bow preview) — *a male chibi archer in a green tunic, short bow, facing the camera*
4. `hero-mage-f` — Mage (female) — Heroes — Safe+Battle — walk yes — **have** (code-drawn robe / staff preview) — *a female chibi mage in a red-purple robe, crystal staff, facing the camera*
5. `hero-healer-f` — Healer (female) — Heroes — Safe+Battle — walk yes — **have** (v1 cleric) — *a female chibi healer in a white-and-gold robe, small staff, facing the camera*
6. `hero-scout-m` — Scout (male) — Heroes — Safe+Battle — walk yes — **have** (v1 rogue) — *a male chibi scout in a dark tunic and cloak, short blade, facing the camera*
7. `npc-villager-m` — Villager (male) — NPCs — Safe+Battle — walk yes — **have** — *a male chibi villager in a simple green tunic, no weapon, facing the camera*
8. `npc-villager-f` — Villager (female) — NPCs — Safe+Battle — walk yes — **new** — *a female chibi villager in a simple green dress, no weapon, facing the camera*
9. `npc-merchant` — Merchant — NPCs — Safe+Battle — walk yes — **have** — *a sturdy chibi merchant in a gold coat and purple trousers, coin pouch, facing the camera*
10. `npc-guard` — Town guard — NPCs — Safe+Battle — walk yes — **have** — *a sturdy chibi town guard in grey-blue armour, sword lowered, friendly stance, facing the camera*
11. `enemy-goblin-grunt` — Goblin grunt — Enemies / goblins — Battle — walk yes — **listed** — Goblin lair — *a small green chibi goblin with a crude dagger, hunched, facing the camera*
12. `enemy-goblin-archer` — Goblin archer — Enemies / goblins — Battle — walk yes — **new** — Goblin lair — *a small green chibi goblin with a short bow, hunched, facing the camera*
13. `enemy-slime-green` — Green slime — Enemies / slimes — Battle — walk yes — **have** (preview shape) — Slime den — *a rounded green chibi slime with a simple face, whole body in frame, facing the camera*
14. `enemy-bandit-thug` — Bandit thug — Enemies / bandits — Battle — walk yes — **new** (closes the bandit gap) — Bandit lair — *a chibi bandit in a brown coat and dark bandana, short sword, facing the camera*
15. `enemy-wolf` — Wolf — Enemies / beasts — Battle — walk yes — **listed** — Beast woods — *a full-body chibi wolf, grey-brown fur, standing four-legged but readable at 32 px, facing the camera*
16. `prop-chest-wood` — Wooden chest — Props — Safe+Battle — walk no — **listed** — *a small closed wooden loot chest with dark iron bands, isolated, slight three-quarter view*
17. `prop-barrel` — Barrel — Props — Safe+Battle — walk no — **listed** — Bandit lair, Goblin lair — *a wooden barrel, isolated, slight three-quarter view*
18. `prop-crate` — Crate — Props — Safe+Battle — walk no — **listed** — Bandit lair, Goblin lair — *a wooden crate, isolated, slight three-quarter view*
19. `prop-torch` — Torch — Props — Safe+Battle — walk no — **listed** — all lairs — *a wall torch with a simple flame (flat 2-tone, no glow), isolated*
20. `prop-fence` — Fence — Props — Safe+Battle — walk no — **listed** — *a short wooden fence section, isolated, side-on*
21. `prop-tree-oak` — Oak tree — Props — Safe+Battle — walk no — **have** (live Tree) — *a simple chibi oak tree, dark trunk, 2-tone leaves, isolated, no ground shadow*
22. `prop-campfire` — Campfire — Props — Safe+Battle — walk no — **new** — *a small ring of stones and flat 2-tone fire, isolated, no glow, no ground shadow*
23. `ruin-wall` — Ruined wall — Ruins — Safe+Battle — walk no — **new** (closes the ruin gap) — Ruins set — *a short crumbled brick wall, isolated, no ground shadow*
24. `ruin-rubble` — Rubble pile — Ruins — Battle — walk no — **new** — Ruins set — *a small pile of broken bricks and stones, isolated*
25. `wreck-cart` — Wrecked cart — Wreckage — Battle — walk no — **new** (closes the wreckage gap) — Bandit lair, Ruins set — *a broken wooden cart with a snapped wheel, isolated, no ground shadow*
26. `hazard-lava` — Lava — Hazards — Battle — walk no — **have** (live tile) — *a top-down 16×16 lava tile, 2–3 flat tones, seamless edges, no glow*
27. `tile-grass` — Grass — Terrain — Safe+Battle — walk no — **have** — *a top-down 16×16 grass tile, 2–3 flat greens, seamless edges*
28. `tile-path` — Brick path — Terrain — Safe+Battle — walk no — **have** — *a top-down 16×16 brick pavement tile, seamless edges*
29. `tile-dirt` — Dirt — Terrain — Safe+Battle — walk no — **have** — *a top-down 16×16 packed dirt tile, seamless edges*
30. `tile-river` — River — Terrain — Safe+Battle — walk no — **have** — *a top-down 16×16 river water tile, flat 2–3 blues, seamless edges, no glow*
31. `tile-wall` — Brick wall — Terrain — Safe+Battle — walk no — **have** — *a top-down 16×16 brick wall block, darker than the path, hard edges*
32. `pickup-coin` — Coin — Effects / pickups — Safe+Battle — walk no — **listed** — *a single gold coin, isolated, no glow, no ground shadow*

### Wave 2 — 45 assets

33. `hero-archer-f` — Archer (female) — Heroes — Safe+Battle — walk yes — **new** — *a female chibi archer in a green tunic, short bow, facing the camera*
34. `hero-mage-m` — Mage (male) — Heroes — Safe+Battle — walk yes — **new** — *a male chibi mage in a red-purple robe, crystal staff, facing the camera*
35. `hero-healer-m` — Healer (male) — Heroes — Safe+Battle — walk yes — **new** — *a male chibi healer in a white-and-gold robe, small staff, facing the camera*
36. `hero-scout-f` — Scout (female) — Heroes — Safe+Battle — walk yes — **new** — *a female chibi scout in a dark tunic and cloak, short blade, facing the camera*
37. `hero-brawler-m` — Brawler (male) — Heroes — Safe+Battle — walk yes — **listed** (v1 unisex) — *a male chibi brawler, sturdy body, wrapped fists, no blade, facing the camera*
38. `hero-brawler-f` — Brawler (female) — Heroes — Safe+Battle — walk yes — **new** — *a female chibi brawler, sturdy body, wrapped fists, no blade, facing the camera*
39. `hero-bard-m` — Bard (male) — Heroes — Safe+Battle — walk yes — **listed** (v1 unisex) — *a male chibi bard in a bright tunic, small lute, facing the camera*
40. `hero-bard-f` — Bard (female) — Heroes — Safe+Battle — walk yes — **new** — *a female chibi bard in a bright tunic, small lute, facing the camera*
41. `npc-questgiver` — Quest giver — NPCs — Safe+Battle — walk yes — **listed** (role exists, no unique sprite) — *a chibi quest giver in a travel cloak, staff, a simple bangled “!” is an effect later, not on the sprite, facing the camera*
42. `npc-child` — Child — NPCs — Safe+Battle — walk yes — **listed** (v1; missing from the live NPC list) — *a small-body chibi child in a simple tunic, no weapon, facing the camera*
43. `npc-elder` — Elder — NPCs — Safe+Battle — walk yes — **have** — *a small-body chibi elder in a blue-and-white robe, wooden staff, white hair, facing the camera*
44. `npc-traveller` — Traveller — NPCs — Safe+Battle — walk yes — **new** (escort / caravan) — *a chibi traveller with a pack and walking stick, facing the camera*
45. `enemy-goblin-shaman` — Goblin shaman — Enemies / goblins — Battle — walk yes — **new** — Goblin lair — *a small green chibi goblin in a tattered robe, bone staff, facing the camera*
46. `enemy-bandit-archer` — Bandit archer — Enemies / bandits — Battle — walk yes — **new** — Bandit lair — *a chibi bandit in a brown coat and dark bandana, short bow, facing the camera*
47. `enemy-bandit-chief` — Bandit chief — Enemies / bandits — Battle — walk yes — **new** — Bandit lair — *a taller chibi bandit chief in a darker coat, gold earring, long blade, facing the camera*
48. `enemy-slime-horned` — Horned slime — Enemies / slimes — Battle — walk yes — **have** (preview) — Slime den — *a purple chibi slime with two short horns, simple face, facing the camera*
49. `enemy-slime-spiky` — Spiky blob — Enemies / slimes — Battle — walk yes — **have** (preview) — Slime den — *a red chibi blob with simple spikes, facing the camera*
50. `enemy-slime-blue` — Blue slime — Enemies / slimes — Battle — walk yes — **have** (preview) — Slime den — *a blue chibi slime with a simple face, facing the camera*
51. `enemy-skeleton` — Skeleton — Enemies / undead — Battle — walk yes — **listed** — Ruins set — *a chibi skeleton with a rusted sword, facing the camera*
52. `enemy-acolyte-guard` — Acolyte guard — Enemies / acolytes — Battle — walk yes — **listed** — *a chibi acolyte guard in a dark robe and pale mask, short blade, facing the camera*
53. `enemy-bat` — Bat — Enemies / beasts — Battle — walk yes — **listed** — Beast woods — *a small chibi bat, wings up, whole body in frame, facing the camera*
54. `enemy-goblin-king` — Goblin king — Enemies / miniboss — Battle — walk yes — **new** — Goblin lair — *a larger chibi goblin with a crooked crown and a heavy cleaver, facing the camera* (may be 32×48)
55. `prop-chest-iron` — Iron chest — Props — Safe+Battle — walk no — **new** — *a closed iron loot chest, darker metal bands, isolated, slight three-quarter view*
56. `prop-sign` — Signpost — Props — Safe+Battle — walk no — **listed** — *a wooden signpost with a blank board, isolated*
57. `prop-tree-pine` — Pine tree — Props — Safe+Battle — walk no — **new** — *a simple chibi pine tree, dark trunk, 2-tone needles, isolated, no ground shadow*
58. `prop-rock` — Rock — Props — Safe+Battle — walk no — **listed** — Goblin lair, Slime den — *a chunky grey rock, isolated, no ground shadow*
59. `prop-well` — Well — Props — Safe+Battle — walk no — **have** — *a small stone well with a simple roof, isolated, not a building, no ground shadow*
60. `prop-lantern` — Lantern — Props — Safe+Battle — walk no — **new** — *a hanging lantern, flat 2-tone light, no glow, isolated*
61. `prop-pot` — Clay pot — Props — Safe+Battle — walk no — **new** — *a small clay pot, isolated, slight three-quarter view*
62. `prop-tent` — Traveller’s tent — Props — Safe+Battle — walk no — **new** (small prop, not a building) — *a one-tile wedge tent, simple canvas, isolated, no ground shadow*
63. `ruin-pillar` — Crumbled pillar — Ruins — Safe+Battle — walk no — **new** — Ruins set — *a broken stone pillar, isolated, no ground shadow*
64. `wreck-timber` — Burnt timber — Wreckage — Battle — walk no — **new** — *charred broken beams, isolated, flat 2–3 tones, no glow*
65. `wreck-crate` — Broken crate — Wreckage — Battle — walk no — **new** — Bandit lair — *a smashed wooden crate, isolated*
66. `wreck-debris` — Wreckage debris — Wreckage — Battle — walk no — **new** — *a scatter of planks and iron bits, isolated*
67. `hazard-spikes` — Spike trap — Hazards — Battle — walk no — **listed** (Trap Tile, conceptually) — *a top-down floor tile with short spikes, flat metal, no glow*
68. `hazard-thorns` — Thorns — Hazards — Battle — walk no — **new** — *a low patch of thorny vines, isolated, no ground shadow*
69. `tile-ash` — Ash floor — Terrain — Safe+Battle — walk no — **listed** (Ashroad) — *a top-down 16×16 ash-grey floor tile, seamless edges*
70. `tile-bridge` — Bridge — Terrain — Safe+Battle — walk no — **listed** — *a top-down 16×16 wooden bridge tile, seamless on the short edges*
71. `tileset-moonlit` — Moonlit night set — Terrain — Safe+Battle — walk no — **listed** (v1 night palette) — *not a new Imagine pose: the Ashroad layout with the Moonlit palette (and a night tint preview). One bundled set.*
72. `tile-earth` — Packed earth — Terrain — Safe+Battle — walk no — **new** (battle-ground floor) — *a top-down 16×16 packed-earth tile, seamless edges*
73. `pickup-potion` — Potion — Pickups — Safe+Battle — walk no — **listed** — *a small red potion bottle, isolated, no glow*
74. `pickup-key` — Key — Pickups — Safe+Battle — walk no — **listed** — *a simple iron key, isolated, no glow*
75. `fx-hit` — Hit burst — Effects — Battle — walk no — **listed** — *a flat 2–3 tone impact burst, isolated, no glow* (Effect Designer can also author this)
76. `fx-slash` — Slash — Effects — Battle — walk no — **listed** — *a flat arc slash, isolated, no glow*
77. `fx-heal` — Heal sparkle — Effects — Safe+Battle — walk no — **listed** — *a small flat sparkle cluster, isolated, no glow*
78. `fx-arrow` — Arrow — Effects — Battle — walk no — **listed** — *a plain arrow projectile, side-on, isolated*
79. `fx-orb` — Magic orb — Effects — Battle — walk no — **listed** — *a small 2-tone magic orb, isolated, no glow*

### Wave 3 — 23 assets

80. `enemy-skeleton-archer` — Skeleton archer — Enemies / undead — Battle — walk yes — **new** — Ruins set — *a chibi skeleton with a short bow, facing the camera*
81. `enemy-wraith` — Wraith — Enemies / undead — Battle — walk yes — **new** — *a chibi wraith in a tattered pale cloak, no glow, facing the camera*
82. `enemy-boar` — Boar — Enemies / beasts — Battle — walk yes — **new** — Beast woods — *a full-body chibi boar, dark bristles, facing the camera*
83. `enemy-bear` — Bear — Enemies / beasts — Battle — walk yes — **new** — Beast woods — *a full-body chibi bear, brown fur, facing the camera*
84. `enemy-slime-king` — Slime king — Enemies / miniboss — Battle — walk yes — **new** — Slime den — *a larger chibi slime with a tiny crooked crown, facing the camera*
85. `enemy-boss-tall` — Orb-fused horror — Enemies / boss — Battle — walk yes — **listed** (v1 tall 32×64) — *a tall full-body chibi horror with a fused orb, 32×64, facing the camera, no glow, no ground shadow*
86. `enemy-boss-big` — Ancient horror — Enemies / boss — Battle — walk yes — **listed** (v1 big 64×64) — *a big full-body chibi horror, 64×64, whole body in frame, facing the camera, no glow, no ground shadow*
87. `prop-chest-gold` — Gold chest — Props — Safe+Battle — walk no — **new** — *a closed gold-banded loot chest, isolated, slight three-quarter view, no glow*
88. `prop-hay` — Hay bale — Props — Safe+Battle — walk no — **new** — *a tied hay bale, isolated, no ground shadow*
89. `prop-weapon-rack` — Weapon rack — Props — Battle — walk no — **new** — Bandit lair — *a wooden rack with a simple sword and shield, isolated*
90. `ruin-arch` — Collapsed arch — Ruins — Battle — walk no — **new** — Ruins set — *a broken stone arch, isolated, no ground shadow*
91. `hazard-poison` — Poison puddle — Hazards — Battle — walk no — **new** — *a top-down 16×16 poison puddle tile, flat 2-tone green, no glow, seamless edges*
92. `hazard-firepit` — Fire pit — Hazards — Battle — walk no — **new** — *a stone fire pit with flat 2-tone fire, no glow, isolated*
93. `hazard-beartrap` — Bear trap — Hazards — Battle — walk no — **new** — *an open iron bear trap, isolated, no glow*
94. `tile-cliff` — Cliff edge — Terrain — Safe+Battle — walk no — **listed** — *a top-down 16×16 cliff-edge tile, darker face on one side*
95. `pickup-gem` — Gem — Pickups — Safe+Battle — walk no — **listed** — *a small cut gem, isolated, no glow*
96. `pickup-scroll` — Scroll — Pickups — Safe+Battle — walk no — **listed** — *a rolled parchment scroll, isolated*
97. `pickup-bomb` — Bomb — Pickups — Battle — walk no — **listed** — *a small round bomb with a short fuse, isolated, no glow*
98. `pickup-heart` — Heart — Pickups — Safe+Battle — walk no — **listed** — *a small heart pickup, isolated, no glow, no ground shadow*
99. `fx-levelup` — Level-up — Effects — Safe+Battle — walk no — **listed** — *a flat 2-tone rising spark, isolated, no glow*
100. `fx-poison` — Poison cloud — Effects — Battle — walk no — **listed** — *a small flat 2-tone poison puff, isolated, no glow*

### How this fills each stage type

**Safe (town, village, campfire).** Wave 1 already places a living town: male and female villagers, a merchant, a friendly guard, oak, fence, campfire, a wooden chest and a coin, on Grass / Path / Dirt / River / Brick wall. Later waves add a child, an elder, a quest giver, a traveller, a well, a tent, a sign, a pine, a lantern, pots and hay, plus decorative ruins (ruined wall, crumbled pillar) so a village can feel old. No enemies, no lava, no traps, no wreckage, no weapon rack, until **Add threat or event** (or Freestyle). Village heroes still have `basic-attack`.

**Battle.** Wave 1 is a complete skirmish: the party vs goblin grunt and archer, a green slime, a **bandit thug** (no more acolyte stand-in), and a wolf, with lava, **ruined wall, rubble and a wrecked cart**. Wave 2 fills the themed lair stamps with real members:

- **Goblin lair** — grunt, archer, shaman, goblin king; rocks, torches, crates.
- **Slime den** — four slimes, later the slime king; rocks, water nearby.
- **Bandit lair** — thug, archer, chief; barrels, crates, torches, wrecked cart, broken crate, weapon rack.
- **Ruins** — ruined wall, pillar, rubble, later the collapsed arch; skeletons, acolyte guard, wreckage.
- **Beast woods** — wolf, bat, later boar and bear; trees, rocks.

**Freestyle** sees the full 100, including both bosses.

### Out of this 100

- Buildings: House, Shop, Tower, Gate, and any ruined *house* (the ruin tiles above are rubble and walls, not a building tool).
- UI icons, frames, health bars, SFX, music, and **unit portraits** cropped from hero art (v1 backlog).
- **Studio avatars** (12 square busts for the Studio profile). Planned below; they ship with the pack listing but **do not count toward the 100**.
- Recolour variants of the same enemy (v1’s “2–3 recolours”). **Decided:** not separate rows in this 100; they can come in a later pack rev.
- Rideable mounts and peaceful animals. **Decided:** later, not in this 100. Beasts in the 100 are enemies only.
- Extra classes beyond the five roles plus Brawler and Bard. **Decided:** Ranger is not its own class.

### Outside the 100 — Studio avatars

The live Studio profile has 12 built-in picks in the `te-avatars` library (`avatar_knight` … `avatar_fox`), but the pictures are blank today (initials or a letter chip). The CEO will make the art with Grok Imagine (2026-11-12 direction, 04:17).

**Decision: 12 avatars, and they sit outside the 100.** The 100 is the stage catalogue (Safe / Battle / Freestyle). Avatars are Studio-profile cosmetics, the same kind of out-of-catalogue item as UI icons. Adding them to the 100 would squeeze Wave 3 stage assets (bosses, hazards, chests). They can still be authored in Pack author mode and ship in the **TileEngine Starter Pack** listing (`@2`, 0 gold, Made by TileEngine) as a “Studio portraits” group. Consistent with the accepted picks: fresh Imagine art, a 16-colour hard cap, and no male/female pairs (M/F is only for the five roles plus Brawler and Bard, and the two villagers).

The 12 ids stay the ones already in the profile (`prefs.avatarId`). Knight here is the portrait pick’s name, not a ninth hero class (the stage Warrior still uses the knight look). Upload-your-own remains “Coming later”.

Shared Imagine template — a **square bust**, not a full-body walk sprite. Only the subject line changes:

> square bust portrait, head and shoulders only, chibi face, looking at the camera, centered in a square frame, flat cel shading with 2–3 tones, bold dark outlines, simple shapes, about 12 colours, no gradients, texture, glow or ground shadow, plain magenta `#FF00FF` background

Use mint `#00FF80` instead of magenta if the character is pink. No walk cycle, and no extra direction pictures.

| Id | Name | Prompt subject (rest of the template as above) |
|---|---|---|
| `avatar_knight` | Knight | a chibi knight in steel armour and a blue tunic, head and shoulders |
| `avatar_mage` | Mage | a chibi mage in a red-purple robe, head and shoulders |
| `avatar_rogue` | Rogue | a chibi scout-rogue in a dark hood, head and shoulders |
| `avatar_archer` | Archer | a chibi archer in a green tunic, head and shoulders |
| `avatar_slime` | Slime | a rounded green chibi slime face, centered in the square |
| `avatar_dragon` | Dragon | a chibi dragon head and shoulders, 2-tone scales, no glow |
| `avatar_wolf` | Wolf | a chibi wolf head and shoulders, grey-brown fur |
| `avatar_cat` | Cat | a chibi cat head and shoulders |
| `avatar_owl` | Owl | a chibi owl head and shoulders |
| `avatar_robot` | Robot | a chibi robot head and shoulders, flat metal, no glow |
| `avatar_ghost` | Ghost | a chibi ghost bust, flat 2-tone, no glow |
| `avatar_fox` | Fox | a chibi fox head and shoulders |

QA for an avatar: ≤16 colours, outline present, name, one-line description. No 4×4 walk. Pack-author taps follow the prop path (**6** if guesses are right).

---

## Decisions (accepted 2026-11-12, 04:19)

The CEO accepted all 12 suggested answers. They are now decisions, not picks. The pack is still built after r69 and goes live only on a SEND.

1. **Art.** Wave 1 uses **fresh Imagine art per class and sex**. Shared-body recolours can fill a gap if an Imagine pass slips, but they are a fallback, not the plan. Studio avatars also use fresh Imagine art (square busts).
2. **Enemy tiers.** **One grunt + one specialist + one leader** per main family is enough for now. Recolours can come as a later pack rev, not as extra rows in the 100.
3. **Chests.** **Three rarities**, wooden first, then iron, then gold.
4. **Animals.** **Beasts are enemies only.** Mounts and peaceful animals come later, not in this 100.
5. **Naming.** Public name **TileEngine Starter Pack**, id `@2`.
6. **Knight and Ranger.** **Knight is the Warrior’s look.** Ranger stays an Archer (or Scout) skin, not its own class. The Studio avatar still uses the existing id `avatar_knight` (a portrait pick, not a ninth class).
7. **Moonlit** is **one bundled night palette**, as in v1.
8. **Brawler and Bard** stay in Wave 2.
9. **Sex variants** for **heroes and the two villagers only**. Enemies, other NPCs, and Studio avatars are a single look each.
10. **16 colours is a hard cap.** No “Accept extra colours” in the default flow.
11. **Versions.** Published drops use `@2`, then `@2.1`, `@2.2`, and so on. In-progress authoring only bumps the content hash.
12. **Well and tent** stay as one-tile props in this 100.

### Pack listing and coins (Data & Save Keeper, accepted the same day)

The CEO also accepted the Keeper’s pack-format answers. UX follows them; this plan does not invent a ledger format.

- **Gold is coins only.** There is no second currency. The word “gold” in the hub listing is the display name of the coin ledger (`profile-format.md` §1.10).
- The Starter Pack is a **free hub download at 0 gold**. Buying it is a `hubAssetPurchase` of 0, which is the entitlement.
- The listing carries a **“Made by TileEngine”** badge.
- **Phase A on-device ledger testing is approved** (device-local sandbox / `devGrant` in the test environment only; production rejects it).

## What is not in this round

- No r69 work, and no edits under `ui-shell/js`, `ui-shell/css` or `index.html`.
- No pack assets were authored, and nothing is published. Dev mode is mock-only. Avatar portraits are placeholders in the profile mocks until the CEO’s Imagine art arrives.
- Lair **stamps** (the prefab layouts) are r69 stage work; this plan only tags which assets belong in which set.
- The Behaviour Librarian still owns the final suggestion pairings.

This becomes its own build round after r69, and it goes live only on the CEO’s SEND.
