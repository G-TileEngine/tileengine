# Step 12 lean review (chaos harness, chaos step B)

**Date:** 2026-11-11 12:39 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-12-chaos-harness.md` sha256 `5a247cb705baf9492f5f5fc313b94c6aaa77cb23fe61581a64a972c0868a0836` (199 lines)
**Backup of this sha:** `/workspace/qa-runs/s12-review/step-12-5a247cb7.md`
**Base:** `1ff51d984744c254321d4014afc045ce77a761a2` — confirmed `origin/main` / clone HEAD (PR #16 merge of step 11; parents `01653ee` and `8feb37b`). Clone was fetched to confirm; working tree left untouched.
**CN:** none. depcruise pin `dcf61c61…`, core-types pin `f00c722c…`, and `package.json` `1e5dd82c…` hold on both the base and the proto.
**Kit:** README sha256 `c59c4a04d30846bf5a3a47f788fe320a89e3c2ac2b11201ae8f30f7d4148b841`; core-spine sha256 `073464ae4b7c5dd27c7f1ce7e648dde988735d24d4d29614ac2bc7f7ce3deb0e`; chaos-player outline sha256 `ef384d2a450619d2098da1d71b1bc1ecdb96747e05fd9d08853b4bc9f4128a7e` (110 lines, unchanged). Invariants sha256 `13f93c684839217afe082faa23885596791a42c8794d77e2bd4198d140c26625` (matches the step's "Read first"). Pre-12 backups `/tmp/handoff-README-pre-12.md`, `/tmp/core-spine-slices-pre-12.md`, `/tmp/chaos-player-outline-pre-12.md`.
**Prototype:** `/tmp/s12-proto` was not modified (HEAD `2ab00fd5a4cb151b311cf75cbbf68cc39de3e51c`, clean). Fresh copy: `qa-runs/s12-review/proto` at the same commit, Node v24.22.1. Greps/plants scripts copied to `qa-runs/s12-review/` and run from there (`s12-plants.sh` otherwise `cd`s to `/tmp/s12-proto`).
**Remotes:** read-only. Handoff, the step file, EA's `/tmp`, existing `refs/cmp/*`, and earlier qa-runs trees were not edited. GitHub and Drive were not touched.

## Result

**NOT OK to send** on sha `5a247cb7…` (199 lines). One blocking test-coverage gap: Behaviour 3's rule that `call` is the 0-based count of hook calls across all seats, **including a stall that returns `[]`**, has no test. A plant that increments `call` only when the hook returns a non-empty list stays **170 pass / 0 fail**, and because `runChaos` / `replayChaos` share the same counter, replay still deep-equals. Everything else (shas, green, G7, pins, sim, greps, engine and harness plants, our record/replay/stepIndex plants, build law, CEO Q1 one-door, outline §4 fields, no auto-retry as specified, README / core-spine claims, rulings 1–4) checks out.

---

## Blocking fix

In `handoff/steps/step-12-chaos-harness.md`, **L128** (the “a clean run…” test bullet). After the existing `RangeError` assertions, add:

> A hook that returns `[]` on its first call and then the same `asIntents(forward(3))` path records the first move with `call: 1` (a stall that returns `[]` still counts). `replayChaos` of that run's JSON deep-equals the result.

(Verified on the proto: that run is still `win`, 76 moves, first move `{ call: 1, side: "player", tick: 1, intent: { type: "SelectUnit", unitId: "knight#1" }, aim: null }`, and the JSON replay matches. The skip-stall plant records `call: 0` and would fail this. Test-file slack is 8 lines (92/100); total 254 of 280 — no cap change.)

No other blocking edits.

---

## 1. Shas / line counts / Base / kit — PASS (aside from the test gap above)

| Check | Result |
|---|---|
| Step sha / lines | `5a247cb7…`, **199** lines, matches EA |
| Base | `1ff51d9` is `origin/main` (PR #16, parents `01653ee` + `8feb37b`) |
| Pins | core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock unchanged, all identical to base |
| CN | none, as claimed |
| Kit shas | README `c59c4a04…`, core-spine `073464ae…`, chaos outline `ef384d2a…` / 110 lines, as claimed. Outline byte-identical to the pre-12 backup |

Kit diffs vs pre-12 backups are status/table/verification only. README: 11 merged at `1ff51d9`, new 12 row (199 lines), Later points at chaos step C, verification adds 12 on `1ff51d9` 170/0 sim unchanged 254 of 280 with the three engine plants, §5.2 “00–12”. Core-spine: status 00–11 merged at `1ff51d9`, step 12 written, 11 marked merged, new 12 row (`~255`). Residual, not a block: the Nov 10 blockquote in core-spine still says “steps 00–10b … merged as of `d9ca13b`.”

---

## 2. Prototype `2ab00fd` — PASS (green, caps, quotes, greps)

On the copy `qa-runs/s12-review/proto`, Node v24.22.1. `/tmp/s12-proto` was not touched.

| Check | Result |
|---|---|
| `tsc` / `npm run green` | exit 0; **pass 170 / fail 0 / skipped 0 / todo 0** (166 prior + 4 new chaos tests) |
| `npm run sim` | unchanged: 6×9 **48/2** `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, 12×12 **22/28** `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c` |
| G7 `1ff51d9..2ab00fd` excl. handback/lock | **4 files, 253+/1− = 254** ≤ 280 and under ~265 (no “say so”). name-status is exactly the four files (`A` chaos.ts, chaos.test.ts; `M` types, index). DNT empty |
| Per-file caps | all hold, ≥ 4 slack each: chaos.ts 117/124, types 42/48, index 3/7, chaos.test 92/100 |
| Quoted blocks | types append and the whole of `src/sim/index.ts` are **verbatim**. `runChaos` / `replayChaos` / `CHAOS_CHECKS` declarations match |
| `/workspace/qa-runs/s12-review/s12-greps.sh` (copy of `/tmp/s12-greps.sh`) | **ALL OK** (size 254, all pins, one-door, no submit in `chaos.ts`, `play(` × 3, six check ids, two `t.diagnostic` only in the smoke) |
| Smoke diagnostics | `chaos smoke stage-fixed seeds 1-50: runs 50 failed 0 steps 3120 rejects 0` and `stage-weighted` `failed 0 steps 5542 rejects 0` |

### Number / name greps

The tightened no-numbers pattern now catches `10_000`, `.5`, `4e2`, `0x190`, `4_00` and `200` (all planted, then reverted). `0` and `1` still miss, by design. Renaming `createPlayer` → `createPlayerX` drops the `createPlayer(` count to 0, so the one-door grep **fails** (this is the old prefix hole closed for this file).

---

## 3. Kit vs code, plants, build law

Quotes and the four named tests match the step, except the stall-`call` line called out above. The failure record matches outline §4 and the research minimum: `invariant`, `ruleset` (id or `null`), `snapshotHash`, `engineSha`, `node`, the full `moves` list (not just the seed), expected vs actual, `tick` / `clockMs`, `engineVersion`, `projectHash`. Shrink is **not** in this step (outline §7 puts the simple shrink in step C; keyed on `invariant` + `firstDivergentSnapshotKey` is already what §5 / C will use). No auto-retry in the proto (one `runMatch(`, three `play(`; no loop).

`CHAOS_CHECKS` is exported data; the caller passes the list (no default set in `src/`); ids are stored on the record. The harness never calls `submit`, `feedIntent`, `moveTo` or the log (CEO Q1): only `createPlayer` and one `runMatch`, with `ai` throwing if asked. Time moves only inside `runMatch`. No `Date` / `performance.now` / `Math.random` / timers in `src/sim`. No fx import in `src/sim`.

### EA plants (reverted; run on the copy)

| Plant | Record from the smoke (all 100 runs) | Smoke test | Tests that fail (of 170) |
|---|---|---|---|
| `moveTo` keeps the old cell (`take` dropped) | `(a)1`, `stepIndex` 1, key `occupancy`, tick 20 | passes (report-only); each record replays identically | **10**: the three chaos mechanics tests + 7 existing |
| `lastSeq` skips (0, 2, 3, …) | `(a)12`, `stepIndex` 1, key `logSeq`, expected `[0,1,1]`, actual `[0,2,2]`, tick 20 | passes; records replay | **9**: the three mechanics tests + 6 existing |
| `land` one tick short | `(a)9`, `stepIndex` 3, key `units` (knight still in mid-move at tick 38) | passes; records replay | **7**: clean-run and planted-promise + 5 existing |

Harness plants each fail a named test: drop the `(a)1` id (clean-run and check tests), skip the build check in replay (clean-run), feed every recorded move on call 0 (clean-run), turn off the reject check (check test), skip the end-of-run replay (planted-promise test). The smoke stayed green on every plant.

### Our plants (reverted)

| Plant | Result |
|---|---|
| Check id dropped from the record (`checks` sliced) | **168/2** (clean-run + planted-promise) |
| Replay accepts a mismatched build / checks / project | each **169/1** (clean-run) |
| Replay accepts a mismatched seed | **169/1** (planted-promise) |
| Failure record missing `invariant` or `snapshotHash` | each **169/1** (planted-promise) |
| Failure record missing `engineSha`, `node` or `ruleset` | each **168/2** (clean-run + planted-promise) |
| `stepIndex` off by one | **169/1** (planted-promise) |
| `firstDivergentSnapshotKey` hardcoded to `"tick"` | **169/1** (planted-promise) |
| Budget not passed through to `opts.intents` | **169/1** (clean-run) |
| Stall `[]` does not increment `call` | **170/0** — **the blocker** |
| Second `runMatch` after a caught stop (first record kept) | **170/0**, but the one-`runMatch(` grep fails |
| `for` retry loop around the single `runMatch(` | **169/1** (planted-promise) and the no-numbers grep fails on `2` |
| Swallow every `runMatch` error (not only the harness stop) | **170/0** (no test raises a non-stop error) |
| Drop the wrong-side `replay diverged at call <n>` throw | **170/0** (no test feeds a wrong-side record) |

The last two are residuals, not send-blocks: error-path / replay-edge defences with no named fixture. Auto-retry of the obvious forms is grep- or test-gated; the discarded second-`runMatch` form is grep-gated only.

---

## 4. Rulings on EA's questions

1. **Yes, adequate.** Per-step `(a)5, 12, 9, 6, 2, 1` plus `(a)4` once at the end covers the (a) rows that are cheap, deterministic and checkable on match state today. `(a)5` is a **runtime** check (integer `clockMs === tick × stepMs` on `before` / `fed` / `after`, and `prev.tick ≤ before.tick = fed.tick ≤ after.tick`), not a grep; the check test plants `clockMs + 1` and a tick-late `fed`. The one-clock greps stay as the static half of (a)5. `(a)4` compares all seven snapshot keys, so `(a)13` (`rngState`) is covered at the end of a clean run.

2. **None of the deferrals are wrong.** `(a)3` — only `tile` moves exist; the pipe greps stay the gate. `(a)7` — no HP/shield fields yet. `(a)8 / (a)15 / (a)16` — the match plays no fx and `src/sim` may not import `src/fx`; they need an fx-side chaos entry. `(a)10` — gestures, step C, through the touch mapper. `(a)11` / `(a)14` — static (greps, lint, depcruise); `(a)11` is also the caller-passed check list with no defaults in `src/`. `(a)13` — via the `(a)4` end replay, as written. Strict-one-per-cell occupancy is folded into `(a)1`.

3. **Agrees with this reading of CEO Q7.** Q7 is about chaos *run results* not becoming a merge gate yet (report-only until 25 clean runs in a row, CEO range 20–30, then vetted). The 100-run smoke never asserts that a run is clean: it only checks `hashes.length === moves.length` and that a failure's JSON replays identically, and it prints the two `chaos smoke …` diagnostics. Confirmed: under all three engine plants the smoke test **itself still passed** (100 failures printed and replayed; `failed 0` only on a clean engine). The three mechanics tests pin the harness on known fixtures, like any unit test; an engine bug fails those plus existing tests (7–10 of 170), so `green` still fails — that is not the smoke becoming a gate. The switch to blocking stays a later step (outline §6).

4. **Fine.** Caller-passed checks, ids stored on the record, and `replayChaos` throwing on a build / checks / project / seed mismatch match law 12 and outline §9. The plants above fail the named tests.

---

## 5. README and core-spine vs the kit

Both match. README's 12 row is 199 lines, depends on 11, and the verification line has 170/0, sim unchanged, 254 of 280, and the three engine plants. Core-spine's `~255` is the change-count band (proto is 254), not the 199-line file. Later work is correctly step C (generators and the simple shrink). Outline §7 already split shrink out of the harness; not a miss of CEO Q4.

---

## Repro

```bash
# do not modify /tmp/s12-proto or refs/cmp/*
cp -a /tmp/s12-proto /workspace/qa-runs/s12-review/proto
cp -a /tmp/s12-greps.sh /tmp/s12-plants.sh /workspace/qa-runs/s12-review/
cd /workspace/qa-runs/s12-review/proto
# Node v24.22.1
npm ci && npm run green && npm run sim
git diff --shortstat 1ff51d9 HEAD -- . ':(exclude)handback' ':(exclude)package-lock.json'
# 4 files changed, 253 insertions(+), 1 deletion(-)
sha256sum /workspace/tileengine/handoff/steps/step-12-chaos-harness.md
# 5a247cb705baf9492f5f5fc313b94c6aaa77cb23fe61581a64a972c0868a0836
sh /workspace/qa-runs/s12-review/s12-greps.sh . 1ff51d9 HEAD
# plants: copy s12-plants.sh and point cd at this tree, not /tmp/s12-proto
```

---

## r2 recheck (blocker fix) — 2026-11-11 12:42 Europe/London (GMT)

**Kit:** sha256 `c32bbc0a256571a4cd46f669f0120c3edd8fd1033bba0612eb9c446e04b68b45` (still 199 lines). Backup of r1: `/tmp/step-12-pre-qa1.md` (sha `5a247cb7…`). Copy of this sha: `/workspace/qa-runs/s12-review/step-12-c32bbc0a.md`.
**Prototype:** `/tmp/s12-proto` was not modified (HEAD `9a23fdefdd5ad896c05755c605dc4eb6fac897a3`, clean, `s12 r1: stall call test`). Fresh copy: `qa-runs/s12-review/proto2` at the same commit, Node v24.22.1. The r1 copy `qa-runs/s12-review/proto` at `2ab00fd` was left intact. Greps were run from a copy of `/tmp/s12-greps.sh`.
**Kit docs:** README sha256 `c1a758267377c48743b259df9bf8dfa007bc1554cb456af7c119e5ab096e03bf`; core-spine sha256 `721f068e6246cd48e7839109edc37ea66ba746cd2dc08e99c1154093925aa514`. Outline unchanged at `ef384d2a…`. Pre-r2 backups `/tmp/handoff-README-pre-12qa1.md` (`c59c4a04…`) and `/tmp/core-spine-slices-pre-12qa1.md` (`073464ae…`).
**Remotes:** read-only. No `refs/cmp/*` were written. GitHub and Drive were not touched. Clone left at `1ff51d9`.

### Result

**OK TO SEND** on sha `c32bbc0a…` (199 lines). The r1 blocker is fixed: the stall-`call` sentence is in the L128 clean-run bullet, immediately after the `RangeError` lines, and the proto test implements it. The plant that increments `call` only on a non-empty hook list now fails that test (`0 !== 1`). No new blockers.

### Checks

| Check | Result |
|---|---|
| Shas / lines | Kit `c32bbc0a…`, **199** lines. README `c1a75826…`. Core-spine `721f068e…`. Backup `/tmp/step-12-pre-qa1.md` is the r1 kit `5a247cb7…`. |
| Diff vs r1 backup | **Only three hunks:** the size line (prototype 253+/1− = 254 → 257+/1− = 258); the stall sentence added at the end of the L128 clean-run bullet; the plant-table header now names prototype `2ab00fd` and r1 `9a23fde` (adds only the stall test; reverted after each). No other kit edits. |
| Stall text | Required clauses are present, word for word, right after the `RangeError` lines. The two sentences are joined with `, and` rather than a period (same meaning; not a miss). |
| Proto `9a23fde` on `proto2` | `npm run green` exit 0; **pass 170 / fail 0 / skipped 0 / todo 0**; tsc clean; lint/deps/check:state/check:law OK. Smoke still `failed 0` steps 3120 and 5542. |
| G7 `1ff51d9..9a23fde` excl. handback/lock | **4 files, 257+/1− = 258** ≤ 280 and under ~265. Same four-file list. Only change vs `2ab00fd` is `tests/sim/chaos.test.ts` +4 (92 → 96). Caps unchanged: chaos.ts 117/124, types 42/48, index 3/7, chaos.test **96/100** (slack 4). |
| Pins / sim / greps | Pins identical to base. Sim unchanged: 48/2 `afc89d56…`, 22/28 `b8007292…`. Greps **ALL OK** (size 258). |
| Skip-stall plant (reverted) | **3/1** on `tests/sim/chaos.test.ts`: the clean-run test fails `assert.equal(stall.run.moves[0]?.call, 1)` with `0 !== 1`. |
| README L46 | Only change vs `c59c4a04…` is “254 of 280” → “258 of 280”. Accurate. |
| Core-spine | The two stale `d9ca13b` lines now say steps 00–11 are merged as of `1ff51d9`, with step 12 written. No remaining `d9ca13b`. Residual, not a block: the step-12 table row is still `~255` (proto is now 258). |

### Repro (r2)

```bash
# do not overwrite qa-runs/s12-review/proto or /tmp/s12-proto
cp -a /tmp/s12-proto /workspace/qa-runs/s12-review/proto2
cd /workspace/qa-runs/s12-review/proto2
# Node v24.22.1
npm ci && npm run green && npm run sim
git diff --shortstat 1ff51d9 HEAD -- . ':(exclude)handback' ':(exclude)package-lock.json'
# 4 files changed, 257 insertions(+), 1 deletion(-)
sha256sum /workspace/tileengine/handoff/steps/step-12-chaos-harness.md
# c32bbc0a256571a4cd46f669f0120c3edd8fd1033bba0612eb9c446e04b68b45
```
