# Step 11a2: Build game's ready and error sheets (UX's "Your game is ready" and "Couldn't build your game")

r4, 2026-11-26, Engine Architect (roadmap step 11, second slice; split out of 11a by the EA ruling below). r3 re-trials r2 on the **merged 11a** (ChatA's own code, PR #107), after QA's paste check (`docs/qa/step-11a2-paste-review.md`, sha256 `c6734a3cb35a9b6c…`) found r2's trial patch didn't apply there. Behaviour is r2's (QA's r1 must-fix and carries included); code names, caps, count and line cites are now from the real code, and three of QA's 11a carries in `tools/export/game.ts` are folded in. **r4** fixes QA's r3 must-fix (`docs/qa/step-11a2-r3-guide-review.md`, sha256 `f83b43ac309b4450…`): Build game and Try again now close the open sheet (`built = null;`) before the busy paint, so Try again can't be double-tapped into two downloads during a rebuild; smoke 2 pins it; and `esc` uses a literal `"&"` (QA nit). The changes from r3 and r2 are listed at the end. One builder run (ChatA) and one QA review, with gates on. Every number below comes from a trial run (see Measured). Rulings from the CoS chat are labelled **EA ruling**, DSK's **DSK to EA**, UX's **UX to EA**, QA's **QA ruling**; the only CEO ruling quoted is the one marked CEO.

> **EA ruling (2026-11-26): the 400 gate holds; the UX sheet moves to 11a2.** The 400 gate is a standing rule (18 Nov direction), with no one-off. Step 11 merges as three slices: **11a** (export core; merged), **11a2** (this guide: the sheets), then **11b** (the debug APK, `step-11b-debug-apk.md`). This slice replaces 11a's interim (a build error's plain reason in the project banner) with UX's sheets.

