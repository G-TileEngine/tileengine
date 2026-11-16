# Step ED-S0 review: Effect Designer flag page (kit `48ff1479`)

QA & Build Guard · 2026-11-16, Europe/London (UTC+0). Against QA spec `docs/qa/step-ed-s0-spec.md` sha256 `a0424d85a6a98be5d36eaa416211e56ac9462b1dd085d4891e5164e0c64a2820`. Inputs copied to `qa-runs/effect-designer/s0/` (share/scratch originals untouched). Bundle fetched to `refs/cmp/seds0-proto` and `refs/cmp/seds0-48ff1479` only. No GitHub writes. EA-owned files were not edited.

## Verdict: OK TO SEND with the QA pin (`refs/cmp/seds0-fix-a`)

The proto itself has **no product must-fixes**. Claims check out, law holds, the export audit is clean, EA's 12 plants were re-run independently at 12/12, and rulings (1)–(3) are agreed with notes on stub limits. The shipped tests missed three of my extra plants (exact budget line, the no-`?bold` 60 s path, scored A/B still marked scored when lite is auto). Those behaviours already hold in the code. Adopt the QA test at `refs/cmp/seds0-fix-a` (`0242425a`, 3 tests, 32 lines) as a G6 pin so green is **752/0**, then it is OK to send. Do not send the proto alone.

## Claims (verified)

| Claim | Result |
|---|---|
| Bundle sha256 `6fd7e293…` | `6fd7e293c803a281f9764cd793fbcbc4394049712b86db724d5d3720b053ef66` |
| Proto `48ff1479`, tree `c6a25251`, parent `d982155b`, branch `eds0` | Yes. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| Main `71b1a990` is docs-only on `d982155b` | Yes (13 QA docs, +732, no `tools/` / `src/`). Merge-tree of the proto onto `71b1a990` is clean |
| Step doc sha256 `9b6c58ad`, 145 lines | `9b6c58ad84ad085ba59dfc20075d3b63ec7895828ff3e2587974f1d11bba8b02`, 145 lines |
| Push list, 7 files | All 7 sha256s match the proto blobs |
| 375 changed lines, `src/` untouched | `+371/−4` in the 7 list files; `git diff d982155b..48ff1479 -- src` is empty. 150–400 is normal |
| Green 749/0 | **749/0** on the proto (typecheck, lint, deps, check:state, check:law, tools `tsc` all 0) with deps present. Sims 48/2 `afc89d56…` and 22/28 `b8007292…`. Smoke `0 failed` (7 ok + info + summary = 9 lines). Stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 |
| Plants 12/12 | EA's result file says 12/12. Independent rerun `qa-runs/effect-designer/s0/probes/qa-eds0-plants.py`: **12/12 caught** |
| Pins `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696` | sha256 prefixes of `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/check-law.sh`, `src/types/core-types.ts`, unchanged vs `d982155b` |

## 1. Export audit and law

`node tools/device-page/build.ts` + `check.ts` on a clean checkout of `48ff1479` prints **`check ok`**. `build.json` names that commit and 35 files, including `tools/device-page/bold.js`, `bold-stubs.js`, `bold-swatch.js`. No `src/editor`, tests, fixtures, docs, handoff, source maps, serve/build/check, or `@te/devtools` / `DebugPort`. The one "editor" hit in the tree is a comment in the react stub. Nothing in `src/` imports the new modules, so none of this can reach a Render build.

Law: one `createClock` and one `createDriver` on the page; `requestAnimationFrame` in `src/` is still only `raf-driver.ts`. The page has the existing HostEnv wrapper plus the one-shot `start()` kick (two `requestAnimationFrame(` calls, as pinned). Dummy work is seeded with `hash32`, not wall noise. Path/linger/fusion hits stay on a unit `target` (UNIT); living is a bounded ground overlay, no occupancy. Law 13: living uses a fixed 64-slot `Int32Array`, linger a 64×64 one-byte map, the export buffer is released in OFF blocks. Caps 48/2/12 are enforced with meter notes.

