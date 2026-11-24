# Step 09b: background upload editor (art, editor)

r2, 2026-11-24, Engine Architect (r1 + EA rulings Q1 and Q2, 22:47). One builder run (ChatA) and one QA review, with gates on. This is **9b**: the second half of roadmap row 9 (9a, data + rule, merged as `ab64d4fb`). The maker gets a basic **Background** sheet on the stage screen: add a PNG, JPG or WebP picture, see its layer, remove it, and read the project rows for it. Four carries are folded in. Every number below comes from a trial run on `0436fd50` (see Measured). In this guide, rulings from the CoS chat are labelled **EA ruling**, not CEO rulings.

Step id: `step-09b-art-upload`. Guide revision r2; the build is r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `0436fd50069def3705a4fea244e37ecfd83f0aee` (`0436fd5 docs(rebuild): step 8c record + QA review and post-publish check`). It holds 9a (merge `ab64d4fb`, 1134/0) and 8c (merge `cd48ebdc`, 1135/0). Checked in a fresh `/tmp` clone of `origin/main`. If CoS names a later main in the go-line, use that main and its count.
**Authority:** D29, `handoff/dsk-rulings/2026-11-17-phase1.md` L77 (sha256 `90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8`, 77 lines), items (2) and (3). Format: `docs/maker/data/project-format.md` §3.1 L336 (`maxImageSide`), §6.2 L420 (`origin`), L446 (K6), L448 (K14). UX: `ux/art-upload.md` is now a pointer to the private repo; the original is on the box at `/workspace/verify-s1a/docs/maker/ux/art-upload.md` (sha256 `8c1c164a…`, the sha the pointer names), §3.4 L79–85 and the message table L140–150. It is background only; this guide is the brief.
**Test floor:** **1135 + 6 = 1141.** The base measures 1135 pass, 0 fail (`npm run green`, exit 0). N = 6 (named tests 1–6).
**Needs:** 9a (merged). **Blocks:** step 11 (export ships assets).
**Smoke:** new, `handoff/steps/tests/s9b-art-upload/smoke.mjs`, port **8813**. It is counted in the 400, with its own cap.

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-09b-art-upload-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-09b-art-upload/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green (test counts), § Smoke and § Export audit. Label the **Code head** apart from the docs-only **tip**, and give both shas. Don't commit a raw test log or the smoke's shots.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words:
- On a stage, **Background** opens a sheet. **Add picture** takes a PNG, JPG or WebP file. The picture is saved in the project's `assets/` folder, listed in `project.assets`, and added as the map's next background layer. Test then draws it under the board, as 9a does.
- **The type comes from the file's bytes, not its name** (D29 3). A `.jpeg` file is stored as `jpg`. An animated PNG or WebP is accepted and drawn as its first frame. Anything else (GIF, SVG, BMP, HEIC, AVIF, not a picture) is refused before anything is written, and the sheet says what the file looks like.
- **A picture wider or taller than 4096 px is refused at upload**, before anything is decoded or written (Law 13; EA ruling Q1). In Test, a hand-placed file over that size is named in the note row and not decoded.
- The sheet lists the layers by name, with **Remove** (the layer goes; the asset and its file stay). It also shows this map's rows: a missing or changed picture (D29 2: "Test is blocked" when a played stage uses it), more than 3 layers, a scroll speed outside 0–1, and Cover/Stretch needing Advanced render.
- **Duplicate** copies the pictures too.
- **Adding or removing a layer clears the stage's Undo** (EA ruling Q2), so Undo can never bring back a map without the new layer.
- **Folded in:** the play-stage note row gets a close button (8b). **Continue** checks the save against the project as it is now, not as it was when the project opened (8a). Test's background loader closes each bitmap, the in-play "missing" path gets its own test, and the scene keeps one `assets` object between frames (9a carries).

**Not in 9b:** auto-slice into pages (K6), Shrink to fit (K14), crop, pad, zoom, the exact-size check ("Wrong size…"), the Scroll speed slider, the Repeat picker, Cover/Stretch, the 8192 PC toggle, the memory meter, a built-in library, tile sheets and sprites from uploads, and an Undo step for background changes.

