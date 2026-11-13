# Step 27 review (r1): pure render core

**Date:** 2026-11-13 01:02 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-27-render-core.md` `c640029c`. **README / spine:** `81e3e30b` / `a6686ff3`. **Research:** `docs/research/renderer-research.md` `d718e0ab` (unchanged). QA research `renderer-test-research.md` `d1b26424`.
**Proto:** `/tmp/r27` branch `r1`, head `6d9799f` (tree `b2d92f7b`), parent `2da0d02` (= `origin/main`). Exactly one commit.
**Bundle:** `r27.bundle` sha256 `fb550b152550db76…9c7d02` (matches the claim), `git bundle verify` OK, one head `refs/heads/r1` = `6d9799f`, requires `2da0d02`.
Copied first to `/workspace/qa-runs/step-27-review/` (proto, bundle, plants script); all work on copies. Imported as **`refs/cmp/s27-proto-r1`** (new; nothing existing was overwritten). `/tmp/r27` untouched (clean, head unchanged). No GitHub or Drive actions. Node 24.22.1.

## Result

**NOT OK** on `6d9799f` / kit `c640029c`. **Test-only fixes. The `src/` code is correct as written; I found no code bug.**

The 22 official plants are all caught. But 13 of my 31 graded extra plants (35 in all; 4 were probes with no expected test) slip every gate in `npm run green`. Two of them are trivial ways round the import fence. That fence is the only gate on render → outside imports, because there's no depcruise rule (EA's question d). The others are L1 items tested on only one axis. All four fixes fit in **one file** (`render-core.test.ts`, +10/−9, 131 lines, still under its 134 cap). A ready patch, proven against every plant, is at `qa-runs/step-27-review/qa-test-hardening.patch`.

## Numbers

- **Merge:** `git merge-tree --write-tree origin/main refs/cmp/s27-proto-r1` is clean, tree **`b2d92f7b99040212de8999802d363a247eee55c6`** (= head tree, because base = main).
- **Diff:** 9 files, all `A`, **370+/0−** against the 390 cap sum (and the 400 limit). Per file (actual/cap): types 31/33, fit 26/28, camera 27/29, frames 42/44, draw-list 61/64, dirty 15/17, index 6/7, fake-renderer 32/34, test 130/134. Nothing outside the claim is touched.
- **Green:** `npm run green` exits 0, **529/0** (521 + 8 titled `(step 27)`, all present verbatim). 0 skipped, 0 todo. tsc, eslint, depcruise (89 modules, 271 deps), check:state and check:law are clean.
- **Serial and repeat runs:** `--test-concurrency=1` gives 529/0. Three full runs gave identical results.
- **Sim:** byte-identical to `2da0d02`: 48/2 `afc89d56…`, 22/28 `b8007292…`.
- **Smokes:** all **20** smoke ℹ lines byte-identical to the base (the heap line is excluded as variable).
- **Pins:** core-types `61fad786`, package.json `1e5dd82c`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09`. All unchanged.
- **Plants:** official **22/22** caught by their named tests. QA extras: 35 plants, of which 4 are probes with no test expected (X7c, X8, U19, U21). On the other 31, **18/31** are caught by some gate before the fix and 13 slip all of green. **After the patch it's 30/31** (also catching probe X7c). The one left is X6d (`dx` as a key before `c`), a doc-level carry. The official 22 are still 22/22 and green is still 529/0.
- **hash32:** pinned `hash32(7,"tree",3,4) = 1909584459`, re-derived with an independent Python FNV-1a.

## Build law

- **No wall time or timers:** no rAF, `performance`, `Date`, timers or DOM in `src/runtime/render`. `rg -w phase` and `rg 'from "\.\./'` in that folder print nothing.
- **Pure inputs:** the core imports only its own siblings and reads plain `RenderScene` data. It doesn't import or touch core, state, UNIT or TILE pipes, so it opens no new pipe.
- **No copied trees:** check-law `no-btf-path` passes.
- **Entry and pack:** `src/index.ts` is unchanged, so render isn't yet exported from the engine root (per the step). There's no bundler entry and no package change.
- **Fake renderer unreachable:** it lives only in `tests/`. A `src → tests` import is caught by depcruise `no-tests-in-src` and by the fence test (probe U20).
- **Scope:** everything in the diff is named in the step file (fit, scaleRange/snapScale, camera clamp/ease/snap, frames, hash, draw list, dirty, the adapter type). `fillRect` is declared but unused; it's ARCH §12.4's interface.

