# Step ED-E1 builds A/B (converter, seed, parts, Fit): QA pick

QA & Build Guard · 2026-11-16 09:18 Europe/London (GMT). Kit: step doc `handoff/steps/step-ed-e1-converter-seed.md` `ac4a8494…` on main `56cbf486`; base `3c969024`; main now `649fbc89`. Builds read from the clone refs CoS named (`refs/cmp/step-ed-e1-chatA-2`, `refs/cmp/step-ed-e1-chatB`). Kit proto r2 `5db8cea9` fetched from a qa-runs copy of `step-ed-e1-proto-r2.bundle` to `refs/cmp/ede1b-proto/heads/ede1`. Work trees and TMPDIR under `qa-runs/ede1b/` and `qa-runs/t/`. Evidence in `docs/qa/qa-runs/effect-designer/e1b/`. No GitHub writes, no EA file edited, no existing ref moved.

Confirmed: `refs/cmp/step-ed-e1-chatA` and `refs/cmp/step-ed-e1-converter-seed-chatA` both point at ChatB's tip `05939021`. They are mislabelled; don't use them.

## Pick: **ChatA-2**, but **NOT OK TO OPEN PR yet**

Why ChatA-2: both builds pass the hard gates, but B has three spec bugs and A2 has two. All of A2's are small and in one place:
- B reports a **false provenance cycle** whenever a source has two parts from the same acyclic effect. A2 gets this right.
- B's pieces drop **both `hold_ms` and `fade_out_ms`**. Ruling 2 says the fade extends the piece.
- B's `blendSeed` uses raw seeds (−1 and 2.5 are not read as 0, against ruling 5), and B doesn't note an out-of-range `connect`.

A2 still has **two must-fix src bugs** that the kit tests don't catch. One QA test pins them, and I've drafted a 2-file patch, below. Once the patch is applied (builder r2 or an EA patch) and the QA test is adopted (G6), A2 is OK TO OPEN PR.

