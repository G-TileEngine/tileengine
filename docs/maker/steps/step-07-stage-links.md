# Step 07: stage links and the two-floor shop

r4, 2026-11-23, Engine Architect. r4 fixes QA's 3 must-fixes in `docs/qa/step-07-guide-review.md` (sha256 `b64a8106…`) on r3 (`c0d51c7e…`): (1) Law 13, the play-stage window `resize` listener is now removed on every exit (a fix in this step, not a carry); (2) the D17 / D27 cites point at the commit that has them; (3) three Read-first ranges include their closing brace. r3 applied DSK ruling **D27** (`handoff/dsk-rulings/2026-11-17-phase1.md` L75, sha256 `e055dcfea1ca9f2ba41da92261756b0a6b1c3dced9aa9021b388fe1287a00025`, on main `1890264`). One builder run (ChatA) and one QA review, with gates on. Covers roadmap L82 (MS-03, step 7): "Session and stage links: doors, stairs, gates and safe-point rollover (C3a, C3b). **Two-floor shop**: shop downstairs, home upstairs", plus the link placer and the stage-link rebuild frame-budget test. Every number below comes from a trial run on `ce4ded7e` (see Measured).

**DSK has ruled (D27).** No go-line block remains on DSK; CoS sends the go-line after QA's verdict.

