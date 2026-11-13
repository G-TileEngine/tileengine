# Step 27 A/B compare: Grok Build A (chatB2) vs B (chatB)

**Date:** 2026-11-13 02:20 Europe/London (GMT)
**Judge:** QA & Build Guard
**Reference:** proto `refs/cmp/s27-proto-r2` (`e9dda3d`).
**Kit:** main `238fafb`, which holds `handoff/steps/step-27-render-core.md` as git blob **`ef6e0b18`**. That's the same file as the kit's sha256 **`dd9e1036`** (one is the git blob id, the other the sha256). It's byte-identical to `/workspace/tileengine/handoff/steps/step-27-render-core.md`.

**Refs:** **`refs/cmp/s27qa-a`** = `ea884d0` and **`refs/cmp/s27qa-b`** = `23f51ef`, both new. My first fetch took the share repos' detached HEAD, which was `238fafb`. I moved my own two just-made refs to the tips seconds later, using `update-ref` with an old-value guard. No other ref was touched.

**Read-only:** the `/workspace/share` repos and `/tmp` were only read. Work is in `/workspace/qa-runs/step-27-ab/`. No GitHub, Drive or agent actions.

## Pick

**B (chatB, `23f51ef`).** A is also acceptable after a one-line test fix (A-1 below).

## Numbers

| | A (chatB2) | B (chatB) |
|---|---|---|
| Tip / tree | `ea884d0` / `1fb220dd` | `23f51ef` / `363dbaa0` |
| Code commit / tree | `12421cb` / `50ea064a` ✓ | `17c6852` / `d86f4636` ✓ |
| Parent chain | tip → code → **`2da0d02`** | tip → code → **`2da0d02`** |
| Merge-tree onto `238fafb` | clean, **`0e6a4e90bbcba69769a771e7103142ace0b15ef0`** (15 `A` = 9 product + 6 handback) | clean, **`c62071e4073bd71d75ea77d522054764ecf0f813`** (15 `A`) |
| Lines (`2da0d02..code`) | **359**+/0−, 9 `A` | **368**+/0−, 9 `A` |
| Caps | all under | all within; frames 44/44 and fake-renderer 34/34 are at cap |
| tsc / serial green / full green | 0 / **529/0** / 0 | 0 / **529/0** / 0 |
| Sim, 20 smokes, 5 pins | identical / identical / unchanged | identical / identical / unchanged |
| EA plants (adapted) | **22/22** | **22/22** |
| QA extras (graded) | **30/32**: misses X6b (z ignored) and X6d | **31/32**: misses X6d only |
| Probes | X7c caught (coverage); XG glow pass-through caught | X7c caught; XG caught; **XW (remove the widening) not caught** |
| r2 proto test + fake overlaid | **8/0** | **8/0** |
| Diff vs proto (src + tests) | +222/−236 | +223/−228 |

**On the parent claim:** "sits on `238fafb`" is not literally true. Both branch from **`2da0d02`**, which is what the kit's Base line requires. Both merge cleanly onto `238fafb`.

**On CoS's Δ5 vs Δ14:** a plain line diff doesn't reproduce that gap. Both are independent rewrites at about the same distance from the proto.

**On the overlay:** overlaying the proto test alone fails to load on both builds, because each build's fake-renderer API differs. With the proto fake renderer overlaid too, both pass 8/0.

## Build law (both)

- **Clean source:** no rAF, DOM, wall time or timers in `src/runtime/render`. check-law, eslint and depcruise are clean, and `src/index.ts` is untouched.
- **Fence:** both have the r2-strength fence (string-aware comment strip, backtick specifiers, `import(` banned, the extended banned names, a flat-folder check). U3, U4 and U6–U18 are all caught. U5 fails to load and fails tsc/eslint, so green exits non-zero.
- **Fake renderer:** a `src → tests` import (U20) is caught by depcruise `no-tests-in-src` plus the fence test in both builds.
- **Imports into render:** core → render (U19) is caught by depcruise and eslint. sim → render (U21) is allowed, as before (carry).

## Differences judged against the kit

Edge values below come from `tools/edges.ts` (proto / A / B).

- **Glow op.** Kit `:36` says "Glow draws carry `op: "add"`"; `:167` says "glow is only `op: "add"` here"; `:122` says "glow is `add`".
  - **A** forces `add` on every glow overlay (`draw-list.ts:54`). That's the most literal reading.
  - **B** defaults glow to `add` but passes an explicit `op: "normal"` through (`draw-list.ts:58`). It meets the default; "only" is arguably not met. Nit, not a fix.
  - The proto uses `o.op ?? "normal"`, so a glow with no op came out `normal`. The proto was the weakest of the three here; its test passed only because it supplied `op: "add"`.
  - **So:** `add` for glow is required by default. A is strictly right, and B is acceptable.
