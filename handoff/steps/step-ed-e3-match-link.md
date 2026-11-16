# step-ed-e3-match-link: Effect Designer E3. G2 match → picture link (scope R4, gap X3): `sceneFromMatch` turns plain match snapshot data into a `SceneWorld` on D3's recipe shape, `createMatchLink` hands back the same world for the same snapshot with a `rev` the scene link uses to skip its per-frame unit key (post34 items 18, 19), and two RISKY designer helpers give the Effect Designer its real game patch (M-B8): `matchPatch` (a window on the real map) and `nearestFoe` (a preview target). No UI.

Step id: step-ed-e3-match-link          Revision: r<N> (start at r1; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`3aa3551f`** (`3aa3551fe0b735b553b80e54fbfda4ad286853ec`, main: the ED-E2 merge-time step doc on the E2 merge `ce3cd310`, PR #56; test floor 786/0). Branch: `step/step-ed-e3-match-link-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-ed-e3-match-link-r<N>.bundle 3aa3551f..step/step-ed-e3-match-link-r<N>`, then `git bundle verify`. Upload the bundle and a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: `handback/step-ed-e3-match-link/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: D3 (merged): the host guide's "Match → picture recipe" (`docs/host-guide.md` § Match → picture recipe) and its working copy `tools/host-example/match-picture.ts` (target shape `sceneFromMatch(plain snapshot, assets) -> SceneWorld`). `src/runtime/scene/world-scene.ts` (`SceneWorld`, `SceneUnit`, `createSceneLink`, the unit key at `world-scene.ts:31`, the effects revision `fxRev`). ED-E1/E2 (merged): `docToLiveFx` and travel paths, used only by test 12. E2 merge-time step doc `handoff/steps/step-ed-e2-travel-paths.md` (sha256 `1c15efea…`).
Read first: BUILD_GUIDE.md §0, §2 (engine law), §6 (green), §7; the scope `/workspace/share/effect-designer/scope.md` r5 (sha256 `5047f4c0…`) §3 X3, §6 R4, §8 E3, §9 M8, §13 (M-B8 "preview inside a saved replay"); `bold-inputs-librarian-modes.md` (`08f08ea2…`, Modes idea 8); UX `ux/effect-designer-v3-ux.md` (`2622814f…`) §1.2 "The preview is a patch of the real game"; EA `post34-diagnosis-plan.md` items 2, 18 and 19; the dependency rule `nothing-imports-sim` (`.dependency-cruiser.cjs:15`).
Kit: kit-1 r3, 2026-11-16 (r3 = QA review `docs/qa/step-ed-e3-review.md` `aa3908d3…`: M1 G6 pin `scene-fence-qa` adopted (ruling 16); M2 open question 1 reworded; optional: test 11's untyped `nearestFoe` call wrapped in `assert.doesNotThrow`; QA's pin edit `0fe9d665` accepted; r2 backup `/workspace/scratch-ea/effect-designer/ede3-r2/`. r2 = QA review `8c9db130…`: G6 pin `match-link-qa`, should-fix (a) and (b), `foes` required; r1 backup `ede3-r1/`). Engine Architect. Proto `/tmp/ede3` branch `proto/ede3-r3`, head **`fee4f953`** (`fee4f953b0a3a05d3b7a6b0b6dd40a023118c93a`, tree `c49225d0`), parent QA's **`refs/cmp/ede3-qa-r2-fix-a` `e0e99a79`** (`e0e99a7956e9839e554baf0f75caf02dd4871ef0`, tree `ab70e7e4`, from QA's bundle `/workspace/share/ede3-qa-r2-fix-a.bundle` sha256 `ded2b0a7…2ba52`, verified; exact, not reconstructed), which sits on the r2 proto `b19c1329`, QA's fix-b `f7f778f5` and the r1 proto `39e6abc0` on the Base `3aa3551f` (5 commits; G-TileEngine noreply author and committer). 9 files, +271/−30 = **301 changed lines** (src 99, tests 171, of which QA's G6 pins 33 + 15; tools 29, docs 2). Green 803/0 (786 + 12 EA + 5 QA). EA plants 56/56 (`/workspace/scratch-ea/effect-designer/ede3-plants.py`); QA plants 18/18 live + Q8, Q20 retired, and QA's r2 plants R1–R8 8/8 (see § How a planted bug is caught). Bundle backup `/workspace/scratch-ea/effect-designer/step-ed-e3-proto-r3.bundle`.
Carries: see § Not in this step. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) are unchanged. **No core-types change and no format change** (`SceneWorld` is a runtime API in `world-scene.ts`, not a saved format).

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Today `src/` has no match → picture link: `src/sim` and the scene link never import each other, and every host hand-builds `SceneUnit`s (X3, post34 item 2). So the Effect Designer preview can only use a stand-in unit (M8). After this step:
1. **The link.** `sceneFromMatch(snap, art)` reads plain snapshot data (a `JSON.parse` of a save, a network message, or `snapshot(world)`) by shape only and returns `{ world, notes }`: one `SceneUnit` per good unit row, the map from the host's art, and a note for every row it skips. It never throws and never imports `src/sim`.
2. **Same snapshot, no work.** `createMatchLink().world(snap, art)` hands back the same world object while the snapshot and art objects are the same, and numbers each rebuild with `rev`. The scene link reads `SceneWorld.rev`: with the same rev and units array it skips the O(units) unit key, and a new rev re-reads the effects list (items 18, 19).
3. **The real patch (RISKY, M-B8).** `matchPatch` gives the designer a preview board as a window on the real map (caster and target in view), and `nearestFoe` picks a preview target from the match. The host points its camera at the window, so the preview is the real game: real tiles, real units, the same `fx-live` path.
4. **The recipe example uses it.** `tools/host-example/match-picture.ts` calls the src link and prints the same line; the host guide names the real link.

