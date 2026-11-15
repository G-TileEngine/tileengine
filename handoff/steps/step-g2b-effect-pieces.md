# step-g2b-effect-pieces: pixel_scale reads null and "1"–"6", additive unit-layer pieces draw add, lights sit on scaled art, particle spreads and a lite half count, hit-white on squashed units, particles in their piece's band (post-34 polish plan, slice G2b; no CN; no format change)

Step id: step-g2b-effect-pieces          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`cbb326ef`** (`cbb326efba97a9833becd168ca1b72ddaca8b245`, tree `376675b5`: main after the G1 merge (PR #51) and its step-doc update). Branch: `step/step-g2b-effect-pieces-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-g2b-effect-pieces-r<N>.bundle cbb326ef..step/step-g2b-effect-pieces-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-g2b-effect-pieces/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: G1 (`cbb326ef`, main after the G1 merge (PR #51) and its step-doc update) and D1 (the `pixel_scale` text). No format change, no CN.
Read first: BUILD_GUIDE.md §0 (§0.6 helpers: the helper rule; HANDBACK needs § Helpers & self-review), §6 (green), §7; this file (it carries everything needed from EA's plan).
Kit: kit-1 r3 (guide-3), 2026-11-15. Engine Architect. Proto `/tmp/g2b3` branch `g2b3`, head `6866e47a` (`6866e47afe314edc22bffbb23a635fac919735cf`, tree `3d32a8f7`, parent `cbb326ef`, G-TileEngine noreply; r2 `5dbbbe5d` on the G1 proto, cherry-picked onto the Base, one `fx-live.ts` conflict resolved to the merged G1's `mid(p, tileW, tileH)`): 9 files, +96/−18 = 114 changed lines (src 37, tests 77); green 719/0 (713 + 6); EA plants 17/17; on the Base 5 of the 6 new tests fail (seam 33 pins reachable Base bands; its plant F1 is the proof). Bundle backup `/workspace/scratch-ea/kit-backup-g2b/`.
Carries: none filed. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) unchanged.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Finish the effect-piece fields the runtime half-reads. Today `pixel_scale: null` and `"3"` warn `outOfRange`; `blend: "add"` on a unit-layer piece draws normal (`Standing` has no `op`); an effect light sits at the unscaled middle of a scaled piece; `jitter`, `start_spread` and `size_spread` on a particles piece do nothing and lite plays the full count; a squashed unit loses its hit-white. After this step each works as ruled below, and scenes that set none of these fields draw byte-equal, except the one intended change: a unit that is squashed and hit-white at once now shows both.

## Rulings
All rulings are EA (this kit) on the post-34 plan v2 (items 10, 11, 13, 14, 15a; seam 33, QA `docs/qa/post34-answers.md` §(c)). Every one is pinned. Draw lists stay byte-equal for scenes that use no new field: the light raster and stress rigs A, B and L (`s34a-equal.ts`) and the pixel suite (`tools/pixel-suite/run.ts`) give the Base's output; rigs C and E move only by Ruling 5 (their effects are squashed and hit-white at once).
1. **pixel_scale** (item 10, D1 text): absent or `null` = the k rule; `"match-sprite"` = sprite size; an integer 1–6; `"1"`–`"6"` are aliases of 1–6 (the editor rewrites them, M6; the runtime just reads them); anything else warns once (`outOfRange`, message `pixel_scale`, deduped by the scene link) and plays the k rule. The k rule and `"match-sprite"` both play 1 in this runtime (33b-3 Ruling 8), so they draw alike here but stay distinct values (no rewrite of one into the other). Strings are matched exactly (`/^[1-6]$/`: no spaces, no `"3.0"`). A number keeps the Base's read: rounded and clamped to 1–6, flagged when that changed it (33b-3 ruling (b)), so no pin moves. Pinned by: "item 10: pixel_scale null, absent and match-sprite play 1 quietly; '1'-'6' are aliases of 1-6; 'x' warns once and plays 1 (G2b)".
2. **Standing.op** (item 11, seam 31): `Standing` gains `readonly op?: DrawOp`. `fx-live` sets `op: "add"` on a placed piece with `blend: "add"`, unit-layer (standing) pieces as well as overlays (overlays already had it). `buildDrawList` draws a standing thing with `st.op ?? "normal"`. A piece with no `blend` gets no `op` key (byte-equal). Pinned by: "item 11: blend add reaches unit-layer pieces as Standing.op and the draw list draws them add; no blend keeps no op (G2b)".
3. **Light centre × scale** (item 13): a scaled piece grows around its anchor (as `scaleCmd` draws it), so its light sits at `anchor + (fw/2 − ax, fh/2 − ay) · k`, where `(ax, ay)` = `anchorPx(sheet)` and the anchor point is where the k = 1 art puts it. k = 1 keeps G1's `mid()` exactly. One helper `litAt(p, grid, k)` in `fx-live.ts`. Particle emitters keep `mid()` (dots are not scaled art). Pinned by: "item 13: an effect light sits at the drawn centre of a scaled piece (the art grows around its anchor) (G2b)".
4. **Particle spreads and lite half** (item 14, CN-017 field reuse; meanings from the stock effect reader's `spread`): `jitter` 0–0.8 tiles (each dot sits up to N tiles off its path on x and y, `(u − 0.5) · 2 · jitter · tileW`); `start_spread` 0–0.75 of the particle life (each dot starts up to that share of its life late; its born time, pool order and pool ties are unchanged); `size_spread` 0–0.6 (size × clamp(1 + (u − 0.5) · 2 · size_spread, 0.35, 1.8), rounded, at least 1). Each `u` is one byte of `hash32(seed, "spread", i, 0)` (byte 0 start, 1 x, 2 y, 3 size), so every dot is seeded and stable. A non-number reads 0; a value outside its range is clamped; both are flagged (`outOfRange` with the field name, as the other particle fields). `particleRead` carries a spread key only when it is above 0 (so `particleRead({})` is unchanged). `particleAt` gains a last parameter `tileW = 0`. Lite plays `ceil(count / 2)` dots per piece after the caps (5 → 3, 48 → 24). Pool 96 / per effect 48 unchanged. `picture` is not read (not in this step). Pinned by: "item 14: jitter, start_spread and size_spread vary each particle (seeded, clamped and flagged); absent changes nothing; lite plays half the count (G2b)".
5. **Hit-white on squashed sprites** (item 15a, seam 28): the scene keeps a unit's look when it is squashed, and the draw list gives a look to squashed sprites (only motion-atlas sprites skip looks). The scene link bakes the look from the squashed frame: `lookPixels` gets a frame source that reads `~sq` ids through `squashed()` first. Tint mode works the same way (same look id path). Swaying (motion-atlas) sprites: no path gives them a look today (looks are only on units, and units have no motion), so they still skip looks; outline on swaying scenery stays D (UX split). This reverses 33b-3 Ruling 10's "drops the recolour" (one pin moves, below) and moves the 34a stress hash for rig C (below). Pinned by: "item 15a: a squashed unit keeps its hit-white, and the link bakes the squashed, whitened picture (G2b)" and the two moved pins.
6. **Particles in their piece's band** (seam 33, QA §(c)): a piece's dots draw in its band: `ground` → `fxGround`, `overlay` → `flash`, `air` → `fxAir`, unit layers → `fxAir` (33b-3 Ruling 7). The unreachable `ui` branch maps to `flash` (dots never draw over the UI band; `DrawLayer` has no `ui`). Pinned by: "seam 33: a piece's particles draw in the piece's band: ground in fxGround, overlay in flash, air and unit layers in fxAir (G2b)" (pins the Base's reachable bands; plant F1 is the proof).

## Files to create or change (and nothing else)
Size: at most 400 changed lines in total. The proto changes 114 lines (+96/−18) in 9 files:

| File | Base → proto lines / cap (changed lines) | Rulings |
|---|---|---|
| `src/runtime/render/fx-live.ts` | 117 → 120 / 24 | 1, 2, 3, 4, 6 |
| `src/runtime/render/fx-particles.ts` | 32 → 38 / 30 | 4 |
| `src/runtime/render/fx-player.ts` | 106 → 106 / 4 | 4 |
| `src/runtime/render/draw-list.ts` | 81 → 81 / 8 | 2, 5 |
| `src/runtime/render/types.ts` | 36 → 36 / 4 | 2 |
| `src/runtime/scene/world-scene.ts` | 132 → 132 / 8 | 5 |
| `tests/runtime/render/effect-pieces.test.ts` | 0 → 69 (shipped; +6 QA M1 fix adopted) | 1–6 |
| `tests/runtime/scene/fx-particles-qa.test.ts` | 2 lines (shipped; Ruling 5 pin move) | 5 |
| `tests/runtime/scene/perf-34a.test.ts` | 2 lines (shipped; Ruling 5 pin move) | 5 |

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// src/runtime/render/types.ts
export type Standing = { …the Base's fields…; readonly op?: DrawOp };
// src/runtime/render/fx-player.ts
export type FxPiece = { …the Base's fields…; readonly jitter?: unknown; readonly start_spread?: unknown; readonly size_spread?: unknown };
// src/runtime/render/fx-particles.ts
export type ParticleRead = { readonly motion: ParticleMotion; readonly count: number; readonly life: number; readonly pull: number; readonly bad: readonly string[]; readonly jitter?: number; readonly start_spread?: number; readonly size_spread?: number };
export const SPREAD = { jitter: 0.8, start_spread: 0.75, size_spread: 0.6 } as const;
export function particleRead(p: { …the Base's fields…; readonly jitter?: unknown; readonly start_spread?: unknown; readonly size_spread?: unknown }): ParticleRead { … }
export function particleAt(read: ParticleRead, i: number, seed: number, age0: number, ramp: readonly string[] | null, reduce: boolean, tileW = 0): Dot | null { … }
// fx-live, the draw list, the scene link: other signatures unchanged.
```
Notice texts (exact): `outOfRange` with message `pixel_scale` (as on the Base); spread fields flag under their own names (`jitter`, `start_spread`, `size_spread`) where the Base's particle fields flag.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) identical; the 21 smoke lines match the Base byte for byte except the heap line (report-only). `node tools/pixel-suite/smoke.ts`: 0 failed, same lines as the Base.

## Existing tests changed by ruling (and only these)
These two files are shipped whole (copy them; do not hand-edit):
- Ruling 5, `tests/runtime/scene/fx-particles-qa.test.ts` (33b-3): line 15 title "…a squashed unit keeps its squash and drops the recolour (Ruling 10)" → "…a squashed unit keeps its squash and its recolour (Ruling 10; G2b R5)"; line 18 `[true, false]` → `[true, true]`.
- Ruling 5, `tests/runtime/scene/perf-34a.test.ts` (34a): line 16 title "…the draw list hashes as on 1bd476bd (step 34a)" → "…the draw list hashes as on 1bd476bd, C as after G2b R5 (step 34a)"; line 17 rig C hash `da3c665e…49a35` → `b0e6cf14…333dab` (rig C's 100 effects are squashed and hit-white at once; rig L unchanged).
No other shipped pin changes (`particleRead({})` at `fx-particles.test.ts:22` and the 33b-3 counts stay).

## Tests that prove it is done
Shipped files (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-g2b-effect-pieces/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/render/effect-pieces.test.ts` | `tests/runtime/render/effect-pieces.test.ts` | `64b3a0d5c632329a16f0de5b2601c4a12842f93e86f3bf8f54ee6960534bed8c` |
| `tests/runtime/scene/fx-particles-qa.test.ts` | `tests/runtime/scene/fx-particles-qa.test.ts` (replaces it) | `89bf5711364cdb7d5fc0fb3f5b4bddadc9ed2586bb227b9cb625a5753d8d4a09` |
| `tests/runtime/scene/perf-34a.test.ts` | `tests/runtime/scene/perf-34a.test.ts` (replaces it) | `f828a3a5a1fe2ec1b10971820d633497a79475472f7217ad50fc2559f455743c` |

Titles (exact), all in `effect-pieces`:
- "item 10: pixel_scale null, absent and match-sprite play 1 quietly; '1'-'6' are aliases of 1-6; 'x' warns once and plays 1 (G2b)": ten inputs' notes, `"3"` draws as `3`, three frames of `"x"` through the link give one notice.
- "item 11: blend add reaches unit-layer pieces as Standing.op and the draw list draws them add; no blend keeps no op (G2b)".
- "item 13: an effect light sits at the drawn centre of a scaled piece (the art grows around its anchor) (G2b)": k 1, 2, 3 at cell (1, 1); the k = 2 draw command's centre is the light.
- "item 14: jitter, start_spread and size_spread vary each particle (seeded, clamped and flagged); absent changes nothing; lite plays half the count (G2b)".
- "item 15a: a squashed unit keeps its hit-white, and the link bakes the squashed, whitened picture (G2b)": the `~sq…~hw:white` id and its 18 × 14 white pixels.
- "seam 33: a piece's particles draw in the piece's band: ground in fxGround, overlay in flash, air and unit layers in fxAir (G2b)".
(You may add tests. The hand-back lists the three shipped files' sha256, unchanged.)

## UX look check (items 11 and 15a; list only, UX runs it after merge)
Item 11, additive unit-layer pieces:
- A `blend: "add"` piece on `front-unit` glows over its unit (lighter, never darker), day and night.
- The same piece behind the unit (`behind-unit`) brightens only where it shows past the unit.
- An additive piece gets no dark outline halo, and its auto outline (if any) does not look boxed.
- A non-additive unit-layer piece looks exactly as before.
Item 15a, hit-white on squashed units:
- A unit squashed by a hit flashes white for the whole white window, in the squashed shape (wider and shorter, feet on the ground).
- `hit_white_mode: "tint"` on a squashed unit shows the tint colour in the squashed shape.
- The white ends with the squash timing it should (no one-frame unsquashed white pop at either edge).
- Swaying scenery (grass, trees) looks unchanged.

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/sg2b-plants.py <clone> <base clone>` (result `kit-backup-g2b/sg2b-plants-result.txt`) runs the whole `node --test` suite per plant and matches **full test titles**. Each plant is a one-line source edit:
- A1–A3 pixel_scale: `null` warns; string aliases unread; padded text accepted.
- B1–B2 op: `fx-live` drops `blend` on unit-layer pieces; the draw list ignores `Standing.op`.
- C1–C2 light: stays at the unscaled middle; grows around the middle, not the anchor.
- D1–D6 particles: spreads unclamped; jitter, start_spread or size_spread ignored; lite rounds down; lite plays the full count.
- E1–E3 squash look: the scene drops the look on squash; look pixels miss the squashed source; the draw list skips looks on squashed sprites.
- F1: overlay particles fall to `fxAir`.
Expected: **17/17 caught; on the Base items 10, 11, 13, 14 and 15a fail; seam 33 passes there (it pins the Base's reachable bands; F1 is the proof).**

## Decisions note: what to name
- Why numbers keep round-and-clamp-with-flag while strings must match `"1"`–`"6"` exactly.
- Why the k rule and `"match-sprite"` draw alike here and are still not merged.
- Why the light grows around the anchor (it matches `scaleCmd`) and particles keep `mid()`.
- Why `start_spread` delays the dot but keeps its born time (pool order and ties unchanged), and why spread keys are absent at 0.
- Why `world-scene.ts` is in the file list (the scene dropped the look on squash; the link bakes look pixels).
- Why swaying sprites still skip looks (no path gives them one).

## Do not touch
`src/types/core-types.ts`; `src/state/**`; `src/core/**`; `src/sim/**`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `tsconfig.json`; `eslint.config.*`; `BUILD_GUIDE.md`; `STATES.md`; `scripts/check-state.sh`; `tools/**`; `tests/perf/**`; `light.ts`, `fx-light.ts`, `fx-look.ts`, `motion.ts`, `canvas2d.ts`; every existing test file except the two shipped above; `locked/`; `data/*.md`; plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 719 tests passing (713 + the 6 new) and none failing, cancelled, skipped or todo; typecheck, lint, deps, check:law and check:state each exit 0.
- [ ] The three shipped files are byte-identical to the sha256s above.
- [ ] Sims, the 21 smoke lines (heap line report-only) and every pin other than the two listed moves unchanged; `git diff cbb326ef --stat -- package.json package-lock.json BUILD_GUIDE.md src/types src/state src/core src/sim tools tests/perf` is empty.
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`; `node tools/pixel-suite/run.ts` prints the Base's lines.
- [ ] `node tests/perf/fx-particles-budget.ts` alone: p95 under 4 ms in every lap, counts `132/36/90/1` as on the Base (proto p95 0.34–0.74 ms).
- [ ] `node tests/perf/stress-budget.ts`: stress L p95 under 2 ms in every lap; counts A 27/0/0, B 113/0/0, C and E 181/0/0, L 27/373/0 (paste the lines).
- [ ] Each file within its cap; at most 400 changed lines in total (the proto is 114).
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location, with § Helpers & self-review.

## Not in this step (carries, with their target step)
- **`picture` on particles** (item 14): not read; needs the Effect Designer's picture rule (G2).
- **Outline on swaying scenery** (item 15b): D (UX split).
- **Light colours `#rgb`** and the **strip-warning flood**: as carried from G1.

## Out of scope
Game rules. Format changes. New features. Any change in `light.ts`, `fx-light.ts`, `fx-look.ts`, `motion.ts`, `canvas2d.ts` or the frame driver. The editor's `"1"`–`"6"` rewrite (M6, tools).

## Kit files to push
All under `/workspace/tileengine`, full sha256 in `/workspace/share/g2b/push-sha256.txt` (4 files):
- `handoff/steps/step-g2b-effect-pieces.md` (this file)
- the three shipped files under `handoff/steps/tests/step-g2b-effect-pieces/` (table above)

## Rulings (no open questions)
- EA ruling (item 10 format words): `"1"`–`"6"` match exactly; numbers keep the Base's round/clamp/flag; the k rule and `"match-sprite"` both play 1 here and stay distinct values.
- EA ruling (item 14 format words): spread units and ranges from the stock reader (tiles; shares of life; size share), hashed per dot as Ruling 4; lite half is `ceil`.
- EA ruling (item 15a): squashed sprites keep looks; swaying sprites have no look path (no change); one 33b-3 pin and the 34a rig C hash move (listed above).
- EA ruling (seam 33): the dead `ui` dot band maps to `flash`; the test pins the reachable bands.
- EA ruling (scope): `world-scene.ts` joins the plan's file list for Ruling 5.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 719 passing and 0 failing**. Paste the summary line into HANDBACK.md.
- The three shipped files are **byte-identical** to the sha256s above; list each in HANDBACK.md, and paste the stress lines, the fx-particles budget lines and the `smoke: 0 failed` line.
- The bundle is `<Base cbb326ef>..step/step-g2b-effect-pieces-r<N>` and passes `git bundle verify`. Each file stays within its cap, and the total (insertions + deletions) is at most 400 changed lines (the proto is 114). Every pin other than the two listed moves unchanged.

## Delivery
On branch `step/step-g2b-effect-pieces-r<N>` (base `cbb326ef`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), run `git bundle create step-g2b-effect-pieces-r<N>.bundle cbb326ef..step/step-g2b-effect-pieces-r<N>` and then `git bundle verify`. Upload the bundle and a HAND-BACK-step-g2b-effect-pieces-r<N>.md to Google Drive (chatB adds `-chatB` to both names, chatB2 adds `-chatB2`, and either chat adds `-2` if a name already exists). On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. The committed HANDBACK (`handback/step-g2b-effect-pieces/r<N>/HANDBACK.md`, shape `handoff/HAND-BACK.md`, the branch's last commit) must quote this step file's sha256 in full, its § Helpers & self-review must list each helper and what it reviewed plus your self-review, and its PR line must read `PR: opened by Chief Of Staff from the bundle`. Don't push and don't commit to main.
