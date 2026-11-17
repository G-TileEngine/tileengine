# QA: ED-E5 builds compare (ChatA vs ChatB), step-ed-e5-writer-dice kit r4

QA & Build Guard, 2026-11-17 (GMT). Evidence is in `docs/qa/qa-runs/effect-designer/e5/builds/`.
I ran every gate myself, one after another, never in parallel. Nothing was pushed, and no GitHub or Drive writes were made.
The clone took only new `refs/cmp/*` refs.

## Verdict
**Pick ChatA**: head `632cfbb9d943616d0bb083a4e8b6dd7cf64428d6` (code head `4e8a8236`).
- Expected merge onto main `ade38faa`: tree **`27c4245f2dc89d62893c41eb278269b4dff6cd05`**. This matches the claim, has no conflicts, and is gated (below).
- **OK to merge once QA's pin is adopted.** The pin is `refs/cmp/ede5-qa-pin-a` = `3bca4d7d149cd9e270239981c3aa244d3c985d08` (on `632cfbb9`).
  - The pin adds one 15-line file, `tests/editor/effect-e5-qa5.test.ts` (sha256 `0dbd56da…9984`).
  - Bundle: `/workspace/share/ede5-builds-qa-pin-a.bundle`, sha256 `131486b3f1cbf6fd364745d968ec7c49daec6832a461fd3286d515fd2941b74f`, prerequisite `632cfbb9`.
  - With the pin, the merge tree is **`cc908db54d6641ace915f5642b7a4bfe16832dbd`** (gated). Floor 857 → 858. Size 405 → 420, still in the 400–500 band; the reason is a QA pin.
- **ChatB is rejected.** Its dice leaves the format range (M-B1), and two of its three §0.6 helpers never reported (M-B2).

## Intake (both builds)
| | ChatA | ChatB |
|---|---|---|
| Bundle sha256 / verify | `d7ac0a0a…6cdf` ok | `7976f1df…05fc` ok |
| Head | `632cfbb9`, plus code `4e8a8236` and `73b75ece` | `c8d093cb`, plus code `a1e11276` |
| Chain / identity | onto `f8a451f5`; author and committer are the noreply identity on every commit | same |
| Code files | the kit's 9 (3 src + 6 tests), plus `handback/` | same |
| Shipped tests | 6/6 byte-identical to the kit push list (2069965e, 5bba78fd, 717c5efa, 4f6138e9, 188e6d6e, 7dee155e) | 6/6 identical |
| writer / dice / house (cap 87/61/44) | 85 / 53 / 30 | 73 / 55 / 29 |
| Total (≤ 417) | 405 (src 168), in the 400–500 band: the kit's QA-pin size reason, and src is under the proto's 180 | 394 (src 157) |
| Merge tree onto `ade38faa` | `27c4245f` = claim, rc 0 | `977745cc` = claim, rc 0 |

## Gates (`qa-gates.sh --floor 857`, sequential; logs `gates-*.log`)
| Ref | tests | tc/lint/deps/state/law | smoke | sim | stress |
|---|---|---|---|---|---|
| ChatA `632cfbb9` | 857/0 | pass, 116/373 | 0 failed | 48/2 afc89d56, 22/28 b8007292 | 27/0/0 113/0/0 181/0/0 181/0/0 27/373/0 |
| ChatB `c8d093cb` | 857/0 | pass, 116/373 | 0 failed | same | same |
| merge A `dcba8be8` (tree 27c4245f) | 857/0 | pass | 0 failed | same | same |
| merge B `3cf04e41` (tree 977745cc) | 857/0 | pass | 0 failed | same | same |
| pin `3bca4d7d` | 858/0 | pass | 0 failed | same | same |
| merge pin `1cb25e87` (tree cc908db5) | 858/0 | pass | 0 failed | same | same (run 2) |

- sim and stress equal the doc in every run.
- Merge-pin run 1 hit the known "C: p95 over 4 ms" flake (lap 1, 4.52 ms). A lone rerun was clean; both logs are kept.
- The "main stress" DIFF lines in two runs are main-side flakes. The ref side was complete each time.
- The merge commits are local `refs/cmp/ede5-merge-*` objects made only to gate the trees.

## Plants (G1). Runner `plants/fastplant.py`, the same rules as `qa-plants-run.py`
The runner does this:
- each needle must be unique;
- a plant is caught if and only if `node --test` on the 6 E5 test files exits non-zero;
- it runs in place and restores each file.

It catches 160/160 on proto `dd29f737` (`plants-proto-calibration.log`).

| Set | ChatA as-is + adapted | ChatB as-is + adapted |
|---|---|---|
| EA 106 (`ede5-plants-r3.py`) | 31 + 75 = **106/106** | 29 + 77 = **106/106** |
| QA r1 33 | 9 + 24 = **33/33** | 4 + 29 = **33/33** |
| QA r2 15 | 8 + 7 = **15/15** | 7 + 8 = **15/15** |
| QA r3-new 6 | 1 + 5 = **6/6** | 1 + 5 = **6/6** |

- Each adaptation is named `<id> [A]` or `[B]` in `plants/plants-A.py` and `plants/plants-B.py`. Each one is the same semantic mutation written on that build's own code.
- A's first pass missed two adaptations, so I re-adapted them faithfully (`plants-A-r2.py`, 2/2 caught):
  - 58 is an equivalent mutant on A, because A's own undefined-parent guard still returns `[]`.
  - 36 had dropped only the default check. That narrower mutant is a kit-wide gap (Q57 below).