## EA's four questions

**(a) Y-sort tiebreak.** The key is `(footY, c, kind, z, input index)` at `src/runtime/render/draw-list.ts:46`. It matches the step file and research §6.5 exactly.
- **Deterministic:** yes. The comparator is total because the last key is a unique index, so it never relies on `Array.sort` stability. It sorts a copy and leaves the scene untouched.
- **It doesn't end in an id:** it ends in input order, which the research calls `docOrder`. `Standing` has no id field. So the order is deterministic **only if the scene builder hands in `standing` in a stable order**. That's a carry to step 30 (units by unit id, objects by document index), not a fix here.
- **Gap:** the kind-before-z order was untested. Swapping it (X6) passed every test. That's Fix 3.

**(b) `offsetMs` naming and hash.**
- **Code and step file:** consistent. `offsetMs` is used in `frameAt`, `pick` and the `TileLayer` doc, alongside `instanceOffset` and `hash32`. Nothing is named `phase`, and check:state is clean.
- **Hash:** deterministic. It's FNV-1a over seed, c, r (4 LE bytes each) plus UTF-16 code units (low, high). There's no float or locale input, and negative ints are handled by `>>>`. The offset is `hash % loopMs`, an integer in `[0, loop)`. The pinned value was checked independently.
- **Drift:** `renderer-research.md` still says "phase" in places: §11 row 27 "phase hash" (:233), row 32 "phase override" (:238), EUX Q5 (:257) and the CN list (:265). Those are nits for EA. My own QA doc's "camera phase" is a different, unrelated meaning.

**(c) Culling before frame selection.** Confirmed at `draw-list.ts:29-30`. `push` checks the bounds first and only then calls the lazy `frameOf()`, which is the only path to `frameAt` and `dueMs`. Tiles also iterate only over the visible cell range. Overlays use the same lazy path.
- **Cull bounds:** conservative. I proved it against `toDevice`: `viewX0 = floor(devX/s)` and `viewX1 = viewX0 + artW + 1` never wrongly cull a visible draw.
- **Not quite zero cost:** culled standing things still pay `anchorPx` plus `instanceOffset` (`clipMs` array + FNV) before the cull, at `draw-list.ts:48-49` (nit 1).
- **Test gaps:**
  - Only the standing path is tested (D4). Picking an overlay's frame before the cull (X7) passed all tests.
  - Nothing checks that the view is fully covered. A cull one tile too tight (X7c) left an unpainted strip at the right edge and passed all tests, because `runs().slice(1,-1)` drops the edge run.
  - Both are Fix 4.

**(d) Is the import fence enough without a CN?** **Not as written.** It is the only gate on render → outside imports: depcruise has no rule for `src/runtime/**` other than `input`, and check-law has none for render. Probe results:

| Probe | Fence test | Other gates | Result |
|---|---|---|---|
| U2 static `import "../../core/plain.ts"` | caught | none | ok |
| U6 `import type … from "../../core/…"` | caught | none | ok |
| U7 `export * from "../../core/…"` via index.ts | caught | none | ok |
| U8 multi-line `from\n"…"` | caught | none | ok |
| U9 `"./../../core/…"` | caught | none | ok |
| U10 subfolder `render/sub/x.ts` | caught (EISDIR crash, unclear message, nit) | none | ok |
| U5 `import x = require(…)` | file fails to load | tsc and eslint (erasableSyntaxOnly) | ok |
| U20 src → `tests/…/fake-renderer.ts` | caught | depcruise `no-tests-in-src` | ok |
| U19 core → render | n/a | depcruise and eslint | ok |
| Path alias / `#imports` / self-name | n/a: no `paths`, `imports` or `exports` exist, and adding one changes pinned tsconfig/package.json | | ok |
| **U3** `export const sep = "//"; import "../../core/plain.ts";` on one line | **missed**: the comment stripper `\/\/.*$` eats the rest of the line, string included | none | **slips everything** |
| **U4** `` import(`../../core/plain.ts`) `` (template literal) | **missed**: the regex only knows `"` and `'` | none | **slips everything** |
| U11 `self` / `window` / `document` | missed | tsc (lib ES2022 has no DOM) | ok, but only by luck |
| **U12** `process.hrtime.bigint()` | missed | none | **slips** |
| **U13** `setImmediate(f)` | missed | none (also missing from check-law/eslint repo-wide) | **slips** |
| **U14** `process.getBuiltinModule("node:perf_hooks")` | missed | none | **slips** |
| **U15** `new Intl.DateTimeFormat().format()` | missed | none | **slips** |
| **U16** `(0, eval)("this")` | missed | none | **slips** |

