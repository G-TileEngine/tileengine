## Goal
After P1-6 you can select a unit and walk, then the host auto-WAITs back to `idle`. There is no camera, no HUD, no Spell/Talk/End turn, and no win/lose. Hook the work into ChatA's merged play-stage (`board.ts`, `load.ts`, `page.ts` as they are after P1-6h). Add the camera, HUD, spell door, talk and end turn through small hooks and the new files `camera-touch.ts`, `hud.ts` and `match.ts`. Leave the existing ChatA code alone: do not rewrite the board to `fitBoard` / `TokenRecipe` or replace `docsToInput`. After this step:
1. **Camera.** `camera-touch.ts`: drag pans (clears follow), pinch zooms, double-tap a unit centres, the camera follows the acting unit (including the bot). `clamp` / `snap` / `tickCam` reuse the render helpers. Honour P1-6h's 44 CSS px cell floor live: `seatCam` starts `cam.s` at `max(box.s, floorS)`, layout never leaves `cam.s` below `floorS`, and `zoomAt` sets `sMax >= floorS` (also a CSS-based cap `ceil(6 * dpr)` so an identity pinch on a fitted @3x camera does not shrink). Cell CSS is `(TILE * s) / dpr`. The world canvas is padded under the 44 px top strip and 132 px bottom HUD (`clientHeight - 176`).
2. **HUD.** `hud.ts` is a DOM overlay at screen resolution (UX answers, EA ruling 00:50): top strip 44 px (turn, whose-turn pill, 48 px menu), bottom 132 px + safe-area (unit plate 44 px with 32 px portrait, name, 120×10 HP bar and `hp/max`; action row 64 px tall, 48 px minimum). Attack / Spell / Talk / Wait / End turn. Attack/Spell/Talk are disabled at 40% opacity (still tappable for a toast) when `targetsFor` is empty. Talk is shown only when an NPC is in reach. End turn sits far right with a 12 px gap and the team-colour outline. Nothing selected: the plate collapses and only End turn shows. Turn banner 96 px (navy/crimson, gold rules, "YOUR TURN" / "ENEMY TURN"); tap skips. Talk bubble (max 280 px, name bold, bundled text). Win/lose veil: "Victory" / "Defeat", "All enemies defeated" / "Your units fell", turns taken, Restart and Back (Back rebuilds the demo; there is no stage list yet). `hud.ts` uses `document` and must not be imported from tests (the root `tsconfig` has no DOM lib).
3. **Match wrapper.** `createPlay` keeps `autoWait: true` so P1-6 tests still end a walk in `idle`. `createMatch` sets `autoWait: false` and stops at `actMenu` for the action row. `choose("basic"|"spell"|"talk")` / `wait` / `endTurn` drive the door. End turn from `actMenu` first `wait()`s (WAIT + UNIT_DONE) then `END_TURN`. After a talk, the host returns to `actMenu` (interact costs no action and does not end the turn). Two-tap confirm is reused for attack/spell/talk (first preview, second feed). Aim overlays: attack `#e04848`, spell `#f08a30`. The seated P1-5 bot runs on End turn; `sync` continues the enemy queue after a walk lands. Wipe-all-enemies then End turn is a win; losing all player units is a lose. Restart rebuilds the bundled demo (`createMatch` again). `SIDES = ["player", "wolves"]` (player first) is passed to `wipeRule`. P1-3 r3's `BattleTarget` is `{ id }` only (no `at`): map aim cells with `play.aims = list.flatMap((t) => { const u = play.world.units.get(t.id); return u === undefined ? [] : [u.at]; })`.
4. **Spell door.** `ChooseAction.actionId` includes `"spell"`. `PlayerOptions.spellOf?: (unitId: string) => string | undefined` is a host callback (instance id in, effect ref out). The play board maps the instance to `unit.unitId` via `spellRef`, which uses `Object.hasOwn` on `setup.abilities` (a prototype-key `constructor` is not a spell row and does not throw). The archer's `line-shot` is the one demo spell. HP/atk/talk lookups in the host also use `Object.hasOwn`. Keep ChatA's empty-tile refuse: `rejectOf` already returns `"noTarget"` when `CONFIRM_TARGET` aims a tile with no living occupant (`occupantAt`); do not drop it and do not rewrite `rejectOf`. `PlayerReject` already includes `"noTarget"`. `ChooseAction` still adds `"spell"`.
5. **Smoke.** Kit-run headless Chromium at 390×844 and 360 wide (touch, @3x): no page errors, no sideways scroll, visible buttons ≥ 44×44 (hidden action buttons are ignored), pan, a walk stays at `actMenu`, Wait returns to `idle`, wipe + End turn shows Victory. 0 repo lines.

