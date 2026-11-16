Build step-ed-e2-travel-paths r1 from the step file `handoff/steps/step-ed-e2-travel-paths.md` on main (sha256 `71fd3d1585b30ef34e215a118f182be1dc2b91cfb656dde68806c5f5584245aa`); it wins over this paste.

Base commit: **`77552a38`** (`77552a387745e7058df994a08875d4c1c4b505b2`). Branch: `step/step-ed-e2-travel-paths-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-ed-e2-travel-paths-r<N>.bundle 77552a38..step/step-ed-e2-travel-paths-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

Shipped files (copy byte-identical from `handoff/steps/tests/step-ed-e2-travel-paths/` to the same paths at the repo root): `tests/runtime/render/fx-path.test.ts`, `tests/runtime/render/fx-travel.test.ts`, `tests/runtime/render/fx-travel-qa.test.ts`, `tests/runtime/render/fx-travel-qa2.test.ts`. Floor: green at least 784 passing, 0 failing. At most 400 changed lines. Pins unchanged. Noreply author and committer. Don't push.

## Goal
Today a piece is placed at its anchor or follows a unit; the 9 motion kinds never move between caster and target (X2). After this step:
1. **Paths.** The E1 converter gives each piece of the four travel kinds a `path` (kind, start, length, bend, ease and the kind's own values). Play moves that piece from the caster's cell to the target's cell on the pose grid, holds it on the target through `hold_ms`, and turns its picture to the heading through the existing look buckets.
2. **Chaining and riding (M-B6).** A `bounce` hops through its `bounce_points` legs on the way. A `particles`, `stamp` or circle `flash` step with `ride` = a travel step's id takes that step's own path, so sparks, a stamp or a circle flash can ride a throw, and a lit rider carries its light with it (CN-026, L52).
3. **Merge and designer.** `flatten` keeps rides pointing at the right step. `pathDots` gives the designer the real dotted path for the beat row.

A piece without `path` (every hand-built `LiveFx` today) plays exactly as before. Sims and stress counts don't move.

## Rulings
1. **Which kinds travel (scope R3).** `straight`, `swerve`, `bounce` and `orbit` (`PATH.kinds`, in that order). `trace row cone reel scratch` and the other kinds get no path and play at their anchor as today (carry → B-2, drawn paths; DSK keeps a CN number reserved for it). Pinned by test 1.
2. **Absent = today.** Only the converter writes `path`, and only for those kinds. `fx-live` moves a piece only when it has `path`. A hand-built `LiveFx` is byte-identical, and so are sims, stress and smoke. Pinned by test 10.
3. **Path timing.** `path.at` = the step's start and `path.ms` = its `len` (`seconds`), never `hold_ms` or `fade_out_ms`. Progress is `u = (t − at) / ms`, clamped to 0…1. Before its start a path waits on the caster (this only shows for a rider), and after `len` it holds on the target until the piece ends (len + hold, E1 ruling 2). The hit stays r29's: `connect × len` of the hit step. Only when the travel step **is** the hit step (`connect_step` names it, or it is the fallback) does the hit land just before arrival (connect 0.92 × 600 = 552 ms for a 600 ms throw); otherwise the hit follows its own step and the path doesn't move it. Pinned by tests 3, 7, 9.
4. **End points.** `a` is the caster unit's cell foot (`footAt(c, r)`, no `dx`/`dy`). `b` is the target unit's cell foot, or else `LiveFx.at`'s cell. With no target unit and no `at`, or no caster and no `at`, the piece plays at its anchor. The offset `pathAt − foot(anchored cell)` is added to `x`/`y` (overlays) or `ox`/`oy` (the `behind-unit`/`front-unit` bands, which keep their unit's sort key). So the step's `anchor_point` offset rides along. Pinned by tests 9, 10, 11.
5. **Shapes** (all lengths in tiles × `tileW`, hops × `tileW`/`tileH`; `e` = eased `u`; `d = b − a`, `L = |d|`; `n` = the left normal `(d.y, −d.x)/L`, or `(0, −1)` when `L = 0`; results `Math.round`ed to whole px):
   - `straight`: `a + d·e + n·bend·4e(1−e)`, so a positive bend arcs up on a rightward throw, peaking at `bend` tiles.
   - `swerve`: `a + d·e + n·bend·sin(2πe)`, one S.
   - `bounce`: legs `a → a + (dc·tileW, dr·tileH) → … → b`; each leg's share of the time is proportional to its length (equal shares when all are 0), and each leg hops **up** by `|bend|·2v(1−v)` (peak `|bend|/2` tiles).
   - `orbit`: centre `a + d·e`, radius `orbit_radius·4e(1−e)`, angle `atan2(d) + 2π·orbit_turns·e`; a corkscrew that leaves the caster and lands on the target.
   Every kind is exactly on `a` at `u = 0` and on `b` at `u = 1`. Pinned by tests 3, 4, 14 (non-16 px tiles: 32 × 32 and 32 × 16).
6. **Ease.** `look_ease` (catalogue): `linear` = u; `out` = `1 − (1−u)²`; `in-out` = `2u²` below 0.5, else `1 − 2(1−u)²`. An unknown value plays `linear` with `outOfRange`. Pinned by tests 2, 4.
7. **Reading values.** `bend` −2.5…2.5 (default 0.8), `orbit_radius` 0.45–3 (1.05), `orbit_turns` 0.25–4 (1). Out of range clamps with `outOfRange`; a non-number (NaN included) plays the default with `outOfRange`. `bounce_points` are integer `{dc, dr}` from the caster's cell (L33): the first 8 are kept, more give one `overCap`, a bad entry is skipped with `invalidValue`, and a non-array gives `invalidValue` and no hops. The converter notes each as `{code, message: "steps[i].<field>"}` in the order bend, look_ease, orbit_radius, orbit_turns, bounce_points. A disabled step is not noted. Pinned by tests 1, 2, 7.
8. **Heading.** `deg` = `atan2` of the chord over `PATH.headStep` (1/32 of the path's time) ending at `u` (starting at 0 when `u < 1/32`); 0 = east, 90 = south (screen y down). It is `null` when the piece doesn't move (the step's own `angle` stays). Holding keeps the last heading. The look turns by `(angle ?? 0) + deg` through `turnTag` (16 buckets; 8 in lite). Only the four travel kinds turn, and a rider of another kind never does. Pictures are drawn facing east. Pinned by tests 5, 9, 12 (the step's own `angle` is added).
9. **Pose grid.** The path is sampled at `drawT`, which is the 30 ms pose (60 ms lite) with the hit-stop warp. There are no new due times. Pinned by test 9.
10. **Ride (M-B6; RISKY: a new step field; CN-026 rules 1, 1b, 3, 4, 4b).** A rider's `ride` (string) names another step's id; the **first** step with that id (any position) is the one meant. If it is in the first 12, enabled and a travel kind, the piece takes **its** path, timing included. Exactly these targets give `unknownRef` `steps[i].ride`, keep the value, and play the rider at its own anchor: an **empty** string (never looked up, so it can't bind to a step whose id is `""`; the `connect_step` house rule; QA M2), a **missing** id, the step **itself**, a **non-travel** step, a **disabled** step (`enabled: false`; r2 change, r1 rode it), and a step **past the first 12**. A **non-string** (number, `true`, object, array, `null`) is H2 `invalidValue` `steps[i].ride` (the house rule of `pixel_scale` and `variant_seed`), and the piece plays as if `ride` were absent. A **disabled rider** plays nothing and is not noted, like any disabled step (ruling 7). A particles rider moves its whole cloud with the path (the emitter centre follows). **Light is not a step kind:** a stamp or particles rider with a `light_mode` light carries that light along the path, because the light is placed from the moved piece (EA probe: a `steady` light on a stamp or particles rider goes y 42 → 64 → 86 at 30/300/570 ms on the Example's throw). `ride` is not in catalogue rev 24: it is CN-026 (ACCEPTED by DSK) and catalogue request L52 (staged, see § CN-026 / L52). Pinned by tests 8, 11, 13, 15 (first id), 17 (empty).
11. **Flatten (E1 ruling 9 + ride; CN-026 rule 6).** Moved steps get fresh ids minted in step order, after the parts (E1's mint order is unchanged). A moved step's `ride` naming a step of its own side is remapped to that step's fresh id. When a moved step's `ride` names no step of its own side, flatten **removes the key** (absent), so it can never bind to a base step that happens to have the same id (QA F6; r1 kept it, r2 wrote `null`). It never writes `null` (a `null` ride is H2, and CN-026 rule 8 writes a cleared ride as absent), so the flattened doc re-validates with no H2. No new message. Pinned by test 11.
12. **Designer dots.** `pathDots(path, n, a, b, tileW, tileH)` returns `n` points evenly spaced in time from `path.at` to `path.at + path.ms`. `n` is clamped to 2–`PATH.dots` (32), and a non-finite `n` gives 2. This is UX v3's still dotted Travel path; removing the "Travel arrives in a later update" caption is E7's UI. Pinned by test 6.
13. **Layering.** `fx-path.ts` lives in `src/runtime/render/` (the render fence allows same-folder imports only) and imports nothing. `fx-doc.ts` imports `PATH` and `readPath`, `fx-live.ts` imports `isTravel` and `pathAt`, and `fx-player.ts` imports only the `FxPath` type. `src/editor` gets no new import. There are no `Math.random`, `Date` or timers. Trig results are rounded to whole px, and the same input gives the same output. Deps go from 110 modules / 352 deps to 111 / 355.
14. **Fit unchanged.** `beatOf` still says `cast` for a travel step listed before the hit. QA's shipped E1 test (`effect-e1-qa2`, "a multi-beat part uses timing") pins `cast` for a `straight` step, so a Travel beat in Fit moves to E4 with carry (d).
15. **One hop (CN-026 rule 2).** A rider takes the named step's **own** path (`readPath` of that step's own fields), never the path that step would get from its own `ride`. So chains and cycles can't happen (and under ruling 16 a travel step never rides anyway). Pinned by test 8 (A rides B, B rides C: A follows B's own `straight` path, not C's `orbit`).
16. **Who can ride (CN-026 rule 1b, L52 `applies_to_kinds`).** `ride` is read only on `particles`, `stamp` and `flash` steps (`PATH.riders`). **Flash (EA ruling):** `flash` stays a rider, but only a `flash_shape: "circle"` flash follows the path. A `flash_shape: "screen"` flash (the default, and any value other than `"circle"`) has no position, so its `ride` does nothing: no move and no note. On any other kind (the four travel kinds included) `ride` is **ignored**: no note, and the step plays exactly as without it (a travel step keeps its own path). It is never stripped: the doc keeps the key (the runtime only reads it), and flatten still re-points or removes it per ruling 11. Pinned by tests 8, 16 (a ride of any type on a non-rider or a screen flash: no note; an `orbit` and a `dim` with `ride`, a circle flash that rides and a default screen flash that doesn't).

## CN-026 / L52 (`ride`)
- **CN-026** `ride` (DSK, **ACCEPTED** — status line: `Status: **ACCEPTED** (DSK 2026-11-16 11:59 London; EA concurs).` — sha256 `60e08878faf098f1e2d4cca5e8f3d236e80f881d1ee5bb0f3056efa53787bfda`, both copies identical): format only, additive, RISKY; no core-types change, no version bump, no migration; absent = today. Its rules map to this doc as: 1 resolve → ruling 10; 1b who can ride, light, screen flash → rulings 10, 16; 2 one hop → ruling 15; 3 bad refs warn (empty, unknown, self, non-travel, disabled, past 12) → ruling 10; 4 non-string = H2 `invalidValue` → ruling 10; 4b disabled rider → ruling 10; 5 Fit drops the ridden step → the rider's id is then unknown, so `unknownRef` and its anchor (holds already; see § Not in this step); 6 flatten re-points or removes → ruling 11; 7 ids never reused (M4) → relied on, unchanged; 8 the writer omits a cleared ride → no writer in E2 (E7's UI); flatten follows it (ruling 11); 9 absent is byte-identical, no pin moves → ruling 2. Its QA checks (1)–(11) are covered by tests 7–11, 13 and 15–17.
- **L52** `ride` (Librarian, **staged** at `behaviour-library/_src/staging/L52-ride.json`, status IDEA, RISKY, sha256 `dff693a6b77870a1c2920c58cbcc5e98a42c7c901d649bf67d77b8621f046559`): an optional step ref on `effect.steps` items, default absent (absent plays exactly as today), `null` or any non-string is H2; `applies_to_kinds` `particles`, `stamp`, `flash`; one hop; a missing, disabled or Fit-dropped named step is `unknownRef` with the anchor fallback (citing CN-026 rule 5: the runtime can't tell a dropped id from a missing one); flatten removes a ride whose named step isn't on the rider's side; a lit stamp or particles rider carries its light; a screen flash doesn't move and gets no note; a non-rider kind's ride is ignored but kept. It ships in Librarian **rev 25 at E4** (with L50/L51), not in `behaviours.json` yet. L52 and CN-026 now agree on every rule this step uses.
- **Condition: CN-026 must be ACCEPTED by DSK before this step merges — met** (DSK's own status line above, 2026-11-16 11:59 London, sha256 `60e08878…`). If DSK amends it again, the kit is reissued to match. The CEO's ship-or-drop decision (open question 1) still applies.

## CN / format questions resolved (for DSK; report-only)
- `bend` on `straight` defaults to 0.8 (the catalogue default), so an untouched straight step arcs 0.8 tiles. A flat throw writes `bend: 0`.
- `bounce_points` are relative to the caster's cell (the L33 converter's `F`), not the target's.
- `look_ease`, already a look-ramp ease, now also eases travel. No new ease field is added.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/runtime/render/fx-path.ts` | new: `PATH` (incl. `riders`), `isTravel`, `readPath`, `pathAt`, `pathDots` | 50 | 54 |
| `src/runtime/render/fx-doc.ts` | paths per step, `ride` (riders only, circle flash only, no empty lookup, one hop, H2), notes; `path` on pieces | 8 | 12 |
| `src/runtime/render/fx-live.ts` | end points, offset after `placeStep`, heading into `pieceLook` | 7 | 11 |
| `src/runtime/render/fx-player.ts` | `FxPiece.path?` | 3 | 7 |
| `src/editor/effect/fit.ts` | `flatten` remaps or removes `ride` | 4 | 8 |
| `tests/runtime/render/fx-path.test.ts` | new, shipped (6 tests) | 41 | 45 |
| `tests/runtime/render/fx-travel.test.ts` | new, shipped (5 tests) | 49 | 53 |
| `tests/runtime/render/fx-travel-qa.test.ts` | new, shipped (3 tests): **G6** QA pin, sha256 `c55dd3ecbe0424eaa70956d1d4997ddf44ab682d1e5a8d554ead093e01d99a51` | 26 | 37 |
| `tests/runtime/render/fx-travel-qa2.test.ts` | new, shipped (3 tests): **G6** QA pin, sha256 `dff0ae27ce351075d1f7d6bb854a75a1ef531ac476eb5e19bd844fe906cb6083` | 18 | 21 |
Total ≤ 400 changed lines (proto 206). Caps follow STEP-TEMPLATE (proto + 4, QA S1); `fx-doc.ts` 12 and `fx-travel.test.ts` 53. Under 150 is fine for this step; the scope's ~300 estimate assumed a `placeStep` rewrite that the offset hook avoids.

