# Step 3: Test opens the real play stage

r7, 2026-11-18, Editor & UX Designer. r7 applies QA's recheck: P2 existing scan kept as is plus a separate tools/maker scan, and the 400-line hard gate stated with caps as guidance. r6 r6 applies the EA ruling on the one parser and the import direction (maker imports play stage, never the reverse). r4 applies the CoS step-guide audit of 2026-11-18 (step 3 fixes 1–5): Delivery block, 1b entry points, the `?project=` touch smoke in the file table, the file-name rule. r3 applied the QA review `docs/qa/maker-steps-01-03-review.md` and DSK line edits. One builder run, 400 lines or fewer including tests, gates on.

Step id: `step-03-test`. Revision: r1 for the first run, r2, r3 … for rework rounds.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at the merge of step 2 (`step/step-02-home-save-load-r<N>-chatA`). The merge sha is **TBD** (CoS supplies it when step 2 merges).
**Test floor:** step 2's merged test count + N. Write it as step 2's final count + N; CoS gives the number with the base sha. N is the number of tests this run adds; state it in the hand-back.
**Needs:** steps 0 (S0 play input, PR #76), 1a (PR #77), 1b and 2 merged.

## Delivery
Same shape as step 0 (`docs/maker/steps/step-00-play-input.md`, Delivery) and `handoff/HAND-BACK.md`.
- Branch: `step/step-03-test-r<N>-chatA`, from the base above. Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds `handback/step-03-test/r<N>/HANDBACK.md` (with the files and sections `handoff/HAND-BACK.md` lists, plus § Screenshots and § Smoke).
- Gate: `npm ci && npm run green` exits 0 at the floor above. `npm run green` runs `npm test`, typecheck, lint, deps, `check:state` (`scripts/check-state.sh`) and `check:law` (`scripts/check-law.sh`). `npm test` alone is not enough.
- **Touch smoke.** This step changes the play stage, so both smokes must print `TOUCH SMOKE PASS` at 390 and at 360 CSS px, with the ok lines pasted in HANDBACK.md § Smoke:
  1. The S0 smoke, unchanged, on the bundled demo: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`.
  2. This step's new `?project=` smoke (see Build): `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798`.
  Smoke 1 is frozen at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` and finds units by scene sprite id (`starter:hero-sword` and so on). Check that sha before you run it. If you rename a starter sprite, update the smoke in the same push.
- Push once, that branch only, through the one-shot credential helper that `handoff/HAND-BACK.md` gives (it reads `GH_BUILDER_TOKEN` from the shell; keep the single quotes).
- Never push main or a tag. No force-push, no branch delete, no PR actions.
- **No token in any output.** Never print, echo, log, commit or store the token, including in `.git/config`. No token value may appear in any file, log, screenshot or message. If it ever does, say so in the hand-back.
- Chief Of Staff opens the PR. The hand-back message quotes the branch, the full tip sha, the base sha, the test counts, the smoke PASS lines and the build output path.

## Goal
In an opened project, **Test** plays that project's first stage in the real play stage (`tools/play-stage`), from the saved project folder: no copy, no demo, no second rules engine. Exiting Test comes back to the same maker screen. Test never changes the project. This step turns step 2's greyed Test button into a working one.

## Read first
1. `docs/maker/maker-spec/MS-00-play-input-and-talk.md` (how play input must behave on a phone).
2. `docs/maker/data/s1-project-load.md` §6 (reader report rows) and §8 (validation codes).
3. `docs/maker/ux/design-notes/turn-banner.md` (banner text at screen resolution).
4. Screenshots: `docs/maker/shots/68-test-battle-menu.png` (Test flow), `39b-hard-blocked.png` (the "Can't play yet" banner and Fix button).
5. Code from step 1b, to reuse and not re-implement: `tools/play-stage/project.ts` (`openProject(files)` runs `readProject`, then `playDocsOf`, and returns `{ docs, error }`; `openBundled()` opens the bundled demo; `bundledFiles()`), `tools/play-stage/page.ts` (boots with `openBundled()` today), `tools/play-stage/load.ts` (now only `RECIPES`, `recipeOf`, `PlayDocs`, `docsToInput`; `DEMO_LOAD` is gone).
6. Code from step 2: `tools/maker/project.ts`, `tools/maker/store.ts`, `tools/maker/project-files.ts`, `tools/maker/build.ts`.
7. The S0 smoke: `handoff/steps/tests/s0-play-input/touch-smoke.mjs` (the pattern for this step's smoke).
8. `docs/maker/style-spec.md` (the only visual system).

**Import direction and the one parser (EA ruling 2026-11-18, verbatim).** "tools/maker/project-files.ts may JSON.parse each saved file to unknown as file I/O only (a throw becomes one 'unreadable' row for that path). It must not check shape, formatVersion or kind; it hands ProjectFiles to the play stage's openProject/readProject, which does all validation and migration. The play stage never imports tools/maker: the maker imports the play stage and passes ProjectFiles in, never the other way round." So Test calls `openProject(files)` from the maker side, and no maker code ends up in the play-stage or APK bundle. `readProject` takes already-parsed objects, not text.

**File names (must keep).** A saved project lives at `tileengine/projects/<projectId>/`, the tree step 2 wrote. Every document file is `<kind>_<ULID>.json`; only `project.json` and `catalogue/slice.json` have fixed names. Test reads that same tree. It never guesses `map.json` or `stage.json`.

## Build
| File | Job | Cap |
|---|---|---|
| `src/editor/project/test-gate.ts` | Pure: from a `readProject` report, decide Test allowed or blocked, and turn each hard row into a plain sentence (code → words table). | 50 |
| `tools/maker/test-launch.ts` | Maker side. Save first (await, report failure). Set the maker URL to `?project=<id>&stage=<stageId>&from=<screen>` (the maker's Test view). Read the folder with step 2's `tools/maker/project-files.ts` to get `ProjectFiles`, then call `openProject(files)` imported from `tools/play-stage/project.ts`, and hand its `docs` to the play stage's exported start function (below). If `docs` is `null` or the files can't be read, show the error text and a **Back to maker** button, start no match, and never call `openBundled()`. **Back to maker** returns to `from`. | 40 |
| `tools/play-stage/page.ts` edit | Export the start function that mounts a match from given `docs` (the same code the page already runs after `openBundled()`), so the maker can call it. The page itself keeps booting with `openBundled()` (dev and APK). It must not import anything from `tools/maker`. | 25 |
| `tools/play-stage/project.ts` edit | Let `openProject` take an optional stage id and pass it to `playDocsOf`, so `?stage=` works. No other change, and no second parser. | 5 |
| `tools/maker/project.ts` edit | Wire the Test button: it is enabled and uses the primary style. Blocked state: a sheet lists the problems in words. | 25 |
| `tools/maker/build.ts` edit | Also run the play-stage `build()` from `tools/play-stage/build.ts` (release mode) into `<out>/play-stage/<stamp>/`, using the same stamp rule as step 2, so the built app has Maker and Play side by side. The maker bundle includes the play-stage code it imports; the play-stage bundle includes no maker code. Pass the dev flag through for the smoke build. | 20 |
| `tests/editor/test-gate.test.ts` and `tests/tools/play-stage-source.test.ts` | See Done when. | 90 |
| `tests/tools/maker-build.test.ts` edit | `play-stage/<stamp>/index.html` is in the output, and the maker's Test view with a missing `?project=` id shows the error, not the fixture (QA hold: no dev fallback in release). | 10 |
| `tests/project/load/one-parser.test.ts` edit (plant P2) | Leave the existing scan of `src/project/load` and `tools/play-stage` **unchanged**: same regex with its `spell`/`talk` exception, `ALLOW` still empty. Add a **separate** scan of `tools/maker` that bans `formatVersion` and `kind ===` outright and allows exactly **one** `JSON.parse`, in `tools/maker/project-files.ts`, pinned by file name plus a count of 1 (not by line text). Add a check that no `tools/play-stage` file imports from `tools/maker`. | 15 |
| `tests/editor/maker-law.test.ts` edit | Add `tools/maker/test-launch.ts` and `tools/play-stage/page.ts` to the scanned files. The fallback plant fails on `?? DEMO`, `?? openBundled(` or `|| openBundled(` anywhere in the scanned files. The Step 2 theme plant already covers any new `tools/maker/**` file, such as the blocked-Test sheet. The play stage's HUD is outside it. | 5 |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` | new: the `?project=` touch smoke (below). Own cap, outside the 400, as with S0's smoke. | 130 (own cap) |

**Hard gate: 400 counted lines**, the same as every other step (counted as in Done when, outside the smoke script). The per-file caps above sum to 290 and are guidance only; a file may go over its cap if the total stays within 400, and the hand-back says which file and why.

**The `?project=` touch smoke (`handoff/steps/tests/s3-test/touch-smoke.mjs`).** Copy the S0 smoke's pattern: same env (`PLAYWRIGHT_CORE`, `CHROME`), same static server on 127.0.0.1, same `ok` / `FAIL` lines and the final `TOUCH SMOKE PASS`, same widths 390 and 360. Differences:
- It builds with the exported build function of `tools/maker/build.ts` in dev mode (the play page needs its dev globals), not with `buildWeb` from `tools/apk/build.ts`.
- It opens `/maker/`, makes a project with New (Demo) by taps, opens it and taps **Test**.
- It asserts the maker's URL has `?project=<that id>`, the match is mounted from that project, and the bundled fixture was not used.
- It then runs the same seven checks as the S0 smoke. Find units the same way S0 does: by scene sprite id (`starter:hero-sword` and so on), not by unit id.
- Last, it taps **Back to maker** and asserts the same project screen is shown.
Do not edit the S0 smoke or anything else under `handoff/steps/tests/s0-play-input/`.

## Behaviour
- Tap **Test**: save, then validate. Clean: the play stage opens on the project's first stage. Hard rows: a sheet lists them in words ("Stage 1 points at a map that's missing"), Test stays closed. Warnings don't block.
- In play: a **Back to maker** button (48 px, top bar). Win, lose or Back returns to the same project screen with the same scroll.
- A readOnly project (`formatNewer`) can't be Tested. `readProject` returns `project: null`, so the launch shows the readOnly reason and stays in the maker, with no demo fallback.
- A rejected project already shows the report and starts no match (1b). Keep that.
- Nothing in play writes to the project folder.

## Must NOT
- **No other theme or visual system.** Use only the tokens, type, spacing, radii and components in `docs/maker/style-spec.md`: no template theme (no "dark paper"), no CSS framework, no web or icon fonts, no new colours.
- **No new framework, starter template or app scaffold** (for example TanStack Start, a sandbox preview server, borrowed visual themes). Build only inside the repo's existing stack, files and test gates, starting from current main (the base above).
- No game rules in the maker. The maker only saves and launches; the engine and play stage run the match.
- **No second adapter.** Do not write a new `project-source.ts` or any other file that turns documents into play docs. Use `openProject` / `playDocsOf` in `tools/play-stage/project.ts`. Do not add `JSON.parse`, `formatVersion` or `kind ===` to `tools/play-stage/*.ts` (plant P2). The only `JSON.parse` in `tools/maker` is the one in `project-files.ts`, and it checks no shape, `formatVersion` or kind. No `tools/play-stage` file imports from `tools/maker`.
- No demo fallback when a project fails; show the failure.
- **No empty `catch` and no silent default (Law 12)**; a failed save before Test stops the launch and says why. **Plant:** see the `maker-law.test.ts` edit above.
- No play-input rework here (that's MS-00's step); no HUD restyle.
- Don't touch the frozen kit copies under `handoff/steps/tests/` (adding the new `s3-test/` folder is allowed).
- Offline, no new dependencies.

## Done when
- **Gates:** `npm ci && npm run green` exits 0 at **step 2's merged count + N** or more (N stated in the hand-back). That includes `scripts/check-law.sh` and `scripts/check-state.sh`. **Line count:** `git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s3-test/**'` is 400 or fewer, and the smoke script is 130 lines or fewer.
- **Tests:** a clean project gives "allowed"; each hard code from S1 §8 gives its sentence; launching with an unreadable project shows the error, not the demo; after a full match the project folder is byte-identical; the Step 1 parity golden still matches when Test runs the demo template. **Named test `test-launch: save fails, no launch`:** with the store's write forced to fail, tapping Test does not open the play stage and the project screen shows the `writeFailed` reason.
- **TOUCH SMOKE PASS** at 390 and 360 CSS width from both smokes (see Delivery). The `?project=` smoke runs the play stage opened by Test on the current project, not the dev fixture. The hand-back quotes the PASS lines.
- **One parser and import direction (P2):** `tests/project/load/one-parser.test.ts` passes with the existing load/play-stage scan unchanged (`ALLOW` empty, `spell`/`talk` exception kept), plus the separate `tools/maker` scan: exactly one `JSON.parse` in `tools/maker` (in `project-files.ts`, count 1), no `formatVersion` or `kind ===` in `tools/maker`, and no `tools/play-stage` import from `tools/maker`.
- **Openable app page.** `node tools/maker/build.ts <out>` gives **`<out>/maker/index.html`** and the play stage under **`<out>/play-stage/`** (at `<out>/play-stage/<stamp>/index.html`). Serve `<out>` on `127.0.0.1` the same way as step 2. At **390 px** in a phone-size browser: Home, then open a saved project, then Test plays *that saved project* (its own name and stage), then Back returns to it. In the built maker, `?project=` with a missing id shows the error and never the fixture. The hand-back gives the command and the output tree.
- **Look matches the shots at 390 px.** Each screen this step builds matches its reference in `docs/maker/shots/` (`68-test-battle-menu.png` for the Test entry and Back to maker; `39b-hard-blocked.png` for the blocked-Test sheet) in colours, type, spacing, radii and components, per `docs/maker/style-spec.md`. The play stage's own HUD is not restyled here. Every target is 48 px or more, with AA contrast.
- **Screenshots:** HANDBACK.md § Screenshots attaches one 390×844 screenshot per screen, in light theme: the project screen with the working Test, the blocked-Test sheet, the play stage mid-turn opened by Test (with Back to maker), and the error screen for a missing project.
- **Not the builder's gate:** the phone check on both phones (New (Demo) → Test → play a turn → Back lands on the same project screen) is a CoS / CEO pass after the hand-back. After merge, CoS may publish `<out>` to gh-pages `app/` only with the CEO's OK.

## Prototype lessons
- ui-shell Test (`stage-live.js` r68) ran a fake battle inside the editor. That's exactly what we must not rebuild: Test is a flow into the real play stage. The shell shows only the entry point, the "nothing is saved" promise and the exit.
- Keep the split: pure gate in `src/editor/project/`, launch and UI in `tools/`.
