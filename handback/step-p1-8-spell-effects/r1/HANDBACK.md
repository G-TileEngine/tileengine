# Hand-back step-p1-8-spell-effects r1
Step file: handoff/steps/step-p1-8-spell-effects.md (sha256 ca0585cda9495ba1f5bd42b72617bf635c2269393cce6198dba125521d63ecc9)
Base commit: c913cbd55c5abd65399711f369fa53c5f76b7e52     Head commit: 0e0e21bf4752c2c8a08594c0714c17ff18aa3288     Tree: d3a2d96c6bc61d3ccbeceecce8ac6ca7184e10fc     Branch: step/step-p1-8-spell-effects-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	tests/tools/play-stage-looks.test.ts
A	tests/tools/play-stage-p18.test.ts
M	tools/play-stage/board.ts
A	tools/play-stage/fx.ts
M	tools/play-stage/load.ts
A	tools/play-stage/looks.ts
M	tools/play-stage/page.ts

## Green
npm test: 1007/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm run green: exit 0 on the implementation tree. npm test: 1007 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 56427.20844. deps 148 modules / 470 deps. check:state OK (src). check:law OK (src).

## Smoke
PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core (playwright-core@1.59.1) CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome node handoff/steps/tests/step-p1-8-spell-effects/smoke.mjs . 8795 /tmp/p1-8-smoke.png
ok   no sideways scroll at 390: scrollWidth 390
ok   touch targets >= 44x44 at 390: {"shown":[{"t":"Menu","w":48,"h":48,"show":true,"id":"menu"},{"t":"YOUR TURN","w":390,"h":96,"show":true,"id":"banner"},{"t":"End turn","w":62,"h":48,"show":true,"id":"end"}],"small":[],"end":true,"menu":true}
ok   stage looks load and torches draw at 390: {"failed":0,"errors":0,"missing":false,"lightBuilds":1,"draws":41}
ok   spell effect live, hit, lit, shake, retire at 390: {"ok":true,"live":1,"hits":1,"retired":true,"lit":24,"shook":4,"failed":0,"notes":[]}
ok   one rAF callback per frame at 390: 48 frames, 0 with >1
ok   page errors at 390: none
ok   no sideways scroll at 360: scrollWidth 360
ok   touch targets >= 44x44 at 360: {"shown":[{"t":"Menu","w":48,"h":48,"show":true,"id":"menu"},{"t":"YOUR TURN","w":360,"h":96,"show":true,"id":"banner"},{"t":"End turn","w":62,"h":48,"show":true,"id":"end"}],"small":[],"end":true,"menu":true}
ok   stage looks load and torches draw at 360: {"failed":0,"errors":0,"missing":false,"lightBuilds":1,"draws":40}
ok   spell effect live, hit, lit, shake, retire at 360: {"ok":true,"live":1,"hits":1,"retired":true,"lit":25,"shook":3,"failed":0,"notes":[]}
ok   one rAF callback per frame at 360: 48 frames, 0 with >1
ok   page errors at 360: none
SMOKE PASS

## Shipped tests (sha256, byte-identical to the kit)
92e5c574df1b44ab3532d4a084fd3f50cd893b0a62d0cedad9b2a6dd3204ea3c  tests/tools/play-stage-p18.test.ts
0ac8beeefeae5b7da8f0a9e9690113491bcd495dc39761ffc91218dde41b2bd9  tests/tools/play-stage-looks.test.ts

