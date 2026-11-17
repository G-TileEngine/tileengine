# step-p1-8-spell-effects: Phase 1 P1-8 "Spell effects in the match" (foundation-plan-phased.md §3, ~lines 80–82). On each ability log entry the play page calls E7p `createCastFx({sheetOf, clipOf?, values})` and `cueFromEntry(entry, stepMs, refOf)` from `src/runtime/scene/cast-fx.ts`, with `readEffect` from `src/project/read/index.ts`. `refOf` is `(action) => action.effects.length === 1 ? action.effects[0] : undefined`. Attack uses a house default effect. F17: an editor-saved setup is what the match uses. Proof: kit-run browser smoke — the spell's effect is live, then hit, then retire. 390×844 and 360 wide.

Step id: step-p1-8-spell-effects          Revision: r3 (drop unused PlayFx import; restack on P1-7 r5; 174 / cap 400)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: current main when you start (at kit authoring, `origin/main` is `70c4d07d7d70cbd209babe3e8bb41564b643e73a`, runnable count **981**, with P1-5 r2, ED-E7 and P1-6 r2 already merged). **P1-7 must already be merged on that main** (and therefore P1-6h, E7p, P1-6…P1-2, E7). Floor = that main's test count + 4. If P1-7 is not on main, or if P1-7's APIs on main differ from what the shipped tests import, **stop and report**. At kit authoring the restacked stack after P1-7 is 998/0, so the authoring floor is **1002**. Branch: `step/step-p1-8-spell-effects-r<N>-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.
Hand-back location: `handback/step-p1-8-spell-effects/r<N>/HANDBACK.md`. Quote this step file's sha256 in full in it.
Depends on: P1-7 (play-stage match, HUD, Spell door) and E7p (`createCastFx`, `cueFromEntry`, `readEffect`), and therefore P1-6h. Build order on main is E6 → P1-3 → P1-4 → P1-5 → E7 → P1-6 → E7p → P1-6h → P1-7 → **P1-8** → P1-9.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Goal
After P1-7 the Spell button fires `line-shot` as an ability log entry, but the match does not play a visible effect. After this step:
1. **Cast-fx hookup.** On each new ability log entry the play host calls E7p `cueFromEntry(entry, stepMs, refOf)` and `createCastFx({sheetOf, clipOf?, values})` from `src/runtime/scene/cast-fx.ts`. `refOf` is exactly `(action) => action.effects.length === 1 ? action.effects[0] : undefined`. `values` looks up a ref with a `Map` (or `Object.hasOwn`), never `in` on a plain object. `sheetOf` / `clipOf` come from the play-stage FX sheet. `readEffect` is imported from `src/project/read/index.ts`. The live list is attached to the scene world (`world.effects`); `createSceneLink().scene(...)` is what fires `fx:hit`.
2. **House default.** A basic attack logs `kind: "ability"` with an empty `effects` array, so the specified `refOf` returns `undefined`. The host then synthesizes a house-default cue (`house:basic-attack`) only when `effects.length === 0`. Do not change `refOf` to pick a house ref itself.
3. **F17 settings round-trip.** `PlayDocs.effects` carries editor-saved behaviour-setup JSON into `createPlay` / `createPlayFx` (hook on ChatA's `createPlay`; leave `docsToInput` as it is), which `readEffect`s each doc into the values table (own-key safe). The match uses those saved values (rev, steps), not the stock `line-shot` or house docs.
4. **Smoke.** Kit-run headless Chromium at 390×844 and 360 wide: a Spell two-tap shows the spell's effect live, then `fx:hit`, then it retires. 0 repo lines.

## Rulings made
- House default for a basic attack is applied by the host when `refOf` is undefined and `effects` is empty, not by changing the specified `refOf`.
- F17 goes through `PlayDocs.effects` / `docsToInput`. No OPFS and no r73 loader in this step.
- Built-in `line-shot` values are a swerve plus an at-hit stamp (`LINE_SHOT_DOC`). The compiler may note `atHitBeforeHit`; the effect still goes live, hits, and retires. Optional to tidy later.
- Id-keyed lookups use a `Map` (or `Object.hasOwn`); a prototype-key `constructor` is not an effect row and does not throw.
- Do not import unused types (`PlayFx` is not imported from `board.ts`). `npx eslint --max-warnings 0 .` exits 0.

## Open questions
None that block this step. `LINE_SHOT_DOC` may emit `atHitBeforeHit` (ruling above).

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `tools/play-stage/fx.ts` | new: `createPlayFx`, `refOf`, house default, bake FX sheet, ingest cues | 63 | 72 |
| `tools/play-stage/load.ts` | `PlayDocs.effects?`; `hostSeed` optional with default; leave ChatA `docsToInput` in place | 4 | 8 |
| `tools/play-stage/board.ts` | hooks only: `createPlayFx(body.effects)`, bake FX sheet, `play.fx`, `scene()` returns the SceneWorld including `effects`; leave ChatA bake / `fit` / intend in place | 16 | 24 |
| `tools/play-stage/page.ts` | wrap the driver view with `createSceneLink().scene(...)`; expose `__fx` / `__link` for the kit-run smoke | 6 | 10 |
| `tests/tools/play-stage-p18.test.ts` | new, shipped, byte-identical | 85 | 85 |
Total ≤ 400 changed lines (proto **174**: tools 89, tests 85; added+deleted). Hard cap 400. (Plan estimate was ~180.)

## Tests that prove it is done (4 new; ship the file byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-8-spell-effects/` to the same paths at the repo root. `tests/tools/play-stage-p18.test.ts` (4 tests: `refOf` is exactly one effect, a `constructor` id does not throw, empty effects get the house default, two-effect entries stay empty; F17: an editor-saved effect setup is what `createPlayFx` / the match uses; a Spell two-tap cues `line-shot`, the scene is live, `createSceneLink` gets `fx:hit`, then it is retired; a basic attack with empty effects plays the house default). N = 4. P1-6 and P1-7 play-stage tests stay green.

