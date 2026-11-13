# step-33-effects-sync: the effects player, part 33a (bands, anchors, events) (renderer plan slice 33; CN-014; CEO 18:35 rulings placed; DSK departures accepted 20:52)

Step id: step-33-effects-sync          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: `6f62eb17d5193519f9432a9792749b9f77a18756` (main, the step 32 merge: PR #40, chatB code `8a22ec5` plus QA fix `974c0b3`, tree `6c5c1567`; verified PASS 586/0, `/workspace/scratch-ea/s32-verify-report.txt` sha256 `2ae17f19…`). Branch: `step/step-33-effects-sync-r<N>`, created from `6f62eb1`. The PR targets `main`. Never commit to `main`.
The diff is always `6f62eb1..<head>`.
Delivery (CN-003): `git bundle create step-33-effects-sync-r<N>.bundle 6f62eb1..step/step-33-effects-sync-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HAND-BACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. If a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-33-effects-sync/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 prefix in it.
Depends on: step 32 (Base); step 27 (`draw-list.ts` `buildDrawList`, `frames.ts` `clipMs` / `frameAt`, `types.ts` `Standing` / `Overlay` / `BANDS`); step 25 (`src/fx/order/read.ts` `FX_FORMAT`, the 64 refusal). Formats: `handoff/change-notices/CN-014-effects-sync-format.md` (sha256 `312323e4…`, **this step**); `CN-015-effects-feel-format.md` (`01aaba1f…`, **33b, after the host hookup step; cited only to place rulings**); setup-format **r23** (`193e4075…`, §2.10.3.1), project-format **r35** (`ce7e9f53…`, §6.2 clip `events` / `points`, §6.7 K-4), profile-format **r14** (`d700d891…`, §3.3; 33b).
Read first: BUILD_GUIDE.md §3 (runtime import lines; the render core is pure and imports only `./x.ts`), §7 (one size rule, shipped tests), law 13 (bounded runtime memory); CN-014 in full; UX `ux/effects-sprite-sync.md` (`4e72b97e…`) §9 (kit brief: bands, sort keys, budgets) and §10 (EA answers); `docs/qa/step-32-ab.md` (`b47521b5…`, QA's step 32 A/B pick).
Kit: kit-2 (guide-3), 2026-11-13. Engine Architect. Kit-2 follows QA's r1 NOT OK TO SEND (`docs/qa/step-33-review.md`, sha256 `9fbef069…`; F-1, test-only): it takes QA's qfix **as is**. Prototyped on Node 24.22.1: branch `r33` = r1 `bfdbdb43` (tree `673157ea`) → QA qfix `e3439c1f9eb7fa9378f758d7226c206158f46002` (tree `73e8d5fd`; QA's own commit from its `qfix` clone, patch `s33-qfix-r1.patch` `c8486b3a…`; shipped test only). `npm ci && npm run green` exits 0 with `tests 597 pass 597 fail 0 skipped 0 todo 0` (586 + 11); `tsc` 0. Sims and all 20 smoke lines unchanged. Plants: EA `/workspace/scratch-ea/s33-plants-r1.py` (sha256 `848f19f9…`) **51/51 caught, all 51 catching tests fail on the base**; QA `tools/qa33-plants.py` (`fd503fbe…`) 34/36 against the shipped test (Q29 is caught by the step 31 render tests; Q33 is the NaN baseline probe, N-1), **85/85 overall** (log `06533217…`). Bundle copy: `/workspace/scratch-ea/r33-r2.bundle` (`6f62eb1..r33`, verified, sha256 `2c681149…`).
Carries: **no new CN.** CN-014 is filed (DSK, accepted). No core-types change (`61fad786…`): the effect unions (CN-E2) and `te-flash@3` (CN-E3) wait until after H2, so this step keeps **local** string unions in the render core. `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) are unchanged.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist (`docs/qa/handback-checklist.md`) before hand-back (see BUILD_GUIDE).