## Helpers & self-review
- Helper spawn: six review launches (fx contract, looks and motion, board and page caps, a combined acceptance pass, and two channel probes) each returned "sub-agent stream closed before request could be sent" and no agent id. No helper ran, so none is cited as having reviewed the diff. The three reviews below are the ones I then did myself, against the same files, before this hand-back commit.
- fx review (self, tools/play-stage/fx.ts and tests/tools/play-stage-p18.test.ts): no must-fix. refOf is `(action) => action.effects.length === 1 ? action.effects[0] : undefined` and does not return a house ref. ingest uses `cueFromEntry(entry, stepMs, refOf) ?? houseCue`. houseCue returns null unless kind is "ability" and effects.length is 0, so a real ref is not also a house cue and a two-effect entry stays empty. values is a Map; `constructor` is a get miss and returns null. readEffect writes `table.set(read.doc.id, ...)`. sheetOf is always play:fx, 4 columns, TILE. clipOf is always FX_CLIP. Spark radii are 3, 4, 5, 6 at 246,192,74. HOUSE_DOC and LINE_SHOT_DOC match the step.
- looks review (self, tools/play-stage/looks.ts, the terrain and TILES in load.ts, and src/runtime/render/motion.ts): no must-fix. Terrain is the 54-character row string with palette 0 floor, 1 water, 2 rock. Water and rock are closed. dress returns assets, layers, objects, style, waterTiles, light and lights. Ground is play:ground, 3 columns, styled, and tile "1" cycles `{ name: "water", steps: [0, 1, 2] }`. That object shape is required: when styled is true, bakeMotion passes style.ramps and coloursOf returns null unless the ramp has name and steps (motion.ts:15-17). Fire is the same with steps [0, 1, 2]. Canopy is above units, tile 0 else null, sway trunkFrom 8. Rock cells set light.blocks to 1. Each brazier is a torch at the cell centre, radius 3 * TILE, colour FLAME_RAMP[2]. unitAsset is play:anim:${id}, 2 columns, idle frames [0, 1], and frame 1 is frame 0 shifted down 1 px. sourceOf returns undefined when own does. picturesOf is own ?? link.pixels. litPlan calls plan with WASH, 0, LIGHT_RES. No `in` on a plain object. constructor is not a picture.
- board and page review (self, board.ts, page.ts, match.ts read-only, world-scene.ts applyFeel): no must-fix. body is DEMO_LOAD or `{ ...docs, talk }`. createPlay has no createSceneLink. fx is createPlayFx(body.effects) and looks is dress(world.grid, body.looks), both returned beside pixels. scene() returns the SceneWorld: looks layers, objects, style, waterTiles, seeThroughCanopy true, effects from fx.ingest, overlays only reach, path and aim, plus the play:fx sheet. worn caches one unitAsset per recipe id. applyFeel drops the lag record when rec.clip !== clip (world-scene.ts:66), so a fresh asset every frame kept lag at 0; the cache stays. pixelsOf tries dressPx, then fxPx, then the old one-TILE bake. page.ts builds one createSceneLink(sourceOf), one createLighting, and picturesOf for load and the driver. The view is link.scene(match.scene(), { tMs, stepMs }) plus litPlan and shake. window gets __fx and __link. driver.start is called once. PlayFx is not imported. match.ts was not edited; createMatch passes docs into createPlay and Object.assigns the play, so fx and looks stay on the match. Line counts: fx 51/72, looks 59/72, load 12/16, board 19/30, page 13/16, p18 test 85/85, looks test 80/80. Total 301 insertions + 18 deletions = 319, under 400.
- Self-review: Acceptance done. npm ci exit 0 and npm run green exit 0 with 1007/0 (base 998 + 9); none cancelled, skipped or todo. typecheck, lint, deps, check:state and check:law each exit 0. Base c913cbd55c5abd65399711f369fa53c5f76b7e52 already has P1-7 and E7p, and the shipped tests import those APIs, so the step was not stopped. Each file is inside its cap and the total is 319, under the hard cap 400 and inside 150–400. Both shipped tests are byte-identical to handoff/steps/tests/step-p1-8-spell-effects/tests/tools/ (cmp, sha256 above). P1-6 and P1-7 play-stage tests stayed inside the 1007. Kit smoke is SMOKE PASS at 390×844 and 360 wide (lines above). painter-proto/, ui-shell/, src/core, src/types/core-types.ts, src/rules/behaviours/catalogue.ts and src/sim/migrations are absent from the diff. No new BTF. QA checklist: G1 done (both shipped tests verbatim; the 9 new tests ran inside the 1007; no .only, skip or todo added). G2 done (tsc exit 0; no ts-ignore, ts-expect-error or any added). G3 done (check:state OK on src; this step adds no phase write). G4 done (refOf, HOUSE_DOC, LINE_SHOT_DOC, FX_CLIP, Looks, DEMO_LOOKS, dress, litPlan and the page view match the step and what the shipped tests call). G5 done (do-not-touch paths absent). G6 done (only the seven files in the step table). G7 done: 319 is inside 150–400, every file is at or under its stated cap, the hard cap 400 holds, and lines were not padded. G8 done (check:law OK; no new clock, no new dependency). G9 done (decisions below). G10 done (each Acceptance line above).

