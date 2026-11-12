# Step 19 lean review (pick hardening: unlock needs one named ability, door/reject carries, exploit `pick` kind, (e)1 / (a)9)

**Date:** 2026-11-12 07:54 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-19-pick-hardening.md` sha256 `c0c02b85ea3431ae671f7c44e0eadaa37073c8424cfc9f64cf23b1553b7e7a7b` (169 lines). Copy at `/workspace/qa-runs/s19-review/step-19.md` is byte-identical to `/workspace/tileengine/handoff/steps/step-19-pick-hardening.md`.
**Base:** `7a0de0c0ec8d8b7e2710b7dd799169fe6d8deb45` — the SE-01 merge (PR #24; parents `e1a1ea0` and `93ae877`), as EA described. The fetch-only clone was left at local `e1a1ea0` (`behind` the SE-01 merge); working tree not checked out or edited.
**CN:** none, as claimed. Pins hold and are identical to Base: core-types `f00c722c…`, package.json `1e5dd82c…`, depcruise `45a3dbaa…`, check-law `4d7bbf48…`, lock `d7f64a09…`. GUIDE sha256 `27a12d2f…` (unchanged).
**Kit docs:** README sha256 `df4abbd4c9d981b32f77d952c155063194224f804e33d5dab0a03a8bed711bff`; core-spine sha256 `5a2e5a8239a5e116df81691ecb6595f1a2c647ea381576ff01806578edafdfea` (under `/workspace/tileengine/`; not yet on the proto / `origin/main`). Status and Verification correctly pin Base `7a0de0c` and proto `34b1b9d`. README’s step-19 Lines cell is **169**. Spine size is **~153**. The outline is left for the Architect, as the step says. One doc drift is listed in the hold.
**Prototype:** already at `/workspace/qa-runs/s19-review/proto` (HEAD `34b1b9d9b4fe7086a2dc3908cd444a2d56b92984`; four commits on `7a0de0c`: `0f8213d`, `d819218`, `ed7cdb9`, `34b1b9d`). Greps / plants / s18-plants-B and EA’s `s19-plants.log` were already copied there. `/tmp` was not edited.
**Remotes:** read-only. Existing `refs/cmp/*` and earlier qa-runs trees were not edited. GitHub and Drive were not touched.

## Result

**HOLD** on sha `c0c02b85…` (169 lines). The official pins and reruns are otherwise clean (green **468/0**, sim unchanged, G7 **153** of 400 with at least 4 lines of slack per file, greps **33/33**, grep-plants **12/12**, plants **22/22**, s18-plants-B **36/36**, sixteen base smokes byte-identical, four new exploit-levels lines match the kit). The hold is the step-18 carry, which is not fully closed. Two items:

1. **A missing `effects` field still throws, and is not pinned as `unlockFailed`.** The carry (and the README queue: “an empty or missing offer id, or missing `effects`, gives `unlockFailed`”) required a named `unlockFailed`, never a `TypeError`, pinned with a test *and* a plant. A hand-built `submit` / `apply` of an unlock with `effects` missing, `undefined` or `null` still throws `TypeError: a.effects is not iterable` inside `packAction` (`log.append`, before `apply`). `parseLog` of a JSON log with the key removed is `bad entry` (Behaviour 1, and the tampered-log test pins that). There is no apply-level test or plant that a missing field is `unlockFailed`. The step file narrowed this to “`parseLog` is unchanged”; the carry did not.

2. **`ed7cdb9` (“the empty id needs no own test (pools refuse it)”) dropped `ability === ""` in `apply`. That is not a complete story.** `""` *does* reach `apply`: a hand-built `submit({ effects: [""] })` and a JSON-loaded log with `effects: [""]` both parse and run (the official “no ability id” and tampered-log tests pin these as `unlockFailed` when the offer came from a `createLevels`-validated pool — so the empty id is not untested). But `createLevels` keeps a live reference to the host’s `pools` object and does not copy it. Mutating a pool after create to include `""`, then `gain`, produces an offer containing `""`, and `submit({ effects: [""] })` **unlocks `""` with no notice**. A faked snapshot offer is refused by `restore` (“snapshot does not match the log”). Probes: `qa-runs/s19-review/carry-probe.log`.

Restore `ability === ""` (never unlock `""`) and treat a missing / non-array `effects` as `unlockFailed` in `apply` (or in `submit` before `append`), each with a test and a plant. Until then this is not OK TO SEND.

What does hold, and is not a send-block on its own: (a) an unlock needs exactly one named ability that is in the pending offer — `effects: []`, two ids, `[""]` on a clean pool, empty actor, `"nope"` are `unlockFailed` with the offer kept, checked in `apply`, so JSON logs are covered; `createLevels` refuses `""` in a pool. (b) the door test checks `snapshot(world).levels` plus a JSON round trip (plant B1 / L17). (c) `-1` and `"1"` are `badPick`, then the last index is accepted (plant C1 / D2). The hostile `pick` kind is last in `EXPLOIT_KINDS`; its draw order reimplements from the text; existing mixes and the sixteen base smokes are byte-identical. (e)1 judges an unlock against the seat’s own prior offer; (a)9 compares `levels`. Seats in `runTicks` stay out of scope.

The invariants doc **did** need an update for (e)1 and (a)9. Applied to `/workspace/tileengine/docs/qa/chaos-player-invariants.md`; new sha256 `6caf55c6cea6ff01cfb933914754fa34fef0a5a2887469faa9d37cef7a11f533`. The proto’s copy was left untouched.

---

## Gates (re-run on proto `34b1b9d`)

| Check | Result |
|---|---|
| `npm run green` | exit 0; **468/0/0/0**; tsc / lint / deps (77 modules, 225 deps) / check:state / check:law OK. Log: `qa-runs/s19-review/proto-green.log` |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| Existing smokes (16) | gen 1730/278 and 3154/563; chaos 3120 and 5542; exploit 1604/309, 1617/367, 2043/480, 2299/592; docs 581/1419 and 607/1393 findings 0; six levels histories `6b91ceba…` / `3a58d03a…` / `f09905f4…` / `885c1a7b…` / `5a8d757f…` / `ac883a98…` — **byte-identical** to the step-16 / 17 / 18 pins |
| Exploit-levels smoke (four new lines) | **match the kit:** btf-side / quick-unit × stage-fixed / stage-weighted, seeds 1–20, hashes `b4200d6e…` / `78bc5fb6…` / `1bdb1347…` / `7e7ee7a6…` (steps 1746 / 2337 / 1746 / 2337; unlocked 0 / 5 / 1 / 5) |
| G7 `7a0de0c..HEAD` excl. handback/lock | **10 files, 140+/12− = 153** ≤ 400 (caps total 201). name-status is exactly the 10 kit files (`A` for `tests/sim/exploit-levels.test.ts`). DNT empty. Tightest slack is 4 (`levels.ts` 2/6, `types.ts` 3/7, chaos 6/10, rules test 1/5, bot 6/10, exploit.test 5/9). `exploit.ts` 14/20, `actions.ts` 3/8, levels test 21/26, exploit-levels test 92/100 |
| Pins | identical to Base (`f00c722c` / `1e5dd82c` / `45a3dbaa` / `4d7bbf48`; lock `d7f64a09`) |
| Greps | **33/33 ALL OK** (`s19-greps.sh`, base `7a0de0c`) |
| Grep-plants | **12/12** caught (script retargeted at the review greps; not `/tmp`). Tree restored clean at `34b1b9d` |
| Kit plants | **22/22** caught (A1–A4, B1, C1–C3, E1–E6, F1–F2, K1–K6), matching EA’s log |
| s18-plants-B | **36/36** caught on this proto |
| Heap | report-only: `before 10.03 MiB after 10.79 MiB delta +0.76 MiB` |
| Build law / scope | door (`player.ts`), world, snapshot, both drivers and core-types are untouched. One stream in `exploit.ts` (unchanged). No `Date` / `Math.random` / rAF in the src diff. No new CN. Scope is the 10 named files only |

---

## Carry probes (the hold)

Written against proto `apply` / `submit` / `parseLog` / `createLevels` / `restore`. Log: `qa-runs/s19-review/carry-probe.log`.

- `effects: []`, `[""]`, two ids, actor `""` + a real offer id: `unlockFailed`, levels byte-identical, offer kept. A legal `[offer[0]]` unlocks (control). These official paths are pinned.
- `effects` missing / `undefined` / `null`: **`TypeError: a.effects is not iterable`** in `packAction` (`[...a.effects]`) during `log.append`. Never reaches the new `effects.length === 1` check.
- JSON log with `effects: [""]` and `[]`: `parseLog` succeeds; `replay` yields one `unlockFailed` per entry. The same log with the `effects` key removed: `ok: false`, `bad entry` (pinned).
- Mutate `pools.knight.push("")` after `createWorld`, then `gain`: the offer is `['guard', 'charge', '']`. `submit({ effects: [""] })` **unlocks `""`**, offer cleared, no notice. `restore` of a faked snapshot offer throws and does not inject it.

`choose` only tests `offer.includes(ability)`. After `ed7cdb9` there is no apply-level refusal of `""` itself. Pools refuse `""` only at `createLevels` time, and the pools object is not copied.

---

## Draw order — reimplementation holds

Walked the step’s “Draw order” only, then wrote an independent hook: `r = createRng(streamSeed(world.seed, gen.stream))` once on the first call; `kind = EXPLOIT_KINDS[r.weighted(weights in that order)]`; `fair = legal(...)`; if not legal, `own`, two `r.int` for the cell, `foeId`; then for `pick`, `at = r.pick(PICK_AT)` (13 texts, quoted order), `who = r.pick([own, foeId, "", "ghost#9", "__proto__"])`, the exact wire bytes, `r.next() < 0.5` → one or two copies. `r.pick(xs) = xs[r.int(xs.length)]`, `r.int(n) = floor(r.next() * n)`.

It matches proto `exploitWire` on **640** pick-only calls (both official boards, seeds 1–20, 16 calls each), 0 mismatches. All 13 index texts appeared. A `pick: 0` mix is self-consistent across two independent hooks (50/50 first-wires). The sixteen base smoke lines (which use `pick: 0` / `mixOf`) staying byte-identical is the pin that existing mixes draw as at the base. Log: `qa-runs/s19-review/draw-reimpl.log`.

Offers still draw only from the world’s `"levels"` stream. A refused pick and an `unlockFailed` draw nothing.

---

## Scope, law, docs, invariants

Scope is the 10 named files. No door, snapshot, world, driver, command-log format or state-table change. `ExploitKind` gains `"pick"` last; no pinned file lists the kinds. No CN is the right call. Seats in `runTicks` stay deferred (no tick-phase `play.running`, no M6 CN).

Kit docs are in date on Lines 169, proto `34b1b9d`, 468/0, 153 of 400 and the four new smoke hashes. README “Next” still states the carry as “missing `effects` gives `unlockFailed`”, which this step’s Behaviour 1 and the proto do not implement — that is the hold, not a typography nit. The proto tree itself still has the SE-01 README / spine (the updated kit docs live under `/workspace/tileengine/`).

**(e)1** and **(a)9** needed an invariant-doc update (the previous wording covered only moves / `SELECT_UNIT`, and (a)9 did not mention `levels`). Draft applied to `/workspace/tileengine/docs/qa/chaos-player-invariants.md` (the proto copy was not edited): (e)1 now records the unlock branch (seat’s bar, prior offer in `view.before.levels`); (a)9 records the levels comparison on a refuse or a no-action step. New sha256 `6caf55c6cea6ff01cfb933914754fa34fef0a5a2887469faa9d37cef7a11f533`.

---

## Recheck r2 `2a9441f`

**Date:** 2026-11-12 08:16 Europe/London (GMT)
**Copies** (sha-verified under `/workspace/qa-runs/s19-review/r2/`): step-19.md `6309fe0d…` (186 lines); README `26d79d52…`; spine `218136c1…`; proto HEAD `2a9441f287f8f87f0df3b6482ee6c76a2ed7d61f` (fixes in `350e5a0`; `2a9441f` adds `notices.length === 8` to the timed test). Diff vs r1 proto `34b1b9d`: 7 files, +91/−16. Scripts: `s19-greps.sh` `db05b662…`, `s19-grep-plants.sh` `7e11f6a5…`, `s19-plants.sh` `2f757661…`, `s18-plants-B-r2.sh` `8beafd0b…`. `prefix/` holds the r1 backups (`c0c02b85…` / `df4abbd4…` / `5a2e5a82…`). GUIDE `27a12d2f…` and `chaos-player-invariants.md` `6caf55c6…` are unchanged. Pins unchanged (`f00c722c` / `1e5dd82c` / `45a3dbaa` / `4d7bbf48`; lock `d7f64a09`). The fetch-only clone and `refs/cmp/*` were not touched.

### Result

**OK TO SEND** on kit r2 (step `6309fe0d…`, proto `2a9441f`). Both hold items are closed, pinned with tests and plants, and re-probed. Official reruns match EA: green **472/0**, sim and all 16 base smokes plus the 4 exploit-levels lines byte-identical, G7 **248/400** (caps 288, 4 lines of slack on every file), greps **40/40**, grep-plants **19/19**, plants **33/33** (M1–M11 new), s18-plants-B-r2 **36/36**.

### (1) Hold probes, re-run

Log: `qa-runs/s19-review/r2/_r2_probe.log`. Official cases plus extras.

- **Malformed `effects` in `submit` before `log.append`:** missing, `undefined`, `null`, a string, `{}`, `[7]`, `[id, null]`: no throw, one `unlockFailed` each, `lastSeq` stays 0, levels byte-identical. A getter that returns `null` is the same. A Proxy of `[first]` is accepted and unlocks (Array.isArray + strings). `parseLog` of a JSON log with no `effects` array is still `bad entry`.
- **Timed unlock spoiled before it lands:** `submit` of `durationMs: 100, effects: [first]` logs (`lastSeq` 1) and adds no notice; then `effects = null` (or `[""]`) and `advance(200)`: apply re-checks a copy via `idsOf`, one more `unlockFailed`, offer kept, no throw. An unspoiled timed unlock still lands and unlocks. `2a9441f`’s `notices.length === 8` is sound: the seven immediate rejects leave 7 notices, the timed submit does not add one, and the eighth notice is apply’s. `clock.after` / `clock.step` swallows a callback throw and reports it only to `onError` (the world does not hook `onError`), so a throw in `apply` would *not* fail `assert.doesNotThrow(advance)` and would leave the count at 7. The count pin is what makes a swallowed throw fail the test. Probe hooked `onError`: no clock error was reported on the spoiled or unspoiled paths.
- **Apply refuses `""` by name:** after create, `pools.knight.push("")`, offer stays `["guard", "charge"]`. A world whose `choose` records calls and returns `true` still gets `unlockFailed` for `effects: [""]`; `choose` is never asked; the well-formed action is logged (`lastSeq` 1).

### (2) Frozen copies and draws

- **Mutate-after-create** keeps the offer `["guard", "charge"]`. The copy is deep enough for this setup: `rules`, `thresholds`, `offerLevels`, `xp`, the pools object and each pool are frozen slices / new objects; `xp.move` is copied by value. Mutating the caller’s `thresholds`, `offerLevels`, `xp.move`, `offerSize`, or `pools.knight` (push `""`, overwrite `[0]`) changes nothing. `offer()` returns a slice (pushing onto it does not change the bar). `levels.rules` stays the original numbers. Assignment to the frozen copy throws `TypeError` in the ESM tests (strict).
- **`exploitWire`:** `requireGen` reads `stream` and weights once into a frozen copy; editing `gen.stream` / `gen.mix` after the call leaves 40 wires byte-identical. `EXPLOIT_KINDS` and `CHAOS_CHECKS` (array and each entry) are frozen; a push throws. Chaos and exploit baselines, and the four exploit-levels hashes, are byte-identical to r1 / the kit.

### (3) Deferred items — acceptable

The new “Not in this step” line is accurate and is a fair deferral for this step:

- **Other hand-built action shapes can still throw in `submit`:** a move with missing `effects` is still `TypeError: a.effects is not iterable` in `packAction`; a move with `target.at === null` is `TypeError` reading `c`; an unlock with non-integer or negative `durationMs` is `RangeError: after: ms must be an integer >= 0`. The door and `parseLog` never build these. A general shape guard in `submit` is a later slice, not this one.
- **`src/core/log` is rightly do-not-touch.** `packAction` is the shared packer (`effects: [...a.effects]`). Changing it would be a spine change beyond pick-hardening. `submit` now short-circuits a malformed *unlock* before `append`. `chaos-gen.ts` still reads `gen.mix` live (confirmed; it is in the DNT set and not a step-19 file). The BTF presets stay mutable objects and are now copied by `createLevels`.

Residuals, not a send-block (hostile extras, not the carry): `idsOf` uses `Array.isArray` + `.every`, which skips holes, so a sparse `effects` array (`[id, hole]`, `[hole, id]`) is treated as well-formed, gets logged, then `apply` still gives `unlockFailed` and keeps the levels (no throw). A getter that returns a valid string array on the `idsOf` check and a non-array when `packAction` re-reads the live action still throws `TypeError: a.effects is not iterable`. A throwing getter, a throwing Proxy, or a revoked Proxy also throw on access. These sit with the deferred “hand-built shapes that can throw in `submit`” plus do-not-touch `core/log`.

### (4) L13 / D8 re-adaptation

`s18-plants-B-r2.sh` differs from `s18-plants-B.sh` in only those two plants; intents and expected tests are unchanged.

- **L13 “bad rules accepted”:** old text removed `if (bad(setup.rules, setup.pools)) throw …`. New text is `if (own === null || bad(own.rules, own.pools)) throw` → `if (own === null) throw`. Still skips the *content* check; a failed copy (bad shape) still throws. Caught on `["bad"]`.
- **D8 “a replayed pick with no offer is silent”:** retargeted at apply’s `… !world.levels.choose(action.actor, ability)) world.notices.push({ ...failed })` → `void 0`. Does not strip the new pre-append malformed path in `submit`. Same intent. Caught on `["door"]`.

### (5) Reruns (on proto `2a9441f`)

| Check | Result |
|---|---|
| `npm run green` | exit 0; **472/0/0/0**; tsc / lint / deps (77 modules, 225 deps) / check:state / check:law OK. Log: `qa-runs/s19-review/r2/proto-green.log` |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| Existing smokes (16) | **byte-identical** to r1 / the earlier pins (gen 1730/278 and 3154/563; chaos 3120 and 5542; exploit 1604/309, 1617/367, 2043/480, 2299/592; docs 581/1419 and 607/1393; six levels histories unchanged) |
| Exploit-levels (4) | **byte-identical** to r1 / the kit: hashes `b4200d6e…` / `78bc5fb6…` / `1bdb1347…` / `7e7ee7a6…` |
| G7 `7a0de0c..HEAD` excl. handback/lock | **10 files, 248** ≤ 400 (caps add up to 288). Per file, all slack 4: levels.ts 18/22, actions 10/14, chaos 10/14, exploit 30/34, types 3/7, rules test 17/21, bot 6/10, exploit-levels 102/106, exploit.test 5/9, levels test 47/51 |
| Pins | unchanged (`f00c722c` / `1e5dd82c` / `45a3dbaa` / `4d7bbf48`; lock `d7f64a09`) |
| Greps | **40/40 ALL OK** (includes new R5c / R5d / R5e). Log: `qa-runs/s19-review/r2/proto-greps.log` |
| Grep-plants | **19/19** caught (G13–G19 are the hold / copy plants). Throwaway clone restored at `2a9441f` |
| Kit plants | **33/33** caught (A1, M1–M11, A2–A4, B1, C1–C3, E1–E6, F1–F2, K1–K6) |
| s18-plants-B-r2 | **36/36** caught, including re-adapted L13 and D8 |

### (6) Doc drift vs r1 (`c0c02b85` / `df4abbd4` / `5a2e5a82`)

Consistent and honest. The step title, Goal, Behaviour 1–2 and 7, Files/caps (288 / proto 248), Tests, plants M1–M11, and “Not in this step” describe the hold fixes. Kit line claims 472/0, proto `2a9441f`, 248 of 400, greps 40/40, grep-plants 19, plants 33, s18-plants-B-r2. README status, the step-19 table row (Lines 186, ~248), and Verification match. Spine status and the same table row match (`kit r2 after QA's HOLD`). No contradiction with the code. `/workspace/tileengine/` already holds these r2 docs; `prefix/` keeps the r1 bytes. Invariants doc was not edited again (r1’s (e)1 / (a)9 wording still holds).

Typography / leftover naming is not a reject.