## Interfaces to match (quoted exactly; bodies elided)
```ts
// src/runtime/render/fx-path.ts
export const PATH = { kinds: ["straight", "swerve", "bounce", "orbit"], bend: 0.8, bendMax: 2.5, radius: 1.05, radiusMin: 0.45, radiusMax: 3, turns: 1, turnsMin: 0.25, turnsMax: 4, hops: 8, dots: 32, eases: ["linear", "out", "in-out"], headStep: 1 / 32, riders: ["particles", "stamp", "flash"] } as const;
export type PathKind = (typeof PATH.kinds)[number];
export type Hop = { readonly dc: number; readonly dr: number };
export type FxPath = { readonly kind: PathKind; readonly at: number; readonly ms: number; readonly bend: number; readonly ease: string; readonly hops?: readonly Hop[]; readonly radius?: number; readonly turns?: number };
export type PathBad = { readonly code: "outOfRange" | "invalidValue" | "overCap"; readonly field: string };
export const isTravel = (kind: unknown): kind is PathKind => …;
export function readPath(s: Readonly<Record<string, unknown>>, at: number, ms: number): { path: FxPath | null; bad: PathBad[] };
export function pathAt(path: FxPath, t: number, a: P, b: P, tileW: number, tileH: number): { x: number; y: number; deg: number | null };
export const pathDots = (path: FxPath, n: number, a: P, b: P, tileW: number, tileH: number): P[] => …;
// (P = { readonly x: number; readonly y: number }, module-local)
// src/runtime/render/fx-player.ts: FxPiece gains `readonly path?: FxPath`
// fx-doc.ts, fx-live.ts, fit.ts: no signature changes
```
`path` keys are exactly `kind, at, ms, bend, ease`, plus `radius, turns` (orbit) and `hops` (a bounce with `bounce_points`). Never `from` or `part`, because E1 test 2 forbids those in pieces.

