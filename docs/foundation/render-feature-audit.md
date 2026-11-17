# Render-feature audit: what the Phase 1 play stage shows (P1-8 r4 / P1-9 r4)

Asked by the CEO on 2026-11-17 at 18:52 London, via Chief Of Staff: the APK game must show everything the render system adds, not only the spell effects. This audit checks the bundled play stage at the P1-9 r3 proto tip (`740c63a1`), then folds the gaps into P1-8 r4. P1-7 is not touched.

## In plain words (CEO)
- **Before:** the play page already drew through the full render pipeline (`createSceneLink`, chunked drawing). The bundled level, though, was one flat floor colour. It had no water, trees, torches or darkness, units stood still, and hits had no impact feel. The page also never handed the renderer its lights or screen shake. It also could not load the pictures the renderer makes on the fly (shore foam, moving tiles, hit-flash, squash). Of the 20 render features below, 5 showed today and 15 did not.
- **After P1-8 r4:**
  - The level is a dusk scene. It has a pond with moving water and foam on its shore, two rocks and two flickering braziers. The braziers light the board, and rocks cast shadows.
  - Three trees sway, and they turn see-through when a unit stands under them. Units breathe on a two-frame idle animation.
  - A basic hit freezes for a moment (hit-stop). The target squashes and flashes white, and the screen shakes.
  - The spell carries its own light. It has an outline, animated spark frames, an additive glow and a particle burst, and it tints toward fire colours.
  - Water and rock block walking. That is stage data, not a game rule.
  - All 20 features now show. Three extra controls stay out (see "Not folded").
- **Cost:** P1-8 grows from 174 to 334 changed lines (cap 400), with 9 tests instead of 4 (floor 998 + 9 = **1007**). P1-9 code is unchanged; its floor moves to **1011**, and its phone smoke also checks the stage looks. There are no extra build rounds.

## Audit table (bundled play-stage stage + play page, which draws via `createSceneLink`)
Before = P1-9 r3 tip `740c63a1`. After = P1-8 r4 proto `c11bc4a2` (P1-9 r4 `d870dedd` on top). Paths are under `tools/play-stage/` unless they start with `src/`.

