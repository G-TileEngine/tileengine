# step-p1-6h-hardening: Phase 1 P1-6h "Play-page / bot / taken() hardening" (QA-triaged Grok Heavy findings after P1-6 r2). A tested 44 CSS px floor per play-stage cell (pan or scroll when a map cannot fit; do not shrink); `botAbilityPriority` takes required `actionsPerTurn` from the ACTION_BUDGET knob, requires `setup`, and names `DEFAULT_STEP_REACH`; `taken()` copies reach/abilities onto `Object.create(null)` (JSON `__proto__` plant + `whole()` Infinity); untested play-page taps (foreign-side unit, walk beyond reach, second tap on a non-reach tile) are locked to the P1-6 intended behaviour. Lands after E7p and before P1-7 so the fixes are on main and QA-reviewed before P1-7's go-line. Kit-run browser smoke at 390×844 and 360 wide.

Step id: step-p1-6h-hardening          Revision: r1
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: current main when you start (at kit authoring, `origin/main` is `70c4d07d7d70cbd209babe3e8bb41564b643e73a`, runnable count **981**, with P1-5 r2, ED-E7 and P1-6 r2 already merged). **E7p must already be merged on that main** (and therefore P1-6…P1-2 and E7). Floor = that main's test count + 4. If E7p is not on main, or if those APIs on main differ from what the shipped tests import, **stop and report**. At kit authoring the stack after E7p is 988/0, so the authoring floor is **992**. Branch: `step/step-p1-6h-hardening-r<N>-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.
Hand-back location: `handback/step-p1-6h-hardening/r<N>/HANDBACK.md`. Quote this step file's sha256 in full in it.
Depends on: E7p (and therefore P1-6 r2, E7, P1-5…P1-2). Build order on main is E6 (merged) → P1-3 (merged) → P1-4 (merged) → P1-5 (merged) → E7 (merged) → P1-6 r2 (merged) → E7p → **P1-6h** → P1-7 → P1-8 → P1-9.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Goal
P1-6 r2 is on main (`d87d0515`, ChatA rewrite, 981/0 after the QA review at `70c4d07d`). These five QA-triaged hardenings must land and be reviewed before P1-7's go-line:
1. **44 CSS px cell floor.** `fit()` (and any later `fitBoard`) must not drop a cell under 44 CSS pixels. A 12-wide map at 360 CSS @3x used to shrink to about 27 px (`s = floor(min(devW/mapW, devH/mapH))`). Keep `s = max(minS, fitted)` with `minS = ceil(MIN_CELL_CSS * dpr / TILE)` and `MIN_CELL_CSS = 44`. If the map cannot fit at that scale, keep the floor and pan or scroll (P1-7 camera) instead of shrinking. Demo 6×9 at 360@3x still fits. A shipped test must fail when a cell would drop below 44 CSS px.
2. **Bot defaults.** `botAbilityPriority` must take required `actionsPerTurn` from the ACTION_BUDGET knob (`actions_per_turn`, default 2, via `installOne(ACTION_BUDGET, {})`). The board must pass it. `setup` is required (no `{hp:1, atk:1}` fallback — that changed the lowest-HP tie-break). `stepReach ?? DEFAULT_STEP_REACH` with a named, documented constant (`DEFAULT_STEP_REACH = 2`, the P1-5 bot default; not a hidden game-rule default in the engine). Throw `botAbilityPriority: setup and actionsPerTurn required` when setup is missing or `actionsPerTurn` is not an integer ≥ 1. Game rules stay out of `src/core` and `src/sim`.
3. **`taken()` null-prototype.** `taken()` still wrote reach/abilities into a plain object, so an own JSON `__proto__` key could set the copy's prototype. Copy onto `Object.create(null)` (or a Map), use `Object.hasOwn` on keys, and copy ability rows. Ship a JSON `__proto__` plant test and a `whole()` Infinity test (`Number.isInteger(Infinity)` is already false; the test must name Infinity).
4. **Play-page taps.** Lock the current intended P1-6 behaviour (ChatA `intend()`, as in the P1-6 doc): a foreign-side unit tap rejects `"notOwn"` and does not select; a walk beyond reach rejects `"notReachable"`, does not walk, and clears the pending preview; a second tap on a non-reach tile after a reach preview is a "different tile" that clears the preview and does not walk.
5. **Docs.** This kit has no "pin files" contradiction. P1-7's restacked kit must not forbid keeping P1-6h's play-stage tests or contradict Gates. The E7 step-file floor-971 text is left unchanged.

## Rulings made
- Route is a small **P1-6h** kit (131 lines, cap 400, N = 4), not a fold into P1-7 r3: prior P1-7 was 447, plus 131 is 578 already, and the ChatA board rebase inflates `board.ts` / `page.ts` further past 500. Landing after E7p and before P1-7 keeps the go-line clean with one extra kit and fewer failed-fold surprises.
- Work against the **merged ChatA** P1-6 board (`fit`, `intend`), not the unmerged proto board.
- `MIN_CELL_CSS = 44` lives in `tools/play-stage/board.ts`. P1-7 must honour the same floor in `fitBoard` / `zoomAt`.
- `DEFAULT_STEP_REACH` is documented in `bot-ability-priority.ts`. `actionsPerTurn` is required on the options type; the board and any host that seats the bot must pass the knob value.