Step id: `step-11a2-ready-sheet`. Guide revision r4 (r1 NOT OK TO SEND; r2's trial was on the EA's 11a trial code, not the merge; r3 NOT OK TO SEND, one must-fix); the build is r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main **`1b34e5418efe65b8a1ffb09c29cd58b175ef1819`** (`docs(qa): step 11a handback review`), docs-only on the **11a merge `7d73c74b77f6d87d70d6ded32c9ba02dd7f7e922`** (PR #107, tree `522d02cca2cfc0c5d1a392545897df0356ae7b8c`). Green on the base: **1165 pass, 0 fail**. (Main has since moved to `0d8060a3`, docs-only on `1b34e541`; the trial patch applies on `7d73c74b`, `1b34e541` and `0d8060a3`.)
**Authority:** **UX to EA, 2026-11-26** (carried in roadmap r15c L86's UX cell at `90c9cb9f`, sha256 `5f0e95ba6fc9ea8eb3ff140934e4dcc676f1497ad2c00b4fc0088798b4032cf0`): after the download, a bottom sheet titled **Your game is ready**, body "Saved to Downloads as <file>. This is a web build: put it on any website host that takes HTML games, and anyone can play it in a browser. A phone app version comes in a later update."; buttons **Share** (`navigator.share` with the zip file, shown only when `canShare({files})` is true, otherwise hidden) and **Done**; on an error the sheet says **Couldn't build your game** with the plain reason and a **Try again** button; never tell users to unzip and open `index.html` (type=module scripts fail from `file://`); reuse the existing sheet, button and spinner patterns, no new CSS if possible. **CEO ruling 2026-11-24 18:03 London (relayed by CoS), quoted as typed:** "Since step 11 is an export section. Can add the apk stuff there top [sic: too]" (the step 11 scope this slice sits in). DSK rulings doc `handoff/dsk-rulings/2026-11-26-step11.md` (sha256 `b73763e657c283fbfda23eb6017edfbb3a845d0e4f0f301c6590ddba3b0799df`) E5(d): a private test build, nothing public without CEO SEND. QA's 11a handback review (`docs/qa/step-11a-handback-review.md` on `1b34e541`): carries 1 and 2 (Rule 4), the dense-lines note (Rule 5) and the zip.ts ruling (Rule 5).
**Test floor:** **1165 + 2 = 1167** (named tests 1–2, one new file).
**Needs:** 11a (merged, `7d73c74b`). **Blocks:** 11b (it bases on the 11a2 merge).
**Smoke:** new **s11a2**, port **8822**, `r1` (6 ok: 3 steps across 390 and 360). Free on the base (8818/8819 are s11a, 8820/8821 are 11b's s11b). Counted in the 400. Smokes after 11a2: **23**.

## Where 11a2 sits
- **On the base**, Build game saves, runs Test's gate, shows **Building…** with the spinner and downloads `<projectId>-game.zip`; a build error shows its plain reason in the project banner (11a's interim, `home.ts` L178).
- **11a2** opens UX's **Your game is ready** sheet after the download (Share only where the browser can share files; Done), and turns a build error into the **Couldn't build your game** sheet with the plain reason and **Try again**. A refusal (Test's gate) still shows Test's own sheet, unchanged.
- **11b** (the APK) follows on the 11a2 merge (11b r3 is re-trialled on this guide's r4 trial).

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-11a2-ready-sheet-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-11a2-ready-sheet/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green (test counts), § Smoke (all 23 smokes and the mutations) and § Export audit (Done when). Label the **Code head** apart from the docs-only **tip**, and give both shas; quote the tip sha and the test counts. Don't commit a raw test log, a smoke shot or a zip.
- **§ Helpers & self-review lists EVERY helper agent, script and one-off command file used** (QA carry from 10c), one line each: what it was asked to do and what it found or changed (the audit script you write for Done when goes here). "None" if none.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN` (not in chat, logs or files), and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no branch delete, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS (DSK E5(d)).

## Goal
In plain words:
- **Ready.** After the download, a bottom sheet **Your game is ready** says, in UX's exact words, where the zip went and what it is. **Share** appears only when the browser can share that file (`navigator.canShare({ files })` is true) and hands it to `navigator.share`. If the user dismisses the share (`AbortError`), nothing changes; any other refusal (`NotAllowedError`, `DataError`, …) opens **Couldn't build your game** with its plain reason. **Done** closes the sheet and lets go of the zip.
- **Error.** A build that fails (a missing play file, a missing picture, a bad `build.json`) opens **Couldn't build your game** with the plain reason, **Try again** (which runs Build game again) and Done.
- **Never** "unzip" or "index.html" in any of it.
- **Tidy 11a's export module** (QA carries): one source for the module path, no dead defaults. What the zip holds doesn't change.

**Not in 11a2:** any change to what the zip holds, the gate, the save-stop or the play boot (11a); the APK (11b); "Game name" and "Icon" (UX, after 11b); budgets and the phone-like Test (11c).

## Read first (lines checked on the base `1b34e541`)
1. `tools/maker/build-sheet.ts` L1–5: `export type BuildView = "idle" | "busy";` and `buildButton(view)` (busy: disabled, `aria-busy`, `.spin`, `Building…`).
2. `tools/maker/home.ts`: L6 (the `build-sheet` import), L29 (the top `let` line, which declares `building: BuildView = "idle"`), L33 (`go`: every act runs in turn through one promise chain, so no act runs while Build game is busy), L47 (the project screen; its sheets string ends `effectsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast);`), L54 (`openId`), L161 (`if (act.startsWith("open:")) return openId(act.slice(5));`), L162 (the act line with `if (act === "build") return buildNow();`), L164–167 (`download(name, bytes)`: makes the `File`, clicks an object-URL anchor, revokes it), L168–180 (`buildNow`: save-stop, `building = "busy"`, `buildGame`, refusal → `state.problems`, `download(`${id}-game.zip`, got.bytes)`, and L178 `} catch (e) { state.banner = e instanceof Error ? e.message : "Can't build"; }`).
3. `tests/tools/export-11a.test.ts` L61 (test 3's name, ending "…throws Can't build, shown as the plain reason in the banner (interim until 11a2); playBase …") and L103 (its source pins: the save-stop regex `&&` `/state\.banner = e instanceof Error \? e\.message : "Can't build"/`).
4. `tools/export/game.ts`: L4 (`filesModule`, with `text[path] ?? ""`), L7 and L18 (the module path `"project/files.js"` written twice), L11 (`play["build.json"] ?? ""`), L20–24 (`names`, then `files.get(name) ?? new Uint8Array()` at L22 and L24); `tools/play-stage/game.ts` L2 (`export const FILES = "project/files.js";`, exported, unused).
5. The scrim/sheet pattern: `<div class="scrim"><div class="sheet" role="dialog">` (e.g. `tools/maker/rooms.ts` L68); `.btn`, `.btn.ghost` (`tools/maker/app.css` L13–14).

## Rules
1. **Sheets (`tools/maker/build-sheet.ts`, appended; `BuildView` and `buildButton` unchanged).** `export type BuildSheet = { mode: "ready"; file; share } | { mode: "error"; reason } | null` (readonly fields). A local `esc` (the five HTML characters, written as literal strings such as `"&amp;"`) and `sheet(title, body, buttons)`: `<div class="scrim" data-sheet="build"><div class="sheet" role="dialog"><h2>title</h2><p>body</p>buttons + Done (data-act="build:done", btn ghost)</div></div>`. `buildSheet(view)`: `null` → `""`; **ready**: title `Your game is ready`, body exactly "Saved to Downloads as <file>. This is a web build: put it on any website host that takes HTML games, and anyone can play it in a browser. A phone app version comes in a later update." (file escaped), **Share** (`<button class="btn" data-act="build:share">`) only when `share` is true; **error**: title `Couldn't build your game`, the reason escaped, **Try again** (`data-act="build"`).
2. **Wiring (`tools/maker/home.ts`).** Keep `building` (the button) as is. Import `buildSheet` and `type BuildSheet`; append `+ buildSheet(built)` inside the sheets string on L47. New module lets on their own lines: `let built: BuildSheet = null;` and `let builtFile: File | null = null;`. `download` takes the `File` (`download(file: File)`: the object URL, anchor and revoke as on the base). In `buildNow`: **`built = null;` on its own line just before 11a's `building = "busy"; state.problems = []; paint();`** (QA r3 must-fix: the open sheet closes and Building… shows, so neither Try again nor Done can be queued during a rebuild); replace `download(`${id}-game.zip`, got.bytes);` with `builtFile = new File([got.bytes as BlobPart], `${id}-game.zip`, { type: "application/zip" });`, `download(builtFile);`, `built = { mode: "ready", file: builtFile.name, share: navigator.canShare?.({ files: [builtFile] }) === true };` (one per line), and L178's catch body becomes `built = { mode: "error", reason: e instanceof Error ? e.message : "Can't build" };` (**replacing 11a's `state.banner` line**). `shareBuild()`: `await navigator.share({ files: [builtFile], title: builtFile.name })` in `try`; in the `catch`, **an `AbortError` (the user dismissed the share) returns with nothing shown; any other rejection sets `built = { mode: "error", reason }`** (the error's message, or "Couldn't share your game." when it has none) and paints (QA must-fix, Law 12: no empty catch). `forgetBuild()` sets `built = null` and `builtFile = null` (Law 13); `closeBuild()` calls it and paints. In `run`, three new lines just before L161: `if (act.startsWith("open:")) forgetBuild();`, `if (act === "build:share") return shareBuild();`, `if (act === "build:done") return closeBuild();` (Try again is the existing `build` act).
3. **11a's banner pin (`tests/tools/export-11a.test.ts`, L61 and L103 only).** In L103, the second regex becomes `/built = \{ mode: "error", reason: e instanceof Error \? e\.message : "Can't build" \}/`; in L61's name, "shown as the plain reason in the banner (interim until 11a2)" becomes "shown as the plain reason in the error sheet (11a2)". No other edit to that file.
4. **QA's 11a carries 1–2 (`tools/export/game.ts`; QA handback review, "fold into the next kit that touches tools/export/game.ts").** Import `FILES` from `../play-stage/game.ts` and use it in `markPage` (`data-game="${FILES}"`) and `gameZip` (`files.set(FILES, …)`), so the path has one source and `FILES` is used. Remove the dead defaults: `filesModule` maps `Object.entries(text)` (filter `shipped(path)`, sort by path with `a < b ? -1 : 1`, the same order as `.sort()`) so it needs no `text[path] ?? ""`; L11 becomes `const raw = play["build.json"];` plus `if (raw === undefined) throw new Error("Can't build: build.json");` (the same throw L14 gives); L20–24 sort `[...files.entries()]` once (`sorted`) and use its `[name, data]` pairs, so no `files.get(name) ?? new Uint8Array()`. The zip's bytes and order are unchanged (11a's tests 1–4 and s11a hold).
5. **Layers and style.** No CSS (the sheet, buttons and 11a's `.spin` are reused). Nothing in `src/`, `tools/play-stage`, `tools/maker/export.ts` or `tools/export/zip.ts`. **One statement per line in all new code (src/, tools/ and tests/), including new code in dense files such as `home.ts`: new functions, lets and act lines each get their own lines; never pack a new function, statement or act onto an existing line.** The only edits inside existing dense lines are the ones Rules 2–3 name (L47's sheets string, L178's catch body, L103's regex, L61's name). New smokes keep the s10c smoke layout. (QA ruling on 11a, carried here: zip.ts L7's comma join was accepted once and is no precedent; any join or pack to fit a cap is NOT OK.)

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `tools/maker/build-sheet.ts` | `BuildSheet`, `esc`, `sheet`, `buildSheet` (Rule 1) | 14 [9] |
| `tools/maker/home.ts` | import, `buildSheet(built)` on L47, `built`/`builtFile`, `download(file)`, `built = null` and ready/error in `buildNow`, `shareBuild`, `forgetBuild`, `closeBuild`, three act lines (Rule 2) | 40 [34+ 6−] |
| `tools/export/game.ts` | `FILES` import and uses, the dead defaults removed (Rule 4) | 20 [9+ 7−] |
| `tests/tools/export-11a.test.ts` | L61's name and L103's regex (Rule 3) | 4 [2+ 2−] |
| `tests/tools/sheet-11a2.test.ts` | new, named tests 1–2 (one statement per line) | 20 [16] |
| `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs` | new smoke (port 8822) | 60 [57] |
| **Total** | caps sum to 158 | **400 [142]** |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules'` (added + removed). Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Named tests (`tests/tools/sheet-11a2.test.ts`)
1. `11a2 ready sheet: names the file, says it is a web build in UX's words, shows Share only when the zip can be shared, and Done; never says unzip or index.html; no build, no sheet` (the full title and body string; no `build:share` when `share` is false, Share when true; `buildSheet(null)` is `""`).
2. `11a2 error sheet: Couldn't build your game with the plain reason, escaped, and Try again` (`Can't build: <build.json>` renders as `Can&#39;t build: &lt;build.json&gt;`; no unzip or `index.html`).
11a's test 3 keeps pinning that a throw reaches the user, now as the error sheet (Rule 3); 11a's tests 1–4 cover Rule 4 unchanged.

## Smoke (`handoff/steps/tests/s11a2-ready-sheet/smoke.mjs`, port 8822, r1)
Dev maker build on 8822. Touch, at 390 and 360. Steps: **1** a new demo project, `navigator.canShare` stubbed false, tap **Build game**: a download named `<projectId>-game.zip` arrives and the **Your game is ready** sheet says "Saved to Downloads as <projectId>-game.zip. This is a web build", never unzip or `index.html`, with no Share; **Done** closes it. **2** `canShare`/`share` stubbed true, the play tree's `build.json` routed to a 404: **Couldn't build your game** with "Can't build: build.json"; then `build.json` served after a 1.5 s delay: right after **Try again**, the build sheet is gone and the disabled **Building…** button shows (within 1 s; this fails if `built = null;` is removed), then the download arrives; **Share** hands `share()` the zip by name, and **Done** closes the sheet. **3** `canShare` stubbed true and `share` rejecting with `new DOMException("dismissed", "AbortError")`: Build game, **Share**; once `share` has been called, the sheet is still **Your game is ready** and no error shows; then `share` rejecting with `new DOMException("Sharing was blocked", "NotAllowedError")`: **Share** opens **Couldn't build your game** with "Sharing was blocked"; **Done** closes it. 6 ok.
Then run every smoke solo, unedited (**23**): the 22 in the 11a guide (S0 8797 … s10d 8817, **s11a 8818 r1 (6)**) and **s11a2 8822 r1 (6)**. All print SMOKE PASS. Restore tracked files after each run (`git checkout -- handback` and remove untracked shots). If s3 step 9 or s8c steps 1–3 miss (known flakes), re-run that smoke solo once and record both runs.

## Must NOT
- No edits outside the Build table; in `tests/tools/export-11a.test.ts`, only Rule 3's two lines. Nothing in `src/`, `tools/play-stage`, `tools/maker/export.ts`, `tools/export/zip.ts`, `tools/maker/app.css`, `tools/apk`, data, fixtures or the format docs. No edit to any other test or smoke.
- No change to what Build game zips (bytes and order), the gate, the save-stop (`if (state.dirty) return;` stays), `building` or the download name.
- No text telling users to unzip the zip or open `index.html`; no wording beyond UX's (title, body, Share, Done, Couldn't build your game, Try again) and EA ruling 5's fallback. No Share when `canShare({ files })` isn't true. No empty catch: only an `AbortError` from `share` is ignored (Law 12).
- No packing: no new statement, function or act joined onto an existing line (Rule 5).
- No new CSS, sheet component or toast; no dependency; no network URL.
- Never push main, a tag or gh-pages; no force-push; no branch or tag delete; no PR actions. The builder never publishes gh-pages. `GH_BUILDER_TOKEN` never in chat, logs, files or `.git/config`.

## Done when
- Green exits 0 at the floor (**1167**). `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101; maker `home.ts` ×2 at L91, unmoved).
- All 23 smokes PASS with the counts above.
- **Export audit, self-run from the repo** (write it as a `/tmp` script and list it in § Helpers): build three trees with the repo's own builders, each into a fresh temp dir with commit `"0".repeat(40)`: `tools/play-stage/build.ts` `build(out, commit, root, false)` (release play stage; all files), `tools/baseline/build.ts` `build(out, commit, root)` (all files), and `tools/maker/build.ts` `build(out, commit, root, false)` (only paths that start with `play/` or contain `play-stage`). Walk each tree: no file name matching `/tools\/maker|src\/editor|catalogue\.json\.js$|behaviours\.json/` and no file content matching `/tools\/maker|src\/editor|tileengine\/saves|session-save/`. Expect **0 hits** and file counts **135 / 149 / 149** (as on the base; 11a2 adds no play file). Record the counts in § Export audit.
- HANDBACK § Smoke records the mutations below; § Helpers lists every helper and script.

## Measured (trial runs, 2026-11-26, fresh `/tmp` clone of GitHub main with `npm ci`, never pushed)
- **Base** `1b34e541` (fresh clone, `npm ci`): green **1165 pass, 0 fail**; `git diff --stat 7d73c74b 1b34e541` is docs only; `7d73c74b^{tree}` = `522d02cc…`.
- **Trial r4** (commit `8c061ebd57561c23a4ceec6c50b2fac0edb0a13e`, on `1b34e541`; r3 was `5b9d5038`): green **1167 pass, 0 fail**; tsc: only the 3 base errors. Count **142** (127+ 15−): smoke 57, sheet test 16, `home.ts` 34+ 6−, `build-sheet.ts` 9, `tools/export/game.ts` 9+ 7−, `export-11a.test.ts` 2+ 2−.
- **s11a2 solo on r4:** 6 ok, PASS, three runs in a row.
- **Smokes, all solo, PASS** (r4 with the 11b r3 trial on top, commit `eaa35359`; 11b touches no 11a2 file): S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8, s11a 6, **s11a2 6** (and s11b 6); no flake re-runs. (r3's own 23-smoke run on `5b9d5038` also passed with the same counts.)
- **Export audit** (the Done when spec): 135 / 149 / 149 files, 0 hits, PASS.
- **Mutations** (one at a time on the r4 trial; tests + s11a2 smoke, s11a smoke for `game.ts`), record the same in § Smoke:
  - M16 Share always shown: caught (test 1, smoke 1–3). M17 error sheet without Try again: caught (test 2, smoke 2). M20 ready sheet never opens: caught (smoke 1–3). M21 error sheet never opens: caught (11a test 3, smoke 2–3). M22 `share()` handed no file: caught (smoke 2–3). M23 ready text says unzip: caught (test 1, smoke).
  - M24 a dismissed share (`AbortError`) opens the error sheet: caught (smoke 3). M25 a refused share swallowed: caught (smoke 3).
  - **M31 `built = null;` removed from `buildNow`** (the old sheet stays up, Try again live during the rebuild): caught by smoke 2 (the 1 s check after Try again), 3 runs of 3.
  - M26 `forgetBuild` keeps the zip and M27 opening a project keeps the build: **survive, by design** (EA ruling 6; QA accepted in its r3 review).
  - M28 `markPage` names another module: caught (11a gameZip, s11a 2–3). M29 the module zipped under another name: caught (11a tests, s11a 1–3). M30 a missing `build.json` read as `""` again: survives, equivalent (QA accepted: the commit regex then fails and the same `Can't build: build.json` throws).
- **Trial patch** `s11a2-trial-r4.patch` (246 lines) passes `git apply --check` on `7d73c74b`, `1b34e541` and `0d8060a3`.
- **11b r3** (`s11b-trial-r3.patch`) applies on this r4 trial and is green there (1170 / 0); see the 11b guide.
- Helpers used: `allsmoke-11b.sh` (the smokes solo, 11b on top), `allsmoke-11a2.sh` (r3's 23 smokes), `mutate-r4.sh` (mutations, M31 added), `self-audit.mjs` (the audit, per the Done when spec).

## Baseline republish
- 11a2 changes the published maker (the sheets). **No publish is part of this step.** Any republish needs the CEO's own typed OK in QA's chat naming the commit; CoS verifies it there (the builder never publishes or pushes gh-pages). QA's post-publish walk runs **headless, at device scale 1** (360 and 390 wide). **Only the CEO's phones are real devices** (real Share sheets can only be seen there; QA 11a carry 3: include one real download in Chrome on Android).

## Carries
**Closed here:** the UX ruling's ready and error sheets (11a's banner interim retired); QA 11a2 r1 must-fix (no empty catch on Share, Law 12) and carries (`builtFile` let go on Done, Law 13; `built` and `builtFile` forgotten when a project opens); QA 11a handback carries 1 (`FILES` one source, used) and 2 (`?? ""` and `?? new Uint8Array()` dead defaults gone, `text[path] ?? ""` included); QA's dense-lines note (Rule 5 wording).
**Still open, not 11a2 scope:**
- **UX, after 11b:** "Game name" and "Icon" in project settings.
- **UX, before the 11c guide:** the 11c overlay look (budgets and the frame-time overlay).
- **QA 11a carry 3:** `download` revokes the object URL right after `click()`; fine in desktop Chromium; the CEO phone check includes one real Chrome-on-Android download.
- **QA 11a carry 4 (step 36):** `gameZip` reads `commit` and `node` from `build.json` by regex on the pretty-print shape after `isTree` parsed it.
- **QA 11a carry 6 / r2 carry, for a later step:** the save-fail stop is pinned only by a source regex in 11a's test 3 (a failing OPFS save needs a dev hook).
- **QA 11b carry, for a later step:** `zipCommit`'s throw when the game's `build.json` names no commit is untested.
- A second download in one session may meet a browser's "download multiple files" prompt on some phones; Share is the fallback where `canShare` holds. Headless Chrome can't share files, so the smoke stubs `canShare`/`share`.
- 11a's guide carries (WebView 98+ floor, D9 upgrade-on-save backlog, DSK E1–E4 follow-ups, §7.2 closure) stand unchanged.

## EA rulings in this guide
1. **Split (EA ruling, 2026-11-26: the 400 gate holds; the UX sheet moves to 11a2).**
2. **Error sheet also has Done**, so it can be closed without retrying (UX named only Try again).
3. **One shared `sheet()`** for both, with Done last, reusing the scrim/sheet pattern; no CSS. The sheet state is its own `built: BuildSheet` beside 11a's `building: BuildView`, so 11a's button code is untouched.
4. **11a's banner pin moves with the code** (Rule 3), so a throw that reaches no one stays caught.
5. **A refused share uses the error sheet** (QA's first choice): the share error's own message as the plain reason, or "Couldn't share your game." when the message is empty; its Try again re-runs Build game. UX may pick another line later (Questions).
6. **Two QA carries have no behavioural test.** `builtFile = null` only frees memory: after Done there is no Share button, so nothing on the page can tell. The open-project reset guards a state the page can't reach today: every act runs in turn through `go` (`home.ts` L33), so Back or another project can't run while Build game is busy, and the open sheet's scrim covers the screen until Done. So M26 and M27 survive, by design; QA can ask for them to be dropped instead.
7. **The reset sits in `run`, not in `openId`** (`if (act.startsWith("open:")) forgetBuild();` on its own line), because `openId` is one dense line and Rule 5 forbids packing a new statement into it.
8. **QA's 11a carries 1–2 ride here** because 11a2 already re-trials the export; they add 16 counted lines and change no zip byte.

## Questions for UX (none block the build)
1. The error sheet's extra Done (EA ruling 2); the refused-share line and its fallback "Couldn't share your game." (EA ruling 5).

## Changes from r2 (guide r2 sha256 `176cc2bc6b9e072beb0a16245f2a3ddb98a2e96b478405bd692894d900e7c9c0`, kept as `step-11a2-ready-sheet-r2.md`; QA paste check `docs/qa/step-11a2-paste-review.md` `c6734a3c`)
- Re-trialled on the merged 11a (`7d73c74b`, base `1b34e541`). Confirmed QA's finding: on the merge, `BuildView` is `"idle" | "busy"` (not `{ mode }`), the variable is `building`, `download(name, bytes)` makes its own `File`, `buildNow`'s refusal and catch are one-line blocks, and test 3's banner pin is `/state\.banner = e instanceof Error \? e\.message : "Can't build"/` on L103; r2's patch fails `git apply --check` there on all three files.
- Code names: the sheet state is a new `built: BuildSheet` (not a widened `BuildView`); `download` takes the `File`; the open-project reset moved from `openId` to `run` (EA ruling 7); `closeBuild`/`forgetBuild` added. Behaviour is r2's.
- Placeholders filled: base `1b34e541` on the 11a merge `7d73c74b`, floor 1165 + 2 = **1167**.
- Rule 4 new (QA 11a carries 1–2 in `tools/export/game.ts`); Rule 5 rewords the style rule (one statement per line in all new code, no packing in dense files) and carries QA's zip.ts no-precedent ruling.
- Done when: a self-run audit the builder can do from the repo replaces `/workspace/share/s8/s8-audit.mjs` (not visible to the builder, QA 11a carry 5).
- Count 121 → **141**; caps: `home.ts` 40, `build-sheet.ts` 14, `tools/export/game.ts` 20 (new row), sum 158.
- Measured adds: 11b r2 fails green on the merged 11a (`gameZip` signature), independent of 11a2.

## Changes from r3 (guide r3 sha256 `26c5d6a6fc81d36e28674d70d84139581f908ca94904b5ae90177c221c39faed`, kept as `step-11a2-ready-sheet-r3.md`; QA review `docs/qa/step-11a2-r3-guide-review.md` `f83b43ac`)
- QA must-fix: `built = null;` on its own line in `buildNow` before the busy paint (Rule 2), so a rebuild closes the open sheet; smoke 2 delays `build.json` and checks the sheet is gone and Building… shows right after Try again; mutation M31.
- QA nit: `esc` uses literal `"&amp;"`-style strings, not `String.fromCharCode(38)` (Rule 1).
- Count 141 → **142** (`home.ts` 34+ 6−, `build-sheet.ts` 9, smoke 57); caps unchanged (sum 158).
