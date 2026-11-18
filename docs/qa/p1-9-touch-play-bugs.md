# P1-9 phone play bugs (touch / selection) — main `50105702`

QA & Build Guard, 2026-11-18, Europe/London. Read-only on `origin/main` `501057027cc27321b631c40ed3ef7d5552ac792a` (worktree `/tmp/q/te-50105702`). No GitHub or Drive writes. This file lives only under `/workspace/tileengine/docs/qa/` and has not been pushed.

The CEO's P1-9 debug APK phone test (play stage, `tools/play-stage`) failed player input after 1,014 tests had passed. Likely cause, as CoS said: touch input or selection state, not the rules. This write-up is the bug list, why the gates missed it, a proposed **TOUCH PLAY GATE**, and acceptance tests for agreed stages 1–3. It reuses `docs/qa/phase1-qa-plan.md` (the synthetic-tap gate already proposed there, never shipped), `data/project-format.md` (`tile-project` v6, §12 versioning, §13 validation, readers in `src/project/read/`), `/workspace/share/cozy-showcase/JOINT-MAP.md`, and the S21 Ultra / Red Magic 9 Pro logs under `docs/qa/device-runs/`.

Evidence: a node script against this commit's `createMatch` / `createGestureMapper` (confirmed); a line trace of `page.ts` camera mapping (traced, with a numeric example). No APK was re-run on a phone here.

## Bug list

### TP-1 — Attack and Talk do nothing; enemies cannot be targeted

- **Repro taps.** Select a player unit that is already adjacent to a wolf and a villager (or walk there first). Tap Attack. Tap the wolf (once, then again). Reset. Select the unit, tap Talk, tap the villager twice.
- **Expected.** Attack: the wolf takes damage (demo wolf HP 4 → 3) and the unit leaves targeting. Talk: the talk bubble opens with "Hello, traveler." / "Villager" (`DEMO_TALK`, `match.ts` 81–86, `hud.ts` `#bubble`).
- **Actual.** Attack and Talk arm correctly (`choose` returns null, phase `targeting`, aims on the unit cell). Tapping the unit cell does nothing: HP stays 4, `talk` stays null, phase stays `targeting`, `selected` becomes `null`.
- **Root cause.** `createGestureMapper` `aim()` (`src/runtime/input/gestures.ts:20-22`) emits `SelectUnit` whenever `unitAt(sq)` is set, and never `TargetCell`. `createPlay.intend` (`tools/play-stage/board.ts:93-97`) then feeds that `SelectUnit`; a foreign or neutral unit is `notOwn` / illegal, and the handler sets `selected = null`. `SELECT_UNIT` is only legal from `idle` or `unitSelected` (`src/state/tactics.input.table.ts:6`), so from `targeting` the feed is rejected and the phase does not change. The confirm path the rules already have (`TargetCell` → `CONFIRM_TARGET` in `src/sim/intents.ts:13-15`, two-tap as in the unit tests) is never reached from a real pointer.
- **Confirmed by run.** Adjacent knight, `choose("basic")`, two `pointer` taps on the wolf cell: selected cleared, phase still `targeting`, HP 4. The same match with two `intend({ type: "TargetCell", at })` calls (what the tests do) fires `action.kind === "ability"` and HP 3. Talk: `choose("talk")` then two pointer taps on the villager cell leaves `talk === null`. A standalone mapper tap on the wolf cell returns `{ type: "SelectUnit", unitId: "wolf#3" }`.

### TP-2 — The second move or action in a turn sometimes fails

