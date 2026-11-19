# Step 2: Home, save and load

r6, 2026-11-18, Editor & UX Designer. r6 applies QA's recheck: base 9fc49890, maker I/O stays maker-side, stamp tests plus collision, cleanup and no-cache rules, and the full token plant. r4 applies the CoS step-guide audit of 2026-11-18 (step 2 fixes 1–8) and two QA carries from the 1b review. r3 applied the QA review `docs/qa/maker-steps-01-03-review.md` and DSK line edits. Save-file rules are **owned by Data & Save Keeper** (project-format §11.2 and §2; DSK answers 2026-11-18, in **Save rules** below). One builder run, 400 lines or fewer including tests, gates on.

Step id: `step-02-home-save-load`. Revision: r1 for the first run, r2, r3 … for rework rounds.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at the merge of step 1b (`step/step-s1b-play-stage-switch-r1-chatA`, tip `ef29b514`). Build from main at **`9fc498903ac615e75014f597e54af49fab547e27`**: the PR #78 merge (`57af7135`) plus the S0 smoke refreeze, which landed on the CEO's SEND. On `57af7135` alone the smoke is still the old `a4a607b2` and fails, so don't start there. Do not start from an older main: 1a alone (`aa158fda`) or the docs tip `67615ad` is the wrong base.
**Test floor:** **1036 + N**. 1b lands at 1036 tests. N is the number of tests this run adds; state it in the hand-back.
**Needs:** steps 0, 1a and 1b merged. After 1b the play stage loads the demo through `readProject`, then `playDocsOf` / `openProject` / `openBundled()` in `tools/play-stage/project.ts`. There is no `DEMO_LOAD` left to copy from.

## Delivery
Same shape as step 0 (`docs/maker/steps/step-00-play-input.md`, Delivery) and `handoff/HAND-BACK.md`.
- Branch: `step/step-02-home-save-load-r<N>-chatA`, from the base above. Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds `handback/step-02-home-save-load/r<N>/HANDBACK.md` (with the files and sections `handoff/HAND-BACK.md` lists, plus § Screenshots and § Smoke).
- Gate: `npm ci && npm run green` exits 0 with at least 1036 + N tests passing. `npm run green` runs `npm test`, typecheck, lint, deps, `check:state` (`scripts/check-state.sh`) and `check:law` (`scripts/check-law.sh`). `npm test` alone is not enough.
- **S0 touch smoke.** This run edits play-stage files (the two QA carries). So run the S0 smoke unchanged: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`. It must print `TOUCH SMOKE PASS` at 390 and at 360 CSS px. Paste the ok lines in HANDBACK.md § Smoke. The smoke is frozen at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`. It finds units by scene sprite id (`starter:hero-sword` and so on), and QA ran it on the 1b merge: 14/14 ok, PASS. It is on main from `9fc49890`. Check that sha before you run it. Do not edit the frozen kit under `handoff/steps/tests/`. If you rename a starter sprite, update the smoke in the same push.
- Push once, that branch only, through the one-shot credential helper that `handoff/HAND-BACK.md` gives (it reads `GH_BUILDER_TOKEN` from the shell; keep the single quotes).
- Never push main or a tag. No force-push, no branch delete, no PR actions.
- **No token in any output.** Never print, echo, log, commit or store the token, including in `.git/config`. No token value may appear in any file, log, screenshot or message. If it ever does, say so in the hand-back.
- Chief Of Staff opens the PR. The hand-back message quotes the branch, the full tip sha, the base sha, the test counts and the build output path.

## Goal
The first real maker screen. A phone-first Home lists the user's projects. The user can make a new project from a template, open, rename, duplicate and delete one, and every change is saved as a project folder (the Step 1 layout) on the device. Reopening the app shows exactly what was saved. No editors yet. An opened project shows its name, its stage count and a **Test** button that is visible but greyed out (see **The greyed Test button** below). Step 3 wires Test.

