# Step 08: autosave at links, the session start and the stair phone check

r4, 2026-11-23, Engine Architect (r3 + QA recheck `docs/qa/step-08-guide-recheck.md`, sha256 `dea45e6b…`: Must NOT party-read wording only; r3 = r2 + QA review `1967c47e…`: 5 must-fixes, 3 nits). Two builder runs (8a, then 8b; ChatA each) under one QA review, with gates on. Covers roadmap L83 (MS-03, step 8, C8a part 1): "Autosave toggle on a link. **Measure** the stair/door rebuild plus first draw, with the autosave, against the one-frame budget; pre-warm only as in step 7. **Single point of failure:** the session save needs a migration test (see Risks)", plus the session start field D27 deferred to step 8, the three step 7 carries, the stair phone check (`?scene=shop`) and the step 7 QA nits. Every number below comes from a trial run on `e801c78d` (see Measured).

**DSK has ruled (D28, Q1–6; EA rules Q7), so the go-line no longer waits on DSK.** As one step the trial measures **411** counted lines (r3; 401 in r2), over the 400 gate, so **EA rules the split below: step 8 builds as 8a then 8b**, two builder runs under this one guide and this one QA review. CoS sends the 8a go-line after QA's verdict, and the 8b go-line after 8a merges.

## Split (EA ruling: 8a then 8b)
- **8a, this guide minus the baseline page:** everything except the `tools/baseline/page.ts` and `tools/baseline/readout.ts` rows and named test 6. The `shop-stairs` fixture and `checkpoint.ts` `shopFiles()` / `openShop()` stay in 8a, because tests 1–3, 7, 8 and 9 use them (data only, no rule). Trial **383** (29 files, 317 +, 66 −), caps **398**, floor **1114 + 8 = 1122**. Handback `handback/step-08a-autosave-links/r<N>/`.
- **8b, the stair phone check:** Rules 7 `page.ts` (`?scene=shop`, travel, swap marks) and `readout.ts` (the two rows, scene title) plus test 6, on 8a's merge. Trial **28** (15 + 5 + 8), caps **34**, floor 8a's count + 1. Handback `handback/step-08b-stair-baseline/r<N>/`. The phone check itself (Done when) moves with it.
- The Build table marks each row 8a or 8b. Run as one step instead, the total is 411 with caps 432, over the gate, so the one-step build is not allowed.