## Open questions
None. Defaults above stand.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/rules/battle/battle.ts` | `taken()` copies stats/reach/abilities onto `Object.create(null)` | 16 | 20 |
| `src/rules/turns/bot-ability-priority.ts` | required `setup` + `actionsPerTurn`; `DEFAULT_STEP_REACH` | 22 | 28 |
| `tests/rules/battle-p16-heavy.test.ts` | JSON `__proto__` plant; `whole()` Infinity | 12 | 16 |
| `tests/rules/bot-p15.test.ts` | pass `budget.actionsPerTurn` | 2 | 4 |
| `tests/rules/bot-p16h.test.ts` | new, shipped, byte-identical | 24 | 24 |
| `tests/rules/bot-qa-p15.test.ts` | pass `budget.actionsPerTurn` (P1-5 pin still typechecks) | 6 | 8 |
| `tests/tools/play-stage.test.ts` | 44 CSS floor test; foreign / beyond-reach / second-tap tests | 33 | 40 |
| `tools/play-stage/board.ts` | `MIN_CELL_CSS` / `fit` floor; board passes ACTION_BUDGET | 14 | 20 |
| `tools/play-stage/page.ts` | `fit(..., dpr)` | 2 | 4 |
Total ≤ 400 changed lines (proto **131**: src 38, tools 16, tests 77; added+deleted). Hard cap 400.

## Tests that prove it is done (4 new; ship the files byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-6h-hardening/` to the same paths at the repo root.
- `tests/tools/play-stage.test.ts` — existing P1-6 tests stay; add "fit keeps a 44 CSS px floor per cell; a 12-wide map at 360 CSS @3x does not shrink below it" and "a foreign-side tap does not select; a walk beyond reach and a second tap on a non-reach tile do not walk and clear the preview".
- `tests/rules/bot-p16h.test.ts` — "bot requires setup and ACTION_BUDGET actionsPerTurn; DEFAULT_STEP_REACH is the named step cap".
- `tests/rules/battle-p16-heavy.test.ts` — existing Heavy tests stay; add the JSON `__proto__` `taken()` test and name Infinity in the `whole()` ShotRow case.
- `tests/rules/bot-p15.test.ts` and `tests/rules/bot-qa-p15.test.ts` — pass `budget.actionsPerTurn` so they typecheck against the required option.
N = 4. sha256: play-stage.test.ts `b3626ab77f99b8694bebaaa4b6376e8ee4a8ba01de3506b095ba628c16a8403b`; bot-p16h.test.ts `72f5b0348a12e5cfbac55d111a06d888dac955f5235a320746fa289b3965caf4`; battle-p16-heavy.test.ts `06fc4fed5ac20ab95d4e3756cb56a8d76eeac62b524c33e9a2cc6b23f9c69104`; bot-p15.test.ts `25cd5123a4edb942982b8c4e0c3fbdcfa97032569ef1c4c1ad2e7ee03e31384f`; bot-qa-p15.test.ts `4e60d10f1f8d0bcc31cb159baa91599f0e391b387d217c1d79ce10d89aa82b57`.

## How a planted bug is caught
EA plants 6/6 (`p1-6h-plants.py`). Dropping the 44 CSS floor, accepting a foreign-side `SELECT_UNIT` as own, not refusing a beyond-reach `TargetCell` / not clearing the preview, writing reach/abilities onto a plain object, letting `whole()` accept Infinity damage, or restoring `{hp:1, atk:1}` and `actionsPerTurn ?? 2` (dropping `DEFAULT_STEP_REACH`) each fail a shipped test.

## Kit-run browser smoke (0 repo lines)
`handoff/steps/tests/step-p1-6h-hardening/smoke.mjs` is required in the hand-back. From the repo root: `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-p1-6h-hardening/smoke.mjs . 8792 /tmp/p1-6h-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It serves `tools/serve.ts`, opens `/tools/play-stage/` headless at **390 × 844** and **360 wide** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute). Visible (not `display:none`) buttons must be ≥ 44×44. Two-tap walk still ends in `idle` (P1-6 `autoWait`).

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 992 tests passing** (main's count at Base + 4, once E7p is on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on this stack: 992/0.)
- [ ] If E7p is not on main, or if those APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 400 changed lines in total (131 in the proto). Hard cap 400.
- [ ] The shipped test files are byte-identical to the kit copies.
- [ ] **Kit-run browser smoke (REQUIRED)** exits 0 with `SMOKE PASS` at 390×844 and 360 wide (no page errors, no sideways scroll, visible buttons ≥ 44×44, two-tap walk).
- [ ] Never touch `painter-proto/` or `ui-shell/`. Game rules stay out of `src/core` and `src/sim`. BTF is used only via adapters or rewrites with file:line cites (none new in this step).

## Floor
`npm run green` is at least **992** tests passing (main's count at Base + 4, once E7p is on that main: 981 + 7 + 4). If main's count at Base (with E7p already merged) is C, the floor is C + 4.

## Not in this step
- Camera / HUD / Spell / Talk / End turn → P1-7 (must keep this step's 44 CSS floor and tap contract).
- Spell FX in the match → P1-8.
- APK wrapper → P1-9.
- The E7 step-file floor-971 wording.

## Out of scope
painter-proto, ui-shell, GitHub push, core-types, catalogue edits, Phase 2.

## Do not touch
`painter-proto/`, `ui-shell/` (read-only reference is OK), `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts`, `src/sim/migrations`. Do not drop or weaken P1-6's existing play-stage tests (extend them). Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 992 tests passing** and 0 failing (main's count at Base + 4). Paste the summary line and all kit-run browser smoke lines into HANDBACK.md.
- The shipped test files are **byte-identical** to the kit copies.
- The branch starts at the Base (E7p already on main). ≤ 400 changed lines (131 in the proto). Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-6h-hardening-r<N>-chatA` (base = current main when you start; E7p must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-6h-hardening-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
