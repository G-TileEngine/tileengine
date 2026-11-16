# Step ED-E1 kit review (Effect Designer E1: converter, variant_seed, parts/flatten/Fit)

QA & Build Guard · 2026-11-16 04:00 Europe/London (GMT). Base `71b1a990`; main is now `3c969024` (S0 kit docs only: `src/`, `tools/`, `tests/` are identical between the two, so every gate below compares against `71b1a990` and holds for main). Inputs copied to `docs/qa/qa-runs/effect-designer/e1/in/` (scratch-ea and share originals untouched). Outputs are in `…/e1/out/`, probes in `…/e1/probes/`, TMPDIR under `…/e1/`. The bundle was fetched to a new ref only: `refs/cmp/sede1-qa2-proto` = `927df645` (the same commit as the existing `refs/cmp/sede1-proto`). No GitHub writes, no EA file edited.

## Verdict: **OK TO SEND, with the QA pin adopted.** Fix ref `refs/cmp/sede1-qa2-fix-a` = `e50e98a00c4721ac6be7a9b8d5d2a85c7bbf4ab8`

No product must-fix. The product does the right thing on every QA plant. But the 9 kit tests miss **8 of my 20 QA plants**, and each miss is a must-fix. All 8 are fixed by one QA test file, shipped beside the kit tests (G6 style, same as S0). There is one should-fix (S1, a dangling `connect_step` in Fit), and it does not block.

```
refs/cmp/sede1-qa2-fix-a  e50e98a00c4721ac6be7a9b8d5d2a85c7bbf4ab8  (parent proto 927df645, noreply author+committer)
tree                      087fdcc3…
file                      tests/editor/effect-e1-qa2.test.ts  35 lines (cap 37)  sha256 fe03968e117398ed6bb87b9a1e554b669e8be056f9b2d878f00318dbc3a879d6
green                     753/0 (751 + 2); typecheck, lint, deps, check:state, check:law exit 0
plants on the fix ref     EA 27/27, QA 20/20
size with the pin         249 + 35 = 284 changed lines (< 400)
merge-tree onto 3c969024  proto 870aae9723ca957d3b55f5bb43fbca96b780b5fa · fix 4106c8a0179a5132df6a5ab3b57dc477765d51d5 · both clean
```

If the pin is adopted, the floor becomes **753** (step Gates say 751) and the kit push list gains one line. The earlier `refs/cmp/ede1-fix-a` (`3a0510c`, 28 lines, from a previous QA pass) was **not overwritten**. It misses Q1, Q8 and Q16 (17/20, `out/plants-qa2-prev-ede1-fix-a.log`), so it is superseded by `sede1-qa2-fix-a`. It also merges cleanly with the S0 pick: S0 `seds0b-A-fix-a` + this fix → tree `05dead45…`.

## EA's claims, checked

| Claim | Result |
|---|---|
| Bundle `0e27ac93…`, step doc `35379632…`, push list `041603f8…` | ✓ all three; every push-list file sha matches the proto tree |
| Commit identity | `G-TileEngine <G-TileEngine@users.noreply.github.com>` author and committer, parent `71b1a990` |
| Size | 7 files, +244/−5 = **249**. src 154 (fit 52, parts 42, fx-doc 48, fx-live 5/5, fx-particles 2), tests 95 (62 + 33). Each file within its cap |
| Shipped tests | `fx-doc.test` 3 + `effect-e1.test` 6 = 9, byte-identical to the push list |
| Green | 751/0/0/0/0/0; all gates exit 0; deps **110 modules / 352 deps**; `check:law OK (src)` |
| Pins / protected | `1e5dd82c d7f64a09 45a3dbaa 4d7bbf48 d6d08696` unchanged (core-types `d6d08696`). The "Do not touch" list diff is empty, including the scene and render fence tests |
| Scope sha | brief and step doc name `cb3cba1e` = my copy ✓. CN-020 (`9a73b99c`) and CN-021 (`d63ea816`) cite r4 `e77b396e`; EA's note is correct, and I found no conflict in §4/§7/§8 |
| Scene fence | `src/runtime/scene/` still holds only `world-scene.ts`; fx-doc sits in render (same-folder imports only) |
| Device page | build + `check ok`, 33 files = main; no `src/editor`, no `fx-doc` shipped |

