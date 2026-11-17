Build step-p1-6-play-page-1 r1 from the step file `handoff/steps/step-p1-6-play-page-1.md` (sha256 `68df7520d4aca9058124e488f33b690848d3cb4f1b4719b361453c67255df707`); it wins over this paste.

Base commit: current main when you start (at kit authoring, `origin/main` is `9ac26da821d8f5e71a108cdbc578c5c8a38f2037`, runnable count **922** with P1-2 and ED-E6 already merged). Floor = that main's count + 4 (authoring floor **975**). **P1-5 and E7 must already be merged on that main.** If a required earlier step is missing or its APIs on main differ from what the shipped tests import, **stop and report**. Branch: `step/step-p1-6-play-page-1-r1-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

Shipped files (copy byte-identical from `handoff/steps/tests/step-p1-6-play-page-1/` to the same paths at the repo root): `tests/tools/play-stage.test.ts`. Floor: green at least main's count + 4 = 975 passing on a main that already holds the earlier steps, 0 failing (proto 975/0).

Kit: kit-1 **r1**, 2026-11-17. Engine Architect. Restacked proto `/tmp/batch2` branch `proto/restack`, head `6811a9284875d652a37afc4ab92eaa0e194102c6`, tree `b4abeb5e1b7db543d062a0f6393d00068b33e817`, parent `19b3d76558af4b2a6b7829266130c9cfad8a9fa7`. 6 files, +393/−0 = **393 changed lines** (tools 315, tests 78). Green **975/0**. N = 4. Hard cap 400.
## Goal
After P1-5 the rules can run a match, but there is no play page: no board you can tap, no walk you can see, no bundled demo. After this step:
1. **Host.** `tools/play-stage/` is a static page (`index.html` + `page.ts`) that boots a rules world from a bundled demo (`load.ts`: a 6×9 map, knight/archer/crate/villager/wolves, `DEMO_TALK`). `docsToInput` is the hook for a later r73 / OPFS / `?project=` loader; this step starts on the bundled demo only.
2. **Board and stand-ins.** Terrain and unit tokens are baked as `Pixels` sheets. Units without a sprite use a stand-in token keyed by `starter:*` recipe ids (UX (b)), coloured from the recipe (Shirt / enemy colour) with the first letter of the name. `recipeOf` uses `Object.hasOwn` (or a Map), not a prototype-key read: `recipeOf("constructor")` is the fallback token and does not throw.
3. **Touch and walk.** `createPlay` seats a human on `"player"` and constructs the P1-5 bot (it is not run until P1-7 End turn). Pointer samples go through `createGestureMapper` (art pixels, `cellPx = 16`). Select a living own unit → orthogonal reach highlights (`reachCells` with the installed `step-pattern`, default `orthogonal-1` + `max_step` 2, so reach is **1**, not a special 2). First tap on a reachable empty tile previews the path and does not walk; the second tap on the same tile feeds `TargetCell` and starts a host-owned walk. Occupancy stays at the start until `apply()`; `setOffset` interpolates along the path; on duration, `MOVE_DONE` then (this step only) auto `WAIT` + `UNIT_DONE` back to `idle`. A first tap on a different tile or a cancel clears the preview.
4. **Draw and build.** `world-scene` + `raf-driver` paint the board; reach/path use `Overlay`s on `fxGround` (there is no host `dots` bag). `tools/play-stage/build.ts` follows the device-page builder: walk relative `.ts` imports, `stripTypeScriptTypes`, write `index.html` with a `.js` script tag, and a `build.json`. The non-relative import regex requires whitespace after `from` / `import` so a template `"from":` in `src` is not treated as an import. `load()` on the driver must return a real `OffscreenCanvas` baked from `pixels()` (a dummy `{}` `drawImage`s and throws).
5. **Smoke.** Kit-run headless Chromium at 390×844 and 360 wide (touch, @3x): no page errors, no sideways scroll, no sub-44 px visible targets, select a knight, blue reach tiles, two-tap walk, the unit arrives, `idle` after `MOVE_DONE`. 0 repo lines.

## Rulings made
- r73 / OPFS / `?project=` is not required; start on the bundled demo; `docsToInput` is the hook.
- The player door for line-shot is deferred to P1-7 (with the Spell button). P1-5's "→ P1-6" note is carried there.
- After a walk, this step auto-WAITs and returns to `idle` so P1-6 tests stay on the walk loop. P1-7 sets `autoWait: false` and stops at `actMenu`.
- The bot is constructed in `createPlay` but not run until P1-7 End turn.
- Talk text is `DEMO_TALK` (`talk-villager`: "Hello, traveler."). `setupIds` on the demo stage are stored but ignored by `readStage`. Catalogue talk behaviour is the Librarian's.
- Walk reach is the installed step-pattern default (orthogonal-1, reach 1), not a special reach 2.
- The merchant stays player-side (not a Talk target); the villager is the demo NPC.
- The builder regex requires whitespace after `from`/`import` so a `"from":` template in `src` is not an import.
- Banner / HUD / talk text at screen resolution on an overlay is a P1-7 item (already adopted in UX answers).
- Play-only APK is a P1-9 item (UX agreed); noted only.