Step id: `step-08-autosave-links`. Guide revision: **r3** (r1 had the trial shapes before D28; r2 applied D28; r3 fixes QA's review). Builder revisions count per part: 8a r1, r2 … and 8b r1, r2 ….
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `e801c78d458350f34deb58607cd25e60d16aef2f` (`e801c78 DSK rulings: D28 session save v1`, 2026-11-23 21:44 London; docs only over `fc815c9f`: one line, D28 at L76 of the rulings file). Checked on `origin/main` in a fresh `/tmp` clone: main is now `29f972f2` (`Rebuild records: index rows 4-19 and after-merge lines (QA OK)`, 21:54 London), docs only over `e801c78d` (5 files under `docs/rebuild/` and `docs/qa/`); both trial patches apply to it unchanged. If CoS names a later main in the go-line, use that main and its test count.
**Test floor:** **1122** for 8a (1114 + 8), then 8a's count + 1 for 8b (Split); **1123** in total. The base measures 1114 pass, 0 fail (`npm ci && npm test` in a fresh `/tmp` worktree of `e801c78d`). N = 9 (the named tests below).
**Needs:** step 7 (closed, `24ab0250`), DSK D28 (in, rulings L76). **Blocks:** step 14 (autosave at sleep reuses this step's session save), step 27 (roadmap L119 reuses the link toggle).
**Own smoke, port:** `handoff/steps/tests/s8-autosave-links/smoke.mjs`, **8810**. Ports in use: 8734, 8797–8809 (8811–8813 were used by step 3 r2 runs). 8810 has no hit in `handoff/`, `tools/`, `tests/`, `scripts/` or `docs/maker/steps/`.

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branches `step/step-08a-autosave-links-r<N>-chatA` from the base, then `step/step-08b-stair-baseline-r<N>-chatA` from 8a's merge. Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. **Each part has its own handback folder**, as 04a–c and 06a–d did: 8a's last commit adds `handback/step-08a-autosave-links/r<N>/HANDBACK.md` (and its shots), 8b's adds `handback/step-08b-stair-baseline/r<N>/HANDBACK.md`. Each HANDBACK has the sections in `handoff/HAND-BACK.md` plus that part's § Green, § Smoke and § Export audit (Done when), and 8a's has § Screenshots. Label the **Code head** apart from the docs-only **tip**. Don't commit a raw test log.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS. **The builder never publishes the baseline page**; CoS serves it for the phone check.

## Goal
In plain words: in the maker, a link's sheet gets a toggle, **Autosave here: Off / On**. In Test, when the party takes a link whose toggle is on, outside a battle, the game is saved: which stage the party left, where it went, and the party itself (who is alive, their hp, the side's level bar). The project screen then shows **Continue**, which opens the game where that save left it. A stage's menu gets **Game starts here**: a new game (Test from the project screen) starts on that stage, and that stage can't be deleted while it is the start.

The party now keeps its hp, xp, level and any pending level-up pick across any link (saved or not); the pick is offered again on arrival. If the link's arrival cell is taken, the party fills the nearest free cells instead of losing a unit. A link taken mid-battle is a **retreat**: travel still happens, the party keeps its hp, and **no autosave** is written.

For the phone check, the baseline page gets a second scene, `?scene=shop`: two floors joined by stairs, and two more readout rows.

**Not in step 8:**
- Autosave at sleep is step 14 (roadmap L94). Safe-point rollover needs game time (step 13).
- Save slots beyond one per project, a load menu, or cloud sync (`sync-format.md`).
- Unit-mode level bars and per-instance hp (see Carries).
- Pre-warming the next stage (roadmap L83: "pre-warm only as in step 7", that is, only if the phone check misses).

## Read first (code lines checked on `e801c78d`, which has the same code as `fc815c9f`; the DSK rulings lines on `e801c78`)
1. `docs/maker/roadmap.md`:
   - L83: this step. L94: step 14. L119: step 27 reuses the link toggle.
   - L183: the Risks row, "Session save is a **single point of failure** … A **migration test** … Steps 8 and 14 … DSK for the format".
2. DSK `handoff/dsk-rulings/2026-11-17-phase1.md` (sha256 `bb420c0f4c57a0dba45a8846ef0c44e5e9eebb5e3cf24355699fbc3935440740`, 76 lines, on main at `e801c78`; the box copy matches):
   - **L75 D27**: (6) `link.autosave?: boolean`, on the entry, absent = off.
   - **L76 D28**: the session save, the slot, the start field, the party, the CN and the chain home (Data, Rules 3–4). Q7 is EA's ruling, recorded at the end of D28.
   - DSK's staged CN: `data/staging/cn-session/cn-session.diff` (sha256 `74fb9ff438163b6b31026977201f1b07c32094726d48798d7ce0ff331737b0a7`, +6 lines, base `fd27de06`) and `core-types.staged.ts` (sha256 `439f403d…`).
3. `docs/maker/data/project-format.md` (sha256 `f4427708…`):
   - L1295–1316 **§6.9 `save` v1** (PROPOSED): player data, **outside `<name>.tileproj/`**, never in the export closure; `header` = `SaveHeader` with `projectHash` and `engineVersion` "the same values as the command-log header"; its own `migrations/save/` chain; newer = `saveFormatNewer`, kept untouched, never deleted.
   - L1317 **§6.9.1 `match-save` v1** (DECIDED), L1333 `saveFormatNewer`, L1346 the migration hook ("empty at v1").
   - **§6.9.2 `session-save`** is named by D28 for project-format r41 and is not in `project-format.md` on `e801c78` yet (still `f4427708…`). Until r41 lands, D28 L76 is the source.
4. Save code on the base:
   - `src/types/core-types.ts` L163–167 `CoreLink`, L223–239 `CoreProject`, L319 `SaveHeader`.
   - `src/sim/migrations/save/index.ts` L1–14: `SaveChains` has `save` and `match-save` only, `SAVE_FORMAT = 1`, `migrateSave(kind, doc, from, to, chains)`.
   - `src/sim/run.ts` L88 `SaveRefusal` codes; L105–116 the match-save migrate pattern (D28 cites L110–115: `null` = `saveFormatOlder`, a throw or a bad doc = `saveMigrationFailed`).
   - `tests/sim/trusted-saves.test.ts` L36–37: the registry keys and the empty-chain check (they change with the new key); L41, L47 and L55 build `SaveChains` literals with two keys (they gain `"session-save": {}`).
   - `.dependency-cruiser.cjs` L8: `src/project` imports only `src/project`, `src/types` and `core/notice.ts`. Unchanged (D28 (6)): `readSession` never imports `src/sim`; the maker runs the migration.
5. Play stage (all on the base):
   - `src/rules/session/links.ts` L8–11 `arrival` (no occupancy check), L12–14 `linkEvent`.
   - `tools/play-stage/match.ts` L80 `play.landed` (the `""` fallback for `from`), L120 `onLink`.
   - `tools/play-stage/project.ts` L48–50 `playDocsOf` (first stage = `stageId ?? stages[0]`), L93–103 `arriveIn` (L94 the `""` fallback, L102 `chosen` copied, nothing else).
   - `tools/play-stage/page.ts` L16 `startMatch(…, travel?)`, L59 `stop()`, L81 `match.onLink((link) => { stop(); travel(link); })`.
   - `src/runtime/host/raf-driver.ts` **L97–101** `dispose()` (QA nit: was cited L97–100; verified, it closes at L101).
   - `tools/play-stage/board.ts` **L83–95** `sync` (QA nit: was cited L83–90; verified, `onLand?.(); return;` is L90 and the closing brace L95).
6. Rules state:
   - `src/rules/battle/battle.ts` L15 `BattleSetup`, L27–39 `taken()`, L40–43 `createBattle` (L43 every unit starts at its recipe hp).
   - `src/rules/levels/types.ts` L9 `LevelSetup`; `src/rules/levels/levels.ts` L17 `plainCopy(setup, 3)`, L37 `bars` starts empty.
   - `src/core/unit/units.ts` L41 `placeOccupied`; `src/sim/world.ts` L59 ignores a failed place (the occupied-arrival carry).
7. Reader and editor: `src/project/read/manifest.ts` L21–33 `readManifestDoc`; `src/project/read/stage.ts` L37–43 `links()`; `src/project/load/read-project.ts` L23–40 `refs()` (L27 the `rules` line); `src/editor/stage/links.ts` L11 `removeLink`; `src/editor/stage/rooms.ts` L41–48 `deleteStage`.
8. Maker: `tools/maker/test-launch.ts` L12 `Next`, L15 `LaunchBag`, L20–30 `play()`; `tools/maker/home.ts` L46 `openId`, L53–59 `enterPlay`, L64 `beginTest`; `tools/maker/stage.ts` L152 the linked-tile sheet, L242 `s:unlink`; `tools/maker/rooms.ts` L74 the stage menu, L125 `r:delete`; `tools/maker/store.ts` L19 `commitWrites`; `src/editor/project/home.ts` L6 `LIVE = "tileengine/projects/"`.
9. One parser: `tests/project/load/one-parser.test.ts` L12 (no `JSON.parse`, `formatVersion` or `kind ===` in `src/project/load` or `tools/play-stage`) and L16 (the maker has **one** `JSON.parse`, in `tools/maker/project-files.ts` L8, and no `formatVersion` or `kind ===`). Both must pass unedited.
10. Phone check: `tools/baseline/page.ts` L18 `startMatch(opened.docs)`, `readout.ts` L15, `checkpoint.ts` L11; `tests/tools/baseline-page.test.ts` L11 `BAD` (no `formatVersion` text under `tools/baseline/`); `docs/qa/baseline-06c-phones.md` (sha256 `37b95e53477079533c4119231a6cdfd70849f49a37683a353798f317f2c25ebc`) L31, the pass rules.
11. Carry sources: `docs/rebuild/step-07.md` (sha256 `273422c5…`) L246–257 (QA non-blockers), L187; `step-07-stage-links.md` L225–228.

## Data (DSK D28, rulings L76)
- **`link.autosave?: boolean`** on the `CoreLink` entry (D27 (6)). Absent = off; the editor writes `true` or drops the key, never `false`. A non-boolean fails the stage read (hard, like a bad `type`).
- **`project.session?: {start: stageId}`** on `CoreProject` (D28 (3)). Absent = `stages[0]`. A `start` naming no stage = `brokenRef`, **hard**, at `project.json#/project/session/start`; a malformed `session` fails the manifest read (`bad("session")`). The editor writes it only from **Game starts here**, even when it equals `stages[0]`, and never removes it. Test from the project screen always starts at `start`; Continue uses the save's `to`, never `start`.
- **CN: DSK's staged diff, byte for byte** (D28 (5)): `git apply data/staging/cn-session/cn-session.diff` on `core-types.ts` (`fd27de06…` on the base). It adds `CoreLink.autosave?`, `CoreProject.session?`, and `SessionSave` plus `SessionParty` after `MatchSave`. The result is sha256 **`439f403d03b8c61ff679a51939c5834fc898f3b32c0c9ee6de7f59d3b5f247b5`**; move the pin in `tests/smoke.test.ts` L14 from `fd27de06…` to it. `src/project/read/session.ts` and `tools/maker/session.ts` import `SessionSave` / `SessionParty` and never redefine them.
- **No formatVersion bump** (tile-project stays 6, stage stays 2).
- **`session-save` v1** (D28 (1), (4)): `{kind: "session-save", formatVersion: 1, header: SaveHeader, from: stageId, to: stageId, party: {side, members: {unitId, hp}[], bar}}`.
  - `members`: living units only, each `unitId` once, at least 1, `hp` an int ≥ 1. A duplicate, an empty list or a bad hp = `invalidValue`. A second living copy of one `unitId` isn't carried.
  - `bar` = the side's `LevelBar` minus `id`: `{xp, level, banked, offer: string[] | null, abilities: string[]}`, ints ≥ 0; `null` with no levelling or `bar: "unit"`. Hp over the max is clamped by the carry, not an error.
  - `header`: `projectHash` = **`rev:<project.rev>`** of the manifest Test opened, compared for equality only; `engineVersion` = `ENGINE_VERSION` (`src/index.ts`); `savedAt` ISO UTC.
  - **One slot per project** (D28 (2)) at `tileengine/saves/<projectId>/autosave.json` in the maker store, beside `projects/`, written through `commitWrites`. Trash doesn't move it (Restore brings Continue back); Duplicate, Share and export never copy it. There is no purge today.
  - **Reads (existing codes only):** newer = `saveFormatNewer`; older with no step = `saveFormatOlder` (`needsMigration: true`); a step that throws or leaves a bad doc = `saveMigrationFailed`; `header.projectId` ≠ the slot's project = **`invalidValue`, detail `projectId`**; anything else malformed = `invalidValue`. Every refused file is kept byte for byte, and **the autosave never overwrites a file it refused to read** (banner, file kept). A readable file with a rev or engine difference is **not** refused: Continue resumes with `saveProjectMismatch` / `saveEngineMismatch` as notices, and the next autosave overwrites it as normal.
  - **Dangling refs** after a mismatch are dropped, one `saveRefDropped` each: a missing `to` starts at `session.start` (else `stages[0]`) with the party; a missing `from` lands on `to`'s `playerSpawns`; a missing member `unitId` drops that member.

## Rules
1. **Game rules stay out of `src/core` and `src/sim`.** The only `src/sim` edit is the D28 (6) registry key (Rules 3); no rule goes there. Each carry has one home in `src/rules`:
   - **Party** (new `src/rules/session/party.ts`, `Party = SessionParty` from core-types): `partyOf(units, hp, side, bars)` = the side's **living** units in placement order as `{unitId, hp}`, each `unitId` once (the first living copy; a second isn't carried), and the side's bar minus `id` with `banked` and `offer`; dead members stay behind. **No defaults** (QA must-fix 3): a living unit of the side with no hp in the map throws `partyOf: no hp`. `carryInto(party, side)` = the battle carry (an hp record built from `members`) and the level start for the next stage's loadout side.
   - **Hp** (`battle.ts`): `BattleSetup.carry?: {side, hp: Record<unitId, int ≥ 1>}`, checked in `taken()` (bad = the existing `createBattle: bad setup`). A unit of that side starts at `min(carried, max)`; others at max.
   - **Level bar** (`levels/types.ts`, `levels.ts`): `LevelSetup.start?: {id, xp, level, banked, offer, abilities}[]` seeds `bars` (bad = `createLevels: bad start`: ints ≥ 0, level ≤ top, `offer` null or strings). `taken()` copies at depth **4** (was 3). **EA rule (D28 (4) left it to EA): a kept offer is re-offered on arrival.** The bar starts with that `offer` open, so `levels.offer(side)` returns it and xp banks while it waits, as before the link. No event is re-emitted (the play stage has no pick UI yet).
   - **Occupied arrival** (`links.ts`): `arrival(targetLinks, from, spawns, size = 0, free = () => true)`. Cells `free` refuses are skipped; while fewer than `size` remain, the nearest free cells to the first arrival cell are added, breadth-first, N E S W. With no `size`/`free` it is step 7's function (its tests pass unedited).
   - **Mid-battle** (`links.ts`): `autosaves(link, contest) = link.autosave === true && !contest`; `linkEvent(link, from, contest = false)` adds `autosave`. Travel mid-battle is allowed as a retreat (the old match is disposed through `stop()`, as in step 7); the party's hp carries; nothing is saved.
