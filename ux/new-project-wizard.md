# TileEngine — New Project Wizard (UX first draft)

**Owner:** Editor & UX Designer  
**Pitch:** Photoshop “New Document” / RPG Maker create-level flow. Buttons and sliders only. No code shown.  
**Status:** First draft, revised for three audiences (RaiKynn answer).

---

## Audiences

All three audiences use the **engine itself** and build stages in the **Stage/Level Designer**:

| Who | What they do |
|---|---|
| **RaiKynn** | Builds his own games in the standalone engine |
| **Players** | Use the engine (not an in-game maker) to author stages the same way |
| **Indie devs** | Use TileEngine as their engine for their own titles |

**Ruling (CEO scope call S1):** level building never happens inside an exported game. All stages are built in the engine through the Stage/Level Designer. Nothing of the editor ships in a rendered game. The former in-game level maker entry, host-locked wizard steps and player-safe host caps are **removed**.

**Default path = maker-simple.** Few big buttons and sliders, plain words, no jargon. Dev-level depth stays behind a per-step **Advanced** fold.


---



## What we grounded this in

Skimmed on the box (2026-11-09):

| Source | Useful bits |
|---|---|
| `towerchess-docs-2026-10-17` + `new-game-2026-10-11-latest` `docs/ENGINE.md` | Shared shelf: one clock, square/cell math, sprite draw/measure/slice, pack, pin, StageCam `{x,y,zoom}` |
| `src/engine/square.ts` | `COLS = 6`, `TOWER_RANKS = 9`, lane grid 3×6 (18 cells), fit + zoom camera |
| `docs/HOW_TO_PLAY.md`, `ASCENSION_TOWER.md` | Turn-based grid duel: 2 actions/turn, tap piece → pale moves / red rings, cards + mana |
| `docs/TILE.md`, `COMBAT_TARGET.md`, `BUILD_LAW.md` | UNIT + TILE are the only targeting pipes |
| `docs/SPRITES.md`, `sprite.ts` | Sprite measure/slice; one pose per PNG; auto-slice exists in engine shelf |
| `docs/TERRAIN.md` | Terrain as deck/earth lines (not map paint yet) |
| `before-the-fall/ai-match/match-levels.md` | In-match level bar (9 levels) — game feature, not wizard |
| Capacitor / `android/` | Mobile ship path already real |

**TileEngine name:** only in teammate agent profiles (Behaviour Librarian, Engine Architect, Modes Designer, etc.). No `/workspace/tileengine` folder and no behaviour catalogue file existed before this draft. Modes Designer profile order: grid tactics first → menu turn RPG → RTS last.

---

## Wizard flow (6 steps + create when Grid tactics)

Order is fixed when all steps show. Progress dots at top. **Back** left / **Next** right (phone: both in thumb zone — see Touch flow). Live **preview thumbnail** always visible (right on PC, top strip on phone).

```
 Platform → Combat mode → Ability pick* → Camera → Tiles → Map defaults → [Create project]
```

\* **Ability pick** appears only when Combat = **Grid tactics**. Cards are **not** the default.

Player-facing surface per step: one question, big option cards / one or two sliders, Next. Everything else under **▸ Advanced**. Platform choice (when shown) quietly rewrites later defaults and caps. Host limits, when present, win over those caps.

---

### Step A — Platform

**Question (user sees):**  
**Where will people play this?**

**Controls (button group, pick one):**

| Option | Default | Notes |
|---|---|---|
| Mobile | ● default | Phone-first layout, touch targets, smaller map caps |
| PC | | Mouse/keyboard, larger maps OK |
| Both | | Mobile caps win for map size; UI stays touch-safe |

**Defaults:** Mobile.  
**Advanced:** none on this step.  
**Preview:** phone / monitor / both icons; no board yet.

**How this changes later steps:**

| Later step | Mobile | PC | Both |
|---|---|---|---|
| Combat | Same options | Same | Same |
| Camera | Prefer Fixed; zoom default lower | Follow OK | Fixed default, Follow allowed |
| Tiles | Larger default tile px (fat fingers) | Smaller tiles OK | Mobile tile default |
| Map | Max 12×12 (soft), default 6×9 | Max 24×24, default 8×8 | Cap = Mobile (12×12) |
| Touch / chrome | 48–56px hit targets, bottom Nav | 32–40px OK, side chrome OK | Touch sizes |

