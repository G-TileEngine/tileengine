# step-g1-render-tidy: one copy of the foot and look maths, warnings that name the asset, a wake time the host can see, edge dots that stay until off screen (post-34 polish plan, slice G1; no CN; no format change)

Step id: step-g1-render-tidy          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`e9b8056b`** (`e9b8056b16d2afffb9a096f72e47ad559f230472`, tree `26b0ff81`, main: the D3 host-guide follow-up on the P1 merge `f128bc5a`). Branch: `step/step-g1-render-tidy-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-g1-render-tidy-r<N>.bundle e9b8056b..step/step-g1-render-tidy-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-g1-render-tidy/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: P1 and the D3 follow-up, merged (main `e9b8056b`). No format change, no CN.
Read first: BUILD_GUIDE.md §0 (§0.6 helpers: the helper rule; HANDBACK needs § Helpers & self-review), §6 (green), §7; this file (it carries everything needed from EA's plan).
Kit: kit-1 r2 (guide-3), 2026-11-15. Engine Architect. Proto `/tmp/g1` branch `g1`, head `730ea36e` (`730ea36e43a729d398fc63609ba50d779a097dbb`, tree `6bee60ac`; r1 `ef6f2191` + QA M1 test fix and N1 assert restored, parent `e9b8056b`, G-TileEngine noreply): 12 files, +149/−57 = 206 changed lines; green 712/0 (703 + 9); EA plants 21/21; on the Base the shipped file fails to load (no `footAt`, `lookBox`, `rgbOf`). Bundle backup `/workspace/scratch-ea/kit-backup-g1/`.
Carries: none filed. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) unchanged.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Tidy the render and scene joins found in the post-34 diagnosis, with no new feature. Today the tile-foot point is worked out in four files, the look box in two, `LiveOut.holds` is always `{}`, a `#f00` colour turns white, clip and motion warnings name the sheet (so two assets on one sheet share one warning), the effect wake time never reaches the host, and a particle dot vanishes a few px before it leaves the screen. After this step each has one home, warnings name the asset, `RenderScene.dueMs` carries the wake, and edge dots stay until fully off screen. Three depth cases and the phone page's file list get pins.

## Rulings

