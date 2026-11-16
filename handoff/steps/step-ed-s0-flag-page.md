# step-ed-s0-flag-page: Effect Designer spike flag page. One device page with kill-switch URL flags `?bold=<token>&seed=<n>`, 2-minute A/B in 20 s OFF/ON blocks, a per-idea red/green budget line, a same-seed hash check, a canvas/heap watch at 160 MB, ten seeded stub loads in engine order, and the colour-stop swatch panel hook (tools only; no `src/` change; no CN; no format change)

Step id: step-ed-s0-flag-page          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`71b1a990`** (`71b1a9909343db2b5324275388abf1cb959f7d7d`, tree `fb57527`, main: docs-only QA commit on top of the G2b merge `d982155b`, 742/0). Branch: `step/step-ed-s0-flag-page-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-ed-s0-flag-page-r<N>.bundle 71b1a990..step/step-ed-s0-flag-page-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-ed-s0-flag-page/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: G2b (merged, main `d982155b`) and G5a/G5b (the device-page builder, `check.ts`, the G5b canvas formula and TEMPLATE). No file overlaps any open step.
Read first: BUILD_GUIDE.md §0 (§0.6 helpers), §2 (engine law), §6 (green), §7; QA's spec `docs/qa/step-ed-s0-spec.md` (sha256 `a0424d85a6a98be5d36eaa416211e56ac9462b1dd085d4891e5164e0c64a2820`); the scope `/workspace/share/effect-designer/scope.md` §8, §10, §12 (briefed as r4 `e77b396e`; the share copy is now `cb3cba1e`, the r4 APPROVED header plus the 01:41 style-id ruling, with §8/§10/§12 unchanged for S0); this file.
Kit: kit-1 r2, 2026-11-16. Engine Architect. Proto `/tmp/eds0` branch `eds0`, head `c5c24562` (`c5c245626912d392234efb47e14bd46e1a7da907`, tree `3ce7551d`, rebased onto `71b1a990`; commits: product slice `9518e891`, QA pin `106c004f` (tree `e5879fa7` = QA's merge-tree), run sheet `c5c24562`; G-TileEngine noreply author and committer): 8 files, +407/−4 = 411 changed lines (`src/` 0); green 752/0 (742 + 7 + 3); EA plants 12/12, QA extras 7/7. r1 was `48ff1479` on `d982155b` (375 lines, 749/0). Bundle backup `/workspace/scratch-ea/effect-designer/step-ed-s0-proto-r2.bundle` (sha256 `d60b1e53…`).
Carries: none filed. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) unchanged.
Colour stops: UX `ux/design-notes/effect-ramps/ramps.json`, sha256 `700f5e13903d33bab8b618070d0eb82cf4efef4cb27734b40460cddac1ce959b` (marked APPROVED: CEO 2026-11-16 01:45 London). Stops unchanged from the earlier `55a74b3c` / `79b4a64b` versions.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Make the bold-idea test method (scope §10, QA spec §1) something the CEO can run on his phones. Before any bold idea gets a slice, it must show phone numbers. Today there is no way to switch an idea on and off within one visit and compare. After this step the existing device page takes `?bold=<token>&seed=<n>`. Any `?bold=` (even `off`) turns the visit into a 2-minute A/B run on the stress scene: OFF 0–20 s, ON 20–40, OFF, ON, OFF, ON. The HUD shows the block, the seconds left, off and on p50/p95/max/dropped/over-50/frames, the on−off p95 delta against the idea's budget, the canvas and heap peaks, the hash state and a red/green line. At 120 s it says DONE, runs the same-seed hash check (an in-page second pass) and freezes a copy-paste block. Without `?bold` the page is exactly today's 60 s run. No bold feature is built: each token turns on a seeded **stub load** under `tools/device-page/` that mimics the frame load inside the existing caps.

## Rulings
All rulings are EA (this kit) on QA's spec (`a0424d85`) and the approved scope (CEO answers 01:34; Q8 Yes = one flag device page, `?bold=<token>&seed=<n>`, failing closed on unknown tokens). Every one is pinned by `tests/tools/ed-s0.test.ts`.
1. **Flags** (spec §1.1): `?bold=` is a comma list. Trim whitespace, ignore empties, count a repeat once. Absent, empty or `off` = every idea off. Tokens are exact lowercase: `caster, breed, rhythm, export, tiers, path, linger6, react, fusion, living` (engine order, CEO Q5 a), and they play in that order. An unknown token (including `Breed`, `linger`) is a NOTICE line and stays off. `off` mixed with tokens is a NOTICE and everything stays off (fail closed). `?seed=` must match `^\d+$` and be ≤ 2147483647; absent = 0; anything else (`-1`, `1.5`, `1e3`, empty, over 2³¹−1) is a NOTICE `… playing seed 0`, never clamped silently (not the G5b `?ps` nit). More than one token, an unknown token or `off`-mixed = NOT SCORED (combined stress). A run is also marked NOT SCORED unless the 60 fps cap is on and lite is off.
2. **Mode switch**: the A/B visit starts on the presence of `bold` in the query, so `?bold=off` is the baseline visit. With no `bold` key the page keeps today's world, zoom ramp, 60 s window, rotate prompt and HUD byte-for-byte (the only edit on that path is the canvas line, which now calls `canvasMb()`, the same formula).
3. **A/B scheduler** (§1.2): `blockAt(visitMs)` is a pure read on the page's existing host-gap visit time (`performance.now() − t0`, the HostEnv wrapper path). It never ticks and starts no timer. Every frame gap is pooled into OFF or ON by the block it landed in (`createAB`). After 120 s nothing more is pooled. "Run again" and the cap button make a fresh `createAB()`, so the plan restarts at OFF. In A/B mode there is no rotate prompt (a rotate must not sit inside a compared block).
4. **Stress scene** (§1.3): in A/B mode the four looping effects are `stressDocs()`: each at the per-effect caps (a light-steady sprite step, plus two particle steps of 24 = 48 particles, 2 lights), with ramp keys fire/frost/holy/venom from the approved ashroad@3 stops (passed as `world.style.ramps`). 40 moving units, fractional walk offsets, the 64×64 map. Zoom is fixed at 1 and the pan repeats every 20 s, so each block sees the same camera path. DPR is the phone's own (the readout prints it). The page never upsamples; a phone at 2.625 runs at 2.625.
5. **Budget line** (§1.4, scope §10): `verdict()` is red when on p95 − off p95 > the idea's ms (caster 0.5, breed 2.0, rhythm 0.3, export none, tiers 1.0, path 2.0, linger6 1.5, react 1.0, fusion 2.0, living 2.5); when either pooled p95 > 18.3; when any frame > 50 ms; when dropped (>25 ms) > 1 % of all frames; when canvas MB > 160; when heap MB > 160 (only when `performance.memory` exists, else `heap n/a`); or when the hash is FAIL. Red fails the idea; nothing in `src/` throws. The 160 is labelled as the G5b device cap.
6. **Canvas and heap** (§1.6): `canvasMb(backendBytes, w, h)` = backend offscreen bytes + the main canvas (w·h·4), used by both the old path and A/B. Heap is shown beside it and never added. Both peaks go into the readout. The export bake buffer is heap, so it shows in the heap line and on its own `export bake MB` line.
7. **Hash** (§1.5): at DONE the page runs `hashPass()` twice, each with a fresh scene link, over the fixed sim times 0, 5, … 115 s (24 samples, fed in as values: no clock is made or read). The fingerprint is the whole-map scene output (standing, overlays, dots, lights, stub notes) of the same `boldWorld()` builder the live frame uses. It is never the HUD, and it is not camera-culled (a culled draw list hid off-screen stubs in the proto's first probe). Any difference = FAIL = red. For `export`, the hash is also FAIL unless two consecutive bakes are byte-equal. The readout says `in-page 2nd pass` and prints a combined `#hash`, so two visits can be compared too.
8. **Stubs** (§2–§3): `applyStubs(on, blockOn, base, ctx)` returns the **same base array** when the block is OFF or no token is set. Each stub is seeded only through `hash32(seed, …)` and stays inside 48 particles / 2 lights / 12 steps per effect (`capDoc` notes every trim; none are silent). Each keeps one `LiveFx` per cast with unique ids. Hits stay on a unit (`target`). Stubs import nothing from `src/fx`. In short: caster = nearest ramp key per caster (writes keys only, no hex); breed = 3 parents → 6 seeded children each frame, one plays as `e0`; rhythm = ±30 ms seeded nudges snapped to the 30 ms grid; export = an offline bake of `e0`'s particles into a 624×624×16-frame buffer (13 tiles at k = 3, the 480 ms loop on the 30 ms grid, 23.4 MB), one frame per live frame, released in OFF blocks; tiers = a plain int 0–2 (anything else throws), all three strengths built each frame, tier 2 plays with hit-stop 100 ms, shake 2 and shake_ms 120 (inside FEEL's caps); path = 16 points on a 1/8-tile grid, 3-tap smoothed, sampled on the 30 ms grid, placement only; linger6 = a fixed 64×64 one-byte tag map (grass/water), a scorch or steam step added to the same doc; react = a table lookup (`fire+frost → steam`) over nearby unit pairs, suggestion text only (there is no steam stop, so the doc is unchanged); fusion = two effects on one cell in one beat become one pre-baked `e0+e1` doc (capped); living = a visual-only spread from `e0`'s target in a fixed 64-slot `Int32Array`, capped at min(64, map cells), drawn as ground overlays, empty when off, with a `VISUAL ONLY` HUD line.
9. **Swatch panel hook** (scope Q3 a): `tools/device-page/bold-swatch.ts` holds UX's fire/frost/holy/venom stops (6 each) for `btf-ashroad@3` and `btf-moonlit@4` (the EA 01:41 style-id ruling; @3 is lane@3). Label: `approved 2026-11-16, style ids btf-ashroad@3 / btf-moonlit@4 (pending engine data)`. A verbatim copy of ramps.json (`700f5e13…`) is test data at `tests/fixtures/ed-s0/ramps.json`, and the test pins the TS table to it. In A/B mode a "colour stops" button opens a small panel of 8 rows × 6 boxes. Nothing is written to a style file.
10. **Export audit** (§6): the gh-pages tree is only what `page.ts` loads. The test asserts the three bold modules ship, and that no `tests/`, `handoff/`, `handback/`, `ux/`, `docs/`, `.json` data, `src/editor`, effect-designer UI, devtools/`DebugPort`, source maps, server, builder or checker ships. `check()` also passes on that tree (unreached files would fail it).