## Goal
After this step the render core can play an effect in sync with a sprite. It reads clip `events` and `points` (CN-014) or derives them. It starts an effect on cast, release or contact and works out `hitAt`. It fires events by the crossing rule and places each step on an anchor point of its anchor unit, either where the unit was (`spawn`) or following it (`follow`, optionally frozen at the hit). It draws the step in its band: `fxGround` after the ground, `behind-unit` / `front-unit` next to the anchor unit with the facing swap, then `fxAir`, `flash`. Everything is pure: data in, draw entries and events out. The host wiring is the host hookup step (next); particles, lights, Feel and shake are 33b (CN-015), after it.

## Rulings
Every ruling this step depends on, each placed in **33a** (built and pinned here) or **33b** (CN-015, after the host hookup step; not built here, no test here).

33a, built here:
1. **Clip events read** (DSK CN-014 `clips[].events`): entries `{frame: int 0…n−1, name: string 1–16}`; a bad entry is skipped with `clipEventInvalid`; a non-list warns `clipEventInvalid` once and reads as absent; over 16 valid entries, **the first 16 in stored order fire** and `clipEventsOverCap` warns once. Pinned by: "clip events: valid entries kept in stored order, bad entries skipped with clipEventInvalid, a non-list reads as absent, over 16 the first 16 fire (step 33a, CN-014)".
2. **Derived events** (DSK CN-014 rule 5): `null`, `[]` and a list with no valid entry are absent; then `contact` = the frame with the biggest pose change (`poseDelta[i]`, first on ties, zero never wins), else `floor(n/2)`; `release` = the same frame; order `[release, contact]`. Pinned by: "derived events: null, [] and all-bad are absent; contact = the biggest pose change (first on ties), else floor(n/2); release on the same frame (step 33a)".
3. **Clip points read** (DSK CN-014 `clips[].points`, rule 3): names `hand`, `tip`, `head`, `centre`; an entry must be `[int x, int y]` inside the frame, else `null` with `clipPointsInvalid` (a stored `null` is silent); 1 entry = every frame; any other length mismatch pads with the last / cuts, with one `clipPointsInvalid`. Pinned by: "clip points: 1 entry = every frame, other lengths pad with the last / cut with clipPointsInvalid, a bad entry is null, a stored foot is ignored (step 33a)".
4. **No `points.foot`** (DSK departure, accepted): a stored `foot` is ignored with `clipPointsInvalid`; foot = the sheet anchor (`anchorPx`, the same one the draw list uses). Pinned by: the clip points test above and "placement: spawn stays where the unit was, follow moves, detach hit freezes at hitAt; tile, screen, unknown or no unit play as today; lit absent = own light (step 33a)".
5. **Anchor point fallbacks and mirror** (CN-014; runtime): stored first; `centre` = opaque box centre `(x + floor(w/2), y + floor(h/2))`; `head` = box top centre `(x + floor(w/2), y)`; `hand` / `tip` fall back to `centre` (the stored one if any); a flipped unit mirrors `x' = fw − 1 − x`. Pinned by: "anchor points: stored first, centre / head derived from the opaque box, hand / tip fall back to centre, mirrored x' = fw - 1 - x (step 33a)".
6. **`start_on`** (CN-014): `cast` (default); `release` / `contact` = cast + the start time of that clip event's frame; an unknown option or a caster with no clip starts at cast. Pinned by: "start_on and hitAt: release / contact start at that clip event, no clip or an unknown option starts at cast; hitAt = effect hit, else contact, else lunge peak, else cast; ticks once (step 33a)".
7. **`hitAt`** (CN-014 runtime list): the first that applies of effect hit offset, clip contact, lunge peak, cast start; times round **up** to the tick **once** (`toTick`). Pinned by: the start_on and hitAt test above.
8. **Crossing rule and events** (CN-014 runtime): every event with `t1 < at ≤ t2` fires once, in time then list order; split windows fire the same set; a loop adds `fx:loop` at `from + k·lapMs`, k ≥ 1. Event types `fx:start`, `fx:release`, `fx:hit`, `fx:end`, `fx:loop`, `clip:event{name}`. Pinned by: "crossing rule: every event in (t1, t2] fires once, in time then list order; split windows fire the same set; a loop adds fx:loop per lap (step 33a)".
9. **View lag** (user answer 20:52): the view shows the hit at `max(commit, hitAt)` but never later than `commit + min(effect length, 500 ms)`; the rules never wait (the commit time is an input, never moved). Pinned by: "view lag: the view shows the hit at hitAt, never past commit + min(effect length, 500 ms); the rules' commit never moves (step 33a)".
10. **Pose grid** (user answer 20:52; DSK: `graphics` low = lite): effects pose on a 30 ms grid (60 ms in lite, chosen by the caller at effect start); the frame is due at the smallest `nextChangeMs` over the grid and every other source (dirty flag). Pinned by: "pose grid: effects pose on a 30 ms grid (60 in lite); the frame is due at the smallest nextChangeMs; 120 Hz frames add no poses (step 33a)".
11. **`attach` / `detach`** (CN-014): `spawn` (default) = the unit's place at step start; `follow` = now; `follow` + `detach: "hit"` = frozen at `hitAt`; `detach` is ignored on `spawn`; a missing unit falls back to its step-start place, then to the tile. A step draws on `[start, start + ms)`. Pinned by: the placement test.
12. **`anchor_point`** (CN-014): `tile` (default) plays as today at the caller's tile point; an unknown option → `tile`; ignored with `anchor: "screen"`. Pinned by: the placement test.
13. **Draw layers to bands** (CN-014; UX §9): `ground` → `fxGround`, `air` (default, and unknown) → `fxAir`, `overlay` → `flash`; `behind-unit` / `front-unit` with no anchor unit play as `air`. Pinned by: the placement test.
14. **Sort at the anchor unit** (user answer 20:52; UX §9): `fxBehind` < unit < `fxFront`, at the anchor unit's own sort key (`c`, `r`, `dy`) only; a unit on another row sorts normally; the **facing swap is a draw-list rule**: `faceSwap` (set when `depth_by_facing` is not `false` and the unit faces away) draws `fxFront` as `fxBehind`. `ox`/`oy` move the drawing, never the sort. Pinned by: "draw list: fx-behind < anchor unit < fx-front at the anchor's sort key only, facing away swaps front behind unless depth_by_facing is off; fxGround draws after the ground, before standing (step 33a)".
15. **`fxGround` band** (UX §9): drawn after the ground layers and before standing; `BANDS` becomes `base, fxGround, wash, fxAir, glow, flash, ui`. Pinned by: the draw list test.
16. **`lit` absent = self** (DSK departure; CN-014 rule 1): `ownLight` is true for absent and anything but `"scene"`. The darkness punch-out itself is 33b. Pinned by: the placement test.
17. **The 64 refusal** (DSK departure): over 64 is **refused, never cut**: `fxTooManyFrames` with message `{subject: steps, count: N, limit: 64}` from `readFxOrder`, and `{subject: strip, count: N, limit: 64, assetId: <id>}` from `stripNote`; a refused strip draws nothing. Pinned by: "64 ceiling: an effect over 64 steps is refused, never cut, and the refusal names subject steps (step 33a, CN-014)" and the placement test.

