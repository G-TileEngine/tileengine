# Hand-back step-ed-s0-flag-page r1
Step file: handoff/steps/step-ed-s0-flag-page.md (sha256 f00f59d032c0e0232c674646c5df1c05d3d461b5a8f9f48fde1c860ab18eb6a4)
Base commit: 71b1a9909343db2b5324275388abf1cb959f7d7d     Head commit: 62f82df02ab46cf3956a237b641918df93817561     Branch: step/step-ed-s0-flag-page-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	docs/qa/device-runs/TEMPLATE.md
A	tests/fixtures/ed-s0/ramps.json
A	tests/tools/ed-s0-qa.test.ts
A	tests/tools/ed-s0.test.ts
A	tools/device-page/bold-stubs.ts
A	tools/device-page/bold-swatch.ts
A	tools/device-page/bold.ts
M	tools/device-page/page.ts

## Green
npm test: 752/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`npm ci` exited 0 and did not change the lock. `npm run green` on the final tree exited 0. Summary from test-output.txt: tests 752, pass 752, fail 0, cancelled 0, skipped 0, todo 0. depcruise: 107 modules, 342 dependencies, no violations.

`node tools/pixel-suite/smoke.ts` printed `smoke: 0 failed`. `node tools/device-page/build.ts` then `node tools/device-page/check.ts` printed `check ok` (35 shipped files plus build.json, including `tools/device-page/bold.js`, `bold-stubs.js`, `bold-swatch.js`).

