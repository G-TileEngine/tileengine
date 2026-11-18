# Welcome quiz + per-user profile + starter presets (plan, 2026-11-11)
Source: CEO via CoS 2026-11-11 ~21:05. Direction: don't dumb it down; add more help for amateurs.

## 1. Welcome quiz (first launch, ~30s, 4-5 big-card questions, Skip = "Just exploring")
1. What do you want to do first? Make a quick game / Build something big / Make art / Just look around
2. Made a game before? Never / A little (Mario Maker, RPG Maker, Roblox) / Yes, in an engine
3. Do you draw? Not really / A bit / Yes, pixel art
4. Do you code? No / A little / Yes
5. How much help? Show me everything step by step / Tips when I'm stuck / Stay out of my way
Each answer writes to profile; last card shows "Here's how we set you up" summary + Change.

## 2. Per-user profile (profile.experience, app-wide, Settings > "My setup", retake quiz anytime)
- startMode: basic | advanced (per area override: editor, sprite studio, engine/stage, hub)
- toolsShown: core | standard | all (which rail tools / panels / Advanced sections are visible; nothing is removed from data, only hidden — P1 same data)
- startWith: template | blank (wizard + sprite studio default)
- guidance: guided | tips | off (coach marks, "next step" chip, empty-state helpers)
- artist / coder flags: artist -> Sprite Studio offers Advanced + blank canvas; coder -> shows Advanced "Code" views (still hidden by default for others)
Mapping example: Never + Not really + No + step-by-step => Basic everywhere, core tools, templates, guided.

## 3. Guidance layer (help, not dumbing down)
- "Next step" chip above rail (e.g. "Place your hero", "Add an enemy", "Press Play")
- First-time coach marks per screen, 1 at a time, dismissable; "?" on every sheet opens a 2-line explainer + 5s looped GIF
- Empty states always offer a starter ("Add a ready-made enemy")

## 4. Presets / starter assets pass (start-from-scratch fix)
- New Project wizard gains "Start from a starter game": Tiny Tactics (BTF-like 6x9), Dungeon Crawl, Village + quest, Horde stage. Prefills camera, tiles, map, 2-3 units, 1 win rule; everything editable.
- Starter units: ready-made hero/enemy/item kits (r63 parts system extended to Enemy, Item, Tile, Effect) with Kenney CC0 + btf-ashroad/moonlit terrain.
- Starter behaviours: pick-a-role presets from Behaviour Librarian catalogue (Melee, Archer, Healer, Guard, Wanderer).
- Every blank field gets a sensible default; wizard shows "We filled this in for you" with Change.

## Order
WQ-1 quiz + profile mock (prototype round 64) -> WQ-2 guidance layer -> WQ-3 starter games in wizard -> WQ-4 starter kits for Enemy/Item/Tile/Effect. Needs DSK for profile.experience shape, Librarian for role presets, Architect for starter game defaults.

## Prototype r64 welcome quiz (built 2026-11-11, not public until CEO SEND)
Files: `ui-shell/js/welcome.js` (new), `index.html`, `css/app.css`, `js/app.js`, `js/sprite-studio.js`, `scripts/capture_64.py`. Screens `screenshots/64*.png`, audit `screenshots/64-touch-audit-report.json` (0 undersized, 0 JS errors, 0 contrast fails).