## Read first (lines checked on `0436fd50`)
1. D29 (L77): (2) `assetFileMissing {assetId, path}` / `assetHashMismatch {assetId}`, H4 when used, else a warning; (3) exactly `png`, `jpg`, `webp` from sniffed bytes, `.jpeg` → `jpg`, animated → frame 0, else **`uploadTypeUnsupported {fileName, sniffed}`**, an import-time code outside the load-time H list, raised before any write. The file and its index entry are written in one `commitWrites`.
2. 9a's code: `tools/maker/asset-check.ts` L13–25 (`assetRows`, D29 2, already wired into Test); `src/project/load/read-project.ts` L51 and L76–77 (`advancedRenderInactive`, `overCap`, `outOfRange` rows); `src/editor/project/test-gate.ts` L13–16 (`sentence`); `tools/play-stage/backdrop.ts` (`backdropOf`); `tools/play-stage/page.ts` L60–66 (the decode loop).
3. Store: `tools/maker/store.ts` L2 `MakerStore` (text only today), L6–9 `memoryStore`, L10–13 `makerStore` (its `rename` fallback reads text), L19–25 `commitWrites` (tmp files, then rename; a failed write removes the tmps).
4. Maker: `tools/maker/stage.ts` L147 (the stage top bar); `tools/maker/home.ts` L26 (`resumeNotes`), L51 (`openId`, notes read at the open rev), L55 (`copy`, Duplicate), L58 (`saveTrip`), L79 (the "Continued. Since the save" banner), L146 (`continue`).
5. Play stage: `tools/play-stage/hud.ts` L13 (`#note`) and L37 (render); `tools/play-stage/board.ts` L122 (`bare`) and L132–139 (`scene()`).
6. QA: `docs/qa/step-09a-r1-review.md` (sha256 `429c01e2…`, 46 lines) L26 (no test of its own for the in-play missing branch), L38 (`bmp.close()`), L40 (`board.scene()` identity); the 9a guide L132–137 (For the 9b guide); `docs/rebuild/step-08b.md` L194 (no close button); `docs/qa/step-08a-r1-review.md` L80 (`resumeNotes` at `openId`'s rev).

## Rules
1. **Sniff, don't trust names.** New `tools/play-stage/picture.ts`: `readPicture(bytes)` returns `{ok: true, ext, w, h}` or `{ok: false, sniffed}`. PNG = signature + `IHDR` (size from IHDR). JPG = `FF D8 FF` (size from the first SOF marker). WebP = `RIFF…WEBP` with `VP8 `, `VP8L` or `VP8X` (size from that chunk). An animated file is still its type (APNG `acTL`, WebP `VP8X` with the animation flag); the browser decoder shows frame 0, so there's no code for frames. A known signature whose size can't be read is `damaged <ext>`. Anything else is `gif`, `bmp`, `svg`, `heic`, `avif` or `unknown`. `MAX_SIDE = 4096` (K13's default) and `fits(w, h)` live there too. `picture.ts` is in `tools/play-stage/` so the play stage can use it without importing `tools/maker` (the maker already imports the play stage in `test-launch.ts`).
2. **Refuse before any write.** `addPicture` checks the type, then the size, before it hashes or writes anything. A type refusal returns the row `{code: "uploadTypeUnsupported", severity: "hard", path: fileName, detail: sniffed}` (D29 3) and the line "Can't use <file>: it's a <sniffed> file. Use a PNG, JPG or WebP picture." ("it's not a picture" for `unknown`). A size refusal returns "<file> is too big: W × H px. A picture can be at most 4096 px a side. Nothing was saved." It has **no code** (EA ruling Q1). Neither one changes a file or the rev.
3. **One commit.** The asset id is `asset_<first 16 hex of sha256(bytes)>`. Write in **one** `commitWrites`: the bytes `assets/<id>.<ext>` first, then `planSave`'s writes for `project.json` (the index entry, which also bumps the rev) and the map. If any write fails, the tmp files are removed and no picture is left behind (D29 2: an import never creates a missing file).
4. **Data written.** Index entry `{name: <file name without its extension, at most 64 chars, or "Picture">, ext, origin: {kind: "upload", fileName}, kind: "background"}`. Map: `background.layers` gets `{assetId, depth: 1, repeat: "none"}` at the end. No `fit` or `pixelPerfect` is written, so 9b never creates an `advancedRenderInactive` row; stored ones still show (Rule 6). The bytes are stored as uploaded: no re-encode, no resample.
5. **Byte writer.** `MakerStore.writeBytes(path, bytes)`. `memoryStore` keeps bytes in `bins` (read by `readBlob`, moved by `rename`, listed by `list`, removed by `remove`). `makerStore` writes through `createWritable`, and its `rename` fallback copies bytes, not text. `commitWrites` takes `Write = {path, text} | {path, bytes}`.
6. **Background sheet** (new `tools/maker/art.ts`, wired in `home.ts`). A **Background** button in the stage top bar opens it (`b:open`). The sheet has one row per layer ("Layer N · <name>", with **Remove** `b:del:N`), "No background yet." when there are none, the lines (Rule 7), **Add picture** (`<input type="file" data-art accept="image/png,image/jpeg,image/webp">` in a label, handled by a document `change` listener) and **Close** (`b:close`). A read-only project shows no Add or Remove. A refusal or a failed save shows as the sheet's first line. A failed upload (for example a file that can't be read) shows "Couldn't add <file>: …". Nothing fails silently.
7. **Sheet lines** (`artLines`, recomputed after every open, add and remove): `assetRows` for this map's layer assets, shown with `sentence()` plus ". Test is blocked until it's fixed." when hard, or "." when it's a warning; and `readProject` rows under `<map>#/background` in words: `overCap` "N layers: more than 3. All of them still draw.", `outOfRange` "A scroll speed is outside 0–1. It's drawn as the nearest end.", `advancedRenderInactive` "Cover and Stretch need Advanced render. It's drawn as is."
8. **Stage draft first.** Before any background write, `home.ts` runs `saveStage()`, so unsaved painting is committed and not lost or overwritten. **Remove** takes the layer off the map and keeps the index entry and the file (an unused asset is fine; D29 2). After a successful add or remove, `home.ts` calls `dropUndo()` (a new one-line export in `stage.ts`), which empties the stage's undo stack (EA ruling Q2): every older map snapshot lacks the new layer, so Undo must not restore one.
9. **Duplicate** (`copy()`) reads each file in the source `assets/` with `readBlob` and writes it with the project files in the **same** `commitWrites`.
10. **Note row close (8b).** `#note` becomes `<span id="noteText">` plus `<button id="noteX" aria-label="Close note">`. The `×` comes from CSS `::before`, so `#note`'s `textContent` is still exactly the note (the s9 smoke step 6 depends on it). The button is at least 44 px wide, with `pointer-events:auto` (the row is `none`). A tap hides that note text for the rest of the stage; a different note text shows again.
11. **Resume notes at the current rev (8a).** Drop `resumeNotes`. When Continue's launch succeeds, `beginTest` reads the slot again with `projectHash: rev:<current rev>` and builds the banner from those notes plus the launch notes. So an edit after opening gives "Continued. Since the save: the project changed".
12. **Loader (9a carries).** Move the per-layer body of `page.ts` L60–66 into `backdrop.ts` as `loadLayer(layer, art, open, keep)`: read the blob ("Background picture missing: <file>"); `readPicture` (not a picture → "couldn't be opened"); over `MAX_SIDE` → "Background picture <file> is too big to open (W × H px)" **without decoding**; decode; read width and height; `keep` (copy to the OffscreenCanvas); **`close()` the bitmap in a `finally`**. Any throw → "Background picture <file> couldn't be opened". `page.ts` pushes each miss to the note row and adds 1 to `driver.stats.failed`, in layer order. The 9a texts are unchanged.
13. **Scene identity (9a carry).** `board.scene()` keeps one `assets` object while the units' sprite list is the same, and drops it when `bare()` changes the looks. So `world-scene`'s memo (`cached.assets === world.assets`) holds between frames.
14. **Layers.** Nothing in `src/` changes; no game rules go in src/core or src/sim; the maker only writes data. `tools/play-stage` never imports `tools/maker`. `levels.ts` and `match.ts` aren't edited, so `levels.ts` L64 and `match.ts:80` `landed('')` stay open (see Carries).

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `tools/play-stage/picture.ts` | new: `readPicture`, `MAX_SIDE`, `fits` (Rule 1) | 35 [25] |
| `tools/play-stage/backdrop.ts` | `loadLayer`, `Bitmap`, `Loaded` (Rule 12) | 18 [13] |
| `tools/play-stage/page.ts` | call `loadLayer`; misses in order (Rule 12) | 12 [2+ 7−] |
| `tools/play-stage/board.ts` | `shared` assets; reset in `bare()` (Rule 13) | 12 [5+ 3−] |
| `tools/play-stage/hud.ts` | note close (Rule 10) | 12 [5+ 4−] |
| `tools/maker/store.ts` | `writeBytes`, `bins`, `Write`, byte-safe rename (Rule 5) | 24 [9+ 8−] |
| `tools/maker/art.ts` | new: `addPicture`, `dropLayer`, `artLines`, `artSheet` (Rules 2–4, 6–8) | 70 [55] |
| `tools/maker/home.ts` | sheet wiring, upload, Duplicate, resume, `dropUndo` call (Rules 6, 8, 9, 11) | 32 [15+ 10−] |
| `tools/maker/stage.ts` | Background button; `dropUndo` export (Rule 8) | 6 [3+ 1−] |
| `tests/editor/art-upload.test.ts` | new, named tests 1–6 | 100 [82] |
| `handoff/steps/tests/s9b-art-upload/smoke.mjs` | new smoke | 70 [57] |
| **Total** | caps sum to 391 | **400 hard gate [304]** |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules'`. Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Named tests (`tests/editor/art-upload.test.ts`, on `fixtures/demo.tileproj` in a `memoryStore`)
1. `upload type (D29 3): png, jpg and webp are typed from the bytes with their size, an animated png or webp keeps its type, and anything else is named`: PNG 96×144, an APNG, JPG 640×480, WebP VP8X/VP8L/VP8; gif, bmp, svg, heic, avif, unknown, `damaged png`, `damaged jpg`.
2. `upload (D29 3): the file and its index entry go in one commit, a .jpeg name is stored as jpg, the map gets a layer, and the project still loads clean`: rev + 1, the exact index entry, one `assets/<id>.jpg` holding the same bytes, the layer, no hard `readProject` rows, no `assetRows`; with `project.json.tmp` failing, "Couldn't save…", no bytes left, rev unchanged.
3. `upload refusals write nothing: other types are uploadTypeUnsupported {fileName, sniffed}, and a picture over 4096 px a side is refused before any decode (Law 13)`: a GIF named `cat.png` (exact line and row) and a 5000×10 PNG header (exact line); the store is unchanged.
4. `background sheet: lines show this map's D29 asset rows (hard when a played stage uses it), and Remove takes the layer off but keeps the asset`.
5. `play stage layer loader: missing, too big and undecodable files are each named and drawn as nothing, and a drawn layer's bitmap is closed`: a null blob and no `art` give the 9a missing text (the in-play branch QA L26 asked to test); 4097×8 gives too big with no decode; text gives couldn't be opened; a good PNG gives the row; a `keep` that throws still closes the bitmap; `opened, closed` = `2, 2`.
6. `scene identity: the scene keeps one assets object between frames, and a new one only after bare() changes the looks` (`openCheckpoint` docs, `createMatch`).

