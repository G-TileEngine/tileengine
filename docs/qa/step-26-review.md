# Step 26 review (r1) — gh-pages cleanup + heap-flake fix

**Date:** 2026-11-13 00:08 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-26-pages-cleanup.md` `4c808ae5` (117 lines).
**README / spine:** `5a8f4f68` / `c9ae7079`.
**Part P:** one commit `fb7b183` (tree `40348064`) on `gh-pages` `536279b`, branch `s26-pages`.
**Part M:** one commit `34fe9aa` (tree `382da165`) on `main` `fef7aa8` (tree `19949b4d`), branch `s26-heap`.
Copied first to `/workspace/tileengine/qa-runs/s26-review/r1/` (pages, main, kit, scripts, EA logs). Imported as `refs/cmp/s26-pages-r1` and `refs/cmp/s26-heap-r1` (new; nothing existing was overwritten). `/tmp` was not edited (2320 recorded paths unchanged when compared the same way as the snapshot). Existing qa-runs trees were not overwritten. No GitHub actions. No code changes. Node 24.22.1 / npm 11.21.1.

**Publish flag:** merging Part P publishes the live site. It needs the CEO's SEND, not only a QA pass.

## Result

**Part P: OK TO SEND** on `fb7b183` / kit `4c808ae5`.
**Part M: OK TO SEND** on `34fe9aa` / kit `4c808ae5`.

No must-fix on either part. Security findings 3 and 4 are closed on the Part P tree. The deferred list in the step file is named (the other seven site files / 637 sinks, and `ui-shell` sync).

## Numbers

G7 **106** (P 82+13 = 95 in 5 files; M 7+4 = 11 in 1 file) in **6** files, cap sum **130**, each file exactly 4 under. No new deps. No `package.json` on `gh-pages`. Pins on Part M identical to `fef7aa8`, including package.json `1e5dd82c` (also core-types `61fad786`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09`). Part M touches only `tests/sim/speed-memory.test.ts`.

Greps **19/19** on both trees (P1–P11 and M1–M7). `tools/check-pages.mjs` → `pages check OK`. `node --test tools/pages.test.mjs` **3/3**. Official pages plants **7/7**. Step 25 B plants still hold on Part M: **14/14** and grep-plants **5/5** (including RC1, the recipe copied before it is counted).

Independent `npm run green` on Part M **521/0**; typecheck / lint / depcruise / check:state / check:law clean. `npm run sim` is byte-identical to `fef7aa8` / `18f7899`: `48/2` `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `22/28` `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`. All **20** pinned smoke ℹ lines are byte-identical to both of those baselines.

## Part P

`ConvertEngine.init` and `liftR66` (`new Function`) are gone from shipped JS. `initWith` remains at `js/convert-engine.js:743`. The live converter still calls it at `js/imagine-convert.js:432`. Headless Chrome at `/?noquiz#sprite-studio`: `ConvertEngine.init` is undefined, `initWith` is a function, `ImagineConvert._cap.sample("knight")` + `convert()` returns `converted=true`, `N=32`, `colours=16`, `look=crisp` (~136–146 ms). No `pageerror`. The only console issue is a pre-existing `favicon.ico` 404, not introduced here. Shipped JS has no `new Function` / `Function(` / `eval(`; every `setTimeout` / `setInterval` already passes a function, not a string.

The three finding-4 sinks are escaped and sit in **double-quoted attributes** (and `aria-label` text), not in an unquoted attribute or a URL/JS context: `js/app.js:1799` `data-dup-unit`, `:1991` `data-sel-unit`, `:4867` `data-loadout`, all `` `${escapeHtml(u.id)}` ``. The already-escaped id sinks (`:3816`, `:3823`, `:3937`) are the same shape. `escapeHtml` (`app.js:122-128`) encodes `& < > "` (amp first) and not `'`. That is safe in the current double-quoted sinks; see nits. `tools/pages.test.mjs` 3/3, and a unit id holding `<img src=x onerror=…>` renders as text (`data-sel-unit="&quot;&gt;&lt;img …"`).

