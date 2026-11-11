# Step 13 lean review (chaos generators, gestures, simple shrink; chaos step C)

**Date:** 2026-11-11 13:44 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-13-chaos-generators.md` sha256 `3ec1317fd5135ae7643eb8adcb0c398263f53b5ff1dccdacc95add81402755ee` (175 lines)
**Backup of this sha:** `/workspace/qa-runs/s13-review/step-13-3ec1317f.md`
**Base:** `9dad92a589ec53d71aa1564916a43dcd439e883d` — confirmed `origin/main` / clone HEAD (PR #17 merge of step 12; parents `dcd3132` and `3c6da4f`). Clone was fetched to confirm; working tree left untouched.
**CN:** none. depcruise pin `dcf61c61…`, core-types pin `f00c722c…`, and `package.json` `1e5dd82c…` hold on both the base and the proto.
**Kit docs:** README sha256 `f35db5e338f4edc085db84cc4053f7893bab16ecf169d429f924f97c82f3d0eb`; core-spine sha256 `7651d341c24d79ae3f7305ca3927fdf470372d27d0a8571e6bd35d9104cc625c`; chaos-player outline sha256 `ef384d2a450619d2098da1d71b1bc1ecdb96747e05fd9d08853b4bc9f4128a7e` (110 lines, unchanged). Invariants sha256 `13f93c684839217afe082faa23885596791a42c8794d77e2bd4198d140c26625` (matches the step's "Read first"). Pre-13 backups `/tmp/handoff-README-pre-13.md` (= r2 README `c1a75826…`) and `/tmp/core-spine-slices-pre-13.md` (= `b999d8df…`, already carrying EA's post-r2 step-12 row fix).
**Prototype:** `/tmp/s13-proto` was not modified (HEAD `f8e450cfad19979fa68ac9726b752aa4831557e5`, clean, branch `s13`). Fresh copy: `qa-runs/s13-review/proto` at the same commit, Node v24.22.1. Greps/plants scripts copied to `qa-runs/s13-review/` and run from there, retargeted off `/tmp` (`s13-plants.sh` otherwise `cd`s to `/tmp/s13-proto` and writes `/tmp/s13-plant-*.txt`; `s13-greps-plants.sh` hard-`cd`s to `/tmp/s13-proto` and can commit there). Plant logs: `qa-runs/s13-review/plants/` (EA) and `plants-ours/` (ours).
**Remotes:** read-only. Handoff, the step file, EA's `/tmp`, existing `refs/cmp/*`, and earlier qa-runs trees were not edited. GitHub and Drive were not touched.

## Result

**OK TO SEND** on sha `3ec1317f…` (175 lines). No blocking coverage gap and no build-law miss. Every Behaviour / "done means" line is pinned by a named test: EA's 4 engine + 25 generator + 10 shrink + 5 mapper plants each fail at least one named test, the 24 grep plants are all caught, and our extra plants ( `'ai'` stream, swapped `cell()` draw order, zero-weight still draws, partial `presets.chaosGen`, smoke `assert.equal(failed, 0)` plus an occupancy bug) fail as required. Green is 176/0, G7 is 222+/2− = **224** of 250 (under ~235, no "say so"), `chaos.ts` is untouched, pins and sim hold, and the kit and README/spine carry the CEO rulings (report-only, 25-run vetted gate later, two chaos players).

No blocking edits.

---

## Residuals (not send-blocks)

**1. Kit L42 size split typo.** The total 224 and the caps-sum 256 are right; the split is not. Measured on `9dad92a..f8e450c` (excl. handback/lock) is **222 insertions, 2 deletions = 224** (`types.ts` 8+1, `index.ts` 3+1). L42 currently says "223 insertions, 1 deletion = 224".

Exact replacement for the parenthetical in L42:

> (prototype: 222 insertions, 2 deletions = 224)

**2. A dead `?? 1` after `checkGen` stays 176/0.** Behaviour 1 already requires every mix key and finite ≥ 0 weights, and the settings test throws on a missing key / all-zero / negative / NaN. `const weights = CHAOS_KINDS.map((k) => gen.mix[k] ?? 1)` is therefore unreachable and the no-numbers grep allows `0` and `1` by design. A live default (`|| 1`, so a zero weight still draws) **is** caught by the per-kind test. Not a miss.

**3. Outline §7 is stale.** See ruling (b). Not a send-block; README and core-spine already name the merged A/B/C ids.

**4. Swapped `cell()` draw order is not caught by the identity pin, but is caught.** `{ r: rng.int(rows), c: rng.int(cols) }` (row drawn first) still satisfies the 198 moves / 88 rejects / first-move `merchant#6#` pin; the shrink test fails it (116 moves, `tries` 15, and the exact `TargetCell (0, 5)` path). Behaviour's "column drawn first" line is tested.

---

## 1. Shas / line counts / Base / kit — PASS

| Check | Result |
|---|---|
| Step sha / lines | `3ec1317f…`, **175** lines, matches EA |
| Base | `9dad92a` is `origin/main` (PR #17, parents `dcd3132` + `3c6da4f`) |
| Pins | core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock unchanged, all identical to base |
| CN | none, as claimed |
| Kit shas | README `f35db5e3…`, core-spine `7651d341…`, chaos outline `ef384d2a…` / 110 lines, as claimed. Outline byte-identical to the pre-13 (and pre-12) backup |

Kit diffs vs pre-13 backups are status/table/verification only. README: 12 merged at `9dad92a` (PR #17), new 13 row (175 lines), Later is "after chaos step C: the `chaos:replay` command and failure-records folder, nightly seeds, then the dev-side exploit hunter (`docs/chaos-player-outline.md` §6, §9)", verification adds 13 on `9dad92a` 176/0 sim unchanged 224 of 250 plus the engine-plant shrink numbers and "40 generator, shrink and mapper plants", §5.2 "00–13". Core-spine: status 00–12 merged at `9dad92a`, step 13 written; the stale date-blockquote and slice-count lines were updated the same way; the step-12 row is now **merged, `9dad92a`, 258** (the earlier `~255` residual is fixed); new step-13 row `~224`.

---

## 2. Prototype `f8e450c` — PASS (green, caps, quotes, greps)

On the copy `qa-runs/s13-review/proto`, Node v24.22.1. `/tmp/s13-proto` was not touched.

| Check | Result |
|---|---|
| `tsc` / `npm run green` | exit 0; **pass 176 / fail 0 / skipped 0 / todo 0** (170 prior + 6 new generator / shrink / recipe / settings / smoke tests) |
| `npm run sim` | unchanged: 6×9 **48/2** `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, 12×12 **22/28** `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c` |
| G7 `9dad92a..f8e450c` excl. handback/lock | **5 files, 222+/2− = 224** ≤ 250 and under ~235 (no "say so"). name-status is exactly the five files (`A` chaos-gen.ts, shrink.ts, chaos-gen.test.ts; `M` types, index). DNT empty. `src/sim/chaos.ts` has an empty diff and stays at the merged 124 lines |
| Per-file caps | all hold: chaos-gen 64/72 (slack 8), shrink 38/44 (slack 6), types 9/14 (slack 5), index 4/8 (slack 4), test 109/118 (slack 9) |
| Quoted blocks | types append and the whole of `src/sim/index.ts` are **verbatim**. `CHAOS_KINDS` is the exact nine-kind list. Declarations match |
| `/workspace/qa-runs/s13-review/s13-greps.sh` (copy of `/tmp/s13-greps.sh`) | **ALL OK** |
| Grep plants (`s13-greps-plants-run.sh` on the copy) | **24/24 caught**, tree left clean at `f8e450c` |
| Smoke diagnostics | step-12 still `chaos smoke stage-fixed seeds 1-50: runs 50 failed 0 steps 3120 rejects 0` and `stage-weighted` `failed 0 steps 5542 rejects 0`. Generator: `chaos gen smoke stage-fixed seeds 1-20: runs 20 failed 0 steps 1730 rejects 278 shrunk 0->0` and `stage-weighted` `failed 0 steps 3154 rejects 563 shrunk 0->0` |

---

## 3. Kit vs code, plants, build law — PASS

Every Behaviour 1–7 line and every "Tests that prove it is done" bullet is in `tests/sim/chaos-gen.test.ts` and is hit by a plant. `chaosIntents(gen, legal)` has nine kinds with caller weights, no defaults in `src`, swarm mix in the test, own `'chaos'` stream via `streamSeed`, draw order pinned, `runChaosGen` writes `presets.chaosGen`. Shrink is ddmin over move groups, a fresh `runChaos` per candidate, `serve` by original side and call-group, keep only if both `invariant` and `firstDivergentSnapshotKey` match the *input* record, initial and final `replayChaos` checks, no retry.

### EA code plants (reverted; run on the copy)

Engine plants match the kit table. The generator smoke itself **passes** under every engine plant (report-only) and prints each record with its shrink:

| Plant | Smoke records (all 40 gen runs) and shrink | Gen smoke test | Tests that fail (of 176) |
|---|---|---|---|
| P1 `moveTo` keeps the old cell | `(a)1` `occupancy`; 2–12 moves, every one shrunk to 2 (`76->40` per board) | passes | **13**: step-12's three, this step's generator / kinds / shrink (not settings, recipe or smoke) + 7 existing |
| P2 `lastSeq` skips (0, 2, 3, …) | `(a)12` `logSeq`; 2–12 → 2 (`70->40`) | passes | **12**: step-12's three, this step's three + 6 existing |
| P3 `land` one tick short | `(a)9` `units`; 4–14 → 4 (`116->80`) | passes | **10**: step-12's two, this step's three + 5 existing |
| P4 `lastSeq` skips once 12 entries exist | `(a)12` `logSeq`; 24–42 → 24 (`586->480`, `602->480`) | passes | **4**: step-12's clean run and three of this step's |

Generator plants G1–G25, shrink plants S1–S10 and mapper plants M1–M5 each fail a named test, as claimed. Notable:

- G3 (draws on `world.rng`) is the one generator plant that also fails the **smoke** test, because that record does not replay (kit already says this). Step-12's non-generator smoke stayed `failed 0`.
- G12 (gesture batch skips the mapper) fails the kinds / generator / shrink tests.
- S1 (key ignored) and S2 (invariant ignored) are the two directions of "keep only if both match".
- S3 / S4 skip the first / final replay check; S5 retries each candidate; S6 serves a move to the wrong side. All fail the shrink test.
- M1–M5 (second down re-owns, far wins over held, hold strict, far-at-equal, cancel keeps owner) each fail the recipe test, so the (a)10 edges are pinned without a live chaos check.

### Our plants (reverted; run on the copy)

| Plant | Result |
|---|---|
| Q1 hardcode stream `"ai"` instead of `gen.stream` | **173/3**: generator identity, kinds, shrink |
| Q2 `cell()` draws `r` then `c` | **175/1**: shrink test (identity pin still holds; see residual 4) |
| Q3 `gen.mix[k] \|\| 1` (a zero weight still draws) | **175/1**: kinds test |
| Q4 `gen.mix[k] ?? 1` (dead default after `checkGen`) | **176/0** (see residual 2) |
| Q5 `presets.chaosGen` only `{ stream, mix, burst }` | **175/1**: generator identity (`presets` deep-equals the full `gen`) |
| Q6 `assert.equal(failed, 0)` in the smoke, clean engine | **176/0** (the assert is a no-op on a clean run) |
| Q6b that assert **plus** P1 occupancy | **162/14**, and the **smoke test itself fails** — proof the current smoke is report-only. P1 alone left the smoke green |

G1 already covers a hardcoded `"chaos"`; G3 covers match RNG; G4 covers ignored weights; G12 / S1–S6 / S5 cover the rest of the requested list (mapper bypass, key vs invariant, skip initial/final replay, wrong-side serve, auto-retry).

### Build law

One clock; no `Date` / `performance.now` / `Math.random` / timers in `src/sim`. Moves only via the player driver / `submit` (CEO Q1): `chaos-gen.ts` and `shrink.ts` never call `submit`, `feedIntent`, `createPlayer`, `runMatch`, `moveTo` or the log. Gestures go only through a fresh `createGestureMapper` (CEO Q2; two call sites, settings check + batch). No `src/fx` or `src/btf-adapters` import in `src/sim`. BTF defaults only (CEO Q9); swarm mix and 09c gesture thresholds live in the test. Report-only (CEO Q7): two `t.diagnostic` lines in the gen smoke, never `assert` that a run is clean. No copied BTF tree. `chaos.ts` unchanged.

---

## 4. CEO rulings in the kit and docs — PASS

- **Report-only:** kit L32 and the smoke test name; Not-in-this-step L171; README Later and verification; spine step-13 row.
- **25-run vetted gate later:** kit L131, "the switch to blocking waits for 25 clean runs in a row (outline §6)". Outline §6 itself is unchanged and still carries the 11 Nov gate text.
- **Two chaos players:** kit L21 (this is the last of the three game-side steps), L24 / L132 (the dev-side exploit hunter, outline §9, reuses the generator and the shrink and is not in this step), README Later points at §6 and §9.

---

## Rulings EA asked for

**(a) Is deferring the live (a)10 gesture-ownership check acceptable?** Yes. (a)10 is a property of the pure touch mapper, not of match state, and a step-12 `CHAOS_CHECK` only sees `SimSnapshot` keys. This step still pins (a)10 behaviour: `gestureRecipes` is the five (a)10 cases (tap at exactly `tapMaxPx` and `holdMs − 1`; drag; hold of exactly `holdMs` that also moves far — held wins; first-pointer ownership with an `up` before any `down`, a second `down` from the owner and a second pointer; owner `cancel`); the recipe test asserts their mapper outputs on both a unit cell and an empty cell; M1–M5 each fail that test; the in-match `gesture` kind feeds a fresh `createGestureMapper` one of those recipes. A later fix step would add pointer samples to `ChaosMove` (a `chaos.ts` change, out of this step's Do-not-touch) so a check can replay the samples through the mapper; the record today keeps the mapper's intents, not the samples, as the kit already flags under Not in this step.

**(b) Can the stale outline §7 line wait?** Yes. The stale sentence, unchanged at `ef384d2a…`, is:

> The usual cap is 400 changed lines per step. This is likely **three steps**: the player driver first (CEO Q1), then the two chaos steps (a fourth if one would blow the cap). Step A is `step-11-player-driver`; B and C ids follow when written. Base for the first kit is `e9d4820`.

Items 0 / 1 / 2 under it still correctly describe the player driver, the harness and the generators. The outline is a starter, not the kit; README and core-spine already name B = `step-12-chaos-harness` merged at `9dad92a` and C = `step-13-chaos-generators`. A docs-only tidy can wait until the next outline edit (ids, the first-kit base, and that C is now written). Not a send-block.

---

## Repro

```sh
# copy only; do not run the /tmp scripts against /tmp/s13-proto
cp -a /tmp/s13-proto /workspace/qa-runs/s13-review/proto
# greps (already ALL OK on the copy):
sh /workspace/qa-runs/s13-review/s13-greps.sh /workspace/qa-runs/s13-review/proto
# code plants (retargeted script writes logs under qa-runs/s13-review/plants/):
sh /workspace/qa-runs/s13-review/s13-plants-run.sh /workspace/qa-runs/s13-review/proto all
# our plants: same plant() helper, anchors in src/sim/chaos-gen.ts or the smoke test,
# revert with git checkout after each; logs in qa-runs/s13-review/plants-ours/
```

The copy was left clean at `f8e450c`. `/tmp/s13-proto`, the clone, `refs/cmp/*`, and the kit files were not modified.