## Smoke (`node handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1`)
Builds the dev maker (as s9 does), on 390×844 and 360×844, mobile and touch. It uses `waitForFunction` only, with no `waitForTimeout`.
1. **new**: New → Name it → Create; one project folder.
2. **upload a png, and Undo can't drop it**: stage → paint cell 0,0 Water → Done → Undo is enabled → Background → "No background yet." → upload a 96×144 magenta|cyan PNG named `split.png` → "Layer 1 · split"; one `assets/asset_<16 hex>.png`; the map's layer 0 and the index entry (`ext` png, `origin.fileName` split.png) → Close → **Undo is disabled** ("Nothing to undo"), so it can't drop the layer.
3. **refusals write nothing**: a GIF named `cat.png`, then a 5000×10 PNG header named `wide.png`; each exact line shows, there's still one asset, and `project.json` is byte-for-byte unchanged.
4. **test draws it**: Close → Test → bare floor, at least 500 magenta and 500 cyan px, failed 0.
5. **too big in play is named, and the note closes**: a hand-placed 5000×10 PNG header with a matching hash (so H4 passes) → note "Background picture assets/<id>.png is too big to open (5000 × 10 px)", failed ≥ 1 → tap `#noteX` (≥ 44 px) → hidden, and still hidden 5 polls later.
6. **duplicate copies the pictures**: home → ⋯ → Duplicate; the copy's `assets/` lists the same two files.
7. **continue after an edit says the project changed**: write a session save at the current rev → open → Continue shows → stage → Background → Remove layer 1 (rev + 1) → Back → Continue → Back to maker → "Continued. Since the save: the project changed".
Expect 14 ok and SMOKE PASS. Shots go to `handback/step-09b-art-upload/r1/` and are not committed.