## Read first
1. `docs/maker/maker-spec/MS-01-home-and-projects.md` (UX spec for this screen).
2. `docs/maker/data/s1-project-load.md` §3 (folder layout), §6 (reader), §7 (versions) and `docs/maker/data/project-format.md` §2, §3.1, §16.
3. `docs/maker/ux/screen-map.md` (row `home`) and `docs/maker/ux/design-notes/shell-and-look.md` (r62 look: colours, type, 48 px targets).
4. Screenshots: `docs/maker/shots/01-home.png`, `24-project-settings.png`, `18-undo-toast.png` (look and behaviour reference).
5. Code to copy the shape of: `src/editor/effect/save.ts` (`Store`, stale-rev refusal), `tools/effect-designer/store.ts` (`opfsStore`), `tools/effect-designer/page.ts`.
6. Code from step 1 to reuse: `src/project/load/index.ts` (`readProject`), `tools/play-stage/project.ts` (`playDocsOf`, `openProject`, `bundledFiles`), `tools/play-stage/load.ts` (`RECIPES`, `recipeOf`), `tools/play-stage/build.ts` (`build`, `toJs`, `release`, `refuse`, `sha`), and `fixtures/demo.tileproj/`.
7. `docs/maker/style-spec.md` (the only visual system: tokens, type, spacing, radii, buttons, cards, sheets, pills, 390 px rules).

## Rules this step must keep
1. **The greyed Test button (the one named exception).** Test is the only control in this step that is shown but does not work yet. It is visible on the opened-project screen. It uses the disabled primary style from style-spec: fill `--soon`, text `--soon-ink`. It is not clickable: it has the `disabled` attribute and no click handler, and a tap does nothing. It does not open play, and it does not open a blocked sheet. Step 3 wires it. Do not hide it, and do not wire it early. This is the exception named in roadmap rule 2 and in `shell-lessons.md` feedback #1, rule 2. No other control may be shown before it works: for example, Empty trash and deep links are not shown in this step.
2. **Document file names.** Every document file is named `<kind>_<ULID>.json` (Crockford ULID, 26 characters), for example `maps/map_01JDAM00000000000000000001.json`. Only `project.json` and `catalogue/slice.json` have fixed names. Never write `maps/map.json` or `stages/stage.json` (project-format §2, s1 §3).
   - The **Demo** template is a file-for-file copy of `fixtures/demo.tileproj/`, with the same file names and ids.
   - The **Empty** template is a valid minimal project with one blank stage. Its map and stage files get their own new ULIDs and ULID file names. It is not `map.json`.
   - Every new project gets a new `project.id` of the form `project_<ULID>`. Duplicate gets a new `project.id` and keeps the inner ids (Save rules 5).
3. **Versioned build file names.** Phones cache old files, so every file the built page loads has a stamped (versioned) path. `<out>/maker/index.html` is the only unstamped file. It loads everything else from `<out>/maker/<stamp>/`, where `<stamp>` is the first 12 hex characters of a sha256 over the sorted paths and sha256 sums of every file in that folder. `index.html` is written last, with the stamp filled in. The JS, `tokens.css` and the templates all live under that stamped folder, so a changed build always has a new path. Relative imports inside the folder stay unchanged. An unchanged build keeps the same stamp.
   - **Collision rule:** if `<out>/maker/<stamp>/` already exists with different file sums, the build refuses with a clear error instead of overwriting.
   - **Stale-folder cleanup:** after writing the new folder and `index.html`, the build deletes every other `<out>/maker/<stamp>/` folder, so `<out>` holds one build.
   - **No-cache shell:** `index.html` carries `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">`, `<meta http-equiv="Pragma" content="no-cache">` and `<meta http-equiv="Expires" content="0">`, because a static host such as gh-pages can't set headers.