**Scheduler time (check 2).** `blockAt` is a pure read of the page's host-gap visit time (`performance.now() − t0`). The hash pass already uses fixed **sim** times 0, 5, … 115 s. This matches the published spec §1.2 ("visit time may follow the page's existing host-frame path") and EA ruling 3. The review brief also asked for sim-time blocks. I do **not** fail the kit for following the spec. If the spec is amended, feed `clock.now()` (or the same `tMs`) into `blockAt` so ON/OFF cannot drift from stub time under a stall — a should-fix, not a must-fix on `a0424d85`.

## 2. Plants

EA's 12, re-run independently on a scratch copy of the proto, all caught.

Extra plants for spec items EA's set might not cover, against the shipped `ed-s0.test.ts` only:

| Extra | Result on proto tests | Notes |
|---|---|---|
| E1 unknown `?bold` token fails closed | CAUGHT | Already pinned |
| E2 no-`?bold` 60 s window / zoom / pan moved | **MISSED** | The no-bold path is in fact unchanged (diff vs `d982155b`: only `canvasMb()` with the same formula). No test pins the 60 s window, zoom ramp, `% 480` pan or rotate gap |
| E3 HUD red *exactly* at the budget line (`>` vs `>=`) | **MISSED** | Code is already right: delta `==` budget is green, a hair over is red; canvas `160` is green. The shipped HUD test never uses an exact-line case |
| E4 `?seed=` silently clamped (the `?ps` nit) | CAUGHT | Bad seeds get a notice and play 0; `2147483647` is kept |
| E5 canvas watch omits the main canvas | CAUGHT | |
| E6 heap `n/a` when `performance.memory` is missing | CAUGHT | |
| E7 auto-lite still counted as a scored A/B | **MISSED** | `readout` already marks `NOT SCORED` unless cap is on and lite is off. No test pins that gate |

Must-fix: add the pins. `refs/cmp/seds0-fix-a` = `0242425aa69202b404f791a3a3cabec84ce59923` (tree `456cc802`, parent `48ff1479`, noreply both sides). New file `tests/tools/ed-s0-qa.test.ts`, 32 lines, sha256 `c29c769ede157e9612d321e37d3358a826546786d257d05583dc64728ac4a538`. On that ref: extras **7/7** caught, green **752/0**, eslint clean. No product change.

## 3. Rulings

**(1) Any `?bold=`, even `off`, starts the 2-min A/B on the stress scene; no `?bold` means today's 60 s run unchanged.** **Agree.** A baseline visit has to use the same 2-minute stress scene and HUD (`?bold=off`). Without the `bold` key, `page.ts` keeps the 60 s window, zoom ramp, `% 480` pan, rotate prompt and HUD text; the only edit on that path is `canvasMb()`, which is the same G5b formula. Seed 0 / absent keeps today's particle hash. The QA pin now locks the 60 s path.

**(2) The hash is a second pass over the whole-map scene, sampled every 5 s of sim time, not the culled draw list.** **Agree.** At DONE, `hashPass` runs twice with a fresh `createSceneLink`, at 0, 5, … 115 s (24 samples, values, no clock made). The fingerprint is standing, overlays, dots, lights and stub notes from the same `boldWorld` builder — never the HUD and never `buildDrawList`. EA's note that a culled list hid off-screen stubs is a good reason to keep it whole-map. For `export`, the hash is also FAIL unless two consecutive bakes are byte-equal.

**(3) Partial stubs.** Each still gives a valid kill for the law/budget bugs it can see; none of them prove the later slice. The run sheet must say so (TEMPLATE edits below).

