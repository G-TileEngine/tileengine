# Hand-back step-04b-stage-place r2
Step file: docs/maker/steps/step-04-stage-editor.md (4b sections and the shared run rules). Rework of QA `docs/qa/step-04b-review.md` (main `4867f363`).
Base commit: d62f87bc521115cff588282a48ce086535743207     Code head: d27a0d247a85335bfeca4574360be4f676bc2265     Tree: 025b6caeb2984bed79bfb6dfc4382eff98080bb5     Branch: step/step-04b-stage-place-r2-chatA     PR: opened by Chief of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
From r1 tip `429ad97b976b2e248853d95825b347c550189b6c`. No product file changed.

## Changed files
M	handoff/steps/tests/s4b-stage-place/smoke.mjs
M	tests/editor/maker-law.test.ts
M	tests/editor/stage-place.test.ts

## Green
`npm ci && npm run green` exits 0. N = 3 (unchanged). Floor 1063.
npm test: 1063/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
```
# tests 1063
# pass 1063
# fail 0
# skipped 0
# todo 0
```
Line count at the code head, `git diff --shortstat d62f87bc521115cff588282a48ce086535743207..d27a0d247a85335bfeca4574360be4f676bc2265 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4b-stage-place/**' ':!handback/**'`: 8 files changed, 308 insertions(+), 34 deletions(-). 308 insertions + 34 deletions = 342.
The smoke script is 51 lines.

## Smoke
No file under `tools/play-stage/` changed, so S0 was not run. `handoff/steps/tests/s0-play-input/touch-smoke.mjs` is still sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser: Google Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome`. This sandbox has no `/usr/bin/google-chrome`.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` printed `SMOKE PASS` on 3 runs. Checks 1–8 were ok at 390 and at 360 each time. Run 3 ran while 8 `node -e 'for(;;){}'` loops were burning CPU (this box has 2 CPUs). It still printed `SMOKE PASS`.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` printed `SMOKE PASS`. Checks 1–8 were ok at 390 and at 360.

## Helpers & self-review
- No helper agent this round. The two must-fixes are local and were checked by running the tests and the smokes.
- Self-review: `tap()` no longer ends in `waitForTimeout(120)`, done. After each tap that saves, the smoke waits on the cell `aria-label` or the free-roam text, done. Talk-save's cell already said NPC, so that wait also requires the talk field to be gone, which is the redraw, done. The maker-law regex is `/["']?\bkind["']?\s*:/` and the plant list includes `export const d = { kind: "behaviour-setup" };`, done. The same regex is the source scan in `stage-place.test.ts`, done. Product code is untouched, done. Smoke is 51 lines, done. Line gate is 308 + 34 = 342, done.

## Decisions & deviations
- `press()` still waits 80 ms. QA's failure was `tap()`'s 120 ms, and the go-line said to change nothing else.
- Opening Add here and the water refusal are not saves. Those reads used to ride the same 120 ms pause, so they now wait on "Your team start" and "Water blocks units" too. Otherwise dropping the pause would make those two reads race.
- The widened regex also matches `docAt(files, kind: string)` at `tools/maker/stage.ts:31`. That `kind` is a folder-name parameter, not a document key. `src/editor/stage` still has no `kind`, and maker-law only applies this regex under a `/stage/` directory, so `lawHits` on `tools/maker` stays empty. The source scan pins that one line, text included. Any other hit, including `{ kind: "behaviour-setup" }`, fails the test. The parameter was not renamed, because this round forbids a product edit.
- The unquoted plant file is `unquoted.ts`. No new dependency. No cache was added.
