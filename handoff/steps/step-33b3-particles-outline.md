# step-33b3-particles-outline: particles, pixel size, outline, RotSprite, draw budgets and the hit-white recolour (renderer plan slice 33, part 33b-3; CN-015, CN-017, CN-018; seams 3, 16, 18, 19, 23)

Step id: step-33b3-particles-outline          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`d5b36b5f`** (main after PR #45, the step 33b-2 merge: chatB2 plus QA fix2 and fix3; tree `6ebeecdb`; verified 660/0). Branch: `step/step-33b3-particles-outline-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-33b3-particles-outline-r<N>.bundle d5b36b5f..step/step-33b3-particles-outline-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-33b3-particles-outline/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: step 33b-2, merged `d5b36b5f` (`fx-light.ts` `rampOf`, `snapToRamp`, `hitWhiteMode`, `brightPixels`; `fx-live.ts` lit steps and the self-lit marks; `draw-list.ts` `DrawCmd.selfLit`; the 16 MB is shared with step 32's light canvases in `canvas2d.ts`); step 33b-1 (`world-scene.ts` `applyFeel`, `hitOf`, `squashed`, the generated-id pattern `~sq`); step 33a (`fx-player.ts` `FxPiece`, `placeStep`). Formats: **CN-015** (`324b4eeb…`): `pixel_scale`, `outline`, rule N, rotation buckets; **CN-017** (`c0b30fc6…`, final): the `particles` fields; **CN-018** (`1cbbaa08…`, ACCEPTED, lands with this step): `data/staging/core-types.cnE.ts` **`d6d08696`** (shipped with this kit) replaces `src/types/core-types.ts` (+69 content lines (+87 with blank lines), add-only on `61fad786`), so the core-types pin moves to `d6d08696`.
Read first: BUILD_GUIDE.md §0, §3 (runtime import lines), §7, law 13; CN-017 and CN-018; `data/setup-format.md` §2.10.2.7 (hit-white: `hit_white_ms` 0 or 40–200, `hit_white_target`, `hit_white_mode`; tint uses `impact_colour`); `ux/effects-sprite-sync.md` §§ "Rotating pixel art", draws (≤ 60 / 120 / 300), answer 8 (rotation cache: RotSprite-style at art res, nearest in lite, 16 MB LRU shared with the light canvases); `/workspace/scratch-ea/s33b-split-proposal.md` (`f56060dc…`, the 33b-3 row); `/workspace/scratch-ea/integration-seams.md` (`00efc6af…`) seams 3, 16, 18, 19, 23 (built here) and 24–30 (carries, see Not in this step).
Kit: kit-1 r2 (guide-3), 2026-11-14. Engine Architect. r2 folds in QA's r1 review (`docs/qa/step-33b3-review.md` `d957f474`): QA's G1 test `fx-particles-qa.test.ts` (G6 granted, cap 37) is shipped, the CN-018 staging file is shipped with the kit, sizes count + and −, and rulings (a)–(c) are written in. Prototyped on Node 24: branch `r33b3` on `d5b36b5f`: CN-018 commit `49cb8b3` (core-types `d6d08696` and the smoke pin), EA proto r1 `83f221bb` (tree `6aa6abde`), then QA's qfix2, **proto r2 `9934dc444379650f5331e68fe3afbc4c2b179420`** (tree `f8fa347b`; src unchanged from r1, adds only the QA test). `npm ci && npm run green` exits 0 with `tests 672 pass 672 fail 0` (660 + 12); `tsc` 0; lint, deps, check:state and check:law pass. Sims unchanged (stage-fixed 48/2 `afc89d56…`, stage-weighted 22/28 `b8007292…`); the 21 smoke lines match the Base (the heap line is report-only). `node tests/perf/fx-particles-budget.ts`, run alone: every lap's p95 ≤ 4 ms (0.83 / 0.41 / 0.37 ms, counts 131/36/93/1); the 33b-2 `fx-light-budget.ts` still passes (0.88 / 0.46 / 0.63 ms). Plants: `/workspace/scratch-ea/s33b3-plants.py` **84/84 caught; 83/84 catching tests fail on the Base** (R1, the type-only core-types guard, is caught by the purity test, which passes on the Base by design); QA's `qa-plants.py` (`9671d303`) **25/26 caught** (only Q12 missed; see Plants). Bundle copy `/workspace/scratch-ea/r33b3-r2.bundle` (`d5b36b5f..r33b3`, verified); patch `/workspace/scratch-ea/r33b3-r2.patch`; kit sha list `/workspace/scratch-ea/kit-backup-r33b3/r2-kit-sha256.txt`.
Carries: **CN-018** (the core-types swap, +69 content lines (+87 with blank lines), add-only; `data/staging/core-types.cnE.ts` `d6d08696…` is pushed with this kit; counted outside this step's size). `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) unchanged.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
After this step effects can throw particles: up to 48 per effect, in one on-screen pool of 96, moving by a seeded clock (burst, attract, spiral-in, rise), shrinking 3 → 2 → 1 art px, stepping down their ramp and fading only at the end, drawn as batched rects. Pieces can be drawn at an integer pixel size, outlined in their ramp's darkest step, turned by a RotSprite-style pass into 16 cached angle buckets (8, nearest, in lite), and recoloured by the hit-white flash on the hit unit or the stamp steps. Every generated bake lives in one 16 MB LRU shared with the light canvases, and the draw budgets (60 per effect, 120 for all effects, 300 a frame) hold.

## Rulings
All rulings are EA (this kit) on the CEO's renderer answers, CN-015, CN-017, CN-018 and the user's 33b-3 brief (2026-11-14 19:48 London) unless a source is named. Every one is pinned.
1. **CN-018 core-types** (DSK; user brief): copy the kit's `data/staging/core-types.cnE.ts` (on `origin/main` once this kit is pushed) over `src/types/core-types.ts` byte for byte (`cp data/staging/core-types.cnE.ts src/types/core-types.ts`), then check `sha256sum src/types/core-types.ts` gives `d6d0869644f3c9876aa1101d8a7248f8b5a18b3beabcb0b191c9c42fec88a366` (+69 content lines (+87 with blank lines), add-only); `tests/smoke.test.ts` pins `d6d0869644f3…`. The render core imports `ParticleMotion`, `FxParticleStepFields`, `Blend`, `HitWhiteMode` and `FxLightMode` from it **as type-only imports** and redefines none (`fx-light.ts` re-exports `HitWhiteMode`, `LightMode = FxLightMode`). The render purity test allows exactly `import type { … } from "../../types/core-types.ts";`. Pinned by: "smoke: core-types.ts is the pinned DSK copy" and "the render core stays pure: … (step 27)".
2. **Particle fields** (CN-017): `particleRead(step)`: `particle_motion` burst | attract | spiral-in | rise, absent burst, anything else burst + `outOfRange` (`particle_motion`); `particle_count` int 0–48, default 12; `particle_life_ms` 200–3000, default 800, the draft `particle_life` an alias (`_ms` wins); `particle_pull` per-mille 0–2000, default 1000. Out of range clamps and flags `outOfRange` with the field name (`particle_life_ms` for either spelling); not a number plays as the default, flagged. Pinned by: "particles format: …(step 33b-3, CN-017)".
3. **The 48 sum** (CN-017 rule 2): `capCounts(counts)` cuts later `particles` steps in step order until the effect's sum is 48; `fxParticlesOverCap` fires once per effect (the link dedupes) with message `JSON.stringify({ count, limit: 48 })`, `count` the pre-cut sum. A single step over 48 is clamped first (Ruling 2). Pinned by: "particles format: …" and "live particles: …".
4. **Motion** (CN-017; plan row): clock-based and seeded by `hash32(mapSeed, effect id, step index)` (a visual stream, never the game RNG); age = the effect's draw time (so hit-stop freezes it) − step start; positions in 1/256 fixed point, floored to art px (`>> 8`). Reach 8–24 art px per particle. burst eases out from the emitter; rise drifts up; attract and spiral-in start at the reach and close at `pull` per-mille of the life (2000 = at the emitter by half life); spiral-in also turns one circle; burst and rise never read `pull`. A particle shows only while age < life and its step plays. Pinned by: "particle motion: …(step 33b-3, CN-017)".
5. **Size, colour and fade** (plan row): size 3 → 2 → 1 over thirds of the life (× `pixel_scale`); colour starts at the lightest step of the step's `tint_ramp`, else the effect's (`rampOf`), and steps down it; with no ramp it is `#ffb048`. Only the last 2 steps fade (alpha 0.5, then 0.25), on ramps of 3 or more steps. `reduce_motion` (`LiveGrid.reduce`) shows two stills: the start for the first half of the life, the end for the second. Pinned by: "particle motion: …".
6. **Pool and budgets** (plan row; UX "≤ 60 draws each, ≤ 120 in total, 300 a frame"): one pool of 96 (`PARTICLES.pool`, runtime only); when more are live the oldest-born go first (ties: the earlier effect). Pieces count first: a piece over 60 for its effect or 120 in total is not drawn; then each particle is one draw against the same 60/120. The draw list cuts the newest particle rects until the frame (image commands + rects) is ≤ 300 (`FX_BUDGET`). **(a)** A piece cut by the 60/120 budget still gives its light: lights have their own cap of 2 per effect (33b-2), so the budget cuts only draws (current behaviour). Pinned by: "live particles: …", "draw list: …" and QA's "QA 33b-3: pool ties drop the earlier effect; …".
7. **Batched rects and the fxGround sub-order** (plan row; seams 3, 23): a particle is a `SceneDot` in its step's band (`fxGround` / `fxAir` / `flash`; unit-layer steps draw in `fxAir`). The draw list draws each band's dots right after that band's pieces as **one `DrawCmd` per colour** (`rects` = x, y, w, h device px; `colour`, `rgba(…)` when faded). So `fxGround` draws shore, pieces, then particles (`FX_GROUND_ORDER`), all before the standing pass. `fxGround` rects take the night; others are self-lit. `present` calls `renderer.fillRects` once per command when it exists, else `fillRect` per rect; Canvas2D fills one path per command. Chunked lists draw them once. Pinned by: "draw list: …(step 33b-3, seam 3)" and QA's "QA 33b-3: pool ties drop the earlier effect; …".
8. **`pixel_scale`** (CN-015 rule N): an int 1–6 draws every piece and particle k art px per art px, the piece growing around its anchor point (`Overlay.scale`, `Standing.scale`). `"match-sprite"` and absent draw at 1: the runtime's art pixel is the sprite's, and no wanted size reaches `FxPiece`, so today's k rule is 1. Anything else clamps to 1–6 with `outOfRange` (`pixel_scale`). **(b)** A non-integer rounds to the nearest int (2.5 draws at 3) and is flagged `outOfRange` (current behaviour). Pinned by: "pixel_scale: …".
9. **`outline`** (CN-015): `"auto"` outlines a piece whose frame is over 6 px on a side; `"on"` any size; `"off"`/absent never (rule N). Additive pieces (`blend: "add"`, which now draw with `op: "add"`) and particles never outline. The outline is a 1 px 4-neighbour ring in the darkest step of the step's ramp, else the effect's, else `#000000`, baked once (size +2, drawn 1 px up-left). Pinned by: "outline: …".
10. **Hit-white recolour** (setup-format §2.10.2.7; seam 19; CN-015 `bright`): `hitWhiteMs`: 0 or absent is off, else 40–200 (clamped, `outOfRange` `hit_white_ms`). **(c)** A negative `hit_white_ms` is off (not clamped to 40) and flagged `outOfRange` (current behaviour). From the hit (pose ≥ hit) for that long, `hit_white_target` `"target"` (absent, unknown) recolours the target unit, `"caster"` the caster, `"stamp"` every `kind: "stamp"` step drawing then. The mode (`hitWhiteMode`) recolours the sprite's own opaque pixels, alpha kept: white, black, bright (`brightPixels` with the style ramps) or tint = `impact_colour` (else `#ffb048`) through `snapToRamp` with the effect's `tint_ramp` (rgb when it has none). The unit look is decided in the scene link (`applyFeel`), not `LiveOut` (seam 18). A squashed unit keeps its squash. Pinned by: "hit-white: …(step 33b-3, seam 19, §2.10.2.7)" and QA's "QA 33b-3: a tint hit-white with no or a bad impact_colour paints #ffb048; …".
11. **RotSprite** (UX answer 8): `FxPiece.angle` (degrees, host-set) picks one of 16 buckets (`turnTag`; bucket 0 draws as-is); lite uses 8 buckets and plain nearest. A bucket is baked once at art res: Scale3x to 3×, rotate, then each output art pixel samples its centre, into a centred square of side ⌈hypot(w, h)⌉. So 90° is exact and every colour comes from the source (no blends, no mixels). Looks apply in order turn, hit-white, outline. Pinned by: "RotSprite: …".
12. **Looks are generated sheets** (33b-1's `~sq` pattern): `lookId(id, frame, fw, fh, look)` = `${id}~fx${frame}~${fw}x${fh}~${look}`, with tags joined by `|` (`r<k>`, `n<k>`, `hw:<arg>`, `ol#rrggbb`); the scene link's `pixels(id)` bakes it with `lookPixels` from the host's frames and the style ramps. Pinned by: "outline: …", "hit-white: …", "RotSprite: …".
13. **One 16 MB LRU** (UX answer 8; law 13): Canvas2D's generated bakes (looks, turns, squash, shore) and the light canvases share `LOOK.cacheBytes` = 16 MB. A cache hit moves the bake to the newest end; at frame end the least recently drawn bakes go until bakes + light canvases fit, never one drawn this frame (the 120-frame idle drop stays). Pinned by: "16 MB cache: …".
14. **Budget counts in the suite, wall clock alone** (33b-2 M-C (a)): the rig's counts are checked in `npm test`; the 4 ms p95 runs only in `node tests/perf/fx-particles-budget.ts`. Pinned by: "budget counts …(step 33b-3)".

## Files to create or change
- create `src/runtime/render/fx-particles.ts` (≤ 32; `PARTICLES`, `FX_BUDGET`, `FX_GROUND_ORDER`, `particleRead`, `capCounts`, `particleAt`)
- create `src/runtime/render/fx-look.ts` (≤ 55; `LOOK`, `lookSize`, `turnTag`, `lookId`, `recolour`, `lookPixels`; the outline, Scale3x and rotate bakes)
- create `tests/runtime/scene/fx-particles.test.ts` (≤ 145; shipped, verbatim)
- create `tests/perf/fx-particles-budget.ts` (≤ 31; shipped rig and serial perf script, verbatim)
- create `tests/runtime/scene/fx-particles-qa.test.ts` (≤ 37, G6 granted; QA's G1 test, shipped, verbatim)
- change `src/runtime/render/fx-live.ts` (≤ 122; particles, pool, budgets, looks, `pixel_scale`, stamp hit-white, `LiveOut.dots`, the `LiveFx` knobs)
- change `src/runtime/render/draw-list.ts` (≤ 94; looks and scale in `push`, per-band dots, the 300 cut)
- change `src/runtime/render/fx-light.ts` (≤ 58; `HIT_WHITE`, `hitWhiteMs`, `hitWhiteArg`; core-types types)
- change `src/runtime/render/types.ts` (≤ 41; `look`/`scale` on `Standing` and `Overlay`, `SceneDot`, `RenderScene.dots`, `DrawCmd.rects`/`colour`, `Renderer.fillRects?`)
- change `src/runtime/render/fx-player.ts` (≤ 111; `FxPiece` gains `kind`, `outline`, `blend`, `angle`, `particle_life` and `FxParticleStepFields`)
- change `src/runtime/render/index.ts` (≤ 24; exports), `dirty.ts` (≤ 25; rect commands), `chunk-plan.ts` (≤ 42; `dots: []` in the base and standing passes)
- change `src/runtime/scene/world-scene.ts` (≤ 126; unit hit-white looks, `lookPixels` in `pixels`, `dots` into the scene)
- change `src/runtime/canvas/canvas2d.ts` (≤ 155; the shared 16 MB LRU, `fillRects`)
- change `tests/runtime/render/render-core.test.ts` (≤ 130; Ruling 1) and, with CN-018, `src/types/core-types.ts` and `tests/smoke.test.ts`

Size (G7: insertions + deletions): EA's proto changes **396** lines (+345/−51) in 15 files; with QA's G1 test the step is **423** lines (+372/−51) in 16 files. **Written reason for the 400–500 band:** QA's G6 test (27 lines) and the serial perf script (27 lines) take it past 400; product code (the 12 `src/` files) stays under 400 (+175/−50 = 225). CN-018 (core-types +69 content lines (+87 with blank lines), add-only, the smoke pin +1/−1) is counted separately. Each file's cap is its proto count + 4 (QA's test: the G6 grant, 37).

| File | Base → proto / cap | Changes |
|---|---|---|
| `src/runtime/render/fx-look.ts` | 0 → 51/55 | +51 |
| `src/runtime/render/fx-particles.ts` | 0 → 28/32 | +28 |
| `src/runtime/render/fx-live.ts` | 100 → 118/122 | +28/−10 |
| `src/runtime/render/draw-list.ts` | 74 → 90/94 | +28/−12 |
| `src/runtime/render/fx-light.ts` | 49 → 54/58 | +7/−2 |
| `src/runtime/render/types.ts` | 34 → 37/41 | +7/−4 |
| `src/runtime/render/fx-player.ts` | 106 → 107/111 | +2/−1 |
| `src/runtime/render/index.ts` | 18 → 20/24 | +4/−2 |
| `src/runtime/render/dirty.ts` | 21 → 21/25 | +1/−1 |
| `src/runtime/render/chunk-plan.ts` | 38 → 38/42 | +2/−2 |
| `src/runtime/scene/world-scene.ts` | 122 → 122/126 | +9/−9 |
| `src/runtime/canvas/canvas2d.ts` | 150 → 151/155 | +8/−7 |
| `tests/runtime/scene/fx-particles.test.ts` | 0 → 141/145 | +141 |
| `tests/perf/fx-particles-budget.ts` | 0 → 27/31 | +27 |
| `tests/runtime/scene/fx-particles-qa.test.ts` (QA, G6) | 0 → 27/37 | +27 |
| `tests/runtime/render/render-core.test.ts` | 125 → 126/130 | +2/−1 |
| CN-018: `src/types/core-types.ts` | 318 → 405 (verbatim copy) | +69 content lines (+87 with blank lines), add-only |
| CN-018: `tests/smoke.test.ts` | 15 → 15/19 | +1/−1 |

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// render/fx-particles.ts
export const PARTICLES = { pool: 96, perEffect: 48, count: 12, lifeMin: 200, lifeMax: 3000, life: 800, pullMax: 2000, pull: 1000, sizes: [3, 2, 1], fades: [0.5, 0.25], reachPx: 24, colour: "#ffb048" } as const;
export const FX_BUDGET = { effect: 60, total: 120, frame: 300 } as const;
export const FX_GROUND_ORDER = ["shore", "pieces", "particles"] as const;
export type ParticleRead = { readonly motion: ParticleMotion; readonly count: number; readonly life: number; readonly pull: number; readonly bad: readonly string[] };
export type Dot = { readonly x: number; readonly y: number; readonly size: number; readonly colour: string; readonly alpha: number };
export function particleRead(p: { readonly particle_motion?: unknown; readonly particle_count?: unknown; readonly particle_life_ms?: unknown; readonly particle_life?: unknown; readonly particle_pull?: unknown }): ParticleRead;
export function capCounts(counts: readonly number[]): { counts: number[]; over: number | null };
export function particleAt(read: ParticleRead, i: number, seed: number, age: number, ramp: readonly string[] | null, reduce: boolean): Dot | null;
// render/fx-look.ts
export const LOOK = { outlineOverPx: 6, cacheBytes: 16 * 2 ** 20, buckets: 16, liteBuckets: 8, up: 3 } as const;
export const lookSize = (fw: number, fh: number, look: string): { w: number; h: number } => …;
export const turnTag = (deg: number | undefined, lite: boolean): string | null => { … };
export const lookId = (id: string, frame: number, fw: number, fh: number, look: string): string => `${id}~fx${frame}~${fw}x${fh}~${look}`;
export function recolour(src: Pixels, arg: string, ramps: Ramps | undefined): Pixels;
type Source = (sheetId: string, frame: number, fw: number, fh: number) => Pixels | undefined;   // local, not exported
export function lookPixels(id: string, source: Source, ramps: Ramps | undefined): Pixels | undefined;
// render/fx-light.ts (added)
export const HIT_WHITE = { min: 40, max: 200 } as const;
export function hitWhiteMs(stored: unknown): { ms: number; bad: boolean };
export const hitWhiteArg = (fx: { readonly hit_white_ms?: unknown; readonly hit_white_mode?: string; readonly impact_colour?: string; readonly tint_ramp?: string }, hit: number, pose: number, ramps: Ramps | undefined): string | null => { … };
// render/types.ts (added fields)
Standing & Overlay: readonly look?: string; readonly scale?: number
export type SceneDot = { readonly band: Exclude<Band, "base" | "ui">; readonly x: number; readonly y: number; readonly size: number; readonly colour: string; readonly alpha: number };
RenderScene: readonly dots?: readonly SceneDot[]      DrawCmd: readonly rects?: readonly number[]; readonly colour?: string
Renderer: fillRects?(rects: readonly number[], colour: string): void
// render/fx-player.ts, render/fx-live.ts (added fields)
FxPiece: … & { readonly kind?: string; readonly outline?: string; readonly blend?: Blend; readonly angle?: number; readonly particle_life?: number } & FxParticleStepFields
LiveFx: readonly pixel_scale?: unknown; readonly hit_white_ms?: unknown; readonly hit_white_target?: string; readonly hit_white_mode?: string; readonly impact_colour?: string
LiveOut: readonly dots: SceneDot[]
```
From `src/types/core-types.ts` (type-only imports, never redefined): `ParticleMotion`, `FxParticleStepFields`, `Blend`, `HitWhiteMode`, `FxLightMode`. Seam 16: the game maps each stored step field onto `FxPiece` under the same name (plus `kind` and the host's `angle`) and the effect knobs onto `LiveFx`.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) identical; the 21 smoke lines match the Base (the heap line is report-only).

## Existing tests changed by ruling (and only these)
- `tests/smoke.test.ts`: "smoke: core-types.ts is the pinned DSK copy": the pin `61fad786…` → `d6d0869644f3c9876aa1101d8a7248f8b5a18b3beabcb0b191c9c42fec88a366` (Ruling 1, CN-018).
- `tests/runtime/render/render-core.test.ts`: "the render core stays pure: …(step 27)": also accepts `../../types/core-types.ts`, only as a one-line `import type { … }` (Ruling 1). Everything else in the test is unchanged.

## Tests that prove it is done
Shipped tests (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-33b3-particles-outline/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/scene/fx-particles.test.ts` | `tests/runtime/scene/fx-particles.test.ts` | `2893173f15a2be3eebc2b488d4b7f017db88aebb9329a627fb94787f90e0fd86` |
| `tests/perf/fx-particles-budget.ts` (rig + perf script) | `tests/perf/fx-particles-budget.ts` | `832795683181b2c2d6b6bb352dd4c7d53e5edf63135eb4011a8976f78eb97295` |
| `tests/runtime/render/render-core.test.ts` (changed by Ruling 1) | `tests/runtime/render/render-core.test.ts` | `bbbac8c707674b3e9b5df2e9bdad6de7429f47f18798dacec49002417695d890` |
| `tests/smoke.test.ts` (CN-018 pin) | `tests/smoke.test.ts` | `f114708f5e5929c900669ba232bb7d627e5c642f88323fd77cf3e2758c9f1d56` |
| `tests/runtime/scene/fx-particles-qa.test.ts` (QA's G1 test, G6) | `tests/runtime/scene/fx-particles-qa.test.ts` | `819bcd57befa1dc139e96939c96cf1bf98e60343bf8b87bf00cc3d7ad24c1238` |

Titles (exact), `fx-particles.test.ts`:
- "particles format: particle_motion burst/attract/spiral-in/rise (unknown plays as burst, outOfRange), particle_count 0-48 default 12, particle_life_ms 200-3000 default 800 (draft particle_life is an alias; _ms wins), particle_pull 0-2000 default 1000, clamped and flagged; the 48 is a per-effect sum: later steps are cut in step order and the pre-cut sum is reported (step 33b-3, CN-017)"
- "particle motion: seeded and clock-based (same inputs, same art-px offsets, floored from 1/256), size 3 then 2 then 1 over its life, colour steps down the ramp from its lightest, only the last 2 steps fade (0.5, 0.25); burst grows from the emitter, rise goes up, attract and spiral-in reach the emitter by pull; pull is ignored by burst and rise; reduce motion keeps 2 stills (step 33b-3, CN-017)"
- "live particles: a particles step draws dots from its emitter in its band, never its picture; one pool of 96 drops the oldest first; fxParticlesOverCap {count, limit: 48} fires once with outOfRange per field; draws are capped at 60 per effect and 120 in total, pieces first, and a particle is one draw (step 33b-3, CN-017)"
- "draw list: particles draw after their band's pieces as one batched rect command per colour (rgba when faded), so on fxGround the order is shore, pieces, particles, then the standing pass; fxGround rects take the night, other bands are self-lit (seam 23); the frame stops at 300 draws; present uses one fill per command, else one fillRect per rect; chunked lists draw them once (step 33b-3, seam 3)"
- "outline: auto outlines a piece over 6 px in its ramp's darkest step (else black), on outlines any size, off or absent never; additive pieces never outline and draw with add; particles never outline; the outline is a 1 px 4-neighbour ring baked once (size +2, drawn 1 px up-left) (step 33b-3, CN-015)"
- "hit-white: hit_white_ms 0 is off, else 40-200 (clamped, outOfRange), starting at the hit; the target (default), the caster, or every stamp step drawing at the hit is recoloured on its own pixels: white, black, bright (2 steps up its ramp) or tint (impact_colour snapped to tint_ramp); alpha is kept (step 33b-3, seam 19, §2.10.2.7)"
- "pixel_scale: an int 1-6 draws every piece and particle k art px per art px around its anchor; match-sprite and absent draw at 1 (no wanted size reaches the player); out of range clamps with outOfRange (step 33b-3, CN-015)"
- "RotSprite: a piece's angle picks one of 16 buckets (lite 8, nearest), bucket 0 draws as-is; each bucket is baked once at art res by a 3x Scale3x upscale, a rotate and a centre sample, into a centred square, so 90 degrees is exact, every colour comes from the source (no blends, no mixels) and lite's nearest turn differs; turn, then hit-white, then outline (step 33b-3)"
- "16 MB cache: generated bakes (looks, turns, squash) share one LRU with the light canvases; at frame end the least recently drawn are dropped until bakes plus lights fit in 16 MB, never one drawn this frame; a cache hit is not rebuilt (step 33b-3)"
- "budget counts (in the suite; the 4 ms p95 wall clock runs alone in tests/perf/fx-particles-budget.ts): 12 looping effects with 48 particles and 2 outlined, turned pieces each draw 120 fx draws (24 pieces, 96 particles), at most 300 a frame, and one fill per particle colour (step 33b-3)"
Titles (exact), `fx-particles-qa.test.ts`:
- "QA 33b-3: a tint hit-white with no or a bad impact_colour paints #ffb048; a squashed unit keeps its squash and drops the recolour (Ruling 10)"
- "QA 33b-3: pool ties drop the earlier effect; unit-layer particles draw in fxAir; the 300 cut takes the newest rects first (Rulings 6 and 7)"
(You may add tests. The hand-back lists all five shipped files' sha256, unchanged.)

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/s33b3-plants.py <clone> <base clone>` (result `s33b3-plants-result.txt`) runs 84 plants against `fx-particles.test.ts` and the render purity test (the perf file is imported), matching **full test titles**:
- F1–F23 format and motion: unknown motion, defaults, ranges, the alias and its order, flags, the 48 cut and its count, the seeded angle, size order, ramp direction, fades, pull on burst / attract, spiral turn, rise direction, reduce stills, floors, the life's end.
- V1–V20 live: pool size and order, the cap notice, the 60 / 120 caps, particles free or drawing their picture or always `fxAir`, scale on particles, outline threshold / additive / colour / `on`, additive op, `pixel_scale` flag and clamp, stamp hit-white scope, look order, lite buckets, the `hit_white_ms` flag.
- W1–W5, S1–S6 hit-white rules and the link: window start, 40 / 200, tint snap and colour, caster / stamp targets, the unit look, dots into the scene, `lookPixels` in `pixels`, style ramps for bright.
- K1–K10 bakes: ring shape and shift, recolour alpha and transparency, no Scale3x, the turn direction, outline size, buckets and rounding, the 16 MB.
- B1–B4, T1, L1–L12, C1, P1 canvas and draw list: lights outside the cap, FIFO, dropping this frame's bake, per-rect fills, no batching, dot order, night flags, grouping, alpha, 400 / no cut, scale size and anchors, look shift, unit look dropped, chunked double draw, the rig's fill count.
- R1: a value import from core-types in the render core.
Expected: **84/84 caught; 83/84 catching tests fail on the Base (R1, the type-only core-types guard, is caught by the purity test, which passes on the Base by design)**. No equivalent plants.

QA's set: `qa-plants.py <clone>` (`9671d303`, from `qa-runs/step-33b3-review/probes/`; copy in `/workspace/scratch-ea/s33b3-qa/`) runs 26 more plants (Q1–Q26) against all shipped tests. Expected with the r2 proto: **25/26 caught** (only Q12 missed). Q12 (pixel_scale floors instead of rounding) was outside the r1 rulings; ruling (b) now writes rounding down, but no shipped test pins it yet.

## Example
A frost bolt at 1000 ms carries a `particles` step (`particle_count: 30`, `particle_motion: "spiral-in"`, `particle_pull: 1500`) and a 12 px rune stamp with `outline: "auto"` and `angle: 45`; the effect has `tint_ramp: "water"`, `pixel_scale: 2`, `hit_white_ms: 60` and `hit_white_mode: "bright"`:
- From 1000 the 30 particles start up to 48 art px out (reach × 2), spiral in and reach the bolt by two-thirds of their life, 6 → 4 → 2 px, pale ice-white down to dark blue, the last two colours at half and quarter alpha.
- The rune draws once per frame from a cached bake: turned to bucket 2 (45°) by the RotSprite pass, outlined in `#102040`, twice its size around its anchor.
- From the hit (1300) to 1360 the slime draws 2 steps up its ramp; at 1360 it is back to normal.
- Three more bolts in flight bring 120 live particles: the pool keeps the newest 96, so the oldest bolt's particles go first; no effect draws more than 60 and all effects no more than 120.

## Decisions note: what to name
- The particle seed (`hash32(mapSeed, effect id, step index)`), the reach (8–24 art px), the ease and pull curves, and that age follows the effect's draw time.
- The pool order (oldest-born dropped; ties drop the earlier effect) and the budget order (pieces first, then particles; the 300 cut takes the newest rects).
- The look tag grammar and order (turn, hit-white, outline) and the bucket rounding.
- Law 13 bounds: the pool ≤ 96 dots per frame (nothing kept between frames); `capCounts` per effect; generated bakes in Canvas2D's one 16 MB LRU with the light canvases (plus the 120-frame idle drop); notices through the link's ≤ 1024 deduped list. No new maps or memos.
- Reserved words: no game words in the render files; no export named like a tint mode (step 31's pin).

## Do not touch
`locked/`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/*.md`; `feel.ts`; `light.ts`; `bakes.ts`; `water.ts`; `motion.ts`; `world-motion.ts`; `raf-driver.ts`; `needsDraw` in `dirty.ts`; `src/core/**`; `src/fx/**`; the sim; every existing test file except the two named above; plus BUILD_GUIDE §7's never-edit list. `src/types/core-types.ts` changes only by the verbatim CN-018 copy.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 672 tests passing and none failing, cancelled, skipped or todo.
- [ ] The five shipped files are byte-identical to the sha256s above; `node tests/perf/fx-particles-budget.ts`, run alone, exits 0 (every lap's p95 ≤ 4 ms); `src/types/core-types.ts` is the kit's `data/staging/core-types.cnE.ts`, sha256 `d6d08696…`.
- [ ] Sims and every other pin unchanged; the smoke lines match the Base (heap delta excepted); the 33b-2 files (`fx-light.test.ts`, `fx-light-qa.test.ts`, `fx-light-qa-r4.test.ts`, `tests/perf/fx-light-budget.ts`) unchanged and passing.
- [ ] Each file within its cap; changed lines (insertions + deletions) in total outside CN-018 within 150–500, and the hand-back carries the written 400–500 reason above (the proto is 423 in 16 files: EA's 396 in 15 plus QA's 27-line G6 test; product code 225).
- [ ] `fx-particles.ts` imports only `./frames.ts` and the core-types type; `fx-look.ts` only `./bakes.ts` (type) and `./fx-light.ts`; `world-scene.ts` still imports only `../render/index.ts` and `../../core/notice.ts`; `canvas2d.ts` only `../render/index.ts`.
- [ ] With no particle, outline, scale, angle or hit-white fields, everything draws as in 33b-2 (all earlier tests pass; no `dots` on the scene; no look ids).
- [ ] Nothing reads `LiveOut.holds` (seam 18).
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location, `handback/step-33b3-particles-outline/r<N>/HANDBACK.md` (Delivery).

## Not in this step (carries, with their target step)
- **The `clip_cues` player** (seam 19's other half): the generic 2-frame flash and its suppression play (`cuesSuppressed` is the rule); not in the user's 33b-3 list. Seam 24.
- **Particles' reused fields** (CN-017 "Reused": `jitter`, `start_spread`, `size_spread`, `picture`): the plan row draws rects only; lite's "half the particles" (UX) is not applied. Seam 29.
- **Reduce flashes on hit-white** (UX: no flat white body): the recolour plays as stored.
- **Seams 20–22** as logged (moonlit day sheets, follow offsets, `dueMs` through the link). Seam 23's depth-aware self-lit pass stays open (this step only keeps `fxGround` rects night-lit).
- **Seams 25–28, 30** (logged with this step): a hit-white window outlasting its pieces does not wake the host (25); effect lights sit at the unscaled centre under `pixel_scale` > 1 (26); the 300 cut is per draw-list build (27); looks are skipped on squashed or motion-atlas sprites (28); `hex()` reads only `#rrggbb`, so a 3-digit colour outlines white (30).
- **The game side** (seam 16): mapping `kind`, `outline`, `blend`, `angle` and the `particle_*` fields onto `FxPiece`, and `pixel_scale`, `hit_white_*`, `impact_colour` onto `LiveFx`. Game rules stay out of the engine.

## Out of scope
Game rules. Format changes beyond CN-018. A WebGL path. Particle sprites. An effect atlas page. Soft or blurred particles. Per-frame tinting or rotation (`ctx.filter`, `source-atop`).

## Kit files to push
All under `/workspace/tileengine`, full sha256 in `/workspace/scratch-ea/kit-backup-r33b3/r2-kit-sha256.txt`:
- `handoff/steps/step-33b3-particles-outline.md` (this file)
- `handoff/steps/tests/step-33b3-particles-outline/tests/runtime/scene/fx-particles.test.ts` (`2893173f…`)
- `handoff/steps/tests/step-33b3-particles-outline/tests/perf/fx-particles-budget.ts` (`83279568…`)
- `handoff/steps/tests/step-33b3-particles-outline/tests/runtime/render/render-core.test.ts` (`bbbac8c7…`)
- `handoff/steps/tests/step-33b3-particles-outline/tests/smoke.test.ts` (`f114708f…`)
- `handoff/steps/tests/step-33b3-particles-outline/tests/runtime/scene/fx-particles-qa.test.ts` (`819bcd57…`, QA's, G6)
- `data/staging/core-types.cnE.ts` (`d6d08696…`, DSK's CN-018 file, unchanged; not tracked on `d5b36b5f`, so it is pushed with this kit; the builder copies it over `src/types/core-types.ts` per Ruling 1)
- `handoff/README.md`, `docs/core-spine-slices.md`

## Open questions
Ruled in r2 (EA): (a) budget-cut pieces keep their light (Ruling 6); (b) a non-integer `pixel_scale` rounds (Ruling 8); (c) a negative `hit_white_ms` is off and flagged (Ruling 10). Still open:
1. **Rotation input.** No stored field names a rotation, so the proto reads `FxPiece.angle` (degrees) set by the host (e.g. a bolt's heading). Is that the contract, or should a format field (a CN) feed it?
2. **`pixel_scale` k.** `"match-sprite"` and absent both draw at 1 (art px = sprite px here; `FxPiece` has no wanted size for the k rule). Confirm, or name the wanted-size field the k rule should read.
3. **Budget units.** A particle is one draw in the 60/120 (pieces first); the 300 counts image commands plus particle rects and cuts the newest rects, per `buildDrawList` call (chunked base passes are separate lists). Confirm, or count one batched fill as one draw.
4. **Hit-white details.** Tint = `impact_colour` snapped to the effect's `tint_ramp` (raw when it has none, `#ffb048` when unset); white and black play as stored under reduce flashes; a squashed unit keeps its squash. Confirm.
5. **Particle life.** A particle shows only while its step plays (min of step `ms` and life); fades apply only on ramps of 3+ steps; `jitter` / `start_spread` / `size_spread` / `picture` and lite's half count are not read. Confirm or move any into 33b-3.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 672 passing and 0 failing**. Paste the summary line into HANDBACK.md.
- The five shipped files are **byte-identical** to the sha256s above; list each in HANDBACK.md, and paste the output of `node tests/perf/fx-particles-budget.ts` run alone.
- The bundle is `<Base d5b36b5f>..step/step-33b3-particles-outline-r<N>` and passes `git bundle verify`. Each file stays within its cap (proto count + 4; QA's test 37), and the total outside CN-018 (insertions + deletions) is 150–500 changed lines, with the written 400–500 reason in HANDBACK.md. `src/types/core-types.ts` is `d6d08696…`, copied from the kit's `data/staging/core-types.cnE.ts`.