```
┌─────────────────────────────────────────────┐
│  New Project                    ● ○ ○ ○ ○   │
│                                             │
│  Where will people play this?               │
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ 📱      │  │ 🖥       │  │ 📱+🖥    │     │
│  │ Mobile  │  │ PC      │  │ Both    │     │
│  │ (on)    │  │         │  │         │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                             │
│                    [ preview: device ]      │
│                                             │
│  [ Back ]                        [ Next ]   │
└─────────────────────────────────────────────┘
```

---

### Step B — Combat mode

**Question:**  
**How does a fight work?**

**Controls (button group, pick one):**

| Option | Status | Grounding |
|---|---|---|
| **Grid duel** (Before The Fall / tower-chess) | ● **Supported** — default | 2 actions/turn, pieces on a grid, cards optional later |
| **Tactics squad** (Fire Emblem-style party on a map) | Future (dim + “Soon”) | Modes Designer: first engine goal after core; not shipped as TileEngine yet |
| **Auto-battle** (press Go, watch) | Future | Not in current shelf as a mode |
| **Menu turn RPG** (Star Rail-style menus) | Future | Modes Designer: second |
| **RTS / real-time legions** | Future | Modes Designer: last |

Supported card shows a one-line plain blurb:  
*“You and they take turns. Tap a piece, then a tile or foe. Two actions each turn.”*

Future cards: visible, not selectable (or selectable only as “bookmark for later” if RaiKynn wants — open question).

**Defaults:** Grid duel.  
**Advanced (supported mode only):**  
- Actions per turn: slider 1–4, default **2** (matches How-to-play)  
- Optional: “Use cards & mana” toggle, default **On** (BTF)  
- Turn fuse (seconds): slider 0 (=off) / 15–120, default **60** (tower fuse)

**Platform effect:** none on which modes show; Mobile keeps Advanced collapsed by default.

```
┌─────────────────────────────────────────────┐
│  New Project                    ○ ● ○ ○ ○   │
│                                             │
│  How does a fight work?                     │
│                                             │
│  ┌──────────────────┐ ┌──────────────────┐ │
│  │ Grid duel     ✓  │ │ Tactics squad    │ │
│  │ Turn-based       │ │ Soon             │ │
│  └──────────────────┘ └──────────────────┘ │
│  ┌──────────────────┐ ┌──────────────────┐ │
│  │ Auto-battle Soon │ │ Menu RPG    Soon │ │
│  └──────────────────┘ └──────────────────┘ │
│                                             │
│  ▸ Advanced                                 │
│                                             │
│  [ Back ]                        [ Next ]   │
└─────────────────────────────────────────────┘
```

---


### Step B2 — Ability pick (Grid tactics only)

**Question (user sees):**  
How do players pick abilities?

| Option | Notes |
|---|---|
| **Unit menu** (default, preselected) | Fire Emblem / Final Fantasy style. Tap a unit → small pop-up lists Attack, Spells, Items. |
| **Card hand** | Before The Fall style. Bottom fan / row of cards. |

**One-line note on screen:** Abilities behave the same either way — only the presentation changes.

**Editable later:** Project settings (from Stage toolbar or Home). Same two options; look locked.

**Stage mocks (placeholders only):**
- Unit menu: anchors to the tapped unit, **48px** rows, closes on tap-outside / Escape.
- Card hand: bottom fan/row, tappable, leaves room for the thumb bar.

**CEO ruling (2026-11-09):** Cards are **not** the default.

**Rev 5:** `ability-presentation.style` is `required` + `ask_in_wizard`. This step is **always** shown (no skip). Unit action menu stays visibly preselected and labelled Default, but the user must still pass through; Next writes a `user` answer (never a silent catalogue default).


### Step C — Camera

**Question:**  
**How should the board look on screen?**

**Controls:**

| Control | Type | Range / options | Default |
|---|---|---|---|
| View | Button group | **Top-down** / Angled (Soon) | Top-down (matches current vertical board + stage view) |
| Zoom | Slider | 0.75 – 2.0 | Mobile **1.0**, PC **1.1** (StageCam.zoom) |
| Follow | Button group | **Fixed** / Follow selected piece | Fixed (Mobile); PC may pick Follow |

**Advanced:**  
- Edge pan (PC): toggle, default Off  
- Min / max zoom clamps: 0.75 / 2.0 (hidden unless Advanced)  
- Show grid lines overlay: toggle, default On while editing

**Platform effect:** Mobile forces larger default zoom floor so cells stay finger-sized; Follow warns “may fight with one-thumb play.”