33b, placed by CN-015 (after the host hookup step; nothing here):
18. **Shake** (CEO 18:35): back at 1–3 art px on big hits; the HUD never shakes; players pick Off / Low / Full. DSK: `shake` 0–3; `screen_shake` Low = `max(1, floor(px/2))`; `reduce_motion` forces Off. → 33b.
19. **Effect pixels match the sprite pixel size by default** (CEO 18:35; CN-015 `pixel_scale: "match-sprite"`). → 33b.
20. **Basic mode uses palette-ramp colours only** (CEO 18:35; CN-015 `tint_ramp` / `tint_snap`; ramps resolve via `settings.paintStyleDefault`, else `btf-ashroad@2`). → 33b (render) and the editor.
21. **The target shivers 1 px during hit-stop** (CEO 18:35; DSK: always on, no `hit_stop_jitter` field). → 33b (Feel).
22. **`light_mode` off | steady | pop** and the `lit: self` darkness punch-out (DSK). → 33b.
23. **Rotation** (user answer 20:52): RotSprite at art res, built once into the cache, nearest in lite, 16 MB LRU (law 13). → 33b.
24. **Budgets** (UX §9): ≤ 60 fx draws per effect, ≤ 120 total, ≤ 300 per frame. → 33b (particles are what reach them).
25. **`anims[].events` optional and hashed** in `sprite-recipe` v1; events / points on procedural sprites live in the recipe (`styleParamIgnored` on AssetMeta copies). → the recipe reader and the host loader, not the render core. EA confirms: fine.