## Rulings (added at QA review)
11. **G6 adopt (QA review `docs/qa/step-ed-s0-review.md` 2e7fc05d):** QA's `tests/tools/ed-s0-qa.test.ts` (from `refs/cmp/seds0-fix-a` 0242425a) ships byte-identical; it pins the exact budget line (delta == ms stays green), the unchanged no-`?bold` 60 s path, and NOT SCORED while lite is auto or the cap is off. Floor 752. The TEMPLATE card ships byte-identical with the header line, the shared budget line, "cap on, lite off first" and the stub caveats. Block timing stays on host visit time (spec §1.2); the hash is on sim time.

## Files to create or change (and nothing else)
Size: the proto changes 411 lines (+407/−4) in 8 files. **Over 400, with a reason (EA ruling 11):** the extra 36 over the 375-line product slice are QA's G6-adopted pin test (32) and QA's run-sheet caveats in TEMPLATE.md (4); no product line grew. Hard cap 420.

| File | Base → proto lines / cap (changed lines) | Rulings |
|---|---|---|
| `tools/device-page/bold.ts` | 0 → 74 / 90 | 1, 3, 5, 6, 7 |
| `tools/device-page/bold-stubs.ts` | 0 → 118 / 130 | 4, 8 |
| `tools/device-page/bold-swatch.ts` | 0 → 13 / 20 | 9 |
| `tools/device-page/page.ts` | 45 → 68 / 40 | 2–7, 9 |
| `tests/tools/ed-s0.test.ts` | 0 → 80 (shipped) | all |
| `tests/tools/ed-s0-qa.test.ts` | 0 → 32 / 37 (shipped, QA G6 pin, sha256 `c29c769ede157e9612d321e37d3358a826546786d257d05583dc64728ac4a538`) | 11 |
| `tests/fixtures/ed-s0/ramps.json` | 0 → 49 (verbatim UX copy, sha256 `700f5e13…`) | 9 |
| `docs/qa/device-runs/TEMPLATE.md` | 64 → 78 / 14 (shipped: append the S0 A/B card exactly; the five-row log stays) | spec §7, 11 |