**Deps rule (runtime must NOT import `src/editor`): holds.** The import graph has zero runtime → editor edges. Editor → runtime/render and editor → `core/notice.ts` (type only) are the only cross edges. Note that `.dependency-cruiser.cjs` has **no explicit** "runtime ↛ editor" rule. The rule is enforced today by the render fence (step 27) and the scene fence (step 31) tests. Plants Q17 (render → editor) and Q18 (scene → editor) are both caught by those fences, so nothing is open, but a new runtime folder outside those two fences would not be covered. Carry: add a depcruise rule when `.dependency-cruiser.cjs` next opens (it is pinned here).

## Determinism (absent seed = today's bytes)

- **Particles:** `probes/seed-scene.mjs` builds the same 13-step particle effect through the scene. Hash `1af40584002c780b`, 7205 dots, is identical for **main (absent)**, **proto (absent)** and **proto (`variant_seed: 0`)**. Seed 5 gives `8d9ed1f6…`, which differs as it should. The fold is `hash32(mapSeed, e.id, i, vs.seed)` with seed 0 equal to the old call. Logs: `out/seed-scene-{main,proto}.log`.
- **Bad seeds** play 0, and the link dedupes to one notice. `outOfRange`: −1, 2.5, 2³¹, NaN, Infinity. `invalidValue`: `"5"`, `true`, `[5]`, `null`, `{}`.
- **L1/smoke, sims, stress:** smoke `0 failed`, identical to `71b1a990` (apart from the pid); sims 48/2 `afc89d56…` and 22/28 `b8007292…` on both; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 on both (`out/{smoke,sim,stress}-{p,m71}.log`).

## Law, including Law 13

One clock and one rAF are untouched (no page or driver file changed). No `Math.random`, `Date`, timers, `Card`/`Deck`, or hp/mana/cost in the diff. **Law 13 (bounded memory, no hidden caches):** no module-level mutable state was added (only constant tables). fit, parts and fx-doc use only call-local `Set`/`Map`/arrays sized by the input (≤ 12 steps kept, ≤ 48 particles), and the variant_seed notice is pushed once per effect per frame and deduped by world-scene's existing per-link `prior` set. ✓

## Plants

`probes/qa-sede1-plants.py` (`afb49dcb`) reruns EA's 27 needles from my copy of `ede1-plants.py` and adds 20 QA plants (Q1–Q18, with Q13 split a/b/c), on a scratch copy of the proto.

- **EA 27/27 caught** (independent rerun; this matches `ede1-plants-result.txt`).
- **QA 12/20 on the proto.** Caught: Q3–Q7, Q10, Q11, Q13a, Q13b, Q14, Q17, Q18. **MISSED (must-fix, now pinned):**

| # | Plant | Pin in `effect-e1-qa2.test.ts` |
|---|---|---|
| Q1 | seed 0 treated as bad | `variantSeed(0)` → `{seed 0, code null}` |
| Q2 | NaN coded `invalidValue` | NaN/Infinity → `outOfRange` |
| Q8 | seed folded into the first particle piece only | the seed changes the dots of a lone particle piece at index 0…3 |
| Q9 | Fit "spread" at exactly 0 | jitter/start_spread/size_spread = 0 are not spread (`Still 13 steps…`) |
| Q12 | a part naming several beats uses its first beat | a multi-beat part infers cast/hit/linger by timing |
| Q13c | only the first `noPicture` noted | notes for steps[0] and steps[2], both skipped, 1 piece left |
| Q15 | seed note per piece, not once per effect | 1 note for 1 effect × 3 pieces; 2 for two bad effects; 0 for seed 0 |
| Q16 | converter mutates its input | `docToLiveFx` and `fit` leave the input doc JSON unchanged |

Logs: `out/plants-qa2-proto.log`, `out/plants-qa2-fix.log` (27/27 + 20/20).

## Rulings (a)–(g), against scope `cb3cba1e` and CN-020/021

