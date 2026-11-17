Build step-p1-7-play-page-2 r1 from the step file `handoff/steps/step-p1-7-play-page-2.md` (sha256 `4d1f240f44e7e4d80c355e0f774edac148fd19be8e408b95fcf7019a7d02b5ac`); it wins over this paste.

Base commit: current main when you start (at kit authoring, `origin/main` is `9ac26da821d8f5e71a108cdbc578c5c8a38f2037`, runnable count **922** with P1-2 and ED-E6 already merged). Floor = that main's count + 5 (authoring floor **987**). **P1-6 and E7p must already be merged on that main.** If a required earlier step is missing or its APIs on main differ from what the shipped tests import, **stop and report**. Branch: `step/step-p1-7-play-page-2-r1-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

Shipped files (copy byte-identical from `handoff/steps/tests/step-p1-7-play-page-2/` to the same paths at the repo root): `tests/tools/play-stage-p17.test.ts`. Floor: green at least main's count + 5 = 987 passing on a main that already holds the earlier steps, 0 failing (proto 987/0).

Kit: kit-1 **r1**, 2026-11-17. Engine Architect. Restacked proto `/tmp/batch2` branch `proto/restack`, head `d75a013498f8ed737792488efe393b6ff808ee99`, tree `12d52b71cece7e2cf8d6a6b50b6dc4dab0347246`, parent `e816e22d28b63418c3d9d1bae6b0e7b9985a99ec`. 8 files, +379/−9 = **388 changed lines**. Green **987/0**. N = 5. Hard cap 400.
## Goal
After P1-6 you can select a unit and walk, then the host auto-WAITs back to `idle`. There is no camera, no HUD, no Spell/Talk/End turn, and no win/lose. After this step:
1. **Camera.** `camera-touch.ts`: drag pans (clears follow), pinch zooms (`sMax` 6, clamped), double-tap a unit centres, the camera follows the acting unit (including the bot). `clamp` / `snap` / `tickCam` reuse the render helpers. The world canvas is padded under the 44 px top strip and 132 px bottom HUD (`clientHeight - 176`).
2. **HUD.** `hud.ts` is a DOM overlay at screen resolution (UX answers, EA ruling 00:50): top strip 44 px (turn, whose-turn pill, 48 px menu), bottom 132 px + safe-area (unit plate 44 px with 32 px portrait, name, 120×10 HP bar and `hp/max`; action row 64 px tall, 48 px minimum). Attack / Spell / Talk / Wait / End turn. Attack/Spell/Talk are disabled at 40% opacity (still tappable for a toast) when `targetsFor` is empty. Talk is shown only when an NPC is in reach. End turn sits far right with a 12 px gap and the team-colour outline. Nothing selected: the plate collapses and only End turn shows. Turn banner 96 px (navy/crimson, gold rules, "YOUR TURN" / "ENEMY TURN"); tap skips. Talk bubble (max 280 px, name bold, bundled text). Win/lose veil: "Victory" / "Defeat", "All enemies defeated" / "Your units fell", turns taken, Restart and Back (Back rebuilds the demo; there is no stage list yet). `hud.ts` uses `document` and must not be imported from tests (the root `tsconfig` has no DOM lib).
3. **Match wrapper.** `createPlay` keeps `autoWait: true` so P1-6 tests still end a walk in `idle`. `createMatch` sets `autoWait: false` and stops at `actMenu` for the action row. `choose("basic"|"spell"|"talk")` / `wait` / `endTurn` drive the door. End turn from `actMenu` first `wait()`s (WAIT + UNIT_DONE) then `END_TURN`. After a talk, the host returns to `actMenu` (interact costs no action and does not end the turn). Two-tap confirm is reused for attack/spell/talk (first preview, second feed). Aim overlays: attack `#e04848`, spell `#f08a30`. The seated P1-5 bot runs on End turn; `sync` continues the enemy queue after a walk lands. Wipe-all-enemies then End turn is a win; losing all player units is a lose. Restart rebuilds the bundled demo (`createMatch` again).
4. **Spell door.** `ChooseAction.actionId` includes `"spell"`. `PlayerOptions.spellOf?: (unitId: string) => string | undefined` is a host callback (instance id in, effect ref out). The play board maps the instance to `unit.unitId` via `spellRef`, which uses `Object.hasOwn` on `setup.abilities` (a prototype-key `constructor` is not a spell row and does not throw). The archer's `line-shot` is the one demo spell. HP/atk/talk lookups in the host also use `Object.hasOwn`.
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
- Plan estimate was ~360 tools; the proto is **388** added+deleted (under the 400 hard cap) because the spell door, talk, camera, HUD, end-turn/bot and win/lose land together as one play-page-2 kit.