With the Fix 1 patch all of these are caught. What's left: deliberately obfuscated code (a string-built `constructor` call, for example) can't be stopped by any grep test. So the depcruise `render-imports-only-own-folder` carry should still land at the next pin CN. A `sim → render` import is currently allowed by depcruise (U21); decide whether that rule should also say who may import render.

## L1 items: tested or just present?

| L1 item | Status |
|---|---|
| DPR 1/2/2.625/2.75/3 device-px store, art px exactly `s` wide | **Tested** (F1, F2). Interior runs on one row, x only. Edges and coverage are not checked (Fix 4). |
| Odd letterbox pixel right/bottom | **x tested** (F3, X5b). **y untested:** `padY` ceil (X5) passes (Fix 2). |
| Camera snap | **x tested** (C1, C2). **y untested:** `devY: y * s` (X4) passes (Fix 2). |
| Frames from clockMs | Tested (A1, A2). The fence covers the time sources only after Fix 1. |
| In-phase tiles plus hash offsets | Tested (A3, A4, A5). |
| Band order | Tested (Y4, X9 "above before standing"). |
| Y-sort ties | Partly tested (Y1, Y2, Y3, X6b, X6c). **Kind vs z (X6) untested** (Fix 3). |
| Dirty cases | Tested (D1–D4, X2 off-by-one, X3 idle draws, X10 clock back, X7b cull off). `rev` going back (X1) is untested (nit 2; included in the patch). |
| Purity fence | **Partial** (see (d); Fix 1). |
| Smoothing after resize | Not modeled here (step 28 carry). |

## Fixes (all in `tests/runtime/render/render-core.test.ts`; patch: `qa-runs/step-27-review/qa-test-hardening.patch`)

1. **Import and purity fence evasions (U3, U4, U12–U16)**, `render-core.test.ts:126-128`.
   - *Repro:* in a copy, add `export const sep = "//"; import "../../core/plain.ts";` after line 1 of `src/runtime/render/camera.ts` (or `` export const lazy = () => import(`../../core/plain.ts`); ``). Then run `npm run green`: it exits 0.
   - *Fix:*
     - Strip comments string-aware: `.replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm, "$1")`.
     - Accept backtick specifiers in the import regex.
     - Forbid `\bimport\s*\(` outright, since a pure core needs no lazy load.
     - Add `setImmediate|process|eval|Function|Intl|Temporal|global|self|require` to the forbidden names.
2. **Y axis untested for letterbox and camera snap (X5, X4)**, `render-core.test.ts:25`, `:39`, `:45`.
   - *Repro:* in `fit.ts:13` change `padY: Math.floor(` to `Math.ceil(`. Or in `camera.ts:14` change `devY: px(y * s)` to `devY: y * s`. Then run `node --test tests/runtime/render/render-core.test.ts`: 8/8 pass.
   - *Fix:*
     - In the DPR loop, assert that bottom pad − top pad is 0 or 1.
     - Add `fitView(9, 1171, 3, 1, 1).padY` → 0 and `fitView(9, 1172, 3, 1, 1).padY` → 1.
     - Add `snapCamera(0.5, 0.5, 1).devY` → 1.
3. **Kind-before-z order untested (X6)**, `render-core.test.ts:96`.
   - *Repro:* in `draw-list.ts:46`, swap `KIND[…] - KIND[…]` and `(a.s.z ?? 0) - (b.s.z ?? 0)`. 8/8 pass.
   - *Fix:* give the unit on the object's tile `z: -1`, i.e. `unit(2, 3, { frame: 1, z: -1 })`. The expected order stays the same and the swap is now caught.
