# Step 33h A/B: chatB vs chatB2 (QA, 2026-11-13 22:56 GMT)

**Pick: A (chatB), with 2 must-fixes applied in `refs/cmp/s33h-fix` `b86840a2`.**

Inputs were copied from `/workspace/share/s-s33h/` to `qa-runs/step-33h-ab/`. Refs created: `refs/cmp/s33h-a` (216c177), `refs/cmp/s33h-b` (a95eee8) and `refs/cmp/s33h-fix`.

## Kit
- `main` is `71f43099` (tree `62f9d2fd`): the kit commit on `49af2cb2`.
- The kit adds 6 files. The step file is `eba81f34`, the shipped test `e1dc7ffd`, and `step-33h-review.md` `8c2d60aa`.

## Both builds
| | A chatB | B chatB2 |
|---|---|---|
| bundle | `afdb4b71` | `4980d640` |
| code / tip | `e701936` / `216c177` | `9559669` / `a95eee8` |
| parent | `49af2cb2` (the step base) | `49af2cb2` |
| merge-tree onto `71f43099` | `64f85510`, clean | `e7929954`, clean |
| tsc / green | 0 / 614-0 | 0 / 614-0 |
| shipped test | `e1dc7ffd`, passes | `e1dc7ffd`, passes |
| size (G7 150–400) | 253 | 262 |
| fx-live | 75/77 | 77/77 |
| world-scene | 103/105 | 104/105 |
| types / index | 31/35, 15/19 | identical to A |
| HANDBACK kit sha | `eba81f34…` | `eba81f34…` |

- Neither build is a descendant of `71f43099`. Both are built on the step base `49af2cb2`, which is correct.
- **Build law, both builds:**
  - No clock reads or rAF in `src`.
  - Scene imports only `render/index.ts` and `core/notice.ts`.
  - The law 13 bound is stated in Decisions: one store entry per listed effect, dropped the frame it leaves. Strips use a `WeakSet` per clip.
- **Probes, both builds:**
  - M-1: Infinity, NaN, −1 and 0 loops play once and fire `fx:end`.
  - No hang: 1e17 gives one lap in 0.3 ms. Core `crossed` past 2^53 returns 0.
  - p2 (NaN data) draws and fires nothing.
  - gc: churn grows the heap by at most 111 KiB over 99k frames.
- **Tile foot:** `Math.round(w/2)` and `floor(w/2+0.5)` agree for every integer width from 1 to 4096 and for every exact half. They first differ at w = 0.9999999999999999, which is not a valid tile width.

## Rulings 5, 6, 12 and code read
- **Ruling 5 (foot not mirrored), ruling 6 (M-1) and ruling 12 (S-1):** both builds follow them.
- **A, must-fix MF-1 (ruling 9/10):**
  - Cause: attach memory is keyed by step time (`s${p.at}`) plus one shared `"h"` key, not by step.
  - Effect: when a caster step and a target step share a start (spawn, or follow + detach hit), the target step draws at the caster's spot.
  - Repro: `qa-runs/step-33h-ab/probes/probe-ab2.ts` gives `both: 36,32 36,32`; with each step alone it is `36,32 / 100,32`.
- **B, must-fix if picked (ruling 9):**
  - Cause: B snapshots only `attach === "spawn"`. `placeStep` treats a missing `attach` as spawn.
  - Effect: a step with no `attach` follows the caster.
  - Repro: `probes/probe-attach.ts` on B gives `attach undefined … x at 200 = 84`. The expected value is 36.
- **A, G1 miss (Q25, a rule plant):** a looping effect replaying from `t2` instead of the pose is not caught by A's tests. Repro: `probes/probe-q25.ts`, where 1015 ms draws 1 but should draw 0. B catches its own Q25.
- **Not ruled, for EA to decide:**
  - With two effects in one call, A sorts all events by time. B and the proto sort per effect, so `e1@100` comes before `e2@50`. Ruling 5 says "sorted by time".
  - With the caster missing, A draws nothing. B and the proto draw at `at`.

## G1 plants
The full set (r3 + M-1) was re-anchored per build in `plants/plants-{a,b,fix}.py` and run against each build's own tests.

| Build | Caught | Misses |
|---|---|---|
| A | 42/49 | Q3, Q4, N6a, D1, D2 (equivalent); Q6 (caught by the fence suites); **Q25 (rule plant)** |
| B | 43/47 | Q3/Q4 have no anchor (equivalent); Q6 (fence suites); N6a, D1, D2 (equivalent) |
| fix | 45/51 | same equivalents and Q6. Q25, MF1 and MF2 (default attach follows) are caught. |

