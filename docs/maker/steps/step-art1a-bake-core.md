# step-art1a-bake-core: the art bake core, ported from the B r6b Python recipes, with the crate as its first recipe (maker overhaul plan ART1a; art-style.md r3; ART0 ruled 27 Nov 20:14 and 20:16)

Step id: step-art1a-bake-core          Revision: r2 (EA kit, 2026-11-27; r2 answers QA's r1 review: M1 the CLI refuses any tile but 32 or 48, W1 braceless `for` in Rule 8, W2 `ref-art1a.py` makes its png-dir, and the law-12 carry to ART1b)
Repo: https://github.com/G-TileEngine/tileengine (you push your own step branch only; see Delivery)
Base commit: main **`fea3098b858cd19fe73d8e5f78f30e01a226dd4b`**. It is docs-only on `deb47044` (art-style.md r3), which is docs-only on the F1 record `97657844` (F1 merge `b6c3da0e`, PR #114). Checked from a fresh `/tmp` clone: green on `deb47044` is **1188 pass, 0 fail**, all checks OK, and `deb47044..fea3098b` touches only `docs/maker/ux/maker-overhaul-plan.md` and `docs/qa/art-style-review-addendum-plan.md`. If main has moved by the go, CoS re-checks that the move is docs-only and that the trial patch applies.
Branch: step/step-art1a-bake-core-r1-chatA, from the base. Never commit to main. Chief Of Staff opens the PR to main from your pushed branch.
Delivery (CN-028): one builder chat (ChatA), one QA review, and a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). Commit HANDBACK.md as the branch's last commit, then push once with `GH_BUILDER_TOKEN` through a one-shot credential helper (CN-028 § Token; keep the single quotes): `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-art1a-bake-core-r1-chatA` (that branch only: never main, another branch or a tag; no force-push, no branch delete, no PR actions). The hand-back message quotes the branch, the full tip sha, the Base sha and the test counts. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the branch".
Hand-back location: in the repo, on that branch: handback/step-art1a-bake-core/r1/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on:
- `docs/maker/art-style.md` r3 (sha256 `8f62dd2845df41e406f8fdfc7224075e8eef1cdb5a911649f66d585f9475fb94`, on the base): § 1 (square tiles, tile size an input, deterministic, whole-pixel feet), § 2 (pixel mode, sel-out outline), § 3 (one palette file), § 4 items 1–3, § 5 (port check).
- `docs/maker/ux/maker-overhaul-plan.md` (sha256 `8b6e9386…f0d3`, on the base): L73, L147–L151 (this step; EA's re-size is in "Size" below and in the proposed plan delta CoS holds), L148 (own `package.json`, the root-package fence).
- The kit: `handoff/steps/tests/step-art1a-bake-core/` (its `SHA256SUMS` is listed in the paste). Everything you need is there; nothing is on any other machine.
- Format: none read or written (tile-project 6, stage 2, no bump). `map.tile` and the tile-size setting are F3a's and are not touched.
Read first: BUILD_GUIDE.md §2.2, §6, §7; art-style.md r3 in full; plan L147–L151; the kit's `ref/styles-code/b-r6/style_b6.py` (`_spr`, `crate_grid`, `crate6`), `ref/styles-code/b-r3/style_b3.py` (`colourise3`), `ref/styles-code/b-r2/style_b2.py` (`colourise2`), `ref/styles-code/common.py` (`outline_masks`, `Spr`) and `ref/styles-code/b-r3b/style_b3b.py` (`PLUM`, the outline lambda).

Kit: r2, 2026-11-27. Trial commit `01987d277d27619a45970264dfc6639a7df94b65` on `fea3098b` (tree `c029016e22543cdeb842444befe4d6b1aff6979a`). Checked on a fresh GitHub clone: `art1a-trial.patch` passes `git apply --check` on `fea3098b` and gives the same tree. Green **1194 pass, 0 fail** (1188 + 6), all checks OK. `tsc -p tools/tsconfig.json` shows only the 3 base errors. Plants **24/24** caught. Counted **387** lines. `node tools/art-bake/bake.ts /tmp/x 64` exits 1 with `art-bake: tile must be 32 or 48 ("64")`. The JavaScript crate is pixel-identical to the kit's Python reference at 32 and 48 px (the shipped test's pins equal `ref/expected/ref-art1a.json`). Not run: smokes and the export audit, because no maker, play or export file changes.
Carries: none filed. Moves to ART1b: the barrel recipe (trialled pixel-exact) and the law-12 hardening of `ramp()`, `rgb()` and the outline fallback (QA r1 note); see Not in this step.

> Working style (REQUIRED): use all your helper agents for review, tests and cross-checks, take your time, never rush, and self-review against Acceptance and the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
ART0 is ruled (CEO, 27 Nov 20:14 and 20:16 London, via CoS): style B r6b is the baseline, and the method is to port UX's Python bake recipes to JavaScript in `tools/art-bake/`, replacing M1, M2 and M3. Today there is no `tools/art-bake/`, and the recipes exist only as Python. After ART1a:
- `tools/art-bake/` exists with its own `package.json` and no dependencies, outside green like `tools/pixel-suite/`;
- it holds the shared core every later recipe uses: the pixel-mode sprite (a material and a ramp step per pixel), the 1 px margin, whole-pixel feet, the sel-out outline, colourise, the one palette file with all 38 B r6b ramps, a PNG writer, and a runner that writes PNGs plus a manifest of pixel hashes;
- one recipe is ported: the r6 crate, pixel for pixel the same as the Python bake at 32 and 48 px, proved in green.
Nothing changes in the app. Recipes are data-driven (palette file plus recipe code), so a later art round re-bakes without touching the maker or engine (art-style.md § 7). That is a design property, not a ruling.

## Where step-art1a-bake-core sits (placement card)
1. No screen: a bake tool only. Lives at: nothing in the app · tap path: none.
2. Changes or replaces: nothing (a new folder `tools/art-bake/`, one `.gitignore` line).
3. Seen at once: nothing.
4. Data path: written by `node tools/art-bake/bake.ts` to `tools/art-bake/out/` (gitignored: one PNG per recipe and tile, plus `manifest.json`) · read by Test/play: nothing (no file under `src/`, `tools/maker`, `tools/play-stage` or `tools/export` imports the rig) · demo data: unchanged · pictures: one art script added (`recipes/crate.ts`), no PNG committed.
5. Usable on landing: no screen; a builder or QA runs the bake and the shipped test.
6. Proof: the shipped test's pixel pins against the kit's Python reference; EA's trial sheet (box only) shows the JavaScript crate beside the Python crate at 8×.

## Rulings
1. **The rig's language is the repo's JavaScript: TypeScript run directly by Node** (type stripping, as `tools/pixel-suite/run.ts` and `tools/apk` are). No build step, no `.js` output, no dependency. `node tools/art-bake/bake.ts` works on Node ≥ 22.18 (root `engines`).
2. **Own package, fenced** (plan L148): `tools/art-bake/package.json` is exactly these 7 lines, with **no `dependencies` or `devDependencies`**: `{` / `  "name": "tileengine-art-bake",` / `  "private": true,` / `  "description": "Step ART1a: the B r6b art bake, Python recipes ported to TypeScript (outside green; no dependencies): node bake.ts [out-dir] [32|48 ...]",` / `  "type": "module",` / `  "scripts": { "bake": "node bake.ts" }` / `}` (sha256 of the file: `936a6264d412b843fc2181d01c2ef9dcf1ba6dcfadbf7c3eaaf316c3f53c1347`). The root `package.json` is not edited. Nothing under `src/` may import `tools/art-bake` (no file under `src/` contains the text `art-bake`). Pinned by the fence test.
3. **Deterministic** (art-style.md § 1): no `Math.random`, `Date`, `performance` or `crypto.getRandomValues` in the rig (the fence test greps every `.ts` file under `tools/art-bake/`). The same recipe and tile size give byte-identical pixels and PNG bytes on every run.
4. **One palette file** (art-style.md § 3): `tools/art-bake/palette.json` is the kit's `files/tools/art-bake/palette.json`, **copied verbatim** (sha256 `ddf7456b709f1b0a3427ba08ef3a7fc7f3f88605ab3d49b39f5951abd7685382`, 45 lines). It holds `style`, `outline` (`colour` `#2a1630`, `rampWeight` 0.45, `colourWeight` 0.55: two weights, because 1 − 0.55 is not 0.45 in floating point), `outlineBy` (`leaf`: `#1a1628`) and the 38 ramps of the r6b chain in import order, dark to light. `ref/ref-palette.py`, run from the repo root, checks it against the Python chain. Recipes name materials only; no colour literal appears under `tools/art-bake/recipes/`. `palette.ts` reads the file at load (`readFileSync` on `new URL("./palette.json", import.meta.url)`), so `node bake.ts` runs from any directory.
5. **The sprite, as Python `_spr` does it** (`b-r6/style_b6.py`): a recipe returns a `Grid` (width, height, a material or `null` per cell, a step per cell). `gridSprite` adds a 1 px empty margin all round (so the outline fits) and clips each step to `0 … ramp length − 1` (the crate's "side falling out of the sun" can take a step to −1, which clips to 0). The foot is the bottom-centre: `[Math.floor(w / 2 + 0.5), h − 1]` on the margined sprite (art-style.md § 1: whole pixels, half rounds up, as `export_sprites.py` writes them).
6. **Colourise, as the r6b chain does it** (`colourise3` over `colourise2` over `engine.colourise`): a sprite pixel with a material is exactly `ramp(material)[step]`, alpha 255. An empty pixel that 4-touches the sprite is the **sel-out outline**, alpha 255. It takes the material of the **first** opaque neighbour in the order **right, left, below, above** (`outline_masks`' order), and its colour is `outlineBy[material]` if listed, else per channel `Math.trunc(ramp(material)[0][c] × 0.45 + plum[c] × 0.55)`. That is the darkest step mixed with plum, truncated as the Python export's `astype(uint8)` does, so it is never black. Diagonal-only pixels stay transparent `[0, 0, 0, 0]`. There is no rim, bias or noise in ART1a: every crate pixel is a locked step (ART1b adds the shade-mode pass).
7. **The crate recipe** (`recipes/crate.ts`, `crate(tile)`): a port of `crate_grid(T)` in `ref/styles-code/b-r6/style_b6.py`, with the same numbers and the same comparisons in the same order. At 48 it is 25 × (17 + 21) with frame 2; at 32 it is 17 × (11 + 14) with frame 1. Lid steps: frame, inner panel, diagonal brace (note `ix * (ih / iw)`: the division is done first), plank seams. Front steps: the dark seam row, frame, plank seams, X brace, then the side out of the sun. At 48 only, six `steel8` nails go at the listed corners (step 5 left of centre, 3 right). The sprite is the grid through `gridSprite` and `colourise`. The pins (sha256 of the RGBA bytes, row-major, top-left first) are those of `ref/expected/ref-art1a.json`, made by `ref/ref-art1a.py` from the frozen Python. **Port tolerance (art-style.md § 5, EA sets it): zero.** The crate matches pixel for pixel. The checkpoint's own `b-r6b-sprites/sprites/crate.png` also carries the scene's far-depth haze (`b-r4` `sprite_post`, a placement pass, not a recipe), so it is not the pin. QA's independent check (r1 review): the frozen Python crate at 48 with the `b-r4` `sprite_post` haze applied equals `crate.png` exactly (0 px differ), and the JavaScript crate equals the frozen Python crate exactly, so pinning the re-run Python recipe is right. (EA's r1 note of "within 1 level" came from hazing the truncated PNG rather than the float colours; QA's figure stands.)
8. **Tile size is an input; 32 is the default** (art-style.md § 1; CoS 20:22): every recipe takes `tile: 32 | 48`. `DEFAULT_TILES` is `[32]`. `node bake.ts [out-dir] [32|48 …]` bakes the default unless tiles are named. No tile argument means 32. **Any tile argument other than `32` or `48` throws** `` Error(`art-bake: tile must be 32 or 48 ("${arg}")`) ``, quoting the argument as received (so `node bake.ts /tmp/x 64` exits non-zero with `art-bake: tile must be 32 or 48 ("64")` and writes no PNG); there is no silent fallback (BUILD_GUIDE law 12; QA r1 M1). The shipped test spawns the script with `64` and pins the exit and the message. The 48 px bake is on request only, for the port check against the 48 px main bake. No `map.tile`, project, maker or tile-size setting changes (F3a owns them).
9. **PNG writer** (`png.ts`): 8-bit RGBA (colour type 6), one IDAT, filter byte 0 on every row, `deflateSync` level 9, `crc32` from `node:zlib`. Green pins the pixels, not the PNG bytes (zlib versions may differ). The shipped test inflates the IDAT and checks the pixels round-trip.
10. **Runner and manifest** (`bake.ts`): `bakeAll(outDir, tiles)` writes `{name}-{tile}.png` per recipe and tile, in `RECIPES` order then tile order, plus `manifest.json`: `{ style: "B r6b", hash: "sha256 of the RGBA pixels", sprites: rows }` (JSON, one-space indent, trailing newline). Each row is `{ name, tile, file, w, h, foot, sha256 }`. The CLI prints one line per file. `tools/art-bake/out` is added to `.gitignore` (one line, appended). No PNG is committed in ART1a (ART2's pack PNGs are the master copy, plan L151).
11. **Rule 8:** one statement per line in all new code. Any brace body that holds a statement takes its own lines (no `{ a; }` on one line). `if (…) continue;` and `if (…) return x;` with no braces are one statement, as QA ruled in the 11c1 r2 review, and so is `for (…) oneStatement;` with no braces (for example `for (const row of rows) console.log(…);`; QA r1 W1). Don't add braces just to change a line count, and don't add them to save lines either. Type-literal members separated by `;` are not statements.
12. **The kit's reference bytes are not counted** (EA size ruling, as F1 ruled the smokes' cap): everything under `handoff/steps/tests/step-art1a-bake-core/` is pushed by CoS before the go and is not part of your diff. That is 121 files (including its `SHA256SUMS`), 5,970,450 bytes in all, of which 5,659,836 are PNG and GIF checkpoints. You copy only two of its files into the tree, the shipped test and `palette.json`, and both count. Don't copy `ref/` anywhere. Python, numpy and Pillow are needed only to re-run the references (optional; the pins are already in the shipped test).

## Files to create or change
- create `tools/art-bake/package.json` (≤ 7; Ruling 2)
- create `tools/art-bake/palette.json` (45, the kit's file verbatim; Ruling 4)
- create `tools/art-bake/palette.ts` (≤ 24; Ruling 4)
- create `tools/art-bake/sprite.ts` (≤ 76; Rulings 5, 6)
- create `tools/art-bake/png.ts` (≤ 22; Ruling 9)
- create `tools/art-bake/recipes/crate.ts` (≤ 46; Ruling 7)
- create `tools/art-bake/bake.ts` (≤ 47; Rulings 8, 10)
- change `.gitignore` (1+; append `tools/art-bake/out`)
- create `tests/tools/art1a-bake.test.ts` (125, the kit's file verbatim)
(Nothing else. An extra file must be named and justified in the Decisions note, or it is a REJECT.)

Size: the trial changes **387** lines (+387/−0) in 9 files (count: `git add -N . && git diff --numstat <base> -- . ':!handback/**' ':!package-lock.json'`, QA's G7). Not counted: the kit folder (Ruling 12) and `tools/art-bake/out/` (gitignored).

| File | Trial / cap |
|---|---|
| `tools/art-bake/package.json` | 7 / 7 |
| `tools/art-bake/palette.json` | 45 / 45 (verbatim) |
| `tools/art-bake/palette.ts` | 23 / 24 |
| `tools/art-bake/sprite.ts` | 74 / 76 |
| `tools/art-bake/png.ts` | 22 / 22 |
| `tools/art-bake/recipes/crate.ts` | 44 / 46 |
| `tools/art-bake/bake.ts` | 46 / 47 |
| `.gitignore` | 1 / 1 |
| `tests/tools/art1a-bake.test.ts` | 125 / 125 (verbatim) |
| **Total** | **387 / 393** (the caps' sum; ART1a's limit is **393**, under the 400 gate) |

r2 re-size (EA): r1's limit was 386. QA's M1 adds 3 lines to `bake.ts` (the tile check) and 4 to the shipped test (the `spawnSync` import and the 64 check), so the limit rises by 7 to **393**, still under 400. No other cap moved.

Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Interfaces to match (quoted exactly)
```ts
// tools/art-bake/palette.ts
export type Rgb = readonly [number, number, number];
export type Palette = {
  readonly style: string;
  readonly outline: { readonly colour: string; readonly rampWeight: number; readonly colourWeight: number };
  readonly outlineBy: Readonly<Record<string, string>>;
  readonly ramps: Readonly<Record<string, readonly string[]>>;
};
export const PALETTE: Palette;                       // palette.json, parsed at load
export function rgb(hex: string): Rgb;               // "#rrggbb" → [r, g, b]
export function ramp(name: string): readonly Rgb[];  // throws Error(`art-bake: no ramp "${name}" in palette.json`)
// tools/art-bake/sprite.ts
export type Tile = 32 | 48;
export type Grid = { readonly w: number; readonly h: number; readonly mat: (string | null)[]; readonly step: number[] };
export type Sprite = { readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly mat: readonly (string | null)[]; readonly step: readonly number[] };
export function newGrid(w: number, h: number, mat: string | null): Grid;   // every cell mat, step 0
export function put(grid: Grid, x: number, y: number, mat: string | null, step: number): void;
export function gridSprite(grid: Grid): Sprite;      // Ruling 5
export function outlineOf(s: Sprite): (string | null)[];   // the outline material per pixel, or null (Ruling 6)
export function colourise(s: Sprite): Uint8Array;    // RGBA, w × h × 4 (Ruling 6)
// tools/art-bake/png.ts
export function encodePng(w: number, h: number, rgba: Uint8Array): Buffer;
// tools/art-bake/recipes/crate.ts
export function crate(tile: Tile): Grid;
// tools/art-bake/bake.ts
export const RECIPES: Readonly<Record<string, (tile: Tile) => Grid>>;   // { crate }
export const DEFAULT_TILES: readonly Tile[];                             // [32]
export type Baked = { readonly sprite: Sprite; readonly rgba: Uint8Array; readonly sha256: string };
export type ManifestRow = { readonly name: string; readonly tile: Tile; readonly file: string; readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly sha256: string };
export function bakeOne(name: string, tile: Tile): Baked;   // throws Error(`art-bake: no recipe "${name}"`)
export function bakeAll(outDir: string, tiles?: readonly Tile[]): ManifestRow[];   // default DEFAULT_TILES
```
`bake.ts` runs its CLI only when it is the entry file (`process.argv[1] === fileURLToPath(import.meta.url)`), so importing it has no side effect. Error texts are quoted exactly (the shipped test matches `/no ramp "nope"/`).

## Smoke lines
None. ART1a changes no maker, play-stage or export file, so the 25 smokes and the export audit are not required. HANDBACK § Smoke says "Not run: no UI or export file changed (git diff names only tools/art-bake/**, .gitignore and the shipped test)".

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done
Copy `handoff/steps/tests/step-art1a-bake-core/tests/tools/art1a-bake.test.ts` to `tests/tools/art1a-bake.test.ts` **verbatim** (sha256 `f3b1f47b5e891f0e6355d0cbb3d08c043ceeab10eb3cdaf05c2dda49316751e3`, 125 lines). Six tests:
- "ART1a port check: the crate recipe bakes pixel for pixel the same as the B r6b Python recipe at 32 and 48 px (pixel sha256, size, whole-pixel foot)": `RECIPES` is `{ crate }`; crate 32 is 19×27, foot 10,26, sha256 `99ef690d…cc88`; crate 48 is 27×40, foot 14,39, sha256 `97047142…5984`.
- "ART1a deterministic: two bakes give identical bytes, and the PNG holds exactly those pixels (RGBA 8-bit, filter 0)".
- "ART1a sprite: a 1 px margin, steps clipped to the ramp, foot at the bottom centre, and a sel-out outline (right, left, below, above) from the neighbour's darkest step mixed with plum": a 3×1 grid (crate step 99, empty, steel8 step −4) gives a 5×3 sprite, foot 3,2; the clipped steps; the shared empty pixel takes steel8 (right first); the edges; the diagonals stay transparent; the crate outline is `[43, 24, 32, 255]`.
- "ART1a palette: one palette.json, every recipe reads its ramps by material name; the B r6b ramps and outline, never pure black or white": 38 ramps; crate and steel8 exact; the outline weights; no `#000000` or `#ffffff`; `ramp("nope")` throws; no hex colour or `palette.json` in `recipes/`.
- "ART1a fence: tools/art-bake has its own package.json with no dependencies, the root package.json gains none, nothing in src imports it, and the rig has no Math.random, Date or performance": plus the `.gitignore` line.
- "ART1a runner: bakeAll writes one PNG per recipe at the 32 px default (the 48 px bake on request, any other tile refused), plus manifest.json with each file's size, whole-pixel foot and pixel sha256": it also spawns `node tools/art-bake/bake.ts <dir> 64` and requires a non-zero exit and `art-bake: tile must be 32 or 48 ("64")` on stderr.
(You may add tests. The hand-back lists each shipped file's sha256, unchanged.) Floor: **1188 + 6 = 1194**.

## How a planted bug is caught (for QA)
`handoff/steps/tests/step-art1a-bake-core/plants-art1a.py` (sha256 `74ce74d98758466f03771a35338cfb63beef690be5623e157c2c1cd2d06e5d57`, 43 lines), run from the repo root on a clean ART1a tree: **24/24 caught** in the trial. They are: P1 the lid frame loses its lit step; P2 the brace shadow moved; P3 the front's right side stays in the sun; P4 the nails in crate wood; P5 no 1 px margin; P6 steps not clipped; P7 the foot rounds half down; P8 the outline looks left before right; P9 the outline takes diagonals; P10 a black outline; P11 the outline mix rounds instead of truncating; P12 a see-through outline; P13 a colour constant written into a recipe; P14 a palette colour changed; P15 pure white in the palette; P16 `Math.random` in the rig; P17 the engine (`src/sim/actions.ts`) imports the rig; P18 a library in the rig's `package.json`; P19 a bake library in the root `package.json`; P20 the default bake at 48 px; P21 `out/` not ignored; P22 PNG rows written over their filter byte; P23 the manifest drops the pixel hash; P24 an unsupported tile silently bakes 32 (the r1 fallback, QA M1). Each plant is one exact edit; the script asserts it applies once and restores the file. Its anchors are the next section's lines, so keep them verbatim. If a plant doesn't apply, report it; don't edit the script.

## Plant anchors (quoted exactly; each appears exactly once in its file)
These are ordinary lines of the port. Write them as shown (leading spaces included where a line starts with spaces), so QA's plants apply to your tree:
- `tools/art-bake/recipes/crate.ts`: `if (frame) return y < b || x < b || y >= ht - b ? 5 : 4;` · `if (0.4 <= dd && dd < 1.4) return 2;` · the whole line `  if (x >= w - 3 * b - (tile === 48 ? 1 : 0) && !(x >= w - b)) st -= 1;` · `put(g, x, y, "steel8", x < w / 2 ? 5 : 3);` · the whole line `  const b = tile === 48 ? 2 : 1;`
- `tools/art-bake/sprite.ts`: `const w = grid.w + 2;` · `Math.min(Math.max(grid.step[y * grid.w + x] ?? 0, 0), top)` · `foot: [Math.floor(w / 2 + 0.5), h - 1]` · `[[1, 0], [-1, 0], [0, 1], [0, -1]]` · `const mix = rgb(PALETTE.outline.colour);` · `Math.trunc(c * PALETTE.outline.rampWeight` · `rgba.set([c[0] ?? 0, c[1] ?? 0, c[2] ?? 0, 255], i * 4);`
- `tools/art-bake/png.ts`: a line starting `  const sig = Buffer.from(` (the PNG signature) · `y * (w * 4 + 1) + 1);`
- `tools/art-bake/bake.ts`: `DEFAULT_TILES: readonly Tile[] = [32];` · `foot: sprite.foot, sha256 });` · the whole line ``     if (arg !== "32" && arg !== "48") throw new Error(`art-bake: tile must be 32 or 48 ("${arg}")`); `` (four leading spaces; the double-backtick span adds one space at each end: it sits in the CLI's `map` callback)
- `tools/art-bake/package.json`: `"type": "module",` · `.gitignore`: the line `tools/art-bake/out`
- The plants also edit `tools/art-bake/palette.json` (verbatim), `src/sim/actions.ts` L1 and the root `package.json` (both untouched by you).

## Example
QA runs `node tools/art-bake/bake.ts /tmp/b 32 48`. It prints `crate-32.png 19x27 foot 10,26 99ef690d…` and `crate-48.png 27x40 foot 14,39 97047142…`, and writes the two PNGs and `manifest.json`. The 48 px crate shows the r6 lid with its lit frame and diagonal brace, the dark lip seam, the X-braced front falling into shade on the right, six silver nails and a 1 px plum-dark outline. Then `python3 handoff/steps/tests/step-art1a-bake-core/ref/ref-art1a.py /tmp/p` prints the same crate hashes from the frozen Python, plus the barrel's for ART1b.

## Decisions note: what to name
- Any helper you add inside a file (name it; it must stay inside the caps).
- How you ported `crate_grid`'s branches (the trial splits it into a lid step and a front step function; any equivalent split is fine if the pins and plants hold).
- That nothing reads `ref/` at test time (the pins are literals in the shipped test).
- Runtime bounds (BUILD_GUIDE law 13): nothing is retained between bakes; `palette.json` is parsed once at load.

## Do not touch
- `src/**`, `tools/maker`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/pixel-suite`, `data/`, `fixtures/`, the format docs, `docs/maker/art-style.md`, `docs/maker/ux/**`, `painter-proto`, `ui-shell`; plus BUILD_GUIDE §7's never-edit list.
- The root `package.json` and `package-lock.json`; `map.tile` and any tile-size setting (F3a).
- Any smoke or existing test. No new dependency, font, image file or committed PNG. No file under `handoff/` except your HANDBACK under `handback/`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least **1194** tests passing (green = BUILD_GUIDE §6).
- [ ] `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors: `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` L93 twice (TS7053).
- [ ] The shipped test and `palette.json` are byte-identical to their listed sha256; `plants-art1a.py`: 24/24 caught.
- [ ] `node tools/art-bake/bake.ts /tmp/b 32 48` prints the two pinned hashes, and `node tools/art-bake/bake.ts /tmp/x 64` exits non-zero with `art-bake: tile must be 32 or 48 ("64")`; `cd handoff/steps/tests/step-art1a-bake-core && sha256sum -c SHA256SUMS` passes (you didn't change the kit).
- [ ] `git diff --name-only <base>` lists only the 9 files in Files (plus `handback/**`).
- [ ] Each file within its cap; at most **393** counted lines (trial 387); over it, stop and report.
- [ ] Rule 8 (Ruling 11): no new statement packed onto a line.
- [ ] Hand-back complete per handoff/HAND-BACK.md at the hand-back location above, with § Green (counts), § Plants, § Port check (the bake's printed lines), § Smoke ("Not run", Smoke lines) and § Helpers & self-review.

## Not in this step (carries, with their target step)
- **The barrel** (r6 `barrel_grid`): ported in EA's trial and pixel-identical at 32 and 48 (pins in `ref/expected/ref-art1a.json`: `3cece1b7…80d2`, `9be6b109…f60c`). Its 64 lines would put ART1a at 451, so it is the first recipe of **ART1b**. It needs a half-to-even `round` (Python's) for its hoop and stave steps.
- Shared blocks for shaded recipes (`hash2`, `vnoise`, `fbm`, `sphere`, `ramp_q`, `ramp_lerp`, shape fills, the rim pass, bias), contact-shadow shapes and PNGs: **ART1b**.
- Stamps, trees, bushes, fence: **ART1c**. Houses (with the r6b chimney) and units: **ART1d**. Ground tiles, water frames and blob47 edges: **ART1e** (the old ART1b). See EA's re-size (plan delta, held by CoS).
- The lighting and weather passes (art-style.md § 4 item 4), the multiply `Blend` (a DSK format change), and the maker drawing art from recipes: engine and maker steps after the port (F3a, F3b and later), not the bake.
- **Law-12 hardening of the palette and outline (QA r1 note): ART1b**, when it next touches these files. `palette.ts` `ramp()` rejects a ramp outside 2–8 steps; `rgb()` rejects anything that isn't `#rrggbb`; `sprite.ts` L57 drops its `?? [0, 0, 0]` black fallback for an empty ramp. Today `palette.json` is verbatim and test-checked, so none of these can fire in ART1a. EA note for ART1b: the r6b palette has 1-step ramps (the `fl_*` flower colours) and a 9-step `leaf` ramp, so ART1b must settle the 2–8 bound with UX (or narrow it to the ramps recipes index) before it lands.
- The terrain-ramp mapping onto §6.2.5's six keys (art-style.md L38, "ART1a and DSK set the exact mapping"): no terrain recipe lands in ART1a, so the mapping is **ART1e**'s, with DSK. ART1a only carries the ramps.

## Out of scope
- Any screen, project, format, play or maker change. Any new art (no well, no new prop).

## Open questions
1. (QA, CoS) Ruling 12 puts 5.97 MB of reference bytes (121 files) into the public repo under `handoff/`. EA left out the two `b-r6b/*-vs-concept.png` sheets (11.2 MB), because they embed the AI concept image and aren't checkpoint renders; their lines in `b-r6b/SHA256SUMS` are skipped with `--ignore-missing`. QA agrees they stay out (r1 review). Whether to add them to the public repo is CoS's call with the CEO.
2. (UX) The ART1c–ART1e rows and the re-size are EA's proposal for the plan; UX owns the plan lines (EA's `PLAN-LINES.md` / `PLAN-DELTA.patch`, held by CoS).