| # | Render feature (src/runtime/render) | Shown before? | Evidence before | Shown after? | How (P1-8 r4) |
|---|---|---|---|---|---|
| 1 | Tile layers + draw list (`draw-list.ts`, `types.ts`) | yes | `board.ts:147` one ground layer `play:floor` | yes | `looks.ts:24` ground from map terrain (floor / water / rock) |
| 2 | Chunked draw (`chunk-plan.ts`, driver `raf-driver.ts:86`) | yes (static floor) | `raf-driver.ts:86` `chunkedList`; all tiles static | yes, both paths | static ground chunks plus per-tile moving water (test 1) |
| 3 | Fit / camera / dirty redraw (`fit.ts`, `camera.ts`, `dirty.ts`) | yes | `page.ts:28-32` (P1-7 camera), `raf-driver.ts:84` | yes | unchanged |
| 4 | Water + shore foam (`water.ts`, `world-motion.ts` shore, `SceneWorld.style` / `waterTiles`) | **no** | `board.ts:147` no `style` / `waterTiles`; `load.ts:20` terrain all 0 | yes | `looks.ts:12,25` `style.ramps.water` + `waterTiles`; `load.ts:20,35` water cells, not walkable |
| 5 | Tile motion: colour cycle (`motion.ts`, `bakes.ts cycleFrames`) | **no** | no `tileProps` / `motion` on any asset (`board.ts:143`) | yes | water tiles cycle (`looks.ts:23`) |
| 6 | World motion: sway (`bakes.ts swayFrames`) | **no** | same | yes | canopy sways (`looks.ts:23`) |
| 7 | Object motion + standing objects (`world-scene.ts:49`) | **no** | `board.ts:147` `objects: []` | yes | two braziers with a flame cycle (`looks.ts:25`) |
| 8 | Canopy above units + see-through (`canopy.ts`, `seeThroughCanopy`) | **no** | no `aboveUnits` layer; flag unset (`board.ts:147`) | yes | canopy layer + `seeThroughCanopy: true` (`board.ts:149`) |
| 9 | Lighting: ambient darkness + light sources (`light.ts createLighting`, driver `View.lights`) | **no** | `page.ts:92` view has no `lights` | yes | dusk `WASH` 0.5 + brazier torches, `litPlan` (`page.ts:93`) |
| 10 | Visibility / sight lines (`visibility.ts`, used by lighting) | **no** | only reached through lighting (none) | yes | rock cells block light (`looks.ts:19`; test 3) |
| 11 | Effect light (`fx-light.ts`, `SceneLink.lit`) | **no** | `fx.ts:12` no `light` step; page drops `link.lit` | yes | swerve steady + stamp pop light, fed into `litPlan` |
| 12 | Hit-white (`fx-light.ts hitWhite*`, `fx-look.ts lookPixels`) | **no** | `fx.ts:11-12` no `hit_white_ms`; `page.ts:91` cannot load `~fx…~hw:` pictures | yes | both docs + `picturesOf` (`looks.ts:58`) |
| 13 | Feel: hit-stop / shiver / squash (`feel.ts`, `world-scene.ts applyFeel`) | **no** | no `hit_stop_ms` / `squash` knobs | yes | house attack `hit_stop_ms` 80 + `squash` |
| 14 | Feel: screen shake (`feel.ts shake*`, driver `View.shake`) | **no** | no `shake` knob; `page.ts:92` drops `link.shake` | yes | `shake` 2 / 1 + `shake: link.shake` |
| 15 | Frames / clips on units (`frames.ts`, `pickClip`) | **no** | unit sheets are 1 frame, no clips (`board.ts:144`) | yes | two-frame idle clip `play:anim:<id>` (`looks.ts:10,14`) |
| 16 | Effect frames / clips (`fx-player.ts`, `clipOf`) | **no** | `fx.ts:48` no `clipOf`; 4 identical frames | yes | `FX_CLIP` spark grows over 4 frames (`fx.ts:10,49`) |
| 17 | Effect path / travel (`fx-path.ts`) | yes | `fx.ts:12` swerve | yes | unchanged |
| 18 | Particles (`fx-particles.ts`, scene `dots`) | **no** | no `particles` step | yes | 12-particle burst with the hit |
| 19 | Effect looks: outline / blend / tint ramp (`fx-look.ts pieceLook`) | **no** | no `outline` / `blend` / `tint_ramp` | yes | swerve outline, stamp `blend: "add"`, `tint_ramp: "fire"` |
| 20 | Live effects + `fx:hit` (`fx-live.ts`, `fx-doc.ts`) | yes | P1-8 r3 cast-fx hookup | yes | unchanged |

### Not folded (and why)
- **Night sheet swap (`light.ts createMoonlit`).** It needs a second night-art set for every sheet, which is an art and project decision. The dusk light already shows the light system. Kept for Phase 2.
- **Darkness `dim`, `fullyDark` and `keepInDim` lights.** These are story or day-phase controls with no Phase 1 rule to drive them. The ambient wash is shown; `dim` stays 0.
- **Reduce-motion, reduce-flashes, shake "low"/"off" and lite mode.** These are player settings, not stage content. Lite mode is already automatic in the driver. A settings menu is not in Phase 1.

## Proof
- **Proto P1-8 r4** `c11bc4a2` on P1-7 r5 `afbccc63`: `npm run green` 1007/0. New `tests/tools/play-stage-looks.test.ts` (5 tests) and the unchanged `play-stage-p18.test.ts` (4 tests) give N = 9.
- **Plants:** 29 of 29 caught (`p1-8-r4-plants.py`). That is r3's 8, plus 21 new ones, one per new row above.
- **Kit-run smoke, P1-8:** `SMOKE PASS` at 390×844 and 360. Every picture loads (`stats.failed` 0, `missing` false), torch lights draw (`lightBuilds` > 0), and the spell shows light and shake, then retires.
- **Proto P1-9 r4** `d870dedd`: green 1011/0. The www smoke gives `SMOKE PASS` and also checks the stage looks.