Equivalence evidence:
- Absent events or points give 0 notes.
- `viewHitMs` of finite inputs is always finite (0 of 90 cases were not).
- `placeStep` refuses NaN (r3).

## Pick and fix
- A is tighter: fx-live has 2 lines of headroom, and A sorts across effects by time.
- A's bug needs two steps with the same start on different anchors. B's bug hits every step without `attach`.
- **`refs/cmp/s33h-fix` = `b86840a226f1bd520b55470fd26d47ed9b4584e3`** (tree `651f5291`), on A tip `216c177`. Patch: `qa-runs/step-33h-ab/s33h-fix.patch` `990cd240`.
  - MF-1: keys are now `s${i}` / `h${i}` per step index, with no added line (fx-live 75/77).
  - MF-2: new `tests/runtime/scene/host-hookup-qa.test.ts` (22 lines, 2 tests). It pins MF-1, default attach, and lap replay on the pose grid. A tip fails it 1/1; B tip fails it 1/1.
- merge-tree onto `71f43099` gives `aa3b4344`, clean. tsc 0; green 616/0; sim matches A.
- Size 275, in band. Caps hold.
- **The QA test file is outside the step's 5 files and needs EA's G6 approval**, as in 33a.

## Addendum: EA rulings applied, fix2 (QA, 2026-11-13 23:07 GMT)

EA ruled: pick A plus `s33h-fix`; the G6 line is approved; events are ordered globally by time; a missing caster draws at the at-cell.

- **G6 approved:** `tests/runtime/scene/host-hookup-qa.test.ts` is a QA-owned test file outside the step's 5 files. It has no cap, and it counts toward the G7 band.
- **Event order (ruling 5, EA):**
  - fix1 sorted by `at`, then by a type rank. At a same-time tie across two effects, that put effect 2's `fx:start` before effect 1's `fx:hit`, which is wrong.
  - Now the sort is by `at` only. `Array.prototype.sort` is stable (ES2019+, Node 24). Events are pushed per effect in call order, timeline rows in timeline order, then the lap. So ties go: effect order, then timeline, then `fx:loop`. The `rank` line is removed.
  - Pinned: e2@50 comes before e1@100. A same-time tie across `[h, s]` and `[s, h]` keeps the call order, with h's hit before h's loop.
- **Missing anchor unit (EA):** `cell = aimed?.actor ?? e.at ?? null`. A missing caster now falls back to `at`, the same as the target fallback in ruling 15. It skips only when there is no at-cell. Pinned: caster `"gone"` with at (4,1) draws at x 68; with no at it draws nothing.
- **Commit:** `refs/cmp/s33h-fix2` = **`107e82f36f461e636edccd17674950e4c8470e53`** (tree `5b58bcdb`), on `b86840a2`. `s33h-fix` is unchanged.
- **Patch:** `qa-runs/step-33h-ab/s33h-fix2.patch` `cb36f25a`. It holds both QA commits on `216c177`.
- **merge-tree** onto `origin/main` `71f43099` (re-fetched) gives `3ca432dd`, clean.
- **Gates:** tsc 0; green 618/0, lint clean. Shipped test `e1dc7ffd`. Sim matches A.
- **Size:** 286 lines (+273/−13), in band.

| File | Lines / cap |
|---|---|
| fx-live | 74/77 |
| world-scene | 103/105 |
| types | 31/35 |
| index | 15/19 |
| shipped test | 136/139 |
| QA test | 34 (G6, no cap) |

  No cap re-base was needed.
- **Plants:** 49/55 caught by the build's own tests (shipped test + QA test).
  - New plants, all caught:
    - T1: effect order swapped.
    - T2: fix1's type-rank sort.
    - T3: no global sort (B/proto order).
    - Q15/H2: `fx:loop` before a timeline event at a tie.
    - C1: missing caster draws nothing.
    - MF1 and MF2 (from fix1).
  - Misses: Q3, Q4, N6a, D1 and D2 are equivalent; Q6 is caught by the fence suites.
- **Probes:** inf, hang (1e17 in 1.0 ms), p2, gc, ab2, attach, q25 and ab all pass. With the caster absent, probe-inf now plays frames 0–3 at `at`.
