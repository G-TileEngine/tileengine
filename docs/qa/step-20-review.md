# Step 20 lean review (H1 every door: one shared `plainCopy` at every listed front door)

**Date:** 2026-11-12 14:19 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-20-every-door.md` sha256 `9fdca1614675c1067c09a19c332555bf3d4e951cf2702d57a3c1619d9b5bbaaf` (183 lines). Copy at `/workspace/tileengine-repo/qa-runs/s20-review/step-20.md` is byte-identical to `/workspace/tileengine/handoff/steps/step-20-every-door.md`.
**Base (proto):** `2a9441f` (step 19 proto r2 on `7a0de0c`). The step 19 merge has not landed; this is the early review EA asked for. After the merge, rebase + plant retarget + delta recheck.
**CN:** none, as claimed. Pins hold and are identical to `2a9441f`: core-types `f00c722c…`, package.json `1e5dd82c…`, depcruise `45a3dbaa…`, check-law `4d7bbf48…`, lock `d7f64a09…`. GUIDE unchanged on the proto.
**Kit docs:** README sha256 `9eddc0a1e45ec70c334ce762e0dd94a7bcd61850b1abfc93d2cb4d7387ba6aac`; core-spine sha256 `175b7afcf50cf2d5d52ce60b9d9c120d113df4ba29f7cd1c62519ae19a5b2f70` (under `/workspace/tileengine/`). `/tmp/h1-kit-backup` was the step-19 r2 README / spine (`26d79d52…` / `218136c1…`), not the H1 docs. The proto tree itself still has the SE-01 README / spine, as with step 19.
**Prototype:** copied to `/workspace/tileengine-repo/qa-runs/s20-review/proto` (HEAD `c7f6656b121ad0df42946a105bfbe4e595f69f7e`, single code commit on `2a9441f`). Greps / plants / grep-plants and EA's logs were copied there. `/tmp` was not edited. Existing `refs/cmp/*` were not touched. GitHub and Drive were not touched.
**Scripts (copied):** greps `0837ce4e…`, plants `1fe99339…`, grep-plants `84073a74…`. Grep-plants were retargeted at the review copies (`h1-grep-plants.local.sh`), not `/tmp`.

## Result

**HOLD** on proto `c7f6656` / step `9fdca161…` (183 lines), pending one fix. The official pins and reruns are otherwise clean (green **483/0**, sim and all 16+4 smoke lines byte-identical, G7 **338** of 400 with caps totalling 398, every file exactly 4 under its cap, greps **33/33**, grep-plants **22/22**, plants **29/29** including F1–F7). Step 19 residuals 1 and 2 and the deferred submit shape guard are closed as written. The two ruled behaviour changes are real (not weakened assertions). The hold is a hang at the copy itself.

1. **A lying array proxy with `length: Infinity` and every index reported as own hangs `plainCopy`, and hangs `submit`.** Official hostiles (throwing getters and traps, revoked proxies, holes, cycles, a 100k nest, `new Array(1e9)` at depth 1) all return `NOT_PLAIN` quickly — a holey Infinity-length proxy is caught on the first `hasOwn`. But a proxy that answers `length === Infinity` and claims every index is an own property never hits a hole, never trips the node budget (`nodes` defaults to `Infinity`, so `left -= 1` stays `Infinity`), and loops until killed. The same object as `action.effects` hangs the `submit` door (child killed after 1500 ms; nothing returned, no `actionRefused`). Repro: `qa-runs/s20-review/probes.mjs` / `probes.log`.

```js
const arr = new Proxy([], {
  get(_t, p) { return p === "length" ? Number.POSITIVE_INFINITY : "guard"; },
  has() { return true; },
  getOwnPropertyDescriptor() {
    return { configurable: true, enumerable: true, value: "guard", writable: true };
  },
});
plainCopy(arr, 4);                 // hangs
submit(world, { ...move, effects: arr });  // hangs
```

This is a shape check, not a new numeric cap: a real JS array cannot have `length: Infinity`. In `plainCopy`'s array branch, after reading `length` once, refuse unless `Number.isInteger(n) && n >= 0` (same spirit as integer cells). Then, if `n > left`, also refuse, so H2's finite `nodes` can actually stop a huge finite walk. Pin it in "the door copy" and "submit says no politely", and add a plant (a non-integer or infinite `length` is `NOT_PLAIN`, and `submit` returns `actionRefused` with nothing logged, in well under a second). Until that lands, this is not OK TO SEND.

What does hold, and is not a send-block on its own, is listed under Residuals and Gates.

---

## Gates (re-run on proto `c7f6656`)

| Check | Result |
|---|---|
| `npm run green` | exit 0; **483/0/0/0**; tsc / lint / deps (78 modules, 234 deps) / check:state / check:law OK. Log: `qa-runs/s20-review/proto-green.log` |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| Existing smokes (16) + exploit-levels (4) | **byte-identical** to the step-16/17/18/19 pins and to EA's `/tmp/h1-fresh20.txt` (20/20): gen 1730/278 and 3154/563; chaos 3120 and 5542; exploit 1604/309, 1617/367, 2043/480, 2299/592; docs 581/1419 and 607/1393 findings 0; six levels histories `6b91ceba…` / `3a58d03a…` / `f09905f4…` / `885c1a7b…` / `5a8d757f…` / `ac883a98…`; exploit-levels `b4200d6e…` / `78bc5fb6…` / `1bdb1347…` / `7e7ee7a6…` |
| G7 `2a9441f..HEAD` excl. handback/lock | **15 files, 293+/45− = 338** ≤ 400 (caps total 398). name-status is exactly the 15 kit files (`A` for `src/core/plain.ts` and `tests/sim/every-door.test.ts`). DNT empty. Every file is exactly 4 under its cap (tightest: `plain.ts` 38/42, `every-door.test.ts` 166/170, `log.ts` 23/27, `actions.ts` 24/28, `run.ts` 25/29). |
| Pins | identical to `2a9441f` (`f00c722c` / `1e5dd82c` / `45a3dbaa` / `4d7bbf48`; lock `d7f64a09`) |
| Greps | **33/33 ALL OK** (`h1-greps.sh` on the review proto, base `2a9441f`) |
| Grep-plants | **22/22** caught (retargeted script on a throwaway clone; tree restored clean at `c7f6656`) |
| Kit plants | **29/29** caught (D1–D9, F1–F7, A1–A6, M1, C1–C3, R1, G1, X1), matching EA's log |
| Step 19 plants | EA's `/tmp/h1-s19plants.log` is **25 caught + 8 ADAPT**, none passed. The eight "not found" texts (A1, A3, M1, M2, M4–M7) are **absent** from this proto (`idsOf` is gone). Mapping is honest: M1/M2/A1/A3 → F3 / H1-A1 / apply-on-the-frozen-copy; M4–M7 → F6 / F1 / the `plainCopy` setup door; sparse/`idsOf` residual → D2. Not re-run end-to-end on this box. |
| Heap | report-only: `before 10.07 MiB after 10.69 MiB delta +0.62 MiB` |
| Microbench | `plainCopy(action, 3)` **0.69 µs/call**, `plainCopy(sample, 1)` 0.30 µs, `cellOf` 0.39 µs (20k in-process calls). Not heavy on a submit or gesture path. |
| Build law / scope | One new file in `src/core`. No `Date` / `Math.random` / rAF in the src diff. No second copy function, no `JSON.parse(JSON.stringify)` door copy (R6 / R6c). `plain.ts` imports only the `Sq` type. No new CN, no new numeric cap, no draw added/removed/moved (sim and all 20 smoke lines pin it; no new draw-order write-up needed). Named carries H2–H4 are deferred as written. Player door / `feedIntent` are untouched (out of scope). |

---

## Design checks

**One path.** `plainCopy` (and `cellOf` / `readAction`, which call it) is used at `submit` / `apply`, `append` / `parseLog`, `moveTo`, `clock.after` (misuse is the RangeError path, not a copy), `createLevels`, `createWorld` / `replay` / `restore`, the gesture mapper and chaos-gen. `submit` copies then calls `readAction` on that copy (a second copy of already-plain data, not a second read of the caller). `apply` and the timed `after` callback close over the same frozen `own`. No listed door bypasses it. Direct `readStage` / `readMap` / `readManifest` / `resolvePlacements` on a live object are the named H3 carry.

**`plainCopy` hostiles (beyond the official set).** Throwing getters, revoked proxies, `toJSON` (never called), cycles, 100k nests, `__proto__` / `constructor` / `prototype`, holes, symbols (keys dropped; a top-level symbol returns `undefined`), Date / Map / class instances, NaN / Infinity kept, `Object.create(null)` accepted, `-0` → `0`, `new Array(1e9)` at depth 1 in 0.02 ms: all as ruled, nothing throws. A top-level function also returns `undefined` (same as a dropped key). Object keys whose value is `undefined` are dropped, JSON-style; `undefined` in an array is kept. The one miss is the hang above.

**(a) Timed edit after submit lands as logged.** Official test plus the step-19 "malformed unlock" retarget: edit `effects` to `null` after `submit`; on land, `lastSeq` 1, 7 notices (no new one), `abilities[0] === first`. The old assertion (8 notices, last `unlockFailed`, levels unchanged) was a real behaviour change, not a weakened check. Replay of the log matches the snapshot.

**(b) `clock.after` misuse.** NaN, -1, 1.5, Infinity, `"10"`, `null`, and a non-function `cb`: each returns `{ id: 0, dueMs: -1, cancel() {} }`; the message is exactly `after: ms must be an integer >= 0 and cb a function`; `onError` sees seven `RangeError`s; nothing fires; a later valid `after` is id 1. Cancel on the inert timer is a noop and does not cancel real timers; cancelling a real timer still works alongside id-0 refusals. Valid ids start at 1 and never reuse 0. The two updated tests (`integer ms only`, `clock dispose (step 17)`) still assert that clock state is unchanged and that nothing fires after dispose — they only replace `assert.throws` with `id === 0`.

**Unlock with holes.** Hole first or last: no throw, `actionRefused` (not `unlockFailed`), not logged, levels unchanged. Confirmed with an independent plant-style submit. `[]` / `[""]` / `[id, id]` still log and then `unlockFailed` in `apply` (valid shape, bad offer); `[7]` and `null` are `unlockFailed` before the log. Matches EA's ruling.

**Step 19 residuals.** Sparse `effects` closed (above). A flip getter on `effects` (`[id]` then `null`) is read once, logged, and unlocks. A flip on `kind` is also read once. `idsOf` is gone; `apply` uses `effects.length === 1 ? effects[0]` on the frozen copy, and `""` is still refused. The general submit shape guard is `plainCopy` + `readAction` before `append`.

**Determinism.** No draw is added, removed or moved. chaos-gen still builds its rng on the hook's first call from `streamSeed(world.seed, gen.stream)` read off the copy (the same value). Sim and all 20 smoke lines are the pin.

---

## Residuals (not this hold)

- **H2:** document depth / node caps (`createWorld` / `replay` still copy at depth `Infinity` with default `nodes = Infinity`); a lying proxy or dense array with a huge *finite* integer length can still walk for a long time until a finite `nodes` is passed and `n > left` is checked; a self-consistent forged snapshot whose tick / `clockMs` / `logSeq` agree still replays to that tick; `readStage` reads `StageLimits` live; `units.place` keeps the caller's cell; SE-01 C1–C3.
- **H3:** direct project-reader calls on a live hostile object; in-memory log tamper (`packAction` stores an unfrozen pack; `entries()` is a shallow slice); `projectHash` / `engineVersion` in `replay` / `restore`.
- **H4:** `units.get` returns the live record; `setOffset` also keeps the caller's offset object.
- The player door and `feedIntent` still read the live intent after the step-16 shape guard (out of scope; any action they build then goes through `submit`'s copy). `createGestureMapper(opts)` and `createClock(opts)` do not copy their options.
- chaos-gen still throws on the hook's first call, not when the hook is made, and a run record still holds the caller's live `gen` (both as written).

## Doc vs code

Kit status, the step-20 table row, H2–H4 carries and proto `c7f6656` / 483 / 338 line up with the proto. One typography nit, not a reject: the README Lines cell for step 20 is `~338` (the G7 count); the step file is **183** lines (step 19's cell was the file length, 186). Spine's size column correctly uses ~338 as G7. Send that to EA; do not edit the kit.

---

After the length-shape fix (test + plant) and a recheck of that item, this is **OK TO SEND pending the rebase** onto the winning step-19 build (refill Base, readapt plants, send the deltas).

---

## Recheck r2 `eb4d16a`

**Date:** 2026-11-12 14:47 Europe/London (GMT)
**Step:** `handoff/steps/step-20-every-door.md` sha256 `e6e9c8ca582282d3cd6e1c82e768481d01025e6840568977b6b0dc630a2268b0` (194 lines). Copy at `/workspace/tileengine-repo/qa-runs/s20-review/r2/step-20.md` is byte-identical to `/workspace/tileengine/handoff/steps/step-20-every-door.md`.
**Base:** `ad627d0d5254f9d919527477b76c1e132519610b` (PR #25 merge of kit `04455e4` and build A tip `925901b` / code `dbf871e`). Fetched into the fetch-only clone; `refs/cmp/*` not overwritten.
**Kit docs:** README `7a76e54fba8883e6a2b045d3b114816f5511a6d0ab1eed2de8da0fc4e7c1b41d`; spine `901cdd0f854f1fc419b6ec6282e61e486cd04d9d23c09b87c2e907db8b26e552`. The r1 typography nit is closed (Lines cell is now `194 (code diff ~333)`). `/tmp/h1-prefix` is still the r1 kit (`9fdca161…` / `9eddc0a1…` / `175b7afc…`), kept as found.
**Prototype:** copied to `/workspace/tileengine-repo/qa-runs/s20-review/r2/proto` (HEAD `eb4d16a6d635e392793f5289c7834c9563bc3f79`, single code commit on `ad627d0`). Scripts: greps-r `7d8e2f96…`, plants-r `c6b93914…`, grep-plants-r `5b73b18c…`, s19-plants-A `5076f0ef…`. `/tmp` was not edited.

### Result

**OK TO SEND.** The r1 hold is closed, pinned with a test and with plants L1 and L2. Official reruns match EA: green **483/0**, sim and all 16+4 smoke lines byte-identical to `ad627d0`, G7 **333** of 400 (caps 397, 16 files, every file 4 under its cap, `exploit-levels.test.ts` **9/13**), greps **36/36**, grep-plants **25/25**, plants **33/33** (L1, L2, T1, E1 included). s19-plants-A is **25 caught + 8 ADAPT**, none passed; the mapping is honest. Cherry-pick conflict resolutions in `actions.ts`, `levels.ts` and `levels.test.ts` kept build A's behaviour and did not drop the H1 guards.

### The hold fix

`plainCopy`'s array branch now refuses unless `Number.isInteger(n) && n >= 0 && n <= left`, and it reads `length` once. Independent probes (`qa-runs/s20-review/r2/probes.mjs`):

- Infinity, NaN, -1, 1.5, `2**32` under `nodes=100`, and `1e9` under `nodes=100`: all `NOT_PLAIN` in well under a millisecond, **seen = 0** (no item read).
- `submit(liar(Infinity))`: `actionRefused`, `lastSeq` 0, seen 0, 0.16 ms. The hang is gone.
- A length getter that flips `2` then `1e12` is read once; the copy has length 2 and does not hang.
- A throwing length getter is `NOT_PLAIN`, no throw.
- A proxy whose `ownKeys` invents or hides keys is safe (invented keys whose get is `undefined` are dropped; a throwing `ownKeys` is `NOT_PLAIN`).
- The two official child-process probes (5 s kill timer) live in `every-door.test.ts`. The whole file passed in **583 ms**; they are not flaky and they do not sit on the timeout. Plants **L1** (drop the integer/`>= 0` check) and **L2** (drop `n > left`) both fail their named tests (L1: door copy + submit, 2/2; L2: door copy, 1/1).

Huge finite lengths under the door's default `nodes = Infinity` still walk without bound (`plainCopy(liar(2**32))` and `liar(1e7)` hung past 2–3 s; `submit(liar(1e9))` hung past 2 s). That is the named **H2** carry (finite `nodes` at `submit` / `createWorld` / etc.), not a new hold: the shape check the r1 hold asked for is in, and `n > left` already stops a huge finite length once a budget is passed.

### Cherry-pick vs r1 `c7f6656` and build A `dbf871e`

The r2 patch is the r1 patch plus: the length-shape check in `plain.ts`, the child-process liar tests, a compressed `every-door.test.ts` (157/161), and the two C1/C2 edits in `tests/sim/exploit-levels.test.ts` (only r2-new file vs r1).

- **`actions.ts`:** A's `id` / `world.levels?.choose(...) !== true` / inline `unlockFailed` and the apply-level `""` refusal are kept. A's live `idsOf` submit/apply path is replaced by the H1 door (`plainCopy` + `readAction`, then `apply` / `after` on the frozen `own`). No H1 guard dropped.
- **`levels.ts`:** A's `taken` / `bad` structure and the empty-id pool check are kept. `taken()` now copies through `plainCopy` and freezes from that copy (same observer effect as A's slice/freeze; a later edit of the caller's pools still cannot inject `""`). Hostile setups still throw `RangeError("createLevels: bad rules or pools")`.
- **`levels.test.ts`:** only the ruled H1 change (a timed unlock edited after `submit` lands as logged). The empty-id test is unchanged.

### C1 and C2 (`exploit-levels.test.ts`, 9/13)

- **C1 / T1:** the tampered-log test now finds a bar whose offer is actually open and forges against that id. Plant T1 (`effects[0]` with no length check) is caught by that test (3 failing, named `tamper`).
- **C2 / E1 / E6:** the `(e)1` test now builds `after` as a copy of `before` with every offer cleared, and passes that as `view.after`. Plant E1 (r2; `(e)1` reads `view.after`) fails `e1`, `hostile` and `xsmoke`. s19-plants-A E6 (same edit on `exploit.ts`) is **CAUGHT** the same way. A fair unlock still returns null when the offer is read from `before`.

### Gates (re-run on proto `eb4d16a`)

| Check | Result |
|---|---|
| `npm run green` | exit 0; **483/0/0/0**; tsc / lint / deps (78 modules, 234 deps) / check:state / check:law OK |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| 16+4 smokes | **byte-identical** to `ad627d0` / `h1r-base20.txt` (20/20), including the four exploit-levels hashes |
| G7 `ad627d0..HEAD` | **16 files, 287+/46− = 333** ≤ 400 (caps 397). name-status is the 16 kit files (`A` for `plain.ts` and `every-door.test.ts`). Each file 4 under its cap; `exploit-levels.test.ts` 9/13, `plain.ts` 39/43, `every-door.test.ts` 157/161 |
| Pins | unchanged (`f00c722c` / `1e5dd82c` / `45a3dbaa` / `4d7bbf48`; lock `d7f64a09`). No CN |
| Greps | **36/36 ALL OK** (base `ad627d0`; includes R5k, R9a, R9b) |
| Grep-plants | **25/25** (G23–G25 included), throwaway clone restored clean |
| Kit plants | **33/33**, including L1, L2, T1, E1 |
| s19-plants-A | **25/33 caught**; 8 ADAPT (A1, M1, M2, M4–M7, A3) — all eight needles absent (`idsOf` is gone). Mapping is honest: A1/A3/M1/M2 → T1 / F3 / H1-A1 / apply on the frozen copy; M4–M7 → F6 / F1 / the `plainCopy` setup door. E6 is caught, not adapted |
| Heap | report-only: `before 10.07 MiB after 10.67 MiB delta +0.60 MiB` |

### Residuals (unchanged, not a send-block)

- **H2:** document depth / node caps; a lying proxy or dense array with a huge *finite* integer length still hangs `plainCopy` and `submit` at the doors' default `nodes = Infinity` (reproduced: `2**32`, `1e7`, `submit(liar(1e9))`, each killed after 2–3 s). `n > left` already handles this once a finite budget is passed. Also: self-consistent forged snapshot still replays to its tick; `readStage` live limits; `units.place` keeps the caller's cell; SE-01 C1–C3.
- **H3:** direct project-reader calls; in-memory log tamper; `projectHash` / `engineVersion`.
- **H4:** `units.get` returns the live record; `setOffset` keeps the caller's offset.
- Player door / `feedIntent` still read the live intent after the step-16 shape guard (out of scope).
