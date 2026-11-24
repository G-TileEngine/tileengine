# Step 09a: map backgrounds from project data (art, data + rule)

r2, 2026-11-24, Engine Architect (r1 + DSK D29 90df966c + QA review `docs/qa/step-09a-guide-review.md` 07a6b2fe: the Law 12 must-fix and the two notes). One builder run (ChatA) and one QA review, with gates on. Roadmap r15 row 9 (MS-20, "Art and backgrounds upload") is **split** by the roadmap's own rule (L70: a row over 400 lines splits into "a: data + rule" and "b: editor"). This guide is **9a**: the map background read from project data, checked, and drawn in Test, with no upload screen. **9b** (the upload flow in the maker) is the next go-line after 9a merges; no other row goes between them. Every number below comes from a trial run on `8ab22996` (see Measured).

Step id: `step-09-art-backgrounds`. Revision: r2, then r3 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `8ab229961bbb008ee937aa6cd64d9b747fb3b22d` (`8ab2299 docs(dsk): D29 phase1 ruling for step 9`). It is docs only over r1's base `053817f9`: `236ad42` adds `docs/qa/baseline-08b-postpublish.md` (16 lines) and `8ab2299` adds D29 (1 line) to `handoff/dsk-rulings/2026-11-17-phase1.md`. Checked on `origin/main` in a fresh `/tmp` clone. If CoS names a later main in the go-line, use that main and its test count.
**Authority for the new codes:** D29, `handoff/dsk-rulings/2026-11-17-phase1.md` L77 at `8ab22996` (file sha256 `90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8`, 77 lines). project-format r41, which lists them in §13, is not on main yet; until it is, D29 is the citation.
**Test floor:** **1125 + 9 = 1134.** The base measures 1125 pass, 0 fail (`npm run green`, exit 0). N = 9 (named tests 1–9 below).
**Needs:** step 4 (MS-03, merged) and step 8b (merged). **Blocks:** 9b (art upload editor); step 11 (export MVP) ships the assets 9a reads.
**Smoke:** new, `handoff/steps/tests/s9-art-backgrounds/smoke.mjs`, port **8811**.

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-09-art-backgrounds-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-09-art-backgrounds/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green, § Smoke and § Export audit. Label the **Code head** apart from the docs-only **tip**. Don't commit a raw test log or the smoke's shots.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words:
- A map can have a **painted background**: one or more pictures listed in the map's `background.layers`, each one an asset in `project.assets` with its file in the project's `assets/` folder. When you press Test, the picture is drawn under the board, at its own size from the map's top-left corner, never stretched or blurred.
- The project check catches a background that names an asset the project doesn't have (hard: Test is blocked with the usual "Can't play yet" sheet), and warns on more than 3 layers or a depth outside 0..1. Settings that need Advanced render get an info row and are read as the safe value.
- **Asset files are checked (D29):** a file that is missing, or whose bytes don't hash to its id, blocks Test when a stage uses it (H4), naming the file; an unused one only warns.
- **Nothing fails silently (Law 12):** a background file that can't be opened in Test (missing, or not a picture) is named in the play stage's note row and counted as failed. **If no background layer drew, plain floor cells draw as normal**, so the board is never blank.
- Picture files are bytes, not text, so the maker's text reader leaves `assets/` alone, the maker can read a file's bytes, and Delete/Restore moves the pictures with the project.
- **Carry folded in:** autosaves at links run one at a time, and each reads the save slot once.