2. **Play stage, data in, event out.**
   - `match.ts`: the landing passes `play.sides.contest && outcome === null` as `contest`. A stage with no string id **throws `play: stage id`** (QA carry; no `""`). New `party()` reads the party from the live match (`rules.state().units`, `levels.state().bars`); with no rules it **throws `play: party needs rules`** instead of reading `[]` (play-stage docs always set rules, project.ts L79). No levels is still a `null` bar.
   - `page.ts`: `match.onLink((link) => { const party = match.party(); stop(); travel(link, party); })`; `travel?: (link, party) => void`. `driver.dispose()` still appears once, inside `stop` (step 7 test 1 checks it).
   - `project.ts`: `arriveIn(files, fromId: string | null, toId, party)` (was `(files, from, link)`). `fromId === ""` throws `play: stage id`; `null` means a dropped `from` and lands on the spawns. It opens `toId`, builds `free` from the target's grid (`readMap` + `createGrid` + `isOpen`) minus its neutrals, fixed enemies and pool spawns, sets `playerSpawns = arrival(…, party.members.length, free)`, `chosen` = the members' `unitId`s, `rules.carry` and `levels.start`. `playDocsOf` picks `stageId ?? session.start ?? stages[0]` (an adapter read of the manifest readProject already checked).
   - The play stage never imports `tools/maker` and grows no `JSON.parse`, `formatVersion` or `kind ===`.