4. **Culling before frame selection only tested for standing; view coverage untested (X7, X7c)**, `render-core.test.ts:113` and after `:28`.
   - *Repro:*
     - X7: in `draw-list.ts:58`, replace the lazy overlay pick with `const fr = pick(o.clip, o.frame, tMs - start, 0); push(o.band, o.sheet, () => fr, …)`.
     - X7c: in `draw-list.ts:20`, use `viewX1 = viewX0 + fit.artW - 16`.
     - Either way, 8/8 pass.
   - *Fix:*
     - Add an off-screen animated overlay (`{ band: "fxAir", sheet: tree, x: 470, y: 470, clip: water }`) to the `dueMs === Infinity` scene.
     - In the DPR test, assert that the checked row has no unpainted pixel between `padX` and `min(padX + artW·s, 480·s − devX + padX)`.

**Checked:** with the patch applied, all 22 official plants and 12 of the 13 extras that slipped before (all but X6d), plus probe X7c, are caught, and green is 529/0. The file is 131/134 lines. The step total becomes 371+/0− if the builder writes it fresh. The step file's test descriptions (`:117`, `:118`, `:119`, `:122`, `:123`, `:124`) and the plant table (`:127-140`) need the matching lines from EA.

## Nits (not blocking)

1. `draw-list.ts:48-49`: `anchorPx` and `instanceOffset` run for every standing thing before the cull. Move them into the `frameOf` closure (and the push) so culled things cost nothing.
2. `render-core.test.ts:116`: `rev` going back (X1: `!==` → `>`) is untested. Add `{ rev: 0 }` (in the patch).
3. `frames.ts:13`: `clipMs` allocates an array on every `frameAt` call, i.e. per visible animated cell per build. Cache it per clip when budgets land (step 34).
4. `draw-list.ts:57-58`: `startMs` is untested (X8 "startMs ignored" passes). Also, an overlay before its start with a looping clip plays as if it had already started, because a negative time wraps in `frames.ts:19`. Define it as either not drawn or frame 0.
5. `render-core.test.ts:125`: a subfolder under `render/` fails with an `EISDIR` crash rather than a named assertion.
6. Step file `:48` says "each file 2–4 under its cap", but `index.ts` is 6/7 (1 under).
7. Research §11 row 27 (`:233`) is stale against the code and the step: `deviceSize` is now `backingSize`, `nextChangeMs` is now `nextMs`/`dueMs`, "phase hash" is now `hash32`/`instanceOffset`, and "depcruise layer CN" is now "no CN, a test fence". Also "phase" at `:238`, `:257` and `:265`. That doc is EA's.

## Carries

- **Next pin CN:** the depcruise rule `render-imports-only-own-folder`. Consider also saying who may import render (today `sim → render` is allowed).
- **Repo-wide check-law / eslint (pin CN):** the one-clock lists don't include `setImmediate` or `process.hrtime`/`process.uptime`.
- **Step 28:**
  - Clip drawing to the art rect: partial edge tiles currently paint into the 1-px letterbox (e.g. devW 1172, s 3, padX 1, camera devX 1 → a tile at dx 0).
  - `imageSmoothingEnabled = false` after every resize.
- **Step 29:** the device run at 120 Hz and with the 60 cap; wiring the `rev` counter.
- **Step 30:**
  - Build `standing` in a stable documented order (units by id, objects by doc index), because the last sort key is input order.
  - Decide the walking-unit offset key: keyed to the current cell, a unit's animation jumps when it crosses a cell.
  - Decide whether `dx` should break ties before `c` for units walking sideways (X6d is not a bug against the doc).
- **Step 31:** the palette-exemption rule.
- **Step 34:** frame-build allocation budgets (nit 3).

## Artifacts

`/workspace/qa-runs/step-27-review/`:
- **Copies:** `proto/` (copy), `green1/`, `plants/`, `extra/`, `fixcheck/` (copy with the patch committed locally), `base/` (archive of `2da0d02`).
- **Logs:** `green1.log`, `plants.log` (22/22), `extra.log` (before), `extra-fixcheck.log` (after), `green-fixcheck.log`, `base-*/head-*` sim and smoke captures.
- **Tools and patch:** `tools/extra-plants.py`, `qa-test-hardening.patch`.

---

# r2 recheck (LEAN)

