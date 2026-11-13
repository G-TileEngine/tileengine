# step-31-light-glow: light and glow (renderer plan slice 31, `docs/research/renderer-research.md` §9 and §11 row 31; CEO-approved 2026-11-13 00:42). Two new pure files in the render core. `src/runtime/render/visibility.ts` is a reusable line-of-sight helper (recursive shadowcasting on the cell grid; torchlight now, fog of war later). `src/runtime/render/light.ts` turns lights, blockers, the night wash and stage dim into one stepped **light plan**, then into device-px fill ops: a darkness overlay capped at 0.72, six quantised light bands masked by line of sight, and a stepped warm glow. No blur, no tint mode, no game rules. Moonlit is a sheet swap plus the night wash. Also in this step: QA's step 30 must-fix **R2-N1** (a non-array `ms` warns `clipMsInvalid` instead of throwing), and pins for **Q26**, **Q33** and **Q28** (all three already behave in `d0a21b1`). A test-only scene fence holds the line until the next pin CN.

Step id: step-31-light-glow          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: `d0a21b1` (main, the step 30 merge: PR #38, chatB2 code `7871813` plus QA's test-only fix `b9f9cba`, tip `ad1ef53`, tree `dd699b72`; verified PASS 563/0, `/workspace/scratch-ea/s30-verify-report.txt` sha256 `00ce20ea…`). Branch: `step/step-31-light-glow-r<N>`, created from `d0a21b1`. The PR targets `main`. Never commit to `main`.
The diff is always `d0a21b1..<head>`.
Delivery (CN-003): `git bundle create step-31-light-glow-r<N>.bundle d0a21b1..step/step-31-light-glow-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HAND-BACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. If a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-31-light-glow/r<N>/` (HAND-BACK.md), committed as the branch's last commit. Quote this step file's sha256 prefix in HAND-BACK.md (QA s30 note: quote the kit sha, not a stale one).
Depends on: step 30 (Base; `src/runtime/scene/world-scene.ts`, `badMs`, `clipMs`), step 28 (`canvas2d` `fillRect`), step 27 (`src/runtime/render/**`: `Fit`, `Cam`, `RenderScene`, `Sheet`), `docs/research/renderer-research.md` §9 (the light model) and §10 (the palette exemption).
Read first: `docs/research/renderer-research.md` §9–§11, `docs/qa/step-30-ab.md` (R2-N1, Q26, Q28, Q33, G4/G6/G7, N-3, N-8; **note:** the file sits in the kit, not in the `d0a21b1` tree), `handoff/steps/step-30-world-link.md` (Carries → Step 31), `src/runtime/render/frames.ts`, `src/runtime/render/types.ts`, `/workspace/share/renderer-refs/spritecook-blog-readthrough.md` (ideas 1 and 6; ideas only, no code).

Kit: kit-2, 2026-11-13 (QA r2 NOT OK, `docs/qa/step-31-review.md`; QA's qfix `da9aa262` folded in). Engine Architect. Prototyped and run on Node 24.22.1: branch `r31`, head `4bb8bb3` (tree `593f1b0a`): r1 `c687868`, r2 `223ffbf` (DSK r30: `ms: null` reads as absent), r3 `4bb8bb3` (QA qfix: F-1, F-2, N-2, F-3 tests), on `d0a21b1`. `npm ci && npm run green` exits 0 with `tests 573 pass 573 fail 0`. Sim and all 20 smoke lines are unchanged. 41/41 EA plants are caught. Bundle copy: `/workspace/scratch-ea/r31-r3.bundle` (`d0a21b1..r31`, sha256 `559d30bf…`).
Carries: **no CN in this step.** No new format field, no dependency, no `tsconfig` change. core-types (`61fad786…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) are unchanged. `fullyDark` is a **runtime render field** on `Light`, not a format field. An authored light field needs a DSK CN, drafted below under Carries → DSK; do not invent it. R2-N1 follows DSK project-format **r30** (`788fecfa`): a present non-array `ms` is `clipMsInvalid` under r29, except `ms: null`, which reads as absent with no warning.

> Working style: use your helper agents, take your time, and self-review against Acceptance and the QA checklist before hand-back (see BUILD_GUIDE).

## Goal
At night, or when an ability dims the stage, the map darkens in fixed steps. Torches punch stepped pools of light that stop at walls, light the wall faces and leave shadows behind pillars. Light falls off in six bands with no blur. The brightest three bands glow warm. Moonlit is the paired night sheets plus the wash. All of this is pure data from the render core, cached so a still scene costs nothing. The host draws the ops after the world (host carry).

## Rulings
1. **One darkness overlay.** `darkness(wash, dim)` returns the total in 32nds: `aWash = 0.62 × wash`, `aDim = min(dim, 1 − (1 − 0.72)/(1 − aWash))`, total `floor((1 − (1 − aWash)(1 − aDim)) × 32)`. Wash and dim are clamped to 0..1, and the combined darkness never passes 0.72 (§9). Expected values: `darkness(0,0)` 0, `(1,0)` 19, `(1,1)` 23, `(0,1)` 23, `(0.5,0.25)` 15, `(−1,2)` 23 (clamped).
2. **Six stepped bands, no blur.** At a sample square of `res` art px whose centre is `d` from the light, level = `6 − floor(6d/radius)` for `d < radius` when the cell is visible, else 0. Overlapping lights take the max. Darkness per square = `round(total × (6 − level)/6)`.
3. **Line of sight.** A light reads `createSight().mask(world, cell, ceil(radius/min(tileW, tileH)) + 1)`, the +1 so a light off a cell centre is not clipped on one side. Walls stop light. Wall cells in view are lit (their faces). A light inside a wall moves to the first open neighbour (N, E, S, W, then diagonals). An empty shadow window stops casting (`start <= end`), so light never slips through a corner where two walls touch diagonally (QA F-1; a one-cell bleed beside the wall remains, see the symmetric carry). Masks are cached per **blockers identity** and (cell, radius, map width), at most **256 entries** (cleared when full; QA F-2, N-2), so they are recomputed only when a light changes cell or the blockers array changes. A host that edits blockers must pass a new array (host carry).
4. **Stage dim.** While `dim > 0`, a light keeps **half its radius** by default. A light with `fullyDark: true` goes out. With `dim` 0 it shines at full radius whatever `fullyDark` says.
5. **Stepped glow.** Levels 4, 5 and 6 add a fill `rgba(255,176,72, k/32)` with k = 2, 4, 6. Every alpha `lightOps` emits is a whole 32nd: these are the named wash/dim/glow ops of the §10 palette exemption. Glow is a normal-blend fill because `Renderer.fillRect` has no blend op. Additive (`lighter`) glow is a backend carry.
6. **Ops.** `lightOps(plan, fit, cam)` emits device-px fills for the squares in view only (culled, with one square of slack at the right and bottom), merging equal neighbours along a row. Darkness runs come first, then glow runs. A 20×20-cell map at res 4 with two torches, seen through a 160×96 view, fits the ≤300-draws budget.
7. **Plans are cached.** `createLighting().plan` returns the same plan object while world, lights (by identity), wash, dim and res are unchanged, so the host can use plan identity as its rev.
8. **Moonlit, no tint.** `createMoonlit()(scene, swap)` swaps sheet ids through a `Map<dayId, nightId>` in ground, above, standing and overlays. Unswapped sheets keep their object identity. The result is stable per (scene, swap). There is no tint mode and no export named tint.
9. **R2-N1 (QA must-fix; DSK r30).** `badMs` takes `unknown`. `ms` undefined or `null` is absent: no warning, play by `fps` (or 8). A present `ms` that is not an array (a string, an object with a length, a number) is invalid: the clip plays by `fps` (or 8), and `clipMsInvalid` is warned once per clip through the link's existing r29 path. The stored clip is never rewritten. `clipMs` gates on `Array.isArray(clip.ms)`. In `world-scene.ts` one line is rewritten in place: the length/fps check gates on `Array.isArray(clip.ms)` instead of `clip.ms !== undefined`, so `ms: null` neither crashes nor warns.
10. **Q26, Q28, Q33** already behave in `d0a21b1`. This step pins them: the walking-unit seed key is `${sheet.id}#${key}` (Q26, new test). Offset `dy` is scaled by `tileH` (Q28, already pinned by `b9f9cba`). `start()` after `dispose()` queues nothing (Q33, one new line in the step 30 carries test).
11. **Scene fence.** `src/runtime/scene/` holds only `world-scene.ts`. It imports only `../render/index.ts` and `../../core/notice.ts`, and uses no game word (hp, mana, cost, deck, damage, cards, phase), DOM name or wall time. A test enforces this until the next pin CN adds depcruise and check-law rules (draft below).

## Files to create or change
- create `src/runtime/render/visibility.ts` (≤ 58)
- create `src/runtime/render/light.ts` (≤ 80)
- change `src/runtime/render/frames.ts` (≤ 50; `badMs(unknown)` and the `Array.isArray` gate only; two lines changed, no growth)
- change `src/runtime/render/index.ts` (≤ 13; **cap re-based** from 11: two export lines, for visibility and light)
- change `tests/runtime/host/raf-driver.test.ts` (≤ 157; cap unchanged; one Q33 line in the step 30 carries test)
- create `tests/runtime/render/light.test.ts` (≤ 73)
- create `tests/runtime/scene/scene-fence.test.ts` (≤ 17)

Nothing else changes. In particular `types.ts`, `draw-list.ts`, `canvas2d.ts` and `raf-driver.ts` stay as they are.

Size: 150–400 changed lines, counting insertions plus deletions (handback excluded). The prototype changes 225 lines (+222/−3) in 8 files:

| File | Base → proto / cap |
|---|---|
| `visibility.ts` | new → 54/58 |
| `light.ts` | new → 76/80 |
| `frames.ts` | 46 → 46/50 |
| `index.ts` (render) | 7 → 9/13 (re-based) |
| `raf-driver.test.ts` | 152 → 153/157 |
| `light.test.ts` | new → 72/74 (cap kept from kit-1) |
| `world-scene.ts` | 88 → 88/88 (one line rewritten in place; step 30 cap kept, no growth allowed) |
| `scene-fence.test.ts` | new → 13/17 |

Caps are the proto + 4. `frames.ts` and `raf-driver.test.ts` keep their step 30 caps. `index.ts` is re-based for the two export lines. If the work does not fit, stop and ask.

## Interfaces to match (quoted exactly)
```ts
// src/runtime/render/visibility.ts
export type Blockers = { readonly cols: number; readonly rows: number; readonly blocks: ArrayLike<number | boolean> };
export function openCell(g: Blockers, c: number, r: number): { c: number; r: number } | null;
export function visibleCells(g: Blockers, c: number, r: number, radius: number): Uint8Array;
export function createSight(): { mask(g: Blockers, c: number, r: number, radius: number): Uint8Array; readonly stats: { computed: number } };
// src/runtime/render/light.ts
export type Light = { readonly x: number; readonly y: number; readonly radius: number; readonly fullyDark?: boolean };
export type LightWorld = Blockers & { readonly tileW: number; readonly tileH: number };
export type LightPlan = { readonly res: number; readonly w: number; readonly h: number; readonly dark: Uint8Array; readonly level: Uint8Array };
export type FillOp = { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly colour: string };
export const BANDS_OF_LIGHT = 6, WASH_MAX = 0.62, DARK_CAP = 0.72, STEPS = 32;
export function darkness(wash: number, dim: number): number;
export function createLighting(): { plan(world: LightWorld, lights: readonly Light[], wash: number, dim: number, res: number): LightPlan; readonly stats: { plans: number; masks: { computed: number } } };
export function lightOps(plan: LightPlan, fit: Fit, cam: Cam, glow?: string): FillOp[];   // glow defaults to "255,176,72"
export function createMoonlit(): (scene: RenderScene, swap: ReadonlyMap<string, string>) => RenderScene;
// src/runtime/render/frames.ts (changed signature)
export const badMs = (ms: unknown): boolean => …;
// src/runtime/render/index.ts (added)
export { openCell, visibleCells, createSight, type Blockers } from "./visibility.ts";
export { BANDS_OF_LIGHT, DARK_CAP, STEPS, WASH_MAX, createLighting, createMoonlit, darkness, lightOps, type FillOp, type Light, type LightPlan, type LightWorld } from "./light.ts";
```
`dark` is in 32nds (0..23). `level` is 0..6. Lights and plans are in art px; ops are in device px (`x·res·s − cam.devX + fit.padX`).

## Smoke lines
None move. `npm run sim` prints exactly the base's two lines (`stage-fixed seeds 1-50: win 48 lose 2 … afc89d56…` and `stage-weighted seeds 1-50: win 22 lose 28 … b8007292…`). All 20 smoke lines are byte-identical to `d0a21b1`.

## Existing tests changed by ruling (and only these)
- `tests/runtime/host/raf-driver.test.ts`, "step 30 driver and clock carries…": one appended line, `const gone = rig(); gone.driver.dispose(); gone.driver.start(); gone.show(); assert.equal(gone.queued(), 0);` (Q33).
Nothing else changes. The world-scene, render-core and canvas2d tests are untouched.

## Tests that prove it is done
New `tests/runtime/render/light.test.ts`: nine tests whose titles start exactly as below. New `tests/runtime/scene/scene-fence.test.ts`: one test. Plus the Q33 line above. Fixture: `grid(cols, rows, walls)` and `world(cols = 10, rows = 10, walls)`, a map of 16-px tiles (plans at res 8 are 20 squares wide); `row(arr, w, y)` and `lit(plan)` helpers.

- **"line of sight: shadowcasting stops at walls, lights the wall faces, shadows behind a pillar and moves a torch out of a wall (step 31)":** a wall column at c 5 seen from (2,4): row 4 is `[1,1,1,1,1,1,0,0,0]` and nothing past the wall is seen. Radius 3 on an open 9×9 grid sees exactly 29 cells (Euclidean). A pillar at (4,4) shadows row 4 from c 5 on, while (6,3) stays visible. `openCell` moves (1,1) to (2,1) and returns null when walled in. A torch inside a wall still lights its neighbours.
- **"masks and plans are cached: recomputed only when the light changes cell, the blockers change, or a light, wash or dim input changes (step 31)":** the same mask twice computes once. A new cell or a new blockers array recomputes. The same plan inputs return the same plan object. A moved light inside the same cell reuses its mask. Changes in dim, wash, res or blockers each give a new plan, counted exactly.
- **"six-step falloff: rings 6 down to 1 from the light, 0 past the radius and 0 behind a wall (step 31)":** radius 48 at (80,80), res 8. Middle row levels `[0,0,0,0,1,2,3,4,5,6,6,5,4,3,2,1,0,0,0,0]`, darkness `[19,19,19,19,16,13,10,6,3,0,0,3,6,10,13,16,19,19,19,19]`. All seven levels occur. Behind a wall column: level 0 and full darkness.
- **"darkness: the night wash and stage dim share one overlay capped at 0.72, and every alpha the light ops use is a whole 32nd (step 31)":** the six values in Ruling 1. At wash 1, dim 0.5, res 4, every op alpha × 32 is a whole number in 1..23.
- **"stage dim: a torch keeps a half-size glow by default; a fullyDark light goes fully dark (step 31)":** radius 64 at res 8 reaches 8 squares at night and 4 in dim, and dim lights under a third of the squares. In dim a `fullyDark` torch leaves its square at `darkness(1, 0.5)` while a second, normal light still shines. `fullyDark` with dim 0 lights exactly as many squares as without it.
- **"stepped glow and runs: fills merge equal runs, stay inside the view, glow only on levels 4 to 6, and fit the draw budget (step 31)":** two torches on a 20×20 map at res 4, a 160×96 view at camera (16,8): 20 < ops ≤ 300. Every op overlaps the view (4 px slack). No run is followed by an abutting run of the same colour on its row. Glow alphas are exactly 0.0625, 0.125 and 0.1875.
- **"moonlit swaps in the paired night sheets, keeps the scene stable, and has no tint mode (step 31)":** ground and standing swap, above keeps its sheet object, the same inputs return the same scene, a new swap map gives a new scene, and no render export matches /tint/i.
- **"R2-N1: a non-array ms plays by fps (or 8) and warns clipMsInvalid once per clip, never rewritten (step 31)":** for `"100"`, null, `{length: 2}` and 5: `[250,250]` at 4 fps, `[130]` without. Through `createSceneLink`, two assets records give exactly `["clipMsInvalid"]`, and the stored `ms` is still `"100"`.
- **"Q26: the walking-unit seed keeps the sheet id, so two sprites with one key do not animate in lockstep (step 31)":** two 8-frame walking units with key `u` on sheets `h` and `k` show different frame sequences through `buildDrawList`.
- `scene-fence.test.ts`: **"the scene folder imports only the render index and the notice type, and uses no game words, DOM names or wall time (step 31)":** strings and comments are stripped before the word check. It self-checks that a state import, a host import, `export const hp` and a sim import each fail.

## How a planted bug is caught (for QA; prototype `4bb8bb3`; each plant reverted after its run; `/workspace/scratch-ea/s31-plants-r3.py <clone>` (V7 re-pointed to the new key); result `/workspace/scratch-ea/s31-plants-result.txt`; **expected 41/41**)
| # | Plant | Caught by |
|---|---|---|
| V1 | walls do not block light | line of sight |
| V2 | wall faces stay dark | line of sight |
| V3 | square radius instead of Euclidean | line of sight |
| V4 | a torch in a wall is not moved out | line of sight |
| V5 | only four octants cast | line of sight |
| V6 | the mask cache ignores blockers identity | masks and plans are cached |
| V7 | the mask cache key ignores the cell (key now includes the map width) | masks and plans are cached |
| V8 | no mask cache | masks and plans are cached |
| L1 | plan memo off | masks and plans are cached |
| L2 | plan memo ignores dim | masks and plans are cached |
| L3 | plan memo ignores the lights | masks and plans are cached |
| L4 | plan memo ignores the world | masks and plans are cached |
| L5 | falloff not quantised | six-step falloff |
| L6 | five bands | six-step falloff |
| L7 | the sight mask is ignored | six-step falloff |
| L8 | light does not lower darkness | six-step falloff |
| L9 | no dim cap | darkness |
| L10 | wash not scaled by 0.62 | darkness |
| L11 | darkness alpha off the 32nd steps | darkness |
| L12 | dim keeps the full radius | stage dim |
| L13 | fullyDark ignored in dim | stage dim |
| L14 | fullyDark goes dark by day too | stage dim |
| L15 | glow on every level | stepped glow and runs |
| L16 | runs not merged | stepped glow and runs |
| L17 | fills not culled to the view (top) | stepped glow and runs |
| L18 | moonlit not stable | moonlit swaps |
| L19 | moonlit ignores the swap identity | moonlit swaps |
| L20 | moonlit misses standing sprites | moonlit swaps |
| L21 | moonlit misses ground | moonlit swaps |
| L22 | moonlit copies unswapped sheets | moonlit swaps |
| L23 | a `tint` export in the render index | moonlit swaps |
| N1a | `badMs` without `Array.isArray` (non-array throws) | R2-N1 |
| N1b | `clipMs` gate without `Array.isArray` | R2-N1 |
| Q26 | seed key drops the sheet id | Q26 |
| Q33 | `start()` after `dispose()` restarts the loop | step 30 driver and clock carries |
| G4 | scene imports state | the scene folder |
| G6 | scene imports the host driver | the scene folder |
| G7 | `export const hp` in the scene | the scene folder |
| G8 | scene imports `../render/camera.ts` (bypasses the index) | the scene folder |
| G9 | `Date.now()` in the scene | the scene folder |
| G10 | a second file in the scene folder | the scene folder |

## Example
A 10×10 dungeon of 16-px tiles at night (`wash` 1) with a torch at (80,80), radius 48, res 8. Squares far from the torch carry darkness 19/32. The rings toward the torch step 16, 13, 10, 6, 3, then 0 at the flame. Three warm glow rings (2/32, 4/32, 6/32) sit on the inner bands. A wall column east of the torch is lit on its face and leaves everything behind it at 19/32. When an ability dims the stage (`dim` 1), the total rises to 23/32 (the cap) and the torch shrinks to radius 24. A `fullyDark` light goes out.

## Decisions note: what to name
`BANDS_OF_LIGHT` (not `BANDS`, which step 27 already uses for draw bands), `darkness`, `createLighting`, `lightOps`, `createSight`, `visibleCells`, `openCell`, `createMoonlit`, `fullyDark` (CEO's word). Keep these names. Notice codes are unchanged; R2-N1 reuses `clipMsInvalid`.

## Do not touch
`locked/`; `src/types/core-types.ts`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/project-format.md`; `src/runtime/scene/world-scene.ts` (except the one R2-N1 line); `src/runtime/render/types.ts`; `src/runtime/canvas/**`; `src/runtime/host/raf-driver.ts`; `src/core/**`; the sim; the existing tests other than the one Q33 line.

## Acceptance
`npm ci && npm run green` exits 0 with at least 573 tests passing and none failing. Sims and all 20 smoke lines are unchanged. Every pin above is unchanged. Each file stays within its cap and the total is 150–400 changed lines. The nine light tests, the scene fence test and the Q33 line pass with the exact titles. Render-core purity holds: flat `.ts` files, `./x.ts` imports only, no DOM, Date, performance or globals. QA's plants (the table) are caught.

## Not in this step (deferred; flagged, do not invent). Carries, with their target
**Host shell / backend (s32–s33):** draw `lightOps` after the world `present`, keyed on plan identity (rev). Add a `lighter` blend op for glow fills (step 28 has `lighter` for overlays, not for `fillRect`). Emissive punches (eyes, lava) and lit units. A blockers array replaced on every wall edit (Ruling 3).
**WebGL (later):** SpriteCook idea 6 normals (outline-as-height) are **parked**. Baked light-direction shades are a carry for the art side.
**Line of sight:** a symmetric shadowcasting variant (Albert Ford) for fog of war and enemy sight; fog of war reuses `createSight`. Today about 24% of visible pairs are one-way (QA N-1) and a one-cell bleed sits beside diagonal walls; fine for torches, not for fog of war.
**Steps 32/33 (backend):** draw the night light fills to one offscreen canvas and blit it once (QA N-3: 496 fills at 844×390 with 4 torches, over the 300 budget). A NaN wash should also drop the glow (QA N-4).
**Host:** pass stable lights/world objects so the plan is not rebuilt every frame (QA N-5, ~1 ms); a blockers edit must be a new array (QA N-6).
**Step 34 (perf):** step-30 N-3 (the chunk signature ignores tile size), N-8 (a walking unit re-checks every chunk), the `Clock.skip` bound, stopping rAF when idle, a host rev number instead of the units key string, and the light plan's full-map cost per plan (a dirty-rect plan if it shows in profiles).
**CN-010 (filed: `handoff/change-notices/CN-010-light-format.md`; ACCEPTED in project-format r31 `82345d47` / setup-format r22 `0081144a`; format only, no pin moves; not read in this step):** authored light, render-only, no core-types change. Sprite and image AssetMeta carry `lightSource { radius: int ≥ 1 art px, colour?: "#rrggbb" (default "#ffb048") }`; tilesets carry it per tile as `tileProps[i].lightSource`; a placement may override with `objects[].lightSource` (replaced whole, `null` = no light). Stage dim is an effect dim step, so the dim step gets `dim_lights: "half" | "dark"` (default `"half"`) — the CEO's per-ability fully-dark choice. `fullyDark` stays runtime-only on `Light` (the host sets it from `dim_lights`). Moonlit: the day asset carries `nightVariant: assetId`; a mismatch, missing target, chain or cycle warns `nightVariantMismatch` and draws the day asset. Invalid light warns `lightInvalid` once per asset, no light, never rewritten. The host loader that reads these lands with the host shell.
**Next pin CN (draft, not filed):**
> CN-011 (draft, EA → CoS/QA): scene fence pins. Add to `.dependency-cruiser.cjs`: `src/runtime/scene/**` may import only `src/runtime/render/index.ts` and `src/core/notice.ts` (forbid `src/state/**`, `src/runtime/host/**`, `src/sim/**`, and the render internals). Add to `scripts/check-law.sh`: the core game-word ban (hp, mana, cost, deck, damage, cards, phase) also covers `src/runtime/scene/`. New pins: the depcruise and check-law sha256s after the edit. Until then, `tests/runtime/scene/scene-fence.test.ts` enforces the same rules (plants G4–G10). The test is text-level and misses dynamic `import()` and `require` (QA N-7); the depcruise rule and the AST-level fence close that.

## Out of scope
Game rules (who casts dim, which tiles block). Format changes. Blend modes in the backend. Shaders. Fog of war. Animated light flicker.

## Open questions (EA → CoS/QA/DSK)
1. Light resolution: is `res` 8 (half a 16-px tile) right as the default, or per tile?
2. Glow is a normal blend today. Should step 32 move it to additive `lighter`?
3. The +1 cell on the mask radius: accept, or clip the light disc to the mask radius exactly?
4. Darkness rounding: `round` per band gives 16/13/10/6/3. Any palette objection?
5. Moonlit swap source: answered by DSK r30 — a `nightVariant` link on the day asset, not a naming rule.
6. `docs/qa/step-30-ab.md` lands with the step 31 kit push (QA: final).
7. Q28 and Q33 already behave in `d0a21b1`; step 31 only pins them. QA, please confirm that is enough.
