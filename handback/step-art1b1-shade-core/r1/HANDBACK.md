# Hand-back step-art1b1-shade-core r1
Step file: docs/maker/steps/step-art1b1-shade-core.md (r1, sha256 7de4499115cfbd644003deae371eb173a492f9eccb038e15a6dec7bb9dc7a0c2)
Base commit: 5a371ec7a458d3b695a5bd032f83aa073054865e     Head commit: e35dbabb405ce82541617fc93dc804093c7587ce     Tree: 81beb09a2f126fae543d6713385f16e20988df8c     Branch: step/step-art1b1-shade-core-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	tests/tools/art1a-bake.test.ts
A	tests/tools/art1b1-shade-core.test.ts
M	tools/art-bake/bake.ts
A	tools/art-bake/blocks.ts
M	tools/art-bake/palette.json
M	tools/art-bake/palette.ts
A	tools/art-bake/recipes/lantern.ts
A	tools/art-bake/recipes/rock.ts
M	tools/art-bake/sprite.ts

## Green
npm test: 1209/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
Code head: e35dbabb405ce82541617fc93dc804093c7587ce
Code tree: 81beb09a2f126fae543d6713385f16e20988df8c
Tip: this hand-back commit. A commit cannot store its own sha; the hand-back message quotes the full tip sha. Check: `git rev-parse HEAD^` is the code head above.
`npm ci && npm run green` exited 0 (1209 pass, 0 fail; floor 1204 + 5 = 1209).
tools tsc (`npx tsc --noEmit -p tools/tsconfig.json`): only the 3 base errors, exit 2 from tsc itself:
- tools/effect-designer/page.ts(101,28) TS18047
- tools/maker/home.ts(156,221) TS7053
- tools/maker/home.ts(156,266) TS7053

## Plants
handoff/steps/tests/step-art1b1-shade-core/plants-art1b1.py on the code head: 38/38 caught. The tree was clean afterwards. The same 38/38 was printed on these bytes before the code commit.

## Port check
`node tools/art-bake/bake.ts /tmp/b 32 48` printed:
```
crate-32.png 19x27 foot 10,26 99ef690d60bf8dab906d85236e4a11001152a39445fd2cae787e03fab0fbcc88
crate-48.png 27x40 foot 14,39 97047142d2bc1409abb3bd50d5442c5f5c5b522d7bca9c727e9acafb4b8d5984
rock-32.png 29x21 foot 13,17 dbeb8b41fae682badc801abcb03f6e7552b2b66aa93926689f7657b2a9feb215
rock-48.png 43x31 foot 20,25 fa49fcaa67eb7fa7319f1fab4c3a9cbbc58f43cf0cdc5c5f69b5ccdd5f21f216
lantern-32.png 12x32 foot 6,30 bb33ae6028e31e9f0b18b4f6713ec8daf3d24881db37f624a61f740ff0ffa5a9
lantern-48.png 19x49 foot 9,45 643c5c02c77909f90338784457d730b462c414946075f8c367e7de10f27ae7f2
```
The shipped test pins the same rock and lantern hashes, including the big rock at seed 3.

