# Hand-back step-art1a-bake-core r1
Step file: docs/maker/steps/step-art1a-bake-core.md (r2, sha256 a3faaa3ce1bc18fddc834bcddce8b975678bd15d38b08f0b4e283d7ac429ff6f)
Base commit: 4912a973b031e924e4b9c8a48a8fce3b77e89316     Head commit: 9bd9b5ade13e5a15448d0949ce6cbdc85b3e9fb4     Tree: cc4c6b1fbb24ef399a42fa97d9b040fa3e11c55a     Branch: step/step-art1a-bake-core-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	.gitignore
A	tests/tools/art1a-bake.test.ts
A	tools/art-bake/bake.ts
A	tools/art-bake/package.json
A	tools/art-bake/palette.json
A	tools/art-bake/palette.ts
A	tools/art-bake/png.ts
A	tools/art-bake/recipes/crate.ts
A	tools/art-bake/sprite.ts

## Green
npm test: 1194/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
`npm ci && npm run green` exited 0. Floor 1188 + 6 = 1194.
Code head: 9bd9b5ade13e5a15448d0949ce6cbdc85b3e9fb4
Code tree: cc4c6b1fbb24ef399a42fa97d9b040fa3e11c55a
Tip: this hand-back commit. A commit cannot store its own sha; the hand-back message quotes the full tip sha. Check: `git rev-parse HEAD^` is the code head above.
tools tsc (`npx tsc --noEmit -p tools/tsconfig.json`): only the 3 base errors, exit 2 from tsc itself:
- tools/effect-designer/page.ts(101,28) TS18047
- tools/maker/home.ts(93,221) TS7053
- tools/maker/home.ts(93,266) TS7053
Counted lines vs base: 386 additions + 0 deletions = 386 (limit 393; trial 387). Per file: package.json 7/7, palette.json 45/45, palette.ts 21/24, sprite.ts 75/76, png.ts 21/22, recipes/crate.ts 45/46, bake.ts 46/47, .gitignore 1/1, shipped test 125/125.

## Plants
handoff/steps/tests/step-art1a-bake-core/plants-art1a.py: 24/24 caught. The kit was restored after the run (the script restores each file itself).

## Port check
`node tools/art-bake/bake.ts /tmp/b 32 48` printed:
```
crate-32.png 19x27 foot 10,26 99ef690d60bf8dab906d85236e4a11001152a39445fd2cae787e03fab0fbcc88
crate-48.png 27x40 foot 14,39 97047142d2bc1409abb3bd50d5442c5f5c5b522d7bca9c727e9acafb4b8d5984
```
`node tools/art-bake/bake.ts /tmp/x 64` exited 1 with `art-bake: tile must be 32 or 48 ("64")` on stderr and wrote no PNG. `cd handoff/steps/tests/step-art1a-bake-core && sha256sum -c SHA256SUMS` passed in full (kit unchanged).

## Smoke
Not run: no UI or export file changed (git diff names only tools/art-bake/**, .gitignore and the shipped test).

## Shipped tests (sha256, unchanged)
f3b1f47b5e891f0e6355d0cbb3d08c043ceeab10eb3cdaf05c2dda49316751e3  tests/tools/art1a-bake.test.ts
ddf7456b709f1b0a3427ba08ef3a7fc7f3f88605ab3d49b39f5951abd7685382  tools/art-bake/palette.json
936a6264d412b843fc2181d01c2ef9dcf1ba6dcfadbf7c3eaaf316c3f53c1347  tools/art-bake/package.json

## Helpers & self-review (required)
- Helper 14289bde-a3ec-4c0e-b208-c378b876e481: reviewed Rule 8, the quoted exports, plant-anchor counts, the file caps, the diff file list, and the no-random / no-dependency fence → PASS, no change.
- Helper 297ad0af-04c8-4d17-b2ed-81efe148162b: compared lid, front, nails, margin, step clip, foot and colourise with b-r6 `crate_grid` / `_spr` and Ruling 6 → PASS, no change. It imported the frozen Python and left `__pycache__` under the kit; those directories were deleted before the commit and are not in the tree. The kit SHA256SUMS still passes.
- One-off command files: None. Anchor counts and the bake CLI were inline shell, not saved scripts.
- Self-review: Acceptance: green 1194 done; tools tsc only the 3 base errors done; shipped test and palette.json byte-identical and plants 24/24 done; bake prints the two pins and 64 is refused, kit checksums pass done; diff is the 9 files plus this handback done; 386 ≤ 393 and every file inside its cap done; Rule 8 one statement per line done; this hand-back has § Green, § Plants, § Port check, § Smoke and § Helpers & self-review done. QA checklist: G1 done, G2 done (root typecheck exit 0, no ts-ignore or any cast, tsconfig untouched), G3 done (check:state OK), G4 done (exports match the quoted interfaces), G5 done (do-not-touch paths absent), G6 done (only the Files list), G7 done (386, under 393 and under 400), G8 done (lint, deps, check:law), G9 done (decisions below), G10 done.

## Decisions & deviations (5–10 lines)
- `crate_grid` is split into `lidStep` and `frontStep`. The front's inner block is `if (!frame)` after the frame ternary, with the same comparisons in the same order as the Python `else`. The brace width is computed once per inner pixel, not once per diagonal; the number is the same.
- Lid brace uses `iy - ix * ((ht - 2 * b) / (w - 2 * b))`, division first, as the Python `ix * (ih / iw)`.
- Helpers inside the caps: `outlineRgb` and `ch` (sel-out mix), `chunk` (PNG chunk with crc32). No extra file.
- Nothing reads `ref/` at test time. The pins are literals in the shipped test.
- `palette.json` is parsed once at load. Nothing is kept between bakes. `bakeAll` returns the rows and does not retain them.
- `manifest.hash` is the sha256 of each sprite's RGBA bytes, in `RECIPES` order then tile order, updated into one hash. `style` is `"B r6b"`. JSON is one-space indent plus a trailing newline.
- With no out-dir argument the CLI writes `tools/art-bake/out`. With no tile arguments it uses `DEFAULT_TILES`, which is `[32]`.
- `sprite.ts` still has `?? [0, 0, 0]` when a ramp step is missing (outline and colourise). The guide carries that law-12 hardening to ART1b; the verbatim palette cannot hit it. Counted lines are 386, under the 400 gate, so no size exception.

## Next step (optional proposal)
- ART1b: the barrel recipe (pins already in the kit's ref-art1a.json) and the law-12 hardening of `ramp()`, `rgb()` and the empty-ramp fallback.