```
┌─────────────────────────────────────────────┐
│  New Project                    ○ ○ ● ○ ○   │
│                                             │
│  How should the board look?                 │
│                                             │
│  View:  [ Top-down ✓ ]  [ Angled Soon ]     │
│                                             │
│  Zoom   ●────────○────────  1.0             │
│         0.75              2.0               │
│                                             │
│  Camera: [ Fixed ✓ ]  [ Follow piece ]      │
│                                             │
│         ┌─────────────┐                     │
│         │  preview    │                     │
│         │  grid zoom  │                     │
│         └─────────────┘                     │
│  ▸ Advanced                                 │
│  [ Back ]                        [ Next ]   │
└─────────────────────────────────────────────┘
```

---

### Step D — Tiles

**Question:**  
**How big is one tile, and what art do we start with?**

**Controls:**

| Control | Type | Range / options | Default |
|---|---|---|---|
| Tile size (px) | Slider | 32 – 128 | Mobile **64**, PC **48** (engine today derives cell size from stage; wizard exposes a clear px target for authored art) |
| Tileset | Picker | Built-in packs: **Stone slabs** (tower), **Lane stones**, Blank | Stone slabs |
| Or upload | Button | “Upload sprites…” → sprite-upload flow | — |

**Advanced:**  
- Snap uploaded art to tile size (On)  
- Transparent colour key (Off; SPRITES.md uses authored alpha)  
- Allow non-square cells (Off — future; current square/lane math assumes uniform cells)

**Platform effect / CEO ruling (project-format r7 §3.1):** the Tiles step **pre-fills a suggested tile size** from the single suggestion table — Mobile **64**, Browser/PC **48**, Both **64**. That table is the only source (no hard-coded fallback). While still in the wizard, an untouched suggestion follows Platform changes; once the user edits tile size, keep their value and show “Suggested for X: N” with **Reset to suggested**. After the project exists, `settings.tileSize` is always the stored value — changing Platform in Project settings never rewrites it (hint + Reset only).

```
┌─────────────────────────────────────────────┐
│  New Project                    ○ ○ ○ ● ○   │
│                                             │
│  Tile size & art                            │
│                                             │
│  Size   ●──────○──────────  64 px           │
│         32               128                │
│  Suggested for Mobile: 64 px                │
│  [ Reset to suggested ]  (if user changed)  │
│                                             │
│  Tileset:                                   │
│  [ Stone slabs ✓ ] [ Lane stones ] [ Blank ]│
│                                             │
│  [ ⬆ Upload sprites… ]                      │
│                                             │
│         ┌─────────────┐                     │
│         │ ▦▦▦ preview │                     │
│         └─────────────┘                     │
│  ▸ Advanced                                 │
│  [ Back ]                        [ Next ]   │
└─────────────────────────────────────────────┘
```

---

### Step E — Map defaults

**Question:**  
**How big is the starting map?**

**Controls:**

| Control | Type | Range | Default |
|---|---|---|---|
| Width (tiles) | Slider | Mobile 4–12 / PC 4–24 / Both 4–12 | **6** (COLS today) |
| Height (tiles) | Slider | Mobile 4–12 / PC 4–24 / Both 4–12 | Grid duel **9** (TOWER_RANKS); other modes later **8** |
| Starting terrain | Picker | Empty / Checker / Stone floor | Stone floor |
| Fog of war | Toggle | On / Off | **Off** (no fog system in current BTF docs — ship as Off; On = “Soon” until Architect signs fog) |

**Advanced:**  
- Wrap edges (Off)  
- Starting spawn marks: “Player south / Enemy north” toggle pair, default On for Grid duel  
- Max units on map soft cap (display only): Mobile 24 / PC 64

**Platform effect:** Caps and defaults as in the Platform table. Preview thumbnail shows width×height grid with terrain fill.

```
┌─────────────────────────────────────────────┐
│  New Project                    ○ ○ ○ ○ ●   │
│                                             │
│  Starting map                               │
│                                             │
│  Width   ●────○──────────  6                │
│          4              12                  │
│  Height  ●──────○────────  9                │
│          4              12                  │
│                                             │
│  Terrain: [ Empty ] [ Checker ] [ Stone ✓ ] │
│  Fog of war: [ Off ✓ ]  [ On Soon ]         │
│                                             │
│         ┌─────────────┐                     │
│         │ 6×9 preview │                     │
│         └─────────────┘                     │
│  ▸ Advanced                                 │
│  [ Back ]              [ Create project ]   │
└─────────────────────────────────────────────┘
```

**Create project:** writes a project file (Data & Save Keeper owns format). Opens empty map editor. No code, no terminal.

---