- **Repro taps.** Select the knight. Two-tap a reachable empty tile (walk). Then either (a) two-tap another reachable tile to walk again, or (b) tap Attack / Talk and two-tap a target, or (c) try any board tap after the first walk without first looking at the camera.
- **Expected.** The P1 flow after `MOVE_DONE` is `actMenu` (`tactics.input.table.ts:9`): Attack, Spell, Talk, or Wait / End turn. A second walk is only legal if the action budget is meant to allow it (the `action-budget` knob defaults to 2, but that number is passed to the bot, not to the player). After a walk, later taps must still hit the cells the player sees.
- **Actual.** (a) A second walk is rejected: first tap may still paint a path (`intend` previews from `reach` without checking phase), second tap returns `reject: "noEvent"`, the unit stays put, phase stays `actMenu`. `TAP_MOVE_CELL` is only legal from `unitSelected` (`tactics.input.table.ts:8`); there is no Undo control for `UNDO_MOVE`. (b) Attack/Talk after a walk arm, then fail as TP-1. (c) A successful walk sets `followId` (`board.ts:111`). `page.ts:43` then `tickCam`s toward that cell, so `cam.x` / `cam.y` move, and TP-3's mapping makes the next tap miss — this is the "sometimes" (it depends on whether the camera has actually shifted).
- **Root cause.** Player second-walk: phase/table as above. Post-walk taps: TP-3 mapping plus `followId`. Not the rules walk itself (`walkTo` / `ACTION_BUDGET` still work when fed through `intend` from `idle` / `unitSelected`).
- **Confirmed by run** for (a): after a 40 ms walk, phase `actMenu`, `followId === "knight#1"`, second `TargetCell` pair → `noEvent`, still at the first dest. (c) is traced (see TP-3). A control (attack via `intend`, then reselect and walk) does move — the player budget is not what blocks the second input.

### TP-3 — After a pan, a unit cannot be selected; End Turn then fails

- **Repro taps.** Select a unit, tap Attack (or Talk/Spell) so the phase is `targeting`. Drag-pan the board. Tap a player unit. Tap End Turn. Also: from idle, pan, then tap a unit that is visibly under the finger.
- **Expected.** A pan cancels an in-flight press and, if a target was armed, leaves `targeting` (Cancel → `actMenu`, `tactics.input.table.ts:12`). After a pan, a tap on a unit's visible cell selects it. End Turn from `actMenu` waits and ends the side; from `idle` / `unitSelected` it ends the side (`tactics.flow.table.ts:11`). The player can then take the next turn, or the enemy side runs.
- **Actual.** After a pan in `targeting`, the phase is still `targeting`. A tap on a player unit clears `selected` and does not select (same `SelectUnit` illegal path as TP-1). End Turn increments the `turns` counter but leaves phase `targeting` and `side === "player"` — the turn does not end and the bot never runs. Separately, after any pan or camera follow, a tap on the cell the player sees is mapped as if the camera were still at the un-panned origin, so selection misses even from `idle`.
- **Root cause (two stacked defects).**
  1. `page.ts:70-73` starts a pan by `send("cancel")`. The mapper (`gestures.ts:41`) clears its owner and returns `[]` — it never emits a `Cancel` intent — so `player.feed({ type: "Cancel" })` never runs and `targeting` sticks. `endTurn` (`match.ts:99`) only `wait()`s from `actMenu`; `finish()` (`match.ts:36-38`) no-ops unless the phase is `idle` or `unitSelected`.
  2. `send()` (`page.ts:48-51`) and `centre()` (`page.ts:55-58`) convert with `(offset * dpr - pad) / s` and never add `cam.x` / `cam.y`. Types say pointer `x,y` are "px from the grid's top-left". The P1-9 smoke already uses the inverse, `(pad + (world - cam) * s) / k` (`handoff/steps/tests/step-p1-9-apk-wrapper/smoke.mjs:59-66`), and even notes to use the backing-store scale `k = canvas.width / clientWidth`, not `devicePixelRatio`. `pan()` (`camera-touch.ts:9`) is also fed CSS `clientX/Y` deltas (`page.ts:69-71`) as if they were art pixels, so a drag and a later tap disagree about how far the camera moved.
- **Confirmed by run** for (1): `choose("basic")`, then `pointer` down + cancel: phase still `targeting`; `endTurn()` → phase `targeting`, side `player`, `turns` 1; a later pointer tap on the knight sets `selected` to `null`. The same match with an explicit `intend({ type: "Cancel" })` returns to `actMenu`, and End Turn then leaves the player side. (2) is **traced**: a pan of 40 art px at `s=12` maps a canvas `offsetY=200` to row 3 via `send()`, but row 5 once `cam.y` is added (two rows off). Not re-run in a browser on this pass.

