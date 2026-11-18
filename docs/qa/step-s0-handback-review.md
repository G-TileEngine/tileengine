# QA handback review: s0-play-input r1

QA & Build Guard, 2026-11-18, Europe/London. Read-only. Fresh worktrees `/tmp/q/s0-tip` at `3a1fb48525dea545be8e08297b82d1c6d604cd1f` (tree `ea99548c2336eab59b20615cd8f71e36767242a7`) and `/tmp/q/s0-base` at main `1b834c3162c33e698a6c389a286c63fc8dc994f4` (merge-base confirmed). Kit `docs/maker/steps/step-00-play-input.md` (identical to `handoff/steps/s0-play-input.md`) sha256 `2c62a34212cbdf7c98d9db0d70cefb75f8a7b6aaa5b93928e8883d059fc7f262`. Prior reviews not edited. No GitHub writes and no edits to other bots' files.

## Verdict: OK TO OPEN PR

No must-fixes. TP-1–TP-3 are fixed in `tools/play-stage`. TP-4 remains the S0b carry. The pre-existing ui-shell lint gap does not block this merge.

## Checks

| Check | Result |
|---|---|
| Tip, tree, merge-base | Match the claimed SHAs. Two commits, both `G-TileEngine <G-TileEngine@users.noreply.github.com>` as author and committer. Last commit is the HANDBACK. |
| `npm test` / tsc | **1023 pass / 0 fail / 0 skip**. `tsc --noEmit` exit 0. `deps`, `check:state`, `check:law` exit 0. |
| Touch smoke @390 and @360 | `PLAYWRIGHT_CORE` = playwright-core@1.59.1, `CHROME=/usr/bin/google-chrome`. All 7 ok lines at each width, then `TOUCH SMOKE PASS`, exit 0. Trusted `page.touchscreen.tap` / CDP `Input.dispatchTouchEvent`; `#board` probe requires `isTrusted`; mapping is `canvas.width/rect.width` (never `devicePixelRatio`). Walk asserts the knight's `at` changes and phase `actMenu`. Attack asserts HP below max, one new `ability` log, knight in `done`. Talk asserts the sheet is visible with "Villager" / "Hello, traveler.", height ≤ 35%, Close ≥ 44 px, then both units in `done` on the same turn. Pan is 120 CSS px left (clamp-allowed) and `cam.x` grows by `120·k/cam.s`; the old dpr maths lands on a different cell. End Turn requires a wolves bot call, then player `idle`, `turns+1`, `done.size === 0`, and a reselect. Visible buttons including `#recentre` are ≥ 44 px; no page errors; no non-localhost requests. |
| Line caps | Seven kit files: 321 insertions / 42 deletions. Six files excluding the smoke: **256** changed lines (board 4/8, hud 11/25, page 35/35, match 65/85, touch.ts 63/75, tests 78/100) ≤ 400. `touch-smoke.mjs` is **107** ≤ 130. No `src/` changes; `gestures.ts` and the rules tables are byte-identical to the base. The unfiltered shortstat (13 files, +6629) is the handback pack, mostly `test-output.txt` (+6186); those are delivery artifacts, not counted against the cap. |
| Build law | No new rAF or `setInterval` loop (existing `createDriver` stays the clock). No empty `catch` and no new silent `?? {}` in the diff. No `DEV`, `window.__*` or console debug in `touch.ts`. `page.ts` still has the `// dev-only` `__play` / `__cam` hooks the smoke reads; a release `build(..., false)` leaves no `DEV` token in the www. No `ui-shell` imports. Scope matches the kit's Done-when. HUD buttons, `#recentre` and Close are 48 px. |
| Tests 1–9 fail on base | New test file alone on base: file load fails (`touch.ts` missing). New tests + new `touch.ts` on base play-stage: **7 fail / 2 pass**. Fails: (1) one-tap walk stays `unitSelected` (TP-1 / F1); (2) wolf HP unchanged (TP-1 / X1+X2); (3) `talk` stays null (TP-1); (4) no implicit Wait (TP-2); (7) walk does not land (one-tap, not the 280 ms wedge); (8) `done` missing, then End Turn from targeting (TP-3 / F5); (9) `choose("basic")` returns `null` not `"noTarget"`. Tests 5 and 6 pass because pan/pinch/`hit()` live in the new `touch.ts`. TP-3 page wiring is the smoke, which already failed on the pre-fix base in the r2 kit review. Test 5 pans 120 CSS px left at `cam.s === 18`, `cam.y === 34`, `cam.x` +20 (clamp-allowed). Unit tests drive `createTouch` with scripted `TouchEv`s into `createMatch()` and never call `intend`; they do call `choose` / `endTurn` / `closeTalk` as the kit specifies. Real PointerEvents through `page.ts` are the smoke. |
| Lint | `eslint` on the seven S0 files: 0 errors. Full `eslint --max-warnings 0 .` on base and tip: **identical 15 errors**, all in `ui-shell/mock-effects-v3/js/fx-render.js` and `fx-ui.js`. The branch adds none. `npm run green` therefore exits 1 on both, for that reason only. |
| HANDBACK drift | Kit sha256 quoted in full. § Smoke pastes the same 14 ok lines and `TOUCH SMOKE PASS` (their run used playwright-core@1.64.0 and a headless shell; this rerun used 1.59.1 and `/usr/bin/google-chrome`). § Helpers & self-review is present (match router, touch/page/hud, smoke, plus G1–G10). Counts (1023, 256, 107, lint 15, page at 35) match. Header head/tree SHAs are the pre-HANDBACK commit, which is expected. Documented smoke deviations (set `cam.s` to the fit, frame the knight before the step-6 reselect; wrap `play.bot` so a skipped wolves turn cannot pass) are camera/setup, not input, and are accepted. |

## Lint ruling

The base lint gap does **not** block S0. The 15 eslint errors are pre-existing on main `1b834c31` (landed with `15f73fb`) and sit outside the diff, in prototype-only `ui-shell/**` that this step must not edit. Fix them separately with an eslint ignore for `ui-shell/**` (config only, its own small commit). Done-when for S0 is read as "green except the identical pre-existing ui-shell errors."

## Flags (not must-fixes)

- The 280 ms `lastTap` / `centre()` path lived in `page.ts`. It is gone in the product, but unit test 7 does not go through `page.ts` and the smoke does not fire a quick double tap, so restoring that wedge would not fail these gates.
- Tests 5 and 6 cannot go red on base once the new `touch.ts` is present; a `page.ts` mapping regression is caught by the smoke, not by those unit tests.
- TP-4 (`SIDES` / only wolves) is still the S0b carry, as the kit requires.

Evidence: `/tmp/q/s0-tip-npm-test.log`, `/tmp/q/s0-smoke.log`, `/tmp/q/s0-tip-eslint.log`, `/tmp/q/s0-base-eslint.log`, `/tmp/q/s0-fail-base-with-touch.log`, release www at `/tmp/q/s0-release-www`.