## Must NOT
- No edits to `src/**`, data, fixtures, behaviour-library, painter-proto, ui-shell, `tools/maker/levels.ts` or `tools/play-stage/match.ts`; no edit to an existing test or smoke.
- No new codes beyond D29's `uploadTypeUnsupported`; no decode, hash or write before the type and size checks; no re-encode, resample, stretch or blur; no new rAF, timer or loop.
- No auto-slice, Shrink to fit, depth slider or Repeat picker (Not in 9b); no gh-pages push or publish.

## Done when
- Green exits 0 at **1141** or more. `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101, maker `home.ts` ×2; the home.ts pair moves from L85 to L88).
- s9b: 14 ok, SMOKE PASS. s9 on 8811 (12 ok), s8 on 8810 (16 ok, file sha `0de37442…`), s8c on 8812 (8 ok), s6d on 8808 (14 ok), S0 on 8797 (sha `d528795e…`, 14 ok), all unedited, all PASS. `node /workspace/share/s8/s8-audit.mjs <worktree>` → AUDIT PASS.

## Measured (trial run, 2026-11-24, a `/tmp` clone at `0436fd50`, never committed or pushed)
- Base: green exit 0, **1135 pass, 0 fail**.
- Trial: green exit 0, **1141 pass, 0 fail** (eslint, depcruise, check:state and check:law clean); tools tsc shows only the 3 base errors.
- Count: 11 files, **271+ 33− (304)**, per the table.
- s9b: **14 ok, SMOKE PASS** at 390 and 360. s9 12 ok, s8 16 ok, s8c 8 ok, s6d 14 ok, S0 14 ok, all PASS; AUDIT PASS.
- Mutations: skipping the asset copy in Duplicate fails s9b step 6 at both widths; using no fresh resume notes fails step 7 at both widths; skipping `dropUndo()` fails step 2 ("undo still on") at both widths. The test file imports `art.ts`, `loadLayer` and `picture.ts`, which don't exist on the base; test 6 alone fails on the base (a new `assets` object every call).
- Trial patch: `/workspace/share/s9b/s9b-trial.patch` (sha256 `b0acc887d2be95af4c343a4ca308d2eec9542665e668f77313fe950f809d824f`, 519 lines, 11 files; it excludes `handback/`). It applies cleanly to a fresh `0436fd50` worktree, and green gives 1141/0.

## Carries
**Closed here:** D29 (3) uploads; stage Undo vs background writes (EA ruling Q2); Law 13 for backgrounds (the upload cap, and a header check before any decode in Test); Duplicate copies `assets/`; the 8b note-row close; 8a resume notes at `openId`'s rev; the 9a carries `bmp.close()`, the in-play missing test and `board.scene()` identity.
**Still open, not 9b scope:**
- `levels.ts` L64 unreachable narrowing; `match.ts:80` `landed('')`: the next run that edits those files.
- The project screen still shows Rules 8 rows only through Test; 9b shows them on the Background sheet for that map.
- Not in 9b (Goal): K6 pages, K14 Shrink to fit, the exact-size check, the Scroll speed and Repeat controls, Cover/Stretch, the 8192 toggle and `settings.maxImageSide` (9b uses the fixed 4096), the memory meter, the export shipping assets (step 11).
- DSK: note at next format revision that the K6 slice-on-import is deferred; until then upload refuses >4096 px a side; settings.maxImageSide and the 8192 PC toggle come later.

## EA rulings (2026-11-24, 22:47)
- **Q1 (size cap at upload):** 9b blocks at upload because nothing can slice yet; K6 slicing comes later. Uploads over 4096 px a side are refused with the plain line and no new code (Rule 2). Test names an oversize hand-placed file and doesn't decode it (Rule 12). See the DSK carry above.
- **Q2 (Undo):** a background change (adding or removing a layer) clears the stage's undo stack (Rule 8; smoke step 2).
