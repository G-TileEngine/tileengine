# step-art1b1-shade-core: the shade core of the art bake (law 12, palette checks, shared blocks, shape fills, rim and bias) with the rock and lantern as its recipes (maker overhaul plan ART1b, part 1 of 2)

Step id: step-art1b1-shade-core          Revision: r1 (EA kit, 2026-11-28)
Repo: https://github.com/G-TileEngine/tileengine (you push your own step branch only; see Delivery)
Base commit: main **`8420f4f8071d207a7d3ff280d147ed2d76b57fc7`** (tree `bab9df09`). On `b6a7165a` (tree `fd86337a`, itself docs-only on the F2a2b merge `79fb46f6`, PR #118, tree `dd5b1b85`) it adds only docs: UX's plan update and `handoff/dsk-rulings/2026-11-28-art1-palette.md`. Checked from a fresh `/tmp` clone: `b6a7165a..8420f4f8` touches only `docs/maker/ux/maker-overhaul-plan.md` and `handoff/dsk-rulings/2026-11-28-art1-palette.md` (git blob `9999754e`). Green on the base is **1204 pass, 0 fail**, all checks OK. If main has moved by the go, CoS re-checks that the move is docs-only and that the trial patch applies.
Branch: step/step-art1b1-shade-core-r1-chatA, from the base. Never commit to main. Chief Of Staff opens the PR to main from your pushed branch.
Delivery (CN-028): one builder chat (ChatA), one QA review, and a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). Commit HANDBACK.md as the branch's last commit, then push once with `GH_BUILDER_TOKEN` through a one-shot credential helper (CN-028 § Token; keep the single quotes): `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-art1b1-shade-core-r1-chatA` (that branch only: never main, another branch or a tag; no force-push, no branch delete, no PR actions). The hand-back message quotes the branch, the full tip sha, the Base sha and the test counts. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the branch".
Hand-back location: in the repo, on that branch: handback/step-art1b1-shade-core/r1/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on:
- `docs/maker/ux/maker-overhaul-plan.md`: Plan line numbers are those on main `8420f4f8` (UX's F2a2a/F2a2b plan update, sha256 `45ec3bbe…30ef`). **L76** (the ART1b row, quoted: "| ART1b | Shared blocks and simple props (builder) | Seeded noise (`hash2`, `vnoise`, `fbm`), sphere light, banded ramps, shape fills, the rim pass and contact-shadow shapes; recipes barrel (already pixel-exact in the ART1a trial), rock and lantern | 330–390 (estimate; the EA re-sizes in its kit) | § (g) |"); **L87** (the order line: "… F1 → ART1a → F2a (F2a1, F2a2a, F2a2b) → ART1b → F2b → ART2 …"); **L88** (the F2a split note); **L89** (EA's note: ART1c, ART1d and ART1e run after ART1b and before ART2; their place among the F steps is CoS's call with the CEO); **L152–L156** (the recipe port; L154: "ART1b adds the shared blocks and simple props (330–390) … the EA re-sizes each in its kit"; L156: each step's shipped test re-bakes in memory and pins every sprite's pixel sha256 to the Python bake's).
- `handoff/dsk-rulings/2026-11-28-art1-palette.md` (on `8420f4f8`, git blob `9999754e`, sha256 `6b094742…c063`): palette contract, ART1e source of truth, and the manifest row shape (folded in Ruling 3 and Ruling 10).
- `docs/maker/art-style.md` r3 (sha256 `8f62dd28…fb94`): § 1 L20 (deterministic), § 2 L25 (pixel mode), L28 (rim light), L29 (shadows), § 3 (one palette file), § 4 L43–L47 (recipes and shared blocks), § 5 (port check).
- `docs/maker/steps/step-art1a-bake-core.md` r2 (sha256 `a3faaa3c…ff6f`): Rulings 1–12 stand unless a ruling below changes them; L171 sends the shared blocks to ART1b, and L174 is the law-12 carry folded here.
- **EA re-size (CoS's re-size of ART1b: noise, sphere, ramps, shape fills, rim and shadows, plus the barrel, rock and lantern, 330–390).** The trial came to 494 counted lines as one step, over the 400 gate, so **ART1b runs as ART1b1 (this step) then ART1b2** (`step-art1b2-barrel-shadows`: the r6 barrel and the contact-shadow shapes), which follows on this step's merge (`SPLIT.md`, box).
- The ART1a kit, already on main: `handoff/steps/tests/step-art1a-bake-core/` (the frozen Python in `ref/styles-code/`). This step's kit: `handoff/steps/tests/step-art1b1-shade-core/` (its `SHA256SUMS` is listed in the paste).
- Format: none read or written (tile-project 6, stage 2, no bump). `map.tile` and the tile-size setting are F3a's and are not touched.
Read first: BUILD_GUIDE.md §2 (law 12), §6, §7; the ART1a guide in full; plan L76 and L152–L156 (UX plan update 45ec3bbe); the ART1a kit's `ref/styles-code/common.py` (`hash2`, `vnoise`, `fbm`, `ramp_q`, `Spr`, `sphere`, `outline_masks`), `ref/styles-code/engine.py` (`colourise`), `ref/styles-code/recipes.py` (`rock`, `lantern`) and `ref/styles-code/b-r2/style_b2.py` L102–L103 (`S`: `scale`, `rim`, `bias`).

Kit: r1, 2026-11-28. Trial commit `9f76b42d0cfbf80d4865b45d8d53ce3de2f473d8` on `8420f4f8` (tree `50f10b5662b19a9e3ce835751a33856e31e9d4dd`). Checked on a fresh GitHub clone: `art1b1-trial.patch` applies on `8420f4f8` and gives the same tree. Green **1209 pass, 0 fail** (1204 + 5), all checks OK. `tsc -p tools/tsconfig.json` shows only the 3 base errors: `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` L156 twice (TS7053). Plants **38/38** caught. Counted **352** lines. All 25 smokes pass solo at 390 and 360 (25/25 PASS, each at 390 and 360, fresh clone). The rock and lantern are pixel-identical to the kit's Python reference at 32 and 48 px (the shipped test's pins equal `ref/expected/ref-art1b1.json`).
Carries folded: (a) the manifest hash definition (Ruling 10), (b) law 12 in `sprite.ts` and `rgb()` (Ruling 4), (c) the palette contract (Ruling 3: 1–9 steps, strictly lighter luma, no repeat, no #000000 or #ffffff). Not folded (see Not in this step): the four smokes' trailing spaces, the maker UI carries, and the ART1e / ART2 carries listed in the ART1b2 guide.

> Working style (REQUIRED): use all your helper agents for review, tests and cross-checks, take your time, never rush, and self-review against Acceptance and the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
ART1a ported the bake core and the crate: every crate pixel is a locked ramp step. The B r6b recipes for the simple props instead paint shapes with a float shade per pixel, then band it onto the ramp with a warm rim and a per-material bias. After ART1b1:
- `tools/art-bake/blocks.ts` holds the shared blocks of `common.py` (seeded `hash2`, `vnoise`, `fbm`, the one sun's `sphere`, the banded ramp step and Python's half-to-even rounding), equal to the Python to the last bit;
- `tools/art-bake/sprite.ts` gains the shape canvas (Python `Spr`: ellipse and rect fills in base px scaled by k, a float32 shade per pixel, glows that take no outline), and colourise gains the shade pass (bias, rim, banding) beside ART1a's locked steps;
- the palette is checked at load (#rrggbb colours, non-empty ramps, known names) and the black `?? [0, 0, 0]` fallbacks are gone;
- two recipes are ported, the rock and the lantern, pixel for pixel the same as the Python at 32 and 48 px, proved in green;
- the manifest `hash` is defined for ART2 to read.
Nothing changes in the app.

## Where step-art1b1-shade-core sits (placement card)
1. No screen: a bake tool only. Lives at: nothing in the app · tap path: none.
2. Changes or replaces: `tools/art-bake/` only (one new module, two new recipes), plus 4 lines of ART1a's test (ruled below).
3. Seen at once: nothing.
4. Data path: written by `node tools/art-bake/bake.ts` to `tools/art-bake/out/` (gitignored) · read by Test/play: nothing (no file under `src/`, `tools/maker`, `tools/play-stage` or `tools/export` imports the rig) · demo data: unchanged · pictures: two art scripts added (`recipes/rock.ts`, `recipes/lantern.ts`), no PNG committed.
5. Usable on landing: no screen; a builder or QA runs the bake and the shipped test.
6. Proof: the shipped test's pixel pins against the kit's Python reference (`ref/ref-art1b1.py`, with its PNGs in `ref/expected/`).

## Rulings
1. **ART1a's rulings stand** (language, own package and fence, determinism, PNG writer, tile argument, Rule 8 as ART1a Ruling 11, kit bytes not counted), except where a ruling below changes them.
2. **Palette: two keys added** (art-style.md § 3: one palette file). `tools/art-bake/palette.json` becomes the kit's `files/tools/art-bake/palette.json`, **copied verbatim** (sha256 `da5ff0aeace540b1a6df9c3211ca9f2a15cd2047ebd922e692aceaba067b4f6b`, 47 lines). After `outlineBy` it gains `"rim": 0.16,` and `"bias": { "steel": -0.16, "stone": -0.1 },`: the r6b chain's `S["rim"]` and `S["bias"]` (`b-r2/style_b2.py` L103, unchanged through `b-r6b`). `ref/ref-art1b1.py` asserts both against the chain. The `Palette` type gains `readonly rim: number;` and `readonly bias: Readonly<Record<string, number>>;` (Interfaces). Recipes still name materials only.
3. **Palette checks (carry c; UX 2026-11-28 and DSK `handoff/dsk-rulings/2026-11-28-art1-palette.md`, sha256 `6b094742…c063`, git blob `9999754e`; EA merge of the two rulings).** `checkPalette(p)` runs at load (`PALETTE` is `checkPalette(JSON.parse(…))`). The r6b baseline `palette.json` (sha256 `da5ff0aeace540b1a6df9c3211ca9f2a15cd2047ebd922e692aceaba067b4f6b`, 38 ramps) must pass unchanged, and does. The checks, each of which throws (law 12):
   - **#rrggbb only**, as in Ruling 4: every ramp colour, `outline.colour` and every `outlineBy` colour passes `rgb()`.
   - **1 to 9 steps** for every ramp, including accent ramps. 0 or 10 steps throws `` Error(`art-bake: ramp "${name}" has ${n} steps, must be 1 to 9`) ``. art-style.md L25's "4–8 steps" is an authoring guide, not a check (DSK P1). The **2–8 bound for paint-style ramps** (project-format §6.2.5) is an **ART1e carry**, checked when ART1e writes the style.
   - **Strictly lighter, and no repeated colour.** `luma(c)` is integer Rec.709 luma on the sRGB bytes, `Math.round(0.2126 * R + 0.7152 * G + 0.0722 * B)` (DSK's formula; JavaScript `Math.round`, half toward +∞; no sRGB-to-linear step). Each step's luma must be **strictly greater** than the one before (UX's strictness). A 1-step ramp passes. All 38 baseline ramps are strictly increasing; none has two consecutive steps with equal integer luma, so the fallback (non-decreasing luma plus no-repeat) is not used. Equal luma on different colours throws `` Error(`art-bake: ramp "${name}" is not strictly lighter at "${hex}"`) ``. A repeated colour (case-insensitive) is a **separate** check, before luma, and throws `` Error(`art-bake: ramp "${name}" repeats colour "${hex}"`) ``.
   - **No #000000 or #ffffff** anywhere a colour appears in `palette.json`: ramps, `outline.colour` and `outlineBy` (either case). Throws `` Error(`art-bake: colour "${hex}" is pure black or white`) ``. `rim` is a number (0.16), not a colour, so there is no rim colour to ban. Near-black and near-white are allowed (`#010000` is the test's witness). **ART1a's existing test stays**, and still bans both in every ramp.
   - Known names: every `outlineBy` and `bias` name has a ramp, else `` Error(`art-bake: ${what} names "${name}", which has no ramp in palette.json`) `` with `what` `outlineBy` or `bias`.
   **The rest of the UX and DSK ruling, recorded here:** `palette.json` is the **single source of truth** (art-style.md § 3). The pack's paint-style ramps are generated by the bake later (**ART1e**). UX's proposed mapping (pending DSK's fit check) is grass→grass, dirt→dirt, stone→stone, rock→stone, water→water, bloom→petal_pink. DSK maps bloom to `[fl_purple, fl_pink, fl_white]` instead; **bloom is OPEN**, carried in the ART1b2 guide, for UX and DSK to settle. `fl_*` ramps stay bake-only. ART1e writes the generated ramps into a **new** style `@version`; `btf-ashroad@2` and `btf-moonlit@2` never change (DSK P2).
4. **Law 12 (carry b; BUILD_GUIDE §2 law 12).** On the base, `sprite.ts` **L59** `const dark = ramp(name)[0] ?? [0, 0, 0];` (the outline's darkest step) and **L75** `const c = m !== null ? ramp(m)[s.step[i] ?? 0] ?? [0, 0, 0] : outlineRgb(name);` (a missing step in colourise) fall back to black. CoS's L59/L75 are right. Both go through `stepOf(name, step)` in `palette.ts`, which returns `ramp(name)[step]` or throws `` Error(`art-bake: ramp "${name}" has no step ${step}`) ``. No `?? [0, 0, 0]` is left in `sprite.ts` (the shipped test greps it). `rgb(hex)` throws `` Error(`art-bake: colour "${hex}" is not #rrggbb`) `` unless `hex` matches `/^#[0-9a-f]{6}$/i` (a `#` and exactly six hex digits, either case, nothing before or after). The pixel reads in new code go through `at(list, i)`, which throws `` Error(`art-bake: pixel ${i} is outside the sprite`) ``. ART1a's own `?? null` and `?? 0` on in-range array reads (base L25, L30, L41, L46, L72, L73) stay as they are: they are TypeScript `noUncheckedIndexedAccess` shims on an index below the length and can't fire. Don't touch them.
5. **Shared blocks** (`blocks.ts`; art-style.md § 4 L44–L47), the same operations in the same order as `common.py`, because float results depend on the order:
   - `clamp(v, lo, hi)` is `Math.min(Math.max(v, lo), hi)`. `roundEven(v)` is Python's `round()` and numpy's `rint()`: half to even (`Math.round` otherwise).
   - `hash2(i, j, s)`: `h = (imul(i, 374761393) + imul(j, 668265263) + imul(s, 1442695041)) >>> 0`, `m = imul(h ^ (h >>> 13), 1274126177) >>> 0`, result `((m ^ (m >>> 16)) >>> 0) / 4294967296`. The Python's int64 products masked to 32 bits are exactly the low 32 bits that `Math.imul` gives.
   - `vnoise(x, y, sc, s)`: `u = x / sc`, `v = y / sc`, the four corner hashes, `sx = fx * fx * (3 - 2 * fx)` (and `sy`), result `a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy`.
   - `fbm(x, y, sc, s, oct = 4)`: `t = t + amp * vnoise(x, y, sc / 2 ** o, s + o * 31)`, `tot += amp`, `amp *= 0.5`, result `t / tot`.
   - `LIGHT` is `[-0.55, -0.62, 0.56]` divided by `Math.sqrt(0.55 * 0.55 + 0.62 * 0.62 + 0.56 * 0.56)` (bit-equal to numpy's `norm`, pinned). `sphere(nx, ny)`: `z = Math.sqrt(clamp(1 - nx * nx - ny * ny, 0, 1))`, result `0.5 + 0.5 * (nx * LIGHT[0] + ny * LIGHT[1] + z * LIGHT[2])`.
   - `band(t, n)` is `ramp_q`'s step: `roundEven(clamp(t, 0, 1) * (n - 1))`.
   - Not ported: `ramp_lerp` (painted mode only; B r6b is pixel mode and no recipe calls it; plan L76 lists banded ramps only) and `Spr.poly` (PIL's polygon fill; no ART1b recipe uses it, and the houses in ART1d need it).
   `hash2`, `vnoise` and `fbm` have no recipe caller yet (the rock uses `hash2` only); the shipped test pins them to the Python, so ART1c and ART1e build on checked blocks.
6. **The shape canvas** (`sprite.ts`; Python `Spr`). `newCanvas(w, h, ax, ay, k)`: width `roundEven(w * k)`, height `roundEven(h * k)` (Python `int(round(…))`: the lantern at 32 is 12.5 → **12** wide), every pixel empty, shade 0, not a glow. Pixel `(x, y)` has its centre at `X = (x + 0.5) / k`, `Y = (y + 0.5) / k` in base px. `ellipse(c, cx, cy, rx, ry, mat, f, nol = false)` fills the pixels with `nx * nx + ny * ny <= 1.0`, where `nx = (X - cx) / rx` and `ny = (Y - cy) / ry`. `rect(c, x0, y0, x1, y1, mat, f, nol = false)` fills `x0 <= X < x1` and `y0 <= Y < y1`, with `nx = (X - x0) / Math.max(x1 - x0, 1e-6)` and `ny` likewise. A later fill overwrites an earlier one. The shade `f` is a number or `f(X, Y, nx, ny)`. It is stored as **float32** and then clamped to 0 … 1 (`Math.min(Math.max(Math.fround(v), 0), 1)`; Python stores `np.float32` and clips). `nol` marks a glow (Python `nolin`): it never takes the rim and never gives an outline. `canvasSprite(c)` makes the `Sprite`, with foot `[Math.floor(ax * k + 0.5), Math.floor(ay * k + 0.5)]` (as the reference and `export_sprites.py` write it) and step −1 on every pixel (shade mode). `Sprite` gains `sh` and `nolin`; `gridSprite` fills them with 0 and `false`.
7. **The shade pass** (`colourise`; `engine.colourise`, then ART1a's `colourise3` lock). A pixel with step ≥ 0 is exactly `stepOf(material, step)`, as in ART1a. Otherwise `t = Math.fround(sh + Math.fround(bias)) + (rim ? PALETTE.rim : 0)` and the colour is `stepOf(material, band(t, ramp length))`. The shade plus bias is added **in float32**, as numpy 2 adds a Python float to a float32 array (the shipped test's stone at 0.6 is the witness: float32 gives step 2, float64 would give 3). `bias` is `PALETTE.bias[material]`, and **a material with no bias entry has bias 0**: that is the Python's `S.get("bias", {}).get(name, 0.0)`, named here so it is not a silent default (law 12). **The rim**: a pixel that is not a glow, with an empty pixel or the sprite's edge directly above it or directly to its left. **The outline** is ART1a's, except that a glow neighbour gives no outline (`outline_masks` skips `nolin`): the first opaque, non-glow neighbour in the order right, left, below, above.
8. **The rock and the lantern** (`recipes/rock.ts`, `recipes/lantern.ts`), ports of `recipes.py` `rock` and `lantern` with the same numbers in the same order. Each has `const SCALE` (`S["scale"]`: rock **1.3**, lantern **1.25**) and `k = (tile / 32) * SCALE`. `rock(tile, seed = 1, big = false)`: `newCanvas(22, 16, 10, 13, k)`, `g = big ? 1.35 : 1.0`, the shade `0.15 + 0.75 * sphere(nx * 0.9, ny * 1.1) + 0.12 * facet` with `facet = hash2(Math.floor(X / 2.5), Math.floor(Y / 2.5), seed) - 0.5`, then two `stone` ellipses: `(10, 13 - 3.5 * g, 5.2 * g, 3.8 * g)` and `(10 + 4.6 * g, 13 - 1.8 * g, 3.0 * g, 2.2 * g)`. `lantern(tile)`: `newCanvas(10, 26, 5, 24, k)`, then in this order: iron `(4, 7, 6, 24)` shaded `0.7 - 0.5 * nx`; iron `(3, 22.5, 7, 24)` at 0.4; iron `(2.2, 2.5, 7.8, 8.5)` at 0.35; glow `(3, 3.5, 7, 8)` shaded `1 - 0.5 * ny`, **nol**; iron `(1.8, 1.2, 8.2, 2.8)` at 0.6. Both return `canvasSprite(c)`. `RECIPES.rock` bakes the Python default (seed 1, not big). The stage's big rock (seed 3, big) is pinned too, through `rock(tile, 3, true)`. **Port tolerance: zero.** Pins: rock 32 is 29×21, foot 13,17, sha256 `dbeb8b41…b215`; rock 48 is 43×31, foot 20,25, sha256 `fa49fcaa…f216`; lantern 32 is 12×32, foot 6,30, sha256 `bb33ae60…a5a9`; lantern 48 is 19×49, foot 9,45, sha256 `643c5c02…e7f2`; the big rock rock-big 32 is 29×21, foot 13,17, sha256 `04306148…4ec4`; rock-big 48 is 43×31, foot 20,25, sha256 `2a91ed0a…3f4e`.
9. **`RECIPES` and `bakeOne`** (`bake.ts`): `RECIPES` becomes `Readonly<Record<string, (tile: Tile) => Sprite>>` = `{ crate: (tile) => gridSprite(crate(tile)), rock, lantern }` (that order; ART1b2 puts the barrel after the crate), and `bakeOne` takes `const sprite = make(tile);`. No other runner, CLI or manifest change.
10. **The manifest hash (carry a), defined for ART2.** `manifest.json`'s `hash` is the sha256 of the concatenated RGBA bytes of every sprite `bakeAll` bakes: each sprite's bytes as `colourise` returns them (w × h × 4, rows top to bottom, pixels left to right, R G B A), in `RECIPES` key order, and within each recipe in the order of the `tiles` argument (default `[32]`). Nothing else goes in: no names, sizes, separators or header. It is a **pixel fingerprint for CI**, like project-format §6.2.5 `lookHash`, **not** a document sha256 (DSK P3). The manifest is generated output and is never authored. ART1a's `bake.ts` already computes exactly this, so no code changes. The shipped test recomputes it for `[32]`, `[32, 48]` and `[48, 32]`, and ART1b2 pins the literal values once the recipe list is complete.
11. **Python reference** (optional to re-run; the pins are literals in the shipped test): `PYTHONDONTWRITEBYTECODE=1 python3 handoff/steps/tests/step-art1b1-shade-core/ref/ref-art1b1.py [png-dir]`, run from the repo root, with Python 3, numpy 2.x and Pillow (EA used numpy 2.5.5 and Pillow 13.0.0). It imports the ART1a kit's frozen Python, so nothing is duplicated.
12. **The kit's bytes are not counted** (ART1a Ruling 12): `handoff/steps/tests/step-art1b1-shade-core/` (11 files plus `SHA256SUMS`) is pushed by CoS before the go. Copy only the shipped test and `palette.json`, both verbatim, and both count.

## Files to create or change
- change `tools/art-bake/palette.json` (the kit's file verbatim; Ruling 2)
- change `tools/art-bake/palette.ts` (Rulings 2–4)
- create `tools/art-bake/blocks.ts` (Ruling 5)
- change `tools/art-bake/sprite.ts` (Rulings 4, 6, 7)
- create `tools/art-bake/recipes/rock.ts` and `tools/art-bake/recipes/lantern.ts` (Ruling 8)
- change `tools/art-bake/bake.ts` (Ruling 9)
- change `tests/tools/art1a-bake.test.ts` (4 lines; Existing tests changed)
- create `tests/tools/art1b1-shade-core.test.ts` (the kit's file verbatim)
(Nothing else. An extra file must be named and justified in the Decisions note, or it is a REJECT.)

Size: the trial changes **352** lines (+333/−19) in 9 files (count: `git add -N . && git diff --numstat <base> -- . ':!handback/**' ':!package-lock.json'`, QA's G7). Not counted: the kit folder (Ruling 12) and `tools/art-bake/out/`.

| File | + | − | Trial / cap |
|---|---|---|---|
| `tools/art-bake/palette.json` | 2 | 0 | 2 / 2 |
| `tools/art-bake/palette.ts` | 68 | 1 | 69 / 72 |
| `tools/art-bake/blocks.ts` | 55 | 0 | 55 / 58 |
| `tools/art-bake/sprite.ts` | 73 | 11 | 84 / 88 |
| `tools/art-bake/recipes/rock.ts` | 18 | 0 | 18 / 20 |
| `tools/art-bake/recipes/lantern.ts` | 15 | 0 | 15 / 16 |
| `tools/art-bake/bake.ts` | 5 | 3 | 8 / 8 |
| `tests/tools/art1a-bake.test.ts` | 4 | 4 | 8 / 8 |
| `tests/tools/art1b1-shade-core.test.ts` | 93 | 0 | 93 / 96 |
| **Total** | 333 | 19 | **352 / 368** (ART1b1's limit is the caps' sum, **368**, under the 400 gate) |

Over any cap or the limit = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Interfaces to match (quoted exactly)
```ts
// tools/art-bake/palette.ts
export type Rgb = readonly [number, number, number];
export type Palette = {
  readonly style: string;
  readonly outline: { readonly colour: string; readonly rampWeight: number; readonly colourWeight: number };
  readonly outlineBy: Readonly<Record<string, string>>;
  readonly rim: number;
  readonly bias: Readonly<Record<string, number>>;
  readonly ramps: Readonly<Record<string, readonly string[]>>;
};
export function rgb(hex: string): Rgb;
export function luma(c: Rgb): number;
export function checkPalette(p: Palette): Palette;
export const PALETTE: Palette = checkPalette(JSON.parse(readFileSync(new URL("./palette.json", import.meta.url), "utf8")) as Palette);
export function ramp(name: string): readonly Rgb[];
export function stepOf(name: string, step: number): Rgb;
// tools/art-bake/blocks.ts
export const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi);
export function roundEven(v: number): number;
export function hash2(i: number, j: number, s: number): number;
export function vnoise(x: number, y: number, sc: number, s: number): number;
export function fbm(x: number, y: number, sc: number, s: number, oct = 4): number;
export const LIGHT = [-0.55 / NORM, -0.62 / NORM, 0.56 / NORM] as const;
export function sphere(nx: number, ny: number): number;
export const band = (t: number, n: number): number => roundEven(clamp(t, 0, 1) * (n - 1));
// tools/art-bake/sprite.ts
export type Tile = 32 | 48;
export type Grid = { readonly w: number; readonly h: number; readonly mat: (string | null)[]; readonly step: number[] };
export type Sprite = { readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly mat: readonly (string | null)[]; readonly step: readonly number[]; readonly sh: readonly number[]; readonly nolin: readonly boolean[] };
export type Canvas = { readonly w: number; readonly h: number; readonly k: number; readonly ax: number; readonly ay: number; readonly mat: (string | null)[]; readonly sh: number[]; readonly nolin: boolean[] };
export type Shade = number | ((x: number, y: number, nx: number, ny: number) => number);
export function newGrid(w: number, h: number, mat: string | null): Grid;
export function put(grid: Grid, x: number, y: number, mat: string | null, step: number): void;
export function gridSprite(grid: Grid): Sprite;
export function newCanvas(w: number, h: number, ax: number, ay: number, k: number): Canvas;
export function ellipse(c: Canvas, cx: number, cy: number, rx: number, ry: number, mat: string, f: Shade, nol = false): void;
export function rect(c: Canvas, x0: number, y0: number, x1: number, y1: number, mat: string, f: Shade, nol = false): void;
export function canvasSprite(c: Canvas): Sprite;
export function outlineOf(s: Sprite): (string | null)[];
export function colourise(s: Sprite): Uint8Array;
// tools/art-bake/recipes/rock.ts
export function rock(tile: Tile, seed = 1, big = false): Sprite;
// tools/art-bake/recipes/lantern.ts
export function lantern(tile: Tile): Sprite;
// tools/art-bake/bake.ts
export const RECIPES: Readonly<Record<string, (tile: Tile) => Sprite>> = { crate: (tile) => gridSprite(crate(tile)), rock, lantern };
export const DEFAULT_TILES: readonly Tile[] = [32];
export type Baked = { readonly sprite: Sprite; readonly rgba: Uint8Array; readonly sha256: string };
export type ManifestRow = { readonly name: string; readonly tile: Tile; readonly file: string; readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly sha256: string };
export function bakeOne(name: string, tile: Tile): Baked;
export function bakeAll(outDir: string, tiles: readonly Tile[] = DEFAULT_TILES): ManifestRow[];
```
Every export of these six files is listed; those already on main from ART1a (`Rgb`, `rgb`, `ramp`, `Tile`, `Grid`, `newGrid`, `put`, `gridSprite`, `outlineOf`, `colourise`, `DEFAULT_TILES`, `Baked`, `ManifestRow`, `bakeOne`, `bakeAll`) keep their signatures. `png.ts` and `crate()` are unchanged. Private helpers (`named`, `fill`, `rimAt`, `at`, `pixelRgb`, `outlineRgb`) are yours to shape inside the caps, but the error texts in Rulings 3 and 4 are exact (the shipped test matches them).

## Smoke lines
None for the builder: ART1b1 changes no maker, play-stage or export file. HANDBACK § Smoke says "Not run: no UI or export file changed (git diff names only tools/art-bake/** and two tests)". EA ran all 25 smokes solo at 390 and 360 on the trial anyway: all pass.

## Existing tests changed by ruling (and only these)
`tests/tools/art1a-bake.test.ts`: the recipe list is no longer just the crate, so four lines change and nothing else does:
  - L27: `assert.deepEqual(Object.keys(RECIPES), ["crate"]);` → `assert.equal(Object.keys(RECIPES)[0], "crate");`
  - L110: `assert.deepEqual(rows.map((r) => r.file), ["crate-32.png"]);` → `` assert.deepEqual(rows.map((r) => r.file), Object.keys(RECIPES).map((name) => `${name}-32.png`)); ``
  - L113: `for (const row of rows) {` → `for (const row of rows.filter((r) => r.name === "crate")) {`
  - L118: `assert.equal(bakeAll(dir, [32, 48]).length, 2);` → `assert.equal(bakeAll(dir, [32, 48]).length, 2 * Object.keys(RECIPES).length);`

## Tests that prove it is done
Copy `handoff/steps/tests/step-art1b1-shade-core/tests/tools/art1b1-shade-core.test.ts` to `tests/tools/art1b1-shade-core.test.ts` **verbatim** (sha256 `0458c848bbf4177567819663f22107ea3b92788ebb5ff83673fbc2d667ad0a5f`, 93 lines). 5 tests:
- "ART1b1 port check: the rock and lantern bake pixel for pixel the same as the B r6b Python at 32 and 48 px (shade, bias, rim, outline, glow)"
- "ART1b1 shared blocks: hash2, vnoise, fbm and sphere equal common.py to the last bit, and rounding is half to even"
- "ART1b1 shade pass: a glow pixel takes no outline and no rim; other pixels get the rim on a top or left edge; shade plus bias adds in float32"
- "ART1b1 manifest hash: sha256 over every sprite's RGBA bytes, in RECIPES order and then tile order, nothing else"
- "ART1b1 law 12: rgb takes only #rrggbb, the palette contract throws, and a missing step has no black fallback"
(You may add tests. The hand-back lists each shipped file's sha256, unchanged.) Floor: **1204 + 5 = 1209**.

## How a planted bug is caught (for QA)
`handoff/steps/tests/step-art1b1-shade-core/plants-art1b1.py` (sha256 `f5401d154df7c6481ed6cf4de77493937088eeb028b720b16e2568c38144cdd3`, 57 lines), run from the repo root on a clean ART1b1 tree; each plant must make `tests/tools/art1a-bake.test.ts` or the shipped test fail: **38/38 caught** in the trial. They are: P1 rgb takes any text; P2 an empty or 10-step ramp passes; P3 ramp colours not checked at load; P4 the outline colour not checked; P5 bias names not checked; P6 outlineBy names not checked; P7 a missing step falls back to black; P8 the outline's black fallback is back; P9 a hash2 constant changed; P10 hash2 shifts with sign; P11 vnoise without the smoothstep; P12 fbm octave seeds moved; P13 fbm octave weights changed; P14 the light from another angle; P15 rounding half up; P16 the band floors instead of rounding; P17 shade plus bias added in float64; P18 no bias; P19 no rim; P20 the rim on a glow; P21 the rim looks right, not left; P22 a glow gets an outline; P23 the ellipse shrinks; P24 rect nx divides by the height; P25 the canvas size rounds half up; P26 the canvas foot rounds down; P27 the rock ignores its seed; P28 the rock's second stone moved; P29 the lantern base lit differently; P30 the manifest hashes the hex text; P31 the lantern dropped from RECIPES; P32 the stone bias changed; P33 the rim weight changed; P34 the outline mix rounds instead of truncating (ART1a P11); P35 a see-through outline (ART1a P12); P36 a ramp need not be strictly lighter; P37 a ramp may repeat a colour; P38 pure black or white allowed. Each plant is one exact edit; the script asserts it applies once and restores the file. Its anchors are the next section's lines, so keep them verbatim. If a plant doesn't apply, report it; don't edit the script.
Equivalent mutants (EA, for QA): keeping shades as float64 at `fill` alone is not caught, because the shade pass rounds the sum to float32 anyway (P17 plants that instead). The lantern's glow never touches an empty pixel, so its no-outline flag changes no lantern pixel; the shade-pass test covers the flag on its own.
ART1a's `plants-art1a.py` on this tree: ART1a's anchors P11 (the outline mix truncates) and P12 (the outline is opaque) are gone, because law 12 rewrote both lines, so the script stops at P11 by design (info only for QA). With those two skipped, P1–P10 and P13–P24 are all still caught (22/24), and P11's and P12's checks live on as `plants-art1b1.py` P34 and P35. On the ART1b2 tree, P23 (the manifest row's pixel hash) is also gone, because the row gained `k` and `shadow`; P1–P10 and P13–P22 and P24 still catch (21/24).

## Plant anchors (quoted exactly; each appears exactly once in its file)
These are ordinary lines of the port. Write them as shown (leading spaces included where a line starts with spaces), so QA's plants apply to your tree:
- `tools/art-bake/palette.ts`: the whole line ``  if (!/^#[0-9a-f]{6}$/i.test(hex)) {`` · the whole line ``    if (hexes.length < 1 || hexes.length > 9) {`` · the whole line ``      const c = rgb(hex);`` · the whole line ``  rgb(p.outline.colour);`` · the whole line ``  named(p, Object.keys(p.bias), "bias");`` · the whole line ``  named(p, Object.keys(p.outlineBy), "outlineBy");`` · the whole line ``    throw new Error(`art-bake: ramp "${name}" has no step ${step}`);`` · the whole line ``      if (prev !== undefined && y <= prev) {`` · the whole line ``      if (seen.includes(key)) {`` · the whole line ``  if (n === "#000000" || n === "#ffffff") {``
- `tools/art-bake/sprite.ts`: the whole line ``  const dark = stepOf(name, 0);`` · `const t = Math.fround(at(s.sh, i) + Math.fround(PALETTE.bias[m] ?? 0)) + ` · `Math.fround(PALETTE.bias[m] ?? 0)` · `(rimAt(s, i) ? PALETTE.rim : 0)` · the whole line ``  return s.nolin[i] !== true && (!up || !left);`` · the whole line ``  const left = i % s.w > 0 && s.mat[i - 1] !== null;`` · the whole line ``        if (nb === null || s.nolin[ny * s.w + nx] === true) continue;`` · the whole line ``    if (nx * nx + ny * ny > 1.0) continue;`` · `(x - x0) / Math.max(x1 - x0, 1e-6)` · the whole line ``  const cw = roundEven(w * k);`` · `Math.floor(c.ay * c.k + 0.5)` · `Math.trunc(dark[i] * PALETTE.outline.rampWeight` · `rgba.set([c[0], c[1], c[2], 255], i * 4);`
- `tools/art-bake/blocks.ts`: `Math.imul(j, 668265263)` · `h ^ (h >>> 13)` · the whole line ``  const sx = fx * fx * (3 - 2 * fx);`` · `s + o * 31` · the whole line ``    amp *= 0.5;`` · `0.56 / NORM` · the whole line ``  return f % 2 === 0 ? f : f + 1;`` · `roundEven(clamp(t, 0, 1) * (n - 1))`
- `tools/art-bake/recipes/rock.ts`: `Math.floor(y / 2.5), seed)` · `10 + 4.6 * g`
- `tools/art-bake/recipes/lantern.ts`: `rect(c, 3, 22.5, 7, 24, "iron", 0.4);`
- `tools/art-bake/bake.ts`: the whole line ``      hash.update(rgba);`` · `rock, lantern };`
- `tools/art-bake/palette.json`: `"stone": -0.1 }` · `"rim": 0.16,`

## Example
QA runs `node tools/art-bake/bake.ts /tmp/b 32 48`. It prints six lines: the two crate lines of ART1a, then `rock-32.png 29x21 foot 13,17 dbeb8b41…`, `rock-48.png 43x31 foot 20,25 fa49fcaa…`, `lantern-32.png 12x32 foot 6,30 bb33ae60…` and `lantern-48.png 19x49 foot 9,45 643c5c02…`. The rock is a grey boulder with a smaller stone at its lower right, lit from the top-left, with blocky facets and a warm rim on its top-left edges. The lantern is a dark iron post and cage with a warm three-step glow inside. Then `python3 handoff/steps/tests/step-art1b1-shade-core/ref/ref-art1b1.py /tmp/p` prints the same hashes from the frozen Python.

## Decisions note: what to name
- Any helper you add inside a file (name it; it must stay inside the caps).
- How you laid out the fills (the trial loops over every pixel of the canvas per shape; any equivalent loop is fine if the pins and plants hold).
- That nothing reads `ref/` at test time (the pins are literals in the shipped test).
- Constants (law 12): `SCALE` 1.3 and 1.25, `rim` and `bias` from `palette.json`, bias 0 for an unlisted material (Ruling 7), `oct = 4` for `fbm` (Python's default).
- Runtime bounds (BUILD_GUIDE law 13): nothing is retained between bakes; `palette.json` is parsed and checked once at load.

## Do not touch
- `src/**`, `tools/maker`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/pixel-suite`, `data/`, `fixtures/`, the format docs, `docs/maker/art-style.md`, `docs/maker/ux/**`, `painter-proto`, `ui-shell`; plus BUILD_GUIDE §7's never-edit list.
- `tools/art-bake/png.ts`, `tools/art-bake/recipes/crate.ts`, `tools/art-bake/package.json`, `.gitignore`.
- The root `package.json` and `package-lock.json`; `map.tile` and any tile-size setting (F3a).
- Any smoke or other existing test. No new dependency, font, image file or committed PNG. No file under `handoff/` (both kits are CoS's); your HANDBACK goes under `handback/`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least **1209** tests passing (green = BUILD_GUIDE §6).
- [ ] `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors: `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` L156 twice (TS7053).
- [ ] The shipped test and `palette.json` are byte-identical to their listed sha256; `plants-art1b1.py`: 38/38 caught.
- [ ] `node tools/art-bake/bake.ts /tmp/b 32 48` prints the six pinned lines (Example); `cd handoff/steps/tests/step-art1b1-shade-core && sha256sum -c SHA256SUMS` passes (you didn't change the kit).
- [ ] `git diff --name-only <base>` lists only the 9 files in Files (plus `handback/**`).
- [ ] Each file within its cap; at most **368** counted lines (trial 352); over it, stop and report.
- [ ] Rule 8 (ART1a Ruling 11): no new statement packed onto a line; no `if (…) statement;` other than `continue` or `return`.
- [ ] Hand-back complete per handoff/HAND-BACK.md at the hand-back location above, with § Green (counts), § Plants, § Port check (the bake's printed lines), § Smoke ("Not run", Smoke lines), § Rule 8 scan, § Size and § Helpers & self-review.

## Not in this step (carries, with their target step)
- **The r6 barrel and the contact-shadow shapes: ART1b2** (`step-art1b2-barrel-shadows`), on this step's merge. It ports `barrel_grid` (pixel-exact in the ART1a trial), gives every recipe its scale `k` and shadow shapes (crate, barrel, rock, lantern), writes them into the manifest rows, and pins the manifest hash's literal values.
- **Trailing spaces in four smokes** (carry d): `handoff/steps/tests/s4b-stage-place/smoke.mjs` L27, `s5b-abilities` L27, `s5c-add-ability` L28 and `s6a-win-rules` L28 each end in one space after `await press(page, "Create");` (the F2a2b build left them; the F2a2b r2 trial had none). ART1b1 touches no smoke, so they **stay open**, for the next step that edits those files or a docs-and-tests tidy. This guide's generator trims trailing whitespace on every line it writes.
- **Maker UI carries** (carry e), not in scope for an art slice, so all **stay open** (the next maker step, F2b or F4): UX open point 9 (the ☰ Effects meta is `String(host.effects)` at `tools/maker/game-menu.ts` L30, so it reads 0, not f02's "10 built-in"); `state.problems` has no reader; the menu shows 0 instead of "–" when it opens on an unparsed project; the `sectionSheet` type allows `none`, `menu` and `switch`.
- Stamps, trees, bushes, fence: **ART1c**. Houses (with `Spr.poly`) and units: **ART1d**. Ground tiles, water frames and edges: **ART1e**.
- The lighting and weather passes and the multiply `Blend`: engine steps after the port (art-style.md § 4 item 4).

## Out of scope
- Any screen, project, format, play or maker change. Any new art.

## Open questions
None for this step. The palette contract is Ruling 3. The bloom mapping (UX: petal_pink; DSK: [fl_purple, fl_pink, fl_white]) and the ART1e / ART2 carries are recorded in the ART1b2 guide. The contact-shadow format is accepted (ART1b2 Ruling 4).