3. **Session save** (D28 (1), (6)).
   - **Registry** (`src/sim/migrations/save/index.ts`): `SaveKind = "save" | "match-save" | "session-save"`; `SAVE_MIGRATIONS` gains `"session-save": {}` (empty at v1); `SaveChains = Readonly<Record<SaveKind, …>>`, so **the key is required** (QA must-fix 5): a chains value that forgets a kind fails to compile. `migrateSave(kind: SaveKind, …)` reads `chains[kind]` with no fallback. In `trusted-saves.test.ts`, L36–37 change (the key list; the empty-chain sum adds `SAVE_MIGRATIONS["session-save"]` with no `?? {}`) and the three literals at L41, L47 and L55 gain `"session-save": {}`.
   - **Reader** (new `src/project/read/session.ts`, types from core-types): `SESSION_FORMAT: SessionSave["formatVersion"] = 1`; `sessionSave(header, from, to, party)`; `readSession(doc, want: {projectId, projectHash, engineVersion})` reads **v1 only and never migrates** (§11.1) and returns `{ok, save, notes}` or a refusal with the Data codes; `settleSession(save, stageIds, unitIds, start)` drops dangling refs and returns `{from: string | null, to, party, notes}`; `sessionVersion(doc)` returns the doc's version for the caller to hand to `migrateSave`, so the maker never names the field (one-parser L16).
   - **Migration test (Risks L183, D28 (6)):** test 9 drives the real `migrateSave` with a test `chains` argument (a v0 step from the old party shape) through `readAutosave`, then `readSession`; with no step it is `saveFormatOlder`; a throwing step is `saveMigrationFailed`.
4. **Maker wiring.**
   - New `tools/maker/session.ts`: `slotOf(id)`; `readAutosave(store, want, chains = SAVE_MIGRATIONS)` parses through `parseProject({"autosave.json": text})` (the maker keeps exactly one `JSON.parse`), then, for an older session save, runs `migrateSave("session-save", doc, fv, SESSION_FORMAT, chains)` first (`null` → `saveFormatOlder`; a throw or a doc `readSession` refuses, other than a wrong `projectId` → `saveMigrationFailed`, as run.ts L110–115), then `readSession`. **No catch around `store.read`** (QA must-fix 1): a missing file is already `null` (`tools/effect-designer/store.ts` L13), and a read that throws is thrown to the caller, never taken as "no save". `keptLine(why)` is the one wording: `The saved game can't be read (<why>). It is kept.` `writeAutosave(store, header, from, to, party)` builds the doc and **checks it with `readSession` before anything else** (QA must-fix 3); a doc the reader refuses (empty `members`, hp 0 …) is not written: `Autosave skipped: this game can't be saved (<code>[ <detail>]).` It then reads the slot (a throw rejects, writing nothing) and **refuses to overwrite on any refusal** with `Autosave skipped: ` + `keptLine(code)`; otherwise it writes through `commitWrites`.
   - `test-launch.ts`: `Next = (from, link, party) => …`; `play()` passes `(from, link, party) => arriveIn(parsed.files, stageOf(from), link.to, party)`. `LaunchBag.resume?: SessionSave` goes through `settleSession` (stage and unit ids from the files, start = `startOf(files) ?? stages[0]`) and opens `arriveIn(files, kept.from, kept.to, kept.party)`; a good launch returns the `saveRefDropped` notes.
   - `home.ts`: `travel(link, party)` calls `next`; on success, if `link.autosave`, `autosave(link, party)` writes the slot with `projectHash: rev:<rev>`. **Nothing fails silently** (QA must-fix 2): a refused write's message goes to `state.banner`, and `autosave(…)` is called with `.catch` (no `void`), so a rejection (the read throwing, or `commitWrites` throwing at store.ts L22) sets `state.banner` to `Autosave skipped (<error>). The saved game is kept.` `openId` (after the project parses, with its rev) reads the slot with `.catch`; a refused slot or a read that throws sets the banner to `keptLine(<code or error>)` (after the read-only line, if any) and **the project still opens**, with no Continue. `openId` and a good write set `resume`; the project screen shows **Continue** (`data-act="continue"`) when there is one, and `continue` calls `beginTest(undefined, resume)`. After a resume, any mismatch or dropped-ref notes become one banner: `Continued. Since the save: the project changed; TileEngine changed; dropped unitId …`.
   - `stage.ts`: the linked-tile sheet shows **Autosave here: Off/On** (`s:autosave`, `aria-pressed`) above Remove link; one tap commits `setAutosave` (one undo step).
   - `rooms.ts`: the stage menu shows **Game starts here** (`r:start`), committed with `setStart` and the usual Changed · Undo toast.
