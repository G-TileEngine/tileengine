# Maker overhaul plan: structure, flow and real drawing first

r6, 2026-11-27 ~04:15 London. r6 takes the CEO's rulings of 03:53 (via CoS). The prototype is a direction, not the spec, so the screen map lists only shipped or roadmap features. F5b is dropped. 11c1, then F0c. No interim swatches: the map keeps today's look until the new art is done. r5, ~04:05: r5 rewrites § (g) after the CEO's correction (03:34): the goal is quality and the method is open. It also takes all of EA-7.6 (step names ART0–ART2, F3a/F3b split, `tools/art-bake/`, 32 px square three-quarter tiles). r4, ~03:50: r2 added the CEO's fixed requirement (02:51). r3 took all of the EA's asks (EA-6). r4 adds the art-quality steps A0–A2 before F3, per the CEO's ruling on decision 2 (03:28); see § (g). The EA's review of r4 is in § EA-7. Editor & UX Designer (UX) wrote it; the Engine Architect (EA) checks it and adds to it (EA notes go in § EA). Base: main `4206abf6`. Code read: `tools/maker/*.ts`. Also uses `drawing-audit.md` (D1) and `proposal.md` (L1–L3), both in this folder. Nothing pushed, nothing sent to builders.

## Plain answer for the CEO
- You're right on all six points. No step ever owned the maker's layout. Each guide said "add a section on the project page", so the project page became a long list with everything stacked in it (`tools/maker/project.ts`: name, Stages, then each step's section in turn, then Test).
- The fix: rebuild the layout first, heading toward the prototype (open on the map, tools along the bottom, everything else in one game menu), using only features the engine ships. Then put in the new art once it's done, then make abilities and effects show what they do. That's nine small steps (F0c, F1, F2a, F2b, F3a, F3b, F4, F5, F6), each under 400 lines. A short art track (ART0–ART2, § (g)) finds a high-quality code-made style first. You pick the method by eye from one side-by-side sheet. After that, every new step has to pass a placement check before anyone writes its guide.

## (a) Screen map (target)
**Fixed CEO requirement (27 Nov 02:51, via CoS):** in the prototype, everything on today's "My game" screen (Stages, Maps, Units, Levels, Effects, Test) was a feature inside the stage editor, and none of it belongs on a main selection screen. Opening a project lands in the stage editor, and every feature is reached from inside it. So there is **no project page at all**. The ☰ menu below is a sheet that slides over the map, and closing it returns you to the map.

**The prototype is a direction, not the spec (CEO, 27 Nov 03:53).** It shows where the layout is heading. Every tool, button and menu row below is either on main today or a named roadmap step. Nothing is copied from the prototype just to look like it. A roadmap feature gets its row only in the step that ships it (roadmap rule 2). Prototype tools with no shipped or roadmap feature are left out: a separate Walls tool, markers and a Game settings row.

**What opens first:** your last game, on the map of the stage you last edited (the stage editor). Opening any game from My games also lands on its stage editor. A first-time user gets the New game wizard, which ends in the stage editor. My games (the list of games, not features) is reached from ☰.

**Stage editor (main screen; direction from prototype `72c-phone-light-front`)**
- Top bar: ☰ game menu on the left, the stage name in the middle (tap it to switch stage or map, or add a stage), and ▶ Test on the right (the screen's only blue button).
- The map. It keeps today's look (coloured blocks with words, restyled by the F1 kit) until the new art is done. F3b then draws it with pictures (D1). Floating Undo chip (Undo is on main).
- Bottom tool bar, icon plus word, each opening a short sheet:
  - **Paint**: ground terrains (step 4), including wall blocks, which are a terrain today. Each terrain shows as its picture once F3b lands. Edge walls and wall cutaway come with the House builder (step 31), which adds its own tool then.
  - **Objects**: neutrals (step 4c), and doors, stairs and gates with their links and autosave (steps 7 and 8). Cozy objects join this sheet in their own steps (bed 14, gather nodes 15).
  - **Units**: the unit roster as sprites. Tap one, then tap the map to place it. Tap a placed unit for Move, Delete or **Edit unit**.
  - **Rules**: "How is this stage won?" (today it's behind Rules in the top wrap).
  - **More**: Background art (step 9), View (grid lines today; F3b adds the Simple blocks switch, which keeps today's blocks with words), Start new, Resize and Rename (all on main).

**Unit editor (direction from prototype `72-phone-light-unit-editor`)**: Units tool → tap a unit → Edit unit. It shows the picture, stat sliders and Abilities. **+ Add ability** opens compact cards. An ability's page has its Effect row with a live preview.

**☰ Game menu (a sheet over the stage editor, not a screen)**: Stages & maps · Units (full roster) · Effects · Levels & XP · Budgets (11c1) · Build game (step 11) · Save · My games. Later rows join ☰ only in the step that ships them: Items 12, Time 13, Crops 16, Recipes 17, Quests 19, and Game settings with the wizard (29).

**Effects**: ☰ → Effects → an effect. A live preview plays at the top. Below it: colour swatches with a ring on the picked one, sliders, a "Used by" list, and ▶ Test.

| Feature today (where it is) | Where it goes | Tap path from the stage editor |
|---|---|---|
| Stages list (project page) | Stage-name switcher | 1: stage name |
| Maps / Add stage (project page) | Stage-name switcher | 1–2 |
| Units list (project page) | Units tool, and ☰ Units | 1 |
| Unit page and abilities (from the Units list) | Edit unit | 2–3 |
| Levels & XP (project page) | ☰ Levels & XP | 2 |
| Effects (project page) | ☰ Effects | 2 |
| Effect row (ability page) | unchanged, plus a preview | 3–4 |
| Test (bottom of project page) | ▶ in the top bar | 1 |
| Build game (between stages) | ☰ Build game | 2 |
| View, Background, Rules, Start new, Test (top wrap) | More, Rules tool, ▶ | 1–2 |
| Undo bar (full width) | Undo chip | 1 |

## (b) Items 1–4: root cause and fix
1. **Opens on a long "My game" list.** Root cause: `home.ts` makes the project page the hub, with the stage editor as a sub-screen. Steps 5, 6, 10 and 11 each added their section to that page (`projectScreen` `tail`/`units`/`levels`), and no step owned navigation. Fix: **F2a** removes the project page. Opening a game lands on the stage editor, and every section moves inside the stage editor per the table above (the stage-name switcher, tools, or the ☰ sheet).
2. **Units list serves no purpose where it is.** Root cause: it's the roster of unit types (templates). You only need it when you place a unit on the map or edit one, but it sits on the project page with no link to the map. Placing happens in a separate "Pick a unit" sheet inside the stage editor. Fix: **F4** puts the roster in the Units tool (sprites, tap to place, Edit unit). The full list stays in ☰ Units for rename and delete.
3. **Effect options do nothing visible; a column of identical blue buttons.** Three root causes, all checked in code:
   - (a) Picker options are drawn as primary `.btn` (`widgets.ts` `picker`), and the "picked" style only exists for `.choice` (`app.css` L8). Tapping Grass or Fire does save, but nothing on screen changes.
   - (b) The effect sheet has no preview (`effects.ts` `effectsSheet`). You only see an effect in Test, when a unit whose ability uses it attacks.
   - (c) The colour options are names only, with no colour shown.
   - (d) A new effect isn't used by anything, so even ▶ Test shows nothing until an ability picks it (EA-1).
   - Fix: **F1** makes every picker into chips with a visible picked ring (this fixes it app-wide). **F5** adds colour swatches and a live preview on the effect page (the play stage's existing effect drawing, looping a sample cast on a small canvas), plus the same preview in the ability's Effect row. It also adds a "Use it on…" row that picks the unit's ability in one tap, and the demo gets one effect already in use.
4. **"Five abilities", but the attack picker shows one.**
   - Root cause: only abilities that Test can actually play are offered (`WIRED`, `src/rules/behaviours/wired.ts`). Two are attacks: Basic Attack and Line Shot.
   - Each card has a 7×7 tile diagram and is about 330 px tall, so at 390 px the second card is half below the fold (CEO's `attack-picker.jpg` shows both titles). A unit that already has Basic Attack is offered only Line Shot, and the Archer (it has both) gets an empty Browse by goal sheet (`src/editor/unit/add.ts` L22 drops abilities the unit holds; EA check, `ea-shots/03-*`). [EA edit: corrected "only the first card shows".]
   - Step 10 added 10 built-in **effects** (looks such as Holy Blade and Cut), not abilities. They're only reachable inside an ability's Effect row.
   - No step promised five attack abilities. The showcase README's row "+ Add ability (5)" means step 5, which may be where "five" came from.
   - Fix: **F5** makes compact cards (a small diagram beside the name, 4–5 per screen) with a count ("Attack · 2"). An ability the unit already has is shown as "Added" (tap to open it), never as an empty sheet. The cards point to the Effect row: "Looks: 10 built-in effects".
   - More attack abilities means wiring new rules into the engine (EA scope). **CEO 03:53: keep two attacks for now.** F5b is dropped, and the list shows only what works.

## (c) Fix-first steps (each one builder run, under 400 counted lines; sizes are estimates until a trial run)
| # | Step | What the CEO will see | Size | Folds in |
|---|---|---|---|---|
| F0 | Style-spec r2 + target shots (docs, UX), DSK art-format note, EA art bake and hashes | Nothing in the app yet. Starts now, alongside 11c1 | docs / data | proposal.md style-spec, EA-2 |
| — | 11c1 finishes and merges | Budgets (moved into ☰ by F2a) | built | |
| F0c | Carries: CN-029 + pools gate | No screen. Fixes budget types. Test and Build game refuse weighted or waves pools with a plain reason until play runs them | 80–140 | CN-029, pools gate half |
| F1 | Look kit | One blue button per screen, ghost buttons for the rest, red Delete, about 16 icons, chips with a picked ring, card thumbnails, Undo chip (moves to F4 if F1 runs over 380) | 300–380 | L1, item 3(a) |
| F2a | Land on the map | Opening a game lands on the stage editor. ☰ sheet, stage switcher, project page deleted, Budgets and Build game move into ☰. 14 smokes and 2 tests rebased | 340–390 | items 1 and 5 |
| F2b | My games | Hero card, Continue, reopen the last stage | 120–180 | L3 |
| ART0 | Art method pick (UX, outside the repo) | One side-by-side sheet: the candidate methods plus today's art, using the same 5 things (grass, water, a tree, a house, one unit), at phone size and 4× zoom. The CEO picks by eye | no repo code | § (g) |
| ART1a | Bake rig core, for the picked method (builder) | Nothing in the app. `tools/art-bake/` with its own `package.json`: runner, camera and light, palette, sheet packer, manifest, hash check, one sample | 300–340 (EA-7.2, sized for M1; EA re-sizes after the pick) | § (g) |
| ART1b | Frames and edges (builder) | Water and walk frames, the 47-mask autotile edge set | 200–260 (same note) | § (g) |
| ART2 | First art pack (CEO's eye passes it, at most 2 rounds) | Six ground tiles with edges, animated water, 2 trees, a house, and the 6 units (idle and walk, 4 directions) | art scripts 200–300, plus PNGs (count 0) | § (g) |
| F3a | Picture plumbing (no screen) | **No visible change**: the map and Test keep today's look. Under the hood the map and Test can read tile and sprite pictures, tiles are 32 px from `map.tile`, template loading is binary-safe, and tall things overlap the row above. Proved with test pictures in fixtures only; the templates gain no pictures | 320–370 | D1 + L2a (EA-2), EA-7.5 |
| F3b | The ART2 pack goes in | The map and Test show the new art (demo project content). Edges are worked out from the painted terrain. Words move into the View → Simple blocks switch | 150–250 | EA-7.4, EA-7.5 |
| F4 | Stage tool bar | Bottom tools (Paint, Objects, Units, Rules, More). Units palette with the unit pictures. Edit unit from the map. Object art | 300–380 | L2b, item 2 |
| F5 | Abilities and effects you can see | Compact ability cards, "Added" state, effect swatches, live preview, "Use it on…" | ~360, trial first | items 3(b–d) and 4 |
| F6 | Tap-path check | A smoke test walks every row of the screen-map table at 390 and 360, failing if a feature takes more taps than listed. Then the CEO's phone walkthrough | 120–200 | rule (d) |

Order (one builder, interleaved; CEO 03:53): F0 and ART0 now → 11c1 merge → F0c → F1 → ART1a → F2a → ART1b → F2b → ART2 → F3a (while the CEO judges ART2) → F3b (after his pass) → F4 → F5 → F6.
- **What the map shows meanwhile:** today's look (coloured blocks with words), restyled by F1's buttons and chips. There are no swatches, no discs and no old art, so the first pictures anyone sees are the finished new art.
- **Does F3a make sense on its own? Yes, as a no-screen step.** F3a and F3b together are about 470–620 lines, which is over the 400 cap, so they must split. F3a changes nothing on screen, so it doesn't break "wait for the art". It runs while the CEO is judging ART2, so the builder isn't idle, and F3b then only adds the pack.
- If the ART2 pass takes more than one round, F4 can run after F3a and F3b follows. That swap changes nothing on screen, because F4 shows today's look until F3b lands.
- Apart from that, steps run one after another, never in parallel. F3 stays after F2 (UX call): structure is the CEO's first complaint, and it keeps F3's cell styles out of a second CSS file. F4 needs F3a's picture plumbing, so it never runs before F3a. Night art comes with cozy 13.

## (d) Checkpoint rule for every future step (roadmap rule, from r16)
UX and the EA write this **placement card** before any step guide is written. CoS puts it in the step template after "Where <step> sits". QA rejects a guide without it. A step with no screen (like F0c) says so in line 1 and fills in line 4 only.
1. Lives at: <screen in the screen map> · tap path from the stage editor: <taps, at most 3>.
2. Changes or replaces: <existing screen, tool or ☰ row>. Never "a new section on a list page".
3. Seen at once: <what changes on screen as soon as the user taps it>. If it only shows in Test: <what changes in Test, and where>.
4. Data path: written by <file:line> · read by Test/play at <file:line> · demo or showcase data that uses it: <which> / <added in this step>.
5. Usable on landing: the earlier step that makes it usable is <step>, or the in-between step <x.5> goes first, or this step adds the minimum visible piece.
6. Proof: a 390×844 mock now. The handback has shots of the full tap path at 390×844 and 360, and adds a new row to the F6 tap-path smoke.

## (e) In-flight and queued work
- **11c1 (with ChatA now):** let it finish, and merge after QA. About 90% of it is engine rules (budgets read from project data, blocking Test and Build over a hard limit), which the overhaul doesn't change. Its one maker piece is a new Budgets row on the project page (`tools/maker/budgets.ts`, 42 lines), which F2 moves into ☰ Budgets. Holding it would cost a re-trial with nothing gained.
- **CN-029 and the pools gate:** they land early, in F0c. CN-029 has no screen, and the gate stops Test and Build passing stages that fail in play.
- **11c2 (app name and icon), phone maker A1/A3, and playing weighted pools and waves:** all on hold until F6 passes. Each then needs a placement card and is re-based on the new layout. A1/A3 shrink a lot, because F2a and F4 already do most of the phone layout.
- **No APK export (CEO 2026-11-27 09:40 London, via CoS; follow-ups confirmed 13:57 London):** Build game (☰ row, F2a; full export at step 36) has two paths: a browser / io-site zip, and a store path that hands the creator the files plus a wrap-it-yourself guide for Google Play or the App Store. The official engine never builds, signs or uploads an APK, AAB or IPA. Offline also means a player can unzip the zip and double-click `index.html` from disk, so the export must be self-contained (no fetch or XHR of local files, and no ES module loads from `file://`; inline or embed data and assets). A1/A3 are an internal debug maker APK for the CEO's own phone tests only, never shipped, never a maker button. The 11b debug APK stays for showcase phone checks, internal dev/test only. **Import B1 and project backup B2 move to step 36**, not earlier. B1's Import button still sits on My games (2 taps from the map) when it lands.
- **Cozy (12+):** also waits for F6, plus the D1 rule that every new thing ships with a picture.

## (f) CEO decisions (short)
1. ~~Prototype as the look target~~: **ruled 27 Nov 03:53.** The prototype is something to work towards, not the definitive end. Nothing from it ships unless the engine actually ships that feature, and the layout follows the roadmap. Reworded in (a). Shots are copied as direction only, never code.
2. ~~Art source~~: **ruled 27 Nov 03:28, corrected 03:34.** The goal is a high-quality default style made by code, with the method open. ART0–ART2 go before F3b (§ (g)). This raises decisions 5–7.
3. ~~More attacks~~: **ruled 03:53: keep two for now.** F5b is dropped. EA-4's sizing stays on file for later.
4. ~~11c1~~: **ruled 03:53: yes.** 11c1 finishes and merges, then F0c (CN-029 and the pools gate).
5. ~~Art method~~: **ruled 27 Nov 20:14 and 20:16 London (via CoS).** Style B r6b is the best so far and the baseline, though it still needs more rounds (20:14). The method is to port the Python bake recipes to JavaScript in `tools/art-bake/`, so the maker draws the art from recipes (20:16). This replaces M1, M2 and M3, and the 04:57 "M3" card is void. Building on r6b now and swapping in better art later is CoS's recommendation, not a CEO ruling. The details are in `docs/maker/art-style.md`. The EA re-sizes ART1a and ART1b (L73, L147–L150) against it. § (g).
6–7. ~~Locked set and interim swatches~~: **ruled 03:53: "wait for art to be done first".** No interim swatches or discs, and the locked 9 Nov set is not used as the default (it stays as a reference). The map gets pictures only when the new art is done (F3b after ART2). Until then it keeps today's look under the F1 kit.
8. ~~APK export~~: **ruled 27 Nov 09:40 (via CoS); follow-ups confirmed 13:57 London.** No APK export from the official engine: Build game (step 36) gives a browser / io-site zip and a store wrap-it-yourself guide; TileEngine never builds, signs or uploads an APK, AAB or IPA. Offline includes opening `index.html` from disk, so the export must be self-contained. The 11b debug APK and a private maker APK (A1/A3) stay internal for the CEO's phone tests, never shipped. Import B1 and backup B2 move to step 36. This is about the engine not exporting APKs, not about the engine app's own store build.

**Still open:** none. The tile size (r6b's main bake is 48 px, the plan says 32 px) stays at 32 px unless the CEO rules otherwise.

## (g) Art quality overhaul: ART0–ART2, before F3b (CEO rulings 27 Nov 03:28 and 03:34)
**Goal:** a **high-quality default art style, made by code**, for the engine and the games made with it.
- The prototype's code-drawn art was a good baseline. But trees, houses, water and grass look low quality, so the map must not go live with it (03:28).
- **The method is open (03:34).** three.js was only the CEO's example that code art can look good, not a request.

**Fixed whatever the method:**
- Art is made once, offline, and saved as PNG pictures (a "bake"). The engine and games only ever load PNGs, as they do today. So the method decides how good the art looks, never how fast it runs on a phone.
- Everything stays offline, and TileEngine never calls an outside service.
- Top-down three-quarter view on the **square** grid, 32 px tiles (EA-7.3; Test draws 16 px today, which F3a changes). Tall things (trees, houses, units) overlap the row above, which the engine already draws correctly (EA-7.3).

**The candidate methods**
| Method | How it works | Look quality | Phone performance | Offline | Costs and risks |
|---|---|---|---|---|---|
| **M1. 3D pre-render** (three.js or plain WebGL) | Small 3D scenes built from shapes, with one shared light and camera, rendered to PNG in headless Chrome | Highest depth: real light, soft shadows, solid trees and houses, smooth water frames | Same as today (PNG) | Yes | Needs a library in the bake tool only (three.js, MIT; EA-7.1 shows it can be fenced off). Can look like generic 3D unless styled. The EA proved a bake on the box (`ea-shots/art-bake-proof/`) |
| **M2. Height-lit 2D** ("2.5D") | Code paints each thing as colour plus a height map, then lights it like 3D in plain canvas code | Close to 3D shading with a painted feel. Strong on grass, stone, water ripples and roof tiles | Same (PNG) | Yes | No new library. Builds on the painter we have (autotile, palettes, own PNG writer). Tall shapes (trees, houses) are harder than M1 |
| **M3. Better 2D painting** (canvas, today's route, improved) | Layered noise, gradients, shading and hand-tuned shapes | Medium-good. Its ceiling showed in the axe and sword tests (scores about 0.60–0.72) | Same (PNG) | Yes | Cheapest, but it's what the CEO judged low quality. Only worth it with a clear new technique |
| **M4. SVG vector painting** | Shapes with gradients and filters, baked to PNG | Crisp and clean, but flat | Same once baked (live SVG would be slow) | Yes | Tends toward the flat "website" look the CEO rejected for the UI kit |
| **M5. Shader painting (SDF)** | Small GPU programs describe smooth shapes and soft light, rendered to PNG | High, smooth and stylised | Same (PNG) | Yes | No library, but the hardest to write and maintain, and slow to add each new thing |
| ~~Live 3D in the game~~ | WebGL running on the phone | High | **Rejected:** battery, heat, mid-range phones (S21 Ultra target) | Yes | Changes the engine's renderer |

**UX recommendation:** put **M1, M2 and M3** on the ART0 sheet. M4 is left off for its flat look, and M5 for its upkeep.
- If M1 and M2 look as good as each other by eye, take **M2**: no new library, it reuses our painter, and each new thing is cheaper.
- If M1 is clearly better, take M1. Its library lives only inside `tools/art-bake/`.

**The locked 9 Nov set:** replaced as the default. It stays in `painter-proto/locked/` as a reference and isn't shipped in templates. Its palettes (ashroad, moonlit) are the starting colours for whichever method wins. Night versions come later, baked from the same scripts with a night light (cozy 13).

**The steps**
- **ART0, method pick (UX, now, outside the repo, about one session).**
  - UX drafts `docs/maker/art-style.md`: camera, 32 px square tiles, light direction, palette (six terrain ramps plus fire, frost, holy and venom), outline, and readability at 390 px.
  - **One side-by-side sheet.** Columns: M1, M2, M3 and today's art as the baseline. Rows: the same 5 things (grass, water with 2 frames, a tree, a house, one unit).
  - It's shown at real size on a 390 px phone map and at 4× zoom. The CEO judges by eye.
  - One round; no open-ended iteration (lean usage).
- **ART1a and ART1b, bake rig for the picked method (builder).**
  - It lives in `tools/art-bake/` with its own `package.json`, as the `tools/pixel-suite/` precedent does (EA-7.1). `npm run green` and the engine's dependencies stay unchanged, and a test fails if a bake library ever reaches the root `package.json`.
  - ART1a is the core (300–340 lines). ART1b adds frames and the 47-mask edges (200–260 lines).
  - Those sizes are for M1 (EA-7.2). An M2 rig has no library pin and reuses painter ideas, so the EA re-sizes both after the pick.
  - The committed PNGs are the master copy. The check re-bakes on the pinned Chrome and fails on any difference.
- **ART2, first pack (art scripts 200–300 lines; PNGs count 0).**
  - The six terrains with autotile edges, animated water (8 frames), 2 trees, a house (F4 places objects), and the 6 units (idle and walk, 4 directions).
  - It uses the format's existing `tileset`, `sprite`, `clips` and `maskSet: blob47` (EA-7.4).
  - **DSK rules three points before the F3b guide:** the pack's origin and credit, how ground is worked out from painted terrain, and `map.tile` (EA-7.4).
  - **Gate:** the CEO's eye on a 390 px map sheet, at most 2 rounds.
- **F3a and F3b:** see (c). F3a is plumbing with no visible change, run while the CEO judges ART2. F3b brings ART2 in after his pass.
- **Things with no art yet (crops, potions, recipes, bed, cozy props).**
  - Made in the same rig with the same light, camera and palette, so they match.
  - Each cozy step adds one small art script per new thing (about 30–60 lines, inside its 400), for example crops in 4 growth stages, a potion, a recipe card or the bed. The bake check covers them.
  - Line 4 of the placement card says "pictures: <art scripts added>".
  - Users can still bring their own pictures.

**Owners:**
- UX: `art-style.md`, the ART0 sheet, and review sheets at 390.
- EA: the rig's design, the sizes after the pick, the hash check, F3a/F3b.
- DSK: the three format points.
- A builder: ART1a, ART1b and the ART2 art scripts.
- CoS: the CEO's gates, and whether a second builder takes the art steps.
- QA/CoS: name `tools/art-bake/pack-manifest.json` as a generated file in each art guide, so it doesn't count toward the 400 (EA-7.1).

**Risk:** only F3b waits on the CEO's pass of ART2. Everything else keeps moving.

**CEO decisions this raises (in (f)):** 5 (the method, by eye) is still open. 6–7 were ruled at 03:53: wait for the art, with no interim swatches.

## § EA
Engine Architect (EA-9 for the EA), 2026-11-27 ~03:10 London. Checked on a fresh clone of GitHub main at **`4206abf6`** (`/tmp/ov`, still main's tip). Headless Chrome shots at 390×844 are in `ea-shots/`. Nothing pushed or sent. **EA edits above the line:** one, in (b) item 4 (the second card isn't hidden; it's half below the fold, and units that already hold an attack see fewer cards). Everything else of UX's r2 stands as written.

### EA-1. Items 3 and 4: UX's causes are confirmed; added cites
- **3(a) is confirmed by a run.** `tools/maker/widgets.ts` L14 draws picker options as `class="btn"` with `aria-pressed`. `app.css` L8 styles `[aria-pressed="true"]` only on `.choice`. In the run, Fire saved (`aria-pressed="true"`), but its colour was `rgb(47,91,255)` before and after, the same as every other option (`ea-shots/02-*`).
- **3(d), a fourth cause UX didn't list: a new effect is used by nothing, and the list can't link it to an ability.**
  - "+ New effect" writes `effects/effect_<ULID>.json` (`tools/maker/effects.ts` L77, `src/editor/effect/list.ts` L22-25) and lists it as "Not used yet" (`effects.ts` L22).
  - It is used only when an ability's Effect answer names it (`list.ts` L16). That answer is set elsewhere: unit → ability → Effect row (`tools/maker/ability-panel.ts` L35-41).
  - Test reads it only for `basic-attack` and `line-shot` setups (`tools/play-stage/project.ts` L53-59).
  - A unit with no ability setup casts the stock house attack instead (`tools/play-stage/fx.ts` L32-36).
  - In the demo template only the Archer holds those setups (`setup_…04`, `setup_…05`), and there is no `effects/` folder.
  - So editing an effect changes nothing anywhere until you open the Archer's ability and pick it. Even then it shows only when the Archer attacks in Test.
  - **Fix (F5, about 30 more lines):** a "Use it on…" row on the effect page lists the attacks and sets the answer, plus the live preview UX planned.
- **3 is a code bug (3a) plus design gaps (3b-d).** It's not a data gap, although the demo could also seed one used effect.
- **4: what step 10 promised.**
  - The 10d guide's Goal says "the 10 BTF effects (Purple Drop, Holy Blade, …)" in the Effect row. Those are *looks*, not abilities.
  - No guide line promises five abilities. I searched every step guide and the roadmap.
- **4: why the picker is short.**
  - + Add ability lists a catalogue row only if it is in `WIRED` (`src/rules/behaviours/wired.ts` L2-9), is a `primary`, and the unit doesn't already hold it (`src/editor/unit/add.ts` L22).
  - The catalogue has 12 primary attacks: basic-attack, line-shot, pierce-line, radial-volley, sky-drop, splash-hop, random-strikes, multi-attacker, lane-sweep, cross-burst, cone-sweep and orbit-ring. Only the first two are wired, because the battle rules hard-code them (`src/rules/battle/battle.ts` L50 and L65, `src/rules/turns/bot-ability-priority.ts` L28 match only `"line-shot"`).
  - Wired-only is a standing rule (step-05 guide L58 "No button before it works … left out, not greyed", L69 H5).
  - **It's a design gap, not a bug.** The smallest fix is F5's compact cards plus the count. More attacks are decision 3 (EA-4).

### EA-2. Ruling on D1 and L2a, and how the locked art ships
**[Amended by EA-7.4, 03:50]** After the CEO's 03:28 ruling, F3 imports the **ART2 pack**, and the locked 9 Nov set is reference only (not shipped, not a fallback). Read "locked art" below as "the ART2 pack". In the format bullet, read the new kinds `tile`/`unit-sprite` as the existing §6.2 kinds `tileset`/`sprite`. EA-7.4 lists what DSK still rules.
**EA ruling: D1 and L2a merge into F3, as UX wrote.** They are one change seen from two sides: the same picture table feeds the maker cells and Test. Splitting them would ship pictures in Test while the map stays words, which is exactly the complaint. My reading of the two:
- D1 = bring in the locked art and draw it in Test and in the map.
- L2a = the look of the map cells.

**F3 scope (day art only):**
- ashroad ground tiles and the 6 locked unit sprites (knight, archer, mage, rogue, cleric, beast);
- units with no locked art (Villager, Crate, Merchant) get the side-coloured disc plus initial from UX's spec;
- objects and buildings (7 plus 6) come with F4's Objects tool, because the maker can't place objects yet;
- the moonlit night set comes with cozy step 13 (day/night).

**How the art ships:**
- **Format (owner DSK, before the F3 guide):** a short DSK note.
  - `project.assets` gets kinds `tile` and `unit-sprite`, next to `background`.
  - `units/*.json` `sprite` (already read at `src/project/read/unit.ts` L18) names an asset id.
  - A map-level table binds tile ids to tile assets.
  - The import converter rulings already allow this (project-format L754-772).
- **Bake (owner EA, outside the counted lines, not the builder):**
  - render the locked 2026-11-09 painter outputs to PNG from the old repo's `painter-proto` (read only, nothing edited);
  - check each against the `MANIFEST.json` hashes;
  - hand the PNGs plus a hash list to the builder as fixed inputs, like the showcase files.
- **Where the assets live:** as project content (R14-1), not as an engine library.
  - PNGs under `data/templates/demo.tileproj/assets/` and `fixtures/demo.tileproj/assets/`, with `credit` filled in.
  - The registry lines go in each template's `project.json`. 11c1 also edits those files, so **F3 must start after the 11c1 merge.**
- **The 400 gate:** PNGs are binary and not counted. The registry JSON, the code, tests and smoke are counted. My estimate is still 300-380: maker cells about 120, play stage about 100, registry about 25, tests and smoke about 100.
- **Owners:** the builder writes all code. DSK owns the format text. The CEO picks the art source for things with no art (decision 2).

### EA-3. Order, sizes, the 11c1 slot, CN-029, the pools fix, and F3/F4
**11c1's maker files are** `tools/maker/home.ts`, `app.css`, `budgets.ts` (new), `export.ts` and `test-launch.ts`. It also edits the template and fixture `project.json` files, `src/project/load/{read-project,budgets,index}.ts` and `src/editor/project/test-gate.ts`.

| Order | Step | Goal (one line) | Size | Shares files with 11c1 | Start before the 11c1 merge? |
|---|---|---|---|---|---|
| now | F0 + prep | UX shots and style-spec. DSK asset note. EA art bake and hashes. Trial clones | docs or data | no | **yes** |
| 1 | 11c1 | finish and merge (UX and EA agree) | built | n/a | n/a |
| 2 | F0c carries | CN-029 (staged data, no screen) plus the **pools gate**: Test and Build refuse weighted or waves pools with a plain reason | 80-140 | yes (`read-project.ts`, `test-gate.ts`) | no |
| 3 | F1 look kit | buttons, icons, chips with a ring | 300-380 | yes (`app.css`, `home.ts`) | no |
| 4 | F2a menu and land on the map | open on the stage editor; ☰ sheet; stage switcher; delete the project page; rebase every smoke and test | 340-390 | yes (`home.ts`, `budgets.ts` mount, Build row in `home.ts` L169-195) | no |
| 5 | F2b My games | hero card, Continue, reopen the last stage | 120-180 | `home.ts` | no |
| 6 | F3 drawing hookup | pictures in the map and in Test | 300-380 | template `project.json` | no |
| 7 | F4 stage tool bar | bottom tools, Units palette with sprites, Objects | 300-380 | no | no (needs F2a and F3) |
| 8 | F5 see abilities and effects | compact cards, swatches, live preview, "Use it on…" | 300-380 | no | no (needs F1) |
| 9 | F5b two more attacks | only if the CEO says yes to decision 3 | 300-350 | no | no |
| 10 | F6 tap-path smoke | walks the screen map | 120-200 | no | no |
| then | 11c2, A1/A3, pools in play, cozy 12+ (B1 import and B2 backup move to step 36) | each with a placement card | | | |

- **CN-029 (a structural ask for UX).** UX's (e) holds CN-029 until F6. I'd land it right after the merge, inside F0c.
  - It is 11c1's staged budget data. It has no screen, so it needs no placement card.
  - Holding it leaves main on known-wrong budget values for seven steps.
- **The pools fix belongs in F0c, as the gate half only.**
  - Today `playDocsOf` calls `readStage(stage, { picks: 0, waveUnits: 0 })` (`tools/play-stage/project.ts` L66). So a weighted or waves pool passes readProject, the Test gate and Build, then fails in play with "play: stage".
  - A gate that passes broken stages is a structure bug. Making the gate honest is about 60-100 lines.
  - Actually playing weighted pools and waves is engine work. It waits behind F6 with a placement card.
- **The F2 size is over 400, so I split it into F2a and F2b.**
  - 14 of the 22 smokes pass through the project page:
    - 7 tap "Demo stage" after Create;
    - s5a, s5b, s6a, s9b, s10c and s10d use its sections;
    - s4c (stages and maps), s6b (levels), s6c, s7, s8, s11a and s11a2 (Build game) also use it.
  - Rebasing them costs about 50-70 counted lines.
  - Two tests render `projectScreen`: `tests/editor/project-home.test.ts` L45 and `tests/tools/play-stage-source.test.ts` L69. Rewriting those plus new ☰ tests is about 60.
  - The code itself is about 250-300 (☰ sheet and routing, switcher, opening on the map, Back→☰ in the `stage.ts` L148 bar).
  - All of that lands in F2a. F2b holds My games and Continue.
- **Budgets and Build game after F2.** Both become ☰ rows, and F2a moves both.
  - F2a edits only the mount point in `home.ts`. The bodies stay in `tools/maker/budgets.ts` (11c1) and `build-sheet.ts`/`export.ts`.
  - So F2a can't start before the merge.
- **B1 Import goes on My games** (when it lands at step 36).
  - Home (the games list) still exists in r2, reached by ☰ → My games or by a first launch.
  - So the Import button sits on My games: 2 taps from the stage editor.
- **F3 and F4: serial, F3 first.**
  - F3 rewrites `stage.ts` L97-109 (`tone`, `cellsHtml`), `tools/play-stage/looks.ts` and assets.
  - F4 rewrites the `stage.ts` L148 bar and the cell sheets, and its Units palette shows F3's sprites.
  - The hunks are apart, but F4 depends on F3, so they can't swap.
- **Structural ask: could F3 come before F2?**
  - F3 doesn't touch `home.ts` or the bar, so it doesn't depend on F2. Running it right after F1 (order F1 → F3 → F2a → F2b → F4) gives the CEO real pictures two steps sooner.
  - It needs F3's cell CSS in its own file (`tools/maker/cells.css`, not `app.css`) so that F1 and F3 don't collide.
  - UX to decide. I don't mind either order.
- **Size watch.**
  - F1 edits button classes in about 10 files. If its trial runs over 380, move the Undo chip to F4 (it was L2b's in `proposal.md`).
  - F5 rises to about 360 with "Use it on…" and needs a trial run.

### EA-4. Decision 3: wiring more attacks (size)
- **It's engine code, not data.**
  - The catalogue rows exist, but the battle and AI only know `line-shot` (EA-1).
  - Each new attack needs:
    - a rule def (`src/rules/battle/*.ts`);
    - a tile shape for targeting;
    - a bot priority line;
    - a `WIRED` entry and an adapter branch (`tools/play-stage/project.ts` L78-79);
    - a stock effect;
    - a card diagram;
    - tests.
- **Size:**
  - first, a one-time change of `battle.ts` L50/L65 and the bot's L28 from "line-shot" to a shape table: about 80-100 lines;
  - then about 90-100 lines per attack.
  - Two attacks fit one step (about 300-350, **F5b**, after F5 so they show as compact cards). Three need two steps.
- **EA's pick:** **pierce-line** (reuses the line targeting) and **cross-burst** (reuses the orthogonal reach). Cone-sweep goes in a second step if wanted.
- **The other option (show the rest greyed with "coming later")** breaks roadmap rule 2 / step-05 L58 ("left out, not greyed"). It needs the CEO to amend that rule. It would be about 40 lines inside F5.

### EA-5. Placement card: merged text for the step template
The real template is private: `tileengine-private` `from-public/handoff/STEP-TEMPLATE.md` (sha256 `5d38af09…`). Main's `handoff/STEP-TEMPLATE.md` is a 3-line pointer to it. CoS adds this section after "Where <step> sits", after the CEO's OK:

```
## Placement card (written by UX and the EA BEFORE the guide; QA rejects a guide without it; at most 12 lines)
1. Lives at: <screen in the screen map> · tap path from the stage editor (the opening screen): <taps, at most 3>.
2. Changes or replaces: <existing screen, tool or ☰ row>. Never "a new section on a list page".
3. Seen at once: <what changes on screen as soon as the user taps it>. If it only shows in Test: <what changes in Test, and where>.
4. Data path: written by <file:line> · read by Test/play at <file:line> · the demo or showcase holds data that uses it: <yes, and which> / <added in this step>.
5. Usable on landing: the earlier step that makes it usable is <step>, or the in-between step <x.5> goes first, or this step adds the minimum visible piece.
6. Proof: a 390×844 mock now; handback shots of the full tap path at 390×844 and 360; a new row in the F6 tap-path smoke.
```

**The current maker screens (main `4206abf6`, before F2), for the card's "Changes or replaces" line:**
- **My games** (`home.ts`): the game list, + New project, ⋯ (rename, duplicate, delete, restore).
- **New project:** Demo or Empty → Name it → Create.
- **Project page** (`project.ts` L9, `home.ts` L47): Save, Stages, Build game, + Add stage, Maps, Units, Levels, Effects, Test (11c1 adds Budgets).
- **Stage editor** (`stage.ts` L138-171): a Back/View/Background/Rules/Start new/Test wrap, word cells, an Undo bar, and the cell sheet (paint, place, links).
- **Unit sheet on the map:** Edit, Move, Delete, Test.
- **Unit editor** (`units.ts`): name, role, Health, Attack, team, Abilities, + Add ability.
- **Add ability** (`add-ability.ts`): Browse by goal → cards with diagrams.
- **Ability page** (`ability-panel.ts`): wired knobs, Effect row (None, saved, Built-in).
- **Effects** (`effects.ts`): the list, then an effect sheet with knobs, Duplicate and Delete.
- **Levels** (`levels.ts`), **Rules** (`rules-panel.ts`), **Background art** (`art.ts`), **Build game** (`build-sheet.ts`, Download and Share).
- **Test** (`test-launch.ts` → play stage): plays the stage, Back to the maker.

### EA-6. Asks for UX (UX r3: all taken. 1–2, 4–6 as written. 3: F3 stays after F2)
1. Move CN-029 out of the hold into F0c, right after the merge (EA-3).
2. Add F0c (CN-029 plus the pools gate) to the table in (c), and split F2 into F2a and F2b.
3. Decide whether F3 goes before F2 (EA-3). If yes, F3's cell CSS goes in its own file.
4. F5: add "Use it on…" (item 3d) and maybe seed one used effect in the demo. Re-size F5 to about 360.
5. In (f), decision 3 should cite EA-4: two attacks are one step, F5b. Greying needs a rule-2 change.
6. The placement card in (d): adopt EA-5's six lines (they add the data path and "usable on landing") or merge it into your five.

### EA-7. Review of r4 § (g): the art steps
Engine Architect (EA-9), 2026-11-27 ~03:50 London. Checked on a fresh clone of GitHub main at **`4206abf6`** (`/tmp/ov2`, still the tip). There are no edits to UX's text. I amended my own EA-2 (tagged at its top). Proof files are in `ea-shots/art-bake-proof/`.

**EA-7.0 Names (a structural ask for UX).** The art steps A0–A2 clash with the phone-maker steps A1/A3 in `/workspace/share/s11/maker-apk-import-plan.md` and in § (e).
- The APK names have already gone to the CEO, so rename the art steps: **ART0** (style pick), **ART1a/ART1b** (rig, split below), **ART2** (first pack).
- This section uses those names.

**[EA, 03:40, after the CEO's 03:34 correction] EA-7.1 and EA-7.2 below assume three.js (M1). They apply as written only if M1 wins at ART0. Whatever the method, the rig stays in `tools/art-bake/` with its own `package.json`, and no art library ever enters the engine or the root `package.json`. EA re-sizes ART1a/ART1b (each at most 400) after the ART0 pick; an M2 or M3 rig has no library pin. EA-7.0 and EA-7.3 to EA-7.5 don't depend on the method.**

**EA-7.1 Where the rig lives. EA ruling: in the main repo, as `tools/art-bake/`, with its own `package.json`. Not in the private repo.**
- **Precedent.** `tools/pixel-suite/` already works this way:
  - its own `package.json` with one exact pin (`playwright-core 1.65.1`), described as "outside green";
  - its lockfile and `node_modules` are in `.gitignore`, like `tools/apk/`.
  - three.js has no dependencies of its own, so an exact pin is enough and no lockfile is needed.
  - I'd use `tools/art-bake/`, not a top-level `art-bake/`, to match that precedent. UX to confirm.
- **What green picks up:**
  - `npm test` runs only `tests/**/*.test.ts`. `tsc` includes only `src`, `tests` and `tools/host-example`. depcruise and `check-law`/`check-state` scan only `src`.
  - Only `eslint .` reaches `tools/` (`eslint.config.mjs` ignores list). That's fine: rig code gets the same lint as pixel-suite, so no ignore line is needed.
  - There's no `npm audit` anywhere in green or CI.
  - **The fence:** three.js isn't in the root `package.json`, so any import of it from the engine, maker or games fails at once. ART1a adds one test that the root `package.json` has no `three`.
- **Licence.**
  - three.js is MIT. A notice in `tools/art-bake/` is enough, and nothing of three.js ships in the engine or games.
  - The repo is proprietary but public on purpose (`LICENSE`), so the model scripts are visible. They're no more sensitive than the engine code, and the baked PNGs ship in the demo anyway.
- **Why not the private repo.** Builders deliver by pushing a branch to this repo, and the private repo is CoS-only ("Ask CoS for access"). Putting the rig there would break the builder flow and QA's G7 count.
- **Where the PNGs land.** The bake writes to `tools/art-bake/out/` (gitignored). F3 copies the passed pack into `data/templates/demo.tileproj/assets/` (and `fixtures/demo.tileproj/assets/`) as project content (EA-2, R14-1), next to `tools/art-bake/pack-manifest.json`, which records for each file:
  - the path, sha256, size, frame grid and clips;
  - the model script and its sha, and the three.js version;
  - the Chrome version.
- **The 400 gate (QA G7: `git diff --numstat`, excluding only `handback/` and the root lockfile):**
  - PNGs are binary and count 0.
  - Model scripts and rig code count.
  - The manifest is generated. **QA/CoS must name `tools/art-bake/pack-manifest.json` as a generated file in each guide**, or it counts.

**EA-7.2 ART1 size: it splits into ART1a and ART1b.**
- **Headless works on the box (proof).** A 10-line three.js scene (an orthographic three-quarter camera, a hemisphere light plus a sun, and a tree from a cylinder and an icosahedron) baked to a 64×96 RGBA PNG.
  - It ran in headless Chrome with `--use-angle=swiftshader --enable-unsafe-swiftshader`, through `playwright-core`.
  - Two runs gave the same sha `1d44fff9…` (`ea-shots/art-bake-proof/tree1.png`, ×4 view `tree1-x4.png`).
  - Hashes are stable only on the same Chrome and SwiftShader build. So **the committed PNGs are the master copy**. The check re-bakes on the pinned Chrome and fails on any difference; on another Chrome it reports, it doesn't fail.
- **Realistic counted lines:**
  - runner (page server, playwright, write PNG): about 40;
  - shared rig (renderer, the orthographic three-quarter camera, lights, palette ramps from `art-style.md`): about 70;
  - model helpers: about 40;
  - sprite-sheet packer (writes the §6.2 `frame`/`grid`/`clips`): about 50;
  - manifest plus hashes: about 25;
  - check script: about 25;
  - one sample model plus tests: about 50;
  - the frame driver (water frames, idle and walk in 4 facings by turning the model): about 50;
  - the autotile edge set (`blob47`, 47 masks per terrain, blending a terrain into its neighbour): about 80;
  - their tests: about 40.
  - **About 470 in total, which is over 400.**
- **The split:**
  - **ART1a, rig core: about 300–340.** Runner, camera and lights, palette, packer, manifest, check, sample.
  - **ART1b, frames and edges: about 200–260.** Water and walk frames, the blob47 edge set.
- **Model scripts count toward the step that adds them:** ART2 (200–300, its own step) and each cozy step (30–60 each, inside its 400), as UX wrote.

**EA-7.3 Draw order: Test is already depth-sorted, and the maker map gets it for free.**
- **Engine renderer** (`src/runtime/render/draw-list.ts`):
  - the ground layers draw first (L54);
  - then every standing thing (units and objects) is sorted by foot y, then column, rank and z (L66), and drawn anchored at its foot (`anchorPx` L11-14, bottom-centre by default);
  - the `above` layer (canopy see-through) draws after them (L82);
  - nothing is clipped to its cell: `push` L22-28 draws the full frame;
  - tiles taller than a cell are drawn from the cell's bottom (L44, `footAt − fh`), which is format r27 (project-format L41: "never clipped … lower rows cover higher ones").
  - **So a tall unit, tree or house overlapping the row above already draws correctly. No engine change is needed.**
- **The gap is in the play-stage adapter, not the engine.**
  - `tools/play-stage/looks.ts` L35-41 (`dressPx`) feeds flat-colour sheets.
  - `load.ts` L7 hard-codes `TILE = 16`.
  - F3 changes only the adapter: trees and houses become standing `object`s (sorted with units, not a tile layer), and the tile size comes from the map's `tile` field.
  - The look stays out of `src/rules`.
- **Maker map** (`tools/maker/stage.ts` L98-109 `cellsHtml`; `app.css` L42 `.cell { position: relative }`, no overflow rule):
  - draw a tall sprite as an absolutely positioned child pinned to the cell's bottom, with `pointer-events: none`;
  - the grid is in row order in the page, so lower rows paint over upper ones: depth order without sorting code.
- **Tile size (a dependency for ART0).**
  - Test draws 16 px cells today, which is too small for baked 3D art. ART0's `art-style.md` must fix the tile size, and I suggest 32 px. F3 then reads `map.tile`: about 20–40 lines, and 9b background size checks follow the tile size.
  - The style must be top-down three-quarter onto a **square** grid. An isometric diamond candidate won't fit the logic grid.

**EA-7.4 Amended EA-2: F3 imports the ART2 pack, and the locked set is reference only.**
- **The format mostly exists already.** DSK's note gets smaller: use what §6.2 has rather than new kinds.
  - Kinds `tileset` and `sprite` (project-format L425, `AssetKind` L1978).
  - Tileset `tile {w,h}`, `grid` and `tileProps {anim, logic}` (L428-430). Water frames go through `tileProps.anim`.
  - Unit `sprite` names an asset id (`src/project/read/unit.ts` L18).
  - Clips are named `<action>-<facing>` (L887), with facings N/E/S/W = up/right/down/left (L1073) and a left↔right mirror (L1433). Idle and walk in 4 facings fit as-is.
  - Autotile edges: `maskSet: blob47 | 4bit` (L590-592) and the layout-v1 sheet (`variants × masks × frames`, L594-599). Map `layers[].autotile: 4|8` (L898).
- **What DSK must still rule before the F3 guide:**
  1. **ART2's `origin` and `credit`.** Probably `origin.upload {fileName, bakedFrom}`, credit RaiKynn / `LicenseRef-TileEngine-Own` / "own, procedural (3D bake)" / `aiGenerated: false`, plus the manifest link.
  2. **Ground from logic.**
     - The demo map stores only `logic.terrain` (floor, water, wall-block). Its ground layer has `tileset: null` and all-null tiles.
     - Either F3 derives the ground picture at draw time from logic plus the tileset's `tileProps.logic` plus the blob47 mask (EA lean: nothing new stored), or the maker writes layer tiles on every paint.
     - "tileset set, tiles null" changes meaning, so DSK must rule.
  3. **The map tile size** (`map.tile` is `null` in the demo) once ART0 fixes it.
- **Two more F3 code gaps found:**
  - The maker build reads every template file as UTF-8 text (`tools/maker/build.ts` L10 `readFileSync(path, "utf8")`), and boot loads templates with `res.text()` (`home.ts` L213). PNGs would be corrupted.
  - F3 must make both binary-safe, writing bytes through `writeBytes`: about 20–40 lines.

**EA-7.5 Running ART1/ART2 in parallel, slips, and the fallback.**
- **File overlap:** none with 11c1, F1 or F2.
  - ART1a/ART1b/ART2 add only `tools/art-bake/**`, plus `.gitignore` lines (`out/`, `node_modules`, the lockfile). 11c1, F1 and F2 don't touch `.gitignore`.
  - The pack lands in the templates only in F3, after the 11c1 merge.
- **Builders:** "alongside" means a **second builder**, because § (c) says all F-steps run one after another. Otherwise interleave: F1 → ART1a → F2a → ART1b → F2b → ART2. CoS to say which.
- **Slip.** As written, F3 waits for the CEO's pass on ART2 (up to 2 rounds), so an ART2 slip moves F3, F4, F5 and F6.
- **EA proposal (a structural ask for UX; a CEO call if UX agrees):** split F3.
  - **F3a, picture plumbing (about 320–370):**
    - the adapter and the maker cells read `tileset`/`sprite` assets;
    - tile size from `map.tile`;
    - a binary-safe template load;
    - tall sprites pinned to the cell bottom;
    - the fallback until art lands is UX's spec (terrain swatch plus icon, a disc with an initial). **Not the locked set**, which the CEO ruled not good enough.
  - **F3b, the ART2 pack (about 150–250):** the PNGs, the registry, the manifest, the ground-from-logic edges and the Simple-blocks words.
  - F3a and F4 don't wait for ART2. Only F3b waits. The map never shows old art, only swatches until ART2 passes.
- **CEO decision if UX takes it:** "Until the new art passes, the map shows clean swatches and discs, never the old art." That fits the 03:28 ruling.

**EA-7.6 Asks for UX (UX r5: all six taken; interleave by default, or a second builder if CoS has one. EA-7.1–7.2 assumed three.js; with the method now open (03:34), the EA re-sizes ART1 after ART0's pick)**
1. Rename the art steps ART0, ART1a/ART1b and ART2 (EA-7.0), and split ART1 (EA-7.2).
2. Use `tools/art-bake/` rather than a top-level `art-bake/` (EA-7.1).
3. ART0's `art-style.md` fixes the tile size (32 px suggested) and a square-grid three-quarter view (EA-7.3).
4. Split F3 into F3a (plumbing, no wait) and F3b (the ART2 pack), and add the CEO line above (EA-7.5).
5. Say whether "alongside F1–F2b" means a second builder or interleaving (EA-7.5).
6. The DSK note narrows to three points (EA-7.4). Update § (g)'s "DSK writes the pack's file and manifest note" to match.

### EA-8. r6 check (EA, 03:58): F3a with no screen, and what F4 needs
- **(a) F3a as a no-screen step: OK, with two conditions.**
  1. "32 px from `map.tile`" must not change today's look. `map.tile` defaults to today's 16 px, and the templates keep 16 until F3b sets 32 along with the pack. Otherwise F3a changes the size of everything on screen, which breaks "no visible change".
  2. The proof for a no-screen step is a before/after comparison: 390×844 shots of the demo template's map and Test on the base commit and on F3a must be pixel-equal. The fixture-picture tests prove the plumbing. The placement card fills in line 4 only (the data path: `map.tile`, tileset/sprite/clips read, binary-safe template loading).
- **(b) F4 needs F3a only for the Units palette. Its Objects tool needs F3b.**
  - Units palette: it must draw each unit through the same picture path as the map (no separate thumbnail code). Before F3b it shows today's unit look; after F3b it shows the pack with no F4 change.
  - Objects: today only the play stage's brazier has a look (`tools/play-stage/looks.ts` L56). The trees and house come only from the ART2 pack. Default order: F4 runs after F3b.
  - If ART2 needs a second round and F4 runs between F3a and F3b, the Objects tool lists only object kinds that already have a look, and F3b adds the pack's objects as data. No interim art is ever drawn, which keeps the CEO's 03:53 "wait for art" rule.
- The rest of r6 is OK: (a)'s trimmed feature list, dropping F5b, 11c1 then F0c, no swatches.