## Smoke
Not run: no UI or export file changed (git diff names only tools/art-bake/** and two tests).

## Rule 8 scan
New control flow is one statement per line, with braced bodies. The only braceless `if` forms in the new code are `if (…) continue;` (ellipse, rect, and the outline neighbour that was already a continue) and `if (listed !== undefined) return rgb(listed);` in `outlineRgb`, which is the ART1a line kept as written. `roundEven`'s two half-cases each return on their own line. `ramp()`'s existing one-line throw was not rewritten. No chained headers. `canvasSprite` and `newCanvas` each return one object. The outline mix is one arrow expression. Nothing was joined onto a header to fit a cap.

## Size
`git diff --numstat 5a371ec7a458d3b695a5bd032f83aa073054865e -- . ':!handback/**' ':!package-lock.json'` is 338 additions, 19 deletions, 9 files, counted 357. The limit is 368. Each file is within its cap. The trial was 352; this base is the CoS base, not the guide's 8420f4f8.

| File | + | − | Counted | Cap |
|---|---|---|---|---|
| tests/tools/art1a-bake.test.ts | 4 | 4 | 8 | 8 |
| tests/tools/art1b1-shade-core.test.ts | 93 | 0 | 93 | 96 |
| tools/art-bake/bake.ts | 5 | 3 | 8 | 8 |
| tools/art-bake/blocks.ts | 57 | 0 | 57 | 58 |
| tools/art-bake/palette.json | 2 | 0 | 2 | 2 |
| tools/art-bake/palette.ts | 69 | 1 | 70 | 72 |
| tools/art-bake/recipes/lantern.ts | 14 | 0 | 14 | 16 |
| tools/art-bake/recipes/rock.ts | 17 | 0 | 17 | 20 |
| tools/art-bake/sprite.ts | 77 | 11 | 88 | 88 |
| Total | 338 | 19 | 357 | 368 |

## Shipped tests (sha256, unchanged)
0458c848bbf4177567819663f22107ea3b92788ebb5ff83673fbc2d667ad0a5f  tests/tools/art1b1-shade-core.test.ts
da5ff0aeace540b1a6df9c3211ca9f2a15cd2047ebd922e692aceaba067b4f6b  tools/art-bake/palette.json
Kit `sha256sum -c SHA256SUMS` in handoff/steps/tests/step-art1b1-shade-core passed. The kit was not edited.

## Helpers & self-review (required)
- Helper b51c1476-9538-43ad-bf5d-efa39df2c697: reviewed the uncommitted diff against the caps, the two sha256 pins, Rule 8, every plant old-string, the do-not-touch list, the error texts, and RECIPES order → OK. Static checks matched; it did not edit the tree.
- Kit script handoff/steps/tests/step-art1b1-shade-core/plants-art1b1.py: 38/38 caught, twice (before the code commit and on the code head). The tree was restored both times.
- One-off command files: none. The cap check and the green run were inline shell, not saved scripts. Their logs are /tmp/art1b1-test-output.txt, /tmp/art1b1-typecheck-output.txt, /tmp/art1b1-checks-output.txt, and /tmp/art1b1-tools-tsc.txt, copied into this folder where the hand-back asks for them.
- Self-review: Acceptance done. `npm ci && npm run green` 1209/0. Tools tsc only the 3 base errors. Shipped test and palette.json sha unchanged. Plants 38/38. Port check prints the six pinned lines. Smoke not run, as the guide says. Rule 8 scan clean (section above). Counted 357, each file on or under its cap, under the 368 limit. Diff names only the 9 Files-list paths plus this hand-back. QA checklist: G1 done (shipped sha, plants 38/38); G2 done (root typecheck exit 0; tools tsc still only the 3 base errors); G3 done (src untouched); G4 done (quoted signatures kept; new exports match the Interfaces block); G5 done (do-not-touch paths absent from the diff); G6 done (only the 9 Files-list paths plus this hand-back); G7 done (357, under 368, each cap held); G8 done (lint, deps, check:state, check:law exit 0); G9 done (decisions below); G10 done.

## Decisions & deviations (5–10 lines)
- No deviation from the quoted error texts or the plant anchors. The shipped test and palette.json are the kit files, byte for byte. The four art1a test lines are the guide's replacements and nothing else in that file changed.
- Base is 5a371ec7a458d3b695a5bd032f83aa073054865e (tree 89be4c1f317b22c61090137cc36b0166bd4ad5d2), not the guide's 8420f4f8. CoS said the move is docs and handoff only and the trial tree still applies. Counted lines are against this base (357).
- Private helpers, named here: `luma`, `ban`, `named`, `checkPalette`, `stepOf`, `at`, `rimAt`, `pixelRgb`, `fill`, `roundEven`. Fills walk every canvas pixel once per shape. `SCALE` is 1.3 for the rock and 1.25 for the lantern. `fbm` defaults `oct` to 4. Bias for a material with no palette entry is 0, written `PALETTE.bias[m] ?? 0` (Ruling 7). `rim` and the named biases come from palette.json. Nothing is kept between bakes; the palette is parsed and checked once at load.
- The shipped test's pins are literals. It does not read `ref/`.
- The lantern post shade is `(_x, _y, nx) => 0.7 - 0.5 * nx`. The fourth parameter is omitted because eslint's unused-args rule (`after-used`) rejects a trailing unused name, and the call still passes `ny`. The value is `0.7 - 0.5 * nx`, and the lantern pins match.
- Two blank lines between private helpers in sprite.ts were left out so that file stays on its cap of 88 (77+/11−). No statement was joined onto a header. sprite.ts is exactly 88; the other files are under their caps. Total 357, under 368.
- Smokes were not run. No new dependency. No `Math.random`, `Date`, or `performance` in tools/art-bake. `png.ts`, `crate.ts`, and the kit were not edited.

## Next step (optional proposal)
- ART1b2 (the barrel and the contact-shadow shapes) should branch from this step's merge.