**Not in 9a:** the upload screen, Shrink to fit, the Depth slider, the upload type check (all 9b); tile sheets, sprites, objects and wall looks from assets; drawing `fit` cover/stretch and the advanced path; the background `colour`; Duplicate copying pictures (9b, with the upload's byte writer); shipping assets in an export (step 11).

## Read first (lines checked on `8ab22996`)
1. Format (DSK-owned; no change in 9a), `docs/maker/data/project-format.md`:
   - L295: `assets/<assetId>.<ext>`, content-addressed; L298: ids are `asset_<first 16 hex of sha256(bytes)>`.
   - L415–447 §6.2 `AssetMeta`: `name`, `ext`, `origin` (`upload {fileName}`), `kind` (`background` is a picker hint; any image kind may be a background). Size is computed, never stored (L443).
   - L894 `background = {colour?, layers: BackgroundLayer[]}`, `BackgroundLayer = {assetId, depth, repeat: none|x|y|both, fit?}`; L899–907 layers drawn first = farthest, under every tile layer; soft cap 3 → `overCap` warning, nothing truncated; L912–924 fit `none` (default) = native size from the top-left, never stretched; L233 and L1692: cover/stretch read as `none` while `advancedRender` is off.
   - L1023 draw order: background layers → tile layers → walls → units/objects → `aboveUnits` layers.
   - L1674 H3 `brokenRef` reaches `background.layers[].assetId`; L1675 H4 "an asset or page file is missing, or its hash ≠ its id"; L1735 `depth` outside 0..1 is drawn clamped (warning).
2. D29 (`handoff/dsk-rulings/2026-11-17-phase1.md` L77): (1) `advancedRenderInactive` info, one row per stored field, detail `{field, path}`, never rewritten; (2) `assetFileMissing {assetId, path}` and `assetHashMismatch {assetId}`, H4 (hard) when a selected stage uses the asset, else a warning with the index entry kept; 9a may skip the layer but must raise the row; (3) uploads (9b); (4) bare floor is a draw rule, UX owns the look; (5) `notPlaced`.
3. Reader: `src/project/load/read-project.ts` L19–21 `has()` (`brokenRef`, hard), L23–41 `refs()`, L48–74 `warns()` (map loop L70–73). `src/editor/project/test-gate.ts` L4–13 `SAY` (hard-code sentences), L14 `sentence`, L22–26 `testGate`.
4. Render: `src/runtime/render/types.ts` L25 `RenderScene`; `draw-list.ts` L17–29 `buildDrawList` / `push` (cull + `toDevice`, whole art px), L48 `cells(scene.ground)`; `chunk-plan.ts` L9–38 (calls `buildDrawList` four times with `...scene`, and bakes ground chunks first).
5. Play stage: `tools/play-stage/load.ts` L23 `PlayDocs`; `project.ts` L51–80 `playDocsOf` (L78 `win`/`levels`); `looks.ts` L45–47 `dress` (every cell gets a stand-in ground tile); `board.ts` L78 `dress(world.grid, body.looks)`, L119–120 the returned object, L136 `layers: looks.layers`; `page.ts` L31–39 `load(id)`, L51 `hud.render(match.view())`, L52 the view's `scene`; the 8b `#note` row (`hud.ts` L13, L37).
6. Driver: `src/runtime/host/raf-driver.ts` L30 `stats` (`failed`), L45 lazy `load` per id; L77 a new `view.scene` object bumps `rev` and redraws (so the merged scene must be memoised, or every frame redraws).
7. Maker: `tools/maker/store.ts` L2 `MakerStore`, L8 `memoryStore`, L12 `makerStore`, L14–18 `readTree` (reads every file as text), L26–31 `movePrefix` (Delete/Restore; text only); `tools/maker/test-launch.ts` L27–37 `play()` (L30 the gate, L35 `input.start`); `tools/maker/session.ts` L16–22 `writeAutosave` (L19 reads the slot, then `readAutosave` L9–15 reads it again); `tools/maker/home.ts` L58 `saveTrip` (fire-and-forget, so two links can overlap).
8. Source doc: roadmap L84 names `ux/art-upload.md`; on main that file is a pointer (moved to the private repo on 2026-11-19 at the CEO's request, sha256 `8c1c164a…`). The builder doesn't need it: this guide, project-format and D29 are the whole brief for 9a.

## Rules
1. **Reader checks** (`read-project.ts`):
   - In `refs()`: every `maps/*.json` `background.layers[i].assetId` must be a key of `project.assets`, else `brokenRef` hard at `maps/<id>.json#/background/layers/<i>/assetId` (detail = the id). Reuse `has()`.
   - In `warns()`, per map: more than 3 layers → `overCap` warning at `…#/background/layers` (detail = the count); a numeric `depth` < 0 or > 1 → `outOfRange` warning at `…/layers/<i>/depth`.
   - **D29 (1):** while `settings.advancedRender` isn't `true`: a stored `settings.camera.pixelPerfect: false` → `advancedRenderInactive` info at `project.json#/project/settings/camera/pixelPerfect`, detail `pixelPerfect`; a layer `fit` of `cover`/`stretch` → the same code at `maps/<id>.json#/background/layers/<i>/fit`, detail `fit`. One row per stored field. The reader resolves them as true / `none` and never rewrites the stored value.
2. **Look reader** (new `tools/play-stage/backdrop.ts`, ≤ 20 lines): `backdropOf(project, map)` → `BackLayer[] = {assetId, file: "assets/<id>.<ext>", depth, repeat}` in file order. Depth clamps to 0..1 (absent or not finite = 1); `repeat` not one of the four = `none`; `fit` is ignored (cover/stretch read as `none`); a layer whose asset has no `ext` is skipped. `playDocsOf` adds `backdrop` only when non-empty; `PlayDocs` gains `backdrop?` and `art?: (file) => Promise<Blob | null>`. This is look data: nothing in `src/core`, `src/sim` or `src/rules` reads it.
3. **Engine rule, draw** (`src/runtime/render`): `RenderScene.backdrop?: Backdrop[]`, `Backdrop = {sheet, depth, repeat}` (exported from `index.ts`). `buildDrawList` draws each layer **before** `cells(scene.ground)`, band `base`, through `push` (so it culls and lands on whole device px): origin x = `floor(viewX0 × (1 − depth))` (same for y), so depth 1 moves with the map and 0 stays on screen; `repeat` x/y/both tiles copies across the view on that axis; a zero-size sheet draws nothing. `chunkedList` draws the backdrop **once, first**, and strips it from its other `buildDrawList` calls.
4. **Play stage** (`page.ts`): for each `docs.backdrop` layer, `docs.art(file)` → `createImageBitmap` → an `OffscreenCanvas` kept by asset id; `load(id)` returns it first. When the decodes settle, the decoded layers (sheet size = image size) join the scene. Memoise the merged scene on the link's scene object, so it is a new object only when the link's scene or the layer list changes (driver L77). No new rAF, timer or loop.
   - **Law 12 (QA must-fix):** a layer that doesn't draw is never dropped silently. `art()` returning null → the note line `Background picture missing: <file>`; a `createImageBitmap` rejection (the file exists but isn't a picture) → `Background picture <file> couldn't be opened`. Each adds 1 to the driver's `stats.failed` and a line in the 8b `#note` row (after the bench note, if any). No new reader code: a file that exists and hashes to its id but won't decode has no D29 code, and it needs none (it's a play-time notice, not a load-time row).
5. **Floor rule** (`board.ts`, `looks.ts`): `dress(grid, looks, bare)`. **Plain floor goes bare only when at least one background layer actually drew; if no layer drew (none listed, all missing, or none would open), plain floor cells draw as normal**, so the board is never blank. Water and wall blocks are always dressed. The board starts dressed; `page.ts` calls the board's `bare()` after the decodes settle with at least one layer drawn. D29 (4): a draw rule only, no stored flag; UX owns the look.
6. **Bytes in the maker** (`store.ts`, `test-launch.ts`): `MakerStore.readBlob(path)` (memory store: a Blob of the stored text; OPFS: the file, `null` if missing). `readTree` skips the project's `assets/` folder. `movePrefix` renames each `assets/` file to the destination before it moves the text docs. `play()` passes `art = (file) => store.readBlob(prefix(id) + file)` to `start`, and adds the same `art` to the docs `arriveIn` returns for the next stage.
7. **Carry: autosave** (`session.ts`): `writeAutosave` chains each write on a module promise (a failed write doesn't block the next), so the newest link's save lands last and two writes never share `autosave.json.tmp`; it calls `readAutosave` once instead of `store.read` then `readAutosave`. Same result codes and messages; `home.ts` is unchanged. **`queue = run.catch(() => undefined)` is deliberate: the error still reaches the caller through `run`.** Don't "fix" it.
8. **Asset files, H4 wired** (new `tools/maker/asset-check.ts`, `test-launch.ts`, `test-gate.ts`): `assetRows(store, folder, files)` reads each `project.assets` entry that has an `ext` with `readBlob`: no file → `assetFileMissing`; the sha256 of the bytes doesn't give the id → `assetHashMismatch` (`crypto.subtle`). Row `path` = `assets/<id>.<ext>`, `detail` = the asset id (D29's `{assetId, path}` in the existing `ReportRow` shape). Severity: **hard** when a selected stage uses the asset (`assetsUsed`: `project.stages` minus `render.excludedStages`, their maps' background layers, project-format §9), else **warning**; the index entry is kept. `play()` (now async) adds these rows to the report before `testGate`, so a used missing or changed file blocks Test like `brokenRef`. `SAY` gains the two sentences, and `sentence` appends the row's path for `asset*` codes: "A picture this project uses is missing: assets/…png" / "… doesn't match its file: …". The check runs at Test only; the project screen's problem list doesn't show it yet (9b).

## Build table (trial = counted lines, + and −, on `8ab22996`)
| File | What | Trial | Cap |
|---|---|---|---|
| `src/project/load/read-project.ts` | Rules 1 | 7 | 10 |
| `src/editor/project/test-gate.ts` | Rules 8 sentences | 4 | 5 |
| `src/runtime/render/types.ts`, `index.ts` | `Backdrop`, `RenderScene.backdrop?` (Rules 3) | 6 | 8 |
| `src/runtime/render/draw-list.ts` | backdrop before ground (Rules 3) | 6 | 9 |
| `src/runtime/render/chunk-plan.ts` | once, first (Rules 3) | 8 | 10 |
| `tools/play-stage/backdrop.ts` | new (Rules 2) | 17 | 22 |
| `tools/play-stage/load.ts`, `project.ts` | `PlayDocs` fields, `playDocsOf` (Rules 2) | 8 | 10 |
| `tools/play-stage/page.ts` | decode, Law 12 note + failed, memo, `load` (Rules 4) | 13 | 17 |
| `tools/play-stage/looks.ts`, `board.ts` | `bare`, floor rule (Rules 5) | 12 | 15 |
| `tools/maker/store.ts`, `test-launch.ts` | Rules 6, Rules 8 gate | 17 | 21 |
| `tools/maker/asset-check.ts` | new (Rules 8) | 24 | 30 |
| `tools/maker/session.ts` | Rules 7 | 11 | 14 |
| `tests/editor/art-backgrounds.test.ts` | new, tests 1–9 | 141 | 155 |
| `handoff/steps/tests/s9-art-backgrounds/smoke.mjs` | new smoke, steps 1–6 | 61 | 70 |

**Count command:** `git add -N . && git diff --shortstat <base> -- . ':!handback/**'` (add `':!node_modules'` if it is a symlink).
- Hard gate: **400**. The caps sum to **396**, and the trial used **335** (18 files, 309 +, 26 −).
- Going over any one cap, or the 400 total, is stop-and-report, not a quiet overrun. Lines are long, in house style; don't wrap or split lines to dodge a cap, and don't join lines to fit one.

## Named tests (all in `tests/editor/art-backgrounds.test.ts`; one import per line, DOM-free)
Fixture: `fixtures/demo.tileproj` read from disk as text, with `project.assets = {asset_00112233445566aa: {name, ext: "png", origin: {kind: "upload", fileName}, kind: "background"}}` and the map's `background.layers` set per test; `saved(id, file)` puts that project in a memory store with `assets/<id>.png` (or no file); `idOf(bytes)` = `asset_` + the first 16 hex of sha256. Render scene: 20 × 12 cells of 16 px, one ground layer; `fitView(160, 96, 1, 16, 16)`, camera at 40, 20.
1. **`background refs: a missing asset is brokenRef, out-of-range depth and over 3 layers warn`**: one good layer → ok, empty report; an unknown id → one `brokenRef` hard at `maps/…#/background/layers/0/assetId`; four layers with depths 1.5, −0.25, 1, 1 → still ok, with `overCap` (layers) and two `outOfRange` (depth 0 and 1) warnings, in report order.
2. **`backdropOf keeps file order, clamps depth, defaults repeat, and skips a layer with no asset`**: three layers (depth 2 + repeat x; an unknown id; a jpg with `fit: stretch`) → two entries, depth 1, `repeat` x then none, `file` with each `ext`; `playDocsOf` has no `backdrop` for the plain demo and the layer for the art demo; `dress` on a 2 × 2 grid gives `[0,1,2,0]`, and with `bare` `[null,1,2,null]`.
3. **`draw list: the backdrop draws first, at whole art px, by depth`**: a 64 × 64 layer: depth 1 → first cmd, before the ground, at −40, −20, 64 × 64; depth 0 → 0, 0; depth 0.5 → −20, −10; a 16 px layer out of view → culled; repeat x → dx −40, 24, 88, 152; repeat both → 8 copies; every dx/dy is an integer at depth 0.37.
4. **`chunked list draws the backdrop once, before the ground chunks`**: one `sky` cmd, first, then a `chunk:` cmd; none with an empty list.
5. **`store: readTree skips assets, readBlob reads bytes, trash moves assets`**: memory store; no `assets/` key in `readTree`; `readBlob` reads the bytes, `null` when missing; after `movePrefix` the asset sits under the trash prefix and nothing is left under the live one.
6. **`test launch hands the stage its background and an art reader`**: `saved(idOf("PNGBYTES"), "PNGBYTES")`; `openSaved` → `ok`; the started docs have the `backdrop` and an `art` that reads the bytes.
7. **`autosave: two links in a row write in order, and each write reads the slot once`**: two `writeAutosave` calls at once → both ok, the slot holds the second (`to` = stage_C), the slot was read twice in all (once each), no `.tmp` left. On the base this test fails (the second write's rename loses its `.tmp`).
8. **`asset files (D29): a missing or changed file is H4 when a selected stage uses it, a warning when unused, and Test is refused naming the file`**: no file → `openSaved` not ok, lines `["A picture this project uses is missing: assets/<id>.png"]`; bytes "OTHER" → `["A picture this project uses doesn't match its file: assets/<id>.png"]`; an extra unused asset with no file → `assetRows` gives one `assetFileMissing` **warning** at `assets/<spare>.png`, Test still opens, and `project.json` still lists the spare.
9. **`advancedRenderInactive (D29): one info row per stored field while advanced render is off, and nothing is rewritten`**: a `fit: cover` layer and `camera.pixelPerfect: false` with `advancedRender` false → ok, exactly two info rows (`…/layers/0/fit` detail `fit`; `project.json#/project/settings/camera/pixelPerfect` detail `pixelPerfect`), the parsed files and the texts unchanged; with `advancedRender` true → empty report.

Every existing test passes unedited.

## Smoke and audit
- `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1`, at 390 and 360:
  1. A new demo project.
  2. Test with no background: no magenta or cyan pixels on the board.
  3. The smoke writes a 96 × 144 PNG (left half magenta, right half cyan) into OPFS as `assets/asset_<sha16>.png`, adds its `AssetMeta` and the map layer (depth 1), and reopens `?project=…&stage=…&from=project`. The board shows both colours (≥ 500 px each) and **no blended pixels**, with the driver's `failed` at 0.
  4. The project's `assets/` holds just that file.
  5. **Missing file (QA's repro):** delete that PNG and reopen. Test is refused with "A picture this project uses is missing: assets/asset_<sha16>.png", and no match starts (H4, Rules 8).
  6. **Undecodable file:** the smoke writes bytes that aren't a picture as a new asset whose id is their hash (so the D29 checks pass), points the map at it, and reopens. The `#note` row reads "Background picture assets/asset_<sha16>.png couldn't be opened", `stats.failed` ≥ 1, the scene's ground layer still has dressed floor cells (tile 0), and there are no art pixels.
  The run prints 12 ok lines and `SMOKE PASS`. Shots go to `handback/step-09-art-backgrounds/r1/`; don't commit them.
- The play-stage "missing" note (Rules 4) is reached only when the gate is bypassed (the file disappears between the check and the decode). Both failures go through the same handler, which step 6 covers.
- Regression: s8 `handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1 step-09-art-backgrounds` (sha256 `0de37442…`, unedited): 16 ok, `SMOKE PASS`. S0 `touch-smoke.mjs . 8797` (sha256 `d528795e…`, frozen): 14 ok, `TOUCH SMOKE PASS`.
- Export audit: `/workspace/share/s8/s8-audit.mjs <worktree>` (sha256 `8bfef76b…`) or the same checks by hand: no `tools/maker`, `src/editor`, `tileengine/saves` or `session-save` text in the play-stage trees. Paste the command and the empty hit list.

## Must NOT
- No edit to `src/core`, `src/sim`, `src/types`, `src/rules`, `data/`, `fixtures/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`. No edit to an existing test or smoke.
- No report code beyond D29's (`advancedRenderInactive`, `assetFileMissing`, `assetHashMismatch`) and the existing ones; no formatVersion bump; no field the format doesn't define. If you think you need one, stop and report to EA.
- Nothing ever stretches or blurs art: no non-integer draw path, no `imageSmoothingEnabled = true`, no scaling of the picture. `fit` cover/stretch stays read as `none`.
- No silent skip: every background layer that doesn't draw is in the note row and in `stats.failed`. Never leave the floor bare unless a layer drew.
- No second rAF, timer or loop. No upload UI or byte writes in the maker (9b). No gh-pages push or publish by the builder.

## Done when
- **Gates:** `npm ci && npm run green` exits 0 at **1134** or more. `npx tsc --noEmit -p tools/tsconfig.json` adds no error (the base has 3: `tools/effect-designer/page.ts` L101 and `tools/maker/home.ts` L85 ×2; leave them). Quote the count command; the total must be 400 or less with every cap kept.
- **§ Green:** the `ℹ tests / pass / fail` lines and the ✔ lines of tests 1–9.
- **§ Smoke:** s9, 12 ok and `SMOKE PASS`; s8, 16 ok and `SMOKE PASS`; S0, 14 ok and `TOUCH SMOKE PASS`. **§ Export audit:** the command and the empty hit list.

## Measured (trial run, 2026-11-24, r2)
A `/tmp` worktree at **`8ab22996`**, never committed or pushed. The patch is `/workspace/share/s9/s9-trial.patch` (sha256 `c03df133d04bcbb9a33e19abefd8a73169c5ddc866f2171de1b60d7ae02155a4`, 597 lines; it excludes `handback/`) and applies cleanly to `8ab22996` (a fresh worktree with only the patch: green 1134 / 0, the same count).
- Base: `npm run green` exit 0, **1125 pass, 0 fail**, depcruise clean (176 modules, 500 dependencies), check:law OK.
- With the trial: green exit 0, **1134 pass, 0 fail**, depcruise clean, check:law OK, eslint clean; tsc on `tools/` shows only the 3 base errors.
- Count: 18 files, **309 +, 26 −** (335), per the table.
- s9 smoke on 8811: 12 ok, `SMOKE PASS` (390: 77,824 magenta + 86,528 cyan px, 0 blended; step 5 refused with the file named; step 6 note shown, 47 dressed floor cells, failed 1; 360 the same). s8 smoke on 8810: 16 ok, `SMOKE PASS`. S0 on 8797: `TOUCH SMOKE PASS`. Export audit: `AUDIT PASS` (132 / 146 / 144 files).
- Test 7 run against the base `session.ts`: fails, so the overlap is real.

## Carries
**Closed here:** the double slot read and overlapping autosaves (Rules 7; QA 8a r1/r2, 8b r1 L26, rebuild 8b L195). QA 09a r1 must-fix 1, Law 12 (Rules 4, 5, smoke steps 5–6). DSK Q1–Q4 of r1, by D29.
**Accepted, no code (EA suggestion, user to confirm):** a benched member rejoins only at the next link with room (8b); the walled-off pocket spill (8b); `project.ts` L102 null grid (QA says `openProject` fails on the missing map or terrain anyway).
**For the 9b guide:**
- **D29 (3), uploads:** exactly `png`, `jpg` and `webp`, typed from the sniffed bytes, not the file name; `.jpeg` is stored as `jpg`; an animated PNG/WebP is read as its first frame; anything else (gif, svg, bmp, heic, avif) is refused before any write with `uploadTypeUnsupported {fileName, sniffed}` (an import-time code, outside the load-time H list). The file and its index entry are written in one `commitWrites`, so an import never creates a missing file.
- **Law 13 (QA note):** 9a decodes each layer at full size into an `OffscreenCanvas`, with no pixel cap (`overCap` only counts layers). Only a hand-placed file can reach that before 9b. 9b's upload (Shrink to fit, `maxImageSide`, §6.2 K6/K14) must bound the decoded pixel size.
- Duplicate copies `assets/` (the byte writer arrives with the upload); the project screen shows the Rules 8 rows (today only Test does); the 8b note row's close button, if 9b touches `hud.ts`; resume notes at `openId`'s rev (9b edits `home.ts`).
**Still open, not 9a scope:**
- `levels.ts` L64 unreachable narrowing: the next run that edits `tools/maker/levels.ts`.
- `match.ts:80` `landed('')`: the next run that edits `tools/play-stage/match.ts`.
- The D22 effect id (`effect_<ULID>` vs `setup_<ULID>`): DSK ruled D22–D24 on 2026-11-20; the step 10 guide applies it.
- `catalogue.ts` regen to rev 30: its own run.
- Roadmap r15 docs (UX/CoS): row 7 still says PROPOSED; row 9 should show the 9a/9b split, and its source doc is now a private-repo pointer.
**New from 9a:** the background `colour`, drawing `fit` cover/stretch and `advancedRender` aren't built; the export doesn't ship assets (step 11).

## DSK
D29 answers r1's four questions; 9a applies (1), (2), (4) and records (3) for 9b. **`notPlaced` (D29 5):** §13's row (project-format L1688) is "Enemy `spawns` fewer than `picks` or a wave's count; the extras are skipped". The code is emitted at two places in `src/project/read/placements.ts`: L15 (the enemy pool: the §13 meaning) and L25 (loadout `chosen` past `playerSpawns`, which predates 8b). 8b's bench surfaces the L25 case. The mechanics match (more units than cells, so the extras aren't placed), but the §13 wording names only enemies and says "skipped", while 8b keeps a benched member in the party with its hp. **EA suggestion: no code change.** At r41/r42, DSK widens the row to "… or loadout `chosen` past `playerSpawns`: the extras aren't placed; party members stay in the party (8b)". No question blocks 9a.