### Must-fix (A2)
1. **M1: a piece's `ms` drops `hold_ms`.** `fx-doc.ts` sets `ms = len + fade`. Per r29 §2.10.1.2, `hold_ms` is "how long the step stays on its last frame after its length", so the piece should last len + hold + fade. That is what the proto does (`ends − at`). A step with a hold, including the UX "Keep until the effect ends" shortcut, disappears at `len`. Repro: stamp 0.3 s, hold 200, fade 100. Proto gives 600, A2 gives 400 and B gives 300.
2. **M2: `flatten` doesn't run Fit and ignores `preset`.** Scope §4 rule 4 says "Budgets are enforced while you merge". The proto calls `fit()` at the end of `flatten`, and the quoted interface takes `preset?` for that reason. A2's HANDBACK states this as a deviation ("ruling 9 does not fit"). Repro: flatten two 8-step docs with 20 sparks each. Proto and B give 12 steps, 36 sparks and the lines `Scaled sparks 320 → 48 to fit 48` and `Trimmed 4 linger steps to fit`. A2 gives 16 steps, 320 sparks and no lines. With `preset: true` and 20+20 sparks, proto gives 16/16 and A2 gives 20/20. If EA would rather have the caller run Fit, EA must amend ruling 9 and drop `preset` from the `flatten` signature. Otherwise this stays a must-fix.
3. **G1: four QA plants are missed by the shipped tests on A2.** Each one is A2-correct behaviour that the kit doesn't pin:
   - Q19: shared source shown as a cycle (B's walk).
   - Q20: piece `ms` drops the fade (B).
   - Q22: no note for an out-of-range `connect`.
   - Q23: `blendSeed` uses raw seeds.

   The QA test below pins all four.

### Should-fix (A2)
- **`hold_ms` isn't clamped.** −500 gives starts `[0, −200]`. r29's range is 0–20000, and the proto and B clamp it. This is in the patch and pinned by the test.
- **A2 forces an `at-time` first step to 0.** That follows the step doc's ruling 2 ("The first step starts at 0") literally. r29 says only `after-last` and `with-last` first steps start at 0, while `at-time` starts at `start_at_ms`. The proto and B follow r29. EA ruling needed; see Drift.
- **HANDBACK §0.6 is thin.** It's present, but the "editor" helper was stopped after about 12 minutes without reporting, and the builder's own probe stands in for it. Flagged, not a reject.

### Nits (A2, report only)
- `fromInfo` reports a self-reference to an unsaved self as `cycle`, where the proto says `removed`. A loop past the source (X→Y→X, not via S) is `cycle` in both builds but `current` in the proto. Neither case is pinned. Both builds' answers are defensible.

## QA fix ref
```
refs/cmp/ede1b-qa3-fix-a  c5287120987ab87e161f4776f1d95b576cab1b89  (parent ChatA-2 tip 0853f228; G-TileEngine noreply author+committer)
tree                      c416369815cffe619facfb0a5b18faffa2483f83
file                      tests/editor/effect-e1-qa3.test.ts  33 lines (cap 37)  sha256 976731969c4031dce05a40913e686dab3cbe2741ecdb1789bd7d9154cad0ab4a
merge-tree onto 649fbc89  1c70780501f26417c007c91ed3d83b9b772a7c41 (clean)
```
The three tests:
1. Provenance: shared and diamond sources are `current`; a loop back to self and a self-loop are `cycle`.
2. Converter: piece `ms` = len + hold + fade (fade on dim/stamp only); out-of-range `connect` is noted; `hold_ms` clamps to 0.
3. Merge: `blendSeed` reads seeds through `variantSeed`; `flatten` runs Fit, including the preset cap and its lines.

Results:

| Tree | QA3 | Full suite |
|---|---|---|
| Proto `5db8cea9` | 3/3 | – |
| A2 `0853f228` (the fix ref as is) | 1/3, by design: tests 2 and 3 are M1 and M2 | 754/2 |
| A2 + src patch | 3/3 | **756/0** |
| B | 0/3 | – |

On A2 + src patch, typecheck, lint, deps (110/352), check:law, smoke 0 failed, and sim `afc89d56…`/`b8007292…` are all unchanged.

**Src patch (for the builder r2 or EA; not on any ref):** `docs/qa/qa-runs/effect-designer/e1b/a2-src-proposal.diff` (sha256 `7cb02e84…`; `patch -p1` from a build root reproduces the tested tree exactly). Three edits, no line growth: fx-doc stays 56 lines, fit stays 65/65.
- `fx-doc.ts`: `holds.push(clampMs(num(s["hold_ms"]) ?? 0))`.
- `fx-doc.ts`: piece `ms: (timing.ends[i] ?? 0) - (timing.starts[i] ?? 0)`, with the now-unused fade local dropped.
- `fit.ts`: `flatten` ends with `const done = fit(doc, [...baseSteps.map((): Side => "base"), ...moved.map((): Side => "other")], o.preset === true ? { preset: true } : {}); return { doc: done.doc, messages: [...messages, ...done.messages] };`

Plants on A2 + patch + QA3: **EA 28/28** (EA's 27 plus 8b), **QA 27/27**. That covers Q1–Q18 and Q22–Q23, Q19 and Q20 (B's bugs planted into A2), and Q21, Q24 and Q25 (patch reverted piece by piece).

Size: 314 + 33 = **347** changed lines (150–400 band). Every file stays within its step-doc cap.

## Both builds: checks

| Check | ChatA-2 `0853f228` | ChatB `05939021` |
|---|---|---|
| Tip / tree | `0853f228` / `85779ba3` (3 commits: `dbb5ed1`, then `eaa7656` the cycle fix, then handback) | `05939021` / `78cd3d6b` (2 commits) |
| Parent chain / noreply | starts at `3c969024`; all noreply | same |
| Lines (excl. handback) | 314 (src 184, tests 130) | 313 (src 183, tests 130) |
| Per-file caps | 56/1/7/55/65 within 60/4/12/55/65 | 59/3/7/53/61 within caps |
| Merge-tree onto `649fbc89` | clean, `cd9494e3` (matches CoS) | clean, `e9e41380` (matches CoS) |
| Kit files | all 3 byte-identical (`197a8733`, `9f54691b`, `fe03968e`) | same |
| Pins / protected paths | 5 pins empty diff; no do-not-touch paths | same |
| Green | 753/0; typecheck, lint, deps 110/352, state, law exit 0 | 753/0; same, deps 110/351 |
| Smoke / sim / stress vs main | 0 failed; sims SAME; stress SAME | same |
| Law | no Math.random/Date/timers/rAF/Card/Deck/hp/mana/cost; no runtime → `src/editor` import (export audit clean); per-call Sets/Maps only (Law 13 ok) | same |
| EA plants (re-needled per build) | 28/28 | 28/28 |
| QA plants (shipped tests only) | 20/24: misses Q19, Q20, Q22, Q23 | 19/21: misses Q11 (hit index for >12 steps isn't pinned on B's path) and Q21 (flatten skipping Fit); Q22 and Q23 are already B's behaviour |
| QA probe (`probe.log`) | M1, M2, `hold_ms` −500 unclamped | false cycle (shared and deep-shared); `ms` drops hold and fade; no `connect` note; `blendSeed` raw; unknown `light_mode` counted lit; `changed` outranks `cycle`; non-object steps keep a slot |
| HANDBACK §0.6 | present, thin (1 of 3 helpers didn't report) | present, thinner (2 of 3 didn't report) |

CoS's key claim is **verified independently**:
- Shared source X (two parts from Y): A2 `current`, B **`cycle`**, proto `current`.
- Deep shared source (X→Y,W and Y→W): A2 `current`, B **`cycle`**.
- Diamond: both `current`.
- Real loop S→X→S and saved self-loop: both `cycle`.

## Drift (docs vs code) for EA
- **Ruling 2** says "The first step starts at 0". r29 and the proto say that only for `after-last`/`with-last`; `at-time` starts at `start_at_ms`. Suggest: "A first `after-last` or `with-last` step starts at 0; `at-time` starts at `start_at_ms`."
- **Ruling 2** doesn't say what a piece's duration is. Suggest adding: "A piece lasts len + `hold_ms` + `fade_out_ms` (= `ends − starts`)."
- **Ruling 9** doesn't say that `flatten` runs Fit, though the signature has `preset`. Suggest adding: "flatten ends with `fit()` (preset → 32) and returns its lines after the retime lines."
- Ruling 7 doesn't set an order when a source is both `changed` and `cycle` (A2 and proto say cycle, B says changed). Not pinned; E3 badge carry.

## Repro
```
cd /workspace/tileengine-repo; export COS_TMP=$PWD/qa-runs/t TMPDIR=$PWD/qa-runs/t   # short path: see cos-tools note 1
/workspace/cos-tools/qa-headcheck.sh refs/cmp/step-ed-e1-chatA-2 3c969024 --name ede1b-hc-A2
/workspace/cos-tools/qa-gates.sh refs/cmp/step-ed-e1-chatA-2 --floor 753 --main 649fbc89
E=/workspace/tileengine/docs/qa/qa-runs/effect-designer/e1b; mkdir -p qa-runs/x && git archive 0853f228 | tar -x -C qa-runs/x && (cd qa-runs/x && npm ci)
cp $E/probe-ede1b.ts qa-runs/x/tests/qa-probe.ts && (cd qa-runs/x && node tests/qa-probe.ts && rm tests/qa-probe.ts)
python3 $E/qa-ede1b-plants.py qa-runs/x A2                     # 28/28, 20/24 (Q19 Q20 Q22 Q23 MISSED)
git show refs/cmp/ede1b-qa3-fix-a:tests/editor/effect-e1-qa3.test.ts > qa-runs/x/tests/editor/effect-e1-qa3.test.ts
(cd qa-runs/x && node --test tests/editor/effect-e1-qa3.test.ts)   # 1/3 (M1, M2)
(cd qa-runs/x && patch -p1 < $E/a2-src-proposal.diff && npm test)  # 756/0
python3 $E/qa-ede1b-plants.py qa-runs/x A2s tests/editor/effect-e1-qa3.test.ts   # 28/28, 27/27
```
Same for B with `05939021` and `B` as the plant build name.

## cos-tools notes (script issues hit)
1. **`qa-gates.sh` smoke gives a false FAIL when `COS_TMP` is long.** Chrome aborts with "Socket path too long … SingletonSocket", so smoke prints no `smoke:` line. The ref and main both fail and the table says `SAME`/FAIL. Re-run with `COS_TMP=…/qa-runs/t` and it passes: smoke 0 failed on both builds and main. Suggest a short `mktemp -d /tmp/s-XXXX` for the smoke TMPDIR only, and printing the first error line when there's no smoke line.
2. **`qa-headcheck.sh`/`qa-gates.sh` force-fetch `refs/cmp/main`**, a shared ref, on every run. Harmless here because it stayed `649fbc89`, but it conflicts with the "never move existing refs" rule. Suggest a per-run ref (`refs/cmp/main-<pid>`) or the `--shared` /tmp clone that `vlib.sh` uses.
3. **`qa-plants.sh` can't take EA's `ede1-plants.py` as is for builds.** The needles are the proto's source text, so every build needs its own needles. That's not a script bug, but a `--needles-for <build>` convention would help.