**Date:** 2026-11-13 01:15 Europe/London (GMT)
**Judge:** QA & Build Guard
**Inputs:**
- Bundle `r27-r2.bundle`, sha256 `8b81c9e39a421af3…a840f5`, which matches the claim. `git bundle verify` passes: one head, `refs/heads/r2` = `e9dda3d`, requiring `2da0d02`.
- Kit: step file `dd9e1036`, README `27e96381`, spine `dd7adc86`, research `380802db`. All match the claims.

**Copies and refs:**
- Copied to `/workspace/qa-runs/step-27-review/r2/` and imported as **`refs/cmp/s27-proto-r2`** (new; `s27-proto-r1` is untouched).
- No GitHub or Drive actions.
- Housekeeping: I wrongly sent one probe run's output to a new scratch file `/tmp/.qa-null` and deleted it straight away. No existing `/tmp` file was touched.

## Result

**OK TO SEND** on `e9dda3d` / kit `dd9e1036`. Fixes 1–4 from r1 are all in. No new fixes.

## Checks

1. **Chain and merge**
   - Chain: `e9dda3d` → `6d9799f` (r1) → `2da0d02`. Two commits, not squashed.
   - `git merge-tree --write-tree origin/main refs/cmp/s27-proto-r2` (main = `2da0d02`) is clean. Tree **`d9c704387c1d759a91a60c67f7fd6a3d2bdd5dfa`**, the same as the head tree.
2. **The r1 → r2 diff**
   - Only `tests/runtime/render/render-core.test.ts` changes, **+13/−10**. `src/` is byte-identical to r1 (`git diff --quiet r1 r2 -- src`).
   - The content is the QA patch plus three additions:
     - The `startMs` assert: start 100, clock 350, giving sx 16 / sy 32 / `dueMs` 500.
     - A named flat-folder failure (`withFileTypes`, `isFile && .ts`).
     - The extra banned names `Function|Temporal|global|self|require` (already in the QA patch).
3. **Build and size**
   - tsc is clean. Serial green (`--test-concurrency=1`) gives **529/0** (0 skipped, 0 todo). `npm run green` exits 0.
   - Pins are unchanged: 61fad786, 1e5dd82c, 45a3dbaa, 4d7bbf48, d7f64a09.
   - The sims (48/2 `afc89d56…`, 22/28 `b8007292…`) and all **20** smoke lines are byte-identical to the base.
   - **373+/0−** in 9 files, all `A`. The test file is **133/134**.
4. **Plants**
   - EA's plants: **22/22**.
   - QA extras: **31/32** graded, now that X8 is graded. That's the same as EA's "30/31 plus X8". X8 (`startMs` ignored) is caught by the dirty-flag test, and X7c is caught by the backing-store coverage assert. **X6d is the only miss**; it's a step 30 carry, not a bug against the file.
   - Probes U19 (depcruise + eslint) and U21 (allowed) behave as before.
   - **U5** (`import x = require`): the test file fails to load with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`, tsc gives 2 and eslint gives 1. Full `npm run green` exits **1**.
   - My **`"//"` repro** (U3) and the **template-literal `import()`** repro (U4) each make full `npm run green` exit **1**. On r1 both exited 0.
5. **Drift**
   - **Hashes:** all four kit files match the claims.
   - **Research:**
     - `phase` meaning `offsetMs` is gone. §3 now says `offsetMs`/`instanceOffset` and that `phase` is reserved.
     - The only "phase" left is two quoted EUX labels, "(EUX: phase)" at :149 and :158. They're attributed, so that's fine.
     - §11 row 27 now names `backingSize`, `fitView`, `scaleRange`/`snapScale`, `nextMs`, `hash32`/`instanceOffset`, `dueMs` and `needsDraw`, and says "No CN, test fence".
   - **Step file:**
     - The test text (:117–124), the banned-name list (:107), the plant table including the QA extras (:126–147), the size line (373, 1–4 under) and the "src identical to r1" acceptance all match the new tests.

## Nits and carries

No new nits. The r1 carries stand: the depcruise render rule at the next pin CN, `setImmediate`/`process.hrtime` in check-law repo-wide, the letterbox clip in step 28, and in step 30 the stable `standing` order, the walking-unit offset key and X6d. The r1 nits on `instanceOffset` before the cull and the `clipMs` allocation are still open, and are not blocking.