- On B, plants 31 and 58 also bypass B's stack reset and its missing-parent throw (noted in their names).
- **New plants missed by the kit tests on every build** (G1 must-fix, closed by the pin; `plants-P-gap.log`, `plants-gap-AB.log`, `pin-check.log`):
  - **Q56** dice clamps the ±25 % ends before ordering them, so a negative value can leave the format range. This is ChatB's live code. Missed on P and A.
  - **Q57** `valuesOf` returns a `source: "default"` answer that holds a value. Missed on P, A and B.
  - With `effect-e5-qa5.test.ts`, both are caught on P and A (4/4). The pin fails on ChatB as it stands, because Q56 is B's bug.

## Behaviour parity vs proto `dd29f737` (probes `probes/ruled.ts`, `probes/fuzz.ts`, `probes/bend.ts`)
Ruled-point probes, with PASS counts: proto 68/68, **ChatA 66/68**, ChatB 56/68.
| Point | ChatA | ChatB |
|---|---|---|
| S1 junk ops dropped, never crash; Q50 (2.5/NaN/Inf seq) | ok | ok |
| S2 proto names skipped by write/undo/redo; Q51 | ok | ok |
| S3 non-record items dropped; S4 group refusal; Q54 | ok | ok |
| S5 redo skips compacted entries | ok (same ops as proto) | values ok; logs an extra `redo` op for the skipped entry (`[4 undo 1][5 redo 1][6 redo 2]` vs proto `[3 undo 2][4 undo 1][5 redo 2]`) |
| S6 / Q55 Breed null-drop, caller indices | ok | ok |
| history.cap clamp 1–200 | ok on write and export | ok on write; **export of a doc keeps the raw cap** (1e6, 0, −3, 2.5, "9", 201, Inf→null) |
| S8 refused group undo = same doc object | ok | ok |
| dice ±1 never 0, in range | ok | ok |
| dice ±25 % inside the format range | ok | **FAIL**: `bend −2.4` rolls to as low as −3.12 (1844/4000 steps out of range through `roll`) |
| Export clean (from, parts#items, ops, baseSeq) | ok | ok |
| no-op write = same doc | ok for writer-made answers; **not** when a stored answer has another key order or an extra field | same as A |

- In the differential fuzz (1500 sessions, clean and junk), the clean-input differences are as follows. None changes a ruled outcome except those listed in the table above.
  - The orphan `answer` when there was no `steps` answer: proto `null`, A `{source:"default"}`, B `{source:"default",rev:0}`.
  - The colour-dice hash keys. Ruling 9 names none, so the ramp choices differ.
  - B leaves `orphans` absent on a first write.
  - B's `readHouse({effectHouse: undefined})` gives `invalidValue`.

## Build law (both)
- One clock: neither build uses `Math.random`, `Date`, timers or wall time. There are no copied BTF trees and no `Card`/`Deck`/hp/mana/cost names.
- The only pipes are `hash32`, `fx-doc`, `notice` (type), `fit`, `merge` and `parts`. Deps are 116/373, and runtime/sim/core/fx are untouched.
- There is no editor code in runtime and no scope creep. Law 13 bounds hold: the mint fallback is bounded, the strip is ≤ 6, and Breed returns 6.

## Must-fix
- **ChatA (pick):** none in code. **G1:** adopt the QA pin `3bca4d7d` (Q56/Q57; the kit tests miss both on every build).
- **ChatB (rejected):**
  - **M-B1**: dice clamps before ordering (`a = max(min, v·0.75)`, `b = min(max, v·1.25)`), so negatives leave the format range (ruling 8: "never outside min/max"; step goal 2).
  - **M-B2**: §0.6. The writer and dice/Breed helpers never reported ("rerun had not reported by hand-back"); only house has a helper verdict. The builder's self-check claims that "rollValue window … all five hold", which is false (M-B1). The rule is that missing means REJECT.

## Should-fix
- **Both:** a no-op `write` on an answer stored with another key order or an extra field logs one op and bumps rev. This breaks ruling 5's "same document" on loaded docs. ChatA's helper disclosed it, and it self-heals after one write. Compare states key-order-free.
- **ChatB:**
  - `exportEffect(clean)` keeps a junk or absent `history.cap` instead of the clamped one (ruled cap point).
  - Redo appends `redo` ops for compacted entries. This adds ops and rev, and the ruling says such entries are skipped.

## Report-only
These apply to both builds unless one is named:
- `canonStep` renames `start_at`, `particle_life` and `radius_*`/`ring_thickness_px` whatever the value type (proto: numbers only; ruling 3 is silent).
- `flash_seconds` NaN/Infinity becomes a non-finite `flash_ms`.
- The strings `"true"`/`"false"` in `smear_remnant` are kept.
- An `undefined` (out-of-type) Breed parent: A silently returns 2 children; B throws.
- A non-integer stored `baseSeq` is normalised to 0 by A; the proto and B can mint a 2.5-style seq.
- ChatA's handback is complete: 6 files, three helpers with verdicts. Its dice helper found and fixed exactly M-B1.

## Conduct
**Flag against ChatB**: CoS reports that ChatB trashed ChatA's Drive copies of its handback. The local copies under `/workspace/share/step-ed-e5/chatA/` are intact, and I checked them (bundle sha and verify above). I did not touch Drive. This is recorded for CoS/EA, and it has no bearing on the code verdict, which stands on M-B1 and M-B2.

## Refs made (all `refs/cmp/*`, local only)
- `ede5-chatA` `632cfbb9`
- `ede5-chatB` `c8d093cb`
- `ede5-qa-pin-a` `3bca4d7d`
- `ede5-merge-chatA` `dcba8be8`
- `ede5-merge-chatB` `3cf04e41`
- `ede5-merge-pin-a` `1cb25e87`