## Rulings made
- The P1-5 "player door for line-shot → P1-6" carry lands in this step, with the Spell button, not in P1-6.
- `createPlay` stays backward-compatible (`autoWait` default true). `createMatch` is the P1-7 façade (`autoWait: false`).
- After talk, the host sets the phase back to `actMenu`.
- End turn from `actMenu` first `wait()`s, then `END_TURN`.
- Quit / Back / Restart all rebuild the bundled demo. There is no `RETRY` event and no stage list yet.
- Banner, HUD and talk text draw at screen resolution on the HUD overlay (UX answers, already adopted).
- The merchant stays player-side; the villager is the demo Talk target. Talk text is `DEMO_TALK` / `talk-villager`.
- Play-only APK remains a P1-9 item (UX agreed); noted only.
- `menu.ts` is not a separate file: pause lives in the HUD veil.
- Id-keyed lookups (`spellRef`, `recipeOf`, talk, stats, abilities) use `Object.hasOwn` (QA flags prototype-key reads as MUST).
- Keep ChatA's `noTarget` refuse in `rejectOf` (`occupantAt` path). Map aims from `BattleTarget.id` to the unit's cell (P1-3 r3 dropped `at`).
- Keep P1-6h's 44 CSS px floor (`MIN_CELL_CSS`) in ChatA `fit` and in `zoomAt`. If the map cannot fit at 44 CSS px, pan (do not shrink). Seat the bot with ACTION_BUDGET `actionsPerTurn`. A `TargetCell` beyond reach returns `{ reject: "notReachable", preview: [] }` and clears the pending preview so P1-6h's tap tests stay green.
- Size: 500 changed lines (cap 500). Reason: camera, HUD, spell door, talk and end-turn plus 6 tests (including the 44 CSS floor at 360/390 @3x), added through hooks and new files on ChatA's merged board, load and page (458 insertions, 42 deletions). Over 400 because the feature set and the tests do not fit in 400 once the HUD, match wrapper and page hooks are counted; at the 500 cap after the live-camera floor fix, with no cap raise.

## Open questions
- UX asked that when Talk is hidden its slot makes Wait wider. Default: Wait keeps a fixed width; Talk is simply hidden.
- UX asked for a pale "lost" HP chunk that drains over 300 ms, and a pulsing (1.2 s) red ring on the aimed unit. Default: the bar jumps to the new value and the aim tile is a flat red/orange overlay; both polish items wait for a later play-page pass (not P1-8 FX).
- Banner timing: UX 180 / 900 / 180 ms fade. Default: a ~1260 ms hold, tap anywhere skips, no fade animation.
- Confirm `starter:hero-cleric` and `starter:prop-crate` (carried from P1-6).

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/sim/types.ts` | `ChooseAction.actionId` adds `"spell"`; `PlayerOptions.spellOf?` | 4 | 8 |
| `src/sim/player.ts` | `pending` / `known` include `"spell"`; CONFIRM_TARGET attaches `opts.spellOf?.(selected)`; keep ChatA `noTarget` / `occupantAt` | 10 | 16 |
| `tools/play-stage/board.ts` | hooks only on ChatA: `spellRef`, exported `go`, `spellOf` on `createPlayer`, `autoWait` / aims / follow, targeting two-tap, finish-walk respects `autoWait`, aim overlays; leave bake / `fit` / intend / recipes in place | 75 | 90 |
| `tools/play-stage/load.ts` | DEMO_SETUP gains `reach` / archer `abilities` so `spellRef(DEMO_SETUP, "archer") === "line-shot"`; leave ChatA recipes and `docsToInput` alone | 2 | 8 |
| `tools/play-stage/camera-touch.ts` | new: pan, pinch, centre, follow, clamp; `floorS` / `seatCam`; `zoomAt` honours `MIN_CELL_CSS` with `sMax >= floorS` | 40 | 42 |
| `tools/play-stage/hud.ts` | new: DOM overlay (must not be imported from tests) | 58 | 68 |
| `tools/play-stage/match.ts` | new: `createMatch`, choose/wait/endTurn, talk, bot (ACTION_BUDGET), wipe, `view`; aims from `BattleTarget.id`; ChatA walk shape in `land()`; named `DEFAULT_SPELL_REACH` (no silent `?? 3`) | 132 | 140 |
| `tools/play-stage/page.ts` | camera gestures, HUD pad, `createMatch`, `seatCam` on layout, `__play` / `__driver` / `__cam` / `__hud`; keep the ChatA driver / load / env | 93 | 110 |
| `tests/tools/play-stage-p17.test.ts` | new, shipped, byte-identical | 86 | 86 |
Total ≤ 500 changed lines (proto **500**: src 14, tools 400, tests 86; added+deleted). Hard cap 500. Size reason: camera, HUD, spell door, talk and end-turn plus 6 tests, added through hooks and new files on ChatA's merged board, load and page, including the live 44 CSS camera floor (458+42). Over 400 because the feature set and the tests do not fit in 400 once the HUD, match wrapper and page hooks are counted.

## Tests that prove it is done (6 new; ship the file byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-7-play-page-2/` to the same paths at the repo root. `tests/tools/play-stage-p17.test.ts` (6 tests: camera pan/zoom/centre/follow/clamp; **44 CSS px floor at 360 and 390 @3x after `seatCam` / init and after `zoomAt`**, including the fitted `s=12` @3x identity repro; `spellRef` + a prototype `constructor` row is not a spell; walk stays at `actMenu`, Wait → idle, Spell two-tap fires `line-shot`; Talk hidden until a villager is adjacent, then "Hello, traveler.", then `actMenu`; End turn from `actMenu` runs the bot, Restart restores the demo, wiping the wolves then End turn is a win, and the board source passes `budget.actionsPerTurn` into `botAbilityPriority`). N = 6. P1-6h's `tests/tools/play-stage.test.ts` (44 CSS floor, foreign-side tap, beyond-reach walk, second tap on a non-reach tile) must stay green (`autoWait` defaults true). Do not drop or weaken those tests.