## Decisions & deviations
- Base is c913cbd55c5abd65399711f369fa53c5f76b7e52 (P1-7 merged, 998 tests). Floor used is 998 + 9 = 1007. The run is 1007/0. Changed lines are 319 (301 insertions, 18 deletions). The proto is 338. The hard cap is 400. This diff does not cross 400 and was not padded. No extra file. No new dependency. No src/ change.
- File counts (insertions + deletions; a new file counts every line) against the step caps: fx.ts 51/72, looks.ts 59/72, load.ts 12/16, board.ts 19/30, page.ts 13/16, play-stage-p18.test.ts 85/85, play-stage-looks.test.ts 80/80.
- refOf stays exactly one effect or undefined. The house cue is the host fallback only when cueFromEntry returns null and the action is an ability with an empty effects array. The ref is HOUSE_ATTACK ("house:basic-attack") and the values are HOUSE_DOC (hit_stop_ms 80, shake 2, squash true, hit_white_ms 90, stamp 0.25s). LINE_SHOT_DOC is the step's swerve, at-hit stamp and particles, with connect_step "fly". FX_CLIP is spark frames [0, 1, 2, 3] at 60 ms. The values table is a Map copied from stock plus readEffect rows. A constructor lookup is a miss and returns null. It does not throw.
- docsToInput still does not copy effects into SimInput. The step says to leave it and to hook createPlay. Given docs become `{ ...docs, talk }`, so effects and looks reach createPlayFx(body.effects) and dress(world.grid, body.looks). The one docsToInput change the step names is hostSeed: docs.hostSeed ?? 24301. DEMO_LOAD.looks is DEMO_LOOKS. Water and rock tiles are open false and push_can_enter false.
- Dressing pixels the step did not name: floor 0x243044 (the previous play:floor bake), rock 0x6b6256, canopy 0x1e6b3a. Water is WATER_RAMP[0] and the brazier is FLAME_RAMP[0], so the named colour cycle can recolour them. Ground and the brazier are styled, so their cycle ramp is `{ name, steps }` (water and fire, steps 0, 1, 2) rather than a string array. Cycle ms is the baker default 150. Canopy sway sets trunkFrom 8 and leaves edge at the baker default 2. WASH is 0.5 and LIGHT_RES is 4, as the step states. Torches use FLAME_RAMP[2] and radius 3 * TILE.
- scene() keeps one SceneAsset per recipe id in a Map named worn. Hit-stop lag is stored by clip object identity, and a new unitAsset() each frame cleared it, which failed the shipped hit-stop test. The map holds at most one asset per recipe id present on the board. It does not grow with frames. The FX values Map holds stock plus the docs passed in, not one row per frame. pixelsOf's bake cache is the existing per-id cache.
- Restart and Back still call location.reload(). That call was not part of this diff. Smoke used the Chrome and playwright-core paths above. smoke.mjs was not edited. /usr/bin/google-chrome is not on this machine.

## Next step (optional proposal)
- P1-9 can wrap this play page. A Restart that rebuilds the driver without location.reload() can wait until that packaging step needs it.
