# step-p1-8-spell-effects: Phase 1 P1-8 "Spell effects in the match" (foundation-plan-phased.md §3, ~lines 80–82). On each ability log entry the play page calls E7p `createCastFx({sheetOf, clipOf?, values})` and `cueFromEntry(entry, stepMs, refOf)` from `src/runtime/scene/cast-fx.ts`, with `readEffect` from `src/project/read/index.ts`. `refOf` is `(action) => action.effects.length === 1 ? action.effects[0] : undefined`. Attack uses a house default effect. F17: an editor-saved setup is what the match uses. **r4 (CEO 2026-11-17 18:52 via CoS): the bundled stage and play page also show every render feature** (water and shore, tile and object motion, canopy see-through, torch light with sight lines, unit and effect clips, hit feel, effect light, particles, effect looks; audit `docs/foundation/render-feature-audit.md`). Proof: kit-run browser smoke — every picture loads, torches draw, and the spell's effect is live, lit and shaking, then hit, then retire. 390×844 and 360 wide.

Step id: step-p1-8-spell-effects          Revision: r5 (r4 render fold, hooks rebuilt on ChatA's merged P1-7 at main `6df67ab9`; 338 / cap 400)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: current main when you start (at kit authoring, `origin/main` is `6df67ab937fe00aaa0c2cdebb32d523e5becb046`, runnable count **998**, with P1-7 merged (PR #73) on top of P1-6h, E7p and P1-6 r2). **P1-7 must already be merged on that main** (and therefore P1-6h, E7p, P1-6…P1-2, E7). Floor = that main's test count + 9. If P1-7 is not on main, or if P1-7's APIs on main differ from what the shipped tests import, **stop and report**. At kit authoring main is 998/0, so the authoring floor is **1007**. Branch: `step/step-p1-8-spell-effects-r<N>-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.
Hand-back location: `handback/step-p1-8-spell-effects/r<N>/HANDBACK.md`. Quote this step file's sha256 in full in it.
Depends on: P1-7 (play-stage match, HUD, Spell door, camera) and E7p (`createCastFx`, `cueFromEntry`, `readEffect`), and therefore P1-6h. Render APIs used as they are on main: `createSceneLink(source)`, `createLighting`, `SceneWorld.style` / `waterTiles` / `seeThroughCanopy` / `objects`, driver `View.lights` / `View.shake` (no `src/` change). Build order on main is E6 → P1-3 → P1-4 → P1-5 → E7 → P1-6 → E7p → P1-6h → P1-7 → **P1-8** → P1-9.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Goal
After P1-7 the Spell button fires `line-shot` as an ability log entry, but the match does not play a visible effect. After this step:
1. **Cast-fx hookup.** On each new ability log entry the play host calls E7p `cueFromEntry(entry, stepMs, refOf)` and `createCastFx({sheetOf, clipOf?, values})` from `src/runtime/scene/cast-fx.ts`. `refOf` is exactly `(action) => action.effects.length === 1 ? action.effects[0] : undefined`. `values` looks up a ref with a `Map` (or `Object.hasOwn`), never `in` on a plain object. `sheetOf` / `clipOf` come from the play-stage FX sheet. `readEffect` is imported from `src/project/read/index.ts`. The live list is attached to the scene world (`world.effects`); `createSceneLink().scene(...)` is what fires `fx:hit`.
2. **House default.** A basic attack logs `kind: "ability"` with an empty `effects` array, so the specified `refOf` returns `undefined`. The host then synthesizes a house-default cue (`house:basic-attack`) only when `effects.length === 0`. Do not change `refOf` to pick a house ref itself.
3. **F17 settings round-trip.** `PlayDocs.effects` carries editor-saved behaviour-setup JSON into `createPlay` / `createPlayFx` (hook on ChatA's `createPlay`; leave `docsToInput` as it is), which `readEffect`s each doc into the values table (own-key safe). The match uses those saved values (rev, steps), not the stock `line-shot` or house docs.
4. **Smoke.** Kit-run headless Chromium at 390×844 and 360 wide: every picture loads, torch lights draw, and a Spell two-tap shows the spell's effect live, lit and shaking, then `fx:hit`, then it retires. 0 repo lines.
5. **Stage looks (r4, stage data).** The bundled 6×9 map terrain is the 54-character row string `"000000" "000000" "020000" "100000" "110000" "100000" "000022" "000000" "000000"` (row 0 first; palette `"0": "floor"`, `"1": "water"`, `"2": "rock"`). The tile list in `docsToInput` adds `{ id: "water", open: false, push_can_enter: false }` and `{ id: "rock", open: false, push_can_enter: false }`, so water and rock cannot be walked. `load.ts` exports `type Looks = { canopy: [c, r][]; braziers: [c, r][] }` and `DEMO_LOOKS = { canopy: [[4,1],[5,1],[5,2]], braziers: [[1,2],[5,6]] }`. `PlayDocs.looks?` is optional, and `DEMO_LOAD.looks` is `DEMO_LOOKS`.
6. **Dressing (new `tools/play-stage/looks.ts`).**
   - `dress(grid, looks)` returns `{ assets, layers, objects, style, waterTiles, light, lights }`.
   - `assets`, `layers` and `objects`:
     - The ground layer `play:ground` (3 columns: 0 floor, 1 water, 2 rock) comes from `grid.tileTypeAt`.
     - Water tile `"1"` has `tileProps` motion with a colour cycle on the first 3 `WATER_RAMP` colours.
     - When `looks` is given, a canopy layer `play:canopy` is drawn above units (tile 0 on canopy cells, otherwise `null`), with asset-level `sway` motion.
     - Each brazier is an object `play:brazier` with a `FLAME_RAMP` cycle.
   - `style` and `waterTiles`: `style = { ramps: { water: WATER_RAMP, fire: FLAME_RAMP } }` and `waterTiles = { "play:ground": [1] }`.
   - `light` and `lights`: `light` is a `LightWorld` whose `blocks` are the rock cells. `lights` holds one torch per brazier at the cell centre, with radius `3 * TILE` and colour `FLAME_RAMP[2]`.
   - Colours: `WATER_RAMP = ["#1b3a5c", "#2a5d8a", "#4f8fc0", "#cfe8f5"]`, `FLAME_RAMP = ["#b8401c", "#e8762a", "#f6c04a"]`, `WASH = 0.5`, `LIGHT_RES = 4`.
   - Units use `unitAsset(id)`: sheet `animId(id)` (= `` `play:anim:${id}` ``), 2 columns, clip `idle` frames `[0, 1]`. Frame 1 is the one-frame picture moved down 1 px.
   - `pixelsOf` serves the dressing sheets and the `play:anim:*` sheets first. `pixelsOf(recipe id)` stays one `TILE` wide (P1-6 test), and an unknown id such as `constructor` is `undefined`.
   - Exports for the page and tests:
     - `frameOf(px, f, fw, fh)` cuts one frame.
     - `sourceOf(own)` is the `FrameSource` for `createSceneLink`.
     - `picturesOf(own, link)` returns `own(id) ?? link.pixels(id)`.
     - `litPlan(lighting, looks, lit)` returns `lighting.plan(looks.light, looks.lights, WASH, 0, LIGHT_RES, lit)`.
7. **Hooks.**
   - `board.ts` (ChatA's `createPlay(docs?, moveMs, autoWait)`):
     - `body` for given docs is `{ ...docs, talk }`, so `effects` and `looks` reach the play.
     - ChatA's `const link = createSceneLink()` inside `createPlay` is replaced by `const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks)`; the returned object adds `fx, looks` next to `pixels: pixelsOf`.
     - `scene(): SceneWorld` returns the SceneWorld itself (no longer `link.scene(...)`): `layers: looks.layers`, `objects: looks.objects`, `effects` (from `fx.ingest`), `style`, `waterTiles` and `seeThroughCanopy: true`, with assets `{ ...looks.assets, FX sheet, unitAsset per unit }`. Overlays stay reach/path/aim only.
   - `page.ts` (ChatA's `const match = createMatch()`):
     - `link = createSceneLink(sourceOf((id) => match.pixels(id)))`, one `createLighting()`, and `pixels = picturesOf((id) => match.pixels(id), link)`.
     - `load` reads `pixels(id)`, and the driver gets `pixels`.
     - The view returns `scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs })`, `lights: litPlan(lighting, match.looks, link.lit)` and `shake: link.shake`.
     - `window` also gets `__fx: match.fx` and `__link: link` for the kit-run smoke.
8. **Feel and effect looks (built-in docs).**
   - `HOUSE_DOC = { hit_stop_ms: 80, shake: 2, squash: true, hit_white_ms: 90, steps: [{ kind: "stamp", seconds: 0.25 }] }`.
   - `LINE_SHOT_DOC = { connect_step: "fly", shake: 1, hit_white_ms: 60, tint_ramp: "fire", steps: [{ id: "fly", kind: "swerve", seconds: 0.2, bend: 1, outline: "on", light: "steady", light_radius: 2 }, { kind: "stamp", start_mode: "at-hit", seconds: 0.15, blend: "add", light: "pop", light_radius: 3 }, { kind: "particles", start_mode: "with-last", seconds: 0.3, particle_count: 12, particle_life_ms: 300 }] }`.
   - `createCastFx` gets `clipOf: () => FX_CLIP`, where `FX_CLIP = { name: "spark", frames: [0, 1, 2, 3], ms: [60, 60, 60, 60] }`. The FX sheet's 4 frames grow the spark (radius 3, 4, 5, 6).

## Rulings made
- House default for a basic attack is applied by the host when `refOf` is undefined and `effects` is empty, not by changing the specified `refOf`.
- F17 goes through `PlayDocs.effects` / `docsToInput`. No OPFS and no r73 loader in this step.
- Built-in `line-shot` values are a swerve, an at-hit stamp and a particle burst (`LINE_SHOT_DOC`). `connect_step: "fly"` makes the swerve the hit, so `atHitBeforeHit` is gone and `engine.notes` stays empty.
- **r5:** the r4 features, files `fx.ts` / `looks.ts` and the p18 test are unchanged; only the hooks in `board.ts` / `page.ts` / `load.ts` are re-expressed against ChatA's merged P1-7 code, and the looks test types `Match` locally (`ReturnType<typeof createMatch>`), because main's `match.ts` exports no `Match` type.
- **r4 (CEO 18:52):** the bundled stage must show every render feature. All of it is stage data plus small host hooks in `tools/play-stage/`; there is no change in `src/`. Water and rock are map terrain with `open: false` (stage data, not a game rule).
- Not folded, per the audit: the night sheet swap (`createMoonlit`, which needs night art), `dim` / `fullyDark` / `keepInDim` lights (no Phase 1 driver), and the reduce-motion / shake / lite settings (player settings; lite is already automatic).
- Id-keyed lookups use a `Map` (or `Object.hasOwn`); a prototype-key `constructor` is not an effect row and does not throw.
- Do not import unused types (`PlayFx` is not imported from `board.ts`). `npx eslint --max-warnings 0 .` exits 0.

## Open questions
None that block this step.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `tools/play-stage/fx.ts` | new: `createPlayFx`, `refOf`, house default, bake FX sheet (4 growing frames), `FX_CLIP` via `clipOf`, ingest cues, built-in docs with feel / light / particles / looks | 64 | 72 |
| `tools/play-stage/looks.ts` | new: `dress`, `unitAsset`, `animId`, dressing + idle pixels, `frameOf`, `sourceOf`, `picturesOf`, `litPlan`, ramps / `WASH` / `LIGHT_RES` | 59 | 72 |
| `tools/play-stage/load.ts` | `PlayDocs.effects?` and `looks?`; `hostSeed` optional (`docsToInput` uses `docs.hostSeed ?? 24301`); terrain row string + palette; water / rock tile types; `Looks`, `DEMO_LOOKS`; leave ChatA `docsToInput` in place | 13 | 16 |
| `tools/play-stage/board.ts` | hooks only: `body = { ...docs, talk }`; ChatA's inner `createSceneLink()` becomes `createPlayFx(body.effects)` + `dress(...)` as `play.fx` / `play.looks`; dressing pixels first in `pixelsOf`, bake FX sheet; `scene()` returns the SceneWorld with `effects`, dressing, style, water, see-through; leave ChatA bake / `fit` / intend in place | 23 | 30 |
| `tools/play-stage/page.ts` | `createSceneLink(sourceOf(...))` wraps the driver view; `picturesOf` for `pixels` / `load`; view `link.scene(match.scene(), clock)`, `lights` (`litPlan`) and `shake`; expose `__fx` / `__link` for the kit-run smoke | 14 | 16 |
| `tests/tools/play-stage-p18.test.ts` | new, shipped, byte-identical (unchanged from r3) | 85 | 85 |
| `tests/tools/play-stage-looks.test.ts` | new, shipped, byte-identical | 80 | 80 |
Total ≤ 400 changed lines (proto **338**: tools 173, tests 165; added+deleted). Hard cap 400. (r3 was 174; r4 added the CEO 18:52 render fold at 334; r5 rebuilds the hooks on main.)

## Tests that prove it is done (9 new; ship both files byte-identical)
Copy both files byte-identical from `handoff/steps/tests/step-p1-8-spell-effects/` to the same paths at the repo root.

`tests/tools/play-stage-p18.test.ts` has 4 tests, unchanged from r3:
- `refOf` is exactly one effect, a `constructor` id does not throw, empty effects get the house default, and two-effect entries stay empty.
- F17: an editor-saved effect setup is what `createPlayFx` / the match uses.
- A Spell two-tap cues `line-shot`, the scene is live, `createSceneLink` gets `fx:hit`, and then the effect is retired.
- A basic attack with empty effects plays the house default.

`tests/tools/play-stage-looks.test.ts` has 5 tests:
- Water blocks walking and its tiles cycle. Shore foam bakes, rock is present, static ground is chunked while water draws per tile, every drawn picture loads, and there are no notices.
- The canopy sways above units and is cut over a unit (cells `(5,2)` / `(5,1)` go `null`, `(4,1)` stays). The two braziers have motion.
- Torches light a dusk board, and with the rock blockers there are fewer lit squares than without (sight lines). `constructor` is not a picture.
- Units idle on a two-frame clip. A basic hit plays hit-stop lag, squash, hit-white and shake, and every picture loads.
- A spell's light brightens the board. It throws particles, draws more than one FX frame with an outline and an additive blend, flashes the target and shakes; every picture loads, and `engine.notes` is empty.

N = 9. P1-6 and P1-7 play-stage tests stay green.

## How a planted bug is caught
EA plants 29/29 (`p1-8-r4-plants.py`, rerun unchanged on the r5 proto: r3's 8 with the `createPlayFx` needle updated, plus 21 new). In r3, each of these fails a shipped test: `refOf` returning the first of several effects, skipping the house default, ignoring editor-saved docs, never attaching `world.effects`, dropping `cueFromEntry`, `docsToInput` dropping `effects`, looking up values with `in` on a plain object, or firing `houseCue` when a ref is already present.

In r4, each of these fails a shipped test:
- Effect docs and frames: no `clipOf`, no outline, no additive blend, no particles step; no `hit_stop_ms`, `squash`, `shake` or `hit_white_ms` on the house doc.
- Page lookups: `picturesOf` without `link.pixels`; a `sourceOf` that returns nothing.
- Scene fields: no `style`, no `waterTiles`, `seeThroughCanopy: false`, `objects: []`.
- Dressing: no light blockers, no idle clip, walkable water, no water / canopy / brazier motion, no torches.

## Kit-run browser smoke (0 repo lines)
`handoff/steps/tests/step-p1-8-spell-effects/smoke.mjs` is required in the hand-back. From the repo root: `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-p1-8-spell-effects/smoke.mjs . 8795 /tmp/p1-8-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It serves `tools/serve.ts`, opens `/tools/play-stage/` headless at **390 × 844** and **360 wide** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute). Visible (not `display:none`) buttons must be ≥ 44×44. Every picture must load (`__driver.stats.failed` 0, `backend.stats.missing` false) and the torch lights must draw (`backend.stats.lightBuilds` > 0). A Spell two-tap must show the spell's effect live, lit and shaking, then `fx:hit`, then retire.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 1007 tests passing** (main's count at Base + 9, once P1-7 is on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on main `6df67ab9`: 1007/0.)
- [ ] If P1-7 or E7p is not on main, or if those APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 400 changed lines in total (338 in the proto). Hard cap 400.
- [ ] Both shipped test files are byte-identical to the kit copies. Earlier play-stage tests stay green.
- [ ] **Kit-run browser smoke (REQUIRED)** exits 0 with `SMOKE PASS` at 390×844 and 360 wide (no page errors, no sideways scroll, visible buttons ≥ 44×44, every picture loads, torches draw, spell effect live, lit and shaking, then hit, then retire).
- [ ] Never touch `painter-proto/` or `ui-shell/`. Game rules stay out of `src/core` and `src/sim`. BTF is used only via adapters or rewrites with file:line cites (none new in this step). Id-keyed lookups use a `Map` or `Object.hasOwn`.

## Floor
`npm run green` is at least **1007** tests passing (main's count at Base + 9: 998 + 9 at `6df67ab9`). If main's count at Base (with P1-7 already merged) is C, the floor is C + 9.

## Not in this step
- APK wrapper / play-only packaging → P1-9.
- Building, signing or uploading an APK (ops, not a builder step).
- r73 project loader / OPFS / `?project=`.

## Out of scope
painter-proto, ui-shell, GitHub push, core-types, catalogue edits, Phase 2, CEO phone test 1 (dropped; the CEO's first real test is the APK).

## Do not touch
`painter-proto/`, `ui-shell/` (read-only reference is OK), `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts`, `src/sim/migrations`, P1-6h and P1-7 play-stage tests, E7p's shipped tests. Do not drop or weaken those tests. Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 1007 tests passing** and 0 failing (main's count at Base + 9). Paste the summary line and all kit-run browser smoke lines into HANDBACK.md.
- Both shipped test files are **byte-identical** to the kit copies.
- The branch starts at the Base (P1-7 and E7p already on main). ≤ 400 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-8-spell-effects-r<N>-chatA` (base = current main when you start; P1-7 and E7p must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-8-spell-effects-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