## Open questions
- UX asked that when Talk is hidden its slot makes Wait wider. Default: Wait keeps a fixed width; Talk is simply hidden.
- UX asked for a pale "lost" HP chunk that drains over 300 ms, and a pulsing (1.2 s) red ring on the aimed unit. Default: the bar jumps to the new value and the aim tile is a flat red/orange overlay; both polish items wait for a later play-page pass (not P1-8 FX).
- Banner timing: UX 180 / 900 / 180 ms fade. Default: a ~1260 ms hold, tap anywhere skips, no fade animation.
- Confirm `starter:hero-cleric` and `starter:prop-crate` (carried from P1-6).

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/sim/types.ts` | `ChooseAction.actionId` adds `"spell"`; `PlayerOptions.spellOf` | 4 | 4 |
| `src/sim/player.ts` | `CONFIRM_TARGET` attaches `spellOf` as `effects[0]` | 3 | 4 |
| `tools/play-stage/board.ts` | `spellRef` (`Object.hasOwn`), `autoWait` / `aims` / `followId`, targeting two-tap, no auto-WAIT when `autoWait` is false | 22 | 28 |
| `tools/play-stage/camera-touch.ts` | new: pan, pinch, centre, follow, clamp | 36 | 42 |
| `tools/play-stage/hud.ts` | new: DOM overlay (must not be imported from tests) | 58 | 68 |
| `tools/play-stage/match.ts` | new: `createMatch`, choose/wait/endTurn, talk, bot, wipe, `view` | 128 | 140 |
| `tools/play-stage/page.ts` | camera gestures, HUD pad, opening banner, `__play` / `__cam` / `__hud` | 54 | 64 |
| `tests/tools/play-stage-p17.test.ts` | new, shipped, byte-identical | 83 | 83 |
Total ≤ 400 changed lines (proto **388**: src 7, tools 298, tests 83; added+deleted). Hard cap 400. (Plan estimate was ~360; 388 stays under the cap — see Rulings.)

## Tests that prove it is done (5 new; ship the file byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-7-play-page-2/` to the same paths at the repo root. `tests/tools/play-stage-p17.test.ts` (5 tests: camera pan/zoom/centre/follow/clamp; `spellRef` + a prototype `constructor` row is not a spell; walk stays at `actMenu`, Wait → idle, Spell two-tap fires `line-shot`; Talk hidden until a villager is adjacent, then "Hello, traveler.", then `actMenu`; End turn from `actMenu` runs the bot, Restart restores the demo, wiping the wolves then End turn is a win; nothing selected shows only End turn). N = 5. P1-6's `tests/tools/play-stage.test.ts` is unchanged and must stay green (`autoWait` defaults true).

## How a planted bug is caught
EA plants 15/15 (`p1-7-plants.py`). `spellRef` via `in`, leaving `autoWait` on, Wait without `UNIT_DONE`, seating the player without `spellOf`, always-hidden Talk, dropped talk text, End turn that never starts the enemy side, Restart returning the same match, wipe never reporting a winner, a no-op pan, zoom that never writes the clamped scale, follow that never records the id, `CONFIRM_TARGET` dropping the spell effect, End turn from `actMenu` without a Wait, or leaving talk on the `unitDone` path each fail a shipped test.

## Kit-run browser smoke (0 repo lines)
`handoff/steps/tests/step-p1-7-play-page-2/smoke.mjs` is required in the hand-back. From the repo root: `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-p1-7-play-page-2/smoke.mjs . 8793 /tmp/p1-7-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It serves `tools/serve.ts`, opens `/tools/play-stage/` headless at **390 × 844** and **360 wide** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute). Visible (not `display:none`) buttons must be ≥ 44×44. After a two-tap walk the phase is `actMenu` (this step does not auto-WAIT). Wipe the wolves and End turn must show Victory.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 987 tests passing** (main's count at Base + 5, once P1-6 and E7p are on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on the restacked stack: 987/0.)
- [ ] If P1-6 or E7p is not on main, or if those APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 400 changed lines in total (388 in the proto). Hard cap 400.
- [ ] The shipped test file is byte-identical to the kit copy. P1-6's play-stage tests stay green.
- [ ] **Kit-run browser smoke (REQUIRED)** exits 0 with `SMOKE PASS` at 390×844 and 360 wide (no page errors, no sideways scroll, visible buttons ≥ 44×44, pan, walk stays at actMenu, Wait → idle, wipe + End turn is a win).
- [ ] Never touch `painter-proto/` or `ui-shell/`. Game rules stay out of `src/core` and `src/sim` except the `spellOf` player-door (`types.ts` / `player.ts`): the effect ref comes from the host, not from a rule table inside sim. BTF is used only via adapters or rewrites with file:line cites (none new in this step). `hud.ts` is not imported from `tests/`.

## Floor
`npm run green` is at least **987** tests passing (main's count at Base + 5, once P1-6 and E7p are on that main: 922 + 13 + 11 + 9 + 16 + 4 + 7 + 5). If main's count at Base (with P1-6 and E7p already merged) is C, the floor is C + 5.

## Not in this step
- Spell FX in the match (`cast-fx`, E7p hookup) → P1-8.
- APK wrapper / play-only packaging → P1-9.
- r73 project loader / OPFS / `?project=`.
- Stage list for Back; a 300 ms lost-HP chunk; a pulsing aim ring; banner fade 180/900/180; Wait widening into Talk's slot (see Open questions).

## Out of scope
painter-proto, ui-shell, GitHub push, core-types, catalogue edits, Phase 2.

## Do not touch
`painter-proto/`, `ui-shell/` (read-only reference is OK), `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts`, `src/sim/migrations`, pin files, P1-6's `tests/tools/play-stage.test.ts`. Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 987 tests passing** and 0 failing (main's count at Base + 5). Paste the summary line and all kit-run browser smoke lines into HANDBACK.md.
- The shipped test file is **byte-identical** to the kit copy.
- The branch starts at the Base (P1-6 and E7p already on main). ≤ 400 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-7-play-page-2-r<N>-chatA` (base = current main when you start; P1-6 and E7p must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-7-play-page-2-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