- **Tiers.** Valid kill for a non-int host value, for reading `hp`/`mana`, and for blowing 48/2/12. The cost signal is light: OFF is the cap-level base (48 particles), ON is tier 2 at 48 plus punch (`hit_stop_ms` 100, shake 2) and the CPU of building tiers 0/1/2. Particle counts do not move. A near-zero S21 delta is expected and is **not** a pass on cost; do not graduate tiers from it. A later ruling can use a tier-0 OFF baseline if QA wants a bigger delta.
- **Living linger.** Valid kill for unbounded growth (fixed 64-slot cap, empty when off) and for writing rules/occupancy (it doesn't). The look is a distinct tile frame plus a `VISUAL ONLY` line, not a distinct ramp (waits for E9). A "looks like a hazard" check is still a CEO eye.
- **Caster colour.** Valid kill for inventing a hex colour (it writes ramp keys only) and for a no-op dummy (the hash moves). The colour source is a seeded stand-in per unit, not a sprite read.
- **Export bake.** Valid kill for an unwatched heap, a second rAF, wall noise, or a buffer that is not released. The bake is a 13-tile cell at k = 3 (624×624×16, **23.4 MB**, released in OFF), not the page backing and not the real renderer. That peak must not be used as the E10 heap budget. The readout already has an `export bake MB` line; the sheet must label it "effect-cell, not full backing."
- **React.** Valid kill for a second `LiveFx` or an invented colour (text only, doc unchanged, no steam stop). The hash *does* move, via the suggestion note. The on−off p95 may be tiny (a pair loop over 40 units). Do not graduate from a near-zero delta.
- **DPR cannot be forced.** Agree (already a spec §8 gap). The page never upsamples; the readout prints the phone's DPR and backing. Record those. A 2.625 phone is not a DPR 3 stress.

## 4. TEMPLATE.md S0 card

I own this file; EA appended 10 lines (64→74, under the /14 cap). The five-row G5b log is untouched. The card is **correct enough to keep**: tokens and fail-closed typo, `?bold=off` as the baseline, "60 fps cap on" and "lite off" then "run again", no mid-run rotate, 2-minute OFF/ON plan, S21 Ultra first then the Red Magic 9 Pro, checkout order `off` / `export` / `living` / `fusion` / `path`, screenshot of the DONE box, no device identifiers, and the table shape from spec §7.

**Edits I want** (do not ship these as a silent rewrite; they can go in a QA follow-up or a one-line add):

1. Tell the CEO to also fill the header above (phone, Android/browser, power saving).
2. One line of budgets: p95 ≤ 18.3 ms with the cap on, dropped ≤ 1 %, no frame over 50 ms, canvas/heap ≤ 160; on−off p95 is judged against the idea's ms line; export is peak MB only.
3. Stub caveats from ruling (3): record the DPR / backing line (DPR is not forced); export peak is a 13-tile k=3 cell, not the full screen; a near-zero delta on **tiers** or **react** is expected and is not a cost pass; living shows a distinct tile frame and `VISUAL ONLY`, not a special ramp; caster colours are seeded stand-ins; react is suggestion text only.

I am otherwise fine with EA's text.

## 5. Step doc vs code (drift)

The step doc matches the code on flags, blocks, budgets, caps, stubs, the swatch hook, and the audit. Small nits only:

- Export size is written **23.8 MB**. The buffer is 624×624×16×4 bytes = **23.4375 MB**. Say 23.4.
- "tools 232" is the tools *insertions* (74+118+13+27); changed tools lines including the 4 deletions are 236. Not wrong if read as insertions.
- The kit parent is correctly `d982155b`. Main has since moved to `71b1a990` (docs only); worth one line at send time, not a doc error.

## 6. Nits

- Default A/B load is still `lite: auto` and cap off (first visit is NOT SCORED until the buttons and "run again"). The TEMPLATE already tells the CEO to set them. Optional product nit: default cap on and lite off when `flags.present`, so the first two minutes can be scored.
- Scheduler is host visit time (see §1). Hash is sim time.
- The shipped hash test does not require `react` to move the fingerprint; it does, via notes.
- Pre-existing: `?ps` is still unclamped (out of this slice).

## 7. Fix ref (adopt as G6)

```
refs/cmp/seds0-fix-a  0242425aa69202b404f791a3a3cabec84ce59923
tree                  456cc802f44479fd68b9760d7cccbf63eb988729
parent                48ff1479cdd7b99a36a582fc20c2efa580a0b282
file                  tests/tools/ed-s0-qa.test.ts  (32 lines)
sha256                c29c769ede157e9612d321e37d3358a826546786d257d05583dc64728ac4a538
green                 752/0
```

noreply, tests only, no EA file touched. After merge of proto + this pin onto `71b1a990`, floor 752.
