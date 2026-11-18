# Step 2: Home, save and load

r3, 2026-11-18, Editor & UX Designer (QA review `docs/qa/maker-steps-01-03-review.md` and DSK line edits applied). Needs Step 1 merged. Save-file rules are **owned by Data & Save Keeper** (project-format §11.2 and §2; DSK answers 2026-11-18, in **Save rules** below). One builder run, 400 lines or fewer including tests, gates on.

## Goal
The first real maker screen. A phone-first Home lists the user's projects. The user can make a new project from a template, open, rename, duplicate and delete one, and every change is saved as a project folder (the Step 1 layout) on the device. Reopening the app shows exactly what was saved. No editors yet: an opened project shows its name, stage count and a **Test** button (wired in Step 3).

## Read first
1. `docs/maker/maker-spec/MS-01-home-and-projects.md` (UX spec for this screen).
2. `docs/maker/data/s1-project-load.md` §3 (folder layout), §6 (reader), §7 (versions) and `docs/maker/data/project-format.md` §2, §3.1, §16.
3. `docs/maker/ux/screen-map.md` (row `home`, deep links) and `docs/maker/ux/design-notes/shell-and-look.md` (r62 look: colours, type, 48 px targets).
4. Screenshots: `docs/maker/shots/01-home.png`, `24-project-settings.png`, `18-undo-toast.png` (look and behaviour reference).
5. Code to copy the shape of: `src/editor/effect/save.ts` (`Store`, stale-rev refusal), `tools/effect-designer/store.ts` (`opfsStore`), `tools/effect-designer/page.ts`.
6. `docs/maker/style-spec.md` (the only visual system: tokens, type, spacing, radii, buttons, cards, sheets, pills, 390 px rules).