## Smoke lines
Unchanged: `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0.

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done (17 new; ship all four files byte-identical)
| Shipped file (under `handoff/steps/tests/step-ed-e2-travel-paths/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/render/fx-path.test.ts` | same path | `429cb2ce9024eecf9ae9394e10e59fe9dcfead1d5fc776698c6d4e6907164298` |
| `tests/runtime/render/fx-travel.test.ts` | same path | `fa049e53849894feb12f00f97562e4e16dde9b6986fe0df40309e579a6d7b312` |
| `tests/runtime/render/fx-travel-qa.test.ts` | same path | `c55dd3ecbe0424eaa70956d1d4997ddf44ab682d1e5a8d554ead093e01d99a51` |
| `tests/runtime/render/fx-travel-qa2.test.ts` | same path | `dff0ae27ce351075d1f7d6bb854a75a1ef531ac476eb5e19bd844fe906cb6083` |

`tests/runtime/render/fx-path.test.ts`:
1. "E2 readPath: only straight/swerve/bounce/orbit travel; defaults bend 0.8, linear, orbit 1.05 × 1 turn; at and ms are the step's start and len"
2. "E2 readPath: out-of-range values clamp with outOfRange, a bad type plays the default; bounce_points keep 8 (overCap once) and skip bad entries (invalidValue)"
3. "E2 pathAt: every kind starts on the caster and lands on the target; before its start it waits, after len it holds on the target"
4. "E2 pathAt shapes: straight arcs by bend tiles at the middle (+ is up for a rightward throw), swerve is one S, eases out and in-out, bounce hops per leg by length, orbit corkscrews"
5. "E2 pathAt heading: degrees along the path (0 = east, 90 = south, screen y down); null when it does not move; the same input gives the same output"
6. "E2 pathDots (the designer's still path): n evenly timed points from caster to target, clamped to 2…32, NaN gives 2"

`tests/runtime/render/fx-travel.test.ts`:
7. "E2 converter: travel steps get path {kind, at, ms = len (not hold), bend, ease}; other kinds get none; bad path values are noted per step; a disabled step is not noted"
8. "E2 ride (M-B6, CN-026): a particles, stamp or circle flash step with ride = a travel step's id takes that step's own path and timing (one hop); an empty, unknown, self, non-travel, disabled or past-12 target is unknownRef, a non-string is invalidValue; ride on any other kind or a screen flash is ignored"
9. "E2 play: a straight step flies caster → target on the 30 ms pose grid, turns to its heading (look bucket, 8 in lite: 90° = n4) and holds on the target through hold_ms" (also: a `front-unit` piece moves by `oy` and keeps its unit's `c`/`r`; a non-travel rider never turns)
10. "E2 absent = today: a piece without path never moves or turns (hand-built LiveFx), and with no target unit or cell a path plays at its anchor"
11. "E2 riders move with the path (particles centre); flatten remaps ride to the moved step's fresh id and removes a ride naming no step of its side"

`tests/runtime/render/fx-travel-qa.test.ts` (QA's pin, G6):
12. "E2 QA: the travel turn adds the step's own angle (ruling 8: (angle ?? 0) + deg)"
13. "E2 QA: a ride naming its own step is unknownRef and the piece plays at its anchor (ruling 10); on a travel step ride is ignored (ruling 16)"
14. "E2 QA: shapes scale with the world's tile size: bend and orbit radius × tileW, bounce dc × tileW and dr × tileH (ruling 5)"

`tests/runtime/render/fx-travel-qa2.test.ts` (QA's r3 pin, G6):
15. "E2 QA r3: ride resolves to the FIRST step with that id (ruling 10, CN-026 rule 1)"
16. "E2 QA r3: on a non-rider kind or a screen flash a ride of any type is ignored, with no note (ruling 16, CN-026 rule 1b)"
17. "E2 QA r3: an empty ride is unknownRef even when a step's id is empty (CN-026 rule 3; like connect_step \"\")"

**G6 (QA pin adopted).** QA's `tests/runtime/render/fx-travel-qa.test.ts` (QA review `docs/qa/step-ed-e2-review.md` `039de877…`, F1–F3; `refs/cmp/ede2-qa-fix-a` `e1f7428d`, tree `f404b329`, parent r1 `d2104e0c`, QA sha256 `24773813776906959bbaeeab044bbd998e2364b5e9f5d04d7e9a4743bb9564b5`, 26 lines) is rebased onto r2 and shipped. One change: test 13's self-rider is a `stamp` (was a `straight`), with a `straight` self-ride added that keeps its own path and is not noted, because ruling 16 (L52) ignores `ride` on travel kinds. CN-026 rule 3 (self → `unknownRef`) still holds for every kind that can ride. Cap 37 lines (QA's ≤ 37). The floor rises 778 → **781**.

**G6 (QA r3 pin adopted).** QA's `tests/runtime/render/fx-travel-qa2.test.ts` (QA review `docs/qa/step-ed-e2-review.md` `49c1e3c5…`, M2/M3; `refs/cmp/ede2-qa-r3-fix-a` `cf4c1fda926491c5a28b530dc2caead23eb58659`, tree `a8941742`, parent r3 `9e6e5a08`, noreply), sha256 `dff0ae27ce351075d1f7d6bb854a75a1ef531ac476eb5e19bd844fe906cb6083`, 18 lines, shipped unchanged with its 1-line `fx-doc.ts` guard (`typeof ride === "string" && ride !== ""`). Cap 21 lines. The floor rises 781 → **784**.

You may add tests. The hand-back lists each shipped file's sha256, unchanged.

## How a planted bug is caught (EA plants 41/41, `ede2-plants.py`, run by `proto-check.sh` / `qa-plants.sh --plants-file` against the four shipped files)
| # | Plant | Caught by |
|---|---|---|
| 1 | path frozen at its start (no travel) | tests 9, 10, 11 |
| 2 | non-travel kinds get a path | tests 1, 7, 8, 13 |
| 3 | heading never applied | tests 9, 12 |
| 4 | non-travel riders turn too | test 9 |
| 5 | path ms = len + hold | tests 7, 9, 10 |
| 6 | path at = 0 | tests 7, 8 |
| 7 | bend default 0 | tests 1, 2, 7, 8 |
| 8 | no clamp | tests 2, 7 |
| 9 | out of range silent | tests 2, 7 |
| 10 | disabled steps noted | test 7 |
| 11 | bounce keeps 9+ points | test 2 |
| 12 | bounce keeps a non-integer point | test 2 |
| 13 | bend sign flipped | tests 4, 5, 6, 14 |
| 14 | swerve is a plain arc | test 4 |
| 15 | look_ease ignored | test 4 |
| 16 | bounce legs share time equally | test 4 |
| 17 | bounce hops down for a negative bend | test 4 |
| 18 | orbit radius never shrinks (misses the target) | test 3 |
| 19 | orbit_turns ignored | test 4 |
| 20 | overshoots instead of holding on the target | tests 3, 9 |
| 21 | off the 30 ms pose grid | test 9 |
| 22 | ride ignored | tests 8, 9, 11, 13 |
| 23 | unknown ride not noted | tests 8, 13 |
| 24 | ride onto a non-travel step accepted | tests 8, 13 |
| 25 | flatten leaves ride on the old id | test 11 |
| 26 | flatten writes `null` for a ride naming no step of its side (H2 on re-read) | test 11 |
| 27 | a cell target (`LiveFx.at`) is not a landing point | test 10 |
| 28 | caster and target swapped | tests 9, 10, 11, 12 |
| 29 | unit-band pieces not offset | test 9 |
| 30 | a still piece gets heading 0 | test 5 |
| 31 | pathDots uncapped | test 6 |
| 32 | travel with no target (aims at the caster) | test 10 |
| 33 | a non-string ride is `unknownRef` (not H2 `invalidValue`) | test 8 |
| 34 | two hops: a rider follows the ridden step's own `ride` | tests 7, 8 |
| 35 | ride honoured on every kind (not only `particles`/`stamp`/circle `flash`) | test 8 |
| 36 | a `null` ride read as absent (not H2) | test 8 |
| 37 | `flash` cannot ride at all | test 8 |
| 38 | a disabled travel step can still be ridden (F4a) | test 8 |
| 39 | flatten keeps a dangling ride, so it binds to a base step with that id (F6; must be absent) | test 11 |
| 40 | flatten leaves the `ride` key present (`undefined`) instead of removing it | test 11 |
| 41 | a screen flash (`flash_shape` absent or `"screen"`) rides too | test 8 |
All 41 fail the shipped tests on the proto's needles (the tests column was measured per plant). A build with different code needs its own needles (QA rewrites them per build, as at E1).

**QA's plants: 19/19 live + Q14 retired** (Q14, own path wins over ride, is an equivalent mutant under ruling 16: a step that can ride never has its own path) on EA's r2/r3 needle rewrite of QA's r1 20 (Q15, Q17, Q19 re-expressed). QA's r3 file `docs/qa/qa-runs/effect-designer/e2/r3/probes/qa-ede2-plants-r3-fix.py` (sha256 `ab2ddb51…`) adds Q21–Q26; the qa2 pin (tests 15–17) adds the three that r3 missed or allowed: **Q21** (ride resolves to the last step with the id), **Q23** (a non-string ride on a non-rider kind is noted) and **Q26** (an empty ride binds to a step with id `""`). On r4: **QA 25/25** caught by assertion against the four shipped files.

## Example
A fireball step `{id: "a", kind: "straight", seconds: 0.6, bend: 0, hold_ms: 300}` in an effect with `connect_step: "a"`, cast by a unit at (2, 2) on a target at (2, 5) with 16 px tiles: the converter gives the piece `path {kind: "straight", at: 0, ms: 600, bend: 0, ease: "linear"}` and `ms` 900. At 0 ms it draws at the caster (x 32, y 32), at 300 ms halfway (y 56), and at 600 ms on the target (y 80), where it stays until 900 ms. It faces south the whole way (look `r4`, `n4` in lite). The hit lands at 0.92 × 600 = 552 ms, just before arrival (without `connect_step` it would fall back to the last step: 0.92 × 480 = 442 ms). A sparks step with `ride: "a"` and `start_mode: "with-last"` drags its spark cloud down with it.

## Decisions note: what to name
`PATH` values; the left-normal sign; leg time by length; the orbit radius envelope `4e(1−e)`; the heading chord (`headStep`); clamping `u`; `Math.round` to px; the note order of ruling 7; that the offset is applied after `placeStep` (no `placeStep` signature change); and how `ride` resolves (riders `particles`/`stamp`/`flash` only; the first step with that id, any position, must be a travel step in the first 12; one hop; a `flash` only when `flash_shape` is `"circle"`). Runtime bounds (law 13): `pathAt` keeps no state and no cache; `pathDots` returns at most 32 points; at most 8 hops per path.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 784 passing** (767 + 17) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto: 784/0; deps 111 modules / 355 deps; `check:law OK (src)`.)
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`.
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`.
- [ ] `node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. A `LiveFx` without `path` is byte-identical.
- [ ] `git diff 77552a38 --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty. Pins: `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`. If a core-types change seems needed, **stop and report**.
- [ ] All four shipped test files are byte-identical to the sha256s above.
- [x] Merge only after DSK has ACCEPTED CN-026 (see § CN-026 / L52): **met**, DSK 2026-11-16 11:59 London, sha256 `60e08878…`.
- [ ] Each file within its cap; ≤ 400 changed lines in total.
- [ ] No `Math.random`, `Date`, timers or `Card`/`Deck` identifiers; no hp/mana/cost in `src/`. No UI files. `src/runtime` imports nothing from `src/editor`.
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
767 → **784** (17 new tests: 11 EA + 3 QA r1 pin + 3 QA r3 pin, G6). Kit tests under `handoff/` are not run on main until merge.

## Perf (phone floor)
The draw, particle and light caps are unchanged (60 / 120 draws, 48 particles, 2 lights per effect), and `path` adds no pooled state. EA probe (desktop, not shipped): 100 effects × 12 pieces, all travelling, scene p50 went 0.6 → 1.4–1.6 ms, measured against the same doc with `path` stripped. That is the cost of placing 1,200 moving pieces when only 120 can draw. Real casts use ≤ 12 steps, so it is far under the 18.3 ms p95 phone line. QA may add a phone run on the S0 page's `path` stub after merge.

## Not in this step (carries, with their target step)
- A Travel beat in `beatOf`/Fit (ruling 14) → **E4**, with carry (d).
- E1 carries (d), (e) and (f) → **E4**, as the E1 doc says. M-B2 impact frames and the L50/L51 rev → **E4**.
- `trace row cone reel scratch` travel, drawn paths (CN number reserved by DSK) → **B-2** "Draw the spell".
- World-anchored spark trails, where sparks shed along the path instead of the whole cloud moving → later bold slice (needs a field; RISKY).
- A unit-band travelling piece keeps its unit's sort key (ruling 4); depth by flight position → later (only matters for long `front-unit` throws; use `air`).
- `lock: "free"`, `pierce`, `release: "split"`, and `smear_tiles: null` = path length → later.
- Fit dropping a ridden step already leaves the rider `unknownRef` at its anchor (CN-026 rule 5: the id is gone; the trim line says a step went). A Fit-level test of it → **E4** with the part/beat model.
- The writer omitting a cleared `ride` (CN-026 rule 8: absent, never `""` or `null`) → **E7** (the designer UI is the first writer).
- (a), (c), (g) and the deps rule stay open as in the E1 doc.

## Carries (from the E1 merge-time doc `2961f015…`)
E1's "Travel-beat handling and the projectile path → E2": the projectile path is done here. The Travel **beat** goes to E4 (ruling 14). (d), (e) and (f) stay E4. (a), (c), (g) and the deps rule stay open. This step adds no new QA carries.

## Out of scope
Game rules (HP, mana, cost) and any sim or core change. Any editor UI. CN acceptance is DSK's.

## Do not touch
`src/types/core-types.ts`, `src/core/**`, `src/sim/**`, `src/fx/**` (BTF hit timing, scope M5), `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/**`, `tools/painter-proto/**`, `tools/ui-shell/**`, the scene fence test, the render fence test, every E1 shipped test.

## Open questions
1. (EA → CEO/DSK) `ride` is a new step field (rulings 10, 15, 16). DSK has ACCEPTED it as CN-026 and the Librarian has staged L52 for rev 25 at E4. Ship it in E2 that way, as E1 did with CN-020/021, or drop it and keep only the `bounce_points` chaining? It's off by default and absent means today.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 784 passing and 0 failing**. Paste the summary line, the smoke line, and the sim and stress lines into HANDBACK.md.
- All four shipped test files are **byte-identical** to the sha256s above.
- The bundle is `77552a38..step/step-ed-e2-travel-paths-r<N>` and passes `git bundle verify`. Total changed lines ≤ 400. Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
On branch `step/step-ed-e2-travel-paths-r<N>` (base `77552a38`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). Run `git bundle create step-ed-e2-travel-paths-r<N>.bundle 77552a38..step/step-ed-e2-travel-paths-r<N>`, then `git bundle verify`. Upload the bundle and HANDBACK.md to the CEO's Drive. Push nothing to GitHub.
