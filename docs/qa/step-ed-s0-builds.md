# Step ED-S0 builds A/B (Effect Designer flag page): QA pick

QA & Build Guard · 2026-11-16 04:00 Europe/London (GMT). Base `71b1a990`. Main is now `3c969024` (`git fetch origin main`): the S0 kit landing (step doc `f00f59d0` + the four shipped files under `handoff/steps/tests/step-ed-s0-flag-page/`, +389, no `src/`/`tools/` change). Approved kit proto r2 `c5c24562` (tree `3ce7551d`), push list `qa-runs/effect-designer/s0/r2/step-ed-s0-push-sha256.txt` = `451974cf…`. Inputs copied to `docs/qa/qa-runs/effect-designer/s0-builds/in/` (share/scratch originals untouched); outputs in `…/s0-builds/out/`, probes in `…/s0-builds/probes/`, TMPDIR under `…/s0-builds/tmp/`. Bundles fetched to new refs only: `refs/cmp/seds0b-A-tip`, `-A-impl`, `-B-tip`, `-B-product`, `-B-impl1`. No GitHub writes, no EA file edited. CoS's verifies said PASS; every figure below was re-run here.

## Pick: **A** + QA pin. `refs/cmp/seds0b-A-fix-a` = `9b75d6e25edf96c991d5dadf001d31e73c2d10a1`

Why A: both builds are green and equal on the hard gates (752/0, sims, smoke, stress counts, EA 12/12, QA E1–E7 7/7, check ok, src untouched, helpers present). The difference is one live spec bug in B: **B marks the `?bold=off` baseline NOT SCORED** even with the cap on and lite off. B's `parseFlags` sets `scored: unknown.length === 0 && on.length === 1`; ruling 1 makes NOT SCORED only for several tokens, an unknown token or off-mixed (plus cap/lite), and the proto and A use `on.length <= 1`. The run sheet starts every phone run with `?bold=off`, so on B the baseline visit could never read as scored. B's HANDBACK restates it as "one known token", so it is a decision, not a slip, and it contradicts the ruling. B also needed a second commit for the DONE `bake MB 0.0` bug; A never had it (see below). B's product is otherwise fine.

The shipped tests do not pin the baseline either: QA plant **Q8** (`on.length <= 1` → `=== 1` on A) is **MISSED** by both shipped S0 files, so it is a must-fix on A. Fixed with a QA test only.

```
refs/cmp/seds0b-A-fix-a  9b75d6e25edf96c991d5dadf001d31e73c2d10a1   (parent A tip 4f94cb9a, noreply author+committer)
tree                     a95033c034936a84ac8cbd18a93b1e53066bf87f
file                     tests/tools/ed-s0-builds-qa.test.ts  19 lines  sha256 302e45e1dace3cbdc38667e82dd0eca565fbb0e1b6c0f11cf2f80b2c4bcc774b
green                    753/0 (752 + 1); typecheck, lint, deps, check:state, check:law exit 0
plants on the fix ref    EA 12/12, QA E1–E7 7/7, Q8 caught (20/20). The same test FAILS on B ("" / off are NOT SCORED)
```

Size with the pin: 396 + 19 = **415** changed lines. That is in the 400–500 band; the reason is the 19-line QA pin only (no product growth), and it stays under the step's ruling-11 hard cap of 420.

