# Hand-back step-art1a-bake-core r2
Step file: docs/maker/steps/step-art1a-bake-core.md (r2, sha256 a3faaa3ce1bc18fddc834bcddce8b975678bd15d38b08f0b4e283d7ac429ff6f)
Base commit: 4912a973b031e924e4b9c8a48a8fce3b77e89316     Head commit: 5dcfc16315cf2fb2a61f39b822ce97e65b6250cd     Tree: 020645f362071d6c796d203ff52e193502d36a11     Branch: step/step-art1a-bake-core-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

Answers QA r1 (docs/qa/step-art1a-review.md, sha256 7ce02f98296ea97254c0eb4bb1c3da107eca748541255d2e31820bfc891bd4c3): one must-fix, R1, plus the out-dir nit. r1 commits ee6989cd and 9bd9b5ad are left as they are. This round adds one code commit on that tip.

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
Code head: 5dcfc16315cf2fb2a61f39b822ce97e65b6250cd
Code tree: 020645f362071d6c796d203ff52e193502d36a11 (EA's r2 trial tree)
Tip: this hand-back commit. A commit cannot store its own sha; the hand-back message quotes the full tip sha. Check: `git rev-parse HEAD^` is the code head above.
`npm ci && npm run green` exited 0 (1194 pass, 0 fail; floor 1194).
tools tsc (`npx tsc --noEmit -p tools/tsconfig.json`): only the 3 base errors, exit 2 from tsc itself:
- tools/effect-designer/page.ts(101,28) TS18047
- tools/maker/home.ts(93,221) TS7053
- tools/maker/home.ts(93,266) TS7053

## Plants
handoff/steps/tests/step-art1a-bake-core/plants-art1a.py: 24/24 caught. The tree was clean afterwards (no leftover edits).

## Port check
`node tools/art-bake/bake.ts /tmp/b 32 48` printed:
crate-32.png 19x27 foot 10,26 99ef690d60bf8dab906d85236e4a11001152a39445fd2cae787e03fab0fbcc88
crate-48.png 27x40 foot 14,39 97047142d2bc1409abb3bd50d5442c5f5c5b522d7bca9c727e9acafb4b8d5984
`node tools/art-bake/bake.ts /tmp/x 64` exited 1 with `art-bake: tile must be 32 or 48 ("64")` and wrote no folder.
Run from `/tmp` with no arguments, the default out dir is `tools/art-bake/out` next to the module (gitignored). That folder was removed after the check.

## Rule 8 scan
No other chained headers. A scan of every `.ts` line under `tools/art-bake/` finds no line with two `for` / `if` / `while` headers. The six r1 chains are now one header per line, each outer header braced. Innermost `for (…) oneStatement;` stays braceless.
- sprite.ts gridSprite: was L23 `for y for x {`. Now L23 `for (let y = 0; y < grid.h; y++) {`, L24 `for (let x = 0; x < grid.w; x++) {`, same six body lines, close L31 and L32.
- sprite.ts outlineOf: was L36 `for y for x {`. Now L38 `for (let y = 0; y < s.h; y++) {`, L39 `for (let x = 0; x < s.w; x++) {`, the neighbour loop keeps its braces, close L51 and L52.
- bake.ts bakeAll: was L27 `for name for tile {`. Now L27 `for (const name of Object.keys(RECIPES)) {`, L28 `for (const tile of tiles) {`, the same five body lines, close L34 and L35. RECIPES-then-tile order and the manifest hash are unchanged.
- crate.ts lid: was L41 `for y for x put`. Now L41 `for (let y = 0; y < ht; y++) {`, L42 `for (let x = 0; x < w; x++) put(...)`, close L43.
- crate.ts front: was L42 `for y for x put`. Now L44 `for (let y = ht; y < ht + hf; y++) {`, L45 `for (let x = 0; x < w; x++) put(...)`, close L46.
- crate.ts nails: was L43 `if (tile === 48) for (…) put`. Now L47 `if (tile === 48) {`, L48 the same braceless `for (…) put(...)`, close L49.
Left as they were: crate.ts L27–L28 `if (…) st = 3;` / `else if (…) st = 0;`; png.ts L19 `for (…) raw.set(…)`; bake.ts L47 (r1 L45) `for (const row of bakeAll(…)) console.log(…)`.

## Size
`git diff --numstat 4912a973 -- . ':!handback/**' ':!package-lock.json'` is 398 additions, 0 deletions.

| File | r2 lines | Cap |
|---|---|---|
| tools/art-bake/package.json | 7 | 7 |
| tools/art-bake/palette.json | 45 | 45 |
| tools/art-bake/palette.ts | 21 | 21 |
| tools/art-bake/sprite.ts | 79 | 80 |
| tools/art-bake/png.ts | 21 | 21 |
| tools/art-bake/recipes/crate.ts | 51 | 52 |
| tools/art-bake/bake.ts | 48 | 48 |
| .gitignore | 1 | 1 |
| tests/tools/art1a-bake.test.ts | 125 | 125 |
| Total | 398 | 400 |

## Smoke
Not run: no UI or export file changed (git diff vs the base names only tools/art-bake/**, .gitignore and the shipped test).

## Shipped tests (sha256, unchanged)
f3b1f47b5e891f0e6355d0cbb3d08c043ceeab10eb3cdaf05c2dda49316751e3  tests/tools/art1a-bake.test.ts
ddf7456b709f1b0a3427ba08ef3a7fc7f3f88605ab3d49b39f5951abd7685382  tools/art-bake/palette.json (verbatim palette, not a test)

## Helpers & self-review (required)
- Helper 1a91d56e-07b7-4ed4-91d4-605754555992: reviewed the r2 diff against ee6989cd (files, tree 020645f3, the six splits and their line numbers, the outDir line, plant anchors once each, numstat 398, and that nothing else changed) → PASS. It re-checked after plants-art1a.py had restored the tree.
- Scripts and one-off command files: None. Plants used the kit script. Bake, tsc and green were inline shell, not saved scripts.
- Self-review: Acceptance done. `npm ci && npm run green` 1194/0. Tools tsc only the 3 base errors. Plants 24/24, tree clean. Rule 8 scan clean (section above). Counted lines 398, each file at or under its r2 cap, at most 400. Bake 32/48 pins unchanged; tile 64 refused. Code tree matches EA's r2 trial 020645f3. QA checklist: G1 done (shipped test sha unchanged, plants caught); G2 done (root typecheck exit 0, no new ts-ignore or any); G3 done (check:state OK, src untouched); G4 done (exported signatures unchanged); G5 done (do-not-touch paths absent); G6 done (only the 9 Files-list paths plus this handback); G7 done (398 ≤ 400, per-file caps held); G8 done (lint, deps, check:state, check:law exit 0); G9 done (decisions below); G10 done.

## Decisions & deviations (5–10 lines)
- r2 changes only the six Rule 8 splits and bake.ts's default out dir. No other line was wrapped, split or joined.
- The default out dir, when argv has none, is `fileURLToPath(new URL("./out", import.meta.url))`, so it does not depend on the cwd. fileURLToPath was already imported.
- The inner `for (…) put(…);` and `for (…) console.log(…);` lines stay one statement with no braces, as Ruling 11 allows.
- Manifest `hash` is still sha256 of each sprite's RGBA bytes in RECIPES order then tile order. Defining that in the ART1b guide is a carry, not an r2 change.
- sprite.ts still has `?? [0, 0, 0]` at the empty-ramp outline base and at the out-of-range colourise step. Both stay on the ART1b law-12 carry. palette.json cannot hit them.
- Nothing is retained between bakes. palette.json is still parsed once at load. No new file, dependency or cache.
- Counted lines are 398 (r1 was 386). The extra 12 lines are the six outer headers and their closing braces. Under the 400 gate.

## Next step (optional proposal)
- ART1b: the barrel recipe, and the law-12 hardening of ramp(), rgb() and the two `?? [0, 0, 0]` fallbacks, with the manifest hash order written into that guide before ART2 reads it.