- G6 (merge time, QA A/B E4): item 8's hinted motion message (`name: hint`) was not pinned; both builds missed it. QA's `tests/runtime/render/render-tidy-qa.test.ts` (1cd5105b, 19 lines) pins `motionInvalid:grass#2: ${ANIM_HINT}`; adopted, floor raised to 713.
All rulings are EA (this kit) on the post-34 plan v2 (every teammate agreed; QA `docs/qa/post34-answers.md` §(b), §(c)). Every one is pinned. Draw lists stay byte-equal for scenes that use no changed field: the stress rigs and light raster (`s34a-equal.ts`) and the pixel suite (`tools/pixel-suite/run.ts`) give the Base's output.
1. **One foot** (item 4, seam 6): `footAt(c, r, tileW, tileH, dx = 0, dy = 0)` in `frames.ts` returns `{ x: c * tileW + px(tileW / 2) + dx, y: (r + 1) * tileH + dy }`, the only copy of that maths in `src/runtime`. Its users: the draw list (a standing thing's place, its depth key, computed once per thing before the sort, and a tile row's top), `placeStep`, and `fx-live` (the at-cell point, and one `mid()` helper for a piece's centre used by particles and lights). `fx-live`'s `Math.round(tileW / 2)` becomes `px`, which equals it for any tile width ≥ 0. Pinned by: "item 4: the tile-foot maths lives only in footAt (frames.ts); px rounds the half tile (G1)".
2. **One look box** (item 5, seam 32): `lookBox(fw, fh, look)` in `fx-look.ts` returns `{ w, h, ox, oy }` (`ox = (w − fw) / 2`, `oy = (h − fh) / 2`); the draw list takes its box from it and builds the look id with `lookId`. `lookSize` stays (a wrapper; its pin is unchanged). Pinned by: "item 5: lookBox is the one reader of look geometry; the draw list's box and look id come from it (G1)".
3. **No holds** (item 6, seam 18): `LiveOut.holds` and the `LiveHold` type are removed (also from the render index); the scene link owns holds. Pinned by: "item 6: LiveOut has no holds field; the scene link owns holds (G1)".
4. **`#rgb`** (item 7, seam 30): `rgbOf(hex)` in `fx-look.ts` reads `#rrggbb` or `#rgb` (`#f00` = `#ff0000`), anything else is `null`. Hit-white, outline and the draw list's dot `rgba()` use it. Light colours (`fx-light.ts`, `light.ts`) come from ramps and are not touched; motion ramps still refuse `#abc` (format rule; existing pin unchanged). Pinned by: "item 7: #rgb reads as #rrggbb for hit-white, outline and dot colours; other lengths stay unread (G1)".
5. **Warnings name the asset** (item 8, seams 15 + 11): codes unchanged. The name is the asset id (the key in `world.assets`), plus `#<tile>` when a tile has its own `tileProps` motion or anim, plus ` (sheet <id>)` when the sheet id differs: `bad (sheet bad-sheet)`, `grass#2`. The six clip notices (`clipFpsInvalid`, `clipMsLength`, `clipFpsIgnored`, `clipEventInvalid`, `clipPointsInvalid`, `clipEventsOverCap`) carry it as their message. Motion notices carry it as the message, with the animated-tile hint after it (`grass#2: <hint>`). `wm.plan`'s `owner` is that name, and a cached plan warns again for a new owner, so two assets on one sheet give two warnings. `world-motion.ts` is outside the plan's file list because the message is built there. `clipMsInvalid` keeps the clip name, and `fxTooManyFrames` strip warnings are unchanged (already per asset id). Pinned by: "item 8: clip and motion warnings name the asset id (and the sheet id when it differs), a tile's own motion names the tile (G1)" and the moved pin below.
6. **The wake reaches the host** (item 9, seams 22 + 25): `RenderScene.dueMs?` is the earliest of `fx-live`'s `dueMs` (pose steps, shake, the 10 Hz light gate) and each effect's hit-white edge: with `hitWhiteMs(e.hit_white_ms).ms > 0` (the same clamped, unrounded value `hitWhiteArg` uses), the first pose at or after the hit (before it) or at or after hit + ms (during it), on the pose grid (30 ms, lite 60). The key is present only when finite. `buildDrawList` starts its `dueMs` from `scene.dueMs`. A cached scene whose `dueMs` is at or before the clock is rebuilt (else a still scene keeps a past wake). Pinned by: "item 9: the hit-white edge and the effect wake reach scene.dueMs and the draw list's dueMs; a scene with no effect has none (G1)".
7. **Edge dots** (seam 33, QA §(c)): dots use the same box test as sprites, so a dot partly on screen draws until it is fully off screen. Pinned by: "seam 33: a dot partly on screen draws until it is fully off screen (G1)" and the moved pin below.
8. **Depth pins** (item 45, UX case): no code. A tall object covers a unit on the row above that sits inside its art; a unit below it, or right of it on its row, draws after; in one cell the object draws first; a unit's `dy` counts in its depth. Footprint blocking stays out (house (c)). Pinned by: "item 45: a tall object covers a unit on the row above inside its art, a unit below or to the right draws after it, and in one cell the object draws first (G1)".
9. **Page file list** (carry from G5a): `build.json` lists only `index.html`, `src/**`, `tools/device-page/**`, and `tools/pixel-suite/fixture.js` and `l2.js` by name (the page imports them, so the carry's "src/ and tools/device-page/" is ruled to include those two). No `tools/**` file changes. Pinned by: "carry: the gh-pages build lists only index.html, src/, tools/device-page/ and the two pixel-suite files the page imports (G1)".

## Files to create or change (and nothing else)
Size: 150–400 changed lines in total. The proto changes 215 lines (+158/−57) in 12 files:

| File | Base → proto lines / cap (changed lines) | Rulings |
|---|---|---|
| `src/runtime/render/frames.ts` | 46 → 49 / 8 | 1 |
| `src/runtime/render/draw-list.ts` | 80 → 81 / 40 | 1, 2, 4, 6, 7 |
| `src/runtime/render/fx-player.ts` | 107 → 106 / 8 | 1 |
| `src/runtime/render/fx-live.ts` | 114 → 114 / 30 | 1, 3 |
| `src/runtime/render/fx-look.ts` | 54 → 57 / 20 | 2, 4 |
| `src/runtime/render/types.ts` | 36 → 36 / 4 | 6 |
| `src/runtime/render/index.ts` | export `footAt`, `lookBox`, `rgbOf`; drop `LiveHold` / 8 | 1–4 |
| `src/runtime/render/world-motion.ts` | 74 → 74 / 14 | 5 |
| `src/runtime/scene/world-scene.ts` | 129 → 131 / 50 | 5, 6 |
| `src/runtime/render/fx-particles.ts` | unchanged / 0 | — |
| `tests/runtime/render/render-tidy.test.ts` | 0 → 93 (shipped; +9 QA M1 fix adopted) | 1–9 |
| `tests/runtime/render/render-tidy-qa.test.ts` | 0 → 19 (G6-adopted from QA A/B, E4) | 8 |
| `tests/runtime/scene/host-hookup.test.ts` | 2 lines (shipped; Ruling 5 pin move) | 5 |
| `tests/runtime/scene/fx-particles.test.ts` | 1 line (shipped; Ruling 7 pin move) | 7 |

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// src/runtime/render/frames.ts
export const footAt = (c: number, r: number, tileW: number, tileH: number, dx = 0, dy = 0): { x: number; y: number } => …;
// src/runtime/render/fx-look.ts
export const lookBox = (fw: number, fh: number, look: string): { w: number; h: number; ox: number; oy: number } => …;
export const rgbOf = (arg: string): [number, number, number] | null => …;
// lookSize, lookId, recolour, lookPixels, pieceLook: signatures unchanged
// src/runtime/render/types.ts
export type RenderScene = { …the Base's fields…; readonly dueMs?: number };
// src/runtime/render/fx-live.ts
export type LiveOut = { readonly standing: Standing[]; readonly overlays: Overlay[]; readonly fired: LiveEvent[]; readonly views: Record<string, number>; readonly notes: FxNote[]; readonly dueMs: number; readonly shake: { readonly x: number; readonly y: number }; readonly lit: FxLit; readonly dots: SceneDot[] };
// LiveHold: removed. WorldMotion.plan and the scene link: signatures unchanged.
```
Notice texts (exact): the name in Ruling 5 (`<asset>`, `<asset>#<tile>`, then ` (sheet <sheet>)` when it differs); a motion hint reads `<name>: <the Base's hint>`.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) identical; the 21 smoke lines match the Base byte for byte, heap line included (report-only). `node tools/pixel-suite/smoke.ts`: 0 failed, same lines as the Base.

## Existing tests changed by ruling (and only these)
These two files are shipped whole (copy them; do not hand-edit):
- Ruling 5, `tests/runtime/scene/host-hookup.test.ts` (33h): line 28 title "…warn once per asset per code, named by the sheet id; absent…" → "…warn once per asset per code, named by the asset id and the sheet id that differs (G1 R5); absent…"; line 32 `["clipEventInvalid:bad-sheet", "clipPointsInvalid:bad-sheet"]` → `["clipEventInvalid:bad (sheet bad-sheet)", "clipPointsInvalid:bad (sheet bad-sheet)"]`.
- Ruling 7, `tests/runtime/scene/fx-particles.test.ts` (33b-3): line 140 `[131, 36, 96, 2]` → `[132, 36, 97, 2]` (one edge dot now stays on screen), with a comment naming the old values.
No 33i pin moves: `motion-shore-live.test.ts:71` reads the code and "anim: null", and both are kept. No other shipped pin changes.

## Tests that prove it is done
Shipped files (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-g1-render-tidy/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/render/render-tidy.test.ts` | `tests/runtime/render/render-tidy.test.ts` | `151e87eff3acf47101759f0e41bec52d182658b504c329565606c95e1c4c62e1` |
| `tests/runtime/scene/host-hookup.test.ts` | `tests/runtime/scene/host-hookup.test.ts` (replaces it) | `28657f7adffd09fe2a973a94e7fb6d82686b66a38f65d496ad07e6f9783be13a` |
| `tests/runtime/scene/fx-particles.test.ts` | `tests/runtime/scene/fx-particles.test.ts` (replaces it) | `9b934bc902d05f9e23e44ee240907f16f000d4912cfa2b74db40164f14bbc421` |
| `tests/runtime/render/render-tidy-qa.test.ts` | `tests/runtime/render/render-tidy-qa.test.ts` | `1cd5105bf160cc483b6f42ec047723347ae20fa841dba3b96ebd741f256270f1` |

Titles (exact), all in `render-tidy`:
- "item 4: the tile-foot maths lives only in footAt (frames.ts); px rounds the half tile (G1)": a fence over `src/runtime` for `tileW / 2` and `r + 1) *`; three `footAt` values, one with an odd tile.
- "item 5: lookBox is the one reader of look geometry; the draw list's box and look id come from it (G1)": three boxes; `draw-list.ts` holds no `hypot`, `~fx` or `ol#`; a turned, outlined rock's command.
- "item 6: LiveOut has no holds field; the scene link owns holds (G1)".
- "item 7: #rgb reads as #rrggbb for hit-white, outline and dot colours; other lengths stay unread (G1)".
- "item 8: clip and motion warnings name the asset id (and the sheet id when it differs), a tile's own motion names the tile (G1)": two assets on one sheet (clip and motion), and a tile case.
- "item 9: the hit-white edge and the effect wake reach scene.dueMs and the draw list's dueMs; a scene with no effect has none (G1)": 1020 while pieces play, 1320 before the hit, 1410 during the white; the look flips exactly there; a light gate's 1200 wake is not kept once passed.
- "seam 33: a dot partly on screen draws until it is fully off screen (G1)".
- "item 45: a tall object covers a unit on the row above inside its art, a unit below or to the right draws after it, and in one cell the object draws first (G1)".
- "carry: the gh-pages build lists only index.html, src/, tools/device-page/ and the two pixel-suite files the page imports (G1)".
(You may add tests. The hand-back lists the three shipped files' sha256, unchanged.)

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/sg1-plants.py <clone> <base clone>` (result `kit-backup-g1/sg1-plants-result.txt`) runs the whole `node --test` suite per plant and matches **full test titles**. Each plant is a one-line source edit:
- A1–A2 foot: `fx-player` re-derives the foot inline (same numbers, the fence catches it); `footAt` floors the half tile.
- B1–B2 look: `lookBox` truncates the inset; the draw list parses the look itself again.
- C1: `LiveOut.holds` comes back. D1–D2: `#rgb` unread in `rgbOf`; dot colours read 6 digits only.
- E1–E4 names: warnings name the sheet id; a cached plan does not warn for the next owner; a tile's own motion warns under the asset id; motion messages drop the name.
- F1–F5 wake: the scene drops `dueMs`; the draw list ignores it; the hit-white edge is off the pose grid; `fx-live`'s wake is not merged; a cached scene keeps a past `dueMs`.
- G1: edge dots culled early again. H1–H3 depth: a unit before an object in one cell; depth by the art's top; `dy` ignored. I1: the page build ships a file outside its sources.
Expected: **21/21 caught; on the Base the shipped file fails to load (no `footAt`, `lookBox`, `rgbOf`).** Items 45 and the carry pin Base behaviour; their plants (H1–H3, I1) are the proof.

## Decisions note: what to name
- Why the depth key is computed once per thing before the sort (same expression and order, so byte-equal, and no `footAt` call per compare).
- Why `px` replaces `Math.round` at the at-cell point (equal for every tile width ≥ 0).
- Why the warning name lives in `world-scene.ts` and the message is built in `world-motion.ts`, and why a cached plan warns again for a new owner.
- Why the hit-white wake is put on the pose grid (the look changes only when the pose crosses the edge) and why a past cached `dueMs` forces a rebuild.
- Why light colours and motion ramps keep 6-digit only.

## Do not touch
`src/types/core-types.ts`; `src/state/**`; `src/core/**`; `src/sim/**`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `tsconfig.json`; `eslint.config.*`; `BUILD_GUIDE.md`; `STATES.md`; `scripts/check-state.sh`; `tools/**`; every existing test file except the two shipped above; `locked/`; `data/*.md`; plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 713 tests passing (703 + the 9 shipped + QA's E4 test) and none failing, cancelled, skipped or todo; typecheck, lint, deps, check:law and check:state each exit 0.
- [ ] The three shipped files are byte-identical to the sha256s above.
- [ ] Sims, the 21 smoke lines (heap line report-only) and every pin other than the two listed moves unchanged; `git diff e9b8056b --stat -- package.json package-lock.json BUILD_GUIDE.md src/types src/state src/core src/sim tools` is empty.
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`; `node tools/pixel-suite/run.ts` prints the Base's lines.
- [ ] Each file within its cap; 150–400 changed lines in total (the proto is 215).
- [ ] `tests/runtime/perf-34b.test.ts` passes unchanged; `node tests/perf/stress-budget.ts` prints stress L p95 under 2 ms in every lap and the Base's counts (paste the lines; proto L p95 1.05–1.39 ms, counts 27/373/0).
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location, with § Helpers & self-review.

## Not in this step (carries, with their target step)
- **G2b**: `pixScale` (item 10), `Standing.op` (11), light centre × scale (13), particle fields (14), looks on squashed/swaying sprites (15a), ui-band dots.
- **Light colours `#rgb`**: `fx-light.ts` / `light.ts` read 6 digits only; only if a maker types a short light colour.
- **Strip-warning flood** (seam 11): a game that rebuilds clip objects each frame still re-warns per clip object (33h pin stays).

## Out of scope
Game rules. Format changes. New features. Any change in `light.ts`, `fx-light.ts`, `motion.ts`, `canvas2d.ts` or the frame driver. Footprint blocking.

## Kit files to push
All under `/workspace/tileengine`, full sha256 in `/workspace/share/g1/push-sha256.txt` (4 files):
- `handoff/steps/step-g1-render-tidy.md` (this file)
- the three shipped files under `handoff/steps/tests/step-g1-render-tidy/` (table above)

## Rulings (no open questions)
- EA ruling (item 8 names): the asset id is the `world.assets` key; `#<tile>` only when the tile has its own motion or anim; ` (sheet <id>)` only when it differs. One 33h pin moves (listed above); no 33i pin moves.
- EA ruling (seam 33 cull): one 33b-3 count pin moves, 131/96 → 132/97 (listed above).
- EA ruling (carry): the page's two pixel-suite imports are part of its allowed file list by name.
- EA ruling (scope): `world-motion.ts` joins the file list for Ruling 5; `fx-particles.ts` from the plan's list needs no change.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 713 passing and 0 failing**. Paste the summary line into HANDBACK.md.
- The three shipped files are **byte-identical** to the sha256s above; list each in HANDBACK.md, and paste the stress lines and the `smoke: 0 failed` line.
- The bundle is `<Base e9b8056b>..step/step-g1-render-tidy-r<N>` and passes `git bundle verify`. Each file stays within its cap, and the total (insertions + deletions) is 150–400 changed lines (the proto is 215). Every pin unchanged.

## Delivery
On branch `step/step-g1-render-tidy-r<N>` (base `e9b8056b`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), run `git bundle create step-g1-render-tidy-r<N>.bundle e9b8056b..step/step-g1-render-tidy-r<N>` and then `git bundle verify`. Upload the bundle and a HAND-BACK-step-g1-render-tidy-r<N>.md to Google Drive (chatB adds `-chatB` to both names, chatB2 adds `-chatB2`, and either chat adds `-2` if a name already exists). On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. The committed HANDBACK (`handback/step-g1-render-tidy/r<N>/HANDBACK.md`, shape `handoff/HAND-BACK.md`, the branch's last commit) must quote this step file's sha256 in full, its § Helpers & self-review must list each helper and what it reviewed plus your self-review, and its PR line must read `PR: opened by Chief Of Staff from the bundle`. Don't push and don't commit to main.
