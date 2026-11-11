# Step 14 lean review (bot driver: test bot through the player door; hook deprecated, parity kept)

**Date:** 2026-11-11 16:54 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-14-bot-driver.md` sha256 `2e2b14d9f7593909cb22f76e9a46be4ba36566fbbbdf2f2ff793eb96e56a3a44` (154 lines)
**Backup of this sha:** `/workspace/qa-runs/s14-review/step-14-2e2b14d9.md`
**Base:** `dbbc5f4142887c9e64e09db6ae228a60cf4b02cd` — confirmed `origin/main` / clone HEAD (PR #18 merge of step 13; parents `b0f826a` and `ac974d4`). Clone was fetched to confirm; working tree left untouched.
**CN:** none. depcruise pin `dcf61c61…`, core-types pin `f00c722c…`, and `package.json` `1e5dd82c…` hold on both the base and the proto. GUIDE sha256 `c27e1292…` (unchanged).
**Kit docs:** README sha256 `06a9d196fdb4bde1dc7dbe2e78d046cff47a536c3ede95633d8804d08da2ecef`; core-spine sha256 `5fe8f7d6773c84c0dc2cb9cc823768061dd402f63fd6001226afa102c516853a`; chaos-player outline sha256 `ef384d2a450619d2098da1d71b1bc1ecdb96747e05fd9d08853b4bc9f4128a7e` (110 lines, unchanged).
**Prototype:** `/tmp/s14-proto` was copied first (HEAD `6fceeff29b8196cffb9a4aac48625b8ee19536a9`, “reject test also selects a foreign unit”, on `d9c7e45`). Fresh copy: `qa-runs/s14-review/proto` at the same commit, Node v24.22.1. Greps/plants scripts and `s14-plants-all.out` copied to `qa-runs/s14-review/` and run from there, retargeted off `/tmp` (`s14-plants.sh` otherwise defaults to `/tmp/s14-proto`, writes `/tmp/s14-plant-*.txt`, and can commit there). After the copy, `/tmp/s14-proto` was no longer present on the box; the copy was not edited to compensate, and `/tmp` was not recreated.
**Remotes:** read-only. Handoff, the step file, existing `refs/cmp/*`, and earlier qa-runs trees were not edited. GitHub and Drive were not touched.

## Result

**OK TO SEND** on sha `2e2b14d9…` (154 lines). No blocking coverage gap, no CN miss, and no build-law miss. Every Behaviour / “done means” line is in `tests/sim/bot.test.ts` or is a measured swap in the chaos tests / `scripts/sim.ts`. EA’s 24 test plants each fail a named test and the 14 grep plants are all caught; our extra plants confirm the no-seat-no-ai `RangeError` (including a half-seated side) and that the JSON peer actually reads the wire. Green is **181/0**, G7 is 155+/25− = **180** of 200 (under ~190, no “say so”), pins and sim and both smokes match the base, and the no-CN claim holds against CN-006 and M6.

No blocking edits.

---

## Residuals (not send-blocks)

**1. Dropping the final snapshot from the parity `deepEqual` stays 181/0.** The test as written does compare `snapshot(now.world)` to `snapshot(old)` on all 100 seeds (Behaviour / Tests). A weaker assert that keeps only result / log / history still passes, because nothing in this engine currently diverges the final snapshot independently of those. The snapshot term is not grep-enforced. The done-means line is present and runs.

**2. A peer hook that ignores the JSON wire and just calls `bot(5)` stays 181/0.** The online test as written does `JSON.stringify` then `JSON.parse` and still deep-equals the live run (hashes, log, history). Corrupting the wire fails that test, so the peer is reading the wire. A second live `bot(5)` also matches, which is expected (same seed). Not a miss of the kit line.

**3. Outline §7 is still the stale line QA noted at step 13.** The kit already defers it (L150: the Architect fixes the outline outside this step). Not a send-block.

---

## 1. Shas / line counts / Base / kit — PASS

| Check | Result |
|---|---|
| Step sha / lines | `2e2b14d9…`, **154** lines, matches EA |
| Base | `dbbc5f4` is `origin/main` (PR #18, parents `b0f826a` + `ac974d4`) |
| Pins | core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock unchanged, all identical to base |
| CN | none, as claimed (see the CN-006 / M6 check below) |
| Kit shas | README `06a9d196…`, core-spine `5fe8f7d6…`, outline `ef384d2a…` / 110 lines, as claimed |

README: 13 merged at `dbbc5f4` (PR #18; chaos A–C done), new 14 row (154 lines), Later adds “retiring the action hook (with a CN to M6) once `runTicks` has seats”, verification adds 14 on `dbbc5f4` 181/0 sim unchanged with the bot on seats and no `ai`, smokes unchanged, 180 of 200, 24 + 14 plants, §5.2 “00–14”. Core-spine: status 00–13 merged at `dbbc5f4`, step 14 written; step-13 row is **merged, `dbbc5f4`, 216** (the preferred step-13 build); new step-14 row `~180`. Outline unchanged, including the stale §7 line already deferred.

---

## 2. Prototype `6fceeff` — PASS (green, caps, quotes, greps)

On the copy `qa-runs/s14-review/proto`, Node v24.22.1.

| Check | Result |
|---|---|
| `tsc` / `npm run green` | exit 0; **pass 181 / fail 0 / skipped 0 / todo 0** (176 prior + 5 new bot tests) |
| `npm run sim` | unchanged: 6×9 **48/2** `afc89d56…`, 12×12 **22/28** `b8007292…` |
| G7 `dbbc5f4..6fceeff` excl. handback/lock | **8 files, 155+/25− = 180** ≤ 200 and under ~190 (no “say so”). name-status is exactly the eight kit files (`A` bot.test.ts; `M` the other seven). DNT empty. `src/sim/{player,chaos,chaos-gen,shrink,index,driver-tick}.ts` untouched |
| Per-file caps | all hold: `scripts/sim.ts` 7/12, `driver-phase.ts` 7/12, `types.ts` 3/7, `ai.ts` 32/38, `bot.test.ts` 103/110, `chaos-gen.test.ts` 11/16, `chaos.test.ts` 9/14, `seats.ts` 8/12. src+tests 173, as claimed |
| Quoted blocks | types `ai` line (optional + `@deprecated` comment) and the `runMatch` `RangeError` message are **verbatim**. `TickOptions.ai` stays required. `scripts/sim.ts` `runMatch` call matches the quote (no `ai` key). `bot` / `forward` / `seatAll` signatures match |
| `/workspace/qa-runs/s14-review/s14-greps-run.sh` | **ALL OK** |
| Grep plants (on the copy, then reset) | **14/14 caught**, tree left clean at `6fceeff` |
| Smoke diagnostics | step-12 still `failed 0` 3120 / 5542; generator still `failed 0` 1730/278 and 3154/563 — **byte-identical to the base / kit** |

A first `npm run green` on a copied `node_modules` failed `tests/gates.test.ts` with `Cannot find package 'eslint'` and reported 177 tests (the gates file never loaded). That was the copy’s install, not the proto: `npm ci` in the copy only, then **181/0**. `/tmp` was not modified to fix it.

---

## 3. Kit vs code, plants, build law — PASS

Behaviour 1–6 and every “Tests that prove it is done” bullet are present. `bot(seed)` is an `IntentHook` on the shared private `picker` (`"ai"` stream, two draws, same cells as `forward`); it returns only `SelectUnit` / `TargetCell` pairs, no `aim`, no actions. `seatAll` uses one `counter("m")` and `createPlayer` per side. `npm run sim` and the chaos tests use `bot` with no `ai`. `MatchOptions.ai` is optional and `@deprecated`; `runMatch` throws the exact `RangeError` when a side has neither a seat nor the hook, then reaches the hook via `(opts.ai ?? noAi)`. Parity compares outcome, events, log, history **and** the final snapshot on 100 seeds. The online test feeds seats only from JSON-transported intents and compares per-step snapshot hashes, log and history.

### EA plants (reverted; run on the copy)

All 24 test plants fail at least one named test, with the same pass/fail counts as `/tmp/s14-plants-all.out` (copied). Notably: D2 / D6 fail only the reject-reasons test (the no-seat-no-ai `RangeError`); R3 (dead select) and R7 (foreign tap) fail **only** that test, as the kit says; B6 (forward on another stream) fails parity and step 11’s 50-seed test. 14/14 grep plants caught, including sim back on `ai: forward`, chaos back on `asIntents(forward)`, bot building an action or a third intent type, bot with its own chooser, `ai` required again, and a who-plays word in the door.

### Our plants (reverted; on the copy)

| Plant | Result |
|---|---|
| Q1 drop `snapshot(…)` from the parity `deepEqual` | **181/0** (residual 1) |
| Q2 peer hook ignores the wire and calls `bot(5)` | **181/0** (residual 2) |
| Q3 peer `JSON.parse`s a corrupted wire | **180/1**: the online test |
| Q4 `RangeError` only when `seats` is empty, not when one side is missing | **180/1**: the reject-reasons test (half-seated side) |

### Build law and the no-CN claim

One clock; no `Date` / `Math.random` / timers in `src/sim`. The door stays blind to who plays (no bot / online / peer words in `driver-phase.ts` or `player.ts`). The bot never calls `submit`, `feedIntent`, `createPlayer` or `runMatch`; it only returns intents. No fx / btf-adapters import in `src/sim`. BTF defaults only. Report-only chaos smokes unchanged (no `t.diagnostic` in `bot.test.ts`). No copied BTF tree.

**CN-006 / M6:** the no-CN claim holds. CN-006 already names `scripts/sim.ts` as a **tools** file that may import `src/sim` and `tests/`; it is outside `src/`, so check:law and depcruise do not scan it. BUILD_GUIDE §3’s scripts row says the same. BUILD_GUIDE §7 makes only `scripts/check-state.sh` CN-only among scripts — not `sim.ts`. This step changes the `runMatch` call inside `sim.ts` (named in the file list) and does not touch `package.json`, depcruise, or the GUIDE. M6 still reads true: `AiHook` remains `proposeActions(world, side, budget)` with no `phase` parameter, still required on `runTicks` and still used for unseated sides; the bot is an `IntentHook` on the same `(world, side, budget)` shape and the parity test pins that it emits the same events, commands, log, history and snapshot as the hook.

---

## Rulings EA asked for

**(1) Two reject reasons unreachable via the public API, reached through a read-only `units` view in the test — acceptable?** Yes. `player.feed` uses `world.units.get`. The test builds a shallow `SimWorld` whose `get` returns `{ ...unit, ...overlay }` (a new object) from a `Map` in the test file; it does not write through `place` / `remove` / `moveTo` or mutate the real unit. `view.phases = { battle: "idle" | "targeting" }` rebinds a field on that shallow copy; it does not assign into the original world’s phases object. `log.lastSeq()` stays 0. The view is local to `tests/sim/bot.test.ts`: not exported from `src/`, not re-exported from `src/sim/index.ts`, and not a copied BTF / chess tree. R3 (select a dead unit) and R7 (tap after the selected unit turns foreign) fail **only** this test, which is why the seam exists. The Decisions note already requires builders to say that it writes nothing to the world.

**(2) Keeping the `@deprecated` `ai` hook until `runTicks` has seats — acceptable?** Yes. Removing it now would strand `runTicks` (no seats until tick-mode tables), require a Change Notice to rewrite M6, and drop the parity test the CEO asked to keep. This step already takes the bot, `npm run sim` and the chaos tests off the hook, makes `ai` optional, and throws if a side has neither. The deferred list is correctly deferred and **none of it is needed for this step’s done-means**: hook / `forward` / `asIntents` / both parity tests / M6 wording wait for a later CN once `runTicks` has seats; the 09b hook-path tests stay; the throwing `ai` in `chaos.ts` is now optional, the file stays at 124 lines, and the throw remains an equal guard.

---

## Repro

```sh
cp -a /tmp/s14-proto /workspace/qa-runs/s14-review/proto   # copy first; do not run the /tmp scripts in /tmp
# (if node_modules is incomplete: npm ci in the copy only)
sh /workspace/qa-runs/s14-review/s14-greps-run.sh /workspace/qa-runs/s14-review/proto dbbc5f4 HEAD
sh /workspace/qa-runs/s14-review/s14-plants-run.sh /workspace/qa-runs/s14-review/proto all
```

The copy was left clean at `6fceeff`. The clone, `refs/cmp/*`, and the kit files were not modified.