- **B widens the tile cell range by sheet size** (`draw-list.ts:35`: `floor((viewX0 − fw) / tileW)`).
  - For normal tiles (`fw == tileW`) it adds one column/row that the cull then rejects, so the output is unchanged. It only matters for tiles larger than the cell.
  - But project-format §6.2 `tile {w,h}` (K1, `data/project-format.md:395`) says an off-size tile is "drawn at native size from the cell's top-left **and clipped**". So a correct core clips to the cell rather than widening the range.
  - Verdict: **not creep and not harmful, but not the needed fix either**. It's untested (XW passes) and not named in B's hand-back (law 12). Nit. Carry: the K1 cell clip, which none of the three builds does (proto, A and B all draw the full `fw×fh`).
- **fps 0.** Kit `:33`: "`1000 / fps` (fps 8 when absent)". fps 0 isn't "absent", and the format sets no range.
  - The proto treats fps ≤ 0 as 8 (`[130,130]`). Both builds give `1000/0 = Infinity` and show the **last** frame forever.
  - **A's `frameAt` returns `nextMs: NaN`**, through `(t % Inf + Inf) % Inf`, which breaks the "clock ms or `Infinity`" contract. It's harmless in practice, since `dueMs` ignores NaN, but it's a nit.
  - B returns `Infinity`.
  - Not a kit violation. Carry: DSK/format should require fps > 0, or step 30 should sanitize.
- **Zero-size `{0,0}` exact box.** Kit `:29`: "the exact device box when the host has one".
  - Both builds return it as-is (also fractional values like 780.6). The proto falls back to css × dpr when the box isn't > 0, and truncates.
  - Zero gives `artW 0` and nothing drawn. Acceptable literal reading. Nit.
- **Odd-width anchor** (fw 15, bottom-centre, s 2): proto dx **32**, A **34**, B **34**. CoS's scenario gave 26 vs 28; same 1-art-px gap.
  - Kit `:31`: "World positions snap to **art px first**"; `:37`: "A sprite's anchor lands on the foot point".
  - Both builds snap the world position (`foot − 7.5` → half up → `foot − 7`). The proto snaps the anchor (`px(7.5) = 8`).
  - The builds match the kit wording at least as well as the proto does. Acceptable for both. Carry: pin it with an odd-width test in step 30.
- **Missing kit blob in the hand-back.** Neither quotes `ef6e0b18`/`dd9e1036`. B notes the step file isn't in its base tree, which is correct, since `2da0d02` predates the kit. **Process nit only.** Both name `HANDBACK.md`, matching steps 21–25.
- **Other differences:**
  - **A:** computes `instanceOffset` only after the cull, which fixes proto nit 1. It also emits tiles from the cell range with no second hit test (equivalent for tile-sized sheets). Its `index.ts` uses `export *`.
  - **B:** keeps the proto's offset-before-cull and has a named re-export list.
  - **Both:** `hash32` pins at 1909584459 and gives identical negative/UTF-16 results to the proto.

## Fixes before a PR

- **B (pick):** none required.
  - Optional, one line each: force glow `add` (`draw-list.ts:58`) to match "only"; add a wide-tile test or drop the widening; name the widening in the hand-back.
- **A (if chosen):** **A-1.** `tests/runtime/render/render-core.test.ts:97-98`.
  - Problem: the `z` key isn't proven. The units at (3,2) appear in input order already sorted by `z` (−1, 5, 5), so dropping `z` from the sort passes.
  - Repro: in `src/runtime/render/draw-list.ts:39`, delete ` || (a.s.z ?? 0) - (b.s.z ?? 0)`, then run `node --test tests/runtime/render/render-core.test.ts`. 8/8 pass.
  - Fix: put a higher-`z` unit before a lower-`z` one in the input, matching the kit's test text at `:122` ("then `z`").
  - Nit: return `Infinity` rather than NaN from `frameAt` for a non-finite total (`frames.ts`).

## Carries

1. **Clip ms padding: kit vs format.**
   - Format §6.2 (`data/project-format.md:402`) says a short `ms[]` is "padded with the last value". The kit `:33` (and the proto, A and B) fall back to fps for a missing `ms[i]`.
   - EA or DSK should reconcile them. Step 30 could pad when it resolves clips.
2. **K1 tile clip:** an off-size tile must be clipped to its cell. That belongs in step 28 or 30.
3. **Format/DSK:** fps > 0, or a defined meaning for fps 0.
4. **Step 30:** pin the odd-width anchor rounding with a test.
5. **Unchanged from r1/r2:**
   - The depcruise render rule at the next pin CN, including who may import render (sim → render is allowed today).
   - `setImmediate` and `process.hrtime` missing from check-law repo-wide.
   - The step 28 letterbox clip.
   - Step 30: the stable `standing` order, the walking-unit offset key, and X6d.
   - Step 34: allocation budgets.

## Artifacts

`/workspace/qa-runs/step-27-ab/`:
- **Trees:** `a/` and `b/` (archives of the tips plus node_modules), `pl-a/` and `pl-b/` (plant runs), `ov-a/` and `ov-b/` (proto test overlay).
- **Logs:** `a-serial.log`, `b-serial.log`, `a-green.log`, `b-green.log`, `plants-a.log` + `plants-a2.log` + `plants-a3.log`, `plants-b.log`.
- **Tools:** `tools/ab-plants.py`, `tools/edges.ts`.
- **Copies:** `kit-step27.md`, and the copied verify reports and hand-backs.
