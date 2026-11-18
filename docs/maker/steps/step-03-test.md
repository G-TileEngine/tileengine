# Step 3: Test opens the real play stage

r2, 2026-11-18, Editor & UX Designer (QA review `docs/qa/maker-steps-01-03-review.md` and DSK line edits applied). Needs Step 2 merged and Step 0 (S0 play input, `handoff/steps/s0-play-input.md`) merged. One builder run, 400 lines or fewer including tests, gates on.

## Goal
In an opened project, **Test** plays that project's first stage in the real play stage (`tools/play-stage`), from the saved project folder: no copy, no demo, no second rules engine. Exiting Test comes back to the same maker screen. Test never changes the project.

## Read first
1. `docs/maker/maker-spec/MS-00-play-input-and-talk.md` (how play input must behave on a phone).
2. `docs/maker/data/s1-project-load.md` §6 (reader report rows) and §8 (validation codes).
3. `docs/maker/ux/design-notes/turn-banner.md` (banner text at screen resolution).
4. Screenshot: `docs/maker/shots/68-test-battle-menu.png` (flow reference only).
5. Code: `tools/play-stage/page.ts`, `load.ts` (after Step 1), `tools/maker/project.ts` and `store.ts` (Step 2).

## Build
| File | Job | Cap |
|---|---|---|
| `src/editor/project/test-gate.ts` | Pure: from a `readProject` report, decide Test allowed or blocked, and turn each hard row into a plain sentence (code → words table). | 50 |
| `tools/maker/test-launch.ts` | Save first (await, report failure), then open `tools/play-stage/index.html?project=<id>&stage=<stageId>&from=<screen>`. | 35 |
| `tools/play-stage/project-source.ts` | Read `tileengine/projects/<id>/` from OPFS, run `readProject`, feed `playDocsOf`. Read-only store. If the project can't be read, show the reason and a Back button; never fall back to the demo silently. | 50 |
| `tools/play-stage/page.ts` edit | Use `project-source` when `?project=` is set; fixture otherwise (dev). Back button returns to `from`. | 20 |
| `tools/maker/project.ts` edit | Test button: blocked state lists the problems in words. | 25 |
| `tests/editor/test-gate.test.ts` and `tests/tools/play-stage-source.test.ts` | | 90 |
| `tools/maker/build.ts` edit | Also run the play-stage `build()` in release mode into `<out>/play-stage/`, so the built app has Maker and Play side by side. The Test URL is relative (`../play-stage/index.html?project=…`), so it works in dev and when built. | 15 |
| `tests/tools/maker-build.test.ts` edit | `play-stage/index.html` is in the output, and the built play page has no fixture fallback (QA hold: dev fallback absent from release). | 10 |
| `tests/editor/maker-law.test.ts` edit | Add `tools/play-stage/project-source.ts` and `tools/maker/test-launch.ts` to the scanned files. | 5 |

## Behaviour
- Tap **Test**: save, then validate. Clean: the play stage opens on the project's first stage. Hard rows: a sheet lists them in words ("Stage 1 points at a map that's missing"), Test stays closed. Warnings don't block.
- In play: a **Back to maker** button (48 px, top bar). Win, lose or Back returns to the same project screen with the same scroll.
- A readOnly project (`formatNewer`) can't be Tested. `readProject` returns `project: null`, so the launch shows the readOnly reason and stays in the maker, with no demo fallback.
- Nothing in play writes to the project folder.

## Must NOT
- **No new framework, starter template or app scaffold** (for example TanStack Start, a sandbox preview server, borrowed visual themes). Build only inside the repo's existing stack, files and test gates, starting from current main.
- No game rules in the maker. The maker only saves and launches; the engine and play stage run the match.
- No demo fallback when a project fails; show the failure.
- **No empty `catch` and no silent default (Law 12)**; a failed save before Test stops the launch and says why. **Plant:** the Step 2 `maker-law.test.ts` now also scans this step's files and fails on an empty `catch` or a `?? DEMO`/fixture fallback in `project-source.ts`.
- No play-input rework here (that's MS-00's step); no HUD restyle.

## Done when
- **Gates:** `npm test` passes with the test count at **floor = Step 2's merged floor + N** (N stated in the handback), plus `scripts/check-law.sh` and `scripts/check-state.sh`. **Line count:** `git diff --shortstat <run base>` is 400 or fewer.
- Tests: a clean project gives "allowed"; each hard code from S1 §8 gives its sentence; launching with an unreadable project shows the error, not the demo; after a full match the project folder is byte-identical; the Step 1 parity golden still matches when Test runs the demo template. **Named test `test-launch: save fails, no launch`:** with the store's write forced to fail, tapping Test does not open the play stage and the project screen shows the `writeFailed` reason.
- **TOUCH SMOKE PASS** (S0 `touch-smoke.mjs`) at 390 and 360 CSS width with the play stage opened by Test on the current project (`?project=<id>`), not the dev fixture. Handback quotes the PASS lines.
- **Openable app page.** `node tools/maker/build.ts <out>` gives **`<out>/maker/index.html`** and **`<out>/play-stage/index.html`**. At **390 px** in a phone-size browser on `localhost`: Home, then open a saved project, then Test plays *that saved project* (its own name and stage), then Back returns to it. In the built page, `?project=` with a missing id shows the error and never the fixture. The handback gives the command, the output tree and a 390 px screenshot mid-turn. After merge, CoS may publish to gh-pages `app/` (Test runs at `app/play-stage/`) only with the CEO's OK.
- Phone check on both phones: New (Demo) → Test → play a turn → Back lands on the same project screen.

## Prototype lessons
- ui-shell Test (`stage-live.js` r68) ran a fake battle inside the editor. That's exactly what we must not rebuild: Test is a flow into the real play stage. The shell shows only the entry point, the "nothing is saved" promise and the exit.
- Keep the split: pure gate in `src/editor/project/`, launch and UI in `tools/`.