## Build
| File | Job | Cap |
|---|---|---|
| `src/editor/project/home.ts` | Pure model: list entries from a store listing, new-from-template, rename, duplicate, delete-to-trash, restore (see Save rules), name check (1–40 code points, trimmed). Returns new docs plus report rows; no I/O. | 65 |
| `src/editor/project/save.ts` | Pure write plan: which files to write, in which order, `rev`/`updatedAt` bump, staleRev and readOnly refusal. | 40 |
| `tools/maker/store.ts` | OPFS store: `tileengine/projects/<projectId>/…`, trash `tileengine/projects/.deleted/<projectId>/`. Atomic write: `<name>.tmp`, then rename over the original. Reuse `opfsStore`; read through `tools/maker/project-files.ts`, then Step 1 `readProject`. | 30 |
| `tools/maker/project-files.ts` | new: the one place that turns a project folder's file text into `ProjectFiles` for `readProject`: list `tileengine/projects/<projectId>/` (read only), `JSON.parse` each `.json` file, and give a typed `unreadable` error naming the path for a file that isn't valid JSON. It must not import anything under `src/editor/`, because `tools/play-stage/build.ts` refuses any path containing `editor`. Maker file I/O stays on the maker side; the play stage never imports `tools/maker`. | 15 |
| `tools/maker/home.ts` | Home UI: cards (name, last edited, read-only badge), New, ⋯ menu (Rename, Duplicate, Delete), Undo toast, error banner, Trash link and list with Restore. | 60 |
| `tools/maker/project.ts` | Opened-project screen: top bar (Back, name, Save with unsaved dot), the greyed Test button (Rules 1), autosave. | 30 |
| `tools/maker/index.html` | Shell page. Loads `./<stamp>/…` (Rules 3). | 10 |
| `data/templates/demo.tileproj/` and `data/templates/empty.tileproj/` | Templates as `.tileproj` folders (Rules 2). **Both are data, not code.** Later templates (Ash Road) are added the same way. | data |
| `tools/maker/build.ts` | App build, same pattern as `tools/play-stage/build.ts` and reusing its exports (`toJs`, `release`, `sha`, `refuse`, and `build.json` with commit and file sums; refuses a dirty checkout). `node tools/maker/build.ts <out>` writes `<out>/maker/index.html` and `<out>/maker/<stamp>/` (JS, `tokens.css`, `templates/demo.tileproj/**`, `templates/empty.tileproj/**`, and a generated `templates/files.json` listing every template file path, because a static page can't list a folder). Export the build function so a later smoke can call it. | 25 |
| `tools/maker/tokens.css` | The token block from `docs/maker/style-spec.md` §1, written as CSS (see below). It's the only file allowed to hold colour literals, and like templates it isn't counted in the cap. | data |
| `tests/editor/project-home.test.ts` | Model, write-plan and corrupt-load tests. | 45 |
| `tests/tools/maker-build.test.ts` | Build into a temp folder: see Done when. | 15 |
| `tests/editor/maker-law.test.ts` | Plants (see Must NOT): scans `src/editor/project/**` and `tools/maker/**`. | 25 |
| `tools/play-stage/project.ts`, `load.ts`, `board.ts`, `match.ts` edits | QA carry A (below). | 15 |
| `tools/play-stage/build.ts` edit | QA carry B (below). | 5 |
| `tests/tools/play-stage-carries.test.ts` | new: the carry A and carry B tests. | 20 |

The caps sum to 400. They are plans. The hard gate is the run total of 400 changed lines or fewer. A file may go over its cap if the total stays within 400; the hand-back says which file and why.

**How to write `tokens.css`.** style-spec §1 is a table plus a list, not a CSS block. Write it like this:
- One `:root { … }` rule. It holds every token in the table with its **Light** value, plus every token in the "Also in the token block" list, plus `font: inherit` for controls as style-spec §2 says.
- One `html[data-theme="dark"] { … }` rule with every table token's **Dark** value.
- The same dark values inside `@media (prefers-color-scheme: dark) { html[data-appearance="system"] { … } }`, because style-spec says dark also follows the system setting when `data-appearance="system"`.
- The font stack from style-spec §2 goes on `body` in this file.
- **Explicit values (no combined cells).** Write each token on its own line. Light / Dark: `--danger` `#b42318` / `#ff8a7a`; `--danger-soft` `#fef3f2` / `#3a1c1a`; `--warn` `#93370d` / `#f5c26b`; `--warn-soft` `#fffaeb` / `#3a2e14`; `--warn-line` `#fedf89` / `#6b5420`; `--ok` `#1d6b3a` / `#7bd99a`; `--ok-soft` `#ecfdf3` / `#14301f`. The other table rows already have one token each.
- `maker-law.test.ts` checks that every token name and value in the table (with the combined cells split as above) **and** every token in style-spec's "Also in the token block" list (`--hero`, `--hero-ink`, `--scrim`, `--sheet-shadow`, `--danger-line`, `--soon-ink`, `--frame-bg`, `--frame-shadow`) is in `tokens.css`, value for value.

## QA carries (must do, with tests)
- **Carry A: no shared recipe map.** Today `playDocsOf` in `tools/play-stage/project.ts` writes fixture unit ids into the module-level `RECIPES` map from `tools/play-stage/load.ts` (`RECIPES[id] = hit`). So one load changes the next load. Fix: `playDocsOf` builds a new recipe map for each load (a copy of `RECIPES` plus that project's unit-id aliases) and returns it with the docs. `match.ts` and `board.ts` look units up in that per-load map, not in the module map. `RECIPES` is never written after module load; freeze it. **Test:** snapshot `RECIPES`, call `playDocsOf` on the demo and then on a second project whose units have other ids; `RECIPES` is deep-equal to the snapshot, and the second load's map has none of the first load's aliases.
- **Carry B: U+2028 and U+2029 in `.json.js`.** `build()` in `tools/play-stage/build.ts` writes each JSON file as `export default ` plus the raw text, without escaping U+2028 (line separator) or U+2029 (paragraph separator). Fix: replace each raw U+2028 with the six characters `\u2028` and each raw U+2029 with `\u2029` in the emitted text (in valid JSON they can only appear inside strings, so this is safe). Do not parse the JSON (plant P2 still bans `JSON.parse` in `tools/play-stage/*.ts`). Rejecting such a project with a typed visible error is also allowed, if the hand-back says so. **Test, either way:** build a temp root whose JSON has both characters inside a string. With escaping: the emitted `.json.js` has no raw U+2028 or U+2029, and importing it gives the original string. With rejecting: the build throws a typed error that names the file. The existing `tests/tools/play-stage.test.ts` check that `project.json.js` equals `export default ` plus the raw file still passes, because the fixture has neither character.

## Save rules (DSK, project-format §11.2 and §2)
1. **Order:** check `expectedRev` against the stored `project.json` `project.rev` first (`staleRev`: nothing written). Then write **all** files to `<name>.tmp` (changed docs, then `catalogue/slice.json`, then `project.json`). If any tmp write fails, delete the tmps, leave live files unchanged and return `writeFailed(path)`. Only then rename in the same order, `project.json` last: the commit point. (tmp+rename is DSK's rule; project-format r41 adds it to §11.2.)
2. **Rev:** each changed doc gets `rev+1` and `updatedAt=now`; unchanged docs are not touched. `project.rev` +1 exactly once per save, and project `updatedAt` is set.
3. **Refusals, before anything is written:** `staleRev` (expectedRev differs) and `readOnly` (file newer than the engine).
4. **Trash:** the whole folder moves to `tileengine/projects/.deleted/<projectId>/` and stays until the user empties trash (a later step). Restore moves it back; if that id exists again, it restores as a duplicate.
5. **Duplicate:** new `project.id`, `copiedFrom {projectId, rev, at}`, name + " copy" (" copy 2", …). Inner doc ids are kept (unique within a project; re-iding would break refs). Every file is copied.
6. **Errors:** a failed save always shows the user a typed error (`staleRev`, `readOnly`, or `writeFailed` with the path) and the old files stay intact.

## Behaviour (from MS-01)
- Home cards sorted by last edited. Empty state: one big **New project** card and "Your games live on this device."
- **New** asks one question (template: Demo or Empty), then a name (default "My game"). Names are 1–40 code points after trimming; an empty name shows "Give your game a name". Basic adds no other taps.
- **Delete** moves the whole folder to trash and shows "Deleted · Undo" for 6 s. No confirm dialog, because Undo exists.
- A **Trash** link sits at the bottom of the list only when trash isn't empty. It lists trashed projects, each with **Restore**.
- Autosave after every change and when the app is hidden (`visibilitychange`); Save button for peace of mind.
- A project newer than this build opens **read-only** with a banner; Save is disabled and says why.
- A project with hard report rows still opens; its card shows "Needs fixing (3)".
- While the list loads, show the text "Loading your games…" so the screen is never blank.
- **In scope now:** the list above, Trash with Restore, the 1–40 name rule. **Not in this step (not shown at all):** Empty trash, deep links (`#home`, `#project/<id>`, `#trash`), card skeletons, map thumbnails. They come in a later step with their own wiring.

## Must NOT
- **No other theme or visual system.** Use only the tokens, type, spacing, radii and components in `docs/maker/style-spec.md`: no template theme (no "dark paper"), no CSS framework, no web or icon fonts, no new colours. **Plant:** `maker-law.test.ts` fails on any hex, `rgb()`/`rgba()` or `hsl()` colour, `@import`, `@font-face` or `font-family` in `tools/maker/**` (CSS, HTML or TS) outside `tools/maker/tokens.css`. Other files use `var(--token)` only, and `font: inherit` comes from `tokens.css`. The test also checks that `tokens.css` matches the style-spec token table (combined cells split) and the "Also in the token block" list, value for value.
- **No new framework, starter template or app scaffold** (for example TanStack Start, a sandbox preview server, borrowed visual themes). Build only inside the repo's existing stack, files and test gates, starting from current main (the base above).
- No game rules, no rules data in code, no template content in `.ts` files. **Plant:** `maker-law.test.ts` fails if any scanned `.ts` file contains a `"kind": "tile-project"` / `"kind":"map"` style document literal or imports from `data/templates/` other than by folder path.
- **No `map.json`, `stage.json` or other non-ULID document name** in templates or in anything the store writes (Rules 2).
- **No empty `catch` and no silent default (Law 12).** **Plant:** `maker-law.test.ts` fails on any `catch {}`, `catch (e) {}`, a catch whose body only comments, or `?? {}` / `|| {}` applied to a load or save result. **Every failed save or load is shown to the user** in words (`writeFailed`: "Couldn't save maps/map_….json. Your phone may be full. Your last save is safe."; `staleRev`: "This project changed somewhere else. Reopen it to see the latest."; `readOnly`: "Made with a newer TileEngine. Open only.") and returned as a report row.
- Never overwrite a newer `rev` (staleRev refused). Never write a readOnly project. Never hard-delete; no Empty trash and no auto-purge of trash in this step. Never reuse an id.
- No working Test, no play launch and no blocked sheet (that is step 3). No other greyed or dead control (Rules 1).
- No editors, wizard, Sprite Studio or effects in this step. No ui-shell code copied. **Plant:** `maker-law.test.ts` fails if a scanned file imports from `ui-shell/` or contains shell-only identifiers (`ensureProjectV3`, `emptyManifest`, `StageLive`, `window.__set`).
- Don't touch the frozen kit copies under `handoff/steps/tests/`.
- No network, no new dependencies.

## Done when
- **Gates:** `npm ci && npm run green` exits 0 with the test count at **1036 + N** or more (N stated in the hand-back). That includes `scripts/check-law.sh` and `scripts/check-state.sh`. **Line count:** `git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css'` is 400 or fewer. Only `.json` files go under `data/templates/**`: `git diff --name-only <base>..HEAD -- data/templates | rg -v '\.json$'` returns nothing.
- **S0 touch smoke:** `TOUCH SMOKE PASS` at 390 and 360, pasted in § Smoke (see Delivery).
- **Model tests:** new → save → reload → `readProject` gives a deep-equal store with an empty report. Rename keeps every other file byte-equal. Duplicate gets a new `project.id`, `copiedFrom {projectId, rev, at}`, name "X copy" (then "X copy 2"), keeps inner doc ids, and copies every file including notes. Delete then restore is byte-equal; restoring while that id exists again restores as a duplicate. A stale write is refused and nothing is written. A failed write leaves every live file unchanged (leftover `.tmp` files aren't live); `project.json` is the last rename, the commit point. Only changed docs get `rev+1`; `project.rev` rises exactly once per save. A simulated write failure yields a visible error and a report row (no silent pass). A v7 project lists as read-only. **Corrupt load:** a project whose `project.json` is not valid JSON, or whose map file is truncated, shows a typed visible error on its card ("Can't open: …") and never opens as an empty or default project; the files on disk are unchanged.
- **File-name tests:** both templates load through `readProject` with an empty report. Every document path in both templates, and in a project made from each, matches `<kind>s/<kind>_<26 Crockford chars>.json` (or is `project.json` / `catalogue/slice.json`). The Demo template is byte-equal to `fixtures/demo.tileproj/`. Two new projects get two different `project_<ULID>` ids.
- **Greyed Test test:** the opened-project screen has a Test button that is visible, has the `disabled` attribute, uses `--soon`, and does nothing when tapped.
- **Build tests (`maker-build.test.ts`):** build into a temp folder. `maker/index.html` and `build.json` exist. `maker/index.html` is the only unstamped file under `maker/`; everything else is under `maker/<stamp>/`. Every script and stylesheet path in `index.html` and every relative import in the output points at a file that exists. **Stamp tests:** building the same input twice gives the same stamp; changing one asset (a source line or a template file) gives a new stamp; a pre-existing stamp folder with different sums makes the build refuse; an older stamp folder is gone after a rebuild; `index.html` has the three no-cache meta tags. Every template file is copied, and `templates/files.json` lists exactly those files. No `.ts` and no `// dev-only` line in the output. **Export audit (QA's full set):** no `dev.js`, no `\bDEV\b`, no `window.__`, no `sourceMappingURL` and no `.map` file, nothing from `ui-shell/`. **No storage:** with OPFS unavailable (`file://` or a refused origin), the app shows a typed visible error ("This browser can't save projects here. Open the app from its web address.") and never falls back to memory silently (Law 12).
- **Carry tests:** carry A and carry B as written above.
- **Plants:** all three `maker-law.test.ts` plants are proven by planting each pattern in a temp file and seeing the test fail.
- **Openable app page (CEO: a real app preview, not a perf page).** `node tools/maker/build.ts <out>` gives **`<out>/maker/index.html`**, a static page with no server code. Serve `<out>` on `127.0.0.1` with a static file server that adds no dependency (for example `python3 -m http.server 8800 --directory <out>`), because OPFS needs a `localhost` origin, and open `http://127.0.0.1:8800/maker/` at **390 px** in a phone-size browser. It shows Home; New (Demo) makes a project card, and reopening the page lists it. The hand-back names the build command and the output tree (`<out>/maker/index.html`, `<out>/maker/<stamp>/…`).
- **Look matches the shots at 390 px.** Each screen this step builds matches its reference in `docs/maker/shots/` (`01-home.png` for Home's top bar, cards and buttons; `24-project-settings.png` for the opened-project screen; `18-undo-toast.png` for the Undo toast) in colours, type, spacing, radii and components, per `docs/maker/style-spec.md`. Content follows the MS spec where the prototype screen differs, for example a project list instead of the old Home buttons. Every target is 48 px or more, with AA contrast.
- **Screenshots:** HANDBACK.md § Screenshots attaches one 390×844 screenshot per screen, in light theme: Home with one project, Home empty state, the opened-project screen (with the greyed Test), the Undo toast, and Trash. QA compares them side by side with the shots.
- **Not the builder's gate:** the phone check (S21 Ultra and Red Magic 9 Pro: every target 48 px or more; create, kill the app, reopen, and the project is identical) is a CoS / CEO pass after the hand-back. Do not hold the hand-back for it. After merge, CoS may publish `<out>` to gh-pages under `app/` (so the page is `app/maker/`) only with the CEO's OK.

## Prototype lessons
- ui-shell `app.js` (6,373 lines) mixed model, rendering and UI; that is what made the one-prompt builds drift. It is a record of behaviour only. Never copy it.
- Copy the Effect Designer split: pure model in `src/editor/<area>/`, thin store, UI in `tools/<tool>/`. Notices, not exceptions.
- `tools/effect-designer/store.ts` `purgeTrash` has a `catch` that skips failures quietly. Don't repeat that pattern: report each failure.
