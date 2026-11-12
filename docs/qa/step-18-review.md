# Step 18 lean review (card-free levelling: side or unit XP bar, seeded pick of three, ChooseAbility at the one door)

**Date:** 2026-11-12 00:48 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-18-card-free-levelling.md` sha256 `e7087e6273506bcaed3fa9905bd75bc56c5b22252d2a97dd349dc2e321178be0` (232 lines). Copy at `/workspace/qa-runs/s18-review/step-18-orig.md` is byte-identical.
**Base:** `573ae0cd2d43b7c30613a1182f2ee53e09d51ab7` — confirmed `origin/main` (PR #22 merge of step 17; parents `63bb952` and `a6e5f77`, as EA described). Clone was fetch-only and left at local `63bb952` (`behind 3`); working tree not checked out or edited.
**CN:** none, as claimed. Pins hold and are identical to Base: core-types `f00c722c…`, depcruise `dcf61c61…`, package.json `1e5dd82c…`, lock `d7f64a09…`. GUIDE sha256 `c27e1292…` (unchanged).
**Kit docs:** README sha256 `52d4e55a9fa16d1d4f7e74bfce10f4e3d85df20cb9b8b521ea00571266c5ea32`; core-spine sha256 `376e3265a68f003a76c0d6796fe01f9ee6fb1f06bc6551a564d2a9a12b30bdcc` (under `/workspace/tileengine/`; not yet on `origin/main`). Status and Verification correctly pin Base `573ae0c` and proto `34e0979`. README’s step-18 Lines cell is **232**. Spine size is **~345**. The outline is intentionally not edited (deferred to the Architect).
**Prototype:** already at `/workspace/qa-runs/s18-review/proto` (HEAD `34e09797af53c6397ace7d70d372d6c43d146b52`, message literally `test title`; first proto commit `df5ed6f` is parented on `573ae0c`). Greps / plants scripts and EA’s `s18-plants.log` were already copied there. `/tmp` was not edited. A read-only worktree at `/workspace/qa-runs/s18-review/base` was added at `573ae0c` for the landing probe and then left clean.
**Remotes:** read-only. Existing `refs/cmp/*` and earlier qa-runs trees were not edited. GitHub and Drive were not touched.

## Result

**OK TO SEND** on sha `e7087e62…` (232 lines). Green is **214/0**, sim is unchanged, G7 is 326+/19− = **345** of 400 with at least 4 lines of slack per file, pins hold, greps **44/44**, plants **36/36** including G1 (the GC test now attaches `onRender` before dispose and fails the planted render-subscriber leak). The ten existing smokes are byte-identical to the step-16/17 pins. The six new levels smoke lines match the kit. Levels-off snapshots are byte-identical to Base. No CN, no build-law miss, no scope creep (exactly the 17 named files; DNT empty). Kit docs are in date (no send-block nits).

CEO rulings (both bars, nothing at 2/5/8 until the ahead/behind sheet, XP is 1 per move for now) and EA’s own rulings (ChooseAbility is a sim-door intent, no M7 CN; under the side bar the side owns the bar/pool/unlock and any seat of that side may pick, a foe seat gets `noOffer`; levelling is opt-in so the existing rng stream does not move) are adopted. `noOffer` and `badPick` are named rejects at the one door, consistent with step 16. A double pick is `noOffer`.

Answers to EA’s three questions are in §§1–3 below. Short version: the written draw order is tight enough to reimplement; two `submit(` calls in `player.ts` are acceptable and both go through the one door; the `runMatch` landing change is a no-op on base / levels-off matches (0 action-without-event steps in the base’s 205 tests and sim) and is pinned for levels-on by the new smoke (`MOVE_DONE` equals the move log) and plant D6.

Residual, not a send-block: neither the chaos generator nor the exploit hunter can send a `ChooseAbility`. The step already defers “a hostile-pick exploit kind.” The proto tip message `test title` is sloppy, not a kit-file issue.

---

## Gates (re-run on proto `34e0979`)

| Check | Result |
|---|---|
| `npm run green` | exit 0; **214/0/0/0**; tsc / lint / deps (71 modules, 212 deps) / check:state / check:law OK. Log: `qa-runs/s18-review/proto-green.log` |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| Existing smokes | gen 1730/278 and 3154/563; chaos 3120 and 5542; exploit 1604/309, 1617/367, 2043/480, 2299/592, docs 581/1419 and 607/1393 findings 0 — **byte-identical** to the step-16 / 17 pins |
| Levels smoke (six pinned lines) | btf-side / btf-unit / quick-unit × stage-fixed / stage-weighted, seeds 1–20, histories `6b91ceba…` / `3a58d03a…` / `f09905f4…` / `885c1a7b…` / `5a8d757f…` / `ac883a98…` — **match the kit** |
| G7 `573ae0c..HEAD` excl. handback/lock | **17 files, 326+/19− = 345** ≤ 400. name-status is exactly the 17 kit files (`A` for the six created). DNT empty. Tightest slack is 4 on several files (btf index, rules index, actions, chaos, driver-phase, sim index, run, world, gc.test, …). `levels.ts` 62/70, `tests/sim/levels.test.ts` 100/106, `sim/types.ts` 21/26, `player.ts` 17/22 |
| Interface quotes | `LevelRules`, `ChooseAbility` and `BTF_LEVEL_RULES` comments are verbatim. `PlayerReject` has ten reasons including `"noOffer"` and `"badPick"`. `SimInput.levels?` is after `busLimits`. `LEVEL_EVENTS` / `createLevels` match |
| Greps | **44/44 ALL OK** (`s18-greps.sh`, base `573ae0c`) |
| Kit plants | **36/36** caught, including G1 (GC test fails when clock dispose keeps render subscribers). Tree restored clean at `34e0979` |
| Levels-off | no `"levels"` rng is created; snapshots for both official boards, seeds 1 / 7 / 20, are **byte-identical** to Base and have no `levels` key. Sim and the ten smokes unchanged |
| Build law | one clock; no `Date` / `Math.random` / rAF in the src diff; the only new stream is `createRng(streamSeed(seed, "levels"))` when the match opts in; UNIT/TILE pipes only; nothing imports sim |
| Door | `feed` still goes phase → `disposed` → `malformed`, then `ChooseAbility`. `noOffer` / `badPick` / `notOwn` / `noUnit` are named rejects, kept in history, and change nothing. A foe seat under the side bar is `noOffer`. A bad or fractional index is `badPick`. A second pick is `noOffer`. No throw on wire input |

---

## 1. Draw order — reimplementation holds

Walked L112 onward only, then wrote an independent partial Fisher–Yates on `createRng(streamSeed(seed, "levels"))` with no draw when the unique remaining pool fits `offerSize`. `R.int(n) = floor(R.next() * n)`, first-copy-kept in pool order, `Object.hasOwn` for the pool key, one shared `R` for every bar.

It reproduces:

- The written example / seed-1 pin: pool `guard, charge, rally, cleave, ward`, `offerSize` 3 → `["rally", "charge", "guard"]`, exactly three `next()` calls; `rngState` equals a fresh stream after those three.
- Seeds 2 and 3 first offers against proto `createLevels`: `["guard", "ward", "charge"]` and `["ward", "rally", "charge"]`, same `rngState` check.
- Archer dups (`volley, snipe, volley`) → `["volley", "snipe"]`, no draw. After unlocking `snipe` → `["volley"]`, still no draw. Inherited `constructor` and missing `bat` → no offer, no draw.
- Two bars on one stream: the second offer continues `R`, it is not re-seeded.
- First BTF unit and side-bar offers for seed 1 against `createLevels`.
- **Every non-empty offer** in real matches, walking the same shared stream in bus order (unlocks applied between offers), for `btf-side`, `btf-unit` and `quick-unit` on both official boards, seeds 1, 2, 3, 5, 10 and 20 (skipped only when that match reached no level). Quick-unit matches walked 8–11 offers each. Log: `qa-runs/s18-review/draw-reimpl.log`.

The six smoke *history* shas also depend on the existing `"pool"` and `"ai"` streams and on move order (L126). Those shas were reproduced by `npm test` (pinned `assert.deepEqual`). They cannot be derived from the levels draw alone; the offers inside those matches can, and they match.

Ambiguities, none of which blocked the reimplementation:

- `0 .. offerSize-1` / `cands[0 .. offerSize-1]` is the usual half-open slice (exactly `offerSize` draws and `offerSize` items). Confirmed by the seed-1 pin.
- Pool base order is the maker’s array order; duplicates drop after the first copy.
- Draws happen only when an offer level opens and `cands.length > offerSize`. `choose` itself does not draw. Banked XP paid after a pick can open the next offer and draw then. A non-offer level emits `offer: []` and draws nothing.
- Side and unit bars share **one** `R`, created once in `createWorld` from `streamSeed(world.seed, "levels")` (`world.seed` is the existing `stageSeed ?? hostSeed`). Offers consume it in the order they open (side: as that side’s moves land; unit: as each unit’s moves land). Not one stream per bar.
- `R.int` returning 0 is a no-op swap; there is no extra tie-break.

---

## 2. Two `submit(` calls in `player.ts` — acceptable

The law grep `R7d-submits` now expects **2** (it was 1 when the only door exit was a move). Both calls are `submit(world, action)` imported from `./actions.ts`, the one log door.

- Move path (L70): after `disposed`, `malformed`, `intentEvent` and `rejectOf`. Only a legal `TAP_MOVE_CELL` builds a `move` action and submits it.
- Pick path (L45): after the same `disposed` / `malformed` guards, then the ChooseAbility reasons (`noUnit` / `notOwn` / `noOffer` / `badPick`). Only a clean pick builds `{ kind: "unlock", actor: <bar id>, target: null, durationMs: null, effects: [offer[index]] }` and submits it.

There is no `log.append` / `apply` bypass, no second door, and no submit in any other `src/sim` player path. `check:law` is still OK. This is the right way to put a second legal action through the one door.

---

## 3. `runMatch` lands only a step with an event — not hidden on levels-off

On Base `573ae0c`, `land` ran whenever `step.action !== null`. An independent probe of the base’s full `npm test` (205/0) and `npm run sim` counted **36,913** landed actions and **0** steps that had an action and no event. The base `player` only submits a move after a non-null `TAP_MOVE_CELL` event, so the new conjunct `step.action !== null && step.event !== null` is a no-op on every levels-off path.

The existing pins therefore do prove that levels-off matches did not move: sim histories, the four chaos lines and the six exploit lines are byte-identical, and levels-off snapshots match Base. Chaos and exploit never send a `ChooseAbility`, so they cannot exercise the new landing either.

The change *is* a behaviour change for levels-on matches: an accepted pick records `action` (the `unlock`) with `event: null`, and under the old `if (step.action !== null)` that pick would have emitted a spurious `MOVE_DONE` / `WAIT` / `UNIT_DONE` and ticked the clock. That is why the levels smoke asserts that `MOVE_DONE` in `result.events` equals the number of `move` entries in the log, and why plant D6 (restore the old land condition) fails that smoke. It is documented as Behaviour 10. Not hidden from this step’s own pins; invisible to the inherited ones, correctly.

---

## Scope, law, docs, coverage residual

Scope is the 17 named files only. No card hand, no ability effects, no levelling variants beyond `"side"` | `"unit"`, no change to the command log or the state tables. `ChooseAbility` lives in `src/sim/types.ts` (a door intent); the `ModeEventMap` augmentation is the designed core-types hook. No M7 CN is the right call.

Kit docs are clean: README Lines 232 and Verification include proto `34e0979`, 214/0, 345 of 400 and the six new smoke lines; spine header and size ~345 are right. The outline is left for the Architect, as the step says.

**Residual:** `CHAOS_KINDS` and `EXPLOIT_KINDS` have no pick kind, and the hunter’s junk/shape lists do not include `{ type: "ChooseAbility", … }`. A hostile or chaotic pick is not generated. Flagged, already deferred (“a hostile-pick exploit kind”).