5. **Pure editor helpers:** `setAutosave(stage, c, r, on)` in `src/editor/stage/links.ts`; `startOf(files)` and `setStart(files, stageId)` (a non-live stage is a no-op) in `src/editor/stage/rooms.ts`. `deleteStage` refuses the start stage with `The game starts here. Pick another start first.` before the link check.
6. **Reader:** `readStage` keeps `autosave: true` (drops absent/false); `readManifest` reads `session`; `refs()` adds the `session.start` brokenRef line.
7. **Stair phone check** (`tools/baseline/`; data only, no game rule):
   - Fixture `fixtures/shop-stairs/` (3 one-line JSON files, new folder): `project.json` (two stages, the checkpoint's army setup and hero), stage `…ES…01` "Shop floor" and `…ES…02` "Upstairs" on the checkpoint's map, no enemies, spawn 0,4 and stairs at 1,4 each way (row 4 sits below the readout on a phone). It lives outside `tools/baseline/` because `baseline-page.test.ts` L11 bans `formatVersion` text there.
   - `checkpoint.ts`: `shopFiles()` (the checkpoint files minus its stage, plus the fixture) and `openShop()`.
   - `page.ts`: `?scene=shop` opens the shop and passes a `travel` that records the swap at the current gap index, rebuilds `#board` and `#hud`, and calls `startMatch(arriveIn(shopFiles(), from, to, party).docs, …, travel)`. The default scene still calls `startMatch(opened.docs)`; the host-rAF wrapper is untouched (2 `requestAnimationFrame` hits).
   - `readout.ts`: optional `swaps` and `scene`. With `swaps`, two rows follow the GC line: `stage changes N` and `worst ms in 3 frames after a swap X` (the max of the 3 gaps from each swap index). The title shows the scene (`Shop stairs (?scene=shop)`); every other line is unchanged, and the post-swap gaps stay in the p50/p95/max/dropped/over-50 counts.
8. **Keys:** `Object.hasOwn` and `Object.create(null)` for hp keyed by `unitId`; a `Set` of `"c,r"` strings for taken cells.
9. One clock: no new rAF, timer or loop (the baseline's travel rides the driver's own landing). UNIT and TILE stay the only targeting pipes. Don't touch `tools/painter-proto/` or `tools/ui-shell/`. No new dependency; works offline.

## Build (caps are counted lines, insertions + deletions)
| File | Job | Part | Trial | Cap |
|---|---|---|---|---|
| `src/types/core-types.ts` | DSK's staged CN, byte for byte (Data) | 8a | 6 | 6 |
| `tests/smoke.test.ts` | the core-types pin `fd27de06…` → `439f403d…` | 8a | 2 | 2 |
| `src/project/read/stage.ts` | `autosave` in `links()` (Rules 6) | 8a | 2 | 2 |
| `src/project/read/manifest.ts` | `session` (Rules 6) | 8a | 5 | 6 |
| `src/project/load/read-project.ts` | `session.start` brokenRef (Rules 6) | 8a | 1 | 1 |
| `src/project/read/session.ts` | new: reader, settle, version helper (Rules 3) | 8a | 37 | 38 |
| `src/sim/migrations/save/index.ts` | the required `session-save` registry key (Rules 3) | 8a | 7 | 8 |
| `tests/sim/trusted-saves.test.ts` | L36–37 (key list, empty-chain sum) and the `"session-save": {}` in the L41, L47 and L55 literals only | 8a | 10 | 10 |
| `src/rules/session/links.ts` | `arrival` fill, `autosaves`, `LinkEvent.autosave` (Rules 1) | 8a | 20 | 21 |
| `src/rules/session/party.ts` | new: `partyOf` (no hp default), `carryInto` (Rules 1) | 8a | 18 | 19 |
| `src/rules/battle/battle.ts` | `carry` (Rules 1) | 8a | 10 | 11 |
| `src/rules/levels/levels.ts` | `start` with banked and offer, depth 4 (Rules 1) | 8a | 11 | 12 |
| `src/rules/levels/types.ts` | `LevelSetup.start?` | 8a | 3 | 3 |
| `src/editor/stage/links.ts` | `setAutosave` (Rules 5) | 8a | 2 | 2 |
| `src/editor/stage/rooms.ts` | `startOf`, `setStart`, delete refusal (Rules 5) | 8a | 6 | 7 |
| `tools/play-stage/match.ts` | contest flag, `stage id` throw, `party()` with no rules default (Rules 2) | 8a | 6 | 7 |
| `tools/play-stage/page.ts` | `travel(link, party)` (Rules 2) | 8a | 5 | 5 |
| `tools/play-stage/project.ts` | `arriveIn` (free cells, carry, null `from`), session start (Rules 2) | 8a | 28 | 29 |
| `tools/maker/session.ts` | new: the slot, migrate first, check before write, refuse-overwrite, no read catch (Rules 4) | 8a | 25 | 26 |
| `tools/maker/test-launch.ts` | `Next`, `resume` with settle and notes (Rules 4) | 8a | 18 | 19 |
| `tools/maker/home.ts` | autosave on travel with `.catch`, banners, Continue, open-time slot banner (Rules 4) | 8a | 27 | 28 |
| `tools/maker/stage.ts` | Autosave here toggle (Rules 4) | 8a | 5 | 5 |
| `tools/maker/rooms.ts` | Game starts here (Rules 4) | 8a | 5 | 5 |
| `tools/baseline/checkpoint.ts` | `shopFiles`, `openShop` (Rules 7; the tests' fixture) | 8a | 9 | 9 |
| `fixtures/shop-stairs/**` | new: 3 one-line JSON files (Rules 7) | 8a | 3 | 3 |
| `tests/tools/stage-links.test.ts` | the 5 `arriveIn` call sites (only those lines) | 8a | 11 | 11 |
| `tests/tools/autosave-links.test.ts` | new: named tests 1–5, 7–9 | 8a | 101 | 103 |
| `tools/baseline/page.ts` | `?scene=shop`, travel, swap marks (Rules 7) | 8b | 15 | 18 |
| `tools/baseline/readout.ts` | the two rows, scene title (Rules 7) | 8b | 5 | 6 |
| `tests/tools/autosave-links.test.ts` | named test 6 and its `readout` import (L14) | 8b | 8 | 10 |
| `handoff/steps/tests/s8-autosave-links/smoke.mjs` | new smoke (**own cap, outside the 400**); shots to `handback/<part>/<rN>/` (args 3–4, default `r1`, `step-08a-autosave-links`) | 8a | 44 | 55 |

**Count command:** `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!handoff/steps/tests/s8-autosave-links/**'`.
- Hard gate: **400** per part. As one step the trial used **411** (31 files, 338 +, 73 −) and the caps sum to **432**: over, hence Split. **8a: trial 383 (29 files, 317 +, 66 −), caps 398. 8b: trial 28 (3 files), caps 34.** 8a was also built alone in its own worktree (page.ts and readout.ts at base, test 6 and its import removed) and counted there.
- Going over any one cap is stop-and-report, not a quiet overrun.
- Lines are long, in house style. Don't wrap or split lines to dodge a cap, and don't join lines to fit one.

## Named tests (all in `tests/tools/autosave-links.test.ts`; DOM-free imports only)
Fixture: `shopFiles()` (S1 "Shop floor", S2 "Upstairs", hero `unit_01M81X2B…`, raider `unit_01M81X2P…`), plus `memoryStore()`. Moves use moveMs 200 with the clock ticked.
1. **`step 8 party: hp and the side bar cross a link, capped at max; dead members and second copies stay behind; a kept offer is open again`**: `arriveIn(S1→S2)` with hero hp 2 starts the hero at 2; hp max + 50 starts at max; `carry` hp 0 makes `createMatch` throw `createBattle: bad setup`. `partyOf` keeps the first living copy of each `unitId` as `{unitId, hp}` and the side bar with `banked` and `offer`. `createLevels` with `start` (banked 2, offer `["y"]`) seeds the bar and `offer("player")` is `["y"]`; a negative xp or a non-string offer throws `bad start`. `partyOf` with a living unit and no hp throws `partyOf: no hp`.
2. **`step 8 occupied arrival: taken or closed cells are skipped and the party fills the nearest free cells, N E S W`**: unit cases on a 4 × 4 with 2,1 closed (`[2,2 ; 3,2 ; 2,3]`; a closed back cell falls to the spawn). In the shop, a raider on S2's stairs and a two-unit party (hero and raider unitIds): both are placed (`0,4` and `1,3`) and the raider stays.
3. **`step 8 autosave: only an autosave link outside a battle saves; the session save round-trips; nothing is written over a refused or unreadable file, or for a party the reader refuses`**: `autosaves` truth table; a real walk onto the stairs gives `autosave: true` on the free-roam floor and `false` with an enemy on it. `writeAutosave` then `readAutosave` round-trips, writing nothing under `tileengine/projects/`. A stored v2 save and a stored unparsable file are each **left byte for byte** by the next autosave; a readable save with another rev is overwritten. **A slot read that throws** (a store whose `read` throws for the slot path, v2 file in it) makes `writeAutosave` reject and leaves the file byte for byte. **`members: []`** returns `ok: false` and writes no file, and the next good write is ok. A failing write returns `ok: false`.
4. **`step 8 session start: read and checked, a new game starts there, and the start stage can't be deleted`**: `setStart(S2)` reads back through `readManifest`; `openProject` with no stage id opens S2; `deleteStage(S2)` refuses with the start message; `setStart` on an unknown id is a no-op; `setStart(S1)` writes `start` even though S1 is `stages[0]`; a dangling start gives `brokenRef` at `project.json#/project/session/start`; `start: 3` fails `readManifest`.
5. **`step 8 link sheet: autosave on writes true, off drops the key, and readStage keeps it`**: `setAutosave` on/off; `readStage` keeps `autosave: true`; `autosave: "yes"` fails the stage read.
6. **`step 8 baseline ?scene=shop: two floors joined by stairs, and the readout adds stage changes and the worst post-swap frame`**: `openShop()` opens with no error and no contest; the two stairs entries point at each other; the readout with `swaps [2, 5]` over `[16,16,40,61,16,16,30]` ends `stage changes 2` / `… after a swap 61.0`, still counts the 61 in `over 50 ms 1 of 7`; without `swaps` there are no extra rows.
7. **`step 8 link event: a stage with no string id throws instead of sending an empty from`**: a match whose stage id is changed to 7 after it opens throws `play: stage id` on the landing; `arriveIn(files, "", …)` throws the same.
8. **`step 8 link rebuild with the party carry and the autosave write fits the step 7 budget`**: `arriveIn` + `createMatch` + `scene()` + `writeAutosave` (memory store), 25 runs, the first 5 dropped. The median is **< 4 ms**, the same bar as step 7 test 2 (roadmap L83 "with the autosave"). First draw is the phone check.
9. **`step 8 session save (D28): v1 only, migrated first by migrateSave, mismatches are notices, bad parties refused, dangling refs dropped`**: `readSession` gives `saveFormatOlder` for v0 and `saveFormatNewer` for v2; another `projectId` = `invalidValue` detail `projectId`; another rev and engine = ok with `saveProjectMismatch`, `saveEngineMismatch`; an empty, duplicate, hp 0 or hp 1.5 `members` = refused. A v0 file in the slot: `readAutosave` with no step = `saveFormatOlder`; with a test `chains` v0 step (old party shape → new) = ok through the real `migrateSave`; a throwing step = `saveMigrationFailed`. `settleSession` with a lost `to`, a lost `from` and a lost member gives `to` = start, `from` = null, the member dropped, and three `saveRefDropped` notes; `arriveIn` with that lands the hero on the spawn `0,4`.

Step 7's six tests must still pass; only their `arriveIn` call sites change (Build table). In 8a, named test 6 (and its `readout` import) moves to 8b and the rest keep their numbers.

## Smoke (`handoff/steps/tests/s8-autosave-links/smoke.mjs`, port 8810)
`PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r<N>` (8a). The optional 4th argument is the handback part (default `step-08a-autosave-links`).
- Copy the s7 head and helpers (L1–29): dev `build()` from `tools/maker/build.ts`, a static server on 127.0.0.1, and `tap` / `press` / `waitText` / `see` / `step` / `hero` / `go` / `landed`. Drop s7's resize-listener init script (L22).
- Widths 390 and 360 (height 844, `isMobile`, `hasTouch`), each in a fresh context (fresh storage). `page.waitForFunction` for every wait; never `waitForTimeout`. Collect `pageerror` **and** console errors. Screenshots go to `handback/<part>/r<N>/` at 390, so 8a's land in `handback/step-08a-autosave-links/r<N>/`.
- Wait for each sheet's title before tapping inside it (a tap during the sheet's first frame is lost).
- The project screen's rooms toast covers **Test** for its 6 s; wait for `.toast` to clear before tapping Test there. (The stage screen's link toast stays up; don't wait on it.)

The checks, one `ok`/`FAIL` line each:
1. **new**: New project → Continue → Create (Demo); "Demo stage" shows.
2. **upstairs**: `r:add` → `r:use:map_01JDAM…01` gives 54 cells and a new `?stage=` id.
3. **stairs down, autosave on**: on the new stage, tile 3,7 → Your team start; tile 2,7 → Stairs → Demo stage; the 2,7 sheet shows "Autosave here: Off"; `s:autosave` sets `aria-pressed="true"` and "Autosave here: On". Shot `01-autosave-on`.
4. **game starts upstairs, stairs up**: back; the new stage's menu → Game starts here; on Demo stage, tile 0,7 → stairs to the new stage.
5. **start can't be deleted**: the new stage's menu → Delete shows "The game starts here. Pick another start first." Shot `02-start-refusal`.
6. **test starts upstairs, stairs autosave**: Test from the **project screen** opens the new stage (`__docs.stage.id`), the hero at 3,7 moves to 2,7, and the party lands on Demo stage at 0,7. Shot `03-downstairs`.
7. **continue**: Back to maker shows **Continue**; it opens Demo stage with the hero on 0,7. Shot `04-continue`.
8. **targets**: no visible `button` or `input` under 48 × 48 px in any sheet the flow opens, or Continue.

End with `SMOKE PASS`. **Also run** the S0 touch smoke (`handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`), frozen and unedited at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, because play-stage changes. **And the export audit:** a release `tools/play-stage/build.ts` build, the baseline build and the maker build's `play-stage/` tree contain no `tools/maker`, `src/editor`, `tileengine/saves` or `session-save` text and no `catalogue.json.js` / `behaviours.json` file (the trial's script: `/workspace/share/s8/s8-audit.mjs <worktree>`). Paste the command and the empty hit list.