### TP-4 — Only the wolf AI runs

- **Repro taps.** End a player turn successfully (Wait / End Turn from `actMenu` or `idle`, not from stuck `targeting`). Watch the enemy side. (On a fixture that also has a non-wolf enemy side, End Turn again and watch that side.)
- **Expected.** After a successful End Turn, every enemy side in the project takes its turn. On the demo, both wolves should do whatever the designed budget says. The proposed gate requires every AI type, not only wolf, to act.
- **Actual.** `createMatch` hardcodes `SIDES = ["player", "wolves"]` (`match.ts:14`). The bot is pumped only when `side === "wolves"` (`match.ts:65`, `77`, `99`). A non-wolf enemy side never runs. On the demo itself, `actionsPerTurn` (default 2) is a *side* budget: one node run of End Turn from `actMenu` moved `wolf#4` (3,0) → (4,1) and left `wolf#3` at (2,0). That can look like "only one wolf acted." Player input failures (TP-1…3) also make the wolf turn the only turn that ever seems to work, when End Turn is issued from `idle` / `actMenu`.
- **Root cause.** `match.ts:14` and the three `side === "wolves"` pumps. `botAbilityPriority` itself is side-generic; it is just never called for any other side. The demo load (`tools/play-stage/load.ts` `DEMO_STAGE`) only places wolves, so the hardcode is invisible to current tests.
- **Confirmed by run** for the demo (one wolf moved, the other did not; side returned to `player` / `idle`). The SIDES hardcode is **traced**. A non-wolf side was not fixture-run.

## Why the gates missed it

1,014 tests and the P1-6 / P1-6h / P1-7 / P1-9 kit smokes all passed because they never played the game through pointer events.

- Unit tests feed `intend({ type: "SelectUnit" | "TargetCell" | … })` or `match.choose` / `endTurn` / `wait` directly (`tests/tools/play-stage.test.ts`, `play-stage-p17.test.ts`, `play-stage-p18.test.ts`). Attack, Talk, and Spell two-taps are asserted only on that API, which bypasses `aim()` and `page.ts`. The one `play.pointer(...)` use (`play-stage.test.ts:42`) taps the knight's own cell to select it — never a wolf, never a villager, never in `targeting`.
- Gesture tests (`tests/runtime/input/gestures.test.ts`) fix the mapper's contract: a tap on a unit *is* `SelectUnit`. They never compose it with the battle phase or `createMatch.choose`.
- Camera tests (`play-stage-p17.test.ts`) call `pan` / `zoomAt` / `tickCam` on a bare `PlayCam` and never go through `send()`.
- P1-6 / P1-6h browser smoke (`handoff/steps/tests/step-p1-6-play-page-1/smoke.mjs` and the 6h copy) opens 390 and 360, checks 44 px buttons and one rAF, then selects and two-tap walks with `window.__play.intend(...)`. No `page.touchscreen` / `dispatchEvent` on the canvas for play actions.
- P1-9 smoke (`…/step-p1-9-apk-wrapper/smoke.mjs`) is the only script that fires a real `touchscreen.tap`, and it does it only to prove map row 0 is uncovered by the banner. It first forces `__cam` to `{ x: 0, y: 0, follow: null }` and never asserts that the tap selected or targeted a cell. Release `/rel/` is checked for missing `window.__*` and a non-zero canvas, not for play.
- `qa-gates.sh` smoke is the short in-repo `tests/smoke.test.ts` plus the kit smokes above. Rules, budget, and bot tests do not go through the HUD buttons or canvas.

`docs/qa/phase1-qa-plan.md:46` already asked for "synthetic taps through the real input path (select, walk, … tap a target, attack, talk)" as the pre-device gate. That harness was never added, so the CEO's first touch play was the first time this path was exercised.

## Proposed TOUCH PLAY GATE