A `SceneWorld` without `rev` (every host today) draws exactly as before. Sims, stress and smoke don't move.

## Rulings
1. **Shape and place (scope R4, D3 recipe).** `src/runtime/scene/match-link.ts` exports `MATCH`, `sceneFromMatch`, `createMatchLink`, `matchPatch`, `nearestFoe` and the types below. It imports only types from `./world-scene.ts` and the `Notice` type, so `nothing-imports-sim` and the scene fence hold. The snapshot is typed `unknown` and read by shape. Nothing throws (law 10). Pinned by tests 1, 3, 12 and the fence test.
2. **One unit row → one `SceneUnit`.** `id`, `sprite` = `art.sprites[unitId]` (an own key only, so `constructor` or `toString` is no sprite), `at`, `offset`, `facing`, `alive`; `action` is `"move"` while `offset` is set, else `"idle"` (the recipe). A dead unit is kept with `alive: false` (the scene link already draws it only with `action: "die"`, which E3 never writes). `side`, `unitId`, `tick`, `phases` and the rest are not copied. Units keep snapshot order. Pinned by tests 1, 4, 12.
3. **Bad rows (notes `{code, message}`, in row order).** A row that is not a record, or whose `id` or `unitId` is not a string, `alive` not a boolean, or `at` not integer `{c, r}` → `invalidValue` `units[i]`, skipped. A repeated `id` → `invalidValue` `units[i].id`, skipped (the first row with an id claims it, even if that row is then skipped). A cell is inside the map when `0 ≤ c < art.cols` and `0 ≤ r < art.rows`. Outside (`c` < 0, `r` < 0, `c` ≥ `art.cols`, `r` ≥ `art.rows`, or `art.cols` or `art.rows` is not a number) → `outOfRange` `units[i].at`, skipped. So when `art.cols` or `art.rows` is not a number, no cell is inside and every placed row is `outOfRange` (split 3, EA ruling at merge: B's behaviour, fails closed). No sprite → `unknownRef` `units[i].unitId`, skipped, noted once per `unitId`. A snapshot that is not a record or has no `units` array → one `invalidValue` `snapshot.units` and an empty world. Checks run in that order. Pinned by tests 3, 4.
4. **Facing and offset.** Absent reads `null` with no note. A `facing` outside `N`/`E`/`S`/`W`/`null`, or an `offset` that is not two finite numbers `dx`, `dy`, is `null` with `invalidValue` `units[i].facing` / `units[i].offset`, and the unit is kept (so a bad offset gives `idle`). Pinned by test 5.
5. **Cap (law 13).** Only the first `MATCH.units` = 1024 rows are read; more give one `overCap` `snapshot.units`. The single `overCap` note comes after all row notes (split 1, EA ruling at merge: B's order). So at most 2 × 1024 + 2 notes per build. Pinned by test 6.
6. **Copies.** `at` and `offset` are fresh objects, so the world shares nothing with the snapshot and a later sim edit can't change a built world. The art's `assets`, `layers`, `objects`, `style` and `waterTiles` are shared by reference (so the scene link's asset, layer and shore caches hit). `objects` defaults to one shared empty list, `overlays` is always one shared empty list, and there is no `effects` and no `rev`. `style` and `waterTiles` are omitted when the art has none. The same input gives a deep-equal output. Pinned by tests 1, 2.
7. **Match link and `rev` (post34 items 18, 19).** `createMatchLink()` keeps one entry. `world(snap, art)` returns the **same world object** while `snap` and `art` are the same objects (no rebuild). Anything else rebuilds with `rev` = the link's build count (1, 2, …). `notes` are the last build's, and `builds` counts rebuilds. Snapshots are values, like effects (seam 37): editing one in place isn't seen. Use one link per loaded match; a new link starts again at rev 1, which is safe because the scene link also checks the units array (ruling 8). Pinned by test 7.
8. **Scene link reads `rev` (`world-scene.ts`).** `SceneWorld` gains `readonly rev?: number` (a runtime API field, no CN). When `rev` is a finite number equal to the last frame's memo, **and** the `units` array, the `assets` object and `cols, rows, tileW, tileH, mapSeed` are all the same, the link reuses the last unit key and skips the per-unit JSON. A frame without `rev` drops the memo. A new `rev` (the first one included) bumps the effects revision, so an effects list edited in place is seen once the rev moves. Without `rev` nothing changes. Pinned by test 8.
9. **The real patch (RISKY, M-B8, UX v3 §1.2).** `matchPatch(world, {caster, target?}, {cols, rows})` returns a tile window `{c, r, cols, rows}` and its pixel box `{x, y, w, h}` = tiles × `tileW`/`tileH`, or `null` for an unknown caster or an empty map. **The world is never cropped:** a crop would shift cells, and tile variation (`hash32(mapSeed, asset, c, r)`, `frames.ts:32`) and shore foam would change, so it wouldn't be the real patch. The host points its camera at the box. A map size that is not a number ≥ 1 (`!(world.cols >= 1) || !(world.rows >= 1)`, so NaN, 0 and 0.5 included) gives `null`; a fractional map size counts its whole tiles (`Math.floor`, so 2.5 × 1.9 is a 2 × 1 map; r2, QA should-fix (a)). Size: whole tiles (`Math.floor`), 1 to `MATCH.patch` = 16, and at most the map; a non-finite axis takes that axis of `MATCH.board` (3 cols, 2 rows), so `{7, ∞}` gives 7 × 2, then clamped to the map. When `|Δc| < cols` and `|Δr| < rows`, the window holds both units, centred on the pair (`origin = lo − ⌊(n − span) / 2⌋`); otherwise (or with an unknown or `null` target) it holds the caster alone, centred the same way. It is clamped inside the map. Pinned by tests 9, 10, 15 and qa2.
10. **Preview target (RISKY; `foes` required, r2 EA ruling).** `nearestFoe(snap, caster, foes)` returns the id of the nearest living unit (`alive: true`, an integer cell, a string id) whose `side` is a string other than the caster's **and** is in `foes`, by grid steps `|Δc| + |Δr|`, ties by the lower id. The caster's own side never counts, even when listed. A unit whose id equals the caster's is never returned, even on a foe side in a later repeated row. It reads the first 1024 records only. It returns `null` for a missing, sideless or bad-cell caster, or when no unit qualifies. **Who counts as a foe is the host's rule, so `foes` is required: omitting it is a type error** (the cleaner of the two options; no note is added, because a call without the list is a host bug, not a data problem). An untyped caller (JS, or a cast) that passes no array gets `null` and never throws. In r1 an absent `foes` meant any other side, which picked the neutral crate for 3 of the 6 units on the stage-fixed replay (QA risky-probe). Pinned by tests 11 (a type-level check that the third parameter is required, plus the untyped `null`), 12 and 16, and qa2.
11. **One clock.** The link reads no time: the snapshot's `tick` and `clockMs` are ignored. Picture time is the host's `SceneClock` (host guide rule 3). There are no `Math.random`, `Date` or timers, and the same input gives the same output. Pinned by test 12 (two runs, same picture).
12. **The example and the guide.** `tools/host-example/match-picture.ts` drops its own `sceneFromMatch`, `MatchAssets` becomes `MatchArt`, and it calls the src link. It still prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`. The host guide's last recipe sentence names the real link (one line). Gate: run the example.
13. **Scene fence (existing test changed by ruling; per file in r2, QA should-fix (b)).** The scene folder holds exactly `["match-link.ts", "world-scene.ts"]` (a third file fails). The import allow-list is **per file**: `world-scene.ts` may import only `../render/index.ts` and `../../core/notice.ts`, as on the Base; `match-link.ts` may import only `./world-scene.ts` and `../../core/notice.ts`, and every one of its imports must be `import type`. So `match-link.ts` can't import the render index or a value from `world-scene.ts`, and `world-scene.ts` can't import `match-link.ts`. The banned words are unchanged and checked on both files, and each file has its own `assert.throws` extras (`sim`, `hp`, and the new cross imports). Ship the new `tests/runtime/scene/scene-fence.test.ts` byte-identical (§ Tests). Pinned by the fence test, plus QA's `scene-fence-qa` pin (ruling 16) for the two ways round it: a dynamic `import(` and a value `export … from`.
14. **Layering.** `src/runtime/scene` imports nothing from `src/editor` or `src/sim`. Deps go from 111 modules / 355 deps to 112 / 357. No `Card`/`Deck` identifiers, and no hp/mana/cost anywhere in `src/`.
15. **G6 (QA pin adopted, r2).** QA's `tests/runtime/scene/match-link-qa.test.ts` (review `docs/qa/step-ed-e3-review.md` `8c9db130…`, M1; `refs/cmp/ede3-qa-fix-b` `f7f778f5`, QA sha256 `b3401a670a5e37b154a182c23f39a07ccf0d1c2fa0eb27ce8b716e301fc1a2ef`, 33 lines; not `fix-a`, which fails tsc) ships with **one change forced by ruling 10**: its four `nearestFoe(…, "me")` calls gain `["wolves"]` (3 lines; every expected value is unchanged, because its foe is on side `wolves` and the other rows are on the caster's side). Without it the pin fails typecheck under the required `foes`. It pins ruling 3's order and id claim, fresh `at`, a rebuild's units, ruling 8 (a moved rev re-reads in-place units; the first rev re-reads effects), patch edges (ruling 9) and nearestFoe bounds (ruling 10). QA accepted this edit (review `aa3908d3…`, § Pin edit). Cap 37 (QA's). The floor rises 798 → **802**.
16. **G6 (QA fence pin adopted, r3).** QA's `tests/runtime/scene/scene-fence-qa.test.ts` (review `docs/qa/step-ed-e3-review.md` `aa3908d3…`, M1; `refs/cmp/ede3-qa-r2-fix-a` `e0e99a79`; sha256 `2f88a0429de004d3a0de22dbe6cbe62eb884be8b525da11b00b4fcb8b2aa263a`, 15 lines) ships **unchanged**. It closes the fence's two gaps: no file in the scene folder may use a dynamic `import(` (code with strings blanked), and `match-link.ts` may not re-export a value (`export { … } from` or `export * from`; `export type … from` is fine). So match-link's only links are its type imports, and a dynamic `import("../../sim/index.ts")` no longer leans on depcruise alone. It has its own must-fail and must-pass self-checks. Cap 37 (QA's). The floor rises 802 → **803**.

## Rulings (added at merge, QA builds A/B `docs/qa/step-ed-e3-builds.md` 1a62de40)
17. **Pick and G6 adopt (merge time).** QA picks **ChatB** (tip `3970bfd9`, `3970bfd98eb863292370f738f7bc5727fe7b09be`, tree `6e8df49b`, on Base `3aa3551f`; 3 commits `94a8c51`, `f80aac3` the SceneAsset/SceneLayer spelling fix, handback; bundle sha256 `c67aa315…`). Both builds PASS **803/0** and catch **82/82** plants (EA 56 + QA 18 + R1–R8). QA's builds doc is `docs/qa/step-ed-e3-builds.md` (sha256 `1a62de40ef78aee06056c27685b8f6643e82355f8375757850f228b43ab637c5`, 93 lines). The PR head is QA's fix ref **`refs/cmp/ede3b-qa-B-fix-b` `7482c26c`** (`7482c26ccc80321d4c72347929c04f9fcb0b69b5`, tree `a6ae6e67`, parent `3970bfd9`; G-TileEngine noreply author and committer) = ChatB + QA's pin, **no src change**. Bundle `/workspace/share/ede3b-qa-B-fix-b.bundle` sha256 `d50acb49…`. **Status: merged.** PR https://github.com/G-TileEngine/tileengine/pull/57, merge commit **`b28192c7`** (`b28192c78e55b401b9a1201cb12b64ebc27472ec`, tree `14463c06`, parents `5868810b` + `7482c26c`); EA verify-merge PASS 805/0, pins 5/5, smoke 0 failed.
    - **G6:** QA's `tests/runtime/scene/match-link-qa2.test.ts` (18 lines, cap 37, sha256 `cc7f6e1918fde0e8004282ab2dc5af302e01ee5c5b42af921087a7cdd273d2b6`, 2 tests) is adopted as is. It pins ruling 9's per-axis fallback (`{7, ∞}` gives 7 × 2) and ruling 10's never-return-the-caster rule. **Floor raised 803 → 805.**
    - **ChatA not picked** (tip `09f7c19f`, tree `da15053b`): it fails qa2 **0/2**. It gives 3 × 2 for `{7, ∞}` (drops the finite axis) and returns the caster `"me"` when a later row repeats the caster's id on a foe side (proto + B return `w9`; a must-fix on A). Otherwise both builds pass every gate before and after merge-tree onto `5868810b` and catch all 82 plants.
    - **B's handback** declared split 1 (overCap note order) and the typo fix; it did **not** declare split 3 (NaN `art.cols`/`rows`).
    - Evidence (EA verify-merge on main `b28192c7`): green **805/0**; smoke 0 failed; 5 pins unchanged; merge-tree onto main `5868810b` is clean (tree `14463c06`). **292 changed lines** excluding `handback/` (B 274 + QA2 18). qa2 is 2/2 on B and the proto, 0/2 on ChatA (QA builds doc).

## CN / format questions (for DSK and the Librarian; report-only, nothing filed)
- **None needed for E3.** `SceneWorld.rev`, `MatchArt` and `MATCH` are runtime APIs, not saved fields. Snapshots are read as they already are.
- **Later (open question 2):** if a project file should store the `unitId → sprite` map (`MatchArt.sprites`) rather than the host, that's a DSK CN plus a Librarian L-entry (setup-format units). The E6 designer page can use the host's map until then.
- **Later:** world-aware linger (scope bold #6) needs tile tags read at the hit cell, which is **CN-025** (reserved) on top of this link.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/runtime/scene/match-link.ts` | new: `MATCH`, `MatchArt`, `MatchScene`, `MatchLink`, `MatchPatch`, `sceneFromMatch`, `createMatchLink`, `matchPatch` (null on a non-number map), `nearestFoe` (`foes` required) | 93 | 97 |
| `src/runtime/scene/world-scene.ts` | `SceneWorld.rev?`; the unit-key memo and the rev bump of the effects revision | 6 | 10 |
| `tools/host-example/match-picture.ts` | drop the local copy, call the src link (same output) | 29 | 33 |
| `docs/host-guide.md` | the recipe's last sentence names the real link | 2 | 6 |
| `tests/runtime/scene/match-link.test.ts` | new, shipped (8 tests) | 61 | 65 |
| `tests/runtime/scene/match-patch.test.ts` | new, shipped (4 tests) | 49 | 53 |
| `tests/runtime/scene/match-link-qa.test.ts` | new, shipped (4 tests): **G6** QA pin (ruling 15), QA sha256 `b3401a67…a2ef`, shipped sha256 `0fe9d665…` (foes added) | 33 | 37 |
| `tests/runtime/scene/scene-fence-qa.test.ts` | new, shipped unchanged (1 test): **G6** QA fence pin (ruling 16), sha256 `2f88a042…263a` | 15 | 37 |
| `tests/runtime/scene/scene-fence.test.ts` | changed by ruling 13 (per file), shipped byte-identical | 13 | 13 |
| `tests/runtime/scene/match-link-qa2.test.ts` | 0 → 18 / 37 (G6-adopted at merge from QA builds A/B, sha256 `cc7f6e1918fde0e8004282ab2dc5af302e01ee5c5b42af921087a7cdd273d2b6`; 2 tests) | 18 | 37 |
Total ≤ 400 changed lines (proto 301; r1 245 + QA pin 33 + r2 fixes 8 + QA fence pin 15; r3's test 11 change is 1 line swapped in place). Merged ChatB + QA2 (ruling 17): 292. Caps follow STEP-TEMPLATE (proto + 4, QA S1); both QA pins keep QA's cap 37. The fence file is shipped byte-identical, so its cap is its proto. The scope's ~260 estimate is exceeded by the G6 pins only.

## Interfaces to match (quoted exactly; bodies elided)
```ts
// src/runtime/scene/match-link.ts
export const MATCH = { units: 1024, patch: 16, board: { cols: 3, rows: 2 } } as const;
export type MatchArt = {
  readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number;
  readonly assets: Readonly<Record<string, SceneAsset>>; readonly layers: readonly SceneLayer[]; readonly sprites: Readonly<Record<string, string>>;
  readonly objects?: readonly SceneObject[]; readonly style?: SceneWorld["style"]; readonly waterTiles?: SceneWorld["waterTiles"];
};
export type MatchScene = { readonly world: SceneWorld; readonly notes: readonly Notice[] };
export type MatchLink = { world(snap: unknown, art: MatchArt): SceneWorld; readonly notes: readonly Notice[]; readonly builds: number };
export type MatchPatch = { readonly c: number; readonly r: number; readonly cols: number; readonly rows: number; readonly x: number; readonly y: number; readonly w: number; readonly h: number };
export function sceneFromMatch(snap: unknown, art: MatchArt): MatchScene;
export function createMatchLink(): MatchLink;
export function matchPatch(world: SceneWorld, focus: { readonly caster: string; readonly target?: string | null }, want: { readonly cols: number; readonly rows: number }): MatchPatch | null;
export function nearestFoe(snap: unknown, caster: string, foes: readonly string[]): string | null;
// src/runtime/scene/world-scene.ts: SceneWorld gains `readonly rev?: number`; createSceneLink and SceneLink: no signature changes
// tools/host-example/match-picture.ts: `export type MatchAssets = MatchArt`; demo(): unchanged signature and output
```
Note codes are the existing `invalidValue`, `outOfRange`, `unknownRef` and `overCap`. Messages are exactly `snapshot.units`, `units[i]`, `units[i].id`, `units[i].at`, `units[i].unitId`, `units[i].facing` and `units[i].offset`.

## Smoke lines
Unchanged: `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. The host example prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`.

## Existing tests changed by ruling (and only these)
- `tests/runtime/scene/scene-fence.test.ts` (ruling 13, r2): the folder list becomes `["match-link.ts", "world-scene.ts"]` (exact); the one shared `ok` regex becomes a per-file `allow` map (`world-scene.ts`: render index + notice, as on the Base; `match-link.ts`: `./world-scene.ts` + notice, type-only imports); `check` takes the file name; each file gets its own `assert.throws` extras; the title names ED-E3. It ships byte-identical (sha256 below). The banned words and the four Base extras (`sim` import included) are unchanged.

## Tests that prove it is done (17 new + 1 changed; ship all five files byte-identical)
| Shipped file (under `handoff/steps/tests/step-ed-e3-match-link/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/scene/match-link.test.ts` | same path | `e3d06bed049c74f776635181131a992e5497908e573b02749de32c605cc35952` |
| `tests/runtime/scene/match-patch.test.ts` | same path | `0709a6406b86b9a2e647d86be2b47c67eedd83668d121a122c3f49bbac562c45` |
| `tests/runtime/scene/match-link-qa.test.ts` | same path | `0fe9d6654c330cec6d922c151c966b1095f45f647a0d12d75112e985f8ccdc91` |
| `tests/runtime/scene/scene-fence-qa.test.ts` | same path | `2f88a0429de004d3a0de22dbe6cbe62eb884be8b525da11b00b4fcb8b2aa263a` |
| `tests/runtime/scene/scene-fence.test.ts` | same path (replaces it) | `c2d1403f62a2da85379c4edd3f1504875dd3e4f8077295881302f363228977c9` |

`tests/runtime/scene/match-link.test.ts`:
1. "E3 sceneFromMatch (D3 shape): each unit maps to id, sprite by unitId, at, offset, facing, alive; move while offset is set, else idle; the map, objects, style and water come from the art"
2. "E3 sceneFromMatch copies the snapshot: nothing in the world is shared with it, the art's assets and layers are shared by reference, and the same input gives the same output"
3. "E3 sceneFromMatch never throws: a bad row is skipped with invalidValue units[i] (not a record, id or unitId not a string, at not integer cells, alive not a boolean); outside the map is outOfRange; a repeated id keeps the first; a snapshot with no units list gives invalidValue snapshot.units"
4. "E3 sprites: a unitId with no sprite in the art is skipped with one unknownRef per unitId; a prototype key is not a sprite"
5. "E3 facing and offset: absent reads null with no note; a facing outside N/E/S/W/null, or an offset that is not two finite numbers, is null with invalidValue, and a unit with no offset is idle"
6. "E3 cap (law 13): only the first 1024 units are read; more give one overCap snapshot.units"
7. "E3 createMatchLink: the same snapshot and art objects give the same world object back with no rebuild; a new snapshot or new art rebuilds with the next rev; notes are the last build's"
8. "E3 rev (post34 items 18, 19): with a rev and the same units array the scene link skips its per-frame unit key and keeps the scene; a moved rev re-reads an effects list edited in place; without a rev it is today"

`tests/runtime/scene/match-patch.test.ts`:
9. "E3 matchPatch (RISKY, M-B8): a window on the real map that holds the caster and the target when both fit, centred on the pair and clamped inside the map; its pixel box is tiles × tileW / tileH"
10. "E3 matchPatch: a target that does not fit gives the caster's window; size is whole tiles 1–16 and at most the map, NaN gives 3 × 2; an unknown caster or an empty or non-number map is null; a fractional map counts whole tiles; the world is never cropped"
11. "E3 nearestFoe (RISKY): the nearest living unit on a foe side by |dc| + |dr|, ties by id; foes (the foe sides) is required: omitting it is a type error and an untyped call with no list is null; dead, same-side and sideless units are skipped; a missing or sideless caster is null"
12. "E3 end to end (X3 closed, M-B8): a stage-fixed replay's JSON snapshot goes through the link and draws every living unit standing; an effect from a real unit to its nearestFoe travels from the caster's cell and lands on the foe's cell; the same run gives the same picture"

`tests/runtime/scene/match-link-qa.test.ts` (QA pin, G6, ruling 15):
13. "E3 QA: rows skipped as off-map or sprite-less still claim their id; checks run invalid, repeated id, off-map, sprite; at is a fresh {c, r}; a rebuild draws the new snapshot"
14. "E3 QA: a moved rev re-reads units edited in place, and the first rev after frames without one re-reads the effects (ruling 8)"
15. "E3 QA: matchPatch fits a pair only when |Δ| < size; the 3 × 2 default is clamped to the map; a map with no rows is null"
16. "E3 QA: nearestFoe reads only the first 1024 rows and skips rows with no alive: true, a bad cell or a non-string id; a caster with a bad cell is null"

`tests/runtime/scene/scene-fence-qa.test.ts` (QA fence pin, G6, ruling 16):
17. "E3 QA fence (ruling 13): no file in the scene folder uses a dynamic import, and match-link re-exports no value, so its only links are its type imports"

`tests/runtime/scene/match-link-qa2.test.ts` (QA builds A/B, G6 at merge, ruling 17):
18. "E3 QA: a non-finite matchPatch axis falls back on that axis only (3 cols or 2 rows, clamped to the map); the finite axis is kept (ruling 9)"
19. "E3 QA: nearestFoe never returns the caster's own id, even when a later row repeats it on a foe side (ruling 10)"

`tests/runtime/scene/scene-fence.test.ts` (changed, ruling 13): "the scene folder holds world-scene and match-link only; world-scene imports only the render index and the notice type, match-link only types from world-scene and the notice type; no game words, DOM names or wall time (step 31; ED-E3)"

Test 8 counts unit-key work by wrapping `JSON.stringify` (the same probe as `perf-34a.test.ts`), so the unit key must stay a `JSON.stringify` of per-unit arrays starting with the unit id, as on the Base (QA: OK for builders as written; see § Not in this step for the perf-step swap). Test 11 wraps its untyped no-list call in `assert.doesNotThrow` (r3), so a missing `Array.isArray` guard fails by assertion, not by a TypeError. Test 12 imports `src/sim` and `tests/sim/*` (tests may; `src` may not).

You may add tests. The hand-back lists each shipped file's sha256, unchanged.

## How a planted bug is caught (EA plants 56/56, `ede3-plants.py`, run by `proto-check.sh` / `qa-plants.sh --plants-file` against the five shipped files)
| # | Plant | Caught by |
|---|---|---|
| 1 | action never move (offset ignored) | tests 1, 5 |
| 2 | offset dropped | tests 1, 2, 5 |
| 3 | facing dropped | tests 1, 5 |
| 4 | dead units skipped (alive lost) | test 1 |
| 5 | sprite = unitId (sprites map ignored) | tests 4, 7, 13 |
| 6 | prototype key read as a sprite | test 4 |
| 7 | unknown sprite not noted | tests 4, 7, 13 |
| 8 | unknown sprite noted per unit (no dedupe) | test 4 |
| 9 | snapshot shared (at not copied) | tests 2, 13 |
| 10 | snapshot shared (offset not copied) | test 2 |
| 11 | non-integer cell accepted | tests 3, 16 |
| 12 | non-boolean alive accepted | test 3 |
| 13 | off-map unit kept | tests 3, 13 |
| 14 | off-map noted as invalidValue | tests 3, 13 |
| 15 | duplicate id: last wins | tests 3, 13 |
| 16 | duplicate id kept silently | tests 3, 13 |
| 17 | no units list not noted | test 3 |
| 18 | no unit cap | test 6 |
| 19 | overCap not noted | test 6 |
| 20 | absent facing noted | test 5 |
| 21 | absent offset noted | test 5 |
| 22 | bad facing kept | test 5 |
| 23 | non-finite offset kept | test 5 |
| 24 | objects from art dropped | test 1 |
| 25 | water/style from art dropped | test 1 |
| 26 | link never memoises | test 7 |
| 27 | link ignores a new art | test 7 |
| 28 | link sets no rev | tests 7, 8 |
| 29 | scene link ignores rev (unit key every frame) | test 8 |
| 30 | scene link trusts rev alone (units array not checked) | test 8 |
| 31 | moved rev does not re-read effects | tests 8, 14 |
| 32 | rev memo kept without a rev | test 8 |
| 33 | patch ignores the target | test 9 |
| 34 | patch keeps a target that does not fit | tests 10, 15 |
| 35 | patch not clamped inside the map | tests 9, 10, 15 |
| 36 | patch not centred (pair at the left edge) | tests 9, 10, 15 |
| 37 | patch size uncapped | test 10 |
| 38 | patch NaN size not defaulted | tests 10, 15 |
| 39 | patch pixel box uses tileW for y | test 9 |
| 40 | nearestFoe picks the caster's own side | test 11 |
| 41 | nearestFoe ignores foes | tests 11, 12 |
| 42 | nearestFoe picks dead units | tests 11, 16 |
| 43 | nearestFoe tie by last id | test 11 |
| 44 | nearestFoe uses Chebyshev distance | test 11 |
| 45 | rev reuse ignores a changed map size or seed | test 8 |
| 46 | match-link imports the sim (nothing-imports-sim) | the fence test |
| 47 | a game word in the link (hp) | the fence test |
| 48 | matchPatch: a NaN map size is not null (should-fix a) | test 10 |
| 49 | matchPatch: a fractional map size is not floored (should-fix a) | test 10 |
| 50 | match-link imports the render index (per-file fence, should-fix b) | the fence test |
| 51 | match-link value-imports world-scene (per-file fence, should-fix b) | the fence test |
| 52 | nearestFoe: foes optional again (absent = any other side) | test 11 |
| 53 | nearestFoe: no guard for an untyped call without foes (throws) | test 11 (by assertion: `doesNotThrow`) |
| 54 | match-link re-exports a value from world-scene (QA fence pin) | test 17 |
| 55 | match-link dynamic-imports the sim (QA fence pin) | test 17 |
| 56 | world-scene dynamic-imports the render index (QA fence pin) | test 17 |
All 56 fail the shipped tests on the proto's needles. r2 adds 48–49 (should-fix (a)), 50–51 (should-fix (b), the per-file fence) and 52–53 (`foes` required), and re-needles 41 to the r2 text; r3 adds 54–56 (the fence gaps QA's pin closes: a value re-export, and a dynamic import in either file), and test 11's `doesNotThrow` makes 53 an assertion catch; plant 40 (own side) is caught by a new assert in test 11, since a required `foes` no longer reaches the caster's side by default. The tests column was measured per plant with `ede3-plants-map.py` (r3: five test files, test 17 = the QA fence pin; result `ede3-plants-result.txt`). A build with different code needs its own needles (QA rewrites them per build, as at E1 and E2).

**QA's plants: 18/18 live + Q8, Q20 retired** (QA's review: Q8 the memo's assets check is redundant with the scene cache's; Q20 `=== null` vs `== null` is equivalent) on QA's file `qa-ede3-plants.py` (`e1692dbc…`) with EA's r2 needle rewrite of Q11 only (`qa-ede3-plants-r2-needles.py` `66976329…`, Q8 and Q20 commented out: the guard is now `!(world.cols >= 1) || !(world.rows >= 1)`; r3 result `qa-ede3-plants-r3-result.txt`, 18/18). Q1–Q4, Q6, Q7, Q9–Q16 and Q19 are the 15 r1 missed; the QA pin (tests 13–16) catches them:
| # | Plant | Caught by |
|---|---|---|
| Q1 | an off-map or sprite-less row does not claim its id (ruling 3) | test 13 |
| Q2 | sprite checked before off-map (ruling 3 order) | test 13 |
| Q3 | repeated id checked after off-map (ruling 3 order) | test 13 |
| Q4 | at keeps the snapshot's extra keys | test 13 |
| Q5 | units sorted by id (snapshot order lost) | test 6 |
| Q6 | first rev after none does not bump the effects revision (ruling 8) | test 14 |
| Q7 | unit memo reused across a changed rev (units array alone) | test 14 |
| Q9 | patch: a pair exactly n apart counts as fitting (<=) | test 15 |
| Q10 | patch: default 3 x 2 not clamped to a smaller map | test 15 |
| Q11 | patch: a map with rows 0 is not null | tests 10, 15 |
| Q12 | nearestFoe reads past 1024 rows (law 13) | test 16 |
| Q13 | nearestFoe: a unit with alive missing counts as living | test 16 |
| Q14 | nearestFoe: a foe with a bad cell counts at (0, 0) | test 16 |
| Q15 | nearestFoe: a caster with a bad cell reads (0, 0) | test 16 |
| Q16 | nearestFoe: a non-string id can be returned | test 16 |
| Q17 | nearestFoe: ties go to the first row, not the lower id | test 11 |
| Q18 | link memo keyed on the snapshot only (new art reuses) | test 7 |
| Q19 | link world shares the units array with the last build | test 13 |

**QA's r2 plants: 8/8** (QA's file `docs/qa/qa-runs/effect-designer/e3/r2/probes/qa-ede3-plants-r2-new.py`, run as-is on r3; result `qa-ede3-plants-r2-new-r3-result.txt`). R5–R8 are QA's fence plants; R7 and R8 were r2's misses (review M1), now caught by the QA fence pin:
| # | Plant | Caught by |
|---|---|---|
| R1 | matchPatch: r1 guard back (NaN map not null) | test 10 |
| R2 | matchPatch: clamp uses the fractional map | test 10 |
| R3 | nearestFoe: no array guard (untyped call throws) | test 11 (by assertion: `doesNotThrow`) |
| R4 | nearestFoe: own side counts when listed | test 11 |
| R5 | match-link value-imports world-scene | the fence test |
| R6 | match-link type-imports the render index | the fence test |
| R7 | match-link re-exports a value from world-scene | test 17 |
| R8 | match-link dynamic-imports the render index | test 17 |

## Example
On the stage-fixed seed-1 replay to tick 460 (6 × 9 map, 16 px tiles), `sceneFromMatch(JSON.parse(JSON.stringify(snapshot(world))), art)` gives 6 units and no notes, and the scene link draws 6 standing. `knight#1` is at (2, 5), `wolf#3` at (1, 3), `wolf#4` at (4, 3) and the neutral `crate#5` at (3, 4). `nearestFoe(snap, "knight#1", ["wolves"])` is `wolf#3` (3 steps; `wolf#4` is 4). With `["neutral", "wolves"]` it would be the crate `crate#5` (2 steps), which is why `foes` is required. `matchPatch(world, {caster: "knight#1", target: "wolf#3"}, {cols: 5, rows: 4})` is `{c: 0, r: 3, cols: 5, rows: 4, x: 0, y: 48, w: 80, h: 64}`, which holds both. At 3 × 2 the pair is 2 rows apart, so it's the caster's window `{c: 1, r: 5, …, x: 16, y: 80, w: 48, h: 32}`. A fireball `{id: "a", kind: "straight", seconds: 0.6, bend: 0, hold_ms: 300}` cast by `knight#1` on `wolf#3` draws at the knight's cell (32, 80) at 0 ms and on the wolf's cell (16, 48) at 800 ms. Through `createMatchLink`, every frame that redraws the same snapshot reuses one world object, and the scene link skips the unit key (1,024 units: scene p50 0.68 → 0.35 ms, EA desktop probe).

## Decisions note: what to name
`MATCH` values (1024 units, patch ≤ 16 tiles, board 3 × 2); the check order of ruling 3; note once per `unitId`; the first row claims an id; absent facing/offset = null without a note; the patch origin formula and its clamp; distance `|Δc| + |Δr|` with ties by the lower id; `foes` required (the own side never counts); the non-number-map guard `!(world.cols >= 1) || !(world.rows >= 1)` and `Math.floor` of the map size; that `rev` is the link's build count; and the scene memo's key (rev + units array + assets + `cols, rows, tileW, tileH, mapSeed`). Runtime bounds (law 13): the match link keeps **one** entry (the last snapshot, art, world and notes); the scene link keeps **one** unit-key memo; at most 1024 units and 2 × 1024 + 2 notes per build. Neither grows with frames or edits.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 805 passing** (786 + 12 EA + 5 QA + QA2's 2, ruling 17) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto: 803/0; ChatB + QA2: 805/0; deps 112 modules / 357 deps; `check:law OK (src)`.)
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`.
- [ ] `node tools/host-example/match-picture.ts` prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands` and exits 0.
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`.
- [ ] `node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. A `SceneWorld` without `rev` is byte-identical.
- [ ] `git diff 3aa3551f --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty. Pins: `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`. If a core-types or dependency-rule change seems needed, **stop and report**.
- [ ] All five shipped test files are byte-identical to the sha256s above.
- [ ] Each file within its cap; ≤ 400 changed lines in total.
- [ ] No `Math.random`, `Date`, timers or `Card`/`Deck` identifiers; no hp/mana/cost in `src/`. No UI files. `src/runtime/scene` imports nothing from `src/sim` or `src/editor`.
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
786 → **803** (12 new EA tests + 5 QA pin tests, G6: 4 in `match-link-qa`, 1 in `scene-fence-qa`; the fence test is changed, not new) → **805** at merge (QA2's 2 tests, ruling 17). Kit tests under `handoff/` are not run on main until merge.

## Perf (phone floor)
The draw, particle and light caps are unchanged, and nothing is pooled. `sceneFromMatch` at 1,024 units costs p50 ≈ 0.08 ms per rebuild (EA desktop probe, not shipped), and rebuilds happen only when the snapshot changes. The `rev` path halves the scene link's per-frame cost at 1,024 units (0.68 → 0.35 ms p50), because the unit key's per-unit JSON is skipped. Hosts without `rev` pay exactly what they pay today. Far under the 18.3 ms p95 phone line (34b). QA may add a phone run on the S0 page after merge, with a real snapshot behind the strip.

## Not in this step (carries, with their target step)
- The designer page's real-patch strip (camera on `matchPatch`, Turn / Night / 1×–3× chips, the patch picker) → **E6** (scope M8: E6 can ship with the stand-in and switch on the real patch when E3 is in).
- A "saved replay" scrubber in the designer (M-B8's full form: step a replay and cast at any tick) → **E8** (Advanced timeline), on this link plus the host's `replay`.
- World-aware linger (tile tag at the hit cell) → **B-6**, CN-025 (reserved), needs the host's tile tags.
- Reactive ambience ("unit enters cell", Modes idea 7): a snapshot-to-snapshot diff on this link → later bold slice (RISKY).
- A `die` action from a snapshot (the sim keeps no death time, so the link can't time a die clip) → later, with M-B2 impact frames (**E4** carry).
- `turn`/`phases` in the picture (the selection ring, the turn banner): the recipe says take them from the save, not a replay → host / UI, not the link.
- **Perf step (QA Q3 advice):** when a perf step drops the JSON unit key, replace test 8's `JSON.stringify` probe with the visible promise: with the same `rev` and the same units array an in-place unit edit is **not** drawn; with no `rev`, or a moved `rev`, it **is** drawn (QA review § Q3 sketch, the style of `match-link-qa` test 14). Move `perf-34a.test.ts`'s probe to the same style at the same time.
- From QA review (report-only): an off-map caster in a hand-built world gets a window that doesn't hold it (`sceneFromMatch` never emits one); a `NaN` `tileW` gives a NaN box (host bug); a dead caster still gets a patch and a target → **E6** designer page, if it matters there.
- E2 carries (QA builds A/B, the flatten `""` pin, the Travel beat), E1 carries (d), (e), (f), M-B2 and the L50/L51/L52 rev → **E4**, unchanged. (a), (c), (g) and the deps rule stay open as in the E1 doc.

## Out of scope
Game rules (HP, mana, cost, who is a foe) and any sim or core change. Any editor UI. Any format change. CN acceptance is DSK's.

## Do not touch
`src/types/core-types.ts`, `src/core/**`, `src/sim/**`, `src/fx/**`, `src/runtime/render/**` (E3 needs no render change), `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/**`, `tools/painter-proto/**`, `tools/ui-shell/**`, `tools/device-page/**`, the render fence test, every E1 and E2 shipped test. The scene fence test changes only as shipped (ruling 13).

## Open questions
1. (EA → CEO) Ship both RISKY helpers, `matchPatch` (ruling 9) and `nearestFoe` (ruling 10), in E3? Resolved: yes, both ship, with `foes` required (the CEO's own answer in QA's chat, 16:36 London). With the r2 EA ruling, `nearestFoe` requires `foes`, so the designer must always name the foe sides (QA's advice).
2. (EA → DSK/Librarian, later) Should the `unitId → sprite` map (`MatchArt.sprites`) live in the project file (setup-format units) rather than with the host? If so, that's a DSK CN plus a Librarian L-entry before E6. Nothing is filed.
3. (EA → QA) Test 8's `JSON.stringify` probe. **Answered by QA: fine for builders as written**; the swap to a visible-behaviour pin is a perf-step carry (§ Not in this step).

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 805 passing and 0 failing** (ruling 17). Paste the summary line, the smoke line, the host example line, and the sim and stress lines into HANDBACK.md.
- All five shipped test files are **byte-identical** to the sha256s above.
- The bundle is `3aa3551f..step/step-ed-e3-match-link-r<N>` and passes `git bundle verify`. Total changed lines ≤ 400. Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
On branch `step/step-ed-e3-match-link-r<N>` (base `3aa3551f`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). Run `git bundle create step-ed-e3-match-link-r<N>.bundle 3aa3551f..step/step-ed-e3-match-link-r<N>`, then `git bundle verify`. Upload the bundle and HANDBACK.md to the CEO's Drive. Push nothing to GitHub.