## Must NOT
- No edit to `src/core`, `data/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`; in `src/sim`, only the required registry key in `src/sim/migrations/save/index.ts` (no `?? {}` fallback); in `fixtures/`, only the new `shop-stairs/` folder. `src/types/core-types.ts` changes **only** by DSK's staged diff (result `439f403d…`). No edit to an existing test or frozen smoke except the pin line in `tests/smoke.test.ts`, L36–37 and the L41/L47/L55 literals of `tests/sim/trusted-saves.test.ts` and the `arriveIn` call sites in `tests/tools/stage-links.test.ts`.
- No game words ("shop", "home") in `src/` or `tools/play-stage/`. No second rAF, timer or loop. No `tools/maker` import from `tools/play-stage/`. No second `JSON.parse` in the maker; no `formatVersion` or `kind ===` in `tools/maker/`, `tools/play-stage/`, `src/project/load/` or `tools/baseline/`.
- No new report or refusal code. No formatVersion bump. No save inside `tileengine/projects/` or the export. No silent save failure: no `void` on a promise that can reject, no `catch` that turns a read error into "no save". No write of a doc `readSession` refuses. No default (`?? []`, `?? 0`) for hp or rules in the party read; an absent `levels` (`null`, `src/sim/types.ts` L50) is no bar. No autosave mid-battle. No overwrite of a file the reader refused. No migration inside `readSession`. No second definition of `SessionSave` / `SessionParty`.
- No pre-warming of the next stage. No baseline publish or gh-pages push by the builder.