- **(a) Bad `variant_seed` at play time plays 0. A wrong JS type gives `invalidValue`, and a number outside 0…2³¹−1 or not an integer gives `outOfRange`: agree.** This is CN-021 rule 3 (never throw, never clamp silently), and it matches the H2 style. Note that the link dedupes the note across effects and the message carries no effect id. That is the same convention as `pixel_scale`, and it is acceptable for E1. E3's messages panel should add the id.
- **(b) Spread = `jitter`, `start_spread` or `size_spread` strictly > 0: agree.** Exactly 0 now has a test (Q9).
- **(c) Weight = len × (particles / 12) for particle steps, else len: agree.** 12 = `PARTICLES.count`, the default per-step count, so a default particle step weighs the same as a non-particle step. Nit: disabled steps are still weighted by len. They play nothing, so they should go first. This is minor and carried to E4.
- **(d) Beat = the part's beat when it names exactly one, else from timing (before hit = cast, hit = hit, after = linger): agree for E1, with a carry.** `beatOf` is **index-based**, not time-based. An `at-time` step starting at 0 that is listed after the hit counts as "linger", and `at-hit` steps count as "linger", while scope §4.1 says Hit = at-hit (`out/fit-edges.log`: `h@0=hit early@0=linger imp@276=linger`). This only affects which step Fit drops first, never the hit or the cap. Carry to E4, where Mix per beat makes the beat matter.
- **(e) The hit is pinned by id before any drop, and dropping a base `after-last` step moves later base steps earlier: agree, with S1 below.**
- **(f) Mix feeds only the seed in E1, and the base keeps its knobs: agree.** This fits the scope's E1/E4 split (§4.2 rules 2–3 land in E4). E4 must replace "base keeps knobs" with punch max-per-knob and add Mix scaling. The step's carries already list both.
- **(g) `noPicture`: warn and skip, never throw: agree.** Every such step is now pinned (Q13c). Two follow-ups: particle steps whose part has a picture sheet are skipped too (sheet null today), so X7 (picture on particles) is **not closed in E1**. Make it an explicit carry to the engine-data step. Also, `sheetOf` returning null for every stock sheet means any real doc with a picture part plays only its non-picture pieces until that step.

## Should-fix S1 (product drift from ruling 10 / (e))

`fit()` pins `connect_step` only when it is absent or `""`. A **dangling** id (`"nope"`) is kept as is, so Fit pins nothing. When a pre-hit trail step is then dropped, the effective hit (the fallback, the last step) moves from `t11` to `t12` (`out/fit-edges.log`: `hit t11@3576 → t12@3576`). With the id absent, the hit stays `t11`. Ruling 10 says "the hit is pinned before any drop". `flatten` always passes a valid id, so this cannot happen through flatten in E1, which is why it is not a must-fix. Fix (≈ 2 lines): treat a `connect_step` that names no step like an absent one before pinning. Target E1 r2 if EA reissues, else E4.

## Step doc ↔ code drift

- Gates name 751. With the pin the floor is 753, and the push list needs the QA file line.
- Ruling 10 "pinned before any drop" vs the dangling-id case (S1).
- Ruling 10 beat "from timing" vs index order in `beatOf` ((d)).
- Ruling 11 / scope R1: scope R1 places the converter in the scene layer, but the code has `fx-doc.ts` in render. The step doc says so and gives the fence reason. Justified, not drift.
- Everything else matched: the interfaces block is quoted exactly, the r29 defaults (0.48 s, connect 0.92), the blend-seed formula and snap set, `writeSeed(0)` → absent, the `mint("s-"/"p-")` ids and `from.rev`, and the 4 Fit message strings.

## Nits

- `variantSeed(-0)` returns seed `-0`. This is harmless, because `hash32(-0) === hash32(0)` and `writeSeed(-0)` stores absent. Left out of the pin on purpose.
- The variant_seed notice has no effect id (see (a)).
- Disabled steps are weighted (see (c)).
- Runtime ↛ editor has no explicit depcruise rule (fence-enforced only).
- A §0.6 helpers section is not applicable to a kit proto (there is no builder HANDBACK yet). Gate line 187 requires it at hand-back.

## Doc
This file. Probes and logs are under `docs/qa/qa-runs/effect-designer/e1/`. Nothing pushed.