Name: **TOUCH PLAY GATE**. Owns the gap the phase 1 plan named. Runs in CI on the **release** web build (the same www the APK packs; no `window.__*` needed to drive or pass) at **390×844** and **360×844**, DPR 3, `isMobile`, `hasTouch`. A dev www may be used only to dump diagnostics on failure.

**Harness.** Scripted pointer/touch events (Playwright `touchscreen.tap` / `pointer` down-move-up, not `intend`, not `__play.pointer` as the driver) at canvas coordinates computed with the camera-aware formula the P1-9 smoke already has (`world = cam + ((client - rect) * k - pad) / s`, `k = canvas.width / clientWidth`). Buttons are tapped on their HUD elements (`#attack`, `#talk`, `#end`, …). Assertions read the HUD and world the user can see: `#pill` / banner text, `#hpText`, `#bubble`, phase via visible buttons (Wait only on `actMenu`), unit cells, and, if a test-only reader is required, a release-safe inspect hook that is not shipped — prefer DOM and a known demo project file.

**Sequence (must all pass on both widths).** Using the demo project (or a fixture project that also contains a non-wolf enemy side):

1. **Select** — tap a player unit's visible cell; it is marked selected (plate shows the name; reach overlays appear).
2. **Move** — two-tap a reachable empty tile; first tap shows the path and does not walk; second tap walks; the unit arrives.
3. **Attack an enemy** — with that unit now in range (walk first if needed), tap Attack, then two-tap the enemy's visible cell; HP drops; the enemy can be killed on repeats.
4. **Talk to an NPC** — walk next to the villager, tap Talk, two-tap the villager; the bubble opens with the project talk text and name.
5. **Second action in the same turn** — after the walk, the action row is at `actMenu`; Attack or Talk in that same turn still works (this is the supported move-then-act flow). If product intent is a second walk from the `actions_per_turn = 2` knob, say so in the fix slice and gate it; today that input is `noEvent`.
6. **Pan then select** — drag-pan (and, if a target was armed, the pan must cancel targeting). Tap a player unit where it is drawn after the pan; it selects. End Turn then ends the side (`ENEMY TURN` / the bot runs), and does not stick in `targeting`.
7. **End Turn, then every AI type acts** — not only `side === "wolves"`. A fixture with at least one non-wolf enemy side must run that side. Every living unit that the rules say should act on that side does act (if the budget stays side-wide and equal to 2, say so and assert the budget, do not silently leave a type unused).

Also keep the existing 44 px target, no sideways scroll, one-rAF, and no page-error checks. Same taps must be deterministic (phase 1 plan: same taps, same log).

**APK hand check** (no KVM on this box). Copy into the phone checklist, next to `docs/qa/device-runs/TEMPLATE.md` and the existing S21 Ultra / Red Magic 9 Pro logs. For each of **S21 Ultra** and **Red Magic 9 Pro**, on the debug APK built from the same commit as the web gate:

- [ ] Install and cold start (record 3 times, as in the phase 1 plan).
- [ ] The seven steps above, with a finger, upright, Power saving off.
- [ ] After a pan and after a pinch-zoom, a visible unit still selects.
- [ ] End Turn after a cancelled Attack still ends the turn.
- [ ] Talk bubble is readable and not fully covered by the action row (already a known kit note).
- [ ] Wi-Fi off after install: the stage still plays (export audit: no network).
- [ ] Write down any tap that did nothing or picked the wrong cell. Never log IMEI or serial.

A CI PASS without both phone checklists is not a ship of play input.

## Acceptance tests for stages 1–3

Planning and docs only until a later coding slice; testers should reuse these, not invent a second format. The standing rule still holds: **the maker only edits data, the engine runs the rules** (never a second implementation). The UX shell (`/workspace/tileengine/ui-shell`) is the prototype for screens and flows; its code is not merged (CoS, 18 Nov). Slices stay at 400 lines or fewer with the gates on.

### Stage 1 — Minimal project format, reader, validation, versioning; play stage loads a project file; demo moves into data