**Ref note (my error):** while creating the fix ref I first ran `update-ref refs/cmp/seds0b-fix-a HEAD` from the main clone, so `refs/cmp/seds0b-fix-a` points at `d982155b` (the clone's checked-out main), not at the fix. Per the no-overwrite rule I left it and created the correctly named `refs/cmp/seds0b-A-fix-a`. **Ignore `refs/cmp/seds0b-fix-a`.**

## Merge-tree onto main `3c969024` (all clean, no conflicts)

| Ref | Merge-tree |
|---|---|
| A tip `4f94cb9a` | `93c5ac1f25d65e1788a8cc9b75792d58395a14f0` |
| **A + pin `9b75d6e2`** | **`c55dd5d040e7fbdb88fcad5b772c4472cfebcfeb`** |
| B tip `c369d67b` | `c5291a78a45fca362656a515acdf524997186473` (matches B's verify) |

## Per build

| | A tip `4f94cb9a` (impl `62f82df0`) | B tip `c369d67b` (product `56259edf`, impl1 `20226a77`) |
|---|---|---|
| Bundle sha256 | `9779cb92…` (60,049 B) | `587d1802…` |
| Verify file | `bb2126c6…` ✓ | `7d719bb0…` ✓ |
| Identity | every commit `G-TileEngine <G-TileEngine@users.noreply.github.com>` both sides | same |
| Diff `71b1a990..code` | 8 files +392/−4 = **396** | 8 files +364/−6 = **370** |
| Caps | bold 66/90, stubs 117/130, swatch 14/20, page 24/40, TEMPLATE 14/14, qa test 32/37 | bold 74/90, stubs 91/130, swatch 6/20, page 24/40, same kit files |
| Tip vs code | only the six `handback/…/r1/` files | same |
| Shipped files = r2 `c5c24562` = main `3c969024` kit copies | `ed-s0.test.ts a25b8928`, `ed-s0-qa.test.ts c29c769e`, `ramps.json 700f5e13`, `TEMPLATE.md 192c098e`: byte-identical at code and tip | same |
| `src/` | empty diff | empty |
| Protected paths (`package.json`, lock, `BUILD_GUIDE.md`, `.dependency-cruiser.cjs`, `scripts/`, `tools/pixel-suite`, device-page `build.ts`/`check.ts`/`index.html`, `serve.ts`, `tests/perf`, `handoff/`, painter-proto) | empty; pins `1e5dd82c d7f64a09 45a3dbaa 4d7bbf48 d6d08696` | empty; same pins |
| Green | 752/0/0/0/0/0; all gates 0 (main `3c969024` is 742/0) | 752/0; all gates 0 |
| Sims | 48/2 `afc89d56`, 22/28 `b8007292` (= main) | same |
| Smoke | `smoke: 0 failed`, byte-identical to main and B | same |
| Stress (alone) | 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 | same counts |
| Export audit | `check ok`; 36 files = main's 33 + `bold.js`, `bold-stubs.js`, `bold-swatch.js`; no `src/editor`, devtools/`DebugPort`, maps, tests, docs | identical file list |
| Law | 1 `createClock`, 1 `createDriver`, 2 `requestAnimationFrame(` on the page (= main); rAF in `src/` only `raf-driver.ts`; no timer / wall time / `Math.random` in the bold files | same |
| Bounded memory | living ≤ 64 (a fresh `Int32Array(64)` per call), linger 4096-byte map per call, bake 1 buffer released in OFF, last 2 bake hashes kept | living module-level `Int32Array(64)`, linger map per call, bake released in OFF; `bakes[]` is never trimmed (bounded by the visit: ≈ 1 entry per 16 ON frames) |
| Plants (EA 12 + QA E1–E7 adapted per build, both shipped S0 test files) | EA 12/12, extras 7/7. **Q8 MISSED** → pin | EA 12/12, extras 7/7. Q8 n/a: B ships that behaviour |
| HANDBACK §0.6 | present: 3 helpers (rulings vs code, which found 2 bugs fixed pre-commit; edge-case probe; diff/caps/pins) + self-review. Not thin | present: 4 helpers (page/HUD, which found the DONE 0.0 bug; bold/swatch; page rulings; stubs) + self-review. Not thin |

Plants: plant 4 (setInterval) keeps node alive. My first runner killed it with SIGKILL and logged a false MISSED (`out/plants-A.log`, `plants-B.log`). A SIGTERM rerun prints the failing law test on both builds (`out/plant4-A-manual.log`, `plant4-B-manual.log`), and the fixed runner shows 4 caught (`out/plants-Afix.log`). Runner: `probes/qa-seds0b-plants.py` (`89570bf7`).

## Bake MB: 23.8 is right; QA's 23.4 was my arithmetic error

624 × 624 × 4 B × 16 frames = **24,920,064 B = 23.765625 MiB**, which `toFixed(1)` prints as **23.8** (24.9 MB decimal). Both builds compute it from the real allocation. My S0 review §5 wrote "= 23.4375 MB. Say 23.4". That was wrong, because 23.4375 MiB would be 24,576,000 B, which is not this buffer. The step doc r2 then took up my number (ruling 8 "23.4 MB" and the headless line "bake MB 23.4 … (QA re-measure …)"), but no re-measure ever happened. **Ruling: the page's 23.8 is correct and QA's 23.4 was an error.** Follow-ups: EA corrects step-doc lines 28 and 123 (EA file, not edited here). QA corrects `docs/qa/device-runs/TEMPLATE.md` line 70 ("about 23.4 MB" → "about 23.8 MB") in a docs follow-up after merge, because that file is a byte-pinned kit file in this slice.

## B's DONE 0.0 bug: A is not latent-buggy, in either block order

Headless probe (`probes/done-bake.mjs`, log `out/done-bake.log`), full 2-minute `?bold=export&seed=7` visit on each built page, five pages at once, 0 page errors:

| Page | Last block | DONE line |
|---|---|---|
| A | ON 6/6 | `export bake MB 23.8 peak 23.8 · bakes equal yes` |
| B (product) | ON 6/6 | `export bake MB 23.8 peak 23.8 · bakes equal yes` |
| B impl1 `20226a77` (control) | ON 6/6 | `export bake MB 0.0 peak 23.8`: reproduces B's own bug |
| A with order flipped (`i % 2 === 0`, last block OFF) | OFF 6/6 | `MB 0.0 peak 23.8 · bakes equal yes` |
| B with order flipped | OFF 6/6 | `MB 0.0 peak 23.8 · bakes equal yes` |

Why A is safe: A's `blockAt` clamps DONE to the last real block, so its `on` stays the last block's value. The bake steps in `view()`, which runs after `show()` freezes the card in the same frame. B's original bug came from its `blockAt` returning `on: false` at DONE, and it stepped the bake inside `show()`. In a last-OFF order, both builds print 0.0 current with the 23.8 peak kept. That is the true state, because OFF releases the buffer by spec, so it is not a bug in either. A needs no fix here.

## Nits and should-fix (not pick factors unless stated)

- **S1 (both, should-fix, carry):** neither build bakes `e0`'s particles as the step says ("an offline bake of `e0`'s particles"). A writes one 4-byte hash per frame and B writes one 624-px row, while proto r2 filled and hashed the full 624×624 frame. The printed MB is still the true allocation, but the ON-block CPU and page-touch load is far below the reviewed proto, and most of the buffer is never touched. Export has no ms line, so no verdict is wrong. Still, do not read an export visit's on−off p95 as bake cost. This is a kit-test gap: no test checks that the bake reads the particles. Carry to E10.
- N1 (B): path only adds a note. It does no placement and no 30 ms sampling, so path ON adds ~0 load. A writes the sample into `e0`'s first piece `at`.
- N2 (A): fusion keeps only `a`'s pieces, so the fused doc is lighter than "two effects → one capped doc". B concatenates and caps.
- N3 (A): living allocates `Int32Array(64)` per call (bounded; not the module-level slot the step names).
- N4 (B): bake `bakes[]` never trimmed (bounded by the visit).
- N5: DONE card labels: B prints `DONE` then `DONE 0s`, A prints `DONE` then `ON 6/6 0s left`.
- N6: A's DONE readout prints `dpr 2` but not the backing size. B prints `DPR 2 backing 412x915`, which TEMPLATE asks the CEO to record. Optional one-line add for A.

## Doc
This file. Probes/logs under `docs/qa/qa-runs/effect-designer/s0-builds/`. Nothing pushed.