## Phone touch-flow

Goal: one-thumb use on a phone held in the right hand.

1. **Reach zone:** primary controls (option cards, sliders) in the middle–lower half. Preview is a thin strip under the progress dots (not a tall panel that pushes Next off-screen).
2. **Hit size:** option cards ≥ 48×48 px; slider thumbs ≥ 44 px.
3. **Back / Next:** fixed bottom bar. Back = left third, Next/Create = right two-thirds (bigger, accent fill). Safe-area padding above home indicator.
4. **Scrolling:** only the middle card list scrolls; header + bottom bar stay pinned.
5. **Preview thumbnail:** ~96×96 (or full width × 72). Tap to expand full-screen peek; swipe down to close. Updates live as sliders move.
6. **Advanced:** collapsed accordion; opening it scrolls Advanced into view above the bottom bar (never under it).
7. **Haptics (nice):** light tick on option select and on slider step.

```
┌──────── phone ────────┐
│ ● ○ ○ ○ ○             │  progress
│ ┌───────────────────┐ │
│ │   preview strip   │ │
│ └───────────────────┘ │
│                       │
│   (question + cards)  │  ← scroll
│                       │
├───────────────────────┤
│ [ Back ]  [  Next   ] │  thumb bar
└───────────────────────┘
```

---

## Sprite-upload flow

Entered from Tiles step → “Upload sprites…”. Still no code.

### PC
1. Drag/drop zone (or file picker). Accept PNG / WebP. Multi-file OK.
2. Show each file as a card: name, pixel size, “looks like N×M tiles?” guess from tile-size slider.
3. **Auto-slice:** if image width/height divisible by tile size → propose grid slice (uses engine `sprite` measure/slice idea; user only sees “Split into tiles”). Confirm / Adjust columns & rows.
4. **Size checks:**  
   - Warn if any side &lt; tile size  
   - Warn if &gt; 4096 px on a side (perf)  
   - Block non-image types  
5. Assign to tileset name (text field, default “My tiles”). Done → back to Tiles with that set selected.

### Phone
1. Button: **Choose from camera roll** (and **Take photo** if device allows).
2. Same review cards; pinch-zoom on a tile preview.
3. Auto-slice same as PC; column/row steppers are big +/- buttons, not tiny number fields.
4. If a photo is huge, offer an explicit **Resample at import** (½ or ¼, integer ratios only) that writes a **new** asset — never stretch at runtime (ARCH C15). Prefer slice or letterbox when sizes differ.

**Always hidden from user:** paths, pack declare calls, magenta miss debug — those stay engine-side.

```
┌─────────────────────────────────────────────┐
│  Upload sprites                      [ ✕ ]  │
│                                             │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│  │   Drop PNGs here  or  [ Browse ]    │   │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                             │
│  slabs.png  768×256   →  12×4 tiles?        │
│  [ Split into tiles ✓ ]  cols[- 12 +]       │
│                                             │
│  [ Cancel ]                    [ Add set ]  │
└─────────────────────────────────────────────┘
```

---

## Open questions for RaiKynn (max 5)

1. Should **future** combat modes be visible-but-locked, or hidden until Architect ships them?
2. Is **Grid duel** the only createable mode at v1, with Tactics squad as the next unlock — or a stub sooner?
3. Fog of war: keep as Soon, or cut until a fog rule exists?
4. Default map for Mobile Grid duel: stay **6×9** (tower board) or **8×8**?
5. Project / level name: ask early, or only at **Create**? (Players may expect “Level name” not “Project.”)

---

## Needs from Behaviour Librarian / Engine Architect

**Behaviour Librarian**
- First catalogue slice for Grid duel only: which behaviours a brand-new project may enable from day one (move, basic attack, optional card hooks) — plain names + knobs, no code.
- Confirm banned combos that the wizard must not expose as starter toggles.

**Engine Architect**
- Hard caps: max map width/height per platform; whether tile px is authored truth or derived from stage fit.
- Sign-off: fog On/Off, Follow camera, and non-square cells — supported, Soon, or cut.
- Project bootstrap contract for Data & Save Keeper (fields the wizard must write: platform, mode, camera, tileSize, mapW/H, tileset id, fog).
- Confirm adapter rule: wizard must never imply “paste BTF trees”; only thin mode presets.

---

## Out of scope (this draft)

Behaviour menus inside a running project, deck builders, online lobby, and Modes Designer full mode sheets. Wizard creates the empty project; stages are authored in the Stage/Level Designer. No editor ships inside a rendered game (CEO S1).