`check-pages.mjs` caught planted `new Function`, `Function(`, `eval(`, a raw `${u.id}` in `app.js` markup, and a new unescaped `${name}` that would raise a file's hole count. A count going **up** vs `tools/pages-html-baseline.json` fails; a count staying flat or falling is allowed. Raising the baseline JSON can hide a new hole — that is the ratchet the kit already names, not a silent up-count. Evasions the regex misses (reported as carries; none appear in shipped code): `window['Function']`, `globalThis['Function']`, `globalThis.eval`, `window['eval']`, `(0, eval)`, `this.eval`, an aliased `Function`, `setTimeout(string)`, `setInterval(string)`, and `(()=>{}).constructor`.

Finding 3 and finding 4 probes from `qa-runs/security-2026-11-12/` were re-run against this tree: both doors are closed.

## Part M

`gc` is exposed without a `package.json` change: `setFlagsFromString("--expose-gc")` from `node:v8` and `const gc = runInNewContext("gc")` from `node:vm` (`tests/sim/speed-memory.test.ts:11`). If `gc` is not available, `runInNewContext("gc")` throws `ReferenceError: gc is not defined` at module load (`pass 0 / fail 1`). Loud fail, not a skip and not a silent pass.

The test now builds `{ ...SAMPLE, extra: Array.from({ length: 3000000 }, (_, i) => i) }`, calls `gc()`, and bars growth of `large_object_space` at 1 MiB. Honest run: **0.000 MiB**. A copy-before-measure plant of the official reader fails every time (`large-object growth 28094240`, ~26.8 MiB) and still fails under `--no-opt --max-semi-space-size=1` (`22026440`). **24** parallel runs of the official test: **0 flakes**. The same landed measurement under leftover-garbage noise: min 0.000 / max 0.000 MiB, over 1 MiB **0/40**, negative **0/40**.

EA's copied repro (`scripts/s26-heap-repro.mts`) is an older prototype than the landed test (flat 300k keys and a median of 5 `heapUsed` on 400k small objects, not large-object space). On `fef7aa8` the old path flakes (`min -196.5 max 9.9 MiB`, negative **2/40**, over 12: 0/40); Part M is the same, as expected (the reader did not change). EA's "new" path is a steady **17.8 MiB** and **40/40** over 12 MiB even on honest code — that is why the landed test changed payload and metric.

A leak made of many small objects in old space can miss the 1 MiB large-object bar. Copy-first of an over-cap bag of short strings stayed under the bar (e.g. 40,000 × 40 chars: 0.431 MiB large-object / 1.896 MiB `heapUsed`; 80,000 × 20 chars: 0.819 / 3.144) while the honest path stayed 0.000 MiB large-object. Named carry. The official 3e6-array / full-recipe-copy bug class is caught.

## Carries

- The other seven site files, **637** unescaped `${…}` markup holes, held flat by the baseline (not a full escape proof): imagine-convert 89, qol-r69 83, social-hub 90, sprite-studio 176, stage-live 51, ux-features 111, welcome 37. `app.js` fell 149 → 146.
- `ui-shell` sync (and the study-harness Node-only helper). A later publish from `ui-shell` would put `new Function` and the raw ids back unless `tools/check-pages.mjs` is run on the copied tree.
- `check-pages.mjs` misses the evasions listed above. None of them are in the shipped JS.
- Editing `tools/pages-html-baseline.json` upward can hide a new hole. The check itself will not let a count silently rise.
- Part M's 1 MiB large-object bar misses a many-small-objects / old-space leak (examples above). It still catches the copy-before-measure class the test is written for.

## Nits

- `js/app.js:122-128` — `escapeHtml` does not encode `'`. Safe in the current double-quoted attribute sinks; would not be, in a single-quoted attribute.
- `js/convert-engine.js:7` — header still says “or lifted from source in Node” after `liftR66` was deleted. Not a live door (`:184` correctly says “set by initWith()”).
- `docs/core-spine-slices.md:117` — the “Future” line still lists H4 as upcoming; `:9` and `:119` are current.
- `handoff/README.md:3` — the usual long status paragraph; the step-26 table row (`:57`) matches the step file.
- Part M's tip is the code commit, not a hand-back. The kit says the hand-back lives on the Part M branch; that is expected at this proto review.
- Headless `favicon.ico` 404 is pre-existing.

## Must-fixes

None.
