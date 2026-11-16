# Hand-back step-ed-e3-match-link r1
Step file: handoff/steps/step-ed-e3-match-link.md (sha256 d10d2bcd1fdcba2e6153a5713d71eea4d2d2b142ff54bbc37d640a1ae49a630c)
Base commit: 3aa3551fe0b735b553b80e54fbfda4ad286853ec     Head commit: f80aac339e6ec18f75affd7982a569f8b604b8e3     Branch: step/step-ed-e3-match-link-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	docs/host-guide.md
A	src/runtime/scene/match-link.ts
M	src/runtime/scene/world-scene.ts
A	tests/runtime/scene/match-link-qa.test.ts
A	tests/runtime/scene/match-link.test.ts
A	tests/runtime/scene/match-patch.test.ts
A	tests/runtime/scene/scene-fence-qa.test.ts
M	tests/runtime/scene/scene-fence.test.ts
M	tools/host-example/match-picture.ts

## Green
npm test: 803/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci && npm run green: exit 0. 803 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 90303.62216. deps 112 modules / 357 deps. check:state OK (src). check:law OK (src).
smoke: 0 failed
match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.33 p95 0.59 ms; lap 2 p50 0.26 p95 0.44 ms; lap 3 p50 0.24 p95 0.46 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.41 p95 0.71 ms; lap 2 p50 0.39 p95 0.61 ms; lap 3 p50 0.39 p95 0.63 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.88 p95 3.33 ms; lap 2 p50 1.20 p95 1.68 ms; lap 3 p50 1.22 p95 1.73 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.68 p95 2.22 ms; lap 2 p50 1.66 p95 2.21 ms; lap 3 p50 1.70 p95 2.27 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.09 p95 1.39 ms; lap 2 p50 1.06 p95 1.40 ms; lap 3 p50 1.09 p95 1.38 ms; counts 27/373/0

## Shipped tests (sha256, unchanged)
e3d06bed049c74f776635181131a992e5497908e573b02749de32c605cc35952  tests/runtime/scene/match-link.test.ts
0709a6406b86b9a2e647d86be2b47c67eedd83668d121a122c3f49bbac562c45  tests/runtime/scene/match-patch.test.ts
0fe9d6654c330cec6d922c151c966b1095f45f647a0d12d75112e985f8ccdc91  tests/runtime/scene/match-link-qa.test.ts
2f88a0429de004d3a0de22dbe6cbe62eb884be8b525da11b00b4fcb8b2aa263a  tests/runtime/scene/scene-fence-qa.test.ts
c2d1403f62a2da85379c4edd3f1504875dd3e4f8077295881302f363228977c9  tests/runtime/scene/scene-fence.test.ts

## Helpers & self-review (required)
- Helper sceneFromMatch: rulings 2–6 on match-link.ts, including own-key sprites, an invalid row that does not claim its id, off-map before the sprite, bad offsets, the 1024 cap, and shared empties → PASS. No code change.
- Helper matchPatch and nearestFoe: rulings 9 and 10, including the strict fit after floor, the 1..16 and map clamp, a dead caster as origin, string-< ties, and the 1024 cutoff → PASS. No code change.
- Helper rev memo: ruling 8 on world-scene.ts (+4/−4). Same rev does not bump fxRev. A non-finite rev drops the memo. 100 stable-rev frames call the unit key once. createSceneLink is unchanged → PASS. No code change.
- Self-review: Acceptance done — npm ci && npm run green exit 0, 803/0/0/0/0 (re-run after the spelling fix, duration_ms 90303.62216); smoke 0 failed (CHROME_PATH, the sandbox Chromium); the host example prints the tick-460 line and exits 0; sim afc89d56… and b8007292…; stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 (L p95 1.39 / 1.40 / 1.38 ms, under 2 ms); pin diff empty (1e5dd82c, d7f64a09, 45a3dbaa, 4d7bbf48, d6d08696); shipped sha256s match; caps 68/8/25/2/61/49/33/15/13; total 274 ≤ 400; no Math.random, Date, timers, Card/Deck, or hp/mana/cost in the new src; no UI files; src/runtime/scene imports nothing from src/sim or src/editor. QA checklist G1 done (five shipped files verbatim), G2 done (tsc exit 0, no ts-ignore, no any, strictness untouched), G3 done (no phase writes; src/state untouched), G4 done (MatchArt spells SceneAsset and SceneLayer as quoted; a first draft used SceneWorld indexed types, fixed in f80aac3 before this hand-back), G5 done (do-not-touch paths absent), G6 done (only the nine listed product files; this hand-back folder is the required delivery, not a product file), G7 done (274, each file inside its cap), G8 done (deps 112/357, check:state and check:law exit 0), G9 done (decisions below), G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- MATCH is 1024 units, a patch of at most 16, and a board of 3 by 2. Check order: a bad row (invalidValue units[i], and that row does not claim the id), a repeated id, off the map, then the sprite. The first row that passes the shape check claims the id even if it is later skipped. unknownRef is once per unitId, on the first such row. One overCap snapshot.units is the last note. Only the first 1024 rows are read.
- Absent facing and offset, and an explicit null, are null with no note. A bad facing, or an offset that is not two finite numbers, is null with invalidValue, and the unit stays. A bad facing does not clear a good offset. {dx:0,dy:0} is move. A null offset is absent, not bad.
- at and offset are fresh objects, and -0 is kept. assets, layers, objects, style and waterTiles are shared. Missing objects, and null, use one module empty list. overlays is always one shared empty list. No effects key and no rev key. style and waterTiles are omitted when undefined.
- The match link keeps one entry. The same snap and art objects return the same world. Anything else rebuilds, and rev is the build count, starting at 1. notes are the last build. An in-place snapshot edit is not seen. A new link starts again at 1.
- The scene link keeps one unit-key memo. It hits only when rev is that finite number and the units array, assets, cols, rows, tileW, tileH and mapSeed are the same. A non-finite rev drops it. A new finite rev, including the first after none, bumps the effects revision once. The same rev does not. The effects-identity check still runs. unitKey is unchanged.
- matchPatch is null for an unknown caster, or when !(cols >= 1) or !(rows >= 1), so NaN, 0 and 0.5 are null. Map size is Math.floor. A non-finite window is the 3 by 2 board, then clamped to 1..16 and to the map. Both fit only when |Δc| < cols and |Δr| < rows. Origin is lo − floor((n − span) / 2), then clamped. The world is not cropped.
- nearestFoe uses |Δc| + |Δr|. A tie takes the lower id, by string <. foes is required; a non-array is null and does not throw. The caster's own side never counts. Only the first 1024 rows are read. A dead caster with a good cell and a string side is still the origin. A bad cell or a non-string side on the first row with that id is null and does not look further.
- No extra product file, no signature change, no new dependency. The five pins are unchanged. Deps are 112 modules / 357 deps. At most 1024 units and 2 × 1024 + 2 notes per build. The one match entry and the one scene memo do not grow with frames or edits.

## Next step (optional proposal)
- E6 can point the camera at matchPatch. E4 still carries the Travel beat and the E1 and E2 items this step leaves open. Not a change here.