## Files to create or change
- create `src/runtime/render/fx-player.ts` (≤ 111; the player: events, points, start, hitAt, crossing, view lag, pose grid, strip refusal, placement)
- change `src/runtime/render/types.ts` (≤ 36; `BANDS` += `fxGround`, `flash`; `Standing.kind` += `fxBehind`, `fxFront`; `ox`, `oy`, `faceSwap`)
- change `src/runtime/render/draw-list.ts` (≤ 69; export `anchorPx`; `KIND` ranks and the facing swap; `ox`/`oy`; `fxGround` overlays after the ground)
- change `src/runtime/render/index.ts` (≤ 18; one export line)
- change `src/fx/order/read.ts` (≤ 118; the steps refusal message only, in place)
- create `tests/runtime/render/fx-player.test.ts` (shipped, verbatim)

Size: 150–400 changed lines. The proto changes 259 lines (+242/−17) in 6 files (kit-1: 257, +240/−17; QA's qfix added 2 test lines):

| File | Base → proto / cap |
|---|---|
| `src/runtime/render/fx-player.ts` | new → 107/111 |
| `src/runtime/render/types.ts` | 31 → 32/36 |
| `src/runtime/render/draw-list.ts` | 62 → 65/69 |
| `src/runtime/render/index.ts` | 13 → 14/18 |
| `src/fx/order/read.ts` | 114 → 114/118 (in place) |
| `tests/runtime/render/fx-player.test.ts` | new → 111/115 → **113/115** (kit-2: QA qfix; shipped; you may add tests in another file) |

## Interfaces to match (quoted exactly)
```ts
// src/runtime/render/fx-player.ts
export const FX_PLAYER = { eventCap: 16, frameCap: 64, lagMaxMs: 500, gridMs: 30, liteGridMs: 60 } as const;
export type FxNote = { readonly code: string; readonly message: string };
export type ClipEvent = { readonly frame: number; readonly name: string };
export type Pt = { readonly x: number; readonly y: number };
export type Box = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
export type PointName = "hand" | "tip" | "head" | "centre";
export type PointTable = Readonly<Record<PointName, readonly (Pt | null)[]>>;
export type FxEvent = { readonly type: "fx:start" | "fx:release" | "fx:hit" | "fx:end" | "fx:loop" | "clip:event"; readonly at: number; readonly name?: string };
export type FxActor = { readonly c: number; readonly r: number; readonly dx?: number; readonly dy?: number; readonly sheet: Sheet; readonly frame: number; readonly flipX?: boolean; readonly facesAway?: boolean; readonly points: PointTable; readonly box: Box };
export type FxPiece = { readonly at: number; readonly ms: number; readonly sheet: Sheet; readonly clip?: Clip; readonly anchor?: string; readonly anchor_point?: string; readonly attach?: string; readonly detach?: string; readonly draw_layer?: string; readonly depth_by_facing?: boolean; readonly lit?: string };
export const toTick = (ms: number, stepMs: number): number => …;
export function clipEvents(stored: unknown, frames: number, poseDelta: readonly number[] = []): { events: ClipEvent[]; notes: FxNote[] };
export function clipPoints(stored: unknown, frames: number, fw: number, fh: number): { points: PointTable; notes: FxNote[] };
export function pointAt(points: PointTable, name: PointName, frame: number, box: Box, fw: number, flipX: boolean): Pt;
export function startMs(startOn: string | undefined, castMs: number, clip: Clip | undefined, events: readonly ClipEvent[], stepMs: number): number;
export const frameStart = (clip: Clip, frame: number, stepMs: number): number => …;
export function hitAt(castMs: number, stepMs: number, o: { readonly effectHitMs?: number; readonly contactMs?: number; readonly lungePeakMs?: number }): number;
export const viewHitMs = (commitMs: number, hitMs: number, effectMs: number): number => …;
export function crossed(list: readonly FxEvent[], t1: number, t2: number, loop?: { readonly from: number; readonly lapMs: number }): FxEvent[];
export const poseMs = (tMs: number, lite: boolean): number => …;
export const nextChangeMs = (tMs: number, lite: boolean, ...others: readonly number[]): number => …;
export const stripNote = (clip: Clip | undefined, assetId: string): FxNote | null => …;
export const ownLight = (p: FxPiece): boolean => …;
export function placeStep(p: FxPiece, effectStart: number, tMs: number, hitMs: number, unitAt: (tMs: number) => FxActor | null, tile: Pt, tileW: number, tileH: number, stepMs: number): Standing | Overlay | null;
// src/runtime/render/types.ts
export const BANDS = ["base", "fxGround", "wash", "fxAir", "glow", "flash", "ui"] as const;
export type Standing = { readonly kind: "object" | "unit" | "fxBehind" | "fxFront"; readonly ox?: number; readonly oy?: number; readonly faceSwap?: boolean; /* the step 27–30 fields, unchanged */ };
// src/runtime/render/draw-list.ts
export const anchorPx = (sheet: Sheet): { x: number; y: number } => …;
```
No type comes from `src/types/core-types.ts` in this step (local unions until CN-E2 after H2). `FxActor.frame` is the index into the unit's clip frames (the one `points` and `box` refer to); `FxActor.box` is the unit frame's opaque box, computed by the caller. `FxPiece.at` / `ms` are the step's start offset and length inside the effect (from `planFx`).

## Smoke lines
None move. Sims (stage-fixed 48/2 history `afc89d56…`, stage-weighted 22/28 `b8007292…`) and all 20 smoke lines are byte-identical to the base.

## Existing tests changed by ruling (and only these)
None. (`tests/sim/speed-memory.test.ts` checks only the `fxTooManyFrames` code, which stays.)

## Tests that prove it is done
Shipped tests (copy verbatim from `handoff/steps/tests/step-33-effects-sync/`; never weaken, rename, skip or delete; a failing one is a must-fix):

| Shipped file (under `handoff/steps/tests/step-33-effects-sync/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/render/fx-player.test.ts` | `tests/runtime/render/fx-player.test.ts` | `33ce473acf8c6ba32eeb2b2ef947d02170c8a354ca5fb6b90d3f9c006e31c7d4` (kit-1 `b913cc56…` replaced by QA's qfix) |

Titles they hold (exact):
- `tests/runtime/render/fx-player.test.ts` — "clip events: valid entries kept in stored order, bad entries skipped with clipEventInvalid, a non-list reads as absent, over 16 the first 16 fire (step 33a, CN-014)"
- `tests/runtime/render/fx-player.test.ts` — "derived events: null, [] and all-bad are absent; contact = the biggest pose change (first on ties), else floor(n/2); release on the same frame (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "clip points: 1 entry = every frame, other lengths pad with the last / cut with clipPointsInvalid, a bad entry is null, a stored foot is ignored (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "anchor points: stored first, centre / head derived from the opaque box, hand / tip fall back to centre, mirrored x' = fw - 1 - x (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "start_on and hitAt: release / contact start at that clip event, no clip or an unknown option starts at cast; hitAt = effect hit, else contact, else lunge peak, else cast; ticks once (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "crossing rule: every event in (t1, t2] fires once, in time then list order; split windows fire the same set; a loop adds fx:loop per lap (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "view lag: the view shows the hit at hitAt, never past commit + min(effect length, 500 ms); the rules' commit never moves (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "pose grid: effects pose on a 30 ms grid (60 in lite); the frame is due at the smallest nextChangeMs; 120 Hz frames add no poses (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "placement: spawn stays where the unit was, follow moves, detach hit freezes at hitAt; tile, screen, unknown or no unit play as today; lit absent = own light (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "draw list: fx-behind < anchor unit < fx-front at the anchor's sort key only, facing away swaps front behind unless depth_by_facing is off; fxGround draws after the ground, before standing (step 33a)"
- `tests/runtime/render/fx-player.test.ts` — "64 ceiling: an effect over 64 steps is refused, never cut, and the refusal names subject steps (step 33a, CN-014)"
(You may add tests. The hand-back lists the shipped file's sha256, unchanged.) The existing render-core purity test ("the render core stays pure…", step 27) covers `fx-player.ts`: no DOM, no wall time, imports only `./x.ts`. Note it bans the word `self` even inside strings, so the `lit` default is written as "anything but `"scene"`".

## How a planted bug is caught (for QA)
`python3 /workspace/scratch-ea/s33-plants-r1.py <your clone> <base clone at 6f62eb1>` (sha256 `848f19f9…`). It applies 51 one-rule plants to `fx-player.ts`, `draw-list.ts` and `read.ts` (E1–E6 events, D1–D5 derived, P1–P5 points, A1–A3 anchors, S1–S4 start/hitAt, C1–C3 crossing, V1–V3 lag, G1–G3 grid, L1–L11 placement, B1–B6 sort and bands, R1–R2 refusal), runs the shipped test plus render-core, and reverts each. Expected: **51/51 caught; 51/51 catching tests fail on the base** (the shipped file cannot load there, which fails every test in it). Result on the proto: `/workspace/scratch-ea/s33-plants-r1-result.txt` (`a487408c…`; the same on kit-2, `s33-plants-r1-on-r2-result.txt`). QA's `tools/qa33-plants.py <clone>` (`fd503fbe…`, 36 plants, shipped test only) is expected at 34/36: Q29 (glow add) is caught by the step 31 render tests and Q33 is a NaN baseline probe (N-1, a host carry), so 85/85 overall with EA's 51. The anchors match the proto text; a build that words a line differently may show a plant as not applicable, never as missed.

## Example
A sword swing: the caster's clip has 4 frames of 100 ms and stored events `[{frame: 2, name: "release"}, {frame: 3, name: "contact"}]`. The effect has `start_on: "release"` and one step `{anchor_point: "tip", attach: "follow", detach: "hit", draw_layer: "front-unit"}`. Cast at 1000 ms: the effect starts at 1200, `hitAt` = contact 1300. Each frame the host calls `placeStep` with the caster as anchor unit; the slash follows the blade tip until 1300 and stays there after. It draws just over the caster, unless the caster faces away (north), when it draws just behind. `crossed(events, last, now)` hands `fx:start` at 1200 and `clip:event contact` then `fx:hit` at 1300 to the view; the view shows the damage at 1300, or at commit + 500 ms if that is earlier.

## Decisions note: what to name
Name: `FX_PLAYER` (16, 64, 500, 30, 60); the `KIND` ranks (object 0, fxBehind 1, unit 2, fxFront 3); the `BANDS` order; the derived-centre and head formulas; how a missing anchor unit falls back (step-start place, then tile); that overlays carry a fixed `frame` (the pose grid drives redraws, not the draw list's `dueMs`). Reserved words: `self` (render purity, even in strings), `phase` (check-state). No game words (HP, mana, cost, damage) in the render core.

## Do not touch
`locked/`; `src/types/core-types.ts`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/*.md`; `src/runtime/canvas/**`; `src/runtime/host/**`; `src/runtime/scene/**`; `src/core/**`; `src/fx/order/*` except the one message in `read.ts`; the sim; every existing test file; plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 597 tests passing and none failing, skipped or todo.
- [ ] `tests/runtime/render/fx-player.test.ts` is byte-identical to sha256 `33ce473a…`.
- [ ] Sims, all 20 smoke lines and every pin above unchanged.
- [ ] Each file within its cap; 150–400 changed lines in total.
- [ ] `src/runtime/render/fx-player.ts` imports only `./camera.ts`, `./draw-list.ts`, `./frames.ts`, `./types.ts`; render purity holds.
- [ ] `readFxOrder` over 64 steps returns `order: null` and the exact message `{subject: steps, count: N, limit: 64}`.
- [ ] Every 33a ruling's pinning test passes; no 33b ruling is built.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location above.

## Not in this step (carries, with their target step)
- **33b (CN-015):** rulings 18–24 above; particles; `light_mode` and the `lit` punch-out; Feel (hit-stop shiver, squash, `hit_white_mode: "bright"`); shake and `screen_shake`; `pixel_scale`, `outline`, `tint_ramp`; RotSprite cache; the draw budgets; `te-flash@3` (after H2, CN-E3).
- **Host hookup step (its own short step right after 33a, before 33b; CEO 2026-11-13 21:06):** calling `placeStep` / `crossed` each frame, feeding `FxActor` from the scene (box, facing, flip), mapping `FxNote` to warnings, reading `clips[].events` / `points` from AssetMeta and the recipe (`styleParamIgnored`). All the s32 host carries (step 32 "Host shell"; QA `step-32-ab.md`): (a) the **host loader** for CN-012 / CN-013 (asset, `tileProps[i]`, `objects[]` motion; style `ramps`, `liquidEdge`, `shore`; map `seeThroughCanopy`; `ctx.animated`, `Pixels` to images, `reduce_motion`, `Canvas2D.lights` after `present`); (b) the **same `foamPx`** to `shoreDistance` and `shoreFrames`; (c) a **chunked shore bake** (per chunk, neighbours' land within `SHORE_MAX`); (d) **motion warnings once per asset** (`motionInvalid`, `motionTooLarge`); (e) a **finite clock for `motionCell`**; (f) **validate the window before a dig re-bake** (`shoreDistance` throws on a wrong-length land array); (g) the **live canopy cut** (today one chunk rebuild per unit cell step; a live cut overlay). QA's step 33 notes (`step-33-review.md`; no ruling covers them; **not built in 33a**): **N-1** guard `placeStep` against a non-finite `tMs`, or the host passes a finite clock (`placeStep(…, NaN)` draws today); **N-2** `crossed()` is never asked for more than one lap per call: clamp the window after a resume or tab sleep (law 13; `crossed([], 0, 1e7, {from: 0, lapMs: 1})` returns 1e7 events); **N-3** clamp `effectMs` to ≥ 0 in `viewHitMs` (`viewHitMs(1000, 1200, −50)` = 950, before the commit); **N-4** `clipEvents` with a NaN frame count gives frame-null events.
- **Step 34 (perf):** as listed in step 32.

## Out of scope
Game rules. Format changes. core-types changes. Shaders and WebGL. Particles, lights and shake (33b).

## Open questions
1. DSK (**settled pending DSK**; QA r1 §5): a non-list `clips[].events` keeps the warning: `clipEventInvalid` once, then read as absent (consistent with CN-014 and s32's whole-value warns; the test pins it).
2. DSK (**settled pending DSK**; QA r1 §5): the `fxTooManyFrames` detail `{subject, count, limit, assetId?}` stays in `Notice.message` until CN-E2 moves it to structured fields; **tools never parse it** (the exact text is pinned so it cannot drift).
3. UX/CEO: `draw_layer: "overlay"` → the new `flash` band (above `glow`, below the HUD). Confirm it is the §9 "flash" slot.
4. CEO (answered 21:06): the host wiring for effects and the s32 host carries get their own short step right after 33a, before 33b.