**Built (clickable):**
- First launch opens the quiz wherever you land (`?noquiz` skips it for testing). 5 big-card questions, one per screen, progress dots, "1 of 5", Back, "Skip (just exploring)". A tap on a card answers and moves on: **6 taps** to finish (5 answers + Let's go); Skip is 1 tap.
- "Here's how we set you up" summary: Mode, Sprite Studio opens in, Tools shown, New things start from, Help. Each row has Change (inline big segmented control) and a single "Let's go".
- `profile.experience` (PROVISIONAL, pending Data & Save Keeper), stored inside the studio profile (`tileengine.profile.v1`): `{ v, provisional, source: quiz|skip|settings, answers, startMode: basic|advanced, areas: {editor, spriteStudio, stage, hub} (null = same as startMode), toolsShown: core|standard|all, startWith: template|blank, guidance: guided|tips|off, artist, coder, updatedAt }`.
- Mapping lives in one function, `mapAnswersToExperience()` in `welcome.js`. Never + Not really + No + Step by step gives Basic everywhere, core tools, templates, guided. Pixel artists get Sprite Studio in Advanced. Used an engine gives Advanced. Coders get all tools. "Stay out of my way" gives guidance off and never the smallest tool set. Skip gives Basic, standard tools, templates, tips.
- Settings › My setup (from the Studio profile, "My setup" row): big segmented controls for Start in, Mode by area (Editor, Sprite Studio, Stage editor, Home hub: Same/Basic/Advanced), Tools shown, Start from, Help, I draw pixel art, I write code, plus "Retake the quiz" (answers pre-filled; Let's go returns to My setup).
- Wiring: Sprite Studio opens in Basic or Advanced from `modeFor("spriteStudio")` before a drawing starts; the user can still flip it. Advanced + blank preselects the Blank canvas. Core tools hide stage rail Walls/Objects and 4 More items, and the Sprite Studio Advanced More sheet shows Mirror, Frames, Shade and Outline only. It is hide-only, with a line saying "N more tools are tucked away. Show them in Settings › My setup". The guided "Next step" chip sits above the rail: on the stage it reads Place your hero, then Paint the floor, then Press Play; in Sprite Studio it reads Colour your hero, then Tap Tidy, then Make it walk, then Save. Tapping it does the step, and it hides while a sheet is open or when guidance is off.
- CEO add-on, Get started after Let's go: "Make some for me" gives a random starter set fitted to the answers (r63 hero part combos plus colours, 2 to 4 heroes; one code-drawn enemy shape in 2 to 4 recolours; one tile palette from Ashroad day, Moonlit night, Meadow or Dungeon, with 4 code-drawn tiles), with Shuffle and Keep. "Get the free Starter Pack" shows a hub listing card ("0 gold · Free · Made by TileEngine"), contents grouped by Heroes, Enemies, Tiles, Effects, UI and Sounds, and "Add to my library", which then shows "✓ In your library" and "Use it now". Both are also reachable from an empty Sprite Studio library card.

**Mocked / not yet:**
- Storage is localStorage only. The library is a mock key (`tileengine.library.mock.v1`); Keep and Add only set flags, and nothing is imported into Sprite Studio or the stage.
- Basic/Advanced only changes something real in Sprite Studio. Editor, Stage and Hub modes are stored and editable but don't change those screens yet.
- `startWith` only affects Sprite Studio (Advanced plus blank). The wizard's starter games are WQ-3.
- `tips` guidance has no coach marks yet (WQ-2). `coder` has no Code views yet.
- The Starter Pack counts are v1 targets (see `starter-pack-contents.md`). The listing shows only previews; sounds are labels, not audio.
- Stage chip steps come from achievement counters, not real project state, so a project that already has a hero still says "Place your hero" until you place one.

## Architect answers on starter games (docs/engine-answers-starter-games.md sha 2b70b043)
- Tiny Tactics runs on core today (map-6x9, knight + archer vs 3 wolves, defeat-all). Ship first in WQ-3.
- Dungeon Crawl, Village + quest: partial (no scrolling camera runtime, quests, dialogue). Horde waits for live waves / Stages section.
- WQ-3: Tiny Tactics live, the other three as 'coming soon' cards with honest fallbacks.

## DSK answer (2026-11-12): profile.experience is final (data/profile-format.md r3 §1.11)
- It lives at profile.prefs.experience in the studio profile, not in the project, editor-prefs or game settings.
- Keys: quiz{version,outcome}, answers{qid:{option,quizVersion}}, startMode, areas{editor,spriteStudio,stage,hub|null}, toolsShown, startWith, guidance, artist, coder.
- modeFor(area) = areas[area] ?? startMode is derived, not stored. Skip writes only quiz. Answers are never wiped. Sync is last-writer-wins per field, stamped in prefStamps.
- I'm adopting DSK's frozen ids, 1:1 with the mock:
  - make→firstGoal (quick→quickGame, big→bigBuild, art→makeArt, look→lookAround)
  - before→madeGameBefore (little→aLittle, engine→inEngine)
  - draw→draws (no→notReally, bit→aBit, pixel→pixelArt)
  - code→codes (no, aLittle, yes)
  - help→helpLevel (step→stepByStep, tips→tipsWhenStuck, off→stayOut)
- TODO in the next welcome.js round: rename the ids, drop the provisional, v and source keys, and move storage to prefs.experience.