## Open questions
- Confirm `starter:hero-cleric` and `starter:prop-crate` as extra stand-in ids (UX (b) listed sword/staff, the NPCs, and the enemy set, but not a cleric or a crate). Default: keep both for the bundled demo.
- Confirm talk keys stay host-owned (`talk-villager` / unitId) until the Librarian names a catalogue behaviour.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `tools/play-stage/index.html` | new: canvas `#board`, `#0d1220`, `touch-action:none`, `src="./page.ts"` | 7 | 8 |
| `tools/play-stage/load.ts` | new: `TILE`, `TEAM`, `RECIPES` / `recipeOf` (`Object.hasOwn`), demo map/stage/talk, `docsToInput` | 75 | 85 |
| `tools/play-stage/board.ts` | new: `createPlay`, fit, tokens, two-tap walk, overlays, boot | 154 | 165 |
| `tools/play-stage/page.ts` | new: rAF driver, `load()` bakes an `OffscreenCanvas`, `__play` / `__driver` | 38 | 45 |
| `tools/play-stage/build.ts` | new: device-page clone, tightened non-relative import regex | 41 | 48 |
| `tests/tools/play-stage.test.ts` | new, shipped, byte-identical | 78 | 78 |
Total ≤ 400 changed lines (proto **393**: tools 315, tests 78). Hard cap 400.

## Tests that prove it is done (4 new; ship the file byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-6-play-page-1/` to the same paths at the repo root. `tests/tools/play-stage.test.ts` (4 tests: boot + `docsToInput`; select + reach overlays + `recipeOf("constructor")` + pixels + pointer tap on a *fresh* play; two-tap walk then idle; static build). N = 4.

## How a planted bug is caught
EA plants 12/12 (`p1-6-plants.py`). Skipping boot, `recipeOf` via `in`, walking on the first tap, omitting reach overlays, never writing an offset, never firing `MOVE_DONE`, empty reach, no pixels, leaving the `page.ts` script tag in the build, not feeding pointer samples (must be planted on a play that was not already selected via `intend`), dropping `talk` in `docsToInput`, or a reach of 99 each fail a shipped test.

## Kit-run browser smoke (0 repo lines)
`handoff/steps/tests/step-p1-6-play-page-1/smoke.mjs` is required in the hand-back. From the repo root: `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-p1-6-play-page-1/smoke.mjs . 8792 /tmp/p1-6-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It serves `tools/serve.ts`, opens `/tools/play-stage/` headless at **390 × 844** and **360 wide** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute). After select, the phase is `unitSelected` (not `idle`). After the two-tap walk (and the auto-WAIT of this step) the phase is `idle`.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 975 tests passing** (main's count at Base + 4, once P1-5 and E7 are on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on the restacked stack: 975/0.)
- [ ] If P1-5 or E7 is not on main, or if those APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 400 changed lines in total (393 in the proto). Hard cap 400.
- [ ] The shipped test file is byte-identical to the kit copy.
- [ ] **Kit-run browser smoke (REQUIRED)** exits 0 with `SMOKE PASS` at 390×844 and 360 wide (no page errors, no sideways scroll, visible buttons ≥ 44×44, select, reach, two-tap walk, unit arrives, idle).
- [ ] Never touch `painter-proto/` or `ui-shell/`. Game rules stay out of `src/core` and `src/sim` (this step is host-only under `tools/play-stage/`). BTF is used only via adapters or rewrites with file:line cites (none in this step).

## Floor
`npm run green` is at least **975** tests passing (main's count at Base + 4, once P1-5 and E7 are on that main: 922 + 13 + 11 + 9 + 16 + 4). If main's count at Base (with P1-5 and E7 already merged) is C, the floor is C + 4.

## Not in this step
- Camera pan / pinch / follow, HUD, action row, talk popup, End turn, win/lose, Restart → P1-7.
- Player door for choosing line-shot → P1-7.
- r73 project loader / OPFS / `?project=` (the hook is `docsToInput` only).
- Spell FX in the match → P1-8 (needs E7p).
- APK wrapper → P1-9.

## Out of scope
painter-proto, ui-shell, GitHub push, core-types, catalogue edits.

## Do not touch
`painter-proto/`, `ui-shell/` (read-only reference is OK), `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts`, `src/sim/migrations`, pin files. Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 975 tests passing** and 0 failing (main's count at Base + 4). Paste the summary line and all kit-run browser smoke lines into HANDBACK.md.
- The shipped test file is **byte-identical** to the kit copy.
- The branch starts at the Base (P1-5 and E7 already on main). ≤ 400 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-6-play-page-1-r<N>-chatA` (base = current main when you start; P1-5 and E7 must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-6-play-page-1-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
