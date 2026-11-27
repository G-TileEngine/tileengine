# Rebuild record: step ART1a, the art bake core (tools/art-bake: pixel-mode sprite, sel-out outline, one palette file, PNG writer, runner and manifest; the r6 crate recipe ported from Python, pixel-exact at 32 and 48 px)

Original brief: [`docs/maker/steps/step-art1a-bake-core.md`](../maker/steps/step-art1a-bake-core.md) on the merge (kit r2, blob `c5ff04aa`, sha256 `a3faaa3ce1bc18fddc834bcddce8b975678bd15d38b08f0b4e283d7ac429ff6f`, 182 lines). Step id L3; Base L5; Branch L6; Delivery L7; Hand-back L8; Depends on L9; Read first L14; Kit L16; Carries L17; Working style L19; Goal L21; Placement card L28; Rulings L36 (1 TypeScript run by Node, 2 own package, 3 deterministic, 4 one palette file, 5 the sprite, 6 colourise, 7 the crate, 8 tile size, 9 PNG writer, 10 runner and manifest, 11 Rule 8, 12 kit bytes not counted); Files L50; Size L62 (table L64–L75, r2 re-size note L77); Interfaces L81; Smoke lines L117; Existing tests changed L120; Shipped tests L123 (titles L125–L130); Plants L133; Plant anchors L136; Example L145; Decisions note L148; Do not touch L154; Acceptance L159; Not in this step L169; Out of scope L177; Open questions L180. Count command L62 (QA's G7); the guide's limit was **393** (L75); the r2 go-line re-stated the caps to a **400** limit, the hard gate (see (a) and (d)).

Kit (pushed before the go in `62fbaa65`): `handoff/steps/tests/step-art1a-bake-core/`, 121 files, 5,970,450 bytes (5,659,836 of them PNG and GIF checkpoints, guide Ruling 12); its `SHA256SUMS` (blob `831a305c`, sha256 `90207be2b0fbd3e642239539786812632f08ee8e72bf448ec521232f8a28757d`, 117 entries) covers every file but the four `SHA256SUMS` files. It holds the shipped test `tests/tools/art1a-bake.test.ts` (sha256 `f3b1f47b5e891f0e6355d0cbb3d08c043ceeab10eb3cdaf05c2dda49316751e3`, 125 lines, 6 titles), `files/tools/art-bake/palette.json` (sha256 `ddf7456b709f1b0a3427ba08ef3a7fc7f3f88605ab3d49b39f5951abd7685382`, 45 lines), the plants `plants-art1a.py` (blob `266cb6dc`, sha256 `74ce74d98758466f03771a35338cfb63beef690be5623e157c2c1cd2d06e5d57`, 43 lines, 24 plants), `ref/ref-art1a.py` and `ref/ref-palette.py` with `ref/expected/` (the Python pins and 4 PNGs), and `ref/styles-code/` (UX's frozen Python bake sources and the b-r6b, b-r6b-rain and b-r6b-sprites checkpoint files). Box only, never pushed: the go-line paste `/workspace/share/art1a/step-art1a-paste.md` (sha256 `c97bbfc096a9eb466e0b814e1e7e192b753156e8136bf55ad401e7eff53cbcfe`, 10 lines, L1 the token placeholder); the kit trial `art1a-trial.patch` (sha256 `d009b8af412fd0cea7bf2646d60bf4e3a553266503eba7beb1f2415c6c167584`; trial commit `01987d27` on `fea3098b`, tree `c029016e`, 387 lines); the r2 go-line `/workspace/share/art1a/step-art1a-r2-goline.md` (sha256 `f407c824c45bfb0a8a6c3ed2f0094662f4b4766788b4d73ba8c4280655de4595`, 46 lines; QA checked `b04fb9af…` before its one wording fix W1) and the r2 trial `art1a-r2-trial.patch` (sha256 `ebf564f5524f421161464af179854b46e2044a8075b88280aa47a6474e4364ed`; `git am` on `ee6989cd` gives tree `020645f3`).

This is **ART1a**, the first step of the art track after ART0 (`docs/maker/ux/maker-overhaul-plan.md` L73 on the merge, the ART1a row; order L85, CEO 03:53; ART1b–ART1e rows L74–L77 are EA's re-size). It starts the recipe port that the CEO ruled on 27 Nov: `tools/art-bake/` is plain TypeScript run by Node, with its own `package.json` and no dependencies, outside green's imports like `tools/pixel-suite/`. It holds the shared core every later recipe uses (the pixel-mode sprite with a 1 px margin and whole-pixel foot, the sel-out outline and colourise of the r6b chain, the one palette file with B r6b's 38 ramps, an RGBA PNG writer, and a runner that writes one PNG per recipe and tile plus a manifest of pixel sha256), and it ports one recipe, the r6 crate, pixel for pixel the same as the Python bake at 32 and 48 px. Nothing changes in the app, the maker, play, the format or `map.tile`.

**ART0, the ruling this step builds on** (`docs/maker/art-style.md` r3 L3–L7, blob `6571c33f`, sha256 `8f62dd28…`, pushed in `deb47044`; plan (f) 5 L109 and L113, pushed in `fea3098b`). The CEO typed both answers in the Chief Of Staff's chat at 20:14 and 20:16 London on 27 Nov:
- **Style (20:14):** B r6b is the best so far and the **baseline**; it still needs more rounds.
- **Method (20:16, "Yes"):** port the Python bake recipes to JavaScript in `tools/art-bake/`, so the maker draws the art from recipes. This replaces M1, M2 and M3; the 04:57 "M3" card is void.
- **Build now, swap later:** building on r6b now and swapping in better art later is **CoS's recommendation, not a CEO ruling** (art-style.md L5; plan L113).
- **Tile size:** the plan default stays **32 px** unless the CEO rules otherwise (plan L117; art-style.md § 1 L16). r6b's main bake is 48 px; every recipe takes the tile as an input, and the 48 px bake is on request for the port check.

Sources: PR #115 (one branch, two rounds, fast-forward; https://github.com/G-TileEngine/tileengine/pull/115).
- Branch: `step/step-art1a-bake-core-r1-chatA` (r1 code head `9bd9b5ad`, r1 tip `ee6989cd`; r2 code head `5dcfc163`, r2 tip `6ed39a8e`, fast-forward on the r1 tip, no force-push).
- Hand-backs, both on the merge:
  - `handback/step-art1a-bake-core/r1/HANDBACK.md` (HB1, blob `389aa198`, 65 lines, sha256 `2b92858f9e076f89a6ae0c02cdf89ea4980b59753c03c2c84e2aa7aad97ec6d3`).
  - `handback/step-art1a-bake-core/r2/HANDBACK.md` (HB2, blob `8a69c9e5`, 88 lines, sha256 `8dcdf72082b3c683e79c5a144eb6c10189200e44ec286cd4b84acbefcbb514cf`). Each round also has `changed-files.txt`, `checks-output.txt`, `stat.txt`, `test-output.txt` and `typecheck-output.txt`. No shots (no screen).
- CoS verify reports (box): r1 `/workspace/share/step-art1a-verify/report.md` (V1, sha256 `4907da11d4382bb61bdbd410118304270bb0da0538613bf6b1db0fd18e3e513d`): READY FOR PR with 3 flags; r2 `/workspace/share/step-art1a-r2-verify/report.md` (V2, sha256 `a8cac02171552a27a3a04ff901f3a05c5bc2198fb6a1780ebbb54f349fef2a2b`): READY FOR QA.
- QA docs on main:
  - Kit, pushed with the kit in `62fbaa65`: `docs/qa/step-art1a-kit-review.md` (QK1, blob `5674530d`, 79 lines, sha256 `90060235957bab8286b5e3c0801fba520cc1e4869938b6eb7abc4ccbfa24b6ec`): **NOT OK TO SEND**, 1 must-fix (M1), 2 wording fixes (W1, W2). `docs/qa/step-art1a-kit-review-r2.md` (QK2, blob `1d550b15`, 38 lines, sha256 `fe2a46c6ba0f7dbf15e223ef23be27aa188dd8859319d295bc5ebf2b48d27e06`): **OK TO SEND**.
  - Plan, pushed in `4912a973`: `docs/qa/art1a-plan-delta-review.md` (QP, blob `9eaf9da6`, 16 lines, sha256 `6a6b1acdbf31a14b295c8d0634c6452bb6af25cf9ee2b5052704f746db643999`): OK TO PUSH.
  - `docs/qa/step-art1a-review.md` on `dad319a0` (QA1, blob `3c5a9ebb`, 54 lines, sha256 `7ce02f98296ea97254c0eb4bb1c3da107eca748541255d2e31820bfc891bd4c3`): **NOT OK TO MERGE**, one must-fix (R1). With it, `docs/qa/step-art1a-r2-goline-check.md` (GC, blob `c77dc3ae`, 25 lines, sha256 `98ec76ebcd413ed41198b0a92893ea010a06ae86becca7898cac5c070c81223b`): OK TO SEND after W1.
  - `docs/qa/step-art1a-r2-review.md` on `8791cecc` (QA2, blob `dedc65a1`, 15 lines, sha256 `f250ece58db909a35979b8ff8db9d53d5abd2f5e559e408020960f1f91ab7f19`): **OK TO MERGE**, expected tree `1593f6ea`.
- Not in the repo: QA's postmerge message to CoS (22:17 London), and the CoS notes at the end of the r1 go-line (sent to the CEO 21:04 London) and the r2 go-line (21:56 London), from CoS chat.

Line cites use HB1, HB2, V1, V2, QK1, QK2, QP, QA1, GC and QA2. Product line cites are at merge `5e668961` (tree `1593f6ea`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| ART0 and plan | `deb47044` (20:22 UK time, tree `58232aca`): `docs/maker/art-style.md` r3 plus `docs/qa/art-style-review.md` and `docs/qa/art-style-review-addendum-r3.md`. `fea3098b` (20:23, tree `bcd4e126`): plan (f) 5 ruled (L109, L113, 2 lines) plus `docs/qa/art-style-review-addendum-plan.md`. Both docs only |
| Kit rounds | r1 (QK1, NOT OK TO SEND: M1 the CLI silently baked 32 for any tile but 48; W1 Rule 8 didn't cover a braceless `for`; W2 `ref-art1a.py` failed on a missing png-dir), r2 (QK2, OK TO SEND, 20:59 UK time per CoS: M1, W1, W2 fixed; limit 386 → 393 for the tile check, guide L77; QA withdrew its r1 "2–8 ramp bound" carry) |
| Kit push | `62fbaa65aa78485f1fcf440aa3515e3287dfa432`, 21:02 (UK time), tree `6b5634ad`, on `fea3098b`: the guide, the 121-file kit folder and QK1–QK2 (124 new files). Test-neutral: `npm test` collects `tests/**/*.test.ts` only (the same 215 files before and after), the kit's `.ts` passes ESLint, and CoS's clean-clone `npm run green` on that exact tree gave 1188/0 |
| Base | `4912a973b031e924e4b9c8a48a8fce3b77e89316`, 21:03 (UK time), tree `62a79c85`: the plan's ART1a re-size (EA delta plus UX's L86 fix, plan 459 lines, sha256 `97cbf0ba…`) and QP, docs only on the kit push. The guide names `fea3098b` as its trial base (L5); main moved by the kit and this docs commit before the go. Floor **1188** tests |
| r1 commits | `9bd9b5ade13e5a15448d0949ce6cbdc85b3e9fb4` feat(art-bake): step ART1a bake core (r1 code head, tree `cc4c6b1fbb24ef399a42fa97d9b040fa3e11c55a`, 2026-11-27 21:34 UK time), then `ee6989cd72eddde45374939e074fb63f397b4759` docs(handback): step ART1a bake core r1 (tree `7ed3f9d3b7f2116b54e88ddeda144ff75eebb110`, 21:35; 6 files under `handback/step-art1a-bake-core/r1/`). Linear on the base, noreply author and committer |
| r1 verdict | Green **1194/0**; tools tsc only the 3 base errors; plants 24/24; port check printed both pins; tile 64 exits 1; 9 files, **386** (limit 393), every cap held (HB1, V1). CoS V1: READY FOR PR with 3 flags (Rule 8 double loop headers, the manifest `hash` reading, Node v22.23.3 vs `.nvmrc` 24); PR #115 opened 21:44 UK time. QA1 **NOT OK TO MERGE**: R1 (six chained control headers, one more than V1 listed); flags 2 and 3 accepted |
| QA1 push | `dad319a0b68ffabed3a6daaeefa3f58277f3cf5e`, 21:55 (UK time), tree `f2c7458b`: QA1 and GC only (2 files) |
| r2 commits | Same branch, fast-forward on `ee6989cd`: `5dcfc16315cf2fb2a61f39b822ce97e65b6250cd` fix(art-bake): step ART1a r2 Rule 8 loop headers (r2 code head, tree `020645f362071d6c796d203ff52e193502d36a11` = EA's r2 trial tree, 22:03), then `6ed39a8ec6377d81b23ef67da9633e432b4dfa08` docs(handback): step ART1a bake core r2 (tree `4a1762ce4c6167ae268bbcdd8e5b3ff03f3ae1a4`, 22:09; 6 files under `handback/step-art1a-bake-core/r2/`). From `ee6989cd` to `5dcfc163` only the six split lines and bake.ts's default out dir change (3 files, +40/−28) |
| r2 verdict | Green **1194/0**; tools tsc only the 3 base errors; plants 24/24; Rule 8 scan clean; port pins unchanged and the PNGs and manifest byte-identical to r1; **398** under the re-stated caps (limit 400) (HB2, V2, GC). CoS V2: READY FOR QA, merge tree onto `dad319a0` predicted `1593f6ea`. QA2 **OK TO MERGE** |
| Merge | PR #115 (opened 21:44, merged 22:14), merge commit `5e668961543f3312d0709e562c40c768bf44f272`, 2026-11-27 22:14 (UK time). Tree `1593f6ea45fd29b4882882638ca57d55c2199eaf` (the tree CoS and QA predicted). First parent `dad319a0b68ffabed3a6daaeefa3f58277f3cf5e`, second parent `6ed39a8ec6377d81b23ef67da9633e432b4dfa08`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #115: Step ART1a: bake core (tools/art-bake, r6 crate port, pixel-exact at 32/48)`. `merge-pr.sh --expect-tree 1593f6ea`: npm test on the merge **1194 pass / 0 fail** |
| After the merge | `8791cecc056e87281514ac0fee0b7dd4aa57a9dc` (22:15, tree `5ac7c53d`) adds only `docs/qa/step-art1a-r2-review.md` (QA2) |
| Postmerge | CoS ran `qa-postmerge.sh 5e668961 6ed39a8e --qa-tree 1593f6ea --floor 1194`: **PASS** (parent 2 = the picked tip; noreply; the src/tests/tools diff equals parent 1..merge; merge vs tip only the 2 docs/qa files from main; the tree matches QA's; 5/5 pins unchanged; green 1194/0; smoke 0 failed; one warning, main moved by the QA2 push). QA's own postmerge (QA's message to CoS, 22:17 London; not in the repo): **PASS**; merge `5e668961`, tree `1593f6ea` (its expected tree), parents `dad319a0` + `6ed39a8e`, green 1194/0 at floor 1194, pins 5/5, smoke 0 failed; the one warning is expected: main `8791cecc` is one docs commit past, and `step-art1a-r2-review.md` `f250ece5` matches |
| Tests | 1188 + N=6 (the six shipped tests in `tests/tools/art1a-bake.test.ts`) = **1194 pass / 0 fail**. The floor after this merge is **1194** |

## (b) Files

From `git diff --name-status dad319a0..5e668961 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` against the merge's first parent, the same as against the base `4912a973` for these files. Caps are the r2 go-line's table (it replaced the guide's Files table, L64–L75; guide caps in brackets).

| File | Status | ins / del | r2 cap (guide cap) | Counted? |
|---|---|---|---|---|
| `tools/art-bake/package.json` | A | 7 / 0 | 7 (7) | yes. **7**, on cap (sha256 `936a6264d412b843fc2181d01c2ef9dcf1ba6dcfadbf7c3eaaf316c3f53c1347`) |
| `tools/art-bake/palette.json` | A | 45 / 0 | 45 (45, verbatim) | yes. **45**, on cap (sha256 `ddf7456b709f1b0a3427ba08ef3a7fc7f3f88605ab3d49b39f5951abd7685382`) |
| `tools/art-bake/palette.ts` | A | 21 / 0 | 21 (24) | yes. **21**, on cap |
| `tools/art-bake/sprite.ts` | A | 79 / 0 | 80 (76) | yes. **79**, under cap |
| `tools/art-bake/png.ts` | A | 21 / 0 | 21 (22) | yes. **21**, on cap |
| `tools/art-bake/recipes/crate.ts` | A | 51 / 0 | 52 (46) | yes. **51**, under cap |
| `tools/art-bake/bake.ts` | A | 48 / 0 | 48 (47) | yes. **48**, on cap |
| `.gitignore` | M | 1 / 0 | 1 (1) | yes. **1**, on cap |
| `tests/tools/art1a-bake.test.ts` | A | 125 / 0 | 125 (125, verbatim) | yes. **125**, on cap (sha256 `f3b1f47b5e891f0e6355d0cbb3d08c043ceeab10eb3cdaf05c2dda49316751e3`) |
| **Total** | 9 files | 398 / 0 | 400 (393) | **398** |

What the merge does not touch:
- Nothing under `src/**`, `tools/maker`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/pixel-suite`, `data/`, `fixtures/`, `ui-shell`, the root `package.json` or `package-lock.json` (V1, V2, QA1, QA2). No file under `src/` contains `art-bake`.
- `docs/maker/art-style.md`, `docs/maker/ux/**` and the kit folder untouched (the kit's `sha256sum -c` passes on the merge). `painter-proto`, named in the guide's Do not touch (L155), doesn't exist in the repo.
- No dependency, no committed PNG (`tools/art-bake/out/` is gitignored), no `Math.random`, `Date`, `performance` or `crypto.getRandomValues` in `tools/art-bake/`.
- No existing test or smoke changed; no `map.tile` or tile-size setting changed.

The official count at the r2 code head against the base, or at the merge against first parent `dad319a0`, is **9 files changed, 398 insertions(+)** = 398, at the re-stated limit of 400 (the hard gate). r1 counted **386** in the same 9 files (limit 393 then). The kit trial counted 387 (guide L62); the r2 trial counted 398 (GC).

r1 → r2 per file: `sprite.ts` 75 → 79 (two nested loops split: +2 each), `recipes/crate.ts` 45 → 51 (three outer headers braced: +2 each), `bake.ts` 46 → 48 (one nested loop split: +2; the out-dir line is a replacement). Every other file is unchanged. r1 sat under the guide caps (palette.ts 21/24, sprite.ts 75/76, png.ts 21/22, crate.ts 45/46, bake.ts 46/47; HB1 § Green).

## (c) Key code and git commands

**Package and fence (Rulings 1–3).** `tools/art-bake/package.json` is exactly the guide's 7 lines (sha256 `936a6264d412b843fc2181d01c2ef9dcf1ba6dcfadbf7c3eaaf316c3f53c1347`): `"name": "tileengine-art-bake"`, `"private": true`, `"type": "module"`, `"scripts": { "bake": "node bake.ts" }`, no `dependencies` or `devDependencies`. The rig runs on Node's type stripping (Node ≥ 22.18, root `engines`). The shipped fence test greps every `.ts` file under `tools/art-bake/` for `Math.random`, `Date` and `performance`, checks the root `package.json` gains nothing, and checks no file under `src/` mentions the rig.

**Palette (Ruling 4).** `palette.json` is the kit's file verbatim (45 lines; 38 ramps in the r6b chain's import order, dark to light; `outline` `#2a1630` with `rampWeight` 0.45 and `colourWeight` 0.55; `outlineBy.leaf` `#1a1628`). `ref/ref-palette.py` checks it against the Python chain ("palette.json matches the r6b chain: 38 ramps"; V1). `palette.ts` parses it once at load with `readFileSync(new URL("./palette.json", import.meta.url))`, exports `PALETTE`, `rgb(hex)` and `ramp(name)` (throws `art-bake: no ramp "<name>" in palette.json`). Recipes name materials only; no hex colour appears under `recipes/`.

**Sprite and colourise (Rulings 5–6).** `sprite.ts`: `newGrid`, `put`, `gridSprite` (a 1 px empty margin all round, each step clipped to `0 … ramp length − 1`, foot `[Math.floor(w / 2 + 0.5), h − 1]`), `outlineOf` (an empty pixel that 4-touches the sprite takes the first opaque neighbour in the order right, left, below, above) and `colourise` (a material pixel is exactly `ramp(material)[step]`, alpha 255; an outline pixel is `outlineBy[material]` if listed, else per channel `Math.trunc(ramp[0][c] × 0.45 + plum[c] × 0.55)`; diagonals stay transparent). Helpers inside the caps: `outlineRgb` and `ch` (HB1 § Decisions).

**The crate (Ruling 7).** `recipes/crate.ts` ports the r6 `crate_grid` from the kit's `ref/styles-code/b-r6/style_b6.py`, split into `lidStep` and `frontStep` (HB1 § Decisions): the lid with its lit frame and diagonal brace, the dark seam under the lip, the X-braced front falling out of the sun on the right, and at 48 px six `steel8` nails. `const b = tile === 48 ? 2 : 1;`.

**PNG writer (Ruling 9).** `png.ts` `encodePng(w, h, rgba)`: 8-bit RGBA (colour type 6), one IDAT, filter byte 0 on every row, `deflateSync` level 9, `crc32` from `node:zlib`, helper `chunk`. Green pins the pixels, not the PNG bytes.

**Runner and manifest (Rulings 8, 10).** `bake.ts`: `RECIPES = { crate }`, `DEFAULT_TILES = [32]`, `bakeOne(name, tile)` (throws `art-bake: no recipe "<name>"`) and `bakeAll(outDir, tiles)`, which writes `{name}-{tile}.png` per recipe then tile and `manifest.json` (`{ style: "B r6b", hash, sprites: rows }`, one-space indent, trailing newline; each row `{ name, tile, file, w, h, foot, sha256 }`). `hash` is the real sha256 over every sprite's RGBA bytes in RECIPES order then tile order (HB1 § Decisions; QA1 accepted). The CLI runs only when `bake.ts` is the entry file; any tile argument but `32` or `48` throws `art-bake: tile must be 32 or 48 ("<arg>")`; with no out dir it writes `fileURLToPath(new URL("./out", import.meta.url))` (r2), so the default doesn't depend on the cwd. `.gitignore` gains `tools/art-bake/out`.

**Shipped tests:** 1–6 in `tests/tools/art1a-bake.test.ts` (125/125, verbatim), titles as guide L125–L130: port check, deterministic, sprite, palette, fence, runner (which spawns `bake.ts <dir> 64` and requires the exit and the message).

```
# Full product diff against the merge's first parent:
#
#   git diff dad319a0 5e668961 -- . ':!handback/**' ':!docs/**'
#   (the 9 files in (b))
#
# The hand-backs (not in the 400):
#   git show 5e668961:handback/step-art1a-bake-core/r1/HANDBACK.md
#   git show 5e668961:handback/step-art1a-bake-core/r2/HANDBACK.md
#
# r2 rework only:
#   git diff ee6989cd 5dcfc163   (sprite.ts, crate.ts, bake.ts; +40/−28)
#
# Product gate. Official command at the r2 code head against the base 4912a973,
# or at the merge against first parent dad319a0:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!package-lock.json'
#   9 files changed, 398 insertions(+)
#
# At 5e668961 against 4912a973 the same command also lists QA1 and GC
# (docs/qa); add ':!docs/**' to get 398 again.
#
# Named tests (npm test 1194/0, floor 1188 + N=6): the six "ART1a …" titles of
# tests/tools/art1a-bake.test.ts.
#
# tools tsc (npx tsc --noEmit -p tools/tsconfig.json): only effect-designer
# page.ts L101 (TS18047) and maker home.ts L93 (×2, TS7053).
#
# Port check (V1, V2, CoS runs; HB1 and HB2 the same):
#   node tools/art-bake/bake.ts /tmp/b 32 48
#   crate-32.png 19x27 foot 10,26 99ef690d60bf8dab906d85236e4a11001152a39445fd2cae787e03fab0fbcc88
#   crate-48.png 27x40 foot 14,39 97047142d2bc1409abb3bd50d5442c5f5c5b522d7bca9c727e9acafb4b8d5984
# The decoded RGBA of both PNGs equals, pixel for pixel, the kit's
# ref/expected/crate-32.png and crate-48.png and a fresh
#   python3 handoff/steps/tests/step-art1a-bake-core/ref/ref-art1a.py /tmp/p
# (which also prints the barrel's pins for ART1b). r2's PNGs and manifest.json
# are byte-identical to r1's.
#   node tools/art-bake/bake.ts /tmp/x 64  → exit 1,
#   art-bake: tile must be 32 or 48 ("64"), no folder written.
#
# Plants: handoff/steps/tests/step-art1a-bake-core/plants-art1a.py (74ce74d9),
# 24/24 caught at both code heads (HB1, HB2, V1, V2, QA1, GC), tree clean after:
# P1–P24 as guide L133 (the crate's lid, brace, front and nails; margin, clip and
# foot; the outline's order, diagonals, colour, rounding and alpha; a colour in a
# recipe; the palette; Math.random; the engine importing the rig; a library in
# either package.json; the 48 px default; out/ not ignored; PNG filter bytes; the
# manifest hash; a silent 32 for an unsupported tile).
#
# Smokes and export audit: not required (guide L117; no maker, play or export file).
```

## (d) What went wrong, in order, and the fix

**Kit r1 → r2, before any build (QK1, QK2).**
- **M1, law 12: the CLI silently defaulted the tile size.** The trial's bake.ts had `arg === "48" ? 48 : 32`, and Ruling 8 said "an argument that isn't 48 means 32". From kit r2 any argument but `32` or `48` throws `art-bake: tile must be 32 or 48 ("<arg>")`, pinned by plant P24 and by the shipped test's `spawnSync` on 64. The limit rose by 7, 386 → 393 (guide L77).
- **W1, Rule 8 coverage.** Ruling 11 named only braceless `if (…) continue;` and `if (…) return x;`; kit r2 added a braceless `for (…) oneStatement;`.
- **W2.** `ref-art1a.py` failed on a missing png-dir; it now makes it.
- QA withdrew its r1 carry "ramp() rejects ramps outside 2–8 steps": r6b has 1-step `fl_*` ramps and a 9-step `leaf` ramp (QK2 L37). The guide's L174 still names 2–8, with an EA note that ART1b settles it with UX.
- Push hygiene (QK2): the box kit folder also held 4 `*.r1` copies; they were moved out and CoS pushed from the push list. The pushed folder has 121 files and no `*.r1` or `*-vs-concept.png`.

**The paste after main moved.** The guide and paste name base `fea3098b` and plan lines L73, L147–L151 at plan `8b6e9386`. Before the go, main moved by the kit push (`62fbaa65`, handoff and docs, test-neutral) and the plan push (`4912a973`). On the new plan (`97cbf0ba`) L73 is still the ART1a row, but the ART1a section moved to L149–L153. CoS checked that the trial patch applies on `4912a973`. The r1 go-line sent to the CEO at 21:04 London ended with a CoS note (source: CoS chat, not the repo): main moved to `4912a973` (kit `62fbaa65` + docs-only plan); trial patch `d009b8af` applies; branch from `4912a973`; the plan's ART1a section is now L149–L153; `painter-proto` doesn't exist (its Must NOT is a no-op); the `ref/styles-code/*/SHA256SUMS` copies need `--ignore-missing`. The r2 go-line (21:56 London) also had a CoS note (same source): main moved docs-only to `dad319a0`; read the review via `git show origin/main:docs/qa/step-art1a-review.md`; don't merge or rebase main into the branch.

**r1: chained control headers (QA1 R1).** r1 wrote six lines with two control headers: `sprite.ts` L23 and L36 (`for (…) for (…) {`), `bake.ts` L27 (`for (…) for (…) {`), and `recipes/crate.ts` L41, L42 (`for (…) for (…) put(…);`) and L43 (`if (…) for (…) put(…);`, 200+ characters). QA ruled that Ruling 11 clears one loop header followed by one simple statement, not chained headers, and that these lines dropped the outer loop's braces against paste L8; the kit trial kept them split. CoS's V1 had flagged five (citing bake.ts L26, missing crate.ts L43). Splitting all six costs 12 lines: sprite 79/76, crate 51/46, bake 48/47, total 398 against 393. **CoS chose the route of re-stated caps** over winning lines back; EA's r2 go-line replaced the Files table (sprite 80, crate 52, bake 48, palette.ts and png.ts 21, total 400) and dictated the six splits; QA accepted it (GC, QA2). r2 split exactly those six lines (each outer header braced, the innermost `for (…) oneStatement;` braceless) and changed nothing else but the nit below; its code tree equals EA's r2 trial tree `020645f3`.

**Nit (QA1, fixed in r2).** bake.ts L39's default out dir `"tools/art-bake/out"` depended on the cwd; run from anywhere but the repo root it wrote a folder that isn't gitignored. r2 L41 resolves it from `import.meta.url`.

**CoS's flags that QA accepted (QA1).**
- The manifest `hash`: Ruling 10's quoted `"sha256 of the RGBA pixels"` described the field; r1's real sha256 over all sprites stands. The order is to be stated in the ART1b guide before ART2 reads it.
- The builder ran Node v22.23.3 (`.nvmrc` 24; root engines ≥ 22.18.0). CoS's and QA's greens ran on 24.22.1.

**Other notes.**
- HB1's helper passed Rule 8 and missed R1 (QA1).
- The r2 go-line QA checked (`b04fb9af`) quoted a line that isn't in the trial; W1 fixed the wording before it went out (GC).

## (e) Do it right first time

- One control header per line. `for (…) oneStatement;`, `if (…) continue;` and `if (…) return x;` with no braces are one statement; `for (…) for (…)` and `if (…) for (…)` are two, whatever the line count. Don't drop an outer loop's braces to save lines.
- Size the caps on the code the guide's rules allow: a trial that splits nested loops sets caps that a chained version only meets by breaking Rule 8.
- A CLI never falls back silently: any tile but 32 or 48 throws, quoting the argument (law 12).
- A default path in a tool resolves from `import.meta.url`, not the cwd.
- Copy the shipped test and `palette.json` byte for byte; never copy `ref/`; never edit the kit.
- A kit folder is pushed from its push list, never as a whole box folder (no `*.r1` copies, no `*-vs-concept.png`).
- When main moves before the go, check the paste's plan line numbers and paths against the new main.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only docs: QA2):
#   git diff 5e668961 HEAD -- <the 9 files in (b)>
#   (empty)
#
# Product gate at the merge against first parent dad319a0:
#   git diff --shortstat dad319a0..5e668961 -- . ':!handback/**' ':!package-lock.json' ':!docs/**'
#   9 files changed, 398 insertions(+)
#
# Green: npm ci && npm run green → 1194 pass / 0 fail.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L93 ×2).
# Kit: cd handoff/steps/tests/step-art1a-bake-core && sha256sum -c SHA256SUMS → OK.
# Port check: node tools/art-bake/bake.ts /tmp/b 32 48 → the two pins in (c);
#   node tools/art-bake/bake.ts /tmp/x 64 → exit 1 with the tile message.
# Plants: python3 handoff/steps/tests/step-art1a-bake-core/plants-art1a.py → 24/24 caught.
# Palette: python3 handoff/steps/tests/step-art1a-bake-core/ref/ref-palette.py → 38 ramps match.
# Fence: rg -n 'Math\.random|\bDate\b|performance' tools/art-bake → nothing; rg -l art-bake src → nothing.
```

## QA non-blockers carried forward

- **To ART1b** (guide L169–L175, QK1, QK2, QA1, QA2):
  - The barrel recipe (r6 `barrel_grid`), trialled pixel-exact at 32 and 48 (pins in `ref/expected/ref-art1a.json`: `3cece1b7…80d2`, `9be6b109…f60c`); it needs Python's half-to-even `round`.
  - **The manifest hash order** (each sprite's RGBA, RECIPES order then tile order) stated in the ART1b guide before ART2 reads it.
  - **Law 12:** drop both `?? [0, 0, 0]` black fallbacks in `sprite.ts` (L55 and L71 at the r1 tip, as QA1 and QA2 cite them; **L59 and L75** on the merge after r2's splits); `rgb()` rejects anything that isn't `#rrggbb`; `ramp()`'s length bound: the guide's L174 says 2–8, but QA withdrew that bound (QK2 L37) and ART1b validates against the palette's real contract, which UX and DSK settle.
  - Shared blocks for shaded recipes (`hash2`, `vnoise`, `fbm`, sphere light, banded ramps, shape fills, the rim pass, bias), contact-shadow shapes.
- **To ART1c, ART1d, ART1e** (guide L172; plan L74–L77): stamps, trees, bushes and fence; houses with the r6b chimney and units; ground tiles, water frames and blob47 edges (the old ART1b); the terrain-ramp mapping onto §6.2.5's six keys is ART1e's, with DSK.
- **Kept out of the public repo:** the two `b-r6b/*-vs-concept.png` sheets (11.2 MB; they embed the AI concept image). QA agrees (QK1); their lines in `b-r6b/SHA256SUMS` need `--ignore-missing`. Adding them is CoS's call with the CEO (guide Open question 1).
- **Open for the CEO:**
  - The order of the art port steps: plan L86 proposes ART1c, ART1d and ART1e after ART1b and before ART2; where they fall among F2b and the F steps is CoS's call with the CEO; until he rules the L85 order is unchanged (QP).
  - Build now, swap later: CoS's recommendation, not yet a CEO ruling (art-style.md L5).
  - Tile size: 32 px stays the plan default unless the CEO rules otherwise (plan L117); r6b's main bake is 48 px.
- **Unchanged:** the F1 carries to F2a (the On aria-label, the dead `.card.new`, the Budgets icon, F-b's three placements), F2b (`+ Add ability`'s plus icon), F3b (pictures) and F4 (the `.chips` row, the 72×72 thumb) (`docs/rebuild/step-f1.md`); the F0c, 11a, 11a2, 11b and 11c1 carries stand.
- **Process:** the builder's Node is v22 (`.nvmrc` 24).
- **Closed here:** plan ART1a (L73), QK1 M1/W1/W2, QA1 R1 and its nit.

## Blob check

Each file must have exactly this git blob id at `5e668961`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/art-bake/package.json` | `26d117ed8d21bf6c07182d7c6f10bb2360124409` | 7 |
| `tools/art-bake/palette.json` | `03f3318c56ee182991c253388281cef805adcde7` | 45 |
| `tools/art-bake/palette.ts` | `fd6a2161e60601919bc2eea7c30f199857a35993` | 21 |
| `tools/art-bake/sprite.ts` | `b67ee790ce0fdf22b9fe071b48627c7d21c472f1` | 79 |
| `tools/art-bake/png.ts` | `75c83820c645c1cdac9ea1a223cc5c82000cd8d0` | 21 |
| `tools/art-bake/recipes/crate.ts` | `c075f7ba45eac02e460daa5d47846007337463f4` | 51 |
| `tools/art-bake/bake.ts` | `0780e82101c826e45bc1a93843fa1471498bdda2` | 48 |
| `.gitignore` | `0b6d6d8684eb2eb3f54671d7e46a6cc7f55f78cb` | 15 |
| `tests/tools/art1a-bake.test.ts` | `67e1b00c0a78a81e0b0025208d20ac4db74b5df9` | 125 |

## Appendix: full code as merged (step ART1a, PR #115)

New files are `git show 5e668961:<path>` in full. Edited files are `git diff dad319a0 5e668961 -- <path>`, which is the same as against the base `4912a973`.

### `tools/art-bake/package.json` (new)

```json
{
  "name": "tileengine-art-bake",
  "private": true,
  "description": "Step ART1a: the B r6b art bake, Python recipes ported to TypeScript (outside green; no dependencies): node bake.ts [out-dir] [32|48 ...]",
  "type": "module",
  "scripts": { "bake": "node bake.ts" }
}
```

### `tools/art-bake/palette.json` (new)

```json
{
  "style": "B r6b (CEO 2026-11-27 20:14 and 20:16 London; docs/maker/art-style.md)",
  "outline": { "colour": "#2a1630", "rampWeight": 0.45, "colourWeight": 0.55 },
  "outlineBy": { "leaf": "#1a1628" },
  "ramps": {
    "grass": ["#1f2c2c", "#283e2a", "#365226", "#486624", "#5e7a26", "#7a8a2c", "#9c9a34", "#c4aa4a"],
    "leaf": ["#0e1824", "#12282c", "#173a2e", "#204e26", "#30621f", "#477822", "#64902a", "#8ea832", "#c8c04a"],
    "bark": ["#2a1828", "#4a2a2a", "#6a3e2c", "#8a5634", "#a8703e"],
    "dirt": ["#4a3018", "#6e4b28", "#906338", "#ad7d48", "#c2925a", "#d6ad78"],
    "bank": ["#20160e", "#3a2716", "#5a3d22", "#7a5532", "#94704a"],
    "water": ["#0c2234", "#0f3048", "#14405c", "#18506e", "#226482", "#3a7e9a", "#76b0c4"],
    "roof_red": ["#3e180f", "#5e2416", "#83321c", "#a44426", "#c05632", "#d97044", "#ec9660"],
    "roof_slate": ["#1c1f2a", "#2a2e3c", "#3a3e4e", "#4c5062", "#5f6477", "#767c90", "#9aa0b2"],
    "roof_wood": ["#2c1a0e", "#432a17", "#5c3b22", "#764e2e", "#8f633c", "#a97b4f", "#c49a6a"],
    "wall": ["#4a3a28", "#7c6648", "#a89070", "#cdb894", "#e4d3ae", "#f2e6c6"],
    "timber": ["#1e130a", "#352214", "#4e331e", "#6a4a2c", "#86633c"],
    "glass": ["#141a24", "#1f2a3a", "#2e4258", "#5a7a96", "#a4c2d8"],
    "door": ["#261609", "#3e2512", "#5a381c", "#764d29", "#8e6336"],
    "stone": ["#26262a", "#3c3c42", "#56565c", "#717176", "#8e8e92", "#adadb0"],
    "crate": ["#2e1c0e", "#4e3219", "#6e4924", "#8e6232", "#ab7c44", "#c69a60"],
    "barrel": ["#2a180c", "#46291a", "#664024", "#86582f", "#a5713e", "#bf8e58"],
    "fence": ["#24160c", "#3e2716", "#5c3c21", "#7a532f", "#97693c", "#b4844e"],
    "iron": ["#16141f", "#262638", "#3a3c52", "#56596e"],
    "glow": ["#c88a2a", "#f2c45a", "#fff2b0"],
    "steel": ["#1c1a2e", "#2e3048", "#454b68", "#5f6886", "#8089a2", "#a8b0c0", "#dcd8d0"],
    "leather": ["#2c1a0e", "#4a2e18", "#6c4626", "#8a5e34"],
    "plume": ["#5a1420", "#962030", "#cc3a34", "#f06a44"],
    "team_blue": ["#0e1e4e", "#18327a", "#2448a6", "#3a66c8", "#5e8ae0"],
    "team_red": ["#4a0c10", "#7a1418", "#a82422", "#d03a2e", "#ec6248"],
    "gold": ["#7a5410", "#b8861e", "#e6b832", "#fae070"],
    "shirt_green": ["#14301a", "#1e4a24", "#2c6630", "#3e8240", "#5aa052"],
    "shirt_red": ["#3a140c", "#5e2214", "#86341e", "#a8482a", "#c4663c"],
    "pants": ["#1e140c", "#33231a", "#4a3626", "#614a36"],
    "skin": ["#5a3220", "#8a5236", "#b8784e", "#dca070", "#f2c294"],
    "hair": ["#1a0e08", "#3a2212", "#5a3820", "#7a522e"],
    "straw": ["#6a4e1e", "#9a7632", "#c6a04c", "#e2c26e", "#f4e0a0"],
    "fl_pink": ["#e86a9a"],
    "fl_purple": ["#9a6ad8"],
    "fl_white": ["#f2eef0"],
    "petal_pink": ["#b0406a", "#e86a9a", "#f6b0c8"],
    "petal_purple": ["#6a46a8", "#9a6ad8", "#c8aef2"],
    "steel8": ["#18161f", "#2c2c3a", "#454857", "#646876", "#878b97", "#acb0b9", "#d7d9dd", "#fbf8f0"],
    "chimney": ["#26232a", "#3d393f", "#585459", "#737073", "#8f8b8c", "#aca7a4", "#cdc7be", "#e6e0d3"]
  }
}
```

### `tools/art-bake/palette.ts` (new)

```ts
import { readFileSync } from "node:fs";

export type Rgb = readonly [number, number, number];
export type Palette = {
  readonly style: string;
  readonly outline: { readonly colour: string; readonly rampWeight: number; readonly colourWeight: number };
  readonly outlineBy: Readonly<Record<string, string>>;
  readonly ramps: Readonly<Record<string, readonly string[]>>;
};
export const PALETTE: Palette = JSON.parse(readFileSync(new URL("./palette.json", import.meta.url), "utf8")) as Palette;

export function rgb(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function ramp(name: string): readonly Rgb[] {
  const hexes = PALETTE.ramps[name];
  if (hexes === undefined) throw new Error(`art-bake: no ramp "${name}" in palette.json`);
  return hexes.map((hex) => rgb(hex));
}
```

### `tools/art-bake/sprite.ts` (new)

```ts
import { PALETTE, ramp, rgb, type Rgb } from "./palette.ts";

export type Tile = 32 | 48;
export type Grid = { readonly w: number; readonly h: number; readonly mat: (string | null)[]; readonly step: number[] };
export type Sprite = { readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly mat: readonly (string | null)[]; readonly step: readonly number[] };

export function newGrid(w: number, h: number, mat: string | null): Grid {
  const n = w * h;
  return { w, h, mat: Array.from({ length: n }, () => mat), step: Array.from({ length: n }, () => 0) };
}

export function put(grid: Grid, x: number, y: number, mat: string | null, step: number): void {
  const i = y * grid.w + x;
  grid.mat[i] = mat;
  grid.step[i] = step;
}

export function gridSprite(grid: Grid): Sprite {
  const w = grid.w + 2;
  const h = grid.h + 2;
  const mat: (string | null)[] = Array.from({ length: w * h }, () => null);
  const step: number[] = Array.from({ length: w * h }, () => 0);
  for (let y = 0; y < grid.h; y++) {
    for (let x = 0; x < grid.w; x++) {
      const m = grid.mat[y * grid.w + x] ?? null;
      if (m === null) continue;
      const top = ramp(m).length - 1;
      const i = (y + 1) * w + x + 1;
      mat[i] = m;
      step[i] = Math.min(Math.max(grid.step[y * grid.w + x] ?? 0, 0), top);
    }
  }
  return { w, h, foot: [Math.floor(w / 2 + 0.5), h - 1], mat, step };
}

export function outlineOf(s: Sprite): (string | null)[] {
  const out: (string | null)[] = Array.from({ length: s.mat.length }, () => null);
  for (let y = 0; y < s.h; y++) {
    for (let x = 0; x < s.w; x++) {
      const i = y * s.w + x;
      if ((s.mat[i] ?? null) !== null) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h) continue;
        const nb = s.mat[ny * s.w + nx] ?? null;
        if (nb === null) continue;
        out[i] = nb;
        break;
      }
    }
  }
  return out;
}

function outlineRgb(name: string): Rgb {
  const listed = PALETTE.outlineBy[name];
  if (listed !== undefined) return rgb(listed);
  const dark = ramp(name)[0] ?? [0, 0, 0];
  const mix = rgb(PALETTE.outline.colour);
  const ch = (i: number): number => {
    const c = dark[i] ?? 0;
    return Math.trunc(c * PALETTE.outline.rampWeight + (mix[i] ?? 0) * PALETTE.outline.colourWeight);
  };
  return [ch(0), ch(1), ch(2)];
}

export function colourise(s: Sprite): Uint8Array {
  const rgba = new Uint8Array(s.w * s.h * 4);
  const edge = outlineOf(s);
  for (let i = 0; i < s.mat.length; i++) {
    const m = s.mat[i] ?? null;
    const name = m ?? edge[i] ?? null;
    if (name === null) continue;
    const c = m !== null ? ramp(m)[s.step[i] ?? 0] ?? [0, 0, 0] : outlineRgb(name);
    rgba.set([c[0] ?? 0, c[1] ?? 0, c[2] ?? 0, 255], i * 4);
  }
  return rgba;
}
```

### `tools/art-bake/png.ts` (new)

```ts
import { crc32, deflateSync } from "node:zlib";

function chunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type), data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const sum = Buffer.alloc(4);
  sum.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, sum]);
}

export function encodePng(w: number, h: number, rgba: Uint8Array): Buffer {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w);
  ihdr.writeUInt32BE(h, 4);
  ihdr.writeUInt16BE(0x0806, 8);
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) raw.set(rgba.subarray(y * w * 4, (y + 1) * w * 4), y * (w * 4 + 1) + 1);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
```

### `tools/art-bake/recipes/crate.ts` (new)

```ts
import { newGrid, put, type Grid, type Tile } from "../sprite.ts";

function lidStep(tile: Tile, w: number, ht: number, b: number, x: number, y: number): number {
  const frame = y < b || x < b || x >= w - b || y >= ht - b;
  if (frame) return y < b || x < b || y >= ht - b ? 5 : 4;
  let st = 3;
  if (y === b || x === b) st = 2;
  const ix = x - b;
  const iy = y - b;
  const dd = iy - ix * ((ht - 2 * b) / (w - 2 * b));
  if (-b <= dd && dd < 0.4) return 4;
  if (0.4 <= dd && dd < 1.4) return 2;
  if (iy % (tile === 48 ? 4 : 3) === 3 && st === 3) return 2;
  return st;
}

function frontStep(tile: Tile, w: number, hf: number, b: number, x: number, fy: number): number {
  if (fy === 0) return 0;
  const frame = fy <= b || x < b || x >= w - b || fy >= hf - b;
  let st = frame ? (x < b ? 4 : x >= w - b ? 2 : fy >= hf - b ? 1 : 3) : 1;
  if (!frame) {
    const ix = (x - b) / (w - 2 * b - 1);
    const iy = (fy - b - 1) / (hf - 2 * b - 2);
    const band = (tile === 48 ? 2.2 : 1.6) / (w - 2 * b);
    if ((fy - b) % (tile === 48 ? 5 : 4) === 0) st = 0;
    for (const d of [ix - iy, ix - (1 - iy)]) {
      if (Math.abs(d) < band * 0.75) st = 3;
      else if (band * 0.75 <= d && d < band * 1.5 && st !== 3) st = 0;
    }
  }
  if (x >= w - 3 * b - (tile === 48 ? 1 : 0) && !(x >= w - b)) st -= 1;
  return st;
}

export function crate(tile: Tile): Grid {
  const b = tile === 48 ? 2 : 1;
  const w = tile === 48 ? 25 : 17;
  const ht = tile === 48 ? 17 : 11;
  const hf = tile === 48 ? 21 : 14;
  const g = newGrid(w, ht + hf, "crate");
  for (let y = 0; y < ht; y++) {
    for (let x = 0; x < w; x++) put(g, x, y, "crate", lidStep(tile, w, ht, b, x, y));
  }
  for (let y = ht; y < ht + hf; y++) {
    for (let x = 0; x < w; x++) put(g, x, y, "crate", frontStep(tile, w, hf, b, x, y - ht));
  }
  if (tile === 48) {
    for (const [y, x] of [[ht + 2, 1], [ht + 2, w - 2], [ht + hf - 2, 1], [ht + hf - 2, w - 2], [1, 1], [1, w - 2]] as const) put(g, x, y, "steel8", x < w / 2 ? 5 : 3);
  }
  return g;
}
```

### `tools/art-bake/bake.ts` (new)

```ts
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng } from "./png.ts";
import { crate } from "./recipes/crate.ts";
import { colourise, gridSprite, type Grid, type Sprite, type Tile } from "./sprite.ts";

export const RECIPES: Readonly<Record<string, (tile: Tile) => Grid>> = { crate };
export const DEFAULT_TILES: readonly Tile[] = [32];
export type Baked = { readonly sprite: Sprite; readonly rgba: Uint8Array; readonly sha256: string };
export type ManifestRow = { readonly name: string; readonly tile: Tile; readonly file: string; readonly w: number; readonly h: number; readonly foot: readonly [number, number]; readonly sha256: string };

export function bakeOne(name: string, tile: Tile): Baked {
  const make = RECIPES[name];
  if (make === undefined) throw new Error(`art-bake: no recipe "${name}"`);
  const sprite = gridSprite(make(tile));
  const rgba = colourise(sprite);
  const sha256 = createHash("sha256").update(rgba).digest("hex");
  return { sprite, rgba, sha256 };
}

export function bakeAll(outDir: string, tiles: readonly Tile[] = DEFAULT_TILES): ManifestRow[] {
  mkdirSync(outDir, { recursive: true });
  const rows: ManifestRow[] = [];
  const hash = createHash("sha256");
  for (const name of Object.keys(RECIPES)) {
    for (const tile of tiles) {
      const { sprite, rgba, sha256 } = bakeOne(name, tile);
      const file = `${name}-${tile}.png`;
      writeFileSync(join(outDir, file), encodePng(sprite.w, sprite.h, rgba));
      hash.update(rgba);
      rows.push({ name, tile, file, w: sprite.w, h: sprite.h, foot: sprite.foot, sha256 });
    }
  }
  writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify({ style: "B r6b", hash: hash.digest("hex"), sprites: rows }, null, 1)}\n`);
  return rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outDir = process.argv[2] ?? fileURLToPath(new URL("./out", import.meta.url));
  const args = process.argv.slice(3);
  const tiles = args.length === 0 ? DEFAULT_TILES : args.map((arg) => {
    if (arg !== "32" && arg !== "48") throw new Error(`art-bake: tile must be 32 or 48 ("${arg}")`);
    return Number(arg) as Tile;
  });
  for (const row of bakeAll(outDir, tiles)) console.log(`${row.file} ${row.w}x${row.h} foot ${row.foot[0]},${row.foot[1]} ${row.sha256}`);
}
```

### `.gitignore` (edited)

```diff
diff --git a/.gitignore b/.gitignore
index 5845693..0b6d6d8 100644
--- a/.gitignore
+++ b/.gitignore
@@ -12,3 +12,4 @@ tools/apk/android
 tools/apk/artifacts
 *.jks
 *.keystore
+tools/art-bake/out
```

### `tests/tools/art1a-bake.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { bakeAll, bakeOne, DEFAULT_TILES, RECIPES } from "../../tools/art-bake/bake.ts";
import { PALETTE, ramp, rgb } from "../../tools/art-bake/palette.ts";
import { encodePng } from "../../tools/art-bake/png.ts";
import { colourise, gridSprite, newGrid, put } from "../../tools/art-bake/sprite.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const RIG = join(root, "tools/art-bake");

// sha256 of the RGBA pixels from the B r6b Python recipe (b-r6/style_b6.py crate6, colourised by the
// r6b chain without the scene's far-depth haze), made by the kit's ref/ref-art1a.py.
const PINS = [
  { name: "crate", tile: 32, w: 19, h: 27, foot: [10, 26], sha: "99ef690d60bf8dab906d85236e4a11001152a39445fd2cae787e03fab0fbcc88" },
  { name: "crate", tile: 48, w: 27, h: 40, foot: [14, 39], sha: "97047142d2bc1409abb3bd50d5442c5f5c5b522d7bca9c727e9acafb4b8d5984" },
] as const;

const walk = (dir: string): string[] => readdirSync(dir, { recursive: true, encoding: "utf8" }).map((name) => join(dir, name)).filter((path) => statSync(path).isFile());

test("ART1a port check: the crate recipe bakes pixel for pixel the same as the B r6b Python recipe at 32 and 48 px (pixel sha256, size, whole-pixel foot)", () => {
  assert.deepEqual(Object.keys(RECIPES), ["crate"]);
  for (const pin of PINS) {
    const { sprite, sha256 } = bakeOne(pin.name, pin.tile);
    assert.equal(sha256, pin.sha, `${pin.name} at ${pin.tile}`);
    assert.deepEqual([sprite.w, sprite.h], [pin.w, pin.h], `${pin.name} at ${pin.tile} size`);
    assert.deepEqual(sprite.foot, pin.foot, `${pin.name} at ${pin.tile} foot`);
  }
});

test("ART1a deterministic: two bakes give identical bytes, and the PNG holds exactly those pixels (RGBA 8-bit, filter 0)", () => {
  for (const pin of PINS) {
    const a = bakeOne(pin.name, pin.tile);
    const b = bakeOne(pin.name, pin.tile);
    assert.deepEqual(a.rgba, b.rgba);
    const png = encodePng(a.sprite.w, a.sprite.h, a.rgba);
    assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20), png[24], png[25]], [pin.w, pin.h, 8, 6]);
    const idatLen = png.readUInt32BE(33);
    assert.equal(png.toString("latin1", 37, 41), "IDAT");
    const rows = inflateSync(png.subarray(41, 41 + idatLen));
    const stride = pin.w * 4 + 1;
    const pixels = Buffer.concat(Array.from({ length: pin.h }, (_, y) => rows.subarray(y * stride + 1, (y + 1) * stride)));
    assert.ok(Array.from({ length: pin.h }, (_, y) => rows[y * stride]).every((f) => f === 0));
    assert.deepEqual(new Uint8Array(pixels), a.rgba);
  }
});

test("ART1a sprite: a 1 px margin, steps clipped to the ramp, foot at the bottom centre, and a sel-out outline (right, left, below, above) from the neighbour's darkest step mixed with plum", () => {
  const g = newGrid(3, 1, null);
  put(g, 0, 0, "crate", 99);
  put(g, 2, 0, "steel8", -4);
  const s = gridSprite(g);
  assert.deepEqual([s.w, s.h, s.foot], [5, 3, [3, 2]]);
  const px = colourise(s);
  const at = (x: number, y: number): number[] => [...px.subarray((y * s.w + x) * 4, (y * s.w + x) * 4 + 4)];
  const mix = (m: string): number[] => {
    const dark = ramp(m)[0] ?? [0, 0, 0];
    const plum = rgb(PALETTE.outline.colour);
    return [0, 1, 2].map((i) => Math.trunc((dark[i] ?? 0) * 0.45 + (plum[i] ?? 0) * 0.55)).concat(255);
  };
  assert.deepEqual(at(1, 1), [...(ramp("crate")[5] ?? []), 255]);
  assert.deepEqual(at(3, 1), [...(ramp("steel8")[0] ?? []), 255]);
  assert.deepEqual(at(2, 1), mix("steel8"));
  assert.deepEqual(at(0, 1), mix("crate"));
  assert.deepEqual(at(1, 0), mix("crate"));
  assert.deepEqual(at(3, 2), mix("steel8"));
  assert.deepEqual(at(4, 2), [0, 0, 0, 0]);
  assert.deepEqual(mix("crate"), [43, 24, 32, 255]);
});

test("ART1a palette: one palette.json, every recipe reads its ramps by material name; the B r6b ramps and outline, never pure black or white", () => {
  assert.equal(Object.keys(PALETTE.ramps).length, 38);
  assert.deepEqual(PALETTE.ramps["crate"], ["#2e1c0e", "#4e3219", "#6e4924", "#8e6232", "#ab7c44", "#c69a60"]);
  assert.deepEqual(PALETTE.ramps["steel8"], ["#18161f", "#2c2c3a", "#454857", "#646876", "#878b97", "#acb0b9", "#d7d9dd", "#fbf8f0"]);
  assert.deepEqual(PALETTE.outline, { colour: "#2a1630", rampWeight: 0.45, colourWeight: 0.55 });
  const all = Object.values(PALETTE.ramps).flat();
  assert.ok(all.every((hex) => /^#[0-9a-f]{6}$/.test(hex) && hex !== "#000000" && hex !== "#ffffff"));
  assert.throws(() => ramp("nope"), /no ramp "nope"/);
  const recipes = readdirSync(join(RIG, "recipes")).map((name) => readFileSync(join(RIG, "recipes", name), "utf8"));
  assert.ok(recipes.every((text) => !/#[0-9a-f]{6}/i.test(text) && !text.includes("palette.json")));
});

test("ART1a fence: tools/art-bake has its own package.json with no dependencies, the root package.json gains none, nothing in src imports it, and the rig has no Math.random, Date or performance", () => {
  const own = JSON.parse(readFileSync(join(RIG, "package.json"), "utf8")) as { name: string; dependencies?: unknown; devDependencies?: unknown };
  assert.equal(own.name, "tileengine-art-bake");
  assert.equal(own.dependencies, undefined);
  assert.equal(own.devDependencies, undefined);
  const top = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { dependencies?: unknown; devDependencies: Record<string, string> };
  assert.equal(top.dependencies, undefined);
  assert.deepEqual(Object.keys(top.devDependencies), ["@types/node", "dependency-cruiser", "eslint", "typescript", "typescript-eslint"]);
  const hits = walk(join(root, "src")).filter((path) => readFileSync(path, "utf8").includes("art-bake"));
  assert.deepEqual(hits, []);
  for (const path of walk(RIG).filter((p) => p.endsWith(".ts"))) {
    assert.doesNotMatch(readFileSync(path, "utf8"), /Math\.random|\bDate\b|performance\.|getRandomValues/, path);
  }
  assert.ok(readFileSync(join(root, ".gitignore"), "utf8").split("\n").includes("tools/art-bake/out"));
});

test("ART1a runner: bakeAll writes one PNG per recipe at the 32 px default (the 48 px bake on request, any other tile refused), plus manifest.json with each file's size, whole-pixel foot and pixel sha256", () => {
  const dir = mkdtempSync(join(tmpdir(), "art1a-"));
  try {
    assert.deepEqual(DEFAULT_TILES, [32]);
    const rows = bakeAll(dir);
    assert.deepEqual(rows.map((r) => r.file), ["crate-32.png"]);
    const man = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")) as { sprites: { file: string; sha256: string; foot: number[] }[] };
    assert.deepEqual(man.sprites, JSON.parse(JSON.stringify(rows)));
    for (const row of rows) {
      assert.ok(existsSync(join(dir, row.file)));
      assert.equal(row.sha256, PINS.find((p) => p.name === row.name && p.tile === row.tile)?.sha);
      assert.ok(row.foot.every((v) => Number.isInteger(v)));
    }
    assert.equal(bakeAll(dir, [32, 48]).length, 2);
    const bad = spawnSync(process.execPath, [join(RIG, "bake.ts"), dir, "64"], { encoding: "utf8" });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /art-bake: tile must be 32 or 48 \("64"\)/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
```
