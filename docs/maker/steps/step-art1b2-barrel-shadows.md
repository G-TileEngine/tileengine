# step-art1b2-barrel-shadows: the r6 barrel and every recipe's contact-shadow shapes and scale in the manifest, with the manifest hash pinned (maker overhaul plan ART1b, part 2 of 2)

Step id: step-art1b2-barrel-shadows          Revision: r1 (EA kit, 2026-11-28)
Repo: https://github.com/G-TileEngine/tileengine (you push your own step branch only; see Delivery)
Base commit: **the ART1b1 merge on main** (`step-art1b1-shade-core`; CoS fills in the sha in the go-line). The trial is built on the ART1b1 trial commit `9f76b42d0cfbf80d4865b45d8d53ce3de2f473d8` (tree `50f10b5662b19a9e3ce835751a33856e31e9d4dd`, on `8420f4f8`). CoS checks that the ART1b1 merge's tree equals `50f10b5662b19a9e3ce835751a33856e31e9d4dd` apart from docs, the hand-back and kit folders, and that `art1b2-trial.patch` applies, before the go.
Branch: step/step-art1b2-barrel-shadows-r1-chatA, from the base. Never commit to main. Chief Of Staff opens the PR to main from your pushed branch.
Delivery (CN-028): one builder chat (ChatA), one QA review, and a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). Commit HANDBACK.md as the branch's last commit, then push once with `GH_BUILDER_TOKEN` through a one-shot credential helper (CN-028 § Token; keep the single quotes): `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-art1b2-barrel-shadows-r1-chatA` (that branch only: never main, another branch or a tag; no force-push, no branch delete, no PR actions). The hand-back message quotes the branch, the full tip sha, the Base sha and the test counts. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the branch".
Hand-back location: in the repo, on that branch: handback/step-art1b2-barrel-shadows/r1/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on:
- `docs/maker/ux/maker-overhaul-plan.md`: Plan line numbers are those on main `8420f4f8` (UX's F2a2a/F2a2b plan update, sha256 `45ec3bbe…30ef`). **L76** (the ART1b row: "… the rim pass and contact-shadow shapes; recipes barrel (already pixel-exact in the ART1a trial), rock and lantern …"); **L87** (order); **L88** (the F2a split note); **L89** (art port steps); **L152–L156** (the recipe port; L156: pin every sprite's pixel sha256 to the Python bake's).
- `handoff/dsk-rulings/2026-11-28-art1-palette.md` (on `8420f4f8`, git blob `9999754e`, sha256 `6b094742…c063`): DSK P3 accepts this step's manifest row shape; P2's ART1e carries are recorded below.
- `docs/maker/art-style.md` r3 (sha256 `8f62dd28…fb94`): L29 (soft contact shadows, composited by multiply), § 4 L43 (a recipe returns the sprite, its foot and its shadow shapes).
- `docs/maker/steps/step-art1b1-shade-core.md` r1 (on main with the ART1b1 merge): all its rulings stand. Its Ruling 10 defines the manifest hash; this step pins its values.
- The ART1a guide's Ruling 9 parked the barrel (`handoff/steps/tests/step-art1a-bake-core/parked/barrel.ts`, a port of `b-r6/style_b6.py` `barrel_grid`, pixel-exact in the ART1a trial). This kit carries a copy as `ref/parked-barrel.ts`, for reference only.
- This step's kit: `handoff/steps/tests/step-art1b2-barrel-shadows/` (its `SHA256SUMS` is listed in the paste). ART1b1's kit stays on main.
- Format: none read or written. No `map.tile` or tile-size change.
Read first: the ART1b1 guide; the ART1a kit's `ref/styles-code/b-r6/style_b6.py` (`crate6`, `barrel_grid`, `barrel6`) and `ref/styles-code/recipes.py` (the `shadow` lists of `rock` and `lantern`).

Kit: r1, 2026-11-28. Trial commit `9cc0210d915e7094b89fadfa26b157cc1846cf74` on the ART1b1 trial (tree `9fcc5c95e8aad613b5a6768408933f8ae418af52`). Checked on a fresh GitHub clone: both trial patches apply on `8420f4f8` and give that tree. Green **1212 pass, 0 fail** (1209 + 3), all checks OK. `tsc -p tools/tsconfig.json` shows only the 3 base errors: `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` L156 twice (TS7053). Plants **18/18** caught, and ART1b1's still 38/38. Counted **164** lines. All 25 smokes pass solo at 390 and 360 (25/25 PASS, each at 390 and 360, fresh clone). The four recipes are pixel-identical to the kit's Python reference at 32 and 48 px, and the manifest's shadows, scales and hash equal `ref/expected/ref-art1b2.json`.
Carries folded: (a) the manifest hash's literal values (Ruling 5). Shadow format accepted (Ruling 4). Not folded: see Not in this step.

> Working style (REQUIRED): use all your helper agents for review, tests and cross-checks, take your time, never rush, and self-review against Acceptance and the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
After ART1b2, `node tools/art-bake/bake.ts` bakes the four B r6b props (crate, barrel, rock, lantern) at 32 and 48 px, pixel for pixel the same as the Python. Each manifest row carries the sprite's scale `k` and its contact-shadow shapes, so the engine can draw the soft shadows under each prop (art-style.md L29) when ART2 wires the sprites in. The manifest `hash` is pinned for the default bake and for 32 plus 48. Nothing changes in the app.

## Where step-art1b2-barrel-shadows sits (placement card)
1. No screen: a bake tool only. Lives at: nothing in the app · tap path: none.
2. Changes or replaces: `tools/art-bake/` only (one new recipe), plus 2 lines of ART1b1's test (ruled below).
3. Seen at once: nothing.
4. Data path: written by `node tools/art-bake/bake.ts` to `tools/art-bake/out/` (gitignored) · read by Test/play: nothing · demo data: unchanged · pictures: one art script added (`recipes/barrel.ts`), no PNG committed.
5. Usable on landing: no screen.
6. Proof: the shipped test's pins against `ref/ref-art1b2.py`.

## Rulings
1. **ART1a's and ART1b1's rulings stand.**
2. **The barrel** (`recipes/barrel.ts`): a port of `b-r6/style_b6.py` `barrel_grid` and `barrel6`, line for line, every pixel a locked step (as the crate). `SIZES`: 32 → `w 15, h 20, rxt 6.1, ryt 3.1, ryb 2.4, hoopw 1`; 48 → `w 21, h 29, rxt 8.6, ryt 4.4, ryb 3.4, hoopw 2`. Hoops at `[0.16, 0.78]` (32) and `[0.14, 0.5, 0.82]` (48) of the body; stave seams at sin of −60, −30, 0, 30 and 60 degrees; materials `barrel` and `steel8`. Python's `round()` is `roundEven` (from `blocks.ts`). The parked port in `ref/parked-barrel.ts` gives the same pixels; you may start from it but must match this step's caps, Rule 8 and Plant anchors. **Port tolerance: zero.** Pins: barrel 32 is 17×22, foot 9,21, sha256 `3cece1b7…80d2`; barrel 48 is 23×31, foot 12,30, sha256 `9be6b109…f60c`.
3. **Recipes return `Made`** (art-style.md § 4 L43: a recipe returns the sprite, its foot and its shadow shapes). `sprite.ts` gains, exactly, `Shadow` (`["e", cx, cy, rx, ry]`, an ellipse, or `["p", [[x, y], …]]`, a polygon) and `Made` (`{ sprite, k, shadow }`) (Interfaces). Shadow numbers are **base px from the foot**, x to the right and y **up** (negative is below the foot), as `recipes.py` returns them; to draw one, a pixel is `foot + (x, −y) · k`. Every recipe returns its Python `k` and shadow list unchanged:
   - `crate6(tile)` in `recipes/crate.ts` (`const SCALE = 1.3`; `w = grid width / k / 2`): `[["e", 1.6, -0.3, w + 1.6, 2.4], ["p", [[w - 0.4, 0.4], [w + 2.6, -0.2], [w + 2.6, -5.0], [w - 0.4, -6.4]]]]`. `crate(tile)` itself is unchanged.
   - `barrel6(tile)` (`SCALE` 1.3; `w = SIZES[tile].w / k / 2`): `[["e", 1.4, -0.5, w + 1.2, 2.2], ["p", [[w - 0.8, 0.2], [w + 2.0, -0.6], [w + 1.6, -5.0], [w - 1.2, -6.0]]]]`.
   - `rock`: `[["e", 3 * g, -0.8, 7 * g, 2.6 * g]]`; `lantern`: `[["e", 3, -0.5, 4, 1.5]]`.
   `k` is `(tile / 32) * SCALE` everywhere (so 48 px gives `1.9500000000000002` in JSON, as Python writes it).
4. **The manifest and contact shadows** (`bake.ts`; UX 2026-11-28 and DSK P3). `RECIPES` is `Readonly<Record<string, (tile: Tile) => Made>>` = `{ crate: crate6, barrel: barrel6, rock, lantern }` (that order). `Baked` and `ManifestRow` gain `k` and `shadow`; a row's keys are, in order, `name, tile, file, w, h, foot, k, shadow, sha256`. **UX has accepted this format, with no shadow PNGs in the pack.** ART2's review sheet composites the shapes at ×0.62. DSK P3 accepts the row shape as written: shadow entries are `["e", cx, cy, rx, ry]` or `["p", [[x, y], …]]`, base px from the foot, x right, y **up**. The manifest is generated output and is never authored; `k` may live there as output for consumers. Nothing is rasterised.
5. **The manifest hash, pinned (carry a).** The definition is ART1b1's Ruling 10 and is unchanged: a **pixel fingerprint for CI**, like project-format §6.2.5 `lookHash`, **not** a document sha256 (DSK P3). With the recipe list complete, the shipped test pins: default tiles `[32]` → `d12bc6625b1b089be5d2cf4a3608910966a0d9967ca50c8ab2cb21172470f2c6`; `[32, 48]` → `ef216fc42063bf0f373386a8b1a12fb7787dea964a6abdc7879acd3e067f1d21`. A recipe added later (ART1c onwards) changes these values by ruling in that step.
6. **Existing test changed by ruling**: `rock` now returns `Made`, so ART1b1's big-rock pins take `.sprite` (Existing tests changed). Nothing else in ART1b1's test changes.
7. **Python reference** (optional; the pins are literals): `PYTHONDONTWRITEBYTECODE=1 python3 handoff/steps/tests/step-art1b2-barrel-shadows/ref/ref-art1b2.py [png-dir]` from the repo root. It imports the ART1a kit's frozen Python.
8. **The kit's bytes are not counted**: `handoff/steps/tests/step-art1b2-barrel-shadows/` (15 files plus `SHA256SUMS`) is pushed by CoS. Copy only the shipped test, verbatim; it counts.

## Files to create or change
- create `tools/art-bake/recipes/barrel.ts` (Ruling 2)
- change `tools/art-bake/recipes/crate.ts`, `recipes/rock.ts`, `recipes/lantern.ts` (Ruling 3)
- change `tools/art-bake/sprite.ts` (2 types; Ruling 3)
- change `tools/art-bake/bake.ts` (Ruling 4)
- change `tests/tools/art1b1-shade-core.test.ts` (2 lines; Ruling 6)
- create `tests/tools/art1b2-barrel-shadows.test.ts` (the kit's file verbatim)
(Nothing else. An extra file must be named and justified in the Decisions note, or it is a REJECT.)

Size: the trial changes **164** lines (+146/−18) in 8 files against the ART1b1 trial (same count as ART1b1).

| File | + | − | Trial / cap |
|---|---|---|---|
| `tools/art-bake/recipes/barrel.ts` | 68 | 0 | 68 / 72 |
| `tools/art-bake/recipes/crate.ts` | 10 | 1 | 11 / 12 |
| `tools/art-bake/recipes/rock.ts` | 3 | 3 | 6 / 6 |
| `tools/art-bake/recipes/lantern.ts` | 3 | 3 | 6 / 6 |
| `tools/art-bake/sprite.ts` | 2 | 0 | 2 / 2 |
| `tools/art-bake/bake.ts` | 10 | 9 | 19 / 20 |
| `tests/tools/art1b1-shade-core.test.ts` | 2 | 2 | 4 / 4 |
| `tests/tools/art1b2-barrel-shadows.test.ts` | 48 | 0 | 48 / 48 |
| **Total** | 146 | 18 | **164 / 170** (ART1b2's limit is the caps' sum, **170**) |

Over any cap or the limit = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Interfaces to match (quoted exactly)
```ts
// tools/art-bake/recipes/barrel.ts
export function barrelGrid(tile: Tile): Grid;
export function barrel6(tile: Tile): Made;
// tools/art-bake/recipes/crate.ts
export function crate(tile: Tile): Grid;
export function crate6(tile: Tile): Made;
// tools/art-bake/recipes/rock.ts
export function rock(tile: Tile, seed = 1, big = false): Made;
// tools/art-bake/recipes/lantern.ts
export function lantern(tile: Tile): Made;
// tools/art-bake/bake.ts
export const RECIPES: Readonly<Record<string, (tile: Tile) => Made>> = { crate: crate6, barrel: barrel6, rock, lantern };
export const DEFAULT_TILES: readonly Tile[] = [32];
export type Baked = { readonly sprite: Sprite; readonly k: number; readonly shadow: readonly Shadow[]; readonly rgba: Uint8Array; readonly sha256: string };
export type ManifestRow = { readonly name: string; readonly tile: Tile; readonly file: string; readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly k: number; readonly shadow: readonly Shadow[]; readonly sha256: string };
export function bakeOne(name: string, tile: Tile): Baked;
export function bakeAll(outDir: string, tiles: readonly Tile[] = DEFAULT_TILES): ManifestRow[];
```
`sprite.ts` adds exactly these two lines (after `Sprite`):
```ts
export type Shadow = readonly ["e", number, number, number, number] | readonly ["p", readonly (readonly [number, number])[]];
export type Made = { readonly sprite: Sprite; readonly k: number; readonly shadow: readonly Shadow[] };
```
`lidStep` is private to `barrel.ts`; its body is yours inside the caps if the pins and plants hold.

## Smoke lines
None for the builder: no maker, play-stage or export file changes. HANDBACK § Smoke says "Not run: no UI or export file changed". EA ran all 25 solo at 390 and 360 on the trial: all pass.

## Existing tests changed by ruling (and only these)
`tests/tools/art1b1-shade-core.test.ts`:
  - L28: `assert.equal(sha(colourise(rock(32, 3, true))), "04306148e0152c8cb10955adea9d9188e677eb5d95d6e350bec928b761ba4ec4");` / `assert.equal(sha(colourise(rock(48, 3, true))), "2a91ed0aa64c61cb7dbcda855ed823039686584689f9d6b86eaef94ba86e3f4e");` → `assert.equal(sha(colourise(rock(32, 3, true).sprite)), "04306148e0152c8cb10955adea9d9188e677eb5d95d6e350bec928b761ba4ec4");` / `assert.equal(sha(colourise(rock(48, 3, true).sprite)), "2a91ed0aa64c61cb7dbcda855ed823039686584689f9d6b86eaef94ba86e3f4e");`

## Tests that prove it is done
Copy `handoff/steps/tests/step-art1b2-barrel-shadows/tests/tools/art1b2-barrel-shadows.test.ts` to `tests/tools/art1b2-barrel-shadows.test.ts` **verbatim** (sha256 `457c023621dddb3aa1ed9b8427d38961c76e8627fb3a9356e0bda1c02b1c3ed7`, 48 lines). 3 tests:
- "ART1b2 port check: the r6 barrel bakes pixel for pixel the same as the B r6b Python at 32 and 48 px, after the crate in RECIPES"
- "ART1b2 contact shadows: each recipe's shapes in base px from the foot, scaled by k at placement, as the Python returns them"
- "ART1b2 manifest: rows carry k and shadow, and the hash pins every sprite's RGBA bytes in RECIPES order then tile order"
Floor: **1209 + 3 = 1212**.

## How a planted bug is caught (for QA)
`handoff/steps/tests/step-art1b2-barrel-shadows/plants-art1b2.py` (sha256 `f7eb6f0763af96b353303f2425c1ac95da6e58d1a74eb0ca59a20d2ce6c50746`, 37 lines), run from the repo root on a clean ART1b2 tree: **18/18 caught**. They are: Q1 the barrel's rim ring narrower at 32; Q2 no lid planks at 48; Q3 every hoop pixel lit as the hoop's top row; Q4 the body doesn't bulge; Q5 stave seams evenly spaced, not by angle; Q6 no shade at the barrel's base; Q7 the 32 px hoops moved; Q8 the 48 px lid narrower; Q9 the barrel's wood drawn as crate; Q10 the hoops drawn in wood; Q11 the rim lip shadow thinner; Q12 the barrel's shadow polygon moved; Q13 the crate's shadow ellipse taller; Q14 the crate's scale changed; Q15 the big rock's shadow not scaled; Q16 the lantern's scale changed; Q17 the manifest drops the shadow; Q18 RECIPES order changed. ART1b1's `plants-art1b1.py` (on main) must still catch all of its plants on this tree (38/38 in the trial).
Equivalent mutant (EA, for QA): `Math.round` in place of `roundEven` on the hoop and stave steps changes no barrel pixel at 32 or 48 (no exact half lands there); it stays for fidelity with Python's `round()`.

## Plant anchors (quoted exactly; each appears exactly once in its file)
- `tools/art-bake/recipes/barrel.ts`: `(tile === 48 ? 0.66 : 0.6)` · the whole line ``  return plank ? st - 1 : st;`` · `onHoop = hit ? py - (yc - d.hoopw / 2) < 1.0 : onHoop;` · the whole line ``  const bulge = d.w / 2 - 1 - d.rxt;`` · `Math.sin(deg * (Math.PI / 180))` · the whole line `` - (base ? 1 : 0);`` · `[0.16, 0.78]` · `rxt: 8.6,` · `put(g, x, y, "barrel", st);` · `put(g, x, y, "steel8", clamp(` · `(py - ytop < 1.0 ? 1 : 0)` · `[w + 2.0, -0.6]`
- `tools/art-bake/recipes/crate.ts`: `["e", 1.6, -0.3, w + 1.6, 2.4]` · `const SCALE = 1.3;`
- `tools/art-bake/recipes/rock.ts`: `["e", 3 * g, -0.8, 7 * g, 2.6 * g]`
- `tools/art-bake/recipes/lantern.ts`: `const SCALE = 1.25;`
- `tools/art-bake/bake.ts`: `foot: sprite.foot, k, shadow, sha256 });` · `{ crate: crate6, barrel: barrel6, rock, lantern }`

## Example
`node tools/art-bake/bake.ts /tmp/b 32 48` prints eight lines in the order crate, barrel, rock, lantern (each 32 then 48), the barrel's as `barrel-32.png 17x22 foot 9,21 3cece1b7…` and `barrel-48.png 23x31 foot 12,30 9be6b109…`. `/tmp/b/manifest.json` has `"hash": "ef216fc42063bf0f373386a8b1a12fb7787dea964a6abdc7879acd3e067f1d21"`, and its barrel 32 row has `"k": 1.3` and the shadow `["e", 1.4, -0.5, 6.969230769230769, 2.2]` then the polygon. The barrel is a warm wooden cask with an elliptical lid, curved staves and steel hoops, lit from the top-left.

## Decisions note: what to name
- Any helper you add (inside the caps); how `barrel.ts` relates to `ref/parked-barrel.ts` (copied, adapted or rewritten).
- Constants (law 12): `SCALE` 1.3 for crate and barrel; every shadow number is the Python's (Ruling 3), none chosen here.
- That nothing reads `ref/` at test time.

## Do not touch
- Everything in ART1b1's Do not touch list, plus `tools/art-bake/palette.json`, `palette.ts`, `blocks.ts` and `png.ts`; the body of `crate()` in `recipes/crate.ts`; the shade code in `sprite.ts`.
- Any smoke, the ART1a test, any other existing test. No dependency, committed PNG or file under `handoff/`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least **1212** tests passing.
- [ ] `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors: `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` L156 twice (TS7053).
- [ ] The shipped test is byte-identical to its listed sha256; `plants-art1b2.py`: 18/18 caught; `plants-art1b1.py`: 38/38 caught.
- [ ] `node tools/art-bake/bake.ts /tmp/b 32 48` prints the eight pinned lines and the manifest hash above; `cd handoff/steps/tests/step-art1b2-barrel-shadows && sha256sum -c SHA256SUMS` passes.
- [ ] `git diff --name-only <base>` lists only the 8 files in Files (plus `handback/**`).
- [ ] Each file within its cap; at most **170** counted lines (trial 164).
- [ ] Rule 8 as in ART1b1.
- [ ] Hand-back complete per handoff/HAND-BACK.md, with § Green, § Plants (both scripts), § Port check (the eight lines and the hash), § Smoke ("Not run"), § Rule 8 scan, § Size and § Helpers & self-review.

## Not in this step (carries)
- The lighting and weather passes and the multiply `Blend`: the engine's composite after the port (art-style.md § 4 item 4). No shadow PNGs in the pack (Ruling 4).
- The four smokes' trailing spaces (s4b L27, s5b L27, s5c L28, s6a L28) and the maker UI carries (UX open point 9 at `tools/maker/game-menu.ts` L30; `state.problems` has no reader; "–" instead of 0 on an unparsed project; the `sectionSheet` type): **still open**, as in ART1b1.
- **ART1e carries:** ART1e generates the paint-style ramps from `palette.json` (the single source of truth) into a **new** style `@version`; `btf-ashroad@2` and `btf-moonlit@2` never change. Mapping: grass→grass, dirt→dirt, stone→stone, rock→stone, water→water. **bloom is OPEN:** UX says `petal_pink`, DSK says `[fl_purple, fl_pink, fl_white]` (luma 124, 136, 239); EA has asked them to settle it. The **2–8 step bound** for paint-style ramps (project-format §6.2.5) is checked in ART1e when it writes the style (ART1b1 already checks 1–9 for every bake ramp). `fl_*` ramps stay bake-only.
- **ART2 carry:** a project has no shadow or `k` field, so drawing shadows from project data needs a format ruling and a CN first, plus a conversion from y-up to y-down. Don't copy manifest fields into AssetMeta ad hoc. Until then, the art-bake manifest stays the link (DSK P3; 2026-11-27-art-f3 A1). ART2's review sheet composites the shapes at ×0.62 (Ruling 4).
- Stamps, trees, bushes, fence: ART1c. Houses (`Spr.poly`) and units: ART1d. Ground, water, edges: ART1e.

## Out of scope
- Any screen, project, format, play or maker change. Any new art.

## Open questions
1. (UX and DSK; already asked) **bloom mapping for ART1e.** UX says `petal_pink`; DSK says `[fl_purple, fl_pink, fl_white]` (luma 124, 136, 239). ART1e needs one answer.
