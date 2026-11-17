# QA review: step-ed-e7-designer-page2 (kit-1 r2, proto r2), full review, LEAN
QA & Build Guard, 2026-11-17 (GMT). Evidence: `docs/qa/qa-runs/effect-designer/e7/`. The clone is fetch-only and only `refs/cmp/*` were made. Nothing was pushed and nothing was written to GitHub or Drive.

## Verdict: **OK TO SEND, code-wise; no code must-fixes and no pin.** The send is blocked on one kit item, K1: the push list.

## Intake
- Bundle `step-ed-e7-proto-r2.bundle` sha256 `d6318e25…275a`. It verifies and requires `82326beb`. Heads:
  - `proto/ede7-r2` = `c24bf63b3920…dce3` (tree `129c45e8`), on `proto/ede6-r4-on-82326beb` = `30296cbb`.
  - Refs: `refs/cmp/ede7-proto-r2` and `refs/cmp/ede6-r4-on-82326beb`. Every commit is noreply.
- `30296cbb` is E6 r4 replayed: its src/tests/tools diff over `82326beb` is **byte-identical** to `41ac9bcc..29773066`. My E6 pins are untouched (`effect-e6-qa` `738e46f5`, `effect-e6-qa2` `1a053e58`).
- E7 `30296cbb..c24bf63b`: 12 files, +257/−21 = **278** (cap 282, one step, ≤ 400). There is no diff in `src/runtime`, `src/core` or the pins.
  - Build law: the gates' law check passed; page 2 is `tools/` only.
  - DOM-free logic sits in `mixer.ts` and `ulid.ts`.
  - The doc keeps § Helpers & self-review (REJECT if missing).
- Kit (`scratch-ea/ede7/r2/kit-src`), all as stated: doc `08f2ef8c`, paste `d99cebbd`, `effect-e7-carries` `31a4d5b7`, `ed-e7` `1571a811`, `ed-e6` `c251876c`, `smoke.mjs` `922ffb26`.
  - The shipped tests are byte-identical to the proto.
  - The doc's L26–L222 equal the paste's L10–L206 (197 lines).
- `ed-e6` test 13 is **not weakened**:
  - The `B32` needle moved to `ulid.ts`, which `effect-e7-carries` L14 pins (alphabet, 26 chars, every byte used, time order).
  - The catch count 2 → 3 is still an exact `equal`, now covering Redo.

## Gates (`pgrep` checked clear in a separate step before each run; one at a time)
| Ref | Main | Floor | Tests | Result |
|---|---|---|---|---|
| `c24bf63b` | `82326beb` | 916 | 916/0 (882 + 18 E6 + 16 E7) | **PASS**, stress clean |
| trial `fffac39d` = c24bf63b merged onto `75df4642` | `75df4642` | 916 | 938/0 (main 904 + 34) | **PASS**; clean merge, no overlap |

Expected floors on today's main: **E6 922** (904 + 18). Then **E7 938** (E6-merged main + 16).

## Plants (`plants-r2.log`; a plant is caught when the E5 + E6 + E7 tests fail)
- **EA `ede7-plants-r2.py`: 42/42.** **QA `qa-ede7-plants.py`: 20/22.** Caught:
  - D8a: a gone entry kept (H1); a changed copy read as gone (H2).
  - Redo: a taken live name not refused (H4); a move back onto the trash path (H5).
  - D8b purge: filter off; non-`.json`; `../` and sub-path names; listing the live dir; a failure aborting boot; no boot purge (H7–H12).
  - fitZoom: floor 2; round instead of floor; width only; dpr ignored (H13–H16).
  - ULID: 9 time chars; 15 random; one byte reused; fractional clock; 8-byte minter (H17–H21).
  - Redo handler not caught (H22).
- **Missed, report-only (equivalent in E7's flow):**
  - H3: `trashGone` without the move-source test. It only changes the toast when the owner file was deleted (got `null` on a non-move name). That redo can't succeed either way.
  - H6: `redoGroup` accepts another group's ops. This is unreachable: the page redoes its own in-memory docs, and a `Save & use` closes the redo. Optional: one more `assert` each in `effect-e7-carries` tests at L52 (D8a) and L26 (redo).

## Scope judgments
- **D8 (DSK `5b0fcb6c`):** all three conditions met.
  - (a) A redo whose `.deleted` copy is gone writes nothing (`commit` checks first), names it, and drops only that entry.
  - (b) `purgeTrash` takes only `^[^/]+\.json$` names listed in `effects/.deleted/` and is best-effort.
  - (c) The two-tab limit is documented (doc L206).
  - Report-only: OPFS `keys()` also lists sub-folders. A sub-folder named `*.json` is passed to `removeEntry`; it is removed if empty, and otherwise the error is caught.
- **S2 is closed:** the purge list stays in page memory, but the boot purge clears what a reload left. Pinned by carries L47 + L59 (D8b) + smoke.
- **S3/R15 is closed:** the mint is in `ulid.ts` with an injected clock and bytes and is tested (carries L14).
- **Redo:** `redoGroup` restores the created doc from `.deleted` and refuses when the name is live (`Object.hasOwn`). `commit` also wants an empty target, so it never overwrites a live file.
- **fitZoom:** the largest integer scale over both sides, floor 3 (23 at 390, 22 at 360, 3 on bad input). The Fit chip is pressed at open.
- **UX-1…8** are recorded as ruling 18.

## Smoke (Chrome 156, headless)
- EA's shipped `smoke.mjs` at 390×844: **37 ok, SMOKE PASS**: Fit scale 23, one rAF per frame, 49 buttons, no page errors (`ea-smoke-390.log`).
- My `smoke-qa.mjs` at 390 and 360 wide: Fit pressed at open; max 1 callback per frame including after Turn/zoom re-boots; 28 buttons, min **48×48**; Save/Undo ("Undone. Redo")/2nd Save purge; 4 bad owner files refused with files unchanged; **no page errors** (only the favicon 404).

## Findings
- **K1 (kit, blocks SEND, not code).** There is no `push-sha256.txt` for E7 yet. DSK D8 lives only in `/workspace/tileengine/handoff/dsk-rulings/2026-11-17-phase1.md` (`5b0fcb6c`); main `75df4642` still has `58cf837c` with no § D8, yet doc L11/L21 call D8 "met". The push list must ship the rulings file (`5b0fcb6c`) with the doc, paste and 3 tests (+ `smoke.mjs` as stated), expect-base = E6-merged main.
- **S1 (should-fix, the own-key class).** `mixer.ts` `chips()` and `beatRow()` index plain `zero()` objects by a beat that comes from the doc. `beatOf` returns a part's single `beats[0]` unchecked, so it can be any string.
  - A part beat of `constructor`/`toString`/`hasOwnProperty` yields `beats.constructor = "function Object() { [native code] }1"`, a string in a number row, and the step is counted in no real beat. `__proto__` silently drops it (`probe-ownkey.log`).
  - It is display-only: never saved, no throw. So this is a should-fix, not a pin.
  - Fix: count only when `Object.hasOwn(row, beat)` (or use a `Map`), plus one test line.
- **Report-only:** H3/H6 test lines (above); the `keys()` sub-folder edge; the favicon 404.