## How a planted bug is caught
EA plants 19/19 (`p1-7-plants.py`). `spellRef` via `in`, leaving `autoWait` on, Wait without `UNIT_DONE`, seating the player without `spellOf`, always-hidden Talk, dropped talk text, End turn that never starts the enemy side, Restart returning the same match, wipe never reporting a winner, a no-op pan, zoom that never writes the clamped scale, follow that never records the id, `CONFIRM_TARGET` dropping the spell effect, End turn from `actMenu` without a Wait, or leaving talk on the `unitDone` path, capping `zoomAt` at `scaleRange`'s 6, a no-op `seatCam`, a `floorS` that ignores `dpr`, or seating the bot with a literal `2` instead of `budget.actionsPerTurn` each fail a shipped test.

## Kit-run browser smoke (0 repo lines)
`handoff/steps/tests/step-p1-7-play-page-2/smoke.mjs` is required in the hand-back. From the repo root: `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-p1-7-play-page-2/smoke.mjs . 8793 /tmp/p1-7-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It serves `tools/serve.ts`, opens `/tools/play-stage/` headless at **390 × 844** and **360 wide** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute). Visible (not `display:none`) buttons must be ≥ 44×44. After init, cell CSS (`(TILE * __cam.s) / dpr`) must be ≥ 44 at both 390 and 360 @3x. After a two-tap walk the phase is `actMenu` (this step does not auto-WAIT). Wipe the wolves and End turn must show Victory.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 998 tests passing** (main's count at Base + 6, once E7p and P1-6h are on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on the restacked stack: 998/0.)
- [ ] If E7p or P1-6h is not on main, or if those APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 500 changed lines in total (500 in the proto). Hard cap 500. Size reason: camera / HUD / spell / talk / end-turn plus 6 tests on ChatA hooks, including the live 44 CSS camera floor (458+42); over 400 because that feature set and the tests do not fit in 400 once HUD, match and page hooks are counted.
- [ ] The shipped test file is byte-identical to the kit copy. P1-6h's play-stage tests stay green.
- [ ] **Kit-run browser smoke (REQUIRED)** exits 0 with `SMOKE PASS` at 390×844 and 360 wide (no page errors, no sideways scroll, visible buttons ≥ 44×44, cell CSS ≥ 44 after init, pan, walk stays at actMenu, Wait → idle, wipe + End turn is a win).
- [ ] Never touch `painter-proto/` or `ui-shell/`. Game rules stay out of `src/core` and `src/sim` except the `spellOf` player-door (`types.ts` / `player.ts`): the effect ref comes from the host, not from a rule table inside sim. BTF is used only via adapters or rewrites with file:line cites (none new in this step). `hud.ts` is not imported from `tests/`.

## Floor
`npm run green` is at least **998** tests passing (main's count at Base + 6, once E7p and P1-6h are on that main: 981 + 7 + 4 + 6). If main's count at Base (with E7p and P1-6h already merged) is C, the floor is C + 6.

## Not in this step
- Spell FX in the match (`cast-fx`, E7p hookup) → P1-8.
- APK wrapper / play-only packaging → P1-9.
- r73 project loader / OPFS / `?project=`.
- Stage list for Back; a 300 ms lost-HP chunk; a pulsing aim ring; banner fade 180/900/180; Wait widening into Talk's slot (see Open questions).

## Out of scope
painter-proto, ui-shell, GitHub push, core-types, catalogue edits, Phase 2.

## Do not touch
`painter-proto/`, `ui-shell/` (read-only reference is OK), `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts`, `src/sim/migrations`. Do not drop or weaken P1-6h's play-stage tests (`tests/tools/play-stage.test.ts` must stay green: 44 CSS floor, foreign-side tap, beyond-reach walk, second tap on a non-reach tile) or P1-6h's battle/bot hardening tests. Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 998 tests passing** and 0 failing (main's count at Base + 6). Paste the summary line and all kit-run browser smoke lines into HANDBACK.md.
- The shipped test file is **byte-identical** to the kit copy.
- The branch starts at the Base (E7p and P1-6h already on main). ≤ 500 changed lines (500 in the proto; size reason in Files). Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-7-play-page-2-r<N>-chatA` (base = current main when you start; E7p and P1-6h must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-7-play-page-2-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