## Done when, 8a (`step/step-08a-autosave-links-r<N>-chatA`, handback `handback/step-08a-autosave-links/r<N>/`)
- **Gates:** `npm ci && npm run green` exits 0 at **1122** or more, with `one-parser.test.ts` and `baseline-page.test.ts` unedited. `npx tsc --noEmit -p tools/tsconfig.json` adds no error (the base has 3: `tools/maker/home.ts` ×2, which move from L78 to L89 with this step, and `tools/effect-designer/page.ts` ×1; leave them). Quote the count command; 8a's total must be 400 or less with every 8a cap kept.
- **§ Green:** the `ℹ tests / pass / fail` lines, named tests 1–5 and 7–9 (8 ✔ lines), step 7's 6 ✔ lines, and the core-types sha, with test 8's median printed once.
- **§ Smoke:** s8 (`smoke.mjs . 8810 r<N>`), 16 ok lines and `SMOKE PASS`. S0, 14 ok lines and `TOUCH SMOKE PASS`. **§ Export audit:** the command and the empty hit list.
- **§ Screenshots:** the four 390 shots, in `handback/step-08a-autosave-links/r<N>/`.

## Done when, 8b (`step/step-08b-stair-baseline-r<N>-chatA` from 8a's merge, handback `handback/step-08b-stair-baseline/r<N>/`)
- **Gates:** `npm ci && npm run green` exits 0 at **8a's merged count + 1** (1123 if 8a lands at 1122), the same unedited tests and tsc rule. 8b's total (count command from 8a's merge) must be 400 or less with every 8b cap kept.
- **§ Green:** the `ℹ tests / pass / fail` lines and named test 6's ✔ line.
- **§ Smoke:** 8b has **no new smoke**; it reuses the s8 smoke and S0 unchanged, plus test 6. Run `smoke.mjs . 8810 r<N> step-08b-stair-baseline` (16 ok, `SMOKE PASS`; its shots go to 8b's folder and are not committed) and S0 (14 ok). **§ Export audit:** rerun, empty hit list (8b changes the baseline build).
- **Not the builder's gate: the stair phone check, after 8b merges.** CoS serves the baseline build at `?scene=shop` on the S21 Ultra and the Red Magic 9 Pro; the CEO walks the stairs (tap the hero on 0,4, then the stairs on 1,4; on the other floor, step off and back) at least 10 times, and CoS reads the DONE readout. It passes on the rules in `docs/qa/baseline-06c-phones.md` L31 (sha256 `37b95e53…`): p95 at or under 16.7 ms, no dropped frame, **no frame over 50 ms, counting every frame after a swap** (so `worst ms in 3 frames after a swap` must be ≤ 50 and `stage changes` ≥ 10), and no heap growth the new content doesn't explain. If it misses, pre-warm per roadmap L83 (adjacent stages only, discardable) in a follow-up, not here.

## Measured (trial run, 2026-11-23, r3)
Fresh `/tmp` worktrees of **`e801c78d`**, never committed or pushed. `/workspace/share/s8/s8-trial.patch` is 8a + 8b; `/workspace/share/s8/s8a-trial.patch` is 8a alone. Both exclude `handback/`, apply cleanly to `e801c78d` and to main `29f972f2`, and give `core-types.ts` `439f403d…`.
- Base: 1114 pass, 0 fail.
- **8a alone:** `npm ci && npm run green` exits 0 with **1122 pass, 0 fail**; tsc shows only the 3 base errors. Count 29 files, **317 +, 66 −** (383). s8 smoke 16 ok, `SMOKE PASS` (shots in `handback/step-08a-autosave-links/r1/`); S0 `TOUCH SMOKE PASS`; export audit `AUDIT PASS`.
- **8a + 8b:** green exits 0 with **1123 pass, 0 fail**, depcruise clean (176 modules, 499 dependencies), check:state / check:law OK, eslint clean, tsc 3 base errors. Count 31 files, **338 +, 73 −** (411). s8 smoke on 8810: 8/8 at 390 and 8/8 at 360, `SMOKE PASS` (also with the 8b folder argument). S0 on 8797 (sha `d528795e…` checked): 7/7 at each width, `TOUCH SMOKE PASS`. Export audit: no hits (131 / 145 / 142 files), `AUDIT PASS`.
- Rebuild with carry and autosave (test 8's body, now with the check before write): median **1.17–1.19 ms** over 3 runs on the box (Node 24.22.1).
- Baseline `?scene=shop` in headless Chrome at 390, 2 runs: `stage changes 1`, `worst ms in 3 frames after a swap 16.7`, p95 16.7–16.8, max 33.3, 0 over 50 ms, no page error. Box numbers, not the phone gate.

## Carries
**Due in step 8, all included above:**
- **Party state across a link** (rebuild 07 L249; step 7 guide L226): Rules 1–2, tests 1 and 9, in the D28 (4) shape.
- **Occupied arrival cell** (rebuild 07 L250; guide L227): Rules 1–2, test 2. `units.ts` L41 and `world.ts` L59 stay as they are; the fill happens before placement.
- **Link mid-battle** (rebuild 07 L251; guide L228): a retreat with no autosave (Rules 1), test 3. EA's Q7 ruling, recorded in D28: no data change; the slot keeps the last safe-point save.
- **`match.ts:80` `""` as `from`** (rebuild 07 L248, L187), and the same fallback at `project.ts:94`: both now throw `play: stage id` (Rules 2), test 7. A dropped `from` (D28) is `null`, never `""`.
- **QA cite nits** (rebuild 07 L256): `raf-driver.ts` `dispose()` is **L97–101** and `board.ts` `sync` is **L83–95**, both verified on `e801c78d` (Read first 5).

**New carries from this step:**
- Unit-mode level bars (`bar: "unit"`) and per-instance hp don't carry; they wait for instance ids that survive a stage change, as a v2 with the first real migration step (D28 (4)).
- The re-offered pick has no UI in the play stage yet: the offer is open in `levels` but nothing shows it until the pick UI lands.
- The play stage still logs `"demo"` as its command-log `projectHash` until step 24 (D28 (1)).
- No purge exists; when one lands it removes `saves/<projectId>/` after the project folder (D28 (2)). Start fresh (`autosave.backup-<savedAt>.json`) comes with the load menu.
- Mismatch and dropped-ref notices show as one banner on the project screen after a Continue, not inside the play stage.
- Continue sits after the Maps list, not next to Test.

**Not due in step 8, listed so nothing is lost:**
- `catalogue.ts` regen to rev 30: "its own run" (rebuild 06c L216).
- `tools/host-example/match-picture.ts:17` `["player","wolves"]`: ruled in S0b as a hand-run host example (step 00b L114).
- D22 effect ids: step 10. The 16 demo fixture `.json.js` files in the baseline build: export work, step 11.
- The 4a/4b/4c standing carries: uncapped stage undo, the maker-law plant try/finally, talk `createdAt`, the session-only unused delete, Path and Dirt hidden, `chosen()` at `stage.ts:35-41`. The dpr carry.

## DSK questions (closed by D28, rulings L76 on `e801c78`)
1. **Session-save kind and shape:** its own kind, `SaveHeader` reused, `projectHash` = `rev:<project.rev>` for equality only; `projectId` ≠ slot = `invalidValue`; rev/engine differences are notices; dangling refs dropped with `saveRefDropped` (Data).
2. **Slot:** one per project at `tileengine/saves/<projectId>/autosave.json`; not trashed, copied or exported; a refused file is never overwritten (Data, Rules 4).
3. **Start field:** `project.session?: {start}` as proposed; always written from Game starts here, never removed; Continue uses `to` (Data).
4. **Party:** `{side, members: {unitId, hp}[], bar}` with `banked` and `offer`; EA re-offers the kept offer on arrival (Rules 1).
5. **CN:** DSK's staged diff, result `439f403d…`, pinned (Data).
6. **Migration home:** the registry key in `src/sim/migrations/save/`; the maker migrates, the reader never does (Rules 3).
7. **Mid-battle:** a retreat writes nothing (EA, recorded in D28).