Step id: `step-07-stage-links`. Revision: r1 for the first run, then r2, r3 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `ce4ded7e710357d3452ea3de0a2b9568ffc11956` (`ce4ded7 docs(qa): baseline-06c phone readouts`; docs only since `cc64602a`: it adds `docs/qa/baseline-06c-phones.md`; 6d merged as PR #93, `aa2ef7e3`). If CoS names a later main in the go-line, use that main and its test count.
**Test floor:** **1108 + 6 = 1114.** The base measures 1108 pass, 0 fail (`npm test` in a fresh `/tmp` clone after `npm ci`; `ce4ded7e` is docs only over `cc64602a`). N = 6 (the named tests below).
**Needs:** 4c (stages and maps, done), 6d (closed), DSK D27 (done). **Blocks:** step 8 (C8a autosave at links hooks onto this step's link event).
**Own smoke, port:** `handoff/steps/tests/s7-stage-links/smoke.mjs`, **8809**. Ports in use: 8734, 8797–8808. 8809 has no hit in `handoff/`, `tools/`, `tests/`, `scripts/` or `docs/maker/steps/`.

## Delivery
Same as the step 6d Delivery (`step-06d-baseline-page.md` L12–19), with this step id.
- Branch `step/step-07-stage-links-r<N>-chatA` from the base. Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds `handback/step-07-stage-links/r<N>/HANDBACK.md` with the sections in `handoff/HAND-BACK.md`, plus § Green, § Smoke (s7 and S0), § Export audit and § Screenshots. Label the **Code head** apart from the docs-only **tip**. Don't commit a raw test log.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words: in the maker, the user taps an empty tile and picks **Stairs**, **Door** or **Gate**, then picks the stage it leads to. In Test, when a unit of the player's side ends a move on that tile, the play stage swaps to the linked stage. The party arrives on that stage's link back (the stairs down), or on its team starts if there is none. The **two-floor shop** is two stages, "Shop" downstairs and "Home" upstairs, with stairs both ways. Deleting a stage that a link leads to is refused until the link is removed.

**Not in step 7:**
- Autosave at links (C8a) is step 8 (roadmap L83: "Autosave toggle on a link"). Step 7 only emits the link event that step 8 hooks.
- Safe-point rollover needs game time (step 13). Row L82 says "Needs no items and no time", so step 7 leaves a hook only: the same link event.
- Same-map hidden storeys and roof hide are MS-05, out of scope.

## Read first (code lines checked on `ce4ded7e`, docs-only over `cc64602a`; the DSK rulings lines on `1890264`)
1. `docs/maker/roadmap.md`:
   - L82: this step.
   - L83: step 8, C8a and `link.autosave`.
   - L182: the Risks row. The stage-link rebuild fits one S21 Ultra frame, checked by a named test, and CoS runs the phone check.
   - The L82 notes cite JOINT-MAP #3/#4/F1 (private repo, sha256 `32ea33e0…`). One link type covers stairs, shop door and gates, through a session layer under `src/rules/session/`.
2. DSK `handoff/dsk-rulings/2026-11-17-phase1.md` at main **`18902648`** (blob sha256 `e055dcfe…`, 75 lines; docs only over `ce4ded7e`, floor unchanged; on `ce4ded7e` the file is 74 lines and has no D27):
   - L60 D15: maps are shared across stages.
   - L63 D17: `placementDropped`; `list` stays `playerSpawns | neutrals | enemyPool` in the current type. "Step 7 link cells add a `list` value later, not a new code (no CN: the enum is in `src/editor/stage/resize.ts` and `src/project/load/drops.ts`, not core-types; see D27)."
   - L68 D21: `mapEntryDropped`.
   - **L75 D27: stage links** (this step's format ruling; L75 exists only from `1890264`, blob `e055dcfe…`).
   - The CN: `data/staging/cn-links/cn-links.diff` (sha256 `1428ec8c0e7c60d3042c0d5c39192c3795541ab7c49a719ba4ccf7ddb6b664d2`), against `src/types/core-types.ts` sha256 `d6d08696…` (unchanged `cc64602a` → `ce4ded7e`). Applied, it gives `fd27de06c035ab8c3767a31ad0cf2bf75fa74ca200487a6e2ea762f2d90e747d` (= `core-types.staged.ts`).
3. Play stage:
   - `tools/play-stage/project.ts` L16 `PlayOut`, L46–74 `playDocsOf`, L75–83 `openProject`.
   - `tools/play-stage/load.ts` L23 `PlayDocs`.
   - `tools/play-stage/match.ts` L78 `play.landed`. Today it returns at once on the player's side.
   - `tools/play-stage/page.ts` L15 `startMatch(docs, back?, aim?)`, L28 env (the driver is the only rAF caller), L42 `driver`, L55 the window `resize` listener (never removed on the base), L77 `driver.start()`.
   - `src/runtime/host/raf-driver.ts` L97–100 `dispose()`: cancels the rAF, drops the visibility listener and the ResizeObserver; it does **not** touch `page.ts`'s window listener.
   - `tools/play-stage/board.ts` L83–90: `onLand` fires when a walk ends.
4. Core types and the stage parser:
   - `src/types/core-types.ts` L154 `CoreEnemyPool`, L162 `CoreStage`, L175 `sides?` (the CN adds `LinkType` and `CoreLink` before L162 and `links?` after `sides`).
   - `src/project/read/stage.ts` L31–36 `neutrals` (the malformed-entry pattern), L70–79 `countOf` (caps), L87–109 `readStageDoc`.
   - `tests/smoke.test.ts` L12–15 pins the core-types sha.
5. Reader:
   - `src/project/load/read-project.ts` L19 `has()` (brokenRef, hard), L30–36 per-stage refs.
   - `src/project/load/drops.ts` L21–26 `placementDrops`.
6. Editor:
   - `src/editor/stage/resize.ts` L3 `PlaceDrop`, L50 `cut(...)`.
   - `src/editor/stage/rooms.ts` L10–11 `refsTo` ("Step 7 adds link targets"), L40–46 `deleteStage`.
7. Maker:
   - `tools/maker/test-launch.ts` L12 `Start`, L18–28 `play()`.
   - `tools/maker/home.ts` L53–59 `enterPlay`, L71 and L88 (the two `start` callbacks).
   - `tools/maker/stage.ts` L26 `Sess`, L96 `cellsHtml`, L154 the Add here sheet, L172 `s:close`, L236 `s:place:spawn` (the handler pattern).
   - `tools/maker/stage-sheets.ts` L3 `placeButtons`.
8. Carry sources:
   - `docs/maker/steps/step-04-stage-editor.md` L27, L284, L362.
   - `docs/rebuild/step-04c.md` L46.
   - `docs/qa/step-04c-review.md` L28.
9. `tests/project/load/one-parser.test.ts` L5 (P2 bans `kind ===`; hence the field name `type`) and L16 (play-stage never imports the maker). Both must pass unedited.

## Data (DSK D27)
- **`stage.links?: ReadonlyArray<CoreLink>`**, with `CoreLink = {type: "stairs" | "door" | "gate", at: Sq, to: stageId}`. It is on the **stage**, not the map; JOINT-MAP's `map.links[]` is superseded (maps are shared, D15).
  - `type` is a closed enum and **only a label in step 7**: the engine treats all three the same.
  - **No id.** At most one link per cell, so (stage, `at`) is the identity.
  - **No arrival field.** Arrival is the target stage's **first link in array order** whose `to` is the source stage, then the target's `playerSpawns`.
  - A **self-link** (`to` = the stage's own id) is refused by the editor and read as `brokenRef`, hard.
  - Absent `links` = `[]`. **No formatVersion bump**: stage stays v2.
- **Reader rows**, existing codes only:
  - A `to` naming no stage, or the stage itself: `brokenRef`, **hard**, at `stages/<id>.json#/links/<i>/to`.
  - A link cell off the map or on a closed tile: `placementDropped`, **warning**, at `#/links/<i>`, with `list: "links"` and no `unitId`. That enum lives in `resize.ts` / `drops.ts`, so it needs **no CN**.
  - A malformed entry (bad `type`, `at` or `to`) fails the stage read, like a malformed neutral: a hard `invalidValue` on the stage file.
  - A resize that leaves a link cell outside the map drops it, with the `placementDropped` row.
- **CN (carried on this branch):** apply `data/staging/cn-links/cn-links.diff` to `src/types/core-types.ts` **byte for byte** (check the diff sha `1428ec8c…` and the target sha `d6d08696…` first; the result must be `fd27de06…`). Move the pin in `tests/smoke.test.ts` L14 from `d6d08696…` to `fd27de06…` (that one line).
- **Deferred:** the `session` start field waits for step 8 or later (Test starts on the chosen stage). **`link.autosave?: boolean` is reserved for step 8**, on the entry itself (absent = off); step 7 neither reads nor writes it.

## Rules
1. **The engine runs the rule, the maker only authors data.** New `src/rules/session/links.ts` **imports `CoreLink`, `LinkType` and `Sq` from `core-types.ts` and never redefines them**. It holds `LinkEvent`, `LINK_TYPES` and three pure functions:
   - `linkAt(links, at)`: the link on that cell, or `null`.
   - `arrival(targetLinks, fromStageId, spawns)`: `back` = the target's **first link in array order** whose `to` is `from` (say "first in array order" in its doc comment); `[back.at, ...spawns without back.at]` if there is one, else `spawns`.
   - `linkEvent(link, from)`: `{type: "link", linkType, from, to, at}`.

   It imports only types from `core-types.ts`. There's nothing game-specific (no "shop" or "home"), and nothing goes in `src/core` or `src/sim`. depcruise stays green.
2. **Play stage, data in, event out.**
   - **`readStage` is the one stage parser** (`src/project/read/stage.ts`): a `links(v)` reader next to `neutrals` (absent = no field; not an array, or any entry with a bad `type`, `at` or `to`, returns `null` → `bad("links")`), a `tooMany(json.links, lim.spots)` → `overCap("links")` line in `countOf`, and `...(links === undefined ? {} : { links })` in the result. It ignores `autosave`.
   - `playDocsOf` does **no link parsing** and has no `play: link` throw: it takes `readStage(stage, { picks: 0, waveUnits: 0 })` (the limits `docsToInput` already hands the sim) and sets `PlayOut.links = core.doc.links ?? []`; a failed read throws the existing `play: stage`. readProject has already refused a malformed stage, so that throw is a guard only.
   - `PlayDocs` gains an optional `links: readonly CoreLink[]`.
   - In `match.ts` L78, when the player's side lands, the match checks `linkAt(body.links ?? [], selected.at)` and calls one `onLink` slot (`api.onLink(fn)`). The enemy path is unchanged.
   - **Law 13 teardown.** `page.ts` names the resize handler (`const onResize = (): void => { place(); seated = false; }`; `addEventListener("resize", onResize)`) and adds `const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };`. Every exit calls `stop()` instead of a bare `driver.dispose()`: **travel**, **Back to maker** (the button) and **Restart** (`hud` `restart` with `back`). After the change `driver.dispose()` appears once in `page.ts`, inside `stop`. No new rAF, timer or loop: the driver stays the only rAF caller.
   - `startMatch(docs, back?, aim?, travel?)`: if `travel` is given, `match.onLink(link => { stop(); travel(link); })`, before `driver.start()`. With no `travel` (release demo), play is unchanged; the standalone boot never exits, so its one listener lives with the page.
   - **One clock:** no new rAF, timer or loop, and the old driver and its window listener are gone before the next `startMatch`.
   - `arriveIn(files, from, link)` in `project.ts` opens `link.to` through `openProject`. It sets the target's `playerSpawns` to `arrival(...)` (keeping each spawn's facing) and `chosen` to `from.chosen.slice(0, spawns.length)`. The play stage never imports `tools/maker`.
3. **Maker wiring.**
   - `test-launch.ts` exports `type Next = (from, link) => {docs, error}`. `Start` gets a third parameter, and `play()` passes `(from, link) => arriveIn(parsed.files, from, link)`. That's the files snapshot taken at Test, so nothing is re-read from storage mid-play.
   - In `home.ts`, `enterPlay(docs, scroll, aim?, next?)` lifts the old back body into `out()`. `travel` calls `next`:
     - On an error, it runs `out()` and shows the error in `state.problems` (no silent fallback, Law 12).
     - Otherwise it removes the canvas and `#hud` and calls `enterPlay(got.docs, scroll, undefined, next)`.
4. **Link placer** (stage editor, `stage.ts` plus `stage-sheets.ts`).
   - On an **empty, open** tile, with at least one other live stage, the Add here sheet shows a "Link" group: Stairs / Door / Gate (`s:link:<type>`). That opens "<Type> goes to" with one choice per other stage (`s:to:<stageId>`) and Close.
   - `s:to:` commits `addLink` (one undo step) only if it returns non-null and the id is a live stage. The goes-to sheet never lists the stage itself.
   - A tile with a link shows `S↗` / `D↗` / `G↗`, with ", Stairs" etc. in its `aria-label`. Its sheet shows "Stairs to <name>" and **Remove link** (`s:unlink`).
   - Use only the existing words: no new jargon, and no code shown. Every button is at least 48 × 48 px.
5. **Pure editor helpers** in new `src/editor/stage/links.ts` (types from `core-types.ts`): `linkOn`, `addLink` (replaces any link on that cell; returns **`null` for a self-link**), `removeLink`, and `linksTo(stages, id)` (the names of other live stages with a link to `id`). Each returns a copy with no mutation (`structuredClone`).
6. **Delete refusal (the refsTo carry).** `deleteStage` refuses with `A link on <names> leads here. Remove it first.` when `linksTo` finds a live stage linking to it. Update the `refsTo` doc comment. `refsTo` stays `mapRef`-only, because map delete is unaffected (links target stages, not maps).
7. **Reader** (one line each):
   - `read-project.ts` `refs()` adds one line over `list(stage["links"])`: a `to` equal to the stage's own id pushes `row("brokenRef", "hard", …#/links/i/to, id)`; otherwise `has(stages, l["to"], …#/links/i/to, rows)`.
   - `drops.ts` adds `["links", false, list(stage["links"])]`.
   - `resize.ts` adds `"links"` to `PlaceDrop["list"]` and to the `cut(...)` chain.
8. **Keys:** use `Object.hasOwn`, a `Map` or `Object.create(null)` for any lookup keyed by a document value. The trial uses `find` / `some` on arrays and needs none.
9. Don't touch `tools/painter-proto/` or `tools/ui-shell/`. UNIT and TILE stay the only targeting pipes: a link is reached by an ordinary move, with no new pipe. No new dependencies; works offline.

## Build (caps are counted lines, insertions + deletions)
| File | Job | Trial | Cap |
|---|---|---|---|
| `src/types/core-types.ts` | **the D27 CN**: DSK's staged diff, byte for byte | 7 | 7 |
| `tests/smoke.test.ts` | the core-types pin `d6d08696…` → `fd27de06…` (one line) | 2 | 2 |
| `src/project/read/stage.ts` | `links()` reader, cap, result field (Rules 2) | 13 | 16 |
| `src/rules/session/links.ts` | new: `LinkEvent`, `LINK_TYPES`, `linkAt`, `arrival`, `linkEvent` (Rules 1) | 13 | 18 |
| `src/editor/stage/links.ts` | new: `linkOn`, `addLink` (self-link null), `removeLink`, `linksTo` (Rules 5) | 14 | 18 |
| `src/editor/stage/rooms.ts` | delete refusal, comment (Rules 6) | 5 | 8 |
| `src/editor/stage/resize.ts` | `links` list (Rules 7) | 6 | 8 |
| `src/project/load/read-project.ts` | link `to` brokenRef, self-link (Rules 7) | 1 | 3 |
| `src/project/load/drops.ts` | link cells in `placementDrops` (Rules 7) | 1 | 3 |
| `tools/play-stage/project.ts` | `links` from `readStage`, `arriveIn` (Rules 2) | 14 | 18 |
| `tools/play-stage/load.ts` | `PlayDocs.links?` | 3 | 4 |
| `tools/play-stage/match.ts` | `onLink` on the player's landing (Rules 2) | 6 | 8 |
| `tools/play-stage/page.ts` | `travel?`, `onResize` and `stop()` on every exit (Rules 2, Law 13) | 14 | 16 |
| `tools/maker/test-launch.ts` | `Next` and the `arriveIn` closure (Rules 3) | 8 | 10 |
| `tools/maker/home.ts` | `out()` and `travel` (Rules 3) | 13 | 16 |
| `tools/maker/stage.ts` | placer state, glyph, handlers (Rules 4) | 27 | 34 |
| `tools/maker/stage-sheets.ts` | `LINK_LABEL`, `linkRows`, `goesSheet` (Rules 4) | 5 | 8 |
| `tests/tools/stage-links.test.ts` | new: the 6 named tests | 83 | 105 |
| `handoff/steps/tests/s7-stage-links/smoke.mjs` | new smoke (**own cap, outside the 400**) | 68 | 90 |

**Count command:** `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!handoff/steps/tests/s7-stage-links/**'`.
- Hard gate: **400**. The caps sum to **302**, and the trial used **235** (18 files, 203 +, 32 −).
- Going over any one cap is stop-and-report, not a quiet overrun.
- Lines are long, in house style. Don't wrap or split lines to dodge a cap, and don't join lines to fit one.

## Named tests (all in `tests/tools/stage-links.test.ts`; DOM-free imports only)
Fixture: the 6c checkpoint (`handback/step-06c-checkpoint/r1/checkpoint.tileproj/`, read-only). Clear stage A's enemy pool (free roam). `addStage` B on the same map with no spawns and no enemies. Stairs on A at 1,0 lead to B; stairs on B at 2,1 lead to A.
1. **`stage link: landing on stairs takes the party to the linked stage, arriving on the stairs back`**
   - `arrival` unit cases: no back link gives the spawns; with a back link, the back cell comes first and isn't duplicated.
   - `createMatch(docsA)` (moveMs 200, the clock ticked): a move to a plain tile fires no link. Hero 0,0 → 0,1 → 1,1 → 1,0 fires exactly `{stairs, 1,0, B}`.
   - `arriveIn` puts the hero on B at 2,1 with `sides.contest === false`.
   - On B, 2,1 → 3,1 → 2,1 fires a link to A, and `arriveIn` puts the hero back on 1,0.
   - Law 13 guard (the Restart path the smoke doesn't drive): `tools/play-stage/page.ts` has `driver.dispose()` exactly once, inside `const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };`.
2. **`stage link rebuild fits the frame budget`**: `arriveIn` + `createMatch` + `scene()`, 25 runs with the first 5 dropped as warm-up. The median is **< 4 ms** on the box: a quarter of a 16.7 ms frame, leaving phone headroom.
3. **`stage link: the reader warns on a link off the map and refuses a link to a missing stage, to itself, or malformed`**:
   - A door at 9,0 gives `placementDropped` / `warning` at `stages/A.json#/links/1`, with `detail` `outsideMap`.
   - A gate to an unknown stage gives `brokenRef` / `hard` at `#/links/1/to`.
   - The clean shop has no `/links/` row.
   - A door on A leading to A gives `brokenRef` / `hard` at `#/links/0/to`.
   - A `type: "window"` entry: `readStage` returns `ok: false`, and readProject gives a hard row on A's stage file.
4. **`stage link: a stage a link leads to can't be deleted until the link is removed`**: `deleteStage(B)` gives `{ok: false, reason: "A link on Blank leads here. Remove it first."}`. After `removeLink(A, 1,0)` it's `ok`. `addLink(A, stairs, 0,1, A)` returns `null` (self-link refused).
5. **`stage link: a resize drops a link cell outside the map with a placementDropped row`**: resizing to 2 × 2 gives exactly one row `[placementDropped, links, stages/B.json#/links/0]`, and B's `links` becomes `[]`.

6. **`stage link: arrival is the target's first link back to the source, in array order`**:
   - `arrival([gate→x at 4,4, door→A at 3,1, stairs→A at 2,1], A, [2,1])` is `[3,1 ; 2,1]`.
   - Give B two links back to A, door then stairs: `arriveIn` lands the hero on the first one's cell. Swap the cells: it lands on the new first one.

## Smoke (`handoff/steps/tests/s7-stage-links/smoke.mjs`, port 8809)
`PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s7-stage-links/smoke.mjs . 8809`.
- Copy the s6c head (L1–19): dev `build()` from `tools/maker/build.ts`, a static server on 127.0.0.1, and `tap` / `press` / `waitText`.
- Widths 390 and 360 (height 844, `isMobile`, `hasTouch`). Use `page.waitForFunction` for every wait; never use `waitForTimeout`.
- Collect `pageerror` **and** console errors. Screenshots go to `handback/step-07-stage-links/r<N>/` at 390.
- Don't wait for the Undo toast to clear after a link commit; it stays up.

The checks, one `ok`/`FAIL` line each:
1. **new**: New project → Continue → Create (Demo), and "Demo stage" shows.
2. **upstairs**: `r:add` → `r:use:map_01JDAM…01` (the shared map) gives 54 cells and a new `?stage=` id.
3. **stairs down**: on the new stage, tap 2,7 → `s:link:stairs` → "Stairs goes to" → `s:to:<Demo>`. Cell 2,7's label ends ", Stairs", and its sheet shows Remove link.
4. **stairs up**: back to Demo stage; tile 0,7 → stairs to the new stage, with the same checks.
5. **refuse delete**: the new stage's menu → Delete shows "A link on Demo stage leads here. Remove it first."
6. **go up**: Test from Demo stage. Through `window.__play.feed`, the unit at 0,8 moves to 0,7. Then wait until `__docs.links` targets equal `[Demo]` and a player unit stands on 2,7.
7. **go down**: 2,7 → 2,8, `endTurn`, then wait for idle; 2,8 → 2,7. Then wait until `__docs.links` targets equal `[newId]` and a player unit stands on 0,7.
8. **back to maker**: Back to maker shows 54 cells.
9. **resize listeners flat**: an `addInitScript` wraps `window.addEventListener` / `removeEventListener` and counts live `"resize"` handlers. Read the count on the maker before Test, after Test starts, after go up, after go down and after Back to maker. Pass only if Test adds exactly one, up and down keep it at that number, and Back returns to the maker's count (trial: `{"maker":0,"play":1,"up":1,"down":1,"back":0}`; with r3's `page.ts` it read `0,1,2,3,3` and failed).
10. **targets**: no visible `button` or `input` under 48 × 48 px in any sheet the flow opens (the Add here sheet with the Link group, "goes to", the linked-tile sheet, the refusal).

End with `SMOKE PASS`. **Also run** the S0 touch smoke (`handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`), frozen and unedited at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, because play-stage changes. **And the export audit** (step 6 guide L35): a release `tools/play-stage/build.ts` build and the maker build's `play-stage/` tree contain no `tools/maker` or `src/editor` text and no `catalogue.json.js` / `behaviours.json`. Paste the command and the empty hit list.

## Must NOT
- No edit to `src/core`, `src/sim`, `fixtures/`, `data/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`. `src/types/core-types.ts` changes **only** by DSK's staged diff. No edit to an existing test or frozen smoke, except the one pin line in `tests/smoke.test.ts`.
- No game words ("shop", "home") in `src/` or `tools/play-stage/`. No second rAF, timer or loop. No `tools/maker` import from `tools/play-stage/`.
- No new report code. No formatVersion bump. No `session` field, no `link.autosave` read or write, no arrival field, no link id (D27). No second link parser outside `readStage`; no `play: link` throw.
- No pre-warming of the next stage (roadmap L82: only if the phone check misses).

## Done when
- **Gates:** `npm ci && npm run green` exits 0 at **1114** or more, with `one-parser.test.ts` unedited. `npx tsc --noEmit -p tools/tsconfig.json` adds no error (the base has 3: `tools/maker/home.ts` ×2 and `tools/effect-designer/page.ts` ×1; leave them). Quote the count command; the total must be 400 or less with every cap kept.
- **§ Green:** the `ℹ tests / pass / fail` lines, the 6 named tests' ✔ lines, and the core-types sha `fd27de06…` (with the diff sha `1428ec8c…`), with test 2's median printed once in the hand-back.
- **§ Smoke:** s7, 20 ok lines and `SMOKE PASS`. S0, 14 ok lines and `TOUCH SMOKE PASS`. Plus the export audit.
- **§ Screenshots:** the 390 shots (the goes-to sheet, a placed link, the refusal, upstairs in play, back down).
- **Not the builder's gate:** **CoS runs the phone check** (Risks L182). On the S21 Ultra, the stair swap plus first draw fits one frame. If it misses, pre-warm per roadmap L82 (adjacent stages only, discardable) in a follow-up, not here.
- **Phone rules:** CoS's two-phone run of the stage change (S21 Ultra and Red Magic 9 Pro) must meet the rules in `docs/qa/baseline-06c-phones.md` (sha256 `37b95e53477079533c4119231a6cdfd70849f49a37683a353798f317f2c25ebc`, L31): p95 at or under 16.7 ms, no dropped frame, no frame over 50 ms, and no heap growth the new content doesn't explain. The first draw after a stairs link counts as a frame in the max-frame rule.

## Measured (trial run, 2026-11-23, r4)
A fresh `/tmp` worktree of **`ce4ded7e`**, never committed or pushed. The patch is `/workspace/share/s7/s7-trial.patch` (it excludes the screenshots) and applies cleanly to `ce4ded7e`; with it `core-types.ts` is `fd27de06…`.
- Base: 1108 pass, 0 fail. With the trial, `npm run green` exits 0 with **1114 pass, 0 fail**, depcruise clean, and check:state / check:law OK. `tsc -p tools/tsconfig.json` still shows only the 3 base errors. eslint is clean.
- Count: 18 files, **203 +, 32 −** (235), per the table. Smoke: 68 lines.
- s7 smoke on 8809: 10/10 ok at 390 and 10/10 at 360 (check 9 `{"maker":0,"play":1,"up":1,"down":1,"back":0}`), `SMOKE PASS` (Chrome 156 headless). S0 on 8797 (sha `d528795e…` checked): 7/7 at each width, `TOUCH SMOKE PASS`. Export audit: no hits.
- Rebuild (test 2's body): median **0.67–0.73 ms** over 3 runs on the box (Node 24). That's the model and scene rebuild only; first draw is the phone check.

## Carries
**Due in step 7, both included above:**
- **refsTo / link targets** (step 4 guide L27, L284, L362; rebuild 04c L46; QA 04c review L28). Delete is refused while a link leads to a stage (Rules 6, test 4).
- **D17 link cells** (DSK L63, ruled by D27). Link cells land in `placementDropped` with `list: "links"`; no CN needed.

**Not due in step 7, listed so nothing is lost:**
- `catalogue.ts` regen to rev 30: "its own run" (rebuild 06c L216).
- `tools/host-example/match-picture.ts:17` `["player","wolves"]`: ruled in S0b as a hand-run host example that stays as is (step 00b L114). No step owns it.
- D22 effect ids: step 10.
- The 16 demo fixture `.json.js` files in the baseline build: export work, step 11.
- The guide L213 "Attack 5" wording.
- The 4a/4b/4c standing carries: uncapped stage undo, the maker-law plant try/finally, talk `createdAt`, the session-only unused delete, Path and Dirt hidden, `chosen()` at `stage.ts:35-41`.
- The dpr carry.

**New carries from this step:**
- **Party state isn't carried across a link:** hp, xp and level reset to the unit recipe on each stage. That belongs to the session save, step 8 (JOINT-MAP #4).
- **An arrival cell taken by a neutral or enemy:** `arrival` doesn't check occupancy. `createUnits.place` (`src/core/unit/units.ts` L41) refuses a second body with `placeOccupied`, so one unit per cell holds. The arriving unit is simply not placed (`src/sim/world.ts` L59 ignores the failed place) and the play stage doesn't show the notice. The two-floor shop's empty upstairs never hits it. Home: the session layer, step 8.
- **A link in a contest stage fires mid-battle.** The placer allows it. On a player landing, `match.ts` calls `onLink` and returns without `pump()`; travel disposes the old match and starts a fresh one, so turn order is never left mid-transition. Whether a battle locks links is a game rule for DSK or EA later.

## DSK questions (closed by D27, `handoff/dsk-rulings/2026-11-17-phase1.md` L75 (sha256 `e055dcfea1ca9f2ba41da92261756b0a6b1c3dced9aa9021b388fe1287a00025`))
1. Where links live: **`stage.links?`**; JOINT-MAP's `map.links[]` is superseded.
2. Entry shape: **`{type, at, to}`**, `type` a closed enum (label only in step 7), **no id**, **no arrival field** (first back link in array order, then `playerSpawns`); a self-link is refused and read as `brokenRef`.
3. Report rows: missing `to` = **`brokenRef` hard** at `#/links/<i>/to`; off-map or closed cell = **`placementDropped`** with `list: "links"`, no `unitId`, **no CN**.
4. Core types: **`CoreStage.links?: ReadonlyArray<CoreLink>` under a CN** this branch carries (staged diff `1428ec8c…`); `readStage` parses links; **no formatVersion bump**, stage stays v2.
5. `session` start field: **step 8 or later**.
6. `link.autosave?: boolean`: **reserved for step 8, on the entry** (absent = off).
