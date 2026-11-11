# Step 11 lean review (player driver, chaos step A)

**Date:** 2026-11-11 11:37 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-11-player-driver.md` sha256 `94d1b25b0c8ec745e94a8b2668fe0890be4efec89e576a5fe230933f0ca3f55b` (175 lines)
**Backup of this sha:** `/workspace/qa-runs/s11-review/step-11-94d1b25b.md`
**Base:** `e9d48204668a58af1944e0b21909c2627a5ef2c7` — confirmed `origin/main` / clone HEAD (PR #15 merge of step 10c). Clone working tree left untouched; remotes were not fetched or reset.
**CN:** none. depcruise pin `dcf61c61…`, core-types pin `f00c722c…`, and `package.json` `1e5dd82c…` hold on both the base and the proto.
**Kit:** README sha256 `b13f4b22c2256057e200038e0f5f971e9e2c1fdf0178caa852408d293a05aeaf`; outline (core-spine-slices) sha256 `9efa354a634ae736e96adfaa3d1e25d68e612ee305eaf63299c865d59cfe546d`; chaos-player outline sha256 `ef384d2a450619d2098da1d71b1bc1ecdb96747e05fd9d08853b4bc9f4128a7e` (110 lines). Pre-11 backups `/tmp/handoff-README-pre-11.md`, `/tmp/core-spine-slices-pre-11.md`, `/tmp/chaos-outline-pre-step11.md`.
**Prototype:** `/tmp/s11-proto` was not modified (HEAD `6f673a7b2d54f7918c78776f53b04f18aa2605c8`, clean, branch `proto`). Fresh copy: `qa-runs/s11-review/proto` at the same commit, Node v24.22.1.
**Remotes:** read-only. Handoff, the step file, EA's `/tmp`, existing `refs/cmp/*`, and earlier qa-runs trees were not edited. GitHub and Drive were not touched.

## Result

**NOT OK to send** on sha `94d1b25b…` (175 lines). One blocking test-coverage gap: Behaviour 2's `TAP_MOVE_CELL` `noUnit` / `notOwn` path (no selected unit, or a selected unit that is now unknown, dead, or on another side) has no test. A plant that drops `own(sel)` on `TAP_MOVE_CELL` and keeps only the `offGrid` check stays **5 pass / 0 fail**. Everything else (shas, green, G7, pins, sim, greps, build law, `CONFIRM_TARGET` → `noAction`, seats layering, kit drift, outline §6 / §9) checks out.

---

## Blocking fix

In `handoff/steps/step-11-player-driver.md`, **L112** (the “rejects are reported…” test bullet). After the existing thirteen-feed / `history()` assertions (leave that count as-is; use a **fresh** player so the list is unchanged), add:

> On a fresh player with `phases = { battle: "unitSelected" }` and no `SelectUnit` through that player, `TargetCell (0,7)` is `noUnit` (event `TAP_MOVE_CELL`), leaves `JSON.stringify` of `units`, occupancy, `logSeq` and phases unchanged, and has no action. After `SelectUnit knight#1` then `world.units.remove("knight#1")`, `TargetCell (0,7)` is likewise `noUnit`.

(Verified on the proto: that first feed already returns `noUnit` / `TAP_MOVE_CELL` / `logSeq` 0. `units.remove` is the existing core API for “now unknown or dead.” `side` is `readonly` with no setter, so `notOwn` on a later tap is the same `own(sel)` helper; the two `noUnit` cases are enough to fail the plant that drops it.)

No other blocking edits.

---

## 1. Shas / line counts / Base / kit — PASS (aside from the test gap above)

| Check | Result |
|---|---|
| Step sha / lines | `94d1b25b…`, **175** lines, matches EA |
| Base | `e9d4820` is `origin/main` (PR #15, step-10c merge) |
| Pins | core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock unchanged, all identical to base |
| CN | none, as claimed |
| Kit shas | README `b13f4b22…`, core-spine `9efa354a…`, chaos outline `ef384d2a…` / 110 lines, as claimed |
| Kit diffs vs pre-11 backups | 11 status/table/verification only. README: 10c merged at `e9d4820`, new 11 row (175 lines), Later points at chaos B/C, verification adds 11 on `e9d4820` 166/0 sim unchanged 251 of 290, §5.2 “00–11”. Core-spine: status 00–10c merged at `e9d4820`, step 11 written, 10c marked merged, new 11 row (`~250`). Chaos outline: §1 online-as-a-driver rule, §6 25-run gate, §7 names step A, new §9 |

Core-spine’s `~250` is the change-count band (proto is 251), not the 175-line file; README’s table has 175 and the verification line has 251 of 290. Residual, not a block: the Nov 10 blockquote in core-spine still says “steps 00–10b … merged as of `d9ca13b`.”

---

## 2. Prototype `6f673a7` — PASS (green, caps, quotes, greps)

On the copy `qa-runs/s11-review/proto`, Node v24.22.1. `/tmp/s11-proto` was not touched.

| Check | Result |
|---|---|
| `tsc` / `npm run green` | exit 0; **pass 166 / fail 0 / skipped 0 / todo 0** (161 prior + 5 new player tests) |
| `npm run sim` | unchanged: 6×9 **48/2** `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, 12×12 **22/28** `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c` |
| G7 `e9d4820..6f673a7` excl. handback/lock | **6 files, 237+/14− = 251** ≤ 290 and under ~270 (no “say so”). name-status is exactly the six files (A `player.ts`, `seats.ts`, `player.test.ts`; M types, driver-phase, index). DNT empty |
| Per-file caps | all hold, ≥ 4 lines of slack each: types 32/38, player.ts 50/58, driver-phase 45/52, index 3/7, seats 13/18, player.test 108/116 |
| Quoted blocks | `MatchOptions.seats` (after `maxSimMs`), `IntentInput`…`Seat`, and `src/sim/index.ts` are **verbatim**. `createPlayer` declaration matches |
| `/tmp/s11-greps.sh` | **ALL OK** (all 28). Pins included |

### Residual grep misses (on record; not a send block)

`no-numbers-in-player` and `one-createPlayer` still have the known holes. Plants in `player.ts`, then reverted:

| Plant | Grep result |
|---|---|
| `10_000`, `.5`, `4e2`, `0x190`, `4_00` | **miss** (`no-numbers` still ok) |
| `const _n = 200;` | **caught** |
| Rename `createPlayer` → `createPlayerX` | **miss** (`one-createPlayer` still 1; no trailing word boundary) |

Same class of residuals as earlier steps. A tighten (`\b` after the name; a number pattern that includes `_`, leading `.`, `0x`, and `e`) would close them.

---

## 3. Kit vs code, plants, build law

Quotes and the five named tests match the step (50-seed hashes, the thirteen-feed reject sequence including targeting `noAction` and moving `illegal`, tap-move `k1` / 200 ms / blocked `moveFailed`, gesture event list, `onStep` / replay / bad seats). `asIntents` / `counter` live only in `tests/sim/seats.ts`.

### Plants (reverted; `tests/sim/player.test.ts` only)

| Plant | Result |
|---|---|
| Skip `submit` (intent→submit mapping) | **2 pass / 3 fail** — 50-seed histories, tap-move, and gesture tests |
| `notOwn` always ok | **4/1** — named reject test |
| Skip `offGrid` | **4/1** — named reject test |
| `CONFIRM_TARGET` not `noAction` | **4/1** — named reject test |
| `noEvent` never | **4/1** — named reject test |
| `illegal` never | **4/1** — named reject test |
| `noUnit` never (on `own()`) | **4/1** — named reject test (catches `SelectUnit ghost#9` only) |
| Drop `own(sel)` on `TAP_MOVE_CELL` only | **5/0** — **the blocking gap** |

### Build law — PASS

One clock: no `Date` / `performance.now` / rAF / `setTimeout` / `Math.random` in `src/sim`, `src/fx`, `src/runtime` (incl. input), or `src/btf-adapters`. `createClock` / `clock.advance` only in `world.ts` (2 lines). The player never steps, advances, or `replayTicks`. One `submit(` in `player.ts`, still exactly two in `driver-phase.ts` (AI path only). One `kind: "move"` with `pipe: "tile"`. No numbers or side-name literals in `player.ts`. No game-rule words. Phases replaced whole (no dotted writes). Nothing outside `src/sim` imports sim; sim does not import fx/btf. No `node:` / fetch / file I/O in `src/sim` or `src/runtime`. No copied BTF/chess tree. Moves go only through `submit`; `feedIntent` itself still submits nothing (`intents.ts` unchanged, no `submit`). Scope: no action menu; `CONFIRM_TARGET` is the reported reject `noAction` until M9. `check:state` / `check:law` / depcruise OK (60 modules, 170 deps).

### EA points

**(2) `CONFIRM_TARGET` → `noAction`.** Matches the kit and the tests. From `idle`, `Confirm` is `noEvent` (no mapped event). From `targeting`, both `TargetCell (0,7)` (maps to `CONFIRM_TARGET`) and `Confirm` with aim `(0,7)` are `noAction`. Deferred to M9 / `CHOOSE_ACTION`, as in “Not in this step.”

**(3) Driver in `src/sim`.** Allowed under current layering and the unchanged CN-007 cruiser: `src/sim` may import `src/state` and `src/runtime/input`; nothing imports sim. `npm run deps` is clean. The step already says a later move out of `src/sim` (with the intent mapper, once a runtime layer may import `src/state`) needs a Change Notice. Note only; not a block.

---

## 4. Drift / outline — PASS

README and core-spine claims match the kit (175-line file, 166/0, sim unchanged, 251 of 290, base `e9d4820`, no CN, seats / `onStep` / reported rejects).

**Outline §6 25-run gate** matches the CEO wording: report-only until **25 clean runs in a row with no false alarms** (CEO range 20–30; EA picked 25; tunable later); then chaos may block. Every blocking failure is vetted first (QA reruns the replay and rules real bug vs bad promise; Grok Build confirms by fixing the bug or correcting the promise). A promise only goes in when BTF’s tested behaviour backs it. **25-run fits** that range.

**§1** adds the standing rule that online play is just another driver (intents in, `submit` out; the rules core never knows who is playing). **§9** is correct: game-side chaos (engine and later system promises: achievements pay once, buttons fire one action, asset packs load against a failing fake store) vs dev-side security (matters most): tampered saves/imports, forged or malformed intents, replayed purchase/reward events, currency dupes, asset sandbox escapes, later online cheat/fingerprint spoofing. Forged intents can enter through the player driver once harness B exists.

---

## 5. Invariants doc (QA-owned; updated this pass)

`docs/qa/chaos-player-invariants.md` row **(a)9** now records the step-11 split, verified on this proto before writing: driver rejects leave `units`, occupancy and `logSeq` unchanged and append no sim action; a move to a blocked or taken cell **is** submitted (`moveFailed`, `logSeq + 1`, units and occupancy unchanged). New placeholder **(e)** lists the CEO 2026-11-11 dev-side security topics and the game-side system promises. New sha256: `13f93c684839217afe082faa23885596791a42c8794d77e2bd4198d140c26625`.

---

## Notes (not blocking)

1. Residual number and prefixed-name grep misses, as planted above.
2. Core-spine Nov 10 blockquote still cites `d9ca13b` / steps 00–10b.
3. The reject test’s `still()` snapshot is units, occupancy, `logSeq` and phases, not notices; the reject path never calls `feedIntent` / `submit`, and the test already asserts `log.lastSeq() === 0` and no `moveFailed`. `nextId` “never otherwise” is true in the proto but not directly asserted.

---

## Repro (copy only; `/tmp/s11-proto` left alone)

```bash
cp -a /tmp/s11-proto /workspace/qa-runs/s11-review/proto
cd /workspace/qa-runs/s11-review/proto
# Node v24.22.1
npm run green          # 166/0
npm run sim            # 48/2 afc89d56… and 22/28 b8007292…
git diff --shortstat e9d4820 -- . ':(exclude)handback' ':(exclude)package-lock.json'
# 6 files changed, 237 insertions(+), 14 deletions(-)
sh /tmp/s11-greps.sh . e9d4820 HEAD
```

---

## r2. Recheck of the TAP_MOVE_CELL noUnit blocker (2026-11-11 11:40 Europe/London, GMT)

**Step (this pass):** `handoff/steps/step-11-player-driver.md` sha256 `1fe7b415ec397bd8d8a8e809677af57588b9dd97e8618d54c7a531e7b7806bfd` (175 lines)  
**Backup of this sha:** `/workspace/qa-runs/s11-review/step-11-1fe7b415.md`  
**Pre-r2 (history only):** `/tmp/step-11-pre-qa1.md` = sha `94d1b25b…` (the r1 kit, 175 lines)  
**README:** sha256 `1a82e2dcdb7453908894edfde23410dc2ba2a9a01fd76eb486172955cb9df5a8`  
**Prototype:** `/tmp/s11-proto` was not modified (HEAD `07ae028cc54c045f2ea87470fe3f2fd46f0a61c5`, clean). Fresh copy: `qa-runs/s11-review/proto2` at the same commit (r1 copy `qa-runs/s11-review/proto` at `6f673a7` left intact). Node v24.22.1.  
**Base / remotes:** unchanged. Clone left at `e9d4820`. `/tmp` and existing `refs/cmp/*` were not edited.

### Result

**OK TO SEND** on sha `1fe7b415…` (175 lines). The r1 blocker is fixed. No new blocking findings.

### Kit delta `94d1b25b` → `1fe7b415` — PASS

`diff -u` against `/tmp/step-11-pre-qa1.md` is only the agreed lines:

- L39 player.test cap **116 → 120**
- L41 total cap **290 → 294**, per-file sum **289 → 293**, prototype figures **244+/14− = 258**
- L112 reject-test bullet: the two `noUnit` cases, on a fresh player, with the thirteen-entry `history()` left as the first player's only
- L162 G7 checklist **≤ 290 → ≤ 294**

The two cases are present and match the required meaning (no `SelectUnit` on a fresh player in `unitSelected` → `noUnit` / `TAP_MOVE_CELL`; `SelectUnit knight#1` then `world.units.remove("knight#1")` → likewise `noUnit`). The kit wording is not a byte-for-byte copy of the r1 suggested sentence: it adds “Then,”, backticks on occupancy and phases, and “(from idle)” before the remove (needed, because the fresh player starts in `unitSelected`), “with nothing changed,” and a reminder that the thirteen-entry `history()` stays on the first player. That is a clarification, not a miss.

### Prototype `07ae028` — PASS

| Check | Result |
|---|---|
| `npm run green` | exit 0; **pass 166 / fail 0 / skipped 0 / todo 0** |
| `npm run sim` | unchanged: 48/2 `afc89d56…`, 22/28 `b8007292…` |
| G7 `e9d4820..07ae028` excl. handback/lock | **6 files, 244+/14− = 258** ≤ 294. Same six-file list. The only code delta vs r1 proto `6f673a7` is `tests/sim/player.test.ts` (**+7 lines**, 108 → 115): the two new `noUnit` feeds on a fresh `q`. `player.ts` and the other four files are byte-identical to r1 |
| Per-file caps | all hold, ≥ 4 slack: types 32/38, player.ts 50/58, driver-phase 45/52, index 3/7, seats 13/18, player.test **115/120** (slack 5) |
| Pins | core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock unchanged |
| `/tmp/s11-greps.sh` | **ALL OK** (caps in the script are 120 / 294) |
| README L45 | sha `1a82e2dc…`; verification line says **258 of 294**, matches |

**Cap raise is justified.** Test growth is only the new case (+7 lines in `player.test.ts`, G7 251 → 258). The old 116 cap would have left **1** line of slack (115/116), under the 4-line rule, so the cap had to move. +4 on the file cap, the per-file sum, and the total (116→120, 289→293, 290→294) restores 5 lines of slack. Under ~270 still; no “say so.”

### Plants (reverted)

| Plant | Result |
|---|---|
| Drop `own(sel)` on `TAP_MOVE_CELL` (the r1 gap) | **4 pass / 1 fail** — named reject test now fails |
| Skip the exists check after `remove` (`own()` treats a dead unit as present: `if (u === undefined)` only) | **4 pass / 1 fail** — same reject test (the select-then-remove case) |

The r1 blocker is closed.

### Repro

```bash
cp -a /tmp/s11-proto /workspace/qa-runs/s11-review/proto2
cd /workspace/qa-runs/s11-review/proto2
# Node v24.22.1
npm run green          # 166/0
npm run sim            # 48/2 afc89d56… and 22/28 b8007292…
git diff --shortstat e9d4820 -- . ':(exclude)handback' ':(exclude)package-lock.json'
# 6 files changed, 244 insertions(+), 14 deletions(-)
sh /tmp/s11-greps.sh . e9d4820 HEAD
```