## How a planted bug is caught
EA plants 8/8 (`p1-8-plants.py`). `refOf` returning the first of several effects, skipping the house default, ignoring editor-saved docs, never attaching `world.effects`, dropping `cueFromEntry`, `docsToInput` dropping `effects`, looking up values with `in` on a plain object, or firing `houseCue` when a ref is already present each fail a shipped test.

## Kit-run browser smoke (0 repo lines)
`handoff/steps/tests/step-p1-8-spell-effects/smoke.mjs` is required in the hand-back. From the repo root: `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-p1-8-spell-effects/smoke.mjs . 8795 /tmp/p1-8-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It serves `tools/serve.ts`, opens `/tools/play-stage/` headless at **390 × 844** and **360 wide** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute). Visible (not `display:none`) buttons must be ≥ 44×44. A Spell two-tap must show the spell's effect live, then `fx:hit`, then retire.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 1002 tests passing** (main's count at Base + 4, once P1-7 is on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on the restacked stack: 1002/0.)
- [ ] If P1-7 or E7p is not on main, or if those APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 400 changed lines in total (174 in the proto). Hard cap 400.
- [ ] The shipped test file is byte-identical to the kit copy. Earlier play-stage tests stay green.
- [ ] **Kit-run browser smoke (REQUIRED)** exits 0 with `SMOKE PASS` at 390×844 and 360 wide (no page errors, no sideways scroll, visible buttons ≥ 44×44, spell effect live then hit then retire).
- [ ] Never touch `painter-proto/` or `ui-shell/`. Game rules stay out of `src/core` and `src/sim`. BTF is used only via adapters or rewrites with file:line cites (none new in this step). Id-keyed lookups use a `Map` or `Object.hasOwn`.

## Floor
`npm run green` is at least **1002** tests passing (main's count at Base + 4, once P1-7 is on that main: 981 + 7 + 4 + 6 + 4). If main's count at Base (with P1-7 already merged) is C, the floor is C + 4.

## Not in this step
- APK wrapper / play-only packaging → P1-9.
- Building, signing or uploading an APK (ops, not a builder step).
- r73 project loader / OPFS / `?project=`.

## Out of scope
painter-proto, ui-shell, GitHub push, core-types, catalogue edits, Phase 2, CEO phone test 1 (dropped; the CEO's first real test is the APK).

## Do not touch
`painter-proto/`, `ui-shell/` (read-only reference is OK), `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts`, `src/sim/migrations`, P1-6h and P1-7 play-stage tests, E7p's shipped tests. Do not drop or weaken those tests. Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 1002 tests passing** and 0 failing (main's count at Base + 4). Paste the summary line and all kit-run browser smoke lines into HANDBACK.md.
- The shipped test file is **byte-identical** to the kit copy.
- The branch starts at the Base (P1-7 and E7p already on main). ≤ 400 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-8-spell-effects-r<N>-chatA` (base = current main when you start; P1-7 and E7p must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-8-spell-effects-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