`npm run -s sim`:
```
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
```
`node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0.

## Shipped tests (sha256, unchanged)
a25b8928311946398fe76441e8906528ad2ef89db3785bd81d254739685b35ad  tests/tools/ed-s0.test.ts
c29c769ede157e9612d321e37d3358a826546786d257d05583dc64728ac4a538  tests/tools/ed-s0-qa.test.ts
700f5e13903d33bab8b618070d0eb82cf4efef4cb27734b40460cddac1ce959b  tests/fixtures/ed-s0/ramps.json
192c098e134aa9c07752fed6c275f476d40f999da1cfc736e140608957f45d8a  docs/qa/device-runs/TEMPLATE.md

## Helpers & self-review (required)
- Helper "Review ED-S0 rulings vs code": read bold.ts, bold-stubs.ts, bold-swatch.ts, page.ts and both shipped tests against rulings 1–9 and the QA pins. No must-fix on the boundaries the tests name. It did flag two real misses, both fixed before the commit: the DONE hash was opening a new scene link on every sample instead of one link per pass, and at exactly 120000 ms the pan wrapped to x=0 while the block was still ON 6/6. Residuals it left as design, kept and named below: path's 16 points are sampled into the first piece's `at` rather than a second mover; rhythm may set `at` to −30; the bake line is not itself a verdict input.
- Helper "Probe ED-S0 edge cases": ran a /tmp probe (no repo writes) over flags, blocks, pools, verdict, hash times, stubs, bake and readout. Probes pass. Legal surprises: seed `08` plays 8; `+7`, `-0` and `1e3` notice and play 0 without clearing scored; `off,off` stays a scored baseline; a gap of exactly 25 is not dropped and exactly 50 is not over-50; p95 uses `Math.floor(n*q)`; export JSON matches no token; react keeps the same effects array; bake is exactly 23.765625 MB and the off step releases it. `blockAt(NaN)` is OFF 1/6 after the non-finite clamp.
- Helper "Audit ED-S0 diff, caps and pins": PASS. Diff is the eight allowed paths only. Changed lines 396 (392 insertions, 4 deletions), under 400 and under the 420 cap. Each file is inside its cap (bold 66/90, stubs 117/130, swatch 14/20, page 24/40, qa test 32/37, TEMPLATE 14/14). The four shipped sha256s match. Pin prefixes `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696` match. page.ts pins and the two-rAF / one-clock / one-driver counts hold. The three bold modules have no timer, wall clock, `Math.random`, stat name or `src/fx`. index.html, build.ts and check.ts are untouched.
- Self-review: Acceptance — `npm ci && npm run green` 752/0/0/0, typecheck, lint, deps, check:state, check:law exit 0: done. smoke `smoke: 0 failed`: done. sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0: done. `git diff 71b1a990` on src, package.json, the lock, `.dependency-cruiser.cjs` and `scripts/check-law.sh` is empty; pins unchanged: done. device-page build then check prints `check ok`, 35 files plus build.json, the three bold.js files present: done. Shipped tests, ramps.json and TEMPLATE.md byte-identical to the step sha256s: done. 396 changed lines, every file under its cap: done. This hand-back is the branch's last commit: done. QA G1–G10: G1 752/0 and the shipped hashes, plants script not on this machine (`/workspace/scratch-ea` absent) but each plant's shipped assertion passed; G2 tsc 0, no new ignore or any; G3 check:state OK, no state edits; G4 quoted exports match (`parseFlags`, `blockAt`, `pool`, `createAB`, `canvasMb`, `verdict`, `hashPass`, `hashCheck`, `readout`, `stressDocs`, `applyStubs`, `createBake`, `SWATCH`, `panelRows`); G5 do-not-touch diff empty; G6 only the step's eight files plus this required hand-back; G7 396 lines, inside 150–400, footer 400 and ruling-11 cap 420; G8 check:law OK; G9 decisions below match the diff; G10 the acceptance lines above: done.

## Decisions & deviations (5–10 lines)
- Block index `i` is 0-based and the label is `i+1`. A negative or non-finite visit time is read as 0 (OFF 1/6, 20 s left). `leftS` is the ceiling of the milliseconds left in the block, and 0 at DONE. The percentile index is `Math.floor(n*q)`, the same read as the old HUD. A gap is dropped only when it is over 25 ms, and over-50 only when it is over 50. The delta, either p95, canvas and heap go red only when strictly over, so an exact budget and 160 stay green. The minus in `on−off` is U+2212. `hash` pending is not a fail, and `in-page 2nd pass` is printed only at DONE.
- A seed matching `^\d+$` and at most 2147483647 is `Number(seed)`, so `08` plays 8. Anything else (`+7`, `-0`, `1e3`, empty, over the max) adds the notice `playing seed 0` and plays 0; it does not clear `scored`. `scored` is false only for an unknown token, `off` mixed with another token, or more than one token. `off` and `off,off` are a scored all-off visit. Unknowns are deduped and quoted (`"lingr6" stays off`).
- Caster's stand-in is `KEYS[hash32(seed, id, c, r) % 4]` (fire, frost, holy, venom), keys only, because this step has no sprite colour to measure. Rhythm's nudge is `(hash % 3 − 1) * 30`, so `at` can be −30, and −30 % 30 is 0. Path builds 16 points with `Math.round((a+b+c)*8/3)/8` and writes the 30 ms sample into the first piece's `at`; it does not add a second mover. Fusion always pre-bakes `e0+e1`, because the stress targets do not share a cell and the test requires that id. Breed keeps six child docs and plays one as `e0` beside `e1`–`e3`, so four LiveFx stay live.
- Living uses one local `Int32Array(64)`, dropped when the call returns. The count is 0 when age is at most 0, otherwise `min(64, cells, floor(ageMs/1000)+1)`, so age 1e9 is 64. The tag map is a fresh one-byte `Uint8Array` per cell (0 grass, 1 water), not kept. React's suggestion is `fire+frost → steam` when any two units are within manhattan 6, else `none`; the effects array stays the same reference. Tiers builds 0, 1 and 2 each call; only tier 2 sets hit-stop 100, shake 2 and shake_ms 120.
- The export buffer is 624×624×4×16 = 24920064 bytes = 23.765625 MB, printed `toFixed(1)` as 23.8. The proto's 23.4 was the re-measure note; this is the real allocation. One `Uint8Array` is held, nulled on an OFF step (`mb` 0) with the peak kept, and only the last two bake hashes are stored. Export also fails the hash when those two are not equal. The bake line is not a second verdict input: heap red is `performance.memory` only, and that figure includes the buffer when the browser exposes it. At exactly 120 s the pan uses `visitMs − 1`, so the frozen frame stays at the end of block 6. No phone model is read. Run again and the cap button make a fresh pool and bake; lite does not. Changed lines are 396. No file outside the step list, and no new dependency. `handback/` is this hand-back, not a product change.

## Next step (optional proposal)
- Real bold slices (E1–E10) stay stubs. If the S21 tier-2 delta reads about 0, the tier-0 base is a ruling, not a change here. A ramp look on living overlays waits for E9. Forcing DPR 3 is still not a URL flag; the readout prints the phone's own DPR.