Full sha256 of every new and changed file: `/workspace/scratch-ea/effect-designer/step-ed-s0-push-sha256.txt`:
```
192c098e134aa9c07752fed6c275f476d40f999da1cfc736e140608957f45d8a  docs/qa/device-runs/TEMPLATE.md
700f5e13903d33bab8b618070d0eb82cf4efef4cb27734b40460cddac1ce959b  tests/fixtures/ed-s0/ramps.json
c29c769ede157e9612d321e37d3358a826546786d257d05583dc64728ac4a538  tests/tools/ed-s0-qa.test.ts
a25b8928311946398fe76441e8906528ad2ef89db3785bd81d254739685b35ad  tests/tools/ed-s0.test.ts
600c0d07bcca99fb51d86c115bfedd97030603cbb25a6d2c5561afb3cb77b80e  tools/device-page/bold-stubs.ts
123694c7349686b7e1ce081b4ee54da7e51a480fb42b2082eef69f02146c02be  tools/device-page/bold-swatch.ts
046595381d9be49f7093fe7e0529b719f611d05decee243ded0d9e127638801c  tools/device-page/bold.ts
867d487c5814a7b5e5ef4cd338ef2a9b599cd1574c9eccecfbed334177098b46  tools/device-page/page.ts
```

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// tools/device-page/bold.ts (pure: no DOM, no timers, no wall time)
export const IDEAS: readonly { token: Token; ux: string; name: string; ms: number | null }[]; // engine order, budgets above
export const SHARED = { p95: 18.3, overMs: 50, dropMs: 25, dropShare: 0.01, mb: 160 } as const;
export const AB = { blockMs: 20_000, blocks: 6, visitMs: 120_000, hashEveryMs: 5_000 } as const;
export function parseFlags(bold: string | null, seed: string | null): Flags; // { present, on, unknown, seed, notices, scored }
export function blockAt(ms: number): Block;                                 // { i, on, label "OFF 1/6"…, leftS, done }
export function pool(gaps: readonly number[]): Pool;                         // { p50, p95, max, dropped, over50, frames }
export function createAB(): { add(visitMs: number, gap: number): void; readonly off: number[]; readonly on: number[] };
export const canvasMb = (backendBytes: number, w: number, h: number): number => …;
export function verdict(v: { ms: number | null; off: Pool; on: Pool; canvasMb: number; heapMb: number | null; hash: Hash }): Verdict;
export const hashPass = (frameAt: (tMs: number) => unknown): string[] => …;
export const hashCheck = (a: readonly string[], b: readonly string[]): Hash => …; // "PASS" | "FAIL" ("pending" before DONE)
export function readout(r: { … }): string;
// tools/device-page/bold-stubs.ts
export function stressDocs(hero: Sheet, clip: Clip): LiveFx[];
export function applyStubs(on: readonly Token[], blockOn: boolean, base: readonly LiveFx[], ctx: Ctx): Out; // OFF → { effects: base (same array), … }
export function createBake(): { step(seed: number, doc: LiveFx | undefined, on: boolean): void; readonly mb: number; readonly peakMb: number; readonly bakes: readonly string[]; readonly equal: boolean };
// tools/device-page/bold-swatch.ts
export const SWATCH: { status: string; styles: { "btf-ashroad@3": …; "btf-moonlit@4": … } };
export const panelRows = (): { style: StyleId; key: Key; stops: readonly string[] }[] => …;
```

## Tests that prove it is done (`tests/tools/ed-s0.test.ts`, 7 tests)
1. `ED S0 flags …`: absent/empty/off; order, trim and dedupe; typo `lingr6` fails closed with a notice; `Breed`/`linger`/`off,breed` stay off; bad seeds give a notice and play 0; 2147483647 is kept; combined = not scored.
2. `ED S0 A/B …`: labels at 0, 19 999, 20 000 … 119 999; seconds left; DONE at 120 s; pooling by block (600/600); a fresh run starts empty at OFF.
3. `ED S0 HUD …`: green under budget; each red cause on its own; the canvas line counts the main canvas; DONE readout shows `heap MB peak n/a` and RED.
4. `ED S0 hash …`: two same-seed passes PASS for all ten tokens, on a real `createSceneLink` world; every token except export/react moves the fingerprint; a `Math.random` dummy is FAIL; flags off are seed-independent; L1 `04b5748d / 6865666d / 846e2223` unchanged; OFF blocks return the base array.
5. `ED S0 stubs …`: each token's dummy is distinct; caps, unique ids and unit hits for every token × 3 seeds; breed 6 kids / 4 live; fusion 3 live with `e0+e1`; living ≤ 64 and exactly 64 at worst; tag map 4096; path 16 points on 1/8; tiers reject 1.5/−1/3/NaN and stay in caps; rhythm on 30 ms; bake equal, < 160 MB, released when off.
6. `ED S0 law …`: no timer, wall time, rAF or `Math.random` in the three bold modules; no `hp`/`mana`/`cost`/`src/fx`; `page.ts` has exactly two `requestAnimationFrame(` calls (the env wrapper's window call and the one-shot start kick), one `createClock(`, one `createDriver(`, and the canvasMb line.
7. `ED S0 export audit and swatch hook …`: the build/check audit above; the swatch table equals the ramps.json copy; label; 8 rows × 6 stops.

## How a planted bug is caught (QA spec §5, the 12 S0 kill tests)
EA ran each plant on a copy of the proto (`eds0-plants.py`, result `eds0-plants-result.txt`): 12/12 caught.

| # | Plant | Mutation used | Caught by |
|---|---|---|---|
| 1 | Flag ignored | `applyStubs` always returns base | stubs (distinct dummies) |
| 2 | Unknown token fails open | drop the unknown-token notice | flags |
| 3 | A/B block mislabelled | `on = i % 2 === 0` | A/B, HUD |
| 4 | Scheduler second clock | `setInterval` in `bold.ts` | law (the run also hangs; a printed fail counts) |
| 5 | HUD does not go red | budget × 10 | HUD |
| 6 | Hash mismatch not flagged | `hashCheck` always PASS | hash |
| 7 | Second rAF loop | a looping `requestAnimationFrame` in `page.ts` | law |
| 8 | Stacked LiveFx | fusion keeps both sources plus the fused doc | stubs |
| 9 | Unbounded dummy | living cap and fixed slot removed | stubs |
| 10 | Canvas watch drops the main canvas | `canvasMb` without w·h·4 | HUD |
| 11 | Flags off not stable | OFF returns a copy of base | hash |
| 12 | Wall noise | `Math.random` in breed's child seed | hash, law |

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with at least 752 tests passing (742 + the 7 new + QA's 3) and none failing, cancelled, skipped or todo; typecheck, lint, deps, check:state and check:law each exit 0. (Proto: 752/0; deps 107 modules / 342 deps, 0 violations.)
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed` (9 lines, as on the Base; not "21").
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; `node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 (`src/` is untouched).
- [ ] `git diff 71b1a990 --stat -- src package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh` is empty; pins `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`.
- [ ] `node tools/device-page/build.ts <empty folder>` then `node tools/device-page/check.ts <folder>` prints `check ok` on the committed head (proto: 35 files, including `tools/device-page/bold.js`, `bold-stubs.js`, `bold-swatch.js`).
- [ ] The three shipped files (both test files, TEMPLATE.md) and the ramps.json copy are byte-identical to the sha256s above.
- [ ] Each file within its cap; at most 420 changed lines in total (the proto is 411, ruling 11).
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Proto evidence (EA, box Chrome headless, report-only)
All 12 URLs (`?bold=off`, each token with `seed=7`, and `?bold=breed,lingr6&seed=-4`) ran the full 120 s in 12 pages at once. All 12 gave 0 page errors, DONE and hash PASS. Export showed `bake MB 23.4 peak 23.4 (QA re-measure; first probe printed 23.8) · bakes equal yes`, and the typo visit showed both NOTICE lines. Every line was RED (p95 19–20 ms, frames over 50 ms), because 12 pages shared one headless box. That is not a phone number. The phone numbers are the CEO's S21 Ultra / Red Magic runs after RaiKynn's typed OK for the one gh-pages publish.

## Not in this step (carries, with their target step)
- **Real bold features** (E1–E10, CN-020 onward): stubs only. A green S0 line opens an idea's slice; it does not prove it.
- **Tiers delta is light**: the base docs are already at the 48/2 caps, so tier 2 adds only the punch fields and the 0/1/2 builds. If the S21 delta reads ~0, QA may ask for a tier-0 base (a ruling, not a code change here).
- **Living "distinct ramp"**: the spread uses a distinct tile frame and a VISUAL ONLY label. A ramp look on overlays waits for E9's ramp chips.
- **Caster colour source** is a seeded stand-in per unit, not a sprite read (E9).
- **Export bake** rasterises `e0`'s particles at k = 3 into an effect-cell sheet, not the full backing store and not the real renderer (E10 renders with the same renderer). It does report the peak MB.
- **Forcing DPR 3** is not a URL flag (spec §8 gap). The readout prints the phone's DPR and backing size.
- **G2b N2 named worst-case fixture** stays open; S0's worst case is `stressDocs()` + seed in the readout.
- **`tools/` typecheck**: `page.ts` passes `tsc -p tools/tsconfig.json` (EA ran it), but green does not run that config (Base behaviour, P-list).

## Out of scope
Any `src/` change (no R1–R5, no CN readers). Raising FX budgets. Game rules (the tiers stub takes a plain int; no stat names). A node editor, WebGL, sound, sprite-clip writing. A gh-pages push (one CoS push of a checked build, only after RaiKynn's typed OK). Editing `scope.md`, QA's spec, painter-proto or ui-shell.

## Do not touch
`src/**`, `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/**`, `tools/device-page/build.ts`, `check.ts`, `index.html`, `tools/pixel-suite/**`, `tools/serve.ts`, every existing test.

## Kit files to push
All under `/workspace/tileengine` once EA moves them in after QA's OK (not yet copied): `handoff/steps/step-ed-s0-flag-page.md` (this file), and the shipped files under `handoff/steps/tests/step-ed-s0-flag-page/` (`tests/tools/ed-s0.test.ts`, `tests/tools/ed-s0-qa.test.ts`, `tests/fixtures/ed-s0/ramps.json`, `docs/qa/device-runs/TEMPLATE.md`). The full list with sha256 goes to CoS after "OK TO SEND".

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 752 passing and 0 failing**. Paste the summary line, the smoke line and `check ok` into HANDBACK.md.
- The four shipped files are **byte-identical** to the sha256s above.
- The bundle is `<Base 71b1a990>..step/step-ed-s0-flag-page-r<N>` and passes `git bundle verify`. Total changed lines ≤ 400. Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
On branch `step/step-ed-s0-flag-page-r<N>` (base `71b1a990`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), run `git bundle create step-ed-s0-flag-page-r<N>.bundle 71b1a990..step/step-ed-s0-flag-page-r<N>` and then `git bundle verify`, and upload the bundle and HANDBACK.md as above. You push nothing to GitHub.