Ground: `data/project-format.md` (`tile-project` v6), `src/project/read/*` (manifest, map, stage, setups, guard), `tools/play-stage/load.ts` (`DEMO_MANIFEST` / `DEMO_MAP` / `DEMO_STAGE` / `DEMO_SETUP` / `DEMO_TALK` / `docsToInput` are in-module today).

- A project folder / file with a current `formatVersion` is read only through `src/project/read/*`. `tools/play-stage` must not grow a second parser; `docsToInput` either becomes a thin wrapper around that reader or goes away.
- The bundled demo is data (project files), not constants in `load.ts`. The play stage boots by loading that project. A world built from the files matches today's demo placement (knight/archer at the bottom, wolves at row 0, villager talk line).
- Validation (§13): a missing required doc, a bad `formatVersion`, or a failing guard is a hard error and the stage does not boot mid-world. Versioning (§12): an older supported version migrates on read; an unsupported newer version is rejected, not silently defaulted (Law 12).
- **No second rules implementation:** damage, reach, win, talk dispatch, and the action budget come from the engine modules already used (`targetsFor`, `walkTo`, `wipeRule`, `ACTION_BUDGET`, `botAbilityPriority`). A test that changes only the project / setup data (for example archer reach or the villager talk string) must change play outcomes; a test that greps the maker and play-stage for a copied damage or reach table must find none.

### Stage 2 — Minimal maker: Home, save/load, and Test opening the real play stage

- Home lists projects, can create one from the demo / a template, and opens it.
- Save and load round-trip the project files (stage 1 reader/writer). Reload shows the same data. A corrupt file is rejected with a visible error, not a empty default project.
- **Test** starts the **real** play stage (the same runtime as `tools/play-stage` / the APK), on the current project, not a hard-coded `DEMO_LOAD` and not an iframe of a UX mock. The TOUCH PLAY GATE sequence passes inside Test at 390 and 360.
- The maker writes data only. Test / play must not implement move, attack, talk, or win in maker code. A plant that inserts a second `hp -=` or a hard-coded reach in the maker fails the gate.

### Stage 3 — Cozy showcase foundations, each with a basic maker editor

Ground: `/workspace/share/cozy-showcase/JOINT-MAP.md` (F1–F16: session/links, day/night, timers, items, gather, grow, craft, vendors, NPC behaviour, quests, guild, reputation, turn-based stealth, decor/gear/tree, cozy overlays, session save). Each foundation is engine data plus a small editor, not a parallel sim.

- For each foundation in the joint map, a basic maker editor can create and edit that foundation's project data (for example a growable row, a recipe, a vendor stock list, a stealth stage link) and save it into the project format.
- Test / play of the template project loads those docs through the engine rules named in the map (`src/rules/…` once sliced). The editor does not run a second grow clock, craft resolver, or stealth walker.
- **Second-implementation plant:** a maker-side copy of a rule (craft output, grow ticks, stealth "one tile per enemy", sight) fails acceptance. Outcomes change only when the project data or the engine rule changes.
- The first playable loop in the joint map (shop, plant, craft, guild, no stealth) can be started from Test. Stealth stays later and turn-based, as the CEO already locked.

## First slice (QA)

QA owns the **TOUCH PLAY GATE harness** (CI at 390 and 360 on the release www, plus the S21 Ultra / Red Magic 9 Pro APK checklist). The same slice's must-fixes, for Grok Build / GrokHeavy, are:

1. **TP-1** — A pointer on an occupied aim cell in `targeting` must confirm the target, not `SelectUnit`.
2. **TP-3 mapping** — `send()` / `centre()` must use `cam.x` / `cam.y` and the backing-store scale; pan deltas must be in the same space.
3. **TP-3 cancel / End Turn** — A pan or cancel must emit `Cancel` and leave `targeting`; End Turn must actually end the side from `actMenu` and after a cancelled aim.
4. **TP-2 follow-up** — After a walk (camera follow included), the next tap still hits the visible cell; document or implement the second walk vs move-then-act rule.
5. **TP-4** — Drive every enemy side / AI type in the project, not only `"wolves"`.

The harness is the acceptance test for those fixes. No publish and no unpublish of gh-pages is implied.
