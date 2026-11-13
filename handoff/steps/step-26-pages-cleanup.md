# step-26-pages-cleanup: gh-pages cleanup (CEO order 2026-11-12 21:54, security check item c). The live site's converter loses its source-eval door (`ConvertEngine.init(source)` and its `new Function`, `js/convert-engine.js:46-49` and `:748`); the three session unit ids that `app.js` puts into `innerHTML` are escaped (`:1799`, `:1991`, `:4867`); a no-dependency pages check refuses `new Function`, `Function(` and `eval(` in the shipped JS, a raw id in `app.js` markup, and any new unescaped `${…}` in a markup template; a test proves a unit id holding `<img src=x onerror=…>` renders as text. On `main`, the load-sensitive step-25 recipe heap test is made load-proof without weakening it (QA FYI: one flake at 520/1).

Step id: step-26-pages-cleanup          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
**Two parts, two branches, two PRs.** The site is not on `main`. It is published from the repo's own **`gh-pages` branch** (its root is the site: `index.html`, `js/`, `css/`, `data/`, `assets/`, `mock-art/`, `mock-effects/`, `.nojekyll`; no `package.json`, no tests, no CI). `main` holds the engine only (`src/`, `tests/`, `handoff/`, `ux/` plans); no folder on `main` publishes the site. Until now every gh-pages change was a UX round (r62–r72): the UX designer builds in the local `ui-shell` folder and Chief Of Staff publishes it to `gh-pages` after the CEO's SEND (`ux/pixel-editor-plan.md`, `ux/r72-cleanup-plan.md`). No builder step has targeted `gh-pages` before; this is the first.
- **Part P (pages).** Base commit: `536279b` (`origin/gh-pages`, "UX r72: cleanup round", the live site QA scanned). Branch: `step/step-26-pages-cleanup-r<N>`, created from `536279b`. **The PR targets `gh-pages`, not `main`.** Merging it publishes the live site, so it needs the CEO's SEND like every UX round.
- **Part M (main).** Base commit: `fef7aa85fb771eba69a78755ba37977c9bc7d064` (the step 25 merge: PR #31, build B). Branch: `step/step-26-heap-test-r<N>`, created from `fef7aa8`. The PR targets `main`. Never commit to `main` or `gh-pages`.
The diff is always `<base>..<head>` per part.
Delivery (CN-003): two bundles: `git bundle create step-26-pages-cleanup-r<N>.bundle 536279b..step/step-26-pages-cleanup-r<N>` and `git bundle create step-26-heap-test-r<N>.bundle fef7aa8..step/step-26-heap-test-r<N>`; `git bundle verify` each; upload both plus a copy of HAND-BACK.md to the CEO's Drive. HAND-BACK.md's PR line: `PR: opened by Chief Of Staff from the bundles (pages → gh-pages, heap test → main)`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: **on the Part M branch only**: `handback/step-26-pages-cleanup/r<N>/` (HAND-BACK.md, covering both parts), committed as that branch's last commit. Put no hand-back folder on the Part P branch: everything on `gh-pages` is published.
Depends on: UX r67 (`ConvertEngine.initWith`, the live converter's path), UX r72 (the live site), step-25-speed-memory (the recipe heap test).
Read first: `docs/qa/security-check-2026-11-12.md` (findings 3 and 4); on `gh-pages`: `js/convert-engine.js` (`liftR66`, `API`), `js/imagine-convert.js:432` (`initWith`), `js/app.js` (`escapeHtml` at `:122`, the three sinks); on `main`: `tests/sim/speed-memory.test.ts` lines 76–81, `docs/qa/step-25-ab.md`.
Kit: kit-1, 2026-11-12. Engine Architect. Not engine code. Prototyped and run on Node 24.22.1: Part P branch `s26-pages`, head `59a7251` on `536279b` (`node tools/check-pages.mjs`: `pages check OK`; `node --test tools/pages.test.mjs`: pass 3, fail 0; the page loads headless with no console error); Part M branch `s26-heap`, head `34fe9aa` on `fef7aa8` (`npm ci && npm run green` exit 0: `tests 521 pass 521 fail 0`; sim and all 20 smoke lines unchanged).
Carries: no CN, no new number in the engine, no dependency anywhere (no `package.json` on `gh-pages`; jsdom is not a dependency, so the test is a pure escape test plus a source check). On `main`: `src/**`, core-types (`61fad786…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), lock (`d7f64a09…`) unchanged. No document format changes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
At the bases:
- `js/convert-engine.js` ships `liftR66(source)`, which slices another file's text and runs it with `new Function`, reachable as `ConvertEngine.init(source)`. Nothing on the site calls it: the live converter uses `ConvertEngine.initWith({...})` (`js/imagine-convert.js:432`). Only the UX study harness (`ui-shell/study/*.js`, local, never published) calls `init`.
- `js/app.js` writes `data-dup-unit="${u.id}"` (`:1799`), `data-sel-unit="${u.id}"` (`:1991`) and `data-loadout="${u.id}"` (`:4867`) into `innerHTML` unescaped. Today the ids are numbers from `state.nextId++`, so this is defence in depth; every other unit field there (`u.name`) is already escaped.
- Nothing checks the site: no grep gate, no test.
- On `main`, "the recipe size count copies nothing over the cap (step 25)" judges one `process.memoryUsage().heapUsed` delta against 12 MiB, with no gc. That delta counts uncollected garbage and drops when a GC lands mid-call. On the step-25 merge it read from −196.7 to +9.9 MiB (40 runs with leftover garbage, `/tmp/s26-heap-repro.mts`), and with the recipe count planted out it went over 12 MiB in only 26 of 40 runs, so the test is both flaky and blind about a third of the time.

Rulings in this step (Engine Architect, 2026-11-12):
- **Drop `init`, keep `initWith`.** Delete `liftR66` and `API.init` from `js/convert-engine.js`; fix the one comment that names `init()`. No replacement on the site (no caller). `initWith` is unchanged. The study harness moving to a Node-only helper is the UX designer's, outside this repo (see "Not in this step").
- **Escape with the helper that is already there.** The three sinks become `${escapeHtml(u.id)}` (`app.js`'s own `escapeHtml`, `:122`). The delegated handlers read the same string from `dataset`, so no behaviour changes. No new helper, no DOM rewrite.
- **Sink inventory (findings 3 and 4, checked on `536279b`).** The pages check's template scanner finds 786 `${…}` holes in markup templates that are not wrapped in an escape call (`esc`, `escapeHtml`, `TileEngineSafe.escapeHtml`), across eight files: `app.js` 149 (146 after this step), `imagine-convert.js` 89, `qol-r69.js` 83, `social-hub.js` 90, `sprite-studio.js` 176, `stage-live.js` 51, `ux-features.js` 111, `welcome.js` 37. User-controlled strings: in `app.js`, every one is escaped except the three unit ids; the remaining `app.js` holes are numbers (`u.hp`, `u.x`, counts), booleans or literal ternaries (`on ? "On" : …`), and partials already built with `escapeHtml` (`tag`, `was`, `note`, `reasonHtml`, `sourceChip`), spot-checked. The 50 `.id` / `.name` holes outside `app.js` (e.g. `qol-r69.js:217`, `imagine-convert.js:728`, `sprite-studio.js:580`) read constant catalogues (`GOALS`, `ROLES`, `RUN_LAYERS`, `SAMPLES`, presets). A full proof for the other seven files is not greppable in this step; the ratchet below stops it growing.
- **The pages check (`tools/check-pages.mjs`, plain Node, no dependency).** Run by `node tools/check-pages.mjs` (exit 0 and `pages check OK`, or one `FAIL …` line per finding and exit 1). It fails on: (1) `new Function`, a bare `Function(` or a bare `eval(` anywhere in `js/*.js` or `index.html`; (2) any unescaped hole in an `app.js` markup template whose expression ends in `.id` or `Id`; (3) any file whose unescaped-hole count is above its number in `tools/pages-html-baseline.json` (a ratchet: counts may fall, never rise). A "markup template" is a template literal whose own text contains `<` followed by a letter, `!` or `/`; the scanner skips comments, strings and regex literals, and follows nested templates. Nothing wires it in automatically (`gh-pages` has no `package.json` or CI): Chief Of Staff and QA run `node tools/check-pages.mjs && node --test tools/pages.test.mjs` before each publish, and HAND-BACK.md says so.
- **`tools/` is published with the site.** It is inert (not linked from `index.html`, no secrets). Putting it on `main` instead would need a `package.json` script, which is pinned.
- **The heap test counts the large-object heap after a gc.** In `tests/sim/speed-memory.test.ts`: turn on gc inside the test (`setFlagsFromString("--expose-gc")` from `node:v8`, then `runInNewContext("gc")` from `node:vm`; `package.json` stays pinned, so no node flag); the fat input becomes `{ ...SAMPLE, extra: Array.from({ length: 3000000 }, (_, i) => i) }`; call `gc()`, then read the summed `space_used_size` of the heap spaces whose name ends in `large_object_space` (`getHeapSpaceStatistics()`), before and after the read; the bar is **under 1 MiB** (was 12 MiB of total heap). The refusal assert (`over cap bytes`) and the `bigint` assert stay; the title stays exactly. Why it is load-proof and stronger: the measure walk builds nothing big, and its short-lived scan garbage (iterator results) stays in the young space, so the correct code reads exactly 0.00 MiB in 200 runs with leftover garbage, under `--no-opt` and under `--max-semi-space-size` 1 and 64; a copy-first read must grow a list backing store past 4 MiB, which lands in the large-object space, and reads 16.6–29.5 MiB in every run.
- **Part M fits this step, not a micro-step of its own:** it is 11 lines in one test file with no source change, but it cannot share a branch or a PR with Part P, so it is a second branch and bundle under one kit and one hand-back.

## Files to create or change
Part P (on `gh-pages`):
- change `js/convert-engine.js`: delete `liftR66` and `API.init`, fix the `init()` comment and the header comment's "or lifted from source in Node" (≤ 17)
- change `js/app.js`: the three unit-id sinks, and `escapeHtml` also encodes `'` as `&#39;` (QA r1 nit; safe today only because the sinks are double-quoted) (≤ 10)
- create `tools/check-pages.mjs` (≤ 52), `tools/pages-html-baseline.json` (≤ 6), `tools/pages.test.mjs` (≤ 30)
Part M (on `main`):
- change `tests/sim/speed-memory.test.ts`: the recipe heap test and two imports (≤ 15)

Size: ≤ 150 changed lines over both parts, counting insertions + deletions (handback excluded). The per-file caps add up to 130. The prototypes have 106: Part P 95 lines in 5 files (82+/13−), Part M 11 lines in 1 file (7+/4−), each file 4 under its cap. If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
```js
// js/convert-engine.js: API keeps every member except init
API.init === undefined; typeof API.initWith === "function";   // initWith(R) unchanged
// tools/check-pages.mjs (ES module, Node built-ins only)
export function htmlHoles(src: string): { at: number, text: string }[];   // unescaped ${…} in markup templates, text trimmed
export function checkPages(dir?: string): { fails: string[], counts: Record<string, number> };   // dir defaults to the site root; reads tools/pages-html-baseline.json
// tools/pages-html-baseline.json, at the head of Part P
{ "js/app.js": 146, "js/imagine-convert.js": 89, "js/qol-r69.js": 83, "js/social-hub.js": 90, "js/sprite-studio.js": 176, "js/stage-live.js": 51, "js/ux-features.js": 111, "js/welcome.js": 37 }
```
If your scanner counts differently, write your own counts into the baseline and list them, with the `app.js` count before and after, in HAND-BACK.md (law 12).

## Smoke lines
Part M: none move. `npm run sim` and all 20 smoke lines are byte-identical to `fef7aa8`. Part P has no smoke lines; the page must load with no new console error.

## Existing tests changed by ruling (and only these)
- `tests/sim/speed-memory.test.ts` "the recipe size count copies nothing over the cap (step 25)": the measurement as ruled above (gc first, the large-object heap, a 3,000,000-entry list, under 1 MiB). Same title, same refusal and `bigint` checks.

## Tests that prove it is done
New `tools/pages.test.mjs` (run `node --test tools/pages.test.mjs`), three tests whose titles start exactly so:
- **"a unit id with markup renders as text (step 26)":** takes `escapeHtml` from `app.js`'s own source (slice `function escapeHtml(s)` up to `function humanize(` and run it with `node:vm`; no DOM, no copy of the helper); for each of `<img src=x onerror=alert(1)>`, `"><img src=x onerror=alert(1)>` and `7`, and each of `data-dup-unit`, `data-sel-unit`, `data-loadout`: `app.js` contains `<attr>="${escapeHtml(u.id)}"`, the rendered `<button … <attr>="…">` holds no `<img`, and the attribute value unescapes back to the id.
- **"the converter has no source-eval door (step 26)":** `require("../js/convert-engine.js")` has no `init` and has an `initWith` function; the file holds no `new Function` or `eval(`.
- **"the pages check passes and catches each door (step 26)":** `checkPages().fails` is empty; `htmlHoles` finds `u.id` in `` `<b data-x="${u.id}">${esc(n)}</b>` `` and nothing in a plain template or a regex literal holding a backtick.

## How a planted bug is caught (for QA; prototypes `59a7251` and `34fe9aa`; reverted after each; `/tmp/s26-pages-plants.sh` on the Architect's box)
| Plant (intent) | Named test |
|---|---|
| Q1 `init(source)` and its `new Function` come back | the converter has no source-eval door; the pages check passes and catches each door |
| Q2 the select row puts the raw unit id in HTML; Q3 the loadout card does | a unit id with markup renders as text; the pages check passes and catches each door |
| Q4 an `eval(` in another shipped file; Q5 a `Function(` call in `index.html`; Q6 a new raw `${…}` in a markup template | the pages check passes and catches each door |
| Q7 `escapeHtml` stops escaping quotes | a unit id with markup renders as text |
| HP1 the recipe is copied before it is counted (the step-25 RC1 plant, on Part M; also under `--no-opt` and `--max-semi-space-size=1`) | the recipe size count copies nothing over the cap |

All 8 plants fail their named tests (8/8). **Greps** (`/tmp/s26-greps.sh <pages-clone> <main-clone>`): 19 checks, ALL OK on the prototypes: files and size per part, per-file caps, no `new Function` / `Function(` / `eval(` in `js` or `index.html`, no `liftR66` / `init(r66src`, `initWith` kept on both ends, the three escaped sinks, no raw `="${….id}"` in `app.js`, the check and the tests pass, the test is clean, the heap test uses gc and the large-object heap and no `heapUsed`, the 1 MiB bar, the step-25 title, the pins.

## Example
```js
ConvertEngine.init;                                         // undefined: no source text is ever run as code
ConvertEngine.initWith({ detectBackground, keyBackground, subjectBox, placement, pinkInside, toHsl }); // the live path, unchanged
`data-sel-unit="${escapeHtml('"><img src=x onerror=alert(1)>')}"`  // data-sel-unit="&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"
// $ node tools/check-pages.mjs  →  pages check OK
```

## Decisions note: what to name
- That the PR for Part P targets `gh-pages` (the published site) and Part M targets `main`, and that the hand-back lives only on the Part M branch.
- That `init` is dropped with no replacement on the site (no caller), and the study harness needs its own Node-only helper (UX).
- That the unit ids use `app.js`'s existing `escapeHtml`.
- That no dependency was added (jsdom is not one; the test is a pure escape test plus source checks), and that `tools/` is published with the site.
- The baseline counts, and that the raw-hole rule is a ratchet, not a full proof, outside the `app.js` id rule.
- Why the heap test reads the large-object heap after a gc, and that the bar went from 12 MiB of total heap to 1 MiB of large-object heap (stronger, not weaker).
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- Part P: every file on `gh-pages` except the two `js` files and the three new `tools/` files above; in `js/app.js` every line but the three sinks; in `js/convert-engine.js` everything but `liftR66`, `API.init` and the one comment.
- Part M: everything on `main` except `tests/sim/speed-memory.test.ts` (and in it only the recipe heap test and its imports); `src/**`, `docs/**`, `handoff/**`, `scripts/**`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs`, `BUILD_GUIDE.md`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**` (including `ui-shell/`), `/workspace/towerchess*`.

## Acceptance
- [ ] Part P, from a clean checkout of its head: `node tools/check-pages.mjs` prints `pages check OK`; `node --test tools/pages.test.mjs`: pass 3, fail 0. `git diff --name-status 536279b..<head>` lists exactly the 5 files (`A` for the three `tools/` files, `M` for the two `js` files). `rg -n 'new\s+Function|(^|[^\w$.])eval\s*\(|(^|[^\w$.])Function\s*\(' js index.html` prints nothing.
- [ ] Part P behaviour (QA, served locally): the page loads with no new console error; Imagine → convert still converts a sample (it goes through `initWith`); Behaviour → copy onto, the unit select list and the loadout cards still select the right unit.
- [ ] Part M: `npm ci && npm run green` exits 0 from a clean checkout of its head. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 521. `npm run sim` prints exactly the base's two lines; all 20 smoke lines are byte-identical to `fef7aa8`. Pins unchanged (`61fad786…`, `1e5dd82c…`, `45a3dbaa…`, `4d7bbf48…`, `d7f64a09…`). `git diff --name-status fef7aa8..<head> -- . ':!handback'` lists only `M tests/sim/speed-memory.test.ts`.
- [ ] Part M under load: 12 parallel runs of `node --test tests/sim/speed-memory.test.ts`, three times, all pass; with the recipe count removed from `src/paint/recipe/read.ts` (revert after), the heap test fails every run.
- [ ] Both parts ≤ 150 changed lines in total, each file within its cap. Both bundles verify; Part M's tip is the hand-back commit; nothing is committed to `main` or `gh-pages`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target
- **UX designer (outside the repo, before the next UX publish):** copy the merged `js/convert-engine.js`, `js/app.js` and `tools/` into `ui-shell`, or start the next round from `gh-pages`; otherwise a publish from `ui-shell` puts `new Function` and the raw ids back (the pages check catches it if run). Move `ui-shell/study/*.js` (`CS.init(...)`) to a Node-only `study/lift-r66.js` that is never published.
- **A later pages pass:** a full escape proof for the other seven files (the 637 holes outside `app.js`), lowering the baseline to what is truly dynamic; QA's security-check findings 1–2 belong to the engine (step 25) and are done.
- **The renderer and frame player (CEO order 20:03):** next. The clock pile-up row goes with it (step 25 carry).
- **Next hardening pass:** QA step-25 nits 1 and 3 (unify the over-ceiling limits refusal; a named pre-replay refusal for a consistently forged 1e9 tick and `clockMs`), as carried by step 25.

- **Later pages pass (QA r1 carry 1):** `check-pages` does not catch eval evasions (`window['Function']`, `globalThis.eval`, `setTimeout(string)`, `(()=>{}).constructor`, `(0,eval)`); none is in shipped JS today.
- **Process (QA r1 carry 2):** raising `tools/pages-html-baseline.json` can hide a new hole; any baseline bump needs a review note from QA in the PR.
- **Next hardening pass (QA r1 carry 3):** the heap test measures only the large-object heap, so a leak of many small old-space objects (80k short strings read 0.819 MiB) can pass under the 1 MiB bar; add an old-space companion check.

## Out of scope
- Any engine source change; any rule, stat or cap; any UX change on the site beyond the lines above (layout, copy, features); CSP headers or a `meta` CSP (needs a CEO ruling about inline handlers); minifying or moving files; adding a `package.json`, CI or a dependency to `gh-pages`.