## Build
| File | Job | Cap |
|---|---|---|
| `src/editor/project/home.ts` | Pure model: list entries from a store listing, new-from-template, rename, duplicate, delete-to-trash, restore (see Save rules). Returns new docs plus report rows; no I/O. | 75 |
| `src/editor/project/save.ts` | Pure write plan: which files to write, in which order, `rev`/`updatedAt` bump, staleRev and readOnly refusal. | 50 |
| `tools/maker/store.ts` | OPFS store: `tileengine/projects/<projectId>/…`, trash `tileengine/projects/.deleted/<projectId>/`. Atomic write: `<name>.tmp`, then rename over the original. Reuse `opfsStore`; read through Step 1 `readProject`. | 40 |
| `tools/maker/home.ts` | Home UI: cards (name, last edited, read-only badge), New, ⋯ menu (Rename, Duplicate, Delete), Undo toast, error banner. | 70 |
| `tools/maker/project.ts` | Opened-project screen: top bar (Back, name, Save with unsaved dot, Test placeholder), autosave. | 30 |
| `tools/maker/index.html` | Shell page; r62 tokens. | 10 |
| `data/templates/demo.tileproj/` and `data/templates/empty.tileproj/` | Templates as `.tileproj` folders: Demo = copy of the Step 1 fixture; Empty = a valid minimal project (one blank stage). **Both are data, not code.** Later templates (Ash Road) are added the same way. | data |
| `tools/maker/build.ts` | App build, same pattern as `tools/play-stage/build.ts` and reusing its exports (`toJs`, `release`, `build.json` with commit and file sums; refuses a dirty checkout). `node tools/maker/build.ts <out>` writes `<out>/maker/index.html` plus its JS and copies `data/templates/**` to `<out>/data/templates/`. | 25 |
| `tests/editor/project-home.test.ts` | Model, write-plan and corrupt-load tests. | 55 |
| `tests/tools/maker-build.test.ts` | Build into a temp folder: `maker/index.html` and `build.json` exist, every template file is copied, no `.ts` and no `// dev-only` line in the output. **Export audit (QA's full set):** no `dev.js`, no `\bDEV\b`, no `window.__`, no `sourceMappingURL` and no `.map` file, nothing from `ui-shell/`. **No storage:** with OPFS unavailable (`file://` or a refused origin), the app shows a typed visible error ("This browser can't save projects here. Open the app from its web address.") and never falls back to memory silently (Law 12). | 15 |
| `tools/maker/tokens.css` | The `:root` and dark token block copied **verbatim** from `docs/maker/style-spec.md` §1. It's the only file allowed to hold colour literals, and like templates it isn't counted in the cap. | data |
| `tests/editor/maker-law.test.ts` | Plants (see Must NOT): scans `src/editor/project/**` and `tools/maker/**`. | 30 |

## Save rules (DSK, project-format §11.2 and §2)
1. **Order:** check `expectedRev` against the stored `project.json` `project.rev` first (`staleRev`: nothing written). Then write **all** files to `<name>.tmp` (changed docs, then `catalogue/slice.json`, then `project.json`). If any tmp write fails, delete the tmps, leave live files unchanged and return `writeFailed(path)`. Only then rename in the same order, `project.json` last: the commit point. (tmp+rename is DSK's rule; project-format r41 adds it to §11.2.)
2. **Rev:** each changed doc gets `rev+1` and `updatedAt=now`; unchanged docs are not touched. `project.rev` +1 exactly once per save, and project `updatedAt` is set.
3. **Refusals, before anything is written:** `staleRev` (expectedRev differs) and `readOnly` (file newer than the engine).
4. **Trash:** the whole folder moves to `tileengine/projects/.deleted/<projectId>/` and stays until the user empties trash. Restore moves it back; if that id exists again, it restores as a duplicate.
5. **Duplicate:** new `project.id`, `copiedFrom {projectId, rev, at}`, name + " copy" (" copy 2", …). Inner doc ids are kept (unique within a project; re-iding would break refs). Every file is copied.
6. **Errors:** a failed save always shows the user a typed error (`staleRev`, `readOnly`, or `writeFailed` with the path) and the old files stay intact.

## Behaviour (from MS-01)
- Home cards sorted by last edited. Empty state: one big **New project** card.
- **New** asks one question (template: Demo or Empty), then a name (default "My game"). Basic adds no other taps.
- **Delete** moves the whole folder to trash and shows "Deleted · Undo" for 6 s. No confirm dialog, because Undo exists.
- Autosave after every change and when the app is hidden (`visibilitychange`); Save button for peace of mind.
- A project newer than this build opens **read-only** with a banner; Save is disabled and says why.
- A project with hard report rows still opens; its card shows "Needs fixing (3)".

## Must NOT
- **No other theme or visual system.** Use only the tokens, type, spacing, radii and components in `docs/maker/style-spec.md`: no template theme (no "dark paper"), no CSS framework, no web or icon fonts, no new colours. **Plant:** `maker-law.test.ts` fails on any hex, `rgb()`/`rgba()` or `hsl()` colour, `@import`, `@font-face` or `font-family` in `tools/maker/**` (CSS, HTML or TS) outside `tools/maker/tokens.css`. Other files use `var(--token)` only, and `font: inherit` comes from `tokens.css`. The test also checks that `tokens.css` matches the style-spec token table value for value.
- **No new framework, starter template or app scaffold** (for example TanStack Start, a sandbox preview server, borrowed visual themes). Build only inside the repo's existing stack, files and test gates, starting from current main.
- No game rules, no rules data in code, no template content in `.ts` files. **Plant:** `maker-law.test.ts` fails if any scanned `.ts` file contains a `"kind": "tile-project"` / `"kind":"map"` style document literal or imports from `data/templates/` other than by folder path.
- **No empty `catch` and no silent default (Law 12).** **Plant:** `maker-law.test.ts` fails on any `catch {}`, `catch (e) {}`, a catch whose body only comments, or `?? {}` / `|| {}` applied to a load or save result. **Every failed save or load is shown to the user** in words (`writeFailed`: "Couldn't save maps/map_….json. Your phone may be full. Your last save is safe."; `staleRev`: "This project changed somewhere else. Reopen it to see the latest."; `readOnly`: "Made with a newer TileEngine. Open only.") and returned as a report row.
- Never overwrite a newer `rev` (staleRev refused). Never write a readOnly project. Never hard-delete; no auto-purge of trash in this step. Never reuse an id.
- No editors, wizard, Sprite Studio or effects in this step. No ui-shell code copied. **Plant:** `maker-law.test.ts` fails if a scanned file imports from `ui-shell/` or contains shell-only identifiers (`ensureProjectV3`, `emptyManifest`, `StageLive`, `window.__set`).
- No network, no new dependencies.

## Done when
- **Look matches the shots at 390 px.** Each screen this step builds matches its reference in `docs/maker/shots/` (`01-home.png` for Home's top bar, cards and buttons; `24-project-settings.png` for the opened-project screen; `18-undo-toast.png` for the Undo toast) in colours, type, spacing, radii and components, per `docs/maker/style-spec.md`. Content follows the MS spec where the prototype screen differs, for example a project list instead of the old Home buttons. The handback attaches one 390×844 screenshot per screen, in light theme, for QA to compare side by side.
- **Gates:** `npm test` passes with the test count at **floor = Step 1's merged floor + N** (main today is 1014; N = tests added in this run, stated in the handback), plus `scripts/check-law.sh` and `scripts/check-state.sh`. **Line count:** `git diff --shortstat <run base> -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css'` is 400 or fewer.
- Tests: new → save → reload → `readProject` gives a deep-equal store with an empty report. Rename keeps every other file byte-equal. Duplicate gets a new `project.id`, `copiedFrom {projectId, rev, at}`, name "X copy" (then "X copy 2"), keeps inner doc ids, and copies every file including notes. Delete then restore is byte-equal; restoring while that id exists again restores as a duplicate. A stale write is refused and nothing is written. A failed write leaves every live file unchanged (leftover `.tmp` files aren't live); `project.json` is the last rename, the commit point. Only changed docs get `rev+1`; `project.rev` rises exactly once per save. A simulated write failure yields a visible error and a report row (no silent pass). A v7 project lists as read-only. **Corrupt load:** a project whose `project.json` is not valid JSON, or whose map file is truncated, shows a typed visible error on its card ("Can't open: …") and never opens as an empty or default project; the files on disk are unchanged. All three plants are proven by planting each pattern in a temp file and seeing the test fail.
- **Openable app page (CEO: a real app preview, not a perf page).** The run ships the maker app built by the repo's web build: `node tools/maker/build.ts <out>` gives **`<out>/maker/index.html`**, a static page with no server code. Opened in a phone-size browser at **390 px** (served over `localhost`, which OPFS needs), it shows Home; New (Demo) makes a project card, and reopening the page lists it. The handback names the build command, the output tree and a 390 px screenshot of Home with one project. After merge, CoS may publish `<out>` to gh-pages under `app/` (so the page is `app/maker/`) only with the CEO's OK.
- Phone check (S21 Ultra and Red Magic 9 Pro): every target 48 px or more; create, kill the app, reopen, and the project is identical.

## Prototype lessons
- ui-shell `app.js` (6,373 lines) mixed model, rendering and UI; that is what made the one-prompt builds drift. It is a record of behaviour only. Never copy it.
- Copy the Effect Designer split: pure model in `src/editor/<area>/`, thin store, UI in `tools/<tool>/`. Notices, not exceptions.
- `tools/effect-designer/store.ts` `purgeTrash` has a `catch` that skips failures quietly. Don't repeat that pattern: report each failure.
